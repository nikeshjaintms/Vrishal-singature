import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserContractor } from '../../../../Store/Store/ContractorMaster/ContractorMaster';
import { getStockReportList } from '../../../../Store/Store/Stock/getStockReportList';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Dropdown } from 'primereact/dropdown';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import DrawingTable from '../Components/DrawingTable/DrawingTable';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import Footer from '../../Include/Footer';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';
import { getMultipleIssueRequest } from '../../../../Store/MutipleDrawing/IssueRequest/MultipleIssueRequest';
import DrawingItemsModal from '../Components/DrawingItemsModal/DrawingItemsModal';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import { updateMultiGrid } from '../../../../Store/MutipleDrawing/MultipleDrawing/UpdateGridBal';
import { getMultipleGrid } from '../../../../Store/MutipleDrawing/MultipleDrawing/MultipleGrid';
import { getIssueOfferTable } from '../../../../Store/MutipleDrawing/IssueRequest/getIssueOfferTable';
import { removeIssueOffTable } from '../../../../Store/MutipleDrawing/IssueRequest/removeIssueOfferTable';
import { updateIssueOffTable } from '../../../../Store/MutipleDrawing/IssueRequest/updateIssueOfferTable';
import CompleteDrawingTable from '../Components/CompletedDrawingTable/CompleteDrawingTable';
import { checkItemsDrawings } from '../../../../helper/hideDrawing';

