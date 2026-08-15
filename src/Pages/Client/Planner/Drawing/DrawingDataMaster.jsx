
import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../Include/Footer";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getMultipleDrawingMasterData } from "../../../../Store/MutipleDrawing/MultipleDrawing/getDrawingMasterData";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import axios from "axios";
import { DownloadXlsx } from "../../../Store/Components/DownloadXlsx";

const DrawingDataMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disable, setDisable] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);


useEffect(() => {
  if (disable === true) {
    dispatch(
      getMultipleDrawingMasterData({
        id: localStorage.getItem("DRAWING_ID"),
        project: localStorage.getItem("U_PROJECT_ID"),
        page: currentPage,
        limit,
        search
      })
    );
    setDisable(false);
  } else {
    //Re-fetch when page or limit changes
    dispatch(
      getMultipleDrawingMasterData({
        id: localStorage.getItem("DRAWING_ID"),
        project: localStorage.getItem("U_PROJECT_ID"),
        page: currentPage,
        limit,
        search
      })
    );
  }
}, [dispatch, disable, currentPage, limit, search]);


  const entity = useSelector(
    (state) => state?.getMultipleDrawingMasterData?.user?.data
  );
console.log("Entity:", entity);


const groupedData = useMemo(() => {
  const rows = Array.isArray(entity?.data) ? entity.data : [];
  if (rows.length === 0) return [];

  let filtered = rows;
  if (search.trim() !== "") {
    filtered = rows.filter((item) =>
      item?.drawing_no?.toLowerCase().includes(search.toLowerCase())
    );
  }

  const revMap = {};
  filtered.forEach((drawing) => {
    const key = `${drawing.drawing_no}-${drawing.unit}-${drawing.items?.[0]?.drawing_id?.assembly_no}`;
    const currentRev = drawing.rev ?? 0;
    if (!revMap[key] || revMap[key] < currentRev) {
      revMap[key] = currentRev;
    }
  });

  return filtered.map((drawing) => {
    const key = `${drawing.drawing_no}-${drawing.unit}-${drawing.items?.[0]?.drawing_id?.assembly_no}`;
    const maxRev = revMap[key];
    const isMain = (drawing.rev ?? 0) === maxRev;

    const gridGrouped = {};
    (drawing.items ?? []).forEach((row) => {
      const gridNo = row?.grid_id?.grid_no || "N/A";
      if (!gridGrouped[gridNo]) {
        gridGrouped[gridNo] = { grid: row.grid_id, rows: [] };
      }
      gridGrouped[gridNo].rows.push({ ...row, isMain });
    });

    return {
      drawing,
      isMain,
      grids: Object.values(gridGrouped),
    };
  });
}, [entity, search]);


  // useEffect(() => {
  //   if (groupedData) setTotalItems(groupedData.length);
  // }, [groupedData]);


  useEffect(() => {
  if (entity?.pagination) {
    setTotalItems(entity.pagination.totalRecords);
  }
}, [entity]);

useEffect(() => {
  if (entity?.pagination?.currentPage && entity.pagination.currentPage !== currentPage) {
    setCurrentPage(entity.pagination.currentPage);
  }
}, [entity]);

  const startIndex = (currentPage - 1) * limit;
  // const paginatedGroups = groupedData.slice(startIndex, startIndex + limit);
  const paginatedGroups = groupedData; // backend already paginated


  const columnHeaders = [
    "SR.",
    "DRAWING NO.",
    "REV",
    "ASSEMBLY NO.",
    "GRID NO.",
    "GRID QTY",
    "SECTIONS DETAILS",
    "ITEM NO.",
    "ITEM QTY",
    "LENGTH",
    "WIDTH",
    "UNIT WEIGHT",
    "ASM. WEIGHT",
    "SURFACE AREA",
    "USED GRID",
    "BALANCE GRID",
    "JOINT TYPE",
  ];

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  const handleRefresh = () => {
    setDisable(true);
    setCurrentPage(1);
  };



  const handleExcelDownload = () => {
  const bodyFormData = new URLSearchParams();
  bodyFormData.append("download", "excel");
  bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
  DownloadXlsx({
    apiMethod: "post",
    url: "get-drawing-master-data-excel-download",
    body: bodyFormData,
    fileName: "Drawing_Master_Data",
  });
};

console.log("➡️ Frontend currentPage:", currentPage);
console.log("➡️ Backend returned page:", entity?.pagination?.currentPage);
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
                    <Link to="/user/project-store/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Drawing Items</li>
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
                            <h3>Drawing Items</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                      setDisable(true);
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
                                  className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
                                >
                                  Download Excel{" "}
                                  <i className="fa-solid fa-download mx-2"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
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
                          {paginatedGroups.length === 0 ? (
                            <tr>
                              <td colSpan="16" className="text-center">No Drawing Items Found</td>
                            </tr>
                          ) : (
                            paginatedGroups.map((group, groupIndex) =>
                              group.grids.map((gridGroup, gridIndex) =>
                                gridGroup.rows.map((row, rowIndex) => (
                                  // <tr key={row._id}>
                                    <tr key={row._id} className={!group.isMain ? 'table-row-red' : ''}>


                                    {/* SR (only once per drawing) */}
                                    {gridIndex === 0 && rowIndex === 0 && (
                                      <td
                                        rowSpan={group.grids.reduce(
                                          (acc, g) => acc + g.rows.length,
                                          0
                                        )}
                                      >
                                        {startIndex + groupIndex + 1}
                                      </td>
                                    )}

                                    {/* Drawing No */}
                                    {gridIndex === 0 && rowIndex === 0 && (
                                      <td
                                        rowSpan={group.grids.reduce(
                                          (acc, g) => acc + g.rows.length,
                                          0
                                        )}
                                      >
                                        {group.drawing?.drawing_no}
                                      </td>
                                    )}

                                                                 {/* REV */}

{/* {gridIndex === 0 && rowIndex === 0 && (
  <td rowSpan={group.grids.reduce((acc, g) => acc + g.rows.length, 0)}>
    {group.drawing.rev ?? "-"}
  </td>
)} */}

{gridIndex === 0 && rowIndex === 0 && (
  <td rowSpan={group.grids.reduce((acc, g) => acc + g.rows.length, 0)}>
    {group.drawing.rev ?? "-"}
    {!group.isMain}
  </td>
)}


{/* Assembly No */}
{gridIndex === 0 && rowIndex === 0 && (
  <td
    rowSpan={group.grids.reduce((acc, g) => acc + g.rows.length, 0)}
  >
    {row?.drawing_id?.assembly_no || "-"}
  </td>
)}

                                    {/* Grid No (once per grid) */}
                                    {rowIndex === 0 && (
                                      <td rowSpan={gridGroup.rows.length}>
                                        {gridGroup.grid?.grid_no}
                                      </td>
                                    )}
                                    {rowIndex === 0 && (
                                      <td rowSpan={gridGroup.rows.length}>
                                        {gridGroup.grid?.grid_qty}
                                      </td>
                                    )}



                                    {/* Item details (each row) */}
                                    <td>{row?.item_name?.name }</td>



                                    <td>{row?.item_no ?? "-"}</td>
                                    <td>{row?.item_qty ?? "-"}</td>
                                    <td>{row?.item_length ?? "-"}</td>
                                    <td>{row?.item_width ?? "-"}</td>
                                    <td>{row?.item_weight ?? "-"}</td>
                                    <td>{row?.assembly_weight ?? "-"}</td>
                                    <td>{row?.assembly_surface_area ?? "-"}</td>
                                    <td>{row?.used_grid ?? "-"}</td>
                                    <td>{row?.balance_grid ?? "-"}</td>
                                    <td>
                                      {row?.joint_type
                                        ?.map((j) => j.name)
                                        .join(", ")}
                                    </td>
                                  </tr>
                                ))
                              )
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="col-sm-12 d-flex justify-content-end mt-3">
                      {/* <Pagination
                        total={totalItems}
                        itemsPerPage={limit}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                      /> */}
                    

{/* <Pagination
  total={entity?.pagination?.totalRecords || 0}
  itemsPerPage={limit}
  currentPage={entity?.pagination?.currentPage || 1}
  onPageChange={(page) => setCurrentPage(page)}
/> */}


<Pagination
  total={entity?.pagination?.totalRecords || 0}
  itemsPerPage={limit}
  currentPage={entity?.pagination?.currentPage || 1}
  onPageChange={(page) => setCurrentPage(page)}
/>



                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DrawingDataMaster;




