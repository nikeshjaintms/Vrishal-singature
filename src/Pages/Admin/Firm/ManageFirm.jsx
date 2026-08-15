import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import axios from 'axios';
import City from '../../../city.json';
import { V_URL } from '../../../BaseUrl';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';


const ManageFirm = () => {

    const [firm, setFirm] = useState({
        register_no: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        address_two: "",
        address_three: "",
        pincode: "",
        image: "",
        gst_no: "",
    });

    const [disable, setDisable] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {

        if (location.state) {

            setFirm({
                register_no: location.state?.register_no,
                name: location.state?.name,
                email: location.state?.email,
                phone: location.state?.mobile_number,
                address: location.state?.address,
                address_two: location.state?.address_two,
                address_three: location.state?.address_three,
                pincode: location.state?.pincode,
                image: location.state?.image,
                gst_no: location.state?.gst_no,
            });

            setSelectedCity(location.state?.city);
            setSelectedState(location.state?.state);
            setSelectValue(location.state?.status);
        }

    }, [location.state])

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setSelectedState(selectedState);
        setSelectedCity('');
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setSelectedCity(selectedCity);
    };

    const defaultCountry = City.find((c) => c.iso2 === 'IN');
    const states = defaultCountry ? defaultCountry.states : [];
    const cities = states.find((s) => s.name === selectedState)?.cities || [];

    const handleChange = (e) => {
        setFirm({ ...firm, [e.target.name]: e.target.value });
    }

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };


    const handleImage = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
            const fileType = e.target.files[0].type;

            if (allowedTypes.includes(fileType)) {
                // setFirm({ ...firm, image: URL.createObjectURL(e?.target?.files[0]) })
                setDisable(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append("image", e?.target?.files[0]);

                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                })
                    .then((result) => {

                        if (result?.data?.success === true) {
                            setFirm({ ...firm, image: result?.data?.data?.image });
                            setDisable(false);
                        } else {
                            setFirm({ ...firm, image: "" });
                        }
                    })
                    .catch((error) => {
                        setFirm({ ...firm, image: "" });
                        setDisable(false);
                        toast.error("Unable to upload image");
                    });
            } else {
                setFirm({ ...firm, image: "" });
                setDisable(false);
                toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
            }
        }
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('register_no', firm.register_no);
            bodyFormData.append('name', firm.name);
            bodyFormData.append('email', firm.email);
            bodyFormData.append('address', firm.address);
            bodyFormData.append('address_two', firm?.address_two);
            bodyFormData.append('address_three', firm.address_three);
            bodyFormData.append('state', selectedState);
            bodyFormData.append('city', selectedCity);
            bodyFormData.append('pincode', firm.pincode);
            bodyFormData.append('mobile_number', firm.phone);
            bodyFormData.append('image', firm.image);
            bodyFormData.append('gst_no', firm.gst_no);
            if (data?._id) {
                bodyFormData.append('id', data?._id)
                bodyFormData.append('status', selectValue)
            }
            axios({
                method: 'post',
                url: `${V_URL}/admin/manage-firm`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    navigate('/admin/firm-management');
                    handleReset()
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
                setDisable(false);
            })
        }
    }

    const handleReset = () => {
        setFirm({
            register_no: "",
            name: "",
            email: "",
            phone: "",
            address: "",
            address_two: "",
            address_three: "",
            pincode: "",
            image: "",
            gst_no: ""
        });
        setSelectedCity('');
        setSelectedState('');
    }

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!firm.name || !firm.name.trim()) {
            isValid = false;
            err['name_err'] = "Please enter name"
        }
        if (!firm.register_no || !firm.register_no.trim()) {
            isValid = false;
            err['register_no_err'] = "Please enter register no."
        }

        if (!firm.address || !firm?.address?.trim()) {
            isValid = false;
            err['address_err'] = "Please enter address"
        }

        if (!firm.email) {
            isValid = false;
            err['email_err'] = "Please enter email"
        } else if (typeof firm.email !== "undefined") {
            let lastAtPos = firm.email.lastIndexOf('@');
            let lastDotPos = firm.email.lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && firm.email.indexOf('@@') === -1 && lastDotPos > 2 && (firm.email.length - lastDotPos) > 2)) {
                isValid = false;
                err["email_err"] = "Email is not valid";
            }
        }

        if (!firm.phone) {
            isValid = false;
            err["phone_err"] = "Please enter mobile";
        } else if (!/^\d{10}$/.test(firm.phone)) {
            isValid = false;
            err['phone_err'] = 'Please enter a valid mobile';
        }

        if (!selectedState) {
            isValid = false;
            err['state_err'] = "Please select state"
        }

        if (!selectedCity) {
            isValid = false;
            err['city_err'] = "Please select city"
        }

        if (!firm.pincode) {
            isValid = false;
            err['pincode_err'] = "Please enter pincode"
        }
        if (!firm.gst_no || !firm?.gst_no?.trim()) {
            isValid = false;
            err['gst_no_err'] = "Please enter GST No."
        }
        if (!firm.image) {
            isValid = false;
            err['image_err'] = "Please select image"
        }

        setError(err);
        return isValid
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
                                    <li className="breadcrumb-item"><Link to="/admin/firm-management">Firm </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Firm</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Firm Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        value={firm.name} name='name' onChange={handleChange}
                                                    />
                                                    <div className='error'>{error.name_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Register No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        name='register_no' value={firm.register_no} onChange={handleChange}
                                                    />
                                                    <div className='error'>{error.register_no_err}</div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Address<span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        name='address' onChange={handleChange} value={firm.address}
                                                    />
                                                    <div className='error'>{error.address_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Address 2</label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} value={firm.address_two} name='address_two'
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Address 3</label>
                                                    <input className="form-control" type="text"
                                                        name='address_three' value={firm.address_three} onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>State <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={selectedState}
                                                        onChange={handleStateChange} name='state'
                                                    >
                                                        <option value="">Select State</option>
                                                        {states.map((state) => (
                                                            <option key={state.name} value={state.name}>
                                                                {state.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.state_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>City <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={selectedCity}
                                                        onChange={handleCityChange}
                                                        disabled={!selectedState}
                                                        name='city'>
                                                        <option>Select City</option>
                                                        {cities.map((city) => (
                                                            <option key={city.id} value={city.name}>
                                                                {city.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.city_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>PinCode <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        value={firm.pincode} name='pincode' onChange={handleChange}
                                                    />
                                                    <div className='error'>{error.pincode_err}</div>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Email <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="email"
                                                        name='email' onChange={handleChange} value={firm.email}
                                                    />
                                                    <div className='error'>{error.email_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Mobile <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        name='phone' value={firm.phone} onChange={handleChange}
                                                    />
                                                    <div className='error'>{error.phone_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>GST No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        name='gst_no' value={firm.gst_no} onChange={handleChange}
                                                    />
                                                    <div className='error'>{error.gst_no_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                          
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">Images <span className="login-danger">*</span></label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="file" className="upload">Choose File</label>
                                                        <input type="file" accept="image/*" name="image" id="file"
                                                            onChange={handleImage} className="hide-input" />
                                                    </div>
                                                    {firm.image ? <img src={firm?.image} style={{ height: '130px', objectFit: 'cover', borderRadius: '10px', marginTop: "10px" }} alt='firm' /> : ""}
                                                    <div className='error'>{error?.image_err}</div>
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

export default ManageFirm