import React, { useEffect, useMemo, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
// import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { getUserJointTypePiping } from '../../../../../Store/Piping/JointType/JointTypePiping';
import { getFitupOfferTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/getFitupOfferTablePiping';
import { updateIssueAccGrid } from '../../../../../Store/MutipleDrawing/IssueAcc/UpdateIssueAccGrid';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import { removeFitupOffTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/removeFitupOffertablePiping';
import { manageFitupOffTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/manageFitupOffTablePiping';
import { updateFitupOffTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/updateFitupOfferTablePiping';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';
import { Pagination, Search } from '../../../Table';

// import { Dropdown } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';

const MultipleFitupTablePiping = ({ data, issueId, finalArr, setSubmitArr,handleRemove, handleSaveClick }) => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [editFormData, setEditFormData] = useState({
    // joint_type: [],
    joint_type_id: "",
    remarks: '',
    jointTypeName: '',
    imir_no_1: '',
    heat_no_1: '',
    imir_no_2: '',
    heat_no_2: ''
  });
const project_id = localStorage.getItem('U_PROJECT_ID');
const toDropdownOptions = (arr = []) =>
  arr.map(v => ({ label: v, value: v }));


const getIMIROptions = (elem, index = 0) => {
  // Grab first acceptance for the material
  const imir = elem.materials?.[index]?.acceptance?.[0]?.imir_no || [];
  return toDropdownOptions(imir);
};

const getHeatOptions = (elem, index = 0) => {
  const heat = elem.materials?.[index]?.acceptance?.[0]?.heat_no || [];
  return toDropdownOptions(heat);
};


const normalizeToArray = (val) => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  return [val];
};

  /* ================= INIT ================= */
  useEffect(() => {
    // dispatch(getDrawing());
    dispatch(getUserJointTypePiping({ status: true }));
  }, []);

  useEffect(() => {
    if (issueId) {
      dispatch(getFitupOfferTablePiping({ issue_id: issueId, project_id }));
    }
  }, [issueId]);

  /* ================= SELECTORS ================= */
  const fitupOfferTableData = useSelector(
    (state) => state?.getFitupOfferTablePiping?.user?.data
  );
console.log("fitupOfferTableData",fitupOfferTableData);
  const jointData = useSelector(
    (state) => state?.getUserJointTypePiping?.user?.data
  );
  // const drawData = useSelector(
  //   (state) => state?.getDrawing?.user?.data?.data
  // );

  /* ================= DATA BUILD ================= */

  useEffect(() => {
    if (!Array.isArray(fitupOfferTableData)) {
      setTableData([]);
      setSubmitArr([]);
      return;
    }

    const mergedItems = fitupOfferTableData.map(row => {
      let imir1 = row.imir_no_1_selected;
      let imir2 = row.imir_no_2_selected;
      let heat1 = row.heat_no_1_selected;
      let heat2 = row.heat_no_2_selected;

      const imirArr1 = row.materials?.[0]?.acceptance?.[0]?.imir_no || [];
      if (!imir1 && imirArr1.length === 1) {
        imir1 = imirArr1[0];
      }

      const imirArr2 = row.materials?.[1]?.acceptance?.[0]?.imir_no || [];
      if (!imir2 && imirArr2.length === 1) {
        imir2 = imirArr2[0];
      }

      const heatArr1 = row.materials?.[0]?.acceptance?.[0]?.heat_no || [];
      if (!heat1 && heatArr1.length === 1) {
        heat1 = heatArr1[0];
      }

      const heatArr2 = row.materials?.[1]?.acceptance?.[0]?.heat_no || [];
      if (!heat2 && heatArr2.length === 1) {
        heat2 = heatArr2[0];
      }

      return {
        ...row,
        imir_no_1_selected: imir1,
        imir_no_2_selected: imir2,
        heat_no_1_selected: heat1,
        heat_no_2_selected: heat2,
        material_1: row.materials?.[0] || null,
        material_2: row.materials?.[1] || null,
      };
    });
    console.log("mergedItems", mergedItems);

    setTableData(mergedItems);
    setSubmitArr(mergedItems);
  }, [fitupOfferTableData, setSubmitArr]);



  /* ================= HELPERS ================= */
  // const getDrawingData = (drawId) => drawData?.find(d => d?._id === drawId);

  const jointTypeOptions = jointData?.map(j => ({
    label: j.name,
    value: j._id
  }));
const getJointTypeName = (id) => {
  const found = jointData?.find(j => j._id === id);
  return found ? found.name : '-';
};

  /* ================= EDIT ================= */
 
  const handleEditClick = (index, row) => {
  setEditRowIndex(index);

  // ✅ Normalize joint_type to array of IDs
  const jointTypeIds = Array.isArray(row.joint_type)
    ? row.joint_type
    : row.joint_type?._id
    ? [row.joint_type._id]
    : [];

  const selectedJointNames = jointData
    ?.filter(j => jointTypeIds.includes(j._id))
    ?.map(j => j.name)
    ?.join(', ');

  setEditFormData({
    // joint_type: jointTypeIds,
    // jointTypeName: selectedJointNames || '',
    remarks: row.remarks || '',
    joint_type_id: row.joint_type_id || "",
    imir_no_1: row.imir_no_1_selected || '',
    heat_no_1: row.heat_no_1_selected || '',
    imir_no_2: row.imir_no_2_selected || '',
    heat_no_2: row.heat_no_2_selected || ''
  });
};

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'joint_type') {
      const names = jointData
        ?.filter(j => value.includes(j._id))
        ?.map(j => j.name)
        ?.join(', ');
      setEditFormData({
        ...editFormData,
        joint_type: value,
        jointTypeName: names,
        
      });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };


  const handleCancelClick = () => setEditRowIndex(null);

const getRowId = (row) => {
  return (
    row?._id ||
    row?.issue_item?._id ||
    row?.item_id?._id ||
    row?.item_id ||
    null
  );
};
 const handleRefresh = () => {
    setLoading(true);
    setTableData([]);
  };
console.log("tableData fitup========>",tableData);

const filteredData = useMemo(() => {
  if (!search.trim()) return tableData;

  const lowerSearch = search.toLowerCase();

  return tableData.filter((elem) => {
    return (
      elem?.drawing_no?.toLowerCase().includes(lowerSearch) ||
      elem?.rev?.toLowerCase().includes(lowerSearch) ||
      elem?.sheet_no?.toLowerCase().includes(lowerSearch) ||
      elem?.spool_no?.toLowerCase().includes(lowerSearch) ||
      elem?.joint_no?.toLowerCase().includes(lowerSearch) ||
      elem?.materials?.[0]?.item_name?.toLowerCase().includes(lowerSearch) ||
      elem?.materials?.[1]?.item_name?.toLowerCase().includes(lowerSearch) ||
      elem?.imir_no_1_selected?.toLowerCase().includes(lowerSearch) ||
      elem?.heat_no_1_selected?.toLowerCase().includes(lowerSearch) ||
      elem?.imir_no_2_selected?.toLowerCase().includes(lowerSearch) ||
      elem?.heat_no_2_selected?.toLowerCase().includes(lowerSearch) ||
      elem?.remarks?.toLowerCase().includes(lowerSearch)
    );
  });
}, [search, tableData]);

  /* ================= UI ================= */
  return (
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
           

            <div className="table-responsive mt-2">
              <table className="table border-0 custom-table comman-table mb-0">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Line No. / Drawing No.</th>
                    <th>Rev No.</th>
                    <th>Sheet No.</th>
                    <th>Spool No.</th>
                    <th>Joint No.</th>
                    <th>Item 1</th>
                    <th>IMIR NO. 1 <span className="login-danger">*</span></th>
                    <th>Heat No. 1</th>
                    <th>Item 2</th>
                    <th>IMIR NO. 2 <span className="login-danger">*</span></th>
                    <th>Heat No. 2</th>
                    <th>Size 1</th>
                    <th>Thickness 1</th>
                   
                    <th>Joint Type <span className="login-danger">*</span></th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? filteredData.map((elem, i) => {
                    const drawing = elem?.drawing_id;
                   
                    return (
                      <tr key={elem._id}>
                        {/* <tr key={`${elem._id || i}-${elem.joint_no}-${elem.spool_no}`}> */}

                        <td>{i + 1}</td>
                        <td>{elem?.drawing_no}</td>
                        <td>{elem?.rev}</td>
                        <td>{elem?.sheet_no}</td>
                        <td>{elem?.spool_no || '-'}</td>
                        <td>{elem?.joint_no || '-'}</td>
                     {/* ITEM 1 */}
{/* <td>{elem?.material_item_id_1?.item?.item_name || '-'}</td> */}
<td>{elem?.materials?.[0].item_name || '-'}</td>

{/* <td>{elem?.imir_no_1?.join(', ') || '-'}</td> */}
{/* <td>
  
 {editRowIndex === i ? (
    <Dropdown
      value={editFormData.imir_no_1}
      options={getIMIROptions(elem,0)}
      placeholder="Select IMIR"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, imir_no_1: e.value })
      }
    />
 ) : (
    <span onClick={() => handleEditClick(i, elem)}>
             {elem.imir_no_1_selected || '-'}
                            </span>
                          )}
</td> */}
<td onClick={() => handleEditClick(i, elem)}>
  {editRowIndex === i ? (
    <Dropdown
      value={editFormData.imir_no_1}
      options={getIMIROptions(elem, 0)}
      placeholder="Select IMIR"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, imir_no_1: e.value })
      }
    />
  ) : (
    elem.imir_no_1_selected || '-'
  )}
</td>



{/* <td>{elem?.heat_no_1?.join(', ') || '-'}</td> */}
{/* <td>
 {editRowIndex === i ? (
    <Dropdown
      value={editFormData.heat_no_1}
      options={getHeatOptions(elem,0)}
      placeholder="Select Heat"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, heat_no_1: e.value })
      }
    />
 ) : (
                            <span onClick={() => handleEditClick(i, elem)}>
                              {elem.heat_no_1_selected || '-'}
                            </span>
                          )}
</td> */}
<td onClick={() => handleEditClick(i, elem)}>
  {editRowIndex === i ? (
    <Dropdown
      value={editFormData.heat_no_1}
      options={getHeatOptions(elem, 0)}
      placeholder="Select Heat"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, heat_no_1: e.value })
      }
    />
  ) : (
    elem.heat_no_1_selected || '-'
  )}
</td>


{/* ITEM 2 */}
{/* <td>{elem?.material_item_id_2?.item_name || '-'}</td> */}
<td>{elem?.materials?.[1].item_name || '-'}</td>


{/* <td>{elem?.imir_no_2?.join(', ') || '-'}</td> */}
{/* <td>
 {editRowIndex === i ? (
    <Dropdown
      value={editFormData.imir_no_2}
      options={getIMIROptions(elem,1)}
      placeholder="Select IMIR"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, imir_no_2: e.value })
      }
    />
 ) : (
                            <span onClick={() => handleEditClick(i, elem)}>
                              {elem.imir_no_2_selected || '-'}
                            </span>
                          )}
</td> */}
<td onClick={() => handleEditClick(i, elem)}>
  {editRowIndex === i ? (
    <Dropdown
      value={editFormData.imir_no_2}
      options={getIMIROptions(elem, 1)}
      placeholder="Select IMIR"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, imir_no_2: e.value })
      }
    />
  ) : (
    elem.imir_no_2_selected || '-'
  )}
