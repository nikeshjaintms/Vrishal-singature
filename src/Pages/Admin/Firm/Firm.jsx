import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { V_URL } from '../../../BaseUrl';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Pagination, Search } from '../Table';
import Loader from '../Include/Loader';
import Swal from 'sweetalert2'
import DropDown from '../../../Components/DropDown';
import Footer from '../Include/Footer';

const Firm = () => {

    const navigate = useNavigate();
    const [entity, setEntity] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }

        if (disable === true) {
            setEntity([]);
            getFirmList();
        }
    }, [disable, navigate]);

    const commentsData = useMemo(() => {
        let computedComments = entity;

        if (search) {
            computedComments = computedComments.filter(
                (firm) =>

                    firm.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    firm.register_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    firm.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    firm.mobile_number.toString()
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments.length);
        //Current Page slice
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const getFirmList = () => {
        const myurl = `${V_URL}/admin/get-admin-firm`;
        axios({
            method: "get",
            url: myurl,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('VA_TOKEN') },
        }).then(async (response) => {
            console?.log("@@", response?.data);
            if (response?.data?.success) {
                let data = await response?.data?.data?.map((e, i) => {
                    return { ...e, sr_no: i + 1 };
                });

                setEntity(data);
                setDisable(false);
            } else {
                toast.error("Something went wrong");
            }
        }).catch((error) => {
            toast.error("Something went wrong");
            console?.log("Errors", error);
        });
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

                const myurl = `${V_URL}/admin/delete-firm`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);

                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_ADMIN_TOKEN') },
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

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
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
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Firm List</li>
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
                                                        <h3>Firm List</h3>
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
                                                                <Link to="/admin/manage-firm"
                                                                    className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                        src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
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
                                                        <th>Sr.</th>
                                                        <th>Image</th>
                                                        <th>Register No.</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Mobile</th>
                                                        <th>City</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{elem?.sr_no}</td>
                                                            <td className="profile-image">
                                                                <a href="#"><img width="28"
                                                                    height="28" src={elem?.image}
                                                                    className="" alt="firm-img" />
                                                                </a>
                                                            </td>
                                                            <td>{elem?.register_no}</td>
                                                            <td>{elem?.name}</td>
                                                            <td>{elem?.email}</td>
                                                            <td>{elem?.mobile_number}</td>
                                                            <td>{elem?.city} - {elem?.pincode},{elem?.state}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === true ? (
                                                                    <span className="custom-badge status-green">Active</span>
                                                                ) : (
                                                                    <span className="custom-badge status-pink">Inactive</span>
                                                                )}
                                                            </td>

                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/admin/manage-firm', { state: elem })}><i
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

export default Firm