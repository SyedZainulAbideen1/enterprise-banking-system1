import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const WithdrawRequest = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    description: "",
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
        "You must be logged in to submit a withdrawal request."
      );
      return;
    }

    if (!formData.amount.trim()) {
      setError("Please enter the withdrawal amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Please enter a valid withdrawal amount."
      );
      return;
    }

    if (!formData.reason.trim()) {
      setError(
        "Please enter the reason for withdrawal."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Actual Firestore withdrawal-request creation
       * will be connected through transactionService.js
       * during the functionality phase.
       *
       * No fake database operation is performed here.
       */

      await Promise.resolve();

      setSuccess(
        "Your withdrawal request form is valid and ready to be submitted."
      );
    } catch (requestError) {
      console.error(
        "Withdrawal request error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to submit withdrawal request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Withdraw Request</h1>

        <p>
          Submit a request to withdraw funds from your
          banking account.
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
              Withdrawal Amount
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter withdrawal amount"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="reason">
              Withdrawal Reason
            </label>

            <input
              id="reason"
              name="reason"
              type="text"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter reason for withdrawal"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional information"
              rows="4"
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
              : "Submit Withdrawal Request"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default WithdrawRequest;