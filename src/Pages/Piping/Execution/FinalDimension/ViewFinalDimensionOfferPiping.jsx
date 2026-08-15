import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import PageHeader from "../../Multiple/Components/Breadcrumbs/PageHeader";
import {getMultiFdPiping} from '../../../../Store/Piping/MultiFdPiping/getMultiFdPiping';
import { QC } from "../../../../BaseUrl";
import { Link } from "react-router-dom";
const ViewFinalDimensionPiping = () => {
  const { id: issueId, type } = useParams(); // type = offer / qc
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportNo, setReportNo] = useState("");
  const [reportNoTwo, setReportNoTwo] = useState("");
  const [tableData, setTableData] = useState([]);
const [isHydroTesting, setIsHydroTesting] = useState(false);
const [isBlastingPainting, setIsBlastingPainting] = useState(false);
const [isSiteDispatch, setIsSiteDispatch] = useState(false);

 const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (issueId) {
      dispatch(getMultiFdPiping({ status: '', page: currentPage, limit,search }));
      
    }
  }, [issueId, dispatch]);

  const fdOfferApiData = useSelector(
    (state) => state?.getMultiFdPiping?.user?.data,
  );

console.log("fdOfferApiData",fdOfferApiData);
useEffect(() => {
  if (!Array.isArray(fdOfferApiData) || !fdOfferApiData.length) {
    setTableData([]);
    setReportNo("");
    setReportNoTwo("");
    setIsSiteDispatch(false);
    setIsBlastingPainting(false);
    setIsHydroTesting(false);

    return;
  }

  // ✅ ONLY CURRENT OFFER
  const selectedParent = fdOfferApiData.find(
    (p) => String(p._id) === String(issueId)
  );

  if (!selectedParent) return;

  setReportNo(selectedParent.report_no || "");
  setReportNoTwo(selectedParent.report_no_two || "");
  setIsSiteDispatch(!!selectedParent.isSiteDispatch);
  setIsBlastingPainting(!!selectedParent.isBlastingPainting);
  setIsHydroTesting(!!selectedParent.isHydroTesting);


  const normalized = selectedParent.items.map((item) => ({
    ...item,
    weld_visual_offer_id: selectedParent._id,
    report_no: selectedParent.report_no,
    report_no_two: selectedParent.report_no_two,
  }));

  setTableData(normalized);
}, [fdOfferApiData, issueId]);


console.log("tableData WELD VISUAL",tableData);
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
                name: "Final Dimension Offer List",
                link:
                  localStorage.getItem("ERP_ROLE") === QC
                    ? "/piping/user/final-dimension-clearance-management"
                    : "/piping/user/final-dimension-offer-management",
                active: false,
              },
              {
                name:
                  localStorage.getItem("ERP_ROLE") === QC
                    ? "View Final Dimension QC"
                    : "View Final Dimension Offer",
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
                              ? "Final Dimension Inspection QC View"
                              : "Final Dimension Inspection Offer View"}
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
                             Final Dimension Offer Report No
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
                                 Final Dimension Report No Two
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
                          {/* <th>Sheet No.</th> */}
                           <th>Piping Material Specification</th>
                          <th>Spool No.</th>
                          <th>Required Dimension</th>
                        
                           {localStorage.getItem("ERP_ROLE") === QC && (
                              <th>Actual Dimension</th>
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
    tableData.map((row, i) => (
      <tr key={row._id || i}>
        <td>{i + 1}</td>
        <td>{row.drawing_no || "-"}</td>
        <td>{row.rev || "-"}</td>
        {/* <td>{row.sheet_no || "-"}</td> */}
        <td>{row.material_specification || "-"}</td>
        <td>{row.spool_no || "-"}</td>
        <td>{row.required_dimension || "-"}</td>
      
         {localStorage.getItem("ERP_ROLE") === QC && (
            <td>{row.actual_dimension || "-"}</td>
        )}

        {localStorage.getItem("ERP_ROLE") === QC && (
          <td>{row.qc_remarks || "-"}</td>
        )}

        {localStorage.getItem("ERP_ROLE") === QC && (
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
        )}

        <td>{row.remarks || "-"}</td>
      </tr>
    ))
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
                         
                             checked={isHydroTesting}
                          className="form-check-input"
                          readOnly
                        />
                        Release for Hydro Testing
                      </label>
                    </div>

                    <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="dispatch"
                            checked={isBlastingPainting}
                          
                          className="form-check-input"
                          readOnly
                        />
                        Release for Blasting & Painting
                      </label>
                    </div>

                       <div className="form-check">
                      <label className="form-check-label">
                        <input
                          type="radio"
                          name="procedure"
                          value="dispatch"
                            checked={isSiteDispatch}
                          
                          className="form-check-input"
                          readOnly
                        />
                        Release for Site & Dispatch
                      </label>
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
                        <Link to="/piping/user/final-dimension-clearance-management">
                          <button className="btn btn-primary">Back</button>
                        </Link>
                      ) : (
                        <Link to="/piping/user/final-dimension-offer-management">
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

export default ViewFinalDimensionPiping;
