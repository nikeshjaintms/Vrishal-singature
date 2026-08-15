import React, { useEffect, useState } from 'react'
import { getProject } from '../../../../../Store/Store/Project/Project';
import { getParty } from '../../../../../Store/Store/Party/Party';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTransport } from '../../../../../Store/Store/StoreMaster/Transport/AdminTransport';
import { getGenMaster } from '../../../../../Store/Store/GenralMaster/GenMaster';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';
import toast from 'react-hot-toast';
import { getBillNo } from '../../../../../Store/Store/MainStore/PurchaseReturn/GetBillNumbers';
import { getChallanNo } from '../../../../../Store/Store/MainStore/PurchaseReturn/GetChallanNumbers';
import { Dropdown } from 'primereact/dropdown';
import { getTransport } from '../../../../../Store/Store/StoreMaster/Transport/Transport';

const OrderForm = ({ title, isEdit, voucher_name, formData, handleFormChange, setFormData, formError, setFormError, prItems }) => {
    const [showDriverField, setshowDriverField] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getParty({ storeType: '1', is_main: true }))
        dispatch(getProject())
        dispatch(getGenMaster({ tag_id: 12 }))
        dispatch(getAdminTransport({ is_main: true }))
    }, []);
useEffect(() => {
  if (!formData.trans_date) {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      trans_date: today,
      receive_date: today,
      transport_date:today
    }));
  }
}, [setFormData]);

    useEffect(() => {
        if (isEdit) {
            const selectedTransport = transport?.find((item) => item?._id === formData?.transport_id);
            if (selectedTransport) {
                if (selectedTransport?.name === "Third Party") {
                    setFormData(
                        (prev) => ({
                            ...prev,
                            driver_name: formData?.driver_name,
                        })
                    );
                    setshowDriverField(true);
                }
            }
        }
    }, [isEdit, showDriverField, formData?.transport_id]);

    const parties = useSelector((state) => state.getParty?.user?.data || []);
    const reciever = useSelector((state) => state.getGenMaster?.user?.data || []);
    const projects = useSelector((state) => state.getProject?.user?.data || []);
    const transport = useSelector((state) => state.getTransport?.user?.data || []);
    const BillNo = useSelector((state) => state.getBillNo?.data?.data || []);
    const ChallanNo = useSelector((state) => state.getChallanNo?.data?.data || []);

    useEffect(() => {
        if (prItems) {
            setFormData((prev) => ({
                ...prev,
                challan_no: prItems?.challan_no || "",
                bill_no: prItems?.bill_no || "",
            }));
        }
    }, [prItems?.bill_no, prItems?.challan_no]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'bill_no') {
            setFormData((prev) => ({
                ...prev,
                bill_no: value,
                challan_no: "",
            }));
        } else if (name === 'challan_no') {
            setFormData((prev) => ({
                ...prev,
                challan_no: value,
                bill_no: "",
            }));
        }

        if (name === "payment_date" || name === "trans_date") {
            const purchaseDate = new Date(
                name === "trans_date" ? value : formData?.trans_date
            );
            const paymentDate = new Date(
                name === "payment_date" ? value : formData?.payment_date
            );

            if (paymentDate && purchaseDate) {
                if (paymentDate < purchaseDate) {
                    setFormError((prev) => ({
                        ...prev,
                        payment_days: "Payment Date cannot be older than Purchase Date.",
                    }));
                    setFormData((prev) => ({
                        ...prev,
                        payment_date: "",
                        payment_days: "",
                    }));
                } else {
                    const diffTime = Math.abs(paymentDate - purchaseDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setFormError((prev) => ({
                        ...prev,
                        payment_days: null,
                    }));
                    setFormData((prev) => ({
                        ...prev,
                        payment_days: diffDays || 0,
                    }));
                }
            }
        }
        if (name === "transport_id") {
            const selectedTransport = transport?.find((item) => item?._id === value);
            if (selectedTransport?.name === "Third Party") {
                setshowDriverField(true);
            } else {
                setshowDriverField(false);
                setFormData((prev) => ({
                    ...prev,
                    driver_name: null,
                }));
                setFormError((prev) => ({
                    ...prev,
                    driver_name: null,
                }));
            }
        }
        setFormError((prev) => ({
            ...prev,
            [name]: null,
        }));

        if (name === 'party_id') {
            dispatch(getBillNo({ party_id: value }));
            dispatch(getChallanNo({ party_id: value }));
        }

        handleFormChange(e);
    };
    const handlePdf = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["application/pdf"];
            const fileType = e.target.files[0].type;
            if (allowedTypes.includes(fileType)) {
                // setDisable(true);
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
                        setFormData({ ...formData, upload_pdf: data });
                    }
                    // setDisable(false);
                }).catch((error) => {
                    console.log(error, '!!');
                    toast.error(error.response?.data?.message)
                    // setDisable(false);
                })
            } else {
                toast.error("Invalid file type. Only PDFs are allowed.");
            }
        }
    }

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-12 d-flex justify-content-between">
                            <div className="form-heading"><h4>{title}</h4></div>
                        </div>
                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Party Name <span className="login-danger">*</span></label>
                                    <Dropdown
                                        value={formData?.party_id}
                                        options={parties?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleChange({ target: { name: "party_id", value: e.value } })}
                                        placeholder="Select Party"
                                        disabled={isEdit}
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {
                                        formError?.party_id && <div className="error">{formError.party_id}</div>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Bill No.<span className="login-danger">*</span></label>
                                    <Dropdown
                                        value={formData?.bill_no}
                                        options={BillNo?.filter(bill => bill.bill_no)?.map((item) => ({
                                            label: item.bill_no, // Display name
                                            value: item.bill_no, // Store _id
                                        }))}
                                        onChange={(e) => handleChange({ target: { name: "bill_no", value: e.value } })}
                                        placeholder="Select Bill No."
                                        disabled={!formData?.party_id || isEdit}
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Challan No.<span className="login-danger">*</span></label>

                                    <Dropdown
                                        value={formData?.challan_no}
                                        options={ChallanNo?.filter(challan => challan.challan_no)?.map((item) => ({
                                            label: item.challan_no, // Display name
                                            value: item.challan_no, // Store _id
                                        }))}
                                        onChange={(e) => handleChange({ target: { name: "challan_no", value: e.value } })}
                                        placeholder="Select Challan No."
                                        disabled={!formData?.party_id || isEdit}
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Purchase Return Date <span className="login-danger">*</span></label>
                                    <input className="form-control" type="date" name="trans_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.trans_date} onChange={handleChange}
                                    />
                                    {formError?.trans_date && <div className="error">{formError.trans_date}</div>}
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Reciever Name<span className="login-danger">*</span></label>
                                    <Dropdown
                                        value={formData?.master_id}
                                        options={reciever?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleChange({ target: { name: "master_id", value: e.value } })}
                                        placeholder="Select Reciever"
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {
                                        formError?.master_id && <div className="error">{formError.master_id}</div>
                                    }
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Project Name <span className="login-danger">*</span></label>
                                    <Dropdown
                                        value={formData?.project_id}
                                        options={projects?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleChange({ target: { name: "project_id", value: e.value } })}
                                        placeholder="Select Project"
                                        disabled
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {
                                        formError?.project_id && <div className="error">{formError.project_id}</div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Recieving Date</label>
                                    <input className="form-control" type="date" name="receive_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.receive_date} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Transport <span className="login-danger">*</span></label>
                                    <Dropdown
                                        value={formData?.transport_id}
                                        options={transport?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleChange({ target: { name: "transport_id", value: e.value } })}
                                        placeholder="Select transport"
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {
                                        formError?.transport_id && <div className="error">{formError.transport_id}</div>
                                    }
                                </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Transport Date</label>
                                    <input className="form-control" type="date" name="transport_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.transport_date} onChange={handleChange}
                                    />
                                    {
                                        formError?.transport_date && <div className="error">{formError?.transport_date}</div>
                                    }
                                </div>
                            </div>


                        </div>
                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Lr No.
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lr_no"
                                        value={formData?.lr_no || ""}
                                        onChange={handleChange}
                                        placeholder="Enter Lr No"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Lr Date</label>
                                    <input className="form-control" type="date" name="lr_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.lr_date} onChange={handleChange}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Vehical No.
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="vehical_no"
                                        value={formData?.vehical_no || ""}
                                        onChange={handleChange}
                                        placeholder="Enter Vehical No"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Payment Date</label>
                                    <input className="form-control" type="date" name="payment_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.payment_date} onChange={handleChange} disabled
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Payment Days.</label>
                                    <input className="form-control" type="number" name='payment_days'
                                        disabled value={formData?.payment_days}
                                    />
                                    {
                                        formError?.payment_days && <div className="error">{formError?.payment_days}</div>
                                    }
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-top-form">
                                    <label className="local-top">PDF <span className="login-danger">*</span></label>
                                    <div className="settings-btn upload-files-avator">
                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                        <input type="file" id="pdfFile" name='upload_pdf' onChange={handlePdf} accept=".pdf" className="hide-input" disabled />
                                    </div>
                                    {
                                        formError?.upload_pdf && <div className="error">{formError?.upload_pdf}</div>
                                    }
                                    {formData?.upload_pdf ? (
                                        <a href={formData?.upload_pdf} target='_blank'>
                                            <img src='/assets/img/pdflogo.png' />
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>PO No.</label>
                                    <input className="form-control" type="text"
                                        disabled value={formData?.po_no}
                                    />
                                </div>
                            </div>
                            {
                                isEdit && (
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms">
                                            <label>{voucher_name}</label>
                                            <input className="form-control" type="text"
                                                disabled value={formData?.voucher_no}
                                            />
                                        </div>
                                    </div>
                                )
                            }

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
                                            value={formData?.driver_name || ""}
                                            onChange={handleChange}
                                            placeholder="Enter Driver Name"
                                        />
                                        {formError?.driver_name && (
                                            <div className="error">{formError.driver_name}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OrderForm