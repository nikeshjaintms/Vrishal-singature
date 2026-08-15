import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMultiDispatchNotes } from '../../../../../Store/MutipleDrawing/DispatchNote/GetMultiDispatch';
import { getUserPaintSystem } from '../../../../../Store/Store/PaintSystem/PaintSystem';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { getUserGenInspectionSummary } from '../../../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';
import { fetchPipingIssueDrawingIds } from '../../../../../Store/Piping/DrawingIssueAcc/getDrawingIssueAcc';
import DispatchNoteSectionDetailModal from "../DispatchModal/DispatchNoteSectionDetailModal";
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
    
    const itemData = useSelector((state) => state?.getItemDetails?.user?.data?.data);
    const pipingClassData = useSelector((state) => state?.getUserPipingClassMaster?.user?.data || []);
    const paints = useSelector(state => state?.getUserPaintSystem?.user?.data);
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
                `${V_URL}/user/piping-list-multi-dispatch-offer`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN")
                    }
                }
            );

            if (res.data?.success && Array.isArray(res.data.data)) {
                // Transform API data into table-friendly format
                const tableRes = res.data.data.map(item => ({
                    _id: item._id,
                    drawing_no: item.drawing_no || '-',
                    drawing_id: item.drawing_id || '-',
                    spool_no: item.spool_no || '-',
                    spool_no_id: item.spool_no_id || item.spool_id || '-',
                    rev: item.rev || '-', // not provided in API
                    item_name: item.item_name || '-',
                    size1: item.size1 || '-',
                    thickness1: item.thickness1 || '-',
                    size2: item.size2 || '-',
                    thickness2: item.thickness2 || '-',
                    uom:  item.spool_id && item.spool_id !== '-' ? 'NOS' : item.uom || '-', // not provided in API
                    qty: item.qty || 0,
                    piping_class_id: item.piping_class?._id || '-',  // Safely access _id
                    piping_class: item.piping_class?.name || '-',   // Safely access name
                    service_id: item.service_id || '-', // not provided in API
                    PipingMaterialSpecification: item.piping_material_specification || { name: '-' }, // from API
                    shadeRalNo: item.shadeRalNo || '-', // not provided
                    paint_system: item.paint_system?.name || null,
                    paint_system_id: item.paint_system?._id || null,
                    area_sqm: item.area_sqm,
                    area: item.area,
                    remarks: item.remarks || '',
                    item_detail_id: item.item_id,
                    material_item_id: item.material_item_id,
                    source: item?.source || '', // to track origin of data
                    fd_id: item.fd_id || null, // for future use if needed
                    pressure_test_id : item.pressure_test_id || null, // for future use if needed
                    issue_id: item.issue_id || null, // for future use if needed
                }));

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
        dispatch(getUserPaintSystem({ status: '' }));
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
            const res = await axios.post(`${V_URL}/user/get-all-final-coat-shade`, {}, {
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
        // if (name === 'paint_system') {
        //     const selectedPaint = paints.find(p => p._id === value);
        //     setEditFormData({
        //         ...editFormData,
        //         paint_system: value,
        //         paint_system_no: selectedPaint ? selectedPaint.paint_system_no : ''
        //     });
        // } else {
            setEditFormData({ ...editFormData, [name]: value });
        // }
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

        // const items = {
        //     item_detail_id: updatedItem.item_detail_id,  // required
        //     material_item_id: updatedItem.material_item_id,  // required
        //     // service_id: updatedItem.service_id,
        //     area_sqm: updatedItem.area_sqm,
        //     // paint_system: updatedItem.paint_system,
        //     remarks: updatedItem.remarks
        // };
const items = {
    item_detail_id: updatedItem.item_detail_id,
    material_item_id: updatedItem.material_item_id,
    remarks: updatedItem.remarks
};

if (updatedItem.spool_no_id && updatedItem.spool_no_id !== '-') {
    items.area = updatedItem.area;
} else {
    items.area_sqm = updatedItem.area_sqm;
}
        const bodyFormData = new URLSearchParams();
        bodyFormData.append('items', JSON.stringify(items)); // now includes item_detail_id
        bodyFormData.append('id', updatedItem._id);

        // Remove item_detail_id from outside
        // bodyFormData.append('item_detail_id', updatedItem.item_detail_id); <-- no longer needed



        try {
            const response = await axios.post(`${V_URL}/user/piping-update-multi-dispatch-offer`, bodyFormData, {
                headers: { Authorization: "Bearer " + localStorage.getItem("PAY_USER_TOKEN") }
            });
            if (response.data.success) {
                toast.success("Item updated successfully");
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
        setEditFormData({
             area: row?.area || '',
        area_sqm: row?.area_sqm || '',
            paint_system: row.paint_system,
            paint_system_no: paints.find(w => w._id === row.paint_system)?.paint_system || '',
            remarks: row.remarks
        });
    };

    // const handleRemoveByDrawing = async (elem) => {
    //     try {
    //         const response = await axios.post(`${V_URL}/user/piping-delete-multi-dispatch-offer`, new URLSearchParams({ id: elem._id }), {
    //             headers: { Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
    //         });
    //         if (response.data.success) {
    //             toast.success("Item has been removed!");
    //             getDispatchOfferTable();
    //         } else {
    //             toast.error(response.data.message);
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Failed to remove item");
    //     }
    // };
    
const handleRemoveByDrawing = async (elem) => {
    try {
        const response = await axios.post(
            `${V_URL}/user/piping-delete-multi-dispatch-offer`,
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

            dispatch(fetchPipingIssueDrawingIds({
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
                                            <div className="add-group">
                                                <button className="btn btn-primary add-pluss ms-2" onClick={() => { setSelectedDispatchNoteSecationDetail(null); setShowModal(true); }}>
                                                    <img src="/assets/img/icons/plus.svg" alt="plus" />                                       
                                                </button>
                                            </div>
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
                                        <th>Drawing No.</th>
                                        <th>Rev</th>
                                        <th>Item</th>
                                        <th>Spool No</th>
                                        <th>Size1</th>
                                        <th>Thickness1</th>
                                        <th>Size2</th>
                                        <th>Thickness2</th>
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
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{elem?.drawing_no || '-'}</td>
                                                <td>{elem?.rev || '-'}</td>
                                                <td>{elem?.item_name || '-'}</td>
                                                <td>{elem?.spool_no || '-'}</td>
                                                <td>{elem?.size1 || '-'}</td>
                                                <td>{elem?.thickness1 || '-'}</td>
                                                <td>{elem?.size2 || '-'}</td>
                                                <td>{elem?.thickness2 || '-'}</td>
                                                <td>{elem?.uom || '-'}</td>
                                                <td>{elem?.qty || '-'}</td>
                                                {/* <td>{getDisplayArea(elem) || '-'}</td> */}

                                                {!data?._id ? (
                                                    editRowIndex === i ? (
                                                    <>
                                                      <td>
  {editRowIndex === i ? (
    <textarea
      className="form-control"
      rows={1}
      name={elem?.spool_no_id && elem?.spool_no_id !== '-' ? 'area' : 'area_sqm'}
      value={
        elem?.spool_no_id && elem?.spool_no_id !== '-'
          ? editFormData.area
          : editFormData.area_sqm
      }
      onChange={handleEditFormChange}
    />
  ) : (
    <span onClick={() => handleEditClick(i, elem)}>
      {getDisplayArea(elem) || '-'}
    </span>
  )}
</td>
                                                    </>
                                                    ) : (
                                                        <>
                                                          <td onClick={() => handleEditClick(i, elem)}>
  {getDisplayArea(elem) || '-'}
</td>
                                                        </>
                                                    )
                                                    ) : (
                                                    <>
                                                       <td>{getDisplayArea(elem) || '-'}</td>
                                                    </>
                                                )}
                                                <td>{elem?.piping_class || elem?.PipingClass || '-'}</td>                                                
                                                <td>{elem?.service_id?.name || '-'}</td>
                                                <td>{elem?.PipingMaterialSpecification?.name || '-'}</td>
                                                <td>{elem?.shadeRalNo || '-'}</td>
                                                {!data?._id ? (
                                                    editRowIndex === i ? (
                                                        <>
                                                            {/* <td>
                                                                <select
                                                                    className='form-control form-select'
                                                                    value={editFormData?.paint_system}
                                                                    name='paint_system'
                                                                    onChange={handleEditFormChange}
                                                                >
                                                                    <option value=''>Select Paint</option>
                                                                    {paintRequirements.map(p => (
                                                                        <option key={p._id} value={p._id}>{p.paint_system_no}</option>
                                                                    ))}
                                                                </select>
                                                            </td> */}
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
    <span onClick={() => handleEditClick(i, elem)}>
      {elem?.remarks || '-'}
    </span>
  )}
</td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* <td onClick={() => handleEditClick(i, elem)}>{elem?.paint_system_no || elem?.paint_system || '-'}</td> */}
                                                            <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
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
                                                        <button className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                                        <button className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
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
