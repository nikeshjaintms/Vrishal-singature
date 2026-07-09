import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Images from '../../Images/Img';
import { Tab, Tabs } from 'react-bootstrap';
import PO_ROUTE_URLS from '../../Routes/PoTeam/PoRoutes';

const Main = () => {

  const navigate = useNavigate();

  return (
    <div className="main-wrapper login-body">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-6 login-wrap">
            <div className="login-sec">
              <div className="log-img">
                <img className="img-fluid" src="/assets/img/login-img.png" alt="Logo" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 login-wrap-bg">
            <div className="login-wrapper">
              <div className="loginbox">
                <div className="login-right">
                  <div className="login-right-wrap">
                    <div className="account-logo login-vlogo">
                      <Link to="/user/login"><img src={Images.Logo} alt="account-logo" /></Link>
                      {/* <Link to="/user/login"><img src="/assets/img/login-vlogo.svg" alt="account-logo" /></Link> */}
                    </div>
                    {/* <h4 className='mb-4  tracking-wide leading-relaxed'>VISHAL ENTERPRISE & VRISHAL ENGINEERING <br /> PVT LIMITED GROUP OF COMPANIES</h4> */}
                    <h2>Vishal Login</h2>
                    <div className='login-tabs'>
                      <Tabs defaultActiveKey="admin" className="mb-4 nav nav-pills" fill>
                        <Tab eventKey="admin" title="Admin" className='nav-item'>
                          <div className="d-grid gap-3">
                            {/* <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate('/super-admin/login')}>Superior view</button> */}
                            <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate('/party/login')}>Client Login</button>
                            <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate('/admin/login')}>Admin Login</button>
                          </div>
                        </Tab>
                        <Tab eventKey="payroll" title="Payroll" className='nav-item'>
                          <div className="d-grid gap-3">
                            <button className="btn-block  btn btn-primary" type="button" onClick={() => window.open('https://payroll.vrishal.in/user/login', '_blank')}>Payroll User Login</button>
                          </div>
                        </Tab>

                        <Tab eventKey="mainstore" title="Main Store" className='nav-item'>
                          <div className="d-grid gap-3">
                            <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate('/user/login', { state: { type: 1 } })}>Main Store Login</button>
                          </div>
                        </Tab>

                        <Tab eventKey="pms" title="PMS" className='nav-item'>
                          <div className="d-grid gap-3">
                            <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate(PO_ROUTE_URLS.LOGIN)}>Material Procurement Login</button>
                            <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate('/user/structual/login', { state: { type: 2 } })}>Project Login</button>
                          </div>
                        </Tab>
                      </Tabs>
                    </div>

                    {/* <form>
                      <div className="input-block login-btn">
                      <button className="btn-block  btn btn-primary" type="button" onClick={() => navigate('/admin/login')}>Admin Login</button>
                      <button className="btn-block  btn btn-primary mt-4" type="button" onClick={() => window.open('https://payroll.vrishal.in/user/login', '_blank')}>Payroll User Login</button>
                      <button className="btn-block  btn btn-primary mt-4" type="button" onClick={() => navigate('/user/login', { state: { type: true } })}>Main Store Login</button>
                      <button className="btn-block  btn btn-primary mt-4" type="button" onClick={() => navigate('/user/login', { state: { type: false } })}>STRUCTURAL-PMS Login</button>
                      </div>
                      </form> */}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main