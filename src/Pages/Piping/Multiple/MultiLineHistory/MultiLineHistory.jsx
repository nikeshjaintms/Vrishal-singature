import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../Include/Header';
import { Pagination } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import Footer from '../../Include/Footer';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import Sidebar from '../../Include/Sidebar';
import { getLineHistorySheetDataPiping } from "../../../../Store/Piping/LHS/getLineHistorySheetDataPiping";
import {getGenLineHistorySheetPiping} from "../../../../Store/Piping/LHS/getGenLineHistorySheetPiping";
 const useDebounce = (value, delay = 500) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const MultiReleaseNote = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [totalItems1, setTotalItems1] = useState(0);
    const [search1, setSearch1] = useState("");
    const [limit1, setlimit1] = useState(10);
    const [disable, setDisable] = useState(true);
    const [disable1, setDisable1] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [genRows, setGenRows] = useState([]);
    
     
      const debouncedSearch = useDebounce(search, 500);
    const debouncedSearch1 = useDebounce(search1, 500);

  

  // Fetch API
  useEffect(() => {
    dispatch(
      getLineHistorySheetDataPiping({
        page: currentPage,
        limit,
        search:debouncedSearch,
        project: localStorage.getItem("U_PROJECT_ID"),
      })
    );
  }, [currentPage, limit, debouncedSearch]);
  
useEffect(() => {
  dispatch(
    getGenLineHistorySheetPiping({
      page: currentPage1,
      limit: limit1,
      search: debouncedSearch1,
      project: localStorage.getItem("U_PROJECT_ID"),
    })
  );
}, [currentPage1, limit1, debouncedSearch1]);

    const data = useSelector(state => state.getLineHistorySheetDataPiping?.user?.data);
    console.log("data=========>",data);
     const pagination = useSelector(state => state.getLineHistorySheetDataPiping?.user?.pagination);

        const genData = useSelector(state => state.getGenLineHistorySheetPiping?.user?.data);
    console.log("genData=========>",genData);
     const pagination1 = useSelector(state => state.getGenLineHistorySheetPiping?.user?.pagination);

// Update table rows when API returns
useEffect(() => {
  if (Array.isArray(data)) {
    setRows(data);
  }

  if (pagination?.totalRecords) {
    setTotalItems(pagination.totalRecords);
  }
}, [data, pagination]);

useEffect(() => {
  if (Array.isArray(genData)) {
    setGenRows(genData);
  }

  if (pagination1?.total) {
    setTotalItems1(pagination1.total);
  }
}, [genData, pagination1]);

    const handleDownload = () => {
        const payload = {
            "user_id": localStorage.getItem("PAY_USER_ID"),
            "project": localStorage.getItem("PAY_USER_PROJECT_NAME"),
            "id": selectedRows
        }
        const myurl = `${V_URL}/user/generate-multi-release-note`;
        axios({
            method: "post",
            url: myurl,
            data: payload,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response?.data?.success === true) {
                toast.success(response?.data?.message);
               
                  setSelectedRows([]);

                // fatchData()
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally((() => {
            setDisable(false);
            setSelectedRows([]);
        }));
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
        setCurrentPage(1);
        setSelectedRows([])
    }
    const handleRefresh1 = () => {
        setSearch1('');
        setCurrentPage1(1);
        setDisable1(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    const handleDownloadIns = (elem) => {
        console.log("elem in download", elem);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('drawing_id', elem?.drawings?.[0]?.drawing_id);
        bodyFormData.append('_id', elem?._id);
        PdfDownloadErp({ apiMethod: 'post', url: 'download-line-history-sheet-pdf-piping', body: bodyFormData });
    }

    return (

        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/project-store/dashboard", active: false },
                        { name: "Line History Sheet List", active: false },
                    ]} />

                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">

                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="doctor-table-blk">
                                                        <h3>Line History Sheet List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    {/* <Search
                                                                        onSearch={(value) => {
                                                                            setSearch(value);
                                                                            setCurrentPage(1);
                                                                        }} /> */}

                                                                         <input type="text" className="form-control" placeholder="Search" value={search}
                                                                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); // setDisable(true); 
                                                                            }} />
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
                                                   

                                                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                                        <DropDown limit={limit} onLimitChange={(val) => {
    setlimit(val);
    setCurrentPage(1);
    setDisable(true);
}} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table mb-0">
                                                <thead>
                                                    <tr>                                           
                                                        <th className="text-start" style={{ width: "35px" }}>Sr.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Rev No.</th>
                                                        {/* <th>Sheet No.</th> */}
                                                        <th>Spool No.</th>
                                                        {/* <th>Date</th> */}
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                   {rows?.length > 0 ? (
                                                    rows.map((elem, i) => (
                                                            <tr>
                                                               
                                                                <td className="text-start">
                                                                    {(currentPage - 1) * limit + i + 1}
                                                                </td>
                                                                <td>{elem?.drawing_no || "RTY"}</td>
                                                                <td>{elem?.rev || "-"}</td>
                                                                <td>
                                                                {elem?.spool_wise
                                                                    ?.map(e => e?.spool_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
                                                                {/* <td></td> */}
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a
                                                                            href="#"
                                                                            className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa fa-ellipsis-v"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button
                                                                                type="button"
                                                                                className="dropdown-item"
                                                                                onClick={() =>
                                                                                    navigate("/piping/user/view-line-history", {
                                                                                        state: elem,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <i className="fa-solid fa-eye m-r-5"></i> View
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="999">
                                                                <div className="no-table-data">No Data Found!</div>
                                                            </td>
                                                        </tr>
                                                    )}
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
//                                                          onPageChange={(page) => {
//     setCurrentPage(page);
//     setDisable(true); 
//   }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                        <h3>Generated Line History Sheet List</h3>
                                                        <div className="doctor-search-blk">
                                                            <div className="top-nav-search table-search-blk">
                                                                <form>
                                                                    {/* <Search
                                                                        onSearch={(value) => {
                                                                            setSearch1(value);
                                                                            setCurrentPage1(1);
                                                                        }} /> */}
                                                                         <input
  type="text"
  className="form-control"
  placeholder="Search"
  value={search1}
  onChange={(e) => {
    setSearch1(e.target.value);
    setCurrentPage1(1);
    // setDisable1(true); 
  }}
/>
                                                                    <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                        alt="search" /></a>
                                                                </form>
                                                            </div>
                                                            <div className="add-group">
                                                                <button type='button' onClick={handleRefresh1}
                                                                    className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                                        src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                    {/* <DropDown limit={limit1} onLimitChange={(val) => setlimit1(val)} /> */}
                                                    <DropDown limit={limit1} onLimitChange={(val) => {
                                                        setlimit1(val);
                                                        setCurrentPage1(1);
                                                        setDisable1(true);
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className="text-start" style={{ width: "35px" }}>Sr.</th>
                                                        <th>Report No.</th>
                                                        <th>Line No. / Drawing No.</th>
                                                        <th>Rev No.</th>
                                                        <th>Spool No.</th>
                                                        <th className="text-end">Action</th>
                                                    </tr>
                                                </thead>
<tbody>
{genRows?.length > 0 ? (
  genRows.map((lhs, lhsIndex) =>
    lhs.drawings?.map((drawing, dIndex) => (
      <tr key={dIndex}>
       <td>{(currentPage1 - 1) * limit1 + lhsIndex + 1}</td>

        <td>{lhs?.report_no || "-"}</td>

        <td>
          {lhs?.drawing_details?.[dIndex]?.drawing_no || "-"}
        </td>

        <td>
          {lhs?.drawing_details?.[dIndex]?.rev || "-"}
        </td>
         <td>
                                                                {lhs?.spool_details
                                                                    ?.map(e => e?.spool_no)
                                                                    .filter((value, index, self) => self.indexOf(value) === index)
                                                                    .join(", ") || "-"}
                                                            </td>
           <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a
                                                                            href="#"
                                                                            className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa fa-ellipsis-v"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button
                                                                                type="button"
                                                                                className="dropdown-item"
                                                                                onClick={() =>
                                                                                    navigate("/piping/user/view-Genline-history", {
                                                                                        state: { drawingData: lhs },
                                                                                    })
                                                                                }
                                                                            >
                                                                                <i className="fa-solid fa-eye m-r-5"></i> View
                                                                            </button>
                                                                            <button type='button' className="dropdown-item"
                                                                                onClick={() => handleDownloadIns(lhs)}
                                                                            >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
                                                                        </div>
                                                                    </div>
                                                                </td>
      </tr>
    ))
  )
) : (
  <tr>
    <td colSpan="4">
      <div className="no-table-data">No Data Found!</div>
    </td>
  </tr>
)}
</tbody>
                                                {/* <tbody>
                                                    {genRows?.length > 0 ? (
                                                        genRows.map((elem, i) => (
                                                            <tr key={elem?._id}>
                                                                <td className="text-start">
                                                                    {(currentPage1 - 1) * limit1 + i + 1}
                                                                </td>
                                                                <td>{elem?.report_no}</td>
                                                                <td>{elem?.drawing_id?.drawing_no}</td>
                                                                <td>{elem?.drawing_id?.rev || '-'}</td>
                                                                <td>{elem?.drawing_id?.sheet_no || '-'}</td>

                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td className="text-end">
                                                                    <div className="dropdown dropdown-action">
                                                                        <a
                                                                            href="#"
                                                                            className="action-icon dropdown-toggle"
                                                                            data-bs-toggle="dropdown"
                                                                            aria-expanded="false"
                                                                        >
                                                                            <i className="fa fa-ellipsis-v"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-end">
                                                                            <button
                                                                                type="button"
                                                                                className="dropdown-item"
                                                                                onClick={() =>
                                                                                    navigate("/piping/user/view-Genline-history", {
                                                                                        state: elem,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <i className="fa-solid fa-eye m-r-5"></i> View
                                                                            </button>
                                                                            <button type='button' className="dropdown-item"
                                                                                onClick={() => handleDownloadIns(elem)}
                                                                            >
                                                                                <i className="fa-solid fa-download  m-r-5"></i> Download Report</button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5">
                                                                <div className="no-table-data">No Data Found!</div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody> */}
                                            </table>
                                        </div>
                                        <div className="row align-center mt-3 mb-2">
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                    aria-live="polite">Showing {Math.min(limit1, totalItems1)} from {totalItems1} data</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                <div className="dataTables_paginate paging_simple_numbers"
                                                    id="DataTables_Table_0_paginate">
                                                    <Pagination
                                                        total={totalItems1}
                                                        itemsPerPage={limit1}
                                                        currentPage={currentPage1}
                                                        onPageChange={(page) => setCurrentPage1(page)}
//                                                          onPageChange={(page) => {
//     setCurrentPage1(page);
//     setDisable1(true); 
//   }}
                                                    />
                                                </div>
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

export default MultiReleaseNote