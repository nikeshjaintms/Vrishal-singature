import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PLAN, V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';
import DropDown from '../../../../../Components/DropDown';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Loader from '../../../Include/Loader';
import Footer from '../../../Include/Footer';
import { Pagination, Search } from '../../../Table';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import StatusList from '../../../Components/StatusFilterList/StatusList';
import { statusForProcurement } from '../../../Components/StatusFilterList/AllStatus';

const PurchaseRequest = () => {

    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const [status, setStatus] = useState('');

    // useEffect(() => {
    //     if (disable === true) {
    //         getRequest();
    //         setEntity([]);
    //     }
    // }, [disable , currentPage, limit, search]);
useEffect(() => {
  getRequest();
  setEntity([]);
}, [currentPage, limit, search, status]);

   const commentsData = useMemo(() => {
    let computedComments = entity;

    if (status) {
        computedComments = computedComments.filter((request) => parseInt(request.status) === parseInt(status));
    }

    return computedComments;
}, [entity, status , search]);


   const getRequest = () => {
    const myurl = `${V_URL}/user/get-request`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('tag', '1');
    bodyFormData.append('page', currentPage);
    bodyFormData.append('limit', limit);
    bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID')); // Added this
if (status) bodyFormData.append('status', status);
  if (search) bodyFormData.append('search', search);
    axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((response) => {
        if (response.data.success === true) {
            const data = response.data.data.data;
            const total = response.data.data.pagination.total;
           
            setEntity(data);
            setTotalItems(total); // Update total from backend
            setDisable(false);
        }
    }).catch((error) => {
        console.log(error, '!!');
        setDisable(false);
    })
}


    // const handleStatusChange = (e) => {
    //     setStatus(e.target.value);
    //     setDisable(true);
        
    // };


    const handleStatusChange = (e) => {
  setStatus(e.target.value);
  setCurrentPage(1);
  setDisable(true); 
};


    const handleDelete = (id, title) => {
        Swal.fire({
            title: `Are you sure want to delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const myurl = `${V_URL}/user/delete-request`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);
                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
                }).then((response) => {
                    // console.log(response.data, 'DEL')
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        setDisable(true);
                    } else {
                        toast.error(response?.data?.message);
                    }
                }).catch((error) => {
                    toast.error("Something went wrong");
                    console?.log("Errors", error);
                });
            }
        });
    }

    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('requestId', elem._id);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'get-store-request-item', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
        setStatus("");
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
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
                                    <li className="breadcrumb-item active">Material PO No.</li>
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
                                                        <h3>Material PO No.</h3>
                                                        {/* <h3>Raw Material Request List</h3> */}
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
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                {localStorage.getItem('ERP_ROLE') === `${PLAN}` && (
                                                                    <Link to="/user/project-store/manage-material-request"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                )}
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
}} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Material PO No.</th>
                                                        <th>Department</th>
                                                        <th>Location</th>
                                                        <th>Drawing No.</th>
                                                        <th>Req. Date</th>
                                                        <th>Create Date</th>
                                                        <th>Status</th>
                                                        <th className='text-end'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.material_po_no}</td>
                                                            <td>{elem?.department?.name}</td>
                                                            <td>{elem?.storeLocation?.name}</td>
                                                            <td>{elem?.drawing_id !== null ? elem?.drawing_id?.drawing_no : '-'}</td>
                                                            <td>{moment(elem?.requestDate).format('YYYY-MM-DD')}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td className='status-badge'>
                                                                <span className={`custom-badge ${elem.status === 1 ? 'status-orange' :
                                                                    elem.status === 2 ? 'status-blue' :
                                                                        elem.status === 3 ? 'status-pink' :
                                                                            elem.status === 4 ? 'status-green' : elem.status === 5 ? 'status-green' : ''
                                                                    }`}>
                                                                    {elem.status === 1 ? 'Pending' :
                                                                        elem.status === 2 ? 'Approved By Admin' :
                                                                            elem.status === 3 ? 'Rejected By Admin' :
                                                                                elem.status === 4 ? 'Completed' : elem.status === 5 ? 'All Received' : ''}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-material-request', { state: elem })}><i
                                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        {localStorage.getItem('ERP_ROLE') === `${PLAN}` &&
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem?.project?.name)} ><i
                                                                                className="fa fa-trash-alt m-r-5"></i> Delete</button>}
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
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
                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data
                                                    
                                                    </div>

                                                  {/* <div className="dataTables_info" role="status" aria-live="polite">
  {totalItems > 0 ? (
    <>Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} data</>
  ) : (
    <>Showing 0 of 0 data</>
  )}
</div> */}



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

export default PurchaseRequest