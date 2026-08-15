import React, { useEffect, useMemo, useState } from 'react';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItemDetails } from '../../../Store/Piping/Item/AdminItem';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
// import DownloadFormat from '../../../Components/DownloadFormat/DownloadFormat';
import DownloadFormat from '../../../Components/Piping/DrawingModal/DownloadFormat/DownloadFormat';
import { PlanningMaterialAuth } from '../../../Routes/Users/Auth/AuthGuard';
// import UploadFile from '../../../Components/DownloadFormat/UploadFile';

 const useDebounce = (value, delay = 500) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }

const Item = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
const debouncedSearch = useDebounce(search, 500);
    useEffect(() => {
        // if (disable === true) {
            dispatch(getAdminItemDetails({ is_main: false, currentPage,limit, search:debouncedSearch })).finally(() => setDisable(false));
            // setDisable(false);
        // }
    }, [dispatch, disable,debouncedSearch]);

    const entity = useSelector((state) => state?.getAdminItemDetails?.user?.data?.data);
    const pagination = useSelector((state) => state?.getAdminItemDetails?.user?.data?.pagination);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        // if (search) {
        //     computedComments = computedComments.filter(
        //         (it) =>
        //             it.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             it.material_grade?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             it.hsn_code?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
        //     );
        // }
        // setTotalItems(computedComments?.length);
        return computedComments;
        // ?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
    }, [currentPage, search, limit, entity]);

 useEffect(() => {
        if (pagination) {
           setTotalItems(pagination.total);
        }
    }, [pagination]);

    
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
                const myurl = `${V_URL}/user/delete-item`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);
                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
                }).then((response) => {
                    console.log(response.data, 'DEL')
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

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
const projectId = localStorage.getItem("U_PROJECT_ID");

// Construct URL with project query param
const downloadUrl = projectId
  ? `${V_URL}/user/download-items-details?project=${projectId}`
  : `${V_URL}/user/download-items-details`;



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
                                    <li className="breadcrumb-item"><Link to="/piping/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Item Details List</li>
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
                                                        <h3>Item Details List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} />

                                                                         {/* <input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    // setDisable(true); 
  }}
/> */}
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <PlanningMaterialAuth>
                                                                    <Link to="/piping/user/manage-item"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                </PlanningMaterialAuth>
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <div className="add-group" style={{ marginRight: "10px" }}>
                                                        {/* <DownloadFormat url={`${V_URL}/user/download-items-details?project=${projectId}`} fileName="Items" /> */}
                                                       
<DownloadFormat url={downloadUrl} fileName="Items" />
                                                    </div>
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
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Item Category</th>
                                                        <th>Item Code</th>
                                                        <th>Item Name</th>                                                
                                                        <th>Item Description </th>
                                                        <th>Size 1</th>                                                    
                                                        <th>Thickness 1</th>
                                                        <th>Size 2</th>                                                    
                                                        <th>Thickness 2</th>
                                                        <th>Material Grade</th>
                                                         <th>UOM</th>
                                                        <th>Status</th>
                                                        <PlanningMaterialAuth>
                                                            <th className="text-end">Action</th>
                                                        </PlanningMaterialAuth>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.item_category?.name || "-"}</td>
                                                            <td>{elem?.item_code || "-"}</td>                                                         
                                                            <td>{elem?.item_name || "-"}</td>                                                         
                                                            <td>{elem?.item_description}</td>                                                        
                                                            <td>{elem?.size1?.name || "-"}</td>
                                                            <td>{elem?.thickness1?.name || "-"}</td>
                                                            <td>{elem?.size2?.name || "N/A"}</td>
                                                            <td>{elem?.thickness2?.name || "N/A"}</td>
                                                            <td>{elem?.material_grade === '' ? '-' : elem?.material_grade}</td>
                                                            {/* <td>{elem?.unit?.name}</td> */}
                                                            {/* <td>{elem?.hsn_code}</td> */}
                                                               <td>{elem?.uom?.name || "-"}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === true ? (
                                                                    <span className="custom-badge status-green">Active</span>
                                                                ) : (
                                                                    <span className="custom-badge status-pink">Inactive</span>
                                                                )}
                                                            </td>
                                                            <PlanningMaterialAuth>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-item', { state: elem })}><i
                                                                                className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                                Edit</button>
                                                                              
                                                                            {/* <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.name)} ><i
                                                                                className="fa fa-trash-alt m-r-5"></i> Delete</button> */}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </PlanningMaterialAuth>
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

export default Item