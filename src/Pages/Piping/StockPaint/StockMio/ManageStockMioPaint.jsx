import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import { useDispatch, useSelector } from 'react-redux';
import WeatherCondition from '../WeatherCondition/WeatherCondition';
import MioPaintFields from './MioPaintComponents/MioPaintFields';
import { getDispatchNotes } from '../../../../Store/Store/DispatchNote/GetDispatchNote';
import { getUserSurface } from '../../../../Store/Erp/Painting/Surface/Surface';
import toast from 'react-hot-toast';
import { PRODUCTION, V_URL } from '../../../../BaseUrl';
import axios from 'axios';

const ManageMioPaint = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [mioOffer, setMioOffer] = useState({});
    const [dispatchNotes, setDispatchNotes] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [mioData, setMioData] = useState({});
    const [paintData, setPaintData] = useState(null);
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const validateMioData = useRef(null);
    const validateWeather = useRef(null);
    const data = location.state;
    const [mioDraw, setMioDraw] = useState([]);

    useEffect(() => {
        if (data) {
            setMioOffer({
                drawing_no: data?.drawing_id?._id,
                procedure_no: data?.procedure_no?._id,
                disp_lot_no: data?.dispatch_note?._id,
                remarks: data?.remarks
            })
        }
    }, [data])

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getUserProcedureMaster({ status: 'true' }));
        dispatch(getDispatchNotes())
        dispatch(getUserSurface({ qc_status: true }))
    }, []);

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const dispatchNoteData = useSelector((state) => state?.getDispatchNotes?.user?.data);
    const surfaceInspectionData = useSelector((state) => state?.getUserSurface?.user?.data);

    useEffect(() => {
        const mioIds = surfaceInspectionData?.map((e) => e?.drawing_id?._id);
        const matchIds = drawData?.filter((dr) => mioIds?.includes(dr?._id) && dr?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setMioDraw(matchIds || []);

        const filterDispatchNote = dispatchNoteData?.filter(note => note.drawing_id?._id === mioOffer.drawing_no);
        setDispatchNotes(filterDispatchNote);
        const findPaint = filterDispatchNote?.find((di) => di?._id === mioOffer.disp_lot_no);
        setPaintData(findPaint?.paint_system);
    }, [mioOffer.drawing_no, mioOffer.disp_lot_no, dispatchNoteData, drawData]);

    const handleChange = (e, name) => {
        setMioOffer({ ...mioOffer, [name]: e.target.value });
    }

    const handleMioOffer = (mData) => {
        setMioData(mData);
    }

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    }

    const handleSubmit = () => {
        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateMioData.current && validateMioData.current()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-mio-paint`;
            const formData = new URLSearchParams();
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            formData.append('drawing_id', mioOffer.drawing_no);
            formData.append('procedure_no', mioOffer.procedure_no);
            formData.append('dispatch_note', mioOffer.disp_lot_no);
            formData.append('weather_condition', JSON.stringify(weatherData))
            formData.append('mio_date', mioData.mio_date);
            formData.append('time', mioData.time);
            formData.append('shelf_life', mioData.shelf_life);
            formData.append('manufacture_date', mioData.manufacture_date);
            formData.append('paint_batch_base', mioData.paint_batch_base);
            formData.append('paint_batch_hardner', mioData.paint_batch_hardner);
            formData.append('notes', mioData.note || '');
            formData.append('remarks', mioOffer.remarks || '');

            if (data?._id) {
                formData.append('id', data?._id);
            }
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data?.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/mio-offer-management');
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
        let err = {};
        var isValid = true;

        if (!mioOffer.drawing_no) {
            isValid = false;
            err['drawing_no_err'] = 'Please select drawing';
        }
        if (!mioOffer.procedure_no) {
            isValid = false;
            err['procedure_no_err'] = 'Please select procedure';
        }
        if (!mioOffer.disp_lot_no) {
            isValid = false;
            err['disp_lot_no_err'] = 'Please select dispatch no';
        }

        const surfaceData = surfaceInspectionData.find(data =>
            data.drawing_id._id === mioOffer.drawing_no &&
            data.dispatch_note._id === mioOffer.disp_lot_no && data?.status === 2
        );
        if (!surfaceData) {
            isValid = false;
            toast.error('No matching surface data found')
        } else if (!surfaceData.qc_status) {
            isValid = false;
            toast.error('QC status is not true in surface data')
        }
        setError(err);
        return isValid
    }


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const drawOptions = mioDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id,
    }));
    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id,
    }));
    const dispatchNoteOptions = dispatchNotes?.map(note => ({
        label: note.lot_no,
        value: note._id,
    }));

    const weatherActivity = ['MIO Coat']

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
                                        <Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/mio-offer-management">MIO Offer List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} MIO Offer Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4>{data?._id ? 'Edit' : 'Add'} MIO Offer Details</h4>
                                    <div className="row mt-4">
                                        <div className="col-12 col-md-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                <Dropdown
                                                    options={drawOptions}
                                                    value={mioOffer.drawing_no}
                                                    onChange={(e) => handleChange(e, 'drawing_no')}
                                                    placeholder='Select Drawing No'
                                                    className='w-100'
                                                    filter
                                                />
                                                <div className='error'>{error.drawing_no_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label> Procedure No. <span className="login-danger">*</span></label>
                                                <Dropdown
                                                    options={procedureOptions}
                                                    value={mioOffer.procedure_no}
                                                    onChange={(e) => handleChange(e, 'procedure_no')}
                                                    placeholder='Select Procedure No'
                                                    className='w-100'
                                                    filter
                                                />
                                                <div className='error'>{error.procedure_no_err}</div>
                                            </div>
                                        </div>
                                        {mioOffer.drawing_no && (
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> DispatchNote No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={dispatchNoteOptions}
                                                        value={mioOffer.disp_lot_no}
                                                        onChange={(e) => handleChange(e, 'disp_lot_no')}
                                                        placeholder='Select Dispatch Note No'
                                                        className='w-100'
                                                        filter
                                                    />
                                                    <div className='error'>{error.disp_lot_no_err}</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-12">
                                            <div className="input-block local-forms">
                                                <label> Remarks</label>
                                                <textarea className='form-control' onChange={(e) => handleChange(e, 'remarks')} name='remarks' value={mioOffer.remarks} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(mioOffer?.drawing_no && mioOffer?.disp_lot_no) && (
                        <>
                            <WeatherCondition
                                weatherActivity={weatherActivity}
                                handleWeatherData={handleWeatherData}
                                handleSubmit={handleSubmit}
                                validateWeather={validateWeather}
                                weatherData={data?.weather_condition}
                            />
                            <MioPaintFields
                                is_inspection={false}
                                paintData={paintData}
                                handleMioOffer={handleMioOffer}
                                validateMioData={validateMioData}
                                edit_data={data}
                            />
                        </>
                    )}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            {localStorage.getItem('ERP_ROLE') === PRODUCTION ? (
                                                <button className="btn btn-primary" type='button' onClick={handleSubmit} disabled={disable}>
                                                    {disable ? 'Processing...' : (data?._id ? 'Update' : 'Submit')}
                                                </button>
                                            ) : (
                                                <button className="btn btn-primary" type='button' onClick={() => navigate('/piping/user/mio-offer-management')}>
                                                    Back
                                                </button>
                                            )}
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

export default ManageMioPaint