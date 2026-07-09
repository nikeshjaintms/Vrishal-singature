import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../Pages/ProductStore/Dashboard/Dashboard';
import Unit from '../Pages/ProductStore/StoreMaster/Unit/Unit';
import ManageUnit from '../Pages/ProductStore/StoreMaster/Unit/ManageUnit';
import ManageCategory from '../Pages/ProductStore/StoreMaster/Category/ManageCategory';
import Category from '../Pages/ProductStore/StoreMaster/Category/Category';
import Transport from '../Pages/ProductStore/StoreMaster/Transport/Transport';
import ManageTransport from '../Pages/ProductStore/StoreMaster/Transport/ManageTransport';
import Location from '../Pages/ProductStore/StoreMaster/InventoryLocation/Location';
import ManageLocation from '../Pages/ProductStore/StoreMaster/InventoryLocation/ManageLocation';
import PartyGroup from '../Pages/ProductStore/StoreMaster/PartyGroup/PartyGroup';
import ManagePartyGroup from '../Pages/ProductStore/StoreMaster/PartyGroup/ManagePartyGroup';
import Party from '../Pages/ProductStore/Party/Party';
import ManageParty from '../Pages/ProductStore/Party/ManageParty';
import Stock from '../Pages/ProductStore/Stock/Stock';
import AdjustmentTable from '../Pages/ProductStore/Adjustment/AdjustmentTable';
import PurchaseOrder from '../Pages/ProductStore/Transaction/Purchase/PurchaseOrder';
import ManagePurchaseOrder from '../Pages/ProductStore/Transaction/Purchase/ManagePurchaseOrder';
import SalesOrder from '../Pages/ProductStore/Transaction/Sale/SalesOrder';
import ManageSaleOrder from '../Pages/ProductStore/Transaction/Sale/ManageSaleOrder';
import Profile from '../Pages/ProductStore/Profile/Profile';
import Request from '../Pages/ProductStore/Request/Request';
import Item from '../Pages/ProductStore/Item/Item';
import ManageItem from '../Pages/ProductStore/Item/ManageItem';
import Project from '../Pages/ProductStore/Project/Project';


const ProductStore = () => {
    return (
        <>
            <Routes>
                <Route path='/product-store/user/dashboard' element={<Dashboard />} />

                <Route path='/product-store/user/edit-profile' element={<Profile />} />

                <Route path='/product-store/user/unit-management' element={<Unit />} />
                <Route path='/product-store/user/manage-unit' element={<ManageUnit />} />

                <Route path='/product-store/user/category-management' element={<Category />} />
                <Route path='/product-store/user/manage-category' element={<ManageCategory />} />

                <Route path='/product-store/user/transport-management' element={<Transport />} />
                <Route path='/product-store/user/manage-transport' element={<ManageTransport />} />

                <Route path='/product-store/user/inventory-location-management' element={<Location />} />
                <Route path='/product-store/user/manage-inventory-location' element={<ManageLocation />} />

                <Route path='/product-store/user/party-group-management' element={<PartyGroup />} />
                <Route path='/product-store/user/manage-party-group' element={<ManagePartyGroup />} />

                <Route path='/product-store/user/party-management' element={<Party />} />
                <Route path='/product-store/user/manage-party' element={<ManageParty />} />

                <Route path='/product-store/user/purchase-order-management' element={<PurchaseOrder />} />
                <Route path='/product-store/user/manage-purchase-order' element={<ManagePurchaseOrder />} />

                <Route path='/product-store/user/sales-order-management' element={<SalesOrder />} />
                <Route path='/product-store/user/manage-sales-order' element={<ManageSaleOrder />} />

                <Route path='/product-store/user/item-records-management' element={<AdjustmentTable />} />
                <Route path='/product-store/user/stock-management' element={<Stock />} />

                <Route path='/product-store/user/item-management' element={<Item />} />
                <Route path='/product-store/user/manage-item' element={<ManageItem />} />

                <Route path='/product-store/user/request-management' element={<Request />} />

                <Route path='/product-store/user/project-management' element={<Project />} />

                <Route path='/product-store/user/*' element={<Navigate to='/product-store/user/dashboard' />} />
            </Routes>
        </>
    )
}

export default ProductStore