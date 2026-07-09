import React from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

const ViewInquiry = () => {
  const { state: data } = useLocation(); // inquiry data passed through navigate()

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">

          {/* Breadcrumb */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right" />
              </li>
              <li className="breadcrumb-item">
                <Link to="/material-po/inquiry-management">Inquiry Management</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right" />
              </li>
              <li className="breadcrumb-item active">View Inquiry</li>
            </ul>
          </div>

          {/* Inquiry Details */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">

                  <h4 className="form-heading">Inquiry Details</h4>

                  <div className="row">
                    {[
                      { label: "Inquiry No", value: data?.InquiryNo },
                      {
                        label: "Inquiry Date",
                        value: moment(data?.InquiryDate).format("YYYY-MM-DD")
                      }
                    ].map((f, i) => (
                      <div key={i} className="col-md-4 mt-2">
                        <div className="input-block local-forms">
                          <label>{f.label}</label>
                          <input className="form-control" value={f.value || "-"} readOnly />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Remarks */}
                  {/* <div className="row mt-3">
                    <div className="col-12">
                      <div className="input-block local-forms">
                        <label>Remarks</label>
                        <textarea
                          className="form-control"
                          readOnly
                          rows={3}
                          value={data?.remarks || "-"}
                        />
                      </div>
                    </div>
                  </div> */}

                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Items Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">

                  <h4 className="form-heading">Inquiry Item Details</h4>

                  <div className="table-responsive">
                    <table className="table table-bordered custom-table">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th>Item</th>
                          <th>Material Grade</th>
                          <th>Required Size</th>
                          <th>UOM</th>
                          <th>Party</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Delivery Days</th>
                          <th>Offer Size</th>
                          <th>Offer Make</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(data?.items || []).map((it, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{it.item?.name || it.item || "-"}</td>
                            <td>{it.item?.material_grade}</td>
                            <td>{it?.requiredSize || "-"}</td>
                            <td>{it.item?.unit?.name || "-"}</td>
                            <td>
                              {Array.isArray(it.manufacture)
                              ? it.manufacture.map(m => m.name).join(", ")
                              : typeof it.manufacture === "object"
                                ? it.manufacture?.name
                                : it.manufacture || "-"}
                            </td>
                            <td>{it.qty}</td>
                            <td>{it.rates}</td>
                            <td>{it.amount}</td>
                            <td>{it.delivery_days}</td>
                            <td>{it.offer_size}</td>
                            <td>{it.Offer_make}</td>
                            <td>{it.remarks || "-"}</td>
                          </tr>
                        ))}

                        {(!data?.items || data?.items.length === 0) && (
                          <tr>
                            <td colSpan="13" className="text-center">No Items Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Terms & Totals Section */}
         <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">

                  {/* Terms & Conditions */}
                  <h4 className="form-heading mb-3">Terms & Conditions</h4>

                  <div className="row">
                    <div className="col-md-12">
                      {/* Predefined Terms */}
                      {(data?.terms_and_conditions?.length > 0 || data?.terms_conditions?.length > 0) ? (
                        <ul className="ms-3">
                          {data?.terms_and_conditions?.map((t, i) => (
                            <li key={`pre-${i}`}><strong>{t.description || t}</strong></li>
                          ))}
                          {data?.terms_conditions?.map((t, i) => (
                            <li key={`manual-${i}`}>{t}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="ms-3">No Terms & Conditions found.</p>
                      )}
                    </div>
                  </div>

                  <hr />

                  {/* Totals */}
                  <h4 className="form-heading mt-3">Totals</h4>

                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <div className="input-block local-forms">
                        <label>Total Quantity</label>
                        <input
                          className="form-control"
                          value={data?.total_qty ?? "-"}
                          readOnly
                        />
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

export default ViewInquiry;
