import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";
import { V_URL } from "../../../../../BaseUrl";
import { Pagination, Search } from "../../../Table";
import DropDown from "../../../../../Components/DropDown";
import { pipingGetMultiStockPacking } from "../../../../../Store/Piping/MultiStockPacking/PipingGetMultiStockPacking";
import { Dropdown } from "primereact/dropdown";
const PackingTable = ({
  onAddDrawing,
  onEditDrawing, // ✅ FIXED,
  setSubmitArr,
  data,
  irn_no,
  is_view = false,
  refreshOfferData,
}) => {
  const dispatch = useDispatch();

  /* ===================== STATE ===================== */
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ remarks: "" });

  /* ===================== REDUX DATA ===================== */
  const getMultiStockPackingData = useSelector(
    (state) => state?.pipingGetMultiStockPacking?.user?.data
  );
console.log("getMultiStockPackingData=======>",getMultiStockPackingData);
  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    if (!is_view) {
      dispatch(pipingGetMultiStockPacking());
    }
  }, [dispatch, is_view]);

  /* ===================== SET TABLE DATA (SINGLE SOURCE) ===================== */
useEffect(() => {
  if (is_view && data?.items) {
    setTableData(data.items);
    setSubmitArr(data.items);
  } else {
   const dataToSet = (getMultiStockPackingData || []).map((packing) => ({
  _id: packing._id,
  packing_no: packing.packing_no,
  item_id:packing.item_id,
  item_name:packing.item_name,
  size1:packing.size1,
  thickness1:packing.thickness1,
  irn_no: packing.irn_no,

  size2:packing.size2,
  thickness2:packing.thickness2,
material_grade:packing.material_grade,
uom:packing.uom,
  merged_imir_no: packing.merged_imir_no,
  total_packaged_qty: packing.total_packaged_qty,
  createdAt: packing.createdAt,
  items: packing.items, 
  
}));

    setTableData(dataToSet); // ✅ YOU MISSED THIS LINE

    if (setSubmitArr) setSubmitArr(dataToSet);
  }
}, [getMultiStockPackingData, data, is_view, setSubmitArr]);
console.log("tableData======>",tableData);
  /* ===================== TOTAL COUNT ===================== */
  useEffect(() => {
    setTotalItems(tableData.length);
  }, [tableData]);

  /* ===================== SEARCH + PAGINATION ===================== */
  const commentsData = useMemo(() => {
    let filtered = [...tableData];

    if (search) {
      filtered = filtered.filter(
        (dr) =>
          dr?.drawing_no?.toString().toLowerCase().includes(search) ||
          dr?.assembly_no?.toString().toLowerCase().includes(search)
      );
    }

    return filtered.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [tableData, search, currentPage, limit]);
console.log("commentsData=====>",commentsData);
  /* ===================== EDIT HANDLERS ===================== */
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({ remarks: row?.remarks || "" });
  };

  const handleSaveClick = () => {
    const updated = [...tableData];
    const realIndex = (currentPage - 1) * limit + editRowIndex;

    updated[realIndex] = {
      ...updated[realIndex],
      remarks: editFormData.remarks,
    };

    setTableData(updated);
    setSubmitArr(updated);
    setEditRowIndex(null);
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };
 const sumOfMTR = useMemo(() => {
  return commentsData.reduce((total, item) => {
    const qty = parseFloat(item?.total_packaged_qty) || 0;
    const uom = item?.uom?.toUpperCase();

    if (uom === "MTR") {
      return total + qty;
    }

     if (uom === "CM") {
      return total + qty / 100; // ✅ CM to Meter
    }

    if (uom === "MM") {
      return total + qty / 1000; // ✅ Convert MM to Meter
    }

    return total;
  }, 0);
}, [commentsData]);

  const sumOfNOS = useMemo(() => {
    return commentsData.reduce((total, item) => {
      if (item?.uom?.toUpperCase() === "NOS") {
        return total + (parseFloat(item?.total_packaged_qty
) || 0);
      }
      if(item?.spool_no){
        return total + (parseFloat(item?.total_packaged_qty
) || 0);
      }
      return total;
    }, 0);
  }, [commentsData]);


  /* ===================== REMOVE ITEM ===================== */
  // =================== REMOVE ===================
