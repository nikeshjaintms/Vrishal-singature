
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { getUserAdminDraw } from "../../../../Store/Erp/Planner/Draw/UserAdminDraw";
import { getUserContractor } from "../../../../Store/Store/ContractorMaster/ContractorMaster";
// import { getStockReportList } from "../../../../Store/Store/Stock/getStockReportList";
import { getPipingStockReportList } from "../../../../Store/Piping/Stock/getPipingStockReportList";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";
import DrawingTable from "../Components/DrawingTable/DrawingTable";
import PageHeader from "../Components/Breadcrumbs/PageHeader";
import Footer from "../../Include/Footer";
import { V_URL } from "../../../../BaseUrl";
import axios from "axios";
import moment from "moment";
import { Pencil, Trash2 } from "lucide-react";
// import { getMultipleIssueRequest } from "../../../../Store/MutipleDrawing/IssueRequest/MultipleIssueRequest";
import SubmitButton from "../Components/SubmitButton/SubmitButton";
import { updateMultiGrid } from "../../../../Store/MutipleDrawing/MultipleDrawing/UpdateGridBal";
// import { getMultipleGrid } from "../../../../Store/MutipleDrawing/MultipleDrawing/MultipleGrid";
import { clearDrawingSpoolItems,getDrawingSpool } from "../../../../Store/Piping/Drawing/getDrawingSpool";
import { updateIssueOffTable } from "../../../../Store/MutipleDrawing/IssueRequest/updateIssueOfferTable";
import CompleteDrawingTable from "../Components/CompletedDrawingTable/CompleteDrawingTable";
import { clearMaterialEntryForIssueRequestItems,getMaterialEntryItemsForIssueRequest } from "../../../../Store/Piping/IssueRequest/getMaterialIssueItemsForIssueRequest";
import { clearIssueOfferItems,getIssueOfferTablePiping } from "../../../../Store/Piping/IssueRequest/getIssueOfferTable";


const MultiIssueRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [entity, setEntity] = useState([]);
  const [issueRequest, setIssueRequest] = useState({ name: "" });
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [search, setSearch] = useState("");
  const [issueArr, setIssueArr] = useState([]);
  const [disable, setDisable] = useState(false);
  const [finalReq, setFinalReq] = useState([]);
  const data = location.state;
  const [showItem, setShowItem] = useState(false);
  const [viewCompletedDrawing, setViewCompletedDrawing] = useState(false);
  const [requiredCountMap, setRequiredCountMap] = useState({});

  const [drawId, setDrawId] = useState(null);
  // const [isFitUP, setIsFitUp] = useState(null);
  // const [isPainting, setIsPainting] = useState(null);
  // const [isDispatch, setIsDispatch] = useState(null);
const [procedure, setProcedure] = useState(null);

const [drIds, setDrIds] = useState([]);

const [selectedDrawing, setSelectedDrawing] = useState(null);
const [materialList, setMaterialList] = useState([]);


  // useEffect(() => {
  //   if (location.state?._id) {
  //     setIssueRequest({
  //       name: data?.items[0]?.drawing_id?.issued_person?._id,
  //     });
  //     setFinalReq(data?.items);
  //     setIsFitUp(data?.isFitUp);
  //     setIsPainting(data?.isPainting);
  //     setIsDispatch(data?.isDispatch);
  //   }
  // }, [location.state]);

  useEffect(() => {
  if (location.state?._id) {
    setIssueRequest({
      name: data?.items?.[0]?.drawing_id?.issued_person?._id || "",
    });

    if (data?.isFitUp) setProcedure("fitup");
    else if (data?.isPainting) setProcedure("painting");
    else if (data?.isDispatch) setProcedure("dispatch");

    setFinalReq(data?.items || []);
  }
}, [location.state]);


  useEffect(() => {
    // dispatch(getUserAdminDraw());
    dispatch(getUserContractor({ status: true , project_id: localStorage.getItem("U_PROJECT_ID") }));
    // dispatch(getMultipleIssueRequest());
    dispatch(getPipingStockReportList());
    // dispatch(getMultipleGrid({ drawing_id: "" }));
    // dispatch(getIssueOfferTablePiping({ contractor_id: issueRequest.name }));
  }, []);

  const project_id = localStorage.getItem('U_PROJECT_ID');
  useEffect(() => {
    if (issueRequest.name) {
      dispatch(getDrawingSpool({ contractor_id: issueRequest.name, project_id }));
    }
     return () => {
      dispatch(clearDrawingSpoolItems());
    };
  }, [issueRequest.name, dispatch]);

  useEffect(() => {
  if (issueRequest.name) {
    dispatch(getIssueOfferTablePiping({ contractor_id: issueRequest.name, project_id }));
  }
    return () => {
      dispatch(clearIssueOfferItems());
    };
}, [issueRequest.name, dispatch]);


  const issueOffTableData = useSelector(
    (state) => state?.getDrawingSpool?.user?.data
  );
