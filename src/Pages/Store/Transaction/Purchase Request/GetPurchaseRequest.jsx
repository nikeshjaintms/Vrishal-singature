import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { M_STORE, V_URL } from "../../../../BaseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import Swal from "sweetalert2";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import PDFDownload from "../../../../Components/DownloadFormat/PDFDownload";
import { DownloadPdf } from "../../Components/DownloadPdf";
import { DownloadXlsx } from "../../Components/DownloadXlsx";
import FilterComponent from "../FilterComponent";
import { getPurchaseRequest } from "../../../../Store/Store/PurchaseRequest/GetRequest";

const GetPurchaseRequest = () => {
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const [startDownload, setStartDownload] = useState(false);
    const [payload, setPayload] = useState(null);
    const [filter, setFilter] = useState({
        date: {
            start: null,
            end: null
        }
    });
    const [openFilter, setOpenFilter] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        fetchData()
    }, [navigate, disable, filter, search]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("tag_number", 9);
        bodyFormData.append("search", search);
        bodyFormData.append("filter", JSON.stringify(filter));
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'))
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'))
        dispatch(getPurchaseRequest({ formData: bodyFormData }));
        setDisable(false);
    };

    const entity = useSelector((state => state?.getPurchaseRequest?.user?.data))

    const commentsData = useMemo(() => {
        let computedComments = entity;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleDateChange = (e, type) => {
        const dateValue = e.target.value;
        setFilter(prevFilter => {
            const newFilter = {
                ...prevFilter,
                date: {
                    ...prevFilter.date,
                    [type]: dateValue
                }
            }
            return newFilter;
        });
    }

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
                const myurl = `${V_URL}/user/delete-pr`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);

                axios({
                    method: "put",
                    url: myurl,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        setDisable(true);
                        fetchData();
                    } else {
                        toast.error(response?.data?.message);
                    }
                }).catch((error) => {
                    toast.error("Something went wrong");
                });
            }
        });
    };

    const handleDonwloadPDf = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('print_date', true);
        bodyFormData.append('search', search);
        bodyFormData.append('tag_number', 9);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadPdf({ apiMethod: 'post', url: 'pdf-ms-trans-download', body: bodyFormData });
    }

    const handleDownloadXlsx = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('print_date', true);
        bodyFormData.append('search', search);
        bodyFormData.append('tag_number', 9);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadXlsx({ apiMethod: 'post', url: 'xlsx-ms-trans-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
        setSearch('');
        setFilter({
            date: {
                start: null,
                end: null
            }
        })
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleDownload = (id) => {
        setPayload({
            id: id,
            'print_date': false
        })
        setStartDownload(true);
    };


    const getStatusLabel = (status) => {
        switch (status) {
            case 1:
                return <span className="custom-badge status-orange">Pending</span>
            case 2:
                return 'In Progress';
            case 3:
                return 'Completed';
            case 4:
                return <span className="custom-badge status-green">Approved</span>
            default:
                return 'Unknown';
        }
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
                                        <Link to="/main-store/user/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">Purchase Request</li>
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
                                                        <h3>Purchase Request</h3>
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
                                                                        <img src="/assets/img/icons/search-normal.svg" alt="firm-searchBox" />
                                                                    </a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <Link to="/main-store/user/manage-purchase-request" className="btn btn-primary add-pluss ms-2"
                                                                    data-toggle="tooltip" data-placement="top" title="Add">
                                                                    <img src="/assets/img/icons/plus.svg" alt="plus-icon" />
                                                                </Link>
                                                                <button type="button" onClick={handleRefresh} className="btn btn-primary doctor-refresh ms-2"
                                                                    data-toggle="tooltip" data-placement="top" title="Refresh">
                                                                    <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary doctor-refresh ms-2"
                                                                    onClick={() => setOpenFilter(!openFilter)}
                                                                    aria-controls="filter-inputs"
                                                                    aria-expanded={openFilter}
                                                                >
                                                                    <i className="fas fa-filter"></i>
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                                <FilterComponent
                                                    handleDateChange={handleDateChange}
                                                    handleDownloadPdf={handleDonwloadPDf}
                                                    handleDownloadXlsx={handleDownloadXlsx}
                                                    openFilter={openFilter}
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        {/* <th>Sr No.</th>
                                                        <th className="right-align">Order Date</th>
                                                        <th className="right-align" >Voucher No.</th>
                                                        <th className="right-align" >Bill No.</th>
                                                        <th>Party Name.</th>
                                                        <th>Project Name </th>
                                                        <th>Net Amount</th>
                                                        <th className="right-align" >Items</th>
                                                        <th className="text-end">Action</th> */}
                                                        <th>Sr No.</th>
                                                        <th className="right-align">PR Date</th>
                                                        <th className="right-align">PR No.</th>
                                                        <th>Site Location</th>
                                                        <th>Store Location</th>
                                                        <th>Department</th>
                                                        <th>Prepared By</th>
                                                        <th>Approved By</th>
                                                        <th>Item Count</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td className="right-align">{moment(elem.trans_date).format('YYYY-MM-DD')}</td>
                                                            <td className="right-align">{elem.voucher_no}</td>
                                                            <td>{elem.site_location || '-'}</td>
                                                            <td>{elem.store_location || '-'}</td>
                                                            <td>{elem.department || '-'}</td>
                                                            <td>{elem?.prepare_by?.name || '-'}</td>
                                                            <td>{elem?.approve_by?.name || '-'}</td>
                                                            <td>{elem.item_count || 0}</td>
                                                            <td>{getStatusLabel(elem.status)}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a
                                                                        href="#"
                                                                        className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown"
                                                                        aria-expanded="false"
                                                                    >
                                                                        <i className="fa fa-ellipsis-v"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type="button" className="dropdown-item" onClick={() => navigate(`/main-store/user/view-purchase-request`, { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i> View
                                                                        </button>
                                                                        {elem.status !== 4 && (
                                                                            <>
                                                                                <button type="button" className="dropdown-item" onClick={() => navigate(`/main-store/user/edit-purchase-request-manage`, { state: elem })}>
                                                                                    <i className="fa-solid fa-pen-to-square m-r-5"></i> Edit
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    className="dropdown-item"
                                                                                    onClick={() => handleDelete(elem?._id, elem.voucher_no)}
                                                                                >
                                                                                    <i className="fa fa-trash-alt m-r-5"></i> Delete
                                                                                </button>

                                                                            </>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item d-flex align-items-center"
                                                                            onClick={() => handleDownload(elem?._id, elem.voucher_no)}
                                                                        >
                                                                            <i className="fa-solid fa-download"></i> Download Report
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </td>
                                                        </tr>
                                                    )}
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
                </div>
            </div>
            {startDownload &&
                <PDFDownload
                    method="POST"
                    url="/user/pr-download-pdf"
                    payload={payload}
                />}
        </div>
    );
};
export default GetPurchaseRequest;
