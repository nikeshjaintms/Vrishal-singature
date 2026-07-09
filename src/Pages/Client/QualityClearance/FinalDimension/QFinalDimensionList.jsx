import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import { BadgeCheck, X } from 'lucide-react';
import moment from 'moment';
import DropDown from '../../../../Components/DropDown';
import { getUserFinalDimension } from '../../../../Store/Store/Execution/getUserFinalDimension';
import Loader from '../../Include/Loader';
import { QC, V_URL} from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import axios from 'axios';
import toast from 'react-hot-toast';

// const QFinalDimensionList = () => {  
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [limit, setlimit] = useState(10);
//     const [disable, setDisable] = useState(true);

//     useEffect(() => {
//         if (disable === true) {
//             dispatch(getUserFinalDimension({ status: '', page: currentPage, limit }));
//             setDisable(false);
//         }
//     }, [dispatch, disable]);

//     const entity = useSelector((state) => state.getUserFinalDimension?.user?.data?.data);
//     const pagination = useSelector((state) => state?.getUserFinalDimension?.user?.data?.pagination) || {};
//     console.log(entity, "entity");
//     console.log(pagination, "pagination");

//     const commentsData = useMemo(() => {
//         // let computedComments = entity;
//         let computedComments = Array.isArray(entity) ? [...entity] : [];

//         if (search) {
//             computedComments = computedComments?.filter(
//                 (i) =>
//                     i?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
//             );
//         }
//         // setTotalItems(computedComments?.length);
//         return computedComments;
//     }, [currentPage, search, limit, entity]);

// useEffect(() => {
//   if (pagination?.totalCount) {
//     setTotalItems(pagination.totalCount
// );
    
//   }
// }, [pagination]);

//     const handleRefresh = () => {
//         setCurrentPage(1);
//         setSearch("");
//         setDisable(true);
//     }

//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const handleOpen = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     const handleDownloadIns = (elem) => {
//         const bodyFormData = new URLSearchParams();
//         bodyFormData.append('report_no_two', elem.report_no_two)
//         bodyFormData.append('print_date', true);
//         PdfDownloadErp({ apiMethod: 'post', url: 'one-multi-fd-download', body: bodyFormData });
//     }

//     return (
//         <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//             <Header handleOpen={handleOpen} />
//             <Sidebar />

//             <div className="page-wrapper">
//                 <div className="content">
//                     <div className="page-header">
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <ul className="breadcrumb">
//                                     <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
//                                     <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
//                                     <li className="breadcrumb-item active">Final Dimension Clearance List</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>

//                     {disable === false ? (
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <div className="card card-table show-entire">
//                                     <div className="card-body">

