import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageJointType = () => {

    const [joint, setJoint] = React.useState('');
    const [disable, setDisable] = React.useState(false);
    const [error, setError] = React.useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    const [selectValue, setSelectValue] = useState('');

    useEffect(() => {
        if (location.state) {
            setJoint(location.state.name);
        }
        setSelectValue(location.state?.status);
    }, [location.state])

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleSubmit = () => {
        if (!joint?.trim()) {
            setError('Please enter joint type');
            return;
        }
        setError('');
        setDisable(true);
        const myurl = `${V_URL}/user/manage-joint-type`;
        const formData = new URLSearchParams();
        formData.append('name', joint);
        if (data?._id) {
            formData.append('id', data._id);
            formData.append('status', selectValue);
        }
        axios({
            method: "post",
            url: myurl,
            data: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data.success === true) {
                navigate('/user/project-store/joint-type-management')
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
            setDisable(false);
        }).catch((error) => {
            console.log(error, '!!');
            toast.error(error?.response?.data?.message || 'Something went wrong')
            setDisable(false);
        })
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/user/project-store/joint-type-management">Joint Type List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Joint Type</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Joint Type Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Joint Type <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={(e) => setJoint(e.target.value)} value={joint} />
                                                    <div className='error'>{error}</div>
                                                </div>
                                            </div>

                                            {data?._id ? (
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="cardNum">
                                                        <div className="mb-3">
                                                            <label htmlFor="fileUpload" className="form-label">Status</label>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" role="switch"
                                                                    onChange={handleRadioChange} checked={selectValue} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" onClick={() => setJoint('')}>Reset</button>
                                            </div>
                                        </div>
                                    </form>
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

export default ManageJointType