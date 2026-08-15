import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProject } from '../../../../../Store/Admin/Project/GetAdminProject';
import { GetProjectAttendance } from '../../../../../Store/Admin/Project/GetProjectAttendance';
import { MONTHS } from '../../../../../helper/MonthFile';

const ProjectAttendance = () => {
    const dispatch = useDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        project: '',
        month: ''
    });

    useEffect(() => {
        dispatch(getAdminProject());
    }, []);

    useEffect(() => {
        if (!formData?.project) return;
        const data = {
            project: formData.project,
            month: formData.month,
        };
        dispatch(GetProjectAttendance(data));
    }, [formData?.project, formData?.month]);

    const adminProjects = useSelector((state) => state?.getAdminProject?.user?.data) || [];
    const projectAttendanceData = useSelector((state) => state?.GetProjectAttendance?.user?.data) || [];

    const ProjectOptions = adminProjects?.map(project => ({
        label: project.name,
        value: project._id,
    }));

    const monthsOption = MONTHS.map((month, index) => ({
        label: month,
        value: (index + 1).toString(),
    }));

    const formDataChange = (e, name) => {
        setFormData({ ...formData, [name]: e.target.value });
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
                                    <li className="breadcrumb-item active">Project Attendance List</li>
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
                                                    <label> Projects.</label>
                                                    <Dropdown
                                                        options={ProjectOptions}
                                                        value={formData?.project}
                                                        filter onChange={(e) => formDataChange(e, 'project')}
                                                        placeholder='Select Project'
                                                        className='w-100'
                                                    />
                                                </div >
                                            </div >
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <div className="mx-2">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Months.</label>
                                                    <Dropdown
                                                        options={monthsOption}
                                                        value={formData?.month}
                                                        filter onChange={(e) => formDataChange(e, 'month')}
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

                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-6 col-xl-3">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Project Attendance List</h4>
                                    <div className="p-3">
                                        {projectAttendanceData?.length > 0 ? (
                                            <table className="table table-bordered">
                                                <tbody>
                                                    {projectAttendanceData?.map((e, i) => (
                                                        <tr key={i}>
                                                            <td className="fw-bold">{e?.name}</td>
                                                            <td className="text-primary fw-bold">{e?.count}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <h5 className="text-center my-2">DATA NOT FOUND</h5>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectAttendance;
