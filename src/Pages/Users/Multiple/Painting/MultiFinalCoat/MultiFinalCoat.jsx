import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import Loader from '../../../Include/Loader';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { PRODUCTION } from '../../../../../BaseUrl';
import moment from 'moment';
import { GetFinalCoatIns } from '../../../../../Store/MutipleDrawing/MultiFinalCoat/GetFinalCoatOffer';
import { GetFinalCoatOfferViewPage } from '../../../../../Store/MutipleDrawing/MultiFinalCoat/GetFinalCoatOfferViewPage';
const MultiFinalCoat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [disable, setDisable] = useState(true);
  const [limit, setlimit] = useState(10);
const [loading,setLoading] = useState();
  // useEffect(() => {
  //   if (disable === true) {
  //      console.log("Fetching data with", { currentPage, limit, search });
  //     dispatch(GetFinalCoatIns({page:currentPage,limit,search}));
  //     setDisable(false);
  //   }
  // }, [disable, currentPage, limit,search]);

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;

}
const debouncedSearch = useDebounce(search, 500);


  useEffect(() => {
  if (disable === true) {
    setLoading(true); // Start loader before dispatch
    // dispatch(GetFinalCoatIns({ page: currentPage, limit, search: debouncedSearch }))
    dispatch(GetFinalCoatOfferViewPage({ page: currentPage, limit, search: debouncedSearch }))

      .finally(() => {
        setLoading(false); // Stop loader after fetch
        setDisable(false);
      });
  }
  else{
    //  dispatch(GetFinalCoatIns({ page: currentPage, limit, search: debouncedSearch }));
     dispatch(GetFinalCoatOfferViewPage({ page: currentPage, limit, search: debouncedSearch }));

  }
}, [disable, currentPage, limit, debouncedSearch]);





  // const entity = useSelector((state) => state.GetFinalCoatIns?.user?.data?.data);
  // const pagination = useSelector((state) => state.GetFinalCoatIns?.user?.data?.pagination);

 const entity = useSelector((state) => state.GetFinalCoatOfferViewPage?.user?.data?.data);
  const pagination = useSelector((state) => state.GetFinalCoatOfferViewPage?.user?.data?.pagination);

  const commentsData = useMemo(() => {
    // let computedComments = entity || [];
      let computedComments = Array.isArray(entity) ? [...entity] : [];
    // if (search) {
    //   computedComments = computedComments.filter(
    //     (fc) =>
    //       fc?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //       fc?.report_no_two?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //       fc?.procedure_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //       fc?.items?.some(e => e?.dispatch_report?.toLowerCase()?.includes(search?.toLowerCase())) ||
    //       fc?.items?.some(e => e?.dispatch_site?.toLowerCase()?.includes(search?.toLowerCase()))
    //   );
    // }
    // setTotalItems(computedComments?.length);
    return computedComments;
  }, [currentPage, search, limit, entity]);


  useEffect(() => {
    if (pagination?.total) {
        setTotalItems(pagination.total);
    }
}, [pagination]);

  const handleDownloadoffer = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no', elem.report_no);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-final_coat', body: bodyFormData });
  }

  const handleDownloadIns = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no_two', elem.report_no_two);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-final_coat', body: bodyFormData });
  }

  const handleRefresh = () => {
    setSearch('');
    setDisable(true);
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
              { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
              { name: "Final / Top Coating Offer List", link: "/user/project-store/final-coat-management", active: true },
            ]} />

            {/* {disable === false ? ( */}
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table show-entire">
                    <div className="card-body">
                      <div className="page-table-header mb-2">
                        <div className="row align-items-center">
                          <div className="col">
                            <div className="doctor-table-blk">
                              <h3>Final / Top Coating Offer List</h3>
                              <div className="doctor-search-blk">
                                <div className="top-nav-search table-search-blk">
                                  <form>
                                    {/* <Search
                                      onSearch={(value) => {
                                        setSearch(value);
                                        setCurrentPage(1);
                                      }} /> */}

                                      <input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setDisable(true); 
  }}
/>
                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                      alt="search" /></a>
                                  </form>
                                </div>
                                <div className="add-group">
                                  {localStorage.getItem('ERP_ROLE') === PRODUCTION && (
                                    <Link to="/user/project-store/manage-final-coat"
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
                              <th>Offer No.</th>
                              <th>Report No.</th>
                              <th>Procedure No.</th>
                              <th>Dispatch No.</th>
                              <th>Offer By</th>
                              <th>Offer Date</th>
                              <th>Dispatch Site</th>
                              <th>Paint System</th>
                              <th>Status</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          {/* <tbody>
                            {commentsData?.map((elem, i) =>
                              <tr key={i}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem?.report_no}</td>
                                <td>{elem?.report_no_two || '-'}</td>
                                <td>{elem?.procedure_no}</td>
                                <td>
                                  {elem?.items && elem.items.length > 0 ? (
                                    [...new Set(elem.items.map((e) => e?.dispatch_report))].map((site, index) => (
                                      <div key={index}>{site}</div>
                                    ))
                                  ) : (
                                    "-"
                                  )}
                                </td>
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
                                      <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-final-coat', { state: elem })}>
                                        <i className="fa-solid fa-eye m-r-5"></i>
                                        View </button>
                                      <button type='button' className="dropdown-item" onClick={() => handleDownloadoffer(elem)} >
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
                          </tbody> */}


                          <tbody>
  {loading ? (
    <tr>
      <td colSpan="999" className="text-center py-4">
        <Loader />
      </td>
    </tr>
  ) : commentsData?.length > 0 ? (
    commentsData.map((elem, i) => (
      <tr key={i}>
        <td>{(currentPage - 1) * limit + i + 1}</td>
        <td>{elem?.report_no}</td>
        <td>{elem?.report_no_two || '-'}</td>
        <td>{elem?.procedure_no}</td>
        <td>
          {elem?.items && elem.items.length > 0 ? (
            [...new Set(elem.items.map((e) => e?.dispatch_report))].map((site, index) => (
              <div key={index}>{site}</div>
            ))
          ) : (
            "-"
          )}
        </td>
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
            <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa fa-ellipsis-v"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-final-coat', { state: elem })}>
                <i className="fa-solid fa-eye m-r-5"></i> View
              </button>
              <button type='button' className="dropdown-item" onClick={() => handleDownloadoffer(elem)} >
                <i className="fa-solid fa-download  m-r-5"></i> Download Offer
              </button>
              {elem?.report_no_two && (
                <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                  <i className="fa-solid fa-download  m-r-5"></i> Download Inspection
                </button>
              )}
            </div>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="999" className="text-center">
        <div className="no-table-data">No Data Found!</div>
      </td>
    </tr>
  )}
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
            {/* ) : <Loader />} */}

          </div>
        </div>
      </div>
    </>
  )
}

export default MultiFinalCoat