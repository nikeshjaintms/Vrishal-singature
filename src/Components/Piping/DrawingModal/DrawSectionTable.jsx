import React, { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react';
import { PLAN, V_URL } from '../../../BaseUrl';
import DownloadFormat from '../../DownloadFormat/DownloadFormat';
// import UploadFile from '../../DownloadFormat/UploadFile';
import { useDispatch } from 'react-redux';
// import { getUserDrawTrasaction } from '../../Store/Store/TransactionItem/getDrawTransaction';

const DrawSectionTable = ({ transactionData, handleSave, handleDelete, handleEdit, finalId, dataId, fetchTransactionData,canEdit  }) => {
console.log("transactionData",transactionData);

    // const groupedData = transactionData?.reduce((acc, item) => {
    //     const gridNo = item?.grid_id?.grid_no || "Unknown";
    //     const gridQty = item?.grid_id?.grid_qty || 1;
    //     const key = `${gridNo}-${gridQty}`;

    //     if (!acc[key]) {
    //         acc[key] = { gridNo, gridQty, totalWeight: 0, totalArea: 0 };
    //     }
    //     acc[key].totalWeight += (parseFloat(item.assembly_weight) || 0) * gridQty;
    //     acc[key].totalArea += (parseFloat(item.assembly_surface_area) || 0) * gridQty;
    //     return acc;
    // }, {});

    return (
        <div className="card">
            <div className="card-body">
                <div className="col-12 d-flex justify-content-between align-items-center mb-4">
                    <div className="form-heading">
                        <h4>Material Wise Entry</h4>
                    </div>
                    {localStorage.getItem('ERP_ROLE') === PLAN && (finalId || dataId) && (
                        <>
                            <div className="add-group">
                                {/* <div>
                                    <UploadFile url={`${V_URL}/user/import-drawing-item`} importId={finalId || dataId} onUploadSuccess={fetchTransactionData} />
                                </div> */}
                                {canEdit && (
                                    <>
                                <div>
                                    <DownloadFormat url={`${V_URL}/user/drawing-item-import-sample-piping`} fileName={"Drawing-item"} />
                                </div>
                            
                                <button
                                    type="button"
                                    onClick={handleSave}
                                     disabled={!canEdit}
                                    className="btn btn-primary add-pluss ms-2"
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Add Material">
                                    <img src="/assets/img/icons/plus.svg" alt="add-icon" />
                                </button>
                                </>
                            )}
                            </div>
                        </>
                    )}
                </div>
                    {transactionData?.length > 0 ? (

                    <>
                        <div className="table-responsive">
                            <table className="table border-0 mb-0 custom-table table-striped comman-table">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Item</th>
                                        <th>Item Description</th>
                                        {/* <th>Spool No.</th> */}
                                        <th>Size 1(INCH)</th>
                                        {/* <th>Size 1 (MM)</th> */}
                                        <th>Thickness 1</th>
                                        <th>Size 2 (INCH)</th>
                                        {/* <th>Size 2 (MM)</th> */}
                                        <th>Thickness 2</th>
                                        <th>Material Grade</th>
                                        <th>UOM</th>
                                        <th>Qty</th>
                                        {localStorage.getItem('ERP_ROLE') === PLAN && <th className="text-end">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                {transactionData?.map((item, index) => (

                                        <tr key={index}>
                                            <td>{index + 1}</td>
    <td>{item.item?.item_name || '-'}</td>
    <td>{item.item?.item_description || '-'}</td>
    {/* <td>{item.spool_no || '-'}</td> */}
    <td>{item.item?.size1?.name || '-'}</td>
    {/* <td>{item.item?.size1?.size_mm|| '-'}</td> */}

<td>{item.item?.thickness1?.name || '-'}</td>
 <td>{item.item?.size2?.name || 'N/A'}</td>
 {/* <td>{item.item?.size2?.size_mm || 'N/A'}</td> */}

<td>{item.item?.thickness2?.name || 'N/A'}</td>
<td>{item.item?.material_grade || '-'}</td>
<td>{item.item?.uom?.name || '-'}</td>
{/* <td>{item.item?.size || '-'}</td>
<td>{item.item?.thickness || '-'}</td>
<td>{item.item?.material_grade || '-'}</td>
<td>{item.item?.uom || '-'}</td> */}
    <td>{item.qty || '-'}</td>
                                        
                                            {localStorage.getItem('ERP_ROLE') === PLAN &&
//                                                 <td className="d-flex justify-content-end">
//                                                     <a className='action-icon mx-1' style={{ cursor: "pointer" }}
//                                                         data-toggle="tooltip" data-placement="top" title="Edit"
//                                                         onClick={() => handleEdit(item)}
//                                                         >
//                                                         <Pencil />
//                                                     </a>
//                                                     {/* <a className='action-icon mx-1' style={{ cursor: "pointer" }}
//                                                         data-toggle="tooltip" data-placement="top" title="Delete"
//                                                         onClick={() => handleDelete(item._id, item.item?.item_name)}
//                                                         // onClick={() => handleDelete(item?._id, item.itemName?.name)}
//                                                         >
//                                                         <Trash2 />
//                                                     </a> */}

                                                

// <a 
//     className='action-icon mx-1' 
//     style={{ cursor: "pointer" }}
//     data-toggle="tooltip" 
//     data-placement="top" 
//     title="Delete"
//     // Pass ONLY item._id. 
//     // Note: The second argument is just for your UI logic (name), it doesn't go to the API usually.
//     onClick={() => handleDelete(item._id, item.item?.item_name)}
// >
//     <Trash2 />
// </a>

                                                    
//                                                 </td>
<td className="d-flex justify-content-end">
  {canEdit && (
    <>
      <a
        className='action-icon mx-1'
        style={{ cursor: "pointer" }}
        title="Edit"
        onClick={() => handleEdit(item)}
      >
        <Pencil />
      </a>

      <a
        className='action-icon mx-1'
        style={{ cursor: "pointer" }}
        title="Delete"
        onClick={() => handleDelete(item._id, item.item?.item_name)}
      >
        <Trash2 />
      </a>
    </>
  )}
</td>
                                            }
                                        </tr>
                                    ))}

                                    <tr>
                                        <td colSpan="9" className="text-end"><strong>Total</strong></td>
                                        <td><strong>{transactionData?.reduce((sum, item) => sum + (item.qty || 0), 0)}</strong></td>
                                        <td></td>
                                    </tr>
                                
                                </tbody>
                            </table>
                        </div>
                       
                    </>
                ) : <p>"No section details found. You can add new sections by clicking the 'plus (+)' button."</p>}
            </div>
        </div>
    )
}

export default DrawSectionTable