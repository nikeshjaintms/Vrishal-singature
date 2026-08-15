import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../../Include/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../Include/Loader'
import { Pagination, Search } from '../../Table'
import DropDown from '../../../../Components/DropDown'
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp'
import { QC } from '../../../../BaseUrl'
import { getUserMultiNdtMaster } from '../../../../Store/MutipleDrawing/MultiNDT/getUserMultiNdtMaster'
import { fetchNdtSummaryData } from "../../../../Store/Piping/Ndt/Summary/ndtsummary"

const NdtLotBook = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    const { offers, pagination, loading } = useSelector((state) => state.NdtSummary);

    useEffect(() => {
        const proId = localStorage.getItem("U_PROJECT_ID");
        if (proId) {
            dispatch(fetchNdtSummaryData({
                project_id: proId,
                currentPage,
                limit,
                search
            })).then(() => setDisable(false));
        }
    }, [dispatch, currentPage, limit, search]);

    const handleRefresh = () => {
        setSearch('');
        setCurrentPage(1);
        setDisable(true);
    }

    const renderNdtStatus = (required, added, accepted, status, isRtType = false) => {
        if (!required) return <span className="text-muted">-</span>;

        if (isRtType && [2, 3, 4].includes(status)) {
            return <span className="custom-badge status-pink">Rejected</span>;
        } else if (accepted) {
            return <span className="custom-badge status-green">Accepted</span>;
        } else if (added) {
            return <span className="custom-badge status-blue">Offered</span>;
        } else {
            return <span className="custom-badge status-orange">Pending</span>;
        }
    };

    const renderMainStatus = (elem) => {
        const tests = [
            { req: elem.bsrt_required, acc: elem.bsrt_accepted, status: elem.bsrt_status, isRtType: true },
            { req: elem.ft_required, acc: elem.ft_accepted },
            { req: elem.pwht_required, acc: elem.pwht_accepted },
            { req: elem.asrrt_required, acc: elem.asrrt_accepted, status: elem.asrrt_status, isRtType: true },
            { req: elem.rt_required, acc: elem.rt_accepted, status: elem.rt_status, isRtType: true },
            { req: elem.mpt_required, acc: elem.mpt_accepted },
            { req: elem.lpt_required, acc: elem.lpt_accepted },
            { req: elem.ht_required, acc: elem.ht_accepted },
            { req: elem.pmi_required, acc: elem.pmi_accepted },
            { req: elem.pickling_required, acc: elem.pickling_accepted }
        ];

        let anyRequired = false;
        let anyRejected = false;

        for (let i = 0; i < tests.length; i++) {
            if (tests[i].req) {
                anyRequired = true;
                if (tests[i].isRtType && [2, 3, 4].includes(tests[i].status)) {
                    anyRejected = true;
                }
            }
        }

        if (!anyRequired) return <span className="text-muted">-</span>;

        if (anyRejected) {
            return <span className="custom-badge status-pink">Rejected</span>;
        }

        for (let i = 0; i < tests.length; i++) {
            if (tests[i].req && !tests[i].acc) {
                return <span className="custom-badge status-orange">Pending</span>;
            }
        }

        return <span className="custom-badge status-green">Completed</span>;
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const totalItems = pagination?.totalRecords || 0;

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">NDT Summary</li>
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
                                                        <h3>NDT Summary</h3>
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
                                                    <DropDown limit={limit} onLimitChange={(val) => {
                                                        setlimit(val);
                                                        setCurrentPage(1);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Drawing No.</th>
                                                        <th>Rev.</th>
                                                        <th>Spool No</th>
                                                        <th>Joint No</th>
                                                        <th>Joint Type</th>
                                                        <th>Piping Class</th>
                                                        <th>Service</th>
                                                        <th>BSRT</th>
                                                        <th>FERRITE</th>
                                                        <th>PWHT</th>
                                                        <th>ASRT</th>
                                                        <th>RT</th>
                                                        <th>MPT</th>
                                                        <th>LPT</th>
                                                        <th>HT</th>
                                                        <th>PMI</th>
                                                        <th>Pickling</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {offers?.map((elem, i) => {
                                                        return (
                                                            <tr key={elem._id}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem.drawing_no}</td>
                                                                <td>{elem.rev}</td>
                                                                <td>{elem.spool_no}</td>
                                                                <td>{elem.joint_no}</td>
                                                                <td>{elem.joint_type}</td>
                                                                <td>{elem.piping_class}</td>
                                                                <td>{elem.service}</td>
                                                                <td>{renderNdtStatus(elem.bsrt_required, elem.bsrt_added, elem.bsrt_accepted, elem.bsrt_status, true)}</td>
                                                                <td>{renderNdtStatus(elem.ft_required, elem.ft_added, elem.ft_accepted)}</td>
                                                                <td>{renderNdtStatus(elem.pwht_required, elem.pwht_added, elem.pwht_accepted)}</td>
                                                                <td>{renderNdtStatus(elem.asrrt_required, elem.asrrt_added, elem.asrrt_accepted, elem.asrrt_status, true)}</td>
                                                                <td>{renderNdtStatus(elem.rt_required, elem.rt_added, elem.rt_accepted, elem.rt_status, true)}</td>
                                                                <td>{renderNdtStatus(elem.mpt_required, elem.mpt_added, elem.mpt_accepted)}</td>
                                                                <td>{renderNdtStatus(elem.lpt_required, elem.lpt_added, elem.lpt_accepted)}</td>
                                                                <td>{renderNdtStatus(elem.ht_required, elem.ht_added, elem.ht_accepted)}</td>
                                                                <td>{renderNdtStatus(elem.pmi_required, elem.pmi_added, elem.pmi_accepted)}</td>
                                                                <td>{renderNdtStatus(elem.pickling_required, elem.pickling_added, elem.pickling_accepted)}</td>
                                                                <td>{renderMainStatus(elem)}</td>


                                                            </tr>
                                                        );
                                                    })}

                                                    {offers?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="99">
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
                                                    aria-live="polite">Showing {Math.min(limit * currentPage, totalItems)} from {totalItems} data</div>
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


export default NdtLotBook