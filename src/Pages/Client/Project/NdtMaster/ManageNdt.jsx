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

const ManageNdt = () => {

  const dispatch = useDispatch()
  const [ndt, setNdt] = React.useState('');
  const [selectedJoint, setSelectedJoint] = React.useState([]);
  const [exam, setExam] = useState('');
  const [disable, setDisable] = React.useState(false);
  const [error, setError] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    if (location.state) {
      setNdt(location.state.name);
      setSelectValue(location.state.status);
      setExam(location.state.examination);
      setSelectedJoint(location.state.joint_type?.map((e) => e?._id));
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(getUserJointType({ status: '' }));
  }, []);

  const jointData = useSelector((state) => state?.getUserJointType?.user?.data) || [];

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleEditFormChange = (val) => {
    setSelectedJoint(val)
  };

  const handleSubmit = () => {
    if (!ndt?.trim() || !exam || selectedJoint?.length === 0) {
      toast.error('Please fill all the required fields');
      return;
    }

    setDisable(true);
    const myurl = `${V_URL}/user/manage-ndt`;
    const formData = new URLSearchParams();
    formData.append('name', ndt);
    formData.append('examination', exam);
    formData.append('joint_type', JSON.stringify(selectedJoint));
    formData.append('project', localStorage.getItem('U_PROJECT_ID'));
    if (data?._id) {
      formData.append('id', data._id);
      formData.append('status', selectValue);
    }

    axios({
      method: "post",
      url: myurl,
      data: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((response) => {
      if (response.data.success === true) {
        toast.success(response.data.message)
        navigate('/user/project-store/ndt-master-management');
      } else {
        toast.error(response.data.message);
      }
      setDisable(false);
    }).catch((error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
      setDisable(false);
    })
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const jointTypeOptions = jointData?.map((e) => ({
    value: e._id,
    label: e.name,
  }))

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
                  <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/user/project-store/ndt-master-management">NDT List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} NDT</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} NDT Master Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> NDT <span className="login-danger">*</span></label>
                          <input type="text" className="form-control"
                            onChange={(e) => setNdt(e.target.value)} value={ndt} />
                          <div className='error'>{error}</div>
                        </div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms custom-select-wpr'>
                          <label>Weld Type<span className="login-danger">*</span></label>
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
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className="input-block local-forms">
                          <label> Extent of examination <span className="login-danger">*</span></label>
                          <input type="number" className="form-control" value={exam} onChange={(e) => setExam(e.target.value)} />
                        </div>
                      </div>

                      {data?._id ? (
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
                      ) : null}
                    </div>
                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                        <button type="button"
                          className="btn btn-primary cancel-form" onClick={() => setNdt('')}>Reset</button>
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

export default ManageNdt