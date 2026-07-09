import React from 'react'
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import moment from 'moment';

const LptLotBookItemsList = ({ name, commentsData, url, limit, handleRefresh, currentPage,
    setCurrentPage, setSearch, setlimit, totalItems, handleAddToIssueArr, handleShowList, showBtn }) => {
console.log("commentsData lpt lot book",commentsData);
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
                                            {/* <button type='button' onClick={handleShowList}
                                                className="btn btn-primary doctor-refresh w-100">
                                                {showBtn ? 'Hide RT Completed List(Scroll Down)' : 'View RT Completed List'}
                                            </button> */}
                                        </div>
                                        {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                         <DropDown 
    limit={limit} 
    onLimitChange={(val) => {
        setlimit(val);
        setCurrentPage(1); // reset page
    }} 
/>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table border-0 custom-table comman-table  mb-0">
                                    <thead>
                                        <tr>
                                            <th>Sr.</th>
                                            <th>Drawing No./ Line No.</th>
                                            <th>Rev</th>
                                            <th>Spool No.</th>
                                             <th>Joint No.</th>
                                            {/* <th>Status</th> */}

                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr >
                                                <td>{i +1}</td>
                                                <td>{elem?.drawing_no}</td>
                                                <td>{elem?.rev}</td>
                                                <td>{elem?.spool_no}</td>
                                                   <td>{elem?.joint_no}</td>

                                                
                                                <td className="text-end">
                                                    {/* {elem.status === 1 ? ( */}

                                                    <button
                                                        className="btn btn-primary"
                                                        type="button"
                                                    onClick={() => handleAddToIssueArr(elem)}
                                                    >
                                                        Add
                                                    </button>
                                                    {/* // ) : '--'} */}
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

export default LptLotBookItemsList