import React, { useEffect, useState , useMemo} from 'react';
import { V_URL } from '../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import PressureTestItemModal from '../../../Components/PressureTest/PressureTestItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../../Store/Store/Item/Item';
import { getAreasAction } from '../../../Store/PoTeam/Area/AreaSlice';
import PressureTestSectionTable from '../../../Components/PressureTest/PressureTestSectionTable';
import PressureTestNote from '../../../Components/PressureTest/PressureTestTermCondition';
import PressureTestDrawingSectionTable from '../../../Components/PressureTest/PressureTestDrawingSectionTable';
import { getMaterialMtoById } from '../../../Store/PoTeam/MaterialMTO/MaterialMto';
import { Pencil, Trash2 } from "lucide-react";
import PressureTestDrawingTable from '../../Piping/Multiple/Components/DrawingTable/PressureTestDrawingTable';
import SubmitButton from '../../Piping/Multiple/Components/SubmitButton/SubmitButton';
import {getPressureTestDataFromFd} from '../../../Store/Piping/MultiPressureTestPiping/getPressureTestDataFromFd';
import {getPressureTestOfferTablePiping} from '../../../Store/Piping/MultiPressureTestPiping/getPressureTestOfferTablePiping';
import { getUserProcedureMaster } from '../../../Store/Piping/Procedure/ProcedureMaster';
import { Dropdown } from 'primereact/dropdown';

