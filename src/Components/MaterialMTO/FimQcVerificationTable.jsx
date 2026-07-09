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

 // initial state
const [editFormData, setEditFormData] = useState({
  received_weight: "",
  received_nos: "",
  rejected_weight: "",
  rejected_length: "",
  rejected_width: "",
  rejected_nos: "",
  remarks: "",
});

  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

  // Enable edit mode for row fields
  const handleEditClick = (index, row) => {
  setEditRowIndex(index);
  setEditFormData({
    received_weight: row.received_weight || "",
    received_nos: row.received_nos || "",
    rejected_weight: row.rejected_weight || "",
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
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
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
    const updated = [...tableData];
    updated[editRowIndex] = {
      ...updated[editRowIndex],
      ...editFormData,
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
                    <th>Section</th>
                    <th>Material Grade</th>
                    <th>Weight as per List</th>
                    <th>Nos as per List</th>
                    <th>Received Wt</th>
                    <th>Received Nos</th>
                    <th>Rejected Weight (Kg)</th>
                    <th>Rejected Length (MM)</th>
                    <th>Rejected Width (MM)</th>
                    <th>Rejected Nos</th>
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
                      <td>{row.material_grade || "-"}</td>
                      <td>{row.weight_as_per_list || "-"}</td>
                      <td>{row.numbers_as_per_list || "-"}</td>

                      {/* Editable fields */}
                      {editRowIndex === i ? (
                        <>
                          <td>
                            <input
                              type="number"
                              name="received_weight"
                              value={editFormData.received_weight}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="received_nos"
                              value={editFormData.received_nos}
                              onChange={handleEditFormChange}
                              className="form-control"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="rejected_weight"
                              value={editFormData.rejected_weight}
                              onChange={handleEditFormChange}
                              className="form-control"
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
                              name="rejected_nos"
                              value={editFormData.rejected_nos}
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
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.received_weight || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.received_nos || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.rejected_weight || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.rejected_length || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.rejected_width || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.rejected_nos || "-"}
                          </td>
                          <td onClick={() => handleEditClick(i, row)}>
                            {row.remarks || "-"}
                          </td>
                        </>
                      )}

                      {/* Accept / Reject */}
                      <td
                        onClick={() => handleAccRejClick(i)}
                        style={{ cursor: "pointer" }}
                      >
                          {editRowIndex === i ?  (
                          <div className="d-flex gap-2">
                            <span
                              className={`present-table attent-status ${
                                acceptRejectStatus[i] === true ? "selected" : ""
                              }`}
                              onClick={() =>
                                handleAcceptRejectSelect(i, true, row.item_id.name)
                              }
                            >
                              <Check />
                            </span>
                            <span
                              className={`absent-table attent-status ${
                                acceptRejectStatus[i] === false ? "selected" : ""
                              }`}
                              onClick={() =>
                                handleAcceptRejectSelect(i, false, row.item_id.name)
                              }
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

                      {/* Action */}
                      <td>
                        {editRowIndex === i ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success p-1 mx-1"
                              onClick={handleSaveClick}
                            >
                              <Save />
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary p-1 mx-1"
                              onClick={handleCancelClick}
                            >
                              <X />
                            </button>
                          </>
                        ) : (
                          <>
                          <button
                             className="action-icon mx-1"
                            onClick={() => handleEditClick(i, row)}
                          >
                          <Pencil />
                          </button>
                          
                          <button  className="action-icon mx-1" >
                            <Trash />
                          </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination (optional, not implemented here) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FimQcVerificationTable;
