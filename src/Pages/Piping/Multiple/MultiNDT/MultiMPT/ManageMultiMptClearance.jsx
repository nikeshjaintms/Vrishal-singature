import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
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
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';

const ManageMultiMptClearance = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [mpt, setMpt] = useState({
        procedure: '',
    });
    const [tableData, setTableData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
    const [editFormData, setEditFormData] = useState({
        observation: '',
        qc_remarks: '',
        status: '',
    });

    const [mptForm, setMptForm] = useState({
        test_date: '', acc_standard: '', surface_condition: '',
        extent_examniation: '', examination_stage: '', post_cleaning: '',
        technique: '', magnetization: '', lighting_equipment: '', medium: '', lighting_intensity: '', yoke_spacing: '',
        particle: '', yoke_no: '', yoke_model: '', particle_batch: '', contrast: '', contrast_batch: '',
    });
    const data = location.state;
    console.log(data, '@@data')

    const procedureData = useSelector((state) => state.getUserProcedureMasterPiping?.user?.data);

    const procedureOptions = useMemo(() => {
        return procedureData?.map(procedure => ({
            label: procedure.procedure_no || procedure.vendor_doc_no,
            value: procedure._id
        }))
    }, [procedureData]);

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }));
    }, [dispatch]);

    useEffect(() => {
        if (data?._id) {
            const items = location.state.items || [];
            const filterItems = items.some(e => e.hasOwnProperty('is_cover'))
                ? items.filter((e) => e?.is_cover === true)
                : items;
            const preProcessedItems = filterItems.map(item => ({
                ...item,
                status: item.status !== undefined ? item.status.toString() : (item.is_accepted_qc || (item.is_accepted ? '1' : '')),
                qc_remarks: item.qc_remarks || ''
            }));
            setTableData(preProcessedItems);
            if (data?._id) {
                setMpt({
                    procedure: data?.procedure_no?._id || data?.procedure_no || '',
                });
                setMptForm({
                    test_date: data?.test_date ? moment(data?.test_date).format('YYYY-MM-DD') : '',
                    acc_standard: data?.acceptance_standard,
                    surface_condition: data?.surface_condition,
                    extent_examniation: data?.extent_of_examination || data?.extent_examination,
                    examination_stage: data?.examination_stage,
                    post_cleaning: data?.post_cleaning,
                    technique: data?.technique,
                    magnetization: data?.magnetization,
                    lighting_equipment: data?.lightening_equipment || data?.light_equipment,
                    medium: data?.medium,
                    lighting_intensity: data?.lightening_intensity || data?.lighting_intensity,
                    yoke_spacing: data?.yoke_spacing,
                    particle: data?.particle,
                    yoke_no: data?.yoke_sr_no,
                    yoke_model: data?.yoke_model_make || data?.yoke_model,
                    particle_batch: data?.particle_batch_no,
                    contrast: data?.contrast,
                    contrast_batch: data?.contrast_batch_no,
                })
            }
        }
    }, [data, location.state.items]);

    const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
        let filteredData = data;
        if (searchTerm) {
            filteredData = filteredData.filter(
                (i) =>
                    i?.drawing_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.spool_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.joint_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.welder_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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
            thickness: row.thickness?.name || row.thickness || '',
            observation: row.observation || '',
            qc_remarks: row.qc_remarks || '',
            status: row.status !== undefined ? row.status.toString() : (row.is_accepted_qc || (row.is_accepted ? '1' : '')),
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
        updatedData[dataIndex] = {
            ...updatedData[dataIndex],
            ...editFormData,
            is_accepted: editFormData.status === '1'
        };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

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
                setEditFormData(prev => ({
                    ...prev,
                    status: isAccepted ? '1' : '2'
                }));
                toast.success(`${name} ${isAccepted ? "accepted" : "rejected"}.`);
            }
        });
    };

    const handleChange = (e, name) => {
        setMpt({ ...mpt, [name]: e.value });
    }

    const handleChange2 = (e) => {
        setMptForm({ ...mptForm, [e.target.name]: e.target.value });
    }

    const commentsData = useMemo(() => filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
        [currentPage, search, limit, tableData]);

    const handleSubmit = () => {
        if (validation()) {
            let updatedData = tableData;

            for (const item of updatedData) {
                if (item.status === '' || item.status === undefined) {
                    toast.error(`Please accept or reject for joint ${item?.joint_no}`);
                    return;
                }
                if (item.observation === undefined || item.observation === '') {
                    toast.error(`Please enter observation for joint ${item?.joint_no}`);
                    return;
                }
            }

            const filteredData = updatedData.map(item => ({
                _id: item._id,
                drawing_id: item.drawing_id,
                spool_id: item.spool_id,
                joint_id: item.joint_id,
                weld_visual_id: item.weld_visual_id,
                weld_visual_item_id: item.weld_visual_item_id,
                mpt_lot_id: item.mpt_lot_id,
                mpt_lot_item_id: item.mpt_lot_item_id,
                thickness: item.thickness?.name || item.thickness,
                observation: item.observation,
                qc_remarks: item.qc_remarks || '',
                status: parseInt(item.status),
                is_cover: item.is_cover,
                ndt_master_id: item.ndt_master_id?._id || item.ndt_master_id,
            }));

            setDisable(true);
            const myurl = `${V_URL}/user/piping/mpt-generate-offer`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('inspection_id', data?._id);

            bodyFormData.append('test_date', mptForm.test_date);
            bodyFormData.append('procedure_no', mpt.procedure);
            bodyFormData.append('acceptance_standard', mptForm.acc_standard);
            bodyFormData.append('surface_condition', mptForm.surface_condition);
            bodyFormData.append('extent_of_examination', mptForm.extent_examniation);
            bodyFormData.append('examination_stage', mptForm.examination_stage);
            bodyFormData.append('post_cleaning', mptForm.post_cleaning);
            bodyFormData.append('technique', mptForm.technique);
            bodyFormData.append('magnetization', mptForm.megnetization);
            bodyFormData.append('lightening_equipment', mptForm.lighting_equipment);
            bodyFormData.append('medium', mptForm.medium);
            bodyFormData.append('lightening_intensity', mptForm.lighting_intensity);
            bodyFormData.append('yoke_spacing', mptForm.yoke_spacing);
            bodyFormData.append('particle', mptForm.particle);
            bodyFormData.append('yoke_sr_no', mptForm.yoke_no);
            bodyFormData.append('yoke_model_make', mptForm.yoke_model);
            bodyFormData.append('particle_batch_no', mptForm.particle_batch);
            bodyFormData.append('contrast', mptForm.contrast);
            bodyFormData.append('contrast_batch_no', mptForm.contrast_batch);

            bodyFormData.append('qc_by', localStorage.getItem('PAY_USER_ID'));
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
                    navigate('/piping/user/mpt-clearance-management');
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error.response?.data?.message || "Something went wrong.");
                setDisable(false);
            });
        }
    }

    const validation = () => {
        let isValid = true;
        const err = {};
        if (!mpt.procedure) {
            isValid = false;
            err['procedure_err'] = "Please select procedure.";
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

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Magnetic Particle Testing Clearance List", link: "/piping/user/mpt-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Magnetic Particle Testing Clearance`, active: true }
                    ]} />

                    <MptForm data={data} mptForm={mptForm} error={error} handleChange2={handleChange2} mpt={mpt} handleChange={handleChange} procedureOptions={procedureOptions} />

                    <div className='row'>
                        <div className='col-12'>
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Item Details List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    setCurrentPage(1);
                                                                }} />
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
                                                    <th>Drawing No./Lot No.</th>
                                                    <th>Rev</th>
                                                    <th>Spool No.</th>
                                                    <th>Joint No.</th>
                                                    <th>Welder No.</th>
                                                    <th>Joint Type</th>
                                                    <th>Piping Material Specification</th>
                                                    <th>Size</th>
                                                    <th>Thickness</th>
                                                    <th>Observation</th>
                                                    <th>Remarks</th>
                                                    <th>Status</th>
                                                    {data?.status === 0 && (
                                                        <th>Action</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={elem?._id || i}>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        <td>{elem?.drawing_no}</td>
                                                        <td>{elem?.drawing_rev || '-'}</td>
                                                        <td>{elem?.spool_no}</td>
                                                        <td>{elem?.joint_no}</td>
                                                        <td>{elem?.welder_no}</td>
                                                        <td>{elem?.joint_type || '-'}</td>
                                                        <td>{elem?.material_specification || '-'}</td>
                                                        <td>{elem?.size?.name}</td>
                                                        <td>{elem?.thickness?.name || elem?.thickness || '-'}</td>
                                                        {(data?.status === 2 || data?.status === 0) ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input type="text" className="form-control" value={editFormData?.observation} name='observation' onChange={handleEditFormChange} style={{ minWidth: '100px' }} />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className="form-control" value={editFormData?.qc_remarks} name='qc_remarks' rows={1} onChange={handleEditFormChange} style={{ minWidth: '150px' }} />
                                                                        </td>
                                                                        <td className=''>
                                                                            <div className='d-flex gap-2'>
                                                                                <span
                                                                                    className={`present-table attent-status ${editFormData?.status === '1' ? 'selected' : ''}`}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() => handleAcceptRejectClick(i, true, elem?.joint_no)}>
                                                                                    <Check />
                                                                                </span>
                                                                                <span
                                                                                    className={`absent-table attent-status ${editFormData?.status === '2' ? 'selected' : ''}`}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                    onClick={() => handleAcceptRejectClick(i, false, elem?.joint_no)}
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
                                                                        <td className='status-badge'>
                                                                            {(elem?.status === '1' || elem?.status === 1) ? (
                                                                                <span className="custom-badge status-green">Acc</span>
                                                                            ) : (elem?.status === '2' || elem?.status === 2) ? (
                                                                                <span className="custom-badge status-pink">Rej</span>
                                                                            ) : (
                                                                                <span className="">-</span>
                                                                            )}
                                                                        </td>
                                                                    </>
                                                                )}

                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                         {(editFormData.status === '1' || editFormData.status === 1) ? (
                                                                            <span className="custom-badge status-green">Acc</span>
                                                                        ) : (editFormData.status === '2' || editFormData.status === 2) ? (
                                                                            <span className="custom-badge status-pink">Rej</span>
                                                                        ) : (
                                                                            <span className="">-</span>
                                                                        )}
                                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                                       
                                                                    </td>
                                                                ) : (
                                                                    <td>
                                                                        <button type="button" className='btn btn-primary p-1 mx-1' onClick={() => handleEditClick(i, elem)}><i className="fa fa-pencil"></i></button>
                                                                    </td>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td>{elem?.observation || '-'}</td>
                                                                <td>{elem?.qc_remarks || '-'}</td>
                                                                <td className='status-badge'>
                                                                    {elem?.status === '1' || elem?.status === 1 ? (
                                                                        <span className="custom-badge status-green">Acc</span>
                                                                    ) : elem?.status === '2' || elem?.status === 2 ? (
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

                    <SubmitButton disable={disable} handleSubmit={handleSubmit} link={'/piping/user/mpt-clearance-management'}
                        buttonName={'Generate MPT Report'} finalReq={data?.status !== 0 ? data?.items : []} />
                </div>
            </div>
        </div>
    )
}

export default ManageMultiMptClearance