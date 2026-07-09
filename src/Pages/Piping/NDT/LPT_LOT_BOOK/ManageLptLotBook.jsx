import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { PdfDownloadErp } from '../../../../Components/ErpPdf/PdfDownloadErp';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import NdtOfferHeader from '../../../../Components/NDT/NdtOfferHeader';
import toast from 'react-hot-toast';
// import { manageLPTMultiOffer } from '../../../../Store/MutipleDrawing/MultiNDT/LptClearance/ManageLPTMultiOffer';
// import { getMultiLPTOfferTable } from '../../../../Store/MutipleDrawing/MultiNDT/LptClearance/LptOfferTable';
import { getLptLotNdtDataFromWeldVisualPiping } from '../../../../Store/Piping/Ndt/LPT-LOT-OFFER/getLptLotNdtDataFromWeldVisual';
import { fetchLPTLotOfferData } from '../../../../Store/Piping/Ndt/LPT-LOT-OFFER/LpttLotOfferData';
import { getNdtContractor } from '../../../../Store/Piping/NdtContractor/NdtContractor';
import LPTLotBookItemsList from '../../Multiple/MultiNDT/LPTLotBook/LPTLotBookItemsList';
import LPTLotBookOfferTable from '../../Multiple/MultiNDT/LPTLotBook/LPTLotBookOfferTable';
import SubmitButton from '../../Multiple/Components/SubmitButton/SubmitButton';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { V_URL } from '../../../../BaseUrl';


