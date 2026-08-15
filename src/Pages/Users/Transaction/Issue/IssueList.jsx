import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import { M_CON, QC } from '../../../../BaseUrl';
import { BadgeCheck, X } from 'lucide-react';
import { getMultipleIssueRequest } from '../../../../Store/MutipleDrawing/IssueRequest/MultipleIssueRequest';
import { getMultipleIssueAcc } from '../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';

const IssueList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    const [totalItems1, setTotalItems1] = useState(0);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
    const [disable1, setDisable1] = useState(true);
    const ERP_ROLE = localStorage.getItem("ERP_ROLE");    



//     useEffect(() => {
//     if (disable) {
//         dispatch(getMultipleIssueAcc({ limit, page: currentPage, search }));
//         setDisable(false);
//     }
//      else {
//         dispatch(getMultipleIssueAcc({ limit, page: currentPage, search }));
//     }

//     if (disable1) {
//         dispatch(getMultipleIssueRequest({ limit: limit1, page: currentPage1, search: search1 }));
//         setDisable1(false);
//     } else {
//         dispatch(getMultipleIssueRequest({ limit: limit1, page: currentPage1, search: search1 }));
//     }
// }, [dispatch, disable, disable1, search, search1, limit, currentPage, limit1, currentPage1]);


// For Issue Acceptance
useEffect(() => {
  if (!disable) {
    dispatch(getMultipleIssueAcc({ limit, page: currentPage, search }));
  }
}, [dispatch, limit, currentPage, disable, search]);

// For Issue Request
useEffect(() => {
  if (!disable1) {
    dispatch(getMultipleIssueRequest({ limit: limit1, page: currentPage1,search:search1 }));
  }
}, [dispatch, limit1, currentPage1, disable1,search1]);

// Initial load
useEffect(() => {
  dispatch(getMultipleIssueAcc({ limit, page: currentPage }));
  setDisable(false);

  dispatch(getMultipleIssueRequest({ limit: limit1, page: currentPage1 ,search:search1}));
  setDisable1(false);
}, [dispatch,search1]);


  const entity = useSelector((state) => state?.getMultipleIssueAcc?.user?.data);

const commentsData = useMemo(() => {
    let computedComments = Array.isArray(entity?.items) ? entity.items : (Array.isArray(entity) ? entity : []);

    // if (search) {
    //     computedComments = computedComments.filter((i) =>
    //         i?.issue_accept_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //         i?.issue_req_id?.transaction_id?.drawingId?.project?.party?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //         i?.issue_req_id?.transaction_id?.drawingId?.issued_person?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //         i?.issue_req_id?.transaction_id?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //         i?.items?.some((item) =>
    //             item?.drawing_id?.assembly_no?.includes(search)
    //         ) ||
    //         i?.imir_no?.toLowerCase()?.includes(search?.toLowerCase())
    //     );
    // }

    setTotalItems(entity?.total || computedComments.length);
    return computedComments;
}, [currentPage, search, limit, entity]);


    // const commentsData2 = useMemo(() => {
    //     let computedComments = entity2;
    //     if (search1) {
    //         computedComments = computedComments.filter(
    //             (i) =>
    //                 i?.issue_req_no?.includes(search1?.toLowerCase())
    //         );
    //     }
    //     setTotalItems1(computedComments?.length);
    //     return computedComments?.slice(
    //         (currentPage1 - 1) * limit1,
    //         (currentPage1 - 1) * limit1 + limit1
    //     );
    // }, [currentPage1, search1, limit1, entity2]);


    const entity2 = useSelector((state) => state.getMultipleIssueRequest?.user?.data);
console.log("entity2",entity2);
const commentsData2 = useMemo(() => {
    let computedComments = Array.isArray(entity2?.items) ? [...entity2.items] : [];
    // if (search1) {
    //     computedComments = computedComments.filter(
    //         (i) => i?.issue_req_no?.toLowerCase()?.includes(search1?.toLowerCase())
    //     );
    // }
    // use backend total
    setTotalItems1(entity2?.total || 0);
    return computedComments; 
}, [search1, entity2]);


    const handleDownload = (options) => {
        const { elem, ispdf, isxlsx } = options
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('issue_accept_no', elem?.issue_accept_no);
        bodyFormData.append('print_date', true);

        if (ispdf) {
            // PdfDownloadErp({ apiMethod: 'post', url: 'one-issue-acceptance-download', body: bodyFormData });
            PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-issue-acceptance', body: bodyFormData });
        } else {
            PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-issue-acceptance', body: bodyFormData });
            // PdfDownloadErp({ apiMethod: 'post', url: 'one-issue-acceptance-download', body: bodyFormData });
        }
    }


    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const handleRefresh1 = () => {
        setSearch1('');
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Issue Acceptance</li>
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
                                                        <h3>Issue Request List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
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
                                                                {ERP_ROLE === `${M_CON}` &&
                                                                    <Link to="/user/project-store/manage-issue-acceptance"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                }
                                                                <button type='button' onClick={handleRefresh1}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} /> */}
                                                       <DropDown limit={limit1} onLimitChange={(val) => {
    setlimit1(val);
    setCurrentPage1(1); // Reset to first page when limit changes
}} />
 
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Issue Req. No.</th>
                                                        <th>Issued By</th>
                                                        <th>Date</th>
                                                        {ERP_ROLE === `${M_CON}` &&
                                                            <th>Issue Acc.</th>
                                                        }
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData2?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
                                                            <td>{elem?.issue_req_no}</td>
                                                            <td>{elem?.requested_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            {ERP_ROLE === `${M_CON}` &&
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/user/project-store/create-issue-acceptance', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : <X />}
                                                                </td>
                                                            }
                                                            <td>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData2?.length === 0 ? (
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
                                                    {/* <Pagination
                                                        total={totalItems1}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        onPageChange={(page) => setCurrentPage1(page)}
                                                    /> */}

                                                    <Pagination
    total={totalItems1}
    itemsPerPage={limit1}
    currentPage={currentPage1}
    onPageChange={(page) => {
        setCurrentPage1(page);
        dispatch(getMultipleIssueRequest({ limit: limit1, page })); // fetch new page from backend
        
    }}
/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loader />}

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Issue Acceptance List</h3>
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
                                                                {ERP_ROLE === `${M_CON}` &&
                                                                    <Link to="/user/project-store/manage-issue-acceptance"
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
                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
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
                                                        <th>Issue Acc. No.</th>
                                                        <th>Unit/Area</th>
                                                        <th>Assembly No.</th>
                                                        <th>Issued By</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.issue_accept_no}</td>
                                                            <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.drawing_id?.unit)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                            <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.drawing_id?.assembly_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                            <td>{elem?.issued_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>{elem?.status === 4 ? (
                                                                <span className='custom-badge status-green'>Completed</span>
                                                            ) : elem?.status === 3 ? (
                                                                <span className='custom-badge status-red'>Rejected</span>
                                                            ) : "-"}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-issue-acceptance', { state: elem })}><i
                                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload({ elem, ispdf: true })} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download PDF</button>
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
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                          onPageChange={(page) => {
        setCurrentPage(page);
        // dispatch(getMultipleIssueAcc({ limit: limit1, page })); 
           dispatch(getMultipleIssueAcc({ limit, page }));
            
    }}
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

export default IssueList