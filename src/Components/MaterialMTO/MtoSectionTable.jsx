import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const MtoSectionTable = ({
  transactionData,
  handleSave,
  handleDelete,
  handleEdit,
  handleView,
  finalId,
  dataId,
}) => {
  console.log("MTO Data in Table:", transactionData); // Debugging line
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div className="form-heading">
            <h4>MTO List</h4>
          </div>

          {(finalId || dataId) && (
            <div className="add-group">
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary add-pluss ms-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Add MTO"
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
                  {/* <th>Entry Date</th> */}
                  <th>Item </th>
                  <th>Material Grade</th>
                  <th>UOM</th>
                  <th>FAB Drawing Qty</th>
                  <th>GAD Client Qty</th>
                  <th>Continegancy</th>
                  <th>Material Requirement</th>
                  <th>Usable Stock</th>
                  <th>Order Qty</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactionData?.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    {/* <td>{item.entryDate ? new Date(item.entryDate).toLocaleDateString()
                        : "-"}</td> */}
                    <td>{item.item.name || 0}</td>
                    <td>{item.item.material_grade || 0}</td>
                    <td>{item.item.unit.name || 0}</td>
                    <td>{item.fabDrawingQty || 0}</td>
                    <td>{item.gadClientQty || 0}</td>
                    <td>{item.contingency || 0}</td>
                    <td>{item.materialRequirement || 0}</td>
                    <td>{item.usableStock || 0}</td>
                    <td>{item.orderedQty || 0}</td>
                    <td className="d-flex justify-content-end">
                      {item.prqty === 0 && (
                        <>
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
                            onClick={() => handleDelete(item?._id, item.item.name)}
                          >
                            {/* You can put a delete icon here */}
                            <Trash2 />
                          </a>
                        </>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            No MTO records found. You can add new records by clicking the{" "}
            <strong>plus (+)</strong> button.
          </p>
        )}
      </div>
    </div>
  );
};

export default MtoSectionTable;
