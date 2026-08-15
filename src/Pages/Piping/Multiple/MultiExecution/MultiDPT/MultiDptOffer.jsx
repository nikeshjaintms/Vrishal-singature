import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserNdtMaster } from '../../../../../Store/Store/Ndt/NdtMaster';
import { getMultiNdtOffer } from '../../../../../Store/MutipleDrawing/MultiNDT/TestNdtOffer/MultiTestOfferList';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import toast from 'react-hot-toast';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import MultipleDptTable from '../../Components/MultiDptModal/MultipleDptTable';
import DptDrawingTable from '../../Components/DrawingTable/DptDrawingTable';
import {getFitUpDrawingDataForDpt} from '../../../../../Store/Piping/RootDpt/getFitUpDrawingDataForDpt';
import { getDptOffer } from '../../../../../Store/Piping/RootDpt/getDptOffer';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';


const MultiDptOffer = () => {
const navigate = useNavigate();
const location = useLocation();
    const dispatch = useDispatch();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitArr, setSubmitArr] = useState([]);
    const [showBtn, setShowBtn] = useState(false);
  
const data = location.state;
    useEffect(() => {
    dispatch(getDptOffer());
    // dispatch(getFitUpDrawingDataForDpt());
}, [dispatch]);

useEffect(() => {
  dispatch(
    getFitUpDrawingDataForDpt({
      page: currentPage,
      limit,
      search
    })
  );
}, [dispatch, currentPage, limit, search]);


 const dptOffers = useSelector((state) => state.getDptOffer?.data);
 console.log("dptOffers",dptOffers);
 
 const fitUpDrawingData = useSelector(
  (state) => state.getFitUpDrawingDataForDpt?.data?.data || []
);

const pagination = useSelector(
  (state) => state.getFitUpDrawingDataForDpt?.data?.pagination
);


// const fitUpDrawingData = useSelector(
//     (state) => state.getFitUpDrawingDataForDpt?.data?.data
// );
console.log("fitUpDrawingData",fitUpDrawingData);

    useEffect(() => {
        dispatch(getUserNdtMaster({ status: true })).then((response) => {
            const ndtData = response.payload?.data;
            const findNdt = ndtData?.find((nt) => nt?.name === 'DPT');
            if (findNdt && disable) {
                dispatch(getMultiNdtOffer({ status: '', type: findNdt._id }));
                setDisable(false);
            }
        }).catch((error) => console.error("Error fetching NDT Master data:", error));
    }, [disable]);

    const commentsData = useMemo(() => {
        if (!dptOffers) return [];

        let filtered = dptOffers;

        if (search) {
            filtered = filtered.filter((item) =>
                item.report_no?.toString().includes(search)
            );
        }

        // setTotalItems(filtered.length);

        return filtered;
    }, [dptOffers, search, currentPage, limit]);

  useEffect(() => {
  if (pagination?.totalItems) {
    setTotalItems(pagination.totalItems);
  }
}, [pagination]);

// 2️⃣ Update totalItems whenever filtered data changes
useEffect(() => {
    setTotalItems(commentsData.length);
}, [commentsData]);

console.log("commentsData dpt offers",commentsData);


// const handleAddToIssueArr = async (row) => {
//   try {
//     const { drawing_id, spool_no_id,  fitupData } = row;
//     console.log("fitupData========>",fitupData);

//     // 1️⃣ Find fit-up document
//     // const fitup = fitupData?.find(f =>
//     //   f.items?.some(it => String(it.drawing_id) === String(drawing_id))
//     // );
//     const fitup = fitupData?.filter(f =>
//     f.items?.some(it => String(it.drawing_id) === String(drawing_id))
//   );

// console.log("fitup===================================>",fitup);
// console.log("fitup.items==========================>",fitup.items);
// if (!fitup || fitup.length === 0) {
//   toast.error("Fit-up data not found");
//   return;
// }

// const items = fitup.flatMap(fitup =>
//   fitup.items
//     .filter(it =>
//       String(it.drawing_id) === String(drawing_id) &&
//       Array.isArray(it.jointDetails) &&
//       it.jointDetails.length > 0 &&
//       it.is_added_root_dpt !== true
//     )
//     .map(it => ({
//       drawing_id,
//       spool_no_id,
//       joint_spool_item_id: it.joint_spool_item_id,
//       joint_type_id: it.joint_type_id,
//       fitUp_item_id: it._id,
//       material_item_id_1: it.material_item_id_1,
//       item_id_1: it.item_id_1,
//       material_item_id_2: it.material_item_id_2,
//       item_id_2: it.item_id_2,
//       wps_no: it.wps_no,
//       welder_no: it.welder_no,
//       remarks: it.remarks,
//       moved_next_step: 0,
//       is_accepted: false,
//       fitUp_id: fitup._id // 🔥 IMPORTANT for backend tracking
//     }))
// );

