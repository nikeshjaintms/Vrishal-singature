import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getParty } from '../../Store/Store/Party/Party';
import { getProject } from '../../Store/Store/Project/Project';
import { getGenMaster } from '../../Store/Store/GenralMaster/GenMaster';
import moment from 'moment';
import { V_URL } from '../../BaseUrl';
import axios from 'axios';
import { getAdminTransport } from '../../Store/Store/StoreMaster/Transport/AdminTransport';
import { Dropdown } from 'primereact/dropdown';


const PurchaseRequestForm = ({ title, dropdown_name, formData, tag_number, isEdit, handleSubmit }) => {
  const dispatch = useDispatch();
  const [orderError, setOrderError] = useState({});
  const [machineData, setMachineData] = useState([]);
  const [disable, setDisable] = useState(false);

  const [SingleItems, setSingleItems] = useState({
    unit: '',
    gst: '',
    mcode: '',
    item_id: '',
    item_name: '',
    voucher_no: '',
    project_id: '',
    master_id: '',
    is_edit: isEdit,
    isexternal: false,
    vehical_no: '',
    challan: '',
    receive_date: '',
    payment_date: '',
    payment_days: '',
    lr_no: '',
    lr_date: '',
    gate_pass_no: '',
    issue_no: '',
    store_location: '',
    // approve_by: '',
    status: '',
    department: '',
    // transport_id,
    // vehical_no,
    // po_no,
    // site_location,
  });
  useEffect(() => {
    dispatch(getGenMaster({ tag_id: 9 }));
    dispatch(getParty({ storeType: '1', is_main: true }));
    dispatch(getProject())
    dispatch(getAdminTransport({ is_main: true }))
    getMachineCode()
  }, []);

  useEffect(() => {
    if (isEdit) {
      setSingleItems({
        id: formData?._id,
        order_date: moment(formData.order_date).format('YYYY-MM-DD') || '',
        voucher_no: formData?.voucher_no,
        bill_no: formData?.bill_no,
        master_id: formData?.master?._id,
        is_edit: isEdit,
        isexternal: formData?.isexternal,
        machine_code: formData?.machine?._id,
        transport_id: formData?.transport_details?._id,
        vehical_no: formData?.vehical_no,
        store_location: formData?.store_location,
        // approve_by: formData?.approve_by,
        status: formData?.status,
        site_location: formData?.site_location,
        department: formData?.department,
        receive_date: formData?.receive_date || '',
        payment_date: moment(formData?.payment_date).format('YYYY-MM-DD') || '',
        payment_days: formData?.payment_days,
        lr_no: formData?.lr_no,
        gate_pass_no: formData?.gate_pass_no,
        trans_date: formData?.trans_date
      });
    }
  }, [isEdit, formData]);

  const parties = useSelector((state) => state.getParty?.user?.data || []);
  const projects = useSelector((state) => state.getProject?.user?.data || []);
  const reciever = useSelector((state) => state.getGenMaster?.user?.data || []);
  const transport = useSelector((state) => state.getAdminTransport?.user?.data || []);


  const getMachineCode = () => {
    axios({
      method: "get",
      url: `${V_URL}/user/get-master`,
      params: { tag_id: 16 },
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((res) => {
      if (res.data.success === true) {
        setMachineData(res.data.data);
      }
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSingleItems({ ...SingleItems, [name]: value });
    setOrderError((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  useEffect(() => {
    if (SingleItems.order_date && SingleItems.payment_date) {
      const orderDate = moment(SingleItems.order_date);
      const paymentDate = moment(SingleItems.payment_date);
      const diffDays = paymentDate.diff(orderDate, 'days');
      setSingleItems((prevItems) => ({ ...prevItems, payment_days: diffDays }));
    }
  }, [SingleItems.order_date, SingleItems.payment_date]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSingleItems((prevState) => ({
      ...prevState,
      trans_date: today
    }));
  }, []);
  const Ordervalidation = () => {
    let isValid = true;
    let err = {};
    const today = new Date().toISOString().split("T")[0];
    if (!SingleItems.trans_date) {
      isValid = false;
      err['trans_date'] = "Please select a transaction date";
    } else if (SingleItems.trans_date > today) {
      isValid = false;
      err['trans_date'] = "Transaction date cannot be in the future";
    }

    if (!SingleItems.master_id) {
      isValid = false;
      err['master_id'] = "Please enter the name of the person who prepared the order";
    }
    setOrderError(err);
    return isValid;
  };
  const handleFormSubmit = () => {
    if (Ordervalidation()) {
      setDisable(true);
      handleSubmit(SingleItems);
    }
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="col-12 d-flex justify-content-between">
              <div className="form-heading"><h4>{title}</h4></div>
            </div>
            <div className="row">
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>PR Date <span className="login-danger">*</span></label>
                  <input
                    className="form-control"
                    type="date"
                    name="trans_date"
                    value={SingleItems.trans_date}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]} // Disable future dates
                  />
                  <div className='error'>{orderError?.trans_date}</div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>{dropdown_name} <span className="login-danger">*</span></label>
                  <Dropdown
                    value={SingleItems?.master_id} // The selected _id
                    options={reciever?.map((item) => ({
                      label: item.name, // Display name
                      value: item._id, // Store _id
                    }))}
                    onChange={(e) => handleChange({ target: { name: "master_id", value: e.value } })}
                    placeholder={`Select ${dropdown_name}`}
                    filter
                    filterBy="label"
                    appendTo="self"
                    className="w-100 multi-prime-react model-prime-multi"
                  />
                  <div className="error">{orderError?.master_id}</div>
                </div>
              </div>
            </div>
            <div className="row">

              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>Store Location </label>
                  <input type='text' className="form-control" value={SingleItems.store_location} name='store_location' onChange={handleChange} />
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>Department</label>
                  <input type='text' className="form-control" value={SingleItems.department} name='department' onChange={handleChange} />
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>Site Location </label>
                  <input type='text' className="form-control" value={SingleItems.site_location} name='site_location' onChange={handleChange} />
                </div>
              </div>
              {/* <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>Approve By </label>
                  <input type='text' className="form-control" value={SingleItems.approve_by} name='approve_by' onChange={handleChange} />
                </div>
              </div> */}
            </div>
            {
              tag_number === 11 ? "" : <div className="col-12">
                <div className="doctor-submit text-end">
                  <button type="button" className="btn btn-primary submit-form me-2" onClick={handleFormSubmit}> {isEdit ? 'Save' : 'Submit'}</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseRequestForm