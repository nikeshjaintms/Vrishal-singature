import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../../Include/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../Include/Loader'
import { Pagination, Search } from '../../Table'
import DropDown from '../../../../Components/DropDown'
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp'
import { QC } from '../../../../BaseUrl'
import { getUserMultiNdtMaster } from '../../../../Store/MutipleDrawing/MultiNDT/getUserMultiNdtMaster'
import moment from 'moment'
import StatusBadge from '../../Components/StatusBadge'

const Ndt = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        const fetchData = () => {
            if (disable === true) {
                dispatch(getUserMultiNdtMaster({ status: '' , currentPage,limit,search}));
                setDisable(false);
            }
        }
        fetchData();
    }, [dispatch, disable, currentPage,limit,search]);

    const entity = useSelector((state) => state?.getUserMultiNdtMaster?.user?.data?.data);
    const pagination = useSelector((state) => state?.getUserMultiNdtMaster?.user?.data?.pagination);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        
        // setTotalItems(computedComments?.length);
        return computedComments;
       
    }, [currentPage, limit, entity]);

    useEffect(() => {
    if (pagination?.total) {
        setTotalItems(pagination.total);
    }
}, [pagination]);


    const handleDownload = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('report_no', elem.report_no);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'multi-ndt-master-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
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
                                    <li className="breadcrumb-item active">NDT Master List</li>
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
                                                        <h3>NDT Master List</h3>
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
    setDisable(true); // ✅ Trigger API
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
                                                        <th>Report No.</th>
                                                        {/* <th>Drawing No.</th> */}
                                                        <th>Unit/Area</th>
                                                        <th>Assem. No.</th>
                                                        {/* <th>Assem. Qty.</th> */}
                                                        <th>Offer By.</th>
                                                        <th>Date</th>
                                                        <th>UT</th>
                                                        <th>RT</th>
                                                        <th>MPT</th>
                                                        <th>LPT</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {commentsData?.map((elem, i) => {
                                                        const uniqueAssemblyNos = [
                                                            ...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no).filter(Boolean))
                                                        ];
                                                        const uniqueAssemblyQty = [
                                                            ...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_quantity).filter(Boolean))
                                                        ];
                                                        const uniqueDrawingNo = [
                                                            ...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no).filter(Boolean))
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
                                                                {/* <td>{uniqueAssemblyQty.join(", ")}</td> */}
                                                                <td>{elem?.offered_by?.user_name}</td>
                                                                <td>{moment(elem?.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                                                                <td><StatusBadge status={elem.ut_status} /></td>
                                                                <td><StatusBadge status={elem.rt_status} /></td>
                                                                <td><StatusBadge status={elem.mpt_status} /></td>
                                                                <td><StatusBadge status={elem.lpt_status} /></td>
                                                                <td className='status-badge'>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem.status === 3 ? (
                                                                        <span className="custom-badge status-green">Accepted</span>
                                                                    ) : null}
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDownload(elem)} >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download PDF
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
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

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Ndt