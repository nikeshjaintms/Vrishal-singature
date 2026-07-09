import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, Search } from '../../../../Table';
import DropDown from '../../../../../../Components/DropDown';
import { V_URL } from '../../../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getMultiSurface } from '../../../../../../Store/MutipleDrawing/MultiSurface/GetMultiSurface';
import { Save, X } from 'lucide-react';
import { getMultiDispatchPaint } from '../../../../../../Store/MutipleDrawing/MultiSurface/GetMultiDispatchNotePaint';
import { getDispatchNotes } from '../../../../../../Store/MutipleDrawing/DispatchNote/GetDisptchNote';
import { Link, useLocation, useNavigate } from "react-router-dom";
const SurfaceTable = ({ setSubmitArr, paintNo, data, dispatch_site, report_no, onAddItem,
  is_view = false,
  isEditMode = false, }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ remarks: '' });
   

    useEffect(() => {
        getDisaptchOfferTable();
    }, [localStorage.getItem('U_PROJECT_ID'), paintNo])

    const getDisaptchOfferTable = () => {
        if (paintNo) {
            dispatch(getMultiSurface({ "paint_system_id": paintNo }))
        }
        const payload = {
            paint_system_id: paintNo,
            dispatch_site: dispatch_site,
            report_no: report_no,
        }
        dispatch(getMultiDispatchPaint({ DATA: payload }));
        dispatch(getDispatchNotes({ DATA: payload }));
    }
    const getMultiSurfaceOffer = useSelector((state) => state?.getMultiSurface?.user?.data);
    // console.log(getMultiSurfaceOffer, "getMultiSurfaceOffer");
    
    useEffect(() => {
        if (getMultiSurfaceOffer?.length > 0) {
            setTableData(getMultiSurfaceOffer);
            setSubmitArr(getMultiSurfaceOffer);
        } else if (paintNo) {
            if (data?._id) {
                setTableData(data?.items);
            } else {
                setTableData([]);
                setSubmitArr([]);
            }
        } else if (data?._id) {
            setTableData(data?.items);
            setSubmitArr(data?.items);
        } else {
            setTableData([]);
            setSubmitArr([]);
        }
    }, [getMultiSurfaceOffer, paintNo]);


    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            if (search) {
                // computedComments = computedComments.filter(
                //     (dr) =>
                //         dr?.drawing_no.toString()?.toLowerCase()?.includes(search) ||
                //         dr?.assembly_no?.toString()?.toLowerCase()?.includes(search)
                // );

                computedComments = computedComments.filter((dr) => {
  const drawingNo = dr?.drawing_no ? dr.drawing_no.toString().toLowerCase() : "";
  const assemblyNo = dr?.assembly_no ? dr.assembly_no.toString().toLowerCase() : "";
  return drawingNo.includes(search) || assemblyNo.includes(search);
});


            }

            
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [limit, search, totalItems, currentPage, tableData]);


      const getSurfaceOfferTable = () => {
        dispatch(getDispatchNotes());
        dispatch(getMultiSurface());
      };

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
            const myurl = `${V_URL}/user/update-multi-surface-offer`;
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
            const myurl = `${V_URL}/user/delete-multi-surface-offer`;
            const response = await axios({
                method: 'post',
                url: myurl,
                data: removeItem,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                },
            });

            const data = response.data;



            if (data.success === true) {


                  const isManual = !elem.main_id && !elem.drawing_id && !elem.grid_id;

        if (isManual) {
          console.log("Skipping grid balance update: manual entry");

          // Show toast and update frontend
          toast.success("Manual item has been removed!");
          getSurfaceOfferTable(); // or remove from local state manually
          return { skipped: true };
        }
                const balanceData = [{
                    "main_id": elem.main_id,
                    "surface_used_grid_qty": elem.surface_used_grid_qty,
                    "drawing_id": elem.drawing_id,
                    "grid_id": elem?.grid_id,
                }];
                const bodyFormData = new URLSearchParams();
                bodyFormData.append('items', JSON.stringify(balanceData));
                bodyFormData.append('is_delete', true)
                try {
                    const myurl = `${V_URL}/user/dnp-grid-balance-update`;
                    const response = await axios({
                        method: "post",
                        url: myurl,
                        data: bodyFormData,
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
                        },
                    });
                    const data = response.data;
                    if (data.success === true) {
                        getDisaptchOfferTable()
                        toast.success("Item has been removed!");
                        return data;
                    } else {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    toast.error(error.response.data.message);
                    return error;
                }
                return data;
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            return error
        }
    }

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
                                            {!is_view && !isEditMode && (
                                                                      <div className="add-group">
                                                                        <Link
                                                                          onClick={onAddItem}
                                                                          className="btn btn-primary add-pluss ms-2"
                                                                          data-toggle="tooltip"
                                                                          data-placement="top"
                                                                          title="Add"
                                                                        >
                                                                          <img
                                                                            src="/assets/img/icons/plus.svg"
                                                                            alt="plus"
                                                                          />
                                                                        </Link>
                                                                      </div>
                                                                 )} 
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
                                            <th>Assembly No.</th>
                                            <th>Assembly Qty.</th>
                                            <th>Dispatch No.</th>
                                            <th>Dispatch Site</th>
                                            <th>Grid No.</th>
                                            <th>Grid Qty.</th>
                                            <th>Remarks</th>
                                            <th className='text-end'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsData?.map((elem, i) =>
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{elem?.drawing_no || "-"}</td>
                                                <td>{elem?.rev}</td>
                                                <td>{elem?.assembly_no ?? elem?.item_name ?? "-"}</td>
                                                <td>{elem?.assembly_quantity || "-"}</td>
                                                <td>{elem?.dispatch_no || elem?.dispatch_report || "-"}</td>
                                                <td>{elem?.dispatch_site || "-"}</td>
                                                <td>{elem?.grid_no || "-"}</td>
                                                <td>{elem?.surface_used_grid_qty || "-"}</td>
                                                {!data?._id ? (

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
                                                )}
                                                {editRowIndex === i ? (
                                                    <td>
                                                        <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                        <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                                    </td>
                                                ) : <td className='text-end'>
                                                    {!data?._id ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger p-1 mx-1"
                                                            onClick={() => handleRemoveByDrawing(elem)}
                                                        >
                                                            Remove
                                                        </button>
                                                    ) : '-'}
                                                </td>}
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
                                        {commentsData?.length > 0 && (
                                            <tr className="fw-bold">
                                                <td colSpan="8" className="text-end">
                                                    Total:
                                                </td>
                                                <td>
                                                {commentsData
                                                    .reduce(
                                                    (total, item) =>
                                                        total +
                                                        (parseFloat(item.surface_used_grid_qty) || 0),
                                                    0
                                                    )
                                                    .toFixed(2)}
                                                </td>

                                                <td colSpan="3"></td>
                                            </tr>
                                        )}
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

export default SurfaceTable