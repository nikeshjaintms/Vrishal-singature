import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../Store/Store/Item/AdminItem';
import { getMainStoreStock } from '../../../../Store/Store/MainStore/MainStock';

const ProductModel = ({ show, handleClose, handleSave, EditItem, mode }) => {
    const dispatch = useDispatch();
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data || []);
    console.log("itemDetails",itemDetails);
    const [stockListData, setStocListkData] = useState(null);
    const [formState, setFormState] = useState({
        item_id: null,
        item_name: '',
        unit: '',
        m_code: '',
        quantity: 0,
        rate: 0,
        amount: 0,
        remarks: ''
    });
    console.log(formState,'222222222222');
    
    const [error, setError] = useState({});
    const [entity, setEntity] = useState([]);
    const filteredData = itemDetails?.find((it) => it?._id === formState.item_id);
    useEffect(() => {
        if (filteredData?._id) {
            dispatch(getMainStoreStock({ itemId: filteredData?._id }))
                .then(response => {
                    setStocListkData(response.payload.data);
                })
                .catch(error => {
                    console.error('Error fetching stock data:', error);
                });
        }
    }, [filteredData?._id, dispatch]);

    const currentStock = stockListData?.find(item => item.ItemId === filteredData?._id) || {};
    const availableBalance = currentStock.balance || 0;

    useEffect(() => {
        if (mode === 'edit' && EditItem) {
            setFormState({
                item_id: EditItem.item_id,
                item_name: EditItem.item_name,
                unit: EditItem.unit,
                m_code: EditItem.m_code,
                balance: availableBalance.balance || 0,
                quantity: EditItem.quantity,
                rate: EditItem.rate,
                amount: EditItem.amount,
                remarks: EditItem.remarks
            });
        } else {
            resetForm();
        }
    }, [EditItem, mode]);
    useEffect(() => {
       dispatch(getAdminItem({ is_main: true }));
    }, [dispatch]);
    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);
    useEffect(() => {
        if (mode === 'edit' && EditItem) {
            setFormState({
                item_id: filteredData?._id,
                item_name: filteredData?.name,
                unit: filteredData?.unit?.name,
                m_code: filteredData?.mcode,
                balance: currentStock,
                quantity: EditItem.quantity,
                rate: EditItem.rate,
                amount: EditItem.amount,
                remarks: EditItem.remarks
            });
        }
        else {
            setFormState({
                item_id: filteredData?._id,
                item_name: filteredData?.name,
                unit: filteredData?.unit?.name,
                m_code: filteredData?.mcode
            })
        }
    }, [itemDetails, formState.item_id])
    const resetForm = () => {
        setFormState({
            item_id: '',
            item_name: '',
            unit: '',
            m_code: '',
            quantity: 0,
            rate: 0,
            amount: 0,
            remarks: ''
        });
        setError({});
    };
    const handleModalClose = () => {
        mode === 'add' && resetForm();
        handleClose();
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value
        }));
        setError({});
    };
    useEffect(() => {
        const calculateAmounts = () => {
            const { quantity, rate } = formState;
            const Amount = parseFloat(quantity) * parseFloat(rate) || 0;
            setFormState((prevState) => ({
                ...prevState,
                amount: Amount.toFixed(2),
            }));
        };
        calculateAmounts();
    }, [formState.quantity, formState.rate]);
    const validation = () => {
        let isValid = true;
        let err = {};

        if (!formState.item_id) {
            isValid = false;
            err['item_error'] = "Please select an item";
        }
        if (!formState.quantity || formState.quantity === "") {
            isValid = false;
            err['quantity_err'] = "Please enter a valid quantity greater than 0";
        } else if (parseFloat(formState.quantity) < 0 || parseFloat(formState.quantity) === 0) {
            isValid = false;
            err['quantity_err'] = "Quantity value cannot be negative or equal to zero";
        }
        if (parseFloat(formState.quantity) > availableBalance) {
            isValid = false;
            err['quantity_err'] = `Quantity cannot be greater than available balance (${availableBalance})`;
        }
        if (!formState.rate || formState.rate === "") {
            isValid = false;
            err['rate_err'] = "Please enter a valid rate greater than 0";
        } else if (parseFloat(formState.rate) < 0 || parseFloat(formState.rate) === 0) {
            isValid = false;
            err['rate_err'] = "Quantity value cannot be negative or equal to zero";
        }
        setError(err);
        return isValid;
    };
    const saveItem = (addMore = false) => {
        if (validation()) {
            const itemData = { ...formState };
            if (mode === 'add') {
                handleSave([itemData], 'add');
            } else {
                handleSave(itemData, EditItem._id, 'edit');
            }
            if (addMore) {
                resetForm();
            } else {
                handleModalClose();
            }
        }
    };
    return (
        <Modal show={show} onHide={handleModalClose} size="lg" backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'edit' ? 'Edit Item' : 'Add Item'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-12">
                        <div className="input-block local-forms">
                            <label>Item Name<span className="login-danger">*</span></label>
                            <select className="form-select form-control"
                                name="item_id"
                                value={formState.item_id}
                                onChange={handleChange}>
                                <option value="">Select Item</option>
                                {entity.map((item) => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))}
                            </select>
                            {error.item_error && <div className="error">{error.item_error}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Unit
                            </label>
                            <input
                                className="form-control"
                                name="unit"
                                value={formState?.unit}
                                onChange={handleChange}
                                disabled
                            />
                            <div className="error"></div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>M. Code</label>
                            <input
                                type='text'
                                className="form-control"
                                name="m_code"
                                value={formState?.m_code}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Balance</label>
                            <input
                                className="form-control"
                                name="balance"
                                value={availableBalance}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Quantity<span className="login-danger">*</span></label>
                            <input type="number" className="form-control" name="quantity" value={formState.quantity} onChange={handleChange} />
                            <div className="error">{error.quantity_err}</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Rate<span className="login-danger">*</span></label>
                            <input type="number" className="form-control" name="rate" value={formState.rate} onChange={handleChange} />
                            <div className="error">{error.rate_err}</div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="input-block local-forms">
                            <label>
                                Amount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="amount"
                                value={formState.amount}
                                disabled
                            />
                            <div className="error"></div>
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
                                value={formState.remarks || ''}
                                onChange={handleChange}
                            />
                            <div className="error"></div>
                        </div>
                    </div>
                    <div className="col-12 text-end">
                        <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancel</button>
                        <button type="button" className="btn btn-primary ms-2" onClick={() => saveItem(false)}>Save</button>
                        {mode !== 'edit' && (
                            <button type="button" className="btn btn-primary ms-2" onClick={() => saveItem(true)}>Add More</button>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
};

export default ProductModel;