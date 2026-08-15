import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { V_URL } from '../../../../BaseUrl';

const IncomeExpence = () => {
    const [incomeData, setIncomeData] = useState([]);
    const [disable, setDisable] = useState(true);
    useEffect(() => {
        if (disable) {
            getIncomeExpence();
        }
    }, [disable]);

    const getIncomeExpence = () => {
        const myUrl = `${V_URL}/admin/get-project-in-ex`;
        axios({
            method: 'post',
            url: myUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Barrer ' + localStorage.getItem('VA_TOKEN'),
            },
        }).then((res) => {
            const { data, success } = res?.data;
            if (success) {
                setIncomeData(data);
                setDisable(false);
            }
        }).catch((error) => {
            console.log(error, 'error');
        });
    };

    const StructureChartDataOnlyExpenses = {
        series: [
            {
                name: 'Project Material',
                data: incomeData.map((item) => item.structure_material_expense),
            },
            {
                name: 'Store Materials',
                data: incomeData.map((item) => item.project_store_expense),
            },
            {
                name: 'Monthly Salary',
                data: incomeData.map((item) => item.project_salary_expense),
            },
        ],
        options: {
            chart: { type: 'bar', stacked: false },
            xaxis: {
                categories: incomeData.map((item) => item.project_name),
            },
            dataLabels: {
                enabled: false, // <-- this line hides bar labels
            },
            title: {
                text: 'STRUCTURE ONLY EXPENSES',
            },
            tooltip: {
                y: {
                    formatter: (val) => `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
            },
        },
    };

    const StructureChartDataIncomeVsExpense = {
        series: [
            {
                name: 'Income',
                data: incomeData.map((item) => item.structure_total_income),
            },
            {
                name: 'Total Expense',
                data: incomeData.map((item) => item.structure_material_expense + item.project_store_expense + item.project_salary_expense),
            },
        ],
        options: {
            chart: { type: 'bar', stacked: false },
            xaxis: {
                categories: incomeData.map((item) => item.project_name),
            },
            dataLabels: {
                enabled: false, // <-- this line hides bar labels
            },
            title: {
                text: 'STRUCTURE PROJECT INCOME VS STRUCTURE PROJECT EXPENSE',
            },
            tooltip: {
                y: {
                    formatter: (val) => `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
            },
        },
    };

      const PipingChartDataOnlyExpenses = {
        series: [
            {
                name: 'Project Material',
                data: incomeData.map((item) => item.piping_material_expense),
            },
            {
                name: 'Store Materials',
                data: incomeData.map((item) => item.project_store_expense),
            },
            {
                name: 'Monthly Salary',
                data: incomeData.map((item) => item.project_salary_expense),
            },
        ],
        options: {
            chart: { type: 'bar', stacked: false },
            xaxis: {
                categories: incomeData.map((item) => item.project_name),
            },
            dataLabels: {
                enabled: false, // <-- this line hides bar labels
            },
            title: {
                text: 'ONLY PIPING EXPENSES',
            },
            tooltip: {
                y: {
                    formatter: (val) => `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
            },
        },
    };

    const PipingChartDataIncomeVsExpense = {
        series: [
            {
                name: 'Income',
                data: incomeData.map((item) => item.piping_total_income),
            },
            {
                name: 'Total Expense',
                data: incomeData.map((item) => item.piping_material_expense + item.project_store_expense + item.project_salary_expense),
            },
        ],
        options: {
            chart: { type: 'bar', stacked: false },
            xaxis: {
                categories: incomeData.map((item) => item.project_name),
            },
            dataLabels: {
                enabled: false, // <-- this line hides bar labels
            },
            title: {
                text: 'PIPING PROJECT INCOME VS PIPING PROJECT EXPENSE',
            },
            tooltip: {
                y: {
                    formatter: (val) => `₹ ${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
            },
        },
    };
    return (
        <div className="">
            {disable ? (
                <div className="text-center text-lg font-semibold py-20">
                    Loading Project Income & Expenses...
                </div>
            ) : (<>
                <div className='card'>
                    <div className='row p-4'>
                        <div className='col-md-9 col-sm-12'>
                            <h4 className="text-xl font-bold mb-4">Project Income & Expenses Table</h4>
                            <div className="table-responsive">
                                <table className="table custom-table comman-table border text-left mb-8">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-2 border">Project</th>
                                            <th className="p-2 border">Structure Income</th>
                                            <th className="p-2 border">Piping Income</th>

                                            <th className="p-2 border">Structure Project Material</th>
                                            <th className="p-2 border">Piping Project Material</th>

                                            <th className="p-2 border">Structure Store Materials</th>
                                            <th className="p-2 border">Piping Store Materials</th>

                                            <th className="p-2 border">Project Monthly Salary</th>
                                       

                                            <th className="p-2 border">Project Total Expense</th>
                                      

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeData.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2 border">{item.project_name}</td>
                                                <td className="p-2 border">₹ {item.structure_total_income.toLocaleString()}</td>
                                                <td className="p-2 border">₹ {item.piping_total_income.toLocaleString()}</td>

                                                <td className="p-2 border">₹ {item.structure_material_expense.toLocaleString()}</td>
                                                <td className="p-2 border">₹ {item.piping_material_expense.toLocaleString()}</td>

                                                <td className="p-2 border">₹ {item.project_store_expense.toLocaleString()}</td>
                                              

                                                <td className="p-2 border">₹ {item.project_salary_expense.toLocaleString()}</td>
     

                                                <td className="p-2 border">₹ {(item.piping_material_expense + item.structure_material_expense + item.project_store_expense + item.project_salary_expense).toLocaleString()}</td>
                                               
                                            
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='col-md-3 col-sm-12'>
                            <h4 className="text-xl font-bold mb-4">Only  Income vs Total Expense</h4>
                            <div className="table-responsive">
                                <table className="table custom-table comman-table border text-left mb-8">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            {/* <th className="p-2 border">Project</th> */}
                                            <th className="p-2 border">Income</th>
                                            <th className="p-2 border">Total Expense</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incomeData.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                {/* <td className="p-2 border">{item.project_name}</td> */}
                                                <td className="p-2 border">₹ {item.structure_total_income + item.structure_total_income}</td>
                                                <td className="p-2 border">₹ {(item.structure_material_expense + item.piping_material_expense + item.project_store_expense + item.project_salary_expense).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                         
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className='card'>
                        <div className='row p-4'>
                            <Chart
                                options={StructureChartDataOnlyExpenses.options}
                                series={StructureChartDataOnlyExpenses.series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                    <div className='card'>
                        <div className='row p-4'>
                            <Chart
                                options={StructureChartDataIncomeVsExpense.options}
                                series={StructureChartDataIncomeVsExpense.series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className='card'>
                        <div className='row p-4'>
                            <Chart
                                options={PipingChartDataOnlyExpenses.options}
                                series={PipingChartDataOnlyExpenses.series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                    <div className='card'>
                        <div className='row p-4'>
                            <Chart
                                options={PipingChartDataIncomeVsExpense.options}
                                series={PipingChartDataIncomeVsExpense.series}
                                type="bar"
                                height={350}
                            />
                        </div>
                    </div>
                </div>
            </>
            )}
        </div>
    );
};

export default IncomeExpence;