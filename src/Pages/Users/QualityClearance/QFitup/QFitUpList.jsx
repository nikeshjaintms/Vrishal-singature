import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { getUserFitup } from '../../../../Store/Store/Execution/getUserFitup';
import { BadgeCheck, X } from 'lucide-react';
import { QC } from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import FitupModalList from '../../Execution/Fitup/FitupReportModal/FitupModalList';
import { getMultiFitup } from '../../../../Store/MutipleDrawing/MultiFitup/getMultiFitup';

const QFitUpList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (disable === true) {
            // dispatch(getUserFitup({ status: '' }))
            dispatch(getMultiFitup({ page: currentPage, limit, search }));
            setDisable(false);
        }
        else{
             dispatch(getMultiFitup({ page: currentPage, limit ,search}));
            setDisable(false);
        }
    }, [dispatch, disable,currentPage , limit,search ]);




    // const entity = useSelector((state) => state?.getUserFitup?.user?.data);
    const entity = useSelector((state) => state?.getMultiFitup?.user?.data?.data);
const totalCount = useSelector((state) => state?.getMultiFitup?.user?.data?.pagination?.totalRecords); // <== NEW

console.log("totalCount",totalCount);

console.log("entity",entity);
    const commentsData = useMemo(() => {
        let computedComments = entity;
        // if (computedComments) {
        //     computedComments = computedComments.filter(
        //         (fit) => fit.status === 1
        //     );
        // }

        // if (search) {
        //     computedComments = computedComments.filter(
        //         (fit) =>
        //             fit?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             fit?.issue_id?.issue_req_id?.transaction_id?.drawingId?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             fit?.issue_id?.issue_req_id?.transaction_id?.drawingId?.rev?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             fit?.issue_id?.issue_req_id?.transaction_id?.drawingId?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             fit?.issue_id?.imir_no?.toLowerCase()?.includes(search?.toLowerCase())
        //     );
        // }
        // setTotalItems(computedComments?.length);
        return computedComments;
    }, [currentPage, search, limit, entity]);
useEffect(() => {
  if (totalCount?.totalRecords) {
    setTotalItems(totalCount.totalRecords);
  }
}, [totalCount]);
    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'one-multi-fitup-download', body: bodyFormData });
    }

    // const handleRefresh = () => {
    //     setCurrentPage(1);
    //     setSearch("");
    //     setDisable(true);
    // }
const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    dispatch(getMultiFitup({ page: currentPage, limit }));
};

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`main-wrapper $ dispatch(getMultiFitup({ page: currentPage, limit }));{isSidebarOpen ? "slide-nav" : ""}`}>
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
                                    <li className="breadcrumb-item active">Fit-Up Clearance List</li>
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
                                                        <h3>Fit-Up Clearance List</h3>
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
                                                                {/* <Link to="/user/project-store/quality-clearance-fitup-management"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link> */}
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <div className="add-group mx-2">
                                                        <button type='button' onClick={() => setShowModal(true)}
                                                            className="btn btn-primary doctor-refresh w-100 ms-2" data-toggle="tooltip" data-placement="top" title="QC Report">
                                                            Generate Report
                                                        </button>
                                                    </div> */}
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        <th>Offered By</th>
                                                        <th>Date</th>
                                                        {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
                                                        <th>Status</th>
                                                        <th className="text-end">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
                                                            <td>{elem?.offered_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/user/project-store/quality-clearance-fitup-management', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : <span><X /></span>}
                                                                </td>
                                                            )}
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
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-quality-clearance-fitup', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i>
                                                                            View
                                                                        </button>
                                                                        {elem?.status !== 1 ? (
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
                                                                        ) : (
                                                                            <button type='button' className='dropdown-item'>Ins. Not Found</button>
                                                                        )}
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
                                                {/* <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div> */}
                                                    <div className="dataTables_info" role="status" aria-live="polite">
  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} entries
</div>

                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                        {/* <Pagination
  total={totalItems}
  itemsPerPage={limit}
  currentPage={currentPage}
  onPageChange={(page) => {
    setCurrentPage(page);
  }}
/> */}

<Pagination
  total={totalCount} // previously totalItems
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
            <FitupModalList showModal={showModal} handleCloseModal={() => setShowModal(false)} title="Fitup Report QC List" type={true} apiUrl={'download-fitup-inspection-list'} />
        </div>
    )
}

export default QFitUpList