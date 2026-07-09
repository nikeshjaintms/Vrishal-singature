import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
// import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import { NDTOfferData } from '../../../../../Store/Piping/Ndt/NDTOFFERDATA/NdtOfferData';
import { fetchRTOfferData } from '../../../../../Store/Piping/Ndt/RT-OFFER/RtOfferData';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import RtItemList from './components/RtItemList';
// import RtItemModal from './components/RtItemModal';
import RTOfferCompletedList from './components/RTOfferCompletedList';
import RTOfferTable from './components/RTOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { manageRTMultiOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/ManageRTMultiOffer';
import { getMultiRtOfferTable } from '../../../../../Store/MutipleDrawing/MultiNDT/RtClearance/RtOfferTable';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';
import { getNdtContractor } from '../../../../../Store/Piping/NdtContractor/NdtContractor';
import { useNavigate } from 'react-router-dom';
import { getMultiRtClearancepiping } from "../../../../../Store/Piping/Ndt/RT-CLEARANCE/rtClearance";


const MultiRtOffer = () => {

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
    const [rtType, setRtType] = useState(null);
    const entity = useSelector((state) => state.NDTOfferData?.user?.data);
    const rtOffers = useSelector((state) => state.fetchRTOfferData?.offers);
    const NDTOffer = useSelector((state) => state.getNdtContractor);

    const [localEntity, setLocalEntity] = useState([]);
    const [rtLocation, setRtLocation] = useState("");
    const [contractorId, setContractorId] = useState(null);


    useEffect(() => {
        if (entity) {
            setLocalEntity(entity.map(item => ({ ...item, rt_location: "" })));
        }
    }, [entity]);

    useEffect(() => {
        dispatch(getNdtContractor({ project: localStorage.getItem('U_PROJECT_ID'), status: true }));
    }, [dispatch]);

    useEffect(() => {
        if (rtType) {
            dispatch(NDTOfferData({
                project_id: localStorage.getItem('U_PROJECT_ID'),
                rtType: rtType,
            }));
            dispatch(fetchRTOfferData({
                project_id: localStorage.getItem('U_PROJECT_ID')
            }));
        }
    }, [dispatch, rtType]);




    console.log(entity, "entity")
    console.log(NDTOffer, "NDTOffer")
    const rtTypeOptions = [
        { label: 'BSRT', value: 'BSRT' },
        { label: 'ASRT', value: 'ASRT' },
        { label: 'RT', value: 'RT' },
    ];
    const isYes = (v) => v === true || v === "Yes" || v === 1 || v === "1";

    const commentsData = useMemo(() => {
        if (!rtType) {
            setTotalItems(0);
            return [];
        }

        let computedComments = localEntity || [];

        // Filter based on RT Type and NDT requirements
        computedComments = computedComments.filter((rt) => {
            const ndt = rt?.ndt_required;

            // ================= BSRT =================
            if (rtType === 'BSRT') {
                return (
                    rt && ndt &&
                    isYes(ndt?.BSRRT) &&
                    rt?.bsrt_status != 1 && // Not accepted
                    (rt?.is_added_bsrt === false || [2, 3, 4].includes(Number(rt?.bsrt_status))) // Show if not added OR if rejected
                );
            }

            // ================= ASRT =================
            if (rtType === 'ASRT') {
                // Check if ASRRT is required and not yet done
                if (!rt || !ndt || !isYes(ndt?.ASRRT) || rt?.asrt_status == 1) {
                    return false;
                }

                // Hide if already in a pending offer (unless it was rejected and needs re-offer)
                if (rt?.is_added_asrt !== false && ![2, 3, 4].includes(Number(rt?.asrt_status))) {
                    return false;
                }

                // PREREQUISITES for ASRT:
                // 1. If BSRRT required -> must be Accepted (status 1)
                if (isYes(ndt?.BSRRT) && rt?.bsrt_status != 1) return false;
                // 2. If Ferrite required -> must be generated
                if (isYes(ndt?.Ferrite) && !rt?.is_generated_ft) return false;
                // 3. If PWHT required -> must be generated
                if (isYes(ndt?.PWHT) && !rt?.is_generated_pwht) return false;

                return true;
            }

            // ================= RT =================
            if (rtType === 'RT') {
                // Check if RT is required and not yet done
                if (!rt || !ndt || !isYes(ndt?.RT) || rt?.rt_status == 1) {
                    return false;
                }

                // Hide if already in a pending offer (unless it was rejected and needs re-offer)
                if ((rt?.is_added_rt !== false && rt?.is_added_rt !== undefined) && ![2, 3, 4].includes(Number(rt?.rt_status))) {
                    return false;
                }

                // PREREQUISITES for RT:
                // 1. If BSRRT required -> must be Accepted (status 1)
                if (isYes(ndt?.BSRRT) && rt?.bsrt_status != 1) return false;
                // 2. If Ferrite required -> must be generated
                if (isYes(ndt?.Ferrite) && !rt?.is_generated_ft) return false;
                // 3. If PWHT required -> must be generated
                if (isYes(ndt?.PWHT) && !rt?.is_generated_pwht) return false;
                // 4. If ASRRT required -> must be Accepted (status 1)
                if (isYes(ndt?.ASRRT) && rt?.asrt_status != 1) return false;

                // 5. RT LOT must be generated
                if (rt?.is_generated_rt_lot !== true) return false;

                if (rt.is_RT_covered !== true) return false;

                return true;
            }

            return false;
        });


        // 🔹 SEARCH FILTER
        if (search) {
            computedComments = computedComments.filter(
                (rt) =>
                    rt?.drawing_no?.toLowerCase().includes(search.toLowerCase()) ||
                    rt?.joint_no?.toLowerCase().includes(search.toLowerCase())
            );
        }

        setTotalItems(computedComments.length);

        return computedComments.slice(
            (currentPage - 1) * limit,
            currentPage * limit
        );
    }, [localEntity, rtType, search, currentPage, limit]);

    const handleRtLocationChange = (index, value) => {
        setLocalEntity(prev => {
            const updated = [...prev];
            const itemIndex = (currentPage - 1) * limit + index;
            if (updated[itemIndex]) {
                updated[itemIndex] = { ...updated[itemIndex], rt_location: value };
            }
            return updated;
        });
    };


    const [tableObj, setTableObj] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const handleAddToIssueArr = (elem) => {
        console.log("Handle Are", elem);
        if (!rtType) {
            toast.error("Please select RT Type first");
            return;
        }

        let status = "Initial";
        let test_type = "";
        if(rtType === "RT"){
            status = elem.rt_status == 2 ? "Repair" : elem.rt_status == 3 ? "Re-Take" : elem.rt_status == 4 ? "Re-Shoot" : "Initial";
            test_type = elem.rt_test_type;
        }
        else if(rtType === "BSRT"){
            status = elem.bsrt_status == 2 ? "Repair" : elem.bsrt_status == 3 ? "Re-Take" : elem.bsrt_status == 4 ? "Re-Shoot" : "Initial";
            test_type = elem.bsrt_test_type;
        }
        else if(rtType === "ASRT"){
            status = elem.asrt_status == 2 ? "Repair" : elem.asrt_status == 3 ? "Re-Take" : elem.asrt_status == 4 ? "Re-Shoot" : "Initial";
            test_type = elem.asrt_test_type;
        }

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
                rt_type: rtType === 'BSRT' ? 'BSRT' : (rtType === 'ASRT' ? 'ASRT' : 'RT'),
                rt_lot_id: rtType === 'RT' ? elem.lot_id : null,
                rt_lot_item_id: rtType === 'RT' ? elem.lot_item_id : null,
                inspection_type: status,
                test_type: test_type,
                thickness: elem.thickness || elem.joint_thickness,
            }],
            status: 1
        };

        setLoading(true);
        axios.post(`${V_URL}/user/piping/add-rt-test-offer`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(NDTOfferData({
                    project_id: localStorage.getItem('U_PROJECT_ID'),
                    rtType: rtType,
                    status: 'Offered'
                }));
                dispatch(fetchRTOfferData({
                    project_id: localStorage.getItem('U_PROJECT_ID')
                }));
                setSubmitArr(prev => [...prev, ...payload.items]);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error(err.response?.data?.message || "Error adding RT Offer");
        }).finally(() => setLoading(false));
    }

    const handleUpdateThickness = (id, joint_id, spool_id, thickness) => {
        if (!id || !joint_id || !spool_id) return;

        const payload = {
            id,
            items: [{ joint_id, spool_id, thickness }]
        };

        axios.post(`${V_URL}/user/piping/update-rt-test-offer-thickness`, payload, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error(err.response?.data?.message || "Error updating thickness");
        });
    };

    const handleRemoveOffer = (offer_id, itData) => {
        if (!offer_id) return;
        setLoading(true);
        axios.post(`${V_URL}/user/piping/delete-rt-test-offer`, { offer_id }, {
            headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
        }).then(res => {
            if (res.data.success) {
                toast.success(res.data.message);
                const project_id = localStorage.getItem('U_PROJECT_ID');
                dispatch(NDTOfferData({ project_id, rtType: rtType, status: 'Offered' }));
                dispatch(fetchRTOfferData({ project_id }));
                setSubmitArr(prev => prev.filter(item => 
                    item._id !== offer_id && 
                    (itData?.joint_id ? item.joint_id !== itData.joint_id : true)
                ));
            } else {
                toast.error(res.data.message);
            }
        }).catch(err => {
            console.error(err);
            toast.error(err.response?.data?.message || "Error deleting RT Offer");
        }).finally(() => setLoading(false));
    }

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

    // const handleSubmit = () => {
    //     if (submitArr?.length === 0) {
    //         toast.error('Please atleast cover a items before submitting');
    //         return;
    //     }

    //     const filterArray = submitArr?.map((e) => ({
    //         grid_item_id: e?.grid_item_id?._id,
    //         drawing_id: e?.grid_item_id?.drawing_id?._id,
    //         is_cover: e?.is_cover === true ? true : false,
    //         joint_type: e?.joint_type?.map((e) => e?._id),
    //         ndt_master_id: e?.ndt_master_id,
    //         ndt_type_id: e?.ndt_type_id,
    //         remarks: e?.remarks || '',
    //         offer_used_grid_qty: e?.offer_used_grid_qty,
    //         rt_balance_qty: e?.rt_balance_qty,
    //         rt_use_qty: e?.rt_use_qty,
    //         rt_location: rtLocation,
    //         thickness: e?.thickness,
    //         weldor_no: e?.weldor_no?._id,
    //         wps_no: e?.wps_no?._id,
    //         offer_main_id: e?.offer_main_id,
    //         deleted: false,
    //     }));

    //     setLoading(true);
    //     const bodyFormData = new URLSearchParams();
    //     bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
    //     bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
    //     bodyFormData.append('items', JSON.stringify(filterArray));
    //     dispatch(manageRTMultiOffer({ bodyFormData })).then((response) => {
    //         const { data, success, message } = response?.payload;
    //         if (success) {
    //             toast.success(message);
    //             dispatch(getMultiRtOfferTable());
    //             setSubmitArr([]);
    //             handleRefresh();
    //             localStorage.removeItem('RT_TYPE_MASTER_IDS');
    //             localStorage.removeItem('RT_TYPE_ID');
    //         }
    //     }).catch((error) => {
    //         console.log(error, 'Error submitting')
    //     }).finally(() => {
    //         setLoading(false);
    //     })
    // }
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
            rt_lot_id: item.lot_id || item?.rt_lot_id,
            rt_lot_item_id: item.lot_item_id || item?.rt_lot_item_id,
            rt_location: rtLocation,
            rt_type: rtType === 'BSRT' ? 'BSRT' : (rtType === 'ASRT' ? 'ASRT' : 'RT'),
            old_status: item?.inspection_type === "Initial" ? null : item?.inspection_type === "Repair" ? 2 : item?.inspection_type === "Re-Take" ? 3 : item?.inspection_type === "Re-Shoot" ? 4 : null,
            old_test_type: item?.test_type ||  null,
            thickness: item?.thickness || item?.joint_thickness,
            remarks: item?.remarks,
        }));

        console.log(finalItems, "finalItems");

        const payload = {
            project_id: localStorage.getItem("U_PROJECT_ID"),
            project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
            contactor: contractorId,
            items: finalItems,
            offered_by: localStorage.getItem("PAY_USER_ID"),

        };

        setLoading(true);

        axios.post(
            `${V_URL}/user/piping/manage-rt-generate-offer`,
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
                    dispatch(fetchRTOfferData({
                        project_id: localStorage.getItem("U_PROJECT_ID")
                    }));

                    dispatch(NDTOfferData({
                        project_id: localStorage.getItem("U_PROJECT_ID"),
                        rtType: rtType,
                        status: 'Offered'
                    }));

                    // 🧹 Clear UI State
                    setSubmitArr([]);
                    setRtType(null);
                    setRtLocation("");
                    setShowBtn(false);
                    setSubmitArr([]);
                    setRtType(null);
                    setContractorId(null);
                    navigate('/piping/user/rt-offer-management');

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

                        <NdtOfferHeader name={'Radiography Test Offer List'} isPiping={true} />
                        
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card card-table show-entire">
                                    <div className="card-body">
                                        <div className="page-table-header mb-2">
                                            <div className="row align-items-center">
                                                <div className="col-md-6">
                                                    <div className="doctor-table-blk">
                                                        <label htmlFor="">RT Type</label>
                                                        <Dropdown
                                                            value={rtType}
                                                            options={rtTypeOptions}
                                                            onChange={(e) => setRtType(e.value)}
                                                            placeholder="Select RT Type"
                                                            className="w-100"
                                                            showClear
                                                            disabled={!!rtType}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                            handleRtLocationChange={handleRtLocationChange}
                            showBtn={showBtn}
                            handleShowList={handleShowList}
                            rtType={rtType}
                        />

                        <RTOfferTable setSubmitArr={setSubmitArr} submitArr={submitArr} rtOffers={rtOffers} handleRemoveOffer={handleRemoveOffer} rtType={rtType} handleUpdateThickness={handleUpdateThickness} />

                        <SubmitButton
                            disable={loading}
                            handleSubmit={handleSubmit}
                            isRT={true}
                            rtLocationValue={rtLocation}
                            handleRtLocationChange={(value) => setRtLocation(value)}
                            link={'/piping/user/rt-offer-management'}
                            buttonName={'Generate RT Offer'}
                            ndtContractors={NDTOffer?.data}   // ✅ pass contractor list
                            contractorId={contractorId}              // ✅ ADD
                            setContractorId={setContractorId}        // ✅ ADD

                        />

                        {showBtn && <RTOfferCompletedList rtType={rtType} />}
                    </div>
                </div>
            </div>

            {/* <RtItemModal
                title={'Add Radiography Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            /> */}
        </>
    )
}

export default MultiRtOffer