const ManagePressureTest = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [modalType, setModalType] = useState(""); 
  const [show, setShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [error, setError] = useState({});
  const [editData, setEditData] = useState({});
  const [editIndex, setEditIndex] = useState(null);
const [editedRows, setEditedRows] = useState({});
  const [finalId, setFinalId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
       const [totalItems, setTotalItems] = useState(0);
   
      const [limit, setlimit] = useState(10);
          const [search, setSearch] = useState('');
      
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state;

    const preTestDescriptions = [
  "Isometric checked as per P&ID & found correct",
  "Mechanical clearance satisfactory with / without punch points.",
  "NDT Records checked.",
  "Whether valves dropped?",
  "Flushing completed satisfactorily.",
  "Released for Pressure test."
];

const [testData, setTestData] = useState([
  { description: "Leak / Pressure test found satisfactory." },
  { description: "Valve leak test found satisfactory." },
  { description: "Draining / Drying Completed Satisfactory" },
]);

const [editRowIndex, setEditRowIndex] = useState(null);
const [tempStatus, setTempStatus] = useState({});
const [tempRemark, setTempRemark] = useState("");
const [preTestChecks, setPreTestChecks] = useState([
  {
    description: "Isometric checked as per P&ID & found correct",
    is_accepted: null,
    qc_remarks: ""
  },
  {
    description: "Mechanical clearance satisfactory with / without punch points.",
    is_accepted: null,
    qc_remarks: ""
  },
  {
    description: "NDT Records checked.",
    is_accepted: null,
    qc_remarks: ""
  },
  {
    description: "Whether valves dropped?",
    is_accepted: null,
    qc_remarks: ""
  },
  {
    description: "Flushing completed satisfactorily.",
    is_accepted: null,
    qc_remarks: ""
  },
  {
    description: "Released for Pressure test.",
    is_accepted: null,
    qc_remarks: ""
  }
]);
 const [pressureTestBasicDetails, setPressureTestBasicDetails] = useState({
        procedure: '',
         test_date: "",
          pid_reference_drawing: "",
  location: "",
  test_loop_no: "",
    });

    const [pressureTest, setPressureTest] = useState({ 
  working_pressure: "",
  working_temperature: "",
  design_pressure: "",
  design_temperature: "",
  test_pressure: "",
  test_medium: "",
  test_duration: "",
  start_time: "",
  finish_time: "",
});
const [gauge1, setGauge1] = useState({
  serial_number: "",
  validity: "",
  range: "",
});
const [gauge1Rows, setGauge1Rows] = useState([
  { time: "", pressure: "" }
]);
const [gauge2, setGauge2] = useState({
  serial_number: "",
  validity: "",
  range: "",
});

const [gauge2Rows, setGauge2Rows] = useState([
  { time: "", pressure: "" }
]);

  const [mto, setMto] = useState({
    poNumber: "",
   
    item_id: ""
  });
// const validateForm = (formData = {}) => {
//   let newErrors = {};

//   // ================= BASIC DETAILS =================
//   if (!pressureTestBasicDetails.procedure?.trim())
//     newErrors.procedure = "Procedure is required";

//   if (!pressureTestBasicDetails.pid_reference_drawing?.trim())
//     newErrors.pid_reference_drawing = "P&ID Reference Drawing is required";

//   if (!pressureTestBasicDetails.test_date)
//     newErrors.test_date = "Test Date is required";

//   if (!pressureTestBasicDetails.location?.trim())
//     newErrors.location = "Location is required";

//   if (!pressureTestBasicDetails.test_loop_no?.trim())
//     newErrors.test_loop_no = "Test Loop No. is required";


//   // ================= TEST DETAILS =================
//   Object.entries(pressureTest).forEach(([key, value]) => {
//     if (!value?.toString().trim()) {
//       newErrors[key] = "This field is required";
//     }
//   });


//   // ================= TIME VALIDATION =================
//   if (
//     pressureTest.start_time &&
//     pressureTest.finish_time &&
//     pressureTest.start_time >= pressureTest.finish_time
//   ) {
//     newErrors.finish_time = "Finish time must be greater than Start time";
//   }


//   // ================= GAUGE 1 =================
//   if (!gauge1.serial_number?.trim())
//     newErrors.g1_serial = "Gauge 1 Serial Number required";

//   if (!gauge1.validity)
//     newErrors.g1_validity = "Gauge 1 Validity required";

//   if (!gauge1.range?.trim())
//     newErrors.g1_range = "Gauge 1 Range required";

//   if (gauge1Rows.length === 0)
//     newErrors.g1_rows = "At least one Gauge 1 reading required";

//   gauge1Rows.forEach((row, index) => {
//     if (!row.time)
//       newErrors[`g1_time_${index}`] = "Time required";

//     if (!row.pressure?.toString().trim())
//       newErrors[`g1_pressure_${index}`] = "Pressure required";
//   });


//   // ================= GAUGE 2 =================
//   if (!gauge2.serial_number?.trim())
//     newErrors.g2_serial = "Gauge 2 Serial Number required";

//   if (!gauge2.validity)
//     newErrors.g2_validity = "Gauge 2 Validity required";

//   if (!gauge2.range?.trim())
//     newErrors.g2_range = "Gauge 2 Range required";

//   if (gauge2Rows.length === 0)
//     newErrors.g2_rows = "At least one Gauge 2 reading required";

//   gauge2Rows.forEach((row, index) => {
//     if (!row.time)
//       newErrors[`g2_time_${index}`] = "Time required";

//     if (!row.pressure?.toString().trim())
//       newErrors[`g2_pressure_${index}`] = "Pressure required";
//   });


//   // ================= PRE TEST CHECKS =================
//   const hasPendingPreTest = preTestChecks.some(
//     row => row.is_accepted === null || row.is_accepted === undefined
//   );

//   if (hasPendingPreTest)
//     newErrors.pre_test_checks = "All Pre-Test rows must be accepted or rejected";


//   // ================= TEST RESULT =================
//   const hasPendingTest = testData.some(
//     row => row.is_accepted === null || row.is_accepted === undefined
//   );

//   if (hasPendingTest)
//     newErrors.testData = "All Test Result rows must be accepted or rejected";


//   // ================= CHECKBOX VALIDATION =================
//   if (!formData?.isBlastingPainting && !formData?.isSiteDispatch) {
//     newErrors.checkboxSelection =
//       "Please select either Blasting & Painting OR Site Dispatch";
//   }


//   // ================= ITEM VALIDATION =================
//   if (!pressureTestOfferData || pressureTestOfferData.length === 0) {
//     newErrors.items = "At least one item must be selected";
//   }


//   setError(newErrors);

//   return Object.keys(newErrors).length === 0;
// };

const validateForm = (formData = {}) => {
  let newErrors = {};

  // ================= BASIC DETAILS =================
  if (!pressureTestBasicDetails.procedure?.trim())
    newErrors.procedure = "Procedure is required";

  if (!pressureTestBasicDetails.pid_reference_drawing?.trim())
    newErrors.pid_reference_drawing = "P&ID Reference Drawing is required";

  if (!pressureTestBasicDetails.test_date)
    newErrors.test_date = "Test Date is required";

  if (!pressureTestBasicDetails.location?.trim())
    newErrors.location = "Location is required";

  if (!pressureTestBasicDetails.test_loop_no?.trim())
    newErrors.test_loop_no = "Test Loop No. is required";

  // ================= TEST DETAILS =================
  Object.entries(pressureTest).forEach(([key, value]) => {
    if (!value?.toString().trim()) {
      newErrors[key] = "This field is required";
    }
  });

  // ================= TIME VALIDATION =================
  // if (
  //   pressureTest.start_time &&
  //   pressureTest.finish_time &&
  //   pressureTest.start_time >= pressureTest.finish_time
  // ) {
  //   newErrors.finish_time = "Finish time must be greater than Start time";
  // }

// ================= GAUGE 1 =================
if (!gauge1.serial_number?.trim())
  newErrors.g1_serial = "Gauge 1 Serial Number is required";

if (!gauge1.validity)
  newErrors.g1_validity = "Gauge 1 Validity is required";

if (!gauge1.range?.trim())
  newErrors.g1_range = "Gauge 1 Range is required";

if (gauge1Rows.length === 0)
  newErrors.g1_rows = "At least one Gauge 1 reading is required";

gauge1Rows.forEach((row, index) => {
  if (!row.time)
    newErrors[`g1_time_${index}`] = "Time is required";

  if (!row.pressure?.toString().trim())
    newErrors[`g1_pressure_${index}`] = "Pressure is required";
});


// ================= GAUGE 2 =================
if (!gauge2.serial_number?.trim())
  newErrors.g2_serial = "Gauge 2 Serial Number is required";

if (!gauge2.validity)
  newErrors.g2_validity = "Gauge 2 Validity is required";

if (!gauge2.range?.trim())
  newErrors.g2_range = "Gauge 2 Range is required";

if (gauge2Rows.length === 0)
  newErrors.g2_rows = "At least one Gauge 2 reading is required";

gauge2Rows.forEach((row, index) => {
  if (!row.time)
    newErrors[`g2_time_${index}`] = "Time is required";

  if (!row.pressure?.toString().trim())
    newErrors[`g2_pressure_${index}`] = "Pressure is required";
});

  // ================= PRE TEST CHECK =================
  const hasPendingPreTest = preTestChecks.some(
    row => row.is_accepted === null || row.is_accepted === undefined
  );

  if (hasPendingPreTest)
    newErrors.pre_test_checks = true;

  // ================= TEST RESULT =================
  const hasPendingTest = testData.some(
    row => row.is_accepted === null || row.is_accepted === undefined
  );

  if (hasPendingTest)
    newErrors.testData = true;

  // ================= ITEM VALIDATION =================
  if (!pressureTestOfferData || pressureTestOfferData.length === 0) {
    newErrors.items = true;
  }

  setError(newErrors);

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};

const handlePreTestStatus = (index, value) => {
  const updated = [...preTestChecks];
  // updated[index].is_accepted = value;
    updated[index].is_accepted = Number(value); 
  setPreTestChecks(updated);
};

const handlePreTestRemark = (index, value) => {
  const updated = [...preTestChecks];
  updated[index].qc_remarks = value;
  setPreTestChecks(updated);
};
// const handleBasicChange = (e) => {
//   const { name, value } = e.target;

//   setPressureTestBasicDetails(prev => ({
//     ...prev,
//     [name]: value
//   }));
// };

const handleBasicChange = (e) => {
  const { name, value } = e.target;

  setPressureTestBasicDetails(prev => ({
    ...prev,
    [name]: value
  }));

  setError(prev => ({
    ...prev,
    [name]: ""
  }));
};

//   const handleMainChange = (e) => {
//   const { name, value } = e.target;
//   setPressureTest((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };
const handleMainChange = (e) => {
  const { name, value } = e.target;

  setPressureTest(prev => ({
    ...prev,
    [name]: value,
  }));

  setError(prev => ({
    ...prev,
    [name]: ""
  }));
};
// const handleGauge1Change = (e) => {
//   const { name, value } = e.target;
//   setGauge1((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };
const handleGauge1Change = (e) => {
  const { name, value } = e.target;

  setGauge1(prev => ({
    ...prev,
    [name]: value
  }));

  setError(prev => ({
    ...prev,
    [`g1_${name}`]: ""
  }));
};
// const handleGauge2Change = (e) => {
//   const { name, value } = e.target;
//   setGauge2((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// };
const handleGauge2Change = (e) => {
  const { name, value } = e.target;

  setGauge2(prev => ({
    ...prev,
    [name]: value
  }));

  setError(prev => ({
    ...prev,
    [`g2_${name}`]: ""
  }));
};
const handleRowSave = (index) => {
  const rowData = preTestChecks[index];

  // Call API here if needed
  console.log("Saving Row:", rowData);
};
  const handleFileChange = (e) => setUploadFile(e.target.files[0]);

     useEffect(() => {
          dispatch(getUserProcedureMaster({ status: 'true' }))
      }, []);
  useEffect(() => {
    dispatch(getPressureTestDataFromFd({page:currentPage, limit,search, project: localStorage.getItem('U_PROJECT_ID') }));
    dispatch(getPressureTestOfferTablePiping({page:currentPage, limit,search, project_id: localStorage.getItem('U_PROJECT_ID')}));
  }, [dispatch, currentPage, limit, search]);

  useEffect(() => {
    dispatch(getItem({ is_main: false }));
    dispatch(getAreasAction({ project: localStorage.getItem('U_PROJECT_ID') }));
  }, [navigate, disable, dispatch]);

  useEffect(() => {
    if (location.state) {
      setMto({
        poNumber: location.state?.poNumber,
        date: moment(location.state?.date).format('YYYY-MM-DD'),
        item_id: location.state?.item_id || ""
      });
    }

    if (location.state?._id) {
      dispatch(getMaterialMtoById({ id: location.state?._id }));
    } else if (finalId) {
      dispatch(getMaterialMtoById({ id: finalId }));
    }
  }, [location.state, dispatch, finalId]);

  const refreshData = () => {
    dispatch(getMaterialMtoById({ id: finalId || location.state?._id }));
  };

   const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);
  const fdData = useSelector((state) => state?.getPressureTestDataFromFd?.user?.data);
  const pagination = useSelector((state) => state?.getPressureTestDataFromFd?.user?.pagination);
  const pressureTestOfferData = useSelector((state)=> state?.getPressureTestOfferTablePiping?.user?.data);
  console.log("pressureTestOfferData=========>",pressureTestOfferData);


  console.log("fdData=========>",fdData);
  const itemData = useSelector((state) => state?.getItem?.user?.data);
  const mtoItemsData = useSelector((state) => state?.materialMto?.single?.items) || [];
  const areas = useSelector((state) => state?.getAreas?.data?.areas) || [];

  const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
    }));
    const commentsData = useMemo(() => {
  if (!fdData) return [];

  return fdData.flatMap(doc =>
    doc.items.map(item => ({
      ...item,
      parent_id: doc._id,        // 🔥 FD main document ID
      report_no: doc.report_no,
      isHydroTesting: doc.isHydroTesting
    }))
  );
}, [fdData]);

    console.log("commentsData", commentsData);

