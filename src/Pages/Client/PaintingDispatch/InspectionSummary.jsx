import React, { useEffect, useMemo, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInspectionSummary } from '../../../Store/Store/InspectionSummary/GetInspectionSummary';
import DropDown from '../../../Components/DropDown';
import moment from 'moment';
import { BadgeCheck, X } from 'lucide-react';
import { Pagination, Search } from '../Table';
import Loader from '../Include/Loader';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import { QC, V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
//import { getUserGenInspectionSummary } from '../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';

//  const useDebounce = (value, delay = 500) => {
//         const [debouncedValue, setDebouncedValue] = useState(value);
//         useEffect(() => {
//           const timer = setTimeout(() => setDebouncedValue(value), delay);
//           return () => clearTimeout(timer);
//         }, [value, delay]);
//         return debouncedValue;
      
//       }

// const InspectionSummary = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [limit, setlimit] = useState(10);
//     const [currentPage1, setCurrentPage1] = useState(1);
//     const [totalItems1, setTotalItems1] = useState(0);
//     const [search1, setSearch1] = useState("");
//     const [limit1, setlimit1] = useState(10);
//     const [disable, setDisable] = useState(true);
//     const [disable1, setDisable1] = useState(true);
//     const [selectedRows, setSelectedRows] = useState([]);
// const debouncedSearch1 = useDebounce(search1, 500);
//     const fatchData = () => {
//         dispatch(getUserInspectionSummary())
//         dispatch(getUserGenInspectionSummary({ page:currentPage1,limit:limit1,search:debouncedSearch1}));
//         // setDisable(false);
//     }

//     useEffect(() => {
//         if (disable === true) {
//             dispatch(getUserInspectionSummary())
//             setDisable(false);
//         }
//     }, [dispatch, disable]);

// //  dispatch(GetMultiReleaseNote({ page: currentPage, limit, search: debouncedSearch })).finally(
// //         () => setDisable(false)
// //     );

//      useEffect(() => {
//         // if (disable1 === true) {
//             dispatch(getUserGenInspectionSummary({page:currentPage1,limit:limit1,search:debouncedSearch1})).finally( ()=> setDisable1(false));
//             // setDisable1(false);
//         // }
//     }, [dispatch, disable1, currentPage1,limit1,debouncedSearch1]);

//     const entity = useSelector(state => state.getUserInspectionSummary?.user?.data);
//     const genratedEntity = useSelector(state => state.getUserGenInspectionSummary?.user?.data?.data);
//     console.log("genratedEntity",genratedEntity);
//     const pagination = useSelector(state => state.getUserGenInspectionSummary?.user?.data?.pagination);
//     console.log("pagination",pagination);

//     const commentsData = useMemo(() => {
//          let computedComments = entity;
//           //let computedComments = Array.isArray(entity) ? [...entity] : [];
//         const projectId = localStorage.getItem('PARTY_PROJECT_ID');
//         if (computedComments) {
//             computedComments = computedComments?.filter(o =>
//                 o?.project_id === projectId
//             );
//         }
//         if (search) {
//             computedComments = computedComments.filter(
//                 (fit) =>
//                     fit?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
//                     fit?.items?.some((e) => e?.drawing_no?.toLowerCase().includes(search.toLowerCase())) ||
//                     fit?.items?.some((e) => e?.assembly_no?.toLowerCase().includes(search.toLowerCase()))
//             );
//         }
//         setTotalItems(computedComments?.length);
//         return computedComments?.slice(
//             (currentPage - 1) * limit,
//             (currentPage - 1) * limit + limit
//         );
//     }, [currentPage, search, limit, entity]);

//     const genCommentsData = useMemo(() => {
//          let computedComments = genratedEntity;
       
//           //let computedComments = Array.isArray(genratedEntity) ? [...genratedEntity] : [];
//         const projectId = localStorage.getItem('PARTY_PROJECT_ID');
//         console.log("projectId",projectId);
//         // if (computedComments) {
//         //     computedComments = computedComments?.filter(o =>
//         //         o?.project_id === projectId
//         //     );
//         // }

//         if (computedComments) {
//   computedComments = computedComments?.filter(o =>
//     String(o?.project_id) === String(projectId)
//   );
// }

    
//         // setTotalItems1(computedComments?.length);
//         return computedComments;
//     }, [currentPage1, search1, limit1, genratedEntity]);

//     useEffect(() => {
//     if (pagination?.totalCount) {
//         setTotalItems1(pagination.totalCount);
//     }
// }, [pagination]);

//     console.log("genCommentsData",genCommentsData);
//     const handleGanrateMIS = () => {
//         const payload = {
//             "project": localStorage.getItem("PAY_USER_PROJECT_NAME"),
//             "id": selectedRows
//         }
//         const myurl = `${V_URL}/user/generate-multi-inspect`;
//         axios({
//             method: "post",
//             url: myurl,
//             data: payload,
//             headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PARTY_TOKEN') },
//         }).then((response) => {
//             if (response?.data?.success === true) {
//                 toast.success(response?.data?.message);
//                 fatchData();
//                 setSelectedRows([]);
//             } else {
//                 toast.error(response.data.message);
//             }
//         }).catch((error) => {
//             toast.error(error.response.data.message);
//         }).finally((() => { setDisable(false) }));
//     }

//     const handleRefresh = () => {
//         setSearch('');
//         setDisable(true);
//     }
//     const handleRefresh1 = () => {
//         setSearch1('');
//         setDisable1(true);
//     }

//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const handleOpen = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     }

//     const isAllSelected = commentsData?.length > 0 && selectedRows?.length === commentsData?.length;

//     const handleSelectAll = () => {
//         if (isAllSelected) {
//             setSelectedRows([]);
//         } else {
//             setSelectedRows(commentsData.map((row) => row._id));
//         }
//     };
//     const handleSelectRow = (id) => {
//         setSelectedRows((prevSelectedRows) =>
//             prevSelectedRows.includes(id)
//                 ? prevSelectedRows.filter((rowId) => rowId !== id)
//                 : [...prevSelectedRows, id]
//         );
//     };
//     const handleDownloadIns = (elem) => {
//         const bodyFormData = new URLSearchParams();
//         bodyFormData.append('project_id', localStorage.getItem('PARTY_PROJECT_ID'));
//         bodyFormData.append('batch_id', elem?.batch_id);
//         PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-inspect-generate', body: bodyFormData });
//     }

//     return (

//         <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
//             <Header handleOpen={handleOpen} />
//             <Sidebar />

//             <div className="page-wrapper">
//                 <div className="content">

//                     <div className="page-header">
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <ul className="breadcrumb">
//                                     <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
//                                     <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
//                                     <li className="breadcrumb-item active">Inspection Summary Records List</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>

                   

//                     {disable1 === false ? (
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <div className="card card-table show-entire">
//                                     <div className="card-body">

//                                         <div className="page-table-header mb-2">
//                                             <div className="row align-items-center">
//                                                 <div className="col">
//                                                     <div className="doctor-table-blk">
//                                                         <h3>Generated Inspection Summary Records</h3>
//                                                         <div className="doctor-search-blk">
//                                                             <div className="top-nav-search table-search-blk">
//                                                                 <form>
//                                                                     {/* <Search
//                                                                         onSearch={(value) => {
//                                                                             setSearch1(value);
//                                                                             setCurrentPage1(1);
//                                                                         }} /> */}
//                                                                         <input
//   type="text"
//   className="form-control"
//   placeholder="Search"
//   value={search1}
//   onChange={(e) => {
//     setSearch1(e.target.value);
//     setCurrentPage1(1);
//     // setDisable1(true); //  Trigger API
//   }}
// />
//                                                                     <a className="btn"><img src="/assets/img/icons/search-normal.svg"
//                                                                         alt="search" /></a>
//                                                                 </form>
//                                                             </div>
//                                                             <div className="add-group">
//                                                                 <button type='button' onClick={handleRefresh1}
//                                                                     className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
//                                                                         src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                                                     {/* <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} /> */}
//                                                     <DropDown limit={limit1} onLimitChange={(val) => {
//     setlimit1(val);
//     setCurrentPage1(1);
//     setDisable1(true);
// }} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="table-responsive">
//                                             <table className="table border-0 custom-table comman-table mb-0 datatable">
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="text-start" style={{ width: "35px" }}>Sr.</th>
//                                                         {/* <th>Drawing No.</th> */}
//                                                         <th>Report No.</th>
//                                                         <th>Unit/Area</th>
//                                                         <th>Assem No.</th>
//                                                         <th className="text-end">Action</th>
//                                                     </tr>
//                                                 </thead>

//                                                 <tbody>
//                                                     {genCommentsData?.length > 0 ? (
//                                                         genCommentsData.map((elem, i) => (
//                                                             <tr key={elem?._id}>
//                                                                 <td className="text-start">
//                                                                     {(currentPage1 - 1) * limit1 + i + 1}
//                                                                 </td>

//                                                                 {/* <td>
//                                                                     {elem?.items
//                                                                         ?.map(e => e?.drawing_no)
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .join(", ") || "-"}
//                                                                 </td> */}
//                                                                 <td>{elem?.report_no}</td>
//                                                                 <td>
//                                                                     {elem?.items
//                                                                         ?.map(e => e?.unit_area)
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .join(", ") || "-"}
//                                                                 </td>
//                                                                 <td>
//                                                                     {elem?.items
//                                                                         ?.map(e => e?.assembly_no)
//                                                                         .filter((value, index, self) => self.indexOf(value) === index)
//                                                                         .join(", ") || "-"}
//                                                                 </td>
//                                                                 <td className="text-end">
//                                                                     <div className="dropdown dropdown-action">
//                                                                         <a
//                                                                             href="#"
//                                                                             className="action-icon dropdown-toggle"
//                                                                             data-bs-toggle="dropdown"
//                                                                             aria-expanded="false"
//                                                                         >
//                                                                             <i className="fa fa-ellipsis-v"></i>
//                                                                         </a>
//                                                                         <div className="dropdown-menu dropdown-menu-end">
//                                                                             <button
//                                                                                 type="button"
//                                                                                 className="dropdown-item"
//                                                                                 onClick={() =>
//                                                                                     navigate("/user/project-store/view-geninspection-summary", {
//                                                                                         state: elem,
//                                                                                     })
//                                                                                 }
//                                                                             >
//                                                                                 <i className="fa-solid fa-eye m-r-5"></i> View
//                                                                             </button>
//                                                                             <button type='button' className="dropdown-item"
//                                                                                 onClick={() => handleDownloadIns(elem)}
//                                                                             >
//                                                                                 <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
//                                                                         </div>
//                                                                     </div>
//                                                                 </td>
//                                                             </tr>
//                                                         ))
//                                                     ) : (
//                                                         <tr>
//                                                             <td colSpan="5">
//                                                                 <div className="no-table-data">No Data Found!</div>
//                                                             </td>
//                                                         </tr>
//                                                     )}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         <div className="row align-center mt-3 mb-2">
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
//                                                 <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
//                                                     aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
//                                             </div>
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                                                 <div className="dataTables_paginate paging_simple_numbers"
//                                                     id="DataTables_Table_0_paginate">
//                                                     <Pagination
//                                                         total={totalItems1}
//                                                         itemsPerPage={limit1}
//                                                         currentPage={currentPage1}
//                                                         // onPageChange={(page) => setCurrentPage1(page)}
//                                                          onPageChange={(page) => {
//     setCurrentPage1(page);
//     setDisable1(true); 
//   }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ) : <Loader />}
//                 </div>
//                 <Footer />
//             </div>
//         </div>
//     )
// }

