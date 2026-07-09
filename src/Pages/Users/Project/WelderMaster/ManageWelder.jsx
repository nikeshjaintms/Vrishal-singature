import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { MultiSelect } from 'primereact/multiselect';

const ManageWelder = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [welder, setWelder] = useState({ wpsNo: '', welderNo: '', name: '', due_date: '', position: '', thickness: '', pdf: '' });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const data = location.state;
    const [selectValue, setSelectValue] = useState('');
    const [jointData, setJointData] = useState([]);
    const [selectedJointType, setSelectedJointType] = useState([]);

    useEffect(() => {
        if (location.state) {
            setWelder({
                wpsNo: location.state?.wpsNo?._id,
                welderNo: location.state?.welderNo,
                name: location.state?.name,
                due_date: moment(location.state?.due_date).format('YYYY-MM-DD') || '',
                position: location.state?.position,
                thickness: location.state?.thickness,
                pdf: location.state?.pdf,
            });
            setSelectValue(location.state?.status);
            setSelectedJointType(data?.jointType?.map(jt => ({
                jointId: jt?.jointId?._id || jt
            })));
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(getUserWpsMaster({ status: true }));
    }, [dispatch]);

    const wpsData = useSelector((state) => state.getUserWpsMaster?.user?.data);

    useEffect(() => {
        const filterData = wpsData?.find((wp) => wp._id === welder.wpsNo);
        setJointData(filterData?.jointType);
    }, [wpsData, welder.wpsNo]);

    const handleChange = (e) => {
        setWelder({ ...welder, [e.target.name]: e.target.value });
    }

    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    }

    const handleJointType = (e) => {
        console.log(e, 'handleJointType')
        setSelectedJointType(e.target.value);
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
                        setWelder({ ...welder, pdf: data });
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
            const myurl = `${V_URL}/user/manage-qualified-welder`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('wpsNo', welder.wpsNo);
            bodyFormData.append('welderNo', welder.welderNo);
            bodyFormData.append('name', welder.name);
            bodyFormData.append('due_date', welder.due_date);
            bodyFormData.append('position', welder.position);
            bodyFormData.append('thickness', welder.thickness);
            bodyFormData.append('pdf', welder.pdf);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('jointType', JSON.stringify(selectedJointType));
            if (data?._id) {
                bodyFormData.append('id', data._id);
                bodyFormData.append('status', selectValue);
            }
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    navigate('/user/project-store/welder-management')
                    toast.success(response.data.message);
                    handleReset();
                } else {
                    toast.error(response.data.message);
                }
                setDisable(false);
            }).catch((error) => {
                // console.log(error, '!!');
                toast.error(error?.response?.data?.message || 'Something went wrong')
                setDisable(false);
            })
        }
    }

    const handleReset = () => {
        setWelder({ wpsNo: '', welderNo: '', name: '', due_date: '', position: '', thickness: '' });
        setSelectedJointType([]);
    }

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!welder.wpsNo) {
            isValid = false;
            err['wpsNo_err'] = 'Please select wps no.'
        }
        if (!welder.welderNo || !welder?.welderNo?.trim()) {
            isValid = false;
            err['welderNo_err'] = 'Please enter welder no.'
        }
        if (!welder.name || !welder.name?.trim()) {
            isValid = false;
            err['name_err'] = 'Please enter name'
        }
        if (!welder.due_date) {
            isValid = false;
            err['due_date_err'] = 'Please select a due date';
        } else if (new Date(welder.due_date) < new Date().setHours(0, 0, 0, 0)) {
            isValid = false;
            err['due_date_err'] = 'Please select today or a future date';
        }
        if (!welder.position || !welder.position?.trim()) {
            isValid = false;
            err['position_err'] = 'Please enter position'
        }
        if (!welder.thickness || !welder.thickness?.trim()) {
            isValid = false;
            err['thickness_err'] = 'Please enter thickness'
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    console.log(selectedJointType, 'a', jointData)

    const jointOptions = jointData?.map((n) => ({
        label: n?.jointId?.name,
        value: n?.jointId?._id
    }));

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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/user/project-store/welder-management">Qualified Welder List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Qualified Welder</li>
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
                                                <h4>{data?._id ? 'Edit' : 'Add'} Qualified Welder Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-8 col-xl-8">
                                                <div className="input-block local-forms">
                                                    <label> Joint - WPS No. - Welding Process<span className="login-danger">*</span></label>
                                                    <select className="form-control form-select" name='wpsNo'
                                                        onChange={handleChange} value={welder.wpsNo} >
                                                        <option value=''>Select WPS No.</option>
                                                        {wpsData?.map((e) =>
                                                            <option value={e?._id} key={e?._id}>{`${e?.jointType?.map((e, i) => `${e?.jointId?.name}`).join(', ')} - ${e?.wpsNo} - ${e?.weldingProcess}`}</option>
                                                        )}
                                                    </select>
                                                    <div className='error'>{error?.wpsNo_err}</div>
                                                </div>
                                            </div>

                                            {welder?.wpsNo && (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Joint Type<span className="login-danger">*</span></label>
                                                        {/* <select type="text" className="form-control form-select" name='jointType'
                                                            onChange={handleChange} value={welder.jointType}>
                                                            <option value="">Select Joint Type</option>
                                                            {jointData?.map((e, i) =>
                                                                <option value={e?.jointId?._id} key={i}>{e?.jointId?.name}</option>
                                                            )}
                                                        </select> */}
                                                        <MultiSelect
                                                            value={selectedJointType?.map(s => s.jointId)}
                                                            onChange={(e) => handleJointType({
                                                                target: {
                                                                    name: 'jointId',
                                                                    value: e.value.map(id => ({ jointId: id }))
                                                                }
                                                            })}
                                                            options={jointOptions}
                                                            optionLabel="label"
                                                            placeholder="Select Joint Type"
                                                            display="chip"
                                                            className="w-100 multi-prime-react"
                                                        />
                                                        <div className='error'>{error?.jointType}</div>
                                                    </div>
                                                </div>
                                            )}


                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Welder No.<span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='welderNo'
                                                        onChange={handleChange} value={welder.welderNo} />
                                                    <div className='error'>{error?.welderNo_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Name<span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='name'
                                                        onChange={handleChange} value={welder.name} />
                                                    <div className='error'>{error?.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Position<span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='position'
                                                        onChange={handleChange} value={welder.position} />
                                                    <div className='error'>{error?.position_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Thickness<span className="login-danger">*</span></label>
                                                    <input type="text" className="form-control" name='thickness'
                                                        onChange={handleChange} value={welder.thickness} />
                                                    <div className='error'>{error?.thickness_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Due Date<span className="login-danger">*</span></label>
                                                    <input type="date" className="form-control" name='due_date'
                                                        onChange={handleChange} value={welder.due_date} />
                                                    <div className='error'>{error?.due_date_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">WPQ PDF</label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                                        <input type="file" id="pdfFile" onChange={handlePdf} accept=".pdf" className="hide-input" />
                                                    </div>
                                                    <div className='error'>{error.pdf_err}</div>
                                                    {welder.pdf ? (
                                                        <a href={welder.pdf} target='_blank' rel="noreferrer">
                                                            <img src='/assets/img/pdflogo.png' alt='pdf-welder' />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {data?._id ? (
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="cardNum">
                                                        <div className="mb-3">
                                                            <label htmlFor="fileUpload" className="form-label">Status</label>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" role="switch"
                                                                    onChange={handleRadioChange} checked={selectValue} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
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
            </div >
        </div >
    )
}

export default ManageWelder