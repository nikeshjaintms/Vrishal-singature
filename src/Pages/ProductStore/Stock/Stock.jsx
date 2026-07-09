import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { P_STORE, V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';

const Stock = () => {

    // const navigate = useNavigate();
    // const [totalItems, setTotalItems] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [search, setSearch] = useState("");
    // const [limit, setlimit] = useState(10);
    // const [disable, setDisable] = useState(true);
    // const [entity, setEntity] = useState([]);

    // useEffect(() => {
    //     if (localStorage.getItem('PAY_USER_TOKEN') === null) {
    //         navigate("/user/login");
    //     } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
    //         toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
    //         navigate("/user/login");
    //     }
    //     if (disable === true) {
    //         setEntity([]);
    //         getStock();
    //     }
    // }, [navigate, disable]);

    // const commentsData = useMemo(() => {
    //     let computedComments = entity;
    //     if (search) {
    //         computedComments = computedComments.filter(
    //             (stock) =>

    //                 stock.item?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //                 stock.item?.location?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //                 stock.quantity?.toString()?.toLowerCase()?.includes(search?.toLowerCase())

    //         );
    //     }
    //     setTotalItems(computedComments.length);

    //     return computedComments?.slice(
    //         (currentPage - 1) * limit,
    //         (currentPage - 1) * limit + limit
    //     );
    // }, [currentPage, search, limit, entity]);

    // const getStock = () => {
    //     const myurl = `${V_URL}/user/get-itemStock`;
    //     const bodyFormData = new URLSearchParams();
    //     bodyFormData.append('store_type', '2')
    //     axios({
    //         method: "post",
    //         url: myurl,
    //         data: bodyFormData,
    //         headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    //     }).then(async (response) => {
    //         console?.log("@@", response?.data);
    //         if (response?.data?.success) {
    //             const data = response.data.data;
    //             // const filteredData = data?.filter(e => e.firm_id?._id === localStorage.getItem('PAY_USER_FIRM_ID'));
    //             setEntity(data);
    //             setDisable(false);
    //         } else {
    //             toast.error("Something went wrong");
    //         }
    //     })
    //         .catch((error) => {
    //             toast.error("Something went wrong");
    //             console?.log("Errors", error);
    //         });
    // }

    // const handleRefresh = () => {
    //     setDisable(true);
    // }

    // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const handleOpen = () => {
    //     setIsSidebarOpen(!isSidebarOpen)
    // }


    return (
        //  <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
        //      <Header handleOpen={handleOpen} />
        //     <Sidebar />

        // <div className="page-wrapper">
        //         <div className="content">

        //             <div className="page-header">
        //                 <div className="row">
        //                     <div className="col-sm-12">
        //                         <ul className="breadcrumb">
        //                             <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
        //                             <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
        //                             <li className="breadcrumb-item active">Stock List</li>
        //                         </ul>
        //                     </div>
        //                 </div>
        //             </div>

        //             {disable === false ? (
        //                 <div className="row">
        //                     <div className="col-sm-12">
        //                         <div className="card card-table show-entire">
        //                             <div className="card-body">

        //                                 <div className="page-table-header mb-2">
        //                                     <div className="row align-items-center">
        //                                         <div className="col">
        //                                             <div className="doctor-table-blk">
        //                                                 <h3>Stock List</h3>
        //                                                 <div className="doctor-search-blk">
        //                                                     <div className="top-nav-search table-search-blk">
        //                                                         <form>
        //                                                             <Search
        //                                                                 onSearch={(value) => {
        //                                                                     setSearch(value);
        //                                                                     setCurrentPage(1);
        //                                                                 }} />
        //                                                             <a className="btn"><img src="/assets/img/icons/search-normal.svg"
        //                                                                 alt="firm-searchBox" /></a>
        //                                                         </form>
        //                                                     </div>
        //                                                     <div className="add-group">
        //                                                         <button type='button' onClick={handleRefresh}
        //                                                             className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
        //                                                                 src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
        //                                                     </div>
        //                                                 </div>
        //                                             </div>
        //                                         </div>
        //                                         <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
        //                                             <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
        //                                         </div>
        //                                     </div>
        //                                 </div>


        //                                 <div className="table-responsive">
        //                                     <table className="table border-0 custom-table comman-table  mb-0 datatable">
        //                                         <thead>
        //                                             <tr>
        //                                                 <th>Sr.</th>
        //                                                 <th>Item</th>
        //                                                 <th>Location</th>
        //                                                 <th>Balance Quantity</th>
        //                                                 <th>Store Type</th>
        //                                             </tr>
        //                                         </thead>
        //                                         <tbody>
        //                                             {commentsData.map((elem, i) =>
        //                                                 <tr key={elem?._id}>
        //                                                     <td>{(currentPage - 1) * limit + i + 1}</td>
        //                                                     <td>{elem?.item?.name}</td>
        //                                                     <td>{elem?.item?.location?.name}</td>
        //                                                     <td>{elem?.quantity}</td>
        //                                                     <td>{elem?.type === 1 ? (
        //                                                         <span className='custom-badge status-purple'>Main Store</span>
        //                                                     ) : (
        //                                                         <span className='custom-badge status-purple'>Sub Store</span>
        //                                                     )}
        //                                                     </td>
        //                                                 </tr>
        //                                             )}

        //                                             {commentsData?.length === 0 ? (
        //                                                 <tr>
        //                                                     <td colspan="999">
        //                                                         <div className="no-table-data">
        //                                                             No Data Found!
        //                                                         </div>
        //                                                     </td>
        //                                                 </tr>
        //                                             ) : null}
        //                                         </tbody>
        //                                     </table>
        //                                 </div>
        //                                 <div className="row align-center mt-3 mb-2">
        //                                     <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
        //                                         <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
        //                                             aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
        //                                     </div>
        //                                     <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
        //                                         <div className="dataTables_paginate paging_simple_numbers"
        //                                             id="DataTables_Table_0_paginate">
        //                                             <Pagination
        //                                                 total={totalItems}
        //                                                 itemsPerPage={limit}
        //                                                 currentPage={currentPage}
        //                                                 onPageChange={(page) => setCurrentPage(page)}
        //                                             />
        //                                         </div>
        //                                     </div>
        //                                 </div>

        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             ) : <Loader />}

        //         </div>
        //     </div> 
        //  </div>
        <></>
    )
}

export default Stock;