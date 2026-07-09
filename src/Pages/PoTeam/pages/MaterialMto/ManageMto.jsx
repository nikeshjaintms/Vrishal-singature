import React, { useEffect, useState } from 'react';
import { V_URL } from '../../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import MtoItemModal from '../../../../Components/MaterialMTO/MtoItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../../../Store/Store/Item/Item';
import { getAreasAction } from '../../../../Store/PoTeam/Area/AreaSlice';
import MtoSectionTable from '../../../../Components/MaterialMTO/MtoSectionTable';
import { getMaterialMtoById } from '../../../../Store/PoTeam/MaterialMTO/MaterialMto';
import { getReusableList } from '../../../../Store/Store/Stock/getReusableList';

const ManageMto = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const handleFileChange = (e) => setUploadFile(e.target.files[0]);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [show, setShow] = useState(false);
  const [mto, setMto] = useState({ areaBuilding: "" });
  const [editData, setEditData] = useState({});
  const [finalId, setFinalId] = useState('');
  const [reusableStock, setReusableStock] = useState([]);

  const data = location.state;

  const itemData = useSelector((state) => state?.getItem?.user?.data);
  const mtoItemsData = useSelector((state) => state?.materialMto?.single?.items) || [];
  const usedStockIds = mtoItemsData
    ?.filter((item) => item.usableStockId)
    .map((item) => String(item.usableStockId));
  const areas = useSelector((state) => state?.getAreas?.data?.areas) || [];

  useEffect(() => {
    dispatch(getItem({ is_main: false }));
    dispatch(getAreasAction({ project: localStorage.getItem('U_PROJECT_ID') }));
  }, [dispatch]);

  useEffect(() => {
    if (location.state) {
      setMto({
        poNumber: location.state?.poNumber,
        date: moment(location.state?.date).format('YYYY-MM-DD'),
        areaBuilding: location.state?.areaBuilding._id,
      });
    }

    if (location.state?._id) {
      dispatch(getMaterialMtoById({ id: location.state?._id }));
      setFinalId(location.state._id);
      setDisable3(true);
    } else if (finalId) {
      dispatch(getMaterialMtoById({ id: finalId }));
    }
  }, [location.state, dispatch, finalId]);

  const refreshData = () => {
    dispatch(getMaterialMtoById({ id: finalId || location.state?._id }));
  };

  const handleChange = (e) => setMto({ ...mto, [e.target.name]: e.target.value });
  const handleClose = () => { setEditData({}); setShow(false); };
  const handleSave = () => { setEditData({}); setShow(true); };

  // ---------- FINAL SUBMIT: Create MTO or load existing ----------
  const handleSubmit = async () => {
    if (!mto.areaBuilding) {
      toast.error("Please select Area / Building");
      return;
    }

    setDisable(true);

    try {
      // // Step 1: Check if MTO exists for selected area
      // const checkRes = await axios.post(
      //   `${V_URL}/user/material/get-mto-items-by-area`,
      //   { project: localStorage.getItem("U_PROJECT_ID"), areaBuilding: mto.areaBuilding },
      //   { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      // );

      // if (checkRes.data?.success && checkRes.data?.data?._id) {
      //   const existingMtoId = checkRes.data.data._id;
      //   toast.success("Existing MTO loaded");
      //   setFinalId(existingMtoId);
      //   setDisable3(true);

      //   // Fetch MTO items
      //   dispatch(getMaterialMtoById({ id: existingMtoId }));
      //   // setShow(true); // Enable Add Item
      //   setDisable(false);
      //   return;
      // }

      // Step 2: If no MTO exists, create new MTO
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
      bodyFormData.append("created", localStorage.getItem("PAY_USER_ID"));
      bodyFormData.append("areaBuilding", mto.areaBuilding);

      if (data?._id) bodyFormData.append("id", data._id);

      const createRes = await axios.post(
        `${V_URL}/user/material/manage-material-mto`,
        bodyFormData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (createRes.data.success) {
        const newMtoId = createRes.data.data._id;
        toast.success(createRes.data.message);
        setFinalId(newMtoId);
        setDisable3(true);

        // Fetch items for new MTO
        dispatch(getMaterialMtoById({ id: newMtoId }));
        // setShow(true); // Enable Add Item
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setDisable(false);
    }
  };

  const handleReset = () => { setMto({ poNumber: "", date: "" }); setEditData({}); };
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
    console.log("MTO Data in Modal:", mtoData);
    const myurl = `${V_URL}/user/material/manage-mto-items`;
    const bodyFormData = new URLSearchParams();

    bodyFormData.append("mto_id", data?._id || finalId);

    if (mtoData?.id) bodyFormData.append("id", mtoData.id);
    bodyFormData.append("item_id", mtoData.item_id);
    bodyFormData.append("material_grade", mtoData.material_grade || ""); // NEW
    bodyFormData.append("gadClientQty", mtoData.gadClientQty || 0);       // NEW
    bodyFormData.append("fabDrawingQty", mtoData.fabDrawingQty || 0);     // NEW
    bodyFormData.append("remarks", mtoData.remarks || "");
    bodyFormData.append("usableStockId", mtoData.usableStockId || ""); // NEW
    bodyFormData.append("usableStock", mtoData.usableStock || 0);       // NEW
    bodyFormData.append("contingency", mtoData.contingency || 0); // ✅ new field
    bodyFormData.append("orderedQty", mtoData.orderedQty || 0); // ✅ new field


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
        setReusableStock({});

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
        const myurl = `${V_URL}/user/material/delete-mto-items`;
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


  const handleGenerateMto = async () => {
    if (!finalId && !data?._id) return toast.error("MTO not found!");

    try {
      const response = await axios.post(
        `${V_URL}/user/material/generate-mto`,
        { mtoId: finalId || data?._id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "MTO generated successfully!");
        navigate('/material-po/mto-management');
        refreshData();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to generate MTO!");
    }
  };


  // --- Fetch reusable stock when an item is selected in modal ---
  const handleFetchReusable = (item_id) => {
    if (!item_id) return;

    dispatch(getReusableList())
      .unwrap()
      .then((res) => {
        if (res.success) {
          const filteredData = (res.data || []).filter(item => {
            // Check if itemId.$oid matches the given item_id
            return item.item_id === item_id && item.issued === false;
          });

          setReusableStock(filteredData);
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to fetch reusable stock");
      });
  };

  console.log("Resulable Stock ", reusableStock);



  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">

          {/* Breadcrumb & Form */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="material-po/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/material-po/mto-management">MTO List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? "Edit" : "Add"} MTO</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="form-heading"><h4>{data?._id ? "Edit" : "Add"} MTO Details</h4></div>
                    <div className="row">
                      {data?._id && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>Purchase Order No <span className="login-danger">*</span></label>
                            <input className="form-control" type="text" value={mto.poNumber} disabled />
                          </div>
                        </div>
                      )}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Area / Building</label>
                          <select className="form-control" name="areaBuilding" value={mto.areaBuilding} onChange={handleChange} disabled={data?._id}>
                            <option value="">Select Area</option>
                            {areas.map((a) => <option key={a._id} value={a._id}>{a.area}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button type="button" className="btn btn-primary submit-form me-2"
                          onClick={handleSubmit} disabled={(disable || disable3) && !(data?._id && finalId)}>
                          {disable ? "Processing..." : (data?._id ? "Update" : "Next and Continue")}
                        </button>
                        <button type="button" className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Item Table */}
          <div className="row">
            <div className="col-sm-12">
              <MtoSectionTable
                handleSave={handleSave}
                transactionData={data?._id || finalId ? mtoItemsData : []}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                finalId={finalId}
                dataId={data?._id}
                fetchTransactionData={refreshData}
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className='float-end'>
                    <button type='button'
                      className="btn btn-primary submit-form me-2"
                      disabled={(disable || disable3) && !(finalId || data?._id)}
                      onClick={handleGenerateMto}
                    >
                      {finalId || data?._id ? "Generate MTO" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <MtoItemModal
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
            reusableStock={reusableStock}
            onItemSelect={handleFetchReusable}
            stockUsedIds={usedStockIds}
          />

        </div>
      </div>
    </div>
  );
};

export default ManageMto;
