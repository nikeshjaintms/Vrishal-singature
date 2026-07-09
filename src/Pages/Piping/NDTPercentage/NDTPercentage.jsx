import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Loader from '../Include/Loader';
import { Pagination } from '../Table';
import DropDown from '../../../Components/DropDown';
import { V_URL } from '../../../BaseUrl';
import DownloadFormat from '../../../Components/DownloadFormat/DownloadFormat';
// import AreaModal from "./NDTPercentageModel";
import NDTPercentageModel from './NDTPercentageModel';
import { getNDTPercentage } from '../../../Store/Piping/NDTPercentage/NDTPercentage';
import { getUserPipingClassMaster } from "../../../Store/Piping/PipingClass/PipingClassMaster"

// Optional: debounce function to avoid rapid API calls while typing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const NDTPercentage = () => {
  const dispatch = useDispatch();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.getNDTPercentage.user?.data?.data || []);
  const loading = useSelector((state) => state.getNDTPercentage.loading);
  const pagination = useSelector((state) => state.getNDTPercentage.user?.data?.pagination || null);

  const PipingClass = useSelector((state) => state?.getUserPipingClassMaster?.user?.data);

  useEffect(() => {
    dispatch(getUserPipingClassMaster({ status: 1 }));
  }, [dispatch]);

  // Debounce search to avoid calling API on every key press
  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Fetch areas from backend ----------------
  const NDTPercent = () => {
    const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(getNDTPercentage({
      project: projectId,
      search: debouncedSearch, // use debounced search
      page: currentPage,
      limit
    }));
  };

  // Fetch areas when page, limit, or search changes
  useEffect(() => {
    NDTPercent();
  }, [currentPage, limit, debouncedSearch]);

  // Update total items when entity changes
  useEffect(() => {
    if (pagination) setTotalItems(pagination.totalRecords || 0);
  }, [pagination]);

  // ---------------- Delete area ----------------
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
          const token = localStorage.getItem("PAY_USER_TOKEN");
          const response = await axios.post(`${V_URL}/user/piping/delete-ndt-percentage`, { id }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            NDTPercent(); // refresh list
          } else {
            toast.error(response.data.message);
          }
        } catch (err) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  // ---------------- Refresh table ----------------
  const handleRefresh = () => {
    setSearch(""); // clear search
    setCurrentPage(1); // reset to first page
  };

  // ---------------- Add / Edit area ----------------
  const handleSave = async (areaData) => {
    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const projectId = localStorage.getItem("U_PROJECT_ID");

      const payload = {
        id: areaData._id || undefined,
        project: projectId,
        piping_class: areaData.piping_class,
        rt_percentage: areaData.rt_percentage,
        lpt_percentage: areaData.lpt_percentage,
        mpt_percentage: areaData.mpt_percentage,
        status: areaData.status
      };

      const response = await axios.post(`${V_URL}/user/piping/manage-ndt-percentage`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        setSelectedArea(null);
        NDTPercent(); // refresh list after save
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/project-store/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">NDT Percentage Master</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loader */}
          {loading ? <Loader /> : (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">

                    {/* Header with search, add, refresh */}
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>NDT Percentage Master</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                  />
                                  <a className="btn"><img src="/assets/img/icons/search-normal.svg" alt="search" /></a>
                                </form>
                              </div>

                              {/* Add / Refresh buttons */}
                              <div className="add-group">
                                <button className="btn btn-primary add-pluss ms-2" onClick={() => { setSelectedArea(null); setShowModal(true); }}>
                                  <img src="/assets/img/icons/plus.svg" alt="plus" />
                                </button>
                                <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Download / Limit Dropdown */}
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          {/* <div className="add-group" style={{ marginRight: "10px" }}>
                            <DownloadFormat url={`${V_URL}/user/download-areas`} fileName="Areas" />
                          </div> */}
                          <DropDown limit={limit} onLimitChange={setLimit} />
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Class</th>
                            <th>RT %</th>
                            <th>LPT %</th>
                            <th>MPT %</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity?.length === 0 ? (
                            <tr><td colSpan="999"><div className="no-table-data">No Data Found!</div></td></tr>
                          ) : (
                            entity?.map((elem, i) => (
                              <tr key={elem._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem.piping_class?.PipingClass}</td>
                                <td>{elem.rt_percentage} %</td>
                                <td>{elem.lpt_percentage} %</td>
                                <td>{elem.mpt_percentage} %</td>
                                <td className='status-badge'>
                                  {elem.status === true || elem.status === "true" ? <span className="custom-badge status-green">Active</span> :
                                    <span className="custom-badge status-pink">Inactive</span>}
                                </td>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-v"></i></a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button className="dropdown-item" onClick={() => { setSelectedArea(elem); setShowModal(true); }}>
                                        <i className="fa-solid fa-pen-to-square m-r-5"></i> Edit
                                      </button>
                                      <button className="dropdown-item" onClick={() => handleDelete(elem._id, elem.piping_class?.PipingClass)}>
                                        <i className="fa fa-trash-alt m-r-5"></i> Delete
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

                    {/* Pagination Info */}
                    <div className="row align-center mt-3 mb-2">
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_info">
                          Showing {Math.min(limit, totalItems)} from {totalItems} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_paginate paging_simple_numbers">
                          <Pagination total={totalItems} itemsPerPage={limit} currentPage={currentPage} onPageChange={setCurrentPage} />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Area Modal */}
      <NDTPercentageModel
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedArea(null); }}
        handleSave={handleSave}
        editData={selectedArea}
        PipingClass={PipingClass}
      />
    </div>
  );
};

export default NDTPercentage;
