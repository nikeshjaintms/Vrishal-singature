import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMultipleIssueRequestPiping } from '../../../../Store/Piping/IssueRequest/getMultipleIssueRequestPiping';
import { getPipingStockReportList } from "../../../../Store/Piping/Stock/getPipingStockReportList";
import { getIssueAcceptancePiping } from "../../../../Store/Piping/IssueAcceptance/getIssueAcceptancePiping";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import PageHeader from "../Components/Breadcrumbs/PageHeader";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import { Check, Save, X } from "lucide-react";
import { Search } from "../../Table";
import toast from "react-hot-toast";
import { V_URL } from "../../../../BaseUrl";
import axios from "axios";
import SubmitButton from "../Components/SubmitButton/SubmitButton";
import Swal from "sweetalert2";
import { MultiSelect } from "primereact/multiselect";

const ViewMultiIssueAcc = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [disable, setDisable] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [acc, setAcc] = useState({ reqId: "" });
    const data = location.state.elem;
    const [isView, setIsView] = useState(location.state.isView)
    const [issAcc, setIssAcc] = useState({});
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    // Local stock state to manage UI-side deductions and dynamic options
    const [localStock, setLocalStock] = useState([]);


    useEffect(() => {

        if (data?.issue_req_id) {
            setAcc({
                reqId: typeof data.issue_req_id === "object"
                    ? data.issue_req_id._id
                    : data.issue_req_id
            });

            // Map issue request details properly
            setIssAcc({
                issue_req_no: data.issue_req_id.issue_req_no || "",
                requested_by: data.issue_req_id.requested_by || {},
                createdAt: data.createdAt || "",
            });

            setTableData(data.items || []);
        }
    }, [data]);

    console.log("data edit mode", data);
    useEffect(() => {
        dispatch(getMultipleIssueRequestPiping());
        dispatch(getPipingStockReportList());
        dispatch(getIssueAcceptancePiping());
    }, [dispatch]);

    const stockReportData = useSelector((state) => state.getPipingStockReportList?.user?.data?.data);
    const issueReqData = useSelector((state) => state.getMultipleIssueRequestPiping?.issues?.data);

    useEffect(() => {
        if (Array.isArray(stockReportData)) {
            setLocalStock(stockReportData.map(s => ({ ...s })));
        }
    }, [stockReportData]);

    const getStockOptionsForItem = (itemId) => {
        // return localStock
        //     ?.filter((st) => st.itemId === itemId && st.stock_qty > 0)
        //     ?.map((st) => ({
        //         label: `${st.imir_no} (Avail: ${st.stock_qty})`,
        //         value: st.imir_no,
        //     })) || [];

        return localStock
            ?.filter(
                st =>
                    st.itemId === itemId &&
                    Number(st.stock_qty) > 0
            )
            ?.map(st => ({
                label: `${st.imir_no} (Avail: ${st.stock_qty})`,
                // value: st.imir_no
                value: st._id,          // ✅ UNIQUE
                imir_no: st.imir_no
            })) || [];
    };


    const handleAcceptRejectClick = (index, isAccepted, name) => {
        Swal.fire({
            title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
            text: "Are you sure you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                setAcceptRejectStatus((prev) => ({ ...prev, [index]: isAccepted }));
                toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
            }
        });
    };

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        requested_qty: "",
        imir_stock_ids: [],
        imir_no: [],
        quantity: 0,
        iss_used_qty: "",
        heat_no: [],
        remarks: "",
        itemId: "",
        available_heat_nos: []
    });

    const handleEditClick = (index, row) => {
        // Prevent editing if IMIR No. is already selected
        if (row?.imir_no && row?.imir_no.length > 0) {
            toast.error("IMIR No. is already assigned. Editing is not allowed.");
            return;
        }
        setEditRowIndex(index);
        setEditFormData({
            requested_qty: row.total_requested_qty,
            imir_stock_ids: [],
            imir_no: row.imir_no || [],
            iss_used_qty: row.iss_used_qty || row.total_requested_qty || "",
            heat_no: row.heat_no || [],
            remarks: row.remarks || "",
            // itemId: row.item_id?._id,
            itemId: row?.material_item_id?.item?._id,
            material_item_id: row?.material_item_id?._id,

            quantity: row.quantity || 0,
            available_heat_nos: []
        });


    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        //          if (name === "imir_no") {
        //     const selectedImirs = Array.isArray(value) ? value : [value];

        //     const matchedStocks = localStock.filter(
        //         st =>
        //             selectedImirs.includes(st.imir_no) &&
        //             st.itemId === editFormData.itemId
        //     );

        //     let heatNos = [];

        //     matchedStocks.forEach(st => {
        //         // ✅ Handle ALL possible heat formats
        //         if (Array.isArray(st.heat_rows)) {
        //             heatNos.push(...st.heat_rows.map(h => h.heat_lot_no));
        //         }

        //         if (Array.isArray(st.heat_no)) {
        //             heatNos.push(...st.heat_no);
        //         }

        //         if (typeof st.heat_no === "string") {
        //             heatNos.push(st.heat_no);
        //         }
        //     });

        //     heatNos = [...new Set(heatNos.filter(Boolean))];

        //     const totalQty = matchedStocks.reduce(
        //         (sum, st) => sum + Number(st.stock_qty || 0),
        //         0
        //     );

        //     setEditFormData(prev => ({
        //         ...prev,
        //          imir_stock_ids: selectedStockIds,
        //         imir_no: selectedImirs,
        //         quantity: totalQty,
        //         heat_no: heatNos.length === 1 ? [heatNos[0]] : [],
        //         available_heat_nos: heatNos
        //     }));
        // }
        if (name === "imir_no") {
            const selectedStockIds = Array.isArray(value) ? value : [value];

            const matchedStocks = localStock.filter(
                st =>
                    selectedStockIds.includes(st._id) &&
                    st.itemId === editFormData.itemId
            );

            const selectedImirs = matchedStocks.map(st => st.imir_no);

            let heatNos = [];

            matchedStocks.forEach(st => {
                if (Array.isArray(st.heat_rows)) {
                    heatNos.push(...st.heat_rows.map(h => h.heat_lot_no));
                }
                if (Array.isArray(st.heat_no)) heatNos.push(...st.heat_no);
                if (typeof st.heat_no === "string") heatNos.push(st.heat_no);
            });

            heatNos = [...new Set(heatNos.filter(Boolean))];

            const totalQty = matchedStocks.reduce(
                (sum, st) => sum + Number(st.stock_qty || 0),
                0
            );

            setEditFormData(prev => ({
                ...prev,
                imir_stock_ids: selectedStockIds, //  drives MultiSelect
                imir_no: selectedImirs,           // derived IMIR numbers
                quantity: totalQty,
                heat_no: heatNos.length === 1 ? [heatNos[0]] : [],
                available_heat_nos: heatNos
            }));
        }

        else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;

        const issuedQty = Number(editFormData.iss_used_qty || 0);
        const totalRequestedQty = Number(editFormData.requested_qty || 0);

        // VALIDATION: Issued Qty must be >= Total Requested Qty
        if (issuedQty < totalRequestedQty) {
            toast.error(`Issued Qty cannot be less than Total Requested Qty (${totalRequestedQty})`);
            return;
        }

        // Validation: Cannot issue more than available stock
        if (Number(editFormData.iss_used_qty) > Number(editFormData.quantity)) {
            toast.error("Issued Qty cannot exceed total available stock for selected IMIRs");
            return;
        }

        // updatedData[dataIndex] = {
        //     ...updatedData[dataIndex],
        //     ...editFormData,
        //     is_accepted: acceptRejectStatus[editRowIndex],
        // };
        updatedData[dataIndex] = {
            ...updatedData[dataIndex],   // KEEP ORIGINAL DATA
            iss_used_qty: editFormData.iss_used_qty,
            imir_no: editFormData.imir_no,
            heat_no: editFormData.heat_no,
            remarks: editFormData.remarks,
            quantity: editFormData.quantity,
            is_accepted: acceptRejectStatus[editRowIndex],
        };

        // LOCAL STOCK DEDUCTION: Update localStock so other rows see reduced quantities
        const qtyToDeduct = Number(editFormData.iss_used_qty) || 0;
        const selectedImirs = editFormData.imir_no;
        const itemId = editFormData.itemId;
        console.log("Deducting Qty:", qtyToDeduct, "for IMIRs:", selectedImirs, "and Item ID:", itemId);
        if (qtyToDeduct > 0 && selectedImirs.length > 0) {
            setLocalStock(prevStock => {
                const nextStock = prevStock.map(s => ({ ...s }));
                let remaining = qtyToDeduct;
                // Deduct from selected IMIRs one by one
                for (let i = 0; i < nextStock.length; i++) {
                    if (remaining <= 0) break;
                    // if (selectedImirs.includes(nextStock[i].imir_no) && nextStock[i].itemId === itemId) {
                    if (selectedImirs.includes(nextStock[i].imir_no) && nextStock[i].material_item_id?.item === itemId) {
                        const available = nextStock[i].stock_qty;
                        const deduct = Math.min(available, remaining);
                        nextStock[i].stock_qty -= deduct;
                        remaining -= deduct;
                    }


                }
                return nextStock;
            });
        }

        setTableData(updatedData);
        console.log("Updated Table Data:", updatedData);
        setEditRowIndex(null);
    };


    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            computedComments = computedComments.filter(i =>
                i?.drawing_id?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                i?.item_id?.item_name?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments;
    }, [search, tableData]);

    const handleSubmit = () => {
        if (!acc.reqId) {
            toast.error("Please select issue request");
            return;
        }
        const missingAccepted = tableData.find((item) => {
            const hasImir =
                Array.isArray(item.imir_no) && item.imir_no.length > 0;

            const isAcceptedMissing =
                item.is_accepted === undefined || item.is_accepted === null;

            return hasImir && isAcceptedMissing;
        });

        if (missingAccepted) {
            const name = missingAccepted?.material_item_id?.item?.item_name || "an item";
            toast.error(`Please accept/reject and save: ${name}`);
            return;
        }


        const filteredData = tableData.map(item => ({

            material_item_id: item?.material_item_id?._id,
            item_id: item?.material_item_id?.item,
            drawing_id: item?.drawing_id?._id,
            issued_required_qty: Number(item?.issued_required_qty ?? item?.required_qty ?? 0),
            issued_extra_qty: Number(item?.issued_extra_qty ?? item?.extra_qty ?? 0),
            issued_total_requested_qty: Number(
                item?.issued_total_requested_qty ?? item?.total_requested_qty ?? 0
            ),

            // issued_required_qty: Number(item?.required_qty || 0),
            // issued_extra_qty: Number(item?.extra_qty || 0),
            // issued_total_requested_qty: Number(item?.total_requested_qty || 0),
            iss_used_qty: Number(item?.iss_used_qty || 0),
            iss_balance_qty: Number(item?.iss_used_qty || 0),
            imir_no: Array.isArray(item.imir_no) ? item.imir_no : [],
            heat_no: Array.isArray(item.heat_no) ? item.heat_no : [],
            remarks: item.remarks || "",
            is_accepted: item.is_accepted,
        }));

        console.log("Filtered Data to submit:", filteredData);
        const body = new URLSearchParams();
        body.append("issue_req_id", data?.issue_req_id?._id);
        body.append("items", JSON.stringify(filteredData));
        body.append("issued_by", localStorage.getItem("PAY_USER_ID"));
        body.append("project", localStorage.getItem("PAY_USER_PROJECT_NAME"));
        body.append("project_id", localStorage.getItem("U_PROJECT_ID"));
        body.append("isFitUp", data?.isFitUp);

        axios.post(`${V_URL}/user/manage-issue-acceptance-piping`, body, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(res => {
                toast.success(res.data.message);
                navigate("/piping/user/issue-management");
            })
            .catch(err => toast.error(err?.response?.data?.message));
    };



    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const issueReqOptions = issueReqData?.map((e) => ({ label: e?.issue_req_no, value: e?._id }));
    const issueReqOptions = issueReqData?.map(e => ({
        label: e.issue_req_no,
        value: e._id,   //ONLY ID
    }));

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <PageHeader
                        breadcrumbs={[{ name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Issue Acceptance List", link: "/piping/user/issue-management", active: false },
                        { name: "Issue Acceptance", active: true }]}
                    />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <h3>Issue Acceptance List</h3>
                                    </div>
                                    <div className="staff-search-table">
                                        <div className="row">

                                            <div className="col-12 col-md-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Issue Request No. <span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={data?.issue_req_id.issue_req_no || ""}
                                                        disabled
                                                    />
                                                    {/* {!isView ? (
                                                        <Dropdown
                                                            options={issueReqOptions}
                                                            value={acc.reqId}
                                                            filter
                                                            className="w-100"
                                                            placeholder="Select Issue Request"
                                                            disabled={Boolean(data?.issue_req_id)}
                                                            onChange={(e) => setAcc({ ...acc, reqId: e.value })}
                                                        />
                                                        ) : (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={data?.issue_req_id.issue_req_no || ""}
                                                            disabled
                                                        />
                                                        )} */}

                                                    <div className="error">{error?.reqId_err}</div>
                                                </div>
                                            </div>



                                            {acc.reqId && (
                                                <>
                                                    <div className="col-12 col-md-3">
                                                        <div className="input-block local-forms">
                                                            <label>Issue Requested By</label>
                                                            <input className="form-control" value={issAcc.requested_by?.user_name || ""} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-3">
                                                        <div className="input-block local-forms">
                                                            <label>Date</label>
                                                            <input className="form-control" value={moment(issAcc?.createdAt).format("YYYY-MM-DD")} readOnly />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {acc.reqId && (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            {/* <div className="row align-items-center">
                                                <div className="col">
                                                    <h3>Material Issue Requested List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <Search onSearch={(val) => setSearch(val)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="row align-items-center mb-2">
                                                <div className="col d-flex justify-content-between align-items-center">
                                                    <h3 className="mb-0">Material Issue Requested List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <Search onSearch={(val) => setSearch(val)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="table-responsive mt-2">
                                            <table className="table border-0 custom-table comman-table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Drawing No./Line No.</th>
                                                        <th>Rev</th>
                                                        {/* <th>Sheet No.</th> */}
                                                        <th>Item Name</th>
                                                        <th>Item Description</th>
                                                        <th>Size</th>
                                                        <th>Thickness</th>
                                                        <th>Material Grade</th>
                                                        <th>UOM</th>
                                                        <th>Required Qty</th>
                                                        <th>Extra Qty</th>
                                                        <th>Total Requested Qty</th>
                                                        <th>Issued Qty</th>
                                                        <th>IMIR No.</th>
                                                        <th>Heat No.</th>
                                                        {!isView && <th>Stock Qty</th>}
                                                        <th>Remarks</th>
                                                        {!isView && <th>Acc/Rej</th>}
                                                        {!isView && <th>Status</th>}
                                                        {!isView && <th>Action</th>}

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => (
                                                        <tr key={elem?._id}>
                                                            <td>{i + 1}</td>
                                                            <td>{elem?.drawing_id?.drawing_no}</td>
                                                            <td>{elem?.drawing_id?.rev}</td>
                                                            {/* <td>{elem?.drawing_id?.sheet_no}</td> */}
                                                            <td>{elem?.material_item_id?.item?.item_name}</td>
                                                            <td>{elem?.material_item_id?.item?.item_description}</td>
                                                            <td>{elem?.material_item_id?.item?.size1?.name}</td>
                                                            <td>{elem?.material_item_id?.item?.thickness1?.name}</td>
                                                            <td>{elem?.material_item_id?.item?.material_grade}</td>
                                                            <td>{elem?.material_item_id?.item?.uom?.name}</td>
                                                            <td>{elem?.issued_required_qty ?? "-"}</td>
                                                            <td>{elem?.issued_extra_qty ?? "-"}</td>
                                                            <td>{elem?.issued_total_requested_qty ?? "-"}</td>

                                                            {editRowIndex === i ? (
                                                                <>
                                                                    <td>
                                                                        <input
                                                                            className="form-control"
                                                                            type="number"
                                                                            name="iss_used_qty"
                                                                            value={editFormData.iss_used_qty}
                                                                            onChange={handleEditFormChange}
                                                                        />
                                                                    </td>

                                                                    <td>
                                                                        <MultiSelect
                                                                            className="w-100"
                                                                            name="imir_no"
                                                                            // value={editFormData.imir_no}
                                                                            value={editFormData.imir_stock_ids}
                                                                            // options={getStockOptionsForItem(elem?.item_id?._id)} 
                                                                            options={getStockOptionsForItem(elem?.material_item_id?.item?._id)}

                                                                            onChange={(e) => handleEditFormChange({ target: { name: "imir_no", value: e.value } })}
                                                                            placeholder="Select IMIR"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <MultiSelect
                                                                            className="w-100"
                                                                            name="heat_no"
                                                                            value={editFormData.heat_no}
                                                                            options={editFormData.available_heat_nos?.map(h => ({
                                                                                label: h,
                                                                                value: h
                                                                            }))}
                                                                            onChange={(e) =>
                                                                                handleEditFormChange({
                                                                                    target: { name: "heat_no", value: e.value }
                                                                                })
                                                                            }
                                                                            placeholder="Select Heat No."
                                                                            display="chip"
                                                                        />
                                                                    </td>
                                                                    {!isView && (<td className="fw-bold text-primary">{editFormData.quantity}</td>)}
                                                                    <td><textarea className="form-control" name="remarks" rows={1} value={editFormData.remarks} onChange={handleEditFormChange} /></td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <span className={`present-table attent-status ${acceptRejectStatus[i] === true ? "selected" : ""}`} onClick={() => handleAcceptRejectClick(i, true, elem?.material_item_id?.item?.item_name || "Item")}><Check /></span>
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.iss_used_qty || "-"}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{Array.isArray(elem?.imir_no) ? elem.imir_no.join(", ") : elem?.imir_no || "-"}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{Array.isArray(elem?.heat_no) ? elem.heat_no.join(", ") : elem?.heat_no || "-"}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.quantity || "-"}</td>
                                                                    {!isView && (<td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || "-"}</td>)}
                                                                    {!isView && (<td>-</td>)}
                                                                </>
                                                            )}
                                                            {!isView && (
                                                                <td className="status-badge">
                                                                    {acceptRejectStatus[i] === true ? <span className="custom-badge status-green">Acc</span> : "-"}
                                                                </td>
                                                            )}
                                                            {!isView && (
                                                                <td>
                                                                    {editRowIndex === i ? (
                                                                        <div className="d-flex">
                                                                            <button className="btn btn-success p-1 mx-1" onClick={handleSaveClick}><Save size={16} /></button>
                                                                            <button className="btn btn-secondary p-1" onClick={() => setEditRowIndex(null)}><X size={16} /></button>
                                                                        </div>
                                                                    ) : "-"}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {!isView ? (
                        <SubmitButton disable={disable} handleSubmit={handleSubmit} buttonName={"Generate Issue Acceptance"} />
                    ) : (<div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => navigate('/piping/user/issue-management')}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ViewMultiIssueAcc;
