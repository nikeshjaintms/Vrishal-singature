import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addAuthPerson } from '../../../Store/Admin/Payroll/AuthPerson/ManageAuthPerson';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';

const ManageAuthPerson = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [auth, setAuth] = useState('');
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
    }, []);

    useEffect(() => {
        if (location.state) {
            setAuth(location.state?.name);
            setSelectValue(location.state?.status);
        }
    }, [location.state]);


    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true)
            const formData = new URLSearchParams();

            formData.append('name', auth);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }

            dispatch(addAuthPerson(formData)).then((res) => {
                if (res.payload.success === true) {
                    navigate('/admin/auth-people-management');
                    setAuth('');
                }
                setDisable(false)
            }).catch((error) => {
                setDisable(false)
            })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!auth || !auth?.trim()) {
            isValid = false;
            err['auth_err'] = "Please enter auth person"
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
                                    <li className="breadcrumb-item"><Link to="/admin/auth-people-management">Auth People List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Auth Person</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Auth Person Details</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={(e) => setAuth(e.target.value)} value={auth}
                                                    />
                                                    <div className='error'>{error.auth_err}</div>
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
                                                className="btn btn-primary cancel-form" onClick={() => setAuth('')}>Reset</button>
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

export default ManageAuthPerson