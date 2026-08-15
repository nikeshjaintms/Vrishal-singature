import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { M_STORE, V_URL } from "../../../../BaseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../../../Store/Store/Item/Item";
import { getOneIssueReturn } from "../../../../Store/Admin/Transaction/GetOneIssueReturn";

const ViewIssueReturn = () => {
    const getOneIsseItem = useSelector((state => state?.getSingleIsr?.user?.data))
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        'M.code': 'm_code',
        'QTY': 'quantity',
        'Rate': 'rate',
        'Amount': 'amount',
        'GST': 'gst',
        'GST Amount': 'gst_amount',
        'Total Amount': 'total_amount',
        'Remarks': 'remarks',
    }
    const headerKeys = Object.keys(headers);

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        if (disable === true) {
            setEntity([]);
            dispatch(getOneIssueReturn({ id: data?._id }));
        }
    }, [navigate, disable]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getOneIssueReturn({ id: data?._id }));
                setDisable(false)
            } catch (error) {
                setDisable(false)
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [disable, dispatch])

    const commentsData = useMemo(() => {
        let computedComments = getOneIsseItem?.items_details || [];
        if (search) {
            computedComments = computedComments.filter((pro) =>
                pro.item_name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }

        setTotalItems(computedComments?.length);

        return computedComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [getOneIsseItem, search, currentPage, limit])
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getOneIssueReturn({ id: data?._id })),
                ])
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const fetchItem = () => {
            try {
                dispatch(getItem())
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchItem()
    }, [dispatch]);
    const itemApiData = useSelector((state) => state?.getItem?.user?.data);

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
                const myurl = `${V_URL}/user/delete-stock`;
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
                })
                    .then((response) => {
                        // console.log(response.data, "DEL");
                        if (response.data.success === true) {
                            toast.success(response?.data?.message);
                            setDisable(true);
                        } else {
                            toast.error(response?.data?.message);
                        }
                    })
                    .catch((error) => {
                        toast.error("Something went wrong");
                        console?.log("Errors", error);
                    });
            }
        });
    };

    const handleClose = () => setShow(false);

    const handleRefresh = () => {
        setDisable(true);
    };

    const handleSaveModal = (data) => {
        // console.log(data, '%%%');
        const myurl = `${V_URL}/user/manage-order-adjustment`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('order', data?.orderId);
        bodyFormData.append('itemName', data?.itemId);
        bodyFormData.append('balance_qty', data?.balance_qty);
        bodyFormData.append('receive_qty', data?.receive);
        bodyFormData.append('tag', '1');
        bodyFormData.append('store_type', '1');

        axios({
            method: 'post',
            url: myurl,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then((response) => {
            console.log(response?.data, '@@')
            if (response?.data?.success === true) {
                toast.success(response?.data?.message);
                setShow(false);
                data.receive = '';
                setDisable(true);
            } else {
                toast.error(response?.data?.message);
            }
        }).catch((error) => {
            console.log(error, '!!');
            toast.error(error.response?.data?.message)
        })
    }
    const handleEdit = (elem, e) => {
        setSelectedData({ elem, e })
        setShow(true);
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                                        <Link to="/admin/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/admin/issue-return">Issue Return</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">View Issue Return Items</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Items</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }}
                                                                    />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn">
                                                                        <img
                                                                            src="/assets/img/icons/search-normal.svg"
                                                                            alt="firm-searchBox"
                                                                        />
                                                                    </a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button
                                                                    type="button"
                                                                    onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2"
                                                                    data-toggle="tooltip"
                                                                    data-placement="top"
                                                                    title="Refresh"
                                                                >
                                                                    <img
                                                                        src="/assets/img/icons/re-fresh.svg"
                                                                        alt="refresh"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown
                                                        limit={limit}
                                                        onLimitChange={(val) => setlimit(val)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-3 table-responsive">
                                            <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        {headerKeys.map((key, index) => (
                                                            <th key={index}>{key}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((row, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            <td>{rowIndex + 1}</td>
                                                            {headerKeys.map((key, colIndex) => (
                                                                <td key={colIndex}>
                                                                    {row[headers[key]] ? row[headers[key]] : '-'}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colspan="999">
                                                                <div className="no-table-data">
                                                                    No Data Found!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null}
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
                    ) : <Loader />}

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => navigate('/admin/issue-return')}>
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
        </div>
    );
};
export default ViewIssueReturn;
