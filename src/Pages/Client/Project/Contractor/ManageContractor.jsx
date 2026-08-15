import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SiteInchargeDetails from '../../../../Components/Contractor/SiteInchargeDetails';
import SuperVisorDetails from '../../../../Components/Contractor/SuperVisorDetails';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';

const ManageContractor = () => {

    const [contractor, setContractor] = React.useState({
        name: "",
        phone: "",
        email: "",
    });
    const [site, setSite] = React.useState({
        name: "",
        mobile: "",
        email: "",
    });
    const [superVisor, setSuperVisor] = React.useState({
        name: "",
        mobile: "",
        email: "",
    });
    const location = useLocation();
    const navigate = useNavigate();
    const [siteData, setSiteData] = React.useState([]);
    const [superVisorData, setSuperVisorData] = React.useState([]);
    const [errors, setErrors] = React.useState({});
    const [errors2, setErrors2] = React.useState({});
    const [errors3, setErrors3] = React.useState({});
    const [disable, setDisable] = React.useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editIndex2, setEditIndex2] = useState(null);
    const data = location.state;
    const [selectValue, setSelectValue] = useState('');

    useEffect(() => {
        if (location.state) {
            setContractor({
                name: location.state.name,
                phone: location.state.mobile,
                email: location.state.email,
            });
            setSiteData(location.state.site_incharge);
            setSuperVisorData(location.state.site_supervisor);
            setSelectValue(location.state.status);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setContractor({ ...contractor, [e.target.name]: e.target.value })
    }
    const handleChangeSite = (e) => {
        setSite({ ...site, [e.target.name]: e.target.value })
    }
    const handleChangeSupervisor = (e) => {
        setSuperVisor({ ...superVisor, [e.target.name]: e.target.value })
    }

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-contractor`;
            const formData = new URLSearchParams();
            formData.append('name', contractor.name);
            formData.append('mobile', contractor.phone);
            formData.append('email', contractor.email);
            formData.append('site_incharge', JSON.stringify(siteData));
            formData.append('site_supervisor', JSON.stringify(superVisorData));
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
                    navigate('/user/project-store/contractor-master-management')
                    toast.success(response.data.message);
                    handleReset();
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
    }

    const handleSaveSite = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        if (!site.name?.trim()) newErrors.name_err = 'Please enter name';
        if (!site.mobile) {
            newErrors.mobile_err = 'Please enter mobile number';
        } else if (!mobileRegex.test(site.mobile)) {
            newErrors.mobile_err = 'Please enter a valid 10-digit mobile number';
        }
        if (!site.email) {
            newErrors.email_err = 'Please enter email';
        } else if (!emailRegex.test(site.email)) {
            newErrors.email_err = 'Please enter a valid email';
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors2(newErrors);
        } else {
            if (editIndex !== null) {
                const updatedData = siteData.map((item, index) =>
                    index === editIndex ? site : item
                );
                setSiteData(updatedData);
                setEditIndex(null);
            } else {
                setSiteData([...siteData, site]);
            }
            setSite({ name: '', mobile: '', email: '' });
            setErrors2({ name_err: '', mobile_err: '', email_err: '' });
        }
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setSite(siteData[index]);
    };
    const handleDelete = (index) => {
        const updatedData = siteData.filter((_, i) => i !== index);
        setSiteData(updatedData);
    };

    const handleSaveSuperVisor = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        if (!superVisor.name?.trim()) newErrors.name_err = 'Please enter name';
        if (!superVisor.mobile) {
            newErrors.mobile_err = 'Please enter mobile number';
        } else if (!mobileRegex.test(superVisor.mobile)) {
            newErrors.mobile_err = 'Please enter a valid 10-digit mobile number';
        }
        if (!superVisor.email) {
            newErrors.email_err = 'Please enter email';
        } else if (!emailRegex.test(superVisor.email)) {
            newErrors.email_err = 'Please enter a valid email';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors3(newErrors);
        } else {
            if (editIndex2 !== null) {
                const updatedData = superVisorData.map((item, index) =>
                    index === editIndex2 ? superVisor : item
                );
                setSuperVisorData(updatedData);
                setEditIndex2(null);
            } else {
                setSuperVisorData([...superVisorData, superVisor]);
            }
            setSuperVisor({ name: '', mobile: '', email: '' });
            setErrors3({ name_err: '', mobile_err: '', email_err: '' });
        }
    }

    const handleEditSupervisor = (index) => {
        setEditIndex2(index);
        setSuperVisor(superVisorData[index]);
    };

    const handleDeleteSupervisor = (index) => {
        const updatedData = superVisorData.filter((_, i) => i !== index);
        setSuperVisorData(updatedData);
    };

    const handleReset = () => {
        setContractor({ name: '', phone: '', email: '' });
        setSuperVisorData([]);
        setSiteData([]);
    }

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!contractor?.name || !contractor?.name?.trim()) {
            isValid = false;
            err['name_err'] = 'Please enter name';
        }
        if (!contractor?.phone) {
            isValid = false;
            err['phone_err'] = 'Please enter mobile';
        }
        if (!contractor?.email) {
            isValid = false;
            err['email_err'] = 'Please enter email';
        } else if (typeof contractor.email !== "undefined") {
            let lastAtPos = contractor.email.lastIndexOf('@');
            let lastDotPos = contractor.email.lastIndexOf('.');
            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && contractor.email.indexOf('@@') === -1 && lastDotPos > 2 && (contractor.email.length - lastDotPos) > 2)) {
                isValid = false;
                err["email_err"] = "Email is not valid";
            }
        }
        if (!siteData.length > 0) {
            isValid = false;
            err['site_err'] = 'Please add at least one site incharge';
        }
        if (!superVisorData?.length > 0) {
            isValid = false;
            err['superVisor_err'] = 'Please add at least one site supervisor'
        }
        setErrors(err)
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/contractor-master-management">Contractor List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Contractor</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Contractor Details:</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Contractor Party Name <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name="name"
                                                        onChange={handleChange} value={contractor.name} />
                                                    <div className='error'>{errors.name_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Contractor Mobile Name <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name="phone"
                                                        onChange={handleChange} value={contractor.phone} />
                                                    <div className='error'>{errors.phone_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Contractor Email <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name="email"
                                                        onChange={handleChange} value={contractor.email} />
                                                    <div className='error'>{errors.email_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <SiteInchargeDetails
                                            site={site}
                                            siteData={siteData}
                                            errors2={errors2}
                                            editIndex={editIndex}
                                            handleChangeSite={handleChangeSite}
                                            handleSaveSite={handleSaveSite}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />

                                        <SuperVisorDetails
                                            superVisor={superVisor}
                                            superVisorData={superVisorData}
                                            errors3={errors3}
                                            editIndex2={editIndex2}
                                            handleChangeSupervisor={handleChangeSupervisor}
                                            handleSaveSuperVisor={handleSaveSuperVisor}
                                            handleEditSupervisor={handleEditSupervisor}
                                            handleDeleteSupervisor={handleDeleteSupervisor}
                                        />

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

                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
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

export default ManageContractor