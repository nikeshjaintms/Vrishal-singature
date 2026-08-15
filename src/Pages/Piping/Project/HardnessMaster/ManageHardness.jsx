import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPipingClassMaster } from '../../../../Store/Piping/PipingClass/PipingClassMaster';

const ManageHardness = () => {

  const dispatch = useDispatch()
  const pipingClassData = useSelector((state) => state?.getUserPipingClassMaster?.user?.data || []);
  const [disable, setDisable] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const location = useLocation();
  const [availableServices, setAvailableServices] = useState([]);
  const navigate = useNavigate();
  const data = location.state;
  const [selectValue, setSelectValue] = useState('');
  const [hardnessMasters, setHardnessMasters] = React.useState({
    pipingClass: "",
    PipingMaterialSpecification: "",
    MaxAcceptableHardness: "",
    HardnessValue: ""
  });

  useEffect(() => {
    if (location.state) {
      setHardnessMasters({
        pipingClass: location.state.pipingClass?._id || location.state.pipingClass,
        service: location.state.service?._id || location.state.service,
        PipingMaterialSpecification: location.state.PipingMaterialSpecification?.name || location.state.PipingMaterialSpecification || "",
        MaxAcceptableHardness: location.state.MaxAcceptableHardness,
        HardnessValue: location.state.HardnessValue,
      });
      setSelectValue(location.state?.status);
    }
  }, [location.state]);

  useEffect(() => {
    if (hardnessMasters.pipingClass && pipingClassData.length > 0) {
      const selectedClass = pipingClassData.find(
        (p) => String(p._id) === String(hardnessMasters.pipingClass)
      );
      if (selectedClass) {
        setAvailableServices(selectedClass.Items || []);
      }
    }
  }, [hardnessMasters.pipingClass, pipingClassData]);


  const validation = () => {
    let err = {};
    let isValid = true;
    if (!hardnessMasters.pipingClass) {
      isValid = false;
      err['pipingClass_err'] = "Please select Piping Class";
    }
    if (!hardnessMasters.service) {
      isValid = false;
      err['service_err'] = "Please Select Service";
    }
    if (!hardnessMasters.PipingMaterialSpecification) {
      isValid = false;
      err['PipingMaterialSpecification_err'] = "Please enter Piping Material Specification";
    }
    if (!hardnessMasters.HardnessValue) {
      isValid = false;
      err['HardnessValue_err'] = "Please enter Hardness Value";
    }

    if (!hardnessMasters.MaxAcceptableHardness) {
      isValid = false;
      err['MaxAcceptableHardness_err'] = "Please enter Max. Acceptable Hardness";
    } else if (isNaN(hardnessMasters.MaxAcceptableHardness)) {
      isValid = false;
      err['MaxAcceptableHardness_err'] = 'Max. Acceptable Hardness must be a number.';
    }
    setErrors(err);
    return isValid
  }

  const handleReset = () => {
    setHardnessMasters({
      pipingClass: "",
      service: "",
      PipingMaterialSpecification: "",
      MaxAcceptableHardness: "",
      HardnessValue: "",
    });
    setErrors({});
    setDisable(false);
  }

  const handleSubmit = (e) => {
    if (validation()) {
      setDisable(true);
      const myurl = `${V_URL}/user/manage-hardness`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('pipingClass', hardnessMasters.pipingClass);
      bodyFormData.append('service', hardnessMasters.service);
      bodyFormData.append('PipingMaterialSpecification', hardnessMasters.PipingMaterialSpecification);
      bodyFormData.append('MaxAcceptableHardness', hardnessMasters.MaxAcceptableHardness);
      bodyFormData.append('HardnessValue', hardnessMasters.HardnessValue);

      bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
      if (data?._id) {
        bodyFormData.append('_id', data._id);
        bodyFormData.append('status', selectValue);
      }
      axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data.success === true) {
          navigate('/piping/user/hardness-master-management')
          toast.success(response.data.message);
          handleReset();
        } else {
          toast.error(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        // console.log(error, '!!');
        toast.error(error?.response?.data?.message || 'Something went wrong')
        setDisable(false);
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHardnessMasters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // When Piping Class changes
    if (name === "pipingClass") {
      // Reset dependent fields
      setHardnessMasters((prev) => ({
        ...prev,
        pipingClass: value,
        service: "",
        PipingMaterialSpecification: "",
      }));
    }

    // When Service changes
    else if (name === "service") {
      const selectedService = availableServices.find(
        (item) => item._id === value
      );

      setHardnessMasters((prev) => ({
        ...prev,
        service: value,
        PipingMaterialSpecification:
          selectedService?.PipingMaterialSpecification?.name || selectedService?.PipingMaterialSpecification || "",
      }));
    }

    // For other inputs
    else {
      setHardnessMasters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(getUserPipingClassMaster({
      status: 1,
      project: localStorage.getItem("U_PROJECT_ID")
    }));
  }, [dispatch]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/hardness-master-management">Hardness List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Hardness</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? 'Edit' : 'Add'} Hardness Master Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Piping Class <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" onChange={handleChange} name='pipingClass' value={hardnessMasters.pipingClass} /> */}
                          <select className="form-control" name="pipingClass" value={hardnessMasters.pipingClass} onChange={handleChange} >
                            <option value="">-- Select Piping Class --</option>
                            {pipingClassData.map((pclass) => (
                              <option key={pclass._id} value={pclass._id}> {pclass.PipingClass} </option>
                            ))}
                          </select>
                          <div className='error'>{errors.pipingClass_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Services <span className="login-danger">*</span></label>
                          <select className="form-control" name="service" value={hardnessMasters.service} onChange={handleChange} disabled={!availableServices.length} >
                            <option value="">-- Select Service --</option>
                            {availableServices.map((item) => (
                              <option key={item._id} value={item._id}> {item.service} </option>
                            ))}
                          </select>
                          <div className='error'>{errors?.service_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Piping Material Specification{" "} <span className="login-danger">*</span></label>
                          <input type="text" className="form-control" name='PipingMaterialSpecification' value={hardnessMasters.PipingMaterialSpecification} disabled />

                          <div className='error'>{errors?.PipingMaterialSpecification_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Max. Acceptable Hardness <span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='MaxAcceptableHardness' value={hardnessMasters.MaxAcceptableHardness} />
                          <div className='error'>{errors.MaxAcceptableHardness_err}</div>                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Hardness Value <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" onChange={handleChange} name='HardnessValue' value={hardnessMasters.HardnessValue} /> */}
                          <select className='form-control form-select' name='HardnessValue' onChange={handleChange} value={hardnessMasters.HardnessValue}>
                            <option value="">Select Hardness Value</option>
                            <option value="HRB">HRB</option>
                            <option value="HRC">HRC</option>
                            <option value="HB">HB</option>
                            <option value="HV">HV</option>
                          </select>
                          <div className='error'>{errors.HardnessValue_err}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                        <button type="button"
                          className="btn btn-primary cancel-form" onClick={() => setHardnessMasters('')}>Reset</button>
                      </div>
                    </div>
                  </form>
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

export default ManageHardness