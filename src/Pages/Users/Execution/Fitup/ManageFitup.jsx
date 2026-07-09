import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Include/Header'
import Sidebar from '../../Include/Sidebar'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserIssueAcceptance } from '../../../../Store/Store/Issue/IssueAcceptance';
import axios from 'axios';
import { PRODUCTION, V_URL } from '../../../../BaseUrl';
import toast from 'react-hot-toast';
import Footer from '../../Include/Footer';
import { getDrawing } from '../../../../Store/Erp/Planner/Draw/Draw';
import { getUserJointType } from '../../../../Store/Store/JointType/JointType';
import { Dropdown } from 'primereact/dropdown';
import DropDown from '../../../../Components/DropDown';
import { Pagination, Search } from '../../Table';
import { Save, X } from 'lucide-react';
import moment from 'moment';
import { MultiSelect } from 'primereact/multiselect';

const ManageFitup = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;
  const [fitup, setFitup] = useState({ issued_id: "", drawing_no: "" });
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});
  const [filterIssueData, setFilterIssueData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [issObj, setIssObj] = useState({});
  const [finalTable, setFinalTable] = useState([]);

  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);

  const [search2, setSearch2] = useState('');
  const [totalItems2, setTotalItems2] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [limit2, setlimit2] = useState(10);
  const [filteredDrawings, setFilteredDrawings] = useState([]);

  useEffect(() => {
    if (location.state?._id) {
      setFitup({
        issued_id: location.state.issue_id?._id,
        drawing_no: location.state?.items[0]?.transaction_id?.drawingId?._id,
      });
      setFinalTable(location?.state?.items);
    }
  }, [location.state]);

  useEffect(() => {
    dispatch(getUserIssueAcceptance());
    dispatch(getDrawing());
    dispatch(getUserJointType({ status: true }));
  }, [dispatch]);

  // console.log(data, '@@')

  const issuedData = useSelector((state) => state?.getUserIssueAcceptance?.user?.data);
  const jointData = useSelector((state) => state?.getUserJointType?.user?.data);
  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);


  useEffect(() => {
    const issuedDrawingIds = issuedData?.map(issue => issue.drawing_id._id);
    const filteredDraw = drawData?.filter(drawing =>
      issuedDrawingIds?.includes(drawing._id) && drawing?.project?._id === localStorage.getItem('U_PROJECT_ID')
    );
    setFilteredDrawings(filteredDraw);

    const findIssue = issuedData?.filter(is => is.items?.some(it => it.transaction_id?.drawingId === fitup.drawing_no));
    setFilterIssueData(findIssue);

    const filterData = findIssue?.find(it => it?._id === fitup?.issued_id);
    // if (!filterData) {
    //   setFitup({ ...fitup, issued_id: '' });
    // }

    // console.log(filterData?.items, 'filter')
    setTableData(filterData?.items || []);
    setIssObj(filterData);
  }, [issuedData, fitup.issued_id, fitup.drawing_no, drawData]);

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

  const commentsData2 = useMemo(() => filterAndPaginate(finalTable, search2, currentPage2, limit2, setTotalItems2),
    [currentPage2, search2, limit2, finalTable]);

  const handleChange = (e, name) => {
    setFitup({ ...fitup, [name]: e.value });
  }

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    joint_type: [],
    remarks: '',
    jointTypeName: [],
  });


  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      joint_type: Array.isArray(row.joint_type) ? row.joint_type : [],
      remarks: row.remarks,
      // jointTypeName: jointData.find(jt => jt._id === row.joint_type)?.name,
    })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'joint_type') {

      const selectedJointNames = jointData
        .filter((joint) => value.includes(joint._id))
        .map((joint) => joint.name);

      setEditFormData({
        ...editFormData,
        joint_type: value,
        jointTypeName: selectedJointNames.join(', '),
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };


  const handleSaveClick = () => {
    const updatedData = [...tableData];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = {
      ...updatedData[dataIndex],
      joint_type: editFormData.joint_type,
      remarks: editFormData.remarks,
      jointTypeName: editFormData.jointTypeName,
    };

    setTableData(updatedData);
    setEditRowIndex(null);
  };


  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleSubmit = () => {
    let updatedData = tableData;
    let isValid = true;
    let err = {};

    updatedData.forEach(item => {
      if (item.joint_type?.length === 0 || !item?.joint_type) {
        isValid = false;
        toast.error(`Please select Joint Type for ${item.transaction_id.itemName.name}`);
      }
    });

    if (!isValid) {
      setError(err);
      return;
    }

    const filteredData = tableData.map((item) => ({
      transaction_id: item.transaction_id?._id,
      joint_type: item.joint_type,
      remarks: item.remarks || '',
    }));

    if (validation()) {
      setDisable(true);
      const myurl = `${V_URL}/user/manage-fitup-inspection`;
      const formData = new URLSearchParams();
      formData.append('issue_id', fitup.issued_id);
      formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
      formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
      formData.append('items', JSON.stringify(filteredData));
      formData.append('drawing_id', fitup.drawing_no);
      if (data?._id) {
        formData.append('_id', data?._id);
      }
      axios({
        method: "post",
        url: myurl,
        data: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
      }).then((response) => {
        if (response.data?.success === true) {
          toast.success(response.data.message);
          navigate('/user/project-store/fitup-management');
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

  const drawOptions = filteredDrawings?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id
  }));

  const issueOptions = filterIssueData?.map(issue => ({
    label: issue?.issue_accept_no,
    value: issue?._id
  }));

  const validation = () => {
    var isValid = true;
    let err = {};
    if (!fitup.drawing_no) {
      isValid = false;
      err['drawing_no_err'] = 'Please select drawing no.'
    }
    if (fitup.drawing_no) {
      if (!fitup.issued_id) {
        isValid = false;
        err['issued_id_err'] = "Please select issue";
      }
    }
    setError(err);
    return isValid;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const jointTypeOptions = jointData?.map((n) => ({
    label: n?.name,
    value: n?._id
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
                  <li className="breadcrumb-item"><Link to="/user/project-store/dashboard">Dashboard </Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item"><Link to="/user/project-store/fitup-management">Fit-Up Inspection Offer List</Link></li>
                  <li className="breadcrumb-item"><i className="feather-chevron-right"></i></li>
                  <li className="breadcrumb-item active">{data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer</li>
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
                        <h4>{data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer Details</h4>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label> Drawing No. - REV - Assembly No. <span className="login-danger">*</span></label>
                          <Dropdown
                            options={drawOptions}
                            value={fitup.drawing_no}
                            onChange={(e) => handleChange(e, 'drawing_no')}
                            filter className='w-100'
                            placeholder="Select Drawing No."
                            disabled={data?._id}
                          />
                          <div className='error'>{error.drawing_no_err}</div>
                        </div>
                      </div>

                      {fitup?.drawing_no ? (
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="input-block local-forms custom-select-wpr">
                            <label> Issued List <span className="login-danger">*</span></label>
                            <Dropdown
                              options={issueOptions}
                              value={fitup.issued_id}
                              onChange={(e) => handleChange(e, 'issued_id')}
                              filter className='w-100'
                              placeholder="Select Issued Acceptance No."
                              disabled={data?._id}
                            />
                            <div className='error'>{error.issued_id_err}</div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {issObj && (
                      <>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Client </label>
                              <input className='form-control' value={issObj?.issue_req_id?.items[0]?.transaction_id?.drawingId?.project?.party?.name} readOnly />
                            </div>
                          </div>
                          <div className='col-12 col-md-4 col-xl-4'>
                            <div className="input-block local-forms">
                              <label>Work Order / PO No.</label>
                              <input className='form-control' value={issObj?.issue_req_id?.items[0]?.transaction_id?.drawingId?.project?.work_order_no} readOnly />
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>REV </label>
                              <input className='form-control' value={issObj?.issue_req_id?.items[0]?.transaction_id?.drawingId?.rev} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Sheet No. </label>
                              <input className='form-control' value={issObj?.issue_req_id?.items[0]?.transaction_id?.drawingId?.sheet_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Assembly No. </label>
                              <input className='form-control' value={issObj?.issue_req_id?.items[0]?.transaction_id?.drawingId?.assembly_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Issue Acceptance No.</label>
                              <input className='form-control' value={issObj?.issue_accept_no} readOnly />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {data?._id && (
                      <>
                        <div className='row'>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Fit-Up Offer Report No.</label>
                              <input className='form-control' value={data?.report_no} readOnly />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-4">
                            <div className="input-block local-forms">
                              <label>Fit-Up Offer By</label>
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
                                <label>Fit-Up Inspected Report No.</label>
                                <input className='form-control' value={data?.report_no_two} readOnly />
                              </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Fit-Up Inspected By</label>
                                <input className='form-control' value={data?.qc_name?.user_name} readOnly />
                              </div>
                            </div>

                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Fit-Up Inspected Date</label>
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
                  <div className="table-responsive mt-2">
                    <table className="table border-0 custom-table comman-table  mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Section Details</th>
                          <th>Grid No.</th>
                          <th>Item No.</th>
                          <th>Issued. Qty.</th>
                          <th>Issued. Width</th>
                          <th>Issued. Length</th>
                          <th>Imir No.</th>
                          <th>Heat No.</th>
                          {!data?._id && (
                            <>
                              <th>Joint Type</th>
                              <th>Remarks</th>
                            </>
                          )}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commentsData?.map((elem, i) =>
                          <tr key={elem?._id}>
                            <td>{i + 1}</td>
                            {/* <td>{drawData}</td> */}
                            <td>{elem?.transaction_id?.itemName?.name}</td>
                            <td>{elem?.transaction_id?.grid_no}</td>
                            <td>{elem?.transaction_id?.item_no}</td>
                            <td>{elem?.issued_qty}</td>
                            <td>{elem?.issued_width}</td>
                            <td>{elem?.issued_length}</td>
                            <td>{elem?.imir_no}</td>
                            <td>{elem?.heat_no}</td>
                            {!data?._id && (
                              <>
                                {editRowIndex === i ? (
                                  <>
                                    <td>
                                      <MultiSelect
                                        value={editFormData?.joint_type || []}
                                        onChange={(e) => handleEditFormChange({ target: { name: 'joint_type', value: e.value } })}
                                        options={jointTypeOptions}
                                        optionLabel="label"
                                        placeholder="Select Joint Type"
                                        display="chip"
                                        className="w-100 multi-prime-react"
                                      />
                                    </td>
                                    <td>
                                      <textarea className='form-control' rows={1}
                                        value={editFormData?.remarks} name='remarks'
                                        onChange={handleEditFormChange} />
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td onClick={() => handleEditClick(i, elem)}>
                                      {elem?.jointTypeName || '--'}
                                    </td>

                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                  </>
                                )}
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

          {!data?._id ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="col-12">
                      <div className="doctor-submit text-end">
                        <button type="button"
                          className="btn btn-primary submit-form me-2" onClick={handleSubmit}
                          disabled={disable}>{disable ? "Processing..." : (data?._id ? 'Update' : 'Generate Fit-Up Offer')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {data?._id && (
            <div className='row'>
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Fit-Up List</h3>
                            <div className="doctor-search-blk">
                              <div className="top-nav-search table-search-blk">
                                <form>
                                  <Search onSearch={(value) => {
                                    setSearch2(value);
                                    setCurrentPage2(1);
                                  }} />
                                  <a className="btn"><img src="/assets/img/icons/search-normal.svg"
                                    alt="search" /></a>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pageDropDown col-auto text-end float-end ms-auto download-grp">
                          <DropDown limit={limit2} onLimitChange={(val) => setlimit2(val)} />
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
                            <th>Remarks</th>
                            <th>WPS No.</th>
                            <th>Ins. Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData2?.map((elem, i) =>
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{elem?.transaction_id?.itemName?.name}</td>
                              <td>{elem?.transaction_id?.quantity}</td>
                              <td>{elem?.transaction_id?.item_no}</td>
                              <td>{elem?.transaction_id?.grid_no}</td>
                              <td>{elem?.joint_type?.map((jt) => jt.name).join(', ') || '-'}</td>
                              <td>{elem?.remarks || '-'}</td>
                              <td>{elem?.wps_no?.wpsNo || '-'}</td>
                              <td>{elem?.qc_remarks || '-'}</td>
                            </tr>
                          )}
                          {commentsData2?.length === 0 ? (
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
                          aria-live="polite">Showing {Math.min(limit2, totalItems2)} from {totalItems2} data</div>
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xxl-6 ">
                        <div className="dataTables_paginate paging_simple_numbers"
                          id="DataTables_Table_0_paginate">
                          <Pagination
                            total={totalItems2}
                            itemsPerPage={limit2}
                            currentPage={currentPage2}
                            onPageChange={(page) => setCurrentPage2(page)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div >
    </div>
  )
}

export default ManageFitup