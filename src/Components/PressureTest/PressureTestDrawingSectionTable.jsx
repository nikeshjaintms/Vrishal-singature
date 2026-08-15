
import { Pencil, Trash2 } from "lucide-react";
import DownloadFormat from "../DownloadFormat/DownloadFormat";
import { Check, Save, Tally1, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
// import { Pagination, Search } from '../../../Table';

const OrderPlacementSectionTable = ({
  transactionData,
  commentsData,
  editRowIndex,
  acceptRejectStatus,
  handleAcceptRejectClick,
  handleEditClick,
  handleCancelClick,
  handleSaveClick,
  editFormData,
  handleEditFormChange,
  handleSave,
  handleDelete,
  handleEdit,
  handleView,
  finalId,
  dataId,
}) => {
  console.log("Order Placement Data in Table:", transactionData); // Debugging line

      const [editIndex, setEditIndex] = useState(null);
  const [editedData, setEditedData] = useState({});
const handleChange = (e, index) => {
    const { name, value } = e.target;

    setEditedData(prev => ({
        ...prev,
        [name]: value
    }));
};
  return (
    <div className='row'>
                <div className="col-sm-12">
                    <div className="card card-table show-entire">
                        <div className="card-body">
                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Drawing Details List</h3>
                                            {/* <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form>
                                                        <Search
                                                            onSearch={(value) => {
                                                                setSearch(value.toLowerCase());
                                                                setCurrentPage(1);
                                                            }}
                                                        />
                                                        <a className="btn">
                                                            <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                                        </a>

                                                    </form>

                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    {/* <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                    </div> */}
                                </div>
                            </div>

                            <div className="table-responsive mt-2">
                                <table className="table border-0 custom-table comman-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Report No.</th>
                                            <th>Line No. / Drawing No.</th>
                                            <th>Rev No.</th>
                                            {/* <th>Sheet No.</th> */}
                                            <th>Spool No.</th>
                                            <th>Remarks</th>
                                            <th className='text-end'>Action</th>
                                        </tr>
                                    </thead>
                               <tbody>
  {transactionData?.length > 0 ? (
    transactionData.map((report, reportIndex) =>
      report.items?.map((item, itemIndex) => {
        const rowKey = `${reportIndex}-${itemIndex}`;
        const isEditing = editIndex === rowKey;

        return (
          <tr  onClick={() => {
                      setEditIndex(rowKey);
                      setEditedData({
                        remarks: item?.remarks || "",
                      });
                    }}
                     key={rowKey}>
            <td>{reportIndex + 1}</td>
            <td>{report.report_no || "-"}</td>
            <td>{item?.drawing_id?.drawing_no || "-"}</td>
            <td>{item?.drawing_id?.rev || "-"}</td>
            {/* <td>{item?.drawing_id?.sheet_no || "-"}</td> */}
            <td>{item?.spool_no_id?.spool_no || "-"}</td>

            {/* ✅ Editable Remarks */}
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="remarks"
                  value={editedData.remarks ?? ""}
                  onChange={(e) =>
                    setEditedData({ remarks: e.target.value })
                  }
                  className="form-control"
                />
              ) : (
                item?.remarks || "-"
              )}
            </td>

            <td className="text-end">
              {isEditing ? (
                <>
                  {/* <button
                    className="btn btn-success btn-sm mx-1"
                    onClick={() => {
                      handleSaveClick(report._id, item._id, editedData);
                      setEditIndex(null);
                    }}
                  >
                    <Save/>
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => 
                      setEditIndex(null)}
                    
                  >
                    <X/>
                  </button> */}
                  <button
  className="btn btn-success btn-sm mx-1"
  onClick={(e) => {
    e.stopPropagation();
    handleSaveClick(report._id, item._id, editedData);
    setEditIndex(null);
  }}
>
  <Save />
</button>

<button
  className="btn btn-secondary btn-sm"
  onClick={(e) => {
    e.stopPropagation();
    setEditIndex(null);
  }}
>
  <X />
</button>
                </>
              ) : (
                <>
                 

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleDelete(report._id)
                    }
                  >
                    Remove
                  </button>
                </>
              )}
            </td>
          </tr>
        );
      })
    )
  ) : (
    <tr>
      <td colSpan="8">
        <div className="no-table-data">No Data Found!</div>
      </td>
    </tr>
  )}
</tbody>
                                </table>
                            </div>
                            {/* <div className="row align-center mt-3 mb-2">
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                    <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                        aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                    <div className="dataTables_paginate paging_simple_numbers"
                                        id="DataTables_Table_0_paginate">
                                        <Pagination
                                            // total={totalItems}
                                            // itemsPerPage={limit}
                                            // currentPage={currentPage}
                                            // onPageChange={(page) => setCurrentPage(page)}
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
  );
};

export default OrderPlacementSectionTable;
