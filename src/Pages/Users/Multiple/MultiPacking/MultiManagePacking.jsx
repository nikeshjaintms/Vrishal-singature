import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getDrawing } from "../../../../Store/Erp/Planner/Draw/Draw";
import { getReleseNote } from "../../../../Store/Erp/ReleseNote/ReleseNote";
import { getPacking } from "../../../../Store/Erp/Packing/Packing";
import { AddPacking } from "../../../../Store/Erp/Packing/ManagePacking";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { PLAN } from "../../../../BaseUrl";
import Footer from "../../Include/Footer";
import DrawingTable from "../Components/DrawingTable/DrawingTable";
import PackingForm from "./CommanComponents/PackingForm";
import PackingTable from "./CommanComponents/PackingTable";
import SubmitButton from "../Components/SubmitButton/SubmitButton";
import PackingModel from "./CommanComponents/PackingModel";
import { GetMultiGenReleaseNote } from "../../../../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote";
import { managePacking } from "../../../../Store/MutipleDrawing/MultiPacking/ManagePacking";
import { getProject } from "../../../../Store/Store/Project/Project";
import { checkPacking } from "../../../../helper/hideDrawing";
import AddDrawingForm from "./CommanComponents/AddDrawingForm";

const MultiManagePacking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
//const data = location.state;
  const [data, setData] = useState([]);
  const { state } = useLocation();
  const { elem, type } = state || "";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [Errors, setErrors] = useState({});
  const [packingItems, setpackingItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setlimit] = useState(10);
  const [entity, setEntity] = useState([]);
  const [irnData, setIrnData] = useState([]);
  const [filterValue, setFilterValue] = useState({
    irn_no: "",
  });
  const [showItem, setShowItem] = useState(false);
  const [submitArr, setSubmitArr] = useState([]);
  const [matchDatas, setMatchDatas] = useState([]);
  const [unMatchedDatas, setUnMatchDatas] = useState([]);
  const proId = localStorage.getItem("U_PROJECT_ID");
