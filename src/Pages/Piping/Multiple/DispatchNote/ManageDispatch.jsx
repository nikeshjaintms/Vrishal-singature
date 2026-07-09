import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { V_URL } from '../../../../BaseUrl';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import DispatchDrawingTable from '../Components/DispatchDrawingTable/DispatchDrawingTable';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import { getUserGenInspectionSummary } from '../../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';
import DispatchModel from './DispatchModal/DispatchModel';
import DispatchTable from './DispatchModal/DispatchTable';
import { checkDispatchNote } from '../../../../helper/hideDrawing';
import { fetchPipingIssueDrawingIds } from '../../../../Store/Piping/DrawingIssueAcc/getDrawingIssueAcc';

const ManageDispatch = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = location.state;

  const [disable, setDisable] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [entity, setEntity] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [finalArr, setFinalArr] = useState([]);
  const [showItem, setShowItem] = useState(false);
  const [submitArr, setSubmitArr] = useState([]);
  const [dispatchSite, setDispatchSite] = useState('');
  const [matchDatas, setMatchDatas] = useState([]);
  const [unMatchedDatas, setUnMatchDatas] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paintRequirements, setPaintRequirements] = useState([]);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getUserGenInspectionSummary());
    dispatch(fetchPipingIssueDrawingIds({
      project_id: localStorage.getItem('U_PROJECT_ID'),
      page: currentPage,
      limit: limit,
      search: debouncedSearch
    }));
    dispatch(getDrawing());
  }, [dispatch, currentPage, limit, debouncedSearch]);

  // Select data from store

  const drawData = useSelector((state) => state.getDrawing?.user?.data?.data || []);
  const issueDrawingIds = useSelector(
    (state) => state.fetchPipingIssueDrawingIds?.drawingIds || [] // Correct slice key
  );
  const loadingIssueDrawings = useSelector(
    (state) => state.fetchPipingIssueDrawingIds?.loading
  );

  // console.log('issueDrawingIds', issueDrawingIds);

  // Check completed drawings
  const checkCompletedDrawing = async () => {
    const res = await checkDispatchNote(entity, dispatch);
    setMatchDatas(res.matchData);
    setUnMatchDatas(res.unmatchData);
  };

  useEffect(() => {
    checkCompletedDrawing();
  }, [entity]);

  // Handle dispatch site input

  // Fetch paint requirements
  useEffect(() => {
    const fetchPaintRequirements = async () => {
      try {
        const project = localStorage.getItem("U_PROJECT_ID");
        const res = await axios.get(`${V_URL}/user/get-piping-painting-system?project=${project}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") }
        });
        if (res.data?.success && Array.isArray(res.data?.data)) {
          setPaintRequirements(res.data.data);
        } else if (res.data?.success && res.data?.data?.data && Array.isArray(res.data.data.data)) {
          setPaintRequirements(res.data.data.data);
        } else {
          setPaintRequirements([]);
        }
      } catch (error) {
        toast.error("Failed to load Paint System Numbers");
      }
    };
    fetchPaintRequirements();
  }, []);

  //  const handleAddToArr = async (drawing) => {
  // try {
  // console.log("handleAddToArr called with drawing:", drawing);


  // /* ---------------- CHECK DUPLICATE DRAWING ---------------- */

  // if (finalArr.some((d) => d._id === drawing._id)) {
  //   console.warn("Drawing already added:", drawing);
  //   toast.error("Drawing already added");
  //   return;
  // }

  // /* ---------------- FETCH DISPATCH ITEMS ---------------- */

  // console.log("Fetching dispatch items for drawing:", drawing._id);

  // const res = await axios.post(
  //   `${V_URL}/user/piping-get-dispatch-acceptance-items`,
  //   { drawing_id: drawing._id },
  //   {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
  //     },
  //   }
  // );

  // console.log("Response received:", res.data);

  // const dispatchItems = res.data?.data || [];

  // if (!dispatchItems.length) {
  //   console.warn("No dispatch items found for drawing:", drawing._id);
  //   toast.error("No dispatch items found");
  //   return;
  // }

  // console.log("Dispatch items:", dispatchItems);

  // /* ---------------- PREPARE ITEMS FOR DISPATCH ---------------- */

  // const preparedItems = dispatchItems.map((item) => ({
  //   source: item.source,
  //   main_id: item.main_id,
  //   drawing_id: item.drawing_id,
  //   piping_class: item.piping_class,
  //   service_id: item.service_id,
  //   material_item_id: item.material_item_id,
  //   item_id: item.item_id,
  //   qty: item.qty || 0,
  //   spool_no_id: item.spool_no_id || null,
  // }));

  // console.log("Prepared items for dispatch:", preparedItems);

  // if (!preparedItems.length) {
  //   toast.error("No valid items for dispatch");
  //   return;
  // }

  // /* ---------------- DISPATCH ITEMS ---------------- */

  // for (let item of preparedItems) {
  //   console.log("Dispatching item:", item);

  //   const formData = new URLSearchParams();

  //   formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
  //   formData.append("drawing_id", item.drawing_id);
  //   formData.append("piping_class", item.piping_class || "");
  //   formData.append("service_id", item.service_id || "");
  //   formData.append("material_item_id", item.material_item_id || "");
  //   formData.append("item_id", item.item_id || "");
  //   formData.append("main_id", item.main_id);
  //   formData.append("qty", item.qty);
  //   formData.append("spool_no_id", item.spool_no_id || "");
  //   formData.append("source", item.source);
  //   formData.append("prepared_by", localStorage.getItem("PAY_USER_ID"));
  //   formData.append("dispatch_site", dispatchSite || "default-site");

  //   const dispatchRes = await axios.post(
  //     `${V_URL}/user/piping-manage-multi-dispatch-offer`,
  //     formData,
  //     {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
  //       },
  //     }
  //   );

  //   console.log("Dispatch response:", dispatchRes.data);
  // }
  //   dispatch(fetchPipingIssueDrawingIds());
  // /* ---------------- SUCCESS ---------------- */

  // toast.success("Accepted items added to dispatch successfully!");

  // setFinalArr((prev) => [...prev, drawing]);

  // console.log("Final array updated:", [...finalArr, drawing]);


  // } catch (error) {
  // console.error("Error in handleAddToArr:", error);
  // toast.error("Failed to add items");
  // }
  // };

  // ---------------------- handleAddToArr ----------------------
  const handleAddToArr = async (drawing) => {
    try {
      console.log("Adding drawing:", drawing);

      // ---------------------- DUPLICATE CHECK ----------------------
      const isDuplicate = finalArr.some((d) => {
        if (drawing.spool_no_id) {
          // FD / PT: dedupe by drawing + spool
          return d.drawing_id === drawing.drawing_id && d.spool_no_id === drawing.spool_no_id;
        } else {
          // Material Issue: dedupe by drawing_id only
          return d.drawing_id === drawing.drawing_id;
        }
      });

      if (isDuplicate) {
        toast.error("Drawing already added");
        return;
      }

      // ---------------------- FETCH DISPATCH ITEMS ----------------------
      // const res = await axios.post(
      //   `${V_URL}/user/piping-get-dispatch-acceptance-items`,
      //   { drawing_id: drawing.drawing_id },
      //   {
      //     headers: { Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}` },
      //   }
      // );
      const payload = {
        drawing_id: drawing.drawing_id,
        source: drawing.source,
      };

      // add spool only if present
      if (drawing.spool_no_id) {
        payload.spool_no_id = drawing.spool_no_id;
      }

      console.log("Request payload:", payload);

      const res = await axios.post(
        `${V_URL}/user/piping-get-dispatch-acceptance-items`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
          },
        }
      );
      const dispatchItems = res.data?.data || [];

      if (!dispatchItems.length) {
        toast.error("No dispatch items found for this drawing");
        return;
      }

      // ---------------------- PREPARE ITEMS ----------------------
      const preparedItems = dispatchItems.map((item) => ({
        source: item.source,
        main_id: item.main_id,
        drawing_id: item.drawing_id,
        spool_no_id: item.spool_no_id || null,
        piping_class: item.piping_class,
        service_id: item.service_id,
        material_item_id: item.material_item_id,
        item_id: item.item_id,
        qty: item.spool_no_id ? 1 : item.qty || 0, // If spool_no_id exists, qty is 1, else take from item
        issue_id: drawing.issue_id || null,
        fd_id: drawing.fd_id || null,
        pressure_test_id: drawing.pressure_test_id || null,
      }));

      if (!preparedItems.length) {
        toast.error("No valid items for dispatch");
        return;
      }

      // ---------------------- DISPATCH ITEMS ----------------------
      for (let item of preparedItems) {
        const formData = new URLSearchParams();
        formData.append("project_id", localStorage.getItem("U_PROJECT_ID"));
        formData.append("drawing_id", item.drawing_id);
        formData.append("spool_no_id", item.spool_no_id || "");
        formData.append("piping_class", item.piping_class || "");
        formData.append("service_id", item.service_id || "");
        formData.append("material_item_id", item.material_item_id || "");
        formData.append("item_id", item.item_id);
        formData.append("main_id", item.main_id);
        formData.append("qty", item.qty);
        formData.append("source", item.source);
        if (item.issue_id) formData.append("issue_id", item.issue_id);
        if (item.fd_id) formData.append("fd_id", item.fd_id);
        if (item.pressure_test_id) formData.append("pressure_test_id", item.pressure_test_id);
        formData.append("prepared_by", localStorage.getItem("PAY_USER_ID"));
        formData.append("dispatch_site", dispatchSite || "default-site");

        await axios.post(
          `${V_URL}/user/piping-manage-multi-dispatch-offer`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
            },
          }
        );
      }

      // ---------------------- SUCCESS ----------------------
      toast.success("Items added to dispatch successfully!");
      setFinalArr((prev) => [...prev, drawing]);
      dispatch(fetchPipingIssueDrawingIds({
        project_id: localStorage.getItem('U_PROJECT_ID'),
        page: currentPage,
        limit: limit,
        search: debouncedSearch
      }));
    } catch (error) {
      console.error("handleAddToArr error:", error);
      toast.error("Failed to add items");
    }
  };


  const onChange = (e) => setDispatchSite(e.target.value);
  useEffect(() => {
    console.log("🔥 SUBMIT ARR (PARENT):", submitArr);
  }, [submitArr]);

  // Handle form submit
  const handleSubmit = (formDataFromChild) => {
    // Use dispatchSite from child if passed
    const dispatch_site = formDataFromChild?.dispatch_site || dispatchSite;
    const paint_system = formDataFromChild?.paint_system;


    if (submitArr.length === 0) {
      toast.error('Please add drawing sections');
      return;
    }

    if (!paint_system) {
      toast.error('Please select paint system');
      return;
    }

    if (!dispatch_site) {
      toast.error('Please enter dispatch site');
      return;
    }

    console.log("Form data from child:", submitArr);

    const filteredData = submitArr.map((item) => ({

      dis_offer_id: item._id,
      main_id: item.main_id,
      drawing_id: item.drawing_id && item.drawing_id !== '-' ? item.drawing_id : null,
      spool_id: item.spool_no_id && item.spool_no_id !== '-' ? item.spool_no_id : null,
      drawing_no: item.drawing_no && item.drawing_no !== '-' ? item.drawing_no : null,
      material_item_id: item.material_item_id && item.material_item_id !== '-' ? item.material_item_id : null,
      item_id: item.item_detail_id,
      rev: item.rev && item.rev !== '-' ? item.rev : null,
      area_sqm: item.area_sqm,
      qty: item.qty,
      moved_next_step: item.moved_next_step,
      service_id: item.service_id._id,
      piping_class: item.piping_class_id,
      remarks: item.remarks,
    }));


    console.log("filteredData", filteredData);

    setDisable(true);

    const dataToSend = new URLSearchParams();
    dataToSend.append('items', JSON.stringify(filteredData));
    dataToSend.append('dispatch_site', dispatch_site);
    dataToSend.append('release_date', formDataFromChild?.release_date || '');
    dataToSend.append('paint_system', paint_system || '');
    dataToSend.append('isSurface', formDataFromChild?.isSurface ? 1 : 0);
    dataToSend.append('isMio', formDataFromChild?.isMio ? 1 : 0);
    dataToSend.append('isFp', formDataFromChild?.isFp ? 1 : 0);
    dataToSend.append('isIrn', formDataFromChild?.isIrn ? 1 : 0);
    dataToSend.append('prepared_by', localStorage.getItem('PAY_USER_ID'));
    dataToSend.append('project', localStorage.getItem('U_PROJECT_ID'));
    dataToSend.append('project_name', localStorage.getItem('PAY_USER_PROJECT_NAME'));

    axios({
      method: 'post',
      url: `${V_URL}/user/piping-manage-multi-dispatch`,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + localStorage.getItem('PAY_USER_TOKEN'),
      },
    })
      .then((response) => {
        if (response?.data?.success) {
          toast.success(response.data.message);
          navigate('/piping/user/dispatch-note-management');
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Something went wrong');
      })
      .finally(() => setDisable(false));
  };



  if (loadingIssueDrawings) return <p>Loading drawings...</p>;

  return (
    <>
      <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
        <Header handleOpen={handleOpen} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content">
            <PageHeader
              breadcrumbs={[
                { name: 'Dashboard', link: '/piping/user/dashboard', active: false },
                {
                  name: 'Dispatch Note- PAINTING',
                  link: '/piping/user/dispatch-note-management',
                  active: false,
                },
                {
                  name: `${data?._id ? 'Edit' : 'Add'} Dispatch Note- PAINTING`,
                  active: true,
                },
              ]}
            />

            <DispatchDrawingTable
              is_dispatch={true}
              tableTitle={'Drawing List'}
              handleAddToIssueArr={handleAddToArr}
              handleSubmit={handleSubmit}
              currentPage={currentPage}
              limit={limit}
              setlimit={setLimit}
              totalItems={issueDrawingIds?.totalValue || issueDrawingIds?.data?.length || 0}
              setCurrentPage={setCurrentPage}
              setSearch={setSearch}
              data={data}
              search={search}
              commentsData={issueDrawingIds?.data || (Array.isArray(issueDrawingIds) ? issueDrawingIds : [])}
              finalArr={finalArr}
            />

            <DispatchTable
              finalArr={finalArr}
              submitArr={submitArr}
              setFinalArr={setFinalArr}
              setSubmitArr={setSubmitArr}  // ✅ CENTRAL CONTROL
            />
            <SubmitButton
              dispatch_site={dispatchSite}
              paintRequirements={paintRequirements}
              submitArr={submitArr}
              onChange={onChange}
              is_dispatch={true}
              finalReq={data?.items}
              link="/piping/user/dispatch-note-management"
              disable={disable}
              handleSubmit={handleSubmit}
              buttonName={'Generate Dispatch Note Offer'}
            />
          </div>
        </div>
      </div>

      {/* <DispatchModel
        showItem={showItem}
        handleCloseModal={() => setShowItem(false)}
        title={'Drawing Grid List'}
        dispatchData={dispatchData}
      /> */}
    </>
  );
};

export default ManageDispatch;
