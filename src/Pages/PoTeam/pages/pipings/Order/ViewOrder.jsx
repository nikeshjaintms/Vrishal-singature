import React from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import PO_ROUTE_URLS from "../../../../../Routes/PoTeam/PoRoutes";

const PipingViewPO = () => {
  const location = useLocation();
  const data = location.state;

  const grandTotal = (
    (data?.total_amount || 0) +
    (data?.total_cgst || 0) +
    (data?.total_sgst || 0) +
    (data?.total_igst || 0)
  ).toFixed(2);

  return (
    <div className="page-wrapper">
      <div className="content">

          {/* Breadcrumb */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
                  <li className="breadcrumb-item">
                    <Link to={PO_ROUTE_URLS.PIPING_ORDER_PLACE}>Order Management</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
                  <li className="breadcrumb-item active">View PO</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PO Details */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h4>Purchase Order Details</h4>

                  <div className="row">
                    {[
                      { label: "PO No", value: data?.po_no },
                      { label: "PO Date", value: moment(data?.po_date).format("YYYY-MM-DD") },
                      { label: "Vendor Name", value: data?.vendor?.name },
                      { label: "Vendor Address", value: data?.vendor?.address },
                      { label: "Email", value: data?.vendor?.email },
                      { label: "Kind Atten", value: data?.kind_atten },
                      { label: "Contact No", value: data?.vendor?.phone },
                      { label: "Buyer", value: data?.buyer },
                      { label: "Reference No", value: data?.ref_no },
                    ].map((f, idx) => (
                      <div key={idx} className="col-md-4 mt-2">
                        <div className="input-block local-forms">
                          <label>{f.label}</label>
                          <input className="form-control" value={f.value || "-"} readOnly />
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
                        />
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
                  <h4>PO Item Details</h4>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sr</th>
                          <th>Item</th>
                          <th>Material Grade</th>
                          <th>Manufacturer</th>
                          <th>UOM</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th>CGST %</th>
                          <th>SGST %</th>
                          <th>IGST %</th>
                          <th>Base Amount</th>
                          <th>Tax Total</th>
                          <th>Total</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data?.items?.length > 0 ? (
                          data.items.map((item, index) => {
                            const base = (item.qty || 0) * (item.rates || 0);
                            const cgst = (item.cgst / 100) * base || 0;
                            const sgst = (item.sgst / 100) * base || 0;
                            const igst = (item.igst / 100) * base || 0;
                            const taxTotal = cgst + sgst + igst;
                            const total = base + taxTotal;

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <div><strong>PO:</strong> {item.item?.name || "-"}</div>
                                  {item.inquiryItem && item.inquiryItem?._id !== item.item?._id && (
                                    <div className="text-muted small">
                                      (Inquiry: {item.inquiryItem?.name})
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div><strong>PO:</strong> {item.item?.material_grade || "-"}</div>
                                  {item.inquiryItem && item.inquiryItem?._id !== item.item?._id && (
                                    <div className="text-muted small">
                                      (Inquiry: {item.inquiryItem?.material_grade})
                                    </div>
                                  )}
                                </td>
                                <td>
                                  {Array.isArray(item.manufacture)
                                    ? item.manufacture.map(m => m.name).join(", ")
                                    : "-"}
                                </td>
                                <td>{item.item?.unit?.name || "-"}</td>
                                <td>{item.qty}</td>
                                <td>{item.rates}</td>
                                <td>{item.cgst}%</td>
                                <td>{item.sgst}%</td>
                                <td>{item.igst}%</td>
                                <td>{base.toFixed(2)}</td>
                                <td>{taxTotal.toFixed(2)}</td>
                                <td>{total.toFixed(2)}</td>
                                <td>{item.remarks || "-"}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="14" className="text-center">
                              No items found
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

          {/* Terms & Totals */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">

                  <div className="row">
                    <div className="col-md-4">
                      <h5>Terms & Conditions</h5>
                      <ul className="ms-3">
                        {data?.terms_and_conditions?.map((t, i) => (
                          <li key={`pre-${i}`}><strong>{t.description || t}</strong></li>
                        ))}
                        {data?.otherTerms?.map((t, i) => (
                          <li key={`manual-${i}`}>{t}</li>
                        ))}
                        {(!data?.terms_and_conditions?.length && !data?.otherTerms?.length) && (
                          <li>No terms available</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="row mt-3">
                    {[
                      { label: "Total Qty", value: data?.total_qty },
                      { label: "Total Base Amount", value: data?.total_amount },
                      { label: "Total CGST", value: data?.total_cgst },
                      { label: "Total SGST", value: data?.total_sgst },
                      { label: "Total IGST", value: data?.total_igst },
                    ].map((t, i) => (
                      <div key={i} className="col-md-4 mt-2">
                        <div className="input-block local-forms">
                          <label>{t.label}</label>
                          <input className="form-control" value={t.value ?? "-"} readOnly />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="row mt-2">
                    <div className="col-md-4">
                      <div className="input-block local-forms">
                        <label>Grand Total</label>
                        <input className="form-control" value={grandTotal} readOnly />
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

export default PipingViewPO;
