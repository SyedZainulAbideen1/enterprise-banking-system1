import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const TransactionHistory = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Transaction data will be connected to Firebase
     * through transactionService.js.
     *
     * For now, this page provides the complete UI/state
     * foundation without inventing transaction records.
     */
    if (!user?.uid) {
      setTransactions([]);
      return;
    }

    setLoading(false);
  }, [user?.uid]);

  return (
    <main>
      <section>
        <h1>Transaction History</h1>

        <p>
          View your banking transaction history here.
        </p>

        <Link to="/customer">
          Back to Dashboard
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
                You do not have any transactions yet.
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
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          {transaction.date}
                        </td>

                        <td>
                          {transaction.type}
                        </td>

                        <td>
                          {transaction.amount}
                        </td>

                        <td>
                          {transaction.status}
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