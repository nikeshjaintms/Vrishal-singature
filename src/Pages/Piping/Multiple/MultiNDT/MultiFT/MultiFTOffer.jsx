import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import FTItemList from './components/FTItemList';
import FTItemModal from './components/FTItemModal';
import { V_URL } from '../../../../../BaseUrl';
import FTOfferCompletedList from './components/FTOfferCompletedList';
import FTOfferTable from './components/FTOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { manageRTMultiOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer';
import { getMultiRtOfferTable } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable';
import { getUserWeldFtPiping } from '../../../../../Store/Piping/WeldFt/WeldFtPiping';
// import { getUserFt } from '../../../../../Store/Piping/N/FT/FtOffer';
import { getUserFt } from '../../../../../Store/Piping/Ndt/FT/FtOffer';
// import { getUserFtAdded } from '../../../../../Store/Piping/NDT/FT/FTOfferadded';
import { getUserFtAdded } from '../../../../../Store/Piping/Ndt/FT/FTOfferadded';
import axios from 'axios';


const MultiFTOffer = () => {
    const dispatch = useDispatch();

    const getVal = (val) => (Array.isArray(val) ? val[0] : val);

    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitArr, setSubmitArr] = useState([]);
    const [showBtn, setShowBtn] = useState(false);

    // Independent state for Offer Table Pagination
    const [offerPage, setOfferPage] = useState(1);
    const [offerLimit, setOfferLimit] = useState(10);
    const [offerSearch, setOfferSearch] = useState("");

    useEffect(() => {
        dispatch(getUserWeldFtPiping({
            page: currentPage,
            limit,
            search
        }));
    }, [dispatch, currentPage, limit, search]);

    useEffect(() => {
        dispatch(getUserFt({
            page: offerPage,
            limit: offerLimit,
            search: offerSearch
        }));
    }, [dispatch, offerPage, offerLimit, offerSearch]);

    const weldFtData = useSelector((state) => state.getUserWeldFtPiping?.user?.data?.data);
    const pagination = useSelector((state) => state.getUserWeldFtPiping?.user?.data?.pagination);
    const ftData = useSelector((state) => state.getUserFt?.user?.data);
    const ftPagination = useSelector((state) => state.getUserFt?.user?.pagination);


    const commentsData = useMemo(() => {
        let computedComments = weldFtData || [];

        // Ensure computedComments is an array before filtering
        if (Array.isArray(computedComments)) {
            computedComments = computedComments.filter(
                (item) => item?.ndt_required?.Ferrite === "Yes" || item?.ndt_required?.Ferrite === true
            );
            if (search) {
                computedComments = computedComments.filter(
                    (item) =>
                        item?.drawing_no?.toLowerCase().includes(search.toLowerCase()) ||
                        item?.spool_no?.toLowerCase().includes(search.toLowerCase()) ||
                        item?.joint_no?.toLowerCase().includes(search.toLowerCase())
                );
            }
        } else {
            computedComments = [];
        }
        return computedComments;
    }, [currentPage, search, limit, weldFtData]);

    console.log("pagination", pagination);
    console.log("commentsData", commentsData);

    useEffect(() => {
        if (showBtn) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [showBtn]);

    // 2️⃣ Update totalItems whenever filtered data changes
    useEffect(() => {
        if (pagination?.totalItems) {
            setTotalItems(pagination.totalItems);
        }
    }, [pagination]);


    const [tableObj, setTableObj] = useState(null);

//     // Add item - Immediately store to backend
    const handleAddToFTArr = async (elem) => {
        setTableObj(elem);

        const payload = {
            project_id: localStorage.getItem('U_PROJECT_ID'),
            items: [{
                main_id: getVal(elem?.weld_visual_inspection_id),
                main_item_id: getVal(elem?.weld_visual_item_id),
                drawing_id: getVal(elem?.drawing_id),
                drawing_no: getVal(elem?.drawing_no),
                rev: getVal(elem?.rev),
                material_item_id: getVal(elem?.material_item_id),
                spool_no_id: getVal(elem?.spool_no_id),
                spool_no: getVal(elem?.spool_no),
                joint_no: Array.isArray(elem?.joint_no) ? elem.joint_no.join(', ') : (elem?.joint_no || ''),
                joint_id: getVal(elem?.joint_id),
                item_id: getVal(elem?.item_id),
                piping_class: getVal(elem?.piping_class),
                service_id: getVal(elem?.service),
                piping_material_specification_id: getVal(elem?.material_specification_id),
                joint_type_id: getVal(elem?.joint_type),
                size_id: getVal(elem?.size_id),
                thickness_id: getVal(elem?.thickness_id),
                remarks: elem?.remarks || '',
            }]
        };

        setLoading(true);
        try {
            const response = await axios.post(`${V_URL}/user/piping-manage-multi-ft-offer`, payload);
            if (response.data?.success) {
                toast.success(response.data.message || 'Item Added & Stored Successfully');
                dispatch(getUserFt({
                    page: offerPage,
                    limit: offerLimit,
                    search: offerSearch
                }));
                 dispatch(getUserWeldFtPiping({
                        page: currentPage,
                        limit,
                        search
                    }));
            } else {
                toast.error(response.data?.message || 'Failed to store item');
            }
        } catch (error) {
            console.error("Error adding FT Offer:", error);
            toast.error(error.response?.data?.message || 'Error adding FT Offer');
        } finally {
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    console.log(submitArr, "submitArr");
    const handleSubmit = async () => {
        if (!submitArr || submitArr.length === 0) {
            toast.error('Please add at least one item before submitting');
            return;
        }

        const itemsPayload = submitArr.map(item => ({
            main_id: getVal(item?.main_id) || null,
            main_item_id: getVal(item?.main_item_id) || null,
            drawing_id: getVal(item?.drawing_id) || null,
            drawing_no: getVal(item?.drawing_no) || '',
            rev: getVal(item?.rev) || '',
            spool_no: getVal(item?.spool_no) || '',
            spool_no_id: getVal(item?.spool_no_id) || null,
            joint_no: Array.isArray(item?.joint_no) ? item.joint_no.join(', ') : (item?.joint_no || ''),
            joint_id: getVal(item?.joint_id) || null,
            piping_class: getVal(item?.piping_class) || null,
            service_id: getVal(item?.service_id) || null,
            piping_material_specification_id: getVal(item?.piping_material_specification_id || item?.material_specification_id) || null,
            joint_type_id: getVal(item?.joint_type_id) || null,
            size_id: getVal(item?.size_id) || null,
            thickness_id: getVal(item?.thickness_id) || null,
            remarks: item?.remarks || ''
        }));

        setLoading(true);

        try {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('project_name', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            bodyFormData.append('user_id', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('items', JSON.stringify(itemsPayload));

            const response = await axios.post(
                `${V_URL}/user/piping-manage-multi-ft-inspection`,
                bodyFormData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
                    },
                }
            );

            if (response?.data?.success) {
                toast.success(response.data.message || 'FT Test Inspection submitted');

                setSubmitArr([]);
                dispatch(getUserFtAdded({
                    page: 1,
                    limit: 10,
                    search: ""
                }));
                dispatch(getUserFt({
                    page: offerPage,
                    limit: offerLimit,
                    search: offerSearch
                }));
                handleRefresh();
            } else {
                toast.error(response?.data?.message || 'Submission failed');
            }

        } catch (error) {
            console.error('FT submit error:', error);
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

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
                        <NdtOfferHeader name={'FT Offer List'} isPiping={true} />

                        <FTItemList
                            name={'FT Offer List'}
                            commentsData={commentsData}
                            limit={limit}
                            setlimit={setlimit}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalItems={totalItems}
                            setSearch={setSearch}
                            handleRefresh={handleRefresh}
                            handleAddToFTArr={handleAddToFTArr}
                            showBtn={showBtn}
                            handleShowList={handleShowList}
                        />

                        <FTOfferTable
                            setSubmitArr={setSubmitArr}
                            submitArr={submitArr}
                            ftData={ftData}
                            ftPagination={ftPagination}
                            offerPage={offerPage}
                            setOfferPage={setOfferPage}
                            offerLimit={offerLimit}
                            setOfferLimit={setOfferLimit}
                            setOfferSearch={setOfferSearch}
                        />

                         <SubmitButton
                             disable={loading}
                             handleSubmit={handleSubmit}
                             link={'/piping/user/FT-offer-management'}
                             buttonName={'Generate FT Offer'}
                         />
                         {/* {showBtn && <manageFTMultiOfferOfferCompletedList />} */}
                         {showBtn && <FTOfferCompletedList />}
                     </div>
                 </div>
             </div>
             {/* 
           <FTItemModal
             title={'Add Radiography Test to Issue'}
             tableObj={tableObj}
             modalOpen={modalOpen}
               handleCloseModal={() => setModalOpen(false)}
              /> */}
        </>
    )
}

export default MultiFTOffer