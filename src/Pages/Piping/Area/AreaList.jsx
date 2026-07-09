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
import AreaModal from "./AreaModal";
import { getAreasAction } from '../../../Store/Piping/Area/AreaSlicePiping';
 
// Optional: debounce function to avoid rapid API calls while typing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const AreaList = () => {
  const dispatch = useDispatch();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [showModal, setShowModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.getAreas.data);
  const loading = useSelector((state) => state.getAreas.loading);

  // Debounce search to avoid calling API on every key press
  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Fetch areas from backend ----------------
  const fetchAreas = () => {
    const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(getAreasAction({
      project: projectId,
      search: debouncedSearch, // use debounced search
      page: currentPage,
      limit
    }));
  };

  // Fetch areas when page, limit, or search changes
  useEffect(() => {
    fetchAreas();
  }, [currentPage, limit, debouncedSearch]);

  // Update total items when entity changes
  useEffect(() => {
    if (entity) setTotalItems(entity.total || 0);
  }, [entity]);

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
          const response = await axios.delete(`${V_URL}/user/area-unit/delete-area-unit-piping`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { id },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            fetchAreas(); // refresh list
          } else {
            toast.error(response.data.message);
          }
        } catch {
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

      const payload = new URLSearchParams();
      if (areaData._id) payload.append("id", areaData._id); // edit mode
      payload.append("project", projectId);
      payload.append("area", areaData.name);
      payload.append("status", areaData.status);

      const response = await axios.post(`${V_URL}/user/area-unit/manage-area-unit-piping`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        setSelectedArea(null);
        fetchAreas(); // refresh list after save
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
                  <li className="breadcrumb-item active">Area List</li>
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
                            <h3>Area List</h3>
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
                            <th>Area</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity?.areas?.length === 0 ? (
                            <tr><td colSpan="999"><div className="no-table-data">No Data Found!</div></td></tr>
                          ) : (
                            entity.areas.map((elem, i) => (
                              <tr key={elem._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{elem.area}</td>
                                <td className='status-badge'>
                                  {elem.status === 1 ? <span className="custom-badge status-green">Active</span> :
                                    <span className="custom-badge status-pink">Inactive</span>}
                                </td>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-v"></i></a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button className="dropdown-item" onClick={() => { setSelectedArea(elem); setShowModal(true); }}>
                                        <i className="fa-solid fa-pen-to-square m-r-5"></i> Edit
                                      </button>
                                      <button className="dropdown-item" onClick={() => handleDelete(elem._id, elem.area)}>
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
      <AreaModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedArea(null); }}
        handleSave={handleSave}
        editData={selectedArea}
      />
    </div>
  );
};

export default AreaList;
