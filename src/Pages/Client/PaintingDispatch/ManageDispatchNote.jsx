import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Save, Tally1, X } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getUserAdminDraw } from '../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../Store/Store/WpsMaster/WpsMaster';
import { V_URL } from '../../../BaseUrl';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import PageHeader from '../Multiple/Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import SubmitButton from '../Multiple/Components/SubmitButton/SubmitButton';

const ManageDispatchNote = () => {

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

    const drawData = useSelector((state) => state?.getUserAdminDraw?.user?.data);
    const wpsData = useSelector((state) => state?.getUserWpsMaster?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = tableData || [];
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
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
                setAcceptRejectStatus((prev) => ({
                    ...prev,
                    [index]: isAccepted,
                }));
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
                toast.error(`Please accept or reject for ${item?.grid_item_id?.item_name?.name}`);
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
                        { name: "Inspection Summary Records List", link: "/user/project-store/inspection-summary-management", active: false },
                        { name: `View Inspection Summary Details`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Inspection Summary Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Inspection Summary List <span className="login-danger">*</span></label>
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
                                                    <h3>Inspection Summary List</h3>
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.drawing_no}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.rev}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.assembly_no}</td>
                                                        <td>{getDrawing(elem?.drawing_id)?.assembly_quantity}</td>
                                                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                        <td>{elem?.grid_item_id?.item_no}</td>
                                                        <td>{elem?.grid_item_id?.item_qty}</td>
                                                        <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                        <td>{elem?.fitOff_used_grid_qty}</td>
                                                        <td>{elem?.joint_type?.map((e) => e?.name)?.join(', ')}</td>
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
                    <button type="button" className="btn btn-primary submit-form me-2"
                        onClick={() => navigate('/user/project-store/inspection-summary-management')}>Back</button>

                </div>
            </div>
        </div>
    )
}

export default ManageDispatchNote