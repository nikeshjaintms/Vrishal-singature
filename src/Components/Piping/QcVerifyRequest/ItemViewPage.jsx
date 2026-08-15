import React from 'react';
import moment from 'moment';
import { FileText } from 'lucide-react';

// OfferDetails Component
const OfferDetails = ({ data }) => {

    console.log(data, 'data');

    return (
        <div className="card">
            <div className="card-body">
                <div className="col-12">
                    <div className="form-heading">
                        <h4>View Inspection Offer Details</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                            <label>Offered No.</label>
                            <input className="form-control" value={data?.offer_no} readOnly />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                            <label>Offered Date</label>
                            <input className="form-control" value={moment(data?.received_date).format('YYYY-MM-DD')} readOnly />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                            <label>Offered By </label>
                            <input className="form-control" value={data?.offeredBy?.user_name} readOnly />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                            <label>Invoice No.</label>
                            <input className="form-control" value={data?.invoice_no} readOnly />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                            <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                            <span className={`custom-badge ${data.status === 1 ? 'status-orange' :
                                data.status === 2 ? 'status-blue' :
                                    data.status === 3 ? 'status-green' :
                                        data.status === 4 ? 'status-pink' : ''
                                }`}>
                                {data.status === 1 ? 'Pending' :
                                    data.status === 2 ? 'Send To QC' :
                                        data.status === 3 ? 'Approved By QC' :
                                            data.status === 4 ? 'Rejected' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className="table-responsive">
                        <table className="table table-striped custom-table comman-table mb-0">
                            <thead>
                                <tr>
                                    <th>Sr.</th>
                                    <th>Item Name</th>
                                    <th>Unit</th>
                                    <th>Material Grade</th>
                                    <th>Off. Qty.(kg)</th>
                                    <th>Challan Qty.</th>
                                    {/* <th>Off. NOS</th>                                */}
                                    {/* <th>Heat/Lot No.</th> */}
                                    <th>Manufacturer</th>
                                    <th>Store Type</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.items?.map((e, i) =>
                                    <tr key={e?._id}>
                                        <td>{i + 1}</td>
                                        <td>{e?.transactionId?.itemName?.item_name}</td>
                                        <td>{e?.transactionId?.itemName?.uom?.name}</td>
                                        <td>{e?.transactionId?.itemName?.material_grade}</td>
                                        <td>{e?.offeredQty || '-'}</td>
                                        <td>{e?.challan_qty || '-'}</td>
                                        {/* <td>{e?.offerNos || '-'}</td>                                        */}
                                        {/* <td>{e?.lotNo}</td> */}
                                        <td>{e?.manufacture?.name}</td>
                                        <td>{e?.transactionId?.store_type === 1 ? (
                                            <span span className='custom-badge status-purple'>Main Store</span>
                                        ) : (
                                            <span className='custom-badge status-purple'>Project Store</span>
                                        )}</td>
                                        <td>{e?.remarks || '-'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

const RequestItemDetails = ({ data }) => {
    return (
        <div className="card">
            <div className="card-body">
                <div className="col-12">
                    <div className="form-heading">
                        <h4>View Requested Section Details</h4>
                    </div>
                </div>
                <div className="row">
                    {[
                        { label: 'Request No.', value: data?.requestId?.requestNo },
                        { label: 'Project', value: data?.requestId?.project?.name },
                        { label: 'Project Location', value: data?.requestId?.storeLocation?.name },
                        { label: 'PO Date', value: moment(data?.requestDate).format('YYYY-MM-DD') },
                        { label: 'Material PO No.', value: data?.requestId?.material_po_no },
                        { label: 'Department', value: data?.requestId?.department?.name },
                        { label: 'Approved By', value: data?.requestId?.approvedBy?.name },
                        { label: 'Prepared By', value: data?.requestId?.preparedBy?.user_name },
                    ].map(({ label, value }) => (
                        <div key={label} className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                                <label>{label}</label>
                                <input className="form-control" value={value} readOnly />
                            </div>
                        </div>
                    ))}
                </div>

                <div className='row'>
                    <div className="table-responsive">
                        <table className="table table-striped custom-table comman-table mb-0">
                            <thead>
                                <tr>
                                    <th>Sr.</th>
                                    <th>Item Name</th>
                                    <th>Uom</th>
                                    <th>Material Grade</th>
                                    <th>Req. Qty.</th>
                                    <th>Bal Qty.</th>
                                    {/* <th>Unit/Total Rate</th> */}
                                    <th>Supplier</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.items?.map((e, i) =>
                                    <tr key={e?._id}>
                                        <td>{i + 1}</td>
                                        <td>{e?.transactionId?.itemName?.item_name}</td>
                                        <td>{e?.transactionId?.itemName?.uom?.name}</td>
                                        <td>{e?.transactionId?.itemName?.material_grade}</td>
                                        <td>{e?.transactionId?.quantity}</td>
                                        <td>{e?.transactionId?.balance_qty}</td>
                                        {/* <td>{e?.transactionId?.unit_rate}/{e?.transactionId?.total_rate}</td> */}
                                        <td>{e?.transactionId?.main_supplier?.name}</td>
                                        <td>{e?.remarks || '-'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};



const DrawingDetails = ({ data }) => {
    return (
        <div className="card">
            <div className="card-body">
                <div className="col-12">
                    <div className="form-heading">
                        <h4>View Drawing Details</h4>
                    </div>
                </div>
                <div className="row">
                    {[
                        { label: 'Master Updation Date', value: moment(data?.requestId?.drawing_id?.master_updation_date).format('YYYY-MM-DD') },
                        { label: 'Drawing No.', value: data?.requestId?.drawing_id?.drawing_no },
                        { label: 'Drawing Receive Date', value: moment(data?.requestId?.drawing_id?.draw_receive_date).format('YYYY-MM-DD') },
                        { label: 'Unit', value: data?.requestId?.drawing_id?.unit },
                        { label: 'REV', value: data?.requestId?.drawing_id?.rev },
                        { label: 'Sheet No.', value: data?.requestId?.drawing_id?.sheet_no },
                        { label: 'Assembly No.', value: data?.requestId?.drawing_id?.assembly_no },
                        { label: 'Assembly Quantity', value: data?.requestId?.drawing_id?.assembly_quantity },
                    ].map(({ label, value }) => (
                        <div key={label} className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                                <label>{label}</label>
                                <input className="form-control" value={value} readOnly />
                            </div>
                        </div>
                    ))}
                </div>
                <div className='row'>
                    {data?.drawing_id?.issued_date || data?.drawing_id?.issued_person ? (
                        <>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Issued Date</label>
                                    <input className="form-control" value={data?.drawing_id?.issued_date} readOnly />
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Issued Date</label>
                                    <input className="form-control" value={data?.drawing_id?.issued_person?.name} readOnly />
                                </div>
                            </div>
                        </>
                    ) : null}

                    <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                            <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                            <span className={`custom-badge ${data?.requestId?.drawing_id?.status === 1 ? 'status-orange' :
                                data?.requestId?.drawing_id?.status === 2 ? 'status-green' : ''}`}>
                                {data?.requestId?.drawing_id?.status === 1 ? 'Pending' : data?.requestId?.drawing_id?.status === 2 ? 'Completed' : ''}
                            </span>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                        <a href={data?.requestId?.drawing_id?.drawing_pdf} className='d-flex' target='_blank' rel="noreferrer" style={{ cursor: "pointer" }}>
                            <img src='/assets/img/pdflogo.png' /> <p>{data?.requestId?.drawing_id?.drawing_pdf_name}</p>
                        </a>
                    </div>
                </div>
                {/* <div className="table-responsive">
                    <table className="table border-0 mb-0 custom-table table-striped comman-table">
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Section Details</th>
                                <th>Grid No.</th>
                                <th>Item No.</th>
                                <th>Qty.</th>
                                <th>Length(mm)</th>
                                <th>Width(mm)</th>
                                <th>Item Weight(kg)	</th>
                                <th>Assem. Weight(kg)</th>
                                <th>ASM(sqm)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.requestId?.drawing_id?.items?.map((elem, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{elem?.itemName?.name}</td>
                                    <td>{elem?.grid_no}</td>
                                    <td>{elem?.item_no}</td>
                                    <td>{elem?.quantity}</td>
                                    <td>{elem?.item_length}</td>
                                    <td>{elem?.item_width}</td>
                                    <td>{elem?.item_weight}</td>
                                    <td>{elem?.assembly_weight}</td>
                                    <td>{elem?.assembly_surface_area}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> */}
            </div>
        </div>
    );
};

// Main Component
const ViewDetails = ({ data }) => {
    return (
        <div className='row'>
            <div className="col-sm-12">
                <OfferDetails data={data} />
                <RequestItemDetails data={data} />
                {data?.requestId?.drawing_id !== null ? (
                    <DrawingDetails data={data} />
                ) : null}
            </div>
        </div>
    );
};

export default ViewDetails;
