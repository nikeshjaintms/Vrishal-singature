
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { getUserAdminDraw } from "../../../../Store/Erp/Planner/Draw/UserAdminDraw";
import {getAdminCategory} from "../../../../Store/Store/StoreMaster/Category/AdminCategory";
// import { getStockReportList } from "../../../../Store/Store/Stock/getStockReportList";
import { getStockReportList } from "../../../../Store/Store/Stock/getStockReportList";
import {clearItemCategoryWiseReportList,getItemCategoryWiseReportList} from "../../../../Store/Erp/IssueReturn/getItemCategoryWiseReportList";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";
import IssueReturnItemTable from "../Components/DrawingTable/IssueReturnItemTable";
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
import { clearMaterialEntryForIssueReturnItems,getMaterialEntryItemsForIssueReturn } from "../../../../Store/Piping/IssueReturn/getMaterialIssueItemsForIssueReturn";
// import { clearIssueOfferItems,getIssueOfferTablePiping } from "../../../../Store/Piping/IssueRequest/getIssueOfferTable";

import { clearIssueOfferItems,getIssueReturnOfferTable } from "../../../../Store/Erp/IssueReturn/getIssueReturnOfferTable";

import { MultiSelect } from "primereact/multiselect";
const MultiIssueRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [entity, setEntity] = useState([]);
  const [issueRequest, setIssueRequest] = useState({ name: "" });
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [search, setSearch] = useState("");
  const [issueArr, setIssueArr] = useState([]);
  const [disable, setDisable] = useState(false);
  const [finalReq, setFinalReq] = useState([]);
  const data = location.state;
  console.log("location.state", location.state);
  const [showItem, setShowItem] = useState(false);
  const [viewCompletedDrawing, setViewCompletedDrawing] = useState(false);
  const [requiredCountMap, setRequiredCountMap] = useState({});

  const [drawId, setDrawId] = useState(null);

const [procedure, setProcedure] = useState(null);

  const [drIds, setDrIds] = useState([]);

  const [selectedDrawing, setSelectedDrawing] = useState(null);
const [materialList, setMaterialList] = useState([]);
const [editFormDataMap, setEditFormDataMap] = useState({});
const [editRowIndex, setEditRowIndex] = useState(null);
const [editFormData, setEditFormData] = useState({
  return_qty: "",
  scrap_qty: "",
  remarks: "",
  return_imir_no: "",
  return_heat_no: "",
   scrap_imir_no: "",
  scrap_heat_no: "",
});

const normalizeArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.flat().filter(Boolean);
  return [val];
};

useEffect(() => {
  if (location.state?._id) {
    setIssueRequest({
      name: data?.items?.[0]?.drawing_id?.issued_person?._id || "",
    });

    // ✅ Set dropdown selected value
   setSelectedCategory(
  data?.category_id
    ? Array.isArray(data.category_id)
      ? data.category_id.map(c => c._id || c)
      : [data.category_id._id || data.category_id]
    : []
);

    if (data?.isReleaseForPainting) {
      setProcedure("painting");
    } else if (data?.isReleaseNoteForSiteDispatch) {
      setProcedure("dispatch");
    }

    setFinalReq(data?.items || []);
  }
}, [location.state]);


useEffect(() => {
  if (selectedCategory && selectedCategory.length > 0) {
    dispatch(getItemCategoryWiseReportList({
      category_id: selectedCategory,
      project_id,
    }));

    dispatch(getIssueReturnOfferTable({
      // category_id: selectedCategory,
      project_id
    }));
  } else {
    // ✅ CLEAR DATA when no category selected
    setMaterialList([]);
    setIssueArr([]);
    dispatch(clearItemCategoryWiseReportList()); 
    dispatch(clearIssueOfferItems()); 
    dispatch(clearMaterialEntryForIssueReturnItems());
  }
}, [selectedCategory]);

  useEffect(() => {
   
  
       dispatch(getAdminCategory());

    dispatch(getStockReportList());
    
    dispatch(clearItemCategoryWiseReportList());
  dispatch(clearIssueOfferItems());
  }, []);

  const project_id = localStorage.getItem('U_PROJECT_ID');

  const issueOffTableData = useSelector(
    (state) => state?.getDrawingSpool?.user?.data
  );
  const categoryWiseStock = useSelector(
  (state) => state?.getItemCategoryWiseReportList?.user?.data?.data
);
console.log("categoryWiseStock=======>",categoryWiseStock);
  const categoryData = useSelector((state) => state.getAdminCategory?.user?.data);
console.log("categoryData",categoryData);

  const offerData = useSelector((state) => state?.getIssueReturnOfferTable?.user?.data);
