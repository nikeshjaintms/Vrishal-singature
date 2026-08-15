import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import MptOfferTable from './components/MptOfferTable';
import toast from 'react-hot-toast';
import { manageRTMultiOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer';
import MptItemsList from './components/MptItemsList';
import { getMultiMPTOfferTable } from '../../../../../Store/MutipleDrawing/MultiNDT/MptClearance/MptOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import MptOfferCompletedList from './components/MptOfferCompletedList';
import MptItemModal from './components/MptItemModal';
import { NDTOfferData } from "../../../../../Store/Piping/Ndt/NDTOFFERDATA/NdtOfferData";
import axios from 'axios';
import Swal from 'sweetalert2';
import { V_URL } from '../../../../../BaseUrl';
import { fetchMPTOfferData } from '../../../../../Store/Piping/Ndt/MPT-OFFER/MPTOfferData';
// import { getMultiMptClearancepiping } from '../../../../../Store/Piping/Ndt/MPT-CLEARANCE/mptClearance';

const MultiMptOffer = () => {

    const dispatch = useDispatch();
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

    const entity = useSelector((state) => state.NDTOfferData?.user?.data);
    const mptOffers = useSelector((state) => state.fetchMPTOfferData.offers);

    useEffect(() => {
        dispatch(NDTOfferData({
            project_id: localStorage.getItem('U_PROJECT_ID')
        }));
        dispatch(fetchMPTOfferData({
            project_id: localStorage.getItem('U_PROJECT_ID')
        }));
    }, [dispatch]);

    const isYes = (v) => v === true || v === "Yes";

    const commentsData = useMemo(() => {
        let computedComments = entity || [];

        // Filter based on MPT requirements and sequential NDT prerequisites
        computedComments = computedComments.filter((mpt) => {
            const ndt = mpt?.ndt_required;

            // Basic MPT requirements
            if (!(isYes(ndt?.MPL) &&
                (mpt?.is_added_mpt === false || mpt?.is_added_mpt === undefined) &&
                mpt?.is_generated_mpt_lot === true)) {
                return false;
            }

            // ================= PREREQUISITES =================
            // 1. If BSRRT required -> must be generated
            if (isYes(ndt?.BSRRT) && !mpt?.is_bsrt_generated) return false;

            // 2. If Ferrite required -> must be generated
            if (isYes(ndt?.Ferrite) && !mpt?.is_generated_ft) return false;

            // 3. If PWHT required -> must be generated
            if (isYes(ndt?.PWHT) && !mpt?.is_generated_pwht) return false;

            // 4. If ASRRT required -> must be generated
            if (isYes(ndt?.ASRRT) && !mpt?.is_asrt_generated) return false;

            // 5. If RT required -> must be generated
            if (isYes(ndt?.RT) && !mpt?.is_rt_generated) return false;
            
            if (mpt?.is_MPT_covered !== true) return false;

            return true;
        });

        if (search) {
            computedComments = computedComments.filter(
                (mpt) =>
                    mpt?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    mpt?.joint_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    // const handleAddToIssueArr = (elem) => {
    //     setTableObj(elem);
    //     setModalOpen(true);
    // }
    const handleAddToIssueArr = (elem) => {
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
                mpt_lot_id: elem.mpt_lot_id,
                mpt_lot_item_id: elem.mpt_lot_item_id,
            }],
            status: 1
        };

        setLoading(true);
        const response = axios.post(`${V_URL}/user/piping/add-mpt-test-offer`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        })
            .then(response => {
                if (response.data.success) {
                    toast.success(response.data.message);
                    dispatch(NDTOfferData({
                        project_id: localStorage.getItem('U_PROJECT_ID')
                    }));
                    dispatch(fetchMPTOfferData({
                        project_id: localStorage.getItem('U_PROJECT_ID')
                    }));

                    setSubmitArr(prev => [...prev, ...payload.items]);
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                console.error(err);
                // toast.error(err.response?.data?.message || "Error adding MPT Offer");
            }).finally(() => setLoading(false));
    };

    const handleRemoveOffer = (elem) => {
        if (!elem) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axios.post(`${V_URL}/user/piping/delete-mpt-test-offer`, { offer_id: elem._id }, {
                    headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
                }).then(res => {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        const project_id = localStorage.getItem('U_PROJECT_ID');
                        dispatch(NDTOfferData({ project_id }));
                        dispatch(fetchMPTOfferData({ project_id }));
                        setSubmitArr((prev) => prev.filter((item) => item.mpt_lot_item_id !== elem.mpt_lot_item_id));
                    } else {
                        toast.error(res.data.message);
                    }
                }).catch(err => {
                    // console.error(err);
                    toast.error(err.response?.data?.message || "Error deleting MPT Offer");
                }).finally(() => setLoading(false));
            }
        })
    }


    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

    console.log(submitArr, "submitArr");
    const handleSubmit = () => {

        if (!submitArr || submitArr.length === 0) {
            toast.error("Please select at least one item");
            return;
        }

        console.log(submitArr, "submitArr");
        const finalItems = submitArr.map(item => ({
            drawing_id: item?.drawing_id || item?.grid_item_id?.drawing_id?._id,
            spool_id: item?.spool_id || item?.spool_no_id,
            joint_id: item?.joint_id,
            weld_visual_id: item?.weld_visual_id,
            weld_visual_item_id: item?.weld_visual_item_id,
            mpt_lot_id: item.mpt_lot_id,
            mpt_lot_item_id: item.mpt_lot_item_id,
            remarks: item?.remarks,
        }));

        console.log(finalItems, "finalItems");

        const payload = {
            project_id: localStorage.getItem("U_PROJECT_ID"),
            project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
            items: finalItems,
            offered_by: localStorage.getItem("PAY_USER_ID"),
        };

        setLoading(true);

        axios.post(
            `${V_URL}/user/piping/manage-mpt-generate-offer`,
            payload,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
                }
            }
        )
            .then(res => {

                if (res.data.success) {

                    toast.success(res.data.message);

                    // 🔄 Refresh Lists
                    dispatch(fetchMPTOfferData({
                        project_id: localStorage.getItem("U_PROJECT_ID")
                    }));

                    dispatch(NDTOfferData({
                        project_id: localStorage.getItem("U_PROJECT_ID")
                    }));

                    // 🧹 Clear UI State
                    setSubmitArr([]);
                    setShowBtn(false);
                    // navigate('/piping/user/mpt-offer-management');

                } else {
                    toast.error(res.data.message);
                }

            })
            .catch(err => {
                console.error(err);
                toast.error(err.response?.data?.message || "Offer generation failed");
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
                    <NdtOfferHeader name={'Magnetic Particle Testing Test Offer List'} isPiping={true} />

                    <MptItemsList
                        name={'Magnetic Particle Test Offer List'}
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

                    <MptOfferTable
                        setSubmitArr={setSubmitArr}
                        mptOffers={mptOffers}
                        handleRemoveOffer={handleRemoveOffer}
                    />

                    <SubmitButton
                        disable={loading}
                        handleSubmit={handleSubmit}
                        link={'/piping/user/mpt-offer-management'}
                        buttonName={'Generate MPT Offer'}
                    />

                    {showBtn && <MptOfferCompletedList />}
                </div>
            </div>

            <MptItemModal
                title={'Add Magnetic Particle Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            />
        </div>
    )
}

export default MultiMptOffer