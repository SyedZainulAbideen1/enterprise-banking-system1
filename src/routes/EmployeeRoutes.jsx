import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import CustomerList from "../pages/employee/CustomerList";
import CustomerDetails from "../pages/employee/CustomerDetails";
import CreateCustomer from "../pages/employee/CreateCustomer";
import LoanRequests from "../pages/employee/LoanRequests";
import TransactionRequests from "../pages/employee/TransactionRequests";

const EmployeeRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <Routes>
        <Route
          index
          element={<EmployeeDashboard />}
        />

        <Route
          path="customers"
          element={<CustomerList />}
        />

        <Route
          path="customers/:customerId"
          element={<CustomerDetails />}
        />

        <Route
          path="customers/create"
          element={<CreateCustomer />}
        />

        <Route
          path="loans"
          element={<LoanRequests />}
        />

        <Route
          path="transactions"
          element={<TransactionRequests />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/employee"
              replace
            />
          }
        />
      </Routes>
    </ProtectedRoute>
  );
};

export default EmployeeRoutes;