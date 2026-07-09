import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Pagination, Search } from "../../Table";
import OrderForm from '../../../../Components/Forms/OrderForm'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { M_STORE, V_URL } from '../../../../BaseUrl'
import { getSingleOrder } from '../../../../Store/Store/Order/GetSingleOrder'
import ItemsModel from './Model_Componet/ItemsModel'
import TotalModel from './Model_Componet/TotalModel'
import Swal from 'sweetalert2'
import axios from 'axios'
import DropDown from '../../../../Components/DropDown'
import { getOrder } from '../../../../Store/Store/Order/Order';
import { FileDown, Pencil, Trash2 } from 'lucide-react';

const EditPurchaseOrder = () => {
    const location = useLocation();
    const data = location.state
    const getSinglePurchase = useSelector((state => state?.getSinglePurchaseorder?.user?.data))
    const itemDetails = useSelector((state) => state?.getAdminItem?.user?.data || []);

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
            const myurl = `${V_URL}/user/add-ms-transaction-item`;
            axios({
                method: "POST",
                url: myurl,
                params: { id: data._id, tag_number: 11 },
                data: { items_details: itemData },
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSingleOrder({ id: data._id, tag_number: 11 }))
                } else {
                    toast.error(response?.data?.message);
                }
            }).catch((error) => {
                toast.error("Something went wrong");
            });

        } else if (modalMode === 'edit') {
            const myurl = `${V_URL}/user/update-ms-transaction-item`;
            axios({
                method: "PUT",
                url: myurl,
                params: { id: data._id, itemId: i_id, tag_number: 11 },
                data: { items_details: itemData },
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSingleOrder({ id: data._id, tag_number: 11 }))
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
        dispatch(getSingleOrder({ id: data._id, tag_number: 11 }))
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
            getSingleOrder({ id: data._id, tag_number: 11 });
        }
    }, [navigate, disable, getSinglePurchase]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getSingleOrder({ id: data._id, tag_number: 11 })),
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
                const myurl = `${V_URL}/user/delete-ms-transaction-item`;
                axios({
                    method: "delete",
                    url: myurl,
                    params: { id: data._id, itemId: id, tag_number: 11 },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            toast.success(response?.data?.message);
                            dispatch(getSingleOrder({ id: data._id, tag_number: 11 }))
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

    const handleSubmit = (data) => {
        const myurl = `${V_URL}/user/update-ms-transaction`;
        axios({
            method: "PUT",
            url: myurl,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
        })
            .then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    // dispatch(getOrder({ tag_number: 11 }))
                    navigate('/main-store/user/purchase-order-management')
                } else {
                    toast.error(response?.data?.message);
                }
            })
            .catch((error) => {
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
                                        <Link to="/main-store/user/purchase-order-management">
                                            Purchase
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
                        dropdown_name={'Receiver Name'}
                        formData={data}
                        orderReturn={false}
                        isEdit={true}
                        tag_number={11}
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
                                                onClick={handleTotal}
                                                className="btn btn-primary add-pluss mx-2"
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Items Total"
                                            >
                                                +/-
                                            </button>
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
                                                {commentsData?.length === 0 || commentsData === undefined ? (
                                                    <tr>
                                                        <td colSpan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                <tr>
                                                    <td colSpan="999">
                                                        <div className="no-table-data">
                                                            --
                                                        </div>
                                                    </td>
                                                </tr>
                                                {commentsData && commentsData.length > 0 && (
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
                                                )}
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
                                            <button type="button" className="btn btn-primary submit-form me-2" onClick={() => navigate('/main-store/user/purchase-order-management')}>
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
            <ItemsModel
                show={isModalOpen}
                handleClose={handleCloseModal}
                handleSave={handleSave}
                calcItem={calcItem}
                handleChange={handleChange}
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
export default EditPurchaseOrder