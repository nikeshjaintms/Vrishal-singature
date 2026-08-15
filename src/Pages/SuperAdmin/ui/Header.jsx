import React from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Images from '../../../Images/Img';
import SUPER_ROUTE_URLS from '../../../Routes/SuperAdmin/SuperRoutes';

const Header = ({ handleOpen }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('VE_SUPER_NAME');
        localStorage.removeItem('VE_SUPER_TOKEN');
        if (localStorage.getItem('VE_SUPER_REM') === 'false') {
            localStorage.removeItem('VE_SUPER_EMAIL');
            localStorage.removeItem('VE_SUPER_PASSWORD');
            localStorage.removeItem('VE_SUPER_REM');
        }
        toast.success('Logged Out Successfully');
        navigate(SUPER_ROUTE_URLS.LOGIN);
    }

    return (
        <div className="header">
            <div className="header-left">
                <Link to="/admin/dashboard" className="logo">
                    <img src={Images.headerLogo} alt="Logo" style={{ height: '90%' }} />
                </Link>
            </div>
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <a id="toggle_btn">
                <img src="/assets/img/icons/bar-icon.svg" alt="bar-icon1" /></a>
            <a onClick={handleOpen} className="mobile_btn float-start" style={{ cursor: "pointer" }} >
                <img src="/assets/img/icons/bar-icon.svg" alt="bar-icon2" /></a>

            <ul className="nav user-menu float-end d-flex align-items-center">
                <li className="nav-item dropdown has-arrow user-profile-list">
                    <a href="#" className="dropdown-toggle nav-link user-link" data-bs-toggle="dropdown">
                        <div className="user-names">
                            <h5>{localStorage.getItem('VE_SUPER_NAME')}</h5>
                            <span>Super Admin</span>
                        </div>
                        <span className="user-img">
                            <img src={'/assets/img/user.jpg'} alt="Admin" />
                        </span>
                    </a>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/admin/edit-profile">My Profile</Link>
                        <button type='button' className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </div>
                </li>
            </ul>

            <div className="dropdown mobile-user-menu float-end">
                <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
                    className="fa-solid fa-ellipsis-vertical"></i></a>
                <div className="dropdown-menu dropdown-menu-end">
                    <Link className="dropdown-item" to="/admin/edit-profile">My Profile</Link>
                    <button type='button' className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Header