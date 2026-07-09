import {
  CircleCheckBig,
  ClipboardCheck,
  Cog,
  LayoutDashboard,
  NotebookText,
  ScrollText,
  SendHorizontal
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";


const PartySidebar = () => {
  const location = useLocation();

  const [ndt, setNdt] = useState(false);
  const [painting, setPainting] = useState(false);

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>

            {/* DASHBOARD */}
            <li>
              <Link
                to="/party/project-store/dashboard"
                className={location.pathname === "/party/project-store/dashboard" ? "active" : ""}
              >
                <span className="menu-side">
                  <LayoutDashboard className="Dash-iCon" />
                </span>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* MATERIAL RECEIVING */}
            <li>
              <Link
                to="/party/project-store/material-receiving"
                className={location.pathname.includes("material-receiving") ? "active" : ""}
              >
                <span className="menu-side">
                  <ClipboardCheck className="Dash-iCon" />
                </span>
                <span>Material Receiving</span>
              </Link>
            </li>

            {/* FIM */}
            <li>
              <Link
                to="/party/project-store/fim-packing"
                className={location.pathname.includes("fim") ? "active" : ""}
              >
                <span className="menu-side">
                  <ClipboardCheck className="Dash-iCon" />
                </span>
                <span>FIM</span>
              </Link>
            </li>

            {/* FIT-UP */}
            <li>
              <Link
                to="/party/project-store/fitup-acceptance"
                className={location.pathname.includes("fitup-acceptance") ? "active" : ""}
              >
                <span className="menu-side">
                  <Cog className="Dash-iCon" />
                </span>
                <span>Fit-Up</span>
              </Link>
            </li>

            {/* WELD VISUAL */}
            <li>
              <Link
                to="/party/project-store/weld-visual-acceptance"
                className={location.pathname.includes("weld-visual") ? "active" : ""}
              >
                <span className="menu-side">
                  <Cog className="Dash-iCon" />
                </span>
                <span>Weld Visual</span>
              </Link>
            </li>

            {/* FINAL DIMENSION */}
            <li>
              <Link
                to="/party/project-store/final-dimension-acceptance"
                className={location.pathname.includes("final-dimension") ? "active" : ""}
              >
                <span className="menu-side">
                  <CircleCheckBig className="Dash-iCon" />
                </span>
                <span>Final Dimension</span>
              </Link>
            </li>

            {/* NDT */}
            <li className="submenu">
              <a
                className={ndt ? "subdrop active" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setNdt(!ndt)}
              >
                <span className="menu-side">
                  <ClipboardCheck className="Dash-iCon" />
                </span>
                <span>NDT</span>
                <span className="menu-arrow" />
              </a>

              <ul style={{ display: ndt ? "block" : "none" }}>
                <li><Link to="/party/project-store/ut-clearance-management">UT</Link></li>
                <li><Link to="/party/project-store/rt-clearance-management">RT</Link></li>
                <li><Link to="/party/project-store/mpt-clearance-management">MPT</Link></li>
                <li><Link to="/party/project-store/lpt-clearance-management">LPT</Link></li>
              </ul>
            </li>

            {/* INSPECTION SUMMARY */}
            <li>
              <Link
                to="/party/project-store/inspection-summary-management"
                className={location.pathname.includes("inspection-summary") ? "active" : ""}
              >
                <span className="menu-side">
                  <ScrollText className="Dash-iCon" />
                </span>
                <span>ISR</span>
              </Link>
            </li>

            {/* PAINTING */}
            <li className="submenu">
              <a
                className={painting ? "subdrop active" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => setPainting(!painting)}
              >
                <span className="menu-side">
                  <ClipboardCheck className="Dash-iCon" />
                </span>
                <span>Painting</span>
                <span className="menu-arrow" />
              </a>

              <ul style={{ display: painting ? "block" : "none" }}>
                <li>
                  <Link to="/party/project-store/surface-primer-management">
                    Surface & Primer
                  </Link>
                </li>
                <li>
                  <Link to="/party/project-store/mio-offer-management">
                    MIO
                  </Link>
                </li>
                <li>
                  <Link to="/party/project-store/final-coat-management">
                    Final Coat
                  </Link>
                </li>
              </ul>
            </li>

            {/* IRN */}
            <li>
              <Link
                to="/party/project-store/release-note-management"
                className={location.pathname.includes("irn") ? "active" : ""}
              >
                <span className="menu-side">
                  <SendHorizontal className="Dash-iCon" />
                </span>
                <span>IRN</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default PartySidebar;
