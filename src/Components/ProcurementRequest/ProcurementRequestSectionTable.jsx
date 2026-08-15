import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import DownloadFormat from "../DownloadFormat/DownloadFormat";


const ProcurementRequestSectionTable = ({
  transactionData,
  handleSave,
  handleDelete,
  handleEdit,
  handleView,
  finalId,
  dataId,
}) => {
  console.log("Procurement Request Data in Table:", transactionData); // Debugging line
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div className="form-heading">
            <h4>Procurement Request List</h4>
          </div>
          <div className="add-group">
            <div>
              <DownloadFormat
                fileName={"Fim-item"}
              />
            </div>
          </div>

          {(finalId || dataId) && (
            <div className="add-group">
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary add-pluss ms-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Add Procurement Request"
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
                  <th>Item </th>
                  <th>Item Description</th>
                  <th>Size</th>
                  <th>Thickness</th>
                  <th>Material Grade</th>
                  <th>UOM</th>
                  <th>PR Qty</th>
                  <th>Item length to be specified by Supplier</th>
                  {/* <th>Rates (INR / UNIT)</th>
                  <th>Amount (INR)</th> */}
                  <th>Delivery Days</th>
                  {/* <th>Offer Length</th>
                  <th>Offer Make/Manufacturer</th> */}
                  <th>Remarks</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* {transactionData?.map((item, index) => ( */}
                  <tr >
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td className="d-flex justify-content-end">
                      <a
                        className="action-icon mx-1"
                        style={{ cursor: "pointer" }}
                        title="Edit"
                      >
                        <Pencil />
                      </a>
                      <a
                        className="action-icon mx-1"
                        style={{ cursor: "pointer" }}
                        title="Delete"
                      >
                        <Trash2 />
                      </a>
                    </td>
                  </tr>
                {/* ))} */}
              </tbody>
            </table>
          </div>
        {/* ) : (
          <p>
            No Procurement Request records found. You can add new records by clicking the{" "}
            <strong>plus (+)</strong> button.
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ProcurementRequestSectionTable;
