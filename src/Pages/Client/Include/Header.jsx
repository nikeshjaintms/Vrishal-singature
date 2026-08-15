import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Images from '../../../Images/Img';

const PartyHeader = ({ handleOpen }) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('PARTY_TOKEN');
    localStorage.removeItem('PARTY_ID');
    localStorage.removeItem('PARTY_NAME');
    localStorage.removeItem('PARTY_EMAIL');

    localStorage.removeItem('PARTY_PROJECT_ID');
    localStorage.removeItem('PARTY_PROJECT');
    localStorage.removeItem('PARTY_YEAR_ID');
    localStorage.removeItem('PARTY_FIRM_ID');
    localStorage.removeItem('PARTY_FIRM_NAME');
    localStorage.removeItem('PARTY_START_YEAR');
    localStorage.removeItem('PARTY_END_YEAR');

    if (localStorage.getItem('PARTY_REMEMBER_ME') !== 'true') {
      localStorage.removeItem('PARTY_PASSWORD');
      localStorage.removeItem('PARTY_REMEMBER_ME');
    }

    toast.success('Logged out successfully');
    navigate('/');
  };

  const truncateText = (text, limit = 40) => {
    if (!text) return '';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  return (
    <div className="header">

      {/* LOGO */}
      <div className="header-left">
        <Link to="/party/project-store/dashboard" className="logo">
          <img src={Images.headerLogo} alt="Logo" style={{ height: '90%' }} />
        </Link>
      </div>

      {/* SIDEBAR TOGGLE */}
      <a id="toggle_btn">
        <img src="/assets/img/icons/bar-icon.svg" alt="bar-icon" />
      </a>

      <a
        onClick={handleOpen}
        className="mobile_btn float-start"
        style={{ cursor: 'pointer' }}
      >
        <img src="/assets/img/icons/bar-icon.svg" alt="bar-icon" />
      </a>

      {/* PROJECT + FIRM */}
      <span className="mob-view" style={{ lineHeight: '60px', paddingLeft: '15px' }}>
        <span style={{ fontWeight: 500, fontSize: '18px' }}>
          {truncateText(localStorage.getItem('PARTY_PROJECT'))}
          {' / '}
          {truncateText(localStorage.getItem('PARTY_FIRM_NAME'))}
        </span>
      </span>

      {/* USER MENU */}
      <ul className="nav user-menu float-end d-flex align-items-center">
        <li className="nav-item dropdown has-arrow user-profile-list">
          <a
            href="#"
            className="dropdown-toggle nav-link user-link"
            data-bs-toggle="dropdown"
          >
            <div className="user-names mob-view">
              <h5>{localStorage.getItem('PARTY_NAME')}</h5>
              <span>Party</span>
            </div>
            <span className="user-img">
              <img src="/assets/img/user.jpg" alt="Party" />
            </span>
          </a>

          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/party/profile">
              My Profile
            </Link>
            <button
              type="button"
              className="dropdown-item"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </li>
      </ul>

      {/* MOBILE MENU */}
      <div className="dropdown mobile-user-menu float-end">
        <a
          href="#"
          className="dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </a>
        <div className="dropdown-menu dropdown-menu-end">
          <Link className="dropdown-item" to="/party/profile">
            My Profile
          </Link>
          <button
            type="button"
            className="dropdown-item"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

    </div>
  );
};

export default PartyHeader;
