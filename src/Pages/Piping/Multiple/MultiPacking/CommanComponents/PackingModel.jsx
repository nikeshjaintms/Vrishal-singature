import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { managePackingList } from '../../../../../Store/MutipleDrawing/MultiPacking/ManagePackingList';
import { getMultiPacking } from '../../../../../Store/MutipleDrawing/MultiPacking/GetMultiPacking';
import { UpdateRNBalance } from '../../../../../Store/MutipleDrawing/MultiPacking/UpdateReleaseNoteBal';
import { GetMultiGenReleaseNote } from '../../../../../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote';
const PackingModel = ({ showItem, handleCloseModal, title, irnData, irn_no }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [itemData, setItemData] = useState([]);

    useEffect(() => {
        const finalData = irnData?.items?.map((e) => ({
            ...e,
            is_grid_qty: parseInt(e?.is_grid_qty) - (parseInt(e.moved_next_step) || 0),
            original_qty: (parseInt(e?.is_grid_qty) || 0),
            max_qty: (parseInt(e?.is_grid_qty) || 0) - (parseInt(e.moved_next_step) || 0),
            pl_used_grid_qty: e?.pl_used_grid_qty || '',
            pl_balance_grid_qty: e?.pl_balance_grid_qty || '',
            moved_next_step: parseInt(e?.moved_next_step) || 0,
        }));
        setItemData(finalData);
    }, [irnData])

    const handleGridQtyChange = (index, value) => {
        const newValue = value ? Number(value) : "";
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
                            pl_used_grid_qty: newValue,
                            is_grid_qty: updatedQty,
                            pl_balance_grid_qty: updatedQty,
                        };
                    }
                }
                return item;
            })
        );
    };

    const commentsData = useMemo(() => {
        let computedComments = itemData;

        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [limit, search, totalItems, currentPage, itemData]);

    const handleSave = async () => {
        const updatedArray = itemData?.filter((it) => it?.pl_used_grid_qty > 0);
        if (updatedArray?.length === 0) {
            toast.error("Please enter valid Grid Used Quantity for at least one item.");
            return;
        }

        const updatedData = updatedArray?.map((item) => ({
            "rn_id": item.main_id,
            "rn_balance_grid_qty": item.pl_balance_grid_qty,
            "rn_used_grid_qty": item.pl_used_grid_qty,
            "drawing_id": item.drawing_id,
            "grid_id": item?.grid_id,
        }));

        const updatedBalanceData = updatedArray?.map((item) => ({
            "rn_id": item.main_id,
            "rn_balance_grid_qty": item.pl_balance_grid_qty,
            "rn_used_grid_qty": item.pl_used_grid_qty,
            "drawing_id": item.drawing_id,
            "grid_id": item?.grid_id,
        }));

        const ManagePackinglist = new URLSearchParams();
        ManagePackinglist.append('items', JSON.stringify(updatedData));

        const UpdatePackinglist = new URLSearchParams();
        UpdatePackinglist.append('items', JSON.stringify(updatedBalanceData));
        UpdatePackinglist.append('is_delete', false);
        
        try {
            await dispatch(UpdateRNBalance({ bodyFormData: UpdatePackinglist }));
            await dispatch(managePackingList({ bodyFormData: ManagePackinglist }))
            dispatch(GetMultiGenReleaseNote())
            dispatch(getMultiPacking())
            handleCloseModal();
            toast.success("Packing Offer saved successfully.");
        } catch (error) {
            toast.error("Failed to save data. Please try again.");
        }
    }
    return (
        <>
            <Modal size='lg' show={showItem} backdrop="static" onHide={handleCloseModal}>
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
                                                {commentsData?.map((elem, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{elem?.grid_no || '-'}</td>
                                                        <td>{elem?.grid_qty || '-'}</td>
                                                        <td>{elem?.is_grid_qty}</td>
                                                        <td>
                                                            <input
                                                                className='form-control' style={{ padding: "4px", minHeight: '15px' }}
                                                                type="number"
                                                                value={elem.pl_used_grid_qty}
                                                                onChange={(e) => handleGridQtyChange(index, e.target.value)}
                                                                max={elem.max_qty}
                                                                min="0"
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
        </>
    )
}

export default PackingModel