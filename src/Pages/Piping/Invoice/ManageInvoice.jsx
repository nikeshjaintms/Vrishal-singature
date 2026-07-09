import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import Sidebar from '../Include/Sidebar';
import Header from '../Include/Header';
import { getParty } from '../../../Store/Store/Party/Party';
import { Dropdown } from 'primereact/dropdown';
import { getTransport } from '../../../Store/Store/StoreMaster/Transport/Transport';
import InvoiceItems from '../../../Components/Invoice/InvoiceItems';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getPacking } from '../../../Store/Erp/Packing/Packing';
import { MultiSelect } from 'primereact/multiselect';
import moment from 'moment';

const ManageInvoice = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const [invoice, setInvoice] = useState({ party_id: '', invoice_date: '', vehicle_no: '', driver_name: '', transport_id: '', lrNo: '', lrDate: '', partyState: '' });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [savedItems, setSavedItems] = useState([]);
    const [packing, setPackings] = useState([]);

    useEffect(() => {
        if (data) {
            setInvoice({
                party_id: data?.party_id?._id,
                invoice_date: moment(data?.invoice_date).format('YYYY-MM-DD') || '',
                vehicle_no: data?.vehicle_no,
                driver_name: data?.driver_name,
                transport_id: data?.transport_id?._id,
                lrNo: data?.lr_no,
                lrDate: moment(data?.lr_date).format('YYYY-MM-DD') || '',
            });
            setPackings(data?.packing_list?.map(pac => ({
                packing_id: pac?.packing_id || pac
            })));
            setSavedItems(data.items);
        }
    }, [data]);

    useEffect(() => {
        dispatch(getParty({ storeType: '' }));
        dispatch(getTransport());
        dispatch(getPacking())
    }, [dispatch]);

    const partyData = useSelector((state) => state.getParty?.user?.data);
    const transportData = useSelector((state) => state.getTransport?.user?.data);
    const packingData = useSelector((state) => state.getPacking?.user?.data);

    // useEffect(() => {
    //     const findParty = partyData?.find((state) => state?._id === invoice.party_id);
    //     setInvoice({ ...invoice, partyState: findParty?.state });
    // }, [partyData, invoice.party_id]);

    const handleChange = (e, name) => {
        setInvoice({ ...invoice, [name]: e.value });
    }

    const handleChange2 = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    }

    const handleEditFormChange = (e) => {
        setPackings(e.target.value)
    }

    const handleSubmit = (e) => {
        if (validation()) {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('party_id', invoice.party_id);
            bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('invoice_date', invoice.invoice_date);
            bodyFormData.append('vehicle_no', invoice.vehicle_no);
            bodyFormData.append('driver_name', invoice.driver_name);
            bodyFormData.append('transport_id', invoice.transport_id);
            bodyFormData.append('lr_no', invoice.lrNo);
            bodyFormData.append('lr_date', invoice.lrDate);
            bodyFormData.append('tag_no', 16)
            bodyFormData.append('items', JSON.stringify(savedItems));
            bodyFormData.append('packing_list', JSON.stringify(packing))
            if (data?._id) {
                bodyFormData.append('id', data._id);
            }
            setDisable(true);
            axios({
                method: 'post',
                url: `${V_URL}/user/manage-invoice`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/invoice-management');
                }
                setDisable(false);
            }).catch((error) => {
                console.log(error, '!!');
                toast.error(error.response.data?.message || 'Something went wrong');
                setDisable(false);
            });
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!invoice.party_id) {
            isValid = false;
            err['party_id_err'] = "Please select party";
        }
        if (!invoice.invoice_date) {
            isValid = false;
            err['invoice_date_err'] = "Please select invoice date";
        }
        if (!invoice.vehicle_no) {
            isValid = false;
            err['vehicle_no_err'] = "Please enter vehicle no.";
        }
        if (!invoice.driver_name) {
            isValid = false;
            err['driver_name_err'] = "Please enter driver name";
        }
        if (!invoice.transport_id) {
            isValid = false;
            err['transport_id_err'] = "Please select transport";
        }
        if (!invoice.lrNo) {
            isValid = false;
            err['lrNo_err'] = "Please enter lr no.";
        }
        if (!invoice.lrDate) {
            isValid = false;
            err['lrDate_err'] = "Please select lr date";
        }
        if (savedItems.length === 0) {
            isValid = false;
            err['items_err'] = "Please add items";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const partyOptions = partyData?.map(pd => ({
        label: pd?.name,
        value: pd?._id
    }));
    const transportOptions = transportData?.map(td => ({
        label: td?.name,
        value: td?._id
    }));

    const packingOptions = packingData?.map(pa => ({
        label: pa?.voucher_no,
        value: pa?._id
    }))

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
                                    <li className="breadcrumb-item"> <Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"> <Link to="/piping/user/invoice-management">Invoice List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active"> {data?._id ? "Edit" : "Add"} Invoice </li>
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
                                                <h4>{data?._id ? "Edit" : "Add"} Invoice Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms">
                                                    <label>Invoice Date <span className="login-danger">*</span> </label>
                                                    <input className='form-control' type='date' onChange={handleChange2} name='invoice_date' value={invoice.invoice_date} />
                                                    <div className='error'>{error.inDate_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Party <span className="login-danger">*</span> </label>
                                                    <Dropdown
                                                        options={partyOptions}
                                                        value={invoice.party_id}
                                                        onChange={(e) => handleChange(e, 'party_id')}
                                                        filter className='w-100'
                                                        placeholder="Select Party"
                                                    />
                                                    <div className='error'>{error.party_err}</div>
                                                </div>
                                            </div>
                                            {/* {invoice?.party_id && (
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="input-block local-forms">
                                                        <label>Party State <span className="login-danger">*</span> </label>
                                                        <input className='form-control' value={invoice.partyState} readOnly />
                                                    </div>
                                                </div>
                                            )} */}
                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Transport <span className="login-danger">*</span> </label>
                                                    <Dropdown
                                                        options={transportOptions}
                                                        value={invoice.transport_id}
                                                        onChange={(e) => handleChange(e, 'transport_id')}
                                                        filter className='w-100'
                                                        placeholder="Select Transport"
                                                    />
                                                    <div className='error'>{error.transport_id_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms">
                                                    <label>Vehicle No. <span className="login-danger">*</span> </label>
                                                    <input className='form-control' type='text' onChange={handleChange2} name='vehicle_no' value={invoice.vehicle_no} />
                                                    <div className='error'>{error.vehicle_no_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms">
                                                    <label>Driver Name <span className="login-danger">*</span> </label>
                                                    <input className='form-control' type='text' onChange={handleChange2} name='driver_name' value={invoice.driver_name} />
                                                    <div className='error'>{error.driver_name_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms">
                                                    <label>Lr. No. <span className="login-danger">*</span> </label>
                                                    <input className='form-control' type='text' onChange={handleChange2} name='lrNo' value={invoice.lrNo} />
                                                    <div className='error'>{error.lrNo_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms">
                                                    <label>Lr. Date <span className="login-danger">*</span> </label>
                                                    <input className='form-control' type='date' onChange={handleChange2} name='lrDate' value={invoice.lrDate} />
                                                    <div className='error'>{error.lrDate_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Packing No. <span className="login-danger">*</span> </label>
                                                    <MultiSelect
                                                        value={packing?.map(pc => pc.packing_id)}
                                                        onChange={(e) => handleEditFormChange({
                                                            target: {
                                                                name: 'packing_id',
                                                                value: e.value.map(id => ({ packing_id: id }))
                                                            }
                                                        })}
                                                        options={packingOptions}
                                                        optionLabel="label"
                                                        placeholder="Select Packing No."
                                                        // display="chip"
                                                        filter
                                                        className='w-100 '
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <InvoiceItems savedItems={savedItems} setSavedItems={setSavedItems} />

                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="col-12 text-end">
                                    <div className="doctor-submit text-end">
                                        <button type="button" className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>
                                            {disable ? 'Processing...' : (data?._id ? 'Update' : 'Submit')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        </div >
    )
}

export default ManageInvoice