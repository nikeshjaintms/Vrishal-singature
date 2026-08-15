import React, { useState, useEffect } from "react";
import Header from "../Include/Header";
import Sidebar from "../Include/Sidebar";
import Footer from "../Include/Footer";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PmsDashboard from "./PmsDashboard";
import PipingDashboard from "./PipingDashboard";
import { getAdminProject } from "../../../Store/Admin/Project/GetAdminProject";
import { Dropdown } from "primereact/dropdown";
import DashCard from "./components/DashCard";
import IncomeExpence from "./components/IncomeExpence";
import { greetingComponent } from "../../../Components/GreetingDash/GreetingComponent";

const Dashboard = () => {
  const dispatch = useDispatch()
  const [dashboardType, setDashboardType] = useState("structure");
  const [formData, setFormData] = useState({
    project: '',
  });
const dashboardOptions = [
  {
    label: "Structure",
    value: "structure"
  },
  {
    label: "Piping",
    value: "piping"
  }
];
  useEffect(() => {
    dispatch(getAdminProject());
  }, [])

  const adminProjects = useSelector((state) => state?.getAdminProject?.user?.data) || [];
  const formDataChange = (e, name) => {
    setFormData({ ...formData, [name]: e.target.value })
  }

  const ProjectOptions = adminProjects?.map(project => ({
    label: project.name,
    value: project._id,
  }));

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className={`main-wrapper ${isSidebarOpen ? 'slide-nav' : ''}`}>
      <Header handleOpen={handleOpen} />
      <Sidebar />

      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to='/admin/dashboard'>Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right"></i>
                  </li>
                  <li className="breadcrumb-item active">Admin Dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="good-morning-blk">
            <div className="row">
              <div className="col-md-6">
                <div className="morning-user">
                  <h2>
                    {greetingComponent()}, <span>{localStorage.getItem("VA_NAME")}</span>
                  </h2>
                  <p>Have a nice day at work</p>
                </div>
              </div>
              <div className="col-md-6 position-blk">
                <div className="morning-img">
                  <img src="/assets/img/morning-img-01.svg" alt="" />
                </div>
              </div>
            </div>
          </div>

          <DashCard />

          <IncomeExpence />

          {/* <div className="card my-4">
            <div className="row p-3">
              <div className="col-md-3 col-sm-12">
                <Dropdown
                  options={ProjectOptions}
                  value={formData?.project}
                  filter onChange={(e) => formDataChange(e, 'project')}
                  placeholder='Select Project'
                  className='w-100'
                  dropdownClassName="custom-dropdown-options"
                  controlClassName="custom-dropdown-control"
                />
              </div>
            </div>
          </div> */}
<div className="card my-4">
  <div className="row p-3">
 <div className="col-md-3 col-sm-12 mb-2">
      <Dropdown
        options={dashboardOptions}
        value={dashboardType}
        onChange={(e) => setDashboardType(e.value)}
        placeholder='Select Dashboard'
        className='w-100'
      />
    </div>
    <div className="col-md-3 col-sm-12 mb-2">
      <Dropdown
        options={ProjectOptions}
        value={formData?.project}
        filter
        onChange={(e) => formDataChange(e, 'project')}
        placeholder='Select Project'
        className='w-100'
      />
    </div>

   

  </div>
</div>
          {/* <PmsOfferingProcess pId={formData?.project} /> */}
          {/* <PmsDashboard pId={formData?.project} /> */}
          {
  dashboardType === "structure" ? (
    <PmsDashboard pId={formData?.project} />
  ) : (
    <PipingDashboard pId={formData?.project} />
  )
}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
