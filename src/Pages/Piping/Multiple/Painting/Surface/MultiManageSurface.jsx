import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import SurfaceDrawingTable from '../../Components/SurfaceDrawingTable/SurfaceDrawingTable';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import SurfaceModel from './Components/SurfaceModel';
import SurfaceTable from './Components/SurfaceTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import WeatherCondition from '../../../Paint/WeatherCondition/WeatherCondition';
import SurfaceFields from '../../../Paint/SurfacePrimer/SurfacePrimerComponents/SurfaceFields';
import { getPipingDispatchNotes } from '../../../../../Store/Piping/DispatchNote/GetDispatchNote';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import { getPipingMultiDispatchPaint } from '../../../../../Store/Piping/MultiSurface/GetMultiDispatchNotePaint';
import { checkSurfacePaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import { getMultiSurfaceOfferViewPage } from "../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaceOfferViewPage";
import AddSufaceDrawingForm from './Components/AddSufaceDrawingForm';
import { getPipingMultiSurface } from '../../../../../Store/Piping/MultiSurface/GetMultiSurface';

import { MultiSelect } from "primereact/multiselect";

// get-view-multi-surface
const MultiManageSurface = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;

    const [showItem, setShowItem] = useState(false);
    const [disable, setDisable] = useState(false);
    const [multiSurfacedata, setMultiSurfaceData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [entity, setEntity] = useState([]);
    const [submitArr, setSubmitArr] = useState([]);
    const [error, setError] = useState({});
    const [reportNo, setReportNo] = useState([]);
    const [dispatchSite, setDispatchSite] = useState([]);
    const [selectValues, setSelectValues] = useState({
        report_no: "",
    });
    const [paintDefaultData, setPaintDefaultData] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [surfacedata, setSurfaceData] = useState([]);
    const [paintData, setPaintData] = useState(null);
    const [procedure, setProcedure] = useState({ vendor_doc_no: '' });
    const validateWeather = useRef(null);
    const weatherActivity = ['Blasting / Surf. Prep.', 'Primer Application'];
    const validateSurfaceData = useRef(null);
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [lockedDate, setLockedDate] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [refreshTable, setRefreshTable] = useState(0);
    const [surfaceTableData, setSurfaceTableData] = useState([]);
    const [surfaceTableTotalItems, setSurfaceTableTotalItems] = useState(0);



    // const [data, setData] = useState([]);
    const [drawingItems, setDrawingItems] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editItem, setEditItem] = useState({});
    const [editeMode, setEditeMode] = useState(false);
    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);
    const [finalArr, setFinalArr] = useState([]);

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    };
    const handleSurfaceData = (srData) => {
        setSurfaceData(srData);
    };



    // Redux state for surface offers
    const pipingMultiSurfaceOffer = useSelector(
        (state) => state.getPipingMultiSurface?.data || []
    );

    // Fetch Multi Surface Offers
    useEffect(() => {
        if (!selectValues.report_no) return;

        // Dispatch action to get data
        dispatch(getPipingMultiSurface());

    }, [selectValues.report_no, refreshTable]);

    // Sync Redux state to local table data
    const multiDis = useSelector((state) => state.getPipingDispatchNotes?.user?.data?.data);

    useEffect(() => {
        if (!selectValues?.report_no) {
            setSurfaceTableData([]);
            setSurfaceTableTotalItems(0);
            return;
        }

        const enrichedData = (pipingMultiSurfaceOffer || []).map((item) => {
            const matchDispatch = multiDis?.find((d) => d._id === item.dispatch_id);
            return {
                ...item,
                paint_system_no: matchDispatch?.paint_system_no || item.paint_system_no || '-',
                qty: item.qty ? item.qty : (item.surface_balance_grid_qty || 0) + (item.surface_used_grid_qty || 0),
            };
        });
        setSurfaceTableData(enrichedData);
        setSurfaceTableTotalItems(enrichedData.length);
    }, [pipingMultiSurfaceOffer, multiDis, selectValues?.report_no]);


    const handleModalClose = () => {
        setModalOpen(false);
    };


    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const multiDispatchPaintData = useSelector((state) => state?.getPipingMultiDispatchPaint?.user?.data?.data);


    useEffect(() => {
        if (multiDispatchPaintData?.length > 0) {
            const closestDate = getClosestCreatedAtDate(multiDispatchPaintData);
            setLockedDate(closestDate);
        }
    }, [multiDispatchPaintData]);

    useEffect(() => {
        setCurrentPage(1);
        setSearch("");
        setDrawings([]);
        setPaintData(null);
    }, [selectValues.report_no]);

    useEffect(() => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        if (!projectId) {
            // console.log('Project ID not found in localStorage');
            return; // stop if no project
        }
        const payload = {
            report_no: selectValues.report_no,
            project: localStorage.getItem("U_PROJECT_ID"),
        }
        dispatch(getPipingDispatchNotes({
            DATA: payload,
            project: projectId,
            isSurface: true
        }));
        dispatch(getPipingMultiDispatchPaint({ DATA: payload, isSurface: true }));
        dispatch(getUserPaintSystem({ status: '' }));
        dispatch(getDrawing());
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [selectValues?.report_no]);

    // useEffect(() => {
    // if (drawings.length > 0) {
    //     const ps = drawings[0]?.paint_system;

    //     if (!ps) return;

    //     setPaintData({
    //     paint_system_no: ps.paint_system_no || '',
    //     });
    // }
    // }, [drawings]);  


    // its for report no

    useEffect(() => {
        if (Array.isArray(multiDispatchPaintData)) {
            const uniqueReportNo = [
                ...new Set(multiDispatchPaintData.map(item => item.report_no))
            ];
            setReportNo(uniqueReportNo);
        }
    }, [multiDispatchPaintData]);

    // its for drawing list table
    useEffect(() => {
        if (!Array.isArray(multiDis)) return;

        const extractedDrawings = multiDis.flatMap(dispatch =>
            dispatch.items
                .filter(item => item.isGenerateSurfaceOffer === false)
                .map(item => ({
                    report_no: dispatch.report_no,
                    main_id: dispatch._id,
                    drawing_no: item.drawing_no,
                    drawing_id: item.drawing_id,
                    piping_class: item.piping_class._id,
                    rev: item.rev,
                    sheet_no: item.sheet_no,
                    qty: item.qty,
                    spool_no: item.spool_no,          // ✅ ADD THIS
                    spool_no_id: item.spool_id, // ✅ ADD THIS
                    item_id: item.item_id,
                    item_name: item.item_name,
                    paint_system_id: dispatch.paint_system || null,
                    paint_system_no: dispatch.paint_system_no || '',
                    paint_system: dispatch.paint_system || null,
                    // --- include dispatch-level paint info ---
                    paint_manufacturer: dispatch.paint_manufacturer,
                    surface_preparation: dispatch.surface_preparation,
                    profile_requirement: dispatch.profile_requirement,
                    salt_test: dispatch.salt_test,
                    prime_paint: dispatch.prime_paint,
                    primer_app_method: dispatch.primer_app_method,
                    primer_dft_range: dispatch.primer_dft_range,
                    mio_paint: dispatch.mio_paint,
                    mio_app_method: dispatch.mio_app_method,
                    mio_dft_range: dispatch.mio_dft_range,
                    final_paint: dispatch.final_paint,
                    final_paint_app_method: dispatch.final_paint_app_method,
                    final_paint_dft_range: dispatch.final_paint_dft_range,
                    total_dft_requirement: dispatch.total_dft_requirement,
                }))
        );

        console.log('extractedDrawings', extractedDrawings);
        setDrawings(extractedDrawings);
    }, [multiDis]);



    const commentsData = useMemo(() => {
        // If no report selected → empty table
        if (!selectValues?.report_no) {
            setTotalItems(0);
            return [];
        }

        let data = [...drawings];

        // ✅ FILTER BY SELECTED REPORT NO
        data = data.filter(d =>
            d.report_no === selectValues.report_no
        );

        // ✅ SEARCH FILTER
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(d =>
                d.drawing_no?.toLowerCase().includes(q) ||
                d.rev?.toLowerCase().includes(q) ||
                d.sheet_no?.toLowerCase().includes(q) ||
                d.report_no?.toLowerCase().includes(q)
            );
        }

        // ✅ SORT
        data.sort((a, b) =>
            (a.drawing_no || "").localeCompare(b.drawing_no || "", undefined, {
                numeric: true,
            })
        );

        setTotalItems(data.length);

        // ✅ PAGINATION
        return data.slice(
            (currentPage - 1) * limit,
            currentPage * limit
        );
    }, [
        drawings,
        search,
        currentPage,
        limit,
        selectValues?.report_no
    ]);

    // Paint data is intentionally NOT auto-filled on load.
    // It is populated only when the user clicks 'Add' on a drawing row (see handleAddToArr).
    // We still watch report_no to clear paint data when the report changes.
    useEffect(() => {
        if (!selectValues.report_no) {
            setPaintData(null);
        }
    }, [selectValues.report_no, drawings, paints]);

    // Reset paint data when all items are removed from the table
    useEffect(() => {
        if (submitArr.length === 0) {
            setPaintData(null);
        }
    }, [submitArr]);


    const validation = () => {
        let isValid = true;
        let err = {};
        if (!procedure?.vendor_doc_no) {
            isValid = false;
            err['vendor_doc_no_err'] = "Please select procedure no";
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
        setError(err)
        return isValid;
    };



    const handleAddToArr = async (row) => {
        console.log("🚀 handleAddToArr row:", row);
        if (!row) return;

        const payload = {
            project_id: localStorage.getItem("U_PROJECT_ID"),
            paint_system_id: row.paint_system_id || null,
            surface_no: row.report_no,
            items: [
                {
                    drawing_id: row.drawing_id || null,
                    drawing_no: row.drawing_no || "",
                    rev: row.rev || "",
                    piping_class: row.piping_class || null,
                    main_id: row.main_id || null,
                    dispatch_no: row.report_no,
                    qty: Number(row.qty || 0),
                    surface_balance_qty: Number(row.qty || 0),
                    item_id: row.item_id || null,
                    item_name: row.item_name || "",
                    spool_id: row.spool_no_id || null,
                    spool_no: row.spool_no || "",
                    surface_used_qty: 0,
                    moved_next_step: 0,
                    remarks: "",
                },
            ],
        };

        try {
            const res = await axios.post(
                `${V_URL}/user/piping-manage-multi-surface-offer`,
                payload,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.data?.success) {
                toast.error(res.data?.message || "Failed to add drawing");
                return;
            }

            toast.success("Drawing added successfully");
            setRefreshTable(prev => prev + 1);

            // 🎨 Fill paint fields from the first added row (only once)
            setPaintData(prev => {
                if (prev !== null) return prev; // already filled — don't overwrite
                const paintSystemId =
                    typeof row.paint_system_id === "object"
                        ? row.paint_system_id?._id
                        : row.paint_system_id;
                const paintFromStore = Array.isArray(paints)
                    ? paints.find(p => p._id === paintSystemId)
                    : null;
                return {
                    paint_system_no: paintFromStore?.paint_system_no || row.paint_system_no || "",
                    surface_preparation: row.surface_preparation ?? "",
                    profile_requirement: row.profile_requirement ?? "",
                    salt_test: row.salt_test ?? "",
                    prime_paint: row.prime_paint ?? "",
                    primer_app_method: row.primer_app_method ?? "",
                    paint_manufacturer: row.paint_manufacturer ?? "",
                    primer_dft_range: row.primer_dft_range ?? "",
                };
            });

            // 🔹 Fetch updated surface offers
            console.log("row.report_no", row.report_no);
            console.log("row.main_id", row.main_id);
            const multiSurfaceData = await dispatch(
                getPipingMultiSurface(row.report_no, row.main_id)
            ).unwrap();

            console.log("Updated surface data:", multiSurfaceData);

            // 🔹 IMPORTANT: get ALL matching surfaces (not just one)
            const matchedSurfaces = Array.isArray(multiSurfaceData)
                ? multiSurfaceData.filter(
                    s =>
                        s.drawing_no === row.drawing_no &&
                        s.main_id === row.main_id
                )
                : [multiSurfaceData];

            // 🔹 Build submit items
            const savedItems = matchedSurfaces.map(surface => ({
                dispatch_no: row.report_no,
                drawing_no: surface.drawing_no,
                drawing_id: surface.drawing_id || row.drawing_id,
                rev: row.rev,
                piping_class: row.piping_class,
                qty: Number(surface.qty || row.qty || 0),
                surface_balance_qty: Number(
                    surface.surface_balance_qty || row.qty || 0
                ),
                surface_used_qty: 0,
                moved_next_step: 0,
                paint_system_id: row.paint_system_id || null,
                main_id: row.main_id,
                report_no: row.report_no,
                item_id: row.item_id || null,
                item_name: row.item_name || "",
                surface_no: row.surface_no || "",
                surface_offer_id: surface._id, // 👈 UNIQUE
                spool_id: surface.spool_id || row.spool_no_id || null,
                spool_no: surface.spool_no || row.spool_no || "",
            }));

            console.log("Saved items to add:", savedItems);

            // 🔹 Add all, but avoid exact same DB row duplication
            setSubmitArr(prev => {
                const existingIds = new Set(
                    prev.map(item => item.surface_offer_id)
                );

                const newItems = savedItems.filter(
                    item => !existingIds.has(item.surface_offer_id)
                );

                return [...prev, ...newItems];
            });

            const refetch = {
                report_no: selectValues.report_no,
                project: localStorage.getItem("U_PROJECT_ID")
            }


            dispatch(getPipingDispatchNotes({
                DATA: refetch,
                project: localStorage.getItem("U_PROJECT_ID"),
                isSurface: true
            }))

        } catch (error) {
            console.error("Surface offer API error:", error);
            toast.error(error.response?.data?.message || "API error");
        }
    };



    const handleChange = (e, name) => {
        setProcedure({ ...procedure, [name]: e.target.value });
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



    const selcetvalueChange = (e, name) => {
        setSelectValues({ ...selectValues, [name]: e.target.value })
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id,
    }));
    const PaintOptions = paints?.map(procedure => ({
        label: procedure.paint_system_no,
        value: procedure._id,
    }));
    const ReportOptions = reportNo.map(no => ({
        label: no,
        value: no,
    }));

    const SiteOptions = dispatchSite?.map(procedure => ({
        label: procedure,
        value: procedure,
    }));
    console.log('submitArr', submitArr);

    console.log("drawingsdrawings", drawings);

    const handleSubmit = () => {
        let updatedData = submitArr;
        if (updatedData.length === 0) {
            toast.error("Please add drawings")
            return;
        }

        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateSurfaceData.current && validateSurfaceData.current()) {
            const filteredData = submitArr.map(item => ({
                surface_offer_id: item.surface_offer_id || null,
                surface_no: item.surface_no || "", // fallback to report_no if needed
                main_id: item.main_id || null,
                drawing_id: item.drawing_id || null,
                drawing_no: item.drawing_no || "",
                rev: item.rev || "",
                piping_class: item.piping_class || "",
                dispatch_no: item.dispatch_no || item.report_no || "",
                qty: item.qty || 0,
                surface_balance_grid_qty: item.surface_balance_qty || 0,
                surface_used_grid_qty: item.surface_used_grid_qty || 0,
                moved_next_step: item.moved_next_step || 0,
                remarks: item.remarks || "",
                item_name: item.item_name || "",
                item_id: item.item_id || null,
                spool_id: item.spool_id || null,
                spool_no: item.spool_no || "",
            }));


            console.log('filteredData', filteredData);

            setDisable(true);
            const formData = new URLSearchParams();
            formData.append('items', JSON.stringify(filteredData));
            formData.append('weather_condition', JSON.stringify(weatherData));
            formData.append('vendor_doc_no', procedure?.vendor_doc_no);
            formData.append('original_status', surfacedata?.originalStatus);
            formData.append('metal_condition', surfacedata?.metalCondition);
            formData.append('metal_rust_grade', surfacedata?.metalRustGrade);
            const selectedPaintSystem = submitArr?.[0]?.paint_system_id;
            formData.append(
                'paint_system_id',
                typeof selectedPaintSystem === "object"
                    ? selectedPaintSystem?._id
                    : selectedPaintSystem
            );

            formData.append('blasting_date', surfacedata?.blastingDate);
            formData.append('blasting_method', surfacedata?.blastingMethod);
            formData.append('abrasive_type', surfacedata.abrasive_type);
            formData.append('dust_level', surfacedata?.dustLevel);
            formData.append('primer_date', surfacedata?.primerDate);
            formData.append('time', surfacedata?.time);
            formData.append('paint_batch_base', surfacedata?.paintBatchBase);
            formData.append('manufacture_date', surfacedata?.manufactureDate);
            formData.append('shelf_life', surfacedata?.shelfLife);
            formData.append('paint_batch_hardner', surfacedata?.paintBatchHardner);
            formData.append('paint_system_no', surfacedata?.paintSystemNo);

            formData.append('offer_notes', surfacedata?.remark);
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem("PAY_USER_PROJECT_NAME"));
            formData.append('project_id', localStorage.getItem("U_PROJECT_ID"));

            formData.append('start_time', weatherTime.startTime);
            formData.append('end_time', weatherTime.endTime);

            const myurl = `${V_URL}/user/piping-add-multi-surface-offer`;
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response?.data?.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/piping/user/surface-primer-management');
                    setSubmitArr([])
                    setSelectValues({ report_no: "" })
                    setSurfaceTableData([])
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                toast.error(error.response?.data?.message);
            }).finally((() => { setDisable(false) }));
        }
    }

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                            { name: "Surface & Primer Offer List", link: "/piping/user/surface-primer-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Surface & Primer Offer`, active: true }
                        ]} />
                        {!data?._id && (
                            <>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className='row mt-4'>
                                                    <div className="col-12 col-md-4">
                                                        <div className=" mx-2">
                                                            <div className="input-block local-forms custom-select-wpr">
                                                                <label> Report No.<span className="login-danger">*</span></label>
                                                                <Dropdown
                                                                    options={ReportOptions}
                                                                    value={selectValues.report_no}
                                                                    onChange={(e) =>
                                                                        setSelectValues({ ...selectValues, report_no: e.value })
                                                                    }
                                                                    placeholder="Select Report No."
                                                                    className="w-100"
                                                                />

                                                                {/* <MultiSelect
                                                                    options={ReportOptions}
                                                                    value={selectValues.report_no}
                                                                    placeholder="Select Report No."
                                                                    display="chip"
                                                                    className="w-100 multi-prime-react"
                                                                    onChange={(e) =>
                                                                        setSelectValues({ ...selectValues, report_no: e.value })
                                                                    }
                                                                /> */}

                                                            </div >
                                                        </div >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <SurfaceDrawingTable
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
                                    finalArr={submitArr}
                                />
                            </>
                        )}

                        {/* {selectValues?.paint_no && ( */}
                        <>
                            <SurfaceTable
                                report_no={selectValues?.report_no}
                                onAddItem={() => setModalOpen(true)}
                                setSubmitArr={setSubmitArr}
                                data={data}
                                isEditMode={!!data?._id}
                                refreshTable={refreshTable}
                                tableData={surfaceTableData}           // ✅ pass table data
                                totalItems={surfaceTableTotalItems}
                                reportNo={selectValues?.report_no}

                            //   data={{ items: drawingItems }}
                            />



                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4>{data?._id ? 'Edit' : 'Add'} Surface Preparation & Primer </h4>
                                            <div className='row mt-4'>
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
                                setWeatherTime={setWeatherTime}
                                weatherTime={weatherTime}
                                setFilteredWeather={setFilteredWeather}
                                lockedDate={lockedDate}
                            />
                            <AddSufaceDrawingForm
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
                                paintNo={selectValues?.paint_no}

                            />
                            <SurfaceFields
                                is_inspection={false}
                                paintData={paintData}
                                handleSurfaceData={handleSurfaceData}
                                validateSurfaceData={validateSurfaceData}
                                edit_data={data}
                                lockedDate={lockedDate}
                                filteredWeather={filteredWeather}
                            />
                        </>
                        {/* )} */}

                        <SubmitButton finalReq={data?.items} link='/piping/user/surface-primer-management'
                            disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Surface Offer'} />
                    </div>
                </div>
            </div >
            <SurfaceModel
                report_no={selectValues?.report_no}
                dispatch_site={selectValues?.dispatch_site}
                paintNo={selectValues?.paint_no}
                showItem={showItem}
                handleCloseModal={() => setShowItem(false)}
                title={'Drawing Grid List'}
                surfaceData={multiSurfacedata}
            />
        </>
    )
}

export default MultiManageSurface