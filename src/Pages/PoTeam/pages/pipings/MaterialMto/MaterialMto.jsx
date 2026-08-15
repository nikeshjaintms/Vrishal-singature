import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import axios from 'axios';

import Loader from '../../../../Users/Include/Loader';
import { Pagination } from '../../../../Users/Table';
import DropDown from '../../../../../Components/DropDown';
import { CENTRAL_PLAN, M_CON, QC, V_URL } from '../../../../../BaseUrl';
import { SendHorizontal } from 'lucide-react';
import moment from 'moment';
import PO_ROUTE_URLS from '../../../../../Routes/PoTeam/PoRoutes';

import { getAllMaterialControlList } from '../../../../../Store/PoTeam/piping/MaterialControlList/MaterialControlListSlice';

// Debounce hook
const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
};

const PipingMaterialMto = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ---------------- States ----------------
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [selectedMtos, setSelectedMtos] = useState([]);

    const paginatedTableData = useMemo(() => {
        const start = (currentPage - 1) * limit;
        const end = start + limit;
        return tableData.slice(start, end);
    }, [tableData, currentPage, limit]);

    const debouncedSearch = useDebounce(search, 500);
    const entity = useSelector((state) => state.MaterialControlList.list);
    const loading = useSelector((state) => state.MaterialControlList.loading);

    useEffect(() => {
        if (!Array.isArray(entity)) {
            setTableData([]);
            setTotalItems(0);
            return;
        }

        const mtoRows = entity.map((mto) => ({
            _id: mto._id,
            date: mto.date,
            mto_no: mto.mto_no ?? "-",
            material_control_chart: mto.material_control_chart ?? "-",
            area_unit: mto.area_unit?.area || mto.area_unit?.name || "-",
            project_name: mto.project?.name ?? "-",
            pr_by: mto.pr_by?.user_name ?? "-",
            status: mto.status,
            send_to_pr: mto.send_to_pr ?? false,
            ready_for_pr_qty: mto.ready_for_pr_qty ?? 0,
            lineno_drawingno: mto.lineno_drawingno?.map((line) => ({
                ...line,
                drawings: line.drawings?.map((d) => ({
                    ...d,
                    drawing_id: d.drawing_id,
                })),
            })) ?? [],
        }));

        setTableData(mtoRows);
        setTotalItems(mtoRows.length);
    }, [entity]);

    const fetchMtos = () => {
        dispatch(getAllMaterialControlList({
            search: debouncedSearch,
            page: currentPage,
            project: localStorage.getItem('U_PROJECT_ID'),
            limit,
        }));
    };

    useEffect(() => {
        fetchMtos();
    }, [currentPage, limit, debouncedSearch]);

    const handleDelete = (id, title) => {
        Swal.fire({
            title: `Delete Material Control ${title}?`,
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("PAY_USER_TOKEN");
                    const response = await axios.delete(`${V_URL}/user/delete-material-control-list`, {
                        headers: { Authorization: `Bearer ${token}` },
                        data: { id },
                    });

                    if (response.data.success) {
                        toast.success(response.data.message);
                        fetchMtos();
                    } else {
                        toast.error(response.data.message);
                    }
                } catch {
                    toast.error("Something went wrong");
                }
            }
        });
    };

    const handleRefresh = () => {
        setSearch('');
        setCurrentPage(1);
        setLimit(10);
        setSelectedMtos([]);
        fetchMtos();
    };

    // ---------------- Multi-Select Handlers ----------------
    const handleCheckboxChange = (id) => {
        setSelectedMtos(prev =>
            prev.includes(id)
                ? prev.filter(mId => mId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const checkableRows = paginatedTableData.filter(row => row.status === 1 && !row.send_to_pr);
        if (selectedMtos.length === checkableRows.length && checkableRows.length > 0) {
            setSelectedMtos([]);
        } else {
            setSelectedMtos(checkableRows.map(row => row._id));
        }
    };

    const handleSendMultipleToPR = () => {
        if (selectedMtos.length === 0) {
            toast.error("Please select at least one Material Control record");
            return;
        }

        Swal.fire({
            title: `Send ${selectedMtos.length} Material Control record(s) to PR?`,
            text: "This action will convert them for Procurement Request.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, send them!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("PAY_USER_TOKEN");
                    const response = await axios.post(
                        `${V_URL}/user/update-multiple-material-control-to-pr`,
                        {
                            ids: selectedMtos,
                            updated_by: localStorage.getItem("PAY_USER_ID")
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (response.data.success) {
                        toast.success(response.data.message);
                        setSelectedMtos([]);
                        fetchMtos();
                    } else {
                        toast.error(response.data.message);
                    }
                } catch (err) {
                    toast.error(err.response?.data?.message || "Something went wrong");
                }
            }
        });
    };

    const handleDownloadPDF = async (id) => {
        try {
            const token = localStorage.getItem("PAY_USER_TOKEN");
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('mto_id', id);
            const response = await axios.post(
                `${V_URL}/user/material-control-download-pdf`,
                bodyFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const pdfUrl = response.data.data.file;
                window.open(pdfUrl, "_blank");
            } else {
                toast.error(response.data.message || "Failed to download PDF");
            }
        } catch (err) {
            toast.error("Something went wrong while downloading PDF");
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleSendPr = (id, title) => {
        Swal.fire({
            title: `Are you sure you want to send ${title} to Pr?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, send it to PR!",
        }).then((result) => {
            if (result.isConfirmed) {
                const myurl = `${V_URL}/user/send-fim-to-pe`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("fim_id", id);

                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                })
                    .then((response) => {
                        if (response.data.success === true) {
                            toast.success(response?.data?.message);
                            fetchMtos();
                        } else {
                            toast.error(response?.data?.message);
                        }
                    })
                    .catch((error) => {
                        toast.error(error?.response?.data?.message || "Something went wrong");
                    });
            }
        });
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                <li className="breadcrumb-item active">Material Control List</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {loading ? <Loader /> : (
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Material Control List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Search"
                                                                    value={search}
                                                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                                                />
                                                                <a className="btn">
                                                                    <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                                                </a>
                                                            </form>
                                                        </div>
                                                        <div className="add-group">
                                                            <Link to={PO_ROUTE_URLS.PIPING_MANAGE_MTO}
                                                                className="btn btn-primary add-pluss ms-2"
                                                                title="Add">
                                                                <img src="/assets/img/icons/plus.svg" alt="plus-icon" />
                                                            </Link>
                                                            <button className="btn btn-primary doctor-refresh ms-2" onClick={handleRefresh}>
                                                                <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                                            </button>
                                                            {(localStorage.getItem('ERP_ROLE') === M_CON || localStorage.getItem('ERP_ROLE') === CENTRAL_PLAN) && selectedMtos.length > 0 && (
                                                                <button className="btn btn-primary ms-2" onClick={handleSendMultipleToPR}>
                                                                    Send Selected to PR
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={setLimit} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table border-0 custom-table comman-table mb-0">
                                            <thead>
                                                <tr>
                                                    {(localStorage.getItem('ERP_ROLE') === M_CON || localStorage.getItem('ERP_ROLE') === CENTRAL_PLAN) && (
                                                        <th>
                                                            <input
                                                                type="checkbox"
                                                                onChange={handleSelectAll}
                                                                checked={paginatedTableData.length > 0 && paginatedTableData.filter(r => r.status === 1 && !r.send_to_pr).length > 0 && selectedMtos.length === paginatedTableData.filter(r => r.status === 1 && !r.send_to_pr).length}
                                                            />
                                                        </th>
                                                    )}
                                                    <th>Sr.</th>
                                                    <th>Entry Date Time</th>
                                                    <th>MTO No.</th>
                                                    <th>Area / Location</th>
                                                    <th>Material Control Chart</th>
                                                    <th>Prepared By</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="999"><div className="no-table-data">No Data Found!</div></td>
                                                    </tr>
                                                ) : (
                                                    paginatedTableData.map((row, i) => (
                                                        <tr key={row._id + i}>
                                                            {(localStorage.getItem('ERP_ROLE') === M_CON || localStorage.getItem('ERP_ROLE') === CENTRAL_PLAN) && (
                                                                <td>
                                                                    {row.status === 1 && !row.send_to_pr ? (
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedMtos.includes(row._id)}
                                                                            onChange={() => handleCheckboxChange(row._id)}
                                                                        />
                                                                    ) : null}
                                                                </td>
                                                            )}
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{moment(row.date).format('DD MMM YYYY, hh:mm:ss A')}</td>
                                                            <td>{row.mto_no}</td>
                                                            <td>{row.area_unit}</td>
                                                            <td>{row.material_control_chart}</td>
                                                            <td>{row.pr_by}</td>
                                                            <td>
                                                                {row.status === 2 ? (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                ) : row.send_to_pr === true ? (
                                                                    <span className="custom-badge status-green">Sent to PR</span>
                                                                ) : row.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Ready for PR</span>
                                                                ) : row.status === 0 ? (
                                                                    <span className="custom-badge status-pink">Pending</span>
                                                                ) : (
                                                                    <span className="custom-badge status-grey">Unknown</span>
                                                                )}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-v"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button className="dropdown-item" onClick={() => navigate(PO_ROUTE_URLS.PIPING_MTO_VIEW, { state: row })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i> View
                                                                        </button>
                                                                        <button className="dropdown-item" onClick={() => handleDownloadPDF(row._id)}>
                                                                            <i className="fa fa-file-pdf m-r-5"></i> Download MTO
                                                                        </button>
                                                                        <button
                                                                            className="dropdown-item"
                                                                            onClick={() => navigate(PO_ROUTE_URLS.PIPING_MANAGE_MTO, { state: row })}
                                                                        >
                                                                            <i className="fa-solid fa-pen m-r-5"></i> Edit
                                                                        </button>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(row._id, row.mto_no)}>
                                                                            <i className="fa fa-trash-alt m-r-5"></i> Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="dataTables_info">
                                                Showing {paginatedTableData.length} from {totalItems} data
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="dataTables_paginate paging_simple_numbers">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={setCurrentPage}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PipingMaterialMto;
