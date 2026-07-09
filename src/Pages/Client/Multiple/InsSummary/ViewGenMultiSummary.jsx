import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { V_URL } from '../../../../BaseUrl';

//import PageHeader from '../Components/Breadcrumbs/PageHeader';
//import { Pagination, Search } from '../../Table';
//import DropDown from '../../../../Components/DropDown';
//import { useDispatch, useSelector } from 'react-redux';
//import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
//import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';


const ViewGenMultiSummary = () => {
  const location = useLocation();
  const data = location.state;
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);
 
  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
 
  /* ================= BUTTON VISIBILITY ================= */
  useEffect(() => {
    if (data?._id) {
      const show =
        data?.client_status === 1 && data?.status !== 1 ? false : true;
      setShowButtons(show);
    }
  }, [data?._id]);
 
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
 
  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setLoadingPdf(true);
 
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl('');
      }
 
      const res = await axios.post(
        `${V_URL}/party/get-inspection-report-item`,
        {
          inspectionId: data._id,
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
    } catch {
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
 
  /* ================= RANDOM WITNESSED ITEMS ================= */
  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => ({
        _id: item._id,
 
        drawing_no: item?.drawing_id?.drawing_no || '-',
        sheet_no: item?.drawing_id?.sheet_no || '-',
        assembly_no: item?.drawing_id?.assembly_no || '-',
        grid_no: item?.grid_id?.grid_no || '-',
        grid_qty: item?.is_grid_qty || 0,
 
        selected: false,
        remark: item?.remarks || '',
      })) || [];
 
    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };
 
  /* ================= ITEM SELECT ================= */
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
  const submitInspectionStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }
 
    try {
      const payload = {
        inspectionId: data._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem('PARTY_ID'),
      };
 
      if (statusType === 'RANDOM WITNESSED') {
        if (randomItems.length === 0) {
          prepareRandomWitnessedItems();
          toast.error('Please select items');
          return;
        }
 
        payload.items = randomItems.map((i) => ({
          _id: i._id,
          selected: i.selected === true,
          remark: i.remark,
        }));
      }
 
      const res = await axios.post(
        `${V_URL}/party/inspection-report-review-update`,
        payload,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );
 
      if (res.data.success) {
        toast.success('Inspection Report updated successfully');
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
              <li className="breadcrumb-item active">
                View Inspection Summary
              </li>
            </ul>
          </div>
 
          {/* ===== Details ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Inspection Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input className="form-control" value={data?.report_no || '-'} readOnly />
                </div>
 
                <div className="col-md-4">
                  <label>Prepared By</label>
                  <input className="form-control" value={data?.prepared_by?.user_name || '-'} readOnly />
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
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => submitInspectionStatus('REVIEWED')}
                    >
                      REVIEWED
                    </button>
 
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => submitInspectionStatus('WITNESSED')}
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
 
              {/* ===== PDF ===== */}
              {loadingPdf && (
                <div className="mt-4 alert alert-info">Loading PDF...</div>
              )}
 
              {pdfUrl && (
                <div className="mt-4">
                  <iframe
                    src={pdfUrl}
                    title="Inspection PDF"
                    width="100%"
                    height="700px"
                    style={{ border: '1px solid #ccc' }}
                  />
                </div>
              )}
 
              {/* ===== RANDOM WITNESSED TABLE ===== */}
              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-3">
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                            />
                          </th>
                          <th>#</th>
                          <th>Drawing</th>
                          <th>Sheet</th>
                          <th>Assembly</th>
                          <th>Grid</th>
                          <th>Qty</th>
                          <th>Remark</th>
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
                            <td>{item.sheet_no}</td>
                            <td>{item.assembly_no}</td>
                            <td>{item.grid_no}</td>
                            <td>{item.grid_qty}</td>
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
                    onClick={() => submitInspectionStatus('RANDOM WITNESSED')}
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
 
export default ViewGenMultiSummary;


// const ViewGenMultiSummary = () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [search, setSearch] = useState('');
//     const [limit, setlimit] = useState(10)
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalItems, setTotalItems] = useState(0);
//     const [tableData, setTableData] = useState([]);
//     const data = location.state;

//     useEffect(() => {
//         dispatch(getUserAdminDraw());
//         dispatch(getUserWpsMaster({ status: true }));
//     }, []);

//     useEffect(() => {
//         if (data) {
//             setTableData(data?.items);
//         }
//     }, [data]);

//     const commentsData = useMemo(() => {
//         let computedComments = tableData || [];

//         if (search) {
//             computedComments = computedComments.filter(
//                 (fit) =>
//                     fit?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())
//             );
//         }

//         setTotalItems(computedComments?.length);
//         return computedComments?.slice(
//             (currentPage - 1) * limit,
//             (currentPage - 1) * limit + limit
//         );
//     }, [currentPage, search, limit, tableData]);

//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const handleOpen = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     return (
//         <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//             <Header handleOpen={handleOpen} />
//             <Sidebar />

//             <div className="page-wrapper">
//                 <div className="content">
//                     <PageHeader breadcrumbs={[
//                         { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
//                         { name: "Inspection Summary Records List", link: "/user/project-store/inspection-summary-management", active: false },
//                         { name: `View Inspection Summary Details`, active: true }
//                     ]} />

//                     <div className="row">
//                         <div className="col-sm-12">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <form>
//                                         <div className="col-12">
//                                             <div className="form-heading">
//                                                 <h4>View Inspection Summary Details</h4>
//                                             </div>
//                                         </div>
//                                         <div className='row'>
//                                             <div className="col-12 col-md-6 col-xl-6">
//                                                 <div className="input-block local-forms custom-select-wpr">
//                                                     <label>Inspection Summary List <span className="login-danger">*</span></label>
//                                                     <input value={data?.report_no} className='form-control' readOnly />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className='row'>
//                         <div className="col-sm-12">
//                             <div className="card card-table show-entire">
//                                 <div className="card-body">

//                                     <div className="page-table-header mb-2">
//                                         <div className="row align-items-center">
//                                             <div className="col">
//                                                 <div className="doctor-table-blk">
//                                                     <h3>Inspection Summary List</h3>
//                                                     <div className="doctor-search-blk">
//                                                         <div className="top-nav-search table-search-blk">
//                                                             <form>
//                                                                 <Search onSearch={(value) => {
//                                                                     setSearch(value);
//                                                                     setCurrentPage(1);
//                                                                 }} />
//                                                                 <a className="btn"><img src="/assets/img/icons/search-normal.svg"
//                                                                     alt="search" /></a>
//                                                             </form>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                                                 <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="table-responsive mt-2">
//                                         <table className="table border-0 custom-table comman-table  mb-0">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Sr.</th>
//                                                     <th>Drawing No.</th>
//                                                     <th>Rev</th>
//                                                     <th>Asse. No.</th>
//                                                     <th>Grid. No.</th>
//                                                     <th>FD Grid. No.</th>
//                                                     <th>Fitup Ins Report</th>
//                                                     <th>Weld Visual Ins Report</th>
//                                                     <th>UT Report</th>
//                                                     <th>RT Report</th>
//                                                     <th>MPT Report</th>
//                                                     <th>LPT Report</th>
//                                                     <th>FD Report</th>
//                                                     <th>Remarks</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {commentsData?.length > 0 ? (
//                                                     commentsData?.map((elem, i) => (
//                                                         <tr key={i}>
//                                                             <td>{(currentPage - 1) * limit + i + 1}</td>
//                                                             <td>{elem?.drawing_no}</td>
//                                                             <td>{elem?.rev}</td>
//                                                             <td>{elem?.assembly_no}</td>
//                                                             <td>{elem?.grid_no}</td>
//                                                             <td>{elem?.is_grid_qty}</td>
//                                                             <td>
//                                                                 {elem?.fitup_inspection_report &&
//                                                                     elem.fitup_inspection_report.length > 0 ? (
//                                                                     elem.fitup_inspection_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>
//                                                                 {elem?.weld_inspection_report &&
//                                                                     elem.weld_inspection_report.length > 0 ? (
//                                                                     elem.weld_inspection_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>
//                                                                 {elem?.ut_report &&
//                                                                     elem.ut_report.length > 0 ? (
//                                                                     elem.ut_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>
//                                                                 {elem?.rt_report &&
//                                                                     elem.rt_report.length > 0 ? (
//                                                                     elem.rt_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>
//                                                                 {elem?.mpt_report &&
//                                                                     elem.mpt_report.length > 0 ? (
//                                                                     elem.mpt_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>
//                                                                 {elem?.lpt_report &&
//                                                                     elem.lpt_report.length > 0 ? (
//                                                                     elem.lpt_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>
//                                                                 {elem?.fd_report &&
//                                                                     elem.fd_report.length > 0 ? (
//                                                                     elem.fd_report
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .map((e, index) => <div key={index}>{e}</div>)
//                                                                 ) : (
//                                                                     "-"
//                                                                 )}
//                                                             </td>
//                                                             <td>{elem?.remarks || "-"}</td>
//                                                         </tr>
//                                                     ))
//                                                 ) : (
//                                                     <tr>
//                                                         <td colSpan="999">
//                                                             <div className="no-table-data">No Data Found!</div>
//                                                         </td>
//                                                     </tr>
//                                                 )}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                     <div className="row align-center mt-3 mb-2">
//                                         <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
//                                             <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
//                                                 aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
//                                         </div>
//                                         <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                                             <div className="dataTables_paginate paging_simple_numbers"
//                                                 id="DataTables_Table_0_paginate">
//                                                 <Pagination
//                                                     total={totalItems}
//                                                     itemsPerPage={limit}
//                                                     currentPage={currentPage}
//                                                     onPageChange={(page) => setCurrentPage(page)}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className='row'>
//                         <div className="col-sm-12">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <div className="col-12 text-end">
//                                         <div className="doctor-submit text-end">
//                                             <button type="button"
//                                                 className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/inspection-summary-management')}>Back</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ViewGenMultiSummary