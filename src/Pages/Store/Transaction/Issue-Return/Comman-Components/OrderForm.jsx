import React, { useEffect, useState } from 'react'
import { getProject } from '../../../../../Store/Store/Project/Project';
import { getParty } from '../../../../../Store/Store/Party/Party';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminTransport } from '../../../../../Store/Store/StoreMaster/Transport/AdminTransport';
import { getGenMaster } from '../../../../../Store/Store/GenralMaster/GenMaster';
import { Dropdown } from 'primereact/dropdown';
import { getIssueGetPass } from '../../../../../Store/Store/MainStore/IssueReturn/GetIssuePassNo';
import { getIssueNo } from '../../../../../Store/Store/MainStore/IssueReturn/GetIssueNo';
import { getIssueChallan } from '../../../../../Store/Store/MainStore/IssueReturn/GetIssueChallanNo';
import { getTransport } from '../../../../../Store/Store/StoreMaster/Transport/Transport';


const OrderForm = ({ title, isEdit, formData, handleFormChange, setFormData, formError, setFormError, isEditVal }) => {
    const [showDriverField, setshowDriverField] = useState(false)
    const dispatch = useDispatch()
    const parties = useSelector((state) => state.getParty?.user?.data || []);
    const projects = useSelector((state) => state.getProject?.user?.data || []);
    const transportData = useSelector((state) => state.getTransport?.user?.data || []);
    const IssueChallnNo = useSelector((state) => state.getIssueChallan?.data?.data || []);
    const IssueNo = useSelector((state) => state.getIssueNo?.data?.data || []);
    const IssuepassNo = useSelector((state) => state.getIssueGetPassNo?.data?.data || []);

    useEffect(() => {
        dispatch(getParty({ storeType: '1', is_main: true }))
        dispatch(getProject())
        dispatch(getGenMaster({ tag_id: 14 }))
        dispatch(getAdminTransport({ is_main: true }))
       
    }, []);
 useEffect(() => {
        dispatch(getTransport());
    }, [dispatch]);
    useEffect(() => {
  if (!formData.trans_date) {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      trans_date: today,
      receive_date:today,
      transport_date:today,
      lr_date: today
    }));
  }
}, [setFormData]);

    useEffect(() => {
        dispatch(getIssueGetPass())
        if (formData?.pass_id) {
            const payload = {
                "tag_number": 13,
                "gate_pass_id": formData?.pass_id,
                "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                'firm_id': localStorage.getItem('PAY_USER_FIRM_ID')
            }
            dispatch(getIssueNo(payload))
        }
        dispatch(getIssueChallan())
    }, [formData?.pass_id, formData?.issue_no, formData?.issue_challan_no])


    useEffect(() => {
        if (isEdit) {
            const selectedTransport = transportData?.find((item) => item?._id === formData?.transport_id);
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
            const selectedTransport = transportData?.find((item) => item?._id === value);
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
        if (name === "issue_no") {
            setFormData((prev) => ({
                ...prev,
                issue_no: value,
                issue_challan_no: "",
            }));
        }
        if (name === "issue_challan_no") {
            setFormData((prev) => ({
                ...prev,
                issue_no: "",
                pass_id: "",
                issue_challan_no: value,
            }));
        }
        if (name === "pass_id") {
            setFormData((prev) => ({
                ...prev,
                pass_id: value,
                issue_challan_no: "",
            }));
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

  

let selectedItemsReturns = [];
try {
  selectedItemsReturns = JSON.parse(localStorage.getItem("selectedItemsReturns")) || [];
} catch (err) {
  console.error("Invalid JSON in localStorage");
  selectedItemsReturns = [];
}

    return (
<>

{selectedItemsReturns.length === 0 ? (
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
                                        Get pass No.<span className="login-danger">*</span>
                                    </label>
                                    <Dropdown
                                        value={formData?.pass_id}
                                        options={IssuepassNo?.map((item) => ({
                                            label: item.get_pass_no,
                                            value: item._id,
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "pass_id", value: e.value } })}
                                        placeholder="Select Get Pass No"
                                        disabled={isEdit}
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {/* {formError?.pass_id && <div className="error">{formError.pass_id}</div>} */}
                                </div>

                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        ISS No.<span className="login-danger">*</span>
                                    </label>
                                    <Dropdown
                                        value={formData?.issue_no} // The selected _id
                                        options={IssueNo?.map((item) => ({
                                            label: item.voucher_no, // Display name
                                            value: item.voucher_no, // Store _id
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "issue_no", value: e.value } })}
                                        placeholder="Select Issue No."
                                        disabled={!formData?.pass_id || isEdit}
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {/* {formError?.party_id && <div className="error">{formError.party_id}</div>} */}
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Challan No.<span className="login-danger">*</span>
                                    </label>
                                    <Dropdown
                                        value={formData?.issue_challan_no} // The selected _id
                                        options={IssueChallnNo?.map((item) => ({
                                            label: item.challan_no, // Display name
                                            value: item.challan_no, // Store _id
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "issue_challan_no", value: e.value } })}
                                        placeholder="Select Challan No"
                                        disabled={isEdit}
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {/* {formError?.party_id && <div className="error">{formError.party_id}</div>} */}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Issue Return Date <span className="login-danger">*</span></label>
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
                                        disabled
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {formError?.party_id && <div className="error">{formError.party_id}</div>}
                                </div>

                            </div>
                            {/* <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>
                                        Pass Name <span className="login-danger">*</span>
                                    </label>
                                    <Dropdown
                                        value={formData?.pass_id} // The selected _id
                                        options={getAllPass?.map((item) => ({
                                            label: item.card_no, // Display card number
                                            value: item._id, // Store _id
                                        }))}
                                        onChange={(e) => handleDropdownChange({ target: { name: "pass_id", value: e.value } })}
                                        placeholder="Select Pass"
                                        filter
                                        filterBy="label"
                                        appendTo="self"
                                        className="w-100 multi-prime-react model-prime-multi"
                                    />
                                    {formError?.pass_id && <div className="error">{formError.pass_id}</div>}
                                </div>

                            </div> */}
                            {isEdit && (
                                <div className="col-12 col-md-4 col-xl-4">
                                    <div className="input-block local-forms">
                                        <label>ISR NO</label>
                                        <input className="form-control" type="text"
                                            disabled value={formData?.voucher_no}
                                        />
                                    </div>
                                </div>
                            )}
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
                                        disabled
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
                                                options={transportData?.map((item) => ({
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
                    </div>
                </div>
            </div>
        </div>
        ) 
        : (
            <div className='row'>Issue</div>
  // Another form if selectedItemsReturns has data
//   <div className="row">
//             <div className="col-sm-12">
//                 <div className="card">
//                     <div className="card-body">
//                         <div className="col-12 d-flex justify-content-between">
//                             <div className="form-heading"><h4>{title}</h4></div>
//                         </div>
                      

//                 <div className='row'>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         Get pass No.<span className="login-danger">*</span>
//                                     </label>
//                                     <Dropdown
//                                         value={formData?.pass_id}
//                                         options={IssuepassNo?.map((item) => ({
//                                             label: item.get_pass_no,
//                                             value: item._id,
//                                         }))}
//                                         onChange={(e) => handleDropdownChange({ target: { name: "pass_id", value: e.value } })}
//                                         placeholder="Select Get Pass No"
//                                         disabled={isEdit}
//                                         filter
//                                         filterBy="label"
//                                         appendTo="self"
//                                         className="w-100 multi-prime-react model-prime-multi"
//                                     />
//                                     {/* {formError?.pass_id && <div className="error">{formError.pass_id}</div>} */}
//                                 </div>

//                             </div>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         ISS No.<span className="login-danger">*</span>
//                                     </label>
//                                     <Dropdown
//                                         value={formData?.issue_no} // The selected _id
//                                         options={IssueNo?.map((item) => ({
//                                             label: item.voucher_no, // Display name
//                                             value: item.voucher_no, // Store _id
//                                         }))}
//                                         onChange={(e) => handleDropdownChange({ target: { name: "issue_no", value: e.value } })}
//                                         placeholder="Select Issue No."
//                                         // disabled={!formData?.pass_id || isEdit}
//                                          disabled={isEdit}
//                                         filter
//                                         filterBy="label"
//                                         appendTo="self"
//                                         className="w-100 multi-prime-react model-prime-multi"
//                                     />
//                                     {/* {formError?.party_id && <div className="error">{formError.party_id}</div>} */}
//                                 </div>
//                             </div>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         Challan No.<span className="login-danger">*</span>
//                                     </label>
//                                     <Dropdown
//                                         value={formData?.issue_challan_no} // The selected _id
//                                         options={IssueChallnNo?.map((item) => ({
//                                             label: item.challan_no, // Display name
//                                             value: item.challan_no, // Store _id
//                                         }))}
//                                         onChange={(e) => handleDropdownChange({ target: { name: "issue_challan_no", value: e.value } })}
//                                         placeholder="Select Challan No"
//                                         disabled={isEdit}
//                                         // filter
//                                         filterBy="label"
//                                         appendTo="self"
//                                         className="w-100 multi-prime-react model-prime-multi"
//                                     />
//                                     {/* {formError?.party_id && <div className="error">{formError.party_id}</div>} */}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className='row'>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>Issue Return Date <span className="login-danger">*</span></label>
//                                     <input className="form-control" type="date" name="trans_date" max={new Date().toISOString().split('T')[0]}
//                                         value={formData?.trans_date} onChange={handleChange}
//                                     />
//                                     {
//                                         formError?.trans_date && <div className="error">{formError.trans_date}</div>
//                                     }
//                                 </div>
//                             </div>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         Party Name <span className="login-danger">*</span>
//                                     </label>
//                                     <Dropdown
//                                         value={formData?.party_id} // The selected _id
//                                         options={parties?.map((item) => ({
//                                             label: item.name, // Display name
//                                             value: item._id, // Store _id
//                                         }))}
//                                         onChange={(e) => handleDropdownChange({ target: { name: "party_id", value: e.value } })}
//                                         placeholder="Select Party"
//                                         // disabled
//                                         filter
//                                         filterBy="label"
//                                         appendTo="self"
//                                         className="w-100 multi-prime-react model-prime-multi"
//                                     />
//                                     {formError?.party_id && <div className="error">{formError.party_id}</div>}
//                                 </div>

//                             </div>
//                             {/* <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         Pass Name <span className="login-danger">*</span>
//                                     </label>
//                                     <Dropdown
//                                         value={formData?.pass_id} // The selected _id
//                                         options={getAllPass?.map((item) => ({
//                                             label: item.card_no, // Display card number
//                                             value: item._id, // Store _id
//                                         }))}
//                                         onChange={(e) => handleDropdownChange({ target: { name: "pass_id", value: e.value } })}
//                                         placeholder="Select Pass"
//                                         filter
//                                         filterBy="label"
//                                         appendTo="self"
//                                         className="w-100 multi-prime-react model-prime-multi"
//                                     />
//                                     {formError?.pass_id && <div className="error">{formError.pass_id}</div>}
//                                 </div>

//                             </div> */}
//                             {isEdit && (
//                                 <div className="col-12 col-md-4 col-xl-4">
//                                     <div className="input-block local-forms">
//                                         <label>ISR NO</label>
//                                         <input className="form-control" type="text"
//                                             disabled value={formData?.voucher_no}
//                                         />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className='row'>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>Bill No. / Voucher No.<span className="login-danger">*</span></label>
//                                     <input
//                                         className="form-control"
//                                         type="text"
//                                         name="bill_no"
//                                         value={formData?.bill_no}
//                                         onChange={handleChange}
//                                     />
//                                     {
//                                         formError?.bill_no && <div className="error">{formError.bill_no}</div>
//                                     }
//                                 </div>
//                             </div>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         Project Name <span className="login-danger">*</span></label>
//                                     <Dropdown
//                                         value={formData?.project_id} // The selected _id
//                                         options={projects?.map((item) => ({
//                                             label: item.name, // Display name
//                                             value: item._id, // Store _id
//                                         }))}
//                                         onChange={(e) => handleDropdownChange({ target: { name: "project_id", value: e.value } })}
//                                         placeholder="Select Project"
//                                         // disabled
//                                         filter
//                                         filterBy="label"
//                                         appendTo="self"
//                                         className="w-100 multi-prime-react model-prime-multi"
//                                     />
//                                     {
//                                         formError?.project_id && <div className="error">{formError.project_id}</div>
//                                     }
//                                 </div>
//                             </div>

//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>Recieving Date</label>
//                                     <input className="form-control" type="date" name="receive_date" max={new Date().toISOString().split('T')[0]}
//                                         value={formData?.receive_date} onChange={handleChange}
//                                     />
//                                 </div>
//                             </div>


//                         </div>

//                         <div className='row'>
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>
//                                         Issue Type<span className="login-danger">*</span></label>
//                                     <select
//                                         className="form-select form-control"
//                                         name="issue_type"
//                                         // value={formData?.issue_type}
//                                         onChange={handleChange}
//                                         // disabled
//                                     >
//                                         <option value="">Select Issue</option>
//                                         <option value="Internal">Internal</option>
//                                         <option value="External">External</option>
//                                     </select>
//                                     {
//                                         formError?.issue_type && <div className="error">{formError.issue_type}</div>
//                                     }
//                                 </div>
//                             </div>
//                             {
//                                 formData?.issue_type === "External" && <>
//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>Reciever Name.</label>
//                                             <input
//                                                 className="form-control"
//                                                 type="text"
//                                                 name="reciever_name"
//                                                 value={formData?.reciever_name}
//                                                 onChange={handleChange}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>Transport <span className="login-danger">*</span></label>

//                                             <Dropdown
//                                                 value={formData?.transport_id} // The selected _id
//                                                 options={transportData?.map((item) => ({
//                                                     label: item.name, // Display card number
//                                                     value: item._id, // Store _id
//                                                 }))}
                                                
//                                                 onChange={(e) => handleDropdownChange({ target: { name: "transport_id", value: e.value } })}
//                                                 placeholder="Select Transport"
//                                                 filter
//                                                 filterBy="label"
//                                                 appendTo="self"
//                                                 className="w-100 multi-prime-react model-prime-multi"
//                                             />
//                                             {
//                                                 formError?.transport_id && formData?.issue_type === "External" && <div className="error">{formError.transport_id}</div>
//                                             }
//                                         </div>
//                                     </div>
//                                 </>
//                             }

//                         </div>
//                         {
//                             formData?.issue_type === "External" && <>
//                                 <div className='row'>
//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>Transport Date</label>
//                                             <input className="form-control" type="date" name="transport_date" max={new Date().toISOString().split('T')[0]}
//                                                 value={formData?.transport_date} onChange={handleChange}
//                                             />
//                                             {
//                                                 formError?.transport_date && <div className="error">{formError?.transport_date}</div>
//                                             }
//                                         </div>
//                                     </div>
//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>
//                                                 Lr No.
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="lr_no"
//                                                 value={formData?.lr_no || ""}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter Lr No"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>Lr Date</label>
//                                             <input className="form-control" type="date" name="lr_date" max={new Date().toISOString().split('T')[0]}
//                                                 value={formData?.lr_date} onChange={handleChange}
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='row'>
//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>
//                                                 Vehical No.
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="vehical_no"
//                                                 value={formData?.vehical_no || ""}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter Vehical No"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="col-12 col-md-4 col-xl-4">
//                                         <div className="input-block local-forms">
//                                             <label>
//                                                 Address <span className="login-danger">*</span>
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 name="address"
//                                                 value={formData?.address}
//                                                 onChange={handleChange}
//                                                 placeholder="Enter Address"
//                                             />
//                                             {formError?.address && (
//                                                 <div className="error">{formError.address}</div>
//                                             )}
//                                         </div>
//                                     </div>
//                                     {showDriverField && (
//                                         <div className="col-12 col-md-4 col-xl-4">
//                                             <div className="input-block local-forms">
//                                                 <label>
//                                                     Driver Name <span className="login-danger">*</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="driver_name"
//                                                     value={formData?.driver_name || ""}
//                                                     onChange={handleChange}
//                                                     placeholder="Enter Driver Name"
//                                                 />
//                                                 {formError?.driver_name && (
//                                                     <div className="error">{formError.driver_name}</div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </>
//                         }
//                         {isEdit && (
//                             <div className="col-12 col-md-4 col-xl-4">
//                                 <div className="input-block local-forms">
//                                     <label>Issue No.</label>
//                                     <input className="form-control" type="text"
//                                         disabled value={formData?.issue_no}
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
)
}
</>
    )
}
export default OrderForm