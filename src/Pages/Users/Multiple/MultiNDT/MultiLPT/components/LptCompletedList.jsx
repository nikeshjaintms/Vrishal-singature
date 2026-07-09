import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getMultiNdtOffer } from '../../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { getUserNdtMaster } from '../../../../../../Store/Store/Ndt/NdtMaster';
import { PdfDownloadErp } from '../../../../../../Components/ErpPdf/PdfDownloadErp';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import Loader from '../../../../Include/Loader';

const LptCompletedList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    dispatch(getUserNdtMaster({ status: true })).then((response) => {
      const ndtData = response.payload?.data;
      const findNdt = ndtData?.find((nt) => nt?.name === 'LPT');
      if (findNdt && disable) {
        dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
        setDisable(false);
      }
    }).catch((error) => console.error("Error fetching NDT Master data:", error));
  }, [disable]);

  const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);
  const commentsData = useMemo(() => {
    let computedComments = entity;
    computedComments = computedComments?.filter((rt) => rt.status === 2 || rt.status === 3 || rt.status === 4 || rt.status === 5);
    if (search) {
      const lowerSearch = search.toLowerCase();
      computedComments = computedComments?.filter(
        (lpt) => {
          const drawingNos = lpt?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no)?.filter(Boolean) || [];
          const assemblyNos = lpt?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no)?.filter(Boolean) || [];
          return (
            lpt.ndt_offer_no?.toString().toLowerCase()?.includes(search?.toLowerCase()) ||
            drawingNos.some(drawingNo => drawingNo.toLowerCase().includes(lowerSearch)) ||
            assemblyNos.some(assemblyNo => assemblyNo.toLowerCase().includes(lowerSearch))
          )
        }
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);

  const handleDownloadOffer = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('ndt_offer_no', elem.ndt_offer_no);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'download-one-multi-ndt-offer', body: bodyFormData });
  }

  const handleRefresh = () => {
    setDisable(true)
  }

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table show-entire">
            <div className="card-body">

              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Completed LPT Offer List</h3>
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
                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                  </div>
                </div>
              </div>

              {disable === false ?
                <>
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No.</th>
                          <th>Assem. No.</th>
                          <th>Test Offer No.</th>
                          <th>Offer Date</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, i) =>
                          <tr key={elem?._id}>
                            <td>{(currentPage - 1) * limit + i + 1}</td>
                            <td>{[...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.drawing_no))].join(', ')}</td>
                            <td>{[...new Set(elem?.items?.map(e => e?.grid_item_id?.drawing_id?.assembly_no))].join(', ')}</td>
                            <td>{elem?.ndt_offer_no || '-'}</td>
                            <td>{elem?.report_date ? moment(elem?.report_date).format('YYYY-MM-DD HH:mm') : '-'}</td>
                            <td>{elem?.ndt_type_id?.name}</td>
                            <td className='status-badge'>
                              {elem.status === 1 ? (
                                <span className="custom-badge status-orange">Pending</span>
                              ) : elem.status === 3 ? (
                                <span className="custom-badge status-green">Accepted</span>
                              ) : elem.status === 4 ? (
                                <span className="custom-badge status-pink">Rejected</span>
                              ) : elem.status === 2 ? (
                                <span className='custom-badge status-blue'>Send For Clearance</span>
                              ) : elem.status === 5 ? (
                                <span className="custom-badge status-purple">Partially</span>
                              ) : null}
                            </td>
                            <td className="text-end">
                              <div className="dropdown dropdown-action">
                                <a href="#" className="action-icon dropdown-toggle"
                                  data-bs-toggle="dropdown" aria-expanded="false"><i
                                    className="fa fa-ellipsis-v"></i></a>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <button type='button' className="dropdown-item" onClick={() => navigate('/user/project-store/manage-lpt-offer', { state: elem })}><i
                                    className="fa-solid fa-pen-to-square m-r-5"></i>
                                    Edit</button>
                                  <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
                                    <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {commentsData?.length === 0 ? (
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
                : <Loader />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LptCompletedList