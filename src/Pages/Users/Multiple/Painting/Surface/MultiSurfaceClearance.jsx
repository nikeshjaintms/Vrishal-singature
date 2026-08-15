import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import { Pagination, Search } from '../../../Table';
import { QC } from '../../../../../BaseUrl';
import DropDown from '../../../../../Components/DropDown';
import moment from 'moment';
import Loader from '../../../Include/Loader';
import Footer from '../../../Include/Footer';
import { getMultiSurfaceOffer } from '../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaseOffer';
import { getMultiSurfaceOfferViewPage } from '../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaceOfferViewPage';
import { getSurfaceClearance } from '../../../../../Store/MutipleDrawing/MultiSurface/GetSurfaceClearance';
import { BadgeCheck, X } from 'lucide-react';

const MultiSurfaceClearance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [disable, setDisable] = useState(true);
    const [limit, setlimit] = useState(10);

    const [search1, setSearch1] = useState("");
    const [totalItems1, setTotalItems1] = useState(0);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [disable1, setDisable1] = useState(true);
    const [limit1, setlimit1] = useState(10);

    useEffect(() => {
        if (disable === true ) {
            // dispatch(getMultiSurfaceOffer({search}));
            dispatch(getMultiSurfaceOfferViewPage({search}));

            setDisable(false);
           
        }
    }, [disable,search]);

    
     useEffect(() => {
        if (disable1 === true ) {
            dispatch(getSurfaceClearance({page:currentPage1,limit:limit1,search: search1}));
            setDisable1(false);
        }
    }, [ disable1, currentPage1, limit1,search1]);

    // const entity = useSelector((state) => state.getMultiSurfaceOffer?.user?.data?.data);
    const entity = useSelector((state) => state.getMultiSurfaceOfferViewPage?.user?.data?.data);

  //  const pagination= useSelector((state) => state.getMultiSurfaceOffer?.user?.data?.pagination);
     const entity1 = useSelector((state) => state.getSurfaceClearance?.user?.data?.data);
      const pagination1= useSelector((state) => state.getSurfaceClearance?.user?.data?.pagination);
     console.log("entity1", entity1);

    const offerList = useMemo(() => {
        let computedComments = entity;
        computedComments = computedComments?.filter((fi) => fi?.status === 1);
        if (search) {
            computedComments = computedComments.filter(
                (fit) =>
                    fit?.items?.some((e) => e?.drawing_no?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.assembly_no?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.dispatch_report?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.items?.some((e) => e?.dispatch_site?.toLowerCase().includes(search.toLowerCase())) ||
                    fit?.procedure_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    fit?.paint_system_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    fit?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

//     useEffect(() => {
//     if (pagination?.total) {
//         setTotalItems(pagination.total);
//     }
// }, [pagination]);
    // const clearanceList = useMemo(() => {
    //     let computedComments = entity1;
    //     computedComments = computedComments?.filter((fi) => fi?.status !== 1);
    //     // if (search1) {
    //     //     computedComments = computedComments.filter(
    //     //         (fit) =>
    //     //             fit?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //     //             fit?.paint_system_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //     //             fit?.qc_name?.toLowerCase()?.includes(search?.toLowerCase())
    //     //     );
    //     // }
    //     // setTotalItems1(computedComments?.length);
    //     return computedComments;
    //     // ?.slice(
    //     //     (currentPage1 - 1) * limit1,
    //     //     (currentPage1 - 1) * limit1 + limit1
    //     // );
    // }, [currentPage1, search1, limit1, entity1]);
const clearanceList = useMemo(() => {
  return entity1 || [];
}, [entity1]);

    useEffect(() => {
    if (pagination1?.total) {
        setTotalItems1(pagination1.total);
    }
}, [pagination1]);

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two)
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-surface', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
    }
    const handleRefresh1 = () => {
        setDisable1(true);
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
                                    <li className="breadcrumb-item active">Surface Acceptance</li>
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
                                                        <h3>Surface & Primer Offering List</h3>
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
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                                    <DropDown limit={limit} onLimitChange={(val) => {
    setlimit(val);
    setCurrentPage(1);
    setDisable(true);
}} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Offer No.</th>
                                                        <th>Drawing No.</th>
                                                        <th>Assem. No.</th>
                                                        <th>Dispatch No.</th>
                                                        <th>Dispatch Site</th>
                                                        <th>Procedure No.</th>
                                                        <th>Paint System No.</th>
                                                        <th>Offered By</th>
                                                        <th>Date</th>
                                                        {localStorage.getItem('ERP_ROLE') === QC && (
                                                            <th>Verify</th>)}
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {offerList?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.report_no}</td>
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
                                                            <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.dispatch_report)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                            <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.dispatch_site)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                            <td>{elem?.procedure_no}</td>
                                                            <td>{elem?.paint_system_no}</td>
                                                            <td>{elem?.offer_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            {localStorage.getItem('ERP_ROLE') === QC && (
                                                                <td>
                                                                    {elem?.status === 1 ? (
                                                                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/user/project-store/manage-surface-clearance', { state: elem })}>
                                                                            <BadgeCheck />
                                                                        </span>
                                                                    ) : <X />}
                                                                </td>
                                                            )}

                                                            <td>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {offerList?.length === 0 ? (
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
                                                        // onPageChange={(page) => setCurrentPage(page)}
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

                    {disable1 === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Surface & Primer Clearance List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    {/* <Search
                                                                        onSearch={(value) => {
                                                                            setSearch1(value);
                                                                            setCurrentPage(1);   
                                                                        }} /> */}
<input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search1}
  onChange={(e) => {
    setSearch1(e.target.value);
    setCurrentPage1(1);
    setDisable1(true); // Trigger API
  }}
/>



                                                                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
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
                                                    {/* <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} />
                                                     */}
                                                     <DropDown limit={limit1} onLimitChange={(val) => {
    setlimit1(val);
    setCurrentPage1(1);
    setDisable1(true);
}} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No.</th>
                                                        {/* <th>Offer No.</th> */}
                                                        <th>Paint System No.</th>
                                                        <th>QC By</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {clearanceList?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
                                                            <td>{elem?.report_no_two}</td>
                                                            {/* <td>{elem?.report_no}</td> */}
                                                            <td>{elem?.paint_system_no}</td>
                                                            <td>{elem?.qc_name}</td>
                                                            <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td className='status-badge'>
                                                                {elem.status === 2 ? (
                                                                    <span className="custom-badge status-purple">Partially</span>
                                                                ) : elem.status === 3 ? (
                                                                    <span className="custom-badge status-green">Accepted</span>
                                                                ) : elem.status === 4 ? (
                                                                    <span className="custom-badge status-pink">Rejected</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-surface-clearance', { state: elem })}>
                                                                            <i className="fa-solid fa-eye m-r-5"></i> View</button>
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadIns(elem)} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download PDF</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    {clearanceList?.length === 0 ? (
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
                                                    aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems1}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        // onPageChange={(page) => setCurrentPage1(page)}
                                                          onPageChange={(page) => {
        setCurrentPage1(page);
        setDisable1(true);
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
        </div >
    )
}

export default MultiSurfaceClearance