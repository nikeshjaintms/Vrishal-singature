import React, { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Pagination, Search } from '../../../Table';
import DropDown from '../../../../../Components/DropDown';
import { Dropdown } from 'primereact/dropdown';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getDptOffer } from '../../../../../Store/Piping/RootDpt/getDptOffer';
const DptOfferTable = ({ setSubmitArr, commentsData, setCommentsData , handleAddToIssueArr ,handleSaveClick, handleRemove}) => {
   const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    welder_no: '',
    remarks: '',
   
  });
  const [welders, setWelders] = useState([]);
  const [loadingWelders, setLoadingWelders] = useState(false);

  const entity = useSelector((state) => state?.user?.data);
 useEffect(() => {
    dispatch(getDptOffer());
}, [dispatch]);

const dptOffers = useSelector((state) => state.getDptOffer?.data);
console.log("commentsData",commentsData);
  // Fetch welders
  useEffect(() => {
    const fetchWelders = async () => {
      setLoadingWelders(true);
      try {
        const token = localStorage.getItem("PAY_USER_TOKEN");
        const response = await axios.post(
          `${V_URL}/user/get-all-welder`,
          { page: 1, limit: 100, project: localStorage.getItem("U_PROJECT_ID"), search: "" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setWelders(response.data.data.data || []);
          
        }
      } catch (err) {
        console.error("Error fetching welders:", err);
      } finally {
        setLoadingWelders(false);
      }
    };
    fetchWelders();
  }, []);

// const welderOptions = welders.map(w => ({
//   label: `${w.welderNo} (${w.name})`,
//   value: w._id   // 🔥 ObjectId
// }));


  // Set tableData based on entity
  useEffect(() => {
    const filterEntity = entity?.items?.filter((it) => !it?.ndt_offer_id);
    setTableData(filterEntity || []);
  }, [entity]);

  // Edit row functions
  const handleEditClick = (indexKey, joint) => {
    setEditRowIndex(indexKey);
    setEditFormData({
      welder_no: joint.welder_no || '',
      remarks: joint.remarks || '',
     
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTableData([]);
  };
console.log("commentsData in render",commentsData);
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card card-table show-entire">
          <div className="card-body">
            {/* Table Header */}
            <div className="page-table-header mb-2">
              <div className="row align-items-center">
                <div className="col">
                  <div className="doctor-table-blk">
                    <h3>Item List</h3>
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
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Refresh"
                        >
                          <img src="/assets/img/icons/re-fresh.svg" alt="refresh" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                  <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                </div> */}
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table className="table border-0 custom-table comman-table mb-0">
                <thead>
                  <tr>
                    <th>Sr.</th>
                    <th>Drawing No.</th>
                    <th>Rev</th>
                    <th>Spool No.</th>
                    <th>Joint No.</th>
                    <th>Size</th>
                    <th>Thickness</th>
                    <th>Joint Type</th>
                    <th>Welder No</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
  {commentsData?.length > 0 ? (
    (() => {
      let srNo = 1; 

      return commentsData.map((row, rowIndex) =>
        row.items.map((item, i) =>
          item.jointDetails.map((joint, j) => {
            const isEditing = editRowIndex === `${rowIndex}-${i}-${j}`;

            return (
              <tr
                key={`${rowIndex}-${i}-${j}`}
                onClick={() =>
                  handleEditClick(`${rowIndex}-${i}-${j}`, joint)
                }
              >
                {/* FIXED SR NO */}
                <td>{srNo++}</td>

                <td>{joint.drawing_no}</td>
                <td>{joint.rev || '-'}</td>
                <td>{joint.spool_no || '-'}</td>
                <td>{joint.joint_no || '-'}</td>
                <td>{joint.selected_size?.size_name || '-'}</td>
                <td>{joint.selected_thickness?.thickness || '-'}</td>
                <td>{joint.joint_type?.name || '-'}</td>

               

              <td>
  {isEditing ? (() => {
console.log("welders",welders);
const matchedWelders = welders
 .filter(w => w.status === true)
.filter((w) => {
  console.log("Comparing:");
  console.log("Welder _id:", w.wpsNo._id);
  console.log("Joint wps_id:", joint.wps_id);
  console.log(
    "Match:",
    String(w.wpsNo._id) === String(joint.wps_id)
  );
  console.log("-----------");

  const weldId = w?.wpsNo?._id || w?.wpsNo;
console.log("weldId",weldId);
  return String(weldId) === String(joint.wps_id);
});

console.log("matchedWelders", matchedWelders);

const welderOptions = matchedWelders.map(w => ({
  label: `${w.welderNo} (${w.name})`,
  value: w?._id
}));

console.log("welderOptions", welderOptions);


    return (
      <Dropdown
      onClick={(e) => e.stopPropagation()}
        options={welderOptions}
        value={editFormData.welder_no || ''}
        placeholder={
          welderOptions.length > 0
            ? 'Select Welder No'
            : 'No Welder for this WPS'
        }
        className="w-100"
        disabled={welderOptions.length === 0}
        onChange={(e) => {
  const selectedWelder = welders.find(w => w._id === e.value);
console.log("Selected Welder:", selectedWelder);
  setEditFormData(prev => ({
    ...prev,
    welder_no: e.value,
    weldorName: selectedWelder?.welderNo || '',
    welding_process: selectedWelder?.weldingProcess || selectedWelder?.wpsNo?.weldingProcess || ''
  }));
}}

      />
    );
  })() : (
    joint.welder_no || '-'
  )}
</td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="remarks"
                      placeholder="Remarks"
                      value={editFormData.remarks || ''}
                      onChange={handleEditFormChange}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    joint.remarks || '-'
                  )}
                </td>

                <td>
                  {isEditing && (
                    <>
                      {/* <button
                        type="button"
                        className="btn btn-success p-1 mx-1"
                        onClick={() =>
                          handleSaveClick(`${rowIndex}-${i}-${j}`)
                        }
                      >
                        <Save />
                      </button> */}

<button
  type="button"
  className="btn btn-success p-1 mx-1"
  onClick={() => handleSaveClick(rowIndex, i, j, editFormData, setEditRowIndex)} // Added setEditRowIndex
>
  <Save />
</button>

                      <button
                        type="button"
                        className="btn btn-secondary p-1 mx-1"
                         onClick={(e) => {
    e.stopPropagation(); // Prevent row click from firing
    handleCancelClick();
  }}
                      >
                        <X />
                      </button>

                     
                    </>
                  )}
                </td>
                <td>
                   <button
                        type="button"
                        className="btn btn-danger p-1 mx-1"
                        onClick={() => handleRemove(rowIndex, i, j)}
                      >
                        Remove
                      </button>
                </td>
              </tr>
            );
          })
        )
      );
    })()
  ) : (
    <tr>
      <td colSpan="12">
        <div className="no-table-data">No Data Found!</div>
      </td>
    </tr>
  )}
                </tbody>

              </table>
            </div>

            {/* Pagination Info */}
            {/* <div className="row align-center mt-3 mb-2">
              <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                <div className="dataTables_info" role="status" aria-live="polite">
                  Showing {Math.min(limit, totalItems)} from {totalItems} data
                </div>
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                <div className="dataTables_paginate paging_simple_numbers">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={limit}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DptOfferTable;
