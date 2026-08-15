import React, { useEffect, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import OrderForm from './Comman-Components/OrderForm'
import ItemsTable from './Comman-Components/ItemsTable'
import { addPR } from '../../../../Store/Store/MainStore/PurchaseReturn/ManagePR'
import { getPRItems } from '../../../../Store/Store/MainStore/PurchaseReturn/GetPRItems'
import moment from 'moment'
import { getTransport } from '../../../../Store/Store/StoreMaster/Transport/Transport'
import { getAdminTransport } from '../../../../Store/Store/StoreMaster/Transport/AdminTransport'
const ManagePurchaseReturn = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data, setData] = useState([]);
    const [formError, setFormError] = useState({})
    const [formData, setFormData] = useState({
        trans_date: '',
        bill_no: '',
        po_no: "",
        party_id: '',
        project_id: '',
        master_id: '',
        upload_pdf: '',
        transport_id: '',
        driver_name: '',
        vehical_no: '',
        challan_no: '',
        transport_date: '',
        receive_date: '',
        lr_no: '',
        lr_date: '',
        payment_date: '',
        payment_days: 0,
        getpass: ""
    });
    useEffect(() => {
        dispatch(getAdminTransport({ is_main: true }))
    }, [])
    const transport = useSelector((state) => state.getTransport?.user?.data || []);
    const prItems = useSelector((state) => state.getPRItems?.data?.data || []);

    useEffect(() => {
        if (formData?.party_id && formData?.bill_no || formData?.challan_no) {
            dispatch(getPRItems({ party_id: formData?.party_id, bill_no: formData?.bill_no, challan_no: formData?.challan_no }));
        }
    }, [formData?.party_id && formData?.bill_no || formData?.challan_no]);

    useEffect(() => {
        if (prItems && formData?.party_id && formData?.bill_no || formData?.challan_no) {
            setFormData((prev) => ({
                ...prev,
                po_no: prItems?.po_no,
                upload_pdf: prItems?.pdf,
                lr_date: prItems?.lr_date === null ? "" : moment(prItems?.lr_date).format('YYYY-MM-DD'),
                payment_date: prItems?.payment_date === null ? "" : moment(prItems?.payment_date).format('YYYY-MM-DD'),
                lr_no: prItems?.lr_no,
                payment_days: prItems?.payment_days,
                project_id: prItems?.project_data?._id,
            }));
        }
    }, [formData?.party_id && formData?.bill_no || formData?.challan_no, prItems]);

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const formValidation = () => {
        const selectedTransport = transport?.find((item) => item?._id === formData?.transport_id);
        let isvalide = true
        let err = {}

        if (!formData?.party_id) {
            isvalide = false
            err['party_id'] = "please select party name"
        }
        if (!formData?.project_id) {
            isvalide = false
            err['project_id'] = "please select project name"
        }
        if (!formData?.trans_date) {
            isvalide = false
            err['trans_date'] = "please select transaction date"
        }
        if (!formData?.master_id) {
            isvalide = false
            err['master_id'] = "please select master name"
        }
        if (!formData?.transport_id) {
            isvalide = false
            err['transport_id'] = "please select transport name"
        }
        if (!formData?.upload_pdf) {
            isvalide = false
            err['upload_pdf'] = "please upload pdf"
        }
        if (selectedTransport?.name === "Third Party" && !formData?.driver_name) {
            isvalide = false
            err['driver_name'] = "please Enter driver name"
        }
        if (!formData?.bill_no && !formData?.challan_no) {
            isvalide = false;
            toast.error("Either Bill number or Challan number is required");
            // err["bill_or_challan"] = "Please provide either bill number or challan number";
        }
        setFormError(err)
        return isvalide
    }

    const handleSubmit = () => {
        const Po_Number = data.map((item) => item.po_no).filter((e, i, a) => a.indexOf(e) === i).flat()

        if (formValidation()) {
            if (data?.length > 0 && data?.filter((e) => e?.is_add === true).length > 0) {
                const payload = {
                    "firm_id": localStorage.getItem('PAY_USER_FIRM_ID'),
                    "year_id": localStorage.getItem('PAY_USER_YEAR_ID'),
                    "trans_date": formData?.trans_date === "" ? null : formData?.trans_date,
                    "bill_no": formData?.bill_no === "" ? null : formData?.bill_no,
                    "party_id": formData?.party_id === "" ? null : formData?.party_id,
                    "project_id": formData?.project_id === "" ? null : formData?.project_id,
                    "master_id": formData?.master_id === "" ? null : formData?.master_id,
                    "pdf": formData?.upload_pdf,
                    "transport_id": formData?.transport_id === "" ? null : formData?.transport_id,
                    "vehical_no": formData?.vehical_no === "" ? null : formData?.vehical_no,
                    "po_no": Po_Number,
                    "challan_no": formData?.challan_no === "" ? null : formData?.challan_no,
                    "transport_date": formData?.transport_date === "" ? null : formData?.transport_date,
                    "receive_date": formData?.receive_date === "" ? null : formData?.receive_date,
                    "lr_no": formData?.lr_no === "" ? null : formData?.lr_no,
                    "lr_date": formData?.lr_date === "" ? null : formData?.lr_date,
                    "payment_date": formData?.payment_date === "" ? null : formData?.payment_date,
                    "payment_days": formData?.payment_days === "" ? 0 : formData?.payment_days,
                    "tag_number": 12,
                    "driver_name": formData?.driver_name === "" ? null : formData?.driver_name,
                    "items_details": data?.filter((e) => e?.is_add === true)
                }
                dispatch(addPR(payload))
                    .then((res) => {
                        if (res.payload.success === true) {
                            navigate('/main-store/user/purchase-return-management')
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
                                        <Link to="/main-store/user/purchase-return-management">
                                            Purchase Return
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {"Add"} Purchase Return
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <OrderForm
                        title={'Purchase Return'}
                        dropdown_name={'Receiver Name'}
                        formData={formData}
                        setFormData={setFormData}
                        handleFormChange={handleFormChange}
                        formError={formError}
                        setFormError={setFormError}
                        prItems={prItems}
                    />
                    <ItemsTable
                        formData={formData}
                        data={data}
                        setData={setData}
                        prItems={prItems}
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
                </div>
            </div>
        </div>
    )
}

export default ManagePurchaseReturn