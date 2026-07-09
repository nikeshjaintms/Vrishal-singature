import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../../Pages/Erp/Planner/Dashboard/Dashboard';
import Drawing from '../../Pages/Erp/Planner/Drawing/Drawing';
import PurchaseRequest from '../../Pages/Erp/Planner/Request/Purchase/PurchaseRequest';
import ManagePurchaseRequest from '../../Pages/Erp/Planner/Request/Purchase/ManagePurchaseRequest';
import ManageDrawing from '../../Pages/Erp/Planner/Drawing/ManageDrawing';
import Project from '../../Pages/Erp/Planner/Project/Project';
import ViewDrawing from '../../Pages/Erp/Planner/Drawing/ViewDrawing';

const Planner = () => {
    return (
        <>
            <Routes>
                <Route path='/erp/user/planner/dashboard' element={<Dashboard />} />

                <Route path='/erp/user/planner/project-management' element={<Project />} />

                <Route path='/erp/user/planner/drawing-management' element={<Drawing />} />
                <Route path='/erp/user/planner/view-drawing-management' element={<ViewDrawing />} />
                <Route path='/erp/user/planner/manage-drawing' element={<ManageDrawing />} />

                <Route path='/erp/user/planner/purchase-request-management' element={<PurchaseRequest />} />
                <Route path='/erp/user/planner/manage-purchase-request' element={<ManagePurchaseRequest />} />

                <Route path='/erp/user/planner/*' element={<Navigate to='/erp/user/planner/dashboard' />} />
            </Routes>
        </>
    )
}

export default Planner