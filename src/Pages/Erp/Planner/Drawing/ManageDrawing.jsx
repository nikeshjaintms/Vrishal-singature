import React, { useEffect, useState } from 'react'
import Sidebar from '../Include/Sidebar';
import Header from '../Include/Header';
import { ERP, PLAN, V_URL } from '../../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FileCheck, FileText, FileX, Pencil, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getUnit } from '../../../../Store/Store/StoreMaster/Unit/Unit';
import DrawFromValid from '../../../../Components/Validation/Draw/DrawFromValid';
import moment from 'moment';
import Swal from 'sweetalert2';
import { getUserProfile } from '../../../../Store/Store/Profile/Profile';

const ManageDrawing = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [error2, setError2] = useState({});
    const [draw, setDraw] = useState({
        project: "",
        po_no: "",
        drawing_no: "",
        lot_no: "",
        draw_receive_date: "",
        unit: "",
        rev: 0,
        assembly_no: "",
        grid: "",
        item_no: "",
        quantity: "",
        profile: "",
        length: "",
        item_weight: "",
        assembly_weight: "",
    });
    const [pdfVal, setPdfVal] = useState({
        name: "",
        pdf: "",
    });
    const [editIndex, setEditIndex] = useState(-1);
    const [disableMulti, setDisableMulti] = useState(false);
    const [pdfs, setPdfs] = useState([]);

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
    }, [navigate, disable]);

    const data = location.state;

    useEffect(() => {
        if (location.state) {
            setDraw({
                project: location.state?.project?._id,
                po_no: location.state?.po_no,
                drawing_no: location.state?.drawing_no,
                lot_no: location.state?.lot_no,
                draw_receive_date: moment(location.state?.draw_receive_date).format('YYYY-MM-DD'),
                unit: location.state?.unit?._id,
                rev: location.state?.rev,
                assembly_no: location.state?.assembly_no,
                grid: location.state?.grid_no,
                item_no: location.state?.item_no,
                quantity: location.state?.quantity,
                profile: location.state?.profile,
                length: location.state?.length,
                item_weight: location.state?.item_weight,
                assembly_weight: location.state?.assembly_weight,
            });

            setPdfs(location?.state?.drawing_images)
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise?.all([
                    dispatch(getUnit()),
                    dispatch(getUserProfile()),
                ]);
            } catch (error) {
                console.log(error, '!!')
            }
        }
        fetchData();
    }, [dispatch]);

    const unitData = useSelector((state) => state?.getUnit?.user?.data);
    const userData = useSelector((state) => state?.getUserProfile?.user?.data);


    const uploadSinglePdf = (e) => {
        if (e?.target?.files[0]) {

            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
            const fileType = e.target.files[0].type;
            if (allowedTypes.includes(fileType)) {
                setDisableMulti(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append("image", e?.target?.files[0]);
                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                }).then((response) => {
                    if (response.data.success === true) {
                        if (response.data.data.pdf) {
                            setPdfVal({ ...pdfVal, pdf: response.data.data.pdf })
                        } else if (response.data.data.image) {
                            setPdfVal({ ...pdfVal, pdf: response.data.data.image })
                        }
                    }
                    setDisableMulti(false);
                }).catch((error) => {
                    toast.error(error?.response?.data?.message)
                    setDisableMulti(false);
                })
            } else {
                setDisableMulti(false);
                toast.error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
            }
        }
    }

    const handleSave = () => {
        if (validation2()) {
            if (editIndex !== -1) {
                const updatedList = [...pdfs];
                updatedList[editIndex] = pdfVal;
                setPdfs(updatedList);
                setEditIndex(-1);
            } else {
                setPdfs([...pdfs, pdfVal]);
            }
            setPdfVal({ name: "", pdf: "" });
        }
    }

    const handleEdit = (index) => {
        setPdfVal(pdfs[index]);
        setEditIndex(index);
    }

    const handleChange = (e) => {
        setDraw({ ...draw, [e.target.name]: e.target.value });
    }

    const handleApprove = (drawId, status, title) => {
        Swal.fire({
            title: `Are you sure you want to ${status === 1 ? 'approve' : 'reject'} ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Yes, ${status === 1 ? 'approve' : 'reject'} it!`
        }).then((result) => {
            if (result.isConfirmed) {

                const myurl = `${V_URL}/user/change-drawing-status`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", data?._id);
                bodyFormData.append("drawingId", drawId);
                bodyFormData.append('status', status);

                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        setPdfs(prevPdfs => prevPdfs.map(pdf =>
                            pdf._id === drawId ? { ...pdf, status } : pdf
                        ));
                        // navigate('/erp/user/planner/drawing-management');
                    } else {
                        toast.error(response?.data?.message);
                    }
                }).catch((error) => {
                    toast.error(error.response.data?.message || "Something went wrong");
                    console?.log("Errors", error);
                });
            }
        })
    }

    const handleRemove = (i, title) => {
        Swal.fire({
            title: `Are you sure want to delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedPdfs = [...pdfs];
                updatedPdfs.splice(i, 1);
                setPdfs(updatedPdfs);
            }
        })
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'));
            bodyFormData.append('project', draw.project);
            bodyFormData.append('po_no', draw.po_no);
            bodyFormData.append('drawing_no', draw.drawing_no);
            bodyFormData.append('lot_no', draw.lot_no);
            bodyFormData.append('draw_receive_date', draw.draw_receive_date);
            bodyFormData.append('unit', draw.unit);
            bodyFormData.append('rev', draw.rev);
            bodyFormData.append('assembly_no', draw.assembly_no);
            bodyFormData.append('grid_no', draw.grid);
            bodyFormData.append('item_no', draw.item_no);
            bodyFormData.append('quantity', draw.quantity);
            bodyFormData.append('profile', draw.profile);
            bodyFormData.append('length', draw.length);
            bodyFormData.append('item_weight', draw.item_weight);
            bodyFormData.append('assembly_weight', draw.assembly_weight);
            bodyFormData.append('drawing_images', JSON.stringify(pdfs));
            if (data?._id) {
                bodyFormData.append('id', data?._id);
            }
            axios({
                method: 'post',
                url: `${V_URL}/user/manage-drawing`,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/erp/user/planner/drawing-management');
                }
                setDisable(false);
            }).catch((error) => {
                toast.error(error.response.data?.message);
                setDisable(false);
            });
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
        }
    }

    const handleReset = () => {
        setDraw({
            project: "",
            po_no: "",
            drawing_no: "",
            lot_no: "",
            draw_receive_date: "",
            unit: "",
            rev: "",
            assembly_no: "",
            grid: "",
            item_no: "",
            quantity: "",
            profile: "",
            length: "",
            item_weight: "",
            assembly_weight: "",
        })
    }
    const validation = () => {
        const { isValid, err } = DrawFromValid({ draw, pdfs });
        setError(err);
        return isValid;
    }
    const validation2 = () => {
        var isValid = true;
        let err = {};

        if (!pdfVal.name) {
            isValid = false;
            err['name_err'] = "Please enter pdf name";
        }
        if (!pdfVal.pdf) {
            isValid = false;
            err['pdf_err'] = "Please select pdf";
        }

        setError2(err);
        return isValid;
    }
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
                                    <li className="breadcrumb-item">
                                        <Link to="/erp/user/planner/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/erp/user/planner/drawing-management">Drawing List</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {data?._id ? "Edit" : "Add"} Drawing
                                    </li>
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
                                                <h4>{data?._id ? "Edit" : "Add"} Drawing Details</h4>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Project <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={draw.project}
                                                        onChange={handleChange} name='project'>
                                                        <option value="">Select Project</option>
                                                        {userData?.project?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.project_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> PO No. </label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="po_no" value={draw.po_no} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>
                                                        Drawing No. <span className="login-danger">*</span>
                                                    </label>
                                                    <input className="form-control" type="text"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="drawing_no" value={draw.drawing_no} />
                                                    <div className="error">{error.drawing_no_err}</div>
                                                </div>
                                            </div>


                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>LOT No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onChange={handleChange} name="lot_no" value={draw.lot_no} />
                                                    <div className="error">{error.lot_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Drawing Received Date <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="date"
                                                        onChange={handleChange} name="draw_receive_date" value={draw.draw_receive_date} />
                                                    <div className="error">{error.draw_receive_date_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Unit <span className="login-danger">*</span></label>
                                                    <select className="form-control select"
                                                        value={draw.unit}
                                                        onChange={handleChange} name='unit'>
                                                        <option value="">Select Unit</option>
                                                        {unitData?.map((e) => (
                                                            <option key={e._id} value={e._id}>
                                                                {e?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className='error'>{error.unit_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Item No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="item_no" value={draw.item_no} />
                                                    <div className="error">{error.item_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Quantity <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="quantity" value={draw.quantity} />
                                                    <div className="error">{error.quantity_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>REV <span className="login-danger">*</span>  </label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="rev" value={draw.rev} />
                                                    <div className="error">{error.rev_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Assembly No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="assembly_no" value={draw.assembly_no} />
                                                    <div className="error">{error.assembly_no_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Grid No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="grid" value={draw.grid} />
                                                    <div className="error">{error.grid_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Profile <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="profile" value={draw.profile} />
                                                    <div className="error">{error.profile_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Length(mm) <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="length" value={draw.length} />
                                                    <div className="error">{error.length_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Item Weight(Kg) <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="item_weight" value={draw.item_weight} />
                                                    <div className="error">{error.item_weight_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Assembly Weight(Kg) <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="assembly_weight" value={draw.assembly_weight} />
                                                    <div className="error">{error.assembly_weight_err}</div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">PDF Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text" onChange={(e) => setPdfVal({ ...pdfVal, name: e.target.value })} value={pdfVal.name} />
                                                    <div className='error'>{error2?.name_err}</div>
                                                </div>
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">PDF <span className="login-danger">*</span></label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                                        <input type="file" id="pdfFile" onChange={uploadSinglePdf} accept=".pdf" className="hide-input" />
                                                    </div>
                                                    <div className='error'>{error2?.pdf_err}</div>
                                                    <div className='error'>{error?.pdf_err}</div>
                                                </div>
                                                {pdfVal?.pdf ? (
                                                    <div>
                                                        {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                        <a href={pdfVal?.pdf} target='_blank' rel="noreferrer" style={{ cursor: "pointer" }}>
                                                            <FileText /> {pdfVal?.pdf ? pdfVal?.pdf?.split('/')?.pop() : 'PDF File'}
                                                        </a>
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className="col-12 col-md-4 col-xl-4 draw-main">
                                                <div className="input-block local-top-form">
                                                    <button type="button"
                                                        className="btn btn-primary draw-save" onClick={handleSave} disabled={disableMulti}>{disableMulti ? 'Processing...' : (editIndex !== -1 ? "Update" : "Save")}</button>
                                                </div>
                                            </div>

                                            <div className='col-12'>
                                                {pdfs?.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table border-0 custom-table comman-table mb-0">
                                                            <thead>
                                                                <tr>
                                                                    <th>Sr.</th>
                                                                    <th>Name</th>
                                                                    <th>Status</th>
                                                                    <th className="text-end">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {pdfs.map((e, i) =>
                                                                    <tr key={i}>
                                                                        <td>{i + 1}</td>
                                                                        <td>
                                                                            <a href={e?.pdf} target='_blank' rel="noreferrer" style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title="View">
                                                                                <FileText />
                                                                                {/* {e?.pdf ? e?.pdf?.split('/')?.pop() : 'PDF File'} */}
                                                                                {e?.name}
                                                                            </a>
                                                                        </td>
                                                                        <td className='status-badge'>
                                                                            {e?._id ? (
                                                                                <>
                                                                                    {e.status === 0 ? (
                                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                                    ) : e.status === 1 ? (
                                                                                        <span className="custom-badge status-green">Approved</span>
                                                                                    ) : (
                                                                                        <span className="custom-badge status-pink">Rejected</span>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                        <td className="justify-content-end d-flex">
                                                                            <a className="action-icon mx-1"
                                                                                style={{ cursor: "pointer" }} onClick={() => handleEdit(i)}> <Pencil />
                                                                            </a>
                                                                            {e?._id ? (
                                                                                <a className='action-icon mx-1' style={{ cursor: "pointer" }} onClick={() => handleApprove(e?._id, 1, e?.pdf?.split('/')?.pop())}
                                                                                    data-toggle="tooltip" data-placement="top" title="Approve"> <FileCheck color="#05bd9a" />
                                                                                </a>
                                                                            ) : null}
                                                                            {e?._id ? (
                                                                                <a className='action-icon mx-1' style={{ cursor: "pointer" }} onClick={() => handleApprove(e?._id, 2, e?.pdf?.split('/')?.pop())}
                                                                                    data-toggle="tooltip" data-placement="top" title="Reject"> <FileX color="#ff3131" />
                                                                                </a>
                                                                            ) : null}
                                                                            <a className="action-icon mx-1"
                                                                                style={{ cursor: "pointer" }} onClick={() => handleRemove(i, e?.name)}> <Trash2 />
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </form>
                                    <div className="col-12">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable || disableMulti}>{disable || disableMulti ? "Processing..." : (data?._id ? 'Update' : 'Submit')}</button>
                                            <button type="button"
                                                className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageDrawing