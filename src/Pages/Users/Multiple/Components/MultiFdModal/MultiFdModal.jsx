import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Modal } from 'react-bootstrap'
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { manageFdTable } from '../../../../../Store/MutipleDrawing/MultiFd/manageFdTable';
import { updateNdtGrid } from '../../../../../Store/MutipleDrawing/MultiFd/updateNdtGrid';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import { getUserMultiNdtMaster } from '../../../../../Store/MutipleDrawing/MultiNDT/getUserMultiNdtMaster';
import { getFdTable } from '../../../../../Store/MutipleDrawing/MultiFd/getFdTable';

const MultiFdModal = ({ showItem, handleCloseModal, title, setFinalArr, issueFd = [], ndtData = [], drawId }) => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [itemData, setItemData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // keep getFDOfferTable stable
  const getFDOfferTable = useCallback(() => {
    const formData = new URLSearchParams();
    formData.append('project', localStorage.getItem('U_PROJECT_ID'));
    formData.append('issue_acc_id', localStorage.getItem('issue_acc_ids') ? localStorage.getItem('issue_acc_ids') : []);
    formData.append('ndt_master_id', localStorage.getItem('ndt_master_ids') ? localStorage.getItem('ndt_master_ids') : []);
    dispatch(getFdTable({ bodyFormData: formData }));
  }, [dispatch]);

  useEffect(() => {
    // Set new FD flag only once on mount
    localStorage.setItem('IS_NEW_FD', 'true');
  }, []);

  // When the modal opens, fetch FD table (if needed)
  useEffect(() => {
    if (showItem) {
      getFDOfferTable();
    }
  }, [showItem, getFDOfferTable]);

  // compute item data whenever ndtData / issues / drawId / refresh changes
  useEffect(() => {
    if (!drawId) {
      setItemData([]);
      return;
    }

    // filter the ndt reports that contain our drawId
    const filteredReports = (ndtData || []).filter((report) =>
      (report?.items || []).some((item) => item?.drawing_id === drawId)
    );

    const matchingItems = (filteredReports || []).flatMap((report) =>
      (report?.items || []).filter((item) => item?.drawing_id === drawId)
    );

    const itemMap = new Map();
    matchingItems.forEach((item) => {
      const gridItemId = item?.grid_item_id?._id;
      if (!gridItemId) return;
      if (!itemMap.has(gridItemId)) {
        itemMap.set(gridItemId, { ...item, ndt_used_grid_qty: 0 });
      }
      const mapEntry = itemMap.get(gridItemId);
      mapEntry.ndt_used_grid_qty = (mapEntry.ndt_used_grid_qty || 0) + (item.ndt_used_grid_qty || 0);
      itemMap.set(gridItemId, mapEntry);
    });

    const finalArray = Array.from(itemMap.values());

    // merge per grid
    const mergeAsPerGrid = finalArray.reduce((acc, currentItem) => {
      const gridId = currentItem.grid_item_id?.grid_id?._id;
      if (!gridId) return acc;
      if (!acc[gridId]) {
        acc[gridId] = {
          grid_item_id: {
            ...currentItem.grid_item_id,
            item_qty: currentItem.grid_item_id?.item_qty || 0
          },
          drawing_id: currentItem.drawing_id,
          ndt_balance_qty: currentItem.ndt_balance_qty,
          ndt_used_grid_qty: currentItem.ndt_used_grid_qty,
          moved_next_step: currentItem.moved_next_step,
          _id: currentItem._id
        };
      } else {
        acc[gridId].grid_item_id.item_qty += currentItem.grid_item_id?.item_qty || 0;
      }
      return acc;
    }, {});

    const finalMergeData = Object.values(mergeAsPerGrid);

    // gather issue acc related info
    const filterIssueAcc = (issueFd || []).filter((is) =>
      (is?.items || []).some((item) => item?.drawing_id?._id === drawId)
    ) || [];

    const matchIssueAcc = (filterIssueAcc || []).flatMap((report) =>
      (report?.items || []).filter((item) => item?.drawing_id?._id === drawId)
    ) || [];

    const groupedData = Object.values(
      (matchIssueAcc || []).reduce((acc, item) => {
        const gridId = item?.grid_item_id?.grid_id?._id;
        if (!gridId) return acc;
        if (!acc[gridId]) {
          acc[gridId] = {
            drawing_id: item.drawing_id?._id,
            grid_item_id: item.grid_item_id,
            iss_used_grid_qty: item.iss_used_grid_qty,
            iss_balance_grid_qty: item.iss_balance_grid_qty,
            moved_next_step: item.moved_next_step,
            is_accepted: item.is_accepted,
            _id: item._id,
          };
        }
        return acc;
      }, {})
    );

    if (finalMergeData.length > 0) {
      const finalData = finalMergeData.map((e) => ({
        ...e,
        original_qty: parseInt(e?.ndt_used_grid_qty) || 0,
        max_qty: (parseInt(e?.ndt_used_grid_qty) || 0) - (parseInt(e.moved_next_step) || 0),
        drawing_id: drawId,
        ndt_used_grid_qty: (parseInt(e?.ndt_used_grid_qty) || 0) - (parseInt(e.moved_next_step) || 0),
        fd_used_grid_qty: e?.fd_used_grid_qty || '',
        fd_balanced_grid_qty: e?.fd_balanced_grid_qty || '',
        moved_next_step: parseInt(e?.moved_next_step) || 0,
      }));
      setItemData(finalData);
    } else if (groupedData.length > 0) {
      const finalGroupData = groupedData.map((e) => ({
        ...e,
        moved_next_step: parseInt(e?.moved_next_step) || 0,
        fd_used_grid_qty: e?.fd_used_grid_qty || '',
        fd_balanced_grid_qty: e?.fd_balanced_grid_qty || '',
        original_qty: parseInt(e?.iss_used_grid_qty) || 0,
        ndt_used_grid_qty: (parseInt(e?.iss_used_grid_qty) || 0) - (parseInt(e?.moved_next_step) || 0),
        max_qty: (parseInt(e?.iss_used_grid_qty) || 0) - (parseInt(e?.moved_next_step) || 0)
      }));
      setItemData(finalGroupData);
    } else {
      setItemData([]);
    }

    // optionally refresh FD offer table when data changed and modal open
    // getFDOfferTable() is already called on showItem change
  }, [ndtData, drawId, issueFd, refreshTrigger]);

  // filtered/paginated comments
  const filteredComments = useMemo(() => {
    let computed = itemData || [];
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      computed = computed.filter((it) =>
        String(it?.grid_item_id?.grid_id?.grid_no || '').toLowerCase().includes(s)
      );
    }
    return computed;
  }, [itemData, search]);

  const commentsData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return (filteredComments || []).slice(start, start + limit);
  }, [filteredComments, currentPage, limit]);

  useEffect(() => {
    setTotalItems((filteredComments || []).length);
    setCurrentPage(prev => {
      const max = Math.max(1, Math.ceil(((filteredComments || []).length || 0) / limit));
      return Math.min(prev, max);
    });
  }, [filteredComments, limit]);

  const handleGridQtyChange = (index, value) => {
    const newValue = value === '' ? '' : Math.max(0, Number(value));
    setItemData((prevItemData) =>
      prevItemData.map((item, idx) => {
        if (idx === index) {
          const maxQty = item.original_qty || 0;
          const moveQty = item.moved_next_step || 0;
          const final_qty = maxQty - moveQty;
          if (newValue === "" || (newValue >= 0 && newValue <= final_qty)) {
            const updatedQty = final_qty - (newValue === "" ? 0 : newValue);
            return {
              ...item,
              fd_used_grid_qty: newValue,
              ndt_used_grid_qty: updatedQty,
              fd_balanced_grid_qty: updatedQty,
            };
          }
        }
        return item;
      })
    );
  };

  const handleSave = async () => {
    const updatedArray = (itemData || []).filter((it) => (Number(it?.fd_used_grid_qty) || 0) > 0);
    if (!updatedArray || updatedArray.length === 0) {
      toast.error("Please enter valid Grid Used Quantity for at least one item.");
      return;
    }

    const updatedFdData = updatedArray.map((item) => ({
      drawing_id: item.drawing_id,
      grid_id: item?.grid_item_id?.grid_id?._id,
      fd_balanced_grid_qty: item.fd_balanced_grid_qty,
      fd_used_grid_qty: item.fd_used_grid_qty,
    }));

    const filteredReports = (ndtData || []).filter((report) =>
      (report?.items || []).some((item) => item?.drawing_id === drawId)
    );
    const filterIssueAcc = (issueFd || []).filter((is) =>
      (is?.items || []).some((item) => item?.drawing_id?._id === drawId)
    ) || [];

    let storedNdtIds = JSON.parse(localStorage.getItem("ndt_master_ids") || "[]");
    let storedIssueIds = JSON.parse(localStorage.getItem("issue_acc_ids") || "[]");

    const newNdtIds = [...new Set([...(storedNdtIds || []), ...filteredReports.map((id) => id?._id)])];
    const newIssueIds = [...new Set([...(storedIssueIds || []), ...filterIssueAcc.map((id) => id?._id)])];

    localStorage.setItem("ndt_master_ids", JSON.stringify(newNdtIds));
    localStorage.setItem("issue_acc_ids", JSON.stringify(newIssueIds));
    const issIds = filterIssueAcc.map((id) => id?._id);
    const ndtIds = filteredReports.map((id) => id?._id);

    const formData = new URLSearchParams();
    formData.append('flag', 1);
    formData.append('items', JSON.stringify(updatedFdData));
    formData.append('ndt_master_id', JSON.stringify(ndtIds) ? JSON.stringify(ndtIds) : []);
    formData.append('issue_acc_id', JSON.stringify(issIds) ? JSON.stringify(issIds) : []);

    const tableData = new URLSearchParams();
    tableData.append('ndt_master_id', JSON.stringify(ndtIds) ? JSON.stringify(ndtIds) : []);
    tableData.append('issue_acc_id', JSON.stringify(issIds) ? JSON.stringify(issIds) : []);
    tableData.append('items', JSON.stringify(updatedFdData));
    tableData.append('is_new', localStorage.getItem('IS_NEW_FD'));

    try {
      await dispatch(updateNdtGrid({ bodyFormData: formData }));
      const res = await dispatch(manageFdTable({ bodyFormData: tableData }));
      if (res?.success === true || res?.payload?.success === true) {
        localStorage.setItem('IS_NEW_FD', 'false');
      }
      setFinalArr(prevState => [...(prevState || []), ...updatedFdData]);
      setRefreshTrigger(prev => !prev);
      handleCloseModal();
      // refresh parent sources
      dispatch(getMultipleIssueAcc());
      dispatch(getUserMultiNdtMaster({ status: 3 }));
      toast.success("Final Dimension Items saved successfully.");
    } catch (error) {
      toast.error("Failed to save data. Please try again.");
    }
  }

  return (
    <>
      <Modal size='lg' show={!!showItem} backdrop="static" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header multi-draw-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3></h3>
                          <div className="doctor-search-blk">
                            <div className="top-nav-search table-search-blk">
                              <form>
                                <Search onSearch={(value) => { setSearch(value); }} />
                                <a className="btn"><img src="/assets/img/icons/search-normal.svg" alt="search" /></a>
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
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table mb-0 multi-draw-table">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Gri. No.</th>
                          <th>Gri. Qty.</th>
                          <th>Gri. Bal. Qty.</th>
                          <th>Gri. Use Qty.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, index) =>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{elem?.grid_item_id?.grid_id?.grid_no || '-'}</td>
                            <td>{elem?.grid_item_id?.grid_id?.grid_qty || '-'}</td>
                            <td>{elem?.ndt_used_grid_qty}</td>
                            <td>
                              <input
                                className='form-control' style={{ padding: "4px", minHeight: '15px' }}
                                type="number"
                                value={elem.fd_used_grid_qty}
                                onChange={(e) => handleGridQtyChange(index, e.target.value)}
                                min="0"
                                max={elem.max_qty}
                                step="1"
                              />
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
                      <div className="dataTables_info" role="status" aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                      <div className="dataTables_paginate paging_simple_numbers">
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
        <Modal.Footer>
          <div className='col-12 text-end'>
            <button className='btn btn-primary' type='button' onClick={handleSave}>Save</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MultiFdModal;
