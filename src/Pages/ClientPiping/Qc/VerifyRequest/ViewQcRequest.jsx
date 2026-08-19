import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import Footer from '../../Include/Footer';
import { V_URL } from '../../../../BaseUrl';

const ViewQcRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawData = location.state;
  const data = rawData?.elem || rawData || {};
  console.log("data",data)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);

  // QC states
  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
    if (data?._id) {
      const show = data?.client_status === 1 && data?.status_type !== null ? false : true;
      setShowButtons(show);
    }
  }, [data?._id, data?.client_status, data?.status_type]);

  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setLoadingPdf(true);

      // cleanup previous pdf
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl('');
      }

      const res = await axios.post(
        `${V_URL}/party/download-piping-purchase-offer-client`,
        {
          requestId: data?.requestId?._id || data?.requestId,
          imir_no: data?.imir_no,
          print_date: clientDate || true,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
          },
          responseType: 'blob',
        }
      );

      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    } catch (err) {
      console.error('PDF fetch error:', err);
      toast.error('Failed to load PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  /* ================= AUTO LOAD PDF ================= */
  useEffect(() => {
    fetchPdf();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  /* ================= RANDOM WITNESSED PREP ================= */
  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => {
        // Extract heat_lot_no from heat_rows array or item directly
        const heatLots = Array.isArray(item.heat_rows)
          ? item.heat_rows
              .map((h) => h.heat_lot_no)
              .filter((v) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '--')
          : [];
        const heat_no =
          heatLots.length > 0
            ? [...new Set(heatLots)].join(', ')
            : item?.heat_no || item?.heat_lot_no || item?.accepted_lot_no || '-';

        // Extract TC No if available
        const tcNos = Array.isArray(item.heat_rows)
          ? item.heat_rows
              .map((h) => h.tc_no)
              .filter((v) => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== '--')
          : [];
        const tc_no = tcNos.length > 0 ? [...new Set(tcNos)].join(', ') : item?.tc_no || item?.tcNo || '-';

        // Extract Quantity (Accepted qty sum from heat_rows or offeredQty or acceptedQty)
        let quantity = '-';
        if (Array.isArray(item.heat_rows) && item.heat_rows.length > 0) {
          const totalAcc = item.heat_rows.reduce((sum, h) => sum + (Number(h.acceptedQty) || 0), 0);
          quantity = totalAcc > 0 ? totalAcc : item.offeredQty || item.acceptedQty || '-';
        } else if (item.offeredQty !== undefined && item.offeredQty !== null) {
          quantity = item.offeredQty;
        } else if (item.acceptedQty !== undefined && item.acceptedQty !== null) {
          quantity = item.acceptedQty;
        } else if (item.quantity !== undefined && item.quantity !== null) {
          quantity = item.quantity;
        }

        // Extract Size (from populated item_id or direct field)
        const size1Name = item?.item_id?.size1?.name || item?.item_id?.size1;
        const size2Name = item?.item_id?.size2?.name || item?.item_id?.size2;
        const sizeStr = size1Name
          ? size2Name
            ? `${size1Name} x ${size2Name}`
            : size1Name
          : item?.size || item?.dimension || '-';

        // Extract Thickness (from populated item_id or direct field)
        const thk1Name = item?.item_id?.thickness1?.name || item?.item_id?.thickness1;
        const thk2Name = item?.item_id?.thickness2?.name || item?.item_id?.thickness2;
        const thkStr = thk1Name
          ? thk2Name
            ? `${thk1Name} x ${thk2Name}`
            : thk1Name
          : item?.thickness || item?.accepted_normal_thickness || '-';

        // Extract Manufacture name
        let manufactureStr = item?.manufacture?.name || item?.manufacture;
        if (!manufactureStr && Array.isArray(item.make_manufacture) && item.make_manufacture.length > 0) {
          manufactureStr = item.make_manufacture.filter(Boolean).join(', ');
        }
        if (!manufactureStr) {
          manufactureStr = '-';
        }

        return {
          _id: item._id,
          item_name:
            item?.item_id?.item_name ||
            item?.transactionId?.itemName?.name ||
            item?.itemName ||
            item?.item_name ||
            '-',
          grade:
            item?.item_id?.material_grade ||
            item?.transactionId?.itemName?.material_grade ||
            item?.material_grade ||
            item?.grade ||
            '-',
          heat_no,
          tc_no,
          size: sizeStr,
          thickness: thkStr,
          quantity,
          manufacture: manufactureStr,
          selected: false,
          remark: item?.remarks || item?.acceptedRemarks || '',
        };
      }) || [];

    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };

  /* ================= SELECT / DESELECT ================= */
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...randomItems];
    updatedItems[index][field] = value;
    setRandomItems(updatedItems);

    if (field === 'selected') {
      const allChecked = updatedItems.every((item) => item.selected);
      setSelectAll(allChecked);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    const updatedItems = randomItems.map((item) => ({ ...item, selected: checked }));
    setRandomItems(updatedItems);
  };

  /* ================= UPDATE STATUS ================= */
  const submitStatus = async (statusType) => {
    if (!clientDate) {
      toast.error('Please select date');
      return;
    }

    try {
      const payload = {
        offerId: data._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem('PARTY_ID'),
      };

      // RANDOM WITNESSED requires items
      if (statusType === 'RANDOM WITNESSED') {
        if (randomItems.length === 0) {
          prepareRandomWitnessedItems();
          toast.error('Please select items for Random Witnessed');
          return;
        }

        payload.items = randomItems.map((item) => ({
          _id: item._id,
          selected: item.selected === true,
          remark: item.remark,
        }));
      }

      const res = await axios.post(`${V_URL}/party/update-piping-purchase-offer-status`, payload, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('PARTY_TOKEN'),
        },
      });

      if (res.data.success) {
        toast.success('Material Receiving updated successfully');
        setShowRandomItems(false);
        setShowButtons(false);
        fetchPdf();
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Something went wrong');
    }
  };

  /* ================= UI ================= */
  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* ===== Breadcrumb ===== */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/piping-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item">
                <Link to="/party/piping-store/verify-request-management">Material Receiving (QC)</Link>
              </li>
              <li className="breadcrumb-item">
                <i className="feather-chevron-right"></i>
              </li>
              <li className="breadcrumb-item active">View Material Receiving</li>
            </ul>
          </div>

          {/* ===== Material Details ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Material Receiving Details</h4>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Offer No</label>
                  <input className="form-control" value={data.offer_no || '-'} readOnly />
                </div>

                <div className="col-md-4 mb-3">
                  <label>IMIR No</label>
                  <input className="form-control" value={data.imir_no || '-'} readOnly />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Offered By</label>
                  <input className="form-control" value={data?.offeredBy?.user_name || '-'} readOnly />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Material PO No</label>
                  <input className="form-control" value={data?.requestId?.material_po_no || '-'} readOnly />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Store Location</label>
                  <input className="form-control" value={data?.requestId?.storeLocation?.name || '-'} readOnly />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Offered Date</label>
                  <input
                    className="form-control"
                    value={
                      data?.received_date
                        ? moment(data.received_date).format('YYYY-MM-DD')
                        : data?.createdAt
                        ? moment(data.createdAt).format('YYYY-MM-DD')
                        : '-'
                    }
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== Client Review ===== */}
          <div className="card mt-3">
            <div className="card-body">
              <h4 className="mb-3">Client Review</h4>
              {showButtons && (
                <>
                  <div className="col-md-4 mb-3">
                    <label>
                      Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={clientDate}
                      onChange={(e) => setClientDate(e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <button className="btn btn-primary me-2" onClick={() => submitStatus('REVIEWED')}>
                      REVIEWED
                    </button>

                    <button className="btn btn-warning me-2" onClick={() => submitStatus('WITNESSED')}>
                      WITNESSED
                    </button>

                    <button className="btn btn-success" onClick={prepareRandomWitnessedItems}>
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {/* ===== PDF VIEW ===== */}
              {loadingPdf && <div className="mt-4 alert alert-info">Loading PDF...</div>}

              {pdfUrl && (
                <div className="mt-4">
                  <iframe
                    src={pdfUrl}
                    title="Material Inspection PDF"
                    width="100%"
                    height="700px"
                    style={{ border: '1px solid #ccc', borderRadius: '6px' }}
                  />
                </div>
              )}

              {/* ===== RANDOM WITNESSED TABLE ===== */}
              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-3">
                  <div style={{ overflowX: 'auto', border: '1px solid #ddd', padding: '5px', borderRadius: '6px' }}>
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
                          <th>SR NO</th>
                          <th>ITEM / SECTION</th>
                          <th>MATERIAL / GRADE</th>
                          <th>HEAT / LOT NO</th>
                          <th>SIZE</th>
                          <th>THK</th>
                          <th>QTY</th>
                          <th>MANUFACTURE</th>
                          <th>REMARK</th>
                        </tr>
                      </thead>

                      <tbody>
                        {randomItems.map((item, index) => (
                          <tr key={item._id || index}>
                            <td>
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={(e) => handleItemChange(index, 'selected', e.target.checked)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item.item_name}</td>
                            <td>{item.grade}</td>
                            <td>{item.heat_no}</td>
                            <td>{item.size}</td>
                            <td>{item.thickness}</td>
                            <td>{item.quantity}</td>
                            <td>{item.manufacture}</td>
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

                  <button className="btn btn-success mt-2" onClick={() => submitStatus('RANDOM WITNESSED')}>
                    Submit Random Witnessed
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewQcRequest;