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
import {getLptNdtDataFromWeldVisualPiping} from '../../../../../Store/Piping/Ndt/LPTNDT/getLptNdtDataFromWeldVisual';
import {getLptOffer} from '../../../../../Store/Piping/Ndt/LPTNDT/getLptOfferPiping';
import LptItemModal from './components/LptItemModal';
import MptItemsList from '../MultiMPT/components/MptItemsList';
import LptItemsList from './components/LptItemsList';
import LptOfferTable from './components/LptOfferTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import LptCompletedList from './components/LptCompletedList';
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
const MultiLptOffer = () => {

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
    const [lptOfferTableData, setLptOfferTableData] = useState([]);

    useEffect(() => {
            if (showBtn) {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, [showBtn]);

  const debouncedSearch = useDebounce(search, 600);
useEffect(() => {
  dispatch(
    getLptNdtDataFromWeldVisualPiping({
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
  dispatch(getLptOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
}, [dispatch]);

useEffect(() => {
  if (Array.isArray(lptOfferTableData) && lptOfferTableData.length > 0) {
    setSubmitArr(lptOfferTableData);
  } else {
    setSubmitArr([]);
  }
}, [lptOfferTableData]);

 const getLptOfferData = useSelector((state) => state.getLptOffer?.data);
console.log("getLptOfferData=========>",getLptOfferData);
 useEffect(() => {
  setLptOfferTableData(getLptOfferData || []);
}, [getLptOfferData]);


    // useEffect(() => {
    //     dispatch(getUserNdtMaster({ status: true })).then((response) => {
    //         const ndtData = response.payload?.data;
    //         const findNdt = ndtData?.find((nt) => nt?.name === 'LPT');
    //         if (findNdt && disable) {
    //             dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
    //             setDisable(false);
    //         }
    //     }).catch((error) => console.error("Error fetching NDT Master data:", error));
    // }, [disable]);

      const entity = useSelector((state) => state.getLptNdtDataFromWeldVisualPiping?.user?.data?.data);
        const pagination = useSelector((state) => state.getLptNdtDataFromWeldVisualPiping?.user?.data?.pagination);

    // const entity = useSelector((state) => state.getMultiNdtOffer?.user?.data);

  const commentsData = useMemo(() => {
        let computedComments = entity;
        return computedComments;
    }, [entity]);
  
  useEffect(() => {
  if (pagination?.totalItems) {
    setTotalItems(pagination.totalItems);
  }
}, [pagination]);

const handleAddToIssueArr = async (row) => {
  try {
    // 1️⃣ Prepare single-item payload
    const payloadItem = {
     
      weld_visual_id: row.weld_visual_id,
      weld_visual_item_id: row.weld_visual_item_id,

      drawing_id: row.drawing_id,
      spool_no_id: row.spool_no_id,

      lpt_lot_book_id: row.lpt_lot_book_id,
      lpt_lot_book_item_id: row.lpt_lot_book_item_id, 

      joint_spool_item_id: row.joint_id,      // if required by schema
      joint_type_id: row.joint_type,

      piping_class: row.piping_class,
      piping_material_specification: row.material_specification_id,

      material_item_id_1: row.material_item_id_1,
      material_item_id_2: row.material_item_id_2,

      remarks: ""
    };

    console.log("LPT payload item:", payloadItem);

    // 2️⃣ Send ONLY ONE ITEM
    const formData = new URLSearchParams();
    formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    formData.append("ndt_master_id",row.ndt_required.ndt_id);

    formData.append("items", JSON.stringify([payloadItem])); // 👈 array with ONE item

    const res = await axios.post(
      `${V_URL}/user/manage-lpt-ndt-piping`,
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
        getLptNdtDataFromWeldVisualPiping({
          page: currentPage,
          limit,
          search,
          project_id: localStorage.getItem("U_PROJECT_ID")
        })
      );
       dispatch(getLptOffer({project_id:localStorage.getItem('U_PROJECT_ID')}));
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
    formData.append("item_id", row.lpt_offer_item_id); // or item._id if nested
    formData.append("remarks", editFormData.remarks);

    const res = await axios.post(`${V_URL}/user/update-lpt-ndt-piping`, formData, {
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
    dispatch(getLptOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
    
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

    const res = await axios.delete(`${V_URL}/user/delete-lpt-ndt-offer-piping`, {
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

    // ✅ Refresh LPT offer table
    dispatch(getLptOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
  dispatch(getLptNdtDataFromWeldVisualPiping({page:currentPage, limit,search,project_id:localStorage.getItem('U_PROJECT_ID')}));
    // Remove from submitArr if present
    setSubmitArr(prev => prev.filter(e => e._id !== row._id));

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

      const handleSubmit = async () => {
  try {
    console.log("submitArr",submitArr);
    if (!submitArr || submitArr.length === 0) {
      toast.error("Please select at least one item before submitting");
      return;
    }

    // Prepare payload for backend
    const itemsPayload = submitArr.map((e) => ({
        lpt_offer_item_id: e._id,
      lpt_lot_book_id: e?.lpt_lot_book_id,
        lpt_lot_book_item_id: e?.lpt_lot_book_item_id,
      weld_visual_id: e?.weld_visual_id,
      weld_visual_item_id: e?.weld_visual_item_id,
      welder_id: e?.welder_id,
       ndt_master_id: e.ndt_master_id,
      drawing_id: e?.drawing_id,
      spool_no_id: e?.spool_no_id,
      joint_spool_item_id: e?.joint_spool_item_id,
      joint_type_id: e?.joint_type_id,
      piping_class:e?.piping_class_id,
      piping_material_specification:e?.piping_material_specification_id,
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
      `${V_URL}/user/manage-lpt-ndt-inspection-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
        },
      }
    );

    if (res.data?.success) {
      toast.success(res.data.message);

      // Clear selection & refresh tables
      setSubmitArr([]);
      dispatch(getLptNdtDataFromWeldVisualPiping({
        page: currentPage,
        limit,
        search,
        project_id: localStorage.getItem("U_PROJECT_ID"),
      }));
      dispatch(getLptOffer({ project_id: localStorage.getItem("U_PROJECT_ID") }));
setShowBtn(true);
      // Optional: reset UI
    //   handleRefresh();
    } else {
      toast.error(res.data?.message);
    }

  } catch (err) {
    console.error("Error submitting LPT Inspection:", err);
    toast.error("Something went wrong while submitting");
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
                    <NdtOfferHeader name={'Liquid Penetrant Testing Offer List'} isPiping={true}/>

                    <LptItemsList
                        name={'Liquid Penetrant Test Offer List'}
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

                    <LptOfferTable 
                      handleSaveClick={handleSaveClick}
                        handleRemove={handleRemove} 
                        tableData={lptOfferTableData} 
                        setSubmitArr={setSubmitArr} />

                    <SubmitButton
                        disable={loading}
                        handleSubmit={handleSubmit}
                        link={'/piping/user/lpt-offer-management'}
                        buttonName={'Generate LPT Offer'}
                    />
                    {showBtn && <LptCompletedList />}
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

export default MultiLptOffer