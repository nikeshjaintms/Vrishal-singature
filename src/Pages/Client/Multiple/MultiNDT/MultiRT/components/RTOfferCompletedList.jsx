import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { PdfDownloadErp } from '../../../../../../Components/ErpPdf/PdfDownloadErp';

const RTOfferCompletedList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);

    // Data is already fetched by the parent MultiRtOffer component into this shared store
    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);

    const filteredComments = useMemo(() => {
        let computedComments = entity || [];
        // Show only completed: status 1 (Accepted) or 2 (Rejected)
        computedComments = computedComments.filter((rt) => rt.status === 1 || rt.status === 2);
        if (search) {
            const lowerSearch = search.toLowerCase();
            computedComments = computedComments.filter((rt) => {
                const drawingNos = rt?.items?.map(e => e?.drawing_no)?.filter(Boolean) || [];
                const spoolNos = rt?.items?.map(e => e?.spool_no)?.filter(Boolean) || [];
                const jointNos = rt?.items?.map(e => e?.joint_no)?.filter(Boolean) || [];
                return (
                    rt.offer_no?.toString().toLowerCase().includes(lowerSearch) ||
                    (rt.report_no && rt.report_no.toString().toLowerCase().includes(lowerSearch)) ||
                    drawingNos.some(d => d.toString().toLowerCase().includes(lowerSearch)) ||
                    spoolNos.some(s => s.toString().toLowerCase().includes(lowerSearch)) ||
                    jointNos.some(j => j.toString().toLowerCase().includes(lowerSearch))
                );
            });
        }
        return computedComments;
    }, [search, entity]);

    const totalItems = filteredComments.length;

    const commentsData = useMemo(() => {
        return filteredComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [filteredComments, currentPage, limit]);

    const handleDownloadOffer = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('ndt_offer_no', elem.offer_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-one-multi-ndt-offer', body: bodyFormData });
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
                                            <h3>Completed RT Offer List</h3>
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table border-0 custom-table comman-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Test Offer No.</th>
                                            <th>Report No.</th>
                                            <th>Drawing No.</th>
                                            <th>Spool No.</th>
                                            <th>Joint No.</th>
                                            <th>Material Specification</th>
                                            <th>Offer Date</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={elem?._id}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                <td>{elem?.offer_no || '-'}</td>
                                                <td>{elem?.report_no || '-'}</td>
                                                <td>{[...new Set(elem?.items?.map(e => e?.drawing_no) || [])].join(', ')}</td>
                                                <td>{[...new Set(elem?.items?.map(e => e?.spool_no) || [])].join(', ')}</td>
                                                <td>{[...new Set(elem?.items?.map(e => e?.joint_no) || [])].join(', ')}</td>
                                                <td>{[...new Set(elem?.items?.map(e => e?.material_specification) || [])].join(', ')}</td>
                                                <td>{elem?.offer_date ? moment(elem?.offer_date).format('YYYY-MM-DD HH:mm') : '-'}</td>
                                                <td>{[...new Set(elem?.items?.map(e => e?.rt_type) || [])].join(', ')}</td>
                                                <td className='status-badge'>
                                                    {elem.status === 0 ? (
                                                        <span className="custom-badge status-orange">Pending</span>
                                                    ) : elem.status === 1 ? (
                                                        <span className="custom-badge status-green">Accepted</span>
                                                    ) : elem.status === 2 ? (
                                                        <span className="custom-badge status-pink">Rejected</span>
                                                    ) : null}
                                                </td>
                                                <td className="text-end">
                                                    <div className="dropdown dropdown-action">
                                                        <a href="#" className="action-icon dropdown-toggle"
                                                            data-bs-toggle="dropdown" aria-expanded="false">
                                                            <i className="fa fa-ellipsis-v"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <button type='button' className="dropdown-item"
                                                                onClick={() => navigate('/party/project-store/manage-rt-offer', { state: elem })}>
                                                                <i className="fa-solid fa-pen-to-square m-r-5"></i> Edit
                                                            </button>
                                                            <button type='button' className="dropdown-item"
                                                                onClick={() => handleDownloadOffer(elem)}>
                                                                <i className="fa-solid fa-download m-r-5"></i> Download Offer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
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
                                    <div className="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">
                                        Showing {totalItems > 0 ? (currentPage - 1) * limit + 1 : 0} to {Math.min(currentPage * limit, totalItems)} of {totalItems} data
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                    <div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
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
        </>
    )
}

export default RTOfferCompletedList