import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PaintingSystemValid from '../../../../Components/PaintingSystem/PaintingSystemValid';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {getUserPaintManufacturePiping} from '../../../../Store/Piping/PaintManufacture/PaintManufacture';

const ManagePaintingSystem = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [paint, setPaint] = useState({
        surface: "",
        profile: "",
        sailTest: "",
        paintManu: "",
        primerPaint: "",
        primerApp: "",
        primerDft: "",
        mioPaint: "",
        mioApp: "",
        mioDft: "",
        finalPaint: "",
        finalPaintApp: "",
        finalPaintDft: "",
        totalDft: "",
        paint_system_no: "",
    });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;
    const [paintRequirements, setPaintRequirements] = useState([]);

   useEffect(() => {
    const fetchPaintRequirements = async () => {
        try {
        const res = await axios.post(
            `${V_URL}/user/get-all-paint-requirement`,
            {
                project: localStorage.getItem("U_PROJECT_ID") // ✅ FIX
                
            },
            {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
            }
        );

        if (res.data?.success && Array.isArray(res.data.data?.data)) {
            setPaintRequirements(res.data.data.data); // ✅ FIX
        } else {
            setPaintRequirements([]);
        }
        } catch (error) {
        toast.error("Failed to load Paint System Numbers");
        }
    };

    fetchPaintRequirements();
    }, []);


    useEffect(() => {
        if (location.state) {
            setPaint({
                surface: location.state?.surface_preparation,
                profile: location.state?.profile_requirement,
                sailTest: location.state?.salt_test,
                paintManu: location.state?.paint_manufacturer?._id,
                primerPaint: location.state?.prime_paint,
                primerApp: location.state?.primer_app_method,
                primerDft: location.state?.primer_dft_range,
                mioPaint: location.state?.mio_paint,
                mioApp: location.state?.mio_app_method,
                mioDft: location.state?.mio_dft_range,
                finalPaint: location.state?.final_paint,
                finalPaintApp: location.state?.final_paint_app_method,
                finalPaintDft: location.state?.final_paint_dft_range,
                totalDft: location.state?.total_dft_requirement,
                paint_system_no: location.state?.paint_system_no?._id,
            });
            setSelectValue(location.state?.status);
        }
    }, [location.state]);

    console.log("paintRequirements", location.state);





    useEffect(() => {
        dispatch(getUserPaintManufacturePiping({ status: true }));
    }, [dispatch]);

    const paintManufactureData = useSelector((state) => state.getUserPaintManufacturePiping?.user?.data);

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    }

    const handleChange = (e) => {
        setPaint({ ...paint, [e.target.name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-piping-painting-system`;
            const formData = new URLSearchParams();
            formData.append('surface_preparation', paint.surface);
            formData.append('profile_requirement', paint.profile);
            formData.append('salt_test', paint.sailTest);
            formData.append('paint_manufacturer', paint.paintManu);
            formData.append('prime_paint', paint.primerPaint);
            formData.append('primer_app_method', paint.primerApp);
            formData.append('primer_dft_range', paint.primerDft);
            formData.append('mio_paint', paint.mioPaint);
            formData.append('mio_app_method', paint.mioApp);
            formData.append('mio_dft_range', paint.mioDft);
            formData.append('final_paint', paint.finalPaint);
            formData.append('final_paint_app_method', paint.finalPaintApp);
            formData.append('final_paint_dft_range', paint.finalPaintDft);
            formData.append('total_dft_requirement', paint.totalDft);
            formData.append('project', localStorage.getItem('U_PROJECT_ID'));
            formData.append('paint_system_no', paint.paint_system_no);
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
                    navigate('/piping/user/painting-system-management')
                    toast.success(response.data.message);
                    handleReset();
                } else {
                    toast.error(response.data.message);
                }
                setDisable(false);
            }).catch((error) => {
                // console.log(error, '!!');
                toast.error(error?.response?.data?.message || 'Something went wrong')
                setDisable(false);
            })
        }
    }

    const handleReset = () => {
        setPaint({
            surface: "",
            profile: "",
            sailTest: "",
            paintManu: "",
            primerPaint: "",
            primerApp: "",
            primerDft: "",
            mioPaint: "",
            mioApp: "",
            mioDft: "",
            finalPaint: "",
            finalPaintApp: "",
            finalPaintDft: "",
            totalDft: "",
            paint_system_no: "",
        })
    }


    const validation = () => {
        const { isValid, err } = PaintingSystemValid(paint)
        setError(err);
        return isValid;
    };


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    console.log('Selected paint_system_no:', paint.paint_system_no);
    console.log('Paint Requirements:', paintRequirements);


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
                                    <li className="breadcrumb-item"><Link to="/piping/user/painting-system-management">Painting System List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Painting System</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Painting System Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>
                                                        Paint System No. <span className="login-danger">*</span>
                                                    </label>

                                                    <select
                                                        className="form-control form-select"
                                                        name="paint_system_no"
                                                        value={paint.paint_system_no}
                                                        onChange={handleChange}
                                                        >
                                                        <option value="">Select Paint System No</option>
                                                            {paintRequirements.map((item) => (
                                                            <option key={item._id} value={item._id}>
                                                                {item.paint_system_no}
                                                            </option>
                                                            ))}

                                                        </select>


                                                    <div className="error">{error.paint_system_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Paint Manufacturer <span className="login-danger">*</span></label>
                                                    <select className='form-control form-select' name='paintManu' onChange={handleChange} value={paint.paintManu}>
                                                        <option value="">Select Paint Manufacture</option>
                                                        {paintManufactureData?.map((e) =>
                                                            <option value={e?._id} key={e?._id}>{e?.name}</option>
                                                        )}
                                                    </select>
                                                    <div className='error'>{error.paintManu_err}</div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='row'>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Surface Preparation Standard <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='surface'
                                                        onChange={handleChange} value={paint.surface} />
                                                    <div className='error'>{error?.surface_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Profile Requirements <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='profile'
                                                        onChange={handleChange} value={paint.profile} />
                                                    <div className='error'>{error.profile_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Sail Test Requirements <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='sailTest'
                                                        onChange={handleChange} value={paint.sailTest} />
                                                    <div className='error'>{error.sailTest_err}</div>
                                                </div>
                                            </div>


                                        </div>
                                        <div className='row'>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Primer Paint / Shade </label>
                                                    <input type="text" className="form-control" name='primerPaint'
                                                        onChange={handleChange} value={paint.primerPaint} />
                                                    <div className='error'>{error.primerPaint_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Primer Application Method </label>
                                                    <select className="form-control form-select" name='primerApp'
                                                        onChange={handleChange} value={paint.primerApp}>
                                                        <option value="">Select Primer App.</option>
                                                        <option value="SPRAY">SPRAY</option>
                                                        <option value="ROLLER">ROLLER</option>
                                                        <option value="BRUSH">BRUSH</option>
                                                    </select>
                                                    <div className='error'>{error.primerApp_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Primer DFT Range </label>
                                                    <input type="text" className="form-control" name='primerDft'
                                                        onChange={handleChange} value={paint.primerDft} />
                                                    <div className='error'>{error.primerDft_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Mio Paint / Shade </label>
                                                    <input type="text" className="form-control" name='mioPaint'
                                                        onChange={handleChange} value={paint.mioPaint} />
                                                    <div className='error'>{error.mioPaint_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Mio Application Method </label>
                                                    <select className="form-control form-select" name='mioApp'
                                                        onChange={handleChange} value={paint.mioApp}>
                                                        <option value="">Select Mio App.</option>
                                                        <option value="SPRAY">SPRAY</option>
                                                        <option value="ROLLER">ROLLER</option>
                                                        <option value="BRUSH">BRUSH</option>
                                                    </select>
                                                    <div className='error'>{error.mioApp_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Mio DFT Range </label>
                                                    <input type="text" className="form-control" name='mioDft'
                                                        onChange={handleChange} value={paint.mioDft} />
                                                    <div className='error'>{error.mioDft_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Final Paint / Shade</label>
                                                    <input type="text" className="form-control" name='finalPaint'
                                                        onChange={handleChange} value={paint.finalPaint} />
                                                    <div className='error'>{error.finalPaint_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Final Paint Application Method</label>
                                                    <select className="form-control form-select" name='finalPaintApp'
                                                        onChange={handleChange} value={paint.finalPaintApp}>
                                                        <option value="">Select Final Paint App.</option>
                                                        <option value="SPRAY">SPRAY</option>
                                                        <option value="ROLLER">ROLLER</option>
                                                        <option value="BRUSH">BRUSH</option>
                                                    </select>
                                                    <div className='error'>{error.finalPaintApp_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Final Paint DFT Range</label>
                                                    <input type="text" className="form-control" name='finalPaintDft'
                                                        onChange={handleChange} value={paint.finalPaintDft} />
                                                    <div className='error'>{error.finalPaintDft_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Total DFT Requirements <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='totalDft'
                                                        onChange={handleChange} value={paint.totalDft} />
                                                    <div className='error'>{error.totalDft_err}</div>
                                                </div>
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