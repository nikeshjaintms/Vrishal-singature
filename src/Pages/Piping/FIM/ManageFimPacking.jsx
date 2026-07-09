import React, { useEffect, useState, useMemo } from 'react';
import { M_CON, V_URL, QC } from '../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import FimItemModal from '../../../Components/Piping/FIMModal/FIMModal';
import { useDispatch, useSelector } from 'react-redux';
import { getItemDetails } from '../../../Store/Piping/Item/Item';
import { getItemCategory } from '../../../Store/Piping/ItemCategory/ItemCategory';
import FimSectionTable from '../../../Components/Piping/FIMModal/FIMSectionTable';
import { clearFIMItems, getFIMidData } from '../../../Store/Piping/FIM/OneFimListItem';

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
    package_list_no: "",
    package_list_date: "",
    rgp_no: "",
    returnable_type: "",
    vehicle_number: "",
    supplier: "",
    receiving_date: "",
    received_by: "",
  });

  // console.log("FIM State:", fim);
  const [editData, setEditData] = useState({});
  console.log("Edit Data", editData);
  const [finalId, setFinalId] = useState('');
  const data = location.state;

  // console.log("Location State", data);

  useEffect(() => {
    dispatch(getItemDetails({ is_main: false }));
    dispatch(getItemCategory());
  }, [dispatch]);

  useEffect(() => {
    const d = location.state;
    if (d) {
      setFim({
        package_list_no: d.package_list_no || "",
        package_list_date: d.package_list_date
          ? moment(d.package_list_date).format("YYYY-MM-DD")
          : "",
        returnable_type: d.returnable_type || "",
        rgp_no: d.rgp_no || "",
        vehicle_number: d.vehicle_number || "",
        supplier: d.supplier || "",
        receiving_date: d.receiving_date
          ? moment(d.receiving_date).format("YYYY-MM-DD")
          : "",
        received_by:
          typeof d.received_by === "object"
            ? d.received_by.email || ""
            : d.received_by || "",
      });

      if (d._id) {
        setFinalId(d._id);
        dispatch(getFIMidData({ id: d._id }));
      }
    }
  }, [location.state, dispatch]);

  useEffect(() => {
    if (!location.state && !finalId) {
      dispatch(clearFIMItems());
    }

    return () => {
      dispatch(clearFIMItems());
    };
  }, [location.state, finalId, dispatch]);

  // const refreshData = () => {
  //   dispatch(getFIMidData({ id: finalId || location.state?._id }));
  // };
const refreshData = () => {
  const id = finalId || location.state?._id;
  if (!id) return;   // 🚀 prevent fetching when no id
  dispatch(getFIMidData({ id }));
};
useEffect(() => {
  if (!finalId) {
    dispatch(clearFIMItems());
  }
}, [finalId, dispatch]);

  const itemData = useSelector((state) => state?.getItemDetails?.user?.data?.data);
  // const rawFimItemsData = useSelector((state) => state?.getFIMidData?.user?.data?.items) || [];

