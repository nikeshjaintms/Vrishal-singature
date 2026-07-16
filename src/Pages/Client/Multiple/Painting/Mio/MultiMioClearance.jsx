import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Loader from '../../../Include/Loader';
import { Pagination, Search } from '../../../Table';
import { QC } from '../../../../../BaseUrl';
import DropDown from '../../../../../Components/DropDown';
import { BadgeCheck, X } from 'lucide-react';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { getMultiMioIns } from '../../../../../Store/MutipleDrawing/MultiMIO/GetMultiMioIns';
import { getMultiMioClearance } from '../../../../../Store/MutipleDrawing/MultiMIO/GetMultiMioClearance';
import { getMultiMioViewPage } from '../../../../../Store/MutipleDrawing/MultiMIO/GetMultiMioViewPage';
import { use } from 'react';

const MultiMioClearance = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ERP_ROLE = localStorage.getItem('ERP_ROLE');
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disable, setDisable] = useState(true);
  const [limit, setlimit] = useState(10);

  const [search1, setSearch1] = useState("");
  const [totalItems1, setTotalItems1] = useState(0);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [disable1, setDisable1] = useState(true);
  const [limit1, setlimit1] = useState(10);

  useEffect(() => {
  if (disable) {
    // console.log('Fetching page for table 1:', currentPage, limit, search);
    // dispatch(getMultiMioIns({ paint_system_id: "" }));
    dispatch(getMultiMioViewPage({ paint_system_id: "" }));

    setDisable(false);
  }
}, [disable, dispatch]);

useEffect(() => {
  if (disable1) {
    console.log('Fetching page for table 2:', currentPage1, limit1, search1);
    dispatch(getMultiMioClearance({ paint_system_id: "", page: currentPage1, limit: limit1, search: search1 }));
    setDisable1(false);
  }
}, [disable1, dispatch, currentPage1, limit1, search1]);


  // const entity = useSelector((state) => state.getMultiMioIns?.user?.data?.data);
  const entity = useSelector((state) => state.getMultiMioViewPage?.user?.data?.data);

  console.log("entity", entity);
  // const pagination = useSelector((state) => state.getMultiMioIns?.user?.data?.pagination);
const entity1 = useSelector((state) => state.getMultiMioClearance?.user?.data?.data);
 console.log("entity1", entity1);
  const pagination1 = useSelector((state) => state.getMultiMioClearance?.user?.data?.pagination);
  console.log("pagination1",pagination1);

  const filterData = (data, statusFilter, searchQuery) => {
    let filteredData = data;

    if (statusFilter !== null) {
      filteredData = data?.filter((item) => item?.status === statusFilter);
    }

    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item?.items?.some(e =>
          [e?.drawing_no, e?.assembly_no, e?.dispatch_report, e?.dispatch_site]
            .some(val => val?.toLowerCase().includes(searchQuery.toLowerCase()))
        ) ||
        [item?.procedure_no, item?.paint_system_no, item?.qc_name, item?.report_no]
          .some(val => val?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }
    return filteredData;
  };



