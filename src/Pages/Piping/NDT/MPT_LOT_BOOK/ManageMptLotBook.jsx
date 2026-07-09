import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import toast from 'react-hot-toast';
import MPTLotBookItemsList from '../../Multiple/MultiNDT/MPTLotBook/MPTLotBookItemsList';
import MPTLotBookOfferTable from '../../Multiple/MultiNDT/MPTLotBook/MPTLotBookOfferTable';
import SubmitButton from '../../Multiple/Components/SubmitButton/SubmitButton';
import { Link } from 'react-router-dom';
import { NDTOfferData } from "../../../../Store/Piping/Ndt/NDTOFFERDATA/NdtOfferData";
import { fetchMPTLotOfferData } from '../../../../Store/Piping/Ndt/MPT-LOT-OFFER/MptLotOfferData';
import { getNdtContractor } from '../../../../Store/Piping/NdtContractor/NdtContractor';
import axios from 'axios';
import { V_URL } from '../../../../BaseUrl';
import { useLocation, useNavigate } from 'react-router-dom';


const ManageMptLotBook = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const data = location.state?.data;
    const is_view = location.state?.is_view;
    const is_edit = location.state?.is_edit;
    const navigate = useNavigate();

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


    useEffect(() => {
        dispatch(NDTOfferData({
            project_id: localStorage.getItem('U_PROJECT_ID')
        }));
        dispatch(fetchMPTLotOfferData({
            project_id: localStorage.getItem('U_PROJECT_ID')
        }));
        dispatch(getNdtContractor({ project: localStorage.getItem('U_PROJECT_ID'), status: true }));

        if (data?._id) {
            setSubmitArr(data?.items || []);
        }
    }, [disable, data]);

    const entity = useSelector((state) => state.NDTOfferData?.user?.data);
    const mptOffers = useSelector((state) => state.fetchMPTLotOfferData?.offers);


    const commentsData = useMemo(() => {
        let computedComments = entity;
        computedComments = computedComments?.filter((item) => {
            const ndt = item?.ndt_required;

            // MPL (MPT) must be required
            if (!ndt?.MPL) return false;

            // MPL must NOT be generated yet
            if (item?.is_mpt_generated) return false;

            // If RT is required → RT must be generated
            if (ndt?.RT && !item?.is_rt_generated) return false;

            // If BSRT is required → BSRT must be generated
            if (ndt?.BSRRT && !item?.is_bsrt_generated) return false;

            // If Ferrite is required → Ferrite must be generated
            if (ndt?.Ferrite && !item?.is_generated_ft) return false;

            // If PWHT is required → PWHT must be generated
            if (ndt?.PWHT && !item?.is_generated_pwht) return false;

            // If ASRT is required → ASRT must be g enerated
            if (ndt?.ASRRT && !item?.is_asrt_generated) return false;

            // MPT LOT must NOT be generated
            if (item?.is_generated_mpt_lot) return false;

            // Hide if MPT LOT already added
            if (item?.is_added_mpt_lot) return false;

            return true;
        });
        if (search) {
            computedComments = computedComments.filter(
                (lpt) =>
                    lpt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    lpt.lot_number?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    lpt.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    lpt.spool_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length || 0);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

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
                weld_visual_report_no: elem.report_no,
                welder_id: elem.welder_no_id ?? elem.welder_no ?? null,
            }],
            status: 1
        };

        setLoading(true);
        axios.post(`${V_URL}/user/piping/add-to-mpt-lot`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            console.log("res-========>", res);
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(NDTOfferData({
                    project_id: localStorage.getItem('U_PROJECT_ID')
                }));
                dispatch(fetchMPTLotOfferData({
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
            toast.error(err.response?.data?.message || "Error adding MPT Offer");
        }).finally(() => setLoading(false));
    }


    const handleRemoveOffer = (payload) => {
        if (!payload.offer_id) return;
        setLoading(true);
        axios.post(`${V_URL}/user/piping/delete-mpt-lot-offer`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                const project_id = localStorage.getItem('U_PROJECT_ID');
                dispatch(NDTOfferData({ project_id }));
                dispatch(fetchMPTLotOfferData({ project_id }));

                if (payload.is_lot) {
                    setSubmitArr(prev => prev.filter(item => item._id !== payload.offer_id));
                }

                setSubmitArr(prev => prev.filter(item => item.offer_main_id !== payload.offer_id));
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting MPT Offer");
        }).finally(() => setLoading(false));
    }


    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

    const handleSubmit = () => {
        if (submitArr?.length === 0) {
            toast.error('Please atleast cover a items before submitting');
            return;
        }

        const filterArray = submitArr?.filter(e => e.is_ready_to_submit === true).map((e) => ({
            drawing_id: e?.drawing_id?._id || e?.drawing_id,
            is_cover: e?.is_cover === true ? true : false,
            joint_id: e?.joint_id,
            spool_id: e?.spool_id,
            weld_visual_id: e?.weld_visual_id,
            weld_visual_item_id: e?.weld_visual_item_id,
            ndt_percentage: e?.ndt_percentage ?? e.ndt_percentage_id,
            weld_visual_report_no: e?.weld_visual_report_no ?? e?.report_no,
            welder_no: e?.welder_id,
            deleted: false,
        }));

        setLoading(true);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
        bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
        bodyFormData.append('items', JSON.stringify(filterArray));

        if (data?._id) {
            bodyFormData.append('id', data?._id);
        }

        axios.post(
            `${V_URL}/user/piping/manage-mpt-lot`,
            bodyFormData,
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
                    dispatch(NDTOfferData({
                        project_id: localStorage.getItem('U_PROJECT_ID')
                    }));
                    dispatch(fetchMPTLotOfferData({
                        project_id: localStorage.getItem('U_PROJECT_ID')
                    }));
                    setSubmitArr([]);
                    handleRefresh();
                    navigate('/piping/user/mpt-lot-book-management');
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
                                        <Link to="/piping/user/mpt-lot-book-management">
                                            MPT Lot Book
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <i className="feather-chevron-right"></i>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        {is_view ? 'View' : data?._id ? 'Edit' : 'Manage'} MPT Lot Book
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {!is_view &&
                        <MPTLotBookItemsList
                            name={'MPT LOT BOOK'}
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

                    <MPTLotBookOfferTable
                        setSubmitArr={setSubmitArr}
                        submitArr={submitArr} // ✅ ADDED
                        mptOffers={mptOffers}
                        handleRemoveOffer={handleRemoveOffer}
                        is_view={is_view}
                        is_edit={is_edit}
                    />

                    {!is_view &&
                        <SubmitButton
                            disable={loading}
                            handleSubmit={handleSubmit}
                            link={'/piping/user/mpt-lot-book-management'}
                            buttonName={is_edit ? 'Update MPT Lot Book' : 'Generate MPT Lot Book'}
                        />
                    }
                    {/* {showBtn && <RtCompletedList />} */}
                </div>
            </div>
            {/* <RtItemModal
                title={'Add Liquid Penetrant Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            /> */}
        </div>
    )
}

export default ManageMptLotBook