// export default InspectionSummary;

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const InspectionSummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const projectId = localStorage.getItem('PARTY_PROJECT_ID');
  const ERP_ROLE = localStorage.getItem('ERP_ROLE');
  const QC = 'QC'; // adjust as per your role constant

  /* ---------- API CALL ---------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${V_URL}/party/get-multi-inspect-summary`,
        { project_id: projectId },
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN') },
          params: { page, limit, search: debouncedSearch },
        }
      );

      if (response.data.success) {
        setRows(response.data.data.data || []);
        setTotalItems(response.data.data.totalItems || 0);
      } else {
        alert(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching Inspection Summary:', err);
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch]);

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    fetchData();
  };

  const downloadInspection = (row) => {
    const body = new URLSearchParams();
    body.append('batch_id', row.batch_id);
    body.append('project_id', projectId);

    PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-inspect-generate', body });
  };

  if (loading) return <Loader />;

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/user/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">Inspection Summary</li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">
              {/* ---------- Top Controls ---------- */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Inspection Summary</h3>
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

              {/* ---------- Table ---------- */}
              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>Assem No.</th>
                      <th>Date</th>
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
                          ...new Set(r.items?.map((e) => e.drawing_id?.assembly_no).filter(Boolean)),
                        ];
                        return (
                          <tr key={r._id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>{r.report_no}</td>
                            <td>{uniqueAssemblyNos.join(', ')}</td>
                            <td>{r.summary_date ? moment(r.summary_date).format('YYYY-MM-DD HH:mm') : '-'}</td>

                            {ERP_ROLE === QC && (
                              <td>
                                {r.status === 1 ? (
                                  <BadgeCheck
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                      navigate('/party/project-store/view-inspection-summary', { state: r })
                                    }
                                  />
                                ) : (
                                  <X />
                                )}
                              </td>
                            )}

                            <td>
                              {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(r.status_type) ? (
                                <span className="custom-badge status-green">{r.status_type}</span>
                              ) : (
                                <span className="custom-badge status-orange">{r.status_text || 'Pending'}</span>
                              )}
                            </td>

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
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() =>
                                      navigate('/party/project-store/view-geninspection-summary', { state: r })
                                    }
                                  >
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => downloadInspection(r)}
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

              {/* ---------- Pagination ---------- */}
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

