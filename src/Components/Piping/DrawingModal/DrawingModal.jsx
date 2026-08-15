import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { V_URL } from '../../../BaseUrl';
import UploadFile from '../../Piping/DrawingModal/DownloadFormat/UploadFile';
import { getUserJointType } from '../../../Store/Store/JointType/JointType';
import { getMaterialEntryItems } from '../../../Store/Piping/Drawing/getMaterialEntryItems';
import { getItemCategory } from '../../../Store/Piping/ItemCategory/ItemCategory';

const DrawingModal = ({
  show,
  handleClose,
  itemData = [],
  handleSaveModal,
  editData,
  drawId,
  finalId,
}) => {
  // defensive: itemData may be an object with `.data` or an array itself
  const safeItemData = Array.isArray(itemData?.data)
    ? itemData.data
    : Array.isArray(itemData)
    ? itemData
    : [];
console.log("safeItemData",safeItemData);
  const dispatch = useDispatch();

  const [drawModal, setDrawModal] = useState({
    item_category: '',
    item: '',
    qty: '',
    item_description: '',
    size1: '',
    thickness1: '',
    size2: '',
    thickness2: '',
    material_grade: '',
    uom: '', 
    project: '',
  });

  const [error, setError] = useState({});


  // Redux store data
  const categoryData = useSelector(
    (state) => state?.getItemCategory?.user?.data || []
  );

  useEffect(() => {
    dispatch(getUserJointType({ status: true }));
    dispatch(getItemCategory());
  }, [dispatch]);

  /** ───────────── EDIT MODE ───────────── **/
  useEffect(() => {
    if (editData) {
      const filterData = safeItemData?.find((it) => it?._id === editData?.item?._id);
// console.log("filterData",filterData)
      setDrawModal({
        item_category: filterData?.item_category?._id || '',
        
        item: editData?.item?._id || '',
        qty: editData?.qty || '',
        item_description: filterData?.item_description || '',
        // store human-readable strings only to avoid React object render errors
        size1: filterData?.size1?.name || filterData?.size1 || '',
        thickness1: filterData?.thickness1?.name || filterData?.thickness1 || '',

        // size2: filterData?.size2?.name || (filterData?.size2 ?? 'N/A'),
        // thickness2: filterData?.thickness2?.name || (filterData?.thickness2 ?? 'N/A'),

         size2: filterData?.size2?.name || filterData?.size2 || '',
        thickness2: filterData?.thickness2?.name || filterData?.thickness2 || '',

        material_grade: filterData?.material_grade || '',
        uom: filterData?.uom?.name || filterData?.uom || '',
      });
    }
  }, [editData, safeItemData]);

  console.log("Drawing edit daa",drawModal);

  console.log("edit data",editData);
  /** ───────────── ITEM CHANGE ───────────── **/
  useEffect(() => {
    if (drawModal.item) {
      const filterData = safeItemData?.find((it) => it?._id === drawModal.item);

      if (filterData) {
        setDrawModal((prev) => ({
          ...prev,
          item_category: filterData?.item_category?._id || prev.item_category,
          item_description: filterData?.item_description || '',
          size1: filterData?.size1?.name || filterData?.size1 || '',
          thickness1: filterData?.thickness1?.name || filterData?.thickness1 || '',
          size2: filterData?.size2?.name || filterData?.size2 || '',
          thickness2: filterData?.thickness2?.name || filterData?.thickness2 || '',
          material_grade: filterData?.material_grade || '',
          uom: filterData?.uom?.name || filterData?.uom || '',
        }));
      }
    }
  }, [drawModal.item, safeItemData]);

  /** ───────────── RESET FORM ON MODAL OPEN ───────────── **/
useEffect(() => {
  if (show && !editData) {
    // Only reset if not in edit mode
    setDrawModal({
      item_category: '',
      item: '',
      qty: '',
      item_description: '',
      size1: '',
      thickness1: '',
      size2: '',
      thickness2: '',
      material_grade: '',
      uom: '',
      project: '',
    });
    setError({});
  }
}, [show]);


  /** ───────────── CLOSE MODAL ───────────── **/
  const handleCloseModal = () => {
    setError({});
    handleClose();
  };
const prevShowRef = React.useRef(false);

useEffect(() => {
  // Reset ONLY when modal opens
  if (!prevShowRef.current && show && !editData) {
    setDrawModal({
      item_category: '',
      item: '',
      qty: '',
      item_description: '',
      size1: '',
      thickness1: '',
      size2: '',
      thickness2: '',
      material_grade: '',
      uom: '',
      project: '',
    });
    setError({});
  }

  prevShowRef.current = show;
}, [show, editData]);

  
  /** ───────────── HANDLE CHANGE ───────────── **/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrawModal((prev) => ({ ...prev, [name]: value }));
  };

  /** ───────────── CLEAR FIELDS ───────────── **/
  const handleClear = () => {
    setDrawModal({
      item_category: '',
      item: '',
      qty: '',
      item_description: '',
      size1: '',
      thickness1: '',
      size2: '',
      thickness2: '',
      material_grade: '',
      uom: '',
    });
    setError({});
  };

  
  /** ───────────── VALIDATION ───────────── **/
  const validation = () => {
    let isValid = true;
    let err = {};
    if (!drawModal?.item_category) {
      isValid = false;
      err['item_category_err'] = 'Please select Item Category';
    }
    if (!drawModal?.item) {
      isValid = false;
      err['item_err'] = 'Please select Item';
    }
    if (!drawModal?.qty) {
      isValid = false;
      err['qty_err'] = 'Please enter quantity';
    }
    setError(err);
    return isValid;
  };

  /** ───────────── SUBMIT ───────────── **/
  const handleSubmit = (addMore = false) => {
    if (validation()) {
      const payload = {
        ...drawModal,
        _id: editData?._id || '',
      };

      if (addMore) {
        handleSaveModal(payload, true);
        handleClear();
      } else {
        handleCloseModal();
        handleSaveModal(payload, false);
        handleClear();
      }
    }
  };

  
  /** ───────────── FILTER ITEMS BY CATEGORY ───────────── **/
  const filteredItems = safeItemData.filter(
    (item) => item?.item_category?._id === drawModal.item_category
  );

  return (
    <Modal show={show} onHide={handleCloseModal} size="xl" backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Item Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="material-section">
          <div className="row mb-4">
            <div className="col-12">
              <UploadFile
                url={`${V_URL}/user/import-material-entry-items`}
                formData={{ drawing_id: drawId }}
                onUploadSuccess={() => {
                  dispatch(getMaterialEntryItems({ drawing_id: drawId }));
                  handleClose();
                }}
                isProject={localStorage.getItem('U_PROJECT_ID')}
              />
            </div>
          </div>

          {/* Category + Item selects */}
          <div className="row gy-3">
            <div className="col-12 col-md-6">
              <div className="input-block local-top-form">
                <label className="local-top">
                  Item Category <span className="login-danger">*</span>
                </label>
                <select
                  className="form-control form-select"
                  name="item_category"
                  value={drawModal.item_category}
                  onChange={handleChange}
                >
                  <option value="">Select Item Category</option>
                  {categoryData.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="error">{error.item_category_err}</div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="input-block local-top-form">
                <label className="local-top">
                  Item <span className="login-danger">*</span>
                </label>
                <select
                  className="form-control form-select"
                  name="item"       
                  value={drawModal.item}
                  onChange={handleChange}
                  disabled={!drawModal.item_category}
                >
                  <option value="">Select Item</option>
                  {filteredItems.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.item_name} (Size1: {e.size1?.name || e.size1 || 'NA'}, Thk1: {e.thickness1?.name || e.thickness1 || 'NA'})  (Size2: {e.size2?.name || e.size2 || 'NA'}, Thk2: {e.thickness2?.name || e.thickness2 || 'NA'},)
                    </option>
                  ))}
                </select>
                <div className="error">{error.item_err}</div>
              </div>
            </div>
          </div>

          {/* Auto-filled read-only fields */}
          {drawModal.item && (
            <>
              <div className="row mt-3">
                <div className="col-md-4">
                  <label>Item Description</label>
                  <input className="form-control" value={drawModal.item_description || '-'} disabled />
                </div>

                <div className="col-md-4">
                  <label>Size 1</label>
                  <input className="form-control" value={drawModal.size1 || '-'} disabled />
                </div>

                <div className="col-md-4">
                  <label>Thickness 1</label>
                  <input className="form-control" value={drawModal.thickness1 || '-'} disabled />
                </div>

                 <div className="col-md-4">
                  <label>Size 2</label>
                  <input className="form-control" value={drawModal.size2 || 'N/A'} disabled />
                </div>

                <div className="col-md-4">
                  <label>Thickness 2</label>
                  <input className="form-control" value={drawModal.thickness2 || 'N/A'} disabled />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-4">
                  <label>Material Grade</label>
                  <input className="form-control" value={drawModal.material_grade || '-'} disabled />
                </div>

                <div className="col-md-4">
                  <label>UOM</label>
                  <input className="form-control" value={drawModal.uom || '-'} disabled />
                </div>

                <div className="col-md-4">
                  <label>
                    Qty <span className="login-danger">*</span>
                  </label>
                  <input className="form-control" type="number" name="qty" value={drawModal.qty} onChange={handleChange} />
                  <div className="error">{error.qty_err}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-primary" onClick={() => handleSubmit(false)}>
          Save
        </button>

        {/* <button className="btn btn-outline-primary m-2" onClick={() => handleSubmit(true)}>
          Add More
        </button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default DrawingModal;
