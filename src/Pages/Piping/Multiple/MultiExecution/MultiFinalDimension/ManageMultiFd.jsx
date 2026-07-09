import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import FdDrawingTable from '../../Components/DrawingTable/FdDrawingTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import MultiFdTable from '../../Components/MultiFdModal/MultiFdTable';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import {getFdDataFromNdt} from '../../../../../Store/Piping/MultiFdPiping/getFdDataFromNdt';
import { getFdOfferTablePiping } from '../../../../../Store/Piping/MultiFdPiping/getFdOfferTablePiping';

const useDebounce = (value, delay = 600) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
          const timer = setTimeout(() => setDebouncedValue(value), delay);
          return () => clearTimeout(timer);
        }, [value, delay]);
        return debouncedValue;
      
      }
const ManageMultiFd = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [entity, setEntity] = useState([]);
    const [issueFd, setIssueFd] = useState([]);
    const [finalArr, setFinalArr] = useState([]);
    const [isFd, setIsFd] = useState(null); 
    const data = location.state;
    const debouncedSearch = useDebounce(search, 600);

    useEffect(() => {
         dispatch(getFdDataFromNdt({page:currentPage, limit, search: debouncedSearch, project_id:localStorage.getItem('U_PROJECT_ID')}));
        
    }, [currentPage,limit,dispatch,debouncedSearch]);
    
   useEffect(() => {
        
         dispatch(getFdOfferTablePiping({ project_id: localStorage.getItem('U_PROJECT_ID') }));
    }, [dispatch]);
    
       useEffect(() => {
            if (location.state?._id) {
                setIssueFd({
                    name: data?.items[0]?.drawing_id?.issued_person?._id
                });
                setFinalArr(data?.items);
                setIsFd(data?.isFd);
            }
        }, [location.state]);

     const fdDataFromNdt = useSelector((state) => state?.getFdDataFromNdt?.data);
     const pagination = useSelector((state) => state?.getFdDataFromNdt?.pagination);

     const fdOfferTablePiping = useSelector((state) => state?.getFdOfferTablePiping?.user?.data);
     console.log("fdOfferTablePiping ", fdOfferTablePiping);
    console.log('fdDataFromNdt', fdDataFromNdt);

    const commentsData = useMemo(() => {
       
        let computedComments = fdDataFromNdt || [];
       
        return computedComments;
        // ?.slice(
        //     (currentPage - 1) * limit,
        //     (currentPage - 1) * limit + limit
        // );
    }, [search, entity, fdDataFromNdt]);

    console.log("commentsData", commentsData);

useEffect(() => {
    setTotalItems(pagination?.totalItems || 0);
}, [pagination]);

// const handleAddToAssr = async (row) => {
//     console.log("Clicked Row:", row);

//     if (!row?.weldVisualData?.length) {
//         toast.error("No weld visual data found");
//         return;
//     }

//     try {
//         setDisable(true);

//         // Flatten weld visual items
//       const formattedItems = row.weldVisualData.flatMap(wv =>
//   (wv.items || [])
// //    .filter(item => !item.is_added_Fd)
// .filter(item => {
//   console.log("Filtering:", item._id, item.is_added_Fd);
//   return item.is_added_Fd !== true;
// })

//   .map(item => ({
//     drawing_id: item.drawing_id,
//     spool_no_id: item.spool_no_id,
//     joint_spool_item_id: item.joint_spool_item_id,
//     joint_type_id: item.joint_type_id,

//     weld_visual_id: wv._id, // ✅ FIXED HERE
//     weld_visual_item_id: item._id,

//     fitUp_id: item.fitUp_id || null,
//     fitUp_item_id: item.fitUp_item_id || null,
//     rootDpt_id: item.rootDpt_id || null,
//     rootDpt_item_id: item.rootDpt_item_id || null,
//     wps_no: item.wps_no || null,
//     welder_no: item.welder_no || null,
//     required_dimension: "",
//     moved_next_step: 0,
//     remarks: "",
//     qc_remarks: "",
//   }))
// );

// if (formattedItems.length === 0) {
//       toast.error("Already Added");
//       setDisable(false);
//       return;
//     }
//         const payload = {
//             project_id: localStorage.getItem("U_PROJECT_ID"),
//             ndt_master_id: row?.weldVisualData?.[0]?._id,
//             items: formattedItems
//         };

//         const res = await axios.post(
//             `${V_URL}/user/piping-manage-fd-offer`,
//             payload,
//               {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
//         }
//       }
//         );

//         if (res.data.success) {
//             toast.success(res.data.message);
//  dispatch(getFdOfferTablePiping({ project_id: localStorage.getItem('U_PROJECT_ID') }));
//   dispatch(getFdDataFromNdt({
//         page: currentPage,
//         limit,
//         search: '',
//         project_id: localStorage.getItem('U_PROJECT_ID')
//       }));

//             // Optional: update UI
//             setFinalArr(prev => [...prev, ...formattedItems]);
//         }

//     } catch (err) {
//         console.error(err);
//         toast.error(err?.response?.data?.message || "Something went wrong");
//     } finally {
//         setDisable(false);
//     }
// };

const handleAddToAssr = async (row) => {
  console.log("row====>", row);
  if (!row?.weldVisualData?.length) {
    toast.error("No weld visual data found");
    return;
  }

  try {
    setDisable(true);

    // 🔥 Get first weld visual entry
    const firstWv = row.weldVisualData[0];

    if (!firstWv?.items?.length) {
      toast.error("No weld items found");
      setDisable(false);
      return;
    }

    // 🔥 Get only FIRST not-added item
    const firstItem = firstWv.items.find(
      item => item.is_added_Fd !== true
    );

    if (!firstItem) {
      toast.error("Already Added");
      setDisable(false);
      return;
    }

    // const formattedItem = {
    //   drawing_id: firstItem.drawing_id,
    //   spool_no_id: firstItem.spool_no_id,
    //   joint_spool_item_id: firstItem.joint_spool_item_id,
    //   joint_type_id: firstItem.joint_type_id,

    //   weld_visual_id: firstWv._id,
    //   weld_visual_item_id: firstItem._id,

    //   fitUp_id: firstItem.fitUp_id || null,
    //   fitUp_item_id: firstItem.fitUp_item_id || null,
    //   rootDpt_id: firstItem.rootDpt_id || null,
    //   rootDpt_item_id: firstItem.rootDpt_item_id || null,
    //   wps_no: firstItem.wps_no || null,
    //   welder_no: firstItem.welder_no || null,

    //   required_dimension: "",
    //   moved_next_step: 0,
    //   remarks: "",
    //   qc_remarks: "",
    // };

    const formattedItem = firstWv.items
  .filter(item => !item.is_added_Fd)
  .map(item => ({
    drawing_id: item.drawing_id,
    spool_no_id: item.spool_no_id,
    joint_spool_item_id: item.joint_spool_item_id,
    joint_type_id: item.joint_type_id,
    weld_visual_id: firstWv._id,
    weld_visual_item_id: item._id,
    fitUp_id: item.fitUp_id || null,
    fitUp_item_id: item.fitUp_item_id || null,
    rootDpt_id: item.rootDpt_id || null,
    rootDpt_item_id: item.rootDpt_item_id || null,
    wps_no: item.wps_no || null,
    welder_no: item.welder_no || null,
    required_dimension: "",
    moved_next_step: 0,
    remarks: "",
    qc_remarks: "",
  }));

    const payload = {
      project_id: localStorage.getItem("U_PROJECT_ID"),
      ndt_master_id: firstWv._id,
      items: [formattedItem], // ✅ ONLY ONE ITEM
    };

    const res = await axios.post(
      `${V_URL}/user/piping-manage-fd-offer`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      dispatch(getFdOfferTablePiping({
        project_id: localStorage.getItem('U_PROJECT_ID')
      }));

      dispatch(getFdDataFromNdt({
        page: currentPage,
        limit,
        search,
        project_id: localStorage.getItem('U_PROJECT_ID')
      }));
    }

  } catch (err) {
    toast.error("Something went wrong");
  } finally {
    setDisable(false);
  }
};

