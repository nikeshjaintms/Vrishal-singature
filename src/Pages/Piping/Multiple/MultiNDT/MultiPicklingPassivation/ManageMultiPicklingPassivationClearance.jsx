import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../Include/Header";
import Sidebar from "../../../Include/Sidebar";
import PageHeader from "../../Components/Breadcrumbs/PageHeader";
import { Dropdown } from "primereact/dropdown";
import { getUserProcedureMaster } from "../../../../../Store/Piping/Procedure/ProcedureMaster";
import { Pagination, Search } from "../../../Table";
import { Check, Save, X } from "lucide-react";
import DropDown from "../../../../../Components/DropDown";
import PicklingPassivationClearanceForm from "./components/PicklingPassivationClearanceForm";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SubmitButton from "../../Components/SubmitButton/SubmitButton";
import { V_URL } from "../../../../../BaseUrl";
import axios from "axios";
import moment from "moment";

const ManageMultiPicklingPassivationClearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [error, setError] = useState({});
  const [disable, setDisable] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [pmi, setPmi] = useState({
    procedure: "",
  });
  const data = location.state;
  console.log("data", data);

  const [pmiForm, setPmiForm] = useState({
    test_date: "",
    make: "",
    serial_no: "",
  });

  const [tableData, setTableData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    thickness: "",
    remarks: "",
  });

  useEffect(() => {
    dispatch(getUserProcedureMaster({ status: "true" }));
  }, []);

  const procedureData = useSelector(
    (state) => state.getUserProcedureMaster?.user?.data
  );

  useEffect(() => {
    if (data?._id || data?.items || data?.report_no) {
      // Use items from state if available (from grouping), otherwise wrap data in array
      const items = data.items || (data.drawing_no ? [data] : []);

      const initializedItems = items?.map((item) => ({
        ...item,
        thickness: item.thickness || "",
        remarks: item.remarks || "",
        is_accepted: item.is_accepted !== undefined ? item.is_accepted : null,
      }));

      setTableData(initializedItems || []);

      setPmi({ procedure: data?.procedure_no?._id || "" });
      setPmiForm({
        test_date: data?.test_date
          ? moment(data?.test_date).format("YYYY-MM-DD")
          : data?.offer_date
            ? moment(data?.offer_date).format("YYYY-MM-DD")
            : moment().format("YYYY-MM-DD"),
        make: data?.analyser_model_serial_no || "",
        serial_no: data?.validity_of_instrument || "",
      });
    }
  }, [data]);

  const filterAndPaginate = (
    data,
    searchTerm,
    currentPage,
    limit,
    setTotalItems
  ) => {
    let filteredData = data;
    if (searchTerm) {
      filteredData = filteredData.filter(
        (i) =>
          i?.drawing_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          i?.spool_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          i?.joint_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    setTotalItems(filteredData?.length);
    return filteredData?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  };

  const commentsData = useMemo(
    () =>
      filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
    [currentPage, search, limit, tableData]
  );

  const handleInputChange = (index, field, value) => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + index;
    updatedData[dataIndex] = {
      ...updatedData[dataIndex],
      [field]: value,
    };
    setTableData(updatedData);
  };

  const handleChange = (e, name) => {
    setPmi({ ...pmi, [name]: e.target.value });
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      thickness: row.thickness || "",
      remarks: row.remarks || "",
    });
  };

  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = {
      ...updatedData[dataIndex],
      ...editFormData,
    };
    setTableData(updatedData);
    setEditRowIndex(null);
    toast.success("Pickling data saved locally.");
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleAcceptRejectClick = (index, isAccepted, name) => {
    Swal.fire({
      title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
      text: "Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      dangerMode: !isAccepted,
    }).then((result) => {
      if (result.isConfirmed) {
        // const updatedData = [...tableData];
        // const dataIndex = (currentPage - 1) * limit + index;
        // updatedData[dataIndex] = {
        //   ...updatedData[dataIndex],
        //   is_accepted: isAccepted,
        // };
        // setTableData(updatedData);
        const dataIndex = (currentPage - 1) * limit + index;
const currentItem = tableData[dataIndex];

const updatedData = tableData.map((item) => {
  if (
    item.drawing_no === currentItem.drawing_no &&
    item.spool_no === currentItem.spool_no
  ) {
    return {
      ...item,
      is_accepted: isAccepted,
    };
  }
  return item;
});

setTableData(updatedData);
        toast.success(
          `${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`
        );
      }
    });
  };

  const handleChange2 = (e) => {
    setPmiForm({ ...pmiForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (validation()) {
      const filteredData = tableData.map((item) => ({
        _id: item._id,
        drawing_no: item.drawing_no,
        joint_no: item.joint_no,
        spool_no: item.spool_no,
        thickness: item.thickness,
        remarks: item.remarks || "",
        is_accepted: item.is_accepted === true
      }));

      setDisable(true);
      const myurl = `${V_URL}/user/piping-update-multi-pickling-inspection`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("ndt_offer_no", data?._id);
      bodyFormData.append("report_no", data?.report_no);
      bodyFormData.append("offer_date", data?.offer_date);
      bodyFormData.append("offered_by", data?.offered_by?._id);
      bodyFormData.append("project_id", data?.project_id);
      bodyFormData.append("procedure_no", pmi.procedure);
      bodyFormData.append("test_date", pmiForm.test_date);
      bodyFormData.append("qc_name", localStorage.getItem("PAY_USER_ID"));
      bodyFormData.append(
        "project_name",
        localStorage.getItem("PAY_USER_PROJECT_NAME")
      );
      bodyFormData.append("items", JSON.stringify(filteredData));
      bodyFormData.append("pId", localStorage.getItem("U_PROJECT_ID"));

      axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      })
        .then((response) => {
          if (response.data.success === true) {
            toast.success(response.data.message);
            navigate("/piping/user/pickling-passivation-clearance-management");
          }
          setDisable(false);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Something went wrong.");
          setDisable(false);
        });
    }
  };

  const validation = () => {
    let isValid = true;
    let err = {};
    if (!pmi.procedure) {
      isValid = false;
      err["procedure_err"] = "Please select procedure no.";
    }
    if (!pmiForm.test_date) {
      isValid = false;
      err["test_date_err"] = "Please select test date.";
    }
    setError(err);
    return isValid;
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const procedureOptions = procedureData?.map((procedure) => ({
    label: procedure.vendor_doc_no,
    value: procedure._id,
  }));

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              {
                name: "Dashboard",
                link: "/piping/user/dashboard",
                active: false,
              },
              {
                name: "Pickling Passivation Testing Clearance List",
                link: "/piping/user/pickling-passivation-clearance-management",
                active: false,
              },
              {
                name: `${data?._id ? "Edit" : "Add"} Pickling Passivation Testing Clearance`,
                active: true,
              },
            ]}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>Pickling Passivation Testing Clearance Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Pickling Passivation Testing Offer No.</label>
                          <input
                            className="form-control"
                            value={data?.report_no || ""}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>
                            Procedure No. <span className="login-danger">*</span>
                          </label>
                          <Dropdown
                            options={procedureOptions}
                            value={pmi.procedure}
                            onChange={(e) => handleChange(e, "procedure")}
                            filter
                            className="w-100"
                            placeholder="Select Procedure No."
                          />
                          <div className="error">{error?.procedure_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms">
                          <label>
                            Test Date <span className="login-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={pmiForm.test_date}
                            name="test_date"
                            onChange={handleChange2}
                            max={new Date().toISOString().split("T")[0]}
                          />
                          <div className="error">{error?.test_date_err}</div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Item Details List</h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <Search
                                  onSearch={(value) => {
                                    setSearch(value);
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
                    <table className="table table-bordered custom-table mb-0 align-middle text-center">
                      <thead>
                        <tr>
                          <th>SR NO</th>
                          <th>DRAWING NO.</th>
                          <th>SPOOL NO</th>
                          <th>JOINT NO.</th>
                          <th>SIZE</th>
                          <th>Thickness</th>
                          <th>Acc/Rej</th>
                          <th>REMARKS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((item, index) => {
                          const isEditing = editRowIndex === index;
                          return (
                            <tr key={index}   onClick={() => handleEditClick(index, item)}>
                              <td>{(currentPage - 1) * limit + index + 1}</td>
                              <td>{item?.drawing_no}</td>
                              <td>{item?.spool_no}</td>
                              <td>{item?.joint_no}</td>
                              <td>{item?.size}</td>
                              <td>
                                {item.thickness || "-"}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2 justify-content-center">
                                  {isEditing ? (
                                    <div className="d-flex gap-1">
                                      <span
                                        className={`present-table attent-status ${item?.is_accepted === true ? "selected" : ""}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) => {
                                              e.stopPropagation();
                                              handleAcceptRejectClick(index, true, item?.joint_no);
                                            }}
                                      >
                                        <Check />
                                      </span>
                                      <span
                                        className={`absent-table attent-status ${item?.is_accepted === false ? "selected" : ""}`}
                                        style={{ cursor: "pointer" }}
                                        // onClick={() => handleAcceptRejectClick(index, false, item?.joint_no)}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAcceptRejectClick(index, false, item?.joint_no);
                                        }}
                                      >
                                        <X />
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center gap-2">
                                      {/* <span>
                                        {item?.is_accepted === true ? "Accepted" : item?.is_accepted === false ? "Rejected" : "-"}
                                      </span> */}
                                      {item?.is_accepted === true ? (
                                        <span className="custom-badge status-green">Acc</span>
                                      ) : item?.is_accepted === false ? (
                                        <span className="custom-badge status-pink">Rej</span>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                {isEditing ? (
                                  <textarea
                                    className="form-control"
                                    rows="1"
                                    value={editFormData.remarks}
                                    onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                                  />
                                ) : (
                                  <span
                                    style={{ cursor: "pointer", display: "block", minHeight: "20px" }}
                                    onClick={() => handleEditClick(index, item)}
                                  >
                                    {item.remarks || "-"}
                                  </span>
                                )}
                              </td>
                              <td>
                                {isEditing && (
                                  <div className="d-flex gap-1">
                                    <button className="btn btn-success btn-sm"   onClick={(e) => {
    e.stopPropagation();
    handleSaveClick();
  }}>
                                      <Save />
                                    </button>
                                    <button className="btn btn-secondary btn-sm"   onClick={(e) => {
    e.stopPropagation();
    handleSaveClick();
  }}>
                                      <X />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {commentsData?.length === 0 && (
                          <tr>
                            <td colSpan="9">No Data Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="row align-center mt-3 mb-2">
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                      <div
                        className="dataTables_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {Math.min(limit, totalItems)} from {totalItems}{" "}
                        data
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                      <div
                        className="dataTables_paginate paging_simple_numbers"
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

          <SubmitButton
            disable={disable}
            handleSubmit={handleSubmit}
            link={"/piping/user/pickling-passivation-clearance-management"}
            buttonName={"Generate Pickling Report"}
          />
        </div>
      </div>
    </div>
  );
};
export default ManageMultiPicklingPassivationClearance;