console.log("offerData", offerData);
useEffect(() => {
  if (!offerData?.length) {
    setMaterialList([]);
    return;
  }

  const list = offerData
    .filter((offer) => offer.is_generate === false)
    .map((offer) => {
      const allItems = offer.items || [];

      return {
        _id: offer._id,
        category_id: offer.category_id?._id,
        offer_id: offer._id,
        report_no: offer.report_no,
        item: offer.item_id,
        items: offer.items || [],

        total_issued_qty: offer.total_issued_qty || 0,
        stock_qty: offer.total_stock_qty || 0,

        return_qty: offer.return_qty ,
        scrap_qty: offer.scrap_qty,

        return_imir_no: normalizeArray(offer.return_imir_no),
        return_heat_no: normalizeArray(offer.return_heat_no),

        scrap_imir_no: normalizeArray(offer.scrap_imir_no),
        scrap_heat_no: normalizeArray(offer.scrap_heat_no),

        imir_no: normalizeArray(offer.imir_no),
        heat_no: normalizeArray(offer.heat_no),

        package_list_no: allItems.map(i => i.package_list_no).join(", "),
        make_manufacturer: allItems
          .flatMap(i => i.manufacture || [])
          .join(", "),

        remarks: offer.remarks || "",
        requested_qty: offer.requested_qty || 0,
      };
    });

  setMaterialList(list);
}, [offerData]);

  useEffect(() => {
    const filterData = categoryWiseStock?.filter(
      (it) => it?.is_issue === false
    );
    setIssueArr(filterData || []);
  }, [categoryWiseStock]);

const requestListData = useMemo(() => {
  if (!categoryWiseStock) return [];

  let rows = Array.isArray(categoryWiseStock)
    ? categoryWiseStock
    : [categoryWiseStock];

  if (search) {
    const s = search.trim().toLowerCase();
    rows = rows.filter(
      dr =>
        dr?.name?.toLowerCase().includes(s) ||
        dr?.drawing_no?.toLowerCase().includes(s) ||
        dr?.spool_no?.toLowerCase().includes(s)
    );
  }

  setTotalItems(rows.length);

  return rows.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );
}, [categoryWiseStock, search, currentPage, limit]);

  const handleChange = (e, name) => {
    setIssueRequest({ ...issueRequest, [name]: e.value });
  };



const handleAddToIssueArr = async (row) => {
  const response = await dispatch(
    getItemCategoryWiseReportList({
      category_id: selectedCategory,
      project_id,
    })
  );

  if (!response?.payload?.success) return;

  const allItems = response.payload.data.data;

  const matchedItem = allItems.find(
    (m) => m.itemId === row.itemId
  );

  if (!matchedItem || !matchedItem.rows?.length) {
    toast.error("No stock rows found");
    return;
  }

  const validRows = matchedItem.rows.filter(
    (r) => r.stock_qty >= 0
  );

  if (!validRows.length) {
    toast.success("No stock available");
    return;
  }

  try {
    // ✅ BUILD NESTED ARRAY
    const items = validRows.map((r) => ({
      purchase_offer_id: r.purchase_offer_id,
      purchase_offer_item_id: r.purchase_offer_item_id,
      fim_id: r.fim_id,
    }));

    // const payload = {
    //   item_id: row.itemId,
    //   category_id: row.item_category,
    //   project_id: project_id,
    //   items: items,
    // };

    const body = new URLSearchParams();

    // 🔥 send full object
    body.append("item_id", row.itemId);
    body.append("category_id", row.category);
    body.append("project_id", project_id);
    body.append("items", JSON.stringify(items));

    const res = await axios.post(
      `${V_URL}/user/manage-material-issue-return`,
      body,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message || "Added successfully");

      dispatch(
        getIssueReturnOfferTable({
          
          project_id,
        })
      );
    } else {
      toast.error(res.data.message || "Failed");
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }
};

  const handleCompletedDrawing = () => {
    setViewCompletedDrawing(!viewCompletedDrawing);
  };

 

  
