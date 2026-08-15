import React, { useEffect, useMemo,useState } from "react";
import Footer from "../../Include/Footer";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { getDrawingJointMasterData } from "../../../../Store/Piping/Drawing/getDrawingJointMaster";

import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import { DownloadXlsx } from "../../../Store/Components/DownloadXlsx";

const DrawingJointDataMaster = () => {
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
    (state) => state?.getDrawingJointMasterData?.user || {}
  );
console.log("data ok========>",data);
  const pagination = useSelector(
    (state) => state?.getDrawingJointMasterData?.user?.pagination || {}
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
    "SPOOL NO",
    "JOINT NO",
     "SHEET NO",
    "ITEM NAME 1",
    "ITEM NAME 2",
    "SIZE",
    "THICKNESS",
    "JOINT TYPE",
    // "AREA",
    // "IMCH/METER"
  ];

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleRefresh = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // Fetch API
  useEffect(() => {
    dispatch(
      getDrawingJointMasterData({
        page: currentPage,
        limit,
        search,
        project: localStorage.getItem("U_PROJECT_ID"),
      })
    );
  }, [currentPage, limit, search]);

  // Update table rows when API returns
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
console.log("processedRows",processedRows)
  const handleExcelDownload = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("download", "excel");
    bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));

    DownloadXlsx({
      apiMethod: "post",
      url: "excel-drawing-joint-master-data-download",
      body: bodyFormData,
      fileName: "Drawing_Joint_Master_Data",
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
                                                                                                    }} />
                                                                                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                                                    alt="search" /></a>
                                                                                            </form>
                                                                                        </div>

                            <div className="add-group">
                            <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                            </div>
                          </div>

  <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                 <div className='add-group'>
                                                                <button
                                  type="button"
                                  onClick={handleExcelDownload}
                                  className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
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
  {(() => {
    let drawingSr = 1; // SR no per drawing

    return processedRows.map((drawing, dIndex) => {
      // Calculate total rows (joint count across all spools)
      const totalJointRows = drawing.spool_wise.reduce((acc, sp) => {
        const jointNos = new Set(
          sp.material_items.map(mi => mi.joint_no || "unknown")
        );
        return acc + jointNos.size;
      }, 0);

      return drawing.spool_wise.flatMap((spool, spIndex) => {
        // group material_items by joint_no
        const jointMap = {};
        spool.material_items.forEach(mi => {
          const jno = mi.joint_no || "unknown";
          if (!jointMap[jno]) jointMap[jno] = [];
          jointMap[jno].push(mi);
        });

        const jointNos = Object.keys(jointMap);

        return jointNos.map((jointNo, jIndex) => {
          const jm = jointMap[jointNo];

          const item1 = jm[0]?.material_item_id?.[0]?.item?.item_name || "-";
          const item2 = jm[0]?.material_item_id?.[1]?.item?.item_name || "-";
          const size1 = jm[0]?.selected_size?.name || "-";
          const thickness1 = jm[0]?.selected_thickness?.name || "-";
          const jointType = jm[0]?.joint_type?.name || "-";
          const sheetNo = jm[0]?.sheet_no || "-";
          const area = spool.area || "-";
          const inchMeter = spool.inch_meter || "-";

          return (
            <tr key={`${drawing._id}-${spool._id}-${jointNo}`}
              className={drawing.isMain ? "table-row-red" : ""}
            >
             
              {/*  SR NO — show only on FIRST ROW of the drawing */}
              {spIndex === 0 && jIndex === 0 && (
                <td rowSpan={totalJointRows}>{drawingSr++}</td>
              )}

              {/*  Drawing level details — rowSpanned only once */}
              {spIndex === 0 && jIndex === 0 && (
                <>
                  <td rowSpan={totalJointRows}>{drawing.unique_no}</td>
                  <td rowSpan={totalJointRows}>{drawing.drawing_no}</td>
                  <td rowSpan={totalJointRows}>{drawing.rev}</td>
                 
                  <td rowSpan={totalJointRows}>{drawing.area_unit?.area || "-"}</td>
                  <td rowSpan={totalJointRows}>{drawing.drawing_received_lot_no || "-"}</td>
                  {/* <td rowSpan={totalJointRows}>{drawing.p_id_drawing_no || "-"}</td> */}
                  <td rowSpan={totalJointRows}>{drawing.piping_class?.PipingClass || "-"}</td>
                  {/* <td rowSpan={totalJointRows}>{drawing.piping_class?.Items?.[0]?.service || "-"}</td> */}
                  <td rowSpan={totalJointRows}>{drawing?.service_details?.service || ""}</td>
      <td rowSpan={totalJointRows}>{drawing?.service_details?.PipingMaterialSpecification || ""}</td>
                  {/* <td rowSpan={totalJointRows}>{drawing.piping_class?.Items?.[0]?.PipingMaterialSpecification || "-"}</td> */}
                </>
              )}

              {/*  Spool no (rowSpan only inside the spool) */}
              {jIndex === 0 && (
                <td rowSpan={jointNos.length}>{spool.spool_no || "-"}</td>
              )}

              {/* Joint level */}
              <td>{jointNo}</td>
              <td>{sheetNo ||  "-"}</td>

              <td>{item1}</td>
              <td>{item2}</td>
              <td>{size1}</td>
              <td>{thickness1}</td>
              <td>{jointType}</td>

              {/* area / inchMeter once per spool */}
              {/* {jIndex === 0 && (
                <>
                  <td>{area}</td>
                  <td>{inchMeter}</td>
                </>
              )} */}
            </tr>
          );
        });
      });
    });
  })()}
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

export default DrawingJointDataMaster;
