// import React, { useEffect, useMemo, useState } from 'react'
// import Header from '../Include/Header'
// import Sidebar from '../Include/Sidebar'
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAdjustment } from '../../../Store/Store/Adjustment/getAdjustment';
// import Loader from '../Include/Loader';
// import Footer from '../Include/Footer';
// import { Pagination, Search } from '../Table';
// import DropDown from '../../../Components/DropDown';
// import moment from 'moment';
// import toast from 'react-hot-toast';
// import { M_STORE, V_URL } from '../../../BaseUrl';

// const AdjustmentTable = () => {

//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [limit, setlimit] = useState(10);
//     const [disable, setDisable] = useState(true);

//     useEffect(() => {
//         const fetchData = () => {
//             if (disable === true) {
//                 try {
//                     dispatch(getAdjustment({ storeType: '' }));
//                     setDisable(false);
//                 } catch (error) {
//                     console.log(error, '!!')
//                     setDisable(false);
//                 }
//             }
//         }
//         fetchData();
//     }, [dispatch, disable]);

//     const entity = useSelector((state) => state?.getAdjustment?.user?.data);

//     const commentsData = useMemo(() => {
//         let computedComments = entity;

//         if (search) {
//             computedComments = computedComments.filter(
//                 (ad) =>
//                     ad.order?.orderNo?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
//                     ad.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
//                     (ad?.tag === 1 && "purchase".includes(search?.toLowerCase())) ||
//                     (ad?.tag === 2 && "sales".includes(search?.toLowerCase()))
//             );
//         }
//         setTotalItems(computedComments?.length);
//         //Current Page slice
//         return computedComments?.slice(
//             (currentPage - 1) * limit,
//             (currentPage - 1) * limit + limit
//         );
//     }, [currentPage, search, limit, entity]);

//     const handleRefresh = () => {
//         setSearch('');
//         setDisable(true);
//     }

//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const handleOpen = () => {
//         setIsSidebarOpen(!isSidebarOpen)
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
//                                     <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
//                                     <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
//                                     <li className="breadcrumb-item active">Section Details Records List</li>
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
//                                                         <h3>Section Details Record List</h3>
//                                                         <div className="doctor-search-blk">
//                                                             <div className="top-nav-search table-search-blk">
//                                                                 <form>
//                                                                     <Search
//                                                                         onSearch={(value) => {
//                                                                             setSearch(value);
//                                                                             setCurrentPage(1);
//                                                                         }} />
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
//                                                     <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="table-responsive">
//                                             <table className="table border-0 custom-table comman-table  mb-0 datatable">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Sr.</th>
//                                                         <th>Order No.</th>
//                                                         <th>Section Details </th>
//                                                         <th>Balance</th>
//                                                         <th>Receive / Sell</th>
//                                                         <th>Date</th>
//                                                         <th>Type</th>
//                                                         <th>Store</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {commentsData?.map((elem, i) =>
//                                                         <tr key={elem?._id}>
//                                                             <td>{(currentPage - 1) * limit + i + 1}</td>
//                                                             <td>{elem?.order?.orderNo}</td>
//                                                             <td>{elem?.itemName?.name}</td>
//                                                             <td>{elem?.balance_qty}</td>
//                                                             <td>{elem?.receive_qty}</td>
//                                                             <td>{moment(elem?.updatedAt).format('YYYY-MM-DD HH:MM:SS')}</td>
//                                                             <td className='status-badge'>
//                                                                 {elem.tag === 1 ? (
//                                                                     <span className="badge badge-soft-primary badge-border">Purchase</span>
//                                                                 ) : (
//                                                                     <span className="badge badge-soft-secondary badge-border">Sales</span>
//                                                                 )}
//                                                             </td>
//                                                             <td>{elem?.store_type === 1 ? (
//                                                                 <span className='custom-badge status-purple'>Main Store</span>
//                                                             ) : (
//                                                                 <span className='custom-badge status-purple'>Project Store</span>
//                                                             )}
//                                                             </td>
//                                                         </tr>
//                                                     )}

//                                                     {commentsData?.length === 0 ? (
//                                                         <tr>
//                                                             <td colspan="999">
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
//                                                         onPageChange={(page) => setCurrentPage(page)}
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

// export default AdjustmentTable