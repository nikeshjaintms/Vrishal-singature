import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Images from '../../../Images/Img';
import { V_URL, PO_PLAN, PIPING_PLAN } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import cryptojs from 'crypto-js'
import PO_ROUTE_URLS from '../../../Routes/PoTeam/PoRoutes';
import { useRoleAccess } from '../../../Context/RoleAccessContext';
import { clearOldSession } from '../../../Components/LocalStorageData/PmsLocalStorage';
const PoLogin = () => {

    const [login, setLogin] = useState({ email: "", password: "", pwdShow: true, remember: false });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});

    const [project, setProject] = useState("");
    const [projectData, setProjectData] = useState([]);

    const [productList, setProductList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const { setUserRole } = useRoleAccess();


    const navigate = useNavigate();
    const secretKey = 'Vishal Enterprise';

    // Remember Me Auto-Fill
    useEffect(() => {
        if (localStorage.getItem('PAY_USER_REMEMBER_ME') === 'true') {
            const password = cryptojs.AES.decrypt(localStorage.getItem('PAY_USER_PASSWORD'), secretKey);
            const decryptedPassword = password.toString(cryptojs.enc.Utf8);
            setLogin({
                email: localStorage.getItem('PAY_USER_EMAIL'),
                password: decryptedPassword,
                remember: true,
                pwdShow: true
            })
        }
    }, []);

    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    // ----------------------------
    //        LOGIN SUBMIT
    // ----------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        setDisable(true);

        if (!validation()) return;

        const myurl = `${V_URL}/user/login`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('email', login.email);
        bodyFormData.append('password', login.password);

        axios.post(myurl, bodyFormData, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
            .then((response) => {
                console.log("LOGIN SUCCESS RESPONSE:", response.data);

                const { data, message, success } = response.data;

                // Support backend sending an array or single object
                const user = Array.isArray(data) ? data[0] : data;

                if (!success || !user) {
                    toast.error("Invalid user response");
                    return;
                }

                // Safe product filter
                const filteredProducts = (user.product || []).filter(p =>
                    p.name?.toLowerCase().includes("procurement")
                );

                if (filteredProducts.length === 0) {
                    toast.error("No Procurement products assigned");
                    return;
                }

                setProductList(filteredProducts);
                setRoles(user.procurementRole || []);
                setProjectData(user.project || []);

                // Save login data
                localStorage.setItem('PAY_USER_TOKEN', user.token);
                localStorage.setItem('PAY_USER_NAME', user.name);
                localStorage.setItem('PAY_USER_ID', user.id);
                localStorage.setItem('PAY_USER_EMAIL', user.email);

                // Remember me
                localStorage.setItem('PAY_USER_EMAIL', login.email);
                localStorage.setItem(
                    'PAY_USER_PASSWORD',
                    cryptojs.AES.encrypt(login.password, secretKey).toString()
                );
                localStorage.setItem('PAY_USER_REMEMBER_ME', login.remember);

                toast.success(message);
            })
            .catch((error) => {
                console.log("LOGIN ERROR:", error?.response?.data);
                toast.error(error?.response?.data?.message || "Something went wrong");
            })
            .finally(() => {
                setDisable(false);
            });
    };


    // ----------------------------
    //       VALIDATION
    // ----------------------------
    const validation = () => {
        let isValid = true;
        let err = {};

        if (!login.email) {
            isValid = false;
            err.email_err = "Please enter email";
        }
        if (!login.password) {
            isValid = false;
            err.password_err = "Please enter password";
        }

        setError(err);
        return isValid;
    };

    // ----------------------------
    //   PRODUCT / ROLE / PROJECT SUBMIT
    // ----------------------------
    const handleSignIn = (e) => {
        e.preventDefault();

        let err = {};
        let valid = true;

        if (!selectedProduct) {
            valid = false;
            err.product_err = "Please select product";
        }
        if (!selectedRole) {
            valid = false;
            err.role_err = "Please select role";
        }
        if (!project) {
            valid = false;
            err.project_err = "Please select project";
        }

        setError(err);
        if (!valid) return;

        const selectedProjectObj = projectData.find(p => p._id === project);

        if (selectedProjectObj) {
            localStorage.setItem('PAY_USER_FIRM_NAME', selectedProjectObj?.firm_id?.name || "");
            localStorage.setItem('PAY_USER_FIRM_ID', selectedProjectObj?.firm_id?._id);
            localStorage.setItem('PAY_USER_YEAR_ID', selectedProjectObj?.year_id._id || "");
            localStorage.setItem('PAY_USER_START_YEAR', selectedProjectObj?.year_id.start_year || "");
            localStorage.setItem('PAY_USER_END_YEAR', selectedProjectObj?.year_id.end_year || "");
        }

        localStorage.setItem('PO_PRODUCT', selectedProduct);
        localStorage.setItem('PO_ROLE', selectedRole);
        localStorage.setItem('VI_PRO', selectedProduct);

        localStorage.setItem('U_PROJECT_ID', project);
        localStorage.setItem('PAY_USER_PROJECT_NAME', selectedProjectObj?.name);
        localStorage.setItem('ERP_ROLE', selectedRole);

        if (selectedProduct === PO_PLAN) {
            navigate(PO_ROUTE_URLS.HOME);
        }
        else if (selectedProduct.trim().toLowerCase() === PIPING_PLAN.trim().toLowerCase()) {
            setUserRole(selectedRole);
            navigate(PO_ROUTE_URLS.PIPING_HOME);
        }
        else {
            toast.error("Invalid Product Selected");
            navigate(PO_ROUTE_URLS.LOGIN);
        }

    };

    return (
        <div className="main-wrapper login-body">
            <div className="container-fluid px-0">
                <div className="row">
                    <div className="col-lg-6 login-wrap">
                        <div className="login-sec">
                            <div className="log-img">
                                <img className="img-fluid" src="/assets/img/login-img.png" alt="Logo" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 login-wrap-bg">
                        <div className="login-wrapper">
                            <div className="loginbox">
                                <div className="login-right">
                                    <div className="login-right-wrap">

                                        <div className="account-logo login-vlogo">
                                            <Link to={PO_ROUTE_URLS.LOGIN}>
                                                <img src={Images.Logo} alt="logo" />
                                            </Link>
                                        </div>

                                        {/* STEP 1 — LOGIN */}
                                        {projectData.length === 0 && productList.length === 0 && (
                                            <>
                                                <h2>Material Procurement Login</h2>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="input-block">
                                                        <label>Email <span className="login-danger">*</span></label>
                                                        <input
                                                            className="form-control"
                                                            name='email'
                                                            type="email"
                                                            value={login.email}
                                                            onChange={handleChange}
                                                        />
                                                        <div className="error">{error.email_err}</div>
                                                    </div>

                                                    <div className="input-block position-relative">
                                                        <label>Password <span className="login-danger">*</span></label>
                                                        <input
                                                            className="form-control pass-input"
                                                            type={login.pwdShow ? "password" : "text"}
                                                            name='password'
                                                            value={login.password}
                                                            onChange={handleChange}
                                                        />
                                                        <div
                                                            className="profile-views toggle-password"
                                                            onClick={() => setLogin({ ...login, pwdShow: !login.pwdShow })}
                                                        >
                                                            <i className={`fa-solid ${login.pwdShow ? "fa-eye" : "fa-eye-slash"}`} />
                                                        </div>
                                                        <div className="error">{error.password_err}</div>
                                                    </div>

                                                    <div className="forgotpass">
                                                        <div className="remember-me">
                                                            <label className="custom_check">
                                                                Remember me
                                                                <input
                                                                    type="checkbox"
                                                                    checked={login.remember}
                                                                    onChange={() => setLogin({ ...login, remember: !login.remember })}
                                                                />
                                                                <span className="checkmark" />
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="input-block login-btn">
                                                        <button className="btn-block btn btn-primary" type="submit" disabled={disable}>
                                                            {disable ? "Processing..." : "Login"}
                                                        </button>
                                                    </div>

                                                    <div className="next-sign">
                                                        <p className="account-subtitle">Back To <Link to="/">Main Login</Link>
                                                        </p>
                                                    </div>
                                                </form>
                                            </>
                                        )}

                                        {/* STEP 2 — SELECT PRODUCT, ROLE, PROJECT */}
                                        {productList.length > 0 && (
                                            <>
                                                <h2>Material Procurement Login</h2>
                                                <form onSubmit={handleSignIn}>

                                                    <div className="input-block">
                                                        <label>Product <span className="login-danger">*</span></label>
                                                        <select
                                                            className="form-control select"
                                                            value={selectedProduct}
                                                            onChange={(e) => setSelectedProduct(e.target.value)}
                                                        >
                                                            <option value="">Select Product</option>
                                                            {productList.map(p => (
                                                                <option key={p._id} value={p.name}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        <div className='error'>{error.product_err}</div>
                                                    </div>

                                                    <div className="input-block">
                                                        <label>Role <span className="login-danger">*</span></label>
                                                        <select
                                                            className="form-control select"
                                                            value={selectedRole}
                                                            onChange={(e) => setSelectedRole(e.target.value)}
                                                        >
                                                            <option value="">Select Role</option>
                                                            {roles.map(r => (
                                                                <option key={r._id} value={r.name}>{r.name}</option>
                                                            ))}
                                                        </select>
                                                        <div className='error'>{error.role_err}</div>
                                                    </div>

                                                    <div className="input-block">
                                                        <label>Project  <span className="login-danger">*</span></label>
                                                        <select
                                                            className="form-control select"
                                                            value={project}
                                                            onChange={(e) => setProject(e.target.value)}
                                                        >
                                                            <option value="">Select Project</option>
                                                            {projectData.map(p => (
                                                                <option key={p._id} value={p._id}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        <div className='error'>{error.project_err}</div>
                                                    </div>

                                                    <div className="input-block login-btn">
                                                        <button className="btn-block btn btn-primary" type="submit">
                                                            Sign in
                                                        </button>
                                                    </div>

                                                </form>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default PoLogin;
