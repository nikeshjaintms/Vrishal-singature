import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../../Pages/Erp/Qc/Dashboard/Dashboard';
import Project from '../../Pages/Erp/Qc/Project/Project';

const QcUser = () => {

    return (
        <>
            <Routes>
                <Route path='/erp/user/qc/dashboard' element={<Dashboard />} />

                <Route path='/erp/user/qc/project-management' element={<Project />} />


                <Route path='/erp/user/qc/*' element={<Navigate to='/erp/user/qc/dashboard' />} />
            </Routes>
        </>
    )
}

export default QcUser