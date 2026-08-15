import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Store/Procedure/ProcedureMaster';
import { Pagination, Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import DropDown from '../../../../../Components/DropDown';
import LptClearanceForm from './components/LptClearanceForm';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';

const ManageMultiLptClearance = () => {

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
        procedure: '',
    });
    const data = location.state;

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
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        observation: '',
        qc_remarks: '',
        is_accepted_qc: '',
    });
    const [tableData, setTableData] = useState([]);
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }))
    }, []);

    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);

    useEffect(() => {
        if (data?._id) {
            const filterItems = location.state.items?.filter((it) => it?.is_cover === true);
            setTableData(filterItems);
            if (data?.status !== 2) {
                setLpt({ procedure: data?.procedure_no?._id })
                setLptForm({
                    test_date: data?.test_date ? moment(data?.test_date).format('YYYY-MM-DD') : '',
                    acc_code: data?.acceptance_code,
                    surface_condition: data?.surface_condition,
                    surface_temp: data?.surface_temperature,
                    examination_stage: data?.examination_stage,
                    technique: data?.technique,
                    lighting_equip: data?.lighting_equipment,
                    lighting_intensity: data?.lighting_intensity,
                    extent_examination: data?.extent_examination,
                });
                setPenetrant(data?.penetrant_solvent);
                setCleaner(data?.cleaner_solvent);
                setDeveloper(location.state?.developer_solvent);
            }
        }
    }, [data]);

    const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
        let filteredData = data;
        if (searchTerm) {
            filteredData = filteredData.filter(
                (i) =>
                    i?.grid_item_id?.item_name?.name?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.grid_id?.grid_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.drawing_id?.drawing_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.drawing_id?.rev?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.drawing_id?.assembly_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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

    const handleAcceptRejectClick = (index, isAccepted, name) => {
        Swal.fire({
            title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
            text: "Are you sure you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            dangerMode: !isAccepted,
        }).then((result) => {
            if (result.isConfirmed) {
                setAcceptRejectStatus((prev) => ({
                    ...prev,
                    [index]: isAccepted,
                }));
                toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
            }
        });
    };

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
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData, is_accepted_qc: acceptRejectStatus[editRowIndex] };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleSubmit = () => {
        if (validation()) {
            let updatedData = tableData;

            for (const item of updatedData) {
                if (item.is_accepted_qc === '' || item.is_accepted_qc === undefined) {
                    toast.error(`Please accept or reject for ${item?.grid_item_id?.item_name?.name}`);
                    return;
                }
                if (item.observation === undefined || item.observation === '') {
                    toast.error(`Please enter observation for ${item?.grid_item_id?.item_name?.name}`);
                    return;
                }
            }

            const filteredData = updatedData.map(item => ({
                grid_item_id: item?.grid_item_id?._id,
                grid_id: item?.grid_item_id?.grid_id?._id,
                drawing_id: item?.grid_item_id?.drawing_id?._id,
                thickness: item.thickness,
                observation: item.observation,
                offer_used_grid_qty: item.lpt_use_qty,
                offer_balance_qty: item.offer_balance_qty,
                joint_type: item.joint_type.map((e) => e._id),
                weldor_no: item.weldor_no?._id,
                wps_no: item.wps_no?._id,
                qc_remarks: item.qc_remarks || '',
                is_cover: item.is_cover,
                ndt_master_id: item.ndt_master_id?._id,
                is_accepted: item.is_accepted_qc,
            }));

            setDisable(true);
            const myurl = `${V_URL}/party/manage-multi-lpt-report`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', data?._id);

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

            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
            bodyFormData.append('items', JSON.stringify(filteredData));
            bodyFormData.append('pId', localStorage.getItem('U_PROJECT_ID'));
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/party/project-store/lpt-clearance-management');
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

                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/party/project-store/dashboard", active: false },
                        { name: "Liquid Penetrant Testing Clearance List", link: "/party/project-store/lpt-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Liquid Penetrant Testing Clearance`, active: true }
                    ]} />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>Liquid Penetrant Testing Clearance Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            {data?.status !== 2 && (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Magnetic Particle Testing Clearance No.</label>
                                                        <input className='form-control' value={data?.test_inspect_no} readOnly />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Liquid Penetrant Testing Offer No.</label>
                                                    <input className='form-control' value={data?.status === 2 ? data?.ndt_offer_no : data?.ndt_offer_no?.ndt_offer_no} readOnly />
                                                </div>
                                            </div>
                                        </div>

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
                                                    />
                                                    <div className='error'>{error?.procedure_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Test Date <span className="login-danger">*</span></label>
                                                    <input type='date' className='form-control' value={lptForm.test_date} name='test_date' onChange={handleChange2}
                                                        max={new Date().toISOString().split("T")[0]} min={moment(data?.report_date).format("YYYY-MM-DD")} />
                                                    <div className='error'>{error?.test_date_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-3 col-xl-3'>
                                                <div className='input-block local-forms'>
                                                    <label>Acceptance Code </label>
                                                    <input type='text' className='form-control' value={lptForm.acc_code} name='acc_code' onChange={handleChange2} />
                                                    <div className='error'>{error?.acc_code_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <LptClearanceForm
                        data={data}
                        lptForm={lptForm}
                        developer={developer}
                        penetrant={penetrant}
                        cleaner={cleaner}
                        error={error}
                        handleChange2={handleChange2}
                        handleChangeDeveloper={handleChangeDeveloper}
                        handleChangePenetrant={handleChangePenetrant}
                        handleChangeCleaner={handleChangeCleaner}
                    />

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
                                                    <th>Drawing No.</th>
                                                    <th>Rev</th>
                                                    <th>Assem. No.</th>
                                                    <th>Section Details</th>
                                                    <th>Grid No.</th>
                                                    <th>Grid Qty.</th>
                                                    <th>Type Of Weld</th>
                                                    <th>Welder No.</th>
                                                    <th>Welding Pro.</th>
                                                    <th>Thickness</th>
                                                    <th>Observation</th>
                                                    <th>Remarks</th>
                                                    {data?.status === 2 && (
                                                        <th>Acc/Rej</th>
                                                    )}
                                                    <th>Status</th>
                                                    {data?.status === 2 && (
                                                        <th>Action</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.grid_item_id?.drawing_id?.drawing_no}</td>
                                                        <td>{elem?.grid_item_id?.drawing_id?.rev}</td>
                                                        <td>{elem?.grid_item_id?.drawing_id?.assembly_no}</td>
                                                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                        <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                        {/* <td>{elem?.offer_used_grid_qty}</td> */}
                                                        <td>{data?.status !== 2 ? elem?.offer_used_grid_qty : elem?.lpt_use_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name).join(', ')}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        <td>{elem?.wps_no?.weldingProcess}</td>
                                                        <td>{elem?.thickness}</td>
                                                        {data?.status === 2 ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input type="text" className="form-control" value={editFormData?.observation} name='observation' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className="form-control" value={editFormData?.qc_remarks} name='qc_remarks' rows={1} onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td className=''>
                                                                            <div className='d-flex gap-2'>
                                                                                <span
                                                                                    className={`present-table attent-status ${acceptRejectStatus[i] === true ? 'selected' : ''}`}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() => handleAcceptRejectClick(i, true, elem?.grid_item_id?.item_name?.name)}>
                                                                                    <Check />
                                                                                </span>
                                                                                <span
                                                                                    className={`absent-table attent-status ${acceptRejectStatus[i] === false ? 'selected' : ''}`}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() => handleAcceptRejectClick(i, false, elem?.grid_item_id?.item_name?.name)}
                                                                                >
                                                                                    <X />
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.observation || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>-</td>
                                                                    </>
                                                                )}
                                                                <td className='status-badge'>
                                                                    {acceptRejectStatus[i] === true ? (
                                                                        <span className="custom-badge status-green">Acc</span>
                                                                    ) : acceptRejectStatus[i] === false ? (
                                                                        <span className="custom-badge status-pink">Rej</span>
                                                                    ) : (
                                                                        <span className="">-</span>
                                                                    )}
                                                                </td>
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
                                                                <td className='status-badge'>
                                                                    {elem?.is_accepted === true ? (
                                                                        <span className="custom-badge status-green">Acc</span>
                                                                    ) : elem?.is_accepted === false ? (
                                                                        <span className="custom-badge status-pink">Rej</span>
                                                                    ) : (
                                                                        <span className="">-</span>
                                                                    )}
                                                                </td>
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

                    <SubmitButton disable={disable} handleSubmit={handleSubmit} link={'/party/project-store/lpt-clearance-management'}
                        buttonName={'Generate LPT Report'} finalReq={data?.status !== 2 ? data?.items : []} />

                </div>
            </div>
        </div>
    )
}

export default ManageMultiLptClearance