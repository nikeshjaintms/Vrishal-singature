import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDprPiping } from '../../../Store/Piping/Dpr/getDprPiping';
import { Pagination, Search } from '../Table';
import DropDown from '../../../Components/DropDown';
import Loader from '../Include/Loader';
import moment from 'moment';
import { PdfDownloadErp } from '../../../Components/ErpPdf/PdfDownloadErp';

const DPR = () => {

    const isRejected = (status, isAccepted, type = "") => {
        const s = Number(status);
        const a = isAccepted;

        // Paint stages: Surface, MIO, Final Coat (check first — different is_accepted meanings)
        // PaintStatus: 1-Pending, 2-Partially, 3-Approved, 4-Rejected
        if (["surface", "mio"].includes(type)) {
            // is_accepted: 0=default, 1=rejected, 2=accepted, 3=rejected
            if (s === 4 || a === 1 || a === 3) return true;
            return false;
        }

        if (type === "final_coat") {
            // is_accepted: 1=Blank, 2=Acc, 3=Rej
            if (s === 4 || a === 3) return true;
            return false;
        }

        // 1. Explicit Rejection via isAccepted flag (generic stages)
        if (a === false || a === 2) return true;

        // 2. Status 1 is always Accepted
        if (s === 1) return false;

        if (["mpt", "bsrt", "asrt", "rt"].includes(type)) {

            if ([2, 3, 4].includes(a)) {
                return true;
            }

            return false;
        }

        // 3. Handle Status 2, 3, 4 (NDT Repair/Re-take/Re-shoot or Fitup/LPT Offered/Inspected)
        // if ([2, 3, 4].includes(s)) {
        //     // If isAccepted is true or 1, it's not rejected yet (Offered or Accepted)
        //     if (a === true || a === 1) return false;

        //     // If it's status 2 or 3 and isAccepted is null/undefined, 
        //     // it's likely "Offered" or "Inspected" (Fitup/LPT/Weld), so not red.
        //     if (s === 2 || s === 3) return false;

        //     return true; // Status 4 (Re-shoot) or other NDT rejections with null isAccepted
        // }

        // 4. Fitup/Weld specific codes (7: Weld Visual Inspected)
        if (s === 7) {
            if (a === false || a === 2) return true;
        }

        return false;
    }

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // if (disable === true) {
        // dispatch(getDprPiping({ page: currentPage, limit, search }));
        // setDisable(false);
        setIsLoading(true);
        dispatch(getDprPiping({ page: currentPage, limit, search: search }))
            .finally(() => {
                setDisable(false);
                setIsLoading(false);
            });
        // }

    }, [dispatch, disable, currentPage, limit, search]);

    const entity = useSelector((state) => state?.getDprPiping?.user?.data);
    const pagination = useSelector((state) => state?.getDprPiping?.user?.pagination);
    console.log("entity========>", entity);

    const commentsData = useMemo(() => {
        let computedComments = Array.isArray(entity) ? [...entity] : [];

        computedComments.sort((a, b) => (a.drawing_no || "").localeCompare(b.drawing_no || ""));

        computedComments = computedComments.map((elem) => {
            // Flatten Spool Wise Data -> Material Items
            const pipingScope = [];
            if (elem.spool_wise && Array.isArray(elem.spool_wise)) {
                elem.spool_wise.forEach(spool => {
                    const spoolRows = [];
                    if (spool.material_items && Array.isArray(spool.material_items)) {
                        // Group by joint_no
                        const jointGroups = {};
                        spool.material_items.forEach(item => {
                            const jointNo = item.joint_no || "Unknown";
                            if (!jointGroups[jointNo]) {
                                jointGroups[jointNo] = [];
                            }
                            jointGroups[jointNo].push(item);
                        });

                        Object.keys(jointGroups).forEach(jointNo => {
                            const items = jointGroups[jointNo];
                            const item1 = items[0];
                            const item2 = items[1]; // defined if exists
                            // Find maximum stages count across all stage arrays for this joint
                            let maxStageRows = 1;
                            const stageKeys = ["dispatch_data", "surface_data", "mio_data", "final_coat_data", "release_note_data", "fitup_data", "weld_visual_data", "dpt_data", "fd_data", "lhs_data", "bsrt_data", "ft_data", "pwht_data", "asrt_data", "rt_data", "mpt_data", "lpt_data", "ht_data", "pmi_data", "pickling_data"];

                            items.forEach(i => {
                                stageKeys.forEach(k => {
                                    if (i[k] && Array.isArray(i[k])) {
                                        if (i[k].length > maxStageRows) maxStageRows = i[k].length;
                                    }
                                });
                            });

                            for (let r = 0; r < maxStageRows; r++) {
                                // Extract dates from all items in this joint for the current index `r`
                                const getVal = (arr, key) => {
                                    const obj = items.find(i => i[arr] && i[arr].length > r && i[arr][r][key] !== undefined);
                                    return obj ? obj[arr][r][key] : undefined;
                                };

                                const dispatch_date = getVal("dispatch_data", "dispatch_date");
                                const surface_date = getVal("surface_data", "surface_date");
                                const surface_qc_date = getVal("surface_data", "surface_qc_date");
                                const mio_date = getVal("mio_data", "mio_date");
                                const mio_qc_date = getVal("mio_data", "mio_qc_date");
                                const final_coat_date = getVal("final_coat_data", "final_coat_date");
                                const final_coat_qc_date = getVal("final_coat_data", "final_coat_qc_date");
                                const release_note_date = getVal("release_note_data", "release_note_date");
                                const fitup_off_date = getVal("fitup_data", "fitup_date");
                                const fitup_acc_date = getVal("fitup_data", "fitup_qc_date");
                                const weld_off_date = getVal("weld_visual_data", "weld_visual_date");
                                const weld_acc_date = getVal("weld_visual_data", "weld_visual_qc_date");
                                const dpt_off_date = getVal("dpt_data", "dpt_date");
                                const dpt_acc_date = getVal("dpt_data", "dpt_qc_date");
                                const fd_off_date = getVal("fd_data", "fd_date");
                                const fd_acc_date = getVal("fd_data", "fd_qc_date");
                                const lhs_summary_date = getVal("lhs_data", "lhs_date");
                                const bsrt_qc_date = getVal("bsrt_data", "bsrt_qc_date");
                                const ft_qc_date = getVal("ft_data", "ft_qc_date");
                                const pwht_qc_date = getVal("pwht_data", "pwht_qc_date");
                                const asrt_qc_date = getVal("asrt_data", "asrt_qc_date");
                                const rt_qc_date = getVal("rt_data", "rt_qc_date");
                                const mpt_qc_date = getVal("mpt_data", "mpt_qc_date");
                                const lpt_qc_date = getVal("lpt_data", "lpt_qc_date");
                                const ht_qc_date = getVal("ht_data", "ht_qc_date");
                                const pmi_qc_date = getVal("pmi_data", "pmi_qc_date");
                                const pickling_qc_date = getVal("pickling_data", "pickling_qc_date");

                                const fitup_status = getVal("fitup_data", "fitup_status");
                                const fitup_is_accepted = getVal("fitup_data", "fitup_is_accepted");
                                const weld_visual_status = getVal("weld_visual_data", "weld_visual_status");
                                const weld_visual_is_accepted = getVal("weld_visual_data", "weld_visual_is_accepted");
                                const dpt_status = getVal("dpt_data", "dpt_status");
                                const dpt_is_accepted = getVal("dpt_data", "dpt_is_accepted");
                                const ndt_status = getVal("ndt_data", "ndt_status");
                                const ndt_is_accepted = getVal("ndt_data", "ndt_is_accepted");
                                const fd_status = getVal("fd_data", "fd_status");
                                const fd_is_accepted = getVal("fd_data", "fd_is_accepted");
                                const surface_status = getVal("surface_data", "surface_status");
                                const surface_is_accepted = getVal("surface_data", "surface_is_accepted");
                                const surface_qc_status = getVal("surface_data", "surface_qc_status");
                                const surface_qc_is_accepted = getVal("surface_data", "surface_qc_is_accepted");
                                const mio_status = getVal("mio_data", "mio_status");
                                const mio_is_accepted = getVal("mio_data", "mio_is_accepted");
                                const mio_qc_status = getVal("mio_data", "mio_qc_status");
                                const mio_qc_is_accepted = getVal("mio_data", "mio_qc_is_accepted");
                                const bsrt_status = getVal("bsrt_data", "bsrt_status");
                                const bsrt_is_accepted = getVal("bsrt_data", "bsrt_is_accepted");
                                const asrt_status = getVal("asrt_data", "asrt_status");
                                const asrt_is_accepted = getVal("asrt_data", "asrt_is_accepted");
                                const rt_status = getVal("rt_data", "rt_status");
                                const rt_is_accepted = getVal("rt_data", "rt_is_accepted");
                                const mpt_status = getVal("mpt_data", "mpt_status");
                                const mpt_is_accepted = getVal("mpt_data", "mpt_is_accepted");
                                const lpt_status = getVal("lpt_data", "lpt_status");
                                const lpt_is_accepted = getVal("lpt_data", "lpt_is_accepted");
                                const ft_status = getVal("ft_data", "ft_status");
                                const ft_is_accepted = getVal("ft_data", "ft_is_accepted");
                                const pwht_status = getVal("pwht_data", "pwht_status");
                                const pwht_is_accepted = getVal("pwht_data", "pwht_is_accepted");
                                const ht_status = getVal("ht_data", "ht_status");
                                const ht_is_accepted = getVal("ht_data", "ht_is_accepted");
                                const pmi_status = getVal("pmi_data", "pmi_status");
                                const pmi_is_accepted = getVal("pmi_data", "pmi_is_accepted");
                                const pickling_status = getVal("pickling_data", "pickling_status");
                                const pickling_is_accepted = getVal("pickling_data", "pickling_is_accepted");
                                const lhs_status = getVal("lhs_data", "lhs_status");
                                const lhs_is_accepted = getVal("lhs_data", "lhs_is_accepted");
                                const dispatch_status = getVal("dispatch_data", "dispatch_status");
                                const dispatch_is_accepted = getVal("dispatch_data", "dispatch_is_accepted");

                                const final_coat_status = getVal("final_coat_data", "final_coat_status");
                                const final_coat_is_accepted = getVal("final_coat_data", "final_coat_is_accepted");
                                const final_coat_qc_status = getVal("final_coat_data", "final_coat_qc_status");
                                const final_coat_qc_is_accepted = getVal("final_coat_data", "final_coat_qc_is_accepted");
                                const release_note_status = getVal("release_note_data", "release_note_status");
                                const release_note_is_accepted = getVal("release_note_data", "release_note_is_accepted");

                                spoolRows.push({
                                    jointSpan: r === 0 ? maxStageRows : 0,
                                    spool_no: spool.spool_no || "-",
                                    joint_no: jointNo,
                                    sheet_no: item1?.sheet_no || "-",
                                    area: item1?.area || "-",
                                    length: item1?.length || "-",
                                    inch_meter: item1?.inch_meter || "-",
                                    spool_wise_sum_length: spool.spool_wise_sum_length || "-",
                                    spool_wise_sum_area: spool.spool_wise_sum_area || "-",
                                    spool_wise_sum_inch_meter: spool.spool_wise_sum_inch_meter || "-",
                                    item_1: item1?.item_1 || "-",
                                    item_2: item1?.item_2 || "-",
                                    size: item1?.size?.name || item1?.size || "-",
                                    thickness: item1?.thickness?.name || item1?.thickness || "-",
                                    joint_type: item1?.joint_type || "-",
                                    // area: spool.area || "-",
                                    // inch_meter: spool.inch_meter || "-",
                                    dispatch_date,
                                    surface_date,
                                    surface_qc_date,
                                    mio_date,
                                    mio_qc_date,
                                    final_coat_date,
                                    final_coat_qc_date,
                                    release_note_date,
                                    fitup_off_date,
                                    fitup_acc_date,
                                    weld_off_date,
                                    weld_acc_date,
                                    dpt_off_date,
                                    dpt_acc_date,
                                    fd_off_date,
                                    fd_acc_date,
                                    lhs_summary_date,
                                    bsrt_qc_date,
                                    ft_qc_date,
                                    pwht_qc_date,
                                    asrt_qc_date,
                                    rt_qc_date,
                                    bsrt_status,
                                    bsrt_is_accepted,
                                    asrt_status,
                                    asrt_is_accepted,
                                    rt_status,
                                    rt_is_accepted,
                                    mpt_qc_date,
                                    mpt_status,
                                    mpt_is_accepted,
                                    lpt_qc_date,
                                    lpt_status,
                                    lpt_is_accepted,
                                    ft_status,
                                    ft_is_accepted,
                                    pwht_status,
                                    pwht_is_accepted,
                                    ht_status,
                                    ht_is_accepted,
                                    pmi_status,
                                    pmi_is_accepted,
                                    pickling_status,
                                    pickling_is_accepted,
                                    lhs_status,
                                    lhs_is_accepted,
                                    dispatch_status,
                                    dispatch_is_accepted,
                                    ht_qc_date,
                                    pmi_qc_date,
                                    pickling_qc_date,
                                    fitup_status,
                                    fitup_is_accepted,
                                    weld_visual_status,
                                    weld_visual_is_accepted,
                                    dpt_status,
                                    dpt_is_accepted,
                                    ndt_status,
                                    ndt_is_accepted,
                                    fd_status,
                                    fd_is_accepted,
                                    surface_status,
                                    surface_is_accepted,
                                    surface_qc_status,
                                    surface_qc_is_accepted,
                                    mio_status,
                                    mio_is_accepted,
                                    mio_qc_status,
                                    mio_qc_is_accepted,
                                    final_coat_status,
                                    final_coat_is_accepted,
                                    final_coat_qc_status,
                                    final_coat_qc_is_accepted,
                                    release_note_status,
                                    release_note_is_accepted
                                });
                            }
                        });
                    } else {
                        spoolRows.push({
                            spool_no: spool.spool_no || "-",
                            joint_no: "-",
                            item_1: "-",
                            item_2: "-",
                            size: "-",
                            thickness: "-",
                            joint_type: "-",
                            area: spool.area || "-",
                            inch_meter: spool.inch_meter || "-"
                        });
                    }

                    if (spoolRows.length > 0) {
                        spoolRows[0].spoolSpan = spoolRows.length;
                        spoolRows[0].showSpoolTotals = true;
                    }
                    pipingScope.push(...spoolRows);
                });
            }

            return {
                ...elem,
                pipingScope,
                issue_requests: [...(elem.issue_requests || [])].sort((a, b) => (a.issue_req_no || "").localeCompare(b.issue_req_no || "")),
                issue_acceptance: [...(elem.issue_acceptances || [])].sort((a, b) => (a.issue_accept_no || "").localeCompare(b.issue_accept_no || "")),
            };
        });

        // if (search) {
        //     computedComments = computedComments.filter((elem) => {
        //         const drawingNo = elem.drawing_no ? elem.drawing_no.toLowerCase() : "";
        //         const area = elem.area_unit?.area ? elem.area_unit.area.toLowerCase() : "";

        //         return (
        //             drawingNo.includes(search.toLowerCase()) ||
        //             area.includes(search.toLowerCase())
        //         );
        //     });
        // }

        setTotalItems(computedComments.length);

        const grouped = computedComments.reduce((acc, item) => {
            const key = `${item.drawing_no}-${item.unit || item.area_unit?.area || 'NA'}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        Object.values(grouped).forEach(group => {
            const maxRev = Math.max(...group.map(item => item.rev || 0));
            group.forEach(item => {
                item.isMain = item.rev == maxRev;
            });
        });

        const flattenedData = Object.values(grouped).flat();

        return flattenedData;
    }, [currentPage, entity, search, limit]);

    console.log("commentsData========>", commentsData);

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const handlePdfDownload = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        PdfDownloadErp({ apiMethod: 'post', url: 'piping/download-grid-xlsx-dpr', body: bodyFormData });
    }

    const columnHeaders = [
        "SR.",
        "UNIQUE NO.",
        "DRAWING NO.",
        "REV",
        "UNIT/AREA",
        "RECEIVED LOT NO.",
        // "P & ID DRAWING NO.",
        "PIPING CLASS",
        "SERVICE",
        "PIPING MATERIAL SPECIFICATION",
        "SPOOL NO.",
        "SHEET NO",
        "JOINT NO.",
        "ITEM-1",
        "ITEM-2",
        "SIZE",
        "THICKNESS",
        "JOINT TYPE",
        "AREA",
        "INCH-METER",
        "TOTAL AREA",
        "TOTAL INCH-METER",
        "ISSUE DATE",
        "ISSUE PERSON",
        "ISS. REQ.",
        "ISS. ACC.",
        "FITUP OFF.", "FITUP ACC.", " DPT ACC.", "WELD OFF.", "WELD ACC.",
        "BSRRT ACC.", "FERRITE ACC.", "PWHT ACC.", "ASRRT ACC.", "RT ACC.", "MPT ACC.", "LPT ACC.", "HARDNESS ACC.", "PMI ACC.", "PICKLING ACC.", "FD OFF.", "FD ACC.", "LHS. SUMMARY", "DIS. NOTE", "SURFACE OFF.", "SURFACE ACC.", "MIO OFF.", "MIO ACC.",
        "FINAL COAT OFF.", "FINAL COAT ACC.", "RELEASE NOTE"
    ];

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
                                    <li className="breadcrumb-item active">DPR List</li>
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
                                                        <h3>DPR List</h3>
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
                                                                <button type='button' onClick={handleRefresh}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={handlePdfDownload}>Download DPR <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div>
                                                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 comman-table mb-0 dpr-table">
                                                <thead>
                                                    <tr>
                                                        {columnHeaders.map((header, idx) => <th key={idx}>{header}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {commentsData?.map((elem, i) => {

                                                        const maxRows = Math.max(
                                                            elem?.pipingScope?.length || 0,
                                                            elem.issue_requests?.length || 0,
                                                            elem.issue_acceptance?.length || 0,
                                                            1
                                                        );
                                                        const issueReqDate = elem.issue_requests?.[0]?.createdAt;
                                                        const issueAccDate = elem.issue_acceptance?.[0]?.createdAt;
                                                        return Array.from({ length: maxRows }).map((_, rowIndex) => {

                                                            return (
                                                                <tr key={`${i}-${rowIndex}`} className={!elem.isMain ? 'table-row-red' : ''}>
                                                                    {rowIndex === 0 && (
                                                                        <>
                                                                            <td rowSpan={maxRows}>{(currentPage - 1) * limit + i + 1}</td>
                                                                            <td rowSpan={maxRows}>{elem.unique_no}</td>
                                                                            <td rowSpan={maxRows}>{elem.drawing_no}</td>
                                                                            <td rowSpan={maxRows}>{elem.rev}</td>
                                                                            <td rowSpan={maxRows}>{elem.unit || elem.area_unit?.area || '-'}</td>
                                                                            <td rowSpan={maxRows}>{elem.drawing_received_lot_no || '-'}</td>
                                                                            {/* <td rowSpan={maxRows}>{elem.p_id_drawing_no || '-'}</td> */}
                                                                            <td rowSpan={maxRows}>{elem.piping_class?.PipingClass || '-'}</td>
                                                                            <td rowSpan={maxRows}>{elem.service_details?.service || '-'}</td>
                                                                            <td rowSpan={maxRows}>{elem.service_details?.PipingMaterialSpecification || '-'}</td>
                                                                        </>
                                                                    )}

                                                                    {elem.pipingScope?.[rowIndex]?.spoolSpan ? (
                                                                        <td rowSpan={elem.pipingScope?.[rowIndex]?.spoolSpan}>{elem.pipingScope?.[rowIndex]?.spool_no || '-'}</td>
                                                                    ) : elem.pipingScope?.[rowIndex] ? null : <td>-</td>}
                                                                    {elem.pipingScope?.[rowIndex]?.jointSpan > 0 ? (
                                                                        <>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.sheet_no || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.joint_no || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.item_1 || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.item_2 || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.size || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.thickness || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.joint_type || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.area || '-'}</td>
                                                                            <td rowSpan={elem.pipingScope?.[rowIndex]?.jointSpan}>{elem.pipingScope?.[rowIndex]?.inch_meter || '-'}</td>
                                                                        </>
                                                                    ) : elem.pipingScope?.[rowIndex]?.jointSpan === 0 ? null : (
                                                                        <>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.sheet_no || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.joint_no || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.item_1 || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.item_2 || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.size || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.thickness || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.joint_type || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.area || '-'}</td>
                                                                            <td>{elem.pipingScope?.[rowIndex]?.inch_meter || '-'}</td>
                                                                        </>
                                                                    )}

                                                                    {elem.pipingScope?.[rowIndex]?.spoolSpan ? (
                                                                        <td rowSpan={elem.pipingScope?.[rowIndex]?.spoolSpan}>{elem.pipingScope?.[rowIndex]?.spool_wise_sum_area || '-'}</td>
                                                                    ) : elem.pipingScope?.[rowIndex] ? null : <td>-</td>}
                                                                    {elem.pipingScope?.[rowIndex]?.spoolSpan ? (
                                                                        <td rowSpan={elem.pipingScope?.[rowIndex]?.spoolSpan}>{elem.pipingScope?.[rowIndex]?.spool_wise_sum_inch_meter || '-'}</td>
                                                                    ) : elem.pipingScope?.[rowIndex] ? null : <td>-</td>}
                                                                    {/* {elem.pipingScope?.[rowIndex]?.spoolSpan ? (
                                                                        <td rowSpan={elem.pipingScope?.[rowIndex]?.spoolSpan}>{elem.pipingScope?.[rowIndex]?.area || '-'}</td>
                                                                    ) : elem.pipingScope?.[rowIndex] ? null : <td>-</td>}
                                                                    {elem.pipingScope?.[rowIndex]?.spoolSpan ? (
                                                                        <td rowSpan={elem.pipingScope?.[rowIndex]?.spoolSpan}>{elem.pipingScope?.[rowIndex]?.inch_meter || '-'}</td>
                                                                    ) : elem.pipingScope?.[rowIndex] ? null : <td>-</td>} */}


                                                                    {rowIndex === 0 && (
                                                                        <>
                                                                            <td rowSpan={maxRows}>{elem.issued_date ? moment(elem.issued_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                            <td rowSpan={maxRows}>{elem.contractor?.name || '-'}</td>
                                                                        </>
                                                                    )}
                                                                    <td>
                                                                        {elem.issue_requests?.[rowIndex]?.createdAt
                                                                            ? moment(elem.issue_requests?.[rowIndex]?.createdAt).format('DD/MM/YYYY HH:mm A')
                                                                            : '-'}
                                                                    </td>
                                                                    <td className={isRejected(elem.issue_acceptance?.[rowIndex]?.status, elem.issue_acceptance?.[rowIndex]?.is_accepted) ? "text-danger" : ""}>
                                                                        {elem.issue_acceptance?.[rowIndex]?.createdAt
                                                                            ? moment(elem.issue_acceptance?.[rowIndex]?.createdAt).format('DD/MM/YYYY HH:mm A')
                                                                            : '-'}
                                                                    </td>
                                                                    <td>{elem.pipingScope?.[rowIndex]?.fitup_off_date ? moment(elem.pipingScope?.[rowIndex]?.fitup_off_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.fitup_status, elem.pipingScope?.[rowIndex]?.fitup_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.fitup_acc_date ? moment(elem.pipingScope?.[rowIndex]?.fitup_acc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.dpt_status, elem.pipingScope?.[rowIndex]?.dpt_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.dpt_acc_date ? moment(elem.pipingScope?.[rowIndex]?.dpt_acc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td>{elem.pipingScope?.[rowIndex]?.weld_off_date ? moment(elem.pipingScope?.[rowIndex]?.weld_off_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.weld_visual_status, elem.pipingScope?.[rowIndex]?.weld_visual_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.weld_acc_date ? moment(elem.pipingScope?.[rowIndex]?.weld_acc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.bsrt_status, elem.pipingScope?.[rowIndex]?.bsrt_is_accepted, "bsrt") ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.bsrt_qc_date ? moment(elem.pipingScope?.[rowIndex]?.bsrt_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.ft_status, elem.pipingScope?.[rowIndex]?.ft_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.ft_qc_date ? moment(elem.pipingScope?.[rowIndex]?.ft_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.pwht_status, elem.pipingScope?.[rowIndex]?.pwht_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.pwht_qc_date ? moment(elem.pipingScope?.[rowIndex]?.pwht_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.asrt_status, elem.pipingScope?.[rowIndex]?.asrt_is_accepted, "asrt") ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.asrt_qc_date ? moment(elem.pipingScope?.[rowIndex]?.asrt_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.rt_status, elem.pipingScope?.[rowIndex]?.rt_is_accepted, "rt") ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.rt_qc_date ? moment(elem.pipingScope?.[rowIndex]?.rt_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.mpt_status, elem.pipingScope?.[rowIndex]?.mpt_is_accepted, "mpt") ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.mpt_qc_date ? moment(elem.pipingScope?.[rowIndex]?.mpt_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>

                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.lpt_status, elem.pipingScope?.[rowIndex]?.lpt_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.lpt_qc_date ? moment(elem.pipingScope?.[rowIndex]?.lpt_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>

                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.ht_status, elem.pipingScope?.[rowIndex]?.ht_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.ht_qc_date ? moment(elem.pipingScope?.[rowIndex]?.ht_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.pmi_status, elem.pipingScope?.[rowIndex]?.pmi_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.pmi_qc_date ? moment(elem.pipingScope?.[rowIndex]?.pmi_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.pickling_status, elem.pipingScope?.[rowIndex]?.pickling_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.pickling_qc_date ? moment(elem.pipingScope?.[rowIndex]?.pickling_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>

                                                                    <td>{elem.pipingScope?.[rowIndex]?.fd_off_date ? moment(elem.pipingScope?.[rowIndex]?.fd_off_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.fd_status, elem.pipingScope?.[rowIndex]?.fd_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.fd_acc_date ? moment(elem.pipingScope?.[rowIndex]?.fd_acc_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.lhs_status, elem.pipingScope?.[rowIndex]?.lhs_is_accepted) ? "text-danger" : ""} >{elem.pipingScope?.[rowIndex]?.lhs_summary_date ? moment(elem.pipingScope?.[rowIndex]?.lhs_summary_date).format('DD/MM/YYYY HH:mm A') : '-'}</td>
                                                                    {/* <td>-</td> */}
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.dispatch_status, elem.pipingScope?.[rowIndex]?.dispatch_is_accepted) ? "text-danger" : ""}>
                                                                        {elem.pipingScope?.[rowIndex]?.dispatch_date ? moment(elem.pipingScope?.[rowIndex]?.dispatch_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {elem.pipingScope?.[rowIndex]?.surface_date ? moment(elem.pipingScope?.[rowIndex]?.surface_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.surface_status, elem.pipingScope?.[rowIndex]?.surface_is_accepted, "surface") ? "text-danger" : ""}>
                                                                        {elem.pipingScope?.[rowIndex]?.surface_qc_date ? moment(elem.pipingScope?.[rowIndex]?.surface_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                    {/* <td>-</td> */}
                                                                    <td>
                                                                        {elem.pipingScope?.[rowIndex]?.mio_date ? moment(elem.pipingScope?.[rowIndex]?.mio_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.mio_status, elem.pipingScope?.[rowIndex]?.mio_is_accepted, "mio") ? "text-danger" : ""}>
                                                                        {elem.pipingScope?.[rowIndex]?.mio_qc_date ? moment(elem.pipingScope?.[rowIndex]?.mio_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>

                                                                    <td>
                                                                        {elem.pipingScope?.[rowIndex]?.final_coat_date ? moment(elem.pipingScope?.[rowIndex]?.final_coat_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.final_coat_status, elem.pipingScope?.[rowIndex]?.final_coat_is_accepted, "final_coat") ? "text-danger" : ""}>
                                                                        {elem.pipingScope?.[rowIndex]?.final_coat_qc_date ? moment(elem.pipingScope?.[rowIndex]?.final_coat_qc_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                    <td className={isRejected(elem.pipingScope?.[rowIndex]?.release_note_status, elem.pipingScope?.[rowIndex]?.release_note_is_accepted) ? "text-danger" : ""}>
                                                                        {elem.pipingScope?.[rowIndex]?.release_note_date ? moment(elem.pipingScope?.[rowIndex]?.release_note_date).format('DD/MM/YYYY HH:mm A') : '-'}
                                                                    </td>
                                                                </tr>
                                                            )

                                                        });
                                                    })}

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
                                                    aria-live="polite">Showing {Math.min((pagination?.currentPage || currentPage) * (limit), pagination?.totalRecords || 0)} from {pagination?.totalRecords || 0} data</div>

                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">

                                                    <Pagination
                                                        total={pagination?.totalRecords || 0}
                                                        itemsPerPage={limit}
                                                        currentPage={pagination?.currentPage || currentPage}
                                                        onPageChange={(page) => {
                                                            setCurrentPage(page);
                                                            setDisable(true); // refetch from backend
                                                        }}
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
        </div>
    )
}

export default DPR