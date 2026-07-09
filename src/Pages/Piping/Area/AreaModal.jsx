import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

const AreaModal = ({ show, handleClose, handleSave, editData }) => {
  const [area, setArea] = useState({
    name: "",
    status: 1,
    _id: "",
  });

  const [error, setError] = useState({});

  // Reset or populate form when modal opens
  useEffect(() => {
    if (editData) {
      setArea({
        name: editData.area || "",
        status: editData.status ?? 1,
        _id: editData._id || "",
      });
    } else {
      setArea({ name: "", status: 1, _id: "" });
    }
    setError({});
  }, [editData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArea({ ...area, [name]: name === "status" ? Number(value) : value });
  };

  const validation = () => {
    const err = {};
    if (!area.name.trim()) err.name_err = "Please enter area name";
    setError(err);
    return Object.keys(err).length === 0;
  };

  const onSubmit = () => {
    if (validation()) handleSave(area);
  };

  const onClose = () => {
    setArea({ name: "", status: 1, _id: "" });
    setError({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{area._id ? "Edit Area" : "Add Area"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row align-items-center mt-2">
          <div className="col-3">
            <label className="col-form-label">
              Area Name <span className="login-danger">*</span>
            </label>
          </div>
          <div className="col-9">
            <input
              type="text"
              className="form-control"
              name="name"
              value={area.name}
              onChange={handleChange}
            />
            <div className="error">{error.name_err}</div>
          </div>
        </div>

        <div className="row align-items-center mt-2">
          <div className="col-3">
            <label className="col-form-label">Status</label>
          </div>
          <div className="col-9">
            <select
              className="form-control"
              name="status"
              value={area.status}
              onChange={handleChange}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          {area._id ? "Update" : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AreaModal;
