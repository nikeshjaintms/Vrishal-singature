import React, { useEffect, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import {getPipingPMS} from '../../../Store/Piping/PipingStock/PipingPMS';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from './components/DashoboardCard';
import { greetingComponent } from '../../../Components/GreetingDash/GreetingComponent';

const Dashboard = () => {
    const dispatch = useDispatch()
    const PmsData = useSelector((state) => state?.getPipingPMS?.user?.data)

    useEffect(() => {
        dispatch(getPipingPMS())
    }, []);

    const cardData = [
        { title: "FABRICATION SCOPE", lastDay: PmsData?.lastDayFabricationScope, overall: PmsData?.overallFabricationScope, icon: "/assets/img/icons/calendar.svg" },
        { title: "ERECTION SCOPE", lastDay: PmsData?.lastDayErectionScope, overall: PmsData?.overallErectionScope, icon: "/assets/img/icons/calendar.svg" },
        { title: "DRAWING ENTRY", lastDay: PmsData?.lastDayCount, overall: PmsData?.overallCount, icon: "/assets/img/icons/calendar.svg" },
        { title: "FRONT AVAILABLE", lastDay: PmsData?.lastDayWorkFront, overall: PmsData?.overallWorkFront, icon: "/assets/img/icons/calendar.svg" },
        { title: "MATERIAL ISSUED", lastDay: PmsData?.lastDayMultiplyIssQty, overall: PmsData?.overallMultiplyIssQty, icon: "/assets/img/icons/calendar.svg" },
        { title: "FIT-UP ACCEPTANCE", lastDay: PmsData?.lastDayFitup, overall: PmsData?.overallFitup, icon: "/assets/img/icons/calendar.svg" },
        { title: "WELD VISUAL ACCEPTANCE", lastDay: PmsData?.lastDayWeldVisual, overall: PmsData?.overallWeldVisual, icon: "/assets/img/icons/calendar.svg" },
        { title: "NDT ACCEPTANCE", lastDay: PmsData?.lastDayNdt, overall: PmsData?.overallNdt, icon: "/assets/img/icons/calendar.svg" },
        { title: "FD ACCEPTANCE", lastDay: PmsData?.lastDayFd, overall: PmsData?.overallFd, icon: "/assets/img/icons/calendar.svg" },
        { title: "DISPATCH NOTE FOR PAITING (INCH-DIA)", lastDay: PmsData?.lastDayDn, overall: PmsData?.overallDn, icon: "/assets/img/icons/calendar.svg" },
        { title: "DISPATCH NOTE FOR PAITING (SQM)", lastDay: PmsData?.lastDayDnAsm, overall: PmsData?.overallDnAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "SURFACE PREPARATION & PRIMER (INCH-DIA)", lastDay: PmsData?.lastDaySurface, overall: PmsData?.overallSurface, icon: "/assets/img/icons/calendar.svg" },
        { title: "SURFACE PREPARATION & PRIMER (SQM)", lastDay: PmsData?.lastDaySurfaceAsm, overall: PmsData?.overallSurfaceAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "MIO PAINT (INCH-DIA)", lastDay: PmsData?.lastDayMio, overall: PmsData?.overallMio, icon: "/assets/img/icons/calendar.svg" },
        { title: "MIO PAINT (SQM)", lastDay: PmsData?.lastDayMioAsm, overall: PmsData?.overallMioAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "Final PAINT (INCH-DIA)", lastDay: PmsData?.lastDayFinalCoat, overall: PmsData?.overallFinalCoat, icon: "/assets/img/icons/calendar.svg" },
        { title: "Final PAINT (SQM)", lastDay: PmsData?.lastDayFinalCoatAsm, overall: PmsData?.overallFinalCoatAsm, icon: "/assets/img/icons/calendar.svg" },

        { title: "DISPATCH PACKING LIST (INCH-DIA)", lastDay: PmsData?.lastDayPacking, overall: PmsData?.overallPacking, icon: "/assets/img/icons/calendar.svg" }, 
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* <div className="good-morning-blk">
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
                    </div> */}
                  
                  <div className="good-morning-blk">
    <div className="row">
        <div className="col-md-6">
            <div className="morning-user">
                <h2>
                    {greetingComponent()}, 
                    <span> {localStorage.getItem('PAY_USER_NAME')}</span>
                </h2>
                <h4>Have a nice day at work</h4>
                <p>
                    Project: <strong>{localStorage.getItem('PAY_USER_PROJECT_NAME')}</strong>
                </p>
                <p>
                    Role: <strong>{localStorage.getItem('ERP_ROLE')}</strong>
                </p>
                <p>
                    Module: <strong>{localStorage.getItem('VI_PRO')}</strong>
                </p>
                 <p>
                    Client Name: <strong>{localStorage.getItem('PAY_CLIENT_NAME')}</strong>
                </p>
              
            </div>
        </div>


        <div className="col-md-6 position-blk">
            <div className="morning-img">
                <img src="/assets/img/morning-img-01.svg" alt="morning-icon" />
            </div>
        </div>
    </div>
</div>

                    <div className="row">
                        {PmsData &&
                            cardData.map((card, index) => (
                                <DashboardCard key={index} {...card} />
                            ))}
                    </div>
                </div>
            </div>
        </div>

       
        
    );
}

export default Dashboard