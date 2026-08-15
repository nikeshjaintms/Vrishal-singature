import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';

const ManageUnitLocation = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState('');
    const [unitLocation, setUnitLocation] = useState('');
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (data?._id) {
            setUnitLocation(data?.name);
            setSelectValue(data?.status);
        }
    }, [data]);

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true)
            const formData = new URLSearchParams();
            formData.append('name', unitLocation);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }
            axios({
                method: 'POST',
                url: `${V_URL}/user/manage-unit-location`,
                data: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`
                }
            }).then((res) => {
                if (res.data.success === true) {
                    navigate('/main-store/user/unit-location-management');
                    toast.success(res.data.message);
                    setUnitLocation('');
                }
            }).catch((error) => {
                console.log(error, 'Error');
                toast.error(error?.response?.data?.message || "Something went wrong");
            }).finally(() => {
                setDisable(false)
            })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!unitLocation || !unitLocation?.trim()) {
            isValid = false;
            err['unit_err'] = "Please enter unit location";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
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
                                    <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/main-store/user/unit-location-management">Unit Location List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Unit Location</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Unit Location Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={(e) => setUnitLocation(e.target.value)} value={unitLocation}
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
                                                className="btn btn-primary cancel-form" onClick={() => setUnitLocation('')}>Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ManageUnitLocation