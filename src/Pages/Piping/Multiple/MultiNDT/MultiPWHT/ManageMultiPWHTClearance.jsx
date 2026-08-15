import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../Include/Header";
import Sidebar from "../../../Include/Sidebar";
import PageHeader from "../../Components/Breadcrumbs/PageHeader";
import PWHTClearanceForm from "./components/PWHTClearanceForm";
import DropDown from "../../../../../Components/DropDown";
import { Pagination, Search } from "../../../Table";
import { Check, Save, X } from "lucide-react";
import SubmitButton from "../../Components/SubmitButton/SubmitButton";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { V_URL } from "../../../../../BaseUrl";
import axios from "axios";
import moment from "moment";
import {getPwhtInspectionPiping} from '../../../../../Store/Piping/Ndt/PwhtNdt/getPwhtInspectionPiping';

const ManageMultiPWHTClearance = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState({});
  const [disable, setDisable] = useState(false);
  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
  
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const data = location.state;
  const isViewOnly = data?.status !== 1;
  console.log("data==========================================>",data);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
     test_date:"",
     temperature_recorder_sr_no:"",
     temperature_recorder_validity:"",
     thermocouple_le_no_validity:"",
     start_date:"",
     end_date:"",
     chart_no:"",
     is_accepted:"",
    is_accepted_qc: "",
    qc_remarks: "",
  });
  
// const handleAcceptRejectClick = (index, isAccepted, name = "Item") => {
//   Swal.fire({
//     title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
//     text: "Are you sure you want to proceed?",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonText: "Confirm",
//     cancelButtonText: "Cancel",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       const updatedTableData = [...tableData];
//       const updatedStatus = { ...acceptRejectStatus };

//       updatedTableData[index] = {
//         ...updatedTableData[index],
//         is_accepted: isAccepted,
//       };

//       updatedStatus[index] = isAccepted;

//       setTableData(updatedTableData);
//       setAcceptRejectStatus(updatedStatus);

//       toast.success(
//         `${name} ${isAccepted ? "accepted" : "rejected"}`
//       );
//     }
//   });
// };

const handleAcceptRejectClick = (itemId, isAccepted, name = "Item") => {
  console.log("itemId======>",itemId);
  console.log("isAccepted=======>",isAccepted);

  Swal.fire({
    title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
    text: "Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      const updatedTableData = tableData.map((row) =>
        row.itemId === itemId ? { ...row, is_accepted: isAccepted } : row
      );
       setTableData(updatedTableData);
  console.log("updatedTableData================>",updatedTableData);

      const updatedStatus = { ...acceptRejectStatus, [itemId]: isAccepted };
console.log("updatedStatus==================>",updatedStatus);
  
      setAcceptRejectStatus(updatedStatus);

      toast.success(`${name} ${isAccepted ? "accepted" : "rejected"}`);
    }
  });
};

console.log(tableData);


useEffect(() => {
  if (!data?.items) return;

  const rows = data.items.map((item) => {
    return {
      itemId: item._id,

      drawing_no: item.drawing_no,
      spool_no: item.spool_no,
      joint_no: item.joint_no,
      size: item.size,
      thickness: item.thickness,

      piping_class: item.piping_class,
      material_spec: item.piping_material_specification,

      // loadingTemp: item.loadingTemp,
      // rateofHeating: item.rateofHeating,
      // soakingTemp: item.soakingTemp,
      // soakingPeriod: item.soakingPeriod,
      // rateofCooling: item.rateofCooling,
      // unloadingTemp: item.unloadingTemp,

      loadingTemp: isViewOnly
  ? item.loading_temp
  : item.loadingTemp,

rateofHeating: isViewOnly
  ? item.rate_of_heating
  : item.rateofHeating,

soakingTemp: isViewOnly
  ? item.soaking_temp
  : item.soakingTemp,

soakingPeriod: isViewOnly
  ? item.soaking_period
  : item.soakingPeriod,

rateofCooling: isViewOnly
  ? item.rate_of_cooling
  : item.rateofCooling,

unloadingTemp: isViewOnly
  ? item.unloading_temp
  : item.unloadingTemp,
      no_of_thermocouple: item.no_of_thermocouple || "",
     temperature_recorder_sr_no: item.temperature_recorder_sr_no || "",
    temperature_recorder_validity: item.temperature_recorder_validity || "",
    thermocouple_le_no_validity: item.thermocouple_le_no_validity || "",

    start_date: item.start_date || "",
    end_date: item.end_date || "",
    chart_no: item.chart_no || "",
    qc_remarks: item.qc_remarks || "",
    remarks: item.remarks || "",
    is_accepted: item.is_accepted,
      
    };
  });
console.log("rows=======>",rows);
  setTableData(rows);

  setEditFormData((prev) => ({
    ...prev,
    test_date: data?.test_date
      ? moment(data.test_date).format("YYYY-MM-DD")
      : "",
  }));
}, [data]);




const handleEditClick = (index, row) => {
  if (editRowIndex === index) return;

  setEditRowIndex(index);
  setEditFormData((prev) => ({
    ...row,
    test_date: prev.test_date, // ✅ keep test_date
  }));
};

const stopPropagation = (e) => e.stopPropagation();

  const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSaveClick = (index) => {
  const updatedData = [...tableData]; // copy tableData
console.log("updatedData",updatedData);
  updatedData[index] = {
    ...updatedData[index], // keep existing fields
    ...editFormData,
     is_accepted: updatedData[index].is_accepted, 
  };

  setTableData(updatedData); // save changes
  setEditRowIndex(null);     // close edit mode
};

const buildQcItemsPayload = () => {
  return tableData.map((row) => ({
    id: row.itemId,
 loadingTemp: row.loadingTemp,
    rateofHeating: row.rateofHeating,
    soakingTemp: row.soakingTemp,
    soakingPeriod: row.soakingPeriod,
    rateofCooling: row.rateofCooling,
    unloadingTemp: row.unloadingTemp,
    no_of_thermocouple: row.no_of_thermocouple,
    
    temperature_recorder_sr_no: row.temperature_recorder_sr_no,
    temperature_recorder_validity: row.temperature_recorder_validity,
    thermocouple_le_no_validity: row.thermocouple_le_no_validity,
    start_date: row.start_date || null,
    end_date: row.end_date || null,
    chart_no: row.chart_no,
    qc_remarks: row.qc_remarks,
    //  is_accepted: acceptRejectStatus[row.itemId]
    is_accepted:
  acceptRejectStatus[row.itemId] !== undefined
    ? acceptRejectStatus[row.itemId]
    : row.is_accepted

  }));
};

const validateSelectedRows = () => {
  const selectedRows = tableData.filter(
    (row) => acceptRejectStatus[row.itemId] !== undefined
  );

  if (!selectedRows.length) {
    toast.error("Please accept or reject at least one row");
    return false;
  }

  return true;
};

const handleSubmit = async () => {
   if (!validation()) return;

  // ✅ Table validation
 if (!validateSelectedRows()) return;
  try {
    setDisable(true);

    console.log(buildQcItemsPayload());

    const payload = {
      inspection_id: data?._id,
      test_date: editFormData?.test_date,
      project_name: localStorage.getItem("PAY_USER_PROJECT_NAME"),
      qc_name: localStorage.getItem("PAY_USER_ID"),
      items: buildQcItemsPayload(),
    };
console.log("payload===========>",payload);
    const res = await axios.post(
      `${V_URL}/user/verify-pwht-inspection-piping`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      
      navigate("/piping/user/pwht-clearance-management");
       dispatch(
          getPwhtInspectionPiping({
            page: currentPage,
            limit,
            search,
          })
        );
    }
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Verification failed");
  } finally {
    setDisable(false);
  }
};

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };


  const validation = () => {
    let isValid = true;
    let err = {};
    // if (!rt.procedure) {
    //   isValid = false;
    //   err["procedure_err"] = "Please select procedure";
    // }
    // if (!rtForm.test_date) {
    //   isValid = false;
    //   err["test_date_err"] = "Please select test date";
    // }
      if (!editFormData.test_date) {
    isValid = false;
    err["test_date_err"] = "Please select test date";
  }

    setError(err);
    return isValid;
  };
