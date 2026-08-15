
import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { M_CON, PLAN, QC, V_URL } from "../../../BaseUrl";
import DownloadFormat from "../DrawingModal/DownloadFormat/DownloadFormat";

const FimSectionTable = ({
  transactionData,
  handleSave,
  handleDelete,
  handleEdit,
  finalId,
  dataId,
  fetchTransactionData,
}) => {
  console.log("Rendering FimSectionTable with data:", transactionData);
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
                  url={`${V_URL}/user/download-fim-format`}
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
                  <th>Item Category</th>
                  <th>Item</th>
                  <th>Item Description</th>
                  <th>Size 1</th>
                  <th>Thickness 1</th>
                  <th>Size 2</th>
                  <th>Thickness 2</th>
                  <th>Material Grade</th>
                  <th>Piping Material Specification</th>
                  <th>UOM</th>
                  <th>FIM List Qty</th>
                  <th>Received Qty (Kg)</th>
                  <th>HSN / SAC</th>
                  <th>Rate</th>
                  <th>GST</th>
                  <th>Total Amount</th>
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
                    <td>{item.item_category_id?.name || "-"}</td>
                    <td>{item.item_id?.item_name || "-"}</td>
                    <td>{item.item_id?.item_description || "-"}</td>
                    <td>{item.item_id?.size1?.name || "0"}</td>
                    <td>{item.item_id?.thickness1?.name || "0"}</td>
                    <td>{item.item_id?.size2?.name || "0"}</td>
                    <td>{item.item_id?.thickness2?.name || "0"}</td>
                    <td>{item.item_id?.material_grade || "0"}</td>
                    <td>{item.piping_material_specification?.name || "0"}</td>
                    <td>{item.item_id?.uom?.name || "0"}</td>
                    <td>{item.fim_list_qty || "-"}</td>
                    <td>{item.received_qty || "-"}</td>
                    <td>{item.hsn_sac || "0"}</td>
                    <td>{item.rate || "0"}</td>
                    <td>{item.gst || "0"}% </td>
                    <td>{item.total_amount || "0"}</td>
                    {localStorage.getItem("ERP_ROLE") === M_CON && (
                      <td className="d-flex justify-content-end">
                        <a className="action-icon mx-1" style={{ cursor: "pointer" }}
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
                            handleDelete(item?._id, item.item_id?.item_name)
                          }
                        >
                          <Trash2 />
                        </a>
                      </td>
                    )}
                    {localStorage.getItem("ERP_ROLE") === QC && (
                      <td>
                        <td>{item.remarks || "0"}</td>
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
