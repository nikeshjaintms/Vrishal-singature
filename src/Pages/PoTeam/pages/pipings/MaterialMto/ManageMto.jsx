import React, { useEffect, useState, useMemo } from 'react';
import { V_URL } from '../../../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import MaterialControlItemModal from '../../../../../Components/MaterialControl/MaterialControlItemModal';
import MaterialControlItemModalClientMto from '../../../../../Components/MaterialControl/MaterialControlItemModalClientMto';
import { useDispatch, useSelector } from 'react-redux';
import { getItemDetails } from '../../../../../Store/Piping/Item/Item';
import MaterialControlSectionTable from '../../../../../Components/MaterialControl/MaterialControlSectionTable';
import MaterialControlSectionTableQty from '../../../../../Components/MaterialControl/MaterialControlSectionTableQty';
import MaterialControlClientMtoSectionTable from '../../../../../Components/MaterialControl/MaterialControlClientMtoSectionTable';
import { MultiSelect } from "primereact/multiselect";
import PO_ROUTE_URLS from '../../../../../Routes/PoTeam/PoRoutes';
import { getAreasAction } from '../../../../../Store/Piping/Area/AreaSlicePiping';

const PipingManageMto = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const handleFileChange = (e) => setUploadFile(e.target.files[0]);
  const [modalType, setModalType] = useState("");
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
  console.log("Data", data)

  useEffect(() => {
    dispatch(getItemDetails({ is_main: false }));
    dispatch(getAreasAction({ project: localStorage.getItem('U_PROJECT_ID') }));
  }, [navigate, disable, dispatch]);

  const areaData = useSelector((state) => state.getAreas?.data?.areas || []);

  useEffect(() => {
    if (!location.state || !areaData.length) return;

    let areaUnit = "";
    if (typeof location.state.area_unit === "object") {
      areaUnit = location.state.area_unit._id;
    } else {
      areaUnit = areaData.find(a => a.area === location.state.area_unit)?._id || location.state.area_unit;
    }

    setMto({
      area_unit: areaUnit,
      lineno_drawingno: location.state.lineno_drawingno || [],
      material_control_chart: location.state.material_control_chart || "",
    });

    const drawingIds = [
      ...new Set(
        (location.state?.lineno_drawingno || [])
          .flatMap(line => (line.drawings || []).map(d => 
            typeof d?.drawing_id === 'object' ? d?.drawing_id?._id : d?.drawing_id
          ))
          .filter(Boolean)
      )
    ];
    console.log("Drawing Ids", drawingIds)
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
                  Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            );

            if (response.data.success && response.data.data) {
              const items = Array.isArray(response.data.data) ? response.data.data : [];
              allItems.push(...items);
            }
          } catch (err) {
            console.error(`Error fetching items for drawing_id ${drawingId}:`, err);
          }
        }
        setMaterialControlItems(allItems);
      }
    };

    initData();
  }, [location.state, areaData]);

  const fetchDrawingItems = async (drawingIds = []) => {
    if (!Array.isArray(drawingIds) || drawingIds.length === 0) return [];
    const allItems = [];
    for (const drawingId of drawingIds) {
      try {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("drawing_id", drawingId);
        const response = await axios.post(`${V_URL}/user/get-material-entry-items`, bodyFormData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
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
      const res = await axios.get(`${V_URL}/user/get-material-control-items`, {
        params: { id: materialControlId },
        headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
      });

      if (!res.data.success) return;
      const responseData = res.data.data;

      if (responseData.material_control_chart === "Drawing-Basis") {
        setMto(prev => ({
          ...prev,
          lineno_drawingno: responseData.lineno_drawingno || [],
          material_control_chart: responseData.material_control_chart
        }));
        const isoRows = [];
        (responseData.lineno_drawingno || []).forEach((group) => {
          (group.drawings || []).forEach((d) => {
            const item = d.item_id || {};
            isoRows.push({
              material_control_id: responseData._id,
              lineno_drawingno_id: group._id,
              drawing_id: d.drawing_id,
              item_id: item._id,
              item: item,
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

  const rawItemData = useSelector((state) => state?.getItemDetails?.user?.data);
  const itemData = Array.isArray(rawItemData) ? rawItemData : Array.isArray(rawItemData?.data) ? rawItemData.data : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMto((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "material_control_chart" && value !== "Drawing-Basis" ? { lineno_drawingno: [] } : {}),
    }));
    if (name === "area_unit") {
      setSelectedDrawings([]);
      setDrawingOptions([]);
      setMaterialControlItems([]);
    }
  };

  const handleClose = () => {
    setEditData({});
    setShow(false);
    setModalType("");
  };

  const handleSave = () => {
    if (!mto.material_control_chart) {
      toast.error("Please select a Material Control Chart first!");
      return;
    }
    if (mto.material_control_chart === "Drawing-Basis") {
      setModalType("drawing");
      setShow(true);
    } else if (mto.material_control_chart === "Client-MTO-Basis") {
      setModalType("client");
      setShow(true);
    } else {
      toast.error("Invalid chart type selected!");
    }
  };

  const handleSubmit = async () => {
    const chartTypeVal = mto.material_control_chart;
    if (!chartTypeVal) {
      toast.error("Please select Material Control Chart!");
      return;
    }

    let linenoDrawingPayload = [];
    if (chartTypeVal === "Drawing-Basis") {
      const currentDrawingIdsArr = selectedDrawings || [];

      if (!currentDrawingIdsArr.length) {
        toast.error("Please select Line No. / Drawing No.");
        return;
      }

      try {
        const existingPayload = mto.lineno_drawingno || [];
        const alreadyFetchedDrawingIds = new Set();
        existingPayload.forEach(row => {
          row.drawings.forEach(d => {
            const dId = d.drawing_id?._id || d.drawing_id;
            if (dId) alreadyFetchedDrawingIds.add(dId.toString());
          });
        });

        const drawingsToFetch = currentDrawingIdsArr.filter(id => !alreadyFetchedDrawingIds.has(id.toString()));
        const newlyFetchedItems = [];

        for (const drawingId of drawingsToFetch) {
          if (!drawingId) continue;
          try {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append("drawing_id", drawingId);
            const response = await axios.post(`${V_URL}/user/get-material-entry-items`, bodyFormData, {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                "Content-Type": "application/x-www-form-urlencoded",
              },
            });

            if (response.data.success && response.data.data) {
              const materialItems = Array.isArray(response.data.data) ? response.data.data : [];
              materialItems.forEach((item) => {
                const itemId = item.item_id?._id || item.item?._id || item.item_id;
                const qty = item.qty || item.quantity || 0;
                if (drawingId && itemId) {
                  newlyFetchedItems.push({
                    drawing_id: drawingId.toString(),
                    item_id: itemId.toString(),
                    qty: Number(qty)
                  });
                }
              });
            }
          } catch (err) {
            console.error(`Error fetching items for drawing_id ${drawingId}:`, err);
          }
        }

        // Merge existing payload with new items, while filtering out de-selected drawings
        const selectedIdSet = new Set(currentDrawingIdsArr.map(id => id.toString()));
        const groupedByItem = {};

        // 1. Process existing groups, filtering out removed drawings
        existingPayload.forEach(row => {
          const filteredDrawings = (row.drawings || []).filter(d => {
            const dId = d.drawing_id?._id || d.drawing_id;
            return dId && selectedIdSet.has(dId.toString());
          });

          if (filteredDrawings.length > 0) {
            const itemId = filteredDrawings[0].item_id?._id || filteredDrawings[0].item_id;
            if (itemId) {
              groupedByItem[itemId] = {
                ...row,
                drawings: filteredDrawings.map(d => ({
                  drawing_id: d.drawing_id?._id || d.drawing_id,
                  item_id: d.item_id?._id || d.item_id,
                  qty: d.qty
                })),
                iso_drawing_qty: filteredDrawings.reduce((sum, d) => sum + Number(d.qty || 0), 0)
              };
            }
          }
        });

        // 2. Add newly fetched drawing items
        newlyFetchedItems.forEach(newItem => {
          if (!groupedByItem[newItem.item_id]) {
            groupedByItem[newItem.item_id] = {
              drawings: [],
              iso_drawing_qty: 0,
              contingency: 0,
              order_qty: 0,
              mto_with_contingency: 0,
              existing_available_qty: 0
            };
          }
          groupedByItem[newItem.item_id].drawings.push({
            drawing_id: newItem.drawing_id,
            item_id: newItem.item_id,
            qty: newItem.qty
          });
          groupedByItem[newItem.item_id].iso_drawing_qty += Number(newItem.qty);
        });

        linenoDrawingPayload = Object.values(groupedByItem);
        setDrawingItems(linenoDrawingPayload);
      } catch (err) {
        toast.error(err.message || "Failed to process drawing items");
        return;
      }
    }

    if (mto.material_control_chart === "Drawing-Basis" && !linenoDrawingPayload.length) {
      toast.error("No valid drawing-item combinations found");
      return;
    }

    setDisable(true);
    const body = new URLSearchParams();
    body.append("project", localStorage.getItem("U_PROJECT_ID"));
    body.append("pr_by", localStorage.getItem("PAY_USER_ID"));
    body.append("area_unit", mto.area_unit);
    body.append("material_control_chart", mto.material_control_chart);
    body.append("lineno_drawingno", JSON.stringify(linenoDrawingPayload));
    if (data?._id) body.append("id", data._id);

    try {
      const res = await axios.post(`${V_URL}/user/manage-material-control-list`, body, {
        headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"), "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success(res.data.message);
      if (res.data.data?._id) setFinalId(res.data.data._id);
      setDisable3(true);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setDisable(false);
    }
  };

  const handleReset = () => {
    setMto({ area_unit: "", material_control_chart: "", lineno_drawingno: [] });
    setSelectedDrawings([]);
    setDrawingItems([]);
    setEditData({});
    setError({});
  };

  const handleUpload = async () => {
    if (!uploadFile) return toast.error("Please select a file!");
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("mto_id", data?._id || finalId);

    try {
      const response = await axios.post(`${V_URL}/user/mto/import-mto-items`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
      });
      toast.success(response.data.message || "Imported successfully!");
      setUploadFile(null);
      refreshData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "File upload failed!");
    }
  };

  const handleSaveModal = async (mtoData, addMore) => {
    try {
      const bodyFormData = new URLSearchParams();
      const mtoId = data?._id || finalId;
      bodyFormData.append("mto_id", mtoId);
      if (mtoData?.id) bodyFormData.append("id", mtoData.id);
      bodyFormData.append("item_id", mtoData.item_id);
      bodyFormData.append("ClientMtoQty", mtoData.ClientMtoQty || 0);
      bodyFormData.append("continegancy", mtoData.continegancy || 0);
      bodyFormData.append("MTOwithContinegancy", mtoData.MTOwithContinegancy || 0);
      bodyFormData.append("ExistingAvailableQty", mtoData.ExistingAvailableQty || 0);
      bodyFormData.append("OrderQty", mtoData.OrderQty || 0);
      bodyFormData.append("remarks", mtoData.remarks || "");

      const response = await axios.post(`${V_URL}/user/manage-material-control-client-mto-items`, bodyFormData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchMaterialControlItems();
        setEditData({});
        if (!addMore) handleClose();
      } else {
        toast.error(response.data.message || "Save failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (data?._id || finalId) fetchMaterialControlItems();
  }, [data?._id, finalId]);

  const handleEdit = async (rowData) => {
    if (mto.material_control_chart === "Client-MTO-Basis" && !rowData.__fromQtyTable) {
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
        await axios.post(`${V_URL}/user/manage-material-control-list`, body, {
          headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"), "Content-Type": "application/x-www-form-urlencoded" },
        });
        toast.success("Quantity updated successfully");
        await fetchMaterialControlItems();
      } catch (err) {
        toast.error("Failed to update quantity");
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
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);
        bodyFormData.append("mto_id", data?._id || finalId);
        axios({
          method: "delete",
          url: `${V_URL}/user/delete-material-control-client-mto-items`,
          data: bodyFormData,
          headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
        })
          .then((response) => {
            if (response.data.success) toast.success(response?.data?.message);
            refreshData();
          })
          .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"));
      }
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const handleGenerateMaterialControlList = async () => {
    const materialControlId = finalId || data?._id;
    if (!materialControlId) return toast.error("Material Control not found!");
    try {
      const response = await axios.post(`${V_URL}/user/manage-material-control-list`, { id: materialControlId, status: 1, status_update: true }, {
        headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(PO_ROUTE_URLS.PIPING_MTO);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to generate Material Control List!");
    }
  };

  useEffect(() => {
    if (!mto.area_unit || mto.material_control_chart !== "Drawing-Basis") {
      setDrawingOptions([]);
      setSelectedDrawings([]);
      return;
    }
    axios.get(`${V_URL}/user/get-piping-drawing`, {
      params: {
        area_unit: mto.area_unit,
        unassigned_mto: true,
        current_mto_id: location.state?._id || location.state?.id || data?._id || data?.id || finalId || "",
        include_ids: selectedDrawings.join(",")
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}` },
    })
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.message);
          return;
        }
        const list = res.data.data?.data || [];
        setDrawingOptions(list.map((d) => ({ 
          label: d.drawing_no, 
          value: d._id,
          // Track if this drawing was already in the MTO when we loaded the page
          isExisting: (location.state?.lineno_drawingno || []).some(line => 
            (line.drawings || []).some(draw => (draw.drawing_id?._id || draw.drawing_id) === d._id)
          )
        })));
      })
      .catch(() => toast.error("Failed to load drawings"));
  }, [mto.area_unit, mto.material_control_chart, selectedDrawings.length]);

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
          item: item,
          qty: Number(row.qty || 0),
          iso_drawing_qty: Number(row.iso_drawing_qty || 0),
          contingency: Number(row.contingency || 0),
          existing_available_qty: Number(row.existing_available_qty || 0),
          mto_with_contingency: Number(row.mto_with_contingency || 0),
          order_qty: Number(row.order_qty || 0),
          __fromQtyTable: true,
        });
      }
    });
    return Array.from(map.values());
  };

  const rawItems = materialControlItems;
  const mergedItems = useMemo(() => mergeMaterialItems(materialControlItems), [materialControlItems]);

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link></li>
                <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_MTO}>Material Control List</Link></li>
                <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                <li className="breadcrumb-item active">{data?._id ? "Edit" : "Add"} Material Control</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form>
                  <div className="form-heading"><h4>{data?._id ? "Edit" : "Add"} Material Control Details</h4></div>
                  <div className="row">
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>Material Control Chart</label>
                        <select className="form-control" name="material_control_chart" value={mto.material_control_chart} onChange={handleChange}>
                          <option value="">Select Material Control Chart</option>
                          <option value="Drawing-Basis">Drawing Basis</option>
                          <option value="Client-MTO-Basis">Client MTO Basis</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>Area / Location <span className="login-danger">*</span></label>
                        <select className="form-control" name="area_unit" value={mto.area_unit || ""} onChange={handleChange}>
                          <option value="">-- Select Area --</option>
                          {areaData.map((area) => <option key={area._id} value={area._id}>{area.area || area.name}</option>)}
                        </select>
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
                            optionDisabled={(option) => option.isExisting}
                            onChange={(e) => setSelectedDrawings(e.value)} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-12 text-end">
                    <button type="button" className="btn btn-primary submit-form" onClick={handleSubmit} disabled={disable || disable3}>
                      {disable ? "Processing..." : data?._id ? "Update" : "Next and Continue"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {(finalId || data?._id) && (
          <>
            {mto.material_control_chart === "Drawing-Basis" && (
              <>
                <MaterialControlSectionTable handleSave={handleSave} transactionData={rawItems} handleEdit={handleEdit} handleDelete={handleDelete} finalId={finalId} dataId={data?._id} fetchTransactionData={fetchMaterialControlItems} />
                <MaterialControlSectionTableQty handleSave={handleSave} transactionData={mergedItems} handleEdit={handleEdit} handleDelete={handleDelete} finalId={finalId} dataId={data?._id} fetchTransactionData={fetchMaterialControlItems} />
              </>
            )}
            {mto.material_control_chart === "Client-MTO-Basis" && (
              <MaterialControlClientMtoSectionTable handleSave={handleSave} handleEdit={handleEdit} handleDelete={handleDelete} finalId={finalId} dataId={data?._id} transactionData={clientMtoItems} />
            )}

            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body text-end">
                    <button type="button" className="btn btn-primary submit-form" disabled={disable} onClick={handleGenerateMaterialControlList}>Generate Material Control</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {modalType === "drawing" && <MaterialControlItemModal show={show} handleClose={handleClose} itemData={itemData} handleSaveModal={handleSaveModal} handleUpload={handleUpload} editData={editData} drawId={finalId || data?._id} finalId={finalId} uploadFile={uploadFile} handleFileChange={handleFileChange} />}
      {modalType === "client" && <MaterialControlItemModalClientMto show={show} handleClose={handleClose} itemData={itemData} handleSaveModal={handleSaveModal} handleUpload={handleUpload} editData={editData} drawId={finalId || data?._id} finalId={finalId} uploadFile={uploadFile} handleFileChange={handleFileChange} />}
    </div>
  );
};

export default PipingManageMto;
