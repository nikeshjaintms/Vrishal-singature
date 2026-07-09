import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PoOutlet from './PoOutlet'
import PO_ROUTE_URLS, { PO_BASE_URL, PO_PIPING_BASE_URL } from './PoRoutes'
import PoDashboard from '../../Pages/PoTeam/pages/Dashboard/PoDashboard'

import PipingAreaList from '../../Pages/PoTeam/pages/pipings/Area/AreaList';
import PipingInquiryList from '../../Pages/PoTeam/pages/pipings/Inquiry/Inquiry'
import PipingManageInquiry from '../../Pages/PoTeam/pages/pipings/Inquiry/ManageInquiry'
import PipingViewInquiry from '../../Pages/PoTeam/pages/pipings/Inquiry/ViewInquiry'
import PipingManagePR from '../../Pages/PoTeam/pages/pipings/PreparePr/ManagePR'
import PipingProcurementRequestList from '../../Pages/PoTeam/pages/pipings/PreparePr/ProcurementRequestList'
import PipingViewPR from '../../Pages/PoTeam/pages/pipings/PreparePr/ViewPR'
import PipingManageTerms from '../../Pages/PoTeam/pages/pipings/TandC/ManageTerms'
import PipingTandC from '../../Pages/PoTeam/pages/pipings/TandC/TandC'
import PipingManageParty from '../../Pages/PoTeam/pages/pipings/Party/ManageParty'
import PipingParty from '../../Pages/PoTeam/pages/pipings/Party/Party'
import PipingSectionDeatils from '../../Pages/PoTeam/pages/pipings/Item/SectionDeatils'
import PipingManageSectionDetail from '../../Pages/PoTeam/pages/pipings/Item/ManageSectionDetail'

import PipingMto from '../../Pages/PoTeam/pages/pipings/MaterialMto/MaterialMto'
import PipingManageMto from '../../Pages/PoTeam/pages/pipings/MaterialMto/ManageMto'
import PipingViewMTO from '../../Pages/PoTeam/pages/pipings/MaterialMto/ViewMTO'

import PipingOrder from '../../Pages/PoTeam/pages/pipings/Order/Order'
import PipingManageOrder from '../../Pages/PoTeam/pages/pipings/Order/ManageIOrder'
import PipingViewPO from '../../Pages/PoTeam/pages/pipings/Order/ViewOrder'
import PipingPoDashboard from '../../Pages/PoTeam/pages/pipings/Dashboard/PoDashboard'




const PoTeam = () => {
    return (
        <>
            <Routes>
                <Route path={PO_PIPING_BASE_URL} element={<PoOutlet />}>
                    <Route path={PO_ROUTE_URLS.PIPING_HOME} element={<PipingPoDashboard />} />
                    <Route path={PO_ROUTE_URLS.PIPING_AREA_MASTER} element={<PipingAreaList />} />
                    <Route path={PO_ROUTE_URLS.PIPING_INQUIRY} element={<PipingInquiryList />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_INQUIRY} element={<PipingManageInquiry />} />
                    <Route path={PO_ROUTE_URLS.PIPING_VIEW_INQUIRY} element={<PipingViewInquiry />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_PR} element={<PipingManagePR />} />
                    <Route path={PO_ROUTE_URLS.PIPING_PR} element={<PipingProcurementRequestList />} />
                    <Route path={PO_ROUTE_URLS.PIPING_PR_VIEW} element={<PipingViewPR />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_TERMS_AND_CONDITIONS} element={<PipingManageTerms />} />
                    <Route path={PO_ROUTE_URLS.PIPING_TERMS_AND_CONDITIONS} element={<PipingTandC />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_MANUFACTURER} element={<PipingManageParty />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANUFACTURE_LIST} element={<PipingParty />} />
                    <Route path={PO_ROUTE_URLS.PIPING_SECTION_DETAILS} element={<PipingSectionDeatils />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_SECTION_DETAILS} element={<PipingManageSectionDetail />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MTO} element={<PipingMto />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_MTO} element={<PipingManageMto />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MTO_VIEW} element={<PipingViewMTO />} />
                    <Route path={PO_ROUTE_URLS.PIPING_ORDER_PLACE} element={<PipingOrder />} />
                    <Route path={PO_ROUTE_URLS.PIPING_MANAGE_ORDER} element={<PipingManageOrder />} />
                    <Route path={PO_ROUTE_URLS.PIPING_VIEW_ORDER} element={<PipingViewPO />} />
                </Route>
                <Route path={`${PO_PIPING_BASE_URL}/*`} element={<Navigate to={PO_ROUTE_URLS.PIPING_HOME} />} />
            </Routes>
        </>
    )
}

export default PoTeam