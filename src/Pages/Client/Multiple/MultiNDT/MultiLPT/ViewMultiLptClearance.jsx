import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';

// const ViewMultiLptClearance = () => {
//   const location = useLocation();
//   const data = location.state;

//   console.log("FETCHED",data)

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [clientDate, setClientDate] = useState('');
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [loadingPdf, setLoadingPdf] = useState(false);

//   const [randomItems, setRandomItems] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [showRandomItems, setShowRandomItems] = useState(false);
//   const [showButtons, setShowButtons] = useState(true);

//   /* ================= BUTTON VISIBILITY ================= */
//   useEffect(() => {
//     if (data?._id) {
//       const show =
//         data?.client_status === 1 && data?.status !== 1 ? false : true;
//       setShowButtons(show);
//     }
//   }, [data?._id]);

//   const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

//   /* ================= FETCH PDF ================= */
//   const fetchPdf = async () => {
//     try {
//       setLoadingPdf(true);

//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//         setPdfUrl('');
//       }
//       const testInspectNo =
//       data?.report_no || data?.test_inspect_no;

//     if (!testInspectNo) {
//       toast.error("Report number not found");
//       return;
//     }

//       const res = await axios.post(
//         `${V_URL}/party/get-lpt-clearance-report-item`,
//         {
//           LPTId : data._id,
//           test_inspect_no: testInspectNo,
//           print_date: clientDate,
//         },
//         {
//           headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
//           },
//           responseType: 'blob',
//         }
//       );

//       const file = new Blob([res.data], { type: 'application/pdf' });
//       setPdfUrl(URL.createObjectURL(file));
//     } catch {
//       toast.error('Failed to load PDF');
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   /* ================= AUTO LOAD PDF ================= */
//   useEffect(() => {
//     fetchPdf();
//     return () => {
//       if (pdfUrl) URL.revokeObjectURL(pdfUrl);
//     };
//   }, []);

//   // /* ================= RANDOM WITNESSED ITEMS ================= */
//   const prepareRandomWitnessedItems = () => {
//     const items =
//       data?.items?.map((item) => ({
//         _id: item._id,

//         drawing_no: item?.grid_item_id?.drawing_id?.drawing_no || '-',
//         rev_no: item?.grid_item_id?.drawing_id?.rev ?? '-',
//         assembly_no: item?.grid_item_id?.drawing_id?.assembly_no || '-',
//         grid_no: item?.grid_item_id?.grid_id?.grid_no || '-',
//         grid_qty: item?.grid_item_id?.grid_id?.grid_qty || 0,

//         selected: false,
//         remark: item?.remarks || '',
//       })) || [];

//     setRandomItems(items);
//     setSelectAll(false);
//     setShowRandomItems(true);
//   };


//   /* ================= ITEM SELECT ================= */
//   const handleItemChange = (index, field, value) => {
//     const updated = [...randomItems];
//     updated[index][field] = value;
//     setRandomItems(updated);

//     if (field === 'selected') {
//       setSelectAll(updated.every((i) => i.selected));
//     }
//   };

//   const handleSelectAll = (checked) => {
//     setSelectAll(checked);
//     setRandomItems(randomItems.map((i) => ({ ...i, selected: checked })));
//   };

//   /* ================= UPDATE STATUS ================= */
//   const submitLptStatus = async (statusType) => {
//     if (!clientDate) {
//       toast.error('Please select date');
//       return;
//     }

//     try {
//       const payload = {
//         inspectionId: data._id,
//         status_type: statusType,
//         client_date: clientDate,
//         client_user: localStorage.getItem('PARTY_ID'),
//       };

//       if (statusType === 'RANDOM WITNESSED') {
//         if (randomItems.length === 0) {
//           prepareRandomWitnessedItems();
//           toast.error('Please select items');
//           return;
//         }

//         payload.items = randomItems.map((i) => ({
//           _id: i._id,
//           selected: i.selected === true,
//           remark: i.remark,
//         }));
//       }

//       const res = await axios.post(
//         `${V_URL}/party/lpt-clearance-report-review-update`,
//         payload,
//         {
//           headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success('LPT Clearance Report updated successfully');
//         setShowRandomItems(false);
//         fetchPdf();
//       } else {
//         toast.error(res.data.message || 'Update failed');
//       }
//     } catch {
//       toast.error('Something went wrong');
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />

//       <div className="page-wrapper">
//         <div className="content">

//           {/* ===== Breadcrumb ===== */}
//           <div className="page-header">
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/party/project-store/dashboard">Dashboard</Link>
//               </li>
//               <li className="breadcrumb-item active">
//                 View LPT Clearance Summary
//               </li>
//             </ul>
//           </div>

//           {/* ===== Details ===== */}
//           <div className="card">
//             <div className="card-body">
//               <h4 className="mb-3">LPT Clearance Details</h4>
//               <div className="row">
//                 <div className="col-md-4">
//                   <label>Report No</label>
//                   <input className="form-control" value={data?.test_inspect_no || '-'} readOnly />
//                 </div>

//                 <div className="col-md-4">
//                   <label>Prepared By</label>
//                   <input className="form-control" value={data?.qc_name?.name || '-'} readOnly />
//                 </div>

//                 <div className="col-md-4">
//                   <label>Created Date</label>
//                   <input
//                     className="form-control"
//                     value={moment(data?.createdAt).format('YYYY-MM-DD')}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ===== Client Review ===== */}
//           <div className="card mt-3">
//             <div className="card-body">
//               <h4 className="mb-3">Client Review</h4>

//               {showButtons && (
//                 <>
//                   <div className="col-md-4 mb-3">
//                     <label>
//                       Date <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       value={clientDate}
//                       onChange={(e) => setClientDate(e.target.value)}
//                     />
//                   </div>

//                   <div className="mt-3">
//                     <button
//                       className="btn btn-primary me-2"
//                       onClick={() => submitLptStatus('REVIEWED')}
//                     >
//                       REVIEWED
//                     </button>

//                     <button
//                       className="btn btn-warning me-2"
//                       onClick={() => submitLptStatus('WITNESSED')}
//                     >
//                       WITNESSED
//                     </button>

//                     <button
//                       className="btn btn-success"
//                       onClick={prepareRandomWitnessedItems}
//                     >
//                       RANDOM WITNESSED
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* ===== PDF ===== */}
//               {loadingPdf && (
//                 <div className="mt-4 alert alert-info">Loading PDF...</div>
//               )}

//               {pdfUrl && (
//                 <div className="mt-4">
//                   <iframe
//                     src={pdfUrl}
//                     title="LPT Clearance PDF"
//                     width="100%"
//                     height="700px"
//                     style={{ border: '1px solid #ccc' }}
//                   />
//                 </div>
//               )}

//               {/* ===== RANDOM WITNESSED TABLE ===== */}
//               {showRandomItems && randomItems.length > 0 && (
//                 <div className="mt-3">
//                   <div style={{ overflowX: 'auto' }}>
//                     <table className="table table-bordered">
//                       <thead>
//                         <tr>
//                           <th>
//                             <input
//                               type="checkbox"
//                               checked={selectAll}
//                               onChange={(e) =>
//                                 handleSelectAll(e.target.checked)
//                               }
//                             />
//                           </th>
//                           <th>#</th>
//                           <th>Drawing</th>
//                           <th>Rev</th>
//                           <th>Assembly No</th>
//                           <th>Grid No</th>
//                           <th>Grid Qty</th>
//                           <th>Remark</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {randomItems.map((item, i) => (
//                           <tr key={item._id}>
//                             <td>
//                               <input
//                                 type="checkbox"
//                                 checked={item.selected}
//                                 onChange={(e) =>
//                                   handleItemChange(i, 'selected', e.target.checked)
//                                 }
//                               />
//                             </td>
//                             <td>{i + 1}</td>
//                             <td>{item.drawing_no}</td>
//                             <td>{item.rev_no}</td>
//                             <td>{item.assembly_no}</td>
//                             <td>{item.grid_no}</td>
//                             <td>{item.grid_qty}</td>
//                             <td>
//                               <input
//                                 className="form-control"
//                                 value={item.remark}
//                                 onChange={(e) =>
//                                   handleItemChange(i, 'remark', e.target.value)
//                                 }
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <button
//                     className="btn btn-success mt-2"
//                     onClick={() => submitLptStatus('RANDOM WITNESSED')}
//                   >
//                     Submit Random Witnessed
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default ViewMultiLptClearance;

