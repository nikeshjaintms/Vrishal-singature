import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Footer from '../../Include/Footer';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { addSize } from '../../../../Store/Piping/Size/ManageSize';
const ManageSize = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setSize(location.state?.name);
            setSizeMM(location.state?.size_mm);

            setSelectValue(location.state?.status);
        }
    }, [location.state]);

    const [size, setSize] = useState('');
    const [size_mm, setSizeMM] = useState('');

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

            formData.append('name', size);
            formData.append('size_mm', size_mm);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }

            dispatch(addSize(formData))
                .then((res) => {
                    console.log(res, 'REs');

                    if (res.payload.success === true) {
                        navigate('/piping/user/size-management');
                        setSize('');
                        setSizeMM('');
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

        if (!size || !size?.trim()) {
            isValid = false;
            err['size_err'] = "Please enter size"
        }

        setError(err);
        return isValid;

    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleReset = () => {
        setSize("")
        setSizeMM("");
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/size-management">Size List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Size</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Size Details</h4>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Size / Inch <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={(e) => setSize(e.target.value)} value={size}
                                                    />
                                                    <div className='error'>{error.size_err}</div>
                                                </div>
                                            </div>
                                             <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Size / MM <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={(e) => setSizeMM(e.target.value)} value={size_mm}
                                                    />
                                                    <div className='error'>{error.size_err}</div>
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

export default ManageSize