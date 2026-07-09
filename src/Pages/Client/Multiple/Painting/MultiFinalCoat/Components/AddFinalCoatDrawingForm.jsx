
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import { getAdminItem } from '../../../../../../Store/Store/Item/AdminItem';
import { getMainStoreStock } from '../../../../../../Store/Store/MainStore/MainStock';
import { GetMultiGenReleaseNote } from "../../../../../../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote";
// import { managePacking } from '../../../../../../Store/MutipleDrawing/MultiPacking/ManagePacking';
// import { managePackingList } from '../../../../../../Store/MutipleDrawing/MultiPacking/ManagePackingList'; // This is the import you want to ensure is called
import { manageFinalCoatOffer } from '../../../../../../Store/MutipleDrawing/MultiFinalCoat/ManageFinalCoat';
import { getMultiFinalCoat } from '../../../../../../Store/MutipleDrawing/MultiFinalCoat/GetMultiFinalCoat';

const AddFinalCoatDrawingForm = ({ modalOpen, handleModalClose ,paintNo, handleAddMore, handleCloseModal, editeMode, onSaveItem, updateItem, editItem, modalMode }) => {
    const dispatch = useDispatch();
    const [entity, setEntity] = useState([]);
    const [err, setError] = useState({});
    // The tableData state might be better managed in the parent component if this modal
    // is only for adding/editing individual items.
    // const [tableData, setTableData] = useState([]);
    const [item, setItem] = useState({
        item_id: '',
        item_name: '',
        assembly_no: "",
        drawing_no: "",
        grid_no: "",    
        fc_used_grid_qty: 0,
        dispatch_no: "",
        unit_assembly_weight: 0,
        total_assembly_weight: 0,
        remarks: "",
    });

    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const mainStoreStock = useSelector((state) => state.getMainStoreStock?.user?.data || []);
    const filteredData = itemDetails?.find((it) => it?._id === item?.item_id);
    const currentStock = mainStoreStock?.find(item => item.ItemId === filteredData?._id) || {};
    const availableBalance = currentStock.balance || 0;

    useEffect(() => {
        const currentFilteredData = itemDetails?.find((it) => it?._id === item?.item_id);
        if (currentFilteredData) {
            dispatch(getMainStoreStock({ itemId: currentFilteredData?._id }));
        }

        // When in 'edit' mode, if an item is being updated, populate the form
        if (modalMode === "edit" && updateItem) {
            setItem({
                item_id: updateItem?._id || '',
                item_name: updateItem?.name || '',
                assembly_no: updateItem?.assembly_no || '',
                grid_no: updateItem?.grid_no || '',
                dispatch_no: updateItem?.dispatch_no || '',
                fc_used_grid_qty: updateItem?.fc_used_grid_qty || 0,
                unit_assembly_weight: updateItem?.unit_assembly_weight || 0,
                total_assembly_weight: updateItem?.total_assembly_weight || 0,
                remarks: updateItem?.remarks || '',
                drawing_no: updateItem?.drawing_no || '',
            });
        }
        // When initially entering 'editMode' with an existing editItem
        else if (editeMode && editItem) {
            setItem({
                item_id: editItem?._id || '',
                item_name: editItem?.name || '',
                assembly_no: editItem?.assembly_no || '',
                grid_no: editItem?.grid_no || '',
                dispatch_no: editItem?.dispatch_no || '',
                fc_used_grid_qty: editItem?.fc_used_grid_qty || 0,
                unit_assembly_weight: editItem?.unit_assembly_weight || 0,
                total_assembly_weight: editItem?.total_assembly_weight || 0,
                remarks: editItem?.remarks || '',
                drawing_no: editItem?.drawing_no || '',
            });
        }
        // When adding a new item, ensure the form is reset
        else if (modalMode === "add" && !editItem && !updateItem) {
            setItem({
                item_id: '',
                item_name: '',
                assembly_no: "",
                drawing_no: "",
                fc_used_grid_qty: 0,
                dispatch_no: "",
                grid_no: "",
                unit_assembly_weight: 0,
                total_assembly_weight: 0,
                remarks: "",
            });
        }
    }, [item?.item_id, updateItem, modalMode, editeMode, editItem, itemDetails, dispatch]);


    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
    }, [dispatch]);

    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        handleModalClose();
        handleReset(); // Reset form when modal closes
    };

    const validationModal = () => {
        let isValid = true;
        let newErrors = {}; // Renamed from 'err' to avoid confusion with state 'err'

        if (!item.item_name?.trim()) {
            isValid = false;
            newErrors['item_name_error'] = "Please enter an Item name";
        }

        if (!item.grid_no?.trim()) {
            isValid = false;
            newErrors['grid_no_err'] = "Please enter a Grid No";
        }

        if (!item.unit_assembly_weight || isNaN(item.unit_assembly_weight) || parseFloat(item.unit_assembly_weight) <= 0) {
            isValid = false;
            newErrors['unit_assembly_weight_error'] = "Please enter a valid unit assembly weight";
        }

        if (!item.total_assembly_weight || isNaN(item.total_assembly_weight) || parseFloat(item.total_assembly_weight) <= 0) {
            isValid = false;
            newErrors['total_assembly_weight_error'] = "Please enter a valid total assembly weight";
        }

        if (!item.fc_used_grid_qty || isNaN(item.fc_used_grid_qty) || parseInt(item.fc_used_grid_qty) <= 0) {
            isValid = false;
            newErrors['fc_used_grid_qty_error'] = "Please enter a valid Qty";
        }
        // If drawing_no and irn_no are truly optional, keep them commented out
        // if (!item.drawing_no?.trim()) {
        //     isValid = false;
        //     newErrors['drawing_no_error'] = "Please enter a Drawing No";
        // }
        // if (!item.irn_no?.trim()) {
        //     isValid = false;
        //     newErrors['irn_no_error'] = "Please enter an IRN";
        // }

        setError(newErrors);
        console.log("error", newErrors);
        return isValid;
    };

    const handleReset = () => {
        setItem({
            item_id: '',
            item_name: '',
            assembly_no: "",
            drawing_no: "",
            fc_used_grid_qty: 0,
            dispatch_no: "",
            grid_no: "",
            unit_assembly_weight: 0,
            total_assembly_weight: 0,
            remarks: "",
        });
        setError({}); // Clear errors on reset
    };

