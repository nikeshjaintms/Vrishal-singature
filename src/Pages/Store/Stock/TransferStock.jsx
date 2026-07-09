import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { M_STORE, V_URL } from "../../../BaseUrl";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Include/Loader";
import { Pagination, Search } from "../Table";
import DropDown from "../../../Components/DropDown";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Footer from "../Include/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getMainStock } from "../../../Store/Store/Stock/getMainStock";
import { DownloadXlsx } from "../Components/DownloadXlsx";
import { DownloadPdf } from "../Components/DownloadPdf";
import FilterComponent from "../Transaction/FilterComponent";
import moment from 'moment';

const TransferStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(true);
  const [selectedYear, setSelectedYear] = useState('');
  const [yearData, setYearData] = useState([]);
  const [filter, setFilter] = useState({
    date: {
      start: null,
      end: null,
    },
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [stockRows, setStockRows] = useState([]);

  const handleDateChange = (e, type) => {
    const dateValue = e.target.value;
    setFilter((prevFilter) => {
      const newFilter = {
        ...prevFilter,
        date: {
          ...prevFilter.date,
          [type]: dateValue,
        },
      };
      const bodyFormData = new URLSearchParams();
      bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
      bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
      bodyFormData.append("filter", JSON.stringify(newFilter));
      dispatch(getMainStock(bodyFormData));
      return newFilter;
    });
  };


  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYear(yearId);
    setFilter(prev => {
      const newFilter = { ...prev, year_id: yearId };
      fetchData(newFilter);
      return newFilter;
    });
  };

  useEffect(() => {
    const fetchYears = () => {
      // const myurl = `${V_URL}/user/get-year`;
        const myurl = `${V_URL}/user/get-year?status=false`;
      axios({
        method: "get",
        url: myurl,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response?.data?.success === true) {
          setYearData(response?.data?.data);
        } else {
          toast.error("Something went wrong");
        }
      }).catch(() => {
        toast.error("Something went wrong");
      });
    };

    fetchYears();
  }, []);


  useEffect(() => {
    if (localStorage.getItem("PAY_USER_TOKEN") === null) {
      navigate("/user/login");
    } else if (localStorage.getItem("VI_PRO") !== `${M_STORE}`) {
      toast.error("Access Denied. Please contact your administrator.");
      navigate("/user/login");
    }
    if (disable === true) {
      fetchData();
    }
  }, [navigate, disable, filter]);

  const fetchData = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
    bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'));
    bodyFormData.append("filter", JSON.stringify(filter));
    dispatch(getMainStock(bodyFormData));
    setDisable(false);
  };

  const entity = useSelector((state) => state.getMainStock?.user?.data);

  const commentsData = useMemo(() => {
    let computedComments = entity?.store_items || [];

    if (search) {
      computedComments = computedComments.filter(
        (stock) =>
          stock.item_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          stock.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
          stock.material_grade?.toLowerCase()?.includes(search?.toLowerCase()) ||
          stock.m_code?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);



  // useEffect(() => {
  //   const initialRows = commentsData.map((item) => ({
  //     _id: item._id,
  //     bal_qty: item.balance,
  //     damage_qty: 0,
  //     missing_qty: 0,
  //     total_qty: item.balance,
  //   }));
  //   setStockRows(initialRows);
  // }, [commentsData]);



useEffect(() => {
  const initialRows = commentsData.map((item) => ({
    _id: item._id,
    item_id: item._id,
    item_name: item.item_name,
    bal_qty: item.balance ?? 0,
    damage_qty: 0,
    missing_qty: 0,
    total_qty: item.balance ?? 0,
    m_code: item.m_code,
    unit: item.unit,
    material_grade: item.material_grade || 0,
    opening_balance: Number(item.opening_balance) || 0,
    date_totalIn: Number(item.date_totalIn) || 0,
    date_totalOut: Number(item.date_totalOut) || 0,
    balance: Number(item.balance) || 0,
  }));
  setStockRows(initialRows);
}, [commentsData]);


useEffect(() => {
  if (entity?.store_items?.length) {
//    entity.store_items.forEach((item) => {
//   console.log(item);
// });
    const initialRows = entity.store_items.map((item) => ({
        item_id: item.item_id || "-",
      item_name: item.item_name,
      bal_qty: item.balance ?? 0,
      damage_qty: 0,
      missing_qty: 0,
      total_qty: item.balance ?? 0,
      m_code: item.m_code,
      unit: item.unit,
      material_grade: item.material_grade || "-",
      opening_balance: Number(item.opening_balance) || 0,
      date_totalIn: Number(item.date_totalIn) || 0,
      date_totalOut: Number(item.date_totalOut) || 0,
      balance: Number(item.balance) || 0,
    }));
    setStockRows(initialRows);
    console.log("initialRows ", initialRows );
  }
 
}, [entity]);



  const handleQtyChange = (index, field, value) => {
    const newRows = [...stockRows];
    // const numericValue = Number(value) || 0;
    const numericValue = value === "" ? "" : Number(value);

    newRows[index][field] = numericValue;

    const bal = newRows[index].bal_qty;
    const dmg = newRows[index].damage_qty;
    const miss = newRows[index].missing_qty;
    

    newRows[index].total_qty = bal - dmg - miss;
    setStockRows(newRows);
  };



//   const handleSubmit = async () => {
//     try {
//       const payload = stockRows.map(row => ({
//         item_id: row._id,
//         bal_qty: row.bal_qty,
//         damage_qty: row.damage_qty,
//         missing_qty: row.missing_qty,
//         total_qty: row.total_qty
//       }));

//       await axios.post(`${V_URL}/user/year-stock-transfer`, { rows: payload }, {
//         headers: {
//           Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       });

//       toast.success("Stock transferred successfully");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error saving stock transfer");
//     }
//   };

const handleSubmit = async () => {

  
  if (!selectedYear) {
    toast.error("Please select a year before submitting.");
    return;
  }

  try {

const payload = {
  year_id: selectedYear,
  items: stockRows.map(row => ({
     item_id: row.item_id,
    m_code: row.m_code || "-",
    item_name: row.item_name || "-",
    unit: row.unit || "-",
     bal_qty: row.bal_qty,
    material_grade: row.material_grade || "-",
    // date_totalIn: row.date_totalIn || 0,
    //   date_totalOut: row.date_totalOut || 0,
      totalIn: Number(row.date_totalIn) || 0,
totalOut: Number(row.date_totalOut) || 0,

    balance: Number(row.balance) || 0,
    opening_balance: Number(row.opening_balance) || 0,
    damage_qty: Number(row.damage_qty) || 0,
    missing_qty: Number(row.missing_qty) || 0,
    total_qty: Number(row.total_qty) || 0,
  }))
};


    
    await axios.post(`${V_URL}/user/year-stock-transfer`, payload, {
      headers: {
        Authorization: "Barrer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });

    toast.success("Stock transferred successfully");
  } catch (err) {
    console.error(err);
    toast.error("Error saving stock transfer");
  }
};

  const downloadXlsx = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('filter', JSON.stringify(filter));
    bodyFormData.append('print_date', true);
    DownloadXlsx({ apiMethod: 'post', url: 'ms-stock-xslx', body: bodyFormData, fileName: 'main-store-stock' })
  }

  const downloadPdf = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('filter', JSON.stringify(filter));
    bodyFormData.append('print_date', true);
    DownloadPdf({ apiMethod: 'post', url: 'ms-stock-download', body: bodyFormData });
  }


  const handleRefresh = () => {
    setDisable(true);
    setFilter({
      date: {
        start: null,
        end: null,
      },
    });
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
                    <Link to="/main-store/user/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Stock List</li>
                </ul>
              </div>
            </div>
          </div>

          {disable === false ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="input-block">
                        <label>Select Year<span className="login-danger">*</span></label>
                        <select
                          className="form-control select"
                          value={selectedYear}
                          onChange={handleYearChange}
                        >
                          <option value="">Select Year</option>
                          {yearData.map((e) => (
                            <option key={e._id} value={e._id}>
                              {moment(e.start_year).format("YYYY")}-{moment(e.end_year).format("YYYY")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Stock List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search
                                    onSearch={(value) => {
                                      setSearch(value);
                                      setCurrentPage(1);
                                    }}
                                  />
                                  <a className="btn">
                                    <img src="/assets/img/icons/search-normal.svg" alt="search" />
                                  </a>
                                </form>
                              </div>
                              <div className="add-group">
                                <button
                                  type="button"
                                  onClick={handleRefresh}
                                  className="btn btn-primary doctor-refresh ms-2"
                                >
                                  <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                                </button>
                                <button
                                  className="btn btn-primary doctor-refresh ms-2"
                                  onClick={() => setOpenFilter(!openFilter)}
                                >
                                  <i className="fas fa-filter"></i>
                                </button>
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
                        <FilterComponent
                          handleDateChange={handleDateChange}
                          handleDownloadPdf={downloadPdf}
                          handleDownloadXlsx={downloadXlsx}
                          openFilter={openFilter}
                        />
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table border-0 custom-table comman-table mb-0 datatable">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            <th>Item</th>
                            
                            <th>M Code</th>
                            <th>Unit</th>
                            <th>Material Grade</th>
                            <th>OP Qty.</th>
                            <th>IN Qty.</th>
                            <th>Out Qty.</th>
                            <th>Bal. Qty.</th>
                            <th>Damage Qty.</th>
                            <th>Missing Qty.</th>
                            <th>Total Qty.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) => (
                            <tr key={elem?._id}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem.item_name}   <input type="hidden" name="item_id" value={elem.item_id} /> </td>
                              <td>{elem.m_code}   <input type="hidden" name="m_code" value={elem.m_code} /></td>
                              <td>{elem.unit} <input type="hidden" name="unit" value={elem.unit} /></td>
                              <td>{elem.material_grade || "-"}   <input type="hidden" name="material_grade" value={elem.material_grade} /></td>
                              <td>{elem.opening_balance}   <input type="hidden" name="opening_balance" value={elem.opening_balance} /> </td>
                              <td>{elem.date_totalIn}   <input type="hidden" name="totalIn" value={elem.totalIn} /></td>
                              <td>{elem.date_totalOut}   <input type="hidden" name="totalOut" value={elem.totalOut} /></td>
                              <td>{elem.balance}   <input type="hidden" name="balance" value={elem.balance} /></td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  style={{ width: '100px' }}
                                //   value={stockRows[i]?.damage_qty || ''}
                                  value={stockRows[i]?.damage_qty === "" ? 0 : stockRows[i]?.damage_qty}
                                  onChange={(e) => handleQtyChange(i, 'damage_qty', e.target.value)}
                                  placeholder="Enter value"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  style={{ width: '100px' }}
                                //   value={stockRows[i]?.missing_qty || ''}
                                  value={stockRows[i]?.missing_qty === "" ? 0 : stockRows[i]?.missing_qty}

                                  onChange={(e) => handleQtyChange(i, 'missing_qty', e.target.value)}
                                  placeholder="Enter value"
                                />
                              </td>
                              <td>{stockRows[i]?.total_qty || ''}</td>
                            </tr>
                          ))}
                          {commentsData?.length === 0 && (
                            <tr>
                              <td colSpan="999">
                                <div className="no-table-data">No Data Found!</div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="row align-center mt-3 mb-2">
                      <div className="col-sm-12 col-md-6">
                        <div className="dataTables_info">
                          Showing {Math.min(limit, totalItems)} from {totalItems} data
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-6">
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
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-body text-end">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
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

export default TransferStock;