useEffect(() => {
    setTotalItems(pagination?.totalItems || 0);
}, [pagination]);

const handleAddToArr = async (row) => {
  if (!row) {
    toast.error("Invalid row data");
    return;
  }

  try {
    setDisable(true);

    if (row.is_added_pressure_test === true) {
      toast.error("Already Added");
      setDisable(false);
      return;
    }

    const formattedItem = {
      fd_id: row.parent_id,           // ✅ FD main document ID
      drawing_id: row.drawing_id,
      spool_no_id: row.spool_no_id,
      weld_visual_id: row.weld_visual_id,
      fd_item_id: row._id      // ✅ FD item _id
    };

    const payload = {
      project_id: localStorage.getItem("U_PROJECT_ID"),
      ndt_master_id: row.weld_visual_id,
      items: [formattedItem]
    };

    const res = await axios.post(
      `${V_URL}/user/piping-manage-pressure-test-offer`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      dispatch(
        getPressureTestDataFromFd({
          page: currentPage,
          limit,
          search,
          project: localStorage.getItem("U_PROJECT_ID"),
        })
      );
       dispatch(getPressureTestOfferTablePiping({page:currentPage, limit,search, project_id: localStorage.getItem('U_PROJECT_ID')}));
    }

  } catch (err) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  } finally {
    setDisable(false);
  }
};

  const handleClose = () => {
    setEditData({});
    setShow(false);
    setModalType("");
  };





  const handleUpload = async () => {
    if (!uploadFile) return toast.error("Please select a file!");
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("mto_id", data?._id || finalId);

    try {
      const response = await axios.post(
        `${V_URL}/user/mto/import-mto-items`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );
      toast.success(response.data.message || `Imported ${response.data.data.importedCount || 0} items successfully!`);
      setUploadFile(null);
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "File upload failed!");
    }
  };

  const handleSaveModal = (mtoData, addMore) => {
    const myurl = `${V_URL}/user/material/manage-mto-items`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("mto_id", data?._id || finalId);

    if (mtoData?.id) bodyFormData.append("id", mtoData.id);
    bodyFormData.append("item_id", mtoData.item_id);
    bodyFormData.append("material_grade", mtoData.material_grade || "");
    bodyFormData.append("gadClientQty", mtoData.gadClientQty || 0);
    bodyFormData.append("fabDrawingQty", mtoData.fabDrawingQty || 0);
    bodyFormData.append("remarks", mtoData.remarks || "");
    bodyFormData.append("areaBuilding", mtoData.areaBuilding || "");

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
        if (response.data.success) toast.success(response.data.message);
        refreshData();
        setEditData({});
        if (!addMore) handleClose();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Something went wrong");
      });
  };

  const handleEdit = (editData) => {
    setEditData(editData);
    refreshData();
    setShow(true);
  };

 
  const handleDelete = async (offerId) => {
  try {
    const res = await axios.delete(
      `${V_URL}/user/delete-pressure-test-offer-piping`,
      {
        data: { _id: offerId }, // IMPORTANT for DELETE
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
 dispatch(
        getPressureTestDataFromFd({
          page: currentPage,
          limit,
          search,
          project: localStorage.getItem("U_PROJECT_ID"),
        })
      );
     dispatch(getPressureTestOfferTablePiping({page:currentPage, limit,search, project_id: localStorage.getItem('U_PROJECT_ID')}));

    }

  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  }
};


// const handleGeneratePressureTest = async (formData) => {
//   if (!validateForm(formData)) {
//     toast.error("Please fix validation errors");
//     return;
//   }

//   try {
//     setDisable(true);

//     const payload = {
//       project_id: localStorage.getItem("U_PROJECT_ID"),
//       project: localStorage.getItem("PAY_USER_PROJECT_NAME"),

//       procedure: pressureTestBasicDetails.procedure,
//       pid_reference_drawing: pressureTestBasicDetails.pid_reference_drawing,
//       test_date: pressureTestBasicDetails.test_date,
//       location: pressureTestBasicDetails.location,
//       test_loop_no: pressureTestBasicDetails.test_loop_no,

//       isBlastingPainting: Boolean(formData?.isBlastingPainting),
//       isSiteDispatch: Boolean(formData?.isSiteDispatch),

//       ...pressureTest,

//       gauge1,
//       gauge1Rows,
//       gauge2,
//       gauge2Rows,

//       pre_test_checks: preTestChecks,
//       testData: testData,
//       items: pressureTestOfferData || []
//     };

//     const response = await axios.post(
//       `${V_URL}/user/piping-generate-pressure-test`,
//       payload,
//       {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       }
//     );

//     if (response.data.success) {
//       toast.success(response.data.message);
//       navigate("/piping/user/pressure-test");
//     }

//   } catch (error) {
//     toast.error(error?.response?.data?.message || "Generation Failed");
//   } finally {
//     setDisable(false);
//   }
// };
 
const handleGeneratePressureTest = async (formData) => {

  const { isValid, errors } = validateForm(formData);

 if (!isValid) {

  let errorMessages = [];

  if (errors.pre_test_checks) {
    errorMessages.push("• Please Accept or Reject all Pre-Test Checks");
  }

  if (errors.testData) {
    errorMessages.push("• Please Accept or Reject all Test Result rows");
  }

  if (errors.items) {
    errorMessages.push("• Please select at least one drawing item before generating");
  }

  // If other field errors exist
  const hasOtherErrors =
    Object.keys(errors).length >
    (errors.pre_test_checks ? 1 : 0) +
    (errors.testData ? 1 : 0) +
    (errors.items ? 1 : 0);

  if (hasOtherErrors) {
    errorMessages.push("• Please complete all required fields properly");
  }

  toast.error(errorMessages.join("\n"), {
    duration: 5000,
  });

  return;
}

  try {
    setDisable(true);

    const payload = {
      project_id: localStorage.getItem("U_PROJECT_ID"),
      project: localStorage.getItem("PAY_USER_PROJECT_NAME"),

      procedure: pressureTestBasicDetails.procedure,
      pid_reference_drawing: pressureTestBasicDetails.pid_reference_drawing,
      test_date: pressureTestBasicDetails.test_date,
      location: pressureTestBasicDetails.location,
      test_loop_no: pressureTestBasicDetails.test_loop_no,

      isBlastingPainting: Boolean(formData?.isBlastingPainting),
      isSiteDispatch: Boolean(formData?.isSiteDispatch),

      ...pressureTest,

      gauge1,
      gauge1Rows,
      gauge2,
      gauge2Rows,

      pre_test_checks: preTestChecks,
      testData: testData,
      items: pressureTestOfferData || []
    };

    const response = await axios.post(
      `${V_URL}/user/piping-generate-pressure-test`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);
       // 🔥 RESET STATE (important)
  setPreTestChecks(prev =>
    prev.map(item => ({
      ...item,
      is_accepted: null,
      qc_remarks: ""
    }))
  );

  setTestData(prev =>
    prev.map(item => ({
      ...item,
      is_accepted: null,
      qc_remarks: ""
    }))
  );
      navigate("/piping/user/pressure-test");
    }

  } catch (error) {
    toast.error(error?.response?.data?.message || "Generation Failed");
  } finally {
    setDisable(false);
  }
};

const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);



//   const handleSaveClick = async (index, row, editedData) => {
//     console.log("Saving Row:", row);
//   try {
//     const payload = {
//       offer_id: row?._id,          
//       item_id: row?.items?._id,
//       remarks: editedData.remarks,
//     };

//     const res = await axios.post(
//       `${V_URL}/user/verify-pressure-test-inspection-piping`,
//       payload,
//       {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       }
//     );

//     if (res.data.success) {
//       toast.success(res.data.message);
//       dispatch(getPressureTestOfferTablePiping({page:currentPage, limit,search, project_id: localStorage.getItem('U_PROJECT_ID')}));
//     }

//   } catch (err) {
//     console.error(err);
//     toast.error(err?.response?.data?.message || "Update failed");
//   }
// };

const handleSaveClick = async (report, item, editedData) => {
  console.log("Report:", report);
  console.log("Item:", item);

  try {
    const payload = {
      offer_id: report,
      item_id: item,
      remarks: editedData.remarks,
    };

    const res = await axios.post(
      `${V_URL}/user/verify-pressure-test-inspection-piping`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      dispatch(
        getPressureTestOfferTablePiping({
          page: currentPage,
          limit,
          search,
          project_id: localStorage.getItem("U_PROJECT_ID"),
        })
      );
    }
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Update failed");
  }
};

  // ---------------- GAUGE 1 ----------------
