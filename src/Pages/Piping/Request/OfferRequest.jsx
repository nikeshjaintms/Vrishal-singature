import React, { useEffect, useRef, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getParty } from '../../../Store/Store/Party/Party';
import Top from '../Include/Top';
import axios from 'axios';
import { V_URL } from '../../../BaseUrl';
import toast from 'react-hot-toast';
import { getUnit } from '../../../Store/Store/StoreMaster/Unit/Unit';

const OfferRequest = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = location.state;
   
    const formRefs = useRef([]);
    const [errors, setErrors] = useState({});
    const [offerDate, setOfferDate] = useState('');
    const [invoiceNo, setInvoiceNo] = useState("");
    const [disable, setDisable] = useState(false);
    const [itemsData, setItemsData] = useState([]);
    const [formValues, setFormValues] = useState([]);

    useEffect(() => {
        // const initialFormValues = itemsData.map((elem) => ({
        //     manufacture: elem.preffered_supplier?._id || '',
        //     offeredQty: '',
        //     rate:'',
        //     gst: '',
        //     amount:'',
        //     challan_qty: '',
        //     offerNos: '',
        //     offer_uom: '',
        //     offerLength: '',
        //     offerWidth: '',
        //     lotNo: '',
        //     remarks: '',
        //     offer_topbottom_thickness: '',
        //     offer_width_thickness: '',
        //     offer_normal_thickness: '',
        // }));
        const initialFormValues = itemsData.map((elem) => ({
    manufacture:
        elem?.orderPlacement?.manufacture?.[0]?._id ||
        elem?.preffered_supplier?.[0]?.supId?._id ||
        '',
    offeredQty: '',
    rate:'',
    gst: '',
    amount:'',
    challan_qty: '',
    offerNos: '',
    offer_uom: '',
    offerLength: '',
    offerWidth: '',
    lotNo: '',
    remarks: '',
    offer_topbottom_thickness: '',
    offer_width_thickness: '',
    offer_normal_thickness: '',
}));
        setFormValues(initialFormValues);
    }, [itemsData]);

    const handleInputChange = (index, e) => {
    const { name, value } = e.target;

    const updatedFormValues = [...formValues];
    updatedFormValues[index][name] = value;

    setFormValues(updatedFormValues);

    setErrors((prev) => ({
        ...prev,
        [`${name}_${index}`]: '',
    }));
};

    useEffect(() => {
        dispatch(getParty({ storeType: '' }));
        dispatch(getUnit());
    }, [dispatch]);

    useEffect(() => {
        if (data?._id) {
            const filterItems = data?.items?.filter(i => i?.balance_qty > 0);
            setItemsData(filterItems);
        }
        // eslint-disable-next-line
    }, [data?._id]);

    const stockData = useSelector((state) => state?.getItemStock?.user?.data);
    const unitData = useSelector((state) => state.getUnit?.user?.data);

    const handleSubmit = () => {
        const newErrors = {};
        let isValid = true;


        const hasValidOfferedQty = formRefs.current.some((form) => {
            const formData = new FormData(form);
            const offerQty = formData.get('offeredQty');
            return offerQty && parseFloat(offerQty) > 0;
        });
console.log("formRefs.current", formRefs.current);
console.log("hasValidOfferedQty", hasValidOfferedQty);
        if (!hasValidOfferedQty) {
            newErrors['offeredQty_all'] = 'At least one offer quantity must be provided.';
            isValid = false;
        }

        const newItems = formRefs.current.map((form, index) => {
            const formData = new FormData(form);
            const offerQty = formData.get('offeredQty');
           console.log("offerQty", offerQty);
            const manufactureCheck = formValues[index]?.manufacture;
            const offerUom = formData.get('offer_uom');
            const receiveDate = offerDate;
            const in_no = invoiceNo;

            if (offerQty) {
                // if (parseInt(offerQty) < 0 || parseFloat(offerQty) === 0) {
                //     isValid = false;
                //     newErrors[`offeredQty_${index}`] = 'Offer quantity value cannot be negative or equal to zero';
                // }
                const balanceQty = Number(itemsData[index]?.balance_qty || 0);
const offeredQty = Number(offerQty || 0);

if (offeredQty <= 0) {
    isValid = false;
    newErrors[`offeredQty_${index}`] =
        'Offer quantity must be greater than zero';
}
else if (offeredQty > balanceQty) {
    isValid = false;
    newErrors[`offeredQty_${index}`] =
        `Offer quantity cannot exceed balance quantity (${balanceQty})`;
}

if (!manufactureCheck) {
    isValid = false;
    newErrors[`manufacture_${index}`] =
        'Please select manufacture';
}
                //  else if (parseInt(offerQty) > parseInt(itemsData[index]?.balance_qty)) {
                //     isValid = false;
                //     newErrors[`offeredQty_${index}`] = 'Offer quantity value cannot exceed balance quantity';
                // }
                
                // if (!offerUom || offerUom === '') {
                //     isValid = false;
                //     newErrors[`offer_uom_${index}`] = 'Please select offer UOM';
                // }
            } else {
                return null;
            }

            if (!receiveDate) {
                isValid = false;
                newErrors['receive_date'] = 'Please select receive date';
            }
            if (!in_no) {
                isValid = false;
                newErrors['invoice_no'] = "Please enter invoice no."
            }
            return {
                transactionId: itemsData[index]._id,
                item_id: itemsData[index]?.itemName?._id,
                // make_manufacture: formData.get('manufacture'),
                // manufacture: JSON.parse(formData.get('manufacture') || '[]'),
                manufacture: formValues[index]?.manufacture || '',
                rate: itemsData[index]?.rate || 0,
                gst: itemsData[index]?.gst_amount || 0,
                total_amount: itemsData[index]?.amount || 0,
                balance_qty: itemsData[index]?.balance_qty || 0,
                offeredQty: formData.get('offeredQty'),
                challan_qty: formData.get('challan_qty'),
                // offerNos: formData.get('offerNos'),
                // offer_uom: formData.get('offer_uom'),
                // offerLength: formData.get('offerLength'),
                // offerWidth: formData.get('offerWidth'),
                // offerThickness: formData.get('offerThickness'),
                // offer_topbottom_thickness: formData.get('offer_topbottom_thickness'),
                // offer_width_thickness: formData.get('offer_width_thickness'),
                // offer_normal_thickness: formData.get('offer_normal_thickness'),
                lotNo: formData.get('lotNo'),
                remarks: formData.get('remarks'),
            }
        }).filter(item => item !== null);

        setErrors(newErrors);

        if (isValid) {
            setDisable(true)
            const myurl = `${V_URL}/user/manage-purchase-offer-piping`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('requestId', data?._id);
            bodyFormData.append('items', JSON.stringify(newItems));
            bodyFormData.append('received_date', offerDate);
            bodyFormData.append('invoice_no', invoiceNo);
            bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));

            axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/item-request-management');
                }
                setDisable(false);
            }).catch((error) => {
                console.log(error, '!!');
                toast.error(error?.response?.data?.message);
                setDisable(false);
            });
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const InputField = ({ label, value }) => (
        <div className="col-12 col-md-4 col-xl-4">
            <div className="input-block local-forms">
                <label>{label}</label>
                <input className="form-control" value={value} readOnly />
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
                                        <Link to="/piping/user/item-request-management">Request List</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Manage Offer Request</li>
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
                                            { label: 'Request No.', value: data?.requestNo },
                                            { label: 'Project', value: data?.project?.name },
                                            { label: 'Project Location', value: data?.storeLocation?.name },
                                            { label: 'PO Date', value: moment(data?.admin_approval_time).format('YYYY-MM-DD') },
                                            { label: 'Material PO No.', value: data?.material_po_no },
                                            { label: 'Department', value: data?.department?.name },
                                            { label: 'Approved By', value: data?.approvedBy?.name },
                                            { label: 'Prepared By', value: data?.preparedBy?.user_name },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>{label}</label>
                                                    <input className="form-control" value={value} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                        {/* <div className="col-12 col-md-4 col-xl-4">
                                            <div className="input-block local-forms">
                                                <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                                                <span className={`custom-badge ${data.status === 1 ? 'status-orange' :
                                                    data.status === 2 ? 'status-blue' :
                                                        data.status === 3 ? 'status-pink' :
                                                            data.status === 4 ? 'status-green' : ''
                                                    }`}>
                                                    {data.status === 1 ? 'Pending' :
                                                        data.status === 2 ? 'Approved By Admin' :
                                                            data.status === 3 ? 'Rejected By Admin' :
                                                                data.status === 6 ? 'Completed' : ''}
                                                </span>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className='row'>
                                        <InputField label="Client" value={data?.project?.party?.name} />
                                        <InputField label="PO / WO No." value={data?.project?.work_order_no} />
                                        <InputField label="Project PO No." value={data?.project?.work_order_no} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Item Details</h4>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-4 col-xl-4'>
                                            <div className="input-block local-forms">
                                                <label>Received Date <span className="login-danger">*</span></label>
                                                <input type='date' className="form-control" value={offerDate}
                                                    min={moment(data?.admin_approval_time).format('YYYY-MM-DD')} max={new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => setOfferDate(e.target.value)} />
                                                <div className='error'>{errors['receive_date']}</div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-md-4 col-xl-4'>
                                            <div className="input-block local-forms">
                                                <label>Invoice No. <span className="login-danger">*</span></label>
                                                <input type='text' className="form-control" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
                                                <div className='error'>{errors['invoice_no']}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    {itemsData?.map((elem, i) => (
    <form ref={(el) => (formRefs.current[i] = el)} key={i}>
                                            <div className="col-12">
                                               <input
    type="hidden"
    name="manufacture"
    value={JSON.stringify(elem?.orderPlacement?.manufacture || [])}
/>
                                            </div>

                                            <div className='row'>
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Item Name</label>
                                                        <input className="form-control"  value={elem?.itemName?.item_name || ''} disabled />
                                                    </div>
                                                </div>

                                             <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Item Description</label>
                                                        <input className="form-control" value={elem?.itemName?.item_description || ''}  disabled />
                                                    </div>
                                                </div>
                                                 <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Size 1</label>
                                                        <input className="form-control"  value={elem?.itemName?.size1?.name || ''} disabled />
                                                    </div>
                                                </div>
                                                 <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Thickness 1</label>
                                                        <input className="form-control"  value={elem?.itemName?.thickness1?.name || ''} disabled />
                                                    </div>
                                                </div>
                                                 <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Size 2</label>
                                                        <input className="form-control"  value={elem?.itemName?.size2?.name || '-'} disabled />
                                                    </div>
                                                </div>
                                                 <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Thickness 2</label>
                                                        <input className="form-control"  value={elem?.itemName?.thickness2?.name || '-'} disabled />
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Material Grade</label>
                                                        <input className="form-control"  value={elem?.itemName?.material_grade || ''} disabled />
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>UOM</label>
                                                        <input className="form-control"  value={elem?.itemName?.uom?.name || ''} disabled />
                                                    </div>
                                                </div>
                                               <div className='col-12 col-md-4 col-xl-4'>
    <div className="input-block local-forms">
        <label>Make / Manufacture</label>

        {/* <select
            className="form-control"
            name="manufacture"
            value={formValues[i]?.manufacture || ""}
            onChange={(e) => handleInputChange(i, e)}
        >
            <option value="">Select Manufacture</option>

            {elem?.orderPlacement?.manufacture?.map((m) => (
                <option key={m._id} value={m._id}>
                    {m.name}
                </option>
            ))}
            

        </select> */}
   <select
    className="form-control"
    name="manufacture"
    value={formValues[i]?.manufacture || ""}
    onChange={(e) => handleInputChange(i, e)}
>
    <option value="">Select Manufacture</option>

    {(
        elem?.orderPlacement?.manufacture?.length
            ? elem.orderPlacement.manufacture
            : elem?.preffered_supplier?.map((p) => p.supId)
    )?.map((m) => (
        <option key={m._id} value={m._id}>
            {m.name}
        </option>
    ))}
</select>

<div className="error">
    {errors[`manufacture_${i}`]}
</div>
    </div>
</div>
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Supplier</label>
                                                        <input className="form-control"  value={elem?.main_supplier?.name || ''} name='stock_qty'  disabled />
                                                    </div>
                                                </div>
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>PO Qty.</label>
                                                        <input className="form-control" value={elem?.orderPlacement?.qty || elem?.quantity || ''} disabled />
                                                    </div>
                                                </div>
                                             <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Balance Qty.</label>
                                                         <input
            className="form-control"
            value={
                Number(elem?.balance_qty || 0) -
                Number(formValues[i]?.offeredQty || 0)
            }
            disabled
        />
                                                    </div>
                                                </div>
                                               
                                            </div>

                                            <div className='row'>
                                               
                                                  <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Challan Qty.</label>
                                                        <input type='number' className="form-control" name="challan_qty" />
                                                    </div>
                                                </div>

                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Received Qty./Offered Qty<span className="login-danger">*</span></label>
                                                      <input
    type="number"
    className="form-control"
    name="offeredQty"
    value={formValues[i]?.offeredQty || ''}
    onChange={(e) => handleInputChange(i, e)}
/>

<div className="error">
    {errors[`offeredQty_${i}`]}
</div>
                                                        {/* <div className='error'>{errors[`offeredQty_${i}`]}</div> */}
                                                    </div>
                                                </div>

                                              

                                                {/* <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Heat/Lot No</label>
                                                        <input type='number' className="form-control" name="lotN" />
                                                    </div>
                                                </div> */}
                                                
                                                

                                                                               
                                                <div className='col-12'>
                                                    <div className="input-block local-forms">
                                                        <label>Remark</label>
                                                        <textarea className="form-control" name="remarks" />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                      ))}

                                    <div className='col-12 text-end'>
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}> {disable ? 'Processing...' : 'Submit'}</button>
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

export default OfferRequest