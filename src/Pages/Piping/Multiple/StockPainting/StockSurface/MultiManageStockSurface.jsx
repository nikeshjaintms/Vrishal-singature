import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import SurfaceDrawingTable from '../../Components/SurfaceDrawingTable/SurfaceDrawingTable';
import SurfaceItemTable from '../../Components/SurfaceItemTable/SurfaceItemTable';

import { useDispatch, useSelector } from 'react-redux';
import SurfaceModel from './Components/StockSurfaceModel';
import SurfaceTable from './Components/StockSurfaceTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import WeatherCondition from '../../../StockPaint/StockWeatherCondition/StockWeatherCondition';
import SurfaceFields from '../../../StockPaint/StockSurfacePrimer/StockSurfacePrimerComponents/StockSurfaceFields';
import { getPipingStockDispatchNotes } from '../../../../../Store/Piping/StockDispatchNote/GetStockDispatchNote';
import { getUserPaintSystemPiping } from '../../../../../Store/Piping/PaintSystem/PaintSystem';

import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import { getPipingMultiStockDispatchPaint } from '../../../../../Store/Piping/MultiStockSurface/GetMultiStockDispatchNotePaint';

import { checkSurfacePaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import { getMultiSurfaceOfferViewPage } from "../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaceOfferViewPage";
import AddSufaceDrawingForm from './Components/AddStockSufaceDrawingForm';
import { getPipingMultiStockSurface } from '../../../../../Store/Piping/MultiStockSurface/GetMultiStockSurface';

import { MultiSelect } from "primereact/multiselect";

// get-view-multi-surface
const MultiManageStockSurface = () => {
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
        (state) => state.getPipingMultiStockSurface?.data || []
    );

    // Fetch Multi Surface Offers
    useEffect(() => {
        if (!selectValues.report_no) return;

        // Dispatch action to get data
        dispatch(getPipingMultiStockSurface());

    }, [selectValues.report_no, refreshTable]);

    // Sync Redux state to local table data
    const multiDis = useSelector((state) => state.getPipingMultiStockDispatchPaint?.user?.data?.data);
console.log("multiDis=======>",multiDis);
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


    const paints = useSelector((state) => state?.getUserPaintSystemPiping?.user?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const multiDispatchPaintData = useSelector((state) => state?.getPipingMultiStockDispatchPaint?.user?.data?.data);


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
             page:currentPage,
            limit,
            search
        }
        dispatch(getPipingMultiStockDispatchPaint({
             ...payload,
            project: projectId
        }));
        dispatch(getPipingMultiStockDispatchPaint({ DATA: payload }));
        dispatch(getUserPaintSystemPiping({ status: '' }));
     
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [selectValues?.report_no, currentPage,limit,search]);

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
                .filter(item => item.isGenerateSurfaceOffer !== true)
                .map(item => ({
                    report_no: dispatch.report_no,
                    dispatch_id: dispatch._id,
                    
                    piping_class: item.piping_class,
                    piping_class: item.piping_class_id,
                    service_id:item.service_id,
                    service:item.service,
                    piping_material_specification: item.piping_material_specification,
                    piping_material_specification_id:item.piping_material_specification_id,
                    qty: item.qty,
                    
                    item_id: item.item_id,
                    item_name: item.item_name,
                    size1: item.size1,
                    thickness1: item.thickness1,
                    size2: item.size2,
                    thickness2: item.thickness2,
                    material_grade: item.material_grade,

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
        // data.sort((a, b) =>
        //     (a.drawing_no || "").localeCompare(b.drawing_no || "", undefined, {
        //         numeric: true,
        //     })
        // );

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

    useEffect(() => {
        console.log("🔥 useEffect triggered");
        console.log("drawings:", drawings);
        console.log("paints:", paints);

        if (
            !Array.isArray(drawings) ||
            drawings.length === 0 ||
            !Array.isArray(paints)
        ) {
            return;
        }

        const drawing = drawings.find(
            d => d.paint_system_id || d.paint_system
        );

        console.log("🎯 selected drawing:", drawing);

        if (!drawing) {
            console.log("❌ no drawing with paint system");
            return;
        }

        const paintSystemId =
            typeof drawing.paint_system_id === "object"
                ? drawing.paint_system_id?._id
                : drawing.paint_system_id;

        console.log("🆔 paintSystemId:", paintSystemId);

        const paintFromStore = Array.isArray(paints)
            ? paints.find(p => p._id === paintSystemId)
            : null;

        console.log("🏪 paintFromStore:", paintFromStore);

        const finalPaint = {
            ...(paintFromStore || drawing.paint_system || {}),
            surface_preparation: drawing.surface_preparation ?? "",
            profile_requirement: drawing.profile_requirement ?? "",
            salt_test: drawing.salt_test ?? "",
            prime_paint: drawing.prime_paint ?? "",
            primer_app_method: drawing.primer_app_method ?? "",
            primer_dft_range: drawing.primer_dft_range ?? "",
            paint_manufacturer: drawing.paint_manufacturer ?? "",
            paint_system_id: drawing.paint_system ?? "",
        };

        console.log("FINAL PAINT DATA (MERGED):", finalPaint);

        setPaintData({
            paint_system_id: finalPaint.paint_system_id,
            paint_system_no: finalPaint.paint_system_no || drawing.paint_system_no || "",
            surface_preparation: finalPaint.surface_preparation,
            profile_requirement: finalPaint.profile_requirement,
            salt_test: finalPaint.salt_test,
            prime_paint: finalPaint.prime_paint,
            primer_app_method: finalPaint.primer_app_method,
            paint_manufacturer: finalPaint.paint_manufacturer,
            primer_dft_range: finalPaint.primer_dft_range,
        });

    }, [drawings, paints]);


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
    paint_system_id: row.paint_system_id?._id || row.paint_system_id,
    surface_no: row.report_no,
    items: [
        {
            dispatch_id: row.dispatch_id || "",
            dispatch_no: row.report_no || "",
            item_id: row.item_id || "",
            item_name: row.item_name || "",
            material_grade: row.material_grade || "",

            piping_class: row.piping_class || "",
            service_id: row.service_id || "",
            piping_material_specification_id: row.piping_material_specification_id || "",
            qty: Number(row.qty || 0),
            surface_balance_qty: Number(row.qty || 0),
            surface_used_qty: 0,
            moved_next_step: 0,
            remarks: "",
        }
    ]
};
        try {
            const res = await axios.post(
                `${V_URL}/user/piping-manage-multi-stock-surface-offer`,
                payload,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.data?.success) {
                toast.error(res.data?.message);
                return;
            }

            toast.success(res.data.message);
            setRefreshTable(prev => prev + 1);

            // 🔹 Fetch updated surface offers
            console.log("row.report_no", row.report_no);
            console.log("row.dispatch_id", row.dispatch_id);
            const multiSurfaceData = await dispatch(
                getPipingMultiStockSurface(row.report_no, row.dispatch_id)
            ).unwrap();

            console.log("Updated surface data:", multiSurfaceData);

            // 🔹 IMPORTANT: get ALL matching surfaces (not just one)
            const matchedSurfaces = Array.isArray(multiSurfaceData)
                ? multiSurfaceData.filter(
                    s =>
                       
                        s.dispatch_id === row.dispatch_id
                )
                : [multiSurfaceData];

            // 🔹 Build submit items
            const savedItems = matchedSurfaces.map(surface => ({
                dispatch_no: row.report_no,
                piping_class: row.piping_class,
                 service_id:row.service_id,
                    piping_material_specification_id:row.piping_material_specification_id,
                qty: Number(surface.qty || row.qty || 0),
                surface_balance_qty: Number(
                    surface.surface_balance_qty || row.qty || 0
                ),
                surface_used_qty: 0,
                moved_next_step: 0,
                paint_system_id: row.paint_system_id || null,
                dispatch_id: row.dispatch_id,
                report_no: row.report_no,
                item_id: row.item_id || null,
                item_name: row.item_name || "",
                material_grade: row.material_grade || "",

                surface_no: row.surface_no || "",
                surface_offer_id: surface._id, // 👈 UNIQUE
              
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
                    project: localStorage.getItem("U_PROJECT_ID"),
                    page:currentPage,
                    limit,
                    search
                }

          
        dispatch(getPipingMultiStockDispatchPaint({
           ...refetch,
            // project:localStorage.getItem("U_PROJECT_ID")
        }))

        } catch (error) {
            console.error("Surface offer API error:", error);
            toast.error(error.res?.data?.message);
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
                dispatch_id: item.dispatch_id || null,
               
                piping_class: item.piping_class || "",
                service_id: item.service_id,
                piping_material_specification_id: item.piping_material_specification_id,
                dispatch_no: item.dispatch_no || item.report_no || "",
                qty: item.qty || 0,
                surface_balance_grid_qty: item.surface_balance_qty || 0,
                surface_used_grid_qty: item.surface_used_grid_qty || 0,
                moved_next_step: item.moved_next_step || 0,
                remarks: item.remarks || "",
                item_name: item.item_name || "",
                item_id: item.item_id || null,
               
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
           formData.append(
    'paint_system_id',
    paintData?._id || paintData?.paint_system_id || ""
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

            const myurl = `${V_URL}/user/piping-add-multi-stock-surface-offer`;
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response?.data?.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/piping/user/stock-surface-primer-management');
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
                            { name: "Surface & Primer Offer List", link: "/piping/user/stock-surface-primer-management", active: false },
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

                                <SurfaceItemTable
                                    is_dispatch={true}
                                    tableTitle={'Item List'}
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

export default MultiManageStockSurface