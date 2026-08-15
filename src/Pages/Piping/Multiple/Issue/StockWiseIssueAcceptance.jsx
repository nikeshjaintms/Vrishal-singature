import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMultipleIssueRequestPiping } from '../../../../Store/Piping/IssueRequest/getMultipleIssueRequestPiping';
import {getStockIssueRequestPiping} from '../../../../Store/Piping/StockIssueRequest/getStockIssueRequestPiping';
// import { getPipingStockReportList } from "../../../../Store/Piping/Stock/getPipingStockReportList";
import {clearItemCategoryWiseStockReportList,getItemCategoryWiseStockReportList} from "../../../../Store/Piping/Stock/getItemCategoryWiseStockReportList";
import { getIssueAcceptancePiping } from "../../../../Store/Piping/IssueAcceptance/getIssueAcceptancePiping";
import { getStockIssueAcceptancePiping} from "../../../../Store/Piping/StockIssueAcceptance/getStockIssueAcceptancePiping";
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

const MultiIssueAcceptance = () => {
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
    // const [acc, setAcc] = useState({ reqId: "" });
    const [acc, setAcc] = useState({ reqId: null });

    const data = location.state;
    console.log("data acccptane",data);
    const [issAcc, setIssAcc] = useState({});
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    // Local stock state to manage UI-side deductions and dynamic options
    const [localStock, setLocalStock] = useState([]);

    useEffect(() => {
        if (data?._id) {
            setAcc({ reqId: data._id });
            setIssAcc(data);
            setTableData(data.items || []);
        }
    }, [data]);




    useEffect(() => {
        dispatch(getStockIssueRequestPiping());
        dispatch(getItemCategoryWiseStockReportList());
        dispatch(getStockIssueAcceptancePiping());
    }, [dispatch]);

    const stockReportData = useSelector((state) => state.getItemCategoryWiseStockReportList?.user?.data?.data);
    const issueReqData = useSelector((state) => state.getStockIssueRequestPiping?.issues?.data);

  useEffect(() => {
    if (Array.isArray(stockReportData)) {

        const flattenedStock = stockReportData.flatMap(item =>
            (item.rows || []).map(row => ({
                ...row,
                itemId: item.itemId, // attach parent itemId
                _id: row._id || row.transactionId // ensure unique id
            }))
        );
console.log("flattenedStock===>",flattenedStock);
        setLocalStock(flattenedStock);
    }
}, [stockReportData]);

   
   const getStockOptionsForItem = (itemId) => {
    return localStock
        ?.filter(st => st.itemId === itemId && Number(st.stock_qty) > 0)
        ?.map(st => ({
            label: `${st.imir_no} (Avail: ${st.stock_qty})`,
            value: st._id,
            imir_no: st.imir_no
        })) || [];
};
console.log("localStock===>",localStock);

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
        imir_no: [],
        imir_stock_ids: [], 
        quantity: 0,
        iss_used_qty: "",
        heat_no: [],
        remarks: "",
        itemId: "",
        available_heat_nos: []
    });

    const handleEditClick = (index, row) => {
        console.log("row=====>",row);
        setEditRowIndex(index);
        setEditFormData({
            requested_qty: row.requested_qty,
            imir_no: row.imir_no || [],
            imir_stock_ids: [], 
            iss_used_qty: row.iss_used_qty || row.requested_qty || "",
            heat_no: row.heat_no || [],
            remarks: row.remarks || "",
            // itemId: row.item_id?._id,
            itemId: row.item_id,
            quantity: row.quantity || 0,
            available_heat_nos: []
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;

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
         imir_stock_ids: selectedStockIds,
        imir_no: selectedImirs,     // actual IMIR numbers
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
        console.log("updatedData======>",updatedData);
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        
            const issuedQty = Number(editFormData.iss_used_qty || 0);
        console.log("issuedQty======>",issuedQty);

    const totalRequestedQty = Number(editFormData.requested_qty || 0);


            //VALIDATION: Issued Qty must be >= Total Requested Qty
        if (issuedQty < totalRequestedQty) {
             toast.error(
                `Issued Qty cannot be less than Total Requested Qty (${totalRequestedQty})`
            );
            return;
        }

        // Validation: Cannot issue more than available stock
        if (Number(editFormData.iss_used_qty) > Number(editFormData.quantity)) {
            toast.error("Issued Qty cannot exceed total available stock for selected IMIRs");
            return;
        }

        updatedData[dataIndex] = {
            ...updatedData[dataIndex],
            ...editFormData,
            is_accepted: acceptRejectStatus[editRowIndex],
        };
        
        // LOCAL STOCK DEDUCTION: Update localStock so other rows see reduced quantities
        const qtyToDeduct = Number(editFormData.iss_used_qty) || 0;
        const selectedImirs = editFormData.imir_no;
        const itemId = editFormData.itemId;

        if (qtyToDeduct > 0 && selectedImirs.length > 0) {
            setLocalStock(prevStock => {
                const nextStock = prevStock.map(s => ({ ...s }));
                let remaining = qtyToDeduct;
                // Deduct from selected IMIRs one by one
                for (let i = 0; i < nextStock.length; i++) {
                    if (remaining <= 0) break;
                    // if (selectedImirs.includes(nextStock[i].imir_no) && nextStock[i].itemId === itemId) {
                    //     const available = nextStock[i].stock_qty;
                    //     const deduct = Math.min(available, remaining);
                    //     nextStock[i].stock_qty -= deduct;
                    //     remaining -= deduct;
                    // }
                    if (
    selectedImirs.includes(nextStock[i].imir_no) &&
    
    nextStock[i].itemId === editFormData.itemId
) {
    const deduct = Math.min(nextStock[i].stock_qty, remaining);
    nextStock[i].stock_qty -= deduct;
    remaining -= deduct;
}

                }
                return nextStock;
            });
        }

        setTableData(updatedData);
        setEditRowIndex(null);
    };
console.log("setLocalStock===>",localStock);
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
console.log("commentsData",commentsData);

    const handleSubmit = () => {
        if (!acc.reqId) {
            setError({ reqId_err: "Please select issue request no" });
            return;
        }
 for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i];

        if (!row.iss_used_qty || Number(row.iss_used_qty) <= 0) {
            toast.error(`Row ${i + 1}: Please enter Issued Qty`);
            return;
        }

        if (!row.imir_no || row.imir_no.length === 0) {
            toast.error(`Row ${i + 1}: Please select IMIR No`);
            return;
        }

        if (!row.heat_no || row.heat_no.length === 0) {
            toast.error(`Row ${i + 1}: Please select Heat No`);
            return;
        }

        if (acceptRejectStatus[i] === undefined) {
            toast.error(`Row ${i + 1}: Please Accept or Reject`);
            return;
        }
    }
        const filteredData = tableData.map((item) => ({
            item_id: item?.itemId,
            issued_stock_qty: Number(item?.total_stock_qty || 0),
            issued_requested_qty: Number(item?.requested_qty || 0),
            iss_used_qty: Number(item?.iss_used_qty || 0),
            iss_balance_qty: Number(item?.iss_used_qty || 0),
            imir_no: Array.isArray(item.imir_no) ? item.imir_no : [item.imir_no].filter(Boolean),
            // heat_no: item.heat_no ? [item.heat_no] : [],
            heat_no: Array.isArray(item.heat_no) ? item.heat_no : [item.heat_no].filter(Boolean),
            remarks: item.remarks || "",
            is_accepted: item.is_accepted,
        }));

        setDisable(true);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("stock_issue_req_id", acc.reqId);
        bodyFormData.append("items", JSON.stringify(filteredData));
        bodyFormData.append("issued_by", localStorage.getItem("PAY_USER_ID"));
        bodyFormData.append("project", localStorage.getItem("PAY_USER_PROJECT_NAME"));
        bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
        bodyFormData.append("isReleaseNoteForSiteDispatch", data?.isReleaseNoteForSiteDispatch);
        bodyFormData.append("isReleaseForPainting", data?.isReleaseForPainting);


        axios.post(`${V_URL}/user/manage-stock-issue-acceptance-piping`, bodyFormData, {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") 
            },
        })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/piping/user/stock-wise-issue-management");
            }
        })
        .catch((err) => toast.error(err?.response?.data?.message))
        .finally(() => setDisable(false));
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const issueReqOptions = issueReqData?.map((e) => ({ label: e?.stock_issue_req_no, value: e?._id }));
    
    
    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <PageHeader
                        breadcrumbs={[
                            { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                            { name: "Stock Wise Issue Acceptance List", link: "/piping/user/stock-wise-issue-management", active: false },
                            { name: "Stock Wise Issue Acceptance", active: true },
                        ]}
                    />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="doctor-table-blk">
                                            <h3>Issue Acceptance List</h3>
                                        </div>
                                    </div>
                                    <div className="staff-search-table">
                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Stock Issue Request No. <span className="login-danger">*</span></label>
                                                    
                                                    {/* <Dropdown 
                                                        options={issueReqOptions} 
                                                        value={acc.reqId} 
                                                        filter 
                                                        className="w-100" 
                                                        placeholder="Select Issue Request" 
                                                        disabled={data?._id} 
                                                        onChange={(e) => setAcc({ ...acc, reqId: e.value })}
                                                    /> */}

                                                    {data?._id ? (
  // 🔒 EDIT MODE → show text input
  <input
    type="text"
    className="form-control"
    value={data?.stock_issue_req_no || ""}
    disabled
  />
) : (
  // ✏️ CREATE MODE → show dropdown
  <Dropdown
    options={issueReqOptions}
    value={acc.reqId}
    optionLabel="label"
    optionValue="value"
    filter
    className="w-100"
    placeholder="Select Issue Request"
    onChange={(e) => setAcc({ ...acc, reqId: e.value })}
  />
)}

                                                   
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
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Material Issue Requested List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <Search onSearch={(val) => setSearch(val)} />
                                                            </div>
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
                                                        <th>Item Name</th>
                                                        <th>Item Description</th>
                                                        <th>Size 1 </th>
                                                        <th>Thickness 1</th>
                                                        <th>Size 2 </th>
                                                        <th>Thickness 2</th>
                                                        <th>Material Grade</th>
                                                        <th>UOM</th>                                                      
                                                        <th>Stock Qty</th>
                                                        <th>Requested Qty</th>
                                                        <th>Issued Qty</th>
                                                        <th>IMIR No.</th>
                                                        <th>Heat No.</th>                                                     
                                                        <th>Remarks</th>
                                                        <th>Acc/Rej</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => (
                                                        <tr key={elem?._id}>
                                                            <td>{i + 1}</td>                                                           
                                                            <td>{elem?.itemDetails?.item_name || '-'}</td>
                                                            <td>{elem?.itemDetails?.item_description || '-'}</td>
                                                            <td>{elem?.itemDetails?.size1?.name || '-'}</td>
                                                            <td>{elem?.itemDetails?.thickness1?.name || '-'}</td>
                                                            <td>{elem?.itemDetails?.size2?.name || '-'}</td>
                                                            <td>{elem?.itemDetails?.thickness2?.name || '-'}</td>
                                                            <td>{elem?.itemDetails?.material_grade || '-'}</td>
                                                            <td>{elem?.itemDetails?.uom?.name || '-'}</td>                                                          
                                                            <td>{elem?.total_stock_qty || '-'}</td>
                                                            <td>{elem?.requested_qty || '-'}</td>
                                                            {editRowIndex === i ? (
                                                                <>
                                                                    {/* <td><input className="form-control" type="number" name="iss_used_qty" value={editFormData.iss_used_qty} onChange={handleEditFormChange} /></td> */}
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
                                                                        {/* <MultiSelect className="w-100" name="imir_no" value={editFormData.imir_no} options={getStockOptionsForItem(elem?.item_id?._id)} 
                                                                            onChange={(e) => handleEditFormChange({ target: { name: "imir_no", value: e.value } })} placeholder="Select IMIR" /> */}
                                                                        <MultiSelect
    className="w-100"
    name="imir_no"
    value={editFormData.imir_stock_ids}
   options={getStockOptionsForItem(elem?.item_id)}
    onChange={(e) =>
        handleEditFormChange({
            target: { name: "imir_no", value: e.value }
        })
    }
    placeholder="Select IMIR"
/>


                                                                    </td>
                                                                    <td>
    {/* <MultiSelect
        className="w-100"
        name="heat_no"
        value={editFormData.heat_no}   // should be an array
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
    /> */}
    <MultiSelect
    className="w-100"
    name="heat_no"
    value={editFormData.heat_no}
    options={editFormData.available_heat_nos.map(h => ({
        label: h,
        value: h
    }))}
    onChange={(e) =>
        handleEditFormChange({
            target: { name: "heat_no", value: e.value }
        })
    }
    placeholder="Select Heat No"
    display="chip"
/>

</td>

                                                                    {/* <td>
                                                                        <select className="form-control" name="heat_no" value={editFormData.heat_no} onChange={handleEditFormChange}>
                                                                            <option value="">Select Heat No.</option>
                                                                            {editFormData.available_heat_nos?.map(h => <option key={h} value={h}>{h}</option>)}
                                                                        </select>
                                                                    </td> */}
                                                                    <td className="fw-bold text-primary">{editFormData.quantity}</td>
                                                                    <td><textarea className="form-control" name="remarks" rows={1} value={editFormData.remarks} onChange={handleEditFormChange} /></td>
                                                                    <td>
                                                                        <div className="d-flex gap-2">
                                                                            <span className={`present-table attent-status ${acceptRejectStatus[i] === true ? "selected" : ""}`} onClick={() => handleAcceptRejectClick(i, true, elem?.material_item_id?.item?.item_name || "Item")}><Check /></span>
                                                                            {/* <span className={`absent-table attent-status ${acceptRejectStatus[i] === false ? "selected" : ""}`} onClick={() => handleAcceptRejectClick(i, false, elem?.item_id?.item_name)}><X /></span> */}
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.iss_used_qty || "-"}</td>
                                                                    
                                                                    <td onClick={() => handleEditClick(i, elem)}>{Array.isArray(elem?.imir_no) ? elem.imir_no.join(", ") : elem?.imir_no || "-"}</td>
                                                                    {/* <td onClick={() => handleEditClick(i, elem)}>{elem?.heat_no || "-"}</td> */}
                                                                    <td onClick={() => handleEditClick(i, elem)}>{Array.isArray(elem?.heat_no) ? elem.heat_no.join(", ") : elem?.heat_no || "-"}</td>

                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.quantity || "-"}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || "-"}</td>
                                                                    <td>-</td>
                                                                </>
                                                            )}
                                                            <td className="status-badge">
                                                                {acceptRejectStatus[i] === true ? <span className="custom-badge status-green">Acc</span> : "-"}
                                                                 {/* acceptRejectStatus[i] === false ? <span className="custom-badge status-pink">Rej</span> : "-"} */}
                                                            </td>
                                                            <td>
                                                                {editRowIndex === i ? (
                                                                    <div className="d-flex">
                                                                        <button className="btn btn-success p-1 mx-1" onClick={handleSaveClick}><Save size={16} /></button>
                                                                        <button className="btn btn-secondary p-1" onClick={() => setEditRowIndex(null)}><X size={16} /></button>
                                                                    </div>
                                                                ) : "-"}
                                                            </td>
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
                    <SubmitButton disable={disable} handleSubmit={handleSubmit} buttonName={"Generate Issue Acceptance"} />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MultiIssueAcceptance;