import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import Footer from '../../../Include/Footer';
import { Pagination, Search } from '../../../Table';
import Loader from '../../../Include/Loader';
import moment from 'moment';
import DropDown from '../../../../../Components/DropDown';
import { BadgeCheck, X } from 'lucide-react';
import { QC } from '../../../../../BaseUrl';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { getMultiRtClearance } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/getMultiRtClearance';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { getLptNdtInspectionPiping } from '../../../../../Store/Piping/Ndt/LPTNDT/getLptNdtInspectionPiping';
const useDebounce = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }

      
      const useDebounce1 = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const MultiLPTClearance = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    const [totalItems1, setTotalItems1] = useState(0);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
    const [disable1, setDisable1] = useState(true);
 const debouncedSearch = useDebounce(search, 600);
   const debouncedSearch1 = useDebounce1(search1, 600);
        useEffect(() => {
  dispatch(
    getLptNdtInspectionPiping({
      page: currentPage,
      limit,
      search:debouncedSearch,
      status: "1",
    })
  );
}, [dispatch, currentPage, limit,debouncedSearch]);

useEffect(() => {
  dispatch(
    getLptNdtInspectionPiping({
      page: currentPage1,
      limit: limit1,
      search: debouncedSearch1,
      status: "2,3,4",
    })
  );
}, [dispatch, currentPage1, limit1, debouncedSearch1]);

useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch]);

useEffect(() => {
  setCurrentPage1(1);
}, [debouncedSearch1]);

const offeringData = useSelector(
  (state) => state.getLptNdtInspectionPiping.dataByStatus["1"]?.data
);

const offeringPagination = useSelector(
  (state) => state.getLptNdtInspectionPiping.dataByStatus["1"]?.pagination
);

const clearanceData = useSelector(
  (state) => state.getLptNdtInspectionPiping.dataByStatus["2,3,4"]?.data
);

const clearancePagination = useSelector(
  (state) => state.getLptNdtInspectionPiping.dataByStatus["2,3,4"]?.pagination
);


useEffect(() => {
  setTotalItems(offeringPagination?.totalItems || 0);
}, [offeringPagination]);

useEffect(() => {
  setTotalItems1(clearancePagination?.totalItems || 0);
}, [clearancePagination]);



 const handleRefresh = () => {
    setSearch('');
    setCurrentPage(1); // reset pagination
}

