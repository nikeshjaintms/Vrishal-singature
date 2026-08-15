import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getGenMaster } from "../../../Store/Store/GenralMaster/GenMaster";
import { getMainStock } from "../../../Store/Store/Stock/getMainStock";
import Swal from "sweetalert2";
import axios from "axios";
import { V_URL } from "../../../BaseUrl";
import { useLocation } from "react-router-dom";

const ApproveRequestItemTable = ({ dataStore, onUpdateData, onSubmit }) => {
  const headers = [
    "Sr No.",
    "Item Name",
    "Category",
    "Supplier",
    "Brand",
    "Unit",
    "Available Qty",
    "Required Qty",
    "Approve Qty",
    "Remarks",
    "Action",
  ];

  const location = useLocation();
  const data = location.state;
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [approvedItems, setApprovedItems] = useState([]);

  const [filter, setFilter] = useState({
    date: {
      start: null,
      end: null,
    },
  });

  const stock = useSelector((state) => state.getMainStock?.user?.data || []);

  useEffect(() => {
    dispatch(getGenMaster());
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const storedApprovedItems = localStorage.getItem("approvedItems");
    const initialData = storedApprovedItems ? JSON.parse(storedApprovedItems) : dataStore;
    const mergedData = getBalances(initialData, stock);
    setApprovedItems(mergedData);
  }, [dataStore, stock]);

  const fetchData = () => {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
    bodyFormData.append("year_id", localStorage.getItem("PAY_USER_YEAR_ID"));
    bodyFormData.append("filter", JSON.stringify(filter));
    dispatch(getMainStock(bodyFormData));
  };

  const getBalances = (dataStore, stock) => {
    const stockItems = stock?.store_items || [];

    if (!stockItems.length) {
      return dataStore?.map((item) => ({
        ...item,
        balance: 0,
        approve_qty: item.approve_qty || 0,
      }));
    }

    const stockMap = stockItems.reduce((map, stockItem) => {
      map[stockItem.item_id] = stockItem.balance;
      return map;
    }, {});

    return dataStore?.map((item) => ({
      ...item,
      balance: stockMap[item.item_id] !== undefined ? stockMap[item.item_id] : 0,
      approve_qty: item.approve_qty || 0,
    }));
  };

  const handleApproveQtyChange = (rowIndex, value) => {
    const numericValue = value.trim() === "" ? 0 : parseInt(value, 10);

    if (isNaN(numericValue)) {
      toast.error("Approved quantity must be a valid number!");
      return;
    }
    const updatedItems = [...approvedItems];
    updatedItems[rowIndex] = { ...updatedItems[rowIndex], approve_qty: numericValue };
    setApprovedItems(updatedItems);
    localStorage.setItem("approvedItems", JSON.stringify(updatedItems));
    onUpdateData(updatedItems);
  };

  const handleDelete = (rowIndex) => {
    const itemToDelete = approvedItems[rowIndex];
    if (itemToDelete?.approve_qty > 0) {
      toast.error("Cannot delete an item with approved quantity greater than 0.");
      return;
    }
    if (!approvedItems[rowIndex]) {
      return;
    }

    Swal.fire({
      title: `Are you sure you want to delete ${itemToDelete.item_name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: "put",
          url: `${V_URL}/admin/delete-pr-item`,
          data: { id: data._id, itemId: itemToDelete._id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("VA_TOKEN")}`,
          },
        })
          .then((response) => {
            if (response.data.success) {
              const updatedItems = approvedItems.filter((_, index) => index !== rowIndex);
              setApprovedItems(updatedItems);
              localStorage.setItem("approvedItems", JSON.stringify(updatedItems));
              toast.success(`${itemToDelete.item_name} has been deleted.`);
            } else {
              toast.error(response.data.message);
            }
          })
          .catch(() => {
            toast.error("Something went wrong");
          });
      }
    });
  };

  const handleSubmit = () => {
    const invalidItems = approvedItems.filter((item) => item.approve_qty === 0);
    if (invalidItems.length > 0) {
      setError("Please update the approved quantity for all items before submitting.");
      return;
    }
    setError("");
    onSubmit(approvedItems);
    localStorage.removeItem("approvedItems");
  };

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-3">Items Details</h4>
            <div className="table-responsive">
              <table className="table border-0 mb-0 custom-table table-striped comman-table">
                <thead>
                  <tr>
                    {headers?.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {approvedItems?.length > 0 ? (
                    approvedItems?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>{rowIndex + 1}</td>
                        <td>{row.item_name}</td>
                        <td>{row.category_name}</td>
                        <td>{row.supplier_name}</td>
                        <td>{row.item_brand}</td>
                        <td>{row.unit}</td>
                        <td >{row.balance || 0}</td>
                        <td>{row.required_qty}</td>
                        <td>
                          <input className='form-control' type="number" style={{ width: '100px' }} value={row.approve_qty} onChange={(e) => handleApproveQtyChange(rowIndex, e.target.value)} />
                          {/* <input
                            type="number"
                            className="form-control"
                            value={row.approve_qty}
                            placeholder="0"
                            onFocus={(e) => {
                              if (e.target.value === "0") e.target.value = "";
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") e.target.value = "0";
                            }}
                            onChange={(e) => handleApproveQtyChange(rowIndex, e.target.value)}
                            style={{ width: "60px", textAlign: "center" }}
                          /> */}
                        </td>
                        <td>{row?.remarks}</td>
                        <td className="text-end">
                          {row?.approve_qty === 0 ? (
                            <button
                              className="action-icon mx-1"
                              onClick={() => handleDelete(rowIndex)}
                              style={{ border: "none", background: "transparent" }}
                            >
                              <Trash2 />
                            </button>
                          ) : (
                            <button
                              className="action-icon mx-1"
                              disabled
                              style={{
                                border: "none",
                                background: "transparent",
                                opacity: 0.5,
                                cursor: "not-allowed",
                              }}
                            >
                              <Trash2 />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="999">
                        <div className="no-table-data">No items found!</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="col-12 mt-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}
      <div className="col-12">
        <div className="doctor-submit text-end">
          <button
            type="button"
            className="btn btn-primary submit-form me-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveRequestItemTable;
