import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminItem } from '../../../../Store/Store/Item/AdminItem'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { M_STORE } from '../../../../BaseUrl'
import { getMainStock } from '../../../../Store/Store/Stock/getMainStock'
import { getGenMaster } from '../../../../Store/Store/GenralMaster/GenMaster'
import PurchaseRequestForm from '../../../../Components/Forms/PurchaseRequestForm'
import PurchaseRequestItemTable from '../../../../Components/Table/PurchaseRequestItemTable'
import { ManagePurchaseRequest } from '../../../../Store/Store/PurchaseRequest/ManagePurchaseRequest'
import { Dropdown } from 'primereact/dropdown';
import { getAdminCategory } from '../../../../Store/Store/StoreMaster/Category/AdminCategory'
import { useLocation } from "react-router-dom";

const ManagePurchaseRequestDetail = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([]);

    const [editeMode, setEditeMode] = useState(false);
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        "Brand": "item_brand",
        "Categories": "cat_name",
        "Quantity": "quantity",
        'Remarks': 'remarks',
    }
    const [disable, setDisable] = useState(true);
    const [filter, setFilter] = useState({
        date: {
            start: null,
            end: null
        }
    });
    const [error, setError] = useState('');
    const [ItemNo, setItemNo] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [entity, setEntity] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [singleItem, setSingleItems] = useState({
        unit: '',
        gst: '',
        mcode: '',
        item_id: '',
        item_name: ''
    });
    const [singlecat, setSinglecate] = useState({
        cat_id: "",
        cat_name: ""
    });
    const [item, setItem] = useState({
        item_id: '',
        item_name: '',
        unit: '',
        m_code: '',
        item_brand: "",
        item_domain: '',
        b_quantity: 0,
        pr_party: '',
        remarks: '',
    });

    const [calcItem, setCalCItem] = useState({
        item_id: '',
        quantity: 0,
        item_brand: "",
        Categories: '',
        b_quantity: 0,
        pr_party: '',
        remarks: '',
    });

    const [formData, setFormData] = useState({
        order_date: '',
        bill_no: '',
        receiveBy: '',
        master_id: ''
    });

    const location = useLocation();
const selectedItems = location.state?.selectedItems || [];
// console.log("pr page",selectedItems);

    const dispatch = useDispatch();
useEffect(() => {
  if (selectedItems.length > 0) {
    setData(selectedItems);
    // setModalOpen(true); // optional: open the modal to view/edit
  }
}, [selectedItems]);

