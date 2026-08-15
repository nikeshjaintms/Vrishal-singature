import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import DropDown from '../../../../../Components/DropDown';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import MptForm from './components/MptForm';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';

const ManageMultiMptClearance = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
    const [editFormData, setEditFormData] = useState({
        thickness: '',
        observation: '',
        qc_remarks: '',
        is_accepted_qc: '',
    });

    const [mptForm, setMptForm] = useState({
        test_date: '', acc_standard: '', surface_condition: '',
        extent_examniation: '', examination_stage: '', post_cleaning: '',
        technique: '', megnetization: '', lighting_equipment: '', medium: '', lighting_intensity: '', yoke_spacing: '',
        particle: '', yoke_no: '', yoke_model: '', particle_batch: '', contrast: '', contrast_batch: '',
    });
    const data = location.state;

    useEffect(() => {
        if (data?._id) {
            const filterItems = location.state.items?.filter((it) => it?.is_cover === true);
            setTableData(filterItems);
            if (data?.status !== 2) {
                setMptForm({
                    test_date: data?.test_date ? moment(data?.test_date).format('YYYY-MM-DD') : '',
                    acc_standard: data?.acceptance_standard,
                    surface_condition: data?.surface_condition,
                    extent_examniation: data?.extent_examination,
                    examination_stage: data?.examination_stage,
                    post_cleaning: data?.post_cleaning,
                    technique: data?.technique,
                    megnetization: data?.magnetization,
                    lighting_equipment: data?.light_equipment,
                    medium: data?.medium,
                    lighting_intensity: data?.lighting_intensity,
                    yoke_spacing: data?.yoke_spacing,
                    particle: data?.particle,
                    yoke_no: data?.yoke_sr_no,
                    yoke_model: data?.yoke_make_model,
                    particle_batch: data?.particle_batch_no,
                    contrast: data?.contrast,
                    contrast_batch: data?.contrast_batch_no,
                })
            }
        }
    }, [data]);

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

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            thickness: row.thickness,
            observation: row.observation,
            qc_remarks: row.qc_remarks,
            is_accepted_qc: ''
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

    const handleChange2 = (e) => {
        setMptForm({ ...mptForm, [e.target.name]: e.target.value });
    }

    const commentsData = useMemo(() => filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
        [currentPage, search, limit, tableData]);

    const handleSubmit = () => {
        if (validation()) {
            let updatedData = tableData;

            for (const item of updatedData) {
                if (item.is_accepted_qc === '' || item.is_accepted_qc === undefined) {
                    toast.error(`Please accept or reject for ${item?.grid_item_id?.item_name?.name}`);
                    return;
                }
                if (item.thickness === undefined || item.thickness === '') {
                    toast.error(`Please enter thickness for ${item?.grid_item_id?.item_name?.name}`);
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
                joint_type: item.joint_type.map((e) => e._id),
                offer_used_grid_qty: item.mpt_use_qty,
                offer_balance_qty: item.offer_balance_qty,
                weldor_no: item.weldor_no?._id,
                wps_no: item.wps_no?._id,
                qc_remarks: item.qc_remarks || '',
                is_accepted: item.is_accepted_qc,
                is_cover: item.is_cover,
                ndt_master_id: item.ndt_master_id?._id,
            }));

            setDisable(true);
            const myurl = `${V_URL}/party/manage-multi-mpt-report`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', data?._id);

            bodyFormData.append('test_date', mptForm.test_date);
            bodyFormData.append('acceptance_standard', mptForm.acc_standard);
            bodyFormData.append('surface_condition', mptForm.surface_condition);
            bodyFormData.append('extent_examination', mptForm.extent_examniation);
            bodyFormData.append('examination_stage', mptForm.examination_stage);
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
                    navigate('/party/project-store/mpt-clearance-management');
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

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/party/project-store/dashboard", active: false },
                        { name: "Magnetic Particle Testing Clearance List", link: "/party/project-store/mpt-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Magnetic Particle Testing Clearance`, active: true }
                    ]} />

                    <MptForm data={data} mptForm={mptForm} error={error} handleChange2={handleChange2} />

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
                                                    <th>Welding Pro.</th>
                                                    <th>Welder No.</th>
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
                                                        <td>{data?.status !== 2 ? elem?.offer_used_grid_qty : elem?.mpt_use_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name).join(', ')}</td>
                                                        <td>{elem?.wps_no?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        {data?.status === 2 ? (
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
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.thickness || '-'}</td>
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
                                                                <td>{elem?.thickness || '-'}</td>
                                                                <td>{elem?.observation || '-'}</td>
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

                    <SubmitButton disable={disable} handleSubmit={handleSubmit} link={'/party/project-store/mpt-clearance-management'}
                        buttonName={'Generate MPT Report'} finalReq={data?.status !== 2 ? data?.items : []} />
                </div>
            </div>
        </div>
    )
}

export default ManageMultiMptClearance