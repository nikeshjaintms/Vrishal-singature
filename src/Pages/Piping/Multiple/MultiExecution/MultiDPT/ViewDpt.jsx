import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';

import { getIssueAcceptancePiping } from "../../../../../Store/Piping/IssueAcceptance/getIssueAcceptancePiping";
import { getDrawingJointWisePiping } from '../../../../../Store/Piping/MultiFitupPiping/getDrawingJointWisePipingData';
import { getDrawingSpoolNoFitUp } from '../../../../../Store/Piping/Drawing/getDrawingSpoolNoFitUp';
import { getFitupOfferTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/getFitupOfferTablePiping';
import { updateFitupOffTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/updateFitupOfferTablePiping';
import { removeFitupOffTablePiping } from '../../../../../Store/Piping/MultiFitupPiping/removeFitupOffertablePiping';
import { getMultiFitupPiping } from '../../../../../Store/Piping/MultiFitupPiping/getMultiFitupPiping';
const ManageMultiDptView = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = location.state;

  const [fitup, setFitup] = useState({ issued_id: data?.issue_id?._id || "" });
  const [filterIssue, setFilterIssue] = useState([]);
  const [entity, setEntity] = useState([]);
  const [search, setSearch] = useState('');
   const [disable, setDisable] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ================= MULTIPLE FIT-UP TABLE STATE ================= */
  const [fitupTableData, setFitupTableData] = useState([]);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    remarks: '',
    imir_no_1: '',
    heat_no_1: '',
    imir_no_2: '',
    heat_no_2: ''
  });

  const toDropdownOptions = (arr = []) => arr.map(v => ({ label: v, value: v }));
const project_id = localStorage.getItem('U_PROJECT_ID');
  /* ================= INIT ================= */
  useEffect(() => {
    dispatch(getIssueAcceptancePiping());
    dispatch(getDrawingJointWisePiping({}));
    dispatch(getDrawingSpoolNoFitUp());
    if (fitup.issued_id) {
      dispatch(getFitupOfferTablePiping({ issue_id: fitup.issued_id, project_id }));
    }
  }, [dispatch, fitup.issued_id]);

   useEffect(() => {
  const fetchMultiFitup = async () => {
    try {
      const response = await dispatch(getMultiFitupPiping({ limit, page: currentPage }));
      console.log("response",response);
      const apiData = response?.payload?.data || [];
console.log("apiData",apiData);
      // Flatten the items for table display
      const mergedItems = apiData.flatMap(row =>
        (row.items || []).map(item => ({
          _id: item._id || "-",
          report_no: row.report_no || "-",
          issue_id: row.issue_id?._id || "-",
          drawing_data: item.drawing_id || {},
          spool_no: item.drawing_id?.sheet_no || "-",
          joint_no: item.joint_type?.join(", ") || "-",
          item_id_1: { item_name: item.item_id_1 || "-" },
          imir_no_1: item.imir_no_1 || "-",
          heat_no_1: item.heat_no_1 || "-",
          item_id_2: { item_name: item.item_id_2 || "-" },
          imir_no_2: item.imir_no_2 || "-",
          heat_no_2: item.heat_no_2 || "-",
          fitOff_used_qty: item.fitOff_used_qty || 0,
          fitOff_balance_qty: item.fitOff_balance_qty || 0,
          remarks: item.remarks || "-",
        }))
      );
console.log("mergedItems",mergedItems);

      setFitupTableData(mergedItems);
    } catch (err) {
      console.error("Error fetching multi-fitup data:", err);
      setFitupTableData([]); // fallback to empty
    }
  };

  fetchMultiFitup();
}, [dispatch, currentPage, limit]);


    // const entity = useSelector((state) => state?.getMultiFitup?.user?.data?.data);

