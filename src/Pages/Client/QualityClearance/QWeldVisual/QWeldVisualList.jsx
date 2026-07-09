import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
//import { getUserWeldVisual } from '../../../../Store/Store/Execution/getUserWeldVisual'; //Rubina - commented
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { BadgeCheck, X } from 'lucide-react';
import { QC, V_URL} from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
//import WeldVisualModal from '../../Execution/WeldVisual/WeldVisualModal/WeldVisualModal';
//import { getMultiWeldVisual } from '../../../../Store/MutipleDrawing/MultiWeldVisual/getMultiWeldVisual';
import axios from 'axios';

// const QWeldVisualList = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [limit, setlimit] = useState(10);
//     const [disable, setDisable] = useState(true);
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         if (disable === true) {
//             // dispatch(getUserWeldVisual({ status: '' }))
            //dispatch(getMultiWeldVisual({ status: '', page: currentPage, limit,search }));
//             setDisable(false);
//         }
//         else{
//             dispatch(getMultiWeldVisual({ status: '', page: currentPage, limit, search}));
//         }
//     }, [dispatch, disable]);
    

//     const entity = useSelector((state) => state.getMultiWeldVisual?.user?.data?.items);
//     console.log("Weld Visual Data",entity);
//       const total = useSelector((state) => state.getMultiWeldVisual?.user?.data?.total) || 0;
//         const page = useSelector((state) => state.getMultiWeldVisual?.user?.data?.page) || 1;
//         const totalPages = useSelector((state) => state.getMultiWeldVisual?.user?.data?.totalPages) || 1;

//     const commentsData = useMemo(() => {
//         // let computedComments = entity;
//            let computedComments = Array.isArray(entity) ? [...entity] : [];
//         // if (computedComments) {
//         //     computedComments = computedComments?.filter(
//         //         (weld) => weld.status === 1
//         //     );
//         // }
//         if (search) {
//             computedComments = computedComments?.filter(
//                 (i) =>
//                     i?.weld_report_no?.toLowerCase()?.includes(search?.toLowerCase())
//             );
//         }
//         // setTotalItems(computedComments?.length);
//         return computedComments;
//     }, [currentPage, search, limit, entity]);

//     useEffect(() => {
//         setTotalItems(commentsData.length);
//     }, [commentsData]);
    
//     const handleRefresh = () => {
//         setCurrentPage(1);
//         setSearch("");
//         // setDisable(true);
//     }

//     const handleDownloadIns = (elem) => {
//         const bodyFormData = new URLSearchParams();
//         bodyFormData.append('report_no_two', elem.report_no_two)
//         bodyFormData.append('print_date', true);
//         PdfDownloadErp({ apiMethod: 'post', url: 'multi-weldvisual-download', body: bodyFormData });
//     }

//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const handleOpen = () => {
//         setIsSidebarOpen(!isSidebarOpen);
//     };

//     return (
//         <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
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
//                                     <li className="breadcrumb-item active">Weld Visual Clearance List</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>

//                     {disable === false ? (
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <div className="card card-table show-entire">
//                                     <div className="card-body">

//                                         <div className="page-table-header mb-2">
//                                             <div className="row align-items-center">
//                                                 <div className="col">
//                                                     <div className="doctor-table-blk">
//                                                         <h3>Weld Visual Clearance List</h3>
//                                                         <div className="doctor-search-blk">
//                                                             <div className="top-nav-search table-search-blk">
//                                                                 <form>
//                                                                     <Search
//                                                                         onSearch={(value) => {
//                                                                             setSearch(value);
//                                                                             setCurrentPage(1);
//                                                                         }} />
//                                                                     {/* eslint-disable jsx-a11y/anchor-is-valid */}
//                                                                     <a className="btn"><img src="/assets/img/icons/search-normal.svg"
//                                                                         alt="search" /></a>
//                                                                 </form>
//                                                             </div>
//                                                             <div className="add-group">
//                                                                 {/* <Link to="/user/project-store/quality-clearance-weld-visual-management"
//                                                                     className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
//                                                                         src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link> */}
//                                                                 <button type='button' onClick={handleRefresh}
//                                                                     className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
//                                                                         src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
//                                                     {/* <div className="add-group mx-2">
//                                                         <button type='button' onClick={() => setShowModal(true)}
//                                                             className="btn btn-primary doctor-refresh w-100 ms-2" data-toggle="tooltip" data-placement="top" title="QC Report">
//                                                             Generate Report
//                                                         </button>
//                                                     </div> */}
//                                                     {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
//                                                         <DropDown limit={limit} onLimitChange={(val) => {
//     setlimit(val);
//     setCurrentPage(1);
//     setDisable(true);
// }} />

//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="table-responsive">
//                                             <table className="table border-0 custom-table comman-table  mb-0 datatable">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>Sr.</th>
//                                                         <th>Report No.</th>
//                                                         <th>Offer By.</th>
//                                                         <th>Date</th>
//                                                         {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
//                                                         <th>Status</th>
//                                                         <th className="text-end">Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {commentsData?.map((elem, i) =>
//                                                         <tr key={elem?._id}>
//                                                             <td>{(currentPage - 1) * limit + i + 1}</td>
//                                                             <td>{elem?.report_no}</td>
//                                                             <td>{elem?.offered_by?.user_name}</td>
//                                                             <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
//                                                             {localStorage.getItem('ERP_ROLE') === QC && (
//                                                                 <td>
//                                                                     {elem?.status === 1 ? (
//                                                                         <span style={{ cursor: 'pointer' }} onClick={() => navigate('/user/project-store/quality-clearance-weld-visual-management', { state: elem })}>
//                                                                             <BadgeCheck />
//                                                                         </span>
//                                                                     ) : (<span><X /></span>)}
//                                                                 </td>
//                                                             )}
//                                                             <td className='status-badge'>
//                                                                 {elem.status === 1 ? (
//                                                                     <span className="custom-badge status-orange">Pending</span>
//                                                                 ) : elem.status === 2 ? (
//                                                                     <span className="custom-badge status-green">Accepted</span>
//                                                                 ) : elem.status === 3 ? (
//                                                                     <span className="custom-badge status-pink">Rejected</span>
//                                                                 ) : null}
//                                                             </td>
//                                                             <td className="text-end">
//                                                                 <div className="dropdown dropdown-action">
//                                                                     <a href="#" className="action-icon dropdown-toggle"
//                                                                         data-bs-toggle="dropdown" aria-expanded="false"><i
//                                                                             className="fa fa-ellipsis-v"></i></a>
//                                                                     <div className="dropdown-menu dropdown-menu-end">
//                                                                         {elem?.status !== 1 ? (
//                                                                             <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
//                                                                                 <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
//                                                                         ) : (
//                                                                             <button type='button' className='dropdown-item'>Ins. Not Found</button>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}

//                                                     {commentsData?.length === 0 ? (
//                                                         <tr>
//                                                             <td colSpan="999">
//                                                                 <div className="no-table-data">
//                                                                     No Data Found!
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     ) : null}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         <div className="row align-center mt-3 mb-2">
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
//                                                 <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
//                                                     aria-live="polite">Showing {Math.min(limit, totalItems)} from {total} data</div>
//                                             </div>
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                                                 <div className="dataTables_paginate paging_simple_numbers"
//                                                     id="DataTables_Table_0_paginate">
//                                                     {/* <Pagination
//                                                         total={totalItems}
//                                                         itemsPerPage={limit}
//                                                         currentPage={currentPage}
//                                                         // onPageChange={(page) => setCurrentPage(page)}
//                                                           onPageChange={(page) => {
//                                                              setCurrentPage(page);
//                                                          setDisable(true); // force API refetch
//                                                                      }}
//                                                     /> */}


