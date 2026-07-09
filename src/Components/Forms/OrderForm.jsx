import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getParty } from '../../Store/Store/Party/Party';
import { getProject } from '../../Store/Store/Project/Project';
import { getGenMaster } from '../../Store/Store/GenralMaster/GenMaster';
import moment from 'moment';
import { V_URL } from '../../BaseUrl';
import axios from 'axios';
import { getAdminTransport } from '../../Store/Store/StoreMaster/Transport/AdminTransport';
import toast from 'react-hot-toast';
import { Dropdown } from 'primereact/dropdown';

const OrderForm = ({ title, dropdown_name, formData, tag_number, isEdit, handleSubmit }) => {

  const dispatch = useDispatch();
  const [orderError, setOrderError] = useState({});
  const [machineData, setMachineData] = useState([]);
  const [disable, setDisable] = useState(false);
  const [showDriverField, setShowDriverField] = useState(false);

  const [SingleItems, setSingleItems] = useState({
    unit: '',
    gst: '',
    mcode: '',
    item_id: '',
    item_name: '',
    trans_date: '',
    voucher_no: '',
    bill_no: '',
    party_id: '',
    project_id: '',
    master_id: '',
    is_edit: isEdit,
    isexternal: false,
    transport_date: '',
    upload_pdf: '',
    transport_id: '',
    vehical_no: '',
    po_no: '',
    challan_no: '',
    receive_date: '',
    payment_date: '',
    payment_days: '',
    lr_no: '',
    lr_date: '',
    issue_no: '',
    gate_pass_no: '',
    // issue_no: '',
    site_location: '',
    address: ''
  });

  useEffect(() => {
    dispatch(getGenMaster({ tag_id: tag_number }));
    dispatch(getParty({ storeType: '1', is_main: true }));
    dispatch(getProject())
    dispatch(getAdminTransport({ is_main: true }))
    getMachineCode()
  }, []);


  useEffect(() => {
    if (isEdit) {
      setSingleItems({
        id: formData?._id,
        trans_date: moment(formData.trans_date).format('YYYY-MM-DD') || '',
        voucher_no: formData?.voucher_no,
        bill_no: formData?.bill_no,
        party_id: formData?.party?._id,
        project_id: formData?.project?._id,
        master_id: formData?.master?._id,
        is_edit: isEdit,
        isexternal: formData?.isexternal,
        transport_date: formData?.transport_date ? moment(formData?.transport_date).format('YYYY-MM-DD') : null,
        upload_pdf: formData?.pdf,
        transport_id: formData?.transport_details?._id,
        vehical_no: formData?.vehical_no,
        po_no: formData?.po_no,
        challan_no: formData?.challan_no,
        receive_date: moment(formData?.receive_date).format('YYYY-MM-DD') || '',
        payment_date: formData?.payment_date ? moment(formData?.payment_date).format('YYYY-MM-DD') : null,
        payment_days: formData?.payment_days,
        lr_no: formData?.lr_no,
        gate_pass_no: formData?.gate_pass_no,
        // issue_no: formData?.issue_no,
        lr_date: formData?.lr_date ? moment(formData?.lr_date).format('YYYY-MM-DD') : null,
        address: formData?.address || '',
        issue_no: formData?.issue_no,
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
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSingleItems((prevState) => ({
      ...prevState,
      trans_date: today,
      receive_date: today,
      payment_date: today

    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSingleItems({ ...SingleItems, [name]: value });
    setOrderError((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  useEffect(() => {
    if (SingleItems.trans_date && SingleItems.payment_date) {
      const orderDate = moment(SingleItems.trans_date);
      const paymentDate = moment(SingleItems.payment_date);
      const diffDays = paymentDate.diff(orderDate, 'days');
      setSingleItems((prevItems) => ({ ...prevItems, payment_days: diffDays }));
    }
  }, [SingleItems.trans_date, SingleItems.payment_date]);

  const Ordervalidation = () => {
    console.log("orderError", orderError);

    let isValid = true;
    let err = {};
    const today = new Date().toISOString().split("T")[0];

    // if (tag_number == 13 && !SingleItems.bill_no) {
    //   isValid = false;
    //   err['bill_no'] = "Please enter the bill number";
    // }

    if ((tag_number !== 13 && tag_number !== 14) && !SingleItems.bill_no && !SingleItems.challan_no) {
      isValid = false;
      err['bill_no'] = "Please enter the bill number";
    }
    if (!SingleItems.bill_no && !SingleItems.challan) {
      isValid = false;
      err['challan_bill_error'] = "Please provide either Bill No or Challan No";
    }

    if (tag_number === 13 && !SingleItems.issue_no) {
      isValid = false;
      err['issue_no'] = "Please select a issue no";
    }

    if ((tag_number !== 13 && tag_number !== 14) && !SingleItems.challan) {
      isValid = false;
      err['challan'] = "Please enter the challan";
    }

    if (tag_number !== 13 && !SingleItems.receive_date) {
      isValid = false;
      err['receive_date'] = "Please select a date";
    } else if (SingleItems.receive_date > today) {
      isValid = false;
      err['receive_date'] = "Invalid Receive Date";
    }
    if (tag_number !== 13 && SingleItems.isexternal === true && !SingleItems.party_id) {
      isValid = false;
      err['party_id'] = "Please select a party";
    }

    if (SingleItems.isexternal === true && !SingleItems.transport_id) {
      isValid = false;
      err['transport_id'] = "Please select a transport";
    }
    // if (tag_number === 13 && !SingleItems.issue_no) {
    //   isValid = false;
    //   err['issue_no'] = "Please select a issue no";
    // }
    if ((tag_number === 13 || tag_number === 14) && SingleItems.isexternal === true && !SingleItems.address) {
      isValid = false;
      err['address'] = "Please select address";
    }
    if (!SingleItems.project_id) {
      isValid = false;
      err['project_id'] = "Please select a project";
    }

    if ((tag_number === 11 || tag_number === 13) && !SingleItems.isexternal && !SingleItems.master_id) {
      isValid = false;
      err['master_id'] = `Please select ${dropdown_name}`;
    }
    // if (tag_number === 11) {
    //   if (!SingleItems.upload_pdf) {
    //     isValid = false;
    //     err['upload_pdf'] = "Please upload a PDF";
    //   }
    //   // if (!SingleItems.payment_date) {
    //   //   isValid = false;
    //   //   err['payment_date'] = "Please select a date";
    //   // }
    // }
    // // if (tag_number !== 13 && !SingleItems.lr_no) {
    // //   isValid = false;
    // //   err['lr_no'] = `Please select lr no`;
    // // }

    // // if (tag_number !== 13 && !SingleItems.lr_date) {
    // //   isValid = false;
    // //   err['lr_date'] = "Please select a date";
    // // } else if (tag_number !== 13 && SingleItems.lr_date > today) {
    // //   isValid = false;
    // //   err['lr_date'] = "Invalid Order Date";
    // // }
    setOrderError(err);
    if (!isValid && err['challan_bill_error']) {
      showToastError(err['challan_bill_error']);
    }


    if (!isValid && err['challan_bill_error']) {
      showToastError(err['challan_bill_error']);
    }

    return isValid;
  };
  const showToastError = (message) => {
    toast.error(message);
  };

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
            setSingleItems({ ...SingleItems, upload_pdf: data });
          }
          setDisable(false);
        }).catch((error) => {
          console.log(error, '!!');
          toast.error(error.response?.data?.message)
          setDisable(false);
        })
      } else {
        toast.error("Invalid file type. Only PDFs are allowed.");
      }
    }
  }
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSingleItems((prevState) => ({
      ...prevState,
      order_date: today,
      receive_date: today,
      payment_date: today

    }));
  }, []);
  const handleFormSubmit = () => {
    if (Ordervalidation()) {
      setDisable(true);
      if (tag_number === 13) {
        if (SingleItems.isexternal === false) {
          SingleItems.machine_code = null;
        } else {
          SingleItems.party_id = null;
        }
      }
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
                  <label>{(tag_number === 11 || tag_number === 12 || tag_number === 15) ? 'Order' : 'Issue'} Date <span className="login-danger">*</span></label>
                  <input className="form-control" type="date" name="order_date" max={new Date().toISOString().split('T')[0]}
                    value={SingleItems.order_date} onChange={handleChange} />
                  <div className='error'>{orderError?.order_date}</div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label> Issue No <span className="login-danger">*</span></label>
                  <input className="form-control" value={SingleItems?.issue_no} name='issue_no' onChange={handleChange} />
                  {(
                    orderError?.issue_no && <div className="error">{orderError.issue_no}</div>
                  )}
                </div>
              </div>

              {isEdit && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>Voucher No.</label>
                    <input className="form-control" type="number"
                      disabled value={SingleItems?.voucher_no} />
                  </div>
                </div>
              )}
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    Bill No. {(tag_number !== 13 || SingleItems.isexternal === true) && (<span className="login-danger">*</span>)}
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="bill_no"
                    value={SingleItems?.bill_no}
                    onChange={handleChange}
                  />
                  {(tag_number !== 13 && tag_number !== 14) && (
                    orderError?.bill_no && <div className="error">{orderError.bill_no}</div>
                  )}
                </div>
              </div>
              {(tag_number === 13 || tag_number === 11 || SingleItems.isexternal === true) &&
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>Transport <span className="login-danger">*</span></label>
                    <select className="form-select form-control" name="transport_id"
                      value={SingleItems?.transport_id} onChange={(e) => {
                        handleChange(e);
                        const selectedTransport = transport?.find((item) => item._id === e.target.value);
                        if (selectedTransport?.name === "Third Party") {
                          setShowDriverField(true);
                        } else {
                          setShowDriverField(false);
                        }
                      }}>
                      <option value="">Select Transport</option>
                      {transport?.map((transport) => (
                        <option key={transport._id} value={transport._id}>
                          {transport.name}
                        </option>
                      ))}
                    </select>
                    {orderError?.transport_id && <div className="error">{orderError.transport_id}</div>}
                  </div>
                </div>
              }
              {/* <div className="col-12 col-md-4 col-xl-4">
                {tag_number === 11 && (
                  <div className="input-block local-forms">
                    <label>
                      Transport <span className="login-danger">*</span>
                    </label>
                    <select
                      className="form-select form-control"
                      name="transport_id"
                      value={SingleItems?.transport_id || ""}
                      onChange={(e) => {
                        handleChange(e); // Update value
                        if (e.target.value === "Third Party") {
                          setShowDriverField(true); // Show the Driver Name field
                        } else {
                          setShowDriverField(false); // Hide the Driver Name field
                        }
                      }}
                    >
                      <option value="">Select Transport</option>
                      <option value="vishal_enterprise">Vishal Enterprise</option>
                      <option value="vrishal_engineering">Vrishal Engineering Pvt Ltd</option>
                      <option value="Third Party">Third Party</option>
                    </select>
                    {orderError?.transport_id && (
                      <div className="error">{orderError.transport_id}</div>
                    )}
                  </div>
                )}
              </div> */}
              {showDriverField && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>
                      Driver Name <span className="login-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="driver_name"
                      value={SingleItems?.driver_name || ""}
                      onChange={handleChange}
                      placeholder="Enter Driver Name"
                    />
                    {orderError?.driver_name && (
                      <div className="error">{orderError.driver_name}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">

                  <label> Project Name <span className="login-danger">*</span> </label>
                  {/* <select className="form-select form-control" name="project_id"
                    value={SingleItems?.project_id} onChange={handleChange}>
                    <option value="">Select Project</option>
                    {projects?.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select> */}
                  <Dropdown
                    value={SingleItems.project_id}
                    onChange={(e) => handleChange(e, 'project_id')}
                    options={projects}
                    optionLabel="label"
                    placeholder="Search and select item"
                    filter
                    filterBy="label"
                    className="w-100 multi-prime-react model-prime-multi"
                    emptyMessage="No items found"
                    appendTo="self"
                  />
                  {orderError?.project_id && <div className="error">{orderError.project_id}</div>}
                </div>
              </div>

              {(tag_number === 13 || tag_number === 14) && (
                <>
                  <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                      <label> Issue Type <span className="login-danger">*</span> </label>
                      <select
                        className="form-select form-control"
                        name="isexternal"
                        onChange={(e) => handleChange({
                          target: {
                            name: e.target.name,
                            value: e.target.value === "true"
                          }
                        })}
                        value={SingleItems.isexternal}
                      >
                        <option value="false">Internal</option>
                        <option value="true">Third Party</option>
                      </select>
                    </div>
                  </div>

                  {/* {!SingleItems.isexternal && (
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> Machine Code <span className="login-danger">*</span> </label>
                        <select className="form-select form-control" name="machine_code"
                          value={SingleItems?.machine_code} onChange={handleChange}>
                          <option value="">Select General Master</option>
                          {machineData?.map((e) => (
                            <option key={e.id} value={e._id}>
                              {e.name}
                            </option>
                          ))}
                        </select>
                        {orderError?.machine_code_err && <div className="error">{orderError.machine_code_err}</div>}
                      </div>
                    </div>
                  )} */}
                  {SingleItems.isexternal === true && (
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> Address <span className="login-danger">*</span> </label>
                        <input className="form-control" type="text" name="address"
                          value={SingleItems?.address} onChange={handleChange} />
                        {orderError?.address && <div className="error">{orderError.address}</div>}
                      </div>
                    </div>
                  )}
                </>
              )}


              {((tag_number === 13 || tag_number === 14) && SingleItems.isexternal === true) ? (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>
                      Party Name {(tag_number !== 13) && (<span className="login-danger">*</span>)}</label>
                    <select
                      className="form-select form-control"
                      name="party_id"
                      value={SingleItems?.party_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Party</option>
                      {parties?.map((party) => (
                        <option key={party.id} value={party._id}>
                          {party.name}
                        </option>
                      ))}
                    </select>
                    {(tag_number !== 13) && (
                      orderError?.party_id && <div className="error">{orderError.party_id}</div>
                    )}
                  </div>
                </div>
              ) : (tag_number !== 13 || tag_number !== 14) && (<>
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>
                      Party Name {(tag_number !== 13) && (<span className="login-danger">*</span>)}</label>
                    <select
                      className="form-select form-control"
                      name="party_id"
                      value={SingleItems?.party_id}
                      onChange={handleChange}
                    >
                      <option value="">Select Party</option>
                      {parties?.map((party) => (
                        <option key={party._id} value={party._id}>
                          {party.name}
                        </option>
                      ))}
                    </select>
                    {(tag_number !== 13) && (
                      orderError?.party_id && <div className="error">{orderError.party_id}</div>
                    )}
                  </div>
                </div>
              </>
              )}
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    {dropdown_name}{" "}<span className="login-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="master_id"
                    value={SingleItems?.master_id || ""}
                    onChange={handleChange}
                    placeholder={`Enter ${dropdown_name}`}
                  />
                  <div className="error">{orderError.master_id}</div>
                </div>
              </div>
              <div className="col-12 col-md-4 col-xl-4">
                <div className="input-block local-forms">
                  <label>
                    Receive Date <span className="login-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    name="receive_date"
                    value={SingleItems.receive_date}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <div className='error'>{orderError?.receive_date}</div>
                </div>
              </div>
              {tag_number === 13 && (
                <>
                  {!SingleItems.isexternal &&
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> Gate Pass No </label>
                        <input className="form-control" value={SingleItems?.gate_pass_no} name='gate_pass_no' onChange={handleChange} />
                      </div>
                    </div>
                  }
                  {SingleItems.isexternal === true &&
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> Reciever No / Contact No </label>
                        <input className="form-control" value={SingleItems?.gate_pass_no} name='gate_pass_no' onChange={handleChange} />
                      </div>
                    </div>
                  }
                  {SingleItems.isexternal === true &&
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> Reciever name / Contact name </label>
                        <input className="form-control" value={SingleItems?.gate_pass_no} name='gate_pass_no' onChange={handleChange} />
                      </div>
                    </div>
                  }

                </>
              )}

              {
                SingleItems.isexternal === true &&
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>Transport Date</label>
                    <input className="form-control" type="date" name="transport_date"
                      value={SingleItems.transport_date} onChange={handleChange} />
                    <div className='error'>{orderError?.transportDate}</div>
                  </div>
                </div>
              }
              {SingleItems.isexternal === true &&
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>Vehicle </label>
                    <input className="form-control" type="text" name="vehical_no"
                      value={SingleItems.vehical_no} onChange={handleChange}
                    />
                    <div className='error'>{orderError?.vehical_no}</div>
                  </div>
                </div>
              }
              {(tag_number === 11 || tag_number === 12) && (
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>PO No.</label>
                    <input className="form-control" type="text"
                      name="po_no" value={SingleItems.po_no} onChange={handleChange} />
                    <div className='error'>{orderError?.po_no}</div>
                  </div>
                </div>
              )}
              {SingleItems.isexternal === true &&
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label>Challan {(tag_number !== 13) && (<span className="login-danger">*</span>)}</label>
                    <input className="form-control" type="text" name="challan_no"
                      value={SingleItems?.challan_no} onChange={handleChange} />
                    {(tag_number !== 11 && tag_number !== 13 && tag_number !== 14) && (
                      (tag_number !== 13) && (
                        orderError?.challan_no && <div className="error">{orderError.challan_no}</div>
                      )
                    )}
                  </div>
                </div>
              }
              {(tag_number === 11) && (
                <>
                  <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-top-form">
                      <label className="local-top">PDF <span className="login-danger">*</span></label>
                      <div className="settings-btn upload-files-avator">
                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                        <input type="file" id="pdfFile" onChange={handlePdf} accept=".pdf" className="hide-input" />
                      </div>
                      {SingleItems.upload_pdf ? (
                        <a href={SingleItems.upload_pdf} target='_blank'>
                          <img src='/assets/img/pdflogo.png' />
                        </a>
                      ) : null}
                      {orderError?.challan_no && <div className="error">{orderError.upload_pdf}</div>}
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                      <label> Payment Date</label>
                      <input className="form-control" type="date" name="payment_date"
                        value={SingleItems?.payment_date} onChange={handleChange} />
                      {/* {orderError?.payment_date && <div className="error">{orderError.payment_date}</div>} */}
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                      <label> Payment Days</label>
                      <input className="form-control" value={SingleItems.payment_days} onChange={handleChange} readOnly />
                    </div>
                  </div>
                </>
              )}
              {(tag_number !== 13 || SingleItems.isexternal === true) &&
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block local-forms">
                    <label> LR No</label>
                    <input className="form-control" value={SingleItems.lr_no} name='lr_no' onChange={handleChange} />
                    {/* {orderError?.lr_no && <div className="error">{orderError.lr_no}</div>} */}
                  </div>

                  {SingleItems.isexternal === true &&
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> LR Date</label>
                        <input className="form-control" type="date" name="lr_date"
                          value={SingleItems?.lr_date} onChange={handleChange} />
                        {(tag_number !== 13) && (
                          orderError?.lr_date && <div className="error">{orderError.lr_date}</div>
                        )}
                      </div>
                    </div>
                  }

                  {tag_number === 15 && <div className="col-12 col-md-4 col-xl-4">
                    <div className="input-block local-forms">
                      <label>Site Location </label>
                      <input type='text' className="form-control" value={SingleItems.site_location} name='site_location' onChange={handleChange} />
                    </div>
                  </div>}

                </div>
              }
              {tag_number === 12 ? "" : (
                <div className="col-12">
                  <div className="doctor-submit text-end">
                    <button type="button" className="btn btn-primary submit-form me-2" onClick={handleFormSubmit}> {isEdit ? 'Save' : 'Submit'}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderForm;