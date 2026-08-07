import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import Loader from '../../../Include/Loader';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { Pagination } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import moment from 'moment';
import { getClientFinalCoat } from '../../../../../Store/Client/Structural/FinalCoat/getClientFinalCoat';

/* ---------------- Debounce ---------------- */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const MultiFinalCoat = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.getClientFinalCoat);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(getClientFinalCoat({ page, limit, search: debouncedSearch }));
  }, [page, limit, debouncedSearch, dispatch]);

  const rows = useMemo(() => data?.data?.data || [], [data]);
  const totalItems = useMemo(() => data?.data?.totalItems || 0, [data]);

  /* ---------------- Actions ---------------- */
  const handleRefresh = () => {
    setSearch("");
    setPage(1);
  };

  const downloadInspection = (row) => {
    const body = new URLSearchParams();
    body.append("report_no_two", row.report_no_two);
    body.append("print_date", true);
    PdfDownloadErp({
      apiMethod: "post",
      url: "get-final-coat-inspection-item",
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
          {/* ------------------ Breadcrumb ------------------ */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
              <li className="breadcrumb-item active">Final / Top Coating Offer List</li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">
              {/* ---------- Top Controls ---------- */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Final / Top Coating Offer List</h3>
                      <div className="doctor-search-blk">
                        <div className="top-nav-search table-search-blk">
                          <form onSubmit={(e) => e.preventDefault()}>
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
                      <th>Procedure No</th>
                      <th>Dispatch No</th>
                      <th>Offer By</th>
                      <th>Offer Date</th>
                      <th>Dispatch Site</th>
                      <th>Paint System</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan="11">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    ) : (
                      rows.map((item, i) => {
                        const dispatchNos = [
                          ...new Set(
                            item.items
                              ?.map((e) => e.dispatch_report)
                              .filter(Boolean)
                          ),
                        ];

                        const dispatchSites = [
                          ...new Set(
                            item.items
                              ?.map((e) => e.dispatch_site)
                              .filter(Boolean)
                          ),
                        ];

                        return (
                          <tr key={item._id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>{item.report_no_two || "-"}</td>
                            <td>{item.procedure_no}</td>
                            <td>{dispatchNos.join(", ") || "-"}</td>
                            <td>{item.offer_name || "-"}</td>
                            <td>
                              {item.offer_date
                                ? moment(item.offer_date).format(
                                  "YYYY-MM-DD HH:mm"
                                )
                                : "-"}
                            </td>
                            <td>{dispatchSites.join(", ") || "-"}</td>
                            <td>{item.paint_system_no || "-"}</td>



                            {/* -------- STATUS (MultiMio STYLE) -------- */}
                            <td>
                              {["REVIEWED", "WITNESSED", "RANDOM WITNESSED"].includes(
                                item.status_type
                              ) ? (
                                <span className="custom-badge status-green">
                                  {item.status_type}
                                </span>
                              ) : (
                                <span className="custom-badge status-orange">
                                  {item.status_text || "Pending"}
                                </span>
                              )}
                            </td>

                            {/* -------- ACTIONS -------- */}
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
                                        "/party/project-store/view-final-coat",
                                        { state: item }
                                      )
                                    }
                                  >
                                    <i className="fa-solid fa-eye m-r-5"></i> View
                                  </button>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => downloadInspection(item)}
                                  >
                                    <i className="fa-solid fa-download m-r-5"></i> Download
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

export default MultiFinalCoat;

