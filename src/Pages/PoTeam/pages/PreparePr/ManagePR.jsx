import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { V_URL } from "../../../../BaseUrl";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { getAllMaterialMto } from "../../../../Store/PoTeam/MaterialMTO/MaterialMto";
import { getProcurementRequestById, getAllProcurementRequests } from "../../../../Store/PoTeam/ProcurementRequest/ProcurementRequest";
import { Dropdown } from "primereact/dropdown";
import { getAdminParty } from "../../../../Store/Store/Party/AdminParty";

import { MultiSelect } from "primereact/multiselect";

const ManagePR = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state || {}; // ensure it's an object

  const [isEdit, setIsEdit] = useState(false);
  const [prData, setPrData] = useState({ prDate: "", remarks: "",
  approvedmake: [], // <-- changed from "" to []
  mtc: "",
  delivery_location: "" });
  const [mtoItems, setMtoItems] = useState([]);
  const [selectedPos, setSelectedPos] = useState([]); // array of selected PO IDs
  const [otherNotes, setOtherNotes] = useState([{ id: 1, value: "" }]);
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const [partyOptions, setPartyOptions] = useState([]);
  const [areaBuildings, setAreaBuildings] = useState([]); // array of unique areaBuilding names

  

  const PARTY_GROUP_ID = "67382c42ac082c2f1c658a9b"; // your party group id

  // ✅ Correct selectors based on store configuration
  const mtoList = useSelector((state) => state.materialMto?.list?.data || []);
  const prDetails = useSelector((state) => state.getProcurementRequest?.single || {});
  const loading = useSelector((state) => state.getProcurementRequest?.loading || false);
  const parties = useSelector((state) => state.getAdminParty?.user?.data.data || []);


  // Fetch all PRs (optional)
  useEffect(() => {
    dispatch(getAllProcurementRequests({}));
    dispatch(getAdminParty({ storeType: "", is_main: false }));
    
  }, [dispatch]);


  useEffect(() => {
    if (parties && parties.length > 0) {
      const filtered = parties
        .filter(
          (p) =>
            String(p.partyGroup?._id) === String(PARTY_GROUP_ID)
        )
        .map((p) => ({
          label: p.name,
          value: p._id,
        }));
  
      console.log("Filtered partyOptions:", filtered);
      setPartyOptions(filtered);
    }
  }, [parties]);
  

  // Load data on mount
  useEffect(() => {
    if (editData?._id) {
      setIsEdit(true);
      dispatch(getProcurementRequestById({ id: editData._id }));
    } else {
      dispatch(
        getAllMaterialMto({
          status: 1,
          project: localStorage.getItem("U_PROJECT_ID"),
        })
      );
    }
  }, [dispatch, editData?._id]);
  

  // Populate form when PR details are loaded
  useEffect(() => {
    console.log('Form population effect - isEdit:', isEdit, 'prDetails:', prDetails);
    
    if (isEdit && prDetails && Object.keys(prDetails).length > 0) {
      
      const newPrData = {
        prDate: prDetails.date ? prDetails.date.split("T")[0] : "",
        remarks: prDetails.remarks || prDetails.remark || prDetails.comments || "",
        note: prDetails.note || "",
        approvedmake: prDetails.approvedmake || "",
        mtc: prDetails.mtc || "",
        delivery_location: prDetails.delivery_location || "",
      };
      setOtherNotes(
        (prDetails.other_note || []).map((on, index) => ({ id: index + 1, value: on }))
      )
      
      console.log('Setting prData to:', newPrData);
      setPrData(newPrData);

      const mappedItems = (prDetails.items || []).map((it) => ({
        ...it,
        item: it.item?._id || it.item,
        itemName: it.item?.name || it.itemName || "",
        sectionLengthOrDimensions: it.sectionLengthOrDimensions || "",
        deliveryDaysRequirement: it.deliveryDaysRequirement || "",
        remarks: it.remarks || "",
      }));
      
      console.log('Mapped items:', mappedItems);
      setMtoItems(mappedItems);
    } else if (isEdit && editData && Object.keys(editData).length > 0) {
      // Fallback: Use editData if prDetails is not available
      console.log('Using editData as fallback:', editData);
      const newPrData = {
        prDate: editData.date ? editData.date.split("T")[0] : "",
        remarks: editData.remarks || editData.remark || editData.comments || "",
        note: editData.note || "",
        approvedmake: editData.approvedmake || "",
        mtc: editData.mtc || "",
        delivery_location: editData.delivery_location || "",
      };
      
      console.log('Setting prData from editData to:', newPrData);
      setPrData(newPrData);

      const mappedItems = (editData.items || []).map((it) => ({
        ...it,
        item: it.item?._id || it.item,
        itemName: it.item?.name || it.itemName || "",
        remarks: it.remarks || "",
        sectionLengthOrDimensions: it.sectionLengthOrDimensions || "",
        deliveryDaysRequirement: it.deliveryDaysRequirement || "",
      }));
      
      console.log('Mapped items from editData:', mappedItems);
      setMtoItems(mappedItems);
    }
  }, [isEdit, prDetails, editData]);

  // Debug logging
  

  // PO dropdown options - filter out MTOs with no available items
  const poOptions = mtoList
    .filter((mto) => {
      // Check if MTO has any items with balanceQty > 0
      return mto.items && mto.items.some((item) => Number(item.balanceQty) > 0);
    })
    .map((mto) => ({
      label: mto.poNumber,
      value: mto._id,
    }));

  // Handle PO selection
