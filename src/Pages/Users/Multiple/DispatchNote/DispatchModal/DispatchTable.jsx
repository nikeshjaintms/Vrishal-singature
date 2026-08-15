import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMultiDispatchNotes } from '../../../../../Store/MutipleDrawing/DispatchNote/GetMultiDispatch';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getUserGenInspectionSummary } from '../../../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';

const DispatchTable = ({ data, finalArr, setSubmitArr }) => {

    const dispatch = useDispatch();
    const [search, setSearch] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ remarks: '', paint_system: "", paint_system_no: "" });

    useEffect(() => {
        getDisaptchOfferTable();
    }, [localStorage.getItem('U_PROJECT_ID'), localStorage.getItem('issue_acc_ids'), localStorage.getItem('ndt_master_ids'), finalArr])

    const getDisaptchOfferTable = () => {
        dispatch(getUserGenInspectionSummary({}))
        dispatch(getMultiDispatchNotes())
        dispatch(getUserPaintSystem({ status: '' }));
    }
    const paints = useSelector((state) => state?.getUserPaintSystem?.user?.data);
    const getMultiDispatch = useSelector((state) => state?.getMultiDispatch?.user?.data);

    useEffect(() => {
        if (getMultiDispatch?.length > 0) {
            setTableData(getMultiDispatch)
        } else {
            setTableData([])
            setSubmitArr([])
        }
    }, [getMultiDispatch, finalArr]);

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'paint_system') {
            const selectedPaint = paints.find((p) => p._id === value);
            setEditFormData({
                ...editFormData,
                paint_system: value,
                paint_system_no: selectedPaint ? selectedPaint.paint_system_no : '',
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    }

    const handleSaveClick = async () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;

        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };

        setTableData(updatedData);
        setSubmitArr(updatedData);

        const updatedItem = updatedData[dataIndex];


        if (!updatedItem) {
            console.error("Updated item is undefined!");
            return;
        }

        const items = {
            "ass_weight": updatedItem.ass_weight,
            "ass_area": updatedItem.ass_area,
            "paint_system": updatedItem.paint_system,
            "remarks": updatedItem.remarks
        };

        const bodyFormData = new URLSearchParams();
        bodyFormData.append('items', JSON.stringify(items));
        bodyFormData.append('id', updatedItem._id);
        bodyFormData.append('item_detail_id', updatedItem.item_detail_id);

        try {
            const myurl = `${V_URL}/user/update-multi-dispatch-offer`;
            const response = await axios.post(myurl, bodyFormData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                },
            });

            if (response.data.success) {
                toast.success("Item updated successfully");
                setEditRowIndex(null);
                return response.data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };


    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            if (search) {
                computedComments = computedComments.filter(
                    (dr) =>
                        dr?.drawing_no.toString()?.toLowerCase()?.includes(search) ||
                        dr?.rev?.toString()?.toLowerCase()?.includes(search) ||
                        dr?.assembly_no?.toString()?.toLowerCase()?.includes(search) ||
                        dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search) ||
                        dr?.unit?.toLowerCase()?.includes(search) ||
                        dr?.sheet_no?.toLowerCase()?.includes(search)
                );
            }
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [limit, search, totalItems, currentPage, tableData]);

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            paint_system: row.paint_system,
            paint_system_no: paints.find(w => w._id === row.paint_system)?.paint_system,
            remarks: row.remarks,
        });
    }

    const handleRemoveByDrawing = async (elem) => {
        const removeItem = new URLSearchParams();
        removeItem.append('id', elem._id);
        try {
            const myurl = `${V_URL}/user/delete-multi-dispatch-offer`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: removeItem,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;
            if (data.success === true) {
                const balanceData = [{
                    "main_id": elem.main_id,
                    "dispatch_used_grid_qty": elem.dispatch_used_grid_qty,
                    "drawing_id": elem.drawing_id,
                    "grid_id": elem?.grid_id,
                }];
                const bodyFormData = new URLSearchParams();
                bodyFormData.append('items', JSON.stringify(balanceData));
                bodyFormData.append('is_delete', true)
                try {
                    const myurl = `${V_URL}/user/is-grid-balance-update`;
                    const response = await axios({
                        method: "post",
                        url: myurl,
                        data: bodyFormData,
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                        },
                    });
                    const data = response.data;
                    if (data.success === true) {
                        getDisaptchOfferTable()
                        toast.success("Item has been removed!");
                        return data;
                    } else {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    console.log(error, "error");
                    toast.error(error.response.data.message);
                    return error;
                }
                return data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(error.response.data.message);
            return error
        }
    }

    return (
        <>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card card-table show-entire">
                        <div className="card-body">
                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Section Details List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search
                                                            onSearch={(value) => {
                                                                setSearch(value.toLowerCase());
                                                                setCurrentPage(1);
                                                            }}
                                                        />
                                                        <a className="btn">
                                                            <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                                        </a>

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

                            <div className="table-responsive mt-2">
                                <table className="table border-0 custom-table comman-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Drawing No.</th>
                                            <th>Rev</th>
                                            <th>Assembly No.</th>
                                            <th>Assembly Qty.</th>
                                            <th>Grid No.</th>
                                            <th>Grid Qty.</th>
                                            <th>Used Grid Qty.</th>
                                            <th>Assem. Weight(kg)</th>
                                            <th>Assem. Area(sqm)</th>
                                            <th>Paint System</th>
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{elem?.drawing_no}</td>
                                                <td>{elem?.rev}</td>
                                                <td>{elem?.assembly_no}</td>
                                                <td>{elem?.assembly_quantity}</td>
                                                <td>{elem?.grid_no}</td>
                                                <td>{elem?.grid_qty}</td>
                                                <td>{elem?.dispatch_used_grid_qty}</td>
                                                <td>{elem?.ass_weight}</td>
                                                <td>{elem?.ass_area}</td>
                                                {!data?._id ? (
                                                    <>
                                                        {editRowIndex === i ? (
                                                            <>
                                                                <td>
                                                                    <div className='md-4'>
                                                                        <select
                                                                            className='form-control form-select'
                                                                            value={editFormData?.paint_system}
                                                                            name='paint_system'
                                                                            onChange={handleEditFormChange}
                                                                        >
                                                                            <option value=''>Select Paint</option>
                                                                            {paints?.map((elem, i) => (
                                                                                <option key={i} value={elem._id}>
                                                                                    {elem.paint_system_no}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <textarea className='form-control' rows={1}
                                                                        value={editFormData?.remarks} name='remarks'
                                                                        onChange={handleEditFormChange} />
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.paint_system_no || '-'}</td>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{elem?.paint_system_no || '-'}</td>
                                                        <td>{elem?.remarks || '-'}</td>
                                                    </>
                                                )}
                                                {editRowIndex === i ? (
                                                    <td>
                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                    </td>
                                                ) : <td className='text-end'>
                                                    {!data?._id ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger p-1 mx-1"
                                                            onClick={() => handleRemoveByDrawing(elem)}
                                                        >
                                                            Remove
                                                        </button>
                                                    ) : '-'}
                                                </td>}
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
        </>
    )
}

export default DispatchTable