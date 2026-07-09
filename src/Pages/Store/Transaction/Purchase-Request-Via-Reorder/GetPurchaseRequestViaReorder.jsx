import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Include/Footer";
import { getReorderItems } from "../../../../Store/Store/Report/ReOrderItems";
import toast from "react-hot-toast";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import { DownloadPdf } from "../../Components/DownloadPdf";
import { DownloadXlsx } from "../../Components/DownloadXlsx";
import Swal from "sweetalert2";
import { M_STORE, V_URL } from "../../../../BaseUrl";
import axios from "axios";
import moment from "moment";

const ReOrderItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [startDownload, setStartDownload] = useState(false);
  const [payload, setPayload] = useState(null);
   const [commentsData, setCommentsData] = useState([]);
  const [formData, setFormData] = useState({
  customer_id: "",
  items: [],
});

  useEffect(() => {
    if (localStorage.getItem("PAY_USER_TOKEN") === null) {
      navigate("/user/login");
    } else if (localStorage.getItem("VI_PRO") !== "Main Store") {
      toast.error(
        "Access Denied. You do not have permission to view this product. Please contact your administrator for assistance."
      );
      navigate("/user/login");
    }
    fetchData();
  }, [navigate, disable, search]);

  const fetchData = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("search", search);
    bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
    bodyFormData.append("year_id", localStorage.getItem("PAY_USER_YEAR_ID"));
    dispatch(getReorderItems(bodyFormData));
    setDisable(false);
  };

  const entity = useSelector((state) => state?.getReorderItems?.user?.data);

//   const commentsData = useMemo(() => {
//     let computedComments = entity;
//     setTotalItems(computedComments?.length);
//     return computedComments?.slice(
//       (currentPage - 1) * limit,
//       (currentPage - 1) * limit + limit
//     );
//   }, [currentPage, search, limit, entity]);

 

useEffect(() => {
  if (entity?.length) {
    const paginated = entity.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    ).map(item => ({ ...item, checked: false }));
    
    setCommentsData(paginated);
    setTotalItems(entity.length);
  }
}, [entity, currentPage, limit]);



