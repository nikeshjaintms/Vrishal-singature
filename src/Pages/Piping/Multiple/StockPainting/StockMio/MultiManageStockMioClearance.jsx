import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import WeatherCondition from '../../../StockPaint/StockWeatherCondition/StockWeatherCondition';
import SurfaceFields from '../../../StockPaint/StockSurfacePrimer/StockSurfacePrimerComponents/StockSurfaceFields';
import MioPaintFields from '../../../StockPaint/StockMio/StockMioPaintComponents/StockMioPaintFields';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import { getUserPaintSystemPiping } from '../../../../../Store/Piping/PaintSystem/PaintSystem';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import MioClearanceTable from './Components/StockMioClearanceTable';

const MultiManageMioClearance = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [disable, setDisable] = useState(false);
  const [mioOffer, setMioOffer] = useState({});
  const [error, setError] = useState({});
  const [paintData, setPaintData] = useState(null);
  const [search, setSearch] = useState('');
  const [limit, setlimit] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const validateMioData = useRef(null);
  const validateWeather = useRef(null);

  const [weatherTime, setWeatherTime] = useState({ startTime: '', endTime: '' })
  const [filteredWeather, setFilteredWeather] = useState([]);

  const data = location.state;
  console.log("data", data)
  useEffect(() => {
    if (data?._id) {
      const updatedItems = data?.items?.map(item => ({
        ...item,
        piping_class_name: data?.piping_class_name || '',
        size1: item.size1 || data?.size1 || '',
        thickness1: item.thickness1 || data?.thickness1 || '',
        size2: item.size2 || data?.size2 || '',
        thickness2: item.thickness2 || data?.thickness2 || '',
      }));
      setTableData(updatedItems);
      // setProcedure({ procedure_no: data?.procedure_id })
    }
  }, [data]);

  useEffect(() => {
    dispatch(getUserPaintSystemPiping({ status: '' }));
    dispatch(getUserProcedureMaster({ status: 'true' }));
  }, []);

  const paints = useSelector((state) => state?.getUserPaintSystemPiping?.user?.data);

  useEffect(() => {
    if (data) {
      // Prioritize fields directly from the data object if they exist
      if (data?.mio_paint || data?.mio_app_method || data?.mio_dft_range || data?.paint_manufacturer) {
        setPaintData({
          mio_paint: data?.mio_paint || '',
          mio_app_method: data?.mio_app_method || '',
          paint_manufacturer: data?.paint_manufacturer || '',
          mio_dft_range: data?.mio_dft_range || '',
        });
      } else {
        // Fallback to searching in paints array if not found in data
        const paintId = data?.paint_system_id || data?.items?.[0]?.paint_system_id;
        if (paintId && paints) {
          const foundPaint = paints.find(item => item._id === paintId);
          if (foundPaint) {
            setPaintData({
              mio_paint: foundPaint?.mio_paint || '',
              mio_app_method: foundPaint?.mio_app_method || '',
              paint_manufacturer: foundPaint?.paint_manufacturer?.name || '',
              mio_dft_range: foundPaint?.mio_dft_range || '',
            });
          }
        }
      }

      setWeatherTime({
        startTime: data?.start_time || '',
        endTime: data?.end_time || '',
      });
    }
  }, [data, paints]);


  const commentsData = useMemo(() => {
    let computedComments = tableData || [];
    if (search) {
      computedComments = computedComments?.filter(
        (i) =>
          i?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
          i?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
          i?.item_name?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    // return computedComments?.slice(
    //   (currentPage - 1) * limit,
    //   (currentPage - 1) * limit + limit
    // );
    return computedComments;
  }, [currentPage, search, limit, tableData]);

  const handleWeatherData = (weData) => {
    setWeatherData(weData);
  };

  const handleMioOffer = (mData) => {
    setMioOffer(mData);
  }

  const handleSubmit = (submitData = {}) => {
    if (weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateMioData.current && validateMioData.current()) {

      let updatedData = tableData;
      let isValid = true;

      updatedData?.forEach(item => {
        if (item.average_dft_mio === '' || item.average_dft_mio === undefined) {
          isValid = false;
          toast.error(`Please Enter Average DFT Primer for ${item?.drawing_no || item?.item_name}`);
        }
        if (item.is_accepted === '' || item.is_accepted === undefined || item.is_accepted === 1) {
          isValid = false;
          toast.error(`Please accept or reject for ${item?.drawing_no || item?.item_name}`);
        }
      })

      if (!isValid) {
        return;
      }

      const filteredData = updatedData?.map(item => ({
        _id: item._id,
        drawing_id: item.drawing_id,
        item_id: item.item_id,
        spool_id:item.spool_id,
        surface_id: item.surface_id,
        dispatch_id: item.dispatch_id,
        average_dft_mio: item.average_dft_mio, // keep name (mapped in backend)
        qty: item.qty,
        is_accepted: item.is_accepted ? 2 : 3, // MUST be 2 or 3
      }))

      const myurl = `${V_URL}/user/piping-verify-multi-stock-mio`;
      const formData = new URLSearchParams();
      formData.append('id', data._id);
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
      formData.append('qc_notes', mioOffer.qc_note || '');
      formData.append('items', JSON.stringify(filteredData))
      // ✅ REQUIRED FIX
      const isIrn = submitData?.isIrn ?? data?.isIrn ?? false;
      const isFp = submitData?.isFp ?? data?.isFp ?? false;

      formData.append('isIrn', isIrn);
      formData.append('isFp', isFp);

      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/piping/user/stock-mio-clearance-management');
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const weatherActivity = ['MIO Coat']

  return (
    <>
      <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
        <Header handleOpen={handleOpen} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content">
            <PageHeader breadcrumbs={[
              { name: "Dashboard", link: "/piping/user/dashboard", active: false },
              { name: "MIO Clearance List", link: "/piping/user/stock-mio-clearance-management", active: false },
              { name: `${data?._id ? 'Edit' : 'Add'} MIO Details`, active: true }
            ]} />

            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <h4>Add MIO Clearance Details</h4>
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
                      {/* <div className="col-12 col-md-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Paint System No.</label>
                          <input type="text" className="form-control"
                            readOnly value={data?.paint_system_no} rows={1} />
                        </div>
                      </div> */}
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
              data={data}
              setFilteredWeather={setFilteredWeather}
              weatherTime={weatherTime}
              setWeatherTime={setWeatherTime}
            />

            <MioPaintFields
              is_inspection={false}
              paintData={paintData}
              handleMioOffer={handleMioOffer}
              validateMioData={validateMioData}
              edit_data={data}
            />

            <MioClearanceTable
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

            <SubmitButton disable={disable} handleSubmit={handleSubmit} showMioClearance={true}
              link={'/piping/user/stock-mio-clearance-management'} buttonName={'Generate MIO Clearance'} />

          </div>
        </div>

      </div>
    </>
  )
}

export default MultiManageMioClearance