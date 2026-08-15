import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import Swal from 'sweetalert2';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import toast from 'react-hot-toast';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
const ManageMultiClearWeld = () => {
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
        dispatch(getDrawing());
    }, []);
    useEffect(() => {
        if (data) {
            setTableData(data?.items);
        }
    }, [data]);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const commentsData = useMemo(() => {
        let computedComments = tableData || [];
        setTotalItems(computedComments?.length);
        return computedComments;
    }, [currentPage, search, limit, tableData]);
    const getDrawingData = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        qc_remarks: '',
        is_accepted: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            qc_remarks: row.qc_remarks,
            is_accepted: ''
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
            if (item.is_accepted === '' || item.is_accepted === undefined) {
                isValid = false;
                toast.error(`Please accept or reject for (${item?.grid_item_id?.item_name?.name})-(${item?.grid_item_id?.grid_id?.grid_no}-${item?.grid_item_id?.grid_id?.grid_qty})`);
            }
        });
        if (!isValid) {
            return;
        }
        const filteredData = updatedData?.map(item => ({
            ...item,
            grid_item_id: item.grid_item_id?._id,
            qc_remarks: item.qc_remarks || '',
        }));

        setDisable(true);
        const myurl = `${V_URL}/user/verify-weldvisual-offer`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', data?._id);
        bodyFormData.append('items', JSON.stringify(filteredData))
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
                navigate('/user/project-store/weld-visual-clearance-management');
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
                            { name: "Weld Visual Clearance List", link: "/user/project-store/weld-visual-clearance-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Weld Visual Inspection Offer`, active: true }
                        ]} />
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form>
                                            <div className="col-12">
                                                <div className="form-heading">
                                                    <h4>{data?._id ? 'Edit' : 'Add'} Weld Visual Clearance Details</h4>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Weld Visual Clearance List <span className="login-danger">*</span></label>
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
                                                        <h3>Weld Visual Clearance List</h3>
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
                                                        <th>Type Of Weld</th>
                                                        <th>WPS No.</th>
                                                        <th>Welding Process</th>
                                                        <th>Welder No.</th>
                                                        <th>Acc/Rej</th>
                                                        <th>Remarks</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{getDrawingData(elem?.drawing_id)?.drawing_no}</td>
                                                            <td>{getDrawingData(elem?.drawing_id)?.rev}</td>
                                                            <td>{getDrawingData(elem?.drawing_id)?.assembly_no}</td>
                                                            <td>{getDrawingData(elem?.drawing_id)?.assembly_quantity}</td>
                                                            <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                            <td>{elem?.grid_item_id?.item_no}</td>
                                                            <td>{elem?.grid_item_id?.item_qty}</td>
                                                            <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                            <td>{elem?.weld_used_grid_qty}</td>
                                                            <td>{elem?.joint_type?.map((e) => e?.name)?.join(', ')}</td>
                                                            <td>{elem?.wps_no?.wpsNo}</td>
                                                            <td>{elem?.wps_no?.weldingProcess}</td>
                                                            <td>{elem?.weldor_no?.welderNo}</td>
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
                                                                        <textarea className='form-control' onChange={handleEditFormChange} name='qc_remarks' value={editFormData?.qc_remarks} rows={1} />
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
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
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* <div className="row align-center mt-3 mb-2">
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
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SubmitButton disable={disable} handleSubmit={handleSubmit}
                            link={'/user/project-store/weld-visual-clearance-management'} buttonName={'Generate Weld Visual Acceptance'} />
                    </div>
                </div>
            </div>
        </>
    )
}
export default ManageMultiClearWeld