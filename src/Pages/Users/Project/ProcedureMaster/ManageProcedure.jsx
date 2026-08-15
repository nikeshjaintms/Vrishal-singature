import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';

const ManageProcedure = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [procedure, setProcedure] = useState({ clientDoc: "", vendorDoc: "", docName: "", issueNo: "", status: "", pdf: "" });
    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setProcedure({
                clientDoc: location.state.client_doc_no,
                vendorDoc: location.state.vendor_doc_no,
                docName: location.state.ducument_no,
                issueNo: location.state.issue_no,
                status: location.state.status,
                pdf: location.state.pdf,
            });
            // setSelectValue(location.state.status);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setProcedure({ ...procedure, [e.target.name]: e.target.value });
    }

    const handlePdf = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["application/pdf"];
            const fileType = e.target.files[0].type;
            if (allowedTypes.includes(fileType)) {
                setDisable(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append('image', e?.target?.files[0]);
                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                }).then((response) => {
                    if (response.data.success === true) {
                        const data = response?.data?.data?.pdf;
                        setProcedure({ ...procedure, pdf: data });
                    }
                    setDisable(false);
                }).catch((error) => {
                    console.log(error, '!!');
                    toast.error(error.response?.data?.message)
                })
            } else {
                toast.error("Invalid file type. Only PDFs are allowed.");
            }
        }
    }


    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-procedure-specification`;
            const formData = new URLSearchParams();
            formData.append('client_doc_no', procedure.clientDoc);
            formData.append('ducument_no', procedure.docName);
            formData.append('issue_no', procedure.issueNo);
            formData.append('vendor_doc_no', procedure.vendorDoc);
            formData.append('status', procedure.status);
            formData.append('pdf', procedure.pdf);
            formData.append('project', localStorage.getItem('U_PROJECT_ID'));
            if (data?._id) {
                formData.append('id', data._id);
            }
            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    navigate('/user/project-store/procedure-master-management')
                    toast.success(response.data.message);
                    handleReset();
                } else {
                    toast.error(response.data.message);
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error?.response?.data?.message || 'Something went wrong')
                setDisable(false);
            });
        }
    }

    const handleReset = () => {
        setProcedure({ clientDoc: "", vendorDoc: "", docName: "", issueNo: "", status: "", pdf: "" });
    }

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!procedure.clientDoc) {
            isValid = false;
            err['clientDoc_err'] = 'Please enter client doc. no.';
        }
        if (!procedure.vendorDoc) {
            isValid = false;
            err['vendorDoc_err'] = 'Please enter vendor doc. no.';
        }
        if (!procedure.docName) {
            isValid = false;
            err['docName_err'] = 'Please enter document name';
        }
        if (!procedure.issueNo) {
            isValid = false;
            err['issueNo_err'] = 'Please enter issue no.';
        }
        if (!procedure.status) {
            isValid = false;
            err['status_err'] = 'Please select status';
        }
        if (!procedure.pdf) {
            isValid = false;
            err['pdf_err'] = 'Please select pdf';
        }

        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/user/project-store/procedure-master-management">Procedure & Specification Master List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Procedure & Specification Master</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Procedure & Specification Master Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Client Doc. No. <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='clientDoc'
                                                        onChange={handleChange} value={procedure.clientDoc} />
                                                    <div className='error'>{error?.clientDoc_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Vendor Doc. No. <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='vendorDoc'
                                                        onChange={handleChange} value={procedure.vendorDoc} />
                                                    <div className='error'>{error?.vendorDoc_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Document Name <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='docName'
                                                        onChange={handleChange} value={procedure.docName} />
                                                    <div className='error'>{error?.docName_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Issue No. / REV No. <span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='issueNo'
                                                        onChange={handleChange} value={procedure.issueNo} />
                                                    <div className='error'>{error?.issueNo_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Status<span className="login-danger">*</span></label>
                                                    <select className="form-control form-select" name='status'
                                                        onChange={handleChange} value={procedure.status} >
                                                        <option value="">Select Status</option>
                                                        <option value={1}>Submitted</option>
                                                        <option value={2}>Approved</option>
                                                        <option value={3}>Commented</option>
                                                        {/* <option value={4}>Superseded</option> */}
                                                        <option value={5}>Reviewed</option>
                                                        <option value={6}>Rejected</option>
                                                    </select>
                                                    <div className='error'>{error?.status_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">PDF <span className="login-danger">*</span></label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                                        <input type="file" id="pdfFile" onChange={handlePdf} accept=".pdf" className="hide-input" />
                                                    </div>
                                                    <div className='error'>{error.pdf_err}</div>
                                                    {procedure.pdf ? (
                                                        <a href={procedure.pdf} target='_blank' rel="noreferrer">
                                                            <img src='/assets/img/pdflogo.png' alt='draw-pdf' />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>

                                        </div>

                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ManageProcedure