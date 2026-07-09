import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getItemSummary } from '../../../Store/Store/Report/ItemSummary';
import { DownloadPdf } from '../Components/DownloadPdf';
import { DownloadXlsx } from '../Components/DownloadXlsx';
import toast from 'react-hot-toast';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import FilterComponent from '../Transaction/FilterComponent';

const PurchaseSummary = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
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
        } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        fetchData();
    }, [navigate, filter, disable, search]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('tag_number', 11);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        dispatch(getItemSummary(bodyFormData))
        setDisable(false);
    }

    const entity = useSelector((state) => state?.getItemSummary?.user?.data);

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
            };
            return newFilter;
        });
    };

    const downloadPdf = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('tag_number', 11);
        bodyFormData.append('print_date', true);
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadPdf({ apiMethod: 'post', url: 'item-summary-download', body: bodyFormData });
    }

        const downloadXlsx = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('tag_number', 11);
        bodyFormData.append('print_date', true);
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadXlsx({ apiMethod: 'post', url: 'item-summary-excel-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
        setFilter({
            date: {
                start: null,
                end: null
            }
        })
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Purchase Summary List</li>
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
                                                        <h3>Purchase Summary List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="firm-searchBox" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
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
                                                    handleDownloadPdf={downloadPdf}
                                                    // handleDownloadXlsx={DownloadXlsx}
                                                    handleDownloadXlsx={downloadXlsx}
                                                    openFilter={openFilter}
                                                    isPurchaseSummary={true}
                                                />
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Item</th>
                                                        <th>Category</th>
                                                        <th>Unit</th>
                                                        <th>M Code</th>
                                                        <th>Total Qty.</th>
                                                        <th>Total Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.item_name}</td>
                                                            <td>{elem?.category}</td>
                                                            <td>{elem?.unit}</td>
                                                            <td>{elem?.m_code}</td>
                                                            <td>{elem?.total_qty}</td>
                                                            <td>{elem?.total_amt}</td>
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
                <Footer />
            </div>
        </div>
    )
}

export default PurchaseSummary