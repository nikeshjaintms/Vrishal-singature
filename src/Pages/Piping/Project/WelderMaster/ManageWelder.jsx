import React, { useEffect, useState } from 'react';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserWpsMasterPiping } from '../../../../Store/Piping/WpsMaster/WpsMaster';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { MultiSelect } from 'primereact/multiselect';

const ManageWelder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    // Initial state including weldingProcess and pdf
    const [welder, setWelder] = useState({
        wpsNo: '',
        welderNo: '',
        name: '',
        due_date: '',
        MaximumThickness: '',
        MinimumThickness:'',
        weldingProcess: '',
        PipingMaterialSpecification:'',
        QualifiedDiametermin:'',
        QualifiedDiametermax:'',
        pdf: '',
    });

    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const data = location.state;
    const [selectValue, setSelectValue] = useState(false);
    const [jointData, setJointData] = useState([]);
    const [selectedJointType, setSelectedJointType] = useState([]);

    useEffect(() => {
        if (data) {
            setWelder({
                wpsNo: data?.wpsNo?._id || '',
                welderNo: data?.welderNo || '',
                name: data?.name || '',
                due_date: data?.due_date ? moment(data.due_date).format('YYYY-MM-DD') : '',
                MaximumThickness: data?.MaximumThickness || '',
                MinimumThickness: data?.MinimumThickness || '',
                weldingProcess: data?.weldingProcess || '',
                 PipingMaterialSpecification: data?.PipingMaterialSpecification || {},
                QualifiedDiametermin: data?.QualifiedDiametermin || '',
                QualifiedDiametermax: data?.QualifiedDiametermax || '',
                pdf: data?.pdf || '',
            });
            setSelectValue(data?.status || false);
            setSelectedJointType(
                data?.jointType?.map(jt => ({ jointId: jt?.jointId?._id || jt })) || []
            );
        }
    }, [data]);

    useEffect(() => {
        dispatch(getUserWpsMasterPiping({ status: "all" }));
    }, [dispatch]);

    const wpsData = useSelector((state) => state.getUserWpsMasterPiping?.data);

    useEffect(() => {
        const filterData = wpsData?.find(wp => wp._id === welder.wpsNo);
        setJointData(filterData?.jointType || []);
    }, [wpsData, welder.wpsNo]);



    const handleChange = (e) => {
        const { name, value } = e.target; // define name and value first

        if (name === "wpsNo") {
            // Find the selected WPS in your wpsData list
            const selectedWps = wpsData?.find((wps) => wps._id === value);

            setWelder((prev) => ({
                ...prev,
                wpsNo: value,
                weldingProcess: selectedWps?.weldingProcess || "",
                PipingMaterialSpecification: selectedWps?.PipingMaterialSpecification || {},
            }));

            // Update joint data dynamically
            setJointData(selectedWps?.jointType || []);
            return;
        }

        // For other fields, just update normally
        setWelder({
            ...welder,
            [name]: value,
        });
    };



    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleJointType = (e) => {
        setSelectedJointType(e.value.map(id => ({ jointId: id })));
    };

    const handlePdf = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["application/pdf"];
            const fileType = e.target.files[0].type;
            if (allowedTypes.includes(fileType)) {
                setDisable(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append('image', e.target.files[0]);
                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            const pdfUrl = response?.data?.data?.pdf;
                            setWelder(prev => ({ ...prev, pdf: pdfUrl }));
                            toast.success("PDF uploaded successfully");
                        }
                        setDisable(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        toast.error(error.response?.data?.message || "Upload failed");
                        setDisable(false);
                    });
            } else {
                toast.error("Invalid file type. Only PDFs are allowed.");
            }
        }
    };


    const validation = () => {
        let isValid = true;
        let err = {};

        if (!welder.name || !welder.name.trim()) {
            isValid = false;
            err['name_err'] = 'Please enter Welder Name.';
        }
        if (!welder.welderNo || !welder.welderNo.trim()) {
            isValid = false;
            err['welderNo_err'] = 'Please enter Welder No.';
        }
        if (!welder.wpsNo) {
            isValid = false;
            err['wpsNo_err'] = 'Please select WPS No.';
        }
        if (!welder.MinimumThickness && welder.MinimumThickness !== 0) {
            isValid = false;
            err['MinimumThickness_err'] = 'Please enter Minimum Thickness.';
        } else if (isNaN(welder.MinimumThickness)) {
            isValid = false;
            err['MinimumThickness_err'] = 'Minimum Thickness must be a number.';
        }

        if (!welder.MaximumThickness && welder.MaximumThickness !== 0) {
            isValid = false;
            err['MaximumThickness_err'] = 'Please enter Maximum Thickness.';
        } else if (isNaN(welder.MaximumThickness)) {
            isValid = false;
            err['MaximumThickness_err'] = 'Maximum Thickness must be a number.';
        }
        if (!welder.weldingProcess || !welder.weldingProcess.trim()) {
            isValid = false;
            err['weldingProcess_err'] = 'Please enter Welding Process.';
        }
        if(!welder.PipingMaterialSpecification?._id) {
            isValid = false;
            err['PipingMaterialSpecification_err'] = 'Please enter Piping Material Specification.';
        }
        if (!welder.QualifiedDiametermin || !welder.QualifiedDiametermin.trim()) {
            isValid = false;
            err['QualifiedDiametermin_err'] = 'Please enter Qualified Diameter Minimum.';
        }
        if (!welder.QualifiedDiametermax || !welder.QualifiedDiametermax.trim()) {
            isValid = false;
            err['QualifiedDiametermax_err'] = 'Please enter Qualified Diameter Maximum.';
        }
        if (!selectedJointType.length) {
            isValid = false;
            err['jointType_err'] = 'Please select at least one Joint Type.';
        }
        if (!welder.due_date) {
            isValid = false;
            err['due_date_err'] = 'Please select a Due Date.';
        } else if (new Date(welder.due_date) < new Date().setHours(0, 0, 0, 0)) {
            isValid = false;
            err['due_date_err'] = 'Please select today or a future date.';
        }
        // if (!welder.pdf) {
        //     isValid = false;
        //     err['pdf_err'] = 'Please upload WPQ PDF.';
        // }

        setError(err);
        return isValid;
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-welder`;
            const bodyFormData = new URLSearchParams();

            bodyFormData.append('name', welder.name);
            bodyFormData.append('welderNo', welder.welderNo);
            bodyFormData.append('wpsNo', welder.wpsNo);
            bodyFormData.append('MinimumThickness', welder.MinimumThickness);
            bodyFormData.append('MaximumThickness', welder.MaximumThickness);
            bodyFormData.append('weldingProcess', welder.weldingProcess);
            bodyFormData.append('PipingMaterialSpecification', welder.PipingMaterialSpecification?._id);
            bodyFormData.append('QualifiedDiametermin', welder.QualifiedDiametermin);
            bodyFormData.append('QualifiedDiametermax', welder.QualifiedDiametermax);
            bodyFormData.append('due_date', welder.due_date);
            bodyFormData.append('pdf', welder.pdf);
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('jointType', JSON.stringify(selectedJointType));
console.log("bodyFormData", bodyFormData.toString());
            if (data?._id) {
                bodyFormData.append('_id', data._id);  // send correct field
                bodyFormData.append('status', selectValue);
            }


            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            })
                .then((response) => {
                    if (response.data.success === true) {
                        toast.success(response.data.message);
                        navigate('/piping/user/welder-management');
                        handleReset();
                    } else {
                        toast.error(response.data.message);
                    }
                    setDisable(false);
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.message || 'Something went wrong');
                    setDisable(false);
                });
        }
    };

    const handleReset = () => {
        setWelder({
            name: '',
            welderNo: '',
            wpsNo: '',
            MinimumThickness: '',
            MaximumThickness: '',
            weldingProcess: '',
            PipingMaterialSpecification:'',
            QualifiedDiametermin:'',
            QualifiedDiametermax:'',
            due_date: '',
            pdf: '',
        });
        setSelectedJointType([]);
        setError({});
    };


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const jointOptions = jointData?.map(n => ({
        label: n?.jointId?.name,
        value: n?.jointId?._id,
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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/welder-management">Qualified Welder List</Link></li>
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

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Welder Name<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='name'
                                                        onChange={handleChange}
                                                        value={welder.name}
                                                    />
                                                    <div className='error'>{error?.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Welder No.<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='welderNo'
                                                        onChange={handleChange}
                                                        value={welder.welderNo}
                                                    />
                                                    <div className='error'>{error?.welderNo_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>WPS No.<span className="login-danger">*</span></label>
                                                    <select className="form-control form-select" name='wpsNo' onChange={handleChange} value={welder.wpsNo} >
                                                        <option value=''>Select WPS No.</option>
                                                        {wpsData?.map((e) =>
                                                            // <option key={e?._id} value={e?._id}> {e?.wpsNo} </option>
                                                            <option key={e?._id} value={e?._id}>
    {e?.wpsNo} | PMS: {e?.PipingMaterialSpecification?.name || "N/A"}
</option>
                                                        )}
                                                    </select>
                                                    <div className='error'>{error?.wpsNo_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Piping Material Specification<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='PipingMaterialSpecification'
                                                        onChange={handleChange}
                                                        value={welder.PipingMaterialSpecification?.name}
                                                    />
                                                    <div className='error'>{error?.PipingMaterialSpecification_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Minimum Thickness (mm)<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='MinimumThickness'
                                                        onChange={handleChange}
                                                        value={welder.MinimumThickness}
                                                    />
                                                    <div className='error'>{error?.MinimumThickness_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Maximum Thickness (mm)<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='MaximumThickness'
                                                        onChange={handleChange}
                                                        value={welder.MaximumThickness}
                                                    />
                                                    <div className='error'>{error?.MaximumThickness_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Welding Process<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='weldingProcess'
                                                        onChange={handleChange}
                                                        value={welder.weldingProcess}
                                                    />
                                                    <div className='error'>{error?.weldingProcess_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Qualified Diameter Minimum (inch)<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='QualifiedDiametermin'
                                                        onChange={handleChange}
                                                        value={welder.QualifiedDiametermin}
                                                    />
                                                    <div className='error'>{error?.QualifiedDiametermin_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Qualified Diameter Maximum (inch)<span className="login-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='QualifiedDiametermax'
                                                        onChange={handleChange}
                                                        value={welder.QualifiedDiametermax}
                                                    />
                                                    <div className='error'>{error?.QualifiedDiametermax_err}</div>
                                                </div>
                                            </div>

                                            {welder?.wpsNo && (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Joint Type<span className="login-danger">*</span></label>
                                                        <MultiSelect
                                                            value={selectedJointType.map(s => s.jointId)}
                                                            onChange={handleJointType}
                                                            options={jointOptions}
                                                            optionLabel="label"
                                                            placeholder="Select Joint Type"
                                                            display="chip"
                                                            className="w-100 multi-prime-react"
                                                        />
                                                        <div className='error'>{error?.jointType_err}</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Due Date<span className="login-danger">*</span></label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name='due_date'
                                                        onChange={handleChange}
                                                        value={welder.due_date}
                                                    />
                                                    <div className='error'>{error?.due_date_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">WPQ PDF</label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                                        <input
                                                            type="file"
                                                            id="pdfFile"
                                                            onChange={handlePdf}
                                                            accept=".pdf"
                                                            className="hide-input"
                                                            disabled={disable}
                                                        />
                                                    </div>
                                                    {/* <div className='error'>{error.pdf_err}</div> */}
                                                    {welder.pdf && (
                                                        <a href={welder.pdf} target='_blank' rel="noreferrer">
                                                            <img src='/assets/img/pdflogo.png' alt='pdf-welder' style={{ width: 30 }} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {data?._id && (
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="cardNum">
                                                        <div className="mb-3">
                                                            <label htmlFor="fileUpload" className="form-label">Status</label>
                                                            <div className="form-check form-switch">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    role="switch"
                                                                    onChange={handleRadioChange}
                                                                    checked={selectValue}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                        <div className="col-12 text-end mt-3">
                                            <div className="doctor-submit text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary submit-form me-2"
                                                    onClick={handleSubmit}
                                                    disabled={disable}
                                                >
                                                    {disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary cancel-form"
                                                    onClick={handleReset}
                                                    disabled={disable}
                                                >
                                                    Reset
                                                </button>
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
    );
};

export default ManageWelder;
