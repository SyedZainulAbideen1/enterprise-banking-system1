import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TransactionRequests = () => {
  const [transactionRequests, setTransactionRequests] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual transaction requests will be loaded from
     * transactionService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake transaction requests are created here.
     */

    setLoading(false);
    setTransactionRequests([]);
  }, []);

  return (
    <main>
      <section>
        <h1>Transaction Requests</h1>

        <p>
          Review deposit, withdrawal, and other
          transaction requests submitted by customers.
        </p>

        <Link to="/employee">
          Back to Employee Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading transaction requests...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          transactionRequests.length === 0 && (
            <div>
              <h2>No Transaction Requests</h2>

              <p>
                There are currently no transaction
                requests available for review.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          transactionRequests.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {transactionRequests.map(
                    (transactionRequest) => (
                      <tr
                        key={transactionRequest.id}
                      >
                        <td>
                          {
                            transactionRequest.customerName
                          }
                        </td>

                        <td>
                          {transactionRequest.type}
                        </td>

                        <td>
                          {transactionRequest.amount}
                        </td>

                        <td>
                          {
                            transactionRequest.description
                          }
                        </td>

                        <td>
                          {transactionRequest.status}
                        </td>

                        <td>
                          <button
                            type="button"
                            disabled
                          >
                            Review
                          </button>
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

export default TransactionRequests;