//   //   if (!fitup) {
//   //     toast.error("Fit-up data not found");
//   //     return;
//   //   }

    

//   //   const items = fitup.items
//   // .filter(it =>
//   //   String(it.drawing_id) === String(drawing_id) &&
//   //   Array.isArray(it.jointDetails) &&
//   //   it.jointDetails.length > 0 &&
//   //   it.is_added_root_dpt !== true   // 🔥 KEY FIX
//   // )
//   // .map(it => ({
//   //   drawing_id,
//   //   spool_no_id,
//   //   joint_spool_item_id: it.joint_spool_item_id,
//   //   joint_type_id:it.joint_type_id,
//   //   fitUp_item_id: it._id,
//   //   material_item_id_1: it.material_item_id_1,
//   //   item_id_1: it.item_id_1,
//   //   material_item_id_2: it.material_item_id_2,
//   //   item_id_2: it.item_id_2,
//   //   wps_no: it.wps_no,
//   //   welder_no: it.welder_no,
//   //   remarks: it.remarks,
//   //   moved_next_step: 0,
//   //   is_accepted: false
//   // }));

// console.log("items",items);
//      if (!items.length) {
//       toast.error("No valid joints found for this drawing & spool");
//       return;
//     }
// console.log("items in handleAdd to Arr======================>?",items);
//     // 3️⃣ Submit
//     const formData = new URLSearchParams();
//     formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
//     // formData.append("fitUp_id", fitup._id);
//     formData.append("items", JSON.stringify(items));

//     const res = await axios.post(
//       `${V_URL}/user/manage-dpt-piping`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
//         }
//       }
//     );

//     if (res.data?.success) {
//       toast.success("DPT Offer created successfully");
//       dispatch(getDptOffer());
//       // setSubmitArr(prev => [...prev, ...items]);
// //       setSubmitArr(prev => [
// //   ...prev,
// //   { fitup, items } // nest items under fitup
// // ]);


// setSubmitArr(prev => {
//   const index = prev.findIndex(f => f.fitup._id === fitup._id);
//   if (index !== -1) {
//     // Merge items instead of replacing
//     const updated = [...prev];
//     const existingItems = updated[index].items;

//     // Add only new items
//     const newItems = items.filter(
//       it => !existingItems.some(ei => ei.fitUp_item_id === it.fitUp_item_id)
//     );

//     updated[index] = {
//       fitup,
//       items: [...existingItems, ...newItems],
//     };
//     return updated;
//   }

//   return [...prev, { fitup, items }];
// });

//     } else {
//       toast.error(res.data?.message || "Failed to create DPT offer");
//     }

//   } catch (err) {
//     console.error(err);
//     toast.error("Something went wrong");
//   }
// };