</td>

{/* <td>{elem?.heat_no_2?.join(', ') || '-'}</td> */}
{/* <td>
 {editRowIndex === i ? (
    <Dropdown
      value={editFormData.heat_no_2}
      options={getHeatOptions(elem,1)}
      placeholder="Select Heat"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, heat_no_2: e.value })
      }
    />
 ) : (
                            <span onClick={() => handleEditClick(i, elem)}>
                              {elem.heat_no_2_selected || '-'}
                            </span>
                          )}
</td> */}
<td onClick={() => handleEditClick(i, elem)}>
  {editRowIndex === i ? (
    <Dropdown
      value={editFormData.heat_no_2}
      options={getHeatOptions(elem, 1)}
      placeholder="Select Heat"
      className="w-100"
      onChange={(e) =>
        setEditFormData({ ...editFormData, heat_no_2: e.value })
      }
    />
  ) : (
    elem.heat_no_2_selected || '-'
  )}
</td>



                        <td>{elem?.selected_size || '-'}</td>
                        <td>{elem?.selected_thickness || '-'}</td>
                        {/* <td>{elem?.joint_type || '-'}</td> */}
<td onClick={() => handleEditClick(i, elem)}>
  {editRowIndex === i ? (
    <Dropdown
      value={editFormData.joint_type_id}
      options={jointTypeOptions}
      placeholder="Select Joint Type"
      className="w-100"
      onChange={(e) =>
        setEditFormData({
          ...editFormData,
          joint_type_id: e.value
        })
      }
    />
  ) : (
    jointData?.find(j =>
      j._id === (elem.joint_type_id || elem.joint_type?._id)
    )?.name || "-"
  )}
