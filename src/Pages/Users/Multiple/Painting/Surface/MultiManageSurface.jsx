import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
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
import { getDispatchNotes } from '../../../../../Store/MutipleDrawing/DispatchNote/GetDisptchNote';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';
import { getMultiDispatchPaint } from '../../../../../Store/MutipleDrawing/MultiSurface/GetMultiDispatchNotePaint';
import { checkSurfacePaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import { getMultiSurfaceOfferViewPage } from "../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaceOfferViewPage";
import AddSufaceDrawingForm from './Components/AddSufaceDrawingForm';
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
    const [dispatchSite, setDispatchSite] = useState([])
    const [selectValues, setSelectValues] = useState({
        paint_no: '',
        dispatch_site: '',
        report_no: ''
    });
    const [paintDefaultData, setPaintDefaultData] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [surfacedata, setSurfaceData] = useState([]);
    const [paintData, setPaintData] = useState(null);
    const [procedure, setProcedure] = useState({ procedure_no: '' });
    const validateWeather = useRef(null);
    const weatherActivity = ['Blasting / Surf. Prep.', 'Primer Application'];
    const validateSurfaceData = useRef(null);
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [lockedDate, setLockedDate] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    // const [data, setData] = useState([]);
      const [drawingItems, setDrawingItems] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editItem, setEditItem] = useState({});
     const [editeMode, setEditeMode] = useState(false);
    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);

    const handleWeatherData = (weData) => {
        setWeatherData(weData);
    };
    const handleSurfaceData = (srData) => {
        setSurfaceData(srData);
    };

