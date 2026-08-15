import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'

const RequestModal = ({ show, handleClose, selectedData, stockData, handleSave, authPerson, partyData }) => {
    const [error, setError] = useState({})
    const [modal, setModal] = useState({
        itemName: "",
        unit: "",
        requestNo: "",
        request_qty: "",
        stock_qty: "",
        offer_qty: "",
        offer_length: "",
        offer_width: "",
        offer_nos: "",
        remark: "",
        balance_qty: "",
        lot_no: "",
        req_id: "",
        transaction_id: "",
        offer_by: "",
        default_balance_qty: "",
        supplier: "",
        challan_qty: "",
        offer_uom: "",
        wo_no: "",
        project_po_no: "",
        receive_date: "",
        material_po_no: "",
        material_grade: "",
    });

    useEffect(() => {
        const filterData = stockData?.find((st) => st.item?._id === selectedData?.itemName?._id && st?.store_type === selectedData?.store_type);
        const filterParty = partyData?.find((pa) => pa._id === selectedData?.preffered_supplier?._id);
        setModal((prevModal) => ({
            ...prevModal,
            requestNo: selectedData?.requestNo,
            itemName: selectedData?.itemName?.name,
            unit: selectedData?.itemName?.unit?.name,
            request_qty: selectedData?.quantity,
            stock_qty: filterData?.quantity || 0,
            req_id: selectedData?._id,
            transaction_id: selectedData?.transactionId,
            balance_qty: selectedData?.balance_qty,
            default_balance_qty: selectedData?.balance_qty,
            wo_no: selectedData?.project?.work_order_no,
            project_po_no: selectedData?.project?.work_order_no,
            client: selectedData?.project?.party?.name,
            supplier: filterParty?._id,
            material_po_no: selectedData?.material_po_no,
            material_grade: selectedData?.itemName?.material_grade
        }));

    }, [selectedData, stockData, show]);

    useEffect(() => {
        if (selectedData) {
            const initialBalance = parseFloat(selectedData?.balance_qty) || 0;
            const offerQty = parseFloat(modal?.offer_qty) || 0;
            const calBalance = initialBalance - offerQty;

            setModal((prevModal) => ({
                ...prevModal,
                balance_qty: calBalance,
            }));
        }
    }, [modal.offer_qty, selectedData]);

    useEffect(() => {
        if (!show) {
            handleClear();
            setError({});
        }
    }, [show]);

    const handleChange = (e) => {
        setModal({ ...modal, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation()) {
            handleSave(modal)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const handleClear = () => {
        setModal({
            itemName: "",
            unit: "",
            requestNo: "",
            request_qty: "",
            stock_qty: "",
            offer_qty: "",
            offer_length: "",
            offer_width: "",
            offer_nos: "",
            remark: "",
            balance_qty: "",
            lot_no: "",
            req_id: "",
            transaction_id: "",
            offer_by: "",
            default_balance_qty: "",
            supplier: "",
            challan_qty: "",
            offer_uom: "",
            wo_no: "",
            project_po_no: "",
            receive_date: "",
            material_po_no: "",
            material_grade: "",
        });
    }

    const handleCloseModal = () => {
        handleClear()
        setError({});
        handleClose();
    };

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!modal.offer_qty) {
            isValid = false;
            err['offer_qty_err'] = 'Please enter offer quantity';
        } else if (parseInt(modal.offer_qty) < 0 || parseFloat(modal.offer_qty) === 0) {
            isValid = false;
            err['offer_qty_err'] = 'Offer quantity value cannot be negative or equal to zero';
        } else if (parseInt(modal.offer_qty) > parseInt(modal.stock_qty)) {
            isValid = false;
            err['offer_qty_err'] = 'Offer quantity value cannot exceed stock quantity';
        } else if (parseInt(modal.offer_qty) > parseInt(modal.default_balance_qty)) {
            isValid = false;
            err['offer_qty_err'] = 'Offer quantity value cannot exceed balance quantity';
        }
        if (!modal.receive_date) {
            isValid = false;
            err['receive_date_err'] = 'Please select receive date';
        }

        setError(err);
        return isValid;
    }

    return (
        <Modal show={show} onHide={handleCloseModal}
            size="lg"
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Manage Offered Items</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Client</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.client} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Supplier</label>
                        </div>
                        <div className="col-12 col-md-4">
                            {/* <input type="text" className="form-control" value={modal.supplier} /> */}
                            <select className="form-control" value={modal.supplier} onChange={handleChange} name='supplier'>
                                <option value=''>Select Supplier</option>
                                {partyData?.map((e) =>
                                    <option value={e?._id} key={e?._id}>{e?.name}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">PO / WO No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.wo_no} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Project PO No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.project_po_no} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Request No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.requestNo} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Section Details</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.itemName} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Material Grade</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.material_grade} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Unit</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.unit} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Material PO NO.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.material_po_no} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Stock Qty.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.stock_qty} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Request Qty.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" value={modal.request_qty} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Req. Balance Qty.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" value={modal.balance_qty} name="balance_qty" onChange={handleChange} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Received Qty. <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} value={modal.offer_qty} name="offer_qty" onChange={handleChange} />
                            <div className='error'>{error?.offer_qty_err}</div>
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Challan Qty.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} value={modal.challan_qty} name="challan_qty" onChange={handleChange} />
                            <div className='error'>{error?.challan_qty_err}</div>
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Inspection Offer NOS</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name="offer_nos" value={modal.offer_nos} onChange={handleChange} />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Inspection Offer UOM </label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="text" className="form-control" name="offer_uom" value={modal.offer_uom} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Inspection Offer Length(mm)</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} value={modal.offer_length} name="offer_length" onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Inspection Offer Width(mm)</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} value={modal.offer_width} name="offer_width" onChange={handleChange} />
                        </div>
                    </div>

                    <div className='row align-items-center mt-2'>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Heat / Lot No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name="lot_no" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} value={modal.lot_no} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Received Date  <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-10">
                            <input type="date" className="form-control" onChange={handleChange} name="receive_date" value={modal?.receive_date} />
                            <div className='error'>{error.receive_date_err}</div>
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Remark</label>
                        </div>
                        <div className="col-12 col-md-10">
                            <textarea className="form-control" onChange={handleChange} name="remark" value={modal?.remark} />
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

export default RequestModal;