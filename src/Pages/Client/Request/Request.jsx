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
import { getUserOffer } from '../../../Store/Store/Offer/getUserOffer';
import { statusForProcurement } from '../Components/StatusFilterList/AllStatus';
import StatusList from '../Components/StatusFilterList/StatusList';

 const useDebounce = (value, delay = 500) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
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
const debouncedSearch = useDebounce(search, 500);
    useEffect(() => {
        if (disable === true) {
            setEntity([]);
            getRequest();
        }
    }, [disable]);

    useEffect(() => {
        dispatch(getStoreAuthPerson())
        dispatch(getParty({ storeType: '' }))
        dispatch(getUserOffer());
    }, [dispatch]);

    useEffect(() => {
  setDisable(true);
}, [debouncedSearch, status]);

    const getOfferData = useSelector((state) => state?.getUserOffer?.user?.data);

    // const commentsData = useMemo(() => {
    //     let computedComments = entity || [] ;
    //     //  const commentsData = entity || [];
    //     // if (search) {
    //     //     computedComments = computedComments.filter(
    //     //         (request) =>
    //     //             request.requestNo?.toString().toLowerCase().includes(search.toLowerCase()) ||
    //     //             request.material_po_no?.toString().toLowerCase().includes(search.toLowerCase())
    //     //     );
    //     // }

    //     // if (status) {
    //     //     computedComments = computedComments.filter((request) => parseInt(request.status) === parseInt(status));
    //     // }

    //     // setTotalItems(computedComments.length);
    //     return computedComments;
    // }, [currentPage, entity, search, limit, status]);

const commentsData = useMemo(() => {
    return entity || [];
}, [currentPage, entity]);

   

    // const getRequest = () => {
    //     const myurl = `${V_URL}/user/get-request`;
    //     const bodyFormData = new URLSearchParams();
    //     bodyFormData.append('tag', '1');
    //     axios({
    //         method: "post",
    //         url: myurl,
    //         data: bodyFormData,
    //         headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    //     }).then((response) => {
    //         if (response.data.success === true) {
    //             const data = response.data?.data;
    //             const filteredData = data?.filter(e => e?.project?._id === localStorage.getItem('U_PROJECT_ID') && (e?.status === 2 || e?.status === 4 || e?.status === 5));
    //             setEntity(filteredData);
    //             setDisable(false);
    //         }
    //     }).catch((error) => {
    //         console.log(error, '!!');
    //         setDisable(false);
    //     });
    // }


    const getRequest = () => {
    const myurl = `${V_URL}/user/get-request-status`;
    const bodyFormData = new URLSearchParams();

    bodyFormData.append('tag', '1');
    bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
    if (search) bodyFormData.append('search', search);
    // if (status !== '') bodyFormData.append('status', '2,4,5');
if (status !== '') bodyFormData.append('status', status);

 if (currentPage)   bodyFormData.append('page', currentPage);
  if (limit)  bodyFormData.append('limit', limit);

    axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'), 
        },
    }).then((response) => {
        if (response.data.success === true) {
            const { data, pagination } = response.data.data;

            const filteredData = data?.filter(e =>
                [2, 4, 5].includes(e?.status) 
            );

            setEntity(filteredData);
        
            setTotalItems(pagination?.total || 0);
        }
        setDisable(false);
    }).catch((error) => {
        console.error(error);
        setDisable(false);
        toast.error(error.response?.data?.message || 'Something went wrong');
    });
};


    const handleDownloadOffer = (elem) => {
        const findOffer = getOfferData?.filter((of) => of?.requestId?._id === elem?._id).filter(ele => ele.items.length > 0);
        if (findOffer) {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('requestId', elem?._id);
            bodyFormData.append('offer_no', findOffer[0]?.offer_no);
            bodyFormData.append('print_date', true);
            PdfDownloadErp({ apiMethod: 'post', url: 'get-offer-request-item', body: bodyFormData });
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
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
                                                                    {/* <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} /> */}

                                                                         <input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setDisable(true); 
  }}
/>
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

                                                <StatusList statusOptions={statusForProcurement} value={status} onChange={handleStatusChange} />

                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                                    <DropDown limit={limit} onLimitChange={(val) => {
    setlimit(val);
    setCurrentPage(1);
    setDisable(true);
}} />
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
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            {/* <td>{elem?.requestNo}</td> */}
                                                            <td>{elem?.material_po_no}</td>
                                                            <td>{moment(elem?.requestDate).format('YYYY-MM-DD')}</td>
                                                            <td>{moment(elem?.admin_approval_time).format('YYYY-MM-DD HH:mm')}</td>
                                                            {localStorage.getItem('ERP_ROLE') === M_CON && (
                                                                <td>
                                                                    {(elem?.status === 5 || elem?.status === 4) ? (
                                                                        <span style={{ cursor: "pointer" }}> <X /></span>
                                                                    ) :
                                                                        <span style={{ cursor: "pointer" }}
                                                                            onClick={() => navigate('/user/project-store/manage-offer-request', { state: elem })}>
                                                                            <HandCoins />
                                                                        </span>
                                                                    }
                                                                </td>
                                                            )}
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
                                                                        
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-item-request', { state: elem })}>
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
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                          onPageChange={(page) => {
        setCurrentPage(page);
        setDisable(true);
      }}
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