export default InspectionSummary;



// const useDebounce = (value, delay = 500) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedValue(value), delay);
//     return () => clearTimeout(timer);
//   }, [value, delay]);
//   return debouncedValue;
// };

// const InspectionSummary = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [rows, setRows] = useState([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState('');

//   const debouncedSearch = useDebounce(search, 500);
//   const projectId = localStorage.getItem('PARTY_PROJECT_ID');

//   // Fetch Inspection Data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${V_URL}/party/get-multi-inspect-summary`,
//         { project_id: projectId },
//         {
//           headers: { Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN') },
//           params: { page, limit, search: debouncedSearch },
//         }
//       );
//       if (response.data.success) {
//         setRows(response.data.data.data || []);
//         setTotalItems((response.data.data.totalItems && response.data.data.length) || 0);
//       } else {
//         alert(response.data.message || 'Failed to fetch data');
//       }
//     } catch (err) {
//       console.error('Error fetching Inspection Summary:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [page, limit, debouncedSearch]);

//   const handleRefresh = () => {
//     setSearch('');
//     setPage(1);
//     fetchData();
//   };

//   const downloadInspection = (row) => {
//     const body = new URLSearchParams();
//     body.append('batch_id', row.batch_id);
//     body.append('project_id', projectId);
//     PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-inspect-generate', body });
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/user/project-store/dashboard">Dashboard</Link>
//               </li>
//               <li className="breadcrumb-item active">Inspection Summary</li>
//             </ul>
//           </div>