//                                                       <Pagination
//                                                         total={total}
//                                                         itemsPerPage={limit}
//                                                         currentPage={currentPage}
//                                                         onPageChange={(page) => {
//                                                             setCurrentPage(page);
//                                                             setDisable(true); 
//                                                         }}
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
//             <WeldVisualModal showModal={showModal} handleCloseModal={() => setShowModal(false)} title="Weld Visual Report QC List" type={true} apiUrl={'download-weld-inspection-list'} />
//         </div>
//     )
// }

// export default QWeldVisualList;


/* ---------- Debounce (same as QFitUpList) ---------- */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const QWeldVisualList = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);
  const projectId = localStorage.getItem('PARTY_PROJECT_ID');

  /* ---------- API CALL (FitUp-style) ---------- */
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${V_URL}/party/get-multi-weldvisual`,
        {
          params: {
            page,
            limit,
            search: debouncedSearch,
            project: projectId,
            _t: Date.now(),
          },
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      if (response.data.success) {
        setRows(response.data.data.data || []);
        setTotalItems(response.data.data.totalItems || 0);
      } else {
        alert(response.data.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching Weld Visual data:', err);
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
    body.append('report_no_two', row.report_no_two);
    body.append('print_date', true);

    PdfDownloadErp({
      apiMethod: 'post',
      url: 'multi-weldvisual-download',
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
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                Weld Visual Acceptance
              </li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">

              {/* ---------- Top Controls ---------- */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Weld Visual Acceptance</h3>

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
                              <img
                                src="/assets/img/icons/search-normal.svg"
                                alt="search"
                              />
                            </a>
                          </form>
                        </div>

                        <div className="add-group">
                          <button
                            type="button"
                            onClick={handleRefresh}
                            className="btn btn-primary doctor-refresh ms-2"
                          >
                            <img
                              src="/assets/img/icons/re-fresh.svg"
                              alt="refresh"
                            />
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
                      <th>Report No.</th>
                      <th>Assem. No.</th>
                      <th>Date</th>
                      {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
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
                            ...new Set(
                             r.items?.map(
                              (e) => e?.grid_item_id?.drawing_id?.assembly_no
                                 ).filter(Boolean)
                              ),
                    ];
                    return (
                        <tr key={r._id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>{r.report_no_two}</td>
                            <td>{uniqueAssemblyNos.join(', ')}</td>
                            <td>{moment(r.createdAt).format('YYYY-MM-DD HH:mm')}</td>

                            {localStorage.getItem('ERP_ROLE') === QC && (
                            <td>
                                {r.status === 1 ? (
                                <BadgeCheck
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                    navigate(
                                        '/user/project-store/quality-clearance-weld-visual-management',
                                    { state: r }
                                    )
                                    }
                                />
                                ) : (
                                <X />
                                )}
                            </td>
                        )}

                            <td>
                                 {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(
                                 r.status_type
                                ) ? (
                                <span className="custom-badge status-green">
                                    {r.status_type}
                                </span>
                                ) : (
                                <span className="custom-badge status-orange">
                                    {r.status_text || 'Pending'}
                                </span>
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
                                            navigate('/party/project-store/view-quality-clearance-weld-visual', { state: r })
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

export default QWeldVisualList;