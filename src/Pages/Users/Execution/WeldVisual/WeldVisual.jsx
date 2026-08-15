import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { getUserWeldVisual } from '../../../../Store/Store/Execution/getUserWeldVisual';
import Loader from '../../Include/Loader';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import FilterCollapse from '../../../../Components/Filter/FilterCollapse';
import StatusFilter from '../../../../Components/Filter/StatusFilter';
import { PRODUCTION } from '../../../../BaseUrl';
import WeldVisualModal from './WeldVisualModal/WeldVisualModal';
import { getMultiWeldVisual } from '../../../../Store/MutipleDrawing/MultiWeldVisual/getMultiWeldVisual';

const WeldVisual = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [status, setStatus] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        if (disable === true) {
            dispatch(getMultiWeldVisual({ status: '',page: currentPage, limit,search }));
            setDisable(false);
        }
        else{
            dispatch(getMultiWeldVisual({ status: '',page: currentPage, limit,search }));
           
        }
    }, [dispatch, disable, currentPage, limit, search]);

    const entity = useSelector((state) => state.getMultiWeldVisual?.user?.data?.items || []);
    const total = useSelector((state) => state.getMultiWeldVisual?.user?.data?.total) || 0;
    const page = useSelector((state) => state.getMultiWeldVisual?.user?.data?.page) || 1;
    const totalPages = useSelector((state) => state.getMultiWeldVisual?.user?.data?.totalPages) || 1;
    console.log('entity', entity);

    // const commentsData = useMemo(() => {
    //     // let computedComments = entity;
    //        let computedComments = Array.isArray(entity) ? [...entity] : [];
    //     if (search) {
    //         computedComments = computedComments.filter((i) => {
    //             const uniqueAssemblyNos = [
    //                 ...new Set(i?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no).filter(Boolean))
    //             ].join(", ");
    //             const uniqueDrawingNo = [
    //                 ...new Set(i?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no).filter(Boolean))
    //             ];
    //             return [uniqueAssemblyNos, uniqueDrawingNo]
    //                 .some(field => field?.toString()?.toLowerCase()?.includes(search?.toLowerCase()));
    //         });
    //     }
    //     if (status) {
    //         computedComments = computedComments.filter(fit => fit.status === parseInt(status));
    //     }
    //     setTotalItems(computedComments?.length);
    //     return computedComments;
    // }, [currentPage, search, limit, entity, status]);
const commentsData = useMemo(() => {
    let computedComments = Array.isArray(entity) ? [...entity] : [];

    // if (search) {
    //     computedComments = computedComments.filter((i) => {
    //         const uniqueAssemblyNos = [
    //             ...new Set(i?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no).filter(Boolean))
    //         ].join(", ");
    //         const uniqueDrawingNo = [
    //             ...new Set(i?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no).filter(Boolean))
    //         ];
    //         return [uniqueAssemblyNos, uniqueDrawingNo]
    //             .some(field => field?.toString()?.toLowerCase()?.includes(search?.toLowerCase()));
    //     });
    // }

    if (status) {
        computedComments = computedComments.filter(fit => fit.status === parseInt(status));
    }

    return computedComments;
}, [search, entity, status]);

// 👇 useEffect just to update totalItems after filtering
useEffect(() => {
    setTotalItems(commentsData.length);
}, [commentsData]);



    // const statusCounts = StatusFilter({ entity });
    const statusCounts = StatusFilter({ entity: Array.isArray(entity) ? entity : [] });


    const handleDownloadOffer = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no', elem.report_no)
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'multi-weldvisual-download', body: bodyFormData });
    }

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'multi-weldvisual-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
        setStatus("");
    }

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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Weld Visual List</li>
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
                                                        <h3>Weld Visual List</h3>
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
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                {localStorage.getItem('ERP_ROLE') === `${PRODUCTION}` && (
                                                                    <Link to="/user/project-store/manage-weld-visual"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                                                )}
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                                <button className="btn btn-primary  doctor-refresh ms-2" type="button" onClick={() => setShowFilter(!showFilter)}
                                                                    aria-controls="collapseExample"
                                                                    aria-expanded={showFilter}>
                                                                    <i className="fa-solid fa-filter"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                                        <DropDown limit={limit} onLimitChange={(val) => {
    setlimit(val);
    setCurrentPage(1);
}} />

                                                </div>
                                            </div>
                                        </div>

                                        <FilterCollapse
                                            show={showFilter}
                                            status={status}
                                            setStatus={setStatus}
                                            statusCounts={statusCounts}
                                        />

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        {/* <th>Drawing No.</th> */}
                                                        <th>Unit/Area</th>
                                                        <th>Assem. No.</th>
                                                        <th>Ins. Report No.</th>
                                                        <th>Offer By.</th>
                                                        <th>Ins. By</th>
                                                        <th>Date</th>
                                                        <th>Ins. Date</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => {

                                                        const uniqueDrawingNo = [
                                                            ...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no).filter(Boolean))
                                                        ];
                                                        const uniqueAssemblyNos = [
                                                            ...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no).filter(Boolean))
                                                        ];

                                                        const uniqueUnit = [
                                                            ...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.unit).filter(Boolean))
                                                        ];

                                                        return (
                                                            <tr key={elem?._id}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.report_no}</td>
                                                                {/* <td>{uniqueDrawingNo.join(", ")}</td> */}
                                                                <td>{uniqueUnit.join(", ")}</td>
                                                                <td>{uniqueAssemblyNos.join(", ")}</td>
                                                                <td>{elem?.report_no_two || '-'}</td>
                                                                <td>{elem?.offered_by?.user_name}</td>
                                                                <td>{elem?.qc_name?.user_name || '-'}</td>
                                                                <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                                <td>{elem?.qc_time ? moment(elem?.qc_time).format('YYYY-MM-DD HH:mm') : '-'}</td>
                                                                <td className='status-badge'>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem.status === 2 ? (
                                                                        <span className="custom-badge status-green">Accepted</span>
                                                                    ) : elem.status === 3 ? (
                                                                        <span className="custom-badge status-pink">Rejected</span>
                                                                    ) : null}
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-weld-visual', { state: elem })}><i
                                                                                className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                                Edit</button>
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>
                                                                            {elem?.report_no_two && (
                                                                                <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                                    <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}

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
                                                {/* <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div> */}
                                                    <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">
                                Showing {entity.length} from {total} data
</div>

                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    {/* <Pagination
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        onPageChange={(page) => setCurrentPage(page)}
                                        
                                                    /> */}


                                                    <Pagination
    total={total}
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
                <Footer />
            </div>
        </div>
    )
}

export default WeldVisual;