import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { V_URL } from "../../../../BaseUrl";


const ManageTerms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state; // edit data

  const [terms, setTerms] = useState({
    description: "",
    status: true
  });

  const [error, setError] = useState({});
  const [disable, setDisable] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data?._id) {
      setTerms({
        description: data.description,
        status: data.status
      });
      setIsEdit(true);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerms({ ...terms, [name]: value });
  };

  const handleStatusChange = () => {
    setTerms({ ...terms, status: !terms.status });
  };

  const validation = () => {
    let err = {};
    let valid = true;

    if (!terms.description.trim()) {
      err.description = "Please enter terms & conditions";
      valid = false;
    }

    setError(err);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validation()) return;

    setDisable(true);

    const payload = {
      description: terms.description,
      status: terms.status,
      firm_id: localStorage.getItem("PAY_USER_FIRM_ID"),
      project: localStorage.getItem("U_PROJECT_ID"),
      ...(data?._id && { id: data._id })
    };

    try {
      const res = await axios.post(
        `${V_URL}/user/terms-condition/manage-terms`,
        payload
      );

      if (res.data.success) {
        navigate("/material-po/terms-and-conditions");
      }
    } catch (err) {
      console.error("Terms save error:", err);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
         <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
              <li className="breadcrumb-item"><Link to="/material-po/terms-and-conditions">Terms and Condition</Link></li>
              <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
              <li className="breadcrumb-item active">
                {isEdit ? "Edit Terms and Condition" : "Manage Terms and Condition"}
              </li>
            </ul>
          </div>
          <div className="card">
            <div className="card-body">

              <h4>{data?._id ? "Edit" : "Add"} Terms & Conditions</h4>

              <div className="row">
                <div className="col-md-12 mt-3">
                  <label>
                    Terms & Conditions <span className="login-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="6"
                    name="description"
                    value={terms.description}
                    onChange={handleChange}
                  />
                  <div className="error">{error.description}</div>
                </div>

                {data?._id && (
                  <div className="col-md-4 mt-3">
                    <label>Status</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={terms.status}
                        onChange={handleStatusChange}
                      />
                    </div>
                  </div>
                )}

              </div>

              <div className="text-end mt-4">
                <button
                  className="btn btn-primary me-2"
                  onClick={handleSubmit}
                  disabled={disable}
                >
                  {disable ? "Processing..." : data?._id ? "Update" : "Submit"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/master/terms-list")}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
      </div>
    </div>
  );
};

export default ManageTerms;
