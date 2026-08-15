import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../Pages/PoTeam/ui/Header';
import Sidebar from '../../Pages/PoTeam/ui/Sidebar';

const PoOutlet = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default PoOutlet