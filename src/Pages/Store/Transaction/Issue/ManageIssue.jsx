import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import OrderForm from './Comman-Components/OrderForm'
import ItemsTable from './Comman-Components/ItemsTable'
import ItemsModel from './Comman-Components/ItemsModel'
import { addIssue } from '../../../../Store/Store/MainStore/Issue/ManageIssue'
import { getAdminTransport } from '../../../../Store/Store/StoreMaster/Transport/AdminTransport'
import { getTransport } from '../../../../Store/Store/StoreMaster/Transport/Transport'

const ManageIssue = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState({});
  const [editeMode, setEditeMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formError, setFormError] = useState({})
  const [formData, setFormData] = useState({
    trans_date: null,
    party_id: null,
    customer_id: null,
    pass_id: null,
    bill_no: null,
    project_id: null,
    receive_date: null,
    issue_type: "Internal",
    reciever_name: null,
    transport_id: null,
    transport_date: null,
    vehical_no: null,
    lr_no: null,
    lr_date: null,
    address: null,
    driver_name: null,
    unit_location: null,
  })
  useEffect(() => {
    dispatch(getAdminTransport({ is_main: true }))
  }, [])
  const transport = useSelector((state) => state.getTransport?.user?.data || []);

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  };

  const validationForm = () => {
    const selectedTransport = transport?.find((item) => item?._id === formData?.transport_id);
    let isvalide = true;
    let err = {};

    if (!formData?.party_id) {
      isvalide = false
      err['party_id'] = "please select party name"
    }
    if (!formData?.bill_no) {
      isvalide = false
      err['bill_no'] = "please enter bill no"
    }
    if (!formData?.project_id) {
      isvalide = false
      err['project_id'] = "please select project name"
    }
    if (!formData?.trans_date) {
      isvalide = false
      err['trans_date'] = "please select transaction date"
    }


    if (formData?.issue_type === "External") {
      if (!formData?.transport_id) {
        isvalide = false
        err['transport_id'] = "please select transport name"
      }
      if (!formData?.address) {
        isvalide = false
        err['address'] = "please enter Address"
      }
      if (selectedTransport?.name === "Third Party" && !formData?.driver_name) {
        isvalide = false
        err['driver_name'] = "please Enter driver name"
      }
    }
    if (formData?.issue_type === "Internal") {
      if (!formData?.pass_id) {
        isvalide = false
        err['pass_id'] = "please select Pass No."
      }
    }
    if (!formData?.issue_type) {
      isvalide = false
      err['issue_type'] = "please select issue type"
    }
    setFormError(err);
    return isvalide;
  };

  const handleEdit = (index) => {
    setEditIndex(index)
    const itemToEdit = data[index]
    setEditeMode(true)
    setEditItem(itemToEdit);
    setModalOpen(true);
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
      setData((prevData) => [...prevData, item]);
      setEditeMode(false)
    }
    handleModalClose();
  };
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
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };
  const handleAddMore = (item) => {
    setData((prevData) => {
      return [...prevData, item];
    });
  };
  const handleAddItem = () => {
    setEditeMode(false)
    setModalOpen(true)
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  const handleSubmit = () => {
    if (validationForm()) {
      if (data?.length > 0) {
        let payload
        if (formData?.issue_type === "Internal") {
          payload = {
            "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
            "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
            "trans_date": formData.trans_date,
            "tag_number": 13,
            "bill_no": formData.bill_no,
            "party_id": formData.party_id,
            "customer_id":formData.customer_id,
            "project_id": formData.project_id,
            "receive_date": formData?.receive_date,
            "gate_pass_no": formData?.pass_id,
            "unit_location": formData?.unit_location,
            "isexternal": false,
            "items_details": data,
          }
        } else {
          payload = {
            "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
            "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
            "trans_date": formData.trans_date,
            "tag_number": 13,
            "bill_no": formData.bill_no,
            "party_id": formData.party_id,
            "customer_id":formData.customer_id,
            "project_id": formData.project_id,
            "receiver_name": formData.reciever_name,
            "transport_id": formData?.transport_id,
            "driver_name": formData?.driver_name === "" ? null : formData?.driver_name,
            "address": formData?.address === "" ? null : formData?.address,
            "receive_date": formData?.receive_date,
            "vehical_no": formData?.vehical_no,
            "transport_date": formData?.transport_date,
            "lr_date": formData?.lr_date,
            "lr_no": formData?.lr_no,
            "unit_location": formData?.unit_location,
            "isexternal": true,
            "items_details": data,
          };
        }
        dispatch(addIssue(payload))
          .then((res) => {
            if (res.payload.success === true) {
              navigate('/main-store/user/issue-purchase-management')
            }
          }).catch((error) => {
            console.log(error, 'ERROR');
          })
      } else {
        toast.error('Please add the item details')
      }
    } else {
      console.log(formError);

    }
  };

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
                    <Link to="/main-store/user/issue-purchase-management">
                      Issue
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {"Add"} Issue
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <OrderForm
            formData={formData}
            setFormData={setFormData}
            formError={formError}
            setFormError={setFormError}
            handleFormChange={handleFormChange}
            title={'Issue'}
            dropdown_name={'Receiver Name'}
            isEdit={false}
          />
          <ItemsTable
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
            modalOpen={modalOpen}
            editItem={editItem}
            editeMode={editeMode}
            handleSave={handleSave}
            handleAddMore={handleAddMore}
            handleModalClose={handleModalClose}
          />
        </div>
      </div>
    </div>
  )
}

export default ManageIssue