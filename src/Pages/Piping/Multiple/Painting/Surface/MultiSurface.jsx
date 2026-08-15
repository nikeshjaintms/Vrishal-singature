import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getPipingMultiSurfaceOffer } from '../../../../../Store/Piping/MultiSurface/GetSurfaseOffer';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import { Pagination, Search } from '../../../Table';
import { PRODUCTION } from '../../../../../BaseUrl';
import DropDown from '../../../../../Components/DropDown';
import Loader from '../../../Include/Loader';
const MultiSurface = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  // const [disable, setDisable] = useState(true); // Removed as it was causing stuck loader
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  // const [totalItems, setTotalItems] = useState(0); // Removed to prevent re-renders

  const entity = useSelector(
    (state) => {
      const data = state.getPipingMultiSurfaceOffer?.user?.data?.data;
      return Array.isArray(data) ? data : [];
    }
  );
  const totalCount = useSelector((state) => state.getPipingMultiSurfaceOffer?.user?.data?.pagination?.total || 0);
  const loading = useSelector((state) => state.getPipingMultiSurfaceOffer?.loading);

  useEffect(() => {
    dispatch(getPipingMultiSurfaceOffer({ page: currentPage, limit, search }));
  }, [currentPage, limit, search, dispatch]);

  console.log('entity', entity);


  const filteredData = useMemo(() => {
    let computedComments = entity;

    // Group by _id to remove duplicates and merge items
    const groupedMap = new Map();
    computedComments.forEach((item) => {
      const id = item._id;
      if (groupedMap.has(id)) {
        const existing = groupedMap.get(id);
        // Merge items safely
        if (item.items && Array.isArray(item.items)) {
          existing.items = [...(existing.items || []), ...item.items];
        }
      } else {
        // Clone to avoid mutating original redux state if deeper shallow copy needed
        groupedMap.set(id, { ...item, items: item.items ? [...item.items] : [] });
      }
    });
    computedComments = Array.from(groupedMap.values());

    if (search) {
      computedComments = computedComments.filter(
        (s) =>
          s?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
          s?.report_no_two?.toLowerCase()?.includes(search?.toLowerCase()) ||
          s?.items?.some(e => e?.dispatch_report?.toLowerCase()?.includes(search?.toLowerCase())) ||
          s?.items?.some(e => e?.dispatch_site?.toLowerCase()?.includes(search?.toLowerCase())) ||
          s?.procedure_no?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    return computedComments;
  }, [search, entity]);

  const totalItems = totalCount || 0;

  const commentsData = useMemo(() => {
    return filteredData;
  }, [filteredData]);



  const handleDownloadOffer = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no', elem.report_no)
    bodyFormData.append('print_date', true);
    bodyFormData.append('project_id', localStorage.getItem("U_PROJECT_ID"));
    bodyFormData.append('isOffer', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'piping-download-multi-surface', body: bodyFormData });
  }

  const handleDownloadIns = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no_two', elem.report_no_two);
    bodyFormData.append('print_date', true);
    bodyFormData.append('project_id', localStorage.getItem("U_PROJECT_ID"));
    bodyFormData.append('isOffer', false);
    PdfDownloadErp({ apiMethod: 'post', url: 'piping-download-multi-surface', body: bodyFormData });
  }

  const handleRefresh = () => {
    setSearch('');
    // setDisable(true);
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
                  <li className="breadcrumb-item active">Surface & Primer List</li>
                </ul>
              </div>
            </div>
          </div>
          {!loading ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Surface & Primer Offer List</h3>
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
                                    alt="search" />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                {localStorage.getItem('ERP_ROLE') === PRODUCTION && (
                                  <Link to="/piping/user/manage-surface-primer"
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
                          <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table  mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Offer No.</th>
                            <th>Line No. / Drawing No.</th>
                            <th>Spool No. / Item</th>
                            <th>Offer By</th>
                            <th>Offer Date</th>
                            <th>Dispatch Site</th>
                            <th>Paint System</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) =>
                            <tr key={i}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem.report_no}</td>
                              <td>
                                {elem?.items && elem.items.length > 0 ? (
                                  [...new Set(elem.items.map((e) => e?.drawing_no))].map((drawing, index) => (
                                    <div key={index}>{drawing}</div>
                                  ))
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                  {elem?.items?.length ? (
                                      [...new Set(
                                      elem.items.flatMap((e) => {
                                          if (Array.isArray(e?.item_name) && e.item_name.length > 0) {
                                          return e.item_name;
                                          }

                                          if (e?.spool_no) {
                                          return [e.spool_no];
                                          }

                                          return [];
                                      })
                                      )].map((tag, index) => (
                                      <div key={index}>{tag}</div>
                                      ))
                                  ) : (
                                      "-"
                                  )}
                              </td>
                              {/* <td>{elem.report_no_two || '-'}</td> */}
                              {/* <td>{elem?.procedure_no}</td> */}
                              {/* <td>
                                {elem?.items && elem.items.length > 0 ? (
                                  [...new Set(elem.items.map((e) => e?.dispatch_report))].map((report, index) => (
                                    <div key={index}>{report}</div>
                                  ))
                                ) : (
                                  "-"
                                )}
                              </td> */}
                              <td>{elem?.offer_name}</td>
                              <td>{moment(elem.offer_date).format('YYYY-MM-DD HH:mm')}</td>
                              <td>
                                {elem?.items && elem.items.length > 0 ? (
                                  [...new Set(elem.items.map((e) => e?.dispatch_site))].map((site, index) => (
                                    <div key={index}>{site}</div>
                                  ))
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{elem.paint_system_no || '-'}</td>
                              <td className='status-badge'>
                                {elem.status === 2 ? (
                                  <span className="custom-badge status-purple">Partially</span>
                                ) : elem.status === 3 ? (
                                  <span className="custom-badge status-green">Accepted</span>
                                ) : elem.status === 4 ? (
                                  <span className="custom-badge status-pink">Rejected</span>
                                ) : elem.status === 1 ? (
                                  <span className="custom-badge status-orange">Pending</span>
                                ) : null}
                              </td>
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a href="#" className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false"><i
                                      className="fa fa-ellipsis-v"></i></a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/view-surface-clearance', { state: elem })}>
                                      <i className="fa-solid fa-eye m-r-5"></i> View
                                    </button>
                                    <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
                                      <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>

                                    {
                                      elem?.report_no_two && (
                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                          <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
                                      )
                                    }
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
          ) : <Loader />}
        </div>
      </div>
    </div>
  )
}

export default MultiSurface