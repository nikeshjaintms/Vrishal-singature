import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Footer from "../Include/Footer";
import { getDataForSpoolBreakUp } from "../../../Store/Piping/SpoolBreakUp/getDataForSpoolBreakUp";
import axios from "axios";
import toast from "react-hot-toast";
import { V_URL } from "../../../BaseUrl";

const ManageSpoolBreakUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;

  const [packingList, setPackingList] = useState("");
  const [packingItems, setPackingItems] = useState([]);

  const [rows, setRows] = useState([
    {
      drawing_id:"",
      spool_id: "",
      material_item_id: "",
      drawing_no: "",
      spool_no: "",
      material_items: [],
      item_id: "",
      item_name: "",
      item_description: "",
      material_grade: "",
      piping_material_specification: "",
      size1: "",
      thickness1: "",
      size2: "",
      thickness2: "",
      uom: "",
      qty: "",
      remarks: ""
    }
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    dispatch(getDataForSpoolBreakUp({ page: 1, limit: 100, search: "" }));
  }, [dispatch]);

  const entity = useSelector(
    (state) => state?.getDataForSpoolBreakUp?.user?.data?.data
  );

  const commentsData = useMemo(() => entity || [], [entity]);

  /* ---------------- PACKING CHANGE ---------------- */

const handlePackingChange = (e) => {
  const id = e.target.value;
  setPackingList(id);

  const selectedPacking = commentsData.find((it) => it._id === id);
  const items = selectedPacking?.items || [];

  setPackingItems(items);

  const autoRows = [];

  items.forEach((spool) => {
    autoRows.push({
      // spool_id: spool._id,
       packing_item_id: spool._id,     // ✅ correct
  spool_id: spool.spool_id, 
      spool_no: spool.spool_no,
      drawing_id: spool.drawing_id,
      drawing_no: spool.drawing_no,
      piping_material_specification: spool.piping_material_specification,
      material_items: spool.material_items_details,

      material_item_id: "",
      item_id: "",
      item_name: "",
      item_description: "",
      material_grade: "",
      size1: "",
      thickness1: "",
      size2: "",
      thickness2: "",
      uom: "",
      qty: "",
      remarks: "",

      isInitial: true // <-- mark as initial
    });
  });

  setRows(autoRows);
};

  /* ---------------- ADD / DELETE ROW ---------------- */

const handleAddRow = (index) => {
  const currentRow = rows[index];

  const newRow = {
    ...currentRow,
    material_item_id: "",
    item_id: "",
    item_name: "",
    item_description: "",
    material_grade: "",
    size1: "",
    thickness1: "",
    size2: "",
    thickness2: "",
    uom: "",
    qty: "",
    remarks: "",
    isInitial: false // <-- manual row
  };

  const updated = [...rows];
  updated.splice(index + 1, 0, newRow);

  setRows(updated);
};

  const handleDeleteRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };



  /* ---------------- ITEM CHANGE ---------------- */

  const handleMaterialItemChange = (index, itemId) => {
    const row = rows[index];

    const selectedItem = row.material_items.find(
      (it) => it._id === itemId
    );

    const updated = [...rows];

    updated[index] = {
      ...row,
      material_item_id: itemId,
       item_id: selectedItem?.item?._id || "", 
      item_name: selectedItem?.item?.item_name || "",
      item_description: selectedItem?.item?.item_description || "",
      material_grade: selectedItem?.item?.material_grade || "",
      size1: selectedItem?.item?.size1?.name || "",
      thickness1: selectedItem?.item?.thickness1?.name || "",
       size2: selectedItem?.item?.size2?.name || "",
      thickness2: selectedItem?.item?.thickness2?.name || "",
      uom: selectedItem?.item?.uom?.name || ""
    };

    setRows(updated);
  };

  /* ---------------- QTY ---------------- */

  const handleQtyChange = (index, value) => {
    const updated = [...rows];
    updated[index].qty = value;
    setRows(updated);
  };

  const handleRemarksChange = (index, value) => {
    const updated = [...rows];
    updated[index].remarks = value;
    setRows(updated);
  };

  /* ---------------- SUBMIT ---------------- */

  // const handleSubmit = async () => {
  //   try {
  //     if (!packingList) return toast.error("Select Packing List");

  //     const items = rows
  // .filter((r) => r.material_item_id && r.qty)
  // .map((r) => ({
  //   packing_item_id: r.spool_id,
  //   item_id: r.item_id,
  //   qty: Number(r.qty),
  //   remarks: r.remarks
  // }));

  //     if (!items.length) return toast.error("Add valid rows");

  //     const payload = {
  //       project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
  //       project_id: localStorage.getItem("U_PROJECT_ID"),
  //       packing_id: packingList,
  //       items
  //     };

  //     await axios.post(`${V_URL}/user/piping/manage-spool-break-up`, payload);

  //     toast.success("Saved Successfully");

  //     navigate("/piping/user/spool-break-up-summary-list");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Error");
  //   }
  // };

  /* ---------------- SUBMIT ---------------- */
