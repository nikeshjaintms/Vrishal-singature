import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';
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
import { getMultiSurfaceMio } from '../../../../../Store/MutipleDrawing/MultiMIO/GetMultiSurfaceMio';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import MioModal from './Components/MioModal';
import { getMultiSurfaceOfferMio } from '../../../../../Store/MutipleDrawing/MultiMIO/GetSurfaceMioOffer';
import MioTable from './Components/MioTable';
import { checkMioPaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import AddMioDrawingForm from './AddMioDrawingForm';
const MultiManageMio = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [reportNo, setReportNo] = useState([]);
    const [dispatchSite, setDispatchSite] = useState([])

    const [mioOffer, setMioOffer] = useState({
        procedure_no: '',
        paint_no: '',
        report_no: '',
        dispatch_site: ''
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
    const [isLoading, setIsLoading] = useState(false);
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
    const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
    const [filteredWeather, setFilteredWeather] = useState([]);
    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);
    const [lockedDate, setLockedDate] = useState("");

    useEffect(() => {
        if (data?.paint_system_id) {
            setMioOffer({ ...mioOffer, paint_no: data?.paint_system_id, procedure_no: data?.procedure_id });
            setWeatherData(data?.weather_data);
            setWeatherTime({ startTime: data?.start_time || "", endTime: data?.end_time || "" })
        }
    }, [data]);

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
        dispatch(getUserPaintSystem({ status: '' }));
        
        if (mioOffer?.paint_no) {
            setIsLoading(true);
            const payload = {
                paint_system_id: mioOffer?.paint_no,
                report_no: mioOffer?.report_no,
                dispatch_site: mioOffer?.dispatch_site
            }
            dispatch(getMultiSurfaceMio({ DATA: payload }));
            dispatch(getMultiSurfaceOfferMio({ DATA: payload }));
        }
    }, [mioOffer?.paint_no, mioOffer?.report_no, mioOffer?.dispatch_site]);

    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    // console.log()
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const getMultiSurfaceData = useSelector((state) => state?.getMultiSurfaceOfferMio?.user?.data?.data);
    const getMultiSurfaceMioData = useSelector((state) => state?.getMultisurfaceMio?.user?.data?.data);

    useEffect(() => {
        if (getMultiSurfaceData?.length > 0) {
            const closestDate = getClosestCreatedAtDate(getMultiSurfaceData);
            setLockedDate(closestDate);
        }
    }, [getMultiSurfaceData]);

    useEffect(() => {
        if (mioOffer?.paint_no) {
            const filteredEntities = getMultiSurfaceData?.filter(en => en.paint_system_id === mioOffer.paint_no);

            const reportNo = [...new Set(filteredEntities?.flatMap(en => en?.items?.map(o => o.dispatch_report)))];
            const dispatchSiteData = [...new Set(filteredEntities?.flatMap(en => en?.items?.map(e => e.dispatch_site)))];

            setReportNo(reportNo);
            setDispatchSite(dispatchSiteData);
        } else {
            setReportNo([]);
            setDispatchSite([]);
        }
    }, [mioOffer?.paint_no, getMultiSurfaceData]);

    useEffect(() => {
        if (mioOffer?.paint_no) {
            setMioOffer(prev => ({ ...prev, report_no: '', dispatch_site: '' }));
        }
    }, [mioOffer?.paint_no]);

    useEffect(() => {
        if (mioOffer?.paint_no) {
            const paintData = paints?.find(item => item._id === mioOffer?.paint_no)
            setPaintData({
                mio_paint: paintData?.mio_paint,
                mio_app_method: paintData?.mio_app_method,
                paint_manufacturers: paintData?.paint_manufacturer?.name,
                mio_dft_range: paintData?.mio_dft_range,
            });
        }
    }, [mioOffer?.paint_no, paints]);

    useEffect(() => {
        const mergeDispatchData = (dataArray) => {
            console.log("mergeDispatchData input:", dataArray);
            
            if (!Array.isArray(dataArray)) {
                console.log("Data is not an array:", typeof dataArray);
                return [];
            }
            
            if (dataArray.length === 0) {
                console.log("Data array is empty");
                return [];
            }
            
            const map = new Map();
            
            dataArray.forEach((record, recordIndex) => {
                console.log(`Processing record ${recordIndex}:`, record);
                
                if (!record.items || !Array.isArray(record.items)) {
                    console.log(`Record ${recordIndex} has no items or items is not array:`, record);
                    return;
                }
                
                record.items.forEach((item, itemIndex) => {
                    console.log(`Processing item ${itemIndex} in record ${recordIndex}:`, item);
                    
                    if (!item.drawing_no) {
                        console.log(`Item ${itemIndex} has no drawing_no:`, item);
                        return;
                    }
                    
                    if (!map.has(item.drawing_no)) {
                        map.set(item.drawing_no, {
                            drawing_no: item.drawing_no,
                            rev: item.rev,
                            assembly_no: item.assembly_no,
                            assembly_quantity: item.assembly_quantity,
                            sheet_no: item.sheet_no,
                            report_no: record.report_no,
                            dispatch_site: record.dispatch_site,
                            items: [],
                        });
                    }
                    map.get(item.drawing_no).items.push(item);
                });
            });
            
            const result = Array.from(map.values());
            console.log("mergeDispatchData result:", result);
            return result;
        };

        console.log("getMultiSurfaceMioData:", getMultiSurfaceMioData);
        console.log("getMultiSurfaceData:", getMultiSurfaceData);
        
        const mergedEntity = mergeDispatchData(getMultiSurfaceMioData);
        const mergedFiltered = mergeDispatchData(getMultiSurfaceData);
        
        console.log("Merged entity:", mergedEntity);
        console.log("Merged filtered:", mergedFiltered);
        
        setEntity(mergedEntity);
        setFilteredData(mergedFiltered);
        
        // Reset loading state when data is received
        if (mergedEntity.length > 0 || mergedFiltered.length > 0) {
            setIsLoading(false);
        }
    }, [getMultiSurfaceData, mioOffer?.paint_no, getMultiSurfaceMioData]);

    
