import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Footer from '../../Include/Footer';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { addUOM } from '../../../../Store/Piping/UOM/ManageUOM';
const ManageUnit = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setUnit(location.state?.name);
            setSelectValue(location.state?.status);
        }
    }, [location.state]);

    const [unit, setUnit] = useState('');
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState('');
    const [selectValue, setSelectValue] = useState('');


    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true)
            const formData = new URLSearchParams();

            formData.append('name', unit);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }

            dispatch(addUOM(formData))
                .then((res) => {
                    console.log(res, 'REs');

                    if (res.payload.success === true) {
                        navigate('/piping/user/unit-management');
                        setUnit('');
                    }
                    setDisable(false)
                }).catch((error) => {
                    console.log(error, 'Error')
                    setDisable(false)
                })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!unit || !unit?.trim()) {
            isValid = false;
            err['unit_err'] = "Please enter unit"
        }

        setError(err);
        return isValid;

    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleReset = () => {
        setUnit("")
        setError("")
    }
    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>

            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/unit-management">Unit List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Unit</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Unit Details</h4>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={(e) => setUnit(e.target.value)} value={unit}
                                                    />
                                                    <div className='error'>{error.unit_err}</div>
                                                </div>
                                            </div>

                                            {data?._id ? (
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="cardNum">
                                                        <div className="mb-3">
                                                            <label htmlFor="fileUpload" className="form-label">Status</label>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" role="switch" onChange={handleRadioChange} checked={selectValue} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}

                                        </div>
                                    </form>
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                            <button type="button"
                                                className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default ManageUnit