const validateTableRows = () => {
  for (let i = 0; i < tableData.length; i++) {
    const row = tableData[i];

    // ✅ Use fallback (important)
    const status =
      acceptRejectStatus[row.itemId] !== undefined
        ? acceptRejectStatus[row.itemId]
        : row.is_accepted;

    // ❌ Accept/Reject not selected
    if (status === undefined || status === null) {
      toast.error(`Please select Accept/Reject for row ${i + 1}`);
      return false;
    }

    // ❌ Temperature Recorder Sr No
    if (!row.temperature_recorder_sr_no?.trim()) {
      toast.error(`Please enter Temperature Recorder Sr No for row ${i + 1}`);
      return false;
    }

    // ❌ Temperature Recorder Validity
    if (!row.temperature_recorder_validity?.trim()) {
      toast.error(`Please enter Temperature Recorder Validity for row ${i + 1}`);
      return false;
    }

    // ❌ Thermocouple LE No & Validity
    if (!row.thermocouple_le_no_validity?.trim()) {
      toast.error(`Please enter Thermocouple LE No & Validity for row ${i + 1}`);
      return false;
    }

    // ❌ Chart No
    if (!row.chart_no?.trim()) {
      toast.error(`Please enter Chart No for row ${i + 1}`);
      return false;
    }

    // ❌ Start Date
    if (!row.start_date) {
      toast.error(`Please select Start Date for row ${i + 1}`);
      return false;
    }

    // ❌ End Date
    if (!row.end_date) {
      toast.error(`Please select End Date for row ${i + 1}`);
      return false;
    }

    // ❌ Date logic
    // if (new Date(row.end_date) < new Date(row.start_date)) {
    //   toast.error(`End Date must be after Start Date (row ${i + 1})`);
    //   return false;
    // }
  }

  return true;
};
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const filterAndPaginate = (
    tableData,
    searchTerm,
    currentPage,
    limit,
    setTotalItems,
  ) => {
    let filteredData = tableData;
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
      (currentPage - 1) * limit + limit,
    );
  };

  const commentsData = useMemo(
    () =>
      filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
    [currentPage, search, limit, tableData],
  );

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
                name: "PWHT Clearance List",
                link: "/piping/user/pwht-clearance-management",
                active: false,
              },
              {
                name: `${data?._id ? "Edit" : "Add"} PWHT Clearance`,
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
                        <h4>PWHT Clearance Details</h4>
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
                          <label> PWHT Offer No.</label>
                          <input
                            type="text"
                            className="form-control"
                            value={
                              data?.status === 1
                                ? data?.report_no
                                : data?.report_no
                            }
                            readOnly
                          />
                        </div>
                      </div>
{/* {data?.status !== 2 && ( */}
{isViewOnly && (
                     <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> PWHT Report No.</label>
                          <input
                            type="text"
                            className="form-control"
                            value={
                              data?.status === 1
                                ? data?.report_no_two
                                : data?.report_no_two
                            }
                            readOnly
                          />
                        </div>
                      </div>
)}
                      {/* <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Test Date</label>
                          <input
                            type="date"
                            name="test_date"
                            className="form-control"
                            value={editFormData.test_date}
                            onChange={handleEditChange}
                            min={moment(data?.offer_date).format("YYYY-MM-DD")}
                             max={new Date().toISOString().split("T")[0]} 
                          />
                        </div>
                      </div> */}
{isViewOnly ? (
  <div className="col-12 col-md-4 col-xl-4">
    <div className="input-block local-forms custom-select-wpr">
      <label>Test Date</label>
      <input
        type="text"
        className="form-control"
        value={
          data?.test_date
            ? moment(data.test_date).format("DD-MM-YYYY")
            : "-"
        }
        readOnly
      />
    </div>
  </div>
) : (
  <div className="col-12 col-md-4 col-xl-4">
    <div className="input-block local-forms custom-select-wpr">
      <label>Test Date</label>
      <input
        type="date"
        name="test_date"
        className="form-control"
        value={editFormData.test_date}
        onChange={handleEditChange}
        min={moment(data?.offer_date).format("YYYY-MM-DD")}
        max={new Date().toISOString().split("T")[0]}
      />
      <div className="error">{error?.test_date_err}</div>
    </div>
    
  </div>
  
)}
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

                  <div className="table-responsive" style={{ minHeight: 0 }}>
                    <table className="table border-0 custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No</th>
                          <th>Spool No.</th>
                          <th>Joint No.</th>
                          <th>Size</th>
                          <th>Thickness</th>
                          <th>Piping Class </th>
                          <th>Piping Material Specification</th>
                          <th>Loading Temperature (Degree C / Hour)</th>
                          <th>Rate of Heating (Degree C / Hour) </th>
                          <th>Soaking Temperature (Degree C / Hour) </th>
                          <th>Soaking Period (Hour)</th>
                          <th>Rate of Cooling  (Degree C / Hour)</th>
                          <th>Unloading Temperature(Degree C / Hour) </th>
                          <th>No of Thermocouple </th>
                          <th>Temerature Recorder Sr No.</th>
                          <th>Temerature Recorder Validity</th>
                          <th>Thermocouple LE No & Validity</th>
                          <th>Starting Time & Date</th>
                          <th>Ending Time & Date</th>
                          <th>Chart No.</th>
                          <th>Remarks</th>
                          <th>Acc / Rej</th>
                         <th>Status</th>

                          <th>Action</th>
                        </tr>
                      </thead>

 <tbody>
  {commentsData.map((row, index) => {
     const tableIndex = (currentPage - 1) * limit + index;
    const isEditing = editRowIndex === index;

    return (
      <tr key={row.itemId}  onClick={() => {
    if (!isViewOnly) handleEditClick(index, row);
  }}>
        <td>{tableIndex + 1}</td>
        <td>{row.drawing_no}</td>
        <td>{row.spool_no}</td>
        <td>{row.joint_no}</td>
        <td>{row.size}</td>
        <td>{row.thickness}</td>
        <td>{row.piping_class}</td>
        <td>{row.material_spec}</td>

        <td>
          {isEditing && !isViewOnly ? (
            <input
              name="loadingTemp"
              className="form-control"
              value={editFormData.loadingTemp}
              onChange={handleEditChange}
            />
          ) : (
            row.loadingTemp
          )}
        </td>

        <td>
          {isEditing && !isViewOnly ? (
            <input
              name="rateofHeating"
              className="form-control"
              value={editFormData.rateofHeating}
              onChange={handleEditChange}
            />
          ) : (
            row.rateofHeating
          )}
        </td>

        <td>
          {isEditing && !isViewOnly ? (
            <input
              name="soakingTemp"
              className="form-control"
              value={editFormData.soakingTemp}
              onChange={handleEditChange}
            />
          ) : (
            row.soakingTemp
          )}
        </td>

           <td>
          {isEditing && !isViewOnly ? (
            <input
              name="soakingPeriod"
              className="form-control"
              value={editFormData.soakingPeriod}
              onChange={handleEditChange}
            />
          ) : (
            row.soakingPeriod
          )}
        </td>

<td>
          {isEditing && !isViewOnly ? (
            <input
              name="rateofCooling"
              className="form-control"
              value={editFormData.rateofCooling}
              onChange={handleEditChange}
            />
          ) : (
            row.rateofCooling
          )}
        </td>
<td>
          {isEditing && !isViewOnly ? (
            <input
              name="unloadingTemp"
              className="form-control"
              value={editFormData.unloadingTemp}
              onChange={handleEditChange}
            />
          ) : (
            row.unloadingTemp
          )}
        </td>
<td>
          {isEditing  && !isViewOnly ? (
            <input
              name="no_of_thermocouple"
              className="form-control"
              value={editFormData.no_of_thermocouple}
              onChange={handleEditChange}
            />
          ) : (
            row.no_of_thermocouple
          )}
        </td>
     <td>
          {isEditing && !isViewOnly ? (
            <input
              name="temperature_recorder_sr_no"
              className="form-control"
              value={editFormData.temperature_recorder_sr_no}
              onChange={handleEditChange}
            />
          ) : (
            row.temperature_recorder_sr_no
          )}
        </td>
     <td>
          {isEditing && !isViewOnly ? (
            <input
              name="temperature_recorder_validity"
              className="form-control"
              value={editFormData.temperature_recorder_validity}
              onChange={handleEditChange}
            />
          ) : (
            row.temperature_recorder_validity
          )}
        </td>
    <td>
          {isEditing && !isViewOnly ? (
            <input
              name="thermocouple_le_no_validity"
              className="form-control"
              value={editFormData.thermocouple_le_no_validity}
              onChange={handleEditChange}
            />
          ) : (
            row.thermocouple_le_no_validity
          )}
        </td>
    
      <td>       
          {isEditing && !isViewOnly ? (
        <input 
              type="datetime-local"
              name="start_date"
              className="form-control"
              value={editFormData.start_date}
              onChange={handleEditChange}
               />
         ) : (
              row.start_date
    ? moment(row.start_date).format("DD-MM-YYYY HH:mm")
    : "-"
         )}
        </td>
      <td>       
          {isEditing && !isViewOnly ? (
        <input 
              type="datetime-local"
              name="end_date"
              className="form-control"
              value={editFormData.end_date}
              onChange={handleEditChange} />
         ) : (
              row.end_date
    ? moment(row.end_date).format("DD-MM-YYYY HH:mm")
    : "-"
         )}
        </td>
     <td>
          {isEditing && !isViewOnly ? (
            <input
              name="chart_no"
              className="form-control"
              value={editFormData.chart_no}
              onChange={handleEditChange}
            />
          ) : (
            row.chart_no
          )}
        </td>
        <td>
          {isEditing && !isViewOnly ? (
            <textarea
              name="remarks"
              className="form-control"
              value={editFormData.remarks}
              onChange={handleEditChange}
            />
          ) : (
            row.remarks
          )}
        </td>
<td>
  {isEditing && !isViewOnly && (
    <div className="d-flex gap-2 justify-content-center">
 <span
  className={`present-table attent-status ${
    acceptRejectStatus[row.itemId] === true ? "selected" : ""
  }`}
  style={{ cursor: "pointer" }}
  onClick={(e) => {
    e.stopPropagation();
    handleAcceptRejectClick(row.itemId, true, row.spool_no);
  }}
>
  <Check />
</span>

<span
  className={`absent-table attent-status ${
    acceptRejectStatus[row.itemId] === false ? "selected" : ""
  }`}
  style={{ cursor: "pointer" }}
  onClick={(e) => {
    e.stopPropagation();
    handleAcceptRejectClick(row.itemId, false, row.spool_no);
  }}
>
  <X />
</span>


      
    </div>
  )}
</td>
{/* <td className="status-badge">
  {acceptRejectStatus[index] === true ? (
    <span className="custom-badge status-green">Acc</span>
  ) : acceptRejectStatus[index] === false ? (
    <span className="custom-badge status-pink">Rej</span>
  ) : (
    <span>-</span>
  )}
</td> */}
<td className="status-badge">
  {isViewOnly ? (
    // 👁 VIEW MODE → show backend value
    row.is_accepted === true ? (
      <span className="custom-badge status-green">Acc</span>
    ) : row.is_accepted === false ? (
      <span className="custom-badge status-pink">Rej</span>
    ) : (
      <span>-</span>
    )
  ) : (
    // ✏️ EDIT MODE → show temp accept/reject click state
    acceptRejectStatus[row.itemId] === true ? (
      <span className="custom-badge status-green">Acc</span>
    ) : acceptRejectStatus[row.itemId] === false ? (
      <span className="custom-badge status-pink">Rej</span>
    ) : (
      <span>-</span>
    )
  )}
</td>

        <td>
          {isEditing && !isViewOnly && (
            <>
              <button
                className="btn btn-success btn-sm mx-1"
                onClick={() => handleSaveClick(index)}
              >
                <Save />
              </button>
              <button
                className="btn btn-secondary btn-sm mx-1"
                onClick={handleCancelClick}
              >
                <X />
              </button>
            </>
          )}
        </td>
      </tr>
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
            link={"/piping/user/pwht-clearance-management"}
            buttonName={"Generate PWHT Report"}
            finalReq={data?.status !== 1 ? data?.items : []}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMultiPWHTClearance;
