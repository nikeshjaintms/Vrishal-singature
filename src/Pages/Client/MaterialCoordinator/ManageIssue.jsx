import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import { getUserProfile } from '../../../Store/Store/Profile/Profile';
import { getDrawing } from '../../../Store/Erp/Planner/Draw/Draw';
import { getProject } from '../../../Store/Store/Project/Project';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import IssueForm from '../../../Components/Validation/Issue/IssueForm';

const ManageIssue = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [issue, setIssue] = useState({
        contractor_name: "",
        date: "",
        drawing_no: "",
        rev_no: "",
        assembly_no: "",
        grid_no: "",
        item_no: "",
        unit: "",
        profile: "",
        requested_qty: "",
        issuedBy: "",
        remark: "",
        issue_qty: "",
        client: "",
        imir_no: "",
        issue_length: "",
        heat_no: "",
        client_id: "",
        drawId: "",
        itemName: "",
        qc_length: "",
        qc_nos: "",
    });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [drawData, setDrawData] = useState([]);

    const data = location.state;
    useEffect(() => {
        if (location.state) {
            setIssue({
                ...issue,
                requested_qty: location?.state?.transactionId?.quantity,
                issue_qty: location?.state?.acceptedQty,
                drawing_no: location.state?.requestId?.drawing_id?.drawing_no,
                rev_no: location?.state?.requestId?.drawing_id?.rev,
                assembly_no: location?.state?.requestId?.drawing_id?.assembly_no,
                grid_no: location?.state?.requestId?.drawing_id?.grid_no,
                item_no: location?.state?.requestId?.drawing_id?.item_no,
                profile: location?.state?.requestId?.drawing_id?.profile,
                unit: location?.state?.requestId?.drawing_id?.unit,
                client: location.state.requestId.project.party.name,
                client_id: location.state.requestId.project.party._id,
                imir_no: location.state.imir_no,
                drawId: location.state?.requestId?.drawing_id?._id,
                itemName: location.state?.transactionId?.itemName?.name,
                qc_length: location.state?.acceptedLength,
                qc_nos: location.state?.acceptedNos
            });
        }
        // eslint-disable-next-line
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise?.all([
                    dispatch(getUserProfile()),
                    dispatch(getDrawing()),
                    dispatch(getProject())
                ]);
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    const userData = useSelector((state) => state?.getUserProfile?.user?.data);
    const drawingList = useSelector((state) => state.getDrawing?.user?.data?.data);

    useEffect(() => {
        if (drawingList) {
            const finalDraw = drawingList.filter((d) => d?.project?._id === localStorage.getItem('U_PROJECT_ID'));
            setDrawData(finalDraw)
        }
    }, [userData, drawingList]);

    const handleChange = (e) => {
        setIssue({ ...issue, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-issue`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('contractorName', issue.contractor_name);
            bodyFormData.append('unit', issue?.unit);
            bodyFormData.append('profile', issue.profile);
            bodyFormData.append('requestedQty', issue.requested_qty);
            bodyFormData.append('issuedQty', issue.issue_qty);
            bodyFormData.append('issueDate', issue.date);
            bodyFormData.append('remarks', issue.remark);
            bodyFormData.append('drawingNo', issue.drawId);
            bodyFormData.append('request_id', data?.requestId?._id);
            bodyFormData.append('itemName', data?.transactionId?.itemName?._id);
            bodyFormData.append('issuedBy', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('issued_length', issue.issue_length);
            bodyFormData.append('heat_no', issue.heat_no);
            bodyFormData.append('client', issue?.client_id);
            axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                console.log(response.data, '@@')
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/user/project-store/issue-management')
                }
                setDisable(false)
            }).catch((error) => {
                console.log(error, '@@');
                toast.error('Something went wrong' || error?.response?.data?.message);
                setDisable(false)
            });
        }
    }

    const validation = () => {
        const { isValid, err } = IssueForm({ issue });
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/approved-item-management">
                                            Approved Request
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Manage Issue
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12 d-flex justify-content-between">
                                            <div className="form-heading">
                                                <h4>Issue</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Client </label>
                                                    <input className='form-control' value={issue.client} readOnly />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>IMIR No. </label>
                                                    <input className='form-control' value={issue.imir_no} readOnly />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Drawing No. </label>
                                                    <input className='form-control' value={issue.drawing_no} readOnly />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Section Details </label>
                                                    <input className='form-control' value={issue.itemName} readOnly />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> REV No.</label>
                                                    <input className="form-control" type="number" onChange={handleChange}
                                                        onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                        name='rev_no' value={issue?.rev_no} />
                                                    <div className='error'>{error?.rev_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Assembly No.</label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name='assembly_no' value={issue?.assembly_no} readOnly />
                                                    <div className='error'>{error?.assembly_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Grid No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name='grid_no' value={issue?.grid_no} readOnly />
                                                    <div className='error'>{error?.grid_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Section Details No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name='item_no' value={issue?.item_no} readOnly />
                                                    <div className='error'>{error?.item_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Unit / Area <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name='unit' value={issue?.unit} readOnly />
                                                    <div className='error'>{error?.unit_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Profile <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" onChange={handleChange}
                                                        name='profile' value={issue?.profile} readOnly />
                                                    <div className='error'>{error?.profile_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Request Qty.</label>
                                                    <input className="form-control" type="number" onChange={handleChange}
                                                        name='requested_qty' value={issue?.requested_qty}
                                                        readOnly />
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Issue Qty.</label>
                                                    <input className="form-control" type="number" onChange={handleChange}
                                                        name='issue_qty' value={issue?.issue_qty} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Contractor Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        name='contractor_name' value={issue.contractor_name} onChange={handleChange} />
                                                    <div className='error'>{error?.contractor_name_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Date <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="date" onChange={handleChange} name='date' value={issue?.date} />
                                                    <div className="error">{error.date_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Issue Length <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number" onChange={handleChange} name='issue_length' value={issue?.issue_length} />
                                                    <div className="error">{error.issue_length_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Heat No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number" onChange={handleChange} name='heat_no' value={issue?.heat_no} />
                                                    <div className="error">{error.heat_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12">
                                                <div className="input-block local-forms">
                                                    <label> Remark</label>
                                                    <textarea className="form-control" name="remark"
                                                        value={issue.remark} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-sm-12">
                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}> {disable ? 'Processing...' : 'Submit'}</button>
                                                <button type="button"
                                                    className="btn btn-primary cancel-form" >Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        </div >
    )
}

export default ManageIssue