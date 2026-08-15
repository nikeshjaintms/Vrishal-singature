import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../../Pages/Piping/Dashboard/Dashboard';
import Drawing from '../../Pages/Piping/Planner/Drawing/Drawing';
import ViewDrawing from '../../Pages/Piping/Planner/Drawing/ViewDrawing';
import DrawingMaterialMaster from '../../Pages/Piping/Planner/Drawing/DrawingMaterialMaster';
import DrawingJointMaster from '../../Pages/Piping/Planner/Drawing/DrawingJointMaster';

import ManageDrawing from '../../Pages/Piping/Planner/Drawing/ManageDrawing';
import PurchaseRequest from '../../Pages/Piping/Planner/Request/Purchase/PurchaseRequest';
import ManagePurchaseRequest from '../../Pages/Piping/Planner/Request/Purchase/ManagePurchaseRequest';
import Request from '../../Pages/Piping/Request/Request';
import ViewRequest from '../../Pages/Piping/Request/ViewRequest';


import VerifyRequest from '../../Pages/Piping/Qc/VerifyRequest/VerifyRequest';
import Item from '../../Pages/Piping/Item/Item';
import ManageItem from '../../Pages/Piping/Item/ManageItem';
import Party from '../../Pages/Piping/Party/Party';
import ManageParty from '../../Pages/Piping/Party/ManageParty';
import OfferList from '../../Pages/Piping/MaterialCoordinator/OfferList';
import EditOffer from '../../Pages/Piping/MaterialCoordinator/EditOffer';
import ViewOfferList from '../../Pages/Piping/MaterialCoordinator/ViewOfferList';
import ApprovedItemList from '../../Pages/Piping/MaterialCoordinator/ApprovedItemList';
import ManageIssue from '../../Pages/Piping/MaterialCoordinator/ManageIssue';
import Category from '../../Pages/Piping/StoreMaster/Category/Category';
import ManageCategory from '../../Pages/Piping/StoreMaster/Category/ManageCategory';
import Unit from '../../Pages/Piping/StoreMaster/Unit/Unit';
import ManageUnit from '../../Pages/Piping/StoreMaster/Unit/ManageUnit';
import Thickness from '../../Pages/Piping/StoreMaster/Thickness/Thickness';
import ManageThickness from '../../Pages/Piping/StoreMaster/Thickness/ManageThickness';
import Size from '../../Pages/Piping/StoreMaster/Size/Size';
import ManageSize from '../../Pages/Piping/StoreMaster/Size/ManageSize';
import Transport from '../../Pages/Piping/StoreMaster/Transport/Transport';
import ManageTransport from '../../Pages/Piping/StoreMaster/Transport/ManageTransport';
import Location from '../../Pages/Piping/StoreMaster/InventoryLocation/Location';
import ManageLocation from '../../Pages/Piping/StoreMaster/InventoryLocation/ManageLocation';
import PartyGroup from '../../Pages/Piping/StoreMaster/PartyGroup/PartyGroup';
import ManagePartyGroup from '../../Pages/Piping/StoreMaster/PartyGroup/ManagePartyGroup';
import ViewQcRequest from '../../Pages/Piping/Qc/VerifyRequest/ViewQcRequest';
import ViewApprovedList from '../../Pages/Piping/MaterialCoordinator/ViewApprovedList';
import Profile from '../../Pages/Piping/Profile/Profile';
import IssueList from '../../Pages/Piping/Transaction/Issue/IssueList';
import StockIssueList from '../../Pages/Piping/Transaction/Issue/StockIssueList';
import IssueReturnList from '../../Pages/Piping/Transaction/Issue/IssueReturnList';
import StockReport from '../../Pages/Piping/Report/Stock/StockReport';
import AuthList from '../../Pages/Piping/StoreMaster/AuthPerson/AuthList';
import ManageAuth from '../../Pages/Piping/StoreMaster/AuthPerson/ManageAuth';
import IssueRequest from '../../Pages/Piping/Transaction/Issue/IssueRequest';
import Fitup from '../../Pages/Piping/Execution/Fitup/Fitup';
import ViewFitupOfferPiping from '../../Pages/Piping/Execution/Fitup/ViewFitupOfferPiping';
import ViewRootDptOfferPiping from '../../Pages/Piping/Execution/DPT/ViewRootDptOfferPiping';
import ViewWeldVisualOfferPiping from '../../Pages/Piping/Execution/WeldVisual/ViewWeldVisualOfferPiping';
import ViewFinalDimensionOfferPiping from '../../Pages/Piping/Execution/FinalDimension/ViewFinalDimensionOfferPiping';

import Dpt from '../../Pages/Piping/Execution/DPT/Dpt';

import ManageFitup from '../../Pages/Piping/Execution/Fitup/ManageFitup';
import WeldVisual from '../../Pages/Piping/Execution/WeldVisual/WeldVisual';
import ManageWeldVisual from '../../Pages/Piping/Execution/WeldVisual/ManageWeldVisual';
import ManageWpsMaster from '../../Pages/Piping/Project/WpsMaster/ManageWpsMaster';
import WpsMaster from '../../Pages/Piping/Project/WpsMaster/WpsMaster';
import JointType from '../../Pages/Piping/Project/JointType/JointType';
import ManageJointType from '../../Pages/Piping/Project/JointType/ManageJointType';
import Area from '../../Pages/Piping/Area/AreaList';
import PipingMaterialSpecification from '../../Pages/Piping/PipingMaterialSpecification/PipingMaterialSpecificationList';
import PipingClass from '../../Pages/Piping/Project/PipingClass/PipingClass';
import ManagePipingClass from '../../Pages/Piping/Project/PipingClass/ManagePipingClass';
import PwhtMaster from '../../Pages/Piping/Project/PwhtMaster/PwhtMaster';
import ManagePwht from '../../Pages/Piping/Project/PwhtMaster/ManagePwht';
import HardnessMaster from '../../Pages/Piping/Project/HardnessMaster/HardnessMaster';
import ManageHardness from '../../Pages/Piping/Project/HardnessMaster/ManageHardness';
import NDTContractorMaster from '../../Pages/Piping/Project/NdtContractor/NdtContractor';
import ManageNDTContractorMaster from '../../Pages/Piping/Project/NdtContractor/ManageNdtContractor';
import NdtMaster from '../../Pages/Piping/Project/NdtMaster/NdtMaster';
import ManageNdt from '../../Pages/Piping/Project/NdtMaster/ManageNdt';
import PaintRequirement from '../../Pages/Piping/Project/PaintingRequirement/PaintingRequirement';
import ManagePaintingRequirement from '../../Pages/Piping/Project/PaintingRequirement/ManagePaintingRequirement';
import PaintSystem from '../../Pages/Piping/Project/PaintingSystem/PaintSystem';
import ManagePaintingSystem from '../../Pages/Piping/Project/PaintingSystem/ManagePaintingSystem';
import Contractor from '../../Pages/Piping/Project/Contractor/Contractor';
import ManageContractor from '../../Pages/Piping/Project/Contractor/ManageContractor';
import ManageWelder from '../../Pages/Piping/Project/WelderMaster/ManageWelder';
import WelderMaster from '../../Pages/Piping/Project/WelderMaster/WelderMaster';
import ManageProcedure from '../../Pages/Piping/Project/ProcedureMaster/ManageProcedure';
import ProcedureMaster from '../../Pages/Piping/Project/ProcedureMaster/ProcedureMaster';
import OfferRequest from '../../Pages/Piping/Request/OfferRequest';
import QcVerify from '../../Pages/Piping/Qc/VerifyRequest/QcVerify';
import Ndt from '../../Pages/Piping/NDT/NDT/Ndt';
import NdtSummary from '../../Pages/Piping/NDT/NDT/NdtSummary';
import ManageNdtMaster from '../../Pages/Piping/NDT/NDT/ManageNdtMaster';
import QFitup from '../../Pages/Piping/QualityClearance/QFitup/QFitup';
import QWeldVisual from '../../Pages/Piping/QualityClearance/QWeldVisual/QWeldVisual';
import StockReportList from '../../Pages/Piping/Stock/StockReportList';
import IssueRequestList from '../../Pages/Piping/Transaction/Issue/IssueRequestList';
import IssueReturnNote from '../../Pages/Piping/Transaction/Issue/IssueReturnNote';
import StockWiseIssueRequestList from '../../Pages/Piping/Transaction/Issue/StockIssueRequestList';
import ManageIssueAcc from '../../Pages/Piping/Transaction/Issue/ManageIssueAcc';
import UtOffer from '../../Pages/Piping/NDT/UT/UtOffer';
import ManageUtOffer from '../../Pages/Piping/NDT/UT/ManageUtOffer';
import RtOffer from '../../Pages/Piping/NDT/RT/RtOffer';
import ManageRtOffer from '../../Pages/Piping/NDT/RT/ManageRtOffer';
import MptOffer from '../../Pages/Piping/NDT/MPT/MptOffer';
import ManageMptOffer from '../../Pages/Piping/NDT/MPT/ManageMptOffer';
import LptOffer from '../../Pages/Piping/NDT/LPT/LptOffer';
import ManageLptOffer from '../../Pages/Piping/NDT/LPT/ManageLptOffer';
import UtClearance from '../../Pages/Piping/NDT/UT/UtClearance';
import GetUtClearance from '../../Pages/Piping/NDT/UT/GetUtClearance';
import ManageRtClearance from '../../Pages/Piping/NDT/RT/ManageRtClearance';
import RtClearance from '../../Pages/Piping/NDT/RT/RtClearance';
import MptClearance from '../../Pages/Piping/NDT/MPT/MptClearance';
import ManageMptClearance from '../../Pages/Piping/NDT/MPT/ManageMptClearance';
import LptClearance from '../../Pages/Piping/NDT/LPT/LptClearance';
import ManageLptClearance from '../../Pages/Piping/NDT/LPT/ManageLptClearance';
import FinalDimension from '../../Pages/Piping/Execution/FinalDimension/FinalDimension';
import ManageFinalDimension from '../../Pages/Piping/Execution/FinalDimension/ManageFinalDimension';
import QFinalDimension from '../../Pages/Piping/QualityClearance/FinalDimension/QFinalDimension';
import InspectionSummary from '../../Pages/Piping/PaintingDispatch/InspectionSummary';
import DispatchNote from '../../Pages/Piping/PaintingDispatch/DispatchNote';
import StockDispatchNote from '../../Pages/Piping/PaintingStockDispatch/StockDispatchNote';

import ManageDispatchNote from '../../Pages/Piping/PaintingDispatch/ManageDispatchNote';
import ManageStockDispatchNote from '../../Pages/Piping/PaintingStockDispatch/ManageStockDispatchNote';

