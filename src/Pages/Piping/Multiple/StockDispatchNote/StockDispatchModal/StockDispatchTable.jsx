import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMultiDispatchNotes } from '../../../../../Store/MutipleDrawing/DispatchNote/GetMultiDispatch';
import { getUserPaintSystemPiping } from '../../../../../Store/Piping/PaintSystem/PaintSystem';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getUserGenInspectionSummary } from '../../../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';
import { fetchPipingIssueDrawingIds } from '../../../../../Store/Piping/DrawingIssueAcc/getDrawingIssueAcc';
import {getDispatchNoteItemFromStockIssueAcc} from '../../../../../Store/Piping/StockDispatchNote/getDispatchNoteItemFromStockIssueAcc';
import DispatchNoteSectionDetailModal from "./StockDispatchNoteSectionDetailModal";
import { getItemDetails } from '../../../../../Store/Piping/Item/Item';
import { getUserPipingClassMaster } from "../../../../../Store/Piping/PipingClass/PipingClassMaster";


const DispatchTable = ({ data, finalArr, submitArr,   setFinalArr, setSubmitArr }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({ remarks: '' });
    const [paintRequirements, setPaintRequirements] = useState([]);
    const [paintShades, setPaintShades] = useState([]);
    const [selectedDispatchNoteSecationDetail, setSelectedDispatchNoteSecationDetail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [availableServices, setAvailableServices] = useState([]);
    const itemData = useSelector((state) => state?.getItemDetails?.user?.data?.data);
    const pipingClassData = useSelector((state) => state?.getUserPipingClassMaster?.user?.data || []);
    const paints = useSelector(state => state?.getUserPaintSystemPiping?.user?.data);
    const getMultiDispatch = useSelector(state => state?.getMultiDispatch?.user?.data);

    // Fetch dispatch and paint system data
    // useEffect(() => {
    //     getDispatchOfferTable();
    // }, [localStorage.getItem('U_PROJECT_ID'), localStorage.getItem('issue_acc_ids'), localStorage.getItem('ndt_master_ids'), finalArr]);

    const projectId = localStorage.getItem('U_PROJECT_ID');

useEffect(() => {
  getDispatchOfferTable();
}, [projectId, finalArr]);

    const fetchDispatchOfferTableFromApi = async () => {
        try {
            const res = await axios.post(
                `${V_URL}/user/piping-list-multi-stock-dispatch-offer`,
                  {
                project_id: projectId   // ✅ send here
            },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
                    }
                }
            );

            if (res.data?.success && Array.isArray(res.data.data)) {
                // Transform API data into table-friendly format
                // const tableRes = res.data.data.map(item => ({
                //     _id: item._id,
                   
                //     item_name: item.item_name || '-',
                //     material_grade: item.material_grade || '-',
                //     size1: item.size1 || '-',
                //     thickness1: item.thickness1 || '-',
                //     size2: item.size2 || '-',
                //     thickness2: item.thickness2 || '-',
                //     uom: item.uom || '-', // not provided in API
                //     qty: item.total_qty || 0,
                //     piping_class_id: item.piping_class?._id || '-',  // Safely access _id
                //     piping_class: item.piping_class?.name || '-',   // Safely access name
                //     service_id: item.service_id || '-', // not provided in API
                //     PipingMaterialSpecification: item.piping_material_specification || { name: '-' }, // from API
                //     shadeRalNo: item.shadeRalNo || '-', // not provided
                //     final_coat_shade_name: item.final_coat_shade_id?.name || '-',
                //     final_coat_shade_id: item.final_coat_shade_id || null, // preserve the object or ID
                //     service_name: item.service_name || null,
                //     paint_system: item.paint_system?.name || null,
                //     paint_system_id: item.paint_system?._id || null,
                //     area_sqm: item.area_sqm,
                //     area: item.area,
                //     remarks: item.remarks || '',
                //     item_id: item.item_detail_id || item.item_id || null,
                //      data: item.items || item.data || [], 
                //     source: item?.source || '', // to track origin of data
                //     issue_id: item.issue_id || null, // for future use if needed
                //     item_detail_id: item.item_detail_id || item.item_id || null, // FIX: Keep for edit/update logic
                // }));
const tableRes = res.data.data.map(item => {
    console.log("Dispatch Offer Item:", item); // 👈 add this

    return {
        _id: item._id,
        item_name: item.item_name || '-',
        material_grade: item.material_grade || '-',
        size1: item.size1 || '-',
        thickness1: item.thickness1 || '-',
        size2: item.size2 || '-',
        thickness2: item.thickness2 || '-',
        uom: item.uom || '-',
        qty: item.total_qty || 0,
        piping_class_id: item.piping_class?._id || '-',
        piping_class: item.piping_class?.name || '-',
        service_id: item.service_id || '-',
        PipingMaterialSpecification: item.piping_material_specification || { name: '-' },
        shadeRalNo: item.shadeRalNo || '-',
        final_coat_shade_name: item.final_coat_shade_id?.name || '-',
        final_coat_shade_id: item.final_coat_shade_id || null,
        service_name: item.service_name || null,
        paint_system: item.paint_system?.name || null,
        paint_system_id: item.paint_system?._id || null,
        area_sqm: item.area_sqm,
        area: item.area,
        remarks: item.remarks || '',
        item_id: item.item_detail_id || item.item_id || null,
        data: item.items || item.data || [],
        source: item?.source || '',
        issue_id: item.issue_id || null,
        item_detail_id: item.item_detail_id || item.item_id || null,
    };
});
console.log("tableRes===>",tableRes);
                setTableData(tableRes);
                setSubmitArr(tableRes);
                setTotalItems(tableRes.length);
            } else {
                setTableData([]);
                setSubmitArr([]);
                setTotalItems(0);
            }
        } catch (err) {
            toast.error("Failed to load Dispatch Offer Data");
            console.error(err);
        }
    };

    const onRefresh = async () => {
      try {
        // await dispatch(getUserGenInspectionSummary());
        await dispatch(fetchDispatchOfferTableFromApi());
      } catch (error) {
        console.error("Failed to refresh dispatch table", error);
      }
    };


    const getDispatchOfferTable = () => {
        dispatch(getUserGenInspectionSummary());
        dispatch(getMultiDispatchNotes());
        dispatch(getUserPaintSystemPiping({ status: '' }));
        dispatch(getItemDetails({ is_main: false }));
        dispatch(getUserPipingClassMaster({status: 1, project: localStorage.getItem("U_PROJECT_ID"),}));
        fetchPaintShades();
        fetchDispatchOfferTableFromApi();
    };

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

    // Fetch piping final coat shades
    const fetchPaintShades = async () => {
        try {
             const payload = {
            project: localStorage.getItem("U_PROJECT_ID") // use your actual key name
        };
            const res = await axios.post(`${V_URL}/user/get-all-final-coat-shade`, payload, {
                headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") }
            });
            const shadesArray = res.data?.data?.data;

            if (res.data?.success && Array.isArray(shadesArray)) {
                setPaintShades(shadesArray);
            } else {
                setPaintShades([]);
            }
        } catch (error) {
            toast.error("Failed to load Final Coat Shades");
        }
    };
