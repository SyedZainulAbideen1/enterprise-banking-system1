import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

import {
  fetchPendingLoanRequests,
  approveLoan,
  rejectLoan,
  clearLoanError,
} from "../../features/loans/loanSlice";

import "./LoanRequests.css";

const LoanRequests = () => {
  const dispatch = useDispatch();

  const {
    requests,
    loading,
    actionLoading,
    error,
    actionError,
    successMessage,
  } = useSelector(
    (state) => state.loans
  );

  useEffect(() => {
    dispatch(
      fetchPendingLoanRequests()
    );

    return () => {
      dispatch(clearLoanError());
    };
  }, [dispatch]);

  const handleApprove = async (
    loanId
  ) => {
    const auth = getAuth();

    const employeeId =
      auth.currentUser?.uid;

    if (!employeeId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to approve this loan?"
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      approveLoan({
        loanId,
        employeeId,
      })
    );
  };

  const handleReject = async (
    loanId
  ) => {
    const auth = getAuth();

    const employeeId =
      auth.currentUser?.uid;

    if (!employeeId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to reject this loan?"
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      rejectLoan({
        loanId,
        employeeId,
      })
    );
  };

  return (
    <main className="loan-requests">
      <section className="loan-requests__header">
        <div className="loan-requests__header-content">
          <div className="loan-requests__eyebrow">
            <span className="loan-requests__eyebrow-dot" />
            Loan Management
          </div>

          <h1 className="loan-requests__title">
            Loan Requests
          </h1>

          <p className="loan-requests__description">
            Review and process pending customer
            loan requests.
          </p>
        </div>

        <Link
          to="/employee"
          className="loan-requests__back-link"
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

      <section className="loan-requests__content">
        <div className="loan-requests__summary">
          <div className="loan-requests__summary-icon">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 2v20M17 6.5c0-1.38-2.24-2.5-5-2.5S7 5.12 7 6.5 9.24 9 12 9s5 1.12 5 2.5S14.76 14 12 14s-5 1.12-5 2.5S9.24 19 12 19s5-1.12 5-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <span className="loan-requests__summary-label">
              Current Queue
            </span>

            <strong className="loan-requests__summary-value">
              {loading
                ? "..."
                : requests.length}
            </strong>

            <span className="loan-requests__summary-text">
              Pending loan request
              {requests.length === 1
                ? ""
                : "s"} for review
            </span>
          </div>
        </div>

        {loading && (
          <div className="loan-requests__state-card">
            <div className="loan-requests__loader">
              <span />
            </div>

            <div>
              <h2>
                Loading Loan Requests
              </h2>

              <p>
                Please wait while the latest
                requests are being retrieved.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="loan-requests__message loan-requests__message--error"
            role="alert"
          >
            <div className="loan-requests__message-icon">
              !
            </div>

            <div>
              <strong>
                Unable to Load Requests
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {actionError && (
          <div
            className="loan-requests__message loan-requests__message--error"
            role="alert"
          >
            <div className="loan-requests__message-icon">
              !
            </div>

            <div>
              <strong>
                Request Action Failed
              </strong>

              <p>{actionError}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div
            className="loan-requests__message loan-requests__message--success"
            role="status"
          >
            <div className="loan-requests__message-icon">
              ✓
            </div>

            <div>
              <strong>
                Request Updated
              </strong>

              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="loan-requests__empty">
              <div className="loan-requests__empty-icon">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M7 4h10a2 2 0 012 2v14H5V6a2 2 0 012-2z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 9h6M9 13h6M9 17h4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2>
                No Loan Requests
              </h2>

              <p>
                There are currently no loan
                requests available for review.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          requests.length > 0 && (
            <div className="loan-requests__table-card">
              <div className="loan-requests__table-header">
                <div>
                  <span className="loan-requests__table-label">
                    Request Queue
                  </span>

                  <h2>
                    Pending Applications
                  </h2>
                </div>

                <span className="loan-requests__count">
                  {requests.length} request
                  {requests.length === 1
                    ? ""
                    : "s"}
                </span>
              </div>

              <div className="loan-requests__table-wrapper">
                <table className="loan-requests__table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Purpose</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map(
                      (loanRequest) => (
                        <tr
                          key={
                            loanRequest.id
                          }
                        >
                          <td>
                            <div className="loan-requests__customer">
                              <div className="loan-requests__customer-avatar">
                                {(
                                  loanRequest.customerName ||
                                  "C"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {loanRequest.customerName ||
                                    "Customer"}
                                </strong>

                                <span>
                                  Loan application
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong className="loan-requests__amount">
                              PKR{" "}
                              {Number(
                                loanRequest.amount ||
                                  0
                              ).toLocaleString(
                                "en-PK"
                              )}
                            </strong>
                          </td>

                          <td>
                            <span className="loan-requests__purpose">
                              {loanRequest.purpose ||
                                "Not provided"}
                            </span>
                          </td>

                          <td>
                            <span className="loan-requests__duration">
                              {loanRequest.duration ||
                                0}{" "}
                              months
                            </span>
                          </td>

                          <td>
                            <span className="loan-requests__status">
                              <span className="loan-requests__status-dot" />

                              {loanRequest.status ||
                                "Pending"}
                            </span>
                          </td>

                          <td>
                            <div className="loan-requests__actions">
                              <button
                                type="button"
                                className="loan-requests__action loan-requests__action--approve"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleApprove(
                                    loanRequest.id
                                  )
                                }
                              >
                                {actionLoading ? (
                                  <>
                                    <span className="loan-requests__button-spinner" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
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

                                    Approve
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                className="loan-requests__action loan-requests__action--reject"
                                disabled={
                                  actionLoading
                                }
                                onClick={() =>
                                  handleReject(
                                    loanRequest.id
                                  )
                                }
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M6 6l12 12M18 6L6 18"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>

                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </section>
    </main>
  );
};

export default LoanRequests;