import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import WeatherCondition from '../../../Paint/WeatherCondition/WeatherCondition';
import FinalCoatsFields from '../../../Paint/FinalCoat/FinalCoatComponents/FinalCoatsFields';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';
import FinalCoatClearance from './Components/FinalCoatClearance';

const ManageMultiFinalCoatClearance = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [paintData, setPaintData] = useState(null);
    const [weatherData, setWeatherData] = useState([]);
    const [disable, setDisable] = useState(false);
    const validateFinalCoatData = useRef(null);
    const validateWeather = useRef(null);
    const data = location.state;
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' });
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [finalCoatData, setFinalcoatData] = useState({});

    useEffect(() => {
        dispatch(getUserPaintSystem({ status: '' }));
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, []);
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);

    useEffect(() => {
        if (data?.paint_system_id) {
            const paintData = paints?.find(item => item._id === data?.paint_system_id)
            if (paintData) {
                setPaintData({
                    final_paint: paintData?.final_paint,
                    final_paint_app_method: paintData?.final_paint_app_method,
                    paint_manufacture: paintData?.paint_manufacturer?.name,
                    final_paint_dft_range: paintData?.final_paint_dft_range,
                });
            }
            setWeatherTime({
                startTime: data?.start_time || '',
                endTime: data?.end_time || '',
            })
        }
    }, [data, paints]);

    useEffect(() => {
        if (data?._id) {
            setTableData(data?.items);
        }
    }, [data]);

    const handleFinalCoatOffer = (mData) => {
        setFinalcoatData(mData)
    }

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    }

    const commentsData = useMemo(() => {
        let computedComments = tableData || [];
        if (search) {
            computedComments = computedComments?.filter(
                (i) =>
                    i?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.grid_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        // return computedComments?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
        return computedComments;
    }, [currentPage, search, limit, tableData]);

    const handleSubmit = () => {
        if (weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateFinalCoatData.current && validateFinalCoatData.current()) {

            let updatedData = tableData;
            let isValid = true;

            updatedData?.forEach(item => {
                if (item.average_dft_final_coat === '' || item.average_dft_final_coat === undefined) {
                    isValid = false;
                    toast.error(`Please Enter Average DFT for ${item?.grid_no}`);
                }
                if (item.is_accepted === '' || item.is_accepted === undefined || item.is_accepted === 1) {
                    isValid = false;
                    toast.error(`Please accept or reject for ${item?.grid_no}`);
                }
            })

            if (!isValid) {
                return;
            }

            const filteredData = updatedData?.map(item => ({
                _id: item._id,
                drawing_id: item.drawing_id,
                grid_id: item.grid_id,
                mio_id: item.mio_id,
                average_dft_final_coat: item.average_dft_final_coat,
                fc_used_grid_qty: item.fc_used_grid_qty,
                is_accepted: item.is_accepted ? 2 : 3
            }))

            setDisable(true);
            const myurl = `${V_URL}/user/verify-multi-final_coat`;
            const formData = new URLSearchParams();
            formData.append('id', data._id);
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            formData.append('qc_notes', finalCoatData.qc_note);
            formData.append('items', JSON.stringify(filteredData));
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data?.success === true) {
                    toast.success(response.data.message);
                    navigate('/user/project-store/final-coat-clearance-management');
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
            }).finally(() => {
                setDisable(false);
            })
        }
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const weatherActivity = ['Top Coat / Final'];

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">

                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Final/Top Coat Clearance List", link: "/user/project-store/final-coat-clearance-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Final/Top Coat Details`, active: true },
                        ]} />

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>Add Final / Top Coating Inspection Details</h4>
                                        <div className="row mt-4">
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Procedure No.</label>
                                                    <input type='text' className='form-control' value={data?.procedure_no} disabled={data?._id} />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Offer No.</label>
                                                    <input type='text' className='form-control' value={data?.report_no} disabled={data?._id} />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Paint System No.</label>
                                                    <input type="text" className="form-control"
                                                        readOnly value={data?.paint_system_no} rows={1} />
                                                </div>
                                            </div>
                                        </div>
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
                        <FinalCoatsFields
                            is_inspection={true}
                            paintData={paintData}
                            handleFinalCoatOffer={handleFinalCoatOffer}
                            validateFinalCoatData={validateFinalCoatData}
                            edit_data={data}
                            filteredWeather={filteredWeather}
                        />
                        <FinalCoatClearance
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
                        <SubmitButton disable={disable} handleSubmit={handleSubmit}
                            link={'/user/project-store/'} buttonName={'Generate Final/Top Coat Clearance'} />

                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageMultiFinalCoatClearance