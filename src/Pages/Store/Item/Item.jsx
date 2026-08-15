import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../Store/Store/Item/AdminItem';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { DownloadXlsx } from '../Components/DownloadXlsx';
import { UploadXlsx } from '../Components/UploadSample';

const Item = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (disable === true) {
            dispatch(getAdminItem({ is_main: true }))
            setDisable(false);
        }
    }, [disable]);

    const entity = useSelector((state) => state?.getAdminItem?.user?.data?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        if (search) {
            computedComments = computedComments.filter(
                (it) =>
                    it.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    it.category?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    it.mcode?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

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

    const handleSampleDownload = () => {
        DownloadXlsx({ apiMethod: 'get', url: 'itemdata-format-download', body: '', fileName: 'ItemFormat' });
    }

    const handleImport = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only .xlsx files are allowed.');
            return;
        }
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        UploadXlsx({
            apiMethod: 'post', url: 'import-itemData', body: bodyFormData, onSuccess: () => {
                dispatch(getAdminItem({ is_main: true }));
            }
        });
    };

    const handleRefresh = () => {
        setSearch('');
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
                                    <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Item List</li>
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
                                                        <h3>Item List</h3>
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
                                                                <Link to="/main-store/user/manage-item"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100'
                                                            data-toggle="tooltip" data-placement="top" title="download format"
                                                            type='button' onClick={handleSampleDownload}> <i className="fa-solid fa-download"></i></button>
                                                    </div>
                                                    <div className='add-group'>
                                                        <input
                                                            type='file'
                                                            ref={fileInputRef}
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button'
                                                            data-toggle="tooltip" data-placement="top" title="Upload format"
                                                            onClick={handleImport}>
                                                            <i className="fa-solid fa-upload"></i>
                                                        </button>
                                                    </div> */}
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Name</th>
                                                        <th>Grade</th>
                                                        <th>MCode</th>
                                                        <th>Category</th>
                                                        <th>Unit</th>
                                                        <th>HSN</th>
                                                        {/* <th>Reorder Qty.</th> */}
                                                        <th>GST(%)</th>
                                                        <th>Purchase</th>
                                                        <th>Sale</th>
                                                        <th>Cost</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.name}</td>
                                                            <td>{elem?.material_grade === '' ? '-' : elem?.material_grade}</td>
                                                            <td>{elem?.mcode}</td>
                                                            <td>{elem?.category?.name}</td>
                                                            <td>{elem?.unit?.name}</td>
                                                            <td>{elem?.hsn_code}</td>
                                                            {/* <td>{elem?.reorder_quantity?.toFixed(2)}</td> */}
                                                            <td>{elem?.gst_percentage?.toFixed(2)}</td>
                                                            <td>{elem?.purchase_rate?.toFixed(2)}</td>
                                                            <td>{elem?.sale_rate?.toFixed(2)}</td>
                                                            <td>{elem?.cost_rate?.toFixed(2)}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === true ? (
                                                                    <span className="custom-badge status-green">True</span>
                                                                ) : (
                                                                    <span className="custom-badge status-pink">False</span>
                                                                )}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/main-store/user/manage-item', { state: elem })}><i
                                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.name)} ><i
                                                                            className="fa fa-trash-alt m-r-5"></i> Delete</button>
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

export default Item