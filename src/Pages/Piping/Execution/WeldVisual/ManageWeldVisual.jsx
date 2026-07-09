import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFitup } from '../../../../Store/Store/Execution/getUserFitup';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserWelderMaster } from '../../../../Store/Store/WelderMaster/WelderMaster';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import { Dropdown } from 'primereact/dropdown';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import moment from 'moment';

const ManageWeldVisual = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const data = location.state;
  const [weldVisual, setWeldVisual] = useState({ fitup: "", drawNo: "" });
  const [fitVal, setFitVal] = useState({});
  const [finalFit, setFinalFit] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);

  const [drawFilter, setDrawFilter] = useState([]);

  useEffect(() => {
    if (location.state?._id) {
      setWeldVisual({
        drawNo: location.state?.items[0]?.transaction_id?.drawingId?._id,
        fitup: location.state?.fitup_id?._id
      });
      setTableData(location.state?.items);
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(getUserFitup({ status: 2 }));
    dispatch(getDrawing());
    dispatch(getUserWelderMaster({ status: true }));
  }, [dispatch]);

  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const fitupData = useSelector((state) => state?.getUserFitup?.user?.data);
  const welderData = useSelector((state) => state?.getUserWelderMaster?.user?.data);

  useEffect(() => {
    const fitupDrawIds = fitupData?.map((ft) => ft?.drawing_id);
    const filteredDraw = drawData?.filter((dr) =>
      fitupDrawIds?.includes(dr._id) && dr?.project?._id === localStorage.getItem('U_PROJECT_ID')
    );
    setDrawFilter(filteredDraw || []);

    const filterFitup = fitupData?.filter(fi => fi?.items?.some(it => it.transaction_id?.drawingId?._id === weldVisual.drawNo));
    setFinalFit(filterFitup);

    const seletcedFit = filterFitup?.find(fi => fi._id === weldVisual.fitup);
    setFitVal(seletcedFit);
    if (!data?._id) {
      setTableData(seletcedFit?.items || []);
    }
  }, [fitupData, weldVisual.drawNo, weldVisual.fitup, drawData]);


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

  const commentsData = useMemo(
    () => filterAndPaginate(tableData, search, currentPage, limit, setTotalItems),
    [currentPage, search, limit, tableData]
  );

  const handleChange = (e, name) => {
    setWeldVisual({ ...weldVisual, [name]: e.value });
  }

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    weldor_no: '',
    remarks: '',
    weldorName: '',
  });

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      weldor_no: row.weldor_no,
      remarks: row.remarks,
      weldorName: welderData.find(w => w._id === row.weldor_no)?.welderNo,
    })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const selectedWeldor = welderData.find(w => w._id === value);
    if (name === 'weldor_no' || name === 'weldorName') {
      setEditFormData({ ...editFormData, weldor_no: value, weldorName: selectedWeldor?.welderNo });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
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

  const getJointTypes = (transactionId) => {
    const fitupItems = fitVal?.items || [];
    const match = fitupItems.find(item => item.transaction_id?._id === transactionId);
    return match?.joint_type?.map(joint => joint.name).join(", ") || "-";
  }

  const handleSubmit = () => {
    let updatedData = tableData;
    let isValid = true;
    let err = {};
    updatedData.forEach(item => {
      if (item.weldor_no === '' || item.weldor_no === undefined) {
        isValid = false;
        toast.error(`Please select weldor no. for ${item.transaction_id.itemName.name}`);
      }
    });
    if (!isValid) {
      setError(err);
      return;
    }

    const filteredData = updatedData.map(item => ({
      transaction_id: item.transaction_id?._id,
      weldor_no: item.weldor_no,
      remarks: item.remarks || '-',
    }));

    if (validation()) {
      setDisable(true);
      const myurl = `${V_URL}/user/manage-weld-inspection-offer`;
      const formData = new URLSearchParams();
      formData.append('items', JSON.stringify(filteredData));
      formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('fitup_id', weldVisual.fitup);
      formData.append('drawing_id', weldVisual.drawNo);
      if (data?._id) {
        formData.append('id', data._id);
      }
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/piping/user/weld-visual-management');
          handleClear()
        } else {
          toast.error(response.data.message);
        }
        setDisable(false);
      }).catch((error) => {
        console.log(error, "error");
        toast.error(error?.response?.data?.message);
        setDisable(false);
      })

    }
  }

  const handleClear = () => {
    setWeldVisual({ fitup: "", drawNo: "" });
  }

  const validation = () => {
    var isValid = true;
    let err = {};

    if (!weldVisual?.drawNo) {
      isValid = false;
      err['drawNo_err'] = 'Please select drawing no.';
    }

    if (weldVisual?.drawNo) {
      if (!weldVisual?.fitup) {
        isValid = false;
        err['fitup_err'] = 'Please select fitup';
      }
    }

    setError(err);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawOptions = drawFilter?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id
  }));

  const fitOptions = finalFit?.map(fit => ({
    label: fit?.report_no_two,
    value: fit?._id
  }));

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
                  <li className="breadcrumb-item"><Link to="/piping/user/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/piping/user/weld-visual-management">Weld Visual List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Weld Visual</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? 'Edit' : 'Add'} Weld Visual Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={drawOptions}
                            value={weldVisual.drawNo}
                            onChange={(e) => handleChange(e, 'drawNo')}
                            filter className='w-100'
                            placeholder="Select Drawing No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error.drawNo_err}</div>
                        </div>
                      </div>

                      {weldVisual?.drawNo ? (
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="input-block local-forms custom-select-wpr">
                            <label> Fit-Up Report No. <span className="login-danger">*</span></label>
                            <Dropdown
                              options={fitOptions}
                              value={weldVisual.fitup}
                              onChange={(e) => handleChange(e, 'fitup')}
                              filter className='w-100'
                              placeholder="Select Fit-Up Report No."
                              disabled={data?._id}
                            />
                            <div className='error'>{error?.fitup_err}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {weldVisual?.fitup ? (
                      <>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Client No.</label>
                              <input className="form-control" value={fitVal?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Project PO No.</label>
                              <input className="form-control" value={fitVal?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Drawing No.</label>
                              <input className="form-control" value={fitVal?.items[0]?.transaction_id?.drawingId?.drawing_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>REV</label>
                              <input className="form-control" value={fitVal?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Assembly No.</label>
                              <input className="form-control" value={fitVal?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {data?._id && (
                      <>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Weld Visual Offer Report No.</label>
                              <input className='form-control' value={data?.weld_report_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Weld Visual Offer By</label>
                              <input className='form-control' value={data?.offered_by?.user_name} readOnly />
                            </div>
                          </div>

                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <p className='m-0' style={{ fontSize: "12px" }}>Status</p>
                              <span className='status-badge'>
                                {data?.status === 1 ? (
                                  <span className="custom-badge status-orange">Pending</span>
                                ) : data?.status === 2 ? (
                                  <span className="custom-badge status-green">Accepted</span>
                                ) : data?.status === 3 ? (
                                  <span className="custom-badge status-pink">Rejected</span>
                                ) : null}
                              </span>
                            </div>
                          </div>
                        </div>

                        {(data?.status === 2 || data?.status === 3) && (
                          <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Weld Visual Inspected Report No.</label>
                                <input className='form-control' value={data?.weld_report_qc_no} readOnly />
                              </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Weld Visual Inspected By</label>
                                <input className='form-control' value={data?.qc_name?.user_name} readOnly />
                              </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Weld Visual Inspected Date</label>
                                <input className='form-control' value={moment(data?.qc_time).format('YYYY-MM-DD')} readOnly />
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                  </form>
                </div>
              </div>
            </div>
          </div>

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
                              <form>
                                <Search onSearch={(value) => {
                                  setSearch(value);
                                  setCurrentPage(1);
                                }} />
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
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Section Details</th>
                          <th>Quantity</th>
                          <th>Item No.</th>
                          <th>Grid No.</th>
                          <th>Type Of Weld</th>
                          <th>WPS No.</th>
                          <th>Welding Process</th>
                          <th>Welder No.</th>
                          <th>Remarks</th>
                          {data?._id && (
                            <th>Ins. Remarks</th>
                          )}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, i) =>
                          <tr>
                            <td>{i + 1}</td>
                            <td>{elem?.transaction_id?.itemName?.name}</td>
                            <td>{elem?.transaction_id?.quantity}</td>
                            <td>{elem?.transaction_id?.item_no}</td>
                            <td>{elem?.transaction_id?.grid_no}</td>
                            {!data?._id ? (
                              <>
                                <td>{elem?.joint_type?.map((e) => e?.name)?.join(', ')}</td>
                                <td>{elem?.wps_no?.wpsNo}</td>
                                <td>{elem?.wps_no?.weldingProcess}</td>
                                <>
                                  {editRowIndex === i ? (
                                    <>
                                      <td>
                                        <select className='form-control form-select'
                                          value={editFormData.weldor_no} name='weldor_no'
                                          onChange={handleEditFormChange}>
                                          <option value="">Select Weldor No.</option>
                                          {welderData?.filter(we => we?.wpsNo?._id === elem?.wps_no?._id).map((e) =>
                                            <option key={e._id} value={e._id}>{e.welderNo}</option>
                                          )}
                                        </select>
                                      </td>
                                      <td>
                                        <textarea className='form-control' rows={1}
                                          value={editFormData?.remarks} name='remarks'
                                          onChange={handleEditFormChange} />
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td onClick={() => handleEditClick(i, elem)}>{elem?.weldorName || '-'}</td>
                                      <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                    </>
                                  )}
                                  {editRowIndex === i ? (
                                    <td>
                                      <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                      <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                    </td>
                                  ) : <td>-</td>}
                                </>
                              </>
                            ) : <>
                              <td>{getJointTypes(elem?.transaction_id?._id)}</td>
                              <td>{elem?.weldor_no?.wpsNo?.wpsNo}</td>
                              <td>{elem?.weldor_no?.wpsNo?.weldingProcess}</td>
                              <td>{elem?.weldor_no?.welderNo}</td>
                              <td>{elem?.remarks || '-'}</td>
                              <td>{elem?.qc_remarks || '-'}</td>
                              <td>-</td>
                            </>}
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
                    <div className="doctor-submit text-end">
                      {!data?._id ? (
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                          disabled={disable}>{disable ? "Processing..." : "Generate Weld Visual Offer"}</button>
                      ) : (
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={() => navigate('/piping/user/weld-visual-management')}>Back</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div >
    </div >
  )
}

export default ManageWeldVisual