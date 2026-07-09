import React, { useEffect, useMemo, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import DropDown from '../../../Components/DropDown';
import Footer from '../Include/Footer';
import { Pagination, Search } from '../Table';
import Loader from '../Include/Loader';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import { PLAN } from '../../../BaseUrl';
import { getDispatchNotes } from '../../../Store/MutipleDrawing/DispatchNote/GetDisptchNote';
import { use } from 'react';

const DispatchNote = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);

  
  useEffect(() => {
    if (disable === true) {
      dispatch(getDispatchNotes({ "paint_system_id": "", page: currentPage, limit, search }));
      setDisable(false);
    }
    else{
      dispatch(getDispatchNotes({ "paint_system_id": "", page: currentPage, limit, search }));
    }
    
  }, [dispatch, disable, currentPage, limit, search]);


  const entity = useSelector((state) => state.getDispatchNotes?.user?.data?.data);
  const pagination = useSelector((state) => state.getDispatchNotes?.user?.data?.pagination);


  const handleDownload = (options) => {
    const { elem } = options

    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no', elem.report_no);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-dispatch', body: bodyFormData });
  }

  const handleRefresh = () => {
    setSearch('');
    setDisable(true);
  }

 


  const commentsData = useMemo(() => {
    let computedComments = Array.isArray(entity) ? [...entity] : [];
    const projectId = localStorage.getItem('U_PROJECT_ID');
    // if (computedComments) {
    //   computedComments = computedComments?.filter(o =>
    //     o?.drawing_id?.project?._id === projectId 
    //   );
    // }

    // if (search) {
    //   computedComments = computedComments.filter(
    //     (dispatch) =>
    //       dispatch.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //       dispatch?.items?.some(item => item?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())) ||
    //       dispatch?.items?.some(item => item?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase()))

    //   );
    // }

    // computedComments?.sort((a, b) => {
    //   const reportA = a?.report_no?.toString() || "";
    //   const reportB = b?.report_no?.toString() || "";
    //   return reportA.localeCompare(reportB, undefined, { numeric: true });
    // });

    // setTotalItems(computedComments?.length);
   return computedComments;
    // ?.slice(
    //   (currentPage - 1) * limit,
    //   (currentPage - 1) * limit + limit
    // );
  }, [currentPage, search, limit, entity]);



  useEffect(() => {
    if (pagination?.total) {
      setTotalItems(pagination.total);
    }
  }, [pagination]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
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
                  <li className="breadcrumb-item active">Dispatch Note- PAINTING</li>
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
                            <h3>Dispatch Note Records List</h3>
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
                                {localStorage.getItem('ERP_ROLE') === PLAN && (
                                  <Link to="/user/project-store/manage-dispatch-note"
                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                      src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                )}
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
                            <th>Lot No.</th>
                            <th>Unit</th>
                            {/* <th>Drawing No.</th> */}
                            <th>Asse. No.</th>
                            <th>Dispatch Site</th>
                            <th>Disp. Date</th>
                            <th>Prepared By</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) =>
                            <tr key={elem?._id}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.report_no}</td>
                              <td>
                                {elem?.items
                                  ?.map(e => e?.unit_area)
                                  .filter((value, index, self) => self.indexOf(value) === index)
                                  .join(", ") || "-"}
                              </td>
                              {/* <td>
                                {elem?.items
                                  ?.map(e => e?.drawing_no)
                                  .filter((value, index, self) => self.indexOf(value) === index)
                                  .join(", ") || "-"}
                              </td> */}
                              <td>
                                {elem?.items
                                  ?.map(e => e?.assembly_no)
                                  .filter((value, index, self) => self.indexOf(value) === index)
                                  .join(", ") || "-"}
                              </td>
                              <td>{elem?.dispatch_site}</td>
                              <td>{moment(elem?.dispatch_date).format('YYYY-MM-DD HH:mm')}</td>
                              <td>{elem?.prepared_by}</td>


                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a href="#" className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false"><i
                                      className="fa fa-ellipsis-v"></i></a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-dispatch-note', { state: elem })}><i className="fa-solid fa-eye m-r-5"></i>
                                      View</button>
                                    <button type='button' className="dropdown-item" onClick={() => handleDownload({ elem })} >
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
                              <td colspan="999">
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
  onPageChange={(page) => {
    setCurrentPage(page);
    setDisable(true); // This ensures API is called with new page
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
      <Footer />
    </div>
  )
}

export default DispatchNote