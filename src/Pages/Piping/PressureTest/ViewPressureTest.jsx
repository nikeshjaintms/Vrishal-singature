import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Footer from "../Include/Footer";
import { getPressureTestInspectionPiping } from "../../../Store/Piping/MultiPressureTestPiping/getPressureTestInspectionPiping";
import moment from "moment";

const ViewPressureTest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(
      getPressureTestInspectionPiping({
        page:currentPage,
        project_id: localStorage.getItem("U_PROJECT_ID"),
        limit,
      })
    );
  }, [currentPage, limit, dispatch]);

  const pressureTestData = useSelector((state) =>
    state?.getPressureTestInspectionPiping?.user?.data?.find(
      (item) => String(item._id) === String(id)
    )
  );

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  if (!pressureTestData) {
    return (
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content">
            <div className="card">
              <div className="card-body text-center">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
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
                                <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li> 
                                    <li className="breadcrumb-item"><Link to="/piping/user/pressure-test">Pressure Test List</Link></li> 
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li> 
                                    <li className="breadcrumb-item active">View Pressure Test</li>
        </ul>
        </div> 
        </div>
        </div>
        
        
          {/* ===== Basic Details ===== */}
          <div className="card shadow-sm mb-4">
            <div className="card-header text-white">
              <h4>Basic Details</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="fw-bold">Report No.</label>
                  <div className="form-control bg-light">
                    {pressureTestData.report_no}
                  </div>
                </div>
                 <div className="col-md-4">
                  <label className="fw-bold">Precedure No.</label>
                  <div className="form-control bg-light">
                    {pressureTestData.procedure.vendor_doc_no}
                  </div>
                </div>


    <div className="col-md-4">
                  <label className="fw-bold">P&ID Reference No.</label>
                  <div className="form-control bg-light">
                    {pressureTestData.pid_reference_drawing}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-bold">Test Date</label>
                  <div className="form-control bg-light">
                    {moment(pressureTestData.test_date).format("DD-MM-YYYY")}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-bold">Location</label>
                  <div className="form-control bg-light">
                    {pressureTestData.location}
                  </div>
                </div>

                    <div className="col-md-4">
                  <label className="fw-bold">Test Loop No.</label>
                  <div className="form-control bg-light">
                    {pressureTestData.test_loop_no}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Drawing Items ===== */}
          <div className="card shadow-sm mb-4">
            <div className="card-header  text-white">
              <h4>Drawing Items</h4>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-primary">
                  <tr>
                    <th>Sr No.</th>
                    <th>Drawing No</th>
                    <th>Rev</th>
                    <th>Spool No</th>
                    <th>Material</th>
                    <th>Class</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {pressureTestData.items?.map((item, i) => (
                    <tr key={i}>
                        <td>{i +1}</td>
                      <td>{item.drawing?.drawing_no}</td>
                      <td>{item.drawing?.rev}</td>
                      <td>{item.spool?.spool_no}</td>
                      <td>{item.material_specification}</td>
                      <td>{item.piping_class}</td>
                    <td>{item.remarks || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== Test Parameters ===== */}
          <div className="card shadow-sm mb-4">
            <div className="card-header  text-white">
              <h4>Test Parameters</h4>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { label: "Working Pressure", value: pressureTestData.working_pressure },
                   { label: "Working Temperature", value: pressureTestData.working_temperature },
                  { label: "Design Pressure", value: pressureTestData.design_pressure },
                   { label: "Design Temperature", value: pressureTestData.design_temperature },
                  { label: "Test Pressure", value: pressureTestData.test_pressure },
                  { label: "Test Medium", value: pressureTestData.test_medium },
                  { label: "Test Duration", value: pressureTestData.test_duration },
                {
  label: "Start Time",
  value: pressureTestData.start_time
    ? moment(pressureTestData.start_time).format("hh:mm A")
    : "-"
},
{
  label: "Finish Time",
  value: pressureTestData.finish_time
    ? moment(pressureTestData.finish_time).format("hh:mm A")
    : "-"
}


                ].map((field, i) => (
                  <div className="col-md-4" key={i}>
                    <label className="fw-bold">{field.label}</label>
                    <div className="form-control bg-light">
                      {field.value || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Pressure Gauges ===== */}
          <div className="row">
            {pressureTestData.pressure_gauges?.map((gauge, index) => (
              <div className="col-md-6" key={index}>
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-blue text-white">
                    <h4>Pressure Gauge {index + 1}</h4>
                  </div>
                  <div className="card-body">
                    <p><strong>Serial No:</strong> {gauge.serial_number}</p>
                    <p>
                      <strong>Validity:</strong>{" "}
                      {moment(gauge.validity).format("DD-MM-YYYY")}
                    </p>
                    <p><strong>Range:</strong> {gauge.range}</p>

                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                            <th>Sr No.</th>
                          <th>Time</th>
                          <th>Pressure (kg/cm²)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gauge.readings?.map((reading, i) => (
                          <tr key={i}>
                            <td>{i +1}</td>
                            <td>
                              {moment(reading.time).format("HH:mm A")}
                            </td>
                            <td>{reading.pressure}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== Pre-Test Checks ===== */}
          <div className="card shadow-sm mb-4">
            <div className="card-header  text-white">
              <h4>Pre-Test Checks</h4>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Sr no.</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {pressureTestData.pre_test_checks?.map((check, i) => (
                    <tr key={i}>
                        <td>{i +1}</td>
                      <td>{check.description}</td>
                      <td>
                      {check.is_accepted === 1 ? (
  <span className="badge bg-success">Accepted</span>
) : check.is_accepted === 2 ? (
  <span className="badge bg-danger">Rejected</span>
) : check.is_accepted === 3 ? (
  <span className="badge bg-warning text-dark">Not Applicable</span>
) : (
  <span className="badge bg-secondary">Pending</span>
)}
                      </td>
                      <td>{check.qc_remarks || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== Post-Test Checks ===== */}
          <div className="card shadow-sm mb-4">
            <div className="card-header  text-white">
              <h4>Post-Test Checks</h4>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Sr No.</th>
                    <th>Description</th>
                    <th>Status</th>
                     <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {pressureTestData.post_test_checks?.map((check, i) => (
                    <tr key={i}>
                        <td>{i +1}</td>
                      <td>{check.description}</td>
                      <td>
                       {check.is_accepted === 1 ? (
  <span className="badge bg-success">Accepted</span>
) : check.is_accepted === 2 ? (
  <span className="badge bg-danger">Rejected</span>
) : check.is_accepted === 3 ? (
  <span className="badge bg-warning text-dark">Not Applicable</span>
) : (
  <span className="badge bg-secondary">Pending</span>
)}
                      </td>
                       <td>{check.qc_remarks || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        <div className="row">
        <div className="col-sm-12">
            <div className="card card-table w-100">
            <div className="card-body">
                <div className="page-table-header mb-2">
            <h4 className="mb-0">Procedure</h4>
        </div>

        {/* <div className="card-body"> */}
            <div className="d-flex justify-content-between align-items-center flex-wrap">

            {/* Radio Section */}
            <div className="page-table-header mb-2">
                <div className="form-check form-check-inline">
                <input
                    type="radio"
                    className="form-check-input"
                    checked={pressureTestData.isBlastingPainting === true}
                    readOnly
                />
                <label className="form-check-label">
                    Blasting & Painting
                </label>
                </div>

                <div className="form-check form-check-inline">
                <input
                    type="radio"
                    className="form-check-input"
                    checked={pressureTestData.isSiteDispatch === true}
                    readOnly
                />
                <label className="form-check-label">
                    Site Dispatch
                </label>
                </div>
            </div>

            {/* Button Section */}
            <div className="page-table-header mb-2">
                <Link
                to="/piping/user/pressure-test"
                className="btn btn-primary px-4"
                >
                Back to List
                </Link>
            </div>

            {/* </div> */}
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

export default ViewPressureTest;