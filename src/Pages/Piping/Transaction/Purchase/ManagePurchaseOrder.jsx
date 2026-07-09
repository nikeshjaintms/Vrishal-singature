import React, { useEffect, useState } from "react";
import Header from "../../Include/Header";
import Sidebar from "../../Include/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { V_URL } from "../../../../BaseUrl";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import { IndianRupee, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getParty } from "../../../../Store/Store/Party/Party";
import { getTransport } from "../../../../Store/Store/StoreMaster/Transport/Transport";
import { getItem } from "../../../../Store/Store/Item/Item";
import { getLocation } from "../../../../Store/Store/StoreMaster/InventoryLocation/Location";
import { getStoreAuthPerson } from "../../../../Store/Store/StoreMaster/AuthPerson/AuthPerson";
import { getOrder } from "../../../../Store/Store/Order/Order";

const ManagePurchaseOrder = () => {

  const [finalId, setFinalId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [editTrigger, setEditTrigger] = useState(false);
  const [material, setMaterial] = useState({
    itemName: "",
    itemText: "",
    mcode: "",
    quantity: "",
    rate: "",
    unit: "",
    amount: "",
    remarks: "",
    balance_qty: "",
    gst_percentage: "",
    net_amount: "",
    store_type: ""
  });
  const [withPo, setWithPo] = useState(true);
  const [show, setShow] = useState(false);
  const [editModalId, setEditModalId] = useState('');
  const [purchaseOrder, setPurchaseOrder] = useState({
    orderDate: "",
    lrNo: "",
    lrDate: "",
    prNo: "",
    partyName: "",
    approvedBy: "",
    preparedBy: "",
    transportName: "",
    store: "",
    remarks: "",
    storeType: "",
  });
  const [disable, setDisable] = useState(false);
  const [disable2, setDisable2] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [disableTra, setDisableTra] = useState(true);
  const [error, setError] = useState("");
  const [transactionItem, setTransactionItem] = useState([]);

  const data = location.state;

  useEffect(() => {
    if (location.state) {
      setPurchaseOrder({
        orderNo: location.state?.orderNo,
        orderDate: moment(location.state.orderDate).format("YYYY-MM-DD"),
        lrNo: location.state?.lrNo,
        lrDate: moment(location.state.lrDate).format("YYYY-MM-DD"),
        partyName: location.state?.party._id || null,
        transportName: location.state?.transport._id || null,
        store: location.state?.storeLocation._id || null,
        prNo: location.state?.prNo,
        purchaseType: location.state?.type || "none",
        approvedBy: location.state?.approvedBy?._id,
        preparedBy: location.state?.preparedBy?._id,
        remarks: location.state?.remarks,
        storeType: location.state?.store_type
      });
      // setMaterialData(location.state?.items || []);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getParty({ storeType: '' })),
          dispatch(getTransport()),
          dispatch(getItem()),
          dispatch(getLocation()),
          dispatch(getStoreAuthPerson()),
          dispatch(getOrder({ tag: 1 }))
        ])
      } catch (error) {
        console.log(error, '!!')
      }
    }
    fetchData();
  }, [dispatch]);

  const item = useSelector((state) => state?.getItem?.user?.data);
  const partyData = useSelector((state) => state?.getParty?.user?.data);
  const transports = useSelector((state) => state?.getTransport?.user?.data);
  const authPerson = useSelector((state) => state?.getStoreAuthPerson?.user?.data);
  const stores = useSelector((state) => state?.getLocation?.user?.data);
  const orderData = useSelector((state) => state?.getOrder?.user?.data);

  useEffect(() => {
    if (disableTra === true) {
      getTrasactionItem();
      setTransactionItem([]);
    }
    // eslint-disable-next-line
  }, [disableTra])

  const getTrasactionItem = () => {
    const url = `${V_URL}/user/get-transaction-item`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('tag', '1');
    // bodyFormData.append('store_type', '2');

    axios({
      method: "post",
      url: url,
      data: bodyFormData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    }).then((response) => {
      if (response?.data.success === true) {
        const dataItem = response?.data?.data;
        console.log(dataItem, 'DATS ITEAM')
        const finalData = dataItem?.filter((da) => da?.orderId?._id === data?._id || da?.orderId?._id === finalId);
        setTransactionItem(finalData);
      }
      setDisableTra(false);
    }).catch((err) => {
      console.log(err);
      toast.error('Something went wrong' || err?.response?.data?.message)
    });
  };

  console.log(transactionItem, 'ITERMS')

  useEffect(() => {
    const finalItem = item?.find((i) => i._id === material.itemName);
    if (finalItem) {
      setMaterial({
        ...material,
        itemText: finalItem?.name,
        unit: finalItem?.unit?.name,
        gst_percentage: finalItem?.gst_percentage,
        rate: finalItem?.purchase_rate
      });
    }
    // eslint-disable-next-line
  }, [material.itemName, editTrigger]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPurchaseOrder({ ...purchaseOrder, [name]: value });
  };

  const handleChangePo = (e) => {
    setWithPo(e.target.checked);
  }

  const handleSubmit = () => {
    if (FormValidation()) {
      setDisable(true);
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
      bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
      bodyFormData.append('party', purchaseOrder.partyName);
      bodyFormData.append('orderDate', purchaseOrder.orderDate);
      bodyFormData.append('lrNo', purchaseOrder.lrNo);
      bodyFormData.append('lrDate', purchaseOrder.lrDate);
      bodyFormData.append('storeLocation', purchaseOrder.store);
      bodyFormData.append('approvedBy', purchaseOrder.approvedBy);
      bodyFormData.append('preparedBy', purchaseOrder.preparedBy);
      bodyFormData.append('transport', purchaseOrder.transportName);
      bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
      bodyFormData.append('tag', '1');
      bodyFormData.append('remarks', purchaseOrder.remarks);
      bodyFormData.append('prNo', purchaseOrder.prNo);
      bodyFormData.append('store_type', purchaseOrder.storeType);

      if (data?._id) {
        bodyFormData.append('id', data._id)
      }
      axios({
        method: 'post',
        url: `${V_URL}/user/manage-order`,
        data: bodyFormData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
      }).then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message)
          setFinalId(response.data.data._id)
          // navigate('/user/purchase-order-management');
          setDisable(false);
          setDisable3(true);
          dispatch(getOrder({ tag: 1 }))
        }
      }).catch((error) => {
        console.log(error);
        toast.error(error.response.data?.message);
        setDisable(false);
      });
    }
  }

  useEffect(() => {
    if (show) {
      const idToCheck = finalId || location.state?._id;
      const getOrderData = orderData?.find((order) => order?._id === idToCheck);
      if (getOrderData) {
        setMaterial((prevMaterial) => ({ ...prevMaterial, store_type: getOrderData?.store_type }));
      }
    }
  }, [show, finalId, location.state?._id, orderData]);

  const handleClose = () => {
    setShow(false);
    setError("");
    setEditModalId('')
  };

  const handleShow = () => setShow(true);

  const handleMaterialChange = (event) => {
    const { name, value } = event.target;
    setMaterial((prevMaterial) => {
      const updatedMaterial = {
        ...prevMaterial,
        [name]: value,
      };
      if (name === "rate" || name === "quantity") {
        const rate = parseFloat(updatedMaterial.rate) || 0;
        const quantity = parseFloat(updatedMaterial.quantity) || 0;
        updatedMaterial.amount = parseFloat(rate * quantity).toFixed(3);
        updatedMaterial.balance_qty = parseFloat(quantity);
        const gstAmount = (updatedMaterial.amount * updatedMaterial.gst_percentage) / 100;
        updatedMaterial.net_amount = (parseFloat(updatedMaterial.amount) + gstAmount).toFixed(3);
      } else if (name === "itemName") {
        const selectedItem = item.find((e) => e._id === value);
        if (selectedItem) {
          updatedMaterial.unit = selectedItem.unit;
          updatedMaterial.mcode = selectedItem.mcode;
          updatedMaterial.gst_percentage = selectedItem.gst_percentage;
          updatedMaterial.rate = selectedItem.purchase_rate;
          const rate = parseFloat(updatedMaterial.rate) || 0;
          const quantity = parseFloat(updatedMaterial.quantity) || 0;
          updatedMaterial.amount = parseFloat((rate * quantity).toFixed(3));
          updatedMaterial.balance_qty = parseFloat(quantity);
          const gstAmount = (updatedMaterial.amount * updatedMaterial.gst_percentage) / 100;
          updatedMaterial.net_amount = (parseFloat((updatedMaterial.amount) + gstAmount).toFixed(3));
        }
      }
      return updatedMaterial;
    });
  };

  const handleResetFrom = () => {
    setPurchaseOrder({
      orderDate: "",
      lrNo: "",
      lrDate: "",
      prNo: "",
      partyName: "",
      approvedBy: "",
      preparedBy: "",
      transportName: "",
      store: "",
      remarks: "",
    });
  }

  const resetMaterialState = () => {
    setMaterial({
      itemName: "",
      itemText: "",
      unit: "",
      mcode: "",
      quantity: "",
      rate: "",
      amount: "",
      remarks: "",
      gst_percentage: "",
      net_amount: "",
    });
  };

  const handleAdd = () => {
    handleShow();
    resetMaterialState();
  };

  const handleEditMaterial = (mData) => {
    setMaterial(mData);
    setWithPo(mData.with_po);
    setEditModalId(mData?._id)
    setShow(true);
    setEditTrigger((prev) => !prev);
  };

  const handleSubmit2 = async (more) => {
    if (finalId || data?._id) {
      if (validationModal()) {

        setDisable2(true)
        const myurl = `${V_URL}/user/manage-transaction-item`;
        const bodyFormData = new URLSearchParams();
        if (!data?._id) {
          bodyFormData.append('orderId', finalId);
        } else {
          bodyFormData.append('orderId', data?._id);
        }
        bodyFormData.append('tag', '1');
        bodyFormData.append('store_type', material?.store_type)
        bodyFormData.append('itemName', material.itemName);
        bodyFormData.append('rate', material.rate)
        bodyFormData.append('amount', material.amount)
        bodyFormData.append('quantity', material.quantity)
        bodyFormData.append('balance_qty', material.balance_qty)
        bodyFormData.append('mcode', material.mcode)
        bodyFormData.append('net_amount', material.net_amount);
        bodyFormData.append('with_po', withPo)
        bodyFormData.append('remarks', material.remarks)

        if (editModalId) {
          bodyFormData.append('id', editModalId)
        }

        await axios({
          method: 'post',
          url: myurl,
          data: bodyFormData,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then((response) => {
          // console.log(response.data);
          if (response.data?.success === true) {
            toast.success(response.data.message);
            if (more !== 'more') {
              setShow(false);
              resetMaterialState();
            } else {
              resetMaterialState();
            }
            setEditModalId('')
            setDisableTra(true);
          } else {
            toast.error(response.data.message);
          }
          setEditModalId('')
          setDisable2(false);
        }).catch((error) => {
          console.log(error, '!!');
          toast.error(error?.response?.data?.message);
          setDisable2(false);
        })
      }
    } else {
      toast.error('Please fill the order form and choose the save and continue');
    }
  }

  const handleModalDelete = (id, title) => {
    Swal.fire({
      title: `Are you sure want to delete ${title}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const myurl = `${V_URL}/user/delete-transaction-item`;
        var bodyFormData = new URLSearchParams();
        bodyFormData.append("id", id);
        axios({
          method: "delete",
          url: myurl,
          data: bodyFormData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }).then((response) => {
          if (response.data.success === true) {
            toast.success(response?.data?.message)
          }
          setDisableTra(true);
        }).catch((error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        })
      }
    });
  };


  const FormValidation = () => {
    var isValid = true;
    let err = {};

    if (!purchaseOrder.orderDate) {
      isValid = false;
      err["order_date_err"] = "Please select date";
    }
    if (!purchaseOrder.partyName) {
      isValid = false;
      err["party_err"] = "Please select party";
    }
    if (!purchaseOrder.transportName) {
      isValid = false;
      err["transport_err"] = "Please select transport";
    }
    if (!purchaseOrder.approvedBy) {
      isValid = false;
      err["approve_err"] = "Please select person";
    }
    if (!purchaseOrder.preparedBy) {
      isValid = false;
      err["prepare_err"] = "Please select person";
    }
    if (!purchaseOrder.store) {
      isValid = false;
      err["store_err"] = "Please select location";
    }
    if (!purchaseOrder.storeType) {
      isValid = false;
      err["storeType_err"] = "Please select store type";
    }

    setError(err);
    return isValid;
  }

  const validationModal = () => {
    var isValid = true;
    let err = {};

    if (!material.itemName) {
      isValid = false;
      err["itemName"] = "Please select material";
    }
    if (!material.quantity) {
      isValid = false;
      err["quantity_err"] = "Please enter quantity";
    }
    if (!material.rate) {
      isValid = false;
      err["rate_err"] = "Please enter rate";
    }
    if (!material.mcode) {
      isValid = false;
      err["mcode_err"] = "Please enter mcode";
    }

    if (!material.store_type) {
      isValid = false;
      err["store_type_err"] = "Please select store type";
    }

    setError(err);
    return isValid;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  }

  let totalSum = 0.000;
  const totalAmount = transactionItem?.reduce((acc, current) => acc + parseFloat(current.net_amount), totalSum);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                    <Link to="/piping/user/purchase-order-management">
                      Purchase Order
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {location.state?._id ? "Edit" : "Add"} Order
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12 d-flex justify-content-between">
                    <div className="form-heading">
                      <h4>Purchase Order</h4>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>
                          Order Date <span className="login-danger">*</span>
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          name="orderDate"
                          value={purchaseOrder.orderDate}
                          onChange={handleChange}
                        />
                        <div className="error">{error.order_date_err}</div>
                      </div>
                    </div>

                    {data?._id ? (
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Order No.
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="orderNo"
                            disabled
                            value={purchaseOrder.orderNo}
                          />
                        </div>
                      </div>
                    ) : null}

                  </div>
                  <div className="row">
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>Party Name <span className="login-danger">*</span></label>
                        <select
                          className="form-select form-control"
                          name="partyName"
                          value={purchaseOrder.partyName}
                          onChange={handleChange}
                        >
                          <option value="">Select Party</option>
                          {partyData?.map((e) => (
                            <option key={e._id} value={e._id}>
                              {e?.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">{error.party_err}</div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>Transport <span className="login-danger">*</span></label>
                        <select
                          className="form-select form-control"
                          name="transportName"
                          value={purchaseOrder.transportName}
                          onChange={handleChange}
                        >
                          <option value="">Select Transport</option>
                          {transports?.map((e) => (
                            <option key={e._id} value={e._id}>
                              {e?.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">{error.transport_err}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>LR No.</label>
                        <input
                          className="form-control"
                          type="number"
                          name="lrNo"
                          value={purchaseOrder.lrNo}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="error"></div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>LR Date</label>
                        <input
                          className="form-control"
                          type="date"
                          name="lrDate"
                          value={purchaseOrder.lrDate}
                          onChange={handleChange}
                        />
                        <div className="error"></div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>
                          Approved By
                          <span className="login-danger">*</span>
                        </label>
                        <select
                          name="approvedBy"
                          className="form-select form-control"
                          aria-label="Default select example"
                          value={purchaseOrder.approvedBy}
                          onChange={handleChange}
                        >
                          <option value="">Select Person</option>
                          {authPerson?.map((e) => (
                            <option key={e?._id} value={e?._id}>
                              {e?.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">{error.approve_err}</div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>Prepared By <span className="login-danger">*</span></label>
                        <select
                          name="preparedBy"
                          className="form-select form-control"
                          aria-label="Default select example"
                          value={purchaseOrder.preparedBy}
                          onChange={handleChange}
                        >
                          <option value="">Select Person</option>
                          {authPerson?.map((e) => (
                            <option key={e?._id} value={e?._id}>
                              {e?.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">{error.prepare_err}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>
                          Location <span className="login-danger">*</span>
                        </label>
                        <select
                          className="form-select form-control"
                          name="store"
                          value={purchaseOrder.store}
                          onChange={handleChange}
                        >
                          <option value="">Select Location</option>
                          {stores?.map((e) => (
                            <option key={e._id} value={e._id}>
                              {e?.name}
                            </option>
                          ))}
                        </select>
                        <div className="error">{error.store_err}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label>PR No.</label>
                        <input
                          className="form-control"
                          type="text"
                          name="prNo"
                          value={purchaseOrder.prNo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="input-block local-forms">
                        <label> Store Type <span className="login-danger">*</span></label>
                        <select className="form-control form-select"
                          value={purchaseOrder.storeType}
                          onChange={handleChange} name='storeType'>
                          <option value="">Select Store Type</option>
                          <option value={1}>Main Store</option>
                          <option value={2}>Project Store</option>
                        </select>
                        <div className="error">{error.storeType_err}</div>
                      </div>
                    </div>

                    <div className="col-12 col-md-12 col-xl-12">
                      <div className="input-block local-forms">
                        <label>Remarks</label>
                        <textarea
                          className="form-control"
                          name="remarks"
                          value={purchaseOrder.remarks}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="col-12 text-end">
                            <div className="doctor-submit text-end">
                              <button type="button"
                                className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable || disable3}>
                                {disable ? 'Processing...' : (data?._id ? 'Update' : 'Next and Continue')}</button>
                              <button type="button"
                                className="btn btn-primary cancel-form" onClick={handleResetFrom}>Reset</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {data?._id || finalId ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <div className="form-heading">
                        <h4 className="mb-0">Material Details</h4>
                      </div>
                      <div className="add-group">
                        <button
                          onClick={handleAdd}
                          className="btn btn-primary add-pluss ms-2"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Add Material"
                        >
                          <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                        </button>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      {transactionItem?.length > 0 ? (
                        <table className="table border-0 mb-0 custom-table table-striped comman-table">
                          <thead>
                            <tr>
                              <th>Sr.</th>
                              <th>Name</th>
                              <th>Unit</th>
                              <th>MCode</th>
                              <th>Quantity</th>
                              <th>Rate</th>
                              <th>Net Amount</th>
                              <th>Remarks</th>
                              <th>With PO</th>
                              <th className="text-end">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionItem?.map((material, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.find(it => it?._id === material?.itemName)?.name}</td>
                                <td>{item?.find(it => it?._id === material?.itemName)?.unit?.name}</td>
                                <td>{material.mcode}</td>
                                <td>{material.quantity}</td>
                                <td>{material.rate}</td>
                                <td>{material.net_amount}</td>
                                <td>{!material?.remarks ? '-' : material?.remarks}</td>
                                <td className='status-badge'>
                                  {material?.with_po === true ? (
                                    <span className="custom-badge status-green">True</span>
                                  ) : (
                                    <span className="custom-badge status-pink">False</span>
                                  )}
                                </td>
                                <td className="text-end d-flex justify-content-end">
                                  {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                  {material?.balance_qty !== 0 ? (
                                    <a
                                      style={{ cursor: "pointer", padding: "6px" }}
                                      className="action-icon"
                                      onClick={() => handleEditMaterial(material)}
                                    >
                                      <Pencil />
                                    </a>
                                  ) : null}

                                  <a
                                    style={{ cursor: "pointer", padding: "6px" }}
                                    className="action-icon mx-2"
                                    onClick={() => handleModalDelete(material?._id, item?.find(it => it?._id === material?.itemName)?.name)}
                                  >
                                    <Trash2 />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : <h5>Looks like the material hasn't been added yet. Please make sure to include it. Thanks!</h5>}
                    </div>

                    <p className="mt-3 ">Total Material: <b>{transactionItem?.length}</b></p>
                    <p>Net Amount: <b>{new Intl.NumberFormat().format(totalAmount)}</b><IndianRupee size={14} /></p>
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="col-12 text-end">
                      <div className="doctor-submit text-end">
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/purchase-order-management')}>Back</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <Modal show={show} backdrop="static" keyboard={false} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Material</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">Name <span className="login-danger">*</span></label>
                  </div>
                  <div className="col-9">
                    <select name="itemName" className="form-control form-select" value={material.itemName}
                      onChange={handleMaterialChange}>
                      <option value="">Select Material</option>
                      {item?.map((e) => (
                        <option key={e._id} value={e._id}>
                          {e?.name} ({e?.mcode})
                        </option>
                      ))}
                    </select>
                    <div className="error">{error.itemName}</div>
                  </div>
                </div>

                {material.itemName ? (
                  <div className="row align-items-center mt-2">
                    <div className="col-3">
                      <label className="col-form-label">Unit</label>
                    </div>
                    <div className="col-9">
                      <input className="form-control" value={material.unit} disabled />
                    </div>
                  </div>
                ) : null}

                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">MCode <span className="login-danger">*</span></label>
                  </div>
                  <div className="col-9">
                    <input type="text" name="mcode" className="form-control"
                      value={material.mcode} onChange={handleMaterialChange} />
                    <div className="error">{error.mcode_err}</div>
                  </div>
                </div>
                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">Quantity <span className="login-danger">*</span></label>
                  </div>
                  <div className="col-9">
                    <input type="number" name="quantity" className="form-control"
                      onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                      value={material.quantity} onChange={handleMaterialChange}
                      disabled={editModalId ? true : false} />
                    <div className="error">{error.quantity_err}</div>
                  </div>
                </div>

                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">Rate <span className="login-danger">*</span></label>
                  </div>
                  <div className="col-9">
                    <input type="number" name="rate" className="form-control"
                      onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                      value={material.rate} onChange={handleMaterialChange} />
                    <div className="error">{error.rate_err}</div>
                  </div>
                </div>
                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">Amount</label>
                  </div>
                  <div className="col-9">
                    <input type="number" name="amount" className="form-control " value={material.amount} disabled />
                  </div>
                </div>

                {material.itemName ? (
                  <>
                    <div className="row align-items-center mt-2">
                      <div className="col-3">
                        <label className="col-form-label">GST(%)</label>
                      </div>
                      <div className="col-9">
                        <input type="number" name="gst_percentage" className="form-control"
                          value={material.gst_percentage} disabled />
                      </div>
                    </div>

                    <div className="row align-items-center mt-2">
                      <div className="col-3">
                        <label className="col-form-label">Net Amount</label>
                      </div>
                      <div className="col-9">
                        <input
                          type="number" name="net_amount" className="form-control"
                          value={material.net_amount} onChange={handleMaterialChange} disabled />
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">With PO</label>
                  </div>
                  <div className="col-9">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox"
                        role="switch" onChange={handleChangePo} checked={withPo}
                        disabled={editModalId ? true : false}
                      />
                    </div>
                  </div>
                </div>

                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label"> Store Type </label>
                  </div>
                  <div className="col-9">
                    <select className="form-control select"
                      value={material.store_type}
                      // disabled={editModalId ? true : false}
                      disabled
                      onChange={handleMaterialChange} name='store_type'>
                      <option value="">Select Store Type</option>
                      <option value={1}>Main Store</option>
                      <option value={2}>Project Store</option>
                    </select>
                    <div className="error">{error.store_type_err}</div>
                  </div>
                </div>

                <div className="row align-items-center mt-2">
                  <div className="col-3">
                    <label className="col-form-label">Remarks</label>
                  </div>
                  <div className="col-9">
                    <textarea name="remarks" className="form-control"
                      value={material.remarks} onChange={handleMaterialChange} />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>

              <button className="btn btn-primary m-2" type="button" onClick={handleSubmit2}
                disabled={disable2}>{disable2 ? 'Processing...' : (editModalId ? 'Update' : 'Save')}</button>
              {!editModalId ? (
                <button className='btn btn-outline-primary m-2' type="button"
                  onClick={() => handleSubmit2('more')} disabled={disable2}>{disable2 ? 'Processing...' : 'Add More'}</button>
              ) : null}
              <button type="button"
                className="btn btn-secondary" onClick={resetMaterialState}>Reset</button>
              {/* <button className="btn btn-primary" onClick={handleSubmit2} type="button">Update </button> */}
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ManagePurchaseOrder;