//                                         <div className="page-table-header mb-2">
//                                             <div className="row align-items-center">
//                                                 <div className="col">
//                                                     <div className="doctor-table-blk">
//                                                         <h3>Final Dimension Clearance List</h3>
//                                                         <div className="doctor-search-blk">
//                                                             <div className="top-nav-search table-search-blk">
//                                                                 <form>
//                                                                     <Search
//                                                                         onSearch={(value) => {
//                                                                             setSearch(value);
//                                                                             setCurrentPage(1);
//                                                                         }} />
//                                                                     {/* eslint-disable jsx-a11y/anchor-is-valid */}
//                                                                     <a className="btn"><img src="/assets/img/icons/search-normal.svg"
//                                                                         alt="search" /></a>
//                                                                 </form>
//                                                             </div>
//                                                             <div className="add-group">
//                                                                 <button type='button' onClick={handleRefresh}
//                                                                     className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
//                                                                         src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                                                     {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
//                                                         <DropDown limit={limit} onLimitChange={(val) => {
//     setlimit(val);
//     setCurrentPage(1);
//     setDisable(true);
// }} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="table-responsive">
//                                             <table className="table border-0 custom-table comman-table  mb-0 datatable">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Sr.</th>
//                                                         <th>Report No.</th>
//                                                         <th>Offer By.</th>
//                                                         <th>Date</th>
//                                                         {localStorage.getItem('ERP_ROLE') === QC && (
//                                                             <th>Verify</th>
//                                                         )}
//                                                         <th>Status</th>
//                                                         <th className="text-end">Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {commentsData?.map((elem, i) =>
//                                                         <tr key={elem?._id}>
//                                                             <td>{(currentPage - 1) * limit + i + 1}</td>
//                                                             <td>{elem?.report_no}</td>
//                                                             <td>{elem?.offered_by?.user_name}</td>
//                                                             <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
//                                                             {localStorage.getItem('ERP_ROLE') === QC && (
//                                                                 <td>
//                                                                     {elem?.status === 1 ? (
//                                                                         <span style={{ cursor: 'pointer' }} onClick={() => navigate('/user/project-store/quality-clearance-final-dimension-management', { state: elem })}>
//                                                                             <BadgeCheck />
//                                                                         </span>
//                                                                     ) : (<span><X /></span>)}
//                                                                 </td>
//                                                             )}
//                                                             <td className='status-badge'>
//                                                                 {elem.status === 1 ? (
//                                                                     <span className="custom-badge status-orange">Pending</span>
//                                                                 ) : elem.status === 2 ? (
//                                                                     <span className="custom-badge status-green">Accepted</span>
//                                                                 ) : elem.status === 3 ? (
//                                                                     <span className="custom-badge status-pink">Rejected</span>
//                                                                 ) : null}
//                                                             </td>
//                                                             <td className="text-end">
//                                                                 <div className="dropdown dropdown-action">
//                                                                     <a href="#" className="action-icon dropdown-toggle"
//                                                                         data-bs-toggle="dropdown" aria-expanded="false"><i
//                                                                             className="fa fa-ellipsis-v"></i></a>
//                                                                     <div className="dropdown-menu dropdown-menu-end">
//                                                                         {elem?.status !== 1 ? (
//                                                                             <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
//                                                                                 <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
//                                                                         ) : (
//                                                                             <button type='button' className='dropdown-item'>Ins. Not Found</button>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}

//                                                     {commentsData?.length === 0 ? (
//                                                         <tr>
//                                                             <td colSpan="999">
//                                                                 <div className="no-table-data">
//                                                                     No Data Found!
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     ) : null}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         <div className="row align-center mt-3 mb-2">
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
//                                                 <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
//                                                     aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
//                                             </div>
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                                                 <div className="dataTables_paginate paging_simple_numbers"
//                                                     id="DataTables_Table_0_paginate">
//                                                     <Pagination
//                                                         total={totalItems}
//                                                         itemsPerPage={limit}
//                                                         currentPage={currentPage}
//                                                         // onPageChange={(page) => setCurrentPage(page)}
//                                                          onPageChange={(page) => {
//     setCurrentPage(page);
//     setDisable(true); 
//   }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ) : <Loader />}
//                 </div>
//                 <Footer />
//             </div>
//         </div>
//     )
// }

// export default QFinalDimensionList


/* ---------- Debounce ---------- */
// const useDebounce = (value, delay = 500) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// const QFinalDimensionList = () => {
//   const navigate = useNavigate();

//   const [entity, setEntity] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState("");
//   const [disable, setDisable] = useState(true);

//   const debouncedSearch = useDebounce(search, 500);

//   /* ---------- FETCH DATA ---------- */
//   useEffect(() => {
//     if (disable) {
//       setEntity([]);
//       getFinalDimension();
//     }
//   }, [disable, currentPage, limit, debouncedSearch]);

//   const getFinalDimension = async () => {
//     try {
//       const url = `${V_URL}/party/get-multi-fd?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`;

//       const response = await axios.get(url, {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
//         },
//       });

//       if (response.data.success) {
//         setEntity(response.data.data?.data || []);
//         setTotalItems(response.data.data?.totalItems || 0);
//       } else {
//         toast.error(response.data.message || "Failed to fetch data");
//       }
//     } catch (err) {
//       console.error("Fetch FD error:", err);
//       toast.error("Error fetching Final Dimension list");
//     } finally {
//       setDisable(false);
//     }
//   };

