import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { getUserAdminDraw } from '../../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../../../Store/Store/WpsMaster/WpsMaster';
import { Check, Save, Tally1, X } from 'lucide-react';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';

const ManageMultiClearFitup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
    const data = location.state;

    useEffect(() => {
        dispatch(getUserAdminDraw());
        dispatch(getUserWpsMaster({ status: true }));
    }, []);

    useEffect(() => {
        if (data) {
            setTableData(data?.items);
        }
    }, [data]);

    const drawData = useSelector((state) => state?.getUserAdminDraw?.user?.data?.data);
    const wpsData = useSelector((state) => state?.getUserWpsMaster?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = tableData || [];
        if (search) {
            computedComments = computedComments.filter((item) =>
                item?.grid_item_id?.item_name?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments;
    }, [currentPage, search, limit, tableData]);

    const getDrawing = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        wps_no: '',
        qc_remarks: '',
        wpsName: '',
        is_accepted: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            wps_no: row.wps_no,
            qc_remarks: row.qc_remarks,
            wpsName: wpsData.find(w => w._id === row.wps_no)?.wpsNo,
            is_accepted: ''
        });
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        const selectedWPS = wpsData.find(wp => wp._id === value);
        if (name === 'wps_no' || name === 'wpsName') {
            setEditFormData({ ...editFormData, wps_no: value, wpsName: selectedWPS?.wpsNo });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    }

    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData, is_accepted: acceptRejectStatus[editRowIndex] };
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
                // setAcceptRejectStatus((prev) => ({
                //     ...prev,
                //     [index]: isAccepted,
                // }));

                const updatedTableData = [...tableData];
                const updatedStatus = { ...acceptRejectStatus };

                const targetItem = updatedTableData[index];

                if (!targetItem) return;

                const { drawing_id, grid_item_id } = targetItem;

                updatedTableData.forEach((item, i) => {
                    if (item.drawing_id === drawing_id && item.grid_item_id?.grid_id?._id === grid_item_id?.grid_id?._id) {
                        item.is_accepted = isAccepted; // Update tableData is_accepted value
                        updatedStatus[i] = isAccepted;
                    }
                });

                setTableData(updatedTableData);
                setAcceptRejectStatus(updatedStatus);
                toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
            }
        });
    };

    const handleSubmit = () => {
        let updatedData = tableData;
        let isValid = true;
        updatedData?.forEach(item => {
            if (item.wps_no === '' || item.wps_no === undefined) {
                isValid = false;
                toast.error(`Please select wps no. for ${item?.grid_item_id?.item_name?.name}`);
            }
            if (item.is_accepted === '' || item.is_accepted === undefined) {
                isValid = false;
                toast.error(`Please accept or reject for (${item?.grid_item_id?.item_name?.name})-(${item?.grid_item_id?.grid_id?.grid_no}-${item?.grid_item_id?.grid_id?.grid_qty})`);

            }
        })

        if (!isValid) {
            return;
        }
        const filteredData = updatedData?.map(item => ({
            ...item,
            grid_item_id: item.grid_item_id?._id,
            wps_no: item.wps_no,
            joint_type: item.joint_type?.map((e) => e?._id),
            qc_remarks: item.qc_remarks || '',
        }))

        setDisable(true);
        const myurl = `${V_URL}/user/verify-fitup-offer`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', data?._id);
        bodyFormData.append('items', JSON.stringify(filteredData))
        bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data?.success === true) {
                toast.success(response.data.message);
                localStorage.removeItem('FIT_OFF_DATA');
                navigate('/user/project-store/fitup-clearance-management');
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message);
        }).finally(() => { setDisable(false) });
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
                        { name: "Fit-Up Clearance List", link: "/user/project-store/fitup-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Fit-Up Clearance Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Fitup Offer List <span className="login-danger">*</span></label>
                                                    <input value={data?.report_no} className='form-control' readOnly />
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
                            <div className="card card-table show-entire">
                                <div className="card-body">

                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Fitup Clearance List</h3>
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
                                                {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive mt-2">
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Drawing No.</th>
                                                    <th>Rev</th>
                                                    <th>As. No.</th>
                                                    <th>As. Qty.</th>
                                                    <th>Section Details</th>
                                                    <th>Item No.</th>
                                                    <th>Quantity</th>
                                                    <th>Grid No.</th>
                                                    <th>Grid Qty.</th>
                                                    <th>Joint Type</th>
                                                    <th>Acc/Rej</th>
                                                    <th>WPS No.</th>
                                                    <th>Remarks</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        {/* <td>{getDrawing(elem?.drawing_id)?.drawing_no} || {getDrawing(elem?.items?.grid_item_id?.drawing_id?.drawing_no)}</td> */}
                                                        <td>{elem?.grid_item_id?.drawing_id?.drawing_no ||  "-"}</td>
                                                        {/* <td>{getDrawing(elem?.drawing_id)?.rev}</td> */}
                                                        <td>{elem?.grid_item_id?.drawing_id?.rev}</td>
                                                        {/* <td>{getDrawing(elem?.drawing_id)?.assembly_no}</td> */}
                                                        <td>{elem?.grid_item_id?.drawing_id?.assembly_no ||  "-"}</td>
                                                        {/* <td>{getDrawing(elem?.drawing_id)?.assembly_quantity}</td> */}
                                                        <td>{elem?.grid_item_id?.drawing_id?.assembly_quantity ||  "-"}</td>
                                                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                        <td>{elem?.grid_item_id?.item_no}</td>
                                                        <td>{elem?.grid_item_id?.item_qty}</td>
                                                        <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                        <td>{elem?.fitOff_used_grid_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name)?.join(', ')}</td>
                                                        {editRowIndex === i ? (
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
                                                        ) : (
                                                            <td onClick={() => handleEditClick(i, elem)}>-</td>
                                                        )}
                                                        {editRowIndex === i ? (
                                                            <>
                                                                <td>
                                                                    <select className='form-control form-select table-select'
                                                                        value={editFormData.wps_no} name='wps_no'
                                                                        onChange={handleEditFormChange}>
                                                                        <option value="">WPS No.</option>
                                                                        {wpsData?.filter((wps) => {
                                                                            const elemJointIds = elem.joint_type?.map((e) => e._id) || [];
                                                                            const wpsJointIds = wps.jointType?.map((joint) => joint.jointId?._id) || [];
                                                                            return elemJointIds.every((id) => wpsJointIds.includes(id));
                                                                        }).map((e) => (
                                                                            <option key={e._id} value={e._id}>
                                                                                {e.wpsNo}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <textarea className='form-control' onChange={handleEditFormChange} name='qc_remarks' value={editFormData?.qc_remarks} rows={1} />
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.wpsName || '-'}</td>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
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
                                                    </tr>
                                                )}

                                                {commentsData?.length === 0 ? (
                                                    <tr>
                                                        <td colspan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SubmitButton disable={disable} handleSubmit={handleSubmit}
                        link={'/user/project-store/fitup-clearance-management'} buttonName={'Generate Fitup Acceptance'} />

                </div>
            </div>
        </div>
    )
}

export default ManageMultiClearFitup