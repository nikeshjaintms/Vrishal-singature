import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
const ViewGenReleaseNote = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, setTableData] = useState([]);
    const data = location.state;

    useEffect(() => {
        if (data) {
            setTableData(data?.items);
        }
    }, [data]);

    const commentsData = useMemo(() => {
        let computedComments = tableData || [];

        if (search) {
            computedComments = computedComments.filter(
                (fit) =>
                    fit?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }

        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, tableData]);

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
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Release Note For Site Dispatch List", link: "/piping/user/stock-release-note-management", active: false },
                        { name: `View Release Note For Site Dispatch Details`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Stock Release Note For Site Dispatch Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>View Stock Release Note For Site Dispatch List <span className="login-danger">*</span></label>
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
                                                    <h3>View Stock Release Note For Site Dispatch List</h3>
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
                                                 
                                                    <th>Item </th>
                                                     <th>Size 1</th>
                                                        <th>Thickness 1</th>
                                                        <th>Size 2</th>
                                                        <th>Thickness 2</th>
                                                        <th>Material Grade</th>
                                                
                                                    <th>Surface Preparation & Primer Paint Inspection </th>
                                                    <th>MIO Inspection</th>
                                                    <th>Final Paint Inspection</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.length > 0 ? (
                                                    commentsData?.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            
                                                            <td>{elem?.item_name || '-'}</td>
                                                            <td>{elem?.size1?.name  || '-'}</td>
                                                            <td>{elem?.thickness1?.name  || '-'}</td>
                                                            <td>{elem.size2?.name  || '-'}</td>
                                                            <td>{elem.thickness2?.name  || '-'}</td>
                                                            <td>{elem?.material_grade  || '-'}</td>

   
                
                                                            <td>
                                                                {elem?.surface_report &&
                                                                    elem.surface_report.length > 0 ? (
                                                                    elem.surface_report
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .map((e, index) => <div key={index}>{e}</div>)
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </td>
                                                            <td>
                                                                {elem?.mio_report &&
                                                                    elem.mio_report.length > 0 ? (
                                                                    elem.mio_report
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .map((e, index) => <div key={index}>{e}</div>)
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </td>
                                                            <td>
                                                                {elem?.final_coat_report &&
                                                                    elem.final_coat_report.length > 0 ? (
                                                                    elem.final_coat_report
                                                                        .filter((value, index, self) => self.indexOf(value) === index)
                                                                        .map((e, index) => <div key={index}>{e}</div>)
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </td>
                                                            <td>{elem?.remarks || "-"}</td>
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
                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/stock-release-note-management')}>Back</button>
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

export default ViewGenReleaseNote