import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import WeldVisualDrawingTable from '../../Components/DrawingTable/WeldVisualDrawingTable';
import MultiWeldTable from '../../Components/MultiWeldModal/MultiWeldTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getFitUpDrawingDataForWeldVisual } from '../../../../../Store/Piping/WeldVisual/getFitUpDrawingDataForWeldVisual';
// import { getRootDptDrawingDataForWeldVisual } from '../../../../../Store/Piping/WeldVisual/getRootDptDrawingDataForWeldVisual';
import { getWeldVisualOffer } from '../../../../../Store/Piping/WeldVisual/getWeldVisualOffer';
const ManageMultiWeldVisual = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [weld, setWeld] = useState({ fitup: '' });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    // const [search, setSearch] = useState('');
    const [drawingSearch, setDrawingSearch] = useState('');
const [tableSearch, setTableSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [finalFit, setFinalFit] = useState([]);
 
    const [finalArr, setFinalArr] = useState([]);
 
    const [entity, setEntity] = useState([]);
    const [submitArr, setSubmitArr] = useState([]);

    const data = location.state;

    useEffect(() => {
        dispatch(getWeldVisualOffer());
        // dispatch(getFitUpDrawingDataForWeldVisual());
        // dispatch(getRootDptDrawingDataForWeldVisual());
    }, []);
useEffect(() => {
  dispatch(
    getFitUpDrawingDataForWeldVisual({
      page: currentPage,
      limit,
      search:drawingSearch
    })
  );
}, [dispatch, currentPage, limit, drawingSearch]);
    const fitupAccData = useSelector((state) => state?.getMultiFitup?.user?.data?.data);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);

     const weldVisualOffers = useSelector((state) => state.getWeldVisualOffer?.data);
 console.log("weldVisualOffers",weldVisualOffers);

const fitUpDrawingData = useSelector(
    (state) => state.getFitUpDrawingDataForWeldVisual?.data?.data
);

const pagination = useSelector(
  (state) => state.getFitUpDrawingDataForWeldVisual?.data?.pagination
);
console.log("fitUpDrawingData",fitUpDrawingData);
// const rootDptDrawingData = useSelector(
//     (state) => state.getRootDptDrawingDataForWeldVisual?.data
// );
// console.log("rootDptDrawingData",rootDptDrawingData);
  useEffect(() => {
  if (pagination?.totalItems) {
    setTotalItems(pagination.totalItems);
  }
}, [pagination]);

    useEffect(() => {
        if (data) {
            setWeld({ fitup: data?.fitUp_id?._id })
        }
    }, [data]);

    useEffect(() => {
        const filterFitup = fitupAccData?.filter((e) => e?.status === 2)
            .map(issue => {
                const isCompleted = issue.items.every(item => (item.fitOff_used_grid_qty || 0) - (item.moved_next_step || 0) === 0);
                return { ...issue, isCompletedStatus: isCompleted ? "Completed" : "Balance" };
            });
        setFinalFit(filterFitup);
    }, [fitupAccData]);

    useEffect(() => {
        const filterData = finalFit?.find((fi) => fi?._id === weld.fitup);
        if (filterData) {
            const drawIds = filterData?.items?.map((it) => it?.drawing_id);
            const drawFilter = drawData?.filter((dr) => drawIds?.includes(dr?._id));
            setEntity(drawFilter);
        }
    }, [weld.fitup, data?._id, finalFit]);

    const handleChange = (e, name) => {
        setWeld({ ...weld, [name]: e.value });
    }


// const handleAddToArr = async (row) => {
//   try {
//     const { drawing_id, spool_no_id, fitupData, rootDptData } = row;

