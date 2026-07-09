import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import moment from 'moment';
import { V_URL } from '../../../../BaseUrl';

const Header = ({ handleOpen }) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const handleLogout = () => {
        localStorage.removeItem('PAY_USER_TOKEN');
        localStorage.removeItem('PAY_USER_NAME');
        localStorage.removeItem('PAY_USER_IMG');
        localStorage.removeItem('U_FORGET_EMAIL');
        localStorage.removeItem('PAY_USER_FIRM_NAME');

        localStorage.removeItem('PAY_USER_START_YEAR');
        localStorage.removeItem('PAY_USER_END_YEAR');

        localStorage.removeItem('PAY_USER_YEAR_ID');
        localStorage.removeItem('PAY_USER_FIRM_ID');

        localStorage.removeItem('PAY_USER_ID');
        localStorage.removeItem('VI_PRO');
        localStorage.removeItem('ERP_ROLE');

        toast.success('Logged Out Successfully')
        navigate('/user/login');
    }

    useEffect(() => {
        if (!localStorage.getItem('PAY_USER_FIRM_NAME')
            && !localStorage.getItem('PAY_USER_START_YEAR')
            && !localStorage.getItem('PAY_USER_END_YEAR')) {
            getProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const getProfile = () => {
        const myurl = `${V_URL}/user/get-profile`;
        axios({
            method: "get",
            url: myurl,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then(async (response) => {
            console?.log("@@", response?.data);

            const data = response?.data?.data;

            const filterFirm = data?.firm?.find(fi => fi._id === localStorage.getItem('PAY_USER_FIRM_ID'));
            const filterYear = data?.year?.find(yr => yr._id === localStorage.getItem('PAY_USER_YEAR_ID'));

            localStorage.setItem('PAY_USER_FIRM_NAME', filterFirm.name)
            localStorage.setItem('PAY_USER_START_YEAR', filterYear?.start_year)
            localStorage.setItem('PAY_USER_END_YEAR', filterYear?.end_year)

            setLoading(false);

        }).catch((error) => {
            toast.error("Something went wrong");
            console?.log("Errors", error);
        });
    }

    return (
        <div className="header">
            <div className="header-left">
                <Link to="/erp/user/planner/dashboard" className="logo">
                    <img src="/assets/img/LogoV.svg" width="35" height="35" alt="Logo" />
                    <span>Vishal <br /> Enterprise</span>
                </Link>
            </div>

            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <a id="toggle_btn">
                <img src="/assets/img/icons/bar-icon.svg" alt="bar-icon" />
            </a>

            <a onClick={handleOpen} className="mobile_btn float-start" style={{ cursor: "pointer" }} >
                <img src="/assets/img/icons/bar-icon.svg" alt="bar-icon" />
            </a>

            <span className='mob-view' style={{ lineHeight: "60px", paddingLeft: "15px" }}>
                {/* <span style={{ fontWeight: "500", fontSize: "18px" }}>({localStorage.getItem('PAY_USER_FIRM_NAME')} / {moment(localStorage.getItem('PAY_USER_START_YEAR')).format('YYYY')}-{moment(localStorage.getItem('PAY_USER_END_YEAR')).format('YYYY')})</span> */}
                {loading ? (
                    <span>Loading...</span>
                ) : (
                    <span style={{ fontWeight: "500", fontSize: "18px" }}>
                        ({localStorage.getItem('PAY_USER_FIRM_NAME')} / {moment(localStorage.getItem('PAY_USER_START_YEAR')).format('YYYY')}-{moment(localStorage.getItem('PAY_USER_END_YEAR')).format('YYYY')})
                    </span>
                )}
            </span>

            <ul className="nav user-menu float-end d-flex align-items-center">
                <li className="nav-item dropdown d-none d-md-block">
                    <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
                        <img src="/assets/img/icons/note-icon-02.svg" alt="note-icon-02" /><span className="pulse"></span> </a>
                    <div className="dropdown-menu notifications">
                        <div className="topnav-dropdown-header">
                            <span>Notifications</span>
                        </div>
                        <div className="drop-scroll">
                            <ul className="notification-list">
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">
                                                <img alt="John Doe" src="/assets/img/user.jpg" className="img-fluid" />
                                            </span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">John Doe</span> added
                                                    new task <span className="noti-title">Patient appointment booking</span>
                                                </p>
                                                <p className="noti-time"><span className="notification-time">4 mins ago</span>
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">V</span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Tarah Shropshire</span>
                                                    changed the task name <span className="noti-title">Appointment booking
                                                        with payment gateway</span></p>
                                                <p className="noti-time"><span className="notification-time">6 mins ago</span>
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">L</span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Misty Tison</span>
                                                    added <span className="noti-title">Domenic Houston</span> and <span
                                                        className="noti-title">Claire Mapes</span> to project <span
                                                            className="noti-title">Doctor available module</span></p>
                                                <p className="noti-time"><span className="notification-time">8 mins ago</span>
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">G</span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Rolland Webber</span>
                                                    completed task <span className="noti-title">Patient and Doctor video
                                                        conferencing</span></p>
                                                <p className="noti-time"><span className="notification-time">12 mins ago</span>
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <li className="notification-message">
                                    <a href="activities.html">
                                        <div className="media">
                                            <span className="avatar">V</span>
                                            <div className="media-body">
                                                <p className="noti-details"><span className="noti-title">Bernardo Galaviz</span>
                                                    added new task <span className="noti-title">Private chat module</span>
                                                </p>
                                                <p className="noti-time"><span className="notification-time">2 days ago</span>
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="topnav-dropdown-footer">
                            <a href="activities.html">View all Notifications</a>
                        </div>
                    </div>
                </li>
                <li className="nav-item dropdown d-none d-md-block">
                    <a href="#" id="open_msg_box" className="hasnotifications nav-link">
                        <img src="/assets/img/icons/note-icon-01.svg" alt="note-icon-01" /><span className="pulse"></span> </a>
                </li>
                <li className="nav-item dropdown has-arrow user-profile-list">
                    <a href="#" className="dropdown-toggle nav-link user-link" data-bs-toggle="dropdown">
                        <div className="user-names mob-view">
                            <h5>{localStorage.getItem('PAY_USER_NAME')}</h5>
                            <span>User</span>
                        </div>
                        <span className="user-img">
                            {/* <img src={localStorage.getItem('VA_IMG') || '/assets/img/user-5.jpg'} alt="Admin" /> */}
                            <img src='/assets/img/user.jpg' alt="Admin" />
                        </span>
                    </a>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/erp/user/planner/edit-profile">My Profile</Link>
                        <button type='button' className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </div>
                </li>
                {/* <li className="nav-item ">
                    <a href="settings.html" className="hasnotifications nav-link"><img
                        src="/assets/img/icons/setting-icon-01.svg" alt /> </a>
                </li> */}
            </ul>

            <div className="dropdown mobile-user-menu float-end">
                <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
                    className="fa-solid fa-ellipsis-vertical"></i></a>
                <div className="dropdown-menu dropdown-menu-end">
                    <Link className="dropdown-item" to="/erp/user/planner/edit-profile">My Profile</Link>
                    <button type='button' className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Header