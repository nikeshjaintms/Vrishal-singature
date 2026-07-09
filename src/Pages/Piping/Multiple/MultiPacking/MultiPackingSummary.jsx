import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../Include/Footer";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import { getMultiPackingSummaryPiping } from "../../../../Store/Piping/MultiPacking/GetMultiPackingSummaryPiping";
import { PdfDownloadErp } from "../../../../Components/ErpPdf/PdfDownloadErp";
const MultiPackingSummary = () => {
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  // Redux selector
  const data = useSelector(
    (state) => state?.getMultiPackingSummaryPiping?.user?.data?.data || []
  );

  const pagination = useSelector(
    (state) => state?.getMultiPackingSummaryPiping?.user?.data?.pagination || {}
  );

  const columnHeaders = [
    "SR",
    "Report No",
    "Consignment No",
    "Dispatch Date",
    "Truck No",
    "Driver Name & No",
    "GSTIN",
    "E-Way Bill",
    "Line No / Drawing No",
    "Spool No / Item",
    "Size 1",
    "Thickness 1",
    "Size 2",
    "Thickness 2",
    "UOM",
    "Qty",
    "Piping Material Specification",
    "IRN No / IMIR",
    "Packed By",
    "Date"
  ];

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // Fetch API
  useEffect(() => {
    dispatch(
      getMultiPackingSummaryPiping({
        page: currentPage,
        limit,
        search,
      })
    );
  }, [dispatch, currentPage, limit, search]);

  // Update rows when Redux data changes
  useEffect(() => {
    setRows(Array.isArray(data) ? data : []);
    setTotalItems(pagination?.totalCount || (Array.isArray(data) ? data.length : 0));
  }, [data, pagination]);

   const handlePdfDownload = () => {
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
      PdfDownloadErp({ apiMethod: 'post', url: 'piping/export-multi-packing-summary-xlsx', body: bodyFormData });
  }
  

  const processedRows = useMemo(() => {
    return Array.isArray(rows) ? rows : [];
  }, [rows]);

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
                  <li className="breadcrumb-item active">Packing List Summary</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">

                  {/* Header */}
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Packing List Summary</h3>

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

                      <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                        <div className='add-group'>
                            <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={handlePdfDownload}>Download Packing List <i className="fa-solid fa-download mx-2"></i></button>
                        </div>
                        <DropDown
                          limit={limit}
                          onLimitChange={(val) => setLimit(val)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="table-responsive">
                    <table className="table border-0 comman-table mb-0 dpr-table">

                      <thead>
                        <tr>
                          {columnHeaders.map((header, idx) => (
                            <th key={idx}>{header}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {processedRows.length > 0 ? (
                          processedRows.map((elem, i) => {
                            const items = elem.items || [];
                            const totalRows = items.length || 1;

                            return items.map((item, index) => (
                              <tr key={`${elem._id}-${index}`}>

                                {/* Packing-level merged cells */}
                                {index === 0 && (
                                  <>
                                    <td rowSpan={totalRows}>
                                      {(currentPage - 1) * limit + i + 1}
                                    </td>
                                    <td rowSpan={totalRows}>{elem.voucher_no}</td>
                                    <td rowSpan={totalRows}>{elem.consignment_no}</td>
                                    <td rowSpan={totalRows}>
                                      {moment(elem.dispatch_date).format("YYYY-MM-DD HH:mm")}
                                    </td>
                                    <td rowSpan={totalRows}>{elem.vehicle_no}</td>
                                    <td rowSpan={totalRows}>{elem.driver_name}</td>
                                    <td rowSpan={totalRows}>{elem.gst_no}</td>
                                    <td rowSpan={totalRows}>{elem.e_way_bill_no}</td>
                                  </>
                                )}

                                {/* Item-level cells */}
                                <td>{item?.drawing_no || "-"}</td>
                                <td>{item?.item_name || item?.spool_no || "-"}</td>
                                <td>{item?.size_1 || "-"}</td>
                                <td>{item?.thickness_1 || "-"}</td>
                                <td>{item?.size_2 || "-"}</td>
                                <td>{item?.thickness_2 || "-"}</td>
                                <td>{item?.uom ? item.uom : item?.spool_no ? "NOS" : "-"}</td>
                                <td>{item?.packaged_qty || "-"}</td>
                                <td>{item?.piping_material_specification || "-"}</td>
                                <td>
                                  {Array.isArray(item?.imir_no) && item.imir_no.length > 0
                                    ? item.imir_no.map((imir, idx) => (
                                        <React.Fragment key={idx}>
                                          {imir}
                                          {idx < item.imir_no.length - 1 && <br />}
                                        </React.Fragment>
                                      ))
                                    : item?.irn_no || "-"}
                                </td>

                                {index === 0 && (
                                  <>
                                    <td rowSpan={totalRows}>{elem.packed_by}</td>
                                    <td rowSpan={totalRows}>
                                      {moment(elem.createdAt).format("YYYY-MM-DD HH:mm")}
                                    </td>
                                  </>
                                )}

                              </tr>
                            ));
                          })
                        ) : (
                          <tr>
                            <td colSpan={columnHeaders.length}>
                              <div className="no-table-data">No Data Found</div>
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

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MultiPackingSummary;