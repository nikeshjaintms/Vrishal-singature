import React from 'react'
import { Link } from 'react-router-dom'

const NdtOfferHeader = ({ name,mainPage }) => {

    return (
        <div className="page-header">
            <div className="row">
                <div className="col-sm-12">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/user/project-store/dashboard">Dashboard </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <i className="feather-chevron-right"></i>
                        </li>
                            <li className="breadcrumb-item active">{mainPage}</li>
                        <li className="breadcrumb-item active">{name}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NdtOfferHeader