const handlePoSelect = (e) => {
  const selectedIds = e.value; // array of selected PO IDs
  setSelectedPos(selectedIds);

  // Combine items from all selected POs
  let combinedItems = [];
  let areasSet = new Set(); // use Set to avoid duplicates
  selectedIds.forEach((id) => {
    const selectedMto = mtoList.find((mto) => mto._id === id);
    
    if (selectedMto?.items) {
        // Collect areaBuilding values
      if (selectedMto.areaBuilding?.area) {
        areasSet.add(selectedMto.areaBuilding.area);
      }
      const filteredItems = selectedMto.items
        .filter((item) => Number(item.balanceQty) > 0)
        .map((item) => ({
          mto: selectedMto._id,
          poNumber: selectedMto.poNumber,
          item: item.item?._id || "",
          itemName: item.item?.name || "",
          material_grade: item.item?.material_grade || "",
          unit: item.item?.unit.name || "",
          prQty: Number(item.balanceQty) || 0,
          sectionLengthOrDimensions: "",
          deliveryDaysRequirement: "",
          remarks: item.remarks || "",
        }));
      combinedItems = [...combinedItems, ...filteredItems];
    }
  });

  setMtoItems(combinedItems);
  setAreaBuildings([...areasSet]); // convert Set to array
};

const totalQty = mtoItems.reduce((sum, it) => sum + Number(it.prQty || 0), 0);


