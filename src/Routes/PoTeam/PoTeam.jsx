import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PoOutlet from './PoOutlet'
import PO_ROUTE_URLS, { PO_BASE_URL, PO_PIPING_BASE_URL } from './PoRoutes'
import PoDashboard from '../../Pages/PoTeam/pages/Dashboard/PoDashboard'
import MaterialMto from '../../Pages/PoTeam/pages/MaterialMto/MaterialMto'
import ProcurementRequestList from '../../Pages/PoTeam/pages/PreparePr/ProcurementRequestList'
import Inquiry from '../../Pages/PoTeam/pages/Inquiry/Inquiry'
import OfferComparision from '../../Pages/PoTeam/pages/OfferCom/OfferComparision'
import CounterOffer from '../../Pages/PoTeam/pages/CounterOffer/CounterOffer'
import Order from '../../Pages/PoTeam/pages/Order/Order'
import PoLogin from '../../Pages/PoTeam/auth/PoLogin'
import ManageMto from '../../Pages/PoTeam/pages/MaterialMto/ManageMto'
import SectionDeatils from '../../Pages/PoTeam/pages/Item/SectionDeatils'
import ManageSectionDetail from '../../Pages/PoTeam/pages/Item/ManageSectionDetail'
import AreaList from '../../Pages/PoTeam/pages/Area/AreaList'
import ViewMTO from '../../Pages/PoTeam/pages/MaterialMto/ViewMTO'
import ManagePR from '../../Pages/PoTeam/pages/PreparePr/ManagePR'
import ViewPR from '../../Pages/PoTeam/pages/PreparePr/ViewPR'
import ManageInquiry from '../../Pages/PoTeam/pages/Inquiry/ManageInquiry'
import ViewInquiry from '../../Pages/PoTeam/pages/Inquiry/ViewInquiry'
import ManageOrder from '../../Pages/PoTeam/pages/Order/ManageIOrder'
import ViewPO from "../../Pages/PoTeam/pages/Order/ViewOrder"
import MaterialChart from '../../Pages/PoTeam/pages/MaterialChart/MaterialChart'
import TandC from '../../Pages/PoTeam/pages/TandC/TandC'
import ManageTerms from '../../Pages/PoTeam/pages/TandC/ManageTerms'
import Party from '../../Pages/PoTeam/pages/Party/Party'
import ManageParty from '../../Pages/PoTeam/pages/Party/ManageParty'

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
import PipingMaterialChart from '../../Pages/PoTeam/pages/pipings/MaterialChart/MaterialChart'




const PoTeam = () => {
    return (
        <>
            <Routes>
                <Route path={PO_ROUTE_URLS.LOGIN} element={<PoLogin />} />

                <Route path={PO_BASE_URL} element={<PoOutlet />}>

                    <Route path={PO_ROUTE_URLS.HOME} element={<PoDashboard />} />


                    <Route path={PO_ROUTE_URLS.MTO} element={<MaterialMto />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_MTO} element={<ManageMto />} />
                    <Route path={PO_ROUTE_URLS.MTO_VIEW} element={<ViewMTO />} />

                    <Route path={PO_ROUTE_URLS.PR} element={<ProcurementRequestList />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_PR} element={<ManagePR />} />
                    <Route path={PO_ROUTE_URLS.PR_VIEW} element={<ViewPR />} />
                    <Route path={PO_ROUTE_URLS.INQUIRY} element={<Inquiry />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_INQUIRY} element={<ManageInquiry />} />
                    <Route path={PO_ROUTE_URLS.VIEW_INQUIRY} element={<ViewInquiry />} />
                    <Route path={PO_ROUTE_URLS.OFF_COM} element={<OfferComparision />} />
                    <Route path={PO_ROUTE_URLS.CONTER_OFF} element={<CounterOffer />} />
                    <Route path={PO_ROUTE_URLS.ORDER_PLACE} element={<Order />} />
                    <Route path={PO_ROUTE_URLS.VIEW_ORDER} element={<ViewPO />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_ORDER} element={<ManageOrder />} />
                    <Route path={PO_ROUTE_URLS.SECTION_DETAILS} element={<SectionDeatils />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_SECTION_DETAILS} element={<ManageSectionDetail />} />
                    <Route path={PO_ROUTE_URLS.AREA_MASTER} element={<AreaList />} />
                    <Route path={PO_ROUTE_URLS.MATERIAL_CHART} element={<MaterialChart />} />
                    <Route path={PO_ROUTE_URLS.TERMS_AND_CONDITIONS} element={<TandC />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_TERMS_AND_CONDITIONS} element={<ManageTerms />} />
                    <Route path={PO_ROUTE_URLS.MANAGE_MANUFACTURER} element={<ManageParty />} />
                    <Route path={PO_ROUTE_URLS.MANUFACTURE_LIST} element={<Party />} />
                </Route>
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
                <Route path={`${PO_BASE_URL}/*`} element={<Navigate to={PO_ROUTE_URLS.HOME} />} />
                <Route path={`${PO_PIPING_BASE_URL}/*`} element={<Navigate to={PO_ROUTE_URLS.PIPING_HOME} />} />
            </Routes>
        </>
    )
}

export default PoTeam