//   /* ---------- FILTER ---------- */
//   const commentsData = useMemo(() => {
//     let computed = [...entity];
//     return computed;
//   }, [entity]);

//   /* ---------- HANDLERS ---------- */
//   const handleRefresh = () => {
//     setSearch("");
//     setCurrentPage(1);
//     setDisable(true);
//   };

//   const handleDownloadIns = (elem) => {
//     const bodyFormData = new URLSearchParams();
//     bodyFormData.append("report_no_two", elem.report_no_two);
//     bodyFormData.append("print_date", true);

//     PdfDownloadErp({
//       apiMethod: "post",
//       url: "one-multi-fd-download",
//       body: bodyFormData,
//     });
//   };

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

//   /* ---------- JSX ---------- */
//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />

//       <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/user/project-store/dashboard">Dashboard</Link>
//               </li>
//               <li className="breadcrumb-item">
//                 <i className="feather-chevron-right"></i>
//               </li>
//               <li className="breadcrumb-item active">
//                 Final Dimension Clearance List
//               </li>
//             </ul>
//           </div>

//           {!disable ? (
//             <div className="card card-table">
//               <div className="card-body">
//                 {/* ---------- HEADER ---------- */}
//                 <div className="page-table-header mb-2">
//                   <div className="row align-items-center">
//                     <div className="col">
//                       <h3>Final Dimension Clearance List</h3>
//                       <input
//                         className="form-control"
//                         placeholder="Search"
//                         value={search}
//                         onChange={(e) => {
//                           setSearch(e.target.value);
//                           setCurrentPage(1);
//                           setDisable(true);
//                         }}
//                       />
//                     </div>

//                     <div className="col-auto ms-auto">
//                       <DropDown
//                         limit={limit}
//                         onLimitChange={(val) => {
//                           setLimit(val);
//                           setCurrentPage(1);
//                           setDisable(true);
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* ---------- TABLE ---------- */}
//                 <div className="table-responsive">
//                   <table className="table custom-table">
//                     <thead>
//                       <tr>
//                         <th>Sr.</th>
//                         <th>Report No</th>
//                         <th>Offered By</th>
//                         <th>Date</th>
//                         {localStorage.getItem("ERP_ROLE") === QC && (
//                           <th>Verify</th>
//                         )}
//                         <th>Status</th>
//                         <th className="text-end">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {commentsData.map((elem, i) => (
//                         <tr key={elem._id}>
//                           <td>{(currentPage - 1) * limit + i + 1}</td>
//                           <td>{elem.report_no}</td>
//                           <td>{elem.offered_by?.user_name}</td>
//                           <td>{moment(elem.createdAt).format("YYYY-MM-DD")}</td>

//                           {localStorage.getItem("ERP_ROLE") === QC && (
//                             <td>
//                               {elem.status === 1 ? (
//                                 <BadgeCheck
//                                   style={{ cursor: "pointer" }}
//                                   onClick={() =>
//                                     navigate(
//                                       "/user/project-store/quality-clearance-final-dimension-management",
//                                       { state: elem }
//                                     )
//                                   }
//                                 />
//                               ) : (
//                                 <X />
//                               )}
//                             </td>
//                           )}

//                           <td>
//                             <span className={`custom-badge ${
//                               elem.status === 1
//                                 ? "status-orange"
//                                 : elem.status === 2
//                                 ? "status-green"
//                                 : "status-pink"
//                             }`}>
//                               {elem.status === 1
//                                 ? "Pending"
//                                 : elem.status === 2
//                                 ? "Accepted"
//                                 : "Rejected"}
//                             </span>
//                           </td>

//                           <td className="text-end">
//                             {elem.status !== 1 ? (
//                               <button
//                                 className="btn btn-sm btn-primary"
//                                 onClick={() => handleDownloadIns(elem)}
//                               >
//                                 Download
//                               </button>
//                             ) : (
//                               "-"
//                             )}
//                           </td>
//                         </tr>
//                       ))}

