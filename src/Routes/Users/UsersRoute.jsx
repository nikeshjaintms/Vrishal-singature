import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../../Pages/Users/Dashboard/Dashboard';
import Drawing from '../../Pages/Users/Planner/Drawing/Drawing';
import ViewDrawing from '../../Pages/Users/Planner/Drawing/ViewDrawing';
import DrawingDataMaster from '../../Pages/Users/Planner/Drawing/DrawingDataMaster';
import ManageDrawing from '../../Pages/Users/Planner/Drawing/ManageDrawing';
import PurchaseRequest from '../../Pages/Users/Planner/Request/Purchase/PurchaseRequest';
import ManagePurchaseRequest from '../../Pages/Users/Planner/Request/Purchase/ManagePurchaseRequest';
import Request from '../../Pages/Users/Request/Request';
import ViewRequest from '../../Pages/Users/Request/ViewRequest';


import VerifyRequest from '../../Pages/Users/Qc/VerifyRequest/VerifyRequest';
import Item from '../../Pages/Users/Item/Item';
import ManageItem from '../../Pages/Users/Item/ManageItem';
import Party from '../../Pages/Users/Party/Party';
import ManageParty from '../../Pages/Users/Party/ManageParty';
import OfferList from '../../Pages/Users/MaterialCoordinator/OfferList';
import EditOffer from '../../Pages/Users/MaterialCoordinator/EditOffer';
import ViewOfferList from '../../Pages/Users/MaterialCoordinator/ViewOfferList';
import ApprovedItemList from '../../Pages/Users/MaterialCoordinator/ApprovedItemList';
import ManageIssue from '../../Pages/Users/MaterialCoordinator/ManageIssue';
import Category from '../../Pages/Users/StoreMaster/Category/Category';
import ManageCategory from '../../Pages/Users/StoreMaster/Category/ManageCategory';
import Unit from '../../Pages/Users/StoreMaster/Unit/Unit';
import ManageUnit from '../../Pages/Users/StoreMaster/Unit/ManageUnit';
import Transport from '../../Pages/Users/StoreMaster/Transport/Transport';
import ManageTransport from '../../Pages/Users/StoreMaster/Transport/ManageTransport';
import Location from '../../Pages/Users/StoreMaster/InventoryLocation/Location';
import ManageLocation from '../../Pages/Users/StoreMaster/InventoryLocation/ManageLocation';
import PartyGroup from '../../Pages/Users/StoreMaster/PartyGroup/PartyGroup';
import ManagePartyGroup from '../../Pages/Users/StoreMaster/PartyGroup/ManagePartyGroup';
import ViewQcRequest from '../../Pages/Users/Qc/VerifyRequest/ViewQcRequest';
import ViewApprovedList from '../../Pages/Users/MaterialCoordinator/ViewApprovedList';
import Profile from '../../Pages/Users/Profile/Profile';
import IssueList from '../../Pages/Users/Transaction/Issue/IssueList';
import StockReport from '../../Pages/Users/Report/Stock/StockReport';
import AuthList from '../../Pages/Users/StoreMaster/AuthPerson/AuthList';
import ManageAuth from '../../Pages/Users/StoreMaster/AuthPerson/ManageAuth';
import IssueRequest from '../../Pages/Users/Transaction/Issue/IssueRequest';
import Fitup from '../../Pages/Users/Execution/Fitup/Fitup';
import ManageFitup from '../../Pages/Users/Execution/Fitup/ManageFitup';
import WeldVisual from '../../Pages/Users/Execution/WeldVisual/WeldVisual';
import ManageWeldVisual from '../../Pages/Users/Execution/WeldVisual/ManageWeldVisual';
import ManageWpsMaster from '../../Pages/Users/Project/WpsMaster/ManageWpsMaster';
import WpsMaster from '../../Pages/Users/Project/WpsMaster/WpsMaster';
import JointType from '../../Pages/Users/Project/JointType/JointType';
import ManageJointType from '../../Pages/Users/Project/JointType/ManageJointType';
import NdtMaster from '../../Pages/Users/Project/NdtMaster/NdtMaster';
import ManageNdt from '../../Pages/Users/Project/NdtMaster/ManageNdt';
import PaintSystem from '../../Pages/Users/Project/PaintingSystem/PaintSystem';
import ManagePaintingSystem from '../../Pages/Users/Project/PaintingSystem/ManagePaintingSystem';
import Contractor from '../../Pages/Users/Project/Contractor/Contractor';
import ManageContractor from '../../Pages/Users/Project/Contractor/ManageContractor';
import ManageWelder from '../../Pages/Users/Project/WelderMaster/ManageWelder';
import WelderMaster from '../../Pages/Users/Project/WelderMaster/WelderMaster';
import ManageProcedure from '../../Pages/Users/Project/ProcedureMaster/ManageProcedure';
import ProcedureMaster from '../../Pages/Users/Project/ProcedureMaster/ProcedureMaster';
import OfferRequest from '../../Pages/Users/Request/OfferRequest';
import QcVerify from '../../Pages/Users/Qc/VerifyRequest/QcVerify';
import Ndt from '../../Pages/Users/NDT/NDT/Ndt';
import ManageNdtMaster from '../../Pages/Users/NDT/NDT/ManageNdtMaster';
import QFitup from '../../Pages/Users/QualityClearance/QFitup/QFitup';
import QWeldVisual from '../../Pages/Users/QualityClearance/QWeldVisual/QWeldVisual';
import StockReportList from '../../Pages/Users/Stock/StockReportList';
import IssueRequestList from '../../Pages/Users/Transaction/Issue/IssueRequestList';
import IssueReturnNote from '../../Pages/Users/Transaction/Issue/IssueReturnNote';
import IssueReturnList from '../../Pages/Users/Transaction/Issue/IssueReturnList';

