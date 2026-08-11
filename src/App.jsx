import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PendingApproval from "./pages/auth/PendingApproval";
import AccountRejected from "./pages/auth/AccountRejected";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}

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

        {/* Manager Route */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <main>
                <h1>Manager Dashboard</h1>

                <p>
                  Manager dashboard is under development.
                </p>
              </main>
            </ProtectedRoute>
          }
        />

        {/* Employee Route */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <main>
                <h1>Employee Dashboard</h1>

                <p>
                  Employee dashboard is under development.
                </p>
              </main>
            </ProtectedRoute>
          }
        />

        {/* Customer Route */}

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <main>
                <h1>Customer Dashboard</h1>

                <p>
                  Customer dashboard is under development.
                </p>
              </main>
            </ProtectedRoute>
          }
        />

        {/* Temporary Home Route */}

        <Route
          path="/"
          element={
            <main>
              <h1>Enterprise Banking System</h1>

              <p>
                Banking system application is under development.
              </p>
            </main>
          }
        />

        {/* Fallback Route */}

        <Route
          path="*"
          element={
            <main>
              <h1>404</h1>

              <p>
                Page not found.
              </p>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;