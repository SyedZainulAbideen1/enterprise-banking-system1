import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

import {
  fetchPendingLoanRequests,
  approveLoan,
  rejectLoan,
  clearLoanError,
} from "../../features/loans/loanSlice";

const LoanRequests = () => {
  const dispatch = useDispatch();

  const {
    requests,
    loading,
    actionLoading,
    error,
    actionError,
    successMessage,
  } = useSelector(
    (state) => state.loans
  );

  useEffect(() => {
    dispatch(
      fetchPendingLoanRequests()
    );

    return () => {
      dispatch(clearLoanError());
    };
  }, [dispatch]);


  const handleApprove = async (
    loanId
  ) => {
    const auth = getAuth();

    const employeeId =
      auth.currentUser?.uid;

    if (!employeeId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to approve this loan?"
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      approveLoan({
        loanId,
        employeeId,
      })
    );
  };


  const handleReject = async (
    loanId
  ) => {
    const auth = getAuth();

    const employeeId =
      auth.currentUser?.uid;

    if (!employeeId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to reject this loan?"
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      rejectLoan({
        loanId,
        employeeId,
      })
    );
  };


  return (
    <main>
      <section>
        <h1>
          Loan Requests
        </h1>

        <p>
          Review and process pending
          customer loan requests.
        </p>

        <Link to="/employee">
          Back to Employee Dashboard
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
                No Loan Requests
              </h2>

              <p>
                There are currently no
                loan requests available
                for review.
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
                    <th>
                      Customer
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Purpose
                    </th>

                    <th>
                      Duration
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map(
                    (loanRequest) => (
                      <tr
                        key={
                          loanRequest.id
                        }
                      >
                        <td>
                          {loanRequest.customerName ||
                            "Customer"}
                        </td>

                        <td>
                          PKR{" "}
                          {Number(
                            loanRequest.amount ||
                              0
                          ).toLocaleString(
                            "en-PK"
                          )}
                        </td>

                        <td>
                          {loanRequest.purpose ||
                            "Not provided"}
                        </td>

                        <td>
                          {loanRequest.duration ||
                            0}{" "}
                          months
                        </td>

                        <td>
                          {loanRequest.status}
                        </td>

                        <td>
                          <button
                            type="button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              handleApprove(
                                loanRequest.id
                              )
                            }
                          >
                            {actionLoading
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              actionLoading
                            }
                            onClick={() =>
                              handleReject(
                                loanRequest.id
                              )
                            }
                          >
                            Reject
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