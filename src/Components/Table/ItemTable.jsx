import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const ItemsTable = ({ headers, data: initialData, showAddBtn, onAddItem, onDeleteItem, onEditItem, tagNumber, setReturnItemData }) => {
  const [qtyValues, setQtyValues] = useState([]);
  const [returnData, setReturnData] = useState([]);

  useEffect(() => {
    setReturnData(
      initialData?.map((row) => ({
        ...row,
        return_qty: row?.return_qty || "-",
        return_date: row?.return_date || "",
      }))
    );
    setQtyValues(initialData?.map((row) => row?.return_qty || "-"));
  }, [initialData]);

  const handleQtyChange = (index, value) => {
    if (value === "") {
      // Handle the case where the user clears the input
      const updatedQtyValues = [...qtyValues];
      updatedQtyValues[index] = "-"; // Set to "-" or any placeholder for empty
      const updatedData = [...returnData];
      updatedData[index] = { ...updatedData[index], return_qty: "-" };
      setQtyValues(updatedQtyValues);
      setReturnData(updatedData);
      setReturnItemData(updatedData);
      return;
    }

    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0) {
      toast.error("Return quantity cannot be negative!");
      return;
    }
    if (numericValue > returnData[index].quantity) {
      toast.error("Return quantity cannot be greater than total quantity!");
      return;
    }

    const updatedQtyValues = [...qtyValues];
    updatedQtyValues[index] = numericValue;

    const updatedData = [...returnData];
    updatedData[index] = { ...updatedData[index], return_qty: numericValue };

    setQtyValues(updatedQtyValues);
    setReturnData(updatedData);
    setReturnItemData(updatedData);
  };




  const headerKeys = Object.keys(headers);
  console.log(headerKeys);

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-body">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="form-heading">
                <h4 className="mb-0">Items Details</h4>
              </div>
              {tagNumber !== 14 && showAddBtn && (
                <div className="add-group">
                  <button onClick={onAddItem} className="btn btn-primary add-pluss ms-2">
                    <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                  </button>
                </div>
              )}
            </div>
            <div className="col-12 mt-3 table-responsive">
              <table className="table border-0 mb-0 custom-table table-striped comman-table">
                <thead>
                  <tr>
                    <th>Sr no.</th>
                    {headerKeys?.map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                    {tagNumber === 14 && (
                      <>
                        <th>Return Qty</th>
                      </>
                    )}
                    {tagNumber !== 14 && <th className="text-end">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {returnData?.length > 0 ? (
                    returnData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td>{rowIndex + 1}</td>
                        {headerKeys?.map((key, colIndex) => (
                          <td key={colIndex}>{row[headers[key]] || "-"}</td>
                        ))}
                        {tagNumber === 14 ? (
                          <>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={qtyValues[rowIndex]}
                                onChange={(e) => handleQtyChange(rowIndex, e.target.value)}
                                style={{
                                  width: "60px",
                                  textAlign: "center",
                                }}
                              />
                            </td>
                          </>
                        ) : (
                          <td className="justify-content-end d-flex">
                            <button
                              className="action-icon mx-1"
                              onClick={() => onEditItem(rowIndex)}
                            >
                              <Pencil />
                            </button>
                            <button
                              className="action-icon mx-1"
                              onClick={() => onDeleteItem(rowIndex, row?.item_name)}
                            >
                              <Trash2 />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="999">
                        <div className="no-table-data">Enter items!</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ItemsTable.propTypes = {
  headers: PropTypes.objectOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  showAddBtn: PropTypes.bool,
  onAddItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  tagNumber: PropTypes.number,
  setReturnItemData: PropTypes.func.isRequired,
};

ItemsTable.defaultProps = {
  showAddBtn: true,
};

export default ItemsTable;
