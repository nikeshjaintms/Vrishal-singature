import React, { useEffect, useState } from 'react';
import { V_URL } from '../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import InquiryforSupplyItemModal from '../../../Components/InquiryforSupply/InquiryforSupplyItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../../Store/Store/Item/Item';
import { getAreasAction } from '../../../Store/PoTeam/Area/AreaSlice';
import InquiryforSupplySectionTable from '../../../Components/InquiryforSupply/InquiryforSupplySectionTable';
import InquiryforSupplyNote from '../../../Components/InquiryforSupply/InquiryforSupplyTermCondition';
import { getMaterialMtoById } from '../../../Store/PoTeam/MaterialMTO/MaterialMto';

const ManageInquiryforSupply = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const [modalType, setModalType] = useState(""); 
  const [show, setShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [error, setError] = useState({});
  const [editData, setEditData] = useState({});
  const [finalId, setFinalId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state;

  const [mto, setMto] = useState({
    poNumber: "",
    date: "",
    item_id: ""
  });

  const handleFileChange = (e) => setUploadFile(e.target.files[0]);

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

  const itemData = useSelector((state) => state?.getItem?.user?.data);
  const mtoItemsData = useSelector((state) => state?.materialMto?.single?.items) || [];
  const areas = useSelector((state) => state?.getAreas?.data?.areas) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMto({ ...mto, [name]: value });
  };

  const handleClose = () => {
    setEditData({});
    setShow(false);
    setModalType("");
  };

  const handleSubmit = () => {
  if (!mto.date) {
    toast.error("Please select Date!");
    return;
  }

  setDisable(true);
  const bodyFormData = new URLSearchParams();
  bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
  bodyFormData.append('created', localStorage.getItem('PAY_USER_ID'));

  Object.entries(mto).forEach(([key, value]) => {
    bodyFormData.append(key, value || "");
  });
  if (data?._id) bodyFormData.append('id', data?._id);

  axios({
    method: 'post',
    url: `${V_URL}/user/material/manage-material-mto`,
    data: bodyFormData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
    }
  })
    .then((response) => {
      if (response.data.success === true) {
        toast.success(response.data.message);
        setFinalId(response.data.data._id);

        // 🟢 Open modal here directly
        // setShow(true);

        if (data?._id) navigate('/material-po/dashboard');
      }
      setDisable(false);
      setDisable3(true);
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
      setDisable(false);
    });
};


  const handleReset = () => {
    setMto({
      poNumber: "",
      date: "",
      item_id: ""
    });
    setEditData({});
    setError({});
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

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Add this function above your return
  const handleSave = () => {
    if (!finalId && !data?._id) {
      toast.error("Please save Inquiry for Supply details first!");
      return;
    }
    console.log("Opening modal..."); // debug line
    setEditData({});
    setModalType("add");
    setShow(true); // 👈 this opens the modal
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
                    <Link to="/piping/user/inquiry-for-supply">Inquiry for Supply List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Inquiry for Supply
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
                        <h4>{data?._id ? "Edit" : "Add"} Inquiry for Supply Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Request No.</label>
                          <input
                            className="form-control"
                            type="text"
                            name="date"
                            value={mto.date}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Date</label>
                          <input
                            className="form-control"
                            type="date"
                            onChange={handleChange}
                            name="date"
                            value={mto.date}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button
                          type="button"
                          className="btn btn-primary submit-form me-2"
                          onClick={handleSubmit}
                          disabled={disable}
                        >
                          {disable ? "Processing..." : (data?._id ? "Update" : "Next and Continue")}
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
          <div className="row">
            <div className="col-sm-12">
              <InquiryforSupplySectionTable
                  transactionData={data?._id || finalId ? mtoItemsData : []}
                  handleSave={handleSave}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  finalId={finalId}
                  dataId={data?._id}
                />
            </div>
          </div>

          {/* Notes */}
          <div className="row">
            <div className="col-sm-12">
              <InquiryforSupplyNote
                  transactionData={data?._id || finalId ? mtoItemsData : []}
                  handleSave={handleSave}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  finalId={finalId}
                  dataId={data?._id}
                />

            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="float-end">
                    <button
                      type="button"
                      className="btn btn-primary submit-form me-2"
                      disabled={(disable || disable3) && (data?._id && finalId)}
                      onClick={handleGenerateMto}
                    >
                      Generate Inquiry for Supply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Modal */}
      <InquiryforSupplyItemModal
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

export default ManageInquiryforSupply;
