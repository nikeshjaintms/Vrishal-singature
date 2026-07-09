import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import MioPaintFields from '../../../Paint/Mio/MioPaintComponents/MioPaintFields';
import WeatherCondition from '../../../Paint/WeatherCondition/WeatherCondition';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import MioDrawingTable from '../../Components/MioDrawingTable/MioDrawingTable';
import MioModal from './Components/MioModal';
import { getPipingMultiSurfaceOffer } from '../../../../../Store/Piping/MultiSurface/GetSurfaseOffer';
import MioTable from './Components/MioTable';
import { checkMioPaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import AddMioDrawingForm from './AddMioDrawingForm';
import { manageMioOfferTable } from '../../../../../Store/Piping/MultiMIO/ManageMio';
import { getPipingMultiMio } from '../../../../../Store/Piping/MultiMIO/GetMultiMio';

const MultiManageMio = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [reportNo, setReportNo] = useState([]);
    const [dispatchSite, setDispatchSite] = useState([])

    const [mioOffer, setMioOffer] = useState({
        report_no: '',
    });
    const [submitArr, setSubmitArr] = useState([]);
    const [entity, setEntity] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [multiMiodata, setMultiMioData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [showItem, setShowItem] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [drawingItems, setDrawingItems] = useState([]);
    const [editItem, setEditItem] = useState({});
    const [editeMode, setEditeMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [weatherData, setWeatherData] = useState([]);
    const [mioData, setMioData] = useState({});
    const [paintData, setPaintData] = useState(null);
    const [error, setError] = useState({});
    const validateMioData = useRef(null);
    const validateWeather = useRef(null);
    const data = location.state;
    console.log("new_data", data);
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);
    const [lockedDate, setLockedDate] = useState("");

    useEffect(() => {
        if (data?.paint_system_id) {
            setMioOffer((prev) => ({ ...prev, report_no: data?.report_no || "" }));
            setWeatherData(data?.weather_data);
            setWeatherTime({ startTime: data?.start_time || "", endTime: data?.end_time || "" })
        }
    }, [data]);

    useEffect(() => {
        dispatch(getPipingMultiSurfaceOffer({ isMIO: true }));
        dispatch(getUserProcedureMaster({ status: 'active' }));
        dispatch(getUserPaintSystem());
    }, [dispatch]);



    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const getMultiSurfaceData = useSelector((state) => state?.getPipingMultiSurfaceOffer?.user?.data?.data);
    const isLoading = useSelector((state) => state?.getPipingMultiSurfaceOffer?.loading);
    const getPipingMultiMioData = useSelector((state) => state?.getPipingMultiMio?.user?.data);

    console.log("getMultiSurfaceData", getMultiSurfaceData);

    useEffect(() => {
        if (getPipingMultiMioData?.length > 0) {
            setPaintData(getPipingMultiMioData[0]);
        }
    }, [getPipingMultiMioData]);

    useEffect(() => {
        if (getMultiSurfaceData?.length > 0) {
            const closestDate = getClosestCreatedAtDate(getMultiSurfaceData);
            setLockedDate(closestDate);
        }
    }, [getMultiSurfaceData]);

    useEffect(() => {
        if (!mioOffer?.report_no) {
            setPaintData(null);
        }
    }, [mioOffer?.report_no]);

    // Reset paint data when all items are removed from the table
    useEffect(() => {
        if (submitArr.length === 0) {
            setPaintData(null);
        }
    }, [submitArr]);


    useEffect(() => {
        const mergeDispatchData = (dataArray) => {

            if (!Array.isArray(dataArray)) {
                return [];
            }

            if (dataArray.length === 0) {
                return [];
            }

            const map = new Map();

            dataArray.forEach((record, recordIndex) => {

                if (!record.items || !Array.isArray(record.items)) {
                    return;
                }

                record.items.forEach((item, itemIndex) => {

                    if (!item.drawing_no || item.is_accepted !== 2) {
                        return;
                    }

                    const key = `${item.drawing_no}_${item._id}`;
                    if (!map.has(key)) {
                        map.set(key, {
                            drawing_no: item.drawing_no,
                            rev: item.rev,
                            sheet_no: item.sheet_no,
                            spool_no: item.spool_no,
                            spool_id: item.spool_id,
                            size1: item.size1,
                            thickness1: item.thickness1,
                            size2: item.size2,
                            thickness2: item.thickness2,
                            item_name: Array.isArray(item.item_name) ? item.item_name[0] : item.item_name,
                            report_no: record.report_no || "",
                            dispatch_report: item.dispatch_report || "",
                            dispatch_site: record.dispatch_site || item.dispatch_site || "",
                            paint_system_id: record.paint_system_id,
                            main_id: item.main_id,
                            // --- include dispatch-level paint info ---
                            paint_manufacturer: record.paint_manufacturer,
                            mio_paint: record.mio_paint,
                            mio_app_method: record.mio_app_method,
                            mio_dft_range: record.mio_dft_range,
                            paint_system_no: record.paint_system_no || '',
                            items: [item],
                        });
                    }
                    // map.get(key).items.push(item); // Not needed since we want individual rows
                });
            });

            const result = Array.from(map.values());
            return result;
        };

        if (getMultiSurfaceData?.length > 0) {
            const allReportNos = [...new Set(
                getMultiSurfaceData.flatMap(en => en.items.filter(o => o.is_accepted === 2).map(o => o.dispatch_report))
            )].filter(Boolean);
            const allDispatchSites = [...new Set(getMultiSurfaceData.map(e => e.dispatch_site))].filter(Boolean);

            // Only update dropdown options if they are empty or if the new list has multiple items
            // (indicating a full fetch rather than a single-report filtered fetch)
            if (reportNo.length === 0 || allReportNos.length > 1) {
                setReportNo(allReportNos);
            }
            if (dispatchSite.length === 0 || allDispatchSites.length > 1) {
                setDispatchSite(allDispatchSites);
            }
        }

        // console.log("getMultiSurfaceData:", getMultiSurfaceData);
        let mergedFiltered = mergeDispatchData(getMultiSurfaceData);
        // console.log("Merged data before local filter:", mergedFiltered);

        if (mioOffer?.report_no) {
            // Filter initially by report_no
            mergedFiltered = mergedFiltered.filter(item =>
                (item.dispatch_report || "").toString().trim() === (mioOffer.report_no || "").toString().trim()
            );

            // Hide from MioDrawingTable if already added to manageable MioTable
            if (getPipingMultiMioData && Array.isArray(getPipingMultiMioData)) {
                // Collect signatures of already added items
                const addedSet = new Set(
                    getPipingMultiMioData
                        .filter(addedItem => addedItem.dispatch_no === mioOffer.report_no || addedItem.report_no === mioOffer.report_no)
                        .map(addedItem => {
                            const a_item_id = Array.isArray(addedItem.item_id) ? addedItem.item_id[0] : addedItem.item_id;
                            return `${addedItem.main_id}_${addedItem.drawing_id}_${a_item_id || 'null'}_${addedItem.spool_id || 'null'}`;
                        })
                );

                if (addedSet.size > 0) {
                    mergedFiltered = mergedFiltered.filter(row => {
                        return !row.items.some(subItem => {
                            const item_id = Array.isArray(subItem.item_id) ? subItem.item_id[0] : subItem.item_id;
                            const itemKey = `${subItem.main_id}_${subItem.drawing_id}_${item_id || 'null'}_${subItem.spool_id || 'null'}`;
                            return addedSet.has(itemKey);
                        });
                    });
                }
            }
        }
        if (mioOffer?.dispatch_site) {
            mergedFiltered = mergedFiltered.filter(item => item.dispatch_site === mioOffer.dispatch_site);
        }

        // console.log("Final entity:", mergedFiltered);
        setEntity(mergedFiltered);
        setFilteredData(mergedFiltered);


    }, [getMultiSurfaceData, mioOffer?.report_no, mioOffer?.dispatch_site, getPipingMultiMioData]);



    const checkCompletedDraw = async () => {
        if (entity && entity.length > 0) {
            const res = await checkMioPaint(entity);
            setMatchDatas(res.matchData);
            setUnMatchDatas(res.unmatchData);
        } else {
            setMatchDatas([]);
            setUnMatchDatas([]);
        }
    }

    useEffect(() => {
        checkCompletedDraw();
    }, [entity]);

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const commentsData = useMemo(() => {

        // Use matchDatas if available, otherwise fall back to entity
        let computedComments = matchDatas?.length > 0 ? matchDatas : (entity || []);
        // console.log("computedComments before filtering/paging:", computedComments);

        // If no report no is selected, return empty array
        if (!mioOffer?.report_no) {
            computedComments = [];
        }

        // Apply search filter
        if (search) {
            computedComments = computedComments.filter(
                (dr) =>
                    dr?.drawing_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.rev?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.sheet_no?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.item_name?.toLowerCase()?.includes(search.toLowerCase())
            );
        }

        // Sort by drawing number
        computedComments.sort((a, b) => {
            const data1 = a?.drawing_no?.toString() || "";
            const data2 = b?.drawing_no?.toString() || "";
            return data1.localeCompare(data2, undefined, { numeric: true });
        });

        setTotalItems(computedComments?.length);
        const paginatedData = computedComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );

        return paginatedData;
    }, [search, limit, currentPage, entity, matchDatas]);

    const handleChange = (e, name) => {
        const value = e.target.value;
        setMioOffer({ ...mioOffer, [name]: value });
    }

    const handleMioOffer = (mData) => {
        setMioData(mData);
    }

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    }

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
            setDrawingItems((prevData) => [...prevData, item]); // This line adds new items
            setEditeMode(false);
        }
        handleModalClose();
    };


    console.log("submitArr", submitArr)

    const handleSubmit = () => {
        console.log("submitArr", submitArr)
        let updatedData = submitArr;
        const paint_system_id = updatedData[0]?.paint_system_id;

        console.log("updatedData", updatedData)
        if (updatedData.length === 0) {
            toast.error("Please add drawings");
            return;
        }

        if (
            validation() &&
            weatherData.length > 0 &&
            validateWeather.current &&
            validateWeather.current() &&
            validateMioData.current &&
            validateMioData.current()
        ) {
            // Map items to match schema
            const filteredData = updatedData.map((item) => {
                const isDrawingWise = item.drawing_id && item.item_id;

                if (isDrawingWise) {
                    return {
                        main_id: item.main_id,
                        drawing_id: item.drawing_id,
                        dispatch_id: item.dispatch_id || null,
                        item_name: item.item_name || "",
                        item_id: item.item_id || null,
                        spool_id: item.spool_id || null,
                        rev: item.rev || null,
                        piping_class: item.piping_class || null,
                        qty: item.qty || 0,
                        mio_balance_qty: item.mio_balance_qty || 0,
                        mio_used_qty: item.mio_used_qty || 0,
                        moved_next_step: item.moved_next_step || 0,
                        remarks: item.remarks || "",
                        offer_id: item._id
                    };
                } else {
                    return {
                        main_id: item.main_id,
                        drawing_id: item.drawing_id,
                        drawing_no: item.drawing_no || "",
                        item_name: item.item_name || "",
                        item_id: item.item_id || null,
                        spool_id: item.spool_id || null,
                        piping_class: item.piping_class || null,
                        rev: item.rev || null,
                        dispatch_id: item.dispatch_id || null,
                        dispatch_no: item.dispatch_no || "",
                        qty: item.qty || 0,
                        mio_balance_qty: item.mio_balance_qty || 0,
                        mio_used_qty: item.mio_used_qty || 0,
                        moved_next_step: item.moved_next_step || 0,
                        remarks: item.remarks || "",
                        offer_id: item._id

                    };
                }
            });

            setDisable(true);

            const myurl = `${V_URL}/user/piping-add-multi-mio-offer`;

            const formData = new URLSearchParams();
            formData.append("items", JSON.stringify(filteredData));
            formData.append("weather_condition", JSON.stringify(weatherData));
            formData.append("offered_by", localStorage.getItem("PAY_USER_ID"));
            formData.append("project", localStorage.getItem("PAY_USER_PROJECT_NAME"));
            formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
            formData.append("procedure_no", mioOffer.procedure_no);
            formData.append("mio_date", new Date(mioData.mio_date).toISOString());
            formData.append("time", mioData.time || "");
            formData.append("shelf_life", mioData.shelf_life || "");
            formData.append("manufacture_date", new Date(mioData.manufacture_date).toISOString());
            formData.append("paint_batch_base", mioData.paint_batch_base || "");
            formData.append("paint_batch_hardner", mioData.paint_batch_hardner || "");
            formData.append("paint_system_id", paint_system_id || "");
            formData.append("offer_notes", mioData.note || "");
            formData.append("remarks", mioOffer.remarks || "");
            formData.append("start_time", weatherTime.startTime || "");
            formData.append("end_time", weatherTime.endTime || "");

            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                },
            })
                .then((response) => {
                    if (response.data?.success) {
                        toast.success(response.data.message);
                        navigate("/piping/user/mio-offer-management");
                    } else {
                        toast.error(response.data.message || "Something went wrong");
                    }
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.message || error.message);
                })
                .finally(() => {
                    setDisable(false);
                });
        }
    };


    const validation = () => {
        let err = {};
        var isValid = true;
        if (!mioOffer.procedure_no) {
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

    const handleAddToArr = (data) => {
        const project_id = localStorage.getItem("U_PROJECT_ID");

        if (!project_id) {
            toast.error("Project ID missing in local storage");
            return;
        }

        const paint_system_id = data.paint_system_id; // 👈 parent-level

        const itemsToStore = data.items.map(item => ({
            drawing_id: item.drawing_id,
            rev: item.rev,
            item_id: Array.isArray(item.item_id) ? item.item_id[0] : item.item_id,
            dispatch_id: item.dispatch_id,
            main_id: item.main_id,
            item_name: Array.isArray(item.item_name) ? item.item_name[0] : item.item_name,
            drawing_no: item.drawing_no,
            spool_id: item.spool_id,
            dispatch_no: item.dispatch_report,
            piping_class: item.piping_class_id,
            qty: item.qty,
            mio_balance_qty: 0,
            mio_used_qty: 0,
            moved_next_step: 0,
            remarks: item.remarks || ""
        }));

        const bodyFormData = new URLSearchParams();
        bodyFormData.append("project_id", project_id);

        // ✅ ADD THIS (TOP LEVEL)
        bodyFormData.append("paint_system_id", paint_system_id);

        bodyFormData.append("items", JSON.stringify(itemsToStore));

        dispatch(manageMioOfferTable({ bodyFormData }))
            .then((res) => {
                if (res.payload?.success) {
                    toast.success("Drawings added to MIO offer");
                    dispatch(getPipingMultiMio());
                    dispatch(getPipingMultiSurfaceOffer({ isMIO: true }));

                    // 🎨 Fill paint fields from the first added row (only once)
                    setPaintData(prev => {
                        if (prev !== null) return prev; // already filled — don't overwrite
                        const paintSystemId =
                            typeof data.paint_system_id === "object"
                                ? data.paint_system_id?._id
                                : data.paint_system_id;
                        const paintFromStore = Array.isArray(paints)
                            ? paints.find(p => p._id === paintSystemId)
                            : null;
                        return {
                            paint_system_no: paintFromStore?.paint_system_no || data.paint_system_no || "",
                            paint_manufacturer: data.paint_manufacturer ?? "",
                            mio_paint: data.mio_paint ?? "",
                            mio_app_method: data.mio_app_method ?? "",
                            mio_dft_range: data.mio_dft_range ?? "",
                        };
                    });
                }
            })
            .catch(console.error);
    };


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id,
    })) || [];
    const paintOptions = paints?.map(procedure => ({
        label: procedure.paint_system_no,
        value: procedure._id,
    })) || [];
    const ReportOptions = reportNo?.map(procedure => ({
        label: procedure,
        value: procedure,
    })) || [];
    const SiteOptions = dispatchSite?.map(procedure => ({
        label: procedure,
        value: procedure,
    })) || [];

    const weatherActivity = ['MIO Coat']

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "MIO Offer List", link: "/piping/user/mio-offer-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} MIO Offer`, link: "/piping/user/mio-offer-management", active: false },
                    ]} />

                    {!data?._id && (
                        <>
                            {/* {console.log("Rendering DrawingTable section, data._id:", data?._id, "commentsData length:", commentsData?.length)} */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4>{data?._id ? 'Edit' : 'Add'} MIO Offer Details</h4>
                                            <div className="row mt-4">
                                                <div className="col-12 col-md-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Report No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={ReportOptions}
                                                            value={mioOffer.report_no}
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

                            {isLoading ? (
                                <div className="card">
                                    <div className="card-body text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading drawing data...</p>
                                    </div>
                                </div>
                            ) : (
                                <MioDrawingTable
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
                            )}
                        </>
                    )}

                    {/* {mioOffer?.paint_no && ( */}
                    <>
                        <MioTable
                            report_no={mioOffer?.report_no}
                            dispatch_site={mioOffer?.dispatch_site}
                            paintNo={mioOffer?.paint_no}
                            setSubmitArr={setSubmitArr}
                            data={data}
                            onAddItem={() => setModalOpen(true)}
                            isEditMode={!!data?._id}
                        />
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>{data?._id ? 'Edit' : 'Add'} MIO Detailed</h4>
                                        <div className='row mt-4'>
                                            <div className="col-12 col-md-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Procedure No.<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={procedureOptions}
                                                        value={mioOffer?.procedure_no}
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


                        <AddMioDrawingForm
                            modalOpen={modalOpen}
                            handleModalClose={() => setModalOpen(false)}
                            onSaveItem={(item) => {
                                setDrawingItems((prev) => [...prev, item]);
                                setModalOpen(false);
                            }}
                            handleSave={handleSave}
                            //   handleAddMore={(item) => setDrawingItems((prev) => [...prev, item])}
                            //   handleAddMore={handleAddMore}
                            modalMode="add"
                            editItem={editItem}
                            editeMode={editeMode}
                            paintNo={mioOffer?.paint_no}
                        // paintNo={selectValues?.paint_no}

                        />
                        <MioPaintFields
                            is_inspection={false}
                            paintData={paintData}
                            handleMioOffer={handleMioOffer}
                            validateMioData={validateMioData}
                            edit_data={data}
                            filteredWeather={filteredWeather}
                            lockedDate={lockedDate}
                        />
                    </>
                    {/* )} */}
                    <SubmitButton finalReq={data?.items} link='/piping/user/mio-offer-management'
                        disable={disable} handleSubmit={handleSubmit} buttonName={'Generate MIO Offer'} />
                </div>
            </div>
            <MioModal
                report_no={mioOffer?.report_no}
                dispatch_site={mioOffer?.dispatch_site}
                paintNo={mioOffer?.paint_no}
                showItem={showItem}
                handleCloseModal={() => setShowItem(false)}
                title={'Drawing Grid List'}
                mioData={multiMiodata}
            />
        </div>
    )
}

export default MultiManageMio