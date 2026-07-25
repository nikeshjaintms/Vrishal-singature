import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PartyLayout from './ClientStoreLayout';
import Dashboard from '../../Pages/ClientPiping/Dashboard/Dashboard';
import PlaceholderPage from '../../Pages/ClientPiping/Include/PlaceholderPage';

/**
 * ClientPipingRoute.jsx — PRUNED to approved scope
 * ==================================================
 * Base path: /party/piping-store/*
 * Reuses the existing Party login (PARTY_TOKEN via PartyLayout) — same as ClientRoute.jsx.
 *
 * SCOPE: This route file intentionally covers ONLY the 12 feature areas approved
 * for Client Piping (per the "EXTERNAL/CLIENT = Y" filtered stage list from the
 * project sheet), not the full 236-route staff Piping module:
 *   Material Receiving (QC), FIM, Fit-Up (Acceptance), Weld Visual (Acceptance),
 *   Final Dimension (Acceptance), NDT — RT/PWHT/FT/LPT/MPT/HT/PMI/Pickling & Passivation
 *   (Offering + Acc/Rej for each), LHS, Surface & Primer (Acceptance), MIO (Acceptance),
 *   Final Coat (Acceptance), IRN.
 * Note: items marked "- Acceptance" on the approved list include ONLY the
 * clearance/acceptance route (not the Offering side); NDT includes both since
 * it wasn't marked "- Acceptance" on the sheet. If that reading turns out wrong,
 * the Offering routes for Fitup/Weld Visual/FD/Surface/MIO/Final Coat are easy
 * to add back — see Pages/Piping/Include/Sidebar.jsx for their route names
 * (e.g. surface-primer-management / manage-surface-primer for Surface Offering).
 *
 * All 56 routes below currently render PlaceholderPage — real implementation
 * is intern work. See the equivalent path under Pages/Piping/ for business logic
 * reference, and Pages/Client/Multiple/ for the Party-adaptation conventions
 * (/party/ prefix not /user/, PARTY_TOKEN not PAY_USER_TOKEN, no hasAccess() gates
 * — Party sessions never have ERP_ROLE set, so any hasAccess() check here will
 * silently make that route unreachable, the same bug that took a long debugging
 * session to track down in the ERP Client module).
 *
 * If scope expands beyond these 12 areas later, do NOT copy the rest of
 * Pages/Piping/ wholesale — every one of those ~225 remaining routes uses
 * PAY_USER_TOKEN/user-prefixed calls/hasAccess gates and needs the same
 * adaptation work as these did, one area at a time.
 */

