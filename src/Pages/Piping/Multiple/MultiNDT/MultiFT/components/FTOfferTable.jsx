import React, { useEffect, useMemo, useState } from 'react'
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiRtOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable';
import { Save, X } from 'lucide-react';
import { removeRTTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../../BaseUrl';
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserWeldFtPiping } from '../../../../../../Store/Piping/WeldFt/WeldFtPiping';

const FTOfferTable = ({
    setSubmitArr,
    submitArr,
    ftData,
    ftPagination,
    offerPage,
    setOfferPage,
    offerLimit,
    setOfferLimit,
    setOfferSearch
}) => {

    const dispatch = useDispatch();
    const [tableData, setTableData] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [limit, setlimit] = useState(10);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        is_cover: false,
        remarks: '',
        thickness: "",
    });


    useEffect(() => {
        if (ftData && Array.isArray(ftData)) {
            const getVal = (val) => (Array.isArray(val) ? val[0] : val);
            const allItems = ftData.map(item => ({
                ...item,
                // Fallback for fields that might be nested or direct
                drawing_no: getVal(item.drawing_no) || '--',
                spool_no: getVal(item.spool_no) || '--',
                rev: getVal(item.rev) || '--',
                // Use the string values from your JSON if IDs are missing
                material_spec: item.material_specification || item.piping_material_specification_id?.name || '--',
                size: item.size || item.size_id?.name || '--',
                thickness: item.thickness || item.thickness_id?.name || '--',
                joint_type: item.joint_type || item.joint_type_id?.name || '--',
                main_id: getVal(item.main_id),
                main_item_id: getVal(item.main_item_id),
            }));
            setTableData(allItems);
            setSubmitArr(allItems);
        }
    }, [ftData, setSubmitArr]);


    const commentsData = useMemo(() => {
        return tableData; // Data is already paginated from server
    }, [tableData]);

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
            thickness: row.thickness || '',
        });
    }

    const handleSaveClick = async () => {
        const dataIndex = editRowIndex;
        const row = tableData[dataIndex];
        const targetId = row._id || row.id;
        const projectId = localStorage.getItem("U_PROJECT_ID");

        if (!targetId || !projectId) {
            return toast.error("Required data missing");
        }

        const updateData = new URLSearchParams();
        updateData.append("main_id", row?.main_id);
        updateData.append("main_item_id", row?.main_item_id);
        updateData.append("id", targetId);
        updateData.append("project_id", projectId);
        updateData.append("remarks", editFormData.remarks);

        try {
            const response = await axios.post(
                `${V_URL}/user/piping-update-multi-ft-offer`,
                updateData,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.data?.success) {
                toast.success("Remarks updated successfully");
                const updatedData = [...tableData];
                updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
                setTableData(updatedData);
                setSubmitArr(updatedData);
                setEditRowIndex(null);
                 
            } else {
                toast.error(response.data?.message || "Failed to update remarks");
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || "Server error occurred");
        }
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleRefresh = () => {
        setLoading(true);
        setTableData([]);
    }

    const handleRemoveByDrawing = async (elem) => {
        // 1. Get the target ID
        const targetId = elem._id || elem.id;

        if (!targetId) {
            return toast.error("Invalid Item: No ID found");
        }

        // 2. Get project_id from localStorage
        const projectId = localStorage.getItem("U_PROJECT_ID");

        if (!projectId) {
            return toast.error("Project ID not found");
        }

        // 3. Show confirmation popup
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action will remove the FT Offer permanently!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return; // User cancelled
        }

        // 4. Prepare the form data
        const removeItem = new URLSearchParams();
        removeItem.append("main_id", elem?.main_id);
        removeItem.append("main_item_id", elem?.main_item_id);
        removeItem.append("id", targetId);
        removeItem.append("project_id", projectId);

        try {
            const response = await axios.post(
                `${V_URL}/user/piping-delete-multi-ft-offer`,
                removeItem,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.data?.success) {
                toast.success("FT Offer removed successfully");

                // 5. Update local table state
                const updatedData = tableData.filter(item =>
                    (item._id !== targetId) && (item.id !== targetId)
                );
                setTableData(updatedData);

                // 6. Keep parent submit array in sync
                setSubmitArr(updatedData);
                dispatch(getUserWeldFtPiping({
                        page: currentPage,
                        limit,
                        search
                    }));
            } else {
                toast.error(response.data?.message || "Failed to delete item");
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || "Server error occurred");
        }
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
                                            <h3>FT Item List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search
                                                            onSearch={(value) => {
                                                                setOfferSearch(value);
                                                                setOfferPage(1);
                                                            }} />
                                                        <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                            alt="search" /></a>
                                                    </form>
                                                </div>
                                                {/* <div className="add-group">
                                                    <button type='button' onClick={handleRefresh}
                                                        className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                            src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        {/* <DropDown limit={offerLimit} onLimitChange={(val) => setOfferLimit(val)} /> */}
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
                                            <th>Spool No.</th>
                                            <th>Joint No.</th>
                                            <th>Piping Material Specification</th>
                                            <th>Size</th>
                                            <th>Thickness</th>
                                            <th>Joint Type</th>
                                            <th>Remarks</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{(offerPage - 1) * offerLimit + i + 1}</td>
                                                <td>{elem.drawing_no}</td>
                                                <td>{elem.rev || '0'}</td>
                                                <td>{elem.spool_no}</td>
                                                <td>{elem.joint_no || '--'}</td>
                                                <td>{elem.material_spec}</td>
                                                <td>{elem.size}</td>
                                                <td>{elem.thickness}</td>
                                                <td>{elem.joint_type}</td>
                                                <td
                                                    onClick={() => editRowIndex !== i && handleEditClick(i, elem)}
                                                    style={{ cursor: editRowIndex !== i ? 'pointer' : 'default' }}
                                                >
                                                    {editRowIndex === i ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="remarks"
                                                            value={editFormData.remarks}
                                                            onChange={handleEditFormChange}
                                                            placeholder="Remarks"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        elem?.remarks || '--'
                                                    )}
                                                </td>

                                                <td className="text-end">
                                                    {editRowIndex === i ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-success p-1 mx-1"
                                                                onClick={handleSaveClick}
                                                            >
                                                                <Save size={16} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary p-1 mx-1"
                                                                onClick={handleCancelClick}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger p-1"
                                                                onClick={() => handleRemoveByDrawing(elem)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </>
                                                    )}
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
                                {/* <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                    <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                        aria-live="polite">Showing {commentsData?.length || 0} from {ftPagination?.totalItems || 0} data</div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                    <div className="dataTables_paginate paging_simple_numbers"
                                        id="DataTables_Table_0_paginate">
                                        <Pagination
                                            total={ftPagination?.totalItems || 0}
                                            itemsPerPage={offerLimit}
                                            currentPage={offerPage}
                                            onPageChange={(page) => setOfferPage(page)}
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FTOfferTable