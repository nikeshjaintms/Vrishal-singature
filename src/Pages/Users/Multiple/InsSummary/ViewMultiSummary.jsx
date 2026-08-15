import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
const ViewMultiSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [limit, setlimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableData, setTableData] = useState([]);
  const data = location.state;

  useEffect(() => {
    dispatch(getUserAdminDraw());
    dispatch(getUserWpsMaster({ status: true }));
  }, []);

  useEffect(() => {
    if (data) {
      setTableData(data?.items);
    }
  }, [data]);

  const commentsData = useMemo(() => {
    let computedComments = tableData || [];

    if (search) {
      computedComments = computedComments.filter(
        (fit) =>
          fit?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, tableData]);

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
          <PageHeader breadcrumbs={[
            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
            { name: "Inspection Summary Records List", link: "/user/project-store/inspection-summary-management", active: false },
            { name: `View Inspection Summary Details`, active: true }
          ]} />

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>View Inspection Summary Details</h4>
                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Inspection Summary List <span className="login-danger">*</span></label>
                          <input value={data?.report_no} className='form-control' readOnly />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">

                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Inspection Summary List</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <Search onSearch={(value) => {
                                  setSearch(value);
                                  setCurrentPage(1);
                                }} />
                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                  alt="search" /></a>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive mt-2">
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No.</th>
                          <th>Rev</th>
                          <th>Asse. No.</th>
                          <th>Grid. No.</th>
                          <th>FD Grid. No.</th>
                          <th>Fitup Ins Report</th>
                          <th>Weld Visual Ins Report</th>
                          <th>UT Report</th>
                          <th>RT Report</th>
                          <th>MPT Report</th>
                          <th>LPT Report</th>
                          <th>FD Report</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.length > 0 ? (
                          commentsData?.map((elem, i) => (
                            <tr key={i}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.drawing_no}</td>
                              <td>{elem?.rev}</td>
                              <td>{elem?.assembly_no}</td>
                              <td>{elem?.grid_no}</td>
                              <td>{elem?.is_grid_qty}</td>
                              <td>
                                {elem?.fitup_inspection_report &&
                                  elem.fitup_inspection_report.length > 0 ? (
                                  elem.fitup_inspection_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {elem?.weld_inspection_report &&
                                  elem.weld_inspection_report.length > 0 ? (
                                  elem.weld_inspection_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {elem?.ut_report &&
                                  elem.ut_report.length > 0 ? (
                                  elem.ut_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {elem?.rt_report &&
                                  elem.rt_report.length > 0 ? (
                                  elem.rt_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {elem?.mpt_report &&
                                  elem.mpt_report.length > 0 ? (
                                  elem.mpt_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {elem?.lpt_report &&
                                  elem.lpt_report.length > 0 ? (
                                  elem.lpt_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {elem?.fd_report &&
                                  elem.fd_report.length > 0 ? (
                                  elem.fd_report
                                    .filter((value, index, self) => self.indexOf(value) === index)
                                    .map((e, index) => <div key={index}>{e}</div>)
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{elem?.remarks || "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="999">
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
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/inspection-summary-management')}>Back</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewMultiSummary