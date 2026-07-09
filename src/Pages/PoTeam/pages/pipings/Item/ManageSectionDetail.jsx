import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { addItemDetails } from '../../../../../Store/Piping/Item/ManageItem';
import { getAdminItemCategory } from '../../../../../Store/Piping/ItemCategory/AdminItemCategory';
import { getAdminUOM } from '../../../../../Store/Piping/UOM/AdminUOM';
import { getAdminSize } from '../../../../../Store/Piping/Size/AdminSize';
import { getAdminThickness } from '../../../../../Store/Piping/Thickness/AdminThickness';
import { MultiSelect } from 'primereact/multiselect';
import PO_ROUTE_URLS from '../../../../../Routes/PoTeam/PoRoutes';

const PipingManageSectionDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = location.state;

    const [item, setItem] = useState({
        item_name: "",
        item_description: "",
        material_grade: "",
        item_category: "",
        uom: "",
        size1: "",
        thickness1: "",
        size2: "",
        thickness2: "",
    });

    const [sizeThicknessRows, setSizeThicknessRows] = useState([{ size1: "", thickness1: [] }]);
    const [sizeThicknessRowsDual, setSizeThicknessRowsDual] = useState([{ size1: "", thickness1: [], size2: "", thickness2: [] }]);
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [selectValue, setSelectValue] = useState(false);

    useEffect(() => {
        dispatch(getAdminItemCategory());
        dispatch(getAdminUOM());
        dispatch(getAdminThickness({ status: true }));
        dispatch(getAdminSize({ status: true }));
    }, [dispatch]);

    const categoryData = useSelector((state) => state.getAdminItemCategory?.user?.data);
    const uomData = useSelector((state) => state.getAdminUOM?.user?.data);
    const sizeData = useSelector((state) => state.getAdminSize?.user?.data);
    const thicknessData = useSelector((state) => state.getAdminThickness?.user?.data);

    const isDualSizeCategory = () => {
        const selected = categoryData?.find(c => c._id === item.item_category);
        return selected?.size2_thickness2_required === true;
    };

    useEffect(() => {
        if (data) {
            setItem({
                item_name: data.item_name || "",
                item_description: data.item_description || "",
                material_grade: data.material_grade || "",
                item_category: data?.item_category?._id || "",
                uom: data?.uom?._id || "",
                size1: data?.size1?._id || "",
                thickness1: data?.thickness1?._id || "",
                size2: data?.size2?._id || "",
                thickness2: data?.thickness2?._id || "",
            });
            setSelectValue(Boolean(data?.status));

            if (isDualSizeCategory()) {
                setSizeThicknessRowsDual([{
                    size1: data?.size1?._id || "",
                    thickness1: data?.thickness1?._id ? [data.thickness1._id] : [],
                    size2: data?.size2?._id || "",
                    thickness2: data?.thickness2?._id ? [data.thickness2._id] : []
                }]);
            } else {
                setSizeThicknessRows([{
                    size1: data?.size1?._id || "",
                    thickness1: data?.thickness1?._id ? [data.thickness1._id] : []
                }]);
            }
        }
    }, [data, categoryData]);

    const handleChange = (e) => {
        setItem({ ...item, [e.target.name]: e.target.value });
    };

    const addRow = () => setSizeThicknessRows([...sizeThicknessRows, { size1: "", thickness1: [] }]);
    const deleteRow = (i) => {
        const rows = [...sizeThicknessRows];
        rows.splice(i, 1);
        setSizeThicknessRows(rows.length ? rows : [{ size1: "", thickness1: [] }]);
    };
    const updateRow = (i, f, v) => {
        const rows = [...sizeThicknessRows];
        rows[i][f] = v;
        setSizeThicknessRows(rows);
    };

    const updateDualRow = (i, f, v) => {
        const rows = [...sizeThicknessRowsDual];
        rows[i][f] = v;
        setSizeThicknessRowsDual(rows);
    };
    const addDualRow = () => setSizeThicknessRowsDual([...sizeThicknessRowsDual, { size1: "", thickness1: [], size2: "", thickness2: [] }]);

    const validation = () => {
        let isValid = true;
        let err = {};
        if (!item.item_name.trim()) { err.item_name_err = "Enter name"; isValid = false; }
        if (!item.item_category) { err.item_category_err = "Select category"; isValid = false; }
        if (!item.uom) { err.uom_err = "Select UOM"; isValid = false; }
        if (!item.item_description) { err.item_description_err = "Enter description"; isValid = false; }
        if (!item.material_grade) { err.material_grade_err = "Enter grade"; isValid = false; }
        setError(err);
        return isValid;
    };

    const handleSubmit = () => {
        if (!validation()) return;
        setDisable(true);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append("firm_id", localStorage.getItem("PAY_USER_FIRM_ID"));
        bodyFormData.append("year_id", localStorage.getItem("PAY_USER_YEAR_ID"));
        bodyFormData.append("project", localStorage.getItem("U_PROJECT_ID"));
        bodyFormData.append("item_name", item.item_name);
        bodyFormData.append("item_description", item.item_description);
        bodyFormData.append("material_grade", item.material_grade);
        bodyFormData.append("item_category", item.item_category);
        bodyFormData.append("uom", item.uom);
        bodyFormData.append("status", selectValue ? "true" : "false");

        if (isDualSizeCategory()) {
            bodyFormData.append("sizeThickness", JSON.stringify(sizeThicknessRowsDual));
        } else {
            bodyFormData.append("sizeThickness", JSON.stringify(sizeThicknessRows));
        }

        if (data?._id) bodyFormData.append("id", data._id);

        dispatch(addItemDetails(bodyFormData))
            .then((res) => {
                setDisable(false);
                if (res.payload?.success) navigate(PO_ROUTE_URLS.PIPING_SECTION_DETAILS);
            })
            .catch(() => setDisable(false));
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="row">
                        <div className="col-sm-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_HOME}>Dashboard</Link></li>
                                <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                <li className="breadcrumb-item"><Link to={PO_ROUTE_URLS.PIPING_SECTION_DETAILS}>Item Details List</Link></li>
                                <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                <li className="breadcrumb-item active">{data?._id ? "Edit" : "Add"} Item</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h4>{data?._id ? "Edit" : "Add"} Item</h4>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Item Category <span className="text-danger">*</span></label>
                                <select name="item_category" className="form-control" value={item.item_category} onChange={handleChange} disabled={data?._id}>
                                    <option value="">Select Category</option>
                                    {categoryData?.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                                <span className="error">{error.item_category_err}</span>
                            </div>
                            <div className="col-md-4">
                                <label>Item Name <span className="text-danger">*</span></label>
                                <input type="text" name="item_name" className="form-control" value={item.item_name} onChange={handleChange} disabled={data?._id} />
                                <span className="error">{error.item_name_err}</span>
                            </div>
                            <div className="col-md-4">
                                <label>Item Description <span className="text-danger">*</span></label>
                                <input type="text" name="item_description" className="form-control" value={item.item_description} onChange={handleChange} />
                                <span className="error">{error.item_description_err}</span>
                            </div>
                            <div className="col-md-4">
                                <label>UOM <span className="text-danger">*</span></label>
                                <select name="uom" className="form-control" value={item.uom} onChange={handleChange}>
                                    <option value="">Select UOM</option>
                                    {uomData?.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                                </select>
                                <span className="error">{error.uom_err}</span>
                            </div>
                            <div className="col-md-4">
                                <label>Material Grade <span className="text-danger">*</span></label>
                                <input type="text" name="material_grade" className="form-control" value={item.material_grade} onChange={handleChange} />
                                <span className="error">{error.material_grade_err}</span>
                            </div>
                            {data?._id && (
                                <div className='col-md-4'>
                                    <label>Status</label>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" role="switch" onChange={(e) => setSelectValue(e.target.checked)} checked={selectValue} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {isDualSizeCategory() && (
                            <div className="mt-4">
                                <h5>Size & Thickness (Dual Rows)</h5>
                                <table className="table table-bordered mt-2">
                                    <thead><tr><th>Size 1</th><th>Thickness 1</th><th>Size 2</th><th>Thickness 2</th></tr></thead>
                                    <tbody>
                                        {sizeThicknessRowsDual.map((row, index) => (
                                            <tr key={index}>
                                                <td><select className="form-control" value={row.size1} onChange={(e) => updateDualRow(index, "size1", e.target.value)}>
                                                    <option value="">Select Size</option>{sizeData?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                                </select></td>
                                                <td>{data?._id ? (
                                                    <select className="form-control" value={row.thickness1[0] || ""} onChange={(e) => updateDualRow(index, "thickness1", e.target.value ? [e.target.value] : [])}>
                                                        <option value="">Select Thk</option>{thicknessData?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                    </select>
                                                ) : (
                                                    <MultiSelect value={row.thickness1} options={thicknessData?.map(t => ({ label: t.name, value: t._id }))} onChange={(e) => updateDualRow(index, "thickness1", e.value)} display="chip" className="w-100" />
                                                )}</td>
                                                <td><select className="form-control" value={row.size2} onChange={(e) => updateDualRow(index, "size2", e.target.value)}>
                                                    <option value="">Select Size</option>{sizeData?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                                </select></td>
                                                <td>{data?._id ? (
                                                    <select className="form-control" value={row.thickness2[0] || ""} onChange={(e) => updateDualRow(index, "thickness2", e.target.value ? [e.target.value] : [])}>
                                                        <option value="">Select Thk</option>{thicknessData?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                    </select>
                                                ) : (
                                                    <MultiSelect value={row.thickness2} options={thicknessData?.map(t => ({ label: t.name, value: t._id }))} onChange={(e) => updateDualRow(index, "thickness2", e.value)} display="chip" className="w-100" />
                                                )}</td>
                                            </tr>
                                        ))}
                                        {!data?._id && <tr><td colSpan="4"><button className="btn btn-primary" onClick={addDualRow}>+ Add Row</button></td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!isDualSizeCategory() && (
                            <div className="mt-4">
                                <h5>Size + Thickness</h5>
                                <table className="table table-bordered mt-2">
                                    <thead><tr><th>Size</th><th>Thickness</th><th>Action</th></tr></thead>
                                    <tbody>
                                        {sizeThicknessRows.map((row, index) => (
                                            <tr key={index}>
                                                <td><select className="form-control" value={row.size1} onChange={(e) => updateRow(index, "size1", e.target.value)}>
                                                    <option value="">Select Size</option>{sizeData?.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                                </select></td>
                                                <td>{data?._id ? (
                                                    <select className="form-control" value={row.thickness1[0] || ""} onChange={(e) => updateRow(index, "thickness1", e.target.value ? [e.target.value] : [])}>
                                                        <option value="">Select Thk</option>{thicknessData?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                                    </select>
                                                ) : (
                                                    <MultiSelect value={row.thickness1} options={thicknessData?.map(t => ({ label: t.name, value: t._id }))} onChange={(e) => updateRow(index, "thickness1", e.value)} display="chip" className="w-100" />
                                                )}</td>
                                                <td><button className="btn btn-danger btn-sm" onClick={() => deleteRow(index)}>Delete</button></td>
                                            </tr>
                                        ))}
                                        {!data?._id && <tr><td colSpan="3"><button className="btn btn-primary" onClick={addRow}>+ Add Row</button></td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="text-end mt-3">
                            <button className="btn btn-primary me-2" disabled={disable} onClick={handleSubmit}>{disable ? "Processing..." : data?._id ? "Update" : "Submit"}</button>
                            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PipingManageSectionDetail;