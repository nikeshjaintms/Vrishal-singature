
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { M_STORE, V_URL } from "../../../../BaseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import Swal from "sweetalert2";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { DownloadPdf } from "../../Components/DownloadPdf";
import { getOrder } from "../../../../Store/Store/Order/Order";
import { DownloadXlsx } from "../../Components/DownloadXlsx";
import FilterComponent from "../FilterComponent";
// import { getIssueItemReturn } from "../../../../Store/Store/MainStore/ItemReturn/GetIssueItemReturn";
import { getIssueItemReturn } from "../../../../Store/Store/MainStore/ItemReturn/GetIssueItemReturn";



const ManageItemReturn = () => {
  const issueItemReturnData = useSelector((state => state?.getIssueItemReturn?.data?.data))
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();
  const [commentsData, setCommentsData] = useState([]);
  const [filter, setFilter] = useState({
    date: {
      start: null,
      end: null
    }
  });
  const [openFilter, setOpenFilter] = useState(false)

  const fetchData = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("tag_number", 13);
    bodyFormData.append("search", search);
    bodyFormData.append("filter", JSON.stringify(filter));
    bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'))
    bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'))
    dispatch(getIssueItemReturn({ formData: bodyFormData }));
    setDisable(false);
  };

  
  useEffect(() => {
    if (localStorage.getItem('PAY_USER_TOKEN') === null) {
      navigate("/user/login");
    } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
      toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
      navigate("/user/login");
    }
    fetchData()
  }, [navigate, disable, filter, search]);
  // const entity = useSelector((state) => state?.getIssueItemReturn?.user?.data);
  const entity = useSelector((state) => state?.getIssueItemReturn?.data?.data);


  // const commentsData = useMemo(() => {
  //   let computedComments = getAllIssue;
  //   setTotalItems(computedComments?.length);
  //   return computedComments?.slice(
  //     (currentPage - 1) * limit,
  //     (currentPage - 1) * limit + limit
  //   );
  // }, [getAllIssue, currentPage, search, limit, getAllIssue]);

//   useEffect(() => {
//   if (entity?.length) {
//     // Filter the data where return item is yes (assuming field is is_return or similar)
//     const filtered = entity.filter(item => item.isreturn === true); 
// console.log("filtered",filtered);
//     const paginated = filtered.slice(
//       (currentPage - 1) * limit,
//       (currentPage - 1) * limit + limit
//     ).map(item => ({ ...item, checked: false }));

//     setCommentsData(paginated);
//     setTotalItems(filtered.length);
//   } else {
//     setCommentsData([]);
//     setTotalItems(0);
//   }
// }, [entity, currentPage, limit]);

  useEffect(() => {
    if (entity?.length) {
      const paginated = entity.slice(
        (currentPage - 1) * limit,
        (currentPage - 1) * limit + limit
      ).map(item => ({ ...item, checked: false }));
      
      setCommentsData(paginated);
      setTotalItems(entity.length);
    }
  }, [entity, currentPage, limit]);
  

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
        const myurl = `${V_URL}/user/delete-iss`;
        var bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);
        axios({
          method: "PUT",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }).then((response) => {
          if (response.data.success === true) {
            fetchData()
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

  const handleDateChange = (e, type) => {
    const dateValue = e.target.value;
    setFilter(prevFilter => {
      const newFilter = {
        ...prevFilter,
        date: {
          ...prevFilter.date,
          [type]: dateValue
        }
      }
      return newFilter;
    });
  }

  const handleDonwloadPDf = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('print_date', true);
    bodyFormData.append('search', search);
    bodyFormData.append('tag_number', 13);
    bodyFormData.append('filter', JSON.stringify(filter));
    bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
    bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
    DownloadPdf({ apiMethod: 'post', url: 'pdf-ms-trans-download', body: bodyFormData });
  }

  const handleDownloadXlsx = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('print_date', true);
    bodyFormData.append('search', search);
    bodyFormData.append('tag_number', 13);
    bodyFormData.append('filter', JSON.stringify(filter));
    bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
    bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
    DownloadXlsx({ apiMethod: 'post', url: 'xlsx-ms-trans-download', body: bodyFormData });
  }

  const handleRefresh = () => {
    setDisable(true);
    setSearch('');
    setFilter({
      date: {
        start: null,
        end: null
      }
    })
  };

  const handleDownloadPdf = (id) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('id', id);
    bodyFormData.append('print_date', true);
    DownloadPdf({ apiMethod: 'post', url: 'iss-download-pdf', body: bodyFormData })
  }
  const handleSDDownloadPdf = (id) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('id', id);
    bodyFormData.append('print_date', true);
    DownloadPdf({ apiMethod: 'post', url: 'iss-sort-download-pdf', body: bodyFormData })
  }
  const handleLDDownloadPdf = (id) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('id', id);
    bodyFormData.append('print_date', true);
    DownloadPdf({ apiMethod: 'post', url: 'iss-long-download-pdf', body: bodyFormData })
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

