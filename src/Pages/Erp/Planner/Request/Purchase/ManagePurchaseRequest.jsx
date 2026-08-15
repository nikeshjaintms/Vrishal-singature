import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ERP, PLAN, V_URL } from '../../../../../BaseUrl';
import { getStoreEmployee } from '../../../../../Store/Store/Employee/Employee';
import { getProject } from '../../../../../Store/Store/Project/Project';
import { getLocation } from '../../../../../Store/Store/StoreMaster/InventoryLocation/Location';
import { getUserDepartment } from '../../../../../Store/Store/StoreMaster/Department/Department';
import PurchaseForm from '../../../../../Components/Validation/Request/PurchaseForm';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import moment from 'moment';
import axios from 'axios';
import Footer from '../../Include/Footer';
import { getItem } from '../../../../../Store/Store/Item/Item';
import { Modal } from 'react-bootstrap';
import PurchaseModal from '../../../../../Components/Validation/Request/PurchaseModal';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUserProfile } from '../../../../../Store/Store/Profile/Profile';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';

const ManagePurchaseRequest = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const [disable2, setDisable2] = useState(false);
    const [disable3, setDisable3] = useState(false);
    const [error, setError] = useState({});
    const [error2, setError2] = useState({});
    const [request, setRequest] = useState({
        requestDate: "",
        storeLocation: "",
        project: "",
        approvedBy: "",
        department: "",
        preparedBy: "",
        prNo: "",
        drawing_id: "",
        pdf_id: "",
    });
    const [finalId, setFinalId] = useState('');
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editModalId, setEditModalId] = useState('');
    const [disableTra, setDisableTra] = useState(true);
    const [selectedDrawing, setSelectedDrawing] = useState([]);
    const [approvedPdf, setApprovedPdf] = useState([]);
    const [itemVal, setItemVal] = useState({
        itemName: "",
        mcode: "",
        quantity: "",
        remarks: "",
    });
    const [unit, setUnit] = useState('');

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${ERP}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (localStorage.getItem('ERP_ROLE') !== `${PLAN}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate, disable]);

    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setRequest({
                requestDate: moment(location.state?.requestDate).format('YYYY-MM-DD'),
                storeLocation: location.state.storeLocation?._id,
                project: location.state?.project?._id,
                approvedBy: location.state?.approvedBy?._id,
                department: location.state?.department?._id,
                preparedBy: location.state?.preparedBy?._id,
                prNo: location.state?.prNo,
                drawing_id: location.state.drawing_id?._id,
                pdf_id: location.state.pdf_id,
            });
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getStoreEmployee()),
                    dispatch(getProject()),
                    dispatch(getLocation()),
                    dispatch(getUserDepartment()),
                    dispatch(getItem()),
                    dispatch(getUserProfile()),
                    dispatch(getDrawing()),
                ])
            } catch (error) {
                console.log(error, '!!');
            }
        }
        fetchData();
    }, [dispatch]);

    const employeeData = useSelector((state) => state.getStoreEmployee?.user?.data);
    const projectData = useSelector((state) => state.getUserProfile?.user?.data);
    const locationData = useSelector((state) => state.getLocation?.user?.data);
    const departmentData = useSelector((state) => state.getUserDepartment?.user?.data);
    const itemApiData = useSelector((state) => state.getItem?.user?.data);
    const drawingData = useSelector((state) => state.getDrawing?.user?.data);

    useEffect(() => {
        if (disableTra === true) {
            getTrasactionItem();
            setItems([]);
        }
        // eslint-disable-next-line
    }, [disableTra])

    const getTrasactionItem = () => {
        const url = `${V_URL}/user/get-transaction-item`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('tag', '3');
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
                const finalData = dataItem?.filter((da) => da?.requestId?._id === (data?._id || finalId));
                setItems(finalData);
            }
            setDisableTra(false);
        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        const finalName = itemApiData?.find(it => it._id === itemVal?.itemName);
        setUnit(finalName?.unit?.name);
        setItemVal({ ...itemVal, mcode: finalName?.mcode })
        // eslint-disable-next-line
    }, [itemVal.itemName]);

    useEffect(() => {
        const selectedProject = drawingData?.filter((dr) => dr.project?._id === request?.project);
        setSelectedDrawing(selectedProject);

        const checkData = selectedProject?.find((pr) => pr?._id === request?.drawing_id);
        if (checkData) {
            const finalData = checkData?.drawing_images?.filter((img) => img?.status === 1);
            setApprovedPdf(finalData);
        }
        // eslint-disable-next-line
    }, [request.project, request.drawing_id])

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    }

    const handleChange2 = (e) => {
        setItemVal({ ...itemVal, [e?.target.name]: e?.target?.value })
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
            bodyFormData.append('requestDate', request.requestDate);
            bodyFormData.append('storeLocation', request.storeLocation);
            bodyFormData.append('project', request.project);
            bodyFormData.append('approvedBy', request.approvedBy);
            bodyFormData.append('department', request.department);
            bodyFormData.append('preparedBy', request.preparedBy);
            bodyFormData.append('drawing_id', request.drawing_id);
            bodyFormData.append('pdf_id', request.pdf_id);
            bodyFormData.append('prNo', request.prNo);
            bodyFormData.append('tag', '1');
            if (data?._id) {
                bodyFormData.append('id', data?._id);
            }
            axios({
                method: 'post',
                url: `${V_URL}/user/manage-request`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    setFinalId(response.data.data._id)
                }
                setDisable(false);
                setDisable3(true);
            }).catch((error) => {
                toast.error(error.response.data?.message || 'Something went wrong');
                setDisable(false);
            });
        }
    }

    const handleClose = () => {
        setShow(false);
        setEditModalId('');
        handleClearModal();
    }
    const handleShow = () => {
        setShow(true);
    }
    const handleEdit = (mData) => {
        setItemVal(mData);
        setEditModalId(mData?._id)
        setShow(true);
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
    }

    const handleSubmit2 = (more) => {
        if (validation2()) {
            if (data?._id || finalId) {
                setDisable2(true)
                const myurl = `${V_URL}/user/manage-transaction-item`;
                const bodyFormData = new URLSearchParams();
                bodyFormData.append('tag', '3');
                bodyFormData.append('store_type', '2');
                bodyFormData.append('itemName', itemVal.itemName);
                bodyFormData.append('quantity', itemVal.quantity);
                bodyFormData.append('mcode', itemVal.mcode);
                bodyFormData.append('remarks', itemVal.remarks);
                if (data?._id) {
                    bodyFormData.append('requestId', data?._id);
                } else {
                    bodyFormData.append('requestId', finalId);
                }
                if (editModalId) {
                    bodyFormData.append('id', editModalId);
                }
                axios({
                    method: 'post',
                    url: myurl,
                    data: bodyFormData,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        if (more === 'more') {
                            handleClearModal();
                        } else {
                            handleClearModal();
                            setShow(false)
                        }
                    } else {
                        toast.error(response?.data?.message)
                    }
                    setDisable2(false);
                    setDisableTra(true);
                }).catch((error) => {
                    setDisable2(false);
                    toast.error(error?.response?.data?.message || 'Something went wrong');
                })
            }
        }
    }

    const handleClearModal = () => {
        setItemVal({
            itemName: "",
            mcode: "",
            quantity: "",
            remarks: "",
        })
    }
    const validation2 = () => {
        const { isValid, err } = PurchaseModal({ itemVal });
        setError2(err);
        return isValid;
    }

    const validation = () => {
        const { isValid, err } = PurchaseForm({ request })
        setError(err);
        return isValid;
    }

    const handleReset = () => {
        setRequest({
            requestDate: "",
            storeLocation: "",
            project: "",
            approvedBy: "",
            department: "",
            preparedBy: "",
            prNo: "",
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                                    <li className="breadcrumb-item">
                                        <Link to="/erp/user/planner/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/erp/user/planner/purchase-request-management">Purchase Request List</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Purchase Request
                                    </li>
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
                                                <h4>{data?._id ? "Edit" : "Add"} Purchase Request Details</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Location <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.storeLocation}
                                                        onChange={handleChange} name='storeLocation'>
                                                        <option value="">Select Location</option>
                                                        {locationData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.storeLocation_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Request Date <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="date"
                                                        onChange={handleChange} name="requestDate" value={request.requestDate} />
                                                    <div className="error">{error.requestDate_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> PR No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="prNo" value={request.prNo} />
                                                    <div className="error">{error.prNo_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Department <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.department}
                                                        onChange={handleChange} name='department'>
                                                        <option value="">Select Department</option>
                                                        {departmentData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error?.department}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Approved By <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.approvedBy}
                                                        onChange={handleChange} name='approvedBy'>
                                                        <option value="">Select Person</option>
                                                        {employeeData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.full_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error?.approvedBy_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Prepared By <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.preparedBy}
                                                        onChange={handleChange} name='preparedBy'>
                                                        <option value="">Select Person</option>
                                                        {employeeData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.full_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error?.approvedBy_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Project <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.project}
                                                        onChange={handleChange} name='project'>
                                                        <option value="">Select Project</option>
                                                        {projectData?.project?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.project_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Drawing No <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.drawing_id}
                                                        onChange={handleChange} name='drawing_id'>
                                                        <option value="">Select Drawing No</option>
                                                        {selectedDrawing?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.drawing_no}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.project_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Approved PDF & IMG Name <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={request.pdf_id}
                                                        onChange={handleChange} name='pdf_id'>
                                                        <option value="">Select PDF & IMG Name</option>
                                                        {approvedPdf?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.project_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable || disable3}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Save and Continue')}</button>
                                            <button type="button"
                                                className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {data?._id || finalId ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form>
                                            <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                                                <div className="form-heading">
                                                    <h4>Item List</h4>
                                                </div>
                                                <div className="add-group">
                                                    <button
                                                        type="button"
                                                        onClick={handleShow}
                                                        className="btn btn-primary add-pluss ms-2"
                                                        data-toggle="tooltip"
                                                        data-placement="top"
                                                        title="Add Material"
                                                    >
                                                        <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                                    </button>
                                                </div>
                                            </div>

                                            {items?.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Sr.</th>
                                                                <th>Item Name</th>
                                                                <th>Unit</th>
                                                                <th>M Code</th>
                                                                <th>Quantity</th>
                                                                <th>Remark</th>
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
                                                                    <td>{elem?.quantity}</td>
                                                                    <td>{!elem?.remarks ? '-' : elem?.remarks}</td>
                                                                    <td className="d-flex justify-content-end">
                                                                        {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                        <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                                            onClick={() => handleEdit(elem)}
                                                                            data-toggle="tooltip" data-placement="top" title="Edit">
                                                                            <Pencil />
                                                                        </a>

                                                                        <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                                            onClick={() => handleDelete(elem?._id, itemApiData?.find(it => it?._id === elem?.itemName)?.name)}
                                                                            data-toggle="tooltip" data-placement="top" title="Delete">
                                                                            <Trash2 />
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : <h5>Looks like the item hasn't been added yet. Please make sure to include it. Thanks!</h5>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={() => navigate('/erp/user/planner/purchase-request-management')}>Back</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                <Footer />
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='material-section'>
                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Item Name <span className="login-danger">*</span> </label>
                            </div>
                            <div className="col-9">
                                <select className="form-control select"
                                    value={itemVal?.itemName}
                                    onChange={handleChange2} name='itemName'>
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
                                    <input type="text" className="form-control" value={unit} disabled />
                                </div>
                            </div>
                        ) : null}

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">MCode</label>
                            </div>
                            <div className="col-9">
                                <input type="text" className="form-control" value={itemVal.mcode} onChange={handleChange2} name="mcode" />
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Quantity <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-9">
                                <input type="number" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                    className="form-control" value={itemVal.quantity} onChange={handleChange2} name="quantity" />
                                <div className='error'>{error2?.quantity_err}</div>
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Remark</label>
                            </div>
                            <div className="col-9">
                                <textarea className="form-control" value={itemVal.remarks} onChange={handleChange2} name="remarks" />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary mr-2' type='button' onClick={handleSubmit2} disabled={disable2}>
                        {disable2 ? 'Processing...' : (!editModalId ? 'Save' : 'Update')}
                    </button>
                    {!editModalId ? (
                        <button className='btn btn-outline-primary' type='button' onClick={() => handleSubmit2('more')}>Add More</button>
                    ) : null}
                    <button className='btn btn-secondary' type='button' onClick={handleClearModal}>Reset</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ManagePurchaseRequest