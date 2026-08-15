import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { getItem } from "../../../../Store/Store/Item/Item";
import { getAllInquiries } from "../../../../Store/PoTeam/Inquiry/Inquiry";
import { getAdminParty } from "../../../../Store/Store/Party/AdminParty";
import { getAllTerms } from "../../../../Store/PoTeam/TermsCondition/TermsConditionSlice";
import { V_URL } from "../../../../BaseUrl";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

const ManageOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state || {};

  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState({});
  const [disable, setDisable] = useState(false);

  // Header fields
  const [poHeader, setPoHeader] = useState({
    vendor: "",
    po_no: "",
    po_date: "",
    kind_atten: "",
    buyer: localStorage.getItem("PAY_USER_NAME") || "",
    ref_no: "",
    purchase_order: "",
    buyer_number: "",
  });

  // selected inquiry id
  const [selectedInquiryId, setSelectedInquiryId] = useState("");

  // items loaded from inquiry and then editable
  const [items, setItems] = useState([]);

  // dynamic terms
  const [terms, setTerms] = useState([""]);
  const [checkedTerms, setCheckedTerms] = useState([]); // selected terms checkboxes (IDs)
  const [poTerms, setPoTerms] = useState([]); // Unified editable terms

  // party/manufacturer options
  const PARTY_GROUP_ID = "67382c42ac082c2f1c658a9b";
  const SUPPLIER_GROUP_ID = "661e04db76379e2a0a76258e";
  const inquiryList = useSelector((s) => s.getInquiry?.list?.data || []);
  const parties = useSelector((s) => s.getAdminParty?.user?.data?.data || []);
  const allTerms = useSelector((s) => s.terms?.list?.data || []);
  const allItemsList = useSelector((s) => s.getItem?.user?.data || []);
  const loading = useSelector((s) => s.getProcurementRequest?.loading || false);

  const partyOptions = useMemo(() => {
    if (!parties) return [];
    return parties
      .filter((p) => String(p.partyGroup?._id) === String(PARTY_GROUP_ID))
      .map((p) => ({ label: p.name, value: p._id }));
  }, [parties]);

  const supplierOptions = useMemo(() => {
    if (!parties?.length) return [];

    return parties
      .filter(
        (p) =>
          p?.partyGroup &&
          String(p.partyGroup._id) === SUPPLIER_GROUP_ID &&
          p?.status === true,
      )
      .map((p) => ({
        label: p.name,
        value: p._id,
      }));
  }, [parties]);

  // initial load
  useEffect(() => {
    dispatch(
      getAllInquiries({ project: localStorage.getItem("U_PROJECT_ID") }),
    );
    dispatch(getAdminParty({ storeType: "", is_main: false }));
    dispatch(getAllTerms({ project: localStorage.getItem("U_PROJECT_ID") }));
    dispatch(getItem({ is_main: false }));
  }, [dispatch]);

  // populate edit data
  // useEffect(() => {
  //   if (editData?._id) {
  //     setIsEdit(true);
  //     setPoHeader({
  //       vendor_name: editData.vendor_name || "",
  //       vendor_address: editData.vendor_address || "",
  //       po_no: editData.po_no || "",
  //       po_date: editData.po_date ? editData.po_date.split("T")[0] : "",
  //       email: editData.email || "",
  //       kind_atten: editData.kind_atten || "",
  //       contact_no: editData.contact_no || "",
  //       buyer: editData.buyer || "",
  //       ref_no: editData.ref_no || "",
  //       purchase_order: editData.purchase_order || "",
  //       remarks: editData.remarks || "",
  //     });

  //     setItems(
  //       (editData.items || []).map((it) => ({
  //         inquiryId: it.inquiryId || "",
  //         item: it.item?._id || it.item,
  //         itemName: it.item?.name || it.itemName || "",
  //         material_Grade: it.material_Grade || it.item?.material_grade || "",
  //         uom: it.uom || it.item?.unit?.name || "",
  //         manufacture: Array.isArray(it.manufacture)
  //           ? it.manufacture.map(m => (typeof m === 'object' ? m._id : m))
  //           : it.manufacture
  //             ? [it.manufacture]
  //             : [],
  //         lockedManufacture: Array.isArray(it.manufacture)
  //           ? it.manufacture.map(m => (typeof m === 'object' ? m._id : m))
  //           : it.manufacture
  //             ? [it.manufacture]
  //             : [],
  //         qty: it.qty || 0,
  //         rates: it.rates || 0,
  //         cgst: it.cgst || 0,
  //         sgst: it.sgst || 0,
  //         igst: it.igst || 0,
  //         amount: it.amount || 0,
  //         remarks: it.remarks || "",
  //       }))
  //     );

  //     setCheckedTerms(editData.terms_and_conditions?.map((t) => t._id) || []);
  //     setOtherTerms(editData.otherTerms?.length ? editData.otherTerms : [""]);
  //   }
  // }, [editData]);

  useEffect(() => {
    if (editData?._id) {
      setIsEdit(true);

      setPoHeader({
        vendor: editData.vendor?._id || editData.vendor,
        po_no: editData.po_no || "",
        po_date: editData.po_date?.split("T")[0] || "",
        kind_atten: editData.kind_atten || "",
        buyer: editData.buyer || "",
        ref_no: editData.ref_no || "",
        purchase_order: editData.purchase_order || "",
        buyer_number: editData.buyer_number || "",
      });

      setItems(
        (editData.items || []).map((it) => {
          const locked = (it.manufacture || []).map((m) =>
            typeof m === "object" ? m._id : m,
          );

          return {
            inquiryId: it.inquiryId?._id || it.inquiryId,
            inquiryItem:
              it.inquiryItem?._id || it.inquiryItem || it.item?._id || it.item,
            inquiryItemName: it.inquiryItem?.name || it.item?.name || "",
            item: it.item?._id || it.item,
            itemName: it.item?.name || "",
            material_Grade: it.item?.material_grade || "",
            uom: it.item?.unit?.name || "",
            manufacture: locked,
            lockedManufacture: locked,
            qty: it.qty,
            rates: it.rates,
            cgst: it.cgst || 0,
            sgst: it.sgst || 0,
            igst: it.igst || 0,
            amount: it.amount,
            remarks: it.remarks || "",
            hide_flag: it.hide_flag || false,
            isReceived: it.isReceived || false,
          };
        }),
      );

      setCheckedTerms(
        editData.terms_and_conditions?.map((t) =>
          typeof t === "object" ? t._id : t,
        ) || [],
      );

      if (editData.terms?.length) {
        setPoTerms(
          editData.terms.map((t) => ({
            id: null, // We'll treat them all as editable strings for now
            text: t,
          })),
        );
      } else if (editData.otherTerms?.length) {
        setPoTerms(
          editData.otherTerms.map((t) => ({
            id: null,
            text: t,
          })),
        );
      } else {
        setPoTerms([]);
      }
    }
  }, [editData]);

  // populate terms from Redux
  useEffect(() => {
    if (allTerms.length) {
      setTerms(allTerms.map((t) => ({ label: t.description, value: t._id })));
    }
  }, [allTerms]);

  // handle inquiry selection
  const handleInquirySelect = (inqId) => {
    setSelectedInquiryId(inqId);

    if (!inqId) {
      setItems([]);
      return;
    }

    const inq = inquiryList.find((i) => i._id === inqId);
    if (!inq) return;

    const mappedItems = (inq.items || [])
      .filter((it) => Number(it.balance_to_order || 0) > 0)
      .map((it) => {
      const locked = (it.manufacture || []).map((m) => m._id);
      return {
        inquiryId: inq._id,
        inquiryItem: it.item?._id || it.item,
        inquiryItemName: it.item?.name || it.itemName || "",
        item: it.item?._id || it.item,
        itemName: it.item?.name || it.itemName || "",
        material_Grade: it.material_Grade || it.item?.material_grade || "",
        uom: it.item?.unit?.name || it.uom || "",
        manufacture: [...locked],
        lockedManufacture: [...locked],
        qty: it.balance_to_order || 0,
        rates: it.rates || 0,
        cgst: 9,
        sgst: 9,
        igst: "",
        amount: "",
        remarks: "",
        hide_flag: false,
        isReceived: false,
      };
    });

    setItems(mappedItems);

    // Auto-populate purchase order and terms from Inquiry
    setPoHeader((s) => ({
      ...s,
      purchase_order: inq.purchase_order || "",
    }));

    let initialTerms = [];
    let initialIds = [];

    if (inq.terms_and_conditions) {
      inq.terms_and_conditions.forEach((t) => {
        const id = typeof t === "object" ? t._id : t;
        const text = typeof t === "object" ? t.description : "Term";
        initialIds.push(id);
        initialTerms.push({ id, text });
      });
    }

    if (inq.otherTerms) {
      inq.otherTerms.forEach((t) => {
        initialTerms.push({ id: null, text: t });
      });
    }

    setPoTerms(initialTerms);
    setCheckedTerms(initialIds);
  };

  const handleMasterTermChange = (newIds) => {
    const addedIds = newIds.filter((id) => !checkedTerms.includes(id));
    const removedIds = checkedTerms.filter((id) => !newIds.includes(id));

    let updated = [...poTerms];

    // Add new ones
    addedIds.forEach((id) => {
      const termObj = allTerms.find((t) => t._id === id);
      if (termObj) {
        updated.push({ id, text: termObj.description });
      }
    });

    // Remove unselected ones
    updated = updated.filter(
      (item) => !item.id || !removedIds.includes(item.id),
    );

    setPoTerms(updated);
    setCheckedTerms(newIds);
  };

  const updateTermAt = (idx, val) => {
    setPoTerms((prev) => prev.map((t, i) => (i === idx ? { ...t, text: val } : t)));
  };

  const removeTermAt = (idx) => {
    const termToRemove = poTerms[idx];
    if (termToRemove.id) {
      setCheckedTerms((prev) => prev.filter((id) => id !== termToRemove.id));
    }
    setPoTerms((prev) => prev.filter((_, i) => i !== idx));
  };

  const addCustomTerm = () => {
    setPoTerms((prev) => [...prev, { id: null, text: "" }]);
  };

  const updateItemAt = (index, patch) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };

      // Auto-update details if item ID changed
      if (patch.item) {
        const foundItem = allItemsList.find(
          (i) => String(i._id) === String(patch.item),
        );
        if (foundItem) {
          copy[index].itemName = foundItem.name;
          copy[index].material_Grade = foundItem.material_grade;
          copy[index].uom = foundItem.unit?.name || foundItem.uom;
        }
      }

      const qtyVal = Number(copy[index].qty || 0);
      const ratesVal = Number(copy[index].rates || 0);
      copy[index].amount = qtyVal * ratesVal;

      return copy;
    });
  };

  const removeItem = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item from the PO?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setItems((prev) => prev.filter((_, i) => i !== index));
        toast.success("Item removed");
      }
    });
  };

  const totals = useMemo(() => {
    let totalQty = 0,
      totalBase = 0,
      totalCgst = 0,
      totalSgst = 0,
      totalIgst = 0,
      totalAmount = 0;

    items.forEach((it) => {
      const qty = Number(it.qty || 0);
      const base = Number(it.rates || 0) * qty;
      const cgstAmt = (Number(it.cgst || 0) / 100) * base;
      const sgstAmt = (Number(it.sgst || 0) / 100) * base;
      const igstAmt = (Number(it.igst || 0) / 100) * base;
      const rowTotal = base + cgstAmt + sgstAmt + igstAmt;

      totalQty += qty;
      totalBase += base;
      totalCgst += cgstAmt;
      totalSgst += sgstAmt;
      totalIgst += igstAmt;
      totalAmount += rowTotal;
    });

    return {
      totalQty,
      totalBase,
      totalCgst,
      totalSgst,
      totalIgst,
      totalAmount,
    };
  }, [items]);

  const validation = () => {
    let isValid = true;
    let err = {};
    if (!poHeader.vendor) {
      isValid = false;
      err.vendor = "Please select Supplier";
    }
    if (!poHeader.po_no?.trim()) {
      isValid = false;
      err.po_no = "Please enter PO No";
    }
    if (!poHeader.po_date?.trim()) {
      isValid = false;
      err.po_date = "Please select PO Date";
    }
    // if (!poHeader.vendor_name?.trim()) { isValid = false; err.vendor_name = "Please select Vendor"; }
    // if (!poHeader.vendor_address?.trim()) { isValid = false; err.vendor_address = "Please enter Vendor Address"; }
    // if (!poHeader.email?.trim()) { isValid = false; err.email = "Please enter Email"; }
    if (!poHeader.kind_atten?.trim()) {
      isValid = false;
      err.kind_atten = "Please enter Kind Atten";
    }
    // if (!poHeader.contact_no?.trim()) { isValid = false; err.contact_no = "Please enter Contact No"; }
    if (!poHeader.buyer?.trim()) {
      isValid = false;
      err.buyer = "Please enter Buyer";
    }
    if (!poHeader.purchase_order?.trim()) {
      isValid = false;
      err.purchase_order = "Please enter Purchase Order";
    }

    setError(err);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validation()) return;

    setDisable(true);

    const payloadItems = items.map((it) => ({
      inquiryId: it.inquiryId,
      inquiryItem: it.inquiryItem,
      item: it.item,
      qty: Number(it.qty || 0),
      rates: Number(it.rates || 0),
      cgst: Number(it.cgst || 0),
      sgst: Number(it.sgst || 0),
      igst: Number(it.igst || 0),
      amount: Number(it.amount || 0),
      manufacture: it.manufacture,
      remarks: it.remarks || "",
      hide_flag: it.hide_flag || false,
      isReceived: it.isReceived || false,
    }));

    const payload = {
      project: localStorage.getItem("U_PROJECT_ID"),
      // vendor_name: poHeader.vendor_name,
      // vendor_address: poHeader.vendor_address,
      vendor: poHeader.vendor,
      po_no: poHeader.po_no,
      po_date: poHeader.po_date,
      // email: poHeader.email,
      kind_atten: poHeader.kind_atten,
      // contact_no: poHeader.contact_no,
      buyer: poHeader.buyer,
      ref_no: poHeader.ref_no,
      purchase_order: poHeader.purchase_order,
      items: payloadItems,
      total_qty: totals.totalQty,
      total_amount: totals.totalAmount,
      total_cgst: totals.totalCgst,
      total_sgst: totals.totalSgst,
      total_igst: totals.totalIgst,
      terms_and_conditions: checkedTerms,
      terms: poTerms.map((t) => t.text),
      otherTerms: poTerms.filter((t) => !t.id).map((t) => t.text),
      buyer_number: poHeader.buyer_number,
      createdby: localStorage.getItem("PAY_USER_ID"),
    };

    if (isEdit) payload.id = editData._id;

    try {
      const res = await axios.post(
        `${V_URL}/user/order/manage-order`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        },
      );

      if (res.data?.success) {
        toast.success(res.data.message || "PO saved successfully");
        navigate("/material-po/order-management");
      } else {
        toast.error(res.data?.message || "Failed to save PO");
        setDisable(false);
      }
    } catch (err) {
      console.error("save PO error:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong while saving PO",
      );
      setDisable(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right" />
              </li>
              <li className="breadcrumb-item">
                <Link to="/material-po/order-management">Order Placement</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right" />
              </li>
              <li className="breadcrumb-item active">
                {isEdit ? "Edit PO" : "Create PO"}
              </li>
            </ul>
          </div>

          {/* Select Inquiry */}

          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                {!isEdit && (
                  <div className="col-md-4">
                    <label className="form-label">Select Inquiry No</label>
                    <Dropdown
                      value={selectedInquiryId}
                      options={inquiryList
                        .filter((i) => i.genratePO === false) // <-- only show where generatePo is false
                        .map((i) => ({
                          label: i.InquiryNo || i._id,
                          value: i._id,
                        }))}
                      onChange={(e) => handleInquirySelect(e.value)}
                      placeholder="Select Inquiry(s)"
                      className="w-100"
                      display="chip"
                      filter
                    />
                    <div className="error">{error.inquiryId}</div>
                  </div>
                )}
                <div className={`col-md-${isEdit ? 6 : 4}`}>
                  <label className="form-label">PO No</label>
                  <input
                    className="form-control"
                    value={poHeader.po_no}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, po_no: e.target.value }))
                    }
                    placeholder="Enter PO Number"
                    disabled={isEdit}
                  />
                  <div className="error">{error.po_no}</div>
                </div>

                <div className={`col-md-${isEdit ? 6 : 4}`}>
                  <label className="form-label">PO Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={poHeader.po_date}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, po_date: e.target.value }))
                    }
                    disabled={isEdit}
                  />
                  <div className="error">{error.po_date}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Vendor / Header fields */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="row gx-2">
                <div className="col-md-6 mt-2">
                  <label className="form-label">Supplier</label>
                  <Dropdown
                    value={poHeader.vendor}
                    options={supplierOptions}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, vendor: e.value }))
                    }
                    placeholder="Select Supplier"
                    className="w-100"
                    filter
                    disabled={isEdit}
                  />
                  <div className="error">{error.vendor}</div>
                </div>
                {/* <div className="col-md-6 mt-2">
                          
                          <label className="form-label">Vendor Name</label>
                          <input
                            className="form-control"
                            value={poHeader.vendor_name}
                            onChange={(e) => setPoHeader((s) => ({ ...s, vendor_name: e.target.value }))}
                          />
                          <div className="error">{error.vendor_name}</div>
                        </div> */}

                <div className="col-md-6  mt-2">
                  <label className="form-label">Buyer</label>
                  <input
                    className="form-control"
                    value={poHeader.buyer}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, buyer: e.target.value }))
                    }
                    readOnly
                  />
                  <div className="error">{error.buyer}</div>
                </div>

                {/* <div className="col-md-6  mt-2">
                          <label className="form-label">Vendor Address</label>
                          <input
                            className="form-control"
                            value={poHeader.vendor_address}
                            onChange={(e) => setPoHeader((s) => ({ ...s, vendor_address: e.target.value }))}
                            placeholder="Vendor Address"
                          />
                          <div className="error">{error.vendor_address}</div>
                        </div> */}

                {/* <div className="col-md-6  mt-2">
                          <label className="form-label">Email</label>
                          <input
                            className="form-control"
                            value={poHeader.email}
                            onChange={(e) => setPoHeader((s) => ({ ...s, email: e.target.value }))}
                          />
                          <div className="error">{error.email}</div>
                        </div> */}

                <div className="col-md-6  mt-2">
                  <label className="form-label">Kind Attn</label>
                  <input
                    className="form-control"
                    value={poHeader.kind_atten}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, kind_atten: e.target.value }))
                    }
                    disabled={isEdit}
                  />
                  <div className="error">{error.kind_atten}</div>
                </div>
                {/*         
                        <div className="col-md-6  mt-2">
                          <label className="form-label">Contact No</label>
                          <input
                            className="form-control"
                            value={poHeader.contact_no}
                            onChange={(e) => setPoHeader((s) => ({ ...s, contact_no: e.target.value }))}
                          />
                          <div className="error">{error.contact_no}</div>
                        </div> */}

                <div className="col-md-6  mt-2">
                  <label className="form-label">Reference</label>
                  <input
                    className="form-control"
                    value={poHeader.ref_no}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, ref_no: e.target.value }))
                    }
                    disabled={isEdit}
                  />
                  <div className="error">{error.ref_no}</div>
                </div>

                <div className="col-md-6 mt-2">
                  <label className="form-label">Purchase Order For </label>
                  <input
                    className="form-control"
                    value={poHeader.purchase_order}
                    onChange={(e) =>
                      setPoHeader((s) => ({
                        ...s,
                        purchase_order: e.target.value,
                      }))
                    }
                    disabled={isEdit}
                  />
                  <div className="error">{error.purchase_order}</div>
                </div>
                <div className="col-md-6 mt-2">
                  <label className="form-label">Buyer Contact Number</label>
                  <input
                    className="form-control"
                    value={poHeader.buyer_number}
                    onChange={(e) =>
                      setPoHeader((s) => ({ ...s, buyer_number: e.target.value }))
                    }
                    disabled={isEdit}
                  />
                  <div className="error">{error.buyer_number}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Items table */}
          {items.length > 0 && (
            <div className="card mb-3">
              <div className="card-body">
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered">
                    <thead style={{ background: "#f7f7f7" }}>
                      <tr>
                        <th>Sr No</th>
                        <th>Inquiry Item Description</th>
                        <th>PO Item Description</th>
                        <th>Material Grade</th>
                        <th>Make / Manufacturer</th>
                        <th>UOM</th>
                        <th style={{minWidth: "150px"}}>Qty</th>
                        <th style={{minWidth: "150px"}}>Rate</th>
                        <th style={{minWidth: "150px"}}>CGST %</th>
                        <th style={{minWidth: "150px"}}>SGST %</th>
                        <th style={{minWidth: "150px"}}>IGST %</th>
                        <th style={{minWidth: "150px"}}>Amount (base)</th>
                        <th style={{minWidth: "150px"}}>Tax Total</th>
                        <th style={{minWidth: "150px"}}>Total (incl. tax)</th>
                        <th>Remarks</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let visibleIdx = 0;
                        return items.map((it, idx) => {
                          if (it.hide_flag) return null;
                          visibleIdx++;

                          const base =
                            Number(it.qty || 0) * Number(it.rates || 0);
                          const cgstAmt = (Number(it.cgst || 0) / 100) * base;
                          const sgstAmt = (Number(it.sgst || 0) / 100) * base;
                          const igstAmt = (Number(it.igst || 0) / 100) * base;
                          const taxTotal = cgstAmt + sgstAmt + igstAmt;
                          const rowTotal = base + taxTotal;

                          return (
                            <tr key={idx}>
                              <td>{visibleIdx}</td>
                            <td style={{ minWidth: 250 }}>
                              {it.inquiryItemName || it.itemName || "N/A"}
                            </td>
                            <td style={{ minWidth: 250 }}>
                              <Dropdown
                                value={it.item}
                                options={allItemsList.map((i) => ({
                                  label: i.name,
                                  value: i._id,
                                }))}
                                onChange={(e) =>
                                  updateItemAt(idx, { item: e.value })
                                }
                                placeholder="Select Item"
                                filter
                                className="w-100"
                              
                              />
                            </td>
                            <td>{it.material_Grade}</td>

                            <td style={{ minWidth: 160 }}>
                              <MultiSelect
                                value={it.manufacture}
                                options={partyOptions}
                                display="chip"
                                placeholder="Select Manufacturer(s)"
                                className="w-100"
                                onChange={(e) => {
                                  const newValues = e.value || [];

                                  // 🔒 Always keep locked manufacturers
                                  const merged = Array.from(
                                    new Set([
                                      ...it.lockedManufacture,
                                      ...newValues,
                                    ]),
                                  );

                                  updateItemAt(idx, { manufacture: merged });
                                }}
                              />
                            </td>

                            <td>{it.uom}</td>

                            <td style={{ width: 100 }}>
                              <input
                                type="number"
                                className="form-control"
                                value={it.qty}
                                onChange={(e) =>
                                  updateItemAt(idx, {
                                    qty: Number(e.target.value),
                                  })
                                }
                                disabled={it.isReceived}
                              />
                            </td>

                            <td style={{ width: 120 }}>
                              <input
                                type="number"
                                className="form-control"
                                value={it.rates}
                                onChange={(e) =>
                                  updateItemAt(idx, {
                                    rates: Number(e.target.value),
                                  })
                                }
                                disabled={isEdit}
                              />
                            </td>

                            <td style={{ width: 100 }}>
                              <input
                                type="number"
                                className="form-control"
                                value={it.cgst}
                                onChange={(e) =>
                                  updateItemAt(idx, {
                                    cgst: Number(e.target.value),
                                  })
                                }
                                disabled={isEdit}
                              />
                            </td>

                            <td style={{ width: 100 }}>
                              <input
                                type="number"
                                className="form-control"
                                value={it.sgst}
                                onChange={(e) =>
                                  updateItemAt(idx, {
                                    sgst: Number(e.target.value),
                                  })
                                }
                                disabled={isEdit}
                              />
                            </td>

                            <td style={{ width: 100 }}>
                              <input
                                type="number"
                                className="form-control"
                                value={it.igst}
                                onChange={(e) =>
                                  updateItemAt(idx, {
                                    igst: Number(e.target.value),
                                  })
                                }
                                disabled={isEdit}
                              />
                            </td>

                            <td>{base.toFixed(2)}</td>
                            <td>{taxTotal.toFixed(2)}</td>
                            <td>{rowTotal.toFixed(2)}</td>

                            <td style={{ minWidth: 160 }}>
                              <input
                                className="form-control"
                                value={it.remarks}
                                onChange={(e) =>
                                  updateItemAt(idx, { remarks: e.target.value })
                                }
                              />
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="btn btn-link text-danger p-0"
                                onClick={() => removeItem(idx)}
                                title="Remove Item"
                                disabled={isEdit}
                              >
                                <Trash size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}

                      {/* totals row */}
                      <tr style={{ fontWeight: 700 }}>
                        <td colSpan={6} style={{ textAlign: "right" }}>
                          Total
                        </td>
                        <td>{totals.totalQty.toFixed(2)}</td>
                        <td>{totals.totalBase.toFixed(2)}</td>
                        <td>
                          {(
                            (totals.totalCgst / (totals.totalBase || 1)) *
                            100 || 0
                          ).toFixed(2)}
                          %
                        </td>
                        <td>
                          {(
                            (totals.totalSgst / (totals.totalBase || 1)) *
                            100 || 0
                          ).toFixed(2)}
                          %
                        </td>
                        <td>
                          {(
                            (totals.totalIgst / (totals.totalBase || 1)) *
                            100 || 0
                          ).toFixed(2)}
                          %
                        </td>
                        <td>{totals.totalBase.toFixed(2)}</td>
                        <td>
                          {(
                            totals.totalCgst +
                            totals.totalSgst +
                            totals.totalIgst
                          ).toFixed(2)}
                        </td>
                        <td>{totals.totalAmount.toFixed(2)}</td>
                        <td />
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>
                  <strong>Terms & Conditions</strong>
                </h5>
                <button className="btn btn-primary" onClick={addCustomTerm}>
                  + Add Custom Term
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">
                  Quick Add from Master List
                </label>
                <MultiSelect
                  value={checkedTerms}
                  options={terms}
                  onChange={(e) => handleMasterTermChange(e.value)}
                  placeholder="Select Terms to add..."
                  className="w-100"
                  display="chip"
                  filter
                  disabled={isEdit}
                />
              </div>

              <div className="editable-terms-list">
                {poTerms.map((ot, idx) => (
                  <div key={idx} className="d-flex gap-2 mb-2 align-items-start">
                    <span className="mt-2 text-muted" style={{ minWidth: "25px" }}>
                      {idx + 1}.
                    </span>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={ot.text}
                      placeholder={`Term description...`}
                      onChange={(e) => updateTermAt(idx, e.target.value)}
                        disabled={isEdit}
                    />
                    <button
                      className="btn btn-link text-danger mt-1 p-0"
                      onClick={() => removeTermAt(idx)}
                      title="Remove Term"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="card">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div>
                  <strong>Total Quantity:</strong> {totals.totalQty.toFixed(2)}
                </div>
                <div>
                  <strong>Net Amount:</strong> {totals.totalBase.toFixed(2)}
                </div>
                <div>
                  <strong>GST Total:</strong>{" "}
                  {(
                    totals.totalCgst +
                    totals.totalSgst +
                    totals.totalIgst
                  ).toFixed(2)}
                </div>
                <div>
                  <strong>Grand Total:</strong> {totals.totalAmount.toFixed(2)}
                </div>
              </div>
              <div>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {isEdit ? "Update PO" : "Save PO"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrder;
