import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAdmindeshboard } from '../../../../Store/Admin/Dashboard/GetAminDashboard';
import Chart from "react-apexcharts";
import { Dropdown } from 'primereact/dropdown';


const PmsOfferingProcess = ({ pId }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdmindeshboard({ project: pId }));
  }, [pId]);


  const counts = useSelector((state) => state?.getAdmindeshboard?.user?.data?.counts) || {};
  // const adminProjects = useSelector((state) => state?.getAdminProject?.user?.data) || [];
  const expenses = useSelector((state) => state?.getAdmindeshboard?.user?.data?.expenses) || [];

  // const ProjectOptions = adminProjects?.map(project => ({
  //   label: project.label,
  //   value: project._id,
  // }));

  // const formDataChange = (e, name) => {
  //   setFormData({ ...formData, [name]: e.target.value })
  // }


  const labelMapping = {
    fitup: "Fit-up",
    weld: "WeldVisual",
    final_dimension: "Final Dimension",
    final_coat: "Final Coating",
    dispatch_note: "Dispatch Note",
  };

  const chartLabels = Object.keys(counts).map((key) => labelMapping[key] || key);
  const chartSeries = Object.values(counts);

  const chartData = {
    series: chartSeries,
    options: {
      chart: {
        type: "pie",
      },
      labels: chartLabels,
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex];
        },
      },
    },
  };


  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const months = expenses?.map(item => monthNames[item.month - 1]);
  const msIssAmounts = expenses?.map(item => item.ms_iss_amount);
  const salaryAmounts = expenses?.map(item => item.salary_amount);

  const columnChartData = {
    series: [
      {
        name: "MS ISS Amount",
        data: msIssAmounts,
      },
      {
        name: "Salary Amount",
        data: salaryAmounts,
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: months,
        title: {
          text: "Months", // X-Axis Label
        },
      },
      yaxis: {
        title: {
          text: "Rupees (₹)", // Y-Axis Label
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
        },
      },
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-12 col-lg-6 col-xl-9">
          <div className="card">
            <div className="card-body">
              <div className="chart-title patient-visit">
                <h4>INCOME/EXPENSES</h4>
                {/* <div className="input-block local-forms custom-select-wpr">
                  <label> Projects.</label>
                  <Dropdown
                    options={ProjectOptions}
                    value={formData?.project}
                    filter onChange={(e) => formDataChange(e, 'project')}
                    placeholder='Select Project'
                    className='w-100'
                    dropdownClassName="custom-dropdown-options"
                    controlClassName="custom-dropdown-control"
                  />
                </div > */}
              </div>
              <Chart options={columnChartData.options} series={columnChartData.series} type="bar" height={350} />
            </div>
          </div>
        </div >

        <div className="col-12 col-md-12 col-lg-6 col-xl-3 d-flex">
          <div className="card">
            <div className="card-body">
              <div className="chart-title">
                <h4>Completed Inspections</h4>
              </div>
              <div className="chart-user-icon">
                {/* <img src="assets/img/icons/user-icon.svg" alt /> */}
                <Chart options={chartData.options} series={chartData.series} type="pie" width="100%" />
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default PmsOfferingProcess