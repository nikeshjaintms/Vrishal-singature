import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import Loader from "../../Include/Loader";
import { Pagination, SearchIndex } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import moment from 'moment';
import { BadgeCheck, X } from "lucide-react";
import { QC } from "../../../../BaseUrl";
import { PdfDownloadErp } from "../../../../Components/ErpPdf/PdfDownloadErp";
import { getMultiWeldVisualPiping } from "../../../../Store/Piping/WeldVisual/getMultiWeldVisualPiping";
const useDebounce = (value, delay = 600) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};
const QWeldVisualList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  //  const [totalItems1, setTotalItems1] = useState(0);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [search1, setSearch1] = useState("");
  const [limit1, setlimit1] = useState(10);
  const [disable1, setDisable1] = useState(true);
  // const [showModal, setShowModal] = useState(false);
  const debouncedSearch = useDebounce(search, 600);
  const debouncedSearch1 = useDebounce(search1, 600);
  // useEffect(() => {
  //     if (disable === true) {
  //         // dispatch(getUserWeldVisual({ status: '' }))
  //         dispatch(getMultiWeldVisualPiping({ status: '', page: currentPage, limit,search }));
  //         setDisable(false);
  //     }
  //     else{
  //         dispatch(getMultiWeldVisualPiping({ status: '', page: currentPage, limit, search }));
  //     }
  // }, [dispatch, disable, currentPage, limit, search]);

  useEffect(() => {
    // Pending
    // setDisable(true);
    dispatch(
      getMultiWeldVisualPiping({
        page: currentPage,
        limit,
        search: debouncedSearch,
        status: 1,
      }),
    ).then(() => setDisable(false));

    // Completed
    // setDisable1(true);
    dispatch(
      getMultiWeldVisualPiping({
        page: currentPage1,
        limit: limit1,
        search: debouncedSearch1,
        status: "2,3,7",
      }),
    ).then(() => setDisable1(false));
  }, [
    dispatch,
    currentPage,
    limit,
    debouncedSearch,
    currentPage1,
    limit1,
    debouncedSearch1,
  ]);

  const entity = useSelector(
    (state) => state.getMultiWeldVisualPiping?.user?.data,
  );
  console.log("Weld Visual Data", entity);
  const pagination =
    useSelector((state) => state.getMultiWeldVisualPiping?.user?.pagination) ||
    [];

  const totalCount = useSelector(
    (state) => state?.getMultiWeldVisualPiping?.user?.data?.pagination?.total,
  ); // <== NEW
  const pendingData = useSelector(
    (state) => state.getMultiWeldVisualPiping?.pendingList?.data,
  );
  const pendingDataTotalCount = useSelector(
    (state) => state.getMultiWeldVisualPiping?.pendingList?.pagination?.total,
  );
  console.log("pendingDataTotalCount", pendingDataTotalCount);

  const completedData = useSelector(
    (state) => state.getMultiWeldVisualPiping?.completedList?.data,
  );

  const completedDataTotalCount = useSelector(
    (state) => state.getMultiWeldVisualPiping?.completedList?.pagination?.total,
  );
  console.log("completedDataTotalCount", completedDataTotalCount);

  useEffect(() => {
    setTotalItems(pagination.total);
  }, [pagination]);

  const handleRefresh = () => {
    setCurrentPage(1);
    setSearch("");
    // dispatch(getMultiFitupPiping({ page: currentPage, limit }));
    dispatch(
      getMultiWeldVisualPiping({
        page: currentPage,
        limit: limit1,
        status: 1,
      }),
    );
  };

  const handleRefresh1 = () => {
    setCurrentPage1(1);
    setSearch1("");
    // dispatch(getMultiFitupPiping({ page: currentPage1, limit1 }));
    dispatch(
      getMultiWeldVisualPiping({
        page: currentPage1,
        limit: limit1,
        status: "2,3,7",
      }),
    );
  };
  const handleDownloadIns = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("report_no_two", elem.report_no_two);
    bodyFormData.append("print_date", true);
    PdfDownloadErp({
      apiMethod: "post",
      url: "download-weld-visual-inspection-pdf-piping",
      body: bodyFormData,
    });
  };

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
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    Weld Visual Clearance List
                  </li>
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
                            <h3>Weld Visual Clearance List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <SearchIndex
                                    value={search}
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
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
                                {/* <Link to="/user/project-store/quality-clearance-weld-visual-management"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link> */}
                                <button
                                  type="button"
                                  onClick={handleRefresh}
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
                          {/* <div className="add-group mx-2">
                                                        <button type='button' onClick={() => setShowModal(true)}
                                                            className="btn btn-primary doctor-refresh w-100 ms-2" data-toggle="tooltip" data-placement="top" title="QC Report">
                                                            Generate Report
                                                        </button>
                                                    </div> */}
                          {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                          <DropDown
                            limit={limit}
                            onLimitChange={(val) => {
                              setlimit(val);
                              setCurrentPage(1);
                              setDisable(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      {/* <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Spool No.</th>
                                                        <th>Offer By.</th>
                                                        <th>Date</th>
                                                        {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                   
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>{elem?.offered_by?.user_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/piping/user/quality-clearance-weld-visual-management', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : (<span><X /></span>)}
                                                                </td>
                                                            )}
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        {elem?.status !== 1 ? (
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
                                                                        ) : (
                                                                            <button type='button' className='dropdown-item'>Ins. Not Found</button>
                                                                        )}
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
                                            </table> */}
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Report No.</th>
                            <th>Line No. / Drawing No.</th>
                            <th>Rev No.</th>
                            <th>Sheet No.</th>
                            <th>Spool No.</th>
                            {localStorage.getItem("ERP_ROLE") === QC && (
                              <th>Verify</th>
                            )}
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingData?.map((elem, i) => {
                            // Aggregate unique values from jointDetails
                            const uniqueDrawingNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.drawing_no)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            const uniqueRevNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.rev)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            const uniqueSheetNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.sheet_no)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            const uniqueSpoolNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.spool_no)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            return (
                              <tr key={elem?._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem?.report_no}</td>
                                <td>{uniqueDrawingNo.join(", ")}</td>
                                <td>{uniqueRevNo.join(", ")}</td>
                                <td>{uniqueSheetNo.join(", ")}</td>
                                <td>{uniqueSpoolNo.join(", ")}</td>

                                {localStorage.getItem("ERP_ROLE") === QC && (
                                  <td>
                                    {elem?.status === 1 ? (
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          navigate(
                                            "/piping/user/quality-clearance-weld-visual-management",
                                            { state: elem },
                                          )
                                        }
                                      >
                                        <BadgeCheck />
                                      </span>
                                    ) : (
                                      <span>
                                        <X />
                                      </span>
                                    )}
                                  </td>
                                )}

                                <td className="status-badge">
                                  {elem.status === 1 ? (
                                    <span className="custom-badge status-orange">
                                      Pending
                                    </span>
                                  ) : elem.status === 2 ? (
                                    <span className="custom-badge status-green">
                                      Accepted
                                    </span>
                                  ) : elem.status === 3 ? (
                                    <span className="custom-badge status-pink">
                                      Rejected
                                    </span>
                                  ) : elem.status === 7 ? (
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
                                      {elem?.status !== 1 ? (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() =>
                                            navigate(
                                              `/piping/user/view-weld-visual-management/view/${elem._id}`,
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-eye m-r-5"></i>
                                          View
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                        >
                                          Ins. Not Found
                                        </button>
                                      )}
                                      {elem?.status !== 1 ? (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleDownloadIns(elem)
                                          }
                                        >
                                          <i className="fa-solid fa-download m-r-5"></i>{" "}
                                          Download Inspection
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                        >
                                          Ins. Not Found
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {pendingData?.length === 0 && (
                            <tr>
                              <td colSpan="999">
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
                          Showing {Math.min(limit, pendingDataTotalCount)} from{" "}
                          {pendingDataTotalCount} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate"
                        >
                          {/* <Pagination
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                          onPageChange={(page) => {
                                                             setCurrentPage(page);
                                                         setDisable(true); // force API refetch
                                                                     }}
                                                    /> */}

                          <Pagination
                            total={pendingDataTotalCount}
                            itemsPerPage={limit}
                            currentPage={currentPage}
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
          ) : (
            <Loader />
          )}

          {disable1 === false ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Weld Visual Clearance Completed List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <SearchIndex
                                    value={search1}
                                    onSearch={(value) => {
                                      setSearch1(value);
                                      setCurrentPage1(1);
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
                                {/* <Link to="/user/project-store/quality-clearance-weld-visual-management"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link> */}
                                <button
                                  type="button"
                                  onClick={handleRefresh1}
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
                          {/* <div className="add-group mx-2">
                                                        <button type='button' onClick={() => setShowModal(true)}
                                                            className="btn btn-primary doctor-refresh w-100 ms-2" data-toggle="tooltip" data-placement="top" title="QC Report">
                                                            Generate Report
                                                        </button>
                                                    </div> */}
                          {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                          <DropDown
                            limit={limit1}
                            onLimitChange={(val) => {
                              setlimit1(val);
                              setCurrentPage1(1);
                              setDisable1(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Report No.</th>
                            <th>Line No. / Drawing No.</th>
                            <th>Rev No.</th>
                            <th>Sheet No.</th>
                            <th>Spool No.</th>
                            <th>Acceptance Report No.</th>
                            <th>Offered By</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedData?.map((elem, i) => {
                            // Aggregate unique values from jointDetails
                            const uniqueDrawingNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.drawing_no)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            const uniqueRevNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.rev)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            const uniqueSheetNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.sheet_no)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            const uniqueSpoolNo = [
                              ...new Set(
                                elem?.items?.flatMap((item) =>
                                  item?.jointDetails
                                    ?.map((j) => j?.spool_no)
                                    .filter(Boolean),
                                ) || [],
                              ),
                            ];

                            return (
                              <tr key={elem?._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem?.report_no}</td>
                                <td>{uniqueDrawingNo.join(", ")}</td>
                                <td>{uniqueRevNo.join(", ")}</td>
                                <td>{uniqueSheetNo.join(", ")}</td>
                                <td>{uniqueSpoolNo.join(", ")}</td>
                                <td>{elem?.report_no_two}</td>
                                <td>{elem?.offered_by?.user_name}</td>
                                 <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                <td className="status-badge">
                                  {elem.status === 1 ? (
                                    <span className="custom-badge status-orange">
                                      Pending
                                    </span>
                                  ) : elem.status === 2 ? (
                                    <span className="custom-badge status-green">
                                      Accepted
                                    </span>
                                  ) : elem.status === 3 ? (
                                    <span className="custom-badge status-pink">
                                      Rejected
                                    </span>
                                  ) : elem.status === 7 ? (
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
                                      {elem?.status !== 1 ? (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() =>
                                            navigate(
                                              `/piping/user/view-weld-visual-management/view/${elem._id}`,
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-eye m-r-5"></i>
                                          View
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                        >
                                          Ins. Not Found
                                        </button>
                                      )}
                                      {elem?.status !== 1 ? (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleDownloadIns(elem)
                                          }
                                        >
                                          <i className="fa-solid fa-download m-r-5"></i>{" "}
                                          Download Inspection
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                        >
                                          Ins. Not Found
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {completedData?.length === 0 && (
                            <tr>
                              <td colSpan="999">
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
                          Showing {Math.min(limit1, completedDataTotalCount)}{" "}
                          from {completedDataTotalCount} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate"
                        >
                          {/* <Pagination
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                          onPageChange={(page) => {
                                                             setCurrentPage(page);
                                                         setDisable(true); // force API refetch
                                                                     }}
                                                    /> */}

                          <Pagination
                            total={completedDataTotalCount}
                            itemsPerPage={limit1}
                            currentPage={currentPage1}
                            onPageChange={(page) => {
                              setCurrentPage1(page);
                              setDisable1(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default QWeldVisualList;
