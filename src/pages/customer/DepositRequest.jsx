import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DepositRequest = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
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
        "You must be logged in to submit a deposit request."
      );
      return;
    }

    if (!formData.amount.trim()) {
      setError("Please enter the deposit amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Please enter a valid deposit amount."
      );
      return;
    }

    if (!formData.source.trim()) {
      setError(
        "Please enter the source of the deposit."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Actual Firestore deposit-request creation
       * will be connected through transactionService.js
       * during the functionality phase.
       *
       * No fake database operation is performed here.
       */

      await Promise.resolve();

      setSuccess(
        "Your deposit request form is valid and ready to be submitted."
      );
    } catch (requestError) {
      console.error(
        "Deposit request error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to submit deposit request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Deposit Request</h1>

        <p>
          Submit a request to deposit funds into your
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
              Deposit Amount
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter deposit amount"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="source">
              Deposit Source
            </label>

            <input
              id="source"
              name="source"
              type="text"
              value={formData.source}
              onChange={handleChange}
              placeholder="e.g. Salary, Cash, Transfer"
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
              : "Submit Deposit Request"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default DepositRequest;