const fitUpData = useSelector((state) => state?.getMultiFitupPiping?.user?.data?.data) || [];
const pagination = useSelector((state) => state?.getMultiFitupPiping?.user?.data?.pagination) || {};
    console.log("fitUpData",fitUpData);

  /* ================= SELECTORS ================= */
  const issuedData = useSelector(state => state?.getIssueAcceptancePiping?.user?.data?.items);
  const drawData = useSelector(state => state?.getDrawingSpoolNoFitUp?.data);
  const fitupOfferTableData = useSelector(state => state?.getFitupOfferTablePiping?.user?.data) || [];

  /* ================= FILTER ISSUED ================= */
  useEffect(() => {
    const filterData = issuedData
      ?.filter(is => is?.isFitUp && is?.items?.some(it => it?.is_accepted))
      .map(issue => {
        const isCompleted = issue.items.every(item => (item.iss_used_qty || 0) - (item.moved_next_step || 0) === 0);
        return { ...issue, isCompletedStatus: isCompleted ? "Completed" : "Balance" };
      });
    setFilterIssue(filterData || []);
  }, [issuedData]);

  /* ================= DRAWING LIST ================= */
  useEffect(() => {
    const findIssueAcc = issuedData?.find(is => is?._id === fitup.issued_id);
    if (findIssueAcc) {
      const drawIds = findIssueAcc.items.map(it => it?.drawing_id?._id);
      const drawFilter = drawData?.filter(dr => drawIds.includes(dr?.drawing_id));
      setEntity(drawFilter || []);
    }
  }, [drawData, fitup.issued_id, issuedData]);

  /* ================= DRAWING SEARCH ================= */
  const drawingList = useMemo(() => {
    const projectId = localStorage.getItem('U_PROJECT_ID');
    let computed = entity?.filter(o => o?.project === projectId) || [];

    if (search) {
      computed = computed.filter(dr =>
        dr?.drawing_no?.toLowerCase()?.includes(search.toLowerCase()) ||
        dr?.rev?.toLowerCase()?.includes(search.toLowerCase()) ||
        dr?.assembly_no?.toLowerCase()?.includes(search.toLowerCase())
      );
    }

    setTotalItems(computed.length);
    return computed.slice((currentPage - 1) * limit, currentPage * limit);
  }, [entity, search, currentPage, limit]);

  const issueOptions = filterIssue.map(issue => ({
    label: `${issue.issue_accept_no} - ${issue.isCompletedStatus}`,
    value: issue._id
  }));

  /* ================= MULTIPLE FIT-UP TABLE DATA ================= */
  useEffect(() => {
    const mergedItems = fitupOfferTableData.flatMap(row =>
      (row.items || []).map(item => ({
        ...item,
        report_no: row.report_no,
        issue_id: row.issue_id?._id,
        jointTypeName: item.jointTypeName || '',
      }))
    );
    setFitupTableData(mergedItems);
  }, [fitupOfferTableData]);

  /* ================= EDIT / SAVE ================= */
  const handleEditClick = (index, row) => {
    setEditRowIndex(index);
    setEditFormData({
      remarks: row.remarks || '',
      imir_no_1: row.imir_no_1_selected || '',
      heat_no_1: row.heat_no_1_selected || '',
      imir_no_2: row.imir_no_2_selected || '',
      heat_no_2: row.heat_no_2_selected || ''
    });
  };

  const handleSaveClick = async () => {
    const updated = [...fitupTableData];
    const row = updated[editRowIndex];

    updated[editRowIndex] = {
      ...row,
      remarks: editFormData.remarks,
      imir_no_1_selected: editFormData.imir_no_1,
      heat_no_1_selected: editFormData.heat_no_1,
      imir_no_2_selected: editFormData.imir_no_2,
      heat_no_2_selected: editFormData.heat_no_2
    };

    setFitupTableData(updated);
    setEditRowIndex(null);

    const formData = new URLSearchParams();
    formData.append('issue_id', row.issue_id);
    formData.append('report_no', row.report_no);
    formData.append('items', JSON.stringify([{
      _id: row._id,
      item_id: row?.issue_item?.item_id?._id || row.item_id,
      drawing_id: row?.drawing_id?._id || row.drawing_id,
      fitOff_used_qty: row.fitOff_used_qty || 0,
      fitOff_balance_qty: row.fitOff_balance_qty || 0,
      imir_no_1_selected: editFormData.imir_no_1,
      heat_no_1_selected: editFormData.heat_no_1,
      imir_no_2_selected: editFormData.imir_no_2,
      heat_no_2_selected: editFormData.heat_no_2,
      remarks: editFormData.remarks
    }]));

    try {
      await dispatch(updateFitupOffTablePiping({ bodyFormData: formData }));
      toast.success('Row updated successfully!');
    } catch (err) {
      toast.error('Error saving row!');
      console.error(err);
    }
  };

  const handleCancelClick = () => setEditRowIndex(null);

  const handleRemove = async (row) => {
    if (!fitup.issued_id) return toast.error('Please select an issue');
    const formData = new URLSearchParams();
    formData.append('issue_id', fitup.issued_id);
    formData.append('report_no', row.report_no);
    formData.append('items', JSON.stringify([{ _id: row._id }]));
    try {
      await dispatch(removeFitupOffTablePiping({ bodyFormData: formData }));
      setFitupTableData(prev => prev.filter(i => i._id !== row._id));
      toast.success('Row removed successfully!');
    } catch (err) {
      toast.error('Error removing row!');
      console.error(err);
    }
  };

  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);

  /* ================= UI ================= */
  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              { name: "Dashboard", link: "/piping/user/dashboard" },
              { name: "Fit-Up Inspection Offer List", link: "/piping/user/fitup-management" },
              { name: "View Fit-Up Inspection Offer", active: true }
            ]}
          />

          {/* ================= HEADER ================= */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <h4>View Fit-Up Inspection Offer Details</h4>
                  <div className="col-md-6 mt-3">
                    <label>Issued List</label>
                    <Dropdown
                      value={fitup.issued_id}
                      options={issueOptions}
                      disabled
                      className="w-100"
                      placeholder="Issued Acceptance No."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DRAWING TABLE ================= */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <div className="page-table-header mb-2 d-flex justify-content-between align-items-center">
                    <h3>Drawing List</h3>
                    <input
                      type="text"
                      className="form-control w-25"
                      placeholder="Search Drawing / Rev / Assembly"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="table-responsive mt-2">
                    <table className="table border-0 custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No.</th>
                          <th>Rev</th>
                          <th>Sheet No.</th>
                          <th>Spool No.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drawingList.length > 0 ? drawingList.map((dr, i) => (
                          <tr key={dr?._id || i}>
                            <td>{(currentPage-1)*limit + i + 1}</td>
                            <td>{dr?.drawing_no || '-'}</td>
                            <td>{dr?.rev || '-'}</td>
                            <td>{dr?.sheet_no || '-'}</td>
                            <td>{dr?.spool_no || '-'}</td>
                         
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="6" className="text-center">No Drawings Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= MULTIPLE FIT-UP TABLE ================= */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table show-entire">
                <div className="card-body">
                  <h3>Fit-Up Inspection Items</h3>
                  <div className="table-responsive mt-2">
                    <table className="table border-0 custom-table comman-table mb-0">
                      <thead>
                        <tr>
                          <th>Sr.</th>
                          <th>Drawing No.</th>
                          <th>Rev</th>
                          <th>Spool No.</th>
                          <th>Joint No.</th>
                          <th>Item 1</th>
                          <th>IMIR NO. 1</th>
                          <th>Heat No. 1</th>
                          <th>Item 2</th>
                          <th>IMIR NO. 2</th>
                          <th>Heat No. 2</th>
                          <th>Remarks</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fitupTableData.length > 0 ? fitupTableData.map((row, i) => (
                          <tr key={row._id || i}>
                            <td>{i+1}</td>
                            <td>{row?.drawing_data?.drawing_no || '-'}</td>
<td>{row?.drawing_data?.rev || '-'}</td>
<td>{row?.spool_no || '-'}</td>
<td>{row?.joint_no || '-'}</td>
<td>{row?.item_id_1?.item_name || '-'}</td>
<td>{row?.imir_no_1 || '-'}</td>
<td>{row?.heat_no_1 || '-'}</td>
<td>{row?.item_id_2?.item_name || '-'}</td>
<td>{row?.imir_no_2 || '-'}</td>
<td>{row?.heat_no_2 || '-'}</td>
<td>{row?.remarks || '-'}</td>

                            </tr>
                        )) : (
                          <tr><td colSpan="13" className="text-center">No Data Found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ManageMultiDptView;
