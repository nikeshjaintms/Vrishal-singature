
// import React, { useEffect, useState } from 'react'
// import { Modal } from 'react-bootstrap';
// import { Dropdown } from 'primereact/dropdown';
// import toast from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';
// import { getMainStoreStock } from '../../../../../Store/Store/MainStore/MainStock';
// import { GetMultiGenReleaseNote } from "../../../../../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote";
// import { managePacking } from '../../../../../Store/MutipleDrawing/MultiPacking/ManagePacking';
// import { managePackingList } from '../../../../../Store/MutipleDrawing/MultiPacking/ManagePackingList';
// import { getMultiPacking } from '../../../../../Store/MutipleDrawing/MultiPacking/GetMultiPacking';


// const AddDrawingForm = ({ modalOpen, handleModalClose, handleAddMore, handleCloseModal,editeMode, onSaveItem,updateItem, editItem, modalMode }) => {
//     const dispatch = useDispatch()
//     const [entity, setEntity] = useState([]);
//     const [err, setError] = useState({});
//     const [tableData, setTableData] = useState([]);
//     const [item, setItem] = useState({
//         item_id: '',
//         item_name: '',
//         assembly_no: "",
//         drawing_no: "",
//         rn_used_grid_qty: 0,
//         irn_no: "",
//         unit_assembly_weight: 0,
//         total_assembly_weight: 0,
//         remarks: "",
       
//     });
//     const itemDetails = useSelector((state) => state.getAdminItem?.user?.data || []);
//     const mainStoreStock = useSelector((state) => state.getMainStoreStock?.user?.data || []);
//     const filteredData = itemDetails?.find((it) => it?._id === item?.item_id);
//     const currentStock = mainStoreStock?.find(item => item.ItemId === filteredData?._id) || {};
//     const availableBalance = currentStock.balance || 0;

//     useEffect(() => {
//         const filteredData = itemDetails?.find((it) => it?._id === item?.item_id);
//         if (filteredData) {
//             dispatch(getMainStoreStock({ itemId: filteredData?._id }))
//         }

//         if (modalMode === "edit") {
//             setItem((prev) => ({
//                 ...prev,
//                 item_id: filteredData?._id,
//                 item_name: filteredData?.name,
//                 assembly_no: filteredData?.assembly_no,
//                 grid_no: filteredData?.grid_no,
//                 irn_no: filteredData?.irn_no,
//                 rn_used_grid_qty: filteredData?.rn_used_grid_qty,
//                 unit_assembly_weight: filteredData?.unit_assembly_weight,
//                 total_assembly_weight: filteredData?.total_assembly_weight,
//                 remarks: filteredData?.remarks,
//                 drawing_no: filteredData?.drawing_no,
//             }))
//         } else {
//             setItem((prev) => ({
//                 ...prev,
//                 item_id: filteredData?._id,
//                 item_name: filteredData?.name,
//                 assembly_no: filteredData?.assembly_no,
//                 grid_no: filteredData?.grid_no,
//                 irn_no: filteredData?.irn_no,
//                 rn_used_grid_qty: filteredData?.rn_used_grid_qty,
//                 unit_assembly_weight: filteredData?.unit_assembly_weight,
//                 total_assembly_weight: filteredData?.total_assembly_weight,
//                 remarks: filteredData?.remarks,
//                 drawing_no: filteredData?.drawing_no,
//             }))
//         }
//     }, [item?.item_id])