const MultiIssueRequest = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [entity, setEntity] = useState([]);
    const [issueRequest, setIssueRequest] = useState({ name: '' });
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [search, setSearch] = useState("");
    const [issueArr, setIssueArr] = useState([]);
    const [disable, setDisable] = useState(false);
    const [finalReq, setFinalReq] = useState([]);
    const data = location.state;
    const [showItem, setShowItem] = useState(false);
    const [viewCompletedDrawing, setViewCompletedDrawing] = useState(false);
    const [drawId, setDrawId] = useState(null);
    const [isFd, setIsFd] = useState(null); // for true direct send to fd and false follow all steps
    const [drIds, setDrIds] = useState([]);
    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);

    useEffect(() => {
        if (location.state?._id) {
            setIssueRequest({
                name: data?.items[0]?.drawing_id?.issued_person?._id
            });
            setFinalReq(data?.items);
            setIsFd(data?.isFd);
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(getUserAdminDraw())
        dispatch(getUserContractor({ status: true }))
        dispatch(getMultipleIssueRequest())
        dispatch(getStockReportList())
        dispatch(getMultipleGrid({ drawing_id: '' }));
    }, []);

    useEffect(() => {
        if (issueRequest.name) {
            dispatch(getIssueOfferTable({ contractor_id: issueRequest.name }))
        }
    }, [issueRequest.name]);

    const issueOffTableData = useSelector((state) => state?.getIssueOfferTable?.user?.data);
    const contractorData = useSelector(state => state.getUserContractor?.user?.data);
    const drawData = useSelector(state => state.getUserAdminDraw?.user?.data);
    const gridData = useSelector((state) => state?.getMultipleGrid?.user?.data);
    const stockData = useSelector((state) => state?.getStockReportList?.user?.data);

    useEffect(() => {
        const filterData = issueOffTableData?.items?.filter((it) => it?.is_issue === false);
        setIssueArr(filterData || [])
    }, [issueOffTableData]);

    useEffect(() => {
        const filterDraw = drawData?.filter(dr => dr.issued_person?._id === issueRequest.name && dr?.project?._id === localStorage.getItem('U_PROJECT_ID'));
        setDrIds(filterDraw?.map(dr => dr._id));
        setEntity(filterDraw);
    }, [drawData, issueRequest.name]);

    const checkDrawingGrids = async () => {
        const response = await checkItemsDrawings(drIds, dispatch, entity);
        setUnMatchDatas(response?.unmatchData);
        setMatchDatas(response?.matchData);
    }

    useEffect(() => {
        if (drIds?.length > 0) {
            checkDrawingGrids();
        }
    }, [drIds]);

    const commentsData = useMemo(() => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        let computedComments = matchDatas || [];

        if (computedComments) {
            computedComments = computedComments?.filter((o) => o?.project?._id === projectId);
        }
        if (search) {
            computedComments = computedComments.filter(
                (dr) =>
                    dr?.drawing_no.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.rev?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.assembly_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.sheet_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity, matchDatas]);

    const handleChange = (e, name) => {
        setIssueRequest({ ...issueRequest, [name]: e.value });
    }

    const handleAddToIssueArr = (item) => {
        setShowItem(true);
        setDrawId(item?._id);
    };

    const handleCompletedDrawing = () => {
        setViewCompletedDrawing(!viewCompletedDrawing)
    };

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        item_qty: '',
        item_length: '',
        item_width: '',
        remarks: ''
    });

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            item_qty: row.item_qty,
            item_length: row.item_length,
            item_width: row.item_width,
            remarks: row.remarks || ''
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'item_qty' || name === 'item_length' || name === 'item_width') {
            if (/^\d*$/.test(value)) {
                setEditFormData({ ...editFormData, [name]: value });
            }
        } else {
            setEditFormData({ ...editFormData, [name]: value });
        }
    };

    const handleSaveClick = () => {
        const updatedData = [...issueArr];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setIssueArr(updatedData);
        setEditRowIndex(null);
    };

    const handleRemoveByItem = (itemId, report) => {
        const updatedIssueArr = issueArr.filter((item) => (item._id)?.toString() === (itemId)?.toString());

        const removeItem = new URLSearchParams();
        removeItem.append('contractor_id', issueRequest.name);
        removeItem.append('items', JSON.stringify(updatedIssueArr))
        removeItem.append('report_no', report);
        dispatch(removeIssueOffTable({ bodyFormData: removeItem })).then((response) => {
            console.log(response, 'updated')
            if (response.payload.success === true) {
                const bodyFormData = new URLSearchParams();
                bodyFormData.append('flag', 0)
                bodyFormData.append('updateItems', JSON.stringify(updatedIssueArr))
                dispatch(updateMultiGrid({ bodyFormData }));
                const updatedIssueArr1 = issueArr.filter((item) => item._id !== itemId);
                setIssueArr(updatedIssueArr1); // Update state
                toast.success("Item has been removed!");
            } else {
                toast.error("Failed to remove item!");
            }
        })
    };

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleStatusChange = (event) => {
        setIsFd(event.target.value === 'accept');
    };

    const getDrawing = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }

    const handleSubmit = () => {
        if (issueArr?.length === 0) {
            toast.error("Please add at least one item.");
            return;
        }
        if (isFd === null) {
            toast.error("Please select the next procedure(fitup or fd)");
            return;
        }
        let updatedData = issueArr;

        if (isFd === true) {
            const allDrawingIds = updatedData.map((data) => data.drawing_id);
            const uniqueDrawingIds = [...new Set(allDrawingIds)];
            if (uniqueDrawingIds.length > 1) {
                toast.error("Mismatch found: All items must have the same drawing ID.");
                return;
            }
            const filteredGridData = gridData.filter((grid) =>
                updatedData.some((data) => data?.drawing_id === grid?.drawing_id?._id)
            );
            if (filteredGridData?.length > 0) {
                const mismatchedItems = updatedData.filter((data) => {
                    const matchingGrid = filteredGridData.find((grid) => grid._id === data.grid_id._id);
                    return matchingGrid && matchingGrid.grid_qty !== data.used_grid_qty;
                });
                if (mismatchedItems.length > 0) {
                    toast.error(
                        `Mismatch found: Original grid quantity and used grid quantity must be the same.`
                    );
                    return;
                }
            }
        }

        if (editRowIndex !== null) {
            updatedData = [...issueArr];
            const dataIndex = (currentPage - 1) * limit + editRowIndex;
            updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
            setIssueArr(updatedData);
        }

        for (const item of updatedData) {
            const totalStock = stockData
                ?.filter(s => s.itemId === item.item_name?._id)
                ?.reduce((acc, curr) => acc + (curr.balance_qty || 0), 0) || 0;

            if (totalStock < (item.multiply_iss_qty || 0)) {
                toast.error(`Stock shortage for item: ${item.item_name?.name}. Available: ${totalStock}, Iss. Qty.(KG): ${item.multiply_iss_qty}`);
                return;
            }
        }

        const filteredData = updatedData.map(item => ({
            grid_item_id: item._id,
            used_grid_qty: item.used_grid_qty,
            balance_grid_qty: item.balance_grid_qty,
            requested_length: item.item_length,
            requested_width: item.item_width,
            requested_qty: item.item_qty,
            multiply_iss_qty: item.multiply_iss_qty,
            drawing_id: item.drawing_id,
            remarks: item.remarks || '',
            is_issue: true,
            report_no: item.report_no,
            contractorId: issueRequest.name,
        }));

        setDisable(true);
        const myurl = `${V_URL}/user/manage-multi-issue-request`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('requested_by', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('items', JSON.stringify(filteredData));
        bodyFormData.append('isFd', isFd);
        if (data?._id) {
            bodyFormData.append('id', data?._id);
        }
        axios({
            method: 'post',
            url: myurl,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then((response) => {
            if (response.data.success === true) {
                toast.success(response?.data?.message);
                const updatedData = new URLSearchParams();
                updatedData.append('items', JSON.stringify(filteredData));
                dispatch(getMultipleIssueRequest());
                dispatch(updateIssueOffTable({ updatedData })).then((response) => {
                    console.log(response, 'updated')
                    if (response.payload.success === true) {
                        setIssueArr([]);
                        dispatch(getIssueOfferTable({ contractor_id: issueRequest.name }))
                        navigate('/user/project-store/issue-request-management');
                    }
                });
            }
            setDisable(false);
        }).catch((error) => {
            toast.error(error?.response?.data?.message)
            setDisable(false);
        });
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const conOptions = contractorData?.map(e => ({
        label: e?.name,
        value: e?._id
    }));

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={
                        [
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Issue Request List", link: "/user/project-store/issue-request-management", active: false },
                            { name: "Add Issue Request", active: true }
                        ]
                    } />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Issue Request List</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="staff-search-table">
                                        <div className="row d-flex align-items-center justify-content-between">
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Issued Person / Contractor Name</label>
                                                    <Dropdown
                                                        options={conOptions}
                                                        value={issueRequest.name}
                                                        onChange={(e) => handleChange(e, 'name')}
                                                        filter className='w-100'
                                                        placeholder="Select Contractor"
                                                        disabled={data?._id}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-xl-6 ">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <button
                                                        className="btn btn-primary mx-2 "
                                                        type="button"
                                                        onClick={() => handleCompletedDrawing()}
                                                    >
                                                        {viewCompletedDrawing ? "Hide Completed Drawing List (Scroll Down)" : "View Completed Drawing List"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DrawingTable
                        tableTitle={'Material Issued Request List'}
                        commentsData={commentsData}
                        handleAddToIssueArr={handleAddToIssueArr}
                        currentPage={currentPage}
                        limit={limit}
                        setlimit={setlimit}
                        totalItems={totalItems}
                        setCurrentPage={setCurrentPage}
                        setSearch={setSearch}
                        data={data}
                    />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Item List</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(finalReq?.length === 0 && !data?._id && data === null) ? (
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Drawing No.</th>
                                                        <th>Gri. No.</th>
                                                        <th>Gri. Qty.</th>
                                                        <th>Gri. Bal Qty.</th>
                                                        <th>Gri. Use Qty.</th>
                                                        <th>Section Details</th>
                                                        <th>Item No.</th>
                                                        <th>Item Qty.(NOS)</th>
                                                        <th>Item Weight(kg)</th>
                                                        <th>Assem. Weight(kg)</th>
                                                        <th>ASM(sqm)</th>
                                                        <th>Iss. Qty.(KG)</th>
                                                        <th>Item Qty</th>
                                                        <th>Stock qty</th>
                                                        <th>Length(mm)</th>
                                                        <th>Width(mm)</th>
                                                        <th>Remarks</th>
                                                        <th className='text-end'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {issueArr?.map((elem, i) => {
                                                        const stockQty = stockData?.filter(s => s.itemId === elem?.item_name?._id)?.reduce((acc, curr) => acc + (curr.balance_qty || 0), 0) || 0;
                                                        return (
                                                            <tr key={i}>
                                                                <td>{i + 1}</td>
                                                                <td>{getDrawing(elem?.drawing_id)?.drawing_no}</td>
                                                                <td>{elem?.grid_id?.grid_no}</td>
                                                                <td>{elem?.grid_id?.grid_qty}</td>
                                                                <td>{elem?.balance_grid_qty}</td>
                                                                <td>{elem?.used_grid_qty}</td>
                                                                <td>{elem?.item_name?.name}</td>
                                                                <td>{elem?.item_no}</td>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input className='form-control' style={{ padding: "4px" }} type="number" name="item_qty"
                                                                                value={editFormData.item_qty} onChange={handleEditFormChange} disabled={data?._id} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.item_qty}</td>
                                                                )}
                                                                <td>{elem?.item_weight}</td>
                                                                <td>{elem?.assembly_weight}</td>
                                                                <td>{elem?.assembly_surface_area}</td>
                                                                <td>{elem?.multiply_iss_qty}</td>
                                                                {editRowIndex === i ? (
                                                                    <>
                                                                        <td>
                                                                            <input className='form-control' type="number" name="item_qty" style={{ padding: "4px" }}
                                                                                value={editFormData.item_qty} onChange={handleEditFormChange} disabled={data?._id} />
                                                                        </td>
                                                                        <td style={{ color: stockQty > 0 ? "green" : "red" }}>{stockQty.toFixed(2)}</td>
                                                                        <td>
                                                                            <input className='form-control' type="number" name="item_length" style={{ padding: "4px" }}
                                                                                value={editFormData.item_length} onChange={handleEditFormChange} disabled={data?._id} />
                                                                        </td>
                                                                        <td>
                                                                            <input className='form-control' type="number" name="item_width"
                                                                                value={editFormData.item_width} style={{ padding: "4px" }}
                                                                                onChange={handleEditFormChange} disabled={data?._id} />
                                                                        </td>
                                                                        <td>
                                                                            <textarea className='form-control' name="remarks" rows={1}
                                                                                value={editFormData.remarks} onChange={handleEditFormChange} disabled={data?._id} />
                                                                        </td>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.item_qty}</td>
                                                                        <td style={{ color: stockQty > 0 ? "green" : "red" }} onClick={() => handleEditClick(i, elem)}>{stockQty.toFixed(2)}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.item_length}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.item_width}</td>
                                                                        <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                                    </>
                                                                )}
                                                                {editRowIndex === i ? (
                                                                    <td>
                                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                                    </td>
                                                                ) : <td className='text-end'>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger p-1 mx-1"
                                                                        onClick={() => handleRemoveByItem(elem._id, elem.report_no)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </td>}
                                                            </tr>
                                                        )
                                                    })}
                                                    {issueArr?.length === 0 ? (
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
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Drawing No.</th>
                                                        <th>Rev</th>
                                                        <th>Assem. No.</th>
                                                        <th>Assem. Qty.</th>
                                                        <th>Gri. No</th>
                                                        <th>Gri. Qty.</th>
                                                        <th>Gri. Bal. Qty.</th>
                                                        <th>Gri. Use Qty.</th>
                                                        <th>Section Details</th>
                                                        <th>Iss. Qty.</th>
                                                        <th>Req. Qty.</th>
                                                        <th>Req. Width</th>
                                                        <th>Req. Length</th>
                                                        <th>Date</th>
                                                        <th>Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {finalReq?.map((elem, i) =>
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{elem?.drawing_id?.drawing_no}</td>
                                                            <td>{elem?.drawing_id?.rev}</td>
                                                            <td>{elem?.drawing_id?.assembly_no}</td>
                                                            <td>{elem?.drawing_id?.assembly_quantity}</td>
                                                            <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                                                            <td>{elem?.grid_item_id?.grid_id?.grid_qty}</td>
                                                            <td>{elem?.balance_grid_qty}</td>
                                                            <td>{elem?.used_grid_qty}</td>
                                                            <td>{elem?.grid_item_id?.item_name?.name}</td>
                                                            <td>{elem?.multiply_iss_qty}</td>
                                                            <td>{elem?.requested_qty}</td>
                                                            <td>{elem?.requested_width}</td>
                                                            <td>{elem?.requested_length}</td>
                                                            <td>{moment(data?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>{elem?.remarks || '-'}</td>
                                                        </tr>
                                                    )}
                                                    {finalReq?.length === 0 ? (
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <SubmitButton finalReq={finalReq} disable={disable} handleSubmit={handleSubmit}
                        link={'/user/project-store/issue-request-management'} buttonName={'Generate Issue Request'}
                        isFd={isFd} handleStatusChange={handleStatusChange} data={data} showFd={true} />

                    {viewCompletedDrawing && (
                        <CompleteDrawingTable
                            tableTitle={'Completed Material Issued Request List'}
                            entity={unMatchedDatas || []}
                            handleAddToIssueArr={handleAddToIssueArr}
                            data={data}
                        />
                    )}

                </div>
                <Footer />
            </div>
            <DrawingItemsModal
                showItem={showItem}
                drawId={drawId}
                handleCloseModal={() => setShowItem(false)}
                title={'Drawing Items List'}
                setFinalTableData={setIssueArr}
                finalTableData={issueArr}
                contractorData={issueRequest}
            />

        </div>
    )
}

export default MultiIssueRequest