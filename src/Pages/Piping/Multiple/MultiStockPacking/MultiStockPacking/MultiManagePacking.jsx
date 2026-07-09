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

// import DrawingTable from "../Components/DrawingTable/DrawingTable";
import PackageDrawingTable from "../Components/PackageDrawingTable/PackageDrawingTable"
import PackingForm from "./CommanComponents/PackingForm";
import PackingTable from "./CommanComponents/PackingTable";
import SubmitButton from "../Components/SubmitButton/SubmitButton";
import AddDrawingForm from "./CommanComponents/AddDrawingForm";

import { getOfferDataforPackaing } from "../../../../Store/Piping/MultiPacking/getOfferDataforPackaing";
import { managePacking } from "../../../../Store/Piping/MultiPacking/ManagePacking";
import { getProject } from "../../../../Store/Store/Project/Project";
import axios from "axios";
import { V_URL } from "../../../../BaseUrl";
import { pipingGetMultiPacking } from "../../../../Store/Piping/MultiPacking/PipingGetMultiPacking";

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
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
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
    dispatch(getOfferDataforPackaing({ page: 1, limit: 10, search: "" }));
    dispatch(getProject());
  }, [dispatch]);

  /* ===================== REDUX SELECTORS (MEMOIZED) ===================== */

  const offerDrawingData = useSelector(
    (state) => state?.getOfferDataforPackaing?.issues?.data?.items || [],
    shallowEqual
  );

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

  const commentsData = useMemo(() => {
    const flatItems = offerDrawingData.flatMap((issue) =>
      (issue.items || []).map((item) => {
          const isIRN = issue.source_type === "RELEASE_NOTE";

        const drawingId =
          item?.drawing_id?._id || item?.drawing_id || item?._id;

        const key = `${drawingId}_${item?.item_id?._id}_${item?.piping_material_specification?._id_spec}`;

        return {
          ...item,
          source_type: issue.source_type,
          irn_no: isIRN ? issue.report_no : null,
          irn_id: isIRN ? issue._id : null,


          issue_acceptance_id: issue._id,
          issue_request_id: issue.issue_req_id,
          drawing_no: item.drawing_id?.drawing_no,
          rev: item.drawing_id?.rev,
          sheet_no: item.drawing_id?.sheet_no,
          alreadyAdded: addedKeySet.has(key),
        };
      })
    );

    let list = flatItems;

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (d) =>
          d?.drawing_no?.toLowerCase().includes(s) ||
          d?.rev?.toLowerCase().includes(s)
      );
    }

    return list.sort((a, b) =>
      a?.drawing_no?.localeCompare(b?.drawing_no, undefined, {
        numeric: true,
      })
    );
  }, [offerDrawingData, search, addedKeySet]);



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
    setIsDrawingModalOpen(true);
  };

  const openEditDrawingModal = (row) => {
    setEditDrawingData(row);
    setIsDrawingModalOpen(true);
  };

  const closeDrawingModal = () => {
    setIsDrawingModalOpen(false);
    setEditDrawingData(null);
  };

  const handleDrawingSave = () => {
    dispatch(getOfferDataforPackaing({ page: 1, limit: 10, search: "" }));
  };



  const handleAddToArr = useCallback(
    async (drawing) => {
      console.log("drawing", drawing);
      const drawingId =
        drawing?.drawing_id?._id ||
        drawing?.drawing_id ||
        drawing?._id;

      const packagedQty =
        typeof drawing?.is_qty === "number"
          ? drawing.is_qty                         // RELEASE_NOTE
          : drawing?.issued_total_requested_qty || 1; // ISSUE_ACCEPTANCE

          let newItem = {}
          if(drawing.source_type === "PRESSURE_TEST" || drawing.source_type === "FD_INSPECTION"){

            if(drawing.source_type === "PRESSURE_TEST"){
              newItem = {
                drawing_id: drawingId,
                spool_id: drawing?.spool_no_id?._id || drawing?.spool_no_id || drawing?.spool_id,
                piping_material_Specfication_id:
                drawing?.piping_material_specification?._id_spec
                || drawing?.piping_material_specification_id || drawing?.piping_material_Specfication_id,
                pressure_test_id: drawing?._id,
                packaged_qty: packagedQty || 0,
              }
            }
            else if(drawing.source_type === "FD_INSPECTION"){
              newItem ={
                drawing_id: drawingId,
                spool_id: drawing?.spool_no_id?._id || drawing?.spool_no_id || drawing?.spool_id,
                piping_material_Specfication_id:
                drawing?.piping_material_specification?._id_spec
                || drawing?.piping_material_specification_id || drawing?.piping_material_Specfication_id,
                fd_inspection_id: drawing?._id,
                packaged_qty: packagedQty || 0,

              }}
            
          }
          else{
            if(drawing.spool_id){
                newItem = {
                  drawing_id: drawingId,
                spool_id: drawing?.spool_no_id?._id || drawing?.spool_no_id || drawing?.spool_id,
                piping_material_Specfication_id:
                  drawing?.piping_material_specification?._id_spec
                  || drawing?.piping_material_specification_id || drawing?.piping_material_Specfication_id,
                imir_no: Array.isArray(drawing?.imir_no)
                  ? drawing.imir_no
                  : drawing?.imir_no
                    ? [drawing.imir_no]
                    : [],
                packaged_qty: packagedQty || 0,
                issue_acceptance_id: drawing?.source_type === "RELEASE_NOTE" ? "" : drawing?.issue_acceptance_id,

                irn_id: drawing?.source_type === "RELEASE_NOTE" ? drawing?.irn_id : null,
                irn_no: drawing?.source_type === "RELEASE_NOTE" ? drawing?.irn_no : null,
              }
            } else{
            newItem = {
              drawing_id: drawingId,
              item_id: drawing?.item_id?._id,
              piping_material_Specfication_id:
                drawing?.piping_material_specification?._id_spec
                || drawing?.piping_material_specification_id || drawing?.piping_material_Specfication_id,
              imir_no: Array.isArray(drawing?.imir_no)
                ? drawing.imir_no
                : drawing?.imir_no
                  ? [drawing.imir_no]
                  : [],
              packaged_qty: packagedQty || 0,
              issue_acceptance_id: drawing?.source_type === "RELEASE_NOTE" ? "" : drawing?.issue_acceptance_id,

              irn_id: drawing?.source_type === "RELEASE_NOTE" ? drawing?.irn_id : null,
              irn_no: drawing?.source_type === "RELEASE_NOTE" ? drawing?.irn_no : null,
            };
          }
          }
      
       

     const source_type = drawing?.source_type;

      // ✅ DUPLICATE CHECK (FROM CURRENT BACKEND DATA)
      const isDuplicate = submitArr.some(
        (item) =>
          item.drawing_id === newItem.drawing_id &&
          (item.item_id === newItem.item_id ||
          item.spool_id === newItem.spool_id ) && 
          item.piping_material_Specfication_id ===
          newItem.piping_material_Specfication_id
      );

      if (isDuplicate) {
        toast.error("This item is already added");
        return;
      }

      try {
        const res = await axios.post(
          `${V_URL}/user/piping/manage-multi-packing-offer`,
          {
            items: [newItem],
            project_id: localStorage.getItem("U_PROJECT_ID"),
            source_type: source_type,
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

          // ✅ UPDATE LOCAL STATE ONLY AFTER SUCCESS
          setSubmitArr((prev) => [...prev, newItem]);

          // refresh backend list
          dispatch(pipingGetMultiPacking());
          dispatch(getOfferDataforPackaing({ page: 1, limit: 10, search: "" }));
        }
        else {
          toast.error(res.data?.message || "Failed to add item");
        }
      } catch (error) {
        toast.error("Failed to add item");
      }
    },
    [submitArr, dispatch]
  );

  const refreshOfferData = () => {
    dispatch(getOfferDataforPackaing({ page: 1, limit: 10, search: "" }));
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
        dispatch(pipingGetMultiPacking());
        dispatch(getOfferDataforPackaing({ page: 1, limit: 10, search: "" }));
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

  const handleSubmit = () => {
    if (!submitArr.length) {
      toast.error("Please add drawings");
      return;
    }

    if (!validation()) return;

    const payload = {
      items: JSON.stringify(submitArr),
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
      
      // physical_weight: packingData.physical_weight,
    };

    dispatch(managePacking({ payload })).then((res) => {
      if (res.payload?.success) {
        toast.success(res.payload.message);
        navigate("/piping/user/packing-list");
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
                  <li className="breadcrumb-item"><Link to="/piping/user/packing-list">Packing List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item">{"Add"} Packing Record</li>
                </ul>
              </div>
            </div>
          </div>
          <PackageDrawingTable
            is_dispatch
            tableTitle="Drawing List"
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
          <AddDrawingForm
            modalOpen={isDrawingModalOpen}
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
