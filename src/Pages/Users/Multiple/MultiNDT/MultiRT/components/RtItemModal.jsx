import React, { useEffect, useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Pagination, Search } from '../../../../Table'
import DropDown from '../../../../../../Components/DropDown'
import { Save, X } from 'lucide-react'
import { getStockReportList } from '../../../../../../Store/Store/Stock/getStockReportList'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { manageRTOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRtOfferTable'
import { getMultiRtOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable'
import axios from 'axios'
import { V_URL } from '../../../../../../BaseUrl'

const RtItemModal = ({ title, tableObj, modalOpen, handleCloseModal }) => {

    const dispatch = useDispatch();
    const [limit, setlimit] = useState(10);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [rtItems, setRtItems] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [rtTableData, setRtTableData] = useState([]);
    const [editFormData, setEditFormData] = useState({
        thickness: '',
        remarks: '',
        rt_use_qty: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setRtItems(tableObj?.items);
        if (tableObj?._id) {
            fetchRtTable()
        }
        dispatch(getStockReportList());
    }, [tableObj, modalOpen]);

    const stockData = useSelector((state) => state?.getStockReportList?.user?.data);

    const fetchRtTable = () => {
        const url = `${V_URL}/user/get-ndt-generated-offer?project=${localStorage.getItem('U_PROJECT_ID')}&type=${tableObj?.ndt_type_id?._id}`
        axios({
            method: "get",
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response?.data?.success === true) {
                setRtTableData(response?.data?.data?.items)
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if (tableObj?._id) {
            let errorSet = new Set();
            let totalMPTUseQty = 0;
            const updatedTableData = tableObj?.items?.map((item) => {
                const stockItem = stockData?.find((stock) => stock.name === item?.grid_item_id?.item_name?.name);
                const filterRTTable = rtTableData?.filter((rt) => rt?.ndt_type_id === tableObj?.ndt_type_id?._id && rt?.ndt_master_id === tableObj?.ndt_master_id?._id);

                const matchingRTItems = filterRTTable?.filter(
                    (rt) =>
                        rt?.grid_item_id?._id === item?.grid_item_id?._id &&
                        rt?.grid_item_id?.drawing_id?._id === item?.drawing_id &&
                        rt?.deleted === false &&
                        rt?.offer_status !== 5 && rt?.offer_status !== 4
                ) || [];

                const totalMatchingMPTUseQty = matchingRTItems?.reduce((sum, rt) => sum + (rt?.rt_use_qty || 0), 0);
                totalMPTUseQty += totalMatchingMPTUseQty;

                const newOfferUsedGridQty = matchingRTItems?.length > 0
                    ? parseInt(item.offer_used_grid_qty) - parseInt(totalMatchingMPTUseQty)
                    : item.offer_used_grid_qty;

                // const newOfferUsedGridQty = matchingRTItem
                //     ? item.offer_used_grid_qty - matchingRTItem.rt_use_qty
                //     : item.offer_used_grid_qty;

                // Check if the value is zero
                if (newOfferUsedGridQty <= 0) {
                    const errorKey = `${item?.grid_item_id?.drawing_id?.drawing_no} | ${item?.grid_item_id?.grid_id?.grid_no}`;
                    errorSet.add(errorKey);
                }

                return {
                    ...item,
                    thickness: `${stockItem?.accepted_topBottom_thickness} / ${stockItem?.accepted_width_thickness} / ${stockItem?.accepted_normal_thickness}` || "",
                    offer_used_grid_qty: parseInt(newOfferUsedGridQty),
                };
            });
            if (errorSet.size > 0) {
                setError(`Offer Used Grid Quantity is zero for:\n${[...errorSet].join("\n")}`);
            } else {
                setError("");
            }
            setRtItems(updatedTableData);
        }
    }, [tableObj?._id, stockData, rtTableData, modalOpen]);

    const commentsData = useMemo(() => {
        let computedComments = rtItems;
        if (search) {
            computedComments = computedComments.filter(
                (rt) =>
                    rt.grid_item_id?.drawing_id?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    rt.grid_item_id?.drawing_id?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    rt.grid_item_id?.grid_id?.grid_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        // setTotalItems(computedComments?.length);
        // return computedComments?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
        return computedComments;
    }, [currentPage, search, limit, rtItems]);

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            thickness: row.thickness,
            remarks: row.remarks,
            rt_use_qty: row.rt_use_qty || '',
        });
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === 'rt_use_qty') {
            if (value === "") {
                updatedValue = ""; // Ensure it clears properly
            } else {
                const maxQty = rtItems[editRowIndex]?.offer_used_grid_qty || 0;
                const inputValue = parseInt(value) || 0;

                // Ensure input does not exceed maxQty
                updatedValue = inputValue > maxQty ? maxQty : inputValue;
            }
        }

        setEditFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));
    };


    const handleSaveClick = () => {
        const updatedData = rtItems.map((item) => {
            if (item.grid_item_id?.grid_id?.grid_no === rtItems[editRowIndex]?.grid_item_id?.grid_id?.grid_no) {
                return { ...item, ...editFormData, rt_use_qty: editFormData.rt_use_qty || "" };
            }
            return item;
        });

        setRtItems(updatedData);
        setEditRowIndex(null);
    };

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleSave = () => {
        const updatedData = rtItems.filter((it) => it?.rt_use_qty > 0);
        if (updatedData?.length === 0) {
            toast.error('Please add at least one item with non-zero RT Use Qty');
            return
        }

        const finalArray = updatedData?.map((it) => ({
            drawing_id: it?.drawing_id,
            grid_item_id: it?.grid_item_id?._id,
            joint_type: it?.joint_type?.map((e) => e?._id),
            offer_used_grid_qty: it?.offer_used_grid_qty,
            rt_use_qty: it?.rt_use_qty,
            rt_balance_qty: parseInt(it?.offer_used_grid_qty) - parseInt(it?.rt_use_qty),
            thickness: it?.thickness,
            weldor_no: it?.weldor_no?._id,
            wps_no: it?.wps_no?._id,
            remarks: it?.remarks || '',
        }));

        let storedMasterIds = JSON.parse(localStorage.getItem('RT_TYPE_MASTER_IDS')) || [];

        // Add the new ID if it's not already present
        const newMasterId = tableObj?.ndt_master_id?._id;
        if (newMasterId && !storedMasterIds.includes(newMasterId)) {
            storedMasterIds.push(newMasterId);
        }

        localStorage.setItem('RT_TYPE_ID', tableObj?.ndt_type_id?._id);
        localStorage.setItem('RT_TYPE_MASTER_IDS', JSON.stringify(storedMasterIds));

        const formData = new URLSearchParams();
        formData.append('items', JSON.stringify(finalArray));
        formData.append('ndt_type_id', tableObj?.ndt_type_id?._id);
        formData.append('ndt_main_offer_id', tableObj?._id);
        formData.append('ndt_master_id', tableObj?.ndt_master_id?._id);
        dispatch(manageRTOfferTable({ bodyFormData: formData })).then((response) => {
            console.log(response, 'success');
            const { success, message, data } = response?.payload;
            if (success === true) {
                toast.success(message);
                const typeId = localStorage.getItem('RT_TYPE_ID');
                const masterId = localStorage.getItem('RT_TYPE_MASTER_IDS');
                dispatch(getMultiRtOfferTable({ typeId, masterId }))
                handleCloseModal();
            }
        })
    }

    return (
        <>
            <Modal dialogClassName="modal-90w" show={modalOpen} backdrop="static" onHide={handleCloseModal}>
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
                                                {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table border-0 custom-table comman-table mb-0 multi-draw-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Drawing No.</th>
                                                    <th>Rev</th>
                                                    <th>Assem. No.</th>
                                                    <th>Section Details</th>
                                                    <th>Item No.</th>
                                                    <th>Grid No.</th>
                                                    <th>Grid Qty.</th>
                                                    <th>Joint Type</th>
                                                    <th>Welding Process</th>
                                                    <th>Weldor No.</th>
                                                    <th>Thickness(T/B,W,N)</th>
                                                    <th>RT Use Qty</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.grid_item_id?.drawing_id?.drawing_no}</td>
                                                        <td>{elem?.grid_item_id?.drawing_id?.rev}</td>
                                                        <td>{elem?.grid_item_id?.drawing_id?.assembly_no}</td>
                                                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                        <td>{elem?.grid_item_id?.item_no}</td>
                                                        <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                        <td>{elem?.offer_used_grid_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name).join(", ")}</td>
                                                        <td>{elem?.wps_no?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        {(tableObj?.status === 1 || tableObj?.status === 4) ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input className='form-control' type='text' value={editFormData?.thickness} onChange={handleEditFormChange} name='thickness' />
                                                                        </td>
                                                                        <td>
                                                                            <input
                                                                                className='form-control'
                                                                                type='number'
                                                                                value={editFormData?.rt_use_qty}
                                                                                onChange={handleEditFormChange}
                                                                                name='rt_use_qty'
                                                                                min="0"
                                                                            />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.thickness || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.rt_use_qty || '-'}</td>
                                                                    </>
                                                                )}
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                                    </td>
                                                                ) : <td>-</td>}
                                                            </>
                                                        ) : <>
                                                            <td>{elem?.thickness}</td>
                                                            <td>{elem?.rt_use_qty}</td>
                                                            <td>-</td>
                                                        </>}
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
                                    {/* <div className="row align-center mt-3 mb-2">
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
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='col-12 d-flex justify-content-between'>
                        <p>{error && <span className='text-danger'>{error}</span>}</p>
                        <button className='btn btn-primary' type='button' onClick={handleSave}>Save</button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RtItemModal