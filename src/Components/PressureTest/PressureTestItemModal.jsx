import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const OrderPlacementItemModal = ({
  show,
  handleClose,
  handleSaveModal,
  editData,
  itemData,
  areasData,
  mtoId, handleFileChange,  handleUpload,uploadFile
}) => {
  const [formData, setFormData] = useState({
    mto_id: mtoId || "",
    item_id: "",
    material_grade: "",
    gadClientQty: "",
    fabDrawingQty: "",
    areaBuilding: "",
    remarks: "",
  });

  const isEditing = editData && Object.keys(editData).length > 0;

  // Prefill form if editing
  useEffect(() => {
    if (isEditing) {
      setFormData({
        id: editData._id || "",
        mto_id: editData.mto_id || mtoId || "",
        item_id: editData.item._id || "",
        material_grade: editData.item.material_grade || "",
        gadClientQty: editData.gadClientQty || "",
        fabDrawingQty: editData.fabDrawingQty || "",
        remarks: editData.remarks || "",
        areaBuilding: editData.areaBuilding._id || "",
      });
    } else {
      setFormData({
        mto_id: mtoId || "",
        item_id: "",
        material_grade: "",
        gadClientQty: "",
        fabDrawingQty: "",
        areaBuilding: "",
        remarks: "",
      });
    }
  }, [editData, mtoId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "item_id") {
      const selectedItem = itemData?.find((item) => item._id === value);
      setFormData((prev) => ({ ...prev, item_id: value, material_grade: selectedItem?.material_grade || "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = async (addMore = false) => {
    await handleSaveModal(formData, addMore); // wait for save to finish
    if (addMore) {
      setFormData({
        mto_id: mtoId || "",
        item_id: "",
        material_grade: "",
        gadClientQty: "",
        fabDrawingQty: "",
        areaBuilding: "",
        remarks: "",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Item" : "Add Item"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <label>Import Items from File</label>
          <input
            type="file"
            className="form-control"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange} // uses parent handler
          />
          <button
            className="btn btn-primary mt-2"
            onClick={() => {
              if (!uploadFile) return alert("Please select a file!");
              handleUpload(uploadFile); // uses parent upload
            }}
          >
            Upload & Import
          </button>
        </div>
        <div className="row g-3">         

          {/* Item Dropdown */}
          <div className="col-md-6">
            <label>Item</label>
            <select
              className="form-control"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
            >
              <option value="">Select Item</option>
              {itemData?.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label>Item Description</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Size</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Thickness</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Material Grade</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Make/Manufacturer</label>
            <input
              type="number"
              className="form-control"
              name="fabDrawingQty"
              value={formData.fabDrawingQty}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>UOM</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Qty</label>
            <input
              type="number"
              className="form-control"
              name="gadClientQty"
              value={formData.gadClientQty}
              onChange={handleChange}
            />
          </div>          

          <div className="col-md-6">
            <label>Rates (INR)</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>SGST%</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>CGST%</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Amount(INR)</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-12">
            <label>Remarks</label>
            <input
              type="text"
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
          <button className="btn btn-outline-primary" onClick={() => handleSaveClick(true)}>
            Save & Add More
          </button>
        )}

        <button className="btn btn-primary" onClick={() => handleSaveClick(false)}>
          {isEditing ? "Update" : "Save & Close"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderPlacementItemModal;
