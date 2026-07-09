import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../Users/Include/Loader';
import { Pagination } from '../../../Users/Table';
import DropDown from '../../../../Components/DropDown';
import { getAllMaterialChart } from '../../../../Store/PoTeam/MaterialChart/MaterialChart';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';


// Debounce hook
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const MaterialChart = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const materialChart = useSelector((state) => state.getMaterialChart?.list);
  const loading = useSelector((state) => state.getMaterialChart?.loading || false);

   const fetchMaterialChart = () => {
    dispatch(
      getAllMaterialChart({
        projectId: localStorage.getItem('U_PROJECT_ID'),
        search: debouncedSearch,
        page: currentPage,
        limit,
      })
    );
  };

  useEffect(() => {
    fetchMaterialChart();
  }, [currentPage, limit, debouncedSearch]);

  // ================= GROUP LIKE DPR =================
  const groupedData = useMemo(() => {
    const grouped = {};
    materialChart?.data?.forEach((item) => {
      const key = item.area || 'N/A';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return grouped;
  }, [materialChart]);


  const handleDownloadExcel = async () => {
      try {
        const token = localStorage.getItem("PAY_USER_TOKEN");
        const projectId = localStorage.getItem("U_PROJECT_ID");

        if (!projectId) {
          return toast.error("Project ID not found");
        }

        const response = await axios.post(
          `${V_URL}/user/material-chart-excel`, // Updated endpoint
          { 
            projectId, 
            search: debouncedSearch // Sends current search filters to the excel
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob", // Critical for binary files
          }
        );

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        // Filename handling
        const timestamp = new Date().getTime();
        let fileName = `Material_Chart_${timestamp}.xlsx`;
        const disposition = response.headers["content-disposition"];
        if (disposition && disposition.includes("filename=")) {
          fileName = disposition.split("filename=")[1].replace(/"/g, "");
        }

        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Excel downloaded successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to download Excel");
      }
    };
  

    // ---------------- Refresh ----------------
  const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1);
    setLimit(10);
    fetchMaterialChart();
  };


  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Material Chart</li>
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
                    {/* HEADER */}
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Material Chart</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={search}
                                    onChange={(e) => {
                                      setSearch(e.target.value);
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
                                  className="btn btn-primary doctor-refresh ms-2"
                                  onClick={handleRefresh}
                                >
                                  <img
                                    src="/assets/img/icons/re-fresh.svg"
                                    alt="refresh"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <div className="add-group">
                            <button
                              className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
                              type="button"
                              onClick={handleDownloadExcel}
                            >
                              Download Material Chart{" "}
                              <i className="fa-solid fa-download mx-2"></i>
                            </button>
                          </div>
                          <DropDown limit={limit} onLimitChange={setLimit} />
                        </div>
                      </div>
                    </div>

                    {/* TABLE */}
                    <div
                      className="table-responsive"
                      style={{ overflowX: "auto" }}
                    >
                      <table
                        className="table border-0 comman-table mb-0"
                        style={{ minWidth: "1200px" }}
                      >
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Area</th>
                            <th>Item Name</th>
                            <th>Material Grade</th>
                            <th>UOM</th>
                            <th>GAD Qty</th>
                            <th>Fabrication Qty</th>
                            <th>Contingency</th>
                            <th>Material Requirement</th>
                            <th>Usable Stock</th>
                            <th>PO Item Name</th>
                            <th>Ordered Qty</th>
                            <th>PR No</th>
                            <th>PR Rev</th>
                            <th>PO No</th>
                            <th>PO Rev</th>
                            <th>Material Recevied</th>
                            <th>Balance Qty</th>
                          </tr>
                        </thead>

                        <tbody>
                          {Object.keys(groupedData).length === 0 ? (
                            <tr>
                              <td colSpan="16" className="text-center">
                                No Data Found
                              </td>
                            </tr>
                          ) : (
                            Object.entries(groupedData).map(
                              ([area, rows], areaIndex) =>
                                rows.map((row, rowIndex) => (
                                  <tr key={`${areaIndex}-${rowIndex}`}>
                                    {/* SR NO */}
                                    {rowIndex === 0 && (
                                      <td rowSpan={rows.length}>
                                        {(currentPage - 1) * limit +
                                          areaIndex +
                                          1}
                                      </td>
                                    )}

                                    {/* AREA */}
                                    {rowIndex === 0 && (
                                      <td rowSpan={rows.length}>{area}</td>
                                    )}

                                    <td>{row.item_name}</td>
                                    <td>{row.material_grade}</td>
                                    <td>{row.uom}</td>
                                    <td>{row.gadClientQty}</td>
                                    <td>{row.fabDrawingQty}</td>
                                    <td>{row.contingency}</td>
                                    <td>{row.materialRequirement}</td>
                                    <td>{row.usableStock}</td>
                                    <td>{row.poItemName || "-"}</td>
                                    <td>{row.orderedQty}</td>
                                    <td>{row.prNo || "-"}</td>
                                    <td>{row.prRevNo || "-"}</td>
                                    <td>{row.poNo || "-"}</td>
                                    <td>{row.poRevNo || "-"}</td>
                                    <td>{row.materialReceived || "-"}</td>
                                    <td>{row.balanceQty || "-"}</td>
                                  </tr>
                                )),
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="row mt-3">
                      <div className="col-md-6">
                        Showing {materialChart?.data?.length || 0} of{" "}
                        {materialChart?.total || 0}
                      </div>
                      <div className="col-md-6">
                        <Pagination
                          total={materialChart?.total || 0}
                          itemsPerPage={limit}
                          currentPage={currentPage}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialChart;
