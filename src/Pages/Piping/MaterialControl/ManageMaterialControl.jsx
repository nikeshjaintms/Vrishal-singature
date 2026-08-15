import React, { useEffect, useState, useMemo } from 'react';
import { V_URL } from '../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import MaterialControlItemModal from '../../../Components/MaterialControl/MaterialControlItemModal';
import MaterialControlItemModalClientMto from '../../../Components/MaterialControl/MaterialControlItemModalClientMto';
import { useDispatch, useSelector } from 'react-redux';
import { getItemDetails } from '../../../Store/Piping/Item/Item';
import { getAreasAction } from '../../../Store/PoTeam/Area/AreaSlice';
import MaterialControlSectionTable from '../../../Components/MaterialControl/MaterialControlSectionTable';
import MaterialControlSectionTableQty from '../../../Components/MaterialControl/MaterialControlSectionTableQty';
import MaterialControlClientMtoSectionTable from '../../../Components/MaterialControl/MaterialControlClientMtoSectionTable';
// import { getMaterialMtoById } from '../../../Store/PoTeam/MaterialMTO/MaterialMto';
import { MultiSelect } from "primereact/multiselect";

const ManageMaterialControl = () => {
  
  const [uploadFile, setUploadFile] = useState(null);
  const handleFileChange = (e) => setUploadFile(e.target.files[0]);
  const [chartType, setChartType] = useState(""); // <-- track dropdown
  const [modalType, setModalType] = useState(""); // <-- which modal to open
  const [drawingOptions, setDrawingOptions] = useState([]);
  const [selectedDrawings, setSelectedDrawings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [error, setError] = useState({});
  const [show, setShow] = useState(false);
  const [mto, setMto] = useState({
    area_unit: "",
    lineno_drawingno: [],
    material_control_chart: "",
  });
  const [editData, setEditData] = useState({});
  const [finalId, setFinalId] = useState('');
  const [clientMtoItems, setClientMtoItems] = useState([]);
  const [materialControlItems, setMaterialControlItems] = useState([]);
  const [drawingItems, setDrawingItems] = useState([]);
  const data = location.state;

  useEffect(() => {
    dispatch(getItemDetails({ is_main: false }));
    dispatch(getAreasAction({ project: localStorage.getItem('U_PROJECT_ID') }));
  }, [navigate, disable, dispatch]);

    const areaData = useSelector((state) => state.getAreas?.data?.areas || []);
  useEffect(() => {
  if (!location.state || !areaData.length) return;

  let areaUnit = "";

  // Case 1: area_unit is object
  if (typeof location.state.area_unit === "object") {
    areaUnit = location.state.area_unit._id;
  }
  // Case 2: area code string (e.g. "35AR-505")
  else {
    areaUnit =
      areaData.find(a => a.area === location.state.area_unit)?._id ||
      location.state.area_unit; // fallback if already _id
  }

  setMto({
    area_unit: areaUnit,
    lineno_drawingno: location.state.lineno_drawingno || [],
    material_control_chart: location.state.material_control_chart || "",
  });

console.log(
  "location.state.lineno_drawingno",
  location.state?.lineno_drawingno
);

const drawingIds = [
  ...new Set(
    (location.state?.lineno_drawingno || [])
      .flatMap(line =>
        (line.drawings || []).map(d => d?.drawing_id?._id)
      )
      .filter(Boolean) // removes null / undefined
  )
];

console.log("Unique Drawing IDs:", drawingIds);

setSelectedDrawings(drawingIds);



  const initData = async () => {
    if (location.state?._id) {
      if (drawingIds.length > 0) {
        const drawingItems = await fetchDrawingItems(drawingIds);
        setMaterialControlItems(drawingItems);
      }
      await fetchMaterialControlItems();
      return;
    }

    if (drawingIds.length > 0) {
      const allItems = [];
      for (const drawingId of drawingIds) {
        try {
          const bodyFormData = new URLSearchParams();
          bodyFormData.append("drawing_id", drawingId);

          const response = await axios.post(
            `${V_URL}/user/get-material-entry-items`,
            bodyFormData,
            {
              headers: {
                Authorization:
                  "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (response.data.success && response.data.data) {
            const items = Array.isArray(response.data.data)
              ? response.data.data
              : [];
            allItems.push(...items);
          }
        } catch (err) {
          console.error(
            `Error fetching items for drawing_id ${drawingId}:`,
            err
          );
        }
      }
      setMaterialControlItems(allItems);
    }
  };

  initData();
}, [location.state, areaData]);


  const fetchDrawingItems = async (drawingIds = []) => {
    if (!Array.isArray(drawingIds) || drawingIds.length === 0) {
      return [];
    }

    const allItems = [];

    for (const drawingId of drawingIds) {
      try {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("drawing_id", drawingId);

        const response = await axios.post(
          `${V_URL}/user/get-material-entry-items`,
          bodyFormData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          allItems.push(...response.data.data);
        }
      } catch (err) {
        console.error("Drawing item fetch error:", err);
      }
    }

    return allItems;
  };

  const fetchMaterialControlItems = async () => {
    const materialControlId = data?._id || finalId;
    if (!materialControlId) return;

    try {
      const res = await axios.get(
        `${V_URL}/user/get-material-control-items`,
        {
          params: { id: materialControlId },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (!res.data.success) return;

      const responseData = res.data.data;

      /* =====================================================
        DRAWING BASIS
      ===================================================== */
      if (responseData.material_control_chart === "Drawing-Basis") {
        const isoRows = [];

        (responseData.lineno_drawingno || []).forEach((group) => {
          (group.drawings || []).forEach((d) => {
            const item = d.item_id || {};

            isoRows.push({
            // ids
            material_control_id: responseData._id,
            lineno_drawingno_id: group._id,
            drawing_id: d.drawing_id,
            item_id: item._id,

            // ✅ KEEP FULL ITEM OBJECT
            item: item,

            // quantities
            qty: Number(d.qty || 0),

            iso_drawing_qty: Number(group.iso_drawing_qty || 0),
            contingency: Number(group.contingency || 0),
            existing_available_qty: Number(group.existing_available_qty || 0),
            mto_with_contingency: Number(group.mto_with_contingency || 0),
            order_qty: Number(group.order_qty || 0),

            __fromQtyTable: false,
          });

          });
        });

        setMaterialControlItems(isoRows);
        return;
      }

      /* =====================================================
        CLIENT MTO BASIS
      ===================================================== */
      if (responseData.material_control_chart === "Client-MTO-Basis") {
        setClientMtoItems(responseData.clientmtobasisitems || []);
      }
    } catch (error) {
      console.error("Error fetching material control items:", error);
    }
  };

  const refreshData = async () => {
    await fetchMaterialControlItems();
  };

  const rawItemData = useSelector(
    (state) => state?.getItemDetails?.user?.data
  );

  const itemData = Array.isArray(rawItemData)
    ? rawItemData
    : Array.isArray(rawItemData?.data)
      ? rawItemData.data
      : [];

  // console.log("ManageMaterialControl itemData:", itemData);
  const mtoItemsData = useSelector((state) => state?.materialMto?.single?.items) || [];


  const handleChange = (e) => {
    const { name, value } = e.target;

    setMto((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "material_control_chart" && value !== "Drawing-Basis"
        ? { lineno_drawingno: [] }
        : {}),
    }));

    if (name === "area_unit") {
      setSelectedDrawings([]);
      setDrawingOptions([]);
      setMaterialControlItems([]);
    }

    if (name === "material_control_chart") {
      setChartType(value);
    }
  };


  const handleClose = () => {
    setEditData({});
    setShow(false);
    setModalType("");
  };

  const handleSave = () => {
    if (!chartType) {
      toast.error("Please select a Material Control Chart first!");
      return;
    }

    if (chartType === "Drawing-Basis") {
      setModalType("drawing");
      setShow(true);
    } else if (chartType === "Client-MTO-Basis") {
      setModalType("client");
      setShow(true);
    } else {
      toast.error("Invalid chart type selected!");
    }
  };

  const handleSubmit = async () => {
    if (!chartType) {
      toast.error("Please select Material Control Chart!");
      return;
    }

    let linenoDrawingPayload = [];

    if (chartType === "Drawing-Basis") {
      let drawingIds = [];

      if (mto.lineno_drawingno && mto.lineno_drawingno.length > 0) {
        drawingIds = mto.lineno_drawingno
          .map((item) => item.drawing_id?._id || item.drawing_id)
          .filter(Boolean);
      } else if (selectedDrawings && selectedDrawings.length > 0) {
        drawingIds = selectedDrawings;
      }

      if (!drawingIds.length) {
        toast.error("Please select Line No. / Drawing No.");
        return;
      }

      try {
        const allItems = [];

        for (const drawingId of drawingIds) {
          if (!drawingId) {
            console.warn("Skipping invalid drawing_id:", drawingId);
            continue;
          }

          try {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append("drawing_id", drawingId);

            const response = await axios.post(
              `${V_URL}/user/get-material-entry-items`,
              bodyFormData,
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );

            if (response.data.success && response.data.data) {
              const materialItems = Array.isArray(response.data.data)
                ? response.data.data
                : Array.isArray(response.data.data.data)
                ? response.data.data.data
                : [];

              // console.log("API raw response:", response.data);
              // console.log("materialItems:", materialItems);

              materialItems.forEach((item) => {
                const itemId = item.item_id?._id || item.item?._id || item.item_id;
                const qty = item.qty || item.quantity || 0;

                if (drawingId && itemId) {
                  // ✅ PUSH into allItems (one row per drawing–item)
                  allItems.push({
                    drawings: [
                      {
                        drawing_id: drawingId.toString(),
                        item_id: itemId.toString(),
                        qty: Number(qty),
                      },
                    ],
                    iso_drawing_qty: 0,
                    contingency: 0,
                    order_qty: 0,
                    mto_with_contingency: 0,
                    existing_available_qty: 0,
                  });
                }
              });
            }
          } catch (err) {
            console.error(`Error fetching items for drawing_id ${drawingId}:`, err);
            toast.error(`Failed to fetch items for drawing ${drawingId}`);
          }
        }

        // ✅ NOW group by item_id, AFTER allItems is filled
        const groupedByItem = {};
        allItems.forEach((row) => {
          const d = row.drawings[0];
          if (!d || !d.item_id) return;
          const key = d.item_id;

          if (!groupedByItem[key]) {
            groupedByItem[key] = {
              drawings: [],
              iso_drawing_qty: 0,
              contingency: 0,
              order_qty: 0,
              mto_with_contingency: 0,
              existing_available_qty: 0,
            };
          }

          groupedByItem[key].drawings.push({
            drawing_id: d.drawing_id,
            item_id: d.item_id,
            qty: d.qty,
          });

          groupedByItem[key].iso_drawing_qty += Number(d.qty) || 0;
        });

        linenoDrawingPayload = Object.values(groupedByItem);
        setDrawingItems(linenoDrawingPayload);

        // console.log("chartType:", chartType);
        // console.log("linenoDrawingPayload:", linenoDrawingPayload);
      } catch (err) {
        toast.error(err.message || "Failed to fetch material entry items");
        return;
      }
    }

    // Only check for payload length if the chart type is "Drawing-Basis"
    if (chartType === "Drawing-Basis" && !linenoDrawingPayload.length) {
      toast.error("No valid drawing-item combinations found");
      return;
    }

    setDisable(true);
    const body = new URLSearchParams();
    body.append("project", localStorage.getItem("U_PROJECT_ID"));
    body.append("pr_by", localStorage.getItem("PAY_USER_ID"));
    body.append("area_unit", mto.area_unit);
    body.append("material_control_chart", chartType);
    body.append("lineno_drawingno", JSON.stringify(linenoDrawingPayload));
    if (data?._id) body.append("id", data._id);

    try {
      const res = await axios.post(
        `${V_URL}/user/manage-material-control-list`,
        body,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      toast.success(res.data.message);
      if (res.data.data?._id) {
        setFinalId(res.data.data._id);
      }
      // if (chartType === "Drawing-Basis" && selectedDrawings.length) {
      //   const items = await fetchDrawingItems(selectedDrawings);
      //   setMaterialControlItems(items);
      // }
      setDisable3(true);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setDisable(false);
    }
  };

  const handleReset = () => {
    setMto({
      area_unit: "",
      material_control_chart: "",
      lineno_drawingno: [],
    });
    setSelectedDrawings([]);
    setDrawingItems([]);
    setEditData({});
    setError({});
    setChartType("");
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

  const handleSaveModal = async (mtoData, addMore) => {
    try {
    
      const myurl = `${V_URL}/user/manage-material-control-client-mto-items`;

      const bodyFormData = new URLSearchParams();

      const mtoId = data?._id || finalId;
      bodyFormData.append("mto_id", mtoId);

      if (mtoData?.id) {
        bodyFormData.append("id", mtoData.id);
      } else {
      }

      bodyFormData.append("item_id", mtoData.item_id);

      bodyFormData.append("ClientMtoQty", mtoData.ClientMtoQty || 0);
      bodyFormData.append("continegancy", mtoData.continegancy || 0);
      bodyFormData.append("MTOwithContinegancy", mtoData.MTOwithContinegancy || 0);
      bodyFormData.append("ExistingAvailableQty", mtoData.ExistingAvailableQty || 0);
      bodyFormData.append("OrderQty", mtoData.OrderQty || 0);

      bodyFormData.append("remarks", mtoData.remarks || "");


      const response = await axios.post(myurl, bodyFormData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });


      if (response.data.success) {
        toast.success(response.data.message);

        await fetchMaterialControlItems();

        setEditData({});


        if (!addMore) {
          handleClose();
        }
      } else {
        toast.error(response.data.message || "Save failed");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (data?._id || finalId) {
      fetchMaterialControlItems();
    }
  }, [data?._id, finalId]);

  const handleEdit = async (rowData) => {
    // --------------------------------------------
    // CASE 1: Client-MTO table → open modal
    // --------------------------------------------
    if (
      mto.material_control_chart === "Client-MTO-Basis" &&
      !rowData.__fromQtyTable
    ) {
      setEditData({
        id: rowData._id,
        item_id: rowData?.item_id?._id || rowData?.item_id,

        ClientMtoQty: rowData?.client_mto_qty ?? 0,
        continegancy: rowData?.contingency ?? 0,
        MTOwithContinegancy: rowData?.mto_with_contingency ?? 0,
        ExistingAvailableQty: rowData?.existing_available_qty ?? 0,
        OrderQty: rowData?.order_qty ?? 0,

        remarks: rowData?.remarks || "",
      });


      setModalType("client");
      setShow(true);
      return;
    }

    // --------------------------------------------
    // CASE 2: Drawing-basis merged qty row
    // --------------------------------------------
    if (rowData.__fromQtyTable) {
      try {
        const body = new URLSearchParams();
        const materialControlId = data?._id || finalId;
        const drawingId = rowData?.source_drawings?.[0]?.drawing_id || rowData?.drawing_id?._id;
        const itemId = rowData?.item?._id || rowData?.item_id?._id || rowData?.item_id;

        body.append("id", materialControlId);
        body.append("row_update", true);
        body.append("drawing_id", drawingId);
        body.append("item_id", itemId);

        body.append("contingency", rowData.contingency || 0);
        body.append("existing_available_qty", rowData.existing_available_qty || 0);
        body.append("mto_with_contingency", rowData.mto_with_contingency || 0);
        body.append("order_qty", rowData.order_qty || 0);

        await axios.post(
          `${V_URL}/user/manage-material-control-list`,
          body,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        toast.success("Quantity updated successfully");
        await fetchMaterialControlItems();
        return;
      } catch (err) {
        toast.error("Failed to update quantity");
        return;
      }
    }

  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: `Are you sure want to delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const myurl = `${V_URL}/user/delete-material-control-client-mto-items`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);
        bodyFormData.append("mto_id", data?._id || finalId);

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
            if (response.data.success) toast.success(response?.data?.message);
            refreshData();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
          });
      }
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleGenerateMaterialControlList = async (rowData) => {
    const materialControlId = finalId || data?._id;

    if (!materialControlId) {
      toast.error("Material Control not found!");
      return;
    }  

    try {
      const response = await axios.post(
        `${V_URL}/user/manage-material-control-list`,
        {
          id: materialControlId,
          status: 1,
          status_update: true   // 🔑 THIS IS REQUIRED
        },
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );


      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/piping/user/material-control");
        refreshData();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to generate Material Control List!"
      );
    }
  };

  useEffect(() => {
    if (
      !mto.area_unit ||
      mto.material_control_chart !== "Drawing-Basis"
    ) {
      setDrawingOptions([]);
      setSelectedDrawings([]);
      return;
    }

    const token = localStorage.getItem("PAY_USER_TOKEN");

    axios.get(`${V_URL}/user/get-piping-drawing`, {
      params: { area_unit: mto.area_unit },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      const list = res.data.data?.data || [];

      setDrawingOptions(
        list.map((d) => ({
          label: d.drawing_no,
          value: d._id,
        }))
      );
    })
    .catch(() => toast.error("Failed to load drawings"));

  }, [mto.area_unit, mto.material_control_chart]);

  const mergeMaterialItems = (items = []) => {
    const map = new Map();

    items.forEach((row) => {
      const item = row.item || {};
      if (!item._id) return;

      const key = item._id.toString();

      if (map.has(key)) {
        const existing = map.get(key);

        existing.qty += Number(row.qty || 0);
        existing.iso_drawing_qty += Number(row.iso_drawing_qty || 0);
      } else {
        map.set(key, {
          ...row,

          // ✅ keep item object
          item: item,

          qty: Number(row.qty || 0),
          iso_drawing_qty: Number(row.iso_drawing_qty || 0),

          contingency: Number(row.contingency || 0),
          existing_available_qty: Number(row.existing_available_qty || 0),
          mto_with_contingency: Number(row.mto_with_contingency || 0),
          order_qty: Number(row.order_qty || 0),

          __fromQtyTable: true, // ✅ REQUIRED
        });
      }
    });

    return Array.from(map.values());
  };


  const rawItems = materialControlItems; // keep raw
  const mergedItems = useMemo(
    () => mergeMaterialItems(materialControlItems),
    [materialControlItems]
  );





  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/material-control">Material Control List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Material Control
                  </li>
                </ul>
              </div>
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
                        <h4>{data?._id ? "Edit" : "Add"} Material Control Details</h4>
                      </div>
                    </div>

                    <div className="row">
                        


                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Material Control Chart</label>
                          <select
                            className="form-control"
                            name="material_control_chart"
                            value={mto.material_control_chart}
                            onChange={handleChange}
                          >
                            <option value="">Select Material Control Chart</option>
                            <option value="Drawing-Basis">Drawing Basis</option>
                            <option value="Client-MTO-Basis">Client MTO Basis</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Area / Location <span className="login-danger">*</span>
                          </label>
                          <select
                            className="form-control"
                            name="area_unit"
                            value={mto.area_unit || ""}
                            onChange={handleChange}
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

                      {mto.material_control_chart === "Drawing-Basis" && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>Line No. / Drawing No.</label>

                            <MultiSelect
                              value={selectedDrawings}
                              options={drawingOptions}
                              placeholder="Line No. / Drawing No."
                              display="chip"
                              className="w-100 multi-prime-react"
                              onChange={(e) => setSelectedDrawings(e.value)}
                            />
                          </div>
                        </div>
                      )}


                    </div>

                    

                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button
                          type="button"
                          className="btn btn-primary submit-form me-2"
                          onClick={handleSubmit}
                          disabled={disable || disable3}
                        >
                          {disable ? "Processing..." : data?._id ? "Update" : "Next and Continue"}
                        </button>


                        <button
                          type="button"
                          className="btn btn-primary cancel-form"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Item Table */}
          

          {mto.material_control_chart === "Drawing-Basis" && (
            <>
              <MaterialControlSectionTable
                handleSave={handleSave}
                transactionData={rawItems}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                finalId={finalId}
                dataId={data?._id}
                fetchTransactionData={fetchMaterialControlItems}
              />

              <MaterialControlSectionTableQty
                handleSave={handleSave}
                  transactionData={mergedItems}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                finalId={finalId}
                dataId={data?._id}
                fetchTransactionData={fetchMaterialControlItems}
              />

            </>
          )}
        {mto.material_control_chart === "Client-MTO-Basis" && (
          <>
            <div className="row">
              <div className="col-sm-12">
                <MaterialControlClientMtoSectionTable
                  handleSave={handleSave}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  finalId={finalId}
                  dataId={data?._id}
                  transactionData={clientMtoItems}
                />
              </div>
            </div>
          </>
        )}

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="float-end">
                    <button
                      type="button"
                      className="btn btn-primary submit-form me-2"
                      disabled={(disable || disable3) && (data?._id && finalId)}
                      onClick={handleGenerateMaterialControlList}
                    >
                      Generate Material Control
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Modal Rendering */}
      {modalType === "drawing" && (
        <MaterialControlItemModal
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
          // areasData={areas}
        />
      )}

      {modalType === "client" && (
        <MaterialControlItemModalClientMto
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
          // areasData={areas}
        />
      )}
    </div>
  );
};

export default ManageMaterialControl;
