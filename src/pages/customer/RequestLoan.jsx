import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const RequestLoan = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    amount: "",
    purpose: "",
    duration: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const amount = Number(formData.amount);

    if (!user?.uid) {
      setError(
        "You must be logged in to request a loan."
      );
      return;
    }

    if (!formData.amount.trim()) {
      setError("Please enter the loan amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Please enter a valid loan amount."
      );
      return;
    }

    if (!formData.purpose.trim()) {
      setError("Please enter the loan purpose.");
      return;
    }

    if (!formData.duration.trim()) {
      setError(
        "Please enter the loan duration."
      );
      return;
    }

    const duration = Number(formData.duration);

    if (!Number.isInteger(duration) || duration <= 0) {
      setError(
        "Please enter a valid duration in months."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Firestore loan-request submission will be
       * connected through loanService.js in the
       * functionality phase.
       *
       * No fake database operation is performed here.
       */

      await Promise.resolve();

      setSuccess(
        "Your loan request form is valid and ready to be submitted."
      );
    } catch (requestError) {
      console.error(
        "Loan request error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to submit loan request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Request a Loan</h1>

        <p>
          Submit a request for a new loan.
          Your request will be reviewed according
          to the banking system workflow.
        </p>

        <p>
          <strong>Customer:</strong>{" "}
          {profile?.fullName ||
            profile?.name ||
            user?.email ||
            "Customer"}
        </p>

        <Link to="/customer">
          Back to Dashboard
        </Link>
      </section>

      <section>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="amount">
              Loan Amount
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter loan amount"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="purpose">
              Loan Purpose
            </label>

            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Explain the purpose of the loan"
              rows="4"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="duration">
              Duration (Months)
            </label>

            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              step="1"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter duration in months"
              disabled={loading}
            />
          </div>

          {error && (
            <p role="alert">
              {error}
            </p>
          )}

          {success && (
            <p role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Submit Loan Request"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default RequestLoan;