import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFinalCoatShadeMaster } from '../../../../Store/Piping/FinalCoatShade/FinalCoatShadeMaster';

const ManagePaintingSystem = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [paint, setPaint] = useState({
        service: "",
        shadeRalNo: "",
    });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;
    const [serviceList, setServiceList] = useState([]);


    useEffect(() => {
        if (location.state) {
            setPaint({
                service: location.state?.service,
                shadeRalNo: location.state?.shadeRalNo,
            });
            setSelectValue(location.state?.status);
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(getUserFinalCoatShadeMaster({ status: true }));
    }, [dispatch]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${V_URL}/user/get-piping-request`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
                params: {
                    project: localStorage.getItem('U_PROJECT_ID')
                }
            });

            if (res.data.success) {
                // Extract service name and _id
                const services = res.data.data.flatMap(item =>
                    item.Items.map(i => ({
                        id: i._id,
                        service: i.service
                    }))
                );

                // Remove duplicates (based on id)
                const uniqueServices = Array.from(
                    new Map(services.map(s => [s.id, s])).values()
                );

                setServiceList(uniqueServices);
            } else {
                toast.error("No services found for this project.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch services");
        }
    };





    const handleChange = (e) => {
        setPaint({ ...paint, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        
        if (validation()) {
            console.log('click');
            setDisable(true);
            const myurl = `${V_URL}/user/manage-final-coat-shade`;
            const formData = new URLSearchParams();
            formData.append('service', paint.service);
            formData.append('shadeRalNo', paint.shadeRalNo);
            if (data?._id) {
                formData.append('_id', data._id);
                formData.append('status', selectValue);
            }
            axios.post(myurl, formData, {
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded", 
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') 
                },
            })
            .then((response) => {
                if (response.data.success) {
                    navigate('/piping/user/final-coat-shade');
                    toast.success(response.data.message);
                    handleReset();
                } else {
                    toast.error(response.data.message || "Save failed");
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Something went wrong');
            })
        }
    }

    const handleReset = () => {
        setPaint({
            service: "",
            shadeRalNo: "",
        })
    }


   const validation = () => {
    let isValid = true;
    let err = {};

    if (!paint.service || paint.service.trim() === "") {
        isValid = false;
        err.service_err = "Service is required";
    }

    if (!paint.shadeRalNo || paint.shadeRalNo.trim() === "") {
        isValid = false;
        err.shadeRalNo_err = "Shade (Ral No) is required";
    }

    setError(err);
    return isValid;
};



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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/final-coat-shade">Final Coat Shade Card List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Final Coat Shade Card</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Final Coat Shade Card Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Service <span className="login-danger">*</span></label>
                                                    <select className="form-control" name="service" value={paint.service} onChange={handleChange} >
                                                        <option value="">Select Service</option>
                                                        {serviceList.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.service}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.service_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Shade (Ral No.) <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='shadeRalNo'
                                                        onChange={handleChange} value={paint.shadeRalNo} />
                                                    <div className='error'>{error?.shadeRalNo_err}</div>
                                                </div>
                                            </div>

                                        </div>

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
            </div >
        </div >
    )
}

export default ManagePaintingSystem