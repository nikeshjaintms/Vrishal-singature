import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../../Include/Header';
import Sidebar from '../../../Include/Sidebar';
import PageHeader from '../../Components/Breadcrumbs/PageHeader';
import { getMultiFitup } from '../../../../../Store/MutipleDrawing/MultiFitup/getMultiFitup';
import { Dropdown } from 'primereact/dropdown';
import DrawingTable from '../../Components/DrawingTable/DrawingTable';
import { getDrawing } from '../../../../../Store/Erp/Planner/Draw/Draw';
import MultiWeldModal from '../../Components/MultiWeldModal/MultiWeldModal';
import MultiWeldTable from '../../Components/MultiWeldModal/MultiWeldTable';
import SubmitButton from '../../Components/SubmitButton/SubmitButton';
import toast from 'react-hot-toast';
import { V_URL } from '../../../../../BaseUrl';
import axios from 'axios';
import { updateWeldOffTable } from '../../../../../Store/MutipleDrawing/MultiWeldVisual/updateWeldOfferTable';

const ManageMultiWeldVisual = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [weld, setWeld] = useState({ fitup: '' });
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState({});
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [finalFit, setFinalFit] = useState([]);

    const [finalArr, setFinalArr] = useState([]);
    const [showItem, setShowItem] = useState(false);
    const [drawId, setDrawId] = useState(null);
    const [entity, setEntity] = useState([]);
    const [submitArr, setSubmitArr] = useState([]);

    const data = location.state;

    useEffect(() => {
        dispatch(getMultiFitup())
        dispatch(getDrawing());
    }, []);

    const fitupAccData = useSelector((state) => state?.getMultiFitup?.user?.data?.data);
    console.log('fitupAccData', fitupAccData);
    const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);

    useEffect(() => {
        if (data) {
            setWeld({ fitup: data?.fitup_id?._id })
        }
    }, [data]);

    useEffect(() => {
        const filterFitup = fitupAccData?.filter((e) => e?.status === 2)
            .map(issue => {
                const isCompleted = issue.items.every(item => (item.fitOff_used_grid_qty || 0) - (item.moved_next_step || 0) === 0);
                return { ...issue, isCompletedStatus: isCompleted ? "Completed" : "Balance" };
            });
        setFinalFit(filterFitup);
    }, [fitupAccData]);

    useEffect(() => {
        const filterData = finalFit?.find((fi) => fi?._id === weld.fitup);
        if (filterData) {
            const drawIds = filterData?.items?.map((it) => it?.drawing_id);
            const drawFilter = drawData?.filter((dr) => drawIds?.includes(dr?._id));
            setEntity(drawFilter);
        }
    }, [weld.fitup, data?._id, finalFit]);

    const handleChange = (e, name) => {
        setWeld({ ...weld, [name]: e.value });
    }

    const handleAddToArr = (drawId) => {
        setShowItem(true);
        setDrawId(drawId?._id);
    }

    const commentsData = useMemo(() => {
        let computedComments = entity;
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
    }, [search, limit, currentPage, entity]);

    const handleSubmit = () => {
        let updatedData = submitArr;
        let isValid = true;
        let err = {};

        if (updatedData?.length === 0) {
            toast.error('Please add drawing sections');
            return;
        }

        updatedData.forEach(item => {
            if (!item.weldor_no) {
                isValid = false;
                toast.error(`Please select weldor no. for ${item.grid_item_id.item_name.name}`);
            }
        });
        if (!isValid) {
            setError(err);
            return;
        }

        const filteredData = submitArr.map((item) => ({
            drawing_id: item.drawing_id,
            grid_item_id: item.grid_item_id._id,
            weldor_no: item.weldor_no,
            weld_used_grid_qty: item.weld_used_grid_qty,
            weld_balance_qty: item.weld_balance_qty,
            remarks: item.remarks || '',
            report_no: item.report_no,
            fitupId: weld.fitup,
            off_item_id: item._id,
        }));

        if (validation()) {
            setDisable(true);
            const myurl = `${V_URL}/user/manage-mutli-weld-visual`;
            const formData = new URLSearchParams();
            formData.append('fitup_id', weld.fitup);
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
                if (response.data.message) {
                    toast.success(response.data.message);
                    const updatedData = new URLSearchParams();
                    updatedData.append('items', JSON.stringify(filteredData));
                    dispatch(updateWeldOffTable({ updatedData })).then((response) => {
                        if (response.payload.success === true) {
                            navigate('/user/project-store/weld-visual-management');
                        }
                    })
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                toast.error(error.response.data.message);
            }).finally((() => { setDisable(false) }));
        }
    }

    const validation = () => {
        var isValid = true;
        let err = {};
        if (!weld.fitup) {
            isValid = false;
            err['fitup_err'] = "Please select fitup no";
        }
        setError(err);
        return isValid;
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fitOptions = finalFit?.map(fit => ({
        label: `${fit?.report_no_two} - ${fit?.isCompletedStatus}`,
        value: fit?._id
    })) || [];

    return (
        <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
            <Header handleOpen={handleOpen} />
            <Sidebar />

            <div className="page-wrapper">
                <div className="content">
                    <PageHeader breadcrumbs={[
                        { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                        { name: "Weld Visual Inspection Offer List", link: "/user/project-store/weld-visual-management", active: false },
                        { name: `${data?._id ? 'Edit' : 'Add'} Weld-Visual Inspection Offer`, active: true }
                    ]} />

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <div className="form-heading">
                                                <h4>{data?._id ? 'Edit' : 'Add'} Weld-Visual Inspection Offer Details</h4>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className="col-12 col-md-6 col-xl-6">
                                                <div className="input-block local-forms custom-select-wpr">
                                                    <label> Fit-Up Clearance No. <span className="login-danger">*</span></label>
                                                    <Dropdown
                                                        options={fitOptions}
                                                        value={weld.fitup || ""}
                                                        onChange={(e) => handleChange(e, 'fitup')}
                                                        filter className='w-100'
                                                        placeholder="Select Fit-Up Clearance No."
                                                        disabled={data?._id}
                                                    />
                                                    <div className='error'>{error.fitup_err}</div>
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
                        handleAddToIssueArr={handleAddToArr}
                        currentPage={currentPage}
                        limit={limit}
                        setlimit={setlimit}
                        totalItems={totalItems}
                        setCurrentPage={setCurrentPage}
                        setSearch={setSearch}
                        data={data}
                    />

                    <MultiWeldTable
                        data={data}
                        fitupId={weld.fitup}
                        finalArr={finalArr}
                        setSubmitArr={setSubmitArr}
                    />

                    <SubmitButton finalReq={data?.items} link='/user/project-store/weld-visual-management'
                        disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Weld Visual Offer'} />

                </div>
            </div>
            <MultiWeldModal
                showItem={showItem}
                handleCloseModal={() => setShowItem(false)}
                drawId={drawId}
                fitupId={weld.fitup}
                title={'Weld Visual Clearance Section List'}
                setFinalArr={setFinalArr}
            />
        </div>
    )
}

export default ManageMultiWeldVisual