// import axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import CountUp from 'react-countup'
// import { V_URL } from '../../../../BaseUrl';

// const DashCard = () => {

//     const [empData, setEmpData] = useState({});
//     const [currentMonth, setCurrentMonth] = useState([]);
//     const [lastDay, setLastDay] = useState([]);

//     const fetchData = async (url, setter) => {
//         try {
//             const res = await axios({
//                 method: "POST",
//                 url: `${V_URL}${url}`,
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                     Authorization: "Barrer " + localStorage.getItem("VA_TOKEN"),
//                 },
//             });
//             if (res.data?.success) setter(res.data.data);
//         } catch (error) {
//             console.log(error?.message);
//         }
//     };

//     useEffect(() => {
//         axios.get(`${V_URL}/admin/get-att-count`, {
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded",
//                 Authorization: "Barrer " + localStorage.getItem("VA_TOKEN"),
//             }
//         }).then(res => {
//             if (res.data?.success) setEmpData(res.data.data);
//         }).catch(err => console.log(err?.message));

//         fetchData('/admin/get-current-project-in-ex', setCurrentMonth);
//         fetchData('/admin/get-last_date-project-in-ex', setLastDay);
//     }, []);

//     const renderTable = (title, data) => (
//         <div className="col-md-12 mt-4">
//             <div className="card">
//                 <div className="card-header">
//                     <h5 className="mb-0">{title}</h5>
//                 </div>
//                 <div className="card-body">
//                     <div className="table-responsive">
//                         <table className="table table-bordered table-striped mb-0">
//                             <thead className="thead-dark">
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Project Name</th>
//                                     <th>Total Income (₹)</th>
//                                     <th>Material Expense (₹)</th>
//                                     <th>Store Expense (₹)</th>
//                                     <th>Salary Expense (₹)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data?.length > 0 ? data.map((project, index) => (
//                                     <tr key={project.project_id || index}>
//                                         <td>{index + 1}</td>
//                                         <td>{project.project_name}</td>
//                                         <td>{project.total_income.toLocaleString()}</td>
//                                         <td>{project.project_material_expense.toLocaleString()}</td>
//                                         <td>{project.project_store_expense.toLocaleString()}</td>
//                                         <td>{project.project_salary_expense.toLocaleString()}</td>
//                                     </tr>
//                                 )) : (
//                                     <tr>
//                                         <td colSpan="6" className="text-center">No data available</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             <div className="row">
//                 <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
//                     <div className="dash-widget">
//                         <div className="dash-boxs comman-flex-center">
//                             <img src="/assets/img/icons/profile-add.svg" alt="" />
//                         </div>
//                         <div className="dash-content dash-count">
//                             <h4>EMPPLOYEE DETAILS (LAST DAY PRESENT)</h4>
//                             <h2>
//                                 <CountUp end={empData?.presentCount} />
//                             </h2>
//                             <p>
//                                 <span className="passive-view">
//                                     {empData?.date}
//                                 </span>
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className='row'>
//                 {renderTable("Current Month Project Income & Expenses", currentMonth)}
//                 {renderTable("Last Day Project Income & Expenses", lastDay)}
//             </div>
//         </>
//     )
// }

// export default DashCard



import axios from 'axios';
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { V_URL } from '../../../../BaseUrl';

const DashCard = () => {

    const [empData, setEmpData] = useState({});
    const [currentMonth, setCurrentMonth] = useState([]);
    const [lastDay, setLastDay] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchCurrentMonthData = async (month, year) => {
        try {
            const res = await axios({
                method: "POST",
                url: `${V_URL}/admin/get-current-project-in-ex`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
                },
                data: {
                    year_id: localStorage.getItem("PAY_USER_YEAR_ID"),
                    month: month,
                    year: year
                },
            });
            console.log(res.data, 'current month data');
            if (res.data?.success) setCurrentMonth(res.data.data);

        } catch (error) {
            console.log(error?.message);
        }
    };

    const fetchLastDayData = async () => {
        try {
            const res = await axios({
                method: "POST",
                url: `${V_URL}/admin/get-last_date-project-in-ex`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
                },
            });
            console.log(res.data, 'last day data');
            if (res.data?.success) setLastDay(res.data.data);
        } catch (error) {
            console.log(error?.message);
        }
    };

    useEffect(() => {
        axios.get(`${V_URL}/admin/get-att-count`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + localStorage.getItem("VA_TOKEN"),
            }
        }).then(res => {
            if (res.data?.success) setEmpData(res.data.data);
        }).catch(err => console.log(err?.message));

        fetchCurrentMonthData(selectedMonth, selectedYear);
        fetchLastDayData();
    }, [selectedMonth, selectedYear]);

    const renderTable = (title, data, showMonthYearFilter = false, showPartyBillExpense = false) => (
        <div className="col-md-12 mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{title}</h5>

                    {showMonthYearFilter && (
                        <div className="d-flex gap-2 align-items-center">
                            {/* Month Dropdown */}
                            <select
                                className="form-select w-auto"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>

                            {/* Year Dropdown */}
                            <select
                                className="form-select w-auto"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped mb-0">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Project Name</th>
                                    <th>Structure Total Income (₹)</th>
                                    <th>Piping Total Income (₹)</th>

                                    <th>Structure Material Expense (₹)</th>
                                    <th>Piping Material Expense (₹)</th>

                                    <th>Project Store Expense (₹)</th>
                                   

                                    <th>Project Salary Expense (₹)</th>
                                   

                                  { showPartyBillExpense && (<th>Party Bill Expense (₹)</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length > 0 ? data.map((project, index) => (
                                    <tr key={project.project_id || index}>
                                        <td>{index + 1}</td>
                                        <td>{project.project_name}</td>
                                        <td>{(project.structure_total_income ?? 0).toLocaleString()}</td>
                                        <td>{(project.piping_total_income ?? 0).toLocaleString()}</td>
                                        <td>{(project.structure_material_expense ?? 0).toLocaleString()}</td>
                                        <td>{(project.piping_material_expense ?? 0).toLocaleString()}</td>
                                        <td>{(project.project_store_expense ?? 0).toLocaleString()}</td>
                                        <td>{(project.project_salary_expense ?? 0).toLocaleString()}</td>
 
                                       
                                        {/* <td>{(project.party_bill_expense ?? 0).toLocaleString()}</td> */}
                                      { showPartyBillExpense && (   <td>{(project.party_bill_expense ?? 0).toLocaleString()}</td>)}
                                        
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                    <div className="dash-widget">
                        <div className="dash-boxs comman-flex-center">
                            <img src="/assets/img/icons/profile-add.svg" alt="" />
                        </div>
                        <div className="dash-content dash-count">
                            <h4>EMPLOYEE DETAILS (LAST DAY PRESENT)</h4>
                            <h2>
                                <CountUp end={empData?.presentCount} />
                            </h2>
                            <p>
                                <span className="passive-view">{empData?.date}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row'>
                {renderTable("Project Income & Expenses (By Month & Year)", currentMonth, true, true)} 
                {renderTable("Last Day Project Income & Expenses", lastDay)}
            </div>
        </>
    )
}

export default DashCard;

