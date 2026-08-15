import React from 'react'
import { Link } from 'react-router-dom'

const BreadCrumb = ({ breadcrumbs }) => {
    return (
        <div className="page-header">
            <div className="row">
                <div className="col-sm-12">
                    <ul className="breadcrumb">
                        {breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={index}>
                                <li
                                    className={`breadcrumb-item ${breadcrumb.active ? 'active' : ''}`}
                                >
                                    {breadcrumb.link ? (
                                        <Link to={breadcrumb.link}>{breadcrumb.name}</Link>
                                    ) : (
                                        breadcrumb.name
                                    )}
                                </li>
                                {!breadcrumb.active && index < breadcrumbs.length - 1 && (
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BreadCrumb