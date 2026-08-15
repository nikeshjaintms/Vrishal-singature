import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import Loader from '../../Include/Loader';
import { Pagination } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getClientMaterialReceiving } from '../../../../Store/Client/Structural/MaterialReceiving/getClientMaterialReceiving';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;

}

const VerifyRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.getClientMaterialReceiving);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(getClientMaterialReceiving({ page: currentPage, limit, search: debouncedSearch }));
  }, [currentPage, limit, debouncedSearch, dispatch]);

  const entity = useMemo(() => data?.data?.data || [], [data]);
  const totalItems = useMemo(() => data?.data?.totalItems || 0, [data]);

  const commentsData = useMemo(() => {
    let computed = [...entity];
    if (status) {
      computed = computed.filter((req) => parseInt(req.status) === parseInt(status));
    }
    return computed;
  }, [entity, status]);

  const handleDownloadIns = async (elem) => {
    try {
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('requestId', elem?.requestId?._id);
      bodyFormData.append('imir_no', elem?.imir_no);
      bodyFormData.append('print_date', true);

      const response = await axios.post(`${V_URL}/party/get-material-inspection-item`,
        bodyFormData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Material_Inspection_${elem?.imir_no}.pdf`
      );

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    setStatus('');
    setCurrentPage(1);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
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
                    <Link to="/party/project-store/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Material Receiving</li>
                </ul>
              </div>
            </div>
          </div>

          {!loading ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Material Receiving</h3>
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
                                      setCurrentPage(1);
                                    }}
                                  />
                                  <a className="btn">
                                    <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                <button type="button" onClick={handleRefresh} className="btn btn-primary doctor-refresh ms-2">
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
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Off. No.</th>
                            <th>Off. By</th>
                            <th>Off. Date</th>
                            <th>IMIR No.</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData.map((elem, i) => (
                            <tr key={elem?._id}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.offer_no}</td>
                              <td>{elem?.offeredBy?.user_name}</td>
                              <td>{moment(elem?.received_date).format('YYYY-MM-DD')}</td>
                              <td>{elem?.imir_no || '-'}</td>
                              <td>
                                <span
                                  className={`custom-badge ${elem.client_status === 0
                                    ? 'status-orange'
                                    : elem.client_status === 1
                                      ? 'status-green'
                                      : ''
                                    }`}
                                >
                                  {elem.client_status === 0
                                    ? 'Pending'
                                    : elem.client_status === 1
                                      ? elem.status_type
                                      : ''}
                                </span>
                              </td>

                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button type="button" className="dropdown-item" onClick={() => handleDownloadIns(elem)}>
                                      <i className="fa-solid fa-download m-r-5"></i> Download Inspection
                                    </button>
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() =>
                                        navigate('/party/project-store/manage-verify-request', {
                                          state: {
                                            requestId: elem?.requestId?._id,
                                            imir_no: elem?.imir_no,
                                            elem
                                          },
                                        })
                                      }
                                    >
                                      <i className="fa-solid fa-file-pdf m-r-5"></i> View PDF
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {commentsData.length === 0 && (
                            <tr>
                              <td colSpan="999">
                                <div className="no-table-data">No Data Found!</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>


                    <div className="row align-center mt-3 mb-2">
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_info" role="status">
                          Showing {commentsData.length} of {totalItems} total records
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                        <Pagination
                          total={totalItems}
                          itemsPerPage={limit}
                          currentPage={currentPage}
                          onPageChange={(page) => {
                            setCurrentPage(page);
                          }}
                        />
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

export default VerifyRequest;

