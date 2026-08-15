import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination, Search } from '../../Table';
import Loader from '../../Include/Loader';
import DropDown from '../../../../Components/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getUserIssueRequest } from '../../../../Store/Store/Issue/IssueRequest';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import { PRODUCTION } from '../../../../BaseUrl';
import { getMultipleIssueRequest } from '../../../../Store/MutipleDrawing/IssueRequest/MultipleIssueRequest';

const IssueRequestList = () => {

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (disable === true) {
    //         try {
    //             // dispatch(getUserIssueRequest());
    //             dispatch(getMultipleIssueRequest());
    //             setDisable(false);
    //         } catch (error) {
    //             console.log(error);
    //             setDisable(false);
    //         }
    //     }
    // }, [dispatch, disable]);

    // const entity = useSelector((state) => state.getUserIssueRequest?.user?.data);
    // const entity = useSelector((state) => state.getMultipleIssueRequest?.user?.data);

    // console.log(entity, '@@@')

    // const commentsData = useMemo(() => {
    //     let computedComments = entity;

    //     if (search) {
    //         computedComments = computedComments?.filter(
    //             (request) =>
    //                 request.issue_req_no?.toString().toLowerCase().includes(search.toLowerCase()) ||
    //                 request.requested_by?.user_name.toLowerCase().includes(search.toLowerCase())
    //         );
    //     }
    //     setTotalItems(computedComments?.length);
    //     return computedComments?.slice(
    //         (currentPage - 1) * limit,
    //         (currentPage - 1) * limit + limit
    //     );
    // }, [currentPage, entity, search, limit, totalItems]);


    const entity = useSelector((state) => state.getMultipleIssueRequest?.user?.data);
    console.log("entity",entity);

  useEffect(() => {
  if (disable) {
    try {
      dispatch(getMultipleIssueRequest({ limit, page: currentPage, search }));
      setDisable(false);
    } catch (error) {
      console.log(error);
      setDisable(false);
    }
  }
  else{
       try {
      dispatch(getMultipleIssueRequest({ limit, page: currentPage , search }));
      setDisable(false);
    } catch (error) {
      console.log(error);
      setDisable(false);
    }
  }
}, [dispatch, disable, currentPage, limit, search]);


const commentsData = useMemo(() => {
  let computedComments = entity?.items || [];
//   if (search) {
//     computedComments = computedComments.filter(
//       (request) =>
//         request.issue_req_no?.toString().toLowerCase().includes(search.toLowerCase()) ||
//         request.requested_by?.user_name.toLowerCase().includes(search.toLowerCase())
//     );
//   }
  setTotalItems(entity?.total || 0);
  return computedComments;
}, [entity, search]);


    const handleDownload = (option) => {
        const { elem, ispdf, isxlsx } = option

        const bodyFormData = new URLSearchParams();
        bodyFormData.append('issue_req_no', elem?.issue_req_no);
        bodyFormData.append('print_date', true);

        if (ispdf) {
            PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-issue-request', body: bodyFormData });
            // PdfDownloadErp({ apiMethod: 'post', url: 'one-issue-request-download', body: bodyFormData });
        } else {
            // PdfDownloadErp({ apiMethod: 'post', url: 'one-issue-request-download', body: bodyFormData });
            PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-issue-request', body: bodyFormData });
        }
    }

    // const handleRefresh = () => {
    //     setDisable(true);
    // }
const handleRefresh = () => {
  dispatch(getMultipleIssueRequest({ limit, page: currentPage }));
};

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
                                    <li className="breadcrumb-item">
                                        <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard</Link></li>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Material Issue Request List
                                    </li>
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
                                                        <h3>Material Issue Request List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === `${PRODUCTION}` &&
                                                                    <Link to="/user/project-store/manage-issue-request"
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
                                                            setCurrentPage(1); // Reset to first page when limit changes
                                                        }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Issue Req. No.</th>
                                                        <th>Unit/Area</th>
                                                        <th>Assembly No.</th>
                                                        <th>Req. By</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.issue_req_no}</td>
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
                                                            <td>{elem?.requested_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                )}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    {/* <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-item-request', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i>
                                                                            View
                                                                        </button>
                                                                    </div> */}
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-issue-request', { state: elem })}><i
                                                                            className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload({ elem, ispdf: true })} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download PDF</button>
                                                                        {/* <button type='button' className="dropdown-item" onClick={() => handleDownload({ elem, isxlsx: true })} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download XLSX</button> */}
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
                                                        // total={totalItems}
                                                        total={entity?.total}
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
        </div >
    )
}

export default IssueRequestList