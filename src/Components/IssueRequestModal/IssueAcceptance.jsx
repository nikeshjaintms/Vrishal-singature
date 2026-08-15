import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'

const IssueAcceptance = ({ show, handleClose, modalData, disable2, offerData, handleSubmitModal, stockReportData }) => {
    const [modal, setModal] = useState({
        qty: "",
        length: "",
        width: "",
        remark: "",
        imir_no: "",
        heat_no: "",
        imir_no_id: "",
        issue_req_id: "",
        _id: ""
    });
    const [error, setError] = useState({});

    useEffect(() => {
        const filterData = offerData?.find((of) => of?._id === modal?.imir_no_id);
        const getLot = filterData?.items?.find(it => it?.transactionId?.itemName?._id === modalData?.transaction_id?.itemName?._id)
        if (!modalData?.issue_accept_no) {
            setModal({
                ...modal,
                qty: modalData?.requested_qty,
                length: modalData?.requested_length,
                width: modalData?.requested_width,
                heat_no: getLot ? getLot?.lotNo : "-",
                imir_no: filterData?.imir_no,
                issue_req_id: modalData?._id
            });
        } else {
            const filterImir = offerData?.find((of) => of?.imir_no == modalData?.imir_no);
            setModal({
                qty: modalData?.issued_qty,
                length: modalData?.issued_length,
                width: modalData?.issued_width,
                remark: modalData?.remarks,
                imir_no: modalData?.imir_no,
                heat_no: modalData?.heat_no,
                imir_no_id: filterImir?._id,
                issue_req_id: modalData?.issue_req_id?._id,
                _id: modalData?._id,
            });
        }
    }, [modal.imir_no_id, offerData, modalData, show]);

    const handleChange = (e) => {
        setModal({ ...modal, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation()) {
            handleSubmitModal(modal)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    useEffect(() => {
        if (!show) {
            setModal({
                qty: "",
                length: "",
                width: "",
                remark: "",
                imir_no: "",
                heat_no: "",
                imir_no_id: "",
                issue_req_id: ""
            });
            setError({});
        }
    }, [show]);

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!modal.qty || modal.qty <= 0) {
            isValid = false;
            err['qty_err'] = 'Please enter a valid quantity';
        }
        if (!modal.length || modal.length <= 0) {
            isValid = false;
            err['length_err'] = 'Please enter a valid length';
        }
        if (!modal.width || modal.width <= 0) {
            isValid = false;
            err['width_err'] = 'Please enter a valid width';
        }
        if (!modal.imir_no) {
            isValid = false;
            err['imir_no_id_err'] = 'Please select imir no.';
        }
        setError(err);
        return isValid;
    }

    const handleCloseModal = () => {
        handleClose();
        setError({});
    }

    return (
        <Modal show={show} onHide={handleCloseModal}
            size="lg"
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Section Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Client</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.drawingId?.project?.party?.name :
                                    modalData.issue_req_id?.transaction_id?.drawingId?.project?.party?.name
                                } disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Contractor Name</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.drawingId?.issued_person?.name :
                                    modalData.issue_req_id?.transaction_id?.drawingId?.issued_person?.name} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Drawing No.</label>
                        </div>
                        <div className='col-12 col-md-10'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.drawingId?.drawing_no :
                                    modalData.issue_req_id?.transaction_id?.drawingId?.drawing_no} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">REV</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.drawingId?.rev :
                                    modalData?.issue_req_id?.transaction_id?.drawingId?.rev} disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Sheet No.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.drawingId?.sheet_no :
                                    modalData?.issue_req_id?.transaction_id?.drawingId?.sheet_no} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Assembly No.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.drawingId?.assembly_no :
                                    modalData?.issue_req_id?.transaction_id?.drawingId?.assembly_no} disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Grid No.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.grid_no :
                                    modalData?.issue_req_id?.transaction_id?.grid_no} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Item No.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.item_no :
                                    modalData?.issue_req_id?.transaction_id?.item_no} disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Section Details</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.transaction_id?.itemName?.name :
                                    modalData?.issue_req_id?.transaction_id?.itemName?.name} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Requested Length(mm)</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.requested_length :
                                    modalData?.issue_req_id?.requested_length} disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Requested Width(mm)</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.requested_width :
                                    modalData?.issue_req_id?.requested_width} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Requested Qty.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text'
                                value={!modalData?.issue_accept_no ?
                                    modalData?.requested_qty :
                                    modalData?.issue_req_id?.requested_qty} disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Issue Qty.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='number'
                                value={modal.qty} onChange={handleChange} name='qty'
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                disabled={modalData?.issue_req_id ? true : false} />
                            <div className='error'>{error?.qty_err}</div>
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Issue Length(mm)</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='number'
                                name='length' value={modal.length} onChange={handleChange}
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} />
                            <div className='error'>{error?.length_err}</div>
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Issue Width(mm)</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='number'
                                name='width' value={modal.width} onChange={handleChange}
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} />
                            <div className='error'>{error?.width_err}</div>
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">IMIR No.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <select className='form-control form-select' onChange={handleChange}
                                name='imir_no_id' value={modal.imir_no_id}>
                                <option value=''>Select IMIR No.</option>
                                {offerData?.map((e) =>
                                    <option key={e._id} value={e._id}>{e.imir_no}</option>
                                )}
                            </select>
                            <div className='error'>{error?.imir_no_id_err}</div>
                        </div>

                        {modal.imir_no ? (
                            <>
                                <div className='col-12 col-md-2'>
                                    <label className="col-form-label">Heat / Lot No.</label>
                                </div>
                                <div className='col-12 col-md-4'>
                                    <input className='form-control' type='number'
                                        name='heat_no' value={modal.heat_no} disabled />
                                </div>
                            </>
                        ) : null}
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type='button' className='btn btn-primary' onClick={handleSubmit} disabled={disable2}>
                    {disable2 ? 'Processing...' : 'Save'}
                </button>
            </Modal.Footer>
        </Modal >
    )
}

export default IssueAcceptance