import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import Footer from '../../../Include/Footer';
import { Pagination, Search } from '../../../Table';
import Loader from '../../../Include/Loader';
import moment from 'moment';
import DropDown from '../../../../../Components/DropDown';
import { BadgeCheck, X } from 'lucide-react';
import { QC } from '../../../../../BaseUrl';
import { getFtClearance } from '../../../../../Store/Piping/Ndt/FT/getFTClearance';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { getUserFtAdded } from '../../../../../Store/Piping/Ndt/FT/FTOfferadded';

const MultiFTClearance = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [totalItems1, setTotalItems1] = useState(0);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
    const [refreshTrigger1, setRefreshTrigger1] = useState(0);
    const [totalItems2, setTotalItems2] = useState(0);

    useEffect(() => {
        dispatch(getUserFtAdded({ page: currentPage, limit: limit, search: search, status: "1" }));
    }, [dispatch, currentPage, limit, search]);

    useEffect(() => {
        dispatch(getFtClearance({ page: currentPage1, limit: limit1, search: search1 }));
    }, [dispatch, currentPage1, limit1, search1]);

    const entity2 = useSelector((state) => state.getFtClearance?.user?.data);
    const entity3 = useSelector((state) => state.getUserFtAdded?.user?.data);
    const userState1 = useSelector((state) => state.getUserFtAdded?.user);
    const userState2 = useSelector((state) => state.getFtClearance?.user);

//     console.log(entity3, 'entity3');

    const commentsData = useMemo(() => {
        let computedComments = entity3 || [];
        // computedComments = computedComments?.filter((item) => item.status === 1);

        // Group items by report_no to handle multiple items per report
        const grouped = computedComments.reduce((acc, item) => {
            if (!acc[item.report_no]) {
                acc[item.report_no] = { ...item, items: [] };
            }
            acc[item.report_no].items.push(item);
            return acc;
        }, {});
        return Object.values(grouped);
    }, [entity3]);

    useEffect(() => {
        const total = userState1?.pagination?.totalItems || userState1?.total || userState1?.count || 0;
        setTotalItems1(total);
    }, [userState1]);

    const commentsData2 = useMemo(() => {
        let computedComments = entity2 || [];
        // computedComments = computedComments?.filter((item) => [2, 3, 4].includes(item.status));

        // Group items by report_no to handle multiple items per report
        const grouped = computedComments.reduce((acc, item) => {
            if (!acc[item.report_no]) {
                acc[item.report_no] = { ...item, items: [] };
            }
            acc[item.report_no].items.push(item);
            return acc;
        }, {});
        return Object.values(grouped);
    }, [entity2]);

    useEffect(() => {
        const total = userState2?.pagination?.totalItems || userState2?.total || userState2?.count || 0;
        setTotalItems2(total);
    }, [userState2]);

    const handleRefresh = () => {
        setSearch('');
        setCurrentPage(1);
        setRefreshTrigger(prev => prev + 1);
    }

    const handleRefresh1 = () => {
        setSearch1('');
        setCurrentPage1(1);
        setRefreshTrigger1(prev => prev + 1);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-ft-inspection', body: bodyFormData });
    }
    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">

                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                            { name: " FT List", link: "/piping/user/ft-offer-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'}  Ferrite Test Offer`, active: true }
                        ]} />

                        {/* {disable === false ? ( */}
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Ferrite Test Offering List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form onSubmit={(e) => e.preventDefault()}>
                                                                    <Search
                                                                        key={refreshTrigger}
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
                                                    <DropDown limit={limit} onLimitChange={(val) => {
                                                        setlimit(val);
                                                        setCurrentPage(1);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Off. Report No.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Spool No. </th>
                                                        <th>Off. By</th>
                                                        <th>Date</th>
                                                        <th>Verify</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
                                                            <td>{elem?.items
                                                                ?.map(e => e?.drawing_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .map((value, index) => (
                                                                <span key={index}>
                                                                    {value}
                                                                    <br />
                                                                </span>
                                                                )) || "-"}</td>
                                                            <td>{elem?.items
                                                                ?.map(e => e?.spool_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .map((value, index) => (
                                                                <span key={index}>
                                                                    {value}
                                                                    <br />
                                                                </span>
                                                                )) || "-"}</td>
                                                            <td>{elem?.offered_by?.name || '-'}</td>
                                                            <td>{elem?.createdAt ? moment(elem?.createdAt).format('YYYY-MM-DD') : '-'}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/piping/user/manage-ft-clearance', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : <X />}
                                                                </td>
                                                            )}
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : elem.status === 4 ? (
                                                                    <span className="custom-badge status-purple">Partially</span>
                                                                ) : null}
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
                                                    aria-live="polite">Showing {totalItems1 > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalItems1)} of {totalItems1} entries</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems1}
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
                        {/* ) : <Loader />} */}

                         {/* {disable1 === false ? ( */}
                         <div className="row">
                             <div className="col-sm-12">
                                 <div className="card card-table show-entire">
                                     <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Ferrite Test Clearance List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form onSubmit={(e) => e.preventDefault()}>
                                                                    <Search
                                                                        key={refreshTrigger1}
                                                                        onSearch={(value) => {
                                                                            setSearch1(value);
                                                                            setCurrentPage1(1);
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
                                                    <DropDown limit={limit1} onLimitChange={(val) => {
                                                        setlimit1(val);
                                                        setCurrentPage1(1);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        <th>Off. Report No.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Spool No. </th>
                                                        <th>Qc. By</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th className='text-end'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData2?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
                                                            <td>{elem?.report_no_two ?? '-'}</td>
                                                            <td>{elem?.report_no ?? '-'}</td>
                                                            <td>{elem?.items
                                                                ?.map(e => e?.drawing_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .map((value, index) => (
                                                                <span key={index}>
                                                                    {value}
                                                                    <br />
                                                                </span>
                                                                )) || "-"}</td>
                                                            <td>{elem?.items
                                                                ?.map(e => e?.spool_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .map((value, index) => (
                                                                <span key={index}>
                                                                    {value}
                                                                    <br />
                                                                </span>
                                                                )) || "-"}</td>
                                                            <td>{elem?.qc_by?.name ?? '-'}</td>
                                                            <td>{elem?.qc_date ? moment(elem.qc_date).format('YYYY-MM-DD') : '-'}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : elem.status === 4 ? (
                                                                    <span className="custom-badge status-purple">Partially</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        {/* <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-FT-clearance', { state: elem })}><i
                                                                            className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button> */}
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)}>
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>

                                                                     </div>
                                                                 </div>
                                                             </td>
                                                         </tr>
                                                     )}

                                                    {commentsData2?.length === 0 ? (
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
                                                    aria-live="polite">Showing {totalItems2 > 0 ? (currentPage1 - 1) * limit1 + 1 : 0} to {Math.min(currentPage1 * limit1, totalItems2)} of {totalItems2} entries</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems2}
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
                        {/* ) : <Loader />} */}

                     </div>
                     <Footer />
                 </div>
             </div>
         </>
     )
 }

export default MultiFTClearance