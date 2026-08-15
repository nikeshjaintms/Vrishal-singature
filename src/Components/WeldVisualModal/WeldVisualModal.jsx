import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';

const WeldVisualModal = ({ handleClose, show, modalData, handleSubmit, disable2 }) => {

    const [status, setStatus] = useState(null);
    const [error, setError] = useState({});
    const [modal, setModal] = useState({
        remark: ""
    });

    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    const handleChange = (e) => {
        setModal({ ...modal, [e.target.name]: e.target.value });
    }

    const handleSaveModal = () => {
        if (validation()) {
            handleSubmit({ status, id: modalData?._id, modal })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (status === null) {
            isValid = false;
            err['status_err'] = 'Please select status';
        }

        setError(err);
        return isValid;
    }

    const handleCloseModal = () => {
        setError({});
        handleClose();
    }

    useEffect(() => {
        if (!show) {
            setStatus(null)
            setError({});
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleCloseModal}
            size="lg"
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Weld Visual Inspection Report Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Report No.</label>
                        </div>
                        <div className="col-12 col-md-10">
                            <input className="form-control" value={modalData?.weld_report_no} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Client</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input className="form-control" value={modalData?.fitup_id?.issue_id?.issue_req_id?.transaction_id?.drawingId?.project?.party?.name} disabled />
                        </div>
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Project PO No.</label>
                        </div>
                        <div className="col-12 col-md-4">
                            <input className="form-control" value={modalData?.fitup_id?.issue_id?.issue_req_id?.transaction_id?.drawingId?.project?.work_order_no} disabled />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Status <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="select-gender">
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="accept"
                                            className="form-check-input"
                                            checked={status === true}
                                            onChange={handleStatusChange}
                                        />
                                        Accept
                                    </label>
                                </div>
                                <div className="form-check-inline">
                                    <label className="form-check-label">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="reject"
                                            className="form-check-input"
                                            checked={status === false}
                                            onChange={handleStatusChange}
                                        />
                                        Reject
                                    </label>
                                </div>
                            </div>
                            <div className='error'>{error?.status_err}</div>
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">

                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Status <span className="login-danger">*</span></label>
                        </div>
                        <div className='col-12 col-md-10'>
                            <textarea className='form-control' onChange={handleChange} name='remark' value={modal.remark} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-primary' type='button' onClick={handleSaveModal} disabled={disable2}>{disable2 ? 'Processing...' : 'Save'}</button>
            </Modal.Footer>
        </Modal>
    )
}

export default WeldVisualModal