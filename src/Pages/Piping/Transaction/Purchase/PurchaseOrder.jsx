import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { V_URL } from "../../../../BaseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import Swal from "sweetalert2";
import { HandCoins, X } from "lucide-react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../../../Store/Store/Item/Item";
import OrderModal from "../../../../Components/Transaction/OrderModal";

const PurchaseOrder = () => {
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const [entity, setEntity] = useState([]);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (disable === true) {
      setEntity([]);
      getPurchaseOrder();
    }
  }, [disable]);

  const commentsData = useMemo(() => {
    let computedComments = entity;

    if (search) {
      computedComments = computedComments.filter((pro) =>
        pro.orderNo?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
        pro.party?.name?.toLowerCase()?.includes(search?.toLowerCase())

      );
    }
    setTotalItems(computedComments.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);


  useEffect(() => {
    const fetchItem = () => {
      try {
        dispatch(getItem({ is_main: false }))
      } catch (error) {
        console.log(error, '!!')
      }
    }
    fetchItem()
  }, [dispatch]);
  const itemApiData = useSelector((state) => state?.getItem?.user?.data);

  const getPurchaseOrder = () => {
    const myurl = `${V_URL}/user/get-order`;
    const formData = new URLSearchParams();
    formData.append("tag", "1");
    // formData.append("store_type", "2");
    axios({
      method: "post",
      url: myurl,
      data: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    }).then(async (response) => {
      console?.log("@@", response?.data);
      if (response?.data?.success) {
        const data = response.data.data;
        const filteredData = data?.filter((e) => e?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setEntity(filteredData);
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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const myurl = `${V_URL}/user/delete-stock`;
        var bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);

        axios({
          method: "delete",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }).then((response) => {
          console.log(response.data, "DEL");
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
  };

  const handleClose = () => setShow(false);

  const handleRefresh = () => {
    setDisable(true);
  };

  const handleSaveModal = (data) => {
    // console.log(data, '%%%');
    const myurl = `${V_URL}/user/manage-order-adjustment`;
    var bodyFormData = new URLSearchParams();
    bodyFormData.append('order', data?.orderId);
    bodyFormData.append('itemName', data?.itemId);
    bodyFormData.append('balance_qty', data?.balance_qty);
    bodyFormData.append('receive_qty', data?.receive);
    bodyFormData.append('tag', '1');
    bodyFormData.append('store_type', data?.store_type);

    axios({
      method: 'post',
      url: myurl,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
    }).then((response) => {
      // console.log(response?.data, '@@')
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setShow(false);
        data.receive = '';
        setDisable(true);
      } else {
        toast.error(response?.data?.message);
      }
    }).catch((error) => {
      console.log(error, '!!');
      toast.error(error.response?.data?.message)
    })
  }
  const handleEdit = (elem, e) => {
    setSelectedData({ elem, e })
    setShow(true);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Purchase Orders</li>
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
                            <h3>Purchase Orders List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }}
                                  />
                                  {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                  <a className="btn">
                                    <img
                                      src="/assets/img/icons/search-normal.svg"
                                      alt="firm-searchBox"
                                    />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                <Link
                                  to="/piping/user/manage-purchase-order"
                                  className="btn btn-primary add-pluss ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Add"
                                >
                                  <img
                                    src="/assets/img/icons/plus.svg"
                                    alt="plus-icon"
                                  />
                                </Link>
                                <button type="button" onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip"
                                  data-placement="top" title="Refresh">
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
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
                            <th>Order No.</th>
                            <th>Item</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>Balance</th>
                            {/* <th>Party</th> */}
                            <th>Order Date</th>
                            <th>Receive</th>
                            <th>With PO</th>
                            <th>Store Type</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData.map((elem, i) => (
                            <>
                              {elem?.items.length > 0 ? (
                                elem.items.map((e) => (
                                  <tr key={e?._id}>
                                    <td><b>{elem?.orderNo}</b></td>
                                    <td>{itemApiData?.find(it => it?._id === e?.itemName)?.name}</td>
                                    <td>{e?.rate}</td>
                                    <td>{e?.quantity}</td>
                                    <td>{e?.balance_qty}</td>
                                    {/* <td>{elem?.party?.name}</td> */}
                                    <td>{moment(elem?.orderDate).format('YYYY-MM-DD')}</td>
                                    <td>{e?.balance_qty !== 0 && e?.with_po === true ? (
                                      <a style={{ cursor: "pointer" }} onClick={() => handleEdit(elem, e)}>  <HandCoins /></a>
                                    ) : <X />}
                                    </td>
                                    <td className='status-badge'>
                                      {e?.with_po === true ? (
                                        <span className="custom-badge status-green">True</span>
                                      ) : (
                                        <span className="custom-badge status-pink">False</span>
                                      )}
                                    </td>
                                    <td>
                                      {elem?.store_type === 1 ? (
                                        <span className='custom-badge status-purple'>Main Store</span>
                                      ) : (
                                        <span className='custom-badge status-purple'>Project Store</span>
                                      )}
                                    </td>
                                    <td>
                                      {elem?.status === 1 ? (
                                        <span className="custom-badge status-orange">Pending</span>
                                      ) : (
                                        <span className="custom-badge status-green">Completed</span>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      <div className="dropdown dropdown-action">
                                        <a href="#" className="action-icon dropdown-toggle"
                                          data-bs-toggle="dropdown" aria-expanded="false">
                                          <i className="fa fa-ellipsis-v"></i>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-end">
                                          <button type="button" className="dropdown-item"
                                            onClick={() => navigate("/piping/user/manage-purchase-order", { state: elem, })} >
                                            <i className="fa-solid fa-pen-to-square m-r-5"></i>
                                            Edit
                                          </button>
                                          <button
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => handleDelete(elem?._id, elem?.orderNo)} >
                                            <i className="fa fa-trash-alt m-r-5"></i>
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr key={elem?._id}>
                                  <td><b>{elem?.orderNo}</b></td>
                                  <td colSpan="4">No items</td>
                                  <td>{elem.party?.name}</td>
                                  <td>{moment(elem?.orderDate).format('YYYY-MM-DD')}</td>
                                  <td colSpan="3">No items</td>
                                  <td>
                                    {elem?.status === 1 ? (
                                      <span className="custom-badge status-orange">Pending</span>
                                    ) : (
                                      <span className="custom-badge status-green">Completed</span>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    <div className="dropdown dropdown-action">
                                      <a
                                        href="#"
                                        className="action-icon dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fa fa-ellipsis-v"></i>
                                      </a>
                                      <div className="dropdown-menu dropdown-menu-end">
                                        <button
                                          type="button"
                                          className="dropdown-item"
                                          onClick={() => navigate("/piping/user/manage-purchase-order", { state: elem, })} >
                                          <i className="fa-solid fa-pen-to-square m-r-5"></i>
                                          Edit
                                        </button>
                                        <button type="button" className="dropdown-item" onClick={() => handleDelete(elem?._id, elem?.orderNo)}  >
                                          <i className="fa fa-trash-alt m-r-5"></i>
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}

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
                        <div
                          className="dataTables_info"
                          id="DataTables_Table_0_info"
                          role="status"
                          aria-live="polite"
                        >
                          Showing {Math.min(limit, totalItems)} from {totalItems} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate"
                        >
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
          ) : (
            <Loader />
          )}
        </div>
      </div>
      <OrderModal
        show={show}
        handleClose={handleClose}
        handleSaveModal={handleSaveModal}
        selectedData={selectedData}
        itemApiData={itemApiData}
      />
    </div>
  );
};

export default PurchaseOrder;
