import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loader from '../../../../Users/Include/Loader';
import { Pagination } from '../../../../Users/Table';
import DropDown from '../../../../../Components/DropDown';
import { Procurement, V_URL } from '../../../../../BaseUrl';
import { SendHorizontal } from 'lucide-react';
import { getAllInquiriesPiping } from '../../../../../Store/PoTeam/piping/Inquiry/Inquiry';
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

const PipingInquiryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedInquiries, setSelectedInquiries] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  // ---------------- Redux selectors ----------------
  const entity = useSelector((state) => state.getInquiry?.list);
  const loading = useSelector((state) => state.getInquiry?.loading || false);

  // ---------------- Fetch Inquiries ----------------
  const fetchInquiries = () => {
    dispatch(getAllInquiriesPiping({
      search: debouncedSearch,
      project: localStorage.getItem('U_PROJECT_ID'),
      page: currentPage,
      limit,
    }));
  };

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    if (entity) setTotalItems(entity.total || 0);
  }, [entity]);

  // ---------------- Refresh ----------------
  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    setLimit(10);
    setSelectedInquiries([]);
    fetchInquiries();
  };

  // ---------------- Handle Delete ----------------
  const handleDeleteInquiry = async (id, inquiryNo) => {
    const confirm = await Swal.fire({
      title: `Delete Inquiry ${inquiryNo}?`,
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
      const response = await axios.delete(`${V_URL}/user/inquiry/delete-inquiry-piping`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchInquiries();
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
        `${V_URL}/user/inquiry/download-inquiry-pdf-piping`,
        { id },
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
  const handleDownloadExcel = async (id) => {
    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const project_id = localStorage.getItem("U_PROJECT_ID");

      const response = await axios.post(
        `${V_URL}/user/inquiry/download-inquiry-excel-piping`,
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
      let fileName = `INQUIRY_${timestamp}.xlsx`;

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

  // ---------------- Handle Checkbox Selection ----------------
  const toggleSelectInquiry = (id) => {
    setSelectedInquiries((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Only select inquiries that can be selected (sendPO === false)
      const selectableIds = entity?.data
        ?.filter((row) => row.sendPO === false)
        ?.map((row) => row._id) || [];
      setSelectedInquiries(selectableIds);
    } else {
      setSelectedInquiries([]);
    }
  };

  // ---------------- UI ----------------
  // ---------------- Handle Send Selected Inquiries ----------------
  const handleSendSelected = async () => {
    if (selectedInquiries.length === 0) return;

    const confirm = await Swal.fire({
      title: `Send ${selectedInquiries.length} Inquiry(ies)?`,
      text: "This will mark them as sent.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Send",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.post(
        `${V_URL}/user/inquiry/send-multiple-inquiry-piping`,
        { ids: selectedInquiries },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedInquiries([]); // clear selection
        fetchInquiries(); // refresh list
      } else {
        toast.error(response.data.message || "Failed to send inquiries");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
                <li className="breadcrumb-item active">Inquiries</li>
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
                          <h3>Inquiries</h3>
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
                                <Link to={PO_ROUTE_URLS.PIPING_MANAGE_INQUIRY} className="btn btn-primary add-pluss ms-2">
                                  <img src="/assets/img/icons/plus.svg" alt="plus" />
                                </Link>
                              )}
                              <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                              </button>
                              {localStorage.getItem('PO_ROLE') === Procurement && selectedInquiries.length > 0 && (
                                <button className="btn btn-success ms-2" onClick={handleSendSelected}>
                                  <SendHorizontal className="me-1" /> Selected ({selectedInquiries.length})
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
                          {localStorage.getItem('PO_ROLE') === Procurement && (
                            <th>
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  entity?.data?.length > 0 &&
                                  entity.data.filter(row => row.sendPO === false).length > 0 &&
                                  selectedInquiries.length === entity.data.filter(row => row.sendPO === false).length
                                }
                              />
                            </th>
                          )}
                          <th>Sr.</th>
                          <th>Inquiry Number</th>
                          <th>Date</th>
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
                                  {row.sendPO === false &&
                                    <input
                                      type="checkbox"
                                      checked={selectedInquiries.includes(row._id)}
                                      onChange={() => toggleSelectInquiry(row._id)}
                                    />
                                  }
                                </td>
                              )}
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{row.InquiryNo}</td>
                              <td>{row.InquiryDate ? new Date(row.InquiryDate).toLocaleDateString() : '-'}</td>
                              <td>{row.items?.length || 0}</td>
                              <td>
                                {row.sendPO === true ? (
                                  <span className="badge bg-success">Sended to PO</span>
                                ) : (
                                  <span className="badge bg-primary">Ready For Send</span>
                                )}
                              </td>
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button className="dropdown-item" onClick={() => navigate(PO_ROUTE_URLS.PIPING_VIEW_INQUIRY, { state: row })}>
                                      <i className="fa-solid fa-eye m-r-5"></i> View
                                    </button>
                                    {row.sendPO === false && (
                                      <>
                                        {localStorage.getItem('PO_ROLE') === Procurement && row.sendPO === false && (
                                          <button className="dropdown-item" onClick={() => navigate(PO_ROUTE_URLS.PIPING_MANAGE_INQUIRY, { state: row })}>
                                            <i className="fa-solid fa-pen m-r-5"></i> Edit
                                          </button>
                                        )}
                                        {/* <button className="dropdown-item" onClick={() => handleDeleteInquiry(row._id, row.InquiryNo)}>
                                        <i className="fa fa-trash m-r-5"></i> Delete
                                      </button> */}
                                      </>
                                    )}
                                    <button className="dropdown-item" onClick={() => handleDownloadPDF(row._id)}>
                                      <i className="fa fa-file-pdf m-r-5"></i> Download PDF
                                    </button>
                                    <button className="dropdown-item" onClick={() => handleDownloadExcel(row._id)}>
                                      <i className="fa fa-file-pdf m-r-5"></i> Download EXCEL
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
  );
};

export default PipingInquiryList;
