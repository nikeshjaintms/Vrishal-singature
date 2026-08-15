import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPwhtNdtDataFromWeldVisualPiping} from '../../../../../Store/Piping/Ndt/PwhtNdt/getPwhtNdtDataFromWeldVisual';
import { getPwhtOffer } from '../../../../../Store/Piping/Ndt/PwhtNdt/getPwhtOfferPiping';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import NdtOfferHeader from '../../../../../Components/NDT/NdtOfferHeader';
import PWHTItemList from './components/PWHTItemList';
import PWHTItemModal from './components/PWHTItemModal';
import PWHTOfferCompletedList from './components/PWHTOfferCompletedList';
import PWHTOfferTable from './components/PWHTOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';

import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';

const useDebounce = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const MultiPwhtOffer = () => {

    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitArr, setSubmitArr] = useState([]);
    const [showBtn, setShowBtn] = useState(false);
    const debouncedSearch = useDebounce(search, 600);
const [pwhtOfferTableData, setPwhtOfferTableData] = useState([]);

  useEffect(() => {
        if (showBtn) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [showBtn]);
    // useEffect(() => {
    //      dispatch(getPwhtNdtDataFromWeldVisualPiping({page:currentPage, limit,search,project_id:localStorage.getItem('U_PROJECT_ID')}));
    //      dispatch(getPwhtOffer({project_id:localStorage.getItem('U_PROJECT_ID')}));
    // }, [disable]);
useEffect(() => {
  dispatch(
    getPwhtNdtDataFromWeldVisualPiping({
      page: currentPage,
      limit,
      search:debouncedSearch,
      project_id: localStorage.getItem("U_PROJECT_ID"),
    })
  );
}, [currentPage, limit, debouncedSearch, dispatch]);
useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch]);
useEffect(() => {
  dispatch(getPwhtOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
}, [dispatch]);

   
    const entity = useSelector((state) => state.getPwhtNdtDataFromWeldVisualPiping?.user?.data?.data);
    const pagination = useSelector((state) => state.getPwhtNdtDataFromWeldVisualPiping?.user?.data?.pagination);
    console.log("pagination======>",pagination);
 const getPwhOfferData = useSelector((state) => state.getPwhtOffer?.data);
 const getPwhOfferState = useSelector((state) => state.getPwhtOffer);

console.log("FULL getPwhtOffer STATE 👉", getPwhOfferState);
 console.log("getPwhOfferData",getPwhOfferData);
console.log("weldData",entity); 
useEffect(() => {
  setPwhtOfferTableData(getPwhOfferData || []);
}, [getPwhOfferData]);

    const commentsData = useMemo(() => {
        let computedComments = entity;
        return computedComments;
    }, [entity]);
  
  useEffect(() => {
  if (pagination?.totalItems) {
    setTotalItems(pagination.totalItems);
  }
}, [pagination]);


useEffect(() => {
  if (Array.isArray(pwhtOfferTableData) && pwhtOfferTableData.length > 0) {
    setSubmitArr(pwhtOfferTableData);
  } else {
    setSubmitArr([]);
  }
}, [pwhtOfferTableData]);

const handleAddToIssueArr = async (row) => {
  try {
    // 1️⃣ Prepare single-item payload
    const payloadItem = {
     
      weld_visual_id: row.weld_visual_id,
      weld_visual_item_id: row.weld_visual_item_id,

      drawing_id: row.drawing_id,
      spool_no_id: row.spool_no_id,

      joint_spool_item_id: row.joint_id,      // if required by schema
      joint_type_id: row.joint_type,

      piping_class: row.piping_class,
      piping_material_specification: row.material_specification_id,

      material_item_id_1: row.material_item_id_1,
      material_item_id_2: row.material_item_id_2,
      thickness: row.thickness,
      remarks: ""
    };

    console.log("PWHT payload item:", payloadItem);

    // 2️⃣ Send ONLY ONE ITEM
    const formData = new URLSearchParams();
    formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    formData.append("ndt_master_id",row.ndt_required.ndt_id);

    formData.append("items", JSON.stringify([payloadItem])); // 👈 array with ONE item

    const res = await axios.post(
      `${V_URL}/user/manage-pwht-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
        }
      }
    );

    if (res.data?.success) {
      toast.success(res.data?.message);

      // 3️⃣ Refresh table to disable button
      dispatch(
        getPwhtNdtDataFromWeldVisualPiping({
          page: currentPage,
          limit,
          search,
          project_id: localStorage.getItem("U_PROJECT_ID")
        })
      );
       dispatch(getPwhtOffer({project_id:localStorage.getItem('U_PROJECT_ID')}));
    } else {
      toast.error(res.data?.message || "Already added");
    }

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


const handleSaveClick = async (row, editFormData, setEditRowIndex) => {
  try {
    console.log("row",row);
    const formData = new URLSearchParams();
    formData.append("offer_id", row._id);
    formData.append("item_id", row.pwht_offer_item_id); // or item._id if nested
    formData.append("no_of_thermocouple", editFormData.no_of_thermocouple);
    formData.append("remarks", editFormData.remarks);
    formData.append("thickness", editFormData.thickness);

    const res = await axios.post(`${V_URL}/user/update-pwht-piping`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
      },
    });

    if (!res.data?.success) {
      toast.error(res.data?.message);
      return;
    }

    toast.success(res.data?.message);

    // refresh table
    dispatch(getPwhtOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
    
    setEditRowIndex(null);
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

const handleRemove = async (row) => {
  try {
    console.log("row in delete====>",row);
    if (!row._id) {
      toast.error("Invalid row selected");
      return;
    }

 const token = localStorage.getItem("PAY_USER_TOKEN");

    const res = await axios.delete(`${V_URL}/user/delete-pwht-offer-piping`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: { _id: row._id }
    });
    if (!res.data?.success) {
      toast.error(res.data?.message || "Delete failed");
      return;
    }

    toast.success(res.data?.message || "Deleted successfully");

    // ✅ Refresh PWHT offer table
    dispatch(getPwhtOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
  dispatch(getPwhtNdtDataFromWeldVisualPiping({page:currentPage, limit,search,project_id:localStorage.getItem('U_PROJECT_ID')}));
    // Remove from submitArr if present
    setSubmitArr(prev => prev.filter(e => e._id !== row._id));

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

    const handleRefresh = () => {
        setSearch('');
        setDisable(true);
    }

   const handleSubmit = async () => {
  try {
    console.log("submitArr",submitArr);
    if (!submitArr || submitArr.length === 0) {
      toast.error("Please select at least one item before submitting");
      return;
    }
  for (let i = 0; i < submitArr.length; i++) {
      const item = submitArr[i];
      if (!item.no_of_thermocouple || item.no_of_thermocouple <= 0) {
        toast.error(`Please enter a  thermocouple for row ${i + 1}`);
        return;
      }
    }
    // Prepare payload for backend
    const itemsPayload = submitArr.map((e) => ({
        pwht_offer_item_id:e?._id,
      weld_visual_id: e?.weld_visual_id,
      weld_visual_item_id: e?.weld_visual_item_id,
       ndt_master_id: e.ndt_master_id,
      drawing_id: e?.drawing_id,
      spool_no_id: e?.spool_no_id,
      joint_spool_item_id: e?.joint_spool_item_id,
      joint_type_id: e?.joint_type_id,
      piping_class:e?.piping_class_id,
      piping_material_specification:e?.piping_material_specification_id,
      pwht_master_id:e?.pwht_master_id,
      thickness: e?.thickness,
      no_of_thermocouple: e?.no_of_thermocouple,
      remarks: e?.remarks || "",
      moved_next_step: 0,
      // is_accepted: false,
    }));

    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
    formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    formData.append("offered_by", localStorage.getItem("PAY_USER_ID"));
    formData.append("items", JSON.stringify(itemsPayload));

    const res = await axios.post(
      `${V_URL}/user/manage-pwht-inspection-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
        },
      }
    );

    if (res.data?.success) {
      toast.success(res.data.message || "PWHT Inspection created successfully");

      // Clear selection & refresh tables
      setSubmitArr([]);
      dispatch(getPwhtNdtDataFromWeldVisualPiping({
        page: currentPage,
        limit,
        search,
        project_id: localStorage.getItem("U_PROJECT_ID"),
      }));
      dispatch(getPwhtOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
setShowBtn(true);
      // Optional: reset UI
    //   handleRefresh();
    } else {
      toast.error(res.data?.message || "Submission failed");
    }

  } catch (err) {
    console.error("Error submitting PWHT Inspection:", err);
    toast.error("Something went wrong while submitting");
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
                        <NdtOfferHeader name={'PWHT Offer List'} isPiping={true} />

                        <PWHTItemList
                            name={'PWHT Offer List'}
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

                        <PWHTOfferTable 
                        handleSaveClick={handleSaveClick}
                        handleRemove={handleRemove} 
                        tableData={pwhtOfferTableData} 
                        setSubmitArr={setSubmitArr} 
                        submitArr={submitArr} />

                        <SubmitButton
                            disable={loading}
                            handleSubmit={handleSubmit}
                            link={'/piping/user/pwht-offer-management'}
                            buttonName={'Generate PWHT Offer'}
                        />

                        {showBtn && <PWHTOfferCompletedList />}
                    </div>
                </div>
            </div>
{/* 
            <PwhtItemModal
                title={'Add Radiography Test to Issue'}
                tableObj={tableObj}
                modalOpen={modalOpen}
                handleCloseModal={() => setModalOpen(false)}
            /> */}
        </>
    )
}

export default MultiPwhtOffer