import { LayoutDashboard, Presentation } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <Link to="/erp/user/qc/dashboard" className={`${location.pathname === "/erp/user/qc/dashboard" ? "active" : ""}`}>
                <span className="menu-side">
                  <LayoutDashboard className="Dash-iCon" />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/erp/user/qc/project-management"
                className={`${location.pathname === "/erp/user/qc/project-management" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <Presentation className="Dash-iCon" />
                </span>
                <span>Project</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
