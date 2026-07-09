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
console.log("data----=========>", data);
useEffect(() => {
    if (data) {
        setTableData([data]);   // wrap object into array
    }
}, [data]);
  const commentsData = useMemo(() => {
    if (!tableData?.length) return [];

    const drawing = tableData[0]; 

    let rows = [];

    drawing?.spool_wise?.forEach((spool) => {
        spool?.material_items?.forEach((joint) => {
            rows.push({
                drawing_no: drawing?.drawing_no,
                rev: drawing?.rev,
                sheet_no: joint?.sheet_no,
                piping_material_spec:
                drawing?.service_data?.PipingMaterialSpecification,
                spool_no: spool?.spool_no,
                joint_no: joint?.joint_no,
                size: joint?.selected_size?.name,
                thickness: joint?.selected_thickness?.name,
                joint_type: joint?.joint_type?.name,
                fit_up_report_no_two:joint?.fit_up_report_no_two,
                fit_up_qc_time:joint?.fit_up_qc_time,
                wps_no: joint?.wps_no,
                 root_dpt_report_no_two:joint?.root_dpt_report_no_two,
                root_dpt_qc_time:joint?.root_dpt_qc_time,
                welder_no: joint?.welder_no,
                weld_visual_report_no_two:joint?.weld_visual_report_no_two,
                weld_visual_qc_time:joint?.weld_visual_qc_time,
                   ferrite_report_no_two:joint?.ferrite_report_no_two,
                ferrite_qc_time:joint?.ferrite_qc_time,
                 pwht_report_no_two:joint?.pwht_report_no_two,
                pwht_qc_time:joint?.pwht_qc_time,
                
                bsrrt_report_no_two:joint?.bsrrt_report_no_two,
                bsrrt_qc_time:joint?.bsrrt_qc_time,

                asrrt_report_no_two:joint?.asrrt_report_no_two,
                asrrt_qc_time:joint?.asrrt_qc_time,

                 rt_percentage:joint?.rt_percentage,
                rt_lot_number:joint?.rt_lot_number,
                rt_report_no_two:joint?.rt_report_no_two,
                rt_qc_time:joint?.rt_qc_time,

                 mpt_percentage:joint?.mpt_percentage,
                mpt_lot_number:joint?.mpt_lot_number,
                mpt_report_no_two:joint?.mpt_report_no_two,
                mpt_qc_time:joint?.mpt_qc_time,

                lpt_percentage:joint?.lpt_percentage,
                lpt_lot_number:joint?.lpt_lot_number,
                lpt_report_no_two:joint?.lpt_report_no_two,
                lpt_qc_time:joint?.lpt_qc_time,

                   ht_report_no_two:joint?.ht_report_no_two,
                ht_qc_time:joint?.ht_qc_time,

                   pmi_report_no_two:joint?.pmi_report_no_two,
                pmi_qc_time:joint?.pmi_qc_time,

                   pickling_report_no_two:joint?.pickling_report_no_two,
                pickling_qc_time:joint?.pickling_qc_time,

                fd_report_no_two:joint?.fd_report_no_two,
                fd_qc_time:joint?.fd_qc_time,
                remarks: drawing?.remarks || "-"
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
                                                <h4>View Line History Sheet Details</h4>
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
                                                    <h3>View Line History Sheet List</h3>
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
                                                     <th>Root Dpt Report</th>
                                                    <th>Root Dpt Date</th>
                                                    <th>Welder No.</th>
                                                    <th>Weld Visual Report</th>
                                                    <th>Weld Visual Date</th>
                                                    <th>BSR Report</th>
                                                    <th>BSR Date</th>
                                                    <th>Ferrite Report</th>
                                                    <th>Ferrite Date</th>
                                                    <th>PWHT Report</th>
                                                    <th>PWHT Date</th>
                                                      <th>ASR Report</th>
                                                    <th>ASR Date</th>
                                                    <th>RT Lot No.</th>
                                                    <th>RT %</th>
                                                    <th>RT Report</th>
                                                    <th>RT Date</th>
                                                   
                                                    <th>MPT Lot No.</th>
                                                    <th>MPT %</th>
                                                    <th>MPT Report</th>
                                                    <th>MPT Date</th>
                                                     <th>LPT Lot No.</th>
                                                    <th>LPT %</th>
                                                    <th>LPT Report</th>
                                                    <th>LPT Date</th>
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
        <td>{elem?.piping_material_spec}</td>
        <td>{elem?.spool_no}</td>
        <td>{elem?.joint_no}</td>
        <td>{elem?.size}</td>
        <td>{elem?.thickness}</td>
        <td>{elem?.joint_type}</td>
       
        <td>{elem?.fit_up_report_no_two}</td>
        <td>
  {elem?.fit_up_qc_time
    ? moment(elem.fit_up_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
  <td>{elem?.wps_no}</td>
    <td>{elem?.root_dpt_report_no_two}</td>
        <td>
  {elem?.root_dpt_qc_time
    ? moment(elem.root_dpt_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
        <td>{elem?.welder_no}</td>
  <td>{elem?.weld_visual_report_no_two}</td>
        <td>
  {elem?.weld_visual_qc_time
    ? moment(elem.weld_visual_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
   <td>{elem?.bsrrt_report_no_two}</td>
        <td>
  {elem?.bsrrt_qc_time
    ? moment(elem.bsrrt_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
         <td>{elem?.ferrite_report_no_two}</td>
        <td>
  {elem?.ferrite_qc_time
    ? moment(elem.ferrite_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
  <td>{elem?.pwht_report_no_two}</td>
        <td>
  {elem?.pwht_qc_time
    ? moment(elem.pwht_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>

 <td>{elem?.asrrt_report_no_two}</td>
        <td>
  {elem?.asrrt_qc_time
    ? moment(elem.assrt_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>

 <td>{elem?.rt_lot_number}</td>
          <td>{elem?.rt_percentage}</td>
         
  <td>{elem?.rt_report_no_two}</td>
        <td>
  {elem?.rt_qc_time
    ? moment(elem.rt_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>

 <td>{elem?.mpt_lot_number}</td>
          <td>{elem?.mpt_percentage}</td>
         
  <td>{elem?.mpt_report_no_two}</td>
        <td>
  {elem?.mpt_qc_time
    ? moment(elem.mpt_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
        <td>{elem?.lpt_lot_number}</td>
          <td>{elem?.lpt_percentage}</td>
         
  <td>{elem?.lpt_report_no_two}</td>
        <td>
  {elem?.lpt_qc_time
    ? moment(elem.lpt_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>

 <td>{elem?.ht_report_no_two}</td>
        <td>
  {elem?.ht_qc_time
    ? moment(elem.ht_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
        <td>{elem?.pmi_report_no_two}</td>
        <td>
  {elem?.pmi_qc_time
    ? moment(elem.pmi_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
          <td>{elem?.pickling_report_no_two}</td>
        <td>
  {elem?.pickling_qc_time
    ? moment(elem.pickling_qc_time).format("DD/MM/YYYY hh:mm A")
    : ""}
</td>
      
  <td>{elem?.fd_report_no_two}</td>
        <td>
  {elem?.fd_qc_time
    ? moment(elem.fd_qc_time).format("DD/MM/YYYY hh:mm A")
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