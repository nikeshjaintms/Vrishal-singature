import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import moment from 'moment';
import { FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItemData } from '../../../Store/Admin/Item/getAdminItem';

const ViewRequest = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;

   

    useEffect(() => {
        if (localStorage.getItem('VA_TOKEN') === null) {
            navigate("/admin/login");
        }
        dispatch(getAdminItemData());
    }, [navigate, dispatch]);

    const itemData = useSelector((state) => state?.getAdminItemData?.user?.data);

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
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/admin/verify-request-management">Material PO NO List </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">View Material PO NO</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="form-heading">
                                            <h4>View Material PO NO Details</h4>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        {[
                                            { label: 'Firm', value: data?.firm_id?.name },
                                            { label: 'Year', value: `${moment(data?.year_id?.start_year).format('YYYY-MM-DD')} / ${moment(data?.year_id?.end_year).format('YYYY-MM-DD')}` },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>{label}</label>
                                                    <input className="form-control" value={value} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="row">
                                        {[
                                            { label: 'Request No.', value: data?.requestNo },
                                            { label: 'Project', value: data?.project?.name },
                                            { label: 'Project Location', value: data?.storeLocation?.name },
                                            { label: 'Request Date', value: moment(data?.requestDate).format('YYYY-MM-DD') },
                                            { label: 'Material PO No.', value: data?.material_po_no },
                                            { label: 'Department', value: data?.department?.name },
                                            { label: 'Prepared By', value: data?.preparedBy?.user_name },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label>{label}</label>
                                                    <input className="form-control" value={value} readOnly />
                                                </div>
                                            </div>
                                        ))}
                                        <div className='col-12 col-md-4 col-xl-4'>
                                            <div className="input-block local-forms">
                                                <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                                                {data.status === 1 ? (
                                                    <span className="custom-badge status-orange">Pending</span>
                                                ) : (
                                                    <span className="custom-badge status-green">Completed</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="form-heading">
                                            <h4>View Section Details</h4>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Section Details</th>
                                                    <th>Quantity</th>
                                                    <th>MCode</th>
                                                    <th>Manufacturer</th>
                                                    <th>Supplier</th>
                                                    <th>Unit / Total Rate</th>
                                                    <th>Remarks</th>
                                                    <th>Store</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data?.items?.map((elem, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{elem?.itemName?.name}</td>
                                                        <td>{elem?.quantity}</td>
                                                        <td>{elem?.mcode}</td>
                                                        <td>{elem?.preffered_supplier?.map((e, i) => <p key={i}>{e?.supId?.name}</p>)}</td>
                                                        <td>{elem?.main_supplier?.name}</td>
                                                        <td>{elem?.unit_rate} / {elem?.total_rate}</td>
                                                        <td>{elem?.remarks === '' ? '-' : elem?.remarks}</td>
                                                        <td>
                                                            {elem?.store_type === 1 ? (
                                                                <span className='custom-badge status-purple'>Main Store</span>
                                                            ) : (
                                                                <span className='custom-badge status-purple'>Project Store</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}

                                                {data?.items?.length === 0 ? (
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {data?.drawing_id !== null ? (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Drawing Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {[
                                                { label: 'Master Updation Date', value: moment(data?.drawing_id?.master_updation_date).format('YYYY-MM-DD') },
                                                { label: 'Drawing No.', value: data?.drawing_id?.drawing_no },
                                                { label: 'Drawing Receive Date', value: moment(data?.drawing_id?.draw_receive_date).format('YYYY-MM-DD') },
                                                { label: 'Unit', value: data?.drawing_id?.unit },
                                                { label: 'REV', value: data?.drawing_id?.rev },
                                                { label: 'Sheet No.', value: data?.drawing_id?.sheet_no },
                                                { label: 'Assembly No.', value: data?.drawing_id?.assembly_no },
                                                { label: 'Assembly Quantity', value: data?.drawing_id?.assembly_quantity },
                                                { label: 'Issued Date', value: moment(data?.drawing_id?.issued_date).format('YYYY-MM-DD') },
                                                { label: 'Issued To', value: data?.drawing_id?.issued_person?.name },
                                            ].map(({ label, value }) => (
                                                <div key={label} className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms">
                                                        <label>{label}</label>
                                                        <input className="form-control" value={value} readOnly />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <a href={data?.drawing_id?.drawing_pdf} className='d-flex' target='_blank' rel="noreferrer" style={{ cursor: "pointer" }}>
                                                    <img src='/assets/img/pdflogo.png' /> <p>val{data?.drawing_id?.drawing_pdf_name}</p>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="table-responsive mt-4">
                                            <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.</th>
                                                        <th>Section Details</th>
                                                        <th>Grid No.</th>
                                                        <th>Item No.</th>
                                                        <th>Qty.</th>
                                                        <th>Length(mm)</th>
                                                        <th>Width(mm)</th>
                                                        <th>Item Weight(kg)	</th>
                                                        <th>Assem. Weight(kg)</th>
                                                        <th>ASM(sqm)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data?.drawing_id?.items?.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{elem?.itemName?.name}</td>
                                                            <td>{elem?.grid_no}</td>
                                                            <td>{elem?.item_no}</td>
                                                            <td>{elem?.quantity}</td>
                                                            <td>{elem?.item_length}</td>
                                                            <td>{elem?.item_width}</td>
                                                            <td>{elem?.item_weight}</td>
                                                            <td>{elem?.assembly_weight}</td>
                                                            <td>{elem?.assembly_surface_area}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ViewRequest