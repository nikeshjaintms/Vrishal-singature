import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import PageHeader from "../../Multiple/Components/Breadcrumbs/PageHeader";
import { getMultiDptPiping } from '../../../../Store/Piping/RootDpt/getMultiDptPiping';
import { QC } from "../../../../BaseUrl";
import { Link } from "react-router-dom";
const ViewRootDptPiping = () => {
  const { id: issueId, type } = useParams(); // type = offer / qc
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportNo, setReportNo] = useState("");
  const [reportNoTwo, setReportNoTwo] = useState("");
  const [tableData, setTableData] = useState([]);
const [isAddedRootDpt, setIsAddedRootDpt] = useState(false);
const [isAddedWeldVisual, setIsAddedWeldVisual] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (issueId) {
       dispatch(getMultiDptPiping({ page: currentPage,
        limit,
        search,
        }))
    }
  }, [issueId, dispatch]);

  const rootDptOfferApiData = useSelector(
    (state) => state?.getMultiDptPiping?.user?.data,
  );
console.log("rootDptOfferApiData",rootDptOfferApiData);
//   useEffect(() => {
//     if (!Array.isArray(fitupOfferApiData) || !fitupOfferApiData.length) {
//       setTableData([]);
//       setReportNo("");
//       setReportNoTwo("");
//       setIsAddedRootDpt(false);
//     setIsAddedWeldVisual(false);
//       return;
//     }

//     setReportNo(fitupOfferApiData[0].report_no || "");
//     setReportNoTwo(fitupOfferApiData[0].report_no_two || "");
// setIsAddedRootDpt(!!parent.is_added_root_dpt);
//   setIsAddedWeldVisual(!!parent.is_added_weld_visual);
//     const normalized = fitupOfferApiData.flatMap((parent) =>
//       parent.items.map((item) => ({
//         ...item,
//         fitup_offer_id: parent._id,
//         report_no: parent.report_no,
//         report_no_two: parent.report_no_two,
//       })),
//     );

//     setTableData(normalized);
//   }, [fitupOfferApiData]);

useEffect(() => {
  if (!Array.isArray(rootDptOfferApiData) || !rootDptOfferApiData.length) {
    setTableData([]);
    setReportNo("");
    setReportNoTwo("");
    setIsAddedRootDpt(false);
    setIsAddedWeldVisual(false);
    return;
  }

  // ✅ ONLY CURRENT OFFER
  const selectedParent = rootDptOfferApiData.find(
    (p) => String(p._id) === String(issueId)
  );

  if (!selectedParent) return;

  setReportNo(selectedParent.report_no || "");
  setReportNoTwo(selectedParent.report_no_two || "");
  setIsAddedRootDpt(!!selectedParent.root_dpt);
  setIsAddedWeldVisual(!!selectedParent.weld_visual_offer);

  const normalized = selectedParent.items.map((item) => ({
    ...item,
    root_dpt_offer_id: selectedParent._id,
    report_no: selectedParent.report_no,
    report_no_two: selectedParent.report_no_two,
  }));

  setTableData(normalized);
}, [rootDptOfferApiData, issueId]);





console.log("tableData=======>",tableData);
  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              {
                name: "Dashboard",
                link: "/piping/user/dashboard",
                active: false,
              },
              {
                name: "Root DPT Offer List",
                link:
                  localStorage.getItem("ERP_ROLE") === QC
                    ? "/piping/user/dpt-clearance-management"
                    : "/piping/user/dpt-management",
                active: false,
              },
              {
                name:
                  localStorage.getItem("ERP_ROLE") === QC
                    ? "View Root DPT QC"
                    : "View Root DPT Offer",
                active: true,
              },
            ]}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>
                            {localStorage.getItem("ERP_ROLE") === QC
                              ? "Root DPT Inspection QC View"
                              : "Root DPT Inspection Offer View"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="ps-3 pb-3 pt-3 pe-3">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label">
                              Root DPT Offer Report No
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={reportNo}
                              readOnly
                            />
                          </div>

                          {localStorage.getItem("ERP_ROLE") === QC && (
                            <div className="col-md-6">
                              <label className="form-label">
                                Root DPT Report No Two
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                value={reportNoTwo}
                                readOnly
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                   <div className="row align-items-center">
                    <div className="col">
                      <div className="ps-3 pb-3 pt-3 pe-3">
                       <div className="row">
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No.</th>
                          <th>Rev No.</th>
                          <th>Sheet No.</th>
                          <th>Spool No.</th>
                          <th>Joint No.</th>
                          <th>Size</th>
                          <th>Thickness</th>
                          <th>Joint Type</th>
                          <th>Welder No</th>
                          {localStorage.getItem("ERP_ROLE") === QC && (
                            <th>Observation</th>
                          )}
                           
                          {localStorage.getItem("ERP_ROLE") === QC && (
                            <th>QC Remarks</th>
                          )}
                          {localStorage.getItem("ERP_ROLE") === QC && (
                            <th>Status</th>
                          )}
                          <th> Remarks</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tableData.length > 0 ? (
                          tableData.map((row, i) => {
                            const joint = row.jointDetails?.[0];
                            return (
                              <tr key={row._id || i}>
                                <td>{i + 1}</td>
                                <td>{joint?.drawing_no || "-"}</td>
                                <td>{joint?.rev || "-"}</td>
                                <td>{joint?.sheet_no || "-"}</td>
                                <td>{joint?.spool_no || "-"}</td>
                                <td>
                                  {joint?.joint_no || "-"}
                                </td>
                        
                               
                                <td>
                                  {joint?.selected_size?.size_name ||
                                    "-"}
                                </td>
                                <td>
                                  {joint?.selected_thickness
                                    ?.thickness || "-"}
                                </td>
                                <td>
                                  {joint?.joint_type?.name ||
                                    "-"}
                                </td>
                                <td>{joint?.welder_no || "-"}</td>

                                {localStorage.getItem("ERP_ROLE") === QC && (
                                  <td>{row.observation || "-"}</td>
                                )}
                                
                                {localStorage.getItem("ERP_ROLE") === QC && (
                                  <td>{row.qc_remarks || "-"}</td>
                                )}

                                {localStorage.getItem("ERP_ROLE") === QC ? (
                                  <td>
  {row.is_accepted === "Acc" ? (
    <span className="custom-badge status-green">Acc</span>
  ) : row.is_accepted === "Rej" ? (
    <span className="custom-badge status-pink">Rej</span>
  ) : row.is_accepted === "NA" ? (
    <span className="custom-badge status-grey">NA</span>
  ) : (
    <span className="custom-badge status-default">-</span>
  )}
</td>

                                ) : (
                                  <td>{row.remarks || "-"}</td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={
                                localStorage.getItem("ERP_ROLE") === QC
                                  ? "15"
                                  : "14"
                              }
                              className="text-center"
                            >
                              No Data Found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
</div>
                  </div>
                </div>
              </div>
                
                </div>
              </div>
            </div>
          </div>
          


            <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                      {localStorage.getItem("ERP_ROLE") === QC ? (
                        <Link to="/piping/user/dpt-clearance-management">
                          <button className="btn btn-primary">Back</button>
                        </Link>
                      ) : (
                        <Link to="/piping/user/dpt-management">
                          <button className="btn btn-primary">Back</button>
                        </Link>
                      )}
                    </div>
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

export default ViewRootDptPiping;
