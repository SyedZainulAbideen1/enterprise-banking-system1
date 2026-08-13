import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  ShieldCheck,
  User,
  WalletCards,
} from "lucide-react";

import { createWithdrawalRequest } from "../../features/transactions/transactionService";

import "./WithdrawRequest.css";

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

  const customerName =
    profile?.fullName ||
    profile?.name ||
    user?.displayName ||
    user?.email ||
    "Customer";

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

        customerName,

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
    <main className="withdraw-page">
      <div className="withdraw-container">

        <Link
          to="/customer"
          className="withdraw-back-link"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="withdraw-header">
          <div className="withdraw-header-icon">
            <WalletCards size={30} />
          </div>

          <div>
            <span className="withdraw-eyebrow">
              Banking Services
            </span>

            <h1>Withdraw Funds</h1>

            <p>
              Submit a withdrawal request securely
              for employee review and approval.
            </p>
          </div>
        </div>

        <div className="withdraw-grid">

          <section className="withdraw-form-card">

            <div className="withdraw-card-heading">
              <div>
                <h2>Withdrawal Request</h2>

                <p>
                  Provide the details of your
                  withdrawal below.
                </p>
              </div>

              <CircleDollarSign size={24} />
            </div>

            <div className="withdraw-customer-info">
              <div className="withdraw-customer-icon">
                <User size={19} />
              </div>

              <div>
                <span>Account Holder</span>
                <strong>{customerName}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="withdraw-form-field">
                <label htmlFor="withdraw-amount">
                  Withdrawal Amount
                </label>

                <div className="withdraw-input-wrapper">
                  <span>PKR</span>

                  <input
                    id="withdraw-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value
                      )
                    }
                    placeholder="0.00"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="withdraw-form-field">
                <label htmlFor="withdraw-reason">
                  Withdrawal Reason
                </label>

                <input
                  id="withdraw-reason"
                  type="text"
                  value={reason}
                  onChange={(event) =>
                    setReason(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  placeholder="e.g. Personal expenses"
                  required
                />

                <small>
                  Please provide a clear reason for
                  the withdrawal.
                </small>
              </div>

              <div className="withdraw-form-field">
                <label htmlFor="withdraw-description">
                  Description
                  <span>Optional</span>
                </label>

                <textarea
                  id="withdraw-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  placeholder="Add any additional information..."
                  rows={5}
                />
              </div>

              {error && (
                <div
                  className="withdraw-message withdraw-error"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="withdraw-message withdraw-success"
                  role="status"
                >
                  <CheckCircle2 size={20} />

                  <div>
                    <strong>
                      Withdrawal request submitted
                    </strong>

                    <p>
                      Your request is now pending
                      employee approval.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="withdraw-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="withdraw-spinner" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <WalletCards size={19} />
                    Submit Withdrawal Request
                  </>
                )}
              </button>

            </form>
          </section>

          <aside className="withdraw-info-card">

            <div className="withdraw-info-icon">
              <ShieldCheck size={27} />
            </div>

            <h2>
              Secure Withdrawal Process
            </h2>

            <p>
              Every withdrawal request is reviewed
              before it is processed.
            </p>

            <div className="withdraw-process-list">

              <div className="withdraw-process-item">
                <span>01</span>

                <div>
                  <strong>
                    Submit Request
                  </strong>

                  <p>
                    Enter the amount and reason.
                  </p>
                </div>
              </div>

              <div className="withdraw-process-item">
                <span>02</span>

                <div>
                  <strong>
                    Employee Review
                  </strong>

                  <p>
                    An authorized employee reviews
                    your request.
                  </p>
                </div>
              </div>

              <div className="withdraw-process-item">
                <span>03</span>

                <div>
                  <strong>
                    Request Processing
                  </strong>

                  <p>
                    Approved withdrawals are
                    processed securely.
                  </p>
                </div>
              </div>

            </div>

            <div className="withdraw-security-note">
              <ShieldCheck size={18} />

              <span>
                Never share your password or banking
                credentials with anyone.
              </span>
            </div>

          </aside>

        </div>

        <div className="withdraw-footer-note">
          <FileText size={17} />

          <span>
            Withdrawal requests remain pending until
            reviewed by an authorized employee.
          </span>
        </div>

      </div>
    </main>
  );
};

export default WithdrawRequest;