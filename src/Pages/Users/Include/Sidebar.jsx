import { CircleCheckBig, ClipboardCheck, Cog, LayoutDashboard, LayoutList, List, ListCollapse, NotebookPen, NotebookText, Package, Package2, PackageOpen, ReceiptIndianRupee, ScrollText, SendHorizontal, ShoppingCart, SprayCan, Users, Warehouse } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarPath from "./SidebarPath";
import SidebarLink from "./SidebarLink";
import { PLAN } from "../../../BaseUrl";
import { PlanningAuth } from "../../../Routes/Users/Auth/AuthGuard";
import { menuAccessConfig } from "../Components/MenuAccess/MenuAccess";

const Sidebar = () => {
  const location = useLocation();

  const [storeMenu, setStoreMenu] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [projectStore, setProjectStore] = useState(false);
  const [materialReturn, setMaterialReturn] = useState(false);
  const [report, setReport] = useState(false);
  const [execution, setExecution] = useState(false);
  const [executionCheck, setExecutionCheck] = useState(false);
  const [ndt, setNdt] = useState(false);
  const [ndtUt, setNdtUt] = useState(false);
  const [ndtRt, setNdtRt] = useState(false);
  const [ndtMpt, setNdtMpt] = useState(false);
  const [ndtLpt, setNdtLpt] = useState(false);
  const [paintDispatch, setPaintDispatch] = useState(false);
  const [painting, setPainting] = useState(false);
  const [surfacePrimer, setSurfacePrimer] = useState(false);
  const [mioPaint, setMioPaint] = useState(false);
  const [topPaint, setTopPaint] = useState(false);

  const toggleState = (setter, value) => () => setter(!value);

  const hasAccess = (item) => menuAccessConfig[item]?.includes(localStorage.getItem('ERP_ROLE'));

  const handlePlanner = toggleState(setPlanning, planning);
  const handleProjectStore = toggleState(setProjectStore, projectStore);
  const handleProjectReturn = toggleState(setMaterialReturn, materialReturn);
  const handleStore = toggleState(setStoreMenu, storeMenu);
  const handleExecution = toggleState(setExecution, execution);
  const handleExecutionCheck = toggleState(setExecutionCheck, executionCheck);
  const handleNdt = toggleState(setNdt, ndt);
  const handleNdtUt = toggleState(setNdtUt, ndtUt);
  const handleNdtRt = toggleState(setNdtRt, ndtRt);
  const handleNdtMpt = toggleState(setNdtMpt, ndtMpt);
  const handleNdtLpt = toggleState(setNdtLpt, ndtLpt);
  const handlePaintDispatch = toggleState(setPaintDispatch, paintDispatch);
  const handlePainting = toggleState(setPainting, painting);
  const handleSurfacePrimer = toggleState(setSurfacePrimer, surfacePrimer);
  const handleMioPaint = toggleState(setMioPaint, mioPaint);
  const handleTopPaint = toggleState(setTopPaint, topPaint);

  return (
    <div className="sidebar" id="sidebar">
      <SidebarPath
        location={location}
        setStoreMenu={setStoreMenu}
        setPlanning={setPlanning}
        setProjectStore={setProjectStore}
        setReport={setReport}
        setExecution={setExecution}
        setExecutionCheck={setExecutionCheck}
        setNdt={setNdt}
        setNdtUt={setNdtUt}
        setNdtRt={setNdtRt}
        setNdtMpt={setNdtMpt}
        setNdtLpt={setNdtLpt}
        setPaintDispatch={setPaintDispatch}
        setPainting={setPainting}
        setSurfacePrimer={setSurfacePrimer}
        setMioPaint={setMioPaint}
        setTopPaint={setTopPaint}
      />
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <Link
                to="/user/project-store/dashboard"
                className={`${location.pathname === "/user/project-store/dashboard" ? "active" : ""}`}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                <span>Dashboard </span>
              </Link>
            </li>
            {hasAccess('BILL') && (
              <SidebarLink url={'/user/project-store/invoice-management'} url2={'/user/project-store/manage-invoice'} iconName={'ReceiptIndianRupee'} name={'Invoice/Bill'} />
            )}
            {hasAccess('DPR') && (
              <li>
                <Link to="/user/project-store/dpr-management" className={`${location.pathname === "/user/project-store/dpr-management" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DPR</span>
                </Link>
              </li>
            )}
            {hasAccess('DMRCATEGORIES') && (
              <li>
                <Link to="/user/project-store/dmr-categories" className={`${location.pathname === "/user/project-store/dmr-categories" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DMR Categorise</span>
                </Link>
              </li>
              )}
            {hasAccess('DMR') && (
              <li>
                <Link to="/user/project-store/dmr-management" className={`${location.pathname === "/user/project-store/dmr-management" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DMR</span>
                </Link>
              </li>
            )}

            <li className="submenu">
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a className={`${storeMenu === true ? "subdrop active" : ""}`}
                onClick={handleStore} style={{ cursor: "pointer" }}>
                <span className="menu-side">
                  <Warehouse className="Dash-iCon" />
                </span>
                <span>Project Data</span> <span className="menu-arrow" />
              </a>
              <ul style={{ display: storeMenu ? "block" : "none" }}>
                <li>
                  {hasAccess('Unit') && (
                    <Link to="/user/project-store/unit-management" className={`${location.pathname === "/user/project-store/unit-management" ||
                      location.pathname === "/user/project-store/manage-unit" ? "active" : ""}`} >
                      Unit
                    </Link>
                  )}
                  {hasAccess('ItemCategory') && (
                    <Link to="/user/project-store/category-management"
                      className={`${location.pathname === "/user/project-store/category-management" ||
                        location.pathname === "/user/project-store/manage-category" ? "active" : ""}`}>
                      Item Category
                    </Link>
                  )}
                  {hasAccess('Transport') && (
                    <Link to="/user/project-store/transport-management" className={`${location.pathname === "/user/project-store/transport-management" ||
                      location.pathname === "/user/project-store/manage-transport" ? "active" : ""}`}>
                      Transport
                    </Link>
                  )}
                  {hasAccess('InventoryLocation') && (
                    <Link to="/user/project-store/inventory-location-management"
                      className={`${location.pathname === "/user/project-store/inventory-location-management" ||
                        location.pathname === "/user/project-store/manage-inventory-location" ? "active" : ""}`}>
                      Inventory Location
                    </Link>
                  )}
                  {/* <Link to="/user/project-store/auth-person-management" className={`${location.pathname === "/user/project-store/auth-person-management" ||
                    location.pathname === "/user/project-store/manage-auth-person" ? "active" : ""}`}>
                    Auth Person
                  </Link> */}
                  {/* <Link to="/user/project-store/party-group-management"
                    className={`${location.pathname === "/user/project-store/party-group-management" ||
                      location.pathname === "/user/project-store/manage-party-group" ? "active" : ""}`}>
                    Party Group
                  </Link> */}
                  {hasAccess('JointType') && (
                    <Link to="/user/project-store/joint-type-management"
                      className={`${location.pathname === "/user/project-store/joint-type-management" ||
                        location.pathname === "/user/project-store/manage-joint-type" ? "active" : ""}`}>
                      Joint Type
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/user/project-store/ndt-master-management"
                      className={`${location.pathname === "/user/project-store/ndt-master-management" ||
                        location.pathname === "/user/project-store/manage-ndt-master" ? "active" : ""}`}>
                      NDT
                    </Link>
                  )}
                  {hasAccess('Contractor') && (
                    <Link to="/user/project-store/contractor-master-management"
                      className={`${location.pathname === '/user/project-store/contractor-master-management' ||
                        location.pathname === '/user/project-store/manage-contractor-master' ? 'active' : ''}`} >
                      Contractor
                    </Link>
                  )}
                  {hasAccess('PaintManufacturer') && (
                    <Link to="/user/project-store/paint-manufacture-management"
                      className={`${location.pathname === '/user/project-store/paint-manufacture-management' ||
                        location.pathname === '/user/project-store/manage-paint-manufacture' ? 'active' : ''}`} >
                      Paint Manufacturer
                    </Link>
                  )}
                  {hasAccess('PaintingSystem') && (
                    <Link to="/user/project-store/painting-system-management"
                      className={`${location.pathname === '/user/project-store/painting-system-management' ||
                        location.pathname === '/user/project-store/manage-painting-system' ? 'active' : ''}`} >
                      Painting System
                    </Link>
                  )}
                  {hasAccess('WPS') && (
                    <Link to="/user/project-store/wps-master-management"
                      className={`${location.pathname === '/user/project-store/wps-master-management' ||
                        location.pathname === '/user/project-store/manage-wps-master' ? 'active' : ''}`} >
                      WPS
                    </Link>
                  )}
                  {hasAccess('QualifiedWelder') && (
                    <Link to="/user/project-store/welder-management"
                      className={`${location.pathname === "/user/project-store/welder-management" ||
                        location.pathname === "/user/project-store/manage-welder" ? 'active' : ""}`} >
                      Qualified Welder
                    </Link>
                  )}
                  {hasAccess('ProcedureSpecification') && (
                    <Link to="/user/project-store/procedure-master-management"
                      className={`${location.pathname === "/user/project-store/procedure-master-management" ||
                        location.pathname === "/user/project-store/manage-procedure-master" ? 'active' : ""}`} >
                      Procedire & <br /> Specification
                    </Link>
                  )}
                  {hasAccess('ProjectLocation') && (
                    <Link to="/user/project-store/project-location-management"
                      className={`${location.pathname === "/user/project-store/project-location-management" ||
                        location.pathname === "/user/project-store/manage-project-location" ? 'active' : ""}`} >
                      Project Location
                    </Link>
                  )}
                </li>
              </ul>
            </li>

            {hasAccess('Party') && (
              <li>
                <Link to="/user/project-store/party-management"
                  className={`${location.pathname === "/user/project-store/party-management" ||
                    location.pathname === "/user/project-store/manage-party" ? "active" : ""}`}>
                  <span className="menu-side"><Users className="Dash-iCon" /> </span>
                  <span>Party</span>
                </Link>
              </li>
            )}
            {hasAccess('SectionDetails') && (
              <li>
                <Link to="/user/project-store/item-management"
                  className={`${location.pathname === "/user/project-store/item-management" ||
                    location.pathname === "/user/project-store/manage-item" ? "active" : ""}`}>
                  <span className="menu-side"><LayoutList className="Dash-iCon" /> </span>
                  <span>Section Details</span>
                </Link>
              </li>
            )}

            <li>
              <PlanningAuth>
                <Link to="/user/project-store/material-request-management"
                  className={`${location.pathname === "/user/project-store/material-request-management" ||
                    location.pathname === '/user/project-store/manage-material-request' ? "active" : ""}`}>
                  <span className="menu-side">  <Package className="Dash-iCon" /> </span>
                  <span>Raw Material <br /> Procurement</span>
                </Link>
              </PlanningAuth>
            </li>

            {hasAccess('ProjectMaterialStore') && (
              <li className="submenu">
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <a
                  className={`${projectStore === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={handleProjectStore}>
                  <span className="menu-side">
                    <ShoppingCart className="Dash-iCon" />
                  </span>
                  <span> Project Material <br /> Store</span> <span className="menu-arrow" />
                </a>
                <ul style={{ display: projectStore ? "block" : "none" }}>
                  {hasAccess('MaterialReceiving') && (
                    <>
                      <Link to="/user/project-store/item-request-management"
                        className={`${location.pathname === '/user/project-store/item-request-management' ||
                          location.pathname === "/user/project-store/view-item-request" ||
                          location.pathname === "/user/project-store/manage-offer-request" ? 'active' : ''}`} >
                        Material Receiving
                      </Link>
                       {hasAccess('FIM') && (
                        <Link to="/user/project-store/fim-packing-list"
                          className={`${location.pathname === '/user/project-store/fim-packing-list' ||
                            location.pathname === "/user/project-store/fim-packing-list" ||
                            location.pathname === "/user/project-store/manage-fim-packing" ? 'active' : ''}`} >
                          FIM
                      </Link>
                      )}
                      <Link to="/user/project-store/offer-item-management"
                        className={`${location.pathname === '/user/project-store/offer-item-management' ||
                          location.pathname === '/user/project-store/view-offered-item' ? 'active' : ''}`} >
                        Offered Request
                      </Link>
                    </>
                  )}

                  {hasAccess('MaterialQC') && (
                    <Link to="/user/project-store/verify-request-management"
                      className={`${location.pathname === '/user/project-store/verify-request-management' ||
                        location.pathname === '/user/project-store/view-qc-request' || location.pathname === '/user/project-store/manage-verify-request'
                        ? 'active' : ''}`}>
                      Material Inspection(QC)
                    </Link>
                  )}
                  <Link to='/user/project-store/issue-request-management'
                    className={`${location.pathname === '/user/project-store/manage-issue-request' || location.pathname === '/user/project-store/issue-request-management'
                      ? 'active' : ''}`} >
                    Material Issue Request
                  </Link>

                  <Link to="/user/project-store/issue-management" className={`${location.pathname === '/user/project-store/issue-management' ||
                    location.pathname === '/user/project-store/manage-issue-acceptance' || location.pathname === '/user/project-store/create-issue-acceptance' ? 'active' : ''}`} >
                    Material Issue Acceptance
                  </Link>

                   <Link to="/user/project-store/issue-acceptance-master-data" className={`${location.pathname === '/user/project-store/issue-acceptance-master-data'
                     ? 'active' : ''}`} >
                    Material Issue Master Data
                  </Link>

                  <Link to="/user/project-store/stock-report-management"
                    className={`${location.pathname === '/user/project-store/stock-report-management' ? 'active' : ''}`}>
                    Stock List
                  </Link>

                  <Link to="/user/project-store/reusable-stock"
                    className={`${location.pathname === '/user/project-store/reusable-stock' ? 'active' : ''}`}>
                    Reusable Stock
                  </Link>
                </ul>
              </li>
            )}

            {hasAccess('ProjectMaterialStore') && (
              <li className="submenu">
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <a
                  className={`${materialReturn === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={handleProjectReturn}>
                  <span className="menu-side">
                    <ShoppingCart className="Dash-iCon" />
                  </span>
                  <span>  Material <br /> Return </span> <span className="menu-arrow" />
                </a>
                <ul style={{ display: materialReturn ? "block" : "none" }}>
                
                  <Link to='/user/project-store/issue-return-note'
                    className={`${location.pathname === '/user/project-store/manage-issue-return-note' || location.pathname === '/user/project-store/issue-return-note'
                      ? 'active' : ''}`} >
                    Material Issue Return Note
                  </Link>

                  <Link to="/user/project-store/issue-return-management" className={`${location.pathname === '/user/project-store/issue-return-management' ||
                    location.pathname === '/user/project-store/manage-issue-return-note-acceptance' || location.pathname === '/user/project-store/create-issue-return-note-acceptance' ? 'active' : ''}`} >
                    Material Issue Return Acceptance
                  </Link>

                  <Link to="/user/project-store/issue-return-summary" className={`${location.pathname === '/user/project-store/issue-return-summary'
                    ? 'active' : ''}`} >
                    Material Issue Return Summary
                  </Link>

                </ul>
              </li>
            )}

            <li className="submenu">
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <a className={`${planning === true ? "subdrop active" : ""}`}
                style={{ cursor: "pointer" }} onClick={handlePlanner}>
                <span className="menu-side">
                  <NotebookPen className="Dash-iCon" />
                </span>
                <span> Drawing Control </span> <span className="menu-arrow" />
              </a>
              <ul style={{ display: planning ? "block" : "none" }}>
                <Link to="/user/project-store/drawing-management" className={`${location.pathname === '/user/project-store/drawing-management' ||
                  location.pathname === '/user/project-store/manage-drawing' ? 'active' : ''}`} >
                  Drawing / Issue
                </Link>
                <Link to="/user/project-store/drawing-master-data" className={`${location.pathname === '/user/project-store/drawing-master-data' ? 'active' : ''}`} >
                  Drawing Master Data
                </Link>
                <Link to="/user/project-store/view-drawing" className={`${location.pathname === '/user/project-store/view-drawing' ? 'active' : ''}`} >
                  View Drawing
                </Link>

              </ul>
            </li>

            {hasAccess('ExecutionOffer') && (
              <li className="submenu">
                <a className={`${execution === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={handleExecution}>
                  <span className="menu-side">
                    <Cog className="Dash-iCon" />
                  </span>
                  <span> Execution / <br /> Offering</span> <span className="menu-arrow" />
                </a>
                <ul style={{ display: execution ? "block" : "none" }}>
                  <Link to="/user/project-store/fitup-management"
                    className={`${location.pathname === '/user/project-store/fitup-management' ||
                      location.pathname === '/user/project-store/manage-fitup'
                      ? 'active' : ''}`} >
                    Fit-Up
                  </Link>

                  <Link to="/user/project-store/weld-visual-management"
                    className={`${location.pathname === '/user/project-store/weld-visual-management' ||
                      location.pathname === '/user/project-store/manage-weld-visual'
                      ? 'active' : ''}`} >
                    Weld Visual
                  </Link>

                  <Link to="/user/project-store/final-dimension-offer-management"
                    className={`${location.pathname === '/user/project-store/final-dimension-offer-management' ||
                      location.pathname === '/user/project-store/manage-final-dimension-offer'
                      ? 'active' : ''}`} >
                    Final Dimension
                  </Link>
                </ul>
              </li>
            )}
            {hasAccess('ClearanceQC') && (
              <li className="submenu">
                <a className={`${executionCheck === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={handleExecutionCheck}>
                  <span className="menu-side">
                    <CircleCheckBig className="Dash-iCon" />
                  </span>
                  <span> Quality / <br /> Clearance</span>  <span className="menu-arrow" />
                </a>
                <ul style={{ display: executionCheck ? "block" : "none" }}>
                  <Link
                    to='/user/project-store/fitup-clearance-management'
                    // to="/user/project-store/quality-clearance-fitup-management"
                    className={`${location.pathname === '/user/project-store/quality-clearance-fitup-management' ||
                      location.pathname === '/user/project-store/fitup-clearance-management' || location.pathname === '/user/project-store/view-quality-clearance-fitup'
                      ? 'active' : ''}`} >
                    Fit-Up
                  </Link>

                  <Link
                    to="/user/project-store/weld-visual-clearance-management"
                    // to="/user/project-store/quality-clearance-weld-visual-management"
                    className={`${location.pathname === '/user/project-store/quality-clearance-weld-visual-management' ||
                      location.pathname === '/user/project-store/weld-visual-clearance-management' ? 'active' : ''}`} >
                    Weld Visual
                  </Link>

                  <Link to="/user/project-store/final-dimension-clearance-management"
                    className={`${location.pathname === '/user/project-store/quality-clearance-final-dimension-management' ||
                      location.pathname === '/user/project-store/final-dimension-clearance-management'
                      ? 'active' : ''}`} >
                    Final Dimension
                  </Link>
                </ul>
              </li>
            )}

            {hasAccess('NDT_DROP') && (
              <li className="submenu">
                <a className={`${ndt === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={handleNdt}><span className="menu-side"><span className="menu-side">
                    <ClipboardCheck className="Dash-iCon" />
                  </span></span> <span>NDT Master</span> <span
                    className="menu-arrow"></span></a>
                <ul style={{ display: ndt ? 'block' : 'none' }}>
                  <li>
                    {hasAccess('NDT_MASTER') && (
                      <Link to='/user/project-store/ndt-management'
                        className={`${location.pathname === '/user/project-store/ndt-management' || location.pathname === '/user/project-store/manage-ndt' ? 'active' : ''}`}>
                        NDT
                      </Link>
                    )}

                    {hasAccess('NDT_PROCESS') && (
                      <>
                        <li className="submenu">
                          <a className={`${ndtUt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtUt}><span>UT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtUt ? 'block' : 'none' }}>
                            <li><Link to='/user/project-store/ut-offer-management' className={`${location.pathname === '/user/project-store/ut-offer-management' ||
                              location.pathname === '/user/project-store/manage-ut-offer' ? 'active' : ''}`}><span>Offering</span></Link></li>
                            <li>
                              <Link to='/user/project-store/ut-clearance-management'
                                className={`${location.pathname === '/user/project-store/ut-clearance-management' || location.pathname === '/user/project-store/manage-ut-clearance' ? 'active' : ''}`}><span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="submenu">
                          <a className={`${ndtRt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtRt}><span>RT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtRt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/user/project-store/rt-offer-management' className={`${location.pathname === '/user/project-store/rt-offer-management' ||
                                location.pathname === '/user/project-store/manage-rt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/user/project-store/rt-clearance-management' className={`${location.pathname === '/user/project-store/rt-clearance-management' ||
                                location.pathname === '/user/project-store/manage-rt-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="submenu">
                          <a className={`${ndtMpt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtMpt}><span>MPT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtMpt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/user/project-store/mpt-offer-management' className={`${location.pathname === '/user/project-store/mpt-offer-management' ||
                                location.pathname === '/user/project-store/manage-mpt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/user/project-store/mpt-clearance-management'
                                className={`${location.pathname === '/user/project-store/mpt-clearance-management' ||
                                  location.pathname === '/user/project-store/manage-mpt-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="submenu">
                          <a className={`${ndtLpt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtLpt}><span>LPT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtLpt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/user/project-store/lpt-offer-management' className={`${location.pathname === '/user/project-store/lpt-offer-management' ||
                                location.pathname === '/user/project-store/manage-lpt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/user/project-store/lpt-clearance-management' className={`${location.pathname === '/user/project-store/lpt-clearance-management' ||
                                location.pathname === '/user/project-store/manage-lpt-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </>
                    )}
                  </li>
                </ul>
              </li>
            )}

            {hasAccess('IRNDispatch_PAINT') && (
              <li className="submenu">
                <a className={`${paintDispatch === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={handlePaintDispatch}>
                  <span className="menu-side">
                    <ScrollText className="Dash-iCon" />
                  </span>
                  <span> IRN/Dispatch</span> <span className="menu-arrow" />
                </a>
                <ul style={{ display: paintDispatch ? "block" : "none" }}>
                  {hasAccess('ISR') && (
                    <Link to="/user/project-store/inspection-summary-management"
                      className={`${location.pathname === '/user/project-store/inspection-summary-management' || location.pathname === '/user/project-store/view-inspection-summary' || location.pathname === '/user/project-store/view-geninspection-summary' ? 'active' : ''}`}>
                      Inspection Summary Records
                    </Link>
                  )}
                  {hasAccess('PAINT_DISPATCH') && (
                    <Link to="/user/project-store/dispatch-note-management"
                      className={`${location.pathname === '/user/project-store/dispatch-note-management' || location.pathname === '/user/project-store/manage-dispatch-note' || location.pathname === '/user/project-store/view-dispatch-note' ? 'active' : ''}`}>
                      Disptch Note For Painting
                    </Link>
                  )}
                </ul>
              </li>
            )}

            {hasAccess('PAINT_MASTER') && (
              <li className="submenu">
                <a className={`${painting === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={handlePainting}><span className="menu-side"><span className="menu-side">
                    <ClipboardCheck className="Dash-iCon" />
                  </span></span> <span>Painting </span> <span
                    className="menu-arrow"></span></a>

                <ul style={{ display: painting ? 'block' : 'none' }}>
                  <li className="submenu">
                    <a className={`${surfacePrimer === true ? "subdrop active" : ""}`}
                      style={{ cursor: "pointer" }} onClick={handleSurfacePrimer}><span>Surface & Primer</span><span className="menu-arrow"></span></a>
                    <ul style={{ display: surfacePrimer ? 'block' : 'none' }}>
                      <li>
                        <Link to='/user/project-store/surface-primer-management' className={`${location.pathname === '/user/project-store/surface-primer-management' ||
                          location.pathname === '/user/project-store/manage-surface-primer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/user/project-store/surface-clearance-management' className={`${location.pathname === '/user/project-store/surface-clearance-management' ||
                          location.pathname === '/user/project-store/manage-surface-clearance' || location.pathname === '/user/project-store/view-surface-clearance' ? 'active' : ''}`}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul style={{ display: painting ? 'block' : 'none' }}>
                  <li className="submenu">
                    <a className={`${mioPaint === true ? "subdrop active" : ""}`}
                      style={{ cursor: "pointer" }} onClick={handleMioPaint}><span>MIO Paint</span><span className="menu-arrow"></span></a>
                    <ul style={{ display: mioPaint ? 'block' : 'none' }}>
                      <li>
                        <Link to='/user/project-store/mio-offer-management' className={`${location.pathname === '/user/project-store/mio-offer-management' ||
                          location.pathname === '/user/project-store/manage-mio-offer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/user/project-store/mio-clearance-management' className={`${location.pathname === '/user/project-store/mio-clearance-management' ||
                          location.pathname === '/user/project-store/manage-mio-clearance' || location.pathname === '/user/project-store/view-mio-clearance' ? 'active' : ''}`}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul style={{ display: painting ? 'block' : 'none' }}>
                  <li className="submenu">
                    <a className={`${topPaint === true ? "subdrop active" : ""}`}
                      style={{ cursor: "pointer" }} onClick={handleTopPaint}><span>Final/Top Coat</span><span className="menu-arrow"></span></a>

                    <ul style={{ display: topPaint ? 'block' : 'none' }}>
                      <li>
                        <Link to='/user/project-store/final-coat-management' className={`${location.pathname === '/user/project-store/final-coat-management' ||
                          location.pathname === '/user/project-store/manage-final-coat' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/user/project-store/final-coat-clearance-management' className={`${location.pathname === '/user/project-store/final-coat-clearance-management' ||
                          location.pathname === '/user/project-store/manage-final-coat-clearance' || location.pathname === '/user/project-store/view-final-coat-clearance' ? 'active' : ''}`}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            )}
            {hasAccess('IRN_AFTER') && (
              <li>
                <Link to="/user/project-store/release-note-management"
                  className={`${location.pathname === "/user/project-store/release-note-management" || location.pathname === "/user/project-store/view-release-note" || location.pathname === "/user/project-store/view-Genrelease-note" ? "active" : ""}`}>
                  <span className="menu-side"> <SendHorizontal className="Dash-iCon" /> </span>
                  <span>IRN</span>
                </Link>
              </li>
            )}

            <li>
              <Link to="/user/project-store/packing-list"
                className={`${location.pathname === "/user/project-store/packing-list" ||
                  location.pathname === '/user/project-store/manage-packing' || location.pathname === '/user/project-store/view-packing' ? "active" : ""}`}>
                <span className="menu-side"><PackageOpen className="Dash-iCon" /> </span>
                <span>Packing List</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/user/project-store/notes" target="_blank"
                className={`${location.pathname === "/user/project-store/notes" ? "active" : ""}`}>
                <span className="menu-side"><NotebookText className="Dash-iCon" /> </span>
                <span>Notes</span>
              </Link>
            </li> */}


          </ul>
        </div >
      </div >
    </div >
  );
};

export default Sidebar;