const handleEditFormChange = (e) => {
  const { name, value } = e.target;

  setEditFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSaveMaterialRow = async (index) => {
  const row = materialList[index];
  const data = editFormDataMap[index];

  if (!row?._id || !row?.item?._id) {
    toast.error("Missing data");
    return;
  }

  const issuedQty = Number(row.total_issued_qty || 0);
  const returnQty = Number(data?.return_qty);
  const scrapQty = Number(data?.scrap_qty);


  // ===============================
  // REQUIRED VALIDATION ON EDIT
  // ===============================

  if (
    (!data?.return_qty || Number(data.return_qty) <= 0) 
  ) {
    toast.error("Enter Return Qty");
    return;
  }

   if (
    
    (!data?.scrap_qty || Number(data.scrap_qty) <= 0)
  ) {
    toast.error("Enter Scrap Qty");
    return;
  }

  // Return Qty entered
  if (Number(data?.return_qty) > 0) {

    if (!data?.return_imir_no) {
      toast.error("Select Return IMIR No");
      return;
    }

    if (!data?.return_heat_no) {
      toast.error("Select Return Heat No");
      return;
    }

  }


  // Scrap Qty entered
  if (Number(data?.scrap_qty) > 0) {

    if (!data?.scrap_imir_no) {
      toast.error("Select Scrap IMIR No");
      return;
    }

    if (!data?.scrap_heat_no) {
      toast.error("Select Scrap Heat No");
      return;
    }

  }



  // qty limit
  if (returnQty > issuedQty) {
    toast.error(
      `Return Qty cannot exceed Issued Qty (${issuedQty})`
    );
    return;
  }


  const body = new URLSearchParams();

  body.append("project_id", localStorage.getItem("U_PROJECT_ID"));
  body.append("category_id", row.category_id);
  body.append("offer_id", row._id);
  body.append("item_id", row.item._id);

  body.append("return_qty", returnQty);
  body.append("scrap_qty", scrapQty);

  body.append("total_issued_qty", issuedQty);

  body.append("return_imir_no", data?.return_imir_no || "");
  body.append("return_heat_no", data?.return_heat_no || "");

  body.append("scrap_imir_no", data?.scrap_imir_no || "");
  body.append("scrap_heat_no", data?.scrap_heat_no || "");

  body.append("remarks", data?.remarks || "");

  try {
    const res = await axios.post(
      `${V_URL}/user/manage-material-issue-return`,
      body,
      {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      const updated = [...materialList];
      updated[index] = {
        ...row,
        ...data,
      };

      setMaterialList(updated);
      setEditRowIndex(null);
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || "Update failed");
  }
};

const handleRemoveMaterialRow = async (index) => {
  const row = materialList[index];

  // 1️⃣ Local remove (not saved yet)
  if (!row?._id) {
    setMaterialList(prev => prev.filter((_, i) => i !== index));
    toast.success("Row removed");
    return;
  }

  // 2️⃣ Prevent delete if already generated/issued
  if (row.is_generate) {
    toast.error("Cannot delete. Item already issued/generated.");
    return;
  }

  try {
    const res = await axios.delete(
      `${V_URL}/user/delete-material-issue-offer-return`,
      {
        data: {
          offer_id: row._id,
          item_id: row.item._id,   // IMPORTANT FIX
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message || "Deleted successfully");

      // 3️⃣ Update UI state
      const updatedList = materialList.filter((_, i) => i !== index);
      setMaterialList(updatedList);

      dispatch(
        getIssueReturnOfferTable({
          // category_id: selectedCategory,
          project_id,
        })
      );
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

 

const getRequiredItemCountPerDrawing = async (drawingIds) => {
  const drawingItemCount = {};

  for (const drawingId of drawingIds) {
    const res = await dispatch(
      getMaterialEntryItemsForIssueReturn({ drawing_id: drawingId })
    );

    if (res?.payload?.success) {
   
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

      issuedCountMap[drawingId] += (offer || []).length;
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
 
  const validOffers = materialList.filter(i => !i.is_generate);
console.log("Valid offers for submission", validOffers);

 // ✅ Validation 1: at least one item added
  if (!validOffers.length) {
    toast.error("Please add at least one item before submit");
    return;
  }


for (let i = 0; i < validOffers.length; i++) {

  const item = validOffers[i];

  const returnQty = Number(item.return_qty);
  const scrapQty = Number(item.scrap_qty);


  // ================================
  // GENERATE BUTTON VALIDATION
  // ================================

  // Both empty
  if (
    (!item.return_qty || returnQty <= 0) 
  ) {
    toast.error(
      `Enter Return Qty for ${item.item?.item_name || "item"}`
    );
    return;
  }

  if (
    
    (!item.scrap_qty || scrapQty <= 0)
  ) {
    toast.error(
      `Enter Scrap Qty for ${item.item?.item_name || "item"}`
    );
    return;
  }
  // Return Qty validation
  if (returnQty > 0) {

    if (!item.return_imir_no) {
      toast.error(
        `Select Return IMIR No for ${item.item?.item_name}`
      );
      return;
    }

    if (!item.return_heat_no) {
      toast.error(
        `Select Return Heat No for ${item.item?.item_name}`
      );
      return;
    }
  }



  // Scrap Qty validation
  // if (scrapQty > 0) {

    if (!item.scrap_imir_no) {
      toast.error(
        `Select Scrap IMIR No for ${item.item?.item_name}`
      );
      return;
    }


    if (!item.scrap_heat_no) {
      toast.error(
        `Select Scrap Heat No for ${item.item?.item_name}`
      );
      return;
    }

  // }



  const issuedQty = Number(item.total_issued_qty || 0);


  if (returnQty  > issuedQty) {
    toast.error(
      `Return  cannot exceed Issued Qty`
    );
    return;
  }

}

  setDisable(true);

  try {
  const itemsToSend = validOffers.map(item => ({
  issue_offer_id: item.offer_id || item._id,

  category_id: item.category_id,

  item_id: item.item._id,

  data: (item.items || []).map(i => ({
    purchase_offer_id: i.purchase_offer_id,
    purchase_offer_item_id: i.purchase_offer_item_id,
    fim_id: i.fim_id,
  })),


  total_issued_qty: Number(item.total_issued_qty || 0),
  return_qty: Number(item.return_qty),

  scrap_qty: Number(item.scrap_qty),

  return_imir_no: item.return_imir_no || "",

  return_heat_no: item.return_heat_no || "",

  scrap_imir_no: item.scrap_imir_no || "",

  scrap_heat_no: item.scrap_heat_no || "",

  remarks: item.remarks || "",
}));

    const body = new URLSearchParams();

    body.append("project", project_id);
    body.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
    body.append("requested_by", localStorage.getItem("PAY_USER_ID"));

   

    body.append("items", JSON.stringify(itemsToSend));

    if (data?._id) {
      body.append("id", data._id);
    }

    const res = await axios.post(
      `${V_URL}/user/generate-material-issue-return`,
      body,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message || "Issue Request Created");

      // RESET STATE
      setMaterialList([]);
      setFinalReq([]);
      setSelectedCategory(null);
      setEditRowIndex(null);
      setIssueRequest({ name: "" });

      dispatch(
        getIssueReturnOfferTable({
          // category_id: selectedCategory,
          project_id,
        })
      );

      navigate("/user/project-store/issue-return-note", { replace: true });
    } else {
      toast.error(res.data.message || "Failed to submit");
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

  const conOptions = categoryData?.map((e) => ({
    label: e?.name,
    value: e?._id,
  }));
useEffect(() => {
  setMaterialList([]);   // clear old items
  setIssueArr([]);
  setCurrentPage(1);
}, [selectedCategory]);
console.log("finalReq",finalReq);

const handleEditClick = (index, elem) => {
  setEditRowIndex(index);

  setEditFormDataMap(prev => ({
    ...prev,
    [index]: {
      return_qty: elem.return_qty,
      scrap_qty: elem.scrap_qty,
      remarks: elem.remarks || "",

       return_imir_no: Array.isArray(elem.return_imir_no)
        ? elem.return_imir_no[0] || ""
        : elem.return_imir_no || "",

      return_heat_no: Array.isArray(elem.return_heat_no)
        ? elem.return_heat_no[0] || ""
        : elem.return_heat_no || "",

      scrap_imir_no: Array.isArray(elem.scrap_imir_no)
        ? elem.scrap_imir_no[0] || ""
        : elem.scrap_imir_no || "",

      scrap_heat_no: Array.isArray(elem.scrap_heat_no)
        ? elem.scrap_heat_no[0] || ""
        : elem.scrap_heat_no || "",
    }
  }));
};

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
                name: "Issue Return List",
                link: "/user/project-store/issue-return-note",
                active: false,
              },
              { name: "Add Issue Return", active: true },
            ]}
          />

                        {data?._id && (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>View Issue Return List</h3>
                                                       
                                                    </div>
                                                </div>
                                               
                                            </div>
                                        </div>

                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                        )} 
          {/* Contractor Selection */}
           {!data?._id && (
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="staff-search-table">
                    <div className="row d-flex align-items-center justify-content-between">
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Item category</label>
                          
                        <MultiSelect
    options={conOptions}
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.value)}
    placeholder="Select Item Categories"
    display="chip"
    disabled={data?._id}
  />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           )}
           
            {!data?._id && (
              <>
                      {/* MATERIAL ISSUED REQUEST LIST */}
                      <IssueReturnItemTable
                        tableTitle="Material Issued Return List"
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
                          
                            <th>Item Name</th>                            
                            <th>Material Grade</th>
                            <th>Unit</th>
                            <th>Issued Qty</th>
                            <th>Return Qty</th>
                            <th>Return Imir No</th>
                            <th>Return Heat No</th>
                            <th>Scrap Qty</th>
                             <th>Scrap Imir No</th>
                            <th>Scrap Heat No</th>
                            <th>Remarks</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                 <tbody>
  {materialList.length > 0 ? (
    materialList.map((elem, i) => {
      const isEditing = editRowIndex === i;
const rowData = editFormDataMap[i] || {};

      return (
  

          <tr
  // key={i}
  key={elem._id}
  // key={`${elem.drawing_id}-${elem.item._id}`}
  onDoubleClick={() => handleEditClick(i, elem)}
>
          <td>{i + 1}</td>
          <td>{elem?.item?.name || "-"}</td>
          <td>{elem?.item?.material_grade || "-"}</td>
          <td>{elem?.item?.unit || "-"}</td>
        

          {/* Required Qty (read-only) */}
          <td>{elem.total_issued_qty}</td>

          {/* Return Qty */}
          <td>
  {isEditing ? (
  <input
  type="number"
  className="form-control"
  value={rowData.return_qty}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        return_qty: e.target.value,
      }
    }))
  }
/>
    
  ) : (
    elem.return_qty
  )}
</td>

 {/* Imir No */}
<td>
  {isEditing ? (
   <Dropdown
  value={rowData.return_imir_no}
  options={(elem.imir_no || []).map(i => ({
    label: i,
    value: i,
  }))}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        return_imir_no: e.value,
      }
    }))
  }
/>
  ) : (
    elem.return_imir_no || "-"
  )}
</td>
 {/* Heat No */}
<td>
  {isEditing ? (
   <Dropdown
  value={rowData.return_heat_no}
  options={(elem.heat_no || []).map(i => ({
    label: i,
    value: i,
  }))}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        return_heat_no: e.value,
      }
    }))
  }