console.log("fetchPaintShades=======>",fetchPaintShades);
    // Update table data when submitArr changes
    useEffect(() => {
        if (submitArr?.length > 0) {
            setTableData(submitArr);
        } else {
            setTableData([]);
        }
    }, [submitArr]);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    // 🔹 Piping Class Change
    if (name === "piping_class") {
        const selectedClass = pipingClassData.find(
            (p) => String(p._id) === String(value)
        );

        const services = selectedClass?.Items || [];

        setAvailableServices(services);

        setEditFormData((prev) => ({
            ...prev,
            piping_class: value,
            service_id: "",
            service: "",
            PipingMaterialSpecification: {},
                    shadeRalNo: ""   
        }));

        return;
    }

    // 🔹 Service Change
    if (name === "service_id") {
        const selectedService = availableServices.find(
            (item) => String(item._id) === String(value)
        );
 const shadeObj = paintShades.find(
        (shade) => String(shade.service) === String(value)
    );
        setEditFormData((prev) => ({
            ...prev,
            service_id: value,
            service: selectedService?.service || "",
            PipingMaterialSpecification:
                selectedService?.PipingMaterialSpecification || {},
                 piping_material_specification:
            selectedService?.PipingMaterialSpecification || null,
                 shadeRalNo: shadeObj || null
        }));

        return;
    }

    // 🔹 Default
    setEditFormData((prev) => ({
        ...prev,
        [name]: value
    }));
};

    const handleSaveClick = async () => {
        const updatedData = [...tableData];
        const dataIndex = (currentPage - 1) * limit + editRowIndex;
        // updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };

        const existing = updatedData[dataIndex];

if (existing.spool_no_id && existing.spool_no_id !== '-') {
    existing.area = editFormData.area;
} else {
    existing.area_sqm = editFormData.area_sqm;
}

existing.remarks = editFormData.remarks;

updatedData[dataIndex] = existing;
        setTableData(updatedData);
        setSubmitArr(updatedData);

        const updatedItem = updatedData[dataIndex];
        if (!updatedItem) return;

     

        const bodyFormData = new URLSearchParams();
        // bodyFormData.append('items', JSON.stringify(items)); // now includes item_detail_id
        bodyFormData.append('id', updatedItem._id);
       bodyFormData.append('item_id', updatedItem.item_detail_id || updatedItem.item_id);
        bodyFormData.append('piping_class', editFormData.piping_class);

        bodyFormData.append('service_id', editFormData.service_id);

        bodyFormData.append('piping_material_specification_id', editFormData.piping_material_specification?._id);

        bodyFormData.append('final_coat_shade_id',editFormData.shadeRalNo?._id);

       bodyFormData.append('area_sqm',updatedItem.area_sqm);
       bodyFormData.append('remarks', updatedItem.remarks);

        // Remove item_detail_id from outside
        // bodyFormData.append('item_detail_id', updatedItem.item_detail_id || updatedItem.item_id); <-- no longer needed



        try {
            const response = await axios.post(`${V_URL}/user/piping-update-multi-stock-dispatch-offer`, bodyFormData, {
                headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setEditRowIndex(null);
                setShowModal(false);
                setSelectedDispatchNoteSecationDetail(null);
                onRefresh();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    const handleCancelClick = () => setEditRowIndex(null);

    const commentsData = useMemo(() => {
        let computedComments = tableData;
        if (search) {
            computedComments = computedComments.filter(dr =>
                dr?.drawing_no?.toString()?.toLowerCase()?.includes(search) ||
                dr?.rev?.toString()?.toLowerCase()?.includes(search) ||
                dr?.assembly_no?.toString()?.toLowerCase()?.includes(search) ||
                dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search) ||
                dr?.unit?.toLowerCase()?.includes(search) ||
                dr?.sheet_no?.toLowerCase()?.includes(search)
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice((currentPage - 1) * limit, (currentPage - 1) * limit + limit);
    }, [limit, search, currentPage, tableData]);
console.log("commentsData==========>",commentsData);
   const handleEditClick = (index, row) => {
    setEditRowIndex(index);

    const selectedClass = pipingClassData.find(
        (p) => String(p._id) === String(row.piping_class_id)
    );

    const services = selectedClass?.Items || [];

    setAvailableServices(services);

    setEditFormData({
        _id: row._id,
        piping_class: row.piping_class_id || '',
        service_id: row.service_id || '',
        service: row.service_id?.name || '',
        PipingMaterialSpecification: row.PipingMaterialSpecification || {},
         shadeRalNo: row.shadeRalNo || '', 
        area_sqm: row.area_sqm || '',
        remarks: row.remarks || ''
    });
    
};

const handleRemoveByDrawing = async (elem) => {
    try {
        const response = await axios.post(
            `${V_URL}/user/piping-delete-multi-stock-dispatch-offer`,
            new URLSearchParams({ id: elem._id }),
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN')
                }
            }
        );

        if (response.data.success) {
            toast.success("Item has been removed!");

            // ✅ REMOVE FROM submitArr (table)
            const updatedSubmitArr = submitArr.filter(item => item._id !== elem._id);
            setSubmitArr(updatedSubmitArr);

            // ✅ REMOVE FROM finalArr (VERY IMPORTANT)
            const updatedFinalArr = finalArr.filter(d => {
                if (elem.spool_no_id && elem.spool_no_id !== '-') {
                    return !(
                        d.drawing_id === elem.drawing_id &&
                        d.spool_no_id === elem.spool_no_id
                    );
                } else {
                    return d.drawing_id !== elem.drawing_id;
                }
            });

            // 🔥 update parent state (you need to pass setter)
            if (typeof setFinalArr === "function") {
                setFinalArr(updatedFinalArr);
            }

            dispatch(getDispatchNoteItemFromStockIssueAcc({
                  project_id: localStorage.getItem('U_PROJECT_ID'),
                  page: currentPage,
                  limit: limit,
                }));
            // optional refresh
            getDispatchOfferTable();

        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove item");
    }
};
    const paintShadeMap = useMemo(() => {
    const map = {};
    paintShades.forEach(shade => {
        map[String(shade.service)] = shade.shadeRalNo;
    });
    return map;
    }, [paintShades]);

    console.log("Paint shades:", paintShades);


const getDisplayArea = (row) => {
  return row?.spool_no_id && row?.spool_no_id !== '-'
    ? row?.area
    : row?.area_sqm;
};
    return (
        <div className='row'>
            <div className="col-sm-12">
                <div className="card card-table show-entire">
                    <div className="card-body">
                        <div className="page-table-header mb-2">
                            <div className="row align-items-center">
                                <div className="col">
                                    <div className="doctor-table-blk">
                                        <h3>Section Details List</h3>
                                        <div className="doctor-search-blk"> 
                                            <div className="top-nav-search table-search-blk">
                                                <Search
                                                    onSearch={value => {
                                                        setSearch(value.toLowerCase());
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            </div>
                                            {/* <div className="add-group">
                                                <button className="btn btn-primary add-pluss ms-2" onClick={() => { setSelectedDispatchNoteSecationDetail(null); setShowModal(true); }}>
                                                    <img src="/assets/img/icons/plus.svg" alt="plus" />                                       
                                                </button>
                                            </div> */}
                                        </div>                                        
                                    </div>
                                </div>
                                <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                    <DropDown limit={limit} onLimitChange={val => setLimit(val)} />
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive mt-2">
                            <table className="table border-0 custom-table comman-table mb-0">
                                <thead>
                                    <tr>
                                        <th>Sr.</th>
                                        <th>Item</th>
                                       
                                        <th>Size1</th>
                                        <th>Thickness1</th>
                                        <th>Size2</th>
                                        <th>Thickness2</th>
                                        <th>Material Grade</th>
                                        <th>UOM</th>
                                        <th>Qty</th>
                                       <th>Area (SQM)</th>
                                        <th>Piping Class</th>
                                        <th>Service</th>
                                        <th>Piping Material Specification</th>
                                        <th>Final Coat Ral No.</th>
                                        {/* <th>Paint System No.</th> */}
                                        <th>Remarks</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commentsData.length === 0 && (
                                        <tr>
                                            <td colSpan="999" className="no-table-data">No Data Found!</td>
                                        </tr>
                                    )}
                                    {commentsData.map((elem, i) => {
                                        const pipingClass = pipingClassData.find(
                                            pc => pc._id === elem.piping_class_id
                                        );
                                        // console.log("Piping Class:", pipingClass);
                                        const services = pipingClass?.Items?.map(item => ({
                                            service: item.service,
                                            id: item._id,
                                            PipingMaterialSpecification: item.PipingMaterialSpecification, // include spec
                                            shadeRalNo: item.shadeRalNo // include RAL number
                                        })) || [];

                                        // console.log("Services:", services);

                                        return (
                                           <tr
  key={i}
  onClick={() => {
    if (editRowIndex !== i) handleEditClick(i, elem);
  }}
  style={{ cursor: "pointer" }}
>
                                                <td>{i + 1}</td>
                                                <td>{elem?.item_name || '-'}</td>
                                                <td>{elem?.size1 || '-'}</td>
                                                <td>{elem?.thickness1 || '-'}</td>
                                                <td>{elem?.size2 || '-'}</td>
                                                <td>{elem?.thickness2 || '-'}</td>
                                                <td>{elem?.material_grade || '-'}</td>
                                                <td>{elem?.uom || '-'}</td>
                                                <td>{elem?.qty || '-'}</td>
                                                 <td>
  {editRowIndex === i ? (
    <textarea
      className="form-control"
      rows={1}
      name="area_sqm"
      value={editFormData.area_sqm || ''}
      onChange={handleEditFormChange}
    />
  ) : (
    <span>{elem?.area_sqm || '-'}</span>
  )}
</td>
                                              <td>
  {editRowIndex === i ? (
    <select
      className="form-control"
      name="piping_class"
      value={editFormData.piping_class || ''}
      onChange={handleEditFormChange}
    >
      <option value="">-- Select --</option>
      {pipingClassData.map(pc => (
        <option key={pc._id} value={pc._id}>
          {pc.PipingClass}
        </option>
      ))}
    </select>
  ) : (
    <span>
      {elem?.piping_class || '-'}
    </span>
  )}
</td>    
                                               <td>
  {editRowIndex === i ? (
    <select
      className="form-control"
      name="service_id"
      value={editFormData.service_id || ''}
      onChange={handleEditFormChange}
    >
      <option value="">-- Select Service --</option>
      {availableServices.map(service => (
        <option key={service._id} value={service._id}>
          {service.service}
        </option>
      ))}
    </select>
  ) : (
    elem?.service_name || '-'
  )}
</td>
                                               <td>
  {editRowIndex === i ? (
    <input
      className="form-control"
    //   value={editFormData.PipingMaterialSpecification?.name || ''}
      value={editFormData.piping_material_specification?.name || ''}
      disabled
    />
  ) : (
    elem?.PipingMaterialSpecification?.name || '-'
  )}
</td>
                                               <td>
  {editRowIndex === i ? (
    <input
      className="form-control"
      value={editFormData.shadeRalNo?.shadeRalNo || ''}
      disabled   // auto-filled
    />
  ) : (
    elem?.final_coat_shade_name || '-'
    
  )}
</td>
                                                {!data?._id ? (
                                                    editRowIndex === i ? (
                                                        <>
                                                          
                                                           <td>
  {editRowIndex === i ? (
    <textarea
      className="form-control"
      rows={1}
      name="remarks"
      value={editFormData.remarks || ''}
      onChange={handleEditFormChange}
    />
  ) : (
    <span>
      {elem?.remarks || '-'}
    </span>
  )}
</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* <td onClick={() => handleEditClick(i, elem)}>{elem?.paint_system_no || elem?.paint_system || '-'}</td> */}
                                                            <td>{elem?.remarks || '-'}</td>
                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <td>{elem?.paint_system_no || '-'}</td>
                                                        <td>{elem?.remarks || '-'}</td>
                                                    </>
                                                )}
                                                {editRowIndex === i ? (
                                                    <td>
                                                        <button className='btn btn-success p-1 mx-1' onClick={(e) => {
    e.stopPropagation();
    handleSaveClick();
  }}><Save /></button>
                                                        <button className='btn btn-secondary p-1 mx-1'  onClick={(e) => {
    e.stopPropagation();
    handleCancelClick();
  }}><X /></button>
                                                    </td>
                                                ) : (
                                                    <td className='text-end'>
                                                        {!data?._id && <button className="btn btn-danger p-1 mx-1" onClick={() => handleRemoveByDrawing(elem)}>Remove</button>}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                              

                            </table>
                        </div>

                        <div className="row align-center mt-3 mb-2">
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                <div className="dataTables_info">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                <Pagination
                                    total={totalItems}
                                    itemsPerPage={limit}
                                    currentPage={currentPage}
                                    onPageChange={page => setCurrentPage(page)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DispatchNoteSectionDetailModal
                show={showModal}
                // handleClose={() => { setShowModal(false); setSelectedDispatchNoteSecationDetail(null); }}
                // // handleSave={handleSave}
                 handleClose={() => {
                    setShowModal(false);
                    setSelectedDispatchNoteSecationDetail(null);
                }}
                handleSave={() => {
                    setShowModal(false);
                    setSelectedDispatchNoteSecationDetail(null);
                    onRefresh();     // ✅ refresh comes from ManageDispatch
                }}
                itemData={itemData}
                pipingClassData={pipingClassData}
                paintShades={paintShades}
                paintRequirements={paintRequirements}
                editData={selectedDispatchNoteSecationDetail}
            />
        </div>
        
    );
};

export default DispatchTable;
