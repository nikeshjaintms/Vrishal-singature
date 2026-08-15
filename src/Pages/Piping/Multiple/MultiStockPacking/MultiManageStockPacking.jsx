import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import StockPackageItemTable from "../Components/StockPackageItemTable/StockPackageItemTable";
import PackingForm from "./CommanComponents/StockPackingForm";
import PackingTable from "./CommanComponents/StockPackingTable";
import SubmitButton from "../Components/SubmitButton/SubmitButton";
import AddStockItemForm from "./CommanComponents/AddStockItemForm";

import { getOfferDataforStockPackaing } from "../../../../Store/Piping/MultiStockPacking/getOfferDataforStockPackaing";
import { manageStockPacking } from "../../../../Store/Piping/MultiStockPacking/ManageStockPacking";
import { getProject } from "../../../../Store/Store/Project/Project";
import axios from "axios";
import { V_URL } from "../../../../BaseUrl";
import { pipingGetMultiStockPacking } from "../../../../Store/Piping/MultiStockPacking/PipingGetMultiStockPacking";

const MultiManagePacking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [Errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [drawingItems, setDrawingItems] = useState([]);
  const [submitArr, setSubmitArr] = useState([]);

  /* ===== MODAL STATE ===== */
  const [isStockItemModalOpen, setIsStockItemModalOpen] = useState(false);
  const [editDrawingData, setEditDrawingData] = useState(null);

  const [packingData, setPackingData] = useState({
    remark: "",
    consignment_no: "",
    physical_weight: "",
    destination: "",
    truck_no: "",
    driver_name: "",
    gst_no: "",
    eway_bill: "",
    dispatch_date: "",
  });

  /* ===================== API CALLS ===================== */

  useEffect(() => {
    dispatch(getOfferDataforStockPackaing({ page: 1, limit: 10, search: "" }));
    dispatch(getProject());
  }, [dispatch]);

  /* ===================== REDUX SELECTORS (MEMOIZED) ===================== */

  const offerDrawingData = useSelector(
    (state) => state?.getOfferDataforStockPackaing?.issues?.data?.items || [],
    shallowEqual
  );
console.log("offerDrawingData=======>",offerDrawingData);
  const projectData = useSelector(
    (state) => state?.getProject?.user?.data || [],
    shallowEqual
  );

  /* ===================== SAFE LOG (ONCE) ===================== */



  /* ===================== AUTO PROJECT DATA ===================== */

  useEffect(() => {
    const proId = localStorage.getItem("U_PROJECT_ID");
    if (!proId || !projectData.length) return;

    const project = projectData.find((p) => p._id === proId);
    if (!project?.party) return;

    setPackingData((prev) => {
      const newDestination = `${project.party.address}, ${project.party.city}, ${project.party.state} ${project.party.pincode}`;
      const newGst = project.firm_id?.gst_no;

      if (prev.destination === newDestination && prev.gst_no === newGst) {
        return prev;
      }
      return {
        ...prev,
        destination: newDestination,
        gst_no: newGst,
      };
    });
  }, [projectData]);


  const addedKeySet = useMemo(() => {
    return new Set(
      submitArr.map(
        (item) =>
          `${item.drawing_id}_${item.item_id}_${item.piping_material_Specfication_id}`
      )
    );
  }, [submitArr]);

  /* ===================== DRAWING LIST ===================== */

// const commentsData = useMemo(() => {
//   let list = offerDrawingData || [];

//   if (search) {
//     const s = search.toLowerCase();

//     list = list.filter((issue) => {
//       return (issue?.items || []).some((item) => {
//         const drawingNo = item?.drawing_id?.drawing_no || "";
//         const rev = item?.drawing_id?.rev || "";
//         const sheet = item?.drawing_id?.sheet_no || "";

//         return (
//           drawingNo.toLowerCase().includes(s) ||
//           rev.toLowerCase().includes(s) ||
//           sheet.toLowerCase().includes(s)
//         );
//       });
//     });
//   }

//   return list;
// }, [offerDrawingData, search]);

const commentsData = useMemo(() => {
  let list = offerDrawingData || [];

  // 🔥 STEP 1: NORMALIZE DATA
  const normalized = list.flatMap((entry) => {
    if (entry.source_type === "RELEASE_NOTE") {
    return (entry.items || []).map((item) => ({
  _id: entry._id,              // ✅ MAIN IRN ID
  irn_item_id: item._id,       // ✅ ITEM ID
  irn_no: entry.report_no,
  item_id: item.item_id,
  item_name: item.itemDetails?.item_name,
  material_grade: item.itemDetails?.material_grade,
  size1: item.size1?.name,
  thickness1: item.thickness1?.name,
  size2: item.size2?.name || "-",
  thickness2: item.thickness2?.name || "-",
  source_type: entry.source_type,

  // ✅ IMPORTANT: clean structured items
  items: [
    {
      irn_id: entry._id,          // ✅ parent
      irn_item_id: item._id,      // ✅ child
  irn_no: entry.report_no,
      item_id: item.item_id,
      packaged_qty: item.is_qty,
    },
  ],

  total_qty: item.is_qty,
  merge_imir_no: [],
}));
    }

    // STOCK ISSUE (already flat)
    return [
      {
        ...entry,
        size1: entry.size1,
        thickness1: entry.thickness1,
        size2: entry.size2 || "-",
        thickness2: entry.thickness2 || "-",
      },
    ];
  });

  // 🔍 STEP 2: SEARCH (on normalized data)
  if (search) {
    const s = search.toLowerCase();
    return normalized.filter((item) =>
      item.item_name?.toLowerCase().includes(s)
    );
  }

  return normalized;
}, [offerDrawingData, search]);

  const paginatedComments = useMemo(() => {
    return commentsData.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    );
  }, [commentsData, currentPage, limit]);

  /* ===================== HANDLERS (MEMOIZED) ===================== */

  const handleOpen = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    []
  );

  /* ===== MODAL HANDLERS ===== */
  const openAddDrawingModal = () => {
    setEditDrawingData(null);
    setIsStockItemModalOpen(true);
  };

  const openEditDrawingModal = (row) => {
    setEditDrawingData(row);
    setIsStockItemModalOpen(true);
  };

  const closeDrawingModal = () => {
    setIsStockItemModalOpen(false);
    setEditDrawingData(null);
  };

  const handleDrawingSave = () => {
    dispatch(getOfferDataforStockPackaing({ page: 1, limit: 10, search: "" }));
  };



