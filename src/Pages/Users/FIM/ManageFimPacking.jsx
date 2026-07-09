import React, { useEffect, useState } from 'react';
import { M_CON, V_URL, QC } from '../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import FimItemModal from '../../../Components/FIMModal/FIMModal';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../../Store/Store/Item/Item';
import FimSectionTable from '../../../Components/FIMModal/FIMSectionTable';
import { clearDrawItems, getFIMidData } from '../../../Store/MutipleDrawing/FIM/OneFimListItem';

const ManageFimPacking = () => {
  const [uploadFile, setUploadFile] = useState(null);
  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [error, setError] = useState({});
  const [show, setShow] = useState(false);
  const [fim, setFim] = useState({
    packing_no: "",
    packing_date: "",
    returnable_type: "",
    rgp_no: "",
    fim_lot_no: "",
    eway_bill: "",
    vehicle_number: "",
    supplier: "",
    receiving_date: "",
  });
  const [editData, setEditData] = useState({});
  const [finalId, setFinalId] = useState('');
  const data = location.state;

  console.log("Location State", data);


  useEffect(() => {
    dispatch(getItem({ is_main: false }));
  }, [navigate, disable, dispatch]);

  useEffect(() => {
    if (location.state) {
      setFim({
        packing_no: location.state?.packing_no,
        packing_date: moment(location.state?.packing_date).format('YYYY-MM-DD'),
        returnable_type: location.state?.returnable_type,
        rgp_no: location.state?.rgp_no,
        fim_lot_no: location.state?.fim_lot_no,
        eway_bill: location.state?.eway_bill,
        vehicle_number: location.state?.vehicle_number,
        supplier: location.state?.supplier,
        receiving_date: moment(location.state?.receiving_date).format('YYYY-MM-DD'),
        received_by: location.state?.received_by
      });
    } else if (!finalId) {
      // Clear items if strictly in Add mode without a session ID
      dispatch(clearDrawItems());
    }

    if (location.state?._id) {
      dispatch(getFIMidData({ id: location.state?._id }));
    } else if (finalId) {
      dispatch(getFIMidData({ id: finalId }));
    }

    return () => {
      dispatch(clearDrawItems());
    };
  }, [location.state, dispatch, finalId]);

  const refreshData = () => {
    dispatch(getFIMidData({ id: finalId || location.state?._id }));
  };

  const itemData = useSelector((state) => state?.getItem?.user?.data);
  const fimItemsData = useSelector((state) => state?.getFIMidData?.user?.data?.items) || [];

  const handleChange = (e) => {
    setFim({ ...fim, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
    setEditData({});
  };
  const handleSave = () => {
    setEditData({});
    setShow(true);
  };

  const handleSubmit = () => {
    setDisable(true);
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
    bodyFormData.append('received_by', localStorage.getItem('PAY_USER_ID'));
    Object.entries(fim).forEach(([key, value]) => {
      bodyFormData.append(key, value || "");
    });
    if (data?._id) {
      bodyFormData.append('id', data?._id);
    }
    axios({
      method: 'post',
      url: `${V_URL}/user/fim/manage-fim-packing`,
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

          if (data?._id) {
            navigate('/user/project-store/fim-packing-management');
          }
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
    setFim({
      packing_no: "",
      packing_date: "",
      returnable_type: "",
      rgp_no: "",
      fim_lot_no: "",
      eway_bill: "",
      vehicle_number: "",
      supplier: "",
      receiving_date: "",
      received_by: ""
    });
    setError({});
    dispatch(clearDrawItems());
  };

  const handleUpload = async () => {
    if (!uploadFile) return toast.error("Please select a file!");

    console.log(uploadFile);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("fim_packing_id", data?._id || finalId); // link file to current FIM

    try {
      const response = await axios.post(
        `${V_URL}/user/fim/import-fim-items`, // your backend route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      const res = response.data.message || `Imported ${response.data.data.importedCount || 0} items successfully!`;

      toast.success(res);
      setUploadFile(null);
      refreshData(); // reload FIM items after import
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "File upload failed!");
    }
  };

  const handleSaveModal = (fimData, addMore) => {
    const myurl = `${V_URL}/user/fim/manage-fim-packing-items`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('fim_packing_id', data?._id || finalId);
    if (fimData?._id) {
      bodyFormData.append('id', fimData?._id);
    }
    bodyFormData.append('item_id', fimData.item_id);
    bodyFormData.append('material_grade', fimData.material_grade);
    bodyFormData.append('weight_as_per_list', fimData.weight_as_per_list);
    bodyFormData.append('numbers_as_per_list', fimData.numbers_as_per_list);
    bodyFormData.append('received_weight', fimData.received_weight);
    bodyFormData.append('received_length', fimData.received_length);
    bodyFormData.append('received_width', fimData.received_width);
    bodyFormData.append('received_nos', fimData.received_nos);
    bodyFormData.append('rejected_weight', fimData.rejected_weight);
    bodyFormData.append('rejected_length', fimData.rejected_length);
    bodyFormData.append('rejected_width', fimData.rejected_width);
    bodyFormData.append('rejected_nos', fimData.rejected_nos);
    bodyFormData.append('remarks', fimData.remarks);


    axios({
      method: 'post',
      url: myurl,
      data: bodyFormData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
      }
    })
      .then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message);
        }
        refreshData();
        if (!addMore) {
          handleClose();
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleEdit = (editData) => {
    console.log("Editing item:", editData);
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
        const myurl = `${V_URL}/user/fim/delete-fim-packing-items`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);
        bodyFormData.append("fim_packing_id", data?._id || finalId);
        axios({
          method: "delete",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        })
          .then((response) => {
            if (response.data.success === true) {
              toast.success(response?.data?.message);
            }
            refreshData();
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
          });
      }
    });
  };

  const handleGenerateFim = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to generate this FIM? It will be marked as Pending.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const fimId = finalId || data?._id;

        const bodyFormData = new URLSearchParams();
        bodyFormData.append("id", fimId);
        bodyFormData.append("status", "Pending");

        axios({
          method: "post",
          url: `${V_URL}/user/fim/update-fim-status`,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        })
          .then((res) => {
            if (res.data.success) {
              toast.success(res.data.message);
              handleReset();
              setFinalId("");
              setEditData({});
              setShow(false);
              refreshData();
              dispatch(clearDrawItems());

              // Clear section table
              navigate('/user/project-store/fim-packing-list');
            } else {
              toast.error(res.data.message || "Failed to update status");
            }
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message || "Something went wrong"
            );
          });
      }
    });
  };


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

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
                    <Link to="/user/project-store/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/user/project-store/fim-packing-list">FIM Packing List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} FIM Packing
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
                        <h4>{data?._id ? "Edit" : "Add"} FIM Packing Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Package List No / Invoice No <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="packing_no" value={fim.packing_no} />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Package List Date <span className="login-danger">*</span></label>
                          <input className="form-control" type="date"
                            onChange={handleChange} name="packing_date" value={fim.packing_date} max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>RGP No <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="rgp_no" value={fim.rgp_no} />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>FIM Lot No <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="fim_lot_no" value={fim.fim_lot_no} />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Returnable / Non Returnable <span className="login-danger">*</span></label>
                          <select name="returnable_type" id="" className="form-control" onChange={handleChange} value={fim.returnable_type}>
                            <option value="">Select Type</option>
                            <option value="Returnable" selected={fim.returnable_type === "Returnable"}>Returnable</option>
                            <option value="Non-Returnable" selected={fim.returnable_type === "Non-Returnable"}>Non Returnable</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Vehicle Number <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="vehicle_number" value={fim.vehicle_number} />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>E-way Bill No <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="eway_bill" value={fim.eway_bill} />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Supplier <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="supplier" value={fim.supplier} />
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Receiving Date</label>
                          <input className="form-control" type="date"
                            onChange={handleChange} name="receiving_date" value={fim.receiving_date} max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                    </div>

                    {localStorage.getItem('ERP_ROLE') === M_CON && (
                      <div className="col-12 text-end">
                        <div className="doctor-submit text-end">
                          <button type="button"
                            className="btn btn-primary submit-form me-2"
                            onClick={handleSubmit}
                            disabled={(disable || disable3) && !(data?._id && finalId)}>
                            {disable ? "Processing..." : (data?._id ? "Update" : "Next and Continue")}
                          </button>
                          <button type="button"
                            className="btn btn-primary cancel-form"
                            onClick={handleReset}>Reset</button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Item Table */}
          <div className="row">
            <div className="col-sm-12">
              <FimSectionTable
                handleSave={handleSave}
                transactionData={fimItemsData}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                finalId={finalId}
                dataId={data?._id}
                fetchTransactionData={() => refreshData()}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-sm-12'>
              <div className="card">
                <div className="card-body">
                  <div className="text-end">
                    <button
                      className="btn btn-primary submit-form me-2"
                      onClick={handleGenerateFim}
                    // disabled={(disable || disable3) && !(data?._id && finalId)}
                    >
                      {disable ? "Processing..." : (data?._id ? "Update " : "Generate ")}
                      FIM
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <FimItemModal
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
      />
    </div>
  );
};

export default ManageFimPacking;
