// MaterialDetails.js
import React from "react";
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';

const MaterialDetails = ({ transactionItem, handleModalDelete, item, setEditMaterial }) => {


  const handleEditClick = (material) => {
    setEditMaterial({
      itemName: material.itemName,
      itemText: item.find(it => it._id === material.itemName)?.name || '',
      mcode: material.mcode,
      quantity: material.quantity,
      rate: material.rate,
      unit: item.find(it => it._id === material.itemName)?.unit?.name || '',
      amount: material.amount,
      remarks: material.remarks,
      balance_qty: material.balance_qty,
      gst_percentage: material.gst_percentage,
      net_amount: material.net_amount,
      with_po: material.with_po,
    });
  };

  return (
    <>
      <table className="table border-0 mb-0 custom-table table-striped comman-table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Name</th>
            <th>Unit</th>
            <th>MCode</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Net Amount</th>
            <th>Remarks</th>
            <th>With PO</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactionItem?.map((material, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.find(it => it?._id === material?.itemName)?.name}</td>
              <td>{item?.find(it => it?._id === material?.itemName)?.unit?.name}</td>
              <td>{material.mcode}</td>
              <td>{material.quantity}</td>
              <td>{material.rate}</td>
              <td>{material.net_amount}</td>
              <td>{!material?.remarks ? '-' : material?.remarks}</td>
              <td className='status-badge'>
                {material?.with_po === true ? (
                  <span className="custom-badge status-green">True</span>
                ) : (
                  <span className="custom-badge status-pink">False</span>
                )}
              </td>
              <td className="text-end d-flex justify-content-end">
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                {material?.balance_qty !== 0 ? (
                  <a
                    style={{ cursor: "pointer", padding: "6px" }}
                    className="action-icon"
                    onClick={() => handleEditClick(material)}
                  >
                    <Pencil />
                  </a>
                ) : null}

                <a
                  style={{ cursor: "pointer", padding: "6px" }}
                  className="action-icon mx-2"
                  onClick={() => handleModalDelete(material?._id, item?.find(it => it?._id === material?.itemName)?.name)}
                >
                  <Trash2 />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MaterialDetails;
