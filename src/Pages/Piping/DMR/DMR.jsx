import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDmr, manageDmr } from '../../../Store/Erp/Dmr/Dmr';
import { getDmrCategories } from '../../../Store/Erp/DmrCategories/DmrCategories';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import Loader from '../Include/Loader';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';
import AddModel from './Comman-Components/AddModel';
import toast from 'react-hot-toast';
import { PLAN } from '../../../BaseUrl';


const DMR = () => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedDmr, setSelectedDmr] = useState(null);

    // Inline editing state
    const [editingCell, setEditingCell] = useState(null); // { dmrId, field, dateIndex }
    const [editValue, setEditValue] = useState("");

    useEffect(() => {
        if (disable === true) {
            dispatch(getDmr());
            dispatch(getDmrCategories());
            setDisable(false);
        }
    }, [dispatch, disable]);

    const dmrEntity = useSelector((state) => state?.getDmr?.user?.data?.dmrs);
    
    const dmrCategories = useSelector((state) => state.dmr?.categories || []);

    // Helper function to get category name - now using the category object from API
    const getCategoryName = (category) => {
        if (typeof category === 'object' && category?.name) {
            return category.name;
        }
        // Fallback to lookup if category is just an ID
        const categoryObj = dmrCategories.find(cat => cat._id === category);
        return categoryObj ? categoryObj.name : 'Unknown Category';
    };

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    // Submit handler using thunk
    const handleAddDmr = async (dmrData) => {
        try {
            // dmrData.categories is an array of { category, value }
            const promises = dmrData.categories.map((row) => {
                const payload = {
                    project: dmrData.project,
                    category: row.category,
                    date: dmrData.date,
                    value: parseFloat(row.value),
                    ...(editMode && selectedDmr?._id ? { id: selectedDmr._id } : {}),
                };
                return dispatch(manageDmr(payload));
            });
            await Promise.all(promises);
            setShowAddModal(false);
            setEditMode(false);
            setSelectedDmr(null);
            dispatch(getDmr());
        } catch (e) {
            // already toasted in thunk
        }
    };

    // Inline editing handlers
    const handleCellClick = (dmrId, field, dateIndex = null, currentValue = "") => {
        // Check if the date is editable (today or up to 2 days ago)
        if (field === 'daily_mandays' && dateIndex !== null) {
            const today = new Date();
            const targetDate = new Date(today.getFullYear(), today.getMonth(), dateIndex + 1);
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(today.getDate() - 3);
            
            // Only allow editing for today and up to 2 days ago
            if (targetDate < twoDaysAgo || targetDate > today) {
                toast.error('You can only edit dates from 2 days ago to today');
                return;
            }
        }
        
        setEditingCell({ dmrId, field, dateIndex });
        setEditValue(currentValue.toString());
    };

    const handleEditSave = async () => {
        if (!editingCell) return;

        const { dmrId, field, dateIndex } = editingCell;
        const dmr = dmrEntity.find(d => d._id === dmrId);
        
        if (!dmr) return;

        try {
            let payload = {
                project: dmr.project._id,
                category: dmr.category._id,
                id: dmrId
            };

            if (field === 'cumulative_mandays') {
                payload.value = parseFloat(editValue);
                payload.date = new Date().toISOString().split('T')[0]; // Today's date
            } else if (field === 'daily_mandays' && dateIndex !== null) {
                // Get the actual date from dateHeaders array
                const dateHeader = dateHeaders[dateIndex];
                if (!dateHeader) {
                    console.error('Invalid dateIndex:', dateIndex);
                    return;
                }
                
                // Parse the date header (format: "11-Jul-2025")
                const [day, month, year] = dateHeader.split('-');
                const monthMap = {
                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
                    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                };
                
                // Format date directly as YYYY-MM-DD to avoid timezone issues
                const formattedDay = day.padStart(2, '0');
                const formattedMonth = monthMap[month];
                payload.date = `${year}-${formattedMonth}-${formattedDay}`;
                payload.value = parseFloat(editValue);
                
           
            }

            await dispatch(manageDmr(payload));
            setEditingCell(null);
            setEditValue("");
            dispatch(getDmr()); // Refresh data
        } catch (error) {
            console.error('Error saving inline edit:', error);
        }
    };

    const handleEditCancel = () => {
        setEditingCell(null);
        setEditValue("");
    };

    const handleEditKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEditSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            handleEditCancel();
        }
    };

    // Helper function to check if a date is editable
    const isDateEditable = (dateIndex) => {
        const today = new Date();
        const targetDate = new Date(today.getFullYear(), today.getMonth(), dateIndex + 1);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(today.getDate() - 3);
        
        return targetDate >= twoDaysAgo && targetDate <= today;
    };

    // Filter and paginate DMR data
    const filteredDmrData = useMemo(() => {
        if (!dmrEntity) return [];
        
        let filtered = [...dmrEntity];
        
        // Apply search filter
        if (search) {
            filtered = filtered.filter(dmr => {
                const categoryName = dmr.category?.name?.toLowerCase() || '';
                const categoryId = dmr.category?._id?.toLowerCase() || '';
                const projectName = dmr.project?.name?.toLowerCase() || '';
                return categoryName.includes(search.toLowerCase()) || 
                       categoryId.includes(search.toLowerCase()) ||
                       projectName.includes(search.toLowerCase());
            });
        }
        
        // Update total items for pagination
        setTotalItems(filtered.length);
        
        // Apply pagination
        return filtered.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [dmrEntity, search, currentPage, limit]);

    // Debug log for filtered data
    useEffect(() => {
        console.log('Filtered DMR Data:', filteredDmrData);
    }, [filteredDmrData]);

    const handleAddNewDmr = () => {
        setSelectedDmr(null);
        setEditMode(false);
        setShowAddModal(true);
    };

    // const handlePdfDownload = () => {
    //     const bodyFormData = new URLSearchParams();
    //     bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
    //     PdfDownloadErp({ apiMethod: 'post', url: 'download-grid-xlsx-dpr', body: bodyFormData });
    // }



    const handleSamplePdfDownload = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        PdfDownloadErp({ apiMethod: 'post', url: 'dmr/export', body: bodyFormData });
    };


    const columnHeaders = [
        "SR.", "CATEGORY", 'CUMULATIVE MANDAYS'
    ];

    const today = new Date();

    // Set start and end of the current month
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // last day of the month

    const dateHeaders = [];
    const options = { day: '2-digit', month: 'short', year: 'numeric' }; // e.g., "11-Jul-2025"

    let current = new Date(startDate);
    while (current <= endDate) {
    dateHeaders.push(current.toLocaleDateString('en-GB', options).replace(/ /g, '-'));
    current.setDate(current.getDate() + 1);
    }

    const finalHeaders = [...columnHeaders, ...dateHeaders];

    // Debug: Log date headers for verification
    useEffect(() => {
        console.log('Date Headers:', dateHeaders);
        console.log('Today:', today.toISOString().split('T')[0]);
        console.log('Start Date:', startDate.toISOString().split('T')[0]);
        console.log('End Date:', endDate.toISOString().split('T')[0]);
    }, [dateHeaders, today, startDate, endDate]);

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">DMR List</li>
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
                                                        <h3>DMR List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                                <button 
                                                                    type="button"
                                                                    onClick={handleAddNewDmr}
                                                                    className="btn btn-primary add-pluss ms-2" 
                                                                    data-toggle="tooltip" 
                                                                    data-placement="top" 
                                                                    title="Add DMR"
                                                                >
                                                                    <img src="/assets/img/icons/plus.svg" alt="plus" />
                                                                </button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={handleSamplePdfDownload}>Download DMR <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div>
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 comman-table mb-0 dpr-table">
                                                <thead>
                                                    <tr>
                                                        {finalHeaders.map((header, idx) => <th key={idx}>{header}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredDmrData?.length > 0 ? (
                                                        filteredDmrData.map((dmr, index) => (
                                                            <tr key={dmr._id || index}>
                                                                <td>{((currentPage - 1) * limit) + index + 1}</td>
                                                                <td>{getCategoryName(dmr.category)}</td>
                                                                <td>{dmr.cumulative_mandays || 0}
                                                                </td>
                                                                {dateHeaders.map((dateHeader, dateIndex) => {
                                                                    const date = new Date(today.getFullYear(), today.getMonth(), dateIndex + 1);
                                                                    const dailyData = dmr.daily_mandays?.find(d => 
                                                                        new Date(d.date).toDateString() === date.toDateString()
                                                                    );
                                                                    const cellValue = dailyData ? dailyData.value : '-';
                                                                    const isEditing = editingCell?.dmrId === dmr._id && 
                                                                                     editingCell?.field === 'daily_mandays' && 
                                                                                     editingCell?.dateIndex === dateIndex;
                                                                    const editable = isDateEditable(dateIndex)  && localStorage.getItem('ERP_ROLE') === PLAN; 
                                                                    
                                                                    return (
                                                                        <td 
                                                                            key={dateIndex}
                                                                            onClick={() => editable ? handleCellClick(dmr._id, 'daily_mandays', dateIndex, cellValue) : null}
                                                                            style={{ 
                                                                                cursor: editable ? 'pointer' : 'default',
                                                                                backgroundColor:  'transparent',
                                                                            }}
                                                                            title={editable ? 'Click to edit' : 'Cannot edit - date is too old'}
                                                                        >
                                                                            {isEditing ? (
                                                                                <div className="d-flex align-items-center gap-2">
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control form-control-sm"
                                                                                        value={editValue}
                                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                                        onKeyDown={handleEditKeyPress}
                                                                                        autoFocus
                                                                                        style={{ width: '80px' }}
                                                                                    />
                                                                                    <button 
                                                                                        className="btn btn-sm btn-success"
                                                                                        onClick={(e) => { e.stopPropagation(); handleEditSave(); }}
                                                                                        title="Save"
                                                                                    >
                                                                                        <i className="fas fa-check"></i>
                                                                                    </button>
                                                                                    <button 
                                                                                        className="btn btn-sm btn-danger"
                                                                                        onClick={(e) => { e.stopPropagation(); handleEditCancel(); }}
                                                                                        title="Cancel"
                                                                                    >
                                                                                        <i className="fas fa-times"></i>
                                                                                    </button>
                                                                                </div>
                                                                            ) : (
                                                                                <span style={{ 
                                                                                    color:'#000',
                                                                                    fontWeight: editable ? 'normal' : 'normal'
                                                                                }}>
                                                                                    {cellValue}
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={finalHeaders.length + 1}>
                                                                <div className="no-table-data">
                                                                    No DMR Data Found!
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

            {/* DMR Add/Edit Modal */}
            <AddModel
                modalOpen={showAddModal}
                handleModalClose={() => {
                    setShowAddModal(false);
                    setEditMode(false);
                    setSelectedDmr(null);
                }}
                handleAddDmr={handleAddDmr}
                modalMode={editMode ? "edit" : "add"}
                dmrData={selectedDmr}
            />
        </div>
    )
}

export default DMR;