const ManageLptLotBook = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const data = location.state?.data;
    const is_view = location.state?.is_view;
    const is_edit = location.state?.is_edit;

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitArr, setSubmitArr] = useState([]);
    const [showBtn, setShowBtn] = useState(false);
    const [tableObj, setTableObj] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [lptType, setLptType] = useState("LPT");


    useEffect(() => {
        dispatch(getLptLotNdtDataFromWeldVisualPiping({
            page: currentPage,
            limit,
            search,
            project_id: localStorage.getItem('U_PROJECT_ID')
        }));
        if (lptType === "LPT") {
            dispatch(fetchLPTLotOfferData({
                project_id: localStorage.getItem('U_PROJECT_ID')
            }));
        }
        dispatch(getNdtContractor({ project: localStorage.getItem('U_PROJECT_ID'), status: true }));

        // if (data?._id) {
        //     setSubmitArr(data?.items || []);
        // }
        if (data?._id) {
    const updatedItems = (data?.items || []).map(item => ({
        ...item,
        is_ready_to_submit: true   // ✅ FORCE FLAG
    }));

    setSubmitArr(updatedItems);
}
    }, [currentPage, limit, search, lptType, data]);

    const entity = useSelector((state) => state.getLptLotNdtDataFromWeldVisualPiping?.user?.data?.data);
    const pagination = useSelector((state) => state.getLptLotNdtDataFromWeldVisualPiping?.user?.data?.pagination);
    const lptOffers = useSelector((state) => state.fetchLPTLotOfferData?.offers);

    console.log("LPT Offers Data: ", lptOffers);

    const commentsData = entity || [];



    useEffect(() => {
        if (pagination?.totalItems) {
            setTotalItems(pagination.totalItems);
        }
    }, [pagination]);
    // const handleAddToIssueArr = (elem) => {
    //     setTableObj(elem);
    //     setModalOpen(true);
    // }
    const handleAddToIssueArr = (elem) => {
        console.log(elem, 'elem')
        const payload = {
            project: localStorage.getItem('U_PROJECT_ID'),
            offer_date: new Date(),
            offered_by: localStorage.getItem('PAY_USER_ID'),
            items: [{
                drawing_id: elem.drawing_id,
                spool_id: elem.spool_no_id,
                joint_id: elem.joint_id,
                weld_visual_id: elem.weld_visual_id,
                weld_visual_item_id: elem.weld_visual_item_id,
                ndt_percentage: elem.ndt_percentages.id,
                weld_visual_report_no: elem.weld_visual_report_no,
                welder_id: elem.welder_no,
            }],
            status: 1
        };

        setLoading(true);
        axios.post(`${V_URL}/user/piping/add-to-lpt-lot`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            console.log("res-========>", res);
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(getLptLotNdtDataFromWeldVisualPiping({
                    page: currentPage,
                    limit,
                    search,
                    project_id: localStorage.getItem('U_PROJECT_ID')
                }));
                dispatch(fetchLPTLotOfferData({
                    project_id: localStorage.getItem('U_PROJECT_ID')
                }));
                const submitItem = {
                    ...payload.items[0],
                    offer_main_id: res.data.data._id,
                };

                setSubmitArr(prev => [...prev, submitItem]);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error(err.response?.data?.message || "Error adding LPT Offer");
        }).finally(() => setLoading(false));
    }


    const handleRemoveOffer = (payload) => {
        if (!payload.offer_id) return;
        setLoading(true);
        axios.post(`${V_URL}/user/piping/delete-lpt-lot-offer`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                const project_id = localStorage.getItem('U_PROJECT_ID');

                dispatch(getLptLotNdtDataFromWeldVisualPiping({ page: currentPage, limit, search, project_id }));
                dispatch(fetchLPTLotOfferData({ project_id }));

                if (payload.is_lot) {
                    setSubmitArr(prev => prev.filter(item => item._id !== payload.offer_id));
                }

                setSubmitArr(prev => prev.filter(item => item.offer_main_id !== payload.offer_id));
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting LPT Offer");
        }).finally(() => setLoading(false));
    }


    const handleShowList = () => {
        setShowBtn(!showBtn);
    }
    console.log(submitArr, 'submitArr')

    const handleSubmit = () => {
        if (submitArr?.length === 0) {
            toast.error('Please atleast cover a items before submitting');
            return;
        }

        console.log(submitArr, 'submitArr before filter')
        const filterArray = submitArr?.filter(e => e.is_ready_to_submit === true).map((e) => ({
            drawing_id: e?.drawing_id?._id || e?.drawing_id,
            is_cover: e?.is_cover === true ? true : false,
            remarks: e?.remarks || "",
            joint_id: e?.joint_id,
            spool_id: e?.spool_id,
            weld_visual_id: e?.weld_visual_id,
            weld_visual_item_id: e?.weld_visual_item_id,
            ndt_percentage: e?.ndt_percentage ?? e.ndt_percentage_id,
            weld_visual_report_no: e?.weld_visual_report_no ?? e?.report_no,
            welder_no: e?.welder_id,
            deleted: false,
        }));
        console.log(filterArray, 'filterArray before submit')
        setLoading(true);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('items', JSON.stringify(filterArray));

        if (data?._id) {
            bodyFormData.append('id', data?._id);
        }

        console.log(bodyFormData.toString(), 'bodyFormData') // Log the URLSearchParams string

        axios.post(
            `${V_URL}/user/piping/manage-lpt-lot`,
            bodyFormData, // ✅ send directly
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN'),
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
            .then((response) => {
                const { data, success, message } = response?.data;
                if (success) {
                    toast.success(message);
                    dispatch(getLptLotNdtDataFromWeldVisualPiping({
                        page: currentPage,
                        limit,
                        search,
                        project_id: localStorage.getItem('U_PROJECT_ID')
                    }));
                    dispatch(fetchLPTLotOfferData({
                        project_id: localStorage.getItem('U_PROJECT_ID')
                    }));
                    setSubmitArr([]);
                    handleRefresh();
                    localStorage.removeItem('LPT_TYPE_MASTER_IDS');
                    localStorage.removeItem('LPT_TYPE_ID');
                    navigate("/piping/user/lpt-lot-book-management");
                }
            }).catch((error) => {
                console.log(error, 'Error submitting')
            }).finally(() => {
                setLoading(false);
            });
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

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
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/dashboard">Dashboard </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link to="/piping/user/lpt-lot-book-management">
                                            Lpt Lot Book
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {is_view ? 'View' : data?._id ? 'Edit' : 'Manage'} LPT Lot Book
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* <NdtOfferHeader   mainPage ={''} name={'LPT LOT BOOK'} /> */}
                    {/* <NdtOfferHeader mainPage="/piping/user/rt-lot-book-management" name="Add LPT LOT BOOK" /> */}

                    {!is_view &&
                        <LPTLotBookItemsList
                            name={'LPT LOT BOOK'}
                            commentsData={commentsData}
                            limit={limit}
                            setlimit={setlimit}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalItems={totalItems}
                            setSearch={setSearch}
                            handleRefresh={handleRefresh}
                            handleAddToIssueArr={handleAddToIssueArr}
                            showBtn={showBtn}
                            handleShowList={handleShowList}
                        />
                    }

                    <LPTLotBookOfferTable
                        setSubmitArr={setSubmitArr}
                        submitArr={submitArr} // ✅ ADDED
                        lptOffers={lptOffers}
                        handleRemoveOffer={handleRemoveOffer}
                        is_view={is_view}
                        is_edit={is_edit}
                    />

                    {!is_view &&
                        <SubmitButton
                            disable={loading}
                            handleSubmit={handleSubmit}
                            link={'/piping/user/lpt-lot-book-management'}
                            buttonName={is_edit ? 'Update LPT Lot Book' : 'Generate LPT Lot Book'}
                        />
                    }
                    {/* {showBtn && <LptCompletedList />} */}
                </div>
            </div>
            {/* <LptItemModal
                title={'Add Liquid Penetrant Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            /> */}
        </div>
    )
}

export default ManageLptLotBook