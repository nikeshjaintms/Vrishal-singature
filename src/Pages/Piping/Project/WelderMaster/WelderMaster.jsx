import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import Swal from 'sweetalert2';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import moment from 'moment';
import { WeldingAuth } from '../../../../Routes/Users/Auth/AuthGuard';
import { getUserWelderMasterPiping } from '../../../../Store/Piping/WelderMaster/WelderMaster';

const useDebounce = (value, delay = 2000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const WelderMaster = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 2000);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const { data = [], total = 0, loading, error } = useSelector(state => state.getUserWelderMasterPiping || {});

  const fetchWelderData = async () => {
    dispatch(getUserWelderMasterPiping({ page: currentPage, limit, search: debouncedSearch }));
  };

  useEffect(() => {
  console.log("Searching for:", debouncedSearch);
  fetchWelderData();
}, [currentPage, limit, debouncedSearch]);


  useEffect(() => {
    if (error) console.error("❌ Error fetching Welder:", error);
  }, [error]);

  const handleDelete = (id, title) => {
    Swal.fire({
      title: `Are you sure want to delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${V_URL}/user/delete-welder/${id}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
          });
          if (res.data.success) {
            toast.success(res.data.message);
            fetchWelderData(); // refresh table
          } else toast.error(res.data.message);
        } catch (err) {
          toast.error(err?.response?.data?.message || "Something went wrong");
        }
      }
    });
  }

  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
  }

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Qualified Welder List</li>
                </ul>
              </div>
            </div>
          </div>

          {loading ? <Loader /> : (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Qualified Welder List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }} />
                                  <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                    alt="search" /></a>
                                </form>
                              </div>
                              <div className="add-group">
                                <WeldingAuth>
                                  <Link to="/piping/user/manage-welder"
                                    className="btn btn-primary add-pluss ms-2"><img
                                      src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                </WeldingAuth>
                                <button type='button' onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"><img
                                    src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Welder Name</th>
                            <th>Welder No.</th>
                            <th>WPS No.</th>
                            <th>Minimum Thickness</th>
                            <th>Maximum Thickness</th>
                            <th>Welding Process</th>             
                            <th>Qualified Diameter Minimum</th>
                            <th>Qualified Diameter Maximum</th>
                            <th>Joint Type</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>PDF</th>
                            <WeldingAuth>
                              <th className="text-end">Action</th>
                            </WeldingAuth>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.length ? (
                            data.map((elem, i) => {
                              const isExpired = new Date(elem.due_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

                              return (
                                <tr key={elem?._id}>
                                  <td>{(currentPage - 1) * limit + i + 1}</td>
                                  <td>{elem?.name}</td>
                                  <td>{elem?.welderNo}</td>
                                  <td>{elem?.wpsNo?.wpsNo}</td>
                                  <td>{elem?.MinimumThickness}</td>
                                  <td>{elem?.MaximumThickness}</td>
                                  <td>{elem?.weldingProcess}</td>
                                  <td>{elem?.QualifiedDiametermin}</td>
                                  <td>{elem?.QualifiedDiametermax}</td>
                                  <td>{elem?.jointType?.map(j => j?.jointId?.name)?.join(', ')}</td>
                                  <td className='status-badge'>
                                    <span className={`custom-badge ${isExpired ? 'status-red' : 'status-green'}`}>
                                      {isExpired ? 'Inactive' : 'Active'}
                                    </span>
                                  </td>
                                  <td>{moment(elem?.due_date).format('YYYY-MM-DD')}</td>
                                  <td>
                                {elem?.pdf ? (
                                  <a href={elem?.pdf} target='_blank' rel="noreferrer">
                                    <img src='/assets/img/pdflogo.png' style={{ height: "30px" }} alt="pdf" />
                                  </a>
                                ) : '-'}
                              </td>
                                  <WeldingAuth>
                                    <td className="text-end">
                                      <div className="dropdown dropdown-action">
                                        <a
                                          href="#"
                                          className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="fa fa-ellipsis-v"></i>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                          <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => navigate('/piping/user/manage-welder', { state: elem })}
                                          >
                                            <i className="fa-solid fa-pen-to-square m-r-5"></i>
                                            Edit
                                          </button>
                                          <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => handleDelete(elem?._id, elem.welderNo)}
                                          >
                                            <i className="fa fa-trash-alt m-r-5"></i> Delete
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </WeldingAuth>
                                </tr>
                              );
                            })
                          ) : (
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
                        <div className="dataTables_info">
                          Showing {Math.min(limit, total)} from {total} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                        <div className="dataTables_paginate paging_simple_numbers">
                          <Pagination
                            total={total}
                            itemsPerPage={limit}
                            currentPage={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default WelderMaster;
