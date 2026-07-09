import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Footer from '../../Include/Footer';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { addTransport } from '../../../../Store/Store/StoreMaster/Transport/ManageTransport';
import toast from 'react-hot-toast';
import { P_STORE } from '../../../../BaseUrl';


const ManageTransport = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [transport, setTransport] = useState({ name: "", email: "", phone: "", address: "" });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const data = location.state;

  useEffect(() => {

    if (location.state) {
      setTransport({
        name: location.state.name,
        email: location.state.email,
        phone: location.state.phone,
        address: location.state.address
      });
      setSelectValue(location.state?.status);
    }

  }, [location.state]);

  useEffect(() => {
    if (localStorage.getItem('PAY_USER_TOKEN') === null) {
      navigate("/user/login");
    } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
      toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
      navigate("/user/login");
    }
  }, [navigate]);

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleChange = (e) => {
    setTransport({ ...transport, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true)
      const formData = new URLSearchParams();

      formData.append('name', transport.name);
      formData.append('email', transport.email);
      formData.append('phone', transport.phone);
      formData.append('address', transport.address);

      if (data?._id) {
        formData.append('id', data?._id);
        formData.append('status', selectValue);
      }

      dispatch(addTransport(formData))
        .then((res) => {
          if (res.payload.success === true) {
            navigate('/product-store/user/transport-management');
            setTransport({
              name: "",
              address: "",
              phone: "",
              email: "",
            });
          }
          setDisable(false)
        }).catch((error) => {
          setDisable(false)
        })
    }
  }

  const validation = () => {
    var isValid = true;
    let err = {};

    if (!transport.name || !transport?.name.trim()) {
      isValid = false;
      err['name_err'] = "Please enter name";
    }


    if (transport.email) {
      if (!transport.email) {
        isValid = false;
        err['email_err'] = "Please enter email"
      } else if (typeof transport.email !== "undefined") {
        let lastAtPos = transport.email.lastIndexOf('@');
        let lastDotPos = transport.email.lastIndexOf('.');

        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && transport.email.indexOf('@@') === -1 && lastDotPos > 2 && (transport.email.length - lastDotPos) > 2)) {
          isValid = false;
          err["email_err"] = "Email is not valid";
        }
      }
    }

    if (!transport.phone) {
      isValid = false;
      err["phone_err"] = "Please enter mobile";
    } else if (!/^\d{10,11}$/.test(transport.phone)) {
      isValid = false;
      err['phone_err'] = 'Please enter a valid mobile';
    }

    if (!transport.address || !transport?.address?.trim()) {
      isValid = false;
      err['address_err'] = "Please enter address";
    }

    setError(err);
    return isValid;

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
                  <li className="breadcrumb-item"><Link to="/product-store/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/product-store/user/transport-management">Transport List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Transport</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} Transport Details</h4>
                      </div>
                    </div>


                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Name <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='name' value={transport.name}
                          />
                          <div className='error'>{error.name_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Email</label>
                          <input className="form-control" type="email"
                            onChange={handleChange} name='email' value={transport?.email}
                          />
                          <div className='error'>{error.email_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Mobile <span className="login-danger">*</span></label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='phone' value={transport.phone}
                          />
                          <div className='error'>{error.phone_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-12 col-xl-12">
                        <div className="input-block local-forms">
                          <label> Address <span className="login-danger">*</span></label>
                          <textarea className="form-control"
                            onChange={handleChange} name='address' value={transport.address}
                          />
                          <div className='error'>{error.address_err}</div>
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

                    </div>
                  </form>
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                      <button type="button"
                        className="btn btn-primary cancel-form" onClick={() => setTransport({ name: "", email: "", phone: "", address: "" })}>Reset</button>
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

export default ManageTransport