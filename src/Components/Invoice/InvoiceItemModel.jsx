import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { getItem } from '../../Store/Store/Item/Item';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';

const InvoiceItemModel = ({ modelShow, handleClose, setSavedItems, savedItems, currentItem }) => {

    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const [gstManuallyChanged, setGstManuallyChanged] = useState(false);
    const [model, setModel] = useState({
        item_id: '',
        item_name: '',
        unit: '',
        m_code: '',
        hsn_code: '',
        quantity: '',
        rate: '',
        amount: '',
        gst: '',
        gst_amount: '',
        total_amount: '',
        remarks: '',
    });

    useEffect(() => {
        dispatch(getItem({ is_main: false }))
    }, []);

    const itemData = useSelector((state) => state.getItem?.user?.data);

    useEffect(() => {
        if (currentItem) {
            setModel(currentItem);
        } else {
            handleClearModal();
        }
    }, [currentItem]);

    useEffect(() => {
        if (!gstManuallyChanged) {
            const findItem = itemData?.find((item) => item?._id === model.item_id);

            setModel((prevModel) => ({
                ...prevModel,
                m_code: findItem?.mcode,
                item_name: findItem?.name,
                unit: findItem?.unit?.name,
                gst: findItem?.gst_percentage || '',
                hsn_code: findItem?.hsn_code,
            }));
        }
    }, [model.item_id, itemData, gstManuallyChanged]);

    const calculateAmounts = () => {
        const { quantity, rate, gst } = model;
        const amount = quantity && rate ? quantity * rate : 0;
        const gst_amount = gst ? (amount * gst) / 100 : 0;
        const total_amount = amount + gst_amount;

        setModel((prevModel) => ({
            ...prevModel,
            amount: amount.toFixed(2),
            gst_amount: gst_amount.toFixed(2),
            total_amount: total_amount.toFixed(2),
        }));
    };

    useEffect(() => {
        calculateAmounts();
    }, [model.quantity, model.rate, model.gst]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'gst') {
            setGstManuallyChanged(true);
        }
        setModel((prevModel) => ({
            ...prevModel,
            [name]: value,
        }));
    };

    const handleModelSubmit = (addMore) => {
        if (validation()) {
            if (currentItem) {
                const updatedItems = savedItems.map((item, index) =>
                    index === currentItem.index ? model : item
                );
                setSavedItems(updatedItems);
            } else {
                setSavedItems([...savedItems, model]);
            }
            if (addMore) {
                handleClearModal();
            } else {
                handleClose();
                handleClearModal();
            }
        }
    };

    const handleClearModal = () => {
        setModel({
            item_id: '',
            unit: '',
            m_code: '',
            hsn_code: '',
            quantity: '',
            rate: '',
            amount: '',
            gst: '',
            gst_amount: '',
            total_amount: '',
            remarks: '',
        });
        setError({})
        setGstManuallyChanged(false);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!model.item_id) {
            isValid = false;
            err['item_id_err'] = "Please select section details";
        }
        if (!model.quantity || model.quantity === "") {
            isValid = false;
            err['quantity_err'] = "Please enter quantity";
        }
        if (parseFloat(model.quantity) < 0) {
            isValid = false;
            err['quantity_err'] = "Quantity should be greater than 0";
        }
        if (!model.rate || model.rate === "") {
            isValid = false;
            err['rate_err'] = "Please enter rate";
        }
        if (parseFloat(model.rate) < 0) {
            isValid = false;
            err['rate_err'] = "Rate should be greater than 0";
        }
        if (model.gst) {
            if (parseFloat(model.gst) < 0 || parseFloat(model.gst) > 100) {
                isValid = false;
                err['gst_err'] = "GST should be between 0 and 100";
            }
        }
        setError(err);
        return isValid;
    }
    const handleCloseandReset = () => {
        setModel({
            item_id: '',
            unit: '',
            m_code: '',
            hsn_code: '',
            quantity: '',
            rate: '',
            amount: '',
            gst: '',
            gst_amount: '',
            total_amount: '',
            remarks: '',
        });
        setError({})
        handleClose()
    }
    return (
        <Modal show={modelShow} onHide={handleCloseandReset} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Manage Section Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Section Name: <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-10">
                            <select className='form-control form-select' onChange={handleChange} name='item_id' value={model?.item_id}>
                                <option value=''>Select Section Details</option>
                                {itemData?.map((e) => (
                                    <option key={e._id} value={e._id}>
                                        {e?.name}
                                    </option>
                                ))}
                            </select>
                            <div className='error'>{error.item_id_err}</div>
                        </div>
                    </div>

                    {model?.item_id && (
                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Unit: <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type='text' className='form-control' onChange={handleChange} name='unit' value={model?.unit} disabled />
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">M Code: <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type='text' className='form-control' onChange={handleChange} name='m_code' value={model?.m_code} disabled />
                            </div>
                        </div>
                    )}

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">HSN Code:</label>
                        </div>
                        <div className="col-12 col-md-10">
                            <input className='form-control' onChange={handleChange} name='hsn_code' value={model?.hsn_code} />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Quantity: <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type='number' className='form-control' onChange={handleChange} name='quantity' value={model?.quantity}
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                            />
                            <div className='error'>{error.quantity_err}</div>
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Rate: <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type='number' className='form-control' onChange={handleChange} name='rate' value={model?.rate} />
                            <div className='error'>{error.rate_err}</div>
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Amount:</label>
                        </div>
                        <div className="col-12 col-md-10">
                            <input className='form-control' onChange={handleChange} name='amount' value={model?.amount} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">GST: </label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type='number' className='form-control' onChange={handleChange} name='gst' value={model?.gst} />
                            <div className='error'>{error.gst_err}</div>
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">GST Amount:</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input className='form-control' onChange={handleChange} name='gst_amount' value={model?.gst_amount} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Total Amount: </label>
                        </div>
                        <div className="col-12 col-md-10">
                            <input className='form-control' onChange={handleChange} name='total_amount' value={model?.total_amount} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Remarks: </label>
                        </div>
                        <div className="col-12 col-md-10">
                            <textarea className='form-control' onChange={handleChange} name='remarks' value={model?.remarks} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-primary mr-2' type='button' onClick={() => handleModelSubmit(false)}>Add</button>
                <button className='btn btn-outline-primary' type='button' onClick={() => handleModelSubmit(true)}>Add More</button>
                <button className='btn btn-secondary' type='button' onClick={handleClearModal}>Reset</button>
            </Modal.Footer>
        </Modal>
    )
}

export default InvoiceItemModel