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
  const navigate = useNavigate();
  console.log("data", data)

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
      // Show buttons if not already acted upon by client
      const show =
        data?.client_status === 1 && data?.status !== 1 ? false : true;
      setShowButtons(show);
      setShowOption(show);
    }
  }, [data?._id, data?.client_status, data?.status]);

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setPdfLoading(true);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const res = await axios.post(
        `${V_URL}/party/download-fim-imir-piping-client`,
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
    if (data?._id) fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [data?._id]);

  /* ================= RANDOM WITNESSED ================= */
  const handleRandomWitnessed = () => {
    const items =
      data?.items?.map((item) => {
        const heatNos = item.heat_rows ? item.heat_rows.map((hr) => hr.heat_lot_no).filter(Boolean).join(', ') : '-';
        const tcNos = item.heat_rows ? item.heat_rows.map((hr) => hr.tc_no).filter(Boolean).join(', ') : '-';
        const makes = item.heat_rows ? item.heat_rows.map((hr) => hr.make_manufacture).filter(Boolean).join(', ') : (item.make_manufacture ? item.make_manufacture.join(', ') : '-');

        return {
          _id: item._id,
          fim_lot_no: data?.fim_lot_no || data?.rgp_no || '-',
          item_name: item.item_id?.item_name || item.item_id?.name || '-',
          item_description: item.item_id?.item_description || '-',
          size1: typeof item.item_id?.size1 === 'object' ? item.item_id?.size1?.name : (item.item_id?.size1 || '-'),
          thickness1: typeof item.item_id?.thickness1 === 'object' ? item.item_id?.thickness1?.name : (item.item_id?.thickness1 || '-'),
          size2: typeof item.item_id?.size2 === 'object' ? item.item_id?.size2?.name : (item.item_id?.size2 || '-'),
          thickness2: typeof item.item_id?.thickness2 === 'object' ? item.item_id?.thickness2?.name : (item.item_id?.thickness2 || '-'),
          material_grade: item.item_id?.material_grade || '-',
          make_manufacture: makes,
          supplier: data?.supplier || '-',
          uom: item.item_id?.uom || '-',
          accepted_qty: item.received_qty || item.fim_list_qty || '-',
          rejected_qty: 0,
          heat_lot_no: heatNos,
          tc_no: tcNos,
          invoice_no: data?.package_list_no || data?.packing_no || '-',
          status: item.status === 1 ? 'Pending' : item.status === 2 ? 'Accepted' : 'Rejected',
          selected: item.selected === true ? true : false,
          remark: item.remarks || '',
        };
      }) || [];

    setRandomItems(items);
    setShowRandomItems(true);
  };

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
        `${V_URL}/party/update-fim-piping-client-status`,
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
        navigate('/party/piping-store/fim-packing-list');
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
                <Link to="/party/piping-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item ">
                <Link to="/party/piping-store/fim-packing-list">FIM Packing List</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item active">View FIM Packing</li>
            </ul>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-heading">
                    <h4>FIM Packing Details</h4>
                  </div>
                  <div className="row">
                    {[
                      { label: 'Package List No / Invoice No', value: data?.package_list_no || data?.packing_no },
                      { label: 'Package List Date', value: moment(data?.packing_date).format('YYYY-MM-DD') },
                      { label: 'RGP No', value: data?.rgp_no },
                      { label: 'FIM Lot No', value: data?.fim_lot_no },
                      { label: 'Supplier', value: data?.supplier },
                      { label: 'Vehicle Number', value: data?.vehicle_number },
                      { label: 'Receiving Date', value: moment(data?.receiving_date).format('YYYY-MM-DD') },
                      { label: 'Received By', value: data?.received_by?.user_name || "-" },
                    ].map(({ label, value }) => (
                      <div key={label} className="col-12 col-md-4 col-xl-4 mb-3">
                        <label>{label}</label>
                        <input className="form-control" value={value || '-'} readOnly />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PDF + ACTION ================= */}
          <div className="card mt-3">
            <div className="card-body">
              <h4>FIM Inspection PDF</h4>

              {showButtons && (
                <>
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label>Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={clientDate}
                        onChange={(e) => setClientDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <button className="btn btn-primary me-2" onClick={() => submitFimUpdate('REVIEWED')}>
                      REVIEWED
                    </button>
                    <button className="btn btn-warning me-2" onClick={() => submitFimUpdate('WITNESSED')}>
                      WITNESSED
                    </button>
                    <button className="btn btn-success" onClick={handleRandomWitnessed}>
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {pdfLoading && (
                <div className="text-center py-3">
                  <strong>Loading PDF...</strong>
                </div>
              )}

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
                          <th>Description</th>
                          <th>Size 1</th>
                          <th>Thk 1</th>
                          <th>Grade</th>
                          <th>Make</th>
                          <th>Accepted Qty</th>
                          <th>Heat/Lot No</th>
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
                            <td>{item.item_description}</td>
                            <td>{item.size1}</td>
                            <td>{item.thickness1}</td>
                            <td>{item.material_grade}</td>
                            <td>{item.make_manufacture}</td>
                            <td>{item.accepted_qty}</td>
                            <td>{item.heat_lot_no}</td>
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
