import React, { useEffect, useState, useMemo } from 'react'
import { M_CON, V_URL } from '../../../BaseUrl';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import DropDown from '../../../Components/DropDown';
import { Pagination, Search } from '../Table';
import Footer from '../Include/Footer';
import axios from 'axios';
import Loader from '../Include/Loader';
import moment from 'moment';
import { HandCoins, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreAuthPerson } from '../../../Store/Store/StoreMaster/AuthPerson/AuthPerson';
import { getParty } from '../../../Store/Store/Party/Party';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import { getUserOfferPiping } from '../../../Store/PoTeam/piping/Offer/getUserOfferPiping';
import { statusForProcurement } from '../Components/StatusFilterList/AllStatus';
import StatusList from '../Components/StatusFilterList/StatusList';

const Request = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (disable === true) {
            setEntity([]);
            getRequest();
        }
    }, [disable]);

    useEffect(() => {
        dispatch(getStoreAuthPerson())
        dispatch(getParty({ storeType: '' }))
        dispatch(getUserOfferPiping({}));
    }, [dispatch]);

    const getOfferData = useSelector((state) => state?.getUserOfferPiping?.user?.data?.data || []);
console.log("getOfferData", getOfferData);
useEffect(() => {
    console.log("Redux Full State", getOfferData);
}, [getOfferData]);
    const commentsData = useMemo(() => {
        let computedComments = entity;
        if (search) {
            computedComments = computedComments.filter(
                (request) =>
                    request.requestNo?.toString().toLowerCase().includes(search.toLowerCase()) ||
                    request.material_po_no?.toString().toLowerCase().includes(search.toLowerCase())
            );
        }

        if (status) {
            computedComments = computedComments.filter((request) => parseInt(request.status) === parseInt(status));
        }

        setTotalItems(computedComments.length);
        return computedComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, entity, search, limit, status]);

    const getRequest = () => {
        const myurl = `${V_URL}/user/get-request-piping`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('tag', '1');
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data.success === true) {
                const data = response.data?.data;
                console.log("data", data);
                const filteredData = data?.data?.filter(e => e?.project?._id === localStorage.getItem('U_PROJECT_ID') && (e?.status === 2 || e?.status === 4 || e?.status === 5));
                console.log("filteredData", filteredData);
                
                setEntity(filteredData);
                setDisable(false);
            }
        }).catch((error) => {
            console.log(error, '!!');
            setDisable(false);
        });
    }

    const handleDownloadOffer = (elem) => {
        const findOffer = getOfferData?.filter((of) => of?.requestId?._id === elem?._id).filter(ele => ele.items.length > 0);
console.log("findOffer", findOffer);

        if (findOffer) {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('requestId', elem?._id);
            bodyFormData.append('offer_no', findOffer[0]?.offer_no);
            bodyFormData.append('print_date', true);
            PdfDownloadErp({ apiMethod: 'post', url: 'get-offer-request-piping-item', body: bodyFormData });
        } else {
            toast.error('No Offer Found');
        }
    }

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleRefresh = () => {
        setDisable(true);
        setStatus('');
        setSearch('');
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Material PO NO. List</li>
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
                                                        <h3>Material PO NO. List</h3>
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
                                                            <div className="add-group">

                                                                {/* <button type='button' onClick={() => navigate('/piping/user/manage-offer-request')}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                         /> <HandCoins /></button> */}

                                                    
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <StatusList statusOptions={statusForProcurement} value={status} onChange={handleStatusChange} />

                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                        
                                                </div>
                                                 
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        {/* <th>Request No.</th> */}
                                                        <th>Material PO No.</th>
                                                        <th>Req. Date</th>
                                                        <th>Approve Date</th>
                                                        {localStorage.getItem('ERP_ROLE') === M_CON && <th>Offer</th>}
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={1}>
                                                            <td>{(currentPage - 1) * limit  + 1}</td>
                                                            {/* <td>{elem?.requestNo}</td> */}
                                                            <td>{elem?.material_po_no}</td>
                                    
                                                            <td>{elem?.requestDate ? moment(elem.requestDate).format('DD-MM-YYYY') : '-'}</td>
                                                            <td>{elem?.admin_approval_time ? moment(elem.admin_approval_time).format('DD-MM-YYYY') : '-'}</td>

                                                            {localStorage.getItem('ERP_ROLE') === M_CON && (
                                                                <td>
                                                                    {(elem?.status === 5 || elem?.status === 4) ? (
                                                                        <span style={{ cursor: "pointer" }}> <X /></span>
                                                                    ) :
                                                                        <span style={{ cursor: "pointer" }}
                                                                            onClick={() => navigate('/piping/user/manage-offer-request', { state: elem })}>
                                                                            <HandCoins />
                                                                        </span>
                                                                    }
                                                                     {/* <button type='button' onClick={() => navigate('/piping/user/manage-offer-request', { state: elem })}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                         /> <HandCoins /></button> */}

                                                                     {/* <span style={{ cursor: "pointer" }}
                                                                            onClick={() => navigate('/piping/user/manage-offer-request', { state: elem })}>
                                                                            <HandCoins />
                                                                        </span> */}
                                                                </td>
                                                            )}
                                                            <td></td>
                                                            <td>
                                                                <span className={`custom-badge ${elem.status === 2 ? 'status-blue' :
                                                                    elem.status === 4 ? 'status-green' : elem.status === 5 ? 'status-green' : ''}`}>
                                                                    {elem.status === 2 ? 'Approved By Admin' :
                                                                        elem.status === 4 ? 'Completed' : elem.status === 5 ? 'All Received' : ''}
                                                                </span>
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/view-item-request', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i>
                                                                            View
                                                                        </button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)}>
                                                                            <i className="fa-solid fa-download m-r-5"></i>
                                                                            Donwload Offer
                                                                        </button> 
                                                                         {/* <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)}>
                                                                            <i className="fa-solid fa-download m-r-5"></i>
                                                                            Donwload Inspection
                                                                        </button> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                     )} 

                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="999">
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

export default Request