import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUserAdminDraw } from '../../../../Store/Erp/Planner/Draw/UserAdminDraw';
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import DropDown from '../../../../Components/DropDown';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../Include/Footer';
import { Pagination, Search } from '../../Table';
import moment from 'moment';
import { V_URL } from '../../../../BaseUrl';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserIssueRequest } from '../../../../Store/Store/Issue/IssueRequest';
import { getUserContractor } from '../../../../Store/Store/ContractorMaster/ContractorMaster';
import { Dropdown } from 'primereact/dropdown';
import { Save, X } from 'lucide-react';
import { getStockReportList } from '../../../../Store/Store/Stock/getStockReportList';

const IssueRequest = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [entity, setEntity] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [totalItems2, setTotalItems2] = useState(0);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [limit2, setlimit2] = useState(10);
  const [issueRequest, setIssueRequest] = useState({ name: '', drawNo: '' });
  const [disable, setDisable] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState([]);
  const [drawObj, setDrawObj] = useState({});
  const [finalReq, setFinalReq] = useState([]);

  const data = location.state;
  // console.log(data, 'draw @@');

  useEffect(() => {
    if (location.state?._id) {
      setIssueRequest({
        name: data?.items[0]?.transaction_id?.drawingId?.issued_person?._id,
        drawNo: data?.items[0]?.transaction_id?.drawingId?._id
      })
      setFinalReq(data?.items);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(getUserAdminDraw()),
        dispatch(getUserContractor({ status: true })),
        dispatch(getUserIssueRequest()),
        dispatch(getStockReportList())
      ])
    }
    fetchData();
  }, [dispatch]);

  const contractorData = useSelector(state => state.getUserContractor?.user?.data);
  const drawData = useSelector(state => state.getUserAdminDraw?.user?.data);
  const issueData = useSelector((state) => state?.getUserIssueRequest?.user?.data);
  const stockData = useSelector((state) => state.getStockReportList?.user?.data);

  useEffect(() => {
    const filterDraw = drawData?.filter(dr => dr.issued_person?._id === issueRequest.name && dr?.project?._id === localStorage.getItem('U_PROJECT_ID'));
    setEntity(filterDraw);
    if (filterDraw) {
      const sectionData = filterDraw?.find((it) => it._id === issueRequest.drawNo);
      if (sectionData) {
        setSelectedDraw(sectionData?.items || []);
        setDrawObj(sectionData);
      }
    }
    if (!data?._id) {
      const findIssue = issueData?.find(is => is?.items?.some(i => i?.transaction_id?.drawingId?._id === issueRequest.drawNo));
      setFinalReq(findIssue?.items);
    }
  }, [drawData, issueRequest.name, issueRequest.drawNo]);

  const commentsData = useMemo(() => {
    let computedComments = selectedDraw;
    if (search) {
      computedComments = computedComments.filter(
        (i) =>
          i?.itemName?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          i?.item_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
          i?.grid_no?.toLowerCase()?.includes(search?.toLowerCase())
      );
    }
    setTotalItems(computedComments?.length);
    return computedComments?.slice(
      (currentPage - 1) * limit,
      (currentPage - 1) * limit + limit
    );
  }, [currentPage, search, limit, selectedDraw]);

  const commentsData2 = useMemo(() => {
    let computedComments = finalReq;
    if (search2) {
      computedComments = computedComments.filter(
        (i) =>
          i?.transaction_id?.itemName?.name?.toLowerCase()?.includes(search2?.toLowerCase()) ||
          i?.transaction_id?.item_no?.toLowerCase()?.includes(search2?.toLowerCase()) ||
          i?.transaction_id?.grid_no?.toLowerCase()?.includes(search2?.toLowerCase())
      );
    }
    setTotalItems2(computedComments?.length);
    return computedComments?.slice(
      (currentPage2 - 1) * limit2,
      (currentPage2 - 1) * limit2 + limit2
    );
  }, [limit2, currentPage2, search2, finalReq]);

  const handleChange = (e, name) => {
    setIssueRequest({ ...issueRequest, [name]: e.value });
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const conOptions = contractorData?.map(e => ({
    label: e?.name,
    value: e?._id
  }));

  const drawOptions = entity?.map(drawing => ({
    label: `${drawing.drawing_no} - ${drawing.rev} - ${drawing.assembly_no}`,
    value: drawing._id
  }));

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    quantity: '',
    item_length: '',
    item_width: '',
    remarks: ''
  });

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      quantity: row.quantity,
      item_length: row.item_length,
      item_width: row.item_width,
      remarks: row.remarks || ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'quantity' || name === 'item_length' || name === 'item_width') {
      if (/^\d*$/.test(value)) {
        setEditFormData({ ...editFormData, [name]: value });
      }
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleSaveClick = () => {
    const updatedData = [...selectedDraw];
    const dataIndex = (currentPage - 1) * limit + editRowIndex;
    updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
    setSelectedDraw(updatedData);
    setEditRowIndex(null);
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
  };

  const handleSubmit = () => {
    let updatedData = selectedDraw;
    if (editRowIndex !== null) {
      updatedData = [...selectedDraw];
      const dataIndex = (currentPage - 1) * limit + editRowIndex;
      updatedData[dataIndex] = { ...updatedData[dataIndex], ...editFormData };
      setSelectedDraw(updatedData);
    }

    for (const item of updatedData) {
      const stockItem = stockData?.filter(stock => stock.itemId === item.itemName?._id);
      const totalBalanceQty = stockItem.reduce((sum, stock) => sum + stock.balance_qty, 0);
      if (totalBalanceQty < item.quantity) {
        toast.error(`Insufficient stock for item: ${item.itemName?.name}. Available: ${totalBalanceQty}`);
        return;
      }
    }
    const filteredData = updatedData.map(item => ({
      transaction_id: item._id,
      requested_length: item.item_length,
      requested_width: item.item_width,
      requested_qty: item.quantity,
      remarks: item.remarks || '',
    }));
    setDisable(true);
    const myurl = `${V_URL}/user/manage-issue-request`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('requested_by', localStorage.getItem('PAY_USER_ID'));
    bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
    bodyFormData.append('items', JSON.stringify(filteredData));
    bodyFormData.append('drawing_id', issueRequest.drawNo);
    if (data?._id) {
      bodyFormData.append('id', data?._id);
    }
    axios({
      method: 'post',
      url: myurl,
      data: bodyFormData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: "Bearer " + localStorage.getItem('PAY_USER_TOKEN') }
    }).then((response) => {
      if (response.data.success === true) {
        toast.success(response.data.message);
        dispatch(getUserIssueRequest());
        navigate('/user/project-store/issue-request-management')
      }
      setDisable(false);
    }).catch((error) => {
      console.log(error, '!!');
      toast.error(error?.response?.data?.message)
      setDisable(false);
    })
  };
  
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
                    <Link to="/user/project-store/dashboard">Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/user/project-store/issue-request-management">
                      Issue Request List
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    {data?._id ? "Edit" : "Add"} Issue Request
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2">
                    <div className="row align-items-center">
                      <div className="col">
                        <div className="doctor-table-blk">
                          <h3>Issue Request List</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="staff-search-table">
                    <form>
                      <div className="row">
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="input-block local-forms custom-select-wpr">
                            <label>Issued Person / Contractor Name</label>
                            <Dropdown
                              options={conOptions}
                              value={issueRequest.name}
                              onChange={(e) => handleChange(e, 'name')}
                              filter className='w-100'
                              placeholder="Select Contractor"
                              disabled={data?._id}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-6">
                          <div className="input-block local-forms custom-select-wpr">
                            <label>Drawing No.</label>
                            <Dropdown
                              options={drawOptions}
                              value={issueRequest.drawNo}
                              onChange={(e) => handleChange(e, 'drawNo')}
                              filter className='w-100'
                              placeholder="Select Drawing"
                              disabled={!issueRequest.name || data?._id}
                            />
                          </div>
                        </div>
                      </div>
                      {drawObj && Object.keys(drawObj).length > 0 && (
                        <>
                          <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Client</label>
                                <input className='form-control' value={drawObj?.project?.party?.name} readOnly />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Master Updation Date</label>
                                <input className='form-control' value={moment(drawObj?.master_updation_date).format('YYYY-MM-DD')} readOnly />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Received Date</label>
                                <input className='form-control' value={moment(drawObj?.draw_receive_date).format('YYYY-MM-DD')} readOnly />
                              </div>
                            </div>
                          </div>

                          <div className='row'>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>REV</label>
                                <input className='form-control' value={drawObj?.rev} readOnly />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Sheet No.</label>
                                <input className='form-control' value={drawObj?.sheet_no} readOnly />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Assembly No.</label>
                                <input className='form-control' value={drawObj?.assembly_no} readOnly />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Assembly Qty.</label>
                                <input className='form-control' value={drawObj?.assembly_quantity} readOnly />
                              </div>
                            </div>
                            <div className="col-12 col-md-4 col-xl-4">
                              <div className="input-block local-forms">
                                <label>Area</label>
                                <input className='form-control' value={drawObj?.unit} readOnly />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!data?._id ? (
            <>
              <div className="row">
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
                                    <Search
                                      onSearch={(value) => {
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
                      <div className="table-responsive mt-2">
                        <table className="table border-0 custom-table comman-table  mb-0">
                          <thead>
                            <tr>
                              <th>Sr.</th>
                              <th>Section Details</th>
                              <th>Item No.</th>
                              <th>Grid No.</th>
                              <th>Qty.</th>
                              <th>Length(mm)</th>
                              <th>Width(mm)</th>
                              <th>Remarks</th>
                              <th>Item Weight(kg)</th>
                              <th>Assem. Weight(kg)</th>
                              <th>ASM(sqm)</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {commentsData?.map((elem, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{elem?.itemName?.name}</td>
                                <td>{elem?.item_no}</td>
                                <td>{elem?.grid_no}</td>
                                {editRowIndex === i ? (
                                  <>
                                    <td>
                                      <input className='form-control'
                                        type="number"
                                        name="quantity"
                                        value={editFormData.quantity}
                                        onChange={handleEditFormChange}
                                        disabled={data?._id}
                                      />
                                    </td>
                                    <td>
                                      <input className='form-control'
                                        type="number"
                                        name="item_length"
                                        value={editFormData.item_length}
                                        onChange={handleEditFormChange}
                                        disabled={data?._id}
                                      />
                                    </td>
                                    <td>
                                      <input className='form-control'
                                        type="number"
                                        name="item_width"
                                        value={editFormData.item_width}
                                        onChange={handleEditFormChange}
                                        disabled={data?._id}
                                      />
                                    </td>
                                    <td>
                                      <textarea className='form-control'
                                        name="remarks" rows={1}
                                        value={editFormData.remarks}
                                        onChange={handleEditFormChange}
                                        disabled={data?._id}
                                      />
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.quantity}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.item_length}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.item_width}</td>
                                    <td onClick={() => handleEditClick(i, elem)}>{elem?.remarks || '-'}</td>
                                  </>
                                )}
                                <td>{elem?.item_weight}</td>
                                <td>{elem?.assembly_weight}</td>
                                <td>{elem?.assembly_surface_area}</td>
                                {editRowIndex === i ? (
                                  <td>
                                    <button type="button" className='btn btn-success p-1 mx-1' onClick={handleSaveClick}><Save /></button>
                                    <button type="button" className='btn btn-secondary p-1 mx-1' onClick={handleCancelClick}><X /></button>
                                  </td>
                                ) : <td>-</td>}
                              </tr>
                            ))}

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

              {(finalReq?.length === 0 || finalReq === undefined) && (
                <div className='row'>
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="col-12 text-end">
                          <div className="doctor-submit text-end">
                            <button type="button"
                              className="btn btn-primary submit-form me-2" onClick={handleSubmit} disabled={disable}>
                              {disable ? 'Processing...' : 'Generate Issue Request'}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}

          {(data?._id || finalReq?.length > 0) ? (
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table show-entire">
                  <div className="card-body">
                    <div className="page-table-header mb-2">
                      <div className="row align-items-center">
                        <div className="col">
                          <div className="doctor-table-blk">
                            <h3>Material Issued Request List</h3>
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
                      </div>
                    </div>
                    <div className="table-responsive mt-2">
                      <table className="table border-0 custom-table comman-table  mb-0">
                        <thead>
                          <tr>
                            <th>Sr.</th>
                            {/* <th>Drawing No.</th> */}
                            <th>Section Details</th>
                            <th>Req. Qty.</th>
                            <th>Req. Width</th>
                            <th>Req. Length</th>
                            {/* <th>Req. By</th> */}
                            <th>Date</th>
                            <th>Reamrks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData2?.map((elem, i) =>
                            <tr key={elem?._id}>
                              <td>{i + 1}</td>
                              {/* <td>{elem?.transaction_id?.drawingId?.drawing_no}</td> */}
                              <td>{elem?.transaction_id?.itemName?.name}</td>
                              <td>{elem?.requested_qty}</td>
                              <td>{elem?.requested_width}</td>
                              <td>{elem?.requested_length}</td>
                              {/* <td>{data?.requested_by?.user_name}</td> */}
                              <td>{moment(elem?.createdAt).format('YYYY-MM-DD')}</td>
                              <td>{elem?.remarks}</td>
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
          ) : null}
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default IssueRequest