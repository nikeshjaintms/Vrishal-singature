import React, { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import moment from 'moment';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAdminDraw } from '../../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
const ViewMultiClearFitup = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const data = location.state;

    console.log(" xyz riya ni bhul data=====>",data);
    useEffect(() => {
        dispatch(getUserAdminDraw());
    }, []);
    const drawData = useSelector((state) => state?.getUserAdminDraw?.user?.data?.data);
    const getDrawing = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }
    const commentsData = useMemo(() => {
        let computedComments = data?.items || [];
        if (search) {
            computedComments = computedComments.filter((comment) =>
                comment?.grid_item_id?.item_name?.name?.toLowerCase().includes(search.toLowerCase()) ||
                comment?.grid_item_id?.grid_id?.grid_no?.toLowerCase().includes(search.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [search, limit, currentPage, data]);
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
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Fit-Up Clearance List", link: "/piping/user/fitup-clearance-management", active: false },
                        { name: `View Fit-Up Clearance`, active: true }
                    ]} />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Fit-Up Clearance Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {[
                                                { label: "Fitup Offer No.", value: data?.report_no },
                                                { label: "Fitup Ins. No.", value: data?.report_no_two },
                                                { label: "Inspected By", value: data?.qc_name?.user_name },
                                                { label: "Inspected Date", value: moment(data?.qc_time).format('YYYY-MM-DD HH:mm') },
                                            ].map(({ label, value }, index) => (
                                                <div key={index} className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>{label}<span className="login-danger">*</span></label>
                                                        <input value={value} className="form-control" readOnly />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </form>
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
                                                    <h3>Fitup Clearance Section List</h3>
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
                                                    <th>As. No.</th>
                                                    <th>As. Qty.</th>
                                                    <th>Section Details</th>
                                                    <th>Item No.</th>
                                                    <th>Quantity</th>
                                                    <th>Grid No.</th>
                                                    <th>Grid Qty.</th>
                                                    <th>Joint Type</th>
                                                    <th>Acc/Rej</th>
                                                    <th>WPS No.</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.drawing_no}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.rev}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.assembly_no}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.assembly_quantity}</td>
                                                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                        <td>{elem?.grid_item_id?.item_no}</td>
                                                        <td>{elem?.grid_item_id?.item_qty}</td>
                                                        <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                        <td>{elem?.fitOff_used_grid_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name)?.join(', ')}</td>
                                                        <td className='status-badge'>
                                                            {elem.is_accepted === true ? (
                                                                <span className="custom-badge status-green">Acc</span>
                                                            ) : elem.is_accepted === false ? (
                                                                <span className="custom-badge status-pink">Rej</span>
                                                            ) : (
                                                                <span className="">-</span>
                                                            )}
                                                        </td>
                                                        <td>{elem?.wps_no?.wpsNo}</td>
                                                        <td>{elem?.qc_remarks || '-'}</td>
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
                    <SubmitButton finalReq={data?.items} link={'/piping/user/fitup-clearance-management'} />
                </div>
                <Footer />
            </div>
        </div>
    )
}
export default ViewMultiClearFitup