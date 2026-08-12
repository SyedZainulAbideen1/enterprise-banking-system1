import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LoanDetails = () => {
  const { user } = useSelector(
    (state) => state.auth
  );

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    /*
     * Actual loan information will be loaded from
     * loanService.js and Firestore later.
     *
     * We do not create fake loan information here.
     */
    if (!user?.uid) {
      setLoan(null);
      return;
    }

    setLoading(false);
  }, [user?.uid]);

  return (
    <main>
      <section>
        <h1>Loan Details</h1>

        <p>
          View your loan information and current loan
          status.
        </p>

        <Link to="/customer">
          Back to Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading loan information...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          !loan && (
            <div>
              <h2>No Loan Information</h2>

              <p>
                You currently do not have an active loan
                record.
              </p>

              <Link to="/customer/loan/request">
                Request a Loan
              </Link>
            </div>
          )}

        {!loading &&
          !error &&
          loan && (
            <div>
              <h2>Loan Information</h2>

              <p>
                <strong>Loan ID:</strong>{" "}
                {loan.id}
              </p>

              <p>
                <strong>Amount:</strong>{" "}
                {loan.amount}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {loan.status}
              </p>

              <p>
                <strong>Requested Date:</strong>{" "}
                {loan.requestedDate}
              </p>

              {loan.approvedDate && (
                <p>
                  <strong>Approved Date:</strong>{" "}
                  {loan.approvedDate}
                </p>
              )}
            </div>
          )}
      </section>
    </main>
  );
};

export default LoanDetails;