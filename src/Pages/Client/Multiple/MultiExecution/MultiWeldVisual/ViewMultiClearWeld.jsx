import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';


const ViewMultiClearWeld = () => {
  const location = useLocation();
  const data = location.state;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  // QC-like states
  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (data?._id) {
      const show =
        data?.client_status === 1 && data?.status !== 1 ? false : true;
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
        `${V_URL}/party/get-weldvisual-inspection-item`,
        {
          weldVisualId: data._id,
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

  /* ================= AUTO LOAD PDF ================= */
  useEffect(() => {
    fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  /* ================= RANDOM WITNESSED PREP ================= */
  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => ({
        _id: item._id,

        drawing_no: item?.grid_item_id?.drawing_id?.drawing_no || '-',
        rev_no: '-',
        sheet_no: item?.grid_item_id?.drawing_id?.sheet_no || '-',
        assembly_no: item?.grid_item_id?.drawing_id?.assembly_no || '-',
        grid_no: item?.grid_item_id?.grid_id?.grid_no || '-',
        grid_qty: item?.weld_used_grid_qty || 0,
        item_no: item?.grid_item_id?.item_no || '-',
        item_qty: item?.weld_used_grid_qty || 0,
        profile: item?.grid_item_id?.item_name?.name || '-',
        imir_no: '-',
        heat_no: '-',
        joint_type: item?.joint_type?.map(j => j.name).join(', ') || '-',

        selected: false,
        remark: item?.remarks || '',
      })) || [];

    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };

  /* ================= SELECT / DESELECT ================= */
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

  /* ================= UPDATE STATUS ================= */
  const submitWeldStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }

    try {
      const payload = {
        weldId: data._id,
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

        payload.items = randomItems.map((i) => ({
          _id: i._id,
          selected: i.selected === true,
          remark: i.remark,
        }));
      }

      const res = await axios.post(
        `${V_URL}/party/weldvisual-review-update`,
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
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch {
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
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">View Weld Visual Clearance</li>
            </ul>
          </div>

          {/* ===== Weld Visual Details ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Weld Visual Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input className="form-control" value={data?.report_no_two || '-'} readOnly />
                </div>

                <div className="col-md-4">
                  <label>Offered By</label>
                  <input className="form-control" value={data?.offered_by?.user_name || '-'} readOnly />
                </div>

                <div className="col-md-4">
                  <label>Created Date</label>
                  <input
                    className="form-control"
                    value={moment(data?.createdAt).format('YYYY-MM-DD')}
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
                    <button className="btn btn-primary me-2" onClick={() => submitWeldStatus('REVIEWED')}>
                      REVIEWED
                    </button>

                    <button className="btn btn-warning me-2" onClick={() => submitWeldStatus('WITNESSED')}>
                      WITNESSED
                    </button>

                    <button className="btn btn-success" onClick={prepareRandomWitnessedItems}>
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {/* ===== PDF ===== */}
              {loadingPdf && <div className="mt-4 alert alert-info">Loading PDF...</div>}

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

              {/* ===== RANDOM WITNESSED TABLE ===== */}
              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-3">
                  <div style={{ overflowX: 'auto', border: '1px solid #ddd', padding: 5 }}>
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
                          <th>REV</th>
                          <th>SHEET</th>
                          <th>ASSEMBLY</th>
                          <th>GRID</th>
                          <th>GRID QTY</th>
                          <th>ITEM NO</th>
                          <th>ITEM QTY</th>
                          <th>PROFILE</th>
                          <th>IMIR</th>
                          <th>HEAT</th>
                          <th>JOINT TYPE</th>
                          <th>REMARK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {randomItems.map((item, i) => (
                          <tr key={item._id}>
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
                    onClick={() => submitWeldStatus('RANDOM WITNESSED')}
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

export default ViewMultiClearWeld;