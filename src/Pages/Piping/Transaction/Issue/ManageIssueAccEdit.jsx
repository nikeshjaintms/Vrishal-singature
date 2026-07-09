import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserIssueRequest } from '../../../../Store/Store/Issue/IssueRequest';
import { getStockReportList } from '../../../../Store/Store/Stock/getStockReportList';
import { getUserIssueAcceptance } from '../../../../Store/Store/Issue/IssueAcceptance';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Dropdown } from 'primereact/dropdown';
import moment from 'moment';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import PaginationComponent from '../../Table/Pagination';
import Footer from '../../Include/Footer';


const ManageIssueAccEdit = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;
    const [drawObj, setDrawObj] = useState({});
    const [acc, setAcc] = useState({ drawNo: '', reqId: '' });
    const [error, setError] = useState('');
    const [disable, setDisable] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [filterDraw, setFilterDraw] = useState([]);

    const [finalIssueReq, setFinalIssueReq] = useState([]);
    const [finalTable, setFinalTable] = useState([]);

    useEffect(() => {
        if (data) {
            setAcc({
                drawNo: location.state?.drawing_id?._id,
                reqId: location.state?._id,
            });
        }
    }, [data]);

    useEffect(() => {
        dispatch(getUserAdminDraw())
        dispatch(getUserIssueRequest())
        dispatch(getStockReportList())
        dispatch(getUserIssueAcceptance())
    }, [dispatch]);

    const drawData = useSelector(state => state.getUserAdminDraw?.user?.data);
    const issueReqData = useSelector(state => state.getUserIssueRequest?.user?.data);
    const stockReportData = useSelector(state => state.getStockReportList?.user?.data);
    const issueAccData = useSelector(state => state.getUserIssueAcceptance?.user?.data);

    useEffect(() => {
        const issueRequestDrawingIds = issueReqData?.map(req => req.drawing_id._id) || [];
        const filteredDrawings = drawData?.filter(drawing =>
            issueRequestDrawingIds.includes(drawing._id)
        ) || [];

        setFilterDraw(filteredDrawings);

        const filterDraw = drawData?.find((dr) => dr?._id === acc.drawNo);
        if (filterDraw) {
            setDrawObj(filterDraw);
        }

        if (acc.drawNo) {
            const filterReq = issueReqData?.filter(is => is?.items?.some(i => i?.transaction_id?.drawingId?._id === acc.drawNo));
            if (filterReq?.length > 0) {
                setFinalIssueReq(filterReq);
                const finalDataShow = filterReq?.find(fi => fi);
                console.log(finalDataShow, 'final')
                setTableData(finalDataShow?.items);
            }
        }
    }, [drawData, issueReqData, location.state?._id, issueAccData]);

    const handleChange = (e, name) => {
        setAcc({ ...acc, [name]: e.value });
    }

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        requested_qty: '',
        requested_width: '',
        requested_length: '',
        imir_no: '',
        quantity: '',
        heat_no: '',
        remarks: '',
        itemId: '',
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            requested_qty: row.requested_qty,
            requested_width: row.requested_width,
            requested_length: row.requested_length,
            imir_no: row.imir_no || '',
            quantity: row.quantity || '',
            heat_no: row.heat_no || '',
            remarks: row.remarks || '',
            itemId: row.transaction_id.itemName._id
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        // setEditFormData({ ...editFormData, [name]: value });
        if (name === 'imir_no') {
            const matchedTransaction = stockReportData.find(stock => stock.imir_no === value && stock.itemId === editFormData.itemId);
            if (matchedTransaction) {
                setEditFormData({
                    ...editFormData,
                    [name]: value,
                    heat_no: matchedTransaction.accepted_lot_no,
                    quantity: matchedTransaction.acceptedQty,
                });
            } else {
                setEditFormData({
                    ...editFormData,
                    [name]: value,
                });
            }
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    }

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            computedComments = computedComments.filter(
                (i) =>
                    i?.transaction_id?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.transaction_id?.item_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    i?.transaction_id?.grid_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, tableData]);



    const handleSaveClick = () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setEditRowIndex(null);
    };

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleSubmit = () => {
        let updatedData = tableData;
        let isValid = true;
        let err = {};

        updatedData?.forEach(item => {
            const stockItem = stockReportData?.find(stock =>
                stock.imir_no === item.imir_no && stock.itemId === item.itemId
            );
            if (!item.imir_no || !stockItem) {
                isValid = false;
                toast.error(`Please select IMIR No. for ${item.transaction_id.itemName.name}`);
            } else if (item.requested_qty > (stockItem?.acceptedQty || 0)) {
                isValid = false;
                toast.error(`Requested quantity for ${item.transaction_id.itemName.name} exceeds available stock (${stockItem.acceptedQty}).`);
            }
        });

        if (!isValid) {
            setError(err);
            return;
        }

        const filteredData = updatedData?.map(item => ({
            transaction_id: item.transaction_id?._id,
            issued_qty: item.requested_qty,
            issued_length: item.requested_length,
            issued_width: item.requested_width,
            imir_no: item.imir_no,
            heat_no: item.heat_no,
            remarks: item.remarks || '',
        }));

        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-issue-acceptance`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('issue_req_id', acc.reqId);
            bodyFormData.append('items', JSON.stringify(filteredData));
            bodyFormData.append('issued_by', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            bodyFormData.append('drawing_id', acc.drawNo);
            // if (data?._id) {
            //     bodyFormData.append('id', data?._id);
            // }
            axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                console.log(response);
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/issue-management');
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error.response.data.message);
                setDisable(false);
            })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!acc.drawNo) {
            isValid = false;
            err['drawNo_err'] = "Please select drawing no";
        }
        if (acc.drawNo) {
            if (!acc.reqId) {
                isValid = false;
                err['reqId_err'] = "Please select issue request no";
            }
        }
        setError(err);
        return isValid;
    }

    const drawOptions = filterDraw?.map(drawing => ({
        label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
        value: drawing._id
    }));

    const issueReqOptions = finalIssueReq?.map((e) => ({
        label: e?.issue_req_no,
        value: e?._id
    }));

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
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/issue-management">
                                            Issue Acceptance List
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Issue Acceptance
                                    </li>
                                </ul>
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
                                                    <h3>Issue Acceptance List</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="staff-search-table">
                                        <form>
                                            <div className='row'>
                                                <div className="col-12 col-md-6 col-xl-6">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Drawing No. <span className="login-danger">*</span></label>
                                                        <Dropdown
                                                            options={drawOptions}
                                                            value={acc.drawNo}
                                                            onChange={(e) => handleChange(e, 'drawNo')}
                                                            filter className='w-100'
                                                            placeholder="Select Drawing"
                                                            disabled={data?._id}
                                                        />
                                                        <div className='error'>{error?.drawNo_err}</div>
                                                    </div>
                                                </div>

                                                {acc.drawNo ? (
                                                    <div className="col-12 col-md-6 col-xl-6">
                                                        <div className="input-block local-forms custom-select-wpr">
                                                            <label>Iusse Request No. <span className="login-danger">*</span></label>
                                                            <Dropdown
                                                                options={issueReqOptions}
                                                                value={acc.reqId}
                                                                name='reqId'
                                                                onChange={(e) => handleChange(e, 'reqId')}
                                                                filter className='w-100'
                                                                placeholder="Select Issue Request"
                                                                disabled={data?._id}
                                                            />
                                                            <div className='error'>{error?.reqId_err}</div>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className='row'>
                                                {drawObj && Object.keys(drawObj).length > 0 && (
                                                    <>
                                                        <div className='row'>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Client</label>
                                                                    <input className='form-control' value={drawObj?.project?.party?.name} readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Master Updation Date</label>
                                                                    <input className='form-control' value={moment(drawObj?.master_updation_date).format('YYYY-MM-DD')} readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Received Date</label>
                                                                    <input className='form-control' value={moment(drawObj?.draw_receive_date).format('YYYY-MM-DD')} readOnly />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='row'>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>REV</label>
                                                                    <input className='form-control' value={drawObj?.rev} readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Sheet No.</label>
                                                                    <input className='form-control' value={drawObj?.sheet_no} readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Assembly No.</label>
                                                                    <input className='form-control' value={drawObj?.assembly_no} readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Assembly Qty.</label>
                                                                    <input className='form-control' value={drawObj?.assembly_quantity} readOnly />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-xl-4">
                                                                <div className="input-block local-forms">
                                                                    <label>Area</label>
                                                                    <input className='form-control' value={drawObj?.unit} readOnly />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {acc.reqId ? (
                                                <div className='row'>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Issue Requested By</label>
                                                            <input className='form-control' value={finalIssueReq[0]?.requested_by?.user_name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-4 col-xl-4">
                                                        <div className="input-block local-forms">
                                                            <label>Issue Requested Date</label>
                                                            <input className='form-control' value={moment(finalIssueReq[0]?.createdAt).format('YYYY-MM-DD')} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {acc.reqId ? (
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Material Issue Requested List</h3>
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
                                                        <th>Section Details</th>
                                                        <th>Req. Qty.</th>
                                                        <th>Req. Width</th>
                                                        <th>Req. Length</th>
                                                        <th>Imir No.</th>
                                                        <th>Heat No.</th>
                                                        <th>Qty.</th>
                                                        <th>Remarks</th>
                                                        <th>Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{i + 1}</td>
                                                            <td>{elem?.transaction_id?.itemName?.name}</td>
                                                            {editRowIndex === i ? (
                                                                <>
                                                                    <td>
                                                                        <input className='form-control'
                                                                            type="number"
                                                                            name="requested_qty"
                                                                            value={editFormData.requested_qty}
                                                                            onChange={handleEditFormChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input className='form-control'
                                                                            type="number"
                                                                            name="requested_width"
                                                                            value={editFormData.requested_width}
                                                                            onChange={handleEditFormChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input className='form-control'
                                                                            type="number"
                                                                            name="requested_length"
                                                                            value={editFormData.requested_length}
                                                                            onChange={handleEditFormChange}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <select className='form-control form-select'
                                                                            value={editFormData?.imir_no}
                                                                            onChange={handleEditFormChange}
                                                                            name='imir_no'>
                                                                            <option value="">Select Imir No.</option>
                                                                            {/* {stockReportData?.map((e) =>
                                                                                    <option value={e.imir_no} key={e?._id}>{e?.imir_no}</option>
                                                                                )} */}
                                                                            {stockReportData?.filter((st) => st.itemId === elem.transaction_id.itemName._id && st.balance_qty > 0)?.map(e => (
                                                                                <option key={e._id} value={e.imir_no}>
                                                                                    {e.imir_no}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td>{editFormData.heat_no || '-'}</td>
                                                                    <td>{editFormData.quantity || '-'}</td>
                                                                    <td>
                                                                        <textarea className='form-control'
                                                                            name="remarks" rows={1}
                                                                            value={editFormData.remarks}
                                                                            onChange={handleEditFormChange}
                                                                        />
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.requested_qty}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.requested_width}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.requested_length}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.imir_no || '-'}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.heat_no || '-'}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.quantity || '-'}</td>
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                                </>
                                                            )}
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD')}</td>
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
                                                    <PaginationComponent
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
                    ) : null}

                    {(finalTable?.length === 0 || finalTable === undefined) && (
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12 text-end">
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>
                                                    {disable ? 'Processing...' : 'Generate Issue Acceptance'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ManageIssueAccEdit