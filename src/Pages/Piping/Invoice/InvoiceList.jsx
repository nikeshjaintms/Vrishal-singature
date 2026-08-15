import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../Include/Footer';
import { Pagination, Search } from '../Table';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInvoice } from '../../../Store/Erp/Invoice/Invoice';
import Loader from '../Include/Loader';
import DropDown from '../../../Components/DropDown';
import moment from 'moment';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';

const InvoiceList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (disable === true) {
            dispatch(getInvoice())
            setDisable(false);
        }
    }, [disable, dispatch]);

    const entity = useSelector((state) => state?.getInvoice?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;

        if (search) {
            computedComments = computedComments.filter(
                (invoice) =>
                    invoice?.invoice_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);


    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleDownload = (options) => {
        const { invoiceId, isExcel, isMultiple } = options;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('print_date', true);

        if (isMultiple) {
            bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            if (isExcel) {
                bodyFormData.append('partyVisible', false);
                bodyFormData.append('projectVisible', true);
                bodyFormData.append('lrNoVisible', true);
                bodyFormData.append('lrDateVisible', false);
                bodyFormData.append('transNameVisible', true);
                bodyFormData.append('vehicleVisible', true);
                bodyFormData.append('driverVisible', false);
            }
        } else {
            bodyFormData.append('id', invoiceId);
        }

        const url = isMultiple
            ? isExcel ? 'xlsx-all-invoice' : 'all-invoice-download'
            : isExcel ? 'xlsx-one-invoice' : 'one-invoice-download';

        PdfDownloadErp({
            apiMethod: 'post',
            url,
            body: bodyFormData
        });
    };
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Invoice/Bill List</li>
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
                                                        <h3>Invoice/Bill List</h3>
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
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <Link to="/piping/user/manage-invoice"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <div className="add-group">
                                                        <button type="button" onClick={() => handleDownload({
                                                            isExcel: false,
                                                            isMultiple: true,
                                                        })} className="btn w-100 btn btn-primary doctor-refresh me-2 h-100">
                                                            PDF <i className="fa-solid fa-download mx-2"></i>
                                                        </button>
                                                    </div>

                                                    <div className="add-group">
                                                        <button type="button" onClick={() => handleDownload({
                                                            isExcel: true,
                                                            isMultiple: true,
                                                        })} className="btn w-100 btn btn-primary doctor-refresh me-2 h-100">
                                                            XLSX <i className="fa-solid fa-download mx-2"></i>
                                                        </button>
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
                                                        <th>Invoice No.</th>
                                                        <th>Party</th>
                                                        <th>Transport</th>
                                                        <th>Vehicle No.</th>
                                                        <th>Date</th>
                                                        <th className='text-end'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.invoice_no}</td>
                                                            <td>{elem?.party_id?.name}</td>
                                                            <td>{elem?.transport_id?.name}</td>
                                                            <td>{elem?.vehicle_no}</td>
                                                            <td>{moment(elem?.invoice_date).format('YYYY-MM-DD')}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-invoice', { state: elem })}><i
                                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        <button type="button" className="dropdown-item" onClick={() => handleDownload({
                                                                            invoiceId: elem._id,
                                                                            isExcel: false,
                                                                            isMultiple: false,
                                                                        })}>
                                                                            <i className="fa-solid fa-download m-r-5"></i> Download PDF
                                                                        </button>
                                                                        <button type="button" className="dropdown-item" onClick={() => handleDownload({
                                                                            invoiceId: elem._id,
                                                                            isExcel: true,
                                                                            isMultiple: false,
                                                                        })}>
                                                                            <i className="fa-solid fa-download m-r-5"></i> Download XLSX
                                                                        </button>
                                                                        {/* <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.name)} ><i
                                                                            className="fa fa-trash-alt m-r-5"></i> Delete</button> */}
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
                <Footer />
            </div>
        </div >
    )
}

export default InvoiceList