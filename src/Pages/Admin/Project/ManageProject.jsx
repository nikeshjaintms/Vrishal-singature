import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { V_URL } from '../../../BaseUrl';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import { getDepartment } from '../../../Store/Admin/Payroll/Department/Department';
import { adminGetParty } from '../../../Store/Admin/Party/GetParty';
import { getYear } from '../../../Store/Admin/Payroll/Year/Year';
import { getFirm } from '../../../Store/Admin/Firm/Firm';
import { getAuthPerson } from '../../../Store/Admin/Payroll/AuthPerson/AuthPerson';
import { AdminContractorMaster } from '../../../Store/Admin/Contractor/AdminContractorMaster';
import { getAdminProjectType } from '../../../Store/Admin/ProjectType/GetAdminProjectType';
import { MultiSelect } from 'primereact/multiselect';
import { getAdminProjectLocation } from '../../../Store/Admin/PMS/GetProjectLocation';

const ManageProject = () => {

  const [project, setProject] = useState({
    name: "",
    location: "",
    label: "",
    startDate: "",
    endDate: "",
    manager: "",
    department: "",
    party: "",
    details: "",
    firm: "",
    year: "",
    work_order_no: "",
    po_date: "",
    company_logo: "",
  });
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState({});
  const [selectValue, setSelectValue] = useState('');
  const data = location.state;
  const dispatch = useDispatch();
  const [selectedCon, setSelectedCon] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState([]);

  useEffect(() => {
    if (location.state) {
      setProject({
        name: location.state?.name,
        location: location?.state?.location?._id,
        // label: location?.state?.label,
        startDate: moment(location?.state?.startDate).format('YYYY-MM-DD'),
        endDate: moment(location?.state?.endDate).format('YYYY-MM-DD'),
        manager: location?.state?.projectManager?._id,
        department: location?.state?.department?._id,
        party: location?.state?.party?._id,
        details: location?.state?.details,
        firm: location.state.firm_id?._id,
        year: location.state.year_id?._id,
        work_order_no: location.state.work_order_no,
        po_date: moment(location.state.po_date).format('YYYY-MM-DD'),
        company_logo: location.state.company_logo || "",
      });
      const rawLabel = Array.isArray(data?.label)
          ? data.label
          : data?.label
              ? [data.label]
              : [];

        setSelectedLabel(
          rawLabel.map(c => {
            const id =
              c?.labelId?._id || // case: labelId: {_id}
              c?.labelId ||      // case: labelId: "id"
              c?._id ||          // case: {_id:"id"}
              c;                 // case: "id"

            return { labelId: id };
          })
        );



      const rawCon = Array.isArray(data?.contractor)
        ? data.contractor
        : data?.contractor
          ? [data.contractor]
          : [];

      setSelectedCon(
        rawCon.map(c => ({
          conId: c?.conId?._id || c
        }))
      );

      setSelectValue(location.state.status)
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async (action) => {
      try {
        await dispatch(action());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(adminGetParty);
    fetchData(getDepartment);
    fetchData(getAuthPerson);
    fetchData(getYear);
    fetchData(getFirm);
    dispatch(getAdminProjectLocation({ status: true }));
    dispatch((AdminContractorMaster({ status: true })));
    dispatch((getAdminProjectType({ status: true })))
  }, [dispatch]);


  const partyData = useSelector((state) => state?.adminGetParty?.user?.data);
  const departmentData = useSelector((state) => state?.getDepartment?.user?.data);
  const managerData = useSelector((state) => state?.getAuthPerson?.user?.data);
  const yearData = useSelector((state) => state?.getYear?.user?.data);
  const firmData = useSelector((state) => state?.getFirm?.user?.data);
  const contractorData = useSelector((state) => state?.getAdminContractor?.user?.data) || [];
  const labelData = useSelector((state) => state?.getAdminProjectType?.user?.data) || [];
  // console.log(labelData);
  
  const locationData = useSelector((state) => state?.getAdminProjectLocation?.user?.data) || [];

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value })
  }
  // const handleEditFormChange = (e) => {
  //   setSelectedCon(e.target.value)
  //   setSelectedLabel(e.target.value)
  // }
const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onloadend = () => {
      setProject({
        ...project,
        company_logo: reader.result   // ✅ base64 string
      });
    };

    reader.readAsDataURL(file); // converts to base64
  }
};

  const handleLabelChange = (e) => {
    setSelectedLabel(e.value.map(id => ({ labelId: id })));
  };


  const handleContractorChange = (e) => {
    setSelectedCon(e.value.map(id => ({ conId: id })));
  };

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true);

      const bodyFormData = new URLSearchParams();
      bodyFormData.append('firm_id', project.firm);
      bodyFormData.append('year_id', project.year);

      bodyFormData.append('name', project.name);
      bodyFormData.append('location', project.location);
      bodyFormData.append('label', JSON.stringify(selectedLabel))
      bodyFormData.append('startDate', project.startDate);
      bodyFormData.append('endDate', project.endDate);
      bodyFormData.append('projectManager', project.manager);
      bodyFormData.append('department', project.department);
      bodyFormData.append('party', project.party);
      bodyFormData.append('details', project.details);
      bodyFormData.append('work_order_no', project.work_order_no);
      bodyFormData.append('contractor', JSON.stringify(selectedCon));

      bodyFormData.append('po_date', project.po_date);
       // ✅ FILE
    if (project.company_logo) {
      bodyFormData.append('company_logo', project.company_logo);
    }

      if (data?._id) {
        bodyFormData.append('id', data?._id)
        bodyFormData.append('status', selectValue)
      }

      axios({
        method: 'post',
        url: `${V_URL}/admin/manage-project`,
        data: bodyFormData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
      }).then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message)
          navigate('/admin/project-management');
          handleReset()
          setDisable(false);
        }
      }).catch((error) => {
        toast.error(error?.response?.data?.message);
        setDisable(false);
      })
    }
  }

  const handleReset = () => {
    setProject({
      name: "",
      location: "",
      label: "",
      startDate: "",
      endDate: "",
      manager: "",
      department: "",
      party: "",
      details: "",
      firm: "",
      year: "",
      po_date: "",
      company_logo: "",
    })
  }

  const validation = () => {
    let isValid = true;
    let err = {};

    if (!project.name || !project?.name?.trim()) {
      isValid = false;
      err['name_err'] = "Please enter name";
    }
    if (!project.firm) {
      isValid = false;
      err['firm_err'] = "Please select firm";
    }
    if (!project.year) {
      isValid = false;
      err['year_err'] = "Please select year";
    }
    if (!project.location || !project.location.trim()) {
      isValid = false;
      err['location_err'] = "Please enter location"
    }

    // if (!project.label || !project.label.trim()) {
    //   isValid = false;
    //   err['label_err'] = "Please enter label"
    // }
    if (selectedLabel?.length === 0) {
      isValid = false;
      err['label_err'] = "Please select Label";
    }
    if (!project.manager) {
      isValid = false;
      err['manager_err'] = "Please select manager";
    }

    // if (!project.department) {
    //   isValid = false;
    //   err['department_err'] = "Please select department";
    // }

    if (!project.party) {
      isValid = false;
      err['party_err'] = "Please select party";
    }

    if (!project.details || !project?.details?.trim()) {
      isValid = false;
      err['detail_err'] = "Please enter detail"
    }

    if (!project.work_order_no || !project?.work_order_no?.trim()) {
      isValid = false;
      err['work_order_no_err'] = "Please enter work order no."
    }

    if (selectedCon?.length === 0) {
      isValid = false;
      err['contractor_err'] = "Please select contractor";
    }

    if (!project.po_date) {
      isValid = false;
      err['po_date_err'] = "Please select po date"
    }
    setError(err);
    return isValid
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const conOptions = contractorData?.map((n) => ({
    label: n?.name,
    value: n?._id
  }));

  const labelOptions = labelData?.map((n) => ({
    label: n?.projectTypeName,
    value: n?._id
  }));


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
                  <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/admin/project-management">Project </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Project</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form >
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? 'Edit' : 'Add'} Project Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Firm <span className="login-danger">*</span></label>
                          <select className="form-select"
                            value={project.firm} name='firm' onChange={handleChange}>
                            <option value="">Select Firm</option>
                            {firmData?.map((e) =>
                              <option key={e?._id} value={e?._id}>{e?.name}</option>
                            )}
                          </select>
                          <div className='error'>{error.firm_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Year <span className="login-danger">*</span></label>
                          <select className="form-select"
                            value={project.year} name='year' onChange={handleChange}>
                            <option value="">Select Year </option>
                            {yearData?.map((e) =>
                              <option key={e?._id} value={e?._id}>{moment(e?.start_year).format('YYYY')}-{moment(e?.end_year).format('YYYY')}</option>
                            )}
                          </select>
                          <div className='error'>{error.year_err}</div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Project <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={project.name} name='name' onChange={handleChange}
                          />
                          <div className='error'>{error.name_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Work Order / PO No. <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={project.work_order_no} name='work_order_no' onChange={handleChange}
                          />
                          <div className='error'>{error.work_order_no_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> PO Date <span className="login-danger">*</span></label>
                          <input className="form-control" type="date"
                            value={project.po_date} name='po_date' onChange={handleChange}
                          />
                          <div className='error'>{error.po_date_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Location <span className="login-danger">*</span></label>
                          {/* <input className="form-control" type="text"
                            value={project.location} name='location' onChange={handleChange}
                          /> */}
                          <select className='form-control form-select' value={project.location} name='location' onChange={handleChange}>
                            <option value="">Select Project Location</option>
                            {locationData?.map((e, i) =>
                              <option value={e?._id} key={i}>{e?.name}</option>
                            )}
                          </select>
                          <div className='error'>{error.location_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Project Type <span className="login-danger">*</span></label>
                          <MultiSelect value={
                                Array.isArray(selectedLabel)
                                  ? selectedLabel.map(c => c?.labelId || c)
                                  : []
                              }
                            onChange={handleLabelChange}
                            options={labelOptions}
                            optionLabel="label"
                            placeholder="Select Project Type"
                            className='w-100 multi-prime-react'
                          />
                          <div className='error'>{error.label_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Manager <span className="login-danger">*</span></label>
                          <select className="form-select"
                            value={project.manager} name='manager' onChange={handleChange}>
                            <option value="">Select Manager</option>
                            {managerData?.map((e) =>
                              <option key={e?._id} value={e?._id}>{e?.name}</option>
                            )}
                          </select>
                          <div className='error'>{error.manager_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Department </label>
                          <select className="form-select"
                            value={project.department} name='department' onChange={handleChange}
                          >
                            <option>Select Department</option>
                            {departmentData?.map((e) =>
                              <option key={e?._id} value={e?._id}>{e?.name}</option>
                            )}
                          </select>
                          <div className='error'>{error.department_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Client <span className="login-danger">*</span></label>
                          <select className="form-select"
                            value={project.party} name='party' onChange={handleChange}>
                            <option>Select Client</option>
                            {partyData?.map((e) =>
                              <option key={e?._id} value={e?._id}>{e?.name}</option>
                            )}
                          </select>
                          <div className='error'>{error.party_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Start Date </label>
                          <input className="form-control" type="date"
                            value={project.startDate} name='startDate' onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> End Date </label>
                          <input className="form-control" type="date"
                            value={project.endDate} name='endDate' onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Contractor <span className="login-danger">*</span></label>
                          <MultiSelect
                            value={selectedCon.map(c => c.conId)}
                            onChange={handleContractorChange}
                            options={conOptions}
                            optionLabel="label"
                            placeholder="Select Contractor"
                            className='w-100 multi-prime-react'
                          />

                          <div className='error'>{error.contractor_err}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Company Logo </label>
                         <input
                            className="form-control"
                            type="file"
                            name="company_logo"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      {data?._id && project.company_logo && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <img src={project.company_logo}  style={{ maxWidth: '200px', height: 'auto' }} alt="Company Logo" />
                          </div>
                        </div>
                      )}

                      <div className="col-12 col-md-12 col-xl-12">
                        <div className="input-block local-forms">
                          <label> Details <span className="login-danger">*</span></label>
                          <textarea className="form-control" type="date"
                            value={project.details} name='details' onChange={handleChange}
                          />
                          <div className='error'>{error.detail_err}</div>
                        </div>
                      </div>

                    </div>
                  </form>
                  {data?._id ? (
                    <div className='col-12 col-md-4 col-xl-4'>
                      <div className="cardNum">
                        <div className="mb-3">
                          <label htmlFor="fileUpload" className="form-label">Status</label>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" onChange={handleRadioChange} checked={selectValue} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                      <button type="button"
                        className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
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

export default ManageProject