import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { M_STORE } from "../../../../BaseUrl";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../../../Store/Store/Item/Item";
import OrderModal from "../../../../Components/Transaction/OrderModal";
import { getSingleOrder } from "../../../../Store/Store/Order/GetSingleOrder";
import { Pagination, Search } from "../../Table";
import Loader from "../../Include/Loader";
import { getPurchaseReturnItems } from "../../../../Store/Store/MainStore/PurchaseReturn/GetPurchaseReturnItems";

const ViewPurchaseReturn = () => {
    const location = useLocation();
    const data = location.state
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
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            dispatch(getPurchaseReturnItems({ id: data._id }))
            setDisable(false)
        }
        dispatch(getItem());
    }, [navigate, disable]);

    const getSinglePurchase = useSelector((state) => state?.getPurchaseReturnItems?.data?.data)
    const itemApiData = useSelector((state) => state?.getItem?.user?.data);

    const handleClose = () => setShow(false);

    const handleRefresh = () => {
        setDisable(true);
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const commentsData = useMemo(() => {
        let computedComments = getSinglePurchase?.items_details;

        if (search) {
            computedComments = computedComments.filter((pro) =>
                pro.item_name?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, getSinglePurchase]);
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
                                        Purchase Return Items
                                    </li>
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
                                                    {/* <DropDown
                                                    limit={limit}
                                                    onLimitChange={(val) => setlimit(val)}
                                                /> */}
                                                </div>
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
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((row, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            <td>{rowIndex + 1}</td>
                                                            {headerKeys.map((key, colIndex) => (
                                                                <td key={colIndex}>{row[headers[key]]}</td>
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
                                                onClick={() => navigate('/main-store/user/purchase-return-management')}
                                            >
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
            <OrderModal
                show={show}
                handleClose={handleClose}
                itemApiData={itemApiData}
            />
        </div>
    )
}

export default ViewPurchaseReturn