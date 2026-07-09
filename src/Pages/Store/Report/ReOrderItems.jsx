import React, { useEffect, useMemo, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import { getReorderItems } from '../../../Store/Store/Report/ReOrderItems';
import toast from 'react-hot-toast';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import { DownloadPdf } from '../Components/DownloadPdf';
import { DownloadXlsx } from '../Components/DownloadXlsx';
import moment from 'moment';

const ReOrderItems = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        fetchData();
    }, [navigate, disable, search]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        dispatch(getReorderItems(bodyFormData))
        setDisable(false);
    }

    const entity = useSelector((state) => state?.getReorderItems?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const downloadPdf = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('print_date', true);
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadPdf({ apiMethod: 'post', url: 'reorder-item-download', body: bodyFormData });
    }

     const downloadExcel = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('print_date', true);
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadXlsx({ apiMethod: 'post', url: 'reorder-item-excel-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
        setSearch('');
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
                                    <li className="breadcrumb-item active">Re-Order Items List</li>
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
                                                        <h3>Re-Order Items List</h3>
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
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={downloadPdf}>PDF <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div>
                                                      <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={downloadExcel}>Excel <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div>
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Item</th>
                                                        <th>Unit</th>
                                                        <th>M Code</th>
                                                        <th>HSN Code</th>
                                                        <th>Re-Order Qty.</th>
                                                        <th>Bal. Qty.</th>
                                                        <th>Order Qty.</th>
                                                        <th colSpan={4} className='text-center'>Last Purchase</th>
                                                        <th className='text-center'>Last Issue</th>
                                                    </tr>
                                                    <tr>
                                                        <th colSpan={8}></th>
                                                        <th>Date</th>
                                                        <th>Party</th>
                                                        <th>Voucher No.</th>
                                                        <th>Rate</th>
                                                        <th>Date</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.item_name}</td>
                                                            <td>{elem?.unit}</td>
                                                            <td>{elem?.m_code}</td>
                                                            <td>{elem?.hsn_code}</td>
                                                            <td>{elem?.reorder_quantity}</td>
                                                            <td>{elem?.balance}</td>
                                                            <td>{elem?.order_qty}</td>
                                                            <td>{moment(elem?.lastPurchaseDate).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>{elem?.lastPurchaseParty}</td>
                                                            <td>{elem?.lastPurchaseVoucher}</td>
                                                            <td>{elem?.lastPurchaseRate}</td>
                                                            <td>{moment(elem?.lastIssueDate).format('YYYY-MM-DD HH:mm')}</td>

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
                <Footer />
            </div>
        </div>
    )
}

export default ReOrderItems