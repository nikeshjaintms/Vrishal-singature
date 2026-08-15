import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { MONTHS } from '../../../../../helper/MonthFile';
import { Dropdown } from 'primereact/dropdown';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import { V_URL } from '../../../../../BaseUrl';
import { Pagination, Search } from '../../../Table';
import Loader from '../../../Include/Loader';
import DropDown from '../../../../../Components/DropDown';

const DailyAttendance = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [entity, setEntity] = useState([]);
    const [datesForMonth, setDatesForMonth] = useState([]);
    const [limit, setLimit] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [disable, setDisable] = useState(false);
    const [count, setCount] = useState({});

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [filterData, setFilterData] = useState({
        month: currentMonth.toString(),
        year: currentYear.toString()
    });

    const yearsOption = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => ({
        label: (2023 + i).toString(),
        value: (2023 + i).toString(),
    }));

    const monthsOption = MONTHS.map((month, index) => ({
        label: month,
        value: (index + 1).toString(),
    }));

    useEffect(() => {
        updateDatesForMonth();
        getDailyAttendance();
    }, [filterData, currentPage, search, limit]);

    const updateDatesForMonth = () => {
        const daysInMonth = new Date(parseInt(filterData.year, 10), parseInt(filterData.month, 10), 0).getDate();
        const days = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(parseInt(filterData.year, 10), parseInt(filterData.month, 10) - 1, i);
            const dayOfWeek = currentDate.getDay();
            const dayOfWeekText = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            days.push({
                date: currentDate,
                day: i,
                dayOfWeek: dayOfWeekText[dayOfWeek]
            });
        }
        setDatesForMonth(days);
    };

    const commentsData = useMemo(() => {
        let computedComments = entity.filter(item =>
            new Date(item.date).getFullYear() === parseInt(filterData?.year, 10) &&
            new Date(item.date).getMonth() + 1 === parseInt(filterData?.month, 10)
        );
        return computedComments
    }, [entity, filterData]);

    const getDailyAttendance = () => {
        setDisable(true);
        const myurl = `${V_URL}/admin/get-admin-daily-attendance?page=${currentPage}&limit=${limit}&search=${search}&month=${filterData.month}`;

        axios.get(myurl, {
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Bearer " + localStorage.getItem('VA_TOKEN') }
        })
            .then((response) => {
                if (response?.data?.success) {
                    const data = response?.data?.data;
                    setEntity(data?.data);
                    setTotalItems(data.totalData);
                    setCurrentPage(data.currentPage);
                    setCount(data?.counts);
                } else {
                    toast.error(response?.data?.message);
                }
                setDisable(false);
            })
            .catch((error) => {
                toast.error("Something went wrong");
                console.error("Error fetching attendance data:", error);
                setDisable(false);
            });
    };

    const handleFilterChange = (e, name) => {
        setFilterData((prev) => ({
            ...prev,
            [name]: e.target.value
        }));
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
        setCurrentPage(1);
        getDailyAttendance();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setDisable(true);
    };

    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={() => setIsSidebarOpen(!isSidebarOpen)} />
            <Sidebar />
            <div className="page-wrapper user-account">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Daily Attendance List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className='row mt-4'>
                                        <div className="col-12 col-md-4">
                                            <div className="mx-2">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Years<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={yearsOption}
                                                        value={filterData.year}
                                                        onChange={(e) => handleFilterChange(e, 'year')}
                                                        placeholder='Select Year'
                                                        className='w-100'
                                                    />
                                                </div >
                                            </div >
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="mx-2">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Months<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={monthsOption}
                                                        value={filterData.month}
                                                        onChange={(e) => handleFilterChange(e, 'month')}
                                                        placeholder='Select Month'
                                                        className='w-100'
                                                    />
                                                </div >
                                            </div >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-table show-entire">
                        <div className="card-body">
                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                        <div className="doctor-table-blk add-group">
                                            <h3>Daily Attendance List</h3>
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search onSearch={(value) => {
                                                            setSearch(value);
                                                            setCurrentPage(1);
                                                        }} />
                                                        <a className="btn">
                                                            <img
                                                                src="/assets/img/icons/search-normal.svg"
                                                                alt="search"
                                                            />
                                                        </a>
                                                    </form>
                                                </div>
                                            </div>
                                            <button type='button' onClick={handleRefresh}
                                                className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                    src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                        </div>
                                    </div>

                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} />
                                    </div>
                                </div>
                            </div>

                            {disable ? <Loader /> : (
                                <div className="card p-3">
                                    <div className="table-responsive">
                                        <table className="table border-0 custom-table comman-table mb-0">
                                            <thead>
                                                <tr>
                                                    {/* <th>Sr.</th> */}
                                                    <th>Employee</th>
                                                    <th>Card No.</th>
                                                    {datesForMonth.map(day => (
                                                        <th key={day.date.toString()} style={{ textAlign: "center", color: day.dayOfWeek === 'Saturday' || day.dayOfWeek === 'Sunday' ? 'red' : 'black' }}>
                                                            {day.day}
                                                        </th>
                                                    ))}
                                                    <th className='text-end'>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commentsData.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={datesForMonth.length + 3} className="text-center">
                                                            <b>No Data Found</b>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    commentsData.reduce((acc, curr) => {
                                                        const existingEmployeeIndex = acc.findIndex(item => item.employee._id === curr.employee._id);
                                                        if (existingEmployeeIndex === -1) {
                                                            acc.push({
                                                                employee: curr.employee,
                                                                attendanceData: [{ date: curr.date, apchar: curr.apchar, sum_Apchar: curr.sum_Apchar, e_year: curr.e_year, month: curr.month, e_day: curr.e_day }]
                                                            });
                                                        } else {
                                                            acc[existingEmployeeIndex].attendanceData.push({
                                                                date: curr.date, apchar: curr.apchar, sum_Apchar: curr.sum_Apchar,
                                                                e_year: curr.e_year, month: curr.month, e_day: curr.e_day
                                                            });
                                                        }
                                                        return acc;
                                                    }, []).map((item, index) => {
                                                        const totalPCount = item.attendanceData.filter(attendance => {
                                                            const attendanceDate = moment(attendance.date);
                                                            return attendance.apchar === 'P' && attendanceDate.month() + 1 === parseInt(filterData?.month);
                                                        }).length;

                                                        return (
                                                            <tr key={index}>
                                                                {/* <td>{(currentPage - 1) * limit + index + 1}</td> */}
                                                                <td>
                                                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                                                        {item.employee?.full_name}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {item?.employee?.card_no}
                                                                </td>
                                                                {datesForMonth.map((day, dayIndex) => {
                                                                    const attendance = item?.attendanceData?.find(data =>
                                                                        data.e_day === day.day &&
                                                                        data.month === parseInt(filterData?.month, 10) &&
                                                                        data.e_year === parseInt(filterData?.year, 10)
                                                                    );

                                                                    let attendanceSymbol = '-';
                                                                    let badgeClass = '';
                                                                    if (attendance) {
                                                                        if (attendance.sum_Apchar === 'P') {
                                                                            attendanceSymbol = 'P';
                                                                            badgeClass = 'bg-success attendance-badge';
                                                                        } else if (attendance.sum_Apchar === 'HD') {
                                                                            attendanceSymbol = 'HD';
                                                                            badgeClass = 'badge-purple attendance-badge';
                                                                        } else if (attendance.sum_Apchar === 'A') {
                                                                            attendanceSymbol = 'A';
                                                                            badgeClass = 'bg-danger attendance-badge';
                                                                        } else if (attendance.sum_Apchar === 'CL') {
                                                                            attendanceSymbol = 'CL';
                                                                            badgeClass = 'bg-primary attendance-badge';
                                                                        } else {
                                                                            attendanceSymbol = attendance.sum_Apchar;
                                                                            badgeClass = 'bg-secondary attendance-badge';
                                                                        }
                                                                    }

                                                                    return (
                                                                        <td key={dayIndex} style={{ textAlign: "center", color: day.dayOfWeek === 'Saturday' || day.dayOfWeek === 'Sunday' ? 'red' : 'black' }}>
                                                                            {attendanceSymbol !== '-' ? (
                                                                                <span className={`badge ${badgeClass}`} >
                                                                                    {attendanceSymbol}
                                                                                </span>
                                                                            ) : (
                                                                                attendanceSymbol
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                                <td className='text-end'><b>{totalPCount}</b></td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="row align-center mt-3 user-account">
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
                                                    onPageChange={handlePageChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default DailyAttendance;
