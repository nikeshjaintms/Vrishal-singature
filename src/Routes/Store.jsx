import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../Pages/Store/Login/Login';
import Dashboard from '../Pages/Store/Dashboard/Dashboard';
import Unit from '../Pages/Store/StoreMaster/Unit/Unit';
import ManageUnit from '../Pages/Store/StoreMaster/Unit/ManageUnit';
import Category from '../Pages/Store/StoreMaster/Category/Category';
import ManageCategory from '../Pages/Store/StoreMaster/Category/ManageCategory';
import Transport from '../Pages/Store/StoreMaster/Transport/Transport';
import ManageTransport from '../Pages/Store/StoreMaster/Transport/ManageTransport';
import Location from '../Pages/Store/StoreMaster/InventoryLocation/Location';
import ManageLocation from '../Pages/Store/StoreMaster/InventoryLocation/ManageLocation';
import Project from '../Pages/Store/Project/Project';
import ManageProject from '../Pages/Store/Project/ManageProject';
import PartyGroup from '../Pages/Store/StoreMaster/PartyGroup/PartyGroup';
import ManagePartyGroup from '../Pages/Store/StoreMaster/PartyGroup/ManagePartyGroup';
import Stock from '../Pages/Store/Stock/Stock';
import ManageStock from '../Pages/Store/Stock/ManageStock';
import TransferStock from '../Pages/Store/Stock/TransferStock';
import Party from '../Pages/Store/Party/Party';
import ManageParty from '../Pages/Store/Party/ManageParty';
import ForgetPassword from '../Pages/Store/Login/ForgetPassword';
import Otp from '../Pages/Store/Login/Otp';
import ResetPassword from '../Pages/Store/Login/ResetPassword';
import Item from '../Pages/Store/Item/Item';
import ManageItem from '../Pages/Store/Item/ManageItem';
// import Purchase from '../Pages/Store/Transaction/Purchase/Purchase';
// import Sales from '../Pages/Store/Transaction/Sale/Sales';
// import SalesOrder from '../Pages/Store/Transaction/Sale/SalesOrder';
// import ManageSaleOrder from '../Pages/Store/Transaction/Sale/ManageSaleOrder';
// import SalesReturn from '../Pages/Store/Transaction/Sale/SalesReturn';
import AdjustmentTable from '../Pages/Store/Adjustment/AdjustmentTable';
import ManageIssue from '../Pages/Store/Transaction/Issue/ManageIssue';
import Issue from '../Pages/Store/Transaction/Issue/Issue';
import ViewIssueItems from '../Pages/Store/Transaction/Issue/ViewIssueItems';
import EditIssue from '../Pages/Store/Transaction/Issue/EditIssue';
import GenMaster from '../Pages/Store/StoreMaster/GenMaster/GenMaster';
import ManageGenMaster from '../Pages/Store/StoreMaster/GenMaster/ManageGenMaster';
import ReOrderItems from '../Pages/Store/Report/ReOrderItems';
import ItemSummary from '../Pages/Store/Report/ItemSummary';
import ItemLedger from '../Pages/Store/Report/ItemLedger';
import PurchaseSummary from '../Pages/Store/Report/PurchaseSummary';
import PurchaseReturnSummary from '../Pages/Store/Report/PurchaseReturnSummary';
import IssueSummary from '../Pages/Store/Report/IssueSummary';
import IssueReturnSummary from '../Pages/Store/Report/IssueReturnSummary';
import EditProfile from '../Pages/Store/Profile/EditProfile';
import ManagePurchaseRequestDetail from '../Pages/Store/Transaction/Purchase Request/ManagePurchaseRequestDetail';
import GetPurchaseRequest from '../Pages/Store/Transaction/Purchase Request/GetPurchaseRequest';

import GetPurchaseRequestViaReorder from '../Pages/Store/Transaction/Purchase-Request-Via-Reorder/GetPurchaseRequestViaReorder';
import ManagePurchaseRequestDetailViaReorder from '../Pages/Store/Transaction/Purchase-Request-Via-Reorder/ManagePurchaseRequestDetailViaReorder';
import ViewPurchaseRequestViaReorder from '../Pages/Store/Transaction/Purchase-Request-Via-Reorder/ViewPurchaseRequestViaReorder';
import EditPurchaseRequestViaReorder from '../Pages/Store/Transaction/Purchase-Request-Via-Reorder/EditPurchaseRequestViaReorder';
import EditOrderViaReorder  from '../Pages/Store/Transaction/Purchase-Request-Via-Reorder/EditOrderViaReorder ';

import ViewPurchaseRequest from '../Pages/Store/Transaction/Purchase Request/ViewPurchaseRequest';
import EditPurchaseRequest from '../Pages/Store/Transaction/Purchase Request/EditPurchaseRequest';

