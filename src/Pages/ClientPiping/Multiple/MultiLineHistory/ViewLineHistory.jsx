import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { downloadLHSForClient, updateLHSClientStatus } from '../../../../Store/Client/Piping/getClientPipingMultiLHS';

const ViewLineHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const data = location.state; // contains LHS object

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [clientDate, setClientDate] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [showButtons, setShowButtons] = useState(true);

    // Random Witness State
    const [randomItems, setRandomItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showRandomItems, setShowRandomItems] = useState(false);

    const { downloadLoading, updateStatusLoading } = useSelector((state) => state.getClientPipingMultiLHS);

    useEffect(() => {
        if (data) {
            const show = data?.client_status === 1 && data?.status_type !== null ? false : true;
            setShowButtons(show);
        }
    }, [data]);

    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    /* ================= FETCH PDF ================= */
    const fetchPdf = async () => {
        if (!data) return;
        try {
            setPdfUrl('');

            const resultAction = await dispatch(
                downloadLHSForClient({
                    report_no: data.report_no || '',
                    print_date: clientDate,
                })
            );

            if (downloadLHSForClient.fulfilled.match(resultAction)) {
                const fileUrl = resultAction.payload?.data?.file || resultAction.payload?.file || '';
                setPdfUrl(fileUrl);
            } else {
                toast.error('Failed to load PDF');
            }
        } catch (err) {
            toast.error('Failed to load PDF');
        }
    };

    /* ================= AUTO LOAD PDF ================= */
    useEffect(() => {
        if (data?.report_no || data?.drawing_no) {
            fetchPdf();
        }
    }, [data]);

    /* ================= RANDOM WITNESSED PREP ================= */
    const prepareRandomWitnessedItems = () => {
        let jointsList = [];

        // In LHS data, drawings are nested. Inside drawings we have spools, then joints
        if (Array.isArray(data?.drawings)) {
            data.drawings.forEach((drawing) => {
                if (Array.isArray(drawing?.spools)) {
                    drawing.spools.forEach((spool) => {
                        if (Array.isArray(spool?.joints)) {
                            spool.joints.forEach((joint) => {
                                jointsList.push({
                                    _id: joint?.joint_spool_item_id || joint?._id,
                                    drawing_no: drawing?.drawing_no || data?.report_no || '-',
                                    spool_no: spool?.spool_no || '-',
                                    joint_no: joint?.joint_no || '-',
                                    fitup_report: joint?.fitup?.report_no || '-',
                                    weld_visual_report: joint?.weld_visual?.report_no || '-',
                                    selected: false,
                                });
                            });
                        }
                    });
                }
            });
        }

        setRandomItems(jointsList);
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
    const submitLHSStatus = async (statusType) => {
        if (!clientDate) {
            toast.error('Please select date');
            return;
        }

        try {
            const payload = {
                lhsId: data._id,
                status_type: statusType,
                client_date: clientDate,
                client_user: localStorage.getItem('PARTY_ID'),
            };

            // RANDOM WITNESSED requires drawings/items
            if (statusType === 'RANDOM WITNESSED') {
                if (randomItems.length === 0) {
                    prepareRandomWitnessedItems();
                    toast.error('Please select items for Random Witnessed');
                    return;
                }

                payload.drawings = randomItems.map((item) => ({
                    _id: item._id,
                    selected: item.selected === true,
                }));
            }

            const resultAction = await dispatch(updateLHSClientStatus(payload));

            if (updateLHSClientStatus.fulfilled.match(resultAction)) {
                toast.success('Line History Sheet Clearance updated successfully');
                setShowRandomItems(false);
                navigate("/party/piping-store/line-history-management");
            } else {
                toast.error('Update failed');
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
                                <Link to="/party/piping-store/line-history-management">Line History Sheet List</Link>
                            </li>
                            <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                            <li className="breadcrumb-item active">View Line History Sheet Details</li>
                        </ul>
                    </div>

                    {/* ===== LHS Details ===== */}
                    <div className="card">
                        <div className="card-body">
                            <h4 className="mb-3">Line History Details</h4>
                            <div className="row">
                                <div className="col-md-4">
                                    <label>Report No</label>
                                    <input className="form-control" value={data?.report_no || '-'} readOnly />
                                </div>

                                <div className="col-md-4">
                                    <label>Work Order No</label>
                                    <input className="form-control" value={data?.project_details?.work_order_no || '-'} readOnly />
                                </div>

                                <div className="col-md-4">
                                    <label>Summary Date</label>
                                    <input
                                        className="form-control"
                                        value={data?.summary_date ? moment(data.summary_date).format('YYYY-MM-DD') : '-'}
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
                                        <button className="btn btn-primary me-2" onClick={() => submitLHSStatus('REVIEWED')} disabled={updateStatusLoading}>
                                            REVIEWED
                                        </button>

                                        <button className="btn btn-warning me-2" onClick={() => submitLHSStatus('WITNESSED')} disabled={updateStatusLoading}>
                                            WITNESSED
                                        </button>

                                        <button className="btn btn-success" onClick={prepareRandomWitnessedItems} disabled={updateStatusLoading}>
                                            RANDOM WITNESSED
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* ===== PDF VIEW ===== */}
                            {downloadLoading && <div className="mt-4 alert alert-info">Loading PDF...</div>}

                            {pdfUrl && !downloadLoading && (
                                <div className="mt-4">
                                    <iframe
                                        src={pdfUrl}
                                        title="Line History Sheet PDF"
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
                                                    <th>JOINT NO</th>
                                                    <th>FITUP REPORT</th>
                                                    <th>WELD VISUAL REPORT</th>
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
                                                        <td>{item.joint_no}</td>
                                                        <td>{item.fitup_report}</td>
                                                        <td>{item.weld_visual_report}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button className="btn btn-success mt-2" onClick={() => submitLHSStatus('RANDOM WITNESSED')}>
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

export default ViewLineHistory;