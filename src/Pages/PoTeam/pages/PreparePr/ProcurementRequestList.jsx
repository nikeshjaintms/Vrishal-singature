import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../../Users/Include/Loader';
import { Pagination } from '../../../Users/Table';
import DropDown from '../../../../Components/DropDown';
import { CENTRAL_PLAN, V_URL } from '../../../../BaseUrl';
import { getAllProcurementRequests } from '../../../../Store/PoTeam/ProcurementRequest/ProcurementRequest';
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

const ProcurementRequestList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedPRs, setSelectedPRs] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.getProcurementRequest?.list);
  const loading = useSelector((state) => state.getProcurementRequest?.loading || false);

  // ---------------- Fetch PRs ----------------
  const fetchPRs = () => {
    dispatch(getAllProcurementRequests({
      search: debouncedSearch,
      page: currentPage,
      limit,
    }));
  };

  useEffect(() => {
    fetchPRs();
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    if (entity) setTotalItems(entity.total || 0);
  }, [entity]);

  // ---------------- Refresh ----------------
  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    setLimit(10);
    setSelectedPRs([]);
    fetchPRs();
  };

  // ---------------- Handle Single Send ----------------
  const handleSendToGr = async (id, prNo) => {
    const confirm = await Swal.fire({
      title: `Send PR ${prNo} to Inquiry?`,
      text: "Are you sure you want to send this procurement request for inquiry?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.post(
        `${V_URL}/user/pr/send-inquiry`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPRs();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // ---------------- Handle Multi Send ----------------
  const handleSendMultipleToInquiry = async () => {
    if (selectedPRs.length === 0) {
      return toast.error("Please select at least one PR to send");
    }

    const confirm = await Swal.fire({
      title: `Send ${selectedPRs.length} PR(s) to Inquiry?`,
      text: "Are you sure you want to send selected procurement requests for inquiry?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.post(
        `${V_URL}/user/pr/send-multiple-inquiry`,
        { ids: selectedPRs },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedPRs([]);
        fetchPRs();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while sending multiple PRs");
    }
  };

  // ---------------- Handle Checkbox Selection ----------------
  const toggleSelectPR = (id) => {
    setSelectedPRs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = entity?.data
        ?.filter((row) => !row.sendInquiry) // only selectable if not already sent
        .map((row) => row._id);
      setSelectedPRs(allIds || []);
    } else {
      setSelectedPRs([]);
    }
  };

  // ---------------- Handle Delete ----------------
  const handleDeletePR = async (id, prNo) => {
    const confirm = await Swal.fire({
      title: `Delete PR ${prNo}?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.delete(`${V_URL}/user/pr/delete-procurement-request`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchPRs();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // ---------------- Handle PDF Download ----------------
  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.post(
        `${V_URL}/user/pr/download-pr-pdf`,
        { pr_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        window.open(response.data.data.file, "_blank");
      } else {
        toast.error(response.data.message || "Failed to download PDF");
      }
    } catch {
      toast.error("Something went wrong while downloading PDF");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">

          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Procurement Requests</li>
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
                            <h3>Procurement Requests</h3>
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
                              <div className="add-group">
                              {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                                <Link to="/material-po/manage-pr" className="btn btn-primary add-pluss ms-2">
                                  <img src="/assets/img/icons/plus.svg" alt="plus" />
                                </Link>
                              )}
                                <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                                {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && selectedPRs.length > 0 && (
                                  <button className="btn btn-success ms-2" onClick={handleSendMultipleToInquiry}>
                                    <SendHorizontal className="me-1" /> Send Selected ({selectedPRs.length})
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown limit={limit} onLimitChange={setLimit} />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') &&(
                            <th><input type="checkbox" onChange={handleSelectAll} /></th>
                            )}
                            <th>Sr.</th>
                            <th>PR Number</th>
                            <th>Date</th>
                            <th>Total Qty</th>
                            <th>Items</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity?.data?.length === 0 ? (
                            <tr><td colSpan="999"><div className="no-table-data">No Data Found!</div></td></tr>
                          ) : (
                            entity?.data?.map((row, i) => (
                              <tr key={row._id}>
                                {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                                <td>
                                  {!row.sendInquiry && (
                                    <input
                                      type="checkbox"
                                      checked={selectedPRs.includes(row._id)}
                                      onChange={() => toggleSelectPR(row._id)}
                                      disabled={row.sendInquiry === true}
                                    />
                                  )}
                                </td>
                                )}
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{row.prNo}</td>
                                <td>{row.date ? new Date(row.date).toLocaleDateString() : '-'}</td>
                                <td>{row.totalQty}</td>
                                <td>{row.items?.length ? row.items.map((it) => it.item.name).join(", ") : "-"}</td>
                                <td>
                                  {row.sendInquiry === true ? "Sended to Inquiry" : "Ready to Sendend"}
                                </td>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                                      <i className="fa fa-ellipsis-v"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button className="dropdown-item" onClick={() => navigate("/material-po/pr-view", { state: row })}>
                                        <i className="fa-solid fa-eye m-r-5"></i> View
                                      </button>
                                      {row.sendInquiry === false && 
                                     (<>
                                     {CENTRAL_PLAN === localStorage.getItem('PO_ROLE') && (
                                       <button className="dropdown-item" onClick={() => navigate("/material-po/manage-pr", { state: row })}>
                                        <i className="fa-solid fa-pen m-r-5"></i> Edit
                                      </button>
                                      )}
                                      {/* <button className="dropdown-item" onClick={() => handleDeletePR(row._id, row.prNo)}>
                                        <i className="fa fa-trash m-r-5"></i> Delete
                                      </button> */}
                                      </>
                                      )
                                      }
                                      <button className="dropdown-item" onClick={() => handleDownloadPDF(row._id)}>
                                        <i className="fa fa-file-pdf m-r-5"></i> Download PR
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

export default ProcurementRequestList;
