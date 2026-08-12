import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DonationRequest = () => {
  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    amount: "",
    recipient: "",
    purpose: "",
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
        "You must be logged in to submit a donation request."
      );
      return;
    }

    if (!formData.amount.trim()) {
      setError("Please enter the donation amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Please enter a valid donation amount."
      );
      return;
    }

    if (!formData.recipient.trim()) {
      setError(
        "Please enter the recipient information."
      );
      return;
    }

    if (!formData.purpose.trim()) {
      setError(
        "Please enter the purpose of the donation."
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Actual donation-request creation will be
       * connected to the appropriate Firebase service
       * during the functionality phase.
       *
       * No fake database operation is performed here.
       */

      await Promise.resolve();

      setSuccess(
        "Your donation request form is valid and ready to be submitted."
      );
    } catch (requestError) {
      console.error(
        "Donation request error:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to submit donation request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Donation Request</h1>

        <p>
          Submit a request for a donation through the
          banking system.
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
              Donation Amount
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter donation amount"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="recipient">
              Recipient
            </label>

            <input
              id="recipient"
              name="recipient"
              type="text"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="Enter recipient information"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="purpose">
              Donation Purpose
            </label>

            <input
              id="purpose"
              name="purpose"
              type="text"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter donation purpose"
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
              : "Submit Donation Request"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default DonationRequest;