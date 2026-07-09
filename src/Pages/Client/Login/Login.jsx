import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import cryptojs from 'crypto-js';
import Images from '../../../Images/Img';
import { V_URL } from '../../../BaseUrl';

const PartyLogin = () => {
  const [login, setLogin] = useState({
    email: "",
    password: "",
    pwdShow: true,
    remember: false
  });

  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});

  // STEP 2 states
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const navigate = useNavigate();
  const secretKey = 'Vishal Enterprise';

  // ----------------------------
  // Remember Me
  // ----------------------------
  useEffect(() => {
    if (localStorage.getItem('PARTY_REMEMBER_ME') === 'true') {
      const password = cryptojs.AES.decrypt(
        localStorage.getItem('PARTY_PASSWORD'),
        secretKey
      ).toString(cryptojs.enc.Utf8);

      setLogin({
        email: localStorage.getItem('PARTY_EMAIL'),
        password,
        remember: true,
        pwdShow: true
      });
    }
  }, []);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  // ----------------------------
  // Validation
  // ----------------------------
  const validation = () => {
    let err = {};
    let valid = true;

    if (!login.email) {
      valid = false;
      err.email_err = "Please enter email";
    }
    if (!login.password) {
      valid = false;
      err.password_err = "Please enter password";
    }

    setError(err);
    return valid;
  };

  // ----------------------------
  // STEP 1 — LOGIN SUBMIT
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation()) return;

    setDisable(true);

    try {
      const res = await axios.post(`${V_URL}/party/login-party`, {
        email: login.email,
        password: login.password
      });

      if (res.data?.success) {
        const data = res.data.data;

        // 🔐 Auth info
        localStorage.setItem("PARTY_TOKEN", data.token);
        localStorage.setItem("PARTY_ID", data.id);
        localStorage.setItem("PARTY_NAME", data.name);
        localStorage.setItem("PARTY_EMAIL", data.email);

        // 💾 Remember me
        if (login.remember) {
          localStorage.setItem("PARTY_EMAIL", login.email);
          localStorage.setItem(
            "PARTY_PASSWORD",
            cryptojs.AES.encrypt(login.password, secretKey).toString()
          );
          localStorage.setItem("PARTY_REMEMBER_ME", true);
        } else {
          localStorage.removeItem("PARTY_PASSWORD");
          localStorage.removeItem("PARTY_REMEMBER_ME");
        }

        // 👉 SHOW PROJECT STEP
        if (Array.isArray(data.project) && data.project.length > 0) {
          setProjects(data.project);
          toast.success("Login successful");
        } else {
          toast.error("No project assigned");
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setDisable(false);
    }
  };

  // ----------------------------
  // STEP 2 — PROJECT SUBMIT
  // ----------------------------
  const handleProjectSubmit = (e) => {
    e.preventDefault();

    if (!selectedProject) {
      toast.error("Please select project");
      return;
    }

    const project = projects.find(p => p._id === selectedProject);
    if (!project) return;

    localStorage.setItem("PARTY_PROJECT_ID", project._id);
    localStorage.setItem("PARTY_PROJECT", project.name);
    localStorage.setItem("PARTY_YEAR_ID", project?.year_id?._id || "");
    localStorage.setItem("PARTY_FIRM_ID", project?.firm_id?._id || "");
    localStorage.setItem("PARTY_FIRM_NAME", project?.firm_id?.name || "");
    localStorage.setItem("PARTY_START_YEAR", project?.year_id?.start_year || "");
    localStorage.setItem("PARTY_END_YEAR", project?.year_id?.end_year || "");

    navigate("/party/project-store/dashboard");
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
                      <Link to="/"><img src={Images.Logo} alt="logo" /></Link>
                    </div>

                    {/* STEP 1 — LOGIN */}
                    {projects.length === 0 && (
                      <>
                        <h2>Party Login</h2>

                        <form onSubmit={handleSubmit}>
                          <div className="input-block">
                            <label>Email <span className="login-danger">*</span></label>
                            <input
                              className="form-control"
                              name="email"
                              type="email"
                              value={login.email}
                              onChange={handleChange}
                            />
                            <div className="error">{error.email_err}</div>
                          </div>

                          <div className="input-block position-relative">
                            <label>Password <span className="login-danger">*</span></label>
                            <input
                              className="form-control"
                              type={login.pwdShow ? "password" : "text"}
                              name="password"
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

                          <div className="input-block login-btn">
                            <button className="btn-block btn btn-primary" type="submit" disabled={disable}>
                              {disable ? "Processing..." : "Login"}
                            </button>
                          </div>

                          <div className="next-sign">
                            <p>Back to <Link to="/">Main Login</Link></p>
                          </div>
                        </form>
                      </>
                    )}

                    {/* STEP 2 — PROJECT SELECT */}
                    {projects.length > 0 && (
                      <>
                        <h2>Select Project</h2>

                        <form onSubmit={handleProjectSubmit}>
                          <div className="input-block">
                            <label>Project <span className="login-danger">*</span></label>
                            <select
                              className="form-control"
                              value={selectedProject}
                              onChange={(e) => setSelectedProject(e.target.value)}
                            >
                              <option value="">Select Project</option>
                              {projects.map(p => (
                                <option key={p._id} value={p._id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
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
  );
};

export default PartyLogin;
