import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import Swal from "sweetalert2";

import Loader from "../../../../Users/Include/Loader";
import { Pagination } from "../../../../Users/Table";
import DropDown from "../../../../../Components/DropDown";
import { V_URL } from "../../../../../BaseUrl";
import { getAllTermsPiping } from "../../../../../Store/PoTeam/TermsCondition/TermsConditionSlicePiping";
import PO_ROUTE_URLS from "../../../../../Routes/PoTeam/PoRoutes";

/* ---------------- Debounce Hook ---------------- */
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const PipingTandC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  /* ---------------- Local State ---------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search);

  /* ---------------- Redux State ---------------- */
  const entity = useSelector((state) => state.termsPiping?.list);
  const loading = useSelector((state) => state.termsPiping?.loading || false);
  console.log("entity", entity);
  const termsList = entity?.data || [];
  const totalItems = entity?.total || 0;

  /* ---------------- Fetch Terms ---------------- */
  const fetchTerms = () => {
    dispatch(
      getAllTermsPiping({
        project: localStorage.getItem("U_PROJECT_ID"),
        search: debouncedSearch,
        page: currentPage,
        limit,
      })
    );
  };

  useEffect(() => {
    fetchTerms();
  }, [currentPage, limit, debouncedSearch]);

  /* ---------------- Refresh ---------------- */
  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
    setLimit(10);
    fetchTerms();
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id, title) => {
    const confirm = await Swal.fire({
      title: `Delete "${title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("PAY_USER_TOKEN");
      const response = await axios.post(
        `${V_URL}/user/terms-condition/delete-terms-piping`,
        {id},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTerms();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">

        {/* Breadcrumb */}
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <i className="feather-chevron-right"></i>
                </li>
                <li className="breadcrumb-item active">
                  Terms & Conditions
                </li>
              </ul>
            </div>
          </div>
        </div>

          {loading ? <Loader /> : (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">

                    {/* Header */}
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Terms & Conditions</h3>
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
                                <Link to={PO_ROUTE_URLS.PIPING_MANAGE_TERMS_AND_CONDITIONS} className="btn btn-primary add-pluss ms-2">
                                  <img src="/assets/img/icons/plus.svg" alt="plus" />
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

                        <div className="pageDropDown col-auto text-end ms-auto">
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
                            <th>Description</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {termsList.length === 0 ? (
                            <tr>
                              <td colSpan="999">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          ) : (
                            termsList.map((term, i) => (
                              <tr key={term._id}>
                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                <td>{term.description}</td>
                                <td>
                                  {term.status ? (
                                    <span className="badge bg-success">Active</span>
                                  ) : (
                                    <span className="badge bg-danger">Inactive</span>
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
                                      <button className="dropdown-item" onClick={() => navigate(PO_ROUTE_URLS.PIPING_MANAGE_TERMS_AND_CONDITIONS, { state: term })}>
                                        <i className="fa-solid fa-pen m-r-5"></i> Edit
                                      </button>
                                      <button
                                        className="dropdown-item"
                                        onClick={() =>
                                          handleDelete(term._id,(currentPage - 1) * limit + i + 1)
                                        }
                                      >
                                        <i className="fa fa-trash m-r-5"></i>
                                        Delete
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

                    {/* Pagination */}
                    <div className="row align-center mt-3 mb-2">
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_info">
                          Showing {Math.min(limit, totalItems)} from {totalItems} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
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
          )}

        </div>
      </div>
  );
};

export default PipingTandC;
