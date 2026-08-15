import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
const moment = require("moment");
const ViewGenReleaseNote = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, setTableData] = useState([]);
    const data = location.state;
console.log("data gen----=========>", data);
  useEffect(() => {
    if (data?.drawingData) {
        setTableData([data.drawingData]);  // ✅ wrap in array
    }
}, [data]);

const commentsData = useMemo(() => {
    if (!tableData?.length) return [];

    const lhs = tableData[0];
    let rows = [];

    lhs?.drawings?.forEach((drawing, dIndex) => {

        const drawingInfo = lhs?.drawing_details?.find(
            (d) => d._id === drawing?.drawing_id
        );

        drawing?.spools?.forEach((spool) => {

            const spoolInfo = lhs?.spool_details?.find(
                (s) => s._id === spool?.spool_no_id
            );

            spool?.joints?.forEach((joint) => {

                rows.push({
                    drawing_no: drawingInfo?.drawing_no,
                    rev: drawingInfo?.rev,
                    sheet_no: joint?.joint_details?.sheet_no,

                    spool_no: spoolInfo?.spool_no,
                    joint_no: joint?.joint_details?.joint_no,
                    size: joint?.joint_details?.size,
                    thickness: joint?.joint_details?.thickness,
                    joint_type: joint?.joint_details?.joint_type,
 material_specification: lhs?.service_data?.PipingMaterialSpecification,
                    fit_up_report_no_two: joint?.fitup?.report_no,
                    fit_up_qc_time: joint?.fitup?.qc_date,
wps_no:joint?.fitup?.wps_no,
welder_no:joint?.weld_visual?.welder_no,

                    weld_visual_report_no_two: joint?.weld_visual?.report_no,
                    weld_visual_qc_time: joint?.weld_visual?.qc_date,

                    ferrite_report_no: joint?.ferrite?.report_no,
                    ferrite_qc_time: joint?.ferrite?.qc_date,

                    bsr_report_no: joint?.bsrrt?.report_no,
                    bsr_qc_time: joint?.bsrrt?.qc_date,

                    pwht_report_no_two: joint?.pwht?.report_no,
                    pwht_qc_time: joint?.pwht?.qc_date,

                    rt_lot_number: joint?.rt_lot?.lot_no,
                    rt_percentage: joint?.rt_lot?.rt_percentage,

                    asr_rt_report_no: joint?.asrrt?.report_no,
                    asr_rt_qc_time: joint?.asrrt?.qc_date,

                    rt_report_no: joint?.rt?.report_no,
                    rt_qc_time: joint?.rt?.qc_date,

                    lpt_lot_number: joint?.lpt_lot?.lot_no,
                    lpt_percentage: joint?.lpt_lot?.lpt_percentage,

                    lpt_report_no_two: joint?.lpt?.report_no,
                    lpt_qc_time: joint?.lpt?.qc_date,

                    mpt_lot_number: joint?.mpt_lot?.lot_no,
                    mpt_percentage: joint?.mpt_lot?.mpt_percentage,

                    mpt_report_no_two: joint?.mpt?.report_no,
                    mpt_qc_time: joint?.mpt?.qc_date,

                    hardness_report_no: joint?.hardness?.report_no,
                    hardness_qc_time: joint?.hardness?.qc_date,
                     pmi_report_no: joint?.pmi?.report_no,
                    pmi_qc_time: joint?.pmi?.qc_date,
                    
                     pickling_report_no: joint?.pickling?.report_no,
                    pickling_qc_time: joint?.pickling?.qc_date,

                    fd_report_no_two: joint?.final_dimension?.report_no,
                    fd_qc_time: joint?.final_dimension?.qc_date,

                    remarks: "-"
                });

            });

        });

    });

    if (search) {
        rows = rows.filter((row) =>
            row?.drawing_no?.toLowerCase().includes(search.toLowerCase())
        );
    }

    setTotalItems(rows.length);

    return rows;

}, [tableData, search]);

    console.log("commentsData ----==========>",commentsData);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Line History Sheet List", link: "/piping/user/line-history-management", active: false },
                        { name: `View Line History Sheet Details`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>View Generated Line History Sheet Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>View Line History Sheet List <span className="login-danger">*</span></label>
                                                    <input value={data?.drawingData?.report_no} className='form-control' readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">

                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>View Generated Line History Sheet List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    setCurrentPage(1);
                                                                }} />
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="table-responsive mt-2">
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Line No. / Drawing No.</th>
                                                    <th>Rev No.</th>
                                                    <th>Sheet No.</th>
                                                    <th>Piping Material Specification</th>
                                                    <th>Spool No.</th>
                                                    <th>Joint No.</th>
                                                    <th>Size</th>
                                                    <th>Thickness</th>
                                                    <th>Joint Type</th>
                                                    <th>Fit-up Report</th>
                                                    <th>Fit-up Date</th>
                                                    <th>WPS No.</th>
                                                    <th>Welder No.</th>
                                                    <th>Weld Visual Report</th>
                                                    <th>Weld Visual Date</th>
                                                    <th>BSR Report</th>
                                                    <th>BSR Date</th>
                                                    <th>Ferrite Report</th>
                                                    <th>Ferrite Date</th>
                                                    <th>PWHT Report</th>
                                                    <th>PWHT Date</th>
                                                    <th>RT Lot No.</th>
                                                    <th>RT %</th>
                                                    <th>ASR Report</th>
                                                    <th>ASR Date</th>
                                                     <th>RT Report</th>
                                                    <th>RT Date</th>
                                                    <th>LPT Lot No.</th>
                                                    <th>LPT %</th>
                                                    <th>LPT Report</th>
                                                    <th>LPT Date</th>
                                                    <th>MPT Lot No.</th>
                                                    <th>MPT %</th>
                                                    <th>MPT Report</th>
                                                    <th>MPT Date</th>
                                                    <th>Hardness Report</th>
                                                    <th>Hardness Date</th>
                                                    <th>PMI Report</th>
                                                    <th>PMI Date</th>
                                                    <th>Pickling Report</th>
                                                    <th>Pickling Date</th>
                                                    <th>Final Dimension Report</th>
                                                    <th>Final Dimension Date</th>
                                                    <th>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { commentsData?.map((elem, i) => (
                                                        <tr key={i}>
                                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                                           <td>{elem?.drawing_no}</td>
        <td>{elem?.rev}</td>
        <td>{elem?.sheet_no}</td>
        <td>{elem?.material_specification}</td>
        <td>{elem?.spool_no}</td>
        <td>{elem?.joint_no}</td>
        <td>{elem?.size}</td>
        <td>{elem?.thickness}</td>
        <td>{elem?.joint_type}</td>
       
        <td>{elem?.fit_up_report_no_two}</td>
        <td>
  {elem?.fit_up_qc_time
    ? moment(elem.fit_up_qc_time).format("DD/MM/YYYY")
    : ""}
</td>
  <td>{elem?.wps_no}</td>
        <td>{elem?.welder_no}</td>
  <td>{elem?.weld_visual_report_no_two}</td>
        <td>
  {elem?.weld_visual_qc_time
    ? moment(elem.weld_visual_qc_time).format("DD/MM/YYYY")
    : ""}
</td>
<td>{elem?.bsr_report_no}</td>
<td>{elem?.bsr_qc_time ? moment(elem.bsr_qc_time).format("DD/MM/YYYY") : ""}</td>
        <td>{elem?.ferrite_report_no}</td>
<td>{elem?.ferrite_qc_time ? moment(elem.ferrite_qc_time).format("DD/MM/YYYY") : ""}</td>
  <td>{elem?.pwht_report_no_two}</td>
        <td>
  {elem?.pwht_qc_time
    ? moment(elem.pwht_qc_time).format("DD/MM/YYYY")
    : ""}</td>
<td>{elem?.rt_lot_number}</td>
<td>{elem?.rt_percentage}</td>
        <td>{elem?.asr_rt_report_no}</td>
<td>{elem?.asr_rt_qc_time ? moment(elem.asr_rt_qc_time).format("DD/MM/YYYY") : ""}</td>
        <td>{elem?.rt_report_no}</td>
<td>{elem?.rt_qc_time ? moment(elem.rt_qc_time).format("DD/MM/YYYY") : ""}</td>
        <td>{elem?.lpt_lot_number}</td>
          <td>{elem?.lpt_percentage}</td>
         
  <td>{elem?.lpt_report_no_two}</td>
        <td>
  {elem?.lpt_qc_time
    ? moment(elem.lpt_qc_time).format("DD/MM/YYYY")
    : ""}
</td>
<td>{elem?.mpt_lot_number}</td>
<td>{elem?.mpt_percentage}</td>
<td>{elem?.mpt_report_no_two}</td>
<td>{elem?.mpt_qc_time ? moment(elem.mpt_qc_time).format("DD/MM/YYYY") : ""}</td>
       <td>{elem?.hardness_report_no}</td>
<td>{elem?.hardness_qc_time ? moment(elem.hardness_qc_time).format("DD/MM/YYYY") : ""}</td>
         <td></td>
        <td></td>
         <td></td>
        <td></td>
        
  <td>{elem?.fd_report_no_two}</td>
        <td>
  {elem?.fd_qc_time
    ? moment(elem.fd_qc_time).format("DD/MM/YYYY")
    : ""}
</td>

                                                            <td>{elem?.remarks || "-"}</td>
                                                        </tr>
                                                    
                                                ))}
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* <div className="row align-center mt-3 mb-2">
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
                                    </div> */}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button type="button"
                                                className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/line-history-management')}>Back</button>
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

export default ViewGenReleaseNote