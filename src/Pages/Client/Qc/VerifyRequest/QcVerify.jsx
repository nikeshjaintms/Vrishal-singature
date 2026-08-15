import React, { useEffect, useState } from 'react';
import Sidebar from '../../Include/Sidebar';
import Header from '../../Include/Header';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../Include/Footer';
import moment from 'moment';
import axios from 'axios';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../BaseUrl';
import Top from '../../Include/Top';

const QcVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [randomItems, setRandomItems] = useState([]);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  const [clientDate, setClientDate] = useState('');

  useEffect(() => {
      if(data?.elem?._id){
        const show = data?.elem?.client_status === 1 && data?.elem?.status_type !== null ? false : true;
        setShowOption(show);
      }
  })


  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setPdfLoading(true);

      // cleanup previous pdf
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }

      const res = await axios.post(
        `${V_URL}/party/get-material-inspection-item`,
        {
          requestId: data?.requestId,
          imir_no: data?.imir_no,
        },
        {
          responseType: 'blob',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
        }
      );

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
    } catch (error) {
      toast.error('Failed to load PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleRandomWitnessed = () => {
  const items = data?.elem?.items?.map(item => ({
    materialPoNo: data?.elem.requestId?.material_po_no,
    supplier: item.transactionId.main_supplier.name,
    section: item.transactionId.itemName.name,
    material: item.transactionId.itemName.material_grade,
    manufacture: item.manufacture.name,
    inspectedQty: item.acceptedQty,
    heatLotNo: item.heat_lot_no,
    inspectedNos: item.acceptedNos,
    length: item.acceptedLength,
    width: item.acceptedWidth,
    tcNo: item.tcNo,
    invoiceNo: data?.elem?.invoice_no,
    accRej: item.acc_rej,
    status: item.qcStatus === 1 ? 'Accepted' : 'Rejected', // yes/no
    selected: item.selected === true, // boolean
    _id: item._id, // MongoDB _id of item
    remark: '', // editable by user
  })) || [];

  setRandomItems(items);
  setShowRandomItems(true);
};
const handleItemChange = (index, field, value) => {
  const updatedItems = [...randomItems];
  updatedItems[index][field] = value;
  setRandomItems(updatedItems);

  if (field === 'selected') {
    const allChecked = updatedItems.every(item => item.selected);
    setSelectAll(allChecked);
  }
};

const handleSelectAll = (checked) => {
  setSelectAll(checked);

  const updatedItems = randomItems.map(item => ({
    ...item,
    selected: checked,
  }));

  setRandomItems(updatedItems);
};

  // 🔹 Auto-load Prepared PDF on page open (optional)
  useEffect(() => {
    fetchPdf('prepared');

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);


  const submitQcUpdate = async (statusType) => {
  try {
    if (!clientDate) {
        toast.error('Please select date');
        return;
    }
    const payload = {
      offerId: data?.elem._id,
      status_type: statusType,
      client_date: clientDate, // 👈 sending 
      client_user: localStorage.getItem('PARTY_ID'),
    };

    // Only include items if RANDOM WITNESSED
    if (statusType === 'RANDOM WITNESSED') {
      payload.items = randomItems.map(item => ({
        _id: item._id, // MongoDB _id of item
        selected: item.selected === true, // boolean
        remark: item.remark,
      }));
    }

    const res = await axios.post(`${V_URL}/party/client-review-update`, payload, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
      },
    });

    if (res.data.success) {
      toast.success('QC Updated Successfully');
      setShowRandomItems(false); // Hide random items section after submit
      navigate('/party/project-store/material-receiving')
    } else {
      toast.error(res.data.message || 'Failed to update QC');
    }
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
  }
};

  const InputField = ({ label, value }) => (
    <div className="col-12 col-md-4 col-xl-4">
      <div className="input-block local-forms">
        <label>{label}</label>
        <input className="form-control" value={value || '-'} readOnly />
      </div>
    </div>
  );

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">

          {/* ================= BREADCRUMB ================= */}
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/user/project-store/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">
                    Manage Material Inspection (QC)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ================= REQUEST DETAILS ================= */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="form-heading">
                    <h4>View Request Details</h4>
                  </div>

                  <div className="row">
                    <InputField label="Offer No." value={data?.elem.offer_no} />
                    <InputField label="Project Location" value={data?.elem.requestId?.storeLocation?.name} />
                    <InputField label="PO Date" value={moment(data?.elem.requestId?.admin_approval_time).format('YYYY-MM-DD')} />
                    <InputField label="Material PO No." value={data?.elem.requestId?.material_po_no} />
                    <InputField label="Department" value={data?.elem.requestId?.department?.name} />
                    <InputField label="Offered By" value={data?.elem?.offeredBy?.user_name} />
                    <InputField label="Accepted By" value={data?.elem?.acceptedBy?.user_name} />
                    <InputField label="Approved By" value={data?.elem.requestId?.approvedBy?.name} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= PDF VIEW SECTION ================= */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">

                  <div className="form-heading">
                    <h4>Inspection PDF</h4>
                  </div>
                  {showOption && (
                    <>
                        {/* Buttons */}
                        <div className="mb-3">
                            
                           <div className="col-12 col-md-4 col-xl-4">
                                <div className="input-block local-forms">
                                    <label>Date <span className="login-danger">*</span></label>
                                    <input
                                    type="date"
                                    className="form-control"
                                    value={clientDate}
                                    onChange={(e) => setClientDate(e.target.value)}
                                    />
                                </div>
                                </div>
                            <button
                            className="btn btn-primary me-2"
                            onClick={() => submitQcUpdate('REVIEWED')}
                            >
                            REVIEWED
                            </button>

                            <button
                            className="btn btn-warning me-2"
                            onClick={() => submitQcUpdate('WITNESSED')}
                            >
                            WITNESSED
                            </button>

                            <button
                            className="btn btn-success"
                            onClick={() => handleRandomWitnessed()}
                            >
                            RANDOM WITNESSED
                            </button>
                        </div>
                    </>
                  )}

                  {/* Loader */}
                  {pdfLoading && (
                    <div className="text-center py-3">
                      <strong>Loading PDF...</strong>
                    </div>
                  )}

                  {/* PDF Viewer */}
                  {pdfUrl && !pdfLoading && (
                    <iframe
                      src={`${pdfUrl}#toolbar=1`}
                      width="100%"
                      height="700px"
                      title="Inspection PDF"
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                      }}
                    />
                  )}


                  {showRandomItems && (
                    <div className="random-items-section">
                         <div
                        style={{
                            overflowX: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            padding: '5px',
                        }}
                        >
                            <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                <th>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                                </th>
                                <th>Sr no</th>
                                <th>MATERIAL PO NO.</th>
                                <th>SUPPLIER</th>
                                <th>SECTION</th>
                                <th>DETAILS</th>
                                <th>MATERIAL</th>
                                <th>GRADE</th>
                                <th>MANUFACTURE</th>
                                <th>INSPECTED QTY(KG)</th>
                                <th>HEAT/LOT NO</th>
                                <th>INSPECTED NOS</th>
                                <th>LENGTH(MM)</th>
                                <th>WIDTH(MM)</th>
                                <th>TC NO.</th>
                                <th>INVOICE NO.</th>
                                <th>ACC/REJ</th>
                                <th>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {randomItems.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={(e) =>
                                            handleItemChange(index, 'selected', e.target.checked)
                                        }
                                        />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{item.materialPoNo}</td>
                                    <td>{item.supplier}</td>
                                    <td>{item.section}</td>
                                    <td>{item.details}</td>
                                    <td>{item.material}</td>
                                    <td>{item.grade}</td>
                                    <td>{item.manufacture}</td>
                                    <td>{item.inspectedQty}</td>
                                    <td>{item.heatLotNo}</td>
                                    <td>{item.inspectedNos}</td>
                                    <td>{item.length}</td>
                                    <td>{item.width}</td>
                                    <td>{item.tcNo}</td>
                                    <td>{item.invoiceNo}</td>
                                    <td>{item.status}</td>
                                    <td>
                                    <input
                                        className="form-control"
                                        value={item.remark}
                                        onChange={(e) => handleItemChange(index, 'remark', e.target.value)}
                                    />
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>

                        {showRandomItems && (
                            <button
                                className="btn btn-success mt-2"
                                onClick={() => submitQcUpdate('RANDOM WITNESSED')}
                            >
                                Submit Random Witnessed
                            </button>
                            )}
                    </div>
                    )}

                </div>
              </div>
            </div>
          </div>

          <Top />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default QcVerify;
