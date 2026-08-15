import React, { createContext, useContext, useEffect, useState } from 'react';
import { menuAccessConfig } from '../Pages/Users/Components/MenuAccess/MenuAccess';
import { menuAccessConfigPiping } from '../Pages/Piping/Components/MenuAccess/MenuAccessPiping';

const RoleAccessContext = createContext();

export const RoleAccessProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(localStorage.getItem('ERP_ROLE') || null);
    useEffect(() => {
        const storedRole = localStorage.getItem('ERP_ROLE');
        if (storedRole !== userRole) {
            setUserRole(storedRole);
        }
    }, [userRole]);

    // const hasAccess = (item) => menuAccessConfig[item]?.includes(userRole);
const hasAccess = (item) => {

        const normalAccess = menuAccessConfig[item]?.includes(userRole);

        const pipingAccess = menuAccessConfigPiping[item]?.includes(userRole);

        return normalAccess || pipingAccess;

    };

 
    return (
        <RoleAccessContext.Provider value={{ userRole, setUserRole, hasAccess }}>
            {children}
        </RoleAccessContext.Provider>
    );
};

export const useRoleAccess = () => useContext(RoleAccessContext);
