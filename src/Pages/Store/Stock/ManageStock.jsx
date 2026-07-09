import React, { useEffect, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLocation } from '../../../Store/Store/StoreMaster/InventoryLocation/Location';
import { getItem } from '../../../Store/Store/Item/Item';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageStock = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stock, setStock] = useState({
    item: "",
    location: "",
    quantity: "",
    type: "",
  });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('PAY_USER_TOKEN') === null) {
      navigate("/user/login");
    } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
      toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
      navigate("/user/login");
    }
  }, [navigate]);

  const data = location.state;

  useEffect(() => {
    if (location.state) {
      setStock({
        item: location.state?.item?._id,
        location: location.state?.location?._id,
        quantity: location.state?.quantity,
        type: location.state?.type,
      })
    }
  }, [location.state]);

  useEffect(() => {
    const fetchLocation = () => {
      try {
        dispatch(getLocation())
      } catch (error) {
        console.log(error, '!!')
      }
    }
    const fetchItem = () => {
      try {
        dispatch(getItem())
      } catch (error) {
        console.log(error, '!!!');
      }
    }
    fetchItem();
    fetchLocation();
  }, [dispatch]);

  const locationData = useSelector((state) => state?.getLocation?.user?.data);
  const itemData = useSelector((state) => state?.getItem?.user?.data);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  }

  const handleSubmit = () => {
    if (validation()) {

      setDisable(true);
      const myurl = `${V_URL}/user/manage-stock`;

      const formData = new URLSearchParams();

      formData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
      formData.append('item', stock.item);
      formData.append('location', stock.location);
      formData.append('quantity', stock.quantity);
      formData.append('type', stock.type);

      if (data?._id) {
        formData.append('id', data?._id);
      }

      axios({
        method: "post",
        data: formData,
        url: myurl,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data.success === true) {
          navigate('/main-store/user/stock-management');
          toast.success(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
        setDisable(false);
      })
    }
  }


  const validation = () => {
    var isValid = true;
    let err = {};

    if (!stock.item) {
      isValid = false;
      err['item_err'] = "Please select item";
    }

    if (!stock.location) {
      isValid = false;
      err['location_err'] = "Please select location";
    }

    if (!stock.type) {
      isValid = false;
      err['type_err'] = "Please select type";
    }

    if (!stock.quantity) {
      isValid = false;
      err['quantity_err'] = "Please enter quantity";
    }


    setError(err);
    return isValid;
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
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
                  <li className="breadcrumb-item"><Link to="/main-store/user/stock-management">Stock List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Stock</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} Stock Details</h4>
                      </div>
                    </div>

                    <div className="row">

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Item <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={stock.item}
                            onChange={handleChange} name='item'
                          >
                            <option value="">Select Item</option>
                            {itemData?.map((e) => (
                              <option key={e._id} value={e._id}>
                                {e?.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.item_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Location <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={stock.location}
                            onChange={handleChange} name='location'
                          >
                            <option value="">Select Location</option>
                            {locationData?.map((e) => (
                              <option key={e._id} value={e._id}>
                                {e?.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.location_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Type <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={stock.type}
                            onChange={handleChange} name='type'
                          >
                            <option value="">Select Type</option>
                            <option value={1}>Main Store</option>
                            <option value={2}>Sub Store</option>
                          </select>
                          <div className='error'>{error.type_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Quantity <span className="login-danger">*</span></label>
                          <input className="form-control" type="number"
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                            onChange={handleChange} name='quantity' value={stock.quantity}
                          />
                          <div className='error'>{error.quantity_err}</div>
                        </div>
                      </div>

                    </div>
                  </form>

                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                      <button type="button"
                        className="btn btn-primary cancel-form" onClick={() => setStock({
                          item: "",
                          location: "",
                          quantity: "",
                          type: "",
                        })}>Reset</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageStock