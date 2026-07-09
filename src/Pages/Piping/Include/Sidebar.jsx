import { CircleCheckBig, ClipboardCheck, Cog, list,FileX,FileBarChart,FileBarChart2,BaggageClaim,LayoutDashboard, FileText, FileCheck,FileCheck2,LayoutList, CircleGauge,List,PackageCheck, ListCollapse, NotebookPen, NotebookText, Package, Package2, PackageOpen, PackageX, PackagePlus, PackageSearch, ReceiptIndianRupee, ScrollText, SendHorizontal, ShoppingCart, SprayCan, Users, Warehouse } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarPath from "./SidebarPath";
import SidebarLink from "./SidebarLink";
import { PLAN } from "../../../BaseUrl";
import { PlanningAuth } from "../../../Routes/Users/Auth/AuthGuard";
import { menuAccessConfigPiping } from "../Components/MenuAccess/MenuAccessPiping";

const Sidebar = () => {
  const location = useLocation();

  const [storeMenu, setStoreMenu] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [materialprocurement, setMaterialProcurement] = useState(false);
  const [projectStore, setProjectStore] = useState(false);
  const [stockMaterial, setStockMaterial] = useState(false);
  const [materialReturn, setMaterialReturn] = useState(false);
  const [report, setReport] = useState(false);
  const [execution, setExecution] = useState(false);
  const [executionCheck, setExecutionCheck] = useState(false);
  const [ndt, setNdt] = useState(false);
  const [ndtLotBook, setNdtLotBook] = useState(false);
  const [ndtUt, setNdtUt] = useState(false);
  const [ndtRt, setNdtRt] = useState(false);
  const [ndtPwht, setNdtPwht] = useState(false);
  const [ndtFt, setNdtFt] = useState(false);
  const [ndtHt, setNdtHt] = useState(false);
  const [ndtPmi, setNdtPmi] = useState(false);
  const [ndtPickling, setNdtPickling] = useState(false);

  // const [ndtFt, setNdtFt] = useState(false);
  const [ndtMpt, setNdtMpt] = useState(false);
  const [ndtLpt, setNdtLpt] = useState(false);
  const [paintDispatch, setPaintDispatch] = useState(false);
  const [painting, setPainting] = useState(false);
  const [stockPainting, setStockPainting] = useState(false);
  const [surfacePrimer, setSurfacePrimer] = useState(false);
  const [mioPaint, setMioPaint] = useState(false);
  const [topPaint, setTopPaint] = useState(false);
 const [stockSurfacePrimer, setStockSurfacePrimer] = useState(false);
  const [stockMioPaint, setStockMioPaint] = useState(false);
  const [stockTopPaint, setStockTopPaint] = useState(false);
  const toggleState = (setter, value) => () => setter(!value);

  const hasAccess = (item) => menuAccessConfigPiping[item]?.includes(localStorage.getItem('ERP_ROLE'));

  const handlePlanner = toggleState(setPlanning, planning);
  const handleProjectStore = toggleState(setProjectStore, projectStore);
  const handleStockMaterial = toggleState(setStockMaterial, stockMaterial);
  const handleProjectReturn = toggleState(setMaterialReturn, materialReturn);
  const handleStore = toggleState(setStoreMenu, storeMenu);
  const handleExecution = toggleState(setExecution, execution);
  const handleExecutionCheck = toggleState(setExecutionCheck, executionCheck);
  const handleNdt = toggleState(setNdt, ndt);
  const handleNdtLotBook = toggleState(setNdtLotBook, ndtLotBook);
  const handleNdtUt = toggleState(setNdtUt, ndtUt);
  const handleNdtRt = toggleState(setNdtRt, ndtRt);
  const handleNdtPwht = toggleState(setNdtPwht, ndtPwht);
  const handleNdtFt = toggleState(setNdtFt, ndtFt);
  const handleNdtHt = toggleState(setNdtHt, ndtHt);
  const handleMaterialProcurement = toggleState(setMaterialProcurement, materialprocurement);
  const handleNdtPmi = toggleState(setNdtPmi, ndtPmi);
  const handleNdtPickling = toggleState(setNdtPickling, ndtPickling);



  const handleNdtMpt = toggleState(setNdtMpt, ndtMpt);
  const handleNdtLpt = toggleState(setNdtLpt, ndtLpt);
  const handlePaintDispatch = toggleState(setPaintDispatch, paintDispatch);
  const handlePainting = toggleState(setPainting, painting);
  const handleStockPainting = toggleState(setStockPainting, stockPainting);
  const handleSurfacePrimer = toggleState(setSurfacePrimer, surfacePrimer);
  const handleMioPaint = toggleState(setMioPaint, mioPaint);
  const handleTopPaint = toggleState(setTopPaint, topPaint);
 const handleStockSurfacePrimer = toggleState(setStockSurfacePrimer, stockSurfacePrimer);
  const handleStockMioPaint = toggleState(setStockMioPaint, stockMioPaint);
  const handleStockTopPaint = toggleState(setStockTopPaint, stockTopPaint);
  return (
    <div className="sidebar" id="sidebar">
      <SidebarPath
        location={location}
        setStoreMenu={setStoreMenu}
        setPlanning={setPlanning}
        setMaterialProcurement={setMaterialProcurement}
        setProjectStore={setProjectStore}
        setStockMaterial={setStockMaterial}
        setReport={setReport}
        setExecution={setExecution}
        setExecutionCheck={setExecutionCheck}
        setNdt={setNdt}
        setNdtLotBook={setNdtLotBook}
        setNdtUt={setNdtUt}
        setNdtRt={setNdtRt}
        setNdtMpt={setNdtMpt}
        setNdtLpt={setNdtLpt}
        setNdtFt={setNdtFt}
        setNdtPwht={setNdtPwht}
        setNdtHt={setNdtHt}
        setNdtPmi={setNdtPmi}
        setNdtPickling={setNdtPickling}
        setPaintDispatch={setPaintDispatch}
        setPainting={setPainting}
        setStockPainting={setStockPainting}

        setSurfacePrimer={setSurfacePrimer}
        setMioPaint={setMioPaint}
        setTopPaint={setTopPaint}

     setStockSurfacePrimer={setStockSurfacePrimer}
        setStockMioPaint={setStockMioPaint}
        setStockTopPaint={setStockTopPaint}
      />
      <div className="sidebar-inner slimscroll side-bar-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li>
              <Link
                to="/piping/user/dashboard"
                className={`${location.pathname === "/piping/user/dashboard" ? "active" : ""}`}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                <span>Dashboard </span>
              </Link>
            </li>
            {hasAccess('BILL') && (
              <SidebarLink url={'/piping/user/invoice-management'} url2={'/piping/user/manage-invoice'} iconName={'ReceiptIndianRupee'} name={'Invoice/Bill'} />
            )}
            {hasAccess('DPR') && (
              <li>
                <Link to="/piping/user/dpr-management" className={`${location.pathname === "/piping/user/dpr-management" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DPR</span>
                </Link>
              </li>
            )}
              {hasAccess('PROJECTFRONTAVAILABILITYSUMMARY') && (
              <li>
                <Link to="/piping/user/project-front-availability-summary" className={`${location.pathname === "/piping/user/project-front-availability-summary" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>Project front <br/> availability  <br/> summary</span>
                </Link>
              </li>
            )}
            {hasAccess('DMRCATEGORIES') && (
              <li>
                <Link to="/piping/user/dmr-categories" className={`${location.pathname === "/piping/user/dmr-categories" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DMR Categorise</span>
                </Link>
              </li>
            )}
            {hasAccess('DMR') && (
              <li>
                <Link to="/piping/user/dmr-management" className={`${location.pathname === "/piping/user/dmr-management" ? "active" : ""}`}>
                  <span className="menu-side"><FileBarChart2 className="Dash-iCon" /> </span>
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
                    <Link to="/piping/user/unit-management" className={`${location.pathname === "/piping/user/unit-management" ||
                      location.pathname === "/piping/user/manage-unit" ? "active" : ""}`} >
                      Unit / UOM
                    </Link>
                  )}
                  {hasAccess('Size') && (
                    <Link to="/piping/user/size-management" className={`${location.pathname === "/piping/user/size-management" ||
                      location.pathname === "/piping/user/manage-size" ? "active" : ""}`} >
                      Size
                    </Link>
                  )}
                  {hasAccess('Unit') && (
                    <Link to="/piping/user/thickness-management" className={`${location.pathname === "/piping/user/thickness-management" ||
                      location.pathname === "/piping/user/manage-thickness" ? "active" : ""}`} >
                      Thickness
                    </Link>
                  )}
                  {hasAccess('ItemCategory') && (
                    <Link to="/piping/user/category-management"
                      className={`${location.pathname === "/piping/user/category-management" ||
                        location.pathname === "/piping/user/manage-category" ? "active" : ""}`}>
                      Item Category
                    </Link>
                  )}
                  {/* {hasAccess('Transport') && (
                    <Link to="/piping/user/transport-management" className={`${location.pathname === "/piping/user/transport-management" ||
                      location.pathname === "/piping/user/manage-transport" ? "active" : ""}`}>
                      Transport
                    </Link>
                  )} */}
                  {hasAccess('InventoryLocation') && (
                    <Link to="/piping/user/inventory-location-management"
                      className={`${location.pathname === "/piping/user/inventory-location-management" ||
                        location.pathname === "/piping/user/manage-inventory-location" ? "active" : ""}`}>
                      Inventory Location
                    </Link>
                  )}
                  {/* <Link to="/piping/user/auth-person-management" className={`${location.pathname === "/piping/user/auth-person-management" ||
                    location.pathname === "/piping/user/manage-auth-person" ? "active" : ""}`}>
                    Auth Person
                  </Link> */}
                  {/* <Link to="/piping/user/party-group-management"
                    className={`${location.pathname === "/piping/user/party-group-management" ||
                      location.pathname === "/piping/user/manage-party-group" ? "active" : ""}`}>
                    Party Group
                  </Link> */}
                  {hasAccess('JointType') && (
                    <Link to="/piping/user/joint-type-management"
                      className={`${location.pathname === "/piping/user/joint-type-management" ||
                        location.pathname === "/piping/user/manage-joint-type" ? "active" : ""}`}>
                      Joint Type
                    </Link>
                  )}
                  {/* {hasAccess('PipingClass') && ( */}
                  <Link to="/piping/user/piping-class-management"
                    className={`${location.pathname === "/piping/user/piping-class-management" ||
                      location.pathname === "/piping/user/manage-piping-class" ? "active" : ""}`}>
                    Piping Class
                  </Link>
                  <Link to="/piping/user/area-management"
                    className={`${location.pathname === "/piping/user/area-management" ||
                      location.pathname === "/piping/user/manage-area" ? "active" : ""}`}>
                    Area / Unit
                  </Link>
                  <Link to="/piping/user/piping-material-specification-management"
                    className={`${location.pathname === "/piping/user/piping-material-specification-management" ||
                      location.pathname === "/piping/user/manage-piping-material-specification" ? "active" : ""}`}>
                    Piping Material Specification
                  </Link>
                  {/* )} */}
                  {hasAccess('NDT') && (
                    <Link to="/piping/user/ndt-contractor-master-management"
                      className={`${location.pathname === "/piping/user/ndt-contractor-master-management" ||
                        location.pathname === "/piping/user/manage-ndt-contractor-master" ? "active" : ""}`}>
                      NDT Contractor
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/piping/user/ndt-master-management"
                      className={`${location.pathname === "/piping/user/ndt-master-management" ||
                        location.pathname === "/piping/user/manage-ndt-master" ? "active" : ""}`}>
                      NDT / Testing Requirements
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/piping/user/ndt-percentage"
                      className={`${location.pathname === "/piping/user/ndt-percentage" ? "active" : ""}`}>
                      NDT Percentage
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/piping/user/pwht-master-management"
                      className={`${location.pathname === "/piping/user/pwht-master-management" ||
                        location.pathname === "/piping/user/manage-pwht-master" ? "active" : ""}`}>
                      PWHT Master
                    </Link>
                  )}

                  {hasAccess('Hardness') && (
                    <Link to="/piping/user/hardness-master-management"
                      className={`${location.pathname === "/piping/user/hardness-master-management" ||
                        location.pathname === "/piping/user/manage-hardness-master" ? "active" : ""}`}>
                      Hardness Master
                    </Link>
                  )}

                  {hasAccess('Contractor') && (
                    <Link to="/piping/user/contractor-master-management"
                      className={`${location.pathname === '/piping/user/contractor-master-management' ||
                        location.pathname === '/piping/user/manage-contractor-master' ? 'active' : ''}`} >
                      Contractor
                    </Link>
                  )}
                  {hasAccess('PaintingRequirement') && (
                    <Link to="/piping/user/painting-requirement-management"
                      className={`${location.pathname === '/piping/user/painting-requirement-management' ||
                        location.pathname === '/piping/user/manage-painting-requirement' ? 'active' : ''}`} >
                      Painting Requirement
                    </Link>
                  )}
                  {hasAccess('PaintManufacturer') && (
                    <Link to="/piping/user/paint-manufacture-management"
                      className={`${location.pathname === '/piping/user/paint-manufacture-management' ||
                        location.pathname === '/piping/user/manage-paint-manufacture' ? 'active' : ''}`} >
                      Paint Manufacturer
                    </Link>
                  )}
                  {hasAccess('PaintingSystem') && (
                    <Link to="/piping/user/painting-system-management"
                      className={`${location.pathname === '/piping/user/painting-system-management' ||
                        location.pathname === '/piping/user/manage-painting-system' ? 'active' : ''}`} >
                      Painting System
                    </Link>
                  )}
                  {hasAccess('WPS') && (
                    <Link to="/piping/user/wps-master-management"
                      className={`${location.pathname === '/piping/user/wps-master-management' ||
                        location.pathname === '/piping/user/manage-wps-master' ? 'active' : ''}`} >
                      WPS
                    </Link>
                  )}
                  {hasAccess('QualifiedWelder') && (
                    <Link to="/piping/user/welder-management"
                      className={`${location.pathname === "/piping/user/welder-management" ||
                        location.pathname === "/piping/user/manage-welder" ? 'active' : ""}`} >
                      Qualified Welder
                    </Link>
                  )}
                  {hasAccess('ProcedureSpecification') && (
                    <Link to="/piping/user/procedure-master-management"
                      className={`${location.pathname === "/piping/user/procedure-master-management" ||
                        location.pathname === "/piping/user/manage-procedure-master" ? 'active' : ""}`} >
                      Procedire & <br /> Specification
                    </Link>
                  )}
                  {hasAccess('ProjectLocation') && (
                    <Link to="/piping/user/project-location-management"
                      className={`${location.pathname === "/piping/user/project-location-management" ||
                        location.pathname === "/piping/user/manage-project-location" ? 'active' : ""}`} >
                      Project Location
                    </Link>
                  )}
                  {hasAccess('PaintingSystem') && (
                    <Link to='/piping/user/final-coat-shade' className={`${location.pathname === '/piping/user/final-coat-shade' ||
                      location.pathname === '/piping/user/final-coat-shade' ? 'active' : ''}`}>
                      Final Coat Shade Card
                    </Link>
                  )}
                </li>
              </ul>
            </li>

               {hasAccess('Party') && (
              <li>
                <Link to="/piping/user/party-management"
                  className={`${location.pathname === "/piping/user/party-management" ||
                    location.pathname === "/piping/user/manage-party" ? "active" : ""}`}>
                  <span className="menu-side"><Users className="Dash-iCon" /> </span>
                  <span>Party</span>
                </Link>
              </li>
            )}
            {hasAccess('SectionDetails') && (
              <li>
                <Link to="/piping/user/item-management"
                  className={`${location.pathname === "/piping/user/item-management" ||
                    location.pathname === "/piping/user/manage-item" ? "active" : ""}`}>
                  <span className="menu-side"><LayoutList className="Dash-iCon" /> </span>
                  <span>Item Details</span>
                </Link>
              </li>
            )}
            
 {hasAccess('FIM') && (
              <li>
                <Link
                  to="/piping/user/fim-packing-list"
                  className={`${location.pathname === '/piping/user/fim-packing-list' ||
                    location.pathname === '/piping/user/manage-fim-packing'
                    ? 'active'
                    : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="menu-side">
                    <BaggageClaim className="Dash-iCon" />
                  </span>
                  <span> FIM </span>
                </Link>
              </li>
            )}

         

            <li>
              <PlanningAuth>
                <Link to="/piping/user/material-request-management"
                  className={`${location.pathname === "/piping/user/material-request-management" ||
                    location.pathname === '/piping/user/manage-material-request' ? "active" : ""}`}>
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
                      <Link to="/piping/user/item-request-management"
                        className={`${location.pathname === '/piping/user/item-request-management' ||
                          location.pathname === "/piping/user/view-item-request" ||
                          location.pathname === "/piping/user/manage-offer-request" ? 'active' : ''}`} >
                        Material Receiving
                      </Link>
                      <Link to="/piping/user/offer-item-management"
                        className={`${location.pathname === '/piping/user/offer-item-management' ||
                          location.pathname === '/piping/user/view-offered-item' ? 'active' : ''}`} >
                        Offered Request
                      </Link>
                    </>
                  )}

                  {hasAccess('MaterialQC') && (
                    <Link to="/piping/user/verify-request-management"
                      className={`${location.pathname === '/piping/user/verify-request-management' ||
                        location.pathname === '/piping/user/view-qc-request' || location.pathname === '/piping/user/manage-verify-request'
                        ? 'active' : ''}`}>
                      Material Inspection(QC)
                    </Link>
                  )}
                  <Link to='/piping/user/issue-request-management'
                    className={`${location.pathname === '/piping/user/manage-issue-request' || location.pathname === '/piping/user/issue-request-management'
                      ? 'active' : ''}`} >
                    Material Issue Request
                  </Link>

                  <Link to="/piping/user/issue-management" className={`${location.pathname === '/piping/user/issue-management' ||
                    location.pathname === '/piping/user/manage-issue-acceptance' || location.pathname === '/piping/user/create-issue-acceptance' ? 'active' : ''}`} >
                    Material Issue Acceptance
                  </Link>

                  <Link to="/piping/user/issue-acceptance-master-data" className={`${location.pathname === '/piping/user/issue-acceptance-master-data'
                    ? 'active' : ''}`} >
                    Material Issue Master Data
                  </Link>

                  <Link to="/piping/user/stock-report-management"
                    className={`${location.pathname === '/piping/user/stock-report-management' ? 'active' : ''}`}>
                    Stock List
                  </Link>

                  <Link to="/piping/user/reusable-stock"
                    className={`${location.pathname === '/piping/user/reusable-stock' ? 'active' : ''}`}>
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
                
                  <Link to='/piping/user/issue-return-note'
                    className={`${location.pathname === '/piping/user/manage-issue-return-note' || location.pathname === '/piping/user/issue-return-note'
                      ? 'active' : ''}`} >
                    Material Issue Return Note
                  </Link>

                  <Link to="/piping/user/issue-return-management" className={`${location.pathname === '/piping/user/issue-return-management' ||
                    location.pathname === '/piping/user/manage-issue-return-note-acceptance' || location.pathname === '/piping/user/create-issue-return-note-acceptance' ? 'active' : ''}`} >
                    Material Issue Return Acceptance
                  </Link>

                  <Link to="/piping/user/issue-return-summary" className={`${location.pathname === '/piping/user/issue-return-summary'
                    ? 'active' : ''}`} >
                    Material Issue Return Master Summary
                  </Link>

                </ul>
              </li>
            )}

          {hasAccess('ProjectMaterialStore') && (
              <li className="submenu">
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <a
                  className={`${stockMaterial === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={handleStockMaterial}>
                  <span className="menu-side">
                    <ShoppingCart className="Dash-iCon" />
                  </span>
                  <span> Stock Material </span> <span className="menu-arrow" />
                </a>
                <ul style={{ display: stockMaterial ? "block" : "none" }}>
                  {/* {hasAccess('MaterialReceiving') && (
                    <>
                      <Link to="/piping/user/item-request-management"
                        className={`${location.pathname === '/piping/user/item-request-management' ||
                          location.pathname === "/piping/user/view-item-request" ||
                          location.pathname === "/piping/user/manage-offer-request" ? 'active' : ''}`} >
                        Material Receiving
                      </Link>
                      <Link to="/piping/user/offer-item-management"
                        className={`${location.pathname === '/piping/user/offer-item-management' ||
                          location.pathname === '/piping/user/view-offered-item' ? 'active' : ''}`} >
                        Offered Request
                      </Link>
                    </>
                  )} */}

                  {/* {hasAccess('MaterialQC') && (
                    <Link to="/piping/user/verify-request-management"
                      className={`${location.pathname === '/piping/user/verify-request-management' ||
                        location.pathname === '/piping/user/view-qc-request' || location.pathname === '/piping/user/manage-verify-request'
                        ? 'active' : ''}`}>
                      Material Inspection(QC)
                    </Link>
                  )} */}
                  <Link to='/piping/user/stock-wise-issue-request-management'
                    className={`${location.pathname === '/piping/user/manage-stock-wise-issue-request' || location.pathname === '/piping/user/stock-wise-issue-request-management'
                      ? 'active' : ''}`} >
                    Stock Wise Issue Request
                  </Link>

                  <Link to="/piping/user/stock-wise-issue-management" className={`${location.pathname === '/piping/user/stock-wise-issue-management' ||
                    location.pathname === '/piping/user/manage-stock-wise-issue-acceptance' || location.pathname === '/piping/user/create-stock-wise-issue-acceptance' ? 'active' : ''}`} >
                    Stock Wise Issue Acceptance
                  </Link>

                  <Link to="/piping/user/stock-issue-acceptance-master-data" className={`${location.pathname === '/piping/user/stock-issue-acceptance-master-data'
                    ? 'active' : ''}`} >
                    Stock Issue Master Data
                  </Link>
 {/*
                  <Link to="/piping/user/stock-report-management"
                    className={`${location.pathname === '/piping/user/stock-report-management' ? 'active' : ''}`}>
                    Stock List
                  </Link>

                  <Link to="/piping/user/reusable-stock"
                    className={`${location.pathname === '/piping/user/reusable-stock' ? 'active' : ''}`}>
                    Reusable Stock
                  </Link> */}
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
                <Link to="/piping/user/drawing-management" className={`${location.pathname === '/piping/user/drawing-management' ||
                  location.pathname === '/piping/user/manage-drawing' ? 'active' : ''}`} >
                  Drawing / Issue
                </Link>


                <Link to="/piping/user/drawing-master-data" className={`${location.pathname === '/piping/user/drawing-master-data' ? 'active' : ''}`} >
                  Drawing Material Master Data
                </Link>


                <Link to="/piping/user/drawing-joint-master-data" className={`${location.pathname === '/piping/user/drawing-joint-master-data' ? 'active' : ''}`} >
                  Drawing Joint Master Data
                </Link>

                <Link to="/piping/user/drawing-spool-no-wise-area-inch/meter-master-data" className={`${location.pathname === '/piping/user/drawing-spool-no-wise-area-inch/meter-master-data' ? 'active' : ''}`} >
                  Drawing Spool No Wise Area & Inch/Meter
                </Link>

                <Link to="/piping/user/view-drawing" className={`${location.pathname === '/piping/user/view-drawing' ? 'active' : ''}`} >
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
                <Link to="/piping/user/fitup-management"
                  className={`${location.pathname === '/piping/user/fitup-management' ||
                    location.pathname === '/piping/user/manage-fitup'
                    ? 'active' : ''}`} >
                  Fit-Up
                </Link>

                <Link to="/piping/user/dpt-management"
                  className={`${location.pathname === '/piping/user/dpt-management' ||
                    location.pathname === '/piping/user/manage-dpt'
                    ? 'active' : ''}`} >
                  Root DPT
                </Link>

                <Link to="/piping/user/weld-visual-management"
                  className={`${location.pathname === '/piping/user/weld-visual-management' ||
                    location.pathname === '/piping/user/manage-weld-visual'
                    ? 'active' : ''}`} >
                  Weld Visual
                </Link>

                <Link to="/piping/user/final-dimension-offer-management"
                  className={`${location.pathname === '/piping/user/final-dimension-offer-management' ||
                    location.pathname === '/piping/user/manage-final-dimension-offer'
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
                    to='/piping/user/fitup-clearance-management'
                    // to="/piping/user/quality-clearance-fitup-management"
                    className={`${location.pathname === '/piping/user/quality-clearance-fitup-management' ||
                      location.pathname === '/piping/user/fitup-clearance-management' || location.pathname === '/piping/user/view-quality-clearance-fitup'
                      ? 'active' : ''}`} >
                    Fit-Up
                  </Link>

                  <Link
                    to='/piping/user/dpt-clearance-management'
                    // to="/piping/user/quality-clearance-fitup-management"
                    className={`${location.pathname === '/piping/user/quality-clearance-dpt-management' ||
                      location.pathname === '/piping/user/dpt-clearance-management' || location.pathname === '/piping/user/view-quality-clearance-dpt'
                      ? 'active' : ''}`} >
                    Root DPT
                  </Link>

                  <Link
                    to="/piping/user/weld-visual-clearance-management"
                    // to="/piping/user/quality-clearance-weld-visual-management"
                    className={`${location.pathname === '/piping/user/quality-clearance-weld-visual-management' ||
                      location.pathname === '/piping/user/weld-visual-clearance-management' ? 'active' : ''}`} >
                    Weld Visual
                  </Link>

                  <Link to="/piping/user/final-dimension-clearance-management"
                    className={`${location.pathname === '/piping/user/quality-clearance-final-dimension-management' ||
                      location.pathname === '/piping/user/final-dimension-clearance-management'
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
                    className="menu-arrow"></span>
                </a>


                <ul style={{ display: ndt ? 'block' : 'none' }}>
                  <li>
                    {hasAccess('NDT_MASTER') && (
                      <Link to='/piping/user/ndt-summary'
                        className={`${location.pathname === '/piping/user/ndt-summary' || location.pathname === '/piping/user/manage-ndt' ? 'active' : ''}`}>
                        NDT Summary
                      </Link>
                    )}

                    {hasAccess('NDT_PROCESS') && (
                      <>
                        {/* NDT LOT BOOK */}
                        <li className="submenu">

                          {hasAccess('NDT_MASTER') && (
                            <a className={`${ndtLotBook === true ? "subdrop active" : ""}`}
                              style={{ cursor: "pointer" }} onClick={handleNdtLotBook}> <span>Ndt Lot Book</span><span className="menu-arrow"></span></a>
                          )}
                          <ul style={{ display: ndtLotBook ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/rt-lot-book-management' className={`${location.pathname === '/piping/user/rt-lot-book-management' ||
                                location.pathname === '/piping/user/manage-rt-lot-book-management' ? 'active' : ''}`}>
                                <span>RT LOT BOOK</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/lpt-lot-book-management' className={`${location.pathname === '/piping/user/lpt-lot-book-management' ||
                                location.pathname === '/piping/user/manage-lpt-lot-book-management' ? 'active' : ''}`}>
                                <span>LPT LOT BOOK</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/mpt-lot-book-management' className={`${location.pathname === '/piping/user/mpt-lot-book-management' ||
                                location.pathname === '/piping/user/manage-mpt-lot-book-management' ? 'active' : ''}`}>
                                <span>MPT LOT BOOK</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </>
                    )}

                    {hasAccess('NDT_PROCESS') && (
                      <>
                        {/* RT */}

                        <li className="submenu">
                          <a className={`${ndtRt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtRt}><span>RT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtRt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/rt-offer-management' className={`${location.pathname === '/piping/user/rt-offer-management' ||
                                location.pathname === '/piping/user/manage-rt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/rt-clearance-management' className={`${location.pathname === '/piping/user/rt-clearance-management' ||
                                location.pathname === '/piping/user/manage-rt-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>
                        {/* PWHT */}
                        <li className="submenu">
                          <a className={`${ndtPwht === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtPwht}><span>PWHT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtPwht ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/pwht-offer-management' className={`${location.pathname === '/piping/user/pwht-offer-management' ||
                                location.pathname === '/piping/user/manage-pwht-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/pwht-clearance-management' className={`${location.pathname === '/piping/user/pwht-clearance-management' ||
                                location.pathname === '/piping/user/manage-pwht-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        {/* FT */}
                        <li className="submenu">
                          <a className={`${ndtFt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtFt}><span>FT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtFt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/ft-offer-management' className={`${location.pathname === '/piping/user/ft-offer-management' ||
                                location.pathname === '/piping/user/manage-ft-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/ft-clearance-management' className={`${location.pathname === '/piping/user/ft-clearance-management' ||
                                location.pathname === '/piping/user/manage-ft-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        {/* LPT */}
                        <li className="submenu">
                          <a className={`${ndtLpt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtLpt}><span>LPT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtLpt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/lpt-offer-management' className={`${location.pathname === '/piping/user/lpt-offer-management' ||
                                location.pathname === '/piping/user/manage-lpt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/lpt-clearance-management' className={`${location.pathname === '/piping/user/lpt-clearance-management' ||
                                location.pathname === '/piping/user/manage-lpt-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        {/* MPT */}
                        <li className="submenu">
                          <a className={`${ndtMpt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtMpt}><span>MPT</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtMpt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/mpt-offer-management' className={`${location.pathname === '/piping/user/mpt-offer-management' ||
                                location.pathname === '/piping/user/manage-mpt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/mpt-clearance-management'
                                className={`${location.pathname === '/piping/user/mpt-clearance-management' ||
                                  location.pathname === '/piping/user/manage-mpt-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        {/* HARDNESS TASTING */}
                        <li className="submenu">
                          <a className={`${ndtHt === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtHt}><span>Hardness Testing</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtHt ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/ht-offer-management' className={`${location.pathname === '/piping/user/ht-offer-management' ||
                                location.pathname === '/piping/user/manage-ht-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/ht-clearance-management'
                                className={`${location.pathname === '/piping/user/ht-clearance-management' ||
                                  location.pathname === '/piping/user/manage-ht-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        {/* PMI */}
                        <li className="submenu">
                          <a className={`${ndtPmi === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtPmi}><span>PMI</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtPmi ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/pmi-offer-management' className={`${location.pathname === '/piping/user/pmi-offer-management' ||
                                location.pathname === '/piping/user/manage-pmi-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/pmi-clearance-management'
                                className={`${location.pathname === '/piping/user/pmi-clearance-management' ||
                                  location.pathname === '/piping/user/manage-pmi-clearance' ? 'active' : ''}`}>
                                <span>Acc / Rej</span>
                              </Link>
                            </li>
                          </ul>
                        </li>


                        {/* Pickling Passivation */}
                        <li className="submenu">
                          <a className={`${ndtPickling === true ? "subdrop active" : ""}`}
                            style={{ cursor: "pointer" }} onClick={handleNdtPickling}><span>Pickling & <br /> Passivation</span><span className="menu-arrow"></span></a>
                          <ul style={{ display: ndtPickling ? 'block' : 'none' }}>
                            <li>
                              <Link to='/piping/user/pickling-passivation-offer-management' className={`${location.pathname === '/piping/user/pickling-passivation-offer-management' ||
                                location.pathname === '/piping/user/manage-pickling-passivation-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/piping/user/pickling-passivation-clearance-management'
                                className={`${location.pathname === '/piping/user/pickling-passivation-clearance-management' ||
                                  location.pathname === '/piping/user/manage-pickling-passivation-clearance' ? 'active' : ''}`}>
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



            {/* {hasAccess('IRNDispatch_PAINT') && (
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
                    <Link to="/piping/user/inspection-summary-management"
                      className={`${location.pathname === '/piping/user/inspection-summary-management' || location.pathname === '/piping/user/view-inspection-summary' || location.pathname === '/piping/user/view-geninspection-summary' ? 'active' : ''}`}>
                      Inspection Summary Records
                    </Link>
                  )}
                  {hasAccess('PAINT_DISPATCH') && (
                    <Link to="/piping/user/dispatch-note-management"
                      className={`${location.pathname === '/piping/user/dispatch-note-management' || location.pathname === '/piping/user/manage-dispatch-note' || location.pathname === '/piping/user/view-dispatch-note' ? 'active' : ''}`}>
                      Disptch Note For Painting
                    </Link>
                  )}
                </ul>
              </li>
            )} */}

          {hasAccess('PRESSURE_TEST') && (
            <li>
              <Link to="/piping/user/pressure-test" className={`${location.pathname === "/piping/user/pressure-test" ? "active" : ""}`}>
                <span className="menu-side"><CircleGauge className="Dash-iCon" /> </span>
                <span>Pressure Test</span>
              </Link>
            </li>
             )}
           {hasAccess('IRN_AFTER') && (
              <li>
                <Link to="/piping/user/line-history-management"
                  className={`${location.pathname === "/piping/user/line-history-management" || location.pathname === "/piping/user/view-line-history" || location.pathname === "/piping/user/view-Genline-history" ? "active" : ""}`}>
                  <span className="menu-side"> <FileText className="Dash-iCon" /> </span>
                  <span>LHS</span>
                </Link>
              </li>
            )}

        {hasAccess('PAINT_DISPATCH') && (
                  <li>
                    <Link to="/piping/user/dispatch-note-management"
                      className={`${location.pathname === '/piping/user/dispatch-note-management' || location.pathname === '/piping/user/manage-dispatch-note' || location.pathname === '/piping/user/view-dispatch-note' ? 'active' : ''}`}>
                      <span className="menu-side">
                    <ScrollText className="Dash-iCon" />
                  </span>
                     <span> Disptch Note For <br/> Painting </span>
                    </Link>
                    </li>
                  )}

             {hasAccess('PAINT_DISPATCH') && (
                  <li>
                    <Link to="/piping/user/stock-dispatch-note-management"
                      className={`${location.pathname === '/piping/user/stock-dispatch-note-management' || location.pathname === '/piping/user/manage-stock-dispatch-note' || location.pathname === '/piping/user/view-stock-dispatch-note' ? 'active' : ''}`}>
                      <span className="menu-side">
                    <ScrollText className="Dash-iCon" />
                  </span>
                     <span> Stock Disptch Note <br/> For Painting </span>
                    </Link>
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
                        <Link to='/piping/user/surface-primer-management' className={`${location.pathname === '/piping/user/surface-primer-management' ||
                          location.pathname === '/piping/user/manage-surface-primer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/piping/user/surface-clearance-management' className={`${location.pathname === '/piping/user/surface-clearance-management' ||
                          location.pathname === '/piping/user/manage-surface-clearance' || location.pathname === '/piping/user/view-surface-clearance' ? 'active' : ''}`}>
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
                        <Link to='/piping/user/mio-offer-management' className={`${location.pathname === '/piping/user/mio-offer-management' ||
                          location.pathname === '/piping/user/manage-mio-offer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/piping/user/mio-clearance-management' className={`${location.pathname === '/piping/user/mio-clearance-management' ||
                          location.pathname === '/piping/user/manage-mio-clearance' || location.pathname === '/piping/user/view-mio-clearance' ? 'active' : ''}`}>
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
                        <Link to='/piping/user/final-coat-management' className={`${location.pathname === '/piping/user/final-coat-management' ||
                          location.pathname === '/piping/user/manage-final-coat' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/piping/user/final-coat-clearance-management' className={`${location.pathname === '/piping/user/final-coat-clearance-management' ||
                          location.pathname === '/piping/user/manage-final-coat-clearance' || location.pathname === '/piping/user/view-final-coat-clearance' ? 'active' : ''}`}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            )}

              {hasAccess('PAINT_MASTER') && (
              <li className="submenu">
                <a className={`${stockPainting === true ? "subdrop active" : ""}`}
                  style={{ cursor: "pointer" }} onClick={handleStockPainting}><span className="menu-side"><span className="menu-side">
                    <ClipboardCheck className="Dash-iCon" />
                  </span></span> <span>Stock Painting </span> <span
                    className="menu-arrow"></span></a>

                <ul style={{ display: stockPainting ? 'block' : 'none' }}>
                  <li className="submenu">
                    <a className={`${stockSurfacePrimer === true ? "subdrop active" : ""}`}
                      style={{ cursor: "pointer" }} onClick={handleStockSurfacePrimer}><span>Stock Surface & <br/>Primer</span><span className="menu-arrow"></span></a>
                    <ul style={{ display: stockSurfacePrimer ? 'block' : 'none' }}>
                      <li>
                        <Link to='/piping/user/stock-surface-primer-management' className={`${location.pathname === '/piping/user/stock-surface-primer-management' ||
                          location.pathname === '/piping/user/manage-stock-surface-primer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/piping/user/stock-surface-clearance-management' className={`${location.pathname === '/piping/user/stock-surface-clearance-management' ||
                          location.pathname === '/piping/user/manage-stock-surface-clearance' || location.pathname === '/piping/user/view-stock-surface-clearance' ? 'active' : ''}`}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul style={{ display: stockPainting ? 'block' : 'none' }}>
                  <li className="submenu">
                    <a className={`${stockMioPaint === true ? "subdrop active" : ""}`}
                      style={{ cursor: "pointer" }} onClick={handleStockMioPaint}><span>Stock MIO Paint</span><span className="menu-arrow"></span></a>
                    <ul style={{ display: stockMioPaint ? 'block' : 'none' }}>
                      <li>
                        <Link to='/piping/user/stock-mio-offer-management' className={`${location.pathname === '/piping/user/stock-mio-offer-management' ||
                          location.pathname === '/piping/user/manage-stock-mio-offer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/piping/user/stock-mio-clearance-management' className={`${location.pathname === '/piping/user/stock-mio-clearance-management' ||
                          location.pathname === '/piping/user/manage-stock-mio-clearance' || location.pathname === '/piping/user/view-stock-mio-clearance' ? 'active' : ''}`}>
                          <span>Acc / Rej</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>

                <ul style={{ display: stockPainting ? 'block' : 'none' }}>
                  <li className="submenu">
                    <a className={`${stockTopPaint === true ? "subdrop active" : ""}`}
                      style={{ cursor: "pointer" }} onClick={handleStockTopPaint}><span>Stock Final/Top <br/> Coat</span><span className="menu-arrow"></span></a>

                    <ul style={{ display: stockTopPaint ? 'block' : 'none' }}>
                      <li>
                        <Link to='/piping/user/stock-final-coat-management' className={`${location.pathname === '/piping/user/stock-final-coat-management' ||
                          location.pathname === '/piping/user/manage-stock-final-coat' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/piping/user/stock-final-coat-clearance-management' className={`${location.pathname === '/piping/user/stock-final-coat-clearance-management' ||
                          location.pathname === '/piping/user/manage-stock-final-coat-clearance' || location.pathname === '/piping/user/view-stock-final-coat-clearance' ? 'active' : ''}`}>
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
                <Link to="/piping/user/release-note-management"
                  className={`${location.pathname === "/piping/user/release-note-management" || location.pathname === "/piping/user/view-release-note" || location.pathname === "/piping/user/view-Genrelease-note" ? "active" : ""}`}>
                  <span className="menu-side"> <SendHorizontal className="Dash-iCon" /> </span>
                  <span>IRN</span>
                </Link>
              </li>
            )}

               {hasAccess('IRN_AFTER') && (
              <li>
                <Link to="/piping/user/stock-release-note-management"
                  className={`${location.pathname === "/piping/user/stock-release-note-management" || location.pathname === "/piping/user/view-stock-release-note" || location.pathname === "/piping/user/view-stock-Genrelease-note" ? "active" : ""}`}>
                  <span className="menu-side"> <SendHorizontal className="Dash-iCon" /> </span>
                  <span>Stock IRN</span>
                </Link>
              </li>
            )}

            {hasAccess('PACKING_LIST') && (
            <li>
              <Link to="/piping/user/packing-list"
                className={`${location.pathname === "/piping/user/packing-list" ||
                  location.pathname === '/piping/user/manage-packing' || location.pathname === '/piping/user/view-packing' ? "active" : ""}`}>
                <span className="menu-side"><PackageOpen className="Dash-iCon" /> </span>
                <span>Packing List</span>
              </Link>
            </li>
             )}

            {hasAccess('PACKING_LIST') && (
              <li>
              <Link to="/piping/user/packing-list-summary"
                className={`${location.pathname === "/piping/user/packing-list-summary" ? "active" : ""}`}>
                <span className="menu-side"><PackageSearch className="Dash-iCon" /> </span>
                <span>Packing List <br/> Summary </span>
              </Link>
            </li>
              )}

                 {hasAccess('PACKING_LIST') && (
            <li>
              <Link to="/piping/user/stock-packing-list"
                className={`${location.pathname === "/piping/user/stock-packing-list" ||
                  location.pathname === '/piping/user/manage-stock-packing' || location.pathname === '/piping/user/view-stock-packing' ? "active" : ""}`}>
                <span className="menu-side"><PackageOpen className="Dash-iCon" /> </span>
                <span>Stock Packing List</span>
              </Link>
            </li>
             )}

            {hasAccess('PACKING_LIST') && (
              <li>
              <Link to="/piping/user/stock-packing-list-summary"
                className={`${location.pathname === "/piping/user/stock-packing-list-summary" ? "active" : ""}`}>
                <span className="menu-side"><PackageSearch className="Dash-iCon" /> </span>
                <span>Stock Packing List <br/> Summary </span>
              </Link>
            </li>
              )}

          {hasAccess('PACKING_LIST') && (
            <li>
              <Link to="/piping/user/spool-break-up-summary-list"
                className={`${location.pathname === "/piping/user/spool-break-up-summary-list" ? "active" : ""}`}>
                <span className="menu-side"><PackageCheck className="Dash-iCon" /> </span>
                <span>Spool Break-Up <br /> Summary</span>
              </Link>
            </li>
          )}
          {hasAccess('FIM') && (
            <li>
              <Link to="/piping/user/fim-procuement-rejected-summary"
                className={`${location.pathname === "/piping/user/fim-procuement-rejected-summary" ? "active" : ""}`}>
                <span className="menu-side"><FileX className="Dash-iCon" /> </span>
                <span>FIM/Procuement <br /> Rejected  Short <br /> Fall Summary </span>
              </Link>
            </li>
              )}

            {/* <li>
              <Link to="/piping/user/notes" target="_blank"
                className={`${location.pathname === "/piping/user/notes" ? "active" : ""}`}>
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
