import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { submitLoanRequest } from "../../features/loans/loanSlice";
import "./RequestLoan.css";

const RequestLoan = () => {
  const dispatch = useDispatch();

  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const { submitLoading, submitError, submitSuccess } =
    useSelector((state) => state.loans);

  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    duration: "",
    notes: "",
  });

  const [error, setError] = useState("");

  const customerName =
    profile?.fullName ||
    profile?.name ||
    user?.email ||
    "Customer";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const amount = Number(formData.amount);
    const duration = Number(formData.duration);

    if (!user?.uid) {
      setError("You must be logged in to request a loan.");
      return;
    }

    if (!formData.amount.trim()) {
      setError("Please enter the loan amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Please enter a valid loan amount.");
      return;
    }

    if (!formData.purpose.trim()) {
      setError("Please enter the loan purpose.");
      return;
    }

    if (!formData.duration.trim()) {
      setError("Please enter the loan duration.");
      return;
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      setError("Please enter a valid duration in months.");
      return;
    }

    const result = await dispatch(
      submitLoanRequest({
        customerId: user.uid,
        customerName,
        amount,
        purpose: formData.purpose,
        duration,
        notes: formData.notes,
      })
    );

    if (submitLoanRequest.fulfilled.match(result)) {
      setFormData({
        amount: "",
        purpose: "",
        duration: "",
        notes: "",
      });
    }
  };

  return (
    <main className="loan-request-page">
      <div className="loan-request-container">

        <div className="loan-request-header">
          <div>
            <span className="loan-request-label">
              LOAN SERVICES
            </span>

            <h1>Request a Loan</h1>

            <p>
              Apply for a loan by providing the required
              information below. Your request will be reviewed
              according to the bank approval workflow.
            </p>
          </div>

          <Link
            to="/customer"
            className="loan-back-link"
          >
            ← Dashboard
          </Link>
        </div>

        <div className="loan-request-layout">

          <aside className="loan-info-card">
            <div className="loan-info-icon">
              ₹
            </div>

            <h2>Loan Application</h2>

            <p>
              Complete the application carefully. Once
              submitted, your request will remain pending
              until it is reviewed.
            </p>

            <div className="loan-info-list">
              <div>
                <span>Applicant</span>
                <strong>{customerName}</strong>
              </div>

              <div>
                <span>Approval</span>
                <strong>Bank Review</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Pending After Submission</strong>
              </div>
            </div>

            <div className="loan-note">
              <strong>Important</strong>
              <p>
                Loan approval depends on the bank's approval
                process and eligibility requirements.
              </p>
            </div>
          </aside>

          <section className="loan-form-card">
            <div className="loan-form-heading">
              <span>APPLICATION DETAILS</span>
              <h2>Loan Information</h2>
              <p>
                Enter the details of the loan you would like
                to request.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="loan-form-grid">

                <div className="loan-field">
                  <label htmlFor="amount">
                    Loan Amount
                  </label>

                  <div className="loan-input-wrapper">
                    <span>PKR</span>

                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter loan amount"
                      disabled={submitLoading}
                    />
                  </div>
                </div>

                <div className="loan-field">
                  <label htmlFor="duration">
                    Duration
                  </label>

                  <div className="loan-input-wrapper">
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="e.g. 24"
                      disabled={submitLoading}
                    />

                    <span>Months</span>
                  </div>
                </div>

              </div>

              <div className="loan-field">
                <label htmlFor="purpose">
                  Loan Purpose
                </label>

                <textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Explain the purpose of the loan"
                  rows="5"
                  disabled={submitLoading}
                />
              </div>

              <div className="loan-field">
                <label htmlFor="notes">
                  Additional Notes
                  <span>Optional</span>
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional information"
                  rows="4"
                  disabled={submitLoading}
                />
              </div>

              {error && (
                <div
                  className="loan-message loan-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {submitError && (
                <div
                  className="loan-message loan-error"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div
                  className="loan-message loan-success"
                  role="status"
                >
                  Loan request submitted successfully.
                  Your request is now pending approval.
                </div>
              )}

              <div className="loan-form-footer">
                <Link
                  to="/customer"
                  className="loan-cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="loan-submit-button"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? "Submitting..."
                    : "Submit Loan Request"}
                </button>
              </div>

            </form>
          </section>

        </div>
      </div>
    </main>
  );
};

export default RequestLoan;