import React, { useEffect, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { ERP, QC } from '../../../../BaseUrl';
import toast from 'react-hot-toast';

const Dashboard = () => {

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${ERP}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
            if (localStorage.getItem('ERP_ROLE') !== `${QC}`) {
                toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
                navigate("/user/login");
            }
        }
    }, [navigate]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
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
                                    <li className="breadcrumb-item"><Link to="/erp/user/qc/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">User Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="good-morning-blk">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="morning-user">
                                    <h2>Good Morning, <span>{localStorage.getItem('PAY_USER_NAME')}</span></h2>
                                    <p>Have a nice day at work</p>
                                </div>
                            </div>
                            <div className="col-md-6 position-blk">
                                <div className="morning-img">
                                    <img src="/assets/img/morning-img-01.svg" alt="morning-icon" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="doctor-list-blk">
                        <div className="row">
                            <div className="col-xl-3 col-md-6">
                                <div className="doctor-widget border-right-bg">
                                    <div className="doctor-box-icon flex-shrink-0">
                                        <img src="/assets/img/icons/doctor-dash-01.svg" alt="dash-icon1" />
                                    </div>
                                    <div className="doctor-content dash-count flex-grow-1">
                                        <h4><span className="counter-up">30</span><span>/85</span><span
                                            className="status-green">+60%</span></h4>
                                        <h5>Appointments</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="doctor-widget border-right-bg">
                                    <div className="doctor-box-icon flex-shrink-0">
                                        <img src="/assets/img/icons/doctor-dash-02.svg" alt="dash-icon2" />
                                    </div>
                                    <div className="doctor-content dash-count flex-grow-1">
                                        <h4><span className="counter-up">20</span><span>/125</span><span
                                            className="status-pink">-20%</span></h4>
                                        <h5>Consultations</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="doctor-widget border-right-bg">
                                    <div className="doctor-box-icon flex-shrink-0">
                                        <img src="/assets/img/icons/doctor-dash-03.svg" alt="dash-icon3" />
                                    </div>
                                    <div className="doctor-content dash-count flex-grow-1">
                                        <h4><span className="counter-up">12</span><span>/30</span><span
                                            className="status-green">+40%</span></h4>
                                        <h5>Operations</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6">
                                <div className="doctor-widget">
                                    <div className="doctor-box-icon flex-shrink-0">
                                        <img src="/assets/img/icons/doctor-dash-04.svg" alt="dash-icon4" />
                                    </div>
                                    <div className="doctor-content dash-count flex-grow-1">
                                        <h4>$<span className="counter-up">530</span><span></span><span
                                            className="status-green">+50%</span></h4>
                                        <h5>Earnings</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard