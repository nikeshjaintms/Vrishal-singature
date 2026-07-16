import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../../Pages/Client/Dashboard/Dashboard';
import Drawing from '../../Pages/Client/Planner/Drawing/Drawing';
import ViewDrawing from '../../Pages/Client/Planner/Drawing/ViewDrawing';
import DrawingDataMaster from '../../Pages/Client/Planner/Drawing/DrawingDataMaster';
import ManageDrawing from '../../Pages/Client/Planner/Drawing/ManageDrawing';
import PurchaseRequest from '../../Pages/Client/Planner/Request/Purchase/PurchaseRequest';
import ManagePurchaseRequest from '../../Pages/Client/Planner/Request/Purchase/ManagePurchaseRequest';
import Request from '../../Pages/Client/Request/Request';
import ViewRequest from '../../Pages/Client/Request/ViewRequest';

import VerifyRequest from '../../Pages/Client/Qc/VerifyRequest/VerifyRequest';
import Item from '../../Pages/Client/Item/Item';
import ManageItem from '../../Pages/Client/Item/ManageItem';
import Party from '../../Pages/Client/Party/Party';
import ManageParty from '../../Pages/Client/Party/ManageParty';
import OfferList from '../../Pages/Client/MaterialCoordinator/OfferList';
import EditOffer from '../../Pages/Client/MaterialCoordinator/EditOffer';
import ViewOfferList from '../../Pages/Client/MaterialCoordinator/ViewOfferList';
import ApprovedItemList from '../../Pages/Client/MaterialCoordinator/ApprovedItemList';
import ManageIssue from '../../Pages/Client/MaterialCoordinator/ManageIssue';
import Category from '../../Pages/Client/StoreMaster/Category/Category';
import ManageCategory from '../../Pages/Client/StoreMaster/Category/ManageCategory';
import Unit from '../../Pages/Client/StoreMaster/Unit/Unit';
import ManageUnit from '../../Pages/Client/StoreMaster/Unit/ManageUnit';
import Transport from '../../Pages/Client/StoreMaster/Transport/Transport';
import ManageTransport from '../../Pages/Client/StoreMaster/Transport/ManageTransport';
import Location from '../../Pages/Client/StoreMaster/InventoryLocation/Location';
import ManageLocation from '../../Pages/Client/StoreMaster/InventoryLocation/ManageLocation';
import PartyGroup from '../../Pages/Client/StoreMaster/PartyGroup/PartyGroup';
import ManagePartyGroup from '../../Pages/Client/StoreMaster/PartyGroup/ManagePartyGroup';
import ViewQcRequest from '../../Pages/Client/Qc/VerifyRequest/ViewQcRequest';
import ViewApprovedList from '../../Pages/Client/MaterialCoordinator/ViewApprovedList';
import Profile from '../../Pages/Client/Profile/Profile';
import IssueList from '../../Pages/Client/Transaction/Issue/IssueList';
import StockReport from '../../Pages/Client/Report/Stock/StockReport';
import AuthList from '../../Pages/Client/StoreMaster/AuthPerson/AuthList';
import ManageAuth from '../../Pages/Client/StoreMaster/AuthPerson/ManageAuth';
import IssueRequest from '../../Pages/Client/Transaction/Issue/IssueRequest';
import Fitup from '../../Pages/Client/Execution/Fitup/Fitup';
import ManageFitup from '../../Pages/Client/Execution/Fitup/ManageFitup';
import WeldVisual from '../../Pages/Client/Execution/WeldVisual/WeldVisual';
import ManageWeldVisual from '../../Pages/Client/Execution/WeldVisual/ManageWeldVisual';
import ManageWpsMaster from '../../Pages/Client/Project/WpsMaster/ManageWpsMaster';
import WpsMaster from '../../Pages/Client/Project/WpsMaster/WpsMaster';
import JointType from '../../Pages/Client/Project/JointType/JointType';
import ManageJointType from '../../Pages/Client/Project/JointType/ManageJointType';
import NdtMaster from '../../Pages/Client/Project/NdtMaster/NdtMaster';
import ManageNdt from '../../Pages/Client/Project/NdtMaster/ManageNdt';
import PaintSystem from '../../Pages/Client/Project/PaintingSystem/PaintSystem';
import ManagePaintingSystem from '../../Pages/Client/Project/PaintingSystem/ManagePaintingSystem';
import Contractor from '../../Pages/Client/Project/Contractor/Contractor';
import ManageContractor from '../../Pages/Client/Project/Contractor/ManageContractor';
import ManageWelder from '../../Pages/Client/Project/WelderMaster/ManageWelder';
import WelderMaster from '../../Pages/Client/Project/WelderMaster/WelderMaster';
import ManageProcedure from '../../Pages/Client/Project/ProcedureMaster/ManageProcedure';
import ProcedureMaster from '../../Pages/Client/Project/ProcedureMaster/ProcedureMaster';
import OfferRequest from '../../Pages/Client/Request/OfferRequest';
import QcVerify from '../../Pages/Client/Qc/VerifyRequest/QcVerify';
import Ndt from '../../Pages/Client/NDT/NDT/Ndt';
import ManageNdtMaster from '../../Pages/Client/NDT/NDT/ManageNdtMaster';
import QFitup from '../../Pages/Client/QualityClearance/QFitup/QFitup';
import QWeldVisual from '../../Pages/Client/QualityClearance/QWeldVisual/QWeldVisual';
import StockReportList from '../../Pages/Client/Stock/StockReportList';
import IssueRequestList from '../../Pages/Client/Transaction/Issue/IssueRequestList';
import ManageIssueAcc from '../../Pages/Client/Transaction/Issue/ManageIssueAcc';
import UtOffer from '../../Pages/Client/NDT/UT/UtOffer';
import ManageUtOffer from '../../Pages/Client/NDT/UT/ManageUtOffer';
import RtOffer from '../../Pages/Client/NDT/RT/RtOffer';
import ManageRtOffer from '../../Pages/Client/NDT/RT/ManageRtOffer';
import MptOffer from '../../Pages/Client/NDT/MPT/MptOffer';
import ManageMptOffer from '../../Pages/Client/NDT/MPT/ManageMptOffer';
import LptOffer from '../../Pages/Client/NDT/LPT/LptOffer';
import ManageLptOffer from '../../Pages/Client/NDT/LPT/ManageLptOffer';
import UtClearance from '../../Pages/Client/NDT/UT/UtClearance';
import GetUtClearance from '../../Pages/Client/NDT/UT/GetUtClearance';
import ManageRtClearance from '../../Pages/Client/NDT/RT/ManageRtClearance';
import RtClearance from '../../Pages/Client/NDT/RT/RtClearance';
import MptClearance from '../../Pages/Client/NDT/MPT/MptClearance';
import ManageMptClearance from '../../Pages/Client/NDT/MPT/ManageMptClearance';
import LptClearance from '../../Pages/Client/NDT/LPT/LptClearance';
import ManageLptClearance from '../../Pages/Client/NDT/LPT/ManageLptClearance';
import FinalDimension from '../../Pages/Client/Execution/FinalDimension/FinalDimension';
import ManageFinalDimension from '../../Pages/Client/Execution/FinalDimension/ManageFinalDimension';
import QFinalDimension from '../../Pages/Client/QualityClearance/FinalDimension/QFinalDimension';
import InspectionSummary from '../../Pages/Client/PaintingDispatch/InspectionSummary';
import DispatchNote from '../../Pages/Client/PaintingDispatch/DispatchNote';
import ManageDispatchNote from '../../Pages/Client/PaintingDispatch/ManageDispatchNote';

import ManageSurfaceOffer from '../../Pages/Client/Paint/SurfacePrimer/ManageSurfaceOffer';
import SurfacePrimerOffer from '../../Pages/Client/Paint/SurfacePrimer/SurfacePrimerOffer';
import SurfacePrimerClearance from '../../Pages/Client/Paint/SurfacePrimer/SurfacePrimerClearance';
import MioPaint from '../../Pages/Client/Paint/Mio/MioPaint';
import ManageMioPaint from '../../Pages/Client/Paint/Mio/ManageMioPaint';
import FinalCoatPaint from '../../Pages/Client/Paint/FinalCoat/FinalCoatPaint';
import ManageFinalCoatPaint from '../../Pages/Client/Paint/FinalCoat/ManageFinalCoatPaint';
import ManageSurfaceClearance from '../../Pages/Client/Paint/SurfacePrimer/ManageSurfaceClearance';
import PaintManufacture from '../../Pages/Client/Project/PaintManufacture/PaintManufacture';
import ManagePaintManufacture from '../../Pages/Client/Project/PaintManufacture/ManagePaintManufacture';
import MioPaintClearance from '../../Pages/Client/Paint/Mio/MioPaintClearance';
import ManageMioPaintClearance from '../../Pages/Client/Paint/Mio/ManageMioPaintClearance';
import FinalCoatClearance from '../../Pages/Client/Paint/FinalCoat/FinalCoatClearance';
import ManageFinalCoatClearance from '../../Pages/Client/Paint/FinalCoat/ManageFinalCoatClearance';
import QFitUpList from '../../Pages/Client/QualityClearance/QFitup/QFitUpList';
import QWeldVisualList from '../../Pages/Client/QualityClearance/QWeldVisual/QWeldVisualList';
import ReleaseNote from '../../Pages/Client/ReleaseNote/ReleaseNote';
import QFinalDimensionList from '../../Pages/Client/QualityClearance/FinalDimension/QFinalDimensionList';