</td>


                        {/* <td>
                          {editRowIndex === i ? (
                            <MultiSelect
                              value={editFormData.joint_type}
                              options={jointTypeOptions}
                              optionLabel="label"
                              display="chip"
                              className="w-100"
                              onChange={(e) =>
                                handleEditFormChange({
                                  target: { name: 'joint_type', value: e.value },
                                })
                              }
                            />
                          ) : (
                            <span onClick={() => handleEditClick(i, elem)}>
                              {elem.jointTypeName || '-'}
                            </span>
                          )}
                        </td> */}

                        <td>
                          {editRowIndex === i ? (
                            <textarea
                              className="form-control"
                              rows={1}
                              name="remarks"
                              value={editFormData.remarks}
                              onChange={handleEditFormChange}
                            />
                          ) : (
                            <span onClick={() => handleEditClick(i, elem)}>
                              {elem.remarks || '-'}
                            </span>
                          )}
                        </td>

                        <td>
                          {editRowIndex === i ? (
                            <>
                              {/* <button
                                className="btn btn-success p-1 mx-1"
                                onClick={handleSaveClick}
                              >
                                <Save size={16} />
                              </button> */}
                              <button
  className="btn btn-success p-1 mx-1"
  onClick={() =>
    handleSaveClick(
      {
        ...elem,
        joint_type_id: editFormData.joint_type_id,
        imir_no_1_selected: editFormData.imir_no_1,
        heat_no_1_selected: editFormData.heat_no_1,
        imir_no_2_selected: editFormData.imir_no_2,
        heat_no_2_selected: editFormData.heat_no_2,
        remarks: editFormData.remarks
      },
      i,
      tableData,
      setTableData,
      setEditRowIndex
    )
  }
>
  <Save />
</button>

                              <button
                                className="btn btn-secondary p-1 mx-1"
                                onClick={handleCancelClick}
                              >
                                <X />
                              </button>
                            </>
                          ) : (
                            // <button
                            //   className="btn btn-danger p-1 mx-1"
                            //   onClick={() => handleRemoveByDrawing(elem._id,elem.issue_id, elem.report_no)}
                            // >
                            //   Remove
                            // </button>
                            <button
  className="btn btn-danger btn-sm"
  onClick={() => handleRemove(elem._id)}
>
  Delete
</button>
// {/* <button
//   className="btn btn-danger p-1 mx-1"
//   onClick={() => {
//     const id = getRowId(elem);

//     if (!id) {
//       toast.error('Item not saved yet');
//       console.error('Missing row id:', elem);
//       return;
//     }

//     handleRemoveByDrawing(id, elem.issue_id, elem.report_no);
//   }}
// >
//   Remove
// </button> */}

                           

                            
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="9999" className="text-center">No Data Found!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleFitupTablePiping;
