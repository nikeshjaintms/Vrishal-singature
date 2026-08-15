import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Loader from '../../../Include/Loader';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import MultiTestOfferList from '../../Components/MultiTestOffer/MultiTestOfferList';
import toast from 'react-hot-toast';
import UtOfferModal from './components/UtOfferModal';
import UTItemsList from './components/UTItemsList';
import UTOfferCompletedList from './components/UTOfferCompletedList';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import RTOfferTable from '../MultiRT/components/RTOfferTable';
import UTOfferTable from './components/UTOfferTable';
import { getMultiUTOfferTable } from '../../../../../Store/MutipleDrawing/MultiNDT/UtClearance/UtOfferTable';
import { manageRTMultiOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer';

const MultiUtOffer = () => {

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
            const findNdt = ndtData?.find((nt) => nt?.name === 'UT');
            if (findNdt && disable) {
                dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
                setDisable(false);
            }
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [disable]);

    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        computedComments = computedComments?.filter((ut) => ut.status === 1);
        if (search) {
            computedComments = computedComments.filter(
                (ut) =>
                    ut.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    ut.ndt_master_id?.report_no?.toLowerCase()?.includes(search?.toLowerCase())
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

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
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
            ut_balance_qty: e?.ut_balance_qty,
            ut_use_qty: e?.ut_use_qty,
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
            // console.log(response, '@@');
            const { data, success, message } = response?.payload;
            if (success) {
                toast.success(message);
                dispatch(getMultiUTOfferTable());
                setSubmitArr([]);
                handleRefresh();
                localStorage.removeItem('UT_TYPE_MASTER_IDS');
                localStorage.removeItem('UT_TYPE_ID');
            }
        }).catch((error) => {
            console.log(error, 'Error submitting')
        }).finally(() => {
            setLoading(false);
        })
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
                        <NdtOfferHeader name={'Ultrasonic Test Offer List'} />

                        <UTItemsList
                            name={'Ultrasonic Test Offer List'}
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

                        <UTOfferTable setSubmitArr={setSubmitArr} />
                        <SubmitButton
                            disable={loading}
                            handleSubmit={handleSubmit}
                            link={'/piping/user/ut-offer-management'}
                            buttonName={'Generate UT Offer'}
                        />
                        {showBtn && <UTOfferCompletedList />}
                    </div>
                </div>
            </div>
            <UtOfferModal
                title={'Add Ultrasonic Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            />
        </>
    )
}

export default MultiUtOffer