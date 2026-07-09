import React, { useEffect, useState } from 'react'
import { getProject } from '../../../../../Store/Store/Project/Project';
import { getParty } from '../../../../../Store/Store/Party/Party';
import { getCustomers } from '../../../../../Store/Store/Customer/Customer';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTransport } from '../../../../../Store/Store/StoreMaster/Transport/AdminTransport';
import { getGenMaster } from '../../../../../Store/Store/GenralMaster/GenMaster';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';
import toast from 'react-hot-toast';
import { getPass } from '../../../../../Store/Store/MainStore/Issue/GetPass';
import { Dropdown } from 'primereact/dropdown';
import { getTransport } from '../../../../../Store/Store/StoreMaster/Transport/Transport';
import { getUnitLocation } from '../../../../../Store/Store/UnitLocation/getUnitLocation';

const OrderForm = ({ title, isEdit, formData, handleFormChange, setFormData, formError, setFormError }) => {
    const [showDriverField, setshowDriverField] = useState(false)
       
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getParty({ storeType: '1', is_main: true }))
        dispatch(getCustomers({ storeType: "retail", is_main: false, name: "John Traders" }));
        dispatch(getProject())
        dispatch(getGenMaster({ tag_id: 13 }))
        dispatch(getAdminTransport({ is_main: true }))
        dispatch(getPass())
        dispatch(getUnitLocation({ status: true }));
    }, []);

    useEffect(() => {
  if (!formData.trans_date) {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      trans_date:today,
      receive_date:today,
      lr_date:today,
      transport_date:today,
    }));
  }
}, [setFormData]);

    useEffect(() => {
        if (isEdit) {
            console.log(isEdit);
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
    }, [isEdit, formData?.transport_id]);
 

    const parties = useSelector((state) => state.getParty?.user?.data || []);
    const customers = useSelector((state) => state.getCustomers?.customers || []);
    const reciever = useSelector((state) => state.getGenMaster?.user?.data || []);
    const projects = useSelector((state) => state.getProject?.user?.data || []);
    const transport = useSelector((state) => state.getAdminTransport?.user?.data || []);
    const getAllPass = useSelector((state) => state.getPass?.data?.data || []);
    const unitLocationData = useSelector((state) => state.getUnitLocation?.user?.data || []);

    const handleChange = (e) => {
        const { name, value } = e.target;

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
                        payment_days: diffDays,
                    }));
                }
            }
        }

        setFormError((prev) => ({
            ...prev,
            [name]: null,
        }));

        handleFormChange(e);
    };


    const handleDropdownChange = (e) => {
        const { name, value } = e.target;

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

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFormError((prev) => ({
            ...prev,
            [name]: null,
        }));
    };

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
                                    <label>Issue Date <span className="login-danger">*</span></label>
                                    <input className="form-control" type="date" name="trans_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.trans_date} onChange={handleChange}
                                    />
                                    {
                                        formError?.trans_date && <div className="error">{formError.trans_date}</div>
                                    }
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Party Name <span className="login-danger">*</span>
                                    </label>
                                  
                                    <Dropdown
                                        value={formData?.party_id} // The selected _id
                                        options={parties?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "party_id", value: e.value } })}
                                        placeholder="Select Party"
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {formError?.party_id && <div className="error">{formError.party_id}</div>}
                                </div>

                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Firm Name <span className="login-danger">*</span>
                                    </label>
                                    <Dropdown
                                        value={formData?.customer_id} // The selected _id
                                        options={customers?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "customer_id", value: e.value } })}
                                        placeholder="Select Customer"
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi" 
                                    />
                                    {formError?.customer_id && <div className="error">{formError.customer_id}</div>}
                                </div>
                            </div>
                            {
                                formData?.issue_type === "Internal" && <>
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms">
                                            <label>
                                                Get Pass No <span className="login-danger">*</span>
                                            </label>
                                            <Dropdown
                                                value={formData?.pass_id} // The selected _id
                                                options={getAllPass?.map((item) => ({
                                                    label: `${item.card_no}-${item.full_name}`, // Display card number
                                                    value: item._id, // Store _id
                                                }))}
                                                onChange={(e) => handleDropdownChange({ target: { name: "pass_id", value: e.value } })}
                                                placeholder="Select Get Pass No"
                                                filter
                                                filterBy="label"
                                                appendTo="self"
                                                className="w-100 multi-prime-react model-prime-multi"
                                                
                                            />
                                            
                                            {formError?.pass_id && <div className="error">{formError.pass_id}</div>}
                                        </div>
                                    </div>
                                </>
                            }

                            {/* {isEdit && (
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-forms">
                                        <label>{voucher_name}</label>
                                        <input className="form-control" type="text"
                                            disabled value={formData?.voucher_no}
                                        />
                                    </div>
                                </div>
                            )} */}
                        </div>

                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Bill No. / Voucher No.<span className="login-danger">*</span></label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="bill_no"
                                        value={formData?.bill_no}
                                        onChange={handleChange}
                                    />
                                    {
                                        formError?.bill_no && <div className="error">{formError.bill_no}</div>
                                    }
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Project Name <span className="login-danger">*</span></label>
                                    <Dropdown
                                        value={formData?.project_id} // The selected _id
                                        options={projects?.map((item) => ({
                                            label: item.name, // Display name
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "project_id", value: e.value } })}
                                        placeholder="Select Project"
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

                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Recieving Date</label>
                                    <input className="form-control" type="date" name="receive_date" max={new Date().toISOString().split('T')[0]}
                                        value={formData?.receive_date} onChange={handleChange}
                                    />
                                </div>
                            </div>


                        </div>

                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Issue Type<span className="login-danger">*</span></label>
                                    <select
                                        className="form-select form-control"
                                        name="issue_type"
                                        value={formData?.issue_type}
                                        onChange={handleChange}
                                        disabled={isEdit}
                                    >
                                        <option value="">Select Issue</option>
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                    </select>
                                    {
                                        formError?.issue_type && <div className="error">{formError.issue_type}</div>
                                    }
                                </div>
                            </div>


                            {/* {formData?.issue_type === "Internal" && ( */}
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-forms">
                                        <label> Unit Location</label>
                                        <select
                                            className="form-select form-control"
                                            name="unit_location"
                                            value={formData?.unit_location}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Unit Location</option>
                                            {unitLocationData?.map((item, i) =>
                                                <option value={item._id} key={i}>{item.name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            {/* )} */}

                           {/* {formData?.issue_type === "External" && (
                                <div className="col-12 col-md-4 col-xl-4">
                                      <div className="input-block local-forms">
                                    <label>Chalan No<span className="login-danger">*</span></label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="challan_no"
                                        value={formData?.challan_no}
                                        onChange={handleChange}
                                    />
                                    {
                                        formError?.challan_no && <div className="error">{formError.challan_no}</div>
                                    }
                                </div>
                                </div>
                            )} */}

                            {
                                formData?.issue_type === "External" && <>
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms">
                                            <label>Reciever Name.</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="reciever_name"
                                                value={formData?.reciever_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms">
                                            <label>Transport <span className="login-danger">*</span></label>

                                            <Dropdown
                                                value={formData?.transport_id} // The selected _id
                                                options={transport?.map((item) => ({
                                                    label: item.name, // Display card number
                                                    value: item._id, // Store _id
                                                }))}
                                                onChange={(e) => handleDropdownChange({ target: { name: "transport_id", value: e.value } })}
                                                placeholder="Select Transport"
                                                filter
                                                filterBy="label"
                                                appendTo="self"
                                                className="w-100 multi-prime-react model-prime-multi"
                                            />
                                            {
                                                formError?.transport_id && formData?.issue_type === "External" && <div className="error">{formError.transport_id}</div>
                                            }
                                        </div>
                                    </div>
                                </>
                            }

                        </div>
                        {
                            formData?.issue_type === "External" && <>
                                <div className='row'>
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
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms">
                                            <label>Lr Date</label>
                                            <input className="form-control" type="date" name="lr_date" max={new Date().toISOString().split('T')[0]}
                                                value={formData?.lr_date} onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
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
                                    <div className="col-12 col-md-4 col-xl-4">
                                        <div className="input-block local-forms">
                                            <label>
                                                Address <span className="login-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="address"
                                                value={formData?.address}
                                                onChange={handleChange}
                                                placeholder="Enter Address"
                                            />
                                            {formError?.address && (
                                                <div className="error">{formError.address}</div>
                                            )}
                                        </div>
                                    </div>
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
                            </>
                        }
                        <div className='row'>
                            {isEdit && (
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-forms">
                                        <label>Issue No.</label>
                                        <input className="form-control" type="text"
                                            disabled value={formData?.issue_no}
                                        />
                                    </div>
                                </div>
                            )}
                            {isEdit && formData?.issue_type === "External" && (
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-forms">
                                        <label>Challan No.</label>
                                        <input className="form-control" type="text"
                                            disabled value={formData?.challan_no}
                                        />
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