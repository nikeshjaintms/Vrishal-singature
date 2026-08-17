
import React from 'react'
import ViewReleaseNote from '../../Pages/ClientPiping/Multiple/ReleaseNote/ViewReleaseNote';
import MultiReleaseNote from '../../Pages/ClientPiping/Multiple/ReleaseNote/MultiReleaseNote';
import MultiLineHistory from '../../Pages/ClientPiping/Multiple/MultiLineHistory/MultiLineHistory';
import ViewLineHistory from '../../Pages/ClientPiping/Multiple/MultiLineHistory/ViewLineHistory';

import { Navigate, Route, Routes } from 'react-router-dom';
import PartyLayout from './ClientStoreLayout';
import Dashboard from '../../Pages/ClientPiping/Dashboard/Dashboard';
import PlaceholderPage from '../../Pages/ClientPiping/Include/PlaceholderPage';

// Material Receiving (QC)
import VerifyRequest from '../../Pages/ClientPiping/Qc/VerifyRequest/VerifyRequest';
import ViewQcRequest from '../../Pages/ClientPiping/Qc/VerifyRequest/ViewQcRequest';
import QcVerify from '../../Pages/ClientPiping/Qc/VerifyRequest/QcVerify';

// FIM — list + detail view only (Manage/Verification are staff-only actions, out of scope)
import FimPackingList from '../../Pages/ClientPiping/FIM/FimPackingList';
import ViewFIM from '../../Pages/ClientPiping/FIM/ViewFIM';

// Fit-Up Acceptance
import QFitUpList from '../../Pages/ClientPiping/QualityClearance/QFitup/QFitUpList';
import ViewMultiClearFitup from '../../Pages/ClientPiping/QualityClearance/QFitup/ViewMultiClearFitup';

// Weld Visual Acceptance
import QWeldVisualList from '../../Pages/ClientPiping/QualityClearance/QWeldVisual/QWeldVisualList';
import ViewMultiClearWeldVisual from '../../Pages/ClientPiping/QualityClearance/QWeldVisual/ViewMultiClearWeldVisual';

// Final Dimension Acceptance
import QFinalDimensionList from '../../Pages/ClientPiping/QualityClearance/FinalDimension/QFinalDimensionList';
import ViewMultiClearFD from '../../Pages/ClientPiping/QualityClearance/FinalDimension/ViewMultiClearFD';

// NDT — RT/MPT/LPT: Clearance (Acc/Rej) only. Offer creation is a staff-only
// workflow (selecting drawing items to submit for testing), not client-facing,
// so the *-offer-management routes stay as PlaceholderPage.
// NOTE: UT is NOT part of the approved 12-area scope (no route slots exist for
// it in this file), so it is intentionally not built or imported here.
// RT and MPT clearance: NEW backend endpoints built this session (no prior
// staff-side equivalent existed) — see comments in the respective piping
// controller files. Treat as needing real QA before production use.
import MultiRtClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiRT/MultiRtClearance';
import ViewMultiClearRT from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiRT/ViewMultiClearRT';
import MultiMptClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiMPT/MultiMptClearance';
import ViewMultiClearMPT from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiMPT/ViewMultiClearMPT';
import MultiLptClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiLPT/MultiLptClearance';
import ViewMultiLptClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiLPT/ViewMultiLptClearance';

// NDT — PWHT/FT/HT/PMI/Pickling & Passivation: read-only (view + download).
// These 5 NDT-type models don't yet have the client_status/status_type
// fields the RT/MPT/LPT accept-reject action depends on, so there is no
// accept/reject action here — see the note in party.routes.js.
import MultiPwhtClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiPWHT/MultiPwhtClearance';
import ViewMultiClearPWHT from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiPWHT/ViewMultiClearPWHT';
import MultiFtClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiFT/MultiFtClearance';
import ViewMultiClearFT from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiFT/ViewMultiClearFT';
import MultiHtClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiHT/MultiHtClearance';
import ViewMultiClearHT from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiHT/ViewMultiClearHT';
import MultiPmiClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiPMI/MultiPmiClearance';
import ViewMultiClearPMI from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiPMI/ViewMultiClearPMI';
import MultiPicklingClearance from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiPickling/MultiPicklingClearance';
import ViewMultiClearPickling from '../../Pages/ClientPiping/Multiple/MultiNDT/MultiPickling/ViewMultiClearPickling';

