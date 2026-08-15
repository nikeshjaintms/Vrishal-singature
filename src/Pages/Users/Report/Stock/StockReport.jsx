import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Loader from '../../Include/Loader';
import { Link, useNavigate } from 'react-router-dom';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { getRequest } from '../../../../Store/Store/Request/getRequest';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { V_URL } from '../../../../BaseUrl';
import moment from 'moment';

const StockReport = () => {
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(false);
    const [entity, setEntity] = useState([]);
    const [reqId, setReqId] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const requestData = useSelector((state) => state?.getRequest?.user?.data);

    useEffect(() => {
        dispatch(getRequest({ tag: '1' }));
        setIsLoading(false);
    }, [dispatch]);

    const getStockReport = () => {
        if (reqId) {
            setDisable(true);
            const myurl = `${V_URL}/user/generate-stock-report`;
            var bodyFormData = new URLSearchParams();
            bodyFormData.append("id", reqId);
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response?.data?.success === true) {
                    toast.success(response?.data?.message);
                    console.log(response.data.data);
                    setEntity(response.data.data?.items);
                }
                setDisable(false);
            }).catch((error) => {
                console.log(error, '!!');
                toast.error(error?.response?.data?.message)
            })
        } else {
            toast.error('Please select request id')
        }
    }

    const commentsData = useMemo(() => {
        let computedComments = entity;
        if (search) {
            computedComments = computedComments.filter(
                (request) =>
                    request?.requestId?.requestNo?.toString()?.toLowerCase().includes(search.toLowerCase())
            );
        }
        setTotalItems(computedComments.length);
        return computedComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, entity, search, limit]);

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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Stock Report List</li>
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
                                                    <h3>Stock Report List</h3>
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
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div>
                                        </div>
                                    </div>

                                    <form className='mt-4 mx-3'>
                                        <div className='row'>
                                            <div className='col-12 col-md-4 col-xl-3'>
                                                <select className='form-control form-select'
                                                    value={reqId}
                                                    onChange={(e) => setReqId(e.target.value)}>
                                                    <option value=''>Select Request No.</option>
                                                    {requestData?.map((e) =>
                                                        <option value={e?._id} key={e?._id}>{e?.requestNo}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-3">
                                                <div className="doctor-submit">
                                                    <button type="button" onClick={getStockReport}
                                                        className="btn btn-primary submit-list-form me-2" >Get Stock Report</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    <div className="table-responsive mt-4">
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Material PO No.</th>
                                                    <th>Req. No.</th>
                                                    <th>Section Details</th>
                                                    <th>Grade</th>
                                                    <th>unit</th>
                                                    <th>Req. Qty.</th>
                                                    <th>Off. Qty.</th>
                                                    <th>Off. Date</th>
                                                    <th>Off. Length</th>
                                                    <th>Off. NOS</th>
                                                    <th>Off. LOT no.</th>
                                                    <th>Inspected Qty.</th>
                                                    <th>Inspected Length</th>
                                                    <th>Inspected NOS</th>
                                                    <th>Inspected Date</th>
                                                    <th>Inspected LOT no.</th>
                                                    <th>Rej. Qty.</th>
                                                    <th>Rej. Length</th>
                                                    <th>Rej. NOS</th>
                                                    <th>IMIR NO.</th>
                                                    <th>MIV NO.</th>
                                                    <th>Issued Qty.</th>
                                                    <th>Issued Length(mm)</th>
                                                    <th>Issued Date</th>
                                                    <th>Heat No.</th>
                                                    <th>T.C. NO.</th>
                                                    <th>Bal. Length(mm)</th>
                                                    <th>Bal. Qty.</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        <td>{elem?.issue?.project?.work_order_no}</td>
                                                        <td>{elem?.issue?.request_id?.requestNo}</td>
                                                        <td>{elem?.issue?.itemName?.name}</td>
                                                        <td>{elem?.issue?.itemName?.material_grade}</td>
                                                        <td>{elem?.issue?.itemName?.unit?.name}</td>
                                                        <td>{elem.issue?.requestedQty}</td>
                                                        <td>{elem.offer?.offeredQty}</td>
                                                        <td>{moment(elem?.offer?.createdAt).format('YYYY-MM-DD')}</td>
                                                        <td>{elem?.offer?.offerLength}</td>
                                                        <td>{elem?.offer?.offerNos}</td>
                                                        <td>{elem?.offer?.lotNo}</td>
                                                        <td>{elem?.offer?.acceptedQty}</td>
                                                        <td>{elem?.offer?.acceptedLength}</td>
                                                        <td>{elem?.offer?.acceptedNos}</td>
                                                        <td>{moment(elem?.offer?.updatedAt)?.format('YYYY-MM-DD')}</td>
                                                        <td>{elem?.offer?.lotNo}</td>
                                                        <td>{elem?.offer?.rejectedQty}</td>
                                                        <td>{elem?.offer?.rejected_length}</td>
                                                        <td>{elem?.offer?.rejected_nos}</td>
                                                        <td>{elem?.offer?.imir_no}</td>
                                                        <td>{elem?.issue?.miv_no}</td>
                                                        <td>{elem?.issue?.issuedQty}</td>
                                                        <td>{elem?.issue?.issued_length}</td>
                                                        <td>{moment(elem?.issue?.issueDate).format('YYYY-MM-DD')}</td>
                                                        <td>{elem?.issue?.heat_no}</td>
                                                        <td>{elem?.offer?.tcNo || '-'}</td>
                                                        <td>-</td>
                                                        <td>{elem?.balance_qty}</td>
                                                        <td>-</td>
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
                </div>
            </div>
        </div>
    )
}

export default StockReport