import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFitup } from '../../../../Store/Store/Execution/getUserFitup';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import StatusFilter from '../../../../Components/Filter/StatusFilter';
import FilterCollapse from '../../../../Components/Filter/FilterCollapse';
import { PRODUCTION } from '../../../../BaseUrl';
// import FitupModalList from './FitupReportModal/FitupModalList';
import { getMultiFitup } from '../../../../Store/MutipleDrawing/MultiFitup/getMultiFitup';
import { getMultiDptPiping } from '../../../../Store/Piping/RootDpt/getMultiDptPiping';

 const useDebounce = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }

const Dpt = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [status, setStatus] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [showModal, setShowModal] = useState(false);
 const debouncedSearch = useDebounce(search, 600);
 
    // useEffect(() => {
    //     if (disable === true) {
    //         dispatch(getMultiDptPiping({limit, page: currentPage}))
    //         setDisable(false);
    //     }
    // }, [dispatch, disable]);
useEffect(() => {
//   if (disable === true) {
    dispatch(
      getMultiDptPiping({
        page: currentPage,
        limit,
        search:debouncedSearch,
        status
      })
    ).then(() => {
      setDisable(false); // 🔥 IMPORTANT
    });
//   }
}, [dispatch, currentPage, limit, debouncedSearch, status]);
    // const entity = useSelector((state) => state?.getMultiFitup?.user?.data?.data);

const entity = useSelector((state) => state?.getMultiDptPiping?.user?.data) || [];
const pagination = useSelector((state) => state?.getMultiDptPiping?.user?.pagination) || {};
    console.log("entity dpt offer",entity);

   

//     const commentsData = useMemo(() => {
//     // let computedComments = entity || [];
//     let computedComments = Array.isArray(entity) ? entity : [];


//     if (search) {
//         computedComments = computedComments.filter((i) => {
//             const uniqueAssemblyNos = [
//                 ...new Set(i?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no).filter(Boolean))
//             ].join(", ");
//             const uniqueDrawingNo = [
//                 ...new Set(i?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no).filter(Boolean))
//             ];
//             return [uniqueAssemblyNos, uniqueDrawingNo]
//                 .some(field => field?.toString()?.toLowerCase()?.includes(search?.toLowerCase()));
//         });
//     }

//     if (status) {
//         computedComments = computedComments.filter(fit => fit.status === parseInt(status));
//     }

//     return computedComments;
// }, [entity, search, status]);
const commentsData = Array.isArray(entity) ? entity : [];

console.log("commentsData",commentsData);
useEffect(() => {
  if (pagination?.totalRecords) {
    setTotalItems(pagination.totalRecords);
  }
}, [pagination]);


    const statusCounts = StatusFilter({ entity });

    const handleDownloadOffer = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no', elem.report_no)
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-root-dpt-offer-pdf-piping', body: bodyFormData });
        // PdfDownloadErp({ apiMethod: 'post', url: 'one-fitup-inspection-download', body: bodyFormData });
    }

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two);
        bodyFormData.append('print_date', true);
        // PdfDownloadErp({ apiMethod: 'post', url: 'one-fitup-inspection-download', body: bodyFormData });
        PdfDownloadErp({ apiMethod: 'post', url: 'download-root-dpt-inspection-pdf-piping', body: bodyFormData });
    }

    const handleRefresh = () => {
        setSearch('');
        // setDisable(true);
        setStatus("");
          dispatch(
      getMultiDptPiping({
        page: currentPage,
        limit,
        search:debouncedSearch,
        status
      })
    ).then(() => {
      setDisable(false); // 🔥 IMPORTANT
    });
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
                                    <li className="breadcrumb-item active">DPT Inspection Offer List</li>
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
                                                        <h3>DPT Inspection Offer List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === `${PRODUCTION}` && (
                                                                    <Link to="/piping/user/manage-dpt"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                                                )}
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                                {/* <button className="btn btn-primary  doctor-refresh ms-2" type="button" onClick={() => setShowFilter(!showFilter)}
                                                                    aria-controls="collapseExample"
                                                                    aria-expanded={showFilter}>
                                                                    <i className="fa-solid fa-filter"></i>
                                                                </button> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <FilterCollapse
                                            show={showFilter}
                                            status={status}
                                            setStatus={setStatus}
                                            statusCounts={statusCounts}
                                        />

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        <th>Line No. / Drawing No..</th>                                               
                                                        <th>Rev No.</th>
                                                        <th>Sheet No.</th>
                                                        <th>Spool No.</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => {
                                                       const uniqueDrawingNo = [
  ...new Set(
    elem?.items?.flatMap(item => item?.jointDetails?.map(j => j?.drawing_no).filter(Boolean)) || []
  )
];

const uniqueRevNo = [
  ...new Set(
    elem?.items?.flatMap(item => item?.jointDetails?.map(j => j?.rev).filter(Boolean)) || []
  )
];

const uniqueSheetNo = [
  ...new Set(
    elem?.items?.flatMap(item => item?.jointDetails?.map(j => j?.sheet_no).filter(Boolean)) || []
  )
];
const uniqueSpoolNo = [
  ...new Set(
    elem?.items?.flatMap(item => item?.jointDetails?.map(j => j?.spool_no).filter(Boolean)) || []
  )
];



                                                        return (
                                                            <tr key={elem?._id}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.report_no}</td>
                                                               <td>{uniqueDrawingNo.join(", ")}</td>
                                                                <td>{uniqueRevNo.join(", ")}</td>
                                                                <td>{uniqueSheetNo.join(", ")}</td>
                                                                <td>{uniqueSpoolNo.join(", ")}</td>
                                                                <td className='status-badge'>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem.status === 2 ? (
                                                                        <span className="custom-badge status-green">Accepted</span>
                                                                    ) : elem.status === 3 ? (
                                                                        <span className="custom-badge status-pink">Rejected</span>
                                                                      ) : elem.status === 7 ? (
                                                                        <span className="custom-badge status-purple">Partially</span>
                                                                    ) : null}
                                                                </td>

                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            {/* <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-fitup', { state: elem })}>
                                                                               
                                                                                <i className="fa-solid fa-eye m-r-5"></i>
                                                                               View
                                                                            </button> */}
                                                                           <button type='button' className="dropdown-item" onClick={() => navigate(`/piping/user/view-root-dpt-management/view/${elem._id}`)}>
                                                                               
                                                                                <i className="fa-solid fa-eye m-r-5"></i>
                                                                               View
                                                                            </button>

                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>
                                                                            {elem?.report_no_two && (
                                                                                <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                                    <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
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
                                                {/* <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div> */}
                                           
                                           <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
     aria-live="polite">
  Showing  {Math.min(currentPage * limit, totalItems)} of {totalItems} data
</div>

                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    {/* <Pagination
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        onPageChange={(page) => setCurrentPage(page)}
                                                    /> */}

                                                    <Pagination
  total={totalItems}
  itemsPerPage={limit}
  currentPage={currentPage}
  onPageChange={(page) => {
    setCurrentPage(page);
    // setDisable(true); // refetch from backend
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
            {/* <FitupModalList showModal={showModal} handleCloseModal={() => setShowModal(false)} title="Fitup Report Offer List" type={false} apiUrl={'download-fitup-inspection-offers'} /> */}
        </div>
    )
}

export default Dpt