import ManageIssueAcc from '../../Pages/Users/Transaction/Issue/ManageIssueAcc';
import UtOffer from '../../Pages/Users/NDT/UT/UtOffer';
import ManageUtOffer from '../../Pages/Users/NDT/UT/ManageUtOffer';
import RtOffer from '../../Pages/Users/NDT/RT/RtOffer';
import ManageRtOffer from '../../Pages/Users/NDT/RT/ManageRtOffer';
import MptOffer from '../../Pages/Users/NDT/MPT/MptOffer';
import ManageMptOffer from '../../Pages/Users/NDT/MPT/ManageMptOffer';
import LptOffer from '../../Pages/Users/NDT/LPT/LptOffer';
import ManageLptOffer from '../../Pages/Users/NDT/LPT/ManageLptOffer';
import UtClearance from '../../Pages/Users/NDT/UT/UtClearance';
import GetUtClearance from '../../Pages/Users/NDT/UT/GetUtClearance';
import ManageRtClearance from '../../Pages/Users/NDT/RT/ManageRtClearance';
import RtClearance from '../../Pages/Users/NDT/RT/RtClearance';
import MptClearance from '../../Pages/Users/NDT/MPT/MptClearance';
import ManageMptClearance from '../../Pages/Users/NDT/MPT/ManageMptClearance';
import LptClearance from '../../Pages/Users/NDT/LPT/LptClearance';
import ManageLptClearance from '../../Pages/Users/NDT/LPT/ManageLptClearance';
import FinalDimension from '../../Pages/Users/Execution/FinalDimension/FinalDimension';
import ManageFinalDimension from '../../Pages/Users/Execution/FinalDimension/ManageFinalDimension';
import QFinalDimension from '../../Pages/Users/QualityClearance/FinalDimension/QFinalDimension';
import InspectionSummary from '../../Pages/Users/PaintingDispatch/InspectionSummary';
import DispatchNote from '../../Pages/Users/PaintingDispatch/DispatchNote';
import ManageDispatchNote from '../../Pages/Users/PaintingDispatch/ManageDispatchNote';

import ManageSurfaceOffer from '../../Pages/Users/Paint/SurfacePrimer/ManageSurfaceOffer';
import SurfacePrimerOffer from '../../Pages/Users/Paint/SurfacePrimer/SurfacePrimerOffer';
import SurfacePrimerClearance from '../../Pages/Users/Paint/SurfacePrimer/SurfacePrimerClearance';
import MioPaint from '../../Pages/Users/Paint/Mio/MioPaint';
import ManageMioPaint from '../../Pages/Users/Paint/Mio/ManageMioPaint';
import FinalCoatPaint from '../../Pages/Users/Paint/FinalCoat/FinalCoatPaint';
import ManageFinalCoatPaint from '../../Pages/Users/Paint/FinalCoat/ManageFinalCoatPaint';
import ManageSurfaceClearance from '../../Pages/Users/Paint/SurfacePrimer/ManageSurfaceClearance';
import PaintManufacture from '../../Pages/Users/Project/PaintManufacture/PaintManufacture';
import ManagePaintManufacture from '../../Pages/Users/Project/PaintManufacture/ManagePaintManufacture';
import MioPaintClearance from '../../Pages/Users/Paint/Mio/MioPaintClearance';
import ManageMioPaintClearance from '../../Pages/Users/Paint/Mio/ManageMioPaintClearance';
import FinalCoatClearance from '../../Pages/Users/Paint/FinalCoat/FinalCoatClearance';
import ManageFinalCoatClearance from '../../Pages/Users/Paint/FinalCoat/ManageFinalCoatClearance';
import QFitUpList from '../../Pages/Users/QualityClearance/QFitup/QFitUpList';
import QWeldVisualList from '../../Pages/Users/QualityClearance/QWeldVisual/QWeldVisualList';
import ReleaseNote from '../../Pages/Users/ReleaseNote/ReleaseNote';
import QFinalDimensionList from '../../Pages/Users/QualityClearance/FinalDimension/QFinalDimensionList';

