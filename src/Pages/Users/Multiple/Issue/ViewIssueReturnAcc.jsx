import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMultipleIssueReturn } from '../../../../Store/Erp/IssueReturn/getMultipleIssueReturn';
import { getStockReportList } from "../../../../Store/Store/Stock/getStockReportList";
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
    console.log("Received data in ViewMultiIssueAcc:", data);
    const [isView, setIsView] = useState(location.state.isView)
    const [issAcc, setIssAcc] = useState({});
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    // Local stock state to manage UI-side deductions and dynamic options
    const [localStock, setLocalStock] = useState([]);


useEffect(() => {
    
  if (data?.issue_return_id) {
    setAcc({ 
      reqId: typeof data.issue_return_id === "object"
        ? data.issue_return_id._id
        : data.issue_return_id
    });

    // Map issue request details properly
    setIssAcc({
      issue_return_no: data.issue_return_id.issue_return_no || "",
      requested_by: data.issue_return_id.requested_by || {},
      createdAt: data.createdAt || "",
    });

    setTableData(data.items || []);
  }
}, [data]);

console.log("data edit mode",data);
    useEffect(() => {
        dispatch(getMultipleIssueReturn());
        dispatch(getStockReportList());
        dispatch(getIssueReturnAcceptance());
    }, [dispatch]);

    const stockReportData = useSelector((state) => state.getStockReportList?.user?.data);
    const issueReqData = useSelector((state) => state.getMultipleIssueReturn?.issues?.data);

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
    requested_qty:"",
    imir_stock_ids:[],
    imir_no:[],
    quantity:0,
    iss_used_qty:"",
    heat_no:[],
    remarks:"",
    itemId:"",
    available_heat_nos:[],

    return_received_qty:"",
    scrap_received_qty:""
});

  const handleEditClick = (index, row) => {

    // already accepted values cannot edit
    if (
        (row?.return_received_qty !== null && row?.return_received_qty !== "") ||
        (row?.scrap_received_qty !== null && row?.scrap_received_qty !== "")
    ) {
        toast.error("Received Qty already submitted. Editing not allowed.");
        return;
    }


    setEditRowIndex(index);

    setEditFormData({
        requested_qty: row.total_requested_qty || "",
        imir_stock_ids: [],
        imir_no: row.imir_no || [],
        iss_used_qty: row.iss_used_qty || row.total_requested_qty || "",
        heat_no: row.heat_no || [],
        remarks: row.remarks || "",

        itemId: row?.material_item_id?.item?._id,
        material_item_id: row?.material_item_id?._id,

        quantity: row.quantity || 0,

        // ADD THESE
        return_received_qty: row?.return_received_qty || "",
        scrap_received_qty: row?.scrap_received_qty || "",

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

const returnReceivedQty = editFormData.return_received_qty;
    const scrapReceivedQty = editFormData.scrap_received_qty;

    if (returnReceivedQty === "" || returnReceivedQty === null || returnReceivedQty === undefined) {
        toast.error("Return Received Qty is required");
        return;
    }

    if (scrapReceivedQty === "" || scrapReceivedQty === null || scrapReceivedQty === undefined) {
        toast.error("Scrap Received Qty is required");
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


    // updatedData[dataIndex] = {
    //     ...updatedData[dataIndex],
    //     ...editFormData,
    //     is_accepted: acceptRejectStatus[editRowIndex],
    // };
updatedData[dataIndex] = {
    ...updatedData[dataIndex],

    iss_used_qty: editFormData.iss_used_qty,
    imir_no: editFormData.imir_no,
    heat_no: editFormData.heat_no,
    remarks: editFormData.remarks,
    quantity: editFormData.quantity,

    // ADD THESE
    return_received_qty: editFormData.return_received_qty,
    scrap_received_qty: editFormData.scrap_received_qty,

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
                if (selectedImirs.includes(nextStock[i].imir_no) &&nextStock[i].material_item_id?.item === itemId) {
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

  
 const filteredData = tableData.map(item => ({

    _id: item?._id,

    // KEEP OLD IDS
    item_id: item?.item_id?._id || item?.item_id,

    material_item_id:
        item?.material_item_id?._id ||
        item?.material_item_id,

    drawing_id:
        item?.drawing_id?._id ||
        item?.drawing_id,


    total_issued_qty:
        Number(item?.total_issued_qty || 0),

    return_qty:
        Number(item?.return_qty || 0),

    return_imir_no:
        item?.return_imir_no || "",

    return_heat_no:
        item?.return_heat_no || "",


    scrap_qty:
        Number(item?.scrap_qty || 0),

    scrap_imir_no:
        item?.scrap_imir_no || "",

    scrap_heat_no:
        item?.scrap_heat_no || "",



    // Send null if not yet filled so backend tracks partial vs completed correctly
    return_received_qty:
        (item?.return_received_qty === "" ||
         item?.return_received_qty === null ||
         item?.return_received_qty === undefined)
            ? null
            : Number(item.return_received_qty),

    scrap_received_qty:
        (item?.scrap_received_qty === "" ||
         item?.scrap_received_qty === null ||
         item?.scrap_received_qty === undefined)
            ? null
            : Number(item.scrap_received_qty),



    moved_next_step:
        item?.moved_next_step || 0,


    iss_used_qty:
        Number(item?.iss_used_qty || 0),

    iss_balance_qty:
        Number(item?.iss_balance_qty || 0),


    imir_no:
        Array.isArray(item.imir_no)
        ? item.imir_no
        : [],

    heat_no:
        Array.isArray(item.heat_no)
        ? item.heat_no
        : [],


    remarks:
        item?.remarks || "",

    is_accepted:
        item?.is_accepted || false
}));

  console.log("Filtered Data to submit:", filteredData);
  const body = new URLSearchParams();
  body.append("issue_return_id", data?.issue_return_id?._id);
  body.append("items", JSON.stringify(filteredData));
  body.append("issued_by", localStorage.getItem("PAY_USER_ID"));
  body.append("project", localStorage.getItem("PAY_USER_PROJECT_NAME"));
  body.append("project_id",localStorage.getItem("U_PROJECT_ID"));
  body.append("isFitUp", data?.isFitUp);

  axios.post(`${V_URL}/user/manage-material-issue-return-acceptance`, body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  .then(res => {
    toast.success(res.data.message);
    navigate("/user/project-store/issue-return-management");
  })
  .catch(err => toast.error(err?.response?.data?.message));
};



    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const issueReqOptions = issueReqData?.map((e) => ({ label: e?.issue_req_no, value: e?._id }));
    const issueReqOptions = issueReqData?.map(e => ({
  label: e.issue_return_no,
  value: e._id,   //ONLY ID
}));

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <PageHeader
                        breadcrumbs={[{ name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                        { name: "Issue Return List", link: "/user/project-store/issue-return-management", active: false },
                        { name: "Issue Return Acceptance", active: true }]}
                    />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <h3>Issue Return Acceptance</h3>
                                    </div>
                                    <div className="staff-search-table">
                                        <div className="row">
                                    
                                            <div className="col-12 col-md-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Issue  Return  No. <span className="login-danger">*</span></label>
                                                     <input
                                                            type="text"
                                                            className="form-control"
                                                            value={data?.issue_return_id.issue_return_no || ""}
                                                            disabled
                                                        />
                                                       
                                                    
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
                                                        <th>Item Name</th>                                               
                                                        <th>Material Grade</th>
                                                        <th>Unit</th>
                                                        <th>Issued Qty</th>
                                                        <th>Return Qty</th>                                                
                                                        <th>Return IMIR No.</th>
                                                        <th>Return Heat No.</th>
                                                        <th>Scrap Qty</th>
                                                        <th>Scrap IMIR No.</th>
                                                        <th>Scrap Heat No.</th>
                                                         <th>Return Received Qty</th>
                                                        <th> Scrap Received Qty</th>
                                                        <th>Remarks</th>
                                                      
                                                        {!isView && <th>Action</th>}
                                                      
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => (
                                                        <tr key={elem?._id}>
                                                            <td>{i + 1}</td>                                           
                                                             <td>{elem?.item_id?.name || '-'}</td>
                                                          
                                                        
                                                            <td>{elem?.item_id?.material_grade }</td>
                                                           
                                                            <td>{elem?.item_id?.unit?.name || '-'}</td>
                                                            <td>{elem?.total_issued_qty ?? "-"}</td>                                                     
                                                            <td>{elem?.return_qty ?? "-"}</td>
                                        
                                                            <td>{elem?.return_imir_no ?? "-"}</td>
                                                            <td>{elem?.return_heat_no ?? "-"}</td>
                                                            <td>{elem?.scrap_qty ?? "-"}</td>
                                                            <td>{elem?.scrap_imir_no ?? "-"}</td>
                                                            <td>{elem?.scrap_heat_no ?? "-"}</td>
                                                            {editRowIndex === i ? (
                                                                <>
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
                                                                   
                                                        
                                                                    <td><textarea className="form-control" name="remarks" rows={1} value={editFormData.remarks} onChange={handleEditFormChange} /></td>
                                                                   
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.return_received_qty || "-"}</td>
                                                                   
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.scrap_received_qty || "-"}</td>
                                                                   {!isView && ( <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || "-"}</td>)}
                                                                   
                                                                </>
                                                            )}
                                                           
                                                             {!isView && (
                                                            <td>
                                                                {editRowIndex === i ? (
                                                                    <div className="d-flex">
                                                                        <button className="btn btn-success p-1 mx-1" onClick={handleSaveClick}><Save /></button>
                                                                        <button className="btn btn-secondary p-1" onClick={() => setEditRowIndex(null)}><X /></button>
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
                     ) :(<div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => navigate('/user/project-store/issue-return-management')}
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ViewMultiIssueAcc;