const handleSaveSelected = () => {
  const selectedItems = commentsData.filter(item => item.checked);

  if (selectedItems.length === 0) {
    toast.error("Please select at least one item.");
    return;
  }

  // Save in localStorage to persist on refresh
  localStorage.setItem("selectedPRItems", JSON.stringify(selectedItems));
  
// console.log(localStorage.getItem("selectedPRItems"));
  navigate("/main-store/user/manage-purchase-request", {
    state: { selectedItems },
  });
};



  const handleDelete = (id, title) => {
    Swal.fire({
      title: `Are you sure want to delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const myurl = `${V_URL}/user/delete-pr`;
        var bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);

        axios({
          method: "put",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        })
          .then((response) => {
            if (response.data.success === true) {
              toast.success(response?.data?.message);
              setDisable(true);
              fetchData();
            } else {
              toast.error(response?.data?.message);
            }
          })
          .catch((error) => {
            toast.error("Something went wrong");
          });
      }
    });
  };



  const handleDownload = (id) => {
    setPayload({
      id: id,
      print_date: false,
    });
    setStartDownload(true);
  };
  const downloadPdf = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("search", search);
    bodyFormData.append("print_date", true);
    bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
    bodyFormData.append("year_id", localStorage.getItem("PAY_USER_YEAR_ID"));
    DownloadPdf({
      apiMethod: "post",
      url: "reorder-item-download",
      body: bodyFormData,
    });
  };

  const downloadExcel = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("search", search);
    bodyFormData.append("print_date", true);
    bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
    bodyFormData.append("year_id", localStorage.getItem("PAY_USER_YEAR_ID"));
    DownloadXlsx({
      apiMethod: "post",
      url: "reorder-item-excel-download",
      body: bodyFormData,
    });
  };

  const handleRefresh = () => {
    setDisable(true);
    setSearch("");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return <span className="custom-badge status-orange">Pending</span>;
      case 2:
        return "In Progress";
      case 3:
        return "Completed";
      case 4:
        return <span className="custom-badge status-green">Approved</span>;
      default:
        return "Unknown";
    }
  };

 
const handleSave = async () => {
  const selectedItems = formData.items.filter(item => item.checked);

  if (selectedItems.length === 0) {
    toast.error("Please select at least one item.");
    return;
  }

  const payload = {
    items: selectedItems,
  };

  try {
    const response = await axios.post("/api/store/pr/save", payload);
    if (response.data.success) {
      navigate("/store/transaction/generated-pr", {
        state: { prData: response.data.data },
      });
    }
  } catch (err) {
    console.error("Error saving:", err);
    toast.error("Failed to save.");
  }
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
                    <Link to="/main-store/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    Re-Order Items List
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {disable === false ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Re-Order Items List</h3>
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
                                      alt="firm-searchBox"
                                    />
                                  </a>
                                </form>
                              </div>

                              <div className="add-group">
                                {/* <Link
                                  to="/main-store/user/manage-purchase-request-via-reorder"
                                  className="btn btn-primary add-pluss ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Add"
                                >
                                  <img
                                    src="/assets/img/icons/plus.svg"
                                    alt="plus-icon"
                                  />
                                </Link> */}
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
                                  className="btn btn-primary doctor-refresh ms-2"
                                  onClick={() => setOpenFilter(!openFilter)}
                                  aria-controls="filter-inputs"
                                  aria-expanded={openFilter}
                                >
                                  <i className="fas fa-filter"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <div className="add-group">
                            <button
                              className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
                              type="button"
                              onClick={downloadPdf}
                            >
                              PDF <i className="fa-solid fa-download mx-2"></i>
                            </button>
                          </div>
                          <div className="add-group">
                            <button
                              className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
                              type="button"
                              onClick={downloadExcel}
                            >
                              Excel{" "}
                              <i className="fa-solid fa-download mx-2"></i>
                            </button>
                          </div>
                          <DropDown
                            limit={limit}
                            onLimitChange={(val) => setlimit(val)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table  mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Select</th>
                            <th>Sr.</th>
                            <th>Item</th>
                            <th>Unit</th>
                            <th>M Code</th>
                            <th>HSN Code</th>
                            <th>Re-Order Qty.</th>
                            <th>Bal. Qty.</th>
                            <th>Order Qty.</th>
                            {/* <th>Status</th>
                            <th className="text-end">Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) => (
                            <tr key={elem?._id}>
                              <td>
                                {" "}
                                {/* <input
                                  type="checkbox"
                                  name={`select_${elem._id}`}
                                  className="form-check-input"


                                /> */}

                        <input
  type="checkbox"
  className="form-check-input"
  checked={elem.checked || false}
  onChange={(e) => {
    const updatedItems = [...commentsData];
    updatedItems[i].checked = e.target.checked;
    setCommentsData(updatedItems);
  }}
/>


                              </td>
            
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.item_name}</td>
                              <td>{elem?.unit}</td>
                              <td>{elem?.m_code}</td>
                              <td>{elem?.hsn_code}</td>
                              <td>{elem?.reorder_quantity}</td>
                              <td>{elem?.balance}</td>
                              <td>{elem?.order_qty}</td>
                              {/* <td>{getStatusLabel(elem.status)}</td>
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() =>
                                        navigate(
                                          `/main-store/user/view-purchase-request`,
                                          { state: elem }
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-eye m-r-5"></i>{" "}
                                      View
                                    </button>
                                    {elem.status !== 4 && (
                                      <>
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() =>
                                            navigate(
                                              `/main-store/user/edit-purchase-request-manage`,
                                              { state: elem }
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-pen-to-square m-r-5"></i>{" "}
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() =>
                                            handleDelete(
                                              elem?._id,
                                              elem.voucher_no
                                            )
                                          }
                                        >
                                          <i className="fa fa-trash-alt m-r-5"></i>{" "}
                                          Delete
                                        </button>
                                      </>
                                    )}
                                    <button
                                      type="button"
                                      className="dropdown-item d-flex align-items-center"
                                      onClick={() =>
                                        handleDownload(
                                          elem?._id,
                                          elem.voucher_no
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-download"></i>{" "}
                                      Download Report
                                    </button>
                                  </div>
                                </div>
                              </td> */}
                            </tr>
                          ))}

                          {commentsData?.length === 0 ? (
                            <tr>
                              <td colspan="999">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                     
                    </div>
                     <div className="col-12 text-end">
                        <div className="doctor-submit text-end">
                          <button
                            type="button"
                            className="btn btn-primary submit-form ms-2"
                            // onClick={handleSave}
                              onClick={handleSaveSelected}
                          >
                            Generate PR
                          </button>
                        </div>
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
    </div>
  );
};

export default ReOrderItems;