//     // Prepare all items from FitUpData
//     const fitupItems = (fitupData || []).flatMap(fitup =>
//       (fitup.items || [])
//         .filter(it =>
//           String(it.drawing_id) === String(drawing_id) &&
//           Array.isArray(it.jointDetails) &&
//           it.jointDetails.length > 0 &&
//           it.is_added_weld_visual !== true
//         )
//         .map(it => ({
//           type: "fitup",
//           drawing_id,
//           spool_no_id,
//           joint_spool_item_id:it.joint_spool_item_id,
//           joint_type_id:it.joint_type_id,
//           fitUp_id: fitup._id,
//           fitUp_item_id: it._id,
//           material_item_id_1: it.material_item_id_1,
//           item_id_1: it.item_id_1,
//           material_item_id_2: it.material_item_id_2,
//           item_id_2: it.item_id_2,
//           wps_no: it.wps_no,
//           welder_no: it.welder_no,
//           // remarks: it.remarks,
//           moved_next_step: 0,
//           is_accepted: false
//         }))
//     );
// console.log("fitupItems",fitupItems);
//     // Prepare all items from RootDptData
//     const rootDptItems = (rootDptData || []).flatMap(root =>
//       (root.items || [])
//         .filter(it =>
//           String(it.drawing_id) === String(drawing_id) &&
//           Array.isArray(it.jointDetails) &&
//           it.jointDetails.length > 0 &&
//           it.is_added_root_dpt !== true
//         )
//         .map(it => ({
//           type: "rootDpt",
//           drawing_id,
//           spool_no_id,
//           joint_spool_item_id:it.joint_spool_item_id,
//           joint_type_id:it.joint_type_id,
//           rootDpt_id: root._id,
//           rootDpt_item_id: it._id,
//           // fitUp_id: it.fitUp_id,
//           // fitUp_item_id: it.fitUp_item_id,
//           material_item_id_1: it.material_item_id_1,
//           item_id_1: it.item_id_1,
//           material_item_id_2: it.material_item_id_2,
//           item_id_2: it.item_id_2,
//           wps_no: it.wps_no,
//           welder_no: it.welder_no,
//           // remarks: it.remarks,
//           moved_next_step: 0,
//           is_accepted: false
//         }))
//     );

//     // Combine both
//     const items = [...fitupItems, ...rootDptItems];

//     if (!items.length) {
//       toast.error("No valid joints found for this drawing & spool");
//       return;
//     }

//     console.log("Items to add:", items);

//     // 3️⃣ Submit
//     const formData = new URLSearchParams();
//     formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
//     formData.append("items", JSON.stringify(items));

//     const res = await axios.post(
//       `${V_URL}/user/manage-weld-visual-piping`,
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
//       dispatch(getWeldVisualOffer());

//       // Update submitArr, merge by type and ID
//       setSubmitArr(prev => {
//         const updated = [...prev];

//         // Add FitUp items
//         fitupData?.forEach(fitup => {
//           const index = updated.findIndex(e => e.fitup?._id === fitup._id);
//           const newItems = items.filter(it => it.type === "fitup" && it.fitUp_id === fitup._id);
//           if (index !== -1) {
//             updated[index].items.push(...newItems.filter(it =>
//               !updated[index].items.some(ei => ei.fitUp_item_id === it.fitUp_item_id)
//             ));
//           } else if (newItems.length) {
//             updated.push({ fitup, items: newItems });
//           }
//         });

//         // Add RootDPT items
//         rootDptData?.forEach(root => {
//           const index = updated.findIndex(e => e.rootDpt?._id === root._id);
//           const newItems = items.filter(it => it.type === "rootDpt" && it.rootDpt_id === root._id);
//           if (index !== -1) {
//             updated[index].items.push(...newItems.filter(it =>
//               !updated[index].items.some(ei => ei.rootDpt_item_id === it.rootDpt_item_id)
//             ));
//           } else if (newItems.length) {
//             updated.push({ rootDpt: root, items: newItems });
//           }
//         });

//         return updated;
//       });
// //       setSubmitArr(prev => {
// //   const updated = [...prev];

// //   // Merge FitUp items
// //   items
// //     .filter(it => it.type === "fitup")
// //     .forEach(it => {
// //       const index = updated.findIndex(e => e.fitup?._id === it.fitUp_id);

