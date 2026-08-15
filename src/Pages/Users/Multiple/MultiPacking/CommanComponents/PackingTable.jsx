import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Save, X } from "lucide-react";
import { V_URL } from "../../../../../BaseUrl";
import { Pagination, Search } from "../../../Table";
import DropDown from "../../../../../Components/DropDown";
import { getMultiPacking } from "../../../../../Store/MutipleDrawing/MultiPacking/GetMultiPacking";
import { GetMultiGenReleaseNote } from "../../../../../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote";

const PackingTable = ({
  onAddItem,
  setSubmitArr,
  data,
  irn_no,
  is_view = false,
}) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawingItems, setDrawingItems] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [drawingData, setDrawingData] = useState([]);

  const [editFormData, setEditFormData] = useState({ remarks: "" });

  useEffect(() => {
    getPackingOfferTable();
  }, [localStorage.getItem("U_PROJECT_ID"), irn_no]);

  const getPackingOfferTable = () => {
    dispatch(GetMultiGenReleaseNote());
    dispatch(getMultiPacking());
  };

  const getMultiPackingData = useSelector(
    (state) => state?.getMultiPacking?.user?.data
  );

  useEffect(() => {
    if (getMultiPackingData?.length > 0 && !is_view) {
      setTableData(getMultiPackingData);
      setSubmitArr(getMultiPackingData);
    } else if (data?._id) {
      setTableData(data?.items);
      setSubmitArr(data?.items);
    } else {
      setTableData([]);
      setSubmitArr([]);
    }
  }, [getMultiPackingData, irn_no]);

  const commentsData = useMemo(() => {
    let computedComments = tableData;

    if (search) {
      if (search) {
        computedComments = computedComments.filter(
          (dr) =>
            dr?.drawing_no.toString()?.toLowerCase()?.includes(search) ||
            dr?.assembly_no?.toString()?.toLowerCase()?.includes(search)
          //  `${dr?.drawing_no || ""}`.toLowerCase().includes(search) ||
          //  `${dr?.assembly_no || dr?.item_name || ""}`.toLowerCase().includes(search)
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
  };

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      remarks: row.remarks,
    });
  };

  const handleSaveClick = async () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;

    updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };

    setTableData(updatedData);
    setSubmitArr(updatedData);
    setEditRowIndex(null);
  };

  //   const handleRemoveByDrawing = async (elem) => {
  //     const removeItem = new URLSearchParams();
  //     removeItem.append("id", elem._id);
  //     try {
  //       const myurl = `${V_URL}/user/delete-multi-packing-offer`;
  //       const response = await axios({
  //         method: "post",
  //         url: myurl,
  //         data: removeItem,
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
  //         },
  //       });
  //  const isManual = !elem.rn_id && !elem.drawing_id && !elem.grid_id;
  //   if (isManual) {
  //     console.log("Skipping grid balance update: manual entry");
  //     return { skipped: true };
  //   }
  //       const data = response.data;
  //       if (data.success === true) {
  //         const balanceData = [
  //           {
  //             rn_id: elem.rn_id,
  //             rn_balance_grid_qty: elem.rn_balance_grid_qty,
  //             rn_used_grid_qty: elem.rn_used_grid_qty,
  //             drawing_id: elem.drawing_id,
  //             grid_id: elem?.grid_id,
  //           },
  //         ];

  //         const bodyFormData = new URLSearchParams();
  //         bodyFormData.append("items", JSON.stringify(balanceData));
  //         bodyFormData.append("is_delete", true);
  //         try {
  //           const myurl = `${V_URL}/user/release-grid-balance-update`;
  //           const response = await axios({
  //             method: "post",
  //             url: myurl,
  //             data: bodyFormData,
  //             headers: {
  //               Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
  //             },
  //           });
  //           const data = response.data;
  //           if (data.success === true) {
  //             getPackingOfferTable();
  //             toast.success("Item has been removed!");
  //             return data;
  //           } else {
  //             toast.error(response.data.message);
  //           }
  //         } catch (error) {
  //           toast.error(error.response.data.message);
  //           return error;
  //         }
  //         return data;
  //       } else {
  //         toast.error(response.data.message);
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data.message);
  //       return error;
  //     }
  //   };

  const handleRemoveByDrawing = async (elem) => {
    const removeItem = new URLSearchParams();
    removeItem.append("id", elem._id);
    try {
      const myurl = `${V_URL}/user/delete-multi-packing-offer`;
      const response = await axios({
        method: "post",
        url: myurl,
        data: removeItem,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      });

      const data = response.data;

      if (data.success === true) {
        const isManual = !elem.rn_id && !elem.drawing_id && !elem.grid_id;

        if (isManual) {
          console.log("Skipping grid balance update: manual entry");

          // ✅ Show toast and update frontend
          toast.success("Manual item has been removed!");
          getPackingOfferTable(); // or remove from local state manually
          return { skipped: true };
        }

        const balanceData = [
          {
            rn_id: elem.rn_id,
            rn_balance_grid_qty: elem.rn_balance_grid_qty,
            rn_used_grid_qty: elem.rn_used_grid_qty,
            drawing_id: elem.drawing_id,
            grid_id: elem?.grid_id,
          },
        ];

        const bodyFormData = new URLSearchParams();
        bodyFormData.append("items", JSON.stringify(balanceData));
        bodyFormData.append("is_delete", true);

        try {
          const balanceUrl = `${V_URL}/user/release-grid-balance-update`;
          const response = await axios({
            method: "post",
            url: balanceUrl,
            data: bodyFormData,
            headers: {
              Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
            },
          });

          const data = response.data;
          if (data.success === true) {
            toast.success("Item has been removed!");
            getPackingOfferTable(); // or update state
            return data;
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Balance update failed");
          return error;
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      return error;
    }
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  useEffect(() => {
    if (!is_view && data?.items) {
      setTableData(data.items);
      setSubmitArr(data.items);
    }
  }, [data, is_view]);

  useEffect(() => {
    let finalData = [];

    if (getMultiPackingData?.length > 0 && !is_view) {
      finalData = [...getMultiPackingData];
    } else if (data?._id) {
      finalData = [...data?.items];
    }

    const localData = localStorage.getItem("drawingItems");
    if (localData) {
      const localItems = JSON.parse(localData);
      finalData = [...finalData, ...localItems];
    }

    setTableData(finalData);
    setSubmitArr(finalData);
  }, [getMultiPackingData, irn_no, data, is_view]);

  // const mergedData = useMemo(() => {
  //   const merged = [...commentsData, ...drawingData.map(item => ({ ...item, isLocal: true }))];
  //   setTotalItems(merged.length);
  //   return merged.slice((currentPage - 1) * limit, (currentPage - 1) * limit + limit);
  // }, [commentsData, drawingData, currentPage, limit]);

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
                              <img
                                src="/assets/img/icons/search-normal.svg"
                                alt="search"
                              />
                            </a>
                          </form>
                        </div>
                        {!is_view && (
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
                      <th>Drawing No.</th>
                      <th>Assem No./Item</th>
                      <th>Grid No.</th>
                      <th> Qty.</th>
                      <th>IRN No.</th>
                      <th>Unit Assem. Weight(kg).</th>
                      <th>Total Assem. Weight(kg).</th>
                      <th>Remarks</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commentsData?.map((elem, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{elem?.drawing_no}</td>
                        <td>{elem?.assembly_no ?? elem?.item_name}</td>
                        <td>{elem?.grid_no}</td>
                        <td>{elem?.rn_used_grid_qty}</td>
                        <td>{elem?.irn_no}</td>
                        <td>{elem?.unit_assembly_weight}</td>
                        <td>{elem?.total_assembly_weight}</td>
                        {!data?._id ? (
                          <>
                            {editRowIndex === i ? (
                              <>
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
                                <td onClick={() => handleEditClick(i, elem)}>
                                  {elem?.remarks || "-"}
                                </td>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <td>{elem?.remarks || "-"}</td>
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
                            {!data?._id ? (
                              <button
                                type="button"
                                className="btn btn-danger p-1 mx-1"
                                onClick={() => handleRemoveByDrawing(elem)}
                              >
                                Remove
                              </button>
                            ) : (
                              "-"
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

                    {commentsData?.length > 0 && (
                      <tr className="fw-bold">
                        <td colSpan="4" className="text-end">
                          Total:
                        </td>
                        <td>
                          {commentsData
                            .reduce(
                              (total, item) =>
                                total +
                                (parseFloat(item.rn_used_grid_qty) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td></td>
                        <td>
                          {commentsData
                            .reduce(
                              (total, item) =>
                                total +
                                (parseFloat(item.unit_assembly_weight) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td>
                          {commentsData
                            .reduce(
                              (total, item) =>
                                total +
                                (parseFloat(item.total_assembly_weight) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>

                        <td colSpan="3"></td>
                      </tr>
                    )}
                    {/* {mergedData.map((elem, index) => (
  <tr key={index}>
    <td>{(currentPage - 1) * limit + index + 1}</td>
    <td>{elem?.drawing_no || elem?.item_name}</td>
    <td>{elem?.assembly_no}</td>
    <td>{elem?.grid_no}</td>
    <td>{elem?.rn_used_grid_qty}</td>
    <td>{elem?.irn_no}</td>
    <td>{elem?.unit_assembly_weight}</td>
    <td>{elem?.total_assembly_weight}</td>

    {!data?._id && !elem?.isLocal ? (
      editRowIndex === index ? (
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
        <td onClick={() => handleEditClick(index, elem)}>
          {elem?.remarks || "-"}
        </td>
      )
    ) : (
      <td>{elem?.remarks || "-"}</td>
    )}


    <td className="text-end">
      {!data?._id && !elem?.isLocal ? (
        editRowIndex === index ? (
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
  </tr>

  
))}

 {mergedData?.length > 0 && (
                      <tr className="fw-bold">
                        <td colSpan="4" className="text-end">
                          Total:
                        </td>
                        <td>
                          {mergedData
                            .reduce(
                              (total, item) =>
                                total +
                                (parseFloat(item.rn_used_grid_qty) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td></td>
                        <td>
                          {mergedData
                            .reduce(
                              (total, item) =>
                                total +
                                (parseFloat(item.unit_assembly_weight) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                        <td>
                          {mergedData
                            .reduce(
                              (total, item) =>
                                total +
                                (parseFloat(item.total_assembly_weight) || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>

                        <td colSpan="3"></td>
                      </tr>
                    )}  */}
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
