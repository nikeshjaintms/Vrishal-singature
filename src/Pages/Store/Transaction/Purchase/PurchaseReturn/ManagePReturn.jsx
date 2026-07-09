import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSingleOrder } from '../../../../../Store/Store/Order/GetSingleOrder';
import { getOrder } from '../../../../../Store/Store/Order/Order';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { M_STORE, V_URL } from '../../../../../BaseUrl';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';
import axios from 'axios';
import PurchasePRTable from './Components/PurchasePRTable';
import { getGenMaster } from '../../../../../Store/Store/GenralMaster/GenMaster';

const ManagePReturn = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [purchaseReturn, setPurchaseReturn] = useState({ bill: '', challan_no: '', receiver_name: '', });
    const [returnDate, setReturnDate] = useState('');
    const [filteredChallanOptions, setFilteredChallanOptions] = useState([]);
    const [uniqueBillOptions, setUniqueBillOptions] = useState([]);
    const [disable, setDisable] = useState(false);
    const [returnObj, setReturnObj] = useState({});
    const [returnItems, setReturnItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [finalTable, setFinalTable] = useState([]);
    const [error, setError] = useState({});
    const [returnArr, setReturnArr] = useState([]);
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (data) {
            setPurchaseReturn({
                bill: data?.return_details?.bill_no,
                challan_no: data?.return_details?.challan_no,
                receiver_name: data?.master?._id
            });
            setReturnDate(data?.trans_date ? moment(data?.trans_date).format('YYYY-MM-DD') : '')
        }
    }, [data]);

    console.log(data, '22222')

    useEffect(() => {
        const fetchData = () => {
            const filter = {
                date: {
                    start: null,
                    end: null
                }
            }
            const bodyFormData = new URLSearchParams();
            bodyFormData.append("tag_number", 11);
            bodyFormData.append("search", "");
            bodyFormData.append("filter", JSON.stringify(filter));
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
            dispatch(getOrder({ formData: bodyFormData }));
        };
        fetchData();
        if (returnObj?._id) {
            dispatch(getSingleOrder({ id: returnObj?._id, tag_number: 11 }));
            getPurchaseReturnItems();
        }
        dispatch(getGenMaster({ tag_id: 12 }));
    }, [dispatch, purchaseReturn?.bill, purchaseReturn?.challan_no, returnObj?._id]);

    const Purchase = useSelector((state => state?.getPurchaseorder?.user?.data))
    const getSinglePurchase = useSelector((state) => state?.getSinglePurchaseorder?.user?.data || []);
    const reciever = useSelector((state) => state.getGenMaster?.user?.data || []);

    const getPurchaseReturnItems = async () => {
        if (returnObj?._id) {
            const filter = {
                date: {
                    start: null,
                    end: null
                }
            }
            const formData = new URLSearchParams();
            formData.append("tag_number", 12);
            formData.append("search", "");
            formData.append("filter", JSON.stringify(filter));
            formData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
            formData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
            const response = await axios({
                method: 'post',
                url: `${V_URL}/user/get-ms-alltransaction`,
                data: formData,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });
            const returnData = response?.data?.data
            const filterReturn = returnData?.find((re) => re?.return_id === returnObj?._id);
            if (filterReturn?.return_id) {
                const bodyFormData = new URLSearchParams();
                bodyFormData.append('tag', 12)
                bodyFormData.append('return_id', filterReturn?.return_id)
                axios({
                    method: 'post',
                    url: `${V_URL}/user/get-return-details`,
                    data: bodyFormData,
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                    },
                }).then((response) => {
                    if (response?.data?.success) {
                        setReturnArr(response?.data?.data);
                    }
                }).catch((error) => {
                    console.log(error, 'Error')
                })
            }
        }
    }

    useEffect(() => {
        if (getSinglePurchase?.items_details?.length > 0) {
            const filterItems = getSinglePurchase?.items_details?.filter((purchaseItem) =>
                !returnArr?.some((returnItem) =>
                    returnItem?.items_details?.some((returnDetails) =>
                        returnDetails?.item_id === purchaseItem?.item_id && returnDetails?.rate === purchaseItem?.rate
                    )
                )
            );
            setReturnItems(filterItems);
        }
    }, [getSinglePurchase, returnArr]);

    useEffect(() => {
        if (Purchase) {
            const uniqueBills = Purchase?.reduce((acc, curr) => {
                if (!acc.some(item => item.label === curr.bill_no)) {
                    acc.push({ label: curr.bill_no, value: curr.bill_no });
                }
                return acc;
            }, []);
            setUniqueBillOptions(uniqueBills);
        }
    }, [Purchase]);

    useEffect(() => {
        let challans = [];
        if (purchaseReturn.bill) {
            challans = Purchase?.filter(e => e.bill_no === purchaseReturn.bill && e.challan_no).map(e => ({ label: e.challan_no, value: e.challan_no }));
        } else {
            challans = Purchase?.filter(e => e.challan_no).map(e => ({ label: e.challan_no, value: e.challan_no }));
        }
        setFilteredChallanOptions(challans || []);
    }, [purchaseReturn.bill, Purchase]);

    useEffect(() => {
        if (!data?._id) {
            let findReturn = null;
            if (purchaseReturn.bill && purchaseReturn.challan_no) {
                findReturn = Purchase?.find(e => e.bill_no === purchaseReturn.bill && e.challan_no === purchaseReturn.challan_no);
            } else if (purchaseReturn.bill) {
                findReturn = Purchase?.find(e => e.bill_no === purchaseReturn.bill);

                if (findReturn && purchaseReturn.challan_no) {
                    findReturn = Purchase?.filter(e => e.bill_no === purchaseReturn.bill && e.challan_no === purchaseReturn.challan_no)[0];
                }
            } else if (purchaseReturn.challan_no) {
                findReturn = Purchase?.find(e => e.challan_no === purchaseReturn.challan_no);
            } else {
                setReturnObj({});
                setReturnItems([]);
            }
            setReturnObj(findReturn || {});
        } else {
            setReturnObj(data);
        }
    }, [Purchase, purchaseReturn.bill, purchaseReturn.challan_no, data?._id]);

    const handleReturnQtyChange = (e, index, maxQuantity) => {
        const value = Number(e.target.value);
        if (value < 0 || value > maxQuantity) {
            // toast.error(`Return quantity must be between 0 and ${maxQuantity}.`);
            return;
        }
        setReturnItems((prev) => {
            const updatedItems = [...prev];
            updatedItems[index] = { ...updatedItems[index], return_qty: value };
            const amountCount = [...prev];
            const item = amountCount[index];

            const returnQty = value;
            const rate = parseFloat(item.rate);
            const amount = parseFloat(returnQty * rate);
            const discountAmount = (amount * item.discount) / 100;
            const spDiscountAmount = ((amount - discountAmount) * item.sp_discount) / 100;
            const taxableAmount = parseFloat((amount - discountAmount - spDiscountAmount).toFixed(2));
            const gstAmount = (taxableAmount * parseFloat(item.gst)) / 100;
            const totalAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));

            amountCount[index] = {
                ...item,
                return_qty: returnQty,
                amount,
                discount_amount: discountAmount,
                sp_discount_amount: spDiscountAmount,
                taxable_amount: taxableAmount,
                gst_amount: gstAmount,
                total_amount: totalAmount,
            };

            const filteredItems = amountCount.filter(item => item.return_qty > 0);
            setFinalTable(filteredItems);
            return updatedItems;
        });
    };

    const commentsData = useMemo(() => {
        let computedComments = returnItems;
        if (search) {
            computedComments = computedComments.filter(it =>
                it.item_name.toLowerCase().includes(search.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, returnItems]);

    const handleChange = (e, name) => {
        setPurchaseReturn(prev => {
            const updatedState = { ...prev, [name]: e.value };
            if (name === 'bill') {
                updatedState.challan_no = '';
            }
            if (name === 'challan_no' && e.value) {
                const selectedChallan = Purchase.find(item => item.challan_no === e.value);
                if (selectedChallan && selectedChallan.bill_no) {
                    updatedState.bill = selectedChallan.bill_no;
                }
            }
            return updatedState;
        });
    };

    const handleSubmit = () => {
        if (!validation()) return;
        setDisable(true);
        if (!data?._id) {
            const finalData = finalTable?.map((e) => e)
            const myurl = `${V_URL}/user/add-ms-transaction`;
            const payload = {
                tag_number: 12,
                firm_id: localStorage.getItem('PAY_USER_FIRM_ID'),
                year_id: localStorage.getItem('PAY_USER_YEAR_ID'),
                return_id: returnObj?._id,
                master_id: purchaseReturn.receiver_name,
                trans_date: returnDate,
                items_details: finalData
            }
            axios({
                method: 'post',
                url: myurl,
                data: payload,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response?.data?.success === true) {
                    navigate('/main-store/user/purchase-return-management');
                }
            }).catch((error) => {
                toast.error(error.response?.data?.message);
            }).finally(() => setDisable(false));
        } else {
            const payload = {
                id: data?._id,
                tag_number: 12,
                trans_date: returnDate,
                master_id: purchaseReturn.receiver_name,
            }
            const myurl = `${V_URL}/user/update-ms-transaction`;
            axios({
                method: 'put',
                url: myurl,
                data: payload,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response?.data?.success === true) {
                    navigate('/main-store/user/purchase-return-management');
                    toast.success(response?.data?.message);
                }
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
            }).finally(() => setDisable(false));
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!data?._id) {
            if (!purchaseReturn.bill && !purchaseReturn.challan_no) {
                isValid = false;
                err["bill_err"] = "Please select either bill or challan number";
            } else {
                if (!purchaseReturn.bill) {
                    isValid = false;
                    err["bill_err"] = "Please select bill";
                }
            }
            if (finalTable.length === 0) {
                isValid = false;
                toast.error("Please enter return quantity for at least one item in the table.")
            }
        }
        if (!returnDate) {
            isValid = false;
            err["date_err"] = "Please select return date";
        } else {
            const today = new Date();
            const selectedDate = new Date(returnDate);
            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                isValid = false;
                err["date_err"] = "Return date cannot be a future date";
            }
        }
        if (!purchaseReturn.receiver_name) {
            isValid = false;
            err["receiver_err"] = "Please enter receiver name";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const receiverOptions = reciever?.map(elem => ({
        label: elem?.name,
        value: elem?._id
    }));

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/main-store/user/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/main-store/user/purchase-return-management">
                                            Purchase Return
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? 'Edit' : 'Add'} Purchase Return
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Purchase Return List</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="staff-search-table">
                                        <form>
                                            <div className='row'>
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="custom-select-wpr input-block local-forms">
                                                        <label>Bill No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            value={purchaseReturn.bill}
                                                            options={uniqueBillOptions}
                                                            onChange={(e) => handleChange(e, 'bill')}
                                                            placeholder="Select Bill No."
                                                            filter
                                                            filterBy="label"
                                                            className="w-100 multi-prime-react model-prime-multi"
                                                            disabled={data?._id}
                                                        />
                                                        <div className='error'>{error.bill_err}</div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="custom-select-wpr input-block local-forms">
                                                        <label>Challan No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            value={purchaseReturn.challan_no}
                                                            options={filteredChallanOptions}
                                                            onChange={(e) => handleChange(e, 'challan_no')}
                                                            placeholder="Select Challan No."
                                                            filter
                                                            filterBy="label"
                                                            className="w-100 multi-prime-react model-prime-multi"
                                                            disabled={data?._id}
                                                        />
                                                        <div className='error'>{error.challan_no_err}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="custom-select-wpr input-block local-forms">
                                                        <label>Purchase Return Name <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            value={purchaseReturn.receiver_name}
                                                            options={receiverOptions}
                                                            onChange={(e) => handleChange(e, 'receiver_name')}
                                                            placeholder="Select Purchase Return No."
                                                            filter
                                                            filterBy="label"
                                                            className="w-100 multi-prime-react model-prime-multi"
                                                        />
                                                        <div className='error'>{error.receiver_err}</div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="custom-select-wpr input-block local-forms">
                                                        <label>Purchase Return Date <span className="login-danger">*</span></label>
                                                        <input type='date' className='form-control' value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                                                        <div className='error'>{error.date_err}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {returnObj?.voucher_no && (
                                                <>
                                                    {!data?._id ? (
                                                        <div className="row">
                                                            {[
                                                                { label: 'Purchase Date', value: returnObj?.trans_date ? moment(returnObj?.trans_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Voucher No.', value: returnObj?.voucher_no },
                                                                { label: 'Party', value: returnObj?.party?.name },
                                                                { label: 'Receiver Name', value: returnObj?.master?.name },
                                                                { label: 'Receiver Date', value: returnObj?.receive_date ? moment(returnObj?.receive_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Project', value: returnObj?.project?.name },
                                                                { label: 'Transport', value: returnObj?.transport_details?.name || '-' },
                                                                { label: 'Transport Date', value: returnObj?.transport_date ? moment(returnObj?.transport_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Vehicle', value: returnObj?.vehical_no },
                                                                { label: 'PO No.', value: returnObj?.po_no },
                                                                { label: 'Payment Date', value: returnObj?.payment_date ? moment(returnObj?.payment_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Payment Days', value: returnObj?.payment_days },
                                                                { label: 'LR No.', value: returnObj?.lr_no },
                                                                { label: 'LR Date', value: returnObj?.lr_date ? moment(returnObj?.lr_date).format('DD-MM-YYYY') : '-' },
                                                            ].map(({ label, value }, index) => (
                                                                <div key={index} className="col-12 col-md-4 col-xl-4">
                                                                    <div className="input-block local-forms">
                                                                        <label>{label}</label>
                                                                        <input className="form-control" value={value} readOnly />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {returnObj?.pdf && (
                                                                <div className="col-12 col-md-4 col-xl-4">
                                                                    <div className="input-block local-forms">
                                                                        <label>PDF</label>
                                                                        <a href={returnObj.pdf} target="_blank" rel="noopener noreferrer">
                                                                            <img src="/assets/img/pdflogo.png" alt="PDF" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className='row'>
                                                            {[
                                                                { label: 'Purchase Date', value: returnObj?.return_details?.trans_date ? moment(returnObj?.return_details?.trans_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Voucher No.', value: returnObj?.return_details?.voucher_no },
                                                                { label: 'Party', value: returnObj?.return_details?.party?.name },
                                                                { label: 'Receiver Name', value: returnObj?.return_details?.master?.name },
                                                                { label: 'Receiver Date', value: returnObj?.return_details?.receive_date ? moment(returnObj?.return_details?.receive_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Project', value: returnObj?.return_details?.project?.name },
                                                                { label: 'Transport', value: returnObj?.return_details?.transport?.name || '-' },
                                                                { label: 'Transport Date', value: returnObj?.return_details?.transport_date ? moment(returnObj?.return_details?.transport_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Vehicle', value: returnObj?.return_details?.vehical_no || '-' },
                                                                { label: 'PO No.', value: returnObj?.return_details?.po_no || '-' },
                                                                { label: 'Payment Date', value: returnObj?.return_details?.payment_date ? moment(returnObj?.return_details?.payment_date).format('DD-MM-YYYY') : '-' },
                                                                { label: 'Payment Days', value: returnObj?.return_details?.payment_days },
                                                                { label: 'LR No.', value: returnObj?.return_details?.lr_no },
                                                                { label: 'LR Date', value: returnObj?.return_details?.lr_date ? moment(returnObj?.return_details?.lr_date).format('DD-MM-YYYY') : '-' },
                                                            ].map(({ label, value }, index) => (
                                                                <div key={index} className="col-12 col-md-4 col-xl-4">
                                                                    <div className="input-block local-forms">
                                                                        <label>{label}</label>
                                                                        <input className="form-control" value={value} readOnly />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {returnObj?.pdf && (
                                                                <div className="col-12 col-md-4 col-xl-4">
                                                                    <div className="input-block local-forms">
                                                                        <label>PDF</label>
                                                                        <a href={returnObj.pdf} target="_blank" rel="noopener noreferrer">
                                                                            <img src="/assets/img/pdflogo.png" alt="PDF" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <PurchasePRTable commentsData={commentsData} setSearch={setSearch} setCurrentPage={setCurrentPage}
                        limit={limit} setlimit={setlimit} totalItems={totalItems} currentPage={currentPage} handleReturnQtyChange={handleReturnQtyChange} data={data} />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit}>{disable ? "Processing..." : data?._id ? "Update" : "Submit"}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ManagePReturn