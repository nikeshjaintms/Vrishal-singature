import React, { useEffect, useMemo, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import DropDown from '../../../Components/DropDown';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import Swal from 'sweetalert2';

const ProjectType = () => {

    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);


    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }

        if (disable === true) {
            setEntity([]);
            getProjectType();
        }
    }, [navigate, disable]);

    const commentsData = useMemo(() => {
        let computedComments = entity;

        if (search) {
    computedComments = computedComments.filter((pro) => {
        const searchText = search.toLowerCase();

        const projectNameMatch =
            pro.projectTypeName?.toLowerCase().includes(searchText);

        const rolesArray = Array.isArray(pro.roles) ? pro.roles : [];

        const roleMatch = rolesArray.some((r) =>
            r?.name?.toLowerCase().includes(searchText)
        );

        return projectNameMatch || roleMatch;
    });
}

        setTotalItems(computedComments.length);


        //Current Page slice
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const getProjectType = async () => {
  try {
    const myurl = `${V_URL}/admin/get-admin-project-type`;

    const token = localStorage.getItem("VA_TOKEN");
    if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const response = await axios.get(myurl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("@@ API Response:", response?.data);

    if (response?.data?.success) {
      const data = response.data.data;
      setEntity(data);
      setDisable(false);
    } else {
      toast.error(response?.data?.message || "Something went wrong");
    }

  } catch (error) {
    console.log("API Error →", error);

    if (error?.response) {
      // Server responded but with error code
      console.log("Backend Response:", error.response.data);

      toast.error(
        error.response.data.message ||
        `Server error (${error.response.status})`
      );
    } else if (error?.request) {
      // Request made but no response
      toast.error("No response from server");
    } else {
      // Something else broke
      toast.error("Unexpected error occurred");
    }
  }
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

                const myurl = `${V_URL}/admin/delete-project-type`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);

                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') },
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
                                    <li className="breadcrumb-item active">Project Type List</li>
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
                                                        <h3>Project Type List</h3>
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
                                                                <Link to="/admin/manage-project-type"
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
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Project Type</th>
                                                        <th>Roles</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>

                                                            <td>{elem?.projectTypeName}</td>

                                                            <td>
                                                                {Array.isArray(elem?.roles)
                                                                ? elem.roles.map(r => r.name).join(", ")
                                                                : ""}
                                                            </td>

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
                                                                    data-bs-toggle="dropdown" aria-expanded="false">
                                                                    <i className="fa fa-ellipsis-v"></i>
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-end">
                                                                    <button type='button'
                                                                    className="dropdown-item"
                                                                    onClick={() => navigate('/admin/manage-project-type', { state: elem })}>
                                                                    <i className="fa-solid fa-pen-to-square m-r-5"></i>Edit
                                                                    </button>

                                                                    <button type='button'
                                                                    className="dropdown-item"
                                                                    onClick={() => handleDelete(elem?._id, elem.projectTypeName)}>
                                                                    <i className="fa fa-trash-alt m-r-5"></i>Delete
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
                    ) : <Loader />
                    }
                </div>
            </div>
        </div>
    )
}

export default ProjectType