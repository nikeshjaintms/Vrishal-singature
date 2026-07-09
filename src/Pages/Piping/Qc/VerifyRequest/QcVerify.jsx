import React, { useState } from 'react'
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../Include/Footer';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import Top from '../../Include/Top';

const QcVerify = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [disable, setDisable] = useState(false);
  const [errors, setErrors] = useState({});
  const data = location.state;

  const initialFormValues = data?.items?.map((item) => ({
    acceptedQty: '',
    rejectedQty: '',
    accepted_lot_no: '',
    acceptedWidth: '',
    acceptedLength: '',
    accepted_topbottom_thickness: '',
    accepted_normal_thickness: '',
    accepted_width_thickness: '',
    acceptedNos: '',
    tcNo: '',
    rejectedLength: '',
    rejectedWidth: '',
    acceptedRemarks: '',
    manufacture: item?.transactionId?.preffered_supplier?._id,
    // rejectedQty: item?.offeredQty || 0,
    transactionId: item?.transactionId?._id,
    heat_no_data: []
  }));

  const [formValues, setFormValues] = useState(initialFormValues);

  const addHeatNoData = (index) => {
    const newFormValues = [...formValues];
    newFormValues[index].heat_no_data.push({
      heat_lot_no: '',
      acceptedQty: '',
      rejectedQty:'',
      // inspected_nos: '',
      // inspected_length: '',
      // inspected_width: '',
      tc_no: ''
    });
    setFormValues(newFormValues);
  };

  // const updateHeatNoData = (itemIndex, heatIndex, field, value) => {
  //   const newFormValues = [...formValues];
  //   newFormValues[itemIndex].heat_no_data[heatIndex][field] = value;
  //   setFormValues(newFormValues);
  // };
