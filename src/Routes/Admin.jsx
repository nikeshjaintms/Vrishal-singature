import React from 'react'
import Dashboard from '../Pages/Admin/Dashboard/Dashboard'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../Pages/Admin/Login/Login'
import ForgetPassword from '../Pages/Admin/Login/ForgetPassword'
import Otp from '../Pages/Admin/Login/Otp'
import ResetPassword from '../Pages/Admin/Login/ResetPassword'
import Firm from '../Pages/Admin/Firm/Firm'
import ManageFirm from '../Pages/Admin/Firm/ManageFirm'
import EditProfile from '../Pages/Admin/Profile/EditProfile'
import User from '../Pages/Admin/User/User'
import ManageUser from '../Pages/Admin/User/ManageUser'
import Project from '../Pages/Admin/Project/Project'
import ManageProject from '../Pages/Admin/Project/ManageProject'
import AuthPerson from '../Pages/Admin/AuthPerson/AuthPerson'
import ManageAuthPerson from '../Pages/Admin/AuthPerson/ManageAuthPerson'
import Client from '../Pages/Admin/Client/Client'
import ManageClient from '../Pages/Admin/Client/ManageClient'
import VerifyRequest from '../Pages/Admin/VerifyRequest/VerifyRequest'
import ViewRequest from '../Pages/Admin/VerifyRequest/ViewRequest'
import VerifyRequestPiping from '../Pages/Admin/VerifyRequestPiping/VerifyRequestPiping'
import ViewRequestPiping from '../Pages/Admin/VerifyRequestPiping/ViewRequestPiping'
import Department from '../Pages/Admin/Department/Department'
import ManageDepartment from '../Pages/Admin/Department/ManageDepartment'
import Year from '../Pages/Admin/Year/Year'
import ManageYear from '../Pages/Admin/Year/ManageYear'
import Role from '../Pages/Admin/Role/Role'
import ManageRole from '../Pages/Admin/Role/ManageRole'
import Product from '../Pages/Admin/Product/Product'
import ManageProduct from '../Pages/Admin/Product/ManageProduct'
import ProjectType from '../Pages/Admin/ProjectType/ProjectType'
import ManageProjectType from '../Pages/Admin/ProjectType/ManageProjectType'
import Contractor from '../Pages/Admin/Contractor/Contractor'
import ManageContractor from '../Pages/Admin/Contractor/ManageContractor'
import GetPurchaseRequest from '../Pages/Admin/Purchase Request/GetPurchaseRequest'
import EditRequestManage from '../Pages/Admin/Purchase Request/EditRequestManage'

//admin main store  
import PurchaseRequest from '../Pages/Admin/MainStore/Purchase-Request/PurchaseRequest'
import Order from '../Pages/Admin/MainStore/Purchase-Order/Order'
import PurchaseRecieving from '../Pages/Admin/MainStore/Purchase-Recieving/PurchaseRecieving'
import PurchaseReturn from '../Pages/Admin/MainStore/Purchase-Return/PurchaseReturn'
import Issue from '../Pages/Admin/MainStore/Issue/Issue'
import IssueReturn from '../Pages/Admin/MainStore/IssueReturn/IssueReturn'
import ViewPurchaseRequest from '../Pages/Admin/MainStore/Purchase-Request/ViewPurchaseRequest'
import ViewOrder from '../Pages/Admin/MainStore/Purchase-Order/ViewOrder'
import VIewRecieving from '../Pages/Admin/MainStore/Purchase-Recieving/VIewRecieving'
import ViewPurchaseReturn from '../Pages/Admin/MainStore/Purchase-Return/ViewPurchaseReturn'
import ViewIssue from '../Pages/Admin/MainStore/Issue/ViewIssue'
import ViewIssueReturn from '../Pages/Admin/MainStore/IssueReturn/ViewIssueReturn'
import Stock from '../Pages/Admin/MainStore/Stock/Stock'
import DailyAttendance from '../Pages/Admin/PayRoll/Attendance/Daily/DailyAttendance'
import PMSStock from '../Pages/Admin/PMS/PMSStock/PMSStock'
import ProjectAttendance from '../Pages/Admin/PayRoll/Attendance/ProjectAttendance/ProjectAttendance'
// import DailyAttendance from '../Pages/Admin/PayRoll/Attendance/Daily/DailyAttendance'

const Admin = () => {
    return (
        <>
            <Routes>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

                <Route path='/admin/login' element={<Login />} />
                <Route path='/admin/forget-password' element={<ForgetPassword />} />
                <Route path='/admin/otp-verification' element={<Otp />} />
                <Route path='/admin/reset-password' element={<ResetPassword />} />

                <Route path='/admin/edit-profile' element={<EditProfile />} />
                <Route path='/admin/dashboard' element={<Dashboard />} />

                <Route path='/admin/firm-management' element={<Firm />} />
                <Route path='/admin/manage-firm' element={<ManageFirm />} />

                <Route path='/admin/year-management' element={<Year />} />
                <Route path='/admin/manage-year' element={<ManageYear />} />

                <Route path='/admin/erprole-management' element={<Role />} />
                <Route path='/admin/manage-erprole' element={<ManageRole />} />

                <Route path='/admin/product-management' element={<Product />} />
                <Route path='/admin/manage-product' element={<ManageProduct />} />

                <Route path='/admin/project-type-management' element={<ProjectType />} />
                <Route path='/admin/manage-project-type' element={<ManageProjectType />} />

                <Route path='/admin/contractor-management' element={<Contractor />} />
                <Route path='/admin/manage-contractor' element={<ManageContractor />} />

                <Route path='/admin/user-management' element={<User />} />
                <Route path='/admin/manage-user' element={<ManageUser />} />

                <Route path='/admin/project-management' element={<Project />} />
                <Route path='/admin/manage-project' element={<ManageProject />} />

                <Route path='/admin/auth-people-management' element={<AuthPerson />} />
                <Route path='/admin/manage-auth-people' element={<ManageAuthPerson />} />

                <Route path='/admin/department-management' element={<Department />} />
                <Route path='/admin/manage-department' element={< ManageDepartment />} />

                <Route path='/admin/verify-purchase-request' element={<GetPurchaseRequest />} />
                <Route path='/admin/edit-request-admin' element={<EditRequestManage />} />

                <Route path='/admin/client-management' element={<Client />} />
                <Route path='/admin/manage-client' element={<ManageClient />} />

                <Route path='/admin/verify-request-management' element={<VerifyRequest />} />
                <Route path='/admin/view-request' element={<ViewRequest />} />
                 <Route path='/admin/verify-request-management-piping' element={<VerifyRequestPiping />} />
                <Route path='/admin/view-request-piping' element={<ViewRequestPiping />} />
                {/* ---------------Admin Main Store--------------------------*/}
                <Route path='/admin/purchase-request' element={<PurchaseRequest />} />
                <Route path='/admin/view-purchase-request' element={<ViewPurchaseRequest />} />

                <Route path='/admin/purchase-order' element={<Order />} />
                <Route path='/admin/view-purchase-order' element={<ViewOrder />} />

                <Route path='/admin/purchase-recieving' element={<PurchaseRecieving />} />
                <Route path='/admin/view-purchase-recieving' element={<VIewRecieving />} />

                <Route path='/admin/purchase-return' element={<PurchaseReturn />} />
                <Route path='/admin/view-purchase-return' element={<ViewPurchaseReturn />} />

                <Route path='/admin/issue' element={<Issue />} />
                <Route path='/admin/view-issue' element={<ViewIssue />} />

                <Route path='/admin/issue-return' element={<IssueReturn />} />
                <Route path='/admin/view-issue-return' element={<ViewIssueReturn />} />

                <Route path='/admin/stock' element={<Stock />} />

                {/* admin payroll */}
                <Route path='/admin/daily-attendance' element={< DailyAttendance />} />

                {/* project wise attendance */}
                <Route path='/admin/project-attendance' element={< ProjectAttendance />} />

                {/* admin pms */}
                <Route path='/admin/pms-stock' element={< PMSStock />} />

                <Route path='/admin/*' element={<Navigate to='/admin/dashboard' />} />
            </Routes>

        </>
    )
}

export default Admin