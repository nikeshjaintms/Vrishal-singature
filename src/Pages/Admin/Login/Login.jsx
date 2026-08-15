import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { adminLogin } from '../../../Store/Admin/Login/Login';
import cryptojs from 'crypto-js'
import Images from '../../../Images/Img';

const Login = () => {

    const [login, setLogin] = useState({ email: "", password: "", pwdShow: true, remember: false });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const secretKey = 'Vishal Enterprise';
    useEffect(() => {
        if (localStorage.getItem('VA_REM') && localStorage.getItem('VA_REM') === 'true') {

            const password = cryptojs.AES.decrypt(localStorage.getItem('VA_PASSWORD'), secretKey);
            const decryptedPassword = password.toString(cryptojs.enc.Utf8);

            setLogin({
                email: localStorage.getItem('VA_EMAIL'),
                password: decryptedPassword,
                remember: true,
                pwdShow: true
            })
        }
    }, []);

    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            setDisable(true);

            dispatch(adminLogin({ email: login.email, password: login.password }))
                .then((response) => {
                    if (response.payload.success === true) {
                        navigate('/admin/dashboard');

                        if (login?.remember) {
                            localStorage.setItem('VA_EMAIL', login?.email);
                            localStorage.setItem('VA_PASSWORD', cryptojs.AES.encrypt(login?.password, secretKey).toString());
                            localStorage.setItem('VA_REM', login?.remember);
                        } else {
                            localStorage.setItem('VA_EMAIL', login?.email);
                            localStorage.setItem('VA_PASSWORD', cryptojs.AES.encrypt(login?.password, secretKey).toString());
                            localStorage.setItem('VA_REM', login?.remember);
                        }
                    }
                    setDisable(false);
                    // setLogin({ email: "", password: "" });
                }).catch((error) => {
                    setDisable(false);
                })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!login.email) {
            isValid = false;
            err['email_err'] = "Please enter email"
        }

        if (!login.password) {
            isValid = false;
            err['password_err'] = "Please enter password"
        }

        setError(err);
        return isValid;
    }


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
                                            <Link to="/admin/login"><img src={Images.Logo} alt="account-logo" /></Link>
                                        </div>
                                        <h2>Login</h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="input-block">
                                                <label>Email <span className="login-danger">*</span></label>
                                                <input className="form-control" onChange={handleChange} name='email'
                                                    type="email" value={login.email} />
                                                <div className='error'>{error.email_err}</div>
                                            </div>
                                            <div className="input-block position-relative">
                                                <label>Password <span className="login-danger">*</span></label>
                                                <input className="form-control pass-input " type={login.pwdShow ? "password" : "text"}
                                                    value={login.password} onChange={handleChange} name='password' id='password' />
                                                {login.pwdShow ? <div className="profile-views toggle-password" onClick={() => { setLogin({ ...login, pwdShow: false }) }}><i className='fa-solid fa-eye' /></div> : <div className='profile-views toggle-password' onClick={() => setLogin({ ...login, pwdShow: true })}><i className='fa-solid fa-eye-slash' /> </div>}
                                                <div className='error'>{error.password_err}</div>
                                            </div>
                                            <div className="forgotpass">
                                                <div className="remember-me">
                                                    <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                                                        Remember me
                                                        <input type="checkbox" name="radio" className='form-check-input' checked={login.remember} onChange={() => setLogin({ ...login, remember: !login.remember })} />
                                                        <span className="checkmark" />
                                                    </label>
                                                </div>
                                                <Link to="/admin/forget-password">Forgot Password?</Link>
                                            </div>
                                            <div className="input-block login-btn">
                                                <button className="btn-block  btn btn-primary" type="submit" disabled={disable}>{disable ? "Processing..." : "Login"}</button>
                                            </div>
                                        </form>
                                        <div className="next-sign">
                                            <p className="account-subtitle">Back To <Link to="/">Main Login</Link>
                                            </p>
                                        </div>
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

export default Login