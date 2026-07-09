import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';

// const ViewMultiUtClearance = () => {
//   const location = useLocation();
//   const data = location.state;

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

//       const res = await axios.post(
//         `${V_URL}/party/get-multi-ut-clearance-item`,
//         {
//           test_inspect_no: data?.test_inspect_no,
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
//       toast.error('Failed to load UT Clearance PDF');
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

//   /* ================= RANDOM WITNESSED ITEMS ================= */
//   const prepareRandomWitnessedItems = () => {
//     const items =
//       data?.items?.map((item) => ({
//         _id: item._id,
//         drawing_no: item.drawing_id?.[0]?.drawing_no || '-',
//         sheet_no: item.drawing_id?.[0]?.sheet_no || '-',
//         assembly_no: item.drawing_id?.[0]?.assembly_no || '-',
//         grid_no: item.grid_item_id || '-',
//         qty: item.offer_used_grid_qty || 0,
//         selected: false,
//         remark: item.qc_remarks || '',
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
//   const submitUTStatus = async (statusType) => {
//     if (!clientDate) {
//       toast.error('Please select date');
//       return;
//     }

//     try {
//       const payload = {
//         report_id: data?._id,
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
//         `${V_URL}/party/ut-clearance-report-review-update`,
//         payload,
//         {
//           headers: {
//             Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success('UT Clearance updated successfully');
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
//                 View UT Clearance Summary
//               </li>
//             </ul>
//           </div>

//           {/* ===== Details ===== */}
//           <div className="card">
//             <div className="card-body">
//               <h4 className="mb-3">UT Clearance Details</h4>
//               <div className="row">
//                 <div className="col-md-4">
//                   <label>Report No</label>
//                   <input
//                     className="form-control"
//                     value={data?.test_inspect_no || '-'}
//                     readOnly
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <label>Prepared By</label>
//                   <input
//                     className="form-control"
//                     value={data?.qcDetails?.user_name || '-'}
//                     readOnly
//                   />
//                 </div>

//                 <div className="col-md-4">
//                   <label>Test Date</label>
//                   <input
//                     className="form-control"
//                     value={moment(data?.test_date).format('YYYY-MM-DD')}
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
//                       onClick={() => submitUTStatus('REVIEWED')}
//                     >
//                       REVIEWED
//                     </button>

//                     <button
//                       className="btn btn-warning me-2"
//                       onClick={() => submitUTStatus('WITNESSED')}
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
//                 <div className="mt-4 alert alert-info">
//                   Loading PDF...
//                 </div>
//               )}

//               {pdfUrl && (
//                 <div className="mt-4">
//                   <iframe
//                     src={pdfUrl}
//                     title="UT Clearance PDF"
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
//                           <th>Sheet</th>
//                           <th>Assembly</th>
//                           <th>Grid</th>
//                           <th>Qty</th>
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
//                                   handleItemChange(
//                                     i,
//                                     'selected',
//                                     e.target.checked
//                                   )
//                                 }
//                               />
//                             </td>
//                             <td>{i + 1}</td>
//                             <td>{item.drawing_no}</td>
//                             <td>{item.sheet_no}</td>
//                             <td>{item.assembly_no}</td>
//                             <td>{item.grid_no}</td>
//                             <td>{item.qty}</td>
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
//                     onClick={() => submitUTStatus('RANDOM WITNESSED')}
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

// export default ViewMultiUtClearance;

