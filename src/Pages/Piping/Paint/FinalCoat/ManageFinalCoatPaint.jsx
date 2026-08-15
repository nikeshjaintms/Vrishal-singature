import React, { useEffect, useRef, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import Footer from '../../Include/Footer';
import { Dropdown } from 'primereact/dropdown';
import WeatherCondition from '../WeatherCondition/WeatherCondition';
import FinalCoatsFields from './FinalCoatComponents/FinalCoatsFields';
import { getDispatchNotes } from '../../../../Store/Store/DispatchNote/GetDispatchNote';
import { getUserMio } from '../../../../Store/Erp/Painting/Mio/GetMio';
import toast from 'react-hot-toast';
import { PRODUCTION, V_URL } from '../../../../BaseUrl';
import axios from 'axios';

const ManageFinalCoatPaint = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [finalCoatFields, setFinalCoatFields] = useState({});
    const [weatherData, setWeatherData] = useState([]);
    const [dispatchNotes, setDispatchNotes] = useState([]);
    const [finalCoatData, setFinalCoatData] = useState([]);
    const [paintData, setPaintData] = useState(null);
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const validateFinalCoatData = useRef(null);
    const validateWeather = useRef(null);
    const data = location.state;
    const [finalDraw, setFinalDraw] = useState([]);

    useEffect(() => {
        if (data) {
            setFinalCoatFields({
                drawing_no: data?.drawing_id?._id,
                procedure_no: data?.procedure_no?._id,
                disp_lot_no: data?.dispatch_note?._id,
                remarks: data?.remarks
            })
        }
    }, [data])

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getDispatchNotes())
        dispatch(getUserProcedureMaster({ status: 'true' }));
        dispatch(getUserMio());
    }, []);

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const dispatchNoteData = useSelector((state) => state?.getDispatchNotes?.user?.data);
    const mioPaintInsData = useSelector((state) => state?.getUserMio?.user?.data);

    useEffect(() => {
        const finalCoatIds = mioPaintInsData?.map((e) => e?.drawing_id?._id);
        const matchData = drawData?.filter((dr) => finalCoatIds?.includes(dr?._id) && dr?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setFinalDraw(matchData || [])
        const filterDispatchNote = dispatchNoteData?.filter(note => note.drawing_id?._id === finalCoatFields.drawing_no);
        setDispatchNotes(filterDispatchNote);
        const findPaint = filterDispatchNote?.find((di) => di?._id === finalCoatFields.disp_lot_no);
        setPaintData(findPaint?.paint_system);
    }, [finalCoatFields.drawing_no, finalCoatFields.disp_lot_no, dispatchNoteData, drawData]);

    const handleFinalCoatOffer = (mData) => {
        setFinalCoatData(mData);
    }

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    }

    const handleChange = (e, name) => {
        setFinalCoatFields({ ...finalCoatFields, [name]: e.target.value });
    }

    const handleSubmit = () => {
        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateFinalCoatData.current && validateFinalCoatData.current()) {
            const myurl = `${V_URL}/user/manage-final-paint`;
            const formData = new URLSearchParams();
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            formData.append('drawing_id', finalCoatFields.drawing_no);
            formData.append('procedure_no', finalCoatFields.procedure_no);
            formData.append('dispatch_note', finalCoatFields.disp_lot_no);
            formData.append('weather_condition', JSON.stringify(weatherData))
            formData.append('final_date', finalCoatData?.final_date);
            formData.append('time', finalCoatData?.time);
            formData.append('shelf_life', finalCoatData.shelf_life);
            formData.append('manufacture_date', finalCoatData?.manufacture_date);
            formData.append('paint_batch_base', finalCoatData?.paint_base);
            formData.append('paint_batch_hardner', finalCoatData?.paint_hardner);
            formData.append('remarks', finalCoatFields.remarks || '');
            formData.append('notes', finalCoatData.note || '');
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
                    navigate('/piping/user/final-coat-management');
                } else {
                    toast.error(response.data.message);
                }
                setDisable(false);
            }).catch((error) => {
                console.log(error, "error");
                toast.error(error?.response?.data?.message);
                setDisable(false);
            });
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!finalCoatFields.drawing_no) {
            isValid = false;
            err['drawing_no_err'] = 'Please select drawing no.';
        }
        if (!finalCoatFields.procedure_no) {
            isValid = false;
            err['procedure_no_err'] = 'Please select procedure no.';
        }
        if (!finalCoatFields?.disp_lot_no) {
            isValid = false;
            err['disp_lot_no_err'] = 'Please select dispatch no.';
        }

        const mioData = mioPaintInsData.find(data =>
            data.drawing_id._id === finalCoatFields.drawing_no &&
            data.dispatch_note._id === finalCoatFields.disp_lot_no
        );

        if (!mioData) {
            isValid = false;
            toast.error('No matching mio paint data found')
        } else if (!mioData.qc_status) {
            isValid = false;
            toast.error('QC status is not true in mio paint data')
        }

        setError(err);
        return isValid;
    }


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = finalDraw?.map(drawing => ({
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

    const weatherActivity = ['Top Coat / Final']

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/final-coat-management">Final / Top Coating Offer</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Final / Top Coating Offer Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4>{data?._id ? 'Edit' : 'Add'} Final / Top Coating Offer Details</h4>
                                    <div className="row mt-4">
                                        <div className="col-12 col-md-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                <Dropdown
                                                    options={drawOptions}
                                                    value={finalCoatFields.drawing_no}
                                                    onChange={(e) => handleChange(e, 'drawing_no')}
                                                    placeholder='Select Drawing No'
                                                    className='w-100'
                                                    filter
                                                />
                                                <div className='error'>{error?.drawing_no_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="input-block local-forms custom-select-wpr">
                                                <label> Procedure No.<span className="login-danger">*</span></label>
                                                <Dropdown
                                                    options={procedureOptions}
                                                    value={finalCoatFields.procedure_no}
                                                    onChange={(e) => handleChange(e, 'procedure_no')}
                                                    placeholder='Select Procedure No'
                                                    className='w-100'
                                                    filter
                                                />
                                                <div className='error'>{error?.procedure_no_err}</div>
                                            </div>
                                        </div>
                                        {finalCoatFields.drawing_no && (
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> DispatchNote No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={dispatchNoteOptions}
                                                        value={finalCoatFields.disp_lot_no}
                                                        onChange={(e) => handleChange(e, 'disp_lot_no')}
                                                        placeholder='Select Dispatch Note No'
                                                        className='w-100'
                                                        filter
                                                    />
                                                    <div className='error'>{error.disp_lot_no_err}</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-124">
                                            <div className="input-block local-forms">
                                                <label> Remarks</label>
                                                <textarea className='form-control' name='remarks' onChange={(e) => handleChange(e, 'remarks')} value={finalCoatFields?.remarks} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(finalCoatFields?.drawing_no && finalCoatFields?.disp_lot_no) && (
                        <>
                            <WeatherCondition
                                weatherActivity={weatherActivity}
                                handleWeatherData={handleWeatherData}
                                handleSubmit={handleSubmit}
                                validateWeather={validateWeather}
                                weatherData={data?.weather_condition}
                            />
                            <FinalCoatsFields
                                is_inspection={false}
                                paintData={paintData}
                                handleFinalCoatOffer={handleFinalCoatOffer}
                                validateFinalCoatData={validateFinalCoatData}
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
                                                <button type='button' className="btn btn-primary" onClick={() => navigate('/piping/user/final-coat-management')}>
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

export default ManageFinalCoatPaint