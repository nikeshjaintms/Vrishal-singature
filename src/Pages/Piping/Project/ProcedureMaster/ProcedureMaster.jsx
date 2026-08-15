import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import Loader from '../../Include/Loader';
import DropDown from '../../../../Components/DropDown';
import { getUserProcedureMaster } from '../../../../Store/Piping/Procedure/ProcedureMaster';
import { V_URL } from '../../../../BaseUrl';
import Swal from 'sweetalert2';
import axios from 'axios';
import toast from 'react-hot-toast';
import { statusProcedure } from '../../../../helper/StatusFile';
import { QaAuth } from '../../../../Routes/Users/Auth/AuthGuard';

const ProcedureMaster = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (disable === true) {
                dispatch(getUserProcedureMaster({ status: '' }));
                setDisable(false);
            }
        }
        fetchData();
    }, [dispatch, disable]);

    const entity = useSelector((state) => state?.getUserProcedureMaster?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        if (search) {
            const searchTerm = search.toLowerCase();
            computedComments = computedComments.filter(
                (i) =>
                    i?.client_doc_no?.toLowerCase().includes(searchTerm) ||
                    i?.vendor_doc_no?.toLowerCase().includes(searchTerm) ||
                    i?.ducument_no?.toLowerCase().includes(searchTerm) ||
                    i?.issue_no?.toLowerCase().includes(searchTerm)
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

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
                const myurl = `${V_URL}/user/delete-piping-procedure-specification`;
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
                    } else {
                        toast.error(response?.data?.message);
                    }
                    setDisable(true);
                }).catch((error) => {
                    toast.error(error?.response?.data?.message || "Something went wrong");
                });
            }
        });
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Procedure & Specification List</li>
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
                                                        <h3>Procedure & Specification List</h3>
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
                                                                <QaAuth>
                                                                    <Link to="/piping/user/manage-procedure-master"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                                                </QaAuth>
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
                                                        {/* <th>Procedure No.</th> */}
                                                        <th>Client Doc No.</th>
                                                        <th>Vendor Doc No.</th>
                                                        <th>Doc No.</th>
                                                        <th>Issue No.</th>
                                                        <th>PDF</th>
                                                        <th>Status</th>
                                                        <QaAuth>
                                                            <th className="text-end">Action</th>
                                                        </QaAuth>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            {/* <td>{elem?.procedure_no}</td> */}
                                                            <td>{elem?.client_doc_no}</td>
                                                            <td>{elem?.vendor_doc_no}</td>
                                                            <td>{elem?.ducument_no}</td>
                                                            <td>{elem?.issue_no}</td>
                                                            <td>
                                                                <a href={elem.pdf} target='_blank'>
                                                                    <img src='/assets/img/pdflogo.png' style={{ height: "30px" }} />
                                                                </a>
                                                            </td>
                                                            <td className='status-badge'>
                                                                <span className="custom-badge status-green">{statusProcedure(elem.status)}</span>
                                                            </td>
                                                            <QaAuth>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item"
                                                                                onClick={() => navigate('/piping/user/manage-procedure-master', { state: elem })}>
                                                                                <i className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                                Edit</button>
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.surface_preparation)} ><i
                                                                                className="fa fa-trash-alt m-r-5"></i> Delete</button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </QaAuth>
                                                        </tr>
                                                    )}

                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="999">
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

export default ProcedureMaster