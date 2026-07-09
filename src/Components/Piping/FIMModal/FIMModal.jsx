import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getItemCategory } from "../../../Store/Piping/ItemCategory/ItemCategory";
import { V_URL } from '../../../BaseUrl';
import UploadFile from '../../Piping/DrawingModal/DownloadFormat/UploadFile';
import { clearFIMItems, getFIMidData } from '../../../Store/Piping/FIM/OneFimListItem';


const FimItemModal = ({ show, handleClose, handleSaveModal, handleUpload, editData, itemData = [], categories = [], pipingMaterialSpecificationData, uploadFile, handleFileChange, data, finalId }) => {


  const [formData, setFormData] = useState({
    _id: "",
    item_id: "",
    item_description: "",
    item_category: "",
    piping_material_specification: "",
    size1: "",
    thickness1: "",
    size2: "",
    thickness2: "",
    material_grade: "",
    uom: "",
    fim_list_qty: "",
    received_qty: "",
    hsn_sac: "",
    rate: "",
    gst: "",
    total_amount: "",
    remarks: "",
  });
  const [pmsList, setPmsList] = useState([]);
  console.log("formdata", formData);

  // When user selects category, filter items
  const filteredItems = Array.isArray(itemData)
    ? itemData.filter((it) => {
      if (!formData.item_category) return true;

      const catId =
        typeof it.item_category === "object"
          ? it.item_category?._id
          : it.item_category;

      return catId === formData.item_category;
    })
    : [];

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      item_category: value,
      item_id: "",
      item_description: "",
    }));
  };

  const handleItemChange = (e) => {
    const value = e.target.value;

    const selectedItem = itemData.find(
      (it) =>
        it._id === value ||
        it.item_id === value ||
        it.item_id?._id === value
    );

    setFormData((prev) => ({
      ...prev,
      item_id: value,
      item_description: selectedItem?.item_description || "",
      piping_material_specification:
        selectedItem?.piping_material_specification?._id || "",

      // UOM + Material Grade
      uom: selectedItem?.uom?.name || "",
      material_grade: selectedItem?.material_grade || "",

      // 🔥 Correct extraction for your SIZE + THICKNESS objects
      size1: selectedItem?.size1?.name || "",
      thickness1: selectedItem?.thickness1?.name || "",

      size2: selectedItem?.size2?.name || "",
      thickness2: selectedItem?.thickness2?.name || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ---- 1) ITEM AUTO FILL ----
    if (name === "item_id") {
      const selectedItem = (Array.isArray(itemData) ? itemData : []).find(
        (i) => i._id.toString() === value
      );

      setFormData((prev) => ({
        ...prev,
        item_id: value,
        item_description: selectedItem?.item_description || "",
        piping_material_specification:
          selectedItem?.piping_material_specification || "",
        size1: selectedItem?.size1?.name || "",
        thickness1: selectedItem?.thickness1?.name || "",
        size2: selectedItem?.size2?.name || "",
        thickness2: selectedItem?.thickness2?.name || "",
        material_grade: selectedItem?.material_grade || prev.material_grade,
        uom: selectedItem?.uom?.name || prev.uom,
        hsn_sac: selectedItem?.hsn_sac || "",
        rate: selectedItem?.rate || "",
        gst: selectedItem?.gst || "",
        total_amount: selectedItem?.total_amount || "",
        remarks: selectedItem?.remarks || "",
      }));

      return;
    }

    // ---- 2) AUTO CALCULATE TOTAL USING received_qty ----
    if (name === "rate" || name === "received_qty" || name === "gst") {
      const qty =
        name === "received_qty" ? value : formData.received_qty || 0;
      const rate =
        name === "rate" ? value : formData.rate || 0;

      const gstPercent =
        name === "gst" ? Number(value) : Number(formData.gst || 0);

      const subtotal = Number(qty) * Number(rate);
      const gstAmount = (subtotal * gstPercent) / 100;
      const total = subtotal + gstAmount;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        total_amount: total.toFixed(2),
      }));

      return;
    }

    // ---- 3) NORMAL UPDATE ----
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    const fetchPMS = async () => {
      try {
        const projectId = localStorage.getItem('U_PROJECT_ID');

        const res = await axios.post(
          `${V_URL}/user/piping-material-specification/get-piping-material-specification?project=${projectId}`,

          // const res = await axios.post(
          //   `${V_URL}/user/piping-material-specification/get-piping-material-specification`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
            },
          }
        );

        setPmsList(res.data?.data?.pipingmaterialspecifications || []);
      } catch (err) {
        console.error("PMS fetch failed", err);
      }
    };

    fetchPMS();
  }, []);

  // console.log("itemdata", itemData);

  const [error, setError] = useState({});
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.getPipingFimData);

  useEffect(() => {
    dispatch(getItemCategory());
  }, [dispatch]);

  // Populate when editing
  useEffect(() => {
    if (editData && Object.keys(editData).length > 0 && itemData?.length > 0) {
      const itemId =
        typeof editData.item_id === "object"
          ? editData.item_id?._id?.toString()
          : editData.item_id?.toString();

      const selectedItem = itemData.find(
        (item) => item._id.toString() === itemId
      );

      setFormData({
        _id: editData._id || "",
        item_category: selectedItem?.item_category?._id?.toString() || "",
        item_id: itemId || "",
        item_description: selectedItem?.item_description || "",
        piping_material_specification:
          editData?.piping_material_specification?._id || "",
        size1: selectedItem?.size1?.name || "",
        thickness1: selectedItem?.thickness1?.name || "",
        size2: selectedItem?.size2?.name || "",
        thickness2: selectedItem?.thickness2?.name || "",
        material_grade: selectedItem?.material_grade || "",
        uom: selectedItem?.uom?.name || "",
        fim_list_qty: editData.fim_list_qty || "",
        received_qty: editData.received_qty || "",
        hsn_sac: editData.hsn_sac || "",
        rate: editData.rate || "",
        gst: editData.gst || "",
        total_amount: editData.total_amount || "",
        remarks: editData.remarks || "",
      });
    } else {
      setFormData({
        _id: "",
        item_id: "",
        item_description: "",
        item_category: "",
        piping_material_specification: "",
        size1: "",
        thickness1: "",
        size2: "",
        thickness2: "",
        material_grade: "",
        uom: "",
        fim_list_qty: "",
        received_qty: "",
        hsn_sac: "",
        rate: "",
        gst: "",
        total_amount: "",
        remarks: "",
      });
    }
  }, [editData, itemData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.item_category) newErrors.item_category_err = "Item Category is required";
    if (!formData.item_id) newErrors.item_id_err = "Item is required";
    if (!formData.piping_material_specification) newErrors.piping_material_specification_err = "PMS is required";
    if (!formData.fim_list_qty || Number(formData.fim_list_qty) <= 0) newErrors.fim_list_qty_err = "FIM List Qty must be greater than 0";
    if (!formData.received_qty || Number(formData.received_qty) < 0) newErrors.received_qty_err = "Received Qty must be valid";
    if (formData.rate === "" || formData.rate === null || formData.rate === undefined || isNaN(Number(formData.rate))) {
      newErrors.rate_err = "Rate is required";
    }
    if (!formData.gst && formData.gst !== 0) newErrors.gst_err = "GST is required";

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSaveClick = (addMore = false) => {
    if (!validateForm()) return; // 🚫 Stop if invalid

    handleSaveModal(formData, addMore);

    if (addMore) {
      setFormData({
        _id: "",
        item_category: "",
        item_id: "",
        item_description: "",
        piping_material_specification: "",
        size1: "",
        thickness1: "",
        size2: "",
        thickness2: "",
        material_grade: "",
        uom: "",
        fim_list_qty: "",
        received_qty: "",
        hsn_sac: "",
        rate: "",
        gst: "",
        total_amount: "",
        remarks: "",
      });
      setError({});
    } else {
      handleClose();
    }
  };

  console.log("finalId in modal", finalId);


  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>{formData._id ? "Edit Item" : "Add Item"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* File Upload */}
        <div className="row mb-4">
          <div className="col-12">
            <UploadFile
              url={`${V_URL}/user/import-fim-items`}

              FIMformData={{
                fim_packing_id: finalId,
              }}

              onUploadSuccess={() => {
                dispatch(getFIMidData({ id: finalId }));
                handleClose();
              }}
              isProject={localStorage.getItem("U_PROJECT_ID")}
            />
          </div>
        </div>



        {/* Manual Form */}
        <div className="row">
          {/* Item Category */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Item Category <span className="login-danger">*</span></label>
              <select
                className="form-control"
                value={formData.item_category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="error">{error.item_category_err}</div>


            </div>
          </div>


          {/* Item */}
          <div className="col-12 col-md-6">
            <div className="input-block local-top-form">
              <label className="local-top">
                Item <span className="login-danger">*</span>
              </label>

              <select
                className="form-control"
                value={formData.item_id}
                onChange={handleItemChange}
              >
                <option value="">Select Item</option>
                {filteredItems.map((it) => (
                  <option key={it._id} value={it._id}>
                    {it.item_name}(size1: {it.size1?.name || ""} thickness1: {it.thickness1?.name || ""}) (size2: {it.size2?.name || ""} thickness2: {it.thickness2?.name || ""})
                  </option>
                ))}
              </select>

              <div className="error">{error.item_id_err}</div>
            </div>
          </div>

          {/* Item Description */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Item Description</label>
              <input
                className="form-control"
                type="text"
                value={formData.item_description}
                disabled
              />
            </div>
          </div>

          {/* Size */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Size 1</label>
              <input
                className="form-control"
                type="text"
                value={formData.size1}
                disabled
              />
            </div>
          </div>

          {/* Thickness */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Thickness 1</label>
              <input
                className="form-control"
                type="text"
                value={formData.thickness1}
                disabled
              />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Size 2</label>
              <input
                className="form-control"
                type="text"
                value={formData.size2}
                disabled
              />
            </div>
          </div>

          {/* Thickness */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Thickness 2</label>
              <input
                className="form-control"
                type="text"
                value={formData.thickness2}
                disabled
              />
            </div>
          </div>

          <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-top-form">
              <label className="local-top">Piping Material Specification <span className="login-danger">*</span></label>
              <select
                className="form-control"
                name="piping_material_specification"
                value={formData.piping_material_specification}
                onChange={handleChange}
              >
                <option value="">Select PMS</option>
                {pmsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="error">{error.piping_material_specification_err}</div>
            </div>
          </div>

          {/* Material Grade */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Material Grade</label>
              <input
                className="form-control"
                type="text"
                value={formData.material_grade}
                disabled
              />
            </div>
          </div>

          {/* UOM */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">UOM</label>
              <input
                className="form-control"
                type="text"
                value={formData.uom}
                disabled
              />
            </div>
          </div>

          {/* FIM List Qty */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">FIM List Qty <span className="login-danger">*</span></label>
              <input
                className="form-control"
                type="number"
                name="fim_list_qty"
                value={formData.fim_list_qty}
                onChange={handleChange}
              />
              <div className="error">{error.fim_list_qty_err}</div>
            </div>
          </div>

          {/* Received Qty */}
          <div className="col-12 col-md-4">
            <div className="input-block local-top-form">
              <label className="local-top">Received Qty <span className="login-danger">*</span></label>
              <input
                className="form-control"
                type="number"
                name="received_qty"
                value={formData.received_qty}
                onChange={handleChange}
              />
              <div className="error">{error.received_qty_err}</div>
            </div>
          </div>

          <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-top-form">
              <label className="local-top">HSC/SAC</label>
              <input
                className="form-control"
                type="text"
                name="hsn_sac"
                value={formData.hsn_sac}
                onChange={handleChange}
              />
              {/* <div className="error">{error.hsn_sac_err}</div> */}
            </div>
          </div>


          <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-top-form">
              <label className="local-top">Rate <span className="login-danger">*</span> </label>
              <input
                className="form-control"
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
              />
              <div className="error">{error.rate_err}</div>
            </div>
          </div>

          <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-top-form">
              <label className="local-top">GST (%) <span className="login-danger">*</span></label>
              <input
                className="form-control"
                type="number"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
              />
              <div className="error">{error.gst_err}</div>
            </div>
          </div>


          <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-top-form">
              <label className="local-top">Total Amount </label>
              <input
                className="form-control"
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>

          <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-top-form">
              <label className="local-top">Remarks <span className="login-danger">*</span></label>
              <input
                className="form-control"
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
              <div className="error">{error.remarks_err}</div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-primary" onClick={() => handleSaveClick(false)}>
          Save
        </button>
        <button className="btn btn-success" onClick={() => handleSaveClick(true)}>
          Save & Add More
        </button>
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default FimItemModal;
