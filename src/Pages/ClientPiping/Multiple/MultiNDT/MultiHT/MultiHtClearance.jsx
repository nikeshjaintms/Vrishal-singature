import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import Loader from '../../../Include/Loader';
import { Pagination, Search } from '../../../Table';
import moment from 'moment';
import axios from 'axios';
import DropDown from '../../../../../Components/DropDown';
import { V_URL } from '../../../../../BaseUrl';
import toast from 'react-hot-toast';

const MultiHtClearance = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const projectId = localStorage.getItem('PARTY_PROJECT_ID');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${V_URL}/party/get-piping-ht-client`,
        {
          project_id: projectId,
          page,
          limit,
          search,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      const responseData = res?.data?.data;

      const data = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      const total = Array.isArray(responseData)
        ? res?.data?.pagination?.totalItems || data.length
        : responseData?.totalItems || 0;

      setRows(data);
      setTotalItems(total);
    } catch (err) {
      console.error('HT fetch error:', err);
      setRows([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
  };

  const downloadInspection = async (elem) => {
    try {
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('report_no_two', elem.report_no_two);
      bodyFormData.append('print_date', true);

      const res = await axios.post(
        `${V_URL}/party/download-piping-ht-client`,
        bodyFormData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
          responseType: 'blob',
        }
      );

      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank');
    } catch (err) {
      console.error('HT PDF download error:', err);
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
                    <li className="breadcrumb-item active">Hardness Testing Acc / Rej</li>
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
                            <h3>Hardness Testing Clearance</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search onSearch={(value) => setSearch(value)} />
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
                                <th>Sr.</th>
                                <th>Report No.</th>
                                <th>Off. Report No.</th>
                                <th>Line No./Drawing No.</th>
                                <th>Spool No.</th>
                                <th>Qc. By</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th className="text-end">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rows.length === 0 && (
                                <tr>
                                  <td colSpan="9">
                                    <div className="no-table-data">No Data Found!</div>
                                  </td>
                                </tr>
                              )}
                              {rows.map((elem, i) => (
                                <tr key={elem.item_id || elem.ht_test_id || i}>
                                  <td>{(page - 1) * limit + i + 1}</td>
                                  <td>{elem?.report_no}</td>
                                  <td>{elem?.report_no_two}</td>
                                   <td>
                                    {[...new Set(
                                      elem?.items
                                        ?.map((e) => e?.drawing_id?.drawing_no)
                                        .filter(Boolean)
                                    )].map((drawingNo, index) => (
                                      <span key={index}>
                                        {drawingNo}
                                        <br />
                                      </span>
                                    ))}
                                  </td>
                                  <td>
                                    {elem?.items
                                      ?.map((e) => e?.spool_no)
                                      .filter((value, index, self) => self.indexOf(value) === index)
                                      .map((value, index) => (
                                        <span key={index}>
                                          {value}
                                          <br />
                                        </span>
                                      )) || '-'}
                                  </td>
                                  <td>{elem?.qc_by?.user_name || '-'}</td>
                                  <td>
                                    {elem.qc_date ? moment(elem.qc_date).format('DD-MM-YYYY') : '-'}
                                  </td>
                                  <td className="status-badge">
                                    {elem.status === 1 ? (
                                      <span className="custom-badge status-orange">Pending</span>
                                    ) : elem.status === 2 ? (
                                      <span className="custom-badge status-green">Accepted</span>
                                    ) : elem.status === 3 ? (
                                      <span className="custom-badge status-pink">Rejected</span>
                                    ) : elem.status === 4 ? (
                                      <span className="custom-badge status-purple">Partially</span>
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
                                            navigate('/party/piping-store/view-quality-clearance-ht', { state: elem })
                                          }
                                        >
                                          <i className="fa-solid fa-eye m-r-5"></i>
                                          View
                                        </button>
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() => downloadInspection(elem)}
                                        >
                                          <i className="fa-solid fa-download m-r-5"></i>
                                          Download Inspection
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

export default MultiHtClearance;
