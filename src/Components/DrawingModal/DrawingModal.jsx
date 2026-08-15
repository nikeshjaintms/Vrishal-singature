import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { V_URL } from '../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import UploadFile from '../DownloadFormat/UploadFile';
import { getMultipleDrawItems } from '../../Store/MutipleDrawing/MultipleDrawing/MultipleDrawItems';
import { MultiSelect } from 'primereact/multiselect';
import { getUserJointType } from '../../Store/Store/JointType/JointType';

const DrawingModal = ({ show, handleClose, itemData, handleSaveModal, editData, drawId, finalId }) => {

    const dispatch = useDispatch();
    const [drawModal, setDrawModal] = useState({
        itemNo: '', qty: '', itemName: '', length: '',
        width: '', itemWeight: '', assemblyWeight: '', assemblySurface: '', item_unit: '', _id: "", joint_type: []
    });
    const [drawGrid, setDrawGrid] = useState({ grid_qty: "", gridNo: "" })
    const [error, setError] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [gridId, setGridId] = useState('');

    useEffect(() => {
        dispatch(getUserJointType({ status: true }));
    }, [])

    const jointData = useSelector((state) => state?.getUserJointType?.user?.data);

    useEffect(() => {
        if (editData) {
            setDrawModal({
                itemNo: editData?.item_no,
                qty: editData?.item_qty,
                itemName: editData?.item_name?._id,
                length: editData?.item_length,
                width: editData?.item_width, 
                itemWeight: editData?.item_weight,
                assemblyWeight: editData?.assembly_weight,
                assemblySurface: editData?.assembly_surface_area,
                item_unit: '',
                _id: editData?._id,
                joint_type: editData?.joint_type?.map((e) => e?._id) || []
            });
            setDrawGrid({
                gridNo: editData?.grid_id?.grid_no,
                grid_qty: editData?.grid_id?.grid_qty,
            });
            setGridId(editData?.grid_id?._id);
            setShowForm(true);
        }
    }, [editData]);

    useEffect(() => {
        const itemId = drawModal.itemName || editData?.itemName?._id;
        if (itemId) {
            const filterData = itemData?.find((it) => it?._id === itemId);
            setDrawModal((prevState) => ({
                ...prevState,
                item_unit: filterData?.unit?.name
            }));
        }
    }, [drawModal.itemName, editData?.itemName?._id, itemData]);

    const handleCloseModal = () => {
        setError({});
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDrawModal((prevState) => {
            const updated = { ...prevState, [name]: value };

            if (name === 'qty' || name === 'itemWeight') {
                const qty = parseFloat(name === 'qty' ? value : prevState.qty) || 0;
                const weight = parseFloat(name === 'itemWeight' ? value : prevState.itemWeight) || 0;
                const calculatedWeight = (qty * weight).toFixed(3);
                updated.assemblyWeight = parseFloat(calculatedWeight).toString();
            }

            return updated;
        });
    }

    const handleGridChange = (e) => {
        setDrawGrid({ ...drawGrid, [e.target.name]: e.target.value });
    }

    const handleClear = (keepGrid = false) => {
        setDrawModal({
            itemNo: '', qty: '', itemName: '', length: '',
            width: '', itemWeight: '', assemblyWeight: '', assemblySurface: '', item_unit: '', _id: "", joint_type: []
        });
        if (!keepGrid) {
            setDrawGrid({ gridNo: '', grid_qty: "" });
            setGridId('');
        }
    }

    const handleAddGrid = () => {
        if (validateGridDetails()) {
            const myurl = `${V_URL}/user/manage-grid`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('drawing_id', drawId);
            bodyFormData.append('grid_no', drawGrid.gridNo)
            bodyFormData.append('grid_qty', drawGrid.grid_qty)
            axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data.success) {
                    toast.success(response.data.message);
                    setGridId(response.data?.data?._id);
                    setShowForm(true);
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                console.log(error, '!!!');
                toast.error(error.response.data.message)
            });
        }
    };

    const validateGridDetails = () => {
        let isValid = true;
        let err = {};
        if (!drawGrid.gridNo || drawGrid.gridNo.trim() === '') {
            isValid = false;
            err['gridNo_err'] = 'Grid No is required.';
        }
        if (!drawGrid.grid_qty || parseInt(drawGrid.grid_qty, 10) <= 0) {
            isValid = false;
            err['grid_qty_err'] = 'Grid Qty must be greater than 0.';
        }
        setError(err);
        return isValid;
    };

    useEffect(() => {
        if (!show) {
            handleClear();
            setError({});
            setShowForm(false);
        }
    }, [show]);

    const handleSubmit = (add) => {
        if (validation()) {
            if (add === true) {
                handleSaveModal(drawModal, true, gridId);
                handleClear(true);
            } else {
                handleCloseModal();
                handleSaveModal(drawModal, false, gridId);
                handleClear();
            }
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!drawModal?.itemName) {
            isValid = false;
            err['itemName_err'] = 'Please select section detail';
        }
        if (!drawModal?.qty) {
            isValid = false;
            err['qty_err'] = 'Please enter quantity';
        }
        setError(err);
        return isValid;
    }

    const jointTypeOptions = jointData?.map((n) => ({
        label: n?.name,
        value: n?._id
    }));

    return (
        <Modal show={show} onHide={handleCloseModal}
            size="lg"
            backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Section Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='material-section'>
                    <div className='row'>
                        <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-top-form">
                                <label className="local-top">Grid No. <span className="login-danger">*</span></label>
                                <input className='form-control' type='text' onChange={handleGridChange}
                                    name='gridNo' value={drawGrid.gridNo} />
                                <div className='error'>{error.gridNo_err}</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-top-form">
                                <label className="local-top">Grid Qty. <span className="login-danger">*</span></label>
                                <input className='form-control' type='number' onChange={handleGridChange}
                                    name='grid_qty' value={drawGrid.grid_qty} />
                                <div className='error'>{error.grid_qty_err}</div>
                            </div>
                        </div>
                        {/* {showForm && ( */}
                        <div className="col-12 col-md-4 col-xl-4">
                            <div className="doctor-submit text-end">
                                <button type="button" className="btn btn-primary submit-form me-2" onClick={handleAddGrid}>Add Section Details</button>
                            </div>
                        </div>
                        {/* )} */}
                    </div>

                    {showForm && (
                        <>
                            <div className='row mb-4'>
                                <div className="col-12 col-md-12 col-xl-12">
                                    <div className="add-group">
                                        <UploadFile url={`${V_URL}/user/import-grid-items`} formData={{ drawId: drawId, gridId }} onUploadSuccess={() => dispatch(getMultipleDrawItems({ id: drawId }))} isProject={localStorage.getItem('U_PROJECT_ID')} />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-12 col-md-6 col-xl-6">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Section Details <span className="login-danger">*</span></label>
                                        <select className='form-control form-select' value={drawModal.itemName}
                                            onChange={handleChange} name='itemName'>
                                            <option value=''>Select Section Details</option>
                                            {itemData?.map((e) =>
                                                <option value={e?._id} key={e?._id}>{e?.name}</option>
                                            )}
                                        </select>
                                        <div className='error'>{error.itemName_err}</div>
                                    </div>
                                </div>
                                {drawModal.itemName && (
                                    <div className="col-12 col-md-6 col-xl-6">
                                        <div className="input-block local-top-form">
                                            <label className="local-top">Unit </label>
                                            <input className="form-control" value={drawModal.item_unit} disabled />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='row'>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Item No. <span className="login-danger">*</span></label>
                                        <input className='form-control' type='text' onChange={handleChange}
                                            name='itemNo' value={drawModal.itemNo} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Quantity(NOS) <span className="login-danger">*</span></label>
                                        <input className='form-control' type='number' onChange={handleChange}
                                            name='qty' value={drawModal.qty} />
                                        <div className='error'>{error.qty_err}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Length(mm) </label>
                                        <input className='form-control' type='number' onChange={handleChange}
                                            name='length' value={drawModal.length} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Width(mm) </label>
                                        <input className='form-control' type='number' onChange={handleChange}
                                            name='width' value={drawModal.width} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Weight(kg) </label>
                                        <input className='form-control' type='number' onChange={handleChange}
                                            name='itemWeight' value={drawModal.itemWeight} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Assembly Weight(kg) </label>
                                        <input className='form-control' type='number' onChange={handleChange}
                                            name='assemblyWeight' value={drawModal.assemblyWeight} readOnly />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-top-form">
                                        <label className="local-top">Assembly Surface Area(sqm) </label>
                                        <input className='form-control' type='number' onChange={handleChange}
                                            name='assemblySurface' value={drawModal.assemblySurface} />
                                    </div>
                                </div>

                                <div className='col-12 col-md-4 col-xl-4 custom-select-wpr'>
                                    <MultiSelect
                                        value={drawModal.joint_type}
                                        onChange={(e) => setDrawModal({ ...drawModal, joint_type: e.value })}
                                        options={jointTypeOptions}
                                        optionLabel="label"
                                        placeholder="Select Joint Type"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-primary' type='button' onClick={handleSubmit}>Save</button>
                <button className='btn btn-outline-primary m-2' type='button' onClick={() => handleSubmit(true)}>Add More</button>
            </Modal.Footer>
        </Modal>
    )
}

export default DrawingModal