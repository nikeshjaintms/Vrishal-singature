import { Check, Save, X } from 'lucide-react';
import React, { useState } from 'react'
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const SurafceClearanceTable = ({ commentsData, limit, setLimit, setSearch, setCurrentPage, currentPage, totalItems, tableData, setTableData }) => {
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        average_dft_primer: "",
        remark: ""
    });
console.log("tableData",tableData);
console.log("commentsData",commentsData);
    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData, is_accepted: acceptRejectStatus[editRowIndex] };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            average_dft_primer: row.average_dft_primer || '',
            remark: row.remark || ''
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleAcceptRejectClick = (index, isAccepted, name) => {
        Swal.fire({
            title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
            text: "Are you sure you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            dangerMode: !isAccepted,
        }).then((result) => {
            if (result.isConfirmed) {
                setAcceptRejectStatus((prev) => ({
                    ...prev,
                    [index]: isAccepted,
                }));
                toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
            }
        });
    };


    return (
        <>
            <div className='row'>
                <div className='col-sm-12'>
                    <div className='card card-table show-entire'>
                        <div className='card-body'>
                            <div className='page-table-header mb-2'>
                                <div className='row align-items-center'>
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Surface & Primer Clearance List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search onSearch={(value) => {
                                                            setSearch(value);
                                                            setCurrentPage(1);
                                                        }} />
                                                        <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                            alt="search" /></a>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        {/* <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} /> */}
                                    </div>
                                </div>
                            </div>
                            <div className='table-responsive mt-2'>
                                <table className='table border-0 custom-table comman-table mb-0'>
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Drawing No.</th>
                                            <th>Rev</th>
                                            <th>Assem. No.</th>
                                            <th>Assem. Qty.</th>
                                            <th>Grid No.</th>
                                            <th>Grid Qty.</th>
                                            <th>Average DFT Primer.</th>
                                            <th>Remark</th>
                                            <th>Acc/Rej</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData && commentsData.length > 0 ? (
                                            commentsData.map((elem, i) => (
                                                <tr key={i}>
                                                    <td>{(currentPage - 1) * limit + i + 1}</td>
                                                    <td>{elem?.drawing_no || '-'}</td>
                                                    <td>{elem?.rev}</td>
                                                    <td>{elem?.assembly_no || elem?.item_name || '-'}</td>
                                                    <td>{elem?.assembly_quantity || '-'}</td>
                                                    <td>{elem?.grid_no || '-'}</td>
                                                    <td>{ elem?.surface_used_grid_qty || '-'}</td>
                                                    {editRowIndex === i ? (
                                                        <>
                                                            <td>
                                                                <textarea
                                                                    className='form-control'
                                                                    name='average_dft_primer'
                                                                    onChange={handleEditFormChange}
                                                                    value={editFormData.average_dft_primer}
                                                                    rows={1}
                                                                />
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className='form-control'
                                                                    name='remark'
                                                                    onChange={handleEditFormChange}
                                                                    value={editFormData.remark}
                                                                    rows={1}
                                                                />
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td onClick={() => handleEditClick(i, elem)}>{elem?.average_dft_primer || <span>-</span>}</td>
                                                            <td onClick={() => handleEditClick(i, elem)}>{elem?.remark || <span>-</span>}</td>
                                                        </>
                                                    )}
                                                    {editRowIndex === i ? (
                                                        <td className=''>
                                                            <div className='d-flex gap-2'>
                                                                <span
                                                                    className={`present-table attent-status ${acceptRejectStatus[i] === true ? "selected" : ""}`}
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => handleAcceptRejectClick(i, true, elem?.grid_no)}
                                                                >
                                                                    <Check />
                                                                </span>
                                                                <span
                                                                    className={`absent-table attent-status ${acceptRejectStatus[i] === false ? "selected" : ""}`}
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => handleAcceptRejectClick(i, false, elem?.grid_no)}
                                                                >
                                                                    <X />
                                                                </span>
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td onClick={() => handleEditClick(i, elem)}>
                                                            {acceptRejectStatus[i] !== undefined ? (acceptRejectStatus[i] ? "Accepted" : "Rejected") : <span>-</span>}
                                                        </td>
                                                    )}
                                                    <td className='status-badge'>
                                                        {acceptRejectStatus[i] === true ? (
                                                            <span className='custom-badge status-green'>Acc</span>
                                                        ) : acceptRejectStatus[i] === false ? (
                                                            <span className='custom-badge status-pink'>Rej</span>
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {editRowIndex === i ? (
                                                            <>
                                                                <button type='button' className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                <button type='button' className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                            </>
                                                        ) : (
                                                            <span>-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan='10' className='text-center'>No Data Available</td>
                                            </tr>
                                        )}
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
            </div >
        </>
    )
}

export default SurafceClearanceTable