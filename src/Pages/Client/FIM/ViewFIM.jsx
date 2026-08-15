import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../BaseUrl';

const ViewFIM = () => {
  const location = useLocation();
  const data = location.state;
  console.log("data ", data)
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [clientDate, setClientDate] = useState('');
  const [showOption, setShowOption] = useState(true);

  // 🔹 RANDOM WITNESSED STATES
  const [randomItems, setRandomItems] = useState([]);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  /* ================= BUTTON VISIBILITY ================= */

    useEffect(() => {
      if (data?._id) {
        const show =
          data?.client_status === 1 && data?.status !== 1 ? false : true;
        setShowButtons(show);
      }
    }, [data?._id]);

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setPdfLoading(true);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const res = await axios.post(
        `${V_URL}/party/fim/download-fim-imir-client`,
        { fim_id: data?._id },
        {
          responseType: 'blob',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      const blob = new Blob([res.data], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
    } catch {
      toast.error('Failed to load PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  /* ================= RANDOM WITNESSED ================= */
  const handleRandomWitnessed = () => {
    const items =
      data?.items?.map((item) => ({
        _id: item._id,
        item_name: item.item_id?.name,
        material_grade: item.item_id?.material_grade,
        manufacture: item.manufacture,
        inspected_weight: item.inspected_weight,
        inspected_nos: item.inspected_nos,
        heat_no: item.heat_no,
        tc_no: item.tc_no,
        status: item.status === 1 ? 'Accepted' : 'Rejected',
        selected: item.selected === true ? true : false,
        remark: item.remarks || '',
      })) || [];

    setRandomItems(items);
    setShowRandomItems(true);
  };

    useEffect(() => {
        if(data?.elem?._id){
          const show = data?.elem?.client_status === 1 && data?.elem?.status_type !== null ? false : true;
          setShowOption(show);
        }
    })
  const handleItemChange = (index, field, value) => {
    const updated = [...randomItems];
    updated[index][field] = value;
    setRandomItems(updated);

    if (field === 'selected') {
      setSelectAll(updated.every((i) => i.selected));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setRandomItems(randomItems.map((i) => ({ ...i, selected: checked })));
  };

  /* ================= SUBMIT ================= */
  const submitFimUpdate = async (statusType) => {
    try {
      if (!clientDate) {
        toast.error('Please select date');
        return;
      }

      const payload = {
        fimId: data?._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem('PARTY_ID'),
      };

      if (statusType === 'RANDOM WITNESSED') {
        payload.items = randomItems.map((i) => ({
          _id: i._id,
          selected: i.selected === true,
          remark: i.remark,
        }));
      }

      const res = await axios.post(
        `${V_URL}/party/fim/update-client-staus`,
        payload,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      if (res.data.success) {
        toast.success('Updated Successfully');
        setShowRandomItems(false);
        setShowOption(false);
        navigate('/party/project-store/fim-packing');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* ================= BREADCRUMB ================= */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/party/project-store/fim-packing">FIM</Link>
                </li>
               <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item active">View FIM Packing</li>

            </ul>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="card">
            <div className="card-body">
              <h4>FIM Packing Details</h4>
              <div className="row">
                {[
                  ['Packing No', data?.packing_no],
                  ['Packing Date', moment(data?.packing_date).format('YYYY-MM-DD')],
                  ['Supplier', data?.supplier],
                  ['Vehicle No', data?.vehicle_number],
                ].map(([l, v]) => (
                  <div key={l} className="col-md-4">
                    <label>{l}</label>
                    <input className="form-control" value={v || '-'} readOnly />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= PDF + ACTION ================= */}
          <div className="card mt-3">
            <div className="card-body">
              <h4>FIM Inspection PDF</h4>

              {showButtons && (
                <>
                  <div className="col-md-4 mb-2">
                    <label>Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={clientDate}
                      onChange={(e) => setClientDate(e.target.value)}
                    />
                  </div>

                  <button className="btn btn-primary me-2" onClick={() => submitFimUpdate('REVIEWED')}>
                    REVIEWED
                  </button>
                  <button className="btn btn-warning me-2" onClick={() => submitFimUpdate('WITNESSED')}>
                    WITNESSED
                  </button>
                  <button className="btn btn-success" onClick={handleRandomWitnessed}>
                    RANDOM WITNESSED
                  </button>
                </>
              )}

              {pdfLoading && <div className="text-center py-3">
                      <strong>Loading PDF...</strong>
                    </div>}

              {pdfUrl && !pdfLoading && (
                <iframe
                  src={`${pdfUrl}#toolbar=1`}
                  width="100%"
                  height="700px"
                  title="FIM PDF"
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              )}

              {/* ================= RANDOM TABLE ================= */}
              {showRandomItems && (
                <>
                  <div className="table-responsive mt-3">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </th>
                          <th>Sr</th>
                          <th>Item</th>
                          <th>Grade</th>
                          <th>Manufacturer</th>
                          <th>Inspected Wt</th>
                          <th>Inspected Nos</th>
                          <th>Heat No</th>
                          <th>TC No</th>
                          <th>Status</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {randomItems.map((item, i) => (
                          <tr key={i}>
                            <td>
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={(e) =>
                                  handleItemChange(i, 'selected', e.target.checked)
                                }
                              />
                            </td>
                            <td>{i + 1}</td>
                            <td>{item.item_name}</td>
                            <td>{item.material_grade}</td>
                            <td>{item.manufacture}</td>
                            <td>{item.inspected_weight}</td>
                            <td>{item.inspected_nos}</td>
                            <td>{item.heat_no}</td>
                            <td>{item.tc_no}</td>
                            <td>{item.status}</td>
                            <td>
                              <input
                                className="form-control"
                                value={item.remark}
                                onChange={(e) =>
                                  handleItemChange(i, 'remark', e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    className="btn btn-success mt-2"
                    onClick={() => submitFimUpdate('RANDOM WITNESSED')}
                  >
                    Submit Random Witnessed
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewFIM;
