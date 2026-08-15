import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getUserJointTypePiping } from '../../../../Store/Piping/JointType/JointTypePiping';
import { MultiSelect } from 'primereact/multiselect';
import { getUserPipingClassMaster } from '../../../../Store/Piping/PipingClass/PipingClassMaster';
import { Dropdown } from 'primereact/dropdown';

const ManageNdt = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
console.log("EDIT :",data);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectValue, setSelectValue] = useState(false);
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const [selectedJointType, setSelectedJointType] = useState(null);

  const [ndt, setNdt] = useState({
    piping_class: '',
    service: [],
    piping_material_specifiation: '',
    BSRRT: '',
    Ferrite: '',
    PWHT: '',
    ASRRT: '',
    RT: '',
    MPL: '',
    LPT: '',
    Hardness: '',
    PMI: '',
    PicklingPassivation: '',
  });

  // ================= REDUX =================

  const pipingClassData = useSelector(
    (state) => state?.getUserPipingClassMaster?.user?.data || []
  );

  const jointData = useSelector(
    (state) => state.getUserJointTypePiping?.user?.data || []
  );

  useEffect(() => {

    dispatch(getUserPipingClassMaster({
      status: 1,
      project: localStorage.getItem("U_PROJECT_ID")
    }));

    dispatch(getUserJointTypePiping({ status: true }));

  }, [dispatch]);

  // ================= EDIT MODE =================

  useEffect(() => {
        if (data && pipingClassData.length) {

          // ---------- PIPING CLASS ----------
          const pipingClassId = data.piping_class?._id;

          const selectedClass = pipingClassData.find(
            p => p._id === pipingClassId
          );

          // ---------- SERVICES ----------
          const matchedServices =
            selectedClass?.Items?.filter(item =>
              data.service.includes(item._id)
            ) || [];

          // ---------- SET STATE ----------
          setAvailableServices(selectedClass?.Items || []);

          setNdt(prev => ({
            ...prev,
            piping_class: pipingClassId,
            service: matchedServices,
            piping_material_specifiation: data?.piping_material_specifiation,
             BSRRT: data?.BSRRT === true ? "true" : "false",
      Ferrite: data?.Ferrite === true ? "true" : "false",
      PWHT: data?.PWHT === true ? "true" : "false",
      ASRRT: data?.ASRRT === true ? "true" : "false",
      RT: data?.RT === true ? "true" : "false",
      MPL: data?.MPL === true ? "true" : "false",
      LPT: data?.LPT === true ? "true" : "false",
      Hardness: data?.Hardness === true ? "true" : "false",
      PMI: data?.PMI === true ? "true" : "false",
      PicklingPassivation:
        data?.PicklingPassivation === true ? "true" : "false",
          }));

      // ---------- JOINT TYPE ----------
      setSelectedJointType(data?.jointType?._id);

      setSelectValue(Boolean(data?.status));
    }

  }, [data, pipingClassData]);

  // ================= SERVICE MULTISELECT =================

  const handleServiceMultiSelect = (selected = []) => {
    // 1. If everything is unselected, reset both fields to null/empty state
    if (selected.length === 0) {
      setNdt(prev => ({
        ...prev,
        service: [],
        piping_material_specifiation: null // Reset to null so .name check won't crash
      }));
      return;
    }

    // 2. Get the specification object from the first selected item
    // Assuming your item structure has PipingMaterialSpecification as an object { _id, name }
    const firstSpec = selected[0]?.PipingMaterialSpecification;
    const specId = firstSpec?._id || firstSpec; // Handle both object and ID cases

    // 3. Prevent mixed spec selection: Check if every selected item matches the first one
    const isSameSpec = selected.every(item => {
      const currentId = item.PipingMaterialSpecification?._id || item.PipingMaterialSpecification;
      return currentId === specId;
    });

    if (!isSameSpec) {
      toast.error("You can select services with same Material Specification only");
      // Do not update the state, which effectively cancels the last selection
      return;
    }

    // 4. Update state with the selected array and the spec object
    setNdt(prev => ({
      ...prev,
      service: selected,
      piping_material_specifiation: firstSpec
    }));
  };

  // ================= INPUT CHANGE =================

