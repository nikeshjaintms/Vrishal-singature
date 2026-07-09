import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../../../Users/Include/Loader';
import { Pagination } from '../../../../Users/Table';
import DropDown from '../../../../../Components/DropDown';
import { V_URL, Procurement } from '../../../../../BaseUrl';

// ⬇️ import your new thunk
import { getAllOrders } from '../../../../../Store/PoTeam/piping/Order/Order';
import PO_ROUTE_URLS from '../../../../../Routes/PoTeam/PoRoutes';

// Debounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const PipingOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState([]);  // For storing selected order IDs
  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.orderPlacement?.list);
  const loading = useSelector((state) => state.orderPlacement?.loading || false);

  // ---------------- Latest Revisions Map ----------------
  const latestRevisions = useMemo(() => {
    const maxRevMap = {};
    if (entity?.data) {
      entity.data.forEach(item => {
        const vendorId = item.vendor?._id || item.vendor || 'no-vendor';
        const key = `${item.po_no}_${vendorId}`;
        const revNo = item.rev_no || 0;
        if (maxRevMap[key] === undefined || revNo > maxRevMap[key]) {
          maxRevMap[key] = revNo;
        }
      });
    }
    return maxRevMap;
  }, [entity?.data]);

  // ---------------- Fetch Orders ----------------
  const fetchOrders = () => {
    dispatch(
      getAllOrders({
        search: debouncedSearch,
        project: localStorage.getItem('U_PROJECT_ID'),
        page: currentPage,
        limit,
      })
    );
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    if (entity) setTotalItems(entity.total || 0);
  }, [entity]);

  // ---------------- Refresh ----------------
  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    setLimit(10);
    fetchOrders();
  };

  // ---------------- Delete Order ----------------
  const handleDeleteOrder = async (id, poNo) => {
    const confirm = await Swal.fire({
      title: `Delete Order ${poNo}?`,
      text: "You cannot undo this action.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.delete(`${V_URL}/user/order/delete-order-piping`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // ---------------- Download PDF ----------------
  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const project_id = localStorage.getItem('U_PROJECT_ID');
      const response = await axios.post(
        `${V_URL}/user/order/download-order-piping-pdf`,
        { id, project_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        window.open(response.data.data.file, "_blank");
      } else {
        toast.error(response.data.message || "Failed to download PDF");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  const handleDownloadExcel = async (id) => {
    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const project_id = localStorage.getItem("U_PROJECT_ID");

      const response = await axios.post(
        `${V_URL}/user/order/download-order-piping-excel`,
        { id, project_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // 🔥 REQUIRED
        }
      );

      // 🔹 Create blob URL
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // 🔹 Extract filename from header
      const timestamp = new Date().getTime();
      let fileName = `Order_${timestamp}.xlsx`;
      
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.includes("filename=")) {
        fileName = disposition.split("filename=")[1].replace(/"/g, "");
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to download Excel");
    }
  };



  // ---------------- Select/Deselect Orders ----------------
  const handleSelectOrder = (id) => {
    setSelectedOrders(prev => {
      if (prev.includes(id)) {
        return prev.filter(orderId => orderId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // ---------------- Send Multiple Orders ----------------
const handleSendOrders = async () => {
  try {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order.");
      return;
    }

    // Show Sweet Alert confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to send selected orders to material?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Send",
      cancelButtonText: "Cancel",
    });

    // If user clicks cancel
    if (!result.isConfirmed) return;

    const firm_id = localStorage.getItem("PAY_USER_FIRM_ID");
    const year_id = localStorage.getItem("PAY_USER_YEAR_ID");
    const token = localStorage.getItem("PAY_USER_TOKEN");

    const response = await axios.post(
      `${V_URL}/user/order/send-to-material-piping`,
      { ids: selectedOrders, firm_id, year_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      Swal.fire("Success!", response.data.message, "success");
      fetchOrders();
      setSelectedOrders([]);
    } else {
      Swal.fire("Error!", response.data.message || "Failed to place orders", "error");
    }

  } catch (err) {
    Swal.fire("Error!", "Something went wrong!", "error");
  }
};

  return (
    <div className="page-wrapper">
      <div className="content">

          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Order Placement</li>
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
                            <h3>Order Placement</h3>
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
                                {localStorage.getItem('PO_ROLE') === Procurement && (
                                  <Link to={PO_ROUTE_URLS.PIPING_MANAGE_ORDER} className="btn btn-primary add-pluss ms-2">
                                  <img src="/assets/img/icons/plus.svg" alt="plus" />
                                </Link>
                                )}
                                <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                                {localStorage.getItem('PO_ROLE') === Procurement && 
                                selectedOrders.length > 0 &&(
                                <button className="btn btn-success ms-3" onClick={handleSendOrders}>
                                  Send Selected Orders
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

                    {/* ---------------- TABLE ---------------- */}
                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                                {localStorage.getItem('PO_ROLE') === Procurement && (
                            <th>
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const selectable = entity?.data?.filter(row => {
                                      const vendorId = row.vendor?._id || row.vendor || 'no-vendor';
                                      const key = `${row.po_no}_${vendorId}`;
                                      return (row.send_to_material !== true && row.send_to_material !== "true") &&
                                             (row.rev_no === latestRevisions[key]);
                                    }).map(row => row._id);
                                    setSelectedOrders(selectable || []);
                                  } else {
                                    setSelectedOrders([]);
                                  }
                                }}
                              />
                            </th>
                                )}
                            <th>Sr.</th>
                            <th>Order No</th>
                            <th>Vendor</th>
                            <th>Order Date</th>
                            <th>Rev No.</th>
                            <th>Total Items</th>
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
                                {localStorage.getItem('PO_ROLE') === Procurement && (
                                <td>
                                  {(() => {
                                    const vendorId = row.vendor?._id || row.vendor || 'no-vendor';
                                    const key = `${row.po_no}_${vendorId}`;
                                    return (
                                      row.send_to_material !== true &&
                                      row.send_to_material !== "true" &&
                                      row.rev_no === latestRevisions[key] && (
                                        <input
                                          type="checkbox"
                                          checked={selectedOrders.includes(row._id)}
                                          onChange={() => handleSelectOrder(row._id)}
                                        />
                                      )
                                    );
                                  })()}
                                </td>
                                )}
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{row.po_no}</td>
                                <td>{row.vendor_name || row.vendor.name || "-"}</td>
                                <td>{row.po_date ? new Date(row.po_date).toLocaleDateString() : '-'}</td>
                                <td>{row.rev_no}</td>
                                <td>{row.items?.length || 0}</td>
                                <td>
                                  {(() => {
                                    const vendorId = row.vendor?._id || row.vendor || 'no-vendor';
                                    const key = `${row.po_no}_${vendorId}`;
                                    return row.rev_no === latestRevisions[key] && (
                                      <>
                                        {row.send_to_material === "true" || row.send_to_material === true ? (
                                          <span className="badge bg-success">Completed</span>
                                        ) : (
                                          <span className="badge bg-warning">Pending</span>
                                        )}
                                      </>
                                    );
                                  })()}
                                </td>

                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                                      <i className="fa fa-ellipsis-v"></i>
                                    </a>

                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button className="dropdown-item" onClick={() => navigate(PO_ROUTE_URLS.PIPING_VIEW_ORDER, { state: row })}>
                                        <i className="fa-solid fa-eye m-r-5"></i> View
                                      </button>
                                     {localStorage.getItem('PO_ROLE') === "Procurement" &&
                                        // row.send_to_material !== true &&
                                        // row.send_to_material !== "true" && 
                                        (
                                          <button
                                            className="dropdown-item"
                                            onClick={() =>
                                              navigate(PO_ROUTE_URLS.PIPING_MANAGE_ORDER, { state: row })
                                            }
                                          >
                                            <i className="fa-solid fa-pen m-r-5"></i> Edit
                                          </button>
                                      )}

                                      {/* <button className="dropdown-item" onClick={() => handleDeleteOrder(row._id, row.po_no)}>
                                        <i className="fa fa-trash m-r-5"></i> Delete
                                      </button> */}

                                      <button className="dropdown-item" onClick={() => handleDownloadPDF(row._id)}>
                                        <i className="fa fa-file-pdf m-r-5"></i> Download PDF
                                      </button>
                                      <button className="dropdown-item" onClick={() => handleDownloadExcel(row._id)}>
                                        <i className="fa fa-file-pdf m-r-5"></i> Download Excel
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

                   

                    {/* ---------------- PAGINATION ---------------- */}
                
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
  );
};

export default PipingOrder;
