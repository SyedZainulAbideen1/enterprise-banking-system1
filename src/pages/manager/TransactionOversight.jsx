import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  return (
    <main>
      <section>
        <h1>Transaction Oversight</h1>

        <p>
          Monitor and review customer banking
          transactions.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading transactions...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          transactions.length === 0 && (
            <div>
              <h2>No Transactions</h2>

              <p>
                There are currently no transactions
                available for oversight.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {transaction.customerName}
                      </td>

                      <td>
                        {transaction.type}
                      </td>

                      <td>
                        {transaction.amount}
                      </td>

                      <td>
                        {transaction.description}
                      </td>

                      <td>
                        {transaction.status}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(
                              transaction.id
                            )
                          }
                          disabled={
                            processingId ===
                            transaction.id
                          }
                        >
                          {processingId ===
                          transaction.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReject(
                              transaction.id
                            )
                          }
                          disabled={
                            processingId ===
                            transaction.id
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
};

export default TransactionOversight;