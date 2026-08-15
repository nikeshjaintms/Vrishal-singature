import React, { useMemo, useState } from 'react'
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';

const CompleteDrawingTable = ({
    tableTitle,
    entity,
    handleAddToIssueArr,
    data
}) => {

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [search, setSearch] = useState("");

    const commentsData = useMemo(() => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        let computedComments = entity || [];

        if (computedComments) {
            computedComments = computedComments?.filter((o) => o?.project?._id === projectId);
        }
        if (search) {
            computedComments = computedComments.filter(
                (dr) =>
                    dr?.drawing_no.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.rev?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.assembly_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.sheet_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    return (
        <div className="row">
            <div className="col-sm-12">
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
                                        <th>Drawing No.</th>
                                        <th>Rev</th>
                                        <th>Assem. No.</th>
                                        <th>Assem. Qty.</th>
                                        <th>Unit</th>
                                        <th>Sheet No.</th>
                                        <th className='text-end'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData?.map((elem, i) => (
                                        <tr key={i}>
                                            <td>{(currentPage - 1) * limit + i + 1}</td>
                                            <td>{elem.drawing_no}</td>
                                            <td>{elem.rev}</td>
                                            <td>{elem.assembly_no}</td>
                                            <td>{elem.assembly_quantity}</td>
                                            <td>{elem.unit}</td>
                                            <td>{elem.sheet_no}</td>
                                            <td className='text-end'>
                                                {!data?._id ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={() => handleAddToIssueArr(elem)}
                                                    >
                                                        Add
                                                    </button>
                                                ) : (<>-</>)}
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
            </div>
        </div>
    )
}

export default CompleteDrawingTable