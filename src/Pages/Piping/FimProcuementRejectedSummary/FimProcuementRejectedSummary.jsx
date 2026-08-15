import React, { useEffect, useMemo, useState } from "react";
import Footer from "../Include/Footer";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";
import Loader from "../Include/Loader";
import { Pagination, Search } from "../Table";
import DropDown from "../../../Components/DropDown";
import { PlannerQcAuth } from "../../../Routes/Users/Auth/AuthGuard";
import moment from "moment";
import { DownloadXlsx } from "../../Store/Components/DownloadXlsx";

const FimProcuementRejectedSummary = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [entity, setEntity] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const columnHeaders = [
    "SR",
    "Packing List No",
    "RGP No",
    "Supplier",
    "Vehicle",
    "Returnable",
    "Accepted Qty",
    "Rejected Qty",
    "Date"
  ];

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const getPackingLists = async () => {

    setLoading(true);
    const project = localStorage.getItem("U_PROJECT_ID");

    try {

      const res = await axios.post(
        `${V_URL}/user/get-fim-rejected-qty-summary`,
        { project, page: currentPage, limit, search },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {

        const data = res.data.data?.data || [];
        const pagination = res.data.data?.pagination;

        setEntity(data);
        setTotalItems(pagination?.totalItems || data.length);

      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }

  };

const downloadExcel = async () => {
  try {
    setLoading(true);

    const response = await axios.post(
      `${V_URL}/user/download-Fim-Rejected-Qty-Summary-Excel`,
      {
        project: localStorage.getItem("U_PROJECT_ID"),
        search,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "FIM_Rejected_Qty_Summary.xlsx");

    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.log("Excel Download Error", error);
  } finally {
    setLoading(false);
  }
};

    // const downloadExcel = () => {
    //   const bodyFormData = new URLSearchParams();
    //   bodyFormData.append("download", "excel");
    //   bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
    //   DownloadXlsx({
    //     apiMethod: "post",
    //     url: "download-Fim-Rejected-Qty-Summary-Excel",
    //     body: bodyFormData,
    //     fileName: "FIM Rejected Qty Summary - PIPING",
    //   });
    // }
  useEffect(() => {
    getPackingLists();
  }, [currentPage, limit, search]);



  const summaryData = useMemo(() => {

    return entity.map((pack) => {

      let accepted = 0;
      let rejected = 0;

      pack.items?.forEach((item) => {
        item.heat_rows?.forEach((heat) => {
          accepted += heat.accepted_qty || 0;
          rejected += heat.rejected_qty || 0;
        });
      });

      return {
        id: pack._id,
        packing_no: pack.package_list_no,
        rgp_no: pack.rgp_no,
        supplier: pack.supplier,
        vehicle: pack.vehicle_number,
        returnable: pack.returnable_type,
        date: pack.package_list_date,
        accepted_qty: accepted,
        rejected_qty: rejected,
      };

    });

  }, [entity]);



  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">

          {/* Breadcrumb */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    FIM Rejected Qty Summary
                  </li>
                </ul>
              </div>
            </div>
          </div>


          {loading ? (
            <Loader />
          ) : (

            <div className="row">
              <div className="col-sm-12">

                <div className="card card-table show-entire">
                  <div className="card-body">

                    {/* Header */}
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">

                        <div className="col">
                          <div className="doctor-table-blk">

                            <h3>FIM Rejected Qty Summary</h3>

                            <div className="doctor-search-blk">

                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }}
                                  />
                                  <a className="btn">
                                    <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                  </a>
                                </form>
                              </div>



                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                >
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              </div>


                            </div>

                          </div>
                        </div>
 <div className="col-auto ms-auto">
                                 <div className='add-group'>
                                                                <button
                                  type="button"
                                    onClick={downloadExcel}
                                  className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
                                >
                                  Download Excel{" "}
                                  <i className="fa-solid fa-download mx-2"></i>
                                </button>
                                                                </div>
                            </div>
                        <div className="pageDropDown col-auto ms-auto">
                          <DropDown
                            limit={limit}
                            onLimitChange={(val) => setLimit(val)}
                          />
                        </div>

                      </div>
                    </div>


                    {/* Table */}
                    <div className="table-responsive">
                      <table className="table border-0 comman-table mb-0 dpr-table">

                        <thead>
                          <tr>
                            {columnHeaders.map((header, index) => (
                              <th key={index}>{header}</th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>

                          {summaryData.length > 0 ? (

                            summaryData.map((elem, i) => (

                              <tr key={elem.id}>

                                <td>
                                  {(currentPage - 1) * limit + i + 1}
                                </td>

                                <td>{elem.packing_no}</td>

                                <td>{elem.rgp_no}</td>

                                <td>{elem.supplier}</td>

                                <td>{elem.vehicle}</td>

                                <td>{elem.returnable}</td>

                                <td>
                                 
                                    {elem.accepted_qty}
                                
                                </td>

                                <td>
                                 
                                    {elem.rejected_qty}
                                
                                </td>

                                <td>
                                  {elem.date
                                    ? moment(elem.date).format("YYYY-MM-DD")
                                    : "-"
                                  }
                                </td>

                            

                              </tr>

                            ))

                          ) : (

                            <tr>
                              <td colSpan={columnHeaders.length}>
                                <div className="no-table-data">
                                  No Data Found
                                </div>
                              </td>
                            </tr>

                          )}

                        </tbody>

                      </table>
                    </div>


                    {/* Pagination */}
                        <div className="row align-center mt-3 mb-2">
                                       <div className="col-sm-6">
                                         <div className="dataTables_info">
                                           Showing {Math.min(limit, totalItems)} from {totalItems} data
                                         </div>
                                       </div>
                                       <div className="col-sm-6">
                                         <div className="dataTables_paginate paging_simple_numbers">
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

          )}

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default FimProcuementRejectedSummary;