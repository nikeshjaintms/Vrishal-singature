import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import ApproveRequestItemTable from './ApproveRequestItemTable';
import { getSingleAdminItem } from '../../../Store/Store/PurchaseRequest/GetSingleAdminItem';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditRequestManage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [approvedItems, setApprovedItems] = useState([]);
  const getSingleAdminItemData = useSelector((state) => state.getSingleAdminItem?.user?.data);

  const fieldsToShow = {
    trans_date: "PR Date",
    prepare_by: "Request By",
    voucher_no: "PR No.",
    store_location: "Store Location",
    department: "Department",
    site_location: "Site Location",
  };
  useEffect(() => {
    dispatch(getSingleAdminItem({ id: data._id }));
  }, [data._id]);

  useEffect(() => {
    if (localStorage.getItem("VA_TOKEN") === null) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleUpdateApprovedData = (updatedApprovedData) => {
    setApprovedItems(updatedApprovedData);
  };

  const handleSubmit = async () => {
    const payload = {
      id: data._id,
      admin_email: localStorage.getItem('VA_EMAIL'),
      items_details: approvedItems,
    };
    try {
      const response = await axios.post(`${V_URL}/admin/approve-one-pr`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("VA_TOKEN")}`,
        },
      });
      if (response.data.success) {
        toast.success("Approval submitted successfully!");
        navigate("/admin/verify-purchase-request");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong");
    }
  };
  const handleBack = () => {
    if (data?.length === 0) {
      toast.error('Something went wrong')
    } else {
      navigate('/admin/verify-purchase-request')
    }
  }
  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/admin/verify-purchase-request">Admin Purchase Request</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Edit Admin Purchase Request</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row">
                      {Object.entries(fieldsToShow).map(([key, label]) => (
                        <div className="col-12 col-md-4 col-xl-4" key={key}>
                          <div className="input-block local-forms">
                            <label>{label}</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                key === "trans_date"
                                  ? new Date(data[key]).toISOString().split("T")[0] // Format the date
                                  : key === "prepare_by"
                                    ? data[key]?.name || "N/A" // Handle the nested `prepare_by.name`
                                    : data[key] || "N/A" // Default for other fields
                              }
                              readOnly
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </form>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="col-12 text-end">
                            <div className="doctor-submit text-end">
                              <button type="button" className="btn btn-primary" onClick={handleBack}>Back</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ApproveRequestItemTable
                    dataStore={getSingleAdminItemData?.items_details || []}
                    onUpdateData={handleUpdateApprovedData}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRequestManage;