const commentsData = useMemo(() => {
  let filtered = filterData(entity, 1, search);
  filtered = filtered?.filter((fi) => fi?.status === 1);
   setTotalItems(filtered?.length || 0);
  return filtered?.slice((currentPage - 1) * limit, currentPage * limit);
}, [entity, search, currentPage, limit]);

  //   useEffect(() => {
  //   if (pagination) {
    
  //     setTotalItems(pagination.total);
      
  //   }
  // }, [pagination]);
  console.log("commentsData",commentsData);

  // const commentsData1 = useMemo(() => {
  //   let filtered = filterData(entity1, null, search1);
  //   // filtered = filtered?.filter((fi) => fi?.status !== 1);
  //   // setTotalItems1(filtered?.length || 0);
  //   return filtered;
  //   // ?.slice((currentPage1 - 1) * limit1, currentPage1 * limit1);
  // }, [entity, search1, currentPage1, limit1]);
 const commentsData1 = entity1 || [];

  useEffect(() => {
    if (pagination1) {
    
      setTotalItems1(pagination1.total);
      
    }
  }, [pagination1]);

  const handleDownloadIns = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no_two', elem.report_no_two);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-mio', body: bodyFormData });
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
        <Header handleOpen={handleOpen} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content">
            <PageHeader breadcrumbs={[
              { name: "Dashboard", link: "/party/project-store/dashboard", active: false },
              { name: "MIO Clearance List", link: "/party/project-store/mio-clearance-management", active: false },
            ]} />

            {disable === false ? (
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table show-entire">
                    <div className="card-body">
                      <div className="page-table-header mb-2">
                        <div className="row align-items-center">
                          <div className="col">
                            <div className="doctor-table-blk">
                              <h3>MIO Offering List</h3>
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
                                  <button type='button' onClick={() => setDisable(true)}
                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                      src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                            <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                {/* <DropDown limit={limit} onLimitChange={(val) => {
    setlimit(val);
    setCurrentPage(1);
    setDisable(true);
}} /> */}
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table border-0 custom-table comman-table  mb-0 datatable">
                          <thead>
                            <tr>
                              <th>Sr.</th>
                              <th>Offer No.</th>
                              <th>Drawing No.</th>
                              <th>Assem. No.</th>
                              <th>Dispatch No.</th>
                              <th>Dispatch Site</th>
                              <th>Procedure No.</th>
                              <th>Paint System No.</th>
                              <th>Offered By</th>
                              <th>Date</th>
                              {ERP_ROLE === QC && (
                                <th>Verify</th>)}
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {commentsData?.map((elem, i) =>
                              <tr key={elem?._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem?.report_no}</td>
                                <td>{[...new Set(elem?.items?.map(e => e?.drawing_no))].join(", ") || "-"}</td>
                                <td>{[...new Set(elem?.items?.map(e => e?.assembly_no))].join(", ") || "-"}</td>
                                <td>{[...new Set(elem?.items?.map(e => e?.dispatch_report))].join(", ") || "-"}</td>
                                <td>{[...new Set(elem?.items?.map(e => e?.dispatch_site))].join(", ") || "-"}</td>
                                <td>{elem?.procedure_no}</td>
                                <td>{elem?.paint_system_no}</td>
                                <td>{elem?.offer_name}</td>
                                <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                {ERP_ROLE === QC && (
                                  <td>
                                    {elem?.status === 1 ? (
                                      <span style={{ cursor: 'pointer' }} onClick={() => navigate('/party/project-store/manage-mio-clearance', { state: elem })}>
                                        <BadgeCheck />
                                      </span>
                                    ) : <X />}
                                  </td>
                                )}

                                <td>
                                  {elem.status === 1 ? (
                                    <span className="custom-badge status-orange">Pending</span>
                                  ) : (
                                    <span className="custom-badge status-green">Completed</span>
                                  )}
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
  //                             onPageChange={(page) => {
  //   setCurrentPage(page);
  //   setDisable(true); 
  // }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : <Loader />}

            {disable1 === false ? (
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table show-entire">
                    <div className="card-body">
                      <div className="page-table-header mb-2">
                        <div className="row align-items-center">
                          <div className="col">
                            <div className="doctor-table-blk">
                              <h3>MIO Clearance List</h3>
                              <div className="doctor-search-blk">
                                <div className="top-nav-search table-search-blk">
                                  <form>
                                    {/* <Search
                                      onSearch={(value) => {
                                        setSearch1(value);
                                        setCurrentPage1(1);
                                      }} /> */}

                                      <input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search1}
  onChange={(e) => {
    setSearch1(e.target.value);
    setCurrentPage1(1);
    setDisable1(true); // ✅ Trigger API
  }}
/>
                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                      alt="search" /></a>
                                  </form>
                                </div>
                                <div className="add-group">
                                  <button type='button' onClick={() => setDisable1(true)}
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
    setCurrentPage1(1);
    setDisable1(true);
}} />
                          </div>
                        </div>
                      </div>
                      <div className="table-responsive">
                        <table className="table border-0 custom-table comman-table  mb-0 datatable">
                          <thead>
                            <tr>
                              <th>Sr.</th>
                              <th>Report No.</th>
                              {/* <th>Offer No.</th> */}
                              <th>Paint System No.</th>
                              <th>QC By</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {commentsData1?.map((elem, i) =>
                              <tr key={elem?._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem?.report_no_two}</td>
                                {/* <td>{elem?.report_no}</td> */}
                                <td>{elem?.paint_system_no}</td>
                                <td>{elem?.qc_name}</td>
                                <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                <td className='status-badge'>
                                  {elem.status === 2 ? (
                                    <span className="custom-badge status-purple">Partially</span>
                                  ) : elem.status === 3 ? (
                                    <span className="custom-badge status-green">Accepted</span>
                                  ) : elem.status === 4 ? (
                                    <span className="custom-badge status-pink">Rejected</span>
                                  ) : null}
                                </td>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle"
                                      data-bs-toggle="dropdown" aria-expanded="false"><i
                                        className="fa fa-ellipsis-v"></i></a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button type='button' className="dropdown-item" onClick={() => navigate('/party/project-store/view-mio-clearance', { state: elem })}>
                                        <i className="fa-solid fa-eye m-r-5"></i> View</button>
                                      <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                        <i className="fa-solid fa-download  m-r-5"></i> Download PDF</button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}

                            {commentsData1?.length === 0 ? (
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
                            <Pagination
                              total={totalItems1}
                              itemsPerPage={limit1}
                              currentPage={currentPage1}
                              // onPageChange={(page) => setCurrentPage1(page)}
                              onPageChange={(page) => {
    setCurrentPage1(page);
    setDisable1(true); // This ensures API is called with new page
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
        </div>
      </div>
    </>
  )
}

export default MultiMioClearance