/>
  ) : (
    elem.return_heat_no || "-"
  )}
</td>

              <td>
  {isEditing ? (
   <input
  type="number"
  className="form-control"
  value={rowData.scrap_qty}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        scrap_qty: e.target.value,
      }
    }))
  }
/>
    
  ) : (
    elem.scrap_qty
  )}
</td>
      <td>
  {isEditing ? (
<Dropdown
  value={rowData.scrap_imir_no}
  options={(elem.imir_no || []).map(i => ({
    label: i,
    value: i,
  }))}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        scrap_imir_no: e.value,
      }
    }))
  }
  placeholder="Select Scrap IMIR"
/>
  ) : (
    elem.scrap_imir_no || "-"
  )}
</td>

<td>
  {isEditing ? (
   <Dropdown
  value={rowData.scrap_heat_no}
  options={(elem.heat_no || []).map(i => ({
    label: i,
    value: i,
  }))}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        scrap_heat_no: e.value,
      }
    }))
  }
/>
  ) : (
    elem.scrap_heat_no || "-"
  )}
</td>   
 <td>
  {isEditing ? (
  <input
  type="text"
  className="form-control"
  value={rowData.remarks}
  onChange={(e) =>
    setEditFormDataMap(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        remarks: e.target.value,
      }
    }))
  }
