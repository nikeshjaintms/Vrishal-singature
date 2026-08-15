import React, { useEffect, useMemo, useState } from 'react'
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getUserJointType } from '../../../../../Store/Store/JointType/JointType';
import { MultiSelect } from 'primereact/multiselect';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateIssueAccGrid } from '../../../../../Store/MutipleDrawing/IssueAcc/UpdateIssueAccGrid';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { getFitupOfferTable } from '../../../../../Store/MutipleDrawing/MultiFitup/getFitupOfferTable';
import { removeFitupOffTable } from '../../../../../Store/MutipleDrawing/MultiFitup/removeFitupOffertable';
import { getMultiDrawingItems } from '../../../../../Store/MutipleDrawing/MultipleDrawing/GetMultiGridItems';

const MultipleFitupTable = ({ data, issueId, finalArr, setSubmitArr }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ joint_type: [], remarks: '', jointTypeName: [] });
    const [drawingIds, setDrawingIds] = useState([]);

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getUserJointType({ status: true }));
    }, []);

    useEffect(() => {
        if(issueId){
            dispatch(getFitupOfferTable({ issue_id: issueId }));
        }
    }, [issueId, finalArr]);

    useEffect(() => {
        if (drawingIds.length > 0) {
            dispatch(getMultiDrawingItems(drawingIds));
        }
    }, [drawingIds]);

    const jointData = useSelector((state) => state?.getUserJointType?.user?.data);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const fitupOfferTableData = useSelector((state) => state?.getFitupOfferTable?.user?.data);
    const gridItemsData = useSelector((state) => state?.getMultiDrawingItems?.user?.data);

    useEffect(() => {
        const filteredJointType = fitupOfferTableData?.items?.filter(item => !item.joint_type || item.joint_type.length === 0);
        const matchIds = filteredJointType?.map(item => item?.grid_item_id?._id);
        const filerGridItems = gridItemsData?.filter((gId) => matchIds?.includes(gId?._id));
        if (!data?._id) {
            const uniqueDrawingIds = [
                ...new Set(filteredJointType?.map(item => item?.drawing_id))
            ];
            setDrawingIds(uniqueDrawingIds);
        }
        if (fitupOfferTableData?.issue_id === issueId && filteredJointType?.length > 0 && !data?._id) {
            const updatedTableData = filteredJointType?.map((row) => {
                const match = filerGridItems?.find(gItem => gItem._id === row.grid_item_id?._id);
                if (match) {
                    const jointType = match.joint_type || [];
                    const jointTypeNames = jointType.map(j => j.name).join(', ');
                    return {
                        ...row,
                        joint_type: jointType.map(j => j._id),
                        jointTypeName: jointTypeNames,
                    };
                }
                return {
                    ...row,
                    joint_type: [],
                    jointTypeName: '',
                };
            });

        

            setTableData(updatedTableData || []);
            setSubmitArr(updatedTableData || []);
        }
        else if (data?.items?.length > 0) {
            setTableData(data.items);
            setSubmitArr(data.items);
        } else {
            setTableData([]);
            setSubmitArr([]);
        }
    }, [finalArr, data, fitupOfferTableData]);


    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({ joint_type: Array.isArray(row.joint_type) ? row.joint_type : [], remarks: row.remarks });
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'joint_type') {
            const selectedJointNames = jointData
                .filter((joint) => value.includes(joint._id))
                .map((joint) => joint.name);
            setEditFormData({
                ...editFormData,
                joint_type: value,
                jointTypeName: selectedJointNames.join(', '),
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    };

    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = {
            ...updatedData[dataIndex],
            joint_type: editFormData.joint_type,
            remarks: editFormData.remarks,
            jointTypeName: editFormData.jointTypeName,
        };
        setTableData(updatedData);
        setSubmitArr(updatedData);
        setEditRowIndex(null);
    };

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleRemoveByDrawing = async (itemId, report) => {
        if (!issueId) {
            toast.error('Please select an issue');
            return;
        }
        const updatedIssueArr = tableData.filter((item) => (item._id)?.toString() === (itemId)?.toString());
        const formData = new URLSearchParams();
        formData.append('flag', 0)
        formData.append('items', JSON.stringify(updatedIssueArr));
        formData.append('issueId', issueId);

        const removeItem = new URLSearchParams();
        removeItem.append('issue_id', issueId);
        removeItem.append('items', JSON.stringify(updatedIssueArr))
        removeItem.append('report_no', report);
        try {
            await dispatch(updateIssueAccGrid({ bodyFormData: formData }));
            await dispatch(removeFitupOffTable({ bodyFormData: removeItem }))
            const updatedIssueArr1 = tableData.filter((item) => item._id !== itemId);
            dispatch(getMultipleIssueAcc());
            dispatch(getFitupOfferTable({ issue_id: issueId }))
            setTableData(updatedIssueArr1);
            setSubmitArr(updatedIssueArr1);
            toast.success("Item has been removed!");
        } catch (error) {
            toast.error('Error while removing');
        }
    };

    const getDrawingData = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }

    const commentsData = useMemo(() => {
        let computedComments = tableData;

        if (search) {
            computedComments = computedComments.filter((elem) => {
                const drawingNo = getDrawingData(elem?.drawing_id)?.drawing_no?.toLowerCase() || '';
                const sectionDetails = elem?.grid_item_id?.item_name?.name?.toLowerCase() || '';
                const itemNo = elem?.grid_item_id?.item_no?.toLowerCase() || '';
                const gridNo = elem?.grid_item_id?.grid_id?.grid_no?.toLowerCase() || '';

                return (
                    drawingNo.includes(search) ||
                    sectionDetails.includes(search) ||
                    itemNo.includes(search) ||
                    gridNo.includes(search)
                );
            });
        }
        return computedComments;
    }, [limit, search, totalItems, currentPage, tableData]);

    const jointTypeOptions = jointData?.map((n) => ({
        label: n?.name,
        value: n?._id
    }));

    return (
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
                                        {/* <th>Grid Qty.</th> */}
                                        <th>Used Grid Qty.</th>
                                        <th>Joint Type</th>
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData?.map((elem, i) =>
                                        <tr key={i}>
                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.drawing_no}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.rev}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.assembly_no}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.assembly_quantity}</td>
                                            <td>{elem?.grid_item_id?.item_name?.name}</td>
                                            <td>{elem?.grid_item_id?.item_no}</td>
                                            <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                            {/* <td>{elem?.grid_item_id?.grid_id?.grid_qty}</td> */}
                                            <td>{elem?.fitOff_used_grid_qty}</td>
                                            {!data?._id ? (
                                                <>
                                                    {editRowIndex === i ? (
                                                        <>
                                                            <td>
                                                                <MultiSelect
                                                                    value={editFormData?.joint_type || []}
                                                                    onChange={(e) => handleEditFormChange({ target: { name: 'joint_type', value: e.value } })}
                                                                    options={jointTypeOptions}
                                                                    optionLabel="label"
                                                                    placeholder="Select Joint Type"
                                                                    display="chip"
                                                                    className="w-100 multi-prime-react"
                                                                />
                                                            </td>
                                                            <td>
                                                                <textarea className='form-control' rows={1}
                                                                    value={editFormData?.remarks} name='remarks'
                                                                    onChange={handleEditFormChange} />
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td onClick={() => handleEditClick(i, elem)}>
                                                                {elem?.jointTypeName || '-'}
                                                            </td>
                                                            <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                        </>
                                                    )}
                                                </>
                                            ) :
                                                <>
                                                    <td>{elem?.joint_type?.map((e) => e?.name).join(', ')}</td>
                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                </>
                                            }
                                            {!data?._id ? (
                                                <>
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
                                                </>
                                            ) : (<td className='text-end'>-</td>)}
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
    )
}

export default MultipleFitupTable