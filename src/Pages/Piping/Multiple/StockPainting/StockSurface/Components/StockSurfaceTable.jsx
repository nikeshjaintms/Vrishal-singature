import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { V_URL } from '../../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getPipingMultiStockSurface } from '../../../../../../Store/Piping/MultiStockSurface/GetMultiStockSurface';
import { Save, X } from 'lucide-react';
import { getPipingStockDispatchNotes } from '../../../../../../Store/Piping/StockDispatchNote/GetStockDispatchNote';
import { getPipingMultiStockDispatchPaint } from '../../../../../../Store/Piping/MultiStockSurface/GetMultiStockDispatchNotePaint';


const SurfaceTable = ({
  tableData = [],       // data passed from parent
  setSubmitArr,         // callback to update parent
  data,                 // some parent data
  refreshTable,
  report_no              // optional callback
}) => {


  console.log('tableData', tableData);
  console.log('data', data);
  const dispatch = useDispatch();
  const [localTableData, setLocalTableData] = useState(tableData);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(tableData.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ remarks: '' });

  // Keep local data in sync when parent updates
  useEffect(() => {
    setLocalTableData(tableData);
  }, [tableData]);

  // Filter & paginate
  const commentsData = useMemo(() => {
    let computedComments = localTableData;
    if (search) {
      const s = search.toLowerCase();
      computedComments = computedComments.filter(
        (dr) =>
          (dr?.drawing_no?.toLowerCase() || '').includes(s) ||
          (dr?.assembly_no?.toLowerCase() || '').includes(s)
      );
    }
    setTotalItems(computedComments.length);
    return computedComments.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [localTableData, search, currentPage, limit]);

  // Edit handlers
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({ remarks: row.remarks || '' });
  };

  const handleSaveClick = async () => {
    const updatedData = [...localTableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };

    setLocalTableData(updatedData);  // update local state
    setSubmitArr(updatedData);        // sync with parent
    setEditRowIndex(null);

    // API call
    const updatedItem = updatedData[dataIndex];
    if (!updatedItem) return;

    const bodyFormData = new URLSearchParams();
    bodyFormData.append('items', JSON.stringify({ remarks: updatedItem.remarks }));
    bodyFormData.append('id', updatedItem._id);
    bodyFormData.append('item_detail_id', updatedItem.item_detail_id);

    try {
      const response = await axios.post(
        `${V_URL}/user/piping-update-multi-surface-offer`,
        bodyFormData,
        { headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") } }
      );

      if (response.data.success) {
        toast.success("Item updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleCancelClick = () => setEditRowIndex(null);

  const handleRemoveByDrawing = async (elem) => {
    if (!elem?._id) return toast.error("Invalid surface offer");

    const removeItem = new URLSearchParams();
    removeItem.append("id", elem._id);
    removeItem.append("project_id", localStorage.getItem('U_PROJECT_ID'));

    try {
      const response = await axios.post(
        `${V_URL}/user/piping-delete-multi-stock-surface-offer`,
        removeItem,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log('Delete response:', response.data);

      if (response.data?.success) {
        toast.success(response.data.message);
        const filteredData = localTableData.filter(d => d._id !== elem._id);
        setLocalTableData(filteredData);
        setSubmitArr(filteredData);

         const refetch = {
                    // report_no: report_no,
                    project: localStorage.getItem("U_PROJECT_ID"),
                     page: currentPage || 1,
  limit: limit || 10,
  search: search || "",
                }

          
       dispatch(getPipingMultiStockDispatchPaint(refetch))
        try {
          await dispatch(
              getPipingMultiStockSurface({ report_no: elem.report_no || report_no, dispatch_id: elem.dispatch_id, project:localStorage.getItem('U_PROJECT_ID')})
          ).unwrap();
        } catch (err) {
            console.error("Error fetching multi surface:", err);
        }

        // Safe call to refreshTable
        if (typeof refreshTable === "function") {
          refreshTable();
        }
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      const message = error.response?.data?.message || error.message || "Something went wrong while removing item";
      toast.error(message);
    }
  };



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
                      <h3>Item Details List</h3>
                      <div className="doctor-search-blk">
                        <div className="top-nav-search table-search-blk">
                          <form>
                            <Search
                              onSearch={(value) => { setSearch(value.toLowerCase()); setCurrentPage(1); }}
                            />
                            <a className="btn">
                              <img src="/assets/img/icons/search-normal.svg" alt="search" />
                            </a>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                    <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} />

                  </div>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="table border-0 custom-table comman-table  mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Item</th>
                      <th>Size1</th>
                      <th>Thickness1</th>
                      <th>Size2</th>
                      <th>Thickness2</th>
                      <th>Material Grade</th>
                      <th>Piping Class </th>
                      <th>Qty</th>
                      {/* <th>Paint System No.</th> */}
                      {/* <th>Remarks</th> */}
                      <th className='text-end'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) =>
                      <tr key={i}>
                        <td>{i + 1}</td>
                        
                        <td>{elem?.item_name}</td>
                        <td>{elem?.size1}</td>
                        <td>{elem?.thickness1}</td>
                        <td>{elem?.size2}</td>
                        <td>{elem?.thickness2}</td>
                        <td>{elem?.material_grade}</td>
                        <td>{elem?.piping_class_name || elem?.piping_class}</td>
                        <td>{elem?.qty}</td>
                        {/* <td>{elem?.paint_system_no}</td> */}
                        {/* {!data?._id ? (
                          <>
                            {editRowIndex === i ? (
                              <td>
                                <textarea className='form-control' rows={1}
                                  value={editFormData?.remarks} name='remarks'
                                  onChange={handleEditFormChange} />
                              </td>
                            ) : (
                              <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                            )}
                          </>
                        ) : (
                          <td>{elem?.remarks || '-'}</td>
                        )}
                        {editRowIndex === i ? (
                          <td>
                            <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                            <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                          </td>
                        ) : ( */}
                        <td className='text-end'>
                          {!data?._id ? (
                            <button type="button" className="btn btn-danger p-1 mx-1" onClick={() => handleRemoveByDrawing(elem)}>Remove</button>
                          ) : '-'}
                        </td>
                        {/* )} */}
                      </tr>
                    )}
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
                  <div className="dataTables_info" role="status" aria-live="polite">
                    Showing {Math.min(limit, totalItems)} from {totalItems} data
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
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

export default SurfaceTable;
