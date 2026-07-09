import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { V_URL } from '../../../BaseUrl';

import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';

import { getDepartment } from '../../../Store/Admin/Payroll/Department/Department';
import { adminGetParty } from '../../../Store/Admin/Party/GetParty';
import { getYear } from '../../../Store/Admin/Payroll/Year/Year';
import { getFirm } from '../../../Store/Admin/Firm/Firm';
import { getAuthPerson } from '../../../Store/Admin/Payroll/AuthPerson/AuthPerson';
import { getAdminErpRole } from '../../../Store/Admin/ErpRole/AdminErpRole';
import { getAdminProjectLocation } from '../../../Store/Admin/PMS/GetProjectLocation';

import { MultiSelect } from 'primereact/multiselect';

const ManageProjectType = () => {

  const [projecttype, setProjectType] = useState({
    projectTypeName: "",
    roles: [],
  });

  const [disable, setDisable] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [error, setError] = useState({});
  const data = location.state;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectValue, setSelectValue] = useState(false);

  useEffect(() => {
  if (!data) return;

  const normalizedRoles = (data.roles || []).map(r => r._id || r.value);

  setProjectType({
    projectTypeName: data.projectTypeName || "",
    roles: normalizedRoles,
  });

  setSelectValue(!!data.status);
}, [data]);




  useEffect(() => {
    const safeDispatch = async (action) => {
      try { await dispatch(action()); } catch (error) { console.error(error); }
    };

    safeDispatch(adminGetParty);
    safeDispatch(getDepartment);
    safeDispatch(getAuthPerson);
    safeDispatch(getYear);
    safeDispatch(getFirm);

    dispatch(getAdminProjectLocation({ status: true }));
    dispatch(getAdminErpRole({ status: true }));

  }, [dispatch]);

  const RoleData = useSelector(
    (state) => state?.getAdminErpRole?.user?.data || []
  );

  const RoleOptions = RoleData.map((role) => ({
    label: role?.name,
    value: role?._id,
  }));


  const handleChange = (e) => {
    setProjectType({ ...projecttype, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setProjectType((prev) => ({
      ...prev,
      roles: e.value,
    }));
  };

  const handleRadioChange = (e) => {
    setSelectValue(e.target.checked);
  };


  const validation = () => {
    let isValid = true;
    let err = {};

    if (!projecttype.projectTypeName.trim()) {
      isValid = false;
      err.projectType_err = "Please enter project type";
    }

    if (!projecttype.roles.length) {
      isValid = false;
      err.roles_err = "Please select at least one role";
    }

    setError(err);
    return isValid;
  };


  const handleSubmit = () => {
  if (!validation()) return;

  setDisable(true);

  const bodyFormData = new URLSearchParams();

  // MUST MATCH BACKEND FIELD
  bodyFormData.append("projectTypeName", projecttype.projectTypeName);

  projecttype.roles.forEach((r) => {
    bodyFormData.append("roles[]", r);
  });

  if (data?._id) {
    bodyFormData.append("id", data._id);
    bodyFormData.append("status", selectValue);
  }

  axios({
    method: "post",
    url: `${V_URL}/admin/manage-project-type`,
    data: bodyFormData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer" + localStorage.getItem("VA_TOKEN"),
    },
  })
    .then((res) => {
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/project-type-management");
        handleReset();
      }
      setDisable(false);
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message);
      setDisable(false);
    });
};



  const handleReset = () => {
    setProjectType({
      projectTypeName: "",
      roles: [],
    });
    setSelectValue(false);
    setError({});
  };


  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                    <Link to="/admin/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item">
                    <Link to="/admin/project-management">Project</Link>
                  </li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Project
                  </li>
                </ul>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? "Edit" : "Add"} Project Details</h4>
                      </div>
                    </div>

                    <div className="row">

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>Project Type <span className="login-danger">*</span></label>
                          <input
                            className="form-control"
                            type="text"
                            value={projecttype.projectTypeName}
                            name="projectTypeName"
                            onChange={handleChange}
                          />
                          <div className="error">{error.projectTypeName_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Role <span className="login-danger">*</span></label>
                          <MultiSelect
                            value={projecttype.roles}
                            onChange={handleRoleChange}
                            options={RoleOptions}
                            placeholder="Select Roles"
                            className="w-100 multi-prime-react"
                          />
                          <div className="error">{error.roles_err}</div>
                        </div>
                      </div>

                    </div>
                  </form>

                  {data?._id && (
                    <div className="col-12 col-md-4 col-xl-4">
                      <div className="cardNum">
                        <label className="form-label">Status</label>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectValue}
                            onChange={handleRadioChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <div className="doctor-submit text-end">
                      <button
                        type="button"
                        className="btn btn-primary submit-form me-2"
                        disabled={disable}
                        onClick={handleSubmit}
                      >
                        {disable ? "Processing..." : data?._id ? "Update" : "Submit"}
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

                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManageProjectType;
