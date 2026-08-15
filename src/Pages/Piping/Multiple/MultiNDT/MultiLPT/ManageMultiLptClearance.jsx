import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import { getUserProcedureMaster } from '../../../../../Store/Piping/Procedure/ProcedureMaster';
import { Pagination, Search } from '../../../Table';
import { Check, Save, X } from 'lucide-react';
import DropDown from '../../../../../Components/DropDown';
import LptClearanceForm from '../MultiLPT/components/LptClearanceForm';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';

const ManageMultiLptClearance = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [status, setStatus] = useState(null);
    const [error, setError] = useState({});
    const [disable, setDisable] = useState(false);
    // const [totalItems, setTotalItems] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    // const [limit, setlimit] = useState(10);
    const [lpt, setLpt] = useState({
        procedure: '',
    });
    const data = location.state;
    const isViewMode = data?.status !== 1;

console.log("data lpt============>",data);
    const [lptForm, setLptForm] = useState({
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
        batch_no: '',
        validity: '',
    });
    const [cleaner, setCleaner] = useState({
        make: '',
        batch_no: '',
        validity: '',
    });
    const [developer, setDeveloper] = useState({
        make: '',
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
  if (data?.items) {
    const normalizedItems = data.items.map(item => ({
      ...item,
      // 🔑 normalize status
      is_accepted_qc:
        item.is_accepted === true
          ? true
          : item.is_accepted === false
          ? false
          : null,
    }));

    setTableData(normalizedItems);
  }
}, [data]);

console.log("setTableData",setTableData);
    const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);
//     const commentsData = useMemo(() => {
//         let computedComments = tableData || [];
// console.log("computedComments",computedComments);

//         // if (search) {
//         //     computedComments = computedComments.filter((item) =>
//         //         item?.grid_item_id?.item_name?.name?.toLowerCase().includes(search.toLowerCase())
//         //     );
//         // }
//         setTotalItems(computedComments?.length);
//         return computedComments;
//     }, [currentPage, search, limit, tableData]);

const commentsData = useMemo(() => {
  if (!tableData) return [];

  if (!search) return tableData;

  return tableData.filter((item) =>
    (item.drawing_no || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.rev || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.spool_no || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.joint_no || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.size || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.thickness || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.joint_type || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.welder_no || '').toLowerCase().includes(search.toLowerCase())
  );
}, [search, tableData]);

