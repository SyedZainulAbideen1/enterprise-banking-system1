import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  approveDeposit,
  approveWithdrawal,
  clearTransactionError,
  fetchPendingTransactionRequests,
  rejectTransaction,
} from "../../features/transactions/transactionSlice";

import "./TransactionRequests.css";

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "Not available";
  }

  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString();
  }

  return "Not available";
};

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "PKR 0.00";
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

const TransactionRequests = () => {
  const dispatch = useDispatch();

  const {
    user,
    profile,
  } = useSelector(
    (state) => state.auth
  );

  const {
    requests,
    requestLoading,
    processingId,
    requestError,
  } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(
      fetchPendingTransactionRequests()
    );

    return () => {
      dispatch(clearTransactionError());
    };
  }, [dispatch]);

  const handleApprove = async (request) => {
    if (!user?.uid) {
      return;
    }

    if (request.type === "deposit") {
      await dispatch(
        approveDeposit({
          requestId: request.id,
          employeeId: user.uid,
        })
      );

      return;
    }

    if (request.type === "withdrawal") {
      await dispatch(
        approveWithdrawal({
          requestId: request.id,
          employeeId: user.uid,
        })
      );

      return;
    }
  };

  const handleReject = async (request) => {
    if (!user?.uid) {
      return;
    }

    await dispatch(
      rejectTransaction({
        requestId: request.id,
        employeeId: user.uid,
      })
    );
  };

  const employeeName =
    profile?.fullName ||
    profile?.name ||
    user?.email ||
    "Employee";

  return (
    <main className="transaction-requests">
      <section className="transaction-requests__header">
        <div className="transaction-requests__header-main">
          <div className="transaction-requests__eyebrow">
            <span className="transaction-requests__eyebrow-dot" />
            Transaction Management
          </div>

          <h1 className="transaction-requests__title">
            Transaction Requests
          </h1>

          <p className="transaction-requests__description">
            Review deposit, withdrawal, and other
            transaction requests submitted by
            customers.
          </p>
        </div>

        <Link
          to="/employee"
          className="transaction-requests__back-link"
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

      <section className="transaction-requests__content">
        <div className="transaction-requests__overview">
          <div className="transaction-requests__employee">
            <div className="transaction-requests__employee-avatar">
              {employeeName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <span className="transaction-requests__overview-label">
                Signed-in Employee
              </span>

              <strong>
                {employeeName}
              </strong>
            </div>
          </div>

          <div className="transaction-requests__queue">
            <div className="transaction-requests__queue-icon">
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
                  d="M8 8h8M8 12h8M8 16h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <span className="transaction-requests__overview-label">
                Current Queue
              </span>

              <strong>
                {requestLoading
                  ? "..."
                  : requests.length}
              </strong>

              <span>
                Pending request
                {requests.length === 1
                  ? ""
                  : "s"}
              </span>
            </div>
          </div>
        </div>

        {requestLoading && (
          <div className="transaction-requests__state-card">
            <div className="transaction-requests__loader">
              <span />
            </div>

            <div>
              <h2>
                Loading Transaction Requests
              </h2>

              <p>
                Please wait while the latest
                transaction requests are being
                retrieved.
              </p>
            </div>
          </div>
        )}

        {requestError && (
          <div
            className="transaction-requests__message transaction-requests__message--error"
            role="alert"
          >
            <div className="transaction-requests__message-icon">
              !
            </div>

            <div>
              <strong>
                Unable to Load Requests
              </strong>

              <p>
                {requestError}
              </p>
            </div>
          </div>
        )}

        {!requestLoading &&
          !requestError &&
          requests.length === 0 && (
            <div className="transaction-requests__empty">
              <div className="transaction-requests__empty-icon">
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
                No Transaction Requests
              </h2>

              <p>
                There are currently no pending
                transaction requests.
              </p>
            </div>
          )}

        {!requestLoading &&
          !requestError &&
          requests.length > 0 && (
            <div className="transaction-requests__table-card">
              <div className="transaction-requests__table-header">
                <div>
                  <span className="transaction-requests__table-label">
                    Request Queue
                  </span>

                  <h2>
                    Pending Transactions
                  </h2>
                </div>

                <span className="transaction-requests__count">
                  {requests.length} request
                  {requests.length === 1
                    ? ""
                    : "s"}
                </span>
              </div>

              <div className="transaction-requests__table-wrapper">
                <table className="transaction-requests__table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Source / Reason</th>
                      <th>Description</th>
                      <th>Requested At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map(
                      (request) => {
                        const isProcessing =
                          processingId ===
                          request.id;

                        const requestType =
                          request.type ||
                          "transaction";

                        const normalizedType =
                          String(
                            requestType
                          ).toLowerCase();

                        const isDeposit =
                          normalizedType ===
                          "deposit";

                        const isWithdrawal =
                          normalizedType ===
                          "withdrawal";

                        return (
                          <tr
                            key={request.id}
                          >
                            <td>
                              <div className="transaction-requests__customer">
                                <div className="transaction-requests__customer-avatar">
                                  {(
                                    request.customerName ||
                                    "C"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <strong>
                                    {request.customerName ||
                                      "Customer"}
                                  </strong>

                                  <span>
                                    Transaction
                                    request
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span
                                className={`transaction-requests__type ${
                                  isDeposit
                                    ? "transaction-requests__type--deposit"
                                    : isWithdrawal
                                      ? "transaction-requests__type--withdrawal"
                                      : "transaction-requests__type--default"
                                }`}
                              >
                                <span className="transaction-requests__type-dot" />

                                {requestType}
                              </span>
                            </td>

                            <td>
                              <strong className="transaction-requests__amount">
                                {formatAmount(
                                  request.amount
                                )}
                              </strong>
                            </td>

                            <td>
                              <span className="transaction-requests__source">
                                {request.source ||
                                  request.reason ||
                                  "Not provided"}
                              </span>
                            </td>

                            <td>
                              <span className="transaction-requests__description">
                                {request.description ||
                                  "No description"}
                              </span>
                            </td>

                            <td>
                              <span className="transaction-requests__date">
                                {formatDate(
                                  request.createdAt
                                )}
                              </span>
                            </td>

                            <td>
                              <span className="transaction-requests__status">
                                <span className="transaction-requests__status-dot" />

                                {request.status ||
                                  "Pending"}
                              </span>
                            </td>

                            <td>
                              <div className="transaction-requests__actions">
                                <button
                                  type="button"
                                  className="transaction-requests__action transaction-requests__action--approve"
                                  onClick={() =>
                                    handleApprove(
                                      request
                                    )
                                  }
                                  disabled={
                                    isProcessing
                                  }
                                >
                                  {isProcessing ? (
                                    <>
                                      <span className="transaction-requests__button-spinner" />

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
                                  className="transaction-requests__action transaction-requests__action--reject"
                                  onClick={() =>
                                    handleReject(
                                      request
                                    )
                                  }
                                  disabled={
                                    isProcessing
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
                        );
                      }
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

export default TransactionRequests;