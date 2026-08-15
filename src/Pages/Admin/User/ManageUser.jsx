import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import { V_URL } from "../../../BaseUrl";
import Footer from "../Include/Footer";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Select from "react-dropdown-select";
import Collapse from "react-bootstrap/Collapse";
import { useDispatch, useSelector } from "react-redux";
import { getErpRole } from "../../../Store/Admin/ErpRole/ErpRole";
import { getProduct } from "../../../Store/Admin/Product/Product";
import { MultiSelect } from "primereact/multiselect";
import SignatureCanvas from "react-signature-canvas";


const ManageUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);

  const data = location.state;

  const [user, setUser] = useState({
    user_name: "",
    email: "",
    password: "",
    year: "",
    type:"",
    pwdShow: true,
  });

  const [erpRole, setErpRole] = useState("");
  const [year, setYear] = useState([]);
  const [firm, setFirm] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectValue, setSelectValue] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [userRole, setUserRole] = useState({ id: "", name: "" });

  const [selectedErpOptions, setSelectedErpOptions] = useState([]);
  const [selectedProductOptions, setSelectedProductOptions] = useState([]);
  const [selectedStructureRoles, setSelectedStructureRoles] = useState([]);
  const [selectedPipingRoles, setSelectedPipingRoles] = useState([]);
  const [selectedProcurementRoles, setSelectedProcurementRoles] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const [pay_subUser, setPay_subUser] = useState(false);
  const [pay_bankDetail, setPay_bankDetail] = useState(false);
  
  const [signaturePad, setSignaturePad] = useState(null);
  const [signatureData, setSignatureData] = useState("");


  const erpRoleData = useSelector((state) => state?.getErpRole?.user?.data);
  const ProductData = useSelector((state) => state?.getProduct?.user?.data);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      getFirm();
      getYear();
      getProject();
      dispatch(getProduct());
      dispatch(getErpRole());
    }
  }, []);

 

  useEffect(() => {
      if (!data) return;
      if (!ProductData?.length && !erpRoleData?.length) return;

      // -------- USER BASIC FIELDS ----------
      setUser({
        user_name: data?.user_name || "",
        email: data?.email || "",
        year: data?.year?._id || "",
        password: "",
        type: data?.type || "",
        pwdShow: true,
      });

      setIsClient(data?.type === "Client");


        if (data?.signature) {
          setSignatureData(data.signature);   // preload signature when editing
        }

    setSelectValue(data?.status || false);
    setSelectedFirm(data?.firm?.map((e) => ({ id: e._id })) || []);
    setSelectedYear(data?.year?.map((e) => ({ id: e._id })) || []);
    setSelectedProject(data?.project?.map((e) => ({ id: e._id })) || []);

    setPay_subUser(data?.pay_subUser || false);
    setPay_bankDetail(data?.pay_bankDetail || false);

    // -------- PRODUCT PREFILL ----------
    if (data.product?.length && productOptions?.length) {
      setSelectedProductOptions(data.product?.map((p) => p._id) || []);
    }

    // helper function for roles
    const mapToOptions = (idsArray, options) =>
      options.filter((o) => idsArray.includes(o.value));

    // -------- ERP ROLE ----------
    if (data.erpRole?.length && roleOptions?.length) {
      const ids = data.erpRole.map((r) => r?._id || r);
      setSelectedErpOptions(mapToOptions(ids, roleOptions));
    }

    // -------- STRUCTURE ROLE ----------
    if (data.structureRole?.length && roleOptions?.length) {
      // const ids = data.structureRole.map((r) => r?._id || r);
      // setSelectedStructureRoles(mapToOptions(ids, roleOptions));
      setSelectedStructureRoles(data.structureRole?.map((r) => r?._id)|| []);
    }

    // -------- PIPING ROLE ----------
    if (data.pipingRole?.length && roleOptions?.length) {
      // const ids = data.pipingRole.map((r) => r?._id || r);
      // setSelectedPipingRoles(mapToOptions(ids, roleOptions));
      setSelectedPipingRoles(data.pipingRole?.map((r) => r?._id)|| []);
    }

    if(data.procurementRole?.length && roleOptions?.length){
      setSelectedProcurementRoles(data.procurementRole?.map((r) => r?._id)|| []);
    }

}, [data, ProductData, erpRoleData]);

  const getYear = () => {
    axios
      .get(`${V_URL}/admin/get-year`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      })
      .then((res) => res?.data?.success && setYear(res.data.data))
      .catch(() => toast.error("Something went wrong"));
  };

  const getFirm = () => {
    axios
      .get(`${V_URL}/admin/get-firm`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      })
      .then((res) => res?.data?.success && setFirm(res.data.data))
      .catch(() => toast.error("Something went wrong"));
  };

  const getProject = () => {
    axios
      .get(`${V_URL}/admin/get-project`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      })
      .then((res) => res?.data?.success && setProjectData(res.data.data))
      .catch(() => toast.error("Something went wrong"));
  };

 const handleChange = (e) => {
  const { name, value } = e.target;

  setUser((prev) => ({
    ...prev,
    [name]: value,
  }));

  // Update isClient when user type changes
  if (name === "type") {
    setIsClient(value === "Client");
  }
};
  const handleRadioChange = (e) => setSelectValue(e.target.checked);
  const handleSubUserChange = (e) => setPay_subUser(e.target.checked);
  const handleSubBankChange = (e) => setPay_bankDetail(e.target.checked);
  const handleErpSelect = (e) =>
    setSelectedErpOptions(Array.isArray(e.value) ? e.value : []);
  const handleProductSelect = (e) => {
    setSelectedProductOptions(e.value); 
  };


  const handleCheckboxChange = (event, elem, stateSetter) => {
    const isChecked = event.target.checked;
    stateSetter((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      return isChecked
        ? [...arr, { id: elem._id }]
        : arr.filter((item) => item.id !== elem._id);
    });
  };

  const validation = () => {
    let isValid = true;
    let err = {};

    if (!user.user_name?.trim()) {
      isValid = false;
      err.user_name_err = "Please enter user name";
    }

    if (!user.email) {
      isValid = false;
      err.email_err = "Please enter email";
    } else {
      const atPos = user.email.lastIndexOf("@");
      const dotPos = user.email.lastIndexOf(".");
      if (!(atPos < dotPos && atPos > 0 && dotPos > 2 && user.email.length - dotPos > 2)) {
        isValid = false;
        err.email_err = "Email is not valid";
      }
    }

    if (!data?._id && !user.password) {
      isValid = false;
      err.password_err = "Please enter password";
    } else if (
      !data?._id &&
      !/(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}/.test(user.password)
    ) {
      isValid = false;
      err.password_err =
        "Password must contain one uppercase, one special char, min 8 chars";
    }

    if (!selectedProductOptions?.length) {
      isValid = false;
      err.product_err = "Please select a product";
    }

    setError(err);
    return isValid;
  };


  const handleSubmit = () => {
    if (!validation()) return;

    setDisable(true);

    // console.log("===== HANDLE SUBMIT START =====");

    // --- Always send CLEAN ID arrays (supports both objects and plain IDs) ---
    const normalizeId = (item) => {
      // Direct primitive ID
      if (typeof item === "string" || typeof item === "number") return item;

      // Item has a nested `value`
      if (item?.value) {
        if (typeof item.value === "string" || typeof item.value === "number") {
          return item.value;
        }
        if (typeof item.value === "object") {
          return item.value._id || item.value.id || null;
        }
      }

      // Fallback to direct _id / id on the object
      return item?._id || item?.id || null;
    };

    const productArray = (selectedProductOptions || [])
      .map(normalizeId)
      .filter(Boolean);

    const yearArray = (selectedYear || [])
      .map(normalizeId)
      .filter(Boolean);

    const firmArray = (selectedFirm || [])
      .map(normalizeId)
      .filter(Boolean);

    const projectArray = (selectedProject || [])
      .map(normalizeId)
      .filter(Boolean);

    const erpRoleArray = (selectedErpOptions || [])
      .map(normalizeId)
      .filter(Boolean);

    const structureRoleArray = (selectedStructureRoles || [])
      .map(normalizeId)
      .filter(Boolean);

    const pipingRoleArray = (selectedPipingRoles || [])
      .map(normalizeId)
      .filter(Boolean);

    const procurementRoleArray = (selectedProcurementRoles || [])
      .map(normalizeId)
      .filter(Boolean);

    // console.log("🧪 CLEAN ARRAYS BEFORE SENDING");
    // console.log("Product:", productArray);
    // console.log("Year:", yearArray);
    // console.log("Firm:", firmArray);
    // console.log("Project:", projectArray);
    // console.log("Erp Roles:", erpRoleArray);
    // console.log("Structure Roles:", structureRoleArray);
    // console.log("Piping Roles:", pipingRoleArray);

    const bodyFormData = new URLSearchParams();

    bodyFormData.append("user_name", user.user_name);
    bodyFormData.append("email", user.email);

    if (user.password) {
      bodyFormData.append("password", user.password);
    }

    if (signatureData) {
      bodyFormData.append("signature", signatureData);
    }

    bodyFormData.append("year", JSON.stringify(yearArray));
    bodyFormData.append("firm", JSON.stringify(firmArray));
    bodyFormData.append("project", JSON.stringify(projectArray));
    bodyFormData.append("product", JSON.stringify(productArray));
    bodyFormData.append("erpRole", JSON.stringify(erpRoleArray));
    bodyFormData.append("structureRole", JSON.stringify(structureRoleArray));
    bodyFormData.append("pipingRole", JSON.stringify(pipingRoleArray));
    bodyFormData.append("procurementRole", JSON.stringify(procurementRoleArray));
    
    bodyFormData.append("type", user.type);
    bodyFormData.append("pay_subUser", pay_subUser ? "true" : "false");
    bodyFormData.append("pay_bankDetail", pay_bankDetail ? "true" : "false");

    if (data?._id) {
      bodyFormData.append("id", data._id);
      bodyFormData.append("status", selectValue);
    }

    // ---- LOG FINAL BODY SENT TO BACKEND ----
    // console.log("===== FINAL REQUEST BODY SENT TO BACKEND =====");
    for (const pair of bodyFormData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }
    // console.log("==============================================");

    axios
      .post(`${V_URL}/admin/manage-user`, bodyFormData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
        },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/admin/user-management");
        } else {
          toast.error(res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        // console.log("❌ AXIOS ERROR:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
      })
      .finally(() => setDisable(false));
  };


  // console.log("Selected Products →", selectedProductOptions);

  const handleReset = () => {
    setUser({
      user_name: "",
      email: "",
      password: "",
      year: "",
      pwdShow: true,
    });
    setSelectedFirm([]);
    setSelectedYear([]);
    setSelectedProject([]);
    setSelectedProductOptions([]);
    setSelectedErpOptions([]);
    setSelectedStructureRoles([]);
    setSelectedProcurementRoles([]);
    setSelectedPipingRoles([]);
    setPay_subUser(false);
    setPay_bankDetail(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);




  const roleOptions = (erpRoleData || []).map((it) => ({
    label: it.name,
    value: it._id,
  }));

  const productOptions = (ProductData || []).map((item) => ({
    value: item._id,
    label: item.name,
  }));

    const filteredProductOptions = productOptions.filter((p) => {
    if (user.type === "Client") {
      return [
        "Structural Fabrication",
        "Piping Fabrication",
      ].includes(p.label);
    }
    return true;
  });


  const selectedProductNames = (selectedProductOptions || [])
    .map((p) => {
      // Prefer explicit label if it's not the placeholder "Unknown"
      if (p?.label && p.label !== "Unknown") return p.label;

      // If value is a nested product object { _id, name }
      if (p?.value && typeof p.value === "object") return p.value.name;

      // If value is just an ID string, resolve it from ProductData
      if (p?.value && typeof p.value === "string") {
        const match = ProductData?.find((d) => d._id === p.value);
        return match?.name;
      }

      // If option is directly an ID
      if (typeof p === "string") {
        const match = ProductData?.find((d) => d._id === p);
        return match?.name;
      }

      return null;
    })
    .filter(Boolean);


  const hasPayroll = selectedProductNames.includes("Payroll System");
  const hasStructure = selectedProductNames.includes("Structural Fabrication");
  const hasPiping = selectedProductNames.includes("Piping Fabrication");
  const hasMainStore = selectedProductNames.includes("Main Store");
  const hasProcurement = selectedProductNames.includes("Piping Procurement") || selectedProductNames.includes("Structural Procurement");
  const showFirmYear = hasPayroll || hasMainStore;

  const showProject = ["Structural Fabrication", "Project Store", "Piping Procurement", "Structural Procurement", "Piping Fabrication"]
  .some(item => selectedProductNames.includes(item));


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
                    <Link to="/admin/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/admin/user-management">User List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} User
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
                        <h4>{data?._id ? "Edit" : "Add"} User Details</h4>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Name <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            onChange={handleChange}
                            value={user.user_name}
                            name="user_name"
                          />
                          <div className="error">{error.user_name_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Email <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            onChange={handleChange}
                            value={user.email}
                            name="email"
                          />
                          <div className="error">{error.email_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            Password <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type={user.pwdShow ? "password" : "text"}
                            onChange={handleChange}
                            value={user.password}
                            name="password"
                          />
                          {user.pwdShow ? (
                            <div
                              className="passwordHide"
                              onClick={() => {
                                setUser({ ...user, pwdShow: false });
                              }}
                            >
                              <i className="fa-solid fa-eye" />
                            </div>
                          ) : (
                            <div
                              className="passwordHide"
                              onClick={() =>
                                setUser({ ...user, pwdShow: true })
                              }
                            >
                              <i className="fa-solid fa-eye-slash" />{" "}
                            </div>
                          )}
                          <div className="error">{error.password_err}</div>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>
                            User Type <span className="login-danger">*</span>
                          </label>

                          <select
                            className="form-control"
                            name="type"
                            value={user.type}
                            onChange={handleChange}
                          >
                            <option value="">Select Type</option>
                            <option value="User">User</option>
                            <option value="Client">Client</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="input-block local-forms">
                          <label>
                            Product <span className="login-danger">*</span>
                          </label>

                        <MultiSelect
                          value={selectedProductOptions}
                          onChange={(e) => setSelectedProductOptions(e.value)}
                          options={filteredProductOptions}
                          optionLabel="label"
                          dataKey="value"
                          placeholder="Select Product"
                          className="w-100 multi-prime-react"
                        />


                          <div className="error">{error.product_err}</div>
                        </div>
                      </div>


                      {hasPayroll && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="row">
                            <div className="col-6">
                              <label>Payroll Sub User</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  onChange={handleSubUserChange}
                                  checked={pay_subUser}
                                />
                              </div>
                            </div>

                            <div className="col-6">
                              <label>Show Bank Details</label>
                              <div className="form-check form-switch">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  onChange={handleSubBankChange}
                                  checked={pay_bankDetail}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {hasStructure && !isClient && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>
                              Structure Fabrication Role <span className="login-danger">*</span>
                            </label>

                            <MultiSelect
                              value={selectedStructureRoles}
                              onChange={(e) => {
                                setSelectedStructureRoles(e.value);
                              }}
                              options={(roleOptions || []).filter(
                                (r) => !["Procurement", "Central Planning"].includes(r.label)
                              )}
                              optionLabel="label"
                              dataKey="value"
                              placeholder="Select Role"
                              className="w-100 multi-prime-react"
                            />

                            {/* LOG structure roles */}
                            {/* <pre style={{ fontSize: "10px", color: "green" }}>
                              StructureRoles: {JSON.stringify(selectedStructureRoles, null, 2)}
                            </pre> */}
                          </div>
                        </div>
                      )}

                      {hasPiping && !isClient && (
                        <div className="col-12 col-md-4">
                          <div className="input-block local-forms">
                            <label>Piping Fabrication Role</label>

                            <MultiSelect
                              value={selectedPipingRoles}
                              onChange={(e) => {
                                setSelectedPipingRoles(e.value);
                              }}
                              options={(roleOptions || []).filter(
                                (r) => !["Procurement", "Central Planning"].includes(r.label)
                              )}
                              optionLabel="label"
                              dataKey="value"
                              placeholder="Select Role"
                              className="w-100 multi-prime-react"
                            />

                            {/* LOG piping roles */}
                            {/* <pre style={{ fontSize: "10px", color: "purple" }}>
                              PipingRoles: {JSON.stringify(selectedPipingRoles, null, 2)}
                            </pre> */}
                          </div>
                        </div>
                      )}

                       {hasProcurement && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>
                              Procurement Role <span className="login-danger">*</span>
                            </label>

                            <MultiSelect
                              value={selectedProcurementRoles}
                              onChange={(e) => {
                                setSelectedProcurementRoles(e.value);
                              }}
                              options={(roleOptions || []).filter(
                                (r) => r.label === "Procurement" || r.label === "Central Planning"
                              )}
                              optionLabel="label"
                              dataKey="value"
                              placeholder="Select Role"
                              className="w-100 multi-prime-react"
                            />
                          </div>
                        </div>
                      )}


                      {data?._id && (
                        <div className="col-12 col-md-4 col-xl-4">
                          <label>Status</label>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={selectValue}
                              onChange={handleRadioChange}
                            />
                          </div>
                        </div>
                      )}

                      <div className="col-12 col-md-6 col-xl-6 mt-3">
                        <div className="input-block local-forms">
                          <label>Digital Signature</label>

                          {/* Signature Canvas */}
                          <div
                            style={{
                              border: "2px solid #ccc",
                              borderRadius: "8px",
                              width: "100%",
                              height: "200px",
                              background: "#fff",
                            }}
                          >
                           <SignatureCanvas
                              penColor="black"
                              ref={(ref) => setSignaturePad(ref)}
                              canvasProps={{
                                width: 600,
                                height: 200,
                                className: "sigCanvas",
                              }}
                              onEnd={() => {
                                if (!signaturePad) return;
                                const image = signaturePad.getCanvas().toDataURL("image/png");
                                setSignatureData(image);
                              }}
                            />
                          </div>

                          
                          {/* Upload Signature Image */}
                          <div className="mt-2">
                              <label className="form-label mt-2">Or Upload Signature</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  // Convert image to Base64
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setSignatureData(reader.result);
                                    if (signaturePad) signaturePad.clear(); // clear canvas if image uploaded
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                            </div>

                          {/* Controls */}
                          <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger me-2"
                            onClick={() => {
                              if (signaturePad) signaturePad.clear();
                              setSignatureData("");
                            }}
                          >
                            Clear
                          </button>
                          </div>

                          {/* Preview */}
                          {signatureData && (
                            <div className="mt-3">
                              <label>Preview:</label>
                              <img
                                src={signatureData}
                                alt="Signature Preview"
                                style={{
                                  width: "200px",
                                  height: "60px",
                                  border: "1px solid #ddd",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>


                      <div className="row">
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="doctor-submit">
                            {showFirmYear && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-primary w-25"
                                    onClick={() => setOpen(!open)}
                                  >
                                    Firm
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-primary mx-2 w-25"
                                    onClick={() => setOpen2(!open2)}
                                  >
                                    Year
                                  </button>
                                </>
                              )}

                              {showProject && (
                                <button
                                  type="button"
                                  className="btn btn-primary mx-2 w-25"
                                  onClick={() => setOpen3(!open3)}
                                >
                                  Project
                                </button>
                              )}
                          </div>
                        </div>
                      </div>

                      <div id="example-collapse-text">
                                  <div className="row">
                                    <Collapse in={open}>
                                      <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card card-table show-entire">
                                          <div className="card-body">
                                            <div className="page-table-header mb-2">
                                              <div className="row align-items-center">
                                                <div className="col">
                                                  <div className="doctor-table-blk">
                                                    <h3>
                                                      Firm List
                                                      {selectedFirm?.length > 0 ? (
                                                        <span className="custom-badge status-orange mx-2 adminUser">
                                                          {selectedFirm?.length}
                                                        </span>
                                                      ) : null}
                                                    </h3>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                      
                                            <div className="table-responsive">
                                              <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                  <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {firm?.map((elem, i) => (
                                                    <tr key={elem?._id}>
                                                      <td>
                                                        <div className="d-flex firm-check gap-2 align-items-center">
                                                          <div className="form-check">
                                                            <input
                                                              className="form-check-input"
                                                              type="checkbox"
                                                              onChange={(event) =>
                                                                handleCheckboxChange(event, elem, setSelectedFirm)
                                                              }
                                                              checked={selectedFirm?.some((item) => item.id === elem?._id)}
                                                            />
                      
                                                          </div>
                                                          <div>{elem?.name}</div>
                                                        </div>
                                                      </td>
                                                      <td>{elem?.email}</td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                              <div className="error mx-2">{error.firm_err}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Collapse>
                                    <Collapse in={open2}>
                                      <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card card-table show-entire">
                                          <div className="card-body">
                                            <div className="page-table-header mb-2">
                                              <div className="row align-items-center">
                                                <div className="col">
                                                  <div className="doctor-table-blk">
                                                    <h3>
                                                      Year List
                                                      {selectedYear?.length > 0 ? (
                                                        <span className="custom-badge status-orange mx-2 adminUser">
                                                          {selectedYear?.length}
                                                        </span>
                                                      ) : null}
                                                    </h3>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                      
                                            <div className="table-responsive">
                                              <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                  <tr>
                                                    <th>Year</th>
                                                    <th>Start Year</th>
                                                    <th>End Year</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {year?.map((elem, i) => (
                                                    <tr key={elem?._id}>
                                                      <td>
                                                        <div className="d-flex firm-check gap-2 align-items-center">
                                                          <div className="form-check">
                                                            <input
                                                              type="checkbox"
                                                              checked={selectedYear.some((y) => y.id === elem._id)}
                                                              onChange={(event) => handleCheckboxChange(event, elem, setSelectedYear)}
                                                            />
                      
                                                          </div>
                                                          <div>
                                                            {`${moment(elem?.start_year).format(
                                                              "YYYY"
                                                            )}-${moment(elem?.end_year).format(
                                                              "YYYY"
                                                            )}`}
                                                          </div>
                                                        </div>
                                                      </td>
                                                      <td>
                                                        {moment(elem?.start_year).format(
                                                          "YYYY-MM-DD"
                                                        )}
                                                      </td>
                                                      <td>
                                                        {moment(elem?.end_year).format("YYYY-MM-DD")}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                              <div className="error mx-2">{error.year_err}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Collapse>
                                    <Collapse in={open3}>
                                      <div className="col-sm-12 col-md-6 col-lg-6">
                                        <div className="card card-table show-entire">
                                          <div className="card-body">
                                            <div className="page-table-header mb-2">
                                              <div className="row align-items-center">
                                                <div className="col">
                                                  <div className="doctor-table-blk">
                                                    <h3>
                                                      Project List
                                                      {selectedProject?.length > 0 ? (
                                                        <span className="custom-badge status-orange mx-2 adminUser">
                                                          {selectedProject?.length}
                                                        </span>
                                                      ) : null}
                                                    </h3>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                      
                                            <div className="table-responsive">
                                              <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                  <tr>
                                                    <th>Name</th>
                                                    <th>Time Estimation</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {projectData?.map((elem, i) => (
                                                    <tr key={elem?._id}>
                                                      <td>
                                                        <div className="d-flex firm-check gap-2 align-items-center">
                                                          <div className="form-check">
                                                            <input
                                                            type="checkbox"
                                                            onChange={(event) =>
                                                              handleCheckboxChange(event, elem, setSelectedProject)
                                                            }
                                                            checked={selectedProject.some((p) => p.id === elem._id)}
                                                          />
                      
                      
                                                          </div>
                                                          <div>{elem?.name}</div>
                                                        </div>
                                                      </td>
                                                      <td>
                                                        {elem?.startDate !== null ||
                                                        elem?.endDate !== null ? (
                                                          <>
                                                            {moment(elem?.startDate).format(
                                                              "YYYY-MM-DD"
                                                            )}{" "}
                                                            /{" "}
                                                            {moment(elem?.endDate).format(
                                                              "YYYY-MM-DD"
                                                            )}
                                                          </>
                                                        ) : (
                                                          "-"
                                                        )}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                              <div className="error mx-4">{error.project_err}</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Collapse>
                                  </div>
                                </div>

                      <div className="col-12 mt-4">
                        <button
                          type="button"
                          className="btn btn-primary me-2"
                          disabled={disable}
                          onClick={handleSubmit}
                        >
                          {disable ? "Saving..." : "Submit"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <Footer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
