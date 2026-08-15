import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminItem } from "../../../../../Store/Store/Item/AdminItem";
import { Pagination } from "../../../Table";

const ItemsTable = ({ data, setData, issueReturnLists }) => {

   

    const dispatch = useDispatch();
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
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

    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
    }, [dispatch])

    useEffect(() => {
        if (issueReturnLists?.items?.length > 0) {
            const initializedItems = issueReturnLists?.items?.map(item => ({
                ...item,
                detail_id: item.detail_id,
                item_id: item.item_data?._id || "",
                item_name: item.item_data?.name || "",
                issue_quantity: item.quantity || 0,
                unit: itemDetails?.find(e => e?._id === item?.item_data?._id)?.unit?.name || "",
                mcode: itemDetails?.find(e => e?._id === item?.item_data?._id)?.mcode || "",
                quantity: 0,
                rate: item?.rate || 0,
                amount: 0,
                taxable_amount: 0,
                gst: item?.gst || 0,
                gst_amount: 0,
                total_amount: 0,
                remarks: "",
                is_add: false,
                errors: {
                    ISR_quantity: "",
                    rate: ""
                }
            }));
            setData(initializedItems || []);
         } 
        // else {
        //     setData([])
        // }
    }, [issueReturnLists?.items, itemDetails]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setData(prevState =>
            prevState.map((item, i) => {
                if (i === index) {
                    const updatedItem = {
                        ...item,
                        [name]: value,
                        errors: { ...(item.errors || {}) } // ensure errors exists

                    };
                    if (name === "quantity") {
                        if (!value) {
                            updatedItem.errors.ISR_quantity = "Required";
                        } else if (value > item?.issue_quantity) {
                            updatedItem.errors.ISR_quantity = "ISR quantity is not greaterthan ISS quantity  " + item.issue_quantity
                        } else {
                            updatedItem.errors.ISR_quantity = ""
                        }
                    }
                    const quantity = Number(updatedItem.quantity) || 0;
                    const rate = Number(updatedItem.rate) || 0;
                    const discount = parseFloat(updatedItem.discount) || 0;
                    const spDiscount = parseFloat(updatedItem.sp_discount) || 0;
                    const gst = parseFloat(updatedItem.gst) || 0;

                    const amount = quantity * rate;
                    const discountAmount = amount * discount / 100;
                    const spDiscountAmount = (amount - discountAmount) * spDiscount / 100;
                    const taxableAmount = amount - discountAmount - spDiscountAmount;
                    const gstAmount = taxableAmount * gst / 100;
                    const totalAmount = taxableAmount + gstAmount;

                    return {
                        ...updatedItem,
                        amount: parseFloat(amount.toFixed(2)),
                        discount_amount: parseFloat(discountAmount.toFixed(2)),
                        sp_discount_amount: parseFloat(spDiscountAmount.toFixed(2)),
                        taxable_amount: parseFloat(taxableAmount.toFixed(2)),
                        gst_amount: parseFloat(gstAmount.toFixed(2)),
                        total_amount: parseFloat(totalAmount.toFixed(2)),
                        is_add: true
                    };
                }
                return item;
            })
        );
    };
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
                            {/* <div className="add-group">
                                <button onClick={onAddItem} className="btn btn-primary add-pluss ms-2">
                                    <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                </button>
                            </div> */}
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
                                        <th>ISS QTY</th>
                                        <th>ISR QTY</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th>Taxable Amount</th>
                                        <th>GST (%)</th>
                                        <th>GST Amount</th>
                                        <th>Total Amount</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
 

                                    {commentsData.length > 0 ? (
                                        commentsData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                <td>{rowIndex + 1}</td>
                                                <td>{row?.item_data?.name ?? row?.item_name ?? "-"}</td>
                                                <td>{row.unit ?? "-"}</td>
                                                <td>{row.mcode ?? '-'}</td>
                                                <td>{row.issue_quantity ?? row.quantity}</td>
                                                <td >
                                                    <input type="number" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, rowIndex)} name='quantity'value={row?.quantity || 0} />
                                                    {row?.errors?.ISR_quantity && (
                                                        <div className="error">{row.errors.ISR_quantity}</div>
                                                    )}
                                                </td>
                                                <td>{row.rate}</td>
                                                <td>{row.amount}</td>
                                                <td>{row.taxable_amount}</td>
                                                <td>{row.gst}</td>
                                                <td>{row.gst_amount}</td>
                                                <td>{row.total_amount}</td>
                                                <td >
                                                    <input type="text" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, rowIndex)} name='remarks' value={row.remarks} />
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