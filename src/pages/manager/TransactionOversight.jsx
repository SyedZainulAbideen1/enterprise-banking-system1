import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./TransactionOversight.css";

const TransactionOversight = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    /*
     * Actual transaction records will be loaded from
     * transactionService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake transaction records are created here.
     */

    setLoading(false);
    setTransactions([]);
  }, []);

  const handleApprove = async (transactionId) => {
    setError("");
    setProcessingId(transactionId);

    try {
      /*
       * Actual transaction approval logic will be
       * connected to transactionService.js during
       * the functionality integration phase.
       */

      await Promise.resolve();

      setTransactions((previous) =>
        previous.map((transaction) =>
          transaction.id === transactionId
            ? {
                ...transaction,
                status: "approved",
              }
            : transaction
        )
      );
    } catch (approveError) {
      console.error(
        "Transaction approval error:",
        approveError
      );

      setError(
        approveError.message ||
          "Unable to approve transaction."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (transactionId) => {
    setError("");
    setProcessingId(transactionId);

    try {
      /*
       * Actual transaction rejection logic will be
       * connected to transactionService.js during
       * the functionality integration phase.
       */

      await Promise.resolve();

      setTransactions((previous) =>
        previous.map((transaction) =>
          transaction.id === transactionId
            ? {
                ...transaction,
                status: "rejected",
              }
            : transaction
        )
      );
    } catch (rejectError) {
      console.error(
        "Transaction rejection error:",
        rejectError
      );

      setError(
        rejectError.message ||
          "Unable to reject transaction."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (normalizedStatus === "approved") {
      return "transaction-oversight-status transaction-oversight-status--approved";
    }

    if (normalizedStatus === "rejected") {
      return "transaction-oversight-status transaction-oversight-status--rejected";
    }

    if (normalizedStatus === "pending") {
      return "transaction-oversight-status transaction-oversight-status--pending";
    }

    return "transaction-oversight-status";
  };

  return (
    <main className="transaction-oversight">
      <section className="transaction-oversight-hero">
        <div className="transaction-oversight-hero-content">
          <div>
            <div className="transaction-oversight-eyebrow">
              Manager Portal
            </div>

            <h1 className="transaction-oversight-title">
              Transaction Oversight
            </h1>

            <p className="transaction-oversight-description">
              Monitor and review customer banking
              transactions from one secure workspace.
            </p>
          </div>

          <Link
            to="/manager"
            className="transaction-oversight-back-link"
          >
            <span aria-hidden="true">←</span>
            Back to Manager Dashboard
          </Link>
        </div>
      </section>

      <section className="transaction-oversight-content">
        <div className="transaction-oversight-section-heading">
          <div>
            <h2>Transaction Activity</h2>

            <p>
              Review available customer transactions
              and take the required action.
            </p>
          </div>

          <div className="transaction-oversight-count">
            <span className="transaction-oversight-count-label">
              Total Records
            </span>

            <strong>
              {transactions.length}
            </strong>
          </div>
        </div>

        {loading && (
          <div
            className="transaction-oversight-state transaction-oversight-state--loading"
            role="status"
          >
            <div className="transaction-oversight-loader">
              <span />
              <span />
              <span />
            </div>

            <h3>Loading Transactions</h3>

            <p>
              Please wait while transaction records are
              being loaded.
            </p>
          </div>
        )}

        {error && (
          <div
            className="transaction-oversight-alert transaction-oversight-alert--error"
            role="alert"
          >
            <div className="transaction-oversight-alert-icon">
              !
            </div>

            <div>
              <strong>
                Transaction Action Failed
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading &&
          !error &&
          transactions.length === 0 && (
            <div className="transaction-oversight-state transaction-oversight-state--empty">
              <div className="transaction-oversight-empty-icon">
                ⇄
              </div>

              <h3>No Transactions</h3>

              <p>
                There are currently no transactions
                available for oversight.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div className="transaction-oversight-table-card">
              <div className="transaction-oversight-table-wrapper">
                <table className="transaction-oversight-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th className="transaction-oversight-actions-heading">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map(
                      (transaction) => {
                        const isProcessing =
                          processingId ===
                          transaction.id;

                        return (
                          <tr
                            key={transaction.id}
                          >
                            <td>
                              <div className="transaction-oversight-customer">
                                <div className="transaction-oversight-avatar">
                                  {String(
                                    transaction.customerName ||
                                      "C"
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span>
                                  {transaction.customerName ||
                                    "Customer"}
                                </span>
                              </div>
                            </td>

                            <td>
                              <span className="transaction-oversight-type">
                                {transaction.type ||
                                  "Not available"}
                              </span>
                            </td>

                            <td>
                              <strong className="transaction-oversight-amount">
                                {transaction.amount ||
                                  "Not available"}
                              </strong>
                            </td>

                            <td>
                              <span className="transaction-oversight-description-cell">
                                {transaction.description ||
                                  "No description"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={getStatusClass(
                                  transaction.status
                                )}
                              >
                                <span className="transaction-oversight-status-dot" />

                                {transaction.status ||
                                  "pending"}
                              </span>
                            </td>

                            <td>
                              <div className="transaction-oversight-actions">
                                <button
                                  type="button"
                                  className="transaction-oversight-button transaction-oversight-button--approve"
                                  onClick={() =>
                                    handleApprove(
                                      transaction.id
                                    )
                                  }
                                  disabled={
                                    isProcessing
                                  }
                                >
                                  {isProcessing
                                    ? "Processing..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  className="transaction-oversight-button transaction-oversight-button--reject"
                                  onClick={() =>
                                    handleReject(
                                      transaction.id
                                    )
                                  }
                                  disabled={
                                    isProcessing
                                  }
                                >
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

export default TransactionOversight;