const handleRefresh1 = () => {
    setSearch1('');
    setCurrentPage1(1); // reset pagination
}


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no_two', elem.report_no_two);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-lpt-ndt-inspection-pdf-piping', body: bodyFormData });
    }
    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">

                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                            { name: " LPT List", link: "/piping/user/lpt-offer-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'}  LPT Offer`, active: true }
                        ]} />

                       
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card card-table show-entire">
                                        <div className="card-body">

                                            <div className="page-table-header mb-2">
                                                <div className="row align-items-center">
                                                    <div className="col">
                                                        <div className="doctor-table-blk">
                                                            <h3>LPT Offering List</h3>
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
                                                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table border-0 custom-table comman-table  mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Sr.</th>
                                                            <th>Off. Report No.</th>
                                                            <th>Line No. / Drawing No.</th>
                                                            <th>Spool No. </th>
                                                            <th>Off. By</th>
                                                            <th>Date</th>
                                                            <th>Verify</th>
                                                            <th>Status</th>                                     
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {offeringData?.map((elem, i) =>
                                                            <tr key={elem?._id}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.report_no}</td>
                                                                <td>{elem?.items
                                                                    ?.map(e => e?.drawing_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .map((value, index) => (
                                                                    <span key={index}>
                                                                        {value}
                                                                        <br />
                                                                    </span>
                                                                    )) || "-"}</td>
                                                                <td>{elem?.items
                                                                    ?.map(e => e?.spool_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .map((value, index) => (
                                                                    <span key={index}>
                                                                        {value}
                                                                        <br />
                                                                    </span>
                                                                    )) || "-"}</td>
                                                                <td>{elem?.offered_by_name}</td>
                                                                <td>{elem?.offer_date ? moment(elem?.offer_date).format('YYYY-MM-DD') : '-'}</td>
                                                                {localStorage.getItem('ERP_ROLE') === QC && (
                                                                    <td>
                                                                        {elem?.status === 1 ? (
                                                                            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/piping/user/manage-lpt-clearance', { state: elem })}>
                                                                                <BadgeCheck />
                                                                            </span>
                                                                        ) : <X />}
                                                                    </td>
                                                                )}
                                                                <td className='status-badge'>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem.status === 2 ? (
                                                                        <span className="custom-badge status-green">Accepted</span>
                                                                    ) : elem.status === 3 ? (
                                                                        <span className="custom-badge status-pink">Rejected</span>
                                                                    )  : elem.status === 4 ? (
                                                                        <span className="custom-badge status-purple">Partially</span>
                                                                    ) : null}
                                                                </td>
                                                            </tr>
                                                        )}


                                                        
                                                        {offeringData?.length === 0 ? (
                                                            <tr>
                                                                <td colspan="999">
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
                                                            onPageChange={(page) => setCurrentPage(page)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card card-table show-entire">
                                        <div className="card-body">

                                            <div className="page-table-header mb-2">
                                                <div className="row align-items-center">
                                                    <div className="col">
                                                        <div className="doctor-table-blk">
                                                            <h3>LPT Clearance List</h3>
                                                            <div className="doctor-search-blk">
                                                                <div className="top-nav-search table-search-blk">
                                                                    <form>
                                                                        <Search
                                                                            onSearch={(value) => {
                                                                                setSearch1(value);
                                                                                setCurrentPage1(1);
                                                                            }} />
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
                                                        <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table border-0 custom-table comman-table  mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Sr.</th>
                                                            <th>Report No.</th>
                                                            <th>Off. Report No.</th>
                                                            <th>Line No. / Drawing No.</th>
                                                            <th>Spool No. </th>
                                                            <th>Qc. By</th>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                            <th className='text-end'>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {clearanceData?.map((elem, i) =>
                                                            <tr key={elem?._id}>
                                                                <td>{(currentPage1 - 1) * limit1 + i + 1}</td>
                                                                <td>{elem?.report_no}</td>
                                                                <td>{elem?.report_no_two}</td>
                                                                <td>{elem?.items
                                                                    ?.map(e => e?.drawing_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .map((value, index) => (
                                                                    <span key={index}>
                                                                        {value}
                                                                        <br />
                                                                    </span>
                                                                    )) || "-"}</td>
                                                                <td>{elem?.items
                                                                    ?.map(e => e?.spool_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .map((value, index) => (
                                                                    <span key={index}>
                                                                        {value}
                                                                        <br />
                                                                    </span>
                                                                    )) || "-"}</td>
                                                                <td>{elem?.qc_name}</td>
                                                              <td>{elem.qc_time ? moment(elem.qc_time).format('DD-MM-YYYY') : '-'}</td>

                                                                <td className='status-badge'>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem.status === 2 ? (
                                                                        <span className="custom-badge status-green">Accepted</span>
                                                                    ) : elem.status ===3 ? (
                                                                        <span className="custom-badge status-pink">Rejected</span>
                                                                    ) : elem.status === 4? (
                                                                        <span className="custom-badge status-purple">Partially</span>
                                                                    ) : null}
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-lpt-clearance', { state: elem })}><i
                                                                                className="fa-solid fa-eye m-r-5"></i>
                                                                                View</button>
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)}>
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Inspection</button>

                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}

                                                        {clearanceData?.length === 0 ? (
                                                            <tr>
                                                                <td colspan="999">
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
                                                            onPageChange={(page) => setCurrentPage1(page)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                  

                    </div>
                    <Footer />
                </div>
            </div>
        </>
    )
}

export default MultiLPTClearance