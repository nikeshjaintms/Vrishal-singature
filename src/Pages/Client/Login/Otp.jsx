import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import OTPInput from 'react-otp-input';
import { userOtp } from '../../../Store/Store/Login/UserOtp';
import { userForgetPassword } from '../../../Store/Store/Login/UserForget';

const Otp = () => {

  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(60);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds, minutes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp) {
      setDisable(true);
      setErr('')
      dispatch(userOtp({ otp_data: otp }))
        .then((response) => {
          if (response.payload.success === true) {
            navigate('/user/reset-password');
          }
          setOtp('');
          setDisable(false)
        }).catch((error) => {
          setDisable(false);
        })
    } else {
      setErr('Please enter otp');
      setDisable(false);
    }
  }

  const resendOTP = () => {
    setDisable(true)
    dispatch(userForgetPassword())
      .then(() => {
        setMinutes(1);
        setSeconds(0);
        setDisable(false);
      }).catch((error) => {
        setDisable(false);
      })
  }

  return (
    <div className="main-wrapper login-body">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-6 login-wrap">
            <div className="login-sec">
              <div className="log-img">
                <img className="img-fluid" src="/assets/img/OTP.png" alt="Logo" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 login-wrap-bg">
            <div className="login-wrapper">
              <div className="loginbox">
                <div className="login-right">
                  <div className="login-right-wrap">
                    <div className="account-logo login-vlogo">
                      <Link to="/user/login"><img src="/assets/img/login-vlogo.svg" alt="account-logo" /></Link>
                    </div>
                    <h2>OTP</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="input-block otp-group">
                        <OTPInput
                          value={otp}
                          onChange={(val) => setOtp(val)}
                          numInputs={4}
                          className='form-control'
                          renderSeparator={<span>-</span>}
                          // renderInput={(props) => <input {...props} />}
                          renderInput={(props, index) => (
                            <input
                              {...props}
                              type="number"
                            />
                          )}
                        />
                        <span className='error'>{err}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>

                        {seconds > 0 || minutes > 0 ? (
                          <p className='otp-time' style={{ paddingTop: '15px' }}>
                            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                            {seconds < 10 ? `0${seconds}` : seconds}
                          </p>
                        ) : (
                          <p className='otp-time' style={{ paddingTop: '12px' }}>Didn't recieve code?</p>
                        )}
                        <button className="otp-button"
                          type='button'
                          style={{ border: 'none', background: 'none', display: 'flex', alignItems: "center", justifyContent: 'flex-end', flex: 1, cursor: 'pointer', color: seconds > 0 || minutes > 0 ? "grey" : "#ff6700" }}
                          onClick={resendOTP} disabled={seconds > 0 || minutes > 0}>Resend OTP</button>
                      </div>


                      <div className="input-block login-btn">
                        <button className="btn btn-primary btn-block" type="submit" disabled={disable}>{disable ? "Processing..." : "Submit"}</button>
                      </div>
                    </form>
                    <div className="next-sign">
                      <p className="account-subtitle">Back to <Link to="/user/login">Login</Link></p>
                      {/* <div className="social-login">
                        <Link to=""><img src="/assets/img/icons/login-icon-01.svg" alt="login-icon1" /></Link>
                        <Link to=""><img src="/assets/img/icons/login-icon-02.svg" alt="login-icon2" /></Link>
                        <Link to=""><img src="/assets/img/icons/login-icon-03.svg" alt="login-icon3" /></Link>
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

export default Otp