import React from 'react'
import { Navigate } from 'react-router-dom'
import SUPER_ROUTE_URLS from '../SuperRoutes'

const RequireSuperAuth = ({ children }) => {
    const token = localStorage.getItem('VE_SUPER_TOKEN')
    if (!token) {
        localStorage.clear();
        return <Navigate to={SUPER_ROUTE_URLS.LOGIN} replace
            state={{ message: 'Session expired or unauthorized access. Please login again.' }}
        />
    }
    return children
}

export default RequireSuperAuth
