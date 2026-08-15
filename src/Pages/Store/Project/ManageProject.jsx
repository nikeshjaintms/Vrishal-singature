import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { getUserDepartment } from '../../../Store/Store/StoreMaster/Department/Department';
import { getUserEmployee } from '../../../Store/Store/StoreMaster/Employee/Employee';
import { getParty } from '../../../Store/Store/Party/Party';

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
  });
  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState({});
  const [selectValue, setSelectValue] = useState('');
  const data = location.state;
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('PAY_USER_TOKEN') === null) {
      navigate("/user/login");
    } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
      toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
      navigate("/user/login");
    }
  }, [navigate]);

  useEffect(() => {

    if (location.state) {

      setProject({
        name: location.state?.name,
        location: location?.state?.location,
        label: location?.state?.label,
        startDate: moment(location?.state?.startDate).format('YYYY-MM-DD'),
        endDate: moment(location?.state?.endDate).format('YYYY-MM-DD'),
        manager: location?.state?.projectManager?._id,
        department: location?.state?.department?._id,
        party: location?.state?.party?._id,
        details: location?.state?.details
      });

      setSelectValue(location.state.status)
    }
  }, [location.state]);

  useEffect(() => {

    const fetchDepartment = () => {
      try {
        dispatch(getUserDepartment())
      } catch (error) {
        console.log(error, '!!')
      }
    }

    const fetchEmployee = () => {
      try {
        dispatch(getUserEmployee())
      } catch (error) {
        console.log(error, '!!!')
      }
    }

    const fetchParty = () => {
      try {
        dispatch(getParty({ storeType: '1', is_main: true }))
      } catch (error) {
        console.log(error, '!!')
      }
    }

    fetchParty();
    fetchDepartment();
    fetchEmployee();

  }, [dispatch]);

  const partyData = useSelector((state) => state?.getParty?.user?.data);
  const departmentData = useSelector((state) => state?.getUserDepartment?.user?.data);
  const managerData = useSelector((state) => state?.getUserEmployee?.user?.data);

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true);

      const bodyFormData = new URLSearchParams();
      bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
      bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));

      bodyFormData.append('name', project.name);
      bodyFormData.append('location', project.location);
      bodyFormData.append('label', project.label)
      bodyFormData.append('startDate', project.startDate);
      bodyFormData.append('endDate', project.endDate);
      bodyFormData.append('projectManager', project.manager);
      bodyFormData.append('department', project.department);
      bodyFormData.append('party', project.party);
      bodyFormData.append('details', project.details);

      if (data?._id) {
        bodyFormData.append('id', data?._id)
        bodyFormData.append('status', selectValue)
      }

      axios({
        method: 'post',
        url: `${V_URL}/user/manage-project`,
        data: bodyFormData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
      }).then((response) => {
      
        if (response.data.success === true) {

          toast.success(response.data.message)
          navigate('/main-store/user/project-management');
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
          })
          setDisable(false);
        }
      }).catch((error) => {
        console.log(error);
        toast.error(error.response.data?.message);
        setDisable(false);
      })
    }
  }

  const validation = () => {
    let isValid = true;
    let err = {};

    if (!project.name || !project?.name?.trim()) {
      isValid = false;
      err['name_err'] = "Please enter name"
    }

    if (!project.location || !project.location.trim()) {
      isValid = false;
      err['location_err'] = "Please enter location"
    }

    if (!project.label || !project.label.trim()) {
      isValid = false;
      err['label_err'] = "Please enter label"
    }

    if (!project.startDate) {
      isValid = false;
      err['startDate_err'] = "Please select start date";
    }

    if (!project.endDate) {
      isValid = false;
      err['endDate_err'] = "Please select end date";
    }

    if (!project.manager) {
      isValid = false;
      err['manager_err'] = "Please select manager";
    }

    if (!project.department) {
      isValid = false;
      err['department_err'] = "Please select department";
    }

    if (!project.party) {
      isValid = false;
      err['party_err'] = "Please select party";
    }

    if (!project.details || !project.details.trim()) {
      isValid = false;
      err['detail_err'] = "Please enter detail"
    }

    setError(err);
    return isValid
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen)
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
                  <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/main-store/user/project-management">Project </Link></li>
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
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? 'Edit' : 'Add'} Project Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Name <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={project.name} name='name' onChange={handleChange}
                          />
                          <div className='error'>{error.name_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Location <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={project.location} name='location' onChange={handleChange}
                          />
                          <div className='error'>{error.location_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Label <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            value={project.label} name='label' onChange={handleChange}
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
                              <option key={e?._id} value={e?._id}>{e?.full_name}</option>
                            )}
                          </select>
                          <div className='error'>{error.manager_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Department <span className="login-danger">*</span></label>
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
                          <label> Party <span className="login-danger">*</span></label>
                          <select className="form-select"
                            value={project.party} name='party' onChange={handleChange}
                          >
                            <option>Select Party</option>
                            {partyData?.map((e) =>
                              <option key={e?._id} value={e?._id}>{e?.name}</option>
                            )}
                          </select>
                          <div className='error'>{error.party_err}</div>
                        </div>
                      </div>


                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Start Date <span className="login-danger">*</span></label>
                          <input className="form-control" type="date"
                            value={project.startDate} name='startDate' onChange={handleChange}
                          />
                          <div className='error'>{error.startDate_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> End Date <span className="login-danger">*</span></label>
                          <input className="form-control" type="date"
                            value={project.endDate} name='endDate' onChange={handleChange}
                          />
                          <div className='error'>{error.endDate_err}</div>
                        </div>
                      </div>

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
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                      <button type="button"
                        className="btn btn-primary cancel-form" onClick={() => setProject({
                          name: "",
                          location: "",
                          label: "",
                          startDate: "",
                          endDate: "",
                          manager: "",
                          department: "",
                          party: "",
                          details: "",
                        })}>Reset</button>
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