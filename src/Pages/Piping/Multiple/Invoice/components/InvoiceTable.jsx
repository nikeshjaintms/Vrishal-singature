import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {Dropdown}  from 'primereact/dropdown';

const InvoiceTable = ({ newItem, handleInputChange, handleAddItem, editIndex, items, handleEditItem, handleDeleteItem, totals, itemErrors, gstType, taxRate, units }) => {

    items = items.map(item => ({
        ...item,
        unit: units.find(unit => unit.value === item.unit)?.label || ''
    }));
    return (
        <div className='row'>
            <div className="col-md-12">
                <div className="card card-table show-entire p-1">
                    <div className="card-body">
                        <div className="page-table-header mb-2">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="doctor-table-blk justify-content-center">
                                        <h3 style={{ fontSize: "20px" }}>TAX INVOICE</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive mt-4">
                            <table className="table table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <th>ITEM NO.</th>
                                        <th>DESCRIPTION</th>
                                        <th>INVOICE QUANTITY</th>
                                        <th>UOMs</th>
                                        <th>UNIT RATE(INR)</th>
                                        <th>PO QTY</th>
                                        <th>PO AMOUNT(INR)</th>
                                        <th colSpan="3" className="text-center">INVOICE AMOUNT (INR)</th>
                                        <th>Remarks</th>
                                        <th className='text-end'>Actions</th>
                                    </tr>
                                    <tr>
                                        <th colSpan="6"></th>
                                        <th>UPTO PREVIOUS</th>
                                        <th>THIS INVOICE</th>
                                        <th>CUMULATIVE</th>
                                        <th colSpan="2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input type="number" name="item_no" className="form-control" value={newItem.item_no} onChange={handleInputChange} />
                                        </td>
                                        <td>
                                            <textarea name="description" className="form-control" value={newItem.description} onChange={handleInputChange} />
                                            {itemErrors.description && <small className="text-danger">{itemErrors.description}</small>}
                                        </td>
                                        <td>
                                            <input type="number" name="quantity" className="form-control" value={newItem.quantity} onChange={handleInputChange} />
                                            {itemErrors.quantity && <small className="text-danger">{itemErrors.quantity}</small>}
                                        </td>
                                         <td>
                                            {/* <input type="number" name="quantity" className="form-control" value={newItem.unit} onChange={handleInputChange} /> */}
                                            <Dropdown value={newItem.unit}
                                                options={units}
                                                onChange={handleInputChange}
                                                name="unit"
                                                placeholder="Select Unit"
                                                className=" w-100" />
                                            
                                            {itemErrors.unit && <small className="text-danger">{itemErrors.unit}</small>}
                                        </td>
                                        <td>
                                            <input type="number" name="unitRate" className="form-control" value={newItem.unitRate} onChange={handleInputChange} />
                                            {itemErrors.unitRate && <small className="text-danger">{itemErrors.unitRate}</small>}
                                        </td>
                                        <td>
                                            <input type="number" name="poQty" className="form-control" value={newItem.poQty} onChange={handleInputChange} />
                                            {itemErrors.poQty && <small className="text-danger">{itemErrors.poQty}</small>}
                                        </td>
                                        <td><input type="number" name="poAmount" className="form-control" value={newItem.poAmount} disabled /></td>
                                        <td><input type="number" name="uptoPrevious" className="form-control" value={newItem.uptoPrevious} onChange={handleInputChange} /></td>
                                        <td><input type="number" name="thisInvoice" className="form-control" value={newItem.thisInvoice} disabled /></td>
                                        <td><input type="number" name="cummilative" className="form-control" value={newItem.cummilative} disabled /></td>
                                        <td><textarea name="remarks" className="form-control" value={newItem.remarks} onChange={handleInputChange} /></td>
                                        <td className='text-end'>
                                            <button type="button" className="btn btn-success m-3" onClick={handleAddItem}>
                                                {editIndex !== null ? "Update" : "Add"}
                                            </button>
                                        </td>
                                    </tr>
                                    {items.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.item_no}</td>
                                            <td>{item.description}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.unitRate}</td>
                                            <td>{item.poQty}</td>
                                            <td>{item.poAmount}</td>
                                            <td>{item.uptoPrevious}</td>
                                            <td>{item.thisInvoice}</td>
                                            <td>{item.cummilative}</td>
                                            <td>{item.remarks || '-'}</td>
                                            <td className="d-flex justify-content-end">
                                                <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                    data-toggle="tooltip" data-placement="top" title="Edit"
                                                    onClick={() => handleEditItem(index)}>
                                                    <Pencil />
                                                </a>
                                                <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                    data-toggle="tooltip" data-placement="top" title="Delete"
                                                    onClick={() => handleDeleteItem(index)}>
                                                    <Trash2 />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="table-responsive mt-4">
                                <table className="table table-bordered mb-0">
                                    <tbody>
                                        <tr>
                                            <td>TOTAL AMOUNT BEFORE TAX</td>
                                            <td>{totals?.totalAmountBeforeTax?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                        <tr>
                                            <td>ADD : CGST ({taxRate / 2}%)</td>
                                            <td>{totals?.cgst?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                        <tr>
                                            <td>ADD : SGST ({taxRate / 2}%)</td>
                                            <td>{totals?.sgst?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                        <tr>
                                            <td>ADD : IGST ({taxRate}%)</td>
                                            <td>{totals?.igst?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                        <tr>
                                            <td>TAX AMOUNT OF GST</td>
                                            <td>0.00</td>
                                        </tr>
                                        <tr>
                                            <td><strong>TOTAL AMOUNT AFTER TAX</strong></td>
                                            <td><strong>{totals?.totalAmountAfterTax?.toFixed(2) || '0.00'}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceTable;
