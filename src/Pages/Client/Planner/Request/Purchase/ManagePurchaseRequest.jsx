import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PLAN, V_URL } from '../../../../../BaseUrl';
import { getUserDepartment } from '../../../../../Store/Store/StoreMaster/Department/Department';
import PurchaseForm from '../../../../../Components/Validation/Request/PurchaseForm';
import moment from 'moment';
import axios from 'axios';
import { getItem } from '../../../../../Store/Store/Item/Item';
import { Modal } from 'react-bootstrap';
import PurchaseModal from '../../../../../Components/Validation/Request/PurchaseModal';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getUserProfile } from '../../../../../Store/Store/Profile/Profile';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { getParty } from '../../../../../Store/Store/Party/Party';
import { getUserProjectLocation } from '../../../../../Store/Erp/ProjectLocation/ProjectLocation';
import { MultiSelect } from 'primereact/multiselect';
import DownloadFormat from '../../../../../Components/DownloadFormat/DownloadFormat';
import UploadFile from '../../../../../Components/DownloadFormat/UploadFile';
import { getProject } from '../../../../../Store/Store/Project/Project';

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
        department: "",
        material_po: "",
        // drawing_id: "",
    });
    const [finalId, setFinalId] = useState('');
    const [items, setItems] = useState([]);
    const [show, setShow] = useState(false);
    const [editModalId, setEditModalId] = useState('');
    const [disableTra, setDisableTra] = useState(true);
    const [selectedDrawing, setSelectedDrawing] = useState([]);
    const [drIds, setDrIds] = useState([]);
    const [selectedSup, setSelectedSup] = useState([]);
    const [itemVal, setItemVal] = useState({
        itemName: "",
        mcode: "",
        quantity: "",
        remarks: "",
        store_type: "",
        unit_rate: "",
        total_rate: "",
        main_supplier: "",
    });
    const [unit, setUnit] = useState('');
    const [mGrade, setMGrade] = useState('');
    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setRequest({
                requestDate: moment(location.state?.requestDate).format('YYYY-MM-DD'),
                storeLocation: location.state.storeLocation?._id,
                department: location.state?.department?._id,
                material_po: location.state?.material_po_no,
                // drawing_id: location.state.drawing_id?._id,
            });
            setDrIds(location.state.drawingIds);
        }
    }, [location.state]);

    const departmentData = useSelector((state) => state.getUserDepartment?.user?.data);
    const itemApiData = useSelector((state) => state.getItem?.user?.data);
    const drawingData = useSelector((state) => state.getDrawing?.user?.data?.data);
    const partyData = useSelector((state) => state.getParty?.user?.data);
    const projectLocationData = useSelector((state) => state.getUserProjectLocation?.user?.data);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getUserDepartment()),
                    dispatch(getItem({ is_main: false })),
                    dispatch(getUserProfile()),
                    dispatch(getDrawing()),
                    dispatch(getParty({ storeType: '', is_main: false })),
                    dispatch(getUserProjectLocation({ status: true }))
                ]);
            } catch (error) {
                console.log(error, '!!');
            }
        }
        fetchData();
        dispatch(getProject());
    }, [dispatch]);

    const projectData = useSelector((state) => state.getProject?.user?.data);

    useEffect(() => {
        const proId = localStorage.getItem('U_PROJECT_ID')
        if (projectData?.length > 0 && proId) {
            const filterProject = projectData?.find((pId) => pId._id === localStorage.getItem('U_PROJECT_ID'));
            setRequest((prevRequest) => ({
                ...prevRequest,
                storeLocation: prevRequest.storeLocation || filterProject?.location?._id || "",
            }));
        }
    }, [projectData]);

    useEffect(() => {
        if (disableTra === true) {
            getTrasactionItem();
            setItems([]);
        }
    }, [disableTra]);

    const handleChangeDrawing = (val) => {
        setDrIds([...val]);
    };

    const getTrasactionItem = () => {
        const url = `${V_URL}/user/get-transaction-item`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('tag', '3');
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
        setMGrade(finalName?.material_grade);
        setItemVal({ ...itemVal, mcode: finalName?.mcode })
    }, [itemVal.itemName, itemApiData]);

    useEffect(() => {
        const selectedProject = drawingData?.filter((dr) => dr.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setSelectedDrawing(selectedProject);
    }, [drawingData, request.drawing_id])

    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    }

    const handleChange2 = (e) => {
        setItemVal({ ...itemVal, [e?.target.name]: e?.target?.value })
    }

    useEffect(() => {
        if (itemVal.quantity && itemVal.unit_rate) {
            const total = itemVal.quantity * itemVal.unit_rate;
            setItemVal((prev) => ({ ...prev, total_rate: total }));
        }
    }, [itemVal.quantity, itemVal.unit_rate]);

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
            bodyFormData.append('requestDate', request.requestDate);
            bodyFormData.append('storeLocation', request.storeLocation);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('department', request.department);
            bodyFormData.append('preparedBy', localStorage.getItem('PAY_USER_ID'));
            // bodyFormData.append('drawing_id', request.drawing_id);
            bodyFormData.append('drawingIds', JSON.stringify(drIds));
            bodyFormData.append('material_po_no', request.material_po);

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
                    setFinalId(response.data.data._id);
                    setDisableTra(true);
                }
                setDisable3(true);
            }).catch((error) => {
                console.log(error, '!!');
                toast.error(error.response.data?.message || 'Something went wrong');
            }).finally(() => {
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
        setItemVal({
            itemName: mData?.itemName?._id,
            mcode: mData?.mcode,
            quantity: mData?.quantity,
            remarks: mData?.remarks,
            store_type: mData?.store_type,
            unit_rate: mData?.unit_rate,
            total_rate: mData?.total_rate,
            main_supplier: mData?.main_supplier?._id,
        });
        setEditModalId(mData?._id);
        setSelectedSup(mData?.preffered_supplier?.map(sup => ({
            supId: sup?.supId?._id
        })));
        setShow(true);
    }

    const handleEditFormChange = (e) => {
        setSelectedSup(e.target.value)
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
                bodyFormData.append('store_type', itemVal.store_type);
                bodyFormData.append('itemName', itemVal.itemName);
                bodyFormData.append('quantity', itemVal.quantity);
                bodyFormData.append('balance_qty', itemVal.quantity);
                bodyFormData.append('mcode', mGrade || "-");
                bodyFormData.append('remarks', itemVal.remarks);
                bodyFormData.append('unit_rate', itemVal.unit_rate);
                bodyFormData.append('total_rate', itemVal.total_rate);
                bodyFormData.append('preffered_supplier', JSON.stringify(selectedSup));
                bodyFormData.append('main_supplier', itemVal.main_supplier);

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
                    console.log(error, '!!')
                    setDisable2(false);
                    toast.error(error?.response?.data?.message || 'Something went wrong');
                });
            }
        }
    }

    const handleClearModal = () => {
        setItemVal({
            itemName: "",
            mcode: "",
            quantity: "",
            remarks: "",
            store_type: "",
            unit_rate: "",
            total_rate: "",
            main_supplier: "",
        });
        setSelectedSup([]);
    }

    const validation2 = () => {
        const { isValid, err } = PurchaseModal({ itemVal, selectedSup });

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
            department: "",
            prNo: "",
        });
        setError("")
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

    const getManufacturerOptions = (searchTerm) => {
        return partyData
            ?.filter((n) => n?.partyGroup?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((n) => ({
                label: n?.name,
                value: n?._id,
            }));
    };
    const manufacturerOptions = getManufacturerOptions("Manufacturer");
    const supplierOptions = getManufacturerOptions("Supplier");

    const drawOptions = selectedDrawing?.map((e) => ({
        value: e._id,
        label: e.drawing_no,
    }));

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
                                        <Link to="/user/project-store/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/material-request-management">	Material PO No.</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Material PO No.
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
                                                <h4>{data?._id ? "Edit" : "Add"} Material PO No.</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Project Location <span className="login-danger">*</span></label>
                                                    <select className="form-control form-select"
                                                        value={request.storeLocation}
                                                        onChange={handleChange} name='storeLocation'>
                                                        <option value="">Select Project Location</option>
                                                        {projectLocationData?.map((e) =>
                                                            <option value={e?._id} key={e?._id}>{e?.name}</option>
                                                        )}
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
                                                    <label> Material PO No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="material_po" value={request.material_po} />
                                                    <div className="error">{error.material_po_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Department <span className="login-danger">*</span></label>
                                                    <select className="form-control form-select"
                                                        value={request.department}
                                                        onChange={handleChange} name='department'>
                                                        <option value="">Select Department</option>
                                                        {departmentData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error?.department_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Drawing No.</label>

                                                    <MultiSelect
                                                        value={drIds}
                                                        onChange={(e) => handleChangeDrawing(e.value)}
                                                        options={drawOptions}
                                                        optionLabel="label"
                                                        placeholder="Select Drawing No."
                                                        // display="chip"
                                                        className="w-100 multi-prime-react"
                                                    />
                                                    {/* <div className='error'>{error?.drawing_id_err}</div> */}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    {localStorage.getItem('ERP_ROLE') === PLAN &&
                                        (data?.status !== 2 && data?.status !== 4) ? (
                                        <div className="col-12">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={(disable || disable3) && !(data?._id && finalId)}>{disable ? "Processing..." : (data?._id ? 'Update and Continue' : 'Next and Continue')}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                            </div>
                                        </div>
                                    ) : null}
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
                                                    <h4>Section Details List</h4>
                                                </div>
                                                {localStorage.getItem('ERP_ROLE') === PLAN && data?.status !== 6 ? (
                                                    <>
                                                        {(data?.status !== 2 && data?.status !== 4) && (
                                                            <div className="add-group">
                                                                <DownloadFormat url={`${V_URL}/user/request-item-import-sample`} fileName={"Material-item"} />
                                                                <UploadFile url={`${V_URL}/user/import-request-item`} requestId={finalId || data._id} onUploadSuccess={getTrasactionItem} isProject={localStorage.getItem('U_PROJECT_ID')} />
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
                                                        )}
                                                    </>
                                                ) : null}
                                            </div>

                                            {items?.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table mb-0 custom-table table-striped comman-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Sr.</th>
                                                                <th>Section Details</th>
                                                                <th>Unit</th>
                                                                <th>Material Grade</th>
                                                                <th>Quantity</th>
                                                                <th>Unit / Total Rate</th>
                                                                <th>Store</th>
                                                                <th>Remark</th>
                                                                {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                                    <>
                                                                        {(data?.status !== 2 && data?.status !== 4) && (
                                                                            <th className="text-end">Action</th>
                                                                        )}
                                                                    </>
                                                                }
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {items?.map((elem, i) =>
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{elem?.itemName?.name}</td>
                                                                    <td>{elem?.itemName?.unit?.name}</td>
                                                                    <td>{elem?.mcode}</td>
                                                                    <td>{elem?.quantity}</td>
                                                                    <td>{(elem?.unit_rate)?.toFixed(2)} / {(elem?.total_rate)?.toFixed(2)}</td>
                                                                    <td>
                                                                        {elem?.store_type === 1 ? (
                                                                            <span className='custom-badge status-purple'>Main Store</span>
                                                                        ) : (
                                                                            <span className='custom-badge status-purple'>Project Store</span>
                                                                        )}
                                                                    </td>
                                                                    <td>{!elem?.remarks ? '-' : elem?.remarks}</td>
                                                                    <td className="d-flex justify-content-end">
                                                                        {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                        {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                                            (data?.status !== 2 && data?.status !== 4) ? (
                                                                            <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                                                onClick={() => handleEdit(elem)}
                                                                                data-toggle="tooltip" data-placement="top" title="Edit">
                                                                                <Pencil />
                                                                            </a>
                                                                        ) : null}
                                                                        {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                                            <>
                                                                                {(data?.status !== 2 && data?.status !== 4) && (
                                                                                    <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                                                        onClick={() => handleDelete(elem?._id, itemApiData?.find(it => it?._id === elem?.itemName)?.name)}
                                                                                        data-toggle="tooltip" data-placement="top" title="Delete">
                                                                                        <Trash2 />
                                                                                    </a>
                                                                                )}
                                                                            </>
                                                                        }
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
                                                    className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/material-request-management')}>
                                                    {localStorage.getItem('ERP_ROLE') === PLAN && (data?.status !== 2 && data?.status !== 4) ? 'Submit' : 'Back'}
                                                </button>
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
                keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Manage Section Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='material-section'>
                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Section Details <span className="login-danger">*</span> </label>
                            </div>
                            <div className="col-12 col-md-10">
                                <select className="form-control form-select"
                                    value={itemVal?.itemName}
                                    onChange={handleChange2} name='itemName'>
                                    <option value="">Select Section Details</option>
                                    {itemApiData?.map((e) => (
                                        <option key={e._id} value={e._id}>
                                            {e?.name} ({e?.mcode})
                                        </option>
                                    ))}
                                </select>
                                <div className='error'>{error2.itemName_err}</div>
                            </div>
                            {/* <div className="col-12 col-md-2">
                                <label className="col-form-label">MCode</label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="text" className="form-control" value={itemVal.mcode} onChange={handleChange2} name="mcode" />
                            </div> */}
                        </div>

                        {itemVal?.itemName ? (
                            <>
                                <div className="row align-items-center mt-2">
                                    <div className="col-12 col-md-2">
                                        <label className="col-form-label">Unit</label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <input type="text" className="form-control" value={unit} disabled />
                                    </div>
                                    <div className="col-12 col-md-2">
                                        <label className="col-form-label">Grade</label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <input type="text" className="form-control" value={mGrade || '-'} disabled />
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Quantity <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="number" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                    className="form-control" value={itemVal.quantity}
                                    onChange={handleChange2} name="quantity" />
                                <div className='error'>{error2?.quantity_err}</div>
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Store <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-4">
                                <select className="form-control form-select" onChange={handleChange2}
                                    // disabled={editModalId ? true : false}
                                    name="store_type" value={itemVal?.store_type}>
                                    <option value="">Select Store Type</option>
                                    <option value={1}>Main Store</option>
                                    <option value={2}>Project Store</option>
                                </select>
                                <div className='error'>{error2?.store_type_err}</div>
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Unit Rate </label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="number" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                    className="form-control" value={itemVal.unit_rate}
                                    onChange={handleChange2} name="unit_rate" />
                                <div className='error'>{error2?.unit_rate_err}</div>
                            </div>
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Total Rate </label>
                            </div>
                            <div className="col-12 col-md-4">
                                <input type="number" onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                    className="form-control" value={itemVal.total_rate}
                                    onChange={handleChange2} name="total_rate" disabled />
                                <div className='error'>{error2?.total_rate_err}</div>
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                {/* Supplier Name Changes Check the field */}
                                <label className="col-form-label">Preferred Manufacturer<span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-10 custom-select-wpr">
                                <MultiSelect
                                    value={selectedSup?.map(s => s.supId)}
                                    onChange={(e) => handleEditFormChange({
                                        target: {
                                            name: 'supId',
                                            value: e.value.map(id => ({ supId: id }))
                                        }
                                    })}
                                    options={manufacturerOptions}
                                    optionLabel="label"
                                    placeholder="Select Preferred Manufacturer"
                                    className="w-100 multi-prime-react model-prime-multi"
                                />
                                <div className='error'>{error2?.preffered_supplier_err}</div>
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Supplier <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-12 col-md-10">
                                <select className="form-control form-select" value={itemVal.main_supplier}
                                    onChange={handleChange2} name="main_supplier">
                                    <option value=""> Select Supplier</option>
                                    {supplierOptions?.map((e, i) =>
                                        <option value={e?.value} key={i}>{e?.label}</option>
                                    )}
                                </select>
                                <div className='error'>{error2?.main_supplier_err}</div>
                            </div>
                        </div>

                        <div className="row align-items-center mt-2">
                            <div className="col-12 col-md-2">
                                <label className="col-form-label">Remark</label>
                            </div>
                            <div className="col-12 col-md-10">
                                <textarea className="form-control" value={itemVal.remarks} onChange={handleChange2} name="remarks" />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {localStorage.getItem('ERP_ROLE') === PLAN && (
                        <button className='btn btn-primary mr-2' type='button' onClick={handleSubmit2} disabled={disable2}>
                            {disable2 ? 'Processing...' : (!editModalId ? 'Save' : 'Update')}
                        </button>
                    )}

                    {localStorage.getItem('ERP_ROLE') === PLAN && !editModalId ? (
                        <button className='btn btn-outline-primary' type='button' onClick={() => handleSubmit2('more')}>Add More</button>
                    ) : null}
                    {localStorage.getItem('ERP_ROLE') === PLAN && (
                        <button className='btn btn-secondary' type='button' onClick={handleClearModal}>Reset</button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ManagePurchaseRequest