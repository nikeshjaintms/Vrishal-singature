import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * PlaceholderPage
 * ----------------
 * Shared stand-in for every Client Piping module that hasn't been built yet.
 * The routing, layout, auth guard, and sidebar navigation are all wired up
 * and working — this component is what currently renders at the destination.
 *
 * FOR INTERNS: replace the matching <Route path='...' element={<PlaceholderPage title="..." />} />
 * entry in ClientPipingRoute.jsx with your real page component when you build it.
 * Reference Pages/Piping/... for business logic, and Pages/Client/Multiple/... for
 * how this codebase adapts a staff page into a Party-facing one (/party/ prefix,
 * PARTY_TOKEN, no hasAccess() gates — see the header comment in ClientPipingRoute.jsx).
 */
const PlaceholderPage = ({ title }) => {
  const location = useLocation();
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
                  <li className="breadcrumb-item active">{title}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center" style={{ padding: '80px 20px' }}>
              <h3 style={{ marginBottom: '12px' }}>{title}</h3>
              <p style={{ color: '#888', marginBottom: '4px' }}>
                This module is part of the Client Piping base scaffold and hasn't been built out yet.
              </p>
              <p style={{ color: '#888', fontSize: '13px' }}>
                Route: <code>{location.pathname}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlaceholderPage;