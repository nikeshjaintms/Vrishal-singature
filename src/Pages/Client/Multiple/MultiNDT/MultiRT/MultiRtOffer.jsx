import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import RtItemList from './components/RtItemList';
import RtItemModal from './components/RtItemModal';
import RTOfferCompletedList from './components/RTOfferCompletedList';
import RTOfferTable from './components/RTOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { manageRTMultiOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer';
import { getMultiRtOfferTable } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable';


const MultiRtOffer = () => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitArr, setSubmitArr] = useState([]);
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        dispatch(getUserNdtMaster({ status: true })).then((response) => {
            const ndtData = response.payload?.data;
            const findNdt = ndtData?.find((nt) => nt?.name === 'RT');
            if (findNdt && disable) {
                dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
                setDisable(false);
            }
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [disable]);

    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        computedComments = computedComments?.filter((rt) => rt.status === 1);
        if (search) {
            computedComments = computedComments.filter(
                (rt) =>
                    rt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    rt.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const [tableObj, setTableObj] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const handleAddToIssueArr = (elem) => {
        setTableObj(elem);
        setModalOpen(true);
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
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
            rt_balance_qty: e?.rt_balance_qty,
            rt_use_qty: e?.rt_use_qty,
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
                dispatch(getMultiRtOfferTable());
                setSubmitArr([]);
                handleRefresh();
                localStorage.removeItem('RT_TYPE_MASTER_IDS');
                localStorage.removeItem('RT_TYPE_ID');
            }
        }).catch((error) => {
            console.log(error, 'Error submitting')
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <NdtOfferHeader name={'Radiography Test Offer List'} />

                        <RtItemList
                            name={'Radiography Test Offer List'}
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

                        <RTOfferTable setSubmitArr={setSubmitArr} submitArr={submitArr} />

                        <SubmitButton
                            disable={loading}
                            handleSubmit={handleSubmit}
                            link={'/user/project-store/rt-offer-management'}
                            buttonName={'Generate RT Offer'}
                        />

                        {showBtn && <RTOfferCompletedList />}
                    </div>
                </div>
            </div>

            <RtItemModal
                title={'Add Radiography Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            />
        </>
    )
}

export default MultiRtOffer