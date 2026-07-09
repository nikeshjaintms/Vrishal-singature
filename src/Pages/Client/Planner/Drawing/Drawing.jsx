import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PLAN, V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import DropDown from '../../../../Components/DropDown';
import moment from 'moment';
import Swal from 'sweetalert2';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Loader from '../../Include/Loader';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import { Modal } from 'react-bootstrap';
import { X } from 'lucide-react';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import { getProject } from '../../../../Store/Store/Project/Project';

const Drawing = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [entity, setEntity] = useState([]);
    const [show, setShow] = useState(false);
    const [drawIssue, setDrawIssue] = useState({
        name: "",
        date: "",
        _id: "",
    });
    const [selectedDrawings, setSelectedDrawings] = useState([]);
    const [minDate, setMinDate] = useState('');
    const [error, setError] = useState({});
    const [contractorData, setContractorData] = useState([]);

    // useEffect(() => {
    //     dispatch(getProject());
    //     if (disable === true) {
    //         getDrawing();
    //         setEntity([]);
    //     }
    // }, [navigate, disable, dispatch]);

    useEffect(() => {
    dispatch(getProject());
}, [dispatch]);

useEffect(() => {
    getDrawing();
}, [currentPage, limit, search]); // fetch data on pagination param change


    const projectData = useSelector((state) => state?.getProject?.user?.data);
    console.log("projectData",projectData);

    useEffect(() => {
        const findProject = projectData?.find(pro => pro?._id === localStorage.getItem('U_PROJECT_ID'));
        console.log("findProject",findProject);
        setContractorData(findProject?.contractor);
    }, [projectData]);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        // if (search) {
        //     computedComments = computedComments.filter(
        //         (draw) =>
        //             draw.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             draw.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             draw.assembly_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             draw.rev?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
        //             draw.sheet_no?.toLowerCase()?.includes(search?.toLowerCase())
        //     );
        // }
        // setTotalItems(computedComments?.length);

        const grouped = computedComments.reduce((acc, item) => {
            const key = `${item.drawing_no}-${item.unit}-${item.assembly_no}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        console.log('grouped',grouped);
        Object.keys(grouped).forEach(key => {
            const group = grouped[key];
            console.log('group',group);
            const maxRev = Math.max(...group.map(item => item.rev));
            group.forEach(item => {
                item.isMain = item.rev === maxRev;
            });
        });
        const flattenedData = Object.values(grouped).flat();
        console.log("flattenedData",flattenedData);
        // return flattenedData?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
        return flattenedData;

    }, [currentPage, search, limit, entity]);

    // const getDrawing = () => {
    //     const myurl = `${V_URL}/user/get-drawing`;
    //     axios({
    //         method: "get",
    //         url: myurl,
    //         headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    //     }).then((response) => {
    //         console.log(response.data, '@@');
    //         if (response.data.success === true) {
    //             const data = response.data.data;
    //             const filteredData = data?.filter(e => e?.project?._id === localStorage.getItem('U_PROJECT_ID'));
    //             setEntity(filteredData);
    //             setDisable(false);
    //         }
    //     }).catch((error) => {
    //         console.log(error, '!!');
    //         setDisable(false);
    //     });
    // }


const getDrawing = () => {
  const projectId = localStorage.getItem('U_PROJECT_ID');
  const myurl = `${V_URL}/user/get-drawing?page=${currentPage}&limit=${limit}&project=${projectId}&search=${search}`;
  
  axios({
    method: "get",
    url: myurl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
    },
  }).then((response) => {
    if (response.data.success === true) {
      const resData = response.data.data;
      const data = Array.isArray(resData) ? resData : resData?.data;
      const pagination = Array.isArray(resData) ? response.data.pagination : resData?.pagination;

      setEntity(data);
      setTotalItems(pagination?.total || 0);
      setDisable(false);
      
    }
  }).catch((error) => {
    console.log(error);
    setDisable(false);
  });
};




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
                const myurl = `${V_URL}/user/delete-drawing`;
                var bodyFormData = new URLSearchParams();
                bodyFormData.append("id", id);
                axios({
                    method: "delete",
                    url: myurl,
                    data: bodyFormData,
                    headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
                }).then((response) => {
                    // console.log(response.data, 'DEL')
                    if (response.data.success === true) {
                        toast.success(response?.data?.message);
                        setDisable(true);
                        getDrawing();
                    } else {
                        toast.error(response?.data?.message);
                    }
                }).catch((error) => {
                    toast.error("Something went wrong");
                    console?.log("Errors", error);
                });
            }
        });
    }

        const handleCheckboxChange = (id) => {
  setSelectedDrawings((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  );
};

    const handleSave = () => {
        if (validation()) {
            const myurl = `${V_URL}/user/issue-drawing`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('id', JSON.stringify(selectedDrawings));  // send as array in one field
            bodyFormData.append('issued_person', drawIssue.name);
            bodyFormData.append('issued_date', drawIssue.date);

            axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data?.success === true) {
                    toast.success(response?.data?.message);
                    setDrawIssue({
                        name: "",
                        date: "",
                    });
                    setSelectedDrawings([]);
                    setDisable(true);
                    getDrawing();
                }
                setShow(false);
            }).catch((error) => {
                console.log(error, '!!');
                toast.error(error.response?.data?.message);
            })
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = (id, elem) => {
        setDrawIssue((prev) => ({ ...prev, _id: id }));
        if (elem?.draw_receive_date) {
            const formattedMinDate = new Date(elem.draw_receive_date).toISOString().split("T")[0];
            setMinDate(formattedMinDate);
        }
        setShow(true);
    };

    const handleRefresh = () => {
        
        setDisable(true);

        setSearch('');
    }

    const handleDonwload = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('print_date', true);
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        PdfDownloadErp({ apiMethod: 'post', url: 'drawing-issue-download', body: bodyFormData });
    }

    const handleDownloadItems = (elem) => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', elem._id);
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: 'grid-wise-report', body: bodyFormData });
    }

    const handleChange = (e) => {
        setDrawIssue({ ...drawIssue, [e.target.name]: e.target.value });
    }

    const handleUploadPdf = async (e, id) => {
        const file = e?.target?.files[0];
        if (file) {
            const allowedTypes = ["application/pdf"];
            const fileType = file.type;

            if (allowedTypes.includes(fileType)) {
                setDisable(true);
                try {
                    const uploadedPdf = await uploadPdf(file);
                    if (uploadedPdf) {
                        await updateDrawing(uploadedPdf, id);
                    }
                } catch (error) {
                    console.log(error, 'Error uploading')
                    toast.error(error?.response?.data?.message || 'An error occurred');
                } finally {
                    setDisable(false);
                }
            } else {
                toast.error("Invalid file type. Only PDFs are allowed.");
            }
        }
    };

    const uploadPdf = async (file) => {
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        const response = await axios.post(`${V_URL}/upload-image`, bodyFormData);
        if (response.data.success) {
            return response.data.data.pdf;
        }
        throw new Error(response.data.message);
    };

    const updateDrawing = async (pdfUrl, id) => {
        const formData = new URLSearchParams();
        formData.append('drawing_pdf', pdfUrl);
        formData.append('id', id)
        const response = await axios.post(`${V_URL}/user/update-drawing`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
            },
        });
        if (response.data.success) {
            toast.success(response.data.message);
            setDisable(true);
        } else {
            throw new Error(response.data.message);
        }
    };

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!drawIssue?.name) {
            isValid = false;
            err['name_err'] = 'Please enter name';
        }
        if (!drawIssue?.date) {
            isValid = false;
            err['date_err'] = 'Please select date';
        }
        setError(err);
        return isValid;
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

                    {disable === false ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Drawing List</h3>
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
                                                                {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                                    <Link to="/user/project-store/manage-drawing"
                                                                        className="btn btn-primary add-pluss ms-2" data-toggle="tooltip" data-placement="top" title="Add"><img
                                                                            src="/assets/img/icons/plus.svg" alt="plus" /></Link>
                                                                }
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                                 {localStorage.getItem('ERP_ROLE') === PLAN && selectedDrawings.length > 0 && (
                                                                    <button 
                                                                    className="btn btn-primary w-50 ms-2" 
                                                                    onClick={() => handleShow(selectedDrawings)}
                                                                    >
                                                                    Issue Selected ({selectedDrawings.length})
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                                <thead>
                                                    <tr>
                                                        {localStorage.getItem('ERP_ROLE') === PLAN && <th> Select</th>}
                                                        <th>Sr.</th>
                                                        <th>Master Date</th>
                                                        <th>Drawing No.</th>
                                                        <th>Receive Date</th>
                                                        <th>Unit / Area</th>
                                                        <th>Rev</th>
                                                        <th>Sheet No.</th>
                                                        <th>Assem. No.</th>
                                                        <th>Assem. Qty.</th>
                                                        {/* {localStorage.getItem('ERP_ROLE') === PLAN && <th>Issue</th>} */}
                                                        <th>Issue Date</th>
                                                        <th>Issue To</th>
                                                        <th>PDF</th>
                                                        <th>Status</th>
                                                        <th className='text-end'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) =>
                                                        <tr key={elem?._id} className={!elem.isMain ? 'table-row-red' : ''}>
                                                             {localStorage.getItem('ERP_ROLE') === PLAN && 
                                                             <td>
                                                                <input type="checkbox"  checked={selectedDrawings.includes(elem._id)}   onChange={() => handleCheckboxChange(elem._id)}   />
                                                             </td>
                                                            }
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                            <td>{moment(elem?.master_updation_date).format('YYYY-MM-DD HH:mm')}</td>
                                                            <td>{elem?.drawing_no}</td>
                                                            <td>{moment(elem?.draw_receive_date).format('YYYY-MM-DD')}</td>
                                                            <td>{elem?.unit}</td>
                                                            <td>{elem?.rev}</td>
                                                            <td>{elem?.sheet_no}</td>
                                                            <td>{elem.assembly_no}</td>
                                                            <td>{elem.assembly_quantity}</td>
                                                            {/* {localStorage.getItem('ERP_ROLE') === PLAN && <td>
                                                                {elem?.status !== 2 ? (
                                                                    <a className='btn btn-primary' onClick={() => handleShow(elem?._id, elem)} >
                                                                        Issue
                                                                    </a>
                                                                ) : <X />}
                                                            </td>} */}
                                                            <td>{elem?.issued_date ? moment(elem?.issued_date).format('YYYY-MM-DD') : '-'}</td>
                                                            <td>{elem?.issued_person?.name ? elem?.issued_person?.name : '-'}</td>
                                                            <td>{elem?.drawing_pdf === '' ? (
                                                                <>
                                                                    <div className='add-group'>
                                                                        <input type="file" accept=".pdf" onChange={(e) => handleUploadPdf(e, elem?._id)} style={{ display: 'none' }} id={`upload-pdf-${elem?._id}`} />
                                                                        <label htmlFor={`upload-pdf-${elem?._id}`} className='btn btn-primary w-75'>
                                                                            {disable ? 'Uploading...' : 'Upload'}
                                                                        </label>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <a href={elem.drawing_pdf} target='_blank' rel="noreferrer">
                                                                    <img src='/assets/img/pdflogo.png' alt='draw-img' />
                                                                </a>
                                                            )}
                                                            </td>
                                                            <td className='status-badge'>
                                                                {elem.status === 1 ? (
                                                                    <span className="custom-badge status-orange">Pending</span>
                                                                ) : (
                                                                    <span className="custom-badge status-green">Completed</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="dropdown dropdown-action">
                                                                    <a href="#" className="action-icon dropdown-toggle"
                                                                        data-bs-toggle="dropdown" aria-expanded="false"><i
                                                                            className="fa fa-ellipsis-v"></i></a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-drawing', { state: elem })}><i
                                                                            className="fa-solid fa-pen-to-square m-r-5"></i>
                                                                            Edit</button>
                                                                        {localStorage.getItem('ERP_ROLE') === PLAN &&
                                                                            <button type='button' className="dropdown-item" onClick={() => handleDelete(elem?._id, elem.drawing_no)} ><i
                                                                                className="fa fa-trash-alt m-r-5"></i>
                                                                                Delete</button>}
                                                                        <button type='button' className="dropdown-item" onClick={() => handleDownloadItems(elem)} >
                                                                            <i className="fa-solid fa-download  m-r-5"></i> Download Drawing</button>
                                                                    </div>
                                                                </div>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loader />}
                </div>
                <Footer />
            </div>

            <Modal show={show} onHide={handleClose}
                backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Issue Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='material-section'>
                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Issue To <span className="login-danger">*</span> </label>
                            </div>
                            <div className="col-9">
                                <select className="form-control" value={drawIssue.name}
                                    name='name' onChange={handleChange}>
                                    <option vlaue=''>Select Contractor </option>
                                    {contractorData?.map((elem) =>
                                        <option value={elem?.conId._id} key={elem?.conId?._id}>{elem?.conId?.name}</option>
                                    )}
                                </select>
                                <div className='error'>{error.name_err}</div>
                            </div>
                        </div>
                        <div className="row align-items-center mt-2">
                            <div className="col-3">
                                <label className="col-form-label">Issue Date <span className="login-danger">*</span></label>
                            </div>
                            <div className="col-9">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={drawIssue.date ? new Date(drawIssue.date).toISOString().split("T")[0] : ""}
                                    name="date"
                                    onChange={handleChange}
                                    min={minDate}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                                <div className='error'>{error.date_err}</div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className='btn btn-primary' type='button' onClick={handleSave}>Save</button>
                </Modal.Footer>
            </Modal>

        </div >
    )
}

export default Drawing