// console.log("issueOffTableData", issueOffTableData);
  const contractorData = useSelector(
    (state) => state.getUserContractor?.user?.data
  );
  // const drawData = useSelector((state) => state.getUserAdminDraw?.user?.data);
  const offerData = useSelector((state) => state?.getIssueOfferTablePiping?.user?.data);

  // Stock data: API returns { data: { data: [...] } }
  const stockListData = useSelector((state) => state?.getPipingStockReportList?.user?.data?.data || []);

  // Build a map: itemId → total available stock_qty (sum across all batches)
  const stockQtyMap = useMemo(() => {
    const map = {};
    (stockListData || []).forEach((s) => {
      const id = s.itemId;
      if (!id) return;
      map[id] = (map[id] || 0) + (s.stock_qty || 0);
    });
    return map;
  }, [stockListData]);

useEffect(() => {
  if (!offerData?.length) {
    setMaterialList([]);
    return;
  }


  // const list = offerData.flatMap(offer =>
     const list = offerData
    .filter(offer => offer.is_generate === false) // only take not generated offers
    .flatMap(offer =>
    (offer.manual_items || []).map(item => ({
      _id: item._id,
      offer_id: offer._id,
      report_no: offer.report_no,

      drawing_id: offer.drawing_id?._id || offer.drawing_id,
      drawing_no: offer.drawing_id?.drawing_no || "-",

      // item: item.item_id,               
      item: item.material_item_id?.item || item.item_id,
      qty: item.required_qty,
      extra_qty: item.extra_qty || 0,
      total_requested_qty: item.total_requested_qty,
      remarks: item.remarks || "",

      is_issue: item.is_issue,
      is_generate: offer.is_generate,
    }))
  );

  setMaterialList(list);
}, [offerData]);

  useEffect(() => {
    const filterData = issueOffTableData?.items?.filter(
      (it) => it?.is_issue === false
    );
    setIssueArr(filterData || []);
  }, [issueOffTableData]);

  // useEffect(() => {
  //   const filterDraw = drawData?.filter(
  //     (dr) =>
  //       dr.issued_person?._id === issueRequest.name &&
  //       dr?.project?._id === localStorage.getItem("U_PROJECT_ID")
  //   );
  //   setDrIds(filterDraw?.map((dr) => dr._id));
  //   setEntity(filterDraw);
  // }, [drawData, issueRequest.name]);

  // ============================================
  // MATERIAL ISSUED REQUEST LIST DATA (NEW)
  // ============================================

// const requestListData = useMemo(() => {
//   if (!issueOffTableData) return [];

//   // Convert single object → array
//   let rows = Array.isArray(issueOffTableData)
//     ? issueOffTableData
//     : [issueOffTableData];

//   if (search) {
//     const s = search.toLowerCase();
//     rows = rows.filter(
//       (dr) =>
//         dr?.drawing?.drawing_no?.toLowerCase().includes(s) ||
//         dr?.spool_no?.toLowerCase().includes(s)
//     );
//   }

