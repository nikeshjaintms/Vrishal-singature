import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Images from '../../../Images/Img';

const Header = ({ handleOpen }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);
    const handleLogout = async () => {
        // try {
        //     await axios({
        //         method: "post",
        //         url: `${V_URL}/user/logout`,
        //         headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        //     });
        // } catch (error) {
        //     console.error("Logout error", error);
        // }
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
        localStorage.removeItem('U_PROJECT_ID');
        localStorage.removeItem('PAY_USER_PROJECT_NAME');
        localStorage.removeItem('ERP_ROLE');

        if (localStorage.getItem('PAY_USER_REMEMBER_ME') === "false") {
            localStorage.removeItem('PAY_USER_PASSWORD')
            localStorage.removeItem('PAY_USER_EMAIL')
            localStorage.removeItem('PAY_USER_REMEMBER_ME')
        }

        toast.success('Logged Out Successfully')
        navigate('/');
    }

    useEffect(() => {
        if (!localStorage.getItem('PAY_USER_FIRM_NAME')
            && !localStorage.getItem('PAY_USER_START_YEAR')
            && !localStorage.getItem('PAY_USER_END_YEAR') &&
            !localStorage.getItem('PAY_USER_PROJECT_NAME')) {
            getProfile();
        } else {
            setLoading(false);
        }
    }, []);

    function truncateText(text, limit = 40) {
        if (!text) return "";
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    }

    const getProfile = () => {
        const myurl = `${V_URL}/user/get-profile`;
        axios({
            method: "get",
            url: myurl,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            // console?.log("@@", response?.data);
            const data = response?.data?.data;
            const filterProject = data?.project.find(pr => pr._id === localStorage.getItem('U_PROJECT_ID'));
            localStorage.setItem('PAY_USER_PROJECT_NAME', filterProject?.name);
            localStorage.setItem('PAY_USER_FIRM_NAME', filterProject?.firm_id?.name);
            localStorage.setItem('PAY_USER_START_YEAR', filterProject?.year_id?.start_year);
            localStorage.setItem('PAY_USER_END_YEAR', filterProject?.year_id?.end_year);
            setLoading(false);
        }).catch((error) => {
            toast.error("Something went wrong");
            console?.log("Errors", error);
        });
    }

    return (
        <div className="header">
            <div className="header-left">
                <Link to="/user/project-store/dashboard" className="logo">
                    <img src={Images.headerLogo} alt="Logo" style={{ height: '90%' }} />
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
                {loading ? (
                    <span>Loading...</span>
                ) : (
                    <span style={{ fontWeight: "500", fontSize: "18px" }}>
                        {`${truncateText(localStorage.getItem('PAY_USER_PROJECT_NAME'))} / ${truncateText(localStorage.getItem('PAY_USER_FIRM_NAME'))}`}
                          
                    </span>
                )}
            </span>
           


            <ul className="nav user-menu float-end d-flex align-items-center">
                <li className="nav-item dropdown has-arrow user-profile-list">
                    <a href="#" className="dropdown-toggle nav-link user-link" data-bs-toggle="dropdown">
                        <div className="user-names mob-view">
                            <h5>{localStorage.getItem('PAY_USER_NAME')} ({localStorage.getItem('ERP_ROLE')})</h5>
                            <span>User</span>
                        </div>
                        <span className="user-img">
                            <img src='/assets/img/user.jpg' alt="Admin" />
                        </span>
                    </a>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/user/project-store/edit-profile">My Profile</Link>
                        <button type='button' className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </div>
                </li>
            </ul>

            <div className="dropdown mobile-user-menu float-end">
                <a href="#" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i
                    className="fa-solid fa-ellipsis-vertical"></i></a>
                <div className="dropdown-menu dropdown-menu-end">
                    <Link className="dropdown-item" to="/user/project-store/edit-profile">My Profile</Link>
                    <button type='button' className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Header