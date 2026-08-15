import React, { useState } from 'react'
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Include/Footer';
import moment from 'moment';

const ViewReleaseNote = () => {

    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/release-note-management">Release Note For Site Dispatch List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Release Note Details</li>
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
                                                <h4>Release Note Details</h4>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Drawing No. </label>
                                                    <input className="form-control" type="text" value={data?.drawing_id?.drawing_no} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Assembly No. </label>
                                                    <input className="form-control" type="text" value={data?.drawing_id?.assembly_no} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Sheet No. </label>
                                                    <input className="form-control" type="text" value={data?.drawing_id?.sheet_no} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Rev No. </label>
                                                    <input className="form-control" type="text" value={data?.drawing_id?.rev} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Inspection. </label>
                                                    <input className="form-control" type="text" value={data?.inspection_summary_id?.report_no} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Prepare By. </label>
                                                    <input className="form-control" type="text" value={data?.prepared_by?.user_name} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Surafce. </label>
                                                    <input className="form-control" type="text" value={data?.surafce_primer_report_id?.voucher_no_two} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> MIO. </label>
                                                    <input className="form-control" type="text" value={data?.mio_paint_report_id?.voucher_no_two} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Final Coat. </label>
                                                    <input className="form-control" type="text" value={data?.final_coat_paint_report_id?.voucher_no_two} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Report. </label>
                                                    <input className="form-control" type="text" value={data?.report_no} readOnly />
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms">
                                                    <label> Date. </label>
                                                    <input className="form-control" type="text" value={moment(data?.release_date).format('YYYY-MM-DD')} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12 col-md-12 col-xl-12">
                                                <div className="input-block local-forms">
                                                    <label> Remark. </label>
                                                    <textarea className="form-control" value={data?.remarks} readOnly />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="doctor-submit text-end">
                                                <button type="button" className="btn btn-primary submit-form me-2"
                                                    onClick={() => navigate('/piping/user/release-note-management')} >
                                                    Back
                                                </button>
                                            </div>
                                        </div>
                                    </form>
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

export default ViewReleaseNote