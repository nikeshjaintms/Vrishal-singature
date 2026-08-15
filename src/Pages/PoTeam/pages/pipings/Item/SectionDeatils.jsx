import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItemDetails } from '../../../../../Store/Piping/Item/AdminItem';
import Loader from '../../../../Users/Include/Loader';
import { Pagination, Search } from '../../../../Users/Table';
import DropDown from '../../../../../Components/DropDown';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import DownloadFormat from '../../../../../Components/Piping/DrawingModal/DownloadFormat/DownloadFormat';
import PO_ROUTE_URLS from '../../../../../Routes/PoTeam/PoRoutes';

const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

const PipingSectionDeatils = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        dispatch(getAdminItemDetails({ is_main: false, currentPage, limit, search: debouncedSearch }))
            .finally(() => setDisable(false));
    }, [dispatch, debouncedSearch, currentPage, limit]);

    const entity = useSelector((state) => state?.getAdminItemDetails?.user?.data?.data);
    const pagination = useSelector((state) => state?.getAdminItemDetails?.user?.data?.pagination);

    useEffect(() => {
        if (pagination) {
            setTotalItems(pagination.total);
        }
    }, [pagination]);

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const projectId = localStorage.getItem("U_PROJECT_ID");
    const downloadUrl = projectId
        ? `${V_URL}/user/download-items-details?project=${projectId}`
        : `${V_URL}/user/download-items-details`;

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard </Link></li>
                                <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                <li className="breadcrumb-item active">Item Details List</li>
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
                                                    <h3>Item Details List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search
                                                                    onSearch={(value) => {
                                                                        setSearch(value);
                                                                        setCurrentPage(1);
                                                                    }} />
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg" alt="search" /></a>
                                                            </form>
                                                        </div>
                                                        <div className="add-group">
                                                            <Link to={PO_ROUTE_URLS.PIPING_MANAGE_SECTION_DETAILS}
                                                                className="btn btn-primary add-pluss ms-2" title="Add">
                                                                <img src="/assets/img/icons/plus.svg" alt="plus" />
                                                            </Link>
                                                            <button type='button' onClick={handleRefresh}
                                                                className="btn btn-primary doctor-refresh ms-2" title="Refresh">
                                                                <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <div className="add-group" style={{ marginRight: "10px" }}>
                                                    <DownloadFormat url={downloadUrl} fileName="Items" />
                                                </div>
                                                <DropDown limit={limit} onLimitChange={(val) => {
                                                    setlimit(val);
                                                    setCurrentPage(1);
                                                    setDisable(true);
                                                }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table border-0 custom-table comman-table mb-0 datatable">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Item Category</th>
                                                    <th>Item Code</th>
                                                    <th>Item Name</th>
                                                    <th>Description</th>
                                                    <th>Size 1</th>
                                                    <th>Thk 1</th>
                                                    <th>Size 2</th>
                                                    <th>Thk 2</th>
                                                    <th>Material Grade</th>
                                                    <th>UOM</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entity?.map((elem, i) =>
                                                    <tr key={elem?._id}>
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                        <td>{elem?.item_category?.name || "-"}</td>
                                                        <td>{elem?.item_code || "-"}</td>
                                                        <td>{elem?.item_name || "-"}</td>
                                                        <td>{elem?.item_description}</td>
                                                        <td>{elem?.size1?.name || "-"}</td>
                                                        <td>{elem?.thickness1?.name || "-"}</td>
                                                        <td>{elem?.size2?.name || "N/A"}</td>
                                                        <td>{elem?.thickness2?.name || "N/A"}</td>
                                                        <td>{elem?.material_grade || '-'}</td>
                                                        <td>{elem?.uom?.name || "-"}</td>
                                                        <td className='status-badge'>
                                                            {elem.status === true ? (
                                                                <span className="custom-badge status-green">Active</span>
                                                            ) : (
                                                                <span className="custom-badge status-pink">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="dropdown dropdown-action">
                                                                <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown"><i className="fa fa-ellipsis-v"></i></a>
                                                                <div className="dropdown-menu dropdown-menu-end">
                                                                    <button type='button' className="dropdown-item" onClick={() => navigate(PO_ROUTE_URLS.PIPING_MANAGE_SECTION_DETAILS, { state: elem })}>
                                                                        <i className="fa-solid fa-pen-to-square m-r-5"></i> Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                {entity?.length === 0 && (
                                                    <tr>
                                                        <td colSpan="999"><div className="no-table-data">No Data Found!</div></td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="dataTables_info">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="dataTables_paginate paging_simple_numbers">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={(page) => {
                                                        setCurrentPage(page);
                                                        setDisable(true);
                                                    }}
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
        </div>
    )
}

export default PipingSectionDeatils;