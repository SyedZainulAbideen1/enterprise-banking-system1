import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./LoanDetails.css";

const LoanDetails = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual loan information will be connected
     * to loanService.js and Firestore later.
     */
    if (!user?.uid) {
      setLoan(null);
      return;
    }

    setLoading(false);
  }, [user?.uid]);

  return (
    <main className="loan-details-page">
      <section className="loan-details-header">
        <div>
          <span className="loan-details-eyebrow">
            CUSTOMER SERVICES
          </span>

          <h1>Loan Details</h1>

          <p>
            View your loan information, application
            status, and approval details.
          </p>
        </div>

        <Link
          to="/customer"
          className="loan-details-back"
        >
          ← Back to Dashboard
        </Link>
      </section>

      <section className="loan-details-card">
        {loading && (
          <div className="loan-details-state">
            <div className="loan-spinner" />
            <h2>Loading Loan Information</h2>
            <p>
              Please wait while your loan details
              are being loaded.
            </p>
          </div>
        )}

        {error && (
          <div
            className="loan-details-message loan-details-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && !error && !loan && (
          <div className="loan-details-state">
            <div className="loan-empty-icon">
              $
            </div>

            <h2>No Loan Information</h2>

            <p>
              You currently do not have an active
              loan record.
            </p>

            <Link
              to="/customer/loan/request"
              className="loan-details-primary"
            >
              Request a Loan
            </Link>
          </div>
        )}

        {!loading && !error && loan && (
          <div className="loan-record">
            <div className="loan-record-heading">
              <div>
                <span>LOAN ACCOUNT</span>
                <h2>Loan Information</h2>
              </div>

              <span className="loan-status">
                {loan.status}
              </span>
            </div>

            <div className="loan-summary">
              <div className="loan-summary-item">
                <span>Loan ID</span>
                <strong>{loan.id}</strong>
              </div>

              <div className="loan-summary-item">
                <span>Amount</span>
                <strong>{loan.amount}</strong>
              </div>

              <div className="loan-summary-item">
                <span>Status</span>
                <strong>{loan.status}</strong>
              </div>
            </div>

            <div className="loan-record-details">
              <div>
                <span>Requested Date</span>
                <strong>
                  {loan.requestedDate}
                </strong>
              </div>

              {loan.approvedDate && (
                <div>
                  <span>Approved Date</span>
                  <strong>
                    {loan.approvedDate}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {!loading && !error && !loan && (
        <section className="loan-help-card">
          <div>
            <span className="loan-help-icon">
              ✓
            </span>
          </div>

          <div>
            <h2>Need financial assistance?</h2>

            <p>
              You can submit a new loan request
              through the secure banking system.
            </p>
          </div>

          <Link
            to="/customer/loan/request"
            className="loan-help-link"
          >
            Apply for Loan →
          </Link>
        </section>
      )}
    </main>
  );
};

export default LoanDetails;