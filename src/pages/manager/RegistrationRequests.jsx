import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  approveRegistration,
  clearRegistrationError,
  fetchPendingRegistrationRequests,
  rejectRegistration,
} from "../../features/registrationRequests/registrationSlice";

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

const RegistrationRequests = () => {
  const dispatch = useDispatch();

  const {
    requests,
    loading,
    processingId,
    error,
  } = useSelector(
    (state) => state.registrationRequests
  );

  useEffect(() => {
    dispatch(fetchPendingRegistrationRequests());

    return () => {
      dispatch(clearRegistrationError());
    };
  }, [dispatch]);

  const handleApprove = async (request) => {
    if (!request?.id || !request?.uid) {
      return;
    }

    await dispatch(
      approveRegistration({
        requestId: request.id,
        uid: request.uid,
      })
    );
  };

  const handleReject = async (request) => {
    if (!request?.id || !request?.uid) {
      return;
    }

    await dispatch(
      rejectRegistration({
        requestId: request.id,
        uid: request.uid,
      })
    );
  };

  return (
    <main>
      <section>
        <h1>Registration Requests</h1>

        <p>
          Review new customer registration requests
          and approve or reject them.
        </p>

        <Link to="/manager">
          Back to Manager Dashboard
        </Link>
      </section>

      <section>
        {loading && (
          <p>Loading registration requests...</p>
        )}

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div>
              <h2>No Registration Requests</h2>

              <p>
                There are currently no registration
                requests waiting for approval.
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
                    <th>Name</th>
                    <th>Email</th>
                    <th>Requested Role</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    const isProcessing =
                      processingId === request.id;

                    return (
                      <tr key={request.id}>
                        <td>
                          {request.fullName ||
                            request.name ||
                            "Not available"}
                        </td>

                        <td>
                          {request.email ||
                            "Not available"}
                        </td>

                        <td>
                          {request.requestedRole ||
                            "customer"}
                        </td>

                        <td>
                          {request.status}
                        </td>

                        <td>
                          {formatDate(
                            request.createdAt
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              handleApprove(request)
                            }
                            disabled={isProcessing}
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleReject(request)
                            }
                            disabled={isProcessing}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
};

export default RegistrationRequests;