import ProjectStoreLayout from './ProjectStoreLayout';
import Packing from '../../Pages/Client/Packing/Packing';
import ManagePacking from '../../Pages/Client/Packing/ManagePacking';
import InvoiceList from '../../Pages/Client/Invoice/InvoiceList';
import ManageInvoice from '../../Pages/Client/Invoice/ManageInvoice';

import ProjectLocation from '../../Pages/Client/StoreMaster/ProjectLocation/ProjectLocation';
import ManageProjectLocation from '../../Pages/Client/StoreMaster/ProjectLocation/ManageProjectLocation';
import { useRoleAccess } from '../../Context/RoleAccessContext';
import ManageIssueAccEdit from '../../Pages/Client/Transaction/Issue/ManageIssueAccEdit';
import MultiIssueRequest from '../../Pages/Client/Multiple/Issue/MultiIssueRequest';
import MultiIssueAcceptance from '../../Pages/Client/Multiple/Issue/MultiIssueAcceptance';
import ViewMultiIssueAcc from '../../Pages/Client/Multiple/Issue/ViewMultiIssueAcc';
import ManageMultiFitup from '../../Pages/Client/Multiple/MultiExecution/MultiFitup/ManageMultiFitup';
import ManageMultiClearFitup from '../../Pages/Client/Multiple/MultiClearance/ClearanceMultiFitup/ManageMultiClearFitup';
import ViewMultiClearFitup from '../../Pages/Client/Multiple/MultiClearance/ClearanceMultiFitup/ViewMultiClearFitup';
import ManageMultiWeldVisual from '../../Pages/Client/Multiple/MultiExecution/MultiWeldVisual/ManageMultiWeldVisual';
import ManageMultiClearWeld from '../../Pages/Client/Multiple/MultiClearance/ClearanceMultiWeldVisual/ManageMultiClearWeld';
import ManageMultiFd from '../../Pages/Client/Multiple/MultiExecution/MultiFinalDimension/ManageMultiFd';
import ManageMultiClearFd from '../../Pages/Client/Multiple/MultiClearance/ClearanceMultiFd/ManageMultiClearFd';
import ManageMultiNDT from '../../Pages/Client/Multiple/MultiExecution/MultiNDT/ManageMultiNDT';
import ViewMultiUtClearance from '../../Pages/Client/Multiple/MultiNDT/MultiUT/ViewMultiUtClearance';
import ViewMultiRtClearance from '../../Pages/Client/Multiple/MultiNDT/MultiRT/ViewMultiRtClearance';
import ViewMultiMptClearance from '../../Pages/Client/Multiple/MultiNDT/MultiMPT/ViewMultiMptClearance';
import ViewMultiLptClearance from '../../Pages/Client/Multiple/MultiNDT/MultiLPT/ViewMultiLptClearance';
import MultiUtOffer from '../../Pages/Client/Multiple/MultiNDT/MultiUT/MultiUtOffer';
import ManageMultiUtOffer from '../../Pages/Client/Multiple/MultiNDT/MultiUT/ManageMultiUtOffer';
import MultiUtClearance from '../../Pages/Client/Multiple/MultiNDT/MultiUT/MultiUtClearance';
import ManageMultiUtClearance from '../../Pages/Client/Multiple/MultiNDT/MultiUT/ManageMultiUtClearance';
import MultiRtOffer from '../../Pages/Client/Multiple/MultiNDT/MultiRT/MultiRtOffer';
import ManageMultiRtOffer from '../../Pages/Client/Multiple/MultiNDT/MultiRT/ManageMultiRtOffer';
import MultiMptOffer from '../../Pages/Client/Multiple/MultiNDT/MultiMPT/MultiMptOffer';
import ManageMultiMptOffer from '../../Pages/Client/Multiple/MultiNDT/MultiMPT/ManageMultiMptOffer';
import MultiLptOffer from '../../Pages/Client/Multiple/MultiNDT/MultiLPT/MultiLptOffer';
import ManageMultiLptOffer from '../../Pages/Client/Multiple/MultiNDT/MultiLPT/ManageMultiLptOffer';
import MultiMptClearance from '../../Pages/Client/Multiple/MultiNDT/MultiMPT/MultiMptClearance';
import ManageMultiMptClearance from '../../Pages/Client/Multiple/MultiNDT/MultiMPT/ManageMultiMptClearance';
import MultiLptClearance from '../../Pages/Client/Multiple/MultiNDT/MultiLPT/MultiLptClearance';
import ManageMultiLptClearance from '../../Pages/Client/Multiple/MultiNDT/MultiLPT/ManageMultiLptClearance';
import MultiRtClearance from '../../Pages/Client/Multiple/MultiNDT/MultiRT/MultiRtClearance';
import ManageMultiRtClearance from '../../Pages/Client/Multiple/MultiNDT/MultiRT/ManageMultiRtClearance';
import ManageQFinalDimension from '../../Pages/Client/QualityClearance/FinalDimension/ManageQFinalDimension';
import ViewMultiSummary from '../../Pages/Client/Multiple/InsSummary/ViewMultiSummary';
import ViewGenMultiSummary from '../../Pages/Client/Multiple/InsSummary/ViewGenMultiSummary';
import ManageDispatch from '../../Pages/Client/Multiple/DispatchNote/ManageDispatch';
import ViewDispatch from '../../Pages/Client/Multiple/DispatchNote/ViewDispatch';
import MultiManageSurface from '../../Pages/Client/Multiple/Painting/Surface/MultiManageSurface';
import MultiSurface from '../../Pages/Client/Multiple/Painting/Surface/MultiSurface';
import MultiSurfaceClearance from '../../Pages/Client/Multiple/Painting/Surface/MultiSurfaceClearance';
import MultiManageSurfaceClearance from '../../Pages/Client/Multiple/Painting/Surface/MultiManageSurfaceClearance';
import MultiViewSurfaceClearanc from '../../Pages/Client/Multiple/Painting/Surface/MultiViewSurfaceClearanc';
import MultiMio from '../../Pages/Client/Multiple/Painting/Mio/MultiMio';
import MultiMioClearance from '../../Pages/Client/Multiple/Painting/Mio/MultiMioClearance';
import MultiManageMioClearance from '../../Pages/Client/Multiple/Painting/Mio/MultiManageMioClearance';
import MultiManageMio from '../../Pages/Client/Multiple/Painting/Mio/MultiManageMio';
import MultiViewMioClearance from '../../Pages/Client/Multiple/Painting/Mio/MultiViewMioClearance';
import MultiFinalCoat from '../../Pages/Client/Multiple/Painting/MultiFinalCoat/MultiFinalCoat';
import ManageMultiFinalCoat from '../../Pages/Client/Multiple/Painting/MultiFinalCoat/ManageMultiFinalCoat';
import MultiFinalCoatClearance from '../../Pages/Client/Multiple/Painting/MultiFinalCoat/MultiFinalCoatClearance';
import ManageMultiFinalCoatClearance from '../../Pages/Client/Multiple/Painting/MultiFinalCoat/ManageMultiFinalCoatClearance';
import MultiViewFinalCoatClearance from '../../Pages/Client/Multiple/Painting/MultiFinalCoat/MultiViewFinalCoatClearance';
import MultiReleaseNote from '../../Pages/Client/Multiple/MultiReleaseNote/MultiReleaseNote';
import ViewGenReleaseNote from '../../Pages/Client/Multiple/MultiReleaseNote/ViewGenReleaseNote';
import ViewReleaseNote from '../../Pages/Client/Multiple/MultiReleaseNote/ViewReleaseNote';
import MultiPacking from '../../Pages/Client/Multiple/MultiPacking/MultiPacking';
import MultiManagePacking from '../../Pages/Client/Multiple/MultiPacking/MultiManagePacking';
import MultiViewPacking from '../../Pages/Client/Multiple/MultiPacking/MultiViewPacking';
import MultiInvoice from '../../Pages/Client/Multiple/Invoice/MultiInvoice';
import ManageMultiInvoice from '../../Pages/Client/Multiple/Invoice/ManageMultiInvoice';
import NotesRestriction from '../../Pages/Client/Notes/NotesRestriction';
import ReusableStock from '../../Pages/Client/Stock/ReusableStock';
import AddDrawingForm from '../../Pages/Client/Multiple/MultiPacking/CommanComponents/AddDrawingForm';
// import ManageClearanceFitup from '../../Pages/Client/Multiple/MultiClearance/ClearanceMultiFitup/ManageClearanceFitup';

