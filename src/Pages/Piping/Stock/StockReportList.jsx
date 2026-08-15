import React, { useEffect, useMemo, useState } from "react";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getPipingStockReportList } from "../../../Store/Piping/Stock/getPipingStockReportList";
import { getItemDetails } from "../../../Store/Piping/Item/Item";
import Footer from "../Include/Footer";
import { Link } from "react-router-dom";
import { Pagination, SearchIndex } from "../Table";
import DropDown from "../../../Components/DropDown";
import Loader from "../Include/Loader";
import moment from "moment";
import { PdfDownloadErp } from "../../../Components/ErpPdf/PdfDownloadErp";
import { getReusableList } from "../../../Store/Store/Stock/getReusableList";
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
};

const StockReportList = () => {
  const dispatch = useDispatch();
  // const [disable, setDisable] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // if (disable === true) {
      dispatch(getPipingStockReportList({ page: currentPage, limit, search:debouncedSearch }));
      dispatch(getReusableList());
      dispatch(getItemDetails({ is_main: false }));
      // setDisable(false);
    // }
  }, [currentPage, limit, debouncedSearch]);

  const stockLoading = useSelector((state) => state.getPipingStockReportList?.loading || false);
  const stockError = useSelector((state) => state.getPipingStockReportList?.error || null);
  
  const entity = useSelector((state) => {
    // Try multiple paths to access the data
    const fullState = state.getPipingStockReportList;
    console.log("🔍 Full Redux state getPipingStockReportList:", fullState);
    console.log("🔍 state.data:", fullState?.data);
    console.log("🔍 state.user:", fullState?.user);
    console.log("🔍 state.user?.data:", fullState?.user?.data);
    console.log("🔍 state.user?.pagination:", fullState?.user?.data?.pagination);

    
    // Try different paths
    const stockData = 
      fullState?.data || 
      fullState?.user?.data || 
      [];
    
    console.log("📦 Stock entity data:", stockData, "Type:", typeof stockData, "IsArray:", Array.isArray(stockData), "Length:", stockData?.length);
    
    // Ensure we return an array
    if (Array.isArray(stockData)) {
      return stockData;
    } else if (stockData && typeof stockData === 'object') {
      // If it's an object, try to extract array
      console.warn("⚠️ stockData is not an array, trying to find data property");
      return stockData.data || [];
    }
    return [];
  });
  const reusableData = useSelector(
    (state) => state.getReusableList?.user?.data
  );
  const itemData = useSelector((state) => {
    const items = state?.getItemDetails?.user?.data?.data || [];
    console.log("Item data:", items?.length, "items loaded");
    return items;
  });

  console.log("Entity length:", entity?.length);
  console.log("ItemData length:", itemData?.length);
  console.log("Stock loading:", stockLoading);
  console.log("Stock error:", stockError);
  const pagination = useSelector(
  (state) => state.getPipingStockReportList?.user?.data?.pagination
);
  const commentsData = useMemo(() => {
    console.log("🔄 Computing commentsData - entity:", entity, "length:", entity?.length);
    
    if (!entity || !Array.isArray(entity) || entity.length === 0) {
      console.log("❌ No entity data to process. Entity:", entity);
      return [];
    }
    
    console.log("✅ Processing", entity.length, "items from entity");

    // Use itemId from data array to find matching items from piping-items table
    const enrichedData = entity.map((stockItem) => {
      let enrichedItem = { ...stockItem };

      // Extract itemId directly from stock list data (itemId is a string like "69254f6a287add4adcf0d3eb")
      let itemId = null;
      if (stockItem.itemId) {
        if (typeof stockItem.itemId === "object" && stockItem.itemId !== null) {
          itemId = stockItem.itemId._id?.toString() || stockItem.itemId.toString();
        } else {
          // itemId is already a string
          itemId = stockItem.itemId.toString().trim();
        }
      }

      console.log("Processing stock item - itemId:", itemId, "Current name:", stockItem.name);

      // Find matching item from piping-items table using itemId
      if (itemId && itemData && Array.isArray(itemData) && itemData.length > 0) {
        // Search in piping-items data (itemData comes from piping-items table via getItemDetails)
        const pipingItem = itemData.find((pipingItemRecord) => {
          // Convert _id to string for comparison (handle ObjectId or string)
          const pipingItemId = pipingItemRecord._id?.toString()?.trim() || pipingItemRecord._id?.trim();
          // Match itemId from stock list with _id from piping-items table
          const match = pipingItemId === itemId;
          if (match) {
            console.log("✓ Match found! itemId:", itemId, "pipingItem:", pipingItemRecord.item_name || pipingItemRecord.name);
          }
          return match;
        });

        // If found in piping-items table, populate the fields
        if (pipingItem) {
          // piping-items schema fields:
          // - item_name (String)
          // - item_description (String)
          // - material_grade (String)
          // - uom (ObjectId ref to 'piping-item-uom') - populated as object with .name
          // - size1, size2 (ObjectId ref to 'piping-item-size') - populated as object with .name
          // - thickness1, thickness2 (ObjectId ref to 'piping-item-thickness') - populated as object with .name
          enrichedItem = {
            ...enrichedItem,
            // Populate from piping-items table (itemPipingSchema)
            item_code: pipingItem.item_code || enrichedItem.item_code || "--",
            name: pipingItem.item_name || enrichedItem.name || "--",
            item_description: pipingItem.item_description || enrichedItem.item_description || "--",
            material_grade: pipingItem.material_grade || enrichedItem.material_grade || "--",
            // Handle populated references (uom, size1, size2, thickness1, thickness2)
            unit: pipingItem.uom?.name || enrichedItem.unit || "--",
            size1: pipingItem.size1?.name || enrichedItem.size1 || "--",
            thickness1: pipingItem.thickness1?.name || enrichedItem.thickness1 || "--",
            size2: pipingItem.size2?.name || enrichedItem.size2 || "--",
            thickness2: pipingItem.thickness2?.name || enrichedItem.thickness2 || "--",
            // Note: mcode is not in piping-items schema, keep original if exists
            mcode: enrichedItem.mcode || "--",
          };
          console.log("✓ Enriched from piping-items table:", {
            item_name: pipingItem.item_name,
            item_description: pipingItem.item_description,
            material_grade: pipingItem.material_grade,
            uom: pipingItem.uom?.name,
            size1: pipingItem.size1?.name,
            thickness1: pipingItem.thickness1?.name,
            size2: pipingItem.size2?.name,
            thickness2: pipingItem.thickness2?.name
          });
        } else {
          console.warn(`✗ Item NOT found in piping-items table for itemId: "${itemId}"`);
          console.log("First 5 available piping-items IDs:", itemData.slice(0, 5).map(it => ({
            id: it._id?.toString(),
            name: it.item_name || it.name
          })));
        }
      } else {
        if (!itemId) {
          console.warn("✗ Missing itemId in stock item");
        }
        if (!itemData || !Array.isArray(itemData) || itemData.length === 0) {
          console.warn("✗ piping-items data not loaded. itemData length:", itemData?.length);
        }
      }

      return enrichedItem;
    });

    // Then merge with reusable data
    const mergedData = enrichedData.map((item) => {
      const match = reusableData?.find(
        (reuse) =>
          item.itemId === reuse.item_id &&
          item.imir_no === reuse.imir_no &&
          item.invoice_no === reuse.invoice_no &&
          item.supplier_id === reuse.supplier_id &&
          item.manufacture_id === reuse.manufacture_id
      );

      if (match) {
        return {
          ...item,
          usableQty: match.usableQty,
          is_use: true,
        };
      } else {
        return {
          ...item,
          usableQty: "-",
          is_use: false,
        };
      }
    });

    let computedComments = mergedData;
    console.log("📊 After merging with reusable data:", mergedData.length, "items");

    // if (search) {
    //   computedComments = computedComments.filter(
    //     (st) =>
    //       st.invoice_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //       st.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
    //       st.imir_no?.toString().toLowerCase()?.includes(search?.toLowerCase())
    //   );
    //   console.log("🔍 After search filter:", computedComments.length, "items");
    // }
    
    // setTotalItems(computedComments?.length);
    
   return computedComments;
  }, [currentPage, search, limit, entity, reusableData, itemData]);

  console.log("🎯 Final commentsData:", commentsData, "Length:", commentsData?.length);



