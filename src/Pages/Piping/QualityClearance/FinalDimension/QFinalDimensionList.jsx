import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import { BadgeCheck, X } from 'lucide-react';
import moment from 'moment';
import DropDown from '../../../../Components/DropDown';
import Loader from '../../Include/Loader';
import { QC } from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import {getMultiFdPiping} from '../../../../Store/Piping/MultiFdPiping/getMultiFdPiping';
const useDebounce = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const QFinalDimensionList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
const debouncedSearch = useDebounce(search, 600);
 const [totalItems1, setTotalItems1] = useState(0);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
    const [disable1, setDisable1] = useState(true);
const debouncedSearch1 = useDebounce(search1, 600);

// useEffect(() => {
//     dispatch(getMultiFdPiping({
//         page: currentPage,
//         limit: limit,
//         search: debouncedSearch,
//          project:localStorage.getItem('U_PROJECT_ID')
//     }));
// }, [dispatch, currentPage, limit, debouncedSearch, disable]);

// useEffect(() => {

//   // Pending
//   // setDisable(true);
//   dispatch(
//     getMultiFdPiping({
//       page: currentPage,
//       limit,
//       search: debouncedSearch,
//        project:localStorage.getItem('U_PROJECT_ID'),
//       status: 1
//     })
//   ).then(() => setDisable(false));

  
//   // Completed
//   // setDisable1(true);
//   dispatch(
//     getMultiFdPiping({
//       page: currentPage1,
//       limit: limit1,
//       search: debouncedSearch1,
//        project:localStorage.getItem('U_PROJECT_ID'),
//       status: "2,3,4"
//     })
//   ).then(() => setDisable1(false));

// }, [
//   dispatch,
//   currentPage,
//   limit,
//   debouncedSearch,
//   currentPage1,
//   limit1,
//   debouncedSearch1
// ]);

// Pending
useEffect(() => {
  setDisable(true);
  dispatch(getMultiFdPiping({
    page: currentPage,
    limit,
    search: debouncedSearch,
    project: localStorage.getItem('U_PROJECT_ID'),
    status: 1
  })).then(() => setDisable(false));
}, [dispatch,currentPage, limit, debouncedSearch]);

// Completed
useEffect(() => {
  setDisable1(true);
  dispatch(getMultiFdPiping({
    page: currentPage1,
    limit: limit1,
    search: debouncedSearch1,
    project: localStorage.getItem('U_PROJECT_ID'),
    status: "2,3,4"
  })).then(() => setDisable1(false));
}, [dispatch,currentPage1, limit1, debouncedSearch1]);

    const entity = useSelector((state) => state.getMultiFdPiping?.user?.data);
    const pagination = useSelector((state) => state?.getMultiFdPiping?.user?.pagination) || {};
    console.log(entity, "entity");
    console.log(pagination, "pagination");

     const pendingData = useSelector(
            (state) => state.getMultiFdPiping?.pendingList?.data
          );
          const pendingDataTotalCount = useSelector(
            (state) => state.getMultiFdPiping?.pendingList?.pagination?.total
          );
          console.log("pendingDataTotalCount",pendingDataTotalCount);
          
          const completedData = useSelector(
            (state) => state.getMultiFdPiping?.completedList?.data
          );
          
          const completedDataTotalCount = useSelector(
            (state) => state.getMultiFdPiping?.completedList?.pagination?.total
          );
          console.log("completedDataTotalCount",completedDataTotalCount);

    const commentsData = useMemo(() => {
        // let computedComments = entity;
        let computedComments = Array.isArray(entity) ? [...entity] : [];

        // if (search) {
        //     computedComments = computedComments?.filter(
        //         (i) =>
        //             i?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
        //     );
        // }
        // setTotalItems(computedComments?.length);
        return computedComments;
    }, [ search, entity]);

