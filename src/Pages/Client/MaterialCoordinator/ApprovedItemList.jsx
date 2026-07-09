import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ApprovedItemList = () => {

    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);

    useEffect(() => {
        if (disable === true) {
            setEntity([]);
            getItemList();
        }
    }, [disable])

    // const commentsData = useMemo(() => {
    //     let computedComments = entity;

    //     if (search) {
    //         computedComments = computedComments.filter(
    //             (req) =>
    //                 req.requestId?.requestNo?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //                 req.transactionId?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase())
    //         );
    //     }
    //     setTotalItems(computedComments?.length);

    //     //Current Page slice
    //     return computedComments?.slice(
    //         (currentPage - 1) * limit,
    //         (currentPage - 1) * limit + limit
    //     );
    // }, [currentPage, search, limit, entity]);

    const commentsData = entity || [];

    // const getItemList = () => {
    //     const myurl = `${V_URL}/user/get-purchase-offer`;

    //     axios({
    //         method: "post",
    //         url: myurl,
    //         headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    //     }).then((response) => {
    //         // console.log(response.data, '@@@');
    //         if (response?.data?.success === true) {
    //             const data = response.data.data;
    //             const filteredData = data?.filter(e => e?.requestId?.project?._id === localStorage.getItem('U_PROJECT_ID')
    //                 && e?.status === 3);
    //             setEntity(filteredData);
    //         }
    //         setDisable(false)
    //     }).catch((error) => {
    //         console.log(error, '!!');
    //         toast.error(error.response.data.message || 'Something went wrong')
    //     })
    // }
const getItemList = () => {
    const myurl = `${V_URL}/user/get-purchase-offer`;

    const params = {
        page: currentPage,
        limit: limit,
        search: search,
        projectId: localStorage.getItem('U_PROJECT_ID'),
    };

    axios({
        method: "post",
        url: myurl,
        params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') // ✅ Fix typo: "Bearer"
        },
    }).then((response) => {
        if (response?.data?.success === true) {
            const { data, totalItems } = response.data.data;
            const filteredData = data?.filter(e => e?.status === 3); // ✅ Still filter by status if needed
            setEntity(filteredData);
            setTotalItems(totalItems); // ✅ Use backend-provided count
        }
        setDisable(false);
    }).catch((error) => {
        console.log(error, '!!');
        toast.error(error.response?.data?.message || 'Something went wrong');
    });
};


    const headers = [
        { name: 'Sr.' },
        { name: 'Req No.' },
        { name: 'Section Details' },
        { name: 'Unit' },
        { name: 'Accepted Qty.' },
        { name: 'Accepted Length' },
        { name: 'T.C. No' },
        { name: 'Status' },
        { name: 'Issue' },
        { name: 'Action', className: 'text-end' }
    ];

    const handleRefresh = () => {
        setDisable(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (

        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Approved Section Details List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Approved Section Details List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="firm-searchBox" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        {headers.map((header, index) => (
                                                            <th key={index} className={header.className || ''}>
                                                                {header.name}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.requestId?.requestNo}</td>
                                                            <td>{elem?.transactionId?.itemName?.name}</td>
                                                            <td>{elem?.transactionId?.itemName?.unit?.name}</td>
                                                            <td>{elem?.acceptedQty}</td>
                                                            <td>{elem?.acceptedLength}</td>
                                                            <td>{!elem?.tcNo ? '-' : elem?.tcNo}</td>
                                                            <td>
                                                                <span className={`custom-badge ${elem.status === 1 ? 'status-orange' :
                                                                    elem.status === 2 ? 'status-blue' :
                                                                        elem.status === 3 ? 'status-green' :
                                                                            elem.status === 4 ? 'status-pink' : ''
                                                                    }`}>
                                                                    {elem.status === 1 ? 'Pending' :
                                                                        elem.status === 2 ? 'Send to QC' :
                                                                            elem.status === 3 ? 'Approved By QC' :
                                                                                elem.status === 4 ? 'Rejected By QC' : ''}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button type='button' className='btn btn-primary'
                                                                    onClick={() => navigate('/user/project-store/item-issue-management', { state: elem })}>
                                                                    Issue
                                                                </button>
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-approved-item', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i>
                                                                            View
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colspan="999">
                                                                <div className="no-table-data">
                                                                    No Data Found!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row align-center mt-3 mb-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        onPageChange={(page) => setCurrentPage(page)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loader />}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ApprovedItemList