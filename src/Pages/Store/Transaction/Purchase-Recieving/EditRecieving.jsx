import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Pagination, Search } from "../../Table";
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { M_STORE, V_URL } from '../../../../BaseUrl'
import Swal from 'sweetalert2'
import axios from 'axios'
import DropDown from '../../../../Components/DropDown'
import { FileDown, Pencil, TramFront, Trash2 } from 'lucide-react';
import OrderForm from './Comman-Components/OrderForm';
import moment from 'moment';
import TotalModel from '../Purchase/Model_Componet/TotalModel';
import EditItemsModel from './Comman-Components/EditItemsModel';
import { getPurchaseReciecingItems } from '../../../../Store/Store/MainStore/PurchaseRecieving/GetPurchaseRecievingItems';
import { getAdminTransport } from '../../../../Store/Store/StoreMaster/Transport/AdminTransport';

const EditRecieving = () => {
    const location = useLocation();
    const data = location.state
    const getSinglePurchase = useSelector((state) => state?.getOnePrItems?.data?.data || [])
    const transport = useSelector((state) => state.getAdminTransport?.user?.data || []);
    const itemDetails = useSelector((state) => state?.getAdminItem?.user?.data?.data || []);
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        'M.code': 'm_code',
        'QTY': 'quantity',
        'Rate': 'rate',
        'Amount': 'amount',
        'Discount': 'discount',
        'Dis.Amt.': 'discount_amount',
        'SP.DSC.': 'sp_discount',
        'SP.DS.Amt.': 'sp_discount_amount',
        'Tax.Amt.': 'taxable_amount',
        'GST': 'gst',
        'GST Amount': 'gst_amount',
        'Total Amt.': 'total_amount',
        'Remarks': 'remarks',
    }
    const headerKeys = Object.keys(headers);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const dispatch = useDispatch();
    const [modalMode, setModalMode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Modal, setModel] = useState(false);
    const [calcItem, setCalcItem] = useState({});
    const [singleItem, setSingleItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setlimit] = useState(10);
    const [formData, setFormData] = useState({
        trans_date: '',
        bill_no: '',
        po_no: "",
        party_id: '',
        customer_id:'',
        project_id: '',
        master_id: '',
        upload_pdf: '',
        transport_id: '',
        driver_name: '',
        vehical_no: '',
        challan_no: '',
        transport_date: '',
        receive_date: '',
        lr_no: '',
        lr_date: '',
        payment_date: '',
        payment_days: '',
        getpass: ""
    });
    const [formError, setFormError] = useState({})
    useEffect(() => {
        if (data) {
            const getThirdParty = transport?.find(e => e?._id === data?.transport_data?._id)
            setFormData({
                trans_date: data?.trans_date === null ? "" : moment(data?.trans_date).format('YYYY-MM-DD'),
                bill_no: data?.bill_no,
                voucher_no: data?.voucher_no,
                po_no: data?.po_no?.map((item) => item)?.join(","),
                party_id: data?.party_data?._id,
                customer_id: data?.customer_data?._id,
                project_id: data?.project_data?._id,
                master_id: data?.received_by?._id,
                upload_pdf: data?.pdf,
                transport_id: data?.transport_data?._id,
                driver_name: getThirdParty?.name === "Third Party" ? data?.driver_name : null,
                vehical_no: data?.vehical_no,
                challan_no: data?.challan_no,
                transport_date: data?.transport_date === null ? "" : moment(data?.transport_date).format('YYYY-MM-DD'),
                receive_date: data?.receive_date === null ? "" : moment(data?.receive_date).format('YYYY-MM-DD'),
                lr_no: data?.lr_no,
                lr_date: data?.lr_date === null ? "" : moment(data?.lr_date).format('YYYY-MM-DD'),
                payment_date: data?.payment_date === null ? "" : moment(data?.payment_date).format('YYYY-MM-DD'),
                payment_days: data?.payment_days,
                getpass: ""
            })
        }
    }, [data])

    const formValidation = () => {
        const selectedTransport = transport?.find((item) => item?._id === formData?.transport_id);
        let isvalide = true
        let err = {}

        if (!formData?.party_id) {
            isvalide = false
            err['party_id'] = "please select party name"
        }
        if (!formData?.project_id) {
            isvalide = false
            err['project_id'] = "please select project name"
        }
        if (!formData?.trans_date) {
            isvalide = false
            err['trans_date'] = "please select transaction date"
        }
        if (!formData?.master_id) {
            isvalide = false
            err['master_id'] = "please select master name"
        }
        if (!formData?.transport_id) {
            isvalide = false
            err['transport_id'] = "please select transport name"
        }
        if (!formData?.upload_pdf) {
            isvalide = false
            err['upload_pdf'] = "please upload pdf"
        }
        // if (!formData?.transport_date) {
        //     isvalide = false
        //     err['transport_date'] = "please select transport date"
        // }
        // if (!formData?.receive_date) {
        //     isvalide = false
        //     err['receive_date'] = "please select receive date"
        // }
        // if (!formData?.lr_date) {
        //     isvalide = false
        //     err['lr_date'] = "please select lr date"
        // }
        // if (!formData?.payment_date) {
        //     isvalide = false
        //     err['payment_date'] = "please select payment date"
        // }
        if (selectedTransport?.name === "Third Party" && !formData?.driver_name) {
            isvalide = false
            err['driver_name'] = "please Enter driver name"
        }
        if (!formData?.bill_no && !formData?.challan_no) {
            isvalide = false;
            toast.error("Either Bill number or Challan number is required");
            // err["bill_or_challan"] = "Please provide either bill number or challan number";
        }
        setFormError(err)
        return isvalide
    }
    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleAddClick = () => {
        setModalMode('add');
        setIsModalOpen(true);
    };
    const handleTotal = () => {
        setModel(true)
    }
    const handleEditClick = (items) => {
        setSingleItem(items);
        setModalMode('edit');
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleClose = () => setModel(false);

    const handleSave = (itemData, i_id) => {
        if (modalMode === 'add') {
            const payload = {
                id: data._id,
                items_details: itemData
            }
            const myurl = `${V_URL}/user/add-pu-item`;
            axios({
                method: "POST",
                url: myurl,
                data: payload,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getPurchaseReciecingItems({ id: data._id }))
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch((error) => {
                toast.error("Something went wrong");
            });

        } else if (modalMode === 'edit') {
            const payload = {
                id: data._id,
                item_detail_id: singleItem?._id,
                items_details: itemData
            }
            const myurl = `${V_URL}/user/update-pu-item`;
            axios({
                method: "PUT",
                url: myurl,
                data: payload,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getPurchaseReciecingItems({ id: data._id }))
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch((error) => {
                toast.error("Something went wrong");
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCalcItem({ ...calcItem, [name]: value });
    };
    useEffect(() => {
        dispatch(getPurchaseReciecingItems({ id: data._id }))
        dispatch(getAdminTransport({ is_main: true }))
    }, [])
    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            setEntity([]);
            getPurchaseReciecingItems({ id: data._id });
        }
    }, [navigate, disable, getSinglePurchase]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    getPurchaseReciecingItems({ id: data._id }),
                ])
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    const commentsData = useMemo(() => {
        let computedComments = getSinglePurchase?.items_details;
        if (search) {
            computedComments = computedComments.filter((pro) =>
                pro.orderNo?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                pro.party?.name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleDelete = (id, title, itemId) => {
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
                const myurl = `${V_URL}/user/delete-pu-item`;
                axios({
                    method: "PUT",
                    url: myurl,
                    data: { id: data._id, itemId: itemId },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            toast.success(response?.data?.message);
                            setDisable(true);
                            getPurchaseReciecingItems({ id: data._id })
                        } else {
                            toast.error(response?.data?.message);
                        }
                    })
                    .catch((error) => {
                        toast.error("Something went wrong");
                    });
            }
        });
    };

    const handleSubmit = () => {
        if (formValidation()) {
            const myurl = `${V_URL}/user/update-pu`;
            const payload = {
                "id": data._id,
                "trans_date": formData?.trans_date === "" ? null : formData?.trans_date,
                "bill_no": formData?.bill_no === "" ? null : formData?.bill_no,
                "challan_no": formData?.challan_no === "" ? null : formData?.challan_no,
                "master_id": formData?.master_id === "" ? null : formData?.master_id,
                "receive_date": formData?.receive_date === "" ? null : formData?.receive_date,
                "transport_id": formData?.transport_id === "" ? null : formData?.transport_id,
                "transport_date": formData?.transport_date === "" ? null : formData?.trans_date,
                "vehical_no": formData?.vehical_no === "" ? null : formData?.vehical_no,
                "payment_date": formData?.payment_date === "" ? null : formData?.payment_date,
                "payment_days": formData?.payment_days === "" ? null : formData?.payment_days,
                "lr_no": formData?.lr_no === "" ? null : formData?.lr_no,
                "lr_date": formData?.lr_date === "" ? null : formData?.lr_date,
                "pdf": formData?.upload_pdf,
                "driver_name": formData?.driver_name === "" ? null : formData?.driver_name,
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
                    dispatch(getPurchaseReciecingItems({ id: data._id }))
                    navigate("/main-store/user/recieving-management")
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch(() => {
                toast.error("Something went wrong");
            });
        }
    }
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
                                        <Link to="/main-store/user/recieving-management">
                                            Purchase Recieving
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {"Edit"} Purchase Recieving
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <OrderForm
                        title={'Edit Purchase '}
                        dropdown_name={'Receiver Name'}
                        voucher_name={'PU NO'}
                        formData={formData}
                        setFormError={setFormError}
                        setFormData={setFormData}
                        formError={formError}
                        isEdit={true}
                        tag_number={11}
                        handleFormChange={handleFormChange}
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
                                                onClick={handleTotal}
                                                className="btn btn-primary add-pluss mx-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Items Total"
                                            >
                                                +/-
                                            </button> */}
                                            <button
                                                onClick={handleAddClick}
                                                className="btn btn-primary add-pluss mx-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Add Items"
                                            >
                                                <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3 table-responsive">
                                        <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    {headerKeys.map((key, index) => (
                                                        <th key={index}>{key}</th>
                                                    ))}
                                                    <th className="text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>{rowIndex + 1}</td>
                                                        {headerKeys.map((key, colIndex) => (
                                                            <td key={colIndex}>{row[headers[key]]}</td>
                                                        ))}
                                                        <td className="justify-content-end d-flex">
                                                            <button
                                                                className="action-icon mx-1"
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                onClick={() => handleEditClick(row)}
                                                            >
                                                                <Pencil />
                                                            </button>
                                                            <button
                                                                className="action-icon mx-1"
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                onClick={() => handleDelete(row?._id, row?.item_name, row?._id)}
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {commentsData?.length === 0 || commentsData === undefined ? (
                                                    <tr>
                                                        <td colSpan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                {/* <tr>
                                                    <td colSpan="999">
                                                        <div className="no-table-data">
                                                            --
                                                        </div>
                                                    </td>
                                                </tr> */}
                                                {/* {commentsData && commentsData.length > 0 && (
                                                    <tr style={{ height: "25px" }}>
                                                        <td className="fw-bold">Total</td>
                                                        {headerKeys.map((key, colIndex) => {
                                                            if (key === 'QTY') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.total_qty}</td>;
                                                            } else if (key === 'Amount') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.amt?.toFixed(2)}</td>;
                                                            } else if (key === 'Dis.Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.dis_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'SP.DS.Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.sp_dis_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'Tax.Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.tax_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'GST Amount') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.gst_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'Total Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getSinglePurchase?.total_amt?.toFixed(2)}</td>;
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
            <EditItemsModel
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                calcItem={calcItem}
                handleChange={handleChange}
                isOrder={true}
                entity={entity}
                EditItem={singleItem}
                mode={modalMode}
                isEdit={true}
            />
            <TotalModel
                show={Modal}
                handleClose={handleClose}
                Order_id={getSinglePurchase?._id}
                tag_number={11}
                Amount={getSinglePurchase?.total_amt}
            />
        </div >
    )
}
export default EditRecieving