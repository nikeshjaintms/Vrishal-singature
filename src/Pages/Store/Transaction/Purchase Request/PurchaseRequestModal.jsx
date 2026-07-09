import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../Store/Store/Item/AdminItem';
import { getMainStoreStock } from '../../../../Store/Store/MainStore/MainStock';
import { getGenMaster } from '../../../../Store/Store/GenralMaster/GenMaster';
import { Dropdown } from 'primereact/dropdown';
import { getAdminCategory } from '../../../../Store/Store/StoreMaster/Category/AdminCategory';

const PurchaseRequestModal = ({ show, handleClose, handleSave, EditItem, mode }) => {
    const dispatch = useDispatch();
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const [stockListData, setStocListkData] = useState(null);

    const [ItemNo, setItemNo] = useState(null);
    const [formState, setFormState] = useState({
        item_id: null,
        item_name: '',
        unit: '',
        m_code: '',
        quantity: 0,
        b_quantity: 0,
        category_name: '',
        category_id: '',
        required_qty: 0,
        rate: 0,
        pr_party: '',
        remarks: ''
    });

    const [error, setError] = useState({});
    const [entity, setEntity] = useState([]);
    const filteredData = itemDetails?.find((it) => it?._id === formState.item_id);
    const parties = useSelector((state) => state.getParty?.user?.data || []);
    const stock = useSelector((state) => state.getMainStock?.user?.data || []);
    const categories = useSelector((state) => state.getAdminCategory?.user?.data || []);
    useEffect(() => {
        if (filteredData?._id) {
            dispatch(getMainStoreStock({ itemId: filteredData?._id }))
                .then(response => {
                    setStocListkData(response.payload.data);
                })
                .catch(error => {
                    console.error('Error fetching stock data:', error);
                });
        }
    }, [filteredData?._id, dispatch]);

    const currentStock = stockListData?.find(item => item.ItemId === filteredData?._id) || {};
    const availableBalance = currentStock.balance || 0;
    useEffect(() => {
        if (mode === "edit" && EditItem && categories.length > 0 && parties.length > 0) {
            setFormState({
                item_id: EditItem.item_id || '',
                item_name: EditItem.item_name || '',
                unit: EditItem.unit || '',
                category_id: categories.find(cat => cat.name === EditItem.category_name)?._id || '',
                pr_party: parties.find(party => party._id === EditItem.pr_party)?._id || '',
                required_qty: EditItem.required_qty || 0,
                item_brand: EditItem.item_brand || '',
                remarks: EditItem.remarks || '',
            });
            setItemNo(EditItem.item_id);
        } else {
            setItemNo(null)
        }
    }, [EditItem, mode, categories, parties]);

    useEffect(() => {
        const filteredData = stock?.store_items?.find((it) => it?.item_id === ItemNo);
        setFormState((prev) => ({
            ...prev,
            b_quantity: filteredData?.balance || 0
        }))
    }, [stock, ItemNo])
    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
        dispatch(getAdminCategory())
    }, [dispatch]);
    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);
    useEffect(() => {
        if (mode === "add") {
            resetForm();
        }
    }, [mode]);

    const resetForm = () => {
        setFormState({
            item_id: '',
            item_name: '',
            unit: '',
            quantity: 0,
            category_name: '',
            category_id: '',
            pr_party: '',
            item_brand: '',
            required_qty: 0,
            rate: 0,
            amount: 0,
            remarks: ''
        });
        setError({});
    };
    const Itemsoption = itemDetails?.map(it => ({
        label: it?.name,
        value: it?._id
    }));
    const handleItemsChange = (e) => {
        const { name, value } = e.target;
        if (name === 'item_id') {
            const selectedItem = entity.find(item => item._id === value);
            setFormState((prevState) => ({
                ...prevState,
                item_id: value,
                item_name: selectedItem?.name || '',
                unit: selectedItem?.unit?.name || '',
            }));
        }
        setItemNo(e.value);
    };
    const handleModalClose = () => {
        handleClose();
        mode === 'add' && resetForm();
        dispatch(getGenMaster({ tag_id: 9 }))
    };

    const handleCatChange = (e, name) => {
        const { value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'item_id') {
            const selectedItem = entity.find(item => item._id === value);
            setFormState((prevState) => ({
                ...prevState,
                item_id: value,
                item_name: selectedItem?.name || '',
                unit: selectedItem?.unit?.name || '',
            }));
        } else if (name === 'category_id') {
            const selectedCategory = categories.find(cat => cat._id === value);
            setFormState((prevState) => ({
                ...prevState,
                category_id: value,
                category_name: selectedCategory?.name || '',
            }));
        } else {
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        setError({});
        console.log('111')
    };


    useEffect(() => {
        const calculateAmounts = () => {
            const { required_qty, rate } = formState;
            const Amount = parseFloat(required_qty) * parseFloat(rate) || 0;
            setFormState((prevState) => ({
                ...prevState,
                amount: Amount.toFixed(2),
            }));
        };
        calculateAmounts();
    }, [formState.required_qty, formState.rate]);
    const validation = () => {
        let isValid = true;
        let err = {};

        if (!formState.item_id) {
            isValid = false;
            err['item_error'] = "Please select an item";
        }
        if (!formState.item_id) {
            isValid = false;
            err['quantity_err'] = "Please select required quantity";
        }
        setError(err);
        return isValid;
    };
    const saveItem = (addMore = false) => {
        // if (validation()) {
        const itemData = { ...formState };
        if (mode === 'add') {
            handleSave([itemData], 'add');
        } else {
            handleSave(itemData, EditItem._id, 'edit');
        }
        if (addMore) {
            resetForm();
        } else {
            handleModalClose();
        }
        // }
    };
    return (
        <Modal show={show} onHide={handleModalClose} size="lg" backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{mode === 'edit' ? 'Edit Item' : 'Add Item'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-12">
                        <div className="input-block local-forms">
                            <label>
                                Item Name
                                <span className="login-danger">*</span>
                            </label>
                            <Dropdown
                                value={ItemNo}
                                name="item_id"
                                options={Itemsoption}
                                onChange={handleItemsChange}
                                placeholder="select Item"
                                filter
                                filterBy="label"
                                appendTo="self"
                                className="w-100 multi-prime-react model-prime-multi"
                            />
                            <div className='error'>{error.item_error}</div>
                        </div>
                        {/* <div className="input-block local-forms">
                            <label>Item Name<span className="login-danger">*</span></label>
                            <select
                                className="form-select form-control"
                                name="item_id"
                                value={formState.item_id}
                                onChange={handleChange}
                            >
                                <option value="">Select Item</option>
                                {entity.map((item) => (
                                    <option key={item._id} value={item._id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            {error.item_error && <div className="error">{error.item_error}</div>}
                        </div> */}
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Unit</label>
                            <input
                                className="form-control"
                                name="unit"
                                value={formState?.unit || ''}
                                onChange={handleChange}
                                disabled
                            />
                            <div className="error"></div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>
                                Stock Quantity
                            </label>
                            <input type="number" className="form-control" name="b_quantity" value={availableBalance} onChange={handleChange} disabled />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Required Quantity<span className="login-danger">*</span></label>
                            <input type="number" className="form-control" name="required_qty" value={formState.required_qty} onChange={handleChange} />
                            <div className="error">{error.quantity_err}</div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Item Brand</label>
                            <input type="text" className="form-control" name="item_brand" value={formState.item_brand} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Categories <span className="login-danger">*</span></label>
                            <Dropdown
                                value={formState.category_id}
                                onChange={(e) => handleCatChange(e, 'category_id')}
                                options={categories.map((item) => ({
                                    label: item.name,
                                    value: item._id,
                                }))}
                                optionLabel="label"
                                placeholder="select a Category"
                                filter
                                filterBy="label"
                                className="w-100 multi-prime-react model-prime-multi"
                                emptyMessage="No Category found"
                                appendTo="self"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-block local-forms">
                            <label>Party<span className="login-danger">*</span></label>

                            <Dropdown
                                value={formState.pr_party}
                                onChange={(e) => handleCatChange(e, 'pr_party')}
                                options={parties.map((item) => ({
                                    label: item.name,
                                    value: item._id,
                                }))}
                                optionLabel="label"
                                placeholder="select a Party"
                                filter
                                filterBy="label"
                                className="w-100 multi-prime-react model-prime-multi"
                                emptyMessage="No Party found"
                                appendTo="self"
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="input-block local-forms">
                            <label>
                                Remarks
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="remarks"
                                value={formState.remarks || ''}
                                onChange={handleChange}
                            />
                            <div className="error"></div>
                        </div>
                    </div>
                    <div className="col-12 text-end">
                        <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancel</button>
                        <button type="button" className="btn btn-primary ms-2" onClick={() => saveItem(false)}>Save</button>

                    </div>
                </div>
            </Modal.Body>
        </Modal >
    );
};

export default PurchaseRequestModal;
