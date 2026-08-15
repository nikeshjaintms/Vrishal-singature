import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { adminForgetPassword } from '../../../Store/Admin/Login/ForgetPassword';
import Images from '../../../Images/Img';

const ForgetPassword = () => {

    const [email, setEmail] = useState('');
    const [err, setErr] = useState('');
    const [disable, setDisable] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        setDisable(true);
        if (email) {
            dispatch(adminForgetPassword(email))
                .then((response) => {
                    if (response.payload.success === true) {
                        navigate('/admin/otp-verification')
                        localStorage.setItem('VA_FORGET_EMAIL', email);
                        setEmail('');
                    }
                    setDisable(false);
                    setErr('');
                })
        } else {
            setErr('Please enter email');
            localStorage.removeItem('VA_FORGET_EMAIL');
            setDisable(false);
        }
    }


    return (
        <div className="main-wrapper login-body">
            <div className="container-fluid px-0">
                <div className="row">
                    <div className="col-lg-6 login-wrap">
                        <div className="login-sec">
                            <div className="log-img">
                                <img className="img-fluid" src="/assets/img/Password.png" alt="Logo" />
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
                                        <h2>Forget Password</h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="input-block">
                                                <label>Email <span className="login-danger">*</span></label>
                                                <input className="form-control" type='email' value={email}
                                                    onChange={(e) => setEmail(e.target.value)} />
                                                <div className='error'>{err}</div>
                                            </div>
                                            <div className="input-block login-btn">
                                                <button className="btn btn-primary btn-block" type="submit" disabled={disable}>{disable ? 'Processing...' : 'Send reset otp'}</button>
                                            </div>
                                        </form>
                                        <div className="next-sign">
                                            <p className="account-subtitle">Back to <Link to="/admin/login">Login</Link></p>
                                            {/* <div className="social-login">
                                                <Link to="javascript:;"><img src="/assets/img/icons/login-icon-01.svg" alt="login-icon1" /></Link>
                                                <Link to="javascript:;"><img src="/assets/img/icons/login-icon-02.svg" alt="login-icon2" /></Link>
                                                <Link to="javascript:;"><img src="/assets/img/icons/login-icon-03.svg" alt="login-icon3" /></Link>
                                            </div> */}
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

export default ForgetPassword