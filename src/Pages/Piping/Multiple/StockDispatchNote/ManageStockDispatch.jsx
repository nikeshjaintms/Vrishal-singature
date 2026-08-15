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
import DispatchDrawingTable from '../Components/StockDispatchItemTable/StockDispatchItemTable';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import { getUserGenInspectionSummary } from '../../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';
import DispatchModel from './StockDispatchModal/StockDispatchModel';
import DispatchTable from './StockDispatchModal/StockDispatchTable';
import { checkDispatchNote } from '../../../../helper/hideDrawing';
import {getDispatchNoteItemFromStockIssueAcc} from '../../../../Store/Piping/StockDispatchNote/getDispatchNoteItemFromStockIssueAcc';
import { getUserPaintSystemPiping } from '../../../../Store/Piping/PaintSystem/PaintSystem';

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
    dispatch(getDispatchNoteItemFromStockIssueAcc({
      project_id: localStorage.getItem('U_PROJECT_ID'),
      page: currentPage,
      limit: limit,
      search: debouncedSearch
    }));
   
    dispatch(getUserPaintSystemPiping({ status: '' }));
  }, [dispatch, currentPage, limit, debouncedSearch]);

  // Select data from store

 
  const issueDrawingIds = useSelector(
    (state) => state.getDispatchNoteItemFromStockIssueAcc?.drawingIds || [] // Correct slice key
  );
  const loadingIssueDrawings = useSelector(
    (state) => state.getDispatchNoteItemFromStockIssueAcc?.loading
  );
  const paints = useSelector(state => state?.getUserPaintSystemPiping?.user?.data);

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
        const res = await axios.post(`${V_URL}/user/get-all-paint-requirement`, {}, {
          headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") }
        });
        if (res.data?.success && Array.isArray(res.data.data?.data)) {
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



const handleAddToArr = async (row) => {
  try {
    console.log("Selected row:", row);

    // 🔁 UNIQUE KEY (IMPORTANT)
    const uniqueKey = `${row.item_id}_${row.size1}_${row.size2}_${row.thickness1}_${row.thickness2}_${row.material_grade}`;

    const isDuplicate = finalArr.some(
      (d) => d.uniqueKey === uniqueKey
    );

    if (isDuplicate) {
      toast.error("Item already added");
      return;
    }

    // 🔥 Prepare items (FROM GROUPED items[])
    const preparedItems = row.items.map((subItem) => ({
      source: "stock_issue_acceptance",

      stock_issue_accptance_id: subItem.issue_id, // main document id
      item_id: row.item_id,

      qty: subItem.iss_used_qty || 0,

      stock_issue_accptance_item_id: subItem.item_issue_id, // IMPORTANT (items._id)

      remarks: subItem.remarks || "",
    }));

    if (!preparedItems.length) {
      toast.error("No valid items");
      return;
    }

    // 🔥 API CALL (bulk)
    const payload = {
      project_id: localStorage.getItem("U_PROJECT_ID"),
      items: preparedItems,
    };

    console.log("Payload:", payload);

    await axios.post(
      `${V_URL}/user/piping-manage-multi-stock-dispatch-offer`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("PAY_USER_TOKEN")}`,
        },
      }
    );

    // ✅ UI update
    setFinalArr((prev) => [
      ...prev,
      {
        ...row,
        uniqueKey, // store key
         data: preparedItems,
      },
    ]);

    toast.success("Items added successfully");

    // 🔄 Refresh list
    dispatch(
      getDispatchNoteItemFromStockIssueAcc({
        project_id: localStorage.getItem("U_PROJECT_ID"),
        page: currentPage,
        limit: limit,
        search: debouncedSearch,
      })
    );

  } catch (error) {
    console.error("handleAddToAssign error:", error);
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

const filteredData = submitArr.map((item) => {
  // 🔹 Normalize IDs safely
  const getId = (val) => {
    if (!val || val === "-" || val === "" || val === "null" || val === "undefined") return null;
    if (typeof val === "string") return val;
    if (typeof val === "object") return val._id || val.id || null;
    return null;
  };

  return {
    dis_offer_id: item._id || null,

    // 🔥 FIX: correct item_id
    item_id: getId(item.item_id) || getId(item.item_detail_id) || null,

    // 🔥 IMPORTANT: always array
    data: Array.isArray(item.data) && item.data.length > 0 ? item.data : [],

    // 🔥 FIX qty
    total_qty: Number(item.qty || item.total_qty || 0),

    area_sqm: Number(item.area_sqm || 0),

    moved_next_step: Number(item.moved_next_step || 0),

    // 🔥 FIX IDs (handle object/string)
    service_id: getId(item.service_id) || getId(item.service),

    piping_class: getId(item.piping_class_id || item.piping_class),

    piping_material_specification: getId(
      item.piping_material_specification ||
      item.PipingMaterialSpecification
    ),

    final_coat_shade_id: getId(item.final_coat_shade_id) || getId(item.final_coat_shade_id?._id),

    remarks: item.remarks || "",
  };
});


    console.log("filteredData", filteredData);

    setDisable(true);

    const dataToSend = new URLSearchParams();
    dataToSend.append('items', JSON.stringify(filteredData));
    dataToSend.append('dispatch_site', dispatch_site);
    dataToSend.append('release_date', formDataFromChild?.release_date || '');
    dataToSend.append('paint_system', paint_system || '');
    dataToSend.append('prepared_by', localStorage.getItem('PAY_USER_ID'));
    dataToSend.append('project', localStorage.getItem('U_PROJECT_ID'));
    dataToSend.append('project_name', localStorage.getItem('PAY_USER_PROJECT_NAME'));

    axios({
      method: 'post',
      url: `${V_URL}/user/piping-manage-multi-stock-dispatch`,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer ' + localStorage.getItem('PAY_USER_TOKEN'),
      },
    })
      .then((response) => {
        if (response?.data?.success) {
          toast.success(response.data.message);
          navigate('/piping/user/stock-dispatch-note-management');
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Something went wrong');
      })
      .finally(() => setDisable(false));
  };



  // if (loadingIssueDrawings) return <p>Loading drawings...</p>;

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
                  name: 'Stock Dispatch Note- PAINTING',
                  link: '/piping/user/stock-dispatch-note-management',
                  active: false,
                },
                {
                  name: `${data?._id ? 'Edit' : 'Add'} Stock Dispatch Note- PAINTING`,
                  active: true,
                },
              ]}
            />

            <DispatchDrawingTable
              is_dispatch={true}
              tableTitle={'Item List'}
              handleAddToIssueArr={handleAddToArr}
              handleSubmit={handleSubmit}
              currentPage={currentPage}
              limit={limit}
              setlimit={setLimit}
              totalItems={issueDrawingIds?.pagination?.total || 0}
              setCurrentPage={setCurrentPage}
              setSearch={setSearch}
              data={data}
              search={search}
              commentsData={issueDrawingIds?.data || []}
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
              link="/piping/user/stock-dispatch-note-management"
              disable={disable}
              handleSubmit={handleSubmit}
              buttonName={'Generate Stock Dispatch Note Offer'}
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
