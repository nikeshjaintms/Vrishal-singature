import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
// import { getUserJointType } from '../../../../Store/Store/JointType/JointType';
import { getUserJointTypePiping } from '../../../../Store/Piping/JointType/JointTypePiping';
import { MultiSelect } from 'primereact/multiselect';


const ManageWpsMaster = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pmsList, setPmsList] = useState([]);
    const [wpsMasters, setWpsMasters] = React.useState({
        jointType: "",
        PipingMaterialSpecification:"",
        wpsNo: "",
        MinimumThickness: "",
        MaximumThickness: "",
        weldingProcess: "",
        PreHeat: "",
        PWHT: "",
        pdf: "",
    });
    const [errors, setErrors] = React.useState({});
    const [disable, setDisable] = React.useState(false);
    const [selectValue, setSelectValue] = useState('');
    const [selectedJointType, setSelectedJointType] = useState([]);
    const data = location.state;

    // useEffect(() => {
    //     if (location.state) {
    //         setWpsMasters({
    //             wpsNo: location.state.wpsNo,
    //             weldingProcess: location.state.weldingProcess,
    //             pdf: location.state.pdf,
    //             PipingMaterialSpecification: location.state.PipingMaterialSpecification,
    //             MinimumThickness: location.state.MinimumThickness,
    //             MaximumThickness: location.state.MaximumThickness,
    //             PreHeat: location.state.PreHeat,
    //             PWHT: location.state.PWHT,
    //         });
    //         setSelectValue(location.state?.status);
    //         setSelectedJointType(data?.jointType?.map(jt => ({
    //             jointId: jt?.jointId?._id || jt
    //         })));
    //     }
    // }, [location.state]);

useEffect(() => {
  if (location.state) {
    setWpsMasters({
      wpsNo: location.state.wpsNo || "",
      weldingProcess: location.state.weldingProcess || "",
      pdf: location.state.pdf || "",
      PipingMaterialSpecification:
        location.state.PipingMaterialSpecification?._id || "",
      MinimumThickness: location.state.MinimumThickness || "",
      MaximumThickness: location.state.MaximumThickness || "",
      PreHeat: location.state.PreHeat || "",
      PWHT: location.state.PWHT || "",
    });

    // ✅ ONLY extract jointId._id
    setSelectedJointType(
      location.state.jointType
        ?.filter(jt => jt.jointId)
        ?.map(jt => jt.jointId._id.toString()) || []
    );
  }
}, [location.state]);




    useEffect(() => {
        dispatch(getUserJointTypePiping({ status: true }));    
    }, [dispatch]);

    const jointData = useSelector((state) => state.getUserJointTypePiping?.user?.data)

    const handleChange = (e) => {
        setWpsMasters({ ...wpsMasters, [e.target.name]: e.target.value });
    }

    const handleJointType = (e) => {
        setSelectedJointType(e.target.value);
    }

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    }

    const handlePdf = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["application/pdf"];
            const fileType = e.target.files[0].type;
            if (allowedTypes.includes(fileType)) {
                setDisable(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append('image', e?.target?.files[0]);
                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                }).then((response) => {
                    if (response.data.success === true) {
                        const data = response?.data?.data?.pdf;
                        setWpsMasters({ ...wpsMasters, pdf: data });
                    }
                    setDisable(false);
                }).catch((error) => {
                    console.log(error, '!!');
                    toast.error(error.response?.data?.message)
                })
            } else {
                toast.error("Invalid file type. Only PDFs are allowed.");
            }
        }
    }
  useEffect(() => {
    const fetchPMS = async () => {
      try {
         const projectId = localStorage.getItem('U_PROJECT_ID');
                
                const res = await axios.post(
                  `${V_URL}/user/piping-material-specification/get-piping-material-specification?project=${projectId}`,

        // const res = await axios.post(
        //   `${V_URL}/user/piping-material-specification/get-piping-material-specification`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
            },
          }
        );

        setPmsList(res.data?.data?.pipingmaterialspecifications || []);
      } catch (err) {
        console.error("PMS fetch failed", err);
      }
    };

    fetchPMS();
  }, []);
    const handleSubmit = (e) => {
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-wps`;
            const bodyFormData = new URLSearchParams();
            // bodyFormData.append('jointType', JSON.stringify(selectedJointType));
            bodyFormData.append(
  'jointType',
  JSON.stringify(selectedJointType.map(id => ({ jointId: id })))
);

            bodyFormData.append('wpsNo', wpsMasters.wpsNo);
            bodyFormData.append('PipingMaterialSpecification', wpsMasters.PipingMaterialSpecification);
            bodyFormData.append('weldingProcess', wpsMasters.weldingProcess);
            bodyFormData.append('MinimumThickness', wpsMasters.MinimumThickness);
            bodyFormData.append('MaximumThickness', wpsMasters.MaximumThickness);
            bodyFormData.append('PreHeat', wpsMasters.PreHeat);
            bodyFormData.append('PWHT', wpsMasters.PWHT);
            bodyFormData.append('pdf', wpsMasters.pdf);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            if (data?._id) {
                bodyFormData.append('id', data._id);
                bodyFormData.append('status', selectValue);
            }
            
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    navigate('/piping/user/wps-master-management')
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

    const handleReset = () => {
        setWpsMasters({
            jointType: "",
            wpsNo: "",
            weldingProcess: "",
            pdf: "",
        });
        setErrors({});
        setDisable(false);
        setSelectedJointType([]);
    }

    const validation = () => {
        let err = {};
        let isValid = true;
        if (selectedJointType?.length === 0) {
            isValid = false;
            err['jointType_err'] = "Please select joint type";
        }
        if (!wpsMasters.wpsNo) {
            isValid = false;
            err['wpsNo_err'] = "Please enter WPS No";
        }
        if (!wpsMasters.PipingMaterialSpecification) {
            isValid = false;
            err['PipingMaterialSpecification_err'] = "Please enter Piping Material Specification";
        }
        if (!wpsMasters.weldingProcess) {
            isValid = false;
            err['weldingProcess_err'] = "Please enter welding process";
        }

        if (!wpsMasters.MinimumThickness && wpsMasters.MinimumThickness !== 0) {
            isValid = false;
            err['MinimumThickness_err'] = 'Please enter Minimum Thickness.';
        } else if (isNaN(wpsMasters.MinimumThickness)) {
            isValid = false;
            err['MinimumThickness_err'] = 'Minimum Thickness must be a number.';
        }

        if (!wpsMasters.MaximumThickness && wpsMasters.MaximumThickness !== 0) {
            isValid = false;
            err['MaximumThickness_err'] = 'Please enter Maximum Thickness.';
        } else if (isNaN(wpsMasters.MaximumThickness)) {
            isValid = false;
            err['MaximumThickness_err'] = 'Maximum Thickness must be a number.';
        }

        if (!wpsMasters.PreHeat) {
            isValid = false;
            err['PreHeat_err'] = "Please Select Pre-Heat";
        }
         if (!wpsMasters.PWHT) {
            isValid = false;
            err['PWHT_err'] = "Please Select PWHT";
        }
        if (!wpsMasters.pdf) {
            isValid = false;
            err['pdf_err'] = "Please select PDF";
        }
        setErrors(err);
        return isValid
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    // const jointOptions = jointData?.map((n) => ({
    //     label: n?.name,
    //     value: n?._id
    // }));

const jointOptions = jointData?.map(jt => ({
  label: jt.name,
  value: jt._id.toString()   // make sure it's a string
}));
console.log('jointOptions:', jointOptions);
console.log('selectedJointType:', selectedJointType);

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/wps-master-management">WPS Master List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} WPS Master</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} WPS Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>WPS No. <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={handleChange} name='wpsNo' value={wpsMasters.wpsNo} />
                                                    <div className='error'>{errors.wpsNo_err}</div>
                                                </div>
                                            </div>

                                            {/* <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Piping Material Specification <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={handleChange} name='PipingMaterialSpecification' value={wpsMasters.PipingMaterialSpecification} />
                                                    <div className='error'>{errors.PipingMaterialSpecification_err}</div>
                                                </div>
                                            </div> */}

     <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-forms">
              <label>Piping Material Specification <span className="login-danger">*</span></label>
              {/* <select
                    className="form-control"
                    name="piping_material_specification"
                    value={wpsMasters.PipingMaterialSpecification}
                    onChange={handleChange}
                  >
                    <option value="">Select PMS</option>
                    {pmsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select> */}
                  <select
  className="form-control"
  name="PipingMaterialSpecification"
  value={wpsMasters.PipingMaterialSpecification}
  onChange={handleChange}
>
  <option value="">Select PMS</option>
  {pmsList.map((p) => (
    <option key={p._id} value={p._id}>
      {p.name}
    </option>
  ))}
</select>

                  <div className='error'>{errors.PipingMaterialSpecification_err}</div>
            </div>
          </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Welding Process <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={handleChange} name='weldingProcess' value={wpsMasters.weldingProcess} />
                                                    <div className='error'>{errors.weldingProcess_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Minimum Thickness (mm)<span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={handleChange} name='MinimumThickness' value={wpsMasters.MinimumThickness} />
                                                    <div className='error'>{errors.MinimumThickness_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Maximum Thickness (mm)<span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control"
                                                        onChange={handleChange} name='MaximumThickness' value={wpsMasters.MaximumThickness} />
                                                    <div className='error'>{errors.MaximumThickness_err}</div>
                                                </div>
                                            </div>

                                            
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Joint Type <span className="login-danger">*</span></label>
                                                    {/* <select type="text" className="form-control form-select"
                                                        onChange={handleChange} name='jointType' value={wpsMasters.jointType}>
                                                        <option value=''>Select Joint Type</option>
                                                        {jointData?.map((e) =>
                                                            <option value={e?._id} key={e?._id}>{e?.name}</option>
                                                        )}
                                                    </select> */}
                                                   <MultiSelect
  value={selectedJointType}
  options={jointOptions}
  optionLabel="label"
  optionValue="value"
  onChange={(e) => setSelectedJointType(e.value)}
  placeholder="Select Joint Type"
  display="chip"
  className="w-100 multi-prime-react"
/>


                                                

                                                   {/* <MultiSelect
                                                        value={selectedJointType?.map(s => s.jointId)}
                                                        onChange={(e) => handleJointType({
                                                            target: {
                                                                name: 'jointId',
                                                                value: e.value.map(id => ({ jointId: id }))
                                                            }
                                                        })}
                                                        options={jointOptions}
                                                        optionLabel="label"
                                                        placeholder="Select Joint Type"
                                                        display="chip"
                                                        className="w-100 multi-prime-react"
                                                    /> */}
                                                    <div className='error'>{errors.jointType_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Pre-Heat <span className="login-danger">*</span></label>
                                                    {/* <input type="text" className="form-control"
                                                        onChange={handleChange} name='PreHeat' value={wpsMasters.PreHeat} /> */}
                                                    <select className='form-control form-select' name='PreHeat' onChange={handleChange} value={wpsMasters.PreHeat}>
                                                        <option value="">Select Pre-Heat</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="NO">No</option>
                                                    </select>
                                                    <div className='error'>{errors.PreHeat_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>PWHT <span className="login-danger">*</span></label>
                                                    {/* <input type="text" className="form-control"
                                                        onChange={handleChange} name='PWHT' value={wpsMasters.PWHT} /> */}
                                                    <select className='form-control form-select' name='PWHT' onChange={handleChange} value={wpsMasters.PWHT}>
                                                        <option value="">Select PWHT</option>
                                                        <option value="Yes">Yes</option>
                                                        <option value="NO">No</option>
                                                    </select>
                                                    <div className='error'>{errors.PWHT_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">PDF <span className="login-danger">*</span></label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                                        <input type="file" id="pdfFile" onChange={handlePdf} accept=".pdf" className="hide-input" />
                                                    </div>
                                                    <div className='error'>{errors.pdf_err}</div>
                                                    {wpsMasters.pdf ? (
                                                        <a href={wpsMasters.pdf} target='_blank'>
                                                            <img src='/assets/img/pdflogo.png' />
                                                        </a>
                                                    ) : null}
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

export default ManageWpsMaster