import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreDashboard } from '../../../Store/Store/Dashboard/Dashboard';
import toast from 'react-hot-toast';
import { M_STORE } from '../../../BaseUrl';
// import moment from 'moment';

const Dashboard = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate]);

    // const [dashboard, setDashboard] = useState({
    //     order: "",
    //     purchase: "",
    //     sale: "",
    //     project: "",
    //     item: "",
    // })


    useEffect(() => {
        const fetchDashboard = () => {
            try {
                dispatch(getStoreDashboard());
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchDashboard();
    }, [dispatch]);

    const dashboardData = useSelector((state) => state?.getStoreDashboard?.user?.data);

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
                                    <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
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

                    {/* <div className='row mb-3'>
                        <div className="col-12 col-md-3 col-xl-3">
                            <div className="treat-box mb-2">
                                <div className="user-imgs-blk">
                                    <div className="active-user-detail flex-grow-1">
                                        <h4>Firm</h4>
                                        <p>{localStorage.getItem('PAY_USER_FIRM_NAME')}</p>
                                    </div>
                                </div>
                                
                                <a href="#" className="custom-badge status-green">Active</a>
                            </div>
                        </div>
                        <div className="col-12 col-md-3 col-xl-3">
                            <div className="treat-box mb-2">
                                <div className="user-imgs-blk">
                                    <div className="active-user-detail flex-grow-1">
                                        <h4>Year</h4>
                                        <p>{moment(localStorage.getItem('PAY_USER_START_YEAR')).format('YYYY')}-{moment(localStorage.getItem('PAY_USER_END_YEAR')).format('YYYY')}</p>
                                    </div>
                                </div>
                                <a href="#" className="custom-badge status-green">Active</a>
                            </div>
                        </div>
                    </div> */}

                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/calendar.svg" alt="calender-img" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Total Orders</h4>
                                    <h2>
                                        <CountUp end={dashboardData?.total_orders} />
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
                                        <CountUp end={dashboardData?.total_purchase} />
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
                                        <CountUp end={dashboardData?.total_sales} />
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

                    <div className='row'>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/empty-wallet.svg" alt="empty-wallet" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Parties</h4>
                                    <h2><CountUp end={dashboardData?.total_parties} /></h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>30% </span> vs
                                        last month</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/empty-wallet.svg" alt="empty-wallet" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Projects</h4>
                                    <h2><CountUp end={dashboardData?.total_projects} /></h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>30% </span> vs
                                        last month</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/empty-wallet.svg" alt="empty-wallet" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Items</h4>
                                    <h2><CountUp end={dashboardData?.total_items} /></h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>30% </span> vs
                                        last month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="notification-box">
                    <div className="msg-sidebar notifications msg-noti">
                        <div className="topnav-dropdown-header">
                            <span>Messages</span>
                        </div>
                        <div className="drop-scroll msg-list-scroll" id="msg_list">
                            <ul className="list-box">
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">R</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Richard Miles </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item new-message">
                                            <div className="list-left">
                                                <span className="avatar">J</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">John Doe</span>
                                                <span className="message-time">1 Aug</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">T</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Tarah Shropshire </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">M</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Mike Litorus</span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">C</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Catherine Manseau </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">D</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Domenic Houston </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">B</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Buster Wigton </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">R</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Rolland Webber </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">C</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author"> Claire Mapes </span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">M</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Melita Faucher</span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">J</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Jeffery Lalor</span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">L</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Loren Gatlin</span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a href="chat.html">
                                        <div className="list-item">
                                            <div className="list-left">
                                                <span className="avatar">T</span>
                                            </div>
                                            <div className="list-body">
                                                <span className="message-author">Tarah Shropshire</span>
                                                <span className="message-time">12:28 AM</span>
                                                <div className="clearfix"></div>
                                                <span className="message-content">Lorem ipsum dolor sit amet, consectetur
                                                    adipiscing</span>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <a href="chat.html">See all messages</a>
                        </div>
                    </div>
                </div>

                {/* <Footer /> */}
            </div>
        </div>
    )
}

export default Dashboard