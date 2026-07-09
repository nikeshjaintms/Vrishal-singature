import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserNdtOffer } from '../../../../Store/Store/Ndt/NdtOffer';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';

const UtClearance = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [ut, setUt] = useState({ drawNo: '', offerNo: '', procedure: "" });
    const [utForm, setUtForm] = useState({
        testDate: '', accStandard: '', surface_condition: '', extent_examination: '',
        examination_stage: '', examination_surface: '', technique: '', basic_block: '', equipment_model: '', ref_block: '', equipment_no: '', scan_level: '', couplant: '', ref_level: '',
        search_unit: '', test_range: '', model: '', ref_db: '', wave_mode: '', trans_cor: '', freq: '', refer_angle: ''
    });
    const [status, setStatus] = useState(null);
    const [error, setError] = useState({});
    const [tableData, setTableData] = useState([]);
    const [filterUt, setFilterUt] = useState([]);
    const [utObj, setUtObj] = useState({});
    const [disable, setDisable] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [reject, setReject] = useState({
        reject_stage: '',
        reject_remarks: '',
    });
    const [utDraw, setUtDraw] = useState([]);


    const data = location.state;

    useEffect(() => {
        if (location.state?._id) {
            setUt({
                drawNo: location.state?.items[0]?.transaction_id?.drawingId?._id,
                offerNo: location.state?.ndt_offer_no?._id,
                procedure: location.state?.procedure_no?._id,
            })
            setUtForm({
                testDate: moment(location.state?.test_date).format('YYYY-MM-DD'),
                accStandard: location.state?.accept_standard,
                surface_condition: location.state?.surface_condition,
                extent_examination: location.state?.extent_examination,
                examination_stage: location.state?.examination_stage,
                examination_surface: location.state?.examination_surface,
                technique: location.state?.technique,
                basic_block: location.state?.basic_cal_block,
                equipment_model: location.state?.equip_model,
                ref_block: location.state?.ref_block_id,
                equipment_no: location.state?.equip_no,
                scan_level: location.state?.scanning_senstive_level,
                couplant: location.state?.couplant,
                ref_level: location.state?.ref_sensitivity_level,
                search_unit: location.state?.search_unit_no,
                test_range: location.state?.test_range,
                model: location.state?.model,
                ref_db: location.state?.ref_db,
                wave_mode: location.state?.wave_mode,
                trans_cor: location.state?.trans_corr,
                freq: location.state?.frequency,
                refer_angle: location.state?.refer_angle,
            });
            setTableData(location.state?.items);
            setStatus(location.state?.qc_status);
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
        dispatch(getDrawing());
        dispatch(getUserNdtMaster({ status: '' }))
            .then((response) => {
                const ndtData = response.payload?.data;
                const findNdt = ndtData?.find((nt) => nt?.name === 'UT');
                if (findNdt) {
                    dispatch(getUserNdtOffer({ status: '', type: findNdt._id }));
                }
            }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [dispatch]);

    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);
    const drawData = useSelector(state => state.getDrawing?.user?.data?.data);
    const ndtOfferData = useSelector(state => state.getUserNdtOffer?.user?.data);


    useEffect(() => {
        const checkStatus = ndtOfferData?.filter(st => st.status === 4);

        const utIds = checkStatus?.map((u) => u?.drawing_id);
        const matchIds = drawData?.filter(id => utIds?.includes(id?._id) && id?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setUtDraw(matchIds || []);

        const matchDrawing = checkStatus?.filter(dr => dr?.items?.some(it => it?.transaction_id?.drawingId?._id === ut.drawNo));
        if (data?._id) {
            setFilterUt(ndtOfferData);
            const findUt = ndtOfferData?.find(dr => dr._id === ut.offerNo);
            setUtObj(findUt);
        } else {
            setFilterUt(matchDrawing);
            if (matchDrawing?.length > 0) {
                const findUt = matchDrawing?.find(dr => dr._id === ut.offerNo);
                setUtObj(findUt);
                setTableData(findUt?.items || []);
            } else {
                setUt((prevUt) => ({ ...prevUt, offerNo: '' }));
            }
        }
    }, [drawData, ut.drawNo, ut.offerNo, ndtOfferData, data?._id]);

    const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
        let filteredData = data;
        if (searchTerm) {
            filteredData = filteredData.filter(
                (i) =>
                    i?.transaction_id?.itemName?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            );
        }
        setTotalItems(filteredData?.length);
        return filteredData?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    };

    const commentsData = useMemo(() => filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
        [currentPage, search, limit, tableData]);

    const handleChange = (e, name) => {
        setUt({ ...ut, [name]: e.value });
    }

    const handleChange2 = (e) => {
        setUtForm({ ...utForm, [e.target.name]: e.target.value });
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        qc_remarks: '',
        disc_type: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            qc_remarks: row.qc_remarks,
            disc_type: row.disc_type
        });
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    }

    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const getJointTypes = (transactionId) => {
        const fitupItems = utObj?.ndt_master_id?.weld_inspection_id?.fitup_id?.items || [];
        const match = fitupItems.find(item => item.transaction_id === transactionId);
        return match?.joint_type?.map(joint => joint.name).join(", ") || "-";
    }

    const handleSubmit = () => {
        if (validation()) {
            let updatedData = tableData;
            let isValid = true;

            updatedData.forEach(item => {
                if (item.disc_type === '' || item.disc_type === undefined) {
                    isValid = false;
                    toast.error(`Please enter disk type for ${item.transaction_id.itemName.name}`);
                }
            });

            if (!isValid) {
                return;
            }

            const filteredData = updatedData.map(item => ({
                transaction_id: item.transaction_id?._id,
                weldor_no: item.weldor_no?._id,
                thickness: item.thickness,
                item_status: item.item_status,
                remarks: item.remarks,
                qc_remarks: item.qc_remarks,
                disc_type: item.disc_type,
            }));

            setDisable(true);
            const myurl = `${V_URL}/user/manage-ut-report`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', ut.offerNo);
            bodyFormData.append('procedure_no', ut.procedure);
            bodyFormData.append('test_date', utForm.testDate);
            bodyFormData.append('accept_standard', utForm.accStandard);
            bodyFormData.append('surface_condition', utForm.surface_condition)
            bodyFormData.append('extent_examination', utForm.extent_examination);
            bodyFormData.append('examination_stage', utForm.examination_stage);
            bodyFormData.append('examination_surface', utForm.examination_surface);
            bodyFormData.append('technique', utForm.technique);
            bodyFormData.append('basic_cal_block', utForm.basic_block);
            bodyFormData.append('equip_model', utForm.equipment_model);
            bodyFormData.append('ref_block_id', utForm.ref_block);
            bodyFormData.append('equip_no', utForm.equipment_no);
            bodyFormData.append('scanning_senstive_level', utForm.scan_level);
            bodyFormData.append('couplant', utForm.couplant);
            bodyFormData.append('ref_sensitivity_level', utForm.ref_level);
            bodyFormData.append('search_unit_no', utForm.search_unit);
            bodyFormData.append('test_range', utForm.test_range);
            bodyFormData.append('model', utForm.model);
            bodyFormData.append('ref_db', utForm.ref_db);
            bodyFormData.append('wave_mode', utForm.wave_mode);
            bodyFormData.append('trans_corr', utForm.trans_cor);
            bodyFormData.append('frequency', utForm.freq);
            bodyFormData.append('refer_angle', utForm.refer_angle);
            bodyFormData.append('qc_status', status);
            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
            bodyFormData.append('items', JSON.stringify(filteredData));
            bodyFormData.append('drawing_id', ut.drawNo);

            if (data?._id) {
                bodyFormData.append('id', data._id);
            }

            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/ut-clearance-management');
                }
                setDisable(false);
            }).catch((error) => {
                toast.error("Something went wrong." || error.response.data?.message);
                setDisable(false);
            });
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!ut.drawNo) {
            isValid = false;
            err['drawNo_err'] = 'Please select drawing no.';
        }
        if (ut.drawNo) {
            if (!ut.offerNo) {
                isValid = false;
                err['offerNo_err'] = "Please select offer";
            }
        }
        if (!ut.procedure) {
            isValid = false;
            err['procedure_err'] = "Please select procedure no.";
        }
        if (!utForm.testDate) {
            isValid = false;
            err['testDate_err'] = "Please select test date";
        }
        if (!utForm.accStandard || utForm.accStandard.trim() === '') {
            isValid = false;
            err['accStandard_err'] = "Please enter acceptance standard";
        }
        if (status === null) {
            isValid = false;
            err['status_err'] = "Please select status";
        }

        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = utDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

    const offerOptions = filterUt?.map(ut => ({
        label: ut?.ndt_offer_no,
        value: ut?._id
    }));

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
    }))

    const rejectOptions = [
        { label: 'REGENERATE OFFER', value: 'regenerate' },
        { label: 'SEND TO WELD VISUAL STAGE', value: 'weld-visual' },
    ];

    const handleReject = (e, name) => {
        setReject({ ...reject, [name]: e.value });
    };


    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    {/* <NdtOfferHeader name={'Ultrasonic Test Clearance Details'} /> */}

                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/ut-clearance-management">Ultrasonic Test Clearance List</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Ultrasonic Test Clearance
                                    </li>
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
                                                <h4>Manage Weld Visual Inspection Report Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={drawOptions}
                                                        value={ut.drawNo}
                                                        onChange={(e) => handleChange(e, 'drawNo')}
                                                        filter className='w-100'
                                                        placeholder="Select Drawing No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.drawNo_err}</div>
                                                </div>
                                            </div>
                                            {ut.drawNo && (
                                                <div className='col-12 col-md-6 col-xl-6'>
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Ultrasonic Test Offer No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={offerOptions}
                                                            value={ut.offerNo}
                                                            onChange={(e) => handleChange(e, 'offerNo')}
                                                            filter className='w-100'
                                                            placeholder="Select Ultrasonic Test Offer No."
                                                            disabled={data?._id}
                                                        />
                                                        <div className='error'>{error?.offerNo_err}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {ut?.offerNo ? (
                                            <>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Client </label>
                                                            <input className='form-control' value={utObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-md-4 col-xl-4'>
                                                        <div className="input-block local-forms">
                                                            <label>Work Order / PO No.</label>
                                                            <input className='form-control' value={utObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>REV </label>
                                                            <input className='form-control' value={utObj?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Sheet No. </label>
                                                            <input className='form-control' value={utObj?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Assembly No. </label>
                                                            <input className='form-control' value={utObj?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}

                                        <div className='row'>
                                            <div className='col-12 col-md-6 col-xl-6'>
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Procedure No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={procedureOptions}
                                                        value={ut.procedure}
                                                        onChange={(e) => handleChange(e, 'procedure')}
                                                        filter className='w-100'
                                                        placeholder="Select Procedure No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.procedure_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className="input-block local-forms">
                                                    <label>Test Date <span className="login-danger">*</span></label>
                                                    <input className='form-control' type='date' name='testDate'
                                                        value={utForm.testDate} onChange={handleChange2}
                                                        readOnly={data?._id}
                                                    />
                                                    <div className='error'>{error?.testDate_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className="input-block local-forms">
                                                    <label>Acceptance Standard <span className="login-danger">*</span></label>
                                                    <input className='form-control' type='text' name='accStandard'
                                                        value={utForm.accStandard} onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.accStandard_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
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
                                                <h4>Test Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Surface Condition </label>
                                                    <input className='form-control' type='text' value={utForm.surface_condition}
                                                        name='surface_condition' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.surface_condition_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Extent Of Examination </label>
                                                    <input className='form-control' type='text' value={utForm.extent_examination}
                                                        name='extent_examination' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.extent_examination_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Examination Stage</label>
                                                    <input className='form-control' type='text' value={utForm.examination_stage}
                                                        name='examination_stage' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.examination_stage_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Examination Surface</label>
                                                    <input className='form-control' type='text' value={utForm.examination_surface}
                                                        name='examination_surface' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.examination_surface_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Technique</label>
                                                    <input className='form-control' type='text' value={utForm.technique}
                                                        name='technique' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.technique_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Basic Cal. Block</label>
                                                    <input className='form-control' type='text' value={utForm.basic_block}
                                                        name='basic_block' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.basic_block_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Equipment Modal & Make</label>
                                                    <input className='form-control' type='text' value={utForm.equipment_model}
                                                        name='equipment_model' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.equipment_model_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Reference Block Id</label>
                                                    <input className='form-control' type='text' value={utForm.ref_block}
                                                        name='ref_block' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.ref_block_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Equipment No.</label>
                                                    <input className='form-control' type='text' value={utForm.equipment_no}
                                                        name='equipment_no' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.equipment_no_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Scanning Sensitivity Level</label>
                                                    <input className='form-control' type='text' value={utForm.scan_level}
                                                        name='scan_level' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.scan_level_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Couplaint</label>
                                                    <input className='form-control' type='text' value={utForm.couplant}
                                                        name='couplant' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.couplant_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Ref. Sensitivity Level</label>
                                                    <input className='form-control' type='text' value={utForm.ref_level}
                                                        name='ref_level' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.ref_level_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
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
                                                <h4>Calibration Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Search Unit SR. No.</label>
                                                    <input className='form-control' type='text' value={utForm.search_unit}
                                                        name='search_unit' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.search_unit_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Test Range</label>
                                                    <input className='form-control' type='text' value={utForm.test_range}
                                                        name='test_range' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.test_range_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Model</label>
                                                    <input className='form-control' type='text' value={utForm.model}
                                                        name='model' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.model_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Ref. DB</label>
                                                    <input className='form-control' type='text' value={utForm.ref_db}
                                                        name='ref_db' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.ref_db_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Wave Mode</label>
                                                    <input className='form-control' type='text' value={utForm.wave_mode}
                                                        name='wave_mode' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.wave_mode_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Trans. Corr.</label>
                                                    <input className='form-control' type='text' value={utForm.trans_cor}
                                                        name='trans_cor' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.trans_cor_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Freq.</label>
                                                    <input className='form-control' type='text' value={utForm.freq}
                                                        name='freq' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.freq_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Refer Angle</label>
                                                    <input className='form-control' type='text' value={utForm.refer_angle}
                                                        name='refer_angle' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.refer_angle_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Section Details List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    setCurrentPage(1);
                                                                }} />
                                                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive" style={{ minHeight: 0 }}>
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Section Details</th>
                                                    <th>Quantity</th>
                                                    <th>Item No.</th>
                                                    <th>Grid No.</th>
                                                    <th>Type Of Weld</th>
                                                    <th>Welding Pro.</th>
                                                    <th>Welder No.</th>
                                                    <th>Thickness</th>
                                                    <th>Disk Type</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.transaction_id?.itemName?.name}</td>
                                                        <td>{elem?.transaction_id?.quantity}</td>
                                                        <td>{elem?.transaction_id?.item_no}</td>
                                                        <td>{elem?.transaction_id?.grid_no}</td>
                                                        <td>{getJointTypes(elem?.transaction_id?._id)}</td>
                                                        <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        <td>{elem?.thickness}</td>
                                                        {!data?._id ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input className='form-control' type='text' value={editFormData?.disc_type} name='disc_type' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className='form-control' onChange={handleEditFormChange} name='qc_remarks' value={editFormData?.qc_remarks} rows={1} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.disc_type || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
                                                                    </>
                                                                )}
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                                    </td>
                                                                ) : <td>-</td>}
                                                            </>
                                                        ) : <>
                                                            <td>{elem?.disc_type}</td>
                                                            <td>{elem?.qc_remarks}</td>
                                                            <td>-</td>
                                                        </>
                                                        }
                                                    </tr>
                                                )}
                                                {commentsData?.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                            <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="DataTables_Table_0_paginate">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={(page) => setCurrentPage(page)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="row align-items-center mt-2">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block select-gender">
                                                    <label className="gen-label">Status <span className="login-danger">*</span></label>
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="status"
                                                                value="accept"
                                                                className="form-check-input" checked={status === true}
                                                                onChange={handleStatusChange} disabled={data?._id} />Accept
                                                        </label>
                                                    </div>
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="status" value="reject"
                                                                checked={status === false}
                                                                onChange={handleStatusChange}
                                                                className="form-check-input" disabled={data?._id} />Reject
                                                        </label>
                                                    </div>
                                                    <div className='error'>{error?.status_err}</div>
                                                </div>
                                            </div>

                                        </div>
                                        {status === false && (
                                            <div className="row">
                                                <div className="col-12 col-md-12 col-xl-3">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label className="gen-label">Clearance Type <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={rejectOptions}
                                                            value={reject.reject_stage}
                                                            onChange={(e) => handleReject(e, 'reject_stage')}
                                                            filter className='w-100'
                                                            placeholder="Select Rejection Stage"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-12 col-xl-8">
                                                    <div className="input-block local-forms">
                                                        <label>Remarks</label>
                                                        <textarea className='form-control' rows={1} name='reject_remarks' value={reject.reject_remarks} onChange={(e) => handleReject(e, 'reject_remarks')}> </textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="doctor-submit text-end">
                                            {!data?._id ? (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                    disabled={disable}>{disable ? "Processing..." : "Generate UT Clearance"}</button>
                                            ) : (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/ut-clearance-management')}>Back</button>
                                            )}
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

export default UtClearance