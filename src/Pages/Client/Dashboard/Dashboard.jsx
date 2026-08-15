import React, { useEffect, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { getPmsStock } from '../../../Store/Store/PMSStock/PMS';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from './components/DashoboardCard';
import { greetingComponent } from '../../../Components/GreetingDash/GreetingComponent';

const Dashboard = () => {
    const dispatch = useDispatch()
    const PmsData = useSelector((state) => state?.getPmsStock?.user?.data)

    useEffect(() => {
        dispatch(getPmsStock())
    }, []);

    const cardData = [
        { title: "DRAWING ENTRY", lastDay: PmsData?.lastDayCount, overall: PmsData?.overallCount, icon: "/assets/img/icons/calendar.svg" },
        { title: "MATERIAL ISSUED", lastDay: PmsData?.lastDayMultiplyIssQty, overall: PmsData?.overallMultiplyIssQty, icon: "/assets/img/icons/calendar.svg" },
        { title: "FIT-UP ACCEPTANCE", lastDay: PmsData?.lastDayFitup, overall: PmsData?.overallFitup, icon: "/assets/img/icons/calendar.svg" },
        { title: "WELD VISUAL ACCEPTANCE", lastDay: PmsData?.lastDayWeldVisual, overall: PmsData?.overallWeldVisual, icon: "/assets/img/icons/calendar.svg" },
        { title: "NDT ACCEPTANCE", lastDay: PmsData?.lastDayNdt, overall: PmsData?.overallNdt, icon: "/assets/img/icons/calendar.svg" },
        { title: "FD ACCEPTANCE", lastDay: PmsData?.lastDayFd, overall: PmsData?.overallFd, icon: "/assets/img/icons/calendar.svg" },
        { title: "DISPATCH NOTE FOR PAITING (KG)", lastDay: PmsData?.lastDayDn, overall: PmsData?.overallDn, icon: "/assets/img/icons/calendar.svg" },
        { title: "DDISPATCH NOTE FOR PAITING (SQM)", lastDay: PmsData?.lastDayDnAsm, overall: PmsData?.overallDnAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "SURFACE PREPARATION & PRIMER (KG)", lastDay: PmsData?.lastDaySurface, overall: PmsData?.overallSurface, icon: "/assets/img/icons/calendar.svg" },
        { title: "SURFACE PREPARATION & PRIMER (SQM)", lastDay: PmsData?.lastDaySurfaceAsm, overall: PmsData?.overallSurfaceAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "MIO PAINT (KG)", lastDay: PmsData?.lastDayMio, overall: PmsData?.overallMio, icon: "/assets/img/icons/calendar.svg" },
        { title: "MIO PAINT (SQM)", lastDay: PmsData?.lastDayMioAsm, overall: PmsData?.overallMioAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "Final PAINT (KG)", lastDay: PmsData?.lastDayFinalCoat, overall: PmsData?.overallFinalCoat, icon: "/assets/img/icons/calendar.svg" },
        { title: "Final PAINT (SQM)", lastDay: PmsData?.lastDayFinalCoatAsm, overall: PmsData?.overallFinalCoatAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "DISPATCH PACKING LIST (KG)", lastDay: PmsData?.lastDayPacking, overall: PmsData?.overallPacking, icon: "/assets/img/icons/calendar.svg" },
        // { title: "Packing ASM", lastDay: PmsData?.lastDayPackingAsm, overall: PmsData?.overallPackingAsm, icon: "/assets/img/icons/calendar.svg" },
    ];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">

                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="good-morning-blk">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="morning-user">
                                    <h2>{greetingComponent()}, <span>{localStorage.getItem('PAY_USER_NAME')}</span></h2>
                                    <p>Have a nice day at work</p>
                                </div>
                            </div>
                            <div className="col-md-6 position-blk">
                                <div className="morning-img">
                                    <img src="/assets/img/morning-img-01.svg" alt="morning-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/calendar.svg" alt="calender-img" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Fit-Up Offer</h4>
                                    <h2>
                                        <CountUp end={PmsData?.fitup_offer} />
                                    </h2>
                                    <p>
                                        <span className="passive-view">
                                            <i className="feather-arrow-up-right me-1"></i>40% </span>
                                        vs last month
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/profile-add.svg" alt="profile-add" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Weld Visual offer</h4>
                                    <h2>
                                        <CountUp end={PmsData?.weldvisual_offer} />
                                    </h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>20% </span> vs
                                        last month</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/scissor.svg" alt="scissor" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Final Dimension</h4>
                                    <h2>
                                        <CountUp end={PmsData?.finaldimension_offer} />
                                    </h2>
                                    <p><span className="negative-view"><i className="feather-arrow-down-right me-1"></i>15% </span>
                                        vs last month</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                            <div className="dash-widget">
                                <div className="dash-boxs comman-flex-center">
                                    <img src="/assets/img/icons/empty-wallet.svg" alt="empty-wallet" />
                                </div>
                                <div className="dash-content dash-count">
                                    <h4>Stock</h4>
                                    <h2><CountUp end={PmsData?.pms_stock} /></h2>
                                    <p><span className="passive-view"><i className="feather-arrow-up-right me-1"></i>30% </span> vs
                                        last month</p>
                                </div>
                            </div>
                        </div>
                    </div> */}


                    <div className="row">
                        {PmsData &&
                            cardData.map((card, index) => (
                                <DashboardCard key={index} {...card} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard