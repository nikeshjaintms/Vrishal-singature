import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { PdfDownloadErp } from '../../../../../Components/ErpPdf/PdfDownloadErp';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import toast from 'react-hot-toast';
import { manageRTMultiOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer';
import { getMultiLPTOfferTable } from '../../../../../Store/MutipleDrawing/MultiNDT/LptClearance/LptOfferTable';
// import PicklingPassivationItemModal from './components/PicklingPassivationItemModal';
import PicklingPassivationItemsList from './components/PicklingPassivationItemsList'
import PicklingPassivationOfferTable from './components/PicklingPassivationOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import PicklingPassivationCompletedList from './components/PicklingPassivationCompletedList';
import { getUserWeldPicklingPiping } from '../../../../../Store/Piping/WeldPickling/WeldPicklingPiping';
import { getUserPickling } from '../../../../../Store/Piping/Ndt/Pickling/PicklingOffer';
import { getUserPicklingAdded } from '../../../../../Store/Piping/Ndt/Pickling/PicklingOfferadded';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';


const MultiPicklingPassivationOffer = () => {

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
    const [tableObj, setTableObj] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getUserNdtMaster({ status: true })).then((response) => {
            const ndtData = response.payload?.data;
            const findNdt = ndtData?.find((nt) => nt?.name === 'LPT');
            if (findNdt && disable) {
                dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
                setDisable(false);
            }
            dispatch(getUserPickling());
            dispatch(getUserPicklingAdded());
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [disable]);

    useEffect(() => {
        dispatch(getUserWeldPicklingPiping({ page: currentPage, limit: limit, search: search }));
    }, [dispatch, currentPage, limit, search]);

    const handleRefreshTopTable = () => {
        dispatch(getUserWeldPicklingPiping({ page: currentPage, limit: limit, search: search }));
    };

    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);
    const weldPicklingEntity = useSelector((state) => state.getUserWeldPicklingPiping?.user?.data);
    const weldPicklingPagination = useSelector((state) => state.getUserWeldPicklingPiping?.user?.data?.pagination);
console.log("weldPicklingPagination====>",weldPicklingPagination);
    const picklingEntity = useSelector((state) => state.getUserPickling?.user?.data);
    const picklingAddedEntity = useSelector((state) => state.getUserPicklingAdded?.user?.data);

    console.log(picklingAddedEntity, "picklingAddedEntity");
    const commentsData = useMemo(() => {
        const items = weldPicklingEntity && Array.isArray(weldPicklingEntity) ? weldPicklingEntity : (weldPicklingEntity?.data && Array.isArray(weldPicklingEntity.data) ? weldPicklingEntity.data : []);
        let computedComments = items;

        if (search) {
            computedComments = computedComments.filter(
                (item) => {
                    const drawingNo = item?.drawing_no || '';
                    const spoolNo = item?.spool_no || '';
                    return (
                        drawingNo.toLowerCase().includes(search.toLowerCase()) ||
                        spoolNo.toLowerCase().includes(search.toLowerCase())
                    );
                }
            );
        }
        // setTotalItems(computedComments?.length);
        return computedComments;
        // ?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
    }, [weldPicklingEntity]);

       useEffect(() => {
            if (weldPicklingPagination?.totalItems) {
                setTotalItems(weldPicklingPagination.totalItems);
            }
        }, [weldPicklingPagination]);

    useEffect(() => {
        if (showBtn) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [showBtn]);

    const handleAddToPicklingPassivationArr = async (elem) => {
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
            const response = await axios.post(`${V_URL}/user/piping-manage-multi-pickling-offer`, payload);
            if (response.data?.success) {
                toast.success(response.data.message || 'Item Added & Stored Successfully');
                dispatch(getUserPickling());
            dispatch(getUserWeldPicklingPiping({page:currentPage,limit,search}));

            } else {
                toast.error(response.data?.message || 'Failed to store item');
            }
        } catch (error) {
            console.error("Error adding PMI Offer:", error);
            toast.error(error.response?.data?.message || 'Error adding FT Offer');
        } finally {
            setLoading(false);
        }
    }

    const handleShowList = () => {
        setShowBtn(!showBtn);
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
                `${V_URL}/user/piping-manage-multi-pickling-inspection`,
                bodyFormData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
                    },
                }
            );

            if (response?.data?.success) {
                toast.success(response.data.message || 'Pickling Passivation Inspection submitted');

                setSubmitArr([]);
                dispatch(getUserPicklingAdded());
                dispatch(getUserPickling());
                handleRefresh();
                setShowBtn(true);
            } else {
                toast.error(response?.data?.message || 'Submission failed');
            }

        } catch (error) {
            console.error('Pickling Passivation submit error:', error);
            toast.error(
                error?.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
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
                    <NdtOfferHeader name={'Pickling Passivation Testing Offer List'} isPiping={true}/>

                    <PicklingPassivationItemsList
                        name={'Pickling Passivation Test Offer List'}
                        commentsData={commentsData}
                        limit={limit}
                        setlimit={setlimit}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setSearch={setSearch}
                        handleRefresh={handleRefresh}
                        handleAddToPicklingPassivationArr={handleAddToPicklingPassivationArr}
                        showBtn={showBtn}
                        handleShowList={handleShowList}
                    />

                    <PicklingPassivationOfferTable
                        setSubmitArr={setSubmitArr}
                        handleRefreshOffer={handleRefresh}
                        handleRefreshTopTable={handleRefreshTopTable}
                    />

                    <SubmitButton
                        disable={loading}
                        handleSubmit={handleSubmit}
                        link={'/piping/user/pickling-passivation-offer-management'}
                        buttonName={'Generate Pickling Passivation Offer'}
                    />
                    {showBtn && <PicklingPassivationCompletedList />}
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

export default MultiPicklingPassivationOffer