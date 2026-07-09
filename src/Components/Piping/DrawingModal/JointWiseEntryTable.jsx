import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { PLAN, V_URL } from '../../../BaseUrl';
import DownloadFormat from '../../DownloadFormat/DownloadFormat';

const JointWiseEntryTable = ({
  transactionData,
  handleSaveJoint,
  handleJointDelete,
  handleEditForJoint,
  finalId,
  dataId,
  fetchTransactionData,
  canEdit,
  status
}) => {
  console.log("joint transactionData", transactionData);

// const isSpoolCompleted = (spool) => {
//   if (spool.is_generate_fitUp_offer) return true;

//   const validJoints =
//     spool.material_items?.filter((item) => {
//       const jointNo = item.joint_no || "";

//       return !(
//         jointNo.toUpperCase().startsWith("FW") ||
//         jointNo.toUpperCase().startsWith("FJ")
//       );
//     }) || [];

//   if (!validJoints.length) return false;

//   return validJoints.every(
//     (item) => item.is_added_fitUp_table === true
//   );
// };

const isSpoolCompleted = (spool) => {
  if (spool.is_generate_fitUp_offer) return true;

  const validJoints =
    spool.material_items?.filter((item) => {
      const jointNo = item.joint_no || "";

      return !(
        jointNo.toUpperCase().startsWith("FW") ||
        jointNo.toUpperCase().startsWith("FJ")
      );
    }) || [];

  return validJoints.some(
    (item) => item.is_added_fitUp_table === true
  );
};

const allSpoolsCompleted =
  transactionData?.length > 0 &&
  transactionData.every((spool) => isSpoolCompleted(spool));
  return (
    <div className="card">
      <div className="card-body">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div className="form-heading">
            <h4>Joint Wise Entry</h4>
          </div>

          {/* {localStorage.getItem('ERP_ROLE') === PLAN && (finalId || dataId) && (
            <div className="add-group d-flex align-items-center">
              
              <DownloadFormat
                url={`${V_URL}/user/joint-items-drawing-item-import-sample-piping`}
                fileName="Joint-wise-items-import-Drawing-item"
              />
              <button
                type="button"
                onClick={handleSaveJoint}
                className="btn btn-primary add-pluss ms-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Add Joint"
              >
                <img src="/assets/img/icons/plus.svg" alt="add-icon" />
              </button>
            </div>
          )} */}
          {localStorage.getItem('ERP_ROLE') === PLAN &&
  (finalId || dataId) &&
  !(status === 2 && allSpoolsCompleted) && (
    <div className="add-group d-flex align-items-center">
      <DownloadFormat
        url={`${V_URL}/user/joint-items-drawing-item-import-sample-piping`}
        fileName="Joint-wise-items-import-Drawing-item"
      />
      <button
        type="button"
        onClick={handleSaveJoint}
        className="btn btn-primary add-pluss ms-2"
        data-toggle="tooltip"
        data-placement="top"
        title="Add Joint"
      >
        <img src="/assets/img/icons/plus.svg" alt="add-icon" />
      </button>
    </div>
)}
        </div>

        {transactionData?.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table border-0 mb-0 custom-table table-striped comman-table">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Spool No</th>
                    <th>Joint Type</th>
                    <th>Sheet No</th>
                    <th>Joint No</th>
                    <th>Item 1</th>
                    <th>Item 2</th>
                    <th>Size(Inch)</th>
                    <th>Thickness </th>
                    <th>Length</th>
                    <th>Area</th>
                    <th>Inch/Meter</th>
                    {localStorage.getItem('ERP_ROLE') === PLAN && (
                      <th className="text-end">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let sr = 1;
                    // return transactionData.flatMap((entry) =>
                    //   entry.material_items.map((mItem) => (
                    return transactionData.flatMap((entry) => {
  const spoolCompleted = isSpoolCompleted(entry);

  return entry.material_items.map((mItem) => (
    <tr key={mItem._id}>
      <td>{sr++}</td>
      <td>{entry.spool_no_id?.spool_no || '-'}</td>
      <td>{mItem.joint_type?.name || '-'}</td>
      <td>{mItem.sheet_no || '-'}</td>
      <td>{mItem.joint_no || '-'}</td>

      <td>{mItem.material_item_id?.[0]?.item?.item_name || '-'}</td>
      <td>{mItem.material_item_id?.[1]?.item?.item_name || '-'}</td>

      <td>{mItem?.selected_size?.name || '-'}</td>
      <td>{mItem?.selected_thickness?.name || '-'}</td>

      <td>{mItem.length || 0}</td>
      <td>{mItem.area || 0}</td>
      <td>{mItem.inch_meter || 0}</td>

      {localStorage.getItem('ERP_ROLE') === PLAN && (
        <td className="d-flex justify-content-end">
          {!(status === 2 && spoolCompleted) && (
            <>
              <a
                className="action-icon mx-1"
                style={{ cursor: 'pointer' }}
                title="Edit"
                onClick={() => handleEditForJoint(entry)}
              >
                <Pencil />
              </a>

              <a
                className="action-icon mx-1"
                style={{ cursor: 'pointer' }}
                title="Delete"
                onClick={() =>
                  handleJointDelete(
                    entry?._id,
                    mItem?._id,
                    `Joint ${mItem.joint_no}`
                  )
                }
              >
                <Trash2 />
              </a>
            </>
          )}
        </td>
      )}
    </tr>
  ));
});
                  })()}
                </tbody>

              </table>
            </div>
            <div className="mt-4">
              <table className="table border-0 custom-table">
                <thead>
                  <tr>
                    <th>Spool No.</th>
                    <th>Length</th>
                    <th>Area</th>
                    <th>Inch / Meter</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData
                    .filter((data) => data.material_items && data.material_items.length > 0) // filter out empty material_items
                    .map((data, index) => (
                      <tr key={index}>
                        <td>{data.spool_no_id?.spool_no || "-"}</td>
                        <td>{data.spool_wise_sum_length}</td>
                        <td>{data.spool_wise_sum_area}</td>
                        <td>{data.spool_wise_sum_inch_meter}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </>
        ) : (
          <p>
            No joint details found. You can add new joints by clicking the “+”
            button.
          </p>
        )}
      </div>
    </div>
  );
};

export default JointWiseEntryTable;
