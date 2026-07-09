import React, { useEffect, useMemo, useState } from 'react'
import { Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getMultiMPTOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/MptClearance/MptOfferTable';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import moment from 'moment';

const MptOfferTable = ({ setSubmitArr, mptOffers, handleRemoveOffer }) => {

  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true); // Initialize as true or based on props if available
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    remarks: '',
  });

  useEffect(() => {
    if (mptOffers) {
      setTableData(mptOffers);
      setLoading(false);
    }
  }, [mptOffers]);

  // Filter & Pagination logic for tableData (local state)
  const commentsData = useMemo(() => {
    let computedData = tableData || [];
    if (search) {
      computedData = computedData.filter(
        (item) =>
          item.drawing_no?.toLowerCase().includes(search.toLowerCase()) ||
          item.joint_no?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setTotalItems(computedData.length);
    return computedData.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [tableData, currentPage, search, limit]);


  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      remarks: row.remarks || '', // Use remarks consistent with other logic
    });
  }

  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
    setTableData(updatedData);
    setSubmitArr(updatedData); // Update parent state with modified data
    setEditRowIndex(null);
  }

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleRefresh = () => {
    // Optional: if parent handles refresh, we might just re-sync via useEffect
    // For now keeping consistent with existing logic if any
  }

  const handleRemoveByDrawing = (elem) => {
    if (handleRemoveOffer) {
      handleRemoveOffer(elem);
    }
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
                      <h3>Item List</h3>
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

              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Lot No</th>
                      <th>Drawing No./Line No.</th>
                      <th>Spool No.</th>
                      <th>Joint No.</th>
                      <th>Size</th>
                      <th>Thickness</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {commentsData?.map((elem, i) => (
                      <tr key={elem?._id || i}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        <td>{elem?.mpt_lot_no || '-'}</td>
                        <td>{elem?.drawing_no || '-'}</td>
                        <td>{elem?.spool_no || '-'}</td>
                        <td>{elem?.joint_no || '-'}</td>
                        <td>{elem?.size || '-'}</td>
                        <td>{elem?.thickness || '-'}</td>

                        {editRowIndex === i ? (
                          <td>
                            <textarea
                              className='form-control'
                              rows={1}
                              value={editFormData?.remarks}
                              name='remarks'
                              onChange={handleEditFormChange}
                            />
                          </td>
                        ) : (
                          <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                        )}

                        {editRowIndex === i ? (
                          <td>
                            <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                            <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                          </td>
                        ) : (
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger p-1 mx-1"
                              onClick={() => handleRemoveByDrawing(elem)}
                            >
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}

                    {/* No Data Found */}
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

export default MptOfferTable
