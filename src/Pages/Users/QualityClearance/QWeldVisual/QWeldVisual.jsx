import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserWeldVisual } from '../../../../Store/Store/WeldVisual/WeldVisual';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import axios from 'axios';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { Dropdown } from 'primereact/dropdown';
import { Save, X } from 'lucide-react';

const QWeldVisual = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [status, setStatus] = useState(null);
    const [disable, setDisable] = useState(false);
    const [weld, setWeld] = useState({ drawNo: '', weldVisual: '' });
    const [error, setError] = useState({});
    const [filWelVisual, setFilWeldVisual] = useState([]);
    const [weldObj, setWeldObj] = useState({});
    const [tableData, setTableData] = useState([]);
    const data = location.state;

    useEffect(() => {
        if (data) {
            setWeld({
                drawNo: data?.items[0]?.transaction_id?.drawingId?._id,
                weldVisual: data?._id,
            });
        }
    }, [data])

    useEffect(() => {
        dispatch(getUserWeldVisual({ status: 1 }));
        dispatch(getDrawing());
    }, [dispatch, disable]);

    const entity = useSelector((state) => state?.getUserWeldVisual?.user?.data);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);

    const handleChange = (e, name) => {
        setWeld({ ...weld, [name]: e.value });
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value === 'accept');
    };

    useEffect(() => {
        const filterWeld = entity?.filter(e => e?.items?.some(it => it?.transaction_id?.drawingId?._id === weld.drawNo));
        setFilWeldVisual(filterWeld);
        const findWeld = filterWeld?.find(we => we?._id === weld.weldVisual);
        setWeldObj(findWeld);
        setTableData(findWeld?.items || []);
    }, [weld.drawNo, weld.weldVisual, entity]);

    const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
        let filteredData = data;
        if (searchTerm) {
            filteredData = filteredData.filter(
                (i) =>
                    i?.transaction_id?.itemName?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        qc_remarks: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
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
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const getJointTypes = (transactionId) => {
        const fitupItems = data?.fitup_id?.items || [];
        const match = fitupItems.find(item => item.transaction_id === transactionId);
        return match?.joint_type?.map(joint => joint.name).join(", ") || "-";
    }

    const handleSubmit = () => {
        let updatedData = tableData;
        const filteredData = updatedData.map(item => ({
            transaction_id: item.transaction_id?._id,
            weldor_no: item.weldor_no?._id,
            qc_remarks: item.qc_remarks,
            remarks: item.remarks,
        }));
        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/get-weld-inspection-approval`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('status', status);
            bodyFormData.append('id', weld.weldVisual);
            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            bodyFormData.append('items', JSON.stringify(filteredData));
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response?.data?.success === true) {
                    toast.success(response?.data?.message);
                    navigate('/user/project-store/weld-visual-clearance-management')
                } else {
                    toast.error(response?.data?.message);
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
                setDisable(false);
            })
        }
    }

    const validation = () => {
        let isValid = true;
        let err = {};
        if (status === null) {
            isValid = false;
            err['status_err'] = "Please select approval status";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = drawData?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

    const weldVisualOptions = filWelVisual?.map(weld => ({
        label: weld?.weld_report_no,
        value: weld._id
    }));

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Weld Visual Inspection Report List</li>
                                </ul>
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
                                                <h4>Manage Weld Visual Inspection Report Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={drawOptions}
                                                        value={weld.drawNo}
                                                        onChange={(e) => handleChange(e, 'drawNo')}
                                                        filter className='w-100'
                                                        placeholder="Select Drawing No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error?.draw_err}</div>
                                                </div>
                                            </div>

                                            {weld.drawNo ? (
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label> Weld Visual Offer List <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={weldVisualOptions}
                                                            value={weld.weldVisual}
                                                            onChange={(e) => handleChange(e, 'weldVisual')}
                                                            filter className='w-100'
                                                            placeholder="Select Weld Visual Offer No."
                                                            disabled={data?._id}
                                                        />
                                                        <div className='error'>{error?.weldVisual_err}</div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        {weld?.weldVisual ? (
                                            <>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Client </label>
                                                            <input className='form-control' value={weldObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className='col-12 col-md-4 col-xl-4'>
                                                        <div className="input-block local-forms">
                                                            <label>Work Order / PO No.</label>
                                                            <input className='form-control' value={weldObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>REV </label>
                                                            <input className='form-control' value={weldObj?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Sheet No. </label>
                                                            <input className='form-control' value={weldObj?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Assembly No. </label>
                                                            <input className='form-control' value={weldObj?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Fit-Up Offer No.</label>
                                                            <input className='form-control' value={weldObj?.fitup_id?.report_no} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Fit-Up Report No.</label>
                                                            <input className='form-control' value={weldObj?.fitup_id?.report_no_two} readOnly />
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Type Of Weld</label>
                                                            <input className='form-control' value={weldObj?.fitup_id?.items?.map((elem) => elem?.joint_type?.map((e) => e?.name).join(', '))} readOnly />
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </>
                                        ) : null}
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
                                                    <h3>Weld Visual Acceptance List</h3>
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

                                    <div className="table-responsive">
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Section Details</th>
                                                    <th>Quantity</th>
                                                    <th>Item No.</th>
                                                    <th>Grid No.</th>
                                                    <th>Type Of Weld</th>
                                                    <th>WPS No.</th>
                                                    <th>Welding Process</th>
                                                    <th>Welder No.</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.transaction_id?.itemName?.name}</td>
                                                        <td>{elem?.transaction_id?.quantity}</td>
                                                        <td>{elem?.transaction_id?.item_no}</td>
                                                        <td>{elem?.transaction_id?.grid_no}</td>
                                                        <td>{getJointTypes(elem?.transaction_id?._id)}</td>
                                                        <td>{elem?.weldor_no?.wpsNo?.wpsNo}</td>
                                                        <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        {editRowIndex === i ? (
                                                            <>
                                                                <td>
                                                                    <textarea className='form-control' onChange={handleEditFormChange} name='qc_remarks' value={editFormData?.qc_remarks} rows={1} />
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
                                                            </>
                                                        )}
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

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="row align-items-center mt-2">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block select-gender">
                                                    <label className="gen-label">Status <span className="login-danger">*</span></label>
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="status"
                                                                value="accept"
                                                                className="form-check-input" checked={status === true}
                                                                onChange={handleStatusChange} />Accept
                                                        </label>
                                                    </div>
                                                    <div className="form-check-inline">
                                                        <label className="form-check-label">
                                                            <input type="radio" name="status" value="reject"
                                                                checked={status === false}
                                                                onChange={handleStatusChange}
                                                                className="form-check-input" />Reject
                                                        </label>
                                                    </div>
                                                    <div className='error'>{error?.status_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                disabled={disable}>{disable ? "Processing..." : "Generate Weld Visual Acceptance"}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default QWeldVisual