const handleSaveClick = async (index, row, editedData) => {
    console.log("Saving Row:", row);
  try {
    const payload = {
      offer_id: row?._id,          // main offer document id
      item_id: row?.items?._id, // item id inside items array
      required_dimension: editedData.required_dimension,
      remarks: editedData.remarks,
    };

    const res = await axios.post(
      `${V_URL}/user/update-fd-piping`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success("Item updated successfully");
      dispatch(getFdOfferTablePiping({
        project_id: localStorage.getItem("U_PROJECT_ID"),
      }));
    }

  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Update failed");
  }
};

const handleRemove = async (offerId) => {
  try {
    const res = await axios.delete(
      `${V_URL}/user/delete-fd-offer-piping`,
      {
        data: { _id: offerId }, // IMPORTANT for DELETE
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      dispatch(getFdOfferTablePiping({
        project_id: localStorage.getItem("U_PROJECT_ID"),
      }));

      // ✅ VERY IMPORTANT: Refresh Weld Visual Data
      dispatch(getFdDataFromNdt({
        page: currentPage,
        limit,
        search,
        project_id: localStorage.getItem('U_PROJECT_ID')
      }));

    }

  } catch (err) {
    console.error(err);
    toast.error("Delete failed");
  }
};

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
   
// const handleSubmit = async () => {
//   try {
//     const latestData = fdOfferTablePiping || [];

//     console.log("Submitting Items:", latestData);

//     if (!latestData.length) {
//       toast.error("Please add at least one item");
//       return;
//     }


//     setDisable(true);

//     const filteredData = latestData.map(row => {
//   const item = row.items || {};
// console.log("item====>",item);
//   return {
//     drawing_id: item.drawing_id || null,
//     spool_no_id: item.spool_no_id || null,
//     joint_spool_item_id: item.joint_spool_item_id || null,
//     joint_type_id: item.joint_type_id || null,
//     weld_visual_id: item.weld_visual_id || null,
//     weld_visual_item_id: item.weld_visual_item_id || null,
//     fitUp_id: item.fitUp_id || null,
//     fitUp_item_id: item.fitUp_item_id || null,
//     wps_no: item.wps_no || null,
//     welder_no: item.welder_no || null,
//     required_dimension:item.required_dimension || null,
//     remarks: item.remarks || "",
//   };
// });

// console.log("filterdData",filteredData);
//     const payload = {
//       project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
//       project_id: localStorage.getItem("U_PROJECT_ID"),
//       offered_by: localStorage.getItem("PAY_USER_ID"),
//       isHydroTesting: isFd === "hydro_testing",
//   isBlastingPainting: isFd === "blasting_painting",
//   isSiteDispatch: isFd === "site_dispatch",

//       items: filteredData
//     };
// console.log("payload",payload);
//     const res = await axios.post(
//       `${V_URL}/user/manage-fd-inspection-piping`,
//       payload,
//       {
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     if (res.data.success) {
//       toast.success(res.data.message);

//       dispatch(getFdOfferTablePiping({
//         project_id: localStorage.getItem("U_PROJECT_ID"),
//       }));

//       dispatch(getFdDataFromNdt({
//         page: currentPage,
//         limit,
//         search: '',
//         project_id: localStorage.getItem("U_PROJECT_ID"),
//       }));

//       navigate("/piping/user/final-dimension-offer-management");
//     }

//   } catch (error) {
//     console.error(error);
//     toast.error(error?.response?.data?.message);
//   } finally {
//     setDisable(false);
//   }
// };


 const handleSubmit = async () => {
    if (!isFd) {
    toast.error("Please select a procedure before submitting.");
    return;
  }
  try {
    const latestData = fdOfferTablePiping || [];

    if (!latestData.length) {
      toast.error("Please add at least one item");
      return;
    }

      for (let i = 0; i < latestData.length; i++) {
    const itemObj = latestData[i].items || {};
    if (!itemObj.required_dimension || itemObj.required_dimension.trim() === "") {
      toast.error(`Please enter required dimension for item at row ${i + 1}`);
      return;
    }
  }
    setDisable(true);

    // Transform latestData to match backend schema
    const itemsPayload = latestData.map(row => {
      const itemObj = row.items || {};
      const weldItems = itemObj.weld_visual_id_data || [];

      return {
        drawing_id: itemObj.drawing_id || null,
        spool_no_id: itemObj.spool_no_id || null,
        weld_visual_id_data: weldItems.map(wvItem => ({
          weld_visual_id: wvItem.weld_visual_id || null,
          weld_visual_item_id: wvItem.weld_visual_item_id || null,
          joint_spool_item_id: wvItem.joint_spool_item_id || null,
          joint_type_id: wvItem.joint_type_id || null,
        })),
        required_dimension: itemObj.required_dimension || "",
        remarks: itemObj.remarks || "",
        qc_remarks: itemObj.qc_remarks || "",
        moved_next_step: itemObj.moved_next_step || 0,
      };
    });

    if (!itemsPayload.length) {
      toast.error("No items to submit");
      setDisable(false);
      return;
    }

    const payload = {
      project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
      project_id: localStorage.getItem("U_PROJECT_ID"),
      offered_by: localStorage.getItem("PAY_USER_ID"),
      isHydroTesting: isFd === "hydro_testing",
      isBlastingPainting: isFd === "blasting_painting",
      isSiteDispatch: isFd === "site_dispatch",
      items: itemsPayload,
    };

    console.log("Submitting payload:", payload);

    const res = await axios.post(
      `${V_URL}/user/manage-fd-inspection-piping`,
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      dispatch(getFdOfferTablePiping({ project_id: localStorage.getItem("U_PROJECT_ID") }));
      dispatch(getFdDataFromNdt({ page: currentPage, limit, search, project_id: localStorage.getItem("U_PROJECT_ID") }));

      navigate("/piping/user/final-dimension-offer-management");
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setDisable(false);
  }
};

const handleStatusChange = (event) => {
  setIsFd(event.target.value);
};

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Final Dimension Inspection Offer List", link: "/piping/user/final-dimension-offer-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Final Dimension Inspection Offer`, active: true }
                        ]} />

                           {/* {data?._id && (
      <div className="mb-3">
        <strong>Selected Procedure: </strong>
        <span className="badge bg-info text-dark">
          {isFd === true ? 'Surface Prepare for Primers' : 'Release for Site Dispatch'}
        </span>
      </div>
    )} */}

                        <FdDrawingTable
                            tableTitle={'Drawing List'}
                            commentsData={commentsData}
                            handleAddToIssueArr={handleAddToAssr}
                            currentPage={currentPage}
                            limit={limit}
                            setlimit={setlimit}
                            totalItems={totalItems}
                            setCurrentPage={setCurrentPage}
                            setSearch={setSearch}
                            data={data}
                        />

                        <MultiFdTable
                            data={fdOfferTablePiping}
                            finalArr={finalArr}
                            // setSubmitArr={setSubmitArr}
                             handleSaveClick={handleSaveClick}
                            handleRemove={handleRemove}
                        />

                        <SubmitButton finalReq={data?.items} link='/piping/user/final-dimension-offer-management'
                          showFinalDimension={true}   disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Final Dimension Offer'} isFd={isFd} handleStatusChange={handleStatusChange}
                             data={data}   />  
                             
                                                          
                    </div>
                </div>
            </div>
         
        </>
    )
}

export default ManageMultiFd