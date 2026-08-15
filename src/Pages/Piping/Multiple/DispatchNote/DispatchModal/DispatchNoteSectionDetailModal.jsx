import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { V_URL } from '../../../../../BaseUrl';

const DispatchNoteSectionDetailModal = ({ show, handleClose, handleSave, editData, itemData = [], pipingClassData = [], paintShades = [], paintRequirements = [] }) => {
  const [dispatchNoteSectionDetail, setDispatchNoteSectionDetail] = useState({
    drawing_no: "",
    rev: "",
    item_id: "",
    qty: "",
    piping_class: "",
    service: "",
    area_sqm: "",
    piping_material_specification: "",
    shadeRalNo: "",
    final_coat_ral_no: "",
    paint_system: "",
    remarks: "",
    status: 1,
    _id: "",
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [error, setError] = useState({});

  // Reset or populate form when modal opens
  useEffect(() => {
    if (editData) {
      setDispatchNoteSectionDetail({
        name: editData.name || "",
        status: editData.status ?? 1,
        _id: editData._id || "",
      });
    } else {
      setDispatchNoteSectionDetail({ name: "", status: 1, _id: "" });
    }
    setError({});
  }, [editData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Item change
    if (name === "item_id") {
      const selectedItem = itemData.find(i => i._id === value);

      if (selectedItem) {
        setDispatchNoteSectionDetail(prev => ({
          ...prev,
          item_id: value,
          size1: selectedItem.size1?.name || "",
          thickness1: selectedItem.thickness1?.name || "",
          size2: selectedItem.size2?.name || "",
          thickness2: selectedItem.thickness2?.name || "",
          uom: selectedItem.uom?.name || "", // ✅ UOM
        }));
      }
      return;
    }


    // Piping Class change
    if (name === "piping_class") {
      const selectedClass = pipingClassData.find(
        p => String(p._id) === String(value)
      );

      setAvailableServices(selectedClass?.Items || []);

      setDispatchNoteSectionDetail(prev => ({
        ...prev,
        piping_class: value,
        service_id: "",
        service: "",
        piping_material_specification: "",
      }));
      return;
    }

    // Service change
    if (name === "service_id") {
      const selectedService = availableServices.find(
        s => String(s._id) === String(value)
      );
      const selectedShade = paintShades.find(
        shade => String(shade.service) === String(value)
      );

      setDispatchNoteSectionDetail(prev => ({
        ...prev,
        service_id: value,
        service: selectedService?.service || "",
        piping_material_specification:
          selectedService?.PipingMaterialSpecification || "",
        shadeRalNo: selectedShade?.shadeRalNo || ""
      }));
      return;
    }

    setDispatchNoteSectionDetail(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const onClose = () => {
    // Reset form state
    setDispatchNoteSectionDetail({ name: "", status: 1, _id: "" });
    setError({});

    // Close modal safely
    if (typeof handleClose === "function") {
      handleClose();
    }
  };

  const onSubmit = async () => {
    try {
      // Validate required fields
      if (!dispatchNoteSectionDetail.area_sqm || !dispatchNoteSectionDetail.item_id || !dispatchNoteSectionDetail.drawing_no || !dispatchNoteSectionDetail.rev || !dispatchNoteSectionDetail.qty || !dispatchNoteSectionDetail.piping_class || !dispatchNoteSectionDetail.service_id) {
        setError({
          drawing_no_err: !dispatchNoteSectionDetail.drawing_no ? "Drawing No is required" : "",
          rev_err: !dispatchNoteSectionDetail.rev ? "Rev No is required" : "",
          item_id_err: !dispatchNoteSectionDetail.item_id ? "Item is required" : "",
          qty_err: !dispatchNoteSectionDetail.qty ? "Qty is required" : "",
          area_sqm_err: !dispatchNoteSectionDetail.area_sqm ? "Area (SQM) is required" : "",
          piping_class_err: !dispatchNoteSectionDetail.piping_class ? "Piping Class is required" : "",
          service_err: !dispatchNoteSectionDetail.service_id ? "Service is required" : "",
          // paint_system_no_err: !dispatchNoteSectionDetail.paint_system ? "Paint System No is required" : "",
        });
        return;
      }

      // Prepare payload
      const payload = {
        project_id: localStorage.getItem('U_PROJECT_ID'),
        drawing_no: dispatchNoteSectionDetail.drawing_no,
        rev: dispatchNoteSectionDetail.rev,
        item_id: dispatchNoteSectionDetail.item_id,
        qty: dispatchNoteSectionDetail.qty,
        area_sqm: dispatchNoteSectionDetail.area_sqm,
        piping_class: dispatchNoteSectionDetail.piping_class,
        service_id: dispatchNoteSectionDetail.service_id,
        piping_material_specification: dispatchNoteSectionDetail.piping_material_specification?.name,
        shadeRalNo: dispatchNoteSectionDetail.shadeRalNo,
        final_coat_ral_no: dispatchNoteSectionDetail.final_coat_ral_no,
        paint_system: dispatchNoteSectionDetail.paint_system,
        remarks: dispatchNoteSectionDetail.remarks,
        status: dispatchNoteSectionDetail.status,
        _id: dispatchNoteSectionDetail._id
      };

      const response = await axios.post(
        `${V_URL}/user/piping-manage-multi-dispatch-offer`,
        payload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + localStorage.getItem('PAY_USER_TOKEN'),
          },
        }
      );

      console.log("Saved successfully:", response.data);

      // Call handleSave safely
      try {
        // handleSave(response.data);
        handleSave(); // ✅ Notify parent only

      } catch (err) {
        console.error("handleSave failed:", err);
      }

      // Always close modal
      onClose();

    } catch (error) {
      console.error("Error saving dispatch note section detail:", error);
      setError({ api_err: "Failed to save. Please try again." });
    }
  };




  return (
    <Modal show={show} onHide={onClose} size="xl" backdrop="static" centered keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{dispatchNoteSectionDetail._id ? "Edit Dispatch Note Section Detail" : "Add Dispatch Note Section Detail"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-md-6">
            <label>Drawing No.</label>
            <input
              type="text"
              className="form-control"
              name="drawing_no"
              onChange={handleChange}
            />
            <div className="error">{error?.drawing_no_err}</div>
          </div>
          <div className="col-md-6">
            <label>Rev No.</label>
            <input
              type="text"
              className="form-control"
              name="rev"
              onChange={handleChange}
            />
            <div className="error">{error?.rev_err}</div>
          </div>
          {/* Item Dropdown */}
          <div className="col-md-6">
            <label>Item</label>
            <select
              className="form-control"
              name="item_id"
              value={dispatchNoteSectionDetail.item_id}
              onChange={handleChange}
            >
              <option value="">Select Item</option>
              {itemData.map(item => (
                <option key={item._id} value={item._id}>
                  {item.item_name} (size1: {item.size1?.name || ""} thickness1: {item.thickness1?.name || ""}) (size2: {item.size2?.name || ""} thickness2: {item.thickness2?.name || ""})
                </option>
              ))}
            </select>
            <div className="error">{error?.item_id_err}</div>
          </div>

          <div className="col-md-6">
            <label>Size 1</label>
            <input
              type="text"
              className="form-control"
              name="size1"
              value={dispatchNoteSectionDetail.size1}
              disabled
            />

          </div>

          <div className="col-md-6">
            <label>Thickness 1</label>
            <input
              type="text"
              className="form-control"
              name="thickness1"
              value={dispatchNoteSectionDetail.thickness1}
              disabled
            />

          </div>

          <div className="col-md-6">
            <label>Size 2</label>
            <input
              type="text"
              className="form-control"
              name="size2"
              value={dispatchNoteSectionDetail.size2}
              disabled
            />

          </div>

          <div className="col-md-6">
            <label>Thickness 2</label>
            <input
              type="text"
              className="form-control"
              name="thickness2"
              value={dispatchNoteSectionDetail.thickness2}
              disabled
            />

          </div>

          <div className="col-md-6">
            <label>UOM</label>
            <input
              type="text"
              className="form-control"
              name="uom"
              value={dispatchNoteSectionDetail.uom}
              disabled
            />

          </div>
          <div className="col-md-6">
            <label>Area (SQM)</label>
            <input
              type="text"
              className="form-control"
              name="area_sqm"
              onChange={handleChange}
            />
            <div className="error">{error?.area_sqm_err}</div>
          </div>

          <div className="col-md-6">
            <label>Qty</label>
            <input
              type="text"
              className="form-control"
              name="qty"
              onChange={handleChange}
            />
            <div className="error">{error?.qty_err}</div>
          </div>

          <div className="col-md-6">
            <label>
              Piping Class <span className="login-danger">*</span>
            </label>
            <select
              className="form-control"
              name="piping_class"
              value={dispatchNoteSectionDetail.piping_class}
              onChange={handleChange}
            >
              <option value="">-- Select Piping Class --</option>
              {pipingClassData.map(pclass => (
                <option key={pclass._id} value={pclass._id}>
                  {pclass.PipingClass}
                </option>
              ))}
            </select>
            <div className="error">{error?.piping_class_err}</div>
          </div>

          <div className="col-md-6">
            <label>
              Service <span className="login-danger">*</span>
            </label>
            <select
              className="form-control"
              name="service_id"
              value={dispatchNoteSectionDetail.service_id}
              onChange={handleChange}
            >
              <option value="">-- Select Service --</option>
              {availableServices.map(service => (
                <option key={service._id} value={service._id}>
                  {service.service}
                </option>
              ))}
            </select>
            <div className="error">{error?.service_err}</div>
          </div>


          <div className="col-md-6">
            <label> Piping Material Specification{" "} <span className="login-danger">*</span> </label>
            <input
              className="form-control"
              type="text"
              value={dispatchNoteSectionDetail.piping_material_specification?.name || ""}
              disabled
            />

            <div className="error">
              {error?.PipingMaterialSpecification_err}
            </div>
          </div>

          <div className="col-md-6">
            <label>Final Coat Ral No</label>
            <input
              type="text"
              className="form-control"
              value={dispatchNoteSectionDetail.shadeRalNo || ""}
              disabled
            />
          </div>

          {/* <div className="col-md-6">
            <label>Paint System No.</label>
            <select
              className="form-control"
              name="paint_system"
              value={dispatchNoteSectionDetail.paint_system}
              onChange={handleChange}
            >
              <option value="">Select Paint System No.</option>
              {paintRequirements.map(p => (
                <option key={p._id} value={p._id}>
                  {p.paint_system_no}
                </option>
              ))}
            </select>
            <div className="error">{error?.paint_system_no_err}</div>
          </div> */}

          <div className="col-md-12">
            <label>Remarks</label>
            <input
              type="text"
              className="form-control"
              name="remarks"
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          {dispatchNoteSectionDetail._id ? "Update" : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DispatchNoteSectionDetailModal;
