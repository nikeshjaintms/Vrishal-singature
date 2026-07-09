import React, { useEffect, useMemo, useState } from 'react'
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiRtOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable';
import { Save, X } from 'lucide-react';
import { removeRTTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable';
import toast from 'react-hot-toast';

const RTOfferTable = ({ setSubmitArr, submitArr }) => {

    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        is_cover: false,
        remarks: '',
        thickness: "",
    });

    const entity = useSelector((state) => state?.getMultiRtOfferTable?.user?.data);
    useEffect(() => {
        if (loading === true) {
            const typeId = localStorage.getItem('RT_TYPE_ID');
            const masterId = localStorage.getItem('RT_TYPE_MASTER_IDS')
            if (typeId && masterId) {
                dispatch(getMultiRtOfferTable({ typeId, masterId }))
            }
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        const filterEntity = entity?.items?.filter((it) => !it?.ndt_offer_id)
        setTableData(filterEntity || []);
    }, [entity]);

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        // computedComments = computedComments?.filter((co) => !co?.ndt_offer_id);
        if (search) {
            computedComments = computedComments.filter(
                (rt) =>
                    rt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    rt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, tableData]);

    const handleEditFormChange = (e) => {
        const { name, value, checked, type } = e.target;
        setEditFormData({
            ...editFormData,
            // [name]: value,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            is_cover: row.is_cover,
            remarks: row.remarks,
            thickness: row.thickness,
        });
    }

    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setSubmitArr(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleRefresh = () => {
        setLoading(true);
        setTableData([]);
    }

    const handleRemoveByDrawing = (itData) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('ndt_master_id', itData.ndt_master_id);
        bodyFormData.append('ndt_type_id', itData.ndt_type_id);
        bodyFormData.append('item_id', itData._id)
        dispatch(removeRTTable({ bodyFormData })).then((response) => {
            const { data, message, success } = response?.payload;
            if (success === true) {
                handleRefresh();
                toast.success(message);
            }
        });
    }

    return (
        <>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card card-table show-entire">
                        <div className="card-body">

                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Section List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search
                                                            onSearch={(value) => {
                                                                setSearch(value);
                                                                setCurrentPage(1);
                                                            }} />
                                                        {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                        <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                            alt="search" /></a>
                                                    </form>
                                                </div>
                                                <div className="add-group">
                                                    <button type='button' onClick={handleRefresh}
                                                        className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                            src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
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
                                <table className="table border-0 custom-table comman-table  mb-0">
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
                                            <th>Offered Data</th>
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                <td>{elem?.grid_item_id?.drawing_id?.drawing_no}</td>
                                                <td>{elem?.grid_item_id?.drawing_id?.rev}</td>
                                                <td>{elem?.grid_item_id?.drawing_id?.assembly_no}</td>
                                                <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                <td>{elem?.grid_item_id?.item_no}</td>
                                                <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                <td>{elem?.rt_use_qty}</td>
                                                <td>{elem?.joint_type?.map((e) => e?.name).join(", ")}</td>
                                                <td>{elem?.wps_no?.weldingProcess}</td>
                                                <td>{elem?.weldor_no?.welderNo}</td>
                                                {/* <td>{elem?.thickness}</td> */}
                                                {editRowIndex === i ? (
                                                    <>
                                                        <td>
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                name="thickness"
                                                                value={editFormData?.thickness}
                                                                onChange={handleEditFormChange}
                                                            />
                                                        </td>
                                                        <td className=''>
                                                            <div className="form-check form-switch d-flex align-items-center">
                                                                <input className="form-check-input" type="checkbox" name="is_cover" checked={editFormData?.is_cover} style={{ width: '30px', height: '16px' }}
                                                                    onChange={handleEditFormChange} />
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
                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.thickness || "-"}</td>
                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.is_cover === true ? <span className='custom-badge status-green'>True</span> : '-'}</td>
                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                    </>
                                                )}
                                                {editRowIndex === i ? (
                                                    <td>
                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                    </td>
                                                ) : <td className='text-end'>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger p-1 mx-1"
                                                        onClick={() => handleRemoveByDrawing(elem)}
                                                    >
                                                        Remove
                                                    </button>
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

export default RTOfferTable