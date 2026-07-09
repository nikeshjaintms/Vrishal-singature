import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Save } from "lucide-react";
import DownloadFormat from "../DownloadFormat/DownloadFormat";

const MaterialControlSectionTableQty = ({
  transactionData,
  handleSave,
  handleEdit,
  finalId,
  dataId,
  fetchTransactionData,
}) => {
  const [localRows, setLocalRows] = useState(transactionData || []);
  const [editRowIndex, setEditRowIndex] = useState(null);
  useEffect(() => {
  setLocalRows(transactionData || []);  
}, [transactionData]);

  const [editFormData, setEditFormData] = useState({
    qty: 0,
    iso_drawing_qty: 0,
    contingency: 0,
    mto_with_contingency: 0,
    existing_available_qty: 0,
    order_qty: 0,
  });

  /* -------- INPUT CHANGE (LOGIC ONLY) -------- */
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;


    const updated = {
      ...editFormData,
      [name]: Number(value) || 0,
    };

    const qty = Number(updated.qty) || 0;
    const contingency = Number(updated.contingency) || 0;
    const existingQty = Number(updated.existing_available_qty) || 0;

    // MTO with contingency
    const mtoWithContingency = Math.round(
      qty + (qty * contingency) / 100
    );

    // Order Qty (what needs to be ordered)
    const orderQty = Math.max(0, mtoWithContingency - existingQty);


    updated.mto_with_contingency = mtoWithContingency;
    updated.order_qty = orderQty;

    setEditFormData(updated);
  };

  /* -------- EDIT CLICK -------- */
  const handleEditClick = (index, row) => {

    setEditRowIndex(index);
    setEditFormData({
        qty: row?.qty || row?.iso_drawing_qty ||0,
        contingency: row?.contingency || 0,
        mto_with_contingency: row?.mto_with_contingency || 0,
        existing_available_qty: row?.existing_available_qty || 0,
        order_qty: Math.max(0, row?.order_qty || 0),
    });
};


  /* -------- SAVE -------- */
  const handleEditSave = async (row) => {
    await handleEdit({
      ...row,
      __fromQtyTable: true,   // 👈 IMPORTANT FLAG
      contingency: editFormData.contingency,
      existing_available_qty: editFormData.existing_available_qty,
      mto_with_contingency: editFormData.mto_with_contingency,
      order_qty: editFormData.order_qty,
    });

    setEditRowIndex(null);
  };


  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <h4>Material Control List</h4>

          {/* {(finalId || dataId) && (
            <div className="add-group d-flex">
              <DownloadFormat fileName="Fim-item" />
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary add-pluss ms-2"
              >
                <img src="/assets/img/icons/plus.svg" alt="add-icon" />
              </button>
            </div>
          )} */}
        </div>

        <div className="table-responsive">
          <table className="table custom-table table-striped">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Item</th>
                <th>Item Description</th>
                <th>Size 1</th>
                <th>Thickness 1</th>
                <th>Size 2</th>
                <th>Thickness 2</th>
                <th>Material Grade</th>
                <th>UOM</th>
                <th>ISO Drawing Qty</th>
                <th>Continegancy</th>
                <th>MTO with Continegancy (Round Figure)</th>
                <th>Existing Available Qty (Usable Stock)</th>
                <th>Order Qty / Ready for PR Qty</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {localRows?.map((item, index) => (
                <tr key={item?._id || index}>
                {/* // <tr key={item._id}> */}
                  <td>{index + 1}</td>
                  <td>{item?.item?.item_name || "--"}</td>
                  <td>{item?.item?.item_description || "--"}</td>
                  <td>{item?.item?.size1?.name || item?.item_id?.size1?.name || "--"}</td>
                  <td>{item?.item?.thickness1?.name || item?.item_id?.thickness1?.name || "--"}</td>
                  <td>{item?.item?.size2?.name || item?.item_id?.size2?.name || "--"}</td>
                  <td>{item?.item?.thickness2?.name || item?.item_id?.thickness2?.name || "--"}</td>
                  <td>{item?.item?.material_grade || "--"}</td>
                  <td>{item?.item?.uom?.name || "--"}</td>

                  {/* ISO Drawing Qty (qty) - Read only */}
                  <td>{item?.qty || item?.iso_drawing_qty || 0}</td>
                  
                  {/* Contingency - Editable */}
                  <td>
                    {editRowIndex === index ? (
                      <input
                        type="number"
                        name="contingency"
                        value={editFormData.contingency}
                        onChange={handleEditFormChange}
                        className="form-control"
                        step="0.01"
                      />
                    ) : (
                      item?.contingency || 0
                    )}
                  </td>
                  
                  {/* MTO with Contingency - Read only (calculated) */}
                  <td>
                    {editRowIndex === index 
                      ? editFormData.mto_with_contingency || 0
                      : item?.mto_with_contingency || 0
                    }
                  </td>
                  
                  {/* Existing Available Qty - Editable */}
                  <td>
                    {editRowIndex === index ? (
                      <input
                        type="number"
                        name="existing_available_qty"
                        value={editFormData.existing_available_qty}
                        onChange={handleEditFormChange}
                        className="form-control"
                      />
                    ) : (
                      item?.existing_available_qty || 0
                    )}
                  </td>
                  
                  {/* Order Qty - Read only (calculated) */}
                  <td>
                    {editRowIndex === index 
                      ? Math.max(0, editFormData.order_qty || 0)
                      : Math.max(0, item?.order_qty || 0)
                    }
                  </td>

                  <td className="text-end">
                    {editRowIndex === index ? (
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={() => handleEditSave(item)}
                      >
                        <Save />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => handleEditClick(index, item)}
                      >
                        <Pencil />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialControlSectionTableQty;
