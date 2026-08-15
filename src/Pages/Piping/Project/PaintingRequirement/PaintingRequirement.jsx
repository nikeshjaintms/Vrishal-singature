import React, { useEffect, useMemo, useState } from 'react'
import Footer from '../../Include/Footer';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Include/Loader';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { getUserPaintRequirementMaster } from '../../../../Store/Piping/PaintRequirementMaster/PaintRequirementMaster';
import Swal from 'sweetalert2';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PaintAuth } from '../../../../Routes/Users/Auth/AuthGuard';

const useDebounce = (value, delay = 2000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const PaintingRequirement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [disable, setDisable] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearch = useDebounce(search, 2000);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  const { data = [], total = 0, loading, error } = useSelector(
    (state) => state.getUserPaintRequirementMaster || {}
  );


  const fetchData = async () => {
    dispatch(getUserPaintRequirementMaster({ page: currentPage, limit, search: debouncedSearch }));
  };

  // Fetch on mount and whenever search, page, or limit changes
  useEffect(() => {
    fetchData();
  }, [currentPage, limit, debouncedSearch]);

  const commentsData = useMemo(() => {
  let computedComments = data;

  if (search) {
    const searchLower = search.toLowerCase();

    computedComments = computedComments.filter((i) => {
      const pipingClassMatch = i?.pipingClass?.PipingClass?.toLowerCase()?.includes(searchLower);
      const specificationMatch = i?.piping_material_specifiation?.toLowerCase()?.includes(searchLower);
      const blastingMatch = i?.blasting_painting_requirements?.toLowerCase()?.includes(searchLower);
      const paintSystemMatch = i?.paint_system_no?.toLowerCase()?.includes(searchLower);

      // Check if any service name includes the search term
      const serviceMatch = i?.service?.some(svc => svc?.toLowerCase()?.includes(searchLower));

      return pipingClassMatch || specificationMatch || blastingMatch || paintSystemMatch || serviceMatch;
    });
  }

  setTotalItems(computedComments?.length);

  return computedComments?.slice(
    (currentPage - 1) * limit,
    (currentPage - 1) * limit + limit
  );
}, [currentPage, search, limit, data]);


  console.log("🖨️ Final commentsData:", commentsData);


  const handleRefresh = () => {
    setSearch('');
    setDisable(true);
    fetchData();
  }

  const handleDelete = (id, title) => {
  Swal.fire({
    title: `Are you sure you want to delete ${title}?`,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      const myurl = `${V_URL}/user/delete-paint-requirement/${id}`;

      axios.delete(myurl, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'),
        },
      })
        .then((response) => {
          if (response.data.success) {
            toast.success(response?.data?.message);
            fetchData(); // reload table
          } else {
            toast.error(response?.data?.message);
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        });
    }
  });
};


  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
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
                  <li className="breadcrumb-item active">Painting requirement List</li>
                </ul>
              </div>
            </div>
          </div>

          {loading ? <Loader /> : (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Paint Requirement Master List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }} />
                                  <a className="btn"><img src="/assets/img/icons/search-normal.svg" alt="search" /></a>
                                </form>
                              </div>
                              <div className="add-group">
                                <PaintAuth>
                                  <Link to="/piping/user/manage-painting-requirement"
                                    className="btn btn-primary add-pluss ms-2"
                                    title="Add">
                                    <img src="/assets/img/icons/plus.svg" alt="plus-icon" />
                                  </Link>
                                </PaintAuth>
                                <button type='button' onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                  title="Refresh">
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Piping Class</th>
                            <th>Blasting - Painting Requirements</th>
                            <th>Paint System No.</th>
                            <PaintAuth>
                              <th className="text-end">Action</th>
                            </PaintAuth>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) => (
                            <tr key={elem?._id}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.pipingClass?.PipingClass}</td>
                              <td>{elem?.blasting_painting_requirements}</td>
                              <td>{elem?.paint_system_no}</td>
                              <PaintAuth>
                                <td className="text-end">
                                  <div className="dropdown dropdown-action">
                                    <a href="#" className="action-icon dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                      <i className="fa fa-ellipsis-v"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-end">
                                      <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => navigate('/piping/user/manage-painting-requirement', { state: elem })}>
                                        <i className="fa-solid fa-pen-to-square m-r-5"></i> Edit
                                      </button>
                                      <button
                                        type='button'
                                        className="dropdown-item"
                                        onClick={() => handleDelete(elem?._id, elem.pipingClass)}>
                                        <i className="fa fa-trash-alt m-r-5"></i> Delete
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </PaintAuth>
                            </tr>
                          ))}

                          {commentsData?.length === 0 && (
                            <tr>
                              <td colSpan="999">
                                <div className="no-table-data">
                                  No Data Found!
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="row align-center mt-3 mb-2">
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_info">
                          Showing {Math.min(limit, totalItems)} from {totalItems} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_paginate paging_simple_numbers">
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
          )}

        </div>
        <Footer />
      </div>
    </div>
  )
}

export default PaintingRequirement
// export default PaintingRequirement;                                          