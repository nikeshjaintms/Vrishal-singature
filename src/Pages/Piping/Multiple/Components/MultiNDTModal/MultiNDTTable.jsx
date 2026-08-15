import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../Table";
import DropDown from "../../../../../Components/DropDown";
import { getUserNdtMaster } from "../../../../../Store/Store/Ndt/NdtMaster";
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { getNDTOfferTable } from "../../../../../Store/MutipleDrawing/MultiNDT/getNDTOffertable";
import toast from "react-hot-toast";
import { MultiSelect } from "primereact/multiselect";
import { Save, X } from "lucide-react";
import { updateNDTGrid } from "../../../../../Store/MutipleDrawing/MultiNDT/UpdateNDTGrid";
import { removeNDTOffTable } from "../../../../../Store/MutipleDrawing/MultiNDT/removeNdtOfferTable";
import { getMultiWeldVisual } from "../../../../../Store/MutipleDrawing/MultiWeldVisual/getMultiWeldVisual";
const MultiNDTTable = ({ data, weldVId, finalArr, setSubmitArr }) => {

  const dispatch = useDispatch();
  const [search, setSearch] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    ndt_requirements: [{ ndt_type: '' }, { ndtName: '' }],
    remarks: '',
  });

  useEffect(() => {
    dispatch(getUserNdtMaster({ status: '' }));
    dispatch(getDrawing());
  }, []);

  useEffect(() => {
    if (weldVId) {
      dispatch(getNDTOfferTable({ weld_visual_id: weldVId }));
    }
  }, [finalArr, weldVId]);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const ndtData = useSelector((state) => state?.getUserNdtMaster?.user?.data);
  const ndtOfferData = useSelector((state) => state?.getNDTOfferTable?.user?.data);

  const getDrawingData = (drawId) => {
    const findDrawing = drawData?.find((dr) => dr?._id === drawId)
    return findDrawing;
  }

  useEffect(() => {
    const filteredNdt = ndtOfferData?.items?.filter(item => item.ndt_requirements?.length === 0);
    if (filteredNdt?.length > 0 && !data?._id) {
      setTableData(filteredNdt || []);
      setSubmitArr(filteredNdt || []);
    } else if (data?.items?.length > 0) {
      setTableData(data.items);
      setSubmitArr(data.items);
    } else {
      setTableData([]);
      setSubmitArr([]);
    }
  }, [finalArr, data, ndtOfferData]);

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      ndt_requirements: row.ndt_requirements,
      remarks: row.remarks,
    });
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ndt_requirements') {
      const selectedNdt = value.map(id => {
        const ndt = ndtData.find(ndt => ndt._id === id);
        return { ndt_type: id, ndtName: ndt?.name };
      });
      setEditFormData({ ...editFormData, ndt_requirements: selectedNdt });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  }

  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
    setTableData(updatedData);
    setSubmitArr(updatedData);
    setEditRowIndex(null);
  }

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const commentsData = useMemo(() => {
    let computedComments = tableData;
    if (search) {

    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [limit, search, totalItems, currentPage, tableData]);

  const handleRemoveByDrawing = async (itemId, report) => {
    if (!weldVId) {
      toast.error('Please select an fitup');
      return;
    }

    const updatedIssueArr = tableData.filter((item) => (item._id)?.toString() === (itemId)?.toString());

    const bodyFormData = new URLSearchParams();
    bodyFormData.append('flag', 0);
    bodyFormData.append('items', JSON.stringify(updatedIssueArr));
    bodyFormData.append('weld_visual_id', weldVId);

    const removeItem = new URLSearchParams();
    removeItem.append('weld_visual_id', weldVId);
    removeItem.append('items', JSON.stringify(updatedIssueArr))
    removeItem.append('report_no', report);

    try {
      await dispatch(updateNDTGrid({ bodyFormData }));
      await dispatch(removeNDTOffTable({ bodyFormData: removeItem }));
      const updatedIssueArr1 = tableData.filter((item) => item._id !== itemId);
      dispatch(getNDTOfferTable({ weld_visual_id: weldVId }));
      dispatch(getMultiWeldVisual({ status: 2 }));
      setTableData(updatedIssueArr1);
      setSubmitArr(updatedIssueArr1);
      toast.success("Item has been removed!");
    } catch (error) {
      toast.error('Error while removing');
    }
  }

  const ndtOptions = ndtData?.map((n) => ({
    label: n?.name,
    value: n?._id
  }));

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
                      <h3>Section Details List</h3>
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
                      <th>Assembly No.</th>
                      <th>Assembly Qty.</th>
                      <th>Section Details</th>
                      <th>Type Of Weld</th>
                      <th>WPS No.</th>
                      <th>Welding Process</th>
                      <th>Weldor No.</th>
                      <th>Grid No.</th>
                      <th>Grid Qty.</th>
                      <th>NDT Requirement</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) =>
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{getDrawingData(elem?.drawing_id)?.drawing_no}</td>
                        <td>{getDrawingData(elem?.drawing_id)?.rev}</td>
                        <td>{getDrawingData(elem?.drawing_id)?.assembly_no}</td>
                        <td>{getDrawingData(elem?.drawing_id)?.assembly_quantity}</td>
                        <td>{elem?.grid_item_id?.item_name?.name}</td>
                        <td>{elem.joint_type?.map((e) => e?.name).join(', ')}</td>
                        <td>{elem?.wpsNo?.wps_no}</td>
                        <td>{elem?.wpsNo?.weldingProcess}</td>
                        <td>{elem?.weldor_no?.welderNo}</td>
                        <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                        <td>{elem?.ndt_used_grid_qty}</td>
                        {!data?._id ? (
                          <>
                            {editRowIndex === i ? (
                              <>
                                <td>
                                  <div className='custom-select-wpr'>
                                    <MultiSelect
                                      value={editFormData?.ndt_requirements?.map(ndt => ndt.ndt_type)}
                                      onChange={(e) => handleEditFormChange({ target: { name: 'ndt_requirements', value: e.value } })}
                                      options={ndtOptions}
                                      optionLabel="label"
                                      placeholder="Select NDT Requirements"
                                      display="chip"
                                      className='w-100 multi-prime-react'
                                    />
                                  </div>
                                </td>
                                <td>
                                  <textarea className='form-control' value={editFormData.remarks}
                                    name='remarks' rows={1}
                                    onChange={handleEditFormChange} />
                                </td>
                              </>
                            ) : (
                              <>
                                <td onClick={() => handleEditClick(i, elem)}>{elem?.ndt_requirements?.length > 0 ? elem?.ndt_requirements?.map((e) => e.ndtName).join(', ') : '-'}</td>
                                <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <td>{elem?.ndt_requirements?.map((e) => e.ndtName).join(', ')}</td>
                            <td>{elem?.remarks || '-'}</td>
                          </>
                        )}
                        {!data?._id ? (
                          <>
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
                                  onClick={() => handleRemoveByDrawing(elem._id, elem.report_no)}
                                >
                                  Remove
                                </button>
                              ) : '-'}
                            </td>}
                          </>
                        ) : (
                          <td className='text-end'>-</td>
                        )}
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
        </div>
      </div>
    </>
  );
};

export default MultiNDTTable;
