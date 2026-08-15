import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetAdminPassword } from '../../../Store/Admin/Login/ResetPassword';


const ResetPassword = () => {

    const [details, setDetails] = useState({ password: '', confirm_password: '', pwdShow: true, cpwdShow: true });
    const [error, setError] = useState({});
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);


    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            setDisable(true);

            dispatch(resetAdminPassword({ password: details.password }))
                .then((response) => {
                    if (response?.payload?.success === true) {
                        nav('/admin/login')
                        setDetails({ password: '', confirm_password: '' });
                        localStorage.removeItem('A_FORGET_EMAIL');
                    }
                    setDisable(false);
                }).catch((error) => {
                    setDisable(false);
                })
        }
    }


    const validation = () => {
        var isValid = true;
        let err = {};

        if (!details.password) {
            isValid = false;
            err['password_err'] = "Please enter password";
        } else {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(details.password)) {
                isValid = false;
                err['password_err'] = "Password must have at least 8 characters, including one capital letter, one number, and one special character (@$!%*?&)";
            }
        }

        if (!details.confirm_password) {
            isValid = false;
            err['cpassword_err'] = "Please enter confirm password"
        }

        if (details.password && details.confirm_password) {
            if (details.password !== details.confirm_password) {
                isValid = false;
                err['cpassword_err'] = "Password doesn't match";
            }
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
                                            <Link to="/admin/login"><img src="/assets/img/login-vlogo.svg" alt="account-logo" /></Link>
                                        </div>
                                        <h2>Reset Password</h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="input-block">
                                                <label>Password <span className="login-danger">*</span></label>
                                                <input className="form-control" onChange={handleChange} name='password'
                                                    type={details.pwdShow ? "password" : "text"} value={details?.password} />
                                                {details.pwdShow ? <div className="profile-views toggle-password" onClick={() => { setDetails({ ...details, pwdShow: false }) }}><i className='fa-solid fa-eye' /></div> : <div className='profile-views toggle-password' onClick={() => setDetails({ ...details, pwdShow: true })}><i className='fa-solid fa-eye-slash' /> </div>}
                                                <div className='error'>{error.password_err}</div>
                                            </div>
                                            <div className="input-block position-relative">
                                                <label>Confirm Password <span className="login-danger">*</span></label>
                                                <input className="form-control pass-input " type={details.cpwdShow ? "password" : "text"}
                                                    value={details?.confirm_password} onChange={handleChange} name='confirm_password' />
                                                {details.cpwdShow ? <div className="profile-views toggle-password" onClick={() => { setDetails({ ...details, cpwdShow: false }) }}><i className='fa-solid fa-eye' /></div> : <div className='profile-views toggle-password' onClick={() => setDetails({ ...details, cpwdShow: true })}><i className='fa-solid fa-eye-slash' /> </div>}
                                                <div className='error'>{error.cpassword_err}</div>
                                            </div>
                                            <div className="input-block login-btn">
                                                <button className="btn-block  btn btn-primary" type="submit" disabled={disable}>{disable ? "Processing..." : "Submit"}</button>
                                            </div>
                                        </form>
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

export default ResetPassword