//     useEffect(() => {
//         if (editeMode && editItem) {
//             setItem({
//                 item_id: editItem?._id,
//                 item_name: editItem?.name,
//                 assembly_no: editItem?.assembly_no,
//                 grid_no: editItem?.grid_no,
//                 irn_no: editItem?.irn_no,
//                 rn_used_grid_qty: editItem?.rn_used_grid_qty,
//                 unit_assembly_weight: editItem?.unit_assembly_weight,
//                 total_assembly_weight: editItem?.total_assembly_weight,
//                 remarks: editItem?.remarks,
//                 drawing_no: editItem?.drawing_no,
//             })
//         } else {
//             setItem({
//                 item_id: '',
//                 item_name: '',
//                 unit: "",
//                 mcode: "",
//                 quantity: 0,
//                 rate: 0,
//                 amount: 0,
//                 taxable_amount: 0,
//                 gst: 0,
//                 gst_amount: 0,
//                 total_amount: 0,
//                 isreturn: "",
//                 remarks: "",
//             })
//         }
//         if (modalMode === "edit" && updateItem) {
//             setItem({
//                 item_id: updateItem?._id,
//                 item_name: updateItem?.name,
//                 assembly_no: updateItem?.assembly_no,
//                 grid_no: updateItem?.grid_no,
//                 irn_no: updateItem?.irn_no,
//                 rn_used_grid_qty: updateItem?.rn_used_grid_qty,
//                 unit_assembly_weight: updateItem?.unit_assembly_weight,
//                 total_assembly_weight: updateItem?.total_assembly_weight,
//                 remarks: updateItem?.remarks,
//                 drawing_no: updateItem?.drawing_no,
//             })
//         }
//     }, [updateItem, modalMode, editeMode])

//     useEffect(() => {
//         dispatch(getAdminItem({ is_main: true }));
//     }, [dispatch]);

//     useEffect(() => {
//         if (itemDetails.length > 0) {
//             setEntity(itemDetails);
//         }
//     }, [itemDetails]);

    

