import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { Check, Save, X } from 'lucide-react';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { Dropdown } from 'primereact/dropdown';
import WeatherCondition from '../../../Paint/WeatherCondition/WeatherCondition';
import SurfaceFields from '../../../Paint/SurfacePrimer/SurfacePrimerComponents/SurfaceFields';
import { getUserPaintSystemPiping } from '../../../../../Store/Piping/PaintSystem/PaintSystem';
// import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import SurafceClearanceTable from './Components/SurafceClearanceTable';

const MultiManageSurfaceClearance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [procedure, setProcedure] = useState({ vendor_doc_no: '' });
    const [error, setError] = useState({});
    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const [filteredWeather, setFilteredWeather] = useState([]);
    const data = location.state;
    console.log("Data:", data);

    const paints = useSelector((state) => state?.getUserPaintSystemPiping?.user?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);

    const [weatherData, setWeatherData] = useState([]);
    const [surfacedata, setSurfaceData] = useState([]);
    const [paintData, setPaintData] = useState(null);
    const validateWeather = useRef(null);
    const weatherActivity = ['Blasting / Surf. Prep.', 'Primer Application'];
    const validateSurfaceData = useRef(null);

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    };
    const handleSurfaceData = (srData) => {
        setSurfaceData(srData);
    };

    useEffect(() => {
        dispatch(getUserPaintSystemPiping({ status: '' }));
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [data])

    useEffect(() => {
        if (data?.paint_system_id) {
            const paintData = paints?.find(item => item._id === data?.paint_system_id)
            console.log("Paint Data:", paintData);

            setPaintData({
                paint_system_no: paintData?.paint_system_no?.paint_system_no || paintData?.paint_system_no || data?.paint_system_no || '',
                surface_preparation: paintData?.surface_preparation || data?.surface_preparation || '',
                profile_requirement: paintData?.profile_requirement || data?.profile_requirement || '',
                salt_test: paintData?.salt_test || data?.salt_test || '',
                prime_paint: paintData?.prime_paint || data?.prime_paint || '',
                primer_app_method: paintData?.primer_app_method || data?.primer_app_method || '',
                paint_manufacturer: paintData?.paint_manufacturer?.name || paintData?.paint_manufacturer || data?.paint_manufacturer || '',
                primer_dft_range: paintData?.primer_dft_range || data?.primer_dft_range || '',
            });

            setWeatherTime({
                startTime: data?.start_time || '',
                endTime: data?.end_time || '',
            })
        }
    }, [data, paints]);

    useEffect(() => {
        if (data?._id) {
            setTableData(data?.items);
            setProcedure({ vendor_doc_no: data?.procedure_id })
        }
    }, [data]);

    const handleChange = (e, name) => {
        setProcedure({ ...procedure, [name]: e.target.value });
    }

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id,
    }));

    const commentsData = useMemo(() => {
        let computedComments = tableData || [];
        if (search) {
            computedComments = computedComments?.filter(
                (i) =>
                    i?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())

            );
        }
        setTotalItems(computedComments?.length);
        return computedComments;
    }, [currentPage, search, limit, tableData]);

    const handleSubmit = (submitData = {}) => {
        if (validateSurfaceData.current && validateSurfaceData.current()) {
            let updatedData = tableData;
            let isValid = true;

            updatedData?.forEach(item => {
                if (item.average_dft_primer === '' || item.average_dft_primer === undefined) {
                    isValid = false;
                    toast.error(`Please Enter Average DFT Primer for ${item?.drawing_no}`);
                }

                if (
                    item.is_accepted === '' ||
                    item.is_accepted === undefined ||
                    item.is_accepted === 1
                ) {
                    isValid = false;
                    toast.error(`Please accept or reject for ${item?.drawing_no}`);
                }
            });

            if (!isValid) return;

            const filteredData = updatedData?.map(item => ({
                _id: item._id,
                drawing_id: item.drawing_id,
                item_id: item.item_id,
                spool_id: item.spool_id,
                dispatch_id: item.dispatch_id,
                surface_used_qty: item.surface_used_qty,
                average_dft_primer: item.average_dft_primer,
                is_accepted: item.is_accepted ? 2 : 3,
                qty: item.qty,
            }));

            const myurl = `${V_URL}/user/piping-verify-multi-surface`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('id', data?._id);
            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));

            bodyFormData.append(
                'actual_surface_profile',
                surfacedata?.actualSurfaceProfile
            );
            bodyFormData.append(
                'salt_test_reading',
                surfacedata?.saltTestReading
            );
            bodyFormData.append('qc_notes', surfacedata?.qc_remarks);

            // ✅ REQUIRED FIX
            const isIrn = submitData?.isIrn ?? data?.isIrn ?? false;
            const isMio = submitData?.isMio ?? data?.isMio ?? false;
            const isFp = submitData?.isFp ?? data?.isFp ?? false;

            bodyFormData.append('isIrn', isIrn);
            bodyFormData.append('isMio', isMio);
            bodyFormData.append('isFp', isFp);
            bodyFormData.append('isSurface', true);

            bodyFormData.append('items', JSON.stringify(filteredData));

            console.log("data", data);


            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'),
                },
            })
                .then((response) => {
                    if (response.data?.success === true) {
                        toast.success(response.data.message);
                        navigate('/piping/user/surface-clearance-management');
                    } else {
                        toast.error(response.data.message);
                    }
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.message);
                })
                .finally(() => {
                    setDisable(false);
                });
        }
    };


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
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Surface & Primer Clearance List", link: "/piping/user/surface-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Surface & Primer Clearance List`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Surface & Primer Clearance Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className='row'>
                                                            <div className="col-12 col-md-4">
                                                                <div className="input-block local-forms custom-select-wpr">
                                                                    <label> Procedure No.<span className="login-danger">*</span></label>
                                                                    <Dropdown
                                                                        options={procedureOptions}
                                                                        value={procedure?.vendor_doc_no}
                                                                        filter onChange={(e) => handleChange(e, 'vendor_doc_no')}
                                                                        placeholder='Select Procedure No'
                                                                        className='w-100'
                                                                        disabled={data?._id}
                                                                    />
                                                                    <div className='error'>{error.vendor_doc_no_err}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4">
                                                                <div className="input-block local-forms custom-select-wpr">
                                                                    <label>Offer No.</label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={data.report_no}
                                                                        rows={1}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-12 col-md-4">
                                                                <div className="input-block local-forms custom-select-wpr">
                                                                    <label>Paint System No.</label>
                                                                    <input type="text"
                                                                        className="form-control"
                                                                        readOnly
                                                                        value={data.paint_system_no}
                                                                        rows={1}
                                                                    />
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <WeatherCondition
                        weatherActivity={weatherActivity}
                        handleWeatherData={handleWeatherData}
                        handleSubmit={handleSubmit}
                        validateWeather={validateWeather}
                        weatherData={data?.weather_condition}
                        setFilteredWeather={setFilteredWeather}
                        weatherTime={weatherTime}
                    />

                    <SurfaceFields
                        is_inspection={true}
                        paintData={paintData}
                        handleSurfaceData={handleSurfaceData}
                        validateSurfaceData={validateSurfaceData}
                        edit_data={data}
                    />

                    <SurafceClearanceTable
                        commentsData={commentsData}
                        limit={limit}
                        setLimit={setlimit}
                        setSearch={setSearch}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        tableData={tableData}
                        setTableData={setTableData}
                    />

                    <SubmitButton disable={disable} handleSubmit={handleSubmit} showSurfaceClearance={true}
                        link={'/piping/user/surface-clearance-management'} buttonName={'Generate Surface & Primer Clearance'} />

                </div>
            </div>
        </div>
    )
}

export default MultiManageSurfaceClearance