import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";

const MaterialControlItemModalClient = ({
  show,
  handleClose,
  handleSaveModal,
  editData,
  itemData,
  areasData,
  mtoId,
}) => {

  const [formData, setFormData] = useState({
    id: "",
    item_id: "",
    item_description: "",
    size1: "",
    thickness1: "",
    size2: "",
    thickness2: "",
    material_grade: "",
    ClientMtoQty: "",
    continegancy: "",
    MTOwithContinegancy: "",
    ExistingAvailableQty: "",
    OrderQty: "",
    remarks: "",
  });
  console.log("itemData in Modal:", itemData);
  console.log("editData in Modal:", editData);


  const isEditing = editData && Object.keys(editData).length > 0;


  useEffect(() => {
    if (isEditing && editData) {
      const itemId =
        editData?.item_id?._id || editData?.item_id || "";

      const selectedItem = itemData.find(
        (item) => item._id === itemId
      );

      setFormData({
        id: editData.id || "",
        mto_id: editData.mto_id || mtoId || "",
        item_id: itemId,

        // ✅ ALWAYS FETCH FROM itemData
        item_description: selectedItem?.item_description || "",
        size1: selectedItem?.size1?.name || "",
        thickness1: selectedItem?.thickness1?.name || "",
        size2: selectedItem?.size2?.name || "",
        thickness2: selectedItem?.thickness2?.name || "",
        material_grade: selectedItem?.material_grade || "",

        ClientMtoQty: editData?.ClientMtoQty ?? "",
        continegancy: editData?.continegancy ?? "",
        MTOwithContinegancy: editData?.MTOwithContinegancy ?? "",
        ExistingAvailableQty: editData?.ExistingAvailableQty ?? "",
        OrderQty: editData?.OrderQty ?? "",
        remarks: editData?.remarks || "",
      });

    }
  }, [editData, itemData, mtoId, isEditing]);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev };

      // ✅ Keep item auto-populate logic
      if (name === "item_id") {
        const selectedItem = itemData.find(
          (item) => item._id === value
        );

        return {
          ...updated,
          item_id: value,
          item_description: selectedItem?.item_description || "",
          size1: selectedItem?.size1?.name || "",
          thickness1: selectedItem?.thickness1?.name || "",
          size2: selectedItem?.size2?.name || "",
          thickness2: selectedItem?.thickness2?.name || "",
          material_grade: selectedItem?.material_grade || "",
        };

        // return updated; // ⛔ stop here (no calculation needed)
      }

      // ✅ Normal field update
      updated[name] = value;

      // 🔢 Calculation fields
      const clientQty = Number(updated.ClientMtoQty) || 0;
      const contingency = Number(updated.continegancy) || 0;
      const existingQty = Number(updated.ExistingAvailableQty) || 0;

      // ✅ MTO with Contingency
      const mtoWithCont =
        clientQty + (clientQty * contingency) / 100;

      updated.MTOwithContinegancy = mtoWithCont
        ? Math.round(mtoWithCont)
        : "";

      // ✅ Order Qty
      updated.OrderQty =
        updated.MTOwithContinegancy !== ""
          ? Math.max(updated.MTOwithContinegancy - existingQty, 0)
          : "";

      return updated;
    });
  };



  const handleSaveClick = async (addMore = false) => {
    if (!formData.item_id) {
      toast.error("Please select an Item!");
      return;
    }
    const clientQty = Number(formData.ClientMtoQty);
    if (!formData.ClientMtoQty || clientQty <= 0) {
      toast.error("Client MTO Qty must be greater than 0");
      return;
    }
    await handleSaveModal(formData, addMore); // wait for save to finish
    if (addMore) {
      setFormData({
        mto_id: mtoId || "",
        item_id: "",
        item_description: "",
        size1: "",
        thickness1: "",
        size2: "",
        thickness2: "",
        material_grade: "",
        ClientMtoQty: "",
        continegancy: "",
        MTOwithContinegancy: "",
        ExistingAvailableQty: "",
        OrderQty: "",
        remarks: "",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Client MTO Basis Item" : "Add Client MTO Basis Item"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
              {itemData.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.item_name}(size1: {e.size1?.name || ""} thickness1: {e.thickness1?.name || ""}) (size2: {e.size2?.name || ""} thickness2: {e.thickness2?.name || ""})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label>Item Description</label>
            <input
              type="text"
              className="form-control"
              name="item_description"
              value={formData.item_description}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label>Size 1</label>
            <input
              type="text"
              className="form-control"
              name="size1"
              value={formData.size1}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label>Thickness 1</label>
            <input
              type="text"
              className="form-control"
              name="thickness1"
              value={formData.thickness1}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label>Size 2</label>
            <input
              type="text"
              className="form-control"
              name="size2"
              value={formData.size2}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label>Thickness 2</label>
            <input
              type="text"
              className="form-control"
              name="thickness2"
              value={formData.thickness2}
              onChange={handleChange}
              disabled
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
              disabled
            />
          </div>

          <div className="col-md-6">
            <label>Client MTO Qty</label>
            <input
              type="number"
              className="form-control"
              name="ClientMtoQty"
              value={formData.ClientMtoQty}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Continegancy</label>
            <input
              type="text"
              className="form-control"
              name="continegancy"
              value={formData.continegancy}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>MTO with Continegancy (Round Figure)</label>
            <input
              type="text"
              className="form-control"
              name="MTOwithContinegancy"
              value={formData.MTOwithContinegancy || ""}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label>Existing Available Qty (Usable Stock)</label>
            <input
              type="text"
              className="form-control"
              name="ExistingAvailableQty"
              value={formData.ExistingAvailableQty}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Order Qty / Ready for PR Qty</label>
            <input
              type="text"
              className="form-control"
              name="OrderQty"
              value={formData.OrderQty || ""}
              readOnly
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

export default MaterialControlItemModalClient;
