import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";

const ViewMTO = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const data = location.state;
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/material-po/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/material-po/mto-management">MTO List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">View MTO</li>
                </ul>
              </div>
            </div>
          </div>

          {/* View MTO Details */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>Material MTO Details</h4>
                    </div>
                  </div>

                  <div className="row">
                    {[
                      {
                        label: "Purchase Order No",
                        value: data?.poNumber,
                      },
                      {
                        label: "Date",
                        value: moment(data?.date).format("YYYY-MM-DD"),
                      },
                      {
                        label: "Created By",
                        value: data?.created?.user_name || "-",
                      },
                      {
                        label: 'Area',
                        value: data?.areaBuilding?.area || "-",
                      }
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
                      <h4>MTO Item Details</h4>
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
                          <th>GAD Client Qty</th>
                          <th>FAB Drawing Qty</th>
                          <th>Contingency(%)</th>
                          <th>Material Requirement</th>
                          <th>Usable Stock</th>
                          <th>Usable Stock IMIR NO </th>
                          <th>Ordered Qty </th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.items?.map((elem, i) => (
                            <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{elem?.item?.name}</td>
                            <td>{elem?.item?.material_grade}</td>
                            <td>{elem?.item?.unit?.name}</td>
                            <td>{elem?.gadClientQty}</td>
                            <td>{elem?.fabDrawingQty}</td>
                            <td>{elem?.contingency || "-"}</td>
                            <td>{elem?.materialRequirement || "-"}</td>
                            <td>{elem?.usableStock || "-"}</td>
                            <td>{elem?.usableStock}</td>
                            <td>{elem?.orderedQty || "-"}</td>
                            <td>{elem?.remarks || "-"}</td>
                            </tr>
                        ))}
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
  );
};

export default ViewMTO;