const ViewMultiLptClearance = () => {
  const location = useLocation();
  const data = location.state; // ✅ MAIN SOURCE OF TRUTH

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  /* ================= BUTTON VISIBILITY ================= */
  useEffect(() => {
    if (data?._id) {
      const show =
        data?.client_status === 1 && data?.status !== 1 ? false : true;
      setShowButtons(show);
    }
  }, [data]);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setLoadingPdf(true);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }

      const inspectNo = data?.report_no || data?.test_inspect_no;
      if (!inspectNo) {
        toast.error("Report number not found");
        return;
      }

      const res = await axios.post(
        `${V_URL}/party/get-lpt-clearance-report-item`,
        {
          LPTId: data._id,
          test_inspect_no: inspectNo,
          print_date: clientDate,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          },
          responseType: "blob",
        }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(file));
    } catch {
      toast.error("Failed to load PDF");
    } finally {
      setLoadingPdf(false);
    }
  };

  useEffect(() => {
    fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line
  }, []);

  /* ================= RANDOM WITNESSED ITEMS ================= */
  const prepareRandomWitnessedItems = () => {
    if (!Array.isArray(data?.items) || data.items.length === 0) {
      toast.error("No items found in inspection");
      return;
    }

    const items = data.items.map((item) => ({
      _id: item._id,

      // ✅ MATCHES PDF
      drawing_no: item.assembly_no|| "-",
      sheet_no: item?.drawing_id?.sheet_no || "-",
      assembly_no: item?.drawing_id?.assembly_no || "-",

      grid_no: item?.grid_item_id?.grid_no || "-",
      grid_qty: item?.offer_used_grid_qty || 0,

      selected: false,
      remark: item?.remarks || "",
    }));

    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };

  /* ================= ITEM SELECT ================= */
  const handleItemChange = (index, field, value) => {
    const updated = [...randomItems];
    updated[index][field] = value;
    setRandomItems(updated);

    if (field === "selected") {
      setSelectAll(updated.every((i) => i.selected));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setRandomItems(randomItems.map((i) => ({ ...i, selected: checked })));
  };

  /* ================= UPDATE STATUS ================= */
  const submitLptStatus = async (statusType) => {
    if (!clientDate) {
      toast.error("Please select date");
      return;
    }

    try {
      const payload = {
        LPTId: data._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem("PARTY_ID"),
      };

      if (statusType === "RANDOM WITNESSED") {
        payload.items = randomItems.map((i) => ({
          _id: i._id,
          selected: i.selected === true,
          remark: i.remark,
        }));
      }

      const res = await axios.post(
        `${V_URL}/party/lpt-clearance-report-review-update`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          },
        }
      );

      if (res.data.success) {
        toast.success("LPT Clearance updated successfully");
        setShowRandomItems(false);
        fetchPdf();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                View LPT Clearance Summary
              </li>
            </ul>
          </div>

          {/* DETAILS */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">LPT Clearance Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input
                    className="form-control"
                    value={data?.test_inspect_no || "-"}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Prepared By</label>
                  <input
                    className="form-control"
                    value={data?.qc_name?.name || "-"}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Created Date</label>
                  <input
                    className="form-control"
                    value={moment(data?.createdAt).format("YYYY-MM-DD")}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CLIENT REVIEW */}
          <div className="card mt-3">
            <div className="card-body">
              <h4 className="mb-3">Client Review</h4>

              {showButtons && (
                <>
                  <div className="col-md-4 mb-3">
                    <label>Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={clientDate}
                      onChange={(e) => setClientDate(e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => submitLptStatus("REVIEWED")}
                    >
                      REVIEWED
                    </button>

                    <button
                      className="btn btn-warning me-2"
                      onClick={() => submitLptStatus("WITNESSED")}
                    >
                      WITNESSED
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={prepareRandomWitnessedItems}
                    >
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {loadingPdf && (
                <div className="mt-4 alert alert-info">Loading PDF...</div>
              )}

              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="LPT PDF"
                  width="100%"
                  height="700"
                  style={{ border: "1px solid #ccc", marginTop: 20 }}
                />
              )}

              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-4">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={(e) =>
                              handleSelectAll(e.target.checked)
                            }
                          />
                        </th>
                        <th>#</th>
                        <th>Drawing</th>
                        <th>Sheet</th>
                        <th>Assembly</th>
                        <th>Grid</th>
                        <th>Qty</th>
                        <th>Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {randomItems.map((item, i) => (
                        <tr key={item._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={(e) =>
                                handleItemChange(
                                  i,
                                  "selected",
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td>{i + 1}</td>
                          <td>{item.drawing_no}</td>
                          <td>{item.sheet_no}</td>
                          <td>{item.assembly_no}</td>
                          <td>{item.grid_no}</td>
                          <td>{item.grid_qty}</td>
                          <td>
                            <input
                              className="form-control"
                              value={item.remark}
                              onChange={(e) =>
                                handleItemChange(
                                  i,
                                  "remark",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    className="btn btn-success"
                    onClick={() => submitLptStatus("RANDOM WITNESSED")}
                  >
                    Submit Random Witnessed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewMultiLptClearance;


// const ViewMultiLptClearance = () => {
//   const location = useLocation();
//   const data = location.state;

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [clientDate, setClientDate] = useState("");
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [loadingPdf, setLoadingPdf] = useState(false);

//   const [randomItems, setRandomItems] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [showRandomItems, setShowRandomItems] = useState(false);
//   const [showButtons, setShowButtons] = useState(true);

//   /* ================= BUTTON VISIBILITY ================= */
//   useEffect(() => {
//     if (data?._id) {
//       const show =
//         data?.client_status === 1 && data?.status !== 1 ? false : true;
//       setShowButtons(show);
//     }
//   }, [data?._id]);

//   const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

//   /* ================= FETCH PDF ================= */
//   const fetchPdf = async () => {
//     try {
//       setLoadingPdf(true);

//       if (pdfUrl) {
//         URL.revokeObjectURL(pdfUrl);
//         setPdfUrl("");
//       }

//       const testInspectNo = data?.test_inspect_no;
//       if (!testInspectNo) {
//         toast.error("Report number not found");
//         return;
//       }

//       const res = await axios.post(
//         `${V_URL}/party/get-lpt-clearance-report-item`,
//         {
//           LPTId: data._id,
//           test_inspect_no: testInspectNo,
//           print_date: clientDate,
//         },
//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
//           },
//           responseType: "blob",
//         }
//       );

//       const file = new Blob([res.data], { type: "application/pdf" });
//       setPdfUrl(URL.createObjectURL(file));
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load PDF");
//     } finally {
//       setLoadingPdf(false);
//     }
//   };

//   useEffect(() => {
//     fetchPdf();
//     return () => {
//       if (pdfUrl) URL.revokeObjectURL(pdfUrl);
//     };
//   }, []);

//   /* ================= RANDOM WITNESSED ITEMS ================= */
//   const prepareRandomWitnessedItems = () => {
//     const items =
//       data?.items?.map((item) => ({
//         _id: item._id,
//         drawing_no: item?.grid_item_id?.drawing_id?.drawing_no || "-",
//         rev_no: item?.grid_item_id?.drawing_id?.rev ?? "-",
//         assembly_no: item?.grid_item_id?.drawing_id?.assembly_no || "-",
//         grid_no: item?.grid_item_id?.grid_id?.grid_no || "-",
//         grid_qty: item?.grid_item_id?.grid_id?.grid_qty || 0,
//         selected: false,
//         remark: item?.remarks || "",
//       })) || [];

//     setRandomItems(items);
//     setSelectAll(false);
//     setShowRandomItems(true);
//   };

//   /* ================= ITEM SELECT ================= */
//   const handleItemChange = (index, field, value) => {
//     const updated = [...randomItems];
//     updated[index][field] = value;
//     setRandomItems(updated);

//     if (field === "selected") {
//       setSelectAll(updated.every((i) => i.selected));
//     }
//   };

//   const handleSelectAll = (checked) => {
//     setSelectAll(checked);
//     setRandomItems(randomItems.map((i) => ({ ...i, selected: checked })));
//   };

//   /* ================= UPDATE STATUS ================= */
//   const submitLptStatus = async (statusType) => {
//     if (!clientDate) {
//       toast.error("Please select date");
//       return;
//     }

//     try {
//       const payload = {
//         LPTId: data._id,
//         status_type: statusType,
//         client_date: clientDate,
//         client_user: localStorage.getItem("PARTY_ID"),
//       };

//       if (statusType === "RANDOM WITNESSED") {
//         if (randomItems.length === 0) {
//           prepareRandomWitnessedItems();
//           toast.error("Please select items");
//           return;
//         }

//         payload.items = randomItems.map((i) => ({
//           _id: i._id,
//           selected: i.selected === true,
//           remark: i.remark,
//         }));
//       }

//       const res = await axios.post(
//         `${V_URL}/party/lpt-clearance-report-review-update`,
//         payload,
//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success("LPT Clearance Report updated successfully");
//         setShowRandomItems(false);
//         fetchPdf();
//       } else {
//         toast.error(res.data.message || "Update failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Something went wrong");
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />

//       <div className="page-wrapper">
//         <div className="content">

//           <div className="page-header">
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/party/project-store/dashboard">Dashboard</Link>
//               </li>
//               <li className="breadcrumb-item active">
//                 View LPT Clearance Summary
//               </li>
//             </ul>
//           </div>

//           <div className="card">
//             <div className="card-body">
//               <h4 className="mb-3">LPT Clearance Details</h4>
//               <div className="row">
//                 <div className="col-md-4">
//                   <label>Report No</label>
//                   <input
//                     className="form-control"
//                     value={data?.test_inspect_no || "-"}
//                     readOnly
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <label>Prepared By</label>
//                   <input
//                     className="form-control"
//                     value={data?.qc_name?.name || "-"}
//                     readOnly
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <label>Created Date</label>
//                   <input
//                     className="form-control"
//                     value={moment(data?.createdAt).format("YYYY-MM-DD")}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="card mt-3">
//             <div className="card-body">
//               <h4 className="mb-3">Client Review</h4>

//               {showButtons && (
//                 <>
//                   <div className="col-md-4 mb-3">
//                     <label>
//                       Date <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       value={clientDate}
//                       onChange={(e) => setClientDate(e.target.value)}
//                     />
//                   </div>

//                   <div className="mt-3">
//                     <button
//                       className="btn btn-primary me-2"
//                       onClick={() => submitLptStatus("REVIEWED")}
//                     >
//                       REVIEWED
//                     </button>

//                     <button
//                       className="btn btn-warning me-2"
//                       onClick={() => submitLptStatus("WITNESSED")}
//                     >
//                       WITNESSED
//                     </button>

//                     <button
//                       className="btn btn-success"
//                       onClick={prepareRandomWitnessedItems}
//                     >
//                       RANDOM WITNESSED
//                     </button>
//                   </div>
//                 </>
//               )}

//               {loadingPdf && (
//                 <div className="mt-4 alert alert-info">Loading PDF...</div>
//               )}

//               {pdfUrl && (
//                 <div className="mt-4">
//                   <iframe
//                     src={pdfUrl}
//                     title="LPT Clearance PDF"
//                     width="100%"
//                     height="700px"
//                     style={{ border: "1px solid #ccc" }}
//                   />
//                 </div>
//               )}

//               {showRandomItems && randomItems.length > 0 && (
//                 <div className="mt-3">
//                   <div style={{ overflowX: "auto" }}>
//                     <table className="table table-bordered">
//                       <thead>
//                         <tr>
//                           <th>
//                             <input
//                               type="checkbox"
//                               checked={selectAll}
//                               onChange={(e) =>
//                                 handleSelectAll(e.target.checked)
//                               }
//                             />
//                           </th>
//                           <th>#</th>
//                           <th>Drawing</th>
//                           <th>Rev</th>
//                           <th>Assembly No</th>
//                           <th>Grid No</th>
//                           <th>Grid Qty</th>
//                           <th>Remark</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {randomItems.map((item, i) => (
//                           <tr key={item._id}>
//                             <td>
//                               <input
//                                 type="checkbox"
//                                 checked={item.selected}
//                                 onChange={(e) =>
//                                   handleItemChange(i, "selected", e.target.checked)
//                                 }
//                               />
//                             </td>
//                             <td>{i + 1}</td>
//                             <td>{item.drawing_no}</td>
//                             <td>{item.rev_no}</td>
//                             <td>{item.assembly_no}</td>
//                             <td>{item.grid_no}</td>
//                             <td>{item.grid_qty}</td>
//                             <td>
//                               <input
//                                 className="form-control"
//                                 value={item.remark}
//                                 onChange={(e) =>
//                                   handleItemChange(i, "remark", e.target.value)
//                                 }
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <button
//                     className="btn btn-success mt-2"
//                     onClick={() => submitLptStatus("RANDOM WITNESSED")}
//                   >
//                     Submit Random Witnessed
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default ViewMultiLptClearance;