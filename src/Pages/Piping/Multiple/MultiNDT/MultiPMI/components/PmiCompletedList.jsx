import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { PdfDownloadErp } from '../../../../../../Components/ErpPdf/PdfDownloadErp';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { getUserPmiAdded } from '../../../../../../Store/Piping/Ndt/PMI/PmiOfferadded';

const PmiCompletedList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);

  // const pmiAddedResponse = useSelector((state) => state.getUserPmiAdded?.user);
  const pmiAddedResponse = useSelector(
  (state) => state.getUserPmiAdded.dataByStatus.ALL
);
console.log("pmiAddedResponse======>",pmiAddedResponse);

  const pmiAddedData = pmiAddedResponse?.data || [];
  
console.log("pmiAddedData======>",pmiAddedData);

  const pagination = pmiAddedResponse?.pagination;

  // Fetch PMI added data when component mounts
  // Fetch PMI added data when component mounts or filters change
  useEffect(() => {
    dispatch(getUserPmiAdded({ page: currentPage, limit, search }));
  }, [dispatch, currentPage, limit, search]);

  const commentsData = useMemo(() => {
    const items = Array.isArray(pmiAddedData) ? pmiAddedData : [];
console.log("items======>",items);
    // Grouping logic to prevent duplicate report numbers
    const groups = items.reduce((acc, item) => {
      const key = item.report_no;
      if (!acc[key]) {
        const drawingSet = new Set();
        const spoolSet = new Set();

        if (item.items && Array.isArray(item.items)) {
          item.items.forEach(subItem => {
            if (subItem.drawing_no) drawingSet.add(subItem.drawing_no);
            if (subItem.spool_no) spoolSet.add(subItem.spool_no);
          });
        }

        acc[key] = {
          ...item,
          items: [item],
          drawing_nos: drawingSet,
          spool_nos: spoolSet
        };
      } else {
        acc[key].items.push(item);
        if (item.items && Array.isArray(item.items)) {
          item.items.forEach(subItem => {
            if (subItem.drawing_no) acc[key].drawing_nos.add(subItem.drawing_no);
            if (subItem.spool_no) acc[key].spool_nos.add(subItem.spool_no);
          });
        }
      }
      return acc;
    }, {});

    return Object.values(groups).map(group => ({
      ...group,
      drawing_no_display: Array.from(group.drawing_nos).join(', '),
      spool_no_display: Array.from(group.spool_nos).join(', ')
    }));
  }, [pmiAddedData]);
console.log("commentsData=======>",commentsData);
  useEffect(() => {
    setTotalItems(pagination?.totalItems || 0);
  }, [pagination]);

  const handleDownloadOffer = (elem) => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('report_no', elem.report_no);
    bodyFormData.append('print_date', true);
    PdfDownloadErp({ apiMethod: 'post', url: 'download-one-multi-pmi-offer', body: bodyFormData });
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
                      <h3>Completed PMI Offer List</h3>
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
                      </div>
                    </div>
                  </div>
                  <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table  mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Drawing No.</th>
                      <th>Spool No.</th>
                      <th>Test Offer No.</th>
                      <th>Offer Date</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) =>
                      <tr key={elem?._id}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        <td>{elem?.drawing_no_display || '-'}</td>
                        <td>{elem?.spool_no_display || '-'}</td>
                        <td>{elem?.report_no || '-'}</td>
                        <td>{elem?.offer_date ? moment(elem?.offer_date).format('YYYY-MM-DD HH:mm') : '-'}</td>
                        <td className='status-badge'>
                          {elem.status === 1 ? (
                            <span className="custom-badge status-orange">Pending</span>
                          ) : elem.status === 2 ? (
                            <span className="custom-badge status-green">Accepted</span>
                          ) : elem.status === 3 ? (
                            <span className="custom-badge status-pink">Rejected</span>
                          ) : elem.status === 4 ? (
                            <span className="custom-badge status-purple">Partially</span>
                          ) : null}
                        </td>
                        <td className="text-end">
                          <div className="dropdown dropdown-action">
                            <a href="#" className="action-icon dropdown-toggle"
                              data-bs-toggle="dropdown" aria-expanded="false"><i
                                className="fa fa-ellipsis-v"></i></a>
                            <div className="dropdown-menu dropdown-menu-end">
                              {/* <button type='button' className="dropdown-item" onClick={() => navigate('/piping/user/manage-pmi-offer', { state: elem })}><i
                                className="fa-solid fa-pen-to-square m-r-5"></i>
                                Edit</button> */}
                              <button type='button' className="dropdown-item" onClick={() => handleDownloadOffer(elem)} >
                                <i className="fa-solid fa-download  m-r-5"></i> Download Offer</button>
                            </div>
                          </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PmiCompletedList