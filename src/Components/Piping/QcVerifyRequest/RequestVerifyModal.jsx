import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'

const RequestVerifyModal = ({ show, handleClose, selectedData, handleSave, partyData }) => {

    const [modal, setModal] = useState({
        requestNo: "", itemName: "", unit: "", material_grade: "", offeredQty: "", offerLength: "",
        offerNos: "", acceptedQty: "", acceptedLength: "", tcNo: "", remark: "",
        rejectedQty: "", _id: "", client: "", manufacture: "", wo_no: "", qc_date: "",
        project_po_no: "", offer_uom: "", receive_date: "", material_po_no: "", challan_qty: "",
        rejected_width: "", rejected_length: "", offerWidth: "", lot_no: "", offer_lot_no: "", acceptedWidth: ""
    });

    const [error, setError] = useState({});

    useEffect(() => {
        const filterParty = partyData?.find((pa) => pa?._id === selectedData?.transactionId?.preffered_supplier?._id)

        setModal((prev) => ({
            ...prev,
            requestNo: selectedData?.requestId?.requestNo,
            itemName: selectedData?.transactionId?.itemName?.name,
            unit: selectedData?.transactionId?.itemName?.unit?.name,
            material_grade: selectedData?.transactionId?.itemName?.material_grade,
            offeredQty: selectedData?.offeredQty,
            offerLength: selectedData?.offerLength,
            offerWidth: selectedData?.offerWidth,
            rejectedQty: selectedData?.offeredQty,
            _id: selectedData?._id,
            client: selectedData?.requestId?.project?.party?.name,
            manufacture: filterParty?._id,
            wo_no: selectedData?.requestId?.project?.work_order_no,
            project_po_no: selectedData?.requestId?.project?.work_order_no,
            material_po_no: selectedData?.requestId?.material_po_no,
            offer_uom: selectedData?.offer_uom,
            receive_date: selectedData?.received_date,
            challan_qty: selectedData?.challan_qty,
            offer_lot_no: selectedData?.lotNo
        }));
    }, [selectedData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "acceptedQty") {
            const rejectedQty = parseFloat(modal.offeredQty) - parseFloat(value);
            setModal({ ...modal, [name]: value, rejectedQty: rejectedQty >= 0 ? rejectedQty : 0 });
        } else {
            setModal({ ...modal, [name]: value });
        }
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
    const handleCloseModal = () => {
        setError({});
        handleClose();
    };

    useEffect(() => {
        if (!show) {
            setModal({
                requestNo: "", itemName: "", unit: "", material_grade: "", offeredQty: "", offerLength: "",
                offerNos: "", acceptedQty: "", acceptedLength: "", tcNo: "", remark: "",
                rejectedQty: "", _id: "", client: "", manufacture: "", wo_no: "", qc_date: "",
                project_po_no: "", offer_uom: "", receive_date: "", material_po_no: "", challan_qty: "",
                rejected_width: "", rejected_length: "", offerWidth: "", lot_no: "", offer_lot_no: "", acceptedWidth: ""
            });
            setError({});
        }
    }, [show]);

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!modal.acceptedQty) {
            isValid = false;
            err['acceptedQty_err'] = 'Please enter inspected quantity';
        } else if (parseFloat(modal?.acceptedQty) < 0 || parseFloat(modal?.acceptedQty) === 0) {
            isValid = false;
            err['acceptedQty_err'] = 'Inspected quantity value cannot be negative or equal to zero';
        } else if (parseFloat(modal.acceptedQty) > parseFloat(modal.offeredQty)) {
            isValid = false;
            err['acceptedQty_err'] = 'Inspected quantity cannot exceed offered quantity';
        }
        if (modal.rejectedQty > 0) {
            if (!modal.rejected_length) {
                isValid = false;
                err['rejected_length_err'] = 'Please enter rejected length';
            }
            if (!modal.rejected_width) {
                isValid = false;
                err['rejected_width_err'] = 'Please enter rejected width';
            }
        }
        setError(err);
        return isValid;
    }

    return (
        <Modal show={show} onHide={handleCloseModal}
            size="lg"
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Inspection Section Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Client</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input className="form-control" value={modal.client} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Manufacture </label>
                        </div>
                        <div className="col-12 col-md-4">
                            <select type="number" className="form-control" name='manufacture'
                                value={modal.manufacture} onChange={handleChange}>
                                <option value=''>Select Manufacture</option>
                                {partyData?.map((e) =>
                                    <option value={e?._id} key={e?._id}>{e?.name}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {[
                        { label1: 'WO / PO NO.', value1: modal.wo_no, label2: 'Project PO NO.', value2: modal?.project_po_no },
                        { label1: 'Request No.', value1: modal.requestNo, label2: 'Section Details', value2: modal.itemName },
                        { label1: 'Unit', value1: modal.unit, label2: 'Material Grade', value2: modal.material_grade },
                        { label1: 'Material PO NO.', value1: modal.material_po_no, label2: 'Challan Qty.', value2: modal.challan_qty },
                        { label1: 'Inspection Offer NOS', value1: modal.offerNos || '-', label2: 'Inspection Offer UOM', value2: modal.offer_uom || '-' },
                        { label1: 'Inspection Offer Length', value1: modal.offerLength || '-', label2: 'Inspection Offer Width', value2: modal.offerWidth || '-' },
                        { label1: 'Inspection Offer UOM', value1: modal.offer_uom || '-', label2: 'Inspection Offer Date', value2: moment(modal.receive_date).format('YYYY-MM-DD') },
                        { label1: 'Inspection Heat / Lot No.', value1: modal.offer_lot_no },
                        { label1: 'Total Offered Qty.', value1: modal.offeredQty || '-', label2: 'Reject Qty.', value2: modal.rejectedQty }
                    ].map(({ label1, value1, label2, value2 }, idx) => (
                        <div className="row align-items-center mt-2" key={idx}>
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">{label1}</label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="text" className="form-control" value={value1} disabled />
                            </div>
                            {label2 && value2 !== undefined && (
                                <>
                                    <div className="col-12 col-md-2">
                                        <label className="col-form-label">{label2}</label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <input type="text" className="form-control" value={value2} disabled />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Inspected Qty. <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name='acceptedQty'
                                autoFocus
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                value={modal.acceptedQty} onChange={handleChange} />
                            <div className='error'>{error?.acceptedQty_err}</div>
                        </div>

                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Heat / Lot No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name='lot_no'
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                value={modal.lot_no} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Inspected Width</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name='acceptedWidth'
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                value={modal.acceptedWidth} onChange={handleChange} />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Inspected Length</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name='acceptedLength'
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                value={modal.acceptedLength} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">T.C. No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input type="number" className="form-control" name='tcNo'
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                value={modal.tcNo} onChange={handleChange} />
                        </div>
                    </div>

                    {modal.rejectedQty > 0 && (
                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Rejected Length  <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="number" className="form-control" name='rejected_length'
                                    onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                    value={modal.rejected_length} onChange={handleChange} />
                                <div className='error'>{error.rejected_length_err}</div>
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Rejected Width  <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="number" className="form-control" name='rejected_width'
                                    onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                    value={modal.rejected_width} onChange={handleChange} />
                                <div className='error'>{error.rejected_width_err}</div>
                            </div>
                        </div>
                    )}

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Remark</label>
                        </div>
                        <div className="col-10">
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

export default RequestVerifyModal