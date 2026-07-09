import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

const NDTPercentageModel = ({
  show,
  handleClose,
  handleSave,
  editData,
  PipingClass,
}) => {
  const [form, setForm] = useState({
    _id: "",
    piping_class: "",
    rt_percentage: "",
    lpt_percentage: "",
    mpt_percentage: "",
  });

  const [error, setError] = useState({});

  // Reset or populate form when modal opens
  useEffect(() => {
    if (editData) {
      setForm({
        _id: editData._id,
        piping_class: editData.piping_class?._id || "",
        rt_percentage: editData.rt_percentage,
        lpt_percentage: editData.lpt_percentage,
        mpt_percentage: editData.mpt_percentage,
        status: editData.status,
      });
    } else {
      setForm({
        _id: "",
        piping_class: "",
        rt_percentage: "",
        lpt_percentage: "",
        mpt_percentage: "",
        status: true,
      });
    }
    setError({});
  }, [editData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ---------------- Validation ---------------- */
  const validate = () => {
    const err = {};

    if (!form.piping_class) err.piping_class = "Select piping class";
    if (!form.rt_percentage) err.rt_percentage = "RT % required";
    if (!form.lpt_percentage) err.lpt_percentage = "LPT % required";
    if (!form.mpt_percentage) err.mpt_percentage = "MPT % required";

    setError(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- Submit ---------------- */
  const onSubmit = () => {
    if (!validate()) return;

    handleSave({
      ...form,
      rt_percentage: Number(form.rt_percentage),
      lpt_percentage: Number(form.lpt_percentage),
      mpt_percentage: Number(form.mpt_percentage),
      status: form.status,
    });
  };

  const onClose = () => {
    setError({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {form._id ? "Edit NDT Percentage" : "Add NDT Percentage"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6 mb-2">
            <label>Piping Class *</label>
            <select
              className="form-control"
              name="piping_class"
              value={form.piping_class}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {PipingClass?.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.PipingClass}
                </option>
              ))}
            </select>
            <small className="text-danger">{error.piping_class}</small>
          </div>
          <div className="col-md-6 mb-2">
            <label>RT Percentage *</label>
            <input
              type="number"
              className="form-control"
              name="rt_percentage"
              value={form.rt_percentage}
              onChange={handleChange}
            />
            <small className="text-danger">{error.rt_percentage}</small>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-2">
            <label>LPT Percentage *</label>
            <input
              type="number"
              className="form-control"
              name="lpt_percentage"
              value={form.lpt_percentage}
              onChange={handleChange}
            />
            <small className="text-danger">{error.lpt_percentage}</small>
          </div>

          <div className="col-md-6 mb-2">
            <label>MPT Percentage *</label>
            <input
              type="number"
              className="form-control"
              name="mpt_percentage"
              value={form.mpt_percentage}
              onChange={handleChange}
            />
            <small className="text-danger">{error.mpt_percentage}</small>
          </div>
        </div>

        {form._id && (
          <div className="row">
            <div className="col-md-12 mb-2">
              <label>Status</label>
              <select
                className="form-control"
                name="status"
                value={form.status === true || form.status === 1 ? 1 : 0}
                onChange={(e) => setForm({ ...form, status: Number(e.target.value) === 1 })}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          {form._id ? "Update" : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default NDTPercentageModel;
