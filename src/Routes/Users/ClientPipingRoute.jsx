import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PartyLayout from './ClientStoreLayout';
import Dashboard from '../../Pages/ClientPiping/Dashboard/Dashboard';
import PlaceholderPage from '../../Pages/ClientPiping/Include/PlaceholderPage';

/**
 * ClientPipingRoute.jsx
 * ======================
 * Base scaffold for the Client (Party) Piping module.
 *
 * WHAT THIS IS
 * This mirrors ClientRoute.jsx (the existing Party/ERP module) but targets Piping-type
 * projects instead. It reuses the SAME PartyLayout / PARTY_TOKEN auth mechanism as
 * ClientRoute.jsx (per direct instruction — this module does NOT need its own login system).
 * Base path: /party/piping-store/*  (compare to ClientRoute.jsx's /party/project-store/*)
 *
 * WHAT'S WORKING RIGHT NOW
 * - Auth guard / redirect-to-login: fully working (PartyLayout checks PARTY_TOKEN +
 *   PARTY_PROJECT_ID on mount; missing either clears localStorage and navigates to "/").
 * - Every route below is registered and reachable — none of them 404.
 * - The Sidebar (Pages/ClientPiping/Include/Sidebar.jsx) links to every route below;
 *   navigation and active-state highlighting both work.
 * - Dashboard is a real, working page.
 *
 * WHAT'S A PLACEHOLDER (FOR INTERNS)
 * Every route except 'dashboard' currently renders <PlaceholderPage title="..." />.
 * To build a real module:
 *   1. Find the equivalent staff page under Pages/Piping/... — that's your business-logic
 *      and data-model reference (form fields, table columns, aggregation shape, etc.)
 *   2. Find the equivalent already-adapted Party page under Pages/Client/... for the SAME
 *      kind of feature (e.g. Pages/Client/Multiple/MultiNDT/MultiRT/ for an NDT clearance
 *      list) — that's your reference for the Party-specific conventions this codebase uses:
 *        - All API calls and navigate() targets use the /party/ prefix, never /user/
 *        - Auth header reads PARTY_TOKEN from localStorage, never PAY_USER_TOKEN
 *        - Backend equivalents already exist under party.routes.js for most read/write
 *          actions — check there before assuming something needs a new backend route
 *   3. Build your page under Pages/ClientPiping/... following that pattern.
 *   4. Replace the matching placeholder line below with your real import + element.
 *
 * IMPORTANT — LESSONS FROM THE ERP CLIENT MODULE (read before adding new routes):
 * - Do NOT wrap route groups in {hasAccess('X') && (...)} the way the internal-staff
 *   PipingRoute.jsx does. Party sessions never have ERP_ROLE set, so any hasAccess()
 *   gate here will always evaluate false and silently make that entire route group
 *   unreachable — this exact bug took a long debugging session to track down in
 *   ClientRoute.jsx. If you need role-based visibility within Piping-client accounts
 *   in the future, it needs new logic — do not reuse menuAccessConfigPiping/ERP_ROLE.
 * - Keep every navigate()/axios call prefixed with /party/, not /user/ — the same
 *   copy-paste-from-staff mistake caused ~140 broken links across the ERP Client module.
 * - If you add a "View" action for something, confirm the destination route actually
 *   exists (and is imported) before wiring the button — a missing route silently
 *   redirects to dashboard with no visible error except a browser console warning.
 */

