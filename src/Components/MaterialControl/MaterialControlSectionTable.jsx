import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import DownloadFormat from "../DownloadFormat/DownloadFormat";


const MaterialControlSectionTable = ({
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

          {/* {(finalId || dataId) && (
            <div className="add-group">
            <div>
              <DownloadFormat
                fileName={"Fim-item"}
              />
            </div>
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
          )} */}
        </div>

        {/* {transactionData?.length > 0 ? ( */}
          <div className="table-responsive">
            <table className="table border-0 mb-0 custom-table table-striped comman-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  {/* <th>Entry Date</th>
                  <th>Area / Location</th> */}
                  <th>Rev No.</th>
                  {/* <th>Sheet No.</th> */}
                  <th>Item</th>
                  <th>Item Description</th>
                  <th>Size 1</th>
                  <th>Thickness 1</th>
                  <th>Size 2</th>
                  <th>Thickness 2</th>
                  <th>Material Grade</th>
                  <th>UOM</th>
                  <th>ISO Drawing Qty</th>
                </tr>
              </thead>
              <tbody>
                {transactionData && Array.isArray(transactionData) && transactionData.length > 0 ? (
                  transactionData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      {/* <td>{formattedDate}</td>
                      <td>{item?.drawing_id?.area_unit?.area || item?.drawing_id?.area || "--"}</td> */}
                      <td>{item?.drawing_id?.rev || "--"}</td>
                      {/* <td>{item?.drawing_id?.sheet_no || "--"}</td> */}
                      <td>{item?.item?.item_name || item?.item_id?.item_name || "--"}</td>
                      <td>{item?.item?.item_description || item?.item_id?.item_description || "--"}</td>
                      <td>{item?.item?.size1?.name || item?.item_id?.size1?.name || "--"}</td>
                      <td>{item?.item?.thickness1?.name || item?.item_id?.thickness1?.name || "--"}</td>
                      <td>{item?.item?.size2?.name || item?.item_id?.size2?.name || "--"}</td>
                      <td>{item?.item?.thickness2?.name || item?.item_id?.thickness2?.name || "--"}</td>
                      <td>{item?.item?.material_grade || item?.item_id?.material_grade || "--"}</td>
                      <td>{item?.item?.uom?.name || item?.item_id?.uom?.name || "--"}</td>
                      <td>{item?.qty || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center p-4">
                      No Material Control records found. {finalId || dataId ? "You can add new records by clicking the " : ""}
                      {finalId || dataId ? <strong>plus (+)</strong> : ""} button.
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

export default MaterialControlSectionTable;
