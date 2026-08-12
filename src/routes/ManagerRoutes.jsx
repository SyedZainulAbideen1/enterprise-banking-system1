import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import ManagerDashboard from "../pages/manager/ManagerDashboard";
import CustomerManagement from "../pages/manager/CustomerManagement";
import EmployeeManagement from "../pages/manager/EmployeeManagement";
import RegistrationRequests from "../pages/manager/RegistrationRequests";
import LoanRequests from "../pages/manager/LoanRequests";
import TransactionOversight from "../pages/manager/TransactionOversight";

const ManagerRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <Routes>
        <Route
          index
          element={<ManagerDashboard />}
        />

        <Route
          path="customers"
          element={<CustomerManagement />}
        />

        <Route
          path="employees"
          element={<EmployeeManagement />}
        />

        <Route
          path="registrations"
          element={<RegistrationRequests />}
        />

        <Route
          path="loans"
          element={<LoanRequests />}
        />

        <Route
          path="transactions"
          element={<TransactionOversight />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/manager"
              replace
            />
          }
        />
      </Routes>
    </ProtectedRoute>
  );
};

export default ManagerRoutes;