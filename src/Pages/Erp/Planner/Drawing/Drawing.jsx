import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ERP, PLAN, V_URL } from '../../../../BaseUrl';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import axios from 'axios';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import Swal from 'sweetalert2';

const Drawing = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${ERP}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (localStorage.getItem('ERP_ROLE') !== `${PLAN}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            getDrawing();
            setEntity([]);
        }
    }, [navigate, disable, dispatch]);

    const commentsData = useMemo(() => {
        let computedComments = entity;

        if (search) {
            computedComments = computedComments.filter(
                (draw) =>
                    draw.project?.name?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    draw.drawing_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    draw.assembly_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    draw.grid_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    draw.item_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        //Current Page slice
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const getDrawing = () => {
        const myurl = `${V_URL}/user/get-drawing`;

        axios({
            method: "get",
            url: myurl,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data.success === true) {
                const data = response.data.data;
                const filteredData = data?.filter(e => e.firm_id?._id === localStorage.getItem('PAY_USER_FIRM_ID'));
                setEntity(filteredData);
                setDisable(false);
            }
        }).catch((error) => {
            setDisable(false);
        });
    }

    const handleDelete = (id, title) => {
        Swal.fire({
            title: `Are you sure want to delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                const myurl = `${V_URL}/user/delete-drawing`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);

                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        setDisable(true);
                    } else {
                        toast.error(response?.data?.message);
                    }
                }).catch((error) => {
                    toast.error("Something went wrong");
                    console?.log("Errors", error);
                });
            }
        });
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
                                    <li className="breadcrumb-item"><Link to="/erp/user/planner/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Drawing List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3> Drawing List</h3>
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
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <Link to="/erp/user/planner/manage-drawing"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus" /></Link>
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

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Project</th>
                                                        <th>Drawing No.</th>
                                                        <th>Lot No.</th>
                                                        <th>Assembly No.</th>
                                                        <th>Item No.</th>
                                                        {/* <th>Grid No.</th> */}
                                                        <th>Quantity</th>
                                                        {/* <th>Profile</th> */}
                                                        <th>Receive Date</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.project?.name}</td>
                                                            <td>{elem?.drawing_no}</td>
                                                            <td>{elem?.lot_no}</td>
                                                            <td>{elem?.assembly_no}</td>
                                                            <td>{elem?.item_no}</td>
                                                            {/* <td>{elem?.grid_no}</td> */}
                                                            <td>{elem?.quantity}</td>
                                                            {/* <td>{elem?.profile}</td> */}
                                                            <td>{moment(elem?.draw_receive_date).format('YYYY-MM-DD')}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === true ? (
                                                                    <span className="custom-badge status-green">True</span>
                                                                ) : (
                                                                    <span className="custom-badge status-pink">False</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/erp/user/planner/manage-drawing', { state: elem })}><i
                                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.drawing_no)} ><i
                                                                            className="fa fa-trash-alt m-r-5"></i> Delete</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colspan="999">
                                                                <div className="no-table-data">
                                                                    No Data Found!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null}
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
                    ) : <Loader />}

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Drawing