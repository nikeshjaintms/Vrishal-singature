import React, { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Pagination } from "../../../Table";

const ItemsTable = ({ data, onAddItem, onDeleteItem, onEditItem }) => {
    const [limit, setlimit] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const commentsData = useMemo(() => {
        let computedComments = data;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, limit, data]);
    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="form-heading">
                                <h4 className="mb-0">Items Details</h4>
                            </div>
                            {/* {showAddBtn && ( */}
                            <div className="add-group">
                                <button onClick={onAddItem} className="btn btn-primary add-pluss ms-2">
                                    <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                </button>
                            </div>
                            {/* )} */}
                        </div>
                        <div className="col-12 mt-3 table-responsive">
                            <table className="table border-0 mb-0 custom-table table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>Item Name</th>
                                        <th>Unit</th>
                                        <th>Code</th>
                                        <th>Quantity</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th>Taxable Amount</th>
                                        <th>GST (%)</th>
                                        <th>GST Amount</th>
                                        <th>Total Amount</th>
                                        <th>Return Type</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData.length > 0 ? (
                                        commentsData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                <td>{row?.item_name}</td>
                                                <td>{row.unit}</td>
                                                <td>{row.mcode}</td>
                                                <td>{row.quantity}</td>
                                                <td>{row.rate}</td>
                                                <td>{row.amount}</td>
                                                <td>{row.amount}</td>
                                                <td>{row.gst}</td>
                                                <td>{row.gst_amount}</td>
                                                <td>{row.total_amount}</td>
                                                <td>{row.isreturn.toString() === "false" ? "Returnable" : "Non-Returnable"}</td>
                                                <td>{row.remarks}</td>
                                                <td className="justify-content-end d-flex">
                                                    <button
                                                        className="action-icon mx-1"
                                                        onClick={() => onEditItem(rowIndex)}
                                                    >
                                                        <Pencil />
                                                    </button>
                                                    <button
                                                        className="action-icon mx-1"
                                                        onClick={() => onDeleteItem(rowIndex, row?.item_name)}
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="17" className="text-center">
                                                No items available!
                                            </td>
                                        </tr>
                                    )}
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
    );
};

export default ItemsTable;