console.log("Entity before checkMioPaint:", entity);

    const checkCompletedDraw = async () => {
        if (entity && entity.length > 0) {
            console.log("Running checkMioPaint with entity:", entity);
            const res = await checkMioPaint(entity);
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
console.log("Match Datas:", matchDatas);

 const handleModalClose = () => {
    setModalOpen(false);
  };

    const commentsData = useMemo(() => {
        console.log("Computing commentsData with:", { matchDatas, entity, mioOffer });
        
        // Use matchDatas if available, otherwise fall back to entity
        let computedComments = matchDatas?.length > 0 ? matchDatas : (entity || []);
        
        console.log("Data sources:", {
            matchDatasLength: matchDatas?.length,
            entityLength: entity?.length,
            computedCommentsLength: computedComments?.length
        });
        
        // If no paint system is selected, return empty array
        if (!mioOffer?.paint_no) {
            console.log("No paint system selected, returning empty array");
            computedComments = [];
        }
        
        // Apply search filter
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
        
        console.log("Final commentsData:", paginatedData);
        return paginatedData;
    }, [search, limit, currentPage, entity, mioOffer?.paint_no, matchDatas]);
console.log("commentsData",commentsData);
    const handleChange = (e, name) => {
        setMioOffer({ ...mioOffer, [name]: e.target.value });
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

    const handleSubmit = () => {
        let updatedData = submitArr;
        if (updatedData.length === 0) {
            toast.error("Please add drawings");
            return;
        }

        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateMioData.current && validateMioData.current()) {
            
            // const filteredData = updatedData.map((item) => ({
            //     "mio_offer_id": item._id,
            //     "dispatch_id": item.dispatch_id,
            //     "main_id": item.main_id,
            //     "drawing_id": item.drawing_id,
            //     "grid_id": item.grid_id,
            //     "mio_balance_grid_qty": item.mio_balance_grid_qty,
            //     "mio_used_grid_qty": item.mio_used_grid_qty,
            //     "moved_next_step": item.moved_next_step,
            //     "remarks": item.remarks || null
            // }));

            const filteredData = updatedData.map((item) => {
  const isDrawingWise = item.main_id && item.drawing_id && item.grid_id;

  if (isDrawingWise) {
    // Drawing-wise MIO data
    return {
      mio_offer_id: item._id,
      dispatch_id: item.dispatch_id,
      main_id: item.main_id,
      drawing_id: item.drawing_id,
      grid_id: item.grid_id,
      mio_balance_grid_qty: item.mio_balance_grid_qty || 0,
      mio_used_grid_qty: item.mio_used_grid_qty || 0,
      moved_next_step: item.moved_next_step || 0,
      remarks: item.remarks || "",
    };
  } else {
    // Raw (manual) MIO data
    return {
         _id: item._id || "",
      item_name: item.item_name || "",
      drawing_no: item.drawing_no || "",
      grid_no: item.grid_no || "",
      dispatch_no: item.dispatch_no || "",
      mio_balance_grid_qty: item.mio_balance_grid_qty || 0,
      mio_used_grid_qty: item.mio_used_grid_qty || 0,
      moved_next_step: item.moved_next_step || 0,
      remarks: item.remarks || "",
    };
  }
});

            setDisable(true);
            const myurl = `${V_URL}/user/add-multi-mio-offer`;
            const formData = new URLSearchParams();
            formData.append('items', JSON.stringify(filteredData));
            formData.append('weather_condition', JSON.stringify(weatherData))
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('project_id', localStorage.getItem("U_PROJECT_ID"));
            formData.append('procedure_no', mioOffer.procedure_no);
            formData.append('paint_system_id', mioOffer.paint_no);
            formData.append('mio_date', mioData.mio_date);
            formData.append('time', mioData.time);
            formData.append('shelf_life', mioData.shelf_life);
            formData.append('manufacture_date', mioData.manufacture_date);
            formData.append('paint_batch_base', mioData.paint_batch_base);
            formData.append('paint_batch_hardner', mioData.paint_batch_hardner);
            formData.append('offer_notes', mioData.note || '');
            formData.append('remarks', mioOffer.remarks || '');
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
                    navigate('/user/project-store/mio-offer-management');
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
        setShowItem(true);
        setMultiMioData(data);
    }

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

    const weatherActivity = ['MIO Coat']

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                        { name: "MIO Offer List", link: "/user/project-store/mio-offer-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} MIO Offer`, link: "/user/project-store/mio-offer-management", active: false },
                    ]} />

                    {!data?._id && (
                        <>
                            {console.log("Rendering DrawingTable section, data._id:", data?._id, "commentsData length:", commentsData?.length)}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4>{data?._id ? 'Edit' : 'Add'} MIO Offer Details</h4>
                                            <div className="row mt-4">
                                                <div className="col-12 col-md-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Paint Syatem No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={paintOptions}
                                                            value={mioOffer.paint_no}
                                                            onChange={(e) => handleChange(e, 'paint_no')}
                                                            placeholder='Paint Syatem No'
                                                            className='w-100'
                                                            filter
                                                        />
                                                    </div>
                                                </div>
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
                                                <div className="col-12 col-md-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <div className="input-block local-forms custom-select-wpr">
                                                            <label> Dispatch Site.<span className="login-danger">*</span></label>
                                                            <Dropdown
                                                                options={SiteOptions}
                                                                value={mioOffer.dispatch_site}
                                                                filter onChange={(e) => handleChange(e, 'dispatch_site')}
                                                                placeholder='Select Dispatch Site'
                                                                className='w-100'
                                                            />
                                                        </div >
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
                            )}
                        </>
                    )}

                    {mioOffer?.paint_no && (
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
                                            <h4>{data?._id ? 'Edit' : 'Add'} Surface Preparation & Primer</h4>
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
                    )}
                    <SubmitButton finalReq={data?.items} link='/user/project-store/mio-offer-management'
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