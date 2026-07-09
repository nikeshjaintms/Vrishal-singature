import { Pencil, Trash2 } from 'lucide-react'
import React from 'react'

const POItemsTable = ({ data, onAddItem, onDeleteItem }) => {

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-12 d-flex justify-content-between align-items-center">
                            <div className="form-heading">
                                <h4 className="mb-0">Items Details</h4>
                            </div>
                            <div className="add-group">
                                <button onClick={onAddItem} className="btn btn-primary add-pluss ms-2">
                                    <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                </button>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table border-0 custom-table comman-table  mb-0">
                                        <thead>
                                            <tr>
                                                <th>Sr No.</th>
                                                <th>Item Name</th>
                                                <th>Category Name</th>
                                                <th>Unit</th>
                                                <th>Item Brand</th>
                                                <th>PO QTY</th>
                                                <th >Rate</th>
                                                <th >Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((elem, i) =>
                                                <tr key={elem?.detail_id}>
                                                    <td>{i + 1}</td>
                                                    <td >{elem?.item_data?.name}</td>
                                                    <td >{elem.category_data?.name}</td>
                                                    <td>{elem?.unit}</td>
                                                    <td>{elem?.item_brand}</td>
                                                    <td >{elem.quantity}</td>
                                                    <td >{elem.rate}</td>
                                                    <td >{elem.remarks}</td>
                                                    <td className="justify-content-end d-flex">
                                                        {/* <button
                                                            className="action-icon mx-1"
                                                        >
                                                            <Pencil />
                                                        </button> */}
                                                        <button
                                                            className="action-icon mx-1"
                                                            onClick={() => onDeleteItem(elem?.detail_id, elem?.item_data?.name)}
                                                        >
                                                            <Trash2 />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                            {data?.length === 0 ? (
                                                <tr>
                                                    <td colspan="999">
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
            </div>
        </div>
    )
}

export default POItemsTable