import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../BaseUrl';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';

const ManageRole = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const [disable, setDisable] = useState(false);
    const [role, setRole] = useState({ name: "", });
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (location.state) {
            setRole({
                name: location.state?.name, // No moment here
            });
            setSelectValue(location.state?.status);
        }
    }, [location.state]);


    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true)
            const formData = new URLSearchParams();
            formData.append('name', role.name);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }
            axios({
                method: 'post',
                url: `${V_URL}/admin/manage-erprole`,
                data: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    navigate('/admin/erprole-management');
                    setRole({ name: '' });
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
                setDisable(false);
            })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!role.name) {
            isValid = false;
            err['name_err'] = "Please enter Role";
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
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/admin/erprole-management">Role </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Role</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Role Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label htmlFor="name" className="form-label">Role <span className='text-danger'> *</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={handleChange} name='name' value={role.name}
                                                    />
                                                    <div className='error'>{error.name_err}</div>
                                                </div>
                                            </div>
                                            {/* <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label htmlFor="role" className="form-label">End Year <span className='text-danger'> *</span></label>
                                                    <input type="date" className="form-control"
                                                        onChange={handleChange} name='end_year' value={year.end_year}
                                                    />
                                                    <div className='error'>{error.end_err}</div>
                                                </div>
                                            </div> */}
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
                                                className="btn btn-primary cancel-form" onClick={() => setRole({ name: ''})}>Reset</button>
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

export default ManageRole