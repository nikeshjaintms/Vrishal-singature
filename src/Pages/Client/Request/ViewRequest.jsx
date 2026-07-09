import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import moment from 'moment';

const ViewRequest = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const data = location.state;

    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/item-request-management">Request List</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">View Request</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="form-heading">
                                            <h4>View Request Details</h4>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {[
                                            { label: 'Request No.', value: data?.requestNo },
                                            { label: 'Project', value: data?.project?.name },
                                            { label: 'Project Location', value: data?.storeLocation?.name },
                                            { label: 'PO Date', value: moment(data?.requestDate).format('YYYY-MM-DD') },
                                            { label: 'Material PO No.', value: data?.material_po_no },
                                            { label: 'Department', value: data?.department?.name },
                                            { label: 'Approved By', value: data?.approvedBy?.name },
                                            { label: 'Prepared By', value: data?.preparedBy?.user_name },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>{label}</label>
                                                    <input className="form-control" value={value} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="form-heading">
                                            <h4>View Requested Section Details</h4>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="table-responsive">
                                            <table className="table table-striped custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Section Details</th>
                                                        <th>Unit</th>
                                                        <th>MCode</th>
                                                        <th>Req. Qty.</th>
                                                        <th>Balance Qty.</th>
                                                        <th>Off. Qty.</th>
                                                        <th>Store Type</th>
                                                        <th>Unit / Total Rate</th>
                                                        <th>Manufacturer</th>
                                                        <th>Supplier</th>
                                                        <th>Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                 
                                                    {data?.items?.map((elem, i) =>
                                                        <tr>
                                                            <td>{i + 1}</td>
                                                            <td>{elem?.itemName?.name}</td>
                                                            <td>{elem?.itemName?.unit?.name}</td>
                                                            <td>{elem?.mcode}</td>
                                                            <td>{elem?.quantity}</td>
                                                            <td>{elem?.balance_qty}</td>
                                                            <td>{elem?.quantity - elem?.balance_qty}</td>
                                                            <td>
                                                                {elem?.store_type === 1 ? (
                                                                    <span className='custom-badge status-purple'>Main Store</span>
                                                                ) : <span className='custom-badge status-purple'>Project Store</span>
                                                                }
                                                            </td>
                                                            <td>{elem?.unit_rate} / {elem?.total_rate}</td>
                                                            <td>{elem?.preffered_supplier?.map((e) => <p>{e?.supId?.name}</p>)}</td>
                                                            <td>{elem?.main_supplier?.name}</td>
                                                            <td>{elem?.remarks || '-'}</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {data?.drawing_id !== null ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Drawing Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {[
                                                { label: 'Master Updation Date', value: moment(data?.drawing_id?.master_updation_date).format('YYYY-MM-DD') },
                                                { label: 'Drawing No.', value: data?.drawing_id?.drawing_no },
                                                { label: 'Drawing Receive Date', value: moment(data?.drawing_id?.draw_receive_date).format('YYYY-MM-DD') },
                                                { label: 'Unit', value: data?.drawing_id?.unit },
                                                { label: 'REV', value: data?.drawing_id?.rev },
                                                { label: 'Sheet No.', value: data?.drawing_id?.sheet_no },
                                                { label: 'Assembly No.', value: data?.drawing_id?.assembly_no },
                                                { label: 'Assembly Quantity', value: data?.drawing_id?.assembly_quantity },
                                                { label: 'Issued Date', value: moment(data?.drawing_id?.issued_date).format('YYYY-MM-DD') },
                                                { label: 'Issued To', value: data?.drawing_id?.issued_person?.name },
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
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                                                    <span className={`custom-badge ${data?.drawing_id?.status === 1 ? 'status-orange' :
                                                        data?.drawing_id?.status === 2 ? 'status-green' : ''}`}>
                                                        {data?.drawing_id?.status === 1 ? 'Pending' : data?.drawing_id?.status === 2 ? 'Completed' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <a href={data?.drawing_id?.drawing_pdf} className='d-flex' target='_blank' rel="noreferrer" style={{ cursor: "pointer" }}>
                                                    <img src='/assets/img/pdflogo.png' alt='draw-pdf' /> <p>{data?.drawing_id?.drawing_pdf_name}</p>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div >
    );
};

export default ViewRequest;
