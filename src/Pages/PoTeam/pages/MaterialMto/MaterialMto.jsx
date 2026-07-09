import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';

import Loader from '../../../Users/Include/Loader';
import { Pagination } from '../../../Users/Table';
import DropDown from '../../../../Components/DropDown';
import { CENTRAL_PLAN, V_URL } from '../../../../BaseUrl';

import { getAllMaterialMto } from '../../../../Store/PoTeam/MaterialMTO/MaterialMto';
import { SendHorizontal } from 'lucide-react';

// Debounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const MaterialMto = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedMtos, setSelectedMtos] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.materialMto.list);
  const loading = useSelector((state) => state.materialMto.loading);

  // ---------------- Fetch MTOs ----------------
  const fetchMtos = () => {
    dispatch(getAllMaterialMto({
      search: debouncedSearch,
      page: currentPage,
      project: localStorage.getItem('U_PROJECT_ID'),
      limit,
    }));
  };

  useEffect(() => {
    fetchMtos();
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    if (entity) setTotalItems(entity.total || 0);
  }, [entity]);

  // ---------------- Checkbox handlers ----------------
  const handleCheckboxChange = (id) => {
    setSelectedMtos(prev =>
      prev.includes(id)
        ? prev.filter(mtoId => mtoId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMtos.length === entity?.data?.length) {
      setSelectedMtos([]);
    } else {
      setSelectedMtos(entity?.data?.map(row => row._id));
    }
  };

  const handleSendMultipleToPR = () => {
    if (selectedMtos.length === 0) {
      toast.error("Please select at least one MTO");
      return;
    }

    Swal.fire({
      title: `Send ${selectedMtos.length} MTO(s) for PR?`,
      text: "This will change their status from MTO to PR",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send them!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("PAY_USER_TOKEN");
          const response = await axios.post(
            `${V_URL}/user/material/send-multiple-to-pr`,
            { ids: selectedMtos, updatedBy: localStorage.getItem("PAY_USER_ID") },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success === true) {
            toast.success(response.data.message);
            setSelectedMtos([]);
            fetchMtos(); // refresh table
          } else {
            toast.error(response.data.message);
          }
        } catch (err) {
          console.error(err);
          if (err.response && err.response.data && err.response.data.message) {
              toast.error(err.response.data.message);
            } else if (err.message) {
              toast.error(err.message);
            } else {
              toast.error("Something went wrong while updating status");
            }
        }
      }
    });
  };

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
    setSelectedMtos([]);
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
        window.open(pdfUrl, "_blank");
      } else {
        toast.error(response.data.message || "Failed to download PDF");
      }
    } catch (err) {
      toast.error("Something went wrong while downloading PDF");
    }
  };

  const handleSendToPR = async (id, poNumber) => {
    Swal.fire({
      title: `Send this MTO: ${poNumber} for PR?`,
      text: "This will change status from MTO to PR",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("PAY_USER_TOKEN");
          const response = await axios.post(
            `${V_URL}/user/material/send-to-pr`,
            { id, updatedBy: localStorage.getItem("PAY_USER_ID") },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            fetchMtos(); // refresh table
          } else {
            toast.error(response.data.message);
          }
        } catch (err) {
          console.error(err);
          toast.error("Something went wrong while updating status");
        }
      }
    });
  };

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="material-po/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Material MTO List</li>
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
                            <h3>Material MTO List</h3>
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
                                {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                                <Link to="/material-po/manage-mto" className="btn btn-primary add-pluss ms-2">
                                  <img src="/assets/img/icons/plus.svg" alt="plus" />
                                </Link>
                                )}
                                <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                                {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && 
                                  selectedMtos.length > 0 && (
                                    <button className="btn btn-primary ms-2 " onClick={handleSendMultipleToPR}>
                                      Send Selected to PR
                                    </button>
                                  )
                                }

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
                            {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                            <th>
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedMtos.length === entity?.data?.length}
                              />
                            </th>
                              )}
                            <th>Sr.</th>
                            <th>PO Number</th>
                            <th>Area</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity?.data?.length === 0 ? (
                            <tr>
                              <td colSpan="999"><div className="no-table-data">No Data Found!</div></td>
                            </tr>
                          ) : (
                            entity?.data?.map((row, i) => {
                            const hasItems = Array.isArray(row.items) &&
                              row.items.some(
                                (it) => it?.item?.name && it.item.name.trim() !== ""
                              );
                              return(
                              <tr key={row._id}>
                            {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                                <td>
                                {hasItems && row.status === 0 && (
                                  <input
                                    type="checkbox"
                                    checked={selectedMtos.includes(row._id)}
                                    onChange={() => handleCheckboxChange(row._id)}
                                    disabled={row.status === 1 || row.status === 2 || row.status === 3}
                                  />
                                )}
                                </td>
                            )}
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{row.poNumber}</td>
                                <td>{row.areaBuilding.area}</td>
                                <td>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                                <td>{hasItems
                                  ? row.items.map((item) => item.item.name).join(", ")
                                  : "-"}</td>
                                <td>  {row.status === 0
                                    ? (hasItems ? "Ready to PR" : "Pending")
                                    : row.status === 1
                                    ? "Sended to PR"
                                    : "Rejected"}
                                </td>
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
                                      {row.status === 0 && (
                                      <>
                                      {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                                        <button
                                          className="dropdown-item"
                                          onClick={() => navigate("/material-po/manage-mto", { state: row })}
                                        >
                                          <i className="fa-solid fa-pen m-r-5"></i> Edit
                                        </button>
                                       )}
                                      {/* <button className="dropdown-item" onClick={() => handleDelete(row._id, row.poNumber)}>
                                        <i className="fa fa-trash-alt m-r-5"></i> Delete
                                      </button> */}
                                      </>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )})
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
      </div>
    </div>
  );
};

export default MaterialMto;
