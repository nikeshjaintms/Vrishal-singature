import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getMultipleIssueRequest } from "../../../../Store/MutipleDrawing/IssueRequest/MultipleIssueRequest";
import { getStockReportList } from "../../../../Store/Store/Stock/getStockReportList";
import { getUserIssueAcceptance } from "../../../../Store/Store/Issue/IssueAcceptance";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import PageHeader from "../Components/Breadcrumbs/PageHeader";
import { Dropdown } from "primereact/dropdown";
import moment from "moment";
import PaginationComponent from "../../Table/Pagination";
import { Check, Save, X } from "lucide-react";
import DropDown from "../../../../Components/DropDown";
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
  const [acc, setAcc] = useState({ reqId: "" });
  const data = location.state;
  const [issAcc, setIssAcc] = useState({});
  const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

  // Maintain a local mutable copy of stock to reflect in-session consumption
  const [localStock, setLocalStock] = useState([]);


  useEffect(() => {
    if (data) {
      setAcc({ reqId: location.state?._id });
    }
  }, [data]);

  useEffect(() => {
    dispatch(getMultipleIssueRequest({ limit, page: currentPage }));
    dispatch(getStockReportList());
    dispatch(getUserIssueAcceptance({ limit, page: currentPage }));
  }, [dispatch]);

  const issueReqData = useSelector(
    (state) => state.getMultipleIssueRequest?.user?.data?.items
  );

  const stockReportData = useSelector(
    (state) => state.getStockReportList?.user?.data
  );
  console.log(stockReportData,"stockReportDatastockReportData");
  const issueAccData = useSelector(
    (state) => state.getUserIssueAcceptance?.user?.data?.items
  );

  useEffect(() => {
    const filterDrawing = issueReqData?.find(
      (is) =>
        is?._id === data?._id &&
        is?.items?.map(
          (item) =>
            item.drawing_id.project?._id ===
            localStorage.getItem("U_PROJECT_ID")
        )
    );
    setIssAcc(filterDrawing || {});
    if (filterDrawing) {
      setTableData(filterDrawing?.items);
    }
  }, [acc.reqId, issueReqData, data]);

  const handleChange = (e, name) => {
    setAcc({ ...acc, [name]: e.value });
  };

  // Sync local stock when global stock loads/changes
  useEffect(() => {
    if (Array.isArray(stockReportData)) {
      // Create a shallow clone to avoid mutating redux state
      setLocalStock(stockReportData.map(s => ({ ...s })));
    } else {
      setLocalStock([]);
    }
  }, [stockReportData]);

  const handleAcceptRejectClick = (index, isAccepted, name) => {
    Swal.fire({
      title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
      text: "Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      dangerMode: !isAccepted,
    }).then((result) => {
      if (result.isConfirmed) {
        setAcceptRejectStatus((prev) => ({
          ...prev,
          [index]: isAccepted,
        }));
        toast.success(
          `${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`
        );
      }
    });
  };

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    requested_qty: "",
    requested_width: "",
    requested_length: "",
    imir_no: [],
    quantity: "",
    heat_no: [],
    remarks: "",
    itemId: "",
    is_accepted: "",
  });
const addImirNo = (newImir) => {
  setEditFormData(prevData => ({
    ...prevData,
    imir_no: [...prevData.imir_no, newImir], // Add newImir to the existing array
  }));
};
  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      requested_qty: row.requested_qty,
      requested_width: row.requested_width,
      requested_length: row.requested_length,
      imir_no: row.imir_no || "",
      quantity: row.quantity || "",
      heat_no: Array.isArray(row.heat_no) ? row.heat_no : (row.heat_no ? [row.heat_no] : []),
      remarks: row.remarks || "",
      is_accepted: "",
      itemId: row.grid_item_id.item_name._id,
    });
  };
