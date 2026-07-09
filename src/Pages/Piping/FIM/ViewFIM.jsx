import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Include/Header';
import Sidebar from '../Include/Sidebar';
import Footer from '../Include/Footer';
import moment from 'moment';

const ViewFIM = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const data = location.state;

  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
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
                    <Link to="/piping/user/fim-packing-list">FIM Packing List</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">View FIM Packing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* View FIM Packing Details */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>FIM Packing Details</h4>
                    </div>
                  </div>

                  <div className="row">
                    {[
                      { label: 'Package List No / Invoice No', value: data?.packing_no },
                      { label: 'Package List Date', value: moment(data?.packing_date).format('YYYY-MM-DD') },
                      { label: 'RGP No/FIM Lot No', value: data?.rgp_no },
                      { label: 'Returnable / Non Returnable', value: data?.returnable_type },
                      { label: 'Vehicle Number', value: data?.vehicle_number },
                      { label: 'Supplier', value: data?.supplier },
                      { label: 'Receiving Date', value: moment(data?.receiving_date).format('YYYY-MM-DD') },
                      { label: 'Received By', value: data?.received_by?.user_name || "-" },
                    ].map(({ label, value }) => (
                      <div key={label} className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <label>{label}</label>
                          <input className="form-control" value={value || "-"} readOnly />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requested Items (Packing Items) */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="col-12">
                    <div className="form-heading">
                      <h4>Packing Item Details</h4>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Item Name</th>
                          <th>Item Description</th>
                          <th>Size</th>
                          <th>Thickness</th>
                          <th>Piping Material Specification</th>
                          <th>Material Grade</th>
                          <th>UOM</th>
                          <th>FIM List Qty</th>
                          <th>Received By</th>
                          <th>HSC/SAC</th>
                          <th>Rate</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.items?.map((elem, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{elem?.item_id?.name}</td>
                            <td>{elem?.item_id?.material_grade}</td>
                            <td>{elem?.weight_as_per_list}</td>
                            <td>{elem?.numbers_as_per_list}</td>
                            <td>{elem?.received_weight}</td>
                            <td>{elem?.received_length}</td>
                            <td>{elem?.received_width}</td>
                            <td>{elem?.received_nos}</td>
                            <td>{elem?.rejected_weight}</td>
                            <td>{elem?.rejected_length}</td>
                            <td>{elem?.rejected_width}</td>
                            <td>{elem?.rejected_nos}</td>
                            <td>{elem?.remarks || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing Details if exist */}
          {data?.drawing_id && (
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>Drawing Details</h4>
                      </div>
                    </div>
                    <div className="row">
                      {[
                        { label: 'Drawing No.', value: data?.drawing_id?.drawing_no },
                        { label: 'REV', value: data?.drawing_id?.rev },
                        { label: 'Sheet No.', value: data?.drawing_id?.sheet_no },
                        { label: 'Assembly No.', value: data?.drawing_id?.assembly_no },
                        { label: 'Assembly Quantity', value: data?.drawing_id?.assembly_quantity },
                        { label: 'Issued To', value: data?.drawing_id?.issued_person?.name },
                        { label: 'Issued Date', value: moment(data?.drawing_id?.issued_date).format('YYYY-MM-DD') },
                      ].map(({ label, value }) => (
                        <div key={label} className="col-12 col-md-4 col-xl-4">
                          <div className="input-block local-forms">
                            <label>{label}</label>
                            <input className="form-control" value={value || "-"} readOnly />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="row">
                      <div className="col-12 col-md-4 col-xl-4">
                        <div className="input-block local-forms">
                          <p className="m-0" style={{ fontSize: "12px" }}>Status</p>
                          <span
                            className={`custom-badge ${
                              data?.drawing_id?.status === 1
                                ? 'status-orange'
                                : data?.drawing_id?.status === 2
                                ? 'status-green'
                                : ''
                            }`}
                          >
                            {data?.drawing_id?.status === 1
                              ? 'Pending'
                              : data?.drawing_id?.status === 2
                              ? 'Completed'
                              : ''}
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-md-4 col-xl-4">
                        <a
                          href={data?.drawing_id?.drawing_pdf}
                          className="d-flex"
                          target="_blank"
                          rel="noreferrer"
                          style={{ cursor: 'pointer' }}
                        >
                          <img src="/assets/img/pdflogo.png" alt="draw-pdf" />{" "}
                          <p>{data?.drawing_id?.drawing_pdf_name}</p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewFIM;
