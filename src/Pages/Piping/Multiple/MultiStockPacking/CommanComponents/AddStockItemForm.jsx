import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { V_URL } from "../../../../../BaseUrl";
import { getItemDetails } from "../../../../../Store/Piping/Item/Item";
import { getUserPipingClassMaster } from "../../../../../Store/Piping/PipingClass/PipingClassMaster";

const AddDrawingForm = ({ modalOpen, handleModalClose, handleSave, editData }) => {
  const dispatch = useDispatch();

  /* ===================== REDUX DATA ===================== */
  const itemData = useSelector(
    (state) => state.getItemDetails?.user?.data?.data || []
  );

  const pipingClassData = useSelector(
    (state) => state.getUserPipingClassMaster?.user?.data || []
  );

  /* ===================== STATE ===================== */
  const [form, setForm] = useState({
    drawing_no: "",
    rev: "",
    item_id: "",
    qty: "",
    area_sqm: "",
    piping_class: "",
    service_id: "",
    service: "",
    piping_material_Specfication_id: null,
    piping_material_specification_name: "",    
    remarks: "",
    size1: "",
    size2: "",
    thickness1: "",
    thickness2: "",
    uom: "",
    imir_no: [""],   // multiple IMIR entries
    _id: "",
    status: 1,
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [error, setError] = useState({});

  /* ===================== LOAD MASTER DATA ===================== */
  useEffect(() => {
    dispatch(getItemDetails({ is_main: false }));
    dispatch(getUserPipingClassMaster({ status: 1 }));
  }, [dispatch]);

  /* ===================== EDIT MODE ===================== */
  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        imir_no: editData.imir_no?.length ? editData.imir_no : [""],
      });
      setAvailableServices(
        pipingClassData.find((p) => String(p._id) === String(editData.piping_class))
          ?.Items || []
      );
    } else {
      resetForm();
    }
    setError({});
  }, [editData, modalOpen, pipingClassData]);

  const resetForm = () => {
    setForm({
      drawing_no: "",
      rev: "",
      item_id: "",
      qty: "",
      area_sqm: "",
      piping_class: "",
      service_id: "",
      service: "",
      piping_material_Specfication_id: null,
      piping_material_specification_name: "",
      remarks: "",
      size1: "",
      size2: "",
      thickness1: "",
      thickness2: "",
      uom: "",
      imir_no: [""],
      _id: "",
      status: 1,
    });
    setAvailableServices([]);
  };

  /* ===================== HANDLE CHANGE ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    /* Item change */
    if (name === "item_id") {
      const selectedItem = itemData.find((i) => i._id === value);
      if (selectedItem) {
        setForm((prev) => ({
          ...prev,
          item_id: value,
          size1: selectedItem.size1?.name || "",
          thickness1: selectedItem.thickness1?.name || "",
          size2: selectedItem.size2?.name || "",
          thickness2: selectedItem.thickness2?.name || "",
          uom: selectedItem.uom?.name || "",
        }));
      }
      return;
    }

    /* Piping class change */
    if (name === "piping_class") {
      const selectedClass = pipingClassData.find(
        (p) => String(p._id) === String(value)
      );

      setAvailableServices(selectedClass?.Items || []);

      setForm((prev) => ({
        ...prev,
        piping_class: value,
        service_id: "",
        service: "",
        piping_material_specification: "",
      }));
      return;
    }

    /* Service change */
     /* ===================== FINAL SERVICE CHANGE FIX ===================== */
    if (name === "service_id") {
      const selectedService = availableServices.find(
        (s) => String(s._id) === String(value)
      );

      setForm((prev) => ({
        ...prev,
        service_id: value,
        service: selectedService?.service || "",
        piping_material_Specfication_id:
          selectedService?.PipingMaterialSpecification?._id || null,
        piping_material_specification_name:
          selectedService?.PipingMaterialSpecification?.name || "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ===================== DYNAMIC IMIR HANDLERS ===================== */
  const handleAddIMIR = () => {
    setForm((prev) => ({ ...prev, imir_no: [...prev.imir_no, ""] }));
  };

  const handleIMIRChange = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.imir_no];
      updated[index] = value;
      return { ...prev, imir_no: updated };
    });
  };

  const handleRemoveIMIR = (index) => {
    setForm((prev) => ({
      ...prev,
      imir_no: prev.imir_no.filter((_, i) => i !== index),
    }));
  };

  /* ===================== VALIDATION ===================== */
  const validate = () => {
    const err = {};
    if (!form.drawing_no) err.drawing_no = "Drawing No required";
    if (!form.item_id) err.item_id = "Item required";
    if (!form.qty) err.qty = "Qty required";
    if (!form.piping_class) err.piping_class = "Piping Class required";
    if (!form.service_id) err.service = "Service required";
    if(!form.imir_no) err.imir_no = "IMIR No required";

    setError(err);
    return Object.keys(err).length === 0;
  };

  /* ===================== SUBMIT ===================== */
  const onSubmit = async () => {
    if (!validate()) return;

    console.log("form",form);

    const payload = {
      ...form,
      imir_no: form.imir_no.filter(Boolean), // remove empty
      piping_material_Specfication_id: form.piping_material_Specfication_id,
    };

    if (handleSave) {
      const success = await handleSave(payload);
      if (success) {
        handleModalClose();
        resetForm();
      }
    }
  };

  /* ===================== UI ===================== */
  return (
    <Modal show={modalOpen} size="xl" backdrop="static" onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {form._id ? "Edit Dispatch Note Section Detail" : "Add Dispatch Note Section Detail"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-3">
         
          {/* Item */}
          <div className="col-md-6">
            <label>Item</label>
            <select
              className="form-control"
              name="item_id"
              value={form.item_id}
              onChange={handleChange}
            >
              <option value="">Select Item</option>
              {itemData.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.item_name}
                </option>
              ))}
            </select>
            <div className="error">{error.item_id}</div>
          </div>
          <div className="col-md-6">
            <label>UOM</label>
            <input className="form-control" value={form.uom || ""} disabled />
          </div>

          {/* Sizes / Thickness / UOM */}
          <div className="col-md-6">
            <label>Size 1</label>
            <input className="form-control" value={form.size1 || ""} disabled />
          </div>
          <div className="col-md-6">
            <label>Thickness 1</label>
            <input className="form-control" value={form.thickness1 || ""} disabled />
          </div>
          <div className="col-md-6">
            <label>Size 2</label>
            <input className="form-control" value={form.size2 || ""} disabled />
          </div>
          <div className="col-md-6">
            <label>Thickness 2</label>
            <input className="form-control" value={form.thickness2 || ""} disabled />
          </div>

          {/* Qty */}
          <div className="col-md-6">
            <label>Qty</label>
            <input
              className="form-control"
              name="qty"
              type="number"
              value={form.qty}
              onChange={handleChange}
            />
            <div className="error">{error.qty}</div>
          </div>

         

          {/* Remarks */}
          <div className="col-md-12">
            <label>Remarks</label>
            <input
              className="form-control"
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
            />
          </div>

          {/* ================= DYNAMIC IMIR ================= */}
          <div className="col-md-12 mt-3">
            <label>IMIR No(s)</label>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>IMIR No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {form.imir_no.map((val, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={val}
                        onChange={(e) => handleIMIRChange(index, e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveIMIR(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-success btn-sm" onClick={handleAddIMIR}>
              Add IMIR
            </button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={handleModalClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          {form._id ? "Update" : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDrawingForm;
