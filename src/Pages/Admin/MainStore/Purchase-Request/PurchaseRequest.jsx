import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import FilterComponent from "../../../Store/Transaction/FilterComponent";
import Loader from "../../Include/Loader";
import PDFDownload from "../../../../Components/DownloadFormat/PDFDownload";
import { getAdminPR } from "../../../../Store/Admin/Transaction/GetAdminPurchaseRequest";

const PurchaseRequest = () => {
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
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        fetchData()
    }, [navigate, disable, filter, search]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("tag_number", 9);
        bodyFormData.append("search", search);
        bodyFormData.append("filter", JSON.stringify(filter));
        dispatch(getAdminPR({ formData: bodyFormData }));
        setDisable(false);
    };

    const entity = useSelector((state => state?.getAdminPurchaseRequest?.user?.data))

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
                                        <Link to="/admin/dashboard">Dashboard </Link>
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
                                                    openFilter={openFilter}
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
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
                                                                        <button type="button" className="dropdown-item" onClick={() => navigate(`/admin/view-purchase-request`, { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i> View
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="dropdown-item d-flex align-items-center"
                                                                            onClick={() => handleDownload(elem?._id)}
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
                    url="/admin/pr-download-pdf"
                    payload={payload}
                    is_admin={true}
                />}
        </div>
    );
};
export default PurchaseRequest;
