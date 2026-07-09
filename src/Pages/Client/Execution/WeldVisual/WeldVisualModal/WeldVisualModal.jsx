import React, { useEffect, useMemo, useState } from 'react'
import { getUserWeldVisual } from '../../../../../Store/Store/Execution/getUserWeldVisual';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import { Pagination, Search } from '../../../Table';
import { Modal } from 'react-bootstrap';
import DropDown from '../../../../../Components/DropDown';

const WeldVisualModal = ({ showModal, handleCloseModal, title, type, apiUrl }) => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (disable === true) {
            dispatch(getUserWeldVisual({ status: '' }))
            setDisable(false);
        }
    }, [dispatch, disable]);

    useEffect(() => {
        dispatch(getDrawing());
    }, [dispatch]);

    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const entity = useSelector((state) => state?.getUserWeldVisual?.user?.data);

    const handleCheckAll = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            const allRows = commentsData.map((item) => ({
                [type ? "weld_report_qc_no" : "weld_report_no"]: item[type ? "weld_report_qc_no" : "weld_report_no"],
            }));
            setSelectedRows(allRows);
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (e, item) => {
        const isChecked = e.target.checked;
        const reportKey = type ? "weld_report_qc_no" : "weld_report_no";
        if (isChecked) {
            setSelectedRows((prev) => [
                ...prev,
                { [reportKey]: item[reportKey] },
            ]);
        } else {
            setSelectedRows((prev) =>
                prev.filter((row) => row[reportKey] !== item[reportKey])
            );
        }
    };

    const isRowSelected = (reportNo) => {
        const reportKey = type ? "weld_report_qc_no" : "weld_report_no";
        return selectedRows.some((row) => row[reportKey] === reportNo);
    };

    const handleDownload = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('reports', JSON.stringify(selectedRows));
        bodyFormData.append('user', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('print_date', true);
        PdfDownloadErp({ apiMethod: 'post', url: apiUrl, body: bodyFormData });
    }

    const commentsData = useMemo(() => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        const offeredById = localStorage.getItem('PAY_USER_ID');
        let computedComments = entity;
        if (computedComments) {
            computedComments = computedComments?.filter(o =>
                o?.items?.some(item =>
                    item?.transaction_id?.drawingId?.project?._id === projectId
                )
            );
        }
        if (offeredById) {
            if (!type) {
                computedComments = computedComments?.filter(o =>
                    o?.offered_by?._id === offeredById
                );
            } else {
                computedComments = computedComments?.filter(o =>
                    o?.qc_name?._id === offeredById
                );
            }
        }
        if (search) {
            computedComments = computedComments.filter((fit) => {
                const drawing = drawData?.find(dr => dr?._id === fit?.drawing_id);
                const searchField = type === true ? fit?.weld_report_qc_no : fit?.weld_report_no;
                return (
                    searchField?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    (drawing?.drawing_no && drawing?.drawing_no?.toLowerCase().includes(search.toLowerCase())) ||
                    (drawing?.assembly_no && drawing?.assembly_no?.toLowerCase().includes(search.toLowerCase()))
                );
            });
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity, drawData]);

    const handleClose = () => {
        setCurrentPage(1);
        setSearch("");
        setlimit(10);
        setSelectedRows([]);
        handleCloseModal();
    }


    return (
        <Modal show={showModal} onHide={handleClose} size='xl' backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table show-entire mb-0">
                            <div className="card-body">
                                <div className="row align-items-center mb-4">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <div className="doctor-search-blk">
                                                <div className="top-nav-search table-search-blk">
                                                    <form style={{ width: '380px' }}>
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

                                                {selectedRows?.length > 0 && (
                                                    <div className="add-group">
                                                        <button type='button' onClick={handleDownload}
                                                            className="btn btn-primary doctor-refresh w-100 mx-2 ms-2">
                                                            {type ? "Download QC Report" : "Download Report"} ({selectedRows?.length})
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table border-0 custom-table comman-table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className='d-flex justify-content-start align-items-center gap-3'>
                                                        {commentsData?.length > 0 && (
                                                            <input
                                                                className="form-check-input mt-0"
                                                                type="checkbox"
                                                                id="flexCheckDefault"
                                                                onChange={handleCheckAll}
                                                                style={{ width: "20px", height: "20px" }}
                                                                checked={
                                                                    selectedRows.length === commentsData.length
                                                                }
                                                            />
                                                        )}
                                                        Sr.
                                                    </div>
                                                </th>
                                                <th>Drawing No.</th>
                                                <th>Rev</th>
                                                <th>Assembly No.</th>
                                                <th>{type ? 'Report Ins. No. ' : 'Report No.'}</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {commentsData?.map((elem, i) =>
                                                <tr key={i}>
                                                    <td>
                                                        <div className="d-flex gap-3 justify-content-start align-items-center">
                                                            <input
                                                                className="form-check-input mt-0"
                                                                type="checkbox"
                                                                id="flexCheckDefault"
                                                                style={{ width: "20px", height: "20px" }}
                                                                checked={isRowSelected(type ? elem.weld_report_qc_no : elem.weld_report_no)}
                                                                onChange={(e) => handleRowSelect(e, elem)}
                                                            />
                                                            {(currentPage - 1) * limit + i + 1}
                                                        </div>
                                                    </td>
                                                    <td>{drawData?.find((dr) => dr?._id === elem?.drawing_id)?.drawing_no}</td>
                                                    <td>{drawData?.find((dr) => dr?._id === elem?.drawing_id)?.rev}</td>
                                                    <td>{drawData?.find((dr) => dr?._id === elem?.drawing_id)?.assembly_no}</td>
                                                    <td>{type ? elem?.weld_report_qc_no : elem?.weld_report_no}</td>
                                                    <td className='status-badge'>
                                                        {elem.status === 1 ? (
                                                            <span className="custom-badge status-orange">Pending</span>
                                                        ) : elem.status === 2 ? (
                                                            <span className="custom-badge status-green">Accepted</span>
                                                        ) : elem.status === 3 ? (
                                                            <span className="custom-badge status-pink">Rejected</span>
                                                        ) : null}
                                                    </td>
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
            </Modal.Body>
        </Modal>
    )
}

export default WeldVisualModal