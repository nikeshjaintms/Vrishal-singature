import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import Footer from '../Include/Footer';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Check, Pencil, X } from 'lucide-react';
import { adminRequest } from '../../Users/Components/StatusFilterList/AllStatus';
import StatusList from '../../Users/Components/StatusFilterList/StatusList';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';

const VerifyRequest = () => {

    const navigate = useNavigate();
    const [entity, setEntity] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [status, setStatus] = useState('');


    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }

        if (disable === true) {
            setEntity([]);
            getRequest();
        }
    }, [disable, navigate]);

//     const commentsData = useMemo(() => {
//         //let computedComments = entity;
//    let computedComments = Array.isArray(entity) ? [...entity] : [];
//         if (search) {
//             computedComments = computedComments.filter(
//                 (request) =>
//                     request.material_po_no?.toString().toLowerCase().includes(search.toLowerCase()) ||
//                     // request.requestNo?.toString().toLowerCase().includes(search.toLowerCase()) ||
//                     request.project?.name.toLowerCase().includes(search.toLowerCase()) ||
//                     request.department?.name.toLowerCase().includes(search.toLowerCase()) ||
//                     request.drawing_id?.drawing_no.toLowerCase().includes(search.toLowerCase())
//             );
//         }

//         if (status) {
//             computedComments = computedComments.filter((request) => parseInt(request.status) === parseInt(status));
//         }

//         setTotalItems(computedComments.length);
//         return computedComments.slice(
//             (currentPage - 1) * limit,
//             (currentPage - 1) * limit + limit
//         );
//     }, [currentPage, entity, search, limit, totalItems, status]);

const commentsData = useMemo(() => {
    let computedComments = Array.isArray(entity) ? [...entity] : [];

    if (search) {
        computedComments = computedComments.filter(
            (request) =>
                request.material_po_no?.toString().toLowerCase().includes(search.toLowerCase()) ||
                request.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
                request.department?.name?.toLowerCase().includes(search.toLowerCase()) ||
                request.drawing_id?.drawing_no?.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (status) {
        computedComments = computedComments.filter(
            (request) => parseInt(request.status) === parseInt(status)
        );
    }

    return computedComments;
}, [entity, search, status]);

// keep totalItems in sync separately
useEffect(() => {
    setTotalItems(commentsData.length);
}, [commentsData]);

// paginate here
const paginatedData = useMemo(() => {
    return commentsData.slice(
        (currentPage - 1) * limit,
        (currentPage - 1) * limit + limit
    );
}, [commentsData, currentPage, limit]);

    const getRequest = () => {
        const myurl = `${V_URL}/admin/get-request-to-admin`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('tag', '1');
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('VA_TOKEN') },
        }).then(async (response) => {
            console?.log("@@", response?.data);
            if (response?.data?.success) {
                // const data = response.data.data;
                 const data = response.data.data?.data || [];
              
                // const finalData = data?.filter((fi) => fi?.status === 1);
                setEntity(data);
                setDisable(false);
            } else {
                toast.error("Something went wrong");
            }
        }).catch((error) => {
            toast.error("Something went wrong");
            console?.log("Errors", error);
        });
    }

    const handleRefresh = () => {
        setDisable(true);
        setStatus('');
        setSearch('');
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('requestId', elem._id);
        bodyFormData.append('print_date', true);
        const myurl = `${V_URL}/admin/get-store-request-item`;
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') },
        }).then((response) => {
            if (response?.data?.success) {
                const fileUrl = response.data.data.file;
                toast.success(response?.data?.message);
                window.open(fileUrl, '_blank');
            } else {
                toast.error(response?.data?.message);
            }
        }).catch((error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Error occurred while downloading the file.');
        });
    }

    const handleApprove = (id, no, status) => {
        let actionText = status === 2 ? "Approve" : "Reject";
        let confirmButtonText = status === 2 ? "Yes, approve it!" : "Yes, reject it!";
        let iconText = status === 2 ? 'success' : 'error'
        Swal.fire({
            title: `Are you sure you want to ${actionText} ${no}?`,
            text: "You won't be able to revert this!",
            icon: iconText,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmButtonText
        }).then((result) => {
            if (result.isConfirmed) {

                const myurl = `${V_URL}/admin/verify-request`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);
                bodyFormData.append('status', status);
                bodyFormData.append('adminEmail', localStorage.getItem('VA_EMAIL'));
                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Bearer " + localStorage.getItem('VA_TOKEN')
                    },
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        setDisable(true);
                    } else {
                        toast.error(response?.data?.message);
                    }
                }).catch((error) => {
                    toast.error("Something went wrong" || error?.response?.data?.message);
                });
            }
        });
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Material PO NO List</li>
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
                                                        <h3>Material PO NO List</h3>
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
                                                <StatusList statusOptions={adminRequest} value={status} onChange={handleStatusChange} />
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive" style={{ paddingBottom: '100px' }}>
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Material PO No.</th>
                                                        <th>Project</th>
                                                        <th>Department</th>
                                                        <th>Req. Date</th>
                                                        <th>Status</th>
                                                        <th>Acc/Rej</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.material_po_no}</td>
                                                            <td>{elem?.project?.name}</td>
                                                            <td>{elem?.department?.name}</td>
                                                            <td>{moment(elem?.requestDate).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem?.status === 4 ? (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                ) : elem?.status === 5 ? (
                                                                    <span className="custom-badge status-green">All Received</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Approved By Admin</span>
                                                                ) : <span>Unknown</span>}
                                                            </td>
                                                            <td className='d-flex gap-2'>
                                                                {elem.status === 1 ? (
                                                                    <>
                                                                        <span className='present-table attent-status' style={{ cursor: 'pointer' }} onClick={() => handleApprove(elem._id, elem?.requestNo, 2)}><Check /></span>
                                                                        <span className='absent-table attent-status' style={{ cursor: 'pointer' }} onClick={() => handleApprove(elem._id, elem?.requestNo, 3)}><X /></span>
                                                                    </>
                                                                ) : (<X />)}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/admin/view-request', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i>
                                                                            View
                                                                        </button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Report
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
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

export default VerifyRequest