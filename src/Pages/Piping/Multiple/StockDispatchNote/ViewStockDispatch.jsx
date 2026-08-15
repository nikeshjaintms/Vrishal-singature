import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';

const ViewDispatch = () => {
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
        dispatch(getUserAdminDraw());
        dispatch(getUserWpsMaster({ status: true }));
    }, []);

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
                        { name: "Stock Dispatch Note- PAINTING", link: "/piping/user/stock-dispatch-note-management", active: false },
                        { name: `View Stock Dispatch Note Details`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Dispatch Note Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Dispatch Note No <span className="login-danger">*</span></label>
                                                    <input value={data?.report_no} className='form-control' readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Dispatch Site <span className="login-danger">*</span></label>
                                                    <input value={data?.dispatch_site} className='form-control' readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Dispatch Date <span className="login-danger">*</span></label>
                                                    <input value={moment(data?.dispatch_date).format('YYYY-MM-DD HH:mm')} className='form-control' readOnly />
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
                                                    <h3>View Dispatch Note Details</h3>
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
                                                    <th>Item</th>                                            
                                                    <th>Size1</th>
                                                    <th>Thickness1</th>
                                                    <th>Size2</th>
                                                    <th>Thickness2</th>
                                                    <th>UOM</th>
                                                    <th>Qty</th>
                                                    <th>Area (SQM)</th>
                                                    <th>Piping Class</th>
                                                    <th>Service</th>
                                                    <th>Piping Material Specification</th>
                                                    <th>Final Coat Ral No.</th>
                                                    {/* <th>Paint System No.</th> */}
                                                    <th>Remarks</th>
                                                    {/* <th>Action</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData?.length > 0 ? (
                                                    commentsData?.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                          
                                                            <td>{elem?.item_name || "-"}</td>
                                                        
                                                            <td>{elem?.size1 || "-"}</td>
                                                            <td>{elem?.thickness1 || "-"}</td>
                                                            <td>{elem?.size2 || "-"}</td>
                                                            <td>{elem?.thickness2 || "-"}</td>
                                                            <td>{elem?.spool_id ? 'NOS' : elem?.uom || "-"}</td>
                                                            <td>{elem?.qty || "-"}</td>
                                                            <td>{elem?.area || elem?.area_sqm || "-"}</td>
                                                            <td>
                                                                {typeof elem?.piping_class === 'object' 
                                                                    ? elem?.piping_class?.name || elem?.piping_class?.PipingClass 
                                                                    : (elem?.piping_class || elem?.PipingClass || "-")}
                                                            </td>
                                                            <td>
                                                                {elem.service}
                                                            </td>
                                                            <td>
                                                                {typeof elem?.PipingMaterialSpecification === 'object' 
                                                                    ? elem?.PipingMaterialSpecification?.name 
                                                                    : (typeof elem?.piping_material_specification === 'object' 
                                                                        ? elem?.piping_material_specification?.name 
                                                                        : (elem?.piping_material_specification || "-"))}
                                                            </td>
                                                            <td>{elem?.shadeRalNo || elem?.final_coat_ral_no || "-"}</td>
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
                                                className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/stock-dispatch-note-management')}>Back</button>
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

export default ViewDispatch