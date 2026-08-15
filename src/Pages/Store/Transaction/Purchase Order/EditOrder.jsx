
import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Pagination, Search } from "../../Table";
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { M_STORE, V_URL } from '../../../../BaseUrl'
import { getSingleOrder } from "../../../../Store/Store/MainStore/PurchaseOrder/GetSinglePo";
import Swal from 'sweetalert2'
import axios from 'axios'
import DropDown from '../../../../Components/DropDown'
import { getOrder } from '../../../../Store/Store/Order/Order';
import { Pencil, Trash2 } from 'lucide-react';
import OrderForm from './CommanComponent/OrderForm';
import EditPoItemsModel from './CommanComponent/EditPoItemsModel';

const EditOrder = () => {
    const location = useLocation();
    const data = location.state
    const getSinglePurchase = useSelector((state) => state?.getSinglePurchaseorder?.data?.data || [])
    const itemDetails = useSelector((state) => state?.getAdminItem?.user?.data?.data || []);
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        'QTY': 'quantity',
        'Rate': 'rate',
        "Remarks": 'remarks'
    }
    const headerKeys = Object.keys(headers);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const dispatch = useDispatch();
    const [modalMode, setModalMode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calcItem, setCalcItem] = useState({});
    const [singleItem, setSingleItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setlimit] = useState(10);
    const [orderFormData, setOrderFormData] = useState({
        order_date: "",
        party_id: '',
        master_id: "",
        project_id: ""
    })
    const handleAddClick = () => {
        setModalMode('add');
        setIsModalOpen(true);
    };
    const handleEditClick = (items) => {
        setModalMode('edit');
        setSingleItem(items);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSave = (itemData, id) => {
        if (modalMode === 'add') {
            const myurl = `${V_URL}/user/add-po-item`;
            const payload = {
                "id": data?._id,
                "items_details": [itemData]
            }
            axios({
                method: "POST",
                url: myurl,
                data: payload,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSingleOrder({ id: data?._id }));
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch((error) => {
                toast.error("Something went wrong");
            });

        } else if (modalMode === 'edit') {
            const myurl = `${V_URL}/user/update-po-item`;
            const payload = {
                "id": data?._id,
                "item_detail_id": id,
                "items_details": itemData
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
                    dispatch(getSingleOrder({ id: data?._id }))

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
        dispatch(getSingleOrder({ id: data?._id, tag_number: 15 }))
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
            getSingleOrder({ id: data?._id, tag_number: 15 });
        }
    }, [navigate, disable, getSinglePurchase]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getSingleOrder({ id: data?._id, tag_number: 15 })),
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
                const myurl = `${V_URL}/user/delete-po-item`;
                axios({
                    method: "PUT",
                    url: myurl,
                    data: { id: data?._id, itemId: id },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            toast.success(response?.data?.message);
                            dispatch(getSingleOrder({ id: data?._id }));
                            setDisable(true);
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
    const handleFormChange = (name, value) => {
        setOrderFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleFormSubmit = () => {
        const myurl = `${V_URL}/user/update-po`;
        const payload = {
            "id": orderFormData?.id,
            "trans_date": orderFormData?.order_date,
            "project_id": orderFormData?.project_id,
            "party_id": orderFormData?.party_id,
            "master_id": orderFormData?.master_id
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
                dispatch(getSingleOrder({ id: data?._id }))
                navigate("/main-store/user/order-management")
            } else {
                toast.error(response?.data?.message);
            }
        }).catch(() => {
            toast.error("Something went wrong");
        });
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
                                        <Link to="/main-store/user/order-management">
                                            Purchase Order
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {"Edit"} Purchase Order
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <OrderForm
                        title={'Edit Purchase Order'}
                        dropdown_name={'Prepared Name'}
                        FormData={data}
                        orderFormData={orderFormData}
                        setOrderFormData={setOrderFormData}
                        handleFormChange={handleFormChange}
                        handleSubmit={handleFormSubmit}
                        tag_number={10}
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
                                                                onClick={() => handleDelete(row?._id, row?.item_name)}
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
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
                </div>
            </div>
            <EditPoItemsModel
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
        </div>
    )
}
export default EditOrder