import MultiSurfaceClearance from '../../Pages/ClientPiping/Multiple/Painting/Surface/MultiSurfaceClearance';
import ViewMultiSurfaceClearance from '../../Pages/ClientPiping/Multiple/Painting/Surface/ViewMultiSurfaceClearance';
import MultiMioClearance from '../../Pages/ClientPiping/Multiple/Painting/Mio/MultiMioClearance';
import ViewMultiMioClearance from '../../Pages/ClientPiping/Multiple/Painting/Mio/ViewMultiMioClearance';
import MultiFinalCoatClearance from '../../Pages/ClientPiping/Multiple/Painting/FinalCoat/MultiFinaloatClearance';
import ViewMultiFinalCoatClearance from '../../Pages/ClientPiping/Multiple/Painting/FinalCoat/ViewMultiFinalCoatClearance';
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

          <Route path='verify-request-management' element={<VerifyRequest />} />
          <Route path='view-qc-request' element={<ViewQcRequest />} />
          <Route path='manage-verify-request' element={<QcVerify />} />
          <Route path='manage-fim-packing' element={<PlaceholderPage title="Manage FIM Packing" />} />
          <Route path='fim-packing-verification' element={<PlaceholderPage title="FIM Packing Verification" />} />
          <Route path='fim-packing-list' element={<FimPackingList />} />
          <Route path='fim-packing-details' element={<ViewFIM />} />
          <Route path='fitup-clearance-management' element={<QFitUpList />} />
          <Route path='view-quality-clearance-fitup' element={<ViewMultiClearFitup />} />
          <Route path='weld-visual-clearance-management' element={<QWeldVisualList />} />
          <Route path='view-quality-clearance-weldvisual' element={<ViewMultiClearWeldVisual />} />
          <Route path='final-dimension-clearance-management' element={<QFinalDimensionList />} />
          <Route path='view-quality-clearance-final-dimension' element={<ViewMultiClearFD />} />
          <Route path='rt-offer-management' element={<PlaceholderPage title="RT Offering" />} />
          <Route path='manage-rt-offer' element={<PlaceholderPage title="Manage RT Offer" />} />
          <Route path='rt-clearance-management' element={<MultiRtClearance />} />
          <Route path='view-quality-clearance-rt' element={<ViewMultiClearRT />} />
          <Route path='pwht-offer-management' element={<PlaceholderPage title="PWHT Offering" />} />
          <Route path='manage-pwht-offer' element={<PlaceholderPage title="Manage PWHT Offer" />} />
          <Route path='pwht-clearance-management' element={<MultiPwhtClearance />} />
          <Route path='view-quality-clearance-pwht' element={<ViewMultiClearPWHT />} />
          <Route path='manage-pwht-clearance' element={<PlaceholderPage title="Manage PWHT Clearance" />} />
          <Route path='ft-offer-management' element={<PlaceholderPage title="FT Offering" />} />
          <Route path='manage-ft-offer' element={<PlaceholderPage title="Manage FT Offer" />} />
          <Route path='ft-clearance-management' element={<MultiFtClearance />} />
          <Route path='view-quality-clearance-ft' element={<ViewMultiClearFT />} />
          <Route path='manage-ft-clearance' element={<PlaceholderPage title="Manage FT Clearance" />} />
          <Route path='lpt-offer-management' element={<PlaceholderPage title="LPT Offering" />} />
          <Route path='manage-lpt-offer' element={<PlaceholderPage title="Manage LPT Offer" />} />
          <Route path='lpt-clearance-management' element={<MultiLptClearance />} />
          <Route path='view-quality-clearance-lpt' element={<ViewMultiLptClearance />} />
          <Route path='manage-lpt-clearance' element={<PlaceholderPage title="LPT Detail" />} />
          <Route path='mpt-offer-management' element={<PlaceholderPage title="MPT Offering" />} />
          <Route path='manage-mpt-offer' element={<PlaceholderPage title="Manage MPT Offer" />} />
          <Route path='mpt-clearance-management' element={<MultiMptClearance />} />
          <Route path='view-quality-clearance-mpt' element={<ViewMultiClearMPT />} />
          <Route path='manage-mpt-clearance' element={<PlaceholderPage title="MPT Detail" />} />
          <Route path='ht-offer-management' element={<PlaceholderPage title="Hardness Testing Offering" />} />
          <Route path='manage-ht-offer' element={<PlaceholderPage title="Manage Hardness Testing Offer" />} />
          <Route path='ht-clearance-management' element={<MultiHtClearance />} />
          <Route path='view-quality-clearance-ht' element={<ViewMultiClearHT />} />
          <Route path='manage-ht-clearance' element={<PlaceholderPage title="Manage Hardness Testing Clearance" />} />
          <Route path='pmi-offer-management' element={<PlaceholderPage title="PMI Offering" />} />
          <Route path='manage-pmi-offer' element={<PlaceholderPage title="Manage PMI Offer" />} />
          <Route path='pmi-clearance-management' element={<MultiPmiClearance />} />
          <Route path='view-quality-clearance-pmi' element={<ViewMultiClearPMI />} />
          <Route path='manage-pmi-clearance' element={<PlaceholderPage title="Manage PMI Clearance" />} />
          <Route path='pickling-passivation-offer-management' element={<PlaceholderPage title="Pickling & Passivation Offering" />} />
          <Route path='manage-pickling-passivation-offer' element={<PlaceholderPage title="Manage Pickling & Passivation Offer" />} />
          <Route path='pickling-passivation-clearance-management' element={<MultiPicklingClearance />} />
          <Route path='view-quality-clearance-pickling' element={<ViewMultiClearPickling />} />
          <Route path='manage-pickling-passivation-clearance' element={<PlaceholderPage title="Manage Pickling & Passivation Clearance" />} />
          <Route path='line-history-management' element={<MultiLineHistory />} />
          <Route path='view-line-history' element={<ViewLineHistory />} />
          <Route path='view-Genline-history' element={<PlaceholderPage title="View General Line History" />} />
          <Route path='surface-clearance-management' element={<MultiSurfaceClearance title="Surface & Primer Acceptance" />} />
          <Route path='manage-surface-clearance' element={<PlaceholderPage title="Manage Surface Clearance" />} />
          <Route path='view-surface-clearance' element={<ViewMultiSurfaceClearance />} />
          <Route path='mio-clearance-management' element={<MultiMioClearance title="MIO Acceptance" />} />
          <Route path='manage-mio-clearance' element={<PlaceholderPage title="Manage MIO Clearance" />} />
          <Route path='view-mio-clearance' element={<ViewMultiMioClearance />} />
          <Route path='final-coat-clearance-management' element={<MultiFinalCoatClearance title="Final Coat Acceptance" />} />
          <Route path='manage-final-coat-clearance' element={<PlaceholderPage title="Manage Final Coat Clearance" />} />
          <Route path='view-final-coat-clearance' element={<ViewMultiFinalCoatClearance />} />
          <Route path='release-note-management' element={<MultiReleaseNote />} />
          <Route path='view-release-note' element={<ViewReleaseNote />} />
          <Route path='*' element={<Navigate to='dashboard' />} />
      </Route>
    </Routes>
  );
};

export default ClientPipingRoutes;