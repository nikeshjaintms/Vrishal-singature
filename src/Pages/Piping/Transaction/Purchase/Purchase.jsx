// import React, { useEffect, useMemo, useState } from 'react'
// import Header from '../../Include/Header'
// import Sidebar from '../../Include/Sidebar'
// import Footer from '../../Include/Footer';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { V_URL } from '../../../../BaseUrl';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const Purchase = () => {

//   const navigate = useNavigate
//   const [totalItems, setTotalItems] = useState(0);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [limit, setlimit] = useState(10);
//   const [disable, setDisable] = useState(true);
//   const [entity, setEntity] = useState([]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (disable === true) {
//       setEntity([]);
//       getPurchaseOrder();
//     }
//   }, [navigate, disable]);

//   const commentsData = useMemo(() => {
//     let computedComments = entity;

//     if (search) {
//       computedComments = computedComments.filter((pro) =>
//         pro.orderNo?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
//         pro.party?.name?.toLowerCase()?.includes(search?.toLowerCase())
//       );
//     }
//     setTotalItems(computedComments.length);
//     return computedComments?.slice(
//       (currentPage - 1) * limit,
//       (currentPage - 1) * limit + limit
//     );
//   }, [currentPage, search, limit, entity]);

//   const getPurchaseOrder = () => {
//     const myurl = `${V_URL}/user/get-order`;
//     const formData = new URLSearchParams();
//     formData.append("tag", "1");
//     // formData.append("store_type", "2");
//     axios({
//       method: "post",
//       url: myurl,
//       data: formData,
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
//       },
//     }).then(async (response) => {
//       // console?.log("@@", response?.data);
//       if (response?.data?.success) {
//         const data = response.data.data;
//         const filteredData = data?.filter((e) => e?.project?._id === localStorage.getItem('U_PROJECT_ID'));
//         setEntity(filteredData);
//         setDisable(false);
//       } else {
//         toast.error("Something went wrong");
//       }
//     }).catch((error) => {
//       toast.error("Something went wrong");
//       console?.log("Errors", error);
//     });
//   };

//   const handleRefresh = () => {
//     setDisable(true);
//   };

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const handleOpen = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />

//        <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             <div className="row">
//               <div className="col-sm-12">
//                 <ul className="breadcrumb">
//                   <li className="breadcrumb-item">
//                     <Link to="/piping/user/dashboard">Dashboard </Link>
//                   </li>
//                   <li className="breadcrumb-item">
//                     <i className="feather-chevron-right"></i>
//                   </li>
//                   <li className="breadcrumb-item active">Purchase</li>
//                 </ul>
//               </div>
//             </div>
//           </div> 

//           {disable === false ? (
//             <div className="row">
//               <div className="col-sm-12">
//                 <div className="card card-table show-entire">
//                   <div className="card-body">
//                     <div className="page-table-header mb-2">
//                       <div className="row align-items-center">
//                         <div className="col">
//                           <div className="doctor-table-blk">
//                             <h3>Purchase List</h3>
//                             <div className="doctor-search-blk">
//                               <div className="top-nav-search table-search-blk">
//                                 <form>
//                                   <Search
//                                     onSearch={(value) => {
//                                       setSearch(value);
//                                       setCurrentPage(1);
//                                     }} />
//                                   <a className="btn"><img src="/assets/img/icons/search-normal.svg"
//                                     alt="search" /></a>
//                                 </form>
//                               </div>
//                               <div className="add-group">
//                                 <button type='button' onClick={handleRefresh}
//                                   className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
//                                     src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                           <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="table-responsive">
//                       <table className="table border-0 custom-table comman-table  mb-0 datatable">
//                         <thead>
//                           <tr>
//                             <th>Sr.</th>

//                           </tr>
//                         </thead>
//                         <tbody>
//                           {commentsData?.map((elem, i) =>
//                             <tr key={elem?._id}>
//                               <td>{(currentPage - 1) * limit + i + 1}</td>


//                             </tr>
//                           )}

//                           {commentsData?.length === 0 ? (
//                             <tr>
//                               <td colspan="999">
//                                 <div className="no-table-data">
//                                   No Data Found!
//                                 </div>
//                               </td>
//                             </tr>
//                           ) : null}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="row align-center mt-3 mb-2">
//                       <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
//                         <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
//                           aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
//                       </div>
//                       <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                         <div className="dataTables_paginate paging_simple_numbers"
//                           id="DataTables_Table_0_paginate">
//                           <Pagination
//                             total={totalItems}
//                             itemsPerPage={limit}
//                             currentPage={currentPage}
//                             onPageChange={(page) => setCurrentPage(page)}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : <Loader />} 
//         </div>
//         <Footer />
//       </div>
//     </div> 
//   )
// }

// export default Purchase