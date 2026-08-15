import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { V_URL, M_STORE } from '../../../BaseUrl';
import cryptojs from 'crypto-js';
import moment from 'moment';
import Images from '../../../Images/Img';
import { clearOldSession } from '../../../Components/LocalStorageData/PmsLocalStorage';

const Login = () => {

    const [login, setLogin] = useState({
        email: "",
        password: "",
        pwdShow: true,
        remember: false,
    });

    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");

    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [errorYear, setErrorYear] = useState("");

    const navigate = useNavigate();
    const secretKey = "Vishal Enterprise";


    useEffect(() => {
        if (localStorage.getItem('PAY_USER_REMEMBER_ME') === 'true') {
            const password = cryptojs.AES.decrypt(localStorage.getItem('PAY_USER_PASSWORD'), secretKey);
            const decryptedPassword = password.toString(cryptojs.enc.Utf8);

            setLogin({
                email: localStorage.getItem('PAY_USER_EMAIL'),
                password: decryptedPassword,
                remember: true,
                pwdShow: true,
            });
        }

        clearOldSession();
    }, []);


    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    // -----------------------------
    // LOGIN STEP
    // -----------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        let err = {};
        let valid = true;

        if (!login.email) { err.email = "Enter email"; valid = false; }
        if (!login.password) { err.password = "Enter password"; valid = false; }

        setError(err);
        if (!valid) return;

        setDisable(true);

        const url = `${V_URL}/user/login`;
        const form = new URLSearchParams();
        form.append('email', login.email);
        form.append('password', login.password);

        axios.post(url, form)
            .then((res) => {
                const data = res.data.data;

                // MUST BE MAIN STORE ONLY
                if (!data.product || data.product[0].name !== "Main Store") {
                    toast.error("This portal is only for Main Store users.");
                    setDisable(false);
                    return;
                }

                // Save login data
                localStorage.setItem("PAY_USER_TOKEN", data.token);
                localStorage.setItem("PAY_USER_NAME", data.name);
                localStorage.setItem("PAY_USER_ID", data.id);
                localStorage.setItem("PAY_USER_EMAIL", data.email);
                localStorage.setItem("VI_PRO", data.product[0].name);

                // Remember me
                if (login.remember) {
                    localStorage.setItem("PAY_USER_EMAIL", login.email);
                    localStorage.setItem(
                        "PAY_USER_PASSWORD",
                        cryptojs.AES.encrypt(login.password, secretKey).toString()
                    );
                    localStorage.setItem("PAY_USER_REMEMBER_ME", true);
                } else {
                    localStorage.setItem("PAY_USER_REMEMBER_ME", false);
                }

                // Show year dropdown
                setYears(data.year || []);
                toast.success("Login successful");

                setDisable(false);
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || "Login failed");
                setDisable(false);
            });
    };

    // -----------------------------
    // SELECT YEAR
    // -----------------------------
    const handleSelectYear = (e) => {
        e.preventDefault();

        if (!selectedYear) {
            setErrorYear("Please select a year");
            return;
        }

        localStorage.setItem('PAY_USER_YEAR_ID', selectedYear);

        toast.success("Year selected");
        navigate('/main-store/user/dashboard');
    };


    return (
        <div className="main-wrapper login-body">
            <div className="container-fluid px-0">
                <div className="row">

                    <div className="col-lg-6 login-wrap">
                        <div className="login-sec">
                            <div className="log-img">
                                <img className="img-fluid" src="/assets/img/login-img.png" alt="Login" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 login-wrap-bg">
                        <div className="login-wrapper">
                            <div className="loginbox">
                                <div className="login-right">
                                    <div className="login-right-wrap">

                                        <div className="account-logo login-vlogo">
                                            <img src={Images.Logo} alt="Logo" />
                                        </div>

                                        {/* STEP 1: LOGIN */}
                                        {years.length === 0 && (
                                            <>
                                                <h2>Main Store Login</h2>

                                                <form onSubmit={handleSubmit}>
                                                    <div className="input-block">
                                                        <label>Email *</label>
                                                        <input type="email" className="form-control"
                                                            name="email"
                                                            value={login.email}
                                                            onChange={handleChange}
                                                        />
                                                        <span className="error">{error.email}</span>
                                                    </div>

                                                    <div className="input-block position-relative">
                                                        <label>Password *</label>
                                                        <input
                                                            type={login.pwdShow ? "password" : "text"}
                                                            className="form-control"
                                                            name="password"
                                                            value={login.password}
                                                            onChange={handleChange}
                                                        />
                                                        <div className="profile-views toggle-password"
                                                            onClick={() =>
                                                                setLogin({ ...login, pwdShow: !login.pwdShow })
                                                            }>
                                                            <i className={`fa-solid ${login.pwdShow ? "fa-eye" : "fa-eye-slash"}`} />
                                                        </div>
                                                        <span className="error">{error.password}</span>
                                                    </div>

                                                    <div className="remember-me">
                                                        <label className="custom_check">
                                                            Remember me
                                                            <input
                                                                type="checkbox"
                                                                checked={login.remember}
                                                                onChange={() =>
                                                                    setLogin({ ...login, remember: !login.remember })
                                                                }
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </div>

                                                    <button className="btn btn-primary btn-block" disabled={disable}>
                                                        {disable ? "Processing..." : "Continue"}
                                                    </button>

                                                </form>
                                            </>
                                        )}

                                        {/* STEP 2: SELECT YEAR */}
                                        {years.length > 0 && (
                                            <>
                                                <h2>Select Year</h2>

                                                <form onSubmit={handleSelectYear}>
                                                    <div className="input-block">
                                                        <label>Year *</label>
                                                        <select
                                                            className="form-control"
                                                            value={selectedYear}
                                                            onChange={(e) => setSelectedYear(e.target.value)}
                                                        >
                                                            <option value="">Select Year</option>
                                                            {years.map((y) => (
                                                                <option key={y._id} value={y._id}>
                                                                    {moment(y.start_year).format("YYYY")} - {moment(y.end_year).format("YYYY")}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <span className="error">{errorYear}</span>
                                                    </div>

                                                    <button className="btn btn-primary btn-block">
                                                        Sign In
                                                    </button>
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
};

export default Login;
