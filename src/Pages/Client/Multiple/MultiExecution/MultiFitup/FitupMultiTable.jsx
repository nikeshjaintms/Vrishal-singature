import React, { useState } from 'react';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { MultiSelect } from 'primereact/multiselect';
import { Save, X } from 'lucide-react';


const FitupMultiTable = ({
    commentsData2,
    data,
    totalItems2,
    limit2,
    setlimit2,
    currentPage2,
    setCurrentPage2,
    setSearch2,
    editRowIndex,
    handleEditClick,
    handleEditFormChange,
    editFormData,
    handleSaveClick,
    handleCancelClick,
    handleRemoveByDrawing,
    jointTypeOptions,
    getDrawingData,
}) => {


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
                                                            setSearch2(value);
                                                            setCurrentPage2(1);
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
                                    <DropDown limit={limit2} onLimitChange={(val) => setlimit2(val)} />
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
                                        <th>Grid No.</th>
                                        <th>Item No.</th>
                                        <th>Issued. Qty.</th>
                                        <th>Issued. Width</th>
                                        <th>Issued. Length</th>
                                        <th>Imir No.</th>
                                        <th>Heat No.</th>
                                        {!data?._id && (
                                            <>
                                                <th>Joint Type</th>
                                                <th>Remarks</th>
                                            </>
                                        )}
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData2?.map((elem, i) => (
                                        <tr key={elem?._id}>
                                            <td>{i + 1}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.drawing_no}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.rev}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.assembly_no}</td>
                                            <td>{getDrawingData(elem?.drawing_id)?.assembly_quantity}</td>
                                            <td>{elem?.transaction_id?.itemName?.name}</td>
                                            <td>{elem?.transaction_id?.grid_no}</td>
                                            <td>{elem?.transaction_id?.item_no}</td>
                                            <td>{elem?.issued_qty}</td>
                                            <td>{elem?.issued_width}</td>
                                            <td>{elem?.issued_length}</td>
                                            <td>{elem?.imir_no}</td>
                                            <td>{elem?.heat_no}</td>
                                            {!data?._id && (
                                                editRowIndex === i ? (
                                                    <>
                                                        <td>
                                                            <MultiSelect
                                                                value={editFormData?.joint_type || []}
                                                                onChange={(e) =>
                                                                    handleEditFormChange({ target: { name: 'joint_type', value: e.value } })
                                                                }
                                                                options={jointTypeOptions}
                                                                optionLabel="label"
                                                                placeholder="Select Joint Type"
                                                                display="chip"
                                                                className="w-100 multi-prime-react"
                                                            />
                                                        </td>
                                                        <td>
                                                            <textarea
                                                                className='form-control'
                                                                rows={1}
                                                                value={editFormData?.remarks}
                                                                name='remarks'
                                                                onChange={handleEditFormChange}
                                                            />
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td onClick={() => handleEditClick(i, elem)}>
                                                            {elem?.jointTypeName || '--'}
                                                        </td>
                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                    </>
                                                )
                                            )}
                                            {editRowIndex === i ? (
                                                <td>
                                                    <button
                                                        type="button"
                                                        className='btn btn-success p-1 mx-1'
                                                        onClick={handleSaveClick}
                                                    >
                                                        <Save />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className='btn btn-secondary p-1 mx-1'
                                                        onClick={handleCancelClick}
                                                    >
                                                        <X />
                                                    </button>
                                                </td>
                                            ) : (
                                                <td className='text-end'>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger p-1 mx-1"
                                                        onClick={() => handleRemoveByDrawing(elem.drawing_id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}

                                    {commentsData2?.length === 0 && (
                                        <tr>
                                            <td colSpan="999">
                                                <div className="no-table-data">No Data Found!</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="row align-center mt-3 mb-2">
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                <div className="dataTables_info" role="status" aria-live="polite">
                                    Showing {Math.min(limit2, totalItems2)} from {totalItems2} data
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                <div className="dataTables_paginate paging_simple_numbers">
                                    <Pagination
                                        total={totalItems2}
                                        itemsPerPage={limit2}
                                        currentPage={currentPage2}
                                        onPageChange={(page) => setCurrentPage2(page)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FitupMultiTable