const handleGauge1RowChange = (index, e) => {
  const { name, value } = e.target;
  const updatedRows = [...gauge1Rows];
  updatedRows[index][name] = value;
  setGauge1Rows(updatedRows);
};

const handleAddGauge1Row = () => {
  setGauge1Rows([...gauge1Rows, { time: "", pressure: "" }]);
};

const handleRemoveGauge1Row = (index) => {
  const updated = gauge1Rows.filter((_, i) => i !== index);
  setGauge1Rows(updated);
};


// ---------------- GAUGE 2 ----------------
const handleGauge2RowChange = (index, e) => {
  const { name, value } = e.target;
  const updatedRows = [...gauge2Rows];
  updatedRows[index][name] = value;
  setGauge2Rows(updatedRows);
};

const handleAddGauge2Row = () => {
  setGauge2Rows([...gauge2Rows, { time: "", pressure: "" }]);
};

const handleRemoveGauge2Row = (index) => {
  const updated = gauge2Rows.filter((_, i) => i !== index);
  setGauge2Rows(updated);
};

 


    const handleChange = (e, name) => {
        setPressureTestBasicDetails({ ...pressureTestBasicDetails, [name]: e.target.value });
    };

 

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* Header */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/pressure-test">Pressure Test List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Pressure Test
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <PressureTestDrawingTable
                  is_dispatch={true}
                  tableTitle={'Drawing List'}
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
            </div>
          </div>
          {/* {error.items && (
            <div className="text-danger">{error.items}</div>
          )} */}
          <div className="row">
            <div className="col-sm-12">
              <PressureTestDrawingSectionTable
                  transactionData={pressureTestOfferData}
                  handleSaveClick={handleSaveClick}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  finalId={finalId}
                  dataId={data?._id}
                />
            </div>
          </div>

               
          {/* Form */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? "Edit" : "Add"} Pressure Test Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Procedure No.</label>
                           <Dropdown
                                                                                 options={procedureOptions}
                                                                                 value={pressureTestBasicDetails.procedure}
                                                                                //  disabled={isViewMode}
                                                                                //  onChange={(e) => handleChange(e, 'procedure')}
                                                                                // onChange={(e) =>
                                                                                //       setPressureTestBasicDetails(prev => ({
                                                                                //         ...prev,
                                                                                //         procedure: e.value
                                                                                //       }))
                                                                                      
                                                                                //     }
