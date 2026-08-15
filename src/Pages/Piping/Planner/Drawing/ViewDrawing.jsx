import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import DropDown from '../../../../Components/DropDown';
import axios from 'axios';
import moment from 'moment';
import { FileText } from 'lucide-react';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import Loader from '../../Include/Loader';
import { Pagination } from '../../Table';
import { getUserContractor } from '../../../../Store/Store/ContractorMaster/ContractorMaster';
import { getAreasAction } from '../../../../Store/Piping/Area/AreaSlicePiping';
import { useDispatch, useSelector } from 'react-redux';

const ViewDrawing = () => {
    const dispatch = useDispatch();
    const [lotData, setLotData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [disable2, setDisable2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [entity, setEntity] = useState([]);
    const [selectedDrawings, setSelectedDrawings] = useState([]);
    const [searchVal, setSearchVal] = useState({
        date: "",
        status: "",
        contractor: "",
        area_unit: "",
        drawing_received_lot_no: "",
    });

    useEffect(() => {
        dispatch(getUserContractor({ status: true }))
    }, []);
 useEffect(() => {
    const projectId = localStorage.getItem("U_PROJECT_ID"); // current project
    dispatch(
      getAreasAction({
        project: projectId,
        status: 1,
      })
    );
  }, [dispatch]);

    useEffect(() => {
        if (disable === true) {
            setEntity([]);
        }
    }, [disable]);

    useEffect(() => {
    const fetchLotNos = async () => {
        try {
            const res = await axios.post(
                `${V_URL}/user/get-project-drawings-piping`,
                new URLSearchParams({
                    project: localStorage.getItem("U_PROJECT_ID"),
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization:
                            "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                    },
                }
            );

            if (res.data.success) {
                // Extract unique lot numbers
                const lots = res.data.data
                    ?.map(item => item.drawing_received_lot_no)
                    .filter(Boolean);

                const uniqueLots = [...new Set(lots)];

                setLotData(uniqueLots);
            }
        } catch (err) {
            console.log(err);
        }
    };

    fetchLotNos();
}, []);

    const contractorData = useSelector((state) => state?.getUserContractor?.user?.data);
   const areaData = useSelector((state) => state?.getAreas?.data?.areas);
console.log("areaData=======>",areaData);
    // const commentsData = useMemo(() => {
    //     let computedComments = entity;
    //     setTotalItems(computedComments?.length);
    //     const grouped = computedComments.reduce((acc, item) => {
    //         const key = `${item.drawing_no}-${item.unit}-${item.assembly_no}`;
    //         if (!acc[key]) acc[key] = [];
    //         acc[key].push(item);
    //         return acc;
    //     }, {});

    //     Object.keys(grouped).forEach(key => {
    //         const group = grouped[key];
    //         const maxRev = Math.max(...group.map(item => item.rev));
    //         group.forEach(item => {
    //             item.isMain = item.rev === maxRev;
    //         });
    //     });
    //     const flattenedData = Object.values(grouped).flat();
    //     return flattenedData?.slice(
    //         (currentPage - 1) * limit,
    //         (currentPage - 1) * limit + limit
    //     );
    // }, [currentPage, limit, entity]);

  const commentsData = useMemo(() => {
    let computedComments = entity;

    setTotalItems(computedComments?.length);

    const grouped = computedComments.reduce((acc, item) => {
      const areaVal = item.area_unit?.area || "";
      const pipingClassVal =
        item.piping_class?.PipingClass || item.piping_class || "";
      const key = `${item.drawing_no}-${areaVal}-${pipingClassVal}-${item.sheet_no}-${item.p_id_drawing_no}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    console.log("grouped", grouped);

    Object.keys(grouped).forEach((key) => {
      const group = grouped[key];
      if (group.length > 1) {
        // Sort by master_updation_date descending (newest first)
        group.sort(
          (a, b) =>
            new Date(b.master_updation_date) - new Date(a.master_updation_date)
        );
        // Mark the oldest entry (last in sorted array) as red
        group[group.length - 1].isMain = true;
        // All others are normal
        for (let i = 0; i < group.length - 1; i++) {
          group[i].isMain = false;
        }
      }
    });

    const flattenedData = Object.values(grouped).flat();
    console.log("flattenedData", flattenedData);
    // return flattenedData?.slice(
    //     (currentPage - 1) * limit,
    //     (currentPage - 1) * limit + limit
    // );
    return flattenedData;
  }, [currentPage, limit, entity]);
    
    const handleChange = (e) => {
        setSearchVal({ ...searchVal, [e.target.name]: e.target.value });
    }

    const handleSearch = () => {
        setDisable2(true);
        const myurl = `${V_URL}/user/get-project-drawings-piping`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('date', searchVal.date);
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('status', searchVal.status);
        bodyFormData.append('contractor', searchVal.contractor);
        bodyFormData.append('area_unit', searchVal.area_unit);
        bodyFormData.append('drawing_received_lot_no', searchVal.drawing_received_lot_no);
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            // console.log(response.data, ' ^^^$$')
            if (response.data.success === true) {
                toast.success(response.data.message);
                setEntity(response.data.data);
                setDisable(false);
            } else {
                toast.error(response.data.message);
                setEntity(response.data.data);
            }
            setDisable2(false);
        }).catch((error) => {
            setDisable2(false);
            console.log(error, '!!');
            toast.error(error?.response?.data?.message || 'Something went wrong');
        })
    }

    const handleDownload = () => {
        setLoading(true);
        const myurl = `${V_URL}/user/filtered-drawing-issue-report-piping`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('date', searchVal.date);
        bodyFormData.append('project', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('status', searchVal.status);
        bodyFormData.append('contractor', searchVal.contractor);
         bodyFormData.append('area_unit', searchVal.area_unit);
        bodyFormData.append('drawing_received_lot_no', searchVal.drawing_received_lot_no);
        bodyFormData.append('print_date', true);
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((res) => {
            if (res.data.success === true) {
                window.open(res.data.data.file, '_blank')
                toast.success(res.data.message);
            }
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally(() => { setLoading(false) })

    }

    const handleMergeDownload = async () => {
    // if (selectedDrawings.length === 0) {
    //     return toast.error("Please select at least one drawing");
    // }

    try {
        setLoading1(true);

        const res = await axios.post(
            `${V_URL}/user/merge-selected-drawing-pdf-piping`,
            {
                drawing_ids: selectedDrawings
            },
            {
                headers: {
                    Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
                }
            }
        );

        if (res.data.success) {
            window.open(res.data.file, "_blank");
            toast.success("Merged PDF downloaded");
        }
    } catch (err) {
        toast.error(err?.response?.data?.message || "Error merging PDF");
    } finally {
        setLoading1(false);
    }
};

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item active">Drawing List</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">

                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Drawing List</h3>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="staff-search-table">
                                       <form>
    {/* BUTTON ROW FIRST */}
    <div className="row g-2 mb-3">
        <div className="col-12 d-flex justify-content-end gap-2 flex-wrap">
            <button
                type="button"
                onClick={handleSearch}
                className="btn btn-primary"
                disabled={disable2}
            >
                {disable2 ? "Processing..." : "Search"}
            </button>

            <button
                type="button"
                onClick={handleDownload}
                className="btn btn-warning"
                disabled={loading}
            >
                {loading ? "Processing..." : "Drawing Issue Master Download"}
            </button>

            {/* <button
                type="button"
                onClick={handleMergeDownload}
                className="btn btn-success"
                disabled={loading1}
            >
                {loading1 ? "Processing..." : "Selected Download"}
            </button> */}
            {selectedDrawings.length > 1 && (
    <button
        type="button"
        onClick={handleMergeDownload}
        className="btn btn-success"
        disabled={loading1}
    >
        {loading1
            ? "Processing..."
            : `Merge Pdf Download (${selectedDrawings.length})`}
    </button>
)}
        </div>
    </div>

    {/* FILTER ROW */}
    <div className="row g-2">

        <div className="col-md-4">
            <div className="input-block local-forms">
                <label>Drawing Lot No.</label>
                {/* <input
                    type="text"
                    className="form-control"
                    name="drawing_received_lot_no"
                    value={searchVal.drawing_received_lot_no}
                    onChange={handleChange}
                    placeholder="Enter Lot No"
                /> */}
                <select
    className="form-control form-select"
    name="drawing_received_lot_no"
    value={searchVal.drawing_received_lot_no}
    onChange={handleChange}
>
    <option value="">Select Lot No</option>
    {lotData.map((lot, i) => (
        <option key={i} value={lot}>
            {lot}
        </option>
    ))}
</select>
            </div>
        </div>

        <div className="col-md-4">
            <div className="input-block local-forms">
                <label>Unit / Area</label>
                <select
                    className="form-control form-select"
                    name="area_unit"
                    value={searchVal.area_unit}
                    onChange={handleChange}
                >
                    <option value="">Select Area</option>
                    {areaData?.map((e, i) => (
                        <option key={i} value={e._id}>
                            {e.area}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="col-md-4">
            <div className="input-block local-forms">
                <label>Receive Date</label>
                <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={searchVal.date}
                    onChange={handleChange}
                />
            </div>
        </div>

        <div className="col-md-4">
            <div className="input-block local-forms">
                <label>Status</label>
                <select
                    className="form-control form-select"
                    name="status"
                    value={searchVal.status}
                    onChange={handleChange}
                >
                    <option value="">Select Status</option>
                    <option value={1}>Pending</option>
                    <option value={2}>Issued</option>
                </select>
            </div>
        </div>

        <div className="col-md-4">
            <div className="input-block local-forms">
                <label>Contractor</label>
                <select
                    className="form-control form-select"
                    name="contractor"
                    value={searchVal.contractor}
                    onChange={handleChange}
                >
                    <option value="">Select Contractor</option>
                    {contractorData?.map((e, i) => (
                        <option key={i} value={e._id}>
                            {e.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>

    </div>
</form>
                                    </div>

                                    {disable2 === false ? (
                                        <>
                                            <div className="table-responsive mt-2">
                                                <table className="table border-0 custom-table comman-table  mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Select</th>
                                                            <th>Sr.</th>
                                                            <th>Unique No.</th>
                                                            <th>Drawing No.</th>
                                                            <th>Drawing Received Lot No.</th>
                                                            {/* <th>P & Id Drawing No.</th> */}
                                                            <th>Piping Class</th>
                                                            <th>Unit / Area</th>
                                                            <th>REV</th>
                                                            {/* <th>Sheet No.</th>                                                            */}
                                                            <th>PDF</th>
                                                            <th>Receive Date</th>                                                          
                                                            <th>Contractor</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {commentsData?.map((elem, i) =>
                                                            <tr key={elem?._id} 
                                                            // className={!elem.isMain ? 'table-row' : ''}
                                                              className={elem.isMain ? "table-row-red" : ""}
                                                            >
                                                             <td>  
                                                                <input
                                                                type="checkbox"
                                                                checked={selectedDrawings.includes(elem._id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                    setSelectedDrawings((prev) => [...prev, elem._id]);
                                                                    } else {
                                                                    setSelectedDrawings((prev) =>
                                                                        prev.filter((id) => id !== elem._id)
                                                                    );
                                                                    }
                                                                }}
                                                                />
                                                                </td>
                                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                                <td>{elem?.unique_no}</td>
                                                                <td>{elem?.drawing_no}</td>
                                                                <td>{elem?.drawing_received_lot_no}</td>
                                                                {/* <td>{elem?.p_id_drawing_no}</td> */}
                                                                <td>{elem?.piping_class?.PipingClass}</td>
                                                                <td>{elem?.area_unit?.area}</td>
                                                                <td>{elem?.rev}</td>
                                                                {/* <td>{elem?.sheet_no}</td>                                                              */}
                                                                <td>
                                                                    <a href={elem?.drawing_pdf} target='_blank' rel="noreferrer" style={{ cursor: "pointer" }} data-toggle="tooltip" data-placement="top" title="View">
                                                                        <FileText /> {elem?.drawing_pdf_name}
                                                                    </a>
                                                                </td>
                                                                <td>{moment(elem?.draw_receive_date).format('YYYY-MM-DD')}</td>
                                                                <td>{elem?.issued_person?.name || '-'}</td>
                                                                <td>
                                                                    {elem.status === 1 ? (
                                                                        <span className="custom-badge status-orange">Pending</span>
                                                                    ) : (
                                                                        <span className="custom-badge status-green">Completed</span>
                                                                    )}
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
                                        </>
                                    ) : <Loader />}
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

export default ViewDrawing