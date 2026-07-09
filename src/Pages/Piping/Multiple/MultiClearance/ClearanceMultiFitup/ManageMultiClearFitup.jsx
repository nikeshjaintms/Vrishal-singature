import  { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import {  Search } from '../../../Table';
import { getUserAdminDraw } from '../../../../../Store/Erp/Planner/Draw/UserAdminDraw';
// import { getUserWpsMaster } from '../../../../../Store/Store/WpsMaster/WpsMaster';
import { getUserWpsMasterPiping } from '../../../../../Store/Piping/WpsMaster/WpsMaster';
import { Check, Save, X } from 'lucide-react';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getIssueAcceptancePiping } from "../../../../../Store/Piping/IssueAcceptance/getIssueAcceptancePiping";

const ManageMultiClearFitup = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [limit, setlimit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [disable, setDisable] = useState(false);
    const [rootDPTRequired, setRootDPTRequired] = useState({});
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});
    const data = location.state;
    const [selectedProcedure, setSelectedProcedure] = useState(null);
console.log("data qc",data);
    useEffect(() => {
        dispatch(getUserAdminDraw());
        dispatch(getIssueAcceptancePiping({}));
        dispatch(getUserWpsMasterPiping({ status: true }));
    }, []);

    useEffect(() => {
        if (data) {
            setTableData(data?.items);
        }
    }, [data]);
 const issuedData = useSelector((state) => state?.getIssueAcceptancePiping?.user?.data?.items);
    console.log("issuedData",issuedData);
    const drawData = useSelector((state) => state?.getUserAdminDraw?.user?.data?.data);
    const wpsData = useSelector((state) => state?.getUserWpsMasterPiping?.data);
    console.log("wpsData",wpsData);

//     const commentsData = useMemo(() => {
//         let computedComments = tableData || [];
//         if (search) {
//             computedComments = computedComments.filter((item) =>
//                 item?.drawing_id?.drawing_no?.toLowerCase().includes(search.toLowerCase()) ||

//                 item?.grid_item_id?.item_name?.name?.toLowerCase().includes(search.toLowerCase())
//             );
//         }
//         setTotalItems(computedComments?.length);
//         return computedComments;
//     }, [currentPage, search, limit, tableData]);
// console.log("commentsData qc",commentsData);