//                       {commentsData.length === 0 && (
//                         <tr>
//                           <td colSpan="999" className="text-center">
//                             No Data Found!
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* ---------- PAGINATION ---------- */}
//                 <div className="row mt-3">
//                   <div className="col-md-6">
//                     Showing {commentsData.length} of {totalItems}
//                   </div>
//                   <div className="col-md-6 d-flex justify-content-end">
//                     <Pagination
//                       total={totalItems}
//                       itemsPerPage={limit}
//                       currentPage={currentPage}
//                       onPageChange={(page) => {
//                         setCurrentPage(page);
//                         setDisable(true);
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <Loader />
//           )}
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default QFinalDimensionList;


/* ---------------- Debounce ---------------- */
// const useDebounce = (value, delay = 500) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// const QFinalDimensionList = () => {
//   const navigate = useNavigate();

//   const [entity, setEntity] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [search, setSearch] = useState('');
//   const [limit, setLimit] = useState(10);
//   const [disable, setDisable] = useState(true);

//   const debouncedSearch = useDebounce(search, 500);

//   /* ---------------- API CALL ---------------- */
//   useEffect(() => {
//     if (disable) {
//       getFinalDimension();
//     }
//   }, [disable, currentPage, limit, debouncedSearch]);

//   const getFinalDimension = () => {
//     axios({
//       method: 'get',
//       url: `${V_URL}/party/get-multi-fd`,
//       params: {
//         page: currentPage,
//         limit,
//         search: debouncedSearch,
//       },
//       headers: {
//         Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
//       },
//     })
//       .then((response) => {
//         if (response.data.success === true) {
//           const resData = response.data?.data;
//           setEntity(resData?.data || []);
//           setTotalItems(resData?.totalItems || 0);
//         }
//       })
//       .catch((error) => {
//         console.error(error);
//       })
//       .finally(() => {
//         setDisable(false);
//       });
//   };

//   /* ---------------- DATA ---------------- */
//   const commentsData = useMemo(() => {
//     return Array.isArray(entity) ? entity : [];
//   }, [entity]);

//   /* ---------------- REFRESH ---------------- */
//   const handleRefresh = () => {
//     setSearch('');
//     setCurrentPage(1);
//     setDisable(true);
//   };

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />

//       <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             <div className="row">
//               <div className="col-sm-12">
//                 <ul className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/user/project-store/dashboard">Dashboard</Link>
//                   </li>
//                   <li className="breadcrumb-item active">
//                     Final Dimension Clearance List
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {!disable ? (
//             <div className="row">
//               <div className="col-sm-12">
//                 <div className="card card-table show-entire">
//                   <div className="card-body">

//                     <div className="page-table-header mb-2">
//                       <div className="row align-items-center">
//                         <div className="col">
//                           <div className="doctor-table-blk">
//                             <h3>Final Dimension Clearance List</h3>
//                             <div className="doctor-search-blk">
//                               <div className="top-nav-search table-search-blk">
//                                 <form>
//                                   <Search
//                                     onSearch={(value) => {
//                                       setSearch(value);
//                                       setCurrentPage(1);
//                                       setDisable(true);
//                                     }}
//                                   />
//                                   <a className="btn">
//                                     <img src="/assets/img/icons/search-normal.svg" alt="search" />
//                                   </a>
//                                 </form>
//                               </div>
//                               <div className="add-group">
//                                 <button
//                                   type="button"
//                                   onClick={handleRefresh}
//                                   className="btn btn-primary doctor-refresh ms-2"
//                                 >
//                                   <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                           <DropDown
//                             limit={limit}
//                             onLimitChange={(val) => {
//                               setLimit(val);
//                               setCurrentPage(1);
//                               setDisable(true);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="table-responsive">
//                       <table className="table border-0 custom-table comman-table mb-0">
//                         <thead>
//                           <tr>
//                             <th>Sr.</th>
//                             <th>Report No.</th>
//                             <th>Offer By</th>
//                             <th>Date</th>
//                             {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
//                             <th>Status</th>
//                             <th className="text-end">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {commentsData.map((elem, i) => (
//                             <tr key={elem?._id}>
//                               <td>{(currentPage - 1) * limit + i + 1}</td>
//                               <td>{elem?.report_no}</td>
//                               <td>{elem?.offered_by?.user_name}</td>
//                               <td>{moment(elem?.createdAt).format('YYYY-MM-DD')}</td>

//                               {localStorage.getItem('ERP_ROLE') === QC && (
//                                 <td>
//                                   {elem?.status === 1 ? (
//                                     <span
//                                       style={{ cursor: 'pointer' }}
//                                       onClick={() =>
//                                         navigate(
//                                           '/user/project-store/quality-clearance-final-dimension-management',
//                                           { state: elem }
//                                         )
//                                       }
//                                     >
//                                       <BadgeCheck />
//                                     </span>
//                                   ) : (
//                                     <span><X /></span>
//                                   )}
//                                 </td>
//                               )}

//                               <td>
//                                 {elem?.status === 1 && (
//                                   <span className="custom-badge status-orange">Pending</span>
//                                 )}
//                                 {elem?.status === 2 && (
//                                   <span className="custom-badge status-green">Accepted</span>
//                                 )}
//                                 {elem?.status === 3 && (
//                                   <span className="custom-badge status-pink">Rejected</span>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}

//                           {commentsData.length === 0 && (
//                             <tr>
//                               <td colSpan="999">
//                                 <div className="no-table-data">No Data Found!</div>
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>

//                     <div className="row align-center mt-3 mb-2">
//                       <div className="col-sm-12 col-md-6">
//                         <div className="dataTables_info">
//                           Showing {commentsData.length} of {totalItems} total records
//                         </div>
//                       </div>
//                       <div className="col-sm-12 col-md-6 d-flex justify-content-end">
//                         <Pagination
//                           total={totalItems}
//                           itemsPerPage={limit}
//                           currentPage={currentPage}
//                           onPageChange={(page) => {
//                             setCurrentPage(page);
//                             setDisable(true);
//                           }}
//                         />
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <Loader />
//           )}
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default QFinalDimensionList;

/* ---------------- Debounce ---------------- */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const QFinalDimensionList = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);
  const projectId = localStorage.getItem('PARTY_PROJECT_ID');

  /* ---------------- API CALL ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${V_URL}/party/get-multi-fd`, {
        params: {
          page,
          limit,
          search: debouncedSearch,
          project: projectId,
          _t: Date.now(),
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
        },
      });

      if (response.data.success) {
        setRows(response.data.data.data || []);
        setTotalItems(response.data.data.totalItems || 0);
      }
    } catch (err) {
      console.error('Final Dimension fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch]);

  /* ---------------- REFRESH ---------------- */
  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    fetchData();
  };

  /* ---------------- DOWNLOAD ---------------- */
  const downloadInspection = (row) => {
    const body = new URLSearchParams();
    body.append('report_no_two', row.report_no_two);
    body.append('print_date', true);

    PdfDownloadErp({
      apiMethod: 'post',
      url: 'one-multi-final-dimension-download',
      body,
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">

          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                Final Dimension Acceptance
              </li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">

              {/* -------- TOP CONTROLS -------- */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Final Dimension Acceptance</h3>
                        <div className="doctor-search-blk">
                          <div className="top-nav-search table-search-blk">
                            <form>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => {
                                  setSearch(e.target.value);
                                  setPage(1);
                                }}
                              />
                              <a className="btn">
                                <img src="/assets/img/icons/search-normal.svg" alt="search" />
                              </a>
                            </form>
                          </div>
                          <div className="add-group">
                            <button
                              type="button"
                              onClick={handleRefresh}
                              className="btn btn-primary doctor-refresh ms-2">
                              <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                            </button>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                    <DropDown
                      limit={limit}
                      onLimitChange={(val) => {
                        setLimit(val);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* -------- TABLE -------- */}
              {/* <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>Assem. No.</th>
                      <th>Date</th>
                      {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan="7">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    )}

                    {rows.map((r, i) => (
                      <tr key={r._id}>
                        <td>{(page - 1) * limit + i + 1}</td>
                        <td>{r.report_no_two}</td>
                        <td>{r.assembly_no?.user_name || '--'}</td>
                        <td>{moment(r.createdAt).format('YYYY-MM-DD HH:mm')}</td>

                        {localStorage.getItem('ERP_ROLE') === QC && (
                          <td>
                            {r.status === 1 ? (
                              <BadgeCheck
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  navigate(
                                    '/user/project-store/quality-clearance-final-dimension-management',
                                    { state: r }
                                  )
                                }
                              />
                            ) : (
                              <X />
                            )}
                          </td>
                        )}

                        <td>
                          {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(r.status_type) ? (
                            <span className="custom-badge status-green">
                              {r.status_type}
                            </span>
                          ) : (
                            <span className="custom-badge status-orange">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="text-end">
                          <div className="dropdown dropdown-action">
                            <a className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                              <i className="fa fa-ellipsis-v"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  navigate(
                                    '/party/project-store/view-quality-clearance-final-dimension',
                                    { state: r }
                                  )
                                }
                              >
                                View
                              </button>

                              <button
                                className="dropdown-item"
                                onClick={() => downloadInspection(r)}
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
              {/* -------- TABLE -------- */}
              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>Assem. No.</th>
                      <th>Date</th>
                        {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 && (
                    <tr>
                      <td colSpan="7">
                        <div className="no-table-data">No Data Found!</div>
                      </td>
                    </tr>
                    )}

                    {rows.map((r, i) => {
                    // SAME DATA LOGIC AS QFitUpList (NO UI CHANGE)
                      const uniqueAssemblyNos = [
                          ...new Set(r?.items?.map(e => e?.drawing_id?.assembly_no).filter(Boolean))
                        ]

                    return (
                        <tr key={r._id}>
                          <td>{(page - 1) * limit + i + 1}</td>
                          <td>{r.report_no_two}</td>
                          <td>{uniqueAssemblyNos}</td>
                          <td>{moment(r.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                          {localStorage.getItem('ERP_ROLE') === QC && (
                            <td>
                              {r.status === 1 ? (
                              <BadgeCheck
                                  style={{ cursor: 'pointer' }}
                                  onClick={() =>
                                     navigate('/user/project-store/quality-clearance-final-dimension-management',
                                     { state: r })
                                  }
                              />
                               ) : (
                               <X />
                                )}
                            </td>
                        )}

                           <td>
                             {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(
                              r.status_type
                              ) ? (
                              <span className="custom-badge status-green">
                                {r.status_type}
                              </span>
                              ) : (
                             <span className="custom-badge status-orange">
                                {r.status_text || 'Pending'}
                             </span>
                             )}
                           </td>
                           <td className="text-end">
                            <div className="dropdown dropdown-action">
                             <a
                               href="#"
                               className="action-icon dropdown-toggle"
                               data-bs-toggle="dropdown">
                                 <i className="fa fa-ellipsis-v"></i>
                             </a>

                            <div className="dropdown-menu dropdown-menu-end">
                             <button
                                type="button"
                                className="dropdown-item"
                                onClick={() =>
                                   navigate(
                                      '/party/project-store/view-quality-clearance-final-dimension',
                                   { state: r }
                                    )
                              }>
                                View
                              </button>

                              <button
                                 type="button"
                                 className="dropdown-item"
                                 onClick={() => downloadInspection(r)}
                              >
                               Download
                             </button>
                            </div>
                         </div>
                        </td>
                      </tr>
                      );
                    })} 
                </tbody>
              </table>
              </div>


              {/* -------- PAGINATION -------- */}
              <div className="row mt-3 mb-2">
                <div className="col-md-6">
                  Showing {rows.length} of {totalItems} total records
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={limit}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default QFinalDimensionList;