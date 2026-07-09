import React, { useEffect, useMemo, useState } from "react";
import Footer from "../Include/Footer";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDmrCategories, addDmrCategory } from "../../../Store/Erp/DmrCategories/DmrCategories";
import { Pagination, Search } from "../Table";
import DropDown from "../../../Components/DropDown";
import Loader from "../Include/Loader";
import AddModel from "./Comman-Components/AddModel";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";
import Swal from "sweetalert2";

const DMRCategories = () => {
  const dispatch = useDispatch();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(getDmrCategories());
  }, [dispatch]);

  const entity = useSelector((state) => state.dmr || {});
  const loading = useSelector((state) => state.dmr?.loading || false);
  console.log(entity, "Fetched Categories Entity");

  const commentsData = useMemo(() => {
    if (!entity?.categories) return [];

    let computedComments = [...entity.categories];

    // Optional: Sort by category name
    computedComments.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    // Filter by search input (category or project name)
    if (search) {
      computedComments = computedComments.filter((elem) => {
        const categoryName = elem.name?.toLowerCase() || "";
        const projectName = elem.project_id?.name?.toLowerCase() || "";
        return (
          categoryName.includes(search.toLowerCase()) ||
          projectName.includes(search.toLowerCase())
        );
      });
    }

    // Total count for pagination display
    setTotalItems(computedComments.length);

    // Paginate
    return computedComments.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, entity, search, limit]);

  const handleRefresh = () => {
    setSearch("");
    dispatch(getDmrCategories());
  };

  const handleAddCategory = (categoryData) => {
    const project = localStorage.getItem("U_PROJECT_ID");
    const myurl = `${V_URL}/user/dmr-categories/manage-dmr-category`;
    axios({
      method: "POST",
      url: myurl,
      data: { project: project, name: categoryData.name },
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded", 
        Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') 
      },
    }).then((response) => {
      if (response.data.success === true) {
        toast.success(response?.data?.message);
        dispatch(getDmrCategories());
        setShowAddModal(false);
        setEditMode(false);
        setSelectedCategory(null);
      } else {
        toast.error(response?.data?.message);
      }
    }).catch((error) => {
      toast.error("Something went wrong");
    });
  };

  const handleEditCategory = (categoryData) => {
    const project = localStorage.getItem("U_PROJECT_ID");
    const myurl = `${V_URL}/user/dmr-categories/manage-dmr-category`;
    axios({
      method: "POST",
      url: myurl,
      data: { 
        project: project, 
        name: categoryData.name,
        id: selectedCategory._id 
      },
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded", 
        Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') 
      },
    }).then((response) => {
      if (response.data.success === true) {
        toast.success(response?.data?.message);
        dispatch(getDmrCategories());
        setShowAddModal(false);
        setEditMode(false);
        setSelectedCategory(null);
      } else {
        toast.error(response?.data?.message);
      }
    }).catch((error) => {
      toast.error("Something went wrong");
    });
  };

  const handleDeleteCategory = (categoryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const project = localStorage.getItem("U_PROJECT_ID");
        const myurl = `${V_URL}/user/dmr-categories/delete-dmr-category`;
        axios({
          method: "DELETE",
          url: myurl,
          data: { 
            project: project, 
            id: categoryId 
          },
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded", 
            Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') 
          },
        }).then((response) => {
          if (response.data.success === true) {
            Swal.fire(
              'Deleted!',
              response?.data?.message || 'Category has been deleted.',
              'success'
            );
            dispatch(getDmrCategories());
          } else {
            Swal.fire(
              'Error!',
              response?.data?.message || 'Failed to delete category.',
              'error'
            );
          }
        }).catch((error) => {
          Swal.fire(
            'Error!',
            'Something went wrong while deleting the category.',
            'error'
          );
        });
      }
    });
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setEditMode(true);
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedCategory(null);
    setShowAddModal(true);
  };

  const columnHeaders = ["SR.", "CATEGORY","ACTION"];

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
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">DMR List</li>
                </ul>
              </div>
            </div>
          </div>

          {!loading ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>DMR Categories List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }}
                                  />
                                  {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                  <a className="btn">
                                    <img
                                      src="/assets/img/icons/search-normal.svg"
                                      alt="search"
                                    />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Refresh"
                                >
                                  <img
                                    src="/assets/img/icons/re-fresh.svg"
                                    alt="refresh"
                                  />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-primary add-pluss ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Add"
                                  onClick={openAddModal}
                                >
                                  <img
                                    src="/assets/img/icons/plus.svg"
                                    alt="plus"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown
                            limit={limit}
                            onLimitChange={(val) => setlimit(val)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table border-0 comman-table mb-0 dpr-table">
                        <thead>
                          <tr>
                            {columnHeaders.map((header, idx) => (
                              header === "ACTION" ? (
                                <th key={idx} className="text-end">
                                  {header}
                                </th>
                              ) : (
                                <th key={idx}>{header}</th>
                              )
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData.length > 0 ? (
                            commentsData.map((cat, idx) => (
                              <tr key={cat._id}>
                                <td>{(currentPage - 1) * limit + idx + 1}</td>
                                <td>{cat.name}</td>
                                <td >
                                  <div className="dropdown dropdown-action">
                                      <a href="#" className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown" aria-expanded="false"><i
                                              className="fa fa-ellipsis-v"></i></a>
                                      <div className="dropdown-menu dropdown-menu-end">
                                          <button type='button' className="dropdown-item" onClick={() => openEditModal(cat)}><i
                                              className="fa-solid fa-pen-to-square m-r-5"></i>
                                              Edit</button>
                                          <button type='button' className="dropdown-item" onClick={() => handleDeleteCategory(cat._id)}><i
                                              className="fa-solid fa-trash m-r-5"></i>
                                              Delete</button>
                                      </div>
                                  </div>
                              </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="row align-center mt-3 mb-2">
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                        <div
                          className="dataTables_info"
                          id="DataTables_Table_0_info"
                          role="status"
                          aria-live="polite"
                        >
                          Showing {Math.min(limit, totalItems)} from{" "}
                          {totalItems} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate"
                        >
                          <Pagination
                            total={totalItems}
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
          ) : (
            <Loader />
          )}
        </div>
        <Footer />
      </div>
      {/* Render AddModel modal at the end of the main return, just before closing main wrapper div */}
      {showAddModal && (
        <AddModel
          modalOpen={showAddModal}
          handleModalClose={() => setShowAddModal(false)}
          modalMode={editMode ? "edit" : "add"}
          handleAddCategory={editMode ? handleEditCategory : handleAddCategory}
          categoryData={selectedCategory}
        />
      )}
    </div>
  );
};

export default DMRCategories;