const handleSaveSelected = () => {
  const selectedItems = commentsData.filter(item => item.checked);

  if (selectedItems.length === 0) {
    toast.error("Please select at least one item.");
    return;
  }

  // Save in localStorage to persist on refresh
  localStorage.setItem("selectedItemsReturns", JSON.stringify(selectedItems));
  

  navigate("/main-store/user/manage-purchase-issue-return", {
    state: { selectedItems },
  });

  //  navigate("/main-store/user/manage-purchase-issue-return", {
  
  // });
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
                    <Link to="/main-store/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Issue </li>
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
                            <h3>Issue</h3>
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
                                {/* <Link
                                  to="/main-store/user/manage-purchase-issue"
                                  className="btn btn-primary add-pluss ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Add"
                                >
                                  <img
                                    src="/assets/img/icons/plus.svg"
                                    alt="plus-icon"
                                  />
                                </Link> */}
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Refresh"
                                >
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                                <button
                                  className="btn btn-primary doctor-refresh ms-2"
                                  onClick={() => setOpenFilter(!openFilter)}
                                  aria-controls="filter-inputs"
                                  aria-expanded={openFilter}
                                >
                                  <i className="fas fa-filter"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                        </div>
                        <FilterComponent
                          handleDateChange={handleDateChange}
                          handleDownloadPdf={handleDonwloadPDf}
                          handleDownloadXlsx={handleDownloadXlsx}
                          openFilter={openFilter}
                        />
                      </div>
                    </div>
                    <div className="table-responsive">
                     <table className="table border-0 custom-table comman-table mb-0">
  <thead>
    <tr>
      {/* <th>Select</th> */}
      <th>Sr No.</th>
      <th>Item Name</th>
      <th>Qty</th>
      <th>Unit</th>
      <th>Rate</th>
      <th>Amount</th>
      <th>GST</th>
      <th>Total</th>
      <th>Remarks</th>
    </tr>
  </thead>
  <tbody>
    {(() => {
      let srNo = 1;  // Initialize serial number

      return commentsData?.flatMap((elem, i) =>
        elem.items_details?.map((item, idx) => (
          <tr key={item._id || `${elem._id}-${idx}`}>
            {/* <td>
              <input
                type="checkbox"
                className="form-check-input"
                checked={elem.checked || false}
                onChange={(e) => {
                  const updatedItems = [...commentsData];
                  updatedItems[i].checked = e.target.checked;
                  setCommentsData(updatedItems);
                }}
              />
            </td> */}
            <td>{srNo++}</td>  {/* Simple serial number */}
            <td>{item.item_name || "-"}</td>
            <td>{item.quantity}</td>
            <td>{item.unit}</td>
            <td>{item.rate}</td>
            <td>{item.amount}</td>
            <td>{item.gst}%</td>
            <td>{item.total_amount}</td>
            <td>{item.remarks || "-"}</td>
          </tr>
        )) || []
      );
    })()}

    {commentsData?.length === 0 || commentsData === undefined ? (
      <tr>
        <td colSpan="999">
          <div className="no-table-data">No Data Found!</div>
        </td>
      </tr>
    ) : null}
  </tbody>
</table>

                    </div>
                       <div className="col-12 text-end">
                        <div className="doctor-submit text-end">
                          {/* <button
                            type="button"
                            className="btn btn-primary submit-form ms-2"
                          
                              onClick={handleSaveSelected}
                          >
                            Generate Item Report
                          </button> */}
                        </div>
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
      </div>
    </div>
  )
}

export default ManageItemReturn