import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CustomerDetails.css";

const CustomerDetails = () => {
  const { customerId } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * The actual customer record will be loaded from
     * customerService.js and Firestore during the
     * functionality integration phase.
     *
     * We do not create fake customer information here.
     */

    if (!customerId) {
      setError("Customer ID is missing.");
      return;
    }

    setLoading(false);
    setCustomer(null);
  }, [customerId]);

  return (
    <main className="customer-details">
      <section className="customer-details__header">
        <div className="customer-details__header-content">
          <div className="customer-details__eyebrow">
            <span className="customer-details__eyebrow-dot" />
            Customer Management
          </div>

          <h1 className="customer-details__title">
            Customer Details
          </h1>

          <p className="customer-details__description">
            View the complete information of an individual
            customer.
          </p>
        </div>

        <Link
          to="/employee/customers"
          className="customer-details__back-link"
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

          Back to Customer List
        </Link>
      </section>

      <section className="customer-details__reference">
        <div className="customer-details__reference-icon">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M8 7h8M8 12h8M8 17h5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <rect
              x="4"
              y="3"
              width="16"
              height="18"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </div>

        <div className="customer-details__reference-content">
          <span>Customer Reference</span>

          <strong>
            {customerId || "Not available"}
          </strong>
        </div>
      </section>

      <section className="customer-details__content">
        {loading && (
          <div
            className="customer-details__state customer-details__state--loading"
            role="status"
          >
            <div className="customer-details__spinner" />

            <div>
              <h2>Loading Customer Details</h2>

              <p>
                Please wait while customer information is
                being loaded.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="customer-details__state customer-details__state--error"
            role="alert"
          >
            <div className="customer-details__state-icon">
              !
            </div>

            <div>
              <h2>Unable to Load Customer</h2>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && !customer && (
          <div className="customer-details__empty">
            <div className="customer-details__empty-icon">
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
                  d="M15 8h6M18 5v6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span className="customer-details__empty-label">
              Customer Information
            </span>

            <h2>Customer Data Not Available</h2>

            <p>
              Customer information will appear here after
              the customer database is connected.
            </p>

            <Link
              to="/employee/customers"
              className="customer-details__empty-button"
            >
              Return to Customer List
            </Link>
          </div>
        )}

        {!loading && !error && customer && (
          <div className="customer-details__account">
            <div className="customer-details__section-heading">
              <div>
                <span className="customer-details__section-label">
                  Account
                </span>

                <h2>Account Information</h2>

                <p>
                  Customer account and profile information.
                </p>
              </div>

              <span className="customer-details__status">
                <span className="customer-details__status-dot" />

                {customer.status}
              </span>
            </div>

            <div className="customer-details__profile">
              <div className="customer-details__profile-main">
                <div className="customer-details__avatar">
                  {customer.name
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>

                <div>
                  <h3>
                    {customer.name}
                  </h3>

                  <p>
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="customer-details__fields">
                <div className="customer-details__field">
                  <span>Name</span>

                  <strong>
                    {customer.name}
                  </strong>
                </div>

                <div className="customer-details__field">
                  <span>Email</span>

                  <strong>
                    {customer.email}
                  </strong>
                </div>

                <div className="customer-details__field">
                  <span>Phone</span>

                  <strong>
                    {customer.phone}
                  </strong>
                </div>

                <div className="customer-details__field">
                  <span>Account Number</span>

                  <strong>
                    {customer.accountNumber}
                  </strong>
                </div>

                <div className="customer-details__field customer-details__field--wide">
                  <span>Address</span>

                  <strong>
                    {customer.address}
                  </strong>
                </div>

                <div className="customer-details__field">
                  <span>Status</span>

                  <strong className="customer-details__field-status">
                    {customer.status}
                  </strong>
                </div>

                <div className="customer-details__field">
                  <span>Created At</span>

                  <strong>
                    {customer.createdAt}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default CustomerDetails;