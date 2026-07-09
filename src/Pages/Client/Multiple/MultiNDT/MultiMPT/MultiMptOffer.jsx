import React, { useEffect, useMemo, useState } from 'react'
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

const MultiMptOffer = () => {

    const dispatch = useDispatch();
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
        dispatch(getUserNdtMaster({ status: true })).then((response) => {
            const ndtData = response.payload?.data;
            const findNdt = ndtData?.find((nt) => nt?.name === 'MPT');
            if (findNdt && disable) {
                dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
                setDisable(false);
            }
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [disable]);

    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        computedComments = computedComments?.filter((mpt) => mpt.status === 1);
        if (search) {
            computedComments = computedComments.filter(
                (mpt) =>
                    mpt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleAddToIssueArr = (elem) => {
        setTableObj(elem);
        setModalOpen(true);
    }

    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

    const handleSubmit = () => {
        if (submitArr?.length === 0) {
            toast.error('Please atleast cover a items before submitting');
            return;
        }

        const filterArray = submitArr?.map((e) => ({
            grid_item_id: e?.grid_item_id?._id,
            drawing_id: e?.grid_item_id?.drawing_id?._id,
            is_cover: e?.is_cover === true ? true : false,
            joint_type: e?.joint_type?.map((e) => e?._id),
            ndt_master_id: e?.ndt_master_id,
            ndt_type_id: e?.ndt_type_id,
            remarks: e?.remarks || '',
            offer_used_grid_qty: e?.offer_used_grid_qty,
            mpt_balance_qty: e?.mpt_balance_qty || 0,
            mpt_use_qty: e?.mpt_use_qty,
            thickness: e?.thickness,
            weldor_no: e?.weldor_no?._id,
            wps_no: e?.wps_no?._id,
            offer_main_id: e?.offer_main_id,
            deleted: false,
        }));

        setLoading(true);
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
        bodyFormData.append('items', JSON.stringify(filterArray));
        dispatch(manageRTMultiOffer({ bodyFormData })).then((response) => {
            const { data, success, message } = response?.payload;
            if (success) {
                toast.success(message);
                dispatch(getMultiMPTOfferTable());
                setSubmitArr([]);
                handleRefresh();
                localStorage.removeItem('MPT_TYPE_MASTER_IDS');
                localStorage.removeItem('MPT_TYPE_ID');
            }
        }).catch((error) => {
            console.log(error, 'Error submitting')
        }).finally(() => {
            setLoading(false);
        })
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
                    <NdtOfferHeader name={'Magnetic Particle Testing Test Offer List'} />

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

                    <MptOfferTable setSubmitArr={setSubmitArr} />

                    <SubmitButton
                        disable={loading}
                        handleSubmit={handleSubmit}
                        link={'/user/project-store/mpt-offer-management'}
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