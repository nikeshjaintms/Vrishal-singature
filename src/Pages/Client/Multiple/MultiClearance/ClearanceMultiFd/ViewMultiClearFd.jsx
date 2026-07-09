import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';

const ViewMultiClearFd = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  console.log('Final Dimension Data:', data);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  // SAME STATES AS FITUP
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
        `${V_URL}/party/get-final-dimension-inspection-item`,
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

  /* ================= RANDOM WITNESSED PREP (FD DATA) ================= */
  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => ({
        _id: item._id,

        drawing_no: item?.drawing_id?.drawing_no || '-',
        rev_no: item?.drawing_id?.rev ?? '-',
        sheet_no: item?.drawing_id?.sheet_no || '-',
        assembly_no: item?.drawing_id?.assembly_no || '-',

        grid_no: item?.grid_id?.grid_no || '-',
        grid_qty: item?.fd_used_grid_qty || 0,

        item_no: item?.grid_id?.grid_no || '-',
        item_qty: item?.fd_used_grid_qty || 0,

        profile: '-',
        imir_no: '-',
        heat_no: '-',
        joint_type: '-',

        selected: false,
        remark: item?.remarks || '',
      })) || [];

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
  const submitFdStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }

    try {
      const payload = {
        fdId: data._id,
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
        `${V_URL}/party/final-dimension-review-update`,
        payload,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      if (res.data.success) {
        toast.success('Final Dimension updated successfully');
        setShowRandomItems(false);
        fetchPdf();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  /* ================= UI (UNCHANGED) ================= */
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
              <li className="breadcrumb-item active">
                View Final Dimension Clearance
              </li>
            </ul>
          </div>

          {/* ===== DETAILS ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Final Dimension Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input
                    className="form-control"
                    value={data.report_no_two || '-'}
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
                    value={moment(data.createdAt).format('YYYY-MM-DD')}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== CLIENT REVIEW (UNCHANGED) ===== */}
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
                      onClick={() => submitFdStatus('REVIEWED')}
                    >
                      REVIEWED
                    </button>

                    <button
                      className="btn btn-warning me-2"
                      onClick={() => submitFdStatus('WITNESSED')}
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
                    title="Final Dimension Inspection PDF"
                    width="100%"
                    height="700px"
                    style={{ border: '1px solid #ccc' }}
                  />
                </div>
              )}

              {/* ===== RANDOM WITNESSED TABLE (UNCHANGED GUI) ===== */}
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
                          <th>SHEET NO</th>
                          <th>ASSEMBLY NO</th>
                          <th>GRID NO</th>
                          <th>GRID QTY</th>
                          <th>ITEM NO</th>
                          <th>ITEM QTY</th>
                          <th>PROFILE</th>
                          <th>IMIR NO</th>
                          <th>HEAT NO</th>
                          <th>JOINT TYPE</th>
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
                                onChange={(e) =>
                                  handleItemChange(index, 'selected', e.target.checked)
                                }
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item.drawing_no}</td>
                            <td>{item.rev_no}</td>
                            <td>{item.sheet_no}</td>
                            <td>{item.assembly_no}</td>
                            <td>{item.grid_no}</td>
                            <td>{item.grid_qty}</td>
                            <td>{item.item_no}</td>
                            <td>{item.item_qty}</td>
                            <td>{item.profile}</td>
                            <td>{item.imir_no}</td>
                            <td>{item.heat_no}</td>
                            <td>{item.joint_type}</td>
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
                    onClick={() => submitFdStatus('RANDOM WITNESSED')}
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

export default ViewMultiClearFd;
