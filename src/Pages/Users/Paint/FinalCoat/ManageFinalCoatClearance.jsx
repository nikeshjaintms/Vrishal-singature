import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import Footer from '../../Include/Footer';
import { Dropdown } from 'primereact/dropdown';
import WeatherCondition from '../WeatherCondition/WeatherCondition';
import FinalCoatsFields from './FinalCoatComponents/FinalCoatsFields';
import { getUserFinalCoating } from '../../../../Store/Erp/Painting/FinalCoating/FinalCoating';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';

const ManageFinalCoatClearance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [finalCoatFields, setFinalCoatFields] = useState({});
  const [weatherData, setWeatherData] = useState([]);
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const [selectedDraw, setSelectedDraw] = useState([]);
  const [offerObj, setOfferObj] = useState({});
  const validateFinalCoatData = useRef(null);
  const validateWeather = useRef(null);
  const [status, setStatus] = useState(null);
  const data = location.state;
  const [finalCoatDraw, setFinalCoatDraw] = useState([]);

  useEffect(() => {
    if (data) {
      setFinalCoatFields({
        drawing_no: data?.drawing_id?._id,
        offer_no: data?._id,
        average_dft: data?.average_dft_final_coat,
        ins_notes: data?.qc_notes
      });
      setStatus(data?.qc_status);
    }
  }, [data]);

  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getUserFinalCoating());
  }, [dispatch]);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const finalCoatOfferData = useSelector((state) => state?.getUserFinalCoating?.user?.data);

  useEffect(() => {
    const finalIds = finalCoatOfferData?.map((e) => e?.drawing_id?._id);
    const filterDraw = drawData?.filter((d) => finalIds?.includes(d?._id) && d?.project?._id === localStorage.getItem('U_PROJECT_ID'));
    setFinalCoatDraw(filterDraw || []);

    const filterOffer = finalCoatOfferData?.filter((fc) => fc?.drawing_id?._id === finalCoatFields.drawing_no
      // && fc?.status === 1
    );
    setSelectedDraw(filterOffer);
    if (selectedDraw) {
      const findOffer = selectedDraw?.find((se) => se?._id === finalCoatFields?.offer_no)
      setOfferObj(findOffer);
    }
    // eslint-disable-next-line
  }, [finalCoatFields.drawing_no, finalCoatFields?.offer_no, finalCoatOfferData, data, drawData]);

  const handleFinalCoatOffer = (mData) => {
  }

  const handleWeatherData = (weData) => {
    setWeatherData(weData);
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value === 'accept');
  };

  const handleChange = (e, name) => {
    setFinalCoatFields({ ...finalCoatFields, [name]: e.target.value });
  }

  const handleSubmit = () => {
    if (validation() && weatherData.length > 0 && validateWeather.current && validateWeather.current() && validateFinalCoatData.current && validateFinalCoatData.current()) {
      setDisable(true);
      const myurl = `${V_URL}/user/get-final-paint-approval`;
      const formData = new URLSearchParams();
      formData.append('id', offerObj._id);
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
      formData.append('average_dft_final_coat', finalCoatFields.average_dft);
      formData.append('qc_notes', finalCoatFields.ins_notes);
      formData.append('status', status);
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/user/project-store/final-coat-clearance-management');
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
    var isValid = true;
    let err = {};

    if (!finalCoatFields.drawing_no) {
      isValid = false;
      err['drawing_no_err'] = 'Please select drawing no.';
    }
    if (!finalCoatFields.offer_no) {
      isValid = false;
      err['offer_no_err'] = "Please select offer no.";
    }
    if (!finalCoatFields?.average_dft) {
      isValid = false;
      err['average_dft_err'] = "Please enter average DFT.";
    }
    if (status === null) {
      isValid = false;
      err['status_err'] = 'Please select status';
    }
    setError(err);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawOptions = finalCoatDraw?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id,
  }));

  const offerOptions = selectedDraw?.map((elem) => ({
    label: elem?.voucher_no,
    value: elem?._id,
  }))

  const weatherActivity = ['Top Coat / Final'];

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
                  <li className="breadcrumb-item"><Link to="/user/project-store/final-coat-clearance-management">Final / Top Coating Inspection List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Add Final / Top Coating Inspection Details</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h4>Add Final / Top Coating Inspection Details</h4>
                  <div className="row mt-4">
                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms custom-select-wpr">
                        <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                        <Dropdown
                          options={drawOptions}
                          value={finalCoatFields.drawing_no}
                          onChange={(e) => handleChange(e, 'drawing_no')}
                          placeholder='Select Drawing No'
                          className='w-100'
                          filter
                        />
                        <div className='error'>{error?.drawing_no_err}</div>
                      </div>
                    </div>

                    {finalCoatFields?.drawing_no && (
                      <div className="col-12 col-md-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Final Coating Offer No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={offerOptions}
                            value={finalCoatFields.offer_no}
                            onChange={(e) => handleChange(e, 'offer_no')}
                            placeholder='Select Offer No.'
                            className='w-100'
                            filter
                          />
                          <div className='error'>{error?.offer_no_err}</div>
                        </div>
                      </div>
                    )}

                    {finalCoatFields?.offer_no && (
                      <>
                        <div className="col-12 col-md-4">
                          <div className="input-block local-forms custom-select-wpr">
                            <label> Procedure No.</label>
                            <input type='text' className='form-control' value={offerObj?.procedure_no?.vendor_doc_no} disabled={data?._id} />
                          </div>
                        </div>
                        <div className="col-12 col-md-4">
                          <div className="input-block local-forms custom-select-wpr">
                            <label> Dispatch Note No.</label>
                            <input type='text' className='form-control' value={offerObj?.dispatch_note?.lot_no} disabled={data?._id} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-block local-forms">
                            <label> Remarks</label>
                            <textarea className='form-control' value={offerObj?.remarks} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className='row'>
                    <div className="col-12 col-md-4">
                      <div className="input-block local-forms">
                        <label>Average DFT Final / Top Coat <span className="login-danger">*</span></label>
                        <input className='form-control' type='text' onChange={(e) => handleChange(e, 'average_dft')} name='average_dft' value={finalCoatFields?.average_dft} />
                        <div className='error'>{error?.average_dft_err}</div>
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
                      <div className="input-block local-forms">
                        <label>Inspection Note <span className="login-danger">*</span></label>
                        <textarea className='form-control' onChange={(e) => handleChange(e, 'ins_notes')} value={finalCoatFields?.ins_notes} readOnly={data?._id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(finalCoatFields?.drawing_no && finalCoatFields?.offer_no) && (
            <>
              <WeatherCondition
                weatherActivity={weatherActivity}
                handleWeatherData={handleWeatherData}
                handleSubmit={handleSubmit}
                validateWeather={validateWeather}
                weatherData={offerObj?.weather_condition}
              />
              <FinalCoatsFields
                is_inspection={true}
                paintData={offerObj?.dispatch_note?.paint_system}
                handleFinalCoatOffer={handleFinalCoatOffer}
                validateFinalCoatData={validateFinalCoatData}
                edit_data={offerObj}
              />
            </>
          )}


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
                        <button className="btn btn-primary" type='button' onClick={() => navigate('/user/project-store/final-coat-clearance-management')}>
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

export default ManageFinalCoatClearance