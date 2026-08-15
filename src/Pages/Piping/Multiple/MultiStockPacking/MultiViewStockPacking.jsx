import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PackingTable from './CommanComponents/StockPackingTable';
import PackingForm from './CommanComponents/StockPackingForm';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import Footer from '../../Include/Footer';


const MultiViewPacking = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const data = location.state;
    const { state } = useLocation()
    const { elem, type } = state || ""
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [Errors, setErrors] = useState({});
    const [submitArr, setSubmitArr] = useState([]);
    const [packingItems, setpackingItems] = useState([])

    const [packingData, setPackingData] = useState({
        draw_id: '',
        irn_id: '',
        remark: '',
        consignment_no: '',
        physical_weight: '',
        destination: '',
        truck_no: '',
        driver_name: '',
        gst_no: '',
        eway_bill: '',
        dispatch_date:'',
    });
    useEffect(() => {
        //SET STATE
        if (state) {
            setPackingData({
                draw_id: elem?.drawing_id?._id,
                irn_id: elem?.release_note_id?._id,
                remark: elem?.remarks,
                consignment_no: elem?.consignment_no,
                physical_weight: elem?.physical_weight,
                destination: elem?.destination,
                truck_no: elem?.vehicle_no,
                driver_name: elem?.driver_name,
                gst_no: elem?.gst_no,
                eway_bill: elem?.e_way_bill_no,
                dispatch_date: elem?.dispatch_date,
            })
        }
    }, [packingItems, state])

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
                                    <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item"><Link to="/piping/user/stock-packing-list">Stock Packing List</Link></li>
                                    <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                                    <li className="breadcrumb-item">{state?.type === 'edit' ? "Edit" : "View"} Stock Packing Record</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <PackingTable
                        is_view={true}
                        setSubmitArr={setSubmitArr}
                        data={elem}
                    />

                    <PackingForm
                        packingData={packingData}
                        setPackingData={setPackingData}
                        Errors={Errors}
                        is_view={true}
                    />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12 text-end">
                                        <div className="doctor-submit text-end ">
                                            <button type="button" className="btn btn-primary submit-form me-2"
                                                onClick={() => navigate('/piping/user/stock-packing-list')}>Back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div >
    );
};
export default MultiViewPacking;

