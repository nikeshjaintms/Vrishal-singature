import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';
import { Modal } from 'react-bootstrap';

const EditPoItemsModel = ({ show, mode, EditItem, handleClose, handleSave, isEdit }) => {
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
    }, [itemDetails, ItemNo])

    useEffect(() => {
        if (mode === 'edit' && EditItem) {
            console.log(EditItem);
            setFormState({
                item_id: EditItem.item_id,
                item_name: EditItem.item_name,
                unit: EditItem.unit,
                m_code: EditItem.m_code,
                quantity: EditItem.quantity,
                rate: EditItem.rate,
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
        console.log(name, value);

        setFormState((prevState) => ({
            ...prevState,
            [name]: value
        }));
        // setError({});
    };
    const resetForm = () => {
        setFormState({
            item_id: '',
            item_name: '',
            unit: '',
            m_code: '',
            quantity: 0,
            rate: 0,
            remarks: ''
        });
        // setError({});
    };
    const validation = () => {
        let isvalid = true
        let err = {}
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
                handleSave(formState, "add");
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
                        <button type="button" className="btn btn-primary ms-2" onClick={saveItem}>Save</button>

                    </div>
                </div>
            </Modal.Body>
        </Modal >
    )
}

export default EditPoItemsModel