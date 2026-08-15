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
import HtClearanceForm from "./components/HtClearanceForm";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SubmitButton from "../../Components/SubmitButton/SubmitButton";
import { V_URL } from "../../../../../BaseUrl";
import axios from "axios";
import moment from "moment";

const ManageMultiHtClearance = () => {
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
  const [lpt, setLpt] = useState({
    procedure: "",
  });
  const data = location.state;

  console.log(data, "data");

  const [lptForm, setLptForm] = useState({
    test_date: "",
    max_acceptable_hardness: "",
    hardness_value: "",
  });
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    stage: "",
    base_metal_1: "",
    base_metal_2: "",
    weld: "",
    haze_1: "",
    haze_2: "",
    remarks: "",
    is_accepted_qc: "",
  });
  const [tableData, setTableData] = useState([]);
  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

  useEffect(() => {
    dispatch(getUserProcedureMaster({ status: "true" }));
  }, []);

  const procedureData = useSelector(
    (state) => state.getUserProcedureMaster?.user?.data
  );

  useEffect(() => {
    if (data?._id) {
      setTableData(data.items || []);
      if (data?.status === 1) {
        setLptForm({
          test_date: data?.offer_date ? moment(data?.offer_date).format("YYYY-MM-DD") : "",
          max_acceptable_hardness: data?.maxAcceptableHardness || "",
          hardness_value: data?.hardnessValue || "",
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
          i?.grid_item_id?.item_name?.name
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          i?.grid_item_id?.grid_id?.grid_no
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          i?.grid_item_id?.drawing_id?.drawing_no
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          i?.grid_item_id?.drawing_id?.rev
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          i?.grid_item_id?.drawing_id?.assembly_no
            ?.toString()
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase())
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

  const handleChange = (e, name) => {
    setLpt({ ...lpt, [name]: e.target.value });
  };
  const handleChange2 = (e) => {
    setLptForm({ ...lptForm, [e.target.name]: e.target.value });
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      stage: row.stage || "",
      base_metal_1: row.base_metal_1 || "",
      base_metal_2: row.base_metal_2 || "",
      weld: row.weld || "",
      haze_1: row.haze_1 || "",
      haze_2: row.haze_2 || "",
      remarks: row.remarks || "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = {
      ...updatedData[dataIndex],
      ...editFormData,
      is_accepted_qc: acceptRejectStatus[editRowIndex],
    };
    setTableData(updatedData);
    setEditRowIndex(null);
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
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
        // Clearance data
        pwht_stage: item.pwht_stage || "",
        base_metal_1: item.base_metal_1 || "",
        base_metal_2: item.base_metal_2 || "",
        weld: item.weld || "",
        haze_1: item.haze_1 || "",
        haze_2: item.haze_2 || "",
        remarks: item.remarks || "",
        is_accepted: item.is_accepted_qc === true // 2: Accepted, 3: Rejected
      }));

      setDisable(true);
      const myurl = `${V_URL}/user/piping-update-multi-ht-inspection`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("ndt_offer_no", data?._id);
      bodyFormData.append("report_no", data?.report_no);
      bodyFormData.append("offer_date", data?.offer_date);
      bodyFormData.append("offered_by", data?.offered_by?._id);
      bodyFormData.append("project_id", data?.project_id);

      bodyFormData.append("procedure_no", lpt.procedure);
      bodyFormData.append("test_date", lptForm.test_date);
      bodyFormData.append("maxAcceptableHardness", lptForm.max_acceptable_hardness);
      bodyFormData.append("hardnessValue", lptForm.hardness_value);

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
          Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      })
        .then((response) => {
          if (response.data.success === true) {
            toast.success(response.data.message);
            navigate("/piping/user/ht-clearance-management");
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
    if (!lpt.procedure) {
      isValid = false;
      err["procedure_err"] = "Please select procedure no.";
    }
    if (!lptForm.test_date) {
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
                name: "Hardness Penetrant Testing Clearance List",
                link: "/piping/user/ht-clearance-management",
                active: false,
              },
              {
                name: `${data?._id ? "Edit" : "Add"
                  } Hardness Penetrant Testing Clearance`,
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
                        <h4>Hardness Testing Clearance Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      {/* {data?.status !== 2 && (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Magnetic Particle Testing Clearance No.</label>
                                                        <input className='form-control' value={data?.test_inspect_no} readOnly />
                                                    </div>
                                                </div>
                                            )} */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Hardness Testing Offer No.</label>
                          <input
                            className="form-control"
                            value={
                              data?.report_no?.report_no || data?.report_no || ""
                            }
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>
                            {" "}
                            Procedure No.{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <Dropdown
                            options={procedureOptions}
                            value={lpt.procedure}
                            onChange={(e) => handleChange(e, "procedure")}
                            filter
                            className="w-100"
                            placeholder="Select Procedure No."
                          />
                          <div className="error">{error?.procedure_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-3 col-xl-3">
                        <div className="input-block local-forms">
                          <label>
                            Test Date <span className="login-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            value={lptForm.test_date}
                            name="test_date"
                            onChange={handleChange2}
                            max={new Date().toISOString().split("T")[0]}
                            min={moment(data?.report_date).format("YYYY-MM-DD")}
                          />
                          <div className="error">{error?.test_date_err}</div>
                        </div>
                      </div>
                      {/* <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Acceptance Code </label>
                                                    <input type='text' className='form-control' value={lptForm.acc_code} name='acc_code' onChange={handleChange2} />
                                                    <div className='error'>{error?.acc_code_err}</div>
                                                </div>
                                            </div> */}
                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms">
                          <label>
                            Max. Acceptable Hardness{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="max_acceptable_hardness"
                            value={lptForm.max_acceptable_hardness}
                            onChange={handleChange2}
                          />
                          <div className="error"></div>
                        </div>
                      </div>

                      {/* SERIAL NO */}
                      <div className="col-12 col-md-3 mb-3">
                        <div className="input-block local-forms">
                          <label>
                            Hardness Value (HRB / HRC/ HB/ HV){" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="hardness_value"
                            value={lptForm.hardness_value}
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

          {/* <HtClearanceForm
                        data={data}
                        lptForm={lptForm}
                        developer={developer}
                        penetrant={penetrant}
                        cleaner={cleaner}
                        error={error}
                        handleChange2={handleChange2}
                        handleChangeDeveloper={handleChangeDeveloper}
                        handleChangePenetrant={handleChangePenetrant}
                        handleChangeCleaner={handleChangeCleaner}
                    /> */}

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
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No./Line No.</th>
                          <th>Rev</th>
                          <th>Spool No.</th>
                          <th>Joint No.</th>
                          <th>Stage</th>
                          <th>Piping Material Specification</th>
                          <th>Base Metal</th>
                          <th>Base Metal</th>
                          <th>Weld</th>
                          <th>Haze 1</th>
                          <th>Haze 2</th>
                          <th>Remarks</th>
                          <th>Test Result</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, i) => {
                          const actualIndex = (currentPage - 1) * limit + i;
                          return (
                            <tr key={elem?._id || actualIndex}>
                              <td>{actualIndex + 1}</td>
                              <td>{elem?.drawing_no}</td>
                              <td>{elem?.rev}</td>
                              <td>{elem?.spool_no}</td>
                              <td>{elem?.joint_no}</td>
                              <td>{elem?.pwht_stage}</td>
                              <td>{elem?.material_specification}</td>
                              {/* Readings */}
                              <td onClick={() => handleEditClick(i, elem)} style={{ cursor: "pointer" }}>
                                {editRowIndex === i ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="base_metal_1"
                                    value={editFormData.base_metal_1}
                                    onChange={handleEditFormChange}
                                    placeholder="Base Metal 1"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  elem?.base_metal_1 || "-"
                                )}
                              </td>
                              <td onClick={() => handleEditClick(i, elem)} style={{ cursor: "pointer" }}>
                                {editRowIndex === i ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="base_metal_2"
                                    value={editFormData.base_metal_2}
                                    onChange={handleEditFormChange}
                                    placeholder="Base Metal 2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  elem?.base_metal_2 || "-"
                                )}
                              </td>
                              <td onClick={() => handleEditClick(i, elem)} style={{ cursor: "pointer" }}>
                                {editRowIndex === i ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="weld"
                                    value={editFormData.weld}
                                    onChange={handleEditFormChange}
                                    placeholder="Weld"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  elem?.weld || "-"
                                )}
                              </td>
                              <td onClick={() => handleEditClick(i, elem)} style={{ cursor: "pointer" }}>
                                {editRowIndex === i ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="haze_1"
                                    value={editFormData.haze_1}
                                    onChange={handleEditFormChange}
                                    placeholder="Haze 1"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  elem?.haze_1 || "-"
                                )}
                              </td>
                              <td onClick={() => handleEditClick(i, elem)} style={{ cursor: "pointer" }}>
                                {editRowIndex === i ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="haze_2"
                                    value={editFormData.haze_2}
                                    onChange={handleEditFormChange}
                                    placeholder="Haze 2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  elem?.haze_2 || "-"
                                )}
                              </td>

                              <td onClick={() => handleEditClick(i, elem)} style={{ cursor: "pointer" }}>
                                {editRowIndex === i ? (
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="remarks"
                                    value={editFormData.remarks}
                                    onChange={handleEditFormChange}
                                    placeholder="Remarks"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  elem?.remarks || "-"
                                )}
                              </td>

                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  {editRowIndex === i ? (
                                    <>
                                      <div className="d-flex gap-1">
                                        <span
                                          className={`present-table attent-status ${acceptRejectStatus[i] === true || (acceptRejectStatus[i] === undefined && elem?.is_accepted_qc === true) ? "selected" : ""}`}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handleAcceptRejectClick(i, true, elem?.joint_no)}
                                        >
                                          <Check size={14} />
                                        </span>
                                        <span
                                          className={`absent-table attent-status ${acceptRejectStatus[i] === false || (acceptRejectStatus[i] === undefined && elem?.is_accepted_qc === false) ? "selected" : ""}`}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => handleAcceptRejectClick(i, false, elem?.joint_no)}
                                        >
                                          <X size={14} />
                                        </span>
                                      </div>
                                      <div className="ms-2 d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-success btn-sm p-1"
                                          onClick={handleSaveClick}
                                        >
                                          <Save size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-secondary btn-sm p-1"
                                          onClick={handleCancelClick}
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="d-flex align-items-center gap-2">
                                      <span>
                                        {(acceptRejectStatus[i] ?? elem?.is_accepted_qc) !== undefined
                                          ? (acceptRejectStatus[i] ?? elem?.is_accepted_qc)
                                            ? "Accepted"
                                            : "Rejected"
                                          : "-"}
                                      </span>
                                      {(acceptRejectStatus[i] ?? elem?.is_accepted_qc) === true ? (
                                        <span className="custom-badge status-green">Acc</span>
                                      ) : (acceptRejectStatus[i] ?? elem?.is_accepted_qc) === false ? (
                                        <span className="custom-badge status-pink">Rej</span>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                        {commentsData?.length === 0 ? (
                          <tr>
                            <td colSpan="999">
                              <div className="no-table-data">
                                No Data Found!
                              </div>
                            </td>
                          </tr>
                        ) : null}
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
            link={"/piping/user/ht-clearance-management"}
            buttonName={"Generate HT Report"}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMultiHtClearance;
