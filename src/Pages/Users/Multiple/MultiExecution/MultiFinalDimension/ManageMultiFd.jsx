import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import MultiFdModal from '../../Components/MultiFdModal/MultiFdModal';
import { getUserMultiNdtMaster } from '../../../../../Store/MutipleDrawing/MultiNDT/getUserMultiNdtMaster';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import MultiFdTable from '../../Components/MultiFdModal/MultiFdTable';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { updateFDOfferTable } from '../../../../../Store/MutipleDrawing/MultiFd/updateFDOfferTable';
import { checkFdDrawingGrid } from '../../../../../helper/hideDrawing';

const ManageMultiFd = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [disable, setDisable] = useState(false);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [entity, setEntity] = useState([]);
  const [issueFd, setIssueFd] = useState([]);
  const [finalArr, setFinalArr] = useState([]);
  const [drawId, setDrawId] = useState('');
  const [showItem, setShowItem] = useState(false);
  const [submitArr, setSubmitArr] = useState([]);
  const [isFd, setIsFd] = useState(null); 
  const data = location.state;
  const [checkDr, setCheckDr] = useState({ ndt: [], issueAcceptance: [] });
  const [matchedData, setMatchedData] = useState([]);
  const [unmatchedData, setUnmatchedData] = useState([]);

  // initial loads
  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getUserMultiNdtMaster({ status: 3 }));
    dispatch(getMultipleIssueAcc());
  }, [dispatch]);

  // populate from route state when editing
  useEffect(() => {
    if (data?._id) {
      setIssueFd({
        name: data?.items?.[0]?.drawing_id?.issued_person?._id
      });
      setFinalArr(data?.items || []);
      setIsFd(data?.isFd ?? null);
    }
  }, [data]);

  // selectors
  const drawData = useSelector(
    (state) => state?.getDrawing?.user?.data?.data || []
  );
  const ndtData = useSelector((state) => state?.getUserMultiNdtMaster?.user?.data?.data || []);
  const issueAcc = useSelector((state) => state?.getMultipleIssueAcc?.user?.data?.items || []);

  // compute entity, checkDr
  useEffect(() => {
    const filterIssue = (issueAcc || []).filter((is) => is?.isFd === true);
    setIssueFd(filterIssue || []);

    const issAccDrawIDs = [...new Set((filterIssue || []).flatMap(is => (is?.items || []).map(it => it?.drawing_id?._id)))];

    const ndtDrawIds = [...new Set((ndtData || []).flatMap(report => (report?.items || []).map(item => item.drawing_id)))];

    const mergedDrawIds = [...new Set([...issAccDrawIDs, ...ndtDrawIds].filter(Boolean))];

    const filteredDrawData = (drawData || []).filter(draw => mergedDrawIds.includes(draw._id));

    setEntity(filteredDrawData || []);

    setCheckDr({
      ndt: ndtData || [],
      issueAcceptance: filterIssue || [],
    });
  }, [drawData, ndtData, issueAcc]);

  // check fd drawing (uses checkDr and drawData)
  const checkFdDrawing = useCallback(async () => {
    try {
      const response = await checkFdDrawingGrid(checkDr);
      const { matchData = [], unmatchData = [] } = response || {};

      // normalize IDs
      const matchDrawIDs = [...new Set((matchData || []).flatMap((is) =>
        (is?.items || []).map((it) => {
          if (!it?.drawing_id) return null;
          return typeof it.drawing_id === 'object' ? String(it.drawing_id._id) : String(it.drawing_id);
        }).filter(Boolean)
      ))];

      const unMatchDrawIDs = [...new Set((unmatchData || []).flatMap((is) =>
        (is?.items || []).map((it) => {
          if (!it?.drawing_id) return null;
          return typeof it.drawing_id === 'object' ? String(it.drawing_id._id) : String(it.drawing_id);
        }).filter(Boolean)
      ))];

      const filteredMatchData = (drawData || []).filter((draw) => matchDrawIDs.includes(String(draw._id)));
      const filteredUnMatchData = (drawData || []).filter((draw) => unMatchDrawIDs.includes(String(draw._id)));

      setMatchedData(filteredMatchData || []);
      setUnmatchedData(filteredUnMatchData || []);
    } catch (err) {
      // optionally handle/log error
      setMatchedData([]);
      setUnmatchedData([]);
    }
  }, [checkDr, drawData]);

  useEffect(() => {
    // call checkFdDrawing when either checkDr or drawData changes
    if ((checkDr?.ndt?.length || checkDr?.issueAcceptance?.length) && (drawData || []).length) {
      checkFdDrawing();
    } else {
      setMatchedData([]);
      setUnmatchedData([]);
    }
  }, [checkDr, drawData, checkFdDrawing]);

  // filtered list based on search and prefer matchedData over entity
  const filteredComments = useMemo(() => {
    let computedComments = (matchedData && matchedData.length) ? matchedData : entity || [];

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      computedComments = computedComments.filter((dr) =>
        String(dr?.drawing_no || '').toLowerCase().includes(s) ||
        String(dr?.rev || '').toLowerCase().includes(s) ||
        String(dr?.assembly_no || '').toLowerCase().includes(s) ||
        String(dr?.assembly_quantity || '').toLowerCase().includes(s) ||
        String(dr?.unit || '').toLowerCase().includes(s) ||
        String(dr?.sheet_no || '').toLowerCase().includes(s)
      );
    }

    return computedComments;
  }, [search, entity, matchedData]);

  // paginated view
  const commentsData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return (filteredComments || []).slice(start, start + limit);
  }, [filteredComments, currentPage, limit]);

  // push totalItems whenever filteredComments changes
  useEffect(() => {
    setTotalItems((filteredComments || []).length);
    // ensure currentPage is valid when total changes
    setCurrentPage((prev) => {
      const maxPage = Math.max(1, Math.ceil(((filteredComments || []).length || 0) / limit));
      return Math.min(prev, maxPage);
    });
  }, [filteredComments, limit]);

  const handleAddToArr = (drId) => {
    setShowItem(true);
    setDrawId(drId._id);
  }

  const handleSubmit = async () => {
    let updatedData = submitArr;
    if (isFd === true) {
      const allDrawingIds = updatedData.map((data) => data.drawing_id);
      const uniqueDrawingIds = [...new Set(allDrawingIds)];
      if (uniqueDrawingIds.length > 1) {
        toast.error("Mismatch found: All items must have the same drawing ID.");
        return;
      }
      const filteredGridData = drawData.filter((grid) =>
        updatedData.some((data) => data?.drawing_id === grid?.drawing_id?._id)
      );
      if (filteredGridData?.length > 0) {
        const mismatchedItems = updatedData.filter((data) => {
          const matchingGrid = filteredGridData.find((grid) => grid._id === data.grid_id._id);
          return matchingGrid && matchingGrid.grid_qty !== data.used_grid_qty;
        });
        if (mismatchedItems.length > 0) {
          toast.error(`Mismatch found: Original grid quantity and used grid quantity must be the same.`);
          return;
        }
      }
    }

    if (!updatedData || updatedData.length === 0) {
      toast.error('Please add drawing sections');
      return;
    }

    for (const item of updatedData) {
      if (!item.required_dimension) {
        toast.error(`Please select required dimension for ${item.grid_id.grid_no}`);
        return;
      }
    }

    const filteredData = updatedData.map((item) => ({
      _id: item._id,
      drawing_id: item.drawing_id._id,
      grid_id: item.grid_id._id,
      required_dimension: item.required_dimension,
      fd_balanced_grid_qty: item.fd_balanced_grid_qty,
      fd_used_grid_qty: item.fd_used_grid_qty,
      remarks: item.remarks || '',
      ndt_master_id: item.ndt_master_id ? item.ndt_master_id.map(e => e) : [],
      fd_offer_no: item.fd_offer_no,
      issue_acc_id: item.issue_acc_id ? item.issue_acc_id.map(e => e) : []
    }));

    setDisable(true);
    const myurl = `${V_URL}/user/manage-multi-fd`;
    const formData = new URLSearchParams();
    formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
    formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
    formData.append('project_id', localStorage.getItem('U_PROJECT_ID'));
    formData.append('items', JSON.stringify(filteredData));
    formData.append('issue_acc_id', localStorage.getItem('issue_acc_ids'));
    formData.append('ndt_master_id', localStorage.getItem('ndt_master_ids'));
    formData.append('is_new', localStorage.getItem('IS_NEW_FD'));
    formData.append('isFd', String(isFd));

    try {
      const response = await axios.post(myurl, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') }
      });

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        const updatedDataQS = new URLSearchParams();
        updatedDataQS.append('items', JSON.stringify(filteredData));
        updatedDataQS.append('fd_master_id', response.data?.data?._id);

        const dispatchRes = await dispatch(updateFDOfferTable({ updatedData: updatedDataQS }));
        if (dispatchRes?.payload?.success === true) {
          navigate('/user/project-store/final-dimension-offer-management');
          localStorage.removeItem('issue_acc_ids');
          localStorage.removeItem('ndt_master_ids');
          localStorage.setItem('IS_NEW_FD', 'true');
        }
      } else {
        toast.error(response.data?.message || 'Failed to submit');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setDisable(false);
    }
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => setIsSidebarOpen(!isSidebarOpen);
  const handleStatusChange = (event) => setIsFd(event.target.value === 'accept');

  return (
    <>
      <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
        <Header handleOpen={handleOpen} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content">
            <PageHeader breadcrumbs={[
              { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
              { name: "Final Dimension Inspection Offer List", link: "/user/project-store/final-dimension-offer-management", active: false },
              { name: `${data?._id ? 'Edit' : 'Add'} Final Dimension Inspection Offer`, active: true }
            ]} />

            <DrawingTable
              tableTitle={'Drawing List'}
              commentsData={commentsData}
              handleAddToIssueArr={handleAddToArr}
              currentPage={currentPage}
              limit={limit}
              setlimit={setlimit}
              totalItems={totalItems}
              setCurrentPage={setCurrentPage}
              setSearch={setSearch}
              data={data}
            />

            <MultiFdTable
              data={data}
              finalArr={finalArr}
              setSubmitArr={setSubmitArr}
            />

            <SubmitButton finalReq={data?.items} link='/user/project-store/final-dimension-offer-management'
              disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Final Dimension Offer'} isFd={isFd} handleStatusChange={handleStatusChange}
              data={data} />

          </div>
        </div>
      </div>

      <MultiFdModal
        showItem={showItem}
        handleCloseModal={() => setShowItem(false)}
        title={'Drawing Grid List'}
        setFinalArr={setFinalArr}
        issueFd={issueFd}
        ndtData={ndtData}
        drawId={drawId}
      />
    </>
  )
}

export default ManageMultiFd;
