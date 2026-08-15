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
import { getIssueAcceptanceMasterDataPiping } from "../../../../Store/Piping/IssueAcceptance/getIssueAcceptanceMasterDataPiping";
const MaterialIssueAcceptanceMasterData = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [disable, setDisable] = useState(true);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(
      getIssueAcceptanceMasterDataPiping({
        project: localStorage.getItem("U_PROJECT_ID"),
        page: currentPage,
        limit,
      })
    );
    setDisable(false);
  }, [dispatch, currentPage, limit]);

//   const entity = useSelector(
//     (state) => state?.getIssueAcceptanceMasterData?.user?.data
//   );

  const entity = useSelector(
  (state) => state?.getIssueAcceptanceMasterDataPiping?.user
);

  console.log("➡️ API DATA:", entity);
  // 🔎 Filter by search on frontend (optional)
// filteredData should use entity.data instead of entity directly
// const filteredData = useMemo(() => {
//   if (!entity?.data) return [];
//   if (!search.trim()) return entity.data;

//   return entity.data.filter((rec) =>
//     rec.issue_req_id?.issue_req_no
//       ?.toLowerCase()
//       .includes(search.toLowerCase())
//   );
// }, [entity, search]);

const filteredData = useMemo(() => {
  if (!entity?.data) return [];
  if (!search.trim()) return entity.data;

  const searchLower = search.toLowerCase();

  return entity.data.filter((rec) => {
    // Check issue_req_no
    const issueReqNo = rec.issue_req_id?.issue_req_no?.toLowerCase() || "";

    // Check issue_accept_no
    const issueAcceptNo = (rec.issue_accept_no || "").toLowerCase();

    // Check items for drawing_no or grid_no
    const matchesItem = rec.items.some((item) => {
      const drawingNo = item?.drawing_id?.drawing_no?.toLowerCase() || "";
      const gridNo = item?.grid_item_id?.grid_id?.grid_no?.toLowerCase() || "";
      return (
        drawingNo.includes(searchLower) ||
        gridNo.includes(searchLower)
      );
    });

    return (
      issueReqNo.includes(searchLower) ||
      issueAcceptNo.includes(searchLower) ||
      matchesItem
    );
  });
}, [entity, search]);


  console.log("filteredData DATA:", filteredData);
  const columnHeaders = [
    "SR.",
    "MATERIAL ISSUE REQUEST NO.",
    "REQUEST DATE",
    "DRAWING NO.",
    "REV NO.",    
    "ITEM NAME",
    "ITEM DESCRIPTION",
    "SIZE 1",
    "THICKNESS 1",
    "SIZE 2",
    "THICKNESS 2",
    "MATERIAL GRADE",
    "UOM",
    "REQUIRED QTY",
    "EXTRA QTY",
    "TOTAL REQUESTED QTY",
    "ISSUED QTY",
    "IMIR NO.",
    "HEAT NO.",
    "ACCEPTANCE REPORT NO.",
    "ISSUED DATE",
    "REQUESTED BY",
    "ACCEPTED BY",
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
        url: "excel-issue-acceptance-piping-download-piping",
        body: bodyFormData,
        fileName: "MATERIAL ISSUED MASTER DATA - PIPING",
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
                    <Link to="/piping/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    Issue Acceptance Master data
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
                            <h3>Issue Acceptance</h3>
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
  {filteredData.length === 0 ? (
    <tr>
      <td colSpan={columnHeaders.length} className="text-center">
        No Issue Acceptance Found
      </td>
    </tr>
  ) : (
    filteredData.flatMap((rec, idx) =>
      rec.items.map((item, rowIndex) => (
        <tr key={item._id}>
          {/* Render these only once per rec (rowIndex === 0) with rowSpan */}
          {rowIndex === 0 && (
            <>
              <td rowSpan={rec.items.length}>
                {(currentPage - 1) * limit + idx + 1}
              </td>
              <td rowSpan={rec.items.length}>{rec?.issue_req_id?.issue_req_no || "-"}</td>
              <td rowSpan={rec.items.length}>
                {/* {rec?.issue_req_id?.createdAt
                  ? new Date(rec.issue_req_id.createdAt).toLocaleDateString()
                  : "-"} */}
                  {
  rec?.issue_req_id?.createdAt
    ? new Date(rec.issue_req_id.createdAt).toLocaleDateString("en-GB")
    : "-"
}
              </td>
            </>
          )}

          {/* These columns vary per item, so render every row */}
          <td>{item?.drawing_id?.drawing_no || "-"}</td>
          <td>{item?.drawing_id?.rev ?? "-"}</td>
          <td>{item?.material_item_id?.item?.item_name || "-"}</td>
          <td>{item?.material_item_id?.item?.item_description || "-"}</td>
         <td>{item?.material_item_id?.item?.size1?.name || "-"}</td>
         <td>{item?.material_item_id?.item?.thickness1?.name || "-"}</td>
          <td>{item?.material_item_id?.item?.size2?.name || "-"}</td>
         <td>{item?.material_item_id?.item?.thickness2?.name || "-"}</td>
         <td>{item?.material_item_id?.item?.material_grade || "-"}</td>
         <td>{item?.material_item_id?.item?.uom?.name || "-"}</td>
          <td>{item?.issued_required_qty || "-"}</td>
          <td>{item?.issued_extra_qty || "-"}</td>
          <td>{item?.issued_total_requested_qty || "-"}</td>
             <td>{item?.iss_used_qty || "-"}</td>
          {/* <td>{item?.iss_balance_qty || "-"}</td> */}
          {/* <td>
            {item?.grid_item_id?.item_qty && item?.grid_item_id?.item_weight
              ? item.grid_item_id.item_qty *
                item.grid_item_id.item_weight *
                (item?.grid_item_id?.grid_id?.grid_qty || 1)
              : "-"}
          </td>
          <td>{item?.multiply_iss_qty || "-"}</td> */}
          <td>
            {Array.isArray(item?.imir_no)
              ? item.imir_no.join(", ")
              : item?.imir_no || "-"}
          </td>
          <td>{Array.isArray(item?.heat_no)
              ? item.heat_no.join(", ")
              : item?.heat_no || "-"}</td>

          {/* Render these only once per rec */}
          {rowIndex === 0 && (
            <>
              <td rowSpan={rec.items.length}>{rec?.issue_accept_no || "-"}</td>
              <td rowSpan={rec.items.length}>
                {/* {rec?.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "-"} */}
                {
  rec?.createdAt
    ? new Date(rec.createdAt).toLocaleDateString("en-GB")
    : "-"
}
              </td>
              <td rowSpan={rec.items.length}>
                {rec?.issue_req_id?.requested_by?.user_name || "-"}
              </td>
              <td rowSpan={rec.items.length}>{rec?.issued_by?.user_name || "-"}</td>
            </>
          )}
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

export default MaterialIssueAcceptanceMasterData;
