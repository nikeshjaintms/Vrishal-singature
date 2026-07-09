import React, { useEffect, useMemo, useState } from "react";
import Footer from "../../Include/Footer";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Include/Loader";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import { DownloadXlsx } from "../../../Store/Components/DownloadXlsx";
import { getIssueAcceptanceMasterData } from "../../../../Store/MutipleDrawing/MaterialIssueAcceptanceMasterData/getIssueAcceptanceMasterData";
import { getIssueReturnAcceptanceSummary } from "../../../../Store/Erp/IssueReturnAcceptance/getIssueReturnAcceptanceSummary";
const MaterialIssueReturnSummary = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(
      getIssueReturnAcceptanceSummary({
        project: localStorage.getItem("U_PROJECT_ID"),
        page: currentPage,
        limit,
        search
      })
    );
    setDisable(false);
  }, [dispatch, currentPage, limit,search]);

//   const entity = useSelector(
//     (state) => state?.getIssueReturnAcceptanceSummary?.user?.data
//   );

  const entity = useSelector(
  (state) => state?.getIssueReturnAcceptanceSummary?.user
);

  console.log(" API DATA:", entity);
 

const filteredData = useMemo(() => {
  if (!entity?.data) return [];

  if (!search.trim()) return entity.data;

  const searchLower = search.toLowerCase();

  return entity.data.filter((rec) => {
    const reportMatch =
      rec.report_no?.toLowerCase().includes(searchLower);

    const userMatch =
      rec.return_by?.toLowerCase().includes(searchLower) ||
      rec.received_by?.toLowerCase().includes(searchLower);

    const itemMatch = rec.items?.some(
      (item) =>
        item.section_details?.toLowerCase().includes(searchLower) ||
        item.material_grade?.toLowerCase().includes(searchLower) ||
        item.return_imir_no?.toLowerCase().includes(searchLower) ||
        item.scrap_imir_no?.toLowerCase().includes(searchLower)
    );

    return reportMatch || userMatch || itemMatch;
  });
}, [entity, search]);


  console.log("filteredData DATA:", filteredData);
  const columnHeaders = [
    "SR.",
    "REPORT NO",
    "SECTION DETAILS",
    "MATERIAL GRADE",
    "UOM", 
    "RETURN BY",
    "RETURN DATE",
    "RECEIVED BY",
    "RECEIVED DATE",
    "RETURN RECEIVED QTY",
    "RETURN IMIR NO",
    "RETURN HEAT NUMBER",
    "SCRAP RECEIVED QTY",
    "SCRAP IMIR NO",
    "SCRAP HEAT NO"
  ];

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  const handleRefresh = () => {
    setCurrentPage(1);
    setDisable(true);
  };


    const handleExcelDownload = () => {
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("download", "excel");
      bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
      DownloadXlsx({
        apiMethod: "post",
        url: "excel-issue-return-acceptance-download",
        body: bodyFormData,
        fileName: "MATERIAL ISSUED RETURN MASTER DATA - STRUCTURAL",
      });
    }
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
                  <li className="breadcrumb-item active">
                    Issue Return Acceptance Summary
                  </li>
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
                            <h3>Issue Acceptance Summary</h3>
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
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
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
                            {columnHeaders.map((header, idx) => (
                              <th key={idx}>{header}</th>
                            ))}
                          </tr>
                        </thead>
<tbody>
  {!filteredData?.length ? (
    <tr>
      <td colSpan={columnHeaders.length} className="text-center">
        No Data Found
      </td>
    </tr>
  ) : (
    filteredData.flatMap((rec, idx) =>
      rec.items.map((item, rowIndex) => (
        <tr key={`${idx}-${rowIndex}`}>
          {rowIndex === 0 && (
            <>
              <td rowSpan={rec.items.length}>
                {(currentPage - 1) * limit + idx + 1}
              </td>

              <td rowSpan={rec.items.length}>
                {rec.report_no || "-"}
              </td>
            </>
          )}

          {/* Item-wise columns */}
          <td>{item.section_details || "-"}</td>
          <td>{item.material_grade || "-"}</td>
          <td>{item.uom || "-"}</td>

          {/* Report-wise columns */}
          {rowIndex === 0 && (
            <>
              <td rowSpan={rec.items.length}>
                {rec.return_by || "-"}
              </td>

              <td rowSpan={rec.items.length}>
                {rec.return_date
                  ? new Date(rec.return_date).toLocaleDateString("en-GB")
                  : "-"}
              </td>

              <td rowSpan={rec.items.length}>
                {rec.received_by || "-"}
              </td>

              <td rowSpan={rec.items.length}>
                {rec.received_date
                  ? new Date(rec.received_date).toLocaleDateString("en-GB")
                  : "-"}
              </td>
            </>
          )}

          <td>{item.return_received_qty ?? "-"}</td>
          <td>{item.return_imir_no || "-"}</td>
          <td>{item.return_heat_no || "-"}</td>
          <td>{item.scrap_received_qty ?? "-"}</td>
          <td>{item.scrap_imir_no || "-"}</td>
          <td>{item.scrap_heat_no || "-"}</td>
        </tr>
      ))
    )
  )}
</tbody>


                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="col-sm-12 d-flex justify-content-end mt-3">
                      {/* <Pagination
                        total={entity?.pagination?.total || 0}
                        itemsPerPage={limit}
                        currentPage={entity?.pagination?.page || 1}
                        onPageChange={(page) => setCurrentPage(page)}
                      /> */}

                      <Pagination
  total={entity?.pagination?.total || 0}
  itemsPerPage={limit}
  currentPage={entity?.pagination?.page || 1}
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

export default MaterialIssueReturnSummary;
