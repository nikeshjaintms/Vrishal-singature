import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import DropDown from '../../../../Components/DropDown';
import axios from 'axios';
import moment from 'moment';
import { FileText } from 'lucide-react';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination } from '../../Table';
import { getUserContractor } from '../../../../Store/Store/ContractorMaster/ContractorMaster';
import { useDispatch, useSelector } from 'react-redux';

const ViewDrawing = () => {
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [disable2, setDisable2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState([]);
    const [searchVal, setSearchVal] = useState({
        date: "",
        status: "",
        contractor: "",
    });

    useEffect(() => {
        dispatch(getUserContractor({ status: true }))
    }, []);

    useEffect(() => {
        if (disable === true) {
            setEntity([]);
        }
    }, [disable]);

    const contractorData = useSelector((state) => state?.getUserContractor?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        setTotalItems(computedComments?.length);
        const grouped = computedComments.reduce((acc, item) => {
            const key = `${item.drawing_no}-${item.unit}-${item.assembly_no}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        Object.keys(grouped).forEach(key => {
            const group = grouped[key];
            const maxRev = Math.max(...group.map(item => item.rev));
            group.forEach(item => {
                item.isMain = item.rev === maxRev;
            });
        });
        const flattenedData = Object.values(grouped).flat();
        return flattenedData?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, limit, entity]);

    const handleChange = (e) => {
        setSearchVal({ ...searchVal, [e.target.name]: e.target.value });
    }

    const handleSearch = () => {
        setDisable2(true);
        const myurl = `${V_URL}/user/get-project-drawings`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('date', searchVal.date);
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('status', searchVal.status);
        bodyFormData.append('contractor', searchVal.contractor);
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            // console.log(response.data, ' ^^^$$')
            if (response.data.success === true) {
                toast.success(response.data.message);
                setEntity(response.data.data);
                setDisable(false);
            } else {
                toast.error(response.data.message);
                setEntity(response.data.data);
            }
            setDisable2(false);
        }).catch((error) => {
            setDisable2(false);
            console.log(error, '!!');
            toast.error(error?.response?.data?.message || 'Something went wrong');
        })
    }

    const handleDownload = () => {
        setLoading(true);
        const myurl = `${V_URL}/user/filtered-drawing-issue-report`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('date', searchVal.date);
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('status', searchVal.status);
        bodyFormData.append('contractor', searchVal.contractor);
        bodyFormData.append('print_date', true);
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((res) => {
            if (res.data.success === true) {
                window.open(res.data.data.file, '_blank')
                toast.success(res.data.message);
            }
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally(() => { setLoading(false) })

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
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Drawing List</li>
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
                                                    <h3>Drawing List</h3>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="staff-search-table">
                                        <form>
                                            <div className="row">
                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="input-block local-forms">
                                                        <label>Receive Date</label>
                                                        <input className="form-control" type="date"
                                                            onChange={handleChange} value={searchVal.date} name="date"
                                                            max={new Date().toISOString().split("T")[0]}
                                                        />
                                                        {/* <div className='error'>{error?.date_err}</div> */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="input-block local-forms">
                                                        <label>Status</label>
                                                        <select className="form-control form-select"
                                                            value={searchVal.status}
                                                            onChange={handleChange} name='status'
                                                        >
                                                            <option value="">Select Status</option>
                                                            <option value={1}>Pending</option>
                                                            <option value={2}>Issued</option>
                                                            {/* <option value={3}>Rejected</option> */}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="input-block local-forms">
                                                        <label>Contractor</label>
                                                        <select className="form-control form-select"
                                                            value={searchVal.contractor}
                                                            onChange={handleChange} name='contractor'>
                                                            <option value="">Select Contractor</option>
                                                            {contractorData?.map((e, i) =>
                                                                <option key={i} value={e?._id}>{e?.name}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="doctor-submit d-flex">
                                                        <button type="button" onClick={handleSearch}
                                                            className="btn btn-primary me-2" disabled={disable2}>{disable2 ? 'Processing...' : 'Search'}</button>
                                                        <button type="button" onClick={handleDownload}
                                                            className="btn btn-primary me-2 mx-2" disabled={loading}>{loading ? 'Processing...' : 'Download'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {disable2 === false ? (
                                        <>
                                            <div className="table-responsive mt-2">
                                                <table className="table border-0 custom-table comman-table  mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Sr.</th>
                                                            <th>Drawing No.</th>
                                                            <th>Unit</th>
                                                            <th>REV</th>
                                                            <th>Sheet No.</th>
                                                            <th>Assem. No.</th>
                                                            <th>PDF</th>
                                                            <th>Receive Date</th>
                                                            <th>Contractor</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {commentsData?.map((elem, i) =>
                                                            <tr key={elem?._id} className={!elem.isMain ? 'table-row-red' : ''}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.drawing_no}</td>
                                                                <td>{elem?.unit}</td>
                                                                <td>{elem?.rev}</td>
                                                                <td>{elem?.sheet_no}</td>
                                                                <td>{elem?.assembly_no}</td>
                                                                <td>
                                                                    <a href={elem?.drawing_pdf} target='_blank' rel="noreferrer" style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title="View">
                                                                        <FileText /> {elem?.drawing_pdf_name}
                                                                    </a>
                                                                </td>
                                                                <td>{moment(elem?.draw_receive_date).format('YYYY-MM-DD')}</td>
                                                                <td>{elem?.issued_person?.name || '-'}</td>
                                                                <td>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : (
                                                                        <span className="custom-badge status-green">Completed</span>
                                                                    )}
                                                                </td>
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
                                        </>
                                    ) : <Loader />}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ViewDrawing