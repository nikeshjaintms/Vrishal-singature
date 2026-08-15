import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { V_URL } from '../../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import { getPipingMultiMio } from '../../../../../../Store/Piping/MultiMIO/GetMultiMio';
import { getMultiSurfaceOfferMio } from '../../../../../../Store/MutipleDrawing/MultiMIO/GetSurfaceMioOffer';
import { getPipingMultiSurfaceOffer } from '../../../../../../Store/Piping/MultiSurface/GetSurfaseOffer';

const MioTable = ({ setSubmitArr, paintNo, data, dispatch_site, report_no }) => {
    console.log("data", setSubmitArr);
    const dispatch = useDispatch();
    const [search, setSearch] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ remarks: '' });

    useEffect(() => {
        dispatch(getPipingMultiMio());
    }, [dispatch]);


    const getDisaptchOfferTable = () => {
        dispatch(getPipingMultiMio());

        const payload = {
            paint_system_id: paintNo,
            dispatch_site: dispatch_site,
            report_no: report_no,
        }
        dispatch(getMultiSurfaceOfferMio({ DATA: payload }));
        dispatch(getPipingMultiSurfaceOffer({ DATA: payload }));
    }
    const getPipingMultiMioData = useSelector((state) => state?.getPipingMultiMio?.user?.data);

    useEffect(() => {
        if (!report_no) {
            setTableData([]);
            setSubmitArr([]);
            return;
        }

        if (getPipingMultiMioData?.length > 0) {
            const filteredByReport = getPipingMultiMioData.filter(
                (item) => item.dispatch_no === report_no || item.report_no === report_no
            );
            setTableData(filteredByReport);
            setSubmitArr(filteredByReport);
        } else if (data?._id) {
            setTableData(data?.items);
            setSubmitArr(data?.items);
        } else {
            setTableData([]);
            setSubmitArr([]);
        }
    }, [getPipingMultiMioData, data?._id, setSubmitArr, report_no]);


    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            if (search) {
                computedComments = computedComments.filter(
                    (dr) =>
                        dr?.drawing_no.toString()?.toLowerCase()?.includes(search) ||
                        dr?.assembly_no?.toString()?.toLowerCase()?.includes(search)
                );
            }
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [limit, search, totalItems, currentPage, tableData]);

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    }

    const handleEditClick = (index, row) => {
        setEditRowIndex(index);
        setEditFormData({
            remarks: row.remarks,
        });
    }

    const handleSaveClick = async () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;

        updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };

        setTableData(updatedData);
        setSubmitArr(updatedData);

        const updatedItem = updatedData[dataIndex];

        if (!updatedItem) {
            return;
        }

        const items = {
            "remarks": updatedItem.remarks
        };

        const bodyFormData = new URLSearchParams();
        bodyFormData.append('items', JSON.stringify(items));
        bodyFormData.append('id', updatedItem._id);
        bodyFormData.append('item_detail_id', updatedItem.item_detail_id);

        try {
            const myurl = `${V_URL}/user/piping-update-multi-mio-offer`;
            const response = await axios.post(myurl, bodyFormData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                },
            });

            if (response.data.success) {
                toast.success("Item updated successfully");
                setEditRowIndex(null);
                return response.data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleRemoveByDrawing = async (elem) => {
        const removeItem = new URLSearchParams();
        removeItem.append('id', elem._id);

        try {
            const myurl = `${V_URL}/user/piping-delete-multi-mio-offer`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: removeItem,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const { success, message } = response.data;

            // ✅ SHOW SUCCESS TOAST
            if (success) {
                toast.success(message || 'Deleted successfully');

                // ✅ REFRESH TABLE
                dispatch(getPipingMultiMio());
                dispatch(getPipingMultiSurfaceOffer({ isMIO: true }));
            } else {
                toast.error(message || 'Delete failed');
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
            return error;
        }
    };

    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    return (
        <>
            <div className='row'>
                <div className="col-sm-12">
                    <div className="card card-table show-entire">
                        <div className="card-body">
                            <div className="page-table-header mb-2">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <div className="doctor-table-blk">
                                            <h3>Drawing Details List</h3>
                                            <div className="doctor-search-blk">
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
                                            <th>Piping Class</th>
                                            <th>Spool No. / Item</th>
                                            <th>Size1</th>
                                            <th>Thickness1</th>
                                            <th>Size2</th>
                                            <th>Thickness2</th>
                                            <th>Qty</th>
                                            {/* <th>Remarks</th> */}
                                            <th className='text-end'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{elem?.drawing_no || "-"}</td>
                                                <td>{elem?.rev || "-"}</td>
                                                <td>{elem?.piping_class_name || "-"}</td>
                                                <td>{elem?.spool_no || elem?.item_name || "-"}</td>
                                                <td>{elem?.size1 || "-"}</td>
                                                <td>{elem?.thickness1 || "-"}</td>
                                                <td>{elem?.size2 || "-"}</td>
                                                <td>{elem?.thickness2 || "-"}</td>
                                                <td>{elem?.qty || "-"}</td>
                                                {/* {!data?._id ? (
                                                    <>
                                                        {editRowIndex === i ? (
                                                            <>
                                                                <td>
                                                                    <textarea className='form-control' rows={1}
                                                                        value={editFormData?.remarks} name='remarks'
                                                                        onChange={handleEditFormChange} />
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <td>{elem?.remarks || '-'}</td>
                                                    </>
                                                )} */}
                                                {/* {editRowIndex === i ? (
                                                    <td>
                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                    </td>
                                                ) :  */}
                                                <td className='text-end'>
                                                    {!data?._id ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger p-1 mx-1"
                                                            onClick={() => handleRemoveByDrawing(elem)}
                                                        >
                                                            Remove
                                                        </button>
                                                    ) : '-'}
                                                </td>
                                                {/* } */}
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
        </>
    )
}

export default MioTable