const updateHeatNoData = (itemIndex, heatIndex, field, value) => {
  const newFormValues = [...formValues];
  const newErrors = { ...errors };

  newFormValues[itemIndex].heat_no_data[heatIndex][field] = value;

  // Calculate total accepted qty
  const totalAcceptedQty = calculateAcceptedQty(
    newFormValues[itemIndex].heat_no_data
  );

  const offeredQty = data?.items[itemIndex]?.offeredQty || 0;

  // Validation
  if (totalAcceptedQty > offeredQty) {
    newErrors[itemIndex] = {
      ...newErrors[itemIndex],
      acceptedQty: 'Inspected Qty cannot exceed Offered Qty'
    };
  } else {
    newErrors[itemIndex] = {
      ...newErrors[itemIndex],
      acceptedQty: ''
    };
  }

  // Store calculated values
  // newFormValues[itemIndex].acceptedQty = totalAcceptedQty;
  // newFormValues[itemIndex].rejectedQty =
  //   offeredQty - totalAcceptedQty;

  // setFormValues(newFormValues);
  newFormValues[itemIndex].acceptedQty = totalAcceptedQty;

const totalRejectedQty = newFormValues[itemIndex].heat_no_data.reduce(
  (sum, row) => sum + (Number(row.rejectedQty) || 0),
  0
);

newFormValues[itemIndex].rejectedQty = totalRejectedQty;

if (totalRejectedQty < 0) {
  newErrors[itemIndex] = {
    ...newErrors[itemIndex],
    rejectedQty: 'Rejected Qty cannot be negative'
  };
} else if (totalRejectedQty > offeredQty) {
  newErrors[itemIndex] = {
    ...newErrors[itemIndex],
    rejectedQty: 'Rejected Qty cannot exceed Offered Qty'
  };
} else {
  newErrors[itemIndex] = {
    ...newErrors[itemIndex],
    rejectedQty: ''
  };
}
  setErrors(newErrors);
};
  const removeHeatNoData = (itemIndex, heatIndex) => {
    const newFormValues = [...formValues];
    newFormValues[itemIndex].heat_no_data.splice(heatIndex, 1);
    setFormValues(newFormValues);
  };

  const handleInputChange = (index, name, value) => {
    const newFormValues = [...formValues];
    const newErrors = { ...errors };

    if (name === 'acceptedQty') {
      if (value < 0) {
        newErrors[index] = { ...newErrors[index], acceptedQty: 'Inspected Qty cannot be negative' };
      } else {
        newFormValues[index][name] = value;
        
        const offeredQty = data?.items[index]?.offeredQty || 0;
        console.log("offeredQty", offeredQty, "value", value);
        if (value > offeredQty) {
          newErrors[index] = { ...newErrors[index], acceptedQty: 'Inspected Qty cannot exceed Offered Qty' };
        } else {
          newErrors[index] = { ...newErrors[index], acceptedQty: '' };
        }
        newFormValues[index].rejectedQty = offeredQty - value;
      }
    } else {
      newFormValues[index][name] = value;
    }

    if (newFormValues[index].rejectedQty === 0) {
      newErrors[index] = {
        ...newErrors[index],
        rejectedLength: 0,
        rejectedWidth: 0
      };
    }

    setFormValues(newFormValues);
    setErrors(newErrors);
  };

  const handleSubmit = () => {
          console.log("in handlesubmit");

    const items = formValues.map((values, index) => ({
      // rejectedQty: values.rejectedQty,
      // acceptedQty: values.acceptedQty,
      // accepted_lot_no: values.accepted_lot_no,
      // acceptedWidth: values.acceptedWidth,
      // acceptedLength: values.acceptedLength,
      // accepted_width_thickness: values.accepted_width_thickness,
      // acceptedNos: values.acceptedNos,
      // accepted_normal_thickness: values.accepted_normal_thickness,
      // accepted_topbottom_thickness: values.accepted_topbottom_thickness,
      // tcNo: values.tcNo,
      // rejected_length: values.rejectedLength,
      // rejected_width: values.rejectedWidth,
      acceptedRemarks: values.acceptedRemarks,
      manufacture: values.manufacture,
      transactionId: data?.items[index]?.transactionId?._id,
      heat_no_data: values.heat_no_data
    }));
      console.log("items=====", items);

    if (validation()) {
      console.log("passs");
      setDisable(true);
      const bodyFormData = new URLSearchParams();
      const myurl = `${V_URL}/user/get-qc-approval-piping`;
      bodyFormData.append('offerId', data?._id);
      bodyFormData.append('acceptedBy', localStorage.getItem('PAY_USER_ID'));
      bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
      bodyFormData.append('items', JSON.stringify(items));

      axios({
        method: 'post',
        url: myurl,
        data: bodyFormData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
      }).then((response) => {
        if (response.data.success === true) {
          console.log(response.data, '@@');
          toast.success(response.data.message);
          navigate('/piping/user/verify-request-management');
        } else {
          toast.error(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        console.log(error, 'error');
        toast.error(error?.response?.data?.message || 'Someting went wrong');
        setDisable(false);
      });
    }
  }

  // const calculateTotalInspectedNos = (item) => {
  //   return item.heat_no_data.reduce((sum, heat) => {
  //     return sum + (Number(heat.inspected_nos) || 0);
  //   }, 0);
  // };
const calculateAcceptedQty = (heatRows) => {
  return heatRows.reduce((sum, row) => {
    return sum + (Number(row.acceptedQty) || 0);
  }, 0);
};
  const validation = () => {
    let isValid = true;
    const newErrors = {};

    formValues.forEach((values, index) => {
      // const totalInspectedNos = calculateTotalInspectedNos(values);
    

      if (!values.acceptedQty) {
        newErrors[index] = { ...newErrors[index], acceptedQty: 'Please enter inspected qty.' };
        isValid = false;
      } else if (values.acceptedQty < 0) {
        newErrors[index] = { ...newErrors[index], acceptedQty: 'Inspected Qty cannot be negative' };
        isValid = false;
      } 
      else if (values.rejectedQty < 0) {
        newErrors[index] = { ...newErrors[index], rejectedQty: 'Rejected Qty cannot be negative' };
        isValid = false;
      }
      else {
        // const offeredQty = data?.items[index]?.offeredQty || 0;
        // if (values.acceptedQty > offeredQty) {
        //   newErrors[index] = { ...newErrors[index], acceptedQty: 'Inspected Qty cannot exceed Offered Qty' };
        //   isValid = false;
        // }
      }

      if (!values.manufacture) {
        newErrors[index] = { ...newErrors[index], manufacture: 'Please select manufacture' };
        isValid = false;
      }

      // if (values.acceptedQty != totalInspectedNos) {
      //   newErrors[index] = {
      //     ...newErrors[index],
      //     acceptedQty: `Accepted Qty (${values.acceptedQty}) must match total inspected nos (${totalInspectedNos})`
      //   };
      //   isValid = false;
      // }

      if (!values.heat_no_data || values.heat_no_data.length === 0) {
        // newErrors[index] = {
        //   ...newErrors[index],
        //   heat_no_data: 'At least one heat/lot entry is required'
        // };
        // isValid = false;
      } else {
        const heatErrors = [];
        values.heat_no_data.forEach((heatData, heatIndex) => {
          const heatError = {};
          let hasError = false;

          if (!heatData.heat_lot_no) {
            heatError.heat_lot_no = 'Heat/Lot No is required';
            hasError = true;
          }
          // if (!heatData.inspected_nos) {
          //   heatError.inspected_nos = 'Inspected NOS is required';
          //   hasError = true;
          // }
          // if (!heatData.inspected_length) {
          //   heatError.inspected_length = 'Inspected Length is required';
          //   hasError = true;
          // }
          if (hasError) {
            heatErrors[heatIndex] = heatError;
            isValid = false;
          }
        });

        if (heatErrors.length > 0) {
          newErrors[index] = {
            ...newErrors[index],
            heat_no_data: heatErrors
          };
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  const InputField = ({ label, value, disabled }) => (
    <div className="col-12 col-md-4 col-xl-4">
      <div className="input-block local-forms">
        <label>{label}</label>
        <input className="form-control" value={value} readOnly disabled={disabled} />
      </div>
    </div>
  );

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
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/verify-request-management">Material Inspection(QC) List</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">Manage Material Inspection(QC)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>View Request Details</h4>
                    </div>
                  </div>
                  <div className="row">
                    {[
                      { label: 'Request No.', value: data?.requestId?.requestNo },
                      { label: 'Offered No.', value: data?.offer_no },
                      { label: 'Project Location', value: data?.requestId?.storeLocation?.name },
                      { label: 'PO Date', value: moment(data?.requestId?.admin_approval_time).format('YYYY-MM-DD') },
                      { label: 'Material PO No.', value: data?.requestId?.material_po_no },
                      { label: 'Department', value: data?.requestId?.department?.name },
                      { label: 'Approved By', value: data?.requestId?.approvedBy?.name },
                      { label: 'Prepared By', value: data?.requestId?.preparedBy?.user_name },
                    ].map(({ label, value }) => (
                      <div key={label} className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>{label}</label>
                          <input className="form-control" value={value} readOnly />
                        </div>
                      </div>
                    ))}
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                        <span className={`custom-badge ${data?.requestId?.status === 1 ? 'status-orange' :
                          data?.status === 2 ? 'status-blue' :
                            data?.status === 3 ? 'status-pink' :
                              data?.status === 4 ? 'status-green' : ''
                          }`}>
                          {data?.status === 1 ? 'Pending' :
                            data?.status === 2 ? 'Approved By Admin' :
                              data?.status === 3 ? 'Rejected By Admin' :
                                data?.status === 6 ? 'Completed' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='row'>
                    <InputField label="Client" value={data?.requestId?.project?.party?.name} />
                    <InputField label="PO / WO No." value={data?.requestId?.project?.work_order_no} />
                    <InputField label="Project PO No." value={data?.requestId?.project?.work_order_no} />
                    <InputField label="Invoice No." value={data?.invoice_no} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  {data?.items?.map((elem, i) =>
                    <form>
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>{i + 1} {elem?.transactionId?.itemName?.name}</h4>
                        </div>
                      </div>

                      <div className='row'>
                        <InputField label="Section Details" value={elem?.transactionId?.itemName?.item_name} disabled={true} />
                        <InputField label="Material Grade" value={elem?.transactionId?.itemName?.material_grade} disabled={true} />
                        <InputField label="UOM" value={elem?.transactionId?.itemName?.uom?.name} disabled={true} />
                        {/* <InputField label="Inspection Offer NOS" value={elem?.offerNos} disabled={true} />
                        <InputField label="Inspection Offer UOM" value={elem?.offer_uom?.name} disabled={true} />
                        <InputField label="Inspection Offer Length(mm)" value={elem?.offerLength} disabled={true} />
                        <InputField label="Inspection Offer Width(mm)" value={elem?.offerWidth} disabled={true} /> */}
                        <InputField label="Inspection Offer Date" disabled={true}
                          value={moment(elem?.received_date).format('YYYY-MM-DD')} />
                        {/* <InputField label="Inspection Heat / Lot No." value={elem?.lotNo} disabled={true} /> */}
                        {/* <InputField label="Inspection Offer Thickness (T/B)" value={elem?.offer_topbottom_thickness} disabled={true} />
                        <InputField label="Inspection Offer Thickness (W)" value={elem?.offer_width_thickness} disabled={true} />
                        <InputField label="Inspection Offer Thickness (N)" value={elem?.offer_normal_thickness} disabled={true} /> */}
                        <InputField label="Total Offered Qty.(kg)" value={elem?.offeredQty} disabled={true} />

                        {/* <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Rejected Qty.(kg)</label>
                            <input className="form-control" type='number' name="rejectedQty" value={formValues[i].rejectedQty} disabled />
                          </div>
                        </div> */}
                        <InputField label="Manufacturer" value={elem?.manufacture?.name} disabled={true} />

                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Manufacture <span className="login-danger">*</span></label>
                            <select className="form-control form-select" name="manufacture" value={formValues[i].manufacture} onChange={(e) => handleInputChange(i, 'manufacture', e.target.value)}>
                              <option value="">Select Manufacture</option>
                              {elem?.transactionId?.preffered_supplier?.map((e) =>
                                <option value={e?.supId?._id} key={e?._id}>{e?.supId?.name}</option>
                              )}
                            </select>
                            <div className="error">{errors[i]?.manufacture}</div>
                          </div>
                        </div>

                        
                        {/* <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Inspected Length(mm)</label>
                            <input className="form-control" type='number' name="acceptedLength" value={formValues[i].acceptedLength} onChange={(e) => handleInputChange(i, 'acceptedLength', e.target.value)} />
                          </div>
                        </div>
                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Inspected Width(mm)</label>
                            <input className="form-control" type='number' name="acceptedWidth" value={formValues[i].acceptedWidth} onChange={(e) => handleInputChange(i, 'acceptedWidth', e.target.value)} />
                          </div>
                        </div> */}


                        {/* <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Inspected (nos)</label>
                            <input className="form-control" type='text' name="acceptedNos" value={formValues[i].acceptedNos} onChange={(e) => handleInputChange(i, 'acceptedNos', e.target.value)} />
                          </div>
                        </div>

                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Heat / Lot No.</label>
                            <input className="form-control" type='text' name="accepted_lot_no" value={formValues[i].accepted_lot_no} onChange={(e) => handleInputChange(i, 'accepted_lot_no', e.target.value)} />
                          </div>
                        </div>
                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>T.C. No.</label>
                            <input className="form-control" type='text' name="tcNo" value={formValues[i].tcNo} onChange={(e) => handleInputChange(i, 'tcNo', e.target.value)} />
                          </div>
                        </div> */}

                        <div className="col-12 mb-4">
                          <div className="form-heading">
                            <h5>Heat/Lot Details                         {typeof errors[i]?.heat_no_data === 'string' && (
                              <span className="error">({errors[i]?.heat_no_data})</span>
                            )}</h5>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => addHeatNoData(i)}
                            >
                              Add Heat/Lot
                            </button>
                          </div>
                        </div>

                        {formValues[i].heat_no_data?.map((heatData, heatIndex) => (
                          <div key={heatIndex} className="row mb-3">
                            <div className="col-12 col-md-2">
                              <div className="input-block local-forms">
                                <label>Heat/Lot No.</label>
                                <input
                                  className="form-control"
                                  value={heatData.heat_lot_no}
                                  onChange={(e) => updateHeatNoData(i, heatIndex, 'heat_lot_no', e.target.value)}
                                />
                                {errors[i]?.heat_no_data?.[heatIndex]?.heat_lot_no && (
                                  <div className="error">{errors[i]?.heat_no_data[heatIndex]?.heat_lot_no}</div>
                                )}
                              </div>
                            </div>
                            {/* <div className="col-12 col-md-2">
                              <div className="input-block local-forms">
                                <label>Inspected Nos</label>
                                <input
                                  className="form-control"
                                  type="number"
                                  value={heatData.inspected_nos}
                                  onChange={(e) => updateHeatNoData(i, heatIndex, 'inspected_nos', e.target.value)}
                                />
                                {errors[i]?.heat_no_data?.[heatIndex]?.inspected_nos && (
                                  <div className="error">{errors[i]?.heat_no_data[heatIndex]?.inspected_nos}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-12 col-md-2">
                              <div className="input-block local-forms">
                                <label>Inspected Length</label>
                                <input
                                  className="form-control"
                                  value={heatData.inspected_length}
                                  onChange={(e) => updateHeatNoData(i, heatIndex, 'inspected_length', e.target.value)}
                                />
                                {errors[i]?.heat_no_data?.[heatIndex]?.inspected_length && (
                                  <div className="error">{errors[i]?.heat_no_data[heatIndex]?.inspected_length}</div>
                                )}
                              </div>
                            </div>
                            <div className="col-12 col-md-2">
                              <div className="input-block local-forms">
                                <label>Inspected Width</label>
                                <input
                                  className="form-control"
                                  value={heatData.inspected_width}
                                  onChange={(e) => updateHeatNoData(i, heatIndex, 'inspected_width', e.target.value)}
                                />
                              </div>
                            </div> */}
                            <div className="col-12 col-md-2">
                              <div className="input-block local-forms">
                                <label>T.C. No.</label>
                                <input
                                  className="form-control"
                                  value={heatData.tc_no}
                                  onChange={(e) => updateHeatNoData(i, heatIndex, 'tc_no', e.target.value)}
                                />
                              </div>
                            </div>
                           
                       <div className="col-12 col-md-4">
  <div className="input-block local-forms">
    <label>Inspected Qty.(kg)</label>

    <input
      className="form-control"
      type="number"
      value={heatData.acceptedQty}
      onChange={(e) =>
        updateHeatNoData(
          i,
          heatIndex,
          'acceptedQty',
          e.target.value
        )
      }
    />
     {errors[i]?.acceptedQty && (
      <div className="error">
        {errors[i]?.acceptedQty}
      </div>
    )}
  </div>
</div>
                         <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Rejected Qty.(kg)</label>
                            <input className="form-control" type='number'  value={heatData.rejectedQty}
                            onChange={(e) =>
        updateHeatNoData(
          i,
          heatIndex,
          'rejectedQty',
          e.target.value
        )
      }
                            />
                             {errors[i]?.rejectedQty && (
      <div className="error">
        {errors[i]?.rejectedQty}
      </div>
    )}
                          </div>
                        </div>
                            <div className="col-12 col-md-2">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => removeHeatNoData(i, heatIndex)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Inspected Thickness (T/B)</label>
                            <input className="form-control" type='text' name="accepted_topbottom_thickness" value={formValues[i].accepted_topbottom_thickness} onChange={(e) => handleInputChange(i, 'accepted_topbottom_thickness', e.target.value)} />
                          </div>
                        </div>
                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Inspected Thickness (W)</label>
                            <input className="form-control" type='text' name="accepted_width_thickness" value={formValues[i].accepted_width_thickness} onChange={(e) => handleInputChange(i, 'accepted_width_thickness', e.target.value)} />
                          </div>
                        </div>
                        <div className='col-12 col-md-4 col-xl-4'>
                          <div className="input-block local-forms">
                            <label>Inspected Thickness (N)</label>
                            <input className="form-control" type='text' name="accepted_normal_thickness" value={formValues[i].accepted_normal_thickness} onChange={(e) => handleInputChange(i, 'accepted_normal_thickness', e.target.value)} />
                          </div>
                        </div> */}

                        {/* {formValues[i].rejectedQty > 0 && (
                          <>
                            <div className='col-12 col-md-4 col-xl-4'>
                              <div className="input-block local-forms">
                                <label>Rejected Length(mm)<span className="login-danger">*</span></label>
                                <input className="form-control" name="rejected_length" value={formValues[i].rejectedLength} onChange={(e) => handleInputChange(i, 'rejectedLength', e.target.value)} />
                                <div className="error">{errors[i]?.rejectedLength}</div>
                              </div>
                            </div>
                            <div className='col-12 col-md-4 col-xl-4'>
                              <div className="input-block local-forms">
                                <label>Rejected (nos) <span className="login-danger">*</span></label>
                                <input className="form-control" name="rejected_width" value={formValues[i].rejectedWidth} onChange={(e) => handleInputChange(i, 'rejectedWidth', e.target.value)} />
                                <div className="error">{errors[i]?.rejectedWidth}</div>
                              </div>
                            </div>
                          </>
                        )} */}
                        <div className='col-12'>
                          <div className="input-block local-forms">
                            <label>Remark</label>
                            {/* <textarea className="form-control" name="acceptedRemarks" /> */}
                            <textarea
  className="form-control"
  name="acceptedRemarks"
  value={formValues[i].acceptedRemarks}
  onChange={(e) => handleInputChange(i, 'acceptedRemarks', e.target.value)}
/>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : 'Submit'}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Top />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default QcVerify