//     const handleItemChange = (e, name) => {
//         const { value } = e.target;
//         setItem((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     }
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setItem((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     }
//     const handleClose = () => {
//         handleModalClose();
//     }

//     const dropdownOptions = entity.map((item) => ({
//         label: item.name,
//         value: item._id,
//     }));

//     const validationModal = () => {
//         let isValid = true;
//         let err = {};

// //        if (!item.item_id) {
// //     isValid = false;
// //     err['item_error'] = "Please select an item";
// // }

// if (!item.item_name?.trim()) {
//     isValid = false;
//     err['item_name_error'] = "Please enter an Item name";
// }

// if (!item.grid_no?.trim()) {
//     isValid = false;
//     err['grid_no_err'] = "Please enter a Grid No";
// }

// if (!item.unit_assembly_weight || isNaN(item.unit_assembly_weight)) {
//     isValid = false;
//     err['unit_assembly_weight_error'] = "Please enter a unit assembly weight";
// }

// if (!item.total_assembly_weight || isNaN(item.total_assembly_weight)) {
//     isValid = false;
//     err['total_assembly_weight_error'] = "Please enter a total assembly weight";
// }

// if (!item.rn_used_grid_qty || isNaN(item.rn_used_grid_qty)) {
//     isValid = false;
//     err['rn_used_grid_qty_error'] = "Please enter a Qty";
// }

// // if (!item.drawing_no?.trim()) {
// //     isValid = false;
// //     err['drawing_no_error'] = "Please enter a Drawing No";
// // }

// // if (!item.irn_no?.trim()) {
// //     isValid = false;
// //     err['irn_no_error'] = "Please enter an IRN";
// // }


//         setError(err);
//         return isValid;
//     };
//     const handleReset = () => {
//         setItem({
//                  item_id: '',
//                 item_name: '',
//                 unit: "",
//                 mcode: "",
//                 quantity: 0,
//                 rate: 0,
//                 amount: 0,
//                 taxable_amount: 0,
//                 gst: 0,
//                 gst_amount: 0,
//                 total_amount: 0,
//                 isreturn: "",
//                 remarks: "",
//         });
//     }

//     const saveItem = (mode) => {
//           console.log("Saveitem:", mode);
//         if (mode === "add") {
//             if (validationModal()) {
//                 handleSave(item)
//                 handleReset()
//                 // handleClose()
//             }
//         } else {
//             if (validationModal()) {
//                 handleAddMore(item)
//                 handleReset()
//             }
//         }
//     }

// // const saveItem = (mode) => {
// //   console.log("Saveitem:", mode, item);
// //   if (mode === "add") {
// //     if (validationModal()) {
// //       handleSave(item);
// //       handleReset();
// //     }
// //   } else {
// //     if (validationModal()) {
// //       handleAddMore(item);
// //       handleReset();
// //     }
// //   }
// // };



    
//     // const handlesaveItem = (item) => {
//     //     //  console.log("Saving item:", item);
//     //     if (validationModal()) {
//     //         handleSave(item)
//     //         handleClose()
//     //     }
//     // }

// // const storeItemInLocalStorage = (item) => {
// //   try {
// //     console.log("🟡 Storing to localStorage:", item);
// //     let savedItems = JSON.parse(localStorage.getItem("drawingItems")) || [];
// //     console.log("📦 Current savedItems:", savedItems);
// //     savedItems.push(item);
// //     localStorage.setItem("drawingItems", JSON.stringify(savedItems));
// //     console.log("✅ Saved to localStorage successfully.");
// //   } catch (error) {
// //     console.error("❌ Error saving to localStorage:", error);
// //   }
// // };

//     // const saveItem = (mode) => {
//     //     console.log("Saveitem mode:", mode, item);
//     //     if (mode === "add") {
//     //         if (validationModal()) {
//     //              storeItemInLocalStorage(item); 
//     //             onSaveItem(item);
//     //             handleReset();
//     //         }
//     //     } else {
//     //         if (validationModal()) {
//     //             handleAddMore(item);
//     //             handleReset();
//     //         }
//     //     }
//     // };

//     // const handlesaveItem = () => {
//     //     if (validationModal()) {
//     //           console.log("Saving item in edit mode:", item);
//     //         console.log("Saving item in edit mode:", item);
//     //           storeItemInLocalStorage(item);
//     //         onSaveItem(item);
//     //         handleClose();
//     //     }
//     // };



// //     const handlesaveItem = () => {
// //   if (validationModal()) {
// //     console.log("Saving item in edit mode:", item);
// //     storeItemInLocalStorage(item); // <-- Store to localStorage
// //     onSaveItem(item);
// //     handleClose();
// //   }
// // };

// // // console.log(JSON.parse(localStorage.getItem("drawingItems")));

// //     const saveItem = (mode) => {
// //   console.log("Saveitem mode:", mode, item);
// //   if (validationModal()) {
// //     storeItemInLocalStorage(item); // <-- Store to localStorage
// //     if (mode === "add") {
// //       onSaveItem(item);
// //     } else {
// //       handleAddMore(item);
// //     }
// //     handleReset();
// //   }
// // };

// const handleSave = async () => {

//      const updatedArray = item?.filter((it) => it?.pl_used_grid_qty > 0);
//             if (updatedArray?.length === 0) {
//                 toast.error("Please enter valid Grid Used Quantity for at least one item.");
//                 return;
//             }
       
//         const updatedData = updatedArray?.map((item) => ({
//             "item_name": item.item_name,
//             "assembly_no": item.assembly_no,
//             "grid_no": item.grid_no,
//             "irn_no": item.irn_no,
//             "rn_used_grid_qty": item?.rn_used_grid_qty,
//             "unit_assembly_weight": item?.unit_assembly_weight,
//             "total_assembly_weight": item?.total_assembly_weight,
//             "drawing_no": item?.drawing_no,
//             "remarks": item?.rn_used_grremarksid_qty,

//         }));

     

//         const ManagePackinglist = new URLSearchParams();
//         ManagePackinglist.append('items', JSON.stringify(updatedData));        
//         try {
//             await dispatch(managePackingList({ bodyFormData: ManagePackinglist }))
//             dispatch(GetMultiGenReleaseNote())
//             dispatch(getMultiPacking())
//             handleCloseModal();
//             toast.success("Packing Offer saved successfully.");
//         } catch (error) {
//             toast.error("Failed to save data. Please try again.");
//         }
//     }


//     return (
//         <Modal
//             show={modalOpen}
//             backdrop="static"
//             size="lg"
//             keyboard={false}
//             onHide={handleClose}
//             handleClose={handleClose}
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title>Add Drawing Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className="modal-container">
//                     <div className="row">
//                         <div className="col-md-12">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <div className='row'>
//                                         <div className="col-md-6">
//                                             <div className="input-block local-forms">
//                                                 <label>
//                                                 Drawing No
//                                                     <span className="login-danger">*</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="drawing_no"
//                                                     value={item.drawing_no}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <div className="error">{err.drawing_no_error}</div>
//                                             </div>
                                           
//                                         </div>

//                                     <div className="col-md-6">
//                                             <div className="input-block local-forms">
//                                                 <label>
//                                                  Item
//                                                     <span className="login-danger">*</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="item_name"
//                                                     value={item.item_name}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <div className="error">{err.item_name_error}</div>
//                                             </div>
//                                     </div>        
//                                     </div>
//                                      <div className='row'>
//                                         <div className="col-md-6">

//                                             <div className="input-block local-forms">
//                                                 <label>
//                                               Grid No
//                                                     <span className="login-danger">*</span>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="grid_no"
//                                                     value={item.grid_no}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <div className="error">{err.grid_no_err}</div>
//                                             </div>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <div className="input-block local-forms">
//                                                 <label>
//                                                  Qty <span className="login-danger">*</span>
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="rn_used_grid_qty"
//                                                     value={item.rn_used_grid_qty}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <div className="error">{err.rn_used_grid_qty_error}</div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div classname="row">
//                                          <div className="col-md-12">
//                                             <div className="input-block local-forms">
//                                                 <label>
//                                                    IRN
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="irn_no"
//                                                     value={item.irn_no}
//                                                     onChange={handleChange}
//                                                 />
//                                                   <div className="error">{err.irn_no_error}</div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className='row'>
                                    
//                                          <div className="col-md-6">
//                                             <div className="input-block local-forms">
//                                                 <label>
//                                                    Unit Assem. Weight(kg).
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="unit_assembly_weight"
//                                                     value={item.unit_assembly_weight}
//                                                     onChange={handleChange}
//                                                 />
//                                                   <div className="error">{err.unit_assembly_weight_error}</div>
//                                             </div>


//                                         </div>

//                                     <div className="col-md-6">
//                                          <div className="input-block local-forms">
//                                                 <label>
//                                                    Total Assem. Weight(kg).
//                                                 </label>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control"
//                                                     name="total_assembly_weight"
//                                                     value={item.total_assembly_weight}
//                                                     onChange={handleChange}
//                                                 />
//                                                   <div className="error">{err.total_assembly_weight_error}</div>
//                                             </div>
//                                             </div>

                                          
                                     
//                                     </div>
//                                    <div className='row'>
//                                  <div className="col-12">
//                                     <div className="input-block local-forms">
//                                         <label>
//                                             Remarks
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="remarks"
//                                             value={item.remarks}
//                                             onChange={handleChange}
//                                         />
//                                         <div className="error">{err.remarks_error}</div>
//                                     </div>
//                                  </div>
//                                     </div>
//                                 </div>
                               
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </Modal.Body>
//             {/* <Modal.Footer>
//                 <div className="col-12 text-end">
//                     <div className="doctor-submit text-end">
//                         <button
//                             type="button"
//                             className="btn btn-primary cancel-form"
//                             onClick={handleClose}
//                         >
//                             Cancel
//                         </button>
//                         {
//                             modalMode === "add" && modalMode === "edit" ? <>
//                                 <button
//                                     type="button"
//                                     className="btn btn-primary submit-form ms-2"
//                                     onClick={handlesaveItem}
//                                 >
//                                     Save
//                                 </button>
//                             </> : <>
//                                 <button
//                                     type="button"
//                                     className="btn btn-primary submit-form ms-2"
//                                     onClick={() => saveItem("add")}
//                                 >
//                                     Save
//                                 </button>
//                                 {
//                                     !editeMode && (
//                                         <button
//                                             type="button"
//                                             className="btn btn-primary submit-form ms-2"
//                                             onClick={() => saveItem("addMore")}
//                                         >
//                                             Add More
//                                         </button>
//                                     )
//                                 }

//                             </>
//                         }
//                     </div>
//                 </div>
//             </Modal.Footer> */}
//             <Modal.Footer>
//   <div className="col-12 text-end">
//     <div className="doctor-submit text-end">
//       <button
//         type="button"
//         className="btn btn-primary cancel-form"
//         onClick={handleClose}
//       >
//         Cancel
//       </button>

//       {/* {modalMode === "edit" ? (
//         <button
//           type="button"
//           className="btn btn-primary submit-form ms-2"
//           onClick={handlesaveItem}
//         >
//           Save
//         </button>
//       ) : (
//         <>
//           <button
//             type="button"
//             className="btn btn-primary submit-form ms-2"
//             onClick={() => saveItem("add")}
//           >
//             Save
//           </button>
//           {!editeMode && (
//             <button
//               type="button"
//               className="btn btn-primary submit-form ms-2"
//               onClick={() => saveItem("addMore")}
//             >
//               Add More
//             </button>
//           )}
//         </>
//       )} */}

//       {modalMode === "edit" ? (
//   <button
//     type="button"
//     className="btn btn-primary submit-form ms-2"
//     onClick={handleSave}
//   >
//     Save
//   </button>
// ) : (
//   <>
//     <button
//       type="button"
//       className="btn btn-primary submit-form ms-2"
//       onClick={() => handleSave("add")}
//     >
//       Save
//     </button>
//     {!editeMode && (
//       <button
//         type="button"
//         className="btn btn-primary submit-form ms-2"
//         onClick={() => saveItem("addMore")}
//       >
//         Add More
//       </button>
//     )}
//   </>
// )}

//     </div>
//   </div>
// </Modal.Footer>

//         </Modal>
//     )
// }

// export default AddDrawingForm

import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminItem } from '../../../../../Store/Store/Item/AdminItem';
import { getMainStoreStock } from '../../../../../Store/Store/MainStore/MainStock';
import { GetMultiGenReleaseNote } from "../../../../../Store/MutipleDrawing/MultiReleaseNote/GetMultiGeneratedReleaseNote";
import { managePacking } from '../../../../../Store/MutipleDrawing/MultiPacking/ManagePacking';
import { managePackingList } from '../../../../../Store/MutipleDrawing/MultiPacking/ManagePackingList'; // This is the import you want to ensure is called
import { getMultiPacking } from '../../../../../Store/MutipleDrawing/MultiPacking/GetMultiPacking';


