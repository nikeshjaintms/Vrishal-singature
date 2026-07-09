import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../Include/Sidebar';
import Header from '../Include/Header';
import Footer from '../Include/Footer';
import ViewDetails from '../../../Components/QcVerifyRequest/ItemViewPage';

const ViewApprovedList = () => {
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
                                        <Link to="/user/project-store/approved-item-management">Approved Section Details List</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">View Approved Section Details</li>
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
                                                <h4>View Accepted Section Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            {[
                                                { label: 'Accepted Quantity', value: data?.acceptedQty },
                                                { label: 'Rejected Quantity', value: data?.rejectedQty },
                                                { label: 'Accepted Length', value: data?.acceptedLength },
                                                { label: 'Accepted By', value: data?.acceptedBy?.user_name },
                                                { label: 'T.C No.', value: data?.tcNo },
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
                    ) : ''}

                    <ViewDetails data={data} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ViewApprovedList