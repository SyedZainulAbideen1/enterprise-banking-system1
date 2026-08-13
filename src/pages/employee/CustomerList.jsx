import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual customer records will be loaded from
     * customerService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake customer records are created here.
     */

    setLoading(false);
    setCustomers([]);
  }, []);

  return (
    <main className="customer-list">
      <section className="customer-list__header">
        <div className="customer-list__header-content">
          <div className="customer-list__eyebrow">
            <span className="customer-list__eyebrow-dot" />
            Customer Management
          </div>

          <h1 className="customer-list__title">
            Customer List
          </h1>

          <p className="customer-list__description">
            View and manage customer accounts from the employee
            dashboard.
          </p>
        </div>

        <Link
          to="/employee"
          className="customer-list__back-link"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          Back to Dashboard
        </Link>
      </section>

      <section className="customer-list__content">
        <div className="customer-list__section-header">
          <div>
            <span className="customer-list__section-label">
              Accounts
            </span>

            <h2>Customer Accounts</h2>

            <p>
              Customer records available to the employee role.
            </p>
          </div>

          <Link
            to="/employee/customers/create"
            className="customer-list__create-button"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            Create Customer
          </Link>
        </div>

        {loading && (
          <div
            className="customer-list__state customer-list__state--loading"
            role="status"
          >
            <div className="customer-list__spinner" />

            <div>
              <h2>Loading Customers</h2>

              <p>
                Please wait while customer records are being loaded.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="customer-list__state customer-list__state--error"
            role="alert"
          >
            <div className="customer-list__state-icon">
              !
            </div>

            <div>
              <h2>Unable to Load Customers</h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          customers.length === 0 && (
            <div className="customer-list__empty">
              <div className="customer-list__empty-icon">
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
              </div>

              <span className="customer-list__empty-label">
                Customer Records
              </span>

              <h2>No Customers Found</h2>

              <p>
                There are currently no customer records
                available.
              </p>

              <Link
                to="/employee/customers/create"
                className="customer-list__empty-button"
              >
                Create Customer
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          customers.length > 0 && (
            <div className="customer-list__table-card">
              <div className="customer-list__table-wrapper">
                <table className="customer-list__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td>
                          <div className="customer-list__customer-name">
                            <span className="customer-list__customer-avatar">
                              {customer.name
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </span>

                            <strong>
                              {customer.name}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="customer-list__email">
                            {customer.email}
                          </span>
                        </td>

                        <td>
                          <span className="customer-list__phone">
                            {customer.phone}
                          </span>
                        </td>

                        <td>
                          <span className="customer-list__status">
                            <span className="customer-list__status-dot" />

                            {customer.status}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/employee/customers/${customer.id}`}
                            className="customer-list__view-button"
                          >
                            View Details

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
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </section>
    </main>
  );
};

export default CustomerList;