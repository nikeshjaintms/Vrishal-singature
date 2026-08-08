import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';

const ViewMultiClearWeldVisual = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  console.log('Weld Visual Data:', data);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  // STATES FOR RANDOM WITNESSED
  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (data?._id) {
      const show =
        data?.client_status === 1 && data?.status_type !== null ? false : true;
      setShowButtons(show);
    }
  }, [data?._id]);

  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setLoadingPdf(true);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl('');
      }

      const res = await axios.post(
        `${V_URL}/party/get-weld-inspection-item`,
        {
          fdId: data._id,
          report_no_two: data.report_no_two,
          print_date: clientDate,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
          responseType: 'blob',
        }
      );

      const file = new Blob([res.data], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(file));
    } catch (err) {
      toast.error('Failed to load PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  useEffect(() => {
    fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  /* ================= RANDOM WITNESSED PREP ================= */
  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => {
        const drawing = item?.grid_item_id?.drawing_id || item?.drawing_id;
        return {
          _id: item._id,
          drawing_no: drawing?.drawing_no || '-',
          rev_no: drawing?.rev ?? '-',
          assembly_no: drawing?.assembly_no || '-',
          assembly_quantity: drawing?.assembly_quantity || 0,
          wps_no: item?.wps_no?.wpsNo || '-',
          weldingProcess: item?.wps_no?.weldingProcess || '-',
          welder_no: item?.weldor_no?.welderNo || '-',
          selected: false,
          remark: item?.remarks || '',
        };
      }) || [];

    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };

  /* ================= SELECT / DESELECT ================= */
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...randomItems];
    updatedItems[index][field] = value;
    setRandomItems(updatedItems);

    if (field === 'selected') {
      setSelectAll(updatedItems.every((item) => item.selected));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setRandomItems(randomItems.map((item) => ({ ...item, selected: checked })));
  };

  /* ================= UPDATE STATUS ================= */
  const submitStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }

    try {
      const payload = {
        weldinspectionId: data._id, // Assumed backend param matches similar structures
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem('PARTY_ID'),
      };

      if (statusType === 'RANDOM WITNESSED') {
        if (randomItems.length === 0) {
          prepareRandomWitnessedItems();
          toast.error('Please select items for Random Witnessed');
          return;
        }

        payload.items = randomItems.map((item) => ({
          _id: item._id,
          selected: item.selected === true,
          remark: item.remark,
        }));
      }

      const res = await axios.post(
        `${V_URL}/party/weld-review-update`,
        payload,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      if (res.data.success) {
        toast.success('Weld Visual updated successfully');
        setShowRandomItems(false);
        fetchPdf();
        navigate("/party/project-store/weld-visual-management");
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
              <li className="breadcrumb-item">
                <Link to="/party/project-store/weld-visual-management">Weld Visual Clearance List</Link>
              </li>
              <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
              <li className="breadcrumb-item active">
                View Weld Visual Clearance
              </li>
            </ul>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Weld Visual Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input
                    className="form-control"
                    value={data?.report_no_two || '-'}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Offered By</label>
                  <input
                    className="form-control"
                    value={data?.offered_by?.user_name || '-'}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Created Date</label>
                  <input
                    className="form-control"
                    value={data?.createdAt ? moment(data.createdAt).format('YYYY-MM-DD') : '-'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h4 className="mb-3">Client Review</h4>

              {showButtons && (
                <>
                  <div className="col-md-4 mb-3">
                    <label>
                      Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={clientDate}
                      onChange={(e) => setClientDate(e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => submitStatus('REVIEWED')}
                    >
                      REVIEWED
                    </button>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => submitStatus('WITNESSED')}
                    >
                      WITNESSED
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={prepareRandomWitnessedItems}
                    >
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {loadingPdf && (
                <div className="mt-4 alert alert-info">Loading PDF...</div>
              )}

              {pdfUrl && (
                <div className="mt-4">
                  <iframe
                    src={pdfUrl}
                    title="Weld Visual Inspection PDF"
                    width="100%"
                    height="700px"
                    style={{ border: '1px solid #ccc' }}
                  />
                </div>
              )}

              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-3">
                  <div style={{ overflowX: 'auto', border: '1px solid #ddd', padding: '5px', borderRadius: '6px' }}>
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                          </th>
                          <th>SR NO</th>
                          <th>DRAWING NO</th>
                          <th>REV. NO</th>
                          <th>ASSEMBLY NO</th>
                          <th>ASSEMBLY QTY</th>
                          <th>WPS NO</th>
                          <th>WELDER NO</th>
                          <th>REMARK</th>
                        </tr>
                      </thead>

                      <tbody>
                        {randomItems.map((item, index) => (
                          <tr key={item._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={(e) => handleItemChange(index, 'selected', e.target.checked)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item.drawing_no}</td>
                            <td>{item.rev_no}</td>
                            <td>{item.assembly_no}</td>
                            <td>{item.assembly_quantity}</td>
                            <td>{item.wps_no}</td>
                            <td>{item.welder_no}</td>
                            <td>
                              <input
                                className="form-control"
                                value={item.remark}
                                onChange={(e) =>
                                  handleItemChange(index, 'remark', e.target.value)
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
                    onClick={() => submitStatus('RANDOM WITNESSED')}
                  >
                    Submit Random Witnessed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewMultiClearWeldVisual;
