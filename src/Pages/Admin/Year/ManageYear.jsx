import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../BaseUrl';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';

const ManageYear = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const [disable, setDisable] = useState(false);
    const [year, setYear] = useState({ start_year: "", end_year: "" });
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (location.state) {
            setYear({
                start_year: moment(location.state?.start_year).format('YYYY-MM-DD'),
                end_year: moment(location.state?.end_year).format('YYYY-MM-DD')
            })
            setSelectValue(location.state?.status);
        }
    }, [location.state]);

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleChange = (e) => {
        setYear({ ...year, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true)
            const formData = new URLSearchParams();
            formData.append('start_year', year.start_year);
            formData.append('end_year', year.end_year);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }
            axios({
                method: 'post',
                url: `${V_URL}/admin/manage-year`,
                data: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    navigate('/admin/year-management');
                    setYear({ start_year: '', end_year: '' });
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
        if (!year.start_year) {
            isValid = false;
            err['start_err'] = "Please enter start year"
        }
        if (!year.end_year) {
            isValid = false;
            err['end_err'] = "Please enter end year"
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
                                    <li className="breadcrumb-item"><Link to="/admin/year-management">Year </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Year</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Year Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label htmlFor="start_year" className="form-label">Start Year <span className='text-danger'> *</span></label>
                                                    <input type="date" className="form-control"
                                                        onChange={handleChange} name='start_year' value={year.start_year}
                                                    />
                                                    <div className='error'>{error.start_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label htmlFor="start_year" className="form-label">End Year <span className='text-danger'> *</span></label>
                                                    <input type="date" className="form-control"
                                                        onChange={handleChange} name='end_year' value={year.end_year}
                                                    />
                                                    <div className='error'>{error.end_err}</div>
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
                                                className="btn btn-primary cancel-form" onClick={() => setYear({ start_year: '', end_year: '' })}>Reset</button>
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

export default ManageYear