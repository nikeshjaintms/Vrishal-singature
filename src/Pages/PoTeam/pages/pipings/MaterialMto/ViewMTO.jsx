import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import PO_ROUTE_URLS from "../../../../../Routes/PoTeam/PoRoutes";

const PipingViewMTO = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const data = location.state;
    console.log("Data", data)
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                {/* Breadcrumb */}
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <i className="feather-chevron-right"></i>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={PO_ROUTE_URLS.PIPING_MTO}>Material Control List</Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <i className="feather-chevron-right"></i>
                                </li>
                                <li className="breadcrumb-item active">View Material Control</li>
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
                                        <h4>Material Control Details</h4>
                                    </div>
                                </div>

                                <div className="row">
                                    {[
                                        {
                                            label: "Project",
                                            value: data?.project_name,
                                        },
                                        {
                                            label: "MTO No.",
                                            value: data?.mto_no,
                                        },
                                        {
                                            label: "Date",
                                            value: moment(data?.date).format("DD MMM YYYY"),
                                        },
                                        {
                                            label: "Prepared By",
                                            value: data?.pr_by || "-",
                                        },
                                        {
                                            label: "Area / Location",
                                            value: data?.area_unit || "-",
                                        },
                                        {
                                            label: "Chart Type",
                                            value: data?.material_control_chart || "-",
                                        }
                                    ].map(({ label, value }) => (
                                        <div key={label} className="col-12 col-md-4 col-xl-4">
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
                        <div className="card card-table show-entire">
                            <div className="card-body">
                                <div className="col-12">
                                    <div className="form-heading">
                                        <h4>Material Control Item Details</h4>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped custom-table comman-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Sr.</th>
                                                <th>Item Name</th>
                                                <th>Description</th>
                                                <th>Size</th>
                                                <th>Thk / Sch</th>
                                                <th>Material Grade</th>
                                                <th>UOM</th>
                                                <th>Drawing No.</th>
                                                <th>Drawing Qty</th>
                                                <th>Total ISO Qty</th>
                                                <th>Contingency (%)</th>
                                                <th>Available Qty</th>
                                                <th>Order Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.material_control_chart === "Client-MTO-Basis" ? (
                                                (data?.clientmtobasisitems || []).length > 0 ? (
                                                    (data?.clientmtobasisitems).map((item, i) => (
                                                        <tr key={`client-${i}`}>
                                                            <td>{i + 1}</td>
                                                            <td>{item?.item_id?.item_name || "-"}</td>
                                                            <td>{item?.item_id?.item_description || "-"}</td>
                                                            <td>
                                                                {item?.item_id?.size1?.name || "-"}
                                                                {item?.item_id?.size2?.name ? ` x ${item?.item_id?.size2?.name}` : ""}
                                                            </td>
                                                            <td>
                                                                {item?.item_id?.thickness1?.name || "-"}
                                                                {item?.item_id?.thickness2?.name ? ` x ${item?.item_id?.thickness2?.name}` : ""}
                                                            </td>
                                                            <td>{item?.item_id?.material_grade || "-"}</td>
                                                            <td>{item?.item_id?.uom?.name || "-"}</td>
                                                            <td>-</td>
                                                            <td>{item?.client_mto_qty || item?.ClientMtoQty || 0}</td>
                                                            <td>{item?.mto_with_contingency || item?.MTOwithContinegancy || 0}</td>
                                                            <td>{item?.contingency || item?.continegancy || 0}</td>
                                                            <td>{item?.existing_available_qty || item?.ExistingAvailableQty || 0}</td>
                                                            <td>{item?.order_qty || item?.OrderQty || 0}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="13" className="text-center">No items found</td>
                                                    </tr>
                                                )
                                            ) : (data?.lineno_drawingno || []).length > 0 ? (
                                                (data?.lineno_drawingno).map((line, i) => {
                                                    const drawings = line.drawings || [];
                                                    const rowSpan = drawings.length > 0 ? drawings.length : 1;
                                                    
                                                    if (drawings.length === 0) {
                                                        return (
                                                            <tr key={`line-${i}`}>
                                                                <td>{i + 1}</td>
                                                                <td colSpan="12" className="text-center">No drawing details available for this item</td>
                                                            </tr>
                                                        );
                                                    }

                                                    return drawings.map((draw, j) => (
                                                        <tr key={`line-${i}-draw-${j}`}>
                                                            {j === 0 && <td rowSpan={rowSpan}>{i + 1}</td>}
                                                            <td>{draw?.item_id?.item_name || "-"}</td>
                                                            <td>{draw?.item_id?.item_description || "-"}</td>
                                                            <td>
                                                                {draw?.item_id?.size1?.name || "-"}
                                                                {draw?.item_id?.size2?.name ? ` x ${draw?.item_id?.size2?.name}` : ""}
                                                            </td>
                                                            <td>
                                                                {draw?.item_id?.thickness1?.name || "-"}
                                                                {draw?.item_id?.thickness2?.name ? ` x ${draw?.item_id?.thickness2?.name}` : ""}
                                                            </td>
                                                            <td>{draw?.item_id?.material_grade || "-"}</td>
                                                            <td>{draw?.item_id?.uom?.name || "-"}</td>
                                                            <td>{draw?.drawing_id?.drawing_no || "-"} (Rev: {draw?.drawing_id?.rev || "0"})</td>
                                                            <td>{draw?.qty || 0}</td>
                                                            {j === 0 && <td rowSpan={rowSpan}>{line.iso_drawing_qty || 0}</td>}
                                                            {j === 0 && <td rowSpan={rowSpan}>{line.contingency || 0}</td>}
                                                            {j === 0 && <td rowSpan={rowSpan}>{line.existing_available_qty || 0}</td>}
                                                            {j === 0 && <td rowSpan={rowSpan}>{line.order_qty || 0}</td>}
                                                        </tr>
                                                    ));
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="13" className="text-center">No items found</td>
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
    );
};

export default PipingViewMTO;
