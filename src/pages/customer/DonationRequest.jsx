import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./DonationRequest.css";

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
      setError("Please enter a valid donation amount.");
      return;
    }

    if (!formData.recipient.trim()) {
      setError("Please enter the recipient information.");
      return;
    }

    if (!formData.purpose.trim()) {
      setError("Please enter the purpose of the donation.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Donation service will be connected
       * during the functionality phase.
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
    <main className="donation-page">
      <section className="donation-header">
        <div>
          <span className="donation-eyebrow">
            CUSTOMER SERVICES
          </span>

          <h1>Donation Request</h1>

          <p>
            Submit a secure donation request through
            your Enterprise Banking account.
          </p>
        </div>

        <Link
          to="/customer"
          className="donation-back-link"
        >
          ← Back to Dashboard
        </Link>
      </section>

      <section className="donation-content">
        <div className="donation-info-card">
          <span className="donation-icon">♥</span>

          <h2>Donation Service</h2>

          <p>
            Complete the form with the donation
            details. Your request can be reviewed
            through the banking approval workflow.
          </p>

          <div className="donation-customer">
            <span>Customer</span>
            <strong>{customerName}</strong>
          </div>
        </div>

        <div className="donation-form-card">
          <div className="donation-form-heading">
            <h2>Request Details</h2>

            <p>
              Enter the information required for
              your donation request.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="donation-form-grid">
              <div className="donation-field">
                <label htmlFor="amount">
                  Donation Amount
                </label>

                <div className="donation-input-wrap">
                  <span>PKR</span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="donation-field">
                <label htmlFor="recipient">
                  Recipient
                </label>

                <input
                  id="recipient"
                  name="recipient"
                  type="text"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder="Recipient name or organization"
                  disabled={loading}
                />
              </div>

              <div className="donation-field donation-full">
                <label htmlFor="purpose">
                  Donation Purpose
                </label>

                <input
                  id="purpose"
                  name="purpose"
                  type="text"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="What is this donation for?"
                  disabled={loading}
                />
              </div>

              <div className="donation-field donation-full">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional information..."
                  rows="5"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div
                className="donation-message donation-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="donation-message donation-success"
                role="status"
              >
                {success}
              </div>
            )}

            <div className="donation-form-actions">
              <Link
                to="/customer"
                className="donation-cancel"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="donation-submit"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : "Submit Donation Request"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default DonationRequest;