import ManageSurfaceOffer from '../../Pages/Piping/Paint/SurfacePrimer/ManageSurfaceOffer';
import SurfacePrimerOffer from '../../Pages/Piping/Paint/SurfacePrimer/SurfacePrimerOffer';
import SurfacePrimerClearance from '../../Pages/Piping/Paint/SurfacePrimer/SurfacePrimerClearance';
import MioPaint from '../../Pages/Piping/Paint/Mio/MioPaint';
import ManageMioPaint from '../../Pages/Piping/Paint/Mio/ManageMioPaint';
import FinalCoatPaint from '../../Pages/Piping/Paint/FinalCoat/FinalCoatPaint';
import ManageFinalCoatPaint from '../../Pages/Piping/Paint/FinalCoat/ManageFinalCoatPaint';
import ManageSurfaceClearance from '../../Pages/Piping/Paint/SurfacePrimer/ManageSurfaceClearance';
import PaintManufacture from '../../Pages/Piping/Project/PaintManufacture/PaintManufacture';
import ManagePaintManufacture from '../../Pages/Piping/Project/PaintManufacture/ManagePaintManufacture';
import MioPaintClearance from '../../Pages/Piping/Paint/Mio/MioPaintClearance';
import ManageMioPaintClearance from '../../Pages/Piping/Paint/Mio/ManageMioPaintClearance';
import FinalCoatClearance from '../../Pages/Piping/Paint/FinalCoat/FinalCoatClearance';
import ManageFinalCoatClearance from '../../Pages/Piping/Paint/FinalCoat/ManageFinalCoatClearance';
import QFitUpList from '../../Pages/Piping/QualityClearance/QFitup/QFitUpList';
import QDptList from '../../Pages/Piping/QualityClearance/QDpt/QDptList';

import QWeldVisualList from '../../Pages/Piping/QualityClearance/QWeldVisual/QWeldVisualList';
import ReleaseNote from '../../Pages/Piping/ReleaseNote/ReleaseNote';
import QFinalDimensionList from '../../Pages/Piping/QualityClearance/FinalDimension/QFinalDimensionList';

import ProjectStoreLayout from './ProjectStoreLayout';
import Packing from '../../Pages/Piping/Packing/Packing';
import ManagePacking from '../../Pages/Piping/Packing/ManagePacking';
import InvoiceList from '../../Pages/Piping/Invoice/InvoiceList';
import ManageInvoice from '../../Pages/Piping/Invoice/ManageInvoice';
import DPR from '../../Pages/Piping/DPR/DPR';
import ProjectFrontAvailabilitySummary from '../../Pages/Piping/ProjectFrontAvailabilitySummary/ProjectFrontAvailabilitySummary';
import ProjectLocation from '../../Pages/Piping/StoreMaster/ProjectLocation/ProjectLocation';
import ManageProjectLocation from '../../Pages/Piping/StoreMaster/ProjectLocation/ManageProjectLocation';
import { useRoleAccess } from '../../Context/RoleAccessContext';
import ManageIssueAccEdit from '../../Pages/Piping/Transaction/Issue/ManageIssueAccEdit';
import MultiIssueRequest from '../../Pages/Piping/Multiple/Issue/MultiIssueRequest';
import MultiIssueReturn from '../../Pages/Piping/Multiple/Issue/MultiIssueReturn';
import StockWiseIssueRequest from '../../Pages/Piping/Multiple/Issue/StockWiseIssueRequest';
import MultiIssueAcceptance from '../../Pages/Piping/Multiple/Issue/MultiIssueAcceptance';
import ViewMultiIssueAcc from '../../Pages/Piping/Multiple/Issue/ViewMultiIssueAcc';
import StockWiseIssueAcceptance from '../../Pages/Piping/Multiple/Issue/StockWiseIssueAcceptance';
import MultiIssueReturnAcceptance from '../../Pages/Piping/Multiple/Issue/IssueReturnAcceptance';
import MaterialIssueReturnSummary from '../../Pages/Piping/Multiple/Issue/MaterialIssueReturnSummary';
import ViewStockIssueAcc from '../../Pages/Piping/Multiple/Issue/ViewStockIssueAcc';
import ViewIssueReturnAcc from '../../Pages/Piping/Multiple/Issue/ViewIssueReturnAcc';

import ManageMultiFitup from '../../Pages/Piping/Multiple/MultiExecution/MultiFitup/ManageMultiFitup';
import ManageMultiDpt from '../../Pages/Piping/Multiple/MultiExecution/MultiDPT/MultiDptOffer';

import ViewFitup from '../../Pages/Piping/Multiple/MultiExecution/MultiFitup/ViewFitUp';
import ManageMultiClearFitup from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiFitup/ManageMultiClearFitup';
import ManageMultiClearDpt from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiDpt/ManageMultiClearDpt';

import ViewMultiClearFitup from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiFitup/ViewMultiClearFitup';
import ViewMultiClearDpt from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiDpt/ViewMultiClearDpt';

import ManageMultiWeldVisual from '../../Pages/Piping/Multiple/MultiExecution/MultiWeldVisual/ManageMultiWeldVisual';
import ManageMultiClearWeld from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiWeldVisual/ManageMultiClearWeld';
import ManageMultiFd from '../../Pages/Piping/Multiple/MultiExecution/MultiFinalDimension/ManageMultiFd';
import ManageMultiClearFd from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiFd/ManageMultiClearFd';
import ManageMultiNDT from '../../Pages/Piping/Multiple/MultiExecution/MultiNDT/ManageMultiNDT';
import MultiUtOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiUT/MultiUtOffer';
import ManageMultiUtOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiUT/ManageMultiUtOffer';
import MultiUtClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiUT/MultiUtClearance';
import ManageMultiUtClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiUT/ManageMultiUtClearance';
import MultiRtOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiRT/MultiRtOffer';
import ManageMultiRtOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiRT/ManageMultiRtOffer';

import MultiPWHTOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiPWHT/MultiPWHTOffer';
import ManageMultiPWHTOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiPWHT/ManageMultiPWHTOffer';
import MultiPWHTClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiPWHT/MultiPWHTClearance';

import ManageMultiPWHTClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiPWHT/ManageMultiPWHTClearance';

import MultiFTOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiFT/MultiFTOffer';
import ManageMultiFTOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiFT/ManageMultiFTOffer';
import MultiFTClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiFT/MultiFTClearance';
import ManageMultiFTClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiFT/ManageMultiFTClearance';

import MultiMptOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiMPT/MultiMptOffer';
import ManageMultiMptOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiMPT/ManageMultiMptOffer';
import MultiLptOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiLPT/MultiLptOffer';
import ManageMultiLptOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiLPT/ManageMultiLptOffer';
import MultiHtOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiHT/MultiHtOffer';
import ManageMultiHtOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiHT/ManageMultiHtOffer';

import MultiPmiOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiPMI/MultiPmiOffer';
import ManageMultiPmiOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiPMI/ManageMultiPmiOffer';

import MultiPicklingPassivationOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiPicklingPassivation/MultiPicklingPassivationOffer';
import ManageMultiPicklingPassivationOffer from '../../Pages/Piping/Multiple/MultiNDT/MultiPicklingPassivation/ManageMultiPicklingPassivationOffer';

import MultiMptClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiMPT/MultiMptClearance';
import ManageMultiMptClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiMPT/ManageMultiMptClearance';
import MultiLptClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiLPT/MultiLptClearance';
import ManageMultiLptClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiLPT/ManageMultiLptClearance';

import MultiHtClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiHT/MultiHtClearance';
import ManageMultiHtClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiHT/ManageMultiHtClearance';

import MultiPmiClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiPMI/MultiPmiClearance';
import ManageMultiPmiClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiPMI/ManageMultiPmiClearance';

import MultiPicklingPassivationClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiPicklingPassivation/MultiPicklingPassivationClearance';
import ManageMultiPicklingPassivationClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiPicklingPassivation/ManageMultiPicklingPassivationClearance';

import MultiRtClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiRT/MultiRtClearance';
import ManageMultiRtClearance from '../../Pages/Piping/Multiple/MultiNDT/MultiRT/ManageMultiRtClearance';

import ManageQFinalDimension from '../../Pages/Piping/QualityClearance/FinalDimension/ManageQFinalDimension';
import ViewMultiSummary from '../../Pages/Piping/Multiple/InsSummary/ViewMultiSummary';
import ViewGenMultiSummary from '../../Pages/Piping/Multiple/InsSummary/ViewGenMultiSummary';
import ManageDispatch from '../../Pages/Piping/Multiple/DispatchNote/ManageDispatch';
import ViewDispatch from '../../Pages/Piping/Multiple/DispatchNote/ViewDispatch';
import ManageStockDispatch from '../../Pages/Piping/Multiple/StockDispatchNote/ManageStockDispatch';
import ViewStockDispatch from '../../Pages/Piping/Multiple/StockDispatchNote/ViewStockDispatch';
import MultiManageSurface from '../../Pages/Piping/Multiple/Painting/Surface/MultiManageSurface';
import MultiSurface from '../../Pages/Piping/Multiple/Painting/Surface/MultiSurface';
import MultiSurfaceClearance from '../../Pages/Piping/Multiple/Painting/Surface/MultiSurfaceClearance';
import MultiManageSurfaceClearance from '../../Pages/Piping/Multiple/Painting/Surface/MultiManageSurfaceClearance';
import MultiViewSurfaceClearanc from '../../Pages/Piping/Multiple/Painting/Surface/MultiViewSurfaceClearanc';
import MultiMio from '../../Pages/Piping/Multiple/Painting/Mio/MultiMio';
import MultiMioClearance from '../../Pages/Piping/Multiple/Painting/Mio/MultiMioClearance';
import MultiManageMioClearance from '../../Pages/Piping/Multiple/Painting/Mio/MultiManageMioClearance';
import MultiManageMio from '../../Pages/Piping/Multiple/Painting/Mio/MultiManageMio';
import MultiViewMioClearance from '../../Pages/Piping/Multiple/Painting/Mio/MultiViewMioClearance';
import MultiFinalCoat from '../../Pages/Piping/Multiple/Painting/MultiFinalCoat/MultiFinalCoat';
import ManageMultiFinalCoat from '../../Pages/Piping/Multiple/Painting/MultiFinalCoat/ManageMultiFinalCoat';
import MultiFinalCoatClearance from '../../Pages/Piping/Multiple/Painting/MultiFinalCoat/MultiFinalCoatClearance';
import ManageMultiFinalCoatClearance from '../../Pages/Piping/Multiple/Painting/MultiFinalCoat/ManageMultiFinalCoatClearance';
import MultiViewFinalCoatClearance from '../../Pages/Piping/Multiple/Painting/MultiFinalCoat/MultiViewFinalCoatClearance';
import FinalCoatShadeCard from '../../Pages/Piping/Project/FinalCoatShade/FinalCoatShade';
import ManageFinalCoatShadeCard from '../../Pages/Piping/Project/FinalCoatShade/ManageFinalCoatShade';

import MultiManageStockSurface from '../../Pages/Piping/Multiple/StockPainting/StockSurface/MultiManageStockSurface';
import MultiStockSurface from '../../Pages/Piping/Multiple/StockPainting/StockSurface/MultiStockSurface';
import MultiStockSurfaceClearance from '../../Pages/Piping/Multiple/StockPainting/StockSurface/MultiStockSurfaceClearance';
import MultiManageStockSurfaceClearance from '../../Pages/Piping/Multiple/StockPainting/StockSurface/MultiManageStockSurfaceClearance';
import MultiViewStockSurfaceClearanc from '../../Pages/Piping/Multiple/StockPainting/StockSurface/MultiViewStockSurfaceClearanc';
import MultiStockMio from '../../Pages/Piping/Multiple/StockPainting/StockMio/MultiStockMio';
import MultiStockMioClearance from '../../Pages/Piping/Multiple/StockPainting/StockMio/MultiStockMioClearance';
import MultiManageStockMioClearance from '../../Pages/Piping/Multiple/StockPainting/StockMio/MultiManageStockMioClearance';
import MultiManageStockMio from '../../Pages/Piping/Multiple/StockPainting/StockMio/MultiManageStockMio';
import MultiViewStockMioClearance from '../../Pages/Piping/Multiple/StockPainting/StockMio/MultiViewStockMioClearance';
import MultiStockFinalCoat from '../../Pages/Piping/Multiple/StockPainting/MultiStockFinalCoat/MultiStockFinalCoat';
import ManageMultiStockFinalCoat from '../../Pages/Piping/Multiple/StockPainting/MultiStockFinalCoat/ManageMultiStockFinalCoat';
import MultiStockFinalCoatClearance from '../../Pages/Piping/Multiple/StockPainting/MultiStockFinalCoat/MultiStockFinalCoatClearance';
import ManageMultiStockFinalCoatClearance from '../../Pages/Piping/Multiple/StockPainting/MultiStockFinalCoat/ManageMultiStockFinalCoatClearance';
import MultiViewStockFinalCoatClearance from '../../Pages/Piping/Multiple/StockPainting/MultiStockFinalCoat/MultiViewStockFinalCoatClearance';


import MultiReleaseNote from '../../Pages/Piping/Multiple/MultiReleaseNote/MultiReleaseNote';
import ViewGenReleaseNote from '../../Pages/Piping/Multiple/MultiReleaseNote/ViewGenReleaseNote';
import ViewReleaseNote from '../../Pages/Piping/Multiple/MultiReleaseNote/ViewReleaseNote';

import MultiStockReleaseNote from '../../Pages/Piping/Multiple/MultiStockReleaseNote/MultiStockReleaseNote';
import ViewStockGenReleaseNote from '../../Pages/Piping/Multiple/MultiStockReleaseNote/ViewStockGenReleaseNote';
import ViewStockReleaseNote from '../../Pages/Piping/Multiple/MultiStockReleaseNote/ViewStockReleaseNote';

import MultiLineHistory from '../../Pages/Piping/Multiple/MultiLineHistory/MultiLineHistory';
import ViewGenLineHistory from '../../Pages/Piping/Multiple/MultiLineHistory/ViewGenLineHistory';
import ViewLineHistory from '../../Pages/Piping/Multiple/MultiLineHistory/ViewLineHistory';
import MultiPacking from '../../Pages/Piping/Multiple/MultiPacking/MultiPacking';
import MultiManagePacking from '../../Pages/Piping/Multiple/MultiPacking/MultiManagePacking';
import MultiViewPacking from '../../Pages/Piping/Multiple/MultiPacking/MultiViewPacking';
import MultiPackingSummary from '../../Pages/Piping/Multiple/MultiPacking/MultiPackingSummary';
import MultiStockPacking from '../../Pages/Piping/Multiple/MultiStockPacking/MultiStockPacking';
import MultiManageStockPacking from '../../Pages/Piping/Multiple/MultiStockPacking/MultiManageStockPacking';
import MultiViewStockPacking from '../../Pages/Piping/Multiple/MultiStockPacking/MultiViewStockPacking';
import MultiStockPackingSummary from '../../Pages/Piping/Multiple/MultiStockPacking/MultiStockPackingSummary';
import MultiInvoice from '../../Pages/Piping/Multiple/Invoice/MultiInvoice';
import ManageMultiInvoice from '../../Pages/Piping/Multiple/Invoice/ManageMultiInvoice';
import NotesRestriction from '../../Pages/Piping/Notes/NotesRestriction';
import ReusableStock from '../../Pages/Piping/Stock/ReusableStock';
import AddDrawingForm from '../../Pages/Piping/Multiple/MultiPacking/CommanComponents/AddDrawingForm';
// import ManageClearanceFitup from '../../Pages/Piping/Multiple/MultiClearance/ClearanceMultiFitup/ManageClearanceFitup';
import DMR from '../../Pages/Piping/DMR/DMR';
import DMRCategories from '../../Pages/Piping/DMRCategories/DMRCategories';
import MaterialIssueAcceptanceMasterData from '../../Pages/Piping/Transaction/Issue/MaterialIssueMasterData';
import StockIssueAcceptanceMasterData from '../../Pages/Piping/Transaction/Issue/StockIssueMasterData';
import ManageFimPacking from '../../Pages/Piping/FIM/ManageFimPacking';
import FimPackingList from '../../Pages/Piping/FIM/FimPackingList';
import ViewFIM from '../../Pages/Piping/FIM/ViewFIM';
import FimPackingVerification from '../../Pages/Piping/FIM/FimPackingVerification';
import MaterialControl from '../../Pages/Piping/MaterialControl/MaterialControl'
import ManageMaterialControl from '../../Pages/Piping/MaterialControl/ManageMaterialControl'
import ProcurementRequest from '../../Pages/Piping/ProcurementRequest/ProcurementRequest'
import ManageProcurementRequest from '../../Pages/Piping/ProcurementRequest/ManageProcurementRequest'
import InquiryforSupply from '../../Pages/Piping/InquiryforSupply/InquiryforSupply'
import ManageInquiryforSupply from '../../Pages/Piping/InquiryforSupply/ManageInquiryforSupply'
import OrderPlacement from '../../Pages/Piping/OrderPlacement/OrderPlacement'
import ManageOrderPlacement from '../../Pages/Piping/OrderPlacement/ManageOrderPlacement'
// import ManageFimPacking from '../../Pages/Piping/FIM/ManageFimPacking';
// import FimPackingList from '../../Pages/Piping/FIM/FimPackingList';
// import ViewFIM from '../../Pages/Piping/FIM/ViewFIM';
// import FimPackingVerification from '../../Pages/Piping/FIM/FimPackingVerification';
import PressureTest from '../../Pages/Piping/PressureTest/PressureTest'
import ManagePressureTest from '../../Pages/Piping/PressureTest/ManagePressureTest'
import ViewPressureTest from '../../Pages/Piping/PressureTest/ViewPressureTest'

import RtLotBook from '../../Pages/Piping/NDT/RT_LOT_BOOK/RtLotBook';
import ManageRtLotBook from '../../Pages/Piping/NDT/RT_LOT_BOOK/ManageRtLotBook';
import ManageLptLotBook from '../../Pages/Piping/NDT/LPT_LOT_BOOK/ManageLptLotBook';

import ManageMptLotBook from '../../Pages/Piping/NDT/MPT_LOT_BOOK/ManageMptLotBook';

import LptLotBook from '../../Pages/Piping/NDT/LPT_LOT_BOOK/LptLotBook';
import MptLotBook from '../../Pages/Piping/NDT/MPT_LOT_BOOK/MptLotBook';

import SpoolBreakUpSummary from '../../Pages/Piping/SpoolBreakUpSummary/SpoolBreakUpSummary';
import ManageSpoolBreakUp from '../../Pages/Piping/SpoolBreakUpSummary/ManageSpoolBreakUp';
import ViewSpoolBreakUpSummary from '../../Pages/Piping/SpoolBreakUpSummary/ViewSpoolBreakUpSummary';
import FimProcuementRejectedSummary from '../../Pages/Piping/FimProcuementRejectedSummary/FimProcuementRejectedSummary';
import DrawingAreaInchMeterMaster from '../../Pages/Piping/Planner/Drawing/DrawingAreaInchMeter';
import NDTPercentage from '../../Pages/Piping/NDTPercentage/NDTPercentage';
const UsersRoute = () => {

    // const hasAccess = (item) => menuAccessConfig[item]?.includes(localStorage.getItem('ERP_ROLE'));
    const { hasAccess } = useRoleAccess();

    return (
        <>
            <Routes>
                <Route path='/piping/user' element={<ProjectStoreLayout />}>
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
                    <Route path='drawing-master-data' element={<DrawingMaterialMaster />} />
                    <Route path='drawing-joint-master-data' element={<DrawingJointMaster />} />
                    <Route path='drawing-spool-no-wise-area-inch/meter-master-data' element={<DrawingAreaInchMeterMaster />} />
                    <Route path='material-request-management' element={<PurchaseRequest />} />
                    <Route path='manage-material-request' element={<ManagePurchaseRequest />} />

                    <Route path='material-request-management' element={<PurchaseRequest />} />
                    <Route path='manage-material-request' element={<ManagePurchaseRequest />} />

                    <Route path='issue-management' element={<IssueList />} />
                    <Route path='stock-wise-issue-management' element={<StockIssueList />} />
                    <Route path='issue-return-management' element={<IssueReturnList />} />

                    <Route path='ndt-percentage' element={<NDTPercentage />} />

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

                    {/* {hasAccess('Size') && ( */}
                    <>
                        <Route path='size-management' element={<Size />} />
                        <Route path='manage-size' element={<ManageSize />} />
                    </>
                    {/* )} */}

                    {hasAccess('Unit') && (
                        <>
                            <Route path='unit-management' element={<Unit />} />
                            <Route path='manage-unit' element={<ManageUnit />} />
                        </>
                    )}

                    {hasAccess('Unit') && (
                        <>
                            <Route path='thickness-management' element={<Thickness />} />
                            <Route path='manage-thickness' element={<ManageThickness />} />
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

                    {/* {hasAccess('Transport') && ( */}
                    <>
                        <Route path='material-control' element={<MaterialControl />} />
                        <Route path='manage-material-control' element={<ManageMaterialControl />} />
                    </>
                    {/* )} */}

                    {/* {hasAccess('Transport') && ( */}
                    <>
                        <Route path='procurement-request' element={<ProcurementRequest />} />
                        <Route path='manage-procurement-request' element={<ManageProcurementRequest />} />
                    </>
                    {/* )} */}

                    {/* {hasAccess('Transport') && ( */}
                    <>
                        <Route path='inquiry-for-supply' element={<InquiryforSupply />} />
                        <Route path='manage-inquiry-for-supply' element={<ManageInquiryforSupply />} />
                    </>
                    {/* )} */}

                    {/* {hasAccess('Transport') && ( */}
                        <>
                            <Route path='pressure-test' element={<PressureTest />} />
                            <Route path='manage-pressure-test' element={<ManagePressureTest />} />
                            <Route path='view-pressure-test/:id' element={<ViewPressureTest />} />
                        </>
                    <>
                        <Route path='order-placement' element={<OrderPlacement />} />
                        <Route path='manage-order-placement' element={<ManageOrderPlacement />} />
                    </>
                    {/* )} */}

                    {/* {hasAccess('Transport') && ( */}
                    <>
                        <Route path='pressure-test' element={<PressureTest />} />
                        <Route path='manage-pressure-test' element={<ManagePressureTest />} />
                    </>
                    {/* )} */}


                    {hasAccess('InventoryLocation') && (
                        <>
                            <Route path='inventory-location-management' element={<Location />} />
                            <Route path='manage-inventory-location' element={<ManageLocation />} />
                        </>
                    )}

                    <Route path='party-group-management' element={<PartyGroup />} />
                    <Route path='manage-party-group' element={<ManagePartyGroup />} />


                    <Route path='issue-request-management' element={<IssueRequestList />} />
                    <Route path='stock-wise-issue-request-management' element={<StockWiseIssueRequestList />} />
                    <Route path='issue-return-note' element={<IssueReturnNote />} />

                    {/* <Route path='manage-issue-acceptance' element={<ManageIssueAcc />} /> */}
                    <Route path='manage-issue-acceptance' element={<ViewMultiIssueAcc />} />

                    {/* <Route path='create-issue-acceptance' element={<ManageIssueAccEdit />} /> */}
                    <Route path='create-issue-acceptance' element={<MultiIssueAcceptance />} />

   
                    <Route path='manage-stock-wise-issue-acceptance' element={<ViewStockIssueAcc />} />                 
                    <Route path='create-stock-wise-issue-acceptance' element={<StockWiseIssueAcceptance />} />
                    <Route path='create-issue-return-acceptance' element={<MultiIssueReturnAcceptance />} />
                    <Route path='issue-return-summary' element={<MaterialIssueReturnSummary />} />

                    <Route path='issue-acceptance-master-data' element={<MaterialIssueAcceptanceMasterData />} />
                    <Route path='stock-issue-acceptance-master-data' element={<StockIssueAcceptanceMasterData />} />

                    {/* <Route path='manage-issue-request' element={<IssueRequest />} /> */}
                    <Route path='manage-issue-request' element={<MultiIssueRequest />} />
                    <Route path='manage-stock-wise-issue-request' element={<StockWiseIssueRequest />} />
                    <Route path='manage-issue-return' element={<MultiIssueReturn />} />
                    <Route path='manage-issue-return-acceptance' element={<ViewIssueReturnAcc />} />                 
                    
                    <Route
                        path="view-fitup-management/view/:id"
                        element={<ViewFitupOfferPiping />}
                    />
                    <Route
                        path="view-root-dpt-management/view/:id"
                        element={<ViewRootDptOfferPiping />}
                    />
                    <Route
                        path="view-weld-visual-management/view/:id"
                        element={<ViewWeldVisualOfferPiping />}
                    />
                     <Route
                    path="view-final-dimension-management/view/:id"
                    element={<ViewFinalDimensionOfferPiping />}
                    />
                    {hasAccess('ExecutionOffer') && (
                        <>
                            <Route path='fitup-management' element={<Fitup />} />
                            {/* <Route path='manage-fitup' element={<ManageFitup />} /> */}
                            <Route path='manage-fitup' element={<ManageMultiFitup />} />
                            <Route path='manage-fitup-view' element={<ViewFitup />} />


                            <Route path='dpt-management' element={<Dpt />} />
                            {/* <Route path='manage-fitup' element={<ManageFitup />} /> */}
                            <Route path='manage-dpt' element={<ManageMultiDpt />} />
                            <Route path='manage-dpt-view' element={<ViewFitup />} />


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
                    {/* {hasAccess('JointType') && ( */}
                    <>
                        <Route path='Area-management' element={<Area />} />
                    </>
                    {/* )} */}
                    {/* {hasAccess('JointType') && ( */}
                    <>
                        <Route path='piping-material-specification-management' element={<PipingMaterialSpecification />} />
                    </>
                    {/* )} */}
                    {/* {hasAccess('PipingClass') && ( */}
                    <>
                        <Route path='piping-class-management' element={<PipingClass />} />
                        <Route path='manage-piping-class' element={<ManagePipingClass />} />
                    </>
                    {/* )} */}
                    {hasAccess('NDT') && (
                        <>
                            <Route path='ndt-master-management' element={<NdtMaster />} />
                            <Route path='manage-ndt-master' element={<ManageNdt />} />
                        </>
                    )}

                    {hasAccess('NDT') && (
                    <>
                        <Route path='pwht-master-management' element={<PwhtMaster />} />
                        <Route path='manage-pwht-master' element={<ManagePwht />} />
                    </>
                     )} 

                    {/* {hasAccess('NDT') && ( */}
                    <>
                        <Route path='hardness-master-management' element={<HardnessMaster />} />
                        <Route path='manage-hardness-master' element={<ManageHardness />} />
                    </>
                    {/* )} */}

                    {/* {hasAccess('NDT') && ( */}
                    <>
                        <Route path='ndt-contractor-master-management' element={<NDTContractorMaster />} />
                        <Route path='manage-ndt-contractor-master' element={<ManageNDTContractorMaster />} />
                    </>
                    {/* )} */}

                    {/* {hasAccess('PaintingRequirement') && ( */}
                    <>
                        <Route path='painting-requirement-management' element={<PaintRequirement />} />
                        <Route path='manage-painting-requirement' element={<ManagePaintingRequirement />} />
                    </>
                    {/* )} */}


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


                            <Route path='dpt-clearance-management' element={<QDptList />} />
                            {/* <Route path='quality-clearance-fitup-management' element={<QFitup />} /> */}
                            <Route path='quality-clearance-dpt-management' element={<ManageMultiClearDpt />} />
                            <Route path='view-quality-clearance-dpt' element={<ViewMultiClearDpt />} />

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
                                    <Route path='ndt-summary' element={<NdtSummary />} />
                                    <Route path='manage-ndt' element={<ManageMultiNDT />} />
                                </>
                            )}

                            {hasAccess('NDT_PROCESS') && (
                                <>

                                    <Route path='rt-lot-book-management' element={<RtLotBook />} />
                                    <Route path='manage-rt-lot-book-management' element={<ManageRtLotBook />} />

                                    <Route path='lpt-lot-book-management' element={<LptLotBook />} />
                                    <Route path='manage-lpt-lot-book-management' element={<ManageLptLotBook />} />
                                    <Route path='mpt-lot-book-management' element={<MptLotBook />} />
                                    <Route path='manage-mpt-lot-book-management' element={<ManageMptLotBook />} />
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


                                    <Route path='pwht-offer-management' element={<MultiPWHTOffer />} />
                                    <Route path='manage-pwht-offer' element={<ManageMultiPWHTOffer />} />
                                    <Route path='pwht-clearance-management' element={<MultiPWHTClearance />} />
                                    <Route path='manage-pwht-clearance' element={<ManageMultiPWHTClearance />} />

                                    <Route path='ft-offer-management' element={<MultiFTOffer />} />
                                    <Route path='manage-ft-offer' element={<ManageMultiFTOffer />} />
                                    <Route path='ft-clearance-management' element={<MultiFTClearance />} />
                                    <Route path='manage-ft-clearance' element={<ManageMultiFTClearance />} />

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

                                    <Route path='ht-offer-management' element={<MultiHtOffer />} />
                                    <Route path='manage-ht-offer' element={<ManageMultiLptOffer />} />
                                    <Route path='ht-clearance-management' element={<MultiHtClearance />} />
                                    <Route path='manage-ht-clearance' element={<ManageMultiHtClearance />} />

                                    <Route path='pmi-offer-management' element={<MultiPmiOffer />} />
                                    <Route path='manage-pmi-offer' element={<ManageMultiPmiOffer />} />
                                    <Route path='pmi-clearance-management' element={<MultiPmiClearance />} />
                                    <Route path='manage-pmi-clearance' element={<ManageMultiPmiClearance />} />

                                    <Route path='pickling-passivation-offer-management' element={<MultiPicklingPassivationOffer />} />
                                    <Route path='manage-pickling-passivation-offer' element={<ManageMultiPicklingPassivationOffer />} />
                                    <Route path='pickling-passivation-clearance-management' element={<MultiPicklingPassivationClearance />} />
                                    <Route path='manage-pickling-passivation-clearance' element={<ManageMultiPicklingPassivationClearance />} />
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

 <Route path='stock-dispatch-note-management' element={<StockDispatchNote />} />
                    {/* <Route path='manage-dispatch-note' element={<ManageDispatchNote />} /> */}
                    <Route path='manage-stock-dispatch-note' element={<ManageStockDispatch />} />
                    <Route path='view-stock-dispatch-note' element={<ViewStockDispatch />} />
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
                            <Route path='final-coat-shade' element={<FinalCoatShadeCard />} />
                            <Route path='manage-final-coat-shade' element={<ManageFinalCoatShadeCard />} />
                        </>
                    )}
                    {hasAccess('PAINT_MASTER') && (
                        <>
                          

                            {/* New */}
                            <Route path='stock-surface-primer-management' element={<MultiStockSurface />} />
                            <Route path='manage-stock-surface-primer' element={<MultiManageStockSurface />} />
                            <Route path='stock-surface-clearance-management' element={<MultiStockSurfaceClearance />} />
                            <Route path='manage-stock-surface-clearance' element={<MultiManageStockSurfaceClearance />} />
                            <Route path='view-stock-surface-clearance' element={<MultiViewStockSurfaceClearanc />} />

                           

                            {/* New */}
                            <Route path='stock-mio-offer-management' element={<MultiStockMio />} />
                            <Route path='manage-stock-mio-offer' element={<MultiManageStockMio />} />
                            <Route path='stock-mio-clearance-management' element={<MultiStockMioClearance />} />
                            <Route path='manage-stock-mio-clearance' element={<MultiManageStockMioClearance />} />
                            <Route path='view-stock-mio-clearance' element={<MultiViewStockMioClearance />} />

                           

                            {/* new */}
                            <Route path='stock-final-coat-management' element={<MultiStockFinalCoat />} />
                            <Route path='manage-stock-final-coat' element={<ManageMultiStockFinalCoat />} />
                            <Route path='stock-final-coat-clearance-management' element={<MultiStockFinalCoatClearance />} />
                            <Route path='manage-stock-final-coat-clearance' element={<ManageMultiStockFinalCoatClearance />} />
                            <Route path='view-stock-final-coat-clearance' element={<MultiViewStockFinalCoatClearance />} />
                           
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
 {hasAccess('IRN_AFTER') && (
                        <>
                            {/* old */}
                            {/* <Route path='release-note-management' element={<ReleaseNote />} />
                            <Route path='management-release-note' element={<ViewReleaseNote />} /> */}

                            {/* new */}
                            <Route path='stock-release-note-management' element={<MultiStockReleaseNote />} />
                            <Route path='view-stock-release-note' element={<ViewStockReleaseNote />} />
                            <Route path='view-stock-Genrelease-note' element={<ViewStockGenReleaseNote />} />
                        </>
                    )}
                    {/* {hasAccess('IRN_AFTER') && ( */}
                    <>
                        {/* old */}
                        {/* <Route path='release-note-management' element={<ReleaseNote />} />
                            <Route path='management-release-note' element={<ViewReleaseNote />} /> */}

                        {/* new */}
                        <Route path='line-history-management' element={<MultiLineHistory />} />
                        <Route path='view-line-history' element={<ViewLineHistory />} />
                        <Route path='view-Genline-history' element={<ViewGenLineHistory />} />
                    </>
                    {/* )} */}

                    {/* old */}
                    {/* <Route path='packing-list' element={<MultiPacking />} /> */}
                    {/* <Route path='manage-packing' element={<MultiManagePacking />} /> */}

                    {/* new */}
                    <Route path='packing-list' element={<MultiPacking />} />
                    <Route path='manage-packing' element={<MultiManagePacking />} />
                    <Route path='view-packing' element={<MultiViewPacking />} />
                    <Route path='packing-list-summary' element={<MultiPackingSummary />} />

                        <Route path='stock-packing-list' element={<MultiStockPacking />} />
                    <Route path='manage-stock-packing' element={<MultiManageStockPacking />} />
                    <Route path='view-stock-packing' element={<MultiViewStockPacking />} />
                    <Route path='stock-packing-list-summary' element={<MultiStockPackingSummary />} />

                    {/* <Route path='add-drawing-form' element={<AddDrawingForm />} /> */}
                    {/* {hasAccess('Party') && ( */}
                    <>
                        <Route path='spool-break-up-summary-list' element={<SpoolBreakUpSummary />} />
                         <Route path='manage-spool-break-up' element={<ManageSpoolBreakUp />} />
                        <Route path='view-spool-break-up-summary/view/:id' element={<ViewSpoolBreakUpSummary />} />
                         <Route path='fim-procuement-rejected-summary' element={<FimProcuementRejectedSummary />} />
                        {/* <Route path='manage-party' element={<ManageParty />} /> */}
                    </>
                    {/* )} */}

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
                     {hasAccess('PROJECTFRONTAVAILABILITYSUMMARY') && (
                        <Route path='project-front-availability-summary' element={<ProjectFrontAvailabilitySummary />} />
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