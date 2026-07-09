import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import OrderForm from '../../../../Components/Forms/OrderForm'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminItem } from '../../../../Store/Store/Item/AdminItem'
import ItemsTable from "../../../../Components/Table/ItemTable";
import { AddOrderReturn } from '../../../../Store/Store/Order/ManageOrderReturn'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { Dropdown } from 'primereact/dropdown';

const ManagePurchaseReturn = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editeMode, setEditeMode] = useState(false);
  const [formData, setFormData] = useState({
    order_date: '',
    bill_no: '',
    party_id: '',
    project_id: '',
    receiveBy: '',
    master_id: ''
  });
  const headers = {
    'Name': 'item_name',
    'Unit': 'unit',
    'M.code': 'm_code',
    'QTY': 'quantity',
    'Rate': 'rate',
    'Amount': 'amount',
    'Discount': 'discount',
    'Dis.Amt.': 'discount_amount',
    'SP.DSC.': 'sp_discount',
    'SP.DS.Amt.': 'sp_discount_amount',
    'Tax.Amt.': 'taxable_amount',
    'GST': 'gst',
    'GST Amount': 'gst_amount',
    'Total Amt.': 'total_amount',
    'Remarks': 'remarks',
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [entity, setEntity] = useState([]);
  const [ItemNo, setItemNo] = useState(null);
  const [singleItem, setSingleItems] = useState({
    unit: '',
    gst: '',
    mcode: '',
    item_id: '',
    item_name: ''
  });

  const [item, setItem] = useState({
    item_id: '',
    item_name: '',
    unit: '',
    m_code: '',
    quantity: 0,
    rate: 0,
    amount: 0,
    discount: 0,
    discount_amount: 0,
    sp_discount: 0,
    sp_discount_amount: 0,
    taxable: 0,
    gst: 0,
    gst_amount: 0,
    total_amount: 0,
    remarks: '',
  });

  const [calcItem, setCalCItem] = useState({
    item_id: '',
    quantity: 0,
    rate: 0,
    amount: 0,
    discount: '',
    discount_amount: 0,
    sp_discount: '',
    sp_discount_amount: 0,
    gst: 0,
    gst_amount: 0,
    total_amount: 0,
    remarks: '',
  });
  const dispatch = useDispatch();
  const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
  // Validation for the Item Modal Data
  const validation = () => {
    var isValid = true;
    let err = {};
    if (!item.item_id) {
      isValid = false;
      err['item_error'] = "Please select an item";
    }
    if (!item.rate) {
      isValid = false;
      err['Rate_err'] = "Please enter Rate";
    } else if (parseFloat(item.rate) < 0) {
      isValid = false;
      err['Rate_err'] = "Rate cannot be negative";
    }
    if (!item.quantity || item.quantity === "") {
      isValid = false;
      err['quantity_err'] = "Please enter a quantity";
    } else if (parseInt(item.quantity) === 0) {
      isValid = false;
      err['quantity_err'] = "Quantity must be greater than 0";
    } else if (parseInt(item.quantity) < 0) {
      isValid = false;
      err['quantity_err'] = "Quantity cannot be negative";
    }

    setError(err);
    return isValid;
  };
  const handleEdit = (index) => {
    setEditIndex(index)
    const itemToEdit = data[index]
    setEditeMode(true)
    setCalCItem(itemToEdit);
    setModalOpen(true);
  };
  const handleSave = () => {
    if (validation()) {
      if (editeMode && editIndex !== null) {
        setData((prevData) => {
          const updatedData = [...prevData];
          updatedData[editIndex] = item;
          return updatedData;
        });
        setEditeMode(false);
        setEditIndex(null);
      } else {
        setData((prevData) => [...prevData, item]);
      }
      handleModalClose();
    }
  };
  useEffect(() => {
    dispatch(getAdminItem({ is_main: true }));
  }, [dispatch])

  // Load the item details from the API
  useEffect(() => {
    if (itemDetails.length > 0) {
      setEntity(itemDetails);
    }
  }, [itemDetails]);

  // Just to populate the sinfle item details
  useEffect(() => {
    const filteredData = itemDetails?.find((it) => it?._id === ItemNo);
    setSingleItems({
      item_id: filteredData?.ItemId,
      item_name: filteredData?.name,
      unit: filteredData?.unit?.name,
      gst: filteredData?.gst_percentage,
      mcode: filteredData?.mcode
    })
  }, [itemDetails, ItemNo])

  const Itemsoption = itemDetails?.map(it => ({
    label: it?.name,
    value: it?._id
  }));
  const handleItemsChange = (e) => {
    setItemNo(e.value);
  };

  const calculation = (e) => {
    const { name, value } = e.target

    setCalCItem((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  let itemName = calcItem.item_id
  let Amount = parseFloat(calcItem.quantity) * parseFloat(calcItem.rate);
  let disAmount = Amount * calcItem.discount / 100
  let spDiscount = (Amount - disAmount) * calcItem.sp_discount / 100;
  let taxableAmount = Amount - disAmount - spDiscount;
  let gstAmount = (taxableAmount * parseFloat(singleItem?.gst)) / 100;
  let total = taxableAmount + gstAmount;

  useEffect(() => {
    setItem({
      item_id: itemName,
      item_name: singleItem.item_name,
      quantity: calcItem.quantity,
      m_code: singleItem.mcode,
      unit: singleItem.unit,
      rate: calcItem.rate,
      amount: Amount.toFixed(2) || 0,
      discount: calcItem.discount,
      discount_amount: disAmount.toFixed(2) || 0,
      sp_discount: calcItem.sp_discount,
      sp_discount_amount: spDiscount.toFixed(2) || 0,
      taxable_amount: taxableAmount.toFixed(2),
      gst: singleItem?.gst,
      gst_amount: gstAmount.toFixed(2) || 0,
      total_amount: total.toFixed(2) || 0,
      remarks: calcItem?.remarks,
    })
  }, [itemName, Amount, disAmount, spDiscount, taxableAmount, gstAmount, total, calcItem?.remarks])
  const handleChange = (e) => {
    calculation(e);
    setError("")
  }
  const handleAddItem = () => {
    setEditeMode(false)
    setModalOpen(true)
  }
  const handleDelete = (index) => {
    const itemName = data[index]?.item_name || "this item";
    Swal.fire({
      title: `Are you sure you want to delete ${itemName}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prevData) => prevData.filter((_, i) => i !== index));
        // Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };
  const handleReset = () => {
    // Clear the form for adding a new item
    setItem({
      item_id: '',
      item_name: '',
      unit: '',
      m_code: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      discount: 0,
      discount_amount: 0,
      sp_discount: 0,
      sp_discount_amount: 0,
      taxable_amount: 0,
      gst: 0,
      gst_amount: 0,
      total_amount: 0,
      remarks: '',
    });
    setCalCItem({
      item_id: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      discount: '',
      discount_amount: 0,
      sp_discount: '',
      sp_discount_amount: 0,
      gst: 0,
      gst_amount: 0,
      total_amount: 0,
      remarks: '',
    });
  }
  const handleAddMore = () => {
    if (validation()) {
      setData((prevData) => {
        return [...prevData, item];
      });
      handleReset();
    }
  };
  const handleResetItem = () => {
    setItem({
      item_id: '',
      unit: '',
      m_code: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      discount: 0,
      discount_amount: 0,
      sp_discount: 0,
      sp_discount_amount: 0,
      taxtable: 0,
      gst: 0,
      gst_amount: 0,
      total_amount: 0,
      remarks: '',
    });
    setCalCItem({
      item_id: '',
      quantity: 0,
      rate: 0,
      amount: 0,
      discount: '',
      discount_amount: 0,
      sp_discount: '',
      sp_discount_amount: 0,
      gst: 0,
      gst_amount: 0,
      total_amount: 0,
      remarks: '',
    });
  }
  const handleModalClose = () => {
    setModalOpen(false)
    handleResetItem();
    setError("")
  };
  const handleSubmit = (addForm) => {
    // if (Ordervalidation()) {
    if (data?.length > 0) {
      const payload = {
        "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
        "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
        "order_date": addForm.order_date,
        "bill_no": addForm.bill_no,
        "party_id": addForm.party_id,
        "project_id": addForm.project_id,
        "master_id": addForm.master_id,
        "items_details": data,
        "transport_id": addForm?.transport_id,
        "receive_date": addForm.receive_date,
        "challan_no": addForm.challan,
        "po_no": addForm.po_no,
        "vehical_no": addForm.vehical_no,
        "transport_date": addForm?.transport_date,
        'lr_no': addForm?.lr_no,
        'lr_date': addForm?.lr_date,
      }
      dispatch(AddOrderReturn(payload))
        .then((res) => {
          if (res.payload.success === true) {
            navigate('/main-store/user/purchase-return-management')
          }
        }).catch((error) => {
          console.log(error, 'ERROR');
        })
    } else {
      toast.error('Please add the item details')
    }
    // }
  }
  return (
    <div className={`main-wrapper ${false ? "slide-nav" : ""}`}>
      <Header handleOpen={() => { }} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/main-store/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/main-store/user/purchase-return-management">
                      Purchase Return
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {"Add"} Purchase Return
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <OrderForm
            title={'Purchase Return'}
            dropdown_name={'Receiver Name'}
            formData={formData}
            tag_number={12}
            isEdit={false}
            handleSubmit={handleSubmit}
          />
          {/* //purches items */}

          <ItemsTable
            headers={headers}
            data={data}
            onAddItem={handleAddItem}
            onDeleteItem={handleDelete}
            onEditItem={handleEdit} />

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate('/main-store/user/purchase-return-management')}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={modalOpen}
            backdrop="static"
            size="lg"
            keyboard={false}
            onHide={handleModalClose}
          // handleClose= {handleModalClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>Items Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12">
                            <div className="input-block local-forms">
                              <label>
                                Item Name
                                <span className="login-danger">*</span>
                              </label>
                              <Dropdown
                                value={ItemNo}
                                options={Itemsoption}
                                onChange={handleItemsChange}
                                placeholder="select Item"
                                filter
                                filterBy="label"
                                appendTo="self"
                                className="w-100 multi-prime-react model-prime-multi"
                              />
                              <div className='error'>{error.item_error}</div>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Unit
                              </label>
                              <input
                                className="form-control"
                                name="unit"
                                value={singleItem?.unit}
                                onChange={handleChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>M. Code</label>
                              <input
                                type='text'
                                className="form-control"
                                name="mcode"
                                value={singleItem?.mcode}
                                onChange={handleChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Quantity
                                <span className="login-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={calcItem.quantity}
                                onChange={handleChange}
                              />
                              <div className='error'>{error.quantity_err}</div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Rate <span className="login-danger">*</span>
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="rate"
                                value={calcItem.rate}
                                onChange={handleChange}
                              />
                              <div className='error'>{error.Rate_err}</div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-block local-forms">
                              <label>
                                Amount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="amount"
                                value={item.amount}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Discount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="discount"
                                value={calcItem.discount}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Discount Amount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="discount_amount"
                                value={item.discount_amount}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Sp. Discount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="sp_discount"
                                value={calcItem.sp_discount}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                SP. Discount Amount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="sp_discount_amount"
                                value={item.sp_discount_amount}

                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Taxable
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="taxable_amount"
                                value={item.taxable_amount}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                GST
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="gst"
                                value={singleItem.gst}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                GST Amount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="gst_amount"
                                value={item.gst_amount}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-block local-forms">
                              <label>
                                Total Amount
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                name="total_amount"
                                value={item.total_amount}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-block local-forms">
                              <label>
                                Remarks
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="remarks"
                                value={calcItem.remarks}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-12 text-end">
                          <div className="doctor-submit text-end">
                            <button
                              type="button"
                              className="btn btn-primary cancel-form"
                              onClick={handleModalClose}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary submit-form ms-2"
                              onClick={handleSave}
                            >
                              Save
                            </button>
                            {
                              editeMode ? '' : <button
                                type="button"
                                className="btn btn-primary submit-form ms-2"
                                onClick={handleAddMore}
                              >
                                Add More
                              </button>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>

  )
}

export default ManagePurchaseReturn