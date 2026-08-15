import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import Loader from '../../Include/Loader';
import PaginationComponent from '../../Table/Pagination';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { getUserFinalCoating } from '../../../../Store/Erp/Painting/FinalCoating/FinalCoating';
import { useDispatch, useSelector } from 'react-redux';
import { PRODUCTION } from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';

const FinalCoatPaint = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [disable, setDisable] = useState(true);
    const [limit, setlimit] = useState(10);

    useEffect(() => {
        if (disable === true) {
            dispatch(getUserFinalCoating());
            setDisable(false);
        }
    }, [disable]);

    const entity = useSelector((state) => state?.getUserFinalCoating?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        const projectId = localStorage.getItem('U_PROJECT_ID');
        if (computedComments) {
            computedComments = computedComments?.filter(o =>
                o?.project_id?._id === projectId
            );
        }
        if (search) {
            computedComments = computedComments.filter(
                (final) =>
                    final?.voucher_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('voucher_no', elem.voucher_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'final-paint-download', body: bodyFormData });
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
                                    <li className="breadcrumb-item active">Final / Top Coating Offer List</li>
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
                                                        <h3>Final / Top Coating Offer List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === PRODUCTION && (
                                                                    <Link to="/piping/user/manage-final-coat"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                                                )}
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
                                                        <th>Offer No.</th>
                                                        <th>Report No.</th>
                                                        <th>Procedure No.</th>
                                                        <th>Dispatch No.</th>
                                                        <th>Offer By</th>
                                                        <th>Offer Date</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.voucher_no}</td>
                                                            <td>{elem?.voucher_no_two || '-'}</td>
                                                            <td>{elem?.procedure_no?.vendor_doc_no}</td>
                                                            <td>{elem?.dispatch_note?.lot_no}</td>
                                                            <td>{elem?.offered_by?.user_name}</td>
                                                            <td>{moment(elem.offer_date).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-final-coat', { state: elem })}>
                                                                            <i className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>
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
                                                    <PaginationComponent
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

export default FinalCoatPaint