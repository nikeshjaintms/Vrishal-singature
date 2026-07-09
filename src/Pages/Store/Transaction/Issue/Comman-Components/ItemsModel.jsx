import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';
import { getMainStoreStock } from '../../../../../Store/Store/MainStore/MainStock';

const ItemsModel = ({ modalOpen, handleModalClose, handleAddMore, editeMode, handleSave, updateItem, editItem, modalMode }) => {
    const dispatch = useDispatch()
    const [entity, setEntity] = useState([]);
    const [err, setError] = useState({});
    const [item, setItem] = useState({
        item_id: '',
        item_name: '',
        unit: "",
        mcode: "",
        quantity: 0,
        rate: 0,
        amount: 0,
        taxable_amount: 0,
        gst: 0,
        gst_amount: 0,
        total_amount: 0,
        isreturn: "",
        remarks: "",
    });
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    console.log("itemsDetails",itemDetails);
    const mainStoreStock = useSelector((state) => state.getMainStoreStock?.user?.data || []);
    const filteredData = itemDetails?.find((it) => it?._id === item?.item_id);
    const currentStock = mainStoreStock?.find(item => item.ItemId === filteredData?._id) || {};
    const availableBalance = currentStock.balance || 0;

    useEffect(() => {
        const filteredData = itemDetails?.find((it) => it?._id === item?.item_id);
        if (filteredData) {
            dispatch(getMainStoreStock({ itemId: filteredData?._id }))
        }

        if (modalMode === "edit") {
            setItem((prev) => ({
                ...prev,
                item_id: filteredData?._id,
                item_name: filteredData?.name,
                unit: filteredData?.unit?.name,
                mcode: filteredData?.mcode
            }))
        } else {
            setItem((prev) => ({
                ...prev,
                item_id: filteredData?._id,
                item_name: filteredData?.name,
                unit: filteredData?.unit?.name,
                gst: filteredData?.gst_percentage,
                rate: filteredData?.cost_rate,
                mcode: filteredData?.mcode
            }))
        }
    }, [item?.item_id])

    useEffect(() => {
        if (editeMode && editItem) {
            setItem({
                item_id: editItem?.item_id,
                item_name: editItem?.name,
                unit: editItem?.unit,
                mcode: editItem?.mcode,
                quantity: editItem.quantity,
                rate: editItem.rate,
                amount: editItem.amount,
                taxable_amount: editItem.amount,
                gst: editItem.gst,
                gst_amount: editItem.gst_amount,
                isreturn: editItem?.isreturn,
                remarks: editItem?.remarks
            })
        } else {
            setItem({
                item_id: '',
                item_name: '',
                unit: "",
                mcode: "",
                quantity: 0,
                rate: 0,
                amount: 0,
                taxable_amount: 0,
                gst: 0,
                gst_amount: 0,
                total_amount: 0,
                isreturn: "",
                remarks: "",
            })
        }
        if (modalMode === "edit" && updateItem) {
            setItem({
                item_id: updateItem?.item_id,
                item_name: updateItem?.name,
                unit: updateItem?.unit,
                mcode: updateItem?.mcode,
                quantity: updateItem.quantity,
                rate: updateItem.rate,
                amount: updateItem.amount,
                taxable_amount: updateItem.amount,
                gst: updateItem.gst,
                gst_amount: updateItem.gst_amount,
                isreturn: updateItem?.isreturn,
                remarks: updateItem?.remarks
            })
        }
    }, [updateItem, modalMode, editeMode])

    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
    }, [dispatch]);

    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);

    useEffect(() => {
        const quantity = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.rate) || 0;
        const gstPercentage = parseFloat(item.gst) || 0;
        const amount = quantity * rate;
        const gst_amount = (amount * gstPercentage) / 100;
        const total_amount = amount + gst_amount;

        setItem((prev) => ({
            ...prev,
            amount: amount.toFixed(2),
            taxable_amount: amount.toFixed(2),
            gst_amount: gst_amount.toFixed(2),
            total_amount: total_amount.toFixed(2),
        }));
    }, [item.quantity, item.rate, item.gst]);

    const handleItemChange = (e, name) => {
        const { value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const handleClose = () => {
        handleModalClose();
    }

    const dropdownOptions = entity.map((item) => ({
        label: item.name,
        value: item._id,
    }));

    const validationModal = () => {
        let isValid = true;
        let err = {};

        if (!item.item_id) {
            isValid = false;
            err['item_error'] = "Please select an item";
        }
        if (!item.quantity || item.quantity === "") {
            isValid = false;
            err['quantity_err'] = "Please enter a valid quantity greater than 0";
        } else if (parseFloat(item.quantity) < 0 || parseFloat(item.quantity) === 0) {
            isValid = false;
            err['quantity_err'] = "Quantity value cannot be negative or equal to zero";
        }
        if (parseFloat(item?.quantity) > availableBalance) {
            isValid = false;
            err['quantity_err'] = `Quantity cannot be greater than available balance (${availableBalance})`;
        }
        if (!item.rate || item.rate === "") {
            isValid = false;
            err['rate_err'] = "Please enter a valid rate greater than 0";
        } else if (parseFloat(item.rate) < 0 || parseFloat(item.rate) === 0) {
            isValid = false;
            err['rate_err'] = "Quantity value cannot be negative or equal to zero";
        }

        if (item.isreturn === "") {
            isValid = false;
            err['returnType_err'] = "Please select a return type (Yes or No)";
        }

        setError(err);
        return isValid;
    };
    const handleReset = () => {
        setItem({
            item_id: '',
            item_name: '',
            unit: "",
            mcode: "",
            quantity: 0,
            rate: 0,
            amount: 0,
            gst: 0,
            gst_amount: 0,
            isreturn: "",
            remarks: '',
        });
    }

    const saveItem = (mode) => {
        if (mode === "add") {
            if (validationModal()) {
                handleSave(item)
                handleReset()
                // handleClose()
            }
        } else {
            if (validationModal()) {
                handleAddMore(item)
                handleReset()
            }
        }
    }
    const handlesaveItem = () => {
        if (validationModal()) {
            handleSave(item)
            handleClose()
        }
    }
    return (
        <Modal
            show={modalOpen}
            backdrop="static"
            size="lg"
            keyboard={false}
            onHide={handleClose}
            handleClose={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Items Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Item Name <span className="login-danger">*</span>
                                                </label>
                                                <Dropdown
                                                    value={item.item_id}
                                                    onChange={(e) => handleItemChange(e, 'item_id')}
                                                    options={dropdownOptions}
                                                    disabled={modalMode === "edit"}
                                                    optionLabel="label"
                                                    placeholder="Search and select an item"
                                                    filter
                                                    filterBy="label"
                                                    className="w-100 multi-prime-react model-prime-multi"
                                                    emptyMessage="No items found"
                                                    appendTo="self"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Unit
                                                </label>
                                                <input
                                                    className="form-control"
                                                    name="unit"
                                                    value={item?.unit}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>M. Code</label>
                                                <input
                                                    type='text'
                                                    className="form-control"
                                                    name="mcode"
                                                    value={item?.mcode}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                                <div className="error">{err.m_code_err}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Balance
                                                </label>
                                                <input
                                                    className="form-control"
                                                    name="balance"
                                                    value={availableBalance}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Quantity
                                                    <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="quantity"
                                                    value={item.quantity}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.quantity_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Rate <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="rate"
                                                    value={item.rate}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.rate_err}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="input-block local-forms">
                                            <label>
                                                Amount
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="amount"
                                                value={item.amount}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Gst
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="gst"
                                                    value={item.gst}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Gst Ammount
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="gst_amount"
                                                    value={item.gst_amount}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Total Ammont
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="total_amount"
                                                    value={item.total_amount}
                                                    onChange={handleChange}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center mt-2">
                                                <label>
                                                    Return Type <span className="login-danger">*</span>:
                                                </label>
                                                <div className="d-flex align-items-center mx-2">
                                                    <div className="form-check me-3">
                                                        <input
                                                            type="radio"
                                                            name="isreturn"
                                                            value={false} // Set value as boolean false
                                                            className="form-check-input"
                                                            checked={item.isreturn === false} // Match against boolean false
                                                            onChange={() => setItem((prev) => ({ ...prev, isreturn: false }))}
                                                        />
                                                        <label className="form-check-label ms-2">Yes</label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="radio"
                                                            name="isreturn"
                                                            value={true} // Set value as boolean true
                                                            className="form-check-input"
                                                            checked={item.isreturn === true} // Match against boolean true
                                                            onChange={() => setItem((prev) => ({ ...prev, isreturn: true }))}
                                                        />
                                                        <label className="form-check-label ms-2">No</label>
                                                    </div>
                                                </div>
                                                <div className="error mt-1">{err.returnType_err}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                        {
                            modalMode === "add" && modalMode === "edit" ? <>
                                <button
                                    type="button"
                                    className="btn btn-primary submit-form ms-2"
                                    onClick={handlesaveItem}
                                >
                                    Save
                                </button>
                            </> : <>
                                <button
                                    type="button"
                                    className="btn btn-primary submit-form ms-2"
                                    onClick={() => saveItem("add")}
                                >
                                    Save
                                </button>
                                {
                                    !editeMode && (
                                        <button
                                            type="button"
                                            className="btn btn-primary submit-form ms-2"
                                            onClick={() => saveItem("addMore")}
                                        >
                                            Add More
                                        </button>
                                    )
                                }

                            </>}
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ItemsModel