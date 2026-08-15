import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import DropDown from '../../../../Components/DropDown';
import { QC, V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageUtOffer = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const data = location.state;

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        if (location.state?._id) {
            setTableData(location.state?.items);
        }
    }, [location.state]);

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
        thickness: '',
        remarks: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            thickness: row.thickness,
            remarks: row.remarks,
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
        const fitupItems = data?.ndt_master_id?.weld_inspection_id?.fitup_id?.items || [];
        const match = fitupItems.find(item => item.transaction_id === transactionId);
        return match?.joint_type?.map(joint => joint.name).join(", ") || "-";
    }

    const handleSubmit = () => {

        let updatedData = tableData;
        let isValid = true;

        updatedData.forEach(item => {
            if (item.thickness === '' || item.thickness === undefined) {
                isValid = false;
                toast.error(`Please enter thickness for ${item.transaction_id.itemName.name}`);
            }
        });

        if (!isValid) {
            return;
        }

        const filteredData = updatedData.map(item => ({
            transaction_id: item.transaction_id?._id,
            weldor_no: item.weldor_no?._id,
            thickness: item.thickness,
            item_status: item.item_status,
            remarks: item.remarks,
        }));

        setDisable(true);
        const myurl = `${V_URL}/user/manage-ndt-offer`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
        bodyFormData.append('items', JSON.stringify(filteredData));
        bodyFormData.append('id', data?._id);
        bodyFormData.append('type', data?.ndt_type_id?.name);
        bodyFormData.append('drawing_id', data?.items[0]?.transaction_id?.drawingId?._id)

        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data.success === true) {
                toast.success(response.data.message);
                navigate('/piping/user/ut-offer-management');
            }
            setDisable(false);
        }).catch((error) => {
            toast.error("Something went wrong." || error.response.data?.message);
            setDisable(false);
        });
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/ut-offer-management">Ultrasonic Offer List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Ultrasonic Offer List</li>
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
                                                <h4>Manage Ultrasonic Offer Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Client </label>
                                                    <input className='form-control' value={data?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms">
                                                    <label>Work Order / PO No.</label>
                                                    <input className='form-control' value={data?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Drawing No. </label>
                                                    <input className='form-control' value={data?.items[0]?.transaction_id?.drawingId?.drawing_no} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>REV </label>
                                                    <input className='form-control' value={data?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Sheet No. </label>
                                                    <input className='form-control' value={data?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Assembly No. </label>
                                                    <input className='form-control' value={data?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
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
                                                    <th>Section Details</th>
                                                    <th>Quantity</th>
                                                    <th>Item No.</th>
                                                    <th>Grid No.</th>
                                                    <th>Joint Type</th>
                                                    <th>Welding Process</th>
                                                    <th>Weldor No.</th>
                                                    <th>Thickness(mm)</th>
                                                    <th>Remarks</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.map((elem, i) =>
                                                    <tr key={elem._id}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.transaction_id?.itemName?.name}</td>
                                                        <td>{elem?.transaction_id?.quantity}</td>
                                                        <td>{elem?.transaction_id?.item_no}</td>
                                                        <td>{elem?.transaction_id?.grid_no}</td>
                                                        <td>{getJointTypes(elem?.transaction_id?._id)}</td>
                                                        <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        {(data?.status === 1 || data?.status === 4) ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input className='form-control' type='text' value={editFormData?.thickness} onChange={handleEditFormChange} name='thickness' />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className='form-control' onChange={handleEditFormChange} name='remarks' value={editFormData?.remarks} rows={1} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.thickness || '-'}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                                    </>
                                                                )}
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                                    </td>
                                                                ) : <td>-</td>}
                                                            </>
                                                        ) : <>
                                                            <td>{elem?.thickness}</td>
                                                            <td>{elem?.remarks}</td>
                                                            <td>-</td>
                                                        </>}
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

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            {localStorage.getItem('ERP_ROLE') === QC ? (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                    disabled={disable}>{disable ? "Processing..." : "Generate UT Offer"}</button>
                                            ) : (
                                                <button type='button' className='btn btn-primary' onClick={() => navigate('/piping/user/ut-offer-management')}>
                                                    Back
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ManageUtOffer