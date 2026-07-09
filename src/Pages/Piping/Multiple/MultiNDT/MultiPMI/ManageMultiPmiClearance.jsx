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
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SubmitButton from "../../Components/SubmitButton/SubmitButton";
import { V_URL } from "../../../../../BaseUrl";
import axios from "axios";
import moment from "moment";

const ManageMultiPmiClearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [status, setStatus] = useState(null);
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
    weld: { cr: "", ni: "", mo: "", is_accepted: null },
    p1: { cr: "", ni: "", mo: "", is_accepted: null },
    p2: { cr: "", ni: "", mo: "", is_accepted: null },
    remarks: "",
  });
  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

  useEffect(() => {
    dispatch(getUserProcedureMaster({ status: "true" }));
  }, []);

  const procedureData = useSelector(
    (state) => state.getUserProcedureMaster?.user?.data
  );

  useEffect(() => {
    if (data?._id) {
      const items = data.items || (data.drawing_no ? [data] : []);

      const initializedItems = items?.map((item) => ({
        ...item,
        weld: item.weld || { cr: "", ni: "", mo: "", is_accepted: null },
        p1: item.p1 || { cr: "", ni: "", mo: "", is_accepted: null },
        p2: item.p2 || { cr: "", ni: "", mo: "", is_accepted: null },
        remarks: item.remarks || "",
      }));

      setTableData(initializedItems || []);
      if (data?._id) {
        setPmi({ procedure: data?.procedure_no?._id });
        setPmiForm({
          test_date: data?.test_date
            ? moment(data?.test_date).format("YYYY-MM-DD")
            : data?.offer_date
              ? moment(data?.offer_date).format("YYYY-MM-DD")
              : "",
          make: data?.analyser_model_serial_no || "",
          serial_no: data?.validity_of_instrument || "",
        });
      }
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
          i?.joint_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          i?.material_specification?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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

  const handleAcceptReject = (index, part, isAccepted) => {
    if (editRowIndex === index) {
      handleEditFormChange(part, "is_accepted", isAccepted);
      return;
    }
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + index;
    updatedData[dataIndex] = {
      ...updatedData[dataIndex],
      [part]: {
        ...updatedData[dataIndex][part],
        is_accepted: isAccepted,
      },
    };
    setTableData(updatedData);
  };

  const handleInputChange = (index, part, field, value) => {
    if (editRowIndex === index) {
      handleEditFormChange(part, field, value);
      return;
    }
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + index;
    if (part === "remarks") {
      updatedData[dataIndex].remarks = value;
    } else {
      updatedData[dataIndex][part] = {
        ...updatedData[dataIndex][part],
        [field]: value,
      };
    }
    setTableData(updatedData);
  };

  const handleChange = (e, name) => {
    setPmi({ ...pmi, [name]: e.target.value });
  };
  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      weld: { ...row.weld },
      p1: { ...row.p1 },
      p2: { ...row.p2 },
      remarks: row.remarks || "",
    });
  };

  const handleEditFormChange = (part, field, value) => {
    setEditFormData((prev) => {
      if (part === "remarks") {
        return { ...prev, [part]: value };
      }
      return {
        ...prev,
        [part]: {
          ...prev[part],
          [field]: value,
        },
      };
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
    toast.success("PMI data saved for joint " + updatedData[dataIndex].joint_no);
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
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + index;
        updatedData[dataIndex] = {
          ...updatedData[dataIndex],
          is_accepted_qc: isAccepted,
        };
        setTableData(updatedData);
        setAcceptRejectStatus((prev) => ({
          ...prev,
          [index]: isAccepted,
        }));
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
      let updatedData = tableData;

      const filteredData = updatedData.map((item) => ({
        _id: item._id,
        drawing_id: item.drawing_id,
        drawing_no: item.drawing_no,
        joint_id: item.joint_id,
        joint_no: item.joint_no,
        joint_type: item.joint_type,
        joint_type_id: item.joint_type_id,
        item_id: item.item_id,
        main_id: item.main_id,
        main_item_id: item.main_item_id,
        material_specification: item.material_specification,
        material_specification_id: item.material_specification_id,
        piping_class: item.piping_class,
        rev: item.rev,
        service_id: item.service_id,
        size: item.size,
        size_id: item.size_id,
        spool_no: item.spool_no,
        spool_no_id: item.spool_no_id,
        thickness: item.thickness,
        thickness_id: item.thickness_id,
        weld: item.weld || { cr: "", ni: "", mo: "" },
        p1: item.p1 || { cr: "", ni: "", mo: "" },
        p2: item.p2 || { cr: "", ni: "", mo: "" },
        remarks: item.remarks || "",
        is_accepted: item.is_accepted_qc === true
      }));

      setDisable(true);
      const myurl = `${V_URL}/user/piping-update-multi-pmi-inspection`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("ndt_offer_no", data?._id);
      bodyFormData.append("report_no", data?.report_no);
      bodyFormData.append("offer_date", data?.offer_date);
      bodyFormData.append("offered_by", data?.offered_by?._id);
      bodyFormData.append("project_id", data?.project_id);
      bodyFormData.append("make", pmiForm?.make);
      bodyFormData.append("serial_no", pmiForm?.serial_no);
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
            navigate("/piping/user/pmi-clearance-management");
          }
          setDisable(false);
        })
        .catch((error) => {
          toast.error(error.response.data?.message || "Something went wrong.");
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
                name: "PMI Testing Clearance List",
                link: "/piping/user/pmi-clearance-management",
                active: false,
              },
              {
                name: `${data?._id ? "Edit" : "Add"
                  } PMI Testing Clearance`,
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
                        <h4>PMI Testing Clearance Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>PMI Testing Offer No.</label>
                          <input
                            className="form-control"
                            value={data?.report_no?.report_no || data?.report_no || ""}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>
                            {" "}
                            Procedure No.{" "}
                            <span className="login-danger">*</span>
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
                            min={moment(data?.report_date).format("YYYY-MM-DD")}
                          />
                          <div className="error">{error?.test_date_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms">
                          <label>
                            Analyser Model Serial No.
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="make"
                            value={pmiForm.make}
                            onChange={handleChange2}
                          />
                          <div className="error"></div>
                        </div>
                      </div>

                      {/* SERIAL NO */}
                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms">
                          <label>
                            Validity of Instrument
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="serial_no"
                            value={pmiForm.serial_no}
                            onChange={handleChange2}
                          />
                          <div className="error"></div>
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
                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
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
                          <th rowSpan="2">SR NO</th>
                          <th rowSpan="2">LINE NO. / DRAWING NO.</th>
                          <th rowSpan="2">REV NO.</th>
                          <th rowSpan="2">SPOOL NO</th>
                          <th rowSpan="2">JOINT NO.</th>
                          <th rowSpan="2">SIZE</th>
                          <th rowSpan="2">PIPING MATERIAL SPECIFICATION</th>
                          <th rowSpan="2">WELD / PARENT-1 / PARENT-2</th>
                          <th colSpan="3">CHEMICAL COMPOSITION</th>
                          <th rowSpan="2">Acc/Rej</th>
                          <th rowSpan="2">REMARKS</th>
                          <th rowSpan="2">ACTION</th>
                        </tr>

                        <tr>
                          <th>Cr</th>
                          <th>Ni</th>
                          <th>Mo</th>
                        </tr>
                      </thead>


                      <tbody>
                        {commentsData?.map((item, index) => {
                          const isEditing = editRowIndex === index;
                          const rowData = isEditing ? editFormData : item;

                          return (
                            <React.Fragment key={index}>
                              {/* ---------- WELD ROW ---------- */}
                              <tr onClick={() => handleEditClick(index, item)} style={{ cursor: "pointer" }}>
                                <td rowSpan="3">{(currentPage - 1) * limit + index + 1}</td>
                                <td rowSpan="3">{item?.drawing_no}</td>
                                <td rowSpan="3">{item?.rev}</td>
                                <td rowSpan="3">{item?.spool_no}</td>
                                <td rowSpan="3">{item?.joint_no}</td>
                                <td rowSpan="3">{item?.size}</td>
                                <td rowSpan="3">{item?.material_specification}</td>

                                <td>WELD</td>

                                {/* Cr */}
                                <td onClick={(e) => isEditing && e.stopPropagation()}>
                                  {isEditing ? (
                                    <input
                                      className="form-control"
                                      style={{ width: '100px' }}
                                      value={rowData.weld?.cr || ""}
                                      onChange={(e) =>
                                        handleInputChange(index, "weld", "cr", e.target.value)
                                      }
                                      autoFocus
                                    />
                                  ) : (
                                    <span>{item.weld?.cr || "-"}</span>
                                  )}
                                </td>

                                {/* Ni */}
                                <td onClick={(e) => isEditing && e.stopPropagation()}>
                                  {isEditing ? (
                                    <input
                                      className="form-control"
                                      style={{width:'100px'}}
                                      value={rowData.weld?.ni || ""}
                                      onChange={(e) =>
                                        handleInputChange(index, "weld", "ni", e.target.value)
                                      }
                                    />
                                  ) : (
                                    <span>{item.weld?.ni || "-"}</span>
                                  )}
                                </td>

                                {/* Mo */}
                                <td onClick={(e) => isEditing && e.stopPropagation()}>
                                  {isEditing ? (
                                    <input
                                      className="form-control"
                                      value={rowData.weld?.mo || ""}
                                      style={{width:"100px"}}
                                      onChange={(e) =>
                                        handleInputChange(index, "weld", "mo", e.target.value)
                                      }
                                    />
                                  ) : (
                                    <span>{item.weld?.mo || "-"}</span>
                                  )}
                                </td>




                                {/* Acc/Rej Status */}
                                <td rowSpan="3" onClick={(e) => e.stopPropagation()}>
                                  <div className="d-flex align-items-center gap-2 justify-content-center">
                                    {isEditing ? (
                                      <div className="d-flex gap-1">
                                        <span
                                          className={`present-table attent-status ${acceptRejectStatus[index] === true || (acceptRejectStatus[index] === undefined && item?.is_accepted_qc === true) ? "selected" : ""}`}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handleAcceptRejectClick(index, true, item?.joint_no)}
                                        >
                                          <Check />
                                        </span>
                                        <span
                                          className={`absent-table attent-status ${acceptRejectStatus[index] === false || (acceptRejectStatus[index] === undefined && item?.is_accepted_qc === false) ? "selected" : ""}`}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handleAcceptRejectClick(index, false, item?.joint_no)}
                                        >
                                          <X />
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center gap-2">
                                        <span>
                                          {(acceptRejectStatus[index] ?? item?.is_accepted_qc) !== undefined
                                            ? (acceptRejectStatus[index] ?? item?.is_accepted_qc)
                                              ? "Accepted"
                                              : "Rejected"
                                            : "-"}
                                        </span>
                                        {(acceptRejectStatus[index] ?? item?.is_accepted_qc) === true ? (
                                          <span className="custom-badge status-green">Acc</span>
                                        ) : (acceptRejectStatus[index] ?? item?.is_accepted_qc) === false ? (
                                          <span className="custom-badge status-pink">Rej</span>
                                        ) : null}
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Remarks */}
                                <td rowSpan="3" onClick={(e) => isEditing && e.stopPropagation()}>
                                  {isEditing ? (
                                    <textarea
                                      className="form-control"
                                      rows="4"
                                      value={rowData.remarks || ""}
                                      onChange={(e) =>
                                        handleInputChange(index, "remarks", null, e.target.value)
                                      }
                                    />
                                  ) : (
                                    <span>{item.remarks || "-"}</span>
                                  )}
                                </td>

                                {/* Action Buttons */}
                                <td rowSpan="3" onClick={(e) => e.stopPropagation()}>
                                  <div className="d-flex align-items-center gap-2 justify-content-center">
                                    {isEditing && (
                                      <div className="ms-2 d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-success btn-sm p-1"
                                          onClick={handleSaveClick}
                                        >
                                          <Save />
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-secondary btn-sm p-1"
                                          onClick={handleCancelClick}
                                        >
                                          <X />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>

                              {/* ---------- PARENT-1 ROW ---------- */}
                              <tr onClick={() => handleEditClick(index, item)} style={{ cursor: "pointer" }}>
                                <td>PARENT-1</td>

                                {["cr", "ni", "mo"].map((field) => (
                                  <td key={field} onClick={(e) => isEditing && e.stopPropagation()}>
                                    {isEditing ? (
                                      <input
                                        className="form-control"
                                        value={rowData.p1?.[field] || ""}
                                        onChange={(e) =>
                                          handleInputChange(index, "p1", field, e.target.value)
                                        }
                                      />
                                    ) : (
                                      <span>{item.p1?.[field] || "-"}</span>
                                    )}
                                  </td>
                                ))}
                              </tr>

                              {/* ---------- PARENT-2 ROW ---------- */}
                              <tr onClick={() => handleEditClick(index, item)} style={{ cursor: "pointer" }}>
                                <td>PARENT-2</td>

                                {["cr", "ni", "mo"].map((field) => (
                                  <td key={field} onClick={(e) => isEditing && e.stopPropagation()}>
                                    {isEditing ? (
                                      <input
                                        className="form-control"
                                        value={rowData.p2?.[field] || ""}
                                        onChange={(e) =>
                                          handleInputChange(index, "p2", field, e.target.value)
                                        }
                                      />
                                    ) : (
                                      <span>{item.p2?.[field] || "-"}</span>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            </React.Fragment>
                          );
                        })}
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
                        Showing {Math.min(limit, totalItems)} from {totalItems}{" "}
                        data
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

          <SubmitButton
            disable={disable}
            handleSubmit={handleSubmit}
            link={"/piping/user/pmi-clearance-management"}
            buttonName={"Generate PMI Report"}
            // finalReq={data?.status !== 2 ? data?.items : []}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMultiPmiClearance;
