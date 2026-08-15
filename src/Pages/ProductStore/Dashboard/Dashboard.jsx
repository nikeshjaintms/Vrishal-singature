import React, { useEffect, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { P_STORE } from '../../../BaseUrl';

const Dashboard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${P_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
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
                                    <li className="breadcrumb-item"><Link to="/product-store/user/dashboard">Dashboard </Link></li>
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


                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/calendar.svg" alt="calender-img" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Total Orders</h4>
                                    <h2>
                                        <CountUp end={150} />
                                    </h2>
                                    <p>
                                        <span className="passive-view">
                                            <i className="feather-arrow-up-right me-1"></i>40% </span>
                                        vs last month
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/profile-add.svg" alt="profile-add" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Purchase Orders</h4>
                                    <h2>
                                        <CountUp end={250} />
                                    </h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>20% </span> vs
                                        last month</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/scissor.svg" alt="scissor" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Sales Orders</h4>
                                    <h2>
                                        <CountUp end={100} />
                                    </h2>
                                    <p><span className="negative-view"><i className="feather-arrow-down-right me-1"></i>15% </span>
                                        vs last month</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/empty-wallet.svg" alt="empty-wallet" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Issue</h4>
                                    <h2><CountUp end={10} /></h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>30% </span> vs
                                        last month</p>
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