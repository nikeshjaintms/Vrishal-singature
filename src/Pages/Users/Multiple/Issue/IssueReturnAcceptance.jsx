import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMultipleIssueReturn } from '../../../../Store/Erp/IssueReturn/getMultipleIssueReturn';
// import { getPipingStockReportList } from "../../../../Store/Piping/Stock/getPipingStockReportList";
import {clearItemCategoryWiseReportList,getItemCategoryWiseReportList} from "../../../../Store/Erp/IssueReturn/getItemCategoryWiseReportList";

import { getIssueReturnAcceptance } from "../../../../Store/Erp/IssueReturnAcceptance/getIssueReturnAcceptance";

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
        dispatch(getMultipleIssueReturn());
        dispatch(getItemCategoryWiseReportList());
        dispatch(getIssueReturnAcceptance());
    }, [dispatch]);

    const stockReportData = useSelector((state) => state.getItemCategoryWiseReportList?.user?.data?.data);
    const issueReqData = useSelector((state) => state.getMultipleIssueReturn?.issues?.data);

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
            return_received_qty: row.return_received_qty || "",
            scrap_received_qty: row.scrap_received_qty || "",
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
         const returnReceivedQty = editFormData.return_received_qty;
        const scrapReceivedQty = editFormData.scrap_received_qty;
            const issuedQty = Number(editFormData.iss_used_qty || 0);
        console.log("issuedQty======>",issuedQty);

    const totalRequestedQty = Number(editFormData.requested_qty || 0);

     if (returnReceivedQty === "" || returnReceivedQty === null || returnReceivedQty === undefined) {
            toast.error("Return Received Qty is required");
            return;
        }

        if (scrapReceivedQty === "" || scrapReceivedQty === null || scrapReceivedQty === undefined) {
            toast.error("Scrap Received Qty is required");
            return;
        }
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
        const returnReceivedNum = Number(returnReceivedQty);
        const scrapReceivedNum = Number(scrapReceivedQty);
        const returnQty = Number(updatedData[dataIndex].return_qty || 0);
        const scrapQty = Number(updatedData[dataIndex].scrap_qty || 0);

        if (returnReceivedNum < 0) {
            toast.error("Return Received Qty cannot be negative");
            return;
        }

        if (scrapReceivedNum < 0) {
            toast.error("Scrap Received Qty cannot be negative");
            return;
        }

        if (returnReceivedNum > returnQty) {
            toast.error(`Return Received Qty cannot exceed Return Qty (${returnQty})`);
            return;
        }

        if (scrapReceivedNum > scrapQty) {
            toast.error(`Scrap Received Qty cannot exceed Scrap Qty (${scrapQty})`);
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
            setError({ reqId_err: "Please select issue return no" });
            return;
        }
// At least one row should have Return Received Qty or Scrap Received Qty
const hasValidEntry = tableData.some(
    row =>
        Number(row.return_received_qty || 0) > 0 ||
        Number(row.scrap_received_qty || 0) > 0
);

