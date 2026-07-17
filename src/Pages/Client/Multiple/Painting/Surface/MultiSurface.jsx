import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
//import { getMultiSurfaceOffer } from '../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaseOffer';
//import {getMultiSurfaceOfferViewPage} from '../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaceOfferViewPage';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from "../../../Include/Footer";
import { Pagination, Search } from '../../../Table';
import { PRODUCTION, V_URL } from '../../../../../BaseUrl';
import DropDown from '../../../../../Components/DropDown';
import Loader from '../../../Include/Loader';
import { BadgeCheck, X } from "lucide-react";


/* ------------------ Debounce Hook ------------------ */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const MultiSurface = () => {
  const navigate = useNavigate();
  const ERP_ROLE = localStorage.getItem("ERP_ROLE");
  const QC = "QC";
  const projectId = localStorage.getItem("PARTY_PROJECT_ID");

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  /* ------------------ Fetch Data ------------------ */
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${V_URL}/party/get-view-multi-surface`,
        {
          project_id: projectId,
          page,
          limit,
          search: debouncedSearch,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          },
        }
      );

      if (res.data.success) {
        setRows(res.data.data.data || []);
        setTotalItems(res.data.data.pagination?.total || 0);
      } else {
        toast.error(res.data.message || "Failed to load data");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch]);

  /* ------------------ Actions ------------------ */
  const handleRefresh = () => {
    setSearch("");
    setPage(1);
  };

  const downloadSurface = (row) => {
    const body = new URLSearchParams();
    body.append("report_no_two", row.report_no_two);
    PdfDownloadErp({
      apiMethod: "post",
      url: "download-multi-surface",
      body,
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* ------------------ Breadcrumb ------------------ */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                Surface & Primer List
              </li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">
              {/* ------------------ Top Controls ------------------ */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Surface & Primer Offer List</h3>
                        <div className="doctor-search-blk">
                          <div className="top-nav-search table-search-blk">
                            <form>
                               <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search"
                                  value={search}
                                  onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                  }}
                                />
                                 <a className="btn">
                                  <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                </a>
                            </form> 
                          </div>
                          <div className="add-group">
                            <button
                              type="button"
                              onClick={handleRefresh}
                              className="btn btn-primary doctor-refresh ms-2"
                            >
                            <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                        <DropDown
                          limit={limit}
                          onLimitChange={(val) => {
                          setLimit(val);
                          setPage(1);
                        }}
                      />
                   </div>
                </div>
              </div>

              {/* ------------------ Table ------------------ */}
              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>Assem No.</th>
                      <th>Offer Date</th>
                      {ERP_ROLE === QC && <th>Verify</th>}
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan="7">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    ) : (
                      rows.map((r, i) => {
                        const uniqueAssemblyNos = [
                          ...new Set(r.items?.map((e) => e.assembly_no).filter(Boolean)),
                        ];
                        return(
                          <tr key={r._id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>{r.report_no_two}</td>
                            <td>{uniqueAssemblyNos.join(', ')}</td>
                            <td>{r.offer_date ? moment(r.offer_date).format("YYYY-MM-DD HH:mm"): "-"}</td>

                            {/* ------------------ QC Verify ------------------ */}
                            {ERP_ROLE === QC && (
                              <td>
                                {r.status === 1 ? (
                                  <BadgeCheck
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                    navigate("/party/project-store/manage-surface-primer", { state: r })
                                    }
                                  />
                                  ) : (
                                  <X />
                                  )}
                              </td>
                            )}

                          {/* ------------------ Status Type ------------------ */}
                          <td>
                              {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(r.status_type) ? (
                                <span className="custom-badge status-green">{r.status_type}</span>
                              ) : (
                                <span className="custom-badge status-orange">{r.status_text || 'Pending'}</span>
                              )}
                          </td>

                          {/* ------------------ Actions ------------------ */}
                          <td className="text-end">
                            <div className="dropdown dropdown-action">
                              <a
                                href="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </a>
                              <div className="dropdown-menu dropdown-menu-end">
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    navigate(
                                      "/party/project-store/manage-surface-primer",
                                      { state: r }
                                    )
                                  }
                                >
                                  View
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => downloadSurface(r)}
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ------------------ Pagination ------------------ */}
              <div className="row align-center mt-3 mb-2">
                <div className="col-sm-12 col-md-6">
                  <div className="dataTables_info">
                    Showing {rows.length} of {totalItems} total records
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={limit}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MultiSurface;


// const MultiSurface = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [search, setSearch] = useState("");
//   const [disable, setDisable] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [limit, setlimit] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);

//   useEffect(() => {
//     if (disable === true) {
//       // dispatch(getMultiSurfaceOffer({page:currentPage, limit, search} ));
//        dispatch(getMultiSurfaceOfferViewPage({page:currentPage, limit, search} ));
//       setDisable(false);
//     }
//     else{
//       // dispatch(getMultiSurfaceOffer({page:currentPage, limit, search} ));
//        dispatch(getMultiSurfaceOfferViewPage({page:currentPage, limit, search} ));
//     }
//   }, [disable, dispatch, currentPage, limit, search]);

//   // const entity = useSelector((state) => state.getMultiSurfaceOffer?.user?.data?.data);
//   // const pagination = useSelector((state) => state.getMultiSurfaceOffer?.user?.data?.pagination);
//   const entity = useSelector((state) => state.getMultiSurfaceOfferViewPage?.user?.data?.data);
//   const pagination = useSelector((state) => state.getMultiSurfaceOfferViewPage?.user?.data?.pagination);
//   console.log("pagination:", pagination);
//   console.log(" Entity:", entity);
//   const commentsData = useMemo(() => {
//     // let computedComments = entity;
//       let computedComments = Array.isArray(entity) ? [...entity] : [];
//     // computedComments = computedComments?.filter((fi) => fi?.status !== 1);
//     // if (search) {
//     //   computedComments = computedComments.filter(
//     //     (s) =>
//     //       s?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
//     //       s?.report_no_two?.toLowerCase()?.includes(search?.toLowerCase()) ||
//     //       s?.items?.some(e => e?.dispatch_report?.toLowerCase()?.includes(search?.toLowerCase())) ||
//     //       s?.items?.some(e => e?.dispatch_site?.toLowerCase()?.includes(search?.toLowerCase())) ||
//     //       s?.procedure_no?.toLowerCase()?.includes(search?.toLowerCase())
//     //   );
//     // }
//     // setTotalItems(computedComments?.length);
//     return computedComments;
//   }, [currentPage, search, limit, entity]);

//   useEffect(() => {
//     if (pagination) {
//       setTotalItems(pagination.total);
//     }
//   }, [pagination]);

//   const handleDownloadOffer = (elem) => {
//     const bodyFormData = new URLSearchParams();
//     bodyFormData.append('report_no', elem.report_no)
//     bodyFormData.append('print_date', true);
//     PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-surface', body: bodyFormData });
//   }

//   const handleDownloadIns = (elem) => {
//     const bodyFormData = new URLSearchParams();
//     bodyFormData.append('report_no_two', elem.report_no_two);
//     bodyFormData.append('print_date', true);
//     PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-surface', body: bodyFormData });
//   }

//   const handleRefresh = () => {
//     setSearch('');
//     setDisable(true);
//   }

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const handleOpen = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             <div className="row">
//               <div className="col-sm-12">
//                 <ul className="breadcrumb">
//                   <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
//                   <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
//                   <li className="breadcrumb-item active">Surface & Primer List</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           {disable === false ? (
//             <div className="row">
//               <div className="col-sm-12">
//                 <div className="card card-table show-entire">
//                   <div className="card-body">
//                     <div className="page-table-header mb-2">
//                       <div className="row align-items-center">
//                         <div className="col">
//                           <div className="doctor-table-blk">
//                             <h3>Surface & Primer Offer List</h3>
//                             <div className="doctor-search-blk">
//                               <div className="top-nav-search table-search-blk">
//                                 <form>
//                                   <Search
//                                     onSearch={(value) => {
//                                       setSearch(value);
//                                       setCurrentPage(1);
//                                     }} />
//                                   {/* eslint-disable jsx-a11y/anchor-is-valid */}
//                                   <a className="btn"><img src="/assets/img/icons/search-normal.svg"
//                                     alt="search" />
//                                   </a>
//                                 </form>
//                               </div>
//                               <div className="add-group">
//                                 {localStorage.getItem('ERP_ROLE') === PRODUCTION && (
//                                   <Link to="/user/project-store/manage-surface-primer"
//                                     className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
//                                       src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
//                                 )}
//                                 <button type='button' onClick={handleRefresh}
//                                   className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
//                                     src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                           {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
//                             <DropDown limit={limit} onLimitChange={(val) => {
//     setlimit(val);
//     setCurrentPage(1);
// }} />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="table-responsive">
//                       <table className="table border-0 custom-table comman-table  mb-0">
//                         <thead>
//                           <tr>
//                             <th>Sr.</th>
//                             <th>Offer No.</th>
//                             <th>Insp. No.</th>
//                             <th>Procedure No.</th>
//                             <th>Dispatch No.</th>
//                             <th>Offer By</th>
//                             <th>Offer Date</th>
//                             <th>Dispatch Site</th>
//                             <th>Paint System</th>
//                             <th>Status</th>
//                             <th className="text-end">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {commentsData?.map((elem, i) =>
//                             <tr key={i}>
//                               <td>{(currentPage - 1) * limit + i + 1}</td>
//                               <td>{elem.report_no}</td>
//                               <td>{elem.report_no_two || '-'}</td>
//                               <td>{elem?.procedure_no}</td>
//                               <td>
//                                 {elem?.items && elem.items.length > 0 ? (
//                                   [...new Set(elem.items.map((e) => e?.dispatch_report))].map((report, index) => (
//                                     <div key={index}>{report}</div>
//                                   ))
//                                 ) : (
//                                   "-"
//                                 )}
//                               </td>
//                               <td>{elem?.offer_name}</td>
//                               <td>{moment(elem.offer_date).format('YYYY-MM-DD HH:mm')}</td>
//                               <td>
//                                 {elem?.items && elem.items.length > 0 ? (
//                                   [...new Set(elem.items.map((e) => e?.dispatch_site))].map((site, index) => (
//                                     <div key={index}>{site}</div>
//                                   ))
//                                 ) : (
//                                   "-"
//                                 )}
//                               </td>
//                               <td>{elem.paint_system_no || '-'}</td>
//                               <td className='status-badge'>
//                                 {elem.status === 2 ? (
//                                   <span className="custom-badge status-purple">Partially</span>
//                                 ) : elem.status === 3 ? (
//                                   <span className="custom-badge status-green">Accepted</span>
//                                 ) : elem.status === 4 ? (
//                                   <span className="custom-badge status-pink">Rejected</span>
//                                 ) : elem.status === 1 ? (
//                                   <span className="custom-badge status-orange">Pending</span>
//                                 ) : null}
//                               </td>
//                               <td className="text-end">
//                                 <div className="dropdown dropdown-action">
//                                   <a href="#" className="action-icon dropdown-toggle"
//                                     data-bs-toggle="dropdown" aria-expanded="false"><i
//                                       className="fa fa-ellipsis-v"></i></a>
//                                   <div className="dropdown-menu dropdown-menu-end">
//                                     <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-surface-primer', { state: elem })}>
//                                       <i className="fa-solid fa-eye m-r-5"></i> View
//                                     </button>
//                                     <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
//                                       <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>

//                                     {
//                                       elem?.report_no_two && (
//                                         <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
//                                           <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
//                                       )
//                                     }
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           )}
//                           {commentsData?.length === 0 ? (
//                             <tr>
//                               <td colSpan="999">
//                                 <div className="no-table-data">
//                                   No Data Found!
//                                 </div>
//                               </td>
//                             </tr>
//                           ) : null}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="row align-center mt-3 mb-2">
//                       <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
//                         <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
//                           aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
//                       </div>
//                       <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                         <div className="dataTables_paginate paging_simple_numbers"
//                           id="DataTables_Table_0_paginate">
//                           <Pagination
//                             total={totalItems}
//                             itemsPerPage={limit}
//                             currentPage={currentPage}
//                             // onPageChange={(page) => setCurrentPage(page)}
//                             onPageChange={(page) => {
//     setCurrentPage(page);
//     setDisable(true); 
//   }}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : <Loader />}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MultiSurface