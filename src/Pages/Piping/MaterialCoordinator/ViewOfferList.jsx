import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
// import ViewDetails from '../../../Components/QcVerifyRequest/ItemViewPage';
import ViewDetails from '../../../Components/Piping/QcVerifyRequest/ItemViewPage';

const ViewOfferList = () => {

    const location = useLocation();
    const data = location.state;
    // console.log(data, 'viewOfferList')

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
                                        <Link to="/piping/user/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/offer-item-management">Offered Section Details List</Link>
                                    </li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">View Offer Section Details</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <ViewDetails data={data} />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ViewOfferList