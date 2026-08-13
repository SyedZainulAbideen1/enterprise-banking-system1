import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  clearTransactionError,
  fetchCustomerTransactions,
} from "../../features/transactions/transactionSlice";

import "./TransactionHistory.css";

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "Not available";
  }

  if (typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleString();
  }

  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }

  return "Not available";
};

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return "PKR 0.00";
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

const getStatusClass = (status) => {
  const normalizedStatus = String(
    status || "unknown"
  ).toLowerCase();

  if (
    normalizedStatus === "approved" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "success" ||
    normalizedStatus === "active"
  ) {
    return "status-success";
  }

  if (normalizedStatus === "pending") {
    return "status-pending";
  }

  if (
    normalizedStatus === "rejected" ||
    normalizedStatus === "failed" ||
    normalizedStatus === "cancelled"
  ) {
    return "status-danger";
  }

  return "status-neutral";
};

const TransactionHistory = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    items: transactions = [],
    loading,
    error,
  } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    dispatch(
      fetchCustomerTransactions(user.uid)
    );

    return () => {
      dispatch(clearTransactionError());
    };
  }, [dispatch, user?.uid]);

  return (
    <main className="transaction-page">
      <section className="transaction-hero">
        <div>
          <span className="transaction-label">
            CUSTOMER BANKING
          </span>

          <h1>Transaction History</h1>

          <p>
            Keep track of your deposits, withdrawals,
            transfers, and other banking activities.
          </p>
        </div>

        <Link
          to="/customer"
          className="transaction-back-button"
        >
          <span>←</span>
          Back to Dashboard
        </Link>
      </section>

      <section className="transaction-panel">
        <div className="transaction-panel-header">
          <div>
            <h2>All Transactions</h2>

            <p>
              {transactions.length} transaction
              {transactions.length === 1 ? "" : "s"} available
            </p>
          </div>

          <div className="transaction-count">
            {transactions.length}
          </div>
        </div>

        {loading && (
          <div className="transaction-state">
            <div className="transaction-spinner" />

            <h3>Loading transactions</h3>

            <p>
              Please wait while we retrieve your
              transaction history.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="transaction-state">
            <div className="transaction-state-icon error-icon">
              !
            </div>

            <h3>Unable to load transactions</h3>

            <p>{error}</p>

            <button
              type="button"
              className="transaction-retry-button"
              onClick={() => {
                if (user?.uid) {
                  dispatch(
                    fetchCustomerTransactions(
                      user.uid
                    )
                  );
                }
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          transactions.length === 0 && (
            <div className="transaction-state">
              <div className="transaction-state-icon">
                $
              </div>

              <h3>No transactions yet</h3>

              <p>
                Your transaction history will appear
                here once you complete a banking
                transaction.
              </p>

              <Link
                to="/customer"
                className="transaction-primary-button"
              >
                Return to Dashboard
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div className="transaction-table-container">
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Transaction Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={transaction.id}
                      >
                        <td>
                          <div className="transaction-date">
                            {formatDate(
                              transaction.createdAt
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="transaction-type">
                            {transaction.type ||
                              "Not available"}
                          </span>
                        </td>

                        <td>
                          <strong className="transaction-amount">
                            {formatAmount(
                              transaction.amount
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`transaction-status ${getStatusClass(
                              transaction.status
                            )}`}
                          >
                            {transaction.status ||
                              "Not available"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
};

export default TransactionHistory;