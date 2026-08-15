import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import ViewDetails from '../../../../Components/QcVerifyRequest/ItemViewPage';
import moment from 'moment';

const ViewQcRequest = () => {

    const location = useLocation();
    const data = location.state;
    

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

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
                                        <Link to="/user/project-store/verify-request-management">Off. No. List</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    {/* <li className="breadcrumb-item active">View Material Inspection(QC)</li> */}
                                    <li className="breadcrumb-item active">View Off. No.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {data?.status === 3 ? (
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Accepted Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            {[
                                                { label: 'Accepted By', value: data?.acceptedBy?.user_name },
                                                { label: 'Accepted Date', value: moment(data?.qc_date).format('YYYY-MM-DD HH:mm') },
                                                { label: 'IMIR No.', value: data?.imir_no },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms">
                                                        <label>{label}</label>
                                                        <input className="form-control" value={value} readOnly />
                                                    </div>
                                                </div>
                                            ))}

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

                                            <div className='col-12'>
                                                <div className="table-responsive">
                                                    <table className="table table-striped custom-table comman-table mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Sr.</th>
                                                                <th>Section Details</th>
                                                                <th>Acc. Length(mm)</th>
                                                                <th>Acc. Width(mm)</th>
                                                                <th>Acc. Qty.(kg)</th>
                                                                <th>Acc. Thickness (T/B)</th>
                                                                <th>Acc. Thickness (W)</th>
                                                                <th>Acc. Thickness (N)</th>
                                                                <th>Acc. Lot No./Heat No.</th>
                                                                <th>Rej. Length(mm)</th>
                                                                <th>Rej. Width(mm)</th>
                                                                <th>Rej. Qty(kg)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data?.items?.map((e, i) =>
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{e?.transactionId?.itemName?.name}</td>
                                                                    <td>{e?.acceptedLength}</td>
                                                                    <td>{e?.acceptedWidth}</td>
                                                                    <td>{e?.acceptedQty || '-'}</td>
                                                                    <td>{e?.accepted_topbottom_thickness || '-'}</td>
                                                                    <td>{e?.accepted_width_thickness || '-'}</td>
                                                                    <td>{e?.accepted_normal_thickness || '-'}</td>
                                                                    <td>{e?.accepted_lot_no || '-'}</td>
                                                                    <td>{e?.rejected_length || 0}</td>
                                                                    <td>{e?.rejected_width || 0}</td>
                                                                    <td>{e?.rejectedQty}</td>
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
                        </div>
                    ) : ''}

                    <ViewDetails data={data} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ViewQcRequest