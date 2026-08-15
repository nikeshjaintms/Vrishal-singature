
import React from 'react'
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
 
const PressureTestDrawingTable = ({
  is_dispatch = false,
  tableTitle,
  commentsData,
  handleAddToIssueArr,
  currentPage,
  limit,
  setlimit,
  totalItems,
  setCurrentPage,
  setSearch,
  data
}) => {
  console.log("commentsData drawing table ",commentsData);
    const showUnitColumn = commentsData?.some(elem => elem.unit && elem.unit.trim() !== '');

  return (
    <div className="card card-table show-entire">
      <div className="card-body">
        <div className="page-table-header mb-2">
          <div className="row align-items-center">
            <div className="col">
              <div className="doctor-table-blk">
                <h3>{tableTitle}</h3>
                <div className="doctor-search-blk">
                  <div className="top-nav-search table-search-blk">
                    <form>
                      {/* This assumes a Search component is passed */}
                      <Search onSearch={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                      }} />
                      <a className="btn">
                        <img
                          src="/assets/img/icons/search-normal.svg"
                          alt="search"
                        />
                      </a>
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
        <div className="table-responsive mt-2">
          <table className="table border-0 custom-table comman-table  mb-0">
            <thead>
              <tr>
                <th>Sr.</th>
               
                <th>Line No. / Drawing No.</th>
                <th>Rev No.</th>
                {/* <th>Sheet No.</th> */}
                <th>Spool No.</th>
                {/* <th>Joint No.</th> */}
                <th className='text-end'>Action</th>
              </tr>
            </thead>
         <tbody>
{commentsData?.map((elem, i) => (
    <tr key={elem._id || i}>
      <td>{i + 1}</td>
      <td>{elem.drawing_no || "-"}</td>
      <td>{elem.rev || "-"}</td>
      {/* <td>{elem.sheet_no || "-"}</td> */}
      <td>{elem.spool_no || "-"}</td>

      <td className="text-end">
        {!commentsData?._id ? (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => handleAddToIssueArr(elem)}
          >
            Add
          </button>
        ) : (
          "-"
        )}
      </td>
    </tr>
  ))}

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
            <div
              className="dataTables_info"
              id="DataTables_Table_0_info"
              role="status"
              aria-live="polite"
            >
              Showing {Math.min(limit, totalItems)} from {totalItems} data
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="DataTables_Table_0_paginate"
            >
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
  )
}
 
export default PressureTestDrawingTable
