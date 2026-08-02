import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { V_URL } from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';

// Read-only list of generated/saved Line History Sheets (LHS documents),
// distinct from the live drawing-based Line History Sheet list.
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const GenLineHistoryList = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const projectId = localStorage.getItem('PARTY_PROJECT_ID');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${V_URL}/party/get-generate-line-history-sheet-piping`,
        {
          page,
          limit,
          search: debouncedSearch,
          project: projectId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );
      setRows(res?.data?.data || []);
      setTotalItems(res?.data?.pagination?.total || 0);
    } catch (err) {
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
  };

  const handleDownloadIns = (lhs) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('project_id', projectId);
    bodyFormData.append('drawing_id', lhs?.drawings?.[0]?.drawing_id);
    bodyFormData.append('_id', lhs?._id);
    PdfDownloadErp({
      apiMethod: 'post',
      url: 'download-line-history-sheet-pdf',
      body: bodyFormData,
    });
  };

  return (
    <>
      <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
        <Header handleOpen={handleOpen} />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/party/piping-store/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right"></i>
                    </li>
                    <li className="breadcrumb-item active">Generated Line History Sheets</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Generated Line History Sheets</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                                  className="btn btn-primary doctor-refresh ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Refresh"
                                >
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} />
                        </div>
                      </div>
                    </div>

                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table border-0 custom-table comman-table mb-0">
                            <thead>
                              <tr>
                                <th className="text-start" style={{ width: '35px' }}>
                                  Sr.
                                </th>
                                <th>Report No.</th>
                                <th>Line No. / Drawing No.</th>
                                <th>Rev No.</th>
                                <th>Spool No.</th>
                                <th className="text-end">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.length === 0 && (
                                <tr>
                                  <td colSpan="6">
                                    <div className="no-table-data">No Data Found!</div>
                                  </td>
                                </tr>
                              )}
                              {rows.map((lhs, lhsIndex) =>
                                (lhs.drawings || [{}]).map((drawing, dIndex) => (
                                  <tr key={`${lhs._id}-${dIndex}`}>
                                    <td className="text-start">
                                      {(page - 1) * limit + lhsIndex + 1}
                                    </td>
                                    <td>{lhs?.report_no || '-'}</td>
                                    <td>{lhs?.drawing_details?.[dIndex]?.drawing_no || '-'}</td>
                                    <td>{lhs?.drawing_details?.[dIndex]?.rev || '-'}</td>
                                    <td>
                                      {lhs?.spool_details
                                        ?.map((e) => e?.spool_no)
                                        .filter((value, index, self) => self.indexOf(value) === index)
                                        .join(', ') || '-'}
                                    </td>
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
                                              navigate('/party/piping-store/view-Genline-history', {
                                                state: { drawingData: lhs },
                                              })
                                            }
                                          >
                                            <i className="fa-solid fa-eye m-r-5"></i> View
                                          </button>
                                          <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => handleDownloadIns(lhs)}
                                          >
                                            <i className="fa-solid fa-download m-r-5"></i> Download Report
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="row align-center mt-3 mb-2">
                          <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                            <div className="dataTables_info" role="status" aria-live="polite">
                              Showing {Math.min(limit, totalItems)} from {totalItems} data
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                            <div className="dataTables_paginate paging_simple_numbers">
                              <Pagination
                                total={totalItems}
                                itemsPerPage={limit}
                                currentPage={page}
                                onPageChange={(p) => setPage(p)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default GenLineHistoryList;
