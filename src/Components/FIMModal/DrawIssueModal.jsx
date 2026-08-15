import React, { useState } from 'react'
import { Modal } from 'react-bootstrap';

const DrawIssueModal = ({ show, handleClose, authData, handleSave }) => {

    const [drawIssue, setDrawIssue] = useState({
        name: "",
        date: "",
        _id: "",
    });
    const [error, setError] = useState({})

    const handleChange = (e) => {
        setDrawIssue({ ...drawIssue, [e.target.name]: e.target.value });
    }

    const handleCloseModal = () => {
        setError({});
        handleClose();
    };

    const handleSubmit = () => {
        if (validation()) {
            handleSave(drawIssue);
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!drawIssue.name) {
            isValid = false;
            err['name_err'] = 'Please enter name';
        }
        if (!drawIssue.date) {
            isValid = false;
            err['date_err'] = 'Please select date';
        }
        setError(err);
        return isValid;
    }

    return (
        <Modal show={show} onHide={handleCloseModal}
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Issue Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className="row align-items-center mt-2">
                        <div className="col-3">
                            <label className="col-form-label">Issue To <span className="login-danger">*</span> </label>
                        </div>
                        <div className="col-9">
                            <select className="form-control" value={drawIssue.name}
                                name='name' onChange={handleChange}>
                                <option vlaue=''>Select Issue to </option>
                                {authData?.map((elem) =>
                                    <option value={elem?.name} key={elem?._id}>{elem?.name}</option>
                                )}
                            </select>
                            <div className='error'>{error.name_err}</div>
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-3">
                            <label className="col-form-label">Issue Date <span className="login-danger">*</span></label>
                        </div>
                        <div className="col-9">
                            <input type="date" className="form-control" value={drawIssue.date}
                                name='date' onChange={handleChange} />
                            <div className='error'>{error.date_err}</div>
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

export default DrawIssueModal