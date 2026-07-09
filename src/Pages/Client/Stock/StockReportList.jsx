import React, { useEffect, useMemo, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getStockReportList } from '../../../Store/Store/Stock/getStockReportList';
import Footer from '../Include/Footer';
import { Link } from 'react-router-dom';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import Loader from '../Include/Loader';
import moment from 'moment';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import { getReusableList } from '../../../Store/Store/Stock/getReusableList';

const StockReportList = () => {

    const dispatch = useDispatch();
    const [disable, setDisable] = useState(true)
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);

    useEffect(() => {
        if (disable === true) {
            dispatch(getStockReportList());
            dispatch(getReusableList());
            setDisable(false);
        }
    }, [disable, dispatch]);

    const entity = useSelector((state) => state.getStockReportList?.user?.data);
    const reusableData = useSelector((state) => state.getReusableList?.user?.data);


    const commentsData = useMemo(() => {
        if (!entity?.length) return [];

        const mergedData = entity.map((item) => {
            const match = reusableData?.find((reuse) =>
                item.itemId === reuse.item_id &&
                item.imir_no === reuse.imir_no &&
                item.material_po_no === reuse.material_po_no &&
                item.supplier_id === reuse.supplier_id &&
                item.manufacture_id === reuse.manufacture_id
            );

            if (match) {
                return {
                    ...item,
                    usableQty: match.usableQty,
                    is_use: true
                };
            } else {
                return {
                    ...item,
                    usableQty: '-',
                    is_use: false
                };
            }
        });

        let computedComments = mergedData;

        if (search) {
            computedComments = computedComments.filter(
                (st) =>
                    st.material_po_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    st.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    st.imir_no?.toString().toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity, reusableData]);

    console.log('commentsData',commentsData);

    const handleRefresh = () => {
        setDisable(true);
        setSearch('');
    }

    const handleDownload = (options) => {
        if (options?.iselxs) {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('print_date', true);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            PdfDownloadErp({ apiMethod: 'post', url: 'stock-list-xlsx', body: bodyFormData });
        } else {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('print_date', true);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            PdfDownloadErp({ apiMethod: 'post', url: `download-stock-list`, body: bodyFormData });
        }
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Stock List</li>
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
                                                        <h3>Stock List</h3>
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
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={() => { handleDownload({ ispdf: true }) }}> PDF <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div> */}
                                                    <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={() => { handleDownload({ iselxs: true }) }}> XLSX <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div>
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>SR.</th>
                                                        <th>MATERIAL PO No.</th>
                                                        <th>SUPPLIER</th>
                                                        <th>MANUFACTURER</th>
                                                        <th>SECTION DETAILS</th>
                                                        <th>GRADE</th>
                                                        <th>UNIT</th>
                                                        <th>PO QTY.</th>
                                                        <th>IMIR OFF. QTY.</th>
                                                        <th>IMIR OFF. DATE</th>
                                                        <th>IMIR OFF. LENGTH(MM)</th>
                                                        <th>IMIR OFF. WIDTH(MM)</th>
                                                        <th>IMIR OFF. NOS</th>
                                                        <th>IMIR HEAT NO.</th>
                                                        <th>INSPECTION QTY(KG)</th>
                                                        {/* <th>INSPECTION LENGTH(MM)</th> */}
                                                        {/* <th>INSPECTION WIDTH(MM)</th> */}
                                                        {/* <th>INSPECTION NOS</th> */}
                                                        {/* <th>INSPECTION HEAT NO.</th> */}

                                                        <th>HEAT NO</th>
                                                        <th>INSPECTED NOS</th>
                                                        <th>INSPECTED LENGTH(MM)</th>
                                                        <th>INSPECTED WIDTH(MM)</th>
                                                        <th>TC NO</th>

                                                        <th>INSPECTION DATE</th>
                                                        <th>REJECTED QTY(KG)</th>
                                                        <th>REJECTED LENGTH(MM)</th>
                                                        <th>REJECTED (NOS)</th>   {/* Name change WIDTH => NOS */}
                                                        <th>IMIR NO.</th>
                                                        <th>INVOICE NO.</th>
                                                        <th>ACTUAL QTY(KG)</th>
                                                        <th>ISSUED QTY(KG)</th>
                                                        <th>AVAILABLE QTY(KG)</th>
                                                        <th>REUSABLE QTY(KG)</th>
                                                        <th>GENERATE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.material_po_no}</td>
                                                            <td>{elem?.mainSupplierName || '-'}</td>
                                                            <td>{elem?.manufacture || '-'}</td>
                                                            <td>{elem?.name}</td>
                                                            <td>{elem?.material_grade || '-'}</td>
                                                            <td>{elem?.unit}</td>
                                                            <td>{elem?.po_qty}</td>
                                                            <td>{(elem?.offeredQty).toFixed(2)}</td>
                                                            <td>{elem?.offer_date ? moment(elem?.offer_date).format('YYYY-MM-DD hh:mm') : '-'}</td>
                                                            <td>{elem?.offerLength || '-'}</td>
                                                            <td>{elem?.offerWidth || '-'}</td>
                                                            <td>{elem?.offerNos || '-'}</td>
                                                            <td>{elem?.lot_no || '-'}</td>

                                                            <td>{(elem?.acceptedQty)?.toFixed(2) || '-'}</td>
                                                            {/* <td>{elem?.acceptedLength || '-'}</td> */}
                                                            {/* <td>{elem?.acceptedWidth || '-'}</td> */}
                                                            {/* <td>{elem?.acceptedNos || '-'}</td> */}
                                                            {/* <td>{elem?.accepted_lot_no}</td> */}

                                                            <td>
                                                                {elem?.heat_no_data?.map(h => <div key={h._id}>{h.heat_no}</div>) || '-'}
                                                            </td>
                                                            <td>
                                                                {elem?.heat_no_data?.map(h => <div key={h._id}>{h.inspected_nos}</div>) || '-'}
                                                            </td>
                                                            <td>
                                                                {elem?.heat_no_data?.map(h => <div key={h._id}>{h.inspected_length}</div>) || '-'}
                                                            </td>
                                                            <td>
                                                                {elem?.heat_no_data?.map(h => <div key={h._id}>{h.inspected_width}</div>) || '-'}
                                                            </td>
                                                            <td>
                                                                {elem?.heat_no_data?.map(h => <div key={h._id}>{h.tc_no}</div>) || '-'}
                                                            </td>

                                                            <td>{elem.inspection_date ? moment(elem.inspection_date).format('YYYY-MM-DD hh:mm') : '-'}</td>
                                                            <td>{(elem?.rejectedQty).toFixed(2)}</td>
                                                            <td>{elem?.rejected_length}</td>
                                                            <td>{elem?.rejected_width}</td>
                                                            <td>{elem?.imir_no || '-'}</td>
                                                            <td>{elem?.invoice_no || '-'}</td>
                                                            <td>{(elem?.acceptedQty)?.toFixed(2) || '-'}</td>
                                                            <td>{(elem?.issued_qty)?.toFixed(2) || '-'}</td>
                                                            <td>{(elem.balance_qty)?.toFixed(2)}</td>
                                                            <td>{elem?.usableQty || 0}</td>
                                                            <td>{elem?.is_use === true ? (
                                                                <span className='custom-badge status-green'>Generated</span>
                                                            ) : (
                                                                <span className='custom-badge status-orange'>No Use</span>
                                                            )}</td>
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

export default StockReportList;