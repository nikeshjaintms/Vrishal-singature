import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import PageHeader from "../../Multiple/Components/Breadcrumbs/PageHeader";
import { getMultiFitupPiping } from "../../../../Store/Piping/MultiFitupPiping/getMultiFitupPiping";
import { QC } from "../../../../BaseUrl";
import { Link } from "react-router-dom";
const ViewFitupPiping = () => {
  const { id: issueId, type } = useParams(); // type = offer / qc
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportNo, setReportNo] = useState("");
  const [reportNoTwo, setReportNoTwo] = useState("");
  const [tableData, setTableData] = useState([]);
const [isAddedRootDpt, setIsAddedRootDpt] = useState(false);
const [isAddedWeldVisual, setIsAddedWeldVisual] = useState(false);
  const [currentPage1, setCurrentPage1] = useState(1);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (issueId) {
      dispatch(getMultiFitupPiping({ limit:limit1, page: currentPage1, search: search1 }));
    }
  }, [issueId, dispatch]);

  const fitupOfferApiData = useSelector(
    (state) => state?.getMultiFitupPiping?.user?.data?.data,
  );

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
  if (!Array.isArray(fitupOfferApiData) || !fitupOfferApiData.length) {
    setTableData([]);
    setReportNo("");
    setReportNoTwo("");
    setIsAddedRootDpt(false);
    setIsAddedWeldVisual(false);
    return;
  }

  // ✅ ONLY CURRENT OFFER
  const selectedParent = fitupOfferApiData.find(
    (p) => String(p._id) === String(issueId)
  );

  if (!selectedParent) return;

  setReportNo(selectedParent.report_no || "");
  setReportNoTwo(selectedParent.report_no_two || "");
  setIsAddedRootDpt(!!selectedParent.root_dpt);
  setIsAddedWeldVisual(!!selectedParent.weld_visual_offer);

  const normalized = selectedParent.items.map((item) => ({
    ...item,
    fitup_offer_id: selectedParent._id,
    report_no: selectedParent.report_no,
    report_no_two: selectedParent.report_no_two,
  }));

  setTableData(normalized);
}, [fitupOfferApiData, issueId]);


// useEffect(() => {
//   if (!Array.isArray(fitupOfferApiData) || !fitupOfferApiData.length) {
//     setTableData([]);
//     setReportNo("");
//     setReportNoTwo("");
//     setIsAddedRootDpt(false);
//     setIsAddedWeldVisual(false);
//     return;
//   }

//   const parent = fitupOfferApiData[0];
// console.log("parent",parent);
//   setReportNo(parent.report_no || "");
//   setReportNoTwo(parent.report_no_two || "");

//   // 🔥 SET FLAGS HERE
//   setIsAddedRootDpt(!!parent.root_dpt);
//   setIsAddedWeldVisual(!!parent.weld_visual_offer);

//   const normalized = fitupOfferApiData.flatMap((parent) =>
//     parent.items.map((item) => ({
//       ...item,
//       fitup_offer_id: parent._id,
//       report_no: parent.report_no,
//       report_no_two: parent.report_no_two,
//     }))
//   );

//   setTableData(normalized);
// }, [fitupOfferApiData]);


