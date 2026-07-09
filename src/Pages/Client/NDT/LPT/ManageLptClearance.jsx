import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserNdtOffer } from '../../../../Store/Store/Ndt/NdtOffer';
import Footer from '../../Include/Footer';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { Save, X } from 'lucide-react';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import moment from 'moment';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';

const ManageLptClearance = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [lpt, setLpt] = useState({
        drawNo: '',
        lptOffer: '',
        procedure: '',
    });
    const [lptForm, setLptForm] = useState({
        test_date: '',
        acc_code: '',
        surface_condition: '',
        surface_temp: '',
        examination_stage: '',
        technique: '',
        lighting_equip: '',
        lighting_intensity: '',
        extent_examination: '',
    });
    const [penetrant, setPenetrant] = useState({
        make: '',
        batch_no: '',
        validity: '',
    });
    const [cleaner, setCleaner] = useState({
        make: '',
        batch_no: '',
        validity: '',
    });
    const [developer, setDeveloper] = useState({
        make: '',
        batch_no: '',
        validity: '',
    });
    const [lptFilter, setLptFilter] = useState([]);
    const [lptObj, setLptObj] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [lptDraw, setLptDraw] = useState([]);

    useEffect(() => {
        if (location.state) {
            setLpt({
                drawNo: location.state?.items[0]?.transaction_id?.drawingId?._id,
                lptOffer: location.state?.ndt_offer_no?._id,
                procedure: location.state?.procedure_no?._id,
            });
            setLptForm({
                test_date: moment(location.state?.test_date).format('YYYY-MM-DD'),
                acc_code: location.state?.acceptance_code,
                surface_condition: location.state?.surface_condition,
                surface_temp: location.state?.surface_temperature,
                examination_stage: location.state?.examination_stage,
                technique: location.state?.technique,
                lighting_equip: location.state?.lighting_equipment,
                lighting_intensity: location.state?.lighting_intensity,
                extent_examination: location.state?.extent_examination,
            });
            setPenetrant(location.state?.penetrant_solvent);
            setCleaner(location.state?.cleaner_solvent);
            setDeveloper(location.state?.developer_solvent);
            setStatus(location.state?.qc_status)
            setTableData(location.state?.items);
        }
    }, [location.state]);

    const data = location.state;

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getUserNdtMaster({ status: '' }))
            .then((response) => {
                const ndtData = response.payload?.data;
                const findNdt = ndtData?.find((nt) => nt?.name === 'LPT');
                if (findNdt) {
                    dispatch(getUserNdtOffer({ status: '', type: findNdt._id }));
                    setDisable(false);
                }
            }).catch((error) => console.error("Error fetching NDT Master data:", error));
        dispatch(getUserProcedureMaster({ status: 'true' }))
    }, [dispatch]);

    const drawData = useSelector(state => state.getDrawing?.user?.data?.data);
    const ndtOfferData = useSelector(state => state.getUserNdtOffer?.user?.data);
    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);

    useEffect(() => {
        const checkStatus = ndtOfferData?.filter(st => st.status === 4);

        const lptIds = checkStatus?.map((u) => u?.drawing_id);
        const matchIds = drawData?.filter(id => lptIds?.includes(id?._id) && id?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setLptDraw(matchIds || []);

        const matchDrawing = checkStatus?.filter(dr => dr?.items?.some(it => it?.transaction_id?.drawingId?._id === lpt.drawNo));
        if (data?._id) {
            setLptFilter(ndtOfferData);
            const seletcedLPT = ndtOfferData?.find(dr => dr._id === lpt.lptOffer);
            setLptObj(seletcedLPT);
        } else {
            setLptFilter(matchDrawing);
            if (matchDrawing?.length > 0) {
                const findLpt = matchDrawing?.find(dr => dr._id === lpt.lptOffer);
                setLptObj(findLpt);
                setTableData(findLpt?.items || []);
            } else {
                setLpt((prev) => ({ ...prev, lptOffer: '' }));
            }
        }
    }, [ndtOfferData, drawData, lpt.drawNo, lpt.lptOffer, data?._id]);

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
        setLpt({ ...lpt, [name]: e.target.value });
    };
    const handleChange2 = (e) => {
        setLptForm({ ...lptForm, [e.target.name]: e.target.value });
    }
    const handleChangePenetrant = (e) => {
        setPenetrant({ ...penetrant, [e.target.name]: e.target.value });
    }
    const handleChangeCleaner = (e) => {
        setCleaner({ ...cleaner, [e.target.name]: e.target.value });
    }
    const handleChangeDeveloper = (e) => {
        setDeveloper({ ...developer, [e.target.name]: e.target.value });
    }
    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        observation: '',
        qc_remarks: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            observation: row.observation,
            qc_remarks: row.qc_remarks,
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


    const handleSubmit = () => {
        if (validation()) {

            let updatedData = tableData;
            let isValid = true;

            updatedData.forEach(item => {
                if (item.observation === '' || item.observation === undefined) {
                    isValid = false;
                    toast.error(`Please enter observation for ${item.transaction_id.itemName.name}`);
                }
            });

            if (!isValid) {
                return;
            }

            const filteredData = updatedData.map(item => ({
                transaction_id: item.transaction_id?._id,
                weldor_no: item.weldor_no?._id,
                item_status: item.item_status,
                thickness: item.thickness,
                profile_size: item.profile_size,
                observation: item.observation,
                qc_remarks: item.qc_remarks,
            }));

            setDisable(true);
            const myurl = `${V_URL}/user/manage-lpt-report`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', lpt.lptOffer);
            bodyFormData.append('procedure_no', lpt.procedure);
            bodyFormData.append('test_date', lptForm.test_date);
            bodyFormData.append('acceptance_code', lptForm.acc_code);

            bodyFormData.append('surface_condition', lptForm.surface_condition);
            bodyFormData.append('surface_temperature', lptForm.surface_temp);
            bodyFormData.append('examination_stage', lptForm.examination_stage);
            bodyFormData.append('technique', lptForm.technique);
            bodyFormData.append('lighting_equipment', lptForm.lighting_equip);
            bodyFormData.append('lighting_intensity', lptForm.lighting_intensity);
            bodyFormData.append('extent_examination', lptForm.extent_examination);

            bodyFormData.append('penetrant_solvent', JSON.stringify(penetrant));
            bodyFormData.append('cleaner_solvent', JSON.stringify(cleaner));
            bodyFormData.append('developer_solvent', JSON.stringify(developer));

            bodyFormData.append('qc_status', status);
            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
            bodyFormData.append('items', JSON.stringify(filteredData));

            bodyFormData.append('drawing_id', lpt.drawNo);

            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/user/project-store/lpt-clearance-management');
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
        if (status === null) {
            isValid = false;
            err['status_err'] = 'Please select status';
        }
        if (!lpt.drawNo) {
            isValid = false;
            err['drawNo_err'] = 'Please select drawing no.';
        }
        if (!lpt.lptOffer) {
            isValid = false;
            err['lptOffer_err'] = 'Please select LPT offer.';
        }
        if (!lpt.procedure) {
            isValid = false;
            err['procedure_err'] = 'Please select procedure no.';
        }
        if (!lptForm.test_date) {
            isValid = false;
            err['test_date_err'] = 'Please select test date.';
        }
        setError(err);
        return isValid;
    }


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = lptDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

    const lptOptions = lptFilter?.map(item => ({
        label: item?.ndt_offer_no,
        value: item._id
    }));

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
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
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/lpt-clearance-management">Liquid Penetrant Testing Clearance List</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Liquid Penetrant Testing Clearance
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
                                                <h4>Magnetic Particle Testing Clearance Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={drawOptions}
                                                        value={lpt.drawNo}
                                                        onChange={(e) => handleChange(e, 'drawNo')}
                                                        filter className='w-100'
                                                        placeholder="Select Drawing No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.drawNo_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Liquid Penetrant Testing Offer No.<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={lptOptions}
                                                        value={lpt.lptOffer}
                                                        onChange={(e) => handleChange(e, 'lptOffer')}
                                                        filter className='w-100'
                                                        placeholder="Select Liquid Penetrant Testing Offer No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.lptOffer_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {lpt.lptOffer ? (
                                            <>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Client </label>
                                                            <input className='form-control' value={lptObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-md-4 col-xl-4'>
                                                        <div className="input-block local-forms">
                                                            <label>Work Order / PO No.</label>
                                                            <input className='form-control' value={lptObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>REV </label>
                                                            <input className='form-control' value={lptObj?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Sheet No. </label>
                                                            <input className='form-control' value={lptObj?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Assembly No. </label>
                                                            <input className='form-control' value={lptObj?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
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
                                                        value={lpt.procedure}
                                                        onChange={(e) => handleChange(e, 'procedure')}
                                                        filter className='w-100'
                                                        placeholder="Select Procedure No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.procedure_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Test Date <span className="login-danger">*</span></label>
                                                    <input type='date' className='form-control' value={lptForm.test_date} name='test_date' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.test_date_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Acceptance Code </label>
                                                    <input type='text' className='form-control' value={lptForm.acc_code} name='acc_code' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.acc_code_err}</div>
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
                                                    <label>Surface Condition</label>
                                                    <input type='text' className='form-control' value={lptForm.surface_condition} name='surface_condition' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.surface_condition_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Surface Temp.</label>
                                                    <input type='text' className='form-control' value={lptForm.surface_temp} name='surface_temp' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.surface_temp_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Examination Stage</label>
                                                    <input type='text' className='form-control' value={lptForm.examination_stage} name='examination_stage' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.examination_stage_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Technique</label>
                                                    <input type='text' className='form-control' value={lptForm.technique} name='technique' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.technique_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Lighting Equipment</label>
                                                    <input type='text' className='form-control' value={lptForm.lighting_equip} name='lighting_equip' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.lighting_equip_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Lighting Intensity</label>
                                                    <input type='text' className='form-control' value={lptForm.lighting_intensity} name='lighting_intensity' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.lighting_intensity_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Extent Of Examination(%)</label>
                                                    <input type='text' className='form-control' value={lptForm.extent_examination} name='extent_examination' onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.extent_examination_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Type</label>
                                                    <input type='text' className='form-control' value={'Penetrant: Solvent Removable'} readOnly />
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Make </label>
                                                    <input type='text' className='form-control' value={penetrant.make} name='make' onChange={handleChangePenetrant} readOnly={data?._id} />
                                                    <div className='error'>{error?.pen_make_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Batch No. </label>
                                                    <input type='text' className='form-control' value={penetrant.batch_no} name='batch_no' onChange={handleChangePenetrant} readOnly={data?._id} />
                                                    <div className='error'>{error?.pen_batch_no_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Validity </label>
                                                    <input type='text' className='form-control' value={penetrant.validity} name='validity' onChange={handleChangePenetrant} readOnly={data?._id} />
                                                    <div className='error'>{error?.pen_validity_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Type</label>
                                                    <input type='text' className='form-control' value={'Cleaner: Solvent Removable'} readOnly />
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Make </label>
                                                    <input type='text' className='form-control' value={cleaner.make} name='make' onChange={handleChangeCleaner} readOnly={data?._id} />
                                                    <div className='error'>{error?.clean_make_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Batch No. </label>
                                                    <input type='text' className='form-control' value={cleaner.batch_no} name='batch_no' onChange={handleChangeCleaner} readOnly={data?._id} />
                                                    <div className='error'>{error?.clean_batch_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Validity </label>
                                                    <input type='text' className='form-control' value={cleaner.validity} name='validity' onChange={handleChangeCleaner} readOnly={data?._id} />
                                                    <div className='error'>{error?.clean_validity_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Type</label>
                                                    <input type='text' className='form-control' value={'Developer: Solvent Removable'} readOnly />
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Make </label>
                                                    <input type='text' className='form-control' value={developer.make} name='make' onChange={handleChangeDeveloper} readOnly={data?._id} />
                                                    <div className='error'>{error?.dev_make_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Batch No.</label>
                                                    <input type='text' className='form-control' value={developer.batch_no} name='batch_no' onChange={handleChangeDeveloper} readOnly={data?._id} />
                                                    <div className='error'>{error?.dev_batch_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Validity </label>
                                                    <input type='text' className='form-control' value={developer.validity} name='validity' onChange={handleChangeDeveloper} readOnly={data?._id} />
                                                    <div className='error'>{error?.dev_validity_err}</div>
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
                                                    <th>Grid No.</th>
                                                    <th>Welding Pro.</th>
                                                    <th>Welder No.</th>
                                                    <th>Thickness</th>
                                                    <th>Profile/Size</th>
                                                    <th>Observation</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.transaction_id?.itemName?.name}</td>
                                                        <td>{elem?.transaction_id?.grid_no}</td>
                                                        <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        <td>{elem?.thickness}</td>
                                                        <td>{elem?.profile_size}</td>
                                                        {!data?._id ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input type="text" className="form-control" value={editFormData?.observation} name='observation' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className="form-control" value={editFormData?.qc_remarks} name='qc_remarks' rows={1} onChange={handleEditFormChange} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.observation || '-'}</td>
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
                                                        ) : (
                                                            <>
                                                                <td>{elem?.observation}</td>
                                                                <td>{elem?.qc_remarks || '-'}</td>
                                                                <td>-</td>
                                                            </>
                                                        )}
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

                                        <div className="doctor-submit text-end">
                                            {!data?._id ? (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                    disabled={disable}>{disable ? "Processing..." : "Generate LPT Clearance"}</button>
                                            ) : (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/lpt-clearance-management')}>Back</button>
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

export default ManageLptClearance