const ClientPipingRoutes = () => {
  return (
    <Routes>
      <Route path='/party/piping-store' element={<PartyLayout />}>
        <Route path='dashboard' element={<Dashboard />} />

          <Route path='verify-request-management' element={<PlaceholderPage title="Material Receiving (QC)" />} />
          <Route path='view-qc-request' element={<PlaceholderPage title="View QC Request" />} />
          <Route path='manage-verify-request' element={<PlaceholderPage title="Manage Verify Request" />} />
          <Route path='manage-fim-packing' element={<PlaceholderPage title="Manage FIM Packing" />} />
          <Route path='fim-packing-verification' element={<PlaceholderPage title="FIM Packing Verification" />} />
          <Route path='fim-packing-list' element={<PlaceholderPage title="FIM Packing List" />} />
          <Route path='fim-packing-details' element={<PlaceholderPage title="FIM Packing Details" />} />
          <Route path='fitup-clearance-management' element={<PlaceholderPage title="Fit-Up Acceptance" />} />
          <Route path='weld-visual-clearance-management' element={<PlaceholderPage title="Weld Visual Acceptance" />} />
          <Route path='final-dimension-clearance-management' element={<PlaceholderPage title="Final Dimension Acceptance" />} />
          <Route path='rt-offer-management' element={<PlaceholderPage title="RT Offering" />} />
          <Route path='manage-rt-offer' element={<PlaceholderPage title="Manage RT Offer" />} />
          <Route path='rt-clearance-management' element={<PlaceholderPage title="RT Acc / Rej" />} />
          <Route path='manage-rt-clearance' element={<PlaceholderPage title="Manage RT Clearance" />} />
          <Route path='pwht-offer-management' element={<PlaceholderPage title="PWHT Offering" />} />
          <Route path='manage-pwht-offer' element={<PlaceholderPage title="Manage PWHT Offer" />} />
          <Route path='pwht-clearance-management' element={<PlaceholderPage title="PWHT Acc / Rej" />} />
          <Route path='manage-pwht-clearance' element={<PlaceholderPage title="Manage PWHT Clearance" />} />
          <Route path='ft-offer-management' element={<PlaceholderPage title="FT Offering" />} />
          <Route path='manage-ft-offer' element={<PlaceholderPage title="Manage FT Offer" />} />
          <Route path='ft-clearance-management' element={<PlaceholderPage title="FT Acc / Rej" />} />
          <Route path='manage-ft-clearance' element={<PlaceholderPage title="Manage FT Clearance" />} />
          <Route path='lpt-offer-management' element={<PlaceholderPage title="LPT Offering" />} />
          <Route path='manage-lpt-offer' element={<PlaceholderPage title="Manage LPT Offer" />} />
          <Route path='lpt-clearance-management' element={<PlaceholderPage title="LPT Acc / Rej" />} />
          <Route path='manage-lpt-clearance' element={<PlaceholderPage title="Manage LPT Clearance" />} />
          <Route path='mpt-offer-management' element={<PlaceholderPage title="MPT Offering" />} />
          <Route path='manage-mpt-offer' element={<PlaceholderPage title="Manage MPT Offer" />} />
          <Route path='mpt-clearance-management' element={<PlaceholderPage title="MPT Acc / Rej" />} />
          <Route path='manage-mpt-clearance' element={<PlaceholderPage title="Manage MPT Clearance" />} />
          <Route path='ht-offer-management' element={<PlaceholderPage title="Hardness Testing Offering" />} />
          <Route path='manage-ht-offer' element={<PlaceholderPage title="Manage Hardness Testing Offer" />} />
          <Route path='ht-clearance-management' element={<PlaceholderPage title="Hardness Testing Acc / Rej" />} />
          <Route path='manage-ht-clearance' element={<PlaceholderPage title="Manage Hardness Testing Clearance" />} />
          <Route path='pmi-offer-management' element={<PlaceholderPage title="PMI Offering" />} />
          <Route path='manage-pmi-offer' element={<PlaceholderPage title="Manage PMI Offer" />} />
          <Route path='pmi-clearance-management' element={<PlaceholderPage title="PMI Acc / Rej" />} />
          <Route path='manage-pmi-clearance' element={<PlaceholderPage title="Manage PMI Clearance" />} />
          <Route path='pickling-passivation-offer-management' element={<PlaceholderPage title="Pickling & Passivation Offering" />} />
          <Route path='manage-pickling-passivation-offer' element={<PlaceholderPage title="Manage Pickling & Passivation Offer" />} />
          <Route path='pickling-passivation-clearance-management' element={<PlaceholderPage title="Pickling & Passivation Acc / Rej" />} />
          <Route path='manage-pickling-passivation-clearance' element={<PlaceholderPage title="Manage Pickling & Passivation Clearance" />} />
          <Route path='line-history-management' element={<PlaceholderPage title="Line History (LHS)" />} />
          <Route path='view-line-history' element={<PlaceholderPage title="View Line History" />} />
          <Route path='view-Genline-history' element={<PlaceholderPage title="View General Line History" />} />
          <Route path='surface-clearance-management' element={<PlaceholderPage title="Surface & Primer Acceptance" />} />
          <Route path='manage-surface-clearance' element={<PlaceholderPage title="Manage Surface Clearance" />} />
          <Route path='view-surface-clearance' element={<PlaceholderPage title="View Surface Clearance" />} />
          <Route path='mio-clearance-management' element={<PlaceholderPage title="MIO Acceptance" />} />
          <Route path='manage-mio-clearance' element={<PlaceholderPage title="Manage MIO Clearance" />} />
          <Route path='view-mio-clearance' element={<PlaceholderPage title="View MIO Clearance" />} />
          <Route path='final-coat-clearance-management' element={<PlaceholderPage title="Final Coat Acceptance" />} />
          <Route path='manage-final-coat-clearance' element={<PlaceholderPage title="Manage Final Coat Clearance" />} />
          <Route path='view-final-coat-clearance' element={<PlaceholderPage title="View Final Coat Clearance" />} />
          <Route path='release-note-management' element={<PlaceholderPage title="IRN / Release Note" />} />
          <Route path='view-release-note' element={<PlaceholderPage title="View Release Note" />} />
          <Route path='*' element={<Navigate to='dashboard' />} />
      </Route>
    </Routes>
  );
};

export default ClientPipingRoutes;