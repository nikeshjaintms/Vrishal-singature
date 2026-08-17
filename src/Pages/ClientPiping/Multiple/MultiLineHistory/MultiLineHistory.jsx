import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { getPartyLHSClient } from '../../../../Store/Client/Piping/getClientPipingMultiLHS';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const MultiLineHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const projectId = localStorage.getItem('PARTY_PROJECT_ID');

  const { data, loading } = useSelector((state) => state.getClientPipingMultiLHS);

  // The API response might have success: true, and data inside data.data or directly in data
  const rows = data?.success && Array.isArray(data?.data)
    ? data.data
    : (data?.data?.data && Array.isArray(data.data.data)
      ? data.data.data
      : (Array.isArray(data) ? data : (data?.data || [])));

  const totalItems = data?.pagination?.totalRecords || data?.data?.pagination?.totalRecords || rows.length || 0;

  const fetchData = () => {
    dispatch(
      getPartyLHSClient({
        page,
        limit,
        search: debouncedSearch,
        project: projectId,
      })
    );
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

  const downloadInspection = async (elem) => {
    try {
      const toastId = toast.loading('Downloading...');
      const response = await axios.post(
        `${V_URL}/party/download-lhs-client`,
        {
          report_no: elem.report_no || '',
          print_date: ''
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          }
        }
      );

      const fileUrl = response.data?.data?.file || response.data?.file || '';
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `Line_History_${elem.report_no || 'Report'}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Downloaded successfully', { id: toastId });
      } else {
        toast.error('Failed to get download URL', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to download PDF');
    }
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
                    <li className="breadcrumb-item active">Line History Sheet List</li>
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
                            <h3>Line History Sheet List</h3>
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
                                <th>Summary Date</th>
                                <th>Drawings</th>
                                <th>Status</th>
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
                              {rows.map((elem, i) => (
                                <tr key={elem._id || i}>
                                  <td className="text-start">
                                    {(page - 1) * limit + i + 1}
                                  </td>
                                  <td>{elem?.report_no || '-'}</td>
                                  <td>{elem?.summary_date ? new Date(elem.summary_date).toLocaleDateString() : '-'}</td>
                                  <td>
                                    {elem?.drawings
                                      ?.map((d) => d?.drawing_no || d?.drawing_id?.drawing_no || d?.drawing_id || '-')
                                      .filter((value, index, self) => self.indexOf(value) === index)
                                      .join(', ') || '-'}
                                  </td>
                                  <td className="status-badge">
                                    {elem.client_status === 0 || elem.client_status === null ? (
                                      <span className="custom-badge status-orange">Pending</span>
                                    ) : elem.client_status === 1 ? (
                                      <span className="custom-badge status-green">{elem.status_type}</span>
                                    ) : null}
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
                                            navigate('/party/piping-store/view-line-history', {
                                              state: elem,
                                            })
                                          }
                                        >
                                          <i className="fa-solid fa-eye m-r-5"></i> View
                                        </button>
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() => downloadInspection(elem)}
                                        >
                                          <i className="fa-solid fa-download m-r-5"></i> Download
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
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

export default MultiLineHistory;
