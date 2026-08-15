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


const EditPurchaseRequestForm = ({ title, dropdown_name, formData, tag_number, isEdit, handleSubmit }) => {
    const dispatch = useDispatch();
    const [orderError, setOrderError] = useState({});
    const [machineData, setMachineData] = useState([]);
    const [disable, setDisable] = useState(false);
    const reciever = useSelector((state) => state.getGenMaster?.user?.data || []);

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
        trans_date: '',
        // approve_by: '',
        status: '',
        department: '',
        // transport_id,
        // vehical_no,
        // po_no,
        // site_location,
    });
    useEffect(() => {
        dispatch(getGenMaster({ tag_id: tag_number }));
        dispatch(getParty({ storeType: '1', is_main: true }));
        dispatch(getProject())
        dispatch(getAdminTransport({ is_main: true }))
    }, []);

    useEffect(() => {
        if (isEdit && formData) {
            setSingleItems({
                id: formData?._id || '',
                order_date: moment(formData?.order_date).format('YYYY-MM-DD') || '',
                voucher_no: formData?.voucher_no || '',
                is_edit: isEdit,
                store_location: formData?.store_location || '',
                status: formData?.status || '',
                site_location: formData?.site_location || '',
                department: formData?.department || '',
                receive_date: formData?.receive_date || '',
                payment_date: moment(formData?.payment_date).format('YYYY-MM-DD') || '',
                payment_days: formData?.payment_days || 0,
                trans_date: formData?.trans_date ? moment(formData.trans_date).format('YYYY-MM-DD') : '',
                project_id: formData?.project_id || '',
                master_id: formData?.prepare_by?._id,
                vehical_no: formData?.vehical_no || '',
                challan: formData?.challan || '',
                lr_no: formData?.lr_no || '',
                lr_date: formData?.lr_date ? moment(formData.lr_date).format('YYYY-MM-DD') : '',
                gate_pass_no: formData?.gate_pass_no || '',
            });
        }
    }, [isEdit, formData]);


    const parties = useSelector((state) => state.getParty?.user?.data || []);
    const projects = useSelector((state) => state.getProject?.user?.data || []);
    const transport = useSelector((state) => state.getAdminTransport?.user?.data || []);

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

    const Ordervalidation = () => {
        let isValid = true;
        let err = {};
        const today = new Date().toISOString().split("T")[0];

        if (!SingleItems.order_date) {
            isValid = false;
            err['order_date'] = "Please select a date";
        } else if (SingleItems.order_date > today) {
            isValid = false;
            err['order_date'] = "Invalid Order Date";
        }

        if (tag_number !== 13 && !SingleItems.receive_date) {
            isValid = false;
            err['receive_date'] = "Please select a date";
        } else if (tag_number !== 13 && SingleItems.receive_date > today) {
            isValid = false;
            err['receive_date'] = "Invalid Receive Date";
        }
        if (!SingleItems.transport_id) {
            isValid = false;
            err['transport_id'] = "Please select a transport";
        }

        if (!SingleItems.master_id) {
            isValid = false;
            err['master_id'] = `Please select ${dropdown_name}`;
        }
        if (tag_number !== 13 && !SingleItems.lr_date) {
            isValid = false;
            err['lr_date'] = "Please select a date";
        } else if (tag_number !== 13 && SingleItems.lr_date > today) {
            isValid = false;
            err['lr_date'] = "Invalid Order Date";
        }
        setOrderError(err);

        if (!isValid && err['challan_bill_error']) {
            showToastError(err['challan_bill_error']);
        }
        return isValid;
    };

    const showToastError = (message) => {
        toast.error(message);
    };
    const handleFormSubmit = () => {
        // if (Ordervalidation()) {
        setDisable(true);
        if (tag_number === 13) {
            if (SingleItems.isexternal) {
                SingleItems.machine_code = null;
            } else {
                SingleItems.party_id = null;
            }
        }
        handleSubmit(SingleItems);
        // }
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
                                    <input className="form-control" type="date" name="trans_date"
                                        value={SingleItems.trans_date} onChange={handleChange} />
                                    <div className='error'>{orderError?.trans_date}</div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>{dropdown_name} <span className="login-danger">*</span></label>
                                    <select className="form-select form-control" name="master_id"
                                        value={SingleItems?.master_id} onChange={handleChange}  >
                                        <option value="">Select {dropdown_name}</option>
                                        {reciever?.map((e) => (
                                            <option key={e._id} value={e._id}>
                                                {e.name}
                                            </option>
                                        ))}
                                    </select>
                                    {orderError?.master_id && <div className="error">{orderError.master_id}</div>}
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>PR No.</label>
                                    <input className="form-control" type="text" name="voucher_no"
                                        value={SingleItems.voucher_no} onChange={handleChange} disabled />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Store Location </label>
                                    <input type='text' className="form-control" value={SingleItems.store_location} name='store_location' onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Department </label>
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

export default EditPurchaseRequestForm