const handleSaveSingleItemToAPI = async () => {
  if (!validationModal()) return;

  const formattedItemForAPI = [{
    item_name: item.item_name,
    assembly_no: item.assembly_no,
    grid_no: item.grid_no,
    dispatch_no: item.dispatch_no,
    project_id: item.project_id,
    fc_used_grid_qty: Number(item.fc_used_grid_qty),
    unit_assembly_weight: Number(item.unit_assembly_weight),
    total_assembly_weight: Number(item.total_assembly_weight),
    drawing_no: item.drawing_no,
    remarks: item.remarks,
  }];

  const bodyFormData = new URLSearchParams();
  bodyFormData.append('items', JSON.stringify(formattedItemForAPI));
  if (paintNo) bodyFormData.append('paint_system_id', paintNo);

  try {
    await dispatch(manageFinalCoatOffer({ bodyFormData })).unwrap();
    if (paintNo) await dispatch(getMultiFinalCoat({ paint_system_id: paintNo })).unwrap();
    toast.success("Drawing details saved successfully.");
    handleReset();
    handleClose();
  } catch (error) {
    toast.error("Failed to save drawing details. Please try again.");
    console.error("API Save error:", error);
  }
};


    // This function will handle adding the current item to a list (presumably in parent)
    const handleAddMoreItemToList = () => {
        if (validationModal()) {
            const newItem = { ...item, id: Date.now() }; // Add a unique ID for list management
            handleAddMore(newItem); // Call the parent's handleAddMore
            handleReset(); // Reset form for next item
        }
    };

    return (
        <Modal
            show={modalOpen}
            backdrop="static"
            size="lg"
            keyboard={false}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Drawing Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Drawing No
                                                    <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="drawing_no"
                                                    value={item.drawing_no}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.drawing_no_error}</div>
                                            </div>

                                        </div>

                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Item
                                                    <span className="login-danger">*</span>
                                                </label>
                                                {/* Consider using a Dropdown for item_id if item_name is derived */}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="item_name"
                                                    value={item.item_name}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.item_name_error}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">

                                            <div className="input-block local-forms">
                                                <label>
                                                    Grid No
                                                    <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="grid_no"
                                                    value={item.grid_no}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.grid_no_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Qty <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="fc_used_grid_qty"
                                                    value={item.fc_used_grid_qty}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.fc_used_grid_qty_error}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Dispatch No
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="dispatch_no"
                                                    value={item.dispatch_no}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.dispatch_no_error}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>

                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Unit Assem. Weight(kg).
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="unit_assembly_weight"
                                                    value={item.unit_assembly_weight}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.unit_assembly_weight_error}</div>
                                            </div>


                                        </div>

                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Total Assem. Weight(kg).
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="total_assembly_weight"
                                                    value={item.total_assembly_weight}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.total_assembly_weight_error}</div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className='row'>
                                        <div className="col-12">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Remarks
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="remarks"
                                                    value={item.remarks}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.remarks_error}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                        <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        {/* In edit mode, clicking save should update the current item */}
                        {modalMode === "edit" ? (
                            <button
                                type="button"
                                className="btn btn-primary submit-form ms-2"
                                onClick={handleSaveSingleItemToAPI} // Directly call API for update
                            >
                                Save Changes
                            </button>
                        ) : (
                            <>
                                {/* In add mode, "Save" should save the current item to API and close */}
                                <button
                                    type="button"
                                    className="btn btn-primary submit-form ms-2"
                                    onClick={handleSaveSingleItemToAPI}
                                >
                                    Save
                                </button>
                                {/* "Add More" should add to a list without closing the modal */}
                                {!editeMode && ( // editeMode is likely same as modalMode === "edit"
                                    <button
                                        type="button"
                                        className="btn btn-primary submit-form ms-2"
                                        onClick={handleAddMoreItemToList}
                                    >
                                        Add More
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Modal.Footer>

        </Modal>
    );
};

export default AddFinalCoatDrawingForm;