import MaterialIssueAcceptanceMasterData from '../../Pages/Client/Transaction/Issue/MaterialIssueMasterData';
import ManageFimPacking from '../../Pages/Client/FIM/ManageFimPacking';
import FimPackingList from '../../Pages/Client/FIM/FimPackingList';
import ViewFIM from '../../Pages/Client/FIM/ViewFIM';
import FimPackingVerification from '../../Pages/Client/FIM/FimPackingVerification';
import PartyLayout from './ClientStoreLayout';

const ClientRoutes = () => {

    // const hasAccess = (item) => menuAccessConfig[item]?.includes(localStorage.getItem('ERP_ROLE'));
    const { hasAccess } = useRoleAccess();

    return (
        <>
            <Routes>
                
                <Route path='/party/project-store' element={<PartyLayout />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='edit-profile' element={<Profile />} />

                    {/* Material Recving */}
                    <Route path='material-receiving' element={<VerifyRequest />} />
                    <Route path='view-qc-request' element={<ViewQcRequest />} />
                    <Route path='manage-verify-request' element={<QcVerify />} />
                              
                    {/* Fim PAcking */}
                    <Route path='manage-fim-packing' element={<ManageFimPacking />} />
                    <Route path='fim-packing-verification' element={<FimPackingVerification />} />
                    <Route path='fim-packing' element={<FimPackingList />} />
                    <Route path='fim-packing-details' element={<ViewFIM />} />
                    

                    {/* NDT MASTER */}
                    <Route path='ndt-master-management' element={<NdtMaster />} />
                    <Route path='manage-ndt-master' element={<ManageNdt />} />
                        
                    
                  {/* FITUP, Weld Visual Final Deminsion */}

                    <Route path='fitup-acceptance' element={<QFitUpList />} />
                    {/* <Route path='quality-clearance-fitup-management' element={<QFitup />} /> */}
                    <Route path='quality-clearance-fitup-management' element={<ManageMultiClearFitup />} />
                    <Route path='view-quality-clearance-fitup' element={<ViewMultiClearFitup />} />

                    <Route path='weld-visual-acceptance' element={<QWeldVisualList />} />
                    {/* <Route path='quality-clearance-weld-visual-management' element={<QWeldVisual />} /> */}
                    <Route path='quality-clearance-weld-visual-management' element={<ManageMultiClearWeld />} />

                    {/* <Route path='quality-clearance-final-dimension-management' element={<QFinalDimension />} /> */}
                    <Route path='final-dimension-acceptance' element={<QFinalDimensionList />} />
                    <Route path='quality-clearance-final-dimension-management' element={<ManageMultiClearFd />} />
                       

                    <Route path='ndt-management' element={<Ndt />} />
                    <Route path='manage-ndt' element={<ManageMultiNDT />} />

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
                    <Route path='view-ut-clearance-summary' element={<ViewMultiUtClearance />} />
                    <Route path='view-rt-clearance-summary' element={<ViewMultiRtClearance />} />
                    <Route path='view-mpt-clearance-summary' element={<ViewMultiMptClearance />} />
                    <Route path='view-lpt-clearance-summary' element={<ViewMultiLptClearance />} />
                    <Route path='inspection-summary-management' element={<InspectionSummary />} />
                    <Route path='view-inspection-summary' element={<ViewMultiSummary />} />
                    <Route path='view-geninspection-summary' element={<ViewGenMultiSummary />} />

                    {/* Painting System */}
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

                    {/* {hasAccess('IRN_AFTER') && ( */}
                    {/* old */}
                    {/* <Route path='release-note-management' element={<ReleaseNote />} />
                    <Route path='management-release-note' element={<ViewReleaseNote />} /> */}

                    {/* new */}
                    <Route path='release-note-management' element={<MultiReleaseNote />} />
                    <Route path='view-release-note' element={<ViewReleaseNote />} />
                    <Route path='view-Genrelease-note' element={<ViewGenReleaseNote />} />
                    {/* )} */}

                    <Route path='*' element={<Navigate to='dashboard' />} />
                </Route>
            </Routes>
        </>
    )
}

export default ClientRoutes;