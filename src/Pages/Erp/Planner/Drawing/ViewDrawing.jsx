import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ERP, PLAN, V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Pagination } from '../Table';
import DropDown from '../../../../Components/DropDown';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../../../Store/Store/Profile/Profile';
import Loader from '../Include/Loader';
import moment from 'moment';
import { FileText } from 'lucide-react';
import Footer from '../Include/Footer';

const ViewDrawing = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    // const [search, setSearch] = useState(""); 
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [disable2, setDisable2] = useState(false);
    const [entity, setEntity] = useState([]);
    // const [error, setError] = useState({});
    const [searchVal, setSearchVal] = useState({
        date: "",
        project: "",
        status: "",
    });

    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${ERP}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (localStorage.getItem('ERP_ROLE') !== `${PLAN}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getUserProfile())
                ])
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData()
        if (disable === true) {
            setEntity([]);
        }
    }, [navigate, disable, dispatch]);

    const projectData = useSelector((state) => state?.getUserProfile?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;

        // if (search) {
        //     computedComments = computedComments.filter(
        //         (draw) =>
        //             draw.project?.name?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             draw.drawing_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
        //     );
        // }

        setTotalItems(computedComments?.length);

        //Current Page slice
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, limit, entity]);

    const handleChange = (e) => {
        setSearchVal({ ...searchVal, [e.target.name]: e.target.value });
    }

    const handleSearch = () => {
        // if (validation()) {
        setDisable2(true);
        const myurl = `${V_URL}/user/get-project-drawings`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('date', searchVal.date);
        bodyFormData.append('project', searchVal.project);
        bodyFormData.append('status', searchVal.status);
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
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
            toast.error(error?.response?.data?.message || 'Something went wrong');
        })
        // }
    }

    // const validation = () => {
    //     var isValid = true;
    //     let err = {};
    //     if (!searchVal.project) {
    //         isValid = false;
    //         err['project_err'] = "Please select project"
    //     }
    //     if (!searchVal.date) {
    //         isValid = false;
    //         err['date_err'] = "Please select date"
    //     }
    //     setError(err);
    //     return isValid;
    // }

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
                                    <li className="breadcrumb-item"><Link to="/erp/user/planner/dashboard">Dashboard</Link></li>
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
                                                            onChange={handleChange} value={searchVal.date} name="date" />
                                                        {/* <div className='error'>{error?.date_err}</div> */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="input-block local-forms">
                                                        <label>Project</label>
                                                        <select className="form-control select"
                                                            value={searchVal.project}
                                                            onChange={handleChange} name='project'
                                                        >
                                                            <option value="">Select Project</option>
                                                            {projectData?.project?.map((e) =>
                                                                <option value={e?._id} key={e?._id}>{e?.name}</option>
                                                            )}
                                                        </select>
                                                        {/* <div className='error'>{error?.project_err}</div> */}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="input-block local-forms">
                                                        <label>Status</label>
                                                        <select className="form-control select"
                                                            value={searchVal.status}
                                                            onChange={handleChange} name='status'
                                                        >
                                                            <option value="">Select Status</option>
                                                            <option value={0}>Pending</option>
                                                            <option value={1}>Approved</option>
                                                            <option value={2}>Rejected</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4 col-xl-3">
                                                    <div className="doctor-submit">
                                                        <button type="button" onClick={handleSearch}
                                                            className="btn btn-primary submit-list-form me-2" disabled={disable2}>{disable2 ? 'Processing...' : 'Search'}</button>
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
                                                            <th>Project</th>
                                                            <th>Drawing No.</th>
                                                            <th>PDF</th>
                                                            <th>Receive Date</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {commentsData?.map((elem, i) =>
                                                            <tr key={elem?._id}>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.project?.name}</td>
                                                                <td>{elem?.drawing_no}</td>
                                                                <td>
                                                                    <a href={elem?.image?.pdf} target='_blank' rel="noreferrer" style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title="View">
                                                                        <FileText /> {elem?.image?.pdf ? elem?.image?.pdf?.split('/')?.pop() : 'PDF File'}
                                                                    </a>
                                                                </td>
                                                                <td>{moment(elem?.draw_receive_date).format('YYYY-MM-DD')}</td>
                                                                <td>
                                                                    {elem?.image?.status === 0 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : elem?.image?.status === 1 ? (
                                                                        <span className="custom-badge status-green">Approved</span>
                                                                    ) : (
                                                                        <span className="custom-badge status-pink">Rejected</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}

                                                        {commentsData?.length === 0 ? (
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