//           <div className="card card-table show-entire">
//             <div className="card-body">
//               {/* Top Controls */}
//               <div className="page-table-header mb-2">
//                 <div className="row align-items-center">
//                   <div className="col">
//                     <div className="doctor-table-blk">
//                       <h3>Inspection Summary</h3>
//                       <div className="doctor-search-blk">
//                         <div className="top-nav-search table-search-blk">
//                           <form>
//                             <input
//                               type="text"
//                               className="form-control"
//                               placeholder="Search"
//                               value={search}
//                               onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//                             />
//                             <a className="btn">
//                               <img src="/assets/img/icons/search-normal.svg" alt="search" />
//                             </a>
//                           </form>
//                         </div>
//                         <div className="add-group">
//                           <button
//                             type="button"
//                             onClick={handleRefresh}
//                             className="btn btn-primary doctor-refresh ms-2"
//                           >
//                             <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                     <DropDown
//                       limit={limit}
//                       onLimitChange={(val) => { setLimit(val); setPage(1); }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Table */}
//               <div className="table-responsive">
//                 <table className="table border-0 custom-table comman-table mb-0">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Report No</th>
//                       <th>Unit/Area</th>
//                       <th>Assem No.</th>
//                       {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
//                       <th className="text-end">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rows.length === 0 && (
//                       <tr>
//                         <td colSpan="6">
//                           <div className="no-table-data">No Data Found!</div>
//                         </td>
//                       </tr>
//                     )}
//                     {rows.map((r, i) => {
//                       const uniqueUnitAreas = [...new Set(r.items?.map(e => e.unit_area).filter(Boolean))];
//                       const uniqueAssemblyNos = [...new Set(r.items?.map(e => e.assembly_no).filter(Boolean))];
//                       return (
//                         <tr key={r._id}>
//                           <td>{(page - 1) * limit + i + 1}</td>
//                           <td>{r.report_no}</td>
//                           <td>{uniqueUnitAreas.join(', ')}</td>
//                           <td>{uniqueAssemblyNos.join(', ')}</td>
//                           {localStorage.getItem('ERP_ROLE') === QC && (
//                             <td>
//                               {r.status === 1 ? (
//                                 <BadgeCheck
//                                   style={{ cursor: 'pointer' }}
//                                   onClick={() =>
//                                     navigate('/party/project-store/view-inspection-summary', { state: r })
//                                   }
//                                 />
//                               ) : (
//                                 <X />
//                               )}
//                             </td>
//                           )}
//                           <td className="text-end">
//                             <div className="dropdown dropdown-action">
//                               <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
//                                 <i className="fa fa-ellipsis-v"></i>
//                               </a>
//                               <div className="dropdown-menu dropdown-menu-end">
//                                 <button
//                                   type="button"
//                                   className="dropdown-item"
//                                   onClick={() =>
//                                     navigate('/party/project-store/view-geninspection-summary', { state: r })
//                                   }
//                                 >
//                                   View
//                                 </button>
//                                 <button
//                                   type="button"
//                                   className="dropdown-item"
//                                   onClick={() => downloadInspection(r)}
//                                 >
//                                   Download
//                                 </button>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               <div className="row align-center mt-3 mb-2">
//                 <div className="col-sm-12 col-md-6">
//                   <div className="dataTables_info">
//                     Showing {rows.length} of {totalItems} total records
//                   </div>
//                 </div>
//                 <div className="col-sm-12 col-md-6 d-flex justify-content-end">
//                   <Pagination
//                     total={totalItems}
//                     itemsPerPage={limit}
//                     currentPage={page}
//                     onPageChange={setPage}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default InspectionSummary;


