import React from 'react'
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';

const PurchasePRTable = ({
    commentsData,
    setSearch,
    setCurrentPage,
    limit,
    setlimit,
    totalItems,
    currentPage,
    handleReturnQtyChange,
    data
}) => {
    return (
        <div className='row'>
            <div className="col-sm-12">
                <div className="card card-table show-entire">
                    <div className="card-body">
                        <div className="page-table-header mb-2">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="doctor-table-blk">
                                        <h3>Item List</h3>
                                        <div className="top-nav-search table-search-blk">
                                            <form>
                                                <Search onSearch={(value) => {
                                                    setSearch(value);
                                                    setCurrentPage(1);
                                                }} />
                                                <a className="btn">
                                                    <img src="/assets/img/icons/search-normal.svg" alt="firm-searchBox" />
                                                </a>
                                            </form>
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
                                        {["Sr No.", "Name", "Unit", "M.Code", "Qty.", "Rate", "Amt.", "Dis.",
                                            "Dis. Amt.", "Sp. Dis.", "Sp. Dis. Amt.", "Tax. Amt.", "Gst",
                                            "Gst Amt.", "Total Amt.", "Remarks", "Return Qty."].map((heading, index) => (
                                                <th key={index}>{heading}</th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData?.length ? (
                                        commentsData.map((elem, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{elem?.item_name}</td>
                                                <td>{elem?.unit}</td>
                                                <td>{elem?.m_code}</td>
                                                <td><b>{elem?.quantity}</b></td>
                                                <td>{elem?.rate}</td>
                                                <td>{elem?.amount}</td>
                                                <td>{elem?.discount || '-'}</td>
                                                <td>{elem?.discount_amount}</td>
                                                <td>{elem?.sp_discount || '-'}</td>
                                                <td>{elem?.sp_discount_amount}</td>
                                                <td>{elem?.taxable_amount}</td>
                                                <td>{elem?.gst}</td>
                                                <td>{elem?.gst_amount}</td>
                                                <td>{elem?.total_amount}</td>
                                                <td>{elem?.remarks || '-'}</td>
                                                <td>
                                                    {!data?._id ? (
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={elem.return_qty || ''}
                                                            onChange={(e) => handleReturnQtyChange(e, i, elem.quantity)}
                                                            min="0"
                                                            max={elem.quantity}
                                                        />
                                                    ) : (
                                                        <>{elem?.return_qty}</>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="999">
                                                <div className="no-table-data">No Data Found!</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="row align-center mt-3 mb-2">
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Showing {Math.min(limit, totalItems)} from {totalItems} data
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div className="dataTables_paginate paging_simple_numbers">
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

export default PurchasePRTable