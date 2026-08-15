import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import SUPER_ROUTE_URLS from '../../../Routes/SuperAdmin/SuperRoutes';
import { LayoutDashboard } from 'lucide-react';

const Sidebar = () => {

  const location = useLocation();

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <Link
                to={SUPER_ROUTE_URLS.HOME}
                className={`${location.pathname === SUPER_ROUTE_URLS.HOME ? "active" : ""}`}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                <span>Dashboard </span>
              </Link>
            </li>

            <li>
              <Link
                to={SUPER_ROUTE_URLS.DPR}
                className={`${location.pathname === SUPER_ROUTE_URLS.DPR ? "active" : ""}`}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                <span>DPR</span>
              </Link>
            </li>

            <li>
              <Link
                to={SUPER_ROUTE_URLS.DMR}
                className={`${location.pathname === SUPER_ROUTE_URLS.DMR ? "active" : ""}`}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                <span>DMR</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar