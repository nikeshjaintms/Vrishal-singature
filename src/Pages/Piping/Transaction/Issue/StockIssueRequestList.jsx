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
import { PLAN } from '../../../../BaseUrl';
import { getStockIssueRequestPiping } from '../../../../Store/Piping/StockIssueRequest/getStockIssueRequestPiping';
const useDebounce = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const IssueRequestList = () => {

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 600);
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
const project = localStorage.getItem('U_PROJECT_ID');
useEffect(() => {
  dispatch(
    getStockIssueRequestPiping({
      page: currentPage,
      limit,
      search:debouncedSearch,
      project
    })
  );
}, [dispatch, currentPage, limit, debouncedSearch]);



    const entity = useSelector((state) => state.getStockIssueRequestPiping?.issues?.data);
    const pagination = useSelector((state) => state.getStockIssueRequestPiping?.issues?.pagination);
console.log("pagination",pagination);
    console.log("entity",entity);

const commentsData = useMemo(() => {
  let computedComments = entity || [];


  return computedComments;
}, [entity, search]);


useEffect(() => {
  if (pagination?.totalRecords) {
    setTotalItems(pagination.totalRecords);
  }
}, [pagination]);

console.log("commentsData",commentsData);

    const handleDownload = (option) => {
        const { elem, ispdf, isxlsx } = option

        const bodyFormData = new URLSearchParams();
        bodyFormData.append('stock_issue_req_no', elem?.stock_issue_req_no);
        bodyFormData.append('print_date', true);

        if (ispdf) {
            PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-stock-issue-request-piping', body: bodyFormData });
        
        } else {
           
            PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-stock-issue-request-piping', body: bodyFormData });
        }
    }


const handleRefresh = () => {
  dispatch(getStockIssueRequestPiping({ limit, page: currentPage , project }));
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
                                        <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard</Link></li>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Stock Wise Issue Request List
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    {/* {disable === false ? ( */}
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Stock Wise Issue Request List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === `${PLAN}` &&
                                                                    <Link to="/piping/user/manage-stock-wise-issue-request"
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
                                                        <th>Item</th>                                                      
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
                                                            <td>{elem?.stock_issue_req_no || "-"}</td>
                                                            <td>                                                       
                                                                {elem?.items
                                                                    ?.map(e => e?.itemDetails?.item_name)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                           
                                                            <td>{elem?.requested_by?.user_name || "-"}</td>
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
                                                                   
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-stock-wise-issue-request', { state: elem } )}><i
                                                                            className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button>
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
                </div>
                <Footer />
            </div>
        </div >
    )
}

export default IssueRequestList