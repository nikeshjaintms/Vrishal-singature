import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';

const ViewMultiClearPMI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state; // contains PMI report object

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (data?._id) {
      const show = data?.client_status === 1 || data?.client_status > 0 || data?.status_type ? false : true;
      setShowButtons(show);
    }
  }, [data]);

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

      const bodyFormData = new URLSearchParams();
      if (data?.report_no) bodyFormData.append('report_no', data.report_no);
      if (data?.report_no_two) bodyFormData.append('report_no_two', data.report_no_two);
      bodyFormData.append('print_date', clientDate || 'true');

      const res = await axios.post(
        `${V_URL}/party/download-piping-pmi-client`,
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${localStorage.getItem('PARTY_TOKEN')}`,
          },
          responseType: 'blob',
        }
      );

      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    } catch (err) {
      console.error('PMI PDF fetch error:', err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= RANDOM WITNESSED PREP ================= */
  const prepareRandomWitnessedItems = () => {
    if (!Array.isArray(data?.items) || data.items.length === 0) {
      toast.error('No items found in inspection');
      return;
    }

    const items = data.items.map((item) => ({
      _id: item._id,
      drawing_no: item?.drawing_id?.drawing_no || item?.drawing_no || '-',
      sheet_no: item?.drawing_id?.sheet_no || item?.sheet_no || '-',
      rev: item?.drawing_id?.rev || item?.rev || '-',
      spool_no: item?.spool_no_id?.spool_no || item?.spool_no || '-',
      joint_no: item?.joint_spool_item_id?.joint_no || item?.joint_no || '-',
      selected: false,
      remark: item?.remarks || '',
    }));

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
  const submitPmiStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }

    try {
      const payload = {
        id: data?._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem('PARTY_ID'),
      };

      if (statusType === 'RANDOM WITNESSED') {
        payload.items = randomItems.map((item) => ({
          _id: item._id,
          selected: item.selected === true,
          remark: item.remark,
        }));
      }

      const res = await axios.post(`${V_URL}/party/update-piping-pmi-status`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('PARTY_TOKEN')}`,
        },
      });

      if (res.data.success) {
        toast.success('PMI Clearance updated successfully');
        setShowRandomItems(false);
        fetchPdf();
        navigate('/party/piping-store/pmi-clearance-management');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  /* ================= UI ================= */
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
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item">
                <Link to="/party/piping-store/pmi-clearance-management">PMI Acc / Rej</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item active">View PMI Clearance Summary</li>
            </ul>
          </div>

          {/* ===== PMI Details ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">PMI Clearance Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input
                    className="form-control"
                    value={data?.report_no || data?.report_no_two || '-'}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Prepared By / QC By</label>
                  <input
                    className="form-control"
                    value={
                      data?.qc_by?.user_name ||
                      data?.qc_by?.name ||
                      (typeof data?.qc_by === 'string' ? data?.qc_by : '-')
                    }
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>QC Date / Created Date</label>
                  <input
                    className="form-control"
                    value={
                      data?.qc_date
                        ? moment(data.qc_date).format('YYYY-MM-DD')
                        : data?.createdAt
                        ? moment(data.createdAt).format('YYYY-MM-DD')
                        : '-'
                    }
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
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => submitPmiStatus('REVIEWED')}
                    >
                      REVIEWED
                    </button>

                    <button
                      className="btn btn-warning me-2"
                      onClick={() => submitPmiStatus('WITNESSED')}
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

              {/* ===== PDF VIEW ===== */}
              {loadingPdf && <div className="mt-4 alert alert-info">Loading PDF...</div>}

              {pdfUrl && (
                <div className="mt-4">
                  <iframe
                    src={pdfUrl}
                    title="PMI Inspection PDF"
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
                          <th>#</th>
                          <th>Drawing</th>
                          <th>Rev</th>
                          <th>Spool</th>
                          <th>Joint</th>
                          <th>Remark</th>
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
                            <td>{item.rev}</td>
                            <td>{item.spool_no}</td>
                            <td>{item.joint_no}</td>
                            <td>
                              <input
                                className="form-control"
                                value={item.remark}
                                onChange={(e) => handleItemChange(index, 'remark', e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button className="btn btn-success mt-2" onClick={() => submitPmiStatus('RANDOM WITNESSED')}>
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

export default ViewMultiClearPMI;
