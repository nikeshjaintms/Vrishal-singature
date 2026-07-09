import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getIssueReturn } from "../../../../Store/Store/MainStore/IssueReturn/GetIssueReturn";
import { DownloadPdf } from "../../../Store/Components/DownloadPdf";
import { DownloadXlsx } from "../../../Store/Components/DownloadXlsx";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import FilterComponent from "../../../Store/Transaction/FilterComponent";
import Loader from "../../Include/Loader";
import { getAdmiIssueReturn } from "../../../../Store/Admin/Transaction/GetAdminIssueReturn";

const IssueReturn = () => {
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [filter, setFilter] = useState({
        date: {
            start: null,
            end: null
        }
    });
    const [openFilter, setOpenFilter] = useState(false)

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("tag_number", 14);
        bodyFormData.append("search", search);
        bodyFormData.append("filter", JSON.stringify(filter));
        dispatch(getAdmiIssueReturn({ formData: bodyFormData }));
        setDisable(false);
    };

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        fetchData()
    }, [navigate, disable, filter, search]);

    const entity = useSelector((state => state?.getAdmiIssueReturn?.user?.data))

    const commentsData = useMemo(() => {
        let computedComments = entity;
        // if (search) {
        //     computedComments = computedComments.filter((pro) =>
        //         pro.project?.name?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //         pro.voucher_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //         pro.bill_no?.toString()?.toLowerCase()?.includes(search.toLowerCase())
        //     );
        // }
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

    const handleDownloadPdf = (id) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', id);
        bodyFormData.append('print_date', true);
        DownloadPdf({ apiMethod: 'post', url: 'isr-download-pdf', body: bodyFormData, is_admin: true });
    }
    const handleSDDownloadPdf = (id) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', id);
        bodyFormData.append('print_date', true);
        DownloadPdf({ apiMethod: 'post', url: 'isr-sort-download-pdf', body: bodyFormData, is_admin: true });
    }
    const handleLDDownloadPdf = (id) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', id);
        bodyFormData.append('print_date', true);
        DownloadPdf({ apiMethod: 'post', url: 'isr-long-download-pdf', body: bodyFormData, is_admin: true })
    }

    const handleDownloadAllPdf = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('print_date', true);
        bodyFormData.append('search', search);
        bodyFormData.append('tag_number', 14);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadPdf({ apiMethod: 'post', url: 'pdf-ms-trans-download', body: bodyFormData });
    }

    const handleDownloadXlsx = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('print_date', true);
        bodyFormData.append('search', search);
        bodyFormData.append('tag_number', 14);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadXlsx({ apiMethod: 'post', url: 'xlsx-ms-trans-download', body: bodyFormData });
    }

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
                                    <li className="breadcrumb-item active">Issue Return </li>
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
                                                        <h3>Issue Return</h3>
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
                                                    handleDownloadPdf={handleDownloadAllPdf}
                                                    handleDownloadXlsx={handleDownloadXlsx}
                                                    openFilter={openFilter}
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        <th className="right-align">Issue Return Date</th>
                                                        <th className="right-align" >ISR NO.</th>
                                                        <th className="right-align" >Bill No.</th>
                                                        <th className="right-align" >Challan No.</th>
                                                        <th className="right-align" >GetPass No.</th>
                                                        <th>Party Name</th>
                                                        <th>Project Name </th>
                                                        <th className="right-align" >Items</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td className="right-align">{moment(elem.trans_date).format('YYYY-MM-DD')}</td>
                                                            <td className="right-align">{elem.voucher_no}</td>
                                                            <td className="right-align">{elem.bill_no}</td>
                                                            <td className="right-align">{elem.challan_no}</td>
                                                            <td className="right-align">{elem.get_pass_data?.get_pass_no}</td>
                                                            <td>{elem?.party_data?.name}</td>
                                                            <td>{elem?.project_data?.name}</td>
                                                            <td className="right-align">{elem.item_count}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate(`/admin/view-issue-return`, { state: elem })}><i
                                                                            className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button>
                                                                        {
                                                                            elem?.isexternal === false ? <button type='button' className="dropdown-item" onClick={() => handleDownloadPdf(elem?._id)}><i
                                                                                className="fa-solid fa-download m-r-5"></i> Download Report</button> : <>
                                                                                <button type='button' className="dropdown-item" onClick={() => handleSDDownloadPdf(elem?._id)}><i
                                                                                    className="fa-solid fa-download m-r-5"></i> Download S.D Report</button>
                                                                                <button type='button' className="dropdown-item" onClick={() => handleLDDownloadPdf(elem?._id)}><i
                                                                                    className="fa-solid fa-download m-r-5"></i> Download L.D Report</button>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="999">
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
        </div>
    )
}


export default IssueReturn