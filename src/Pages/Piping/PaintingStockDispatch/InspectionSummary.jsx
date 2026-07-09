import React, { useEffect, useMemo, useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserInspectionSummary } from '../../../Store/Store/InspectionSummary/GetInspectionSummary';
import DropDown from '../../../Components/DropDown';
import moment from 'moment';
import { Pagination, Search } from '../Table';
import Loader from '../Include/Loader';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import { QC, V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserGenInspectionSummary } from '../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';

const InspectionSummary = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [totalItems1, setTotalItems1] = useState(0);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
    const [disable, setDisable] = useState(true);
    const [disable1, setDisable1] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    const fatchData = () => {
        dispatch(getUserInspectionSummary())
        dispatch(getUserGenInspectionSummary())
        // setDisable(false);
    }

    useEffect(() => {
        if (disable === true) {
            dispatch(getUserInspectionSummary())
            setDisable(false);
        } else if (disable1 === true) {
            dispatch(getUserGenInspectionSummary())
            setDisable1(false);
        }
    }, [dispatch, disable, disable1]);

    const entity = useSelector(state => state.getUserInspectionSummary?.user?.data);
    const genratedEntity = useSelector(state => state.getUserGenInspectionSummary?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        const projectId = localStorage.getItem('U_PROJECT_ID');
        if (computedComments) {
            computedComments = computedComments?.filter(o =>
                o?.project_id === projectId
            );
        }
        if (search) {
            computedComments = computedComments.filter(
                (fit) =>
                    fit?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    fit?.items?.some((e) => e?.drawing_no?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.assembly_no?.toLowerCase().includes(search.toLowerCase()))
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const genCommentsData = useMemo(() => {
        let computedComments = genratedEntity;
        const projectId = localStorage.getItem('U_PROJECT_ID');
        if (computedComments) {
            computedComments = computedComments?.filter(o =>
                o?.project_id === projectId
            );
        }
        if (search1) {
            computedComments = computedComments.filter((fit) =>
                fit?.items?.some((e) => e?.drawing_no?.toLowerCase().includes(search1.toLowerCase())) ||
                fit?.items?.some((e) => e?.assembly_no?.toLowerCase().includes(search1.toLowerCase()))
            );
        }

        setTotalItems1(computedComments?.length);
        return computedComments?.slice(
            (currentPage1 - 1) * limit1,
            (currentPage1 - 1) * limit1 + limit1
        );
    }, [currentPage1, search1, limit1, genratedEntity]);

    const handleGanrateMIS = () => {
        const payload = {
            "project": localStorage.getItem("PAY_USER_PROJECT_NAME"),
            "id": selectedRows
        }
        const myurl = `${V_URL}/user/generate-multi-inspect`;
        axios({
            method: "post",
            url: myurl,
            data: payload,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response?.data?.success === true) {
                toast.success(response?.data?.message);
                fatchData();
                setSelectedRows([]);
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally((() => { setDisable(false) }));
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }
    const handleRefresh1 = () => {
        setSearch1('');
        setDisable1(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const isAllSelected = commentsData?.length > 0 && selectedRows?.length === commentsData?.length;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(commentsData.map((row) => row._id));
        }
    };
    const handleSelectRow = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id)
                ? prevSelectedRows.filter((rowId) => rowId !== id)
                : [...prevSelectedRows, id]
        );
    };
    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('batch_id', elem?.batch_id);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-inspect-generate', body: bodyFormData });
    }

    return (

        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
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
                                    <li className="breadcrumb-item active">Inspection Summary Records List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Inspection Summary Records List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} />
                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" />
                                                                    </a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {localStorage.getItem('ERP_ROLE') === QC && (
                                                        <>
                                                            {selectedRows.length > 0 && <div className='add-group'>
                                                                <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button'
                                                                    onClick={() => { handleGanrateMIS() }}
                                                                > Generate Ins. <i className="fa-solid fa-download mx-2"></i></button>
                                                            </div>
                                                            }
                                                        </>
                                                    )}
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table mb-0 datatable">
                                                <thead>
                                                    <tr>

                                                        <>
                                                            <th className="text-center" style={{ width: "25px" }}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    checked={isAllSelected}
                                                                    onChange={handleSelectAll}
                                                                />
                                                            </th>
                                                        </>
                                                        <th className="text-start" style={{ width: "35px" }}>Sr.</th>
                                                        {/* <th>Report No.</th> */}
                                                        <th>Drawing No.</th>
                                                        <th>Assem No.</th>
                                                        <th>Date</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {commentsData?.length > 0 ? (
                                                        commentsData.map((elem, i) => (
                                                            <tr key={elem?._id}>
                                                                <td className="text-center">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={selectedRows.includes(elem._id)}
                                                                        onChange={() => handleSelectRow(elem._id)}
                                                                    />
                                                                </td>
                                                                <td className="text-start">
                                                                    {(currentPage - 1) * limit + i + 1}
                                                                </td>
                                                                {/* <td>{elem?.report_no || "-"}</td> */}
                                                                <td>
                                                                    {elem?.items
                                                                        ?.map(e => e?.drawing_no)
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .join(", ") || "-"}
                                                                </td>
                                                                <td>
                                                                    {elem?.items
                                                                        ?.map(e => e?.assembly_no)
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .join(", ") || "-"}
                                                                </td>
                                                                <td>{moment(elem?.summary_date).format("YYYY-MM-DD HH:mm")}</td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a
                                                                            href="#"
                                                                            className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa fa-ellipsis-v"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button
                                                                                type="button"
                                                                                className="dropdown-item"
                                                                                onClick={() =>
                                                                                    navigate("/piping/user/view-inspection-summary", {
                                                                                        state: elem,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <i className="fa-solid fa-eye m-r-5"></i> View
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="999">
                                                                <div className="no-table-data">No Data Found!</div>
                                                            </td>
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
                    ) : <Loader />}

                    {disable1 === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Generated Inspection Summary Records</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch1(value);
                                                                            setCurrentPage1(1);
                                                                        }} />
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh1}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th className="text-start" style={{ width: "35px" }}>Sr.</th>
                                                        {/* <th>Drawing No.</th> */}
                                                        <th>Report No.</th>
                                                        <th>Unit/Area</th>
                                                        <th>Assem No.</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {genCommentsData?.length > 0 ? (
                                                        genCommentsData.map((elem, i) => (
                                                            <tr key={elem?._id}>
                                                                <td className="text-start">
                                                                    {(currentPage1 - 1) * limit1 + i + 1}
                                                                </td>

                                                                {/* <td>
                                                                    {elem?.items
                                                                        ?.map(e => e?.drawing_no)
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .join(", ") || "-"}
                                                                </td> */}
                                                                <td>{elem?.report_no}</td>
                                                                <td>
                                                                    {elem?.items
                                                                        ?.map(e => e?.unit_area)
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .join(", ") || "-"}
                                                                </td>
                                                                <td>
                                                                    {elem?.items
                                                                        ?.map(e => e?.assembly_no)
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .join(", ") || "-"}
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a
                                                                            href="#"
                                                                            className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa fa-ellipsis-v"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button
                                                                                type="button"
                                                                                className="dropdown-item"
                                                                                onClick={() =>
                                                                                    navigate("/piping/user/view-geninspection-summary", {
                                                                                        state: elem,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <i className="fa-solid fa-eye m-r-5"></i> View
                                                                            </button>
                                                                            <button type='button' className="dropdown-item"
                                                                                onClick={() => handleDownloadIns(elem)}
                                                                            >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5">
                                                                <div className="no-table-data">No Data Found!</div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row align-center mt-3 mb-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems1}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        onPageChange={(page) => setCurrentPage1(page)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loader />}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default InspectionSummary