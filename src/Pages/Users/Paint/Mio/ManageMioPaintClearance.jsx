import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { Dropdown } from 'primereact/dropdown';
import WeatherCondition from '../WeatherCondition/WeatherCondition';
import MioPaintFields from './MioPaintComponents/MioPaintFields';
import { getUserMio } from '../../../../Store/Erp/Painting/Mio/GetMio';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageMioPaintClearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [disable, setDisable] = useState(false);
  const [mioOffer, setMioOffer] = useState({});
  const [error, setError] = useState({});
  const [weatherData, setWeatherData] = useState([]);
  const validateMioData = useRef(null);
  const validateWeather = useRef(null);
  const [selectedDraw, setSelectedDraw] = useState([]);
  const [offerObj, setOfferObj] = useState({});
  const [status, setStatus] = useState(null);
  const data = location.state;
  const [mioDraw, setMioDraw] = useState([]);

  useEffect(() => {
    if (data) {
      setMioOffer({
        drawing_no: data?.drawing_id?._id,
        offer_no: data?._id,
        average_dft: data?.average_dft_mio,
        ins_notes: data?.qc_notes
      });
      setStatus(data?.qc_status);
    }
  }, [data]);

  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getUserMio());
  }, []);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const mioOfferData = useSelector((state) => state?.getUserMio?.user?.data);

  useEffect(() => {
    const mioIds = mioOfferData?.map((e) => e?.drawing_id?._id);
    const matchData = drawData?.filter((dr) => mioIds?.includes(dr?._id) && dr?.project?._id === localStorage.getItem('U_PROJECT_ID'));
    setMioDraw(matchData || []);

    const filterOffer = mioOfferData?.filter((mi) => mi?.drawing_id?._id === mioOffer.drawing_no);
    setSelectedDraw(filterOffer);
    if (selectedDraw) {
      const findOffer = selectedDraw?.find((se) => se?._id === mioOffer?.offer_no)
      setOfferObj(findOffer);
    }
  }, [mioOffer.drawing_no, mioOffer.offer_no, mioOfferData, data, drawData]);

  const handleChange = (e, name) => {
    setMioOffer({ ...mioOffer, [name]: e.target.value });
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value === 'accept');
  };

  const handleWeatherData = (weData) => {
    setWeatherData(weData);
  };

  const handleMioOffer = (mData) => {
  }

  const handleSubmit = () => {
    if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateMioData.current && validateMioData.current()) {
      setDisable(true);
      const myurl = `${V_URL}/user/get-mio-approval`;
      const formData = new URLSearchParams();
      formData.append('id', offerObj._id);
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
      formData.append('average_dft_mio', mioOffer.average_dft);
      formData.append('qc_notes', mioOffer.ins_notes || '');
      formData.append('status', status);
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/user/project-store/mio-clearance-management');
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
  }

  const validation = () => {
    let err = {};
    var isValid = true;

    if (!mioOffer.drawing_no) {
      isValid = false;
      err['drawing_no_err'] = 'Please select drawing';
    }
    if (!mioOffer.offer_no) {
      isValid = false;
      err['offer_no_err'] = 'Please select offer no';
    }
    if (!mioOffer.average_dft) {
      isValid = false;
      err['average_dft_err'] = 'Please enter average DFT';
    }
    if (status === null) {
      isValid = false;
      err['status_err'] = 'Please select status';
    }
    setError(err);
    return isValid
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawOptions = mioDraw?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id,
  }));

  const MioOfferOptions = selectedDraw?.map(offer => ({
    label: offer?.voucher_no,
    value: offer._id,
  }));

  const weatherActivity = ['MIO Coat']

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
                    <Link to="/user/project-store/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/user/project-store/mio-clearance-management">MIO Clearance List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Add MIO Clearance Details</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h4>Add MIO Clearance Details</h4>
                  <div className="row mt-4">
                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms custom-select-wpr">
                        <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                        <Dropdown
                          options={drawOptions}
                          value={mioOffer.drawing_no}
                          onChange={(e) => handleChange(e, 'drawing_no')}
                          placeholder='Select Drawing No'
                          className='w-100'
                          filter
                          disabled={data?._id}
                        />
                        <div className='error'>{error?.drawing_no_err}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms custom-select-wpr">
                        <label> MIO Offer No.<span className="login-danger">*</span></label>
                        <Dropdown
                          options={MioOfferOptions}
                          value={mioOffer.offer_no}
                          onChange={(e) => handleChange(e, 'offer_no')}
                          placeholder='Select Offer No'
                          className='w-100'
                          filter
                          disabled={data?._id}
                        />
                        <div className='error'>{error?.offer_no_err}</div>
                      </div>
                    </div>

                    {mioOffer?.offer_no && (
                      <div className="col-12 col-md-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Procedure No.</label>
                          <input type='text' className='form-control' value={offerObj?.procedure_no?.vendor_doc_no} disabled={data?._id} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='row'>
                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms custom-select-wpr">
                        <label>Average DFT MIO<span className="login-danger">*</span></label>
                        <input type="text" className="form-control" value={mioOffer.average_dft} name='average_dft' onChange={(e) => handleChange(e, 'average_dft')} readOnly={data?._id} />
                        <div className='error'>{error.average_dft_err}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <div className="row align-items-center">
                        <div className="col-12">
                          <div className="input-block select-gender">
                            <label className="gen-label">Status <span className="login-danger">*</span></label>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input type="radio" name="status"
                                  value="accept"
                                  className="form-check-input" checked={status === true}
                                  onChange={handleStatusChange} disabled={data?._id} />Accept
                              </label>
                            </div>
                            <div className="form-check-inline">
                              <label className="form-check-label">
                                <input type="radio" name="status" value="reject"
                                  checked={status === false}
                                  onChange={handleStatusChange}
                                  className="form-check-input" disabled={data?._id} />Reject
                              </label>
                            </div>
                            <div className='error'>{error?.status_err}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="input-block local-forms custom-select-wpr">
                        <label>Inspection Notes</label>
                        <textarea className='form-control' value={mioOffer.ins_notes} onChange={(e) => handleChange(e, 'ins_notes')} name='ins_notes' readOnly={data?._id} />
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
            weatherData={offerObj?.weather_condition}
          />
          <MioPaintFields
            is_inspection={true}
            paintData={offerObj?.dispatch_note?.paint_system}
            handleMioOffer={handleMioOffer}
            validateMioData={validateMioData}
            edit_data={offerObj}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      {!data?._id ? (
                        <button className="btn btn-primary" type='button' onClick={handleSubmit} disabled={disable}>
                          {disable ? 'Processing...' : 'Submit'}
                        </button>
                      ) : (
                        <button className="btn btn-primary" type='button' onClick={() => navigate('/user/project-store/mio-clearance-management')}>
                          Back
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default ManageMioPaintClearance