const validation = () => {
  let isValid = true;
  let err = {};

  if (!isEdit && selectedPos.length === 0) {
    isValid = false;
    err['selectedPos'] = "Please select at least one PO number!";
  }

  if (!prData.approvedmake || prData.approvedmake.length === 0) {
    isValid = false;
    err['approvedmake'] = "Please select at least one approved make!";
  }

  if(prData.mtc.trim() === "" || prData.mtc === ""){
    isValid = false;
    err['mtc'] = "Please enter MTC!";
  }

  if(prData.delivery_location.trim() === "" || prData.delivery_location === ""){
    isValid = false;
    err['delivery_location'] = "Please enter delivery location!";
  }

    setError(err);
    return isValid;  
}

  // Submit handler
  const handleSubmit = async () => {
    // if (!prData.prDate) return toast.error("Please select PR date!");
    // if (!isEdit && !selectedPos) return toast.error("Please select a PO number!");
    // if (mtoItems.length === 0) return toast.error("No items to submit!");

    if(!validation()){
      setDisable(false);
      return;
    };

    try {
      const payload = {
        project: localStorage.getItem("U_PROJECT_ID"),
        id: isEdit ? prDetails._id : undefined,
        prNo: isEdit ? prDetails?.prNo : undefined,
        revNo: isEdit ? prDetails?.revNo : 0,
        date: prData.prDate,
        items: mtoItems.map(({ itemName, ...rest }) => rest),
        totalQty,
        remarks: prData.remarks,
        preparedBy: localStorage.getItem("PAY_USER_ID"),
        approvedmake: prData.approvedmake,
        mtc: prData.mtc,
        delivery_location: prData.delivery_location,
        other_note: otherNotes.map(on => on.value).filter(val => val.trim() !== ""),
      };

      const response = await axios.post(
        `${V_URL}/user/pr/manage-procurement-request`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || (isEdit ? "PR updated successfully!" : "PR saved successfully!")
        );
        navigate("/material-po/pr-management");
      } else {
        toast.error(response.data.message || "Failed to save PR");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving PR");
    }
  };

  if (loading) return <p>Loading PR data...</p>; // optional loader

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
              <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
              <li className="breadcrumb-item"><Link to="/material-po/pr-management">Procurement Request</Link></li>
              <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
              <li className="breadcrumb-item active">
                {isEdit ? "Edit Procurement Request" : "Manage Procurement Request"}
              </li>
            </ul>
          </div>

          {/* PR Form */}
          <div className="card">
            <div className="card-body">
              <div className="row">
                {isEdit && (
                  <div className="col-md-6">
                    <label className="form-label">PR No</label>
                    <input className="form-control" disabled type="text" value={prDetails?.prNo || ""} readOnly />
                  </div>
                )}


                {!isEdit && (
                  <>
                  <div className="col-md-6">
                    <label className="form-label">Select MTO Numbers</label>
                    <MultiSelect
                      value={selectedPos}
                      options={poOptions} // array of PO numbers or objects
                      onChange={handlePoSelect}
                      optionLabel="label" // if options are objects with {label, value}
                      placeholder="Select MTO Numbers"
                      display="chip" // shows selected items as chips
                      className="w-100"
                      filter
                    />
                    <div className="error">{error.selectedPos}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">AREA</label>
                    <input
                        className="form-control"
                        type="text"
                        value={areaBuildings.join(", ")} // comma-separated areas
                        readOnly
                    />                  
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Items Table */}
          {mtoItems.length > 0 && (
            <div className="card mt-2">
              <div className="card-body">
                <h5>Items</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Item</th>
                      <th>Material Grade</th>
                      <th>Unit</th>
                      <th>PR Qty</th>
                      <th>Section Length / Plate Dimensions To Be Specified By Supplier</th>
                      <th>Delivery Days Requirement</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mtoItems.map((it, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{it.itemName}</td>
                        <td>{it.material_grade}</td>
                        <td>{it.unit}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={it.prQty}
                            onChange={(e) => {
                              const updated = [...mtoItems];
                              updated[idx].prQty = Number(e.target.value);
                              setMtoItems(updated);
                            }}
                          />
                        </td>
                        <td>
                          <input
                          type="text"
                          className="form-control"
                          value={it.sectionLengthOrDimensions}
                          onChange={(e) => {
                            const updated = [...mtoItems];
                            updated[idx].sectionLengthOrDimensions = e.target.value;
                            setMtoItems(updated);
                          }}
                          />
                        </td>
                        <td>
                          <input
                          type="text"
                          className="form-control"
                          value={it.deliveryDaysRequirement}
                          onChange={(e) => {
                            const updated = [...mtoItems];
                            updated[idx].deliveryDaysRequirement = e.target.value;
                            setMtoItems(updated);
                          }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={it.remarks}
                            onChange={(e) => {
                              const updated = [...mtoItems];
                              updated[idx].remarks = e.target.value;
                              setMtoItems(updated);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card mt-4">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <h4>Procurement Request Note</h4>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setOtherNotes([...otherNotes, { id: otherNotes.length + 1, value: "" }])
                    }
                  >
                    <img src="/assets/img/icons/plus.svg" alt="add" />
                  </button>
                </div>

                <div className="row">
                   <div className="col-md-6 mb-3">
                    <label>Approved Make</label>
                    <MultiSelect
                      value={prData.approvedmake}
                      options={partyOptions} // partyOptions from your filtered parties
                      onChange={(e) => setPrData({ ...prData, approvedmake: e.value })}
                      optionLabel="label" // shows the party name
                      placeholder="Select Approved Make(s)"
                      display="chip" // selected items appear as chips
                      className="w-100"
                      filter
                    />
                    <div className="error">{error.approvedmake}</div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>MTC</label>
                    <input
                      type="text"
                      className="form-control"
                      value={prData.mtc}
                      onChange={(e) =>
                        setPrData({ ...prData, mtc: e.target.value })
                      }
                    />
                    <div className="error">{error.mtc}</div>
                  </div>

                  <div className="col-md-12 mb-3">
                    <label>Delivery Location</label>
                    {/* <input
                      type="text"
                      className="form-control"
                      value={prData.delivery_location}
                      onChange={(e) =>
                        setPrData({ ...prData, delivery_location: e.target.value })
                      }
                    /> */}
                    <textarea
                      className="form-control"
                      rows="4"
                      value={prData.delivery_location}
                      placeholder="Enter delivery location..."
                      onChange={(e) =>
                        setPrData({ ...prData, delivery_location: e.target.value })
                      }
                    />

                    <div className="error">{error.delivery_location}</div>
                  </div>

                  {otherNotes.map((note) => (
                    <div
                      key={note.id}
                      className="col-md-12 d-flex align-items-center mb-3"
                    >
                      <div className="flex-grow-1">
                        <label>Other Notes</label>
                        <input
                          type="text"
                          className="form-control"
                          value={note.value}
                          onChange={(e) => {
                            setOtherNotes(
                              otherNotes.map((n) =>
                                n.id === note.id ? { ...n, value: e.target.value } : n
                              )
                            );
                          }}
                          placeholder="Enter other note"
                        />
                      </div>

                      <button
                        className="btn btn-outline-danger ms-2"
                        style={{ marginTop: "25px" }}
                        onClick={() =>
                          setOtherNotes(otherNotes.filter((n) => n.id !== note.id))
                        }
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* Save Button */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="col-md-12">
                <label>Remarks</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={prData.remarks}
                  onChange={(e) => setPrData({ ...prData, remarks: e.target.value })}
                />
              </div>
            </div>
            <div className="row ms-2 me-2 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Total PR Quantity: {totalQty} KG</strong>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={disable}>
                  {isEdit ? "Update PR" : "Save PR"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePR;
