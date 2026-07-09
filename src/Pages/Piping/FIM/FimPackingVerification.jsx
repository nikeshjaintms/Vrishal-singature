import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Footer from "../Include/Footer";
import FimQcVerificationTable from "../../../Components/Piping/FIMModal/FimQcVerificationTable";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";
import moment from "moment";

const FimPackingVerification = () => {
  const { state } = useLocation(); // comes from FimPackingList
  const navigate = useNavigate();
  const [items, setItems] = useState(state?.items || []);
  // console.log("Packing Verification State:", state?.items);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [qcNotes, setQcNotes] = useState("");

  const handleSubmitVerification = async () => {
    try {
      console.log("Submitting items:", items, state?._id); // debug
      
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("id", state?._id);
      bodyFormData.append("PROJECT",localStorage.getItem("PAY_USER_PROJECT_NAME"));
      bodyFormData.append("qc_name", localStorage.getItem("PAY_USER_NAME")); // Or fetch from logged in user
      bodyFormData.append("qc_by", localStorage.getItem("PAY_USER_ID")); // Or fetch from logged in user
      bodyFormData.append("qc_notes", qcNotes || "");
      bodyFormData.append("items", JSON.stringify(items));

      await axios.post(`${V_URL}/user/verify-fim-packing`, bodyFormData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      toast.success("QC Verification saved successfully!");
      navigate("/piping/user/fim-packing-list");
    } catch (err) {
      console.error(err);
      toast.error("Error saving verification");
    }
  };


  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/fim-packing-list">
                      FIM Packing List
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">FIM Packing Verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Packing Details */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>FIM Packing Details</h4>
                    </div>
                  </div>

                  <div className="row">
                    {[
                      { label: "Package List No / Invoice No", value: state?.package_list_no },
                      { label: "Package List Date", value: moment(state?.packing_date).format("YYYY-MM-DD") },
                      { label: "RGP No/FIM Lot No", value: state?.rgp_no },
                      { label: "Returnable / Non Returnable", value: state?.returnable_type },
                      { label: "Vehicle Number", value: state?.vehicle_number },
                      { label: "Supplier", value: state?.supplier },
                      { label: "Receiving Date", value: moment(state?.receiving_date).format("YYYY-MM-DD") },
                      { label: "Received By", value: state?.received_by?.user_name || "-" },
                    ].map(({ label, value }) => (
                      <div key={label} className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>{label}</label>
                          <input className="form-control" value={value || "-"} readOnly />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <FimQcVerificationTable
            commentsData={items}
            tableData={items}
            setTableData={setItems}
            limit={limit}
            setLimit={setLimit}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalItems={items.length}
          />

          {/* QC Notes + Submit */}
          <div className="row mt-3">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="input-block local-forms">
                      <label>QC Notes</label>
                      <textarea
                        className="form-control"
                        value={qcNotes}
                        onChange={(e) => setQcNotes(e.target.value)}
                        rows="3"
                        placeholder="Enter QC notes (optional)"
                      />
                    </div>
                  </div>

                  <div className="text-end mt-3">
                    <button className="btn btn-success" onClick={handleSubmitVerification}>
                      Submit Verification
                    </button>
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

export default FimPackingVerification;
