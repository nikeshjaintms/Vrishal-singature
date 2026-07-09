import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';

import Loader from '../../Users/Include/Loader';
import { Pagination } from '../../Users/Table';
import DropDown from '../../../Components/DropDown';
import { V_URL } from '../../../BaseUrl';

import { getAllMaterialMto } from '../../../Store/PoTeam/MaterialMTO/MaterialMto';
// 
// Debounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const ProcurementRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.materialMto.list);
  const loading = useSelector((state) => state.materialMto.loading);

  // ---------------- Fetch MTOs ----------------
  const fetchMtos = () => {
    dispatch(getAllMaterialMto({
      search: debouncedSearch,
      page: currentPage,
      limit,
    }));
  };

  useEffect(() => {
    fetchMtos();
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    if (entity) setTotalItems(entity.total || 0);
  }, [entity]);

  // ---------------- Delete ----------------
  const handleDelete = (id, poNumber) => {
    Swal.fire({
      title: `Delete PO ${poNumber}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("PAY_USER_TOKEN");
          const response = await axios.delete(`${V_URL}/user/material/delete-material-mto`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { id },
          });

          if (response.data.success) {
            toast.success(response.data.message);
            fetchMtos();
          } else {
            toast.error(response.data.message);
          }
        } catch {
          toast.error("Something went wrong");
        }
      }
    });
  };

  // ---------------- Refresh ----------------
  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    setLimit(10);
    fetchMtos();
  };
const handleDownloadPDF = async (id) => {
  try {
    const token = localStorage.getItem("PAY_USER_TOKEN");
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('mto_id', id);
    const response = await axios.post(
      `${V_URL}/user/material/download-mto-pdf`,
      bodyFormData,
      { headers: { Authorization: `Bearer ${token}` } }
      
    );

    if (response.data.success) {
      const pdfUrl = response.data.data.file;
      // Open PDF in a new tab
      window.open(pdfUrl, "_blank");
    } else {
      toast.error(response.data.message || "Failed to download PDF");
    }
  } catch (err) {
    toast.error("Something went wrong while downloading PDF");
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
                    <Link to="user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Procurement Request List</li>
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
                            <h3>Procurement Request List</h3>
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
                                  <a className="btn">
                                    <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                  </a>
                                </form>
                              </div>

                              {/* Add / Refresh buttons */}
                              <div className="add-group">
                                <Link to="/piping/user/manage-procurement-request" className="btn btn-primary add-pluss ms-2" title="Add">
                                  <img src="/assets/img/icons/plus.svg" alt="plus-icon" />
                                </Link>
                                <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown for limit */}
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
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
                            <th>Item </th>
                            <th>Item Description</th>
                            <th>Size</th>
                            <th>Thickness</th>
                            <th>Material Grade</th>
                            <th>UOM</th>
                            <th>PR Qty</th>
                            <th>Item length to be specified by Supplier</th>
                            {/* <th>Rates (INR / UNIT)</th>
                            <th>Amount (INR)</th> */}
                            <th>Delivery Days</th>
                            {/* <th>Offer Length</th>
                            <th>Offer Make/Manufacturer</th> */}
                            <th>Remarks</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity?.data?.length === 0 ? (
                            <tr>
                              <td colSpan="999"><div className="no-table-data">No Data Found!</div></td>
                            </tr>
                          ) : (
                            entity?.data?.map((row, i) => (
                              <tr key={row._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>                               
                                <td>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                                <td>{row.items && row.items.length > 0
                                    ? row.items.map((item) => item.item.name).join(", ")
                                    : "-"}</td>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                                      <i className="fa fa-ellipsis-v"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button className="dropdown-item" onClick={() => navigate(`/material-po/material-mto/mto-view`, { state: row })}>
                                        <i className="fa-solid fa-eye m-r-5"></i> View
                                      </button>

                                      <button className="dropdown-item" onClick={() => handleDownloadPDF(row._id)}>
                                        <i className="fa fa-file-pdf m-r-5"></i> Download MTO
                                      </button>
                                      {/* Edit */}
                                      <button
                                        className="dropdown-item"
                                        onClick={() => navigate("/material-po/manage-mto", { state: row })}
                                      >
                                        <i className="fa-solid fa-pen m-r-5"></i> Edit
                                      </button>
                                      <button className="dropdown-item" onClick={() => handleDelete(row._id, row.poNumber)}>
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
                          <Pagination
                            total={totalItems}
                            itemsPerPage={limit}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
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
  );
};

export default ProcurementRequest;
