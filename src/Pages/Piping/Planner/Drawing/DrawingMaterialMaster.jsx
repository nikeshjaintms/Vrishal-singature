import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../Include/Footer";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { getDrawingMaterialMasterData } from "../../../../Store/Piping/Drawing/getDrawingMaterialMasterData";

import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import { DownloadXlsx } from "../../../Store/Components/DownloadXlsx";

const DrawingMaterialMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [disable, setDisable] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [rows, setRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const data = useSelector(
  (state) => state?.getDrawingMaterialMasterData?.user || {}
);

 const pagination = useSelector(
  (state) => state?.getDrawingMaterialMasterData?.user?.pagination || {}
);


  const columnHeaders = [
    "SR.",
    "UNIQUE NO.",
    "DRAWING NO.",
    "REV",
    "UNIT/AREA",
    "RECEIVED LOT NO.",
    // "P & ID DRAWING NO.",
    "PIPING CLASS",
    "SERVICE",
    "PIPING MATERIAL SPECIFICATION",
    "ITEM CODE",
    "ITEM NAME",
    "ITEM DESCRIPTION",
    "SIZE 1",
    "THICKNESS 1",
    "SIZE 2",
    "THICKNESS 2",
    "MATERIAL GRADE",
    "UOM",
    "QTY",
  ];

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // ⚡ CALL REDUX API
  useEffect(() => {
    dispatch(
      getDrawingMaterialMasterData({
        page: currentPage,
        limit,
        search,
        project: localStorage.getItem("U_PROJECT_ID"),
      })
    );
  }, [currentPage, limit, search]);

  // ⚡ UPDATE TABLE ROWS WHEN API RETURNS
useEffect(() => {
  if (data?.success) {
    setRows(data.data || []);
    setTotalItems(data.pagination?.totalRecords || 0);
  }
}, [data]);


const processedRows = useMemo(() => {
  if (!rows || rows.length === 0) return [];

  // Group by drawing_no + area + piping class + sheet + p&ID
  const grouped = rows.reduce((acc, item) => {
    const areaVal = item.area_unit?.area || "";
    const pipingClassVal = item.piping_class?.PipingClass || item.piping_class || "";
    const key = `${item.drawing_no}-${areaVal}-${pipingClassVal}-${item.sheet_no}-${item.p_id_drawing_no}`;

    // Make a deep copy to avoid frozen objects
    const itemCopy = { ...item, items: item.items?.map(i => ({ ...i })) };

    if (!acc[key]) acc[key] = [];
    acc[key].push(itemCopy);
    return acc;
  }, {});

  // Mark oldest entry as red
  Object.values(grouped).forEach(group => {
    if (group.length > 1) {
      group.sort((a, b) => new Date(b.master_updation_date) - new Date(a.master_updation_date));

      // mark oldest as red
      group[group.length - 1].isMain = true;

      for (let i = 0; i < group.length - 1; i++) group[i].isMain = false;
    }
  });

  return Object.values(grouped).flat();
}, [rows]);


  
  const handleExcelDownload = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("download", "excel");
    bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));

    DownloadXlsx({
      apiMethod: "post",
      url: "excel-drawing-material-master-data-download",
      body: bodyFormData,
      fileName: "Drawing_Material_Master_Data",
    });
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
                    <Link to="/piping/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Drawing Items</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 🔄 LOADING STATE */}
       
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">

                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Drawing Items</h3>

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
                                    <img
                                      src="/assets/img/icons/search-normal.svg"
                                      alt="search"
                                    />
                                  </a>
                                </form>
                              </div>

                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                >
                                  <img
                                    src="/assets/img/icons/re-fresh.svg"
                                    alt="refresh"
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleExcelDownload}
                                  className="btn w-100 btn btn-primary me-2"
                                >
                                  Download Excel{" "}
                                  <i className="fa-solid fa-download mx-2"></i>
                                </button>
                              </div>
                            </div>
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

                    {/* TABLE */}
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
  {processedRows.map((row, rowIndex) =>
    row.items?.map((item, itemIndex) => (
      <tr key={`${rowIndex}-${itemIndex}`}
         className={row.isMain ? "table-row-red" : ""}
                        
      >
       
        {/* SR only for first item */}
        <td>{itemIndex === 0 ? rowIndex + 1 : ""}</td>

        {/* Drawing fields only for first row */}
        <td>{itemIndex === 0 ? row.unique_no : ""}</td>
        <td>{itemIndex === 0 ? row.drawing_no : ""}</td>
        <td>{itemIndex === 0 ? row.rev : ""}</td>
        <td>{itemIndex === 0 ? row.area_unit?.area : ""}</td>
        <td>{itemIndex === 0 ? row.drawing_received_lot_no : ""}</td>
        {/* <td>{itemIndex === 0 ? row.p_id_drawing_no : ""}</td> */}
        <td>{itemIndex === 0 ? row.piping_class?.PipingClass : ""}</td>

        {/* service & PMS only first row */}
        <td>{itemIndex === 0 ? row?.service_details?.service : ""}</td>
        <td>{itemIndex === 0 ? row?.service_details?.PipingMaterialSpecification?.name : ""}</td>

        {/* item details ALWAYS shown */}
        <td>{item?.item?.item_code || "-"}</td>
        <td>{item?.item?.item_name || "-"}</td>
        <td>{item?.item?.item_description || "-"}</td>
        <td>{item?.item?.size1?.name || "-"}</td>
        <td>{item?.item?.thickness1?.name || "-"}</td>
        <td>{item?.item?.size2?.name || "-"}</td>
        <td>{item?.item?.thickness2?.name || "-"}</td>
        <td>{item?.item?.material_grade ||"-"}</td>
        <td>{item?.item?.uom?.name || "-"}</td>
        <td>{item?.qty || "-"}</td>

      </tr>
    ))
  )}
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
      
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default DrawingMaterialMaster;
