import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '../../Table';
import { getPRItems } from '../../../../Store/Store/MainStore/PurchaseOrder/GetPRItems';
import { getVoucherNo } from '../../../../Store/Store/MainStore/PurchaseOrder/GetPR';

const ItemsModel = ({ show, mode, isEdit, EditItem, handleClose, handleSave }) => {
    const dispatch = useDispatch()
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rates, setRates] = useState({});
    const [voucherNo, setVoucherNo] = useState(null);
    const [items, setItems] = useState([]);
    const [entity, setEntity] = useState([]);
    const [limit, setlimit] = useState(5);
    const itemDetails = useSelector((state) => state.getVoucher?.data?.data || []);
    const PRItems = useSelector((state) => state.getPrItems?.data?.data || []);

    const commentsData = useMemo(() => {
        let computedComments = PRItems;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, limit, entity, PRItems]);
    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);
    useEffect(() => {
        dispatch(getVoucherNo());
        if (voucherNo === null) {
            const Payload = {
                "tag_number": 9,
                "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
                "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                "pr_no": []
            }
            dispatch(getPRItems(Payload));
        } else {
            const Payload = {
                "tag_number": 9,
                "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
                "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                "pr_no": [voucherNo]
            }
            dispatch(getPRItems(Payload));
        }
    }, [dispatch, voucherNo])
    useEffect(() => {
        if (mode === "edit" && EditItem) {
            setRates((prevRates) => ({
                ...prevRates,
                [EditItem.detail_id]: EditItem.rate,
            }));
        }
    }, [mode, EditItem]);
    const handleChange = (e) => {
        if (e.target.value === "") {
            setVoucherNo(null)
        } else {
            setVoucherNo(e.target.value)
        }
    }
    const handleRateChange = (id, value) => {
        setRates((prevRates) => ({
            ...prevRates,
            [id]: value,
        }));
    };
    const saveItem = () => {
        if (isEdit) {
            if (mode === "add") {
                const itemsWithRates = PRItems.filter((item) => rates[item.detail_id]);
                const updatedItems = itemsWithRates.map((item) => ({
                    ...item,
                    rate: rates[item.detail_id],
                }));

                const payload = updatedItems.map((item) => ({
                    id: item.detail_id,
                    item_id: item?.item_data?._id,
                    unit: item?.unit,
                    rate: item.rate,
                    quantity: item.quantity,
                }));
          
                handleSave(payload, "add");

            } else {
                const updatedItem = {
                    ...EditItem,
                    rate: rates[EditItem?.detail_id] || EditItem.rate,
                };
                handleSave(updatedItem, EditItem._id, "edit");
            }
        } else {
            handleSave()
        }
    };
    return (
        <Modal
            show={show}
            backdrop="static"
            size="xl"
            keyboard={false}
            onHide={handleClose}
        // handleClose= {handleModalClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Items Details PO Items</Modal.Title>
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
                                                    Voucher No
                                                </label>
                                                <select
                                                    className="form-select form-control"
                                                    name="item_id"
                                                    value={voucherNo}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select Item</option>
                                                    {entity.map((item) => <option key={item._id} value={item?.voucher_no}>{item?.voucher_no}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-12">
                                            <div className="table-responsive">
                                                <table className="table border-0 custom-table comman-table  mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Sr No.</th>
                                                            <th>Item Name</th>
                                                            <th>Category Name</th>
                                                            <th>Unit</th>
                                                            <th>Item Brand</th>
                                                            <th>QTY</th>
                                                            <th >Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {commentsData?.map((elem, i) =>
                                                            <tr key={elem?.detail_id}>
                                                                <td>{i + 1}</td>
                                                                <td >{elem?.item_data?.name}</td>
                                                                <td >{elem.category_data?.name}</td>
                                                                <td>{elem?.unit}</td>
                                                                <td>{elem?.item_brand}</td>
                                                                <td >{elem.quantity}</td>
                                                                <td>
                                                                    <input
                                                                        className='form-control'
                                                                        type="number"
                                                                        value={rates[elem.detail_id] || ""}
                                                                        placeholder="Enter Rate"
                                                                        onChange={(e) =>
                                                                            handleRateChange(elem.detail_id, e.target.value)
                                                                        }
                                                                    />
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
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={isEdit ? saveItem : handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ItemsModel