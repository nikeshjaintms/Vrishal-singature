import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../Include/Header";
import Sidebar from "../../../Include/Sidebar";
import Footer from "../../../Include/Footer";
import { Dropdown } from "primereact/dropdown";
import { getMultiWeldVisual } from "../../../../../Store/MutipleDrawing/MultiWeldVisual/getMultiWeldVisual";
import DrawingTable from "../../Components/DrawingTable/DrawingTable";
import PageHeader from "../../Components/Breadcrumbs/PageHeader";
import { getDrawing } from "../../../../../Store/Erp/Planner/Draw/Draw";
import MultiNDTTable from "../../Components/MultiNDTModal/MultiNDTTable";
import MultiNDTModal from "../../Components/MultiNDTModal/MultiNDTModal";
import SubmitButton from "../../Components/SubmitButton/SubmitButton";
import toast from "react-hot-toast";
import { V_URL } from "../../../../../BaseUrl";
import axios from "axios";
import { updateNDTOfferTable } from "../../../../../Store/MutipleDrawing/MultiNDT/updateNDTOfferTable";

const ManageMultiNDT = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const data = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterWeld, setFilterWeld] = useState([]);
  const [ndt, setNdt] = useState({ weldVisual: "" });
  const [search, setSearch] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [entity, setEntity] = useState([]);
  const [showItem, setShowItem] = useState(false);
  const [drawId, setDrawId] = useState(null);
  const [finalArr, setFinalArr] = useState([]);
  const [submitArr, setSubmitArr] = useState([]);
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState({});

  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (data) {
      setNdt({
        weldVisual: location.state?.weld_visual_id?._id,
      });
    }
  }, [data]);

  useEffect(() => {
    dispatch(getDrawing());
    dispatch(getMultiWeldVisual({ status: 2, page:currentPage, limit }));
  }, []);

  const weldVisualData = useSelector((state) => state?.getMultiWeldVisual?.user?.data?.items);
  const drawData = useSelector((state) => state?.getDrawing?.user?.data?.data);

  useEffect(() => {
    const filterData = weldVisualData?.filter((is) => is?.items?.some((it) => it?.is_accepted === true));
    setFilterWeld(filterData);
  }, [weldVisualData]);

  useEffect(() => {
    const findWeldData = weldVisualData?.find((is) => is?._id === ndt.weldVisual);
    if (findWeldData) {
      const drawIds = findWeldData?.items?.map((it) => it?.drawing_id);
      const drawFilter = drawData?.filter((dr) => drawIds?.includes(dr?._id));
      setEntity(drawFilter);
    }
  }, [drawData, ndt.weldVisual, weldVisualData]);

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
  }, [currentPage, search, limit, entity]);

  const handleChange = (e, name) => {
    setNdt({ ...ndt, [name]: e.value });
  };

  const handleAddToNDTArr = (drawId) => {
    setShowItem(true);
    setDrawId(drawId?._id);
  };

  const handleSubmit = () => {
    let updatedData = submitArr;
    let isValid = true;
    let err = {};

    if (updatedData?.length === 0) {
      toast.error('Please add drawing sections');
      return;
    }

    updatedData.forEach(item => {
      if (item.ndt_requirements.length === 0) {
        isValid = false;
        toast.error(`Please select ndt requirements for ${item.grid_item_id.item_name.name}`);
      }
    });
    if (!isValid) {
      setError(err);
      return;
    }

    const filteredData = submitArr.map((item) => ({
      drawing_id: item.drawing_id,
      grid_item_id: item.grid_item_id._id,
      ndt_used_grid_qty: item.ndt_used_grid_qty,
      ndt_balance_qty: item.ndt_balance_qty,
      ndt_requirements: item.ndt_requirements,
      remarks: item.remarks || '',
      report_no: item.report_no,
      weld_visual_id: ndt.weldVisual,
      off_item_id: item._id,
    }))

    setDisable(true);
    const myurl = `${V_URL}/user/manage-ndt-master-table`;
    const bodyFormData = new URLSearchParams();
    bodyFormData.append('items', JSON.stringify(filteredData));
    bodyFormData.append('offered_by', localStorage.getItem('PAY_USER_ID'));
    bodyFormData.append('project', localStorage.getItem('PAY_USER_PROJECT_NAME'));
    bodyFormData.append('weld_visual_id', ndt.weldVisual);
    bodyFormData.append('drawing_id', drawId);
    if (data?._id) {
      bodyFormData.append('_id', data?._id);
    }
    axios({
      method: "post",
      url: myurl,
      data: bodyFormData,
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Barrer " + localStorage.getItem('PAY_USER_TOKEN') },
    }).then((response) => {
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        const updatedData = new URLSearchParams();
        updatedData.append('items', JSON.stringify(filteredData));
        dispatch(updateNDTOfferTable({ updatedData })).then((response) => {
          if (response.payload.success === true) {
            navigate('/user/project-store/ndt-management');
          }
        })
      } else {
        toast.error(response?.data?.message);
      }
      setDisable(false);
    }).catch((error) => {
      toast.error(error?.response?.data?.message);
      setDisable(false);
    });
  }

  const weldVisualOptions = filterWeld?.map((visual) => ({
    label: visual?.report_no,
    value: visual?._id,
  }));

  return (
    <div className={`main-wrapper ${isSidebarOpen ? "slide-nav" : ""}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            breadcrumbs={[
              { name: "Dashboard", link: "/user/project-store/dashboard", active: false, },
              { name: "NDT Master List", link: "/user/project-store/ndt-management", active: false, },
              { name: `${data?._id ? "Edit" : "Add"} NDT Master`, active: true, },
            ]}
          />
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="col-12">
                      <div className="form-heading">
                        <h4>{data?._id ? "Edit" : "Add"} NDT Master Details</h4>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-md-6 col-xl-6">
                        <div className="input-block local-forms custom-select-wpr">
                          <label>
                            Weld Visual Inspection List
                            <span className="login-danger">*</span>
                          </label>
                          <Dropdown
                            value={ndt.weldVisual}
                            onChange={(e) => handleChange(e, "weldVisual")}
                            options={weldVisualOptions}
                            placeholder="Select Weld Visual Inspection List"
                            filter
                            className="w-100"
                            disabled={data?._id}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <DrawingTable
            tableTitle={"Drawing List"}
            commentsData={commentsData}
            handleAddToIssueArr={handleAddToNDTArr}
            currentPage={currentPage}
            limit={limit}
            setlimit={setlimit}
            totalItems={totalItems}
            setCurrentPage={setCurrentPage}
            setSearch={setSearch}
            data={data}
          />

          <MultiNDTTable
            data={data}
            weldVId={ndt.weldVisual}
            finalArr={finalArr}
            setSubmitArr={setSubmitArr}
          />

          <SubmitButton finalReq={data?.items} link='/user/project-store/ndt-management'
            disable={disable} handleSubmit={handleSubmit} buttonName={'Generate NDT Offer'} />
        </div>
      </div>

      <MultiNDTModal
        showItem={showItem}
        handleCloseModal={() => setShowItem(false)}
        drawId={drawId}
        weldVisualId={ndt.weldVisual}
        title={"NDT Clearance Section List"}
        setFinalArr={setFinalArr}
      />
    </div>
  );
};

export default ManageMultiNDT;
