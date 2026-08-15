import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import DropDown from '../../../Components/DropDown';
import Swal from 'sweetalert2';
import { Pagination, Search } from '../Table';
import { V_URL } from '../../../BaseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { getClientPipingFimPackingList } from '../../../Store/Client/Piping/FIM/getClientPipingFimPackingList';

const FimPackingList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.getClientPipingFimPackingList);
  
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(getClientPipingFimPackingList({ page: currentPage, limit, search: debouncedSearch }));
  }, [currentPage, limit, debouncedSearch, dispatch]); 

  const commentsData = useMemo(() => {
    const list = data?.data?.data || [];
    return list.filter((e) => !e.deleted);
  }, [data]);

  const totalItems = useMemo(() => {
    return data?.data?.pagination?.totalItems || data?.data?.totalItems || commentsData.length;
  }, [data, commentsData]);

  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  const handleDownloadPdf = async (elem) => {
  try {
    const res = await axios.post(
      `${V_URL}/party/download-fim-imir-piping-client`,
      { fim_id: elem._id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      toast.success("PDF generated!");
      window.open(res.data.data.file, "_blank"); // open PDF
    } else {
      toast.error("Failed to generate PDF");
    }
  } catch (err) {
    console.log(err);
    toast.error("Error generating PDF");
  }
};

  const handleDownloadIMIRPdf = async (elem) => {
    try {
      const res = await axios.post(
        `${V_URL}/party/download-fim-imir-piping-client`,
        { fim_id: elem._id },
        {
          responseType: 'blob',
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("PDF generated!");
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank"); // open PDF
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error generating PDF");
    }
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
                    <Link to="/party/piping-store/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/party/piping-store/fim-packing-list">FIM Packing List</Link>
                  </li>
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
                            <h3>FIM Packing Lists</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
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
                                  title="Refresh"
                                >
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>


                        <div className="pageDropDown col-auto text-end ms-auto download-grp">
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
                            <th>Packing No</th>
                            <th>Supplier</th>
                            <th>Vehicle</th>
                            <th>Receiving Date</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) => (
                            <tr key={i}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem.package_list_no}</td>
                              <td>{elem.supplier}</td>
                              <td>{elem.vehicle_number}</td>
                              <td>{moment(elem.receiving_date).format('YYYY-MM-DD')}</td>
                              <td>
                               {elem.client_status === 1 ? (
                                <span className="badge bg-success-light">{elem.status_type?.toUpperCase()}</span>
                               ) : (
                                <span className="badge bg-warning-light">Pending</span>
                               )}
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
                                      onClick={() => navigate('/party/piping-store/fim-packing-details', { state: elem })}
                                    >
                                      <i className="fa-solid fa-eye m-r-5"></i>
                                      View
                                    </button>
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => handleDownloadIMIRPdf(elem)}
                                    >
                                      <i className="fa-solid fa-file-pdf m-r-5"></i> Download IMIR PDF
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {commentsData?.length === 0 && (
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
                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                            <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                            <div className="dataTables_paginate paging_simple_numbers"
                                id="DataTables_Table_0_paginate">
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

export default FimPackingList;