//   const rawFimItemsData = useSelector((state) => {
//   if (!finalId && !location.state?._id) return [];
//   return state?.getFIMidData?.user?.data?.items || [];
// });
const rawFimItemsData = useSelector((state) => {
  const id = finalId || location.state?._id;
  if (!id) return []; // no FIM selected → empty
  return state?.getFIMidData?.user?.data?.items || [];
});

  const categories = useSelector((state) => state?.getItemCategory?.user?.data) || []; // adjust path to your real payload

  // Enrich FIM items with full item details using item_id and item_category_id
  const fimItemsData = useMemo(() => {
    if (!rawFimItemsData) {
      return rawFimItemsData;
    }

    return rawFimItemsData.map((fimItem) => {
      let enrichedItem = { ...fimItem };

      // Enrich item_id with full item details
      if (itemData && Array.isArray(itemData)) {
        const itemId =
          typeof fimItem.item_id === "object" && fimItem.item_id !== null
            ? fimItem.item_id._id || fimItem.item_id
            : fimItem.item_id;

        const fullItemDetails = itemData.find((item) => {
          const currentItemId = item._id?.toString() || item._id;
          const searchItemId = itemId?.toString() || itemId;
          return currentItemId === searchItemId;
        });

        if (fullItemDetails) {
          enrichedItem = {
            ...enrichedItem,
            item_id: {
              ...fullItemDetails,
              // Preserve any existing item_id properties
              ...(typeof fimItem.item_id === "object" ? fimItem.item_id : {}),
            },
          };
        }
      }

      // Enrich item_category_id with full category details
      if (categories && Array.isArray(categories)) {
        const categoryId =
          typeof fimItem.item_category_id === "object" && fimItem.item_category_id !== null
            ? fimItem.item_category_id._id || fimItem.item_category_id
            : fimItem.item_category_id;

        const fullCategoryDetails = categories.find((cat) => {
          const currentCatId = cat._id?.toString() || cat._id;
          const searchCatId = categoryId?.toString() || categoryId;
          return currentCatId === searchCatId;
        });

        if (fullCategoryDetails) {
          enrichedItem = {
            ...enrichedItem,
            item_category_id: {
              ...fullCategoryDetails,
              // Preserve any existing item_category_id properties
              ...(typeof fimItem.item_category_id === "object" ? fimItem.item_category_id : {}),
            },
          };
        }
      }

      return enrichedItem;
    });
  }, [rawFimItemsData, itemData, categories]);

  console.log("edit Data:", editData);


  const handleChange = (e) => {
    setFim({ ...fim, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setEditData({});
    setShow(false);
  };

  const handleSave = () => {
    setEditData({});
    setShow(true);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!fim.package_list_no) newErrors.package_list_no = "Package List No is required";
    if (!fim.package_list_date) newErrors.package_list_date = "Package List Date is required";
    if (!fim.rgp_no) newErrors.rgp_no = "RGP No / FIM Lot No is required";
    if (!fim.returnable_type) newErrors.returnable_type = "Please select Returnable or Non-Returnable";
    if (!fim.vehicle_number) newErrors.vehicle_number = "Vehicle Number is required";
    // if (!fim.received_by) newErrors.received_by = "Receiving By is required";
    if (!fim.supplier) newErrors.supplier = "Supplier is required";

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }
    setDisable(true);

    const bodyFormData = new URLSearchParams();
    bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
    bodyFormData.append("received_by", localStorage.getItem("PAY_USER_ID"));

    Object.entries(fim).forEach(([key, value]) => {
      if (key === "received_by") return; // 🚫 block overwrite
      bodyFormData.append(key, value || "");
    });


    if (data?._id) {
      bodyFormData.append("id", data?._id);
    }

    axios({
      method: "post",
      url: `${V_URL}/user/manage-fim-packing`,
      data: bodyFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    })
      .then((response) => {

        // if (response?.data?.success === true) {
        //   toast.success(response.data.message);
        //   setFinalId(response.data.data._id);

        //   if (data?._id) {
        //     navigate("/piping/user/manage-fim-packing");
        //   }
        // }
        
        if (response?.data?.success === true) {
  toast.success(response.data.message);

  const newId = response.data.data._id;
  setFinalId(newId);

  // Fetch FIM items for the new ID
  dispatch(getFIMidData({ id: newId }));

  // Navigate only if editing an existing FIM
  if (data?._id) {
    navigate("/piping/user/manage-fim-packing");
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
      package_list_no: "",
      package_list_date: "",
      returnable_type: "",
      rgp_no: "",
      // fim_lot_no: "",
      // eway_bill: "",
      vehicle_number: "",
      supplier: "",
      receiving_date: "",
      received_by: ""
    });
    setError({});
     setFinalId("");          
  dispatch(clearFIMItems());
  };




  const handleSaveModal = (fimData, addMore) => {
    const myurl = `${V_URL}/user/manage-fim-packing-items`;
    const bodyFormData = new URLSearchParams();

    // required packing id
    bodyFormData.append('fim_packing_id', data?._id || finalId);

    // update flow
    if (fimData?._id) {
      bodyFormData.append('id', fimData._id);
    }

    // new required fields
    bodyFormData.append('item_category_id', fimData.item_category);
    bodyFormData.append('item_id', fimData.item_id);
    bodyFormData.append('piping_material_specification', fimData.piping_material_specification);
    bodyFormData.append('fim_list_qty', fimData.fim_list_qty);
    bodyFormData.append('received_qty', fimData.received_qty);
    bodyFormData.append('hsn_sac', fimData.hsn_sac);
    bodyFormData.append('rate', fimData.rate);
    bodyFormData.append('gst', fimData.gst);
    bodyFormData.append('total_amount', fimData.total_amount);
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
        if (!addMore) handleClose();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Something went wrong");
      });
  };

  const handleEdit = (editData) => {
    // console.log("Editing item:", editData);
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
        const myurl = `${V_URL}/user/delete-fim-packing-items`;
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
          url: `${V_URL}/user/update-fim-status`,
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
              dispatch(clearFIMItems());

              // Clear section table
              navigate('/piping/user/fim-packing-list');
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
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/fim-packing-list">FIM Packing List</Link>
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
                            onChange={handleChange} name="package_list_no" value={fim.package_list_no} />
                          {error.package_list_no && (
                            <small className="text-danger">{error.package_list_no}</small>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Package List Date <span className="login-danger">*</span></label>
                          <input className="form-control" type="date"
                            onChange={handleChange} name="package_list_date" value={fim.package_list_date} />
                          {error.package_list_date && (
                            <small className="text-danger">{error.package_list_date}</small>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>RGP No/FIM Lot No <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="rgp_no" value={fim.rgp_no} />
                          {error.rgp_no && (
                            <small className="text-danger">{error.rgp_no}</small>
                          )}
                        </div>
                      </div>
                      {/* <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>FIM Lot No <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="fim_lot_no" value={fim.fim_lot_no} />
                        </div>
                      </div> */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label> Returnable / Non Returnable
                            <span className="login-danger">*</span>
                          </label>

                          <select name="returnable_type" className="form-control" value={fim.returnable_type} onChange={handleChange} >
                            <option value="">Select Type</option>
                            <option value="Returnable">Returnable</option>
                            <option value="Non-Returnable">Non Returnable</option>
                          </select>
                          {error.returnable_type && (
                            <small className="text-danger">{error.returnable_type}</small>
                          )}
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Vehicle Number <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="vehicle_number" value={fim.vehicle_number} />
                          {error.vehicle_number && (
                            <small className="text-danger">{error.vehicle_number}</small>
                          )}
                        </div>
                      </div>
                      {/* <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Receiving By <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="received_by" value={fim.received_by} />
                            {error.received_by && (
                                <small className="text-danger">{error.received_by}</small>
                              )}
                        </div>
                      </div> */}
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Supplier <span className="login-danger">*</span></label>
                          <input className="form-control" type="text"
                            onChange={handleChange} name="supplier" value={fim.supplier} />
                          {error.received_by && (
                            <small className="text-danger">{error.received_by}</small>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Receiving Date</label>
                          <input className="form-control" type="date"
                            onChange={handleChange} name="receiving_date" value={fim.receiving_date} />
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
        categories={categories}   // new prop
        handleSaveModal={handleSaveModal}
        // handleUpload={handleUpload}
        editData={editData}
        finalId={finalId}
        uploadFile={uploadFile}
        handleFileChange={handleFileChange}
      />

    </div>
  );
};

export default ManageFimPacking;
