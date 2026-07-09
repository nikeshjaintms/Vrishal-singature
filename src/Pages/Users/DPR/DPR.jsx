import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDpr } from '../../../Store/Erp/Dpr/Dpr';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import Loader from '../Include/Loader';
import moment from 'moment';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
 const useDebounce = (value, delay = 1200) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const DPR = () => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
   
    const debouncedSearch = useDebounce(search, 1200);
    // useEffect(() => {
    //     if (disable === true) {
    //         dispatch(getDpr({page:currentPage,limit}));
    //         setDisable(false);
    //     }
      
    // }, [dispatch, disable, currentPage,limit]);

    useEffect(() => {
    // if (disable === true) {
        setIsLoading(true);
        dispatch(getDpr({ page: currentPage, limit, search:debouncedSearch }))
            .finally(() => {
                setDisable(false);
                setIsLoading(false);
            });
    // }
}, [dispatch, disable, currentPage, limit, debouncedSearch]);


    const entity = useSelector((state) => state?.getDpr?.user?.data?.data);
    const pagination = useSelector((state) => state?.getDpr?.user?.data?.pagination);
    console.log("pagination",pagination);
    console.log("entity",entity);

    const commentsData = useMemo(() => {
        // let computedComments = [...(entity || [])];
        let computedComments = Array.isArray(entity) ? [...entity] : [];

        computedComments.sort((a, b) => (a.drawing_no || "").localeCompare(b.drawing_no || ""));

        computedComments = computedComments.map((elem) => ({
            ...elem,
            issue_requests: [...(elem.issue_requests || [])].sort((a, b) => (a.issue_req_no || "").localeCompare(b.issue_req_no || "")),
            issue_acceptance: [...(elem.issue_acceptance || [])].sort((a, b) => (a.issue_accept_no || "").localeCompare(b.issue_accept_no || "")),
            fitupOffer: [...(elem.fitupOffer || [])].sort((a, b) => (a.report_no || "").localeCompare(b.report_no || "")),
            fitupAcceptance: [...(elem.fitupAcceptance || [])].sort((a, b) => (a.report_no_two || "").localeCompare(b.report_no_two || "")),
            weldVisualOffer: [...(elem.weldVisualOffer || [])].sort((a, b) => (a.report_no || "").localeCompare(b.report_no || "")),
            weldVisualAcceptance: [...(elem.weldVisualAcceptance || [])].sort((a, b) => (a.report_no_two || "").localeCompare(b.report_no_two || "")),

            discrepancyNote: [...(elem.discrepancyNote || [])].sort((a, b) => (a.report_no || "").localeCompare(b.report_no || "")),

            surfaceOffer: [...(elem.surfaceOffer || [])].sort((a, b) => (a.report_no || "").localeCompare(b.report_no || "")),
            surfaceAcceptance: [...(elem.surfaceAcceptance || [])].sort((a, b) => (a.report_no_two || "").localeCompare(b.report_no_two || "")),

            mioOffer: [...(elem.mioOffer || [])].sort((a, b) => (a.report_no || "").localeCompare(b.report_no || "")),
            mioAcceptance: [...(elem.mioAcceptance || [])].sort((a, b) => (a.report_no_two || "").localeCompare(b.report_no_two || "")),

            finalCoatOffer: [...(elem.finalCoatOffer || [])].sort((a, b) => (a.report_no || "").localeCompare(b.report_no || "")),
            finalCoatAcceptance: [...(elem.finalCoatAcceptance || [])].sort((a, b) => (a.report_no_two || "").localeCompare(b.report_no_two || "")),

        }));


        setTotalItems(computedComments.length);
        const grouped = computedComments.reduce((acc, item) => {
            const key = `${item.drawing_no}-${item.unit}-${item.assembly_no}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        Object.values(grouped).forEach(group => {
            const maxRev = Math.max(...group.map(item => item.rev));
            group.forEach(item => {
                item.isMain = item.rev === maxRev;
            });
        });

        const flattenedData = Object.values(grouped).flat();

        return flattenedData;
    }, [currentPage, entity, limit]);

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const handlePdfDownload = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        PdfDownloadErp({ apiMethod: 'post', url: 'download-grid-xlsx-dpr', body: bodyFormData });
    }

    const columnHeaders = [
        "SR.", "DRAW NO.", "REV", "ASSEM. NO.", "ASSEM. QTY.", "UNIT/AREA", "DR.ISS. NAME", "DR.ISS. DT.",
        "GRID NO.", "GRID QTY.", "UNIT WEIGHT(KG)", "TOTAL WEIGHT(KG)", "UNIT ASM(SQM)", "TOTAL ASM(SQM)", "ISS. REQ.", "ISS. ACC.", "FITUP OFF.", "Fitup Acc.", "Weld Off.", "Weld Acc.",
        "NDT ACC.", "FD OFF.", "FD ACC.", "INS. SUMMARY", "DIS. NOTE", "SURFACE OFF.", "SURFACE ACC.", "MIO OFF.", "MIO ACC.",
        "FINAL COAT OFF.", "FINAL COAT ACC.", "RELEASE NOTE"
    ];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">DPR List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {isLoading ? <Loader /> : (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>DPR List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    {/* <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} /> */}

                                                                         <input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    // setDisable(true); 
  }}
/>
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
                                                    <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={handlePdfDownload}>Download DPR <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div>
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
                                            <table className="table border-0 comman-table mb-0 dpr-table">
                                                <thead>
                                                    <tr>
                                                        {columnHeaders.map((header, idx) => <th key={idx}>{header}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => {

                                                        const gridStatsMap = elem.grid_items?.reduce((acc, item) => {
                                                            const gridId = item.grid_id;
                                                            if (!acc[gridId]) {
                                                                acc[gridId] = {
                                                                    totalAssemblyWeight: 0,
                                                                    totalAssemblySurfaceArea: 0,
                                                                };
                                                            }
                                                            acc[gridId].totalAssemblyWeight += item.assembly_weight || 0; // Sum of assembly weights
                                                            acc[gridId].totalAssemblySurfaceArea += item.assembly_surface_area || 0; // Sum of assembly surface areas
                                                            return acc;
                                                        }, {});

                                                        const maxRows = Math.max(
                                                            elem?.grid_data?.length || 0,
                                                            elem.issue_requests?.length || 0,
                                                            elem.issue_acceptance?.length || 0,
                                                            elem.fitupOffer?.length || 0,
                                                            elem.fitupAcceptance?.length || 0,
                                                            elem.weldVisualOffer?.length || 0,
                                                            elem.weldVisualAcceptance?.length || 0,
                                                            elem.ndt_details?.length || 0,
                                                            elem.fdOffer?.length || 0,
                                                            elem.fdAcceptance?.length || 0,
                                                            elem.insSummary?.length || 0,
                                                            elem.dispatch_note?.length || 0,
                                                            elem.surfaceOffer?.length || 0,
                                                            elem.surfaceAcceptance?.length || 0,
                                                            elem.mioOffer?.length || 0,
                                                            elem.mioAcceptance?.length || 0,
                                                            elem.finalCoatOffer?.length || 0,
                                                            elem.finalCoatAcceptance?.length || 0,
                                                            elem.release_note?.length || 0,
                                                            1
                                                        );

                                                        return Array.from({ length: maxRows }).map((_, rowIndex) => {

                                                            const gridId = elem?.grid_data?.[rowIndex]?._id;
                                                            const gridNo = elem?.grid_data?.[rowIndex]?.grid_no || "-";
                                                            const gridQty = elem?.grid_data?.[rowIndex]?.grid_qty || 0; // Ensure it's a number
                                                            const totalAssemblyWeight = gridId ? gridStatsMap?.[gridId]?.totalAssemblyWeight || 0 : 0;
                                                            const totalAssemblySurfaceArea = gridId ? gridStatsMap?.[gridId]?.totalAssemblySurfaceArea || 0 : 0;

                                                            // Calculating total and unit values
                                                            const totalWeight = totalAssemblyWeight * gridQty;
                                                            const unitWeight = gridQty > 0 ? (totalWeight / gridQty).toFixed(2) : "-";

                                                            const totalSurfaceArea = totalAssemblySurfaceArea * gridQty;
                                                            const unitSurfaceArea = gridQty > 0 ? (totalSurfaceArea / gridQty).toFixed(2) : "-";


                                                            return (
                                                                <tr key={`${i}-${rowIndex}`} className={!elem.isMain ? 'table-row-red' : ''}>
                                                                    {rowIndex === 0 && (
                                                                        <>
                                                                            <td rowSpan={maxRows}>{(currentPage - 1) * limit + i + 1}</td>
                                                                            <td rowSpan={maxRows}>{elem.drawing_no}</td>
                                                                            <td rowSpan={maxRows}>{elem.rev}</td>
                                                                            <td rowSpan={maxRows}>{elem.assembly_no}</td>
                                                                            <td rowSpan={maxRows}>{elem.assembly_quantity}</td>
                                                                            <td rowSpan={maxRows}>{elem?.unit || '-'}</td>
                                                                            <td rowSpan={maxRows}>{elem?.issued_name}</td>
                                                                            <td rowSpan={maxRows}>{elem?.issued_date ? moment(elem?.issued_date).format('YYYY-MM-DD') : "-"}</td>
                                                                        </>
                                                                    )}
                                                                    {/* <td>
                                                                        {elem?.grid_data?.[rowIndex]?.grid_no || "-"}
                                                                    </td>
                                                                    <td>
                                                                        {elem?.grid_data?.[rowIndex]?.grid_qty || "-"}
                                                                    </td> */}
                                                                    <td>{gridNo}</td>
                                                                    <td>{gridQty}</td>
                                                                    <td>{unitWeight}</td>
                                                                    <td>{totalWeight}</td>
                                                                    <td>{unitSurfaceArea}</td>
                                                                    <td>{totalSurfaceArea}</td>
                                                                    <td>{elem.issue_requests?.[rowIndex]?.createdAt ? moment(elem.issue_requests?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : '-'} ({`${elem.issue_requests?.[rowIndex]?.grid_no || '-'}-${elem.issue_requests?.[rowIndex]?.used_grid_qty || '-'}`})</td>
                                                                    <td className={elem.issue_acceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.issue_acceptance?.[rowIndex]?.createdAt ? moment(elem.issue_acceptance?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : '-'}
                                                                        ({`${elem.issue_acceptance?.[rowIndex]?.grid_no || '-'}-${elem.issue_acceptance?.[rowIndex]?.used_grid_qty || "-"}`});
                                                                    </td>
                                                                    <td>{elem.fitupOffer?.[rowIndex]?.createdAt ? moment(elem.fitupOffer?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.fitupOffer?.[rowIndex]?.grid_no || "-"}-${elem.fitupOffer?.[rowIndex]?.fitOff_used_grid_qty || "-"}`})</td>
                                                                    <td className={elem.fitupAcceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.fitupAcceptance?.[rowIndex]?.qc_date ? moment(elem.fitupAcceptance?.[rowIndex]?.qc_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.fitupAcceptance?.[rowIndex]?.grid_no || "-"}-${elem.fitupAcceptance?.[rowIndex]?.fitOff_used_grid_qty || "-"}`})
                                                                    </td>

                                                                    <td>{elem.weldVisualOffer?.[rowIndex]?.createdAt ? moment(elem.weldVisualOffer?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.weldVisualOffer?.[rowIndex]?.grid_no || "-"}-${elem.weldVisualOffer?.[rowIndex]?.weld_used_grid_qty || "-"}`})</td>
                                                                    <td className={elem.weldVisualAcceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.weldVisualAcceptance?.[rowIndex]?.qc_date ? moment(elem.weldVisualAcceptance?.[rowIndex]?.qc_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.weldVisualAcceptance?.[rowIndex]?.grid_no || "-"}-${elem.weldVisualAcceptance?.[rowIndex]?.weld_used_grid_qty || "-"}`})
                                                                    </td>

                                                                    <td>
                                                                        {elem?.ndt_details?.[rowIndex]?.status === 3 ?
                                                                            <>
                                                                                {elem?.ndt_details?.[rowIndex]?.createdAt ? moment(elem?.ndt_details?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.ndt_details?.[rowIndex]?.grid_no || "-"}-${elem.ndt_details?.[rowIndex]?.ndt_used_grid_qty || "-"}`})
                                                                            </>
                                                                            : "-"}
                                                                    </td>

                                                                    <td>{elem.fdOffer?.[rowIndex]?.createdAt ? moment(elem.fdOffer?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.fdOffer?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.fdOffer?.[rowIndex]?.fd_used_grid_qty || '-'}`})</td>
                                                                    <td className={elem.fdAcceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.fdAcceptance?.[rowIndex]?.qc_date ? moment(elem.fdAcceptance?.[rowIndex]?.qc_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.fdAcceptance?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.fdAcceptance?.[rowIndex]?.fd_used_grid_qty || '-'}`})
                                                                    </td>

                                                                    <td>{elem.insSummary?.[rowIndex]?.summary_date ? moment(elem.insSummary?.[rowIndex]?.summary_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.insSummary?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.insSummary?.[rowIndex]?.is_grid_qty || '-'}`})</td>

                                                                    <td>{elem.dispatch_note?.[rowIndex]?.createdAt ? moment(elem.dispatch_note?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.dispatch_note?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.dispatch_note?.[rowIndex]?.dispatch_used_grid_qty || '-'}`})</td>



                                                                    <td>{elem.surfaceOffer?.[rowIndex]?.createdAt ? moment(elem.surfaceOffer?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"}  ({`${elem.surfaceOffer?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.surfaceOffer?.[rowIndex]?.surface_used_grid_qty || '-'}`})</td>
                                                                    <td className={elem.surfaceAcceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.surfaceAcceptance?.[rowIndex]?.qc_date ? moment(elem.surfaceAcceptance?.[rowIndex]?.qc_date).format('YYYY-MM-DD HH:mm') : "-"}  ({`${elem.surfaceAcceptance?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.surfaceAcceptance?.[rowIndex]?.surface_used_grid_qty || '-'}`})
                                                                    </td>
                                                                    <td>{elem.mioOffer?.[rowIndex]?.createdAt ? moment(elem.mioOffer?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"}  ({`${elem.mioOffer?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.mioOffer?.[rowIndex]?.mio_used_grid_qty || '-'}`})</td>
                                                                    <td className={elem.mioAcceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.mioAcceptance?.[rowIndex]?.qc_date ? moment(elem.mioAcceptance?.[rowIndex]?.qc_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.mioAcceptance?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.mioAcceptance?.[rowIndex]?.mio_used_grid_qty || '-'}`})
                                                                    </td>
                                                                    <td>{elem.finalCoatOffer?.[rowIndex]?.createdAt ? moment(elem.finalCoatOffer?.[rowIndex]?.createdAt).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.finalCoatOffer?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.finalCoatOffer?.[rowIndex]?.fc_used_grid_qty || '-'}`})</td>
                                                                    <td className={elem.finalCoatAcceptance?.[rowIndex]?.is_accepted === false ? "text-danger" : ""}>
                                                                        {elem.finalCoatAcceptance?.[rowIndex]?.qc_date ? moment(elem.finalCoatAcceptance?.[rowIndex]?.qc_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.finalCoatAcceptance?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.finalCoatAcceptance?.[rowIndex]?.fc_used_grid_qty || '-'}`})
                                                                    </td>

                                                                    <td>{elem.release_note?.[rowIndex]?.release_date ? moment(elem.release_note?.[rowIndex]?.release_date).format('YYYY-MM-DD HH:mm') : "-"} ({`${elem.release_note?.[rowIndex]?.grid_id?.grid_no || '-'}-${elem.release_note?.[rowIndex]?.is_grid_qty || '-'}`})</td>

                                                                </tr>
                                                            )

                                                        });
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
                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(pagination?.page * pagination?.limit, pagination?.total)} from {pagination?.total} data</div>
                                       
                                       


                                           </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    {/* <Pagination
                                                        total={totalItems}
                                                        itemsPerPage={limit}
                                                        currentPage={currentPage}
                                                        // onPageChange={(page) => setCurrentPage(page)}
                                                          onPageChange={(page) => {
                                                            setCurrentPage(page);
                                                          setDisable(true); // refetch from backend
                                                                    }}
                                                    /> */}
                                                    <Pagination
  total={pagination?.total || 0}
  itemsPerPage={pagination?.limit || limit}
  currentPage={pagination?.page || currentPage}
  onPageChange={(page) => {
    setCurrentPage(page);
    setDisable(true); // refetch from backend
  }}
/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) }

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default DPR