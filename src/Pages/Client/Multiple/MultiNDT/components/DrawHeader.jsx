import React from 'react'
import { Search } from '../../../Table'
import DropDown from '../../../../../Components/DropDown'

const DrawHeader = ({ name, limit, setLimit, setSearch, setCurrentPage }) => {
    return (
        <>
            <div className="page-table-header mb-2">
                <div className="row align-items-center">
                    <div className="col">
                        <div className="doctor-table-blk">
                            <h3>{name}</h3>
                            <div className="doctor-search-blk">
                                <div className="top-nav-search table-search-blk">
                                    <form>
                                        <Search onSearch={(value) => {
                                            setSearch(value);
                                            setCurrentPage(1);
                                        }} />
                                        {/* eslint-disable jsx-a11y/anchor-is-valid */}
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
                        <DropDown limit={limit} onLimitChange={(val) => setLimit(val)} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DrawHeader