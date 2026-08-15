import React from 'react'
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import moment from 'moment';

const RtItemList = ({ name, commentsData, url, limit, handleRefresh, currentPage,
    setCurrentPage, setSearch, setlimit, totalItems, handleAddToIssueArr, handleShowList, showBtn, handleRtLocationChange, rtType }) => {

   const getRtDisplay = (elem, rtType) => {
        const statusMap = {
            BSRT: elem?.bsrt_status,
            ASRT: elem?.asrt_status,
            RT: elem?.rt_status
        };

        const labelMap = {
            2: 'RP',
            3: 'RT',
            4: 'RS'
        };

        const status = statusMap[rtType];
        const label = labelMap[status];
        const joint = elem?.joint_no || '';

        // 👉 If no status, return only joint_no
        if (!label) return joint;

        return joint ? `${label} | ${joint}` : label;
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
                                            <h3>{name}</h3>
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
                                                <div className="add-group">
                                                    <button type='button' onClick={handleRefresh}
                                                        className="btn btn-primary doctor-refresh ms-2" data-toggle="tooltip" data-placement="top" title="Refresh"><img
                                                            src="/assets/img/icons/re-fresh.svg" alt="refresh" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        <div className="add-group mx-2">
                                            <button type='button' onClick={handleShowList}
                                                className="btn btn-primary doctor-refresh w-100">
                                                {showBtn ? 'Hide RT Completed List(Scroll Down)' : 'View RT Completed List'}
                                            </button>
                                        </div>
                                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table border-0 custom-table comman-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            {rtType === 'RT' && <th>Lot No.</th>}
                                            <th>Drawing No./Line No.</th>
                                            <th>Spool No.</th>
                                            <th>Joint No.</th>
                                            <th>Size</th>
                                            <th>Thickness</th>

                                            {/* <th>Offer Type</th> */}
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={elem?._id}>
                                                <td>{(currentPage - 1) * limit + i + 1}</td>
                                                {rtType === 'RT' && <td>{elem?.lot_number || '' }</td>}
                                                <td>{elem?.drawing_no}</td>

                                                <td>{elem.spool_no}</td>
                                                <td>{getRtDisplay(elem, rtType)}</td>
                                                <td>{elem?.size}</td>
                                                <td>{elem?.thickness}</td>

                                                {/* <td>{elem?.ndt_type_id?.name}</td> */}
                                                {/* <td className='status-badge'>
                                                    {elem.status === 1 ? (
                                                        <span className="custom-badge status-orange">Pending</span>
                                                    ) : elem.status === 3 ? (
                                                        <span className="custom-badge status-green">Accepted</span>
                                                    ) : elem.status === 4 ? (
                                                        <span className="custom-badge status-pink">Rejected</span>
                                                    ) : elem.status === 2 ? (
                                                        <span className='custom-badge status-blue'>Send For Clearance</span>
                                                    ) : elem.status === 5 ? (
                                                        <span className="custom-badge status-purple">Partially</span>
                                                    ) : null}
                                                </td> */}

                                                <td className="text-end">
                                                    {/* {elem.status === 1 ? ( */}

                                                    <button
                                                        className="btn btn-primary"
                                                        type="button"
                                                        onClick={() => handleAddToIssueArr(elem)}
                                                    >
                                                        Add
                                                    </button>
                                                    {/* ) : '--'} */}
                                                </td>
                                            </tr>
                                        )}

                                        {commentsData?.length === 0 ? (
                                            <tr>
                                                <td colspan="999">
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
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                    <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                        aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                </div>
                                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                    <div className="dataTables_paginate paging_simple_numbers"
                                        id="DataTables_Table_0_paginate">
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

export default RtItemList