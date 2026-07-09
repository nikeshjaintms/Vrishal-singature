import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import FTClearanceForm from './components/FTClearanceForm';
import FTClearanceInstumentForm from './components/FTClearanceInstumentForm';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';

const ManageMultiFTClearance = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [rt, setRt] = useState({
        procedure: '',
    });
    const [rtForm, setRtForm] = useState({
        test_date: '',
        model_no: '',
        serial_no: '',
        make: '',
        cal_due_date: '',
    });

    const [tableData, setTableData] = useState([]);
    // const [totalItems, setTotalItems] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    // const [limit, setlimit] = useState(10);
    const data = location.state;
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        observation_12: '',
        observation_6: '',
        remarks: '',
    });
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    useEffect(() => {
        if (data?._id) {
            // Updated to handle the nested items structure shown in your log
            // (data.items[0].items)
            let items = [];
            if (Array.isArray(data?.items)) {
                if (data.items[0] && Array.isArray(data.items[0].items)) {
                    // It's the nested structure: [{ items: [...] }]
                    items = data.items[0].items;
                } else {
                    // It's the flat structure: [...]
                    items = data.items;
                }
            }

            setTableData(items);

            // Initialize accept/reject status from existing data
            const initialStatus = {};
            items.forEach((item, index) => {
                if (item.is_accepted !== undefined) {
                    initialStatus[index] = item.is_accepted;
                } else if (item.is_accepted_qc !== undefined) {
                    initialStatus[index] = item.is_accepted_qc;
                }
            });
            setAcceptRejectStatus(initialStatus);

            setRtForm({
                test_date: data?.offer_date ? moment(data?.offer_date).format('YYYY-MM-DD') : (data?.test_date ? moment(data.test_date).format('YYYY-MM-DD') : ''),
                model_no: data?.model_no || '',
                serial_no: data?.serial_no || '',
                make: data?.make || '',
                cal_due_date: data?.cal_due_date ? moment(data?.cal_due_date).format('YYYY-MM-DD') : '',
            });
            if (data?.procedure_no) {
                setRt({
                    procedure: data?.procedure_no?._id || data.procedure_no,
                });
            }
        }
    }, [data]);

    // const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
    //     let filteredData = data;
    //     filteredData = filteredData?.filter((is) => is?.is_cover === true)
    //     if (searchTerm) {
    //         filteredData = filteredData.filter(
    //             (i) =>
    //                 i?.grid_item_id?.item_name?.name?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    //                 i?.grid_item_id?.grid_id?.grid_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    //                 i?.grid_item_id?.drawing_id?.drawing_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    //                 i?.grid_item_id?.drawing_id?.rev?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    //                 i?.grid_item_id?.drawing_id?.assembly_no?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    //         );
    //     }
    //     setTotalItems(filteredData?.length);
    //     return filteredData?.slice(
    //         (currentPage - 1) * limit,
    //         (currentPage - 1) * limit + limit
    //     );
    // };

    const commentsData = useMemo(() => {
        let filteredData = tableData || [];
        if (search) {
            filteredData = filteredData.filter(
                (i) =>
                    i?.drawing_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.joint_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.spool_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.material_specification?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        // setTotalItems(filteredData?.length);
        return filteredData
    }, [search, tableData]);

    const handleChange = (e, name) => {
        setRt({ ...rt, [name]: e.value });
    }

    const handleChange2 = (e) => {
        setRtForm({ ...rtForm, [e.target.name]: e.target.value });
    }

    const handleEditClick = (index, row) => {
        if (editRowIndex === index) return;
        setEditRowIndex(index);
        setEditFormData({
            observation_12: row.observation_12 || '',
            observation_6: row.observation_6 || '',
            remarks: row.remarks || '',
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
        const dataIndex = editRowIndex;
        updatedData[dataIndex] = {
            ...updatedData[dataIndex],
            ...editFormData,
            is_accepted_qc: acceptRejectStatus[editRowIndex] ?? updatedData[dataIndex].is_accepted_qc
        };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleSubmit = () => {
        if (validation()) {
            let updatedData = tableData || [];

            const filteredData = updatedData?.map((item, index) => {
                return {
                    item_id: item?.item_id || item?._id,
                    drawing_id: item?.drawing_id,
                    spool_no_id: item?.spool_no_id,
                    joint_id: item?.joint_id,
                    joint_type_id: item?.joint_type_id,
                    size_id: item?.size_id,
                    thickness_id: item?.thickness_id,
                    piping_material_specification_id: item?.piping_material_specification_id || item?.material_specification_id,
                    observation_12: item.observation_12,
                    observation_6: item.observation_6,
                    remarks: item.remarks || '',
                    is_accepted: acceptRejectStatus[index] === true
                };
            });

            setDisable(true);
            const myurl = `${V_URL}/user/piping-update-multi-ft-inspection`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('ndt_offer_no', data?._id);
            bodyFormData.append('test_date', rtForm.test_date)
            bodyFormData.append('procedure_no', rt.procedure);
            bodyFormData.append('model_no', rtForm.model_no);
            bodyFormData.append('serial_no', rtForm.serial_no);
            bodyFormData.append('make', rtForm.make);
            bodyFormData.append('cal_due_date', rtForm.cal_due_date);
            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project_name', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            bodyFormData.append('items', JSON.stringify(filteredData));

            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/FT-clearance-management');
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

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "FT Clearance List", link: "/piping/user/FT-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} FT Clearance`, active: true }
                    ]} />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>Ferrite Test Clearance Details</h4>
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
                                                    <label> FT Offer No.</label>
                                                    <input type='text' className='form-control' value={data?.report_no || data?.ndt_offer_no?.ndt_offer_no} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <FTClearanceForm rt={rt} rtForm={rtForm} handleChange={handleChange} handleChange2={handleChange2} error={error} data={data} />




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
                                                <h4>Instrument Details</h4>
                                            </div>
                                        </div>

                                        {/* Row 1: Model No & Serial No */}
                                        <div className="row">
                                            <div className="col-6 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Model No.</label>
                                                    <input type="text" className="form-control" name='model_no' value={rtForm.model_no} onChange={handleChange2} />
                                                </div>
                                            </div>

                                            <div className="col-6 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Serial No.</label>
                                                    <input type="text" className="form-control" name='serial_no' value={rtForm.serial_no} onChange={handleChange2} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Make & Calibration Due Date */}
                                        <div className="row mt-3">
                                            <div className="col-6 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Make</label>
                                                    <input type="text" className="form-control" name='make' value={rtForm.make} onChange={handleChange2} />
                                                </div>
                                            </div>

                                            <div className="col-6 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Calibration Due Date</label>
                                                    <input type="date" className="form-control" name='cal_due_date' value={rtForm.cal_due_date} onChange={handleChange2} />
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
                                                    <h3>Item Details List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    // setCurrentPage(1);
                                                                }} />
                                                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="table-responsive" style={{ minHeight: 0 }}>
                                        <table className="table border-0 custom-table comman-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th rowSpan="2">Sr.</th>
                                                    <th rowSpan="2">Drawing No/Line No</th>
                                                    <th rowSpan="2">Rev</th>
                                                    <th rowSpan="2">Spool No.</th>
                                                    <th rowSpan="2">Joint No.</th>
                                                    <th rowSpan="2">Size</th>
                                                    <th rowSpan="2">Thickness</th>
                                                    <th rowSpan="2">Piping Material Specification</th>
                                                    <th rowSpan="2">Size</th>
                                                    <th rowSpan="2">Thickness</th>
                                                    <th rowSpan="2">Joint Type</th>

                                                    {/* === Observation with 2 sub-columns === */}
                                                    <th colSpan="2" className="text-center">
                                                        Observation (Fe% / FN)
                                                    </th>

                                                    <th rowSpan="2">Remarks</th>
                                                    <th rowSpan="2">Action</th>
                                                </tr>

                                                {/* Sub Header Row */}
                                                <tr>
                                                    <th className="text-center">12'O Clock</th>
                                                    <th className="text-center">6'O Clock</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {commentsData?.map((item, index) => (
                                                    <tr key={item?.item_id || item?._id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item?.drawing_no}</td>
                                                        <td>{item?.rev}</td>
                                                        <td>{item?.spool_no || '-'}</td>
                                                        <td>{item?.joint_no}</td>
                                                        <td>{item?.size}</td>
                                                        <td>{item?.thickness}</td>
                                                        <td>{item?.material_specification || '-'}</td>
                                                        <td>{item?.size}</td>
                                                        <td>{item?.thickness}</td>
                                                        <td>{item?.joint_type || '-'}</td>


                                                        {/* Observation 12 */}
                                                        <td onClick={() => handleEditClick(index, item)} style={{ cursor: 'pointer' }}>
                                                            {editRowIndex === index ? (
                                                                <input
                                                                    type="text"
                                                                    className="form-control w-auto"
                                                                    name="observation_12"
                                                                    value={editFormData.observation_12}
                                                                    onChange={handleEditFormChange}
                                                                />
                                                            ) : (
                                                                <span>{item.observation_12 || "-"}</span>
                                                            )}
                                                        </td>

                                                        {/* Observation 6 */}
                                                        <td onClick={() => handleEditClick(index, item)} style={{ cursor: 'pointer' }}>
                                                            {editRowIndex === index ? (
                                                                <input
                                                                    type="text"
                                                                    className="form-control w-auto"
                                                                    name="observation_6"
                                                                    value={editFormData.observation_6}
                                                                    onChange={handleEditFormChange}
                                                                />
                                                            ) : (
                                                                <span>{item.observation_6 || "-"}</span>
                                                            )}
                                                        </td>

                                                        {/* Remarks */}
                                                        <td onClick={() => handleEditClick(index, item)} style={{ cursor: 'pointer' }}>
                                                            {editRowIndex === index ? (
                                                                <textarea
                                                                    className="form-control"
                                                                    name="remarks"
                                                                    value={editFormData.remarks}
                                                                    onChange={handleEditFormChange}
                                                                    rows="1"
                                                                />
                                                            ) : (
                                                                <span>{item.remarks || "-"}</span>
                                                            )}
                                                        </td>

                                                        {/* Action Column (Accept/Reject + Status + Save/Edit) */}
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                {editRowIndex === index ? (
                                                                    <>
                                                                        <div className="d-flex gap-1">
                                                                            <span
                                                                                className={`present-table attent-status ${acceptRejectStatus[index] === true ? "selected" : ""}`}
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => handleAcceptRejectClick(index, true, "Joint")}
                                                                            >
                                                                                <Check size={14} />
                                                                            </span>
                                                                            <span
                                                                                className={`absent-table attent-status ${acceptRejectStatus[index] === false ? "selected" : ""}`}
                                                                                style={{ cursor: "pointer" }}
                                                                                onClick={() => handleAcceptRejectClick(index, false, "Joint")}
                                                                            >
                                                                                <X size={14} />
                                                                            </span>
                                                                        </div>
                                                                        <div className="ms-2 d-flex gap-1">
                                                                            <button type="button" className="btn btn-success btn-sm p-1" onClick={handleSaveClick}>
                                                                                <Save size={14} />
                                                                            </button>
                                                                            <button type="button" className="btn btn-secondary btn-sm p-1" onClick={handleCancelClick}>
                                                                                <X size={14} />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div
                                                                            className="d-flex align-items-center gap-2"
                                                                        >
                                                                            <span>
                                                                                {acceptRejectStatus[index] !== undefined
                                                                                    ? acceptRejectStatus[index] ? "Accepted" : "Rejected"
                                                                                    : "-"}
                                                                            </span>
                                                                            {acceptRejectStatus[index] === true ? (
                                                                                <span className="custom-badge status-green">Acc</span>
                                                                            ) : acceptRejectStatus[index] === false ? (
                                                                                <span className="custom-badge status-pink">Rej</span>
                                                                            ) : null}
                                                                        </div>
                                                                        {/* <button
                                                                            type="button"
                                                                            className="btn btn-primary btn-sm p-1 ms-auto"
                                                                            
                                                                        >
                                                                            Edit
                                                                        </button> */}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>



                                    </div>
                                    <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                            {/* <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div> */}
                                        </div>
                                        {/* <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="DataTables_Table_0_paginate">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={(page) => setCurrentPage(page)}
                                                />
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SubmitButton handleSubmit={handleSubmit} link={'/piping/user/FT-clearance-management'}
                        buttonName={'Generate FT Report'} />

                </div>
            </div>
        </div>
    )
}

export default ManageMultiFTClearance