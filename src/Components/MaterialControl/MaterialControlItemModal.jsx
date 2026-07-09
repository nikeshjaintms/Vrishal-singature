import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const MaterialControlItemModal = ({
  show,
  handleClose,
  handleSaveModal,
  editData,
  itemData,
  areasData,
  mtoId, handleFileChange, handleUpload, uploadFile
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
        <Modal.Title>{isEditing ? "Edit Drawing Basis Item" : "Add Drawing Basis Item"}</Modal.Title>
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
          {/* Area / Location */}
          <div className="col-md-4">
            <label>Area / Location</label>
            <select
              className="form-control"
              name="areaLocation"
              value={formData.areaLocation}
              onChange={handleChange}
            >
              <option value="">Select Area / Location</option>
              {areasData?.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.area}
                </option>
              ))}
            </select>
          </div>

          {/* Line No. / Drawing No. */}
          <div className="col-md-4">
            <label>Line No. / Drawing No.</label>
            <select
              className="form-control"
              name="LineNoDrawingNo"
              value={formData.LineNoDrawingNo}
              onChange={handleChange}
            >
              <option value="">Select Line No. / Drawing No.</option>
              {areasData?.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.area}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label>Rev No.</label>
            <input
              type="text"
              className="form-control"
              name="rev_no"
              value={formData.rev_no}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Sheet No.</label>
            <input
              type="text"
              className="form-control"
              name="sheet_no"
              value={formData.sheet_no}
              onChange={handleChange}
            />
          </div>

          {/* <div className="col-md-4">
            <label>Item Code</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div> */}

          {/* Item Dropdown */}
          <div className="col-md-4">
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

          <div className="col-md-4">
            <label>Item Description</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Size 1</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Thickness 1</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Size 2</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Thickness 2</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Material Grade</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>UOM</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Client MTO Qty</label>
            <input
              type="number"
              className="form-control"
              name="gadClientQty"
              value={formData.gadClientQty}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>ISO Drawing Qty</label>
            <input
              type="number"
              className="form-control"
              name="fabDrawingQty"
              value={formData.fabDrawingQty}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Continegancy</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>MTO with Continegancy (Round Figure)</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Existing Available Qty (Usable Stock)</label>
            <input
              type="text"
              className="form-control"
              name="material_grade"
              value={formData.material_grade}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label>Order Qty / Ready for PR Qty</label>
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

export default MaterialControlItemModal;