const handleRemoveByDrawing = useCallback(async (elem) => {
  try {
    const payload = {
      id: elem._id,
      package_no: elem.packing_no,
    };

    if (elem?.irn_id) {
      payload.irn_id = elem.irn_id;
      payload.irn_no = elem.irn_no;
      payload.source_type = "RELEASE_NOTE";
    }

    if (elem?.stock_issue_acceptance_id) {
      payload.stock_issue_acceptance_id = elem.stock_issue_acceptance_id;
      payload.source_type = "STOCK_ISSUE_ACCEPTANCE"; // ✅ FIXED TYPO
    }

    const response = await axios.post(
      `${V_URL}/user/piping/delete-multi-stock-packing-offer`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (response.data.success) {
      toast.success("Item removed");

      // refresh only (no complex filter needed)
      dispatch(pipingGetMultiStockPacking());
      refreshOfferData();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Delete failed");
  }
}, [dispatch, refreshOfferData]);
  console.log("commentsData from table as", commentsData);
  /* ===================== JSX (UNCHANGED) ===================== */
  return (
    <>
      {/* 🔥 YOUR ORIGINAL JSX — NOT TOUCHED 🔥 */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table show-entire">
            <div className="card-body">
              <div className="page-table-header mb-2">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="doctor-table-blk">
                      <h3>Item Detailed List</h3>
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
                              <img
                                src="/assets/img/icons/search-normal.svg"
                                alt="search"
                              />
                            </a>
                          </form>
                        </div>
                        {/* {!is_view && (
                          <div className="add-group">
                            <Link
                              onClick={onAddDrawing}
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
                        )} */}
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

              <div className="table-responsive mt-2">
                <table className="table border-0 custom-table comman-table  mb-0">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                     
                      <th>Item </th>
                      <th>Size 1</th>
                      <th>Thickness 1</th>
                      <th>Size 2</th>
                      <th>Thickness 2</th>
                      <th>UOM</th> 
                      <th>Material Grade</th>              
                      <th>Qty.</th>
                      <th>IMIR No./IRN No.</th>
                      <th>IRN No.</th>
                      {/* <th>Remarks</th> */}
                      {!is_view && (
                        <th className="text-end">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) => (
                      <tr key={elem?._id || i}>
                        <td>{(currentPage - 1) * limit + i + 1}</td>

                        
                        <td>{ elem?.item_name || "-"}</td>
                        <td>{elem?.size1 || "-"}</td>
                        <td>{elem?.thickness1 || "-"}</td>
                        <td>{elem?.size2 || "-"}</td>
                        <td>{elem?.thickness2 || "-"}</td>
                        <td>{elem?.uom || "-"}</td>
                        <td>{elem?.material_grade || "-"}</td>
                       <td>{elem?.total_packaged_qty || "-"}</td>
                        <td> {elem?.merged_imir_no
                          ? elem.merged_imir_no
                          : Array.isArray(elem?.merged_imir_no) && elem.merged_imir_no.length
                            ? elem.imir_no.join(", ")
                            : "-"} </td>
                        <td>{elem?.irn_no || '-'}</td>
                        {/* ===== REMARKS ===== */}
                        {/* {!data?._id ? (
                          editRowIndex === i ? (
                            <td>
                              <textarea
                                className="form-control"
                                rows={1}
                                value={editFormData?.remarks}
                                name="remarks"
                                onChange={handleEditFormChange}
                              />
                            </td>
                          ) : (
                            <td onClick={() => handleEditClick(i, elem)}>
                              {elem?.remarks || "-"}
                            </td>
                          )
                        ) : (
                          <td>{elem?.remarks || "-"}</td>
                        )} */}
                        {/* ===== ACTION ===== */}
                        {!is_view && (
                          <>
                            <td className="text-end">
                              {!data?._id ? (
                                editRowIndex === i ? (
                                  <>
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
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-danger p-1 mx-1"
                                    onClick={() => handleRemoveByDrawing(elem)}
                                  >
                                    Remove
                                  </button>
                                )
                              ) : (
                                "-"
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                    {/* ===== NO DATA ===== */}
                    {commentsData?.length === 0 && (
                      <tr>
                        <td colSpan="999">
                          <div className="no-table-data">No Data Found!</div>
                        </td>
                      </tr>
                    )}

                    {/* ===== TOTAL ROW ===== */}
                    {commentsData?.length > 0 && (
                      <>
                        <tr className="fw-bold">
                          <td colSpan="8" className="text-end">
                            SUM OF MTR:
                          </td>
                          <td>{sumOfMTR.toFixed(2)}</td>
                          <td colSpan="4"></td>
                        </tr>

                        <tr className="fw-bold">
                          <td colSpan="8" className="text-end">
                            SUM OF NOS:
                          </td>
                          <td>{sumOfNOS.toFixed(2)}</td>
                          <td colSpan="4"></td>
                        </tr>
                      </>
                    )}
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
                    Showing {Math.min(limit, totalItems)} from {totalItems} data
                  </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                  <div
                    className="dataTables_paginate paging_simple_numbers"
                    id="DataTables_Table_0_paginate"
                  >
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
  );
};

export default PackingTable;
