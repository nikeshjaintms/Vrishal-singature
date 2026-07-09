import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import DropDown from '../../../../../Components/DropDown';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Search } from '../../../Table';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { Check, Save, X } from 'lucide-react';
import { getUserAdminDraw } from '../../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../../../Store/Store/WpsMaster/WpsMaster';

const ManageMultiClearFd = () => {
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

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        qc_remarks: '',
        actual_dimension: "",
        required_dimension: ""
    });

    useEffect(() => {
        dispatch(getUserAdminDraw());
        dispatch(getUserWpsMaster({ status: true }));
    }, []);

    useEffect(() => {
        if (data) {
            setTableData(data?.items);
        }
    }, [data]);

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
                setAcceptRejectStatus((prev) => ({
                    ...prev,
                    [index]: isAccepted,
                }));
                toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
            }
        });
    };

    const commentsData = useMemo(() => {
        let computedComments = tableData || [];
        if (search) {
            computedComments = computedComments?.filter(
                (i) =>
                    i?.drawing_id?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.grid_id?.grid_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.drawing_id?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        // return computedComments?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
        return computedComments;
    }, [currentPage, search, limit, tableData]);

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            qc_remarks: row.qc_remarks || '',
            actual_dimension: row.actual_dimension || '',
            required_dimension: row.required_dimension || '',
        });
    };


    const handleSubmit = () => {
        let updatedData = tableData;
        let isValid = true;
        updatedData?.forEach(item => {
            if (item.actual_dimension === '' || item.actual_dimension === undefined) {
                isValid = false;
                toast.error(`Please add actual dimension for ${item?.grid_id?.grid_no}`);
            }
            if (item.required_dimension === '' || item.required_dimension === undefined) {
                isValid = false;
                toast.error(`Please add required dimension for ${item?.grid_id?.grid_no}`);
            }
            if (item.is_accepted === '' || item.is_accepted === undefined) {
                isValid = false;
                toast.error(`Please accept or reject for ${item?.grid_id?.grid_no}`);
            }
        })

        if (!isValid) {
            return;
        }

        const filteredData = updatedData?.map(item => ({
            _id: item._id,
            drawing_id: item.drawing_id._id,
            grid_id: item.grid_id._id,
            qc_remarks: item.qc_remarks || '',
            remarks: item.remarks || '',
            required_dimension: item.required_dimension,
            actual_dimension: item.actual_dimension,
            fd_balanced_grid_qty: item.fd_balanced_grid_qty,
            fd_used_grid_qty: item.fd_used_grid_qty,
            moved_next_step: item.moved_next_step,
            is_accepted: item.is_accepted
        }))

        setDisable(true);
        const myurl = `${V_URL}/user/verify-fd-offer`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', data?._id);
        bodyFormData.append('items', JSON.stringify(filteredData));
        bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));

        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data?.success === true) {
                toast.success(response.data.message);
                navigate('/user/project-store/final-dimension-clearance-management');
                localStorage.removeItem('issue_acc_ids');
                localStorage.removeItem('ndt_master_ids');
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
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Final Dimension Clearance List", link: "/user/project-store/final-dimension-clearance-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Final Dimension Inspection Offer`, active: true }
                        ]} />

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form>
                                            <div className="col-12">
                                                <div className="form-heading">
                                                    <h4>{data?._id ? 'Edit' : 'Add'} Final Dimension Clearance Details</h4>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Final Dimension Offer List <span className="login-danger">*</span></label>
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
                                                        <h3>Final Dimension Clearance List</h3>
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
                                                        <th>Assem. No.</th>
                                                        <th>Assem. Qty.</th>
                                                        <th>Grid No.</th>
                                                        <th>Grid Qty.</th>
                                                        <th>Required Dimensions</th>
                                                        <th>Actual Dimensions</th>
                                                        <th>Remarks</th>
                                                        <th>Acc/Rej</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData && commentsData.length > 0 ? (
                                                        commentsData.map((elem, i) => (
                                                            <tr key={i}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.drawing_id?.drawing_no || '-'}</td>
                                                                <td>{elem?.drawing_id?.rev || '-'}</td>
                                                                <td>{elem?.drawing_id?.assembly_no || '-'}</td>
                                                                <td>{elem?.drawing_id?.assembly_quantity || '-'}</td>
                                                                <td>{elem?.grid_id?.grid_no || '-'}</td>
                                                                <td>{elem?.fd_used_grid_qty || '-'}</td>

                                                                <td>{elem?.required_dimension || '-'}</td>
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <textarea
                                                                            className="form-control"
                                                                            name="actual_dimension"
                                                                            onChange={handleEditFormChange}
                                                                            value={editFormData.actual_dimension}
                                                                            rows={1}
                                                                        />
                                                                    </td>
                                                                ) : (
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.actual_dimension || '-'}</td>
                                                                )}
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <textarea
                                                                            className="form-control"
                                                                            name="qc_remarks"
                                                                            onChange={handleEditFormChange}
                                                                            value={editFormData.qc_remarks}
                                                                            rows={1}
                                                                        />
                                                                    </td>
                                                                ) : (
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
                                                                )}
                                                                <td>
                                                                    {editRowIndex === i ? (
                                                                        <div className='d-flex gap-2'>
                                                                            <span className={`present-table attent-status ${acceptRejectStatus[i] === true ? 'selected' : ''}`}
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => handleAcceptRejectClick(i, true, elem?.grid_id?.grid_no)}>
                                                                                <Check />
                                                                            </span>
                                                                            <span className={`absent-table attent-status ${acceptRejectStatus[i] === false ? 'selected' : ''}`}
                                                                                style={{ cursor: 'pointer' }}
                                                                                onClick={() => handleAcceptRejectClick(i, false, elem?.grid_id?.grid_no)}>
                                                                                <X />
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <td onClick={() => handleEditClick(i, elem)}>{acceptRejectStatus[i] !== undefined ? (acceptRejectStatus[i] ? 'Accepted' : 'Rejected') : '-'}</td>
                                                                    )}
                                                                </td>
                                                                <td className='status-badge'>
                                                                    {acceptRejectStatus[i] === true ? (
                                                                        <span className="custom-badge status-green">Acc</span>
                                                                    ) : acceptRejectStatus[i] === false ? (
                                                                        <span className="custom-badge status-pink">Rej</span>
                                                                    ) : (
                                                                        <span>-</span>
                                                                    )}
                                                                </td>
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                                    </td>
                                                                ) : (
                                                                    <td>-</td>
                                                                )}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="10" className="text-center">No Data Available</td>
                                                        </tr>
                                                    )}
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SubmitButton disable={disable} handleSubmit={handleSubmit}
                            link={'/user/project-store/final-dimension-clearance-management'} buttonName={'Generate Final Dimension Acceptance'} />

                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageMultiClearFd