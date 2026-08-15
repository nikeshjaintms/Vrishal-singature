import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import DownloadFormat from "../DownloadFormat/DownloadFormat";


const MaterialControlClientMtoSectionTable = ({
  transactionData,
  handleSave,
  handleDelete,
  handleEdit,
  handleView,
  finalId,
  dataId,
}) => {
  console.log("Material Control Data in Table:", transactionData); // Debugging line
  const today = new Date();
  const formattedDate = today.getDate().toString().padStart(2, '0') + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getFullYear();
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div className="form-heading">
            <h4>Material Control List</h4>
          </div>

          {(finalId || dataId) && (
            <div className="add-group">
              {/* <div>
                  <DownloadFormat
                    fileName={"Fim-item"}
                  />
              </div> */}
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary add-pluss ms-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Add Material Control"
              >
                <img src="/assets/img/icons/plus.svg" alt="add-icon" />
              </button>
            </div>
          )}
        </div>

        {/* {transactionData?.length > 0 ? ( */}
          <div className="table-responsive">
            <table className="table border-0 mb-0 custom-table table-striped comman-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Item Name</th>
                  <th>Item Description</th>
                  <th>Size 1</th>
                  <th>Thickness 1</th>
                  <th>Size 2</th>
                  <th>Thickness 2</th>
                  <th>Material Grade</th>
                  <th>Client MTO Qty</th>
                  <th>Continegancy</th>
                  <th>MTO with Continegancy (Round Figure)</th>
                  <th>Existing Available Qty (Usable Stock)</th>
                  <th>Order Qty / Ready for PR Qty</th>
                  <th>Remark</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(transactionData) && transactionData.length > 0 ? (
                  transactionData.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td>{item?.item_id?.item_name || "--"}</td>

                      <td>{item?.item_id?.item_description || "--"}</td>

                      <td>{item?.item_id?.size1?.name || "--"}</td>

                      <td>{item?.item_id?.thickness1?.name || "--"}</td>

                      <td>{item?.item_id?.size2?.name || "--"}</td>

                      <td>{item?.item_id?.thickness2?.name || "--"}</td>

                      <td>{item?.item_id?.material_grade || "--"}</td>

                      <td>{item?.client_mto_qty ?? 0}</td>

                      <td>{item?.contingency ?? 0}</td>

                      <td>{item?.mto_with_contingency ?? 0}</td>

                      <td>{item?.existing_available_qty ?? 0}</td>

                      <td>{item?.order_qty ?? 0}</td>

                      <td>{item?.remarks || "--"}</td>
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
                          onClick={() => handleDelete(item._id, item?.item_id?.item_name)}

                        >
                          <Trash2 />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="text-center p-4">
                      No Material Control records found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

        {/* ) : (
          <p>
            No Material Control records found. You can add new records by clicking the{" "}
            <strong>plus (+)</strong> button.
          </p>
        )} */}
      </div>
    </div>
  );
};

export default MaterialControlClientMtoSectionTable;
