import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import { ERP,PIPING, PIPING_PLAN } from '../../BaseUrl';

const ProjectStoreLayout = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('PAY_USER_TOKEN');
        const storedViPro = localStorage.getItem('VI_PRO');
        if (token === null) {
            navigate("/");
            localStorage.clear();
            return;
        }
        // if (storedViPro !== `${ERP}`) {
        //     toast.error('Access Denied...');
        //     localStorage.clear();
        //     navigate("/");
        //     return;
        // }
        if (storedViPro !== `${ERP}` && storedViPro !== `${PIPING}` && storedViPro !== `${PIPING_PLAN}`) {
            toast.error('Access Denied...');
            localStorage.clear();
            navigate("/");
            return;
        }
    }, [navigate]);

    return (
        <>
            <Outlet />
        </>
    )
}

export default ProjectStoreLayout