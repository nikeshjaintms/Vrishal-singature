import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
// import { getWeldOfferTable } from '../../../../../Store/MutipleDrawing/MultiWeldVisual/getWeldOfferTable';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';

const MultiWeldTable = ({ data, fitupId, finalArr, setSubmitArr , setSearch,commentsData ,handleRemove, handleSaveClick }) => {
console.log("weld table commentsData",commentsData);
    const dispatch = useDispatch();
    // const [search, setSearch] = useState([]);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [limit, setlimit] = useState();
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [welders, setWelders] = useState([]);
    const [loadingWelders, setLoadingWelders] = useState(false);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        welder_no: '',
        remarks: '',
        weldorName: '',
    });

    // useEffect(() => {
    //     dispatch(getWeldOfferTable({ fitup_id: fitupId }));
    // }, [finalArr, fitupId]);

         useEffect(() => {
    const fetchWelders = async () => {
      setLoadingWelders(true);
      try {
        const token = localStorage.getItem("PAY_USER_TOKEN");
        const response = await axios.post(
          `${V_URL}/user/get-all-welder`,
          { page: 1, limit: 100, project: localStorage.getItem("U_PROJECT_ID"), search: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setWelders(response.data.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching welders:", err);
      } finally {
        setLoadingWelders(false);
      }
    };
    fetchWelders();
  }, []);
    


    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            welder_no: row.welder_no,
            remarks: row.remarks,
            // weldorName: welders.find(w => w._id === row.welder_no)?.welderNo,
            welder_no: typeof row.welder_no === "object"
  ? row.welder_no?._id
  : row.welder_no,

        })
    }

    
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        const selectedWeldor = welders.find(w => w._id === value);
        if (name === 'welder_no' || name === 'weldorName') {
            setEditFormData({ ...editFormData, welder_no: value, weldorName: selectedWeldor?.welderNo });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    }

    


    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

   
  const handleRefresh = () => {
    setLoading(true);
    setTableData([]);
  };
   return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card card-table show-entire">
          <div className="card-body">
            {/* Table Header */}
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
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Refresh"
                        >
                          <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                  <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                </div> */}
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table border-0 custom-table comman-table mb-0">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Drawing No.</th>
                    <th>Rev</th>
                    <th>Spool No.</th>
                    <th>Joint No.</th>
                    <th>Size</th>
                    <th>Thickness</th>
                    <th>Joint Type</th>
                    <th>Wps No</th>
                    <th>Welder No</th>
                    <th>Welding Process</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
  {commentsData?.length > 0 ? (
    (() => {
      let srNo = 1; 

      return commentsData.map((row, rowIndex) =>
        row.items.map((item, i) =>
          item.jointDetails.map((joint, j) => {
            const isEditing = editRowIndex === `${rowIndex}-${i}-${j}`;

            return (
              <tr
                key={`${rowIndex}-${i}-${j}`}
                onClick={() =>
                  handleEditClick(`${rowIndex}-${i}-${j}`, joint)
                }
              >
                {/* FIXED SR NO */}
                <td>{srNo++}</td>

                <td>{joint.drawing_no}</td>
                <td>{joint.rev || '-'}</td>
                <td>{joint.spool_no || '-'}</td>
                <td>{joint.joint_no || '-'}</td>
                <td>{joint.selected_size?.size_name || '-'}</td>
                <td>{joint.selected_thickness?.thickness || '-'}</td>
                <td>{joint.joint_type?.name || '-'}</td>
                <td>{joint.wps_no || '-'}</td>
    
{/* <td>
  {isEditing ? (() => {
    // Determine if the item is FitUp or RootDPT
    const isFitUpItem = !!item.fitUp_item_id;
    const isRootDptItem = !!item.rootDpt_item_id;

    // For RootDPT, disable the dropdown
    if (isRootDptItem) {
      return <input
        type="text"
        className="form-control"
        value={editFormData.welder_no || ''}
        disabled
      />;
    }

    // FITUP logic (editable)
    const matchedWelders = welders.filter((w) => 
      String(w.wpsNo) === String(joint.wps_id)
    );

    const welderOptions = matchedWelders.map(w => ({
      label: `${w.welderNo} (${w.name})`,
      value: w?._id
    }));

    return (
      <Dropdown
        options={welderOptions}
        value={editFormData.welder_no || ''}
        placeholder={
          welderOptions.length > 0
            ? 'Select Welder No'
            : 'No Welder for this WPS'
        }
        className="w-100"
        disabled={welderOptions.length === 0}
        onChange={(e) => {
          const selectedWelder = welders.find(w => w._id === e.value);

          setEditFormData(prev => ({
            ...prev,
            welder_no: e.value,
            weldorName: selectedWelder?.welderNo || '',
            welding_process: selectedWelder?.weldingProcess || selectedWelder?.wpsNo?.weldingProcess || ''
          }));
        }}
      />
    );
  })() : (
    joint.welder_no || '-'
  )}
</td> */}

<td>
  {isEditing ? (() => {
    const isRootDptItem = !!item.rootDpt_item_id;

    // If RootDPT AND welder already exists → disable
    if (isRootDptItem && joint.welder_no) {
      return (
        <input
          type="text"
          className="form-control"
          value={joint.welder_no}
          disabled
        />
      );
    }

    // Allow dropdown when welder_no is null
    const matchedWelders = welders
     .filter(w => w.status === true)
    .filter(
      w => String(w.wpsNo?._id) === String(joint.wps_id)
    );

    const welderOptions = matchedWelders.map(w => ({
      label: `${w.welderNo} (${w.name})`,
      value: w._id
    }));

    return (
      <Dropdown
        options={welderOptions}
        value={editFormData.welder_no || ''}
        placeholder={
          welderOptions.length
            ? 'Select Welder No'
            : 'No Welder for this WPS'
        }
        className="w-100"
        disabled={welderOptions.length === 0}
        onChange={(e) => {
          const selectedWelder = welders.find(
            w => w._id === e.value
          );

          setEditFormData(prev => ({
            ...prev,
            welder_no: e.value,
            weldorName: selectedWelder?.welderNo || '',
            welding_process:
              selectedWelder?.weldingProcess ||
              selectedWelder?.wpsNo?.weldingProcess ||
              ''
          }));
        }}
      />
    );
  })() : (
    joint.welder_no || '-'
  )}
</td>

              
{/* <td>
  {isEditing ? (() => {
    const isRootDptItem = !!item.rootDpt_item_id;

    if (isRootDptItem) {
      return (
        <input
          type="text"
          className="form-control"
          value={joint.welding_process || '-'}
          disabled
        />
      );
    }

    const matchedWelders = welders.filter(
      w => String(w.wpsNo) === String(joint.wps_id)
    );

    const weldingProcessOptions = matchedWelders
      .map(w => w.weldingProcess)
      .filter((v, i, a) => v && a.indexOf(v) === i)
      .map(v => ({ label: v, value: v }));

    return (
      <Dropdown
        options={weldingProcessOptions}
        value={editFormData.welding_process || ''}
        placeholder={
          weldingProcessOptions.length
            ? 'Select Welding Process'
            : 'No Welding Process'
        }
        className="w-100"
        disabled={weldingProcessOptions.length === 0}
        onChange={(e) =>
          setEditFormData(prev => ({
            ...prev,
            welding_process: e.value
          }))
        }
      />
    );
  })() : (
    joint.welding_process || '-'
  )}
</td> */}

<td>
  {isEditing ? (() => {
    const isRootDptItem = !!item.rootDpt_item_id;

    // If RootDPT AND already has welding process → disable
    if (isRootDptItem && joint.welding_process) {
      return (
        <input
          type="text"
          className="form-control"
          value={joint.welding_process}
          disabled
        />
      );
    }

    return (
      <input
        type="text"
        className="form-control"
        value={editFormData.welding_process || ''}
        disabled
      />
    );
  })() : (
    joint.welding_process || '-'
  )}
</td>


                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="remarks"
                      placeholder="Remarks"
                      value={editFormData.remarks || ''}
                      onChange={handleEditFormChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    joint.remarks || '-'
                  )}
                </td>

                <td>
                  {isEditing && (
                    <>
                      {/* <button
                        type="button"
                        className="btn btn-success p-1 mx-1"
                        onClick={() =>
                          handleSaveClick(`${rowIndex}-${i}-${j}`)
                        }
                      >
                        <Save />
                      </button> */}

<button
  type="button"
  className="btn btn-success p-1 mx-1"
  onClick={() => handleSaveClick(rowIndex, i, j, editFormData, setEditRowIndex)} // Added setEditRowIndex
>
  <Save size={16} />
</button>

                      <button
                        type="button"
                        className="btn btn-secondary p-1 mx-1"
                        onClick={handleCancelClick}
                      >
                        <X />
                      </button>

                     
                    </>
                  )}
                </td>
                <td>
                   <button
                        type="button"
                        className="btn btn-danger p-1 mx-1"
                        onClick={() => handleRemove(rowIndex, i, j)}
                      >
                        Remove
                      </button>
                </td>
              </tr>
            );
          })
        )
      );
    })()
  ) : (
    <tr>
      <td colSpan="12">
        <div className="no-table-data">No Data Found!</div>
      </td>
    </tr>
  )}
                </tbody>

              </table>
            </div>

            {/* Pagination Info */}
            {/* <div className="row align-center mt-3 mb-2">
              <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                <div className="dataTables_info" role="status" aria-live="polite">
                  Showing {Math.min(limit, totalItems)} from {totalItems} data
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                <div className="dataTables_paginate paging_simple_numbers">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={limit}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiWeldTable