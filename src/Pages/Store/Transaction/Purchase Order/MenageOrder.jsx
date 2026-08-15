import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import OrderForm from './CommanComponent/OrderForm'
import { addPo } from '../../../../Store/Store/MainStore/PurchaseOrder/ManagePO'
import { getVoucherNo } from '../../../../Store/Store/MainStore/PurchaseOrder/GetPR'
import { getPRItems } from '../../../../Store/Store/MainStore/PurchaseOrder/GetPRItems'
import POItemsTable from './CommanComponent/POItemsTable'
import { Pagination } from '../../Table'
import { MultiSelect } from 'primereact/multiselect';

const MenageOrder = () => {
    const navigate = useNavigate()
    const [orderFormData, setOrderFormData] = useState({
        order_date: "",
        party_id: '',
        master_id: "",
        project_id: "",
        voucher_no: ""
    })
    const headers = {
        'Name': 'item_name',
        'Unit': 'unit',
        'QTY': 'quantity',
        'Rate': 'rate',
        "Remarks": 'remarks'
    }
    const [modalOpen, setModalOpen] = useState(false);
    const [entity, setEntity] = useState([]);
    const [voucherNo, setVoucherNo] = useState(null);
    const [rates, setRates] = useState({});
    const [remarks, setRemarks] = useState({});
    const [qty, setQty] = useState({});
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(5);
    const [orderError, setOrderError] = useState({});
    const dispatch = useDispatch();
    const itemDetails = useSelector((state) => state.getVoucher?.data?.data || []);
    const PRItems = useSelector((state) => state.getPrItems?.data?.data || []);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, limit, entity, items]);
      useEffect(() => {
    if (commentsData?.length > 0) {
      const initialRates = {};
      commentsData.forEach((item) => {
        if (item?.item_data?.cost_rate) {
          initialRates[item.detail_id] = item.item_data.cost_rate;
        }
      });
      setRates(initialRates);
    }
  }, [commentsData]);
  
    //get voucher no
    useEffect(() => {
        if (voucherNo?.length > 0) {
            const Payload = {
                "tag_number": 9,
                "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
                "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                "pr_no": voucherNo
            }
            dispatch(getPRItems(Payload));
        }
    }, [dispatch, voucherNo])

    useEffect(() => {
        if (PRItems.length > 0) {
            setEntity(PRItems);
        }
    }, [PRItems]);

    useEffect(() => {
        dispatch(getVoucherNo());
        const Payload = {
            "tag_number": 9,
            "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
            "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
            "pr_no": []
        }
        dispatch(getPRItems(Payload));
    }, []);

    const handleFormChange = (name, value) => {
        setOrderFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleChange = (e) => {
        if (e.target.value === "") {
            setVoucherNo(null)
        } else {
            setVoucherNo(e.target.value)
        }
    }
    const [errors, setErrors] = useState({});
    // const handleRateChange = (id, value) => {
    //     const numericValue = parseFloat(value);
    //     setRates((prevRates) => ({
    //         ...prevRates,
    //         [id]: value,
    //     }));

    //     setErrors((prevErrors) => {
    //         const updatedErrors = { ...prevErrors };

    //         if (numericValue <= 0 || isNaN(numericValue)) {
    //             updatedErrors[id] = { ...updatedErrors[id], rate: "Rate must be greater than zero." };
    //         } else {
    //             if (updatedErrors[id]) delete updatedErrors[id].rate;
    //         }

    //         if (!qty[id] || qty[id] === "") {
    //             updatedErrors[id] = { ...updatedErrors[id], quantity: "Please enter quantity." };
    //         }
    //         return updatedErrors;
    //     });
    // };

    const handleRateChange = (id, value) => {
    setRates((prev) => ({
      ...prev,
      [id]: value,
    }));

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (value === "" || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        updatedErrors[id] = {
          ...updatedErrors[id],
          rate: "Please enter rate.",
        };
      } else if (updatedErrors[id]?.rate) {
        delete updatedErrors[id].rate;
      }

      return updatedErrors;
    });
  };

    const handleRemarksChange = (detailId, value) => {
        setRemarks((prevRemarks) => ({
            ...prevRemarks,
            [detailId]: value,
        }));
    };

    // const handleQtyChange = (id, value) => {
    //     const numericValue = parseFloat(value);
    //     const rowData = commentsData.find((item) => item.detail_id === id);
    //     const prQty = rowData?.quantity || 0;
    //     setQty((prevQty) => ({
    //         ...prevQty,
    //         [id]: value,
    //     }));

    //     setErrors((prevErrors) => {
    //         const updatedErrors = { ...prevErrors };
    //         if (numericValue <= 0 || isNaN(numericValue)) {
    //             updatedErrors[id] = { ...updatedErrors[id], quantity: "Quantity must be greater than zero." };
    //         } else if (numericValue > prQty) {
    //             updatedErrors[id] = { ...updatedErrors[id], quantity: `Is not greater than the PR Qty (${prQty}).` };
    //         } else {
    //             if (updatedErrors[id]) delete updatedErrors[id].quantity;
    //         }
    //         if (!rates[id] || rates[id] === ""  ) {
    //             updatedErrors[id] = { ...updatedErrors[id], rate: "Please enter rate." };
    //         }
    //         return updatedErrors;
    //     });
    // };

const handleQtyChange = (id, value) => {
    const numericValue = parseFloat(value);
    const rowData = commentsData.find((item) => item.detail_id === id);
    const prQty = rowData?.quantity || 0;
    const fallbackRate = rowData?.item_data?.cost_rate ?? "";

    setQty((prevQty) => ({
      ...prevQty,
      [id]: value,
    }));

    // ✅ Auto-fill fallback rate into state if not already there
    setRates((prevRates) => {
      if (!prevRates[id] && fallbackRate !== "") {
        return {
          ...prevRates,
          [id]: fallbackRate,
        };
      }
      return prevRates;
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      // Quantity validation
      if (numericValue <= 0 || isNaN(numericValue)) {
        updatedErrors[id] = {
          ...updatedErrors[id],
          quantity: "Quantity must be greater than zero.",
        };
      } else if (numericValue > prQty) {
        updatedErrors[id] = {
          ...updatedErrors[id],
          quantity: `Is not greater than the PR Qty (${prQty}).`,
        };
      } else if (updatedErrors[id]?.quantity) {
        delete updatedErrors[id].quantity;
      }

      // Rate validation
      const effectiveRate = rates[id] ?? fallbackRate;
      if (effectiveRate === "" || isNaN(parseFloat(effectiveRate))) {
        updatedErrors[id] = {
          ...updatedErrors[id],
          rate: "Please enter rate.",
        };
      } else if (updatedErrors[id]?.rate) {
        delete updatedErrors[id].rate;
      }

      return updatedErrors;
    });
  };


    const handleSave = () => {
        const itemsWithRates = PRItems.filter((item) => rates[item.detail_id]);
        const updatedItems = itemsWithRates.map((item) => ({
            ...item,
            item_id: item?.item_data?._id,
            quantity: qty[item.detail_id],
            rate: rates[item.detail_id],
            remarks: remarks[item.detail_id]
        }));
        setItems((prevItems) => {
            const combinedItems = prevItems.map((existingItem) => {
                const updatedItem = updatedItems.find(
                    (newItem) => newItem.detail_id === existingItem.detail_id
                );
                return updatedItem ? updatedItem : existingItem;
            });
            updatedItems.forEach((newItem) => {
                const exists = combinedItems.some(
                    (existingItem) => existingItem.detail_id === newItem.detail_id
                );
                if (!exists) {
                    combinedItems.push(newItem);
                }
            });
            return combinedItems;
        });
        handleModalClose();
    };
    const handleDelete = (id, name) => {
        Swal.fire({
            title: `Are you sure you want to delete ${name}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then((result) => {
            if (result.isConfirmed) {
                setItems((prevData) => prevData.filter((e, i) => e?.detail_id !== id));
                setRates((prevRates) => {
                    const updatedRates = { ...prevRates };
                    delete updatedRates[id];
                    return updatedRates;
                });
                setQty((prevQty) => {
                    const updatedQty = { ...prevQty };
                    delete updatedQty[id];
                    return updatedQty;
                });
                setRemarks((prevRemarks) => {
                    const updatedQty = { ...prevRemarks };
                    delete updatedQty[id];
                    return updatedQty;
                });
            }
        });
    };

    const handleAddItem = () => {
        setModalOpen(true)
    }
    const handleModalClose = () => {
        setModalOpen(false)
        setVoucherNo(null)
        setErrors({})
    };

    const Ordervalidation = () => {
        let isValid = true;
        let err = {};
        const today = new Date().toISOString().split("T")[0];
        if (!orderFormData?.order_date) {
            isValid = false;
            err['order_date'] = "Please select a date";
        } else if (orderFormData?.order_date > today) {
            isValid = false;
            err['order_date'] = "Invalid order Date";
        }
        if (!orderFormData.party_id) {
            isValid = false;
            err['party_id'] = "Please select a party";
        }
        if (!orderFormData?.master_id) {
            isValid = false;
            err['master_id'] = `Please select PO Creator Name`;
        }
        if (!orderFormData?.project_id) {
            isValid = false;
            err['project_id'] = `Please select project`;
        }
        setOrderError(err);
        return isValid;
    };

    const handleSubmit = () => {
        if (Ordervalidation()) {
            if (items?.length > 0) {
                const payload = {
                    "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
                    "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                    "trans_date": orderFormData?.order_date,
                    "tag_number": 10,
                    "party_id": orderFormData?.party_id,
                    "master_id": orderFormData?.master_id,
                    "project_id": orderFormData?.project_id,
                    "items_details": items,
                }
                dispatch(addPo(payload))
                    .then((res) => {
                        if (res.payload.success === true) {
                            navigate('/main-store/user/order-management')
                        }
                    }).catch((error) => {
                        console.log(error, 'ERROR');
                    })
            } else {
                toast.error('Please add the item details')
            }
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
                                        <Link to="/main-store/user/order-management">
                                            Purchase Order
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {"Add"} Purchase Order
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <OrderForm
                        title={'Purchase Order'}
                        tag_number={10}
                        isEdit={false}
                        orderError={orderError}
                        setOrderError={setOrderError}
                        orderFormData={orderFormData}
                        handleFormChange={handleFormChange}
                        setOrderFormData={setOrderFormData}
                    />
                    <POItemsTable
                        headers={headers}
                        data={items}
                        onAddItem={handleAddItem}
                        onDeleteItem={handleDelete}
                    // onEditItem={handleEdit}
                    />
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal
                        show={modalOpen}
                        backdrop="static"
                        size="xl"
                        keyboard={false}
                        onHide={handleModalClose}
                    // handleClose= {handleModalClose}
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
                                                    <div className="col-6">
                                                        <div className="input-block local-forms">
                                                            <label>
                                                                PR No
                                                            </label>
                                                            <MultiSelect
                                                                className='w-50'
                                                                name="item_id"
                                                                value={voucherNo}
                                                                options={itemDetails?.map((item) => ({
                                                                    label: item.voucher_no,
                                                                    value: item.voucher_no,
                                                                }))}
                                                                onChange={handleChange}
                                                                placeholder="Select PR No."
                                                                maxSelectedLabels={3}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='row'>
                                                    <div className="col-md-12">
                                                        <div className="table-responsive">
                                                            <table className="table border-0 custom-table comman-table mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Sr No.</th>
                                                                        <th>Item Name</th>
                                                                        {/* <th>Rate</th> */}
                                                                        <th>PR No.</th>
                                                                        <th>Category Name</th>
                                                                        <th>Unit</th>
                                                                        <th>Item Brand</th>
                                                                        <th>PR QTY</th>
                                                                        <th>PO QTY</th>
                                                                        <th>Rate</th>
                                                                        <th>Remarks</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                 
                                                                    {commentsData?.map((elem, i) =>
                                                                        <tr key={elem?.detail_id}>
                                                                            <td>{i + 1}</td>
                                                                            <td >{elem?.item_data?.name}</td>
                                                                            {/* <td >{elem?.item_data?.cost_rate}</td> */}
                                                                            <td >{elem?.pr_no}</td>
                                                                            <td >{elem.category_data?.name}</td>
                                                                            <td>{elem?.unit}</td>
                                                                            <td>{elem?.item_brand}</td>
                                                                            <td >{elem.quantity}</td>
                                                                            <td>
                                                                                <input
                                                                                    className='form-control'
                                                                                    type="number"
                                                                                    value={qty[elem.detail_id] || ""}
                                                                                    placeholder="Enter Qty"
                                                                                    onChange={(e) =>
                                                                                        handleQtyChange(elem.detail_id, e.target.value)
                                                                                    }
                                                                                    style={{ width: "100px" }}
                                                                                />
                                                                                {errors[elem.detail_id]?.quantity && (
                                                                                    <div className="text-danger">{errors[elem.detail_id].quantity}</div>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    className='form-control'
                                                                                    type="number"
                                                                                    value={rates[elem.detail_id] ?? elem?.item_data?.cost_rate ?? ""}
                                                                                    placeholder="Enter Rate"
                                                                                    onChange={(e) =>
                                                                                        handleRateChange(elem.detail_id, e.target.value)
                                                                                    }
                                                                                    style={{ width: "100px" }}
                                                                                />
                                                                                {errors[elem.detail_id]?.rate && (
                                                                                    <div className="text-danger">{errors[elem.detail_id].rate}</div>
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    value={remarks[elem.detail_id] || ""}
                                                                                    placeholder="Enter Remarks"
                                                                                    onChange={(e) =>
                                                                                        handleRemarksChange(elem.detail_id, e.target.value)
                                                                                    }
                                                                                    style={{ width: "100px" }}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    )}
                                                                    {commentsData?.length === 0 ? (
                                                                        <tr>
                                                                            <td colspan="999">
                                                                                <div className="no-table-data">
                                                                                    No Data Found!
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ) : null}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="row align-center mt-3 mb-2">
                                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                                                <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                                    aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                                                <div className="dataTables_paginate paging_simple_numbers"
                                                                    id="DataTables_Table_0_paginate">
                                                                    <Pagination
                                                                        total={totalItems}
                                                                        itemsPerPage={limit}
                                                                        currentPage={currentPage}
                                                                        onPageChange={(page) => setCurrentPage(page)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <div className="col-12 text-end">
                                <div className="doctor-submit text-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleSave}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}
export default MenageOrder