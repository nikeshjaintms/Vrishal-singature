import React, { useEffect, useState } from 'react';
import Footer from '../Include/Footer';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getDrawing } from '../../../Store/Erp/Planner/Draw/Draw';
import { AddPacking } from '../../../Store/Erp/Packing/ManagePacking';
import { getReleseNote } from '../../../Store/Erp/ReleseNote/ReleseNote';
import { getPacking } from '../../../Store/Erp/Packing/Packing';
import toast from 'react-hot-toast';
import { PLAN } from '../../../BaseUrl';

const ManagePacking = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { state } = useLocation()
    const { elem, type } = state || ""
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [Errors, setErrors] = useState({});
    const [packingItems, setpackingItems] = useState([])
    const [IRNlist, setIRNlist] = useState([]);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
    const IRNData = useSelector((state) => state?.getReleseNote?.user?.data);
    const [packingDeta, setPackingDeta] = useState({
        draw_id: '',
        irn_id: '',
        remark: '',
        consignment_no: '',
        destination: '',
        truck_no: '',
        driver_name: '',
        gst_no: '',
        eway_bill: ''
    });
    useEffect(() => {
        //SET STATE
        if (state) {
            setPackingDeta({
                draw_id: elem?.drawing_id?._id,
                irn_id: elem?.release_note_id?._id,
                remark: elem?.remarks,
                consignment_no: elem?.consignment_no,
                destination: elem?.destination,
                truck_no: elem?.vehicle_no,
                driver_name: elem?.driver_name,
                gst_no: elem?.gst_no,
                eway_bill: elem?.e_way_bill_no
            })
        }
    }, [packingItems, state, IRNData])
    useEffect(() => {
        //GET APIS
        dispatch(getDrawing());
        dispatch(getReleseNote());
        dispatch(getPacking())
    }, [dispatch]);
    useEffect(() => {
        //EDIT
        if (state) {
            if (elem?.drawing_id?._id === packingDeta?.draw_id) {
                setpackingItems(elem.drawing_id.items)
            }
        }
    }, [packingDeta?.draw_id, packingItems, IRNData])
    useEffect(() => {
        //ADD
        const ITEMSLIST = drawData?.find(e => e?._id === packingDeta?.draw_id)
        setpackingItems(ITEMSLIST?.items || [])
    }, [packingDeta?.draw_id])
    useEffect(() => {
        //IRN LIST
        if (IRNData) {
            const IRNLIST = IRNData.filter(e => e?.drawing_id?._id === packingDeta?.draw_id)
            if (IRNLIST.length > 0) {
                setIRNlist(IRNLIST)
            } else {
                setIRNlist(null)
            }
        }
    }, [IRNData, packingDeta?.draw_id]);

    const drawOption = drawData?.filter((dr) => dr?.project?._id === localStorage.getItem('U_PROJECT_ID')).map(item => ({
        label: `${item.drawing_no} - ${item.rev} - ${item.assembly_no}`,
        value: item._id
    })) || [];

    const IRNOption = IRNlist?.map(item => ({
        label: item.report_no,
        value: item._id
    })) || [];
    const handlePackingData = (e) => {
        const { name, value } = e.target;
        if (name === 'draw_id') {
            setIRNlist(null);
            setPackingDeta({ ...packingDeta, irn_id: '' })
        }
        setPackingDeta((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const resetPackingData = () => {
        setPackingDeta({
            draw_id: '',
            irn_id: '',
            remark: '',
            consignment_no: '',
            destination: '',
            truck_no: '',
            driver_name: '',
            gst_no: '',
            eway_bill: ''
        });
        setErrors({});
    };
    const validation = () => {
        let isValid = true;
        let err = {};

        if (!packingDeta.draw_id) {
            isValid = false;
            err.draw_err = 'Please select draw name';
        }
        if (!packingDeta.irn_id) {
            isValid = false;
            err.irn_err = 'Please select IRN name';
        }
        if (!packingDeta.consignment_no) {
            isValid = false;
            err.consignment_err = 'Please enter consignment no';
        }
        if (!packingDeta.destination) {
            isValid = false;
            err.destination_err = 'Please enter destination';
        }
        if (!packingDeta.truck_no) {
            isValid = false;
            err.truck_no_err = 'Please enter truck no';
        }
        if (!packingDeta.driver_name) {
            isValid = false;
            err.driverName_err = 'Please enter driver name';
        }
        if (!packingDeta.gst_no) {
            isValid = false;
            err.gst_no_err = 'Please enter GST';
        }
        if (!packingDeta.eway_bill) {
            isValid = false;
            err.eway_bill_err = 'Please enter e-way bill';
        }
        setErrors(err);
        return isValid;
    };

    const handlePackingSubmit = () => {
        const isValid = validation();
        if (isValid) {
            const payload = {
                "drawing_id": packingDeta.draw_id,
                "consignment_no": packingDeta.consignment_no,
                "vehicle_no": packingDeta.truck_no,
                "driver_name": packingDeta.driver_name,
                "destination": packingDeta.destination,
                "gst_no": packingDeta.gst_no,
                "e_way_bill_no": packingDeta.eway_bill,
                'release_note_id': packingDeta.irn_id,
                "packed_by": localStorage.getItem('PAY_USER_ID'),
                "id": type === "edit" ? elem?._id : '',
                "project": localStorage.getItem('PAY_USER_PROJECT_NAME'),
                "remarks": packingDeta.remark
            }
            dispatch(AddPacking(payload))
                .then((res) => {
                    if (res.payload.success === true) {
                        navigate('/user/project-store/packing-list')
                        toast.success(res.payload.message)
                    }
                }).catch((error) => {
                    console.log(error, 'ERROR');
                })
            setPackingDeta({
                draw_id: '',
                irn_id: '',
                remark: '',
                consignment_no: '',
                destination: '',
                truck_no: '',
                driver_name: '',
                gst_no: '',
                eway_bill: ''
            });
        }
    };
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />
            <div className="page-wrapper">
                <div className="content">
                    <div className="page-header">
                        <div className="row">
                            <div className="col-sm-12">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/user/project-store/packing-list">Packing List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item">{state?.type === 'edit' ? "Edit" : "Add"} Packing Record</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <form >
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className="col-12">
                                                <div className="form-heading">
                                                    <h4>Add Details</h4>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>Drawing No. - REV - Assembly No.<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={drawOption}
                                                        name='draw_id'
                                                        value={packingDeta.draw_id}
                                                        onChange={handlePackingData}
                                                        disabled={type === "edit"}
                                                        filter className='w-100'
                                                        placeholder="Select Drawing No."
                                                    />
                                                    <div className='error'>{Errors.draw_err}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>IRN No.<span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={IRNOption}
                                                        name='irn_id'
                                                        value={packingDeta.irn_id}
                                                        onChange={handlePackingData}
                                                        filter className='w-100'
                                                        placeholder="Select IRN No."
                                                        disabled={type === "edit"}
                                                    />
                                                    <div className='error'>{Errors.irn_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-12 col-xl-12">
                                                <div className="input-block local-forms">
                                                    <label>Remarks </label>
                                                    <textarea className="form-control"
                                                        name='remark'
                                                        value={packingDeta.remark}
                                                        onChange={handlePackingData} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`row ${packingDeta?.draw_id === "" ? "d-none" : ""}`} style={{ 'minHeight': '160px' }}>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table border-0 custom-table comman-table  mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sr No</th>
                                                        <th>Name</th>
                                                        <th>Item No</th>
                                                        <th>Item Length</th>
                                                        <th>Item Weight</th>
                                                        <th>Item Width</th>
                                                        <th>Item Quantity</th>
                                                        <th>Unit Assembly Weight(KG)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {packingItems?.map((e, i) =>
                                                        <tr key={i}>
                                                            <td>{i + 1}</td>
                                                            <td>{e?.itemName?.name}</td>
                                                            <td>{e.item_no}</td>
                                                            <td>{e.item_length}</td>
                                                            <td>{e.item_weight}</td>
                                                            <td>{e.item_width}</td>
                                                            <td>{e.quantity}</td>
                                                            <td>{e.assembly_weight}</td>
                                                        </tr>
                                                    )}
                                                    {packingItems.length > 0 && (
                                                        <>
                                                            <tr >
                                                                <td colSpan={8} className='text-center'><strong>--</strong></td>
                                                            </tr>
                                                        </>
                                                    )}
                                                    {packingItems.length > 0 && (
                                                        <tr >
                                                            <td colSpan={7} rowspan={3} className='text-center'><strong>Total</strong></td>
                                                            <td className='table-active' rowspan={3}>
                                                                {packingItems.reduce((total, item) => total + (item.assembly_weight || 0), 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {packingItems?.length === 0 ? (
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className="col-12">
                                                <div className="form-heading">
                                                    <h4>Add Details</h4>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Consignment No.<span className="login-danger">*</span></label>
                                                    <input type='text'
                                                        name='consignment_no'
                                                        className='form-control'
                                                        value={packingDeta.consignment_no}
                                                        onChange={handlePackingData} />
                                                    <div className='error'>{Errors.consignment_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Destination.<span className="login-danger">*</span></label>
                                                    <input type='text'
                                                        name='destination'
                                                        className='form-control'
                                                        value={packingDeta.destination}
                                                        onChange={handlePackingData} />
                                                    <div className='error'>{Errors.destination_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Truck No.<span className="login-danger">*</span></label>
                                                    <input type='text'
                                                        name='truck_no'
                                                        className='form-control'
                                                        value={packingDeta.truck_no}
                                                        onChange={handlePackingData} />
                                                    <div className='error'>{Errors.truck_no_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Driver Name & No.<span className="login-danger">*</span></label>
                                                    <input type='text'
                                                        name='driver_name'
                                                        className='form-control'
                                                        value={packingDeta.driver_name}
                                                        onChange={handlePackingData} />
                                                    <div className='error'>{Errors.driverName_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>GSTIN.<span className="login-danger">*</span></label>
                                                    <input type='text' className='form-control'
                                                        name='gst_no'
                                                        value={packingDeta.gst_no}
                                                        onChange={handlePackingData} />
                                                    <div className='error'>{Errors.gst_no_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>E-Way Bill.<span className="login-danger">*</span></label>
                                                    <input type='text' className='form-control'
                                                        name='eway_bill'
                                                        value={packingDeta.eway_bill}
                                                        onChange={handlePackingData} />
                                                    <div className='error'>{Errors.eway_bill_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className="doctor-submit text-end">
                                                <button type="button"
                                                    className="btn btn-primary submit-form me-2"
                                                    onClick={localStorage.getItem("ERP_ROLE") !== PLAN ? () => navigate("/user/project-store/packing-list") : handlePackingSubmit}>{state?.type === 'edit' ? localStorage.getItem("ERP_ROLE") !== PLAN ? "Back" : "Update" : "Submit"}</button>
                                                <button type="button"
                                                    className={`btn btn-primary cancel-form  ${state?.type === "edit" ? "d-none" : "d-blok"}`}
                                                    onClick={resetPackingData}
                                                >Reset</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>
        </div >
    );
};

export default ManagePacking;
