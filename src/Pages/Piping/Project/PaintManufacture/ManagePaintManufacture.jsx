import React, { useEffect, useState } from 'react'
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManagePaintManufacture = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [disable, setDisable] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    if (location.state) {
      setName(location.state.name);
    }
    setSelectValue(location.state?.status);
  }, [location.state])

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleSubmit = () => {
    if (!name?.trim()) {
      setError('Please enter manufacturer name');
      return;
    }
    setError('');
    setDisable(true);
    const myurl = `${V_URL}/user/manage-paint-manufacturer-piping`;
    const formData = new URLSearchParams();
    formData.append('name', name);
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
        navigate('/piping/user/paint-manufacture-management')
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setDisable(false);
    }).catch((error) => {
      console.log(error, '!!');
      toast.error(error?.response?.data?.message || 'Something went wrong')
      setDisable(false);
    })
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/paint-manufacture-management">Paint Manufacturer List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Paint Manufacturer</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} Paint Manufacture Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Name <span className="login-danger">*</span></label>
                          <input type="text" className="form-control"
                            onChange={(e) => setName(e.target.value)} value={name} />
                          <div className='error'>{error}</div>
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
                          className="btn btn-primary cancel-form" onClick={() => setName('')}>Reset</button>
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

export default ManagePaintManufacture