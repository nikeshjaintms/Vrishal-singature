import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { getClientPipingMultiFitup } from '../../../../Store/Client/Piping/Fitup/getClientPipingMultiFitup';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import toast from 'react-hot-toast';
import axios from 'axios';
import { V_URL } from '../../../../BaseUrl';
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const QFitUpList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { data: reduxData, loading } = useSelector((state) => state.getClientPipingMultiFitup);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchData = () => {
    dispatch(getClientPipingMultiFitup({ page, limit, search: debouncedSearch }));
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, debouncedSearch, dispatch]);

  // Map rows depending on whether payload is nested (from the proxy backend aggregate method) or shallow
  const payloadData = reduxData?.data || {};
  const rows = Array.isArray(payloadData) ? payloadData : (payloadData?.data || []);
  const totalItems = payloadData?.pagination?.total || payloadData?.totalItems || reduxData?.totalItems || 0;

  const handleRefresh = () => {
    setSearch('');
    setPage(1);
    fetchData();
  };

    const downloadInspection = async (row) => {
      try {
        const toastId = toast.loading('Downloading...');
        const response = await axios.post(
          `${V_URL}/party/download-piping-fitup-client`,
          {
            test_inspect_no: row.test_inspect_no,
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
        link.download = `FitUp_${row.test_inspect_no || 'Report'}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('Downloaded successfully', { id: toastId });
      } catch (err) {
        console.error(err);
        toast.error('Failed to download PDF');
      }
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
              <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
              <li className="breadcrumb-item active">Fit-Up Acceptance</li>
            </ul>
          </div>

          <div className="card card-table show-entire">
            <div className="card-body">
              {/* Top Controls */}
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Fit-Up Acceptance</h3>
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

              {/* Table */}
              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Report No</th>
                      <th>Drawing No.</th>
                      <th>Spool No.</th>
                      <th>Date</th>
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
                      const uniqueDrawingNos = [
                          ...new Set(r?.items?.map(e => e?.drawing_id?.drawing_no).filter(Boolean))
                      ];
                      const uniqueSpoolNos = [
                          ...new Set(r?.items?.map(e => e?.joint_wise_data?.[0]?.spool_info?.spool_no || e?.joint_wise_data?.[0]?.spool_no_id?.spool_no).filter(Boolean))
                      ];
                      
                      return (
                      <tr key={r._id}>
                        <td>{(page - 1) * limit + i + 1}</td>
                        <td>{r.report_no_two}</td>
                        <td>{uniqueDrawingNos.join(', ')}</td>
                        <td>{uniqueSpoolNos.join(', ')}</td>
                        <td>{moment(r.createdAt).format('YYYY-MM-DD HH:mm')}</td>

                        <td>
                          {['REVIEWED', 'WITNESSED', 'RANDOM WITNESSED'].includes(r.status_type) ? (
                            <span className="custom-badge status-green">{r.status_type}</span>
                          ) : (
                            <span className="custom-badge status-orange">{r.status_text || 'Pending'}</span>
                          )}
                        </td>

                        <td className="text-end">
                          <div className="dropdown dropdown-action">
                            <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                              <i className="fa fa-ellipsis-v"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() =>
                                  navigate('/party/piping-store/view-quality-clearance-fitup', { state: r })
                                }
                              >
                                          <i className="fa-solid fa-eye m-r-5"></i>
                                View
                              </button>
                              <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => downloadInspection(r)}
                              >
                                          <i className="fa-solid fa-download m-r-5"></i>

                                Download
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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

export default QFitUpList;
