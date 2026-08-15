import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { QC } from "../../BaseUrl";

const FimItemModal = ({ show, handleClose, handleSaveModal, handleUpload, editData, itemData, uploadFile, handleFileChange, }) => {

  const [formData, setFormData] = useState({
    item_id: "",
    material_grade: "",
    weight_as_per_list: "",
    numbers_as_per_list: "",
    received_weight: "",
    received_length: "",
    received_width: "",
    received_nos: "",
    remarks: "",
  });

  // useEffect(() => {
  //   if (editData) {
  //     setFormData({
  //       item_id: editData.item_id || "",
  //       material_grade: editData.material_grade || "",
  //       weight_as_per_list: editData.weight_as_per_list || "",
  //       numbers_as_per_list: editData.numbers_as_per_list || "",
  //       received_weight: editData.received_weight || "",
  //       received_length: editData.received_length || "",
  //       received_width: editData.received_width || "",
  //       received_nos: editData.received_nos || "",
  //       remarks: editData.remarks || "",
  //     });
  //   }
  // }, [editData]);

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0 && itemData && itemData.length > 0) {
      // Fix: extract _id from object
      const itemId = (typeof editData.item_id === "object" && editData.item_id !== null)
        ? editData.item_id._id?.toString()
        : editData.item_id?.toString();

      const selectedItem = itemData.find(item => item._id.toString() === itemId);

      console.log("editData.item_id:", editData.item_id);
      console.log("itemId (extracted):", itemId);
      console.log("selectedItem based on item_id:", selectedItem);

      setFormData({
        _id: editData._id || "",
        item_id: itemId || "",
        material_grade: selectedItem?.material_grade || editData.material_grade || "",
        weight_as_per_list: editData.weight_as_per_list || "",
        numbers_as_per_list: editData.numbers_as_per_list || "",
        received_weight: editData.received_weight || "",
        received_length: editData.received_length || "",
        received_width: editData.received_width || "",
        received_nos: editData.received_nos || "",
        remarks: editData.remarks || "",
      });
    } else {
      setFormData({
        item_id: "",
        material_grade: "",
        weight_as_per_list: "",
        numbers_as_per_list: "",
        received_weight: "",
        received_length: "",
        received_width: "",
        received_nos: "",
        remarks: "",
      });
    }
  }, [editData, itemData]);


  const handleSaveClick = (addMore = false) => {
    handleSaveModal(formData, addMore);

    if (addMore) {
      setFormData({

        item_id: "",
        material_grade: "",
        weight_as_per_list: "",
        numbers_as_per_list: "",
        received_weight: "",
        received_length: "",
        received_width: "",
        received_nos: "",
        remarks: "",
      });
    } else {
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "item_id") {
      // const selectedItem = itemData?.find((item) => item._id === value);
      const selectedItem = itemData.find(item => item._id.toString() === value);
      console.log(" handle change Selected Item for item_id change:", selectedItem);
      setFormData((prevData) => ({
        ...prevData,
        item_id: value,
        material_grade: selectedItem?.material_grade || "",
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Item" : "Add Item"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* File Upload */}
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

        {/* Manual Form */}
        <div className="row g-3">
          <div className="col-md-6">
            <label>Section Details</label>
            <select
              className="form-control"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
            >
              {/* <option value="">Select Section</option>
              {itemData?.map((e) => (
                <option key={e?._id} value={e?._id}>
                  {e?.name}
                </option>
              ))} */}
              <option value="">Select Section</option>
              {itemData?.map((e) => (
                <option key={e._id} value={e._id.toString()}>
                  {e.name}
                </option>
              ))}

            </select>
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
            <label>Weight as per Packing List (Kg)</label>
            <input
              type="number"
              className="form-control"
              name="weight_as_per_list"
              value={formData.weight_as_per_list}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Numbers as per Packing List</label>
            <input
              type="number"
              className="form-control"
              name="numbers_as_per_list"
              value={formData.numbers_as_per_list}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Received Weight (Kg)</label>
            <input
              type="number"
              className="form-control"
              name="received_weight"
              value={formData.received_weight}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Received Length (MM)</label>
            <input
              type="number"
              className="form-control"
              name="received_length"
              value={formData.received_length}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Received Width (MM)</label>
            <input
              type="number"
              className="form-control"
              name="received_width"
              value={formData.received_width}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Received Nos</label>
            <input
              type="number"
              className="form-control"
              name="received_nos"
              value={formData.received_nos}
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

        {!editData || Object.keys(editData).length === 0 && (
          <button className="btn btn-outline-primary" onClick={() => handleSaveClick(true)}>
            Save & Add More
          </button>
        )}

        <button className="btn btn-primary" onClick={() => handleSaveClick(false)}>
          {editData && Object.keys(editData).length > 0 ? "Update" : "Save & Close"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default FimItemModal;
