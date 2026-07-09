import { configureStore } from "@reduxjs/toolkit";
// import getCustomersReducer from './slices/customer/Customer';
import getCustomersReducer from '../../src/Store/Store/Customer/Customer';
// Admin
import adminLoginSlice from "../Store/Admin/Login/Login";
import adminForgetPasswordSlice from "../Store/Admin/Login/ForgetPassword";
import adminOtpSlice from "../Store/Admin/Login/Otp";
import resetAdminPasswordSlice from "../Store/Admin/Login/ResetPassword";

import getBankSlice from "../Store/Admin/Payroll/Bank/Bank";
import getAdminBankSlice from "../Store/Admin/Payroll/Bank/AdminBank";
import addBankSlice from "../Store/Admin/Payroll/Bank/ManageBank";

import getShiftSlice from "../Store/Admin/Payroll/Shift/Shift";
import getAdminShiftSlice from "../Store/Admin/Payroll/Shift/AdminShift";
import addShiftSlice from "../Store/Admin/Payroll/Shift/ManageShift";

import getGroupSlice from "../Store/Admin/Payroll/Group/getGroup";
import getAdminGroupSlice from "../Store/Admin/Payroll/Group/AdminGroup";
import addGroupSlice from "../Store/Admin/Payroll/Group/AdminGroup";

import getDesignationSlice from "../Store/Admin/Payroll/Designation/Designation";
import getAdminDesignationSlice from "../Store/Admin/Payroll/Designation/AdminDesgination";
import addDesignationSlice from "../Store/Admin/Payroll/Designation/ManageDesignation";

import getAuthPersonSlice from "../Store/Admin/Payroll/AuthPerson/AuthPerson";
import getAdminAuthSlice from "../Store/Admin/Payroll/AuthPerson/AdminAuthPerson";
import addAuthPersonSlice from "../Store/Admin/Payroll/AuthPerson/ManageAuthPerson";

import getSkillSlice from "../Store/Admin/Payroll/Skill/Skill";
import getAdminSkillSlice from "../Store/Admin/Payroll/Skill/AdminSkill";
import addSkillSlice from "../Store/Admin/Payroll/Skill/AddSkill";

import getEmployeeTypeSlice from "../Store/Admin/Payroll/EmployeeType/EmployeeType";
import getAdminEmployeeTypeSlice from "../Store/Admin/Payroll/EmployeeType/AdminEmployeeType";
import addEmployeeTypeSlice from "../Store/Admin/Payroll/EmployeeType/ManageEmployeeType";

import getDepartmentSlice from "../Store/Admin/Payroll/Department/Department";
import getAdminDepartmentSlice from "../Store/Admin/Payroll/Department/AdminDepartment";
import addDepartmentSlice from "../Store/Admin/Payroll/Department/ManageDepartment";

import getYearSlice from "../Store/Admin/Payroll/Year/Year";
import getAdminYearSlice from "../Store/Admin/Payroll/Year/AdminYear";
import addYearSlice from "../Store/Admin/Payroll/Year/ManageYear";

// import getErpRoleSlice from "../Store/Admin/Payroll/Role/Role";


// admin Store
import getErpRoleSlice from "../Store/Admin/ErpRole/ErpRole";
import getAdminErpRoleSlice from "../Store/Admin/ErpRole/AdminErpRole";
import addErpRoleSlice from "../Store/Admin/ErpRole/ManageErpRole";

import getProductSlice from "../Store/Admin/Product/Product";
import getAdminProductSlice from "../Store/Admin/Product/AdminProduct";
import addProductSlice from "../Store/Admin/Product/ManageProduct";

import adminGetPartySlice from "../Store/Admin/Party/GetParty";
import adminGetEmployeeSlice from "../Store/Admin/Employee/Employee";
import getFirmSlice from "../Store/Admin/Firm/Firm";

import AdminContractorMasterSlice from "./Admin/Contractor/AdminContractorMaster";

import adminGetPartyTagSlice from "../Store/Admin/PartyTag/AdminPartyTag";
import adminGetPartyGroupSlice from "../Store/Admin/PartyTag/AdminPartyGroup";

import getAdminItemDataSlice from "../Store/Admin/Item/getAdminItem";

// admin main store
import getAdminPRSlice from "./Admin/Transaction/GetAdminPurchaseRequest";
import getSinglePRSlice from "./Admin/Transaction/GetOnePurchaseRequest";
import getAdminPOSlice from "./Admin/Transaction/GetAdminPurchaseOrder";
import getSinglePOSlice from "./Admin/Transaction/GetOnePurchaseOrder";
import getAdminPUSlice from "./Admin/Transaction/GetAdminPurchaseRecieving";
import getSinglePUSlice from "./Admin/Transaction/GetOnePurchaseRecieving";
import getAdminPURSlice from "./Admin/Transaction/GetAdminPurchaseReturn";
import getSinglePURSlice from "./Admin/Transaction/GetOnePurchaseReturn";
import getAdmiIssueSlice from "./Admin/Transaction/GetAdminIssue";
import getSingleIssSlice from "./Admin/Transaction/GetOneIssue";
import getAdmiIssueReturnSlice from "./Admin/Transaction/GetAdminIssueReturn";
import getSingleIsrSlice from "./Admin/Transaction/GetOneIssueReturn";
import getAdminMainStockSlice from "./Admin/Transaction/GetAdminStock";

// get PMS stock list
import getAdminPMSStockSlice from "./Admin/PMS/GetPMSStock";

// get admin dashboard
import getAdmindeshboardSlice from "./Admin/Dashboard/GetAminDashboard";

import getAdminProjectLocationSlice from "./Admin/PMS/GetProjectLocation";

// get admin projects
import getAdminProjectSlice from "./Admin/Project/GetAdminProject";
import getAdminProjectTypeSlice from "./Admin/ProjectType/GetAdminProjectType";
import GetProjectAttendanceSlice from "./Admin/Project/GetProjectAttendance";



import getAdminItemPipingDataSlice from "../Store/Admin/ItemPiping/getAdminItemPiping";
// Store ========================================================================

import userForgetPasswordSlice from "../Store/Store/Login/UserForget";
import AddPurchaseRequestSlice from "../Store/Store/PurchaseRequest/ManagePurchaseRequest";
import userOtpSlice from "../Store/Store/Login/UserOtp";
import resetUserPasswordSlice from "../Store/Store/Login/resetPassword";

import getUnitSlice from "../Store/Store/StoreMaster/Unit/Unit";
import getAdminUnitSlice from "../Store/Store/StoreMaster/Unit/AdminUnit";
import addUnitSlice from "../Store/Store/StoreMaster/Unit/ManageUnit";

import getCategorySlice from "../Store/Store/StoreMaster/Category/Category";
import getAdminCategorySlice from "../Store/Store/StoreMaster/Category/AdminCategory";
import addCategorySlice from "../Store/Store/StoreMaster/Category/ManageCategory";

import getTransportSlice from "../Store/Store/StoreMaster/Transport/Transport";
import getAdminTransportSlice from "../Store/Store/StoreMaster/Transport/AdminTransport";
import addTransportSlice from "../Store/Store/StoreMaster/Transport/ManageTransport";

import getLocationSlice from "../Store/Store/StoreMaster/InventoryLocation/Location";
import getAdminLocationSlice from "../Store/Store/StoreMaster/InventoryLocation/AdminLocation";
import addLocationSlice from "../Store/Store/StoreMaster/InventoryLocation/ManageLocation";
import getPartySlice from "../Store/Store/Party/Party";
import getAdminPartySlice from "../Store/Store/Party/AdminParty";
import addPartySlice from "../Store/Store/Party/ManageParty";
import getPartyGroupSlice from "../Store/Store/StoreMaster/PartyGroup/PartyGroup";
import getAdminPartyGroupSlice from "../Store/Store/StoreMaster/PartyGroup/PartyAdminGroup";
import addPartyGroupSlice from "../Store/Store/StoreMaster/PartyGroup/ManageParty";
import getUserDepartmentSlice from "../Store/Store/StoreMaster/Department/Department";
import getUserEmployeeSlice from "../Store/Store/StoreMaster/Employee/Employee";
import getPartyTagSlice from "../Store/Store/StoreMaster/PartyTag/PartyTag";
import getStoreAuthPersonSlice from "../Store/Store/StoreMaster/AuthPerson/AuthPerson";
import getAdminStoreAuthSlice from "../Store/Store/StoreMaster/AuthPerson/AdminAuthPerson";
import addStoreAuthPersonSlice from "../Store/Store/StoreMaster/AuthPerson/ManageAuthPerson";
import getItemSlice from "../Store/Store/Item/Item";
import getAdminItemSlice from "../Store/Store/Item/AdminItem";
import addItemSlice from "../Store/Store/Item/ManageItem";
import getProjectSlice from "../Store/Store/Project/Project";
import getStoreEmployeeSlice from "../Store/Store/Employee/Employee";
import getAdjustmentSlice from "../Store/Store/Adjustment/getAdjustment";
// import getItemStockSlice from '../Store/Store/Stock/getStock';
import getStoreDashboardSlice from "../Store/Store/Dashboard/Dashboard";
import getTransactionItemSlice from "../Store/Store/TransactionItem/TransactionItem";
import getOrderSlice from "../Store/Store/MainStore/PurchaseOrder/getPurchaseOrder";
import getPurchaseRequestSlice from "../Store/Store/PurchaseRequest/GetRequest";
import getSinglePurchaseRrequestSlice from "../Store/Store/PurchaseRequest/GetSinglePurchaseRrequest";
import getRequestAdminSlice from "../Store/Store/PurchaseRequest/GetRequestAdmin";
import getSingleAdminItemSlice from "../Store/Store/PurchaseRequest/GetSingleAdminItem";
import getOrderReturnSlice from "../Store/Store/Order/Return";

