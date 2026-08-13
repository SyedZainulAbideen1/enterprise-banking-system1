import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  approveRegistration,
  clearRegistrationError,
  fetchPendingRegistrationRequests,
  rejectRegistration,
} from "../../features/registrationRequests/registrationSlice";

import "./RegistrationRequests.css";

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
    <main className="registration-requests">
      <section className="registration-requests__header">
        <div className="registration-requests__header-content">
          <div>
            <span className="registration-requests__eyebrow">
              Manager Portal
            </span>

            <h1 className="registration-requests__title">
              Registration Requests
            </h1>

            <p className="registration-requests__description">
              Review new customer registration requests
              and approve or reject them.
            </p>
          </div>

          <Link
            to="/manager"
            className="registration-requests__back-link"
          >
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="registration-requests__summary">
        <div className="registration-requests__summary-card">
          <div className="registration-requests__summary-icon">
            ✓
          </div>

          <div>
            <span className="registration-requests__summary-label">
              Pending Requests
            </span>

            <strong className="registration-requests__summary-value">
              {requests.length}
            </strong>
          </div>
        </div>

        <div className="registration-requests__summary-info">
          <span className="registration-requests__summary-dot" />
          Awaiting manager review
        </div>
      </section>

      <section className="registration-requests__content">
        <div className="registration-requests__content-header">
          <div>
            <h2 className="registration-requests__section-title">
              Pending Applications
            </h2>

            <p className="registration-requests__section-description">
              Review applicant information before making
              an approval decision.
            </p>
          </div>
        </div>

        {loading && (
          <div
            className="registration-requests__state registration-requests__state--loading"
            role="status"
            aria-live="polite"
          >
            <div className="registration-requests__loader" />

            <h3>Loading registration requests</h3>

            <p>
              Please wait while we retrieve the latest
              requests.
            </p>
          </div>
        )}

        {error && (
          <div
            className="registration-requests__state registration-requests__state--error"
            role="alert"
          >
            <div className="registration-requests__state-icon">
              !
            </div>

            <h3>Unable to load requests</h3>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          requests.length === 0 && (
            <div className="registration-requests__state registration-requests__state--empty">
              <div className="registration-requests__empty-icon">
                ✓
              </div>

              <h3>No Registration Requests</h3>

              <p>
                There are currently no registration
                requests waiting for approval.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          requests.length > 0 && (
            <div className="registration-requests__table-wrapper">
              <table className="registration-requests__table">
                <thead>
                  <tr>
                    <th scope="col">Applicant</th>
                    <th scope="col">Email</th>
                    <th scope="col">Requested Role</th>
                    <th scope="col">Status</th>
                    <th scope="col">Requested At</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    const isProcessing =
                      processingId === request.id;

                    const applicantName =
                      request.fullName ||
                      request.name ||
                      "Not available";

                    const requestedRole =
                      request.requestedRole ||
                      "customer";

                    const status =
                      request.status ||
                      "pending";

                    return (
                      <tr key={request.id}>
                        <td data-label="Applicant">
                          <div className="registration-requests__applicant">
                            <div className="registration-requests__avatar">
                              {applicantName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {applicantName}
                              </strong>

                              <span>
                                Registration applicant
                              </span>
                            </div>
                          </div>
                        </td>

                        <td data-label="Email">
                          <span className="registration-requests__email">
                            {request.email ||
                              "Not available"}
                          </span>
                        </td>

                        <td data-label="Requested Role">
                          <span className="registration-requests__role">
                            {requestedRole}
                          </span>
                        </td>

                        <td data-label="Status">
                          <span
                            className={`registration-requests__status registration-requests__status--${String(
                              status
                            ).toLowerCase()}`}
                          >
                            <span className="registration-requests__status-dot" />
                            {status}
                          </span>
                        </td>

                        <td data-label="Requested At">
                          <span className="registration-requests__date">
                            {formatDate(
                              request.createdAt
                            )}
                          </span>
                        </td>

                        <td data-label="Actions">
                          <div className="registration-requests__actions">
                            <button
                              type="button"
                              className="registration-requests__button registration-requests__button--approve"
                              onClick={() =>
                                handleApprove(request)
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <span className="registration-requests__button-spinner" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <span aria-hidden="true">
                                    ✓
                                  </span>
                                  Approve
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              className="registration-requests__button registration-requests__button--reject"
                              onClick={() =>
                                handleReject(request)
                              }
                              disabled={isProcessing}
                            >
                              {isProcessing
                                ? "Please wait..."
                                : "Reject"}
                            </button>
                          </div>
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