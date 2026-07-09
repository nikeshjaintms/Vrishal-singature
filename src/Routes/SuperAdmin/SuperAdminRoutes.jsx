import React, { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SUPER_ROUTE_URLS, { SUPER_BASE_URL } from './SuperRoutes'
import SAdminLogin from '../../Pages/SuperAdmin/auth/SAdminLogin'
import SuperOutlet from './SuperOutlet'
import SuperDashboard from '../../Pages/SuperAdmin/pages/Dashboard/SuperDashboard'
import SuperDmr from '../../Pages/SuperAdmin/pages/DMR/SuperDmr'
import SuperDpr from '../../Pages/SuperAdmin/pages/DPR/SuperDpr'
import RequireSuperAuth from './auth/RequireSuperAuth'
import toast from 'react-hot-toast'

const SuperAdminRoutes = () => {

    const location = useLocation();
    const didMountRef = useRef(false);
    useEffect(() => {
        if (didMountRef.current && location.state?.message) {
            toast.error(location.state.message);
        } else {
            didMountRef.current = true;
        }
    }, [location]);


    return (
        <>
            <Routes>
                <Route path={SUPER_ROUTE_URLS.LOGIN} element={<SAdminLogin />} />

                <Route path={SUPER_BASE_URL} element={
                    <RequireSuperAuth>
                        <SuperOutlet />
                    </RequireSuperAuth>
                }>
                    <Route path={SUPER_ROUTE_URLS.HOME} element={<SuperDashboard />} />
                    <Route path={SUPER_ROUTE_URLS.DMR} element={<SuperDmr />} />
                    <Route path={SUPER_ROUTE_URLS.DPR} element={<SuperDpr />} />

                </Route>

                <Route path={`${SUPER_BASE_URL}/*`} element={<Navigate to={SUPER_ROUTE_URLS.HOME} />} />
            </Routes>
        </>
    )
}

export default SuperAdminRoutes