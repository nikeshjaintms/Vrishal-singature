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
  const [heatRows, setHeatRows] = useState({}); // per-row heat rows

  const [editFormData, setEditFormData] = useState({
    make_manufacture: [], // Array of strings
    acceptedQty: "",
    rejectedQty: "",
    remarks: "",
  });

  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

  // Enable edit mode for row fields
  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData(row);
    // Initialize heat rows for this row with 5 fields using camelCase for quantities
    setHeatRows({
      ...heatRows,
      [index]: row.heat_rows?.length > 0 ? row.heat_rows : [{
        make_manufacture: row.make_manufacture?.[0] || "",
        heat_lot_no: "",
        tc_no: "",
        acceptedQty: row.acceptedQty || "",
        rejectedQty: row.rejectedQty || ""
      }],
    });
  };

  const handleAccRejClick = (index) => {
    setEditAccRejIndex(index);
  };

  // const handleEditFormChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditFormData({
  //     ...editFormData,
  //     [name]: value,
  //   });
  // };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    let updatedFormData = {
      ...editFormData,
      [name]: value,
    };

    // Auto-calc rejectedQty when acceptedQty is edited (for non-dynamic fields like remarks if any)
    if (name === "acceptedQty") {
      const received = Number(editFormData.received_qty || 0);
      const accepted = Number(value || 0);

      updatedFormData.rejectedQty = received - accepted;
    }

    setEditFormData(updatedFormData);
  };


  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

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
        setEditAccRejIndex(null);
        toast.success(`${name} ${isAccepted ? "accepted" : "rejected"}.`);
      }
    });
  };

  // Save row updates
  const handleSaveClick = () => {
    const updated = [...tableData];
    const currentRowHeatRows = heatRows[editRowIndex] || [];

    // Calculate totals
    const totalAccepted = currentRowHeatRows.reduce((sum, hr) => sum + Number(hr.acceptedQty || 0), 0);
    const totalRejected = currentRowHeatRows.reduce((sum, hr) => sum + Number(hr.rejectedQty || 0), 0);
    // make_manufacture is an array in the model
    const makesArray = currentRowHeatRows.map(hr => hr.make_manufacture).filter(m => m);

    updated[editRowIndex] = {
      ...updated[editRowIndex],
      ...editFormData,
      make_manufacture: makesArray,
      acceptedQty: totalAccepted,
      rejectedQty: totalRejected,
      qcStatus: acceptRejectStatus[editRowIndex] ? 2 : 3, // 2: Approved, 3: Rejected
      heat_rows: currentRowHeatRows,
    };
    setTableData(updated);
    setEditRowIndex(null);
    toast.success("QC record updated.");
  };

  // Heat row handlers
  const handleHeatRowChange = (rowIndex, heatIndex, e) => {
    const { name, value } = e.target;
    const rowHeatRows = heatRows[rowIndex] || [];
    const newRows = [...rowHeatRows];

    newRows[heatIndex][name] = value;

    // Optional: Auto-calc rejected_qty if accepted_qty changes in a multi-row context?
    // This might be tricky because we don't know the "received qty" for THIS specific lot unless provided.
    // Assuming received_qty is for the whole row. For now, let's keep them manual or just handle simple math if possible.

    setHeatRows({ ...heatRows, [rowIndex]: newRows });
  };

  const addHeatRow = (rowIndex) => {
    const rowHeatRows = heatRows[rowIndex] || [];
    const newRow = {
      make_manufacture: "",
      heat_lot_no: "",
      tc_no: "",
      acceptedQty: "",
      rejectedQty: ""
    };
    setHeatRows({ ...heatRows, [rowIndex]: [...rowHeatRows, newRow] });
  };

  const removeHeatRow = (rowIndex, heatIndex) => {
    const rowHeatRows = [...(heatRows[rowIndex] || [])];
    rowHeatRows.splice(heatIndex, 1);
    setHeatRows({ ...heatRows, [rowIndex]: rowHeatRows });
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
                    <th>Item Category</th>
                    <th>Item</th>
                    <th>Item Description</th>
                    <th>Size 1</th>
                    <th>Thickness 1</th>
                    <th>Size 2</th>
                    <th>Thickness 2</th>
                    <th>Piping Material Specification</th>
                    <th>Material Grade</th>
                    <th>UOM</th>
                    <th>Receive Qty</th>
                    <th>Make/Manufacture</th>
                    <th>Heat No./ lot No.</th>
                    <th>TC No.</th>
                    <th>Accepted Qty.</th>
                    <th>Rejected Qty.</th>
                    <th></th>
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
                      <td>{row.item_category_details?.name ?? "-"}</td>
                      <td>{row.item_details?.item_name || "-"}</td>
                      <td>{row.item_details?.item_description || "-"}</td>
                      <td>{row.item_details?.size1_details?.[0]?.name || row.size1 || "-"}</td>
                      <td>{row.item_details?.thickness1_details?.[0]?.name || row.thickness1 || "-"}</td>
                      <td>{row.item_details?.size2_details?.[0]?.name || row.size2 || "-"}</td>
                      <td>{row.item_details?.thickness2_details?.[0]?.name || row.thickness2 || "-"}</td>
                      <td>{row.piping_material_specification_details?.name || row.piping_material_specification || "-"}</td>
                      <td>{row.item_details?.material_grade || "-"}</td>

                      <td>{row.uom || "-"}</td>
                      <td>{row.received_qty || "-"}</td>

                      {editRowIndex === i ? (
                        <>
                          <td colSpan={6}>
                            {(heatRows[i] || []).map((hr, index) => (
                              <div key={index} className="d-flex align-items-center gap-2 mb-1">
                                <input
                                  type="text"
                                  name="make_manufacture"
                                  placeholder="Make"
                                  value={hr.make_manufacture}
                                  onChange={(e) => handleHeatRowChange(i, index, e)}
                                  className="form-control"
                                  style={{ width: "120px", minWidth: "120px" }}
                                />
                                <input
                                  type="text"
                                  name="heat_lot_no"
                                  placeholder="Heat No"
                                  value={hr.heat_lot_no}
                                  onChange={(e) => handleHeatRowChange(i, index, e)}
                                  className="form-control"
                                  style={{ width: "120px", minWidth: "120px" }}
                                />
                                <input
                                  type="text"
                                  name="tc_no"
                                  placeholder="TC No"
                                  value={hr.tc_no}
                                  onChange={(e) => handleHeatRowChange(i, index, e)}
                                  className="form-control"
                                  style={{ width: "120px", minWidth: "120px" }}
                                />
                                <input
                                  type="number"
                                  name="acceptedQty"
                                  placeholder="Acc"
                                  value={hr.acceptedQty}
                                  onChange={(e) => handleHeatRowChange(i, index, e)}
                                  className="form-control"
                                  style={{ width: "80px", minWidth: "80px" }}
                                />
                                <input
                                  type="number"
                                  name="rejectedQty"
                                  placeholder="Rej"
                                  value={hr.rejectedQty}
                                  onChange={(e) => handleHeatRowChange(i, index, e)}
                                  className="form-control"
                                  style={{ width: "80px", minWidth: "80px" }}
                                />
                                {index === 0 ? (
                                  <button type="button" className="btn btn-sm btn-primary" onClick={() => addHeatRow(i)}>+</button>
                                ) : (
                                  <button type="button" className="btn btn-sm btn-danger p-1" onClick={() => removeHeatRow(i, index)}><Trash size={14} /></button>
                                )}
                              </div>
                            ))}
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
                          <td onClick={() => handleEditClick(i, row)}>
                            {Array.isArray(row.make_manufacture)
                              ? row.make_manufacture.join(", ")
                              : row.make_manufacture || "-"}
                          </td>

                          <td>
                            {row.heat_rows?.map((h) => h.heat_lot_no).filter(x => x).join(", ") || "-"}
                          </td>
                          <td>
                            {row.heat_rows?.map((h) => h.tc_no).filter(x => x).join(", ") || "-"}
                          </td>

                          <td onClick={() => handleEditClick(i, row)}>
                            {row.heat_rows?.length > 0
                              ? row.heat_rows.reduce((sum, h) => sum + Number(h.acceptedQty || 0), 0)
                              : row.acceptedQty || "0"}
                          </td>

                          <td onClick={() => handleEditClick(i, row)}>
                            {row.heat_rows?.length > 0
                              ? row.heat_rows.reduce((sum, h) => sum + Number(h.rejectedQty || 0), 0)
                              : row.rejectedQty || "0"}
                          </td>

                          <td>-</td>
                          <td onClick={() => handleEditClick(i, row)}>{row.remarks || "-"}</td>
                        </>
                      )}

                      <td onClick={() => handleAccRejClick(i)} style={{ cursor: "pointer" }}>
                        {editRowIndex === i ? (
                          <div className="d-flex gap-2">
                            <span
                              className={`present-table attent-status ${acceptRejectStatus[i] === true ? "selected" : ""}`}
                              onClick={() => handleAcceptRejectSelect(i, true, row.item_details?.item_name || "")}
                            >
                              <Check />
                            </span>
                            <span
                              className={`absent-table attent-status ${acceptRejectStatus[i] === false ? "selected" : ""}`}
                              onClick={() => handleAcceptRejectSelect(i, false, row.item_details?.item_name || "")}
                            >
                              <X />
                            </span>
                          </div>
                        ) : row.qcStatus === 2 ? (
                          "Accepted"
                        ) : row.qcStatus === 3 ? (
                          "Rejected"
                        ) : acceptRejectStatus[i] !== undefined ? (
                          acceptRejectStatus[i] ? "Accepted" : "Rejected"
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {row.qcStatus === 2 || acceptRejectStatus[i] === true ? (
                          <span className="custom-badge status-green">Acc</span>
                        ) : row.qcStatus === 3 || acceptRejectStatus[i] === false ? (
                          <span className="custom-badge status-pink">Rej</span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>
                        {editRowIndex === i ? (
                          <>
                            <button type="button" className="btn btn-success p-1 mx-1" onClick={handleSaveClick}><Save /></button>
                          </>
                        ) : (
                          <>
                            <button className="action-icon mx-1" onClick={() => handleEditClick(i, row)}><Pencil /></button>
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
    </div >
  );
};

export default FimQcVerificationTable;
