import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BadgeIndianRupee, Building2, Calendar, Contact, ContactRound, LayoutDashboard, MailWarning, NotebookPen, Package2, Presentation, ShieldCheck, UserPlus, Users } from 'lucide-react';


const Sidebar = () => {
    const [transaction, setTransaction] = useState(false);
    const [attendance, setAttendance] = useState(false);
    const [stock, setStock] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (
            location.pathname === "/admin/purchase-request" ||
            location.pathname === "/admin/view-purchase-request" ||
            location.pathname === "/admin/purchase-order" ||
            location.pathname === "/admin/view-purchase-order" ||
            location.pathname === "/admin/purchase-recieving" ||
            location.pathname === "/admin/view-purchase-recieving" ||
            location.pathname === "/admin/purchase-return" ||
            location.pathname === "/admin/view-purchase-return" ||
            location.pathname === "/admin/issue" ||
            location.pathname === "/admin/view-issue" ||
            location.pathname === '/admin/issue-return' ||
            location.pathname === '/admin/view-issue-return'
        ) {
            setTransaction(true);
        }

        if (
            location.pathname === "/admin/daily-attendance" ||
            location.pathname === "/admin/project-attendance"
        ) {
            setAttendance(true);
        }

        if (
            location.pathname === "/admin/stock" ||
            location.pathname === "/admin/pms-stock"
        ) {
            setStock(true);
        }
    }, [location.pathname]);

    const handleTransaction = () => {
        setTransaction(!transaction);
    };
    const handleAttendance = () => {
        setAttendance(!attendance);
    };
    const handleStock = () => {
        setStock(!stock);
    };

    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll side-bar-scroll">
                <div id="sidebar-menu" className="sidebar-menu">
                    <ul>
                        <li>
                            <Link to="/admin/dashboard" className={`${location.pathname === '/admin/dashboard' ? 'active' : ''}`}><span className="menu-side">
                                <LayoutDashboard className='Dash-iCon' />
                            </span> <span>Dashboard</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/firm-management" className={`${location.pathname === '/admin/firm-management' ||
                                location.pathname === '/admin/manage-firm' ? 'active' : ''}`}><span className="menu-side">
                                    {/* <img src="/assets/img/icons/firm.svg" alt="firm-img" /> */}
                                    <Building2 className='Dash-iCon' />
                                </span> <span>Firm</span></Link>
                        </li>

                        <li>
                            <Link to="/admin/year-management" className={`${location.pathname === '/admin/year-management' ||
                                location.pathname === '/admin/manage-year' ? 'active' : ''}`}><span className="menu-side">
                                    <Calendar className='Dash-iCon' />
                                </span> <span>Year</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/erprole-management" className={`${location.pathname === '/admin/erprole-management' ||
                                location.pathname === '/admin/manage-erprole' ? 'active' : ''}`}><span className="menu-side">
                                    <Calendar className='Dash-iCon' />
                                </span> <span>Roles</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/project-type-management" className={`${location.pathname === '/admin/project-type-management' ||
                                location.pathname === '/admin/manage-project-type' ? 'active' : ''}`}><span className="menu-side">
                                    <Calendar className='Dash-iCon' />
                                </span> <span>Project Type</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/product-management" className={`${location.pathname === '/admin/product-management' ||
                                location.pathname === '/admin/manage-product' ? 'active' : ''}`}><span className="menu-side">
                                    <Calendar className='Dash-iCon' />
                                </span> <span>Products</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/contractor-management" className={`${location.pathname === '/admin/contractor-management' ||
                                location.pathname === '/admin/manage-contractor' ? 'active' : ''}`}><span className="menu-side">
                                    <ContactRound className='Dash-iCon' />
                                </span> <span>Contractor</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/auth-people-management" className={`${location.pathname === '/admin/auth-people-management' ||
                                location.pathname === '/admin/manage-auth-people' ? 'active' : ''}`}><span className="menu-side" >
                                    <ShieldCheck className="Dash-iCon" /></span>
                                <span>Auth People</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/client-management" className={`${location.pathname === '/admin/client-management' ||
                                location.pathname === '/admin/manage-client' ? 'active' : ''}`}><span className="menu-side" >
                                    <UserPlus className="Dash-iCon" /></span>
                                <span>Client</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/department-management" className={`${location.pathname === '/admin/department-management' ||
                                location.pathname === '/admin/manage-department' ? 'active' : ''}`}><span className="menu-side" >
                                    <Building2 className="Dash-iCon" /></span>
                                <span>Department</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/project-management"
                                className={`${location.pathname === "/admin/project-management" || location.pathname === "/admin/manage-project" ? "active" : ""}`}>
                                <span className="menu-side">
                                    <Presentation className="Dash-iCon" />
                                </span>
                                <span>Project</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/user-management" className={`${location.pathname === '/admin/user-management' ||
                                location.pathname === '/admin/manage-user' ? 'active' : ''}`}><span className="menu-side" >
                                    <Users className="Dash-iCon" /></span> <span>User</span></Link>
                        </li>

                        <li>
                            <Link to="/admin/verify-request-management" className={`${location.pathname === '/admin/verify-request-management' ||
                                location.pathname === '/admin/view-request'
                                ? 'active' : ''}`}><span className="menu-side" >
                                    <MailWarning className="Dash-iCon" /></span>
                                <span>Material PO NO </span>
                            </Link>
                        </li>

   <li>
                            <Link to="/admin/verify-request-management-piping" className={`${location.pathname === '/admin/verify-request-management-piping' ||
                                location.pathname === '/admin/view-request-piping'
                                ? 'active' : ''}`}><span className="menu-side" >
                                    <MailWarning className="Dash-iCon" /></span>
                                <span>Piping Material <br/> PO NO </span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/admin/verify-purchase-request" className={`${location.pathname === '/admin/verify-purchase-request' || location.pathname === '/admin/edit-request-admin' ? 'active' : ''}`}><span className="menu-side" >
                                <ShieldCheck className="Dash-iCon" /></span>
                                <span>Verify PR</span>
                            </Link>
                        </li>

                        <li className="submenu">
                            <a
                                className={`${transaction === true ? "subdrop active" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={handleTransaction}>
                                <span className="menu-side">
                                    <BadgeIndianRupee className="Dash-iCon" />
                                </span>
                                <span> Transaction </span> <span className="menu-arrow" />
                            </a>
                            <ul style={{ display: transaction ? "block" : "none" }}>
                                <Link
                                    to="/admin/purchase-request"
                                    className={`${location.pathname === "/admin/purchase-request" || location.pathname === '/admin/view-purchase-request'
                                        ? "active" : ""}`}
                                >
                                    Purchase Request
                                </Link>

                                <Link
                                    to="/admin/purchase-order"
                                    className={`${location.pathname === '/admin/view-purchase-order' || location.pathname === '/admin/purchase-order' ? "active" : ""}`}
                                >
                                    Purchase Order
                                </Link>

                                <Link
                                    to="/admin/purchase-recieving"
                                    className={`${location.pathname === "/admin/purchase-recieving" || location.pathname === '/admin/view-purchase-recieving' ? "active" : ""}`}
                                >
                                    Purchase Recieving
                                </Link>

                                <Link
                                    to="/admin/purchase-return"
                                    className={`${location.pathname === "/admin/purchase-return" ||
                                        location.pathname === '/admin/view-purchase-return' ? "active" : ""}`}
                                >
                                    Purchase Return
                                </Link>

                                <Link to="/admin/issue"
                                    className={`${location.pathname === '/admin/issue' || location.pathname === '/admin/view-issue' ? 'active' : ''}`} >
                                    Issue
                                </Link>
                                <Link to="/admin/issue-return"
                                    className={`${location.pathname === '/admin/issue-return' || location.pathname === '/admin/view-issue-return' ? 'active' : ''}`} >
                                    Issue Return
                                </Link>
                            </ul>
                        </li>

                        <li className="submenu">
                            <a
                                className={`${stock === true ? "subdrop active" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={handleStock}>
                                <span className="menu-side" >
                                    <Package2 className="Dash-iCon" /></span>
                                <span> Stock </span> <span className="menu-arrow" />
                            </a>
                            <ul style={{ display: stock ? "block" : "none" }}>
                                <Link to="/admin/stock" className={`${location.pathname === '/admin/stock' ? 'active' : ''}`}>
                                    <span>MS Stock</span>
                                </Link>
                                <Link to="/admin/pms-stock" className={`${location.pathname === '/admin/pms-stock' ? 'active' : ''}`}>
                                    <span>PMS Stock</span>
                                </Link>
                            </ul>
                        </li>


                        <li className="submenu">
                            <a
                                className={`${attendance === true ? "subdrop active" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={handleAttendance}>
                                <span className="menu-side">
                                    <NotebookPen className="Dash-iCon" />
                                </span>
                                <span> Attendance </span> <span className="menu-arrow" />
                            </a>
                            <ul style={{ display: attendance ? "block" : "none" }}>
                                <Link
                                    to="/admin/daily-attendance"
                                    className={`${location.pathname === "/admin/daily-attendance" ? "active" : ""}`}
                                >
                                    Daily Attendance
                                </Link>

                                <Link
                                    to="/admin/project-attendance"
                                    className={`${location.pathname === '/admin/view-purchase-order' || location.pathname === '/admin/project-attendance' ? "active" : ""}`}
                                >
                                    Project Attendance
                                </Link>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;