const ViewMultiUtClearance = () => {
  const location = useLocation();
  const data = location.state;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (data?._id) {
      setShowButtons(!(data?.client_status === 1 && data?.status !== 1));
    }
  }, [data?._id]);

  const fetchPdf = async () => {
    if (!data?.test_inspect_no) return;

    setLoadingPdf(true);
    try {
      const res = await axios.post(
        `${V_URL}/party/get-multi-ut-clearance-item`,
        { test_inspect_no: data?.test_inspect_no, print_date: clientDate || null },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN") },
          responseType: "blob",
        }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      setPdfUrl(fileURL);
    } catch (err) {
      console.error("UT PDF fetch error:", err);
      toast.error("Failed to load UT Clearance PDF");
    } finally {
      setLoadingPdf(false);
    }
  };

  useEffect(() => {
    fetchPdf();
  }, []);

  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => {
        const drawingObj = Array.isArray(item.drawing_id) ? item.drawing_id[0] : item.drawing_id || {};
        const gridObj = item.grid_item_id || {};

        return {
          _id: item._id,
          drawing_no: item?.grid_item_id?.drawing_id?.drawing_no || "-",
          rev_no: item?.grid_item_id?.drawing_id?.rev ?? '-',
          assembly_no: item?.grid_item_id?.drawing_id?.assembly_no|| "-",
          grid_no: gridObj?.grid_id?.grid_no || "-", // flattened
          qty: item?.grid_item_id?.grid_id?.grid_qty  || 0,
          selected: false,
          remark: item.qc_remarks || "",
        };
      }) || [];

    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };

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

  const submitUTStatus = async (statusType) => {
    if (!clientDate) {
      toast.error("Please select date");
      return;
    }

    const payload = {
      UTId: data?._id,
      status_type: statusType,
      client_date: clientDate,
      client_user: localStorage.getItem("PARTY_ID"),
    };

    if (statusType === "RANDOM WITNESSED") {
      if (!randomItems.length) {
        prepareRandomWitnessedItems();
        toast.error("Please select items");
        return;
      }

      payload.items = randomItems.map((i) => ({
        _id: i._id,
        selected: i.selected === true,
        remark: i.remark,
      }));
    }

    try {
      const res = await axios.post(
        `${V_URL}/party/ut-clearance-report-review-update`,
        payload,
        { headers: { Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN") } }
      );

      if (res.data.success) {
        toast.success("UT Clearance updated successfully");
        setShowRandomItems(false);
        fetchPdf();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">View UT Clearance</li>
            </ul>
          </div>

          {/* Report Details */}
          <div className="card">
            <div className="card-body">
              <h4>UT Clearance Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input className="form-control" value={data?.test_inspect_no || "-"} readOnly />
                </div>
                <div className="col-md-4">
                  <label>Prepared By</label>
                  <input className="form-control" value={data?.qc_name?.name || "-"} readOnly />
                </div>
                <div className="col-md-4">
                  <label>Test Date</label>
                  <input className="form-control" value={moment(data?.test_date).format("YYYY-MM-DD")} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* Client Review */}
          <div className="card mt-3">
            <div className="card-body">
              <h4>Client Review</h4>

              {showButtons && (
                <div className="mb-3">
                  <div className="col-md-4 mb-3">
                    <label>Date <span className="text-danger">*</span></label>
                    <input type="date" className="form-control" value={clientDate} onChange={e => setClientDate(e.target.value)} />
                  </div>

                  <div className="mt-2">
                    <button className="btn btn-primary me-2" onClick={() => submitUTStatus("REVIEWED")}>REVIEWED</button>
                    <button className="btn btn-warning me-2" onClick={() => submitUTStatus("WITNESSED")}>WITNESSED</button>
                    <button className="btn btn-success" onClick={prepareRandomWitnessedItems}>RANDOM WITNESSED</button>
                  </div>
                </div>
              )}

              {/* PDF */}
              {loadingPdf && <div className="alert alert-info mt-3">Loading PDF...</div>}
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="UT Clearance PDF"
                  width="100%"
                  height="700px"
                  style={{ border: "1px solid #ccc", marginTop: "15px" }}
                />
              )}

              {/* Random Witnessed Table */}
              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-3">
                  <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th><input type="checkbox" checked={selectAll} onChange={e => handleSelectAll(e.target.checked)} /></th>
                          <th>#</th>
                          <th>Drawing</th>
                          <th>Rev no</th>
                          <th>Assembly</th>
                          <th>Grid</th>
                          <th>Qty</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {randomItems.map((item, i) => (
                          <tr key={item._id}>
                            <td><input type="checkbox" checked={item.selected} onChange={e => handleItemChange(i, "selected", e.target.checked)} /></td>
                            <td>{i + 1}</td>
                            <td>{item.drawing_no}</td>
                            <td>{item.rev_no}</td>
                            <td>{item.assembly_no}</td>
                            <td>{item.grid_no}</td>
                            <td>{item.qty}</td>
                            <td><input className="form-control" value={item.remark} onChange={e => handleItemChange(i, "remark", e.target.value)} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button className="btn btn-success mt-2" onClick={() => submitUTStatus("RANDOM WITNESSED")}>
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

export default ViewMultiUtClearance;


// const ViewMultiUtClearance = () => {
//   const location = useLocation();
//   const data = location.state;

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [clientDate, setClientDate] = useState('');
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [loadingPdf, setLoadingPdf] = useState(false);

//   const [randomItems, setRandomItems] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [showRandomItems, setShowRandomItems] = useState(false);
//   const [showButtons, setShowButtons] = useState(true);

//   // Toggle sidebar
//   const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

//   // Set button visibility
//   useEffect(() => {
//     if (data?._id) {
//       setShowButtons(!(data?.client_status === 1 && data?.status !== 1));
//     }
//   }, [data?._id]);

//   // Fetch PDF from backend
//   // const fetchPdf = async () => {
//   //   if (!data?.test_inspect_no) return;

//   //   setLoadingPdf(true);
//   //   try {
//   //     const res = await axios.post(
//   //       `${V_URL}/party/get-multi-ut-clearance-item`,
//   //       { test_inspect_no: data?.test_inspect_no, print_date: clientDate },
//   //       { headers: { Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN') } }
//   //     );

//   //     if (res.data.success && res.data.data?.file) {
//   //       setPdfUrl(res.data.data.file);
//   //     } else {
//   //       toast.error(res.data.message || 'Failed to load UT Clearance PDF');
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error('Failed to load UT Clearance PDF');
//   //   } finally {
//   //     setLoadingPdf(false);
//   //   }
//   // };

//   const fetchPdf = async () => {
//   if (!data?.test_inspect_no) return;

//   setLoadingPdf(true);
//   try {
//     const res = await axios.post(
//       `${V_URL}/party/get-multi-ut-clearance-item`,
//       { 
//         test_inspect_no: data?.test_inspect_no, 
//         print_date: clientDate || null // optional fallback
//       },
//       {
//         headers: { Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN') },
//         responseType: 'blob', // 🔑 important for PDF
//       }
//     );

//     // Create a blob URL for iframe
//     const file = new Blob([res.data], { type: 'application/pdf' });
//     const fileURL = URL.createObjectURL(file);
//     setPdfUrl(fileURL);

//   } catch (err) {
//     console.error("UT PDF fetch error:", err);
//     toast.error('Failed to load UT Clearance PDF');
//   } finally {
//     setLoadingPdf(false);
//   }
// };

//   // Auto-load PDF
//   useEffect(() => {
//     fetchPdf();
//   }, []);

//   // Prepare Random Witnessed items
//   // const prepareRandomWitnessedItems = () => {
//   //   const items =
//   //     data?.items?.map((item) => ({
//   //       _id: item._id,
//   //       drawing_no: item.drawing_id?.[0]?.drawing_no || '-',
//   //       sheet_no: item.drawing_id?.[0]?.sheet_no || '-',
//   //       assembly_no: item.drawing_id?.[0]?.assembly_no || '-',
//   //       grid_no: item.grid_item_id || '-',
//   //       qty: item.offer_used_grid_qty || 0,
//   //       selected: false,
//   //       remark: item.qc_remarks || '',
//   //     })) || [];

//   //   setRandomItems(items);
//   //   setSelectAll(false);
//   //   setShowRandomItems(true);
//   // };

//   const prepareRandomWitnessedItems = () => {
//   const items =
//     data?.items?.map((item) => {
//       // safely get first drawing_id object
//       const drawingObj = Array.isArray(item.drawing_id) ? item.drawing_id[0] : item.drawing_id || {};

//       return {
//         _id: item._id,
//         drawing_no: drawingObj?.drawing_no || "-",
//         sheet_no: drawingObj?.sheet_no || "-",
//         assembly_no: drawingObj?.assembly_no || "-",
//         grid_no: item.grid_item_id || "-",
//         qty: item.offer_used_grid_qty || 0,
//         selected: false,
//         remark: item.qc_remarks || "",
//       };
//     }) || [];

//   setRandomItems(items);
//   setSelectAll(false);
//   setShowRandomItems(true);
// };


  
//   // Handle item selection
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

//   // Submit client review status
//   const submitUTStatus = async (statusType) => {
//     if (!clientDate) {
//       toast.error('Please select date');
//       return;
//     }

//     const payload = {
//       UTId: data?._id,
//       status_type: statusType,
//       client_date: clientDate,
//       client_user: localStorage.getItem('PARTY_ID'),
//     };

//     if (statusType === 'RANDOM WITNESSED') {
//       if (!randomItems.length) {
//         prepareRandomWitnessedItems();
//         toast.error('Please select items');
//         return;
//       }

//       payload.items = randomItems.map((i) => ({
//         _id: i._id,
//         selected: i.selected === true,
//         remark: i.remark,
//       }));
//     }

//     try {
//       const res = await axios.post(
//         `${V_URL}/party/ut-clearance-report-review-update`,
//         payload,
//         { headers: { Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN') } }
//       );

//       if (res.data.success) {
//         toast.success('UT Clearance updated successfully');
//         setShowRandomItems(false);
//         fetchPdf(); // refresh PDF
//       } else {
//         toast.error(res.data.message || 'Update failed');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong');
//     }
//   };

//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />

//       <div className="page-wrapper">
//         <div className="content">
//           {/* Breadcrumb */}
//           <div className="page-header">
//             <ul className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/party/project-store/dashboard">Dashboard</Link>
//               </li>
//               <li className="breadcrumb-item active">View UT Clearance</li>
//             </ul>
//           </div>

//           {/* Report Details */}
//           <div className="card">
//             <div className="card-body">
//               <h4>UT Clearance Details</h4>
//               <div className="row">
//                 <div className="col-md-4">
//                   <label>Report No</label>
//                   <input className="form-control" value={data?.test_inspect_no || '-'} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label>Prepared By</label>
//                   <input className="form-control" value={data?.qcDetails?.user_name || '-'} readOnly />
//                 </div>
//                 <div className="col-md-4">
//                   <label>Test Date</label>
//                   <input className="form-control" value={moment(data?.test_date).format('YYYY-MM-DD')} readOnly />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Client Review */}
//           <div className="card mt-3">
//             <div className="card-body">
//               <h4>Client Review</h4>

//               {showButtons && (
//                 <div className="mb-3">
//                   <div className="col-md-4 mb-3">
//                     <label>Date <span className="text-danger">*</span></label>
//                     <input type="date" className="form-control" value={clientDate} onChange={e => setClientDate(e.target.value)} />
//                   </div>

//                   <div className="mt-2">
//                     <button className="btn btn-primary me-2" onClick={() => submitUTStatus('REVIEWED')}>REVIEWED</button>
//                     <button className="btn btn-warning me-2" onClick={() => submitUTStatus('WITNESSED')}>WITNESSED</button>
//                     <button className="btn btn-success" onClick={prepareRandomWitnessedItems}>RANDOM WITNESSED</button>
//                   </div>
//                 </div>
//               )}

//               {/* PDF */}
//               {loadingPdf && <div className="alert alert-info mt-3">Loading PDF...</div>}
//               {pdfUrl && (
//                 <iframe
//                   src={pdfUrl}
//                   title="UT Clearance PDF"
//                   width="100%"
//                   height="700px"
//                   style={{ border: '1px solid #ccc', marginTop: '15px' }}
//                 />
//               )}

//               {/* Random Witnessed Table */}
//               {showRandomItems && randomItems.length > 0 && (
//                 <div className="mt-3">
//                   <div style={{ overflowX: 'auto' }}>
//                     <table className="table table-bordered">
//                       <thead>
//                         <tr>
//                           <th><input type="checkbox" checked={selectAll} onChange={e => handleSelectAll(e.target.checked)} /></th>
//                           <th>#</th>
//                           <th>Drawing</th>
//                           <th>Sheet</th>
//                           <th>Assembly</th>
//                           <th>Grid</th>
//                           <th>Qty</th>
//                           <th>Remark</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {randomItems.map((item, i) => (
//                           <tr key={item._id}>
//                             <td><input type="checkbox" checked={item.selected} onChange={e => handleItemChange(i, 'selected', e.target.checked)} /></td>
//                             <td>{i + 1}</td>
//                             <td>{item.drawing_no}</td>
//                             <td>{item.sheet_no}</td>
//                             <td>{item.assembly_no}</td>
//                             <td>{item.grid_no}</td>
//                             <td>{item.qty}</td>
//                             <td><input className="form-control" value={item.remark} onChange={e => handleItemChange(i, 'remark', e.target.value)} /></td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <button className="btn btn-success mt-2" onClick={() => submitUTStatus('RANDOM WITNESSED')}>
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

// export default ViewMultiUtClearance;