if (!hasValidEntry) {
    toast.error(
        "Please enter Return Received Qty or Scrap Received Qty in at least one row."
    );
    return;
}
        const filteredData = tableData.map((item) => ({
            // item_id: item?.itemId,
            item_id:
  item?.item_id ||
  item?.itemId ||
  item?.itemDetails?._id ||
  null,
            total_issued_qty: Number(item?.total_issued_qty || 0),
            return_qty: Number(item?.return_qty || 0),
            scrap_qty: Number(item?.scrap_qty || 0),
            return_imir_no: item.return_imir_no,
            return_heat_no: item.return_heat_no,
            scrap_imir_no: item.scrap_imir_no,
            scrap_heat_no: item.scrap_heat_no,
            return_received_qty: Number(item?.return_received_qty),
            scrap_received_qty: Number(item?.scrap_received_qty),
            remarks: item.remarks || "",
            is_accepted: item.is_accepted,
        }));

        setDisable(true);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("issue_return_id", acc.reqId);
        bodyFormData.append("items", JSON.stringify(filteredData));
        bodyFormData.append("issued_by", localStorage.getItem("PAY_USER_ID"));
        bodyFormData.append("project", localStorage.getItem("PAY_USER_PROJECT_NAME"));
        bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
       

        axios.post(`${V_URL}/user/manage-material-issue-return-acceptance`, bodyFormData, {
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") 
            },
        })
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/user/project-store/issue-return-management");
            }
        })
        .catch((err) => toast.error(err?.response?.data?.message))
        .finally(() => setDisable(false));
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const issueReqOptions = issueReqData?.map((e) => ({ label: e?.issue_return_no, value: e?._id }));
    
    
    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <PageHeader
                        breadcrumbs={[
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Issue Return Acceptance List", link: "/user/project-store/issue-return-management", active: false },
                            { name: "Issue Return Acceptance", active: true },
                        ]}
                    />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="doctor-table-blk">
                                            <h3>Issue Return Acceptance List</h3>
                                        </div>
                                    </div>
                                    <div className="staff-search-table">
                                        <div className="row">
                                            <div className="col-12 col-md-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Issue Return No. <span className="login-danger">*</span></label>
                                                    
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
    value={data?.issue_return_no || ""}
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
                                                        <h3>Material Issue Returned List</h3>
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
                                                        <th>Material Grade</th>
                                                        <th>UNIT</th>                                                      
                                                        <th>Issued Qty</th>
                                                        <th>Return Qty</th>
                                                        <th>Return IMIR No.</th>
                                                        <th>Return Heat No.</th>                                                     
                                                        <th>Scrap Qty</th>
                                                        <th>Scrap IMIR No.</th>
                                                        <th>Scrap Heat No.</th>
                                                        <th>Return Received Qty</th>
                                                        <th>Scrap Received Qty</th>
                                                        <th>Remarks</th>
                                            
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => (
                                                        <tr key={elem?._id}>
                                                            <td>{i + 1}</td>                                                           
                                                            <td>{elem?.itemDetails?.name || '-'}</td>
                                                            
                                                            <td>{elem?.itemDetails?.material_grade || '-'}</td>
                                                            <td>{elem?.itemDetails?.unit?.name || '-'}</td>                                                          
                                                            <td>{elem?.total_issued_qty || '-'}</td>
                                                            <td>{elem?.return_qty || '-'}</td>
                                                            
                                                            <td>{elem?.return_imir_no || '-'}</td>
                                                            <td>{elem?.return_heat_no || '-'}</td>
                                                            <td>{elem?.scrap_qty || '-'}</td>
                                                            <td>{elem?.scrap_imir_no || '-'}</td>
                                                            <td>{elem?.scrap_heat_no || '-'}</td>
                                                            {editRowIndex === i ? (
                                                                <>
                                                                    {/* <td><input className="form-control" type="number" name="iss_used_qty" value={editFormData.iss_used_qty} onChange={handleEditFormChange} /></td> */}
                                                                    <td>
    <input 
        className="form-control" 
        type="number" 
        name="return_received_qty" 
        value={editFormData.return_received_qty} 
        onChange={handleEditFormChange} 
     
    />
</td>
                                                                  
                                                                    

                                                                  <td>
    <input 
        className="form-control" 
        type="number" 
        name="scrap_received_qty" 
        value={editFormData.scrap_received_qty} 
        onChange={handleEditFormChange} 
     
    />
</td>
                                                                  
                                                                    <td><input className="form-control" name="remarks"  value={editFormData.remarks} onChange={handleEditFormChange} /></td>
                                                                   
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.return_received_qty || "-"}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.scrap_received_qty || "-"}</td>
                                                                    
                                                                   
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || "-"}</td>
                                                                    
                                                                </>
                                                            )}
                                                           
                                                            <td>
                                                                {editRowIndex === i ? (
                                                                    <div className="d-flex">
                                                                        <button className="btn btn-success p-1 mx-1" onClick={handleSaveClick}><Save /></button>
                                                                        <button className="btn btn-secondary p-1" onClick={() => setEditRowIndex(null)}><X /></button>
                                                                    </div>
                                                                ) : ""}
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
                    <SubmitButton disable={disable} handleSubmit={handleSubmit} buttonName={"Generate Issue Return Acceptance"} />
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MultiIssueAcceptance;