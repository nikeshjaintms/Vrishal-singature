import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { M_CON, PLAN, QC, V_URL } from "../../BaseUrl";
import DownloadFormat from "../DownloadFormat/DownloadFormat";
 
const FimSectionTable = ({
  transactionData,
  handleSave,
  handleDelete,
  handleEdit,
  finalId,
  dataId,
  fetchTransactionData,
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div className="form-heading">
            <h4>FIM Item List</h4>
          </div>
          {localStorage.getItem("ERP_ROLE") === M_CON && (finalId || dataId) && (
            <div className="add-group">
              <div>
                <DownloadFormat
                  url={`${V_URL}/user/fim/download-fim-format`}
                  fileName={"Fim-item"}
                />
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary add-pluss ms-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Add FIM Item"
              >
                <img src="/assets/img/icons/plus.svg" alt="add-icon" />
              </button>
            </div>
          )}
        </div>
 
        {transactionData?.length > 0 ? (
          <div className="table-responsive">
            <table className="table border-0 mb-0 custom-table table-striped comman-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Section Details</th>
                  <th>Material Grade</th>
                  <th>Weight as per Packing List (Kg)</th>
                  <th>Numbers as per Packing List</th>
                  <th>Received Weight (Kg)</th>
                  <th>Received Length (MM)</th>
                  <th>Received Width (MM)</th>
                  <th>Received Nos</th>
                  {localStorage.getItem("ERP_ROLE") === QC && (
                    <>
                      <th>Rejected Weight (Kg)</th>
                      <th>Rejected Length (MM)</th>
                      <th>Rejected Width (MM)</th>
                      <th>Rejected Nos</th>
                    </>
                  )}
                  {localStorage.getItem("ERP_ROLE") === QC && (
                  <th>Remarks</th>
                  )}
                  {(localStorage.getItem("ERP_ROLE") === M_CON || localStorage.getItem("ERP_ROLE") === QC) && (
                    <th className="text-end">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {transactionData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.item_id?.name || "-"}</td>
                    <td>{item.item_id?.material_grade || "-"}</td>
                    <td>{item.weight_as_per_list || "-"}</td>
                    <td>{item.numbers_as_per_list || "-"}</td>
                    <td>{item.received_weight || "-"}</td>
                    <td>{item.received_length || "-"}</td>
                    <td>{item.received_width || "-"}</td>
                    <td>{item.received_nos || "-"}</td>
                     {localStorage.getItem("ERP_ROLE") === QC && (
                      <>
                        <td>{item.rejected_weight || "0"}</td>
                        <td>{item.rejected_length || "0"}</td>
                        <td>{item.rejected_width || "0"}</td>
                        <td>{item.rejected_nos || "0"}</td>
                        <td>{item.remarks || "0"}</td>
                      </>
                    )}    
                    {localStorage.getItem("ERP_ROLE") === M_CON && (
                      <td className="d-flex justify-content-end">
                        <a
                          className="action-icon mx-1"
                          style={{ cursor: "pointer" }}
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil />
                        </a>
                        <a
                          className="action-icon mx-1"
                          style={{ cursor: "pointer" }}
                          title="Delete"
                          onClick={() =>
                            handleDelete(item?._id, item.item_id?.name)
                          }
                        >
                          <Trash2 />
                        </a>
                      </td>
                    )}
                    {localStorage.getItem("ERP_ROLE") === QC &&(
                      <td>
                       
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            No FIM items found. You can add new items by clicking the{" "}
            <strong>plus (+)</strong> button.
          </p>
        )}
      </div>
    </div>
  );
};
 
export default FimSectionTable;