import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Include/Loader';
import { Pagination } from '../Table';
import DropDown from '../../../Components/DropDown';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import {PlannerQcAuth } from '../../../Routes/Users/Auth/AuthGuard';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import {getSpoolBreakUpSummary} from '../../../Store/Piping/SpoolBreakUp/getSpoolBreakUpSummary';
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const SpoolBreakUpSummary = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const [entity, setEntity] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
useEffect(() => {
  dispatch(
    getSpoolBreakUpSummary({
      page: currentPage,
      limit,
      search:debouncedSearch,
    })
  );
}, [dispatch, currentPage, limit, debouncedSearch]);

  const entityData = useSelector((state) => state?.getAdminParty?.user?.data?.data);
const spoolData = useSelector(
  (state) => state?.getSpoolBreakUpSummary?.user?.data?.data
);
console.log("spoolData========>", spoolData);
const pagination = useSelector(
  (state) => state?.getSpoolBreakUpSummary?.user?.data?.pagination
);

const loading = useSelector(
  (state) => state?.getSpoolBreakUpSummary?.loading
);
  useEffect(() => {
    const finalEntity = entityData?.filter((da) => da?.is_admin === false);
    setEntity(finalEntity);
  }, [entityData]);

useEffect(() => {
  if (pagination) setTotalItems(pagination.totalCount || 0);
}, [pagination]);



  const handleRefresh = () => {
    setSearch('');
    setDisable(true);
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('voucher_no', elem?.voucher_no);
        bodyFormData.append('id', elem?._id);
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
        PdfDownloadErp({ apiMethod: 'post', url: '/download-spool-break-up-summary-piping', body: bodyFormData });
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
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Spool Break-Up Summary List</li>
                </ul>
              </div>
            </div>
          </div>

          {!loading ?  (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">

                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Spool Break-Up Summary List</h3>
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
                                      setCurrentPage(1);
                                    }}
                                  />
                                  {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                  <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                    alt="search" /></a>
                                </form>
                              </div>
                              <div className="add-group">
                                <PlannerQcAuth>
                                  <Link to="/piping/user/manage-spool-break-up"
                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                      src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                </PlannerQcAuth>
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
                      <table className="table border-0 custom-table comman-table  mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Packing List No.</th>
                            <th>Line No. / Drawing No.</th>
                            <th>Spool No.</th>
                           
                            <PlannerQcAuth>
                              <th className="text-end">Action</th>
                            </PlannerQcAuth>
                          </tr>
                        </thead>
                     <tbody>
  {spoolData?.length > 0 ? (
    spoolData.map((elem, i) => (
      <tr key={elem._id}>
        <td>{(currentPage - 1) * limit + i + 1}</td>

        <td>{elem.packing_list_no || "-"}</td>

        {/* Drawing No (multiple) */}
        {/* <td>
          {elem.items?.map((it, idx) => (
            <div key={idx}>{it.drawing_no || "-"}</div>
          ))}
        </td> */}
<td>
  {[...new Set(elem.items?.map(it => it.drawing_no))].map((dn, idx) => (
    <div key={idx}>{dn || "-"}</div>
  ))}
</td>
        {/* Spool No */}
        {/* <td>
          {elem.items?.map((it, idx) => (
            <div key={idx}>{it.spool_no || "-"}</div>
          ))}
        </td> */}

<td>
  {[...new Set(elem.items?.map(it => it.spool_no))].map((sn, idx) => (
    <div key={idx}>{sn || "-"}</div>
  ))}
</td>
        <PlannerQcAuth>
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
                                                                   <button type='button' className="dropdown-item" onClick={() => navigate(`/piping/user/view-spool-break-up-summary/view/${elem._id}`,  { state: elem })}>
                                                                               
                                                                                <i className="fa-solid fa-eye m-r-5"></i>
                                                                               View
                                                                            </button>  
                                                                        <button type='button' className="dropdown-item"
                                                                            onClick={() => handleDownloadIns(elem)}
                                                                        >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
                                                                    </div>
            </div>
          </td>
        </PlannerQcAuth>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6">
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
                            total={pagination?.totalCount || 0}
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
        <Footer />
      </div>
    </div>
  )
}

export default SpoolBreakUpSummary