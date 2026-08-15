import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from '../Include/Sidebar';
import Header from '../Include/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import { getItemLedger } from '../../../Store/Store/Report/ItemLedger';
import toast from 'react-hot-toast';
import { DownloadPdf } from '../Components/DownloadPdf';
import moment from 'moment';
import FilterComponent from '../Transaction/FilterComponent';

const ItemLedger = () => {
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
    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== "Main Store") {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        fetchData();
    }, [navigate, filter, disable, search]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', search);
        bodyFormData.append('tag_number', 14);
        bodyFormData.append('filter', JSON.stringify(filter));
        // bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        dispatch(getItemLedger(bodyFormData))
        setDisable(false);
    }

    const entity = useSelector((state) => state?.getItemLedger?.user?.data);

    const commentsData = useMemo(() => {
        if (!entity || !Array.isArray(entity)) return [];
        let computedComments = [...entity];
        if (search) {
            computedComments = computedComments.filter(
                (led) =>
                    led?.item_name?.toString().toLowerCase()?.includes(search.toLowerCase())
            );
        }
        setTotalItems(computedComments.length);
        return computedComments.slice(
            (currentPage - 1) * limit,
            currentPage * limit
        );
    }, [entity, search, currentPage, limit]);


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
            return newFilter;
        });
    };

    useEffect(() => {
        if (commentsData?.length > 0) {
            setActiveItem(commentsData[0]);
        }
    }, [commentsData]);

    const [activeItem, setActiveItem] = useState(0);
    const handleItemClick = (item) => {
        setActiveItem(item);
    };
    const filteredData = activeItem ? activeItem?.order_details?.flatMap(order => order.tag_details) : [];

    const downloadPdf = (item) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('search', item?.item_name);
        bodyFormData.append('filter', JSON.stringify(filter));
        bodyFormData.append('print_date', true);
        // bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
        bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
        DownloadPdf({ apiMethod: 'post', url: 'legder-download', body: bodyFormData });
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
                                    <li className="breadcrumb-item"><Link to="/main-store/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Item Ledger List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        {/* Header Section */}
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Item Ledger List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }}
                                                                    />
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg" alt="firm-searchBox" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2"
                                                                    data-toggle="tooltip" title="Refresh">
                                                                    <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                                                </button>
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
                                                    itemLedger={true}
                                                    handleDateChange={handleDateChange}
                                                    handleDownloadPdf={downloadPdf}
                                                    openFilter={openFilter}
                                                    isPurchaseSummary={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-12">
                                    <div className='row'>
                                        <div className='col-md-4 col-sm-12'>
                                            <div className="card card-table show-entire itemLedgerCard">
                                                <div className="card-body">
                                                    <div className="nav flex-column nav-pills ledger-navs" role="tablist" aria-orientation="vertical">
                                                        <h4>Item</h4>
                                                        {commentsData?.map((it, i) => (
                                                            <div className='d-flex'>
                                                                <button
                                                                    key={i}
                                                                    className={`nav-link ${activeItem?.item_id === it.item_id ? 'active' : ''}`}
                                                                    onClick={() => handleItemClick(it)}
                                                                    style={{
                                                                        color: activeItem?.item_id === it.item_id ? '' : '#7b7a7a', textAlign: 'left'
                                                                    }}>
                                                                    {it?.item_name}
                                                                </button>
                                                                {
                                                                    activeItem?.item_id === it.item_id && (
                                                                        <button type='button' className={`nav-link btn btn-sm mx-1 ${activeItem?.item_id === it.item_id ? 'active' : ''}`}
                                                                            onClick={() => downloadPdf(it)}
                                                                            style={{
                                                                                color: activeItem?.item_id === it.item_id ? '' : '#7b7a7a', textAlign: 'left'
                                                                            }}><i
                                                                                className="fa-solid fa-download"></i></button>
                                                                    )
                                                                }

                                                            </div>
                                                        ))}
                                                    </div >
                                                    {commentsData?.length === 0 && (
                                                        <div className='d-flex align-items-center justify-content-center h-75'>
                                                            <h5>No Items Found</h5>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-md-8 col-sm-12'>
                                            <div className="card card-table show-entire itemLedgerCard">
                                                <div className="card-body">
                                                    <div className="table-responsive">
                                                        <table className="table border-0 custom-table comman-table mb-0">
                                                            <thead>
                                                                <tr>
                                                                    {/* <th>Sr.</th> */}
                                                                    <th>Date</th>
                                                                    <th>Type</th>
                                                                    <th>Voucher No.</th>
                                                                    <th>Bill No.</th>
                                                                    <th>In Qty.</th>
                                                                    <th>Out Qty.</th>
                                                                    <th>Bal. Qty.</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(commentsData.length === 0) ? (
                                                                    <tr>
                                                                        <td colSpan="7">
                                                                            <div className="no-table-data">No Data Found!</div>
                                                                        </td>
                                                                    </tr>
                                                                ) : (
                                                                    (() => {
                                                                        let grandTotalIn = 0;
                                                                        let grandTotalOut = 0;
                                                                        let runningBalance = activeItem.opening_balance || 0;

                                                                        return (
                                                                            <>
                                                                                <tr>
                                                                                    <td colSpan="7" style={{ fontWeight: 'bold', textAlign: 'left' }}>
                                                                                        {activeItem.item_name} ( {activeItem.unit} )
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colSpan="7" style={{ textAlign: 'left' }}>
                                                                                        OP Balance: {runningBalance.toFixed(3)}
                                                                                    </td>
                                                                                </tr>

                                                                                {activeItem?.order_details?.map((orderDetail, orderIndex) =>
                                                                                    orderDetail?.tag_details?.map((tag, tagIndex) =>
                                                                                        tag?.trans_details ? (
                                                                                            tag?.trans_details?.map((trans, transIndex) => {
                                                                                                const inAmount = trans.item_details.in || 0;
                                                                                                const outAmount = trans.item_details.out || 0;
                                                                                                runningBalance += inAmount - outAmount;
                                                                                                grandTotalIn += inAmount;
                                                                                                grandTotalOut += outAmount;

                                                                                                return (
                                                                                                    <tr key={`${orderIndex}-${tagIndex}-${transIndex}`}>
                                                                                                        <td>{moment(orderDetail.trans_date).format('YYYY-MM-DD')}</td>
                                                                                                        <td>{tag.tag_name}</td>
                                                                                                        <td>{trans.voucher_no}</td>
                                                                                                        <td>{trans.bill_no || '-'}</td>
                                                                                                        <td>{inAmount.toFixed(3)}</td>
                                                                                                        <td>{outAmount.toFixed(3)}</td>
                                                                                                        <td>{runningBalance.toFixed(3)}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            })
                                                                                        ) : null
                                                                                    )
                                                                                )}

                                                                                <tr style={{ height: '50px' }}>
                                                                                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total</td>
                                                                                    <td style={{ fontWeight: 'bold' }}>{grandTotalIn.toFixed(3)}</td>
                                                                                    <td style={{ fontWeight: 'bold' }}>{grandTotalOut.toFixed(3)}</td>
                                                                                    <td></td>
                                                                                </tr>
                                                                            </>
                                                                        );
                                                                    })()
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>

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

export default ItemLedger