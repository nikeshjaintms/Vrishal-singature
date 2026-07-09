import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import { Pagination, Search } from '../../../Table';
import { QC } from '../../../../../BaseUrl';
import DropDown from '../../../../../Components/DropDown';
import moment from 'moment';
import Loader from '../../../Include/Loader';
import Footer from '../../../Include/Footer';
import { getPipingMultiStockSurfaceOffer } from '../../../../../Store/Piping/MultiStockSurface/GetStockSurfaseOffer';
import { BadgeCheck, X } from 'lucide-react';

const MultiSurfaceClearance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [disable, setDisable] = useState(true);
    const [limit, setlimit] = useState(10);

    const [search1, setSearch1] = useState("");
    const [currentPage1, setCurrentPage1] = useState(1);
    const [disable1, setDisable1] = useState(true);
    const [limit1, setlimit1] = useState(10);

    useEffect(() => {
        if (disable === true || disable1 === true) {
            dispatch(getPipingMultiStockSurfaceOffer());
            setDisable(false);
            setDisable1(false);
        }
    }, [disable, disable1]);

    const entity = useSelector((state) => {
        const data = state.getPipingMultiStockSurfaceOffer?.user?.data?.data;
        return Array.isArray(data) ? data : [];
    });

    const filteredData = useMemo(() => {
        let computedComments = entity;

        // Group by _id to remove duplicates and merge items
        const groupedMap = new Map();
        computedComments.forEach((item) => {
            const id = item._id;
            if (groupedMap.has(id)) {
                const existing = groupedMap.get(id);
                // Merge items safely
                if (item.items && Array.isArray(item.items)) {
                    existing.items = [...(existing.items || []), ...item.items];
                }
            } else {
                // Clone to avoid mutating original redux state if deeper shallow copy needed
                groupedMap.set(id, { ...item, items: item.items ? [...item.items] : [] });
            }
        });
        return Array.from(groupedMap.values());
    }, [entity]);

    const pendingItems = useMemo(() => {
        let computedComments = filteredData || [];
        computedComments = computedComments.filter((fi) => fi?.status === 1);
        if (search) {
            computedComments = computedComments.filter(
                (fit) =>
                    fit?.items?.some((e) => e?.drawing_no?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.assembly_no?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.dispatch_report?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.dispatch_site?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.procedure_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    fit?.paint_system_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        return computedComments;
    }, [search, filteredData]);

    const totalItems = pendingItems.length;

    const commentsData = useMemo(() => {
        return pendingItems.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, limit, pendingItems]);


    const completedItems = useMemo(() => {
        let computedComments = filteredData || [];
        computedComments = computedComments.filter((fi) => fi?.status !== 1);
        if (search1) {
            computedComments = computedComments.filter(
                (fit) =>
                    fit?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    fit?.paint_system_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    fit?.qc_name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        return computedComments;
    }, [search1, filteredData]);

    const totalItems1 = completedItems.length;

    const commentsData1 = useMemo(() => {
        return completedItems.slice(
            (currentPage1 - 1) * limit1,
            (currentPage1 - 1) * limit1 + limit1
        );
    }, [currentPage1, limit1, completedItems]);

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two)
        bodyFormData.append('isOffer', false);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'piping-download-multi-stock-surface', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
    }
    const handleRefresh1 = () => {
        setDisable1(true);
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
                                    <li className="breadcrumb-item active">Surface Acceptance</li>
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
                                                        <h3>Surface & Primer Offering List</h3>
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
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Offer No.</th>
                                                       
                                                        <th> Items</th>
                                                        {/* <th>Piping Class</th> */}
                                                        <th>Paint System No.</th>
                                                        <th>Offered By</th>
                                                        <th>Date</th>
                                                        {localStorage.getItem('ERP_ROLE') === QC && (
                                                            <th>Verify</th>)}
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem.report_no}</td>
                                                           
                                                         
                                                            <td>
                                                                {elem?.items?.length ? (
                                                                    [...new Set(
                                                                    elem.items.flatMap((e) => {
                                                                        // ✅ if item_name has values → use it
                                                                        if (Array.isArray(e?.item_name) && e.item_name.length > 0) {
                                                                        return e.item_name;
                                                                        }

                                                                        // ✅ fallback to spool_no
                                                                        if (e?.spool_no) {
                                                                        return [e.spool_no];
                                                                        }

                                                                        return [];
                                                                    })
                                                                    )].map((tag, index) => (
                                                                    <div key={index}>{tag}</div>
                                                                    ))
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </td>
                                                            {/* <td>{elem?.PipingClass}</td> */}
                                                            <td>{elem?.paint_system_no}</td>
                                                            <td>{elem?.offer_name}</td>
                                                            <td>{moment(elem.offer_date).format('YYYY-MM-DD HH:mm')}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/piping/user/manage-stock-surface-clearance', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : <X />}
                                                                </td>
                                                            )}

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

                    {disable1 === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Surface & Primer Clearance List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch1(value);
                                                                            setCurrentPage(1);
                                                                        }} />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh1}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        {/* <th>Offer No.</th> */}
                                                       
                                                        <th>Item</th>
                                                        <th>Paint System No.</th>
                                                        <th>QC By</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData1?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no_two}</td>
                                                       
                                                        
                                                            <td>
                                                                {elem?.items?.length ? (
                                                                    [...new Set(
                                                                    elem.items.flatMap((e) => {
                                                                        // ✅ if item_name has values → use it
                                                                        if (Array.isArray(e?.item_name) && e.item_name.length > 0) {
                                                                        return e.item_name;
                                                                        }

                                                                        // ✅ fallback to spool_no
                                                                        if (e?.spool_no) {
                                                                        return [e.spool_no];
                                                                        }

                                                                        return [];
                                                                    })
                                                                    )].map((tag, index) => (
                                                                    <div key={index}>{tag}</div>
                                                                    ))
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </td>
                                                            <td>{elem?.paint_system_no}</td>
                                                            <td>{elem?.qc_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === 2 ? (
                                                                    <span className="custom-badge status-purple">Partially</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 4 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        {/* <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/view-surface-clearance', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i> View</button> */}
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download PDF</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData1?.length === 0 ? (
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
                                                    aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems1}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        onPageChange={(page) => setCurrentPage1(page)}
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
        </div >
    )
}

export default MultiSurfaceClearance