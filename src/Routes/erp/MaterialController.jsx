import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../../Pages/Erp/MaterialController/Dashboard/Dashboard';
import Project from '../../Pages/Erp/MaterialController/Project/Project';

const MaterialController = () => {
    return (
        <>
            <Routes>
                <Route path='/erp/user/material-controller/dashboard' element={<Dashboard />} />

                <Route path='/erp/user/material-controller/project-management' element={<Project />} />

                <Route path='/erp/user/material-controller/*' element={<Navigate to='/erp/user/material-controller/dashboard' />} />
            </Routes>
        </>
    )
}

export default MaterialController