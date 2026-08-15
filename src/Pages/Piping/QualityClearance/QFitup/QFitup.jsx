import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserFitup } from '../../../../Store/Store/Execution/getUserFitup';
import { Pagination, Search } from '../../Table';
import DropDown from '../../../../Components/DropDown';
import { getUserWpsMaster } from '../../../../Store/Store/WpsMaster/WpsMaster';
import { V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { Save, X } from 'lucide-react';

const QFitup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(false);
  const [quality, setQuality] = useState({ drawNo: '', fitup: '' });
  const [filterFitup, setFilterFitup] = useState([]);
  const [fitObj, setFitObj] = useState({});
  const [tableData, setTableData] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState({});
  const data = location.state;

  useEffect(() => {
    dispatch(getUserFitup({ status: 1 }))
    dispatch(getUserWpsMaster({ status: true }));
    dispatch(getDrawing());
  }, [dispatch, data?._id]);

  useEffect(() => {
    if (data) {
      setQuality({
        drawNo: data?.items[0]?.transaction_id?.drawingId?._id,
        fitup: data?._id,
      });
    }
  }, [data]);

  const entity = useSelector((state) => state?.getUserFitup?.user?.data);
  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);
  const wpsData = useSelector((state) => state?.getUserWpsMaster?.user?.data);

  useEffect(() => {
    const filteredData = entity?.filter(en => en.items?.some(it => it?.transaction_id?.drawingId?._id === quality.drawNo));
    setFilterFitup(filteredData);
    const selectedFitup = filterFitup?.find(fit => fit?._id === quality?.fitup);
    setFitObj(selectedFitup);
    setTableData(selectedFitup?.items || []);
    // eslint-disable-next-line
  }, [entity, quality.drawNo, quality?.fitup, data?._id]);

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

  const handleStatusChange = (event) => {
    setStatus(event.target.value === 'accept');
  };

  const handleChange = (e, name) => {
    setQuality({ ...quality, [name]: e.value });
  }

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    wps_no: '',
    qc_remarks: '',
    wpsName: '',
  });

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      wps_no: row.wps_no,
      qc_remarks: row.qc_remarks,
      wpsName: wpsData.find(w => w._id === row.wps_no)?.wpsNo,
    });
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const selectedWPS = wpsData.find(wp => wp._id === value);
    if (name === 'wps_no' || name === 'wpsName') {
      setEditFormData({ ...editFormData, wps_no: value, wpsName: selectedWPS?.wpsNo });
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

  const handleSubmit = () => {
    let updatedData = tableData;
    let isValid = true;
    let err = {};
    updatedData.forEach(item => {
      if (item.wps_no === '' || item.wps_no === undefined) {
        isValid = false;
        toast.error(`Please select wps no. for ${item.transaction_id.itemName.name}`);
      }
    });
    if (!isValid) {
      setError(err);
      return;
    }

    const filteredData = updatedData.map(item => ({
      transaction_id: item.transaction_id?._id,
      wps_no: item.wps_no,
      joint_type: item.joint_type?.map((e) => e?._id),
      qc_remarks: item.qc_remarks || '',
    }));

    if (validation()) {
      setDisable(true);
      const myurl = `${V_URL}/user/get-fitup-inspection-approval`;
      const formData = new URLSearchParams();
      formData.append('id', quality.fitup);
      formData.append('items', JSON.stringify(filteredData));
      formData.append('qc_name', localStorage.getItem('PAY_USER_ID'));
      formData.append('status', status);
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));

      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          navigate('/piping/user/fitup-clearance-management')
        } else {
          toast.error(response?.data?.message);
        }
        setDisable(false);
      }).catch((error) => {
        toast.error(error?.response?.data?.message);
        setDisable(false);
      })
    }
  }

  const validation = () => {
    let isValid = true;
    let err = {};

    if (!quality?.drawNo) {
      isValid = false;
      err['draw_err'] = 'Please select drawing no.';
    }

    if (quality.drawNo) {
      if (!quality.fitup) {
        isValid = false;
        err['fitup_err'] = 'Please select fitup';
      }
    }

    if (status === null) {
      isValid = false;
      err['status_err'] = 'Please select approval status';
    }
    setError(err);
    return isValid
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const drawOptions = drawData?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id
  }));

  const fitOptions = filterFitup?.map(fi => ({
    label: fi?.report_no,
    value: fi?._id
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
                  <li className="breadcrumb-item active">Fit-Up Inspection Report List</li>
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
                        <h4>Manage Fit-Up Inspection Report Details</h4>
                      </div>
                    </div>
                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={drawOptions}
                            value={quality.drawNo}
                            onChange={(e) => handleChange(e, 'drawNo')}
                            filter className='w-100'
                            placeholder="Select Drawing No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error?.draw_err}</div>
                        </div>
                      </div>

                      {quality.drawNo ? (
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="input-block local-forms custom-select-wpr">
                            <label> Fit-Up Offer List <span className="login-danger">*</span></label>
                            <Dropdown
                              options={fitOptions}
                              value={quality.fitup}
                              onChange={(e) => handleChange(e, 'fitup')}
                              filter className='w-100'
                              placeholder="Select Fit-Up Offer No."
                              disabled={data?._id}
                            />
                            <div className='error'>{error?.fitup_err}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {quality?.fitup ? (
                      <>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Client </label>
                              <input className='form-control' value={fitObj?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                            </div>
                          </div>
                          <div className='col-12 col-md-4 col-xl-4'>
                            <div className="input-block local-forms">
                              <label>Work Order / PO No.</label>
                              <input className='form-control' value={fitObj?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>REV </label>
                              <input className='form-control' value={fitObj?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Sheet No. </label>
                              <input className='form-control' value={fitObj?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Assembly No. </label>
                              <input className='form-control' value={fitObj?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : null}
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
                          <h3>Fitup Acceptance List</h3>
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
                  <div className="table-responsive">
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Section Details</th>
                          <th>Quantity</th>
                          <th>Item No.</th>
                          <th>Grid No.</th>
                          <th>Joint Type</th>
                          <th>WPS No.</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, i) =>
                          <tr key={elem._id}>
                            <td>{i + 1}</td>
                            <td>{elem?.transaction_id?.itemName?.name}</td>
                            <td>{elem?.transaction_id?.quantity}</td>
                            <td>{elem?.transaction_id?.item_no}</td>
                            <td>{elem?.transaction_id?.grid_no}</td>
                            <td>{elem?.joint_type?.map((e) => e.name).join(', ') || '-'}</td>
                            {editRowIndex === i ? (
                              <>
                                <td>
                                  <select className='form-control form-select'
                                    value={editFormData.wps_no} name='wps_no'
                                    onChange={handleEditFormChange}>
                                    <option value="">Select WPS No.</option>
                                    {/* {wpsData?.filter((wps) => wps.jointType.some((joint) => elem.joint_type?.some((e) => e?._id === joint?.jointId?._id)))
                                      .map((e) => (
                                        <option key={e._id} value={e._id}>
                                          {e.wpsNo}
                                        </option>
                                      ))} */}
                                    {wpsData
                                      ?.filter((wps) => {
                                        const elemJointIds = elem.joint_type?.map((e) => e._id) || [];
                                        const wpsJointIds = wps.jointType?.map((joint) => joint.jointId?._id) || [];

                                        return elemJointIds.every((id) => wpsJointIds.includes(id));
                                      })
                                      .map((e) => (
                                        <option key={e._id} value={e._id}>
                                          {e.wpsNo}
                                        </option>
                                      ))}
                                  </select>
                                </td>

                                <td>
                                  <textarea className='form-control' onChange={handleEditFormChange} name='qc_remarks' value={editFormData?.qc_remarks} rows={1} />
                                </td>
                              </>
                            ) : (
                              <>
                                <td onClick={() => handleEditClick(i, elem)}>{elem?.wpsName || '-'}</td>
                                <td onClick={() => handleEditClick(i, elem)}>{elem?.qc_remarks || '-'}</td>
                              </>
                            )}
                            {editRowIndex === i ? (
                              <td>
                                <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                              </td>
                            ) : <td>-</td>}
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
                                onChange={handleStatusChange} />Accept
                            </label>
                          </div>
                          <div className="form-check-inline">
                            <label className="form-check-label">
                              <input type="radio" name="status" value="reject"
                                checked={status === false}
                                onChange={handleStatusChange}
                                className="form-check-input" />Reject
                            </label>
                          </div>
                          <div className='error'>{error?.status_err}</div>
                        </div>
                      </div>
                    </div>
                    <div className="doctor-submit text-end">
                      <button type="button"
                        className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                        disabled={disable}>{disable ? "Processing..." : "Generate Fit-Up Acceptance"}</button>
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

export default QFitup