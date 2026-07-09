import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { PLAN } from '../../../../BaseUrl';
import { getMultiInvoice } from '../../../../Store/MutipleDrawing/Invoice/getMultiInvoice';
import Loader from '../../Include/Loader';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';

const MultiInvoice = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (disable) {
            dispatch(getMultiInvoice());
            setDisable(false);
        }
    }, [disable]);

    const entity = useSelector((state) => state?.getMultiInvoice?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity || [];
        if (search) {
            computedComments = computedComments.filter(
                (it) =>
                    it.voucher_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleDownloadReport = (elem, status) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', elem._id);
        bodyFormData.append('isOriginal', status);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-pdf-invoice', body: bodyFormData });
    }

    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={
                        [
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Invoice List", active: true },
                        ]
                    } />

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Invoice List</h3>
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
                                                                {localStorage.getItem("ERP_ROLE") === PLAN ? <Link to="/user/project-store/manage-invoice"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus" /></Link> : ""
                                                                }
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
                                                        <th>RA.</th>
                                                        <th>Invoice No.</th>
                                                        <th>Invoice Date</th>
                                                        <th>Project PO No.</th>
                                                        <th>Project PO Date.</th>
                                                        <th className='text-end'>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.ra}</td>
                                                            <td>{elem?.invoiceNo}</td>
                                                            <td>{elem?.invoiceDate ? moment(elem?.invoiceDate).format('YYYY-MM-DD') : '-'}</td>
                                                            <td>{elem?.projectPoNo}</td>
                                                            <td>{elem?.projectPoDate ? moment(elem?.projectPoDate).format('YYYY-MM-DD') : '-'}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        {/* <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-invoice', { state: elem })}><i className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button> */}
                                                                        {moment().diff(moment(elem?.createdAt), 'days') < 2 && (
                                                                            <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-invoice', { state: elem })}><i className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                                Edit</button>
                                                                        )}
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadReport(elem, true)}>
                                                                            <i className="fa-solid fa-download  m-r-5"></i>Download Original</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadReport(elem, false)}>
                                                                            <i className="fa-solid fa-download  m-r-5"></i>Download Duplicate</button>
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
            </div>
        </div>
    )
}

export default MultiInvoice