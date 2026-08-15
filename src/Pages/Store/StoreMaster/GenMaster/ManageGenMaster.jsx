import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import toast from 'react-hot-toast';
import Footer from '../../Include/Footer';
import { getGenTag } from '../../../../Store/Store/GenralMaster/TagGenMaster';
import axios from 'axios';
import { V_URL } from '../../../../BaseUrl';

const ManageGenMaster = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [gen, setGen] = useState({ name: '', tag: '' });
    const data = location.state;

    useEffect(() => {
        dispatch(getGenTag())
    }, [])

    useEffect(() => {
        if (data) {
            setGen({
                name: data?.name,
                tag: data?.tag_id
            });
        }
    }, [data])

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate]);



    const tagData = useSelector((state) => state.getGenTag?.user?.data);

    const handleChange = (e) => {
        setGen({ ...gen, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation()) {
            const myurl = `${V_URL}/user/manage-master`;
            const formData = new URLSearchParams();
            formData.append('name', gen.name);
            formData.append('tag_id', gen.tag);
            if (data?._id) {
                formData.append('id', data?._id);
            }

            axios({
                method: 'post',
                url: myurl,
                data: formData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                console.log(response.data, '@@')
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/main-store/user/general-master-management')
                }
                setDisable(false)
            }).catch((error) => {
                toast.error('Something went wrong' || error?.response?.data?.message);
                setDisable(false)
            });

        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!gen.name || !gen?.name.trim()) {
            isValid = false;
            err["name_err"] = "Please enter name";
        }
        if (!gen.tag) {
            isValid = false;
            err["tag_err"] = "Please select tag";
        }

        setError(err);
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
                                    <li className="breadcrumb-item">
                                        <Link to="/main-store/user/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/main-store/user/general-master-management">General Master List</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} General Master
                                    </li>
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
                                                <h4>{data?._id ? "Edit" : "Add"} General Master Details</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" onChange={handleChange} name="name" value={gen.name} />
                                                    <div className="error">{error.name_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Tag <span className="login-danger">*</span></label>
                                                    <select className='form-control form-select' onChange={handleChange} name='tag' value={gen.tag}>
                                                        <option value=''>Select Tag</option>
                                                        {tagData?.map((e, i) =>
                                                            <option value={e?._id} key={i}>{e?.title}</option>
                                                        )}
                                                    </select>
                                                    <div className="error">{error.tag_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button" className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                disabled={disable}>
                                                {disable ? "Processing..." : data?._id ? "Update" : "Submit"}
                                            </button>
                                            <button type="button" className="btn btn-primary cancel-form" >
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

export default ManageGenMaster