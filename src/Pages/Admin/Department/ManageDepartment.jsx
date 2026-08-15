import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { addDepartment } from '../../../Store/Admin/Payroll/Department/ManageDepartment';
import { getAdminGroup } from '../../../Store/Admin/Payroll/Group/AdminGroup';

const ManageDepartment = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [department, setDepartment] = useState({
        name: '',
        group: ''
    });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState('');
    const data = location.state;
// console.log(data,'data?????');

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        dispatch(getAdminGroup());
    }, [dispatch, navigate]);

    useEffect(() => {
        if (location.state) {
            setDepartment({
                name: location.state?.name,
                group: location.state?.group?._id,
            });
            setSelectValue(location.state?.status);
        }
    }, [location.state]);

    const groupData = useSelector((state) => state.getAdminGroup?.user?.data);
    const handleRadioChange = (event) => {
        setSelectValue(event.target.checked);
    };

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true)
            const formData = new URLSearchParams();

            formData.append('name', department.name);
            formData.append('group', department.group);
            if (data?._id) {
                formData.append('id', data?._id);
                formData.append('status', selectValue);
            }

            dispatch(addDepartment(formData)).then((res) => {
                if (res.payload.success === true) {
                    navigate('/admin/department-management');
                    handleReset();
                }
                setDisable(false)
            }).catch((error) => {
                setDisable(false)
            })
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};

        if (!department.name || !department.name?.trim()) {
            isValid = false;
            err['department_err'] = "Please enter department name"
        }

        if(!department.group){
            isValid = false;
            err['group_err'] = "Please select a group"
        }

        setError(err);
        return isValid;

    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleChange = (e) => {
        setDepartment({...department,[e.target.name]: e.target.value});
    }

    const handleReset =  () =>{
        setDepartment({
            name:'',
            group:'',
        });
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
                                    <li className="breadcrumb-item"><Link to="/admin/department-management">Department List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Department</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Department Details</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" name='name'
                                                        onChange={handleChange} value={department.name}
                                                    />
                                                    <div className='error'>{error.department_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                            <div className="input-block local-forms">
                                                    <label> Group <span className="login-danger">*</span></label>
                                                    <select className="form-select"
                                                        onChange={handleChange} name='group' value={department.group}>
                                                        <option value="">Select group</option>
                                                        {groupData?.map((e) =>
                                                            <option value={e?._id} key={e?._id}>{e?.name}</option>
                                                        )}
                                                    </select>
                                                    <div className="error">{error.group_err} </div>
                                                </div>
                                            </div>

                                            {data?._id ? (
                                                <div className='col-12 col-md-4 col-xl-4'>
                                                    <div className="cardNum">
                                                        <div className="mb-3">
                                                            <label htmlFor="fileUpload" className="form-label">Status</label>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" role="switch" onChange={handleRadioChange} checked={selectValue} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}

                                        </div>
                                    </form>
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                            <button type="button"
                                                className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                        </div>
                                    </div>
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

export default ManageDepartment