import Recieving from '../Pages/Store/Transaction/Purchase-Recieving/Recieving';
import ManageRecieving from '../Pages/Store/Transaction/Purchase-Recieving/ManageRecieving';
import EditRecieving from '../Pages/Store/Transaction/Purchase-Recieving/EditRecieving';
import ViewRecievingItems from '../Pages/Store/Transaction/Purchase-Recieving/ViewRecievingItems';
import Order from '../Pages/Store/Transaction/Purchase Order/Order';
import EditOrder from '../Pages/Store/Transaction/Purchase Order/EditOrder';
import MenageOrder from '../Pages/Store/Transaction/Purchase Order/MenageOrder';
import ViewOrderItems from '../Pages/Store/Transaction/Purchase Order/ViewOrder';
import PurchaseReturn from '../Pages/Store/Transaction/Purchase-Return/PurchaseReturn';
import ManagePurchaseReturn from '../Pages/Store/Transaction/Purchase-Return/ManagePurchaseReturn';
import ViewPurchaseReturn from '../Pages/Store/Transaction/Purchase-Return/ViewPurchaseReturn';
import EditPurchaseReturn from '../Pages/Store/Transaction/Purchase-Return/EditPurchaseReturn';
import IssueReturn from '../Pages/Store/Transaction/Issue-Return/IssueReturn';
import ManageIssueReturn from '../Pages/Store/Transaction/Issue-Return/ManageIssueReturn';
import EditIssueReturn from '../Pages/Store/Transaction/Issue-Return/EditIssueReturn';
import ViewIssueReturn from '../Pages/Store/Transaction/Issue-Return/ViewIssueReturn';
import ManageItemReturn from '../Pages/Store/Transaction/Item-Return/ManageItemReturn';
import UnitLocation from '../Pages/Store/StoreMaster/UnitLocation/UnitLocation';
import ManageUnitLocation from '../Pages/Store/StoreMaster/UnitLocation/ManageUnitLocation';
import SLogin from '../Pages/Users/Login/Login';
import PartyLogin from '../Pages/Client/Login/Login';


const Store = () => {

  return (
    <>
      <Routes>
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/structual/login" element={<SLogin />} />
        <Route path="/party/login" element={<PartyLogin />} />

        <Route path='/user/forget-password' element={<ForgetPassword />} />
        <Route path='/user/otp-verification' element={<Otp />} />
        <Route path='/user/reset-password' element={<ResetPassword />} />
        <Route path='/user/edit-profile' element={<EditProfile />} />
        <Route path='/main-store/user/dashboard' element={<Dashboard />} />

        <Route path='/main-store/user/unit-management' element={<Unit />} />
        <Route path='/main-store/user/manage-unit' element={<ManageUnit />} />

        <Route path='/main-store/user/category-management' element={<Category />} />
        <Route path='/main-store/user/manage-category' element={<ManageCategory />} />

        <Route path='/main-store/user/transport-management' element={<Transport />} />
        <Route path='/main-store/user/manage-transport' element={<ManageTransport />} />

        <Route path='/main-store/user/inventory-location-management' element={<Location />} />
        <Route path='/main-store/user/manage-inventory-location' element={<ManageLocation />} />

        <Route path='/main-store/user/party-management' element={<Party />} />
        <Route path='/main-store/user/manage-party' element={<ManageParty />} />

        <Route path='/main-store/user/project-management' element={<Project />} />
        <Route path='/main-store/user/manage-project' element={<ManageProject />} />

        <Route path='/main-store/user/party-group-management' element={<PartyGroup />} />
        <Route path='/main-store/user/manage-party-group' element={<ManagePartyGroup />} />

        <Route path='/main-store/user/stock-management' element={<Stock />} />
        <Route path='/main-store/user/manage-stock' element={<ManageStock />} />
        <Route path='/main-store/user/transfer-stock' element={<TransferStock />} />


        <Route path='/main-store/user/item-management' element={<Item />} />
        <Route path='/main-store/user/manage-item' element={<ManageItem />} />

        <Route path='/main-store/user/general-master-management' element={<GenMaster />} />
        <Route path='/main-store/user/manage-general-master' element={<ManageGenMaster />} />
        {/* purchase order*/}

        {/*  */}

        {/* purchase Routes */}
        {/* <Route path='/main-store/user/purchase-order-management' element={<Order />} />
        <Route path='/main-store/user/manage-purchase-order' element={<ManagePurchaseOrder />} />
        <Route path='/main-store/user/view-purchase-order' element={<ViewPurchaseOrderItems />} />
        <Route path='/main-store/user/purchase-order-manage' element={<EditPurchaseOrder />} /> */}

        {/* purchase Requast routes */}
        <Route path='/main-store/user/getPurchaseRequest' element={<GetPurchaseRequest />} />
        <Route path='/main-store/user/manage-purchase-request' element={<ManagePurchaseRequestDetail />} />
        <Route path='/main-store/user/view-purchase-request' element={<ViewPurchaseRequest />} />
        <Route path='/main-store/user/edit-purchase-request-manage' element={<EditPurchaseRequest />} />
        <Route path='/main-store/user/order-manage' element={<EditOrder />} />
     
                    
           {/* purchase Requast Via Re-Order routes */}
        <Route path='/main-store/user/getPurchaseRequestViaReorder' element={<GetPurchaseRequestViaReorder />} />
        <Route path='/main-store/user/manage-purchase-request-via-reorder' element={<ManagePurchaseRequestDetailViaReorder />} />
        <Route path='/main-store/user/view-purchase-request-via-reorder' element={<ViewPurchaseRequestViaReorder />} />
        <Route path='/main-store/user/edit-purchase-request-manage-via-reorder' element={<EditPurchaseRequestViaReorder />} />
        <Route path='/main-store/user/order-manage-via-reorder' element={<EditOrderViaReorder />} />

        {/* purchase Return routes */}
        <Route path='/main-store/user/purchase-return-management' element={<PurchaseReturn />} />
        <Route path='/main-store/user/manage-purchase-return' element={<ManagePurchaseReturn />} />
        <Route path='/main-store/user/view-purchase-return' element={<ViewPurchaseReturn />} />
        <Route path='/main-store/user/return-order-manage' element={<EditPurchaseReturn />} />

        {/* purchase order routes */}
        <Route path='/main-store/user/order-management' element={<Order />} />
        <Route path='/main-store/user/order-manage' element={<EditOrder />} />
        <Route path='/main-store/user/manage-order' element={<MenageOrder />} />
        <Route path='/main-store/user/view-order' element={<ViewOrderItems />} />
        {/* End PO Routes */}

        {/* purchase Recieving routes */}
        <Route path='/main-store/user/recieving-management' element={<Recieving />} />
        <Route path='/main-store/user/manage-recieving' element={<ManageRecieving />} />
        <Route path='/main-store/user/recieving-manage' element={<EditRecieving />} />
        <Route path='/main-store/user/view-recieving' element={<ViewRecievingItems />} />

        {/* issue routes */}
        <Route path='/main-store/user/issue-purchase-management' element={<Issue />} />
        <Route path='/main-store/user/manage-purchase-issue' element={<ManageIssue />} />
        <Route path='/main-store/user/view-issue' element={<ViewIssueItems />} />
        <Route path='/main-store/user/edit-issue-manage' element={<EditIssue />} />

        {/* issue return routes */}
        <Route path='/main-store/user/issue-purchase-return-management' element={<IssueReturn />} />
        <Route path='/main-store/user/edit-issue-return-manage' element={<EditIssueReturn />} />
        <Route path='/main-store/user/manage-purchase-issue-return' element={<ManageIssueReturn />} />
        <Route path='/main-store/user/view-issue-return' element={<ViewIssueReturn />} />
        <Route path='/main-store/user/item-records-management' element={<AdjustmentTable />} />

        
        {/* items return routes */}
        {/* <Route path='/main-store/user/issue-purchase-return-management' element={<IssueReturn />} />
        <Route path='/main-store/user/edit-issue-return-manage' element={<EditIssueReturn />} /> */}
        <Route path='/main-store/user/manage-purchase-item-return' element={<ManageItemReturn />} />
        {/* <Route path='/main-store/user/view-issue-return' element={<ViewIssueReturn />} />
        <Route path='/main-store/user/item-records-management' element={<AdjustmentTable />} /> */}

        {/* Report */}
        <Route path='/main-store/user/reorder-items' element={<ReOrderItems />} />
        <Route path='/main-store/user/item-summary' element={<ItemSummary />} />
        <Route path='/main-store/user/item-ledger' element={<ItemLedger />} />
        <Route path='/main-store/user/purchase-summary' element={<PurchaseSummary />} />
        <Route path='/main-store/user/purchase-return-summary' element={<PurchaseReturnSummary />} />
        <Route path='/main-store/user/issue-summary' element={<IssueSummary />} />
        <Route path='/main-store/user/issue-return-summary' element={<IssueReturnSummary />} />


        <Route path='/main-store/user/unit-location-management' element={<UnitLocation />} />
        <Route path='/main-store/user/manage-unit-location' element={<ManageUnitLocation />} />


        < Route path='/main-store/user/*' element={<Navigate to='/main-store/user/dashboard' />} />
      </Routes>
    </>
  )
}

export default Store