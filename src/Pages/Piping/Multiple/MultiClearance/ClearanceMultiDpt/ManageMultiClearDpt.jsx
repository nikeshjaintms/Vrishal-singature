import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import {  Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import DptClearanceForm from '../ClearanceMultiDpt/DptClearanceForm';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';

const ManageMultiDptClearance = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setlimit] = useState(10);
    const [dpt, setDpt] = useState({
        procedure: '',
    });
    const data = location.state;
console.log("data",data);
    const [dptForm, setDptForm] = useState({
        test_date: '',
        acceptance_code: '',
        surface_condition: '',
        surface_temperature: '',
        examination_stage: '',
        technique: '',
        lighting_equipment: '',
        lighting_intensity: '',
        extent_examination: '',
    });
    const [penetrant, setPenetrant] = useState({
        make: '',
        model:'',
        batch_no: '',
        validity: '',
    });
    const [cleaner, setCleaner] = useState({
        make: '',
         model:'',
        batch_no: '',
        validity: '',
    });
    const [developer, setDeveloper] = useState({
        make: '',
        model:'',
        batch_no: '',
        validity: '',
    });
    const [editRowIndex, setEditRowIndex] = useState(null);
    // const [editFormData, setEditFormData] = useState({
    //     observation: '',
    //     test_result:'',
    //     qc_remarks: '',
    //     is_accepted_qc: '',
    // });
    const [tableData, setTableData] = useState([]);
    const [acceptRejectStatus, setAcceptRejectStatus] = useState({});

    useEffect(() => {
        dispatch(getUserProcedureMaster({ status: 'true' }))
    }, []);

  useEffect(() => {
        if (data) {
            setTableData(data?.items);
        }
    }, [data]);
console.log("setTableData",setTableData);
    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);

   const commentsData = useMemo(() => {
  let computed = tableData || [];

  if (search) {
    const searchValue = search.toLowerCase();

    computed = computed.filter((item) => {
      const joint = item?.jointDetails?.[0];

      return (
        joint?.drawing_no?.toLowerCase().includes(searchValue) ||
        joint?.spool_no?.toLowerCase().includes(searchValue) ||
        joint?.joint_no?.toLowerCase().includes(searchValue) ||
        joint?.joint_type?.name?.toLowerCase().includes(searchValue) ||
        joint?.welder_no?.toLowerCase().includes(searchValue)
      );
    });
  }

  setTotalItems(computed.length);
  return computed;
}, [search, tableData]);


