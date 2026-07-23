import { CircleCheckBig, ClipboardCheck, Cog, list,FileX,FileBarChart,FileBarChart2,BaggageClaim,LayoutDashboard, FileText, FileCheck,FileCheck2,LayoutList, CircleGauge,List,PackageCheck, ListCollapse, NotebookPen, NotebookText, Package, Package2, PackageOpen, PackageX, PackagePlus, PackageSearch, ReceiptIndianRupee, ScrollText, SendHorizontal, ShoppingCart, SprayCan, Users, Warehouse } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarPath from "./SidebarPath";
import SidebarLink from "./SidebarLink";

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

  // NOTE FOR INTERNS: This Sidebar is adapted from Pages/Piping/Include/Sidebar.jsx (the internal-staff version).
  // That version gates each menu section by internal staff role (ERP_ROLE: QC/Production/Planning/etc via menuAccessConfigPiping).
  // Party (client) sessions never have ERP_ROLE set, so hasAccess is intentionally hardcoded to always return true here —
  // every menu section is visible to all Party users. If a specific Party-role subdivision is ever introduced,
  // replace this with real logic; do NOT reintroduce menuAccessConfigPiping/ERP_ROLE checks, they will silently hide everything.
  const hasAccess = () => true;

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
                to="/party/piping-store/dashboard"
                className={`${location.pathname === "/party/piping-store/dashboard" ? "active" : ""}`}>
                <span className="menu-side"><LayoutDashboard className="Dash-iCon" /> </span>
                <span>Dashboard </span>
              </Link>
            </li>
            {hasAccess('BILL') && (
              <SidebarLink url={'/party/piping-store/invoice-management'} url2={'/party/piping-store/manage-invoice'} iconName={'ReceiptIndianRupee'} name={'Invoice/Bill'} />
            )}
            {hasAccess('DPR') && (
              <li>
                <Link to="/party/piping-store/dpr-management" className={`${location.pathname === "/party/piping-store/dpr-management" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DPR</span>
                </Link>
              </li>
            )}
              {hasAccess('PROJECTFRONTAVAILABILITYSUMMARY') && (
              <li>
                <Link to="/party/piping-store/project-front-availability-summary" className={`${location.pathname === "/party/piping-store/project-front-availability-summary" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>Project front <br/> availability  <br/> summary</span>
                </Link>
              </li>
            )}
            {hasAccess('DMRCATEGORIES') && (
              <li>
                <Link to="/party/piping-store/dmr-categories" className={`${location.pathname === "/party/piping-store/dmr-categories" ? "active" : ""}`}>
                  <span className="menu-side"><ListCollapse className="Dash-iCon" /> </span>
                  <span>DMR Categorise</span>
                </Link>
              </li>
            )}
            {hasAccess('DMR') && (
              <li>
                <Link to="/party/piping-store/dmr-management" className={`${location.pathname === "/party/piping-store/dmr-management" ? "active" : ""}`}>
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
                    <Link to="/party/piping-store/unit-management" className={`${location.pathname === "/party/piping-store/unit-management" ||
                      location.pathname === "/party/piping-store/manage-unit" ? "active" : ""}`} >
                      Unit / UOM
                    </Link>
                  )}
                  {hasAccess('Size') && (
                    <Link to="/party/piping-store/size-management" className={`${location.pathname === "/party/piping-store/size-management" ||
                      location.pathname === "/party/piping-store/manage-size" ? "active" : ""}`} >
                      Size
                    </Link>
                  )}
                  {hasAccess('Unit') && (
                    <Link to="/party/piping-store/thickness-management" className={`${location.pathname === "/party/piping-store/thickness-management" ||
                      location.pathname === "/party/piping-store/manage-thickness" ? "active" : ""}`} >
                      Thickness
                    </Link>
                  )}
                  {hasAccess('ItemCategory') && (
                    <Link to="/party/piping-store/category-management"
                      className={`${location.pathname === "/party/piping-store/category-management" ||
                        location.pathname === "/party/piping-store/manage-category" ? "active" : ""}`}>
                      Item Category
                    </Link>
                  )}
                  {/* {hasAccess('Transport') && (
                    <Link to="/party/piping-store/transport-management" className={`${location.pathname === "/party/piping-store/transport-management" ||
                      location.pathname === "/party/piping-store/manage-transport" ? "active" : ""}`}>
                      Transport
                    </Link>
                  )} */}
                  {hasAccess('InventoryLocation') && (
                    <Link to="/party/piping-store/inventory-location-management"
                      className={`${location.pathname === "/party/piping-store/inventory-location-management" ||
                        location.pathname === "/party/piping-store/manage-inventory-location" ? "active" : ""}`}>
                      Inventory Location
                    </Link>
                  )}
                  {/* <Link to="/party/piping-store/auth-person-management" className={`${location.pathname === "/party/piping-store/auth-person-management" ||
                    location.pathname === "/party/piping-store/manage-auth-person" ? "active" : ""}`}>
                    Auth Person
                  </Link> */}
                  {/* <Link to="/party/piping-store/party-group-management"
                    className={`${location.pathname === "/party/piping-store/party-group-management" ||
                      location.pathname === "/party/piping-store/manage-party-group" ? "active" : ""}`}>
                    Party Group
                  </Link> */}
                  {hasAccess('JointType') && (
                    <Link to="/party/piping-store/joint-type-management"
                      className={`${location.pathname === "/party/piping-store/joint-type-management" ||
                        location.pathname === "/party/piping-store/manage-joint-type" ? "active" : ""}`}>
                      Joint Type
                    </Link>
                  )}
                  {/* {hasAccess('PipingClass') && ( */}
                  <Link to="/party/piping-store/piping-class-management"
                    className={`${location.pathname === "/party/piping-store/piping-class-management" ||
                      location.pathname === "/party/piping-store/manage-piping-class" ? "active" : ""}`}>
                    Piping Class
                  </Link>
                  <Link to="/party/piping-store/area-management"
                    className={`${location.pathname === "/party/piping-store/area-management" ||
                      location.pathname === "/party/piping-store/manage-area" ? "active" : ""}`}>
                    Area / Unit
                  </Link>
                  <Link to="/party/piping-store/piping-material-specification-management"
                    className={`${location.pathname === "/party/piping-store/piping-material-specification-management" ||
                      location.pathname === "/party/piping-store/manage-piping-material-specification" ? "active" : ""}`}>
                    Piping Material Specification
                  </Link>
                  {/* )} */}
                  {hasAccess('NDT') && (
                    <Link to="/party/piping-store/ndt-contractor-master-management"
                      className={`${location.pathname === "/party/piping-store/ndt-contractor-master-management" ||
                        location.pathname === "/party/piping-store/manage-ndt-contractor-master" ? "active" : ""}`}>
                      NDT Contractor
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/party/piping-store/ndt-master-management"
                      className={`${location.pathname === "/party/piping-store/ndt-master-management" ||
                        location.pathname === "/party/piping-store/manage-ndt-master" ? "active" : ""}`}>
                      NDT / Testing Requirements
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/party/piping-store/ndt-percentage"
                      className={`${location.pathname === "/party/piping-store/ndt-percentage" ? "active" : ""}`}>
                      NDT Percentage
                    </Link>
                  )}
                  {hasAccess('NDT') && (
                    <Link to="/party/piping-store/pwht-master-management"
                      className={`${location.pathname === "/party/piping-store/pwht-master-management" ||
                        location.pathname === "/party/piping-store/manage-pwht-master" ? "active" : ""}`}>
                      PWHT Master
                    </Link>
                  )}

                  {hasAccess('Hardness') && (
                    <Link to="/party/piping-store/hardness-master-management"
                      className={`${location.pathname === "/party/piping-store/hardness-master-management" ||
                        location.pathname === "/party/piping-store/manage-hardness-master" ? "active" : ""}`}>
                      Hardness Master
                    </Link>
                  )}

                  {hasAccess('Contractor') && (
                    <Link to="/party/piping-store/contractor-master-management"
                      className={`${location.pathname === '/party/piping-store/contractor-master-management' ||
                        location.pathname === '/party/piping-store/manage-contractor-master' ? 'active' : ''}`} >
                      Contractor
                    </Link>
                  )}
                  {hasAccess('PaintingRequirement') && (
                    <Link to="/party/piping-store/painting-requirement-management"
                      className={`${location.pathname === '/party/piping-store/painting-requirement-management' ||
                        location.pathname === '/party/piping-store/manage-painting-requirement' ? 'active' : ''}`} >
                      Painting Requirement
                    </Link>
                  )}
                  {hasAccess('PaintManufacturer') && (
                    <Link to="/party/piping-store/paint-manufacture-management"
                      className={`${location.pathname === '/party/piping-store/paint-manufacture-management' ||
                        location.pathname === '/party/piping-store/manage-paint-manufacture' ? 'active' : ''}`} >
                      Paint Manufacturer
                    </Link>
                  )}
                  {hasAccess('PaintingSystem') && (
                    <Link to="/party/piping-store/painting-system-management"
                      className={`${location.pathname === '/party/piping-store/painting-system-management' ||
                        location.pathname === '/party/piping-store/manage-painting-system' ? 'active' : ''}`} >
                      Painting System
                    </Link>
                  )}
                  {hasAccess('WPS') && (
                    <Link to="/party/piping-store/wps-master-management"
                      className={`${location.pathname === '/party/piping-store/wps-master-management' ||
                        location.pathname === '/party/piping-store/manage-wps-master' ? 'active' : ''}`} >
                      WPS
                    </Link>
                  )}
                  {hasAccess('QualifiedWelder') && (
                    <Link to="/party/piping-store/welder-management"
                      className={`${location.pathname === "/party/piping-store/welder-management" ||
                        location.pathname === "/party/piping-store/manage-welder" ? 'active' : ""}`} >
                      Qualified Welder
                    </Link>
                  )}
                  {hasAccess('ProcedureSpecification') && (
                    <Link to="/party/piping-store/procedure-master-management"
                      className={`${location.pathname === "/party/piping-store/procedure-master-management" ||
                        location.pathname === "/party/piping-store/manage-procedure-master" ? 'active' : ""}`} >
                      Procedire & <br /> Specification
                    </Link>
                  )}
                  {hasAccess('ProjectLocation') && (
                    <Link to="/party/piping-store/project-location-management"
                      className={`${location.pathname === "/party/piping-store/project-location-management" ||
                        location.pathname === "/party/piping-store/manage-project-location" ? 'active' : ""}`} >
                      Project Location
                    </Link>
                  )}
                  {hasAccess('PaintingSystem') && (
                    <Link to='/party/piping-store/final-coat-shade' className={`${location.pathname === '/party/piping-store/final-coat-shade' ||
                      location.pathname === '/party/piping-store/final-coat-shade' ? 'active' : ''}`}>
                      Final Coat Shade Card
                    </Link>
                  )}
                </li>
              </ul>
            </li>

               {hasAccess('Party') && (
              <li>
                <Link to="/party/piping-store/party-management"
                  className={`${location.pathname === "/party/piping-store/party-management" ||
                    location.pathname === "/party/piping-store/manage-party" ? "active" : ""}`}>
                  <span className="menu-side"><Users className="Dash-iCon" /> </span>
                  <span>Party</span>
                </Link>
              </li>
            )}
            {hasAccess('SectionDetails') && (
              <li>
                <Link to="/party/piping-store/item-management"
                  className={`${location.pathname === "/party/piping-store/item-management" ||
                    location.pathname === "/party/piping-store/manage-item" ? "active" : ""}`}>
                  <span className="menu-side"><LayoutList className="Dash-iCon" /> </span>
                  <span>Item Details</span>
                </Link>
              </li>
            )}
            
 {hasAccess('FIM') && (
              <li>
                <Link
                  to="/party/piping-store/fim-packing-list"
                  className={`${location.pathname === '/party/piping-store/fim-packing-list' ||
                    location.pathname === '/party/piping-store/manage-fim-packing'
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
              <Link to="/party/piping-store/material-request-management"
                className={`${location.pathname === "/party/piping-store/material-request-management" ||
                  location.pathname === '/party/piping-store/manage-material-request' ? "active" : ""}`}>
                <span className="menu-side">  <Package className="Dash-iCon" /> </span>
                <span>Raw Material <br /> Procurement</span>
              </Link>
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
                      <Link to="/party/piping-store/item-request-management"
                        className={`${location.pathname === '/party/piping-store/item-request-management' ||
                          location.pathname === "/party/piping-store/view-item-request" ||
                          location.pathname === "/party/piping-store/manage-offer-request" ? 'active' : ''}`} >
                        Material Receiving
                      </Link>
                      <Link to="/party/piping-store/offer-item-management"
                        className={`${location.pathname === '/party/piping-store/offer-item-management' ||
                          location.pathname === '/party/piping-store/view-offered-item' ? 'active' : ''}`} >
                        Offered Request
                      </Link>
                    </>
                  )}

                  {hasAccess('MaterialQC') && (
                    <Link to="/party/piping-store/verify-request-management"
                      className={`${location.pathname === '/party/piping-store/verify-request-management' ||
                        location.pathname === '/party/piping-store/view-qc-request' || location.pathname === '/party/piping-store/manage-verify-request'
                        ? 'active' : ''}`}>
                      Material Inspection(QC)
                    </Link>
                  )}
                  <Link to='/party/piping-store/issue-request-management'
                    className={`${location.pathname === '/party/piping-store/manage-issue-request' || location.pathname === '/party/piping-store/issue-request-management'
                      ? 'active' : ''}`} >
                    Material Issue Request
                  </Link>

                  <Link to="/party/piping-store/issue-management" className={`${location.pathname === '/party/piping-store/issue-management' ||
                    location.pathname === '/party/piping-store/manage-issue-acceptance' || location.pathname === '/party/piping-store/create-issue-acceptance' ? 'active' : ''}`} >
                    Material Issue Acceptance
                  </Link>

                  <Link to="/party/piping-store/issue-acceptance-master-data" className={`${location.pathname === '/party/piping-store/issue-acceptance-master-data'
                    ? 'active' : ''}`} >
                    Material Issue Master Data
                  </Link>

                  <Link to="/party/piping-store/stock-report-management"
                    className={`${location.pathname === '/party/piping-store/stock-report-management' ? 'active' : ''}`}>
                    Stock List
                  </Link>

                  <Link to="/party/piping-store/reusable-stock"
                    className={`${location.pathname === '/party/piping-store/reusable-stock' ? 'active' : ''}`}>
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
                
                  <Link to='/party/piping-store/issue-return-note'
                    className={`${location.pathname === '/party/piping-store/manage-issue-return-note' || location.pathname === '/party/piping-store/issue-return-note'
                      ? 'active' : ''}`} >
                    Material Issue Return Note
                  </Link>

                  <Link to="/party/piping-store/issue-return-management" className={`${location.pathname === '/party/piping-store/issue-return-management' ||
                    location.pathname === '/party/piping-store/manage-issue-return-note-acceptance' || location.pathname === '/party/piping-store/create-issue-return-note-acceptance' ? 'active' : ''}`} >
                    Material Issue Return Acceptance
                  </Link>

                  <Link to="/party/piping-store/issue-return-summary" className={`${location.pathname === '/party/piping-store/issue-return-summary'
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
                      <Link to="/party/piping-store/item-request-management"
                        className={`${location.pathname === '/party/piping-store/item-request-management' ||
                          location.pathname === "/party/piping-store/view-item-request" ||
                          location.pathname === "/party/piping-store/manage-offer-request" ? 'active' : ''}`} >
                        Material Receiving
                      </Link>
                      <Link to="/party/piping-store/offer-item-management"
                        className={`${location.pathname === '/party/piping-store/offer-item-management' ||
                          location.pathname === '/party/piping-store/view-offered-item' ? 'active' : ''}`} >
                        Offered Request
                      </Link>
                    </>
                  )} */}

                  {/* {hasAccess('MaterialQC') && (
                    <Link to="/party/piping-store/verify-request-management"
                      className={`${location.pathname === '/party/piping-store/verify-request-management' ||
                        location.pathname === '/party/piping-store/view-qc-request' || location.pathname === '/party/piping-store/manage-verify-request'
                        ? 'active' : ''}`}>
                      Material Inspection(QC)
                    </Link>
                  )} */}
                  <Link to='/party/piping-store/stock-wise-issue-request-management'
                    className={`${location.pathname === '/party/piping-store/manage-stock-wise-issue-request' || location.pathname === '/party/piping-store/stock-wise-issue-request-management'
                      ? 'active' : ''}`} >
                    Stock Wise Issue Request
                  </Link>

                  <Link to="/party/piping-store/stock-wise-issue-management" className={`${location.pathname === '/party/piping-store/stock-wise-issue-management' ||
                    location.pathname === '/party/piping-store/manage-stock-wise-issue-acceptance' || location.pathname === '/party/piping-store/create-stock-wise-issue-acceptance' ? 'active' : ''}`} >
                    Stock Wise Issue Acceptance
                  </Link>

                  <Link to="/party/piping-store/stock-issue-acceptance-master-data" className={`${location.pathname === '/party/piping-store/stock-issue-acceptance-master-data'
                    ? 'active' : ''}`} >
                    Stock Issue Master Data
                  </Link>
 {/*
                  <Link to="/party/piping-store/stock-report-management"
                    className={`${location.pathname === '/party/piping-store/stock-report-management' ? 'active' : ''}`}>
                    Stock List
                  </Link>

                  <Link to="/party/piping-store/reusable-stock"
                    className={`${location.pathname === '/party/piping-store/reusable-stock' ? 'active' : ''}`}>
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
                <Link to="/party/piping-store/drawing-management" className={`${location.pathname === '/party/piping-store/drawing-management' ||
                  location.pathname === '/party/piping-store/manage-drawing' ? 'active' : ''}`} >
                  Drawing / Issue
                </Link>


                <Link to="/party/piping-store/drawing-master-data" className={`${location.pathname === '/party/piping-store/drawing-master-data' ? 'active' : ''}`} >
                  Drawing Material Master Data
                </Link>


                <Link to="/party/piping-store/drawing-joint-master-data" className={`${location.pathname === '/party/piping-store/drawing-joint-master-data' ? 'active' : ''}`} >
                  Drawing Joint Master Data
                </Link>

                <Link to="/party/piping-store/drawing-spool-no-wise-area-inch/meter-master-data" className={`${location.pathname === '/party/piping-store/drawing-spool-no-wise-area-inch/meter-master-data' ? 'active' : ''}`} >
                  Drawing Spool No Wise Area & Inch/Meter
                </Link>

                <Link to="/party/piping-store/view-drawing" className={`${location.pathname === '/party/piping-store/view-drawing' ? 'active' : ''}`} >
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
                <Link to="/party/piping-store/fitup-management"
                  className={`${location.pathname === '/party/piping-store/fitup-management' ||
                    location.pathname === '/party/piping-store/manage-fitup'
                    ? 'active' : ''}`} >
                  Fit-Up
                </Link>

                <Link to="/party/piping-store/dpt-management"
                  className={`${location.pathname === '/party/piping-store/dpt-management' ||
                    location.pathname === '/party/piping-store/manage-dpt'
                    ? 'active' : ''}`} >
                  Root DPT
                </Link>

                <Link to="/party/piping-store/weld-visual-management"
                  className={`${location.pathname === '/party/piping-store/weld-visual-management' ||
                    location.pathname === '/party/piping-store/manage-weld-visual'
                    ? 'active' : ''}`} >
                  Weld Visual
                </Link>

                <Link to="/party/piping-store/final-dimension-offer-management"
                  className={`${location.pathname === '/party/piping-store/final-dimension-offer-management' ||
                    location.pathname === '/party/piping-store/manage-final-dimension-offer'
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
                    to='/party/piping-store/fitup-clearance-management'
                    // to="/party/piping-store/quality-clearance-fitup-management"
                    className={`${location.pathname === '/party/piping-store/quality-clearance-fitup-management' ||
                      location.pathname === '/party/piping-store/fitup-clearance-management' || location.pathname === '/party/piping-store/view-quality-clearance-fitup'
                      ? 'active' : ''}`} >
                    Fit-Up
                  </Link>

                  <Link
                    to='/party/piping-store/dpt-clearance-management'
                    // to="/party/piping-store/quality-clearance-fitup-management"
                    className={`${location.pathname === '/party/piping-store/quality-clearance-dpt-management' ||
                      location.pathname === '/party/piping-store/dpt-clearance-management' || location.pathname === '/party/piping-store/view-quality-clearance-dpt'
                      ? 'active' : ''}`} >
                    Root DPT
                  </Link>

                  <Link
                    to="/party/piping-store/weld-visual-clearance-management"
                    // to="/party/piping-store/quality-clearance-weld-visual-management"
                    className={`${location.pathname === '/party/piping-store/quality-clearance-weld-visual-management' ||
                      location.pathname === '/party/piping-store/weld-visual-clearance-management' ? 'active' : ''}`} >
                    Weld Visual
                  </Link>

                  <Link to="/party/piping-store/final-dimension-clearance-management"
                    className={`${location.pathname === '/party/piping-store/quality-clearance-final-dimension-management' ||
                      location.pathname === '/party/piping-store/final-dimension-clearance-management'
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
                      <Link to='/party/piping-store/ndt-summary'
                        className={`${location.pathname === '/party/piping-store/ndt-summary' || location.pathname === '/party/piping-store/manage-ndt' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/rt-lot-book-management' className={`${location.pathname === '/party/piping-store/rt-lot-book-management' ||
                                location.pathname === '/party/piping-store/manage-rt-lot-book-management' ? 'active' : ''}`}>
                                <span>RT LOT BOOK</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/lpt-lot-book-management' className={`${location.pathname === '/party/piping-store/lpt-lot-book-management' ||
                                location.pathname === '/party/piping-store/manage-lpt-lot-book-management' ? 'active' : ''}`}>
                                <span>LPT LOT BOOK</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/mpt-lot-book-management' className={`${location.pathname === '/party/piping-store/mpt-lot-book-management' ||
                                location.pathname === '/party/piping-store/manage-mpt-lot-book-management' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/rt-offer-management' className={`${location.pathname === '/party/piping-store/rt-offer-management' ||
                                location.pathname === '/party/piping-store/manage-rt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/rt-clearance-management' className={`${location.pathname === '/party/piping-store/rt-clearance-management' ||
                                location.pathname === '/party/piping-store/manage-rt-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/pwht-offer-management' className={`${location.pathname === '/party/piping-store/pwht-offer-management' ||
                                location.pathname === '/party/piping-store/manage-pwht-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/pwht-clearance-management' className={`${location.pathname === '/party/piping-store/pwht-clearance-management' ||
                                location.pathname === '/party/piping-store/manage-pwht-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/ft-offer-management' className={`${location.pathname === '/party/piping-store/ft-offer-management' ||
                                location.pathname === '/party/piping-store/manage-ft-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/ft-clearance-management' className={`${location.pathname === '/party/piping-store/ft-clearance-management' ||
                                location.pathname === '/party/piping-store/manage-ft-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/lpt-offer-management' className={`${location.pathname === '/party/piping-store/lpt-offer-management' ||
                                location.pathname === '/party/piping-store/manage-lpt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/lpt-clearance-management' className={`${location.pathname === '/party/piping-store/lpt-clearance-management' ||
                                location.pathname === '/party/piping-store/manage-lpt-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/mpt-offer-management' className={`${location.pathname === '/party/piping-store/mpt-offer-management' ||
                                location.pathname === '/party/piping-store/manage-mpt-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/mpt-clearance-management'
                                className={`${location.pathname === '/party/piping-store/mpt-clearance-management' ||
                                  location.pathname === '/party/piping-store/manage-mpt-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/ht-offer-management' className={`${location.pathname === '/party/piping-store/ht-offer-management' ||
                                location.pathname === '/party/piping-store/manage-ht-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/ht-clearance-management'
                                className={`${location.pathname === '/party/piping-store/ht-clearance-management' ||
                                  location.pathname === '/party/piping-store/manage-ht-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/pmi-offer-management' className={`${location.pathname === '/party/piping-store/pmi-offer-management' ||
                                location.pathname === '/party/piping-store/manage-pmi-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/pmi-clearance-management'
                                className={`${location.pathname === '/party/piping-store/pmi-clearance-management' ||
                                  location.pathname === '/party/piping-store/manage-pmi-clearance' ? 'active' : ''}`}>
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
                              <Link to='/party/piping-store/pickling-passivation-offer-management' className={`${location.pathname === '/party/piping-store/pickling-passivation-offer-management' ||
                                location.pathname === '/party/piping-store/manage-pickling-passivation-offer' ? 'active' : ''}`}>
                                <span>Offering</span>
                              </Link>
                            </li>
                            <li>
                              <Link to='/party/piping-store/pickling-passivation-clearance-management'
                                className={`${location.pathname === '/party/piping-store/pickling-passivation-clearance-management' ||
                                  location.pathname === '/party/piping-store/manage-pickling-passivation-clearance' ? 'active' : ''}`}>
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
                    <Link to="/party/piping-store/inspection-summary-management"
                      className={`${location.pathname === '/party/piping-store/inspection-summary-management' || location.pathname === '/party/piping-store/view-inspection-summary' || location.pathname === '/party/piping-store/view-geninspection-summary' ? 'active' : ''}`}>
                      Inspection Summary Records
                    </Link>
                  )}
                  {hasAccess('PAINT_DISPATCH') && (
                    <Link to="/party/piping-store/dispatch-note-management"
                      className={`${location.pathname === '/party/piping-store/dispatch-note-management' || location.pathname === '/party/piping-store/manage-dispatch-note' || location.pathname === '/party/piping-store/view-dispatch-note' ? 'active' : ''}`}>
                      Disptch Note For Painting
                    </Link>
                  )}
                </ul>
              </li>
            )} */}

          {hasAccess('PRESSURE_TEST') && (
            <li>
              <Link to="/party/piping-store/pressure-test" className={`${location.pathname === "/party/piping-store/pressure-test" ? "active" : ""}`}>
                <span className="menu-side"><CircleGauge className="Dash-iCon" /> </span>
                <span>Pressure Test</span>
              </Link>
            </li>
             )}
           {hasAccess('IRN_AFTER') && (
              <li>
                <Link to="/party/piping-store/line-history-management"
                  className={`${location.pathname === "/party/piping-store/line-history-management" || location.pathname === "/party/piping-store/view-line-history" || location.pathname === "/party/piping-store/view-Genline-history" ? "active" : ""}`}>
                  <span className="menu-side"> <FileText className="Dash-iCon" /> </span>
                  <span>LHS</span>
                </Link>
              </li>
            )}

        {hasAccess('PAINT_DISPATCH') && (
                  <li>
                    <Link to="/party/piping-store/dispatch-note-management"
                      className={`${location.pathname === '/party/piping-store/dispatch-note-management' || location.pathname === '/party/piping-store/manage-dispatch-note' || location.pathname === '/party/piping-store/view-dispatch-note' ? 'active' : ''}`}>
                      <span className="menu-side">
                    <ScrollText className="Dash-iCon" />
                  </span>
                     <span> Disptch Note For <br/> Painting </span>
                    </Link>
                    </li>
                  )}

             {hasAccess('PAINT_DISPATCH') && (
                  <li>
                    <Link to="/party/piping-store/stock-dispatch-note-management"
                      className={`${location.pathname === '/party/piping-store/stock-dispatch-note-management' || location.pathname === '/party/piping-store/manage-stock-dispatch-note' || location.pathname === '/party/piping-store/view-stock-dispatch-note' ? 'active' : ''}`}>
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
                        <Link to='/party/piping-store/surface-primer-management' className={`${location.pathname === '/party/piping-store/surface-primer-management' ||
                          location.pathname === '/party/piping-store/manage-surface-primer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/party/piping-store/surface-clearance-management' className={`${location.pathname === '/party/piping-store/surface-clearance-management' ||
                          location.pathname === '/party/piping-store/manage-surface-clearance' || location.pathname === '/party/piping-store/view-surface-clearance' ? 'active' : ''}`}>
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
                        <Link to='/party/piping-store/mio-offer-management' className={`${location.pathname === '/party/piping-store/mio-offer-management' ||
                          location.pathname === '/party/piping-store/manage-mio-offer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/party/piping-store/mio-clearance-management' className={`${location.pathname === '/party/piping-store/mio-clearance-management' ||
                          location.pathname === '/party/piping-store/manage-mio-clearance' || location.pathname === '/party/piping-store/view-mio-clearance' ? 'active' : ''}`}>
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
                        <Link to='/party/piping-store/final-coat-management' className={`${location.pathname === '/party/piping-store/final-coat-management' ||
                          location.pathname === '/party/piping-store/manage-final-coat' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/party/piping-store/final-coat-clearance-management' className={`${location.pathname === '/party/piping-store/final-coat-clearance-management' ||
                          location.pathname === '/party/piping-store/manage-final-coat-clearance' || location.pathname === '/party/piping-store/view-final-coat-clearance' ? 'active' : ''}`}>
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
                        <Link to='/party/piping-store/stock-surface-primer-management' className={`${location.pathname === '/party/piping-store/stock-surface-primer-management' ||
                          location.pathname === '/party/piping-store/manage-stock-surface-primer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/party/piping-store/stock-surface-clearance-management' className={`${location.pathname === '/party/piping-store/stock-surface-clearance-management' ||
                          location.pathname === '/party/piping-store/manage-stock-surface-clearance' || location.pathname === '/party/piping-store/view-stock-surface-clearance' ? 'active' : ''}`}>
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
                        <Link to='/party/piping-store/stock-mio-offer-management' className={`${location.pathname === '/party/piping-store/stock-mio-offer-management' ||
                          location.pathname === '/party/piping-store/manage-stock-mio-offer' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/party/piping-store/stock-mio-clearance-management' className={`${location.pathname === '/party/piping-store/stock-mio-clearance-management' ||
                          location.pathname === '/party/piping-store/manage-stock-mio-clearance' || location.pathname === '/party/piping-store/view-stock-mio-clearance' ? 'active' : ''}`}>
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
                        <Link to='/party/piping-store/stock-final-coat-management' className={`${location.pathname === '/party/piping-store/stock-final-coat-management' ||
                          location.pathname === '/party/piping-store/manage-stock-final-coat' ? 'active' : ''}`}>
                          <span>Offering</span>
                        </Link>
                      </li>
                      <li>
                        <Link to='/party/piping-store/stock-final-coat-clearance-management' className={`${location.pathname === '/party/piping-store/stock-final-coat-clearance-management' ||
                          location.pathname === '/party/piping-store/manage-stock-final-coat-clearance' || location.pathname === '/party/piping-store/view-stock-final-coat-clearance' ? 'active' : ''}`}>
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
                <Link to="/party/piping-store/release-note-management"
                  className={`${location.pathname === "/party/piping-store/release-note-management" || location.pathname === "/party/piping-store/view-release-note" || location.pathname === "/party/piping-store/view-Genrelease-note" ? "active" : ""}`}>
                  <span className="menu-side"> <SendHorizontal className="Dash-iCon" /> </span>
                  <span>IRN</span>
                </Link>
              </li>
            )}

               {hasAccess('IRN_AFTER') && (
              <li>
                <Link to="/party/piping-store/stock-release-note-management"
                  className={`${location.pathname === "/party/piping-store/stock-release-note-management" || location.pathname === "/party/piping-store/view-stock-release-note" || location.pathname === "/party/piping-store/view-stock-Genrelease-note" ? "active" : ""}`}>
                  <span className="menu-side"> <SendHorizontal className="Dash-iCon" /> </span>
                  <span>Stock IRN</span>
                </Link>
              </li>
            )}

            {hasAccess('PACKING_LIST') && (
            <li>
              <Link to="/party/piping-store/packing-list"
                className={`${location.pathname === "/party/piping-store/packing-list" ||
                  location.pathname === '/party/piping-store/manage-packing' || location.pathname === '/party/piping-store/view-packing' ? "active" : ""}`}>
                <span className="menu-side"><PackageOpen className="Dash-iCon" /> </span>
                <span>Packing List</span>
              </Link>
            </li>
             )}

            {hasAccess('PACKING_LIST') && (
              <li>
              <Link to="/party/piping-store/packing-list-summary"
                className={`${location.pathname === "/party/piping-store/packing-list-summary" ? "active" : ""}`}>
                <span className="menu-side"><PackageSearch className="Dash-iCon" /> </span>
                <span>Packing List <br/> Summary </span>
              </Link>
            </li>
              )}

                 {hasAccess('PACKING_LIST') && (
            <li>
              <Link to="/party/piping-store/stock-packing-list"
                className={`${location.pathname === "/party/piping-store/stock-packing-list" ||
                  location.pathname === '/party/piping-store/manage-stock-packing' || location.pathname === '/party/piping-store/view-stock-packing' ? "active" : ""}`}>
                <span className="menu-side"><PackageOpen className="Dash-iCon" /> </span>
                <span>Stock Packing List</span>
              </Link>
            </li>
             )}

            {hasAccess('PACKING_LIST') && (
              <li>
              <Link to="/party/piping-store/stock-packing-list-summary"
                className={`${location.pathname === "/party/piping-store/stock-packing-list-summary" ? "active" : ""}`}>
                <span className="menu-side"><PackageSearch className="Dash-iCon" /> </span>
                <span>Stock Packing List <br/> Summary </span>
              </Link>
            </li>
              )}

          {hasAccess('PACKING_LIST') && (
            <li>
              <Link to="/party/piping-store/spool-break-up-summary-list"
                className={`${location.pathname === "/party/piping-store/spool-break-up-summary-list" ? "active" : ""}`}>
                <span className="menu-side"><PackageCheck className="Dash-iCon" /> </span>
                <span>Spool Break-Up <br /> Summary</span>
              </Link>
            </li>
          )}
          {hasAccess('FIM') && (
            <li>
              <Link to="/party/piping-store/fim-procuement-rejected-summary"
                className={`${location.pathname === "/party/piping-store/fim-procuement-rejected-summary" ? "active" : ""}`}>
                <span className="menu-side"><FileX className="Dash-iCon" /> </span>
                <span>FIM/Procuement <br /> Rejected  Short <br /> Fall Summary </span>
              </Link>
            </li>
              )}

            {/* <li>
              <Link to="/party/piping-store/notes" target="_blank"
                className={`${location.pathname === "/party/piping-store/notes" ? "active" : ""}`}>
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