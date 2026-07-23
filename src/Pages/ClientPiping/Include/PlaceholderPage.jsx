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
 * FOR INTERNS: When you build out a real module (e.g. "RT Clearance Management"),
 * replace the matching <Route path='...' element={<PlaceholderPage title="..." />} />
 * entry in ClientPipingRoute.jsx with your real page component. Use the equivalent
 * staff-facing page under Pages/Piping/... as your business-logic reference, and the
 * equivalent Party-facing page under Pages/Client/... as your reference for how this
 * codebase adapts a staff page into a Party-facing one (auth token, URL prefix, etc.
 * see the header comment in ClientPipingRoute.jsx for the specific conventions to follow).
 *
 * Do not remove the Header/Sidebar/Footer wrapper when you build the real page —
 * keep this same structure so the module fits the rest of the app.
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