import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Landmark,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  clearSubmitSuccess,
  clearTransactionError,
  submitDepositRequest,
} from "../../features/transactions/transactionSlice";

import "./DepositRequest.css";

const DepositRequest = () => {
  const dispatch = useDispatch();

  const { user, profile } = useSelector(
    (state) => state.auth
  );

  const {
    requestLoading,
    requestError,
    submitSuccess,
  } = useSelector(
    (state) => state.transactions
  );

  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    description: "",
  });

  const [error, setError] = useState("");

  const customerName =
    profile?.fullName ||
    profile?.name ||
    user?.email ||
    "Customer";

  useEffect(() => {
    dispatch(clearTransactionError());
    dispatch(clearSubmitSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setFormData({
        amount: "",
        source: "",
        description: "",
      });
    }
  }, [submitSuccess]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");

    if (submitSuccess) {
      dispatch(clearSubmitSuccess());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!user?.uid) {
      setError(
        "You must be logged in to submit a deposit request."
      );
      return;
    }

    const amount = Number(formData.amount);

    if (!formData.amount.trim()) {
      setError("Please enter the deposit amount.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setError(
        "Please enter a valid deposit amount greater than zero."
      );
      return;
    }

    if (!formData.source.trim()) {
      setError(
        "Please enter the source of the deposit."
      );
      return;
    }

    const result = await dispatch(
      submitDepositRequest({
        customerId: user.uid,
        customerName,
        amount,
        source: formData.source,
        description: formData.description,
      })
    );

    if (
      submitDepositRequest.fulfilled.match(result)
    ) {
      setError("");
    }
  };

  return (
    <main className="deposit-page">
      <div className="deposit-container">

        <Link
          to="/customer"
          className="deposit-back-link"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="deposit-header">
          <div className="deposit-header-icon">
            <CircleDollarSign size={30} />
          </div>

          <div>
            <span className="deposit-eyebrow">
              Banking Services
            </span>

            <h1>Deposit Funds</h1>

            <p>
              Submit a deposit request securely for
              employee review and approval.
            </p>
          </div>
        </div>

        <div className="deposit-grid">

          <section className="deposit-form-card">

            <div className="deposit-card-heading">
              <div>
                <h2>Deposit Request</h2>
                <p>
                  Enter the details of your deposit below.
                </p>
              </div>

              <Landmark size={24} />
            </div>

            <div className="customer-info">
              <div className="customer-info-icon">
                <User size={19} />
              </div>

              <div>
                <span>Account Holder</span>
                <strong>{customerName}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-field">
                <label htmlFor="amount">
                  Deposit Amount
                </label>

                <div className="input-wrapper amount-input">
                  <span>PKR</span>

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={requestLoading}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="source">
                  Deposit Source
                </label>

                <input
                  id="source"
                  name="source"
                  type="text"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g. Salary, Cash, Bank Transfer"
                  disabled={requestLoading}
                />

                <small>
                  Tell us where the deposited funds came from.
                </small>
              </div>

              <div className="form-field">
                <label htmlFor="description">
                  Description
                  <span>Optional</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add any additional information..."
                  rows={5}
                  disabled={requestLoading}
                />
              </div>

              {(error || requestError) && (
                <div
                  className="deposit-message error"
                  role="alert"
                >
                  {error || requestError}
                </div>
              )}

              {submitSuccess && (
                <div
                  className="deposit-message success"
                  role="status"
                >
                  <CheckCircle2 size={20} />

                  <div>
                    <strong>
                      Deposit request submitted
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
                className="deposit-submit-button"
                disabled={requestLoading}
              >
                {requestLoading ? (
                  <>
                    <span className="deposit-spinner" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <CircleDollarSign size={19} />
                    Submit Deposit Request
                  </>
                )}
              </button>

            </form>
          </section>

          <aside className="deposit-info-card">

            <div className="info-icon">
              <ShieldCheck size={27} />
            </div>

            <h2>Secure Deposit Process</h2>

            <p>
              Your request is reviewed before funds are
              added to your account.
            </p>

            <div className="process-list">

              <div className="process-item">
                <span>01</span>

                <div>
                  <strong>
                    Submit Request
                  </strong>

                  <p>
                    Enter your deposit details.
                  </p>
                </div>
              </div>

              <div className="process-item">
                <span>02</span>

                <div>
                  <strong>
                    Employee Review
                  </strong>

                  <p>
                    Your request is checked by an
                    authorized employee.
                  </p>
                </div>
              </div>

              <div className="process-item">
                <span>03</span>

                <div>
                  <strong>
                    Account Update
                  </strong>

                  <p>
                    Approved deposits are processed
                    securely.
                  </p>
                </div>
              </div>

            </div>

            <div className="deposit-security-note">
              <ShieldCheck size={18} />

              <span>
                Never share your password or banking
                credentials with anyone.
              </span>
            </div>

          </aside>

        </div>

        <div className="deposit-footer-note">
          <FileText size={17} />

          <span>
            All deposit requests remain pending until
            reviewed by an authorized employee.
          </span>
        </div>

      </div>
    </main>
  );
};

export default DepositRequest;