//   setTotalItems(rows.length);
// // console.log("rows after search",rows);
//   return rows.slice(
//     (currentPage - 1) * limit,
//     (currentPage - 1) * limit + limit
//   );
// }, [issueOffTableData, search, currentPage, limit]);

const requestListData = useMemo(() => {
  if (!issueOffTableData) return [];

  let rows = Array.isArray(issueOffTableData)
    ? issueOffTableData
    : [issueOffTableData];

  // ✅ VIEW MODE → SHOW ONLY SUBMITTED DRAWINGS
  if (data?._id && data?.items?.length) {
    const submittedDrawingIds = data.items.map(
      it => it.drawing_id?._id || it.drawing_id
    );

    rows = rows.filter(row =>
      submittedDrawingIds.includes(row._id)
    );
    
  }

  // 🔍 Search filter
  if (search) {
    const s = search.toLowerCase();
    rows = rows.filter(
      dr =>
        dr?.drawing_no?.toLowerCase().includes(s) ||
        dr?.spool_no?.toLowerCase().includes(s)
    );
  }

  setTotalItems(rows.length);

  return rows.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );
}, [issueOffTableData, search, currentPage, limit, data]);


  // console.log("requestListData", requestListData);
  const handleChange = (e, name) => {
    setIssueRequest({ ...issueRequest, [name]: e.value });
  };



const handleAddToIssueArr = async (row) => {
     dispatch(clearMaterialEntryForIssueRequestItems());

  const response = await dispatch(
    getMaterialEntryItemsForIssueRequest({ drawing_id: row._id })
  );
console.log("response",response);
  if (!response?.payload?.success) return;
const allItems = response.payload.data;

  const itemsToSave = allItems
    .filter(m => m.balance_qty > 0)
    .map(m => ({
      material_item_id: m._id,          //  material entry item id  
      item_id: m.item._id,
      required_qty: m.qty,
      extra_qty: 0,
      total_requested_qty: m.qty,
      remarks: "",
      is_issue: true,      //   ADD STAGE
      is_generate: false
    }));

  // ✅ Store only available item count (balance_qty > 0), not total drawing items
  // This allows partial submission: if drawing has 19 items but only 5 are available,
  // we require exactly those 5 to be present in the offer table before submitting.
  setRequiredCountMap(prev => {
    if (prev[row._id]) return prev; // already stored
    return {
      ...prev,
      [row._id]: itemsToSave.length,
    };
  });

  if (!itemsToSave.length) {
    toast.success("No items to add");
    return;
  }

  const body = new URLSearchParams();
  body.append("contractor_id", issueRequest.name);
  body.append("drawing_id", row._id);
  body.append("project_id",localStorage.getItem('U_PROJECT_ID'));
  body.append("manual_items", JSON.stringify(itemsToSave));

  const res = await axios.post(
    `${V_URL}/user/manage-issue-offer-table-piping`,
    body,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (res.data.success) {
    toast.success("Items added to offer table");

    // refresh offer table
    dispatch(getIssueOfferTablePiping({ contractor_id: issueRequest.name, project_id }));
    dispatch(getDrawingSpool({ contractor_id: issueRequest.name, project_id }));
      dispatch(clearMaterialEntryForIssueRequestItems());
  }
};

  const handleCompletedDrawing = () => {
    setViewCompletedDrawing(!viewCompletedDrawing);
  };

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    item_qty: "",
    item_length: "",
    item_width: "",
    remarks: "",
  });


  const handleEditClick = (index, elem) => {
  setEditRowIndex(index);
  setEditFormData({
    extra_qty: elem.extra_qty ?? 0,
    remarks: elem.remarks ?? "",
  });
};


  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };



const handleSaveMaterialRow = async (index) => {
  const row = materialList[index];

  if (!row?.drawing_id) {
    toast.error("Drawing information missing");
    return;
  }

  const updated = [...materialList];

  updated[index] = {
    ...updated[index],
    extra_qty: Number(editFormData.extra_qty) || 0,
    remarks: editFormData.remarks || "",
  };

  updated[index].total_requested_qty =
    (Number(updated[index].qty) || 0) +
    (Number(updated[index].extra_qty) || 0);

  const manual_items = [{
     _id: row._id,
    item_id: row.item._id,
    required_qty: Number(updated[index].qty) || 0,
    extra_qty: Number(updated[index].extra_qty) || 0,
    total_requested_qty: updated[index].total_requested_qty,
    remarks: updated[index].remarks,
    is_issue: true,
  }];

  const body = new URLSearchParams();
  body.append("offer_id", row.offer_id);
  body.append("contractor_id", issueRequest.name);
  body.append("drawing_id", row.drawing_id);
  body.append("manual_items", JSON.stringify(manual_items));
  body.append("items", JSON.stringify([]));

  try {
    const res = await axios.post(
      `${V_URL}/user/manage-issue-offer-table-piping`,
      body,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data.success) {
      toast.success("Row saved successfully");

      updated[index].is_issue = true;
      setMaterialList(updated);
      setEditRowIndex(null);

      dispatch(getIssueOfferTablePiping({ contractor_id: issueRequest.name , project_id }));
      dispatch(getDrawingSpool({ contractor_id: issueRequest.name, project_id }));
    } else {
      toast.error(res.data.message || "Failed to save row");
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
};

const handleRemoveMaterialRow = async (index) => {
  const row = materialList[index];
  const drawingId = row.drawing_id;
  // Row not saved in DB yet → remove locally
  if (!row?._id) {
    setMaterialList(prev => prev.filter((_, i) => i !== index));
    toast.success("Row removed");
    return;
  }

  // Row exists in DB but already issued → cannot delete
  if (row.is_generate) {
    toast.error("Cannot delete. Item already issued/generated.");
    return;
  }

  // Row exists in DB and not issued → call API
  try {
    const res = await axios.delete(`${V_URL}/user/delete-issue-offer-table-piping`, {
      data: {
        contractor_id: issueRequest.name,
        // drawing_id: selectedDrawing._id,
        drawing_id: row.drawing_id,
        item_id: row.item._id,
      },
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });

    if (res.data.success) {
      toast.success(res.data.message || "Item deleted successfully");
      // setMaterialList(prev => prev.filter((_, i) => i !== index));

      const updatedList = materialList.filter((_, i) => i !== index);
      setMaterialList(updatedList);

      // ✅ CHECK IF DRAWING STILL HAS ITEMS
      const stillExists = updatedList.some(
        i => i.drawing_id === drawingId
      );

      // ✅ IF NOT → REMOVE FROM requiredCountMap
      if (!stillExists) {
        setRequiredCountMap(prev => {
          const copy = { ...prev };
          delete copy[drawingId];
          return copy;
        });
      }

      dispatch(getIssueOfferTablePiping({ contractor_id: issueRequest.name,project_id }));
      dispatch(getDrawingSpool({ contractor_id: issueRequest.name, project_id }));
    } else {
      toast.error(res.data.message || "Delete failed");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};


  const handleCancelClick = () => {
    setEditRowIndex(null);
  };



const handleStatusChange = (e) => {
  setProcedure(e.target.value);
};

  // const getDrawing = (drawId) => {
  //   return drawData?.find((dr) => dr?._id === drawId);
  // };

//old issue_ofeer_id code
// const handleSubmit = async () => {
//   console.log("offerData at submit", offerData);
//   if (!issueRequest.name) {
//     toast.error("Please select a issued person / contractor");
//     return;
//   }

//   if (!selectedDrawing) {
//     toast.error("Please select a drawing to issue");
//     return;
//   }
// const drawingOffers = offerData.filter(o =>
//   (o.drawing_id?._id || o.drawing_id) === selectedDrawing._id
// );

// console.log("drawingOffers at submit", drawingOffers);

// const validOffer = drawingOffers.filter(o => o.is_generate === false);
// console.log("validOfferItems at submit", validOffer.length);


//   setDisable(true);

//   try {

// const itemsToSend = validOffer.flatMap(offer =>
//   (offer.manual_items || []).map(m => ({
//     item_id: m.item_id,
//     issue_offer_id: offer._id,
//     drawing_id: selectedDrawing._id,
//     required_qty: m.required_qty || 0,
//     extra_qty: m.extra_qty || 0,
//     total_requested_qty:
//       m.total_requested_qty ??
//       ((m.required_qty || 0) + (m.extra_qty || 0)),
//     remarks: m.remarks || "",
//     contractorId: issueRequest.name,
//     is_issue: true,
//     report_no: offer.report_no,
//   }))
// );

// if (!itemsToSend.length) {
//   toast.error("Please save items in offer table first");
//   return;
// }


//     console.log("items to submit", itemsToSend);
//     const body = new URLSearchParams();
//     body.append("project", localStorage.getItem("U_PROJECT_ID"));
//     body.append("drawing_id", selectedDrawing._id);
//     body.append("report_no", selectedDrawing?.report_no || "");
//     body.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
//     body.append("requested_by", localStorage.getItem("PAY_USER_ID"));
//     // body.append("isFitUp", isFitUP === true);
//     // body.append("isFitUp", isFitUP === "fitup");
//     // body.append("isPainting", isPainting === "painting");
//     // body.append("isDispatch", isDispatch === "dispatch");
//     body.append("isFitUp", procedure === "fitup");
// body.append("isPainting", procedure === "painting");
// body.append("isDispatch", procedure === "dispatch");

//     body.append("items", JSON.stringify(itemsToSend));

//     if (data?._id) body.append("id", data._id); // update mode

//     const res = await axios.post(`${V_URL}/user/manage-piping-issue-request`, body, {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     if (res.data.success) {
//       toast.success("Saved Successfully");
//       // refresh offer table (now is_generate = true)
//     await dispatch(getIssueOfferTablePiping({ contractor_id: issueRequest.name }));

//       setMaterialList([]);
//       setFinalReq([]);
//       setSelectedDrawing(null);
//       navigate("/piping/user/issue-request-management");
//     } else {
//       toast.error(res.data.message || "Failed to save");
//     }

//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Something went wrong");
//   } finally {
//     setDisable(false);
//   }
// };

const getRequiredItemCountPerDrawing = async (drawingIds) => {
  const drawingItemCount = {};

  for (const drawingId of drawingIds) {
    const res = await dispatch(
      getMaterialEntryItemsForIssueRequest({ drawing_id: drawingId })
    );

    if (res?.payload?.success) {
      // ✅ COUNT ALL ITEMS, NOT balance_qty
      drawingItemCount[drawingId] = res.payload.data.length;
    }
  }

  console.log("drawingItemCount",drawingItemCount);
  return drawingItemCount;

};


console.log("getRequiredItemCountPerDrawing",getRequiredItemCountPerDrawing);
const validateDrawingItemsByStoredCount = (offerData) => {
  const issuedCountMap = {};

  offerData
    .filter(o => o.is_generate === false)
    .forEach(offer => {
      const drawingId =
        typeof offer.drawing_id === "object"
          ? offer.drawing_id._id
          : offer.drawing_id;

      if (!issuedCountMap[drawingId]) {
        issuedCountMap[drawingId] = 0;
      }

      issuedCountMap[drawingId] += (offer.manual_items || []).length;
    });

  const errors = [];

  for (const drawingId in requiredCountMap) {
    const required = requiredCountMap[drawingId];
    const issued = issuedCountMap[drawingId] || 0;

    if (issued !== required) {
      errors.push({
        drawingId,
        required,
        issued,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};



const handleSubmit = async () => {
  console.log("offerData at submit", offerData);

  if (!procedure) {
    toast.error("Please select at least one procedure (Fit-Up / Painting / Dispatch)");
    return;
  }

  if (!issueRequest.name) {
    toast.error("Please select a issued person / contractor");
    return;
  }

  // ✅ TAKE ALL NON-GENERATED OFFERS
  const validOffers = offerData.filter(o => o.is_generate === false);

  if (!validOffers.length) {
    toast.error("No pending items to issue");
    return;
  }

  // ℹ️ Validation removed: requiredCountMap is session-only state.
  // If items were added in a previous session or page was refreshed,
  // the stored count would be stale/wrong and would incorrectly block submission.
  // Business rule: submit whatever available items (balance_qty > 0) are in the offer table.

  // ✅ STOCK AVAILABILITY CHECK — block if any item has stock shortage
  // const outOfStockItems = materialList.filter(m => {
  //   const itemId = m?.item?._id;
  //   const requested = (Number(m.qty) || 0) + (Number(m.extra_qty) || 0);
  //   return !itemId || (stockQtyMap[itemId] ?? 0) < requested;
  // });

  // if (outOfStockItems.length > 0) {
  //   const messages = outOfStockItems
  //     .map(m => {
  //       const avail = stockQtyMap[m?.item?._id] ?? 0;
  //       const req = (Number(m.qty) || 0) + (Number(m.extra_qty) || 0);
  //       return `${m?.item?.item_name || "Unknown Item"} (Required: ${req}, Available: ${avail})`;
  //     })
  //     .join(", ");
  //   toast.error(`Stock shortage for items: ${messages}. Cannot generate issue request.`);
  //   return;
  // }


  // ✅ ONLY AFTER VALIDATION
  setDisable(true);

  try {
    // ✅ COLLECT ALL ITEMS FROM ALL DRAWINGS
    // const itemsToSend = validOffers.flatMap(offer =>
    //   (offer.manual_items || []).map(m => ({
    //     item_id: m.item_id,
    //     material_item_id: m.material_item_id,
    //     issue_offer_id: offer._id,            // ✅ IMPORTANT
    //     drawing_id: offer.drawing_id?._id || offer.drawing_id,
    //     required_qty: m.required_qty || 0,
    //     extra_qty: m.extra_qty || 0,
    //     total_requested_qty:
    //       m.total_requested_qty ??
    //       ((m.required_qty || 0) + (m.extra_qty || 0)),
    //     remarks: m.remarks || "",
    //     contractorId: issueRequest.name,
    //     is_issue: true,
    //     report_no: offer.report_no,
    //   }))
    // );
const itemsToSend = validOffers.flatMap(offer =>
  (offer.manual_items || []).map(m => {
    const drawingId = typeof offer.drawing_id === "object" ? offer.drawing_id._id : offer.drawing_id;
    return {
      item_id: m.item_id,
      material_item_id: m.material_item_id,
      issue_offer_id: offer._id,
      drawing_id: drawingId, // always string
      required_qty: m.required_qty || 0,
      extra_qty: m.extra_qty || 0,
      total_requested_qty: m.total_requested_qty ?? ((m.required_qty || 0) + (m.extra_qty || 0)),
      remarks: m.remarks || "",
      contractorId: issueRequest.name,
      is_issue: true,
      report_no: offer.report_no,
    };
  })
);
    if (!itemsToSend.length) {
      toast.error("Please save items in offer table first");
      return;
    }

    console.log("items to submit", itemsToSend);

    const body = new URLSearchParams();
    body.append("project", localStorage.getItem("U_PROJECT_ID"));
    body.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
    body.append("requested_by", localStorage.getItem("PAY_USER_ID"));
    body.append("isFitUp", procedure === "fitup");
    body.append("isPainting", procedure === "painting");
    body.append("isDispatch", procedure === "dispatch");
    body.append("items", JSON.stringify(itemsToSend));

    if (data?._id) body.append("id", data._id);

    const res = await axios.post(
      `${V_URL}/user/manage-piping-issue-request`,
      body,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data.success) {
      toast.success("Issue Request Generated Successfully");

        // 🔥 CLEAR ALL LOCAL STATE
  setMaterialList([]);
  setFinalReq([]);
  setSelectedDrawing(null);
  setIssueArr([]);
  setEditRowIndex(null);



      await dispatch(
        getIssueOfferTablePiping({ contractor_id: issueRequest.name,project_id })
      );

      // setMaterialList([]);
      // setFinalReq([]);
      // setSelectedDrawing(null);
      // navigate("/piping/user/issue-request-management");
      navigate("/piping/user/issue-request-management", { replace: true });

    } else {
      toast.error(res.data.message || "Failed to save");
    }

  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setDisable(false);
  }
};


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const conOptions = contractorData?.map((e) => ({
    label: e?.name,
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
                link: "/piping/user/dashboard",
                active: false,
              },
              {
                name: "Issue Request List",
                link: "/piping/user/issue-request-management",
                active: false,
              },
              { name: "Add Issue Request", active: true },
            ]}
          />

          {/* Contractor Selection */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="staff-search-table">
                    <div className="row d-flex align-items-center justify-content-between">
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Issued Person / Contractor Name</label>
                          <Dropdown
                            options={conOptions}
                            value={issueRequest.name}
                            onChange={(e) => handleChange(e, "name")}
                            filter
                            className="w-100"
                            placeholder="Select Contractor"
                            disabled={data?._id}
                          />
                        </div>
                      </div>

                      {/* <div className="col-12 col-md-6 col-xl-6">
                        <button
                          className="btn btn-primary mx-2"
                          type="button"
                          onClick={handleCompletedDrawing}
                        >
                          {viewCompletedDrawing
                            ? "Hide Completed Drawing List"
                            : "View Completed Drawing List"}
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
 {!data?._id && (
  <>
          {/* MATERIAL ISSUED REQUEST LIST */}
          <DrawingTable
            tableTitle="Material Issued Request List"
            commentsData={requestListData}
            handleAddToIssueArr={handleAddToIssueArr}
            currentPage={currentPage}
            limit={limit}
            setlimit={setlimit}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
            setSearch={setSearch}
            data={data}
          />
          </>
 )}

            <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Item List</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {finalReq?.length === 0 && !data?._id && data === null ? (
                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table  mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Drawing No.</th>
                            <th>Item Name</th>
                            <th>Item Description</th>
                            <th>Size1</th>
                            <th>Thickness1</th>
                            <th>Size2</th>
                            <th>Thickness2</th>
                            <th>Material Grade</th>
                            <th>UOM</th>
                            <th>Required Qty</th>
                            <th>Available Qty</th>
                            <th>Extra Qty</th>
                            <th>Total Requested Qty</th>
                            <th>Remarks</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                 <tbody>
  {materialList.length > 0 ? (
    materialList.map((elem, i) => {
      const isEditing = editRowIndex === i;

      return (
  

          <tr
  // key={i}
  key={elem._id}
  // key={`${elem.drawing_id}-${elem.item._id}`}
  onDoubleClick={() => handleEditClick(i, elem)}
>
          <td>{i + 1}</td>
          {/* <td>{selectedDrawing?.drawing_no || "-"}</td> */}
          <td>{elem.drawing_no}</td>

          <td>{elem?.item?.item_name || "-"}</td>
          <td>{elem?.item?.item_description || "-"}</td>
          <td>{elem?.item?.size1?.name || "-"}</td>
          <td>{elem?.item?.thickness1?.name || "-"}</td>
           <td>{elem?.item?.size2?.name || "-"}</td>
          <td>{elem?.item?.thickness2?.name || "-"}</td>
          <td>{elem?.item?.material_grade || "-"}</td>
          <td>{elem?.item?.uom?.name || "-"}</td>

          {/* Required Qty (read-only) */}
          <td>{elem.qty}</td>

          {/* Available Qty — sum of stock_qty for matching itemId */}
          <td>
            {(() => {
              const itemId = elem?.item?._id;
              const avail = itemId !== undefined ? (stockQtyMap[itemId] ?? 0) : "-";
              return <span style={{ color: avail <= 0 ? "red" : "green", fontWeight: 600 }}>{avail}</span>;
            })()}
          </td>

          {/* Extra Qty */}
          <td>
  {isEditing ? (
    <input
      type="number"
      name="extra_qty"
      className="form-control"
      value={editFormData.extra_qty}
      onChange={handleEditFormChange}
    />
  ) : (
    elem.extra_qty || 0
  )}
</td>

        


          {/* Total Qty */}
          <td>
            {isEditing
              ? (elem.qty || 0) + Number(editFormData.extra_qty)
              : (elem.qty || 0) + (elem.extra_qty || 0)}
          </td>

         
<td>
  {isEditing ? (
    <input
      type="text"
      name="remarks"
      className="form-control"
      value={editFormData.remarks}
      onChange={handleEditFormChange}
    />
  ) : (
    elem.remarks || "-"
  )}
</td>

          {/* Actions */}
          <td className="text-end">
            {isEditing ? (
              <>
                <button
                  className="btn btn-success btn-sm mx-1"
                  onClick={() => handleSaveMaterialRow(i)}
                >
                  <Save size={20} />
                </button>
               
                <button
  className="btn btn-secondary btn-sm mx-1"
  onClick={(e) => {
    e.stopPropagation();
    handleCancelClick();
  }}
>
  <X size={20} />
</button>

              </>
            ) : (
              <>
              
                                                                  <button
  className="action-icon mx-1"
  onClick={(e) => {
    e.stopPropagation();
    handleEditClick(i, elem);
  }}
>
  <Pencil />
</button>

                                                                  <button
                                                                      className="action-icon mx-1"
                                                                      onClick={() => handleRemoveMaterialRow(i)}
                                                                  >
                                                                      <Trash2 />
                                                                  </button>
         
              </>
            )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="999" className="text-center">
        Click Add to load items
      </td>
    </tr>
  )}
</tbody>



                      </table>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table  mb-0">
                        <thead>
                                   <tr>
                            <th>Sr.</th>
                            <th>Drawing No.</th>
                            <th>Item Name</th>
                            <th>Item Description</th>
                            <th>Size</th>
                            <th>Thickness</th>
                            <th>Material Grade</th>
                            <th>UOM</th>
                            <th>Required Qty</th>
                            <th>Extra Qty</th>
                            <th>Total Requested Qty</th>
                            <th>Remarks</th>
                        
                          </tr>
                        </thead>
                      <tbody>
  {finalReq?.map((elem, i) => (
    <tr key={i}>
      <td>{i + 1}</td>
      <td>{elem?.drawing_id?.drawing_no || "-"}</td>

<td>{elem?.material_item_id?.item?.item_name || "-"}</td>
<td>{elem?.material_item_id?.item?.item_description || "-"}</td>
<td>{elem?.material_item_id?.item?.size1?.name || "-"}</td>
<td>{elem?.material_item_id?.item?.thickness1?.name || "-"}</td>
<td>{elem?.material_item_id?.item?.material_grade || "-"}</td>
<td>{elem?.material_item_id?.item?.uom?.name || "-"}</td>

      <td>{elem?.required_qty || 0}</td>
      <td>{elem?.extra_qty || 0}</td>
      <td>{elem?.total_requested_qty || 0}</td>
      <td>{elem?.remarks || "-"}</td>
    </tr>
  ))}

  {finalReq?.length === 0 && (
    <tr>
      <td colSpan="999" className="text-center">
        No Data Found!
      </td>
    </tr>
  )}
</tbody>

                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SubmitButton
            finalReq={finalReq}
            disable={disable}
            handleSubmit={handleSubmit}
            link={"/piping/user/issue-request-management"}
            buttonName={"Generate Issue Request"}
            // isFitUP={isFitUP}
            // isPainting={isPainting}
            // isDispatch={isDispatch}
            procedure={procedure}
          
            handleStatusChange={handleStatusChange}
            data={data}
            showFitUp={true}
          />

          {viewCompletedDrawing && (
            <CompleteDrawingTable
              tableTitle={"Completed Material Issued Request List"}
              entity={[]} // matchDatas removed as requested
              handleAddToIssueArr={handleAddToIssueArr}
              data={data}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MultiIssueRequest;