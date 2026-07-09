import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { QC, V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { Check, PackageCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';
import StatusList from '../../Components/StatusFilterList/StatusList';
import { statusForQc } from '../../Components/StatusFilterList/AllStatus';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import { useSelector } from 'react-redux';

const VerifyRequest = () => {

    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const [status, setStatus] = useState('');
    useEffect(() => {
        if (disable === true) {
            setEntity([]);
            getOffer();
        }
    }, [navigate, disable]);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        if (computedComments) {
            computedComments = computedComments.filter(
                (fit) => fit.status !== 1
            );
        }
        if (search) {
            computedComments = computedComments.filter(
                (req) =>
                    req.offer_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    req.transactionId?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        if (status) {
            computedComments = computedComments.filter((request) => parseInt(request.status) === parseInt(status));
        }

        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity, status]);

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };
  const projectId = localStorage.getItem('U_PROJECT_ID');

    const getOffer = () => {
        // const myurl = `${V_URL}/user/get-purchase-offer-piping`;
            const myurl = `${V_URL}/user/get-purchase-offer-piping?page=${currentPage}&limit=${limit}&projectId=${projectId}&search=${search}`;
        
        axios({
            method: "post",
            url: myurl,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            // console.log(response.data, '@@');
            if (response.data.success === true) {
                const data = response.data?.data;
                const filteredData = data?.data?.filter(e => e?.requestId?.project?._id === localStorage.getItem('U_PROJECT_ID'));
                setEntity(filteredData);
                setDisable(false);
            }
        }).catch((error) => {
            console.log(error, '!!');
            setDisable(false);
        });
    }

    const handleDownloadIns = (elem) => {
        console.log(elem, '@@@')
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('requestId', elem?.requestId?._id);
        bodyFormData.append('imir_no', elem?.imir_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'get-material-inspection-item-piping', body: bodyFormData });
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
        setStatus('');
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Offer No. List</li>
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
                                                        <h3>Offer No. List</h3>
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

                                                <StatusList statusOptions={statusForQc} value={status} onChange={handleStatusChange} />

                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        {/* <th>Req. No.</th> */}
                                                        <th>Off. No.</th>
                                                        <th>Off. By</th>
                                                        <th>Off. Date</th>
                                                        <th>IMIR No.</th>
                                                        {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            {/* <td>{elem?.requestId?.requestNo}</td> */}
                                                            <td>{elem?.offer_no}</td>
                                                            <td>{elem?.offeredBy?.user_name}</td>
                                                            <td>{moment(elem?.received_date).format('YYYY-MM-DD')}</td>
                                                            <td>{elem?.imir_no || '-'}</td>
                                                            {/* <td>{moment(elem?.createdAt).format('YYYY-MM-DD')}</td> */}
                                                            {/* Status 1, pending, 2 qc, 3 app, 4 rej, 5 partial,  */}
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>{(elem?.status === 4) ? (
                                                                    <span style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title="rejected" >
                                                                        <X />
                                                                    </span>
                                                                ) : localStorage.getItem('ERP_ROLE') === QC && (elem.status === 3 || elem?.status === 5) ? (
                                                                    <span style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title="verified" >
                                                                        <Check />
                                                                    </span>
                                                                ) :
                                                                    <span style={{ cursor: "pointer" }} onClick={() => navigate('/piping/user/manage-verify-request', { state: elem })}>
                                                                        <PackageCheck />
                                                                    </span>
                                                                }
                                                                </td>
                                                            )}
                                                            <td>
                                                                <span className={`custom-badge ${elem.status === 1 ? 'status-orange' :
                                                                    elem.status === 2 ? 'status-blue' :
                                                                        elem.status === 3 ? 'status-green' :
                                                                            elem.status === 4 ? 'status-pink' :
                                                                                elem.status === 5 ? 'status-purple' : ''
                                                                    }`}>
                                                                    {elem.status === 1 ? 'Pending' :
                                                                        elem.status === 2 ? 'Send to QC' :
                                                                            elem.status === 3 ? 'Approved By QC' :
                                                                                elem.status === 4 ? 'Rejected' :
                                                                                    elem.status === 5 ? 'Partial Approved' : ''}
                                                                </span>
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/view-qc-request', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i>
                                                                            View
                                                                        </button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)}>
                                                                            <i className="fa-solid fa-download m-r-5"></i>
                                                                            Donwload Inspection
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
                                                    aria-live="polite">Showing {Math?.min(limit, totalItems)} from {totalItems} data</div>
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