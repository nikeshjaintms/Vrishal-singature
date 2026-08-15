import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';

const ItemModal = ({ show, mode, EditItem, handleClose, handleSave, isOrder }) => {
    const dispatch = useDispatch();
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data || []);
    const [formState, setFormState] = useState({
        item_id: null,
        item_name: '',
        unit: '',
        m_code: '',
        quantity: 0,
        rate: 0,
        amount: 0,
        discount: 0,
        discount_amount: 0,
        sp_discount: 0,
        sp_discount_amount: 0,
        taxable_amount: 0,
        gst: 0,
        gst_amount: 0,
        total_amount: 0,
        remarks: ''
    });

    const [error, setError] = useState({});
    const [entity, setEntity] = useState([]);
    useEffect(() => {
        if (mode === 'edit' && EditItem) {
            setFormState({
                item_id: EditItem.item_id,
                item_name: EditItem.item_name,
                unit: EditItem.unit,
                m_code: EditItem.m_code,
                quantity: EditItem.quantity,
                rate: EditItem.rate,
                amount: EditItem.amount,
                discount: EditItem.discount,
                discount_amount: EditItem.discount_amount,
                sp_discount: EditItem.sp_discount,
                sp_discount_amount: EditItem.sp_discount_amount,
                gst: EditItem.gst,
                gst_amount: EditItem.gst_amount,
                total_amount: EditItem.total_amount,
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
        const filteredData = itemDetails?.find((it) => it?._id === formState.item_id);
        if (mode === 'edit' && EditItem) {
            console.log('EditItem', EditItem._id);
            setFormState({
                item_id: filteredData?._id,
                item_name: filteredData?.name,
                unit: filteredData?.unit?.name,
                gst: filteredData?.gst_percentage,
                m_code: filteredData?.mcode,
                quantity: EditItem.quantity,
                rate: EditItem.rate,
                amount: EditItem.amount,
                discount: EditItem.discount,
                discount_amount: EditItem.discount_amount,
                sp_discount: EditItem.sp_discount,
                sp_discount_amount: EditItem.sp_discount_amount,
                gst_amount: EditItem.gst_amount,
                total_amount: EditItem.total_amount,
                remarks: EditItem.remarks
            });
        } else {
            setFormState({
                item_id: filteredData?._id,
                item_name: filteredData?.name,
                unit: filteredData?.unit?.name,
                gst: filteredData?.gst_percentage,
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
            discount: 0,
            discount_amount: 0,
            sp_discount: 0,
            sp_discount_amount: 0,
            gst: 0,
            gst_amount: 0,
            total_amount: 0,
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
            const { quantity, rate, discount, sp_discount, gst } = formState;
            const Amount = parseFloat(quantity) * parseFloat(rate) || 0;
            const discountAmount = Amount * (parseFloat(discount) / 100) || 0;
            const spDiscountAmount = (Amount - discountAmount) * (parseFloat(sp_discount) / 100) || 0;
            const taxableAmount = Amount - discountAmount - spDiscountAmount;
            const gstAmount = taxableAmount * (parseFloat(gst) / 100) || 0;
            const totalAmount = taxableAmount + gstAmount;

            setFormState((prevState) => ({
                ...prevState,
                amount: Amount.toFixed(2),
                discount_amount: discountAmount.toFixed(2),
                sp_discount_amount: spDiscountAmount.toFixed(2),
                taxable_amount: taxableAmount.toFixed(2),
                gst_amount: gstAmount.toFixed(2),
                total_amount: totalAmount.toFixed(2)
            }));
        };
        calculateAmounts();
    }, [formState.quantity, formState.rate, formState.discount, formState.sp_discount, formState.gst]);
    const validation = () => {
        let isValid = true;
        let err = {};

        if (!formState.item_id) {
            isValid = false;
            err.item_error = "Please select an item.";
        }
        if (!formState.rate) {
            isValid = false;
            err.rate_error = "Please enter the rate.";
        }
        if (!formState.quantity || parseInt(formState.quantity) === 0) {
            isValid = false;
            err.quantity_error = "Quantity must be greater than 0.";
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
                            <label>Quantity<span className="login-danger">*</span></label>
                            <input type="number" className="form-control" name="quantity" value={formState.quantity} onChange={handleChange} />
                            {error.quantity_error && <div className="error">{error.quantity_error}</div>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Rate<span className="login-danger">*</span></label>
                            <input type="number" className="form-control" name="rate" value={formState.rate} onChange={handleChange} />
                            {error.rate_error && <div className="error">{error.rate_error}</div>}
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

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Discount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="discount"
                                value={formState?.discount}
                                onChange={handleChange}
                                disabled={isOrder}
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Discount Amount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="discount_amount"
                                value={!isOrder ? formState.discount_amount : 0}
                                disabled
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Sp. Discount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="sp_discount"
                                value={!isOrder ? formState.sp_discount : 0}
                                onChange={handleChange}
                                disabled={isOrder}
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                SP. Discount Amount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="sp_discount_amount"
                                value={!isOrder ? formState.sp_discount_amount : 0}
                                disabled
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Taxable
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="taxable_amount"
                                value={!isOrder ? formState.taxable_amount : 0}
                                disabled
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                GST
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="gst"
                                value={formState?.gst}
                                onChange={handleChange}
                                disabled={isOrder}
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                GST Amount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="gst_amount"
                                value={!isOrder ? formState.gst_amount : 0}
                                disabled
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Total Amount
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="total_amount"
                                value={!isOrder ? formState.total_amount : 0}
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
export default ItemModal;