console.log("tableData",tableData);
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
                name: "Fit-Up Offer List",
                link:
                  localStorage.getItem("ERP_ROLE") === QC
                    ? "/piping/user/fitup-clearance-management"
                    : "/piping/user/fitup-management",
                active: false,
              },
              {
                name:
                  localStorage.getItem("ERP_ROLE") === QC
                    ? "View Fit-Up QC"
                    : "View Fit-Up Offer",
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
                              ? "Fit-Up Inspection QC View"
                              : "Fit-Up Inspection Offer View"}
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
                              Fit-Up Offer Report No
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
                                Fit-Up Report No Two
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
                           <th>Piping Material Specification</th>
                          <th>Spool No.</th>
                          <th>Sheet No.</th>
                          <th>Joint No.</th>
                          <th>Item 1</th>
                          <th>IMIR NO. 1</th>
                          <th>Heat No. 1</th>
                          <th>Item 2</th>
                          <th>IMIR NO. 2</th>
                          <th>Heat No. 2</th>
                          <th>Size</th>
                          <th>Thickness</th>
                          <th>Joint Type</th>
                          {localStorage.getItem("ERP_ROLE") === QC && (
                            <th>WPS No.</th>
                          )}
  {localStorage.getItem("ERP_ROLE") === QC && (
                            <th>Root Dpt Required?</th>
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
                            const joint = row.joint_wise_data?.[0];
                            return (
                              <tr key={row._id || i}>
                                <td>{i + 1}</td>
                                <td>{row.drawing_id?.drawing_no || "-"}</td>
                                <td>{row.drawing_id?.rev || "-"}</td>
                                {/* <td>{row.drawing_id?.sheet_no || "-"}</td> */}
                                <td>{row?.drawing_id?.material_specification?.name}</td>
                                <td>{joint?.spool_no_id?.spool_no || "-"}</td>
                                 <td>
                                  {joint?.material_items?.sheet_no || "-"}
                                </td>
                                <td>
                                  {joint?.material_items?.joint_no || "-"}
                                </td>
                                <td>
                                  {joint?.material_items
                                    ?.material_item_details?.[0]?.item
                                    ?.item_name || "-"}
                                </td>
                                <td>{row.imir_no_1 || "-"}</td>
                                <td>{row.heat_no_1 || "-"}</td>
                                <td>
                                  {joint?.material_items
                                    ?.material_item_details?.[1]?.item
                                    ?.item_name || "-"}
                                </td>
                                <td>{row.imir_no_2 || "-"}</td>
                                <td>{row.heat_no_2 || "-"}</td>
                                <td>
                                  {joint?.material_items?.selected_size?.name ||
                                    "-"}
                                </td>
                                <td>
                                  {joint?.material_items?.selected_thickness
                                    ?.name || "-"}
                                </td>
                                <td>
                                  {joint?.material_items?.joint_type?.name ||
                                    "-"}
                                </td>

   
                                {localStorage.getItem("ERP_ROLE") === QC && (
                                  <td>{row.wps_no?.wpsNo || "-"}</td>
                                )}
 {localStorage.getItem("ERP_ROLE") === QC && (
                                 <td>
  {row.root_dpt ? (
    <span className="custom-badge status-green">Yes</span>
  ) : (
    <span className="custom-badge status-pink">No</span>
  )}
</td>
                                )}
                                {localStorage.getItem("ERP_ROLE") === QC && (
                                  <td>{row.qc_remarks || "-"}</td>
                                )}

                                {localStorage.getItem("ERP_ROLE") === QC ? (
                                  <td>
                                    {row.is_accepted ? (
                                      <span className="custom-badge status-green">
                                        Acc
                                      </span>
                                    ) : (
                                      <span className="custom-badge status-pink">
                                        Rej
                                      </span>
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
          
 {/* {localStorage.getItem("ERP_ROLE") === QC ? (
 <div className='row'>
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
            
                <div className="col-12 col-md-4 col-xl-4">
                  <div className="input-block select-gender">
                    <label className="gen-label">
                      Select Procedure <span className="login-danger">*</span>
                    </label>
                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="painting"
                         
                             checked={isAddedRootDpt}
                          className="form-check-input"
                          readOnly
                        />
                        Release for Root Dpt
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="dispatch"
                            checked={isAddedWeldVisual}
                          
                          className="form-check-input"
                          readOnly
                        />
                        Release for Weld visual 
                      </label>
                    </div>

</div>
                </div>
                          
                </div>

                </div>

                </div>

                </div>

                </div>
 ) :(
 ''
 )} */}

            <div className="row">
            <div className="col-sm-12">
              <div className="card card-table w-100">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                      {localStorage.getItem("ERP_ROLE") === QC ? (
                        <Link to="/piping/user/fitup-clearance-management">
                          <button className="btn btn-primary">Back</button>
                        </Link>
                      ) : (
                        <Link to="/piping/user/fitup-management">
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

export default ViewFitupPiping;
