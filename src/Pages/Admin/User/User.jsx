import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import axios from 'axios';
import moment from 'moment';
import { V_URL } from '../../../BaseUrl';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import DropDown from '../../../Components/DropDown';
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from '../../../Store/Admin/Product/Product';

const User = () => {

  const navigate = useNavigate();
  const [entity, setEntity] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  // const [sorting, setSorting] = useState({ field: "", order: "" });
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();
  const ProductState = useSelector((state) => state.Product || {});
  const ProductData = ProductState?.ProductData || [];


  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem('VA_TOKEN') === null) {
      navigate("/admin/login");
    }

    // eslint-disable-next-line

    if (disable === true) {
      setEntity([]);
      getUser();
    }
  }, [disable, navigate]);

  const commentsData = useMemo(() => {
    let computedComments = entity;

    if (search) {
      computedComments = computedComments.filter(
        (user) =>
          user.user_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          user.email?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments.length);

    //Sorting comments
    // if (sorting.field) {
    //   const reversed = sorting.order === "asc" ? 1 : -1;
    //   computedComments = computedComments.sort(
    //     (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
    //   );
    // }

    //Current Page slice
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);

  const getUser = () => {
  const myurl = `${V_URL}/admin/get-user`;
  const token = localStorage.getItem('VA_TOKEN');

  axios.get(myurl, {
      headers: { Authorization: "Bearer " + token }
    })
    .then((response) => {
      console.log("@@", response.data);

      if (response.data?.success) {
        const users = (response.data.data || []).map((e, i) => ({
          ...e,
          sr_no: i + 1,
          product: Array.isArray(e.product)
            ? e.product
            : e.product
              ? [e.product]  // wrap single value into array
              : []           // fallback to empty array
        }));


        setEntity(users);
        setDisable(false);
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    })
    .catch((err) => {
      toast.error("Something went wrong");
      console.log("Errors", err);
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

        const myurl = `${V_URL}/admin/delete-user`;
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
    setDisable(true)
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Map product IDs to labels if you have product master list in API
  const productLabels = useMemo(() => {
    const productMap = {};
    (entity || []).forEach(user => {
      (user.product || []).forEach(p => {
        if (typeof p === "object" && p._id) {
          productMap[p._id] = p.name;
        }
      });
    });
    return productMap;
  }, [entity]);

  const productIdToLabel = useMemo(() => {
    return Object.fromEntries(
      (ProductData || []).map(p => [p._id, p.name])
    );
  }, [ProductData]);



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
                  <li className="breadcrumb-item active">User List</li>
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
                            <h3>User List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }} />
                                  <button className="btn"><img src="/assets/img/icons/search-normal.svg"
                                    alt="search" /></button>
                                </form>
                              </div>
                              <div className="add-group">
                                <Link to="/admin/manage-user"
                                  className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                    src="/assets/img/icons/plus.svg" alt="add-icon" /></Link>
                                <button type='button' onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                    src="/assets/img/icons/re-fresh.svg" alt="refresh-icon" /></button>
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
                            <th>Name</th>
                            <th>Email</th>
                            <th>Product</th>
                            <th>Year</th>
                            <th>Firm</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) =>
                            <tr key={elem?._id}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.user_name}</td>
                              <td>{elem?.email}</td>
                              {/* <td>{elem?.product} {elem?.erpRole?.name ? `(${elem?.erpRole?.name})` : ''}</td> */}
                              <td>
                                {Array.isArray(elem?.product) && elem.product.length > 0 ? (
  elem.product.map((p, idx) => (
    <div key={idx}>
      {typeof p === "string"
        ? productIdToLabel[p] || "-"
        : p?.name || "-"}
    </div>
  ))
) : (
  <div>-</div>
)}

                              </td>

                              <td>
                                {elem?.year?.length > 0 ? (elem.year.map((e) => (
                                  <div key={e?._id}>
                                    {moment(e?.start_year).format('YYYY')}-{moment(e?.end_year).format('YYYY')}
                                  </div>
                                ))) : (
                                  <div>-</div>
                                )}
                              </td>
                              <td>
                                {elem?.firm?.length > 0 ? (elem.firm.map((e) => (
                                  <div key={e?._id}>{e?.name}</div>
                                ))) : (
                                  <div>-</div>
                                )}
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
                                  {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                  <a className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown" aria-expanded="false"><i
                                      className="fa fa-ellipsis-v"></i></a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <button type='button' className="dropdown-item" onClick={() => navigate('/admin/manage-user', { state: elem })}><i
                                      className="fa-solid fa-pen-to-square m-r-5"></i>
                                      Edit</button>
                                    <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.user_name)} ><i
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

export default User