import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/common/ProtectedRoute";

import CustomerDashboard from "../pages/customer/CustomerDashboard";
import TransactionHistory from "../pages/customer/TransactionHistory";
import LoanDetails from "../pages/customer/LoanDetails";
import RequestLoan from "../pages/customer/RequestLoan";
import DepositRequest from "../pages/customer/DepositRequest";
import WithdrawRequest from "../pages/customer/WithdrawRequest";
import DonationRequest from "../pages/customer/DonationRequest";

const CustomerRoutes = () => {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <Routes>
        <Route
          index
          element={<CustomerDashboard />}
        />

        <Route
          path="transactions"
          element={<TransactionHistory />}
        />

        <Route
          path="loan"
          element={<LoanDetails />}
        />

        <Route
          path="loan/request"
          element={<RequestLoan />}
        />

        <Route
          path="deposit"
          element={<DepositRequest />}
        />

        <Route
          path="withdraw"
          element={<WithdrawRequest />}
        />

        <Route
          path="donation"
          element={<DonationRequest />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/customer"
              replace
            />
          }
        />
      </Routes>
    </ProtectedRoute>
  );
};

export default CustomerRoutes;