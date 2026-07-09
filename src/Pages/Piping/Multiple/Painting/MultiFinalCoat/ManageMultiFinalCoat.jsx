import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import WeatherCondition from '../../../Paint/WeatherCondition/WeatherCondition';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import FinalCoatDrawingTable from '../../Components/FinalCoatDrawingTable/FinalCoatDrawingTable';
import { getPipingMioList } from '../../../../../Store/Piping/MultiFinalCoat/GetMio';
// import { getMioFilterList } from '../../../../../Store/MutipleDrawing/MultiFinalCoat/GetMultiMio';
import FinalCoatTable from './Components/FinalCoatTable';
import FinalCoatModel from './Components/FinalCoatModel';
import FinalCoatsFields from '../../../Paint/FinalCoat/FinalCoatComponents/FinalCoatsFields';
import { checkFinalCoatPaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import AddFinalCoatDrawingForm from './Components/AddFinalCoatDrawingForm';
import { manageFinalCoatOffer } from '../../../../../Store/Piping/MultiFinalCoat/ManageFinalCoat';
import { getPipingMultiFinalCoat } from '../../../../../Store/Piping/MultiFinalCoat/GetMultiFinalCoat';

const ManageMultiFinalCoat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [reportNo, setReportNo] = useState([]);
    const [dispatchSite, setDispatchSite] = useState([])
    const [finalOffer, setFinalOffer] = useState({
        report_no: '',
    });
    const [submitArr, setSubmitArr] = useState([]);
    const [entity, setEntity] = useState([]);
    const [multiFinalCoatdata, setMultiFinalCoatData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [showItem, setShowItem] = useState(false);
    const [weatherData, setWeatherData] = useState([]);
    const [finalCoatData, setFinalCoatData] = useState([]);
    const [paintData, setPaintData] = useState(null);
    const [error, setError] = useState({});
    const validateFinalCoatData = useRef(null);
    const validateWeather = useRef(null);
    const data = location.state;
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);
    const [lockedDate, setLockedDate] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [drawingItems, setDrawingItems] = useState([]);
    const [editItem, setEditItem] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [editeMode, setEditeMode] = useState(false);

    useEffect(() => {
        if (data?.paint_system_id) {
            setFinalOffer({ ...finalOffer, paint_no: data?.paint_system_id, procedure_no: data?.procedure_id });
            setWeatherData(data?.weather_data);
            setWeatherTime({ startTime: data?.start_time || "", endTime: data?.end_time || "" })
        }
    }, [data]);

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
        dispatch(getUserPaintSystem({ status: '' }));
        dispatch(getPipingMioList({ isFp: true }));
        dispatch(getPipingMultiFinalCoat());
    }, []);

    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const getMultiMioData = useSelector((state) => state?.getPipingMioListData?.user?.data?.data);
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const multiDispatchPaintData = useSelector((state) => state?.getMultiDispatchPaint?.user?.data);
    const getMultiFinalCoatData = useSelector((state) => state?.getPipingMultiFinalCoat?.user?.data);


    useEffect(() => {
        if (getMultiMioData?.length > 0) {
            const closestDate = getClosestCreatedAtDate(getMultiMioData);
            setLockedDate(closestDate);
        }
    }, [getMultiMioData]);

    useEffect(() => {
        if (multiDispatchPaintData?.length > 0) {
            const closestDate = getClosestCreatedAtDate(multiDispatchPaintData);
            setLockedDate(closestDate);
        }
    }, [multiDispatchPaintData]);

    useEffect(() => {
        if (!finalOffer?.report_no) {
            setPaintData(null);
        }
    }, [finalOffer?.report_no]);

    useEffect(() => {
        if (submitArr.length === 0) {
            setPaintData(null);
        }
    }, [submitArr]);

    useEffect(() => {
        if (getMultiMioData?.length > 0) {
            const filteredEntities = finalOffer?.paint_no
                ? getMultiMioData.filter(en => en.paint_system_id === finalOffer.paint_no)
                : getMultiMioData;

            const reportNo = [...new Set(filteredEntities?.flatMap(en => en?.items?.map(o => o.dispatch_no || o.dispatch_report)))].filter(Boolean);
            const dispatchSiteData = [...new Set(filteredEntities?.flatMap(en => en?.items?.map(e => e.dispatch_site)))].filter(Boolean);

            setReportNo(reportNo);
            setDispatchSite(dispatchSiteData);
        } else {
            setReportNo([]);
            setDispatchSite([]);
        }
    }, [finalOffer?.paint_no, getMultiMioData]);

    useEffect(() => {
        if (getMultiMioData?.length > 0 && finalOffer?.report_no && !finalOffer.paint_no) {
            const item = getMultiMioData.flatMap(en => en.items).find(i => (i.dispatch_no || i.dispatch_report) === finalOffer.report_no);
            if (item?.paint_system_id) {
                setFinalOffer(prev => ({ ...prev, paint_no: item.paint_system_id }));
            }
        }
    }, [getMultiMioData, finalOffer?.report_no]);

    useEffect(() => {

        if (!getMultiFinalCoatData || getMultiFinalCoatData.length === 0) {
            return;
        }

        // Take first record (same paint system)
        const apiFinalCoat = getMultiFinalCoatData[0];


        setPaintData({
            final_paint: apiFinalCoat.final_paint || "",
            final_paint_app_method: apiFinalCoat.final_paint_app_method || "",
            paint_manufacture: apiFinalCoat.paint_manufacturer || "",
            final_paint_dft_range: apiFinalCoat.final_paint_dft_range || "",
        });
    }, [getMultiFinalCoatData]);

    useEffect(() => {
    }, [paintData]);


    useEffect(() => {
        if (getMultiMioData && getMultiMioData.length > 0) {
            const map = new Map();
            let addedSet = new Set();

            if (getMultiFinalCoatData && Array.isArray(getMultiFinalCoatData)) {
                addedSet = new Set(
                    getMultiFinalCoatData
                        .filter(addedItem => addedItem.dispatch_no === finalOffer.report_no || addedItem.report_no === finalOffer.report_no)
                        .map(addedItem => {
                            const a_item_id = Array.isArray(addedItem.item_id) ? addedItem.item_id[0] : addedItem.item_id;
                            return `${addedItem.main_id}_${addedItem.drawing_id}_${a_item_id || 'null'}_${addedItem.spool_id || 'null'}`;
                        })
                );
            }

            getMultiMioData.forEach((report) => {
                report.items.forEach((item) => {
                    const itemReportNo = item.dispatch_no || item.dispatch_report || "";
                    // Filter locally by report_no and dispatch_site
                    if (finalOffer?.report_no && (itemReportNo || "").toString().trim() !== (finalOffer.report_no || "").toString().trim()) {
                        return;
                    }
                    if (finalOffer?.dispatch_site && (item.dispatch_site || "").toString().trim() !== (finalOffer.dispatch_site || "").toString().trim()) {
                        return;
                    }

                    if (item.is_accepted !== 2) {
                        return;
                    }

                    // Hide items already generated for Final Coat
                    if (item.isGeneratedFinalCoat === true) {
                        return;
                    }

                    // Exclude if already added to manageable FinalCoatTable
                    const itemId = Array.isArray(item.item_id) ? item.item_id[0] : item.item_id;
                    const itemKey = `${report._id}_${item.drawing_id}_${itemId || 'null'}_${item.spool_id || 'null'}`;
                    if (addedSet.has(itemKey)) {
                        return;
                    }

                    const drawingDoc = report.drawingDocs?.find(d => d._id === item.drawing_id);
                    const resolvedDrawingNo = item.drawing_no || drawingDoc?.drawing_no || "-";
                    const details = report.itemDetails?.find(d => d._id === item.item_id);
                    const itemName = item.spool_no || details?.item_name || item.item_name || "-";

                    const uniqueKey = `${resolvedDrawingNo}_${itemName}_${item.spool_no || ""}`;

                    if (!map.has(uniqueKey)) {
                        map.set(uniqueKey, {
                            drawing_no: resolvedDrawingNo,
                            rev: item.rev,
                            report_no: report.report_no,
                            report_id: report._id,
                            sheet_no: item.sheet_no || drawingDoc?.sheet_no || "-",
                            unit: item.unit_area || "-",
                            item_name: itemName,
                            spool_no: item.spool_no || null,
                            spool_id: item.spool_id || null,
                            items: [],
                            paintDetails: report.paintDetails,
                            paint_system_id: report.paint_system_id
                        });
                    }

                    map.get(uniqueKey).items.push({
                        ...item,
                        item_name: itemName,
                        drawing_no: resolvedDrawingNo
                    });
                });
            });
            setEntity(Array.from(map.values()));
        } else {
            setEntity([]);
        }
    }, [getMultiMioData, finalOffer?.report_no, finalOffer?.dispatch_site, getMultiFinalCoatData]);

    const checkCompletedDraw = async () => {
        const res = await checkFinalCoatPaint(entity);
        setMatchDatas(res.matchData);
        setUnMatchDatas(res.unmatchData);
    }

    useEffect(() => {
        checkCompletedDraw();
    }, [entity]);

    const commentsData = useMemo(() => {
        // Use matchDatas if available, otherwise fall back to entity
        let computedComments = matchDatas?.length > 0 ? matchDatas : (entity || []);
        if (!finalOffer?.report_no) {
            computedComments = [];
        }
        if (search) {
            computedComments = computedComments.filter(
                (dr) =>
                    dr?.drawing_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.rev?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.assembly_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.unit?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.sheet_no?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.item_name?.toLowerCase()?.includes(search.toLowerCase())
            );
        }
        computedComments.sort((a, b) => {
            const data1 = a?.drawing_no?.toString() || "";
            const data2 = b?.drawing_no?.toString() || "";
            return data1.localeCompare(data2, undefined, { numeric: true });
        });
        setTotalItems(computedComments?.length);
        return computedComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [search, limit, currentPage, entity, finalOffer?.paint_no, matchDatas]);

    const handleChange = (e, name) => {
        setFinalOffer({ ...finalOffer, [name]: e.target.value });
    }

    const handleFinalCoatOffer = (mData) => {
        setFinalCoatData(mData);
    }

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    }



    const handleSubmit = () => {
        console.log("submitArr", submitArr);
        let updatedData = submitArr;
        const paint_system_id = updatedData[0]?.paint_system_id;
        console.log("updatedData", updatedData);
        if (updatedData.length === 0) {
            toast.error("Please add drawings")
            return;
        }

        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateFinalCoatData.current && validateFinalCoatData.current()) {
            const filteredData = updatedData.map((item) => {
                const isDrawingWise = item.main_id && item.drawing_id && item.item_id;

                if (isDrawingWise) {
                    // Drawing-wise MIO data
                    return {
                        "fc_offer_id": item._id,
                        "dispatch_id": item.dispatch_id,
                        "dispatch_no": item.dispatch_no,
                        "main_id": item.main_id,
                        "drawing_id": item.drawing_id,
                        "drawing_no": item.drawing_no,
                        "rev": item.rev,
                        "item_id": item.item_id,
                        "spool_id": item.spool_id || null,
                        "item_name": item.item_name,
                        "spool_no": item.spool_no || null,
                        "piping_class": item.piping_class,
                        "main_id": item.main_id,
                        "qty": item.qty,
                        "fc_balance_qty": item.fc_balance_qty,
                        "fc_used_qty": item.fc_used_qty,
                        "moved_next_step": item.moved_next_step,
                        "remarks": item.remarks || null
                    };
                } else {
                    // Raw (manual) MIO data
                    return {
                        _id: item._id || null,
                        item_name: item.item_name || null,
                        spool_no: item.spool_no || null,
                        drawing_id: item.drawing_id || null,
                        drawing_no: item.drawing_no || null,
                        rev: item.rev || null,
                        item_id: item.item_id || null,
                        spool_id: item.spool_id || null,
                        dispatch_id: item.dispatch_id || null,
                        dispatch_no: item.dispatch_no || null,
                        piping_class: item.piping_class || null,
                        main_id: item.main_id || null,
                        qty: item.qty || 0,
                        fc_balance_qty: item.fc_balance_qty || 0,
                        fc_used_qty: item.fc_used_qty || 0,
                        moved_next_step: item.moved_next_step || 0,
                        remarks: item.remarks || null,
                    };
                }
            });

            setDisable(true);
            const myurl = `${V_URL}/user/piping-add-multi-final-coat-offer`;
            const formData = new URLSearchParams();
            formData.append('items', JSON.stringify(filteredData));
            formData.append('weather_condition', JSON.stringify(weatherData))
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('project_id', localStorage.getItem("U_PROJECT_ID"));
            formData.append('procedure_no', finalOffer.procedure_no);
            formData.append('paint_system_id', paint_system_id);
            formData.append('final_date', finalCoatData.final_date);
            formData.append('time', finalCoatData.time);
            formData.append('shelf_life', finalCoatData.shelf_life);
            formData.append('manufacture_date', finalCoatData.manufacture_date);
            formData.append('paint_batch_base', finalCoatData.paint_base);
            formData.append('paint_batch_hardner', finalCoatData.paint_hardner);
            formData.append('offer_notes', finalCoatData.note || '');
            formData.append('remarks', finalOffer.remarks || '');
            formData.append('start_time', weatherTime.startTime);
            formData.append('end_time', weatherTime.endTime);

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
            }).catch((error) => {
                console.log(error, "error");
                toast.error(error?.response?.data?.message);
            }).finally(() => {
                setDisable(false);
            })
        }
    }

    const validation = () => {
        let err = {};
        var isValid = true;
        if (!finalOffer.procedure_no) {
            isValid = false;
            err['procedure_no_err'] = 'Please select procedure';
        }
        if (!weatherTime.startTime && !weatherTime.endTime) {
            isValid = false;
            toast.error("Please select both start and end times");
        } else {
            if (!weatherTime.startTime) {
                isValid = false;
                toast.error("Please select the start time");
            }
            if (!weatherTime.endTime) {
                isValid = false;
                toast.error("Please select the end time");
            }
            if (weatherTime.startTime && weatherTime.endTime) {
                const start = new Date(weatherTime.startTime);
                const end = new Date(weatherTime.endTime);

                if (start > end) {
                    isValid = false;
                    toast.error("Start time should be less than or equal to End time");
                }
            }
        }
        setError(err);
        return isValid
    }
    const handleModalClose = () => {
        setModalOpen(false);
    };


    const handleAddToArr = (data) => {
        console.log("data", data);
        const project_id = localStorage.getItem("U_PROJECT_ID");
        const paint_system_id = data?.paint_system_id || data?.paintDetails?._id;

        if (!project_id) {
            toast.error("Project ID missing in local storage");
            return;
        }

        const itemsToStore = data.items.map(item => ({
            drawing_id: item.drawing_id,
            drawing_no: item.drawing_no,
            rev: item.rev,
            item_id: Array.isArray(item.item_id) ? item.item_id[0] : item.item_id,
            spool_id: item.spool_id || null,
            dispatch_id: item.dispatch_id,
            main_id: data.report_id,
            item_name: item.spool_no || (Array.isArray(item.item_name) ? item.item_name[0] : item.item_name),
            spool_no: item.spool_no || null,
            dispatch_no: item.dispatch_no || item.dispatch_report,
            piping_class: item.piping_class,
            qty: item.qty,
            fc_balance_qty: 0,
            fc_used_qty: 0,
            moved_next_step: 0,
            remarks: item.remarks || ""
        }));

        const bodyFormData = new URLSearchParams();
        bodyFormData.append("project_id", project_id);
        bodyFormData.append("paint_system_id", paint_system_id);
        bodyFormData.append("items", JSON.stringify(itemsToStore));

        dispatch(manageFinalCoatOffer({ bodyFormData }))
            .then((res) => {
                if (res.payload?.success) {
                    toast.success("Drawings added to Final Coat offer");
                    // Fetch the final coat data after successfully adding items
                    dispatch(getPipingMultiFinalCoat());
                    dispatch(getPipingMioList());
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const handleSave = (item) => {
        if (editeMode && editIndex !== null) {
            setDrawingItems((prevData) => {
                const updatedData = [...prevData];
                updatedData[editIndex] = item;
                return updatedData;
            });
            setEditeMode(false);
            setEditIndex(null);
        } else {
            setDrawingItems((prevData) => [...prevData, item]);
            setEditeMode(false);
        }
        handleModalClose();
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id,
    }));
    const paintOptions = paints?.map(procedure => ({
        label: procedure.paint_system_no,
        value: procedure._id,
    }));
    const ReportOptions = reportNo?.map(procedure => ({
        label: procedure,
        value: procedure,
    }));
    const SiteOptions = dispatchSite?.map(procedure => ({
        label: procedure,
        value: procedure,
    }));

    const weatherActivity = ['Top Coat / Final']

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Final / Top Coating Offer List", link: "/piping/user/final-coat-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Final / Top Coating Offer `, active: false },
                    ]} />

                    {!data?._id && (
                        <>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4>{data?._id ? 'Edit' : 'Add'} Final / Top Coating Offer</h4>
                                            <div className="row mt-4">
                                                <div className="col-12 col-md-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Report No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={ReportOptions}
                                                            value={finalOffer.report_no}
                                                            onChange={(e) => handleChange(e, 'report_no')}
                                                            placeholder='Select Report No'
                                                            className='w-100'
                                                            filter
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <FinalCoatDrawingTable
                                is_dispatch={true}
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
                        </>
                    )}

                    {/* {
                        finalOffer?.paint_no && ( */}
                    <>
                        <FinalCoatTable
                            report_no={finalOffer?.report_no}
                            dispatch_site={finalOffer?.dispatch_site}
                            paintNo={finalOffer?.paint_no}
                            setSubmitArr={setSubmitArr}
                            data={data}
                            isEditMode={!!data?._id}
                            onAddItem={() => setModalOpen(true)}
                            onRefresh={() => dispatch(getPipingMultiFinalCoat())}
                        />
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
                                                        value={finalOffer?.procedure_no}
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
                            handleSubmit={handleSubmit}
                            validateWeather={validateWeather}
                            weatherData={data?.weather_condition}
                            weatherTime={weatherTime}
                            setFilteredWeather={setFilteredWeather}
                            setWeatherTime={setWeatherTime}
                            lockedDate={lockedDate}
                        />

                        <FinalCoatsFields
                            is_inspection={false}
                            paintData={paintData}
                            handleFinalCoatOffer={handleFinalCoatOffer}
                            validateFinalCoatData={validateFinalCoatData}
                            edit_data={data}
                            filteredWeather={filteredWeather}
                            lockedDate={lockedDate}
                        />
                    </>
                    {/* )
                    } */}
                    <SubmitButton finalReq={data?.items} link='/piping/user/final-coat-management'
                        disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Final Coat'} />
                </div>
            </div>

        </div>
    )
}

export default ManageMultiFinalCoat