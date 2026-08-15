import React from 'react'
import * as Icons from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLink = ({ url, url2, iconName, name }) => {
    const location = useLocation();
    const IconComponent = Icons[iconName];

    return (
        <li>
            <Link to={url} className={`${location.pathname === `${url}` ||
                location.pathname === `${url2}` ? "active" : ""}`}>
                <span className="menu-side">
                    {IconComponent ? <IconComponent className="Dash-iCon" /> : null}
                </span>
                <span>{name}</span>
            </Link>
        </li>
    )
}

export default SidebarLink