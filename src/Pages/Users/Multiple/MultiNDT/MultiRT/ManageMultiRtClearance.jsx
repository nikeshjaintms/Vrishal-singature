import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import RtClearanceForm from './components/RtClearanceForm';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';

const ManageMultiRtClearance = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [rt, setRt] = useState({
        procedure: '',
    });
    const [rtForm, setRtForm] = useState({
        test_date: '',
        source: '',
        film_type: '',
        strength: '',
        sensivity: '',
        density: '',
        penetrameter: '',
        front: '',
        back: '',
        acc_standard: '',
    });

    const [tableData, setTableData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const data = location.state;
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        SFD: '', expo_time: '', technique: '',
        observations: [{ segment: '', film_size: '', observation: '', is_accepted_qc: '' }],
        is_accepted_qc: '', qc_remarks: '',
    });
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    useEffect(() => {
        if (data?._id) {
            const filterItems = data?.items?.filter((e) => e?.is_cover === true);
            setTableData(filterItems);
            if (data?.status !== 2) {
                setRt({
                    procedure: data?.procedure_no?._id,
                });
                setRtForm({
                    test_date: data?.test_date ? moment(data?.test_date).format('YYYY-MM-DD') : '',
                    source: data?.source,
                    film_type: data?.film_type,
                    strength: data?.strength,
                    sensivity: data?.sensitivity,
                    density: data?.density,
                    penetrameter: data?.penetrameter,
                    front: data?.front,
                    back: data?.back,
                    acc_standard: data?.acceptance_standard,
                })
            }
        }
    }, [data]);

    const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
        let filteredData = data;
        filteredData = filteredData?.filter((is) => is?.is_cover === true)
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

    const handleChange = (e, name) => {
        setRt({ ...rt, [name]: e.value });
    }

    const handleChange2 = (e) => {
        setRtForm({ ...rtForm, [e.target.name]: e.target.value });
    }

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            SFD: row.SFD,
            expo_time: row.expo_time,
            technique: row.technique,
            observations: row.observations?.length ? row.observations : [{ segment: '', film_size: '', observation: '', is_accepted_qc: '' }],
            is_accepted_qc: '',
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

    const handleObservationChange = (index, e) => {
        const { name, value } = e.target;
        const updatedObservations = [...editFormData.observations];
        updatedObservations[index][name] = value;
        setEditFormData({ ...editFormData, observations: updatedObservations });
    };

    const addObservation = () => {
        setEditFormData({
            ...editFormData,
            observations: [...editFormData.observations, { segment: '', film_size: '', observation: '', is_accepted_qc: '' }]
        });
    };

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
            let updatedData = tableData || [];
            let isValid = true;
            let InvalidItem = null;

            updatedData?.forEach(item => {
                const requiredFields = [
                    'SFD',
                    'expo_time',
                    'technique',
                ];
                requiredFields?.forEach(field => {
                    if ((!item[field] || item[field].trim() === '') && isValid) {
                        isValid = false;
                        InvalidItem = item;
                    }
                });

                item?.observations?.forEach(obs => {
                    if (
                        (!obs.segment || obs.segment.trim() === '') ||
                        (!obs.film_size || obs.film_size.trim() === '') ||
                        (!obs.observation || obs.observation.trim() === '') ||
                        (!obs.is_accepted_qc || obs.is_accepted_qc.trim() === '')
                    ) {
                        isValid = false;
                        InvalidItem = item;
                    }
                });
            });

            if (!isValid) {
                toast.error(`Please fill all the fields for ${InvalidItem.grid_item_id.item_name.name}.`);
                return;
            }

            const filteredData = updatedData?.map(item => {
                const hasRejectedObservation = item.observations.some(obs => obs.is_accepted_qc === "Rejected");
                return {
                    grid_item_id: item?.grid_item_id?._id,
                    grid_id: item?.grid_item_id?.grid_id?._id,
                    drawing_id: item?.grid_item_id?.drawing_id?._id,
                    joint_type: item.joint_type.map(e => e._id),
                    weldor_no: item.weldor_no?._id,
                    wps_no: item.wps_no?._id,
                    offer_used_grid_qty: item.offer_used_grid_qty,
                    offer_balance_qty: item.offer_balance_qty,
                    qc_remarks: item.qc_remarks || '',
                    thickness: item.thickness,
                    SFD: item.SFD,
                    expo_time: item.expo_time,
                    technique: item.technique,
                    observation: item.observations,
                    ndt_master_id: item.ndt_master_id?._id,
                    is_cover: item.is_cover,
                    is_accepted: !hasRejectedObservation
                };
            });

            setDisable(true);
            const myurl = `${V_URL}/user/manage-multi-rt-report`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', data?._id);

            bodyFormData.append('test_date', rtForm.test_date)
            bodyFormData.append('procedure_no', rt.procedure);
            bodyFormData.append('source', rtForm.source);
            bodyFormData.append('film_type', rtForm.film_type);
            bodyFormData.append('strength', rtForm.strength);
            bodyFormData.append('sensitivity', rtForm.sensivity);
            bodyFormData.append('density', rtForm.density);
            bodyFormData.append('penetrameter', rtForm.penetrameter);
            bodyFormData.append('front', rtForm.front);
            bodyFormData.append('back', rtForm.back);
            bodyFormData.append('acceptance_standard', rtForm.acc_standard);
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
                    navigate('/user/project-store/rt-clearance-management');
                }
            }).catch((error) => {
                toast.error("Something went wrong." || error.response.data?.message);
            }).finally(() => { setDisable(false); })
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!rt.procedure) {
            isValid = false;
            err['procedure_err'] = 'Please select procedure';
        }
        if (!rtForm.test_date) {
            isValid = false;
            err['test_date_err'] = 'Please select test date';
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
                        { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                        { name: "Radiography Test Clearance List", link: "/user/project-store/rt-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Radiography Test Clearance`, active: true }
                    ]} />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>Radiography Test Clearance Details</h4>
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
                                                    <label> Radiography Test Offer No.</label>
                                                    <input type='text' className='form-control' value={data?.status === 2 ? data?.ndt_offer_no : data?.ndt_offer_no?.ndt_offer_no} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <RtClearanceForm rt={rt} rtForm={rtForm} handleChange={handleChange} handleChange2={handleChange2} error={error} data={data} />

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
                                                    <th>SFD</th>
                                                    <th>Expo Time</th>
                                                    <th>Technique</th>
                                                    <th>Segment/Flim Size/Observation</th>
                                                    <th>Remarks</th>
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
                                                        <td>{elem?.offer_used_grid_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name).join(', ')}</td>
                                                        <td>{elem?.wps_no?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        <td>{elem?.thickness}</td>
                                                        {data?.status === 2 ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input type="text" className="form-control w-auto" value={editFormData?.SFD} name='SFD' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control w-auto" value={editFormData?.expo_time} name='expo_time' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" className="form-control w-auto" value={editFormData?.technique} name='technique' onChange={handleEditFormChange} />
                                                                        </td>
                                                                        <td>
                                                                            {editFormData.observations.map((obs, idx) => (
                                                                                <div key={idx} className="d-flex gap-2">
                                                                                    <input type="text" className="form-control w-auto" placeholder="Segment" name="segment" value={obs.segment} onChange={(e) => handleObservationChange(idx, e)} />
                                                                                    <input type="text" className="form-control w-auto" placeholder="Film Size" name="film_size" value={obs.film_size} onChange={(e) => handleObservationChange(idx, e)} />
                                                                                    <input type="text" className="form-control w-auto" placeholder="Observation" name="observation" value={obs.observation} onChange={(e) => handleObservationChange(idx, e)} />
                                                                                    <select className="form-control w-auto form-select" name="is_accepted_qc" value={obs.is_accepted_qc} onChange={(e) => handleObservationChange(idx, e)}>
                                                                                        <option value="">Select</option>
                                                                                        <option value="Accepted">Accepted</option>
                                                                                        <option value="Rejected">Rejected</option>
                                                                                    </select>
                                                                                </div>
                                                                            ))}
                                                                            <button type="button" className="btn btn-primary mt-1" onClick={addObservation}><i className="fa-solid fa-plus"></i></button>
                                                                        </td>
                                                                        <td>
                                                                            <textarea className="form-control" value={editFormData?.qc_remarks} name='qc_remarks' rows={1} onChange={handleEditFormChange} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.SFD || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.expo_time || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.technique || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.observations?.map(o => `${o.segment}, ${o.film_size}, ${o.observation}, ${o.is_accepted_qc}`).join(' | ') || '-'}</td>
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
                                                                <td>{elem?.SFD || '-'}</td>
                                                                <td>{elem?.expo_time || '-'}</td>
                                                                <td>{elem?.technique || '-'}</td>
                                                                {/* <td>{elem?.segment || '-'}</td>
                                                                <td>{elem?.film_size || '-'}</td>
                                                                <td>{elem?.observation || '-'}</td> */}
                                                                <td>{elem?.observation?.map(o => `${o.segment}, ${o.film_size}, ${o.observation}, ${o.is_accepted_qc}`).join(' | ') || '-'}</td>
                                                                <td>{elem?.qc_remarks || '-'}</td>
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

                    <SubmitButton disable={disable} handleSubmit={handleSubmit} link={'/user/project-store/rt-clearance-management'}
                        buttonName={'Generate RT Report'} finalReq={data?.status !== 2 ? data?.items : []} />

                </div>
            </div>
        </div>
    )
}

export default ManageMultiRtClearance