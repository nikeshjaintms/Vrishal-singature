import { LayoutDashboard } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PO_ROUTE_URLS from '../../../Routes/PoTeam/PoRoutes';
import { PO_PLAN, PIPING_PLAN } from '../../../BaseUrl';

const Sidebar = () => {
    const location = useLocation();
    const [masterMenu, setMasterMenu] = useState(false);
    const selectedProduct = localStorage.getItem('PO_PRODUCT') || "";

    const handleMasterMenu = () => {
        setMasterMenu(prev => !prev);
    };

    // auto-open when inside master routes
    useEffect(() => {
        if (
            location.pathname === PO_ROUTE_URLS.SECTION_DETAILS ||
            location.pathname === PO_ROUTE_URLS.MANAGE_SECTION_DETAILS ||
            location.pathname === PO_ROUTE_URLS.AREA_MASTER ||
            location.pathname === PO_ROUTE_URLS.TERMS_AND_CONDITIONS ||
            location.pathname === PO_ROUTE_URLS.MANAGE_TERMS_AND_CONDITIONS ||
            location.pathname === PO_ROUTE_URLS.MANUFACTURE_LIST ||
            location.pathname === PO_ROUTE_URLS.MANAGE_MANUFACTURER ||
            location.pathname === PO_ROUTE_URLS.PIPING_AREA_MASTER ||
            location.pathname === PO_ROUTE_URLS.PIPING_MANUFACTURE_LIST ||
            location.pathname === PO_ROUTE_URLS.PIPING_TERMS_AND_CONDITIONS ||
            location.pathname === PO_ROUTE_URLS.PIPING_MTO ||
            location.pathname === PO_ROUTE_URLS.PIPING_PR ||
            location.pathname === PO_ROUTE_URLS.PIPING_INQUIRY ||
            location.pathname === PO_ROUTE_URLS.PIPING_ORDER_PLACE ||
            location.pathname === PO_ROUTE_URLS.PIPING_MATERIAL_CHART ||
            location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_SECTION_DETAILS ||
            location.pathname === PO_ROUTE_URLS.PIPING_SECTION_DETAILS
        ) {
            setMasterMenu(true);
        }
    }, [location.pathname]);


    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll side-bar-scroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li>
                            <Link
                                to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.HOME : PO_ROUTE_URLS.PIPING_HOME}
                                className={`${(location.pathname === PO_ROUTE_URLS.HOME || location.pathname === PO_ROUTE_URLS.PIPING_HOME) ? "active" : ""}`}>
                                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                                <span>Dashboard </span>
                            </Link>
                        </li>

                        <li className="submenu">
                            <a
                                className={`${masterMenu ? "subdrop active" : ""}`}
                                onClick={handleMasterMenu}
                                style={{ cursor: "pointer" }}
                            >
                                <span className="menu-side">
                                    <LayoutDashboard className="Dash-iCon" />
                                </span>
                                <span>Master</span>
                                <span className="menu-arrow" />
                            </a>

                            <ul style={{ display: masterMenu ? "block" : "none" }}>
                                <li>
                                    <Link
                                        to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.SECTION_DETAILS : PO_ROUTE_URLS.PIPING_SECTION_DETAILS}
                                        className={`${location.pathname === PO_ROUTE_URLS.SECTION_DETAILS ||
                                            location.pathname === PO_ROUTE_URLS.MANAGE_SECTION_DETAILS ||
                                            location.pathname === PO_ROUTE_URLS.PIPING_SECTION_DETAILS ||
                                            location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_SECTION_DETAILS ? "active" : ""}`}
                                    >
                                        Section Details
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.AREA_MASTER : PO_ROUTE_URLS.PIPING_AREA_MASTER}
                                        className={`${location.pathname === PO_ROUTE_URLS.AREA_MASTER || location.pathname === PO_ROUTE_URLS.PIPING_AREA_MASTER ? "active" : ""}`}
                                    >
                                        Area Master
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.TERMS_AND_CONDITIONS : PO_ROUTE_URLS.PIPING_TERMS_AND_CONDITIONS}
                                        className={`${location.pathname === PO_ROUTE_URLS.TERMS_AND_CONDITIONS ||
                                            location.pathname === PO_ROUTE_URLS.MANAGE_TERMS_AND_CONDITIONS ||
                                            location.pathname === PO_ROUTE_URLS.PIPING_TERMS_AND_CONDITIONS ||
                                            location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_TERMS_AND_CONDITIONS ? "active" : ""}`}
                                    >
                                        Master T&C
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.MANUFACTURE_LIST : PO_ROUTE_URLS.PIPING_MANUFACTURE_LIST}
                                        className={`${location.pathname === PO_ROUTE_URLS.MANUFACTURE_LIST ||
                                            location.pathname === PO_ROUTE_URLS.MANAGE_MANUFACTURER ||
                                            location.pathname === PO_ROUTE_URLS.PIPING_MANUFACTURE_LIST ||
                                            location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_MANUFACTURER ? "active" : ""}`}
                                    >
                                        Party List
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <Link
                                to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.MTO : PO_ROUTE_URLS.PIPING_MTO}
                                className={`${location.pathname === PO_ROUTE_URLS.MTO || location.pathname === PO_ROUTE_URLS.MANAGE_MTO || location.pathname === PO_ROUTE_URLS.MTO_VIEW ||
                                    location.pathname === PO_ROUTE_URLS.PIPING_MTO || location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_MTO || location.pathname === PO_ROUTE_URLS.PIPING_MTO_VIEW ? "active" : ""}`}>
                                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                                <span>Material MTO </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.PR : PO_ROUTE_URLS.PIPING_PR}
                                className={`${location.pathname === PO_ROUTE_URLS.PR || location.pathname === PO_ROUTE_URLS.MANAGE_PR || location.pathname === PO_ROUTE_URLS.PR_VIEW ||
                                    location.pathname === PO_ROUTE_URLS.PIPING_PR || location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_PR || location.pathname === PO_ROUTE_URLS.PIPING_PR_VIEW ? "active" : ""}`}>
                                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                                <span>Prepare PR </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.INQUIRY : PO_ROUTE_URLS.PIPING_INQUIRY}
                                className={`${location.pathname === PO_ROUTE_URLS.INQUIRY || location.pathname === PO_ROUTE_URLS.MANAGE_INQUIRY || location.pathname === PO_ROUTE_URLS.VIEW_INQUIRY ||
                                    location.pathname === PO_ROUTE_URLS.PIPING_INQUIRY || location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_INQUIRY || location.pathname === PO_ROUTE_URLS.PIPING_VIEW_INQUIRY ? "active" : ""}`}>
                                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                                <span>Generate Inquiry</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.ORDER_PLACE : PO_ROUTE_URLS.PIPING_ORDER_PLACE}
                                className={`${location.pathname === PO_ROUTE_URLS.ORDER_PLACE || location.pathname === PO_ROUTE_URLS.MANAGE_ORDER || location.pathname === PO_ROUTE_URLS.VIEW_ORDER ||
                                    location.pathname === PO_ROUTE_URLS.PIPING_ORDER_PLACE || location.pathname === PO_ROUTE_URLS.PIPING_MANAGE_ORDER || location.pathname === PO_ROUTE_URLS.PIPING_VIEW_ORDER ? "active" : ""}`}>
                                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                                <span>Order Placement</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={selectedProduct === PO_PLAN ? PO_ROUTE_URLS.MATERIAL_CHART : PO_ROUTE_URLS.PIPING_MATERIAL_CHART}
                                className={`${location.pathname === PO_ROUTE_URLS.MATERIAL_CHART || location.pathname === PO_ROUTE_URLS.PIPING_MATERIAL_CHART ? "active" : ""}`}>
                                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                                <span>Material Chart</span>
                            </Link>
                        </li>



                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;