useEffect(() => {
  const items = selectedItems.length > 0
    ? selectedItems
    : JSON.parse(localStorage.getItem("selectedPRItems")) || [];

  if (items.length > 0) {
    setData(items);
  }
}, []);


    useEffect(() => {
        if (localStorage.getItem('PAY_USER_TOKEN') === null) {
            navigate("/user/login");
        } else if (localStorage.getItem('VI_PRO') !== `${M_STORE}`) {
            toast.error('Access Denied. You do not have permission to view this product. Please contact your administrator for assistance.')
            navigate("/user/login");
        }
        if (disable === true) {
            fetchData();
        }
    }, [navigate, disable, filter]);

    const fetchData = () => {
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('firm_id', localStorage.getItem('PAY_USER_FIRM_ID'))
        // bodyFormData.append('year_id', localStorage.getItem('PAY_USER_YEAR_ID'))
        bodyFormData.append('filter', JSON.stringify(filter))
        dispatch(getMainStock(bodyFormData));
        setDisable(false);
    }
    const parties = useSelector((state) => state.getParty?.user?.data || []);
    const stock = useSelector((state) => state.getMainStock?.user?.data || []);
    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const categories = useSelector((state) => state.getAdminCategory?.user?.data || []);

    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
        dispatch(getAdminCategory())
    }, [dispatch])

    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);

    // Just to populate the sinfle item details
    useEffect(() => {
        const filteredData = itemDetails?.find((it) => it?._id === ItemNo);
        const categoriesData = categories?.find((it) => it?._id === calcItem.Categories);
        setSingleItems({
            item_id: filteredData?._id,
            item_name: filteredData?.name,
            unit: filteredData?.unit?.name,
            gst: filteredData?.gst_percentage,
            mcode: filteredData?.mcode
        })
        setSinglecate({
            cat_id: categoriesData?._id,
            cat_name: categoriesData?.name
        })
    }, [itemDetails, ItemNo, calcItem.Categories])

    const Itemsoption = itemDetails?.map(it => ({
        label: it?.name,
        value: it?._id
    }));

    const handleItemsChange = (e) => {
        setItemNo(e.value);
    };

    const calculation = (e) => {
        const { name, value } = e.target
        setCalCItem((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    let itemName = calcItem.item_id
    let Amount = parseFloat(calcItem.quantity) * parseFloat(calcItem.rate);
    let disAmount = Amount * calcItem.discount / 100
    let spDiscount = (Amount - disAmount) * calcItem.sp_discount / 100;
    let taxableAmount = Amount - disAmount - spDiscount;
    let gstAmount = (taxableAmount * parseFloat(singleItem?.gst)) / 100;
    let total = taxableAmount + gstAmount;

    useEffect(() => {
        setItem({
            item_id: singleItem?.item_id || calcItem.item_id,
            item_name: singleItem.item_name || calcItem.item_name,
            quantity: calcItem.quantity,
            pr_party: calcItem.pr_party,
            m_code: singleItem.mcode || calcItem.m_code,
            unit: singleItem.unit || calcItem.unit,
            item_brand: calcItem?.item_brand,
            item_domain: singlecat?.cat_id || calcItem.item_domain,
            cat_name: singlecat?.cat_name || calcItem.cat_name,
            category_id: singlecat?.cat_id || calcItem.category_id,
            remarks: calcItem?.remarks,
        });
    }, [calcItem, singleItem, singlecat]);

    useEffect(() => {
        const filteredData = stock?.store_items?.find((it) => it?.item_id === ItemNo);
        setCalCItem((prev) => ({
            ...prev,
            b_quantity: filteredData?.balance || 0
        }))
    }, [stock, ItemNo])

    const handleChange = (e) => {
        calculation(e);
        setError("")
    }
    const validation = () => {
        var isValid = true;
        let err = {};
        if (!item.item_id) {
            isValid = false;
            err['item_error'] = "Please select an item";
        }
        if (!item.quantity) {
            isValid = false;
            err['quantity_err'] = "Please select required quantity";
        }
        if (!item.category_id) {
            isValid = false;
            err['category_id'] = "Please select category";
        }
        if (!item.pr_party) {
            isValid = false;
            err['pr_party'] = "Please select party name";
        }
        setError(err);
        return isValid;
    };
    const handleEdit = (index) => {
        setEditIndex(index)
        const itemToEdit = data[index]
        setEditeMode(true)
        setCalCItem((prev) => ({
            ...prev,
            item_id: itemToEdit?.item_id,
            quantity: itemToEdit?.quantity,
            item_brand: itemToEdit?.item_brand,
            Categories: itemToEdit?.category_id,
            pr_party: itemToEdit?.pr_party,
            remarks: itemToEdit?.remarks,
        }));
        setItemNo(itemToEdit?.item_id)

        setModalOpen(true);
    };

    useEffect(() => {
        dispatch(getGenMaster({ tag_id: 9 }));
    }, [dispatch]);

    const handleModalClose = () => {
        setModalOpen(false);
        setItem({
            item_id: '',
            unit: '',
            m_code: '',
            quantity: 0,
            remarks: '',
        });
        setCalCItem({
            item_id: '',
            quantity: 0,
            remarks: '',
        });
        setError("");
    };
    const handleSave = () => {
        if (validation()) {
            if (editeMode && editIndex !== null) {
                setData((prevData) => {
                    const updatedData = [...prevData];
                    updatedData[editIndex] = item;
                    return updatedData;
                });
                setEditeMode(false);
                setEditIndex(null);
            } else {
                setData((prevData) => [...prevData, item]);
                setEditeMode(false)
            }
            handleModalClose();
        }
    };
    const handleDelete = (index) => {
        const itemName = data[index]?.item_name || "this item";
        Swal.fire({
            title: `Are you sure you want to delete ${itemName}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                setData((prevData) => prevData.filter((_, i) => i !== index));
            }
        });
    };
    const handleReset = () => {
        setItem({
            item_id: '',
            item_name: '',
            unit: '',
            m_code: '',
            quantity: 1,
            remarks: '',
            category_id: '',  // Ensure category is reset
            pr_party: '',     // Ensure party is reset
        });
        setCalCItem({
            item_id: '',
            quantity: 0,
            rate: 0,
            item_brand: "",
            Categories: '',    // Ensure category field is reset
            b_quantity: 0,
            remarks: '',
        });
        setError(""); // Reset errors as well
    };
    const handleAddMore = () => {
        if (validation()) {
            setData((prevData) => {
                return [...prevData, item];
            });
            handleReset();
        }
        setItemNo(null);
        setSingleItems({
            item_id: '',
            item_name: '',
            unit: '',
            m_code: '',
            item_brand: "",
            item_domain: '',
            b_quantity: 0,
            pr_party: '',
            remarks: '',
        })
    };
    const handleAddItem = () => {
        setEditeMode(false)
        setModalOpen(true)
        setSingleItems({
            item_id: '',
            item_name: '',
            unit: '',
            m_code: '',
            item_brand: "",
            item_domain: '',
            b_quantity: 0,
            pr_party: '',
            remarks: '',
        })
        setCalCItem({
            item_id: '',
            quantity: 0,
            rate: 0,
            item_brand: "",
            Categories: '',
            b_quantity: 0,
            remarks: '',
        });
        setItemNo(null)
    }
    const handleSubmit = (addForm) => {
        if (!addForm.is_edit) {
            if (data?.length > 0) {
                const itemDetails = data.map((item) => ({
                    item_id: item.item_id,
                    unit: item.unit,
                    category_id: item.category_id,
                    item_brand: item.item_brand,
                    required_qty: item.quantity,
                    pr_party: item.pr_party || '',
                    remarks: item.remarks
                }));
                const payload = {
                    "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
                    "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                    "tag_number": 9,
                    "master_id": addForm.master_id,
                    "items_details": itemDetails,
                    "transport_id": addForm?.transport_id,
                    "trans_date": addForm?.trans_date,
                    "site_location": addForm?.site_location,
                    "store_location": addForm?.store_location,
                    // "approve_by": addForm?.approve_by,
                    "department": addForm?.department,

                }
                dispatch(ManagePurchaseRequest(payload))
                    .then((res) => {
                        if (res.payload.success === true) {
                             localStorage.removeItem("selectedPRItems");
                            navigate('/main-store/user/getPurchaseRequest')
                        }
                    }).catch((error) => {
                        console.log(error, 'ERROR');
                    })
            } else {
                toast.error('Please add the item details')
            }
        }
    }

    const handleCatChange = (e, name) => {
        const { value } = e.target;
        setCalCItem((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleBack = () => {
        if (data?.length === 0) {
            toast.error('Please add items')
        } else {
            navigate('/main-store/user/getPurchaseRequest')
        }
    }
    return (
        <div className={`main-wrapper ${false ? "slide-nav" : ""}`}>
            <Header handleOpen={() => { }} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/main-store/user/dashboard">Dashboard</Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/main-store/user/getPurchaseRequest">
                                            Purchase Request
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {"Add"} Purchase Request
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <PurchaseRequestForm
                        title={'Add Purchase Request'}
                        dropdown_name={'Request By'}
                        formData={formData}
                        isEdit={false}
                        handleSubmit={handleSubmit}
                    />
                    <PurchaseRequestItemTable
                        headers={headers}
                        data={data}
                        onAddItem={handleAddItem}
                        onDeleteItem={handleDelete}
                        onEditItem={handleEdit}
                    />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button type="button" className="btn btn-primary" onClick={handleBack}>Back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        show={modalOpen}
                        backdrop="static"
                        size="lg"
                        keyboard={false}
                        onHide={handleModalClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Items Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modal-container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="input-block local-forms">
                                                            <label>
                                                                Item Name
                                                                <span className="login-danger">*</span>
                                                            </label>
                                                            <Dropdown
                                                                value={ItemNo}
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
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <div className="input-block local-forms">
                                                            <label>Unit</label>
                                                            <input className="form-control" name="unit" value={singleItem?.unit} onChange={handleChange} disabled />
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-md-6">
                                                        <div className="input-block local-forms">
                                                            <label>M. Code</label>
                                                            <input type='text' className="form-control" name="mcode" value={singleItem?.mcode} onChange={handleChange} disabled />
                                                        </div>
                                                    </div> */}
                                                    <div className="col-md-6">
                                                        <div className="input-block local-forms">
                                                            <label>
                                                                Stock Quantity
                                                            </label>
                                                            <input type="number" className="form-control" name="b_quantity" value={calcItem.b_quantity} onChange={handleChange} disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-md-6">
                                                        <div className="input-block local-forms">
                                                            <label>Require Quantity<span className="login-danger">*</span>
                                                            </label>
                                                            <input type="number" className="form-control" name="quantity" value={calcItem.quantity} onChange={handleChange} />
                                                            <div className='error'>{error.quantity_err}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-block local-forms">
                                                            <label>Item Brand</label>
                                                            <input type="text" className="form-control" name="item_brand" value={calcItem.item_brand} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-12 col-md-6 ">
                                                        <div className="input-block local-forms">
                                                            <label>Categories <span className="login-danger">*</span>  </label>
                                                            <Dropdown
                                                                value={calcItem?.Categories || ''}
                                                                onChange={(e) => handleCatChange(e, 'Categories')}
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
                                                            <div className='error'>{error.category_id}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6">
                                                        <div className="input-block local-forms">
                                                            <label>Party<span className="login-danger">*</span></label>

                                                            <Dropdown
                                                                value={calcItem?.pr_party || ''}
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
                                                            <div className='error'>{error.pr_party}</div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className="col-12">
                                                        <div className="input-block local-forms">
                                                            <label>Remarks</label>
                                                            <input type="text" className="form-control" name="remarks" value={calcItem.remarks} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 text-end">
                                                    <div className="doctor-submit text-end">
                                                        <button type="button" className="btn btn-primary cancel-form" onClick={handleModalClose}>Cancel</button>
                                                        <button type="button" className="btn btn-primary submit-form ms-2" onClick={handleSave}>Save</button>
                                                        {editeMode ? '' : <button type="button" className="btn btn-primary submit-form ms-2" onClick={handleAddMore}>Add More</button>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div >
    )
}
export default ManagePurchaseRequestDetail