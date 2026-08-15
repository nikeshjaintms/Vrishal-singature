import React, { useEffect, useState } from 'react'
import Header from '../Include/Header'
import Sidebar from '../Include/Sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCategory } from '../../../Store/Store/StoreMaster/Category/Category';
import { getUnit } from '../../../Store/Store/StoreMaster/Unit/Unit';
import Footer from '../Include/Footer';
import { addItem } from '../../../Store/Store/Item/ManageItem';
import { getLocation } from '../../../Store/Store/StoreMaster/InventoryLocation/Location';
import toast from 'react-hot-toast';
import { P_STORE } from '../../../BaseUrl';

const ManageItem = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;
  const [item, setItem] = useState({
    name: "",
    unit: "",
    hsn_code: "",
    gst_percentage: 0,
    purchase_rate: 0,
    sale_rate: 0,
    cost_rate: 0,
    reorder_quantity: 0,
    category: "",
    material_grade: "",
    detail: "",
    in_location: "",
    mcode: ""
  });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState('');
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    if (localStorage.getItem('PAY_USER_TOKEN') === null) {
      navigate("/user/login");
    } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
      toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
      navigate("/user/login");
    }
  }, [navigate]);

  useEffect(() => {

    if (location.state) {
      setItem({
        name: location.state?.name,
        unit: location.state.unit?._id,
        hsn_code: location.state?.hsn_code,
        gst_percentage: location.state?.gst_percentage,
        purchase_rate: location.state?.purchase_rate,
        sale_rate: location.state?.sale_rate,
        cost_rate: location.state?.cost_rate,
        reorder_quantity: location.state?.reorder_quantity,
        category: location.state.category?._id,
        material_grade: location.state?.material_grade,
        detail: location.state?.detail,
        in_location: location.state?.location?._id,
        mcode: location.state.mcode
      })

      setSelectValue(location.state?.status)
    }

  }, [location.state])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getCategory()),
          dispatch(getUnit()),
          dispatch(getLocation())
        ]);
      } catch (error) {
        console.log(error, '!!');
      }
    };

    fetchData();
  }, [dispatch]);


  const categoryData = useSelector((state) => state?.getCategory?.user?.data);
  const unitData = useSelector((state) => state?.getUnit?.user?.data);
  const locationData = useSelector((state) => state?.getLocation?.user?.data);

  const handleRadioChange = (event) => {
    setSelectValue(event.target.checked);
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value })
  }


  const handleSubmit = () => {
    if (validation()) {

      setDisable(true)
      const formData = new URLSearchParams();

      formData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
      formData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));

      formData.append('name', item.name);
      formData.append('unit', item.unit);
      formData.append('hsn_code', item.hsn_code);
      formData.append('gst_percentage', item.gst_percentage === '' ? 0 : item.gst_percentage);
      formData.append('purchase_rate', item.purchase_rate === '' ? 0 : item.purchase_rate);
      formData.append('sale_rate', item.sale_rate === '' ? 0 : item.sale_rate);
      formData.append('cost_rate', item.cost_rate === '' ? 0 : item.cost_rate);
      formData.append('reorder_quantity', item.reorder_quantity === '' ? 0 : item.reorder_quantity);
      formData.append('category', item.category);
      formData.append('material_grade', item.material_grade);
      formData.append('detail', item.detail);
      formData.append('location', item.in_location);
      formData.append('mcode', item.mcode);

      if (data?._id) {
        formData.append('id', data?._id);
        formData.append('status', selectValue);
      }

      dispatch(addItem(formData))
        .then((res) => {
          if (res.payload.success === true) {
            navigate('/product-store/user/item-management')

          }
          setDisable(false)
        }).catch((error) => {
          setDisable(false);
        })
    }
  }


  const handleReset = () => {
    setItem({
      name: "",
      unit: "",
      hsn_code: "",
      gst_percentage: "",
      purchase_rate: "",
      sale_rate: "",
      cost_rate: "",
      reorder_quantity: "",
      category: "",
      material_grade: "",
      detail: "",
      mcode: "",
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }

  const validation = () => {
    var isValid = true;
    let err = {};

    if (!item.name || !item?.name.trim()) {
      isValid = false;
      err['name_err'] = "Please enter name";
    }

    if (!item.unit) {
      isValid = false;
      err['unit_err'] = "Please select unit";
    }

    if (!item.category) {
      isValid = false;
      err['category_err'] = "Please select category";
    }

    if (!item.in_location) {
      isValid = false;
      err['in_location_err'] = "Please select location";
    }

    if (!item.hsn_code) {
      isValid = false;
      err['hsn_code_err'] = "Please enter hsn";
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
                  <li className="breadcrumb-item"><Link to="/product-store/user/item-management">Item List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Item</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} Item Details</h4>
                      </div>
                    </div>

                    <div className="row">

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Name <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='name' value={item.name}
                          />
                          <div className='error'>{error.name_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Unit <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={item.unit}
                            onChange={handleChange} name='unit'
                          >
                            <option value="">Select Unit</option>
                            {unitData?.map((e) => (
                              <option key={e._id} value={e._id}>
                                {e?.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.unit_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Category <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={item.category}
                            onChange={handleChange} name='category'
                          >
                            <option value="">Select Category</option>
                            {categoryData?.map((e) => (
                              <option key={e._id} value={e._id}>
                                {e?.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.category_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> HSN <span className="login-danger">*</span></label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='hsn_code' value={item.hsn_code} />
                          <div className='error'>{error.hsn_code_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Grade </label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='material_grade' value={item.material_grade}
                          />
                          <div className='error'>{error.material_grade_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> MCode </label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name='mcode' value={item.mcode}
                          />
                          <div className='error'>{error.mcode_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> GST(%) </label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='gst_percentage' value={item.gst_percentage}
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown} />
                          <div className='error'>{error.gst_percentage_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Purchase </label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='purchase_rate' value={item.purchase_rate}
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                          />
                          <div className='error'>{error.purchase_rate_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Sale </label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='sale_rate' value={item.sale_rate}
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                          />
                          <div className='error'>{error.sale_rate_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Cost </label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='cost_rate' value={item.cost_rate}
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                          />
                          <div className='error'>{error.cost_rate_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Reorder Quantity </label>
                          <input className="form-control" type="number"
                            onChange={handleChange} name='reorder_quantity' value={item.reorder_quantity}
                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                          />
                          <div className='error'>{error.reorder_quantity_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Location <span className="login-danger">*</span></label>
                          <select className="form-control select"
                            value={item.in_location}
                            onChange={handleChange} name='in_location'
                          >
                            <option value="">Select Location</option>
                            {locationData?.map((e) => (
                              <option key={e._id} value={e._id}>
                                {e?.name}
                              </option>
                            ))}
                          </select>
                          <div className='error'>{error.in_location_err}</div>
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
                          <label> Details</label>
                          <textarea className="form-control" type="text"
                            onChange={handleChange} name='detail' value={item.detail}
                          />
                          {/* <div className='error'>{error.detail_err}</div> */}
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

export default ManageItem