import getGenTagSlice from "../Store/Store/GenralMaster/TagGenMaster";
import getItemSummarySlice from "../Store/Store/Report/ItemSummary";
import getItemLedgerSlice from "../Store/Store/Report/ItemLedger";
import getReorderItemsSlice from "../Store/Store/Report/ReOrderItems";

import getUnitLocationSlice from "../Store/Store/UnitLocation/getUnitLocation";

// Main Store With Linking  ==============================================================

import getPurchaseRecievingSlice from "./Store/MainStore/PurchaseRecieving/GetPurchaseRecieving";
import getPurchaseRecievingItemsSlice from "./Store/MainStore/PurchaseRecieving/GetPurchaseRecievingItems";
import getPoNumberSlice from "./Store/MainStore/PurchaseRecieving/GetPoNo";
import getPoItemsSlice from "./Store/MainStore/PurchaseRecieving/GetPoitems";
import addPuSlice from "./Store/MainStore/PurchaseRecieving/ManagePu";

import getPurchaseReturnSlice from "./Store/MainStore/PurchaseReturn/GetPurchaseReturn";
import getPurchaseReturnItemsSlice from "./Store/MainStore/PurchaseReturn/GetPurchaseReturnItems";
import getChallanNoSlice from "./Store/MainStore/PurchaseReturn/GetChallanNumbers";
import getBillNoSlice from "./Store/MainStore/PurchaseReturn/GetBillNumbers";
import getPRItemsSlice from "./Store/MainStore/PurchaseReturn/GetPRItems";
import getPUNumberSlice from "./Store/MainStore/PurchaseReturn/getPUno";

import getPassSlice from "./Store/MainStore/Issue/GetPass";
import getIssueSlice from "./Store/MainStore/Issue/GetIssue";
import addIssueSlice from "./Store/MainStore/Issue/ManageIssue";
import getIssueItemsSlice from "./Store/MainStore/Issue/GetIssueItems";
import getIssueItemReturnSlice from "./Store/MainStore/ItemReturn/GetIssueItemReturn";

import getIssueReturnSlice from "./Store/MainStore/IssueReturn/GetIssueReturn";
import getIssueReturnItemsSlice from "./Store/MainStore/IssueReturn/GetIssueReturnItems";
import getIssueChallanSlice from "./Store/MainStore/IssueReturn/GetIssueChallanNo";
import getIssueNoSlice from "./Store/MainStore/IssueReturn/GetIssueNo";
import getIssueGetPassSlice from "./Store/MainStore/IssueReturn/GetIssuePassNo";
import getIssueReturnListsSlice from "./Store/MainStore/IssueReturn/GetIssueReturnLists";
import addIssueReturnSlice from "./Store/MainStore/IssueReturn/ManageIssueReturn";

import getPrSlice from "./Store/MainStore/PurchaseOrder/GetPR";
import getPrItemsSlice from "./Store/MainStore/PurchaseOrder/GetPRItems";
import getSingleOrderSlice from "./Store/MainStore/PurchaseOrder/GetSinglePo";

//  ERp ================================================================================
// Planner -----------------------------------------------------

import getDrawingSlice from "../Store/Erp/Planner/Draw/Draw";
import getUserProfileSlice from "../Store/Store/Profile/Profile";
import getUserIssueSlice from "../Store/Store/Issue/Issue";
import getRequestSlice from "../Store/Store/Request/getRequest";
import getUserDrawTrasactionSlice from "../Store/Store/TransactionItem/getDrawTransaction";
import getUserAdminDrawSlice from "../Store/Erp/Planner/Draw/UserAdminDraw";
import getUserIssueRequestSlice from "../Store/Store/Issue/IssueRequest";
import getUserOfferSlice from "../Store/Store/Offer/getUserOffer";
import getOneIssueSlice from "../Store/Store/Issue/GetOneIssue";
import transactionReturnSlice from "../Store/Store/Issue/TransactionReturn";

import getReleseNoteSlice from "../Store/Erp/ReleseNote/ReleseNote";

// Material Coordinator APIS ==========================================================================

import getUserIssueAcceptanceSlice from "../Store/Store/Issue/IssueAcceptance";

// Execution =============================
import getUserFitupSlice from "../Store/Store/Execution/getUserFitup";
import getUserWeldVisualSlice from "../Store/Store/Execution/getUserWeldVisual";

import getUserJointTypeSlice from "../Store/Store/JointType/JointType";
import getUserNdtMasterSlice from "../Store/Store/Ndt/NdtMaster";
import getUserContractorSlice from "../Store/Store/ContractorMaster/ContractorMaster";

import getUserPaintSystemSlice from "../Store/Store/PaintSystem/PaintSystem";
import getUserWpsMasterSlice from "../Store/Store/WpsMaster/WpsMaster";
import getUserWelderMasterSlice from "../Store/Store/WelderMaster/WelderMaster";
import getUserProcedureMasterSlice from "../Store/Store/Procedure/ProcedureMaster";
import getUserPaintManufactureSlice from "../Store/Store/PaintManufacture/PaintManufacture";

import getStockReportSlice from "../Store/Store/Stock/getStockReport";
import getStockReportListSlice from "../Store/Store/Stock/getStockReportList";

import getUserMainNdtMasterSlice from "../Store/Store/Ndt/MainNdtMaster";
import getUserNdtOfferSlice from "../Store/Store/Ndt/NdtOffer";

import getUserUtClearanceSlice from "../Store/Store/Ndt/UT/UtClearance";
import getUserRtClearanceSlice from "../Store/Store/Ndt/RT/RtClearance";
import getUserMptClearanceSlice from "../Store/Store/Ndt/MPT/MptClearance";

import getUserLptClearanceSlice from "../Store/Store/Ndt/LPT/LptClearance";

import getUserFinalDimensionSlice from "../Store/Store/Execution/getUserFinalDimension";
import getUserInspectionSummarySlice from "../Store/Store/InspectionSummary/GetInspectionSummary";
import getUserGenInspectionSummarySlice from "../Store/Store/InspectionSummary/GetGeneratedInsSummary";
import getDispatchNotesSlice from "../Store/MutipleDrawing/DispatchNote/GetDisptchNote";
import getMultiDispatchSlice from "../Store/MutipleDrawing/DispatchNote/GetMultiDispatch";

import getMultiSurfcaeSlice from "../Store/MutipleDrawing/MultiSurface/GetMultiSurface";
import getMultiSurfaceOfferSlice from "../Store/MutipleDrawing/MultiSurface/GetSurfaseOffer";
import getMultiSurfaceOfferViewPageSlice from "../Store/MutipleDrawing/MultiSurface/GetSurfaceOfferViewPage";
import getSurfaceClearanceSlice from "../Store/MutipleDrawing/MultiSurface/GetSurfaceClearance";
import getUserSurfaceSlice from "../Store/Erp/Painting/Surface/Surface";
import getGenMasterSlice from "./Store/GenralMaster/GenMaster";
import AddOrderSlice from "./Store/Order/ManageOrder";
import AddOrderReturnSlice from "./Store/Order/ManageOrderReturn";
import getSingleOrderReturnSlice from "./Store/Order/GetSingleOrderReturn";
import getMainStoreStockSlice from "../Store/Store/MainStore/MainStock";
import getMainStockSlice from "../Store/Store/Stock/getMainStock";
import getUserMioSlice from "../Store/Erp/Painting/Mio/GetMio";
import getUserFinalCoatingSlice from "../Store/Erp/Painting/FinalCoating/FinalCoating";
import getPackSlice from "../Store/Erp/Packing/Packing";

import getInvoiceSlice from "../Store/Erp/Invoice/Invoice";
import getDprSlice from "../Store/Erp/Dpr/Dpr";
import getPmsStockSlice from "./Store/PMSStock/PMS";

import getUserProjectLocationSlice from "../Store/Erp/ProjectLocation/ProjectLocation";

// Multiple Drawings =================================================================
import getMultipleIssueRequestSlice from "../Store/MutipleDrawing/IssueRequest/MultipleIssueRequest";
import getIssueAcceptanceMasterDataSlice from "../Store/MutipleDrawing/MaterialIssueAcceptanceMasterData/getIssueAcceptanceMasterData";
import getMultipleIssueAccSlice from "../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc";
import getMultipleDrawItemsSlice from "../Store/MutipleDrawing/MultipleDrawing/MultipleDrawItems";
import getMultipleDrawingMasterDataSlice from "../Store/MutipleDrawing/MultipleDrawing/getDrawingMasterData";
import updateMultiGridSlice from "../Store/MutipleDrawing/MultipleDrawing/UpdateGridBal";

import updateIssueAccGridSlice from "../Store/MutipleDrawing/IssueAcc/UpdateIssueAccGrid";
import getMultiFitupSlice from "../Store/MutipleDrawing/MultiFitup/getMultiFitup";

import getMultiWeldVisualSlice from "../Store/MutipleDrawing/MultiWeldVisual/getMultiWeldVisual";
import updateFitupGridSlice from "../Store/MutipleDrawing/MultiWeldVisual/UpdateFitupGrid";

import manageFitupOffTableSlice from "../Store/MutipleDrawing/MultiFitup/manageFitupOffTable";
import getFitupOfferTableSlice from "../Store/MutipleDrawing/MultiFitup/getFitupOfferTable";

import removeFitupOffTableSlice from "../Store/MutipleDrawing/MultiFitup/removeFitupOffertable";
import updateFitupOffTableSlice from "../Store/MutipleDrawing/MultiFitup/updateFitupOfferTable";

import getWeldOfferTableSlice from "../Store/MutipleDrawing/MultiWeldVisual/getWeldOfferTable";
import manageWeldOfferTableSlice from "../Store/MutipleDrawing/MultiWeldVisual/manageWeldTableOffer";
import updateWeldOffTableSlice from "../Store/MutipleDrawing/MultiWeldVisual/updateWeldOfferTable";
import removeWeldOffTableSlice from "../Store/MutipleDrawing/MultiWeldVisual/removeWeldOfferTable";

import updateNDTGridSlice from "../Store/MutipleDrawing/MultiNDT/UpdateNDTGrid";
import manageNDTOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/manageNDTTableOffer";
import getNDTOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/getNDTOffertable";
import removeNDTOffTableSlice from "../Store/MutipleDrawing/MultiNDT/removeNdtOfferTable";

import updateNDTOffTableSlice from "../Store/MutipleDrawing/MultiNDT/updateNDTOfferTable";
import getUserMultiNdtMasterSlice from "../Store/MutipleDrawing/MultiNDT/getUserMultiNdtMaster";

import getMultiNdtOfferSlice from "../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList";

import getMultipleGridSlice from "../Store/MutipleDrawing/MultipleDrawing/MultipleGrid";
import getMultiRtClearanceSlice from "../Store/MutipleDrawing/MultiNDT/RtClearance/getMultiRtClearance";
import getMultiMptClearanceSlice from "../Store/MutipleDrawing/MultiNDT/MptClearance/getMultiMptClearance";
import getMultiLptClearanceSlice from "../Store/MutipleDrawing/MultiNDT/LptClearance/getMultiLptClearance";
import getMultiUtClearanceSlice from "../Store/MutipleDrawing/MultiNDT/UtClearance/getMultiUtClearance";

import manageFdTableSlice from "../Store/MutipleDrawing/MultiFd/manageFdTable";
import updateNdtGridSlice from "../Store/MutipleDrawing/MultiFd/updateNdtGrid";
import removeFdTableSlice from "../Store/MutipleDrawing/MultiFd/removeFdTable";
import getFdTableSlice from "../Store/MutipleDrawing/MultiFd/getFdTable";

import updateFDOfferTableSlice from "../Store/MutipleDrawing/MultiFd/updateFDOfferTable";
import getMultiFdSlice from "../Store/MutipleDrawing/MultiFd/getMultiFd";

import manageRTOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRtOfferTable";
import getMultiRtOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable";
import removeRTTableSlice from "../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable";
import manageRTMultiOfferSlice from "../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer";

import getMultiUTOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/UtClearance/UtOfferTable";
import getMultiMPTOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/MptClearance/MptOfferTable";
import getMultiLPTOfferTableSlice from "../Store/MutipleDrawing/MultiNDT/LptClearance/LptOfferTable";

// Paint
import getMultiDispatchPaintSlice from "../Store/MutipleDrawing/MultiSurface/GetMultiDispatchNotePaint";

//for MIO
import getMultiSurfaceMioSlice from "../Store/MutipleDrawing/MultiMIO/GetMultiSurfaceMio";
import getMultiSurfaceOfferMioSlice from "../Store/MutipleDrawing/MultiMIO/GetSurfaceMioOffer";
import getMultiMioSlice from "../Store/MutipleDrawing/MultiMIO/GetMultiMio";
import getMultiMioInsSlice from "../Store/MutipleDrawing/MultiMIO/GetMultiMioIns";
import getMultiMioViewPageSlice from "./MutipleDrawing/MultiMIO/GetMultiMioViewPage";
import getMultiMioClearanceSlice from "../Store/MutipleDrawing/MultiMIO/GetMultiMioClearance";

//for Final Coating
import getMioListSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetMio";
import getMioFilterListSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetMultiMio";
import getMultiFinalCoatSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetMultiFinalCoat";
import getFinalCoatClearanceSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetFinalCoatClearance";
import getFinalCoatQcOfferSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetFinalCoatQcOffer";
import getFinalCoatOfferViewPageSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetFinalCoatOfferViewPage";
import GetFinalCoatInsSlice from "../Store/MutipleDrawing/MultiFinalCoat/GetFinalCoatOffer";

import manageIssueOffTableSlice from "../Store/MutipleDrawing/IssueRequest/manageIssueOfferTable";
import removeIssueOffTableSlice from "../Store/MutipleDrawing/IssueRequest/removeIssueOfferTable";
import getIssueOfferTableSlice from "../Store/MutipleDrawing/IssueRequest/getIssueOfferTable";
import updateIssueOffTableSlice from "../Store/MutipleDrawing/IssueRequest/updateIssueOfferTable";

// Release Note list
import GetMultiReleaseNoteSlice from "./MutipleDrawing/MultiReleaseNote/GetMultiReleaseNote";
import GetMultiGenReleaseNoteSlice from "../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote";

// packings list
import getMultiPackingSlice from "../Store/MutipleDrawing/MultiPacking/GetMultiPacking";
import getMultiPackingListSlice from "./MutipleDrawing/MultiPacking/GetMultiPackingList";


import getLoginFirmSlice from "../Store/MutipleDrawing/Invoice/getLoginFirm";
import getLoginProjectSlice from "../Store/MutipleDrawing/Invoice/getLoginProject";

import getMultiInvoiceSlice from "../Store/MutipleDrawing/Invoice/getMultiInvoice";

import getMultiDrawingItemsSlice from "../Store/MutipleDrawing/MultipleDrawing/GetMultiGridItems";

import getMultiGridsSlice from "../Store/MutipleDrawing/MultipleDrawing/GetMultiGrids";
import getReusableListSlice from "../Store/Store/Stock/getReusableList";
import getPipingStockReportListSlice from "../Store/Piping/Stock/getPipingStockReportList";

// Super Admin ==================================================================================================================

import getSuperDprSlice from "../Store/SuperAdmin/SuperDpr/SuperDpr";
// =====================================DMR==================================================
import getDmrSlice from "../Store/Erp/Dmr/Dmr";
import getDmrCategoriesSlice from "../Store/Erp/DmrCategories/DmrCategories";

// FIM =================================================================================================================
import getFIMidDataSlice from "../Store/MutipleDrawing/FIM/OneFimListItem";

// Area in Proument ====================================================================================================================
import areaReducer from "../Store/PoTeam/Area/AreaSlice";


// Material MTO
import materialMtoReducer from "../Store/PoTeam/MaterialMTO/MaterialMto";
// Procurement Request ==========================================================================================================
import procurementRequestReducer from "../Store/PoTeam/ProcurementRequest/ProcurementRequest";

// Inquiry 
import inquiryReducer from "../Store/PoTeam/piping/Inquiry/Inquiry";

// Order Placement
import orderReducer from "../Store/PoTeam/Order/Order";

// Material Chart
import materialChartReducer from "../Store/PoTeam/MaterialChart/MaterialChart";

// Terms and condition 

import termsSlice from "../Store/PoTeam/TermsCondition/TermsConditionSlice"

import getItemCategoryWiseReportListSlice from "../Store/Erp/IssueReturn/getItemCategoryWiseReportList";
import getIssueReturnOfferTableSlice from "../Store/Erp/IssueReturn/getIssueReturnOfferTable";
import getMultipleIssueReturnSlice from "../Store/Erp/IssueReturn/getMultipleIssueReturn";

import getIssueReturnAcceptanceSlice from "../Store/Erp/IssueReturnAcceptance/getIssueReturnAcceptance";
import getIssueReturnAcceptanceSummarySlice from "../Store/Erp/IssueReturnAcceptance/getIssueReturnAcceptanceSummary";

// Client ============================================================================================================================
import getClientMultiFitupSlice from "../Store/Client/MultiFitup/getClientMultiFitup";

// Product Store ============================================================================================================================
import getProductPartySlice from "../Store/ProductStore/Party/ProductParty";

// PIPING ============================================================================================================================
import getPipingPMSSlice from "../Store/Piping/PipingStock/PipingPMS";
import getUserOfferPipingSlice from "../Store/PoTeam/piping/Offer/getUserOfferPiping";

import areaPiping from "../Store/Piping/Area/AreaSlicePiping";
import termsPipingReducer from "../Store/PoTeam/TermsCondition/TermsConditionSlicePiping";

import getItemCategoryWiseStockReportListSlice from "../Store/Piping/Stock/getItemCategoryWiseStockReportList";
import getUserWpsMasterPipingReducer from "./Piping/WpsMaster/WpsMaster";
import getUserWelderMasterPipingReducer from "./Piping/WelderMaster/WelderMaster";
import getUserPaintRequirementMasterReducer from "./Piping/PaintRequirementMaster/PaintRequirementMaster";
import getUserPaintManufacturePipingSlice from "./Piping/PaintManufacture/PaintManufacture";
import getUserFinalCoatShadeMasterReducer from "./Piping/FinalCoatShade/FinalCoatShadeMaster";
import getUserNDTPipingReducer from "./Piping/NdtMaster/NdtMaster";
import getUserPwhtMasterReducer from "./Piping/PwhtMaster/PwhtMaster";
import getUserHardnessMasterReducer from "./Piping/HardnessMaster/HardnessMaster";
import getUserPaintSystemPipingReducer from "./Piping/PaintSystem/PaintSystem";
import getUserProcedureMasterPipingReducer from "../Store/Piping/Procedure/ProcedureMaster";
import getUserPipingClasseMasterReducer from "../Store/Piping/PipingClass/PipingClassMaster";
import getMaterialEntryItemsSlice from "../Store/Piping/Drawing/getMaterialEntryItems";
import getMaterialEntryItemsForIssueRequestSlice from "../Store/Piping/IssueRequest/getMaterialIssueItemsForIssueRequest";
import getJointEntryItemsSlice from "../Store/Piping/Drawing/getJointEntryItems";
import getDrawingAreaInchMeterMasterDataSlice from "../Store/Piping/Drawing/getDrawingAreaInchMeter";
import getSpoolNoSlice from "../Store/Piping/Drawing/getSpoolNo";
import getDrawingSpoolSlice from "../Store/Piping/Drawing/getDrawingSpool";

import addItemDetailsSlice from "../Store/Piping/Item/ManageItem";
import getAdminItemDetailsSlice from "../Store/Piping/Item/AdminItem";
import getItemDetailsSlice from "../Store/Piping/Item/Item";

import getUserJointTypePipingSlice from "../Store/Piping/JointType/JointTypePiping";
import getDrawingmaterialMasterDataSlice from "../Store/Piping/Drawing/getDrawingMaterialMasterData";
import getDprPipingSlice from "../Store/Piping/Dpr/getDprPiping";
import getDrawingPipingSlice from "../Store/Piping/Drawing/getDrawingPiping";
import getDrawingJointMasterDataSlice from "../Store/Piping/Drawing/getDrawingJointMaster";
import getItemCategorySlice from "../Store/Piping/ItemCategory/ItemCategory";
import getAdminItemCategorySlice from "../Store/Piping/ItemCategory/AdminItemCategory";
import addItemCategorySlice from "../Store/Piping/ItemCategory/ManageItemCategory";


import getUOMSlice from "../Store/Piping/UOM/UOM";
import getAdminUOMSlice from "../Store/Piping/UOM/AdminUOM";
import addUOMSlice from "../Store/Piping/UOM/ManageUOM";

import getThicknessSlice from "../Store/Piping/Thickness/Thickness";
import getAdminThicknessSlice from "../Store/Piping/Thickness/AdminThickness";
import addThicknessSlice from "../Store/Piping/Thickness/ManageThickness";
import getSizeSlice from "../Store/Piping/Size/Size";
import getAdminSizeSlice from "../Store/Piping/Size/AdminSize";
import addSizeSlice from "../Store/Piping/Size/ManageSize";

import pipingmaterialspecificationReducer from "../Store/PoTeam/PipingMaterialSpecification/PipingMaterialSpecificationSlice";
import MaterialControlListReducer from "../Store/PoTeam/piping/MaterialControlList/MaterialControlListSlice";
import pipingProcurementRequestReducer from "../Store/PoTeam/piping/ProcurementRequest/PipingProcurementRequestSlice";

// Material Issue Request Piping

import getIssueOfferTablePipingSlice from "../Store/Piping/IssueRequest/getIssueOfferTable";


import getMultiPipeInvoiceSlice from "../Store/Piping/Invoice/getMultiPipeInvoice";


import getMultipleIssueRequestPipingSlice from "../Store/Piping/IssueRequest/getMultipleIssueRequestPiping";
import getIssueAcceptancePipingSlice from "../Store/Piping/IssueAcceptance/getIssueAcceptancePiping";
import getIssueAcceptanceMasterDataPipingSlice from "../Store/Piping/IssueAcceptance/getIssueAcceptanceMasterDataPiping";
import manageFitupOffTablePipingSlice from "../Store/Piping/MultiFitupPiping/manageFitupOffTablePiping";

import pipingIssueDrawingIdReducer from "../Store/Piping/DrawingIssueAcc/getDrawingIssueAcc";
import getPipingDispatchNotesSlice from "../Store/Piping/DispatchNote/GetDispatchNote";
// import getPipingUserGenInspectionSummarySlice from "../Store/Piping/InspectionSummary/GetGeneratedInsSummary";

import getDrawingJointWisePipingSlice from "../Store/Piping/MultiFitupPiping/getDrawingJointWisePipingData";


// Package 
import getOfferDataforPackaingSlice from "../Store/Piping/MultiPacking/getOfferDataforPackaing";
import pipingGetMultiPackingSlice from "../Store/Piping/MultiPacking/PipingGetMultiPacking";
import getMultiPackingPipingListSlice from "../Store/Piping/MultiPacking/GetMultiPackingPipingList";
import getMultiPackingSummaryPipingSlice from "../Store/Piping/MultiPacking/GetMultiPackingSummaryPiping";
// import manageFitupOffTablePipingSlice from "../Store/Piping/MultiFitupPiping/manageFitupOffTablePiping";
import getFitupOfferTablePipingSlice from "../Store/Piping/MultiFitupPiping/getFitupOfferTablePiping";
import getMultiFitupPipingSlice from "../Store/Piping/MultiFitupPiping/getMultiFitupPiping";
import getDrawingSpoolNoFitUpSlice from "../Store/Piping/MultiFitupPiping/getMultiFitupPiping";
import getDrawingSpoolNoFitUpReducer
  from "../Store/Piping/Drawing/getDrawingSpoolNoFitUp";
import updateFitupOffTablePipingSlice from "../Store/Piping/MultiFitupPiping/updateFitupOfferTablePiping";
import removeFitupOffTablePipingSlice from "../Store/Piping/MultiFitupPiping/removeFitupOffertablePiping";


// ======================== Root Dpt =============
import getFitUpDrawingDataForDptSlice from "../Store/Piping/RootDpt/getFitUpDrawingDataForDpt";
import getDptOfferSlice from "../Store/Piping/RootDpt/getDptOffer";
import getMultiDptPipingSlice from "../Store/Piping/RootDpt/getMultiDptPiping";

import getFitUpDrawingDataForWeldVisualSlice from "../Store/Piping/WeldVisual/getFitUpDrawingDataForWeldVisual";
import { getRootDptDrawingDataForWeldVisual } from "./Piping/WeldVisual/getRootDptDrawingDataForWeldVisual";
import getMultiWeldVisualPipingSlice from "../Store/Piping/WeldVisual/getMultiWeldVisualPiping";
import getWelVisualOfferSlice from "../Store/Piping/WeldVisual/getWeldVisualOffer";
// import areaReducer from "../Store/PoTeam/Area/AreaSlice";

import getPipingMultiDispatchPaintSlice from "../Store/Piping/MultiSurface/GetMultiDispatchNotePaint";
import getPipingMultiSurfaceSlice from "../Store/Piping/MultiSurface/GetMultiSurface";
import getPipingMultiSurfaceOfferSlice from "../Store/Piping/MultiSurface/GetSurfaseOffer";

import getPipingMultiSurfaceMioSlice from "../Store/Piping/MultiMIO/GetMultiSurfaceMio";
import getPipingMultiMioSlice from "../Store/Piping/MultiMIO/GetMultiMio";
import getPipingMultiMioViewPageSlice from "../Store/Piping/MultiMIO/GetMultiMioViewPage";
import getPipingMultiMioClearanceSlice from "../Store/Piping/MultiMIO/GetMultiMioClearance";
import getPipingMioListSlice from "../Store/Piping/MultiFinalCoat/GetMio";
import getPipingMultiFinalCoatSlice from "../Store/Piping/MultiFinalCoat/GetMultiFinalCoat";
import GetPipingFinalCoatInsSlice from "../Store/Piping/MultiFinalCoat/GetFinalCoatOffer";
import addNdtContractorSlice from "../Store/Piping/NdtContractor/ManageNdtContractor";
import getNdtContractorSlice from "../Store/Piping/NdtContractor/NdtContractor";
import getUserWeldFtPipingSlice from "../Store/Piping/WeldFt/WeldFtPiping";
import getUserFtReducer from "./Piping/Ndt/FT/FtOffer";
import getUserFtAddedReducer from "./Piping/Ndt/FT/FTOfferadded";
import getFtClearanceSlice from "./Piping/Ndt/FT/getFTClearance";
import getUserWeldHardnessPipingReducer from "../Store/Piping/WeldHardness/WeldHardnessPiping";
import getUserHtReducer from "./Piping/Ndt/HT/HtOffer";
import getUserHtAddedReducer from "./Piping/Ndt/HT/HTOfferadded";
import getUserWeldPmiPipingReducer from "../Store/Piping/WeldPmi/WeldPmiPiping";
import getUserPmiReducer from "./Piping/Ndt/PMI/PmiOffer";
import getUserPmiAddedReducer from "./Piping/Ndt/PMI/PmiOfferadded";
import getUserWeldPicklingPipingReducer from "../Store/Piping/WeldPickling/WeldPicklingPiping";
import getUserPicklingReducer from "./Piping/Ndt/Pickling/PicklingOffer";
import getUserPicklingAddedReducer from "./Piping/Ndt/Pickling/PicklingOfferadded";

// ==================IRN=============================================================
// Release Note list
import GetMultiReleaseNoteSlicePiping from "../Store/Piping/MultiReleaseNote/GetMultiReleaseNote";
import GetMultiGenReleaseNotePipingSlice from "../Store/Piping/MultiReleaseNote/GetMultiGeneratedReleaseNote";


//=======================================NDT==========================================
import getPwhtNdtDataFromWeldVisualPipingSlice from "./Piping/Ndt/PwhtNdt/getPwhtNdtDataFromWeldVisual";
import getPwhtOfferSlice from "./Piping/Ndt/PwhtNdt/getPwhtOfferPiping";
import getPwhtInspectionPipingSlice from "./Piping/Ndt/PwhtNdt/getPwhtInspectionPiping";
// =============================================================================================================================

// NDT
// RT
import NDTOfferDataSlice from "./Piping/Ndt/NDTOFFERDATA/NdtOfferData";
import  MPTOfferDataSlice from "./Piping/Ndt/MPTOFFERDATA/MPTOfferData";
import RTOfferSlice from "./Piping/Ndt/RT-OFFER/RtOfferData";
import RTClearnacePipingSlice from "./Piping/Ndt/RT-CLEARANCE/rtClearance";
// NDT Percentage 
import getNDTPercentageSlice from "../Store/Piping/NDTPercentage/NDTPercentage";

// RT LOT
import RTLotOfferSlice from "./Piping/Ndt/RT-LOT-OFFER/RtLotOfferData";

// RT Main Lot Show 
import RTLotPipingSlice from "./Piping/Ndt/RT-LOT/RtLot";
import RTPendingPipingSlice from "./Piping/Ndt/RT-CLEARANCE/rtPending";

// MPT LOT
import MPTLotOfferSlice from "./Piping/Ndt/MPT-LOT-OFFER/MptLotOfferData";

import MPTLotPipingSlice from "./Piping/Ndt/MPT-LOT/MPT";

import MPTClearancePipingSlice from "./Piping/Ndt/MPT-CLEARANCE/mptClearance";
import MPTPendingPipingSlice from "./Piping/Ndt/MPT-CLEARANCE/mptPending";
import MPTOfferSlice from "./Piping/Ndt/MPT-OFFER/MPTOfferData";
import getPipingFimDataSlice from "../Store/Piping/FIM/OneFimListItem";

//LPT LOT
import getLptLotNdtDataFromWeldVisualPipingSlice from "./Piping/Ndt/LPT-LOT-OFFER/getLptLotNdtDataFromWeldVisual";
import LPTLotOfferSlice from "./Piping/Ndt/LPT-LOT-OFFER/LpttLotOfferData";
import LPTLotPipingSlice from "./Piping/Ndt/LPT-LOT/LptLot";

//LPT NDT
import getLptNdtDataFromWeldVisualPipingSlice from "./Piping/Ndt/LPTNDT/getLptNdtDataFromWeldVisual";
import getLptOfferSlice from "./Piping/Ndt/LPTNDT/getLptOfferPiping";
import getLptNdtInspectionPipingSlice  from "./Piping/Ndt/LPTNDT/getLptNdtInspectionPiping";



// Final Dimension
import getFdDataFromNdtSlice from "../Store/Piping/MultiFdPiping/getFdDataFromNdt";
import getFdOfferTablePipingSlice from "../Store/Piping/MultiFdPiping/getFdOfferTablePiping";
import getMultiFdPipingSlice from "../Store/Piping/MultiFdPiping/getMultiFdPiping";

// Pressure Test
import getPressureTestDataFromFdSlice from "../Store/Piping/MultiPressureTestPiping/getPressureTestDataFromFd";
import getPressureTestOfferTablePipingSlice from "../Store/Piping/MultiPressureTestPiping/getPressureTestOfferTablePiping";
import getPressureTestInspectionPipingSlice from "../Store/Piping/MultiPressureTestPiping/getPressureTestInspectionPiping";


// Line History Sheet
import getLineHistorySheetDataPipingSlice from "../Store/Piping/LHS/getLineHistorySheetDataPiping";

import NdtSummarySlice from "../Store/Piping/Ndt/Summary/ndtsummary";
import getGenLineHistorySheetPipingSlice from "../Store/Piping/LHS/getGenLineHistorySheetPiping";
import getDataForSpoolBreakUpSlice from "../Store/Piping/SpoolBreakUp/getDataForSpoolBreakUp";
import getSpoolBreakUpSummarySlice from "../Store/Piping/SpoolBreakUp/getSpoolBreakUpSummary";
// import getStockIssueOfferTablePipingSlice from "../Store/Piping/StockIssueOffer/getStockIssueOfferTable";
import getStockIssueOfferTablePipingSlice from "../Store/Piping/StockIssueRequest/getStockIssueOfferTable";
import getStockIssueRequestPipingSlice from "../Store/Piping/StockIssueRequest/getStockIssueRequestPiping";
import getStockIssueAcceptancePipingSlice from "../Store/Piping/StockIssueAcceptance/getStockIssueAcceptancePiping";
import getStockIssueAcceptanceMasterDataPipingSlice from "../Store/Piping/StockIssueAcceptance/getStockIssueAcceptanceMasterDataPiping";

import getOfferDataforStockPackaingSlice from "../Store/Piping/MultiStockPacking/getOfferDataforStockPackaing";
import pipingGetMultiStockPackingSlice from "../Store/Piping/MultiStockPacking/PipingGetMultiStockPacking";
import getMultiStockPackingPipingListSlice from "../Store/Piping/MultiStockPacking/GetMultiStockPackingPipingList";
import getMultiStockPackingSummaryPipingSlice from "../Store/Piping/MultiStockPacking/GetMultiStockPackingSummaryPiping";
import getMultiStockPackingSlice from "../Store/Piping/MultiStockPacking/GetMultiStockPacking";

import getPipingStockDispatchNotesSlice from "../Store/Piping/StockDispatchNote/GetStockDispatchNote";
import getDispatchNoteItemFromStockIssueAccSlice from "../Store/Piping/StockDispatchNote/getDispatchNoteItemFromStockIssueAcc";


import getPipingMultiStockDispatchPaintSlice from "../Store/Piping/MultiStockSurface/GetMultiStockDispatchNotePaint";
import getPipingMultiStockSurfaceSlice from "../Store/Piping/MultiStockSurface/GetMultiStockSurface";
import getPipingMultiStockSurfaceOfferSlice from "../Store/Piping/MultiStockSurface/GetStockSurfaseOffer";

import getPipingMultiStockMioSlice from "../Store/Piping/MultiStockMIO/GetMultiStockMio";
import getMultiStockMioInsSlice from "../Store/Piping/MultiStockMIO/GetMultiStockMioIns";
import getPipingMultiStockMioViewPageSlice from "../Store/Piping/MultiStockMIO/GetMultiStockMioViewPage";
import getPipingMultiStockMioClearanceSlice from "../Store/Piping/MultiStockMIO/GetMultiStockMioClearance";
import getStockSurfaseDataInMioSlice from "../Store/Piping/MultiStockMIO/GetStockSurfaseDataInMio";
// import getPipingMioListSlice from "../Store/Piping/MultiFinalCoat/GetMio";

import getPipingMultiStockFinalCoatSlice from "../Store/Piping/MultiStockFinalCoat/GetMultiStockFinalCoat";
import getPipingStockMioListSlice from "../Store/Piping/MultiStockFinalCoat/GetStockMio";
import getPipingStockFinalCoatInsSlice from "../Store/Piping/MultiStockFinalCoat/GetStockFinalCoatOffer";
import getStockMioDataInFinalCoatSlice from "../Store/Piping/MultiStockFinalCoat/GetStockMioDataInFinalCoat";

import GetMultiStockReleaseNoteSlicePiping from "../Store/Piping/MultiStockReleaseNote/GetMultiStockReleaseNote";
import GetMultiGenStockReleaseNotePipingSlice from "../Store/Piping/MultiStockReleaseNote/GetMultiGeneratedStockReleaseNote";

import getProjectFrontAvailabilitySummarySlice from "../Store/Piping/Drawing/getProjectFrontAvailabilitySummary";


import getIssueReturnOfferTablePipingSlice from "../Store/Piping/IssueReturn/getIssueReturnOfferTable";
import getMultipleIssueReturnPipingSlice from "../Store/Piping/IssueReturn/getMultipleIssueReturnPiping";
import getIssueReturnAcceptancePipingSlice from "../Store/Piping/IssueReturnAcceptance/getIssueReturnAcceptancePiping";
import getIssueReturnAcceptanceSummaryPipingSlice from "../Store/Piping/IssueReturnAcceptance/getIssueReturnAcceptanceSummaryPiping";
export default configureStore({
  reducer: {
    login: adminLoginSlice,
    forgetPassword: adminForgetPasswordSlice,
    adminOtp: adminOtpSlice,
    resetAdminPassword: resetAdminPasswordSlice,
    adminGetParty: adminGetPartySlice,
    adminGetEmployee: adminGetEmployeeSlice,
    getFirm: getFirmSlice,

    // Admin APIS=========================================================================
    //====== Payroll

    getBank: getBankSlice,
    getAdminBank: getAdminBankSlice,
    addBank: addBankSlice,

    getShift: getShiftSlice,
    getAdminShift: getAdminShiftSlice,
    addShift: addShiftSlice,

    getGroup: getGroupSlice,
    getAdminGroup: getAdminGroupSlice,
    addGroup: addGroupSlice,

    getDesignation: getDesignationSlice,
    getAdminDesignation: getAdminDesignationSlice,
    addDesignation: addDesignationSlice,

    getAuthPerson: getAuthPersonSlice,
    getAdminAuth: getAdminAuthSlice,
    addAuthPerson: addAuthPersonSlice,

    getAdminSkill: getAdminSkillSlice,
    getSkill: getSkillSlice,
    addSkill: addSkillSlice,

    getEmployeeType: getEmployeeTypeSlice,
    getAdminEmployeeType: getAdminEmployeeTypeSlice,
    addEmployeeType: addEmployeeTypeSlice,

    getDepartment: getDepartmentSlice,
    getAdminDepartment: getAdminDepartmentSlice,
    addDepartment: addDepartmentSlice,

    getYear: getYearSlice,
    getAdminYear: getAdminYearSlice,
    addYearSlice: addYearSlice,

    adminGetPartyTag: adminGetPartyTagSlice,
    adminGetPartyGroup: adminGetPartyGroupSlice,

    getErpRole: getErpRoleSlice,
    getAdminErpRole: getAdminErpRoleSlice,
    addErpRoleSlice: addErpRoleSlice,

    getProduct: getProductSlice,
    getAdminProduct: getAdminProductSlice,
    addProductSlice: addProductSlice,

    // Admin Store
    getAdminItemData: getAdminItemDataSlice,
    getAdminContractor: AdminContractorMasterSlice,

    getAdminItemPipingData: getAdminItemPipingDataSlice,

    // admin main Store
    getAdminPurchaseRequest: getAdminPRSlice,
    getOnePR: getSinglePRSlice,
    getAdminPurchaseOrder: getAdminPOSlice,
    getOnePO: getSinglePOSlice,
    getAdminRecieving: getAdminPUSlice,
    getSinglePU: getSinglePUSlice,
    getAdminPurchaseReturn: getAdminPURSlice,
    getSinglePUR: getSinglePURSlice,
    getAdmiIssue: getAdmiIssueSlice,
    getSingleIss: getSingleIssSlice,
    getAdmiIssueReturn: getAdmiIssueReturnSlice,
    getSingleIsr: getSingleIsrSlice,
    getAdminStock: getAdminMainStockSlice,

    getAdminPMSStock: getAdminPMSStockSlice,

    getAdmindeshboard: getAdmindeshboardSlice,

    //get admin projects
    getAdminProject: getAdminProjectSlice,
    getAdminProjectType: getAdminProjectTypeSlice,
    GetProjectAttendance: GetProjectAttendanceSlice,
    getAdminProjectLocation: getAdminProjectLocationSlice,

    // Store =================================================

    userForgetPasswordSlice: userForgetPasswordSlice,
    userOtp: userOtpSlice,
    resetUserPassword: resetUserPasswordSlice,

    getUnit: getUnitSlice,
    getAdminUnit: getAdminUnitSlice,
    addUnit: addUnitSlice,

    getCategory: getCategorySlice,
    getAdminCategory: getAdminCategorySlice,
    addCategory: addCategorySlice,

    getTransport: getTransportSlice,
    getAdminTransport: getAdminTransportSlice,
    addTransport: addTransportSlice,

    getLocation: getLocationSlice,
    getAdminLocation: getAdminLocationSlice,
    addLocation: addLocationSlice,

    getParty: getPartySlice,
    getAdminParty: getAdminPartySlice,
    addParty: addPartySlice,

    getPartyGroup: getPartyGroupSlice,
    getAdminPartyGroup: getAdminPartyGroupSlice,
    addPartyGroup: addPartyGroupSlice,

    getUserDepartment: getUserDepartmentSlice,
    getUserEmployee: getUserEmployeeSlice,

    getPartyTag: getPartyTagSlice,

    getStoreAuthPerson: getStoreAuthPersonSlice,
    getAdminStoreAuth: getAdminStoreAuthSlice,
    addStoreAuthPerson: addStoreAuthPersonSlice,

    getItem: getItemSlice,
    getAdminItem: getAdminItemSlice,
    addItem: addItemSlice,

    AddPurchaseRequestSlice: AddPurchaseRequestSlice,
    getPurchaseRequest: getPurchaseRequestSlice,
    getSinglePurchaseRrequest: getSinglePurchaseRrequestSlice,

    getRequestAdmin: getRequestAdminSlice,
    getSingleAdminItem: getSingleAdminItemSlice,
    getCustomers: getCustomersReducer,
    //get gen Master
    getGenMaster: getGenMasterSlice,
    getGenTag: getGenTagSlice,

    //purchase order slice
    getVoucher: getPrSlice,
    getPrItems: getPrItemsSlice,
    addPurchaseorder: AddOrderSlice,
    getPurchaseorder: getOrderSlice,
    getSinglePurchaseorder: getSingleOrderSlice,

    //purchase recieving
    getPurchaseRecieving: getPurchaseRecievingSlice,
    getOnePrItems: getPurchaseRecievingItemsSlice,
    getPoNumbers: getPoNumberSlice,
    getPoItems: getPoItemsSlice,
    addPuItems: addPuSlice,

    //purchase return
    getPurchaseReturn: getPurchaseReturnSlice,
    getPurchaseReturnItems: getPurchaseReturnItemsSlice,
    getChallanNo: getChallanNoSlice,
    getBillNo: getBillNoSlice,
    getPRItems: getPRItemsSlice,
    getPUNo: getPUNumberSlice,

    //issue
    getPass: getPassSlice,
    addIssue: addIssueSlice,
    getIssue: getIssueSlice,
    getIssueItems: getIssueItemsSlice,
    getIssueItemReturn: getIssueItemReturnSlice,
    transactionReturn: transactionReturnSlice,

    //issue Return
    getIssueReturn: getIssueReturnSlice,
    getIssueReturnItems: getIssueReturnItemsSlice,
    getIssueChallan: getIssueChallanSlice,
    getIssueNo: getIssueNoSlice,
    getIssueGetPassNo: getIssueGetPassSlice,
    getIssueReturnLists: getIssueReturnListsSlice,
    addIssueReturn: addIssueReturnSlice,

    addPurchaseorderReturn: AddOrderReturnSlice,
    getPurchaseReturnorder: getOrderReturnSlice,
    getSingleReturn: getSingleOrderReturnSlice,

    getProject: getProjectSlice,
    getStoreEmployee: getStoreEmployeeSlice,

    getAdjustment: getAdjustmentSlice,
    // getItemStock: getItemStockSlice,
    getStoreDashboard: getStoreDashboardSlice,

    getTransactionItem: getTransactionItemSlice,

    getItemSummary: getItemSummarySlice,
    getItemLedger: getItemLedgerSlice,
    getReorderItems: getReorderItemsSlice,

    getUnitLocation: getUnitLocationSlice,

    // Erp =====================================================================
    //Planner ===============================
    getDrawing: getDrawingSlice,
    getUserProfile: getUserProfileSlice,
    getUserIssue: getUserIssueSlice,
    getRequest: getRequestSlice,
    getUserDrawTrasaction: getUserDrawTrasactionSlice,
    getUserAdminDraw: getUserAdminDrawSlice,
    getUserIssueRequest: getUserIssueRequestSlice,
    getUserOffer: getUserOfferSlice,
    getUserIssueAcceptance: getUserIssueAcceptanceSlice,
    getReleseNote: getReleseNoteSlice,

    //packing
    getPacking: getPackSlice,
    // Ececution ==============================================================
    getUserFitup: getUserFitupSlice,
    getUserWeldVisual: getUserWeldVisualSlice,

    getUserJointType: getUserJointTypeSlice,
    getUserNdtMaster: getUserNdtMasterSlice,
    getUserContractor: getUserContractorSlice,
    getUserPaintSystem: getUserPaintSystemSlice,

    getUserWpsMaster: getUserWpsMasterSlice,
    getUserWelderMaster: getUserWelderMasterSlice,
    getUserProcedureMaster: getUserProcedureMasterSlice,
    getUserPaintManufacture: getUserPaintManufactureSlice,

    getStockReport: getStockReportSlice,
    getStockReportList: getStockReportListSlice,

    getUserMainNdtMaster: getUserMainNdtMasterSlice,

    getUserNdtOffer: getUserNdtOfferSlice,

    getUserUtClearance: getUserUtClearanceSlice,
    getUserRtClearance: getUserRtClearanceSlice,

    getUserMptClearance: getUserMptClearanceSlice,
    getUserLptClearance: getUserLptClearanceSlice,

    getUserFinalDimension: getUserFinalDimensionSlice,
    getUserInspectionSummary: getUserInspectionSummarySlice,
    getUserGenInspectionSummary: getUserGenInspectionSummarySlice,
    getDispatchNotes: getDispatchNotesSlice,
    getMultiDispatch: getMultiDispatchSlice,
    getMainStoreStock: getMainStoreStockSlice,

    getMultiSurface: getMultiSurfcaeSlice,
    getMultiSurfaceOffer: getMultiSurfaceOfferSlice,
    getMultiSurfaceOfferViewPage: getMultiSurfaceOfferViewPageSlice,
    getSurfaceClearance: getSurfaceClearanceSlice,
    getUserSurface: getUserSurfaceSlice,
    getMainStock: getMainStockSlice,
    getUserMio: getUserMioSlice,
    getUserFinalCoating: getUserFinalCoatingSlice,

    getInvoice: getInvoiceSlice,
    getDpr: getDprSlice,
    getDmr: getDmrSlice,
    dmr: getDmrCategoriesSlice,


    //  Area
    getAreas: areaReducer,


    // Material MTO
    materialMto: materialMtoReducer,

    // Procurement Request
    getProcurementRequest: procurementRequestReducer,

    //Inquiry 
    getInquiry: inquiryReducer,

    // Order Placement
    orderPlacement: orderReducer,

    // Material Chart
    getMaterialChart: materialChartReducer,

    terms: termsSlice,   // ✅ FIXED

    // FIM
    getFIMidData: getFIMidDataSlice,

    //PMS
    getPmsStock: getPmsStockSlice,

    getUserProjectLocation: getUserProjectLocationSlice,

    // Mutiple =================================================================================================

    getMultipleIssueRequest: getMultipleIssueRequestSlice,
    getIssueAcceptanceMasterData: getIssueAcceptanceMasterDataSlice,
    getMultipleIssueAcc: getMultipleIssueAccSlice,

    getMultipleDrawItems: getMultipleDrawItemsSlice,
    getMultipleDrawingMasterData: getMultipleDrawingMasterDataSlice,
    updateMultiGrid: updateMultiGridSlice,

    getMultipleGrid: getMultipleGridSlice,

    updateIssueAccGrid: updateIssueAccGridSlice,
    getMultiFitup: getMultiFitupSlice,
    manageFitupOffTable: manageFitupOffTableSlice,

    getMultiWeldVisual: getMultiWeldVisualSlice,
    updateFitupGrid: updateFitupGridSlice,

    getFitupOfferTable: getFitupOfferTableSlice,
    removeFitupOffTable: removeFitupOffTableSlice,
    updateFitupOffTable: updateFitupOffTableSlice,

    getWeldOfferTable: getWeldOfferTableSlice,
    manageWeldOfferTable: manageWeldOfferTableSlice,
    updateWeldOffTable: updateWeldOffTableSlice,
    removeWeldOffTable: removeWeldOffTableSlice,

    updateNDTGrid: updateNDTGridSlice,
    manageNDTOfferTable: manageNDTOfferTableSlice,
    getNDTOfferTable: getNDTOfferTableSlice,
    removeNDTOffTable: removeNDTOffTableSlice,
    updateNDTOfferTable: updateNDTOffTableSlice,
    getUserMultiNdtMaster: getUserMultiNdtMasterSlice,

    getMultiNdtOffer: getMultiNdtOfferSlice,

    getMultiRtClearance: getMultiRtClearanceSlice,
    getMultiMptClearance: getMultiMptClearanceSlice,
    getMultiLptClearance: getMultiLptClearanceSlice,
    getMultiUtClearance: getMultiUtClearanceSlice,

    manageFdTable: manageFdTableSlice,
    updateNdtGrid: updateNdtGridSlice,
    removeFdTable: removeFdTableSlice,
    getFdTable: getFdTableSlice,

    updateFDOfferTable: updateFDOfferTableSlice,

    getMultiFd: getMultiFdSlice,

    manageRTOfferTable: manageRTOfferTableSlice,
    getMultiRtOfferTable: getMultiRtOfferTableSlice,
    removeRTTable: removeRTTableSlice,
    manageRTMultiOffer: manageRTMultiOfferSlice,

    getMultiUTOfferTable: getMultiUTOfferTableSlice,
    getMultiMPTOfferTable: getMultiMPTOfferTableSlice,
    getMultiLPTOfferTable: getMultiLPTOfferTableSlice,

    //  Paint
    getMultiDispatchPaint: getMultiDispatchPaintSlice,

    // slices for Mio
    getMultisurfaceMio: getMultiSurfaceMioSlice,
    getMultiSurfaceOfferMio: getMultiSurfaceOfferMioSlice,
    getMultiMio: getMultiMioSlice,
    getMultiMioIns: getMultiMioInsSlice,
    getMultiMioViewPage: getMultiMioViewPageSlice,
    getMultiMioClearance: getMultiMioClearanceSlice,

    // slices for final coating
    getMioListData: getMioListSlice,
    getMioFilterListData: getMioFilterListSlice,
    getMultiFinalCoat: getMultiFinalCoatSlice,
    GetFinalCoatClearance: getFinalCoatClearanceSlice,
    GetFinalCoatQcOffer: getFinalCoatQcOfferSlice,
    GetFinalCoatIns: GetFinalCoatInsSlice,
    GetFinalCoatOfferViewPage: getFinalCoatOfferViewPageSlice,
    // issue offer table

    getIssueOfferTable: getIssueOfferTableSlice,
    removeIssueOffTable: removeIssueOffTableSlice,
    manageIssueOffTableSlice: manageIssueOffTableSlice,
    updateIssueOffTable: updateIssueOffTableSlice,

    // Release Note list
    GetMultiReleaseNote: GetMultiReleaseNoteSlice,
    GetMultiGenReleaseNote: GetMultiGenReleaseNoteSlice,

    //packing list
    getMultiPacking: getMultiPackingSlice,
    getMultiPackingList: getMultiPackingListSlice,

    getLoginFirm: getLoginFirmSlice,
    getLoginProject: getLoginProjectSlice,

    getMultiInvoice: getMultiInvoiceSlice,

    getMultiDrawingItems: getMultiDrawingItemsSlice,
    getMultiGrids: getMultiGridsSlice,


    getReusableList: getReusableListSlice,
    getPipingStockReportList: getPipingStockReportListSlice,

    // Super Admin ======================================================

    getSuperDpr: getSuperDprSlice,

    getItemCategoryWiseReportList: getItemCategoryWiseReportListSlice,
    getIssueReturnOfferTable:getIssueReturnOfferTableSlice,
    getMultipleIssueReturn:getMultipleIssueReturnSlice,

    getIssueReturnAcceptance:getIssueReturnAcceptanceSlice,
    getIssueReturnAcceptanceSummary:getIssueReturnAcceptanceSummarySlice,
    // // Piping ======================================================

    getUserWpsMasterPiping: getUserWpsMasterPipingReducer,
    getUserWelderMasterPiping: getUserWelderMasterPipingReducer,
    getUserPaintRequirementMaster: getUserPaintRequirementMasterReducer,
    getUserFinalCoatShadeMaster: getUserFinalCoatShadeMasterReducer,
getUserPaintManufacturePiping:getUserPaintManufacturePipingSlice,
    getUserNdtPipingMaster: getUserNDTPipingReducer,

    getUserPwhtMaster: getUserPwhtMasterReducer,
    getUserHardnessMaster: getUserHardnessMasterReducer,

    getUserPaintSystemPiping: getUserPaintSystemPipingReducer,
    getUserProcedureMasterPiping: getUserProcedureMasterPipingReducer,

    getUserPipingClassMaster: getUserPipingClasseMasterReducer,
    getUserJointTypePiping: getUserJointTypePipingSlice,

    getDprPiping: getDprPipingSlice,
    getDrawingPiping: getDrawingPipingSlice,
    getDrawingMaterialMasterData: getDrawingmaterialMasterDataSlice,
    getDrawingJointMasterData: getDrawingJointMasterDataSlice,
    getMaterialEntryItems: getMaterialEntryItemsSlice,
    getMaterialEntryItemsForIssueRequest: getMaterialEntryItemsForIssueRequestSlice,
    getJointEntryItems: getJointEntryItemsSlice,
    getDrawingAreaInchMeterMasterData: getDrawingAreaInchMeterMasterDataSlice,
    getSpoolNo: getSpoolNoSlice,
    getDrawingSpool: getDrawingSpoolSlice,
    addItemDetails: addItemDetailsSlice,
    getAdminItemDetails: getAdminItemDetailsSlice,
    getItemDetails: getItemDetailsSlice,

    getItemCategory: getItemCategorySlice,
    getAdminItemCategory: getAdminItemCategorySlice,
    addItemCategory: addItemCategorySlice,

    getUOM: getUOMSlice,
    getAdminUOM: getAdminUOMSlice,
    addUOM: addUOMSlice,

    getSize: getSizeSlice,
    getAdminSize: getAdminSizeSlice,
    addSize: addSizeSlice,
    addNdtContractor: addNdtContractorSlice,
    getNdtContractor: getNdtContractorSlice,

    getPipingMaterialSpecifications: pipingmaterialspecificationReducer,

    getThickness: getThicknessSlice,
    getAdminThickness: getAdminThicknessSlice,
    addThickness: addThicknessSlice,

    MaterialControlList: MaterialControlListReducer,

    getIssueOfferTablePiping: getIssueOfferTablePipingSlice,



    getMultiPipeInvoice: getMultiPipeInvoiceSlice,
    getMultipleIssueRequestPiping: getMultipleIssueRequestPipingSlice,
    getIssueAcceptancePiping: getIssueAcceptancePipingSlice,
    getIssueAcceptanceMasterDataPiping:getIssueAcceptanceMasterDataPipingSlice,

    getOfferDataforPackaing: getOfferDataforPackaingSlice,
    pipingGetMultiPacking: pipingGetMultiPackingSlice,
    getMultiPackingPipingList: getMultiPackingPipingListSlice,
    getMultiPackingSummaryPiping:getMultiPackingSummaryPipingSlice,

    manageFitupOffTablePiping: manageFitupOffTablePipingSlice,

    fetchPipingIssueDrawingIds: pipingIssueDrawingIdReducer,

    getPipingDispatchNotes: getPipingDispatchNotesSlice,
    getDrawingJointWisePiping: getDrawingJointWisePipingSlice,
    manageFitupOffTablePiping: manageFitupOffTablePipingSlice,
    updateFitupOffTablePiping: updateFitupOffTablePipingSlice,
    removeFitupOffTablePiping: removeFitupOffTablePipingSlice,
    getFitupOfferTablePiping: getFitupOfferTablePipingSlice,
    getMultiFitupPiping: getMultiFitupPipingSlice,

    // getDrawingSpoolNoFitUp:getDrawingSpoolNoFitUpSlice,
    getDrawingSpoolNoFitUp: getDrawingSpoolNoFitUpReducer,


    getFitUpDrawingDataForDpt: getFitUpDrawingDataForDptSlice,
    getDptOffer: getDptOfferSlice,
    getMultiDptPiping: getMultiDptPipingSlice,

    getFitUpDrawingDataForWeldVisual: getFitUpDrawingDataForWeldVisualSlice,
    getWeldVisualOffer: getWelVisualOfferSlice,
    getMultiWeldVisualPiping: getMultiWeldVisualPipingSlice,
    //  Paint
    getPipingMultiDispatchPaint: getPipingMultiDispatchPaintSlice,
    getPipingMultiSurface: getPipingMultiSurfaceSlice,
    getPipingMultiSurfaceOffer: getPipingMultiSurfaceOfferSlice,

    getPipingMultisurfaceMio: getPipingMultiSurfaceMioSlice,






    // IRN 
    GetMultiReleaseNotePiping: GetMultiReleaseNoteSlicePiping,
    GetMultiGenReleaseNotePiping: GetMultiGenReleaseNotePipingSlice,

    getPipingMultiMio: getPipingMultiMioSlice,

    getPipingMultiMioViewPage: getPipingMultiMioViewPageSlice,
    getPipingMultiMioClearance: getPipingMultiMioClearanceSlice,
    getPipingMioListData: getPipingMioListSlice,
    getPipingMultiFinalCoat: getPipingMultiFinalCoatSlice,
    GetPipingFinalCoatIns: GetPipingFinalCoatInsSlice,


    NDTOfferData: NDTOfferDataSlice,

    fetchRTOfferData: RTOfferSlice,
    getMultiRtClearancepiping: RTClearnacePipingSlice,

    // NDT Percentage
    //===========================NDT===================================
    getPwhtNdtDataFromWeldVisualPiping:getPwhtNdtDataFromWeldVisualPipingSlice,
    getPwhtOffer:getPwhtOfferSlice,
    getPwhtInspectionPiping:getPwhtInspectionPipingSlice,

    getNDTPercentage: getNDTPercentageSlice,
    // getPwhtNdtDataFromWeldVisualPiping:getPwhtNdtDataFromWeldVisualPipingSlice,
    // getUserWeldFtPiping: getUserWeldFtPipingSlice,
    // getUserFt: getUserFtReducer,
    // getUserFtAdded: getUserFtAddedReducer,
    // getFtClearance: getFtClearanceSlice,
    // getUserWeldHardnessPiping: getUserWeldHardnessPipingReducer,












    // RT LOT Book 
    fetchRTLotOfferData: RTLotOfferSlice,
    getMultiRtLotPiping: RTLotPipingSlice,
    getMultiRtPendingpiping: RTPendingPipingSlice,

    fetchMPTLotOfferData: MPTLotOfferSlice,
    getMultiMptLotPiping: MPTLotPipingSlice,

    // MPT
    MPTOfferData: MPTOfferDataSlice,
    fetchMPTOfferData: MPTOfferSlice,
    getMultiMptClearancepiping: MPTClearancePipingSlice,
    getMultiMptPendingpiping: MPTPendingPipingSlice,
    getPipingFimData: getPipingFimDataSlice,
    getUserWeldFtPiping: getUserWeldFtPipingSlice,
    getUserFt: getUserFtReducer,
    getUserFtAdded: getUserFtAddedReducer,
    getFtClearance: getFtClearanceSlice,
    getUserWeldHardnessPiping: getUserWeldHardnessPipingReducer,
    getUserHt: getUserHtReducer,
    getUserHtAdded: getUserHtAddedReducer,
    getUserWeldPmiPiping: getUserWeldPmiPipingReducer,
    getUserPmi: getUserPmiReducer,
    getUserPmiAdded: getUserPmiAddedReducer,
    getUserWeldPicklingPiping: getUserWeldPicklingPipingReducer,
    getUserPickling: getUserPicklingReducer,
    getUserPicklingAdded: getUserPicklingAddedReducer,


 // LPT LOT Book 
    getLptLotNdtDataFromWeldVisualPiping:getLptLotNdtDataFromWeldVisualPipingSlice,
    fetchLPTLotOfferData:LPTLotOfferSlice,
    getMultiLptLotPiping:LPTLotPipingSlice,

    //LPT NDT
     getLptNdtDataFromWeldVisualPiping:getLptNdtDataFromWeldVisualPipingSlice,
     getLptOffer:getLptOfferSlice,
     getLptNdtInspectionPiping:getLptNdtInspectionPipingSlice,




    //  Final Dimension
    getFdDataFromNdt:getFdDataFromNdtSlice,
    getFdOfferTablePiping:getFdOfferTablePipingSlice,
    getMultiFdPiping:getMultiFdPipingSlice,

    // Pressure Test
    getPressureTestDataFromFd:getPressureTestDataFromFdSlice,
    getPressureTestOfferTablePiping:getPressureTestOfferTablePipingSlice,
    getPressureTestInspectionPiping:getPressureTestInspectionPipingSlice,

    //Line History Sheet
    getLineHistorySheetDataPiping:getLineHistorySheetDataPipingSlice,
    
    NdtSummary:NdtSummarySlice,
    getGenLineHistorySheetPiping:getGenLineHistorySheetPipingSlice,

    getDataForSpoolBreakUp:getDataForSpoolBreakUpSlice,
    getSpoolBreakUpSummary:getSpoolBreakUpSummarySlice,


      //  Area
    getAreas: areaPiping,
    termsPiping: termsPipingReducer,

    getItemCategoryWiseStockReportList: getItemCategoryWiseStockReportListSlice,
    getStockIssueOfferTablePiping: getStockIssueOfferTablePipingSlice,
    getStockIssueRequestPiping:getStockIssueRequestPipingSlice,
    getStockIssueAcceptancePiping:getStockIssueAcceptancePipingSlice,
    getStockIssueAcceptanceMasterDataPiping:getStockIssueAcceptanceMasterDataPipingSlice,
    getPipingProcurementRequest: pipingProcurementRequestReducer,


      getOfferDataforStockPackaing: getOfferDataforStockPackaingSlice,
    pipingGetMultiStockPacking: pipingGetMultiStockPackingSlice,
    getMultiStockPackingPipingList: getMultiStockPackingPipingListSlice,
    getMultiStockPacking:getMultiStockPackingSlice,
    getMultiStockPackingSummaryPiping:getMultiStockPackingSummaryPipingSlice,


    getPipingStockDispatchNotes:getPipingStockDispatchNotesSlice,
    getDispatchNoteItemFromStockIssueAcc:getDispatchNoteItemFromStockIssueAccSlice,



      getPipingMultiStockDispatchPaint: getPipingMultiStockDispatchPaintSlice,
    getPipingMultiStockSurface: getPipingMultiStockSurfaceSlice,
    getPipingMultiStockSurfaceOffer: getPipingMultiStockSurfaceOfferSlice,


    getPipingMultiStockMio:getPipingMultiStockMioSlice,
    getMultiStockMioIns:getMultiStockMioInsSlice,
    getPipingMultiStockMioViewPage:getPipingMultiStockMioViewPageSlice,
    getPipingMultiStockMioClearance: getPipingMultiStockMioClearanceSlice,
    getStockSurfaseDataInMio:getStockSurfaseDataInMioSlice,

    getPipingMultiStockFinalCoat:getPipingMultiStockFinalCoatSlice,
    getPipingStockMioList:getPipingStockMioListSlice,
    getPipingStockFinalCoatIns:getPipingStockFinalCoatInsSlice,
    getStockMioDataInFinalCoat:getStockMioDataInFinalCoatSlice,



        GetMultiStockReleaseNotePiping: GetMultiStockReleaseNoteSlicePiping,
    GetMultiGenStockReleaseNotePiping: GetMultiGenStockReleaseNotePipingSlice,

    getPipingPMS:getPipingPMSSlice,
    getUserOfferPiping:getUserOfferPipingSlice,
    getProjectFrontAvailabilitySummary:getProjectFrontAvailabilitySummarySlice,


    getIssueReturnOfferTablePiping:getIssueReturnOfferTablePipingSlice,
    getMultipleIssueReturnPiping:getMultipleIssueReturnPipingSlice,
    getIssueReturnAcceptancePiping:getIssueReturnAcceptancePipingSlice,
    getIssueReturnAcceptanceSummaryPiping:getIssueReturnAcceptanceSummaryPipingSlice,

    // Client
    getClientMultiFitup: getClientMultiFitupSlice,

    // Product Store
    getProductParty: getProductPartySlice,
  },
});
