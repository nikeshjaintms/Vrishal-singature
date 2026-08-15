import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import SurfaceTable from './Components/SurfaceTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import WeatherCondition from '../../../Paint/WeatherCondition/WeatherCondition';
import SurfaceFields from '../../../Paint/SurfacePrimer/SurfacePrimerComponents/SurfaceFields';
import { getDispatchNotes } from '../../../../../Store/MutipleDrawing/DispatchNote/GetDisptchNote';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';

const MultiViewSurfaceClearanc = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const [showItem, setShowItem] = useState(false);
    const [disable, setDisable] = useState(false);
    const [multiSurfacedata, setMultiSurfaceData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [paintNo, setPaintNo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [entity, setEntity] = useState([]);
    const [submitArr, setSubmitArr] = useState([]);
    const [error, setError] = useState({});

    const [weatherData, setWeatherData] = useState([]);
    const [surfacedata, setSurfaceData] = useState([]);
    const [paintData, setPaintData] = useState(null);
    const [procedure, setProcedure] = useState({ procedure_no: '' });
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const validateWeather = useRef(null);
    const weatherActivity = ['Blasting / Surf. Prep.', 'Primer Application'];
    const validateSurfaceData = useRef(null);

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    };
    const handleSurfaceData = (srData) => {
        setSurfaceData(srData);
    };

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const multiDis = useSelector((state) => state.getDispatchNotes?.user?.data?.data);
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);

    useEffect(() => {
        if (data?.paint_system_id) {
            setPaintNo(data?.paint_system_id);
            setWeatherData(data?.weather_data);
            setWeatherTime({ startTime: data?.start_time || "", endTime: data?.end_time || "" })
            setProcedure({ procedure_no: data?.procedure_id });
        }
    }, [data]);

    useEffect(() => {
        dispatch(getUserPaintSystem({ status: '' }));
        dispatch(getDispatchNotes({ "paint_system_id": paintNo }));
        dispatch(getDrawing());
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [paintNo]);

    useEffect(() => {
        if (paintNo) {
            const paintData = paints?.find(item => item._id === paintNo)

            setPaintData({
                paint_system_no: paintData?.paint_system_no || '',
                surface_preparation: paintData?.surface_preparation || '',
                profile_requirement: paintData?.profile_requirement || '',
                salt_test: paintData?.salt_test || '',
                prime_paint: paintData?.prime_paint || '',
                primer_app_method: paintData?.primer_app_method || '',
                paint_manufacturer: paintData?.paint_manufacturer || '',
                primer_dft_range: paintData?.primer_dft_range || '',
            });
        }
    }, [paintNo, paints]);

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!procedure?.procedure_no) {
            isValid = false;
            err['procedure_no_err'] = "Please select procedure no";
        }
        setError(err)
        return isValid;
    };

    const onPaintChange = (e) => {
        setPaintNo(e.target.value);
    }

    useEffect(() => {
        const mergedArray = multiDis?.reduce((acc, record) => {
            record.items.forEach(item => {
                const existingIndex = acc.findIndex(entry => entry.drawing_no === item.drawing_no);
                if (existingIndex > -1) {
                    acc[existingIndex].items.push(item);
                } else {
                    acc.push({ drawing_no: item.drawing_no, rev: item.rev, assembly_no: item.assembly_no, assembly_quantity: item.assembly_quantity, sheet_no: item.sheet_no, items: [item] });
                }
            });
            return acc;
        }, []);

        setEntity(mergedArray);
    }, [multiDis, drawData, paintNo]);

    const commentsData = useMemo(() => {
        if (!Array.isArray(entity)) {
            return [];
        }

        let computedComments = [...entity];

        if (!paintNo) {
            computedComments = [];
        }
        setTotalItems(computedComments?.length);

        // if (search) {
        //     computedComments = computedComments.filter(
        //         (dr) =>
        //             dr?.drawing_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
        //             dr?.rev?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
        //             dr?.assembly_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
        //             dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
        //             dr?.unit?.toLowerCase()?.includes(search.toLowerCase()) ||
        //             dr?.sheet_no?.toLowerCase()?.includes(search.toLowerCase())
        //     );
        // }
        computedComments.sort((a, b) => {
            const data1 = a?.drawing_no?.toString() || "";
            const data2 = b?.drawing_no?.toString() || "";
            return data1.localeCompare(data2, undefined, { numeric: true });
        });

        return computedComments;
        // .slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
    }, [search, limit, currentPage, entity, paintNo]);

    const handleAddToArr = (data) => {
        setShowItem(true);
        setMultiSurfaceData(data);
    }

    const handleChange = (e, name) => {
        setProcedure({ ...procedure, [name]: e.target.value });
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id,
    }));

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Surface & Primer Offer List", link: "/user/project-store/surface-clearance-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Surface & Primer Offer`, active: true }
                        ]} />

                        {!data?._id && (
                            <DrawingTable
                                is_dispatch={false}
                                onPaintChange={onPaintChange}
                                is_paint={true}
                                tableTitle={'Drawing List'}
                                commentsData={commentsData}
                                handleAddToIssueArr={handleAddToArr}
                                currentPage={currentPage}
                                limit={limit}
                                setlimit={setlimit}
                                totalItems={totalItems}
                                setCurrentPage={setCurrentPage}
                                setSearch={setSearch}
                                data={data}
                            />
                        )}
                        <SurfaceTable
                            paintNo={paintNo}
                            setSubmitArr={setSubmitArr}
                            data={data}
                        />
                        {paintNo && (
                            <>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Surface Preparation & Primer</h4>
                                                <div className='row mt-4'>
                                                    <div className="col-12 col-md-4">
                                                        <div className="input-block local-forms custom-select-wpr">
                                                            <label> Procedure No.<span className="login-danger">*</span></label>
                                                            <Dropdown
                                                                options={procedureOptions}
                                                                value={procedure?.procedure_no}
                                                                filter onChange={(e) => handleChange(e, 'procedure_no')}
                                                                placeholder='Select Procedure No'
                                                                className='w-100'
                                                                disabled={data?._id}
                                                            />
                                                            <div className='error'>{error.procedure_no_err}</div>
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
                                    validateWeather={validateWeather}
                                    weatherData={data?.weather_condition}
                                    weatherTime={weatherTime}
                                    setFilteredWeather={setFilteredWeather}
                                />

                                <SurfaceFields
                                    is_inspection={true}
                                    paintData={paintData}
                                    handleSurfaceData={handleSurfaceData}
                                    validateSurfaceData={validateSurfaceData}
                                    edit_data={data}
                                />
                            </>
                        )
                        }

                        <SubmitButton finalReq={data?.items} link='/user/project-store/surface-clearance-management'
                            disable={disable} buttonName={'Generate Surface Offer'} />
                    </div>
                </div>
            </div >
        </>
    )
}

export default MultiViewSurfaceClearanc