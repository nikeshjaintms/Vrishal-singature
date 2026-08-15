import React from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

const ViewPR = () => {
  const location = useLocation();
  const data = location.state; // should contain full PR object

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/material-po/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/material-po/procurement-request-list">Procurement Request List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">View PR</li>
                </ul>
              </div>
            </div>
          </div>

          {/* View PR Details */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>Procurement Request Details</h4>
                    </div>
                  </div>

                  <div className="row">
                    {[
                      { label: "PR No", value: data?.prNo },
                      { label: "Date", value: moment(data?.date).format("YYYY-MM-DD") },
                    ].map(({ label, value }) => (
                      <div key={label} className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>{label}</label>
                          <input className="form-control" value={value || "-"} readOnly />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Remarks */}
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="input-block local-forms">
                        <label>Remarks</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          readOnly
                          value={data?.remarks || "-"}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Item Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>PR Item Details</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Item</th>
                          <th>Material Grade</th>
                          <th>UOM</th>
                          <th>PR Qty (KG)</th>
                          <th>Section Length / Dimensions</th>
                          <th>Delivery Days Requirement</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.items?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.item?.name || item?.itemName || "-"}</td>
                            <td>{item?.item?.material_grade || item?.material_grade || "-"}</td>
                            <td>{item?.item?.unit?.name || item?.unit || "-"}</td>
                            <td>{item?.prQty || 0}</td>
                            <td>{item?.sectionLengthOrDimensions || "-"}</td>
                            <td>{item?.deliveryDaysRequirement || "-"}</td>
                            <td>{item?.remarks || "-"}</td>
                          </tr>
                        ))}
                        {data?.items?.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center">No items found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-12">
                            <div className="input-block local-forms">
                                <label>Remarks</label>
                                <textarea
                                className="form-control"
                                rows="3"
                                readOnly
                                value={data?.remarks || "-"}
                                ></textarea>
                            </div>
                            <div key="totalQty" className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Total Qty</label>
                          <input className="form-control" value={data.totalQty || "-"} readOnly />
                        </div>
                      </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewPR;
