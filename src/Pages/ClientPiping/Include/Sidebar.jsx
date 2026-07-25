import {
  ClipboardCheck,
  LayoutDashboard,
  FileText,
  FileCheck,
  CircleGauge,
  Package,
  SendHorizontal,
  SprayCan,
  Cog,
  CircleCheckBig
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Client Piping Sidebar — PRUNED to approved scope only.
 * ---------------------------------------------------------
 * This is intentionally NOT a stripped-down copy of the full 236-route
 * Pages/Piping/Include/Sidebar.jsx. It's a clean, self-contained rebuild
 * covering only the 12 feature areas approved for the Client Piping module
 * (per the "EXTERNAL/CLIENT = Y" filtered stage list):
 *
 *   Material Receiving (QC), FIM, Fit-Up (Acceptance), Weld Visual (Acceptance),
 *   Final Dimension (Acceptance), NDT (RT/PWHT/FT/LPT/MPT/HT/PMI/Pickling & Passivation
 *   — both Offering and Acc/Rej for each), LHS, Painting (Surface & Primer / MIO /
 *   Final Coat — Acceptance side only), IRN.
 *
 * All routes point into ClientPipingRoute.jsx, which currently renders
 * PlaceholderPage for every one of these — real implementation is intern work.
 *
 * If a future approved-scope change adds more areas back in, use
 * Pages/Piping/Include/Sidebar.jsx as the reference for that area's exact
 * route names/labels/icons, and follow the same hasAccess()-free pattern
 * used throughout this file (Party sessions never have ERP_ROLE set, so any
 * hasAccess()/menuAccessConfigPiping gate here would silently hide everything —
 * this exact bug cost significant debugging time in the ERP Client module).
 */
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === `/party/piping-store/${path}`;

  const [ndtOpen, setNdtOpen] = useState(false);
  const [ndtRt, setNdtRt] = useState(false);
  const [ndtPwht, setNdtPwht] = useState(false);
  const [ndtFt, setNdtFt] = useState(false);
  const [ndtLpt, setNdtLpt] = useState(false);
  const [ndtMpt, setNdtMpt] = useState(false);
  const [ndtHt, setNdtHt] = useState(false);
  const [ndtPmi, setNdtPmi] = useState(false);
  const [ndtPickling, setNdtPickling] = useState(false);
  const [paintingOpen, setPaintingOpen] = useState(false);

  const toggle = (setter, value) => () => setter(!value);

  const ndtTypes = [
    { key: 'rt', label: 'RT', open: ndtRt, setOpen: setNdtRt, offer: 'rt-offer-management', clearance: 'rt-clearance-management' },
    { key: 'pwht', label: 'PWHT', open: ndtPwht, setOpen: setNdtPwht, offer: 'pwht-offer-management', clearance: 'pwht-clearance-management' },
    { key: 'ft', label: 'FT', open: ndtFt, setOpen: setNdtFt, offer: 'ft-offer-management', clearance: 'ft-clearance-management' },
    { key: 'lpt', label: 'LPT', open: ndtLpt, setOpen: setNdtLpt, offer: 'lpt-offer-management', clearance: 'lpt-clearance-management' },
    { key: 'mpt', label: 'MPT', open: ndtMpt, setOpen: setNdtMpt, offer: 'mpt-offer-management', clearance: 'mpt-clearance-management' },
    { key: 'ht', label: 'Hardness Testing', open: ndtHt, setOpen: setNdtHt, offer: 'ht-offer-management', clearance: 'ht-clearance-management' },
    { key: 'pmi', label: 'PMI', open: ndtPmi, setOpen: setNdtPmi, offer: 'pmi-offer-management', clearance: 'pmi-clearance-management' },
    { key: 'pickling', label: 'Pickling & Passivation', open: ndtPickling, setOpen: setNdtPickling, offer: 'pickling-passivation-offer-management', clearance: 'pickling-passivation-clearance-management' },
  ];

  const paintingTypes = [
    { key: 'surface', label: 'Surface & Primer', path: 'surface-clearance-management' },
    { key: 'mio', label: 'MIO', path: 'mio-clearance-management' },
    { key: 'finalcoat', label: 'Final Coat', path: 'final-coat-clearance-management' },
  ];

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>

            {/* DASHBOARD */}
            <li>
              <Link to="/party/piping-store/dashboard" className={isActive('dashboard') ? 'active' : ''}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /></span>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* MATERIAL RECEIVING - QC */}
            <li>
              <Link to="/party/piping-store/verify-request-management"
                className={isActive('verify-request-management') || isActive('view-qc-request') || isActive('manage-verify-request') ? 'active' : ''}>
                <span className="menu-side"><Package className="Dash-iCon" /></span>
                <span>Material Receiving <br /> (QC)</span>
              </Link>
            </li>

            {/* FIM */}
            <li>
              <Link to="/party/piping-store/fim-packing-list"
                className={isActive('fim-packing-list') || isActive('manage-fim-packing') || isActive('fim-packing-verification') || isActive('fim-packing-details') ? 'active' : ''}>
                <span className="menu-side"><FileCheck className="Dash-iCon" /></span>
                <span>FIM</span>
              </Link>
            </li>

            {/* FIT-UP - ACCEPTANCE */}
            <li>
              <Link to="/party/piping-store/fitup-clearance-management"
                className={isActive('fitup-clearance-management') ? 'active' : ''}>
                <span className="menu-side"><CircleCheckBig className="Dash-iCon" /></span>
                <span>Fit-Up <br /> Acceptance</span>
              </Link>
            </li>

            {/* WELD VISUAL - ACCEPTANCE */}
            <li>
              <Link to="/party/piping-store/weld-visual-clearance-management"
                className={isActive('weld-visual-clearance-management') ? 'active' : ''}>
                <span className="menu-side"><CircleCheckBig className="Dash-iCon" /></span>
                <span>Weld Visual <br /> Acceptance</span>
              </Link>
            </li>

            {/* FD - ACCEPTANCE */}
            <li>
              <Link to="/party/piping-store/final-dimension-clearance-management"
                className={isActive('final-dimension-clearance-management') ? 'active' : ''}>
                <span className="menu-side"><CircleCheckBig className="Dash-iCon" /></span>
                <span>Final Dimension <br /> Acceptance</span>
              </Link>
            </li>

            {/* NDT */}
            <li className="submenu">
              <a className={ndtOpen ? "subdrop active" : ""} style={{ cursor: "pointer" }} onClick={toggle(setNdtOpen, ndtOpen)}>
                <span className="menu-side"><ClipboardCheck className="Dash-iCon" /></span>
                <span>NDT</span>
                <span className="menu-arrow" />
              </a>
              <ul style={{ display: ndtOpen ? 'block' : 'none' }}>
                {ndtTypes.map((t) => (
                  <li className="submenu" key={t.key}>
                    <a className={t.open ? "subdrop active" : ""} style={{ cursor: "pointer" }} onClick={toggle(t.setOpen, t.open)}>
                      <span>{t.label}</span>
                      <span className="menu-arrow" />
                    </a>
                    <ul style={{ display: t.open ? 'block' : 'none' }}>
                      <li>
                        <Link to={`/party/piping-store/${t.offer}`} className={isActive(t.offer) ? 'active' : ''}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/party/piping-store/${t.clearance}`} className={isActive(t.clearance) ? 'active' : ''}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </li>

            {/* LHS */}
            <li>
              <Link to="/party/piping-store/line-history-management"
                className={isActive('line-history-management') || isActive('view-line-history') || isActive('view-Genline-history') ? 'active' : ''}>
                <span className="menu-side"><FileText className="Dash-iCon" /></span>
                <span>LHS</span>
              </Link>
            </li>

            {/* PAINTING - ACCEPTANCE (Surface & Primer / MIO / Final Coat) */}
            <li className="submenu">
              <a className={paintingOpen ? "subdrop active" : ""} style={{ cursor: "pointer" }} onClick={toggle(setPaintingOpen, paintingOpen)}>
                <span className="menu-side"><SprayCan className="Dash-iCon" /></span>
                <span>Painting</span>
                <span className="menu-arrow" />
              </a>
              <ul style={{ display: paintingOpen ? 'block' : 'none' }}>
                {paintingTypes.map((p) => (
                  <li key={p.key}>
                    <Link to={`/party/piping-store/${p.path}`} className={isActive(p.path) ? 'active' : ''}>
                      <span>{p.label} <br /> Acceptance</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* IRN */}
            <li>
              <Link to="/party/piping-store/release-note-management"
                className={isActive('release-note-management') || isActive('view-release-note') ? 'active' : ''}>
                <span className="menu-side"><SendHorizontal className="Dash-iCon" /></span>
                <span>IRN</span>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;