import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../Include/Header";
import Sidebar from "../../../Include/Sidebar";
import PageHeader from "../../Components/Breadcrumbs/PageHeader";
import Loader from "../../../Include/Loader";
import { Pagination, Search } from "../../../Table";
import moment from "moment";
import DropDown from "../../../../../Components/DropDown";
import { QC } from "../../../../../BaseUrl";
import { PdfDownloadErp } from "../../../../../Components/ErpPdf/PdfDownloadErp";
import { getMultiNdtOffer } from "../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList";
import { getUserNdtMaster } from "../../../../../Store/Store/Ndt/NdtMaster";
import { BadgeCheck, X } from "lucide-react";
import { getMultiMptClearancepiping } from "../../../../../Store/Piping/Ndt/MPT-CLEARANCE/mptClearance";
import { getMultiMptPendingpiping } from "../../../../../Store/Piping/Ndt/MPT-CLEARANCE/mptPending";
const MultiMptClearance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Pending List State
  const [pagePending, setPagePending] = useState(1);
  const [searchPending, setSearchPending] = useState("");
  const [limitPending, setLimitPending] = useState(10);
  const [disablePending, setDisablePending] = useState(true);

  // Clearance List State
  const [pageClearance, setPageClearance] = useState(1);
  const [searchClearance, setSearchClearance] = useState("");
  const [limitClearance, setLimitClearance] = useState(10);
  const [disableClearance, setDisableClearance] = useState(true);

  // Selectors
  const pendingData = useSelector((state) => state.getMultiMptPendingpiping);
  const clearanceData = useSelector(
    (state) => state.getMultiMptClearancepiping,
  );

  // Fetch Pending Data
  useEffect(() => {
    dispatch(
      getMultiMptPendingpiping({
        project_id: localStorage.getItem("U_PROJECT_ID"),
        page: pagePending,
        limit: limitPending,
        search: searchPending,
      }),
    );
  }, [pagePending, limitPending, searchPending, disablePending, dispatch]);

  // Fetch Clearance Data
  useEffect(() => {
    dispatch(
      getMultiMptClearancepiping({
        project_id: localStorage.getItem("U_PROJECT_ID"),
        page: pageClearance,
        limit: limitClearance,
        search: searchClearance,
      }),
    );
  }, [
    pageClearance,
    limitClearance,
    searchClearance,
    disableClearance,
    dispatch,
  ]);

  // Handle Refresh
  const handleRefreshPending = () => {
    setSearchPending("");
    setPagePending(1);
    setDisablePending(!disablePending); // Toggle to re-fetch
  };

  const handleRefreshClearance = () => {
    setSearchClearance("");
    setPageClearance(1);
    setDisableClearance(!disableClearance); // Toggle to re-fetch
  };

  // Filter Clearance Data (Frontend filtering for status 0 as requested, though backend pagination might make this tricky)
  // Assuming backend returns filtered data or we filter what we have.
  // Ideally backend should handle this, but respecting "skip status 0" instruction here.
  const filteredClearanceData = useMemo(() => {
    return clearanceData?.offers?.filter((item) => item.status !== 0) || [];
  }, [clearanceData?.offers]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDownload = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("inspection_id", elem._id);
    bodyFormData.append("print_date", true);
    PdfDownloadErp({
      apiMethod: "post",
      url: "piping/download-mpt-pdf",
      body: bodyFormData,
    });
  };

  const handleDownloadOffer = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("inspection_id", elem._id);
    bodyFormData.append("print_date", true);
    PdfDownloadErp({
      apiMethod: "post",
      url: "piping/download-mpt-offer-pdf",
      body: bodyFormData,
    });
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              {
                name: "Dashboard",
                link: "/piping/user/dashboard",
                active: false,
              },
              {
                name: "Magnetic Particle Testing Clearance List",
                active: false,
              },
            ]}
          />

          {/* Pending List Section */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Magnetic Particle Testing Offering List</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <Search
                                  onSearch={(value) => {
                                    setSearchPending(value);
                                    setPagePending(1);
                                  }}
                                />
                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
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
                                onClick={handleRefreshPending}
                                className="btn btn-primary doctor-refresh ms-2"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Refresh"
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
                          limit={limitPending}
                          onLimitChange={(val) => setLimitPending(val)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table  mb-0 datatable">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Off. Report No.</th>
                          <th>Line No. / Drawing No.</th>
                          <th>Spool No. </th>
                          <th>Off. By</th>
                          <th>Date</th>
                          <th>Verify</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingData?.loading ? (
                          <tr>
                            <td colSpan="6" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          pendingData?.offers?.map((elem, i) => (
                            <tr key={elem._id || i}>
                              <td>
                                {(pagePending - 1) * limitPending + i + 1}
                              </td>
                              <td>{elem?.offer_no}</td>
                              <td>
                                {elem?.items
                                  ?.map((e) => e?.drawing_no)
                                  .filter(
                                    (value, index, self) =>
                                      self.indexOf(value) === index,
                                  )
                                  .map((value, index) => (
                                    <span key={index}>
                                      {value}
                                      <br />
                                    </span>
                                  )) || "-"}
                              </td>
                              <td>
                                {elem?.items
                                  ?.map((e) => e?.spool_no)
                                  .filter(
                                    (value, index, self) =>
                                      self.indexOf(value) === index,
                                  )
                                  .map((value, index) => (
                                    <span key={index}>
                                      {value}
                                      <br />
                                    </span>
                                  )) || "-"}
                              </td>
                              <td>{elem?.offered_by}</td>
                              <td>
                                {elem?.offer_date
                                  ? moment(elem.offer_date).format("YYYY-MM-DD")
                                  : "-"}
                              </td>
                              {localStorage.getItem("ERP_ROLE") === QC && (
                                <td>
                                  <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate(
                                        "/piping/user/manage-mpt-clearance",
                                        { state: elem },
                                      )
                                    }
                                  >
                                    <BadgeCheck />
                                  </span>
                                </td>
                              )}
                              <td>
                                <span className="custom-badge status-orange">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          ))
                        )}

                        {!pendingData?.loading &&
                          pendingData?.offers?.length === 0 && (
                            <tr>
                              <td colSpan="6">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>

                  <div className="row align-center mt-3 mb-2">
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                      <div
                        className="dataTables_info"
                        id="DataTables_Table_0_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing{" "}
                        {Math.min(
                          limitPending,
                          pendingData?.pagination?.totalItems || 0,
                        )}{" "}
                        from {pendingData?.pagination?.totalItems || 0} data
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="DataTables_Table_0_paginate"
                      >
                        <Pagination
                          total={pendingData?.pagination?.totalItems || 0}
                          itemsPerPage={limitPending}
                          currentPage={pagePending}
                          onPageChange={(page) => setPagePending(page)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clearance List Section */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Magnetic Particle Testing Clearance List</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <Search
                                  onSearch={(value) => {
                                    setSearchClearance(value);
                                    setPageClearance(1);
                                  }}
                                />
                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
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
                                onClick={handleRefreshClearance}
                                className="btn btn-primary doctor-refresh ms-2"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Refresh"
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
                          limit={limitClearance}
                          onLimitChange={(val) => setLimitClearance(val)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Report No.</th>
                          <th>Off. Report No.</th>
                          <th>Line No. / Drawing No.</th>
                          <th>Spool No. </th>
                          <th>Qc. By</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clearanceData?.loading ? (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          filteredClearanceData?.map((elem, i) => (
                            <tr key={elem?._id || i}>
                              <td>
                                {(pageClearance - 1) * limitClearance + i + 1}
                              </td>
                              <td>{elem?.report_no}</td>
                              <td>{elem?.offer_no}</td>
                              <td>
                                {elem?.items
                                  ?.map((e) => e?.drawing_no)
                                  .filter(
                                    (value, index, self) =>
                                      self.indexOf(value) === index,
                                  )
                                  .map((value, index) => (
                                    <span key={index}>
                                      {value}
                                      <br />
                                    </span>
                                  )) || "-"}
                              </td>
                              <td>
                                {elem?.items
                                  ?.map((e) => e?.spool_no)
                                  .filter(
                                    (value, index, self) =>
                                      self.indexOf(value) === index,
                                  )
                                  .map((value, index) => (
                                    <span key={index}>
                                      {value}
                                      <br />
                                    </span>
                                  )) || "-"}
                              </td>
                              <td>{elem?.qc_name?.name}</td>
                              <td>
                                {elem?.qc_time
                                  ? moment(elem.qc_time).format("YYYY-MM-DD")
                                  : "-"}
                              </td>
                              <td className="status-badge">
                                {elem.status === 0 ? (
                                  <span className="custom-badge status-orange">
                                    Pending
                                  </span>
                                ) : elem.status === 1 ? (
                                  <span className="custom-badge status-green">
                                    Accepted
                                  </span>
                                ) : elem.status === 2 ? (
                                  <span className="custom-badge status-pink">
                                    Rejected
                                  </span>
                                ) : elem.status === 4 ? (
                                  <span className="custom-badge status-blue">
                                    Send For Clearance
                                  </span>
                                ) : elem.status === 3 ? (
                                  <span className="custom-badge status-purple">
                                    Partially
                                  </span>
                                ) : null}
                              </td>
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() =>
                                        navigate(
                                          "/piping/user/manage-mpt-clearance",
                                          { state: elem },
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-eye m-r-5"></i>
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => handleDownloadOffer(elem)}
                                    >
                                      <i className="fa-solid fa-download  m-r-5"></i>{" "}
                                      Download Offer
                                    </button>
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => handleDownload(elem)}
                                    >
                                      <i className="fa-solid fa-download  m-r-5"></i>{" "}
                                      Download Inspection
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}

                        {!clearanceData?.loading &&
                          filteredClearanceData?.length === 0 && (
                            <tr>
                              <td colSpan="7">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-center mt-3 mb-2">
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                      <div
                        className="dataTables_info"
                        id="DataTables_Table_0_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing{" "}
                        {Math.min(
                          limitClearance,
                          clearanceData?.pagination?.totalItems || 0,
                        )}{" "}
                        from {clearanceData?.pagination?.totalItems || 0} data
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
                        id="DataTables_Table_0_paginate"
                      >
                        <Pagination
                          total={clearanceData?.pagination?.totalItems || 0}
                          itemsPerPage={limitClearance}
                          currentPage={pageClearance}
                          onPageChange={(page) => setPageClearance(page)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiMptClearance;
