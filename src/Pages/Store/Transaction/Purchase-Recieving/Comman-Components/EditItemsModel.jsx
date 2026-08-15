import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';

const EditItemsModel = ({ show, mode, EditItem, handleClose, handleSave }) => {
    const dispatch = useDispatch()
    const [formError, setFormerror] = useState({})
    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
    }, [dispatch]);

    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const [ItemNo, setItemNo] = useState(null);
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
        taxable: 0,
        gst: 0,
        gst_amount: 0,
        total_amount: 0,
        remarks: ''
    });

    useEffect(() => {
        const filteredData = itemDetails?.find((it) => it?._id === ItemNo);
        setFormState({
            ...formState,
            item_name: filteredData?.name,
            item_id: filteredData?._id,
            gst: filteredData?.gst_percentage,
            m_code: filteredData?.mcode,
            unit: filteredData?.unit?.name
        });
    }, [ItemNo])

    useEffect(() => {
        if (mode === 'edit' && EditItem) {
            setFormState({
                item_id: EditItem.item_id,
                item_name: EditItem.item_name,
                unit: EditItem.unit,
                m_code: EditItem.m_code,
                quantity: EditItem.quantity,
                rate: EditItem.rate,
                amount: EditItem?.amount,
                discount: EditItem?.discount,
                discount_amount: EditItem?.discount_amount,
                sp_discount: EditItem?.sp_discount,
                sp_discount_amount: EditItem?.sp_discount_amount,
                taxable_amount: EditItem?.taxable_amount,
                gst: EditItem?.gst,
                gst_amount: EditItem?.gst_amount,
                total_amount: EditItem?.total_amount,
                remarks: EditItem.remarks
            });
        }
    }, [EditItem, mode]);

    const Itemsoption = itemDetails?.map(it => ({
        label: it?.name,
        value: it?._id
    }));

    const handleItemsChange = (e) => {
        setItemNo(e.value);
    };

    const handleModalClose = () => {
        resetForm();
        handleClose();
        setFormerror({})
        setItemNo(null)
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedValue = isNaN(value) ? value : parseFloat(value) || 0;

        const updatedItem = {
            ...formState,
            [name]: updatedValue
        };

        const quantity = Number(updatedItem.quantity) || 0;
        const rate = Number(updatedItem.rate) || 0;
        const discount = parseFloat(updatedItem.discount) || 0;
        const spDiscount = parseFloat(updatedItem.sp_discount) || 0;
        const gst = parseFloat(updatedItem.gst) || 0;

        const amount = quantity * rate;
        const discountAmount = (amount * discount) / 100;
        const spDiscountAmount = ((amount - discountAmount) * spDiscount) / 100;
        const taxableAmount = amount - discountAmount - spDiscountAmount;
        const gstAmount = (taxableAmount * gst) / 100;
        const totalAmount = taxableAmount + gstAmount;

        setFormState({
            ...updatedItem,
            amount: amount.toFixed(2),
            discount_amount: discountAmount.toFixed(2),
            sp_discount_amount: spDiscountAmount.toFixed(2),
            taxable_amount: taxableAmount.toFixed(2),
            gst_amount: gstAmount.toFixed(2),
            total_amount: totalAmount.toFixed(2)
        });
        setFormerror({});
    };


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
            taxable: 0,
            gst: 0,
            gst_amount: 0,
            total_amount: 0,
            remarks: ''
        });
        // setError({});
    };
    const validation = () => {
        let isvalid = true
        let err = {}

        if (!formState?.item_id) {
            isvalid = false
            err["items_err"] = "please select item name"
        }
        if (!formState?.quantity) {
            isvalid = false
            err["quantity_err"] = "please enter quantity"
        } else if (formState?.quantity < 1) {
            isvalid = false
            err["quantity_err"] = "quantity should be greater than 1"
        }
        if (!formState?.rate) {
            isvalid = false
            err["rate_err"] = "please enter rate"
        } else if (formState?.rate < 0) {
            isvalid = false
            err["rate_err"] = "rate should be greater than 0"
        }
        setFormerror(err)
        return isvalid
    }

    const saveItem = () => {
        if (mode === "add") {
            if (validation()) {
                handleSave([formState], "add");
                handleModalClose()
            }
        } else {
            if (validation()) {
                handleSave(formState, EditItem._id, "edit");
                handleModalClose()
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
                            <Dropdown
                                value={formState.item_id || ItemNo}
                                options={Itemsoption}
                                onChange={handleItemsChange}
                                placeholder="select Item"
                                filter
                                filterBy="label"
                                appendTo="self"
                                className="w-100 multi-prime-react model-prime-multi"
                                disabled={mode === 'edit'}
                            />
                            {formError.items_err && <div className="error">{formError.items_err}</div>}
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
                            <label>
                                Quantity
                            </label>
                            <input
                                className="form-control"
                                name="quantity"
                                value={formState?.quantity}
                                onChange={handleChange}
                                disabled={mode === 'edit'}
                            />
                            {formError.quantity_err && <div className="error">{formError.quantity_err}</div>}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Rate</label>
                            <input
                                type='text'
                                className="form-control"
                                name="rate"
                                value={formState?.rate}
                                onChange={handleChange}
                            />
                            {formError.rate_err && <div className="error">{formError.rate_err}</div>}
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
                                value={formState?.amount}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Discount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="discount"
                                value={formState?.discount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Discount Amount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="discount_amount"
                                value={formState?.discount_amount}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Sp. Discount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="sp_discount"
                                value={formState?.sp_discount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                SP. Discount Amount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="sp_discount_amount"
                                value={formState?.sp_discount_amount}
                                disabled

                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Taxable
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="taxable_amount"
                                value={formState?.taxable_amount}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                GST
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="gst"
                                value={formState?.gst}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                GST Amount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="gst_amount"
                                value={formState?.gst_amount}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Total Amount
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                name="total_amount"
                                value={formState?.total_amount}
                                disabled
                            />
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
                                value={formState.remarks}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <h1></h1>
                <div className="col-12 text-end">
                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancel</button>
                    <button type="button" className="btn btn-primary ms-2" onClick={saveItem}>Save</button>
                </div>
            </Modal.Footer>
        </Modal >
    )
}

export default EditItemsModel