import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { getPurchaseReturn } from '../../../../Store/Store/MainStore/PurchaseReturn/GetPurchaseReturn';
import { DownloadPdf } from '../../../Store/Components/DownloadPdf';
import { DownloadXlsx } from '../../../Store/Components/DownloadXlsx';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import FilterComponent from '../../../Store/Transaction/FilterComponent';
import Loader from '../../Include/Loader';
import PDFDownload from '../../../../Components/DownloadFormat/PDFDownload';
import { getAdminPUR } from '../../../../Store/Admin/Transaction/GetAdminPurchaseReturn';

const PurchaseReturn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [disable, setDisable] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({
        date: {
            start: null,
            end: null
        }
    });
    const [limit, setlimit] = useState(10);
    const [openFilter, setOpenFilter] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [startDownload, setStartDownload] = useState(false);
    const [payload, setPayload] = useState(null);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("tag_number", 12);
        bodyFormData.append("search", search);
        bodyFormData.append("filter", JSON.stringify(filter));
        dispatch(getAdminPUR({ formData: bodyFormData }))
        setDisable(false);
    };

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        fetchData()
    }, [navigate, disable, filter, search]);

    const entity = useSelector((state) => state?.getAdminPurchaseReturn?.user?.data);
    const commentsData = useMemo(() => {
        let computedComments = entity;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleDownload = (id) => {
        setPayload({
            id: id,
            'print_date': true,
        })
        setStartDownload(true);
    };
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
                                    <li className="breadcrumb-item active">Purchase Recieving</li>
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
                                                        <h3>Purchase Recieving</h3>
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
                                                    openFilter={openFilter}
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr No.</th>
                                                        <th className="right-align">PUR Date</th>
                                                        <th className="right-align" >PUR NO.</th>
                                                        <th className="right-align" >Bill No.</th>
                                                        <th className="right-align">Challan No.</th>
                                                        <th>Party Name.</th>
                                                        <th>Project Name </th>
                                                        <th className="right-align">Items</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td className="right-align">{moment(elem?.trans_date).format('YYYY-MM-DD')}</td>
                                                            <td className="right-align">{elem?.voucher_no}</td>
                                                            <td className="right-align">{elem?.bill_no || "-"}</td>
                                                            <td className="right-align">{elem?.challan_no || "-"}</td>
                                                            <td>{elem?.party_data?.name}</td>
                                                            <td>{elem?.project_data?.name}</td>
                                                            <td className="right-align">{elem?.item_count}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate(`/admin/view-purchase-return`, { state: elem })}><i
                                                                            className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload(elem?._id)} ><i className="fa-solid fa-download"></i> Download Report</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {commentsData?.length === 0 || commentsData === undefined ? (
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
            {startDownload &&
                <PDFDownload
                    method="POST"
                    url="/admin/pur-download-pdf"
                    payload={payload}
                    is_admin={true}
                />}
        </div >
    )
}

export default PurchaseReturn