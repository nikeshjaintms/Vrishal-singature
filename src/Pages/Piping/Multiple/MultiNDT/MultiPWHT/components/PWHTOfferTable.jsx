import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Search } from "../../../../Table";
import DropDown from "../../../../../../Components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { getMultiRtOfferTable } from "../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable";
import { Save, X } from "lucide-react";
import { removeRTTable } from "../../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable";
import toast from "react-hot-toast";

const safeRender = (val) => {
  if (val === null || val === undefined) return "-";
  if (typeof val === "object" && val !== null) return val.name || val.value || "-";
  return val;
};

const PWHTOfferTable = ({ handleSaveClick, handleRemove,tableData, setSubmitArr, submitArr }) => {
  console.log("tabledata=====>", tableData);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    remarks: "",
    no_of_thermocouple: "",
    thickness: "",
  });

  // const commentsData = useMemo(() => {
  //   let rows = tableData;

  //   setTotalItems(rows.length);

  //   return rows;
  // }, [tableData, search, currentPage, limit]);
const commentsData = useMemo(() => {
  let rows = tableData || [];

  if (search) {
    const lowerSearch = search.toLowerCase();

    rows = rows.filter((row) =>
      row?.drawing_no?.toLowerCase().includes(lowerSearch) ||
      row?.spool_no?.toLowerCase().includes(lowerSearch) ||
      row?.joint_no?.toLowerCase().includes(lowerSearch) ||
      row?.piping_class?.toLowerCase().includes(lowerSearch)
    );
  }

  setTotalItems(rows.length);

  return rows;
}, [tableData, search]);

  console.log("commentsData", commentsData);


  const handleRefresh = () => {
    setLoading(true);
  };


  const handleRowClick = (row, index) => {
  setEditRowIndex(index);
  const thick = typeof row.thickness === "object" ? (row.thickness?.name || row.thickness?.value || "") : (row.thickness || "");
  const thermo = typeof row.no_of_thermocouple === "object" ? (row.no_of_thermocouple?.name || row.no_of_thermocouple?.value || "") : (row.no_of_thermocouple || "");
  const rem = typeof row.remarks === "object" ? (row.remarks?.name || row.remarks?.value || "") : (row.remarks || "");
  setEditFormData({
    no_of_thermocouple: thermo,
    remarks: rem,
    thickness: thick,
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
                            onClick={handleRefresh}
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

              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table  mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Drawing No.</th>
                      <th>Spool No.</th>
                      <th>Joint No.</th>
                      <th>Size</th>
                      <th>Thickness</th>
                      <th>Piping Class </th>
                      <th>Piping Material Specification</th>
                      <th>Loading Temperature (Degree C/Hour)</th>
                      <th>Rate of Heating (Degree C/Hour)</th>
                      <th>Soaking Temperature (Degree C/Hour)</th>
                      <th>Soaking Period (Hour)</th>
                      <th>Rate of Cooling (Degree C/Hour)</th>
                      <th>Unloading Temperature(Degree C/Hour) </th>
                      <th>No of Thermocouple </th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                 <tbody>
  {commentsData.map((row, i) => {
    const isEditing = editRowIndex === i;

    return (
      <tr
        key={row.weld_visual_item_id}
        onClick={() => !isEditing && handleRowClick(row, i)}
        style={{ cursor: "pointer" }}
      >
        <td>{i + 1}</td>
        <td>{safeRender(row.drawing_no)}</td>
        <td>{safeRender(row.spool_no)}</td>
        <td>{safeRender(row.joint_no)}</td>
        <td>{safeRender(row.size)}</td>
        <td>
          {isEditing ? (
            <input
              type="text"
              name="thickness"
              className="form-control"
              value={editFormData.thickness}
              onChange={handleEditChange}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            safeRender(row.thickness)
          )}
        </td>
        <td>{row.piping_class}</td>
        <td>{row.piping_material_specification}</td>
        <td>{row.LoadingTemp}</td>
      <td>{row.rateofHeating}</td>
      <td>{row.soakingTemp}</td>
      <td>{row.soakingPeriod}</td>
      <td>{row.rateofCooling}</td>
      <td>{row.unloadingTemp}</td>
        {/* No of Thermocouple */}
        <td>
          {isEditing ? (
            <input
              type="number"
              name="no_of_thermocouple"
              className="form-control"
              value={editFormData.no_of_thermocouple}
              onChange={handleEditChange}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            safeRender(row.no_of_thermocouple)
          )}
        </td>

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
            safeRender(row.remarks)
          )}
        </td>

        {/* Actions */}
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
               <Save/>
              </button>
              <button
                className="btn btn-secondary btn-sm"
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
                        type="button"
                        className="btn btn-danger p-1 mx-1"
                        onClick={() =>  handleRemove(row)}
                      >
                        Remove
                      </button>
        </td>
      </tr>
    );
  })} 
  {commentsData.length === 0 && (
  <tr>
    <td colSpan="999" className="text-center">
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
    </>
  );
};

export default PWHTOfferTable;