const [drawingItems, setDrawingItems] = useState([]);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const IRNData = useSelector(
    (state) => state.GetMultiGenReleaseNote?.user?.data?.data
  );
  const [editeMode, setEditeMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  // const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState({});

  const [packingDeta, setPackingDeta] = useState({
    draw_id: "",
    irn_id: "",
    remark: "",
    consignment_no: "",
    physical_weight: "",
    destination: "",
    truck_no: "",
    driver_name: "",
    gst_no: "",
    eway_bill: "",
  });

  useEffect(() => {
    //SET STATE
    if (state) {
      setPackingDeta({
        draw_id: elem?.drawing_id?._id,
        irn_id: elem?.release_note_id?._id,
        remark: elem?.remarks,
        consignment_no: elem?.consignment_no,
        physical_weight: elem?.physical_weight,
        destination: elem?.destination,
        truck_no: elem?.vehicle_no,
        driver_name: elem?.driver_name,
        gst_no: elem?.gst_no,
        eway_bill: elem?.e_way_bill_no,
      });
    }
  }, [packingItems, state, IRNData]);
  useEffect(() => {
    //GET APIS
    dispatch(getDrawing());
    dispatch(GetMultiGenReleaseNote());
    dispatch(getPacking());
    dispatch(getProject());
  }, [dispatch]);

  const projectData = useSelector((state) => state?.getProject?.user?.data);

  useEffect(() => {
    if (proId) {
      if (projectData?.length > 0) {
        const { party, firm_id } = projectData?.find(
          (pro) => pro?._id === proId
        );
        if (party) {
          setPackingDeta({
            ...packingDeta,
            destination: `${party?.address},${party?.city},${party?.state} ${party?.pincode}`,
            gst_no: firm_id?.gst_no,
          });
        }
      }
    }
  }, [projectData]);

  useEffect(() => {
    //EDIT
    if (state) {
      if (elem?.drawing_id?._id === packingDeta?.draw_id) {
        setpackingItems(elem.drawing_id.items);
      }
    }
  }, [packingDeta?.draw_id, packingItems, IRNData]);

  useEffect(() => {
    const filteredData = filterValue.irn_no
      ? IRNData?.filter((ir) => ir?.report_no === filterValue.irn_no)
      : IRNData;

    const mergedArray = filteredData?.reduce((acc, record) => {
      record.items.forEach((item) => {
        const existingIndex = acc.findIndex(
          (entry) => entry.drawing_no === item.drawing_no
        );
        if (existingIndex > -1) {
          acc[existingIndex].items.push(item);
        } else {
          acc.push({
            drawing_no: item.drawing_no,
            rev: item.rev,
            assembly_no: item.assembly_no,
            assembly_quantity: item.assembly_quantity,
            sheet_no: item.sheet_no,
            items: [item],
          });
        }
      });
      return acc;
    }, []);

    setEntity(mergedArray);
  }, [IRNData, drawData, filterValue.irn_no]);

  const IRNOption =
    IRNData?.map((item) => ({
      label: item.report_no,
      value: item.report_no,
    })) || [];

  const handleIRN = (e, name) => {
    setFilterValue({ ...filterValue, [name]: e.target.value });
  };

  const checkCompletedDraw = async () => {
    const res = await checkPacking(entity);
    setMatchDatas(res.matchData);
    setUnMatchDatas(res.unmatchData);
  };

  useEffect(() => {
    checkCompletedDraw();
  }, [entity]);

  const commentsData = useMemo(() => {
    // let computedComments = entity || [];
    let computedComments = matchDatas || [];
    if (search) {
      computedComments = computedComments.filter(
        (dr) =>
          dr?.drawing_no
            ?.toString()
            ?.toLowerCase()
            ?.includes(search.toLowerCase()) ||
          dr?.rev?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
          dr?.assembly_no
            ?.toString()
            ?.toLowerCase()
            ?.includes(search.toLowerCase()) ||
          dr?.assembly_quantity
            ?.toString()
            ?.toLowerCase()
            ?.includes(search.toLowerCase()) ||
          dr?.unit_area?.toLowerCase()?.includes(search.toLowerCase()) ||
          dr?.sheet_no?.toLowerCase()?.includes(search.toLowerCase())
      );
    }
    computedComments.sort((a, b) => {
      const data1 = a?.drawing_no?.toString() || "";
      const data2 = b?.drawing_no?.toString() || "";
      return data1.localeCompare(data2, undefined, { numeric: true });
    });
    setTotalItems(computedComments?.length);
    return computedComments.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [search, limit, currentPage, entity, filterValue?.irn_no, matchDatas]);


  const validation = () => {
    let isValid = true;
    let err = {};

    if (!packingDeta.physical_weight) {
      isValid = false;
      err.physical_weight = "Please enter Physical Weight";
    }
    if (!packingDeta.consignment_no) {
      isValid = false;
      err.consignment_err = "Please enter consignment no";
    }
    if (!packingDeta.destination) {
      isValid = false;
      err.destination_err = "Please enter destination";
    }
    if (!packingDeta.truck_no) {
      isValid = false;
      err.truck_no_err = "Please enter truck no";
    }
    if (!packingDeta.driver_name) {
      isValid = false;
      err.driverName_err = "Please enter driver name";
    }
    if (!packingDeta.gst_no) {
      isValid = false;
      err.gst_no_err = "Please enter GST";
    }
    // if (!packingDeta.eway_bill) {
    //   isValid = false;
    //   err.eway_bill_err = "Please enter e-way bill";
    // }
    setErrors(err);
    return isValid;
  };

  const handleSubmit = () => {
    let updatedData = submitArr;
    if (updatedData.length === 0) {
      toast.error("Please add drawings");
      return;
    }

    const filteredData = updatedData.map((item) => ({
      rn_offer_id: item._id,
      drawing_id: item.drawing_id,
      grid_id: item.grid_id,
      rn_id: item.rn_id,
      rn_balance_grid_qty: item.rn_balance_grid_qty,
      rn_used_grid_qty: item.rn_used_grid_qty,
      moved_next_step: item.moved_next_step,
      unit_assembly_weight: parseFloat(item.unit_assembly_weight?.toFixed(2)),
      total_assembly_weight: parseFloat(item.total_assembly_weight?.toFixed(2)),
      remarks: item.remarks || null,

//  _id:item._id || undefined,
 item_name: item.item_name || undefined,
  drawing_no: item.drawing_no || undefined,
  grid_no: item.grid_no || undefined,
  irn_no: item.irn_no || undefined,
    
    }));

    if (validation()) {
      const payload = {
        items: JSON.stringify(filteredData),
        project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
        consignment_no: packingDeta.consignment_no,
        destination: packingDeta.destination,
        vehicle_no: packingDeta.truck_no,
        driver_name: packingDeta.driver_name,
        gst_no: packingDeta.gst_no,
        e_way_bill_no: packingDeta.eway_bill,
        remarks: packingDeta.remark,
        packed_by: localStorage.getItem("PAY_USER_ID"),
        physical_weight: packingDeta.physical_weight,
      };
      dispatch(managePacking({ payload: payload }))
        .then((res) => {
        
          if (res.payload.success === true) {
            navigate("/user/project-store/packing-list");
            toast.success(res.payload.message);
            setPackingDeta({
              remark: "",
              consignment_no: "",
              destination: "",
              truck_no: "",
              driver_name: "",
              gst_no: "",
              eway_bill: "",
            });
          }
        })
        .catch((error) => {
          console.log(error, "ERROR");
        });
    }

    
  };
  const handleAddMore = (item) => {
    setData((prevData) => {
      return [...prevData, item];
    });
  };
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddToArr = (data) => {
    setShowItem(true);
    setIrnData(data);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const itemToEdit = data[index];
    setEditeMode(true);
    setEditItem(itemToEdit);
    setModalOpen(true);
  };

// const handleSave = (item) => {

//     if (editeMode && editIndex !== null) {
//       setData((prevData) => {
//         const updatedData = [...prevData];
//         updatedData[editIndex] = item;
//         return updatedData;
//       });
//       setEditeMode(false);
//       setEditIndex(null);
     
//     } else {
//     //   setData((prevData) => [...prevData, item]);
//       setDrawingItems((prev) => [...prev, item]);


     
//       setEditeMode(false);
//     }
//     handleModalClose();
//   };

//   const handleSave = (item) => {
//   if (editeMode && editIndex !== null) {
//     setDrawingItems((prevData) => {
//       const updatedData = [...prevData];
//       updatedData[editIndex] = item;
//       return updatedData;
//     });
//     setEditeMode(false);
//     setEditIndex(null);
//   } else {
//     setDrawingItems((prevData) => [...prevData, item]);
//     setEditeMode(false);
//   }
//   handleModalClose();
// };



const handleSave = (item) => {
  if (editeMode && editIndex !== null) {
    setDrawingItems((prevData) => {
      const updatedData = [...prevData];
      updatedData[editIndex] = item;
      return updatedData;
    });
    setEditeMode(false);
    setEditIndex(null);
  } else {
    setDrawingItems((prevData) => [...prevData, item]); // This line adds new items
    setEditeMode(false);
  }
  handleModalClose();
};

const handleAddItem = () => {
    setEditeMode(false);
    setModalOpen(true);
   
};



  const handleModalClose = () => {
    setModalOpen(false);
  };


//   const handleSave = (item) => {
//     console.log("Adding to table:", item);
//     setTableData((prev) => [...prev, item]);
//   };
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
                  <li className="breadcrumb-item">
                    <Link to="/user/project-store/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/user/project-store/packing-list">
                      Packing List
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    {state?.type === "edit" ? "Edit" : "Add"} Packing Record
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="row mt-4">
                    <div className="col-12 col-md-4">
                      <div className=" mx-2">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>
                            {" "}
                            IRN No.<span className="login-danger">*</span>
                          </label>
                          <Dropdown
                            options={IRNOption}
                            value={filterValue?.irn_no}
                            filter
                            onChange={(e) => handleIRN(e, "irn_no")}
                            placeholder="IRN No."
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DrawingTable
            is_dispatch={true}
            tableTitle={"Drawing List"}
            commentsData={commentsData}
            handleAddToIssueArr={handleAddToArr}
            currentPage={currentPage}
            limit={limit}
            setlimit={setlimit}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
            setSearch={setSearch}
            data={data}
          />

          {/* <PackingTable
            irn_no={filterValue?.irn_no}
            onAddItem={handleAddItem}
            setSubmitArr={setSubmitArr}
            data={data}
            
            
          /> */}


<PackingTable
  data={{ items: drawingItems }}
  onAddItem={() => setModalOpen(true)}
  // setSubmitArr={setDrawingItems}
      setSubmitArr={setSubmitArr}

  
/>
          {/* <AddDrawingForm
            modalOpen={modalOpen}
            editItem={editItem}
            editeMode={editeMode}
            // handleSave={handleSave}
            handleAddMore={handleAddMore}
            handleModalClose={handleModalClose}
            onSaveItem={handleSave}
             modalMode="add"
            
          />
 */}

<AddDrawingForm
  modalOpen={modalOpen}
  handleModalClose={() => setModalOpen(false)}
  onSaveItem={(item) => {
    setDrawingItems((prev) => [...prev, item]);
    setModalOpen(false);
  }}
    handleSave={handleSave}
//   handleAddMore={(item) => setDrawingItems((prev) => [...prev, item])}
  handleAddMore={handleAddMore}
  modalMode="add"
   editItem={editItem}
            editeMode={editeMode}
/>


          <PackingForm
            packingDeta={packingDeta}
            setPackingDeta={setPackingDeta}
            Errors={Errors}
          />

          <SubmitButton
            finalReq={data?.items}
            // finalReq={drawingItems}
            link="/user/project-store/packing-list"
            handleSubmit={handleSubmit}
            buttonName={"Generate Packing List"}
          />
          
        </div>
        <Footer />
      </div>
      <PackingModel
        irn_no={filterValue?.irn_no}
        showItem={showItem}
        handleCloseModal={() => setShowItem(false)}
        title={"Drawing Grid List"}
        irnData={irnData}
      />
    </div>
  );
};
export default MultiManagePacking;
