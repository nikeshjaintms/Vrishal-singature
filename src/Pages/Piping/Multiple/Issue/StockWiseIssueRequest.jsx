
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { getUserAdminDraw } from "../../../../Store/Erp/Planner/Draw/UserAdminDraw";
import { getAdminItemCategory } from '../../../../Store/Piping/ItemCategory/AdminItemCategory';

// import { getStockReportList } from "../../../../Store/Store/Stock/getStockReportList";
import { getPipingStockReportList } from "../../../../Store/Piping/Stock/getPipingStockReportList";
import {clearItemCategoryWiseStockReportList,getItemCategoryWiseStockReportList} from "../../../../Store/Piping/Stock/getItemCategoryWiseStockReportList";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";
import StockItemTable from "../Components/DrawingTable/StockItemTable";
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
// import { clearIssueOfferItems,getIssueOfferTablePiping } from "../../../../Store/Piping/IssueRequest/getIssueOfferTable";
import { clearStockIssueOfferItems,getStockIssueOfferTablePiping } from "../../../../Store/Piping/StockIssueRequest/getStockIssueOfferTable";
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
    dispatch(getItemCategoryWiseStockReportList({
      category_id: selectedCategory,
      project_id,
    }));

    dispatch(getStockIssueOfferTablePiping({
      // category_id: selectedCategory,
      project_id
    }));
  } else {
    // ✅ CLEAR DATA when no category selected
    setMaterialList([]);
    setIssueArr([]);
    dispatch(clearItemCategoryWiseStockReportList()); 
    dispatch(clearStockIssueOfferItems()); 
  }
}, [selectedCategory]);

  useEffect(() => {
   
  
       dispatch(getAdminItemCategory());

    dispatch(getPipingStockReportList());
    
    dispatch(clearItemCategoryWiseStockReportList());
  dispatch(clearStockIssueOfferItems());
  }, []);

  const project_id = localStorage.getItem('U_PROJECT_ID');

  const issueOffTableData = useSelector(
    (state) => state?.getDrawingSpool?.user?.data
  );
  const categoryWiseStock = useSelector(
  (state) => state?.getItemCategoryWiseStockReportList?.user?.data?.data
);
console.log("categoryWiseStock=======>",categoryWiseStock);
  const categoryData = useSelector((state) => state.getAdminItemCategory?.user?.data);
console.log("categoryData",categoryData);

  const offerData = useSelector((state) => state?.getStockIssueOfferTablePiping?.user?.data);
console.log("offerData", offerData);
useEffect(() => {
  if (!offerData?.length) {
    setMaterialList([]);
    return;
  }

  // const list = offerData
  //   .filter(offer => offer.is_generate === false)
  //   .map(offer => ({
  //     _id: offer._id,
  //     category_id: offer.category_id._id,
  //     offer_id: offer._id,
  //     report_no: offer.report_no,
  //     item: offer.item_id, 
  //       purchase_offer_id: offer.items.purchase_offer_id || null,
  //     purchase_offer_item_id: offer.items.purchase_offer_item_id || null,
  //      fim_id: offer.items.fim_id || null,
  //     package_list_no: offer.items?.package_list_no || "-",
  // make_manufacturer: offer.items?.make_manufacture?.length
  // ? offer.items.make_manufacture.join(", ")
  // : "-",
  //     stock_qty: offer.total_stock_qty || 0,
  //     requested_qty: offer.requested_qty,
  //     remarks: offer.remarks || "",

  //     is_issue: offer.is_issue,
  //     is_generate: offer.is_generate,
  //   }));
  const list = offerData
  .filter(offer => offer.is_generate === false)
  .map(offer => {
    const allItems = offer.items || [];
    const firstItem = allItems[0] || {};

    return {
      _id: offer._id,
      category_id: offer.category_id._id,
      offer_id: offer._id,
      report_no: offer.report_no,
      item: offer.item_id,
      items:offer.items,
      // ✅ COMBINED (for UI display)
      package_list_no: allItems.length
        ? allItems.map(i => i.package_list_no).join(", ")
        : "-",

      make_manufacturer: allItems.length
        ? allItems
            .flatMap(i => i.make_manufacture || [])
            .join(", ")
        : "-",

      stock_qty: offer.total_stock_qty || 0,
      requested_qty: offer.requested_qty,
      remarks: offer.remarks || "",

      is_issue: offer.is_issue,
      is_generate: offer.is_generate,
    };
  });
console.log("Transformed material list", list);
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
}, [categoryWiseStock, search, currentPage, limit]);

  const handleChange = (e, name) => {
    setIssueRequest({ ...issueRequest, [name]: e.value });
  };