console.log("commentsData",commentsData);
useEffect(() => {
  if (data && isViewMode) {
    setLpt({
      procedure: data.procedure_id, // 🔑 use ID for dropdown
    });

    setLptForm({
      test_date: data.test_date
        ? moment(data.test_date).format('YYYY-MM-DD')
        : '',
      acceptance_code: data.acceptance_code || '',

      surface_condition: data.test_details?.surface_condition || '',
      surface_temperature: data.test_details?.surface_temperature || '',
      examination_stage: data.test_details?.examination_stage || '',
      technique: data.test_details?.technique || '',
      lighting_equipment: data.test_details?.lighting_equipment || '',
      lighting_intensity: data.test_details?.lighting_intensity || '',
      extent_examination: data.test_details?.extent_examination || '',
    });

    setPenetrant(data.test_details?.penetrant || {});
    setCleaner(data.test_details?.cleaner || {});
    setDeveloper(data.test_details?.developer || {});
  }
}, [data, isViewMode]);

  
const handleAcceptRejectClick = (index, isAccepted, name) => {
  Swal.fire({
    title: isAccepted ? `Accept this ${name}?` : `Reject this ${name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
  }).then((result) => {
    if (result.isConfirmed) {
      const updated = [...tableData];
      updated[index].is_accepted_qc = isAccepted ? true : false;
      setTableData(updated);
       // ✅ update UI selection state
      setAcceptRejectStatus(prev => ({
        ...prev,
        [index]: isAccepted
      }));
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
        setLpt({ ...lpt, [name]: e.target.value });
    };
    const handleChange2 = (e) => {
        setLptForm({ ...lptForm, [e.target.name]: e.target.value });
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

  
const handleEditClick = (index) => {
      if (isViewMode) return;
  setEditRowIndex(index);
};

const handleSaveClick = () => {
  setEditRowIndex(null);
};



    const handleCancelClick = () => {
        setEditRowIndex(null);
    };

    const handleSubmit = () => {
        if (validation()) {

            let updatedData = tableData;
          console.log("updatedData",updatedData);
            // for (const item of updatedData) {
            //   if (item.is_accepted_qc === true || item.is_accepted_qc === false) {
            //     if (item.observation === undefined || item.observation === '') {
            //         toast.error(`Please enter observation`);
            //         return;
            //     }
               
            // }
            // }
            for (let i = 0; i < updatedData.length; i++) {
  const item = updatedData[i];

  // ❌ Check if Accept/Reject not selected
  if (item.is_accepted_qc === null || item.is_accepted_qc === undefined) {
    toast.error(`Please select Accept/Reject for row ${i + 1}`);
    return;
  }

  // ❌ If selected, observation is mandatory
  if (!item.observation || item.observation.trim() === '') {
    toast.error(`Please enter observation for row ${i + 1}`);
    return;
  }
}
console.log("tableData=====>",tableData);
const filteredData = tableData.map(item => ({
  // IDs
  _id: item._id,
  drawing_id: item.drawing_id,
  spool_no_id: item.spool_no_id,
  joint_spool_item_id: item.joint_spool_item_id,
//   joint_material_item_id: item.joint_material_item_id,

  // Drawing / joint info
  drawing_no: item.drawing_no,
  rev: item.rev,
  spool_no: item.spool_no,
  joint_no: item.joint_no,

  // Joint properties
  joint_type: item.joint_type_id,     // 🔑 backend expects ID
  size: item.size,                    // "4"
  thickness: item.thickness,          // "SCH 40S"

  // Welder
  welder_id: item.welder_id,
  welder_no: item.welder_no,

  // QC inputs
  observation: item.observation,
  qc_remarks: item.qc_remarks || '',
  is_accepted: item.is_accepted_qc  || '',
}));


console.log("filteredData",filteredData);
            setDisable(true);
            const myurl = `${V_URL}/user/verify-lpt-ndt-inspection-piping`;
            const bodyFormData = new URLSearchParams();
            bodyFormData.append('inspection_id', data?._id);

            bodyFormData.append('procedure_no', lpt.procedure);
            bodyFormData.append('test_date', lptForm.test_date);
            bodyFormData.append('acceptance_code', lptForm.acceptance_code);

            bodyFormData.append('surface_condition', lptForm.surface_condition);
            bodyFormData.append('surface_temperature', lptForm.surface_temperature);
            bodyFormData.append('examination_stage', lptForm.examination_stage);
            bodyFormData.append('technique', lptForm.technique);
            bodyFormData.append('lighting_equipment', lptForm.lighting_equipment);
            bodyFormData.append('lighting_intensity', lptForm.lighting_intensity);
            bodyFormData.append('extent_examination', lptForm.extent_examination);

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
                    navigate('/piping/user/lpt-clearance-management');
                }
                setDisable(false);
            }).catch((error) => {
                toast.error("Something went wrong." || error.response.data?.message);
                setDisable(false);
            });
        }
    }



    const validation = () => {
  let isValid = true;
  let err = {};

  // Header validations
  if (!lpt.procedure) {
    isValid = false;
    err.procedure_err = 'Please select procedure no.';
  }

  if (!lptForm.test_date) {
    isValid = false;
    err.test_date_err = 'Please select test date.';
  }
if (!lptForm.acceptance_code) {
    isValid = false;
    err.acceptance_code_err = 'Please enter acceptance code.';
  }
  // Test details
  if (!lptForm.surface_condition) {
    isValid = false;
    err.surface_condition_err = 'Please enter surface condition.';
  }

  if (!lptForm.surface_temperature) {
    isValid = false;
    err.surface_temperature_err = 'Please enter surface temperature.';
  }

  if (!lptForm.examination_stage) {
    isValid = false;
    err.examination_stage_err = 'Please enter examination stage.';
  }

  if (!lptForm.technique) {
    isValid = false;
    err.technique_err = 'Please enter technique.';
  }

  if (!lptForm.lighting_equipment) {
    isValid = false;
    err.lighting_equipment_err = 'Please enter lighting equipment.';
  }

  if (!lptForm.lighting_intensity) {
    isValid = false;
    err.lighting_intensity_err = 'Please enter lighting intensity.';
  }

  if (!lptForm.extent_examination) {
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
                        { name: "LPT Clearance List", link: "/piping/user/lpt-clearance-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} LPT Clearance`, active: true }
                    ]} />

                    <div className='row'>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>LPT Clearance Details</h4>
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
                                                    <label>LPT Offer No.</label>
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
                                                        value={lpt.procedure}
                                                        disabled={isViewMode}
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
                                                    <input type='date' className='form-control' disabled={isViewMode} value={lptForm.test_date} name='test_date' onChange={handleChange2}
                                                        max={new Date().toISOString().split("T")[0]} min={moment(data?.report_date).format("YYYY-MM-DD")} />
                                                    <div className='error'>{error?.test_date_err}</div>
                                                </div>
                                            </div>
                                            <div className='col-12 col-md-4 col-xl-4'>
                                                <div className='input-block local-forms'>
                                                    <label>Acceptance Code </label>
                                                    <input type='text' className='form-control' disabled={isViewMode} value={lptForm.acceptance_code} name='acceptance_code' onChange={handleChange2} />
                                                    <div className='error'>{error?.acceptance_code_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <LptClearanceForm
                        data={data}
                        lptForm={lptForm}
                        developer={developer}
                        penetrant={penetrant}
                        cleaner={cleaner}
                        error={error}
                        handleChange2={handleChange2}
                        handleChangeDeveloper={handleChangeDeveloper}
                        handleChangePenetrant={handleChangePenetrant}
                        handleChangeCleaner={handleChangeCleaner}
                          isViewMode={isViewMode}
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
                                                                   
                                                                }} />
                                                                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                                                                <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                                                    alt="search" /></a>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                           
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
     const joint = row;

      const isEditing = editRowIndex === index;

      return (
        <tr
          key={row?._id || index}
          onClick={() => handleEditClick(index, row)}
        >
          <td>{index + 1}</td>
         <td>{row?.drawing_no || '-'}</td>
<td>{row?.rev || '-'}</td>
<td>{row?.spool_no || '-'}</td>
<td>{row?.joint_no || '-'}</td>
<td>{row?.size || '-'}</td>
<td>{row?.thickness || '-'}</td>
<td>{row?.joint_type || '-'}</td>
<td>{row?.welder_no || '-'}</td>


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
  disabled={isViewMode}
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
  disabled={isViewMode}
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
       
<td className="status-badge">
  {row?.is_accepted_qc === true ? (
    <span className="custom-badge status-green">Acc</span>
  ) : row?.is_accepted_qc === false ? (
    <span className="custom-badge status-pink">Rej</span>
  ) : ( <span>-</span>)}
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
    <td colSpan="999">
      <div className="no-table-data">
        No Data Found!
      </div>
    </td>
  </tr>
  )}
</tbody>



                                        </table>
                                    </div>
                                 
                                </div>
                            </div>
                        </div>
                    </div>


                        {/* <SubmitButton
                          disable={disable}
                          handleSubmit={handleSubmit}
                          link={'/piping/user/lpt-clearance-management'}
                          buttonName={'Generate LPT Acceptance'}
                        /> */}
                    
                    <div className="mt-3">
  {isViewMode ? (
    <SubmitButton
      handleSubmit={() => navigate('/piping/user/lpt-clearance-management')}
      buttonName="Back"
    />
  ) : (
    <SubmitButton
      disable={disable}
      handleSubmit={handleSubmit}
      link="/piping/user/lpt-clearance-management"
      buttonName="Generate LPT Acceptance"
    />
  )}
</div>

                </div>
            </div>
        </div>
    )
}

export default ManageMultiLptClearance