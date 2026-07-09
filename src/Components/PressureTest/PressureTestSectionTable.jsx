import React, { useState } from "react";
import { Check, X, Save } from "lucide-react";
import DownloadFormat from "../DownloadFormat/DownloadFormat";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const PressureTestSectionTable = ({ preTestChecks = [], setPreTestChecks }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [tempStatus, setTempStatus] = useState({});
  const [tempRemark, setTempRemark] = useState("");
  //   const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
  // ✅ Accept / Reject with confirmation
  // const handleAcceptRejectClick = (index, isAccepted) => {
  //   Swal.fire({
  //     title: isAccepted ? "Accept this row?" : "Reject this row?",
  //     text: "Are you sure you want to proceed?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Confirm",
  //     cancelButtonText: "Cancel",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setTempStatus({ [index]: isAccepted }); // ✅ FIXED HERE

  //       toast.success(
  //         `Row ${index + 1} ${isAccepted ? "Accepted" : "Rejected"}`,
  //       );
  //     }
  //   });
  // };
const handleAcceptRejectClick = (index, status) => {
  let title = "";

  if (status === 1) title = "Accept this row?";
  else if (status === 2) title = "Reject this row?";
  else if (status === 3) title = "Mark as Not Applicable?";

  Swal.fire({
    title,
    text: "Are you sure you want to proceed?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      setTempStatus({ [index]: status });

      const label =
        status === 1
          ? "Accepted"
          : status === 2
          ? "Rejected"
          : "Marked as Not Applicable";

      toast.success(`Row ${index + 1} ${label}`);
    }
  });
};
  // ✅ Save row
  const handleSave = (index) => {
    if (tempStatus[index] === undefined) {
      toast.error("Please select Accept or Reject");
      return;
    }

    const updated = [...preTestChecks];

    updated[index] = {
      ...updated[index],
      is_accepted: tempStatus[index],
      qc_remarks: tempRemark,
    };

    setPreTestChecks(updated);
    setEditIndex(null);
  };
  const handleClose = (e) => {
    e.stopPropagation();
    setEditIndex(null);
  };
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h4>Pre Test Check</h4>
          {/* <DownloadFormat fileName={"Fim-item"} /> */}
        </div>

        <div className="table-responsive">
          <table className="table border-0 mb-0 custom-table table-striped comman-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Description</th>
                <th>Acc/Rej</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {preTestChecks.map((row, index) => {
                const isEditing = editIndex === index;

                return (
                  <tr
                    key={index}
                    onClick={() => {
                      setEditIndex(index);
                      setTempStatus({ [index]: row.is_accepted });
                      setTempRemark(row.qc_remarks || "");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{row.description}</td>

                    {/* ACCEPT / REJECT */}
                    <td>
                      {isEditing ? (
                        <div className="d-flex gap-2">
                          <span
                            className={`present-table attent-status ${
                              tempStatus[index] === 1 ? "selected" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptRejectClick(index, 1);
                            }}
                          >
                            <Check />
                          </span>

                          <span
                            className={`absent-table attent-status ${
                              tempStatus[index] === 2 ? "selected" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptRejectClick(index, 2);
                            }}
                          >
                            <X />
                          </span>
                            <span
    className={`na-table attent-status ${
      tempStatus[index] === 3 ? "selected" : ""
    }`}
    onClick={(e) => {
      e.stopPropagation();
      handleAcceptRejectClick(index, 3);
    }}
  >
    NA
  </span>
                        </div>
                      ) : row.is_accepted === 1 ? (
                        <span className="badge bg-success">Accepted</span>
                      ) : row.is_accepted === 2 ? (
                        <span className="badge bg-danger">Rejected</span>
                      ) : row.is_accepted === 3 ? (
                        <span className="badge bg-warning">Not Applicable</span>
                      ) : (
                        <span className="badge bg-secondary">Pending</span>
                      )}
                    </td>

                    {/* REMARKS */}
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control"
                          value={tempRemark}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setTempRemark(e.target.value)}
                        />
                      ) : (
                        row.qc_remarks || "-"
                      )}
                    </td>

                    {/* SAVE */}
           

                    {isEditing ? (
                      <td>
                        <button
                          type="button"
                          className="btn btn-success p-1 mx-1"
                          onClick={(e) => {
                              e.stopPropagation();
                              handleSave(index);
                            }}
                        >
                          <Save />
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary p-1 mx-1"
                         onClick={handleClose}
                        >
                          <X />
                        </button>
                      </td>
                    )
                : (
<><td></td></>
                )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PressureTestSectionTable;
