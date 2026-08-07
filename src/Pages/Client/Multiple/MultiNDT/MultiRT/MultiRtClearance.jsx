import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import DropDown from '../../../../../Components/DropDown';
import Loader from '../../../Include/Loader';
import { Pagination } from '../../../Table';
import { BadgeCheck, X } from 'lucide-react';
import moment from 'moment';
import { QC } from '../../../../../BaseUrl';
import { getClientRtClearance } from '../../../../../Store/Client/Structural/Testing/getClientRtClearance';

/* ================= DEBOUNCE ================= */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const MultiRtClearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.getClientRtClearance);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);
  const ERP_ROLE = localStorage.getItem("ERP_ROLE");

  useEffect(() => {
    dispatch(getClientRtClearance({ page, limit, search: debouncedSearch }));
  }, [page, limit, debouncedSearch, dispatch]);

  const rows = useMemo(() => data?.data?.data || [], [data]);
  const totalItems = useMemo(() => data?.data?.totalItems || 0, [data]);

  /* ================= HANDLERS ================= */
  const handleRefresh = () => {
    setSearch("");
    setPage(1);
  };

  const handleDownload = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('test_inspect_no', elem.test_inspect_no);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({
      apiMethod: 'post',
      url: 'download-multi-rt-inspection',
      body: bodyFormData
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* ================= BREADCRUMBS ================= */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                Radiography Testing Clearance List
              </li>
            </ul>
          </div>

          {/* ================= TABLE CARD ================= */}
          <div className="card card-table show-entire">
            <div className="card-body">
              {/* ================= TOP BAR ================= */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>RT Clearance Summary</h3>
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
                      limit={limit}
                      onLimitChange={(v) => {
                        setLimit(v);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ================= TABLE ================= */}
              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>QC By</th>
                      <th>Assembly No</th>
                      <th>Date</th>
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
                      rows.map((r, i) => {
                        const assemblyNos = [
                          ...new Set(
                            r.items?.map(
                              (it) =>
                                it?.drawing_id?.assembly_no ||
                                it?.grid_item_id?.drawing_id?.assembly_no
                            ).filter(Boolean)
                          ),
                        ];

                        return (
                          <tr key={r._id}>
                            <td>{(page - 1) * limit + i + 1}</td>
                            <td>{r.test_inspect_no}</td>
                            <td>{r.qc_name?.name || r.qc_name?.user_name || "-"}</td>
                            <td>{assemblyNos.join(", ") || "-"}</td>
                            <td>
                              {r.qc_time
                                ? moment(r.qc_time).format("YYYY-MM-DD")
                                : "-"}
                            </td>

                            {/* ===== STATUS (EXACT SAME LOGIC) ===== */}
                            <td>
                              {["REVIEWED", "WITNESSED", "RANDOM WITNESSED"].includes(
                                r.status_type?.trim().toUpperCase()
                              ) ? (
                                <span className="custom-badge status-green">
                                  {r.status_type}
                                </span>
                              ) : (
                                <span className="custom-badge status-orange">
                                  {r.status_text || "Pending"}
                                </span>
                              )}
                            </td>

                            {/* ===== ACTION ===== */}
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
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() =>
                                      navigate(
                                        "/party/project-store/view-rt-clearance-summary",
                                        { state: r }
                                      )
                                    }
                                  >
                                    <i className="fa-solid fa-eye m-r-5"></i> View
                                  </button>
                                  <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => handleDownload(r)}
                                  >
                                    <i className="fa-solid fa-download m-r-5"></i>Download
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

              {/* ================= PAGINATION ================= */}
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
                    onPageChange={(p) => setPage(p)}
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

export default MultiRtClearance;