import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import WeatherCondition from '../WeatherCondition/WeatherCondition';
import SurfaceFields from './SurfacePrimerComponents/SurfaceFields';
import { getDispatchNotes } from '../../../../Store/Store/DispatchNote/GetDispatchNote';
import { getUserSurface } from '../../../../Store/Erp/Painting/Surface/Surface';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageSurfaceClearance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [surfaceOffer, setSurfaceOffer] = useState({});
    const [weatherData, setWeatherData] = useState([]);
    const [surfaceData, setSurfaceData] = useState({});
    const [selectedDraw, setSelectedDraw] = useState([]);
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [offerObj, setOfferObj] = useState({});
    const [status, setStatus] = useState(null);
    const validateWeather = useRef(null);
    const validateSurfaceData = useRef(null);
    const location = useLocation();
    const data = location.state;
    const [surfaceDraw, setSurfaceDraw] = useState([]);

    useEffect(() => {
        if (data) {
            setSurfaceOffer({
                drawing_no: data.drawing_id?._id,
                offer_no: data._id,
                averageDft: data?.average_dft_primer,
                insNote: data?.notes
            });
            setStatus(data?.qc_status)
        }
    }, [data]);

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getUserSurface());
    }, []);

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const surfaceOfferData = useSelector((state) => state?.getUserSurface?.user?.data);

    useEffect(() => {
        const surfaceIds = surfaceOfferData?.map((elem) => elem?.drawing_id?._id);
        const matchData = drawData?.filter((e) => surfaceIds?.includes(e?._id) && e?.project?._id === localStorage.getItem('U_PROJECT_ID'))
        setSurfaceDraw(matchData || []);

        const filterOffer = surfaceOfferData?.filter((of) => of?.drawing_id?._id === surfaceOffer?.drawing_no);
        setSelectedDraw(filterOffer);
        if (selectedDraw) {
            const findOffer = selectedDraw?.find((se) => se?._id === surfaceOffer?.offer_no)
            setOfferObj(findOffer);
        }
    }, [surfaceOffer.drawing_no, surfaceOffer.offer_no, data, surfaceOfferData, drawData]);


    const handleChange = (e, name) => {
        setSurfaceOffer({ ...surfaceOffer, [name]: e.target.value });
    }
    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    };
    const handleSurfaceData = (srData) => {
        setSurfaceData(srData);
    };

    const handleSubmit = (e) => {
        if (validation() && validateSurfaceData.current && validateSurfaceData.current()) {
            setDisable(true);
            const myurl = `${V_URL}/user/get-surface-approval`;
            const formData = new URLSearchParams();
            formData.append('average_dft_primer', surfaceOffer.averageDft);
            formData.append('notes', surfaceOffer.insNote || '');
            formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('actual_surface_profile', surfaceData?.actualSurfaceProfile);
            formData.append('salt_test_reading', surfaceData?.saltTestReading);
            formData.append('status', status);
            formData.append('id', offerObj?._id)
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data?.success === true) {
                    toast.success(response.data.message);
                    navigate('/user/project-store/surface-clearance-management');
                } else {
                    toast.error(response.data.message);
                }
                setDisable(false);
            }).catch((error) => {
                console.log(error, "error");
                toast.error(error?.response?.data?.message);
                setDisable(false);
            })
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!surfaceOffer?.drawing_no) {
            isValid = false;
            err['drawing_no_err'] = "Please select drawing";
        }
        if (!surfaceOffer?.offer_no) {
            isValid = false;
            err['offer_no_err'] = "Please select offer no";
        }
        if (!surfaceOffer?.averageDft) {
            isValid = false;
            err['averageDft_err'] = "Please enter average DFT";
        }
        if (status === null) {
            isValid = false;
            err['status_err'] = "Please select status";
        }
        setError(err)
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = surfaceDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id,
    }));

    const SurfaceOfferOptions = selectedDraw?.map(offer => ({
        label: offer?.voucher_no,
        value: offer._id,
    }));

    const weatherActivity = ['Blasting / Surf. Prep.', 'Primer Application'];

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
                                        <Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/user/project-store/surface-clearance-management">Surface & Primer Clearance List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Surface & Primer Clearance</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4>{data?._id ? 'Edit' : 'Add'} Surface Preparation & Primer Clearance Details</h4>
                                    <div className="row mt-4">
                                        <div className="col-12 col-md-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                <Dropdown
                                                    options={drawOptions}
                                                    value={surfaceOffer.drawing_no}
                                                    filter onChange={(e) => handleChange(e, 'drawing_no')}
                                                    placeholder='Select Drawing No'
                                                    className='w-100'
                                                    disabled={data?._id}
                                                />
                                                <div className='error'>{error.drawing_no_err}</div>
                                            </div>
                                        </div>
                                        {surfaceOffer.drawing_no && (
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Surface & Primer Offer No.<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={SurfaceOfferOptions}
                                                        value={surfaceOffer.offer_no}
                                                        filter
                                                        onChange={(e) => handleChange(e, 'offer_no')}
                                                        placeholder='Select Offer No'
                                                        className='w-100'
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error.offer_no_err}</div>
                                                </div>
                                            </div>
                                        )}

                                        {surfaceOffer.offer_no && (
                                            <>
                                                <div className="col-12 col-md-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Dispatch Note No.<span className="login-danger">*</span></label>
                                                        <input className='form-control' value={offerObj?.dispatch_note?.lot_no} readOnly />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className='row'>
                                        <div className="col-12 col-md-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label>Average DFT Primer <span className="login-danger">*</span></label>
                                                <input className='form-control' type='text' onChange={(e) => handleChange(e, 'averageDft')}
                                                    name='averageDft' value={surfaceOffer.averageDft} readOnly={data?._id} />
                                                <div className='error'>{error.averageDft_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="row align-items-center">
                                                <div className="col-12">
                                                    <div className="input-block select-gender">
                                                        <label className="gen-label">Status <span className="login-danger">*</span></label>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="status"
                                                                    value="accept"
                                                                    className="form-check-input" checked={status === true}
                                                                    onChange={handleStatusChange} disabled={data?._id} />Accept
                                                            </label>
                                                        </div>
                                                        <div className="form-check-inline">
                                                            <label className="form-check-label">
                                                                <input type="radio" name="status" value="reject"
                                                                    checked={status === false}
                                                                    onChange={handleStatusChange}
                                                                    className="form-check-input" disabled={data?._id} />Reject
                                                            </label>
                                                        </div>
                                                        <div className='error'>{error?.status_err}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label>Inspection Note</label>
                                                <textarea className='form-control' name='insNote' value={surfaceOffer?.insNote}
                                                    onChange={(e) => handleChange(e, 'insNote')} readOnly={data?._id} />
                                                <div className='error'>{error.insNote_err}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {surfaceOffer?.drawing_no && (
                        <>
                            <WeatherCondition
                                weatherActivity={weatherActivity}
                                handleWeatherData={handleWeatherData}
                                handleSubmit={handleSubmit}
                                validateWeather={validateWeather}
                                weatherData={offerObj?.weather_condition}
                            />
                            <SurfaceFields
                                is_inspection={true}
                                paintData={offerObj?.dispatch_note?.paint_system}
                                handleSurfaceData={handleSurfaceData}
                                validateSurfaceData={validateSurfaceData}
                                edit_data={offerObj}
                            />
                        </>
                    )}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="doctor-submit text-end">
                                        {!data?._id ? (
                                            <button className="btn btn-primary" type='button' onClick={handleSubmit} disabled={disable}>
                                                {disable ? 'Processing...' : 'Submit'}
                                            </button>
                                        ) : (
                                            <button className="btn btn-primary" type='button' onClick={() => navigate('/user/project-store/surface-clearance-management')}>
                                                Back
                                            </button>
                                        )}
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

export default ManageSurfaceClearance