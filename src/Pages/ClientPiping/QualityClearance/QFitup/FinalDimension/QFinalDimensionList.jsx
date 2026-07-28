import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import { BadgeCheck, X } from 'lucide-react';
import moment from 'moment';
import DropDown from '../../../Components/DropDown';
import { QC, V_URL} from '../../../BaseUrl';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import axios from 'axios';


/* ---------------- Debounce ---------------- */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const QFinalDimensionList = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 500);
  const projectId = localStorage.getItem('PARTY_PROJECT_ID');

  /* ---------------- API CALL ---------------- */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${V_URL}/party/get-multi-fd`, {
        params: {
          page,
          limit,
          search: debouncedSearch,
          project: projectId,
          _t: Date.now(),
        },
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
        },
      });

      if (response.data.success) {
        setRows(response.data.data.data || []);
        setTotalItems(response.data.data.totalItems || 0);
      }
    } catch (err) {
      console.error('Final Dimension fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch]);

  /* ---------------- REFRESH ---------------- */
  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    fetchData();
  };

  /* ---------------- DOWNLOAD ---------------- */
  const downloadInspection = (row) => {
    const body = new URLSearchParams();
    body.append('report_no_two', row.report_no_two);
    body.append('print_date', true);

    PdfDownloadErp({
      apiMethod: 'post',
      url: 'one-multi-fd-download',
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

          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/piping-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                Final Dimension Acceptance
              </li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">

              {/* -------- TOP CONTROLS -------- */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Final Dimension Acceptance</h3>
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
                                  setPage(1);
                                }}
                              />
                              <a className="btn">
                                <img src="/assets/img/icons/search-normal.svg" alt="search" />
                              </a>
                            </form>
                          </div>
                          <div className="add-group">
                            <button
                              type="button"
                              onClick={handleRefresh}
                              className="btn btn-primary doctor-refresh ms-2">
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

              {/* -------- TABLE -------- */}
              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>Assem. No.</th>
                      <th>Date</th>
                        {localStorage.getItem('ERP_ROLE') === QC && <th>Verify</th>}
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 && (
                    <tr>
                      <td colSpan="7">
                        <div className="no-table-data">No Data Found!</div>
                      </td>
                    </tr>
                    )}

                    {rows.map((r, i) => {
                    // SAME DATA LOGIC AS QFitUpList (NO UI CHANGE)
                      const uniqueAssemblyNos = [
                          ...new Set(r?.items?.map(e => e?.drawing_id?.assembly_no).filter(Boolean))
                        ]

                    return (
                        <tr key={r._id}>
                          <td>{(page - 1) * limit + i + 1}</td>
                          <td>{r.report_no_two}</td>
                          <td>{uniqueAssemblyNos}</td>
                          <td>{moment(r.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                          {localStorage.getItem('ERP_ROLE') === QC && (
                            <td>
                              {r.status === 1 ? (
                              <BadgeCheck
                                  style={{ cursor: 'pointer' }}
                                  onClick={() =>
                                     navigate('/user/project-store/quality-clearance-final-dimension-management',
                                     { state: r })
                                  }
                              />
                               ) : (
                               <X />
                                )}
                            </td>
                        )}

                           <td>
                             {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(
                              r.status_type
                              ) ? (
                              <span className="custom-badge status-green">
                                {r.status_type}
                              </span>
                              ) : (
                             <span className="custom-badge status-orange">
                                {r.status_text || 'Pending'}
                             </span>
                             )}
                           </td>
                           <td className="text-end">
                            <div className="dropdown dropdown-action">
                             <a
                               href="#"
                               className="action-icon dropdown-toggle"
                               data-bs-toggle="dropdown">
                                 <i className="fa fa-ellipsis-v"></i>
                             </a>

                            <div className="dropdown-menu dropdown-menu-end">
                             <button
                                type="button"
                                className="dropdown-item"
                                onClick={() =>
                                   navigate(
                                      '/party/piping-store/view-quality-clearance-final-dimension',
                                   { state: r }
                                    )
                              }>
                                View
                              </button>

                              <button
                                 type="button"
                                 className="dropdown-item"
                                 onClick={() => downloadInspection(r)}
                              >
                               Download
                             </button>
                            </div>
                         </div>
                        </td>
                      </tr>
                      );
                    })} 
                </tbody>
              </table>
              </div>


              {/* -------- PAGINATION -------- */}
              <div className="row mt-3 mb-2">
                <div className="col-md-6">
                  Showing {rows.length} of {totalItems} total records
                </div>
                <div className="col-md-6 d-flex justify-content-end">
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

export default QFinalDimensionList;