const handleAddToIssueArr = async (row) => {
  const response = await dispatch(
    getItemCategoryWiseStockReportList({
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
    (r) => r.stock_qty > 0
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
    body.append("category_id", row.item_category);
    body.append("project_id", project_id);
    body.append("items", JSON.stringify(items));

    const res = await axios.post(
      `${V_URL}/user/manage-stock-issue-offer-table-piping`,
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
        getStockIssueOfferTablePiping({
          category_id: selectedCategory,
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

  const [editRowIndex, setEditRowIndex] = useState(null);


const [editFormData, setEditFormData] = useState({
  requested_qty: 0,
  remarks: "",
});

const handleEditClick = (index, elem) => {
  setEditRowIndex(index);

  setEditFormData({
    requested_qty: elem.requested_qty || 0,
    remarks: elem.remarks || "",
  });
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

  if (!row?._id || !row?.item?._id) {
    toast.error("Missing data");
    return;
  }

  const body = new URLSearchParams();
  body.append("project_id", localStorage.getItem('U_PROJECT_ID'));
 body.append("category_id", row.category_id);
  body.append("offer_id", row._id);
  body.append("item_id", row.item._id);
  body.append("stock_qty", row.stock_qty);
  body.append("requested_qty", editFormData.requested_qty);
  body.append("remarks", editFormData.remarks || "");

  try {
    const res = await axios.post(
      `${V_URL}/user/manage-stock-issue-offer-table-piping`,
      body,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      const updatedList = [...materialList];
      updatedList[index] = {
        ...row,
        requested_qty: editFormData.requested_qty,
        remarks: editFormData.remarks,
      };

      setMaterialList(updatedList);
      setEditRowIndex(null);

      dispatch(getStockIssueOfferTablePiping({
        // category_id: selectedCategory,
        project_id
      }));
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
      `${V_URL}/user/delete-stock-issue-offer-table-piping`,
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
        getStockIssueOfferTablePiping({
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
      getMaterialEntryItemsForIssueRequest({ drawing_id: drawingId })
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
  if (!procedure) {
    toast.error("Please select procedure");
    return;
  }

 

  const validOffers = materialList.filter(i => !i.is_generate);
console.log("Valid offers for submission", validOffers);

// ✅ VALIDATE ALL REQUESTED QTY
for (const item of validOffers) {
  const requestedQty = Number(item.requested_qty);
  const stockQty = Number(item.stock_qty);

  if (!requestedQty || requestedQty <= 0) {
    toast.error(
      `${item?.item?.item_name || "Item"} requested qty must be greater than 0`
    );
    return;
  }

  if (requestedQty > stockQty) {
    toast.error(
      `${item?.item?.item_name || "Item"} requested qty cannot exceed stock qty`
    );
    return;
  }
}

  if (!validOffers.length) {
    toast.error("No items to submit");
    return;
  }

  setDisable(true);

  try {
   const itemsToSend = validOffers.map(item => ({
  stock_issue_offer_id: item.offer_id || item._id,

  category_id: item.category_id, 

  item_id: item.item._id,

  // 🔥 IMPORTANT: NESTED ARRAY
  data: (item.items || []).map(i => ({
    purchase_offer_id: i.purchase_offer_id,
    purchase_offer_item_id: i.purchase_offer_item_id,
    fim_id: i.fim_id,
  })),


  stock_qty: item.stock_qty,
  requested_qty: item.requested_qty,
  remarks: item.remarks || "",
}));

    const body = new URLSearchParams();

    body.append("project", project_id);
    body.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
    body.append("requested_by", localStorage.getItem("PAY_USER_ID"));

    body.append(
      "isReleaseForPainting",
      procedure === "painting"
    );

    body.append(
      "isReleaseNoteForSiteDispatch",
      procedure === "dispatch"
    );

    body.append("items", JSON.stringify(itemsToSend));

    if (data?._id) {
      body.append("id", data._id);
    }

    const res = await axios.post(
      `${V_URL}/user/manage-piping-stock-issue-request`,
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
        getStockIssueOfferTablePiping({
          // category_id: selectedCategory,
          project_id,
        })
      );

      navigate("/piping/user/stock-wise-issue-request-management", { replace: true });
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
                link: "/piping/user/stock-wise-issue-request-management",
                active: false,
              },
              { name: "Add Stock Wise Issue Request", active: true },
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
                                                        <h3>View Stock Wise Issue Request List</h3>
                                                       
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
                      <StockItemTable
                        tableTitle="Stock Wise Material Issued Request List"
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
                            <th>Item Description</th>
                            <th>Size1</th>
                            <th>Thickness1</th>
                            <th>Size2</th>
                            <th>Thickness2</th>
                            <th>Material Grade</th>
                            <th>Make Manufacturer</th>
                            <th>FIM Lot No/ Material PO No</th>
                            <th>UOM</th>
                            <th>Stock Qty</th>
                            <th>Requested Qty</th>
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
          <td>{elem?.item?.item_name || "-"}</td>
          <td>{elem?.item?.item_description || "-"}</td>
          <td>{elem?.item?.size1?.name || "-"}</td>
          <td>{elem?.item?.thickness1?.name || "-"}</td>
           <td>{elem?.item?.size2?.name || "-"}</td>
          <td>{elem?.item?.thickness2?.name || "-"}</td>
          <td>{elem?.item?.material_grade || "-"}</td>
         <td>
  {elem?.make_manufacturer|| "-"}
</td>
          <td>{elem?.package_list_no || "-"}</td>
          <td>{elem?.item?.uom?.name || "-"}</td>

          {/* Required Qty (read-only) */}
          <td>{elem.stock_qty}</td>

          {/* Requested Qty */}
          <td>
  {isEditing ? (
    <input
      type="number"
      name="requested_qty"
      className="form-control"
      value={editFormData.requested_qty}
      onChange={handleEditFormChange}
    />
    
  ) : (
    elem.requested_qty
  )}
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
                          
                            <th>Item Name</th>
                            <th>Item Description</th>
                            <th>Size1</th>
                            <th>Thickness1</th>
                            <th>Size2</th>
                            <th>Thickness2</th>
                            <th>Material Grade</th>
                            <th>Make Manufacturer</th>
                            <th>FIM Lot No/ Material PO No</th>
                            <th>UOM</th>
                            <th>Stock Qty</th>
                            <th>Requested Qty</th>
                            <th>Remarks</th>
                        
                          </tr>
                        </thead>
                     <tbody>
  {finalReq?.map((elem, i) => (
    <tr key={i}>
      <td>{i + 1}</td>

      {/* ✅ Correct mapping from API */}
      <td>{elem?.itemDetails?.item_name || "-"}</td>
      <td>{elem?.itemDetails?.item_description || "-"}</td>
      <td>{elem?.itemDetails?.size1?.name || "-"}</td>
      <td>{elem?.itemDetails?.thickness1?.name || "-"}</td>
      <td>{elem?.itemDetails?.size2?.name || "-"}</td>
      <td>{elem?.itemDetails?.thickness2?.name || "-"}</td>
      <td>{elem?.itemDetails?.material_grade || "-"}</td>

     <td>
  {elem?.data?.length
    ? elem.data
        .flatMap(d => d.make_manufacture || [])
        .join(", ")
    : "-"}
</td>

<td>
  {elem?.data?.length
    ? elem.data
        .map(d => d.package_list_no)
        .filter(Boolean)
        .join(", ")
    : "-"}
</td>
      <td>{elem?.itemDetails?.uom?.name || "-"}</td>

      <td>{elem?.total_stock_qty || 0}</td>
      <td>{elem?.requested_qty || 0}</td>
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
            link={"/piping/user/stock-wise-issue-request-management"}
            buttonName={"Generate Stock Wise Issue Request"}
            // isFitUP={isFitUP}
            // isPainting={isPainting}
            // isDispatch={isDispatch}
            procedure={procedure}
          
            handleStatusChange={handleStatusChange}
            data={data}
            showStockIssue={true}
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