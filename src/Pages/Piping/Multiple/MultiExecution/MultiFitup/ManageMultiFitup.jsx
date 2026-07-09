import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import { getIssueAcceptancePiping } from "../../../../../Store/Piping/IssueAcceptance/getIssueAcceptancePiping";
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
// import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import FitUpDrawingTable from '../../Components/DrawingTable/FitUpDrawingTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import MultipleFitupTable from '../../Components/MultiFitupModal/MultipleFitupTable';
import { getDrawingJointWisePiping } from '../../../../../Store/Piping/MultiFitupPiping/getDrawingJointWisePipingData';
import { getDrawingSpoolNoFitUp } from '../../../../../Store/Piping/Drawing/getDrawingSpoolNoFitUp';
import { getFitupOfferTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/getFitupOfferTablePiping';
import { updateFitupOffTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/updateFitupOfferTablePiping';
const ManageMultiFitup = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fitup, setFitup] = useState({ issued_id: "" });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);

  const [entity, setEntity] = useState([]);
  const [finalArr, setFinalArr] = useState([]);
  const [submitArr, setSubmitArr] = useState([]);
  const [filterIssue, setFilterIssue] = useState([]);
  const data = location.state;
  const project_id = localStorage.getItem('U_PROJECT_ID');
  console.log("data view page", data);

  useEffect(() => {
    if (data) {
      setFitup({
        issued_id: location.state.issue_id?._id,
      });
    }
  }, [data]);

  useEffect(() => {
    if (!fitup?.issued_id) return;

    dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id, project_id }))
      .then(action => {
        const responseData = action.payload?.data || [];

        const updatedArr = [];

        responseData.forEach(d => {
          d.fitup_entries?.forEach(f => {
            updatedArr.push({
              _id: f._id,                    // ✅ DB ID
              report_no: f.report_no,
              drawing_id: f.drawing_id?._id,
              spool_no: f.spool_no,
              joint_no: f.joint_no,
              sheet_no: f.sheet_no,
              joint_type: f.joint_type,
              item_id_1: f.item_id_1,
              item_id_2: f.item_id_2,
              remarks: f.remarks || "",
            });
          });
        });

        setFinalArr(updatedArr); // 🔥 FRONTEND = DB
      });
  }, [fitup.issued_id, dispatch]);


  useEffect(() => {
    dispatch(getIssueAcceptancePiping({}));
    //  dispatch(getDrawingJointWisePiping({}));
    dispatch(getDrawingJointWisePiping({ project_id }));

    dispatch(getDrawingSpoolNoFitUp());
    // dispatch(getDrawingPiping());
  }, []);

  const issuedData = useSelector((state) => state?.getIssueAcceptancePiping?.user?.data?.items);
  console.log("issuedData", issuedData);
  //    const drawData = useSelector((state) => state?.getDrawingPiping?.user?.data?.data);
  const drawData = useSelector((state) => state?.getDrawingSpoolNoFitUp?.data);
  console.log("drawData", drawData);

  const drawJointData = useSelector((state) => state?.getDrawingJointWisePiping?.data?.data);
  console.log("drawJointData", drawJointData);


  // useEffect(() => {
  //   if (!issuedData) return;

  //   const filterData = issuedData
  //     // .filter(issue => issue?.isFitUp === true && issue?.status === 4)
  //     .map(issue => {
  //       const allItemsAdded = issue.items
  //         ?.filter(it => it?.is_accepted)
  //         ?.every(it => it?.is_added_fit_up === true);

  //       const isCompleted = allItemsAdded || issue.is_generate_fit_up === true;

  //       return {
  //         ...issue,
  //         isCompletedStatus: isCompleted ? "Completed" : "Balance"
  //       };
  //     });

  //   setFilterIssue(filterData);
  // }, [issuedData, finalArr]);

  useEffect(() => {
    if (!issuedData?.length || !drawJointData?.length) return;

    const updatedIssues = issuedData.map(issue => {
      console.log("issue fit up =====>", issue);
      const issueDrawingIds = issue.items
        ?.filter(it => it.is_accepted)
        ?.map(it => getId(it.drawing_id))
        ?.filter(Boolean);
      console.log("issueDrawingIds", issueDrawingIds);

      if (!issueDrawingIds?.length) {
        return { ...issue, isCompletedStatus: "Balance" };
      }

      const relatedSpools = drawJointData.filter(spool =>
        issueDrawingIds.includes(getId(spool.drawing_id))
      );
      console.log("relatedSpools", relatedSpools);

      if (!relatedSpools.length) {
        return { ...issue, isCompletedStatus: "Balance" };
      }

      const allJointsCompleted = relatedSpools.every(spool =>
        spool.is_generate_fitUp_offer === true
      );
      console.log("allJointsCompleted", allJointsCompleted);

      return {
        ...issue,
        isCompletedStatus: allJointsCompleted ? "Completed" : "Balance"
      };
    });

    setFilterIssue(updatedIssues);
  }, [issuedData, drawJointData]);

  // useEffect(() => {
  //   if (!issuedData || !fitup?.issued_id || !drawData || !drawJointData) return;

  //   const issue = issuedData.find(
  //     is => getId(is._id) === getId(fitup.issued_id)
  //   );
  //   console.log("issue", issue);

  //   if (!issue) {
  //     setEntity([]);
  //     return;
  //   }

  //   const issueDrawingIds = issue.items
  //     ?.filter(it => it.is_accepted)
  //     ?.map(it => getId(it.drawing_id))
  //     ?.filter(Boolean);

  //   const relatedSpools = drawJointData.filter(spool =>
  //     issueDrawingIds.includes(getId(spool.drawing_id))
  //   );

  //   const allJointsCompleted =
  //     relatedSpools.length &&
  //     relatedSpools.every(spool => spool.is_generate_fitUp_offer === true);


  //   if (allJointsCompleted) {
  //     setEntity([]);
  //     return;
  //   }

  //   // ✅ STEP 1: group ALL items by drawing
  //   const drawingMap = {};
  //   issue.items.forEach(it => {
  //     const dId = getId(it.drawing_id);
  //     if (!drawingMap[dId]) drawingMap[dId] = [];
  //     drawingMap[dId].push(it);
  //   });

  //   // ✅ STEP 2: drawing allowed ONLY if ALL items accepted
  //   const fullyAcceptedDrawingIds = Object.entries(drawingMap)
  //     .filter(([_, items]) =>
  //       items.every(it => it.is_accepted === true)
  //     )
  //     .map(([dId]) => dId);
  //   console.log("fullyAcceptedDrawingIds", fullyAcceptedDrawingIds);

  //   // ✅ STEP 3: exclude drawings already fully added to fitup
  //   console.log("DEBUG: fullyAcceptedDrawingIds:", fullyAcceptedDrawingIds);
  //   const eligibleDrawingIds = fullyAcceptedDrawingIds.filter(dId => {
  //     const items = drawingMap[dId];
  //     return items.some(it => it.is_added_fit_up !== true);
  //   });

  //   console.log("eligibleDrawingIds", eligibleDrawingIds);
  //   console.log("DEBUG: drawJointData:", drawJointData);

  //   // ✅ STEP 4: final drawing list
  //   const filteredDrawings = drawData.filter(dr =>
  //     eligibleDrawingIds.includes(getId(dr.drawing_id))
  //   );
  //   console.log("filteredDrawings", filteredDrawings);
  //   setEntity(filteredDrawings);
  // }, [issuedData, fitup?.issued_id, drawData, drawJointData]);

  // useEffect(() => {
  //   if (!issuedData || !fitup?.issued_id || !drawData || !drawJointData) return;

  //   const issue = issuedData.find(
  //     is => getId(is._id) === getId(fitup.issued_id)
  //   );

  //   if (!issue) {
  //     setEntity([]);
  //     return;
  //   }

  //   // ✅ STEP 1: group items by drawing
  //   const drawingMap = {};
  //   issue.items.forEach(it => {
  //     const dId = getId(it.drawing_id);
  //     if (!drawingMap[dId]) drawingMap[dId] = [];
  //     drawingMap[dId].push(it);
  //   });

  //   // ✅ STEP 2: fully accepted drawings
  //   const fullyAcceptedDrawingIds = Object.entries(drawingMap)
  //     .filter(([_, items]) =>
  //       items.every(it => it.is_accepted === true)
  //     )
  //     .map(([dId]) => dId);

  //   // ✅ STEP 3: "IN-BETWEEN LOGIC"
  //   // (not all added, but at least one pending)
  //   const eligibleDrawingIds = fullyAcceptedDrawingIds.filter(dId => {
  //     const items = drawingMap[dId];

  //     const allAdded = items.every(it => it.is_added_fit_up === true);
  //     const somePending = items.some(it => it.is_added_fit_up !== true);

  //     return !allAdded && somePending;
  //   });

  //   // ✅ STEP 4: SPOOL LEVEL FILTER (MAIN FIX)
  //   const filteredDrawings = drawData.filter(dr => {
  //     const dId = getId(dr.drawing_id);

  //     // must be eligible drawing
  //     if (!eligibleDrawingIds.includes(dId)) return false;

  //     // find matching spool
  //     const spool = drawJointData.find(
  //       sp =>
  //         getId(sp.drawing_id) === dId &&
  //         getId(sp.spool_no_id) === getId(dr.spool_no_id)
  //     );

  //     if (!spool) return false;

  //     // ✅ ONLY show NOT generated spools
  //     return spool.is_generate_fitUp_offer !== true;
  //   });

  //   setEntity(filteredDrawings);

  // }, [issuedData, fitup?.issued_id, drawData, drawJointData]);

  // useEffect(() => {
  //   if (!issuedData || !fitup?.issued_id || !drawData || !drawJointData) return;

  //   const issue = issuedData.find(
  //     is => getId(is._id) === getId(fitup.issued_id)
  //   );

  //   if (!issue) {
  //     setEntity([]);
  //     return;
  //   }

  //   // ✅ STEP 1: Group items by drawing
  //   const drawingMap = {};
  //   issue.items.forEach(it => {
  //     const dId = getId(it.drawing_id);
  //     if (!drawingMap[dId]) drawingMap[dId] = [];
  //     drawingMap[dId].push(it);
  //   });

  //   // ✅ STEP 2: Only fully accepted drawings
  //   const fullyAcceptedDrawingIds = Object.entries(drawingMap)
  //     .filter(([_, items]) =>
  //       items.every(it => it.is_accepted === true)
  //     )
  //     .map(([dId]) => dId);

  //   // ✅ STEP 3: "IN-BETWEEN" CONDITION
  //   // ✔ Not fully added
  //   // ✔ At least one pending
  //   const eligibleDrawingIds = fullyAcceptedDrawingIds.filter(dId => {
  //     const items = drawingMap[dId];

  //     const allAdded = items.every(it => it.is_added_fit_up === true);
  //     const somePending = items.some(it => it.is_added_fit_up !== true);

  //     return !allAdded && somePending;
  //   });

  //   // ✅ STEP 4: FINAL FILTER (SPOOL LEVEL FIX)
  //   const filteredDrawings = drawData.filter(dr => {
  //     const dId = getId(dr.drawing_id);

  //     // must be eligible drawing
  //     if (!eligibleDrawingIds.includes(dId)) return false;

  //     // find spool in joint data
  //     const spool = drawJointData.find(
  //       sp =>
  //         getId(sp.drawing_id) === dId &&
  //         getId(sp.spool_no_id) === getId(dr.spool_no_id)
  //     );

  //     // ✅ IMPORTANT FIX:
  //     // If spool NOT found → still show it
  //     if (!spool) return true;

  //     // hide only if generated
  //     return spool.is_generate_fitUp_offer !== true;
  //   });

  //   setEntity(filteredDrawings);

  // }, [issuedData, fitup?.issued_id, drawData, drawJointData]);

  useEffect(() => {
    if (!issuedData || !fitup?.issued_id || !drawData || !drawJointData) return;

    const issue = issuedData.find(
      is => getId(is._id) === getId(fitup.issued_id)
    );

    console.log("🔍 DEBUG ENTITY - issue found:", issue ? "YES" : "NO", "items:", issue?.items?.length);

    if (!issue) {
      setEntity([]);
      return;
    }

    // ✅ STEP 1: Get accepted drawing ObjectIds from issue.items
    const acceptedDrawingIds = issue.items
      ?.filter(it => it.is_accepted === true)
      ?.map(it => getId(it.drawing_id))
      ?.filter(Boolean) || [];

    console.log("🔍 DEBUG ENTITY - acceptedDrawingIds (ObjectIds):", acceptedDrawingIds);

    if (!acceptedDrawingIds.length) {
      console.log("🔍 DEBUG ENTITY - No accepted items, entity = []");
      setEntity([]);
      return;
    }

    console.log("🔍 DEBUG ENTITY - drawJointData total items:", drawJointData?.length);
    console.log("🔍 DEBUG ENTITY - drawJointData sample[0]:", drawJointData?.[0]);
    console.log("🔍 DEBUG ENTITY - Does drawJointData have drawing_no?", drawJointData?.[0]?.drawing_no !== undefined);
    
    // ✅ STEP 2: Use drawJointData as bridge — find spool_no_ids that are NOT yet generated
    // drawJointData.drawing_id is an ObjectId (matches issue.items drawing ObjectIds)
    const pendingSpoolIds = new Set(
      drawJointData
        .filter(sp =>
          acceptedDrawingIds.includes(getId(sp.drawing_id)) &&
          sp.is_generate_fitUp_offer !== true
        )
        .map(sp => getId(sp.spool_no_id))
    );

    console.log("🔍 DEBUG ENTITY - pendingSpoolIds from drawJointData:", [...pendingSpoolIds]);

    // ✅ STEP 3: Filter drawData by matching spool_no_id
    // drawData.spool_no_id IS a valid ObjectId that matches drawJointData.spool_no_id
    console.log("🔍 DEBUG ENTITY - drawData sample:", drawData?.[0]);
    console.log("🔍 DEBUG ENTITY - is drawData spool_no_id matching pending?", drawData?.some(dr => pendingSpoolIds.has(getId(dr.spool_no_id))));
    
    const filteredDrawings = drawData.filter(dr =>
      pendingSpoolIds.has(getId(dr.spool_no_id)) || pendingSpoolIds.has(getId(dr._id))
    );

    console.log("🔍 DEBUG ENTITY - filteredDrawings count:", filteredDrawings.length, filteredDrawings?.[0]);
    setEntity(filteredDrawings);

  }, [issuedData, fitup?.issued_id, drawData, drawJointData]);


  const commentsData = useMemo(() => {
    const projectId = localStorage.getItem('U_PROJECT_ID');
    let computedComments = entity;
    console.log("entity fit up", entity);

    // ✅ API already filters by project_id server-side, no frontend filter needed.
    // Filtering by o?.project === projectId was broken because project is a populated object, not a string.

    console.log("computedComments fitup", computedComments);
    if (search) {
      computedComments = computedComments.filter(
        (dr) =>
          dr?.drawing_no.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
          dr?.spool_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, entity]);



  console.log("commentsData fit up", commentsData);
  const handleChange = (e, name) => {
    setFitup({ ...fitup, [name]: e.value });
  }




  const getId = (val) => {
    return typeof val === "object" && val !== null
      ? val?._id?.toString()
      : val?.toString();
  };

  // const handleAddToIssueArr = async (drawingId, spoolId) => {
  //   if (!fitup?.issued_id) {
  //     toast.error("Please select Issue Acceptance first");
  //     return;
  //   }

  //   // 1️⃣ Get the spool from drawJointData
  //   const spool = drawJointData.find(
  //     j => getId(j.drawing_id) === getId(drawingId) &&
  //          getId(j.spool_no_id) === getId(spoolId)
  //   );

  //   if (!spool) {
  //     toast.error("not found");
  //     return;
  //   }

  //   // 2️⃣ Filter joints where at least one material is valid
  //   const validJoints = spool.joints.filter(joint =>
  //     joint.materials.some(material =>
  //       material.issue_acceptance?.isFitUp === true &&
  //       material.issue_acceptance?.is_generate_fit_up === false
  //     )
  //   );

  //   if (!validJoints.length) {
  //     toast.error("No joints found for selected spool");
  //     return;
  //   }

  //   // 3️⃣ Map each joint to backend payload item
  //   const newItems = validJoints.flatMap(joint => {
  //     if (joint.materials.length < 2) return []; // skip if less than 2 materials

  //     const mat1 = joint.materials[0];
  //     console.log("mat1",mat1);
  //     const mat2 = joint.materials[1];

  //     return [{
  //       drawing_id: spool.drawing_id,
  //       spool_no_id: spool.spool_no_id,
  //       material_item_id_1: mat1.material_item_id,
  //       item_id_1: mat1.item_id,
  //       material_item_id_2: mat2.material_item_id,
  //       item_id_2: mat2.item_id,
  //       // imir_no_1: mat1.issue_acceptance?.imir_no || "",
  //       // heat_no_1: mat1.issue_acceptance?.heat_no || "",
  //       // imir_no_2: mat2.issue_acceptance?.imir_no || "",
  //       // heat_no_2: mat2.issue_acceptance?.heat_no || "",
  //       fitOff_used_qty: joint.fitOff_used_qty || 0,
  //       fitOff_balance_qty: joint.fitOff_balance_qty || 0,
  //       moved_next_step: joint.moved_next_step || 0,
  //       remarks: joint.remarks || "",
  //       qc_remarks: joint.qc_remarks || "",
  //       is_accepted: joint.is_accepted || false
  //     }];
  //   });

  //   // // 4️⃣ Prevent duplicates based on drawing_id + spool_no_id + joint_no
  //   // const filteredItems = newItems.filter(item =>
  //   //   !finalArr.some(
  //   //     existing =>
  //   //       getId(existing.drawing_id) === getId(item.drawing_id) &&
  //   //       existing.joint_no === item.joint_no
  //   //   )
  //   // );

  //   // if (!filteredItems.length) {
  //   //   toast.error("Already added");
  //   //   return;
  //   // }

  //   // 5️⃣ Add to local table for UI
  //   // setFinalArr(prev => [...prev, ...filteredItems]);

  //   // 6️⃣ Send to backend
  //   try {
  //     const payload = {
  //       project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
  //       offered_by: localStorage.getItem("PAY_USER_ID"),
  //       project_id: localStorage.getItem("U_PROJECT_ID"),
  //       issue_id: fitup.issued_id,
  //       items: newItems
  //     };

  //     const res = await axios.post(
  //       `${V_URL}/user/manage-fitup-offer-table-piping`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
  //         }
  //       }
  //     );

  //     if (res.data?.success) {
  //        toast.success(res.data.message);
  //       dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id }));
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     // toast.error("Failed to add spool");

  //     if (err.response) {
  //     // 🔥 This will show your backend message
  //     toast.error(err.response.data.message || "Something went wrong");
  //   } else {
  //     toast.error("Server not reachable");
  //   }
  //   }
  // };


  const handleAddToIssueArr = async (drawingId, spoolId) => {
    if (!fitup?.issued_id) {
      toast.error("Please select Issue Acceptance first");
      return;
    }

    // 1️⃣ Get the spool from drawJointData
    const spool = drawJointData.find(
      j => getId(j.drawing_id) === getId(drawingId) &&
        getId(j.spool_no_id) === getId(spoolId)
    );
    console.log("spool fit up", spool);

    if (!spool) {
      toast.error("Already Added");
      return;
    }
    // console.log("spool",spool);
    //   // 2️⃣ Filter joints where at least one material is valid
    //   const validJoints = spool.joints.filter(joint =>
    //     joint.materials.some(material =>
    //       material.issue_acceptance?.isFitUp === true &&
    //       material.issue_acceptance?.is_generate_fit_up === false
    //     )
    //   );

    // ❌ HARD STOP if spool already generated
    if (spool.is_generate_fitUp_offer === true) {
      toast.error("Fit-Up Offer already generated.");
      return;
    }

    const validJoints = spool.joints.filter(joint => {
      // ❌ Skip joint already added
      if (joint.is_added_fitUp_table === true) return false;

      // ❌ Must have exactly 2 materials
      if (!joint.materials || joint.materials.length !== 2) return false;

      // ✅ BOTH materials must be valid
      return joint.materials.every(material =>
        material.issue_acceptance?.isFitUp === true &&
        material.issue_acceptance?.is_generate_fit_up !== true
      );
    });

    if (!validJoints.length) {
      toast.error("No valid joints found for selected spool");
      return;
    }

    console.log("validJoints", validJoints);
    // 3️⃣ Map each joint to backend payload item
    const newItems = validJoints.flatMap(joint => {
      if (joint.materials.length < 2) return []; // skip if less than 2 materials

      const mat1 = joint.materials[0];
      const mat2 = joint.materials[1];

      return [{
        drawing_id: spool.drawing_id,
        spool_no_id: spool.spool_no_id,
        joint_spool_item_id: joint.joint_spool_item_id,
        joint_no: joint.joint_no,
        sheet_no: joint.sheet_no,
        joint_type_id: joint.joint_type_id,
        material_item_id_1: mat1.material_item_id,
        item_id_1: mat1.item_id,
        material_item_id_2: mat2.material_item_id,
        item_id_2: mat2.item_id,
        fitOff_used_qty: joint.fitOff_used_qty || 0,
        fitOff_balance_qty: joint.fitOff_balance_qty || 0,
        moved_next_step: joint.moved_next_step || 0,
        remarks: joint.remarks || "",
        qc_remarks: joint.qc_remarks || "",
        is_accepted: joint.is_accepted || false
      }];
    });

    // 4️⃣ Prevent duplicates based on drawing_id + spool_no_id + joint_no
    const filteredItems = newItems.filter(item =>
      !finalArr.some(
        existing =>
          getId(existing.drawing_id) === getId(item.drawing_id) &&
          getId(existing.spool_no_id) === getId(item.spool_no_id) &&
          existing.joint_no === item.joint_no
      )
    );

    if (!filteredItems.length) {
      toast.error("Selected spool joints are already added");
      return;
    }

    // 5️⃣ Add to local table for UI
    setFinalArr(prev => [...prev, ...filteredItems]);

    // 6️⃣ Send to backend
    try {
      const payload = {
        project: localStorage.getItem("PAY_USER_PROJECT_NAME"),
        offered_by: localStorage.getItem("PAY_USER_ID"),
        project_id: localStorage.getItem("U_PROJECT_ID"),
        issue_id: fitup.issued_id,
        items: filteredItems
      };

      const res = await axios.post(
        `${V_URL}/user/manage-fitup-offer-table-piping`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
          }
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message);
        dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id, project_id }));
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        toast.error(err.response.data.message || "Something went wrong");
      } else {
        toast.error("Server not reachable");
      }
    }
  };


  // const handleSaveClick = async (
  //   updatedRow,
  //   rowIndex,
  //   localTableData,
  //   setLocalTableData,
  //   setEditRowIndex
  // ) => {
  //   // 1️⃣ Update local table UI
  //   const updated = [...localTableData];
  //   updated[rowIndex] = updatedRow;
  //   setLocalTableData(updated);

  //   // 2️⃣ 🔥 Update submitArr (THIS WAS MISSING)
  //   setSubmitArr(prev => {
  //     const copy = [...prev];
  //     copy[rowIndex] = updatedRow;
  //     return copy;
  //   });

  //   setEditRowIndex(null);

  //   // 3️⃣ Backend update
  //   const fitupItem = new URLSearchParams();
  //   fitupItem.append('issue_id', fitup.issued_id);

  //   fitupItem.append(
  //     'items',
  //     JSON.stringify([
  //       {
  //         _id: updatedRow._id,
  //         drawing_id: updatedRow?.drawing_id?._id || updatedRow?.drawing_id,
  //         imir_no_1_selected: updatedRow.imir_no_1_selected,
  //         heat_no_1_selected: updatedRow.heat_no_1_selected,
  //         imir_no_2_selected: updatedRow.imir_no_2_selected,
  //         heat_no_2_selected: updatedRow.heat_no_2_selected,
  //         remarks: updatedRow.remarks
  //       }
  //     ])
  //   );

  //   try {
  //     const response = await dispatch(
  //       updateFitupOffTablePiping({ bodyFormData: fitupItem })
  //     ).unwrap();
  //     dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id, project_id }));
  //     dispatch(getDrawingJointWisePiping({}));
  //     toast.success(response.message);
  //   } catch (err) {
  //     toast.error(err?.message);
  //   }
  // };

  const handleSaveClick = async (rowData, index, tableData, setTableData, setEditRowIndex) => {
    const updatedData = [...tableData];

    // Update the row locally
    updatedData[index] = {
      ...rowData,
    };

    // Update table state
    setTableData(updatedData);
    setSubmitArr(updatedData);

    setEditRowIndex(null);

    // Prepare body for backend
    const fitupItem = new URLSearchParams();
    fitupItem.append('issue_id', fitup.issued_id);
    fitupItem.append(
      'items',
      JSON.stringify([{
        _id: rowData._id,
        drawing_id: rowData?.drawing_id?._id || rowData?.drawing_id,
        joint_type_id: rowData.joint_type_id,
        imir_no_1_selected: rowData.imir_no_1_selected,
        heat_no_1_selected: rowData.heat_no_1_selected,
        imir_no_2_selected: rowData.imir_no_2_selected,
        heat_no_2_selected: rowData.heat_no_2_selected,
        remarks: rowData.remarks
      }])
    );

    try {
      const response = await dispatch(
        updateFitupOffTablePiping({ bodyFormData: fitupItem })
      ).unwrap();

      toast.success(response.message);
    } catch (err) {
      toast.error(err?.message);
      console.error(err);
    }
  };

  console.log("setFinalArr", finalArr);


  const handleSubmit = () => {
    let updatedData = submitArr;
    console.log("submitArr in handleSubmit", submitArr);
    let isValid = true;
    let err = {};
    updatedData.forEach(item => {
      const hasJointType = item.joint_type_id || (item.joint_type && item.joint_type.length > 0);
      if (!hasJointType) {
        isValid = false;
        toast.error(`Please select Joint Type for Joint No: ${item.joint_no}`);
      }
      if (!item.imir_no_1_selected) {
        isValid = false;
        toast.error(`Please select IMIR No 1 for Joint No: ${item.joint_no}`);
      }
      if (!item.imir_no_2_selected) {
        isValid = false;
        toast.error(`Please select IMIR No 2 for Joint No: ${item.joint_no}`);
      }
      if (!item.heat_no_1_selected) {
        isValid = false;
        toast.error(`Please select Heat No 1 for Joint No: ${item.joint_no}`);
      }
      if (!item.heat_no_2_selected) {
        isValid = false;
        toast.error(`Please select Heat No 2 for Joint No: ${item.joint_no}`);
      }
    });
    if (!isValid) {
      setError(err);
      return;
    }

    // const filteredData = submitArr.map((item) => ({
    //     drawing_id: item.drawing_id,
    //     fitOff_used_qty: item.fitOff_used_qty,
    //     fitOff_balance_qty: item.fitOff_balance_qty,
    //     material_item_id_1: item.material_item_1?._id,
    //     material_item_id_2: item.material_item_2?._id,
    //     item_id_1: item.material_item_1?.item?._id,
    //     item_id_2: item.material_item_2?.item?._id,
    //     imir_no_1:item.imir_no_1_selected,
    //     heat_no_1:item.heat_no_1_selected,
    //     imir_no_2:item.imir_no_2_selected,
    //     heat_no_2:item.heat_no_2_selected,
    //     joint_type: item.joint_type,
    //     remarks: item.remarks || '',
    //     report_no: fitup.report_no,
    //     issueId: fitup.issued_id,

    // }));

    const filteredData = submitArr.map(item => ({
      _id: item._id,
      issue_id: fitup.issued_id,
      fitOff_used_qty: item.fitOff_used_qty || 0,
      fitOff_balance_qty: item.fitOff_balance_qty || 0,
      drawing_id: item.drawing_id?._id || item.drawing_id,
      spool_no_id: item.spool_no_id,
      joint_spool_item_id: item.joint_spool_item_id,
      // joint_type_id:item.joint_type_id,
      material_item_id_1: item.materials?.[0]?.material_item_id || item.material_item_id_1,
      material_item_id_2: item.materials?.[1]?.material_item_id || item.material_item_id_2,
      item_id_1: item.materials?.[0]?.item_id || item.item_id_1,
      item_id_2: item.materials?.[1]?.item_id || item.item_id_2,

      joint_type_id: item.joint_type_id,
      imir_no_1: item.imir_no_1_selected,
      heat_no_1: item.heat_no_1_selected,
      imir_no_2: item.imir_no_2_selected,
      heat_no_2: item.heat_no_2_selected,
      report_no: fitup.report_no,
      joint_type: item.joint_type,
      remarks: item.remarks || ""
    }));


    console.log("filteredData", filteredData);
    if (filteredData.length === 0) {
      toast.error('Please add drawing sections');
      return;
    }

    if (validation()) {
      setDisable(true);
      const myurl = `${V_URL}/user/manage-multi-fitup-piping`;
      const formData = new URLSearchParams();
      formData.append('issue_id', fitup.issued_id);
      formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
      formData.append('items', JSON.stringify(filteredData));
      if (data?._id) {
        formData.append('_id', data?._id);
      }
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          // const updatedData = new URLSearchParams();
          // updatedData.append('items', JSON.stringify(filteredData));
          // dispatch(updateFitupOffTable({ updatedData })).then((response) => {
          //     console.log(response, '222')
          //     if (response.payload.success === true) {
          //         navigate('/piping/user/fitup-management');
          //     }
          // })
          dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id, project_id }));
          navigate('/piping/user/fitup-management');
        } else {
          toast.error(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        console.log(error, "error");
        toast.error(error?.response?.data?.message);
        setDisable(false);
      })
    }
  }

  const validation = () => {
    var isValid = true;
    let err = {};
    if (!fitup.issued_id) {
      isValid = false;
      err['issued_id_err'] = "Please select issue";
    }
    setError(err);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const issueOptions = filterIssue?.map(issue => ({
  //     label: `${issue?.issue_accept_no} - ${issue?.isCompletedStatus}`,
  //     value: issue?._id
  // })) || [];

  const issueOptions = filterIssue
    ?.filter(issue => issue?.isFitUp === true)   // ✅ only FitUp true
    ?.map(issue => ({
      label: `${issue?.issue_accept_no} - ${issue?.isCompletedStatus}`,
      value: issue?._id
    })) || [];

  console.log("issueOptions", issueOptions);



  // const handleRemove = async (itemId) => {
  //   console.log("REMOVE ITEM ID:", itemId);
  //   try {
  //     const formData = new URLSearchParams();
  //     formData.append("_id", itemId);

  //     const res = await axios.post(
  //       `${V_URL}/user/remove-fitup-offer-table-piping`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //           Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
  //         },
  //       }
  //     );

  //     if (res.data?.success) {
  //       toast.success("Item removed");

  //       setFinalArr(prev =>
  //         prev.filter(item => getId(item._id) !== getId(itemId))
  //       );
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to remove item");
  //   }
  // };

  const handleRemove = async (itemId) => {
    // const item_id = itemId?._id || itemId;
    if (!itemId) {
      toast.error("Invalid item id");
      return;
    }

    console.log("REMOVE ITEM ID:", itemId);

    try {
      const formData = new URLSearchParams();
      formData.append("_id", itemId?.fitup_offer_id);

      const res = await axios.post(
        `${V_URL}/user/remove-fitup-offer-table-piping`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN"),
          },
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message);
        setFinalArr(prev =>
          prev.filter(item => getId(item._id) !== getId(itemId))
        );
        setSubmitArr(prev =>
          prev.filter(item => getId(item._id) !== getId(itemId))
        );
        dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id, project_id }));
        dispatch(getDrawingJointWisePiping({}));


      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message);
    }
  };


  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader breadcrumbs={[
            { name: "Dashboard", link: "/piping/user/dashboard", active: false },
            { name: "Fit-Up Inspection Offer List", link: "/piping/user/fitup-management", active: false },
            { name: `${data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer`, active: true }
          ]} />

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Issued List <span className="login-danger">*</span></label>
                          <Dropdown
                            options={issueOptions}
                            value={fitup.issued_id || ""}
                            onChange={(e) => handleChange(e, 'issued_id')}
                            filter className='w-100'
                            placeholder="Select Issued Acceptance No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error.issued_id_err}</div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <FitUpDrawingTable
            tableTitle={'Drawing List'}
            commentsData={commentsData}
            handleAddToIssueArr={handleAddToIssueArr}
            currentPage={currentPage}
            limit={limit}
            setlimit={setlimit}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
            setSearch={setSearch}
            data={data}
          />

          <MultipleFitupTable
            data={data}
            issueId={fitup?.issued_id}
            finalArr={finalArr}
            handleSaveClick={handleSaveClick}
            handleRemove={handleRemove}
            setSubmitArr={setSubmitArr}
          />

          <SubmitButton finalReq={data?.items} link='/piping/user/fitup-management' disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Fit-Up Offer'} />
        </div>
        <Footer />
      </div>
      {/* <MultiFitupModal
                showItem={showItem}
                drawId={drawId}
                issueId={fitup?.issued_id}
                handleCloseModal={() => setShowItem(false)}
                title={'Issue Acceptance Section List'}
                // tableData={issObj?.items}
                setFinalArr={setFinalArr}
                finalArr={finalArr}
            /> */}
    </div>
  )
}

export default ManageMultiFitup