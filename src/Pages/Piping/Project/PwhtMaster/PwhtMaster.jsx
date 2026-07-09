import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { getUserPwhtMaster } from '../../../../Store/Piping/PwhtMaster/PwhtMaster';
import Swal from 'sweetalert2';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PwhtAuth } from '../../../../Routes/Users/Auth/AuthGuard';

const useDebounce = (value, delay = 2000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;

}

const NdtMaster = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const debouncedSearch = useDebounce(search, 2000);

    // Redux selector
      const {
        data: pwhtData = [],
        total = 0,
        page: reduxPage = 1,
        pages = 1,
        loading,
        error
      } = useSelector(state => state.getUserPwhtMaster || {});
    
      // Sync redux page to local state
      useEffect(() => {
        setCurrentPage(reduxPage);
      }, [reduxPage]);
    
      // Fetch PWHT data
      const fetchData = () => {
        dispatch(getUserPwhtMaster({ page: currentPage, limit, search: debouncedSearch }));
      };
    
      useEffect(() => {
        fetchData();
      }, [currentPage, limit, debouncedSearch]);
    
      useEffect(() => {
        if (error) console.error("❌ Error fetching PWHT:", error);
      }, [pwhtData, total, error]);

    const handleDelete = (id, title) => {
        Swal.fire({
        title: `Are you sure you want to delete ${title}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`${V_URL}/user/delete-pwht/${id}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            })
            .then((res) => {
                if (res.data.success) {
                toast.success(res.data.message);
                fetchData();
                } else toast.error(res.data.message);
            })
            .catch((err) => {
                console.error("❌ Delete error:", err);
                toast.error(err?.response?.data?.message || "Something went wrong");
            });
        }
        });
    };

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">PWHT Master List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {loading ? <Loader /> : (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>PWHT Master List</h3>
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
                                                                <PwhtAuth>
                                                                    <Link to="/piping/user/manage-pwht-master"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus-icon" /></Link>
                                                                </PwhtAuth>
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
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>piping Class</th>
                                                        <th>Piping Material Specification</th>
                                                        <th>PWHT Type</th>
                                                        <th>Loading Temp.(Degree C / Hour)</th>
                                                        <th>Rate of Heating (Degree C / Hour)</th>
                                                        <th>Soaking Temp. (Degree C / Hour)</th>
                                                        <th>Soaking Period (Hour)</th>
                                                        <th>Rate of Cooling (Degree C / Hour)</th>
                                                        <th>Unloading Temp. (Degree C / Hour)</th>
                                                        <PwhtAuth>
                                                            <th className="text-end">Action</th>
                                                        </PwhtAuth>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pwhtData?.length > 0 ? pwhtData.map((elem, i) => (
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem.pipingClass?.PipingClass || '-'}</td>
                                                            <td>{elem.PipingMaterialSpecification?.name || '-'}</td>
                                                            <td>{elem.pwhtType || '-'}</td>
                                                            <td>{elem.LoadingTemp || '-'}</td>
                                                            <td>{elem.rateofHeating || '-'}</td>
                                                            <td>{elem.soakingTemp || '-'}</td>
                                                            <td>{elem.soakingPeriod || '-'}</td>
                                                            <td>{elem.rateofCooling || '-'}</td>
                                                            <td>{elem.unloadingTemp || '-'}</td>                                                            
                                                            <PwhtAuth>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a href="#" className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                                className="fa fa-ellipsis-v"></i></a>
                                                                                
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button type='button' className="dropdown-item"
                                                                                onClick={() => navigate('/piping/user/manage-pwht-master', { state: elem })}><i
                                                                                    className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                                Edit</button>
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.name)} ><i
                                                                                className="fa fa-trash-alt m-r-5"></i> Delete</button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </PwhtAuth>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <td colSpan="999">
                                                                <div className="no-table-data">
                                                                    No Data Found!
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="row align-center mt-3 mb-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(currentPage * limit, total)} of {total} entries</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={total}
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
                    )}

                </div>
                <Footer />
            </div>
        </div>
    )
}

export default NdtMaster