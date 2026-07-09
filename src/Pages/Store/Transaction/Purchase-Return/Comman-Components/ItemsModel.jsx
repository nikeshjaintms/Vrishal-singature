import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';
import { Dropdown } from 'primereact/dropdown';
import { Pagination } from '../../../Table';
import { MultiSelect } from 'primereact/multiselect';
import toast from 'react-hot-toast';
import { getPRItems } from '../../../../../Store/Store/MainStore/PurchaseReturn/GetPRItems';
import { getPUNumber } from '../../../../../Store/Store/MainStore/PurchaseReturn/getPUno';

const ItemsModel = ({ modalOpen, formData, handleModalClose, editeMode, handleAddMore, handleSave, editItems }) => {
    useEffect(() => {
        if (editeMode && editItems) {
            const initializedItems = [{
                detail_id: editItems.detail_id,
                item_id: editItems.item_id,
                item_name: editItems.item_name,
                po_no: editItems.po_no,
                po_quantity: editItems.po_quantity,
                unit: editItems.unit,
                mcode: editItems.mcode,
                quantity: editItems.quantity || 0,
                rate: editItems.rate || 0,
                amount: editItems.amount || 0,
                discount: editItems.discount || 0,
                discount_amount: editItems.discount_amount || 0,
                sp_discount: editItems.sp_discount || 0,
                sp_discount_amount: editItems.sp_discount_amount || 0,
                taxable_amount: editItems.taxable_amount || 0,
                gst: editItems.gst || 0,
                gst_amount: editItems.gst_amount || 0,
                total_amount: editItems.total_amount || 0,
                remarks: editItems.remarks || "",
                is_add: true,
                errors: {
                    pr_quantity: "",
                    rate: ""
                }
            }];
            setItemsValue(initializedItems);
        }
    }, [editeMode, editItems]);
    useEffect(() => {
        if (formData?.party_id || formData?.bill_no && formData?.challan_no) {
            dispatch(getPRItems({ party_id: formData?.party_id, bill_no: formData?.bill_no, challan_no: formData?.challan_no }));
        }
    }, [formData?.party_id, formData?.bill_no, formData?.challan_no]);

    const dispatch = useDispatch();
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data || []);
    const puNumbers = useSelector((state) => state.getPUNo?.data?.data || []);
    const prItems = useSelector((state) => state.getPRItems?.data?.data || []);

    const [voucherNo, setVoucherNo] = useState([]);
    const [itemsValue, setItemsValue] = useState([]);

    useEffect(() => {
        if (prItems?.items?.length > 0) {
            const initializedItems = prItems?.items.map(item => ({
                ...item,
                detail_id: item.detail_id,
                item_id: item.item_data?._id || "",
                item_name: item.item_data?.name || "",
                po_no: item.po_no || "",
                po_quantity: item.quantity || "",
                unit: itemDetails?.find(e => e?._id === item?.item_data?._id)?.unit?.name || "",
                mcode: itemDetails?.find(e => e?._id === item?.item_data?._id)?.mcode || "",
                quantity: 0,
                rate: item.rate || 0,
                amount: 0,
                discount: 0,
                discount_amount: 0,
                sp_discount: 0,
                sp_discount_amount: 0,
                taxable_amount: 0,
                gst: item.gst || 0,
                gst_amount: 0,
                total_amount: 0,
                remarks: "",
                is_add: false,
                errors: {
                    pr_quantity: "",
                    rate: ""
                }
            }));
            setItemsValue(initializedItems || []);
        }
    }, [prItems]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setItemsValue(prevState =>
            prevState.map((item, i) => {
                if (i === index) {
                    const updatedItem = {
                        ...item,
                        [name]: value
                    };
                    if (name === "quantity") {
                        if (!value) {
                            updatedItem.errors.pr_quantity = "Required";
                        } else if (value > item?.po_quantity) {
                            updatedItem.errors.pr_quantity = "Pr quantity is not greaterthan po quantity  " + item.po_quantity
                        } else {
                            updatedItem.errors.pr_quantity = ""
                        }
                    }
                    if (name === "rate") {
                        if (!value) {
                            updatedItem.errors.rate = "Required"
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
    const handleformSave = () => {
        const saveItemData = itemsValue?.filter((e) => e?.is_add === true)
        if (saveItemData.length > 0) {
            if (!editeMode) {
                handleSave(saveItemData)
            } else {
                handleSave(saveItemData, voucherNo)
            }
        } else {
            toast.error("please enter Quantity and rate")
        }
    }
    const handlePOChange = (e) => {
        if (e.target.value === "") {
            setVoucherNo(null)
        } else {
            setVoucherNo(e.target.value)
        }
    }
    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
        dispatch(getPUNumber());
    }, [dispatch])

    return (
        <Modal
            show={modalOpen}
            backdrop="static"
            dialogClassName='modal-custom-100w '
            keyboard={false}
            onHide={handleModalClose}
            handleClose={handleModalClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Items Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    PU No
                                                </label>
                                                <MultiSelect
                                                    className='w-50'
                                                    name="voucherNo"
                                                    value={voucherNo}
                                                    options={puNumbers.map((item) => ({
                                                        label: item.voucher_no,
                                                        value: item.voucher_no,
                                                    }))}
                                                    onChange={handlePOChange}
                                                    placeholder="Select PU No."
                                                    maxSelectedLabels={3}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table border-0 custom-table comman-table  mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>S No.</th>
                                                            <th>Item Name</th>
                                                            <th>PU No.</th>
                                                            <th>Unit</th>
                                                            <th>M Code</th>
                                                            <th>PO QTY</th>
                                                            <th>PR QTY</th>
                                                            <th>Rate</th>

                                                            <th>Amt.</th>
                                                            <th>Disc.</th>
                                                            <th>Disc Amt.</th>
                                                            <th>Spe Disc.</th>
                                                            <th>Spe.Disc Amt</th>
                                                            <th>Tax Amt</th>
                                                            <th>GST</th>
                                                            <th>GST Amt</th>
                                                            <th>Total Amt</th>
                                                            <th>Remarks</th>
                                                            {/* <th>Action</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itemsValue?.map((elem, i) =>
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td >{elem?.item_name}</td>
                                                                <td >{elem?.po_no}</td>
                                                                <td >{elem?.unit}</td>
                                                                <td >{elem?.mcode}</td>
                                                                <td >{elem?.po_quantity}</td>
                                                                <td >
                                                                    <input type="number" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, i)} name='quantity' value={elem?.quantity} />
                                                                    {elem?.errors?.pr_quantity && (
                                                                        <div className="error">{elem.errors.pr_quantity}</div>
                                                                    )}
                                                                </td>
                                                                <td >
                                                                    <input type="number" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, i)} name='rate' value={elem?.rate} />
                                                                    {elem?.errors?.rate && (
                                                                        <div className="error">{elem.errors.rate}</div>
                                                                    )}
                                                                </td>
                                                                <td><input className='form-control' style={{ width: '100px' }} value={elem.amount} disabled /></td>
                                                                <td ><input type="number" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, i)} name='discount' value={elem?.discount} /></td>
                                                                <td ><input className='form-control' style={{ width: '100px' }} value={elem.discount_amount} disabled /></td>

                                                                <td ><input type="number" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, i)} name='sp_discount' value={elem?.sp_discount} /></td>
                                                                <td ><input className='form-control' style={{ width: '100px' }} value={elem.sp_discount_amount} disabled /></td>
                                                                <td ><input className='form-control' style={{ width: '100px' }} value={elem.taxable_amount} disabled /></td>
                                                                <td ><input type="number" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, i)} name='gst' value={elem?.gst} /></td>
                                                                <td ><input className='form-control' style={{ width: '100px' }} value={elem.gst_amount} disabled /></td>
                                                                <td ><input className='form-control' style={{ width: '100px' }} value={elem.total_amount} disabled /></td>
                                                                <td ><input type="text" placeholder="Enter value" className='form-control' style={{ width: '100px' }} onChange={(e) => handleChange(e, i)} name='remarks' value={elem?.remarks} /></td>
                                                                {/* <td>
                                                                    <button
                                                                        className="btn btn-primary"
                                                                        disabled={
                                                                            elem?.errors?.pr_quantity || elem?.errors?.rate
                                                                        }
                                                                        onClick={handleformSave}
                                                                    >
                                                                        {editeMode ? "save" : "Add"}
                                                                    </button>
                                                                </td> */}
                                                            </tr>
                                                        )}
                                                        {prItems?.items?.length === 0 ? (
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
                                                        aria-live="polite">
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                    <div className="dataTables_paginate paging_simple_numbers"
                                                        id="DataTables_Table_0_paginate">
                                                        {/* <Pagination
                                                            total={totalItems}
                                                            itemsPerPage={limit}
                                                            currentPage={currentPage}
                                                            onPageChange={(page) => setCurrentPage(page)}
                                                        /> */}
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
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <h4>Note : <span className="error">Please Enter PR Quantity Smaller Than Po Quantity</span></h4>
                    <button
                        className="btn btn-primary"
                        // disabled={
                        //     elem?.errors?.pr_quantity || elem?.errors?.rate
                        // }
                        onClick={handleformSave}
                    >
                        save
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ItemsModel