const handleAddToIssueArr = async (row) => {
  try {
    const { drawing_id, spool_no_id, fitupData } = row;

    console.log("fitupData ===>", fitupData);

    if (!Array.isArray(fitupData) || fitupData.length === 0) {
      toast.error("Fit-up data not available");
      return;
    }

    // 🔹 Step 1 : Find matching fitup documents
    const matchedFitups = fitupData.filter(f => {
      const items = Array.isArray(f.items) ? f.items : [f.items];

      return items.some(
        it => String(it.drawing_id) === String(drawing_id)
      );
    });

    console.log("matchedFitups ===>", matchedFitups);

    if (!matchedFitups.length) {
      toast.error("Fit-up data not found for this drawing");
      return;
    }

    // 🔹 Step 2 : Extract valid joints
    const items = matchedFitups.flatMap(f => {
      const fitupItems = Array.isArray(f.items) ? f.items : [f.items];

      return fitupItems
        .filter(it =>
          String(it.drawing_id) === String(drawing_id) &&
          it.is_added_root_dpt !== true
        )
        .map(it => ({
          drawing_id,
          spool_no_id,
          joint_spool_item_id: it.joint_spool_item_id,
          joint_type_id: it.joint_type_id,
          fitUp_item_id: it._id,
          material_item_id_1: it.material_item_id_1,
          item_id_1: it.item_id_1,
          material_item_id_2: it.material_item_id_2,
          item_id_2: it.item_id_2,
          wps_no: it.wps_no,
          welder_no: it.welder_no,
          remarks: it.remarks,
          moved_next_step: 0,
          is_accepted: false,
          fitUp_id: f._id
        }));
    });

    console.log("items ===>", items);

    if (!items.length) {
      toast.error("No valid joints available for Root DPT");
      return;
    }

    // 🔹 Step 3 : API Call
    const formData = new URLSearchParams();
    formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    formData.append("items", JSON.stringify(items));

    const res = await axios.post(
      `${V_URL}/user/manage-dpt-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
        }
      }
    );

    if (!res.data?.success) {
      toast.error(res.data?.message || "Failed to create DPT offer");
      return;
    }

    toast.success("DPT Offer created successfully");

    dispatch(getDptOffer());

    // 🔹 Step 4 : Update local state
    setSubmitArr(prev => {
      let updated = [...prev];

      items.forEach(item => {
        const index = updated.findIndex(
          f => f.fitup_id === item.fitUp_id
        );

        if (index !== -1) {
          const exists = updated[index].items.some(
            i => i.fitUp_item_id === item.fitUp_item_id
          );

          if (!exists) {
            updated[index].items.push(item);
          }
        } else {
          updated.push({
            fitup_id: item.fitUp_id,
            items: [item]
          });
        }
      });

      return updated;
    });

  } catch (err) {
    console.error("handleAddToIssueArr error:", err);
    toast.error("Something went wrong");
  }
};

console.log("After add ", submitArr);
    const handleShowList = () => {
        setShowBtn(!showBtn);
    }

const handleSaveClick = async (
  rowIndex,
  itemIndex,
  jointIndex,
  editFormData,
  setEditRowIndex
) => {
  try {

    console.log("rowIndex",rowIndex);
    console.log("itemIndex",itemIndex);

    const row = commentsData[rowIndex];
    console.log("row",row);
    const item = row.items[itemIndex];
    console.log("item",item);


    // 1️⃣ Backend update
    const formData = new URLSearchParams();
    formData.append("offer_id", row._id);
    formData.append("item_id", item._id);
    formData.append("welder_no", editFormData.welder_no);
    formData.append("remarks", editFormData.remarks);

    const res = await axios.post(
      `${V_URL}/user/update-dpt-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (!res.data?.success) {
      toast.error("Update failed");
      return;
    }

    toast.success("Updated successfully");

    // 2️⃣ 🔥 SYNC submitArr (THIS WAS MISSING)
setSubmitArr(prev => {
  console.log("🟢 Previous submitArr:", prev);
  console.log("🟢 Edited item fitUp_item_id:", item.fitUp_item_id);

  return prev.map(fitupObj => {

    // match FITUP
    if (String(fitupObj.fitup_id) !== String(item.fitUp_id)) {
      return fitupObj;
    }

    return {
      ...fitupObj,
      items: fitupObj.items.map(submitItem => {

        // match item
        if (
          String(submitItem.fitUp_item_id) !==
          String(item.fitUp_item_id)
        ) {
          return submitItem;
        }

        // update values
        return {
          ...submitItem,
          welder_no: editFormData.welder_no,
          remarks: editFormData.remarks
        };
      })
    };
  });
});

    setEditRowIndex?.(null);
    dispatch(getDptOffer());
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};
console.log("After update  ", submitArr);

useEffect(() => {
    console.log("Current Submit Array State:", submitArr);
}, [submitArr]);



// const handleSubmit = async () => {
//   try {
//     if (!submitArr.length) {
//       toast.error("Please add at least one item");
//       return;
//     }

//     setLoading(true);

//     // ✅ FILTER already-added joints
//     const payload = submitArr.flatMap(({ fitup, items }) =>
//       items
//         .filter(it => it.is_added_root_dpt !== true) // 🔑 KEY FIX
//         .map(it => ({
//           fitUp_id: fitup._id,
//           drawing_id: it.drawing_id,
//           spool_no_id :it.spool_no_id,
//           joint_spool_item_id: it.joint_spool_item_id,
//           joint_type_id:it.joint_type_id,
//           fitUp_item_id: it.fitUp_item_id,
//           material_item_id_1: it.material_item_id_1,
//           item_id_1: it.item_id_1,
//           material_item_id_2: it.material_item_id_2,
//           item_id_2: it.item_id_2,
//           welder_no: it.welder_no ?? null,
//           wps_no: it.wps_no ?? null,
//           remarks: it.remarks ?? "",
//           moved_next_step: 0,
//           is_accepted: false,
//         }))
//     );

//     if (!payload.length) {
//       toast.error("No new joints to generate DPT");
//       setLoading(false);
//       return;
//     }

//     const formData = new URLSearchParams();
//     formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
//     formData.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
//     formData.append("offered_by", localStorage.getItem("PAY_USER_ID"));
//     formData.append("items", JSON.stringify(payload));

//     const response = await axios.post(
//       `${V_URL}/user/manage-dpt-inspection-piping`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       }
//     );

//     if (response.data?.success) {
//       toast.success("DPT Inspection created successfully");
//       setSubmitArr([]);
//       dispatch(getDptOffer());
//       dispatch(
//     getFitUpDrawingDataForDpt({
//       page: currentPage,
//       limit,
//       search
//     })
//   );
//       navigate("/piping/user/dpt-management");
//     } else {
//       toast.error(response.data?.message || "Failed to create DPT Inspection");
//     }
//   } catch (err) {
//     console.error(err);
//     toast.error("Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async () => {
  try {

    if (!submitArr.length) {
      toast.error("Please add at least one item");
      return;
    }

    setLoading(true);

    const payload = submitArr.flatMap(({ fitup_id, items }) =>
      items
        .filter(it => it.is_added_root_dpt !== true)
        .map(it => ({
          fitUp_id: fitup_id,
          drawing_id: it.drawing_id,
          spool_no_id: it.spool_no_id,
          joint_spool_item_id: it.joint_spool_item_id,
          joint_type_id: it.joint_type_id,
          fitUp_item_id: it.fitUp_item_id,
          material_item_id_1: it.material_item_id_1,
          item_id_1: it.item_id_1,
          material_item_id_2: it.material_item_id_2,
          item_id_2: it.item_id_2,
          welder_no: it.welder_no ?? null,
          wps_no: it.wps_no ?? null,
          remarks: it.remarks ?? "",
          moved_next_step: 0,
          is_accepted: false
        }))
    );

    if (!payload.length) {
      toast.error("No new joints to generate DPT");
      setLoading(false);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    formData.append("project_name", localStorage.getItem("PAY_USER_PROJECT_NAME"));
    formData.append("offered_by", localStorage.getItem("PAY_USER_ID"));
    formData.append("items", JSON.stringify(payload));

    const response = await axios.post(
      `${V_URL}/user/manage-dpt-inspection-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        }
      }
    );

    if (response.data?.success) {
      toast.success("DPT Inspection created successfully");

      setSubmitArr([]);

      dispatch(getDptOffer());

      dispatch(
        getFitUpDrawingDataForDpt({
          page: currentPage,
          limit,
          search
        })
      );

      navigate("/piping/user/dpt-management");
    } 
    else {
      toast.error(response.data?.message || "Failed to create DPT Inspection");
    }

  } 
  catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } 
  finally {
    setLoading(false);
  }
};

const handleRemove = async (rowIndex, itemIndex, jointIndex) => {
  const row = commentsData[rowIndex];       // row = entire offer
  const item = row.items[itemIndex];        // item in row
  const joint = item.jointDetails[jointIndex]; // joint inside item

  console.log("Row ID (offer _id):", row._id); // This is what you want

  if (!row?._id) return toast.error("Row ID not found");

  try {
    const token = localStorage.getItem("PAY_USER_TOKEN");

    const res = await axios.delete(`${V_URL}/user/delete-dpt-offer`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: { _id: row._id }
    });

    console.log("DELETE response:", res.data); // ✅ add this
    if (res.data && res.data.success) {
      toast.success("Deleted successfully");

      // 1️⃣ Update commentsData in UI
      const updatedData = [...commentsData];
      updatedData.splice(rowIndex, 1);
      dispatch(getDptOffer()); // reload data if needed

      // 2️⃣ Update submitArr to remove deleted items
setSubmitArr(prev => {

  const updated = prev
    .map(fitupObj => {

      // match fitup id
      if (String(fitupObj.fitup_id) !== String(item.fitUp_id)) {
        return fitupObj;
      }

      const filteredItems = fitupObj.items.filter(it =>
        String(it.fitUp_item_id) !== String(item.fitUp_item_id)
      );

      return {
        ...fitupObj,
        items: filteredItems
      };
    })
    .filter(f => f.items.length > 0);

  return updated;
});

}else {
      toast.error(res.data?.message || "Delete failed");
    }

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
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
                    {/* <NdtOfferHeader name={'DPT Offer List'} /> */}
                      <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "DPT Inspection Offer List", link: "/piping/user/dpt-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} DPT Inspection Offer`, active: true }
                       
                    ]} />
                  {/* <DptDrawingTable setSubmitArr={fitUpDrawingData} /> */}
                  <DptDrawingTable tableTitle={'Drawing List'} 
                   limit={limit}
                        setlimit={setLimit}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setSearch={setSearch}
                  data={fitUpDrawingData} handleAddToIssueArr={handleAddToIssueArr} />

              
                   <MultipleDptTable
                        name={'DPT Offer List'}
                        commentsData={commentsData}
                        limit={limit}
                        setlimit={setLimit}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setSearch={setSearch}
                        handleRefresh={() => dispatch(getDptOffer())} 
                        showBtn={showBtn}
                        handleRemove={handleRemove}
                        handleShowList={handleShowList}
                        handleAddToIssueArr={handleAddToIssueArr}
                        handleSaveClick={handleSaveClick}
                        setSubmitArr={setSubmitArr}
                    />

                    <SubmitButton
                        disable={loading}
                        handleSubmit={handleSubmit}
                        link={'/piping/user/dpt-offer-management'}
                        buttonName={'Generate DPT Offer'}
                    />
                  
                </div>
            </div>
        
        </div>
    )
}

export default MultiDptOffer