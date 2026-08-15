import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Pagination, Search } from "../../../Table";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../../../../../Components/DropDown";
import { getDrawing } from "../../../../../Store/Erp/Planner/Draw/Draw";
import toast from "react-hot-toast";
import { getMultiWeldVisual } from "../../../../../Store/MutipleDrawing/MultiWeldVisual/getMultiWeldVisual";
import { updateNDTGrid } from "../../../../../Store/MutipleDrawing/MultiNDT/UpdateNDTGrid";
import { manageNDTOfferTable } from "../../../../../Store/MutipleDrawing/MultiNDT/manageNDTTableOffer";

const MultiNDTModal = ({
  showItem,
  drawId,
  weldVisualId,
  handleCloseModal,
  title,
  setFinalArr,
}) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [finalGrid, setFinalGrid] = useState([]);
  const [itemData, setItemData] = useState([]);

  useEffect(() => {
    dispatch(getDrawing());
  }, []);

  const fitupWVData = useSelector((state) => state?.getMultiWeldVisual?.user?.data?.items);

  useEffect(() => {
    dispatch(getMultiWeldVisual({ status: 2 , page: currentPage, limit }));
    const filterWV = fitupWVData?.find((is) => is?._id === weldVisualId);
    const filterWVItems =
      filterWV?.items?.filter(
        (it) => it?.drawing_id === drawId && it?.is_accepted === true
      ) || [];
    console.log(filterWVItems, 'filterWVItems')
    const groupedData = Object.values(
      filterWVItems?.reduce((acc, item) => {
        const gridNo = `${item?.grid_item_id?.grid_id?._id}-${drawId}`;
        if (!acc[gridNo]) {
          acc[gridNo] = {
            grid_item_id: item?.grid_item_id,
            drawing_id: drawId,
            weld_used_grid_qty:
              parseInt(item?.weld_used_grid_qty) -
              parseInt(item?.moved_next_step || 0),
            orignal_qty: parseInt(item?.weld_used_grid_qty),
            moved_next_step: parseInt(item?.moved_next_step),
            max_qty: parseInt(item?.orignal_qty) - parseInt(item.moved_next_step),
            ndt_used_grid_qty: item.ndt_used_grid_qty || "",
            is_accepted: item?.is_accepted,
          };
        }
        return acc;
      }, {})
    );
    setItemData(groupedData || []);
    setFinalGrid(filterWVItems || []);
  }, [showItem, refreshTrigger, weldVisualId, drawId]);

  const commentsData = useMemo(() => {
    let computedComments = itemData;
    setTotalItems(computedComments?.length);
    return computedComments;
  }, [search, currentPage, limit, itemData]);

  const handleGridQtyChange = (index, value) => {
    const newValue = value ? Math.max(0, Number(value)) : "";
    setItemData((prevItemData) => {
      return prevItemData.map((item, idx) => {
        if (idx === index) {
          const maxQty = item.orignal_qty;
          const moveQty = item.moved_next_step;
          const final_qty = maxQty - moveQty;
          if (newValue === "" || (newValue >= 0 && newValue <= final_qty)) {
            const updatedQty = final_qty - newValue;
            return {
              ...item,
              ndt_used_grid_qty: newValue,
              weld_used_grid_qty: updatedQty,
              ndt_balance_qty: updatedQty,
            };
          }
        }
        return item;
      });
    });
  };

  const handleSave = async () => {
    // check the item balance qty (remaining qty) via matching use and move qty
    const filterFinalGrid = finalGrid?.filter((e) => parseInt(e?.weld_used_grid_qty) !== parseInt(e?.moved_next_step));

    const updatedFinalGrid = filterFinalGrid?.map((item2) => {
      const matchingItem = commentsData?.find(
        (item) =>
          item?.grid_item_id?.grid_id._id === item2?.grid_item_id?.grid_id._id
      );

      if (matchingItem) {
        return {
          ...item2,
          drawing_id: drawId,
          ndt_used_grid_qty: matchingItem.ndt_used_grid_qty,
          weld_used_grid_qty: matchingItem.weld_used_grid_qty,
          ndt_balance_qty: matchingItem.ndt_balance_qty,
          orignal_qty: matchingItem.orignal_qty,
        };
      }
      return item2;
    });
    const updatedArray = updatedFinalGrid.filter((item) => item.ndt_used_grid_qty > 0);
    if (updatedArray?.length === 0) {
      toast.error("Please enter valid Grid Used Quantity for at least one item.");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("flag", 1);
    formData.append("weld_visual_id", weldVisualId);
    formData.append("items", JSON.stringify(updatedArray));

    const tableData = new URLSearchParams();
    tableData.append("weld_visual_id", weldVisualId);
    tableData.append("items", JSON.stringify(updatedArray));
    try {
      await dispatch(updateNDTGrid({ bodyFormData: formData }));
      await dispatch(manageNDTOfferTable({ bodyFormData: tableData }));
      setFinalArr((prevState) => [...prevState, ...updatedArray]);
      setRefreshTrigger((prev) => !prev);
      handleCloseModal();
      toast.success("NDT items saved successfully.");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.");
    }
  };

  return (
    <Modal
      size="lg"
      //  dialogClassName="modal-90w"
      show={showItem}
      backdrop="static"
      onHide={handleCloseModal}
    >
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
                              <Search
                                onSearch={(value) => {
                                  setSearch(value);
                                }}
                              />
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
                      <DropDown
                        limit={limit}
                        onLimitChange={(val) => setlimit(val)}
                      />
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
                      {commentsData?.map((elem, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{elem?.grid_item_id?.grid_id?.grid_no || "-"}</td>
                          <td>{elem?.grid_item_id?.grid_id?.grid_qty || "-"}</td>
                          <td>{elem?.weld_used_grid_qty}</td>
                          <td>
                            <input className="form-control" style={{ padding: "4px", minHeight: "15px" }} type="number"
                              value={elem.ndt_used_grid_qty}
                              onChange={(e) => handleGridQtyChange(index, e.target.value)}
                              min="0"
                              max={elem.max_qty}
                              step="1"
                            />
                          </td>
                        </tr>
                      ))}
                      {commentsData?.length === 0 ? (
                        <tr>
                          <td colSpan="999">
                            <div className="no-table-data">No Data Found!</div>
                          </td>
                        </tr>
                      ) : null}
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
                      Showing {Math.min(limit, totalItems)} from {totalItems}{" "}
                      data
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                    <div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
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
        <div className="col-12 text-end">
          <button className="btn btn-primary" type="button" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default MultiNDTModal;
