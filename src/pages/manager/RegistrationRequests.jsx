import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RegistrationRequests = () => {
  const [registrationRequests, setRegistrationRequests] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    /*
     * Actual registration requests will be loaded from
     * registrationService.js and Firestore during the
     * functionality integration phase.
     *
     * No fake registration requests are created here.
     */

    setLoading(false);
    setRegistrationRequests([]);
  }, []);

  const handleApprove = async (requestId) => {
    setError("");
    setProcessingId(requestId);

    try {
      /*
       * Actual approval logic will be connected to
       * registrationService.js during the functionality
       * integration phase.
       */

      await Promise.resolve();

      setRegistrationRequests((previous) =>
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
        "Registration approval error:",
        approveError
      );

      setError(
        approveError.message ||
          "Unable to approve registration request."
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
       * registrationService.js during the functionality
       * integration phase.
       */

      await Promise.resolve();

      setRegistrationRequests((previous) =>
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
        "Registration rejection error:",
        rejectError
      );

      setError(
        rejectError.message ||
          "Unable to reject registration request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main>
      <section>
        <h1>Registration Requests</h1>

        <p>
          Review new customer registration requests and
          approve or reject them.
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
          registrationRequests.length === 0 && (
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
          registrationRequests.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {registrationRequests.map(
                    (request) => (
                      <tr key={request.id}>
                        <td>
                          {request.name}
                        </td>

                        <td>
                          {request.email}
                        </td>

                        <td>
                          {request.status}
                        </td>

                        <td>
                          {request.createdAt ||
                            "Not available"}
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

export default RegistrationRequests;