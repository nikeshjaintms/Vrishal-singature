import React, { useEffect, useState, useMemo } from 'react'
import { P_STORE } from '../../../BaseUrl';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import DropDown from '../../../Components/DropDown';
import { Pagination, Search } from '../Table';
import Footer from '../Include/Footer';

const Request = () => {

    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            setEntity([]);
            getRequest();
        }
    }, [navigate, disable]);


    // const commentsData = useMemo(() => {
    //     let computedComments = entity;

    //     setTotalItems(computedComments.length);
    // }, [entity, search, limit])

    const getRequest = () => {
        
    }

    const handleRefresh = () => {
        setDisable(true);
    }
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/product-store/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Request List</li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">

                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Request List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search
                                                                    onSearch={(value) => {
                                                                        setSearch(value);
                                                                        setCurrentPage(1);
                                                                    }} />
                                                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="firm-searchBox" /></a>
                                                            </form>
                                                        </div>
                                                        <div className="add-group">
                                                            <button type='button' onClick={handleRefresh}
                                                                className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                    src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive" style={{ paddingBottom: "120px" }}>
                                        <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Item</th>
                                                    <th>Item Grade</th>
                                                    <th>Unit</th>
                                                    <th>Quantity</th>
                                                    <th>Project</th>
                                                    <th>Department</th>
                                                    <th>Receive Date</th>
                                                    <th className="text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Aluminium Foil</td>
                                                    <td>IS2062 GR.E250</td>
                                                    <td>KG</td>
                                                    <td>100</td>
                                                    <td>Bridge Construction</td>
                                                    <td>Civil 2</td>
                                                    <td>2024-05-14</td>
                                                    <td className="text-end">
                                                        <div className="dropdown dropdown-action">
                                                            <a href="#" className="action-icon dropdown-toggle"
                                                                data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                    className="fa fa-ellipsis-v"></i></a>
                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                <button type='button' className="dropdown-item" ><i
                                                                    className="fa-solid fa-eye m-r-5"></i>
                                                                    View</button>
                                                                <button type='button' className="dropdown-item" ><i
                                                                    className="fa-solid fa-check m-r-5"></i>
                                                                    Approve</button>
                                                                <button type='button' className="dropdown-item" ><i
                                                                    className="fa-solid fa-xmark m-r-5"></i>
                                                                    Reject</button>
                                                                {/* <button type='button' className="dropdown-item"><i
                                                                    className="fa fa-trash-alt m-r-5"></i> Delete</button> */}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                            <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="DataTables_Table_0_paginate">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={(page) => setCurrentPage(page)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Request