/>
    
  ) : (
    elem.remarks
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
                          
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th>Material Grade</th>
                            <th>Issued Qty</th>
                            <th>Return Qty</th>
                            <th>Imir No</th>
                            <th>Heat No</th>
                            <th>Scrap Qty</th>
                             <th>Scrap Imir No</th>
                            <th>Scrap Heat No</th>
                            <th>Remarks</th>
                        
                          </tr>
                        </thead>
                     <tbody>
  {finalReq?.map((elem, i) => (
    <tr key={i}>
      <td>{i + 1}</td>

      {/* ✅ Correct mapping from API */}
      <td>{elem?.itemDetails?.name || "-"}</td>
      <td>{elem?.itemDetails?.unit?.name || "-"}</td>
      <td>{elem?.itemDetails?.material_grade || "-"}</td>
      <td>{elem?.total_issued_qty || 0}</td>
      <td>{elem?.return_qty || 0}</td>
      <td>{elem?.return_imir_no || "-"}</td>
      <td>{elem?.return_heat_no || "-"}</td>

      <td>{elem?.scrap_qty || 0}</td>
       <td>{elem?.scrap_imir_no || "-"}</td>
      <td>{elem?.scrap_heat_no || "-"}</td>
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
            link={"/user/project-store/issue-return-note"}
            buttonName={"Generate Issue Return"}
            handleStatusChange={handleStatusChange}
            data={data}
            // showStockIssue={true}
          />

          {viewCompletedDrawing && (
            <CompleteDrawingTable
              tableTitle={"Completed Material Issued Return List"}
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