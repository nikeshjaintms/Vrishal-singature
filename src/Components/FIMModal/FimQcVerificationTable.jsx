import { Check, Pencil, Save, Trash, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const FimQcVerificationTable = ({
  commentsData, // reserved for future use
  tableData,
  setTableData,
  limit,
  setLimit,
  setSearch,
  setCurrentPage,
  currentPage,
  totalItems,
}) => {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editAccRejIndex, setEditAccRejIndex] = useState(null);

  const [editFormData, setEditFormData] = useState({
    received_weight: "",
    received_nos: "",
    inspect_weight: "",
    rejected_weight: "",
    rejected_length: "",
    rejected_width: "",
    rejected_nos: "",
    remarks: "",
    material_grade: "",
    size: "",
    thickness: "",
    manufacture: "",
    inspect_details: [
      {
        inspect_nos: "",
        inspect_length: "",
        inspect_width: "",
        tc_no: "",
        heat_no: "",
      },
    ],
  });

  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

  // Enable edit mode for row fields
  const handleEditClick = (index, row) => {
    setEditRowIndex(index);

    // Prepare inspect_details from existing data
    let details = [];
    if (row.tc_heat_details && Array.isArray(row.tc_heat_details) && row.tc_heat_details.length > 0) {
      details = row.tc_heat_details.map((d, idx) => ({
        inspect_nos: idx === 0 ? (row.inspected_nos || row.inspect_nos || "") : "",
        inspect_length: idx === 0 ? (row.inspected_length || row.inspect_length || "") : "",
        inspect_width: idx === 0 ? (row.inspected_width || row.inspect_width || "") : "",
        tc_no: d.tc_no || "",
        heat_no: d.heat_no || "",
      }));
    } else {
      // Fallback for flat data or empty
      details = [
        {
          inspect_nos: row.inspected_nos || row.inspect_nos || "",
          inspect_length: row.inspected_length || row.inspect_length || "",
          inspect_width: row.inspected_width || row.inspect_width || "",
          tc_no: row.tc_no || "",
          heat_no: row.heat_no || "",
        },
      ];
    }

    const receivedWeight = Number(row.received_weight) || 0;
    const inspectedWeight = Number(row.inspected_weight || row.inspect_weight) || 0;
    const rejectedWeight = receivedWeight - inspectedWeight;

    setEditFormData({
      size: row.size || "",
      thickness: row.thickness || "",
      material_grade: row.item_id?.material_grade || "",
      manufacture: row.manufacture || "",
      inspect_details: details,
      inspect_weight: inspectedWeight || "",
      received_weight: receivedWeight || "",
      received_nos: row.received_nos || "",
      rejected_weight: rejectedWeight > 0 ? rejectedWeight : 0,
      rejected_length: row.rejected_length || "",
      rejected_width: row.rejected_width || "",
      rejected_nos: row.rejected_nos || "",
      remarks: row.remarks || "",
    });
  };

  // Enable Accept/Reject selection for row
  const handleAccRejClick = (index) => {
    setEditAccRejIndex(index);
  };

  // Form input change handler
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "inspect_weight") {
      const receivedWeight = Number(editFormData.received_weight) || 0;
      const inspectedWeight = Number(value) || 0;
      const rejectedWeight = receivedWeight - inspectedWeight;

      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
        rejected_weight: rejectedWeight > 0 ? rejectedWeight : 0
      }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotals = (details) => {
    const totalInspectNos = details.reduce((sum, d) => sum + (Number(d.inspect_nos) || 0), 0);
    const receivedNos = Number(editFormData.received_nos) || 0;

    setEditFormData(prev => ({
      ...prev,
      inspect_details: details,
      rejected_nos: totalInspectNos > 0 ? receivedNos - totalInspectNos : receivedNos
    }));
  };

  const handleInspectDetailChange = (index, field, value) => {
    const updatedDetails = [...editFormData.inspect_details];
    updatedDetails[index][field] = value;

    if (field === "inspect_nos") {
      calculateTotals(updatedDetails);
    } else {
      setEditFormData((prev) => ({ ...prev, inspect_details: updatedDetails }));
    }
  };

  const handleAddInspectDetail = () => {
    setEditFormData((prev) => ({
      ...prev,
      inspect_details: [
        ...prev.inspect_details,
        {
          inspect_nos: "",
          inspect_length: "",
          inspect_width: "",
          tc_no: "",
          heat_no: "",
        },
      ],
    }));
  };

  const handleRemoveInspectDetail = (index) => {
    if (editFormData.inspect_details.length > 1) {
      const updatedDetails = editFormData.inspect_details.filter((_, i) => i !== index);
      calculateTotals(updatedDetails);
    }
  };

  // Cancel edit mode
  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  // Accept/Reject handler
  const handleAcceptRejectSelect = (index, isAccepted, name) => {
    Swal.fire({
      title: isAccepted ? `Accept ${name}?` : `Reject ${name}?`,
      text: "Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAcceptRejectStatus((prev) => ({
          ...prev,
          [index]: isAccepted,
        }));
        setEditAccRejIndex(null); // hide icons after selection
        toast.success(`${name} ${isAccepted ? "accepted" : "rejected"}.`);
      }
    });
  };

  // Save row updates
  const handleSaveClick = () => {
    if (acceptRejectStatus[editRowIndex] === undefined) {
      toast.error("Please select Accept or Reject before saving.");
      return;
    }

    if (editFormData.manufacture.trim() === "") {
      toast.error("Please fill Manufacture before saving.");
      return;
    }

    const hasEmpty = editFormData.inspect_details.some(
      (d) => d.tc_no.trim() === "" || d.heat_no.trim() === ""
    );
    if (hasEmpty) {
      toast.error("Please fill all TC No and Heat No entries.");
      return;
    }

    // Totals for aggregate fields
    const totalInspectWeight = Number(editFormData.inspect_weight) || 0;
    const totalInspectNos = editFormData.inspect_details.reduce((sum, d) => sum + (Number(d.inspect_nos) || 0), 0);

    const updated = [...tableData];
    updated[editRowIndex] = {
      ...updated[editRowIndex],
      ...editFormData,
      tc_heat_details: editFormData.inspect_details.map(d => ({
        tc_no: d.tc_no,
        heat_no: d.heat_no,
        inspect_nos: d.inspect_nos,
        inspect_length: d.inspect_length,
        inspect_width: d.inspect_width
      })),
      // Flat arrays for display and legacy backend compatibility
      heat_no: editFormData.inspect_details.map(d => d.heat_no).filter(v => v),
      tc_no: editFormData.inspect_details.map(d => d.tc_no).filter(v => v),

      inspect_nos: totalInspectNos,
      inspected_nos: totalInspectNos,
      inspected_weight: totalInspectWeight,
      // For width/length, we store the first one or a comma-separated string if preferred. 
      // Most logic uses the first one if flat.
      inspect_length: editFormData.inspect_details[0]?.inspect_length || "",
      inspect_width: editFormData.inspect_details[0]?.inspect_width || "",
      inspected_length: editFormData.inspect_details[0]?.inspect_length || "",
      inspected_width: editFormData.inspect_details[0]?.inspect_width || "",

      qc_status: acceptRejectStatus[editRowIndex],
    };

    setTableData(updated);
    setEditRowIndex(null);
    toast.success("QC record updated.");
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="col-12">
              <div className="form-heading">
                <h4>Packing Item Details</h4>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-striped custom-table comman-table mb-0">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Item</th>
                    <th>Material Grade</th>
                    <th>Make/Manufacture</th>
                    <th>UOM</th>
                    <th>Received Weight (Kg)</th>
                    <th>Inspect Weight.</th>
                    <th>Received Nos.</th>
                    <th>Inspect Nos.</th>
                    <th>Inspect Length.</th>
                    <th>Inspect Width.</th>
                    <th>Heat No./ lot No.</th>
                    <th>TC No.</th>
                    <th>Rejected Nos.</th>
                    <th>Rejected Weight (Kg)</th>
                    <th>Rejected Length</th>
                    <th>Rejected Width</th>
                    <th>Remarks</th>
                    <th>Acc/Rej</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((row, i) => (
                    <tr key={i}>
                      <td>{i + 1 + (currentPage - 1) * limit}</td>
                      <td>{row.item_id.name || "-"}</td>

                      {editRowIndex === i ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="material_grade"
                              value={editFormData.material_grade}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="manufacture"
                              value={editFormData.manufacture}
                              onChange={handleEditFormChange}
                              className="form-control"
                              required
                            />
                          </td>
                          <td>{row.item_id.unit.name || "-"}</td>
                          {/* <td>
                            <input
                              type="number"
                              name="weight_as_per_list"
                              value={editFormData.weight_as_per_list}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td> */}
                          {/* <td>
                            <input
                              type="number"
                              name="numbers_as_per_list"
                              value={editFormData.numbers_as_per_list}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td> */}
                          <td>
                            <input
                              type="number"
                              name="received_weight"
                              value={editFormData.received_weight}
                              onChange={handleEditFormChange}
                              className="form-control"
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="inspect_weight"
                              value={editFormData.inspect_weight}
                              onChange={handleEditFormChange}
                              className="form-control"
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="received_nos"
                              value={editFormData.received_nos}
                              onChange={handleEditFormChange}
                              className="form-control"
                              readOnly
                            />
                          </td>
                          <td colSpan={5}>
                            {editFormData.inspect_details.map((detail, idx) => (
                              <div key={idx} className="d-flex gap-2 align-items-center mb-1">
                                <input
                                  type="number"
                                  placeholder="Nos"
                                  value={detail.inspect_nos}
                                  onChange={(e) => handleInspectDetailChange(idx, "inspect_nos", e.target.value)}
                                  className="form-control"
                                  style={{ minWidth: "70px" }}
                                />
                                <input
                                  type="number"
                                  placeholder="Len"
                                  value={detail.inspect_length}
                                  onChange={(e) => handleInspectDetailChange(idx, "inspect_length", e.target.value)}
                                  className="form-control"
                                  style={{ minWidth: "70px" }}
                                />
                                <input
                                  type="number"
                                  placeholder="Wid"
                                  value={detail.inspect_width}
                                  onChange={(e) => handleInspectDetailChange(idx, "inspect_width", e.target.value)}
                                  className="form-control"
                                  style={{ minWidth: "70px" }}
                                />
                                <input
                                  type="text"
                                  placeholder="Heat No"
                                  value={detail.heat_no}
                                  onChange={(e) => handleInspectDetailChange(idx, "heat_no", e.target.value)}
                                  className="form-control"
                                />
                                <input
                                  type="text"
                                  placeholder="TC No"
                                  value={detail.tc_no}
                                  onChange={(e) => handleInspectDetailChange(idx, "tc_no", e.target.value)}
                                  className="form-control"
                                />
                                {idx === 0 ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAddInspectDetail}
                                  >
                                    +
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveInspectDetail(idx)}
                                  >
                                    -
                                  </button>
                                )}
                              </div>
                            ))}
                          </td>
                          <td>
                            <input
                              type="number"
                              name="rejected_nos"
                              value={editFormData.rejected_nos}
                              className="form-control"
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="rejected_weight"
                              value={editFormData.rejected_weight}
                              onChange={handleEditFormChange}
                              className="form-control"
                              readOnly
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="rejected_length"
                              value={editFormData.rejected_length}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="rejected_width"
                              value={editFormData.rejected_width}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="remarks"
                              value={editFormData.remarks}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td onClick={() => handleEditClick(i, row)}>{row.item_id.material_grade || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.manufacture || "-"}</td>
                          {/* <td onClick={() => handleEditClick(i, row)}>{row.supplier || "-"}</td> */}
                          <td onClick={() => handleEditClick(i, row)}>{row.item_id.unit.name || "-"}</td>
                          {/* <td onClick={() => handleEditClick(i, row)}>{row.weight_as_per_list || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.numbers_as_per_list || "-"}</td> */}
                          <td onClick={() => handleEditClick(i, row)}>{row.received_weight || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.inspected_weight || row.inspect_weight || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.received_nos || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.tc_heat_details?.map(d => d.inspect_nos).join(", ") || row.inspected_nos || row.inspect_nos || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.tc_heat_details?.map(d => d.inspect_length).join(", ") || row.inspected_length || row.inspect_length || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.tc_heat_details?.map(d => d.inspect_width).join(", ") || row.inspected_width || row.inspect_width || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.tc_heat_details?.map(d => d.heat_no).join(", ") || (Array.isArray(row.heat_no) ? row.heat_no.join(", ") : row.heat_no) || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.tc_heat_details?.map(d => d.tc_no).join(", ") || (Array.isArray(row.tc_no) ? row.tc_no.join(", ") : row.tc_no) || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>{row.rejected_nos || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.rejected_weight || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.rejected_length || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.rejected_width || "-"}</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.remarks || "-"}</td>
                        </>
                      )}

                      {/* Accept / Reject column */}
                      <td onClick={() => handleAccRejClick(i)} style={{ cursor: "pointer" }}>
                        {editRowIndex === i ? (
                          <div className="d-flex gap-2">
                            <span
                              className={`present-table attent-status ${acceptRejectStatus[i] === true ? "selected" : ""}`}
                              onClick={() => handleAcceptRejectSelect(i, true, row.item_id.name)}
                            >
                              <Check />
                            </span>
                            <span
                              className={`absent-table attent-status ${acceptRejectStatus[i] === false ? "selected" : ""}`}
                              onClick={() => handleAcceptRejectSelect(i, false, row.item_id.name)}
                            >
                              <X />
                            </span>
                          </div>
                        ) : acceptRejectStatus[i] !== undefined ? (
                          acceptRejectStatus[i] ? "Accepted" : "Rejected"
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        {acceptRejectStatus[i] === true ? (
                          <span className="custom-badge status-green">Acc</span>
                        ) : acceptRejectStatus[i] === false ? (
                          <span className="custom-badge status-pink">Rej</span>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td>
                        {editRowIndex === i ? (
                          <>
                            <button type="button" className="btn btn-success p-1 mx-1" onClick={handleSaveClick}>
                              <Save />
                            </button>
                            <button type="button" className="btn btn-secondary p-1 mx-1" onClick={handleCancelClick}>
                              <X />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="action-icon mx-1" onClick={() => handleEditClick(i, row)}>
                              <Pencil />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FimQcVerificationTable;