onChange={(e) => {
  setPressureTestBasicDetails(prev => ({
    ...prev,
    procedure: e.value
  }));

  setError(prev => ({
    ...prev,
    procedure: ""
  }));
}}
                                                                                 filter className='w-100'
                                                                                 placeholder="Select Procedure No."
                                                                             />
                                                                              <div className='error text-danger'>{error?.procedure}</div>
                                                                              
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>P&ID Reference Drawing</label>
                          {/* <input className="form-control" type="text" name="pid_reference_drawing" /> */}
                          <input
                          className="form-control"
  name="pid_reference_drawing"
  value={pressureTestBasicDetails.pid_reference_drawing}
  onChange={handleBasicChange}
/>
<div className='error text-danger'>{error.pid_reference_drawing}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Test Date</label>
                          <input  className="form-control" type="date"  onChange={handleBasicChange} name="test_date" value={pressureTestBasicDetails.test_date} />
<div className='error text-danger'>{error.test_date}</div>
                        
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Location</label>
                      <input
                      className="form-control"
  name="location"
  value={pressureTestBasicDetails.location}
  onChange={handleBasicChange}
/>
<div className='error text-danger'>{error.location}</div>

                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Test Loop No.</label>
                          {/* <input className="form-control" type="text"  name="test_loop_no" /> */}
                          <input
                          className="form-control"
  name="test_loop_no"
  value={pressureTestBasicDetails.test_loop_no}
  onChange={handleBasicChange}