import ProjectStoreLayout from './ProjectStoreLayout';
import Packing from '../../Pages/Users/Packing/Packing';
import ManagePacking from '../../Pages/Users/Packing/ManagePacking';
import InvoiceList from '../../Pages/Users/Invoice/InvoiceList';
import ManageInvoice from '../../Pages/Users/Invoice/ManageInvoice';
import DPR from '../../Pages/Users/DPR/DPR';

import ProjectLocation from '../../Pages/Users/StoreMaster/ProjectLocation/ProjectLocation';
import ManageProjectLocation from '../../Pages/Users/StoreMaster/ProjectLocation/ManageProjectLocation';
import { useRoleAccess } from '../../Context/RoleAccessContext';
import ManageIssueAccEdit from '../../Pages/Users/Transaction/Issue/ManageIssueAccEdit';
import MultiIssueRequest from '../../Pages/Users/Multiple/Issue/MultiIssueRequest';
import MultiIssueReturn from '../../Pages/Users/Multiple/Issue/MultiIssueReturn';
import MultiIssueAcceptance from '../../Pages/Users/Multiple/Issue/MultiIssueAcceptance';
import MultiIssueReturnAcceptance from '../../Pages/Users/Multiple/Issue/IssueReturnAcceptance';
import ViewMultiIssueAcc from '../../Pages/Users/Multiple/Issue/ViewMultiIssueAcc';
import ViewIssueReturnAcc from '../../Pages/Users/Multiple/Issue/ViewIssueReturnAcc';
import ManageMultiFitup from '../../Pages/Users/Multiple/MultiExecution/MultiFitup/ManageMultiFitup';
import ManageMultiClearFitup from '../../Pages/Users/Multiple/MultiClearance/ClearanceMultiFitup/ManageMultiClearFitup';
import ViewMultiClearFitup from '../../Pages/Users/Multiple/MultiClearance/ClearanceMultiFitup/ViewMultiClearFitup';
import ManageMultiWeldVisual from '../../Pages/Users/Multiple/MultiExecution/MultiWeldVisual/ManageMultiWeldVisual';
import ManageMultiClearWeld from '../../Pages/Users/Multiple/MultiClearance/ClearanceMultiWeldVisual/ManageMultiClearWeld';
import ManageMultiFd from '../../Pages/Users/Multiple/MultiExecution/MultiFinalDimension/ManageMultiFd';
import ManageMultiClearFd from '../../Pages/Users/Multiple/MultiClearance/ClearanceMultiFd/ManageMultiClearFd';
import ManageMultiNDT from '../../Pages/Users/Multiple/MultiExecution/MultiNDT/ManageMultiNDT';
import MultiUtOffer from '../../Pages/Users/Multiple/MultiNDT/MultiUT/MultiUtOffer';
import ManageMultiUtOffer from '../../Pages/Users/Multiple/MultiNDT/MultiUT/ManageMultiUtOffer';
import MultiUtClearance from '../../Pages/Users/Multiple/MultiNDT/MultiUT/MultiUtClearance';
import ManageMultiUtClearance from '../../Pages/Users/Multiple/MultiNDT/MultiUT/ManageMultiUtClearance';
import MultiRtOffer from '../../Pages/Users/Multiple/MultiNDT/MultiRT/MultiRtOffer';
import ManageMultiRtOffer from '../../Pages/Users/Multiple/MultiNDT/MultiRT/ManageMultiRtOffer';
import MultiMptOffer from '../../Pages/Users/Multiple/MultiNDT/MultiMPT/MultiMptOffer';
import ManageMultiMptOffer from '../../Pages/Users/Multiple/MultiNDT/MultiMPT/ManageMultiMptOffer';
import MultiLptOffer from '../../Pages/Users/Multiple/MultiNDT/MultiLPT/MultiLptOffer';
import ManageMultiLptOffer from '../../Pages/Users/Multiple/MultiNDT/MultiLPT/ManageMultiLptOffer';
import MultiMptClearance from '../../Pages/Users/Multiple/MultiNDT/MultiMPT/MultiMptClearance';
import ManageMultiMptClearance from '../../Pages/Users/Multiple/MultiNDT/MultiMPT/ManageMultiMptClearance';
import MultiLptClearance from '../../Pages/Users/Multiple/MultiNDT/MultiLPT/MultiLptClearance';
import ManageMultiLptClearance from '../../Pages/Users/Multiple/MultiNDT/MultiLPT/ManageMultiLptClearance';
import MultiRtClearance from '../../Pages/Users/Multiple/MultiNDT/MultiRT/MultiRtClearance';
import ManageMultiRtClearance from '../../Pages/Users/Multiple/MultiNDT/MultiRT/ManageMultiRtClearance';
import ManageQFinalDimension from '../../Pages/Users/QualityClearance/FinalDimension/ManageQFinalDimension';
import ViewMultiSummary from '../../Pages/Users/Multiple/InsSummary/ViewMultiSummary';
import ViewGenMultiSummary from '../../Pages/Users/Multiple/InsSummary/ViewGenMultiSummary';
import ManageDispatch from '../../Pages/Users/Multiple/DispatchNote/ManageDispatch';
import ViewDispatch from '../../Pages/Users/Multiple/DispatchNote/ViewDispatch';
import MultiManageSurface from '../../Pages/Users/Multiple/Painting/Surface/MultiManageSurface';
import MultiSurface from '../../Pages/Users/Multiple/Painting/Surface/MultiSurface';
import MultiSurfaceClearance from '../../Pages/Users/Multiple/Painting/Surface/MultiSurfaceClearance';
import MultiManageSurfaceClearance from '../../Pages/Users/Multiple/Painting/Surface/MultiManageSurfaceClearance';
import MultiViewSurfaceClearanc from '../../Pages/Users/Multiple/Painting/Surface/MultiViewSurfaceClearanc';
import MultiMio from '../../Pages/Users/Multiple/Painting/Mio/MultiMio';
import MultiMioClearance from '../../Pages/Users/Multiple/Painting/Mio/MultiMioClearance';
import MultiManageMioClearance from '../../Pages/Users/Multiple/Painting/Mio/MultiManageMioClearance';
import MultiManageMio from '../../Pages/Users/Multiple/Painting/Mio/MultiManageMio';
import MultiViewMioClearance from '../../Pages/Users/Multiple/Painting/Mio/MultiViewMioClearance';
import MultiFinalCoat from '../../Pages/Users/Multiple/Painting/MultiFinalCoat/MultiFinalCoat';
import ManageMultiFinalCoat from '../../Pages/Users/Multiple/Painting/MultiFinalCoat/ManageMultiFinalCoat';
import MultiFinalCoatClearance from '../../Pages/Users/Multiple/Painting/MultiFinalCoat/MultiFinalCoatClearance';
import ManageMultiFinalCoatClearance from '../../Pages/Users/Multiple/Painting/MultiFinalCoat/ManageMultiFinalCoatClearance';
import MultiViewFinalCoatClearance from '../../Pages/Users/Multiple/Painting/MultiFinalCoat/MultiViewFinalCoatClearance';
import MultiReleaseNote from '../../Pages/Users/Multiple/MultiReleaseNote/MultiReleaseNote';
import ViewGenReleaseNote from '../../Pages/Users/Multiple/MultiReleaseNote/ViewGenReleaseNote';
import ViewReleaseNote from '../../Pages/Users/Multiple/MultiReleaseNote/ViewReleaseNote';
import MultiPacking from '../../Pages/Users/Multiple/MultiPacking/MultiPacking';
import MultiManagePacking from '../../Pages/Users/Multiple/MultiPacking/MultiManagePacking';
import MultiViewPacking from '../../Pages/Users/Multiple/MultiPacking/MultiViewPacking';
import MultiInvoice from '../../Pages/Users/Multiple/Invoice/MultiInvoice';
import ManageMultiInvoice from '../../Pages/Users/Multiple/Invoice/ManageMultiInvoice';
import NotesRestriction from '../../Pages/Users/Notes/NotesRestriction';
import ReusableStock from '../../Pages/Users/Stock/ReusableStock';
import AddDrawingForm from '../../Pages/Users/Multiple/MultiPacking/CommanComponents/AddDrawingForm';
// import ManageClearanceFitup from '../../Pages/Users/Multiple/MultiClearance/ClearanceMultiFitup/ManageClearanceFitup';
import DMR from '../../Pages/Users/DMR/DMR';
import DMRCategories from '../../Pages/Users/DMRCategories/DMRCategories';
import MaterialIssueAcceptanceMasterData from '../../Pages/Users/Transaction/Issue/MaterialIssueMasterData';
import MaterialIssueReturnSummary from '../../Pages/Users/Transaction/Issue/MaterialIssueReturnSummary';
import ManageFimPacking from '../../Pages/Users/FIM/ManageFimPacking';
import FimPackingList from '../../Pages/Users/FIM/FimPackingList';
import ViewFIM from '../../Pages/Users/FIM/ViewFIM';
import FimPackingVerification from '../../Pages/Users/FIM/FimPackingVerification';

