import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserJointType } from '../../../../Store/Store/JointType/JointType';
import { MultiSelect } from 'primereact/multiselect';
import { getUserPipingClassMaster } from '../../../../Store/Piping/PipingClass/PipingClassMaster';

const ManagePwht = () => {

  const dispatch = useDispatch()
  const [disable, setDisable] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [availableServices, setAvailableServices] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
    console.log("pwht data======>",data);
  const [selectValue, setSelectValue] = useState('');
  const [pwhtMasters, setPwhtMasters] = React.useState({
    pipingClass: "",
    service: "",
    PipingMaterialSpecification: "",
    pwhtType: "",
    LoadingTemp: "",
    rateofHeating: "",
    soakingTemp: "",
    soakingPeriod: "",
    rateofCooling: "",
    unloadingTemp: "",
  });

  // useEffect(() => {
  //   if (location.state) {
  //     setPwhtMasters({
  //       pipingClass: location.state.pipingClass,
  //       service: location.state.service,
  //       pwhtType: location.state.pwhtType,
  //       LoadingTemp: location.state.LoadingTemp,
  //       PipingMaterialSpecification: location.state.PipingMaterialSpecification?.name || location.state.PipingMaterialSpecification || "",
  //       rateofHeating: location.state.rateofHeating,
  //       soakingTemp: location.state.soakingTemp,
  //       soakingPeriod: location.state.soakingPeriod,
  //       rateofCooling: location.state.rateofCooling,
  //       unloadingTemp: location.state.unloadingTemp,
  //     });
  //     setSelectValue(location.state?.status);
  //   }
  // }, [location.state]);




  const validation = () => {
    let err = {};
    let isValid = true;
    if (!pwhtMasters.pipingClass) {
      isValid = false;
      err['pipingClass_err'] = "Please enter Piping Class";
    }
    // if (!pwhtMasters.service) {
    //     isValid = false;
    //     err['service_err'] = "Please Select Service";
    // }
    // if (!pwhtMasters.PipingMaterialSpecification) {
    //     isValid = false;
    //     err['PipingMaterialSpecification_err'] = "Please enter Piping Material Specification";
    // }
    if (!pwhtMasters.service.length) {
      isValid = false;
      err.service_err = "Please select Service";
    }

    if (!pwhtMasters.PipingMaterialSpecification) {
      isValid = false;
      err.PipingMaterialSpecification_err =
        "Please enter Piping Material Specification";
    }

    if (!pwhtMasters.pwhtType) {
      isValid = false;
      err['pwhtType_err'] = "Please enter PWHT Type";
    }

    if (!pwhtMasters.LoadingTemp) {
      isValid = false;
      err['LoadingTemp_err'] = "Please enter Loading Temp";
    } else if (isNaN(pwhtMasters.LoadingTemp)) {
      isValid = false;
      err['LoadingTemp_err'] = 'Loading Temp must be a number.';
    }

    if (!pwhtMasters.rateofHeating) {
      isValid = false;
      err['rateofHeating_err'] = "Please enter Rate of Heating";
    } else if (isNaN(pwhtMasters.rateofHeating)) {
      isValid = false;
      err['rateofHeating_err'] = 'Rate of Heating must be a number.';
    }

    if (!pwhtMasters.soakingTemp) {
      isValid = false;
      err['soakingTemp_err'] = "Please enter Soaking Temp";
    } else if (isNaN(pwhtMasters.soakingTemp)) {
      isValid = false;
      err['soakingTemp_err'] = 'Soaking Temp must be a number.';
    }

    if (!pwhtMasters.soakingPeriod) {
      isValid = false;
      err['soakingPeriod_err'] = "Please enter Soaking Period";
    } else if (isNaN(pwhtMasters.soakingPeriod)) {
      isValid = false;
      err['soakingPeriod_err'] = 'Soaking Period must be a number.';
    }

    if (!pwhtMasters.rateofCooling) {
      isValid = false;
      err['rateofCooling_err'] = "Please enter Rate of Cooling";
    } else if (isNaN(pwhtMasters.rateofCooling)) {
      isValid = false;
      err['rateofCooling_err'] = 'Rate of Cooling must be a number.';
    }

    if (!pwhtMasters.unloadingTemp) {
      isValid = false;
      err['unloadingTemp_err'] = "Please enter Unloading Temp";
    } else if (isNaN(pwhtMasters.unloadingTemp)) {
      isValid = false;
      err['unloadingTemp_err'] = 'Unloading Temp must be a number.';
    }
    setErrors(err);
    return isValid
  }

  const handleReset = () => {
    setPwhtMasters({
      pipingClass: "",
      service: [],
      PipingMaterialSpecification: null,
      pwhtType: "",
      LoadingTemp: "",
      rateofHeating: "",
      soakingTemp: "",
      soakingPeriod: "",
      rateofCooling: "",
      unloadingTemp: "",
    });
    setErrors({});
    setDisable(false);
  }

  const handleSubmit = (e) => {
    if (validation()) {
      setDisable(true);
      const myurl = `${V_URL}/user/manage-pwht`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('pipingClass', pwhtMasters.pipingClass);
      // bodyFormData.append('service', pwhtMasters.service);
      // bodyFormData.append('PipingMaterialSpecification', pwhtMasters.PipingMaterialSpecification);
      bodyFormData.append(
        "service",
        JSON.stringify(pwhtMasters.service.map(s => s._id))
      );

      bodyFormData.append(
        "PipingMaterialSpecification",
        pwhtMasters.PipingMaterialSpecification?._id
      );

      bodyFormData.append('pwhtType', pwhtMasters.pwhtType);
      bodyFormData.append('LoadingTemp', pwhtMasters.LoadingTemp);
      bodyFormData.append('rateofHeating', pwhtMasters.rateofHeating);
      bodyFormData.append('soakingTemp', pwhtMasters.soakingTemp);
      bodyFormData.append('soakingPeriod', pwhtMasters.soakingPeriod);
      bodyFormData.append('rateofCooling', pwhtMasters.rateofCooling);
      bodyFormData.append('unloadingTemp', pwhtMasters.unloadingTemp);

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
          navigate('/piping/user/pwht-master-management')
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
  // const handlePipingClassChange = (value) => {
  //   const selectedClass = pipingClassData.find(p => p._id === value);

  //   setAvailableServices(selectedClass?.Items || []);

  //   setPwhtMasters(prev => ({
  //     ...prev,
  //     pipingClass: value,
  //     service: [],
  //     PipingMaterialSpecification: null
  //   }));
  // };

  const handlePipingClassChange = (value) => {
  const selectedClass = pipingClassData.find(p => p._id === value);

  const servicesOptions = selectedClass?.Items || [];
  setAvailableServices(servicesOptions);

  setPwhtMasters(prev => ({
    ...prev,
    pipingClass: value,
    service: [],
    PipingMaterialSpecification: null,
  }));
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPwhtMasters((prev) => ({
      ...prev,
      [name]: value,
    }));

    // When Piping Class changes
    if (name === "pipingClass") {
      const selectedClass = pipingClassData.find((p) => p._id === value);

      // Populate service dropdown
      if (selectedClass && selectedClass.Items?.length > 0) {
        setAvailableServices(selectedClass.Items);
      } else {
        setAvailableServices([]);
      }

      // Reset dependent fields
      setPwhtMasters((prev) => ({
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

      setPwhtMasters((prev) => ({
        ...prev,
        service: value,
        PipingMaterialSpecification:
          selectedService?.PipingMaterialSpecification?.name || selectedService?.PipingMaterialSpecification || "",
      }));
    }

    // For other inputs
    else {
      setPwhtMasters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const pipingClassData = useSelector((state) => state?.getUserPipingClassMaster?.user?.data || []);

  useEffect(() => {
  if (location.state && pipingClassData.length) {
    const pipingClassId = location.state.pipingClass._id;

    // Find selected piping class
    const selectedClass = pipingClassData.find(p => p._id === pipingClassId);

    // Get services for that class
    const servicesOptions = selectedClass?.Items || [];
    setAvailableServices(servicesOptions);

    // Map saved service IDs to full objects
    const selectedServices = servicesOptions.filter(s =>
      location.state.service.includes(s._id)
    );

    // Get Material Specification from first selected service (if exists)
    const firstSpec = location.state.PipingMaterialSpecification || selectedServices[0]?.PipingMaterialSpecification || null;

    setPwhtMasters({
      pipingClass: pipingClassId,
      service: selectedServices,
      pwhtType: location.state.pwhtType,
      LoadingTemp: location.state.LoadingTemp,
      PipingMaterialSpecification: firstSpec,
      rateofHeating: location.state.rateofHeating,
      soakingTemp: location.state.soakingTemp,
      soakingPeriod: location.state.soakingPeriod,
      rateofCooling: location.state.rateofCooling,
      unloadingTemp: location.state.unloadingTemp,
    });
    setSelectValue(location.state?.status);
  }
}, [location.state, pipingClassData]);

  useEffect(() => {
    // const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(getUserPipingClassMaster({
      status: 1,
      project: localStorage.getItem("U_PROJECT_ID")
    }));
  }, [dispatch]);
  const handleServiceMultiSelect = (selected = []) => {

    // Reset if nothing selected
    if (selected.length === 0) {
      setPwhtMasters(prev => ({
        ...prev,
        service: [],
        PipingMaterialSpecification: null
      }));
      return;
    }

    // Take first service's spec
    const firstSpec = selected[0]?.PipingMaterialSpecification;
    const firstSpecId = firstSpec?._id || firstSpec;

    // Check all selected services have same spec
    const isSameSpec = selected.every(item => {
      const currentId =
        item.PipingMaterialSpecification?._id ||
        item.PipingMaterialSpecification;
      return currentId === firstSpecId;
    });

    if (!isSameSpec) {
      toast.error("You can select services with same Material Specification only");
      return;
    }

    setPwhtMasters(prev => ({
      ...prev,
      service: selected,
      PipingMaterialSpecification: firstSpec
    }));
  };

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
                  <li className="breadcrumb-item"><Link to="/piping/user/pwht-master-management">PWHT List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} PWHT</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} PWHT Master Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Piping Class <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" onChange={handleChange} name='pipingClass' value={pwhtMasters.pipingClass} /> */}
                          <select className="form-control" name="pipingClass" value={pwhtMasters.pipingClass} onChange={(e) => handlePipingClassChange(e.target.value)} >
                            <option value="">-- Select Piping Class --</option>
                            {pipingClassData.map((pclass) => (
                              <option key={pclass._id} value={pclass._id}> {pclass.PipingClass} </option>
                            ))}
                          </select>
                          <div className='error'>{errors.pipingClass_err}</div>
                        </div>
                      </div>

                      {/* <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Services <span className="login-danger">*</span></label>
                          <select className="form-control" name="service" value={pwhtMasters.service} onChange={handleChange} disabled={!availableServices.length} >
                            <option value="">-- Select Service --</option>
                            {availableServices.map((item) => (
                              <option key={item._id} value={item._id}> {item.service} </option>
                            ))}
                          </select>
                          <div className='error'>{errors?.service_err}</div>
                        </div>
                      </div> */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Services <span className="login-danger">*</span>
                          </label>

                          {/* <MultiSelect
                            value={pwhtMasters.service}
                            options={availableServices.map(item => ({
                              label: item.service,
                              value: item
                            }))}
                            onChange={(e) => handleServiceMultiSelect(e.value)}
                            placeholder="Select Services"
                            display="chip"
                            className="w-100"
                          /> */}
<MultiSelect
  value={pwhtMasters.service}
  options={availableServices.map(item => ({
    label: item.service,
    value: item
  }))}
  onChange={(e) => handleServiceMultiSelect(e.value)}
  placeholder="Select Services"
  display="chip"
  className="w-100"
/>
                          <div className="error">{errors?.service_err}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Piping Material Specification{" "} <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" name='PipingMaterialSpecification'  value={pwhtMasters.PipingMaterialSpecification} disabled /> */}
                          <input
                            type="text"
                            className="form-control"
                            value={pwhtMasters.PipingMaterialSpecification?.name || ""}
                            disabled
                          />

                          <div className='error'>{errors?.PipingMaterialSpecification_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> PWHT Type <span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='pwhtType' value={pwhtMasters.pwhtType} />
                          <div className='error'>{errors.pwhtType_err}</div>
                        </div>
                      </div>

                      {/* <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms custom-select-wpr'>
                          <label>Joint Type<span className="login-danger">*</span></label>
                          <MultiSelect
                            value={selectedJoint}
                            onChange={(e) => handleEditFormChange(e.value)}
                            options={jointTypeOptions}
                            optionLabel="label"
                            placeholder="Select Joint Type"
                            display="chip"
                            className="w-100 multi-prime-react"
                          />
                        </div>
                      </div> */}

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Loading Temp. (Degree C / Hour)<span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='LoadingTemp' value={pwhtMasters.LoadingTemp} />
                          <div className='error'>{errors.LoadingTemp_err}</div>                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Rate of Heating (Degree C / Hour)<span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='rateofHeating' value={pwhtMasters.rateofHeating} />
                          <div className='error'>{errors.rateofHeating_err}</div>                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Soaking Temp. (Degree C / Hour)<span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='soakingTemp' value={pwhtMasters.soakingTemp} />
                          <div className='error'>{errors.soakingTemp_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Soaking Period (Hour)<span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='soakingPeriod' value={pwhtMasters.soakingPeriod} />
                          <div className='error'>{errors.soakingPeriod_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Rate of Cooling (Degree C / Hour)<span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='rateofCooling' value={pwhtMasters.rateofCooling} />
                          <div className='error'>{errors.rateofCooling_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Unloading Temp. (Degree C / Hour)<span className="login-danger">*</span></label>
                          <input type="text" className="form-control" onChange={handleChange} name='unloadingTemp' value={pwhtMasters.unloadingTemp} />
                          <div className='error'>{errors.unloadingTemp_err}</div>
                        </div>
                      </div>

                      {/* {data?._id ? (
                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="cardNum">
                            <div className="mb-3">
                              <label htmlFor="fileUpload" className="form-label">Status</label>
                              <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch"
                                  onChange={handleRadioChange} checked={selectValue} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null} */}
                    </div>
                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                        <button type="button"
                          className="btn btn-primary cancel-form" onClick={() => setPwhtMasters('')}>Reset</button>
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

export default ManagePwht