const handleChange = (e) => {

  const { name, value } = e.target;

  if (name === "piping_class") {

    const selectedClass = pipingClassData.find(p => p._id === value);

    setAvailableServices(selectedClass?.Items || []);

    setNdt(prev => ({
      ...prev,
      piping_class: value,
      service: [],
      piping_material_specifiation: ''
    }));

  } else {

    setNdt(prev => ({
      ...prev,
      [name]: value
    }));

  }
};


  // ================= VALIDATION =================

  const validation = () => {

    const newError = {};

    if (!ndt.piping_class) newError.piping_class_err = 'Please enter Piping Class';
    if (!ndt.service.length) newError.service_err = 'Please select Service';
    if (!selectedJointType) newError.jointType_err = 'Please select Joint Type.';
    if (!ndt.piping_material_specifiation) newError.piping_material_specifiation_err = 'Please enter Piping Material Specification';
    if (!ndt.PWHT) newError.PWHT_err = 'Please enter PWHT';
    if (!ndt.Hardness) newError.Hardness_err = 'Please enter Hardness';
    if (!ndt.BSRRT) newError.BSRRT_err = 'Please select BSRRT';
    if (!ndt.Ferrite) newError.Ferrite_err = 'Please select Ferrite';
    if (!ndt.ASRRT) newError.ASRRT_err = 'Please select ASRRT';
    if (!ndt.RT) newError.RT_err = 'Please select RT';
    if (!ndt.MPL) newError.MPL_err = 'Please select MPL';
    if (!ndt.LPT) newError.LPT_err = 'Please select LPT';
    if (!ndt.PMI) newError.PMI_err = 'Please select PMI';
    if (!ndt.PicklingPassivation) newError.PicklingPassivation_err = 'Please enter Pickling & Passivation';

    setError(newError);

    return Object.keys(newError).length === 0;
  };

  // ================= SUBMIT =================

  const handleSubmit = () => {

    if (!validation()) return;

    setDisable(true);

    const myurl = `${V_URL}/user/manage-piping-ndt`;

    const formData = new URLSearchParams();

    formData.append('piping_class', ndt.piping_class);
    formData.append('service', JSON.stringify(ndt.service.map(s => s._id)));
    formData.append('piping_material_specifiation', ndt.piping_material_specifiation?._id);
    formData.append('BSRRT', ndt.BSRRT);
    formData.append('Ferrite', ndt.Ferrite);
    formData.append('PWHT', ndt.PWHT);
    formData.append('ASRRT', ndt.ASRRT);
    formData.append('RT', ndt.RT);
    formData.append('MPL', ndt.MPL);
    formData.append('LPT', ndt.LPT);
    formData.append('Hardness', ndt.Hardness);
    formData.append('PMI', ndt.PMI);
    formData.append('PicklingPassivation', ndt.PicklingPassivation);
    formData.append('jointType', selectedJointType);
    formData.append('project', localStorage.getItem('U_PROJECT_ID'));

    if (data?._id) {
      formData.append('_id', data._id);
      formData.append('status', selectValue === true ? 1 : 0);
    }

    axios.post(myurl, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
      }
    })
      .then(res => {

        if (res.data.success) {
          toast.success(res.data.message);
          navigate('/piping/user/ndt-master-management');
          handleReset();
        } else {
          toast.error(res.data.message || 'Save Failed');
        }

      })
      .catch(err => {
        toast.error(err?.response?.data?.message || 'Something went wrong');
      })
      .finally(() => setDisable(false));
  };

  // ================= RESET =================

  const handleReset = () => {

    setNdt({
      piping_class: '',
      service: [],
      piping_material_specifiation: '',
      BSRRT: '',
      Ferrite: '',
      PWHT: '',
      ASRRT: '',
      RT: '',
      MPL: '',
      LPT: '',
      Hardness: '',
      PMI: '',
      PicklingPassivation: '',
    });

    setAvailableServices([]);
    setSelectedJointType(null);
    setError({});
  };

  // ================= UI =================

  const jointOptions = jointData.map(j => ({
    label: j?.name,
    value: j?._id
  }));
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
                  <li className="breadcrumb-item"><Link to="/piping/user/ndt-master-management">NDT / Testing Requirement List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} NDT / Testing Requirement</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} NDT / Testing Requirement Master Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Piping Class <span className="login-danger">*</span></label>
                          <select className="form-control" name="piping_class" value={ndt.piping_class} onChange={handleChange} >
                            <option value="">-- Select Piping Class --</option>
                            {pipingClassData.map((pclass) => (
                              <option key={pclass._id} value={pclass._id}> {pclass.PipingClass} </option>
                            ))}
                          </select>
                          <div className='error'>{error?.piping_class_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Services <span className="login-danger">*</span></label>
                          <MultiSelect
                            value={ndt.service}
                            options={availableServices.map(item => ({
                              label: item.service,
                              value: item
                            }))}
                            onChange={(e) => handleServiceMultiSelect(e.value)}
                            placeholder="Select Services"
                            display="chip"
                            className="w-100"
                          />
                          <div className='error'>{error?.service_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Piping Material Specification{" "} <span className="login-danger">*</span></label>
                          <input
                            type="text"
                            className="form-control"
                            name='piping_material_specifiation'
                            // Safe check for the name property, default to empty string
                            value={ndt.piping_material_specifiation?.name || ""}
                            disabled
                          />
                          <div className='error'>{error?.piping_material_specifiation_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms custom-select-wpr'>
                          <label>Joint Type<span className="login-danger">*</span></label>
                          <Dropdown
                            value={selectedJointType}
                            onChange={(e) => setSelectedJointType(e.value)}
                            options={jointOptions}
                            placeholder="Select Joint Type"
                            className="w-100"
                          />
                        </div>
                        <div className='error'>{error?.jointType_err}</div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> BSRRT <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='BSRRT' onChange={handleChange} value={ndt.BSRRT}>
                            <option value="">Select BSRRT</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.BSRRT_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Ferrite <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='Ferrite' onChange={handleChange} value={ndt.Ferrite}>
                            <option value="">Select Ferrite</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.Ferrite_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> PWHT <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" name='PWHT' onChange={handleChange} value={ndt.PWHT} /> */}
                          <select className='form-control form-select' name='PWHT' onChange={handleChange} value={ndt.PWHT}>
                            <option value="">Select PWHT</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.PWHT_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> ASRRT <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='ASRRT' onChange={handleChange} value={ndt.ASRRT}>
                            <option value="">Select ASRRT</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.ASRRT_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> RT <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='RT' onChange={handleChange} value={ndt.RT}>
                            <option value="">Select RT</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.RT_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> MPL <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='MPL' onChange={handleChange} value={ndt.MPL}>
                            <option value="">Select MPL</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.MPL_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> LPT <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='LPT' onChange={handleChange} value={ndt.LPT}>
                            <option value="">Select LPT</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.LPT_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Hardness <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" name='Hardness' onChange={handleChange} value={ndt.Hardness} /> */}
                          <select className='form-control form-select' name='Hardness' onChange={handleChange} value={ndt.Hardness}>
                            <option value="">Select Hardness</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.Hardness_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> PMI <span className="login-danger">*</span></label>
                          <select className='form-control form-select' name='PMI' onChange={handleChange} value={ndt.PMI}>
                            <option value="">Select PMI</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.PMI_err}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Pickling & Passivation <span className="login-danger">*</span></label>
                          {/* <input type="text" className="form-control" name='PicklingPassivation' onChange={handleChange} value={ndt.PicklingPassivation} /> */}
                          <select className='form-control form-select' name='PicklingPassivation' onChange={handleChange} value={ndt.PicklingPassivation}>
                            <option value="">Select Pickling Passivation</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                          <div className='error'>{error?.PicklingPassivation_err}</div>
                        </div>
                      </div>

                      {data?._id ? (
                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="cardNum">
                            <div className="mb-3">
                              <label htmlFor="fileUpload" className="form-label">Status</label>
                              <div className="form-check form-switch">
                               <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="status"
                                  role="switch"
                                  checked={selectValue}
                                  onChange={(e) => setSelectValue(e.target.checked)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                        <button type="button"
                          className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
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

export default ManageNdt;