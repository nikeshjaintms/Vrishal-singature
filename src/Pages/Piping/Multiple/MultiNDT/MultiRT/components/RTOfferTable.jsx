import React, { useEffect, useMemo, useState } from 'react'
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiRtOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable';
import { Save, X } from 'lucide-react';
import { removeRTTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable';
import toast from 'react-hot-toast';

const RTOfferTable = ({ setSubmitArr, submitArr, rtOffers, handleRemoveOffer, rtType, handleUpdateThickness }) => {

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
        if (rtOffers) {
            setTableData(rtOffers);
        } else {
            const filterEntity = entity?.items?.filter((it) => !it?.ndt_offer_id)
            setTableData(filterEntity || []);
        }
    }, [entity, rtOffers]);

    useEffect(() => {
        if (loading === true && !rtOffers) {
            const typeId = localStorage.getItem('RT_TYPE_ID');
            const masterId = localStorage.getItem('RT_TYPE_MASTER_IDS')
            if (typeId && masterId) {
                dispatch(getMultiRtOfferTable({ typeId, masterId }))
            }
            setLoading(false);
        }
    }, [loading, rtOffers]);

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            computedComments = computedComments.filter(
                (rt) =>
                    rt.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    rt.joint_no?.toLowerCase()?.includes(search?.toLowerCase())
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
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            is_cover: row.is_cover || false,
            remarks: row.remarks || '',
            thickness: row.thickness || row.joint_thickness || '',
        });
    }

    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        const elem = updatedData[dataIndex];
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setSubmitArr(updatedData);
        setEditRowIndex(null);

        if (handleUpdateThickness) {
            handleUpdateThickness(elem?._id, elem?.joint_id, elem?.spool_id, editFormData.thickness);
        }
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleRefresh = () => {
        setLoading(true);
        setTableData([]);
    }

    const handleRemoveByDrawing = (itData) => {
        const offer_id = itData?._id;
        if (handleRemoveOffer && offer_id) {
            handleRemoveOffer(offer_id, itData);
        }
    }
    const getRtDisplay = (elem, rtType) => {
      const inspectionLabelMap = {
            'Repair': 'RP',
            'Re-Take': 'RT',
            'Re-Shoot': 'RS'
            // ❌ No "Initial"
        };

       const joint = elem?.joint_no || '';

    let label;

    // 👉 External uses inspection_type
    if (elem?.test_type === 'External') {
        label = inspectionLabelMap[elem?.inspection_type];
    } 

    // 👉 If no label, return only joint_no
    if (!label) return joint;

    return joint ? `${label} | ${joint}` : label;
    };
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
                                            <h3>Item List</h3>
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
                                            <th>Spool No.</th>
                                            <th>Piping Material Specification</th>
                                            <th>Joint No.</th>
                                            <th>Weldor No.</th>
                                            <th>Size</th>
                                            <th>Thickness</th>
                                            {/* <th>Is Cover</th> */}
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                <td>{elem?.drawing_no}</td>
                                                <td>{elem?.spool_no}</td>
                                                <td>{elem?.material_specification}</td>
                                                <td>{getRtDisplay(elem, rtType)}</td>
                                                <td>{elem?.welder_no}</td>
                                                <td>{elem?.joint_size}</td>
                                                <td>
                                                    {editRowIndex === i ? (
                                                        <input
                                                            className='form-control'
                                                            type="text"
                                                            name="thickness"
                                                            value={editFormData?.thickness}
                                                            onChange={handleEditFormChange}
                                                        />
                                                    ) : (
                                                        <span onClick={() => handleEditClick(i, elem)}>
                                                            {elem?.thickness || elem?.joint_thickness || '-'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {editRowIndex === i ? (
                                                        <textarea
                                                            className='form-control'
                                                            rows={1}
                                                            value={editFormData?.remarks}
                                                            name='remarks'
                                                            onChange={handleEditFormChange}
                                                        />
                                                    ) : (
                                                        <span onClick={() => handleEditClick(i, elem)}>
                                                            {elem?.remarks || '-'}
                                                        </span>
                                                    )}
                                                </td>
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