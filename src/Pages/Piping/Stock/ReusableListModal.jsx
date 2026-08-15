import React, { useMemo, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Search } from '../Table';

const ReusableListModal = ({ show, reusableData, handleClose }) => {
    const [search, setSearch] = useState();
    const commentsData = useMemo(() => {
        let computedComments = reusableData;
        if (search) {
            computedComments = computedComments.filter(
                (st) =>
                    st.material_po_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    st.item_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    st.imir_no?.toString().toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        return computedComments;
    }, [search, reusableData]);


    return (
        <Modal show={show} onHide={handleClose} fullscreen={true} backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <div className="page-table-header mb-2 p-0">
                    <div className="row align-items-center">
                        <div className="col">
                            <div className="doctor-table-blk">
                                <h3>Reusable Stock List</h3>
                                <div className="doctor-search-blk">
                                    <div className="top-nav-search table-search-blk">
                                        <form>
                                            <Search
                                                onSearch={(value) => {
                                                    setSearch(value);
                                                }} />
                                            {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                            <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                alt="search" /></a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className='row'>
                    <div className="col-sm-12">
                        <div className="table-responsive">
                            <table className="table border-0 custom-table comman-table  mb-0 datatable">
                                <thead>
                                    <tr>
                                        <th>SR.</th>
                                        <th>MATERIAL PO No.</th>
                                        <th>SECTION DETAILS</th>
                                        <th>GRADE</th>
                                        <th>UOM</th>
                                        <th>IMIR NO.</th>
                                        <th>HEAT NO.</th>
                                        <th>AVAILABLE QTY(KG)</th>
                                        <th>MANUFACTURER</th>
                                        <th>SUPPLIER</th>
                                        <th>USABLE LENGTH</th>
                                        <th>USABLE WIDTH</th>
                                        <th>USABLE NOS</th>
                                        <th>USABLE QTY(KG)</th>
                                        <th>REMARKS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData?.map((elem, i) =>
                                        <tr key={elem?._id}>
                                            <td>{i + 1}</td>
                                            <td>{elem?.material_po_no}</td>
                                            <td>{elem?.item_name}</td>
                                            <td>{elem?.material_grade || '-'}</td>
                                            <td>{elem?.unit}</td>
                                            <td>{elem?.imir_no || '-'}</td>
                                            <td>{elem?.accepted_lot_no}</td>
                                            <td>{(elem.balance_qty)?.toFixed(2)}</td>
                                            <td>{elem?.manufacture_name || '-'}</td>
                                            <td>{elem?.supplier_name || '-'}</td>
                                            <td>{elem?.usableLength || '-'}</td>
                                            <td>{elem?.usableWidth || '-'}</td>
                                            <td>{elem?.usableNos || '-'}</td>
                                            <td>{elem?.usableQty || '-'}</td>
                                            <td>{elem?.remarks || '-'}</td>
                                        </tr>
                                    )}
                                    {commentsData?.length === 0 ? (
                                        <tr>
                                            <td colSpan="999">
                                                <div className="no-table-data">
                                                    No Data Found!
                                                </div>
                                            </td>
                                        </tr>
                                    ) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ReusableListModal