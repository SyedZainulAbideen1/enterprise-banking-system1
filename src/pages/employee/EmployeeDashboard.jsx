import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const employeeName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    "Employee";

  const email =
    profile?.email ||
    user?.email ||
    "No email available";

  const role = profile?.role || "employee";
  const accountStatus = profile?.status || "active";

  return (
    <main className="employee-dashboard">
      <section className="employee-dashboard__hero">
        <div className="employee-dashboard__hero-content">
          <div className="employee-dashboard__eyebrow">
            <span className="employee-dashboard__eyebrow-dot" />
            Employee Portal
          </div>

          <h1 className="employee-dashboard__title">
            Welcome back, {employeeName}
          </h1>

          <p className="employee-dashboard__description">
            Manage customer accounts, loan requests, and
            transaction requests from your employee workspace.
          </p>
        </div>

        <div className="employee-dashboard__hero-badge">
          <span className="employee-dashboard__hero-badge-icon">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12l2 2 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div>
            <strong>Secure Workspace</strong>
            <span>Authorized employee access</span>
          </div>
        </div>
      </section>

      <section className="employee-dashboard__section">
        <div className="employee-dashboard__section-heading">
          <div>
            <span className="employee-dashboard__section-label">
              Account
            </span>

            <h2>Employee Information</h2>

            <p>
              Your account and role information.
            </p>
          </div>
        </div>

        <div className="employee-dashboard__profile-card">
          <div className="employee-dashboard__profile-main">
            <div className="employee-dashboard__avatar">
              {employeeName.charAt(0).toUpperCase()}
            </div>

            <div className="employee-dashboard__profile-heading">
              <h3>{employeeName}</h3>

              <p>{email}</p>

              <span className="employee-dashboard__status">
                <span className="employee-dashboard__status-dot" />
                {accountStatus}
              </span>
            </div>
          </div>

          <div className="employee-dashboard__profile-details">
            <div className="employee-dashboard__detail">
              <span className="employee-dashboard__detail-label">
                Role
              </span>

              <strong>
                {role}
              </strong>
            </div>

            <div className="employee-dashboard__detail">
              <span className="employee-dashboard__detail-label">
                Account Status
              </span>

              <strong className="employee-dashboard__detail-status">
                {accountStatus}
              </strong>
            </div>

            {user?.uid && (
              <div className="employee-dashboard__detail employee-dashboard__detail--full">
                <span className="employee-dashboard__detail-label">
                  User ID
                </span>

                <strong className="employee-dashboard__user-id">
                  {user.uid}
                </strong>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="employee-dashboard__section">
        <div className="employee-dashboard__section-heading">
          <div>
            <span className="employee-dashboard__section-label">
              Operations
            </span>

            <h2>Employee Services</h2>

            <p>
              Access the tools required to manage daily banking operations.
            </p>
          </div>
        </div>

        <nav
          className="employee-dashboard__services"
          aria-label="Employee services"
        >
          <Link
            to="/employee/customers"
            className="employee-dashboard__service-card"
          >
            <span className="employee-dashboard__service-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="employee-dashboard__service-content">
              <strong>Customer List</strong>

              <span>
                View and manage customer account information.
              </span>
            </span>

            <span className="employee-dashboard__service-arrow">
              →
            </span>
          </Link>

          <Link
            to="/employee/customers/create"
            className="employee-dashboard__service-card"
          >
            <span className="employee-dashboard__service-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M19 8v6M16 11h6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="employee-dashboard__service-content">
              <strong>Create Customer</strong>

              <span>
                Create a new customer account when authorized.
              </span>
            </span>

            <span className="employee-dashboard__service-arrow">
              →
            </span>
          </Link>

          <Link
            to="/employee/loans"
            className="employee-dashboard__service-card"
          >
            <span className="employee-dashboard__service-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M3 10h18M7 15h3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="employee-dashboard__service-content">
              <strong>Loan Requests</strong>

              <span>
                Review and process customer loan requests.
              </span>
            </span>

            <span className="employee-dashboard__service-arrow">
              →
            </span>
          </Link>

          <Link
            to="/employee/transactions"
            className="employee-dashboard__service-card"
          >
            <span className="employee-dashboard__service-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="17"
                  r="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>

            <span className="employee-dashboard__service-content">
              <strong>Transaction Requests</strong>

              <span>
                Review customer deposit and withdrawal requests.
              </span>
            </span>

            <span className="employee-dashboard__service-arrow">
              →
            </span>
          </Link>
        </nav>
      </section>

      <section className="employee-dashboard__section">
        <div className="employee-dashboard__section-heading">
          <div>
            <span className="employee-dashboard__section-label">
              Responsibilities
            </span>

            <h2>Employee Responsibilities</h2>

            <p>
              Core responsibilities available within your role.
            </p>
          </div>
        </div>

        <div className="employee-dashboard__responsibilities">
          <div className="employee-dashboard__responsibility">
            <span className="employee-dashboard__responsibility-number">
              01
            </span>

            <div>
              <h3>Customer Management</h3>

              <p>
                View and manage customer information.
              </p>
            </div>
          </div>

          <div className="employee-dashboard__responsibility">
            <span className="employee-dashboard__responsibility-number">
              02
            </span>

            <div>
              <h3>Account Creation</h3>

              <p>
                Create customer accounts when authorized.
              </p>
            </div>
          </div>

          <div className="employee-dashboard__responsibility">
            <span className="employee-dashboard__responsibility-number">
              03
            </span>

            <div>
              <h3>Loan Review</h3>

              <p>
                Review customer loan requests.
              </p>
            </div>
          </div>

          <div className="employee-dashboard__responsibility">
            <span className="employee-dashboard__responsibility-number">
              04
            </span>

            <div>
              <h3>Transaction Review</h3>

              <p>
                Review customer transaction requests.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EmployeeDashboard;