import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Pagination, Search } from '../../Table';
import { PLAN } from '../../../../BaseUrl';
import Footer from '../../Include/Footer';
import { getMultiPackingList } from '../../../../Store/MutipleDrawing/MultiPacking/GetMultiPackingList';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import DropDown from '../../../../Components/DropDown';
import Loader from '../../Include/Loader';

const MultiPacking = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (disable === true) {
    //             try {
    //                 await dispatch(getMultiPackingList({page:currentPage,limit}));
    //                 setDisable(false);
    //             } catch (error) {
    //                 setDisable(false);
    //             }
    //         }
    //         else{
    //             try {
    //                 await dispatch(getMultiPackingList({page:currentPage,limit}));
    //                 setDisable(false);
    //             } catch (error) {
    //                 setDisable(false);
    //             } 
    //         }
            
    //     }
    //     fetchData();
    // }, [dispatch, disable]);

    useEffect(() => {
    const fetchData = async () => {
        setDisable(true); // Start loading
        try {
            await dispatch(getMultiPackingList({ page: currentPage, limit , search}));
        } catch (error) {
            console.error("Failed to fetch packing list:", error);
        } finally {
            setDisable(false); // Stop loading
        }
    };
    fetchData();
}, [dispatch, currentPage, limit, search]);

    const entity = useSelector((state) => state?.getMultiPackingList?.user?.data?.data);
 const pagination = useSelector((state) => state?.getMultiPackingList?.user?.data?.pagination);
 console.log(pagination, "pagination");
    const commentsData = useMemo(() => {
        // let computedComments = entity || [];

          let computedComments = Array.isArray(entity) ? [...entity] : [];
        // if (search) {
        //     computedComments = computedComments.filter(
        //         (it) =>
        //             it.voucher_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             it.consignment_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             it?.items?.some(item => item?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase())) ||
        //             it?.items?.some(item => item?.assembly_no?.toLowerCase()?.includes(search?.toLowerCase()))
        //     );
        // }

        
        // setTotalItems(computedComments?.length);
        return computedComments;
    }, [currentPage, search, limit, entity]);


useEffect(() => {
  if (pagination?.totalCount) {
    setTotalItems(pagination.totalCount);
  }
}, [pagination]);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const handleDownloadIns = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('voucher_no', elem?.voucher_no);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-multi-packing', body: bodyFormData });
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
                                    <li className="breadcrumb-item active">Packing List</li>
                                </ul>
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
                                                        <h3>Packing List</h3>
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
                                                                {
                                                                    localStorage.getItem("ERP_ROLE") === PLAN ? <Link to="/user/project-store/manage-packing"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link> : ""
                                                                }
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
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                  
                                        <div className="table-responsive">
                                            {disable === false ? ( 
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Report No</th>
                                                        <th>Consignment No</th>
                                                        <th>Unit/Area</th>
                                                        {/* <th>Drawing No</th> */}
                                                        <th>Assem No</th>
                                                        <th>Packed By</th>
                                                        <th>Date</th>
                                                        {/* <th>Status</th> */}
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem?.voucher_no}</td>
                                                            <td>{elem?.consignment_no}</td>
                                                            {/* <td>
                                                                {elem?.items
                                                                    ?.map(e => e?.drawing_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td> */}
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
                                                            <td>{elem?.packed_by_name}</td>
                                                            <td >{moment(elem?.createdAt).format('YYYY-MM-DD  HH:mm')}</td>
                                                            <td className="text-end">
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/view-packing', { state: { elem: elem } })}><i className="fa-solid fa-eye m-r-5"></i>
                                                                            View</button>
                                                                        <button type='button' className="dropdown-item"
                                                                            onClick={() => handleDownloadIns(elem)}
                                                                        >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
                                                                    </div>

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {commentsData?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={8}>
                                                                <div className="no-table-data">
                                                                    No Data Found!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null}

                                                </tbody>
                                            </table>
                                            ) :<>
                                            <Loader />
                                            </> 
                                        }
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
    setDisable(true); // This ensures API is called with new page
  }}
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
        </div >
    )
}

export default MultiPacking