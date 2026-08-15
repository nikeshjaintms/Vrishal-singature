import React, { useEffect, useMemo, useState } from 'react'
import { Save, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getMultiLPTOfferTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/LptClearance/LptOfferTable';
import { removeRTTable } from '../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable';
import toast from 'react-hot-toast';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { V_URL } from '../../../../../../BaseUrl';
import Swal from "sweetalert2";
import axios from 'axios';
import { getUserWeldHardnessPiping } from '../../../../../../Store/Piping/WeldHardness/WeldHardnessPiping';

const HtOfferTable = ({ setSubmitArr }) => {

  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    pwht_stage: '',
    remarks: '',
  });

  const htData = useSelector((state) => state.getUserHt?.user?.data);

  useEffect(() => {
    setTableData(htData || []);
    setSubmitArr(htData || []);
  }, [htData, setSubmitArr]);

  const commentsData = useMemo(() => {
    let computedComments = tableData;
    if (search) {
      computedComments = computedComments.filter(
        (item) =>
          item.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
          (Array.isArray(item.joint_no) ? item.joint_no.join(', ') : item.joint_no)?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, tableData]);

  const handleEditFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEditFormData({
      ...editFormData,
      // [name]: value,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      pwht_stage: row.pwht_stage || '',
      remarks: row.remarks || '',
    })
  }

  const handleSaveClick = async () => {
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    const row = tableData[dataIndex];
    const targetId = row._id || row.id;
    const projectId = localStorage.getItem("U_PROJECT_ID");

    if (!editFormData.pwht_stage) {
      return toast.error("Please select a PWHT stage");
    }

    if (!targetId || !projectId) {
      return toast.error("Required data missing");
    }

    const updateData = new URLSearchParams();
    updateData.append("main_id", row?.main_id);
    updateData.append("main_item_id", row?.main_item_id);
    updateData.append("id", targetId);
    updateData.append("project_id", projectId);
    updateData.append("remarks", editFormData.remarks);
    updateData.append("pwht_stage", editFormData.pwht_stage);

    try {
      const response = await axios.post(
        `${V_URL}/user/piping-update-multi-ht-offer`,
        updateData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data?.success) {
        toast.success("Remarks updated successfully");
        const updatedData = [...tableData];
        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
        setTableData(updatedData);
        setSubmitArr(updatedData);
        setEditRowIndex(null);
      } else {
        toast.error(response.data?.message || "Failed to update remarks");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || "Server error occurred");
    }
  }

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTableData([]);
  }

  const handleRemoveByDrawing = async (elem) => {
    // 1. Get the target ID
    const targetId = elem._id || elem.id;

    if (!targetId) {
      return toast.error("Invalid Item: No ID found");
    }

    // 2. Get project_id from localStorage
    const projectId = localStorage.getItem("U_PROJECT_ID");

    if (!projectId) {
      return toast.error("Project ID not found");
    }

    // 3. Show confirmation popup
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action will remove the HT Offer permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    // 4. Prepare the form data
    const removeItem = new URLSearchParams();
    removeItem.append("main_id", elem?.main_id);
    removeItem.append("main_item_id", elem?.main_item_id);
    removeItem.append("id", targetId);
    removeItem.append("project_id", projectId);

    try {
      const response = await axios.post(
        `${V_URL}/user/piping-delete-multi-ht-offer`,
        removeItem,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data?.success) {
        toast.success("HT Offer removed successfully");

        // 5. Update local table state
        const updatedData = tableData.filter(item =>
          (item._id !== targetId) && (item.id !== targetId)
        );
        setTableData(updatedData);

        // 6. Keep parent submit array in sync
        setSubmitArr(updatedData);
            dispatch(getUserWeldHardnessPiping({ page: currentPage, limit: limit, search: search }));

      } else {
        toast.error(response.data?.message || "Failed to delete item");
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || "Server error occurred");
    }
  };

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
                        {/* <div className="add-group">
                          <button type='button' onClick={handleRefresh}
                            className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                              src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                    {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table  mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Drawing No./Line No.</th>
                      <th>Rev</th>
                      <th>Spool No.</th>
                      <th>Joint No.</th>
                      <th>Stage</th>
                      <th>Piping Material Specification</th>
                      <th>Size</th>
                      <th>Thickness</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) =>
                      <tr key={i}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>
                        <td>{elem?.drawing_no}</td>
                        <td>{Array.isArray(elem?.rev) ? elem.rev.join(', ') : elem?.rev}</td>
                        <td>{elem?.spool_no}</td>
                        <td>{Array.isArray(elem?.joint_no) ? elem.joint_no.join(', ') : elem?.joint_no}</td>

                        <td>
                          {editRowIndex === i ? (
                            <select
                              className="form-control"
                              name="pwht_stage"
                              value={editFormData.pwht_stage}
                              onChange={handleEditFormChange}
                            >
                              <option value="">Select Stage</option>
                              <option value="Before PWHT">Before PWHT</option>
                              <option value="After PWHT">After PWHT</option>
                              <option value="Final Weld">Final Weld</option>
                            </select>
                          ) : (
                            <span onClick={() => handleEditClick(i, elem)} style={{ cursor: 'pointer' }}>
                              {elem?.pwht_stage || "--"}
                            </span>
                          )}
                        </td>

                        <td>{elem?.material_specification}</td>
                        <td>{elem?.size}</td>
                        <td>{elem?.thickness}</td>

                        <td>
                          {editRowIndex === i ? (
                            <input
                              type="text"
                              className="form-control"
                              name="remarks"
                              value={editFormData.remarks}
                              onChange={handleEditFormChange}
                              placeholder="Remarks"
                            />
                          ) : (
                            <span onClick={() => handleEditClick(i, elem)} style={{ cursor: 'pointer' }}>
                              {elem?.remarks || "--"}
                            </span>
                          )}
                        </td>

                        {/* ACTION BUTTONS */}
                        {editRowIndex === i ? (
                          <td>
                            <button
                              type="button"
                              className="btn btn-success p-1 mx-1"
                              onClick={handleSaveClick}
                            >
                              <Save />
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary p-1 mx-1"
                              onClick={handleCancelClick}
                            >
                              <X />
                            </button>
                          </td>
                        ) : (
                          <td className="text-end">
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
                {/* <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                  <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                </div> */}
                {/* <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                  <div className="dataTables_paginate paging_simple_numbers"
                    id="DataTables_Table_0_paginate">
                    <Pagination
                      total={totalItems}
                      itemsPerPage={limit}
                      currentPage={currentPage}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HtOfferTable