import { useEffect } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  clearTransactionError,
  fetchCustomerTransactions,
} from "../../features/transactions/transactionSlice";

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

const TransactionHistory = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    items: transactions,
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
    <main>
      <section>
        <h1>Transaction History</h1>

        <p>
          View your banking transaction history
          here.
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
                You do not have any transactions
                yet.
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
                      <tr
                        key={transaction.id}
                      >
                        <td>
                          {formatDate(
                            transaction.createdAt
                          )}
                        </td>

                        <td>
                          {transaction.type ||
                            "Not available"}
                        </td>

                        <td>
                          {formatAmount(
                            transaction.amount
                          )}
                        </td>

                        <td>
                          {transaction.status ||
                            "Not available"}
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