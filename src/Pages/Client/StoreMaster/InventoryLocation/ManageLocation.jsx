import React, { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Footer from '../../Include/Footer';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { addLocation } from '../../../../Store/Store/StoreMaster/InventoryLocation/ManageLocation';

const ManageLocation = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;
  // console.log(data, '@@')

  useEffect(() => {
    if (location.state) {
      setInventoryLocation({
        name: location.state.name,
        address: location.state.address
      });
      setSelectValue(location.state?.status);
    }
  }, [location.state]);

  useEffect(() => {
    // if (localStorage.getItem('PAY_USER_TOKEN') === null) {
    //   navigate("/user/login");
    // } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
    //   toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
    //   navigate("/user/login");
    // }
  }, [navigate]);

  const [inventoryLocation, setInventoryLocation] = useState({ name: "", address: "" });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleChange = (e) => {
    setInventoryLocation({ ...inventoryLocation, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true)
      const formData = new URLSearchParams();

      formData.append('name', inventoryLocation.name);
      formData.append('address', inventoryLocation.address);

      if (data?._id) {
        formData.append('id', data?._id);
        formData.append('status', selectValue);
      }

      dispatch(addLocation(formData)).then((res) => {
        // console.log(res, 'REs');
        if (res.payload.success === true) {
          navigate('/user/project-store/inventory-location-management');
          setInventoryLocation({
            name: "",
            address: ""
          });
        }
        setDisable(false)
      }).catch((error) => {
        // console.log(error, 'Error')
        setDisable(false)
      })
    }
  }

  const validation = () => {
    var isValid = true;
    let err = {};

    if (!inventoryLocation.name || !inventoryLocation?.name.trim()) {
      isValid = false;
      err['name_err'] = "Please enter name";
    }

    if (!inventoryLocation.address || !inventoryLocation?.address?.trim()) {
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

  const handleReset = () => {
    setInventoryLocation({ name: "", address: "" })
    setError("")
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
                  <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/user/project-store/inventory-location-management">Inventory Location List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Inventory Location</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} Inventory Location Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Name <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='name' value={inventoryLocation.name}
                          />
                          <div className='error'>{error.name_err}</div>
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
                          <label> Address <span className="login-danger">*</span></label>
                          <textarea className="form-control"
                            onChange={handleChange} name='address' value={inventoryLocation.address}
                          />
                          <div className='error'>{error.address_err}</div>
                        </div>
                      </div>

                    </div>
                  </form>
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

export default ManageLocation