const ClientPipingRoutes = () => {
  return (
    <Routes>
      <Route path='/party/piping-store' element={<PartyLayout />}>
        <Route path='dashboard' element={<Dashboard />} />

          <Route path='area-management' element={<PlaceholderPage title="Area Management" />} />
          <Route path='auth-person-management' element={<PlaceholderPage title="Auth Person Management" />} />
          <Route path='category-management' element={<PlaceholderPage title="Category Management" />} />
          <Route path='contractor-master-management' element={<PlaceholderPage title="Contractor Master Management" />} />
          <Route path='create-issue-acceptance' element={<PlaceholderPage title="Create Issue Acceptance" />} />
          <Route path='create-issue-return-note-acceptance' element={<PlaceholderPage title="Create Issue Return Note Acceptance" />} />
          <Route path='create-stock-wise-issue-acceptance' element={<PlaceholderPage title="Create Stock Wise Issue Acceptance" />} />
          <Route path='dispatch-note-management' element={<PlaceholderPage title="Dispatch Note Management" />} />
          <Route path='dmr-categories' element={<PlaceholderPage title="DMR Categories" />} />
          <Route path='dmr-management' element={<PlaceholderPage title="DMR Management" />} />
          <Route path='dpr-management' element={<PlaceholderPage title="DPR Management" />} />
          <Route path='dpt-clearance-management' element={<PlaceholderPage title="Dpt Clearance Management" />} />
          <Route path='dpt-management' element={<PlaceholderPage title="Dpt Management" />} />
          <Route path='drawing-joint-master-data' element={<PlaceholderPage title="Drawing Joint Master Data" />} />
          <Route path='drawing-management' element={<PlaceholderPage title="Drawing Management" />} />
          <Route path='drawing-master-data' element={<PlaceholderPage title="Drawing Master Data" />} />
          <Route path='drawing-spool-no-wise-area-inch' element={<PlaceholderPage title="Drawing Spool No Wise Area Inch" />} />
          <Route path='fim-packing-list' element={<PlaceholderPage title="FIM Packing List" />} />
          <Route path='fim-procuement-rejected-summary' element={<PlaceholderPage title="FIM Procuement Rejected Summary" />} />
          <Route path='final-coat-clearance-management' element={<PlaceholderPage title="Final Coat Clearance Management" />} />
          <Route path='final-coat-management' element={<PlaceholderPage title="Final Coat Management" />} />
          <Route path='final-coat-shade' element={<PlaceholderPage title="Final Coat Shade" />} />
          <Route path='final-dimension-clearance-management' element={<PlaceholderPage title="Final Dimension Clearance Management" />} />
          <Route path='final-dimension-offer-management' element={<PlaceholderPage title="Final Dimension Offer Management" />} />
          <Route path='fitup-clearance-management' element={<PlaceholderPage title="Fitup Clearance Management" />} />
          <Route path='fitup-management' element={<PlaceholderPage title="Fitup Management" />} />
          <Route path='ft-clearance-management' element={<PlaceholderPage title="Ft Clearance Management" />} />
          <Route path='ft-offer-management' element={<PlaceholderPage title="Ft Offer Management" />} />
          <Route path='hardness-master-management' element={<PlaceholderPage title="Hardness Master Management" />} />
          <Route path='ht-clearance-management' element={<PlaceholderPage title="HT Clearance Management" />} />
          <Route path='ht-offer-management' element={<PlaceholderPage title="HT Offer Management" />} />
          <Route path='inquiry-for-supply' element={<PlaceholderPage title="Inquiry For Supply" />} />
          <Route path='inspection-summary-management' element={<PlaceholderPage title="Inspection Summary Management" />} />
          <Route path='inventory-location-management' element={<PlaceholderPage title="Inventory Location Management" />} />
          <Route path='invoice-management' element={<PlaceholderPage title="Invoice Management" />} />
          <Route path='issue-acceptance-master-data' element={<PlaceholderPage title="Issue Acceptance Master Data" />} />
          <Route path='issue-management' element={<PlaceholderPage title="Issue Management" />} />
          <Route path='issue-request-management' element={<PlaceholderPage title="Issue Request Management" />} />
          <Route path='issue-return-management' element={<PlaceholderPage title="Issue Return Management" />} />
          <Route path='issue-return-note' element={<PlaceholderPage title="Issue Return Note" />} />
          <Route path='issue-return-summary' element={<PlaceholderPage title="Issue Return Summary" />} />
          <Route path='item-management' element={<PlaceholderPage title="Item Management" />} />
          <Route path='item-request-management' element={<PlaceholderPage title="Item Request Management" />} />
          <Route path='joint-type-management' element={<PlaceholderPage title="Joint Type Management" />} />
          <Route path='line-history-management' element={<PlaceholderPage title="Line History Management" />} />
          <Route path='lpt-clearance-management' element={<PlaceholderPage title="LPT Clearance Management" />} />
          <Route path='lpt-lot-book-management' element={<PlaceholderPage title="LPT Lot Book Management" />} />
          <Route path='lpt-offer-management' element={<PlaceholderPage title="LPT Offer Management" />} />
          <Route path='manage-area' element={<PlaceholderPage title="Manage Area" />} />
          <Route path='manage-auth-person' element={<PlaceholderPage title="Manage Auth Person" />} />
          <Route path='manage-category' element={<PlaceholderPage title="Manage Category" />} />
          <Route path='manage-contractor-master' element={<PlaceholderPage title="Manage Contractor Master" />} />
          <Route path='manage-dispatch-note' element={<PlaceholderPage title="Manage Dispatch Note" />} />
          <Route path='manage-dpt' element={<PlaceholderPage title="Manage Dpt" />} />
          <Route path='manage-drawing' element={<PlaceholderPage title="Manage Drawing" />} />
          <Route path='manage-fim-packing' element={<PlaceholderPage title="Manage FIM Packing" />} />
          <Route path='manage-final-coat' element={<PlaceholderPage title="Manage Final Coat" />} />
          <Route path='manage-final-coat-clearance' element={<PlaceholderPage title="Manage Final Coat Clearance" />} />
          <Route path='manage-final-coat-shade' element={<PlaceholderPage title="Manage Final Coat Shade" />} />
          <Route path='manage-final-dimension-offer' element={<PlaceholderPage title="Manage Final Dimension Offer" />} />
          <Route path='manage-fitup' element={<PlaceholderPage title="Manage Fitup" />} />
          <Route path='manage-ft-clearance' element={<PlaceholderPage title="Manage Ft Clearance" />} />
          <Route path='manage-ft-offer' element={<PlaceholderPage title="Manage Ft Offer" />} />
          <Route path='manage-hardness-master' element={<PlaceholderPage title="Manage Hardness Master" />} />
          <Route path='manage-ht-clearance' element={<PlaceholderPage title="Manage HT Clearance" />} />
          <Route path='manage-ht-offer' element={<PlaceholderPage title="Manage HT Offer" />} />
          <Route path='manage-inventory-location' element={<PlaceholderPage title="Manage Inventory Location" />} />
          <Route path='manage-invoice' element={<PlaceholderPage title="Manage Invoice" />} />
          <Route path='manage-issue-acceptance' element={<PlaceholderPage title="Manage Issue Acceptance" />} />
          <Route path='manage-issue-request' element={<PlaceholderPage title="Manage Issue Request" />} />
          <Route path='manage-issue-return-note' element={<PlaceholderPage title="Manage Issue Return Note" />} />
          <Route path='manage-issue-return-note-acceptance' element={<PlaceholderPage title="Manage Issue Return Note Acceptance" />} />
          <Route path='manage-item' element={<PlaceholderPage title="Manage Item" />} />
          <Route path='manage-joint-type' element={<PlaceholderPage title="Manage Joint Type" />} />
          <Route path='manage-lpt-clearance' element={<PlaceholderPage title="Manage LPT Clearance" />} />
          <Route path='manage-lpt-lot-book-management' element={<PlaceholderPage title="Manage LPT Lot Book Management" />} />
          <Route path='manage-lpt-offer' element={<PlaceholderPage title="Manage LPT Offer" />} />
          <Route path='manage-material-request' element={<PlaceholderPage title="Manage Material Request" />} />
          <Route path='manage-mio-clearance' element={<PlaceholderPage title="Manage Mio Clearance" />} />
          <Route path='manage-mio-offer' element={<PlaceholderPage title="Manage Mio Offer" />} />
          <Route path='manage-mpt-clearance' element={<PlaceholderPage title="Manage MPT Clearance" />} />
          <Route path='manage-mpt-lot-book-management' element={<PlaceholderPage title="Manage MPT Lot Book Management" />} />
          <Route path='manage-mpt-offer' element={<PlaceholderPage title="Manage MPT Offer" />} />
          <Route path='manage-ndt' element={<PlaceholderPage title="Manage NDT" />} />
          <Route path='manage-ndt-contractor-master' element={<PlaceholderPage title="Manage NDT Contractor Master" />} />
          <Route path='manage-ndt-master' element={<PlaceholderPage title="Manage NDT Master" />} />
          <Route path='manage-offer-request' element={<PlaceholderPage title="Manage Offer Request" />} />
          <Route path='manage-packing' element={<PlaceholderPage title="Manage Packing" />} />
          <Route path='manage-paint-manufacture' element={<PlaceholderPage title="Manage Paint Manufacture" />} />
          <Route path='manage-painting-requirement' element={<PlaceholderPage title="Manage Painting Requirement" />} />
          <Route path='manage-painting-system' element={<PlaceholderPage title="Manage Painting System" />} />
          <Route path='manage-party' element={<PlaceholderPage title="Manage Party" />} />
          <Route path='manage-party-group' element={<PlaceholderPage title="Manage Party Group" />} />
          <Route path='manage-pickling-passivation-clearance' element={<PlaceholderPage title="Manage Pickling Passivation Clearance" />} />
          <Route path='manage-pickling-passivation-offer' element={<PlaceholderPage title="Manage Pickling Passivation Offer" />} />
          <Route path='manage-piping-class' element={<PlaceholderPage title="Manage Piping Class" />} />
          <Route path='manage-piping-material-specification' element={<PlaceholderPage title="Manage Piping Material Specification" />} />
          <Route path='manage-pmi-clearance' element={<PlaceholderPage title="Manage PMI Clearance" />} />
          <Route path='manage-pmi-offer' element={<PlaceholderPage title="Manage PMI Offer" />} />
          <Route path='manage-procedure-master' element={<PlaceholderPage title="Manage Procedure Master" />} />
          <Route path='manage-project-location' element={<PlaceholderPage title="Manage Project Location" />} />
          <Route path='manage-project-locationt' element={<PlaceholderPage title="Manage Project Locationt" />} />
          <Route path='manage-purchase-order' element={<PlaceholderPage title="Manage Purchase Order" />} />
          <Route path='manage-pwht-clearance' element={<PlaceholderPage title="Manage Pwht Clearance" />} />
          <Route path='manage-pwht-master' element={<PlaceholderPage title="Manage Pwht Master" />} />
          <Route path='manage-pwht-offer' element={<PlaceholderPage title="Manage Pwht Offer" />} />
          <Route path='manage-rt-clearance' element={<PlaceholderPage title="Manage RT Clearance" />} />
          <Route path='manage-rt-lot-book-management' element={<PlaceholderPage title="Manage RT Lot Book Management" />} />
          <Route path='manage-rt-offer' element={<PlaceholderPage title="Manage RT Offer" />} />
          <Route path='manage-sales-order' element={<PlaceholderPage title="Manage Sales Order" />} />
          <Route path='manage-size' element={<PlaceholderPage title="Manage Size" />} />
          <Route path='manage-stock-dispatch-note' element={<PlaceholderPage title="Manage Stock Dispatch Note" />} />
          <Route path='manage-stock-final-coat' element={<PlaceholderPage title="Manage Stock Final Coat" />} />
          <Route path='manage-stock-final-coat-clearance' element={<PlaceholderPage title="Manage Stock Final Coat Clearance" />} />
          <Route path='manage-stock-final-coat-shade' element={<PlaceholderPage title="Manage Stock Final Coat Shade" />} />
          <Route path='manage-stock-mio-clearance' element={<PlaceholderPage title="Manage Stock Mio Clearance" />} />
          <Route path='manage-stock-mio-offer' element={<PlaceholderPage title="Manage Stock Mio Offer" />} />
          <Route path='manage-stock-packing' element={<PlaceholderPage title="Manage Stock Packing" />} />
          <Route path='manage-stock-surface-clearance' element={<PlaceholderPage title="Manage Stock Surface Clearance" />} />
          <Route path='manage-stock-surface-primer' element={<PlaceholderPage title="Manage Stock Surface Primer" />} />
          <Route path='manage-stock-wise-issue-acceptance' element={<PlaceholderPage title="Manage Stock Wise Issue Acceptance" />} />
          <Route path='manage-stock-wise-issue-request' element={<PlaceholderPage title="Manage Stock Wise Issue Request" />} />
          <Route path='manage-surface-clearance' element={<PlaceholderPage title="Manage Surface Clearance" />} />
          <Route path='manage-surface-primer' element={<PlaceholderPage title="Manage Surface Primer" />} />
          <Route path='manage-thickness' element={<PlaceholderPage title="Manage Thickness" />} />
          <Route path='manage-transport' element={<PlaceholderPage title="Manage Transport" />} />
          <Route path='manage-unit' element={<PlaceholderPage title="Manage Unit" />} />
          <Route path='manage-ut-clearance' element={<PlaceholderPage title="Manage UT Clearance" />} />
          <Route path='manage-ut-offer' element={<PlaceholderPage title="Manage UT Offer" />} />
          <Route path='manage-verify-request' element={<PlaceholderPage title="Manage Verify Request" />} />
          <Route path='manage-weld-visual' element={<PlaceholderPage title="Manage Weld Visual" />} />
          <Route path='manage-welder' element={<PlaceholderPage title="Manage Welder" />} />
          <Route path='manage-wps-master' element={<PlaceholderPage title="Manage WPS Master" />} />
          <Route path='material-control' element={<PlaceholderPage title="Material Control" />} />
          <Route path='material-request-management' element={<PlaceholderPage title="Material Request Management" />} />
          <Route path='mio-clearance-management' element={<PlaceholderPage title="Mio Clearance Management" />} />
          <Route path='mio-offer-management' element={<PlaceholderPage title="Mio Offer Management" />} />
          <Route path='mpt-clearance-management' element={<PlaceholderPage title="MPT Clearance Management" />} />
          <Route path='mpt-lot-book-management' element={<PlaceholderPage title="MPT Lot Book Management" />} />
          <Route path='mpt-offer-management' element={<PlaceholderPage title="MPT Offer Management" />} />
          <Route path='ndt-contractor-master-management' element={<PlaceholderPage title="NDT Contractor Master Management" />} />
          <Route path='ndt-management' element={<PlaceholderPage title="NDT Management" />} />
          <Route path='ndt-master-management' element={<PlaceholderPage title="NDT Master Management" />} />
          <Route path='ndt-percentage' element={<PlaceholderPage title="NDT Percentage" />} />
          <Route path='ndt-summary' element={<PlaceholderPage title="NDT Summary" />} />
          <Route path='notes' element={<PlaceholderPage title="Notes" />} />
          <Route path='offer-item-management' element={<PlaceholderPage title="Offer Item Management" />} />
          <Route path='order-placement' element={<PlaceholderPage title="Order Placement" />} />
          <Route path='packing-list' element={<PlaceholderPage title="Packing List" />} />
          <Route path='packing-list-summary' element={<PlaceholderPage title="Packing List Summary" />} />
          <Route path='paint-manufacture-management' element={<PlaceholderPage title="Paint Manufacture Management" />} />
          <Route path='painting-requirement-management' element={<PlaceholderPage title="Painting Requirement Management" />} />
          <Route path='painting-system-management' element={<PlaceholderPage title="Painting System Management" />} />
          <Route path='party-group-management' element={<PlaceholderPage title="Party Group Management" />} />
          <Route path='party-management' element={<PlaceholderPage title="Party Management" />} />
          <Route path='pickling-passivation-clearance-management' element={<PlaceholderPage title="Pickling Passivation Clearance Management" />} />
          <Route path='pickling-passivation-offer-management' element={<PlaceholderPage title="Pickling Passivation Offer Management" />} />
          <Route path='piping-class-management' element={<PlaceholderPage title="Piping Class Management" />} />
          <Route path='piping-material-specification-management' element={<PlaceholderPage title="Piping Material Specification Management" />} />
          <Route path='pmi-clearance-management' element={<PlaceholderPage title="PMI Clearance Management" />} />
          <Route path='pmi-offer-management' element={<PlaceholderPage title="PMI Offer Management" />} />
          <Route path='pressure-test' element={<PlaceholderPage title="Pressure Test" />} />
          <Route path='procedure-master-management' element={<PlaceholderPage title="Procedure Master Management" />} />
          <Route path='procurement-request' element={<PlaceholderPage title="Procurement Request" />} />
          <Route path='project-front-availability-summary' element={<PlaceholderPage title="Project Front Availability Summary" />} />
          <Route path='project-location-management' element={<PlaceholderPage title="Project Location Management" />} />
          <Route path='purchase-management' element={<PlaceholderPage title="Purchase Management" />} />
          <Route path='purchase-order-management' element={<PlaceholderPage title="Purchase Order Management" />} />
          <Route path='pwht-clearance-management' element={<PlaceholderPage title="Pwht Clearance Management" />} />
          <Route path='pwht-master-management' element={<PlaceholderPage title="Pwht Master Management" />} />
          <Route path='pwht-offer-management' element={<PlaceholderPage title="Pwht Offer Management" />} />
          <Route path='quality-clearance-dpt-management' element={<PlaceholderPage title="Quality Clearance Dpt Management" />} />
          <Route path='quality-clearance-final-dimension-management' element={<PlaceholderPage title="Quality Clearance Final Dimension Management" />} />
          <Route path='quality-clearance-fitup-management' element={<PlaceholderPage title="Quality Clearance Fitup Management" />} />
          <Route path='quality-clearance-weld-visual-management' element={<PlaceholderPage title="Quality Clearance Weld Visual Management" />} />
          <Route path='release-note-management' element={<PlaceholderPage title="Release Note Management" />} />
          <Route path='reusable-stock' element={<PlaceholderPage title="Reusable Stock" />} />
          <Route path='rt-clearance-management' element={<PlaceholderPage title="RT Clearance Management" />} />
          <Route path='rt-lot-book-management' element={<PlaceholderPage title="RT Lot Book Management" />} />
          <Route path='rt-offer-management' element={<PlaceholderPage title="RT Offer Management" />} />
          <Route path='sales-order-management' element={<PlaceholderPage title="Sales Order Management" />} />
          <Route path='size-management' element={<PlaceholderPage title="Size Management" />} />
          <Route path='spool-break-up-summary-list' element={<PlaceholderPage title="Spool Break Up Summary List" />} />
          <Route path='stock-dispatch-note-management' element={<PlaceholderPage title="Stock Dispatch Note Management" />} />
          <Route path='stock-final-coat-clearance-management' element={<PlaceholderPage title="Stock Final Coat Clearance Management" />} />
          <Route path='stock-final-coat-management' element={<PlaceholderPage title="Stock Final Coat Management" />} />
          <Route path='stock-final-coat-shade' element={<PlaceholderPage title="Stock Final Coat Shade" />} />
          <Route path='stock-issue-acceptance-master-data' element={<PlaceholderPage title="Stock Issue Acceptance Master Data" />} />
          <Route path='stock-mio-clearance-management' element={<PlaceholderPage title="Stock Mio Clearance Management" />} />
          <Route path='stock-mio-offer-management' element={<PlaceholderPage title="Stock Mio Offer Management" />} />
          <Route path='stock-packing-list' element={<PlaceholderPage title="Stock Packing List" />} />
          <Route path='stock-packing-list-summary' element={<PlaceholderPage title="Stock Packing List Summary" />} />
          <Route path='stock-release-note-management' element={<PlaceholderPage title="Stock Release Note Management" />} />
          <Route path='stock-report' element={<PlaceholderPage title="Stock Report" />} />
          <Route path='stock-report-management' element={<PlaceholderPage title="Stock Report Management" />} />
          <Route path='stock-surface-clearance-management' element={<PlaceholderPage title="Stock Surface Clearance Management" />} />
          <Route path='stock-surface-primer-management' element={<PlaceholderPage title="Stock Surface Primer Management" />} />
          <Route path='stock-wise-issue-acceptance' element={<PlaceholderPage title="Stock Wise Issue Acceptance" />} />
          <Route path='stock-wise-issue-management' element={<PlaceholderPage title="Stock Wise Issue Management" />} />
          <Route path='stock-wise-issue-request-management' element={<PlaceholderPage title="Stock Wise Issue Request Management" />} />
          <Route path='surface-clearance-management' element={<PlaceholderPage title="Surface Clearance Management" />} />
          <Route path='surface-primer-management' element={<PlaceholderPage title="Surface Primer Management" />} />
          <Route path='thickness-management' element={<PlaceholderPage title="Thickness Management" />} />
          <Route path='transport-management' element={<PlaceholderPage title="Transport Management" />} />
          <Route path='unit-management' element={<PlaceholderPage title="Unit Management" />} />
          <Route path='ut-clearance-management' element={<PlaceholderPage title="UT Clearance Management" />} />
          <Route path='ut-offer-management' element={<PlaceholderPage title="UT Offer Management" />} />
          <Route path='verify-request-management' element={<PlaceholderPage title="Verify Request Management" />} />
          <Route path='view-Genline-history' element={<PlaceholderPage title="View Genline History" />} />
          <Route path='view-Genrelease-note' element={<PlaceholderPage title="View Genrelease Note" />} />
          <Route path='view-dispatch-note' element={<PlaceholderPage title="View Dispatch Note" />} />
          <Route path='view-drawing' element={<PlaceholderPage title="View Drawing" />} />
          <Route path='view-final-coat-clearance' element={<PlaceholderPage title="View Final Coat Clearance" />} />
          <Route path='view-geninspection-summary' element={<PlaceholderPage title="View Geninspection Summary" />} />
          <Route path='view-inspection-summary' element={<PlaceholderPage title="View Inspection Summary" />} />
          <Route path='view-item-request' element={<PlaceholderPage title="View Item Request" />} />
          <Route path='view-line-history' element={<PlaceholderPage title="View Line History" />} />
          <Route path='view-mio-clearance' element={<PlaceholderPage title="View Mio Clearance" />} />
          <Route path='view-offered-item' element={<PlaceholderPage title="View Offered Item" />} />
          <Route path='view-packing' element={<PlaceholderPage title="View Packing" />} />
          <Route path='view-qc-request' element={<PlaceholderPage title="View QC Request" />} />
          <Route path='view-quality-clearance-dpt' element={<PlaceholderPage title="View Quality Clearance Dpt" />} />
          <Route path='view-quality-clearance-fitup' element={<PlaceholderPage title="View Quality Clearance Fitup" />} />
          <Route path='view-release-note' element={<PlaceholderPage title="View Release Note" />} />
          <Route path='view-stock-Genrelease-note' element={<PlaceholderPage title="View Stock Genrelease Note" />} />
          <Route path='view-stock-dispatch-note' element={<PlaceholderPage title="View Stock Dispatch Note" />} />
          <Route path='view-stock-final-coat-clearance' element={<PlaceholderPage title="View Stock Final Coat Clearance" />} />
          <Route path='view-stock-mio-clearance' element={<PlaceholderPage title="View Stock Mio Clearance" />} />
          <Route path='view-stock-packing' element={<PlaceholderPage title="View Stock Packing" />} />
          <Route path='view-stock-release-note' element={<PlaceholderPage title="View Stock Release Note" />} />
          <Route path='view-stock-surface-clearance' element={<PlaceholderPage title="View Stock Surface Clearance" />} />
          <Route path='view-surface-clearance' element={<PlaceholderPage title="View Surface Clearance" />} />
          <Route path='weld-visual-clearance-management' element={<PlaceholderPage title="Weld Visual Clearance Management" />} />
          <Route path='weld-visual-management' element={<PlaceholderPage title="Weld Visual Management" />} />
          <Route path='welder-management' element={<PlaceholderPage title="Welder Management" />} />
          <Route path='wps-master-management' element={<PlaceholderPage title="WPS Master Management" />} />
          <Route path='*' element={<Navigate to='dashboard' />} />
      </Route>
    </Routes>
  );
};

export default ClientPipingRoutes;