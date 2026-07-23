import React, { useState } from 'react';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import { Link } from 'react-router-dom';
import { greetingComponent } from '../../../Components/GreetingDash/GreetingComponent';

/**
 * Client Piping Dashboard
 * ------------------------
 * Base landing page for the Client Piping module. Kept intentionally simple —
 * no KPI cards yet, since there's no piping-specific "PMS stock" style summary
 * endpoint built for the Party role. The ERP Client Dashboard (Pages/Client/Dashboard/Dashboard.jsx)
 * pulls its cards from getPmsStock(); once a piping equivalent exists on the backend,
 * an intern can wire up the same DashboardCard pattern here.
 */
const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

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
                  <li className="breadcrumb-item">
                    <Link to="/party/piping-store/dashboard">Dashboard</Link>
                  </li>
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
                  <h2>{greetingComponent()}, <span>{localStorage.getItem('PARTY_NAME')}</span></h2>
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;