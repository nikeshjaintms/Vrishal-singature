import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Search } from "../../../Table";
import DropDown from "../../../../../Components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import { getMultiLPTOfferTable } from "../../../../../Store/MutipleDrawing/MultiNDT/LptClearance/LptOfferTable";
import { Save, X } from "lucide-react";
import { removeLPTTable } from "../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RemoveRTTable";
import toast from "react-hot-toast";

const LPTLotBookOfferTable = ({
  setSubmitArr,
  submitArr,
  lptOffers,
  handleRemoveOffer,
  is_view,
  is_edit,
}) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // const [limit, setlimit] = useState(4);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [searchDrawing, setSearchDrawing] = useState("");
  const [searchPipingClass, setSearchPipingClass] = useState("");
  const [searchWelder, setSearchWelder] = useState("");
  const [editFormData, setEditFormData] = useState({
    is_cover: false,
    remarks: "",
    is_ready_to_submit: false, // 👈 ADD
  });

  const entityData = useSelector(
    (state) => state?.getMultiLPTOfferTable?.user?.data,
  );
  const entity = lptOffers && lptOffers.length > 0 ? lptOffers : entityData;
  console.log("Entity in LPT LOT BOOK OFFER TABLE : ", entity);
  useEffect(() => {
    if (loading === true) {
      const typeId = localStorage.getItem("LPT_TYPE_ID");
      const masterId = localStorage.getItem("LPT_TYPE_MASTER_IDS");
      if (typeId && masterId) {
        dispatch(getMultiLPTOfferTable({ typeId, masterId }));
      }
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    let items = [];
    let isNewStructure = false;
    if (Array.isArray(entity)) {
      items = entity;
      isNewStructure = true;
    } else if (entity?.items) {
      items = entity.items;
    }
    // const filterEntity = isNewStructure ? items : items?.filter((it) => !it?.ndt_offer_id);
    const filterEntity = items;
    const getId = (item) => item?.offer_main_id || item?.offer_id || item?._id;
    const mergedMap = new Map();

    // Base items from backend
    filterEntity?.forEach((it) => {
      if (it) mergedMap.set(getId(it) || Math.random(), it);
    });

    // Override/Add items from submitArr (local edits + edit mode initial items)
    if (submitArr && Array.isArray(submitArr)) {
      submitArr.forEach((it) => {
        if (it) {
          const id = getId(it);
          if (id && mergedMap.has(id)) {
            // mergedMap.set(id, { ...mergedMap.get(id), ...it });
            mergedMap.set(id, {
              ...mergedMap.get(id),
              ...it,
              is_ready_to_submit:
                it.is_ready_to_submit ?? mergedMap.get(id)?.is_ready_to_submit,
            });
          } else if (id) {
            mergedMap.set(id, it);
          } else {
            mergedMap.set(Math.random(), it);
          }
        }
      });
    }

    setTableData(Array.from(mergedMap.values()));
    setLoading(false);
  }, [entity, lptOffers, submitArr]);

  // const commentsData = useMemo(() => {
  //     let computedComments = tableData;
  //     return computedComments;
  // }, [tableData]);
  // const commentsData = useMemo(() => {
  //     if (!tableData || tableData.length === 0) return [];

  //     let rows = [...tableData];

  //     /* ---------- SORT: LATEST FIRST ---------- */
  //     rows.sort((a, b) => {
  //         // 1️⃣ createdAt (preferred)
  //         if (a.createdAt && b.createdAt) {
  //             return new Date(b.createdAt) - new Date(a.createdAt);
  //         }

  //         // 2️⃣ ObjectId fallback
  //         const aId = a.offer_id || a._id;
  //         const bId = b.offer_id || b._id;

  //         if (aId && bId) {
  //             return bId.toString().localeCompare(aId.toString());
  //         }

  //         return 0;
  //     });

  //     /* ---------- SEARCH ---------- */
  //     if (!search.trim()) return rows;

  //     const keyword = search.toLowerCase();

  //     return rows.filter((row) =>
  //         [
  //             row.drawing_no,
  //             row.rev,
  //             row.spool_no,
  //             row.joint_no,
  //             row.joint_size,
  //             row.joint_thickness,
  //             row.piping_class,
  //             row.joint_type,
  //             row.welder_no,
  //             row.weldor_no?.welderNo,
  //             row.remarks,
  //         ]
  //             .filter(Boolean)
  //             .some((val) =>
  //                 val.toString().toLowerCase().includes(keyword)
  //             )
  //     );
  // }, [tableData, search]);

  const commentsData = useMemo(() => {
    if (!tableData || tableData.length === 0) return [];

    let rows = [...tableData];

    /* ---------- SORT ---------- */
    rows.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      const aId = a.offer_id || a._id;
      const bId = b.offer_id || b._id;

      if (aId && bId) {
        return bId.toString().localeCompare(aId.toString());
      }

      return 0;
    });

    /* ---------- SEARCH ---------- */
    const drawingSearch = searchDrawing.trim().toLowerCase();
    const pipingSearch = searchPipingClass.trim().toLowerCase();
    const welderSearch = searchWelder.trim().toLowerCase();

    if (drawingSearch || pipingSearch || welderSearch) {
      rows = rows.filter((row) => {
        const drawingValue = (row.drawing_no || "").toLowerCase();
        const pipingValue = (row.piping_class || "").toLowerCase();
        const welderValue = (
          row.welder_no ||
          row.weldor_no?.welderNo ||
          ""
        ).toLowerCase();

        const drawingMatch = drawingValue.includes(drawingSearch);
        const pipingMatch = pipingValue.includes(pipingSearch);
        const welderMatch = welderValue.includes(welderSearch);

        return drawingMatch && pipingMatch && welderMatch;
      });
    }

    setTotalItems(rows.length);

    return rows;
    // .slice(
    //   (currentPage - 1) * limit,
    //   (currentPage - 1) * limit + limit,
    // );
  }, [
    tableData,
    currentPage,
    // limit,
    searchDrawing,
    searchPipingClass,
    searchWelder,
  ]);

  console.log("commentsData lpt======>", commentsData);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchDrawing, searchPipingClass, searchWelder]);
  const handleEditFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setEditFormData({
      ...editFormData,
      // [name]: value,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      ...row,
      is_cover: row.is_cover || false,
      remarks: row.remarks || "",
      is_ready_to_submit: row.is_ready_to_submit || false, // 👈 ADD
    });
  };

  // const handleSaveClick = () => {
  //     const updatedData = [...tableData];
  //     const dataIndex = (currentPage - 1) * limit + editRowIndex;
  //     const updatedItem = {
  //         ...updatedData[dataIndex],
  //         ...editFormData,
  //         is_ready_to_submit: true
  //     };
  //     updatedData[dataIndex] = updatedItem;
  //     setTableData(updatedData);

  //     setSubmitArr(prev => {
  //         const itemId = updatedItem.offer_main_id || updatedItem.offer_id || updatedItem._id;
  //         const exists = prev.some(item => (item.offer_main_id || item.offer_id || item._id) === itemId);

  //         if (exists) {
  //             return prev.map(item =>
  //                 (item.offer_main_id || item.offer_id || item._id) === itemId
  //                     ? { ...updatedItem }
  //                     : item
  //             );
  //         } else {
  //             return [...prev, updatedItem];
  //         }
  //     });
  //     setEditRowIndex(null);
  // }

  const handleSaveClick = () => {
    const updatedData = tableData.map((item) => {
      const itemId = item.offer_main_id || item.offer_id || item._id;
      const editId =
        editFormData.offer_main_id || editFormData.offer_id || editFormData._id;

      if (itemId === editId) {
        return {
          ...item,
          ...editFormData,
          is_ready_to_submit: true,
        };
      }
      return item;
    });
    console.log("updatedData====>", updatedData);
    // ✅ Update table data
    setTableData(updatedData);

    // ✅ Sync with submitArr
    setSubmitArr((prev) => {
      const itemId =
        editFormData.offer_main_id || editFormData.offer_id || editFormData._id;

      const updatedItem = {
        ...editFormData,
        is_ready_to_submit: true,
      };
      console.log("updatedItem====>", updatedData);

      const exists = prev.some(
        (item) => (item.offer_main_id || item.offer_id || item._id) === itemId,
      );

      if (exists) {
        return prev.map((item) =>
          (item.offer_main_id || item.offer_id || item._id) === itemId
            ? updatedItem
            : item,
        );
      } else {
        return [...prev, updatedItem];
      }
    });

    // ✅ Exit edit mode
    setEditRowIndex(null);
  };
  console.log("Submit Array in LPT LOT BOOK TABLE : ", submitArr);
  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTableData([]);
  };

  const handleRemoveByDrawing = (itData, is_edit) => {
    const offer_id = itData?.offer_id || itData?._id;
    let payload = {
      offer_id: "",
      is_lot: false,
    };

    if (is_edit) {
      payload.is_lot = true;
      payload.offer_id = itData._id;
    } else {
      payload.offer_id = itData.offer_id || itData?._id;
    }

    if (handleRemoveOffer && payload.offer_id) {
      handleRemoveOffer(payload);
    } else {
      console.warn("Missing offer_id or handleRemoveOffer", {
        payload,
        hasHandler: !!handleRemoveOffer,
      });
      toast.error("Cannot remove: Missing ID");
    }
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
                      <h3>Item List</h3>
                      <div className="doctor-search-blk">
                        <div class="top-nav-search table-search-blk">
                          <form>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by Drawing No"
                              value={searchDrawing}
                              onChange={(e) => setSearchDrawing(e.target.value)}
                            />

                            <a class="btn">
                              <img
                                src="/assets/img/icons/search-normal.svg"
                                alt="search"
                              />
                            </a>
                          </form>
                        </div>

                        <div class="top-nav-search table-search-blk">
                          <form>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by Piping Class"
                              value={searchPipingClass}
                              onChange={(e) =>
                                setSearchPipingClass(e.target.value)
                              }
                            />
                            <a class="btn">
                              <img
                                src="/assets/img/icons/search-normal.svg"
                                alt="search"
                              />
                            </a>
                          </form>
                        </div>

                        <div class="top-nav-search table-search-blk">
                          <form>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search by Welder No"
                              value={searchWelder}
                              onChange={(e) => setSearchWelder(e.target.value)}
                            />
                            <a class="btn">
                              <img
                                src="/assets/img/icons/search-normal.svg"
                                alt="search"
                              />
                            </a>
                          </form>
                        </div>
                      </div>
                      <div className="add-group">
                        <button
                          type="button"
                          onClick={handleRefresh}
                          className="btn btn-primary doctor-refresh ms-14"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Refresh"
                        >
                          <img
                            src="/assets/img/icons/re-fresh.svg"
                            alt="refresh"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table border-0 custom-table comman-table  mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Drawing No.</th>
                      <th>Rev</th>
                      <th>Spool No.</th>
                      <th>Joint No.</th>
                      <th>Size</th>
                      <th>Thickness</th>
                      <th>Piping Class</th>
                      <th>LPT%</th>
                      <th>Joint Type</th>
                      <th>Weldor No.</th>
                      <th>Status</th>
                      <th>NDT Offered Covered</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{elem?.drawing_no || ""}</td>
                        <td>{elem?.rev || ""}</td>
                        <td>{elem?.spool_no || ""}</td>
                        <td>{elem?.joint_no || ""}</td>
                        <td>{elem?.joint_size || ""}</td>
                        <td>{elem?.joint_thickness || ""}</td>
                        <td>{elem?.piping_class || ""}</td>
                        <td>{elem?.lpt_percentage || ""}</td>
                        <td>{elem?.joint_type || ""}</td>
                        <td>
                          {elem?.welder_no || elem?.weldor_no?.welderNo || ""}
                        </td>
                        <td>
                          {elem?.is_ready_to_submit === true && (
                            <span className="custom-badge status-green">
                              Ready For Submission
                            </span>
                          )}
                        </td>
                        {/* <td>{elem?.thickness}</td> */}
                        {editRowIndex === i ? (
                          <>
                            <td className="">
                              <div className="form-check form-switch d-flex align-items-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="is_cover"
                                  checked={editFormData?.is_cover}
                                  style={{ width: "30px", height: "16px" }}
                                  onChange={handleEditFormChange}
                                />
                              </div>
                            </td>
                            <td>
                              <textarea
                                className="form-control"
                                rows={1}
                                value={editFormData?.remarks}
                                name="remarks"
                                onChange={handleEditFormChange}
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td
                              onClick={() =>
                                !is_view && handleEditClick(i, elem)
                              }
                            >
                              {elem?.is_cover === true ? (
                                <span className="custom-badge status-green">
                                  True
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td
                              onClick={() =>
                                !is_view && handleEditClick(i, elem)
                              }
                            >
                              {elem?.remarks || "-"}
                            </td>
                          </>
                        )}
                        {editRowIndex === i ? (
                          <td>
                            <button
                              type="button"
                              className="btn btn-success p-1 mx-1"
                              onClick={handleSaveClick}
                            >
                              <Save />
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary p-1 mx-1"
                              onClick={handleCancelClick}
                            >
                              <X />
                            </button>
                          </td>
                        ) : (
                          <td className="text-end">
                            {!is_view && (
                              <button
                                type="button"
                                className="btn btn-danger p-1 mx-1"
                                onClick={() =>
                                  handleRemoveByDrawing(elem, is_edit)
                                }
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        )}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LPTLotBookOfferTable;
