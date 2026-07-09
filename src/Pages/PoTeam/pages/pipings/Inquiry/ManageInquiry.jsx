import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { getAllProcurementRequests } from "../../../../../Store/PoTeam/piping/ProcurementRequest/PipingProcurementRequestSlice";
import { getAllInquiriesPiping } from "../../../../../Store/PoTeam/piping/Inquiry/Inquiry";
import { V_URL } from "../../../../../BaseUrl";
import { getAllTermsPiping } from "../../../../../Store/PoTeam/TermsCondition/TermsConditionSlicePiping";
import PO_ROUTE_URLS from "../../../../../Routes/PoTeam/PoRoutes";

const PipingManageInquiry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state || {};

  const [isEdit, setIsEdit] = useState(false);
  const [inquiryData, setInquiryData] = useState({ remarks: "", revno: 0, inquiryDate: "", purchase_order: "" });
  const [terms_conditions, setTermsConditions] = useState([{ id: 1, value: "" }]);
  const [selectedPo, setSelectedPo] = useState(null);
  const [inquiryItems, setInquiryItems] = useState([]);
  const [error, setError] = useState({});

  // Redux selectors
  const prList = useSelector((state) => state.getPipingProcurementRequest?.list?.data || []);
  const inquiryList = useSelector((state) => state.getInquiry?.list?.data || []);
  const allTerms = useSelector((state) => state.termsPiping?.list?.data || []);
  const loading = useSelector((state) => state.getPipingProcurementRequest?.loading || false);

  // Predefined terms options and selected terms
  const [termsOptions, setTermsOptions] = useState([]);
  const [checkedTerms, setCheckedTerms] = useState([]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getAllInquiriesPiping({ project: localStorage.getItem("U_PROJECT_ID") }));
    dispatch(getAllProcurementRequests({ status: true }));
    dispatch(getAllTermsPiping({ project: localStorage.getItem("U_PROJECT_ID") }));
  }, [dispatch]);

  // populate terms options from Redux
  useEffect(() => {
    if (allTerms.length) {
      setTermsOptions(allTerms.map((t) => ({ label: t.description, value: t._id })));
    }
  }, [allTerms]);

  // Collect PR IDs already used in inquiries
  const usedPrIds = useMemo(() => {
    if (!inquiryList || inquiryList.length === 0) return [];
    const ids = new Set();
    inquiryList.forEach(inq => {
      inq.items?.forEach(item => {
        if (item.prid) ids.add(String(item.prid));
      });
    });
    return Array.from(ids);
  }, [inquiryList]);

  // Filter available PRs
  const availablePRs = useMemo(() => {
    if (isEdit && editData?.items?.length > 0) {
      const editPrIds = editData.items.map(i => String(i.prid));
      return prList.filter(pr => {
        const idStr = String(pr._id);
        const isEditablePr = editPrIds.includes(idStr);
        const notGenerated = !pr.inquiryGenrated || isEditablePr;
        return notGenerated || isEditablePr;
      });
    }
    return prList.filter(pr => !pr.inquiryGenrated);
  }, [prList, isEdit, editData]);

  const poOptions = availablePRs.map(pr => ({ label: pr.prNo, value: pr._id }));

  // Load edit data
  useEffect(() => {
    if (editData?._id) {
      setIsEdit(true);
      setInquiryData({
        inquiryDate: editData.InquiryDate ? editData.InquiryDate.split("T")[0] : "",
        remarks: editData.remarks || "",
        purchase_order: editData.purchase_order || "",
      });

      const mappedItems = (editData.items || []).map(it => {
        const manufactureIds = (it.manufacture || []).map(m => (typeof m === 'object' ? m._id : m));

        // Resolve approved manufacturers from the matched PR to ensure labels are available
        const matchingPr = prList.find(p => String(p._id) === String(it.prid));
        const approvedMake = matchingPr?.approvedmake || it.approvedMake || it.item?.approvedMake || [];

        return {
          prid: it.prid || "",
          item: it.item?._id || it.item || "",
          itemName: it.itemName || it.item?.item_name || it.item?.name || "",
          itemDescription: it.itemDescription || it.item?.item_description || "",
          size1: it.size1 || (typeof it.item?.size1 === "object" ? it.item?.size1?.name : it.item?.size1) || "",
          thickness1: it.thickness1 || (typeof it.item?.thickness1 === "object" ? it.item?.thickness1?.name : it.item?.thickness1) || "",
          size2: it.size2 || (typeof it.item?.size2 === "object" ? it.item?.size2?.name : it.item?.size2) || "",
          thickness2: it.thickness2 || (typeof it.item?.thickness2 === "object" ? it.item?.thickness2?.name : it.item?.thickness2) || "",
          material_Grade: it.material_Grade || it.item?.material_grade || "",
          uom: (typeof it.uom === "object" ? it.uom?.name : it.uom) || it.item?.uom?.name || it.item?.unit?.name || "",
          approvedMake: approvedMake,
          manufacture: manufactureIds,
          qty: it.qty || 0,
          remarks: it.remarks || "",
        };
      });
      setInquiryItems(mappedItems);

      setCheckedTerms(editData.terms_and_conditions?.map((t) => (typeof t === "object" ? t._id : t)) || []);
      const manualTerms = editData.terms_conditions || editData.otherTerms || [];
      setTermsConditions(
        manualTerms.length
          ? manualTerms.map((t, i) => ({ id: i + 1, value: t }))
          : [{ id: 1, value: "" }]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData, prList.length > 0]);

  // Add a new Term row
  const addTerm = () => setTermsConditions(prev => [...prev, { id: prev.length + 1, value: "" }]);

  // Remove a Term row
  const removeTerm = (id) => {
    if (terms_conditions.length === 1) return toast.error("At least one term must exist!");
    setTermsConditions(prev => prev.filter(tc => tc.id !== id));
  };

  // Update term value
  const updateTerm = (id, value) => {
    setTermsConditions(prev => prev.map(tc => (tc.id === id ? { ...tc, value } : tc)));
  };

  // Handle PO selection
  const handlePoSelect = (e) => {
    const prId = e.value;
    setSelectedPo(prId);

    const pr = prList.find(p => p._id === prId);
    if (!pr) return;

    // Map PR items - only include those with balance_qty > 0
    const items = (pr.items || [])
      .filter(it => (it.balance_qty || 0) > 0)
      .map(it => ({
        prid: pr._id,
        item: it.item?._id || "",
        itemName: it.item?.item_name || it.item?.name || "",
        itemDescription: it.item?.item_description || "",
        size1: (typeof it.item?.size1 === "object" ? it.item?.size1?.name : it.item?.size1) || "",
        thickness1: (typeof it.item?.thickness1 === "object" ? it.item?.thickness1?.name : it.item?.thickness1) || "",
        size2: (typeof it.item?.size2 === "object" ? it.item?.size2?.name : it.item?.size2) || "",
        thickness2: (typeof it.item?.thickness2 === "object" ? it.item?.thickness2?.name : it.item?.thickness2) || "",
        material_Grade: it.item?.material_grade || "",
        uom: it.item?.uom?.name || it.item?.unit?.name || "",
        approvedMake: pr.approvedmake || [],
        manufacture: (pr.approvedmake || []).map(m => m._id), // preselect all
        qty: it.balance_qty || 0,
        remarks: it.remarks || "",
      }));

    setInquiryItems(items);

    // Terms & Conditions
    const terms = [];
    if (pr.mtc) {
      const MTC = "MTC: " + pr.mtc;
      terms.push(MTC);
    }
    if (pr.delivery_location) {
      const DeliveryLocation = "Delivery Location: " + pr.delivery_location;
      terms.push(DeliveryLocation);
    }

    if (pr.other_note) {
      Array.isArray(pr.other_note)
        ? terms.push(...pr.other_note)
        : terms.push(pr.other_note);
    }

    setTermsConditions(
      terms.length
        ? terms.map((t, i) => ({ id: i + 1, value: t }))
        : [{ id: 1, value: "" }]
    );
  };


  // Merge duplicate inquiry items by summing qty
  const mergedInquiryItems = useMemo(() => {
    const map = new Map();

    inquiryItems.forEach(item => {
      const key = `${item.item}_${item.size1}_${item.thickness1}_${item.size2}_${item.thickness2}_${item.material_Grade}`;

      if (map.has(key)) {
        const existing = map.get(key);
        existing.qty += Number(item.qty || 0);

        // Merge manufacture arrays uniquely
        if (item.manufacture && item.manufacture.length) {
          const combinedManufacture = new Set([...existing.manufacture, ...item.manufacture]);
          existing.manufacture = Array.from(combinedManufacture);
        }

      } else {
        // If manufacture empty, preselect all approvedMake ids
        let manufacture = item.manufacture;
        if (!manufacture || manufacture.length === 0) {
          manufacture = (item.approvedMake || []).map(m => m._id);
        }

        map.set(key, { ...item, qty: Number(item.qty || 0), manufacture });
      }
    });

    return Array.from(map.values());
  }, [inquiryItems]);


  const totalQty = useMemo(
    () => mergedInquiryItems.reduce((sum, it) => sum + Number(it.qty || 0), 0),
    [mergedInquiryItems]
  );

  const handleSubmit = async () => {
    if (!isEdit && !selectedPo) return toast.error("Please select a PR!");
    if (mergedInquiryItems.length === 0) return toast.error("No items to submit!");
    if (mergedInquiryItems.some(it => !it.manufacture || it.manufacture.length === 0))
      return toast.error("Please select at least one manufacturer for all items!");

    if (inquiryData.purchase_order === "" || inquiryData.purchase_order === null || inquiryData.purchase_order === undefined) return toast.error("Please enter Purchase Order!");

    if (!checkedTerms || checkedTerms.length === 0) {
      return toast.error("Please select at least one predefined Term & Condition!");
    }

    try {
      const filteredItems = mergedInquiryItems.map(it => ({
        prid: it.prid,
        item: it.item,
        manufacture: it.manufacture,
        qty: it.qty,
        remarks: it.remarks || "",
      }));

      const payload = {
        project: localStorage.getItem("U_PROJECT_ID"),
        remarks: inquiryData.remarks,
        purchase_order: inquiryData.purchase_order,
        items: filteredItems,
        total_qty: totalQty,
        terms_and_conditions: checkedTerms,
        terms_conditions: terms_conditions.map(tc => tc.value),
        createdby: localStorage.getItem("PAY_USER_ID"),
      };

      if (isEdit) payload.id = editData._id;

      const res = await axios.post(`${V_URL}/user/inquiry/manage-inquiry-piping`, payload, {
        headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") },
      });

      if (res.data.success) {
        toast.success(res.data.message || (isEdit ? "Inquiry updated!" : "Inquiry saved!"));
        navigate(PO_ROUTE_URLS.PIPING_INQUIRY);
      } else {
        toast.error(res.data.message || "Failed to save Inquiry");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error saving Inquiry");
    }
  };

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link></li>
            <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
            <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_INQUIRY_LIST}>Inquiry</Link></li>
            <li className="breadcrumb-item"><i className="feather-chevron-right" /></li>
            <li className="breadcrumb-item active">{isEdit ? "Edit Inquiry" : "Manage Inquiry"}</li>
          </ul>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="row">
              {!isEdit && (
                <div className="col-md-6">
                  <label className="form-label">Select PR Numbers</label>
                  <Dropdown
                    value={selectedPo}
                    options={poOptions}
                    onChange={handlePoSelect}
                    optionLabel="label"
                    placeholder="Select PR Number"
                    className="w-100"
                    filter
                  />
                </div>
              )}
              <div className="col-md-6 mt-2">
                <label className="form-label">Purchase Order For </label>
                <input
                  className="form-control"
                  value={inquiryData.purchase_order}
                  onChange={(e) => setInquiryData((s) => ({ ...s, purchase_order: e.target.value }))}
                />
                <div className="error">{error.purchase_order}</div>
              </div>
            </div>
          </div>
        </div>

        {mergedInquiryItems.length > 0 && (
          <div className="card mt-2">
            <div className="card-body">
              <h5>Inquiry Items</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Item</th>
                    <th>Item Description</th>
                    <th>Size 1</th>
                    <th>Thickness 1</th>
                    <th>Size 2</th>
                    <th>Thickness 2</th>
                    <th>Material Grade</th>
                    <th>UOM</th>
                    <th>Manufacturer(s)</th>
                    <th>Qty</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedInquiryItems.map((it, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{it.itemName}</td>
                      <td>{it.itemDescription}</td>
                      <td>{it.size1}</td>
                      <td>{it.thickness1}</td>
                      <td>{it.size2}</td>
                      <td>{it.thickness2}</td>
                      <td>{it.material_Grade}</td>
                      <td>{it.uom}</td>
                      <td>
                        <MultiSelect
                          value={it.manufacture || []}
                          options={(
                            (it.approvedMake?.length ? it.approvedMake : prList.find(p => String(p._id) === String(it.prid))?.approvedmake) || []
                          ).map(m => ({ label: m.name, value: m._id }))}
                          onChange={(e) => {
                            setInquiryItems((prev) =>
                              prev.map((item) =>
                                item.item === it.item &&
                                  item.size1 === it.size1 &&
                                  item.thickness1 === it.thickness1 &&
                                  item.size2 === it.size2 &&
                                  item.thickness2 === it.thickness2 &&
                                  item.material_Grade === it.material_Grade
                                  ? { ...item, manufacture: e.value }
                                  : item
                              )
                            );
                          }}
                          placeholder="Select Manufacturers"
                          className="w-100"
                          display="chip"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={it.qty}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setInquiryItems((prev) =>
                              prev.map((item) =>
                                item.item === it.item &&
                                  item.size1 === it.size1 &&
                                  item.thickness1 === it.thickness1 &&
                                  item.size2 === it.size2 &&
                                  item.thickness2 === it.thickness2 &&
                                  item.material_Grade === it.material_Grade
                                  ? { ...item, qty: val }
                                  : item
                              )
                            );
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={it.remarks}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInquiryItems((prev) =>
                              prev.map((item) =>
                                item.item === it.item &&
                                  item.size1 === it.size1 &&
                                  item.thickness1 === it.thickness1 &&
                                  item.size2 === it.size2 &&
                                  item.thickness2 === it.thickness2 &&
                                  item.material_Grade === it.material_Grade
                                  ? { ...item, remarks: val }
                                  : item
                              )
                            );
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
              <h4>Terms and Conditions</h4>
            </div>

            <div className="mb-4">
              <label className="form-label">Predefined Terms</label>
              <MultiSelect
                value={checkedTerms}
                options={termsOptions}
                onChange={(e) => setCheckedTerms(e.value)}
                placeholder="Select Terms & Conditions"
                className="w-100"
                display="chip"
                filter
              />
            </div>

            <div className="d-flex justify-content-between mb-3">
              <h5>Other Terms</h5>
              <button className="btn btn-success" onClick={addTerm}>
                <img src="/assets/img/icons/plus.svg" alt="add" />
              </button>
            </div>
            <div className="col-md-12">
              {terms_conditions.map((tc, idx) => (
                <div key={tc.id} className="d-flex mb-2 gap-2">
                  <textarea
                    className="form-control"
                    placeholder={`Term ${idx + 1}`}
                    value={tc.value}
                    onChange={(e) => updateTerm(tc.id, e.target.value)}
                    rows={2}
                    style={{ resize: "vertical" }}
                  />
                  <button className="btn btn-danger" onClick={() => removeTerm(tc.id)}>
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <div className="col-md-12">
              <label>Remarks</label>
              <textarea
                className="form-control"
                rows="3"
                value={inquiryData.remarks}
                onChange={(e) => setInquiryData({ ...inquiryData, remarks: e.target.value })}
              />
            </div>
          </div>
          <div className="row ms-2 me-2 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <strong>Total Quantity: {totalQty} KG</strong>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {isEdit ? "Update Inquiry" : "Save Inquiry"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipingManageInquiry;
