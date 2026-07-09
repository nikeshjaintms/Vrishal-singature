import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserNdtOffer } from '../../../../Store/Store/Ndt/NdtOffer';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';

const ManageMptClearance = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [mpt, setMpt] = useState({
        drawNo: '',
        mptOffer: '',
    });
    const [mptFilter, setMptFilter] = useState([]);
    const [mptObj, setMptObj] = useState({});

    const [tableData, setTableData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);

    const [status, setStatus] = useState(null);
    const [mptDraw, setMptDraw] = useState([]);

    const [mptForm, setMptForm] = useState({
        test_date: '', acc_standard: '', surface_condition: '',
        extent_examniation: '', examination_stage: '', post_cleaning: '',
        technique: '', megnetization: '', lighting_equipment: '', medium: '', lighting_intensity: '', yoke_spacing: '',
        particle: '', yoke_no: '', yoke_model: '', particle_batch: '', contrast: '', contrast_batch: '',
    });

    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setMpt({
                drawNo: location.state?.items[0]?.transaction_id?.drawingId?._id,
                mptOffer: location.state.ndt_offer_no?._id,
            });
            setMptForm({
                test_date: moment(location.state.test_date).format('YYYY-MM-DD'),
                acc_standard: location.state.acceptance_standard,
                surface_condition: location.state.surface_condition,
                extent_examniation: location.state.extent_examination,
                examination_stage: location.state.examination_stage,
                post_cleaning: location.state.post_cleaning,
                technique: location.state.technique,
                megnetization: location.state.magnetization,
                lighting_equipment: location.state.light_equipment,
                medium: location.state.medium,
                lighting_intensity: location.state.lighting_intensity,
                yoke_spacing: location.state.yoke_spacing,
                particle: location.state.particle,
                yoke_no: location.state.yoke_sr_no,
                yoke_model: location.state.yoke_make_model,
                particle_batch: location.state.particle_batch_no,
                contrast: location.state.contrast,
                contrast_batch: location.state.contrast_batch_no,
            })
            setStatus(location.state.qc_status);
            setTableData(location?.state?.items);
        }
    }, [location.state]);

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

    useEffect(() => {
        dispatch(getDrawing());
        dispatch(getUserNdtMaster({ status: '' }))
            .then((response) => {
                const ndtData = response.payload?.data;
                const findNdt = ndtData?.find((nt) => nt?.name === 'MPT');
                if (findNdt) {
                    dispatch(getUserNdtOffer({ status: '', type: findNdt._id }));
                    setDisable(false);
                }
            }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [dispatch]);

    const drawData = useSelector(state => state.getDrawing?.user?.data?.data);
    const ndtOfferData = useSelector(state => state.getUserNdtOffer?.user?.data);

    useEffect(() => {
        const checkStatus = ndtOfferData?.filter(st => st.status === 4);
        const mptIds = checkStatus?.map((u) => u?.drawing_id);

        const matchIds = drawData?.filter(id => mptIds?.includes(id?._id) && id?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setMptDraw(matchIds || []);

        const matchDrawing = checkStatus?.filter(dr => dr?.items?.some(it => it?.transaction_id?.drawingId?._id === mpt.drawNo));
        if (data?._id) {
            setMptFilter(ndtOfferData);
            const seletcedMPT = ndtOfferData?.find(dr => dr._id === mpt.mptOffer);
            setMptObj(seletcedMPT);
        } else {
            setMptFilter(matchDrawing);
            if (matchDrawing?.length > 0) {
                const findMpt = matchDrawing?.find(dr => dr._id === mpt.mptOffer);
                setMptObj(findMpt);
                setTableData(findMpt?.items || []);
            } else {
                setMpt((prevMpt) => ({ ...prevMpt, mptOffer: '' }));
            }
        }
    }, [ndtOfferData, mpt.drawNo, mpt.mptOffer, data?._id]);

    const handleChange = (e, name) => {
        setMpt({ ...mpt, [name]: e.value });
    }

    const handleChange2 = (e) => {
        setMptForm({ ...mptForm, [e.target.name]: e.target.value });
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        thickness: '',
        observation: '',
        qc_remarks: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            thickness: row.thickness,
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
            let InvalidItem = null;

            updatedData.forEach(item => {
                const requiredFields = [
                    'thickness',
                    'observation'
                ];

                requiredFields.forEach(field => {
                    if ((!item[field] || item[field].trim() === '') && isValid) {
                        isValid = false;
                        InvalidItem = item;
                    }
                });
            });

            if (!isValid) {
                toast.error(`Please fill all the fields for ${InvalidItem.transaction_id.itemName.name}.`);
                return;
            }

            const filteredData = updatedData.map(item => ({
                transaction_id: item.transaction_id?._id,
                weldor_no: item.weldor_no?._id,
                item_status: item.item_status,
                thickness: item.thickness,
                observation: item.observation,
                qc_remarks: item.qc_remarks,
            }));

            setDisable(true);
            const myurl = `${V_URL}/user/manage-mpt-report`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', mpt.mptOffer);
            bodyFormData.append('test_date', mptForm.test_date);
            bodyFormData.append('acceptance_standard', mptForm.acc_standard);
            bodyFormData.append('surface_condition', mptForm.surface_condition);
            bodyFormData.append('extent_examination', mptForm.extent_examniation);
            bodyFormData.append('post_cleaning', mptForm.post_cleaning);
            bodyFormData.append('technique', mptForm.technique);
            bodyFormData.append('magnetization', mptForm.megnetization);
            bodyFormData.append('light_equipment', mptForm.lighting_equipment);
            bodyFormData.append('medium', mptForm.medium);
            bodyFormData.append('lighting_intensity', mptForm.lighting_intensity);
            bodyFormData.append('yoke_spacing', mptForm.yoke_spacing);
            bodyFormData.append('particle', mptForm.particle);
            bodyFormData.append('yoke_sr_no', mptForm.yoke_no);
            bodyFormData.append('yoke_make_model', mptForm.yoke_model);
            bodyFormData.append('particle_batch_no', mptForm.particle_batch);
            bodyFormData.append('contrast', mptForm.contrast);
            bodyFormData.append('contrast_batch_no', mptForm.contrast_batch);

            bodyFormData.append('qc_status', status);
            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
            bodyFormData.append('items', JSON.stringify(filteredData));

            bodyFormData.append('drawing_id', mpt.drawNo);

            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/mpt-clearance-management');
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
        const err = {};
        if (!mpt.drawNo) {
            isValid = false;
            err['drawNo_err'] = 'Please select drawing no.';
        }
        if (!mpt.mptOffer) {
            isValid = false;
            err['mptOffer_err'] = "Please select mpt offer.";
        }
        if (!mptForm.test_date) {
            isValid = false;
            err['test_date_err'] = "Please select test date.";
        }
        setError(err);
        return isValid;
    }


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = mptDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

    const mptOptions = mptFilter?.map(mpt => ({
        label: mpt?.ndt_offer_no,
        value: mpt?._id,
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
                                        <Link to="/piping/user/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/mpt-clearance-management">Magnetic Particle Testing Clearance List</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Magnetic Particle Testing Clearance
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
                                                        value={mpt.drawNo}
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
                                                    <label>Magnetic Particle Testing Offer No.<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={mptOptions}
                                                        value={mpt.mptOffer}
                                                        onChange={(e) => handleChange(e, 'mptOffer')}
                                                        filter className='w-100'
                                                        placeholder="Select Magnetic Particle Testing Offer No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.mptOffer_err}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {mpt.mptOffer ? (
                                            <>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Client </label>
                                                            <input className='form-control' value={mptObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-md-4 col-xl-4'>
                                                        <div className="input-block local-forms">
                                                            <label>Work Order / PO No.</label>
                                                            <input className='form-control' value={mptObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>REV </label>
                                                            <input className='form-control' value={mptObj?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Sheet No. </label>
                                                            <input className='form-control' value={mptObj?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Assembly No. </label>
                                                            <input className='form-control' value={mptObj?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}

                                        <div className='row'>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Test Date <span className="login-danger">*</span></label>
                                                    <input type='date' className='form-control' value={mptForm.test_date} name='test_date'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                    <div className='error'>{error?.test_date_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-8 col-xl-8'>
                                                <div className='input-block local-forms'>
                                                    <label>Acceptance Standard</label>
                                                    <input type='text' className='form-control' value={mptForm.acc_standard} name='acc_standard'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.acc_standard_err}</div>
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
                                                    <input type='text' className='form-control' value={mptForm.surface_condition} name='surface_condition'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.surface_condition_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Extent Of Examination</label>
                                                    <input type='text' className='form-control' value={mptForm.extent_examniation} name='extent_examniation'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.extent_examniation_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Examination Stage</label>
                                                    <input type='text' className='form-control' value={mptForm.examination_stage} name='examination_stage'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.examination_stage_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Post Cleaning</label>
                                                    <input type='text' className='form-control' value={mptForm.post_cleaning} name='post_cleaning'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.post_cleaning_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Technique</label>
                                                    <input type='text' className='form-control' value={mptForm.technique} name='technique'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.technique_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Megnetization</label>
                                                    <input type='text' className='form-control' value={mptForm.megnetization} name='megnetization'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.megnetization_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Lighting Equipment</label>
                                                    <input type='text' className='form-control' value={mptForm.lighting_equipment} name='lighting_equipment'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.lighting_equipment_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Medium</label>
                                                    <input type='text' className='form-control' value={mptForm.medium} name='medium'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.medium_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Lighting Intensity</label>
                                                    <input type='text' className='form-control' value={mptForm.lighting_intensity} name='lighting_intensity'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.lighting_intensity_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Yoke Spacing</label>
                                                    <input type='text' className='form-control' value={mptForm.yoke_spacing} name='yoke_spacing'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.yoke_spacing_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Particle</label>
                                                    <input type='text' className='form-control' value={mptForm.particle} name='particle'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.particle_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Yoke Sr. No.</label>
                                                    <input type='text' className='form-control' value={mptForm.yoke_no} name='yoke_no'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.yoke_no_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Yoke Make and Model</label>
                                                    <input type='text' className='form-control' value={mptForm.yoke_model} name='yoke_model'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.yoke_model_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Particle Batch No.</label>
                                                    <input type='text' className='form-control' value={mptForm.particle_batch} name='particle_batch'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.particle_batch_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Contrast</label>
                                                    <input type='text' className='form-control' value={mptForm.contrast} name='contrast'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.contrast_err}</div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Contrast Batch No.</label>
                                                    <input type='text' className='form-control' value={mptForm.contrast_batch} name='contrast_batch'
                                                        onChange={handleChange2} readOnly={data?._id} />
                                                </div>
                                                <div className='error'>{error?.contrast_batch_err}</div>
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
                                                        {!data?._id ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input type="text" className="form-control" value={editFormData?.thickness} name='thickness' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control" value={editFormData?.observation} name='observation' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className="form-control" value={editFormData?.qc_remarks} name='qc_remarks' rows={1} onChange={handleEditFormChange} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.thickness || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.observation || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>                                                    </>
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
                                                                <td>{elem?.thickness || '-'}</td>
                                                                <td>{elem?.observation || '-'}</td>
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
                                                    disabled={disable}>{disable ? "Processing..." : "Generate MPT Clearance"}</button>
                                            ) : (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/mpt-clearance-management')}>Back</button>
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
        </div >
    )
}

export default ManageMptClearance