/>
<div className='error text-danger'>{error.test_loop_no}</div>
                        </div>
                      </div>                      
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Item Table */}
          {/* {error.pre_test_checks && (
            <div className="text-danger">{error.pre_test_checks}</div>
          )} */}
          <div className="row">
            <div className="col-sm-12">
             <PressureTestSectionTable
   preTestChecks={preTestChecks}
   setPreTestChecks ={setPreTestChecks }
   handlePreTestStatus={handlePreTestStatus}
   handlePreTestRemark={handlePreTestRemark}
   handleRowSave={handleRowSave}
/>

            </div>
          </div>

          {/* Form */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? "Edit" : "Add"} Pressure Test Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Working Pressure</label>
                        <input
                            className="form-control"
                            type="text"
                            name="working_pressure"
                            value={pressureTest.working_pressure}
                            onChange={handleMainChange}
                          />
                          <div className='error text-danger'>{error.working_pressure}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Working Temperature</label>
                          {/* <input className="form-control" type="text" name="working_temperature" /> */}
                          <input
  className="form-control"
  type="text"
  name="working_temperature"
  value={pressureTest.working_temperature}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.working_temperature}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Design Pressure</label>
                          {/* <input className="form-control" type="text" name="design_pressure" /> */}

                          <input
  className="form-control"
  type="text"
  name="design_pressure"
  value={pressureTest.design_pressure}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.design_pressure}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Design Temperature</label>
                          {/* <input className="form-control" type="text" name="design_temperature" /> */}
                          <input
  className="form-control"
  type="text"
  name="design_temperature"
  value={pressureTest.design_temperature}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.design_temperature}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Test Pressure</label>
                          {/* <input className="form-control" type="text"  name="test_pressure" /> */}
                          <input
  className="form-control"
  type="text"
  name="test_pressure"
  value={pressureTest.test_pressure}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.test_pressure}</div>
                        </div>
                      </div>     
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Test Medium</label>
                          {/* <input className="form-control" type="text"  name="test_medium" /> */}
                          <input
  className="form-control"
  type="text"
  name="test_medium"
  value={pressureTest.test_medium}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.test_medium}</div>
                        </div>
                      </div>                      
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Test Duration</label>
                          {/* <input className="form-control" type="text"  name="test_duration" /> */}
                          <input
  className="form-control"
  type="text"
  name="test_duration"
  value={pressureTest.test_duration}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.test_duration}</div>
                        </div>
                      </div>     
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Start Time</label>
                          {/* <input className="form-control" type="date"  name="start_time" /> */}
                          <input
  className="form-control"
  type="time"
  name="start_time"
  value={pressureTest.start_time}
  onChange={handleMainChange}
/>
<div className='error text-danger'>{error.start_time}</div>
                        </div>
                      </div>     
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms">
                          <label>Finish Time</label>
                          {/* <input className="form-control" type="date"  name="finish_time" /> */}
                          <input
                            className="form-control"
                            type="time"
                            name="finish_time"
                            value={pressureTest.finish_time}
                            onChange={handleMainChange}
                          />
                          <div className='error text-danger'>{error.finish_time}</div>
                        </div>
                      </div>     
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>{data?._id ? "Edit" : "Add"} Pressure Gauge 1</h4>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Serial Number</label>
                          {/* <input className="form-control" type="text" name="serial_number" /> */}
                          <input
                              className="form-control"
                              type="text"
                              name="serial_number"
                              value={gauge1.serial_number}
                              onChange={handleGauge1Change}
                            />
                            <div className='error text-danger'>{error.g1_serial}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Validity</label>
                          {/* <input className="form-control" type="text" name="validity" /> */}
                           <input
  className="form-control"
  type="date"
  name="validity"
  value={gauge1.validity}
  onChange={handleGauge1Change}
/>
<div className='error text-danger'>{error.g1_validity}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Range</label>
                          {/* <input className="form-control" type="text" /> */}
                          <input
  className="form-control"
  type="text"
  name="range"
  value={gauge1.range}
  onChange={handleGauge1Change}