const UsersRoute = () => {

    // const hasAccess = (item) => menuAccessConfig[item]?.includes(localStorage.getItem('ERP_ROLE'));
    const { hasAccess } = useRoleAccess();

    return (
        <>
            <Routes>
                
                <Route path='/user/project-store' element={<ProjectStoreLayout />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='edit-profile' element={<Profile />} />
                    {hasAccess('SectionDetails') && (
                        <>
                            <Route path='item-management' element={<Item />} />
                            <Route path='manage-item' element={<ManageItem />} />
                        </>
                    )}
                    {hasAccess('Party') && (
                        <>
                            <Route path='party-management' element={<Party />} />
                            <Route path='manage-party' element={<ManageParty />} />
                        </>
                    )}
                    <Route path='drawing-management' element={<Drawing />} />
                    <Route path='manage-drawing' element={<ManageDrawing />} />
                    <Route path='view-drawing' element={<ViewDrawing />} />
                    <Route path='drawing-master-data' element={<DrawingDataMaster/>} />

                    <Route path='material-request-management' element={<PurchaseRequest />} />
                    <Route path='manage-material-request' element={<ManagePurchaseRequest />} />

                    <Route path='issue-management' element={<IssueList />} />

                    {hasAccess('ProjectMaterialStore') && (
                        <>
                            {hasAccess('MaterialReceiving') && (
                                <>
                                    <Route path='item-request-management' element={<Request />} />
                                    <Route path='view-item-request' element={<ViewRequest />} />
                                    
                                    <Route path='manage-offer-request' element={<OfferRequest />} />

                                    <Route path='offer-item-management' element={<OfferList />} />
                                    <Route path='view-offered-item' element={<ViewOfferList />} />
                                     <Route path='edit-offer' element={<EditOffer />} />
                                </>
                            )}

                            {hasAccess('MaterialQC') && (
                                <>
                                    <Route path='verify-request-management' element={<VerifyRequest />} />
                                    <Route path='view-qc-request' element={<ViewQcRequest />} />
                                    <Route path='manage-verify-request' element={<QcVerify />} />
                                </>
                            )}

                            <Route path='approved-item-management' element={<ApprovedItemList />} />
                            <Route path='view-approved-item' element={<ViewApprovedList />} />
                            <Route path='item-issue-management' element={<ManageIssue />} />
                        </>
                    )}

                     {hasAccess('FIM') && (
                                <>
                                    <Route path='manage-fim-packing' element={<ManageFimPacking />} />
                                    <Route path='fim-packing-verification' element={<FimPackingVerification />} />
                                    <Route path='fim-packing-list' element={<FimPackingList />} />
                                    <Route path='fim-packing-details' element={<ViewFIM />} />
                                </>
                            )}


                    {hasAccess('ItemCategory') && (
                        <>
                            <Route path='category-management' element={<Category />} />
                            <Route path='manage-category' element={<ManageCategory />} />
                        </>
                    )}
                    {hasAccess('Unit') && (
                        <>
                            <Route path='unit-management' element={<Unit />} />
                            <Route path='manage-unit' element={<ManageUnit />} />
                        </>
                    )}

                    

                    <Route path='project-location-management' element={<ProjectLocation />} />
                    <Route path='manage-project-location' element={<ManageProjectLocation />} />

                    {/* <Route path='auth-person-management' element={<AuthList />} />
                    <Route path='manage-auth-person' element={<ManageAuth />} /> */}

                    {hasAccess('Transport') && (
                        <>
                            <Route path='transport-management' element={<Transport />} />
                            <Route path='manage-transport' element={<ManageTransport />} />
                        </>
                    )}
                    {hasAccess('InventoryLocation') && (
                        <>
                            <Route path='inventory-location-management' element={<Location />} />
                            <Route path='manage-inventory-location' element={<ManageLocation />} />
                        </>
                    )}

                    <Route path='party-group-management' element={<PartyGroup />} />
                    <Route path='manage-party-group' element={<ManagePartyGroup />} />


                    <Route path='issue-request-management' element={<IssueRequestList />} />
                    <Route path='issue-return-note' element={<IssueReturnNote />} />
                    {/* <Route path='manage-issue-acceptance' element={<ManageIssueAcc />} /> */}
                    <Route path='manage-issue-acceptance' element={<ViewMultiIssueAcc />} />

                    {/* <Route path='create-issue-acceptance' element={<ManageIssueAccEdit />} /> */}
                    <Route path='create-issue-acceptance' element={<MultiIssueAcceptance />} />
                    <Route path='create-issue-return-acceptance' element={<MultiIssueReturnAcceptance />} />

                    <Route path='issue-acceptance-master-data' element={<MaterialIssueAcceptanceMasterData />} />
                    <Route path='issue-return-summary' element={<MaterialIssueReturnSummary />} />

                    {/* <Route path='manage-issue-request' element={<IssueRequest />} /> */}
                    <Route path='manage-issue-request' element={<MultiIssueRequest />} />
                       <Route path='manage-issue-return' element={<MultiIssueReturn />} />
                         <Route path='issue-return-management' element={<IssueReturnList />} />
                     <Route path='manage-issue-return-acceptance' element={<ViewIssueReturnAcc />} />

                    {hasAccess('ExecutionOffer') && (
                        <>
                            <Route path='fitup-management' element={<Fitup />} />
                            {/* <Route path='manage-fitup' element={<ManageFitup />} /> */}
                            <Route path='manage-fitup' element={<ManageMultiFitup />} />

                            <Route path='weld-visual-management' element={<WeldVisual />} />
                            {/* <Route path='manage-weld-visual' element={<ManageWeldVisual />} /> */}
                            <Route path='manage-weld-visual' element={<ManageMultiWeldVisual />} />

                            <Route path='final-dimension-offer-management' element={<FinalDimension />} />
                            {/* <Route path='manage-final-dimension-offer' element={<ManageFinalDimension />} /> */}

                            <Route path='manage-final-dimension-offer' element={<ManageMultiFd />} />
                        </>
                    )}

                    {hasAccess('WPS') && (
                        <>
                            <Route path='manage-wps-master' element={<ManageWpsMaster />} />
                            <Route path='wps-master-management' element={<WpsMaster />} />
                        </>
                    )}

                    {hasAccess('JointType') && (
                        <>
                            <Route path='joint-type-management' element={<JointType />} />
                            <Route path='manage-joint-type' element={<ManageJointType />} />
                        </>
                    )}
                    {hasAccess('NDT') && (
                        <>
                            <Route path='ndt-master-management' element={<NdtMaster />} />
                            <Route path='manage-ndt-master' element={<ManageNdt />} />
                        </>
                    )}
                    {hasAccess('PaintingSystem') && (
                        <>
                            <Route path='painting-system-management' element={<PaintSystem />} />
                            <Route path='manage-painting-system' element={<ManagePaintingSystem />} />
                        </>
                    )}
                    {hasAccess('Contractor') && (
                        <Route path='contractor-master-management' element={<Contractor />} />
                    )}
                    {/* <Route path='manage-contractor-master' element={<ManageContractor />} /> */}
                    {hasAccess('QualifiedWelder') && (
                        <>
                            <Route path='welder-management' element={<WelderMaster />} />
                            <Route path='manage-welder' element={<ManageWelder />} />
                        </>
                    )}
                    {hasAccess('ProcedureSpecification') && (
                        <>
                            <Route path='procedure-master-management' element={<ProcedureMaster />} />
                            <Route path='manage-procedure-master' element={<ManageProcedure />} />
                        </>
                    )}

                    {hasAccess('ClearanceQC') && (
                        <>
                            <Route path='fitup-clearance-management' element={<QFitUpList />} />
                            {/* <Route path='quality-clearance-fitup-management' element={<QFitup />} /> */}
                            <Route path='quality-clearance-fitup-management' element={<ManageMultiClearFitup />} />
                            <Route path='view-quality-clearance-fitup' element={<ViewMultiClearFitup />} />

                            <Route path='weld-visual-clearance-management' element={<QWeldVisualList />} />
                            {/* <Route path='quality-clearance-weld-visual-management' element={<QWeldVisual />} /> */}
                            <Route path='quality-clearance-weld-visual-management' element={<ManageMultiClearWeld />} />

                            {/* <Route path='quality-clearance-final-dimension-management' element={<QFinalDimension />} /> */}
                            <Route path='final-dimension-clearance-management' element={<QFinalDimensionList />} />
                            <Route path='quality-clearance-final-dimension-management' element={<ManageMultiClearFd />} />
                        </>
                    )}

                    {hasAccess('NDT_DROP') && (
                        <>
                            {hasAccess('NDT_MASTER') && (
                                <>
                                    <Route path='ndt-management' element={<Ndt />} />
                                    <Route path='manage-ndt' element={<ManageMultiNDT />} />
                                </>
                            )}

                            {hasAccess('NDT_PROCESS') && (
                                <>
                                    {/* <Route path='ut-offer-management' element={<UtOffer />} /> */}
                                    {/* <Route path='manage-ut-offer' element={<ManageUtOffer />} /> */}
                                    {/* <Route path='ut-clearance-management' element={<GetUtClearance />} /> */}
                                    {/* <Route path='manage-ut-clearance' element={<UtClearance />} /> */}

                                    {/* new */}
                                    <Route path='ut-offer-management' element={<MultiUtOffer />} />
                                    <Route path='manage-ut-offer' element={<ManageMultiUtOffer />} />
                                    <Route path='ut-clearance-management' element={<MultiUtClearance />} />
                                    <Route path='manage-ut-clearance' element={<ManageMultiUtClearance />} />

                                    {/* <Route path='rt-offer-management' element={<RtOffer />} /> */}
                                    {/* <Route path='manage-rt-offer' element={<ManageRtOffer />} /> */}
                                    {/* <Route path='rt-clearance-management' element={<RtClearance />} /> */}
                                    {/* <Route path='manage-rt-clearance' element={<ManageRtClearance />} /> */}

                                    {/* new */}
                                    <Route path='rt-offer-management' element={<MultiRtOffer />} />
                                    <Route path='manage-rt-offer' element={<ManageMultiRtOffer />} />
                                    <Route path='rt-clearance-management' element={<MultiRtClearance />} />
                                    <Route path='manage-rt-clearance' element={<ManageMultiRtClearance />} />

                                    {/* <Route path='mpt-offer-management' element={<MptOffer />} />
                                    <Route path='manage-mpt-offer' element={<ManageMptOffer />} /> */}
                                    {/* <Route path='mpt-clearance-management' element={<MptClearance />} /> */}
                                    {/* <Route path='manage-mpt-clearance' element={<ManageMptClearance />} /> */}

                                    {/* new */}
                                    <Route path='mpt-offer-management' element={<MultiMptOffer />} />
                                    <Route path='manage-mpt-offer' element={<ManageMultiMptOffer />} />
                                    <Route path='mpt-clearance-management' element={<MultiMptClearance />} />
                                    <Route path='manage-mpt-clearance' element={<ManageMultiMptClearance />} />

                                    {/* <Route path='lpt-offer-management' element={<LptOffer />} />
                                    <Route path='manage-lpt-offer' element={<ManageLptOffer />} /> */}
                                    {/* <Route path='lpt-clearance-management' element={<LptClearance />} /> */}
                                    {/* <Route path='manage-lpt-clearance' element={<ManageLptClearance />} /> */}

                                    {/* new */}
                                    <Route path='lpt-offer-management' element={<MultiLptOffer />} />
                                    <Route path='manage-lpt-offer' element={<ManageMultiLptOffer />} />
                                    <Route path='lpt-clearance-management' element={<MultiLptClearance />} />
                                    <Route path='manage-lpt-clearance' element={<ManageMultiLptClearance />} />
                                </>
                            )}
                        </>
                    )}


                    <Route path='inspection-summary-management' element={<InspectionSummary />} />
                    <Route path='view-inspection-summary' element={<ViewMultiSummary />} />
                    <Route path='view-geninspection-summary' element={<ViewGenMultiSummary />} />

                    <Route path='dispatch-note-management' element={<DispatchNote />} />
                    {/* <Route path='manage-dispatch-note' element={<ManageDispatchNote />} /> */}
                    <Route path='manage-dispatch-note' element={<ManageDispatch />} />
                    <Route path='view-dispatch-note' element={<ViewDispatch />} />

                    {/* Painting System */}
                    {hasAccess('PaintManufacturer') && (
                        <>
                            <Route path='paint-manufacture-management' element={<PaintManufacture />} />
                            <Route path='manage-paint-manufacture' element={<ManagePaintManufacture />} />
                        </>
                    )}
                    {hasAccess('PAINT_MASTER') && (
                        <>
                            {/* Old */}
                            {/* <Route path='surface-primer-management' element={<SurfacePrimerOffer />} /> */}
                            {/* <Route path='manage-surface-primer' element={<ManageSurfaceOffer />} /> */}
                            {/* <Route path='surface-clearance-management' element={<SurfacePrimerClearance />} /> */}
                            {/* <Route path='manage-surface-clearance' element={<ManageSurfaceClearance />} /> */}

                            {/* New */}
                            <Route path='surface-primer-management' element={<MultiSurface />} />
                            <Route path='manage-surface-primer' element={<MultiManageSurface />} />
                            <Route path='surface-clearance-management' element={<MultiSurfaceClearance />} />
                            <Route path='manage-surface-clearance' element={<MultiManageSurfaceClearance />} />
                            <Route path='view-surface-clearance' element={<MultiViewSurfaceClearanc />} />

                            {/* Old */}
                            {/* <Route path='mio-offer-management' element={<MioPaint />} />
                            <Route path='manage-mio-offer' element={<ManageMioPaint />} />
                            <Route path='mio-clearance-management' element={<MioPaintClearance />} />
                            <Route path='manage-mio-clearance' element={<ManageMioPaintClearance />} /> */}

                            {/* New */}
                            <Route path='mio-offer-management' element={<MultiMio />} />
                            <Route path='manage-mio-offer' element={<MultiManageMio />} />
                            <Route path='mio-clearance-management' element={<MultiMioClearance />} />
                            <Route path='manage-mio-clearance' element={<MultiManageMioClearance />} />
                            <Route path='view-mio-clearance' element={<MultiViewMioClearance />} />

                            {/* old */}
                            {/* <Route path='final-coat-management' element={<FinalCoatPaint />} />
                            <Route path='manage-final-coat' element={<ManageFinalCoatPaint />} />
                            <Route path='final-coat-clearance-management' element={<FinalCoatClearance />} />
                            <Route path='manage-final-coat-clearance' element={<ManageFinalCoatClearance />} /> */}

                            {/* new */}
                            <Route path='final-coat-management' element={<MultiFinalCoat />} />
                            <Route path='manage-final-coat' element={<ManageMultiFinalCoat />} />
                            <Route path='final-coat-clearance-management' element={<MultiFinalCoatClearance />} />
                            <Route path='manage-final-coat-clearance' element={<ManageMultiFinalCoatClearance />} />
                            <Route path='view-final-coat-clearance' element={<MultiViewFinalCoatClearance />} />
                        </>
                    )}

                    {hasAccess('IRN_AFTER') && (
                        <>
                            {/* old */}
                            {/* <Route path='release-note-management' element={<ReleaseNote />} />
                            <Route path='management-release-note' element={<ViewReleaseNote />} /> */}

                            {/* new */}
                            <Route path='release-note-management' element={<MultiReleaseNote />} />
                            <Route path='view-release-note' element={<ViewReleaseNote />} />
                            <Route path='view-Genrelease-note' element={<ViewGenReleaseNote />} />
                        </>
                    )}

                    {/* old */}
                    {/* <Route path='packing-list' element={<MultiPacking />} /> */}
                    {/* <Route path='manage-packing' element={<MultiManagePacking />} /> */}

                    {/* new */}
                    <Route path='packing-list' element={<MultiPacking />} />
                    <Route path='manage-packing' element={<MultiManagePacking />} />
                    <Route path='view-packing' element={<MultiViewPacking />} />
                     {/* <Route path='add-drawing-form' element={<AddDrawingForm />} /> */}

                    {hasAccess('BILL') && (
                        <>
                            {/* <Route path='invoice-management' element={<InvoiceList />} />
                            <Route path='manage-invoice' element={<ManageInvoice />} /> */}

                            <Route path='invoice-management' element={<MultiInvoice />} />
                            <Route path='manage-invoice' element={<ManageMultiInvoice />} />
                        </>
                    )}
                    {hasAccess('DPR') && (
                        <Route path='dpr-management' element={<DPR />} />
                    )}
                     {hasAccess('DMR') && (
                        <Route path='dmr-management' element={<DMR />} />
                    )}
                    {hasAccess('DMRCATEGORIES') && (
                        <Route path='dmr-categories' element={<DMRCategories />} />
                    )}
                    <Route path='stock-report' element={<StockReport />} />
                    <Route path='stock-report-management' element={<StockReportList />} />

                    <Route path='reusable-stock' element={<ReusableStock />} />

                    <Route path='notes' element={<NotesRestriction />} />

                    <Route path='*' element={<Navigate to='dashboard' />} />
                </Route>
            </Routes>
        </>
    )
}

export default UsersRoute