const getUsedImirsForItem = (itemId, currentIndex) => {
  let usedImirs = [];

  tableData.forEach((row, idx) => {
    if (idx !== currentIndex && row.imir_no && row.grid_item_id.item_name._id === itemId) {
      const imirs = Array.isArray(row.imir_no) ? row.imir_no : [row.imir_no];
      usedImirs = [...usedImirs, ...imirs];
    }
  });

  return usedImirs;
};


  // const handleEditFormChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'imir_no') {
  //       const matchedTransaction = stockReportData.find(stock => stock.imir_no === value && stock.itemId === editFormData.itemId) || {};
  //       if (matchedTransaction) {
  //           setEditFormData({
  //               ...editFormData,
  //               [name]: value,
  //               // heat_no: matchedTransaction.accepted_lot_no || '',
  //               quantity: matchedTransaction.balance_qty || '',
  //               heat_no: "",
  //           });
  //       } else {
  //           setEditFormData({
  //               ...editFormData,
  //               [name]: value,
  //           });
  //       }
  //   }
  //   // if (name === "imir_no") {
  //   //   const selectedImirs = Array.isArray(value) ? value : [value]; // Ensure it's always an array
  //   //   setEditFormData({
  //   //     ...editFormData,
  //   //     [name]: selectedImirs, // Store the array of selected IMIRs
  //   //     heat_no: "", // Clear or handle differently for multi-select 
  //   //     quantity: selectedImirs.balance_qty || '',
  //   //   });
  //   // } else {
  //   //   setEditFormData({
  //   //     ...editFormData,
  //   //     [name]: value,
  //   //   });
  //   // }
  // };


  const handleEditFormChange = (e) => {
  const { name, value } = e.target;

  if (name === "imir_no") {
    const selectedImirs = Array.isArray(value) ? value : [value];

    // // Filter stock records for selected IMIRs and matching item ID
    // const matchedStocks = stockReportData?.filter(
    //   (stock) =>
    //     selectedImirs.includes(stock.imir_no) &&
    //     stock.itemId === editFormData.itemId
    // );

    // // Calculate total quantity (balance_qty sum)
    // const totalQty = matchedStocks?.reduce(
    //   (sum, stock) => sum + (stock.balance_qty || 0),
    //   0
    // );

const matchedStocks = localStock?.filter(
  (stock) =>
    selectedImirs.includes(stock.imir_no) &&
    stock.itemId === editFormData.itemId
);

const totalQty = matchedStocks?.reduce(
  (sum, stock) => sum + (stock.balance_qty || 0),
  0
);



    setEditFormData({
      ...editFormData,
      imir_no: selectedImirs,        // Store array of IMIR numbers
      quantity: totalQty || "",      // Total available quantity
      heat_no: [],                   // Reset heat_no on IMIR change
    });
  } else {
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }
};



  const handleSaveClick = () => {
    const updatedData = [...tableData];
    let isValid = true;

    if (!isValid) return;
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = {
      ...updatedData[dataIndex],
      ...editFormData,
      is_accepted: acceptRejectStatus[editRowIndex],
    };
    setTableData(updatedData);
    setEditRowIndex(null);

    // After saving, subtract issued quantity from local stock for the selected IMIRs,
    // consuming the least available balances first.
    try {
      const savedRow = updatedData[dataIndex];
      const selectedImirs = Array.isArray(savedRow?.imir_no) ? savedRow.imir_no : (savedRow?.imir_no ? [savedRow.imir_no] : []);
      const itemId = savedRow?.grid_item_id?.item_name?._id || editFormData.itemId;

      // Determine the issued quantity in KG for this row
      // Prefer multiply_iss_qty if present; fallback to used_grid_qty * assembly_weight
      const issuedQty =
        Number(savedRow?.multiply_iss_qty) ||
        Number(savedRow?.used_grid_qty) * Number(savedRow?.grid_item_id?.assembly_weight) ||
        0;

      if (issuedQty > 0 && selectedImirs.length > 0 && itemId) {
        setLocalStock(prev => {
          if (!Array.isArray(prev) || prev.length === 0) return prev;
          // Build a working copy
          const next = prev.map(s => ({ ...s }));
          // Collect stocks for the selected IMIRs and item
          const candidateIdxs = next
            .map((s, idx) => ({ s, idx }))
            .filter(({ s }) => selectedImirs.includes(s.imir_no) && s.itemId === itemId && Number(s.balance_qty) > 0);

          // Sort by least available first
          candidateIdxs.sort((a, b) => Number(a.s.balance_qty) - Number(b.s.balance_qty));

          let remaining = issuedQty;
          for (const { s, idx } of candidateIdxs) {
            if (remaining <= 0) break;
            const available = Number(s.balance_qty) || 0;
            if (available <= 0) continue;
            const consume = Math.min(available, remaining);
            next[idx].balance_qty = Number(available - consume);
            remaining -= consume;
          }
          return next;
        });
      }
    } catch (e) {
      // no-op; do not block save if stock adjustment fails
    }
  };



  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const commentsData = useMemo(() => {
    // let computedComments = tableData;
       let computedComments = Array.isArray(tableData) ? [...tableData] : [];
    // if (search) {
    //   computedComments = computedComments.filter(
    //     (i) =>
    //       i?.drawing_id?.drawing_no
    //         ?.toLowerCase()
    //         ?.includes(search?.toLowerCase()) ||
    //       i?.drawing_id?.assembly_no
    //         ?.toLowerCase()
    //         ?.includes(search?.toLowerCase()) ||
    //       i?.transaction_id?.itemName?.name
    //         ?.toLowerCase()
    //         ?.includes(search?.toLowerCase()) ||
    //       i?.transaction_id?.item_no
    //         ?.toLowerCase()
    //         ?.includes(search?.toLowerCase()) ||
    //       i?.transaction_id?.grid_no
    //         ?.toLowerCase()
    //         ?.includes(search?.toLowerCase())
    //   );
    // }
    setTotalItems(computedComments?.length);
    // return computedComments?.slice(
    //     (currentPage - 1) * limit,
    //     (currentPage - 1) * limit + limit
    // );
    return computedComments;
  }, [currentPage, search, limit, tableData]);

  const handleSubmit = () => {
    if (validation()) {
      let updatedData = tableData;
      let isValid = true;
      let err = {};
      updatedData?.forEach((item) => {
        // const stockItem = stockReportData?.find(
        //   (stock) =>
        //     stock.imir_no === item.imir_no &&
        //     stock.itemId === item?.grid_item_id?.item_name?._id
        // );
        const stockItem = stockReportData?.find(
  (st) =>
    editFormData.imir_no?.includes(st?.imir_no) &&
    st.itemId === editFormData.itemId
);


        const availableStock =
          item?.grid_item_id?.assembly_weight * item?.used_grid_qty;

        if (!item.imir_no || !stockItem) {
          isValid = false;
          toast.error(
            `Please select IMIR No. for ${item?.grid_item_id?.item_name?.name}`
          );
        }
        //  else if (availableStock > (stockItem?.balance_qty || 0)) {
        //   isValid = false;
        //   toast.error(
        //     `Requested quantity ${availableStock} for ${item?.grid_item_id?.item_name?.name} exceeds available stock (${stockItem.balance_qty}).`
        //   );
        // }
        

        if (item.is_accepted === "") {
          isValid = false;
          toast.error(
            `Please accept or reject for ${item?.grid_item_id?.item_name?.name}`
          );
        }
      });

      if (!isValid) {
        setError(err);
        return;
      }

      const filteredData = updatedData?.map((item) => ({
        grid_item_id: item?.grid_item_id?._id,
        drawing_id: item.drawing_id?._id,
        // item_assembly_weight: item?.grid_item_id?.assembly_weight * item?.grid_item_id?.grid_id?.grid_qty,
        item_assembly_weight: item?.multiply_iss_qty,
        issued_qty: item.requested_qty,
        multiply_iss_qty: item.multiply_iss_qty,
        issued_length: item.requested_length,
        issued_width: item.requested_width,
        is_accepted: item.is_accepted,
        iss_balance_grid_qty: item.balance_grid_qty,
        iss_used_grid_qty: item.used_grid_qty,
        imir_no: item.imir_no,
        heat_no: item.heat_no,
        remarks: item.remarks || "",
      }));

      setDisable(true);
      const myurl = `${V_URL}/user/manage-multi-issue-acceptance`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("issue_req_id", acc.reqId);
      bodyFormData.append("items", JSON.stringify(filteredData));
      bodyFormData.append("issued_by", localStorage.getItem("PAY_USER_ID"));
      bodyFormData.append(
        "project",
        localStorage.getItem("PAY_USER_PROJECT_NAME")
      );
      bodyFormData.append("isFd", data?.isFd);
      axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      })
        .then((response) => {
        
          if (response.data.success === true) {
            toast.success(response.data.message);
            navigate("/user/project-store/issue-management");
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
        })
        .finally(() => {
          setDisable(false);
        });
    }
  };

  const validation = () => {
    var isValid = true;
    let err = {};
    if (!acc.reqId) {
      isValid = false;
      err["reqId_err"] = "Please select issue request no";
    }
    setError(err);
    return isValid;
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const issueReqOptions = issueReqData?.map((e) => ({
    label: e?.issue_req_no,
    value: e?._id,
  }));

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              {
                name: "Dashboard",
                link: "/user/project-store/dashboard",
                active: false,
              },
              {
                name: "Issue Acceptance List",
                link: "/user/project-store/issue-management",
                active: false,
              },
              { name: "Issue Acceptance", active: true },
            ]}
          />

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Issue Acceptance List</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="staff-search-table">
                    <form>
                      <div className="row">
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="input-block local-forms custom-select-wpr">
                            <label>
                              Iusse Request No.{" "}
                              <span className="login-danger">*</span>
                            </label>
                            <Dropdown
                              options={issueReqOptions}
                              value={acc.reqId}
                              name="reqId"
                              onChange={(e) => handleChange(e, "reqId")}
                              filter
                              className="w-100"
                              placeholder="Select Issue Request"
                              disabled={data?._id}
                            />
                            <div className="error">{error?.reqId_err}</div>
                          </div>
                        </div>

                        {acc.reqId ? (
                          <>
                            <div className="col-12 col-md-3 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Issue Requested By</label>
                                <input
                                  className="form-control"
                                  value={issAcc.requested_by?.user_name}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div className="col-12 col-md-3 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Issue Requested Date</label>
                                <input
                                  className="form-control"
                                  value={moment(issueAccData?.createdAt).format(
                                    "YYYY-MM-DD"
                                  )}
                                  readOnly
                                />
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {acc.reqId ? (
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
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }}
                                  />
                                  <a className="btn">
                                    <img
                                      src="/assets/img/icons/search-normal.svg"
                                      alt="search"
                                    />
                                  </a>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive mt-2">
                      <table className="table border-0 custom-table comman-table  mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Drawing No.</th>
                            <th>Rev</th>
                            <th>Assem. No.</th>
                            <th>Assem. Qty.</th>
                            <th>Gri. No.</th>
                            <th>Gri. Qty.</th>
                            <th>Gri. Bal. Qty.</th>
                            <th>Gri. Use Qty.</th>
                            <th>Section Details</th>
                            <th>Iss. Qty.(KG)</th>
                            <th>Item Qty.(NOS)</th>
                            <th>Item Width(MM)</th>
                            <th>Item Length(MM)</th>
                            <th>Assem. Weight(kg)</th>
                            <th>Imir No.</th>
                            <th>Heat No.</th>
                            <th>Stock Bal. Qty.(kg)</th>
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
                              <td>{elem?.drawing_id?.drawing_no}</td>
                              <td>{elem?.drawing_id?.rev}</td>
                              <td>{elem?.drawing_id?.assembly_no}</td>
                              <td>{elem?.drawing_id?.assembly_quantity}</td>
                              <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                              <td>{elem?.grid_item_id?.grid_id?.grid_qty}</td>
                              <td>{elem?.balance_grid_qty}</td>
                              <td>{elem?.used_grid_qty}</td>
                              <td>{elem?.grid_item_id?.item_name?.name}</td>
                              <td>{elem?.multiply_iss_qty}</td>
                              {editRowIndex === i ? (
                                <>
                                  <td>
                                    <input
                                      className="form-control"
                                      type="number"
                                      name="requested_qty"
                                      value={editFormData.requested_qty}
                                      onChange={handleEditFormChange}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      type="number"
                                      name="requested_width"
                                      value={editFormData.requested_width}
                                      onChange={handleEditFormChange}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      className="form-control"
                                      type="number"
                                      name="requested_length"
                                      value={editFormData.requested_length}
                                      onChange={handleEditFormChange}
                                    />
                                  </td>
                                  <td>
                                    {elem?.used_grid_qty *
                                      elem?.grid_item_id?.assembly_weight}
                                  </td>
                                  <td>
                                    {/* IMIR multi-select uses localStock to reflect in-session consumption */}

<MultiSelect
        className="form-control w-100"
        name="imir_no"
        value={editFormData.imir_no || []} // Ensure value is an array
        options={
            localStock
            ?.filter((st) => st.itemId === elem?.grid_item_id?.item_name?._id && st.balance_qty > 0)
            ?.map((e) => ({
                label: e.imir_no,
                value: e.imir_no
            }))
        }
        onChange={(e) => handleEditFormChange({ target: { name: 'imir_no', value: e.value } })} // e.value for MultiSelect
        placeholder="Select IMIR No."
       
    />


    

    
                                  </td>

                                  {/* <td>{editFormData.heat_no || '-'}</td> */}
                                  <td>
                                    <MultiSelect
                                      className="form-control w-100"
                                      name="heat_no"
                                      value={editFormData.heat_no || []}
                                      options={
                                        (() => {
                                          // Aggregate heat options from all selected IMIRs for this item
                                          const selectedImirs = Array.isArray(editFormData?.imir_no) ? editFormData.imir_no : [];
                                          const itemId = editFormData.itemId;
                                          const heats = [];
                                          const seen = new Set();
                                          localStock
                                            ?.filter((st) => selectedImirs.includes(st?.imir_no) && st.itemId === itemId)
                                            ?.forEach((st) => {
                                              st?.heat_no_data?.forEach((h) => {
                                                if (h?.heat_no && !seen.has(h.heat_no)) {
                                                  seen.add(h.heat_no);
                                                  heats.push({ label: h.heat_no, value: h.heat_no });
                                                }
                                              });
                                            });
                                          return heats;
                                        })()
                                      }
                                      onChange={(e) => handleEditFormChange({ target: { name: 'heat_no', value: e.value } })}
                                      placeholder="Select Heat No."
                                    />
                                  </td>
                                  <td>{editFormData.quantity || "-"}</td>
                                  <td>
                                    <textarea
                                      className="form-control"
                                      name="remarks"
                                      rows={1}
                                      value={editFormData.remarks}
                                      onChange={handleEditFormChange}
                                    />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {elem?.requested_qty}
                                  </td>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {elem?.requested_width}
                                  </td>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {elem?.requested_length}
                                  </td>
                                  <td>
                                    {elem?.used_grid_qty *
                                      elem?.grid_item_id?.assembly_weight}
                                  </td>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {elem?.imir_no || "-"}
                                  </td>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {Array.isArray(elem?.heat_no) ? (elem.heat_no.join(", ") || "-") : (elem?.heat_no || "-")}
                                  </td>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {elem?.quantity || "-"}
                                  </td>
                                  <td onClick={() => handleEditClick(i, elem)}>
                                    {elem?.remarks || "-"}
                                  </td>
                                </>
                              )}
                              {editRowIndex === i ? (
                                <td className="">
                                  <div className="d-flex gap-2">
                                    <span
                                      className={`present-table attent-status ${
                                        acceptRejectStatus[i] === true
                                          ? "selected"
                                          : ""
                                      }`}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleAcceptRejectClick(
                                          i,
                                          true,
                                          elem?.grid_item_id?.item_name?.name
                                        )
                                      }
                                    >
                                      <Check />
                                    </span>
                                    <span
                                      className={`absent-table attent-status ${
                                        acceptRejectStatus[i] === false
                                          ? "selected"
                                          : ""
                                      }`}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        handleAcceptRejectClick(
                                          i,
                                          false,
                                          elem?.grid_item_id?.item_name?.name
                                        )
                                      }
                                    >
                                      <X />
                                    </span>
                                  </div>
                                </td>
                              ) : (
                                <>-</>
                              )}
                              <td className="status-badge">
                                {acceptRejectStatus[i] === true ? (
                                  <span className="custom-badge status-green">
                                    Acc
                                  </span>
                                ) : acceptRejectStatus[i] === false ? (
                                  <span className="custom-badge status-pink">
                                    Rej
                                  </span>
                                ) : (
                                  <span className="">-</span>
                                )}
                              </td>
                              {editRowIndex === i ? (
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-success p-1 mx-1"
                                    onClick={handleSaveClick}
                                  >
                                    <Save />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary p-1 mx-1"
                                    onClick={handleCancelClick}
                                  >
                                    <X />
                                  </button>
                                </td>
                              ) : (
                                <td>-</td>
                              )}
                            </tr>
                          ))}

                          {commentsData?.length === 0 ? (
                            <tr>
                              <td colSpan="999">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                    {/* <div className="row align-center mt-3 mb-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <PaginationComponent
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        onPageChange={(page) => setCurrentPage(page)}
                                                    />
                                                </div>
                                            </div>
                                        </div> */}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <SubmitButton
            disable={disable}
            handleSubmit={handleSubmit}
            buttonName={"Generate Issue Acceptance"}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MultiIssueAcceptance;
