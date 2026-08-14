import React, { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import Loader from '../../../Include/Loader';
import { Pagination, Search } from '../../../Table';
import moment from 'moment';
import axios from 'axios';
import DropDown from '../../../../../Components/DropDown';
import { V_URL } from '../../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { getClientPipingMultiPickling } from '../../../../../Store/Client/Piping/NDT/getClientPipingMultiPickling';
import toast from 'react-hot-toast';

const MultiPicklingClearance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data: reduxData, loading } = useSelector((state) => state.getClientPipingMultiPickling);
  const allRows = reduxData?.data || [];

  const fetchData = () => {
    dispatch(getClientPipingMultiPickling());
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRows = useMemo(() => {
    let data = allRows;
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.report_no?.toLowerCase().includes(s) ||
          r.report_no_two?.toLowerCase().includes(s) ||
          r.drawing_no?.toLowerCase().includes(s) ||
          r.spool_no?.toLowerCase().includes(s)
      );
    }
    return data;
  }, [allRows, search]);

  const totalItems = filteredRows.length;
  const pagedRows = filteredRows.slice((page - 1) * limit, page * limit);

  useEffect(() => {
    setPage(1);
  }, [search, limit]);

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    fetchData();
  };

  const downloadInspection = async (row) => {
    try {
      const toastId = toast.loading('Downloading...');
      const response = await axios.post(
        `${V_URL}/party/download-piping-pickling-client`,
        {
          report_no: row.report_no,
          print_date: true
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
          responseType: 'blob',
        }
      );

      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `Pickling_${row.report_no_two || row.report_no || 'Report'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloaded successfully', { id: toastId });
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
                    <li className="breadcrumb-item active">Pickling & Passivation Acc / Rej</li>
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
                            <h3>Pickling & Passivation Clearance</h3>
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
                              {pagedRows.length === 0 && (
                                <tr>
                                  <td colSpan="9">
                                    <div className="no-table-data">No Data Found!</div>
                                  </td>
                                </tr>
                              )}
                              {pagedRows.map((elem, i) => (
                                <tr key={elem._id || i}>
                                  <td>{(page - 1) * limit + i + 1}</td>
                                  <td>{elem?.report_no}</td>
                                  <td>{elem?.report_no_two}</td>
                                  <td>{elem?.drawing_no || '-'}</td>
                                  <td>{elem?.spool_no || '-'}</td>
                                  <td>
                                    {typeof elem?.qc_by === 'object'
                                      ? elem?.qc_by?.name
                                      : (elem?.qc_by || '-')}
                                  </td>
                                  <td>
                                    {elem.qc_date ? moment(elem.qc_date).format('DD-MM-YYYY') : '-'}
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
                                          onClick={() => navigate('/party/piping-store/view-quality-clearance-pickling', { state: elem })}
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

export default MultiPicklingClearance;
