import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { getMultipleDrawItems } from '../../../../../Store/MutipleDrawing/MultipleDrawing/MultipleDrawItems';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import toast from 'react-hot-toast';
import { updateMultiGrid } from '../../../../../Store/MutipleDrawing/MultipleDrawing/UpdateGridBal';
import { manageIssueOffTable } from '../../../../../Store/MutipleDrawing/IssueRequest/manageIssueOfferTable';
import { getIssueOfferTable } from '../../../../../Store/MutipleDrawing/IssueRequest/getIssueOfferTable';

const DrawingItemsModal = ({ showItem, drawId, handleCloseModal, title, setFinalTableData, finalTableData, contractorData }) => {

    const dispatch = useDispatch();
    const drawItemsData = useSelector((state) => state?.getMultipleDrawItems?.user?.data) || [];
    const [itemData, setItemData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);

    useEffect(() => {
        if (drawId) {
            dispatch(getMultipleDrawItems({ id: drawId }));
        }
    }, [drawId, dispatch, showItem]);

    useEffect(() => {
        if (drawItemsData.length > 0) {
            setItemData(drawItemsData);
        }
    }, [drawItemsData]);

    useEffect(() => {
        if (!showItem) {
            setEditableData([]);
            setSearch("");
            setItemData([]);
        }
    }, [showItem]);

    const [finalGrid, setFinalGrid] = useState([]);
    const [editableData, setEditableData] = useState([]);

    useEffect(() => {
        const groupedData = Object.values(itemData.reduce((acc, item) => {
            const gridNo = `${item.grid_id._id}-${drawId}`;
            if (!acc[gridNo]) {
                acc[gridNo] = {
                    grid_id: item.grid_id,
                    grid_qty: item?.grid_id?.grid_qty,
                    balance_grid_qty: item.balance_grid || 0,
                    original_balance_grid_qty: item.balance_grid || 0,
                    used_grid_qty: item.used_grid_qty,
                    drawing_id: drawId,
                    multiply_iss_qty: 0,
                };
            }
            return acc;
        }, {}));
        setEditableData(groupedData || []);
        setFinalGrid(itemData || []);
    }, [itemData]);

    const handleGridQtyChange = (index, value) => {
        const newValue = Number(value);
        const originalBalance = editableData[index].original_balance_grid_qty;

        if (isNaN(newValue) || newValue < 0 || newValue > originalBalance) {
            toast.error(`Invalid quantity. Please enter a value between 0 and ${originalBalance}.`);
            return;
        }
        const updatedData = [...editableData];
        const usedQtyDifference = newValue - (updatedData[index].used_grid_qty || 0);
        updatedData[index].used_grid_qty = newValue;
        updatedData[index].balance_grid_qty = originalBalance - newValue;
        setEditableData(updatedData);
    };

    const commentsData = useMemo(() => {
        let computedComments = editableData;
        if (search) {
            computedComments = computedComments.filter(
                (draw) =>
                    draw.item_name?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    draw.grid_id?.grid_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [search, limit, currentPage, totalItems, editableData]);

    const handleModalClose = () => {
        setSearch('');
        setFinalGrid([]);
        handleCloseModal();
        setEditableData([]);
    };

    const handleSave = async () => {
        // check the item balance qty (remaining qty) via matching use and move qty 
        const filterFinalGrid = finalGrid?.filter((e) => parseInt(e?.balance_grid) > 0)

        const updatedFinalGrid = filterFinalGrid?.map(item2 => {
            const matchingItem = commentsData?.find(item => item.grid_id._id === item2.grid_id._id);
            const usedGridQty = matchingItem.used_grid_qty || 0;
            if (matchingItem) {
                return {
                    ...item2,
                    drawing_id: drawId,
                    used_grid_qty: usedGridQty,
                    balance_grid_qty: matchingItem.balance_grid_qty,
                };
            }
            return item2;
        });

        const updatedDataArr = updatedFinalGrid?.map((e) => ({
            ...e,
            multiply_iss_qty: parseFloat((e.used_grid_qty * e.assembly_weight).toFixed(2)) || 0,
        }));

        const validData = updatedDataArr?.filter(item => item.used_grid_qty > 0);
        if (validData?.length === 0) {
            toast.error("Please enter valid Grid Used Quantity for at least one item.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append('items', JSON.stringify(validData));
        formData.append('contractor_id', contractorData.name);

        const bodyFormData = new URLSearchParams();
        bodyFormData.append('flag', 1);
        bodyFormData.append('updateItems', JSON.stringify(validData));
        try {
            await dispatch(updateMultiGrid({ bodyFormData }));
            await dispatch(manageIssueOffTable({ bodyFormData: formData }))
            // setFinalTableData(prevState => [...prevState, ...validData]);
            setFinalTableData((prevState) => Array.isArray(prevState) ? [...prevState, ...validData] : [...validData] || []);
            handleModalClose();
            dispatch(getIssueOfferTable({ contractor_id: contractorData.name }))
            toast.success("Drawing Items saved successfully.");
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("Failed to save data. Please try again.");
        }
    }

    return (
        <>
            <Modal
                // dialogClassName="modal-90w"
                size='lg'
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
                                                    <h3>Drawing Sections List</h3>
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
                                                {commentsData?.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>{elem?.grid_id?.grid_no}</td>
                                                        <td>{elem?.grid_qty}</td>
                                                        <td>{elem?.balance_grid_qty}</td>
                                                        <td>
                                                            <input
                                                                className='form-control' style={{ padding: "4px", minHeight: '15px' }}
                                                                type="number"
                                                                value={elem.used_grid_qty}
                                                                onChange={(e) => handleGridQtyChange(index, e.target.value)}
                                                                min="0"
                                                                // max={elem.balance_grid_qty}
                                                                max={elem.original_balance_grid_qty}
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
        </>
    )
}

export default DrawingItemsModal