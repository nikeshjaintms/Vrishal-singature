import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'

const OrderModal = ({ show, handleClose, handleSaveModal, selectedData, itemApiData, is_sale = false }) => {
    const [modal, setModal] = useState({
        itemName: "",
        orderNo: "",
        orderId: "",
        itemId: "",
        quantity: "",
        receive: "",
        current_bal: "",
        balance_qty: "",
        store_type: "",
    });
    const [error, setError] = useState({})

    useEffect(() => {
        const finalItem = itemApiData?.find(it => it?._id === selectedData?.e?.itemName)?.name;
        const finalItemId = itemApiData?.find(it => it?._id === selectedData?.e?.itemName)?._id;

        const calculatedBalance = selectedData?.e?.balance_qty - modal.receive;

        setModal({
            ...modal,
            orderNo: selectedData?.elem?.orderNo,
            quantity: selectedData?.e?.quantity,
            itemName: finalItem,
            itemId: finalItemId,
            orderId: selectedData?.elem?._id,
            current_bal: selectedData?.e?.balance_qty,
            balance_qty: calculatedBalance >= 0 ? calculatedBalance : 0,
            store_type: selectedData?.elem?.store_type
        });
        // eslint-disable-next-line
    }, [selectedData, modal.receive]);

    useEffect(() => {
        if (!show) {
            setModal({
                itemName: "",
                orderNo: "",
                orderId: "",
                itemId: "",
                quantity: "",
                receive: "",
                current_bal: "",
                balance_qty: "",
                store_type: "",
            })
            setError({});
        }
    }, [show]);

    const handleChange = (e) => {
        setModal({ ...modal, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (validation()) {
            handleSaveModal(modal);
        }
    }

    const validation = () => {
        let err = {};
        var isValid = true;

        if (!modal.receive) {
            isValid = false;
            err['receive_err'] = 'Please enter receive';
        } else if (parseInt(modal.receive) < 0) {
            isValid = false;
            err['receive_err'] = 'Receive value cannot be negative';
        } else if (parseInt(modal.receive) > parseInt(modal.current_bal)) {
            isValid = false;
            err['receive_err'] = 'Receive value cannot exceed current balance';
        }

        if (!modal.store_type) {
            isValid = false;
            err['store_type_err'] = 'Please select store type';
        }

        setError(err);
        return isValid
    }


    return (
        <Modal show={show} onHide={handleClose} backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Manage Items balance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className=''>
                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Order No. </label>
                            </div>
                            <div className="col-9">
                                <input type="text" className="form-control" value={modal.orderNo} disabled />
                            </div>
                        </div>
                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Item Name </label>
                            </div>
                            <div className="col-9">
                                <input type="text" className="form-control" value={modal.itemName} disabled />
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">{is_sale === true ? 'Available Qty.' : 'Quantity'} </label>
                            </div>
                            <div className="col-9">
                                <input type="number" className="form-control" value={modal?.quantity} disabled />
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label"> Current Balance </label>
                            </div>
                            <div className="col-9">
                                <input type="number" className="form-control" value={modal?.current_bal} disabled />
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">{is_sale === true ? 'Sell' : 'Receive'} <span className="login-danger">*</span> </label>
                            </div>
                            <div className="col-9">
                                <input type="number" className="form-control" name="receive" onChange={handleChange} value={modal?.receive} />
                                <div className='error'>{error?.receive_err}</div>
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Balance <span className="login-danger">*</span> </label>
                            </div>
                            <div className="col-9">
                                <input type="number" className="form-control" name="balance_qty" onChange={handleChange} value={modal?.balance_qty} disabled />
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Store Type <span className="login-danger">*</span> </label>
                            </div>
                            <div className="col-9">
                                <select name="store_type" className="form-select form-control"
                                    onChange={handleChange} value={modal?.store_type} disabled>
                                    <option value="">Select Store</option>
                                    <option value={1}>Main Store</option>
                                    <option value={2}>Project Store</option>
                                </select>
                                <div className='error'>{error?.store_type_err}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-primary' type='button' onClick={handleSubmit}>Save</button>
            </Modal.Footer>
        </Modal>
    )
}

export default OrderModal