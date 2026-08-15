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
import HtItemModal from './components/HtItemModal';
// import HtItemsList from '../MultiHT/components/HtItemsList';
import { getUserWeldHardnessPiping } from '../../../../../Store/Piping/WeldHardness/WeldHardnessPiping';
import HtItemsList from './components/HtItemsList';
import HtOfferTable from './components/HtOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import HtCompletedList from './components/HtCompletedList';
import { getUserHtAdded } from '../../../../../Store/Piping/Ndt/HT/HTOfferadded';
import { getUserHt } from '../../../../../Store/Piping/Ndt/HT/HtOffer';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';

const MultiHtOffer = () => {

    const dispatch = useDispatch();
    const getVal = (val) => (Array.isArray(val) ? val[0] : val);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [htStarted, setHtStarted] = useState(false);
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
            dispatch(getUserWeldHardnessPiping({ page: currentPage, limit: limit, search: search }));
            dispatch(getUserHtAdded());
            dispatch(getUserHt());
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [disable]);

    const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);
    const entity1 = useSelector((state) => state.getUserWeldHardnessPiping?.user?.data?.data);
    const htData = useSelector((state) => state.getUserHt?.user?.data);
    const htAddedData = useSelector((state) => state.getUserHtAdded?.dataByStatus["ALL"]?.data);
    console.log(htAddedData, 'htAddedData');

    useEffect(() => {
        if (showBtn) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [showBtn]);

    const commentsData = useMemo(() => {
        let computedComments = entity1 || [];

        computedComments = computedComments.filter((item) => {
            const ndt = item?.ndt_required;
            if (!ndt) return true;

            const isHardnessRequired = ndt?.Hardness === true;
            const isFerriteRequired = ndt?.Ferrite === true;

            if (isHardnessRequired) {
                if (isFerriteRequired) {
                    return item?.isFt === true;
                }
                return true;
            }
            return false;
        });

        if (search) {
            computedComments = computedComments.filter(
                (lt) =>
                    lt?.drawing_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    lt?.joint_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity1]);

    const handleAddToHtArr = async (elem) => {
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
            const response = await axios.post(`${V_URL}/user/piping-manage-multi-ht-offer`, payload);
            if (response.data?.success) {
                toast.success(response.data.message || 'Item Added & Stored Successfully');
                dispatch(getUserHt());
            dispatch(getUserWeldHardnessPiping({ page: currentPage, limit: limit, search: search }));
            } else {
                toast.error(response.data?.message || 'Failed to store item');
            }
        } catch (error) {
            console.error("Error adding HT Offer:", error);
            toast.error(error.response?.data?.message || 'Error adding FT Offer');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (htData && htData.length > 0) {
            const firstItem = htData[0];

            setMaxAcceptableHardness(firstItem?.MaxAcceptableHardness || "");
            setHardnessValue(firstItem?.HardnessValue || "");

            // optional: enable inputs once data exists
            setHtStarted(true);
        }
    }, [htData]);

    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

    console.log(submitArr, "submitArr");
    const handleSubmit = async () => {
        if (!submitArr || submitArr.length === 0) {
            toast.error('Please add at least one item before submitting');
            return;
        }

        const isAnyStageMissing = submitArr.some(item => !item.pwht_stage);
        if (isAnyStageMissing) {
            toast.error('Please select PWHT Stage for all items in the table');
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
            pwht_stage: item?.pwht_stage || '',
            remarks: item?.remarks || ''
        }));

        setLoading(true);

        try {
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('project_name', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            bodyFormData.append('user_id', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('maxAcceptableHardness', maxAcceptableHardness);
            bodyFormData.append('hardnessValue', hardnessValue);
            bodyFormData.append('items', JSON.stringify(itemsPayload));

            const response = await axios.post(
                `${V_URL}/user/piping-manage-multi-ht-inspection`,
                bodyFormData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
                    },
                }
            );

            if (response?.data?.success) {
                toast.success(response.data.message || 'HT Test Inspection submitted');

                setSubmitArr([]);
                dispatch(getUserHtAdded());
                dispatch(getUserHt());
                handleRefresh();
                setShowBtn(true);
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

    const [maxAcceptableHardness, setMaxAcceptableHardness] = useState("");
    const [hardnessValue, setHardnessValue] = useState("");

    // useEffect(() => {
    //     if (commentsData?.length > 0) {
    //         setMaxAcceptableHardness(commentsData[0]?.MaxAcceptableHardness || "");
    //         setHardnessValue(commentsData[0]?.HardnessValue || "");
    //     }
    // }, [commentsData]);

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
                    <NdtOfferHeader name={'Hardness Testing Offer List'} isPiping={true}/>

                    <HtItemsList
                        name={'Hardness Test Offer List'}
                        commentsData={commentsData}
                        limit={limit}
                        setlimit={setlimit}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setSearch={setSearch}
                        handleRefresh={handleRefresh}
                        handleAddToHtArr={handleAddToHtArr}
                        showBtn={showBtn}
                        handleShowList={handleShowList}
                    />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">

                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <h5 className="mt-3 mb-2 fw-bold"></h5>
                                                <div className="row">

                                                    {/* MAX ACCEPTABLE HARDNESS */}
                                                    <div className="col-12 col-md-3 mb-3">
                                                        <div className="input-block local-forms">
                                                            <label>Max. Acceptable Hardness <span className="login-danger">*</span></label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={maxAcceptableHardness}
                                                                onChange={(e) => setMaxAcceptableHardness(e.target.value)}
                                                                disabled={!htStarted}
                                                            />
                                                            <div className="error"></div>
                                                        </div>
                                                    </div>

                                                    {/* HARDNESS VALUE */}
                                                    <div className="col-12 col-md-3 mb-3">
                                                        <div className="input-block local-forms">
                                                            <label>Hardness Value (HRB / HRC/ HB/ HV) <span className="login-danger">*</span></label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={hardnessValue}
                                                                onChange={(e) => setHardnessValue(e.target.value)}
                                                                disabled={!htStarted}
                                                            />
                                                            <div className="error"></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <HtOfferTable setSubmitArr={setSubmitArr} />

                    <SubmitButton
                        disable={loading}
                        handleSubmit={handleSubmit}
                        link={'/piping/user/ht-offer-management'}
                        buttonName={'Generate Hardness Offer'}
                    />
                    {showBtn && <HtCompletedList />}
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

export default MultiHtOffer