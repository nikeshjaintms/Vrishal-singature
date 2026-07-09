import React, { useEffect, useState } from 'react'
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getParty } from '../../../../Store/Store/Party/Party';
// import { getProject } from '../../../../Store/Store/Project/Project';
import { getStoreEmployee } from '../../../../Store/Store/Employee/Employee';
import { getLocation } from '../../../../Store/Store/StoreMaster/InventoryLocation/Location';
import { Modal } from 'react-bootstrap';
import { getItem } from '../../../../Store/Store/Item/Item';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { P_STORE, V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';
import { getItemStock } from '../../../../Store/Store/Stock/getStock';
import { getUserProfile } from '../../../../Store/Store/Profile/Profile';
import { getStoreAuthPerson } from '../../../../Store/Store/StoreMaster/AuthPerson/AuthPerson';
import { getOrder } from '../../../../Store/Store/Order/Order';

const ManageSaleOrder = () => {

    const [sales, setSales] = useState({
        party: "",
        orderNo: "",
        orderDate: "",
        lrNo: "",
        lrDate: "",
        storeLocation: "",
        approvedBy: "",
        preparedBy: "",
        paymentMode: "",
        remarks: "",
        storeType: "",
    });
    const [mcode, setMcode] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const data = location.state;

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate]);

    const [disable, setDisable] = useState(false);
    const [disable2, setDisable2] = useState(false);
    const [disable3, setDisable3] = useState(false);
    const [editTrigger, setEditTrigger] = useState(false);
    const [withPo, setWithPo] = useState(true);
    const [error, setError] = useState({});
    const [show, setShow] = useState(false);
    const [unit, setUnit] = useState('')
    const [error2, setError2] = useState({});
    const [finalId, setFinalId] = useState('');
    const [items, setItems] = useState([]);
    const [editModalId, setEditModalId] = useState('');
    const [disableTra, setDisableTra] = useState(true);
    const [itemVal, setItemVal] = useState({
        itemName: "",
        quantity: "",
        remarks: "",
        rate: "",
        amount: "",
        balance_qty: "",
        gst_percentage: "",
        net_amount: "",
        store_type: ""
    });
    const [project, setProject] = useState(null)

    useEffect(() => {
        if (location.state) {
            setSales({
                party: location.state.party?._id,
                orderNo: location.state?.orderNo,
                orderDate: moment(location.state?.orderDate).format('YYYY-MM-DD'),
                lrNo: location.state?.lrNo,
                lrDate: moment(location.state?.lrDate).format('YYYY-MM-DD'),
                storeLocation: location.state?.storeLocation?._id,
                approvedBy: location.state.approvedBy?._id,
                preparedBy: location.state?.preparedBy?._id,
                paymentMode: location.state?.paymentMode,
                remarks: location.state?.remarks,
                storeType: location.state?.store_type
            });
            // setItems(location.state?.items?.items || []);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await Promise?.all([
                    dispatch(getParty({ storeType: '' })),
                    // dispatch(getProject()),
                    // dispatch(getStoreEmployee()),
                    dispatch(getLocation()),
                    dispatch(getItem()),
                    dispatch(getItemStock({ storeType: '' })),
                    dispatch(getUserProfile()),
                    dispatch(getStoreAuthPerson()),
                    dispatch(getOrder({ tag: 2 }))
                ]);
            } catch (error) {
                console.log(error, '!!');
            }
        };
        fetchInitialData()
    }, [dispatch]);

    const partyData = useSelector((state) => state?.getParty?.user?.data);
    const projectData = useSelector((state) => state?.getUserProfile?.user?.data); // for the assigned project
    // const employeeData = useSelector((state) => state?.getStoreEmployee?.user?.data);
    const locationData = useSelector((state) => state?.getLocation?.user?.data);
    const itemApiData = useSelector((state) => state?.getItem?.user?.data);
    const stockData = useSelector((state) => state?.getItemStock?.user?.data);
    const authPerson = useSelector((state) => state?.getStoreAuthPerson?.user?.data);
    const orderData = useSelector((state) => state?.getOrder?.user?.data);

    useEffect(() => {
        if (projectData) {
            const finalData = projectData?.project?.find((us) => us?._id === localStorage.getItem('U_PROJECT_ID'));
            setProject(finalData?.name)
        }
    }, [projectData]);


    useEffect(() => {
        if (disableTra === true) {
            getTrasactionItem();
            setItems([]);
        }
        // eslint-disable-next-line
    }, [disableTra]);

    const getTrasactionItem = () => {
        const url = `${V_URL}/user/get-transaction-item`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('tag', '2');
        bodyFormData.append('store_type', '2');

        axios({
            method: "post",
            url: url,
            data: bodyFormData,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
        }).then((response) => {
            if (response?.data.success === true) {
                const dataItem = response?.data?.data;
                const finalData = dataItem?.filter((da) => da?.orderId?._id === (data?._id || finalId));
                setItems(finalData);
            }
            setDisableTra(false);
        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        const finalName = itemApiData?.find(it => it._id === itemVal?.itemName);
        setMcode(finalName?.mcode);
        if (itemVal?.itemName) {
            const filterQty = stockData?.find(st => st?.item?._id === itemVal?.itemName);

            if (filterQty) {
                setItemVal({ ...itemVal, quantity: filterQty?.quantity, balance_qty: filterQty?.quantity, gst_percentage: finalName?.gst_percentage });
                const newAmount = filterQty.quantity * itemVal.rate;
                setItemVal(prevState => ({ ...prevState, amount: newAmount }));
            } else {
                setItemVal({ ...itemVal, quantity: '', amount: '', balance_qty: '' });
                toast.error('Item stock not found')
            }
        }
        setUnit(finalName?.unit?.name);
        // eslint-disable-next-line
    }, [itemVal?.itemName, editTrigger]);

    const handleChange = (e) => {
        setSales({ ...sales, [e.target.name]: e.target.value })
    }

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        let newBalanceQty = itemVal?.balance_qty;
        let gstPercentage = itemVal?.gst_percentage
        let newAmount = itemVal?.amount;
        if (name === 'quantity' || name === 'rate') {
            newValue = parseFloat(value);
        }
        if (name === 'quantity' || name === 'rate') {
            const quantity = name === 'quantity' ? newValue : itemVal?.quantity;
            const rate = name === 'rate' ? newValue : itemVal.rate;
            newAmount = quantity * rate;
        }
        if (name === 'itemName') {
            const finalName = itemApiData?.find(it => it._id === value);
            gstPercentage = finalName?.gst_percentage
        }
        if (name === 'quantity') {
            newBalanceQty = newValue;
        }

        let netAmount = newAmount + ((newAmount * gstPercentage) / 100);
        setItemVal({
            ...itemVal, [name]: newValue,
            amount: parseFloat(newAmount),
            balance_qty: parseFloat(newBalanceQty),
            net_amount: parseFloat(netAmount)
        });
    }

    useEffect(() => {
        if (show) {
            const idToCheck = finalId || location.state?._id;
            const getOrderData = orderData?.find((order) => order?._id === idToCheck);
            if (getOrderData) {
                setItemVal((prevMaterial) => ({ ...prevMaterial, store_type: getOrderData?.store_type }));
            }
        }
    }, [show, finalId, location.state?._id, orderData]);


    const handleClose = () => {
        setShow(false)
        setError2({});
        setEditModalId('')
    }

    const handleShow = () => setShow(true);

    const handleAdd = () => {
        handleShow();
        clearItemVal();
    };

    const handleEdit = (e) => {
        setItemVal(e);
        setWithPo(e.with_po);
        setEditModalId(e?._id)
        setShow(true);
        setEditTrigger((prev) => !prev);
    }

    const handleChangePo = (event) => {
        setWithPo(event.target.checked);
    };

    const clearItemVal = () => {
        setItemVal({
            itemName: "",
            quantity: "",
            remarks: "",
            rate: "",
            amount: "",
            balance_qty: "",
            net_amount: ""
        });
        setMcode('');
    }

    const handleDelete = (id, title) => {
        Swal.fire({
            title: `Are you sure want to delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const myurl = `${V_URL}/user/delete-transaction-item`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);
                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message)
                    }
                    setDisableTra(true);
                }).catch((error) => {
                    toast.error(error?.response?.data?.message || "Something went wrong");
                })
            }
        })
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
            bodyFormData.append('party', sales.party);
            bodyFormData.append('orderDate', sales.orderDate);
            bodyFormData.append('lrNo', sales.lrNo);
            bodyFormData.append('lrDate', sales.lrDate);
            bodyFormData.append('storeLocation', sales.storeLocation);
            bodyFormData.append('approvedBy', sales.approvedBy);
            bodyFormData.append('preparedBy', sales.preparedBy);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('tag', '2');
            bodyFormData.append('store_type', '2');
            bodyFormData.append('paymentMode', sales.paymentMode);
            bodyFormData.append('remarks', sales.remarks);

            // bodyFormData.append('items', JSON.stringify(items));
            if (data?._id) {
                bodyFormData.append('id', data?._id)
            }

            axios({
                method: 'post',
                url: `${V_URL}/user/manage-order`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                // console.log(response.data, '@@')
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    setFinalId(response.data.data._id);
                    // navigate('/product-store/user/sales-order-management');
                    setDisable(false);
                    setDisable3(true);
                    dispatch(getOrder({ tag: 2 }))
                }
            }).catch((error) => {
                console.log(error);
                toast.error(error.response.data?.message);
                setDisable(false);
            });
        }
    }


    const handleSubmit2 = async (more) => {
        if (finalId || data?._id) {
            if (validation2()) {
                setDisable2(true)
                const myurl = `${V_URL}/user/manage-transaction-item`;
                const bodyFormData = new URLSearchParams();
                if (!data?._id) {
                    bodyFormData.append('orderId', finalId);
                } else {
                    bodyFormData.append('orderId', data?._id);
                }
                bodyFormData.append('tag', '2');
                bodyFormData.append('store_type', itemVal?.store_type);
                bodyFormData.append('itemName', itemVal?.itemName);
                bodyFormData.append('rate', itemVal?.rate)
                bodyFormData.append('amount', itemVal?.amount)
                bodyFormData.append('quantity', itemVal.quantity)
                bodyFormData.append('balance_qty', itemVal.balance_qty)
                bodyFormData.append('mcode', mcode)
                bodyFormData.append('net_amount', itemVal.net_amount);
                bodyFormData.append('with_po', withPo)
                bodyFormData.append('remarks', itemVal.remarks)

                if (editModalId) {
                    bodyFormData.append('id', editModalId)
                }
                await axios({
                    method: 'post',
                    url: myurl,
                    data: bodyFormData,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
                }).then((response) => {
                    // console.log(response.data);
                    if (response.data?.success === true) {
                        toast.success(response.data.message);
                        if (more !== 'more') {
                            setShow(false);
                            clearItemVal();
                        } else {
                            clearItemVal();
                        }
                        setEditModalId('')
                        setDisableTra(true);
                    } else {
                        toast.error(response.data.message);
                    }
                    setEditModalId('')
                    setDisable2(false);
                }).catch((error) => {
                    console.log(error, '!!');
                    toast.error(error?.response?.data?.message);
                    setDisable2(false);
                })
            }
        } else {
            toast.error('Please fill the order form and choose the save and continue');
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!sales?.orderDate) {
            isValid = false;
            err['orderDate_err'] = "Please select order date"
        }
        if (!sales?.party) {
            isValid = false;
            err['party_err'] = "Please select party"
        }
        if (!sales?.paymentMode) {
            isValid = false;
            err['paymentMode_err'] = "Please select payment mode"
        }
        if (!sales?.lrNo) {
            isValid = false;
            err['lrNo_err'] = "Please enter lr no"
        }
        if (!sales?.lrDate) {
            isValid = false;
            err['lrDate_err'] = "Please enter lr date"
        }
        if (!sales.approvedBy) {
            isValid = false;
            err['approvedBy_err'] = "Please select person"
        }
        if (!sales.preparedBy) {
            isValid = false;
            err['preparedBy_err'] = "Please select person"
        }
        if (!sales?.storeLocation) {
            isValid = false;
            err['location_err'] = "Please select location"
        }
        if (!sales.storeType) {
            isValid = false;
            err["storeType_err"] = "Please select store type";
        }
        setError(err);
        return isValid
    }

    const validation2 = () => {
        let isValid = true;
        let err = {};
        if (!itemVal?.itemName) {
            isValid = false;
            err['itemName_err'] = "Please select item"
        }
        if (!mcode) {
            isValid = false;
            err['mcode_err'] = "Please enter mcode"
        }
        if (!itemVal?.rate) {
            isValid = false;
            err['rate_err'] = "Please enter rate"
        }
        if (!itemVal.store_type) {
            isValid = false;
            err["store_type_err"] = "Please select store type";
        }
        setError2(err);
        return isValid
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const handleClearForm = () => {
        setSales({
            party: "",
            orderNo: "",
            orderDate: "",
            lrNo: "",
            lrDate: "",
            storeLocation: "",
            approvedBy: "",
            preparedBy: "",
            paymentMode: "",
            remarks: "",
        });
        setItems([]);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/user/project-store/sales-order-management">Sales Order List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Sales Order</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Sales Order Details</h4>
                                            </div>
                                        </div>


                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Order Date <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="date"
                                                        onChange={handleChange} name='orderDate' value={sales.orderDate}
                                                    />
                                                    <div className='error'>{error.orderDate_err}</div>
                                                </div>
                                            </div>

                                            {data?._id ? (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms">
                                                        <label> Order No. <span className="login-danger">*</span></label>
                                                        <input className="form-control" value={sales.orderNo} disabled
                                                        />
                                                        <div className='error'>{error.orderDate_err}</div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Party <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={sales.party}
                                                        onChange={handleChange} name='party'>
                                                        <option value="">Select Party</option>
                                                        {partyData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.party_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Payment Mode <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={sales.paymentMode}
                                                        onChange={handleChange} name='paymentMode'>
                                                        <option value="">Select Payment Mode</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Online">Online</option>
                                                        <option value="Cheque">Cheque</option>
                                                    </select>
                                                    <div className='error'>{error.paymentMode_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> LR No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name='lrNo' value={sales.lrNo}
                                                    />
                                                    <div className='error'>{error.lrNo_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> LR Date <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="date"
                                                        onChange={handleChange} name='lrDate' value={sales.lrDate}
                                                    />
                                                    <div className='error'>{error.lrDate_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Project</label>
                                                    {/* <select className="form-control select"
                                                        value={sales.project}
                                                        onChange={handleChange} name='project'>
                                                        <option value="">Select Project</option>
                                                        {projectData?.project?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select> */}
                                                    <input className="form-control" value={project} readOnly />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Approved By <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={sales.approvedBy}
                                                        onChange={handleChange} name='approvedBy'>
                                                        <option value="">Select Person</option>
                                                        {authPerson?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.approvedBy_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Prepared By <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={sales.preparedBy}
                                                        onChange={handleChange} name='preparedBy'>
                                                        <option value="">Select Person</option>
                                                        {authPerson?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.preparedBy_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Location <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={sales.storeLocation}
                                                        onChange={handleChange} name='storeLocation'>
                                                        <option value="">Select Location</option>
                                                        {locationData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.location_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Store Type <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={sales.storeType}
                                                        onChange={handleChange} name='storeType'>
                                                        <option value="">Select Store Type</option>
                                                        <option value={1}>Main Store</option>
                                                        <option value={2}>Project Store</option>
                                                    </select>
                                                    <div className="error">{error.storeType_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-12 col-xl-12">
                                                <div className="input-block local-forms">
                                                    <label> Remarks </label>
                                                    <textarea className="form-control" onChange={handleChange} name="remarks" value={sales?.remarks} />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-sm-12">
                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable || disable3}> {disable ? 'Processing...' : (data?._id ? 'Update' : 'Next and Countinue')}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" onClick={handleClearForm}>Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {data?._id || finalId ? (
                        <>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <form>
                                                <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                                                    <div className="form-heading">
                                                        <h4 className="mb-0">Material List</h4>
                                                    </div>
                                                    <div className="add-group">
                                                        <button
                                                            type="button"
                                                            onClick={handleAdd}
                                                            className="btn btn-primary add-pluss ms-2"
                                                            data-toggle="tooltip"
                                                            data-placement="top"
                                                            title="Add Material"
                                                        >
                                                            <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {items?.length !== 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Sr.</th>
                                                                    <th>Item Name</th>
                                                                    <th>Unit</th>
                                                                    <th>M Code</th>
                                                                    <th>Available Qty.</th>
                                                                    <th>Rate</th>
                                                                    <th>Amount</th>
                                                                    <th>Remark</th>
                                                                    <th>With PO</th>
                                                                    <th className="text-end">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {items?.map((elem, i) =>
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>{itemApiData?.find(it => it?._id === elem?.itemName)?.name}</td>
                                                                        <td>{itemApiData?.find(it => it?._id === elem?.itemName)?.unit?.name}</td>
                                                                        <td>{elem?.mcode}</td>
                                                                        <td>{elem?.quantity?.toFixed(3)}</td>
                                                                        <td>{elem?.rate?.toFixed(3)}</td>
                                                                        <td>{elem?.amount?.toFixed(3)}</td>
                                                                        <td>{!elem?.remarks ? '-' : elem?.remarks}</td>
                                                                        <td className='status-badge'>
                                                                            {elem?.with_po === true ? (
                                                                                <span className="custom-badge status-green">True</span>
                                                                            ) : (
                                                                                <span className="custom-badge status-pink">False</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="text-end d-flex">
                                                                            {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                            <a style={{ cursor: "pointer", padding: "6px" }} className="action-icon" onClick={() => handleEdit(elem)}> <Pencil /></a>
                                                                            <a style={{ cursor: "pointer", padding: "6px" }} className='action-icon mx-2' onClick={() => handleDelete(elem?._id, itemApiData?.find(it => it?._id === elem?.itemName)?.name)}><Trash2 /></a>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : <h5>Looks like the material hasn't been added yet. Please make sure to include it. Thanks!</h5>}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="col-12">
                                                <div className="doctor-submit text-end">
                                                    <button type="button"
                                                        className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/sales-order-management')}>Back</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div >

            <Modal show={show} onHide={handleClose} backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Material</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='material-section'>
                        <div className=''>
                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label">Item Name <span className="login-danger">*</span> </label>
                                </div>
                                <div className="col-9">
                                    <select className="form-control select"
                                        value={itemVal?.itemName}
                                        onChange={handleChange2} name='itemName'
                                    >
                                        <option value="">Select Item Name</option>
                                        {itemApiData?.map((e) => (
                                            <option key={e._id} value={e._id}>
                                                {e?.name} ({e?.mcode})
                                            </option>
                                        ))}
                                    </select>
                                    <div className='error'>{error2.itemName_err}</div>
                                </div>
                            </div>

                            {itemVal?.itemName ? (
                                <div className="row align-items-center mt-2">
                                    <div className="col-3">
                                        <label className="col-form-label">Unit</label>
                                    </div>
                                    <div className="col-9">
                                        <input className="form-control" value={unit} disabled />
                                    </div>
                                </div>
                            ) : null}

                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label">MCode <span className="login-danger">*</span></label>
                                </div>
                                <div className="col-9">
                                    <input className="form-control" type="text" onChange={(e) => setMcode(e.target.value)} value={mcode} />
                                    <div className='error'>{error2.mcode_err}</div>
                                </div>
                            </div>

                            {itemVal?.itemName ? (
                                <div className="row align-items-center mt-2">
                                    <div className="col-3">
                                        <label className="col-form-label">Available Qty.</label>
                                    </div>
                                    <div className="col-9">
                                        <input className="form-control" type="number"
                                            onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                            onChange={handleChange2} value={itemVal?.quantity} name="quantity" disabled />
                                        <div className='error'>{error2.quantity_err}</div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label">Rate <span className="login-danger">*</span></label>
                                </div>
                                <div className="col-9">
                                    <input className="form-control" type="number"
                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                        onChange={handleChange2} value={itemVal?.rate} name="rate" />
                                    <div className='error'>{error2.rate_err}</div>
                                </div>
                            </div>

                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label">Amount <span className="login-danger">*</span></label>
                                </div>
                                <div className="col-9">
                                    <input className="form-control" type='number' value={itemVal?.amount} disabled />
                                </div>
                            </div>

                            {itemVal?.itemName ? (
                                <>
                                    <div className="row align-items-center mt-2">
                                        <div className="col-3">
                                            <label className="col-form-label">GST(%)</label>
                                        </div>
                                        <div className="col-9">
                                            <input type="number" name="gst_percentage" className="form-control"
                                                value={itemVal.gst_percentage} disabled />
                                        </div>
                                    </div>

                                    <div className="row align-items-center mt-2">
                                        <div className="col-3">
                                            <label className="col-form-label">Net Amount</label>
                                        </div>
                                        <div className="col-9">
                                            <input
                                                type="number" name="net_amount" className="form-control"
                                                value={itemVal.net_amount} onChange={handleChange2} disabled />
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label">With PO</label>
                                </div>
                                <div className="col-9">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" onChange={handleChangePo} checked={withPo} />
                                    </div>
                                </div>
                            </div>

                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label"> Store Type <span className="login-danger">*</span></label>
                                </div>
                                <div className="col-9">
                                    <select className="form-control select"
                                        value={itemVal.store_type}
                                        disabled
                                        onChange={handleChange2} name='store_type'>
                                        <option value="">Select Store Type</option>
                                        <option value={1}>Main Store</option>
                                        <option value={2}>Project Store</option>
                                    </select>
                                    <div className="error">{error.store_type_err}</div>
                                </div>
                            </div>

                            <div className="row align-items-center mt-2">
                                <div className="col-3">
                                    <label className="col-form-label">Remarks</label>
                                </div>
                                <div className="col-9">
                                    <textarea className="form-control" type="number" onChange={handleChange2} value={itemVal?.remarks} name="remarks" />
                                </div>
                            </div>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary m-2" type="button" onClick={handleSubmit2}
                        disabled={disable2}>{disable2 ? 'Processing...' : (editModalId ? 'Update' : 'Save')}</button>
                    {!editModalId ? (
                        <button className='btn btn-outline-primary m-2' type="button"
                            onClick={() => handleSubmit2('more')} disabled={disable2}>{disable2 ? 'Processing...' : 'Add More'}</button>
                    ) : null}
                    <button type="button"
                        className="btn btn-secondary" onClick={clearItemVal}>Reset</button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default ManageSaleOrder