import React from 'react'
import { useNavigate } from 'react-router-dom';
import DropDown from '../DropDown';
import { Pagination, Search } from '../../Pages/Users/Table';
import moment from 'moment';

const NdtOfferTable = ({ name, commentsData, url, limit, handleRefresh, currentPage, setCurrentPage, setSearch, setlimit, totalItems, handleDownloadOffer }) => {

    const navigate = useNavigate();

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card card-table show-entire">
                    <div className="card-body">

                        <div className="page-table-header mb-2">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="doctor-table-blk">
                                        <h3>{name}</h3>
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
                                        <th>Voucher No.</th>
                                        <th>NDT Offer No.</th>
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
                                            <td>{elem?.ndt_master_id?.ndt_voucher_no}</td>
                                            <td>{elem?.ndt_offer_no || '-'}</td>
                                            <td>{elem?.report_date ? moment(elem?.report_date).format('YYYY-MM-DD HH:mm') : '-'}</td>
                                            <td>{elem?.ndt_type_id?.name}</td>
                                            <td className='status-badge'>
                                                {elem.status === 1 ? (
                                                    <span className="custom-badge status-orange">Pending</span>
                                                ) : elem.status === 2 ? (
                                                    <span className="custom-badge status-green">Accepted</span>
                                                ) : elem.status === 3 ? (
                                                    <span className="custom-badge status-pink">Rejected</span>
                                                ) : elem.status === 4 ? (
                                                    <span className='custom-badge status-blue'>Send For Clearance</span>
                                                ) : null}
                                            </td>

                                            <td className="text-end">
                                                <div className="dropdown dropdown-action">
                                                    <a href="#" className="action-icon dropdown-toggle"
                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                            className="fa fa-ellipsis-v"></i></a>
                                                    <div className="dropdown-menu dropdown-menu-end">
                                                        <button type='button' className="dropdown-item" onClick={() => navigate(url, { state: elem })}><i
                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                            Edit</button>
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
    )
}

export default NdtOfferTable