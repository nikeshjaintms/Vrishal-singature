import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import moment from 'moment';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';

const ViewMultiIssueAcc = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [acc, setAcc] = useState({ reqId: '' });
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const data = location.state;

    useEffect(() => {
        if (location.state?._id) {
            setAcc({
                reqId: location.state?.issue_req_id?._id,
            });
            setTableData(location?.state?.items || []);
        }
    }, [location.state]);

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            computedComments = computedComments.filter(
                (i) =>
                    i?.drawing_id?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.transaction_id?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.transaction_id?.item_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.transaction_id?.grid_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, tableData]);

 

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
                    <PageHeader breadcrumbs={
                        [
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Issue Acceptance List", link: "/user/project-store/issue-management", active: false },
                            { name: "Issue Acceptance", active: true }
                        ]
                    } />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Issue Acceptance List</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="staff-search-table">
                                        <form>
                                            <div className='row'>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Iusse Request No. <span className="login-danger">*</span></label>
                                                        <input type='text' className='form-control' value={data?.issue_req_id?.issue_req_no} readOnly />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Iusse Acc. No. <span className="login-danger">*</span></label>
                                                        <input type='text' className='form-control' value={data?.issue_accept_no} readOnly />
                                                    </div>
                                                </div>

                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Issued Acceptance No.</label>
                                                            <input className='form-control' value={data?.issue_accept_no} readOnly />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Issued By </label>
                                                            <input className='form-control' value={data?.issued_by?.user_name} readOnly />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Issued Date </label>
                                                            <input className='form-control' value={moment(data?.createdAt).format('YYYY-MM-DD')} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Material Issue Requested List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    setCurrentPage(1);
                                                                }} />
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive mt-2">
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Drawing No.</th>
                                                    <th>Rev</th>
                                                    <th>Assembly No.</th>
                                                    <th>Assembly Qty.</th>
                                                    <th>Section Details</th>
                                                    <th>Issued Qty.</th>
                                                    <th>Issued Width</th>
                                                    <th>Issued Length</th>
                                                    <th>Imir No.</th>
                                                    <th>Heat No.</th>
                                                    <th>Grid Qty.</th>
                                                    <th>Grid Bal. Qty.</th>
                                                    <th>Grid Used Qty.</th>
                                                    <th>Status</th>
                                                    <th>Remarks</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        <td>{elem?.drawing_id?.drawing_no}</td>
                                                        <td>{elem?.drawing_id?.rev}</td>
                                                        <td>{elem?.drawing_id?.assembly_no}</td>
                                                        <td>{elem?.drawing_id?.assembly_quantity}</td>
                                                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                        <td>{elem?.issued_qty}</td>
                                                        <td>{elem?.issued_width || '-'}</td>
                                                        <td>{elem?.issued_length || '-'}</td>
                                                        <td>{elem?.imir_no}</td>
                                                        <td>{elem?.heat_no}</td>
                                                        <td>{elem?.grid_item_id?.grid_id?.grid_qty}</td>
                                                        <td>{elem?.iss_balance_grid_qty}</td>
                                                        <td>{elem?.iss_used_grid_qty}</td>
                                                        <td className='status-badge'>
                                                            {elem.is_accepted === true ? (
                                                                <span className="custom-badge status-green">Acc</span>
                                                            ) : elem.is_accepted === false ? (
                                                                <span className="custom-badge status-pink">Rej</span>
                                                            ) : (
                                                                <span className="">-</span>
                                                            )}
                                                        </td>
                                                        <td>{elem?.remarks || '-'}</td>
                                                        <td>{moment(elem?.createdAt).format('YYYY-MM-DD')}</td>
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
                </div>
            </div>
        </div>
    )
}

export default ViewMultiIssueAcc