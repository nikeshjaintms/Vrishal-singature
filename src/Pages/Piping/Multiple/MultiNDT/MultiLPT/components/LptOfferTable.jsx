import React, { useMemo, useState } from "react";
import { Save, X } from "lucide-react";
import { Pagination, Search } from "../../../../Table";
import DropDown from "../../../../../../Components/DropDown";

const LptOfferTable = ({ tableData, handleSaveClick, handleRemove }) => {
  const [search, setSearch] = useState("");
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    remarks: "",
  });

  /* ---------------- SEARCH  ---------------- */
const commentsData = useMemo(() => {
  if (!tableData) return [];

  if (!search.trim()) return tableData;

  const keyword = search.toLowerCase();

  return tableData.filter((row) =>
    [
      row.drawing_no,
      row.rev,
      row.spool_no,
      row.joint_no,
      row.size,
      row.thickness,
      row.joint_type,
      row.welder_no,
      row.remarks,
    ]
      .filter(Boolean)
      .some((value) =>
        value.toString().toLowerCase().includes(keyword)
      )
  );
}, [tableData, search]);


  /* ---------------- HANDLERS ---------------- */
  const handleRowClick = (row, index) => {
    setEditRowIndex(index);
    setEditFormData({
      remarks: row.remarks || "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setEditRowIndex(null);
  };

  /* ---------------- UI ---------------- */
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
                                         }}
                                       />
                                       {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                       <a className="btn">
                                         <img
                                           src="/assets/img/icons/search-normal.svg"
                                           alt="search"
                                         />
                                       </a>
                                     </form>
                                   </div>
                                   <div className="add-group">
                                     <button
                                       type="button"
                                      //  onClick={handleRefresh}
                                       className="btn btn-primary doctor-refresh ms-2"
                                       data-toggle="tooltip"
                                       data-placement="top"
                                       title="Refresh"
                                     >
                                       <img
                                         src="/assets/img/icons/re-fresh.svg"
                                         alt="refresh"
                                       />
                                     </button>
                                   </div>
                                 </div>
                               </div>
                             </div>
                             <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                              
                             </div>
                           </div>
                         </div>
            {/* TABLE */}
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
                    <th>Welder No</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {commentsData.map((row, i) => {
                    const isEditing = editRowIndex === i;

                    return (
                      <tr
                        key={row._id || i}
                        onClick={() => !isEditing && handleRowClick(row, i)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{i + 1}</td>
                        <td>{row.drawing_no || "-"}</td>
                        <td>{row.rev || "-"}</td>
                        <td>{row.spool_no || "-"}</td>
                        <td>{row.joint_no || "-"}</td>
                        <td>{row.size || "-"}</td>
                          <td>{row.thickness || "-"}</td>


                        <td>{row.joint_type || "-"}</td>
                        <td>{row.welder_no || "-"}</td>

                        {/* Remarks */}
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              name="remarks"
                              className="form-control"
                              value={editFormData.remarks}
                              onChange={handleEditChange}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            row.remarks || "-"
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="text-end">
                          {isEditing && (
                            <>
                              <button
                                className="btn btn-success btn-sm me-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveClick(row, editFormData, setEditRowIndex);
                                }}
                              >
                                <Save />
                              </button>

                              <button
                                className="btn btn-secondary btn-sm me-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancel();
                                }}
                              >
                                <X />
                              </button>
                            </>
                          )}

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(row);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {commentsData.length === 0 && (
                    <tr>
                      <td colSpan="999" className="no-table-data">
                        No Data Found
                      </td>
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

export default LptOfferTable;
