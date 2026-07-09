import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import toast from 'react-hot-toast';
import { getUserAdminDraw } from '../../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { updateIssueAccGrid } from '../../../../../Store/MutipleDrawing/IssueAcc/UpdateIssueAccGrid';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import { manageFitupOffTable } from '../../../../../Store/MutipleDrawing/MultiFitup/manageFitupOffTable';

const MultiFitupModal = ({ showItem, drawId, issueId, handleCloseModal, title, tableData, setFinalArr }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [itemData, setItemData] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [finalGrid, setFinalGrid] = useState([]);

    useEffect(() => {
        dispatch(getUserAdminDraw());
    }, []);

    const issueAccData = useSelector((state) => state?.getMultipleIssueAcc?.user?.data?.items);

    useEffect(() => {
        dispatch(getMultipleIssueAcc());
        const filterIssue = issueAccData?.find((is) => is?._id === issueId);
        const filterItems = filterIssue?.items?.filter((it) => it?.drawing_id?._id === drawId && it?.is_accepted === true) || [];
        const groupedData = Object.values(filterItems?.reduce((acc, item) => {
            const gridNo = `${item?.grid_item_id?.grid_id?._id}-${drawId}`;
            if (!acc[gridNo]) {
                acc[gridNo] = {
                    grid_item_id: item?.grid_item_id,
                    drawing_id: drawId,
                    iss_used_grid_qty: parseInt(item?.iss_used_grid_qty) - parseInt(item?.moved_next_step),
                    original_qty: parseInt(item?.iss_used_grid_qty),
                    moved_next_step: parseInt(item?.moved_next_step),
                    max_qty: parseInt(item?.iss_used_grid_qty) - parseInt(item.moved_next_step),
                    imir_no: item?.imir_no,
                    heat_no: item?.heat_no,
                    fitOff_used_grid_qty: item.fitOff_used_grid_qty || '',
                    is_accepted: item?.is_accepted
                };
            }
            return acc;
        }, {}));
        setItemData(groupedData || []);
        setFinalGrid(filterItems || []);
    }, [showItem, refreshTrigger, issueId, drawId]);

    const commentsData = useMemo(() => {
        let computedComments = itemData;
        computedComments = computedComments?.filter((co) => co?.is_accepted === true);
        if (search) {
            computedComments = computedComments.filter((elem) =>
                elem?.grid_item_id?.item_name?.name?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                elem?.grid_item_id?.grid_id?.grid_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                elem?.imir_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [limit, search, totalItems, currentPage, itemData]);

    const handleGridQtyChange = (index, value) => {
        const newValue = value ? Math.max(0, Number(value)) : "";
        setItemData((prevItemData) =>
            prevItemData.map((item, idx) => {
                if (idx === index) {
                    const maxQty = item.original_qty;
                    const moveQty = item.moved_next_step;
                    const final_qty = maxQty - moveQty;
                    if (newValue === "" || (newValue >= 0 && newValue <= final_qty)) {
                        const updatedQty = final_qty - newValue;
                        return {
                            ...item,
                            fitOff_used_grid_qty: newValue,
                            iss_used_grid_qty: updatedQty,
                            fitOff_balance_qty: updatedQty,
                        };
                    }
                }
                return item;
            })
        );
    };

    const handleSave = async () => {
        // check the item balance qty (remaining qty) via matching use and move qty 
        const filterFinalGrid = finalGrid?.filter((e) => parseInt(e?.iss_used_grid_qty) !== parseInt(e?.moved_next_step));
        const updatedFinalGrid = filterFinalGrid?.map(item2 => {
            const matchingItem = commentsData?.find(item => item?.grid_item_id?.grid_id._id === item2?.grid_item_id?.grid_id._id);
            if (matchingItem) {
                return {
                    ...item2,
                    drawing_id: drawId,
                    fitOff_used_grid_qty: matchingItem.fitOff_used_grid_qty,
                    iss_used_grid_qty: matchingItem.iss_used_grid_qty,
                    fitOff_balance_qty: matchingItem.fitOff_balance_qty,
                    // original_iss_used_grid_qty: matchingItem.original_iss_used_grid_qty,
                    original_qty: matchingItem.original_qty,
                }
            }
            return item2;
        })

        const updatedArray = updatedFinalGrid.filter(item => item.fitOff_used_grid_qty > 0);
        if (updatedArray?.length === 0) {
            toast.error("Please enter valid Grid Used Quantity for at least one item.");
            return;
        }
        const formData = new URLSearchParams();
        formData.append('flag', 1);
        formData.append('issueId', issueId);
        formData.append('items', JSON.stringify(updatedArray));

        const tableData = new URLSearchParams();
        tableData.append('issue_id', issueId);
        tableData.append('items', JSON.stringify(updatedArray));
        try {
            await dispatch(updateIssueAccGrid({ bodyFormData: formData }));
            await dispatch(manageFitupOffTable({ bodyFormData: tableData }))
            setFinalArr(prevState => [...prevState, ...updatedArray]);
            setRefreshTrigger(prev => !prev);
            handleCloseModal();
            toast.success("Fit-Up Items saved successfully.");
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Failed to save data. Please try again.");
        }
    }

    return (
        <Modal size='lg'
            //  dialogClassName="modal-90w" 
            show={showItem} backdrop="static" onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table show-entire">
                            <div className="card-body">
                                <div className="page-table-header multi-draw-header mb-2">
                                    <div className="row align-items-center">
                                        <div className="col">
                                            <div className="doctor-table-blk">
                                                <h3></h3>
                                                <div className="doctor-search-blk">
                                                    <div className="top-nav-search table-search-blk">
                                                        <form>
                                                            <Search
                                                                onSearch={(value) => {
                                                                    setSearch(value);
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
                                    <table className="table border-0 custom-table comman-table mb-0 multi-draw-table">
                                        <thead>
                                            <tr>
                                                <th>Sr.</th>
                                                <th>Gri. No.</th>
                                                <th>Gri. Qty.</th>
                                                <th>Gri. Bal. Qty.</th>
                                                <th>Gri. Use Qty.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* filter(elem => parseInt(elem?.iss_used_grid_qty) > 0) */}
                                            {commentsData?.map((elem, index) =>
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{elem?.grid_item_id?.grid_id?.grid_no || '-'}</td>
                                                    <td>{elem?.grid_item_id?.grid_id?.grid_qty || '-'}</td>
                                                    <td>{elem?.iss_used_grid_qty}</td>
                                                    <td>
                                                        <input
                                                            className='form-control' style={{ padding: "4px", minHeight: '15px' }}
                                                            type="number"
                                                            value={elem.fitOff_used_grid_qty}
                                                            onChange={(e) => handleGridQtyChange(index, e.target.value)}
                                                            min="0"
                                                            max={elem.max_qty}
                                                            step="1"
                                                        />
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
            </Modal.Body>
            <Modal.Footer>
                <div className='col-12 text-end'>
                    <button className='btn btn-primary' type='button' onClick={handleSave}>Save</button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default MultiFitupModal