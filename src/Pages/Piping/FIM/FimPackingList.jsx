import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import Loader from '../Include/Loader';
import DropDown from '../../../Components/DropDown';
import Swal from 'sweetalert2';
import { SendHorizontal, X } from 'lucide-react';
import { Pagination, Search } from '../Table';
import { M_CON, QC, V_URL } from '../../../BaseUrl';

const FimPackingList = () => {
  const navigate = useNavigate();
  const [entity, setEntity] = useState([]);
  console.log("Packing List Entity:", entity);
  const [disable, setDisable] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    getPackingLists();
  }, [currentPage, limit, debouncedSearch]);


  const getPackingLists = async () => {
      setDisable(true);
      const project = localStorage.getItem('U_PROJECT_ID');
      console.log("saerch",search);
      try {
          const res = await axios.post(
      `${V_URL}/user/get-fim-packing-list`,
      { project, page: currentPage, limit, search: debouncedSearch }, // ✅ send filters
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('PAY_USER_TOKEN'),
              'Content-Type': 'application/json',
            },
          }
        );

       if (res.data.success) {
        // ✅ Adjusted according to your response JSON
        const data = res.data.data?.data || [];
        const pagination = res.data.data?.pagination;

        const filtered = data.filter((e) => !e.deleted);
        setEntity(filtered);

        // ✅ Handle total items for pagination
       if (pagination) {
         setTotalItems(pagination.totalItems || filtered.length); // ✅ use totalItems
       } else {
         setTotalItems(filtered.length);
       }
      }
      } catch (err) {
        console.error(err);
      } finally {
        setDisable(false);
      }
    };


// const commentsData = useMemo(() => {
//   let computed = entity;   
//   if (search) {
//     computed = computed.filter(
//       (row) =>
//         row.packing_no?.toLowerCase().includes(search.toLowerCase()) ||
//         row.supplier?.toLowerCase().includes(search.toLowerCase())
//     );
//   }
//   if (status) {
//     computed = computed.filter((row) => row.returnable_type === status);
//   }
//   return computed;
// }, [entity, search, status]);

const commentsData = useMemo(() => entity, [entity]);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/delete-packing-list/${id}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('PAY_USER_TOKEN') }
      });
      toast.success('Deleted successfully');
      getPackingLists();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleRefresh = () => {
    setStatus('');
    setSearch('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  const handleDownloadPdf = async (elem) => {
  try {
    const res = await axios.post(
      `${V_URL}/user/download-fim-packing`,
      { fim_id: elem._id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      toast.success("PDF generated!");
      window.open(res.data.data.file, "_blank"); // open PDF
    } else {
      toast.error("Failed to generate PDF");
    }
  } catch (err) {
    console.log(err);
    toast.error("Error generating PDF");
  }
};

  const handleDownloadIMIRPdf = async (elem) => {
      try {
        const res = await axios.post(
          `${V_URL}/user/download-fim-data`,
          { fim_id: elem._id },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.success) {
          toast.success("PDF generated!");
          window.open(res.data.data.file, "_blank"); // open PDF
        } else {
          toast.error("Failed to generate PDF");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error generating PDF");
      }
    };
const handleSendQc = (id, title) => {
    Swal.fire({
        title: `Are you sure you want to send ${title} to QC?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, send it to QC!",
    }).then((result) => {
        if (result.isConfirmed) {
            const myurl = `${V_URL}/user/send-fim-to-qc`;
            var bodyFormData = new URLSearchParams();
            bodyFormData.append("fim_id", id);

            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                },
            })
            .then((response) => {
                if (response.data.success === true) {
                    toast.success(response?.data?.message);
                    getPackingLists();
                } else {
                    toast.error(response?.data?.message);
                }
            })
            .catch((error) => {
                toast.error(error?.response?.data?.message || "Something went wrong");
                console.log("Errors", error);
            });
        }
    });
};

const handleDownloadExcel = async (elem) => {
  try {
    const res = await axios.post(
      `${V_URL}/user/download-fim-packing-excel`,
      { fim_id: elem._id },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      toast.success("Excel generated!");
      window.open(res.data.data.file, "_blank"); // download Excel
    } else {
      toast.error("Failed to generate Excel");
    }
  } catch (err) {
    toast.error("Error generating Excel");
  }
};


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
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/fim-packing-list">FIM Packing List</Link>
                  </li>
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
                            <h3>FIM Packing Lists</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form onSubmit={(e) => e.preventDefault()}>
                                  <Search
                                    value={search}
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }}
                                  />
                                  <a className="btn">
                                    <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                  title="Refresh"
                                >
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              {localStorage.getItem('ERP_ROLE') === M_CON && (
                                 <Link
                                    to="/piping/user/manage-fim-packing"
                                    className="btn btn-primary add-pluss ms-2" 
                                >
                                    <img src="/assets/img/icons/plus.svg" alt="plus" />
                                </Link>
                              )}
                              </div>
                            </div>
                          </div>
                        </div>


                        <div className="pageDropDown col-auto text-end ms-auto download-grp">
                        <DropDown
                          limit={limit}
                          onLimitChange={(val) => {
                            setLimit(val);
                            setCurrentPage(1); // reset to first page
                            setDisable(true);  // force reload
                          }}
                        />
                        </div>
                      </div>
                    </div>

                    {disable === false ? (
                      <>
                        <div className="table-responsive">
                      
                      <table className="table border-0 custom-table comman-table mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Packing No</th>
                            <th>Supplier</th>
                            <th>Vehicle</th>
                            <th>Receiving Date</th>
                            <th>Status</th>
                            {localStorage.getItem('ERP_ROLE') === M_CON && <th>To QC</th>}
                            {/* Show QC Actions column only for QC */}
                            {localStorage.getItem("ERP_ROLE") === QC && <th>QC Actions</th>}

                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) => (
                            <tr key={i}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem.package_list_no}</td>
                              <td>{elem.supplier}</td>
                              <td>{elem.vehicle_number}</td>
                              <td>{moment(elem.receiving_date).format('YYYY-MM-DD')}</td>
                              <td>
                                {elem.status === 2 ? ( 
                                  <span className="custom-badge status-green">Completed</span>
                                ):elem.status === 4 ? (
                                  <span className="custom-badge status-orange">Partially Completed</span>
                                ):elem.status === 3 ? (
                                  <span className="custom-badge status-red">Rejected</span>
                                ):elem.send_to_qc === true ? (
                                  <span className="custom-badge status-green">Sent to QC</span>
                                ) : elem.items && elem.items.length > 0 ? (
                                  <span className="custom-badge status-orange">Ready for QC</span>
                                ) : (
                                  <span className="custom-badge status-pink">Pending</span>
                                )}
                              </td>
                              {localStorage.getItem('ERP_ROLE') === M_CON && (
                                  <td>
                                    {elem.send_to_qc === true  || elem.status === 2 ? (
                                      ''
                                    ): (
                                      <span style={{ cursor: "pointer" }} onClick={() => handleSendQc(elem?._id, elem?.package_list_no)}>
                                          <SendHorizontal />
                                      </span>
                                    )}
                                  </td>
                              )}
                             {localStorage.getItem("ERP_ROLE") === QC && (
                                <td>
                                  {elem.send_to_qc === true && elem.status !== 2 && elem.status !== 3 && elem.status !== 4  ? (
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() =>
                                        navigate("/piping/user/fim-packing-verification", { state: elem })
                                      }
                                    >
                                      Verify
                                    </button>
                                  ) : (
                                    ''
                                  )}
                                </td>
                              )}
                              <td className="text-end">
                                <div className="dropdown dropdown-action">
                                  <a
                                    href="#"
                                    className="action-icon dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="fa fa-ellipsis-v"></i>
                                  </a>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    {/* <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => navigate('/piping/user/fim-packing-details', { state: elem })}
                                    >
                                      <i className="fa-solid fa-eye m-r-5"></i>
                                      View
                                    </button> */}
                                    {elem.send_to_qc === false && localStorage.getItem("ERP_ROLE") === M_CON && (
                                     <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => navigate('/piping/user/manage-fim-packing', { state: elem })}
                                    >
                                      <i className="fa-solid fa-pencil m-r-5"></i>
                                      Edit
                                    </button>
                                    )}
                                 <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => handleDownloadPdf(elem)}
                                  >
                                    <i className="fa-solid fa-file-pdf m-r-5"></i> Download PDF
                                  </button>
                                  {(elem.status === 2 || elem.status === 4) && (
                                    <button
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => handleDownloadIMIRPdf(elem)}
                                    >
                                      <i className="fa-solid fa-file-pdf m-r-5"></i> Download IMIR PDF
                                    </button>
                                  )}

                                  {/* <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => handleDownloadExcel(elem)}
                                  >
                                    <i className="fa-solid fa-file-excel m-r-5"></i> Download Excel
                                  </button> */}
                                    
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}

                          {commentsData?.length === 0 && (
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
                                     onPageChange={(page) => {
                                      setCurrentPage(page);
                                      setDisable(true);
                                    }}
                                />
                            </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FimPackingList;