useEffect(() => {
  if (pagination?.totalRecords) {
    setTotalItems(pagination.totalRecords);
  }
}, [pagination]);

  const handleRefresh = () => {
    // setDisable(true);
    setSearch("");
  };

  const handleDownload = (options) => {
    if (options?.iselxs) {
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("print_date", true);
      bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
      PdfDownloadErp({
        apiMethod: "post",
        url: "piping-stock-list-xlsx",
        body: bodyFormData,
      });
    } else {
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("print_date", true);
      bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
      PdfDownloadErp({
        apiMethod: "post",
        url: `download-stock-list`,
        body: bodyFormData,
      });
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Stock List</li>
                </ul>
              </div>
            </div>
          </div>

          {!stockLoading ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Stock List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <SearchIndex
                                  value={search}
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
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
                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
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
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          {/* <div className='add-group'>
                                                        <button className='btn w-100 btn btn-primary doctor-refresh me-2 h-100' type='button' onClick={() => { handleDownload({ ispdf: true }) }}> PDF <i className="fa-solid fa-download mx-2"></i></button>
                                                    </div> */}
                          <div className="add-group">
                            <button
                              className="btn w-100 btn btn-primary doctor-refresh me-2 h-100"
                              type="button"
                              onClick={() => {
                                handleDownload({ iselxs: true });
                              }}
                            >
                              {" "}
                              XLSX <i className="fa-solid fa-download mx-2"></i>
                            </button>
                          </div>
                          <DropDown
                            limit={limit}
                            onLimitChange={(val) => setlimit(val)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table  mb-0">
                        <thead>
                          <tr>
                            <th>SR.</th>
                            <th>FIM LOT No/ Material PO No.</th>
                            <th>SUPPLIER</th>
                            <th>ITEM CODE</th>
                            <th>ITEM</th>
                            <th>ITEM DESCRIPTION</th>
                            <th>SIZE 1</th>
                            <th>THICKNESS 1</th>
                            <th>SIZE 2</th>
                            <th>THICKNESS 2</th>
                            <th>MATERIAL GRADE</th>
                            <th>INVOICE NO./PACKING LIST</th>
                            <th>MAKE/MANUFACTURER</th>
                            <th>UOM</th>
                            <th>PO QTY./ FIM QTY.</th>
                            <th>RECEIVED QTY.</th>
                            {/* <th>RECEIVING QTY</th> */}
                            <th>RECEIVED DATE</th>
                            <th>IMIR NO.</th>
                            <th>HEAT/ LOT NO.</th>
                            <th>TC NO.</th>
                            <th>ACCEPTED QTY</th>
                            <th>REJECTED QTY</th>
                            <th>ISSUED QTY</th>
                            <th>STOCK QTY</th>                            
                            <th>USABLE QTY</th>
                            <th>REMARKS</th>
                            <th>GENERATED</th>

                          </tr>
                        </thead>
                        <tbody>
                          
                          {commentsData?.map((elem, i) => (
                            <tr key={elem?._id}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.invoice_no || "-"}</td>
                              <td>{elem?.mainSupplierName || "-"}</td>
                              <td>{elem?.item_code || "-"}</td>
                              <td>{elem?.name || "-"}</td>
                              <td>{elem?.item_description || "-"}</td>
                              <td>{elem?.size1 || "-"}</td>
                              <td>{elem?.thickness1 || "-"}</td>
                              <td>{elem?.size2 || "-"}</td>
                              <td>{elem?.thickness2 || "-"}</td>
                              <td>{elem?.material_grade || "-"}</td>
                              <td>{elem?.package_list_no || "-"}</td>
                              <td>{elem?.make_manufacture || elem?.manufacture || "-"}</td>
                              <td>{elem?.unit || "-"}</td>
                              <td>{elem?.po_qty || "-"}</td>
                              <td>{(elem?.offeredQty)?.toFixed(2) || "-"}</td>
                              <td>
                                {elem?.receiving_date
                                  ? moment(elem?.receiving_date).format(
                                      "YYYY-MM-DD"
                                    )
                                  : "-"}
                              </td>
                              <td>{elem?.imir_no || "-"}</td>
                              <td>
                                {/* Display all heat lot numbers from heat_rows array */}
                                {elem?.heat_rows && Array.isArray(elem.heat_rows) && elem.heat_rows.length > 0 ? (
                                  elem.heat_rows.map((heat, idx) => (
                                    <span key={idx} style={{ display: 'block' }}>
                                      {heat.heat_lot_no || elem?.lot_no || "-"}
                                    </span>
                                  ))
                                ) : (
                                  elem?.lot_no || "-"
                                )}
                              </td>
                              <td>
                                {/* Display all TC numbers from heat_rows array */}
                                {elem?.heat_rows && Array.isArray(elem.heat_rows) && elem.heat_rows.length > 0 ? (
                                  elem.heat_rows.map((heat, idx) => (
                                    <span key={idx} style={{ display: 'block' }}>
                                      {heat.tc_no || "-"}
                                    </span>
                                  ))
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>{elem?.acceptedQty?.toFixed(2) || "-"}</td>
                              <td>{(elem?.rejectedQty)?.toFixed(2) || "-"}</td>
                              <td>{elem?.issued_qty?.toFixed(2) || "-"}</td>
                              <td>{elem?.stock_qty?.toFixed(2) || "-"}</td>
                              <td>{elem?.usableQty || "-"}</td>
                              <td>{elem?.remarks || "-"}</td>
                              <td>
                                {elem?.is_use === true ? (
                                  <span className="custom-badge status-green">
                                    Generated
                                  </span>
                                ) : (
                                  <span className="custom-badge status-orange">
                                    No Use
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}

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
                        <div
                          className="dataTables_info"
                          id="DataTables_Table_0_info"
                          role="status"
                          aria-live="polite"
                        >
                          Showing {Math.min(limit, totalItems)} from{" "}
                          {totalItems} data
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
          ) : (
            <Loader />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default StockReportList;
