import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Include/Footer";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";

import Loader from "../../Users/Include/Loader";
import { Pagination } from "../../Users/Table";
import DropDown from "../../../Components/DropDown";
import { V_URL } from "../../../BaseUrl";

import { getAllMaterialMto } from "../../../Store/PoTeam/MaterialMTO/MaterialMto";
import { getPressureTestInspectionPiping } from "../../../Store/Piping/MultiPressureTestPiping/getPressureTestInspectionPiping";
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
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

const PressureTest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------------- States ----------------
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  // ---------------- Redux selectors ----------------
  const entity = useSelector(
    (state) => state.getPressureTestInspectionPiping.user.data,
  );
   const pagination = useSelector(
    (state) => state.getPressureTestInspectionPiping.user.pagination || [],
  );
  
  console.log("pagination",pagination);
  console.log("entity", entity);
  const loading = useSelector((state) => state.materialMto.loading);

  // ---------------- Fetch MTOs ----------------
  const fetchMtos = () => {
    dispatch(
      getPressureTestInspectionPiping({
        search: debouncedSearch,
        page: currentPage,
        limit,
        project_id: localStorage.getItem("U_PROJECT_ID"),
      }),
    );
  };

  useEffect(() => {
    fetchMtos();
  }, [currentPage, limit, debouncedSearch]);

  useEffect(() => {
    if (pagination) setTotalItems(pagination.totalRecords || 0);
  }, [pagination]);

  // ---------------- Delete ----------------
  const handleDelete = (id, poNumber) => {
    Swal.fire({
      title: `Delete PO ${poNumber}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("PAY_USER_TOKEN");
          const response = await axios.delete(
            `${V_URL}/user/material/delete-material-mto`,
            {
              headers: { Authorization: `Bearer ${token}` },
              data: { id },
            },
          );

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
    setSearch("");
    setCurrentPage(1);
    setLimit(10);
    fetchMtos();
  };
  const handleDownloadIns = (elem) => {
         const bodyFormData = new URLSearchParams();
         bodyFormData.append('report_no', elem.report_no)
         bodyFormData.append('print_date', true);
         PdfDownloadErp({ apiMethod: 'post', url: 'download-pressure-test-pdf-piping', body: bodyFormData });
     }
 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
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
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Pressure Test List</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loader */}
          {loading ? (
            <Loader />
          ) : (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    {/* Header with search, add, refresh */}
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Pressure Test List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
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
                                    <img
                                      src="/assets/img/icons/search-normal.svg"
                                      alt="search"
                                    />
                                  </a>
                                </form>
                              </div>

                              {/* Add / Refresh buttons */}
                              <div className="add-group">
                                <Link
                                  to="/piping/user/manage-pressure-test"
                                  className="btn btn-primary add-pluss ms-2"
                                  title="Add"
                                >
                                  <img
                                    src="/assets/img/icons/plus.svg"
                                    alt="plus-icon"
                                  />
                                </Link>
                                <button
                                  className="btn btn-primary doctor-refresh ms-2"
                                  onClick={handleRefresh}
                                >
                                  <img
                                    src="/assets/img/icons/re-fresh.svg"
                                    alt="refresh"
                                  />
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
                      <table className="table border-0 custom-table comman-table mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Report No.</th>
                            <th>Line No. / Drawing No. </th>
                            <th>Rev No.</th>
                            <th>Spool NO.</th>
                            <th>Piping Material Specification</th>
                            <th>Piping Class</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entity?.length === 0 ? (
                            <tr>
                              <td colSpan="7">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          ) : (
                            entity?.map((row, i) => (
                              <tr key={row._id || i}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{row?.report_no || '-'}</td>
                                {/* Line No / Drawing No */}
                                <td>{row?.items?.map((item) => item?.drawing?.drawing_no).join(", ")}</td>

                                {/* Rev No */}
                                <td>{row?.items?.map((item) => item?.drawing?.rev).join(", ")}</td>

                                {/* Spool No */}
                                <td>{row?.items?.map((item) => item?.spool?.spool_no).join(", ")}</td>
                                {/* Material Spec */}
                               
                                  <td>{row?.items?.map((item) => item?.material_specification).join(", ")}</td>
                               

                                {/* Piping Class */}
                               <td>{row?.items?.map((item) => item?.piping_class).join(", ")}</td>

                                {/* Action */}
                                    <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                      {row?.status === 1 ? (
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate(`/piping/user/view-pressure-test/${row._id}`)}>
                                                                                
                                                                                <i className="fa-solid fa-eye m-r-5"></i>
                                                                               View
                                                                            </button>
                                                                             ) : (
                                                                            <button type='button' className='dropdown-item'>Ins. Not Found</button>
                                                                        )}
                                                                        {row?.status === 1 ? (
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(row)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
                                                                        ) : (
                                                                            <button type='button' className='dropdown-item'>Ins. Not Found</button>
                                                                        )}
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
                          Showing {Math.min(limit, totalItems)} from{" "}
                          {totalItems} data
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

export default PressureTest;
