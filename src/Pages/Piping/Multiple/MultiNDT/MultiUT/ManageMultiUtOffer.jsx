import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import DropDown from '../../../../../Components/DropDown';
import { Pagination, Search } from '../../../Table';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import { V_URL } from '../../../../../BaseUrl';
import { useDispatch, useSelector } from 'react-redux';
import { getStockReportList } from '../../../../../Store/Store/Stock/getStockReportList';
import axios from 'axios';

const ManageMultiUtOffer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const data = location.state;
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setlimit] = useState(10);
  const [disable, setDisable] = useState(false);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    thickness: '',
    remarks: '',
  });

  console.log(data, '@@@ ===')

  useEffect(() => {
    dispatch(getStockReportList());
  }, []);
  const stockData = useSelector((state) => state?.getStockReportList?.user?.data);

  useEffect(() => {
    if (data?._id) {
      const updatedTableData = data?.items?.map((item) => {
        const stockItem = stockData?.find((stock) => stock.name === item?.grid_item_id?.item_name?.name);
        return {
          ...item,
          thickness: `${stockItem?.accepted_topBottom_thickness} / ${stockItem?.accepted_width_thickness} / ${stockItem?.accepted_normal_thickness}` || "",
        };
      });
      setTableData(updatedTableData);
    }
  }, [data?._id, stockData]);

  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      thickness: row.thickness,
      remarks: row.remarks,
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

  const filterAndPaginate = (data, searchTerm, currentPage, limit, setTotalItems) => {
    let filteredData = data;
    if (searchTerm) {
      filteredData = filteredData.filter(
        (i) =>
          i?.grid_item_id?.drawing_id?.drawing_no?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          i?.grid_item_id?.drawing_id?.assembly_no?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          i?.grid_item_id?.item_name?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
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

  const handleSubmit = () => {
    let updatedData = tableData;
    let isValid = true;

    updatedData.forEach(item => {
      if (item.thickness === '' || item.thickness === undefined) {
        isValid = false;
        toast.error(`Please enter thickness for ${item?.grid_item_id?.item_name?.name}`);
      }
    });

    if (!isValid) {
      return;
    }

    const filteredData = updatedData?.map(item => ({
      ...item,
      thickness: item.thickness,
      remarks: item.remarks || '-',
      drawing_id: item.drawing_id,
      grid_item_id: item.grid_item_id?._id,
      joint_type: item.joint_type.map((e) => e?._id),
      wps_no: item?.wps_no?._id,
      weldor_no: item?.weldor_no?._id
    }));

    setDisable(true);
    const myurl = `${V_URL}/user/manage-ndt-typewise-offer`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('offeredBy', localStorage.getItem('PAY_USER_ID'));
    bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'))
    bodyFormData.append('items', JSON.stringify(filteredData));
    bodyFormData.append('id', data?._id);
    bodyFormData.append('type', data?.ndt_type_id?.name);
    axios({
      method: "post",
      url: myurl,
      data: bodyFormData,
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((response) => {
      if (response.data.success === true) {
        toast.success(response.data.message);
        navigate('/piping/user/ut-offer-management');
      }
      setDisable(false);
    }).catch((error) => {
      toast.error("Something went wrong." || error.response.data?.message);
      setDisable(false);
    });

  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
        <Header handleOpen={handleOpen} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content">

            <PageHeader breadcrumbs={[
              { name: "Dashboard", link: "/piping/user/dashboard", active: false },
              { name: "Ultrasonic Test Offer List", link: "/piping/user/ut-offer-management", active: false },
              { name: `${data?._id ? 'Edit' : 'Add'} Ultrasonic Test Offer`, active: true }
            ]} />

            <div className='row'>
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <form>
                      <div className="col-12">
                        <div className="form-heading">
                          <h4>Manage Ultrasonic Offer Details</h4>
                        </div>
                      </div>

                      <div className='row'>
                        <div className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>NDT Offer No. </label>
                            <input className='form-control' value={data?.ndt_offer_no} readOnly />
                          </div>
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
                            <th>Drawing No.</th>
                            <th>Rev</th>
                            <th>Assem. No.</th>
                            <th>Section Details</th>
                            <th>Item No.</th>
                            <th>Grid No.</th>
                            <th>Grid Qty.</th>
                            <th>Joint Type</th>
                            <th>Welding Process</th>
                            <th>Weldor No.</th>
                            <th>Thickness(T/B,W,N)</th>
                            <th>Remarks</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commentsData?.map((elem, i) =>
                            <tr key={i}>
                              <td>{(currentPage - 1) * limit + i + 1}</td>
                              <td>{elem?.grid_item_id?.drawing_id?.drawing_no}</td>
                              <td>{elem?.grid_item_id?.drawing_id?.rev}</td>
                              <td>{elem?.grid_item_id?.drawing_id?.assembly_no}</td>
                              <td>{elem?.grid_item_id?.item_name?.name}</td>
                              <td>{elem?.grid_item_id?.item_no}</td>
                              <td>{elem?.grid_item_id?.grid_id?.grid_no}</td>
                              <td>{data?._id ? elem?.ut_use_qty : elem?.offer_used_grid_qty}</td>
                              <td>{elem?.joint_type?.map((e) => e?.name).join(", ")}</td>
                              <td>{elem?.wps_no?.weldingProcess}</td>
                              <td>{elem?.weldor_no?.welderNo}</td>
                              {(data?.status === 1) ? (
                                <>
                                  {editRowIndex === i ? (
                                    <>
                                      <td>
                                        <input className='form-control' type='text' value={editFormData?.thickness} onChange={handleEditFormChange} name='thickness' />
                                      </td>
                                      <td>
                                        <textarea className='form-control' onChange={handleEditFormChange} name='remarks' value={editFormData?.remarks} rows={1} />
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td onClick={() => handleEditClick(i, elem)}>{elem?.thickness || '-'}</td>
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
                              ) : <>
                                <td>{elem?.thickness}</td>
                                <td>{elem?.remarks || '-'}</td>
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

            <SubmitButton disable={disable} handleSubmit={handleSubmit} link={'/piping/user/ut-offer-management'} buttonName={'Generate UT Offer'} finalReq={data?.status !== 1 ? data?.items : []} />

          </div>
        </div>
      </div>
    </>
  )
}

export default ManageMultiUtOffer