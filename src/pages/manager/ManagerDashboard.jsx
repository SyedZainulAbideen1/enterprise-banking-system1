import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./ManagerDashboard.css";

const ManagerDashboard = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const managerName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    "Manager";

  const email =
    profile?.email ||
    user?.email ||
    "No email available";

  const managementServices = [
    {
      title: "Registration Requests",
      description:
        "Review and process new customer registration requests.",
      path: "/manager/registrations",
      icon: "registrations",
    },
    {
      title: "Customer Management",
      description:
        "View and manage customer account information.",
      path: "/manager/customers",
      icon: "customers",
    },
    {
      title: "Employee Management",
      description:
        "Manage employee accounts and access.",
      path: "/manager/employees",
      icon: "employees",
    },
    {
      title: "Loan Requests",
      description:
        "Review and manage customer loan requests.",
      path: "/manager/loans",
      icon: "loans",
    },
    {
      title: "Transaction Oversight",
      description:
        "Monitor and review banking transactions.",
      path: "/manager/transactions",
      icon: "transactions",
    },
  ];

  const responsibilities = [
    "Review new registration requests.",
    "Approve or reject registration requests.",
    "Manage customer accounts.",
    "Manage employee accounts.",
    "Review loan requests.",
    "Monitor banking transactions.",
  ];

  return (
    <main className="manager-dashboard">
      <section className="manager-dashboard__hero">
        <div className="manager-dashboard__hero-content">
          <div className="manager-dashboard__eyebrow">
            <span className="manager-dashboard__eyebrow-dot" />
            Management Portal
          </div>

          <h1 className="manager-dashboard__title">
            Manager Dashboard
          </h1>

          <p className="manager-dashboard__welcome">
            Welcome back,{" "}
            <strong>{managerName}</strong>.
          </p>

          <p className="manager-dashboard__hero-description">
            Manage registrations, customers, employees,
            loans, and banking transactions from one
            secure management workspace.
          </p>
        </div>

        <div className="manager-dashboard__hero-badge">
          <div className="manager-dashboard__hero-badge-icon">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />

              <path
                d="M9 12l2 2 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <span>Access Level</span>
            <strong>Manager</strong>
          </div>
        </div>
      </section>

      <section className="manager-dashboard__content">
        <div className="manager-dashboard__section-heading">
          <div>
            <span className="manager-dashboard__section-label">
              Account Overview
            </span>

            <h2>Manager Information</h2>
          </div>
        </div>

        <div className="manager-dashboard__profile-card">
          <div className="manager-dashboard__profile-main">
            <div className="manager-dashboard__avatar">
              {managerName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <span className="manager-dashboard__profile-label">
                Signed-in Manager
              </span>

              <h3>{managerName}</h3>

              <p>{email}</p>
            </div>
          </div>

          <div className="manager-dashboard__profile-details">
            <div className="manager-dashboard__detail">
              <span>Role</span>

              <strong>
                {profile?.role || "manager"}
              </strong>
            </div>

            <div className="manager-dashboard__detail">
              <span>Account Status</span>

              <strong className="manager-dashboard__status">
                <span />
                {profile?.status || "active"}
              </strong>
            </div>

            {user?.uid && (
              <div className="manager-dashboard__detail manager-dashboard__detail--uid">
                <span>User ID</span>

                <strong title={user.uid}>
                  {user.uid}
                </strong>
              </div>
            )}
          </div>
        </div>

        <div className="manager-dashboard__section-heading manager-dashboard__section-heading--services">
          <div>
            <span className="manager-dashboard__section-label">
              Management Tools
            </span>

            <h2>Management Services</h2>
          </div>

          <p>
            Select a management area to continue.
          </p>
        </div>

        <nav
          className="manager-dashboard__services"
          aria-label="Management services"
        >
          {managementServices.map(
            (service) => (
              <Link
                key={service.path}
                to={service.path}
                className="manager-dashboard__service-card"
              >
                <div className="manager-dashboard__service-icon">
                  {service.icon ===
                    "registrations" && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M8 8h8M8 12h6M8 16h4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {service.icon ===
                    "customers" && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M16 20v-1.5a3.5 3.5 0 00-3.5-3.5h-5A3.5 3.5 0 004 18.5V20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="10"
                        cy="8"
                        r="3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M16 11a3 3 0 100-6M16 15h1a3 3 0 013 3v2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {service.icon ===
                    "employees" && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M5 20v-1.5A4.5 4.5 0 019.5 14h5a4.5 4.5 0 014.5 4.5V20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M18 8h3M19.5 6.5v3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {service.icon ===
                    "loans" && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <rect
                        x="4"
                        y="5"
                        width="16"
                        height="14"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />

                      <path
                        d="M8 10h8M8 14h5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {service.icon ===
                    "transactions" && (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 7h13M13 4l4 3-4 3M20 17H7M11 14l-4 3 4 3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <div className="manager-dashboard__service-content">
                  <h3>{service.title}</h3>

                  <p>
                    {service.description}
                  </p>
                </div>

                <span className="manager-dashboard__service-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            )
          )}
        </nav>

        <section className="manager-dashboard__responsibilities">
          <div className="manager-dashboard__responsibilities-heading">
            <div className="manager-dashboard__responsibilities-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 3l7 3v5c0 4.5-2.8 8.2-7 10-4.2-1.8-7-5.5-7-10V6l7-3z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />

                <path
                  d="M9 12l2 2 4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span>
                Manager Operations
              </span>

              <h2>
                Manager Responsibilities
              </h2>
            </div>
          </div>

          <ul className="manager-dashboard__responsibilities-list">
            {responsibilities.map(
              (responsibility) => (
                <li key={responsibility}>
                  <span className="manager-dashboard__check">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12l4 4L19 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span>
                    {responsibility}
                  </span>
                </li>
              )
            )}
          </ul>
        </section>
      </section>
    </main>
  );
};

export default ManagerDashboard;