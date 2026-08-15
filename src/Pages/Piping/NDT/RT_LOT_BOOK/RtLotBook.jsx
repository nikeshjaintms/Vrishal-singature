import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../../Include/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../Include/Loader'
import { Pagination, Search } from '../../Table'
import DropDown from '../../../../Components/DropDown'
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp'
import { QC } from '../../../../BaseUrl'
// import { getUserMultiNdtMaster } from '../../../../Store/MutipleDrawing/MultiNDT/getUserMultiNdtMaster'
import { getMultiRtLotPiping } from '../../../../Store/Piping/Ndt/RT-LOT/RtLot';
import moment from 'moment'
import StatusBadge from '../../Components/StatusBadge'

const useDebounce = (value, delay = 600) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

const RtLotBook = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const debouncedSearch = useDebounce(search, 600);

    useEffect(() => {
        dispatch(getMultiRtLotPiping({
            project_id: localStorage.getItem('U_PROJECT_ID'),
            page: currentPage,
            limit: limit,
            search: debouncedSearch
        })).then(() => {
            setDisable(false);
        });
    }, [dispatch, currentPage, limit, debouncedSearch]);

    const entityArray = useSelector((state) => state?.getMultiRtLotPiping?.offers);
    const totalCount = useSelector((state) => state?.getMultiRtLotPiping?.pagination?.total);

    useEffect(() => {
        if (totalCount !== undefined) {
            setTotalItems(totalCount);
        }
    }, [totalCount]);

    const commentsData = useMemo(() => {
        return entityArray || [];
    }, [entityArray]);

    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no', elem.lot_number);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'piping/download-rt-lot-pdf', body: bodyFormData });
    }

    const handleEdit = (elem) => {
        navigate('/piping/user/manage-rt-lot-book-management', { state: { data: elem, is_view: false, is_edit: true } });
    }

    const handleView = (elem) => {
        navigate('/piping/user/manage-rt-lot-book-management', { state: { data: elem, is_view: true, is_edit: false } });
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
                                    <li className="breadcrumb-item active">RT Lot Book List</li>
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
                                                        <h3>RT Lot Book List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === QC &&
                                                                    <Link to="/piping/user/manage-rt-lot-book-management"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                }
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => {
                                                        setlimit(val);
                                                        setCurrentPage(1);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Lot No.</th>

                                                        <th>Spool No.</th>
                                                        <th>Offer By.</th>
                                                        <th>Date</th>

                                                        <th>RT%</th>

                                                        <th>Status</th>
                                                        <th className="text-end">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {commentsData?.map((elem, i) => {


                                                        return (
                                                            <tr key={elem?._id}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.lot_number}</td>
                                                                <td>{elem?.items?.map((item) => item?.spool_no).join(", ")}</td>
                                                                <td>{elem?.offered_by}</td>
                                                                <td>{moment(elem?.offer_date).format('YYYY-MM-DD HH:mm')}</td>
                                                                <td>{elem?.items?.[0]?.ndt_percentage}</td>
                                                                <td>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem.status === 2 ? (
                                                                        <span className="custom-badge status-green">Completed</span>
                                                                    ) : (
                                                                        <span className="custom-badge status-purple">Other</span>
                                                                    )}
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item" onClick={() => handleView(elem)} >
                                                                                <i className="fa-solid fa-eye  m-r-5"></i> View
                                                                            </button>
                                                                            {elem.status === 1 && (
                                                                                <button type='button' className="dropdown-item" onClick={() => handleEdit(elem)} >
                                                                                    <i className="fa-solid fa-edit  m-r-5"></i> Edit
                                                                                </button>
                                                                            )}
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download PDF
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}

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
                                                    aria-live="polite">Showing {commentsData?.length || 0} from {totalItems} data</div>
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

export default RtLotBook