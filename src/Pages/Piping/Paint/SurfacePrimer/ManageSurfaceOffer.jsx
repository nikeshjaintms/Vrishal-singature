import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { getDispatchNotes } from '../../../../Store/Store/DispatchNote/GetDispatchNote';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import SurfaceFields from './SurfacePrimerComponents/SurfaceFields';
import WeatherCondition from '../WeatherCondition/WeatherCondition';
import Footer from '../../Include/Footer';
import { PRODUCTION, V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageSurfaceOffer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dispatchNotes, setDispatchNotes] = useState([]);
  const [surfaceOffer, setSurfaceOffer] = useState({});
  const [weatherData, setWeatherData] = useState([]);
  const [surfaceData, setSurfaceData] = useState({});
  const [paintData, setPaintData] = useState(null);
  const [disable, setDisable] = useState(false);
  const validateSurfaceData = useRef(null);
  const validateWeather = useRef(null);
  const [error, setError] = useState({});
  const data = location.state;
  const [surfaceDraw, setSurfaceDraw] = useState([]);

  useEffect(() => {
    if (data) {
      setSurfaceOffer({
        drawing_no: data?.drawing_id?._id,
        procedure_no: data?.procedure_no?._id,
        dispatchNo: data?.dispatch_note?._id,
      });
    }
  }, [data]);

  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getUserProcedureMaster({ status: 'true' }));
    dispatch(getDispatchNotes())
  }, []);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data);
  const procedureData = useSelector((state) => state?.getUserProcedureMaster?.user?.data);
  const dispatchNoteData = useSelector((state) => state?.getDispatchNotes?.user?.data);

  useEffect(() => {
    const filterDrawing = dispatchNoteData?.map((di) => di?.drawing_id?._id);
    const matchData = drawData?.filter((pr) => filterDrawing?.includes(pr?._id) && pr?.project?._id === localStorage.getItem('U_PROJECT_ID'));
    setSurfaceDraw(matchData || []);

    const filterDispatchNote = dispatchNoteData?.filter(note => note.drawing_id?._id === surfaceOffer.drawing_no);
    setDispatchNotes(filterDispatchNote);

    const findPaint = filterDispatchNote?.find((di) => di?._id === surfaceOffer.dispatchNo);
    setPaintData(findPaint?.paint_system);
  }, [surfaceOffer.drawing_no, surfaceOffer.dispatchNo, dispatchNoteData, drawData]);

  const handleWeatherData = (weData) => {
    setWeatherData(weData);
  };
  const handleSurfaceData = (srData) => {
    setSurfaceData(srData);
  };

  const handleChange = (e, name) => {
    setSurfaceOffer({ ...surfaceOffer, [name]: e.target.value });
  }

  const handleSubmit = () => {
    if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateSurfaceData.current && validateSurfaceData.current()) {
      const myurl = `${V_URL}/user/manage-surface-primer`;
      const formData = new URLSearchParams();
      formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
      formData.append('drawing_id', surfaceOffer.drawing_no);
      formData.append('procedure_no', surfaceOffer.procedure_no);
      formData.append('dispatch_note', surfaceOffer.dispatchNo);

      formData.append('original_status', surfaceData.originalStatus);
      formData.append('metal_condition', surfaceData.metalCondition);
      formData.append('metal_rust_grade', surfaceData.metalRustGrade);
      formData.append('blasting_date', surfaceData.blastingDate);

      formData.append('blasting_method', surfaceData.blastingMethod);
      formData.append('abrasive_type', surfaceData.abrasive_type);
      formData.append('dust_level', surfaceData.dustLevel);
      formData.append('primer_date', surfaceData.primerDate);
      formData.append('time', surfaceData.time);
      formData.append('shelf_life', surfaceData.shelfLife);
      formData.append('manufacture_date', surfaceData.manufactureDate);
      formData.append('paint_batch_base', surfaceData.paintBatchBase);
      formData.append('paint_batch_hardner', surfaceData.paintBatchHardner);
      formData.append('remarks', surfaceData.remark || '');

      formData.append('weather_condition', JSON.stringify(weatherData));
      if (data?._id) {
        formData.append('id', data?._id);
      }
      setDisable(true);
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/piping/user/surface-primer-management');
        } else {
          toast.error(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        console.log(error, "error");
        toast.error(error?.response?.data?.message);
        setDisable(false);
      })
    }
  };

  const validation = () => {
    let isValid = true;
    let err = {};

    if (!surfaceOffer?.drawing_no) {
      isValid = false;
      err['drawing_no_err'] = "Please select drawing";
    }
    if (!surfaceOffer?.procedure_no) {
      isValid = false;
      err['procedure_no_err'] = "Please select procedure no";
    }
    if (!surfaceOffer?.dispatchNo) {
      isValid = false;
      err['dispatchNo_err'] = "Please select dispatch note no.";
    }
    setError(err)
    return isValid;
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawOptions = surfaceDraw?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id,
  }));

  const procedureOptions = procedureData?.map(procedure => ({
    label: procedure.vendor_doc_no,
    value: procedure._id,
  }));

  const dispatchNoteOptions = dispatchNotes?.map(note => ({
    label: note.lot_no,
    value: note._id,
  }));

  const weatherActivity = ['Blasting / Surf. Prep.', 'Primer Application'];

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/surface-primer-management">Surface Preparation & Primer List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Surface Preparation & Primer</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h4>{data?._id ? 'Edit' : 'Add'} Surface Preparation & Primer</h4>
                  <div className="row mt-4">
                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms custom-select-wpr">
                        <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                        <Dropdown
                          options={drawOptions}
                          value={surfaceOffer.drawing_no}
                          onChange={(e) => handleChange(e, 'drawing_no')}
                          filter placeholder='Select Drawing No'
                          className='w-100'
                        />
                        <div className='error'>{error.drawing_no_err}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms custom-select-wpr">
                        <label> Procedure No.<span className="login-danger">*</span></label>
                        <Dropdown
                          options={procedureOptions}
                          value={surfaceOffer.procedure_no}
                          filter onChange={(e) => handleChange(e, 'procedure_no')}
                          placeholder='Select Procedure No'
                          className='w-100'
                        />
                        <div className='error'>{error.procedure_no_err}</div>
                      </div>
                    </div>

                    {surfaceOffer.drawing_no && (
                      <div className="col-12 col-md-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> DispatchNote No.<span className="login-danger">*</span></label>
                          <Dropdown
                            options={dispatchNoteOptions}
                            value={surfaceOffer.dispatchNo}
                            filter onChange={(e) => handleChange(e, 'dispatchNo')}
                            placeholder='Select Dispatch Note No'
                            className='w-100'
                          />
                          <div className='error'>{error.dispatchNo_err}</div>
                        </div>
                      </div>
                    )}

                    {data?._id && (
                      <div className="col-12 col-md-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Voucher No.</label>
                          <input className='form-control' value={data?.voucher_no} readOnly />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(surfaceOffer?.drawing_no && surfaceOffer?.dispatchNo) && (
            <>
              <WeatherCondition
                weatherActivity={weatherActivity}
                handleWeatherData={handleWeatherData}
                handleSubmit={handleSubmit}
                validateWeather={validateWeather}
                weatherData={data?.weather_condition}
              />

              <SurfaceFields
                is_inspection={false}
                paintData={paintData}
                handleSurfaceData={handleSurfaceData}
                validateSurfaceData={validateSurfaceData}
                edit_data={data}
              />
            </>
          )}

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="doctor-submit text-end">
                    {localStorage.getItem('ERP_ROLE') === PRODUCTION ? (
                      <button className="btn btn-primary" type='button' onClick={handleSubmit} disabled={disable}>
                        {disable ? 'Processing...' : (data?._id ? 'Update' : 'Submit')}
                      </button>
                    ) : (
                      <button className="btn btn-primary" type='button' onClick={() => navigate('/piping/user/surface-primer-management')}>
                        Back
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManageSurfaceOffer;