/>
<div className='error text-danger'>{error.g1_range}</div>
                        </div>
                      </div>
                      <div className="add-group mb-4 text-end">
                        <button
                          type="button"
                          onClick={handleAddGauge1Row}
                          className="btn btn-primary add-pluss ms-2"
                          data-toggle="tooltip"
                          data-placement="top"
                        >
                          <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                        </button>
                        </div>  
                      {gauge1Rows.map((row, index) => (
                        <React.Fragment key={index}>
                          <div className="col-12 col-md-5 col-xl-5">
                            <div className="input-block local-forms">
                              <label>Time</label>
                              <input
                                className="form-control"
                                type="time"
                                name="time"
                              value={row.time}
onChange={(e) => handleGauge1RowChange(index, e)}
                              />
                              <div className='error text-danger'>
  {error[`g1_time_${index}`]}
</div>
                            </div>
                          </div>

                          <div className="col-12 col-md-5 col-xl-5">
                            <div className="input-block local-forms">
                              <label>Test Pressure (kg/cm²)</label>
                              <input
                                className="form-control"
                                type="text"
                                name="pressure"
                               value={row.pressure}
onChange={(e) => handleGauge1RowChange(index, e)}
                              />
                             <div className='error text-danger'>
  {error[`g1_pressure_${index}`]}
</div>
                            </div>
                          </div>

                          <div className="col-2 mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-danger ms-2" 
                             onClick={() => handleRemoveGauge1Row(index)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </React.Fragment>
                      ))}

                        
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>{data?._id ? "Edit" : "Add"} Pressure Gauge 2</h4>
                        </div>
                      </div>
                       <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Serial Number</label>
                          {/* <input className="form-control" type="text" name="serial_number" /> */}
                          <input
  className="form-control"
  type="text"
  name="serial_number"
  value={gauge2.serial_number}
  onChange={handleGauge2Change}
/>
<div className='error text-danger'>{error.g2_serial}</div>

                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Validity</label>
                          {/* <input className="form-control" type="text" name="validity" /> */}
                           <input
  className="form-control"
  type="date"
  name="validity"
  value={gauge2.validity}
  onChange={handleGauge2Change}
/>
<div className='error text-danger'>{error.g2_validity}</div>

                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Range</label>
                          {/* <input className="form-control" type="text" /> */}
                          <input
  className="form-control"
  type="text"
  name="range"
  value={gauge2.range}
  onChange={handleGauge2Change}
/>
<div className='error text-danger'>{error.g2_range}</div>

                        </div>
                      </div>
                     <div className="add-group mb-4 text-end">
                        <button
                          type="button"
                          onClick={handleAddGauge2Row}
                          className="btn btn-primary add-pluss ms-2"
                          data-toggle="tooltip"
                          data-placement="top"
                        >
                          <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                        </button>
                        </div>  
                      {gauge2Rows.map((row, index) => (
                        <React.Fragment key={index}>
                          <div className="col-12 col-md-5 col-xl-5">
                            <div className="input-block local-forms">
                              <label>Time</label>
                              <input
                                className="form-control"
                                type="time"
                                name="time"
                               value={row.time}
onChange={(e) => handleGauge2RowChange(index, e)}
                              />
                              <div className='error text-danger'>
  {error[`g2_time_${index}`]}
</div>
                            </div>
                          </div>

                          <div className="col-12 col-md-5 col-xl-5">
                            <div className="input-block local-forms">
                              <label>Test Pressure (kg/cm²)</label>
                              <input
                                className="form-control"
                                type="text"
                                name="pressure"
                              value={row.pressure}
onChange={(e) => handleGauge2RowChange(index, e)}
                              />
                              <div className='error text-danger'>
  {error[`g2_pressure_${index}`]}
</div>
                            </div>
                          </div>

                          <div className="col-2 mb-3">

                            <button
                                type="button"
                                className="btn btn-outline-danger ms-2" 
                              onClick={() => handleRemoveGauge2Row(index)}
                              >
                                <Trash2 size={18} />
                              </button>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>


      
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {/* {error.testData && (
            <div className="text-danger">{error.testData}</div>
          )} */}
          <div className="row">
            <div className="col-sm-12">
              <PressureTestNote
                 testData={testData}
  setTestData={setTestData}
  editRowIndex={editRowIndex}
  setEditRowIndex={setEditRowIndex}
  tempStatus={tempStatus}
  setTempStatus={setTempStatus}
  tempRemark={tempRemark}
  setTempRemark={setTempRemark}
                />

            </div>
          </div>

       

                      <SubmitButton disable={disable} handleSubmit={handleGeneratePressureTest} showPressureTest={true}
                                             buttonName={'Generate Pressure Test'} />
             

        </div>
      </div>

      {/* Direct Modal */}
      <PressureTestItemModal
        show={show}               
        handleClose={handleClose}
        itemData={itemData}
        handleSaveModal={handleSaveModal}
        handleUpload={handleUpload}
        editData={editData}
        drawId={finalId || data?._id}
        finalId={finalId}
        uploadFile={uploadFile}
        handleFileChange={handleFileChange}
        areasData={areas}
      />


    </div>
  );
};

export default ManagePressureTest;
