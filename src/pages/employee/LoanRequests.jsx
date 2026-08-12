import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual loan requests will be loaded from
     * loanService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake loan requests are created here.
     */

    setLoading(false);
    setLoanRequests([]);
  }, []);

  return (
    <main>
      <section>
        <h1>Loan Requests</h1>

        <p>
          Review loan requests submitted by customers.
        </p>

        <Link to="/employee">
          Back to Employee Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading loan requests...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          loanRequests.length === 0 && (
            <div>
              <h2>No Loan Requests</h2>

              <p>
                There are currently no loan requests
                available for review.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          loanRequests.length > 0 && (
            <div>
              <table>
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
                  {loanRequests.map(
                    (loanRequest) => (
                      <tr key={loanRequest.id}>
                        <td>
                          {loanRequest.customerName}
                        </td>

                        <td>
                          {loanRequest.amount}
                        </td>

                        <td>
                          {loanRequest.purpose}
                        </td>

                        <td>
                          {loanRequest.duration} months
                        </td>

                        <td>
                          {loanRequest.status}
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

export default LoanRequests;