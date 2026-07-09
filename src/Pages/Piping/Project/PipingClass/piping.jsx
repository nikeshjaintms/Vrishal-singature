// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { Modal } from 'react-bootstrap';
// import { Pencil, Trash2 } from 'lucide-react';
// import Swal from 'sweetalert2';
// import Header from '../../Include/Header';
// import Sidebar from '../../Include/Sidebar';
// import Footer from '../../Include/Footer';
// import { V_URL } from '../../../../BaseUrl';
// import { getUserPipingClassById } from '../../../../Store/Piping/PipingClass/PipingClassMaster'

// const ManagePipingClass = () => {
//   const location = useLocation();

//   const [disable, setDisable] = useState(false);
//   const [disable2, setDisable2] = useState(false);
//   const [request, setRequest] = useState({ PipingClass: '' });
//   const [items, setItems] = useState([]);
//   const [finalId, setFinalId] = useState('');
//   const [show, setShow] = useState(false);
//   const [editId, setEditId] = useState('');
//   const [itemVal, setItemVal] = useState({ service: '', PipingMaterialSpecification: '' });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const data = location.state;
//   const currentId = finalId || data?._id;

//   // ---------------- INIT ----------------
//   useEffect(() => {
//     if (data) {
//       setRequest({ PipingClass: data.PipingClass });
//       setItems(data.Items || []);
//     }
//   }, [data]);

//   const handleChange = (e) => setRequest({ ...request, [e.target.name]: e.target.value });
//   const handleChange2 = (e) => setItemVal({ ...itemVal, [e.target.name]: e.target.value });

//   const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
//   const handleShow = () => {
//     if (!currentId) return toast.error('Save Piping Class first!');
//     setShow(true);
//   };
//   const handleClose = () => {
//     setShow(false);
//     setItemVal({ service: '', PipingMaterialSpecification: '' });
//     setEditId('');
//   };

//   // ---------------- CREATE / UPDATE PIPING CLASS ----------------
//   const handleSubmit = async () => {
//     if (!request.PipingClass) return toast.error('Piping Class is required.');

//     try {
//       setDisable(true);

//       const payload = {
//         PipingClass: request.PipingClass,
//       };
//       if (data?._id) payload.id = data._id;
//       if (finalId) payload.id = finalId;

//       const res = await axios.post(`${V_URL}/user/manage-piping-request`, payload, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
//         },
//       });

//       if (res.data.success) {
//         toast.success(res.data.message);
//         setFinalId(res.data.data._id);
//       } else toast.error(res.data.message);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setDisable(false);
//     }
//   };

//   // ---------------- ADD / UPDATE ITEM ----------------
//   const handleSubmitItem = async (more) => {
//     if (!itemVal.service || !itemVal.PipingMaterialSpecification)
//       return toast.error('All fields are required');

//     if (!currentId) return toast.error('Save Piping Class first!');

//     try {
//       setDisable2(true);

//       const payload = {
//         piping_id: currentId,
//         service: itemVal.service,
//         PipingMaterialSpecification: itemVal.PipingMaterialSpecification,
//       };
//       if (editId) payload.id = editId;

//       const res = await axios.post(`${V_URL}/user/manage-piping-item`, payload, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
//         },
//       });

//       if (res.data.success) {
//         toast.success(res.data.message);
//         setItems(res.data.data.Items || []);
//         setItemVal({ service: '', PipingMaterialSpecification: '' });
//         if (more !== 'more') handleClose();
//       } else toast.error(res.data.message);
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setDisable2(false);
//     }
//   };

//   // ---------------- EDIT ITEM ----------------
//   const handleEdit = (mData) => {
//     setItemVal({
//       service: mData.service,
//       PipingMaterialSpecification: mData.PipingMaterialSpecification,
//     });
//     setEditId(mData._id);
//     setShow(true);
//   };

//   // ---------------- DELETE ITEM ----------------
//   // const handleDelete = (id, title) => {
//   //   Swal.fire({
//   //     title: `Delete ${title}?`,
//   //     text: "You won't be able to revert this!",
//   //     icon: 'warning',
//   //     showCancelButton: true,
//   //     confirmButtonColor: '#3085d6',
//   //     cancelButtonColor: '#d33',
//   //     confirmButtonText: 'Yes, delete it!',
//   //   }).then((result) => {
//   //     if (result.isConfirmed) {
//   //       setItems((prev) => prev.filter((it) => it._id !== id));
//   //       toast.success('Deleted locally. (Add backend delete if needed)');
//   //     }
//   //   });
//   // };

//   const handleDelete = async (id, title, piping_id) => {
//           Swal.fire({
//             title: `Delete ${title}?`,
//             text: "You won't be able to revert this!",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#3085d6",
//             cancelButtonColor: "#d33",
//             confirmButtonText: "Yes, delete it!",
//           }).then(async (result) => {
//             if (result.isConfirmed) {
//               try {
//               const res = await axios.delete(`${V_URL}/user/delete-piping-item`, {
//           data: { piping_id, id }, // <-- payload must go inside 'data'
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
//           },
//         });
//         if (res.data.success) {
//           // Remove deleted item from state
//           setItems((prev) => prev.filter((it) => it._id !== id));
//           toast.success(res.data.message);

//         } else {
//           toast.error(res.data.message);
//         }
//       } catch (error) {
//         console.error("Delete Item Error:", error);
//         Swal.fire("Error!", "Something went wrong while deleting.", "error");
//       }
//     }
//   });
// };


//   return (
//     <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
//       <Header handleOpen={handleOpen} />
//       <Sidebar />
//       <div className="page-wrapper">
//         <div className="content">
//           <div className="page-header">
//             <h4>{data?._id ? 'Edit' : 'Add'} Piping Class</h4>
//           </div>

//           <div className="card">
//             <div className="card-body">
//               <form>
//                 <div className="row">
//                   <div className="col-md-4">
//                     <label>Piping Class <span className="text-danger">*</span></label>
//                     <input
//                       type="text"
//                       name="PipingClass"
//                       value={request.PipingClass}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//               </form>

//               <div className="text-end mt-3">
//                 <button
//                   type="button"
//                   className="btn btn-primary"
//                   onClick={handleSubmit}
//                   disabled={disable}
//                 >
//                   {disable ? 'Processing...' : data?._id ? 'Update' : 'Save'}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {currentId && (
//             <div className="card mt-4">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-3">
//                   <h5>Item List</h5>
//                   <button className="btn btn-primary" onClick={handleShow}>
//                     + Add Item
//                   </button>
//                 </div>

//                 {items.length > 0 ? (
//                   <table className="table table-striped">
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Service</th>
//                         <th>Piping Material Specification</th>
//                         <th className="text-end">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item, i) => (
//                         <tr key={i}>
//                           <td>{i + 1}</td>
//                           <td>{item.service}</td>
//                           <td>{item.PipingMaterialSpecification}</td>
//                           <td className="text-end">
//                             <a className="mx-2 text-primary" onClick={() => handleEdit(item)}>
//                               <Pencil size={18} />
//                             </a>
//                             <a className="mx-2 text-danger" onClick={() => handleDelete(item._id, item.service, currentId)}>
//                               <Trash2 size={18} />
//                             </a>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p>No items added yet.</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//         <Footer />
//       </div>

//       {/* Modal for Add/Edit Item */}
//       <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{editId ? 'Edit' : 'Add'} Item</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="row">
//             <div className="col-md-6">
//               <label>Service</label>
//               <input
//                 className="form-control"
//                 name="service"
//                 type="text"
//                 value={itemVal.service}
//                 onChange={handleChange2}
//               />
//             </div>
//             <div className="col-md-6">
//               <label>Piping Material Specification</label>
//               <input
//                 className="form-control"
//                 name="PipingMaterialSpecification"
//                 type="text"
//                 value={itemVal.PipingMaterialSpecification}
//                 onChange={handleChange2}
//               />
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-primary" onClick={() => handleSubmitItem('more')} disabled={disable2}>
//             {editId ? 'Update & Add More' : 'Save & Add More'}
//           </button>
//           <button className="btn btn-success" onClick={() => handleSubmitItem()} disabled={disable2}>
//             {editId ? 'Update & Close' : 'Save & Close'}
//           </button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManagePipingClass;

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { V_URL } from '../../../../BaseUrl';
import { getUserPipingClassById } from '../../../../Store/Piping/PipingClass/PipingClassMaster'
import { useDispatch } from 'react-redux';

const ManagePipingClass = () => {
  const location = useLocation();
  const dispatch = useDispatch();


  const [disable, setDisable] = useState(false);
  const [disable2, setDisable2] = useState(false);
  const [request, setRequest] = useState({ PipingClass: '' });
  const [items, setItems] = useState([]);
  const [finalId, setFinalId] = useState('');
  const [show, setShow] = useState(false);
  const [editId, setEditId] = useState('');
  const [itemVal, setItemVal] = useState({ service: '', PipingMaterialSpecification: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const data = location.state;
  const currentId = finalId || data?._id;

  // ---------------- INIT ----------------
  useEffect(() => {
    if (data) {
      setRequest({ PipingClass: data.PipingClass });
      setItems(data.Items || []);
    }
  }, [data]);

    const refreshData = () => {
    dispatch(getUserPipingClassById({ id: finalId || data?._id }));
  };

  const handleChange = (e) => setRequest({ ...request, [e.target.name]: e.target.value });
  const handleChange2 = (e) => setItemVal({ ...itemVal, [e.target.name]: e.target.value });

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  const handleShow = () => {
    if (!currentId) return toast.error('Save Piping Class first!');
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setItemVal({ service: '', PipingMaterialSpecification: '' });
    setEditId('');
  };

  // ---------------- CREATE / UPDATE PIPING CLASS ----------------
  const handleSubmit = async () => {
    if (!request.PipingClass) return toast.error('Piping Class is required.');

    try {
      setDisable(true);

      const payload = {
        PipingClass: request.PipingClass,
      };
      if (data?._id) payload.id = data._id;
      if (finalId) payload.id = finalId;

      const res = await axios.post(`${V_URL}/user/manage-piping-request`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setFinalId(res.data.data._id);
        refreshData();
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setDisable(false);
    }
  };

  // ---------------- ADD / UPDATE ITEM ----------------
  const handleSubmitItem = async (more) => {
    if (!itemVal.service || !itemVal.PipingMaterialSpecification)
      return toast.error('All fields are required');

    if (!currentId) return toast.error('Save Piping Class first!');

    try {
      setDisable2(true);

      const payload = {
        piping_id: currentId,
        service: itemVal.service,
        PipingMaterialSpecification: itemVal.PipingMaterialSpecification,
      };
      if (editId) payload.id = editId;

      const res = await axios.post(`${V_URL}/user/manage-piping-item`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setItems(res.data.data.Items || []);
        setItemVal({ service: '', PipingMaterialSpecification: '' });
        if (more !== 'more') handleClose();
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setDisable2(false);
    }
  };

  // ---------------- EDIT ITEM ----------------
  const handleEdit = (mData) => {
    setItemVal({
      service: mData.service,
      PipingMaterialSpecification: mData.PipingMaterialSpecification,
    });
    setEditId(mData._id);
    setShow(true);
  };

  // ---------------- DELETE ITEM ----------------
  // const handleDelete = (id, title) => {
  //   Swal.fire({
  //     title: `Delete ${title}?`,
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setItems((prev) => prev.filter((it) => it._id !== id));
  //       toast.success('Deleted locally. (Add backend delete if needed)');
  //     }
  //   });
  // };

  const handleDelete = async (id, title, piping_id) => {
          Swal.fire({
            title: `Delete ${title}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
              const res = await axios.delete(`${V_URL}/user/delete-piping-item`, {
          data: { piping_id, id }, // <-- payload must go inside 'data'
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
          },
        });
        if (res.data.success) {
          toast.success(res.data.message);

          // 1️⃣ Remove item locally
          setItems((prev) => prev.filter((it) => it._id !== id));

          // 2️⃣ Fetch latest data from backend (optional safety)
          const refreshed = await axios.get(`${V_URL}/user/get-piping-class-by-id/${piping_id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('PAY_USER_TOKEN')}`,
            },
          });

          if (refreshed.data.success) {
            setItems(refreshed.data.data.Items || []); // 3️⃣ update UI immediately
          }

          refreshData(); // 4️⃣ also keep redux in sync
        }

      } catch (error) {
        console.error("Delete Item Error:", error);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  });
};


  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <h4>{data?._id ? 'Edit' : 'Add'} Piping Class</h4>
          </div>

          <div className="card">
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <label>Piping Class <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="PipingClass"
                      value={request.PipingClass}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </form>

              <div className="text-end mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={disable}
                >
                  {disable ? 'Processing...' : data?._id ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {currentId && (
            <div className="card mt-4">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <h5>Item List</h5>
                  <button className="btn btn-primary" onClick={handleShow}>
                    + Add Item
                  </button>
                </div>

                {items.length > 0 ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Service</th>
                        <th>Piping Material Specification</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item.service}</td>
                          <td>{item.PipingMaterialSpecification}</td>
                          <td className="text-end">
                            <a className="mx-2 text-primary" onClick={() => handleEdit(item)}>
                              <Pencil size={18} />
                            </a>
                            <a className="mx-2 text-danger" onClick={() => handleDelete(item._id, item.service, currentId)}>
                              <Trash2 size={18} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No items added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>

      {/* Modal for Add/Edit Item */}
      <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <label>Service</label>
              <input
                className="form-control"
                name="service"
                type="text"
                value={itemVal.service}
                onChange={handleChange2}
              />
            </div>
            <div className="col-md-6">
              <label>Piping Material Specification</label>
              <input
                className="form-control"
                name="PipingMaterialSpecification"
                type="text"
                value={itemVal.PipingMaterialSpecification}
                onChange={handleChange2}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={() => handleSubmitItem('more')} disabled={disable2}>
            {editId ? 'Update & Add More' : 'Save & Add More'}
          </button>
          <button className="btn btn-success" onClick={() => handleSubmitItem()} disabled={disable2}>
            {editId ? 'Update & Close' : 'Save & Close'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagePipingClass;

