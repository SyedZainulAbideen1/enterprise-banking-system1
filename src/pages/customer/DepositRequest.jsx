import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  clearSubmitSuccess,
  clearTransactionError,
  submitDepositRequest,
} from "../../features/transactions/transactionSlice";

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
    const {
      name,
      value,
    } = event.target;

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

    const amount = Number(
      formData.amount
    );

    if (!formData.amount.trim()) {
      setError(
        "Please enter the deposit amount."
      );

      return;
    }

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
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

        customerName:
          profile?.fullName ||
          profile?.name ||
          user.email ||
          "Customer",

        amount,

        source:
          formData.source,

        description:
          formData.description,
      })
    );

    if (
      submitDepositRequest.fulfilled.match(
        result
      )
    ) {
      setError("");
    }
  };

  return (
    <main>
      <section>
        <h1>Deposit Request</h1>

        <p>
          Submit a request to deposit funds into
          your banking account.
        </p>

        <p>
          <strong>Customer:</strong>{" "}
          {profile?.fullName ||
            profile?.name ||
            user?.email ||
            "Customer"}
        </p>

        <p>
          Your deposit will remain pending until
          it is reviewed by an employee.
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
              min="0.01"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter deposit amount"
              disabled={requestLoading}
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
              disabled={requestLoading}
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
              disabled={requestLoading}
            />
          </div>

          {(error || requestError) && (
            <p role="alert">
              {error || requestError}
            </p>
          )}

          {submitSuccess && (
            <p role="status">
              Deposit request submitted successfully.
              Your request is now pending employee
              approval.
            </p>
          )}

          <button
            type="submit"
            disabled={requestLoading}
          >
            {requestLoading
              ? "Submitting..."
              : "Submit Deposit Request"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default DepositRequest;