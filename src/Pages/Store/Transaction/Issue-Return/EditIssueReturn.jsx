import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { M_STORE, V_URL } from '../../../../BaseUrl';
import DropDown from '../../../../Components/DropDown';
import { Pagination } from "../../Table";
import moment from 'moment';
import ItemsModel from '../Issue/Comman-Components/ItemsModel';
import { getIssueReturnItems } from '../../../../Store/Store/MainStore/IssueReturn/GetIssueReturnItems';
import EditOrderForm from './Comman-Components/EditOrderForm';
import { getAdminTransport } from '../../../../Store/Store/StoreMaster/Transport/AdminTransport';

const EditIssueReturn = () => {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [entity, setEntity] = useState([]);
    const [issueItem, setIssueItem] = useState([]);
    const [disable, setDisable] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const getOneIssueItem = useSelector((state) => state.getIssueReturnItems?.data?.data);
    const transport = useSelector((state) => state.getAdminTransport?.user?.data || []);
    const [formError, setFormError] = useState({})
    const [formData, setFormData] = useState({
        trans_date: null,
        party_id: null,
        pass_id: null,
        issue_no: null,
        issue_challan_no: null,
        bill_no: null,
        project_id: null,
        receive_date: null,
        issue_type: null,
        reciever_name: null,
        transport_id: null,
        transport_date: null,
        vehical_no: null,
        lr_no: null,
        lr_date: null,
        address: null,
        driver_name: null,
        issue_no: null,
        voucher_no: null
    })
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        'M.code': 'm_code',
        'QTY': 'quantity',
        'Rate': 'rate',
        'Amount': 'amount',
        'GST': 'gst',
        'GST Amunt': 'gst_amount',
        'Total amount': 'amount',
        "Return Type": "isreturn",
        'Remarks': 'remarks',
    }
    const headerKeys = Object.keys(headers);
    useEffect(() => {
        dispatch(getIssueReturnItems({ id: data?._id }))
        setDisable(false);
    }, [disable])
    useEffect(() => {
        if (data) {
            const getThirdParty = transport?.find(e => e?._id === data?.transport_data?._id)
            setFormData({
                trans_date: moment(data?.trans_date).format('YYYY-MM-DD'),
                party_id: data.party_data?._id,
                party_id: data.party_data?._id,
                pass_id: data.get_pass_data?._id,
                issue_challan_no: data.challan_no,
                bill_no: data.bill_no,
                project_id: data.project_data?._id,
                receive_date: moment(data?.receive_date).format('YYYY-MM-DD'),
                transport_date: moment(data?.transport_date).format('YYYY-MM-DD'),
                lr_date: moment(data?.lr_date).format('YYYY-MM-DD'),
                issue_type: data.isexternal === true ? "External" : "Internal",
                reciever_name: data.receiver_name,
                transport_id: data.transport_data?._id,
                lr_no: data.lr_no,
                vehical_no: data?.vehical_no,
                address: data?.address,
                issue_no: data?.voucher_no,
                voucher_no: data?.voucher_no,
                driver_name: getThirdParty?.name === "Third Party" ? data?.driver_name : null,
            })
        }
    }, [data])
    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            setEntity([]);
            dispatch(getIssueReturnItems({ id: data?._id }));
            setDisable(false);
        }
        dispatch(getAdminTransport({ is_main: true }))
    }, [navigate, disable]);

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    };

    const validationForm = () => {
        const selectedTransport = transport?.find((item) => item?._id === formData?.transport_id);
        let isvalide = true;
        let err = {};

        if (!formData?.party_id) {
            isvalide = false
            err['party_id'] = "please select party name"
        }
        if (!formData?.bill_no) {
            isvalide = false
            err['bill_no'] = "please enter bill no"
        }
        if (!formData?.project_id) {
            isvalide = false
            err['project_id'] = "please select project name"
        }
        if (!formData?.trans_date) {
            isvalide = false
            err['trans_date'] = "please select transaction date"
        }
        // if (!formData?.bill_no) {
        //   isvalide = false
        //   err['bill_no'] = "please select bill number"
        // }

        if (formData?.issue_type === "External") {
            if (!formData?.transport_id) {
                isvalide = false
                err['transport_id'] = "please select transport name"
            }
            if (!formData?.address) {
                isvalide = false
                err['address'] = "please enter address"
            }
            if (selectedTransport?.name === "Third Party" && !formData?.driver_name) {
                isvalide = false
                err['driver_name'] = "please Enter driver name"
            }
        }
        if (formData?.issue_type === "Internal") {
            if (!formData?.pass_id) {
                isvalide = false
                err['pass_id'] = "please select Pass No."
            }
        }
        if (!formData?.issue_type) {
            isvalide = false
            err['issue_type'] = "please select issue type"
        }
        setFormError(err);
        return isvalide;
    };
    const handleSubmit = () => {
        console.log(formError);

        if (validationForm()) {
            const myurl = `${V_URL}/user/update-isr`;
            let payload
            if (formData?.issue_type === "Internal") {
                payload = {
                    "id": data?._id,
                    "trans_date": formData.trans_date === "Invalid date" ? null : formData.trans_date,
                    // "bill_no": formData.bill_no,
                    "receive_date": formData?.receive_date === "Invalid date" ? null : formData?.receive_date,
                }
            } else {
                payload = {
                    "id": data?._id,
                    // "bill_no": formData.bill_no,
                    "trans_date": formData.trans_date === "Invalid date" ? null : formData.trans_date,
                    "receiver_name": formData?.reciever_name,
                    "transport_id": formData?.transport_id,
                    "receive_date": formData?.receive_date === "Invalid date" ? null : formData?.receive_date,
                    "vehical_no": formData?.vehical_no,
                    "transport_date": formData?.transport_date === "Invalid date" ? null : formData?.transport_date,
                    "lr_date": formData?.lr_date === "Invalid date" ? null : formData?.lr_date,
                    "lr_no": formData?.lr_no,
                    "driver_name": formData?.driver_name,
                    "address": formData?.address,
                };
            }
            axios({
                method: "PUT",
                url: myurl,
                data: payload,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getIssueReturnItems({ id: data?._id }))
                    navigate("/main-store/user/issue-purchase-return-management")
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch(() => {
                toast.error("Something went wrong");
            });
        } else {
            toast.error("Please fill all the fields")
            console.log(formError);
        }
    }

    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
        if (getOneIssueItem?.items_details?.length > 0) {
            setIssueItem(getOneIssueItem?.items_details)
        }
    }, [itemDetails, getOneIssueItem]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getIssueReturnItems({ id: data?._id }))
                ])
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    const commentsData = useMemo(() => {
        let computedComments = getOneIssueItem?.items_details;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, issueItem, limit, entity]);

    const handleDelete = (id, title) => {
        Swal.fire({
            title: `Are you sure want to delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const myurl = `${V_URL}/user/delete-iss-item`;
                axios({
                    method: "put",
                    url: myurl,
                    data: { id: data?._id, itemId: id },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
                    },
                })
                    .then((response) => {
                        if (response.data.success) {
                            toast.success(response.data.message);
                            dispatch(getIssueReturnItems({ id: data?._id }));
                        } else {
                            toast.error(response.data.message);
                        }
                    })
                    .catch(() => {
                        toast.error("Something went wrong");
                    });
            }
        });
    };

    return (
        <div className={`main-wrapper ${false ? "slide-nav" : ""}`}>
            <Header handleOpen={() => { }} />
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
                                        <Link to="/main-store/user/issue-purchase-return-management">Issue Return</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">Edit Issue Return</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <EditOrderForm
                        formData={formData}
                        setFormData={setFormData}
                        formError={formError}
                        setFormError={setFormError}
                        handleFormChange={handleFormChange}
                        title={'Issue Return'}
                        dropdown_name={'Receiver Name'}
                        isEdit={true}
                    />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 d-flex justify-content-between align-items-center">
                                        <div className="form-heading">
                                            <h4 className="mb-0">Items Details</h4>
                                        </div>
                                        <div className='d-flex justify-content-between align-items-center mx-2'>
                                            <DropDown
                                                limit={limit}
                                                onLimitChange={(val) => setlimit(val)}
                                            />
                                            {/* <button
                                                onClick={handleAddClick}
                                                className="btn btn-primary add-pluss mx-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Add Items"
                                            >
                                                <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                            </button> */}
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3 table-responsive">
                                        <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                            <thead>
                                                <tr>
                                                    <th >Sr no.</th>
                                                    {headerKeys.map((key, index) => (
                                                        <th key={index} className='text-center'>{key}</th>
                                                    ))}
                                                    <th className="text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>{rowIndex + 1}</td>
                                                        {headerKeys.map((key, colIndex) => (
                                                            <td key={colIndex} className='text-center'>
                                                                {key === "Return Type"
                                                                    ? row[headers[key]] === false
                                                                        ? "Returnable"
                                                                        : row[headers[key]] === true
                                                                            ? "Non-Returnable"
                                                                            : "-"
                                                                    : row[headers[key]] || "-"}
                                                            </td>
                                                        ))}
                                                        <td className="justify-content-end d-flex">
                                                            {/* <button
                                                                className="action-icon mx-1"
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                onClick={() => handleEditClick(row)}
                                                            >
                                                                <Pencil />
                                                            </button> */}
                                                            <button
                                                                className="action-icon mx-1"
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                onClick={() => handleDelete(row?._id, row?.item_name)}
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {commentsData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="999">
                                                            <div className="no-table-data">No Data Found!</div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                {/* {commentsData && commentsData.length > 0 && (
                                                    <tr style={{ height: "25px" }}>
                                                        <td className="fw-bold">Total</td>
                                                        {headerKeys.map((key, colIndex) => {
                                                            if (key === 'QTY') {
                                                                return <td key={colIndex} className="fw-bold text-center">{getOneIssueItem?.quantity}</td>;
                                                            } else if (key === 'Amount') {
                                                                return <td key={colIndex} className="fw-bold text-center">{getOneIssueItem?.total_amount?.toFixed(2)}</td>;
                                                            } else {
                                                                return <td key={colIndex}></td>;
                                                            }
                                                        })}
                                                        <td></td>
                                                    </tr>
                                                )} */}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                            <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="DataTables_Table_0_paginate">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={(page) => setCurrentPage(page)}
                                                />
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
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            {/* <button
                                                type="button"
                                                className="btn btn-primary cancel-form me-2"
                                                onClick={handleReset}
                                            >
                                                Reset
                                            </button> */}
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleSubmit}
                                            >
                                                Submit
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
    );
};

export default EditIssueReturn;
