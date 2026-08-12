import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

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

  const handleApprove = async (requestId) => {
    setError("");
    setProcessingId(requestId);

    try {
      /*
       * Actual approval logic will be connected to
       * loanService.js during the functionality phase.
       */

      await Promise.resolve();

      setLoanRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "approved",
              }
            : request
        )
      );
    } catch (approveError) {
      console.error(
        "Loan approval error:",
        approveError
      );

      setError(
        approveError.message ||
          "Unable to approve loan request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setError("");
    setProcessingId(requestId);

    try {
      /*
       * Actual rejection logic will be connected to
       * loanService.js during the functionality phase.
       */

      await Promise.resolve();

      setLoanRequests((previous) =>
        previous.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: "rejected",
              }
            : request
        )
      );
    } catch (rejectError) {
      console.error(
        "Loan rejection error:",
        rejectError
      );

      setError(
        rejectError.message ||
          "Unable to reject loan request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main>
      <section>
        <h1>Loan Requests</h1>

        <p>
          Review and manage customer loan requests.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
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
                available for management.
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
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loanRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        {request.customerName}
                      </td>

                      <td>
                        {request.amount}
                      </td>

                      <td>
                        {request.purpose}
                      </td>

                      <td>
                        {request.duration} months
                      </td>

                      <td>
                        {request.status}
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(request.id)
                          }
                          disabled={
                            processingId === request.id
                          }
                        >
                          {processingId === request.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReject(request.id)
                          }
                          disabled={
                            processingId === request.id
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

export default LoanRequests;