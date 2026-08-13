import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PendingApproval from "../pages/auth/PendingApproval";
import AccountRejected from "../pages/auth/AccountRejected";

import Home from "../pages/public/Home";

import CustomerRoutes from "./CustomerRoutes";
import EmployeeRoutes from "./EmployeeRoutes";
import ManagerRoutes from "./ManagerRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Homepage */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/registration-pending"
        element={<PendingApproval />}
      />

      <Route
        path="/account-rejected"
        element={<AccountRejected />}
      />

      {/* Protected Application Routes */}
      <Route
        path="/customer/*"
        element={<CustomerRoutes />}
      />

      <Route
        path="/employee/*"
        element={<EmployeeRoutes />}
      />

      <Route
        path="/manager/*"
        element={<ManagerRoutes />}
      />

      {/* Unknown Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;