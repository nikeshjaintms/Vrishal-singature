import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import Loader from '../../../Include/Loader';
import { Pagination, Search } from '../../../Table';
import { QC } from '../../../../../BaseUrl';
import { BadgeCheck, X } from 'lucide-react';
import moment from 'moment';
import DropDown from '../../../../../Components/DropDown';
import { getUserPicklingAdded } from '../../../../../Store/Piping/Ndt/Pickling/PicklingOfferadded';

const MultiPicklingPassivationClearance = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
  

    const [totalItems1, setTotalItems1] = useState(0);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
  

    useEffect(() => {
       
            dispatch(getUserPicklingAdded({ status: true }));
           
      
    }, []);

    useEffect(() => {
        dispatch(getUserNdtMaster({ status: true })).then((response) => {
            const ndtData = response.payload?.data;
            const findNdt = ndtData?.find((nt) => nt?.name === 'LPT');
            if (findNdt) {
                dispatch(getMultiNdtOffer({ status: 2, type: findNdt._id }));
               
            }
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, []);

    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);
    const entity2 = useSelector((state) => state.getUserPicklingAdded?.user?.data);
    console.log(entity2, 'entity2');

    const commentsData = useMemo(() => {
        let itemsData = entity2 || [];
        const groups = {};

        itemsData.forEach(item => {
            if (item.status === 1) {
                const reportNo = item.report_no;
                if (!groups[reportNo]) {
                    groups[reportNo] = {
                        ...item,
                        spool_nos: new Set(),
                        joint_nos: new Set(),
                        drawing_nos: new Set(),
                        items: []
                    };
                }
                if (item.spool_no) groups[reportNo].spool_nos.add(item.spool_no);
                if (item.joint_no) groups[reportNo].joint_nos.add(item.joint_no);
                if (item.drawing_no) groups[reportNo].drawing_nos.add(item.drawing_no);
                groups[reportNo].items.push(item);
            }
        });

        let computedComments = Object.values(groups).map(group => ({
            ...group,
            drawing_no_display: Array.from(group.drawing_nos).join(', '),
            spool_no_display: Array.from(group.spool_nos).join(', '),
            joint_no_display: Array.from(group.joint_nos).join(', ')
        }));

        if (search) {
            computedComments = computedComments.filter(
                (i) =>
                    i?.report_no?.toString()?.toLowerCase().includes(search?.toLowerCase()) ||
                    i?.drawing_no_display?.toLowerCase().includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity2]);

    const commentsData2 = useMemo(() => {
        let itemsData = entity2 || [];
        const groups = {};

        itemsData.forEach(item => {
            if ([2, 3, 4].includes(item.status)) {
                const reportNo = item.report_no;
                if (!groups[reportNo]) {
                    groups[reportNo] = {
                        ...item,
                        spool_nos: new Set(),
                        joint_nos: new Set(),
                        drawing_nos: new Set(),
                        items: []
                    };
                }
                if (item.spool_no) groups[reportNo].spool_nos.add(item.spool_no);
                if (item.joint_no) groups[reportNo].joint_nos.add(item.joint_no);
                if (item.drawing_no) groups[reportNo].drawing_nos.add(item.drawing_no);
                groups[reportNo].items.push(item);
            }
        });

        let computedComments = Object.values(groups).map(group => ({
            ...group,
            drawing_no_display: Array.from(group.drawing_nos).join(', '),
            spool_no_display: Array.from(group.spool_nos).join(', '),
            joint_no_display: Array.from(group.joint_nos).join(', ')
        }));

        if (search1) {
            computedComments = computedComments.filter(
                (i) =>
                    i?.report_no?.toString()?.toLowerCase().includes(search1?.toLowerCase()) ||
                    i?.drawing_no_display?.toLowerCase().includes(search1?.toLowerCase())
            );
        }
        setTotalItems1(computedComments?.length);
        return computedComments?.slice(
            (currentPage1 - 1) * limit1,
            (currentPage1 - 1) * limit1 + limit1
        );
    }, [currentPage1, search1, limit1, entity2]);

    const handleRefresh = () => {
        setSearch('');
      
    }

    const handleRefresh1 = () => {
        setSearch1('');
       
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no', elem.report_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-pickling-inspection', body: bodyFormData });
    }
    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Pickling Passivation Testing Clearance List", active: false },
                    ]} />

                 
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Pickling Passivation Testing Offering List</h3>
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
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Off. Report No.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Spool No. </th>
                                                        <th>Off. By</th>
                                                        <th>Date</th>
                                                        <th>Verify</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
                                                            <td>
                                                                {elem?.items
                                                                    ?.map((e) => e?.drawing_no)
                                                                    .filter(
                                                                    (value, index, self) =>
                                                                        self.indexOf(value) === index,
                                                                    )
                                                                    .map((value, index) => (
                                                                    <span key={index}>
                                                                        {value}
                                                                        <br />
                                                                    </span>
                                                                    )) || "-"}
                                                            </td>
                                                            <td>
                                                                {elem?.items
                                                                    ?.map((e) => e?.spool_no)
                                                                    .filter(
                                                                    (value, index, self) =>
                                                                        self.indexOf(value) === index,
                                                                    )
                                                                    .map((value, index) => (
                                                                    <span key={index}>
                                                                        {value}
                                                                        <br />
                                                                    </span>
                                                                    )) || "-"}
                                                            </td>
                                                            <td>{elem?.offered_by?.name}</td>
                                                            <td>{elem?.offer_date ? moment(elem?.offer_date).format('YYYY-MM-DD') : '-'}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/piping/user/manage-pickling-passivation-clearance', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : <X />}
                                                                </td>
                                                            )}
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : elem.status === 4 ? (
                                                                    <span className="custom-badge status-purple">Partially</span>
                                                                ) : null}
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
                   

                   
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Pickling Passivation Testing Clearance List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch1(value);
                                                                            setCurrentPage1(1);
                                                                        }} />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh1}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        <th>Off. Report No.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Spool No. </th>
                                                        <th>Qc. By</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th className='text-end'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData2?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
                                                            <td>{elem?.report_no_two}</td>
                                                            <td>{elem?.report_no}</td>
                                                            <td>
                                                            {elem?.items
                                                                ?.map((e) => e?.drawing_no)
                                                                .filter(
                                                                (value, index, self) =>
                                                                    self.indexOf(value) === index,
                                                                )
                                                                .map((value, index) => (
                                                                <span key={index}>
                                                                    {value}
                                                                    <br />
                                                                </span>
                                                                )) || "-"}
                                                            </td>
                                                            <td>
                                                            {elem?.items
                                                                ?.map((e) => e?.spool_no)
                                                                .filter(
                                                                (value, index, self) =>
                                                                    self.indexOf(value) === index,
                                                                )
                                                                .map((value, index) => (
                                                                <span key={index}>
                                                                    {value}
                                                                    <br />
                                                                </span>
                                                                )) || "-"}
                                                            </td>
                                                            <td>{elem?.qc_by?.name}</td>
                                                            <td>{elem?.qc_date ? moment(elem.qc_date).format('YYYY-MM-DD') : '-'}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : elem.status === 2 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : elem.status === 4 ? (
                                                                    <span className="custom-badge status-purple">Partially</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        {/* <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-pickling-passivation-clearance', { state: elem })}><i
                                                                            className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button> */}
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)}>
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>

                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData2?.length === 0 ? (
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
                                                    aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems1}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        onPageChange={(page) => setCurrentPage1(page)}
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

export default MultiPicklingPassivationClearance