const commentsData = useMemo(() => {
    let computedComments = tableData.map((item, index) => ({
        ...item,
        originalIndex: index, // ✅ store real index
    }));

    if (search) {
        computedComments = computedComments.filter((item) =>
            item?.drawing_id?.drawing_no?.toLowerCase().includes(search.toLowerCase()) ||
            item?.grid_item_id?.item_name?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }

    setTotalItems(computedComments?.length);
    return computedComments;
}, [search, tableData]);

    const getDrawing = (drawId) => {
        const findDrawing = drawData?.find((dr) => dr?._id === drawId)
        return findDrawing;
    }

    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({
        wps_no: '',
        qc_remarks: '',
        wpsName: '',
        is_accepted: '',
         imir_no_1: '',
    heat_no_1: '',
    imir_no_2: '',
    heat_no_2: '',
    });

    // const handleEditClick = (index, row) => {
    //     setEditRowIndex(index);
    //     setEditFormData({
    //         wps_no: row.wps_no,
    //         qc_remarks: row.qc_remarks,
    //         wpsName: wpsData.find(w => w._id === row.wps_no)?.wpsNo,
    //         is_accepted: ''
    //     });
    // }
// const handleEditClick = (index, row) => {

//     // Filter WPS based on material specification
//     const filteredWps = wpsData?.filter((wps) => {
//         const wpsSpecId = String(wps?.PipingMaterialSpecification?._id);
//         const drawingSpecId = String(row?.drawing_id?.material_specification?._id);
//         return wpsSpecId === drawingSpecId;
//     });

//     // Auto select if only one WPS available
//     const autoWps = filteredWps?.length === 1 ? filteredWps[0] : null;

//     setEditRowIndex(index);

//     setEditFormData({
//         wps_no: autoWps ? autoWps._id : row.wps_no || '',
//         qc_remarks: row.qc_remarks || '',
//         wpsName: autoWps ? autoWps.wpsNo : wpsData.find(w => w._id === row.wps_no)?.wpsNo,
//         is_accepted: '',
//          imir_no_1: row.imir_no_1 || '',
//     heat_no_1: row.heat_no_1 || '',
//     imir_no_2: row.imir_no_2 || '',
//     heat_no_2: row.heat_no_2 || '',
//     });
// };
const handleEditClick = (index, row) => {

  // ✅ Get material item IDs
  const materialItem1 =
    row?.joint_wise_data?.[0]?.material_items?.material_item_details?.[0]?._id;

  const materialItem2 =
    row?.joint_wise_data?.[0]?.material_items?.material_item_details?.[1]?._id;

  // ✅ Get IMIR & Heat options
  const { imirList: imirList1, heatList: heatList1 } =
    getImirHeatOptions(row?.drawing_id?._id, materialItem1);

  const { imirList: imirList2, heatList: heatList2 } =
    getImirHeatOptions(row?.drawing_id?._id, materialItem2);

  // ✅ Auto-select if only one option
  const autoImir1 = imirList1.length === 1 ? imirList1[0] : '';
  const autoHeat1 = heatList1.length === 1 ? heatList1[0] : '';

  const autoImir2 = imirList2.length === 1 ? imirList2[0] : '';
  const autoHeat2 = heatList2.length === 1 ? heatList2[0] : '';

  // ✅ Existing WPS logic
  const filteredWps = wpsData?.filter((wps) => {
    const wpsSpecId = String(wps?.PipingMaterialSpecification?._id);
    const drawingSpecId = String(row?.drawing_id?.material_specification?._id);
    return wpsSpecId === drawingSpecId;
  });

  const autoWps = filteredWps?.length === 1 ? filteredWps[0] : null;

  setEditRowIndex(index);

  setEditFormData({
    wps_no: autoWps ? autoWps._id : row.wps_no || '',
    wpsName: autoWps ? autoWps.wpsNo : wpsData.find(w => w._id === row.wps_no)?.wpsNo,

    qc_remarks: row.qc_remarks || '',
    is_accepted: '',

    // ✅ AUTO IMIR & HEAT
    imir_no_1: row.imir_no_1 || autoImir1,
    heat_no_1: row.heat_no_1 || autoHeat1,

    imir_no_2: row.imir_no_2 || autoImir2,
    heat_no_2: row.heat_no_2 || autoHeat2,
  });
};

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        const selectedWPS = wpsData.find(wp => wp._id === value);
        if (name === 'wps_no' || name === 'wpsName') {
            setEditFormData({ ...editFormData, wps_no: value, wpsName: selectedWPS?.wpsNo });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    }

//     const handleSaveClick = () => {
//         const updatedData = [...tableData];
//         const dataIndex = (currentPage - 1) * limit + editRowIndex;
//         // updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData, is_accepted: acceptRejectStatus[editRowIndex] };
//           updatedData[dataIndex] = {
//     ...updatedData[dataIndex],
//     ...editFormData,
//     is_accepted: acceptRejectStatus[editRowIndex],
//     root_dpt: rootDPTRequired[editRowIndex] || false,
//   };
//         setTableData(updatedData);
//         setEditRowIndex(null);
//     }

    const handleSaveClick = () => {
  const updatedData = [...tableData];
  const dataIndex = (currentPage - 1) * limit + editRowIndex;

  const rootDptValue =
    rootDPTRequired[editRowIndex] === undefined
      ? false
      : rootDPTRequired[editRowIndex];

  updatedData[dataIndex] = {
    ...updatedData[dataIndex],
    ...editFormData,
    is_accepted: acceptRejectStatus[editRowIndex],
    root_dpt: rootDptValue,
  };

  setRootDPTRequired((prev) => ({
    ...prev,
    [editRowIndex]: rootDptValue,
  }));

  setTableData(updatedData);
  setEditRowIndex(null);
};


    const handleCancelClick = () => {
        setEditRowIndex(null);
    };
const handleStatusChange = (e) => {
    setSelectedProcedure(e.target.value);
};

    const handleAcceptRejectClick = (index, isAccepted, name) => {
        Swal.fire({
            title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
            text: "Are you sure you want to proceed?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            dangerMode: !isAccepted,
        }).then((result) => {
            // if (result.isConfirmed) {
            //     // setAcceptRejectStatus((prev) => ({
            //     //     ...prev,
            //     //     [index]: isAccepted,
            //     // }));

            //     const updatedTableData = [...tableData];
            //     const updatedStatus = { ...acceptRejectStatus };

            //     const targetItem = updatedTableData[index];

            //     if (!targetItem) return;

            //     const { drawing_id, grid_item_id } = targetItem;

            //     updatedTableData.forEach((item, i) => {
            //         if (item.drawing_id === drawing_id && item.grid_item_id?.grid_id?._id === grid_item_id?.grid_id?._id) {
            //             item.is_accepted = isAccepted; // Update tableData is_accepted value
            //             updatedStatus[i] = isAccepted;
            //         }
            //     });

            //     setTableData(updatedTableData);
            //     setAcceptRejectStatus(updatedStatus);
            //     toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
            // }
            if (result.isConfirmed) {
            const updatedStatus = { ...acceptRejectStatus };
            const targetItem = tableData[index];
            if (!targetItem) return;
            const { drawing_id, grid_item_id } = targetItem;
            const updatedTableData = tableData.map((item, i) => {
                if (
                    item.drawing_id === drawing_id &&
                    item.grid_item_id?.grid_id?._id ===
                    grid_item_id?.grid_id?._id
                ) {
                    updatedStatus[i] = isAccepted;

                    return {
                        ...item,
                        is_accepted: isAccepted,
                    };
                }
                return item;
            });

            setTableData(updatedTableData);
            setAcceptRejectStatus(updatedStatus);

            toast.success(
                `${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`
            );
        }
        });
    };

    const handleSubmit = () => {
         let updatedData = tableData;
        // let isValid = true;
        // updatedData?.forEach(item => {
        //     if (item.wps_no === '' || item.wps_no === undefined) {
        //         isValid = false;
        //         toast.error(`Please select wps no. for ${item?.grid_item_id?.item_name?.name}`);
        //     }
        //     if (item.is_accepted === '' || item.is_accepted === undefined) {
        //         isValid = false;
        //         toast.error(`Please accept or reject for (${item?.grid_item_id?.item_name?.name})-(${item?.grid_item_id?.grid_id?.grid_no}-${item?.grid_item_id?.grid_id?.grid_qty})`);

        //     }
        // })
        // if(!selectedProcedure){
        //     toast.error('Please Select Procedure');
        // }
        // if (!isValid) {
        //     return;
        // }
         let isValid = true;

    // 1️⃣ Validate Procedure first
    // if (!selectedProcedure) {
    //     toast.error('Please Select Procedure');
    //     return;
    // }

    // 2️⃣ Validate table data
    for (let item of tableData) {

        if (!item.wps_no) {
            toast.error(
                `Please select WPS No.`
            );
            isValid = false;
            break;
        }

        if (item.is_accepted === '' || item.is_accepted === undefined) {
            toast.error(
                `Please accept or reject for Item`
            );
            isValid = false;
            break;
        }

          if (!item.imir_no_1) {
    toast.error(`Please select IMIR No. 1`);
    isValid = false;
    break;
  }

  // ✅ Heat 1 validation
  if (!item.heat_no_1) {
    toast.error(`Please select Heat No. 1`);
    isValid = false;
    break;
  }

  // ✅ IMIR 2 validation (only if item 2 exists)
  const hasItem2 =
    item?.joint_wise_data?.[0]?.material_items?.material_item_details?.[1];

  if (hasItem2 && !item.imir_no_2) {
    toast.error(`Please select IMIR No. 2`);
    isValid = false;
    break;
  }

  // ✅ Heat 2 validation (only if item 2 exists)
  if (hasItem2 && !item.heat_no_2) {
    toast.error(`Please select Heat No. 2`);
    isValid = false;
    break;
  }

    }

    if (!isValid) return;
//         const filteredData = updatedData?.map(item => ({
//             ...item,
           
//             material_item_id:item.material_item_id?._id,
//              item_id: item.material_item_id?.item?._id,
//             wps_no: item.wps_no,
//             joint_type: item.joint_type?.map((e) => e?._id),
//             qc_remarks: item.qc_remarks || '',
//           root_dpt: rootDPTRequired[index],
// weld_visual_offer: !(rootDPTRequired[index])
//         }))
const filteredData = updatedData?.map((item, index) => ({
  ...item,
  material_item_id: item.material_item_id?._id,
  item_id: item.material_item_id?.item?._id,
  wps_no: item.wps_no,
  joint_type: item.joint_type?.map((e) => e?._id),
   imir_no_1: item.imir_no_1,
  heat_no_1: item.heat_no_1,
  imir_no_2: item.imir_no_2,
  heat_no_2: item.heat_no_2,
  qc_remarks: item.qc_remarks || '',
  root_dpt: rootDPTRequired[index] || false,
  weld_visual_offer: !(rootDPTRequired[index] || false)
}))
        setDisable(true);
        const myurl = `${V_URL}/user/verify-fitup-offer-piping`;
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('id', data?._id);
//         bodyFormData.append("isWeldVisualOffer", selectedProcedure === "weld_visual_offer");
// bodyFormData.append("isRootDPT", selectedProcedure === "root_dpt");
     
        bodyFormData.append('items', JSON.stringify(filteredData))
        bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
        bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
        axios({
            method: "post",
            url: myurl,
            data: bodyFormData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response.data?.success === true) {
                toast.success(response.data.message);
                localStorage.removeItem('FIT_OFF_DATA');
                navigate('/piping/user/fitup-clearance-management');
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            toast.error(error?.response?.data?.message);
        }).finally(() => { setDisable(false) });
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
// const getImirHeatOptions = (drawingId, materialItemId) => {
//   if (!issuedData) return { imirList: [], heatList: [] };
// console.log("drawingId=====>",drawingId);
// console.log("materialItemId=====>",materialItemId);

// const matchedItems = [];

// issuedData.forEach((mainItem) => {
//   mainItem?.items?.forEach((subItem) => {

//     const itemDrawingId =
//       typeof subItem?.drawing_id === "object"
//         ? subItem?.drawing_id?._id
//         : subItem?.drawing_id;

//     const itemMaterialId =
//       typeof subItem?.material_item_id === "object"
//         ? subItem?.material_item_id?._id
//         : subItem?.material_item_id;

//     console.log("DB drawing_id =>", itemDrawingId);
//     console.log("DB material_item_id =>", itemMaterialId);

//     if (
//       String(itemDrawingId) === String(drawingId) &&
//       String(itemMaterialId) === String(materialItemId)
//     ) {
//       matchedItems.push(subItem); // ✅ IMPORTANT
//     }
//   });
// });
// console.log("matchedItems========>",matchedItems);

//  let imirSet = new Set();
// let heatSet = new Set();

// matchedItems.forEach((item) => {
//   (item?.imir_no || []).forEach((imir) => imirSet.add(imir));
//   (item?.heat_no || []).forEach((heat) => heatSet.add(heat));
// });

//   return {
//     imirList: Array.from(imirSet),
//     heatList: Array.from(heatSet),
//   };
// };
const imirHeatCache = useMemo(() => {
  const cache = {};

  issuedData?.forEach((mainItem) => {
    mainItem?.items?.forEach((subItem) => {
      const drawingId =
        typeof subItem?.drawing_id === "object"
          ? subItem?.drawing_id?._id
          : subItem?.drawing_id;

      const materialId =
        typeof subItem?.material_item_id === "object"
          ? subItem?.material_item_id?._id
          : subItem?.material_item_id;

      const key = `${drawingId}_${materialId}`;

      if (!cache[key]) {
        cache[key] = {
          imirSet: new Set(),
          heatSet: new Set(),
        };
      }

      (subItem?.imir_no || []).forEach((imir) =>
        cache[key].imirSet.add(imir)
      );

      (subItem?.heat_no || []).forEach((heat) =>
        cache[key].heatSet.add(heat)
      );
    });
  });

  return cache;
}, [issuedData]);
const getImirHeatOptions = (drawingId, materialItemId) => {
  const key = `${drawingId}_${materialItemId}`;

  const data = imirHeatCache[key];

  if (!data) {
    return {
      imirList: [],
      heatList: [],
    };
  }

  return {
    imirList: Array.from(data.imirSet),
    heatList: Array.from(data.heatSet),
  };
};
console.log("getImirHeatOptions========>",getImirHeatOptions);
    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "Fit-Up Clearance List", link: "/piping/user/fitup-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Fit-Up Clearance Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Fitup Offer List <span className="login-danger">*</span></label>
                                                    <input value={data?.report_no} className='form-control' readOnly />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card card-table show-entire">
                                <div className="card-body">

                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Fitup Clearance List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    setCurrentPage(1);
                                                                }} />
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                {/* <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} /> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive mt-2">
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Line No. / Drawing No.</th>
                                                    <th>Rev No.</th>
                                                    <th>Piping Material Specification</th>
                                                    <th>Spool No.</th>
                                                    <th>Sheet No.</th>
                                                    <th>Joint No.</th>
                                                    <th>Item 1</th>
                                                    <th>IMIR NO. 1</th>
                                                    <th>Heat No. 1</th>
                                                    <th>Item 2</th>
                                                    <th>IMIR NO. 2</th>
                                                    <th>Heat No. 2</th>
                                                    <th>Size </th>
                                                    <th>Thickness </th>
                                                   
                                                    <th>Joint Type</th>
                                                    <th>WPS No.</th>
                                                    <th>Root Dpt required?</th>
                                                    <th>Acc/Rej</th>
                                                    <th>Remarks</th>
                                                    {/* <th>Status</th> */}
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
   {commentsData?.map((elem, i) => {
    console.log("elem FULL=====>", elem);
const materialItem1 =
  elem?.joint_wise_data?.[0]?.material_items?.material_item_details?.[0]?._id;

const materialItem2 =
  elem?.joint_wise_data?.[0]?.material_items?.material_item_details?.[1]?._id;

const { imirList: imirList1, heatList: heatList1 } = getImirHeatOptions(
  elem?.drawing_id?._id,
  materialItem1
);

const { imirList: imirList2, heatList: heatList2 } = getImirHeatOptions(
  elem?.drawing_id?._id,
  materialItem2
);

  return (
    <tr
      key={i}
      style={{ cursor: "pointer" }}
    onClick={() => {
    if (editRowIndex !== elem.originalIndex) {
        handleEditClick(elem.originalIndex, elem);
    }
}}
    >
                                                        <td>{(currentPage - 1) * limit + i + 1}</td>
                                                       <td>{elem?.drawing_id?.drawing_no}</td>
  <td>{elem?.drawing_id?.rev}</td>
  {/* <td>{elem?.drawing_id?.sheet_no}</td> */}
<td>{elem?.drawing_id?.material_specification?.name}</td>
<td>
  {elem?.joint_wise_data?.[0]?.spool_no_id?.spool_no || "-"}
</td>
{/* Sheet No */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.sheet_no || "-"}
</td>
{/* Joint No */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.joint_no || "-"}
</td>

{/* Item 1 */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.material_item_details?.[0]?.item?.item_name || "-"}
</td>

{/* IMIR 1 */}
{/* <td>{elem?.imir_no_1 || "-"}</td> */}

{/* Heat 1 */}
{/* <td>{elem?.heat_no_1 || "-"}</td> */}

{/* IMIR 1 */}
<td>
{editRowIndex === elem.originalIndex ? (
  <select
    className="form-control"
    name="imir_no_1"
    value={editFormData.imir_no_1}
    onChange={handleEditFormChange}
  >
    <option value="">Select IMIR</option>
    {imirList1.map((imir, idx) => (
      <option key={idx} value={imir}>{imir}</option>
    ))}
  </select>
) : (
  elem?.imir_no_1 || "-"
)}
</td>

{/* Heat 1 */}
<td>
{editRowIndex === elem.originalIndex ? (
  <select
    className="form-control"
    name="heat_no_1"
    value={editFormData.heat_no_1}
    onChange={handleEditFormChange}
  >
    <option value="">Select Heat</option>
    {heatList1.map((heat, idx) => (
      <option key={idx} value={heat}>{heat}</option>
    ))}
  </select>
) : (
  elem?.heat_no_1 || "-"
)}
</td>


{/* Item 2 */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.material_item_details?.[1]?.item?.item_name || "-"}
</td>

{/* IMIR 2 */}
{/* <td>{elem?.imir_no_2 || "-"}</td> */}

{/* Heat 2 */}
{/* <td>{elem?.heat_no_2 || "-"}</td> */}

{/* IMIR 2 */}
<td>
{editRowIndex === elem.originalIndex ? (
  <select
    className="form-control"
    name="imir_no_2"
    value={editFormData.imir_no_2}
    onChange={handleEditFormChange}
  >
    <option value="">Select IMIR</option>
    {imirList2.map((imir, idx) => (
      <option key={idx} value={imir}>{imir}</option>
    ))}
  </select>
) : (
  elem?.imir_no_2 || "-"
)}
</td>

{/* Heat 2 */}
<td>
{editRowIndex === elem.originalIndex ? (
  <select
    className="form-control"
    name="heat_no_2"
    value={editFormData.heat_no_2}
    onChange={handleEditFormChange}
  >
    <option value="">Select Heat</option>
    {heatList2.map((heat, idx) => (
      <option key={idx} value={heat}>{heat}</option>
    ))}
  </select>
) : (
  elem?.heat_no_2 || "-"
)}
</td>

{/* Size */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.selected_size?.name || "-"}
</td>

{/* Thickness */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.selected_thickness?.name || "-"}
</td>

{/* Joint Type */}
<td>
  {elem?.joint_wise_data?.[0]?.material_items?.joint_type?.name || "-"}
</td>
                                             
                                                        {editRowIndex === elem.originalIndex ? (
                                                            <>
                                                                <td>
                                                                    <select className='form-control form-select table-select'
                                                                        value={editFormData.wps_no} name='wps_no'
                                                                        onChange={handleEditFormChange}>
                                                                        <option value="">WPS No.</option>
                                                                        {/* {wpsData?.filter((wps) => {
                                                                            const elemJointIds = elem.joint_type?.map((e) => e._id) || [];
                                                                            const wpsJointIds = wps.jointType?.map((joint) => joint.jointId?._id) || [];
                                                                            return elemJointIds.every((id) => wpsJointIds.includes(id));
                                                                        }).map((e) => (
                                                                            <option key={e._id} value={e._id}>
                                                                                {e.wpsNo}
                                                                            </option>
                                                                        ))} */}
                                                                        {wpsData
  ?.filter((wps) => {
    const wpsSpecId = String(wps?.PipingMaterialSpecification?._id);
    const drawingSpecId = String(elem?.drawing_id?.material_specification?._id);
    return (
      wpsSpecId === drawingSpecId
    );
  })
  .map((e) => (
    <option key={e._id} value={e._id}>
      {e.wpsNo}
    </option>
  ))}

                                                                    </select>
                                                                </td>
                                                                      {editRowIndex === elem.originalIndex ? (
   <td>                                                            

                              <div className="form-check form-switch">
                               <input
  className="form-check-input"
  type="checkbox"
  role="switch"
 checked={rootDPTRequired[elem.originalIndex] || false}
onChange={(e) =>
  setRootDPTRequired((prev) => ({
    ...prev,
    [elem.originalIndex]: e.target.checked
  }))
}
/>
                              </div>
                         
                        </td> 
                         ) : (
                                                            <td onClick={() => handleEditClick(i, elem)}>-</td>
                                                        )}
                                                                {editRowIndex === elem.originalIndex ? (
                                                            <td className=''>
                                                                <div className='d-flex gap-2'>
                                                                    <span
                                                                        className={`present-table attent-status ${acceptRejectStatus[elem.originalIndex] === true ? 'selected' : ''}`}
                                                                        style={{ cursor: 'pointer' }}
                                                                        // onClick={() => handleAcceptRejectClick(i, true, elem?.material_item_id?.item_name?.name || "Item")}>
                                                                        onClick={(e) => {
  e.stopPropagation();
  handleAcceptRejectClick(elem.originalIndex, true, elem?.material_item_id?.item_name?.name || "Item");
}}>
                                                                        <Check />
                                                                    </span>
                                                                    <span
                                                                        className={`absent-table attent-status ${acceptRejectStatus[elem.originalIndex] === false ? 'selected' : ''}`}
                                                                        style={{ cursor: 'pointer' }}
                                                                        // onClick={() => handleAcceptRejectClick(i, false, elem?.grid_item_id?.item_name?.name || "Item")}
                                                                        onClick={(e) => {
  e.stopPropagation();
  handleAcceptRejectClick(elem.originalIndex, false, elem?.grid_item_id?.item_name?.name || "Item");
}}
                                                                    >
                                                                        <X />
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        ) : (
                                                            <td onClick={() => handleEditClick(i, elem)}>-</td>
                                                        )}
                                                                <td>
                                                                    <textarea className='form-control' onChange={handleEditFormChange} name='qc_remarks' value={editFormData?.qc_remarks} rows={1} />
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.wpsName || '-'}</td>
                                                                 <td>
  {rootDPTRequired[elem.originalIndex] === undefined ? (
    <span>-</span>
  ) : rootDPTRequired[elem.originalIndex] ? (
    <span className="custom-badge status-green">Yes</span>
  ) : (
    <span className="custom-badge status-pink">No</span>
  )}
</td>

   <td className='status-badge'>
                                                            {acceptRejectStatus[elem.originalIndex] === true ? (
                                                                <span className="custom-badge status-green">Acc</span>
                                                            ) : acceptRejectStatus[elem.originalIndex] === false ? (
                                                                <span className="custom-badge status-pink">Rej</span>
                                                            ) : (
                                                                <span className="">-</span>
                                                            )}
                                                        </td>
                                                                <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
                                                            </>
                                                        )}

                                                     
                                                        {editRowIndex === elem.originalIndex ? (
                                                            <td>
                                                                <button type="button" className='btn btn-success p-1 mx-1'  onClick={(e) => {
    e.stopPropagation();
    handleSaveClick();
  }}><Save /></button>
                                                                <button type="button" className='btn btn-secondary p-1 mx-1'  onClick={(e) => {
    e.stopPropagation();
    handleCancelClick();
  }}
  ><X /></button>
                                                            </td>
                                                        ) : <td>-</td>}
                                                  </tr>
  );
})}

                                                {commentsData?.length === 0 ? (
                                                    <tr>
                                                        <td colspan="999">
                                                            <div className="no-table-data">
                                                                No Data Found!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <SubmitButton disable={disable} handleSubmit={handleSubmit} selectedProcedure ={selectedProcedure}
                        link={'/piping/user/fitup-clearance-management'} buttonName={'Generate Fitup Acceptance'} /> */}

<SubmitButton
  disable={disable}
  handleSubmit={handleSubmit}
//   procedure={selectedProcedure}  // rename selectedProcedure to procedure
//   showWeldInspection={true}      // enable weld inspection radios
  handleStatusChange={handleStatusChange}  // pass handler for radio changes
  link={'/piping/user/fitup-clearance-management'}
  buttonName={'Generate Fitup Acceptance'}
/>

                </div>
            </div>
        </div>
    )
}

export default ManageMultiClearFitup