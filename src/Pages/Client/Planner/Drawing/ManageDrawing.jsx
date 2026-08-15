import React, { useEffect, useState } from 'react'
import { PLAN, V_URL } from '../../../../BaseUrl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import DrawFromValid from '../../../../Components/Validation/Draw/DrawFromValid';
import moment from 'moment';
import Swal from 'sweetalert2';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import DrawingModal from '../../../../Components/DrawingModal/DrawingModal';
import { useDispatch, useSelector } from 'react-redux';
import { getItem } from '../../../../Store/Store/Item/Item';
import DrawSectionTable from '../../../../Components/DrawingModal/DrawSectionTable';
import { clearDrawItems, getMultipleDrawItems } from '../../../../Store/MutipleDrawing/MultipleDrawing/MultipleDrawItems';

const ManageDrawing = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [disable, setDisable] = useState(false);
    const [disable3, setDisable3] = useState(false);
    const [error, setError] = useState({});
    const [show, setShow] = useState(false);
    const [draw, setDraw] = useState({
        drawing_no: "",
        draw_receive_date: "",
        unit: "",
        rev: 0,
        assembly_no: "",
        sheet_no: "",
        assembly_qty: "",
        pdf_url: "",
        pdf_name: ""
    });
    const [editData, setEditData] = useState({});
    const [finalId, setFinalId] = useState('');
    const data = location.state;

    useEffect(() => {
        dispatch(getItem({ is_main: false }));
    }, [navigate, disable, dispatch]);

    useEffect(() => {
        if (location.state) {
            setDraw({
                drawing_no: location.state?.drawing_no,
                draw_receive_date: moment(location.state?.draw_receive_date).format('YYYY-MM-DD'),
                unit: location.state?.unit,
                sheet_no: location.state.sheet_no,
                rev: location.state?.rev,
                assembly_no: location.state?.assembly_no,
                assembly_qty: location.state?.assembly_quantity,
                pdf_url: location.state?.drawing_pdf,
                pdf_name: location.state?.drawing_pdf_name,
            });
        }

        if (location.state?._id) {
            dispatch(getMultipleDrawItems({ id: location.state?._id }));
        } else if (finalId) {
            dispatch(getMultipleDrawItems({ id: finalId }));
        }

        return () => {
            dispatch(clearDrawItems());
        };
    }, [location.state, dispatch, finalId]);

    const refreshData = () => {
        dispatch(getMultipleDrawItems({ id: finalId || location.state?._id }));
    };

    const itemData = useSelector((state) => state?.getItem?.user?.data);
    const drawItemsData = useSelector((state) => state?.getMultipleDrawItems?.user?.data) || [];

    const handleChange = (e) => {
        setDraw({ ...draw, [e.target.name]: e.target.value });
    }
    const handleClose = () => setShow(false);
    const handleSave = () => {
        setShow(true);
    }

    const handlePdf = (e) => {
        if (e?.target?.files[0]) {
            const allowedTypes = ["application/pdf"];
            const fileType = e.target.files[0].type;
            if (allowedTypes.includes(fileType)) {
                setDisable(true);
                const myurl = `${V_URL}/upload-image`;
                var bodyFormData = new FormData();
                bodyFormData.append('image', e?.target?.files[0]);
                axios({
                    method: "post",
                    url: myurl,
                    data: bodyFormData,
                }).then((response) => {
                    if (response.data.success === true) {
                        const data = response?.data?.data?.pdf;
                        setDraw({ ...draw, pdf_url: data });
                    }
                    setDisable(false);
                }).catch((error) => {
                    console.log(error, '!!');
                    toast.error(error.response?.data?.message)
                })
            } else {
                toast.error("Invalid file type. Only PDFs are allowed.");
            }
        }
    }

    const handleSubmit = () => {
        if (validation()) {
            setDisable(true);
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('drawing_no', draw.drawing_no);
            bodyFormData.append('draw_receive_date', draw.draw_receive_date);
            bodyFormData.append('unit', draw.unit);
            bodyFormData.append('sheet_no', draw.sheet_no);
            bodyFormData.append('rev', draw.rev);
            bodyFormData.append('assembly_no', draw.assembly_no);
            bodyFormData.append('assembly_quantity', draw.assembly_qty);
            bodyFormData.append('drawing_pdf_name', draw.pdf_name);
            bodyFormData.append('drawing_pdf', draw.pdf_url);
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
                    setFinalId(response.data.data._id);

                    if (data?._id) {
                        navigate('/user/project-store/drawing-management');
                    }
                }
                setDisable(false);
                setDisable3(true);
            }).catch((error) => {
                toast.error(error?.response?.data?.message);
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
            drawing_no: "",
            draw_receive_date: "",
            unit: "",
            rev: 0,
            assembly_no: "",
            sheet_no: "",
            assembly_qty: "",
            pdf_url: "",
            pdf_name: ""
        })
        setError("")
    }

    const handleSaveModal = (drawData, addMore, gridId) => {
        const myurl = `${V_URL}/user/manage-grid-items`;
        const bodyFormData = new URLSearchParams();
        if (data?._id) {
            bodyFormData.append('drawing_id', data?._id);
        } else {
            bodyFormData.append('drawing_id', finalId);
        }
        if (drawData?._id) {
            bodyFormData.append('id', drawData?._id);
        }
        bodyFormData.append('item_no', drawData.itemNo);
        bodyFormData.append('item_name', drawData.itemName);
        bodyFormData.append('item_qty', drawData.qty);
        bodyFormData.append('item_length', drawData.length);
        bodyFormData.append('item_width', drawData.width);
        bodyFormData.append('item_weight', drawData.itemWeight);
        bodyFormData.append('assembly_weight', drawData.assemblyWeight);
        bodyFormData.append('assembly_surface_area', drawData.assemblySurface);
        bodyFormData.append('grid_id', gridId);
        bodyFormData.append('joint_type', JSON.stringify(drawData.joint_type));
        axios({
            method: 'post',
            url: myurl,
            data: bodyFormData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then((response) => {
            if (response.data.success === true) {
                toast.success(response.data.message);
            }
            refreshData();
            if (!addMore) {
                handleClose();
            }
        }).catch((error) => {
            console.log(error, '!!!');
            toast.error(error.response.data.message)
        });
    }

    const handleEdit = (editData) => {
        setEditData(editData);
        refreshData();
        setShow(true);
    }

    const handleDelete = (id, title) => {
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
                // const myurl = `${V_URL}/user/delete-transaction-item`;
                const myurl = `${V_URL}/user/delete-grid-items`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);
                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                }).then((response) => {
                    if (response.data.success === true) {
                        toast.success(response?.data?.message)
                    }
                    refreshData();
                }).catch((error) => {
                    toast.error(error?.response?.data?.message || "Something went wrong");
                })
            }
        })
    }

    const generateDrawing = () => {
        const AssQty = draw.assembly_qty;
        const uniqueGrids = Array.from(new Map(drawItemsData?.map(item => [item.grid_id.grid_no, {
            grid_no: item.grid_id.grid_no,
            id: item._id,
            qty: item.grid_id.grid_qty
        }]))?.values());

        const totalGridQty = uniqueGrids.reduce((sum, grid) => sum + grid.qty, 0);

        if (totalGridQty < AssQty) {
            toast.error("Error: Total Grid Quantity is lower than Assembly Quantity");
        } else if (totalGridQty > AssQty) {
            toast.error("Error: Total Grid Quantity is higher than Assembly Quantity");
        } else {
            toast.success("Grid Quantity matches Assembly Quantity");
            navigate('/user/project-store/drawing-management')
        }
    }

    const validation = () => {
        const { isValid, err } = DrawFromValid({ draw });
        setError(err);
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
                                        <Link to="/user/project-store/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/user/project-store/drawing-management">Drawing List</Link>
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

                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>  Drawing No. <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="drawing_no" value={draw.drawing_no} />
                                                    <div className="error">{error.drawing_no_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Drawing Received Date <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="date"
                                                        onChange={handleChange} name="draw_receive_date" value={draw.draw_receive_date}
                                                        max={new Date().toISOString().split("T")[0]} />
                                                    <div className="error">{error.draw_receive_date_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Unit / Area <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="unit" value={draw.unit} />
                                                    <div className='error'>{error.unit_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>REV </label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="rev" value={draw.rev} />
                                                    <div className="error">{error.rev_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>Sheet No. <span className="login-danger">*</span>  </label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange} name="sheet_no" value={draw.sheet_no} />
                                                    <div className="error">{error.sheet_no_err}</div>
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
                                                    <label>Assembly Qty. (NOS) <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="number"
                                                        onWheel={(e) => e.target.blur()} onKeyDown={handleKeyDown}
                                                        onChange={handleChange} name="assembly_qty" value={draw.assembly_qty} />
                                                    <div className="error">{error.assembly_qty_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">PDF Name <span className="login-danger">*</span></label>
                                                    <input className="form-control" type="text"
                                                        onChange={handleChange}
                                                        name='pdf_name' value={draw.pdf_name} />
                                                    <div className='error'>{error.pdf_name_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-top-form">
                                                    <label className="local-top">PDF <span className="login-danger">*</span></label>
                                                    <div className="settings-btn upload-files-avator">
                                                        <label htmlFor="pdfFile" className="upload">Choose PDF File(s)</label>
                                                        <input type="file" id="pdfFile" onChange={handlePdf} accept=".pdf" className="hide-input" />
                                                    </div>
                                                    <div className='error'>{error.pdf_url_err}</div>
                                                    {draw.pdf_url ? (
                                                        <a href={draw.pdf_url} target='_blank' rel="noreferrer">
                                                            <img src='/assets/img/pdflogo.png' alt='draw-pdf' />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        {localStorage.getItem('ERP_ROLE') === PLAN &&
                                            <div className="col-12 text-end">
                                                <div className="doctor-submit text-end">
                                                    <button type="button"
                                                        className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={(disable || disable3) && !(data?._id && finalId)}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Next and Continue')}</button>
                                                    <button type="button"
                                                        className="btn btn-primary cancel-form" onClick={handleReset}>Reset</button>
                                                </div>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <DrawSectionTable
                                handleSave={handleSave}
                                transactionData={drawItemsData}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                                finalId={finalId}
                                dataId={data?._id}
                                fetchTransactionData={() => refreshData()}
                            />
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={generateDrawing}>Generate</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
            <DrawingModal
                show={show}
                handleClose={handleClose}
                itemData={itemData}
                handleSaveModal={handleSaveModal}
                editData={editData}
                drawId={finalId || data?._id}
                finalId={finalId}
            />
        </div>
    )
}

export default ManageDrawing