const handleAddToArr = useCallback(async (drawing) => {
  console.log("drawing", drawing);

  if (!drawing?.items?.length) {
    toast.error("Items missing");
    return;
  }

  const payload = {
   
    
    item_id: drawing?.item_id,
   
    source_type: drawing?.source_type,

    // ✅ DIRECT USE (NO CHANGE)
    items: drawing.items,
   
    total_qty: drawing.total_qty,
    merge_imir_no: drawing.merge_imir_no,
  };
console.log("payload==========>",payload);
  try {
    const res = await axios.post(
      `${V_URL}/user/piping/manage-multi-stock-packing-offer`,
      {
        ...payload,
        project_id: localStorage.getItem("U_PROJECT_ID"),
      },
      {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data?.success) {
      toast.success(res.data.message);

      // setSubmitArr((prev) => [...prev, payload]);
setSubmitArr((prev) => [...prev, drawing]);
      dispatch(pipingGetMultiStockPacking());
      dispatch(
        getOfferDataforStockPackaing({
          page: 1,
          limit: 10,
          search: "",
        })
      );
    } else {
      toast.error(res.data?.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to add item");
  }
}, [dispatch]);

  const refreshOfferData = () => {
    dispatch(getOfferDataforStockPackaing({ page: 1, limit: 10, search: "" }));
  };

  /* ===================== MANUAL ADD FROM MODAL ===================== */
  const handleAddToArrManual = async (drawing) => {
    console.log("Manual add", drawing);
    const newItem = {
      drawing_no: drawing.drawing_no,
      item_id: drawing.item_id,
      piping_material_Specfication_id: drawing.piping_material_Specfication_id || drawing.piping_material_specfication_id || drawing.piping_material_specification,
      imir_no: drawing.imir_no?.filter(Boolean) || [],
      packaged_qty: drawing.qty || 0,
      remarks: drawing.remarks || "",
    };

    const isDuplicate = submitArr.some(
      (item) =>
        item.drawing_no === newItem.drawing_no &&
        item.item_id === newItem.item_id &&
        item.piping_material_Specfication_id ===
        newItem.piping_material_Specfication_id
    );
    if (isDuplicate) {
      toast.error("This item is already added");
      return false;
    }

    try {
      const res = await axios.post(
        `${V_URL}/user/piping/manage-multi-manual-packing-offer`,
        { items: [newItem], project_id: localStorage.getItem("U_PROJECT_ID") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message);

        // Update table
        setSubmitArr((prev) => [...prev, newItem]);
        dispatch(pipingGetMultiStockPacking());
        dispatch(getOfferDataforStockPackaing({ page: 1, limit: 10, search: "" }));
        closeDrawingModal();

      } else {
        toast.error(res.data?.message || "Failed to add item manually");
      }
    } catch (error) {
      toast.error("Failed to add item manually");
    }
  };


  console.log("submitArr", submitArr);
  const packingTableData = useMemo(() => ({ items: drawingItems }), [drawingItems]);
console.log("packingTableData======>",packingTableData);
  const validation = () => {
    let isValid = true;
    let err = {};

    if (!packingData.consignment_no) {
      isValid = false;
      err.consignment_err = "Please enter consignment no";
    }
    if (!packingData.destination) {
      isValid = false;
      err.destination_err = "Please enter destination";
    }
    if (!packingData.truck_no) {
      isValid = false;
      err.truck_no_err = "Please enter truck no";
    }
    if (!packingData.driver_name) {
      isValid = false;
      err.driverName_err = "Please enter driver name";
    }

    if (!packingData.eway_bill) {
      isValid = false;
      err.eway_bill_err = "Please enter e-way bill";
    }
    setErrors(err);
    return isValid;
  };

  // const handleSubmit = () => {
  //   if (!submitArr.length) {
  //     toast.error("Please add drawings");
  //     return;
  //   }

  //   if (!validation()) return;

  //   const payload = {
  //     items: submitArr,
  //     project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
  //     consignment_no: packingData.consignment_no,
  //     destination: packingData.destination,
  //     vehicle_no: packingData.truck_no,
  //     driver_name: packingData.driver_name,
  //     gst_no: packingData.gst_no,
  //     e_way_bill_no: packingData.eway_bill,
  //     remarks: packingData.remark,
  //     packed_by: localStorage.getItem("PAY_USER_ID"),
  //     dispatch_date: packingData.dispatch_date,
      
  //     // physical_weight: packingData.physical_weight,
  //   };

  //   dispatch(manageStockPacking({ payload })).then((res) => {
  //     if (res.payload?.success) {
  //       toast.success(res.payload.message);
  //       navigate("/piping/user/stock-packing-list");
  //     }
  //   });
  // };

  const handleSubmit = () => {
  if (!submitArr.length) {
    toast.error("Please add drawings");
    return;
  }

  if (!validation()) return;

  const formattedItems = submitArr.map((item) => ({
    source_type:item.source_type,
    offer_id: item._id,
    item_id: item.item_id || item._id,   
    packing_no: item.packing_no,
    item_name: item.item_name,
    size1: item.size1,
    size2: item.size2,
    thickness1: item.thickness1,
    thickness2: item.thickness2,
    material_grade: item.material_grade,
    uom: item.uom,
    irn_no: item.irn_no,
    merged_imir_no: item.merged_imir_no  || [],
    total_packaged_qty: item.total_packaged_qty,
    createdAt: item.createdAt,
    items: item.items || [],
  }));
console.log("formattedItems===>",formattedItems);
  const payload = {
    items: formattedItems, // ✅ CLEAN STRUCTURE
    project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
    consignment_no: packingData.consignment_no,
    destination: packingData.destination,
    vehicle_no: packingData.truck_no,
    driver_name: packingData.driver_name,
    gst_no: packingData.gst_no,
    e_way_bill_no: packingData.eway_bill,
    remarks: packingData.remark,
    packed_by: localStorage.getItem("PAY_USER_ID"),
    dispatch_date: packingData.dispatch_date,
  };

  dispatch(manageStockPacking({ payload })).then((res) => {
    if (res.payload?.success) {
      toast.success(res.payload.message);
      navigate("/piping/user/stock-packing-list");
    }
  });
};

  /* ===================== JSX ===================== */

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/stock-packing-list">Packing List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item">{"Add"} Stock Packing Record</li>
                </ul>
              </div>
            </div>
          </div>
          <StockPackageItemTable
            is_dispatch
            tableTitle="Stock Item List"
            commentsData={paginatedComments}
            handleAddToIssueArr={handleAddToArr}
            currentPage={currentPage}
            limit={limit}
            setlimit={setLimit}
            totalItems={commentsData.length}
            setCurrentPage={setCurrentPage}
            setSearch={setSearch}
          />

          <PackingTable
            data={packingTableData}
            onAddDrawing={openAddDrawingModal}
            onEditDrawing={openEditDrawingModal}
            setSubmitArr={setSubmitArr}
            refreshOfferData={refreshOfferData}
          />

          {/* Removed AddDrawingForm and PackingModel */}
          <AddStockItemForm
            modalOpen={isStockItemModalOpen}
            handleModalClose={closeDrawingModal}
            handleSave={handleAddToArrManual}
            editData={editDrawingData}
          />

          <PackingForm
            packingData={packingData}
            setPackingData={setPackingData}
            Errors={Errors}
          />

          {/* <SubmitButton
            finalReq={submitArr}
            handleSubmit={handleSubmit}
            buttonName="Generate Packing List"
            link="/user/project-store/packing-list"
          /> */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body text-end">
                  <button
                    type="button"
                    className="btn btn-primary submit-form btn-lg"
                    onClick={handleSubmit}
                    disabled={submitArr.length === 0}
                  >
                    Generate Packing List
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MultiManagePacking;
