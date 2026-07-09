import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getUserIssueRequest } from '../../../../Store/Store/Issue/IssueRequest';
import IssueAcceptance from '../../../../Components/IssueRequestModal/IssueAcceptance';
import { V_URL } from '../../../../BaseUrl';
import { getUserOffer } from '../../../../Store/Store/Offer/getUserOffer';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { getStockReport } from '../../../../Store/Store/Stock/getStockReport';

const CreateIssue = () => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [disable2, setDisable2] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (disable === true) {
                try {
                    await dispatch(getUserIssueRequest())
                    setDisable(false);
                } catch (error) {
                    // console.log(error, '!!')
                    setDisable(false);
                }
            }
        }
        fetchData();
        dispatch(getUserOffer())
        dispatch(getStockReport())
    }, [dispatch, disable]);

    const entity = useSelector((state) => state?.getUserIssueRequest?.user?.data);
    const offerData = useSelector((state) => state?.getUserOffer?.user?.data);
    const stockReportData = useSelector((state) => state?.getStockReport?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        if (search) {
            computedComments = computedComments.filter(
                (i) =>
                    i?.contractorName?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.request_id?.requestNo?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.client?.name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        //Current Page slice
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = (elem) => {
        setShow(true);
        setModalData(elem);
    }

    const handleSubmitModal = (elemData) => {
        // console.log(elemData, 'elemData @@');
        setDisable2(true);
        const myurl = `${V_URL}/user/manage-issue-acceptance`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('issue_req_id', elemData?.issue_req_id);
        bodyFormData.append('issued_length', elemData?.length);
        bodyFormData.append('issued_width', elemData?.width);
        bodyFormData.append('issued_qty', elemData?.qty);
        bodyFormData.append('imir_no', elemData?.imir_no);
        bodyFormData.append('heat_no', elemData?.heat_no);
        bodyFormData.append('issued_by', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('remarks', elemData?.remark);
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))

        axios({
            method: 'post',
            url: myurl,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then((response) => {
            if (response.data.success === true) {
                toast.success(response?.data?.message);
                handleClose();
            } else {
                toast.error(response?.data?.message);
            }
            setDisable2(false);
        }).catch((error) => {
            // console.log(error, '!!')
            toast.error(error.response?.data?.message);
            setDisable2(false);
        })
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Material Issue Acceptance List</li>
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
                                                        <h3>Material Issue Acceptance List</h3>
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
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Issue Req. No.</th>
                                                        <th>Drawing No.</th>
                                                        <th>Section Details</th>
                                                        <th>Req. Qty.</th>
                                                        <th>Req. Width</th>
                                                        <th>Req. Length</th>
                                                        <th>Req. By</th>
                                                        <th>Date</th>
                                                        <th>Issue Acc.</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.issue_req_no}</td>
                                                            <td>{elem?.transaction_id?.drawingId?.drawing_no}</td>
                                                            <td>{elem?.transaction_id?.itemName?.name}</td>
                                                            <td>{elem?.requested_qty}</td>
                                                            <td>{elem?.requested_width}</td>
                                                            <td>{elem?.requested_length}</td>
                                                            <td>{elem?.requested_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD')}</td>
                                                            <td>
                                                                {elem?.status === 6 ? (
                                                                    <X />
                                                                ) : <button type='button' className='btn btn-primary' onClick={() => handleShow(elem)}>
                                                                    Issue
                                                                </button>
                                                                }
                                                            </td>
                                                            <td>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                )}
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
            <IssueAcceptance
                show={show}
                handleClose={handleClose}
                modalData={modalData}
                disable2={disable2}
                handleSubmitModal={handleSubmitModal}
                offerData={offerData}
                stockReportData={stockReportData}
            />
        </div >
    )
}

export default CreateIssue