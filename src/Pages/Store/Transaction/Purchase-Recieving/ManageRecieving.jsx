import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useRef } from 'react';
import OrderForm from './Comman-Components/OrderForm'
import ItemsModel from './Comman-Components/ItemsModel'
import ItemsTable from './Comman-Components/ItemsTable'
import { useDispatch, useSelector } from 'react-redux'
import { addPu } from '../../../../Store/Store/MainStore/PurchaseRecieving/ManagePu'
import ManualItemModel from './Comman-Components/ManualItemModel'
import { getAdminTransport } from '../../../../Store/Store/StoreMaster/Transport/AdminTransport'

const ManageRecieving = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dropdownRef = useRef(null);
  const [data, setData] = useState([]);
  const [editeMode, setEditeMode] = useState(false);
  const [mode, setMode] = useState("Automatic");
  const [editItems, setEditItems] = useState({});
  const headers = {
    'Name': 'item_name',
    'Unit': 'unit',
    'M.code': 'mcode',
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
  useEffect(() => {
    dispatch(getAdminTransport({ is_main: true }))
  }, [])
  const transport = useSelector((state) => state.getAdminTransport?.user?.data || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [ManualModalOpen, setManualModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formError, setFormError] = useState({})
  const [removeItem, setRemoveItem] = useState({})
  const [formData, setFormData] = useState({
    trans_date: '',
    bill_no: null,
    po_no: "",
    party_id: '',
    customer_id: '',
    project_id: '',
    master_id: '',
    upload_pdf: '',
    transport_id: '',
    driver_name: '',
    vehical_no: '',
    challan_no: null,
    transport_date: '',
    receive_date: '',
    lr_no: '',
    lr_date: '',
    payment_date: '',
    payment_days: 0,
    getpass: ""
  });
  useEffect(() => {
    if (modalOpen && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [modalOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const formValidation = () => {
    const selectedTransport = transport?.find((item) => item?._id === formData?.transport_id);
    let isvalide = true
    let err = {}

    if (!formData?.party_id) {
      isvalide = false
      err['party_id'] = "please select party name"
    }
      if (!formData?.customer_id) {
      isvalide = false
      err['customer_id'] = "please select customer name"
    }
    if (!formData?.project_id) {
      isvalide = false
      err['project_id'] = "please select project name"
    }
    if (!formData?.trans_date) {
      isvalide = false
      err['trans_date'] = "please select transaction date"
    }
    // if (!formData?.bill_no) {
    //   isvalide = false
    //   err['bill_no'] = "please select bill number"
    // }
    if (!formData?.master_id) {
      isvalide = false
      err['master_id'] = "please select master name"
    }
    if (!formData?.transport_id) {
      isvalide = false
      err['transport_id'] = "please select transport name"
    }
    if (selectedTransport?.name === "Third Party" && !formData?.driver_name) {
      isvalide = false
      err['driver_name'] = "please Enter driver name"
    }
    if (!formData?.upload_pdf) {
      isvalide = false
      err['upload_pdf'] = "please upload pdf"
    }
    // if (!formData?.challan_no) {
    //   isvalide = false
    //   err['challan_no'] = "please enter challan number"
    // }
    if (!formData?.bill_no && !formData?.challan_no) {
      isvalide = false;
      toast.error("Either Bill number or Challan number is required");
      // err["bill_or_challan"] = "Please provide either bill number or challan number";
    }
    setFormError(err)
    return isvalide
  }

  const handleEdit = (index) => {
    setEditIndex(index)
    const itemToEdit = data[index]
    setEditItems(itemToEdit);
    setEditeMode(true)
    setManualModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false)
  };
  const handleManualModalClose = () => {
    setManualModalOpen(false)
  };

  const handleAddMore = (item) => {
    setData((prevData) => {
      return [...prevData, item];
    });
  };

  const handleSave = (item) => {
    if (editeMode && editIndex !== null) {
      setData((prevData) => {
        const updatedData = [...prevData];
        updatedData[editIndex] = item;
        return updatedData;
      });
      setEditeMode(false);
      setEditIndex(null);
    } else {
      if (ManualModalOpen) {
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
          setEditeMode(false)
        }
        // handleModalClose();
      } else {
        setData((prevItems) => {
          const combinedItems = prevItems.map((existingItem) => {
            const updatedItem = item.find(
              (newItem) => newItem.detail_id === existingItem.detail_id
            );
            return updatedItem ? updatedItem : existingItem;
          });
          item.forEach((newItem) => {
            const exists = combinedItems.some(
              (existingItem) => existingItem.detail_id === newItem.detail_id
            );
            if (!exists) {
              combinedItems.push(newItem);
            }
          });
          return combinedItems;
        });
      }
      setEditeMode(false)
    }
    if (ManualModalOpen) {
      // handleManualModalClose(false)
    } else {
      setModalOpen(false)
    }
  };
  const handleDelete = (index, item_name, item) => {
    Swal.fire({
      title: `Are you sure you want to delete ${item_name}?`,
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
        setRemoveItem(item)
      }
    });
  };

  const handleAddItem = () => {
    setEditeMode(false)
    setEditItems(null);
    if (mode === "Automatic") {
      if (!formData?.party_id || !formData?.project_id) {
        toast.error("please select party and project to add items")
      } else {
        setModalOpen(true)
      }
    } else {
      setManualModalOpen(true)
    }
  }
  const handleSubmit = () => {
    const Po_Number = data.map((item) => item.po_no)
    if (formValidation()) {
      if (data?.length > 0) {
        const payload = {
          "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
          "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
          "trans_date": formData?.trans_date === "" ? null : formData?.trans_date,
          "bill_no": formData?.bill_no === "" ? null : formData?.bill_no,
          "party_id": formData?.party_id,
          "customer_id": formData?.customer_id,
          "project_id": formData?.project_id,
          "master_id": formData?.master_id,
          "pdf": formData?.upload_pdf,
          "transport_id": formData?.transport_id,
          "vehical_no": formData?.vehical_no === "" ? null : formData?.vehical_no,
          "po_no": Po_Number,
          "challan_no": formData?.challan_no === "" ? null : formData?.challan_no,
          "transport_date": formData?.transport_date === "" ? null : formData?.transport_date,
          "receive_date": formData?.receive_date === "" ? null : formData?.receive_date,
          "lr_no": formData?.lr_no === "" ? null : formData?.lr_no,
          "lr_date": formData?.lr_date === "" ? null : formData?.lr_date,
          "payment_date": formData?.payment_date === "" ? null : formData?.payment_date,
          "payment_days": formData?.payment_days || 0,
          "tag_number": 11,
          "driver_name": formData?.driver_name === "" ? null : formData?.driver_name,
          "items_details": data,
          "is_auto": mode === "Automatic" ? true : false
        }
        dispatch(addPu(payload))
          .then((res) => {
            if (res.payload.success === true) {
              navigate('/main-store/user/recieving-management')
            }
          }).catch((error) => {
            console.log(error, 'ERROR');
          })
      } else {
        toast.error('Please add the item details')
      }
    }
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
                    <Link to="/main-store/user/recieving-management">
                      Purchase Recieving
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {"Add"} Purchase Recieving
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <OrderForm
            mode={mode}
            setMode={setMode}
            title={'Purchase Recieving'}
            dropdown_name={'Receiver Name'}
            formData={formData}
            setFormData={setFormData}
            handleFormChange={handleFormChange}
            formError={formError}
            setFormError={setFormError}
            tag_number={11}
          />
          <ItemsTable
            headers={headers}
            data={data}
            onAddItem={handleAddItem}
            onDeleteItem={handleDelete}
            onEditItem={handleEdit}
          />
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ItemsModel
            handleSave={handleSave}
            formData={formData}
            modalOpen={modalOpen}
            handleModalClose={handleModalClose}
            editeMode={editeMode}
            editItems={editItems}
            removeItem={removeItem}
          />
          <ManualItemModel
            handleAddMore={handleAddMore}
            handleSave={handleSave}
            formData={formData}
            show={ManualModalOpen}
            handleClose={handleManualModalClose}
            editeMode={editeMode}
            EditItem={editItems}
            removeItem={removeItem}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageRecieving