import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import { V_URL } from '../../../../../BaseUrl';

const ViewMultiFinalCoat = () => {
  const location = useLocation();
  const data = location.state;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clientDate, setClientDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [randomItems, setRandomItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showRandomItems, setShowRandomItems] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  /* ================= BUTTON VISIBILITY ================= */
  useEffect(() => {
    if (data?._id) {
      const show =
        data?.client_status === 1 && data?.status !== 1 ? false : true;
      setShowButtons(show);
    }
  }, [data?._id]);

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  /* ================= FETCH PDF ================= */
  const fetchPdf = async () => {
    try {
      setLoadingPdf(true);

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
      }

      const res = await axios.post(
        `${V_URL}/party/get-multi-final-coat-report-item`,
        {
          report_no_two: data?.report_no_two,
          print_date: clientDate,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          },
          responseType: "blob",
        }
      );

      const file = new Blob([res.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(file));
    } catch (err) {
      console.error("PDF Load Error:", err);
      toast.error("Failed to load Final Coat PDF");
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

  /* ================= RANDOM WITNESSED ITEMS ================= */
  const prepareRandomWitnessedItems = () => {
    const items =
      data?.items?.map((item) => ({
        _id: item._id,
        procedure_no: item?.procedure_no || "-",
        dispatch_report: item?.dispatch_report || "-",
        drawing_no: item?.drawing_no || "-",
        selected: false,
        remark: item?.remarks || "",
      })) || [];

    setRandomItems(items);
    setSelectAll(false);
    setShowRandomItems(true);
  };

  /* ================= ITEM SELECT ================= */
  const handleItemChange = (index, field, value) => {
    const updated = [...randomItems];
    updated[index][field] = value;
    setRandomItems(updated);

    if (field === "selected") {
      setSelectAll(updated.every((i) => i.selected));
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setRandomItems(randomItems.map((i) => ({ ...i, selected: checked })));
  };

  /* ================= UPDATE STATUS ================= */
  const submitFinalCoatStatus = async (statusType) => {
    if (!clientDate) {
      toast.error("Please select date");
      return;
    }

    try {
      const payload = {
        report_id: data?._id,
        status_type: statusType,
        client_date: clientDate,
        client_user: localStorage.getItem("PARTY_ID"),
      };

      if (statusType === "RANDOM WITNESSED") {
        if (randomItems.length === 0) {
          prepareRandomWitnessedItems();
          toast.error("Please select items");
          return;
        }

        payload.items = randomItems.map((i) => ({
          _id: i._id,
          selected: i.selected === true,
          remark: i.remark,
        }));
      }

      const res = await axios.post(
        `${V_URL}/party/multi-final-coat-review-update`,
        payload,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PARTY_TOKEN"),
          },
        }
      );

      if (res.data.success) {
        toast.success("Final Coat report updated successfully");
        setShowRandomItems(false);
        fetchPdf();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error("Something went wrong");
    }
  };

  /* ================= UI ================= */
  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          {/* ===== Breadcrumb ===== */}
          <div className="page-header">
            <ul className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/party/project-store/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">
                View Final Coat Summary
              </li>
            </ul>
          </div>

          {/* ===== Details ===== */}
          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Final Coat Inspection Details</h4>
              <div className="row">
                <div className="col-md-4">
                  <label>Report No</label>
                  <input
                    className="form-control"
                    value={data?.report_no_two || "-"}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Prepared By</label>
                  <input
                    className="form-control"
                    value={data?.offer_name || "-"}
                    readOnly
                  />
                </div>

                <div className="col-md-4">
                  <label>Created Date</label>
                  <input
                    className="form-control"
                    value={moment(data?.createdAt).format("YYYY-MM-DD")}
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
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => submitFinalCoatStatus("REVIEWED")}
                    >
                      REVIEWED
                    </button>

                    <button
                      className="btn btn-warning me-2"
                      onClick={() => submitFinalCoatStatus("WITNESSED")}
                    >
                      WITNESSED
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={prepareRandomWitnessedItems}
                    >
                      RANDOM WITNESSED
                    </button>
                  </div>
                </>
              )}

              {/* ===== PDF ===== */}
              {loadingPdf && (
                <div className="mt-4 alert alert-info">Loading PDF...</div>
              )}

              {pdfUrl && (
                <div className="mt-4">
                  <iframe
                    src={pdfUrl}
                    title="Final Coat PDF"
                    width="100%"
                    height="700px"
                    style={{ border: "1px solid #ccc" }}
                  />
                </div>
              )}

              {/* ===== RANDOM WITNESSED TABLE ===== */}
              {showRandomItems && randomItems.length > 0 && (
                <div className="mt-3">
                  <div style={{ overflowX: "auto" }}>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={(e) =>
                                handleSelectAll(e.target.checked)
                              }
                            />
                          </th>
                          <th>#</th>
                          <th>Procedure No</th>
                          <th>Dispatch No</th>
                          <th>Drawing No</th>
                          <th>Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {randomItems.map((item, i) => (
                          <tr key={item._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={(e) =>
                                  handleItemChange(
                                    i,
                                    "selected",
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td>{i + 1}</td>
                            <td>{item.procedure_no}</td>
                            <td>{item.dispatch_report}</td>
                            <td>{item.drawing_no}</td>
                            <td>
                              <input
                                className="form-control"
                                value={item.remark}
                                onChange={(e) =>
                                  handleItemChange(i, "remark", e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    className="btn btn-success mt-2"
                    onClick={() =>
                      submitFinalCoatStatus("RANDOM WITNESSED")
                    }
                  >
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

export default ViewMultiFinalCoat;