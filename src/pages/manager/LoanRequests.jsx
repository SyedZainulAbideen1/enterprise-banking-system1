import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

import {
  fetchPendingManagerLoanRequests,
  approveManagerLoan,
  rejectManagerLoan,
  clearLoanError,
} from "../../features/loans/loanSlice";

import "./LoanRequests.css";

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "PKR 0";
  }

  return `PKR ${numericAmount.toLocaleString("en-PK")}`;
};

const LoanRequests = () => {
  const dispatch = useDispatch();

  const {
    requests = [],
    loading = false,
    actionLoading = false,
    error = null,
    actionError = null,
    successMessage = "",
  } = useSelector(
    (state) => state.loans || {}
  );

  useEffect(() => {
    dispatch(fetchPendingManagerLoanRequests());

    return () => {
      dispatch(clearLoanError());
    };
  }, [dispatch]);

  const getManagerId = () => {
    const auth = getAuth();

    return auth.currentUser?.uid || "";
  };

  const handleApprove = async (loanId) => {
    const managerId = getManagerId();

    if (!managerId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this high-value loan?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      approveManagerLoan({
        loanId,
        managerId,
      })
    );
  };

  const handleReject = async (loanId) => {
    const managerId = getManagerId();

    if (!managerId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this high-value loan?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      rejectManagerLoan({
        loanId,
        managerId,
      })
    );
  };

  return (
    <main className="manager-loan-requests">
      <section className="manager-loan-requests__header">
        <div className="manager-loan-requests__header-content">
          <div>
            <span className="manager-loan-requests__eyebrow">
              Manager Approval
            </span>

            <h1 className="manager-loan-requests__title">
              High-Value Loan Requests
            </h1>

            <p className="manager-loan-requests__description">
              Review and manage loan requests requiring
              Manager approval.
            </p>
          </div>

          <Link
            to="/manager"
            className="manager-loan-requests__back-link"
          >
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="manager-loan-requests__summary">
        <div className="manager-loan-requests__summary-card">
          <div className="manager-loan-requests__summary-icon">
            ₨
          </div>

          <div>
            <span className="manager-loan-requests__summary-label">
              Pending High-Value Loans
            </span>

            <strong className="manager-loan-requests__summary-value">
              {requests.length}
            </strong>
          </div>
        </div>

        <div className="manager-loan-requests__summary-info">
          <span className="manager-loan-requests__summary-dot" />
          Requires Manager review
        </div>
      </section>

      {actionError && (
        <div
          className="manager-loan-requests__message manager-loan-requests__message--error"
          role="alert"
        >
          <span className="manager-loan-requests__message-icon">
            !
          </span>

          <div>
            <strong>Action could not be completed</strong>
            <p>{actionError}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          className="manager-loan-requests__message manager-loan-requests__message--success"
          role="status"
        >
          <span className="manager-loan-requests__message-icon">
            ✓
          </span>

          <div>
            <strong>Request updated</strong>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <section className="manager-loan-requests__content">
        <div className="manager-loan-requests__content-header">
          <div>
            <h2 className="manager-loan-requests__section-title">
              Pending Loan Applications
            </h2>

            <p className="manager-loan-requests__section-description">
              Review the loan details carefully before
              approving or rejecting a request.
            </p>
          </div>

          <div className="manager-loan-requests__count">
            {requests.length}{" "}
            {requests.length === 1
              ? "Request"
              : "Requests"}
          </div>
        </div>

        {loading && (
          <div
            className="manager-loan-requests__state manager-loan-requests__state--loading"
            role="status"
            aria-live="polite"
          >
            <div className="manager-loan-requests__loader" />

            <h3>Loading loan requests</h3>

            <p>
              Please wait while we retrieve the latest
              high-value loan requests.
            </p>
          </div>
        )}

        {error && (
          <div
            className="manager-loan-requests__state manager-loan-requests__state--error"
            role="alert"
          >
            <div className="manager-loan-requests__state-icon">
              !
            </div>

            <h3>Unable to load loan requests</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="manager-loan-requests__state manager-loan-requests__state--empty">
              <div className="manager-loan-requests__empty-icon">
                ✓
              </div>

              <h3>No High-Value Loan Requests</h3>

              <p>
                There are currently no high-value loan
                requests available for Manager approval.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          requests.length > 0 && (
            <div className="manager-loan-requests__table-wrapper">
              <table className="manager-loan-requests__table">
                <thead>
                  <tr>
                    <th scope="col">Customer</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    const status =
                      request.status || "pending";

                    return (
                      <tr key={request.id}>
                        <td data-label="Customer">
                          <div className="manager-loan-requests__customer">
                            <div className="manager-loan-requests__avatar">
                              {(request.customerName ||
                                "Customer")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {request.customerName ||
                                  "Customer"}
                              </strong>

                              <span>
                                Loan applicant
                              </span>
                            </div>
                          </div>
                        </td>

                        <td data-label="Amount">
                          <strong className="manager-loan-requests__amount">
                            {formatAmount(
                              request.amount
                            )}
                          </strong>
                        </td>

                        <td data-label="Purpose">
                          <span className="manager-loan-requests__purpose">
                            {request.purpose ||
                              "Not provided"}
                          </span>
                        </td>

                        <td data-label="Duration">
                          <span className="manager-loan-requests__duration">
                            {request.duration || 0}{" "}
                            months
                          </span>
                        </td>

                        <td data-label="Status">
                          <span
                            className={`manager-loan-requests__status manager-loan-requests__status--${String(
                              status
                            ).toLowerCase()}`}
                          >
                            <span className="manager-loan-requests__status-dot" />
                            {status}
                          </span>
                        </td>

                        <td data-label="Actions">
                          <div className="manager-loan-requests__actions">
                            <button
                              type="button"
                              className="manager-loan-requests__button manager-loan-requests__button--approve"
                              disabled={actionLoading}
                              onClick={() =>
                                handleApprove(
                                  request.id
                                )
                              }
                            >
                              {actionLoading ? (
                                <>
                                  <span className="manager-loan-requests__button-spinner" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <span aria-hidden="true">
                                    ✓
                                  </span>
                                  Approve
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              className="manager-loan-requests__button manager-loan-requests__button--reject"
                              disabled={actionLoading}
                              onClick={() =>
                                handleReject(
                                  request.id
                                )
                              }
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
};

export default LoanRequests;