// //       if (index !== -1) {
// //         if (!updated[index].items.some(ei => ei.fitUp_item_id === it.fitUp_item_id)) {
// //           updated[index].items.push(it);
// //         }
// //       } else {
// //         const fitup = fitupData.find(f => f._id === it.fitUp_id);
// //         updated.push({ fitup, items: [it] });
// //       }
// //     });

// //   // Merge RootDPT items
// //   items
// //     .filter(it => it.type === "rootDpt")
// //     .forEach(it => {
// //       const index = updated.findIndex(e => e.rootDpt?._id === it.rootDpt_id);

// //       if (index !== -1) {
// //         if (!updated[index].items.some(ei => ei.rootDpt_item_id === it.rootDpt_item_id)) {
// //           updated[index].items.push(it);
// //         }
// //       } else {
// //         const root = rootDptData.find(r => r._id === it.rootDpt_id);
// //         updated.push({ rootDpt: root, items: [it] });
// //       }
// //     });

// //   return updated;
// // });

//     } else {
//       toast.error(res.data?.message || "Failed to create DPT offer");
//     }

//   } catch (err) {
//     console.error(err);
//     toast.error("Something went wrong");
//   }
// };
const handleAddToArr = async (row) => {
  try {
    const { drawing_id, spool_no_id, fitupData = [], rootDptData = [] } = row;
console.log("row========>",row);
    const allSources = [
      { type: "fitup", data: fitupData },
      { type: "rootDpt", data: rootDptData }
    ];

    const items = [];

    allSources.forEach(source => {
      source.data.forEach(parent => {
        (parent.items || []).forEach(it => {

          const alreadyAddedInDB =
            source.type === "fitup"
              ? it.is_added_weld_visual === true
              : it.is_added_root_dpt === true;

          const alreadyInState = submitArr.some(p =>
            p.items?.some(i =>
              source.type === "fitup"
                ? String(i.fitUp_item_id) === String(it._id)
                : String(i.rootDpt_item_id) === String(it._id)
            )
          );

          if (
            String(it.drawing_id) === String(drawing_id) &&
            Array.isArray(it.jointDetails) &&
            it.jointDetails.length > 0 &&
            !alreadyAddedInDB &&
            !alreadyInState
          ) {
            items.push({
              type: source.type,
              drawing_id,
              spool_no_id,
              joint_spool_item_id: it.joint_spool_item_id,
              joint_type_id: it.joint_type_id,

              ...(source.type === "fitup"
                ? {
                    fitUp_id: parent._id,
                    fitUp_item_id: it._id
                  }
                : {
                    rootDpt_id: parent._id,
                    rootDpt_item_id: it._id
                  }),

              material_item_id_1: it.material_item_id_1,
              item_id_1: it.item_id_1,
              material_item_id_2: it.material_item_id_2,
              item_id_2: it.item_id_2,
              wps_no: it.wps_no,
              welder_no: it.welder_no,
              moved_next_step: 0,
              is_accepted: false
            });
          }
        });
      });
    });
console.log("items======>",items);
    if (!items.length) {
      toast.error("No valid joints found for this drawing & spool");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
    formData.append("items", JSON.stringify(items));

    const res = await axios.post(
      `${V_URL}/user/manage-weld-visual-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
        }
      }
    );

    if (!res.data?.success) {
      toast.error(res.data?.message || "Failed to create Weld Visual offer");
      return;
    }

    toast.success("Weld Visual offer created successfully");

    // Update submitArr safely
    setSubmitArr(prev => {
      const updated = [...prev];

      items.forEach(it => {
        const parentKey = it.type === "fitup" ? "fitUp_id" : "rootDpt_id";
        const itemKey = it.type === "fitup" ? "fitUp_item_id" : "rootDpt_item_id";

        const index = updated.findIndex(
          p =>
            String(p.fitup?._id || p.rootDpt?._id) ===
            String(it[parentKey])
        );

        if (index !== -1) {
          if (
            !updated[index].items.some(
              e => String(e[itemKey]) === String(it[itemKey])
            )
          ) {
            updated[index].items.push(it);
          }
        } else {
          updated.push({
            ...(it.type === "fitup"
              ? { fitup: { _id: it.fitUp_id } }
              : { rootDpt: { _id: it.rootDpt_id } }),
            items: [it]
          });
        }
      });

      return updated;
    });

    dispatch(getWeldVisualOffer());

    // Refresh drawings so added joints disappear
    dispatch(
      getFitUpDrawingDataForWeldVisual({
        page: currentPage,
        limit,
        search:drawingSearch
      })
    );

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};
console.log("After add ", submitArr);


  //  const commentsData = useMemo(() => {
  //       if (!weldVisualOffers) return [];

  //       let filtered = weldVisualOffers;

  //       if (search) {
  //           filtered = filtered.filter((item) =>
  //               item.report_no?.toString().includes(search)
  //           );
  //       }

  //       setTotalItems(filtered.length);

  //       return filtered.slice(
  //           (currentPage - 1) * limit,
  //           (currentPage - 1) * limit + limit
  //       );
  //   }, [weldVisualOffers, search, currentPage, limit]);

// 1️⃣ Compute filtered commentsData (all items, no slicing)
const commentsData = useMemo(() => {
    if (!weldVisualOffers) return [];

    let filtered = weldVisualOffers;

    if (tableSearch) {
        filtered = filtered.filter((item) =>
            item.report_no?.toString().includes(tableSearch)
        );
    }

    return filtered;
}, [weldVisualOffers, tableSearch]);




// const handleSaveClick = async (
//   rowIndex,
//   itemIndex,
//   jointIndex,
//   editFormData,
//   setEditRowIndex
// ) => {
//   try {
//     const row = commentsData[rowIndex];
//     const item = row.items[itemIndex];
// console.log("row",row);
// console.log("item",item);
//     // 1️⃣ Backend update
//     const formData = new URLSearchParams();
//     formData.append("offer_id", row._id);
//     formData.append("item_id", item._id);
//     formData.append("welder_no", editFormData.welder_no);
//     formData.append("remarks", editFormData.remarks);

//     const res = await axios.post(
//       `${V_URL}/user/update-weld-visual-piping`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       }
//     );

//     if (!res.data?.success) {
//       toast.error("Update failed");
//       return;
//     }

//     toast.success("Updated successfully");
// console.log("Before update FitUp submitArr", submitArr);
//     // 2️⃣ 🔥 Sync submitArr (FitUp + RootDPT)
//     setSubmitArr(prev =>
//       prev.map(parentObj => {
//         // FITUP CASE
// // ✅ FIT-UP CASE (CORRECT)
// if (
//   parentObj.fitup?._id &&
//   item.fitUp_id &&
//   String(parentObj.fitup._id) === String(item.fitUp_id)
// ) {
//   return {
//     ...parentObj,
//     items: parentObj.items.map(it =>
//       String(it.fitUp_item_id) === String(item.fitUp_item_id)
//         ? {
//             ...it,
//             welder_no: editFormData.welder_no,
//             remarks: editFormData.remarks
//           }
//         : it
//     )
//   };
// }

//         // ROOT DPT CASE
//         if (
//           parentObj.rootDpt?._id &&
//           row.rootDpt?._id &&
//           String(parentObj.rootDpt._id) === String(row.rootDpt._id)
//         ) {
//           return {
//             ...parentObj,
//             items: parentObj.items.map(it =>
//               String(it.rootDpt_item_id) === String(item.rootDpt_item_id)
//                 ? {
//                     ...it,
//                     welder_no: editFormData.welder_no,
//                     remarks: editFormData.remarks
//                   }
//                 : it
//             )
//           };
//         }
// console.log("Updating FitUp submitArr", {
//   submitFitupId: parentObj.fitup?._id,
//   rowFitupId: row.items?.fitUp_id,
//   fitUpItem: item.fitUp_item_id,
//   welder: editFormData.welder_no
// });

//         return parentObj;
//       })
      
//     );
//     console.log("After update FitUp submitArr", submitArr);

//     setEditRowIndex?.(null);
//     dispatch(getWeldVisualOffer());
//   } catch (err) {
//     console.error(err);
//     toast.error("Something went wrong");
//   }
// };

const handleSaveClick = async (
  rowIndex,
  itemIndex,
  jointIndex,
  editFormData,
  setEditRowIndex
) => {
  try {
    const row = commentsData[rowIndex];
    const item = row.items[itemIndex];

    // 1️⃣ Backend update
    const formData = new URLSearchParams();
    formData.append("offer_id", row._id);
    formData.append("item_id", item._id);

    // ✅ Send welder only if valid ObjectId
    if (
      editFormData.welder_no &&
      editFormData.welder_no.length === 24
    ) {
      formData.append("welder_no", editFormData.welder_no);
    }

    // ✅ Always send remarks (never null)
    formData.append("remarks", editFormData.remarks ?? "");

    const res = await axios.post(
      `${V_URL}/user/update-weld-visual-piping`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
        },
      }
    );

    if (!res.data?.success) {
      toast.error("Update failed");
      return;
    }

    toast.success("Updated successfully");

    // 2️⃣ Sync submitArr (Clean Version)

    console.log("res tesst",res);

    console.log("Before update submitArr", submitArr);


    console.log("editFormData in handleSaveClick", editFormData);

    console.log("Updating submitArr for item", {
      submitArr: submitArr.map(obj => ({
        fitupId: obj.fitup?._id,
        rootDptId: obj.rootDpt?._id,
        items: obj.items.map(it => ({
          itemId: it._id,
          fitUpId: it.fitUp_id,
          rootDptId: it.rootDpt_id,
          welder_no: it.welder_no,
          remarks: it.remarks
        }))
      }))
      });
  setSubmitArr(prev =>
  prev.map(parentObj => {

    // ✅ FITUP CASE
    if (
      parentObj.fitup?._id &&
      item.fitUp_id &&
      String(parentObj.fitup._id) === String(item.fitUp_id)
    ) {
      return {
        ...parentObj,
        items: parentObj.items.map(it =>
          String(it.fitUp_item_id) === String(item.fitUp_item_id)
            ? {
                ...it,
                welder_no: editFormData.welder_no,
                remarks: editFormData.remarks ?? ""
              }
            : it
        )
      };
    }

    // ✅ ROOT DPT CASE
    if (
      parentObj.rootDpt?._id &&
      item.rootDpt_id &&
      String(parentObj.rootDpt._id) === String(item.rootDpt_id)
    ) {
      return {
        ...parentObj,
        items: parentObj.items.map(it =>
          String(it.rootDpt_item_id) === String(item.rootDpt_item_id)
            ? {
                ...it,
                welder_no: editFormData.welder_no,
                remarks: editFormData.remarks ?? ""
              }
            : it
        )
      };
    }

    return parentObj;
  })
);


    console.log("After update submitArr", submitArr);

    setEditRowIndex?.(null);
    dispatch(getWeldVisualOffer());
    dispatch(
  getFitUpDrawingDataForWeldVisual({
    page: currentPage,
    limit,
    search:drawingSearch
  })
);


  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


// const handleSaveClick = async (
//   rowIndex,
//   itemIndex,
//   jointIndex,
//   editFormData,
//   setEditRowIndex
// ) => {
//   try {
//     const row = commentsData[rowIndex];
//     const item = row.items[itemIndex];

//     // 1️⃣ Backend update
//     const formData = new URLSearchParams();
//     formData.append("offer_id", row._id);
//     formData.append("item_id", item._id);

//     // FitUp items: update welder_no and remarks
//     if (item.fitUp_item_id) {
//       formData.append("welder_no", editFormData.welder_no);
//     }
//     if (editFormData.welder_no) {
//   formData.append("welder_no", editFormData.welder_no);
// }
//     // Always update remarks
//     formData.append("remarks", editFormData.remarks || '');

//     const res = await axios.post(
//       `${V_URL}/user/update-weld-visual-piping`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
//         },
//       }
//     );

//     if (!res.data?.success) {
//       toast.error("Update failed");
//       return;
//     }

//     toast.success("Updated successfully");

//     // 2️⃣ Sync submitArr
//     setSubmitArr(prev =>
//       prev.map(parentObj => {
//         // FitUp update
//         if (
//           parentObj.fitup?._id &&
//           item.fitUp_id &&
//           String(parentObj.fitup._id) === String(item.fitUp_id)
//         ) {
//           return {
//             ...parentObj,
//             items: parentObj.items.map(it =>
//               String(it.fitUp_item_id) === String(item.fitUp_item_id)
//                 ? {
//                     ...it,
//                     welder_no: editFormData.welder_no, // only for FitUp
//                     remarks: editFormData.remarks
//                   }
//                 : it
//             )
//           };
//         }

//         // Root DPT: only update remarks
//         if (
//           parentObj.rootDpt?._id &&
//           row.rootDpt?._id &&
//           String(parentObj.rootDpt._id) === String(row.rootDpt._id)
//         ) {
//           return {
//             ...parentObj,
//             items: parentObj.items.map(it =>
//               String(it.rootDpt_item_id) === String(item.rootDpt_item_id)
//                 ? {
//                     ...it,
//                     welder_no: editFormData.welder_no,  
//                     remarks: editFormData.remarks
//                   }
//                 : it
//             )
//           };
//         }

//         // ROOT DPT update (FIXED)
// if (
//   parentObj.rootDpt?._id &&
//   item.rootDpt_id &&
//   String(parentObj.rootDpt._id) === String(item.rootDpt_id)
// ) {
//   return {
//     ...parentObj,
//     items: parentObj.items.map(it =>
//       String(it.rootDpt_item_id) === String(item.rootDpt_item_id)
//         ? {
//             ...it,
//             welder_no: editFormData.welder_no,
//             remarks: editFormData.remarks
//           }
//         : it
//     )
//   };
// }

//         return parentObj;
//       })
//     );

//     setEditRowIndex?.(null);
//     dispatch(getWeldVisualOffer());
//   } catch (err) {
//     console.error(err);
//     toast.error("Something went wrong");
//   }
// };




// const handleRemove = async (rowIndex, itemIndex, jointIndex) => {
//   const row = commentsData[rowIndex];       // row = entire offer
//   const item = row.items[itemIndex];        // item in row
//   const joint = item.jointDetails?.[jointIndex]; // joint inside item, optional

//   if (!row?._id) return toast.error("Row ID not found");

//   try {
//     const token = localStorage.getItem("PAY_USER_TOKEN");

//     const res = await axios.delete(`${V_URL}/user/delete-weld-visual-offer`, {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       },
//       data: { _id: row._id }
//     });

//     if (res.data?.success) {
//       toast.success("Deleted successfully");

//       // 1️⃣ Update commentsData in UI
//       const updatedData = [...commentsData];
//       updatedData.splice(rowIndex, 1);
//       dispatch(getWeldVisualOffer()); // reload data if needed

//       // 2️⃣ Update submitArr for both FitUp and RootDpt
//       setSubmitArr(prev => {
//         return prev
//           .map(obj => {
//             // Determine type
//             if (obj.fitup?._id && String(obj.fitup._id) === String(row.fitUp?._id)) {
//               // Remove FitUp item
//               const filteredItems = obj.items.filter(it => it.fitUp_item_id !== item.fitUp_item_id);
//               return { ...obj, items: filteredItems };
//             } else if (obj.rootDpt?._id && String(obj.rootDpt._id) === String(row.rootDpt?._id)) {
//               // Remove RootDpt item
//               const filteredItems = obj.items.filter(it => it.rootDpt_item_id !== item.rootDpt_item_id);
//               return { ...obj, items: filteredItems };
//             }
//             return obj; // leave others untouched
//           })
//           .filter(obj => obj.items.length > 0); // remove empty entries
//       });

//     } else {
//       toast.error(res.data?.message || "Delete failed");
//     }

//   } catch (err) {
//     console.error(err);
//     toast.error("Something went wrong");
//   }
// };

const handleRemove = async (rowIndex, itemIndex) => {
    const row = commentsData[rowIndex]; 
    const item = row.items[itemIndex];

    if (!row?._id) return toast.error("Offer ID not found");

    try {
        const token = localStorage.getItem("PAY_USER_TOKEN");

        const res = await axios.delete(`${V_URL}/user/delete-weld-visual-offer`, {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: { _id: row._id }
        });

        if (res.data?.success) {
            toast.success(res.data.message);

            // 1️⃣ Update the 'submitArr' state to remove the corresponding item
            setSubmitArr(prev => {
                return prev
                    .map(obj => {
                        // If it's a FitUp type section
                        if (obj.fitup?._id && item.fitUp_id && String(obj.fitup._id) === String(item.fitUp_id)) {
                            const filteredItems = obj.items.filter(it => 
                                String(it.fitUp_item_id) !== String(item.fitUp_item_id)
                            );
                            return { ...obj, items: filteredItems };
                        } 
                        // If it's a RootDpt type section
                        else if (obj.rootDpt?._id && item.rootDpt_id && String(obj.rootDpt._id) === String(item.rootDpt_id)) {
                            const filteredItems = obj.items.filter(it => 
                                String(it.rootDpt_item_id) !== String(item.rootDpt_item_id)
                            );
                            return { ...obj, items: filteredItems };
                        }
                        return obj;
                    })
                    .filter(obj => obj.items.length > 0); // Remove the whole category if no items left
            });

            // 2️⃣ Refresh the list from the server to ensure UI is in sync
            dispatch(getWeldVisualOffer());

            dispatch(
  getFitUpDrawingDataForWeldVisual({
    page: currentPage,
    limit,
    search:drawingSearch
  })
);

            
        } else {
            toast.error(res.data?.message || "Delete failed");
        }
    } catch (err) {
        console.error("Delete Error:", err);
        toast.error("Something went wrong during deletion");
    }
};

const handleSubmit = () => {
  console.log("SubmitArr on final submit:", submitArr);

  if (!submitArr.length) {
    toast.error("Please add drawing sections");
    return;
  }

  // 1️⃣ Validate welder_no
  // for (const parent of submitArr) {
  //   for (const it of parent.items) {
  //     if (!it.welder_no) {
  //       toast.error("Please select welder no. for all joints");
  //       return;
  //     }
  //   }
  // }

  // 2️⃣ Flatten items (FitUp + RootDPT)
  const filteredData = submitArr.flatMap(parent =>
    parent.items.map(it => {
      // FITUP PAYLOAD
      if (parent.fitup?._id) {
        return {
          type: "fitup",
          drawing_id: it.drawing_id,
            spool_no_id:it.spool_no_id,
          joint_spool_item_id:it.joint_spool_item_id,
          joint_type_id:it.joint_type_id,
          fitUp_id: parent.fitup._id,
          fitUp_item_id: it.fitUp_item_id,
          
          material_item_id_1: it.material_item_id_1,
          item_id_1: it.item_id_1,
          material_item_id_2: it.material_item_id_2,
          item_id_2: it.item_id_2,
          wps_no: it.wps_no,
          welder_no: it.welder_no,
          remarks: it.remarks || ""
        };
      }

      // ROOT DPT PAYLOAD
      if (parent.rootDpt?._id) {
        return {
          type: "rootDpt",
          drawing_id: it.drawing_id,
          spool_no_id:it.spool_no_id,
          joint_spool_item_id:it.joint_spool_item_id,
          joint_type_id:it.joint_type_id,
          rootDpt_id: parent.rootDpt._id,
          rootDpt_item_id: it.rootDpt_item_id,
          material_item_id_1: it.material_item_id_1,
          item_id_1: it.item_id_1,
          material_item_id_2: it.material_item_id_2,
          item_id_2: it.item_id_2,
          wps_no: it.wps_no,
          welder_no: it.welder_no,
          remarks: it.remarks || ""
        };
      }

      return null;
    }).filter(Boolean)
  );

  console.log("Final submit payload:", filteredData);

  if (!validation()) return;

  setDisable(true);

  const myurl = `${V_URL}/user/manage-weld-visual-inspection-piping`;
  const formData = new URLSearchParams();
  formData.append("offered_by", localStorage.getItem("PAY_USER_ID"));
  formData.append("project", localStorage.getItem("PAY_USER_PROJECT_NAME"));
  formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
  formData.append("items", JSON.stringify(filteredData));

  if (data?._id) {
    formData.append("_id", data._id);
  }

  axios({
    method: "post",
    url: myurl,
    data: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
    }
  })
    .then(res => {
      if (res.data?.success || res.data?.message) {
        toast.success(res.data.message || "Submitted successfully");
        setSubmitArr([]);
        dispatch(getWeldVisualOffer());
           dispatch(
  getFitUpDrawingDataForWeldVisual({
    page: currentPage,
    limit,
    search:drawingSearch
  })
);
        navigate("/piping/user/weld-visual-management");
      } else {
        toast.error(res.data.message || "Submission failed");
      }
    })
    .catch(err => {
      toast.error(err.response?.data?.message || "Something went wrong");
    })
    .finally(() => setDisable(false));
};

    const validation = () => {
        var isValid = true;
        let err = {};
        // if (!weld.fitup) {
        //     isValid = false;
        //     err['fitup_err'] = "Please select fitup no";
        // }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fitOptions = finalFit?.map(fit => ({
        label: `${fit?.report_no_two} - ${fit?.isCompletedStatus}`,
        value: fit?._id
    })) || [];

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Weld Visual Inspection Offer List", link: "/piping/user/weld-visual-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Weld-Visual Inspection Offer`, active: true }
                    ]} />

                    {/* <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Weld-Visual Inspection Offer Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Fit-Up Clearance No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={fitOptions}
                                                        value={weld.fitup || ""}
                                                        onChange={(e) => handleChange(e, 'fitup')}
                                                        filter className='w-100'
                                                        placeholder="Select Fit-Up Clearance No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error.fitup_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* <WeldVisualDrawingTable
                        tableTitle={'Drawing List'}
                        commentsData={commentsData}
                        handleAddToIssueArr={handleAddToArr}
                        currentPage={currentPage}
                        limit={limit}
                        setlimit={setlimit}
                        totalItems={totalItems}
                        setCurrentPage={setCurrentPage}
                        setSearch={setSearch}
                        data={data}
                    /> */}
                    <WeldVisualDrawingTable  tableTitle={'Drawing List'} data={fitUpDrawingData} 
                        limit={limit}
                        setlimit={setlimit}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                        setSearch={setDrawingSearch} handleAddToIssueArr={handleAddToArr} />

                    <MultiWeldTable
                        data={data}
                        commentsData={commentsData}
                        fitupId={weld.fitup}
                        finalArr={finalArr}
                        setSubmitArr={setSubmitArr}
                        handleRemove={handleRemove}
                        handleSaveClick={handleSaveClick}
                        setSearch={setTableSearch}
                    />

                    {/* <SubmitButton finalReq={data?.items} link='/piping/user/weld-visual-management'
                        disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Weld Visual Offer'} /> */}

                           <SubmitButton
                        // disable={loading}
                        handleSubmit={handleSubmit}
                        link='/piping/user/weld-visual-management'
                       buttonName={'Generate Weld Visual Offer'}
                    />

                </div>
            </div>
            {/* <MultiWeldModal
                showItem={showItem}
                handleCloseModal={() => setShowItem(false)}
                drawId={drawId}
                fitupId={weld.fitup}
                title={'Weld Visual Clearance Section List'}
                setFinalArr={setFinalArr}
            /> */}
        </div>
    )
}

export default ManageMultiWeldVisual