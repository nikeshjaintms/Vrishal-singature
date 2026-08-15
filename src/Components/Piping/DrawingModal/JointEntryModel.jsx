import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { V_URL } from '../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
// import UploadFile from '../../DownloadFormat/UploadFile';
import UploadFile from '../../Piping/DrawingModal/DownloadFormat/UploadFile';
import { getUserJointTypePiping } from '../../../Store/Piping/JointType/JointTypePiping';
import { getSpoolNo } from '../../../Store/Piping/Drawing/getSpoolNo';
import { getJointEntryItems } from '../../../Store/Piping/Drawing/getJointEntryItems';
import { Plus, Trash2 } from "lucide-react";

const JointEntryModal = ({
    show,
    handleJointClose,
    jointItems = [],
    jointEditData = {},
    handleSaveJointModal,
    drawId,
    finalId
}) => {
    const dispatch = useDispatch();

    const [jointModal, setJointModal] = useState({
        // length:'',
        // area: '',
        // inch_meter: '',
        material_items: []
    });

    const [drawSpool, setDrawSpool] = useState({ spool_no: "", spool_no_id: "" });
    const [error, setError] = useState({});
    const [spoolId, setSpoolId] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(getUserJointTypePiping({ status: true }));
        dispatch(getSpoolNo());
    }, [dispatch]);

    const jointTypes = useSelector(
        (state) => state?.getUserJointTypePiping?.user?.data || []
    );

    const materialItems = Array.isArray(jointItems)
        ? jointItems
        : Array.isArray(jointItems?.data)
            ? jointItems.data
            : [];

    // Populate fields on edit
    useEffect(() => {
        if (jointEditData && jointEditData._id) {
            const mappedItems = jointEditData?.material_items?.map(item => {
                const item1 = item.material_item_id[0] || null;
                const item2 = item.material_item_id[1] || null;
                const selected_size_id = item.selected_size?._id || '';
                const selected_thickness_id = item.selected_thickness?._id || '';
                return {
                    item1_id: item1?._id || "",
                    item2_id: item2?._id || "",
                    joint_no: item.joint_no || "",
                    sheet_no: item.sheet_no || "",
                    area: item.area || "",
                    length: item.length || "",
                    inch_meter: item.inch_meter || "",

                    joint_type: item.joint_type?._id || item.joint_type || "",
                    selected_size: selected_size_id || "",
                    selected_thickness: selected_thickness_id || "",

                };
            }) || [];

            setJointModal({
                // area: jointEditData?.area || '',
                // length: jointEditData?.length || '',
                // inch_meter: jointEditData?.inch_meter || '',
                material_items: mappedItems,
            });

            setDrawSpool({
                spool_no: jointEditData.spool_no_id?.spool_no || "",
                spool_no_id: jointEditData.spool_no_id?._id || ""
            });
            setSpoolId(jointEditData.spool_no_id?._id || '');
            setShowForm(true)
        } else {
            handleClear();
        }
    }, [jointEditData, jointItems]);

    const handleChange = (e) => {
        setJointModal({ ...jointModal, [e.target.name]: e.target.value });
    };

    const calculateRowValues = (row) => {
        const length = Number(row.length);

        if (!length || !row.selected_size) {
            return { ...row, area: "", inch_meter: "" };
        }

        const item =
            materialItems.find(it => it._id === row.item1_id) ||
            materialItems.find(it => it._id === row.item2_id);

        if (!item) return row;

        const { size1, size2 } = item.item || {};

        let sizeMM = 0;
        let sizeInch = 0;

        if (row.selected_size === size1?._id) {
            sizeMM = Number(size1.size_mm || 0);
            sizeInch = Number(size1.name || 0);
        }

        if (row.selected_size === size2?._id) {
            sizeMM = Number(size2.size_mm || 0);
            sizeInch = Number(size2.name || 0);
        }

        if (!sizeMM || !sizeInch) {
            return { ...row, area: "", inch_meter: "" };
        }

        const area = 3.14 * (sizeMM / 1000) * (length / 1000);
        const inch_meter = sizeInch * (length / 1000);

        return {
            ...row,
            area: area.toFixed(3),
            inch_meter: inch_meter.toFixed(3)
        };
    };

    // const handleJointItemFieldChange = (rowIndex, name, value) => {
    //     const updatedRows = [...jointModal.material_items];
    //     updatedRows[rowIndex] = { ...updatedRows[rowIndex], [name]: value };

    //     // 👇 recalculate when length or size changes
    //     if (name === "length" || name === "selected_size") {
    //         updatedRows[rowIndex] = calculateRowValues(updatedRows[rowIndex]);
    //     }

    //     setJointModal({ ...jointModal, material_items: updatedRows });
    // };

    const handleJointItemFieldChange = (rowIndex, name, value) => {
  const updatedRows = [...jointModal.material_items];
  updatedRows[rowIndex] = { ...updatedRows[rowIndex], [name]: value };

  // 🔴 If joint_no is FW or FJ → clear item2
  if (name === "joint_no") {
    const jointNo = value?.toUpperCase();
     const isFWFJ = ["FW", "FJ"].some(prefix =>
    jointNo.startsWith(prefix)
  );

  if (isFWFJ) {
    updatedRows[rowIndex].item2_id = "";
  }
  }

  // recalculate
  if (name === "length" || name === "selected_size") {
    updatedRows[rowIndex] = calculateRowValues(updatedRows[rowIndex]);
  }

  setJointModal({ ...jointModal, material_items: updatedRows });
};

    const handleTableItemSelect = (rowIndex, colIndex, itemId) => {
        const updatedRows = [...jointModal.material_items];
        updatedRows[rowIndex][`item${colIndex}_id`] = itemId;

        // Reset size/thickness if item changed
        updatedRows[rowIndex].selected_size = '';
        updatedRows[rowIndex].selected_thickness = '';

        setJointModal({ ...jointModal, material_items: updatedRows });
    };

    const handleClear = () => {
        setJointModal({
            // area: '',
            // length:'',
            // inch_meter: '',
            material_items: [],
        });
        setDrawSpool({ spool_no: "", spool_no_id: "" });
        setSpoolId('');
        setError({});
        setShowForm(false);
    };

    const handleCloseModal = () => {
        handleClear();
        handleJointClose();
    };

    const handleSpoolChange = (e) => {
        setDrawSpool({ ...drawSpool, [e.target.name]: e.target.value });
        if (error.spool_no_err) setError({ ...error, spool_no_err: undefined });
    }

    const validateSpoolDetails = () => {
        let isValid = true;
        let err = {};
        if (!drawSpool.spool_no || drawSpool.spool_no.trim() === '') {
            isValid = false;
            err['spool_no_err'] = 'Spool No is required.';
        }
        setError(err);
        return isValid;
    };

    const handleAddSpoolNo = () => {
        if (validateSpoolDetails()) {
            const myurl = `${V_URL}/user/manage-spool-no-detail`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('drawing_id', drawId);
            bodyFormData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
            bodyFormData.append('spool_no', drawSpool.spool_no);

            axios({
                method: 'post',
                url: myurl,
                data: bodyFormData,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
            }).then((response) => {
                if (response.data.success) {
                    const newId = response.data?.data?._id;
                    toast.success(response.data.message);
                    setSpoolId(newId);
                    setDrawSpool(prev => ({ ...prev, spool_no_id: newId }));
                    setShowForm(true);
                    dispatch(getSpoolNo());
                }
                else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                console.log(error);
                toast.error(error.response?.data?.message || 'Something went wrong');
            });
        }
    };

    const validation = () => {
        let isValid = true;
        let err = {};

        if (!spoolId) {
            isValid = false;
            err.spool_no_err = 'Please add a Spool No first.';
        }
        // if (!jointModal.area) {
        //     isValid = false;
        //     err.area_err = 'Please enter Area.';
        // }
        //  if (!jointModal.length) {
        //     isValid = false;
        //     err.length_err = 'Please enter Length.';
        // }
        // if (!jointModal.inch_meter) {
        //     isValid = false;
        //     err.inch_meter_err = 'Please enter Inch Meter.';
        // }

        const materialItemErrors = {};
        jointModal.material_items.forEach((row, index) => {
            materialItemErrors[index] = {};
            if (!row.item1_id && !row.item2_id) {
                isValid = false;
                materialItemErrors[index].item_err = 'Select at least one Item.';
            }
            if (!row.joint_type) {
                isValid = false;
                materialItemErrors[index].joint_type_err = 'Required.';
            }

            if (!row.joint_no) {
                isValid = false;
                materialItemErrors[index].joint_no_err = 'Required.';
            }
            if (!row.sheet_no) {
                isValid = false;
                materialItemErrors[index].sheet_no_err = 'Required.';
            }
            if (!row.selected_size) {
                isValid = false;
                materialItemErrors[index].selected_size_err = 'Select Size.';
            }
            if (!row.selected_thickness) {
                isValid = false;
                materialItemErrors[index].selected_thickness_err = 'Select Thickness.';
            }
            if (Object.keys(materialItemErrors[index]).length === 0) {
                delete materialItemErrors[index];
            }
        });

        setError({ ...err, ...materialItemErrors });
        return isValid && Object.keys(materialItemErrors).length === 0;
    };


    const handleSubmit = (addMore) => {
        if (!validation()) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        const formattedMaterialItems = jointModal.material_items.map(row => ({
            material_item_id: [row.item1_id, row.item2_id].filter(Boolean),
            joint_no: row.joint_no,
            sheet_no: row.sheet_no,
            joint_type: row.joint_type,
            size: row.selected_size,
            thickness: row.selected_thickness,
            length: row.length,
            area: row.area,
            inch_meter: row.inch_meter,
        }));

        const payload = {

            drawing_id: drawId,
            project_id: localStorage.getItem("U_PROJECT_ID"),
            spool_no_id: drawSpool.spool_no_id || spoolId,
            material_items: formattedMaterialItems,
        };

        // 🔴 ONLY send _id when purely editing (not addMore)
        if (!addMore && jointEditData?._id) {
            payload._id = jointEditData._id;
        }

        handleSaveJointModal(payload, addMore, spoolId);

        if (addMore) {
            setJointModal({
                area: '',
                length: '',
                inch_meter: '',
                material_items: [],
            });
        } else {
            handleCloseModal();
        }
    };


    const addEmptyRow = () => {
        setJointModal({
            ...jointModal,
            material_items: [
                ...jointModal.material_items,
                {
                    item1_id: "",
                    item2_id: "",
                    joint_no: "",
                    sheet_no: "",
                    joint_type: "",
                    selected_size: "",
                    selected_thickness: "",
                    length: "",
                    area: "",
                    inch_meter: ""
                },
            ],
        });
    };

    // const getMaxSelectedSizeMM = () => {
    // let maxSize = 0;

    // jointModal.material_items.forEach(row => {
    //     const item =
    //         materialItems.find(it => it._id === row.item1_id) ||
    //         materialItems.find(it => it._id === row.item2_id);

    //     if (!item || !row.selected_size) return;

    //     const { size1, size2 } = item.item || {};

    //     if (size1?._id === row.selected_size && size1.size_mm) {
    //         maxSize = Math.max(maxSize, Number(size1.size_mm));
    //     }

    //     if (size2?._id === row.selected_size && size2.size_mm) {
    //         maxSize = Math.max(maxSize, Number(size2.size_mm));
    //     }
    // });

    // return maxSize;
    // };

    const getMaxSelectedSizeMM = () => {
        let maxSize = 0;

        jointModal.material_items.forEach(row => {
            const item =
                materialItems.find(it => it._id === row.item1_id) ||
                materialItems.find(it => it._id === row.item2_id);

            if (!item || !row.selected_size) return;

            const { size1, size2 } = item.item || {};

            if (size1?._id === row.selected_size) {
                maxSize = Math.max(maxSize, Number(size1.size_mm || 0));
            }

            if (size2?._id === row.selected_size) {
                maxSize = Math.max(maxSize, Number(size2.size_mm || 0));
            }
        });

        return maxSize;
    };

    //     const getMaxSelectedSizeInch = () => {
    //   let maxInch = 0;

    //   jointModal.material_items.forEach(row => {
    //     const item =
    //       materialItems.find(it => it._id === row.item1_id) ||
    //       materialItems.find(it => it._id === row.item2_id);

    //     if (!item || !row.selected_size) return;

    //     const { size1, size2 } = item.item || {};

    //     if (size1?._id === row.selected_size && size1.name) {
    //       maxInch = Math.max(maxInch, Number(size1.name));
    //     }

    //     if (size2?._id === row.selected_size && size2.name) {
    //       maxInch = Math.max(maxInch, Number(size2.name));
    //     }
    //   });

    //   return maxInch;
    // };

    const getMaxSelectedSizeInch = () => {
        let maxInch = 0;

        jointModal.material_items.forEach(row => {
            const item =
                materialItems.find(it => it._id === row.item1_id) ||
                materialItems.find(it => it._id === row.item2_id);

            if (!item || !row.selected_size) return;

            const { size1, size2 } = item.item || {};

            if (size1?._id === row.selected_size) {
                maxInch = Math.max(maxInch, Number(size1.name || 0));
            }

            if (size2?._id === row.selected_size) {
                maxInch = Math.max(maxInch, Number(size2.name || 0));
            }
        });

        return maxInch;
    };
    console.log("getMaxSelectedSizeMM================>", getMaxSelectedSizeMM);



    //     useEffect(() => {
    //     const length = Number(jointModal.length);
    //     console.log("length===========>",length);
    //     if (!length) return;

    //     const maxSizeMM = getMaxSelectedSizeMM();
    //     console.log("maxSizeMM=================>",maxSizeMM);
    //     if (!maxSizeMM) return;

    //     const area =
    //         3.14 * (maxSizeMM / 1000) * (length / 1000);
    //     console.log("area===============>",area);

    //     // const inch_meter =
    //     //     maxSizeMM * (length / 1000);
    //       const maxSizeInch = getMaxSelectedSizeInch();
    //   if (!maxSizeInch) return;
    //      const lengthMeter = length / 1000;
    //         const inch_meter = maxSizeInch * lengthMeter;
    //      console.log("inch_meter=========>",inch_meter);
    //     setJointModal(prev => ({
    //         ...prev,
    //         area: area.toFixed(3),
    //         inch_meter: inch_meter.toFixed(3),
    //     }));
    // }, [jointModal.length, jointModal.material_items]);

    return (
        <Modal
            show={show}
            onHide={handleCloseModal}
            size="xl"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Joint Wise Entry</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="joint-section">
                    <div className="row align-items-end mb-3">
                        <div className="col-md-4">
                            <UploadFile
                                url={`${V_URL}/user/import-joint-entry-items`}
                                pipingData={{
                                    drawing_id: drawId,
                                    spool_no_id: drawSpool.spool_no_id || spoolId,
                                    project_id: localStorage.getItem("U_PROJECT_ID"),
                                }}
                                onUploadSuccess={() => {
                                    dispatch(getJointEntryItems({ drawing_id: drawId }));
                                    handleJointClose();
                                }}
                            />
                        </div>
                    </div>
                    <div className="row align-items-end mb-3">

                        <div className="col-md-4">
                            <label className="form-label">
                                Spool No <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="spool_no"
                                value={drawSpool.spool_no}
                                onChange={handleSpoolChange}
                                readOnly={!!spoolId}
                            />
                            <small className="text-danger">{error.spool_no_err}</small>
                        </div>
                        <div className="col-md-4 d-flex justify-content-start">
                            <button
                                type="button"
                                className="btn btn-warning mt-4"
                                onClick={handleAddSpoolNo}
                                disabled={!!spoolId}
                            >
                                {spoolId ? 'Spool Added' : 'Add Joint Details'}
                            </button>
                        </div>
                    </div>

                    {showForm && (
                        <>


                            <div className="border rounded p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0 fw-bold">Joint Items</h6>
                                </div>

                                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className="table table-bordered text-center align-middle mb-0">
                                        <thead className="table-light sticky-top" style={{ top: 0 }}>
                                            <tr>
                                                <th>Sheet No</th>
                                                <th>Joint No</th>
                                                <th>Item-1</th>
                                                <th>Item-2</th>
                                                <th>Size</th>
                                                <th>Thickness</th>
                                                <th>Joint Type</th>
                                                <th>Length</th>
                                                <th>Area</th>
                                                <th>Inch/Meter</th>

                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jointModal.material_items.length > 0 ? (
                                                jointModal.material_items.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${error[rowIndex]?.sheet_no_err ? 'is-invalid' : ''}`}
                                                                value={row.sheet_no}
                                                                onChange={(e) => handleJointItemFieldChange(rowIndex, 'sheet_no', e.target.value)}
                                                            />
                                                            {error[rowIndex]?.sheet_no_err && (
                                                                <small className="text-danger">{error[rowIndex].sheet_no_err}</small>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                className={`form-control ${error[rowIndex]?.joint_no_err ? 'is-invalid' : ''}`}
                                                                value={row.joint_no}
                                                                onChange={(e) => handleJointItemFieldChange(rowIndex, 'joint_no', e.target.value)}
                                                            />
                                                            {error[rowIndex]?.joint_no_err && (
                                                                <small className="text-danger">{error[rowIndex].joint_no_err}</small>
                                                            )}
                                                        </td>

                                                        {/* {[1, 2].map((colIndex) => (
                                                            <td key={colIndex}>
                                                                <select
                                                                    className={`form-select ${error[rowIndex]?.item_err ? 'is-invalid' : ''}`}
                                                                    value={row[`item${colIndex}_id`] || ""}
                                                                    onChange={(e) => handleTableItemSelect(rowIndex, colIndex, e.target.value)}
                                                                >
                                                                    <option value="">Select Item</option>
                                                                    {materialItems.map((it, idx) => (
                                                                        <option key={idx} value={it._id}>
                                                                            {it.item?.item_name}
                                                                            (Size1:{it.item?.size1?.name || "N/A"} , Thk1:{it.item?.thickness1?.name || "N/A"} , Size2:{it.item?.size2?.name || "N/A"} , Thk2:{it.item?.thickness2?.name || "N/A"})
                                                                        </option>


                                                                    ))}
                                                                </select>
                                                                {colIndex === 1 && error[rowIndex]?.item_err && (
                                                                    <small className="text-danger">{error[rowIndex].item_err}</small>
                                                                )}
                                                            </td>
                                                        ))} */}

{[1, 2].map((colIndex) => {
  const isItem2 = colIndex === 2;

  const isFWFJ = ["FW", "FJ"].some(prefix =>
    (row.joint_no || "").trim().toUpperCase().startsWith(prefix)
  );

  return (
    <td key={colIndex}>
      <select
        className={`form-select ${error[rowIndex]?.item_err ? 'is-invalid' : ''}`}
        value={row[`item${colIndex}_id`] || ""}
      
        onChange={(e) =>
          handleTableItemSelect(rowIndex, colIndex, e.target.value)
        }
      >
        <option value="">Select Item</option>
        {materialItems.map((it, idx) => (
          <option key={idx} value={it._id}>
            {it.item?.item_name}
            (Size1:{it.item?.size1?.name || "N/A"} , Thk1:{it.item?.thickness1?.name || "N/A"} , Size2:{it.item?.size2?.name || "N/A"} , Thk2:{it.item?.thickness2?.name || "N/A"})
          </option>
        ))}
      </select>

    </td>
  );
})}

                                                        {/* Dynamic Size */}
                                                        <td>
                                                            {/* <select
                                                                className={`form-select ${error[rowIndex]?.selected_size_err ? 'is-invalid' : ''}`}
                                                                value={row.selected_size || ""}
                                                                onChange={(e) => handleJointItemFieldChange(rowIndex, 'selected_size', e.target.value)}
                                                            >
                                                                <option value="">Select Size</option>
                                                                {(() => {
                                                                    const item = materialItems.find(it => it._id === row.item1_id) || materialItems.find(it => it._id === row.item2_id);
                                                                   console.log("item  ======= >");
                                                                    if (!item) return null;
                                                                    const options = [];
                                                                   
                                                                // if (item.item?.size1) options.push({ label: item.item.size1.name, value: item.item.size1._id });
 if (item.item?.size1) {
        options.push({
          label: `(${item.item.size1.name} Inch)  (${item.item.size1.size_mm} mm)`,
          value: item.item.size1._id
        });
      }
                                                            // if (item.item?.size2)
                                                            //     options.push({ label: item.item.size2.name, value: item.item.size2._id });

                                                             if (item.item?.size2) {
        options.push({
          label: `(${item.item.size2.name} Inch)  (${item.item.size2.size_mm} mm)`,
          value: item.item.size2._id
        });
      }
                                                                    return options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>);
                                                                })()}
                                                            </select> */}
                                                            <select
                                                                className={`form-select ${error[rowIndex]?.selected_size_err ? 'is-invalid' : ''}`}
                                                                value={row.selected_size || ""}
                                                                onChange={(e) =>
                                                                    handleJointItemFieldChange(rowIndex, "selected_size", e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select Size</option>

                                                                {(() => {
                                                                    const item1 = materialItems.find(it => it._id === row.item1_id);
                                                                    const item2 = materialItems.find(it => it._id === row.item2_id);

                                                                    const options = [];

                                                                    if (item1?.item?.size1) {
                                                                        options.push({
                                                                            label: `(${item1.item.size1.name} Inch) (${item1.item.size1.size_mm} mm)`,
                                                                            value: item1.item.size1._id
                                                                        });
                                                                    }

                                                                    if (item1?.item?.size2) {
                                                                        options.push({
                                                                            label: `(${item1.item.size2.name} Inch) (${item1.item.size2.size_mm} mm)`,
                                                                            value: item1.item.size2._id
                                                                        });
                                                                    }

                                                                    if (item2?.item?.size1) {
                                                                        options.push({
                                                                            label: `(${item2.item.size1.name} Inch) (${item2.item.size1.size_mm} mm)`,
                                                                            value: item2.item.size1._id
                                                                        });
                                                                    }

                                                                    if (item2?.item?.size2) {
                                                                        options.push({
                                                                            label: `(${item2.item.size2.name} Inch) (${item2.item.size2.size_mm} mm)`,
                                                                            value: item2.item.size2._id
                                                                        });
                                                                    }

                                                                    // remove duplicate sizes
                                                                    const uniqueOptions = options.filter(
                                                                        (v, i, a) => a.findIndex(t => t.value === v.value) === i
                                                                    );

                                                                    return uniqueOptions.map(opt => (
                                                                        <option key={opt.value} value={opt.value}>
                                                                            {opt.label}
                                                                        </option>
                                                                    ));
                                                                })()}
                                                            </select>
                                                            {error[rowIndex]?.selected_size_err && (
                                                                <small className="text-danger">{error[rowIndex].selected_size_err}</small>
                                                            )}
                                                        </td>

                                                        {/* Dynamic Thickness */}
                                                        <td>
                                                            <select
                                                                className={`form-select ${error[rowIndex]?.selected_thickness_err ? 'is-invalid' : ''}`}
                                                                value={row.selected_thickness || ""}
                                                                onChange={(e) =>
                                                                    handleJointItemFieldChange(rowIndex, "selected_thickness", e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select Thickness</option>

                                                                {(() => {
                                                                    const item1 = materialItems.find(it => it._id === row.item1_id);
                                                                    const item2 = materialItems.find(it => it._id === row.item2_id);

                                                                    const options = [];

                                                                    const pushThickness = (item) => {
                                                                        if (!item) return;

                                                                        const { size1, size2, thickness1, thickness2 } = item.item || {};

                                                                        if (row.selected_size === size1?._id && thickness1) {
                                                                            options.push({
                                                                                label: thickness1.name,
                                                                                value: thickness1._id
                                                                            });
                                                                        }

                                                                        if (row.selected_size === size2?._id && thickness2) {
                                                                            options.push({
                                                                                label: thickness2.name,
                                                                                value: thickness2._id
                                                                            });
                                                                        }
                                                                    };

                                                                    pushThickness(item1);
                                                                    pushThickness(item2);

                                                                    // remove duplicates
                                                                    const uniqueOptions = options.filter(
                                                                        (v, i, a) => a.findIndex(t => t.value === v.value) === i
                                                                    );

                                                                    return uniqueOptions.map(opt => (
                                                                        <option key={opt.value} value={opt.value}>
                                                                            {opt.label}
                                                                        </option>
                                                                    ));
                                                                })()}
                                                            </select>

                                                            {/* <select
    className={`form-select ${error[rowIndex]?.selected_thickness_err ? 'is-invalid' : ''}`}
    value={row.selected_thickness || ""}
    onChange={(e) => handleJointItemFieldChange(rowIndex, 'selected_thickness', e.target.value)}
>
    <option value="">Select Thickness</option>

    {(() => {
        const item =
            materialItems.find(it => it._id === row.item1_id) ||
            materialItems.find(it => it._id === row.item2_id);

        if (!item) return null;

        const { size1, size2, thickness1, thickness2 } = item.item || {};

        // show thickness1 only when size1 is selected
        if (row.selected_size === size1?._id && thickness1) {
            return (
                <option value={thickness1._id}>{thickness1.name}</option>
            );
        }

        // show thickness2 only when size2 is selected
        if (row.selected_size === size2?._id && thickness2) {
            return (
                <option value={thickness2._id}>{thickness2.name}</option>
            );
        }

        return null;
    })()}
</select> */}


                                                            {error[rowIndex]?.selected_thickness_err && (
                                                                <small className="text-danger">{error[rowIndex].selected_thickness_err}</small>
                                                            )}
                                                        </td>

                                                        <td>
                                                            <select
                                                                className={`form-select ${error[rowIndex]?.joint_type_err ? 'is-invalid' : ''}`}
                                                                value={row.joint_type || ""}
                                                                onChange={(e) => handleJointItemFieldChange(rowIndex, 'joint_type', e.target.value)}
                                                            >
                                                                <option value="">Select Joint Type</option>
                                                                {jointTypes.map((jt) => (
                                                                    <option key={jt._id} value={jt._id}>{jt.name}</option>
                                                                ))}
                                                            </select>
                                                            {error[rowIndex]?.joint_type_err && (
                                                                <small className="text-danger">{error[rowIndex].joint_type_err}</small>
                                                            )}
                                                        </td>
                                                        <td>

                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={row.length}
                                                                onChange={(e) =>
                                                                    handleJointItemFieldChange(rowIndex, "length", e.target.value)
                                                                }
                                                            />

                                                        </td>
                                                        <td>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={row.area}
                                                                readOnly
                                                            />


                                                        </td>
                                                        <td>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={row.inch_meter}
                                                                readOnly
                                                            />

                                                        </td>
                                                        <td className="text-center">
                                                            {rowIndex === jointModal.material_items.length - 1 && (
                                                                <a onClick={addEmptyRow} style={{ cursor: "pointer" }}>
                                                                    <Plus color="#28a745" size={18} />
                                                                </a>
                                                            )}
                                                            <a
                                                                onClick={() => {
                                                                    const updatedRows = jointModal.material_items.filter((_, i) => i !== rowIndex);
                                                                    setJointModal({ ...jointModal, material_items: updatedRows });
                                                                }}
                                                                style={{ cursor: "pointer" }}

                                                            >
                                                                <Trash2 color="#dc3545" size={18} />
                                                            </a>

                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="11">
                                                        <button className="btn btn-sm btn-success" onClick={addEmptyRow}>
                                                            + Add Row
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                        </>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)}>
                    Save
                </button>
                {/* <button type="button" className="btn btn-success" onClick={() => handleSubmit(true)}>
                    Save & Add More
                </button> */}
            </Modal.Footer>
        </Modal>
    );
};

export default JointEntryModal;
