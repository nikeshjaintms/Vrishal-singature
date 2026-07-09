import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Include/Footer';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserFinalDimension } from '../../../../Store/Store/Execution/getUserFinalDimension';
import moment from 'moment';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const QFinalDimension = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [qFinal, setQFinal] = useState({ drawNo: '' });
    const [qFinalObj, setQFinalObj] = useState({});
    const [status, setStatus] = useState(null);
    const [otherVal, setOtherVal] = useState({ actualDimension: '', qc_remark: '' });
    const [drawingFilter, setDrawingFilter] = useState([]);

    const data = location.state;

    useEffect(() => {
        if (data) {
            setQFinal({ drawNo: data.drawing_id?._id });
        }
    }, [data])

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getUserFinalDimension({ status: 1 }));
    }, [dispatch]);

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const finalDimensionData = useSelector((state) => state?.getUserFinalDimension?.user?.data);

    useEffect(() => {
        const findFinal = finalDimensionData?.find(dimension => dimension.drawing_id?._id === qFinal.drawNo);
        setQFinalObj(findFinal);
    }, [drawData, finalDimensionData, qFinal.drawNo]);

    useEffect(() => {
        const filteredDrawData = drawData?.filter(drawing =>
            finalDimensionData?.some(dimension => dimension.drawing_id?._id === drawing._id)
        );
        setDrawingFilter(filteredDrawData);
    }, [drawData, finalDimensionData]);

    const handleChange = (e, name) => {
        setQFinal({ ...qFinal, [name]: e.value });
    }
    const handleChange2 = (e) => {
        setOtherVal({ ...otherVal, [e.target.name]: e.target.value });
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/get-final-dimension-approval`;
            const formData = new URLSearchParams();
            formData.append('actual_dimension', otherVal.actualDimension);
            formData.append('qc_remarks', otherVal.qc_remark);
            formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            formData.append('qc_status', status);
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('drawing_id', qFinal.drawNo);
            formData.append('id', qFinalObj?._id);

            axios({
                method: "post",
                url: myurl,
                data: formData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response?.data?.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/user/project-store/final-dimension-clearance-management');
                } else {
                    toast.error(response?.data?.message);
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
                setDisable(false);
            })

        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!qFinal.drawNo) {
            isValid = false;
            err['drawNo_err'] = "Please select drawing no.";
        } else if (!qFinalObj?._id) {
            isValid = false;
            err['drawNo_err'] = "Drawing no. not found in final dimension offer";
        }
        if (!otherVal.actualDimension) {
            isValid = false;
            err['actualDimension_err'] = "Please enter actual dimension";
        }
        if (status === null) {
            isValid = false;
            err['status_err'] = "Please select approval status";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = drawingFilter?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

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
                                    <li className="breadcrumb-item active">Final Dimension Inspection Report List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>Manage Final Dimension Inspection Report Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={drawOptions}
                                                        value={qFinal.drawNo}
                                                        onChange={(e) => handleChange(e, 'drawNo')}
                                                        filter className='w-100'
                                                        placeholder="Select Drawing No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.drawNo_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {qFinalObj?._id ? (
                                            <>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Client </label>
                                                            <input
                                                                className='form-control'
                                                                value={qFinalObj?.drawing_id?.project?.party?.name || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Work Order / PO No. </label>
                                                            <input
                                                                className='form-control'
                                                                value={qFinalObj?.drawing_id.project?.work_order_no || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-12 col-md-4 col-xl-4'>
                                                        <div className="input-block local-forms">
                                                            <label>Final Dimension Offer Report No. </label>
                                                            <input className='form-control'
                                                                value={qFinalObj?.report_no || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-md-4 col-xl-4'>
                                                        <div className="input-block local-forms">
                                                            <label>Final Dimension Offer Date </label>
                                                            <input className='form-control'
                                                                value={moment(qFinalObj?.report_date).format('YYYY-MM-DD') || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='col-12'>
                                                        <div className="input-block local-forms">
                                                            <label>Final Dimension Offer Remarks </label>
                                                            <textarea className='form-control' value={qFinalObj?.remarks || '-'} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>REV </label>
                                                            <input
                                                                className='form-control'
                                                                value={qFinalObj?.drawing_id?.rev || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Sheet No. </label>
                                                            <input
                                                                className='form-control'
                                                                value={qFinalObj?.drawing_id?.sheet_no || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Assembly No. </label>
                                                            <input
                                                                className='form-control'
                                                                value={qFinalObj?.drawing_id?.assembly_no || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Required Dimensions </label>
                                                            <input
                                                                className='form-control'
                                                                value={qFinalObj?.required_dimension || ''}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Actual Dimensions <span className="login-danger">*</span></label>
                                                            <input className='form-control' value={otherVal.actualDimension}
                                                                onChange={handleChange2} name='actualDimension'
                                                            />
                                                            <div className='error'>{error?.actualDimension_err}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div class="input-block select-gender">
                                                            <label class="gen-label">Status <span className="login-danger">*</span></label>
                                                            <div class="form-check-inline">
                                                                <label class="form-check-label">
                                                                    <input type="radio" name="status"
                                                                        value="accept"
                                                                        className="form-check-input" checked={status === true}
                                                                        onChange={handleStatusChange} />Accept
                                                                </label>
                                                            </div>
                                                            <div class="form-check-inline">
                                                                <label class="form-check-label">
                                                                    <input type="radio" name="status" value="reject"
                                                                        checked={status === false}
                                                                        onChange={handleStatusChange}
                                                                        className="form-check-input" />Reject
                                                                </label>
                                                            </div>
                                                            <div className='error'>{error?.status_err}</div>
                                                        </div>
                                                    </div>
                                                    <div className='col-12'>
                                                        <div className="input-block local-forms">
                                                            <label>Report Remarks </label>
                                                            <textarea className='form-control' value={otherVal.qc_remark}
                                                                onChange={handleChange2} name='qc_remark' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                disabled={disable}>{disable ? "Processing..." : "Generate Final Dimension Report"}</button>
                                        </div>
                                    </div>
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

export default QFinalDimension