useEffect(() => {
  if (pagination?.total) {
    setTotalItems(pagination.total
);
    
  }
}, [pagination]);

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearch("");
        dispatch(getMultiFdPiping({
            page: 1,
            limit,
            status: "1",
             project:localStorage.getItem('U_PROJECT_ID'),
          }));
          
    }
    const handleRefresh1 = () => {
        setCurrentPage1(1);
        setSearch1("");
        dispatch(getMultiFdPiping({
    page: 1,
    limit: limit1,
    status: "2,3,4",
     project:localStorage.getItem('U_PROJECT_ID'),
  }));
    }
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two)
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-final-dimension-inspection-pdf-piping', body: bodyFormData });
    }

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
                                    <li className="breadcrumb-item active">Final Dimension Clearance List</li>
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
                                                        <h3>Final Dimension Clearance List</h3>
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
                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                                        <DropDown limit={limit} onLimitChange={(val) => {
    setlimit(val);
    setCurrentPage(1);
    setDisable(true);
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
                                                        {/* <th>Acceptance No.</th> */}
                                                        <th>Drawing No.</th>
                                                        <th>Spool No.</th>
                                                        <th>Offer By.</th>
                                                        <th>Date</th>
                                                        {localStorage.getItem('ERP_ROLE') === QC && (
                                                            <th>Verify</th>
                                                        )}
                                                       
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
                                                             {/* <td>{elem?.report_no_two}</td> */}
                                                              <td>
                                                            {elem?.items
                                                                ?.map(e => e?.drawing_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .join(", ") || "-"}
                                                            </td>
                                                           <td>
                                                            {elem?.items
                                                                ?.map(e => e?.spool_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .join(", ") || "-"}
                                                            </td>
                                                            <td>{elem?.offered_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} 
                                                                        // onClick={() => navigate('/piping/user/quality-clearance-final-dimension-management')}
                                                                        onClick={() =>
                                                                            navigate('/piping/user/quality-clearance-final-dimension-management', {
                                                                                state: elem
                                                                            })
                                                                            }

                                                                        >
                                                                            <BadgeCheck />
                                                                        </span>
                                                                     ) : (<span><X /></span>)}
                                                                </td>
                                                            )}
                                                           
                                                          
                                                        </tr>
                                                    )}

                                                    {pendingData?.length === 0 ? (
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
                                                    aria-live="polite">Showing {Math.min(limit, pendingDataTotalCount)} from {pendingDataTotalCount} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={pendingDataTotalCount}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                         onPageChange={(page) => {
    setCurrentPage(page);
    setDisable(true); 
  }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/* // ) : <Loader />} */}

                      <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Final Dimension Clearance Completed List</h3>
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
                                                                <button type='button' onClick={handleRefresh1}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                                        <DropDown limit={limit1} onLimitChange={(val) => {
    setlimit1(val);
    setCurrentPage1(1);
    setDisable1(true);
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
                                                        <th>Drawing No.</th>
                                                        <th>Spool No.</th>
                                                        <th>Acceptance No.</th>
                                                        <th>Offer By.</th>
                                                        <th>Date</th>
                                                       
                                                        <th>Status</th>
                                                      
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
                                                            
                                                              <td>
                                                            {elem?.items
                                                                ?.map(e => e?.drawing_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .join(", ") || "-"}
                                                            </td>
                                                           <td>
                                                            {elem?.items
                                                                ?.map(e => e?.spool_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .join(", ") || "-"}
                                                            </td>
                                                             <td>{elem?.report_no_two}</td>
                                                            <td>{elem?.offered_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                          
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
                                                                      {elem?.status !== 1 ? (
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate(`/piping/user/view-final-dimension-management/view/${elem._id}`)}>
                                                                               
                                                                                <i className="fa-solid fa-eye m-r-5"></i>
                                                                               View
                                                                            </button>
                                                                             ) : (
                                                                            <button type='button' className='dropdown-item'>Ins. Not Found</button>
                                                                        )}
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

                                                    {completedData?.length === 0 ? (
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
                                                    aria-live="polite">Showing {Math.min(limit1, completedDataTotalCount)} from {completedDataTotalCount} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={completedDataTotalCount}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                         onPageChange={(page) => {
                                                            setCurrentPage1(page);
                                                            setDisable1(true); 
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default QFinalDimensionList