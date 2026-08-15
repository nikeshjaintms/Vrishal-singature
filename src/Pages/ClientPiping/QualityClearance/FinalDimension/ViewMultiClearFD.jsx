import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { V_URL } from '../../../../BaseUrl';

const ViewMultiClearFD = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state; // contains FD report object

  console.log('FD Data:', data);
  const [fdData, setFdData] = useState(data);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const fetchFDDetails = async () => {
    try {
      const res = await axios.post(
        `${V_URL}/party/get-piping-fd-master-client`,
        {
          project: localStorage.getItem('PARTY_PROJECT_ID'),
          search: data?.report_no_two || data?.report_no,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );
      if (res.data?.success && Array.isArray(res.data?.data)) {
        const matched = res.data.data.find((item) => item._id === data._id);
        if (matched) {
          setFdData(matched);
        }
      }
    } catch (err) {
      console.error('Failed to fetch detailed FD data', err);
    }
  };

  useEffect(() => {
    if (data?._id) {
      const show = data?.client_status === 1 && data?.status_type !== null ? false : true;
      setShowButtons(show);
      fetchFDDetails();
    }
  }, [data?._id]);

  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setLoadingPdf(true);

      // cleanup previous pdf
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl('');
      }

      const res = await axios.post(
        `${V_URL}/party/download-piping-fd-master-client`,
        {
          report_no_two: data.report_no_two || data.report_no,
          report_no: data.report_no || data.report_no_two,
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
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    } catch (err) {
      toast.error('Failed to load PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  /* ================= AUTO LOAD PDF ================= */
  useEffect(() => {
    if (data?.report_no_two || data?.report_no) {
      fetchPdf();
    }
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  /* ================= RANDOM WITNESSED PREP ================= */
  const prepareRandomWitnessedItems = () => {
    let items = [];
    if (Array.isArray(fdData?.items)) {
      items = fdData.items;
    }

    const mappedItems = items.map((item) => ({
      _id: item?._id || item?.item_id,
      drawing_no: item?.drawing_no || '-',
      spool_no: item?.spool_no || '-',
      required_dimension: item?.required_dimension || '-',
      actual_dimension: item?.actual_dimension || '-',
      status: item?.is_accepted === true ? 'Accepted' : item?.is_accepted === false ? 'Rejected' : 'Pending',
      selected: false,
    }));

    setRandomItems(mappedItems);
    setSelectAll(false);
    setShowRandomItems(true);
  };

  /* ================= SELECT / DESELECT ================= */
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...randomItems];
    updatedItems[index][field] = value;
    setRandomItems(updatedItems);

    if (field === 'selected') {
      const allChecked = updatedItems.every((item) => item.selected);
      setSelectAll(allChecked);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    const updatedItems = randomItems.map((item) => ({ ...item, selected: checked }));
    setRandomItems(updatedItems);
  };

  /* ================= UPDATE STATUS ================= */
  const submitFDStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }

    try {
      const payload = {
        fdmasterId: data._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem('PARTY_ID'),
      };

      // RANDOM WITNESSED requires items
      if (statusType === 'RANDOM WITNESSED') {
        if (randomItems.length === 0) {
          prepareRandomWitnessedItems();
          toast.error('Please select items for Random Witnessed');
          return;
        }

        payload.items = randomItems.map((item) => ({
          _id: item._id,
          selected: item.selected === true,
        }));
      }

      const res = await axios.post(`${V_URL}/party/update-piping-fd-master-status`, payload, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
        },
      });

      if (res.data.success) {
        toast.success('Final Dimension Clearance updated successfully');
        setShowRandomItems(false);
        fetchPdf();
        navigate("/party/piping-store/final-dimension-clearance-management");
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
          {/* ===== Breadcrumb ===== */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/piping-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
              <li className="breadcrumb-item">
                <Link to="/party/piping-store/final-dimension-clearance-management">Final Dimension Acceptance</Link>
              </li>
              <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
              <li className="breadcrumb-item active">View Final Dimension Clearance</li>
            </ul>
          </div>

          {/* ===== FD Details ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Final Dimension Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input className="form-control" value={data?.report_no_two || data?.report_no || '-'} readOnly />
                </div>

                <div className="col-md-4">
                  <label>QC By</label>
                  <input className="form-control" value={data?.qc_by?.name || data?.qc_by?.user_name || (typeof data?.qc_by === 'string' ? data?.qc_by : null) || data?.qc_name || '-'} readOnly />
                </div>

                <div className="col-md-4">
                  <label>QC Date</label>
                  <input
                    className="form-control"
                    value={data?.qc_date ? moment(data.qc_date).format('YYYY-MM-DD') : '-'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== Client Review ===== */}
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
                    <button className="btn btn-primary me-2" onClick={() => submitFDStatus('REVIEWED')}>
                      REVIEWED
                    </button>

                    <button className="btn btn-warning me-2" onClick={() => submitFDStatus('WITNESSED')}>
                      WITNESSED
                    </button>

                    <button className="btn btn-success" onClick={prepareRandomWitnessedItems}>
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {/* ===== PDF VIEW ===== */}
              {loadingPdf && <div className="mt-4 alert alert-info">Loading PDF...</div>}

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

              {/* ===== RANDOM WITNESSED TABLE ===== */}
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
                          <th>SPOOL NO</th>
                          <th>REQUIRED DIMENSION </th>
                          <th>ACTUAL DIMENSION </th>
                          <th>STATUS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {randomItems.map((item, index) => (
                          <tr key={item._id || index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={(e) => handleItemChange(index, 'selected', e.target.checked)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item.drawing_no}</td>
                            <td>{item.spool_no}</td>
                            <td>{item.required_dimension}</td>
                            <td>{item.actual_dimension}</td>
                            <td>{item.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button className="btn btn-success mt-2" onClick={() => submitFDStatus('RANDOM WITNESSED')}>
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

export default ViewMultiClearFD;