const AddDrawingForm = ({ modalOpen, handleModalClose, handleAddMore, handleCloseModal, editeMode, onSaveItem, updateItem, editItem, modalMode }) => {
    const dispatch = useDispatch();
    const [entity, setEntity] = useState([]);
    const [err, setError] = useState({});
    // The tableData state might be better managed in the parent component if this modal
    // is only for adding/editing individual items.
    // const [tableData, setTableData] = useState([]);
    const [item, setItem] = useState({
        item_id: '',
        item_name: '',
        assembly_no: "",
        drawing_no: "",
        grid_no: "",    
        rn_used_grid_qty: 0,
        irn_no: "",
        unit_assembly_weight: 0,
        total_assembly_weight: 0,
        remarks: "",
    });

    const itemDetails = useSelector((state) => state.getAdminItem?.user?.data?.data || []);
    const mainStoreStock = useSelector((state) => state.getMainStoreStock?.user?.data || []);
    const filteredData = itemDetails?.find((it) => it?._id === item?.item_id);
    const currentStock = mainStoreStock?.find(item => item.ItemId === filteredData?._id) || {};
    const availableBalance = currentStock.balance || 0;

    useEffect(() => {
        const currentFilteredData = itemDetails?.find((it) => it?._id === item?.item_id);
        if (currentFilteredData) {
            dispatch(getMainStoreStock({ itemId: currentFilteredData?._id }));
        }

        // When in 'edit' mode, if an item is being updated, populate the form
        if (modalMode === "edit" && updateItem) {
            setItem({
                item_id: updateItem?._id || '',
                item_name: updateItem?.name || '',
                assembly_no: updateItem?.assembly_no || '',
                grid_no: updateItem?.grid_no || '',
                irn_no: updateItem?.irn_no || '',
                rn_used_grid_qty: updateItem?.rn_used_grid_qty || 0,
                unit_assembly_weight: updateItem?.unit_assembly_weight || 0,
                total_assembly_weight: updateItem?.total_assembly_weight || 0,
                remarks: updateItem?.remarks || '',
                drawing_no: updateItem?.drawing_no || '',
            });
        }
        // When initially entering 'editMode' with an existing editItem
        else if (editeMode && editItem) {
            setItem({
                item_id: editItem?._id || '',
                item_name: editItem?.name || '',
                assembly_no: editItem?.assembly_no || '',
                grid_no: editItem?.grid_no || '',
                irn_no: editItem?.irn_no || '',
                rn_used_grid_qty: editItem?.rn_used_grid_qty || 0,
                unit_assembly_weight: editItem?.unit_assembly_weight || 0,
                total_assembly_weight: editItem?.total_assembly_weight || 0,
                remarks: editItem?.remarks || '',
                drawing_no: editItem?.drawing_no || '',
            });
        }
        // When adding a new item, ensure the form is reset
        else if (modalMode === "add" && !editItem && !updateItem) {
            setItem({
                item_id: '',
                item_name: '',
                assembly_no: "",
                drawing_no: "",
                rn_used_grid_qty: 0,
                irn_no: "",
                grid_no: "",
                unit_assembly_weight: 0,
                total_assembly_weight: 0,
                remarks: "",
            });
        }
    }, [item?.item_id, updateItem, modalMode, editeMode, editItem, itemDetails, dispatch]);


    useEffect(() => {
        dispatch(getAdminItem({ is_main: true }));
    }, [dispatch]);

    useEffect(() => {
        if (itemDetails.length > 0) {
            setEntity(itemDetails);
        }
    }, [itemDetails]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        handleModalClose();
        handleReset(); // Reset form when modal closes
    };

    const validationModal = () => {
        let isValid = true;
        let newErrors = {}; // Renamed from 'err' to avoid confusion with state 'err'

        if (!item.item_name?.trim()) {
            isValid = false;
            newErrors['item_name_error'] = "Please enter an Item name";
        }

        if (!item.grid_no?.trim()) {
            isValid = false;
            newErrors['grid_no_err'] = "Please enter a Grid No";
        }

        if (!item.unit_assembly_weight || isNaN(item.unit_assembly_weight) || parseFloat(item.unit_assembly_weight) <= 0) {
            isValid = false;
            newErrors['unit_assembly_weight_error'] = "Please enter a valid unit assembly weight";
        }

        if (!item.total_assembly_weight || isNaN(item.total_assembly_weight) || parseFloat(item.total_assembly_weight) <= 0) {
            isValid = false;
            newErrors['total_assembly_weight_error'] = "Please enter a valid total assembly weight";
        }

        if (!item.rn_used_grid_qty || isNaN(item.rn_used_grid_qty) || parseInt(item.rn_used_grid_qty) <= 0) {
            isValid = false;
            newErrors['rn_used_grid_qty_error'] = "Please enter a valid Qty";
        }
        // If drawing_no and irn_no are truly optional, keep them commented out
        // if (!item.drawing_no?.trim()) {
        //     isValid = false;
        //     newErrors['drawing_no_error'] = "Please enter a Drawing No";
        // }
        // if (!item.irn_no?.trim()) {
        //     isValid = false;
        //     newErrors['irn_no_error'] = "Please enter an IRN";
        // }

        setError(newErrors);
        console.log("error", newErrors);
        return isValid;
    };

    const handleReset = () => {
        setItem({
            item_id: '',
            item_name: '',
            assembly_no: "",
            drawing_no: "",
            rn_used_grid_qty: 0,
            irn_no: "",
            grid_no: "",
            unit_assembly_weight: 0,
            total_assembly_weight: 0,
            remarks: "",
        });
        setError({}); // Clear errors on reset
    };

    // This function will now handle saving a single item to the API
    const handleSaveSingleItemToAPI = async () => {
        if (!validationModal()) {
            return;
        }
console.log("validation failed");
        // Format the current 'item' object into an array for the API
        const formattedItemForAPI = [{
            "item_name": item.item_name,
            "assembly_no": item.assembly_no,
            "grid_no": item.grid_no,
            "irn_no": item.irn_no,
            "project_id": item.project_id,
            "rn_used_grid_qty": item?.rn_used_grid_qty,
            "unit_assembly_weight": item?.unit_assembly_weight,
            "total_assembly_weight": item?.total_assembly_weight,
            "drawing_no": item?.drawing_no,
            "remarks": item?.remarks,
        }];
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('items', JSON.stringify(formattedItemForAPI));

        try {
            await dispatch(managePackingList({ bodyFormData: bodyFormData }));
            dispatch(GetMultiGenReleaseNote()); // These might be related to other data updates
            dispatch(getMultiPacking());         // after a successful item save.
            toast.success("Drawing details saved successfully.");
            handleReset();
            handleClose(); // Close the modal after successful save
        } catch (error) {
            toast.error("Failed to save drawing details. Please try again.");
            console.error("API Save error:", error);
        }
    };

    // This function will handle adding the current item to a list (presumably in parent)
    const handleAddMoreItemToList = () => {
        if (validationModal()) {
            const newItem = { ...item, id: Date.now() }; // Add a unique ID for list management
            handleAddMore(newItem); // Call the parent's handleAddMore
            handleReset(); // Reset form for next item
        }
    };

    return (
        <Modal
            show={modalOpen}
            backdrop="static"
            size="lg"
            keyboard={false}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Drawing Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Drawing No
                                                    <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="drawing_no"
                                                    value={item.drawing_no}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.drawing_no_error}</div>
                                            </div>

                                        </div>

                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Item
                                                    <span className="login-danger">*</span>
                                                </label>
                                                {/* Consider using a Dropdown for item_id if item_name is derived */}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="item_name"
                                                    value={item.item_name}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.item_name_error}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-6">

                                            <div className="input-block local-forms">
                                                <label>
                                                    Grid No
                                                    <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="grid_no"
                                                    value={item.grid_no}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.grid_no_err}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Qty <span className="login-danger">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="rn_used_grid_qty"
                                                    value={item.rn_used_grid_qty}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.rn_used_grid_qty_error}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-block local-forms">
                                                <label>
                                                    IRN
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="irn_no"
                                                    value={item.irn_no}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.irn_no_error}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>

                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Unit Assem. Weight(kg).
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="unit_assembly_weight"
                                                    value={item.unit_assembly_weight}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.unit_assembly_weight_error}</div>
                                            </div>


                                        </div>

                                        <div className="col-md-6">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Total Assem. Weight(kg).
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="total_assembly_weight"
                                                    value={item.total_assembly_weight}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.total_assembly_weight_error}</div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className='row'>
                                        <div className="col-12">
                                            <div className="input-block local-forms">
                                                <label>
                                                    Remarks
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="remarks"
                                                    value={item.remarks}
                                                    onChange={handleChange}
                                                />
                                                <div className="error">{err.remarks_error}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="col-12 text-end">
                    <div className="doctor-submit text-end">
                        <button
                            type="button"
                            className="btn btn-primary cancel-form"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        {/* In edit mode, clicking save should update the current item */}
                        {modalMode === "edit" ? (
                            <button
                                type="button"
                                className="btn btn-primary submit-form ms-2"
                                onClick={handleSaveSingleItemToAPI} // Directly call API for update
                            >
                                Save Changes
                            </button>
                        ) : (
                            <>
                                {/* In add mode, "Save" should save the current item to API and close */}
                                <button
                                    type="button"
                                    className="btn btn-primary submit-form ms-2"
                                    onClick={handleSaveSingleItemToAPI}
                                >
                                    Save
                                </button>
                                {/* "Add More" should add to a list without closing the modal */}
                                {!editeMode && ( // editeMode is likely same as modalMode === "edit"
                                    <button
                                        type="button"
                                        className="btn btn-primary submit-form ms-2"
                                        onClick={handleAddMoreItemToList}
                                    >
                                        Add More
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Modal.Footer>

        </Modal>
    );
};

export default AddDrawingForm;