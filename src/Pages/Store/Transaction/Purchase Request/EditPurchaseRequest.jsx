import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { M_STORE, V_URL } from '../../../../BaseUrl';
import DropDown from '../../../../Components/DropDown';
import ProductModel from '../Issue/ProductModel';
import { getSinglePurchaseRrequest } from '../../../../Store/Store/PurchaseRequest/GetSinglePurchaseRrequest';
import EditPurchaseRequestForm from '../../../../Components/Forms/EditPurchaseRequestForm';
import PurchaseRequestModal from './PurchaseRequestModal';
import { getGenMaster } from '../../../../Store/Store/GenralMaster/GenMaster';

const EditPurchaseRequest = () => {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'add' or 'edit'
    const [entity, setEntity] = useState([]);
    const [singleItem, setSingleItem] = useState(null);
    const [disable, setDisable] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const getSinglePurchaseRrequestData = useSelector((state) => state.getSinglePurchaseRrequest?.user?.data);
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        "Brand": "item_brand",
        "Categories": "category_name",
        "Required Quantity": "required_qty",
        'Remarks': 'remarks',
    }
    const headerKeys = Object.keys(headers);
    useEffect(() => {
        dispatch(getSinglePurchaseRrequest({ id: data._id }))
    }, [data._id])

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            setEntity([]);
            dispatch(getSinglePurchaseRrequest({ id: data._id }));
        }
    }, [navigate, disable]);

    const handleAddClick = () => {
        setSingleItem(null);
        setModalMode('add');
        setIsModalOpen(true);
        dispatch(getGenMaster({ tag_id: 18 }))
    };
    const handleEditClick = (items) => {
        setSingleItem(items);
        setModalMode('edit');
        setIsModalOpen(true);
        dispatch(getGenMaster({ tag_id: 18 }))
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = (itemData, i_id) => {
        if (modalMode === 'add') {
            const payload = {
                id: data._id,
                items_details: itemData.map(item => ({
                    item_id: item.item_id,
                    item_name: item.item_name || "",
                    unit: item.unit || "",
                    quantity: item.quantity || 0,
                    category_name: item.category_name || "",
                    category_id: item.category_id || "",
                    pr_party: item.pr_party || "",
                    item_brand: item.item_brand || "",
                    required_qty: item.required_qty || 0,
                    rate: item.rate || 0,
                    amount: item.amount || 0.0,
                    remarks: item.remarks || ""
                }))
            };
            const myurl = `${V_URL}/user/add-pr-item`;
            axios({
                method: "POST",
                url: myurl,
                params: { id: payload.id },
                data: payload,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSinglePurchaseRrequest({ id: data._id }))
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch((error) => {
                toast.error("Something went wrong");
            });

        } else if (modalMode === 'edit') {
            console.log("itemData", itemData);
            const myurl = `${V_URL}/user/update-pr-item`;
            axios({
                method: "PUT",
                url: myurl,
                // params: { id: data._id, item_detail_id: i_id },
                data: { id: data._id, item_detail_id: i_id, items_details: itemData },
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSinglePurchaseRrequest({ id: data._id }))
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch((error) => {
                toast.error("Something went wrong");
            });
        }
    };
    const handleSubmit = (data) => {
        if (data.payment_date === "Invalid date") {
            data.payment_date = null;
        }
        if (isNaN(data.payment_days)) {
            data.payment_days = 0;
        }
        const myurl = `${V_URL}/user/update-pr`
        axios({
            method: "PUT",
            url: myurl,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
        }).then((response) => {
            if (response.data.success === true) {
                toast.success(response?.data?.message);
                // const RequestItems = response?.data?.data?.items_details
                // localStorage.setItem("approvedItems", JSON.stringify(RequestItems));
                navigate('/main-store/user/getPurchaseRequest')
                setDisable(true);
            } else {
                toast.error(response?.data?.message);
            }
        })
            .catch((error) => {
                toast.error("Something went wrong");
            });
    }
    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getSinglePurchaseRrequest({ id: data._id }))
                ])
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    const commentsData = useMemo(() => {
        let computedComments = getSinglePurchaseRrequestData?.items_details;
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
            title: `Are you sure you want to delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const myurl = `${V_URL}/user/delete-pr-item`;
                axios({
                    method: "put",
                    url: myurl,
                    data: { id: data._id, itemId: id },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
                    },
                })
                    .then((response) => {
                        if (response.data.success) {
                            toast.success(response.data.message);
                            dispatch(getSinglePurchaseRrequest({ id: data._id }));
                        } else {
                            toast.error(response.data.message);
                        }
                    })
                    .catch((error) => {
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
                                        <Link to="/main-store/user/getPurchaseRequest">Purchase Request</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">Edit Purchase Request</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* <OrderForm
                        title={'Edit Purchase Request'}
                        dropdown_name={'Receiver Name'}
                        formData={data}
                        tag_number={13}
                        isEdit={true}
                        handleSubmit={handleSubmit}
                    /> */}
                    <EditPurchaseRequestForm
                        title={'Edit Purchase Request'}
                        dropdown_name={'Request By'}
                        formData={data}
                        tag_number={9}
                        isEdit={true}
                        handleSubmit={handleSubmit}
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
                                                    <th >Sr no.</th>
                                                    {headerKeys.map((key, index) => (
                                                        <th key={index} className='text-center'>{key}</th>
                                                    ))}
                                                    <th className="text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getSinglePurchaseRrequestData?.items_details?.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>{rowIndex + 1}</td>
                                                        {headerKeys.map((key, colIndex) => (
                                                            <td key={colIndex} className='text-center'>
                                                                {row[headers[key]] ? row[headers[key]] : '-'}
                                                            </td>
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
                                                {/* {getSinglePurchaseRrequestData?.items_details?.length === 0 || getSinglePurchaseRrequestData?.items_details === undefined ? (
                                                    <tr>
                                                        <td colSpan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                <tr>
                                                    <td colspan="999">
                                                        <div className="no-table-data">
                                                            --
                                                        </div>
                                                    </td>
                                                </tr> */}
                                                {/* {getSinglePurchaseRrequestData?.items_details && getSinglePurchaseRrequestData?.items_details?.length > 0 && (
                                                    <tr style={{ height: "25px" }}>
                                                        <td className="fw-bold">Total</td>
                                                        {headerKeys.map((key, colIndex) => {
                                                            if (key === 'QTY') {
                                                                return <td key={colIndex} className="fw-bold text-center">{getSinglePurchaseRrequestData?.total_qty}</td>;
                                                            } else if (key === 'Amount') {
                                                                return <td key={colIndex} className="fw-bold text-center">{getSinglePurchaseRrequestData?.amt?.toFixed(2)}</td>;
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
                                            <button type="button" className="btn btn-primary submit-form me-2" onClick={() => navigate('/main-store/user/issue-purchase-management')}>
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PurchaseRequestModal
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                entity={entity}
                EditItem={singleItem}
                mode={modalMode}
                isEdit={true}
            />
        </div>
    );
};

export default EditPurchaseRequest;
