import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import Footer from '../Include/Footer';
import axios from 'axios';
import City from '../../../city.json';
import { V_URL } from '../../../BaseUrl';
import { getAuthPerson } from '../../../Store/Admin/Payroll/AuthPerson/AuthPerson';
import { adminGetPartyTag } from '../../../Store/Admin/PartyTag/AdminPartyTag';
import { adminGetPartyGroup } from '../../../Store/Admin/PartyTag/AdminPartyGroup';
import SignatureCanvas from "react-signature-canvas";


const ManageClient = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [client, setClient] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        address_two: "",
        address_three: "",
        pincode: "",
        pancard_no: "",
        contact_person: "",
        req_no: "",
        gst: "",
    });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState("");
    const [selectValue, setSelectValue] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [projectData, setProjectData] = useState([]);
    

    const [signaturePad, setSignaturePad] = useState(null);
    const [signatureData, setSignatureData] = useState("");
    
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (location.state) {
            setClient({
                name: location.state.name,
                email: location.state.email,
                phone: location.state.phone,
                address: location.state.address,
                address_two: location.state.address_two,
                address_three: location.state.address_three,
                pincode: location.state.pincode,
                req_no: location.state.req_no,
                pancard_no: location.state.pancard_no,
                gst: location.state.gstNumber,
                contact_person: location.state.auth_person_id?._id,
            });

            if (data?.signature) {
                setSignatureData(data.signature);   // preload signature when editing
            }
            setSelectValue(location.state?.status);
            setSelectedCity(location.state?.city);
            setSelectedState(location.state?.state);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await Promise?.all([
                    dispatch(adminGetPartyTag()),
                    dispatch(adminGetPartyGroup()),
                    dispatch(getAuthPerson()),
                ]);
            } catch (error) {
                console.log(error, '!!');
            }
        };

        fetchInitialData();
    }, [dispatch]);

    const authData = useSelector((state) => state?.getAuthPerson?.user?.data);

    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setSelectedState(selectedState);
        setSelectedCity("");
    }

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setSelectedCity(selectedCity);
    };

    const defaultCountry = City.find((c) => c.iso2 === "IN");
    const states = defaultCountry ? defaultCountry.states : [];
    const cities = states.find((s) => s.name === selectedState)?.cities || [];

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleChange = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (validation()) {
            const myurl = `${V_URL}/admin/manage-party`

            setDisable(true);
            const formData = new URLSearchParams();
            formData.append("name", client.name);
            formData.append("email", client.email);
            formData.append("phone", client.phone);
            formData.append("address", client.address);
            formData.append("address_two", client.address_two);
            formData.append("address_three", client.address_three);
            formData.append("state", selectedState);
            formData.append("city", selectedCity);
            formData.append("pincode", client.pincode);
            formData.append("req_no", client.req_no);
            formData.append("pancard_no", client.pancard_no);
            formData.append("gstNumber", client.gst);
            formData.append("partyGroup", '661e04e276379e2a0a762595');
            formData.append("party_tag_id", '661f53e375177d2c28107c6c');
            formData.append("auth_person_id", client.contact_person);
            formData.append("is_admin", true);

             if (signatureData) {
                formData.append("signature", signatureData);
            }
            if (data?._id) {
                formData.append("id", data?._id);
                formData.append("status", selectValue);
            }
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('VA_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/admin/client-management');
                }
                else{
                    toast.error(response.data.message);
                }
                setDisable(false)
            }).catch((error) => {
                toast.error(error.response.data.message);
                setDisable(false)
            });
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const handleReset = () => {
        setClient({
            name: "",
            email: "",
            password:"",
            pwdShow: true,
            phone: "",
            address: "",
            address_two: "",
            address_three: "",
            pincode: "",
            pancard_no: "",
            contact_person: "",
            req_no: "",
            gst: "",
        })
        setSelectValue('');
        setSelectedCity('');
        setSelectedState('');
    }

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!client.name || !client.name?.trim()) {
            isValid = false;
            err["name_err"] = "Please enter name";
        }
        if (client.email) {
            if (!client.email) {
                isValid = false;
                err['email_err'] = "Please enter email"
            } else if (typeof client.email !== "undefined") {
                let lastAtPos = client.email.lastIndexOf('@');
                let lastDotPos = client.email.lastIndexOf('.');
                if (!(lastAtPos < lastDotPos && lastAtPos > 0 && client.email.indexOf('@@') === -1 && lastDotPos > 2 && (client.email.length - lastDotPos) > 2)) {
                    isValid = false;
                    err["email_err"] = "Email is not valid";
                }
            }
        }
        if (client.phone) {
            if (!/^\d{10}$/.test(client.phone)) {
                isValid = false;
                err["phone_err"] = "Please enter a valid mobile";
            }
        }
        if (!client.address || !client?.address?.trim()) {
            isValid = false;
            err["address_err"] = "Please enter address";
        }
        if (!selectedState) {
            isValid = false;
            err["state_err"] = "Please select state";
        }
        if (!selectedCity) {
            isValid = false;
            err["city_err"] = "Please select city";
        }
        if (!client.pincode) {
            isValid = false;
            err["pincode_err"] = "Please enter pincode";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                                    <li className="breadcrumb-item"><Link to="/admin/client-management">Client List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Client</li>
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
                                                <h4>{data?._id ? "Edit" : "Add"} Client Details</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Name <span className="login-danger">*</span>
                                                    </label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name="name" value={client.name} />
                                                    <div className="error">{error.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Email</label>
                                                    <input className="form-control" type="email"
                                                        onChange={handleChange} name='email' value={client.email} />
                                                    <div className="error">{error.email_err}</div>
                                                </div >
                                            </div >

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Mobile </label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="phone" value={client.phone} />
                                                    <div className="error">{error.phone_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Address <span className="login-danger">*</span>
                                                    </label>
                                                    <input className="form-control" onChange={handleChange}
                                                        name="address" value={client.address} />
                                                    <div className="error">{error.address_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Address 2 </label>
                                                    <input className="form-control" onChange={handleChange}
                                                        name="address_two" value={client.address_two} />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Address 3 </label>
                                                    <input className="form-control" onChange={handleChange}
                                                        name="address_three" value={client.address_three} />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>State <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={selectedState} onChange={handleStateChange} name='state'>
                                                        <option value="">Select State</option>
                                                        {states.map((state) => (
                                                            <option key={state.name} value={state.name}>{state.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.state_err}</div>
                                                </div >
                                            </div >

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>City <span className="login-danger">*</span></label>
                                                    <select className="form-control select" value={selectedCity}
                                                        onChange={handleCityChange} disabled={!selectedState} name='city'>
                                                        <option value="">Select City</option>
                                                        {cities.map((city) => (
                                                            <option key={city.id} value={city.name}>  {city.name} </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.city_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Pincode <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onChange={handleChange} name='pincode' value={client.pincode}
                                                    />
                                                    <div className='error'>{error.pincode_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Register No.</label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name='req_no' value={client.req_no}
                                                    />
                                                    <div className='error'>{error.req_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Pancard No. </label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name='pancard_no' value={client.pancard_no}
                                                    />
                                                    <div className='error'>{error.pancard_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>  GST </label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name="gst" value={client.gst} />
                                                    <div className="error">{error.gst_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Auth Person(Contact Person) </label>
                                                    <select className="form-select"
                                                        onChange={handleChange} name='contact_person' value={client.contact_person}>
                                                        <option value="">Select Auth Person</option>
                                                        {authData?.map((e) =>
                                                            <option value={e?._id} key={e?._id}>{e?.name}</option>
                                                        )}
                                                    </select>
                                                    <div className="error">{error.contact_person_err} </div>
                                                </div>
                                            </div>

                                            {data?._id ? (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="cardNum">
                                                        <div className="mb-3">
                                                            <label htmlFor="fileUpload" className="form-label">
                                                                Status
                                                            </label>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox"
                                                                    role="switch" onChange={handleRadioChange} checked={selectValue} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                            </div>
                                    </form >
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button" className="btn btn-primary submit-form me-2"
                                                onClick={handleSubmit} disabled={disable}>
                                                {disable ? "Processing..." : data?._id ? "Update" : "Submit"}
                                            </button>
                                            <button type="button" className="btn btn-primary cancel-form"
                                                onClick={handleReset}>
                                                Reset
                                            </button>
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

export default ManageClient