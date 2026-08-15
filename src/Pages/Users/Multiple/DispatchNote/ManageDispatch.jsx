import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getDrawingPiping } from '../../../../Store/Piping/Drawing/getDrawingPiping';
import { V_URL } from '../../../../BaseUrl';
import Header from '../../Include/Header';
import Sidebar from '../../Include/Sidebar';
import PageHeader from '../Components/Breadcrumbs/PageHeader';
import DrawingTable from '../Components/DrawingTable/DrawingTable';
import SubmitButton from '../Components/SubmitButton/SubmitButton';
import { getUserGenInspectionSummary } from '../../../../Store/Store/InspectionSummary/GetGeneratedInsSummary';
import DispatchModel from './DispatchModal/DispatchModel';
import DispatchTable from './DispatchModal/DispatchTable';
import { checkDispatchNote } from '../../../../helper/hideDrawing';

const ManageDispatch = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [disable, setDisable] = useState(false);
    const [search, setSearch] = useState('');
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setlimit] = useState(10);
    const [entity, setEntity] = useState([]);
    const [dispatchData, setdispatchData] = useState([]);
    const [finalArr, setFinalArr] = useState([]);
    const [showItem, setShowItem] = useState(false);
    const [submitArr, setSubmitArr] = useState([]);
    const data = location.state;

    const [matchDatas, setMatchDatas] = useState([]);
    const [unMatchedDatas, setUnMatchDatas] = useState([]);

    useEffect(() => {
        dispatch(getUserGenInspectionSummary({}))
        dispatch(getDrawingPiping());
    }, []);

    const drawData = useSelector((state) => state?.getDrawingPiping?.user?.data?.data);
    console.log("drawData",drawData);
    const multiIns = useSelector(state => state.getUserGenInspectionSummary?.user?.data?.data);
    console.log("multiIns",multiIns);

    useEffect(() => {
        const mergedArray = multiIns?.reduce((acc, record) => {
            record.items.forEach(item => {
                const existingIndex = acc.findIndex(entry => entry.drawing_no === item.drawing_no);
                if (existingIndex > -1) {
                    acc[existingIndex].items.push(item);
                } else {
                    acc.push({ _id: item.drawing_id, drawing_no: item.drawing_no, rev: item.rev, assembly_no: item.assembly_no, assembly_quantity: item.assembly_quantity, sheet_no: item.sheet_no, items: [item] });
                }
            });
            return acc;
        }, []);
        setEntity(mergedArray);
    }, [multiIns, drawData]);

    const checkCompletedDrawing = async () => {
        const res = await checkDispatchNote(entity, dispatch);
        setMatchDatas(res.matchData);
        setUnMatchDatas(res.unmatchData);
    }

    useEffect(() => {
        checkCompletedDrawing()
    }, [entity])

    const commentsData = useMemo(() => {

        if (!Array.isArray(matchDatas)) {
            return [];
        }
        let computedComments = [...matchDatas];

        setTotalItems(computedComments?.length);

        if (search) {
            computedComments = computedComments.filter(
                (dr) =>
                    dr?.drawing_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.rev?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.assembly_no?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.assembly_quantity?.toString()?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.unit?.toLowerCase()?.includes(search.toLowerCase()) ||
                    dr?.sheet_no?.toLowerCase()?.includes(search.toLowerCase())
            );
        }
        computedComments.sort((a, b) => {
            const data1 = a?.drawing_no?.toString() || "";
            const data2 = b?.drawing_no?.toString() || "";
            return data1.localeCompare(data2, undefined, { numeric: true });
        });

        return computedComments.slice(
            (currentPage - 1) * limit,
            (currentPage - 1) * limit + limit
        );
    }, [search, limit, currentPage, entity, matchDatas]);

    console.log("commentsData",commentsData);
    const handleAddToArr = (data) => {
        setShowItem(true);
        setdispatchData(data);
    }

    const [dispatch_site, setdispatch_site] = useState(null);

    const onChange = (e) => {
        setdispatch_site(e.target.value);
    }

    const handleSubmit = () => {
        let updatedData = submitArr;
        let isValid = true;

        if (updatedData.length === 0) {
            toast.error('Please add drawing sections');
            return;
        }
        const missingPaintSystem = updatedData.some(item => !item.paint_system);
        if (missingPaintSystem) {
            toast.error('Please select paint system selected.');
            return;
        }
        if (dispatch_site === null || dispatch_site === '') {
            toast.error('Please enter dispatch site');
            return;
        }
        if (!isValid) {
            return;
        }

        const filteredData = updatedData.map((item) => ({
            "dis_offer_id": item._id,
            "main_id": item.main_id,
            "drawing_id": item.drawing_id,
            "grid_id": item.grid_id,
            "dispatch_balance_grid_qty": item.dispatch_balance_grid_qty,
            "dispatch_used_grid_qty": item.dispatch_used_grid_qty,
            "moved_next_step": item.moved_next_step,
            "ass_weight": item.ass_weight,
            "ass_area": item.ass_area,
            "paint_system": item.paint_system,
            "remarks": item.remarks
        }));

        setDisable(true);
        const formData = new URLSearchParams();
        formData.append('items', JSON.stringify(filteredData));
        formData.append('dispatch_site', dispatch_site);
        formData.append('prepared_by', localStorage.getItem('PAY_USER_ID'));
        formData.append('project', localStorage.getItem("PAY_USER_PROJECT_NAME"));
        const myurl = `${V_URL}/user/manage-multi-dispatch`;
        axios({
            method: "post",
            url: myurl,
            data: formData,
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
        }).then((response) => {
            if (response?.data?.success === true) {
                toast.success(response?.data?.message);
                navigate('/user/project-store/dispatch-note-management');
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            toast.error(error.response.data.message);
        }).finally((() => { setDisable(false) }));
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleOpen = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
                <Header handleOpen={handleOpen} />
                <Sidebar />

                <div className="page-wrapper">
                    <div className="content">
                        <PageHeader breadcrumbs={[
                            { name: "Dashboard", link: "/user/project-store/dashboard", active: false },
                            { name: "Dispatch Note- PAINTING", link: "/user/project-store/dispatch-note-management", active: false },
                            { name: `${data?._id ? 'Edit' : 'Add'} Dispatch Note- PAINTING`, active: true }
                        ]} />

                        <DrawingTable
                            is_dispatch={true}
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
                        <DispatchTable
                            finalArr={finalArr}
                            setSubmitArr={setSubmitArr}
                        />

                        <SubmitButton dispatch_site={dispatch_site} onChange={onChange} is_dispatch={true} finalReq={data?.items} link='/user/project-store/dispatch-note-management'
                            disable={disable} handleSubmit={handleSubmit} buttonName={'Generate Dispatch Note Offer'} />
                    </div>
                </div>
            </div>
            <DispatchModel
                showItem={showItem}
                handleCloseModal={() => setShowItem(false)}
                title={'Drawing Grid List'}
                dispatchData={dispatchData}
            />
        </>
    )
}

export default ManageDispatch