import React, { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react';
import { PLAN, V_URL } from '../../BaseUrl';
import DownloadFormat from '../DownloadFormat/DownloadFormat';
import UploadFile from '../DownloadFormat/UploadFile';
import { useDispatch } from 'react-redux';
import { getUserDrawTrasaction } from '../../Store/Store/TransactionItem/getDrawTransaction';

const DrawSectionTable = ({ transactionData, handleSave, handleDelete, handleEdit, finalId, dataId, fetchTransactionData }) => {

    const groupedData = transactionData?.reduce((acc, item) => {
        const gridNo = item?.grid_id?.grid_no || "Unknown";
        const gridQty = item?.grid_id?.grid_qty || 1;
        const key = `${gridNo}-${gridQty}`;

        if (!acc[key]) {
            acc[key] = { gridNo, gridQty, totalWeight: 0, totalArea: 0 };
        }
        acc[key].totalWeight += (parseFloat(item.assembly_weight) || 0) * gridQty;
        acc[key].totalArea += (parseFloat(item.assembly_surface_area) || 0) * gridQty;
        return acc;
    }, {});

    return (
        <div className="card">
            <div className="card-body">
                <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                    <div className="form-heading">
                        <h4>Section Details List</h4>
                    </div>
                    {localStorage.getItem('ERP_ROLE') === PLAN && (finalId || dataId) && (
                        <>
                            <div className="add-group">
                                {/* <div>
                                    <UploadFile url={`${V_URL}/user/import-drawing-item`} importId={finalId || dataId} onUploadSuccess={fetchTransactionData} />
                                </div> */}
                                <div>
                                    <DownloadFormat url={`${V_URL}/user/drawing-item-import-sample`} fileName={"Drawing-item"} />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="btn btn-primary add-pluss ms-2"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Add Material">
                                    <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
                {transactionData?.length > 0 ? (
                    <>
                        <div className="table-responsive">
                            <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Grid No.</th>
                                        <th>Grid Qty.</th>
                                        <th>Section Details</th>
                                        <th>Item No.</th>
                                        <th>Item Qty.</th>
                                        <th>Length(mm)</th>
                                        <th>Width(mm)</th>
                                        <th>Item Weight(kg)</th>
                                        <th>Assem. Weight(kg)</th>
                                        <th>ASM(sqm)</th>
                                        <th>Joint Type</th>
                                        {localStorage.getItem('ERP_ROLE') === PLAN && <th className="text-end">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionData?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item?.grid_id?.grid_no}</td>
                                            <td>{item?.grid_id?.grid_qty}</td>
                                            <td>{item.item_name?.name}</td>
                                            <td>{item.item_no}</td>
                                            <td>{item.item_qty || '-'}</td>
                                            <td>{item.item_length || '-'}</td>
                                            <td>{item.item_width || '-'}</td>
                                            <td>{item.item_weight || '-'}</td>
                                            <td>{item.assembly_weight || '-'}</td>
                                            <td>{item.assembly_surface_area || '-'}</td>
                                            <td>{item?.joint_type?.map((e) => e?.name).join(', ') || '-'}</td>
                                            {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                <td className="d-flex justify-content-end">
                                                    <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                        data-toggle="tooltip" data-placement="top" title="Edit"
                                                        onClick={() => handleEdit(item)}>
                                                        <Pencil />
                                                    </a>
                                                    <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                        data-toggle="tooltip" data-placement="top" title="Delete"
                                                        onClick={() => handleDelete(item?._id, item.itemName?.name)}>
                                                        <Trash2 />
                                                    </a>
                                                </td>
                                            }
                                        </tr>
                                    ))}

                                    <tr>
                                        <td colSpan="9" className="text-end"><strong>Total</strong></td>
                                        <td><strong>{transactionData?.reduce((sum, item) => sum + (parseFloat(item.assembly_weight) || 0), 0).toFixed(2)}</strong></td>
                                        <td><strong>{transactionData?.reduce((sum, item) => sum + (parseFloat(item.assembly_surface_area) || 0), 0).toFixed(2)}</strong></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            {/* <h5>Grid-wise Summary</h5> */}
                            <table className="table border-0 custom-table">
                                <thead>
                                    <tr>
                                        <th>Grid No.</th>
                                        <th>Grid Qty.</th>
                                        <th>Unit Assem. Weight(kg)</th>
                                        <th>Total Assem. Weight(kg)</th>
                                        <th>Unit ASM(sqm)</th>
                                        <th>Total ASM(sqm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(groupedData).map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.gridNo}</td>
                                            <td>{data.gridQty}</td>
                                            <td>{(data.totalWeight / data.gridQty).toFixed(2)}</td>
                                            <td>{data.totalWeight.toFixed(2)}</td>
                                            <td>{(data.totalArea / data.gridQty).toFixed(2)}</td>
                                            <td>{data.totalArea.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : <p>"No section details found. You can add new sections by clicking the 'plus (+)' button."</p>}
            </div>
        </div>
    )
}

export default DrawSectionTable