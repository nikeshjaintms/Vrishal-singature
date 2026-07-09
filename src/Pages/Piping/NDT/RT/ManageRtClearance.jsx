import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../Include/Footer';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserNdtOffer } from '../../../../Store/Store/Ndt/NdtOffer';
import { getUserProcedureMaster } from '../../../../Store/Store/Procedure/ProcedureMaster';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import moment from 'moment';
import { getUserNdtMaster } from '../../../../Store/Store/Ndt/NdtMaster';

const ManageRtClearance = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [error, setError] = useState({});
  const [disable, setDisable] = useState(false);
  const [rt, setRt] = useState({
    drawNo: '',
    rtOffer: '',
    procedure: '',
  });

  const [rtForm, setRtForm] = useState({
    test_date: '',
    source: '',
    film_type: '',
    strength: '',
    sensivity: '',
    density: '',
    penetrameter: '',
    front: '',
    back: '',
    acc_standard: '',
  });

  const [rtObj, setRtObj] = useState(null);
  const [rtFilter, setRtFilter] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);

  const [status, setStatus] = useState(null);
  const [rtDraw, setRtDraw] = useState([]);

  const data = location.state;

  useEffect(() => {
    if (location.state?._id) {
      setRt({
        drawNo: location.state?.items[0]?.transaction_id?.drawingId?._id,
        rtOffer: location.state?.ndt_offer_no?._id,
        procedure: location.state?.procedure_no?._id,
      })
      setRtForm({
        test_date: moment(location.state?.test_date).format('YYYY-MM-DD'),
        source: location.state?.source,
        film_type: location.state?.film_type,
        strength: location.state?.strength,
        sensivity: location.state?.sensitivity,
        density: location.state?.density,
        penetrameter: location.state?.penetrameter,
        front: location.state?.front,
        back: location.state?.back,
        acc_standard: location.state?.acceptance_standard,
      });
      setTableData(location.state?.items);
      setStatus(location.state?.qc_status);
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getUserNdtMaster({ status: '' }))
      .then((response) => {
        const ndtData = response.payload?.data;
        const findNdt = ndtData?.find((nt) => nt?.name === 'RT');
        if (findNdt) {
          dispatch(getUserNdtOffer({ status: '', type: findNdt._id }));
          setDisable(false);
        }
      }).catch((error) => console.error("Error fetching NDT Master data:", error));
    dispatch(getUserProcedureMaster({ status: 'true' }));
  }, [dispatch]);

  const drawData = useSelector(state => state.getDrawing?.user?.data?.data);
  const ndtOfferData = useSelector(state => state.getUserNdtOffer?.user?.data);
  const procedureData = useSelector(state => state.getUserProcedureMaster?.user?.data);

  useEffect(() => {
    const checkStatus = ndtOfferData?.filter(st => st.status === 4);


    const rtIds = checkStatus?.map((u) => u?.drawing_id);
    const matchIds = drawData?.filter(id => rtIds?.includes(id?._id) && id?.project?._id === localStorage.getItem('U_PROJECT_ID'));
    setRtDraw(matchIds || []);

    const matchDrawing = checkStatus?.filter(dr => dr?.items?.some(it => it?.transaction_id?.drawingId?._id === rt.drawNo));
    if (data?._id) {
      setRtFilter(ndtOfferData);
      const findRt = ndtOfferData?.find(dr => dr._id === rt.rtOffer);
      setRtObj(findRt);
    } else {
      setRtFilter(matchDrawing);
      if (matchDrawing?.length > 0) {
        const seletcedRt = matchDrawing?.find(dr => dr._id === rt.rtOffer);
        setRtObj(seletcedRt);
        setTableData(seletcedRt?.items || []);
      }
    }
  }, [drawData, ndtOfferData, rt.drawNo, rt.rtOffer, data?._id]);

  const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
    let filteredData = data;
    if (searchTerm) {
      filteredData = filteredData.filter(
        (i) =>
          i?.transaction_id?.itemName?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    setTotalItems(filteredData?.length);
    return filteredData?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  };

  const commentsData = useMemo(() => filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
    [currentPage, search, limit, tableData]);

  const handleChange = (e, name) => {
    setRt({ ...rt, [name]: e.value });
  }

  const handleChange2 = (e) => {
    setRtForm({ ...rtForm, [e.target.name]: e.target.value });
  }

  const handleStatusChange = (event) => {
    setStatus(event.target.value === 'accept');
  };

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    SFD: '', expo_time: '', technique: '', segment: '', film_size: '', observation: '',
  });

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      SFD: row.SFD,
      expo_time: row.expo_time,
      technique: row.technique,
      segment: row.segment,
      film_size: row.film_size,
      observation: row.observation,
    });
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  }

  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
    setTableData(updatedData);
    setEditRowIndex(null);
  }

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleSubmit = () => {
    if (validation()) {
      let updatedData = tableData;
      let isValid = true;
      let InvalidItem = null;

      updatedData.forEach(item => {
        const requiredFields = [
          'SFD',
          'expo_time',
          'technique',
          'segment',
          'film_size',
          'observation'
        ];

        requiredFields.forEach(field => {
          if ((!item[field] || item[field].trim() === '') && isValid) {
            isValid = false;
            InvalidItem = item;
          }
        });
      });

      if (!isValid) {
        toast.error(`Please fill all the fields for ${InvalidItem.transaction_id.itemName.name}.`);
        return;
      }

      const filteredData = updatedData.map(item => ({
        transaction_id: item.transaction_id?._id,
        weldor_no: item.weldor_no?._id,
        thickness: item.thickness,
        profile_size: item.profile_size,
        item_status: item.item_status,
        SFD: item.SFD,
        expo_time: item.expo_time,
        technique: item.technique,
        segment: item.segment,
        film_size: item.film_size,
        observation: item.observation,
      }));


      setDisable(true);
      const myurl = `${V_URL}/user/manage-rt-report`;
      const bodyFormData = new URLSearchParams();
      bodyFormData.append('ndt_offer_no', rt.rtOffer);
      bodyFormData.append('test_date', rtForm.test_date)
      bodyFormData.append('procedure_no', rt.procedure);
      bodyFormData.append('source', rtForm.source);
      bodyFormData.append('film_type', rtForm.film_type);
      bodyFormData.append('strength', rtForm.strength);
      bodyFormData.append('sensitivity', rtForm.sensivity);
      bodyFormData.append('density', rtForm.density);
      bodyFormData.append('penetrameter', rtForm.penetrameter);
      bodyFormData.append('front', rtForm.front);
      bodyFormData.append('back', rtForm.back);
      bodyFormData.append('acceptance_standard', rtForm.acc_standard);

      bodyFormData.append('qc_status', status);
      bodyFormData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
      bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
      bodyFormData.append('items', JSON.stringify(filteredData));
      bodyFormData.append('drawing_id', rt.drawNo);

      axios({
        method: "post",
        url: myurl,
        data: bodyFormData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message);
          navigate('/piping/user/rt-clearance-management');
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

    if (!rt.drawNo) {
      isValid = false;
      err['drawNo_err'] = 'Please select drawing no.';
    }
    if (!rt.rtOffer) {
      isValid = false;
      err['rtOffer_err'] = 'Please select rt offer';
    }
    if (!rt.procedure) {
      isValid = false;
      err['procedure_err'] = 'Please select procedure';
    }
    if (!rtForm.test_date) {
      isValid = false;
      err['test_date_err'] = 'Please select test date';
    }
    if (status === null) {
      isValid = false;
      err['status_err'] = 'Please select status';
    }
    setError(err);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const procedureOptions = procedureData?.map(procedure => ({
    label: procedure.vendor_doc_no,
    value: procedure._id
  }))

  const drawOptions = rtDraw?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id
  }));

  const rtOptions = rtFilter?.map(offer => ({
    label: offer?.ndt_offer_no,
    value: offer?._id
  }))

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">

          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/piping/user/rt-clearance-management">Radiography Test Clearance List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Radiography Test Clearance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>Radiography Test Clearance Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={drawOptions}
                            value={rt.drawNo}
                            onChange={(e) => handleChange(e, 'drawNo')}
                            filter className='w-100'
                            placeholder="Select Drawing No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error?.drawNo_err}</div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>Radiography Test Offer No.<span className="login-danger">*</span></label>
                          <Dropdown
                            options={rtOptions}
                            value={rt.rtOffer}
                            onChange={(e) => handleChange(e, 'rtOffer')}
                            filter className='w-100'
                            placeholder="Select Radiography Test Offer No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error?.rtOffer_err}</div>
                        </div>
                      </div>
                    </div>

                    {rt?.rtOffer ? (
                      <>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Client </label>
                              <input className='form-control' value={rtObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                            </div>
                          </div>
                          <div className='col-12 col-md-4 col-xl-4'>
                            <div className="input-block local-forms">
                              <label>Work Order / PO No.</label>
                              <input className='form-control' value={rtObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>REV </label>
                              <input className='form-control' value={rtObj?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Sheet No. </label>
                              <input className='form-control' value={rtObj?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Assembly No. </label>
                              <input className='form-control' value={rtObj?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}

                    <div className='row'>
                      <div className='col-12 col-md-6 col-xl-6'>
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Procedure No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={procedureOptions}
                            value={rt.procedure}
                            onChange={(e) => handleChange(e, 'procedure')}
                            filter className='w-100'
                            placeholder="Select Procedure No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error?.procedure_err}</div>
                        </div>
                      </div>
                      <div className='col-12 col-md-6 col-xl-6'>
                        <div className="input-block local-forms">
                          <label>Test Date <span className="login-danger">*</span></label>
                          <input type='date' className='form-control' value={rtForm.test_date} name='test_date' onChange={handleChange2} readOnly={data?._id} />
                          <div className='error'>{error?.test_date_err}</div>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms'>
                          <label>Source</label>
                          <input type='text' className='form-control' value={rtForm.source} name='source'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.source_err}</div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms'>
                          <label>Film Type</label>
                          <input type='text' className='form-control' value={rtForm.film_type} name='film_type'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.film_type_err}</div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms'>
                          <label>Strength</label>
                          <input type='text' className='form-control' value={rtForm.strength} name='strength'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.strength_err}</div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms'>
                          <label>Sensivity</label>
                          <input type='text' className='form-control' value={rtForm.sensivity} name='sensivity'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.sensivity_err}</div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms'>
                          <label>Density</label>
                          <input type='text' className='form-control' value={rtForm.density} name='density'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.density_err}</div>
                      </div>

                      <div className='col-12 col-md-4 col-xl-4'>
                        <div className='input-block local-forms'>
                          <label>Penetrameter</label>
                          <input type='text' className='form-control' value={rtForm.penetrameter} name='penetrameter'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.penetrameter_err}</div>
                      </div>

                      <div className='col-12 col-md-3 col-xl-3'>
                        <div className='input-block local-forms'>
                          <label>Front</label>
                          <input type='text' className='form-control' value={rtForm.front} name='front'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.front_err}</div>
                      </div>

                      <div className='col-12 col-md-3 col-xl-3'>
                        <div className='input-block local-forms'>
                          <label>Back</label>
                          <input type='text' className='form-control' value={rtForm.back} name='back'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.back_err}</div>
                      </div>

                      <div className='col-12 col-md-6 col-xl-6'>
                        <div className='input-block local-forms'>
                          <label>Acceptance Standard</label>
                          <input type='text' className='form-control' value={rtForm.acc_standard} name='acc_standard'
                            onChange={handleChange2} readOnly={data?._id} />
                        </div>
                        <div className='error'>{error?.acc_standard_err}</div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12'>
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Section Details List</h3>
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
                      <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                        <DropDown limit={limit} onLimitChange={(val) => setlimit(val)} />
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive" style={{ minHeight: 0 }}>
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Section Details</th>
                          <th>Grid No.</th>
                          <th>Welding Pro.</th>
                          <th>Welder No.</th>
                          <th>Profile/Size</th>
                          <th>Thickness</th>
                          <th>SFD</th>
                          <th>Expo Time</th>
                          <th>Technique</th>
                          <th>Segment</th>
                          <th>Flim Size</th>
                          <th>Observation</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, i) =>
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{elem?.transaction_id?.itemName?.name}</td>
                            <td>{elem?.transaction_id?.grid_no}</td>
                            <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                            <td>{elem?.weldor_no?.welderNo}</td>
                            <td>{elem?.profile_size}</td>
                            <td>{elem?.thickness}</td>
                            {!data?._id ? (
                              <>
                                {editRowIndex === i ? (
                                  <>
                                    <td>
                                      <input type="text" className="form-control w-auto" value={editFormData?.SFD} name='SFD' onChange={handleEditFormChange} />
                                    </td>
                                    <td>
                                      <input type="text" className="form-control w-auto" value={editFormData?.expo_time} name='expo_time' onChange={handleEditFormChange} />
                                    </td>
                                    <td>
                                      <input type="text" className="form-control w-auto" value={editFormData?.technique} name='technique' onChange={handleEditFormChange} />
                                    </td>
                                    <td>
                                      <input type="text" className="form-control w-auto" value={editFormData?.segment} name='segment' onChange={handleEditFormChange} />
                                    </td>
                                    <td>
                                      <input type="text" className="form-control w-auto" value={editFormData?.film_size} name='film_size' onChange={handleEditFormChange} />
                                    </td>
                                    <td>
                                      <input type="text" className="form-control w-auto" value={editFormData?.observation} name='observation' onChange={handleEditFormChange} />
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.SFD || '-'}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.expo_time || '-'}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.technique || '-'}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.segment || '-'}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.film_size || '-'}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.observation || '-'}</td>
                                  </>
                                )}
                                {editRowIndex === i ? (
                                  <td>
                                    <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                    <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                  </td>
                                ) : <td>-</td>}
                              </>
                            ) : (
                              <>
                                <td>{elem?.SFD || '-'}</td>
                                <td>{elem?.expo_time || '-'}</td>
                                <td>{elem?.technique || '-'}</td>
                                <td>{elem?.segment || '-'}</td>
                                <td>{elem?.film_size || '-'}</td>
                                <td>{elem?.observation || '-'}</td>
                                <td>-</td>
                              </>
                            )}
                          </tr>
                        )}
                        {commentsData?.length === 0 ? (
                          <tr>
                            <td colSpan="999">
                              <div className="no-table-data">
                                No Data Found!
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-center mt-3 mb-2">
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="row align-items-center mt-2">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block select-gender">
                          <label className="gen-label">Status <span className="login-danger">*</span></label>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input type="radio" name="status"
                                value="accept"
                                className="form-check-input" checked={status === true}
                                onChange={handleStatusChange} disabled={data?._id} />Accept
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input type="radio" name="status" value="reject"
                                checked={status === false}
                                onChange={handleStatusChange}
                                className="form-check-input" disabled={data?._id} />Reject
                            </label>
                          </div>
                          <div className='error'>{error?.status_err}</div>
                        </div>
                      </div>
                    </div>
                    <div className="doctor-submit text-end">
                      {!data?._id ? (
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                          disabled={disable}>{disable ? "Processing..." : "Generate RT Clearance"}</button>
                      ) : (
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/rt-clearance-management')}>Back</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  )
}

export default ManageRtClearance