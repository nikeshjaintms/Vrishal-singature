import React, { useEffect, useState } from 'react'
import Header from '../Include/Header'
import Sidebar from '../Include/Sidebar'
import Footer from '../Include/Footer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { V_URL } from '../../../BaseUrl';
import toast from 'react-hot-toast';


const EditProfile = () => {

    const [profile, setProfile] = useState({ name: "", image: "" });
    const [changePassword, setChangePassword] = useState({ opassword: "", password: "", cpassword: "", opwdShow: true, pwdShow: true, cpwdShow: true });
    const [disable, setDisable] = useState(false);
    const [disable1, setDisable1] = useState(false);
    const [error, setError] = useState({});
    const [errorTwo, setErrorTwo] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }

        getProfile();
    }, [navigate]);

    const getProfile = () => {
        const myurl = `${V_URL}/admin/get-profile`;
        axios({
            method: "get",
            url: myurl,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('VA_TOKEN') },
        })
            .then(async (response) => {
                console?.log("@@", response?.data);
                setProfile({
                    name: response.data.data.name,
                    image: response.data.data.image
                })
            }).catch((error) => {
                toast.error("Something went wrong");
                console?.log("Errors", error);
            });
    }

    const handleChangePassword = (e) => {
        setChangePassword({ ...changePassword, [e.target.name]: e.target.value });
    }

    const handleEditProfile = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('name', profile.name);
            bodyFormData.append('image', profile.image);

            axios({
                method: 'post',
                url: `${V_URL}/admin/update-profile`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    localStorage.setItem('VA_NAME', response?.data?.data?.name);
                    localStorage.setItem('VA_IMG', response?.data?.data?.image);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message)
                }
                setDisable(false);
            }).catch((error) => {
                setDisable(false);
                toast.success(error?.response?.data?.message);
            })
        }
    }


    const handlePassword = () => {
        if (validate()) {
            setDisable1(true);

            const bodyFormData = new URLSearchParams();
            bodyFormData.append('old_password', changePassword.opassword);
            bodyFormData.append('new_password', changePassword.password);

            axios({
                method: 'post',
                url: `${V_URL}/admin/change-password`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    setChangePassword({ opassword: "", password: "", cpassword: "", opwdShow: true, pwdShow: true, cpwdShow: true })
                } else {
                    toast.error(response.data.message)
                }
                setDisable1(false);
            }).catch((error) => {
                setDisable1(false);
                toast.error(error.response.data.message);
            })

        }
    }

    const handleImage = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            const fileType = e.target.files[0].type;

            if (allowedTypes.includes(fileType)) {
                // setFirm({ ...firm, image: URL.createObjectURL(e?.target?.files[0]) })
                setDisable(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append("image", e?.target?.files[0]);

                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                })
                    .then((result) => {

                        if (result?.data?.success === true) {
                            setProfile({ ...profile, image: result?.data?.data?.image });
                            setDisable(false);
                        } else {
                            setProfile({ ...profile, image: "" });
                        }
                    })
                    .catch((error) => {
                        setProfile({ ...profile, image: "" });
                        setDisable(false);
                        toast.error("Unable to upload image");
                    });
            } else {
                setProfile({ ...profile, image: "" });
                setDisable(false);
                toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
            }
        }
    };

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!profile.name) {
            isValid = false;
            err['name_err'] = "Please enter name"
        }

        if (!profile.image) {
            isValid = false;
            err['image_err'] = "Please enter image"
        }

        setError(err);
        return isValid
    }

    const validate = () => {
        let isValid = true;
        let err = {};

        if (!changePassword.opassword) {
            isValid = false;
            err["opassword_err"] = "Please enter old password.";
        }

        if (!changePassword.password) {
            isValid = false;
            err['password_err'] = "Please enter password";
        } else {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(changePassword.password)) {
                isValid = false;
                err['password_err'] = "Password must have at least 8 characters, including one capital letter, one number, and one special character (@$!%*?&)";
            }
        }

        if (!changePassword.cpassword) {
            isValid = false;
            err['cpassword_err'] = "Please enter confirm password"
        }

        if (changePassword.password && changePassword.cpassword) {
            if (changePassword.password !== changePassword.cpassword) {
                isValid = false;
                err['cpassword_err'] = "Password doesn't match";
            }
        }


        setErrorTwo(err);
        return isValid
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }


    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
                                    <li className="breadcrumb-item active">Edit Profile</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <form action>
                        <div className="row">
                            <div className="com-md-6 col-lg-6">
                                <div className="card-box">
                                    <h3 className="card-title">Edit Profile</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="profile-img-wrap">
                                                <img className="inline-block" src={profile?.image || "/assets/img/user.jpg"} alt="user" />
                                                {/* <img className="inline-block" src={"/assets/img/user-5.jpg"} alt="user" /> */}
                                                <div className="fileupload btn">
                                                    {/* <span className="btn-text">edit</span> */}
                                                    <i className="fa-solid fa-pen"></i>
                                                    <input className="upload" type="file" onChange={handleImage} />
                                                </div>
                                            </div>
                                            <div className="profile-basic">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="input-block local-forms">
                                                            <label className="focus-label">Name</label>
                                                            <input type="text" className="form-control floating"
                                                                value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                            />
                                                            <div className='error'>{error.name_err}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="input-block local-forms">
                                                            <label className="focus-label">Email</label>
                                                            <input className="form-control floating" value={localStorage.getItem('VA_EMAIL')} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end ">
                                        <button className="btn btn-primary submit-form me-2" type="button" onClick={handleEditProfile} disabled={disable}>{disable ? 'Processing...' : 'Update'}</button>
                                    </div>
                                </div>
                            </div>
                            <div className="com-md-6 col-lg-6">
                                <div className="card-box">
                                    <h3 className="card-title">Change Password</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-block local-forms">
                                                <label className="focus-label">Old Password</label>
                                                <input type={changePassword.opwdShow ? "password" : "text"} className="form-control floating"
                                                    name='opassword' value={changePassword.opassword} onChange={handleChangePassword}
                                                />
                                                {changePassword.opwdShow ? <div className="passwordHide" onClick={() => { setChangePassword({ ...changePassword, opwdShow: false }) }}><i className='fa-solid fa-eye' /></div> : <div className='passwordHide' onClick={() => setChangePassword({ ...changePassword, opwdShow: true })}><i className='fa-solid fa-eye-slash' /> </div>}
                                                <div className='error'>{errorTwo?.opassword_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="input-block local-forms">
                                                <label className="focus-label">New Password</label>
                                                <input type={changePassword.pwdShow ? "password" : "text"} className="form-control floating"
                                                    onChange={handleChangePassword} name='password' value={changePassword.password}
                                                />
                                                {changePassword.pwdShow ? <div className="passwordHide" onClick={() => { setChangePassword({ ...changePassword, pwdShow: false }) }}><i className='fa-solid fa-eye' /></div> : <div className='passwordHide' onClick={() => setChangePassword({ ...changePassword, pwdShow: true })}><i className='fa-solid fa-eye-slash' /> </div>}
                                                <div className='error'>{errorTwo.password_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="input-block local-forms">
                                                <label className="focus-label">Confirm Password</label>
                                                <input type={changePassword.cpwdShow ? "password" : "text"} className="form-control floating"
                                                    onChange={handleChangePassword} value={changePassword.cpassword} name='cpassword'
                                                />
                                                {changePassword.cpwdShow ? <div className="passwordHide" onClick={() => { setChangePassword({ ...changePassword, cpwdShow: false }) }}><i className='fa-solid fa-eye' /></div> : <div className='passwordHide' onClick={() => setChangePassword({ ...changePassword, cpwdShow: true })}><i className='fa-solid fa-eye-slash' /> </div>}
                                                <div className='error'>{errorTwo.cpassword_err}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-end ">
                                        <button className="btn btn-primary submit-form me-2" type="button" onClick={handlePassword} disabled={disable1}>{disable1 ? 'Processing...' : 'Submit'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <Footer />
            </div>
        </div>
    )
}

export default EditProfile