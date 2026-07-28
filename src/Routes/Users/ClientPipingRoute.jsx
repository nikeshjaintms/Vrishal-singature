import React from 'react';
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

/**
 * ClientPipingRoute.jsx — TRIMMED, TEMPORARY VERSION
 * ====================================================
 * Only Material Receiving (QC) and FIM are wired to real components right
 * now, matching the files currently present in the project. Every other
 * area (Fit-Up, Weld Visual, Final Dimension, all NDT types, Line History,
 * Surface/MIO/Final Coat, IRN) is left as PlaceholderPage on purpose — those
 * component files have not been added to the project yet. Adding more files
 * later without also updating the imports/routes below will not make them
 * appear; this file must be updated (or replaced with the full version) at
 * the same time those files are added.
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
          <Route path='fitup-clearance-management' element={<PlaceholderPage title="Fit-Up Acceptance" />} />
          <Route path='view-quality-clearance-fitup' element={<PlaceholderPage title="View Fit-Up Clearance" />} />
          <Route path='weld-visual-clearance-management' element={<PlaceholderPage title="Weld Visual Acceptance" />} />
          <Route path='view-quality-clearance-weld-visual' element={<PlaceholderPage title="View Weld Visual Clearance" />} />
          <Route path='final-dimension-clearance-management' element={<PlaceholderPage title="Final Dimension Acceptance" />} />
          <Route path='view-quality-clearance-final-dimension' element={<PlaceholderPage title="View Final Dimension Clearance" />} />
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