//       const handleAddMore = (item) => {
//     setData((prevData) => {
//       return [...prevData, item];
//     });
//   };

  const handleModalClose = () => {
    setModalOpen(false);
  };
    const multiDis = useSelector((state) => state.getDispatchNotes?.user?.data?.data);
    
  
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const multiDispatchPaintData = useSelector((state) => state?.getMultiDispatchPaint?.user?.data?.data);

    useEffect(() => {
        if (multiDispatchPaintData?.length > 0) {
            const closestDate = getClosestCreatedAtDate(multiDispatchPaintData);
            setLockedDate(closestDate);
        }
    }, [multiDispatchPaintData]);

    useEffect(() => {
        if (selectValues?.paint_no) {
            const filteredEntities = paintDefaultData?.filter(en =>
                en.items.some(item => item.paint_system_id === selectValues.paint_no)
            );
            const reportNo = [...new Set(filteredEntities.map(en => en.report_no))];
           
            const dispatchSiteData = [...new Set(filteredEntities.map(en => en.dispatch_site))];
            setReportNo(reportNo);
            setDispatchSite(dispatchSiteData);
        } else {
            setReportNo([]);
            setDispatchSite([]);
        }
    }, [selectValues?.paint_no, paintDefaultData]);

    useEffect(() => {
        setSelectValues({
            ...selectValues,
            report_no: '',
            dispatch_site: ''
        });
    }, [selectValues?.paint_no]);


    useEffect(() => {
        if (data?.paint_system_id) {
            setSelectValues({ ...selectValues, paint_no: data?.paint_system_id });
            setWeatherData(data?.weather_data);
            setWeatherTime({ startTime: data?.start_time || "", endTime: data?.end_time || "" })
            setProcedure({ procedure_no: data?.procedure_id });
        }
    }, [data]);

    useEffect(() => {
        const payload = {
            paint_system_id: selectValues?.paint_no,
            report_no: selectValues?.report_no,
            dispatch_site: selectValues?.dispatch_site
        }
        dispatch(getDispatchNotes({ DATA: payload }));
        dispatch(getMultiDispatchPaint({ DATA: payload }));
        dispatch(getUserPaintSystem({ status: '' }));
        dispatch(getDrawing());
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [selectValues?.paint_no, selectValues?.report_no, selectValues?.dispatch_site]);

    useEffect(() => {
        if (selectValues?.paint_no) {
            const paintData = paints?.find(item => item._id === selectValues?.paint_no)

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
    }, [selectValues?.paint_no, paints]);
    
    const validation = () => {
        let isValid = true;
        let err = {};
        if (!procedure?.procedure_no) {
            isValid = false;
            err['procedure_no_err'] = "Please select procedure no";
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

    useEffect(() => {
        const mergeDispatchData = (dataArray) => {
            
            const map = new Map();
             const array = Array.isArray(dataArray) ? dataArray : [];
            array?.forEach((record) => {
                record.items.forEach((item) => {
                    if (!map.has(item.drawing_no)) {
                        map.set(item.drawing_no, {
                            drawing_no: item.drawing_no,
                            rev: item.rev,
                            assembly_no: item.assembly_no,
                            assembly_quantity: item.assembly_quantity,
                            sheet_no: item.sheet_no,
                            report_no: record.report_no,
                            dispatch_site: record.dispatch_site,
                            unit: item.unit_area,
                            items: [],
                        });
                    }
                    map.get(item.drawing_no).items.push(item);
                });
            });
            return Array.from(map.values());
        };
        setEntity(mergeDispatchData(multiDis));
        setPaintDefaultData(mergeDispatchData(multiDispatchPaintData));
    }, [multiDis, selectValues?.paint_no, multiDispatchPaintData]);

    // const checkCompletedDraw = async () => {
    //     const res = await checkSurfacePaint(entity);
    //     setMatchDatas(res.matchData);
    //     setUnMatchDatas(res.unmatchData);
    // }

       const checkCompletedDraw = async () => {
            if (entity && entity.length > 0) {
                console.log("Running checkMioPaint with entity:", entity);
               const res = await checkSurfacePaint(entity);
                setMatchDatas(res.matchData);
                setUnMatchDatas(res.unmatchData);
                console.log("checkMioPaint result:", res);
            } else {
                console.log("No entity data available for checkMioPaint");
                setMatchDatas([]);
                setUnMatchDatas([]);
            }
        }

    useEffect(() => {
        checkCompletedDraw();
    }, [entity]);

    const commentsData = useMemo(() => {
        // let computedComments = entity || [];

         let computedComments = matchDatas?.length > 0 ? matchDatas : (entity || []);
        // let computedComments = matchDatas || [];
        if (!selectValues?.paint_no) {
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
                    dr?.sheet_no?.toLowerCase()?.includes(search.toLowerCase())
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
    }, [search, limit, currentPage, entity, selectValues?.paint_no, matchDatas]);


    const handleAddToArr = (data) => {
        setShowItem(true);
        setMultiSurfaceData(data);
    }

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
    const ReportOptions = reportNo?.map(procedure => ({
        label: procedure,
        value: procedure,
    }));
    const SiteOptions = dispatchSite?.map(procedure => ({
        label: procedure,
        value: procedure,
    }));

    const handleSubmit = () => {
        let updatedData = submitArr;
        if (updatedData.length === 0) {
            toast.error("Please add drawings")
            return;
        }

        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateSurfaceData.current && validateSurfaceData.current()) {
            // const filteredData = updatedData.map((item) => ({
            //     "surface_offer_id": item._id,
            //     "surface_no": item.surface_no,
            //     "main_id": item.main_id,
            //     "drawing_id": item.drawing_id,
            //     "grid_id": item.grid_id,
            //     "surface_balance_grid_qty": item.surface_balance_grid_qty,
            //     "surface_used_grid_qty": item.surface_used_grid_qty,
            //     "moved_next_step": item.moved_next_step,
            //     "remarks": item.remarks || null
            // }));
const filteredData = updatedData.map((item) => {
  const isDrawingWise = item.main_id && item.drawing_id && item.grid_id;

  if (isDrawingWise) {
    return {
      surface_offer_id: item._id,
      surface_no: item.surface_no,
      main_id: item.main_id,
      drawing_id: item.drawing_id,
      grid_id: item.grid_id,
      surface_balance_grid_qty: item.surface_balance_grid_qty || 0,
      surface_used_grid_qty: item.surface_used_grid_qty || 0,
      moved_next_step: item.moved_next_step || 0,
      unit_assembly_weight: item.unit_assembly_weight || 0,
      total_assembly_weight: item.total_assembly_weight || 0,
      remarks: item.remarks || "",
    };
  } else {
    return {
     _id: item._id || "",
      item_name: item.item_name || "",
      drawing_no: item.drawing_no || "",
      grid_no: item.grid_no || "",
      dispatch_no: item.dispatch_no || "",
      surface_balance_grid_qty: item.surface_balance_grid_qty || 0,
      surface_used_grid_qty: item.surface_used_grid_qty || 0,
      moved_next_step: item.moved_next_step || 0,
      unit_assembly_weight: item.unit_assembly_weight || 0,
      total_assembly_weight: item.total_assembly_weight || 0,
      remarks: item.remarks || "",
    };
  }
});

            setDisable(true);
            const formData = new URLSearchParams();
            formData.append('items', JSON.stringify(filteredData));
            formData.append('weather_condition', JSON.stringify(weatherData));
            formData.append('procedure_no', procedure?.procedure_no);
            formData.append('original_status', surfacedata?.originalStatus);
            formData.append('metal_condition', surfacedata?.metalCondition);
            formData.append('metal_rust_grade', surfacedata?.metalRustGrade);
            formData.append('paint_system_id', selectValues?.paint_no);
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

            formData.append('offer_notes', surfacedata?.remark);
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem("PAY_USER_PROJECT_NAME"));
            formData.append('project_id', localStorage.getItem("U_PROJECT_ID"));

            formData.append('start_time', weatherTime.startTime);
            formData.append('end_time', weatherTime.endTime);

            const myurl = `${V_URL}/user/add-multi-surface-offer`;
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response?.data?.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/user/project-store/surface-primer-management');
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
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Surface & Primer Offer List", link: "/user/project-store/surface-primer-management", active: false },
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
                                                                <label> Paint System No.<span className="login-danger">*</span></label>
                                                                <Dropdown
                                                                    options={PaintOptions}
                                                                    value={selectValues?.paint_no}
                                                                    filter onChange={(e) => selcetvalueChange(e, 'paint_no')}
                                                                    placeholder='Paint System No.'
                                                                    className='w-100'
                                                                />
                                                            </div >
                                                        </div >
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <div className=" mx-2">
                                                            <div className="input-block local-forms custom-select-wpr">
                                                                <label> Report No.<span className="login-danger">*</span></label>
                                                                <Dropdown
                                                                    options={ReportOptions}
                                                                    value={selectValues?.report_no}
                                                                    filter onChange={(e) => selcetvalueChange(e, 'report_no')}
                                                                    placeholder='Select Report No.'
                                                                    className='w-100'
                                                                />
                                                            </div >
                                                        </div >
                                                    </div>
                                                    <div className="col-12 col-md-4">
                                                        <div className=" mx-2">
                                                            <div className="input-block local-forms custom-select-wpr">
                                                                <label> Dispatch Site.<span className="login-danger">*</span></label>
                                                                <Dropdown
                                                                    options={SiteOptions}
                                                                    value={selectValues?.dispatch_site}
                                                                    filter onChange={(e) => selcetvalueChange(e, 'dispatch_site')}
                                                                    placeholder='Select Dispatch Site'
                                                                    className='w-100'
                                                                />
                                                            </div >
                                                        </div >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <DrawingTable
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

                        {selectValues?.paint_no && (
                            <>
                                <SurfaceTable
                                    report_no={selectValues?.report_no}
                                     onAddItem={() => setModalOpen(true)}
                                     
                                    dispatch_site={selectValues?.dispatch_site}
                                    paintNo={selectValues?.paint_no}
                                    setSubmitArr={setSubmitArr}
                                    data={data}
                                    isEditMode={!!data?._id}
                                  
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
                        )}

                        <SubmitButton finalReq={data?.items} link='/user/project-store/surface-primer-management'
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