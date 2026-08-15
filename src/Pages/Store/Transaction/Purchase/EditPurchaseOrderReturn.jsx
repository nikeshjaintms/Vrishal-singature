import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Pagination } from "../../Table";
import OrderForm from '../../../../Components/Forms/OrderForm'
import { useDispatch, useSelector } from 'react-redux'
import { getOrder } from '../../../../Store/Store/Order/Order'
import toast from 'react-hot-toast'
import { M_STORE, V_URL } from '../../../../BaseUrl'
import { getSingleReturn } from '../../../../Store/Store/Order/GetSingleOrderReturn'
import ItemsModel from './Model_Componet/ItemsModel'
import Swal from 'sweetalert2'
import axios from 'axios'
import DropDown from '../../../../Components/DropDown'
import { FileDown, Pencil, Trash2 } from 'lucide-react';
import TotalModel from './Model_Componet/TotalModel';

const EditPurchaseOrderReturn = () => {
    const location = useLocation();
    const data = location.state
    const itemDetails = useSelector((state) => state?.getAdminItem?.user?.data || []);
    const getOneIssueItem = useSelector((state) => state.getOneIssue?.user?.data);
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
    const [calcItem, setCalcItem] = useState({});
    const [singleItem, setSingleItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit, setlimit] = useState(10);
    const [Modal, setModel] = useState(false);

    const handleTotal = () => {
        setModel(true)
    }
    const handleClose = () => setModel(false);

    const handleAddClick = () => {
        setModalMode('add');
        setIsModalOpen(true);
    };
    const handleEditClick = (items) => {
        setSingleItem(items);
        setModalMode('edit');
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleSave = (itemData, i_id) => {
        if (modalMode === 'add') {
            const myurl = `${V_URL}/user/add-ms-transaction-item`;
            axios({
                method: "POST",
                url: myurl,
                params: { id: data._id, tag_number: 12 },
                data: { items_details: itemData },
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSingleReturn({ id: data._id, tag_number: 12 }))
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
                params: { id: data._id, itemId: i_id, tag_number: 12 },
                data: { items_details: itemData },
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    setDisable(true);
                    dispatch(getSingleReturn({ id: data._id, tag_number: 12 }))
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
        dispatch(getSingleReturn({ id: data._id, tag_number: 12 }))
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
            getSingleReturn({ id: data._id, tag_number: 12 });
        }
    }, [navigate, disable, getOneIssueItem]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getSingleReturn({ id: data._id, tag_number: 12 })),
                ])
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    const commentsData = useMemo(() => {
        let computedComments = getOneIssueItem?.items_details;

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
                    params: { id: data._id, itemId: id, tag_number: 12 },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            toast.success(response?.data?.message);
                            dispatch(getSingleReturn({ id: data._id, tag_number: 12 }))
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
        
        if (data.payment_date === "Invalid date") {
            data.payment_date = null;
        }
        if (isNaN(data.payment_days)) {
            data.payment_days = 0;
        }
        const myurl = `${V_URL}/user/update-ms-transaction`;
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
                setDisable(true);
                // dispatch(getOrder({ tag_number: 12 }))
                navigate('/main-store/user/purchase-return-management')
            } else {
                toast.error(response?.data?.message);
            }
        }).catch((error) => {
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
                                        <Link to="/main-store/user/purchase-return-management">
                                            Purchase Return
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {"Edite"} Purchase Return
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <OrderForm
                        title={'Edite Purchase Return'}
                        dropdown_name={'Receiver Name'}
                        formData={data}
                        isEdit={true}
                        tag_number={12}
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
                                    <div className="col-12 mt-3 table-responsive ">
                                        <table className="table border-0 mb-0 custom-table table-striped comman-table ">
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
                                                {getOneIssueItem?.items_details?.map((row, rowIndex) => (
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
                                                <tr>
                                                    <td colspan="999">
                                                        <div className="no-table-data">
                                                            --
                                                        </div>
                                                    </td>
                                                </tr>
                                                {commentsData === 0 ? (
                                                    <tr>
                                                        <td colspan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                {commentsData && commentsData.length > 0 && (
                                                    <tr style={{ height: "25px" }}>
                                                        <td className="fw-bold">Total</td>
                                                        {headerKeys.map((key, colIndex) => {
                                                            if (key === 'QTY') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.total_qty}</td>;
                                                            } else if (key === 'Amount') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.amt?.toFixed(2)}</td>;
                                                            } else if (key === 'Dis.Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.dis_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'SP.DS.Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.sp_dis_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'Tax.Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.tax_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'GST Amount') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.gst_amt?.toFixed(2)}</td>;
                                                            } else if (key === 'Total Amt.') {
                                                                return <td key={colIndex} className="fw-bold">{getOneIssueItem?.total_amt?.toFixed(2)}</td>;
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
                                            <button type="button" className="btn btn-primary submit-form me-2" onClick={() => navigate('/main-store/user/purchase-return-management')}>
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
            />
            <TotalModel
                show={Modal}
                handleClose={handleClose}
                Amount={getOneIssueItem?.total_amt}
                tag_number={12}
                Order_id={getOneIssueItem?._id}
            />
        </div>
    )
}
export default EditPurchaseOrderReturn