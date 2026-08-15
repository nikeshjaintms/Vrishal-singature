import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DownloadXlsx } from "../../../Store/Components/DownloadXlsx";
import { DownloadPdf } from "../../../Store/Components/DownloadPdf";
import Header from "../../Include/Header";
import { Pagination, Search } from "../../Table";
import DropDown from "../../../../Components/DropDown";
import FilterComponent from "../../../Store/Transaction/FilterComponent";
import Loader from "../../Include/Loader";
import Footer from "../../Include/Footer";
import Sidebar from "../../Include/Sidebar";
import { getAdminMainStock } from "../../../../Store/Admin/Transaction/GetAdminStock";


const Stock = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [filter, setFilter] = useState({
        date: {
            start: null,
            end: null
        }
    });
    const [openFilter, setOpenFilter] = useState(false)

    const handleDateChange = (e, type) => {
        const dateValue = e.target.value;
        setFilter(prevFilter => {
            const newFilter = {
                ...prevFilter,
                date: {
                    ...prevFilter.date,
                    [type]: dateValue
                }
            };
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('filter', JSON.stringify(newFilter))
            dispatch(getAdminMainStock(bodyFormData));
            return newFilter;
        });
    };

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        if (disable === true) {
            fetchData();
        }
    }, [navigate, disable, filter]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('filter', JSON.stringify(filter))
        dispatch(getAdminMainStock(bodyFormData));
        setDisable(false);
    }

    const entity = useSelector((state) => state.getAdminStock?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity?.store_items || [];

        if (search) {
            computedComments = computedComments.filter(
                (stock) =>
                    stock.item_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    stock.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    stock.material_grade?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    stock.m_code?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);

        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const downloadXlsx = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('print_date', true);
        DownloadXlsx({ apiMethod: 'post', url: 'ms-stock-xslx', body: bodyFormData, fileName: 'main-store-stock' })
    }

    const downloadPdf = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('print_date', true);
        DownloadPdf({ apiMethod: 'post', url: 'ms-stock-download', body: bodyFormData });
    }

    const handleRefresh = () => {
        setDisable(true);
        setFilter({
            date: {
                start: null,
                end: null
            }
        })
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
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
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Stock List</li>
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
                                                        <h3>Stock List</h3>
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
                                                                        alt="firm-searchBox" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                                <button
                                                                    className="btn btn-primary doctor-refresh ms-2"
                                                                    onClick={() => setOpenFilter(!openFilter)}
                                                                    aria-controls="filter-inputs"
                                                                    aria-expanded={openFilter}
                                                                >
                                                                    <i className="fas fa-filter"></i>
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                                <FilterComponent
                                                    handleDateChange={handleDateChange}
                                                    handleDownloadPdf={downloadPdf}
                                                    handleDownloadXlsx={downloadXlsx}
                                                    openFilter={openFilter}
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Item</th>
                                                        <th>M Code</th>
                                                        <th>Unit</th>
                                                        <th>Material Grade</th>
                                                        <th>OP Qty.</th>
                                                        <th>IN Qty.</th>
                                                        <th>Out Qty.</th>
                                                        <th>Bal. Qty.</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{elem.item_name}</td>
                                                            <td>{elem.m_code}</td>
                                                            <td>{elem.unit}</td>
                                                            <td>{elem.material_grade || '-'}</td>
                                                            <td>{elem.opening_balance}</td>
                                                            <td>{elem.date_totalIn}</td>
                                                            <td>{elem.date_totalOut}</td>
                                                            <td>{elem.balance}</td>
                                                        </tr>
                                                    )}

                                                    {commentsData?.length > 0 && (
                                                        <tr>
                                                            <td colSpan={5} className='text-center fw-bold'>Total</td>
                                                            <td className='fw-bold'>{entity?.total_op_bal}</td>
                                                            <td className='fw-bold'>{entity?.total_in}</td>
                                                            <td className='fw-bold'>{entity?.total_out}</td>
                                                            <td className='fw-bold'>{entity?.total_balance}</td>
                                                        </tr>
                                                    )}

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
                                                        onPageChange={(page) => setCurrentPage(page)}
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

export default Stock;