import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./CustomerManagement.css";

const CustomerManagement = () => {
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
    <main className="manager-customer-management">
      <section className="manager-customer-management__hero">
        <div className="manager-customer-management__hero-content">
          <Link
            to="/manager"
            className="manager-customer-management__back-link"
          >
            <span aria-hidden="true">←</span>
            Back to Manager Dashboard
          </Link>

          <div className="manager-customer-management__eyebrow">
            <span />
            Customer Operations
          </div>

          <h1>Customer Management</h1>

          <p>
            Manage customer accounts and review customer
            information from the manager portal.
          </p>
        </div>

        <div className="manager-customer-management__hero-icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="8"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            />

            <path
              d="M4 20v-1.5A3.5 3.5 0 017.5 15h5a3.5 3.5 0 013.5 3.5V20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />

            <path
              d="M17 8h4M19 6v4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      <section className="manager-customer-management__content">
        <div className="manager-customer-management__section-heading">
          <div>
            <span>
              Customer Directory
            </span>

            <h2>Customer Accounts</h2>
          </div>

          <div className="manager-customer-management__record-count">
            <strong>{customers.length}</strong>
            <span>Records</span>
          </div>
        </div>

        <div className="manager-customer-management__panel">
          {loading && (
            <div
              className="manager-customer-management__state"
              aria-live="polite"
            >
              <div className="manager-customer-management__spinner" />

              <h2>Loading Customers</h2>

              <p>
                Customer records are being loaded.
              </p>
            </div>
          )}

          {error && (
            <div
              className="manager-customer-management__state manager-customer-management__state--error"
              role="alert"
            >
              <div className="manager-customer-management__state-icon">
                !
              </div>

              <h2>Unable to Load Customers</h2>

              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            customers.length === 0 && (
              <div className="manager-customer-management__state">
                <div className="manager-customer-management__empty-icon">
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
                      d="M16 8h4M18 6v4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="manager-customer-management__state-label">
                  Customer Directory
                </span>

                <h2>No Customers Found</h2>

                <p>
                  There are currently no customer
                  records available for management.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            customers.length > 0 && (
              <div className="manager-customer-management__table-wrapper">
                <table className="manager-customer-management__table">
                  <thead>
                    <tr>
                      <th scope="col">Customer</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map(
                      (customer) => (
                        <tr key={customer.id}>
                          <td>
                            <div className="manager-customer-management__customer">
                              <div className="manager-customer-management__customer-avatar">
                                {customer.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "C"}
                              </div>

                              <div>
                                <strong>
                                  {customer.name}
                                </strong>

                                <span>
                                  Customer Account
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="manager-customer-management__table-text">
                              {customer.email}
                            </span>
                          </td>

                          <td>
                            <span className="manager-customer-management__table-text">
                              {customer.phone}
                            </span>
                          </td>

                          <td>
                            <span className="manager-customer-management__status">
                              <span />
                              {customer.status}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="manager-customer-management__manage-button"
                              disabled
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </section>
    </main>
  );
};

export default CustomerManagement;