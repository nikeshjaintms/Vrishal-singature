import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginFirm } from '../../../../Store/MutipleDrawing/Invoice/getLoginFirm';
import { getLoginProject } from '../../../../Store/MutipleDrawing/Invoice/getLoginProject';
import moment from 'moment';
import InvoiceTable from './components/InvoiceTable';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUnit } from '../../../../Store/Store/StoreMaster/Unit/Unit';

const ManageMultiInvoice = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;

    const [formValues, setFormValues] = useState({
        ra: '',
        invoiceNo: '',
        invoiceDate: ''
    });
    const [newItem, setNewItem] = useState({
        description: '', quantity: '', unit: '', unitRate: '', poQty: '', poAmount: '',
        uptoPrevious: '', thisInvoice: "", cummilative: " ", remarks: "", item_no: "",
    });
    const [disable, setDisable] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [editIndex, setEditIndex] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [itemErrors, setItemErrors] = useState({});
    const [firmData, setFirmData] = useState({});
    const [projectData, setProjectData] = useState({});

    const [gstType, setGstType] = useState("");
    const [taxRate, setTaxRate] = useState('');  // Initially empty, user can modify

    useEffect(() => {
        dispatch(getLoginFirm());
        dispatch(getLoginProject());
        dispatch(getUnit());
    }, []);

    useEffect(() => {
        if (data?._id) {
            setFormValues({
                ra: data?.ra,
                invoiceNo: data?.invoiceNo,
                invoiceDate: moment(data?.invoiceDate).format('YYYY-MM-DD')
               
            });
            setGstType(data?.taxType || "noGst");
            setTaxRate(data?.taxRate || '');
            setItems(data?.items);
        }
    }, [data]);

    const firmDetails = useSelector((state) => state?.getLoginFirm?.user?.data);
    const projectDetails = useSelector((state) => state?.getLoginProject?.user?.data);
    const units = useSelector((state) => state?.getUnit?.user?.data);

    const finalunits = units?.map((unit) => ({
        label: unit.name,
        value: unit._id
    }));

    console.log("finalunits", finalunits);

    useEffect(() => {
        if (!data?._id) {
            setFirmData({
                _id: firmDetails?._id,
                name: firmDetails?.name,
                address: firmDetails?.address,
                city: firmDetails?.city,
                pincode: firmDetails?.pincode,
                gstNumber: firmDetails?.gst_no || "-",
            });
            setProjectData({
                _id: projectDetails?._id,
                name: projectDetails?.party?.name,
                address: projectDetails?.party?.address,
                city: projectDetails?.party?.city,
                pincode: projectDetails?.party?.pincode,
                gstNumber: projectDetails?.party?.gstNumber,
                work_order_no: projectDetails?.work_order_no,
                po_date: moment(projectDetails?.po_date).format('YYYY-MM-DD'),
            });
        } else if (data?._id) {
            setFirmData({
                _id: data?.firmId,
                name: data?.firmName,
                address: data?.firmAddress,
                city: data?.firmCity,
                pincode: data?.firmPincode,
                gstNumber: data?.firmGstNo || "-",
            });
            setProjectData({
                _id: data?.projectId,
                name: data?.clientName,
                address: data?.clientAddress,
                city: data?.clientCity,
                pincode: data?.clientPincode,
                gstNumber: data?.clientGSTNo,
                work_order_no: data?.projectPoNo,
                po_date: moment(data?.projectPoDate).format('YYYY-MM-DD'),
            });
        } else {
            setFirmData({});
            setProjectData({});
        }
    }, [data, firmDetails, projectDetails]);

    const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

    const handleAddItem = () => {
        if (!validateNewItem()) return;

        if (editIndex !== null) {
            const updatedItems = [...items];
            updatedItems[editIndex] = newItem;
            setItems(updatedItems);
            setEditIndex(null);
        } else {
            setItems([...items, newItem]);
        }
        setNewItem({
            description: '', quantity: '', unit: '', unitRate: '', poQty: '', poAmount: '',
            uptoPrevious: '', thisInvoice: "", cummilative: " ", remarks: "", item_no: "",
        });

        setItemErrors({});
    };

    const handleEditItem = (index) => {
        setNewItem(items[index]);
        setEditIndex(index);
    };

    const handleDeleteItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedItem = { ...newItem, [name]: value };
        if (name === "unitRate" || name === "poQty") {
            updatedItem.poAmount = (updatedItem.unitRate * updatedItem.poQty) || 0;
        }
        if (name === "unitRate" || name === "quantity") {
            updatedItem.thisInvoice = parseFloat((updatedItem.unitRate * updatedItem.quantity).toFixed(2)) || 0;
        }
        if (name === "uptoPrevious" || name === "thisInvoice") {
            updatedItem.cummilative = parseFloat((parseFloat((updatedItem.uptoPrevious)) + parseFloat(updatedItem.thisInvoice)).toFixed(2)) || 0;
        }
        setNewItem(updatedItem);
    };

    // Handle custom tax rate input
    const handleTaxRateChange = (e) => {
        const inputTaxRate = e.target.value;
        if (inputTaxRate && !isNaN(inputTaxRate)) {
            setTaxRate(parseFloat(inputTaxRate));
        } else {
            setTaxRate(''); // If invalid input, reset tax rate
        }
    };

    const handleGstChange = (e) => {
        const selectedGstType = e.target.value;
        setGstType(selectedGstType);

        // Don't automatically set the tax rate, leave it empty for manual input
        if (selectedGstType === "cgstSgst" || selectedGstType === "igst" || selectedGstType === "noGst") {
            setTaxRate(''); // Clear the tax rate so the user can input it manually
        }
    };

    const calculateTotals = () => {
        const totalAmountBeforeTax = items.reduce((sum, item) => sum + Number(item.thisInvoice), 0);
        let cgst = 0, sgst = 0, igst = 0, taxAmount = 0;

        if (gstType === "cgstSgst" && taxRate) {
            // Divide the total tax rate by 2 for CGST and SGST calculation
            const halfRate = taxRate / 2;
            cgst = (totalAmountBeforeTax * halfRate) / 100;
            sgst = (totalAmountBeforeTax * halfRate) / 100;
            taxAmount = cgst + sgst;
        } else if (gstType === "igst" && taxRate) {
            // IGST uses the full tax rate
            igst = (totalAmountBeforeTax * taxRate) / 100;
            taxAmount = igst;
        }

        const totalAmountAfterTax = totalAmountBeforeTax + taxAmount;

        return { totalAmountBeforeTax, taxAmount, totalAmountAfterTax, cgst, sgst, igst };
    };

    const { totalAmountBeforeTax, taxAmount, totalAmountAfterTax, cgst, sgst, igst } = calculateTotals();

    // const handleSubmit = () => {
    //     if (validateForm()) {
    //         setDisable(true);
    //         const myurl = `${V_URL}/user/manage-multi-invoice`;
    //         const bodyFormData = new URLSearchParams();
    //         bodyFormData.append('ra', formValues.ra);
    //         bodyFormData.append('projectId', projectData._id);
    //         bodyFormData.append('invoiceNo', formValues.invoiceNo);
    //         bodyFormData.append('invoiceDate', moment(formValues.invoiceDate).format('YYYY-MM-DD'));
    //         bodyFormData.append('firmId', firmData._id);
    //         bodyFormData.append('items', JSON.stringify(items));
    //         bodyFormData.append('totalAmount', totalAmountBeforeTax);
    //         bodyFormData.append('taxAmount', taxAmount);
    //         bodyFormData.append('netAmount', totalAmountAfterTax);

    //         axios({
    //             method: "post",
    //             url: myurl,
    //             data: bodyFormData,
    //             headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    //         }).then((response) => {
    //             if (response.data?.success === true) {
    //                 toast.success(response.data.message);
    //                 navigate('/piping/user/invoice-management');
    //             } else {
    //                 toast.error(response.data.message);
    //             }
    //         }).catch((error) => {
    //             console.log(error, "error");
    //             toast.error(error?.response?.data?.message);
    //         }).finally(() => {
    //             setDisable(false);
    //         })
    //     }
    // };

    const handleSubmit = () => {
        if (validateForm()) {
            setDisable(true);
            const myurl = `${V_URL}/user/piping/manage-multi-invoice`;
            const bodyFormData = new URLSearchParams();
            
            // Basic Info
            bodyFormData.append('ra', formValues.ra);
            bodyFormData.append('projectId', projectData._id);
            bodyFormData.append('invoiceNo', formValues.invoiceNo);
            bodyFormData.append('invoiceDate', moment(formValues.invoiceDate).format('YYYY-MM-DD'));
            bodyFormData.append('firmId', firmData._id);
            bodyFormData.append('items', JSON.stringify(items));
            
            // Tax and Totals
            bodyFormData.append('taxType', gstType);
            bodyFormData.append('taxRate', taxRate);
            bodyFormData.append('totalAmount', totalAmountBeforeTax);
            bodyFormData.append('taxAmount', taxAmount);
            bodyFormData.append('cgst', cgst);
            bodyFormData.append('sgst', sgst);
            bodyFormData.append('igst', igst);
            bodyFormData.append('netAmount', totalAmountAfterTax);
            if (data?._id) bodyFormData.append('id', data._id);

            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data?.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/invoice-management');
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
            }).finally(() => {
                setDisable(false);
            });
        }
    };

    
    const validateForm = () => {
        let errors = {};
        if (!formValues.ra) errors.ra = 'RA is required';
        if (!formValues.invoiceNo) errors.invoiceNo = 'Invoice No is required';
        if (!formValues.invoiceDate) errors.invoiceDate = 'Invoice Date is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateNewItem = () => {
        let errors = {};
        if (!newItem.description?.trim()) errors.description = "Description is required";
        setItemErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <PageHeader breadcrumbs={
                            [
                                { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                                { name: "Invoice List", link: "/piping/user/invoice-management", active: false },
                                { name: `${data?._id ? "Edit" : "Add"} Invoice`, active: true }
                            ]
                        } />

                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className='mb-4'>Manufacturer's Detail : -</h4>
                                        <div>
                                            <p className='mb-2'>{firmData?.name}</p>
                                            <p className='m-0'>{firmData?.address}, {firmData?.city} - {firmData?.pincode}</p>
                                            <p className='m-0'>GST Regn. No. - {firmData.gstNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title mb-4">Invoice & PO Details</h4>
                                        <div className="row">
                                            <div className='col-12 col-md-4'>
                                                <div className="input-block local-forms">
                                                    <label>RA <span className="login-danger">*</span> </label>
                                                    <input type='text' className='form-control' name='ra' value={formValues.ra} onChange={handleChange} />
                                                    {formErrors.ra && <span className="error">{formErrors.ra}</span>}
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4'>
                                                <div className="input-block local-forms">
                                                    <label>INVOICE NO <span className="login-danger">*</span> </label>
                                                    <input className='form-control' name='invoiceNo' type='text' value={formValues.invoiceNo} onChange={handleChange} />
                                                    {formErrors.invoiceNo && <span className="error">{formErrors.invoiceNo}</span>}
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4'>
                                                <div className="input-block local-forms">
                                                    <label>INVOICE DATE <span className="login-danger">*</span> </label>
                                                    <input className='form-control' name='invoiceDate' type='date' value={formValues.invoiceDate} onChange={handleChange} />
                                                    {formErrors.invoiceDate && <span className="error">{formErrors.invoiceDate}</span>}
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-6'>
                                                <div className="input-block local-forms">
                                                    <label>GST Type</label>
                                                    <select className="form-control" value={gstType} onChange={handleGstChange}>
                                                        <option value="">Select GST TYPE</option>
                                                        <option value="noGst">No GST</option>
                                                        <option value="cgstSgst">CGST/SGST</option>
                                                        <option value="igst">IGST</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <div className="input-block local-forms">
                                                    <label>Tax Rate (%)</label>
                                                    <input 
                                                        className="form-control" 
                                                        type="number" 
                                                        value={taxRate || ''} 
                                                        onChange={handleTaxRateChange} 
                                                        placeholder="Enter tax rate"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="col-md-6 col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Buyer / Consignee :-</h4>
                                        <div>
                                            <p className='mb-2'>{projectData?.name}</p>
                                            <div>
                                                <p className='m-0'>{projectData?.address},</p>
                                                <p className='m-0'>{projectData?.city}-{projectData?.pincode}</p>
                                            </div>
                                            <p className='m-0'>GST Regn. No. - {projectData?.gstNumber}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                       <InvoiceTable
                            newItem={newItem}
                            handleInputChange={handleInputChange}
                            handleAddItem={handleAddItem}
                            editIndex={editIndex}
                            items={items}
                            handleEditItem={handleEditItem}
                            handleDeleteItem={handleDeleteItem}
                            // Pass all individual tax components to the table
                            totals={{ totalAmountBeforeTax, taxAmount, totalAmountAfterTax, cgst, sgst, igst }}
                            itemErrors={itemErrors}
                            gstType={gstType}
                            taxRate={taxRate}
                            units={finalunits}
                        />

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12 text-end">
                                            <div className="doctor-submit">
                                                <button type="button" className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>
                                                    {disable ? 'Processing...' : data?._id ? "Update" : "Generate Invoice"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageMultiInvoice;
