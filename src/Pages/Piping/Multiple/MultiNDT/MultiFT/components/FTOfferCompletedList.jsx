import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserFtAdded } from '../../../../../../Store/Piping/Ndt/FT/FTOfferadded';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import Loader from '../../../../Include/Loader';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { PdfDownloadErp } from '../../../../../../Components/ErpPdf/PdfDownloadErp';


const FTOfferCompletedList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        dispatch(getUserFtAdded({ page: currentPage, limit: limit, search: search }));
    }, [dispatch, currentPage, limit, search]);

    const entity = useSelector((state) => state.getUserFtAdded?.user?.data);
    const totalCount = useSelector((state) => state.getUserFtAdded?.user?.pagination?.totalItems || 0);

    useEffect(() => {
        setTotalItems(totalCount);
    }, [totalCount]);

    const commentsData = useMemo(() => {
        if (!entity) return [];
        let filteredData = entity;

        if (search) {
            filteredData = entity.filter(item =>
                item?.report_no?.toLowerCase().includes(search.toLowerCase())
            );
        }

        return filteredData.map(report => {
            const drawings = new Set();
            const spools = new Set();

            // Extract items based on nested structure
            let itemsToProcess = [];
            if (Array.isArray(report.items)) {
                if (report.items[0] && Array.isArray(report.items[0].items)) {
                    // Double nested structure: { items: [{ items: [...] }] }
                    itemsToProcess = report.items[0].items;
                } else {
                    // Single nested structure: { items: [...] }
                    itemsToProcess = report.items;
                }
            }

            itemsToProcess.forEach(i => {
                if (i.drawing_no) drawings.add(i.drawing_no);
                if (i.spool_no) spools.add(i.spool_no);
            });

            return {
                ...report,
                drawing_no: Array.from(drawings).join(', ') || '-',
                spool_no: Array.from(spools).join(', ') || '-'
            };
        });
    }, [entity, search]);

    const handleDownloadOffer = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no', elem.report_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-one-multi-ft-offer', body: bodyFormData });
    }

    const handleRefresh = () => {
        setSearch("");
        setCurrentPage(1);
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card card-table show-entire">
                        <div className="card-body">

                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Completed FT Offer List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form onSubmit={(e) => e.preventDefault()}>
                                                        <Search
                                                            key={refreshTrigger}
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

                            {/* {disable === false ?
                                <> */}
                            <div className="table-responsive">
                                <table className="table border-0 custom-table comman-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Drawing No.</th>
                                            <th>Spool No.</th>
                                            <th>Test Offer No.</th>
                                            <th>Offer Date</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={elem?._id}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                <td>{elem?.drawing_no || '-'}</td>
                                                <td>{elem?.spool_no || '-'}</td>
                                                <td>{elem?.report_no || '-'}</td>
                                                <td>{elem?.createdAt ? moment(elem?.createdAt).format('YYYY-MM-DD HH:mm') : '-'}</td>
                                                <td className='status-badge'>
                                                    {elem.status === 1 ? (
                                                        <span className="custom-badge status-orange">Pending</span>
                                                    ) : elem.status === 2 ? (
                                                        <span className="custom-badge status-green">Accepted</span>
                                                    ) : elem.status === 3 ? (
                                                        <span className="custom-badge status-pink">Rejected</span>
                                                    ) : elem.status === 4 ? (
                                                        <span className="custom-badge status-purple">Partially</span>
                                                    ) : '-'}
                                                </td>
                                                <td className="text-end">
                                                    <div className="dropdown dropdown-action">
                                                        <a href="#" className="action-icon dropdown-toggle"
                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                className="fa fa-ellipsis-v"></i></a>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            {/* <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-rt-offer', { state: elem })}><i
                                                                className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                Edit</button> */}
                                                            <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>
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
                                        aria-live="polite">Showing {totalItems > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalItems)} of {totalItems} entries</div>
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
                            {/* </>
                                : <Loader />} */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FTOfferCompletedList