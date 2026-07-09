import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';
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
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import { getMioList } from '../../../../../Store/MutipleDrawing/MultiFinalCoat/GetMio';
import { getMioFilterList } from '../../../../../Store/MutipleDrawing/MultiFinalCoat/GetMultiMio';
import FinalCoatTable from './Components/FinalCoatTable';
import FinalCoatModel from './Components/FinalCoatModel';
import FinalCoatsFields from '../../../Paint/FinalCoat/FinalCoatComponents/FinalCoatsFields';
import { checkFinalCoatPaint } from '../../../../../helper/hideDrawing';
import { getClosestCreatedAtDate } from '../../../../../helper/closeDate';
import AddFinalCoatDrawingForm from './Components/AddFinalCoatDrawingForm';
const ManageMultiFinalCoat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [reportNo, setReportNo] = useState([]);
    const [dispatchSite, setDispatchSite] = useState([])

    const [finalOffer, setFinalOffer] = useState({
        procedure_no: '',
        paint_no: '',
        report_no: '',
        dispatch_site: ''
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
        const payload = {
            paint_system_id: finalOffer?.paint_no,
            report_no: finalOffer?.report_no,
            dispatch_site: finalOffer?.dispatch_site
        }
        dispatch(getMioFilterList({ DATA: payload }));
        dispatch(getMioList({ DATA: payload }));
    }, [finalOffer?.paint_no, finalOffer?.report_no, finalOffer?.dispatch_site]);

    const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
    const getMultiMioData = useSelector((state) => state?.getMioListData?.user?.data?.data);
    const getMultiMioFilterData = useSelector((state) => state?.getMioFilterListData?.user?.data?.data);
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const multiDispatchPaintData = useSelector((state) => state?.getMultiDispatchPaint?.user?.data);
    

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
        if (finalOffer?.paint_no) {
            const filteredEntities = getMultiMioData?.filter(en => en.paint_system_id === finalOffer.paint_no);

            const reportNo = [...new Set(filteredEntities?.flatMap(en => en?.items?.map(o => o.dispatch_report)))];
            const dispatchSiteData = [...new Set(filteredEntities?.flatMap(en => en?.items?.map(e => e.dispatch_site)))];

            setReportNo(reportNo);
            setDispatchSite(dispatchSiteData);
        } else {
            setReportNo([]);
            setDispatchSite([]);
        }
    }, [finalOffer?.paint_no, getMultiMioData]);

    useEffect(() => {
        if (finalOffer?.paint_no) {
            setFinalOffer(prev => ({ ...prev, report_no: '', dispatch_site: '' }));
        }
    }, [finalOffer?.paint_no]);

    useEffect(() => {
        if (finalOffer?.paint_no) {
            const paintData = paints?.find(item => item._id === finalOffer?.paint_no)
            setPaintData({
                final_paint: paintData?.final_paint,
                final_paint_app_method: paintData?.final_paint_app_method,
                paint_manufacture: paintData?.paint_manufacturer?.name,
                final_paint_dft_range: paintData?.final_paint_dft_range,
            });
        }
    }, [finalOffer?.paint_no, paints]);

    useEffect(() => {
        const mergeDispatchData = (dataArray) => {
              if (!Array.isArray(dataArray)) return [];
            const map = new Map();
            dataArray?.forEach((record) => {
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
        setEntity(mergeDispatchData(getMultiMioFilterData));
        // setFilteredData(mergeDispatchData(getMultiMioFilterData));
    }, [getMultiMioData, finalOffer?.paint_no, getMultiMioFilterData]);

    const checkCompletedDraw = async () => {
        const res = await checkFinalCoatPaint(entity);
        setMatchDatas(res.matchData);
        setUnMatchDatas(res.unmatchData);
    }

    useEffect(() => {
        checkCompletedDraw();
    }, [entity]);

    const commentsData = useMemo(() => {
        // let computedComments = entity || [];  // for all data
         let computedComments = matchDatas || entity|| []; // for pending qty data
        if (!finalOffer?.paint_no) {
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
        let updatedData = submitArr;
        if (updatedData.length === 0) {
            toast.error("Please add drawings")
            return;
        }

        if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateFinalCoatData.current && validateFinalCoatData.current()) {
            // const filteredData = updatedData.map((item) => ({
            //     "fc_offer_id": item._id,
            //     "dispatch_id": item.dispatch_id,
            //     "main_id": item.main_id,
            //     "drawing_id": item.drawing_id,
            //     "grid_id": item.grid_id,
            //     "fc_balance_grid_qty": item.fc_balance_grid_qty,
            //     "fc_used_grid_qty": item.fc_used_grid_qty,
            //     "moved_next_step": item.moved_next_step,
            //     "remarks": item.remarks || null
            // }));


                        const filteredData = updatedData.map((item) => {
  const isDrawingWise = item.main_id && item.drawing_id && item.grid_id;

  if (isDrawingWise) {
    // Drawing-wise MIO data
    return {
      "fc_offer_id": item._id,
                "dispatch_id": item.dispatch_id,
                "main_id": item.main_id,
                "drawing_id": item.drawing_id,
                "grid_id": item.grid_id,
                "fc_balance_grid_qty": item.fc_balance_grid_qty,
                "fc_used_grid_qty": item.fc_used_grid_qty,
                "moved_next_step": item.moved_next_step,
                "remarks": item.remarks || null
    };
  } else {
    // Raw (manual) MIO data
    return {
         _id: item._id || "",
      item_name: item.item_name || "",
      drawing_no: item.drawing_no || "",
      grid_no: item.grid_no || "",
      dispatch_no: item.dispatch_no || "",
      fc_balance_grid_qty: item.fc_balance_grid_qty || 0,
      fc_used_grid_qty: item.fc_used_grid_qty || 0,
      moved_next_step: item.moved_next_step || 0,
      remarks: item.remarks || "",
    };
  }
});

            setDisable(true);
            const myurl = `${V_URL}/user/add-multi-final-coat-offer`;
            const formData = new URLSearchParams();
            formData.append('items', JSON.stringify(filteredData));
            formData.append('weather_condition', JSON.stringify(weatherData))
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('project_id', localStorage.getItem("U_PROJECT_ID"));
            formData.append('procedure_no', finalOffer.procedure_no);
            formData.append('paint_system_id', finalOffer.paint_no);
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
                    navigate('/user/project-store/final-coat-management');
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
        console.log(data, ';2222')
        setShowItem(true);
        setMultiFinalCoatData(data);
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
                        { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                        { name: "Final / Top Coating Offer List", link: "/user/project-store/final-coat-management", active: false },
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
                                                        <label> Paint Syatem No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={paintOptions}
                                                            value={finalOffer.paint_no}
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
                                                            value={finalOffer.report_no}
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
                                                                value={finalOffer.dispatch_site}
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

                    {
                        finalOffer?.paint_no && (
                            <>
                                <FinalCoatTable
                                    report_no={finalOffer?.report_no}
                                    dispatch_site={finalOffer?.dispatch_site}
                                    paintNo={finalOffer?.paint_no}
                                    setSubmitArr={setSubmitArr}
                                    data={data}
                                    isEditMode={!!data?._id}
                                    onAddItem={() => setModalOpen(true)}
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


                                       <AddFinalCoatDrawingForm
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
                                         paintNo={finalOffer?.paint_no}
                                        // paintNo={selectValues?.paint_no}
                                       
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
                        )
                    }
                    <SubmitButton finalReq={data?.items} link='/user/project-store/final-coat-management'
                        disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Final Coat'} />
                </div>
            </div>
            <FinalCoatModel
                report_no={finalOffer?.report_no}
                dispatch_site={finalOffer?.dispatch_site}
                paintNo={finalOffer?.paint_no}
                showItem={showItem}
                handleCloseModal={() => setShowItem(false)}
                title={'Drawing Grid List'}
                finalCoatdata={multiFinalCoatdata}
            />
        </div>
    )
}

export default ManageMultiFinalCoat