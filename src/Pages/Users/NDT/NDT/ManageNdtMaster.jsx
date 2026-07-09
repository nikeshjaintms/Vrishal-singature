import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { Dropdown } from 'primereact/dropdown';
import { getUserWeldVisual } from '../../../../Store/Store/WeldVisual/WeldVisual';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import { MultiSelect } from 'primereact/multiselect';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';
import toast from 'react-hot-toast';
import { QC, V_URL } from '../../../../BaseUrl';
import axios from 'axios';

const ManageNdtMaster = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;
    const [ndt, setNdt] = useState({ drawNo: '', weldVisual: '' });
    const [disable, setDisable] = useState(false);
    const [filterWeld, setFilterWeld] = useState([]);
    const [weldObj, setWeldObj] = useState(null);
    const [tableData, setTableData] = useState([]);

    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [ndtDraw, setNdtDraw] = useState([]);

    useEffect(() => {
        if (location.state?._id) {
            setNdt({
                drawNo: location.state?.items[0]?.transaction_id?.drawingId?._id,
                weldVisual: location.state?.weld_inspection_id?._id
            })
            setTableData(location.state?.items);
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(getDrawing())
        dispatch(getUserWeldVisual({ status: 2 }));
        dispatch(getUserNdtMaster({ status: '' }));
    }, [dispatch]);

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const weldVisualData = useSelector((state) => state?.getUserWeldVisual?.user?.data);
    const ndtData = useSelector((state) => state?.getUserNdtMaster?.user?.data);

    useEffect(() => {
        const weldVisualIds = weldVisualData?.map((we) => we?.drawing_id);
        const ndtDraws = drawData?.filter((nd) => weldVisualIds?.includes(nd?._id) && nd?.project?._id === localStorage.getItem('U_PROJECT_ID'));

        setNdtDraw(ndtDraws);

        const filterData = weldVisualData?.filter(vi => vi.items.some(it => it?.transaction_id?.drawingId?._id === ndt?.drawNo));
        setFilterWeld(filterData);
        if (filterData) {
            const findWeld = filterData?.find(vi => vi?._id === ndt?.weldVisual);
            setWeldObj(findWeld || null);
            if (!data?._id) {
                setTableData(findWeld?.items || []);
            }
        }
    }, [weldVisualData, drawData, ndt.drawNo, ndt.weldVisual, data?._id]);

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

    const handleChange = (e, name) => {
        setNdt({ ...ndt, [name]: e.value });
    }

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        ndt_requirements: [{ ndt_type: '' }, { ndtName: '' }],
        remarks: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            ndt_requirements: row.ndt_requirements,
            remarks: row.remarks,
        });
    }

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'ndt_requirements') {
            const selectedNdt = value.map(id => {
                const ndt = ndtData.find(ndt => ndt._id === id);
                return { ndt_type: id, ndtName: ndt?.name };
            });
            // CODE FOR NDT NONE OPTIONS CHECKING =================================
            // const noneOption = ndtData.find(ndt => ndt.name === "None");
            // const noneId = noneOption?._id;

            // let selectedNdt;

            // if (value.includes(noneId)) {
            //     selectedNdt = [{ ndt_type: noneId, ndtName: "None" }];
            // } else {
            //     selectedNdt = value.map(id => {
            //         const ndt = ndtData.find(ndt => ndt._id === id);
            //         return { ndt_type: id, ndtName: ndt?.name };
            //     });
            // }
            setEditFormData({ ...editFormData, ndt_requirements: selectedNdt });
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
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setEditRowIndex(null);
    }

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const getJointTypes = (transactionId) => {
        const fitupItems = weldObj?.fitup_id?.items || [];
        const match = fitupItems.find(item => item.transaction_id === transactionId);
        return match?.joint_type?.map(joint => joint.name).join(", ") || "-";
    }

    const handleSubmit = () => {
        let updatedData = tableData;
        let isValid = true;

        updatedData.forEach(item => {
            if (!item.ndt_requirements?.length > 0) {
                isValid = false;
                toast.error(`Please select ndt requirements for ${item.transaction_id.itemName.name}`);
            }
        });

        if (!isValid) {
            return;
        }

        const filteredData = updatedData.map(item => ({
            ndt_requirements: item.ndt_requirements?.map(ndt => ({ ndt_type: ndt.ndt_type })),
            weldor_no: item.weldor_no?._id,
            transaction_id: item.transaction_id?._id
        }));

        setDisable(true);
        const myurl = `${V_URL}/user/manage-ndt-master`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('items', JSON.stringify(filteredData));
        bodyFormData.append('weld_inspection_id', ndt.weldVisual);
        bodyFormData.append('drawing_id', ndt.drawNo);
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response?.data?.success === true) {
                toast.success(response?.data?.message);
                navigate('/user/project-store/ndt-management');
            } else {
                toast.error(response?.data?.message);
            }
            setDisable(false);
        }).catch((error) => {
            toast.error(error?.response?.data?.message);
            setDisable(false);
        });
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const drawOptions = ndtDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

    const weldVisualOptions = filterWeld?.map(visual => ({
        label: visual?.weld_report_qc_no,
        value: visual?._id
    }));

    const ndtOptions = ndtData?.map((n) => ({
        label: n?.name,
        value: n?._id
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/ndt-management">NDT Master List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} NDT Master</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} NDT Master Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        value={ndt.drawNo}
                                                        onChange={(e) => handleChange(e, 'drawNo')}
                                                        options={drawOptions}
                                                        placeholder="Select Drawing No."
                                                        filter className='w-100' />
                                                </div>
                                            </div>

                                            {ndt.drawNo && (
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Weld Visual Inspection List <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            value={ndt.weldVisual}
                                                            onChange={(e) => handleChange(e, 'weldVisual')}
                                                            options={weldVisualOptions}
                                                            placeholder="Select Weld Visual Inspection List"
                                                            filter className='w-100' />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {ndt?.weldVisual && weldObj?.items?.[0] && (
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
                                                </div>
                                            </>
                                        )}
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
                                                    <th>Welding Process</th>
                                                    <th>Welder No.</th>
                                                    <th>NDT Requirements</th>
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
                                                        <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                                                        <td>{elem?.weldor_no?.welderNo}</td>
                                                        {!data?._id ? (
                                                            <>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <div className='custom-select-wpr'>
                                                                                <MultiSelect
                                                                                    value={editFormData?.ndt_requirements?.map(ndt => ndt.ndt_type)}
                                                                                    onChange={(e) => handleEditFormChange({ target: { name: 'ndt_requirements', value: e.value } })}
                                                                                    options={ndtOptions}
                                                                                    optionLabel="label"
                                                                                    placeholder="Select NDT Requirements"
                                                                                    display="chip"
                                                                                    className='w-100 multi-prime-react'
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <textarea className='form-control' value={editFormData.remarks}
                                                                                name='remarks' rows={1}
                                                                                onChange={handleEditFormChange} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.ndt_requirements?.length > 0 ? elem?.ndt_requirements?.map((e) => e.ndtName).join(', ') : '-'}</td>
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
                                                        ) :
                                                            <>
                                                                <td>{elem?.ndt_requirements?.map((e) => e.ndt_type?.name).join(', ')}</td>
                                                                <td>{elem?.remarks || '-'}</td>
                                                                <td>-</td>
                                                            </>
                                                        }
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
                                        <div className="doctor-submit text-end">
                                            {localStorage.getItem('ERP_ROLE') === QC ? (
                                                <>
                                                    {!data?._id ? (
                                                        <button type="button"
                                                            className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                                                            disabled={disable}>{disable ? "Processing..." : "Submit"}</button>
                                                    ) : (
                                                        <button type="button"
                                                            className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/ndt-management')}>Back</button>
                                                    )}
                                                </>
                                            ) : (
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={() => navigate('/user/project-store/ndt-management')}>Back</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div >
    )
}

export default ManageNdtMaster