import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { Save, X } from 'lucide-react';
import { getFdTable } from '../../../../../Store/MutipleDrawing/MultiFd/getFdTable';
import toast from 'react-hot-toast';
import { removeFdTable } from '../../../../../Store/MutipleDrawing/MultiFd/removeFdTable';
import { updateNdtGrid } from '../../../../../Store/MutipleDrawing/MultiFd/updateNdtGrid';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';

const MultiFdTable = ({ data = {}, finalArr = [], setSubmitArr = () => {} }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ required_dimension: '', remarks: '' });

  const project_id = localStorage.getItem('U_PROJECT_ID');
  const issue_ids  = JSON.parse(localStorage.getItem('issue_acc_ids') || "[]");
  const ndt_ids    = JSON.parse(localStorage.getItem('ndt_master_ids') || "[]");

  const getFDOfferTable = useCallback(() => {
    const formData = new URLSearchParams();
    formData.append('project', project_id);
    formData.append('issue_acc_id', localStorage.getItem('issue_acc_ids') ? localStorage.getItem('issue_acc_ids') : []);
    formData.append('ndt_master_id', localStorage.getItem('ndt_master_ids') ? localStorage.getItem('ndt_master_ids') : []);
    dispatch(getFdTable({ bodyFormData: formData }));
    dispatch(getMultipleIssueAcc());
  }, [dispatch, project_id]);

  useEffect(() => {
    getFDOfferTable();
  }, [getFDOfferTable, finalArr.length, issue_ids.length, ndt_ids.length]);

  const fdTableData = useSelector((state) => state?.getFdTable?.user?.data);

  useEffect(() => {
    const filterFdTable = (fdTableData?.items || []).filter((item) => !item.required_dimension);
    if (filterFdTable?.length > 0 && !data?._id) {
      setTableData(filterFdTable);
      setSubmitArr(filterFdTable);
    } else if (data?.items?.length > 0) {
      setTableData(data.items);
      setSubmitArr(data.items);
    } else {
      setTableData([]);
      setSubmitArr([]);
    }
  }, [finalArr, data, fdTableData, setSubmitArr]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    if (dataIndex >= 0 && dataIndex < updatedData.length) {
      updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
      setTableData(updatedData);
      setSubmitArr(updatedData);
    }
    setEditRowIndex(null);
  }

  const handleCancelClick = () => setEditRowIndex(null);

  const filteredComments = useMemo(() => {
    let computedComments = tableData || [];
    if (search && search.trim()) {
      const s = search.trim();
      computedComments = computedComments.filter(dr =>
        String(dr?.drawing_id?.drawing_no || '').toLowerCase().includes(s.toLowerCase())
      );
    }
    return computedComments;
  }, [tableData, search]);

  const commentsData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return (filteredComments || []).slice(start, start + limit);
  }, [filteredComments, currentPage, limit]);

  useEffect(() => {
    setTotalItems((filteredComments || []).length);
    setCurrentPage(prev => {
      const max = Math.max(1, Math.ceil(((filteredComments || []).length || 0) / limit));
      return Math.min(prev, max);
    });
  }, [filteredComments, limit]);

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      required_dimension: row.required_dimension || '',
      remarks: row.remarks || '',
    });
  }

  const handleRemoveByDrawing = async (gridId, report, ndt_master_id, issue_acc_id) => {
    const updatedIssueArr = (tableData || []).filter((tb) => String(tb?.grid_id?._id) === String(gridId));

    const filterRemoveData = updatedIssueArr?.map((e) => ({
      drawing_id: e?.drawing_id?._id,
      grid_id: e?.grid_id?._id,
      fd_used_grid_qty: e?.fd_used_grid_qty,
      fd_balanced_grid_qty: e?.fd_balanced_grid_qty,
    }));

    const formData = new URLSearchParams();
    formData.append('flag', 0);
    formData.append('items', JSON.stringify(filterRemoveData));
    formData.append('issue_acc_id', JSON.stringify(issue_acc_id));
    formData.append('ndt_master_id', JSON.stringify(ndt_master_id));

    const removeItem = new URLSearchParams();
    removeItem.append('issue_acc_id', JSON.stringify(issue_acc_id));
    removeItem.append('ndt_master_id', JSON.stringify(ndt_master_id));
    removeItem.append('items', JSON.stringify(filterRemoveData))
    removeItem.append('fd_offer_no', report);

    try {
      await dispatch(updateNdtGrid({ bodyFormData: formData }));
      await dispatch(removeFdTable({ bodyFormData: removeItem }));
      getFDOfferTable();
      toast.success("Item has been removed!");
    } catch (error) {
      toast.error('Error while removing');
    }
  }

  return (
    <>
      <div className='row'>
        <div className="col-sm-12">
          <div className="card card-table show-entire">
            <div className="card-body">
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Section Details List</h3>
                      <div className="doctor-search-blk">
                        <div className="top-nav-search table-search-blk">
                          <form>
                            <Search onSearch={(value) => { setSearch(String(value || '').toLowerCase()); setCurrentPage(1); }} />
                            <a className="btn"><img src="/assets/img/icons/search-normal.svg" alt="search" /></a>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ DROPDOWN ADDED HERE */}
                  <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                    <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                  </div>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="table border-0 custom-table comman-table mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Drawing No.</th>
                      <th>Rev</th>
                      <th>Assembly No.</th>
                      <th>Assembly Qty.</th>
                      <th>Grid No.</th>
                      <th>Grid Qty.</th>
                      <th>Used Grid Qty.</th>
                      <th>Required Dimensions</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {commentsData?.map((elem, i) =>
                      <tr key={i}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        <td>{elem?.drawing_id?.drawing_no}</td>
                        <td>{elem?.drawing_id?.rev}</td>
                        <td>{elem?.drawing_id?.assembly_no}</td>
                        <td>{elem?.drawing_id?.assembly_quantity}</td>
                        <td>{elem?.grid_id?.grid_no}</td>
                        <td>{elem?.grid_id?.grid_qty}</td>
                        <td>{elem?.fd_used_grid_qty}</td>

                        {!data?._id ? (
                          <>
                            {editRowIndex === i ? (
                              <>
                                <td>
                                  <input className='form-control' type='text'
                                    value={editFormData?.required_dimension} name='required_dimension'
                                    onChange={handleEditFormChange} />
                                </td>
                                <td>
                                  <textarea className='form-control' rows={1}
                                    value={editFormData?.remarks} name='remarks'
                                    onChange={handleEditFormChange} />
                                </td>
                              </>
                            ) : (
                              <>
                                <td onClick={() => handleEditClick(i, elem)}>{elem?.required_dimension || '-'}</td>
                                <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <td>{elem?.required_dimension || '-'}</td>
                            <td>{elem?.remarks || '-'}</td>
                          </>
                        )}

                        {editRowIndex === i ? (
                          <td>
                            <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                            <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                          </td>
                        ) : (
                          <td className='text-end'>
                            {!data?._id ? (
                              <button
                                type="button"
                                className="btn btn-danger p-1 mx-1"
                                onClick={() => handleRemoveByDrawing(elem?.grid_id?._id, elem.fd_offer_no, elem.ndt_master_id, elem.issue_acc_id)}
                              >
                                Remove
                              </button>
                            ) : '-'}
                          </td>
                        )}
                      </tr>
                    )}

                    {commentsData?.length === 0 ? (
                      <tr>
                        <td colSpan="999">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="row align-center mt-3 mb-2">
                <div className="col-sm-12 col-md-6">
                  <div className="dataTables_info" role="status" aria-live="polite">
                    Showing {(currentPage - 1) * limit + 1} -{' '}
                    {Math.min(currentPage * limit, totalItems)} of {totalItems} entries
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
    </>
  )
}

export default MultiFdTable;
