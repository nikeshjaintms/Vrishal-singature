import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import Loader from '../../../Include/Loader';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../../Table';
import moment from 'moment';
import axios from "axios";
import toast from "react-hot-toast";
import DropDown from '../../../../../Components/DropDown';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { QC, V_URL } from '../../../../../BaseUrl';
import { BadgeCheck, X } from 'lucide-react';

/* ---------------- Debounce ---------------- */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const MultiUtClearance = () => {
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

  /* ---------------- Fetch UT Clearance ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${V_URL}/party/get-multi-ut-clearance`,
        {
          params: {
            project: projectId,
            page,
            limit,
            search: debouncedSearch,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          },
        }
      );

      if (res.data.success) {
        setRows(res.data.data.data || []); // <-- <--- this is key
        setTotalItems(res.data.data.pagination?.total || 0);
      } else {
        toast.error(res.data.message || "Failed to load data");
        setRows([]);
        setTotalItems(0);
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

  /* ---------------- Actions ---------------- */
  const handleRefresh = () => {
    setSearch("");
    setPage(1);
  };

  const handleDownload = (row) => {
    const body = new URLSearchParams();
    body.append("test_inspect_no", row.test_inspect_no);
    body.append("print_date", true);
    PdfDownloadErp({
      apiMethod: "post",
      url: "download-multi-ut-inspection",
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

          {/* ---------- Breadcrumb ---------- */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/user/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                Ultrasonic Test Clearance List
              </li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">

              {/* ---------- Header ---------- */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                        <h3>Ultrasonic Test Clearance List</h3>
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
                      <th>QC By</th>
                      <th>Assembly No</th>
                      <th>Date</th>
                      {ERP_ROLE === QC && <th>Verify</th>}
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan="8">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    ) : (
                      rows.map((item, i) => (
                        <tr key={item._id}>
                          <td>{(page - 1) * limit + i + 1}</td>
                          <td>{item.test_inspect_no}</td>
                          <td>{item.qc_name?.name || "-"}</td>
                          <td>
                            {item.items?.[0]?.grid_item_id?.drawing_id?.assembly_no || "-"}
                          </td>
                          <td>
                            {item.qc_time
                              ? moment(item.qc_time).format("YYYY-MM-DD")
                              : "-"}
                          </td>

                          {/* ---------- QC Verify ---------- */}
                          {ERP_ROLE === QC && (
                            <td>
                              {item.status === 1 ? (
                                <BadgeCheck
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    navigate(
                                      "/party/project-store/manage-ut-clearance",
                                      { state: item }
                                    )
                                  }
                                />
                              ) : (
                                <X />
                              )}
                            </td>
                          )}

                          {/* ---------- STATUS (Only 3 GREEN) ---------- */}
                          <td>
                            {["REVIEWED", "WITNESSED", "RANDOM WITNESSED"].includes(
                              item.status_type?.trim().toUpperCase()
                            ) ? (
                              <span className="custom-badge status-green">
                                {item.status_type}
                              </span>
                            ) : (
                              <span className="custom-badge status-orange">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* ---------- Actions ---------- */}
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
                                      "/party/project-store/view-ut-clearance-summary",
                                      { state: item }
                                    )
                                  }
                                >
                                  View
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleDownload(item)}
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
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

export default MultiUtClearance;


//import { useDispatch, useSelector } from 'react-redux';
//import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
//import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
//import { getMultiUtClearance } from '../../../../../Store/MutipleDrawing/MultiNDT/UtClearance/getMultiUtClearance';

// const MultiUtClearance = () => {

//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [totalItems, setTotalItems] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [limit, setlimit] = useState(10);
//     const [disable, setDisable] = useState(true);

//     const [totalItems1, setTotalItems1] = useState(0);
//     const [currentPage1, setCurrentPage1] = useState(1);
//     const [search1, setSearch1] = useState("");
//     const [limit1, setlimit1] = useState(10);
//     const [disable1, setDisable1] = useState(true);

//     useEffect(() => {
//         dispatch(getUserNdtMaster({ status: true })).then((response) => {
//             const ndtData = response.payload?.data;
//             const findNdt = ndtData?.find((nt) => nt?.name === 'UT');
//             if (findNdt && disable) {
//                 dispatch(getMultiNdtOffer({ status: 2, type: findNdt._id }));
//                 setDisable(false);
//             }
//         }).catch((error) => console.error("Error fetching NDT Master data:", error));
//     }, [disable]);

//     useEffect(() => {
//         if (disable1 === true) {
//             dispatch(getMultiUtClearance());
//             setDisable1(false);
//         }
//     }, [disable1]);

//     const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);
//     const entity2 = useSelector((state) => state.getMultiUtClearance?.user?.data);


//     const commentsData = useMemo(() => {
//         let computedComments = entity;
//         if (search) {
//             computedComments = computedComments.filter(
//                 (ut) =>
//                     ut.name?.toLowerCase()?.includes(search?.toLowerCase())
//             );
//         }
//         setTotalItems(computedComments?.length);
//         return computedComments?.slice(
//             (currentPage - 1) * limit,
//             (currentPage - 1) * limit + limit
//         );
//     }, [currentPage, search, limit, entity]);

//     const commentsData2 = useMemo(() => {
//         let computedComments = entity2;
//         if (search1) {
//             computedComments = computedComments.filter(
//                 (i) =>
//                     i?.test_inspect_no?.toString()?.toLowerCase().includes(search1?.toLowerCase()) ||
//                     i?.ndt_offer_no?.ndt_offer_no?.toString()?.toLowerCase().includes(search1?.toLowerCase())
//             );
//         }
//         setTotalItems1(computedComments?.length);
//         return computedComments?.slice(
//             (currentPage1 - 1) * limit1,
//             (currentPage1 - 1) * limit1 + limit1
//         );
//     }, [currentPage1, search1, limit1, entity2]);

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
//     };

//     const handleDownload = (elem) => {
//         const bodyFormData = new URLSearchParams();
//         bodyFormData.append('test_inspect_no', elem.test_inspect_no);
//         bodyFormData.append('print_date', true);
//         PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-ut-inspection', body: bodyFormData });
//     }

//     return (
//         <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//             <Header handleOpen={handleOpen} />
//             <Sidebar />

//             <div className="page-wrapper">
//                 <div className="content">

//                     <PageHeader breadcrumbs={[
//                         { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
//                         { name: "Ultrasonic Test Clearance List", active: true },
//                     ]} />

                   

//                     {disable1 === false ? (
//                         <div className="row">
//                             <div className="col-sm-12">
//                                 <div className="card card-table show-entire">
//                                     <div className="card-body">

//                                         <div className="page-table-header mb-2">
//                                             <div className="row align-items-center">
//                                                 <div className="col">
//                                                     <div className="doctor-table-blk">
//                                                         <h3>Ultrasonic Test Clearance List</h3>
//                                                         <div className="doctor-search-blk">
//                                                             <div className="top-nav-search table-search-blk">
//                                                                 <form>
//                                                                     <Search
//                                                                         onSearch={(value) => {
//                                                                             setSearch1(value);
//                                                                             setCurrentPage1(1);
//                                                                         }} />
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
//                                                     <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="table-responsive">
//                                             <table className="table border-0 custom-table comman-table  mb-0">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>#</th>
//                                                         <th>Report No.</th>
//                                                         <th>Qc. By</th>
//                                                         <th>Assem No.</th>
//                                                         <th>Date</th>
//                                                         <th>Status</th>
//                                                         <th className='text-end'>Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {commentsData2?.map((elem, i) =>
//                                                         <tr key={elem?._id}>
//                                                             <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
//                                                             <td>{elem?.test_inspect_no}</td>
//                                                             <td>{elem?.qc_name?.name}</td>
//                                                             <td>{elem?.items?.[0]?.grid_item_id?.drawing_id?.assembly_no}</td>
//                                                             <td>{elem?.qc_time ? moment(elem.qc_time).format('YYYY-MM-DD') : '-'}</td>
//                                                             <td className='status-badge'>
//                                                                 {elem.status === 1 ? (
//                                                                     <span className="custom-badge status-orange">Pending</span>
//                                                                 ) : elem.status === 3 ? (
//                                                                     <span className="custom-badge status-green">Accepted</span>
//                                                                 ) : elem.status === 4 ? (
//                                                                     <span className="custom-badge status-pink">Rejected</span>
//                                                                 ) : elem.status === 2 ? (
//                                                                     <span className='custom-badge status-blue'>Send For Clearance</span>
//                                                                 ) : elem.status === 5 ? (
//                                                                     <span className="custom-badge status-purple">Partially</span>
//                                                                 ) : null}
//                                                             </td>
//                                                             <td className="text-end">
//                                                                 <div className="dropdown dropdown-action">
//                                                                     <a href="#" className="action-icon dropdown-toggle"
//                                                                         data-bs-toggle="dropdown" aria-expanded="false"><i
//                                                                             className="fa fa-ellipsis-v"></i></a>
//                                                                     <div className="dropdown-menu dropdown-menu-end">
//                                                                         <button type='button' className="dropdown-item" onClick={() => navigate('/party/project-store/manage-ut-clearance', { state: elem })}><i
//                                                                             className="fa-solid fa-eye m-r-5"></i>
//                                                                             View</button>
//                                                                         <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)}>
//                                                                             <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>

//                                                                     </div>
//                                                                 </div>
//                                                             </td>
//                                                         </tr>
//                                                     )}

//                                                     {commentsData2?.length === 0 ? (
//                                                         <tr>
//                                                             <td colspan="999">
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
//                                                     aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
//                                             </div>
//                                             <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
//                                                 <div className="dataTables_paginate paging_simple_numbers"
//                                                     id="DataTables_Table_0_paginate">
//                                                     <Pagination
//                                                         total={totalItems1}
//                                                         itemsPerPage={limit1}
//                                                         currentPage={currentPage1}
//                                                         onPageChange={(page) => setCurrentPage1(page)}
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
//             </div>

//         </div>
//     )
// }

// export default MultiUtClearance;