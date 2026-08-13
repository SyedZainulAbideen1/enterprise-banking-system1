import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { createWithdrawalRequest } from "../../features/transactions/transactionService";

const WithdrawRequest = () => {
  const user = useSelector(
    (state) => state.auth.user
  );

  const profile = useSelector(
    (state) => state.auth.profile
  );

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!user?.uid) {
      setError(
        "Customer account could not be identified."
      );
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Withdrawal amount must be greater than zero."
      );
      return;
    }

    if (!reason.trim()) {
      setError(
        "Withdrawal reason is required."
      );
      return;
    }

    setLoading(true);

    try {
      await createWithdrawalRequest({
        customerId: user.uid,

        customerName:
          profile?.fullName ||
          user.displayName ||
          "Customer",

        amount: numericAmount,

        reason: reason.trim(),

        description:
          description.trim(),
      });

      setAmount("");
      setReason("");
      setDescription("");

      setSuccess(
        "Withdrawal request submitted successfully. Your request is now pending employee approval."
      );
    } catch (requestError) {
      console.error(
        "Withdrawal request error:",
        requestError
      );

      setError(
        requestError?.message ||
          "Unable to submit withdrawal request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <h1>Withdrawal Request</h1>

        <p>
          Submit a withdrawal request for
          employee approval.
        </p>

        <Link to="/customer">
          Back to Customer Dashboard
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
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              disabled={loading}
              required
            />
          </div>

          <div>
            <label htmlFor="reason">
              Withdrawal Reason
            </label>

            <input
              id="reason"
              type="text"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
              disabled={loading}
              placeholder="e.g. Personal expenses"
              required
            />
          </div>

          <div>
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={loading}
              placeholder="Optional details"
              rows="4"
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
              ? "Submitting..."
              : "Submit Withdrawal Request"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default WithdrawRequest;