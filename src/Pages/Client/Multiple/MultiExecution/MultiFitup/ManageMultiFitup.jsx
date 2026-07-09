import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import { getMultipleIssueAcc } from '../../../../../Store/MutipleDrawing/IssueAcc/MultipleIssueAcc';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import Footer from '../../../Include/Footer';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { Dropdown } from 'primereact/dropdown';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import toast from 'react-hot-toast';
import axios from 'axios';
import { V_URL } from '../../../../../BaseUrl';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import MultiFitupModal from '../../Components/MultiFitupModal/MultiFitupModal';
import MultipleFitupTable from '../../Components/MultiFitupModal/MultipleFitupTable';
import { updateFitupOffTable } from '../../../../../Store/MutipleDrawing/MultiFitup/updateFitupOfferTable';

const ManageMultiFitup = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fitup, setFitup] = useState({ issued_id: "" });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);

    const [entity, setEntity] = useState([]);
    const [finalArr, setFinalArr] = useState([]);
    const [showItem, setShowItem] = useState(false);
    const [drawId, setDrawId] = useState(null);
    const [issObj, setIssObj] = useState(null);
    const [submitArr, setSubmitArr] = useState([]);
    const [filterIssue, setFilterIssue] = useState([]);
    const data = location.state;

    useEffect(() => {
        if (data) {
            setFitup({
                issued_id: location.state.issue_id?._id,
            });
        }
    }, [data]);

    useEffect(() => {
     dispatch(getMultipleIssueAcc());
        dispatch(getDrawing());
    }, []);

    const issuedData = useSelector((state) => state?.getMultipleIssueAcc?.user?.data?.items);
   
    
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);

    useEffect(() => {
//       const filterData = issuedData?.filter((is) => is?.isFd === false && is?.items?.every((it) =>
//                 it?.is_accepted === true && (it?.iss_used_grid_qty
//  || 0) !== 0
//             ))
        const filterData = issuedData?.filter((is) => is?.isFd === false && is?.items?.some((it) => it?.is_accepted === true))
            .map(issue => {
                const isCompleted = issue.items.every(item => (item.iss_used_grid_qty || 0) - (item.moved_next_step || 0) === 0);
                return { ...issue, isCompletedStatus: isCompleted ? "Completed" : "Balance" };
            });
        setFilterIssue(filterData);
        console.log("filterData",filterData);
      
    }, [issuedData]);

    useEffect(() => {
        const findIssueAcc = issuedData?.find((is) => is?._id === fitup.issued_id);
        setIssObj(findIssueAcc);
        if (findIssueAcc) {
            const drawIds = findIssueAcc?.items?.map((it) => it?.drawing_id?._id);
            const drawFilter = drawData?.filter((dr) => drawIds?.includes(dr?._id));
            setEntity(drawFilter);
        }
    }, [drawData, fitup.issued_id, issuedData]);

    const commentsData = useMemo(() => {
        const projectId = localStorage.getItem('U_PROJECT_ID');
        let computedComments = entity;
        if (computedComments) {
            computedComments = computedComments?.filter((o) => o?.project?._id === projectId);
        }
        if (search) {
            computedComments = computedComments.filter(
                (dr) =>
                    dr?.drawing_no.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.rev?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.assembly_no?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.unit?.toLowerCase()?.includes(search?.toLowerCase()) ||
                    dr?.sheet_no?.toLowerCase()?.includes(search?.toLowerCase())
            );
        }
        setTotalItems(computedComments?.length);
        return computedComments?.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [currentPage, search, limit, entity]);

    const handleChange = (e, name) => {
        setFitup({ ...fitup, [name]: e.value });
    }

    const handleAddToIssueArr = (drawId) => {
        setShowItem(true);
        setDrawId(drawId?._id);
    };

    useEffect(() => {
        if (fitup.issued_id) {
            setFinalArr([]);
        }
    }, [fitup.issued_id]);

    const handleSubmit = () => {
        let updatedData = submitArr;
        let isValid = true;
        let err = {};
        updatedData.forEach(item => {
            if (item.joint_type?.length === 0 || !item?.joint_type) {
                isValid = false;
                toast.error(`Please select Joint Type for ${item.grid_item_id.item_name.name}`);
            }
        });
        if (!isValid) {
            setError(err);
            return;
        }

        const filteredData = submitArr.map((item) => ({
            drawing_id: item.drawing_id,
            fitOff_used_grid_qty: item.fitOff_used_grid_qty,
            fitOff_balance_qty: item.fitOff_balance_qty,
            grid_item_id: item.grid_item_id?._id,
            joint_type: item.joint_type,
            remarks: item.remarks || '',
            report_no: item.report_no,
            issueId: fitup.issued_id,
            off_item_id: item._id,
        }));

        if (filteredData.length === 0) {
            toast.error('Please add drawing sections');
            return;
        }

        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-multi-fitup`;
            const formData = new URLSearchParams();
            formData.append('issue_id', fitup.issued_id);
            formData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
            formData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
            formData.append('items', JSON.stringify(filteredData));
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
                    const updatedData = new URLSearchParams();
                    updatedData.append('items', JSON.stringify(filteredData));
                    dispatch(updateFitupOffTable({ updatedData })).then((response) => {
                        console.log(response, '222')
                        if (response.payload.success === true) {
                            navigate('/user/project-store/fitup-management');
                        }
                    })
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

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!fitup.issued_id) {
            isValid = false;
            err['issued_id_err'] = "Please select issue";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const issueOptions = filterIssue?.map(issue => ({
        label: `${issue?.issue_accept_no} - ${issue?.isCompletedStatus}`,
        value: issue?._id
    })) || [];
console.log("issueOptions",issueOptions);
    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                        { name: "Fit-Up Inspection Offer List", link: "/user/project-store/fitup-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Fit-Up Inspection Offer`, active: true }
                    ]} />

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
                                                    <label> Issued List <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={issueOptions}
                                                        value={fitup.issued_id || ""}
                                                        onChange={(e) => handleChange(e, 'issued_id')}
                                                        filter className='w-100'
                                                        placeholder="Select Issued Acceptance No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error.issued_id_err}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DrawingTable
                        tableTitle={'Drawing List'}
                        commentsData={commentsData}
                        handleAddToIssueArr={handleAddToIssueArr}
                        currentPage={currentPage}
                        limit={limit}
                        setlimit={setlimit}
                        totalItems={totalItems}
                        setCurrentPage={setCurrentPage}
                        setSearch={setSearch}
                        data={data}
                    />

                    <MultipleFitupTable
                        data={data}
                        issueId={fitup?.issued_id}
                        finalArr={finalArr}
                        setSubmitArr={setSubmitArr}
                    />

                    <SubmitButton finalReq={data?.items} link='/user/project-store/fitup-management' disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Fit-Up Offer'} />
                </div>
                <Footer />
            </div>
            <MultiFitupModal
                showItem={showItem}
                drawId={drawId}
                issueId={fitup?.issued_id}
                handleCloseModal={() => setShowItem(false)}
                title={'Issue Acceptance Section List'}
                // tableData={issObj?.items}
                setFinalArr={setFinalArr}
                finalArr={finalArr}
            />
        </div>
    )
}

export default ManageMultiFitup