const handleSubmit = async () => {
  try {
    if (!packingList) return toast.error("Select Packing List");

    // Group rows by spool
    // const spools = {};
    // rows.forEach((row) => {
    //   if (!spools[row.spool_id]) spools[row.spool_id] = [];
    //   spools[row.spool_id].push(row);
    // });
const spools = {};
rows.forEach((row) => {
  if (!spools[row.packing_item_id]) spools[row.packing_item_id] = [];
  spools[row.packing_item_id].push(row);
});
    // Check if all material_items for each spool are selected
  for (const spool of packingItems) {
  const selectedRows = spools[spool._id] || []; // ✅ now matches packing_item_id

  if (selectedRows.length !== spool.material_items_details.length) {
    return toast.error(
      `Please select all items for Spool ${spool.spool_no}`
    );
  }

  if (selectedRows.some((r) => !r.qty || r.qty <= 0)) {
    return toast.error(
      `Enter quantity for all items in Spool ${spool.spool_no}`
    );
  }
}

    // Prepare payload
    const items = rows.map((r) => ({
        packing_item_id: r.packing_item_id, // ✅ correct
        drawing_id:r.drawing_id,
  spool_no_id: r.spool_id,   
      item_id: r.item_id,
      qty: Number(r.qty),
      remarks: r.remarks
    }));

    const payload = {
      project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
      project_id: localStorage.getItem("U_PROJECT_ID"),
      packing_id: packingList,
      items
    };

    await axios.post(`${V_URL}/user/piping/manage-spool-break-up`, payload);

    toast.success("Saved Successfully");
    navigate("/piping/user/spool-break-up-summary-list");
  } catch (err) {
    console.error(err);
    toast.error("Error");
  }
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
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/spool-break-up-summary-list">Spool Breakup List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? "Edit" : "Add"} Spool Breakup</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">

              {/* PACKING LIST */}
              <div className="mb-3 col-md-4">
                <label>Packing List</label>
                <select
                  className="form-select"
                  value={packingList}
                  onChange={handlePackingChange}
                >
                  <option value="">Select</option>
                  {commentsData.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.voucher_no}
                    </option>
                  ))}
                </select>
              </div>

              {packingList && (
                <>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Sr no.</th>
                        <th>Drawing No</th>
                        <th>Spool No</th>
                        <th>Item</th>
                        <th>Item Description</th>
                        <th>Material Grade</th>
                        <th>Size 1</th>
                        <th>Thickness 1</th>
                        <th>Size 2</th>
                        <th>Thickness 2</th>
                        <th>UOM</th>
                        <th>Qty</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>

                          {/* SPOOL */}
                          <td>{row.drawing_no}</td>
                         <td>{row.spool_no}</td>


                          {/* ITEM */}
                          <td>
                           <select
  className="form-select"
  value={row.material_item_id}
  onChange={(e) => handleMaterialItemChange(i, e.target.value)}
>
  <option value="">Select</option>
  {row.material_items
.filter(
  (m) =>
    !rows.some(
      (r, idx) =>
        idx !== i &&
        r.spool_id === row.spool_id &&
        r.material_item_id === m._id
    )
)
    .map((m) => (
      <option key={m._id} value={m._id}>
        {m.item?.item_name}
      </option>
    ))}
</select>
                          </td>

                          <td>{row.item_description}</td>
                          <td>{row.material_grade}</td>
                          <td>{row.size1}</td>
                          <td>{row.thickness1}</td>
                          <td>{row.size2}</td>
                          <td>{row.thickness2}</td>
                          <td>{row.uom}</td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={row.qty}
                              onChange={(e) =>
                                handleQtyChange(i, e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <input
                              className="form-control"
                              value={row.remarks}
                              onChange={(e) =>
                                handleRemarksChange(i, e.target.value)
                              }
                            />
                          </td>

                  <td className="d-flex align-items-center gap-2">
  {/* Show plus button only on last row of same spool */}
  {!rows.some((r, idx) => idx > i && r.spool_id === row.spool_id) && (
    <button
      className="btn btn-success btn-sm"
      onClick={() => handleAddRow(i)}
      type="button"
    >
      +
    </button>
  )}

  {/* Delete button only if not initial */}
  {!row.isInitial && (
    <button
      className="btn btn-danger btn-sm"
      onClick={() => handleDeleteRow(i)}
      type="button"
    >
      -
    </button>
  )}
</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ManageSpoolBreakUp;