import React, { useEffect, useState } from "react";
import { PLAN, V_URL } from "../../../../BaseUrl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import DrawFromValidForPiping from "../../../../Components/Validation/Draw/DrawFromValidForPiping";
import moment from "moment";
import Swal from "sweetalert2";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import Footer from "../../Include/Footer";
import DrawingModal from "../../../../Components/Piping/DrawingModal/DrawingModal";
import JointEntryModal from "../../../../Components/Piping/DrawingModal/JointEntryModel";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetails } from "../../../../Store/Piping/Item/Item";
import DrawSectionTable from "../../../../Components/Piping/DrawingModal/DrawSectionTable";
import JointWiseEntryTable from "../../../../Components/Piping/DrawingModal/JointWiseEntryTable";
import {
  clearDrawItems,
  getMaterialEntryItems,
} from "../../../../Store/Piping/Drawing/getMaterialEntryItems";
import {
  clearJointItems,
  getJointEntryItems,
} from "../../../../Store/Piping/Drawing/getJointEntryItems";
import { getAreasAction } from "../../../../Store/Piping/Area/AreaSlicePiping";
import { getUserPipingClassMaster } from "../../../../Store/Piping/PipingClass/PipingClassMaster";

const ManageDrawing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [error, setError] = useState({});

  const [show, setShow] = useState(false);
  const [showJoint, setShowJoint] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [materialWiseEntryItems, setMaterialWiseEntryItems] = useState([]);

  const [selectedJoint, setSelectedJoint] = useState(null);
  const [selectedDrawingId, setSelectedDrawingId] = useState(null);
  const [status, setStatus] = useState(0);
  // const [isFitupDone, setIsFitupDone] = useState(false);
  const [draw, setDraw] = useState({
    drawing_no: "",
    drawing_receive_date: "",
    piping_class: "",
    service: "",
    service_id: "",
    area_unit: "",
    drawing_received_lot_no: "",
    p_id_drawing_no: "",
    // unit: "",
    rev: 0,
    // assembly_no: "",
    // sheet_no: "",
    // assembly_qty: "",
    pdf_url: "",
    pdf_name: "",
  });
  console.log("draw", draw);
  const [editData, setEditData] = useState({});
  const [jointEditData, setJointEditData] = useState({});
  const [finalId, setFinalId] = useState("");
  const data = location.state;
  useEffect(() => {
    if (location.state) {
      setStatus(location.state.status || 0);
    }
  }, [location.state]);
  useEffect(() => {
    dispatch(getItemDetails({ is_main: false }));
  }, [disable, dispatch]);

  useEffect(() => {
    if (!location.state) return;

    const api = location.state;

    const pipingClassObj = api.piping_class || {};
    const serviceDetails = api.service_details || {};

    setDraw((prev) => ({
      ...prev,

      // Basic fields
      drawing_no: api.drawing_no || "",
      drawing_receive_date: api.drawing_receive_date
        ? moment(api.drawing_receive_date).format("YYYY-MM-DD")
        : "",
      drawing_received_lot_no: api.drawing_received_lot_no || "",
      p_id_drawing_no: api.p_id_drawing_no || "",
      // sheet_no: api.sheet_no || "",
      rev: api.rev || "",

      // Piping Class
      piping_class: pipingClassObj._id || "",

      // Service & PMS
      service_id: api.service_id || "",
      service: serviceDetails.service || "",
      PipingMaterialSpecification:
        serviceDetails.PipingMaterialSpecification || "",

      // Area
      area_unit: api.area_unit?._id || "",

      // PDF
      pdf_url: api.drawing_pdf || "",
      pdf_name: api.drawing_pdf_name || "",
    }));
  }, [location.state]);

  const refreshData = () => {
    const id = finalId || data?._id;
    if (!id) return;
    dispatch(getMaterialEntryItems({ drawing_id: id }));
  };

  const refreshJointData = () => {
    const drawingId = finalId || data?._id;
    if (!drawingId) {
      toast.error("Cannot fetch joint entries until drawing is saved.");
      return;
    }
    dispatch(getJointEntryItems({ drawing_id: drawingId }));
  };

  const itemData = useSelector((state) => state?.getItemDetails?.user?.data);
  console.log("manage file itemdata", itemData);
  const materialEntryItemsData =
    useSelector((state) => state?.getMaterialEntryItems?.user?.data) || [];
  console.log("materialEntryItemsData", materialEntryItemsData);

  const jointEntryItemsData =
    useSelector((state) => state?.getJointEntryItems?.user?.data) || [];
  console.log("jointEntryItemsData", jointEntryItemsData);
  const areaData = useSelector((state) => state.getAreas?.data?.areas || []);


  useEffect(() => {
    const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(
      getAreasAction({
        project: projectId,
        status: 1,
      })
    );
  }, [dispatch]);

  const pipingClassData = useSelector(
    (state) => state?.getUserPipingClassMaster?.user?.data || []
  );
  useEffect(() => {
    // const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(
      getUserPipingClassMaster({
        status: 1,
        project: localStorage.getItem("U_PROJECT_ID"),
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (draw.piping_class && pipingClassData.length > 0) {
      const selectedClass = pipingClassData.find(
        (p) => String(p._id) === String(draw.piping_class)
      );

      if (selectedClass) {
        setAvailableServices(selectedClass.Items || []);
      }
    }
  }, [draw.piping_class, pipingClassData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill PDF name when typing drawing_no
    if (name === "drawing_no") {
      setDraw((prev) => ({
        ...prev,
        drawing_no: value,
        pdf_name: value ? `${value}.pdf` : "",
      }));
      return;
    }

    // When Piping Class changes
    if (name === "piping_class") {
      const selectedClass = pipingClassData.find(
        (p) => String(p._id) === String(value)
      );

      if (selectedClass && selectedClass.Items?.length > 0) {
        setAvailableServices(selectedClass.Items);
      } else {
        setAvailableServices([]);
      }

      setDraw((prev) => ({
        ...prev,
        piping_class: value,
        service: "",
        PipingMaterialSpecification: "",
      }));
      return;
    }

    if (name === "service_id") {
      const selectedService = availableServices.find(
        (item) => String(item._id) === String(value)
      );

      setDraw((prev) => ({
        ...prev,
        service_id: value,
        service: selectedService?.service || "",
        PipingMaterialSpecification:
          selectedService?.PipingMaterialSpecification || "",
      }));
      return;
    }

    // Other inputs
    setDraw((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleClose = () => setShow(false);
  const handleClose = () => {
    setEditData({});
    setShow(false);
  };

  const handleSave = () => {
    setShow(true);
  };

  // const handleJointClose = () => setShowJoint(false);

  const handleJointClose = () => {
    setJointEditData({});
    setShowJoint(false);
  };

  const handleSaveJoint = () => {
    setShowJoint(true);
  };

  const handlePdf = (e) => {
    if (e?.target?.files[0]) {
      const allowedTypes = ["application/pdf"];
      const file = e.target.files[0];
      const fileType = file.type;
      if (allowedTypes.includes(fileType)) {
        setDisable(true);
        const myurl = `${V_URL}/upload-image`;
        var bodyFormData = new FormData();
        bodyFormData.append("image", file);
        axios({
          method: "post",
          url: myurl,
          data: bodyFormData,
        })
          .then((response) => {
            if (response.data.success === true) {
              const data = response?.data?.data?.pdf;
              setDraw((prev) => ({
                ...prev,
                pdf_url: data
              }));
            }
            setDisable(false);
            if (e.target) e.target.value = null;
          })
          .catch((error) => {
            console.log(error, "!!");
            toast.error(error.response?.data?.message);
            setDisable(false);
            if (e.target) e.target.value = null;
          });
      } else {
        toast.error("Invalid file type. Only PDFs are allowed.");
        if (e.target) e.target.value = null;
      }
    }
  };

  const handleSubmit = () => {
    if (validation()) {
      setDisable(true);
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("drawing_no", draw.drawing_no);
      bodyFormData.append("piping_class", draw.piping_class);
      bodyFormData.append("service_id", draw.service_id);
      bodyFormData.append("area_unit", draw.area_unit);
      bodyFormData.append(
        "drawing_received_lot_no",
        draw.drawing_received_lot_no
      );
      bodyFormData.append("p_id_drawing_no", draw.p_id_drawing_no);
      bodyFormData.append("drawing_receive_date", draw.drawing_receive_date);
      // bodyFormData.append('unit', draw.unit);
      // bodyFormData.append("sheet_no", draw.sheet_no);
      bodyFormData.append("rev", draw.rev);
      // bodyFormData.append('assembly_no', draw.assembly_no);
      // bodyFormData.append('assembly_quantity', draw.assembly_qty);
      bodyFormData.append("drawing_pdf_name", draw.pdf_name);
      bodyFormData.append("drawing_pdf", draw.pdf_url);
      bodyFormData.append("status", 0);

      if (data?._id) {
        bodyFormData.append("id", data?._id);
      }
      console.log("data?._id", data?._id);
      console.log("bodyFormData", bodyFormData);
      axios({
        method: "post",
        url: `${V_URL}/user/manage-piping-drawing`,
        data: bodyFormData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      })
        .then((response) => {
          if (response.data.success === true) {
            // console.log(response.data.data, '@@@');
            toast.success(response.data.message);
            setFinalId(response.data.data._id);

            if (data?._id) {
              navigate("/piping/user/drawing-management");
              // window.reload();
            }
          }
          setDisable(false);
          setDisable3(true);
        })
        .catch((error) => {
          // toast.error(error?.response?.data?.message);
          setDisable(false);
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  };

  const handleReset = () => {
    setDraw({
      drawing_no: "",
      drawing_receive_date: "",
      piping_class: "",
      service_id: "",
      area_unit: "",
      drawing_received_lot_no: "",
      p_id_drawing_no: "",
      // unit: "",
      rev: 0,
      // assembly_no: "",
      // sheet_no: "",
      // assembly_qty: "",
      pdf_url: "",
      pdf_name: "",
    });
    setError("");
  };

  const handleSaveModal = async (data, addMore) => {
    try {
      const pageDrawingId = finalId || location.state?._id;
      const drawingId = data?.drawing_id || pageDrawingId;

      if (!drawingId) {
        toast.error("Drawing ID missing. Please save the drawing first.");
        return;
      }

      const bodyFormData = new URLSearchParams();
      bodyFormData.append("drawing_id", drawingId);
      bodyFormData.append("project_id", localStorage.getItem("U_PROJECT_ID"));

      if (data?._id) bodyFormData.append("_id", data._id);

      bodyFormData.append("item", data.item || "");
      bodyFormData.append("qty", data.qty || "");

      const response = await axios.post(
        `${V_URL}/user/add-material-entry-item`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      toast.success(response.data.message);
      dispatch(getMaterialEntryItems({ drawing_id: drawingId }));

      if (!addMore) handleClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error saving material entry."
      );
    }
  };

  const handleSaveJointModal = async (data, addMore, spoolId) => {
    try {
      const project_id = localStorage.getItem("U_PROJECT_ID");
      const drawingId = finalId || data?.drawing_id;

      if (!drawingId) {
        toast.error("Drawing ID missing. Please save the drawing first.");
        return;
      }
      console.log("data======================>", data);
      const payload = {
        ...data,
        drawing_id: drawingId,
        project_id,
        spool_no_id: spoolId,
      };

      console.log("✅ Final Payload to Save:", payload);

      const response = await axios.post(
        `${V_URL}/user/add-joint-entry-item`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(
          getJointEntryItems({
            spool_no_id: payload.spool_no_id,
            drawing_id: drawingId,
          })
        );

        if (addMore) {
          toast("Ready for next entry");
        } else {
          handleJointClose();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Error saving joint entry:", error);
      toast.error(
        error?.response?.data?.message ||
        "Something went wrong while saving joint data."
      );
    }
  };

  useEffect(() => {
    if (finalId || data?._id) {
      dispatch(
        getMaterialEntryItems({
          drawing_id: finalId || data?._id,
        })
      );
    }

    return () => {
      dispatch(clearDrawItems());
    };
  }, [finalId, data?._id, dispatch]);

  useEffect(() => {
    if (finalId || data?._id) {
      dispatch(
        getJointEntryItems({
          drawing_id: finalId || data?._id,
        })
      );
    }

    return () => {
      dispatch(clearJointItems());
    };
  }, [finalId, data?._id, dispatch]);

  // In useEffect
  useEffect(() => {
    const drawingId = finalId || data?._id;
    if (drawingId) {
      dispatch(getJointEntryItems({ drawing_id: drawingId }));
    }
  }, [finalId, data?._id, dispatch]);

  const handleEdit = (editData) => {
    setEditData(editData);
    refreshData();
    setShow(true);
  };
  const handleEditForJoint = (jointEditData) => {
    setJointEditData(jointEditData);
    refreshJointData();
    setShowJoint(true);
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: `Are you sure want to delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      console.log("result===================================>", result);
      if (result.isConfirmed) {
        // const myurl = `${V_URL}/user/delete-transaction-item`;
        const myurl = `${V_URL}/user/delete-material-entry-items?id=${id}`;
        var bodyFormData = new URLSearchParams();
        // bodyFormData.append("id", id);

        axios({
          method: "delete",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        })
          .then((response) => {
            if (response.data.success === true) {
              console.log("response", response);
              toast.success(response?.data?.message);
            }
            // refreshData();
            dispatch(
              getMaterialEntryItems({
                drawing_id: finalId || data?._id
              })
            );
            console.log("data", data);
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message || "Something went wrong"
            );
          });
      }
    });
  };

  const handleJointDelete = (id, itemId, title) => {
    Swal.fire({
      title: `Are you sure want to delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      console.log("result===================================>", result);
      if (result.isConfirmed) {
        // const myurl = `${V_URL}/user/delete-transaction-item`;
        const myurl = `${V_URL}/user/delete-joint-entry-items?id=${id}&item_id=${itemId}`;
        var bodyFormData = new URLSearchParams();
        // bodyFormData.append("id", id);

        axios({
          method: "delete",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        })
          .then((response) => {
            if (response.data.success === true) {
              console.log("response", response);
              toast.success(response?.data?.message);
            }
            refreshJointData();
            console.log("data", data);
          })
          .catch((error) => {
            toast.error(
              error?.response?.data?.message || "Something went wrong"
            );
          });
      }
    });
  };

  const handleUpdateStatus = async () => {
    const drawingId = finalId || data?._id;

    // ⚠️ Ensure V_URL is defined and accessible in this scope
    // (Assuming V_URL is the base URL for your API)
    console.log(
      "Calling URL:",
      `${V_URL}/manage-drawing-status-update/${drawingId}`
    );

    try {
      // STEP 1 – Update Status to 1
      const response =
        await axios.post(
          `${V_URL}/user/manage-drawing-status-update`,
          {
            status: 1,
            id: drawingId,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
          }
        );

      // Check if the status update request was successful (using status code or response data)
      if (response.status === 200 || response.data.success) {
        toast.success("Drawing status updated successfully!");
        navigate("/piping/user/drawing-management");
      } else {
        // Handle cases where the request succeeds but the API indicates a failure
        toast.error(
          response.data.message || "Failed to update drawing status."
        );
      }
    } catch (err) {
      console.error("Error updating drawing status:", err);
      // Use the error response message if available, otherwise a generic error
      const errorMessage =
        err.response?.data?.message || "Failed to update drawing status.";
      toast.error(errorMessage);
    }
  };

  const validation = () => {
    const { isValid, err } = DrawFromValidForPiping({ draw });
    console.log("Validation result:", { isValid, err }); // add this line
    setError(err);
    return isValid;
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

//   useEffect(() => {
//   const spools = jointEntryItemsData || [];

//   if (spools.length === 0) {
//     setIsFitupDone(false);
//     return;
//   }

//   const allSpoolsCompleted = spools.every((spool) => {
//     // Spool level fitup generated
//     if (spool.is_generate_fitUp_offer) return true;

//     const validJoints =
//       spool.material_items?.filter((item) => {
//         const jointNo = item.joint_no || "";

//         return !(
//           jointNo.toUpperCase().startsWith("FW") ||
//           jointNo.toUpperCase().startsWith("FJ")
//         );
//       }) || [];

//     // No valid joints => not completed
//     if (validJoints.length === 0) return false;

//     // Every valid joint must be added to fitup
//     return validJoints.every(
//       (item) => item.is_added_fitUp_table === true
//     );
//   });

  
//   setIsFitupDone(allSpoolsCompleted);
// }, [jointEntryItemsData]);


  const canEditDrawing = status === 1 || status === 0;

  const canEditMaterial = status === 1 || status === 0;

  // const canEditJoint =
  //   status === 1 || status === 0 || (status === 2 && !isFitupDone);
const canEditJoint = status === 0 || status === 1 || status === 2;
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
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/drawing-management">
                      Drawing List
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Drawing
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? "Edit" : "Add"} Drawing Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            {" "}
                            Drawing No. <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            name="drawing_no"
                            value={draw.drawing_no}
                            disabled={!canEditDrawing}
                          />
                          <div className="error">{error.drawing_no_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Drawing Received Date{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="date"
                            onChange={handleChange}
                            name="drawing_receive_date"
                            value={draw.drawing_receive_date}
                            max={new Date().toISOString().split("T")[0]}
                            disabled={!canEditDrawing}
                          />
                          <div className="error">
                            {error.drawing_receive_date_err}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>REV</label>
                          <input
                            className="form-control"
                            type="text"
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            name="rev"
                            value={draw.rev}
                            disabled={!canEditDrawing}
                          />
                          <div className="error">{error.rev_err}</div>
                        </div>
                      </div>
                      {/* 
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Sheet No. <span className="login-danger">*</span>{" "}
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onChange={handleChange}
                            name="sheet_no"
                            value={draw.sheet_no}
                          />
                          <div className="error">{error.sheet_no_err}</div>
                        </div>
                      </div> */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Unit / Area <span className="login-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            name="area_unit"
                            value={draw.area_unit || ""}
                            onChange={handleChange}
                            disabled={!canEditDrawing}
                          >
                            <option value="">-- Select Area --</option>
                            {areaData.map((area) => (
                              <option key={area._id} value={area._id}>
                                {area.area || area.name}
                              </option>
                            ))}
                          </select>

                          <div className="error">{error?.area_unit_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            {" "}
                            Received Lot No.{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            name="drawing_received_lot_no"
                            value={draw.drawing_received_lot_no}
                            disabled={!canEditDrawing}
                          />
                          <div className="error">
                            {error?.drawing_received_lot_no_err}
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            P & ID Drawing No.{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={handleKeyDown}
                            onChange={handleChange}
                            name="p_id_drawing_no"
                            value={draw.p_id_drawing_no}
                            disabled={!canEditDrawing}
                          />
                          <div className="error">
                            {error?.p_id_drawing_no_err}
                          </div>
                        </div>
                      </div>

                      {/* Piping Class */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Piping Class <span className="login-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            name="piping_class"
                            value={draw.piping_class}
                            onChange={handleChange}
                            disabled={!canEditDrawing}
                          >
                            <option value="">-- Select Piping Class --</option>
                            {pipingClassData.map((pclass) => (
                              <option key={pclass._id} value={pclass._id}>
                                {pclass.PipingClass}
                              </option>
                            ))}
                          </select>
                          <div className="error">{error?.piping_class_err}</div>
                        </div>
                      </div>

                      {/* Service Dropdown */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Service <span className="login-danger">*</span>
                          </label>

                          <select
                            className="form-control"
                            name="service_id"
                            value={draw.service_id}
                            onChange={handleChange}
                            disabled={!canEditDrawing}
                          >
                            <option value="">-- Select Service --</option>
                            {availableServices.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.service}
                              </option>
                            ))}
                          </select>

                          <div className="error">{error?.service_err}</div>
                        </div>
                      </div>

                      {/* Auto-filled Piping Material Specification */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Piping Material Specification{" "}
                            <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="PipingMaterialSpecification"
                            value={draw.PipingMaterialSpecification?.name}
                            disabled
                          />
                          <div className="error">
                            {error?.PipingMaterialSpecification_err}
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Assembly No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="assembly_no" value={draw.assembly_no} />
                                                    <div className="error">{error.assembly_no_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Assembly Qty. (NOS) <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="assembly_qty" value={draw.assembly_qty} />
                                                    <div className="error">{error.assembly_qty_err}</div>
                                                </div>
                                            </div> */}
                    </div>
                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-top-form">
                          <label className="local-top">
                            PDF Name <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onChange={handleChange}
                            name="pdf_name"
                            value={draw.pdf_name}
                            disabled
                          />
                          <div className="error">{error.pdf_name_err}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-top-form">
                          <label className="local-top">
                            PDF <span className="login-danger">*</span>
                          </label>
                          <div className="settings-btn upload-files-avator">
                            <label htmlFor="pdfFile" className="upload">
                              Choose PDF File(s)
                            </label>
                            <input
                              type="file"
                              id="pdfFile"
                              onChange={handlePdf}
                              accept=".pdf"
                              className="hide-input"
                            />
                          </div>
                          <div className="error">{error.pdf_url_err}</div>
                          {draw.pdf_url ? (
                            <a
                              href={draw.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src="/assets/img/pdflogo.png"
                                alt="draw-pdf"
                              />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {localStorage.getItem("ERP_ROLE") === PLAN && (
                      <div className="col-12 text-end">
                        <div className="doctor-submit text-end">
                          {(canEditDrawing || data?._id) && (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary submit-form me-2"
                                onClick={handleSubmit}
                                disabled={
                                  disable || disable3
                                }
                              >
                                {disable
                                  ? "Processing..."
                                  : data?._id
                                    ? "Update"
                                    : "Next and Continue"}
                              </button>


                              <button
                                type="button"
                                className="btn btn-primary cancel-form"
                                onClick={handleReset}
                              >
                                Reset
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <DrawSectionTable
                handleSave={handleSave}
                transactionData={materialEntryItemsData}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                finalId={finalId}
                dataId={data?._id}
                fetchTransactionData={() => refreshData()}
                canEdit={canEditMaterial}

              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              {materialEntryItemsData && materialEntryItemsData.length > 0 ? (
                <div className="row">
                  <div className="col-sm-12">
                    <JointWiseEntryTable
                      handleSaveJoint={handleSaveJoint}
                      transactionData={jointEntryItemsData}
                      handleEditForJoint={handleEditForJoint}
                      handleJointDelete={handleJointDelete}
                      finalId={finalId}
                      dataId={data?._id}
                      fetchTransactionData={() => refreshJointData()}
                      canEdit={canEditJoint}
                      status={status}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                      <button
                        type="button"
                        className="btn btn-primary submit-form me-2"

                        onClick={handleUpdateStatus}
                        //      disabled={
                        //    !(materialEntryItemsData.length && jointEntryItemsData.length)
                        // }
                        disabled={
                          !(materialEntryItemsData.length && jointEntryItemsData.length) ||
                          !canEditJoint
                        }
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <DrawingModal
        show={show}
        handleClose={handleClose}
        itemData={itemData}
        handleSaveModal={handleSaveModal}
        editData={editData}
        drawId={finalId || data?.drawId || data?._id}
        finalId={finalId}
      />

      {materialEntryItemsData && materialEntryItemsData.length > 0 ? (
        <JointEntryModal
          show={showJoint}
          handleJointClose={handleJointClose}
          jointItems={materialEntryItemsData} // full item list
          jointEditData={jointEditData} // only one record when editing
          handleSaveJointModal={handleSaveJointModal}
          drawId={finalId || data?.drawId || data?._id}
          finalId={finalId}
        />
      ) : null}
    </div>
  );
};

export default ManageDrawing;
