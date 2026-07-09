import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import toast from 'react-hot-toast';

const IssueRequestModal = ({ show, handleClose, modalData, handleSubmitModal, disable, issueRequestData }) => {

    const [sectionData, setSectionData] = useState({
        length: "",
        width: "",
        qty: "",
        _id: "",
        remark: "",
        issue_req_id: "",
    });

    useEffect(() => {
        const filterData = issueRequestData?.find(item =>
            item?.transaction_id?._id === modalData?._id &&
            item.transaction_id?.drawingId?._id === modalData?.drawingId
        );

        if (!filterData || Object.keys(filterData).length === 0) {
            setSectionData({
                length: modalData?.item_length ?? '',
                width: modalData?.item_width ?? '',
                qty: modalData?.quantity ?? '',
                _id: modalData?._id ?? '',
                remark: modalData?.remark ?? '',
            });
        } else {
            setSectionData({
                length: filterData?.requested_length ?? '',
                width: filterData?.requested_width ?? '',
                qty: filterData?.requested_qty ?? '',
                _id: filterData?.transaction_id?._id ?? '',
                remark: filterData?.remark ?? '',
                issue_req_id: filterData?._id ?? '',
            });
        }
    }, [modalData, issueRequestData]);


    const handleChange = (e) => {
        setSectionData({ ...sectionData, [e.target.name]: e.target.value });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const handleSubmit = () => {
        if (sectionData.length && sectionData.width && sectionData.qty) {
            handleSubmitModal(sectionData);
        } else {
            toast.error('All fields are required!: length, width, quantity');
        }
    }

    const handleCloseModal = () => {
        handleClose();
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
                            <label className="col-form-label">Section Details</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text' value={modalData?.itemName?.name} disabled />
                        </div>
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Grid No.</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' type='text' value={modalData?.grid_no} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2 mt-2 mt-md-0'>
                            <label className="col-form-label">Item No.</label>
                        </div>
                        <div className='col-12 col-md-4 mt-2 mt-md-0'>
                            <input className='form-control' type='text' value={modalData?.item_no} disabled />
                        </div>
                        <div className='col-12 col-md-2 mt-2 mt-md-0'>
                            <label className="col-form-label">Requested Quantity</label>
                        </div>
                        <div className='col-12 col-md-4 mt-2 mt-md-0'>
                            <input className='form-control' type='number'
                                onChange={handleChange} name='qty' value={sectionData?.qty} />
                        </div>
                    </div>

                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2 mt-2 mt-md-0'>
                            <label className="col-form-label">Requested Length(mm)</label>
                        </div>
                        <div className='col-12 col-md-4 mt-2 mt-md-0'>
                            <input className='form-control' type='number'
                                name='length' onChange={handleChange} value={sectionData?.length}
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} />
                        </div>
                        <div className='col-12 col-md-2 mt-2 mt-md-0'>
                            <label className="col-form-label">Requested Width(mm)</label>
                        </div>
                        <div className='col-12 col-md-4 mt-2 mt-md-0'>
                            <input className='form-control' type='number'
                                name='width' onChange={handleChange} value={sectionData?.width}
                                onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>


                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Item Weight(kg)</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' value={modalData?.item_weight} disabled />
                        </div>
                        <div className='col-12 col-md-2 mt-2 mt-md-0'>
                            <label className="col-form-label">Assembly Weight(kg)</label>
                        </div>
                        <div className='col-12 col-md-4 mt-2 mt-md-0'>
                            <input className='form-control' value={modalData?.assembly_weight} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className='col-12 col-md-2'>
                            <label className="col-form-label">Assembly Surface Area(sqm)</label>
                        </div>
                        <div className='col-12 col-md-4'>
                            <input className='form-control' value={modalData?.assembly_surface_area} disabled />
                        </div>
                    </div>
                    <div className="row align-items-center mt-2">
                        <div className="col-12 col-md-2">
                            <label className="col-form-label">Remark</label>
                        </div>
                        <div className="col-10">
                            <textarea className="form-control" onChange={handleChange} name="remark" value={sectionData.remark} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type='button' className='btn btn-primary' onClick={handleSubmit} disabled={disable}>
                    {disable ? 'Processing...' : 'Save'}
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default IssueRequestModal