import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

import {
  fetchPendingManagerLoanRequests,
  approveManagerLoan,
  rejectManagerLoan,
  clearLoanError,
} from "../../features/loans/loanSlice";

const LoanRequests = () => {
  const dispatch = useDispatch();

  const {
    requests = [],
    loading = false,
    actionLoading = false,
    error = null,
    actionError = null,
    successMessage = "",
  } = useSelector(
    (state) => state.loans || {}
  );

  useEffect(() => {
    dispatch(fetchPendingManagerLoanRequests());

    return () => {
      dispatch(clearLoanError());
    };
  }, [dispatch]);

  const getManagerId = () => {
    const auth = getAuth();

    return auth.currentUser?.uid || "";
  };

  const handleApprove = async (loanId) => {
    const managerId = getManagerId();

    if (!managerId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to approve this high-value loan?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      approveManagerLoan({
        loanId,
        managerId,
      })
    );
  };

  const handleReject = async (loanId) => {
    const managerId = getManagerId();

    if (!managerId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this high-value loan?"
    );

    if (!confirmed) {
      return;
    }

    await dispatch(
      rejectManagerLoan({
        loanId,
        managerId,
      })
    );
  };

  return (
    <main>
      <section>
        <h1>High-Value Loan Requests</h1>

        <p>
          Review and manage loan requests
          requiring Manager approval.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>
            Loading loan requests...
          </p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {actionError && (
          <p role="alert">
            {actionError}
          </p>
        )}

        {successMessage && (
          <p role="status">
            {successMessage}
          </p>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div>
              <h2>
                No High-Value Loan Requests
              </h2>

              <p>
                There are currently no high-value
                loan requests available for
                Manager approval.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          requests.length > 0 && (
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
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        {request.customerName ||
                          "Customer"}
                      </td>

                      <td>
                        PKR{" "}
                        {Number(
                          request.amount || 0
                        ).toLocaleString("en-PK")}
                      </td>

                      <td>
                        {request.purpose ||
                          "Not provided"}
                      </td>

                      <td>
                        {request.duration || 0}{" "}
                        months
                      </td>

                      <td>
                        {request.status ||
                          "pending"}
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() =>
                            handleApprove(
                              request.id
                            )
                          }
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() =>
                            handleReject(
                              request.id
                            )
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