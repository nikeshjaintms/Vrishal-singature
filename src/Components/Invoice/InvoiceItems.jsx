import React, { useEffect, useState } from 'react';
import InvoiceItemModel from './InvoiceItemModel';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../Store/Store/Item/Item';
import { Pencil, Trash2 } from 'lucide-react';

const InvoiceItems = ({ savedItems, setSavedItems }) => {

    const dispatch = useDispatch();
    const [modelShow, setModelShow] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    useEffect(() => {
        dispatch(getItem())
    }, [dispatch]);

    const itemData = useSelector((state) => state?.getItem?.user?.data);

    const handleEdit = (item, index) => {
        setCurrentItem({ ...item, index });
        setModelShow(true);
    };

    const handleDelete = (index) => {
        const newItems = savedItems.filter((_, i) => i !== index);
        setSavedItems(newItems);
    };

    return (
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                                <div className="form-heading">
                                    <h4>Section Details List</h4>
                                </div>

                                <div className="add-group">
                                    <button
                                        type="button"
                                        onClick={() => setModelShow(true)}
                                        className="btn btn-primary add-pluss ms-2"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="Add Material"
                                    >
                                        <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                    </button>
                                </div>

                            </div>
                        </form>

                        <div className="table-responsive">
                            <table className="table mb-0 custom-table table-striped comman-table">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Section Details</th>
                                        <th>Unit</th>
                                        <th>M Code</th>
                                        <th>Quantity</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th>GST</th>
                                        <th>Total Amount</th>
                                        <th className='text-end'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {savedItems.length > 0 ? (
                                        savedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{itemData?.find(it => it?._id === item?.item_id)?.name}</td>
                                                <td>{item.unit}</td>
                                                <td>{item.m_code}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.rate}</td>
                                                <td>{item.amount}</td>
                                                <td>{item.gst}</td>
                                                <td>{item.total_amount}</td>
                                                <td className="d-flex justify-content-end">
                                                    <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                        onClick={() => handleEdit(item, index)}
                                                        data-toggle="tooltip" data-placement="top" title="Edit">
                                                        <Pencil />
                                                    </a>
                                                    <a className='action-icon mx-1' style={{ cursor: "pointer" }}
                                                        onClick={() => handleDelete(index)}
                                                        data-toggle="tooltip" data-placement="top" title="Delete">
                                                        <Trash2 />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center">No items added yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <InvoiceItemModel
                modelShow={modelShow}
                handleClose={() => setModelShow(false)}
                setSavedItems={setSavedItems}
                savedItems={savedItems}
                currentItem={currentItem}
            />
        </div>
    )
}

export default InvoiceItems;
