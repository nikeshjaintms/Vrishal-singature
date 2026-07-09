import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Pagination, Search } from '../../Table';
import { PLAN } from '../../../../BaseUrl';
import Footer from '../../Include/Footer';
// import { getMultiPackingList } from '../../../../Store/MutipleDrawing/MultiPacking/GetMultiPackingList';
import { getMultiPackingPipingList } from '../../../../Store/Piping/MultiPacking/GetMultiPackingPipingList';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import DropDown from '../../../../Components/DropDown';
import Loader from '../../Include/Loader';

const MultiPacking = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(
            getMultiPackingPipingList({
                page: currentPage,
                limit,
                search,
            })
        );
    }, [dispatch, currentPage, limit, search]);


    const entity = useSelector((state) => state?.getMultiPackingPipingList?.user?.data?.data);
    

    const commentsData = useMemo(() => {
        let computedComments = entity || [];
        if (search) {
            computedComments = computedComments.filter(
                (it) =>
                    it.voucher_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    it.consignment_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    it?.items?.some(item => item?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())) ||
                    it?.items?.some(item => item?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase()))
            );
        }


        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('voucher_no', elem?.voucher_no);
        PdfDownloadErp({ apiMethod: 'post', url: 'piping/download-multi-packing', body: bodyFormData });
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Packing List</li>
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
                                                        <h3>Packing List</h3>
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
                                                                {
                                                                    localStorage.getItem("ERP_ROLE") === PLAN ? <Link to="/piping/user/manage-packing"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link> : ""
                                                                }
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 ">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No</th>
                                                        <th>Consignment No</th>
                                                        <th>Line No. / Drawing No</th>
                                                        <th>Spool No / Item</th>
                                                        <th>Packed By</th>
                                                        <th>Date</th>
                                                        {/* <th>Status</th> */}
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.voucher_no}</td>
                                                            <td>{elem?.consignment_no}</td>
                                                            {/* <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.drawing_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td> */}
                                                            <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.drawing_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                            <td>
                                                                {elem?.items
                                                                ?.map(item => item.item_name || item.spool_no)
                                                                .filter((value, index, self) => self.indexOf(value) === index)
                                                                .join(", ") || "-"}
                                                            </td>
                                                            <td>{elem?.packed_by}</td>
                                                            <td >{moment(elem?.createdAt).format('YYYY-MM-DD  HH:mm')}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/view-packing', { state: { elem: elem } })}><i className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button>
                                                                        <button type='button' className="dropdown-item"
                                                                            onClick={() => handleDownloadIns(elem)}
                                                                        >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
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

export default MultiPacking