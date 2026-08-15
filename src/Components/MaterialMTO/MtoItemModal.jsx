import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const MtoItemModal = ({
  show,
  handleClose,
  handleSaveModal,
  editData,
  itemData,
  mtoId,
  reusableStock = [],
  onItemSelect,
  stockUsedIds = [],
}) => {
  const [formData, setFormData] = useState({
    mto_id: mtoId || "",
    item_id: "",
    usableStockId: "",
    usableStock: 0,
    material_grade: "",
    gadClientQty: "",
    fabDrawingQty: "",
    contingency: 0,
    orderedQty: 0,
    remarks: "",
  });

  const isEditing = editData && Object.keys(editData).length > 0;

  /* ===========================
     PREFILL EDIT DATA (RUN ONCE)
  ============================ */
  useEffect(() => {
    if (!show) return;

    if (isEditing) {
      setFormData({
        id: editData._id || "",
        mto_id: editData.mto_id || mtoId || "",
        item_id: editData.item?._id || "",
        usableStockId: editData.usableStockId || "",
        usableStock: editData.usableStock || 0,
        material_grade: editData.item?.material_grade || "",
        gadClientQty: editData.gadClientQty || "",
        fabDrawingQty: editData.fabDrawingQty || "",
        contingency: editData.contingency || 0,
        orderedQty: editData.orderedQty || 0,
        remarks: editData.remarks || "",
      });

      if (editData.item?._id) {
        onItemSelect?.(editData.item._id);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        mto_id: mtoId || "",
        item_id: "",
        usableStockId: "",
        usableStock: 0,
        material_grade: "",
        gadClientQty: "",
        fabDrawingQty: "",
        contingency: 0,
        orderedQty: 0,
        remarks: "",
      }));
    }
  }, [show]); // 🔥 IMPORTANT: no unstable deps

  /* ===========================
     CALCULATIONS
  ============================ */
  const gadQty = Number(formData.gadClientQty || 0);
  const fabQty = Number(formData.fabDrawingQty || 0);
  const contingency = (Number(formData.contingency) || 0) / 100;
  const usableStock = Number(formData.usableStock || 0);

  const baseQty = Math.max(gadQty, fabQty);
  const materialRequirement =
    fabQty +
    gadQty +
    (fabQty * contingency) +
    (gadQty * contingency);
    
  const calculatedOrderQty = Math.max(materialRequirement - usableStock, 0);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      orderedQty: calculatedOrderQty,
    }));
  }, [calculatedOrderQty]);

  /* ===========================
     HANDLE CHANGE (SAFE)
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gadClientQty") {
      setFormData((prev) => ({
        ...prev,
        gadClientQty: value,
        fabDrawingQty: value ? "" : prev.fabDrawingQty,
      }));
      return;
    }

    if (name === "fabDrawingQty") {
      setFormData((prev) => ({
        ...prev,
        fabDrawingQty: value,
        gadClientQty: value ? "" : prev.gadClientQty,
      }));
      return;
    }

    if (name === "item_id") {
      const selectedItem = itemData?.find((i) => i._id === value);
      setFormData((prev) => ({
        ...prev,
        item_id: value,
        material_grade: selectedItem?.material_grade || "",
        usableStockId: "",
        usableStock: 0,
      }));
      onItemSelect?.(value);
      return;
    }

    if (name === "usableStockId") {
      const stock = reusableStock.find((s) => s._id === value);
      setFormData((prev) => ({
        ...prev,
        usableStockId: value,
        usableStock: stock?.balance_qty || 0,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async (addMore = false) => {
    await handleSaveModal(formData, addMore);
    if (addMore) {
      setFormData((prev) => ({
        ...prev,
        item_id: "",
        usableStockId: "",
        usableStock: 0,
        gadClientQty: "",
        fabDrawingQty: "",
        contingency: 0,
        orderedQty: 0,
        remarks: "",
      }));
    }
  };

  const isGadEntered = gadQty > 0;
  const isFabEntered = fabQty > 0;

  /* ===========================
     UI
  ============================ */
  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Item" : "Add Item"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-3">
          

          <div className="col-md-6">
            <label>Item</label>
            <select
              className="form-control"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
            >
              <option value="">Select Item</option>
              {itemData?.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label>Material Grade</label>
            <input
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>GAD Client Qty</label>
            <input
              type="number"
              className="form-control"
              name="gadClientQty"
              value={formData.gadClientQty}
              onChange={handleChange}
              disabled={isFabEntered}
            />
          </div>

          <div className="col-md-6">
            <label>Fabrication Drawing Qty</label>
            <input
              type="number"
              className="form-control"
              name="fabDrawingQty"
              value={formData.fabDrawingQty}
              onChange={handleChange}
              disabled={isGadEntered}
            />
          </div>

          <div className="col-md-6">
            <label>Contingency</label>
            <input
              type="number"
              className="form-control"
              name="contingency"
              value={formData.contingency}
              onChange={handleChange}
            />
          </div>

          {reusableStock.length > 0 && (
            <div className="col-md-6">
              <label>Reusable Stock</label>
              <select
                className="form-control"
                name="usableStockId"
                value={formData.usableStockId}
                onChange={handleChange}
              >
                <option value="">Select Stock</option>
                {reusableStock.map((s) => {
                  const used = stockUsedIds.includes(String(s._id));
                  return (
                    <option key={s._id} value={s._id} disabled={used}>
                      {s.material_po_no} - Balance {s.balance_qty}
                      {used ? " (Used)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="col-md-12 mt-3">
            <div className="alert alert-info">
              <strong>Material Requirement</strong>
              <ul className="mb-0">
                <li>Base Qty: <b>{baseQty}</b></li>
                <li>Contingency: <b>{contingency}</b></li>
                <li>Material Requirement: <b>{materialRequirement}</b></li>
                <li>Usable Stock: <b>{usableStock}</b></li>
                <li className="text-primary">
                  Order Qty: <b>{calculatedOrderQty}</b>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <label>Order Qty</label>
            <input className="form-control" value={formData.orderedQty} readOnly />
          </div>

          <div className="col-md-6">
            <label>Remarks</label>
            <input
              className="form-control"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>

        {!isEditing && (
          <button
            className="btn btn-outline-primary"
            onClick={() => handleSaveClick(true)}
          >
            Save & Add More
          </button>
        )}

        <button
          className="btn btn-primary"
          onClick={() => handleSaveClick(false)}
        >
          {isEditing ? "Update" : "Save & Close"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default MtoItemModal;
