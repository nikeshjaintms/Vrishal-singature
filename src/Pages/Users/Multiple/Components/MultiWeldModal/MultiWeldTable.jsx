import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserWelderMaster } from '../../../../../Store/Store/WelderMaster/WelderMaster';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMultiFitup } from '../../../../../Store/MutipleDrawing/MultiFitup/getMultiFitup';
import { updateFitupGrid } from '../../../../../Store/MutipleDrawing/MultiWeldVisual/UpdateFitupGrid';
import { getWeldOfferTable } from '../../../../../Store/MutipleDrawing/MultiWeldVisual/getWeldOfferTable';
import { removeWeldOffTable } from '../../../../../Store/MutipleDrawing/MultiWeldVisual/removeWeldOfferTable';

const MultiWeldTable = ({ data, fitupId, finalArr, setSubmitArr }) => {

    const dispatch = useDispatch();
    const [search, setSearch] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        weldor_no: '',
        remarks: '',
        weldorName: '',
    });

    useEffect(() => {
        dispatch(getUserWelderMaster({ status: true }));
        dispatch(getDrawing());
    }, []);

    useEffect(() => {
        dispatch(getWeldOfferTable({ fitup_id: fitupId }));
    }, [finalArr, fitupId]);

    const welderData = useSelector((state) => state?.getUserWelderMaster?.user?.data);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const weldOfferTableData = useSelector((state) => state?.getWeldOfferTable?.user?.data);

    useEffect(() => {
        const filteredWeldor = weldOfferTableData?.items?.filter(item => item.weldor_no === null);

        if (filteredWeldor?.length > 0 && !data?._id) {
            setTableData(filteredWeldor || []);
            setSubmitArr(filteredWeldor || []);
        } else if (data?.items?.length > 0) {
            setTableData(data.items);
            setSubmitArr(data.items);
        } else {
            setTableData([]);
            setSubmitArr([]);
        }
    }, [finalArr, data, weldOfferTableData]);

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            weldor_no: row.weldor_no,
            remarks: row.remarks,
            weldorName: welderData.find(w => w._id === row.weldor_no)?.welderNo,
        })
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        const selectedWeldor = welderData.find(w => w._id === value);
        if (name === 'weldor_no' || name === 'weldorName') {
            setEditFormData({ ...editFormData, weldor_no: value, weldorName: selectedWeldor?.welderNo });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
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

    const getDrawingData = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            // computedComments = computedComments.filter(
            //     (dr) =>
            //         dr?.grid_item_id?.drawing_id?.drawing_no.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            //     // dr?.rev?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            //     // dr?.assembly_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            //     // dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
            //     // dr?.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
            //     // dr?.sheet_no?.toLowerCase()?.includes(search?.toLowerCase())
            // );
        }
        setTotalItems(computedComments?.length);
        // return computedComments?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
        return computedComments;
    }, [limit, search, totalItems, currentPage, tableData]);

    const handleRemoveByDrawing = async (itemId, report) => {
        if (!fitupId) {
            toast.error('Please select an issue');
            return;
        }
        const updatedIssueArr = tableData.filter((item) => (item._id)?.toString() === (itemId)?.toString());

        const bodyFormData = new URLSearchParams();
        bodyFormData.append('flag', 0);
        bodyFormData.append('items', JSON.stringify(updatedIssueArr));
        bodyFormData.append('fitup_id', fitupId);

        const removeItem = new URLSearchParams();
        removeItem.append('fitup_id', fitupId);
        removeItem.append('items', JSON.stringify(updatedIssueArr))
        removeItem.append('report_no', report);
        try {
            await dispatch(updateFitupGrid({ bodyFormData }));
            await dispatch(removeWeldOffTable({ bodyFormData: removeItem }))
            const updatedIssueArr1 = tableData.filter((item) => item._id !== itemId);
            dispatch(getMultiFitup());
            dispatch(getWeldOfferTable({ fitup_id: fitupId }));
            setTableData(updatedIssueArr1);
            setSubmitArr(updatedIssueArr1);
            toast.success("Item has been removed!");
        } catch (error) {
            toast.error('Error while removing');
        }
    };

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
                                        {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
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
                                            <th>Section Details</th>
                                            <th>Item No.</th>
                                            <th>Grid No.</th>
                                            <th>Grid Qty.</th>
                                            <th>Used Grid Qty.</th>
                                            <th>Type Of Weld</th>
                                            <th>WPS No.</th>
                                            <th>Welding Process</th>
                                            <th>Welder No.</th>
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{getDrawingData(elem?.drawing_id)?.drawing_no}</td>
                                                <td>{getDrawingData(elem?.drawing_id)?.rev}</td>
                                                <td>{getDrawingData(elem?.drawing_id)?.assembly_no}</td>
                                                <td>{getDrawingData(elem?.drawing_id)?.assembly_quantity}</td>
                                                <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                <td>{elem?.grid_item_id?.item_no}</td>
                                                <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                <td>{elem?.grid_item_id?.grid_id?.grid_qty}</td>
                                                <td>{elem?.weld_used_grid_qty}</td>
                                                <td>{elem.joint_type?.map((e) => e?.name).join(', ')}</td>
                                                <td>{elem?.wps_no?.wpsNo}</td>
                                                <td>{elem?.wps_no?.weldingProcess}</td>
                                                {!data?._id ? (
                                                    <>
                                                        {editRowIndex === i ? (
                                                            <>
                                                                <td>
                                                                    <select className='form-control form-select'
                                                                        value={editFormData.weldor_no} name='weldor_no'
                                                                        onChange={handleEditFormChange}>
                                                                        <option value="">Select Weldor No.</option>
                                                                        {welderData?.filter(we => we?.wpsNo?._id === elem?.wps_no?._id).map((e) =>
                                                                            <option key={e._id} value={e._id}>{e.welderNo}</option>
                                                                        )}
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <textarea className='form-control' rows={1}
                                                                        value={editFormData?.remarks} name='remarks'
                                                                        onChange={handleEditFormChange} />
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.weldorName || '-'}</td>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{elem?.weldor_no?.welderNo || '-'}</td>
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
                                                            onClick={() => handleRemoveByDrawing(elem._id, elem.report_no)}
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
        </>
    )
}

export default MultiWeldTable