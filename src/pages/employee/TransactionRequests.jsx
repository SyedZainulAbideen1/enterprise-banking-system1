import { useEffect } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  approveDeposit,
  clearTransactionError,
  fetchPendingTransactionRequests,
  rejectTransaction,
} from "../../features/transactions/transactionSlice";

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "Not available";
  }

  if (typeof timestamp.toDate === "function") {
    return timestamp
      .toDate()
      .toLocaleString();
  }

  return "Not available";
};

const formatAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "PKR 0.00";
  }

  return new Intl.NumberFormat(
    "en-PK",
    {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }
  ).format(numericAmount);
};

const TransactionRequests = () => {
  const dispatch = useDispatch();

  const {
    user,
    profile,
  } = useSelector(
    (state) => state.auth
  );

  const {
    requests,
    requestLoading,
    processingId,
    requestError,
  } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    dispatch(
      fetchPendingTransactionRequests()
    );

    return () => {
      dispatch(clearTransactionError());
    };
  }, [dispatch]);

  const handleApprove = async (request) => {
    if (!user?.uid) {
      return;
    }

    await dispatch(
      approveDeposit({
        requestId: request.id,
        employeeId: user.uid,
      })
    );
  };

  const handleReject = async (request) => {
    if (!user?.uid) {
      return;
    }

    await dispatch(
      rejectTransaction({
        requestId: request.id,
        employeeId: user.uid,
      })
    );
  };

  return (
    <main>
      <section>
        <h1>
          Transaction Requests
        </h1>

        <p>
          Review deposit, withdrawal, and other
          transaction requests submitted by
          customers.
        </p>

        <p>
          <strong>Employee:</strong>{" "}
          {profile?.fullName ||
            profile?.name ||
            user?.email ||
            "Employee"}
        </p>

        <Link to="/employee">
          Back to Employee Dashboard
        </Link>
      </section>

      <section>
        {requestLoading && (
          <p>
            Loading transaction requests...
          </p>
        )}

        {requestError && (
          <p role="alert">
            {requestError}
          </p>
        )}

        {!requestLoading &&
          !requestError &&
          requests.length === 0 && (
            <div>
              <h2>
                No Transaction Requests
              </h2>

              <p>
                There are currently no pending
                transaction requests.
              </p>
            </div>
          )}

        {!requestLoading &&
          !requestError &&
          requests.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>
                      Customer
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Source
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Requested At
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map(
                    (request) => {
                      const isProcessing =
                        processingId ===
                        request.id;

                      return (
                        <tr
                          key={request.id}
                        >
                          <td>
                            {request.customerName ||
                              "Customer"}
                          </td>

                          <td>
                            {request.type}
                          </td>

                          <td>
                            {formatAmount(
                              request.amount
                            )}
                          </td>

                          <td>
                            {request.source ||
                              "Not provided"}
                          </td>

                          <td>
                            {request.description ||
                              "No description"}
                          </td>

                          <td>
                            {formatDate(
                              request.createdAt
                            )}
                          </td>

                          <td>
                            {request.status}
                          </td>

                          <td>
                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(
                                  request
                                )
                              }
                              disabled={
                                isProcessing ||
                                request.type !==
                                  "deposit"
                              }
                            >
                              {isProcessing
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReject(
                                  request
                                )
                              }
                              disabled={
                                isProcessing
                              }
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    }
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