console.log("commentsData",commentsData);
    // const handleAcceptRejectClick = (index, isAccepted, name) => {
    //     Swal.fire({
    //         title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
    //         text: "Are you sure you want to proceed?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Confirm",
    //         cancelButtonText: "Cancel",
    //         dangerMode: !isAccepted,
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             setAcceptRejectStatus((prev) => ({
    //                 ...prev,
    //                 [index]: isAccepted,
    //             }));
    //             toast.success(`${name} ${index + 1} ${isAccepted ? "accepted" : "rejected"}.`);
    //         }
    //     });
    // };
const handleAcceptRejectClick = (index, isAccepted, name) => {
  Swal.fire({
    title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
  }).then((result) => {
    if (result.isConfirmed) {
      const updated = [...tableData];
      updated[index].is_accepted_qc = isAccepted ? "Acc" : "Rej";
      setTableData(updated);
      toast.success(`${name} ${isAccepted ? "accepted" : "rejected"}`);
    }
  });
};

const handleRowChange = (index, field, value) => {
  const updated = [...tableData];
  updated[index] = {
    ...updated[index],
    [field]: value,
  };
  setTableData(updated);
};

    const handleChange = (e, name) => {
        setDpt({ ...dpt, [name]: e.target.value });
    };
    const handleChange2 = (e) => {
        setDptForm({ ...dptForm, [e.target.name]: e.target.value });
    }
    const handleChangePenetrant = (e) => {
        setPenetrant({ ...penetrant, [e.target.name]: e.target.value });
    }
    const handleChangeCleaner = (e) => {
        setCleaner({ ...cleaner, [e.target.name]: e.target.value });
    }
    const handleChangeDeveloper = (e) => {
        setDeveloper({ ...developer, [e.target.name]: e.target.value });
    }

    // const handleEditClick = (index, row) => {
    //     setEditRowIndex(index);
    //     setEditFormData({
    //         observation: row.observation,
    //         test_result: row.test_result,
    //         qc_remarks: row.qc_remarks,
    //     });
    // }
const handleEditClick = (index) => {
  setEditRowIndex(index);
};

    // const handleEditFormChange = (e) => {
    //     const { name, value } = e.target;
    //     setEditFormData({
    //         ...editFormData,
    //         [name]: value,
    //     });
    // }

    // const handleSaveClick = () => {
    //     const updatedData = [...tableData];
    //     const dataIndex = (currentPage - 1) * limit + editRowIndex;
    //     updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData, is_accepted_qc: acceptRejectStatus[editRowIndex] };
    //     setTableData(updatedData);
    //     setEditRowIndex(null);
    // }

//     const handleSaveClick = () => {
//   const updatedData = [...tableData];
//   const dataIndex = (currentPage - 1) * limit + editRowIndex;

//   let status = "NA";
//   if (acceptRejectStatus[editRowIndex] === true) status = "Acc";
//   if (acceptRejectStatus[editRowIndex] === false) status = "Rej";

//   updatedData[dataIndex] = {
//     ...updatedData[dataIndex],
//     ...editFormData,
//     is_accepted_qc: status,
//   };

//   setTableData(updatedData);
//   setEditRowIndex(null);
// };
const handleSaveClick = () => {
  setEditRowIndex(null);
};




    const handleSubmit = () => {
        if (validation()) {

            let updatedData = tableData;
          console.log("updatedData",updatedData);
            for (const item of updatedData) {
              if (item.is_accepted_qc === "Acc" || item.is_accepted_qc === "Rej") {
                if (item.observation === undefined || item.observation === '') {
                    toast.error(`Please enter observation`);
                    return;
                }
              
            }
            }

         const filteredData = tableData.map(item => {
  const joint = item.jointDetails?.[0];

  return {
    drawing_id: item.drawing_id,
    fitUp_id: item.fitUp_id,
    fitUp_item_id: item.fitUp_item_id,

    joint_no: joint?.joint_no,
    spool_no: joint?.spool_no,
    drawing_no: joint?.drawing_no,
    rev: joint?.rev,

    joint_type: joint?.joint_type?._id,
    size: joint?.selected_size?.size_name,
    thickness: joint?.selected_thickness?.thickness,

    welder_no: item?.welder_no, // ObjectId
    welder_name: joint?.welder_name,

    observation: item.observation,
   
    qc_remarks: item.qc_remarks || '',
    is_accepted: item.is_accepted_qc ||'NA'
  };
});

console.log("filteredData",filteredData);
            setDisable(true);
            const myurl = `${V_URL}/user/verify-dpt-inspection-piping`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('inspection_id', data?._id);

            bodyFormData.append('procedure_no', dpt.procedure);
            bodyFormData.append('test_date', dptForm.test_date);
            bodyFormData.append('acceptance_code', dptForm.acceptance_code);

            bodyFormData.append('surface_condition', dptForm.surface_condition);
            bodyFormData.append('surface_temperature', dptForm.surface_temperature);
            bodyFormData.append('examination_stage', dptForm.examination_stage);
            bodyFormData.append('technique', dptForm.technique);
            bodyFormData.append('lighting_equipment', dptForm.lighting_equipment);
            bodyFormData.append('lighting_intensity', dptForm.lighting_intensity);
            bodyFormData.append('extent_examination', dptForm.extent_examination);

            bodyFormData.append('penetrant_solvent', JSON.stringify(penetrant));
            bodyFormData.append('cleaner_solvent', JSON.stringify(cleaner));
            bodyFormData.append('developer_solvent', JSON.stringify(developer));

            bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
            bodyFormData.append('project_name', localStorage.getItem('PAY_USER_PROJECT_NAME'))
            bodyFormData.append('items', JSON.stringify(filteredData));
            bodyFormData.append('pId', localStorage.getItem('U_PROJECT_ID'));
            axios({
                method: "post",
                url: myurl,
                data: bodyFormData,
                headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
            }).then((response) => {
                if (response.data.success === true) {
                    toast.success(response.data.message);
                    navigate('/piping/user/dpt-clearance-management');
                }
                setDisable(false);
            }).catch((error) => {
                toast.error("Something went wrong." || error.response.data?.message);
                setDisable(false);
            });
        }
    }

    // const validation = () => {
    //     let isValid = true;
    //     let err = {};
    //     if (!dpt.procedure) {
    //         isValid = false;
    //         err['procedure_err'] = 'Please select procedure no.';
    //     }
    //     if (!dptForm.test_date) {
    //         isValid = false;
    //         err['test_date_err'] = 'Please select test date.';
    //     }
        
    //     setError(err);
    //     return isValid;
    // }

    const validation = () => {
  let isValid = true;
  let err = {};

  // Header validations
  if (!dpt.procedure) {
    isValid = false;
    err.procedure_err = 'Please select procedure no.';
  }

  if (!dptForm.test_date) {
    isValid = false;
    err.test_date_err = 'Please select test date.';
  }
if (!dptForm.acceptance_code) {
    isValid = false;
    err.acceptance_code_err = 'Please enter acceptance code.';
  }
  // Test details
  if (!dptForm.surface_condition) {
    isValid = false;
    err.surface_condition_err = 'Please enter surface condition.';
  }

  if (!dptForm.surface_temperature) {
    isValid = false;
    err.surface_temperature_err = 'Please enter surface temperature.';
  }

  if (!dptForm.examination_stage) {
    isValid = false;
    err.examination_stage_err = 'Please enter examination stage.';
  }

  if (!dptForm.technique) {
    isValid = false;
    err.technique_err = 'Please enter technique.';
  }

  if (!dptForm.lighting_equipment) {
    isValid = false;
    err.lighting_equipment_err = 'Please enter lighting equipment.';
  }

  if (!dptForm.lighting_intensity) {
    isValid = false;
    err.lighting_intensity_err = 'Please enter lighting intensity.';
  }

  if (!dptForm.extent_examination) {
    isValid = false;
    err.extent_examination_err = 'Please enter extent of examination.';
  }

  // Penetrant
  if (!penetrant.make) {
    isValid = false;
    err.pen_make_err = 'Please enter penetrant make.';
  }

  if (!penetrant.batch_no) {
    isValid = false;
    err.pen_batch_no_err = 'Please enter penetrant batch no.';
  }

  if (!penetrant.validity) {
    isValid = false;
    err.pen_validity_err = 'Please enter penetrant validity.';
  }

  // Cleaner
  if (!cleaner.make) {
    isValid = false;
    err.clean_make_err = 'Please enter cleaner make.';
  }

  if (!cleaner.batch_no) {
    isValid = false;
    err.clean_batch_err = 'Please enter cleaner batch no.';
  }

  if (!cleaner.validity) {
    isValid = false;
    err.clean_validity_err = 'Please enter cleaner validity.';
  }

  // Developer
  if (!developer.make) {
    isValid = false;
    err.dev_make_err = 'Please enter developer make.';
  }

  if (!developer.batch_no) {
    isValid = false;
    err.dev_batch_err = 'Please enter developer batch no.';
  }

  if (!developer.validity) {
    isValid = false;
    err.dev_validity_err = 'Please enter developer validity.';
  }

  setError(err);
  return isValid;
};


    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const procedureOptions = procedureData?.map(procedure => ({
        label: procedure.vendor_doc_no,
        value: procedure._id
    }));

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">

                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/piping/user/dashboard", active: false },
                        { name: "DPT Clearance List", link: "/piping/user/dpt-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} DPT Clearance`, active: true }
                    ]} />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>DPT Clearance Details</h4>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            {/* {data?.status !== 2 && (
                                                <div className="col-12 col-md-4 col-xl-4">
                                                    <div className="input-block local-forms custom-select-wpr">
                                                        <label>Magnetic Particle Testing Clearance No.</label>
                                                        <input className='form-control' value={data?.test_inspect_no} readOnly />
                                                    </div>
                                                </div>
                                            )} */}
                                            <div className="col-12 col-md-4 col-xl-4">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label>DPT Offer No.</label>
                                                    <input className='form-control' value={data?.status === 2 ? data?.report_no : data?.report_no} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Procedure No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={procedureOptions}
                                                        value={dpt.procedure}
                                                        onChange={(e) => handleChange(e, 'procedure')}
                                                        filter className='w-100'
                                                        placeholder="Select Procedure No."
                                                    />
                                                    <div className='error'>{error?.procedure_err}</div>
                                                </div>
                                            </div>

                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Test Date <span className="login-danger">*</span></label>
                                                    <input type='date' className='form-control' value={dptForm.test_date} name='test_date' onChange={handleChange2}
                                                        max={new Date().toISOString().split("T")[0]} min={moment(data?.report_date).format("YYYY-MM-DD")} />
                                                    <div className='error'>{error?.test_date_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Acceptance Code </label>
                                                    <input type='text' className='form-control' value={dptForm.acceptance_code} name='acceptance_code' onChange={handleChange2} />
                                                    <div className='error'>{error?.acceptance_code_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DptClearanceForm
                        data={data}
                        dptForm={dptForm}
                        developer={developer}
                        penetrant={penetrant}
                        cleaner={cleaner}
                        error={error}
                        handleChange2={handleChange2}
                        handleChangeDeveloper={handleChangeDeveloper}
                        handleChangePenetrant={handleChangePenetrant}
                        handleChangeCleaner={handleChangeCleaner}
                    />

                    <div className='row'>
                        <div className='col-12'>
                            <div className="card card-table show-entire">
                                <div className="card-body">
                                    <div className="page-table-header mb-2">
                                        <div className="row align-items-center">
                                            <div className="col">
                                                <div className="doctor-table-blk">
                                                    <h3>Item Details List</h3>
                                                    <div className="doctor-search-blk">
                                                        <div className="top-nav-search table-search-blk">
                                                            <form>
                                                                <Search onSearch={(value) => {
                                                                    setSearch(value);
                                                                    setCurrentPage(1);
                                                                }} />
                                                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                                                <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                                            </div> */}
                                        </div>
                                    </div>
                                    
                                    <div className="table-responsive" style={{ minHeight: 0 }}>
                                        <table className="table border-0 custom-table comman-table  mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Sr.</th>
                                                    <th>Drawing No./Line No.</th>
                                                    <th>Rev</th>
                                                    <th>Spool No.</th>
                                                    <th>Joint No.</th>
                                                    <th>Size</th>
                                                    <th>Thickness</th>
                                                    <th>Joint Type</th>
                                                    <th>Welder No.</th>
                                                    <th>Observation</th>                                                  
                                                    <th>Acc/Rej</th>
                                                    <th>Remarks</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                  
                                                    {data?.status === 2 && (
                                                        <th>Acc/Rej</th>
                                                    )}
                                                  
                                                    {data?.status === 2 && (
                                                        <th>Action</th>
                                                    )}
                                                </tr>
                                            </thead>
                                       <tbody>
  {commentsData?.length > 0 ? (
    commentsData.map((row, index) => {
      const joint = row?.jointDetails?.[0];
      const isEditing = editRowIndex === index;

      return (
        <tr
          key={row?._id || index}
          onClick={() => handleEditClick(index, row)}
        >
          <td>{(currentPage - 1) * limit + index + 1}</td>
          <td>{joint?.drawing_no || '-'}</td>
          <td>{joint?.rev || '-'}</td>
          <td>{joint?.spool_no || '-'}</td>
          <td>{joint?.joint_no || '-'}</td>
          <td>{joint?.selected_size?.size_name || '-'}</td>
          <td>{joint?.selected_thickness?.thickness || '-'}</td>
          <td>{joint?.joint_type?.name || '-'}</td>
          <td>{joint?.welder_no || '-'}</td>

          {/* Observation */}
          <td>
            {isEditing ? (
              // <input
              //   type="text"
              //   className="form-control"
              //   name="observation"
              //   value={editFormData.observation || ''}
              //   onChange={handleEditFormChange}
              // />
              <input
  type="text"
  className="form-control"
  name="observation"
  value={row?.observation || ''}
  onChange={(e) =>
    handleRowChange(index, 'observation', e.target.value)
  }
/>

            ) : (
              row?.observation || '-'
            )}
          </td>
  
          {/* Accept / Reject */}
          <td>
            {isEditing ? (
              <div className="d-flex gap-2">
                <span
                  className={`present-table attent-status ${acceptRejectStatus[index] === true ? 'selected' : ''}`}
                  onClick={() =>
                    handleAcceptRejectClick(index, true, joint?.joint_no || 'Item')
                  }
                >
                  <Check />
                </span>
                <span
                  className={`absent-table attent-status ${acceptRejectStatus[index] === false ? 'selected' : ''}`}
                  onClick={() =>
                    handleAcceptRejectClick(index, false, joint?.joint_no || 'Item')
                  }
                >
                  <X />
                </span>
              </div>
            ) : (
              <span>-</span>
            )}
          </td>

          {/* QC Remarks */}
          <td>
            {isEditing ? (
              // <textarea
              //   className="form-control"
              //   name="qc_remarks"
              //   value={editFormData.qc_remarks || ''}
              //   onChange={handleEditFormChange}
              //   rows={1}
              // />
              <textarea
  className="form-control"
  name="qc_remarks"
  rows={1}
  value={row?.qc_remarks || ''}
  onChange={(e) =>
    handleRowChange(index, 'qc_remarks', e.target.value)
  }
/>

            ) : (
              row?.qc_remarks || '-'
            )}
          </td>

          {/* Status */}
          {/* <td className="status-badge">
            {acceptRejectStatus[index] === true ? (
              <span className="custom-badge status-green">Acc</span>
            ) : acceptRejectStatus[index] === false ? (
              <span className="custom-badge status-pink">Rej</span>
            ) : (
              <span>-</span>
            )}
          </td> */}
<td className="status-badge">
  {row?.is_accepted_qc === "Acc" ? (
    <span className="custom-badge status-green">Acc</span>
  ) : row?.is_accepted_qc === "Rej" ? (
    <span className="custom-badge status-pink">Rej</span>
  ) : (
    <span className="custom-badge status-grey">NA</span>
  )}
</td>

          {/* Action */}
          <td>
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="btn btn-success p-1 mx-1"
                  // onClick={handleSaveClick}
                  onClick={(e) => {
    e.stopPropagation();   // 🔥 IMPORTANT
    handleSaveClick();
  }}
                >
                  <Save />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary p-1 mx-1"
                  // onClick={handleCancelClick}
                  onClick={(e) => {
    e.stopPropagation();   // 🔥 IMPORTANT
    handleSaveClick();
  }}
                >
                  <X/>
                </button>
              </>
            ) : (
              <span
                style={{ cursor: 'pointer' }}
                // onClick={() => handleEditClick(index, row)}
                onClick={() => {
  if (editRowIndex !== index) {
    handleEditClick(index, row);
  }
}}

              >
                -
              </span>
            )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="14" className="text-center">
        No data found
      </td>
    </tr>
  )}
</tbody>



                                        </table>
                                    </div>
                                    {/* <div className="row align-center mt-3 mb-2">
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6">
                                            <div className="dataTables_info" id="DataTables_Table_0_info" role="status"
                                                aria-live="polite">Showing {Math.min(limit, totalItems)} from {totalItems} data</div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                                            <div className="dataTables_paginate paging_simple_numbers"
                                                id="DataTables_Table_0_paginate">
                                                <Pagination
                                                    total={totalItems}
                                                    itemsPerPage={limit}
                                                    currentPage={currentPage}
                                                    onPageChange={(page) => setCurrentPage(page)}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>


                        <SubmitButton
                          disable={disable}
                          handleSubmit={handleSubmit}
                          link={'/piping/user/dpt-clearance-management'}
                          buttonName={'Generate DPT Acceptance'}
                        />
                    
                    
                </div>
            </div>
        </div>
    )
}

export default ManageMultiDptClearance