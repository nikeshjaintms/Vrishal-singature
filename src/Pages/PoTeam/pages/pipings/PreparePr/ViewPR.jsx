import React from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import PO_ROUTE_URLS from "../../../../../Routes/PoTeam/PoRoutes";

const PipingViewPR = () => {
  const location = useLocation();
  const data = location.state; // should contain full PR object
  console.log("data", data);

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
                <li className="breadcrumb-item">
                  <i className="feather-chevron-right"></i>
                </li>
                <li className="breadcrumb-item">
                  <Link to={PO_ROUTE_URLS.PIPING_PR}>Procurement Request List</Link>
                </li>
                <li className="breadcrumb-item">
                  <i className="feather-chevron-right"></i>
                </li>
                <li className="breadcrumb-item active">View PR</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PR Header Details */}
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
                    { label: "Project", value: data?.project?.name },
                    { label: "PR No", value: data?.prNo },
                    { label: "Rev No", value: data?.revNo },
                    {
                      label: "Date",
                      value: data?.date
                        ? moment(data.date).format("DD-MM-YYYY")
                        : "-",
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="col-12 col-md-3 col-xl-3">
                      <div className="input-block local-forms">
                        <label>{label}</label>
                        <input
                          className="form-control"
                          value={value || "-"}
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 col-xl-6">
                    <div className="input-block local-forms">
                      <label>Approved Make</label>
                      <input
                        className="form-control"
                        value={
                          data?.approvedmake?.map((m) => m.name).join(", ") ||
                          "-"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-xl-6">
                    <div className="input-block local-forms">
                      <label>MTC</label>
                      <input
                        className="form-control"
                        value={data?.mtc || "-"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="input-block local-forms">
                      <label>Delivery Location</label>
                      <input
                        className="form-control"
                        value={data?.delivery_location || "-"}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="input-block local-forms">
                      <label>Other Notes</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        readOnly
                        value={
                          data?.other_note?.filter(Boolean).join(", ") || "-"
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="row">
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
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Size 1</th>
                        <th>Thickness 1</th>
                        <th>Size 2</th>
                        <th>Thickness 2</th>
                        <th>Material Grade</th>
                        <th>UOM</th>
                        <th>PR Qty</th>
                        <th>Item Length</th>
                        <th>Delivery Days Requirement</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.items?.length > 0 ? (
                        data.items.map((row, index) => {
                          const itm = row?.item || {};
                          return (
                            <tr key={row?._id || index}>
                              <td>{index + 1}</td>
                              <td>{itm?.item_code || "-"}</td>
                              <td>{itm?.item_name || "-"}</td>
                              <td>{itm?.item_description || "-"}</td>
                              <td>{itm?.size1?.name || "-"}</td>
                              <td>{itm?.thickness1?.name || "-"}</td>
                              <td>{itm?.size2?.name || "-"}</td>
                              <td>{itm?.thickness2?.name || "-"}</td>
                              <td>{itm?.material_grade || "-"}</td>
                              <td>{itm?.uom?.name || "-"}</td>
                              <td>{row?.prQty ?? 0}</td>
                              <td>{row?.itemLenght || "-"}</td>
                              <td>{row?.deliveryDaysRequirement || "-"}</td>
                              <td>{row?.remarks || "-"}</td>
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

        {/* Footer Summary */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-4 col-xl-3">
                    <div className="input-block local-forms">
                      <label>Total Qty</label>
                      <input
                        className="form-control"
                        value={data?.totalQty ?? "-"}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-xl-3">
                    <div className="input-block local-forms">
                      <label>Send Inquiry</label>
                      <input
                        className="form-control"
                        value={data?.sendInquiry ? "Yes" : "No"}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-xl-3">
                    <div className="input-block local-forms">
                      <label>Inquiry Generated</label>
                      <input
                        className="form-control"
                        value={data?.inquiryGenrated ? "Yes" : "No"}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-4 col-xl-3">
                    <div className="input-block local-forms">
                      <label>Prepared By</label>
                      <input
                        className="form-control"
                        value={data?.preparedBy?.email || "-"}
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
  );
};

export default PipingViewPR;
