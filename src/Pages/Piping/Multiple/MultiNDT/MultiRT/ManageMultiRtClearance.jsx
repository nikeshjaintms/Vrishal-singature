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
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';

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
        screen: "",
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
    const is_view = location.state?.is_view;


    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        SFD: '', expo_time: '', technique: '',
        observations: [{ segment: '', film_size: '', observation: '' }],
        is_accepted_qc: '', qc_remarks: '', test_type: ''
    });

    useEffect(() => {
        if (data?._id) {
            const items = data?.items || [];
            // If data contains is_cover, filter it; otherwise take all items
            const filterItems = items.some(e => e.hasOwnProperty('is_cover'))
                ? items.filter((e) => e?.is_cover === true)
                : items;
            const mappedItems = filterItems.map(item => {
                const segments = item.segment || [];
                const filmSizes = item.film_size || [];
                const observations = item.observation || [];

                const mergedObservations = segments.map((seg, index) => ({
                    segment: seg || '',
                    film_size: filmSizes[index] || '',
                    observation: observations[index] || '',
                    is_accepted_qc: item.status ? String(item.status) : ''
                }));

                return {
                    ...item,
                    SFD: item.sfd || item.SFD || '',
                    expo_time: item.expo_time || '',
                    technique: item.technique || '',
                    observations: mergedObservations.length
                        ? mergedObservations
                        : [{ segment: '', film_size: '', observation: '', is_accepted_qc: '' }],
                    is_accepted_qc: item.status ? String(item.status) : ''
                };
            });

            setTableData(mappedItems);
            if (data?._id) {
                setRt({
                    procedure: data?.procedure_no?._id || data?.procedure_no,
                });
                setRtForm({
                    test_date: data?.test_date ? moment(data?.test_date).format('YYYY-MM-DD') : '',
                    source: data?.source,
                    film_type: data?.film_type ?? data.film ?? '',
                    strength: data?.strength ?? data?.strenght ?? '',
                    screen: data?.screen,
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
        if (searchTerm) {
            filteredData = filteredData.filter(
                (i) =>
                    i?.drawing_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.spool_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.joint_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.welder_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.item_name?.name?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.grid_id?.grid_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                    i?.grid_item_id?.drawing_id?.drawing_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
            );
        }
        setTotalItems(filteredData?.length || 0);
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
            is_accepted_qc: row.is_accepted_qc || (row.is_accepted ? '1' : ''),
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

        // Propagate the joint-level status to all observations
        const updatedObservations = editFormData.observations.map(obs => ({
            ...obs,
            is_accepted_qc: editFormData.is_accepted_qc
        }));

        updatedData[dataIndex] = {
            ...updatedData[dataIndex],
            ...editFormData,
            observations: updatedObservations,
            is_accepted: editFormData.is_accepted_qc === '1'
        };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    console.log("edit foem data", editFormData);

    const handleSubmit = () => {
        if (validation()) {

             const hasAtLeastOneAction = tableData?.some(item =>
            ["1", "2", "3", "4"].includes(item?.is_accepted_qc) ||
            item?.observations?.some(obs =>
                ["1", "2", "3", "4"].includes(obs?.is_accepted_qc)
            )
        );

        if (!hasAtLeastOneAction) {
            toast.error("Please accept or reject at least one item before submitting.");
            return;
        }

            let updatedData = tableData || [];
            let isValid = true;
            let InvalidItem = null;

            updatedData?.forEach(item => {
                const requiredFields = [
                    'SFD',
                    'expo_time',
                    'technique',
                    'is_accepted_qc',
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
                        (!obs.observation || obs.observation.trim() === '')
                    ) {
                        isValid = false;
                        InvalidItem = item;
                    }
                });
            });

            // if (!isValid) {
            //     toast.error(`Please fill all the fields for ${InvalidItem.grid_item_id.item_name.name}.`);
            //     return;
            // }

            const filteredData = updatedData?.map(item => {
                const hasRejectedObservation = item.observations?.some(obs => obs.is_accepted_qc !== "1" && obs.is_accepted_qc !== "");
                const allAccepted = item.observations?.length > 0 && item.observations?.every(obs => obs.is_accepted_qc === "1");
                return {
                    _id: item?._id,
                    drawing_id: item?.drawing_id?._id || item?.drawing_id,
                    spool_id: item?.spool_id?._id || item?.spool_id,
                    joint_id: item?.joint_id?._id || item?.joint_id,
                    spool_no: item?.spool_no,
                    joint_no: item?.joint_no,
                    SFD: item.SFD,
                    expo_time: item.expo_time,
                    technique: item.technique,
                    observation: item.observations,
                    ndt_master_id: item.ndt_master_id?._id,
                    // is_cover: item.is_cover,
                    rt_lot_id: item.rt_lot_id,
                    rt_lot_item_id: item.rt_lot_item_id,
                    is_accepted_qc: item.is_accepted_qc,
                    test_type: item.test_type,
                    is_accepted: item.is_accepted_qc === '1'
                };
            });

            setDisable(true);
            const myurl = `${V_URL}/user/piping/rt-generate-offer`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('inspection_id', data?._id);

            bodyFormData.append('test_date', rtForm.test_date)
            bodyFormData.append('procedure_no', rt.procedure);
            bodyFormData.append('source', rtForm.source);
            bodyFormData.append('film_type', rtForm.film_type);
            bodyFormData.append('strength', rtForm.strength);
            bodyFormData.append('screen', rtForm.screen);
            bodyFormData.append('sensitivity', rtForm.sensivity);
            bodyFormData.append('density', rtForm.density);
            bodyFormData.append('penetrameter', rtForm.penetrameter);
            bodyFormData.append('front', rtForm.front);
            bodyFormData.append('back', rtForm.back);
            bodyFormData.append('acceptance_standard', rtForm.acc_standard);
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
                    navigate('/piping/user/rt-clearance-management');
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
    const removeObservation = (index) => {
        const updated = [...editFormData.observations];
        updated.splice(index, 1);
        setEditFormData({ ...editFormData, observations: updated });
    };

    const getRtDisplay = (elem) => {
    const inspectionLabelMap = {
        2: 'RP',
        3: 'RT',
        4: 'RS'
        // "Initial" intentionally not included
    };

    const joint = elem?.joint_no || '';

    let label;

    if (elem?.old_test_type === 'External') {
        label = inspectionLabelMap[elem?.old_status];
    }

    // 👉 If no label, return only joint_no
    if (!label) return joint;

    return joint ? `${label} | ${joint}` : label;
};

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Radiography Test Clearance List", link: "/piping/user/rt-clearance-management", active: false },
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
                                            {/* {data?.status !== 2 && (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Magnetic Particle Testing Clearance No.</label>
                                                        <input className='form-control' value={data?.test_inspect_no} readOnly />
                                                    </div>
                                                </div>
                                            )} */}
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Radiography Test Offer No.</label>
                                                    <input type='text' className='form-control' value={data?.offer_no || (data?.status === 2 ? data?.ndt_offer_no : data?.ndt_offer_no?.ndt_offer_no)} readOnly />
                                                </div>
                                            </div>
                                            {data?.report_no && (
                                             <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Radiography Report No.</label>
                                                    <input type='text' className='form-control' value={data?.report_no || (data?.status === 2 ? data?.ndt_offer_no : data?.ndt_offer_no?.ndt_offer_no)} readOnly />
                                                </div>
                                            </div>
                                            )}
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
                                                    <h3>Item Details List</h3>
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
                                        <table className="table border-0 custom-table comman-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Drawing No./Lot No.</th>
                                                    <th>Spool No.</th>
                                                    <th>Joint No.</th>
                                                    <th>Welder No.</th>
                                                    <th>Size</th>
                                                    <th>Thickness</th>
                                                    <th>SFD</th>
                                                    <th>Expo Time</th>
                                                    <th>Technique</th>
                                                    <th>Segment / Film Size / Observation</th>
                                                    <th>Status</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {commentsData?.map((elem, i) => {
                                                    const isEditing = editRowIndex === i;
                                                    return (
                                                        <tr key={elem?._id || i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.drawing_no}</td>
                                                            <td>{elem?.spool_no}</td>
                                                            <td>{getRtDisplay(elem)}</td>
                                                            <td>{elem?.welder_no}</td>
                                                            <td>{elem?.size?.name || (typeof elem?.size === 'string' ? elem?.size : '-')}</td>
                                                            <td>{elem?.thickness?.name || (typeof elem?.thickness === 'string' ? elem?.thickness : '-')}</td>

                                                            {isEditing ? (
                                                                <>
                                                                    <td><input type="text" name="SFD" className="form-control w-auto" placeholder="SFD" value={editFormData.SFD} onChange={handleEditFormChange} /></td>
                                                                    <td><input type="text" name="expo_time" className="form-control w-auto" placeholder="Expo Time" value={editFormData.expo_time} onChange={handleEditFormChange} /></td>
                                                                    <td><input type="text" name="technique" className="form-control w-auto" placeholder="Technique" value={editFormData.technique} onChange={handleEditFormChange} /></td>

                                                                    <td>
                                                                        {editFormData.observations.map((obs, idx) => (
                                                                            <div key={idx} className="d-flex align-items-center gap-2 mb-2">
                                                                                <input
                                                                                    type="text"
                                                                                    name="segment"
                                                                                    placeholder="Segment"
                                                                                    className="form-control"
                                                                                    value={obs.segment}
                                                                                    onChange={(e) => handleObservationChange(idx, e)}
                                                                                    style={{ width: "100px" }}
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    name="film_size"
                                                                                    placeholder="Film Size"
                                                                                    className="form-control"
                                                                                    value={obs.film_size}
                                                                                    onChange={(e) => handleObservationChange(idx, e)}
                                                                                    style={{ width: "100px" }}
                                                                                />
                                                                                <input
                                                                                    type="text"
                                                                                    name="observation"
                                                                                    placeholder="Observation"
                                                                                    className="form-control"
                                                                                    value={obs.observation}
                                                                                    onChange={(e) => handleObservationChange(idx, e)}
                                                                                    style={{ width: "120px" }}
                                                                                />


                                                                                {idx === editFormData.observations.length - 1 && (
                                                                                    <button type="button" className="btn btn-sm btn-primary" onClick={addObservation}>+</button>
                                                                                )}
                                                                                {editFormData.observations.length > 1 && (
                                                                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeObservation(idx)}>x</button>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            name="is_accepted_qc"
                                                                            className="form-control form-select"
                                                                            value={editFormData.is_accepted_qc}
                                                                            onChange={handleEditFormChange}
                                                                            style={{ width: "110px" }}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            <option value="1">Accepted</option>
                                                                            <option value="2">Repair</option>
                                                                            <option value="3">Re-take</option>
                                                                            <option value="4">Re-shoot</option>
                                                                        </select>

                                                                        {["2", "3", "4"].includes(editFormData.is_accepted_qc) && (
                                                                            <select
                                                                                name="test_type"
                                                                                className="form-control form-select"
                                                                                value={editFormData.test_type}
                                                                                onChange={handleEditFormChange}
                                                                                style={{ marginTop: '5px', width: "110px" }}
                                                                            >
                                                                                <option value="">Select Test Type</option>
                                                                                <option value="Internal">Internal</option>
                                                                                <option value="External">External</option>
                                                                            </select>
                                                                        )}
                                                                    </td>
                                                                    <td><textarea name="qc_remarks" className="form-control" placeholder="Remarks" rows="1" value={editFormData.qc_remarks} onChange={handleEditFormChange}></textarea></td>
                                                                    <td className="text-end">
                                                                        <div className='d-flex'>
                                                                            <button className="btn btn-success btn-sm mx-1" onClick={handleSaveClick}><Check size={14} /></button>
                                                                            <button className="btn btn-danger btn-sm mx-1" onClick={handleCancelClick}><X size={14} /></button>
                                                                        </div>
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td>{elem?.SFD || '-'}</td>
                                                                    <td>{elem?.expo_time || '-'}</td>
                                                                    <td>{elem?.technique || '-'}</td>
                                                                    <td>
                                                                        {elem?.observations?.map((obs, idx) => (
                                                                            <div key={idx} className="mb-1 small">
                                                                                {obs.segment} | {obs.film_size} | {obs.observation} | {obs.is_accepted_qc}
                                                                            </div>
                                                                        )) || '-'}
                                                                    </td>
                                                                    <td>
                                                                        {elem?.is_accepted_qc === '1' || (elem?.observations?.length > 0 && elem?.observations.every(o => o.is_accepted_qc === '1')) ? (
                                                                            <span className="custom-badge status-green">Accepted</span>
                                                                        ) : elem?.is_accepted_qc === '2' || (elem?.observations?.length > 0 && elem?.observations.some(o => o.is_accepted_qc === '2')) ? (
                                                                            <span className="custom-badge status-orange">Repair</span>
                                                                        ) : elem?.is_accepted_qc === '3' || (elem?.observations?.length > 0 && elem?.observations.some(o => o.is_accepted_qc === '3')) ? (
                                                                            <span className="custom-badge status-yellow">Re-take</span>
                                                                        ) : elem?.is_accepted_qc === '4' || (elem?.observations?.length > 0 && elem?.observations.some(o => o.is_accepted_qc === '4')) ? (
                                                                            <span className="custom-badge status-yellow">Re-shoot</span>
                                                                        ) : (
                                                                            <span className="custom-badge status-orange">Pending</span>
                                                                        )}
                                                                    </td>
                                                                    <td>{elem?.qc_remarks || '-'}</td>
                                                                    <td className="text-end">
                                                                        {!is_view && <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(i, elem)}>Edit</button>}
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    );
                                                })}
                                                {commentsData?.length === 0 && (
                                                    <tr>
                                                        <td colSpan="14" className="text-center">No items found</td>
                                                    </tr>
                                                )}
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
                    {!is_view &&
                        <SubmitButton disable={disable} handleSubmit={handleSubmit} link={'/piping/user/rt-clearance-management'}
                            buttonName={'Generate RT Report'} finalReq={(data?.status === 3 || data?.status === 4 || data?.status === 5) ? data?.items : []} />
                    }
                </div>
            </div>
        </div>
    )
}

export default ManageMultiRtClearance