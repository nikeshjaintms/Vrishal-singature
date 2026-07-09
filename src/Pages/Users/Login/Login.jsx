import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import axios from 'axios';
import { M_STORE, PAY, PMS, V_URL, PIPING } from '../../../BaseUrl';
import cryptojs from 'crypto-js'
import moment from 'moment';
import { useRoleAccess } from '../../../Context/RoleAccessContext';
import Images from '../../../Images/Img';
import { clearOldSession } from '../../../Components/LocalStorageData/PmsLocalStorage';

const SLogin = () => {
    const [login, setLogin] = useState({ email: "", password: "", pwdShow: true, remember: false });
    const [newData, setNewData] = useState({
        email: "",
        productList: [],
        pipingRole: [],
        structureRole: [],
        erp_role: "",
        project: "",
        year: "",
        firm: ""
    });
    const [projectData, setProjectData] = useState([]);
    const [erpData, setErpData] = useState([]); // Dynamic role list based on selected product
    const [yearData, setYearData] = useState([]);
    const [firmData, setFirmData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [errorTwo, setErrorTwo] = useState({});
    const [selectedProduct, setSelectedProduct] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    console.log("Login Location State →", location.state);
    const secretKey = 'Vishal Enterprise';
    const { setUserRole } = useRoleAccess();

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_REMEMBER_ME') === 'true') {
            const password = cryptojs.AES.decrypt(localStorage.getItem('PAY_USER_PASSWORD'), secretKey);
            const decryptedPassword = password.toString(cryptojs.enc.Utf8);
            setLogin({
                email: localStorage.getItem('PAY_USER_EMAIL'),
                password: decryptedPassword,
                remember: true,
                pwdShow: true
            });
        }
        clearOldSession();
    }, []);

    const handleChange = (e) => setLogin({ ...login, [e.target.name]: e.target.value });
    const handleChangeTwo = (e) => setNewData({ ...newData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validation()) return;

        setDisable(true);
        const myurl = `${V_URL}/user/login`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('email', login.email);
        bodyFormData.append('password', login.password);

        axios.post(myurl, bodyFormData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
            .then((response) => {
                const data = response.data.data;
                if (!data || data?.product?.length === 0) {
                    toast.error('No products available for this user');
                    setDisable(false);
                    return;
                }

                // Store server data in state
                setNewData({
                    email: data.email,
                    productList: data.product?.filter(p => 
                        p.name?.toLowerCase().includes("fabrication")
                    ) || [],
                    pipingRole: data.pipingRole || [],
                    structureRole: data.structureRole || [],
                    erp_role: "",
                    project: "",
                    year: "",
                    firm: ""
                });
                setProjectData(data.project || []);
                setYearData(data.year || []);
                setFirmData(data.firm || []);

                localStorage.setItem('PAY_USER_TOKEN', data.token);
                localStorage.setItem('PAY_USER_NAME', data.name);
                localStorage.setItem('PAY_USER_ID', data.id);
                localStorage.setItem('PAY_USER_EMAIL', data.email);

                if (login.remember) {
                    localStorage.setItem('PAY_USER_EMAIL', login.email);
                    localStorage.setItem('PAY_USER_PASSWORD', cryptojs.AES.encrypt(login.password, secretKey).toString());
                    localStorage.setItem('PAY_USER_REMEMBER_ME', login.remember);
                } else {
                    localStorage.setItem('PAY_USER_REMEMBER_ME', false);
                }

                toast.success(response.data.message);
                setDisable(false);
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || 'Something went wrong');
                setDisable(false);
            });
    };

    const handleProductChange = (e) => {
        const product = e.target.value;
        setSelectedProduct(product);
        setNewData({ ...newData, product, erp_role: '' }); // <-- add product here
        localStorage.setItem('VI_PRO', product);
        // Assign roles dynamically based on selected product
        if (product === 'Piping Fabrication') setErpData(newData.pipingRole || []);
        else if (product === 'Structural Fabrication') setErpData(newData.structureRole || []);
        else setErpData([]);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!validationTwo()) return;

        setDisable(true);
        const selectedProject = projectData.find(p => p._id === newData.project);

        console.log("Selected Data →", newData);
        if (projectData.length > 0) {
            localStorage.setItem('PAY_USER_YEAR_ID', selectedProject?.year_id?._id);
            localStorage.setItem('PAY_USER_FIRM_ID', selectedProject?.firm_id?._id);
            localStorage.setItem('U_PROJECT_ID', newData.project);
            localStorage.setItem('ERP_ROLE', newData?.erp_role);
             localStorage.setItem(
        'PAY_CLIENT_NAME',
        selectedProject?.party?.name || ""
    );


        } else if (yearData.length > 0) {
            localStorage.setItem('PAY_USER_YEAR_ID', newData.year);
        }

        if (newData.product === M_STORE && location.state?.type === true) {
            navigate('/main-store/user/dashboard');
        } else if (newData.product === PMS && location.state?.type !== true) {
            setUserRole(newData.erp_role);
            navigate('/user/project-store/dashboard');
        } else if (newData.product === PIPING && location.state?.type !== true) {
            setUserRole(newData.erp_role);
            navigate('/piping/user/dashboard');
        } else {
            toast.error("Access denied or invalid step. Please try again.");
        }

        // toast.success("Data Selected Successfully");
        setDisable(false);
    };

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!login.email) { isValid = false; err.email_err = "Please enter email"; }
        if (!login.password) { isValid = false; err.password_err = "Please enter password"; }
        setError(err);
        return isValid;
    };

    const validationTwo = () => {
        let isValid = true;
        let err = {};

        if (!selectedProduct) { isValid = false; err.product_err = "Please select product"; }
        if (projectData.length > 0 && !newData.project) { isValid = false; err.project_err = "Please select project"; }
        if (erpData.length > 0 && !newData.erp_role) { isValid = false; err.erp_role_err = "Please select role"; }
        if (yearData.length > 0 && !newData.year) { isValid = false; err.year_err = "Please select year"; }

        setErrorTwo(err);
        return isValid;
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
                                            <Link to="/user/login"><img src={Images.Logo} alt="account-logo" /></Link>
                                        </div>

                                        {/* Initial Email/Password login */}
                                        {projectData.length === 0 && selectedProduct === '' && (
                                            <>
                                                <h2>{location?.state?.type === 1 ? 'Main Store' : 'Project'} Login</h2>
                                                <form onSubmit={handleSubmit}>
                                                    <div className="input-block">
                                                        <label>Email <span className="login-danger">*</span></label>
                                                        <input className="form-control" onChange={handleChange} name='email' type="email" value={login.email} />
                                                        <div className='error'>{error.email_err}</div>
                                                    </div>
                                                    <div className="input-block position-relative">
                                                        <label>Password <span className="login-danger">*</span></label>
                                                        <input className="form-control pass-input" type={login.pwdShow ? "password" : "text"}
                                                            value={login.password} onChange={handleChange} name='password' />
                                                        <div className="profile-views toggle-password" onClick={() => setLogin({ ...login, pwdShow: !login.pwdShow })}>
                                                            <i className={`fa-solid ${login.pwdShow ? 'fa-eye' : 'fa-eye-slash'}`} />
                                                        </div>
                                                        <div className='error'>{error.password_err}</div>
                                                    </div>
                                                    <div className="forgotpass">
                                                        <div className="remember-me">
                                                            <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                                                                Remember me
                                                                <input type="checkbox" className='form-check-input' checked={login.remember} onChange={() => setLogin({ ...login, remember: !login.remember })} />
                                                                <span className="checkmark" />
                                                            </label>
                                                        </div>
                                                        <Link to="/user/forget-password">Forgot Password?</Link>
                                                    </div>
                                                    <div className="input-block login-btn">
                                                        <button className="btn-block btn btn-primary" type="submit" disabled={disable}>{disable ? "Processing..." : "Continue"}</button>
                                                    </div>
                                                    <div className="next-sign">
                                                        <p className="account-subtitle">Back To <Link to="/">Main Login</Link>
                                                        </p>
                                                    </div>
                                                </form>
                                            </>
                                        )}

                                        {/* Product selection / Project selection (shown only after login success) */}
                                        {(projectData.length > 0 || newData.productList.length > 0) && (
                                            <>
                                                <h2>{location?.state?.type === 1 ? 'Select Year' : 'Select Project'}</h2>

                                                <form onSubmit={handleSignIn}>

                                                    <div className="input-block">
                                                        <label>Product <span className="login-danger">*</span></label>
                                                        <select className="form-control select"
                                                            value={selectedProduct}
                                                            onChange={handleProductChange}
                                                        >
                                                            <option value="">Select Product</option>
                                                            {newData.productList?.map((p) => (
                                                                <option key={p.name} value={p.name}>{p.name}</option>
                                                            ))}
                                                        </select>
                                                        <div className='error'>{errorTwo.product_err}</div>
                                                    </div>

                                                    {projectData.length > 0 && (
                                                        <div className="input-block">
                                                            <label>Project <span className="login-danger">*</span></label>
                                                            <select className="form-control select"
                                                                value={newData.project}
                                                                onChange={handleChangeTwo}
                                                                name='project'
                                                            >
                                                                <option value="">Select Project</option>
                                                                {projectData.map(p => (
                                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                                ))}
                                                            </select>
                                                            <div className='error'>{errorTwo.project_err}</div>
                                                        </div>
                                                    )}

                                                    {erpData.length > 0 && (
                                                        <div className="input-block">
                                                            <label>Role <span className="login-danger">*</span></label>
                                                            <select className="form-control select"
                                                                value={newData.erp_role}
                                                                onChange={handleChangeTwo}
                                                                name='erp_role'
                                                            >
                                                                <option value="">Select Role</option>
                                                                {erpData.map((r) => (
                                                                    <option key={r._id} value={r.name}>{r.name}</option>
                                                                ))}
                                                            </select>
                                                            <div className='error'>{errorTwo.erp_role_err}</div>
                                                        </div>
                                                    )}

                                                    {yearData.length > 0 && (
                                                        <div className="input-block">
                                                            <label>Year <span className="login-danger">*</span></label>
                                                            <select className="form-control select"
                                                                value={newData.year}
                                                                onChange={handleChangeTwo}
                                                                name='year'
                                                            >
                                                                <option value="">Select Year</option>
                                                                {yearData.map(y => (
                                                                    <option key={y._id} value={y._id}>
                                                                        {moment(y.start_year).format('YYYY')}-{moment(y.end_year).format('YYYY')}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className='error'>{errorTwo.year_err}</div>
                                                        </div>
                                                    )}

                                                    <div className="input-block login-btn">
                                                        <button className="btn-block btn btn-primary" 
                                                                type="submit" 
                                                                disabled={disable}>
                                                            {disable ? "Processing..." : "Sign in"}
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
    );
}

export default SLogin;
