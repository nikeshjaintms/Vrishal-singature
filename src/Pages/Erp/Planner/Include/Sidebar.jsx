import { Brush, LayoutDashboard, Presentation, ScanSearch, ShoppingCart } from "lucide-react";
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
              <Link to="/erp/user/planner/dashboard" className={`${location.pathname === "/erp/user/planner/dashboard" ? "active" : ""}`}>
                <span className="menu-side">
                  <LayoutDashboard className="Dash-iCon" />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/erp/user/planner/project-management"
                className={`${location.pathname === "/erp/user/planner/project-management" ? "active" : ""}`}
              >
                <span className="menu-side">
                  <Presentation className="Dash-iCon" />
                </span>
                <span>Project</span>
              </Link>
            </li>

            <li>
              <Link to="/erp/user/planner/drawing-management" className={`${location.pathname === "/erp/user/planner/drawing-management" || location.pathname === "/erp/user/planner/manage-drawing" ? "active" : ""}`}>
                <span className="menu-side">
                  <Brush className="Dash-iCon" />
                </span>
                <span>Drawing</span>
              </Link>
            </li>

            <li>
              <Link to="/erp/user/planner/view-drawing-management" className={`${location.pathname === "/erp/user/planner/view-drawing-management" ? "active" : ""}`}>
                <span className="menu-side">
                  <ScanSearch className="Dash-iCon" />
                </span>
                <span>View Drawing</span>
              </Link>
            </li>

            <li>
              <Link to="/erp/user/planner/purchase-request-management" className={`${location.pathname === "/erp/user/planner/purchase-request-management"
                || location.pathname === "/erp/user/planner/manage-purchase-request" ? "active" : ""}`}>
                <span className="menu-side">
                  <ShoppingCart className="Dash-iCon" />
                </span>
                <span>Purchase Request</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
